import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { subject?: string } =>
    typeof search['subject'] === "string" ? { subject: search['subject'].slice(0, 150) } : {},
  head: () => ({
    meta: [
      { title: "Contact FlowPilot — Talk to Our Team" },
      {
        name: "description",
        content:
          "Have a question, need a demo or want to talk about an enterprise plan? Send the FlowPilot team a message.",
      },
      { property: "og:title", content: "Contact FlowPilot" },
      { property: "og:description", content: "Let's make work flow better. We reply within one business day." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(120).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const details = [
  { icon: Mail, label: "Email", value: "hello@flowpilot.com" },
  { icon: Phone, label: "Phone", value: "+1 (800) 555-0148" },
  { icon: MapPin, label: "Office", value: "San Francisco, California" },
];

function Contact() {
  const { subject: prefilledSubject } = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
    setSubmitting(false);

    if (error) {
      toast.error("We couldn't send your message. Please try again.");
      return;
    }

    toast.success("Message sent! We'll respond within one business day.");
    form.reset();
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Get in touch"
        title="Let's make work flow better."
        subtitle="Have a question, need a demo or want to talk about an enterprise plan?"
      />

      <section className="container-page grid gap-12 py-20 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">We're here to help.</h2>
          <p className="mt-3 text-muted-foreground">
            Send us a message and our team will respond within one business day.
          </p>
          <div className="mt-8 space-y-4">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-center gap-4">
                <div className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <detail.icon className="size-5" />
                </div>
                <div>
                  <b className="block text-sm">{detail.label}</b>
                  <span className="text-sm text-muted-foreground">{detail.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-7 shadow-lift"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" maxLength={100} required />
            {errors["name"] && <p className="text-xs text-destructive">{errors["name"]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" maxLength={255} required />
            {errors["email"] && <p className="text-xs text-destructive">{errors["email"]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" maxLength={120} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              maxLength={150}
              required
              defaultValue={prefilledSubject ?? ""}
            />
            {errors["subject"] && <p className="text-xs text-destructive">{errors["subject"]}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={6} maxLength={2000} required />
            {errors["message"] && <p className="text-xs text-destructive">{errors["message"]}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Send message"}
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}
