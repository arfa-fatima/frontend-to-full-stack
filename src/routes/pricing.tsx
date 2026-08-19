import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteLayout, PageHero, SectionIntro } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — FlowPilot Plans for Every Team" },
      {
        name: "description",
        content:
          "Start free and upgrade when your team needs more automation. Starter, Growth and Scale plans with monthly or yearly billing.",
      },
      { property: "og:title", content: "FlowPilot Pricing" },
      {
        property: "og:description",
        content: "Simple pricing that grows with you — from $12/month.",
      },
    ],
  }),
  component: Pricing,
});

const plans = [
  {
    name: "Starter",
    monthly: 12,
    yearly: 10,
    text: "For individuals and small teams.",
    features: ["5 active workflows", "1,000 runs/month", "Basic integrations", "Email support"],
    cta: "Start Starter",
    kind: "subscribe" as const,
    popular: false,
  },
  {
    name: "Growth",
    monthly: 39,
    yearly: 31,
    text: "For growing teams and businesses.",
    features: ["Unlimited workflows", "25,000 runs/month", "All integrations", "AI workflow builder"],
    cta: "Start Growth",
    kind: "subscribe" as const,
    popular: true,
  },
  {
    name: "Scale",
    monthly: 99,
    yearly: 79,
    text: "For organizations with advanced needs.",
    features: ["Unlimited runs", "Advanced analytics", "SSO & audit logs", "Priority support"],
    cta: "Talk to Sales",
    kind: "sales" as const,
    popular: false,
  },
];

const faq = [
  {
    q: "Can I try FlowPilot for free?",
    a: "Yes. Start with a free trial and no credit card is required.",
  },
  { q: "Can I change plans later?", a: "Absolutely. Upgrade or downgrade whenever your needs change." },
  {
    q: "Do I need technical knowledge?",
    a: "No. FlowPilot is designed for non-technical teams as well as developers.",
  },
];

function Pricing() {
  const [yearly, setYearly] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [localPlan, setLocalPlan] = useState<string | null>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  const currentPlan = localPlan ?? profile?.subscription_plan ?? null;

  async function subscribe(planName: string) {
    if (!user) {
      toast.error("Please sign in first to choose a plan.");
      void navigate({ to: "/login" });
      return;
    }

    setPendingPlan(planName);
    const { error } = await supabase
      .from("profiles")
      .update({ subscription_plan: planName })
      .eq("id", user.id);
    setPendingPlan(null);

    if (error) {
      toast.error("We couldn't update your plan. Please try again.");
      return;
    }

    setLocalPlan(planName);
    toast.success(`🎉 Successfully subscribed to the ${planName} plan!`);
  }


  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, price")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Simple pricing"
        title="Choose a plan that grows with you."
        subtitle="Start free and upgrade when your team needs more automation."
        center
      >
        <div className="mt-7 inline-flex rounded-full border border-border bg-card p-1 shadow-soft">
          <button
            onClick={() => setYearly(false)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              yearly ? "text-muted-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Yearly <small className="opacity-80">Save 20%</small>
          </button>
        </div>
      </PageHero>

      <section className="container-page py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-7 ${
                plan.popular ? "border-primary shadow-lift" : "border-border shadow-soft"
              }`}
            >
              {plan.popular && (
                <span className="brand-surface absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <span className="text-sm font-semibold text-primary">{plan.name}</span>
              <h2 className="mt-2 font-display text-4xl font-bold">
                ${yearly ? plan.yearly : plan.monthly}
                <small className="text-base font-normal text-muted-foreground">/month</small>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{plan.text}</p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" /> {feature}
                  </li>
                ))}
              </ul>
              {plan.kind === "sales" ? (
                <Button
                  asChild
                  className="mt-7 w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to="/contact" search={{ subject: "Enterprise Scale Plan Inquiry" }}>
                    {plan.cta}
                  </Link>
                </Button>
              ) : (
                <Button
                  className="mt-7 w-full"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={currentPlan === plan.name || pendingPlan === plan.name}
                  onClick={() => void subscribe(plan.name)}
                >
                  {currentPlan === plan.name
                    ? "Current Plan"
                    : pendingPlan === plan.name
                      ? "Subscribing..."
                      : plan.cta}
                </Button>
              )}
            </article>
          ))}
        </div>
      </section>

      {products && products.length > 0 && (
        <section className="container-page pb-20">
          <SectionIntro
            eyebrow="Add-ons"
            title="Products & services"
            subtitle="Managed from the FlowPilot admin dashboard."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="eyebrow">{product.category}</span>
                <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                <p className="mt-2 font-display text-2xl font-bold">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-soft py-20">
        <div className="container-page">
          <SectionIntro eyebrow="FAQ" title="Questions, answered." />
          <div className="mx-auto mt-10 max-w-2xl space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="rounded-xl border border-border bg-card p-5 shadow-soft"
              >
                <summary className="cursor-pointer text-sm font-semibold">{item.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
