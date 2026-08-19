import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Plug, ShieldHalf } from "lucide-react";
import { SiteLayout, PageHero, SectionIntro } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — FlowPilot Workflow Automation" },
      {
        name: "description",
        content:
          "Visual workflow builder, AI assistant and analytics: the building blocks to automate work without writing code.",
      },
      { property: "og:title", content: "FlowPilot Features" },
      {
        property: "og:description",
        content: "Automation that works the way your team does — builder, AI and analytics.",
      },
    ],
  }),
  component: Features,
});

const rows = [
  {
    number: "01",
    eyebrow: "Workflow builder",
    title: "Visual automation without code.",
    text: "Connect triggers, conditions and actions with a drag-and-drop workflow builder.",
    checks: ["Drag-and-drop builder", "Conditional logic", "Reusable templates"],
    card: (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lift">
        <div className="text-sm font-semibold">Customer onboarding</div>
        <div className="mt-4 space-y-2 text-sm">
          {["New signup →", "Check plan →", "Assign owner ✓"].map((step) => (
            <div key={step} className="rounded-lg bg-secondary px-3 py-2.5">
              {step}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "02",
    eyebrow: "AI assistant",
    title: "Describe it. FlowPilot builds it.",
    text: "Tell the AI what you want to automate in plain language and get an editable workflow.",
    checks: [
      "Natural-language workflow creation",
      "Smart recommendations",
      "AI-powered optimization",
    ],
    card: (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lift">
        <p className="text-sm text-muted-foreground">
          “When a new customer signs up, notify Slack and create an onboarding task.”
        </p>
        <div className="brand-surface mt-4 rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground">
          Build workflow
        </div>
      </div>
    ),
  },
  {
    number: "03",
    eyebrow: "Analytics",
    title: "Know what your workflows are doing.",
    text: "Monitor runs, errors, completion rates and time saved from one dashboard.",
    checks: ["Real-time monitoring", "Custom reports", "Performance alerts"],
    card: (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lift">
        <div className="flex items-center gap-2 text-sm font-semibold">
          Live status
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">
            Healthy
          </span>
        </div>
        <div className="mt-4 flex h-24 items-end gap-1.5">
          {[45, 65, 52, 78, 68, 92, 82].map((height, index) => (
            <i
              key={index}
              className="brand-surface w-full rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-secondary p-3">
            <b className="block">98.7%</b>
            <small className="text-muted-foreground">Success rate</small>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <b className="block">12.4k</b>
            <small className="text-muted-foreground">Executions</small>
          </div>
        </div>
      </div>
    ),
  },
];

const simple = [
  {
    icon: Plug,
    title: "Integrations",
    text: "Connect Slack, Google, Notion, HubSpot and more.",
  },
  {
    icon: ShieldHalf,
    title: "Security",
    text: "Role-based access, audit logs and secure workflows.",
  },
  { icon: Bell, title: "Notifications", text: "Keep the right people informed at the right time." },
];

function Features() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Powerful by design"
        title="Automation that works the way your team does."
        subtitle="From simple tasks to complex workflows, FlowPilot gives you the building blocks to automate work without writing code."
      />

      <section className="container-page space-y-20 py-20">
        {rows.map((row, index) => (
          <article
            key={row.number}
            className={`grid gap-10 md:grid-cols-2 md:items-center ${
              index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <div className="font-display text-5xl font-bold text-accent-foreground/30">
                {row.number}
              </div>
              <span className="eyebrow mt-4 block">{row.eyebrow}</span>
              <h2 className="mt-2 text-3xl font-bold">{row.title}</h2>
              <p className="mt-3 text-muted-foreground">{row.text}</p>
              <ul className="mt-5 space-y-2">
                {row.checks.map((check) => (
                  <li key={check} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" /> {check}
                  </li>
                ))}
              </ul>
            </div>
            {row.card}
          </article>
        ))}
      </section>

      <section className="bg-soft py-20">
        <div className="container-page">
          <SectionIntro
            eyebrow="Built for modern teams"
            title="Everything you need to automate confidently."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {simple.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-7 shadow-soft"
              >
                <item.icon className="size-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
