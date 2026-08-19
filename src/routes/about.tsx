import { createFileRoute } from "@tanstack/react-router";
import { Heart, Rocket, UsersRound, Zap } from "lucide-react";
import { SiteLayout, PageHero, SectionIntro } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About FlowPilot — Our Story and Mission" },
      {
        name: "description",
        content:
          "FlowPilot exists to remove repetitive work so teams can spend more time solving meaningful problems.",
      },
      { property: "og:title", content: "About FlowPilot" },
      {
        property: "og:description",
        content: "Meet the team making automation accessible to every team.",
      },
    ],
  }),
  component: About,
});

const values = [
  { icon: Zap, title: "Move with purpose", text: "We simplify first, then scale." },
  { icon: UsersRound, title: "Build together", text: "The best ideas come from collaboration." },
  { icon: Heart, title: "Care deeply", text: "We obsess over customer outcomes." },
];

const team = [
  {
    initials: "MC",
    name: "Maya Chen",
    role: "Founder & CEO",
    text: "Product leader passionate about simple software.",
  },
  {
    initials: "DB",
    name: "Daniel Brooks",
    role: "CTO",
    text: "Builds reliable systems for growing teams.",
  },
  {
    initials: "SM",
    name: "Sofia Malik",
    role: "Head of Design",
    text: "Turns complex workflows into calm experiences.",
  },
  {
    initials: "ER",
    name: "Ethan Reed",
    role: "Product Lead",
    text: "Helps customers turn ideas into automations.",
  },
];

function About() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="About FlowPilot"
        title="We believe work should feel more human."
        subtitle="FlowPilot exists to remove repetitive work so teams can spend more time solving meaningful problems."
      />

      <section className="container-page grid gap-10 py-20 md:grid-cols-2 md:items-center">
        <div>
          <span className="eyebrow">Our story</span>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Built from a simple frustration.</h2>
          <p className="mt-4 text-muted-foreground">
            Our founders watched talented teams spend hours moving information between tools, chasing
            approvals and copying data. FlowPilot was created to make that work disappear.
          </p>
          <p className="mt-3 text-muted-foreground">
            Today, thousands of teams use FlowPilot to connect their tools, automate processes and
            understand how work gets done.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lift">
          <Rocket className="size-8 text-primary" />
          <h3 className="mt-4 text-xl font-semibold">Our mission</h3>
          <p className="mt-2 text-muted-foreground">
            Make automation accessible to every team, regardless of technical skill.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
            {[
              { value: "2K+", label: "Teams" },
              { value: "48M", label: "Tasks automated" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label}>
                <b className="block font-display text-2xl">{stat.value}</b>
                <small className="text-xs text-muted-foreground">{stat.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-soft py-20">
        <div className="container-page">
          <SectionIntro eyebrow="What guides us" title="Our values." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-2xl border border-border bg-card p-7 shadow-soft"
              >
                <value.icon className="size-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                <p className="mt-1 text-muted-foreground">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionIntro eyebrow="Meet the team" title="The people behind FlowPilot." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <article
              key={member.name}
              className="rounded-2xl border border-border bg-card p-7 text-center shadow-soft"
            >
              <div className="brand-surface mx-auto grid size-14 place-items-center rounded-full font-bold text-primary-foreground">
                {member.initials}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
              <span className="text-sm text-primary">{member.role}</span>
              <p className="mt-2 text-sm text-muted-foreground">{member.text}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
