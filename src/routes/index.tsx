import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  ChartNoAxesColumn,
  CircleCheck,
  Inbox,
  Play,
  Sparkles,
  UserPlus,
  Users,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout, SectionIntro } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowPilot — AI Workflow Automation for Modern Teams" },
      {
        name: "description",
        content:
          "FlowPilot connects your tools, automates repetitive tasks and gives your team more time for meaningful work.",
      },
      { property: "og:title", content: "FlowPilot — AI Workflow Automation" },
      {
        property: "og:description",
        content: "Automate work without code. Build, monitor and scale workflows with FlowPilot.",
      },
    ],
  }),
  component: Home,
});

const flow = [
  { icon: UserPlus, title: "New customer", tag: "Trigger" },
  { icon: Bot, title: "AI analyzes", tag: "Decision" },
  { icon: Users, title: "Assign team", tag: "Action" },
  { icon: CircleCheck, title: "Task done", tag: "Result" },
];

const steps = [
  { n: "01", title: "Connect", text: "Connect the tools your team already uses." },
  { n: "02", title: "Build", text: "Create automated workflows in a few clicks." },
  { n: "03", title: "Grow", text: "Save time and scale your operations." },
];

const integrations = ["Slack", "Google", "Notion", "HubSpot", "Trello", "Teams", "Stripe", "GitHub"];

const testimonials = [
  {
    quote:
      "FlowPilot replaced three manual processes in our onboarding workflow. Our team got hours back every week.",
    name: "Maya Chen",
    role: "COO, Northstar",
    initials: "MC",
  },
  {
    quote:
      "The AI workflow builder is incredibly intuitive. We went from idea to a working automation in minutes.",
    name: "Daniel Reed",
    role: "Founder, Launchly",
    initials: "DR",
  },
  {
    quote: "We finally have one place to see what is happening across our operations.",
    name: "Sofia Khan",
    role: "Operations, Vertex",
    initials: "SK",
  },
];

function Home() {
  return (
    <SiteLayout>
      <section className="hero-surface border-b border-border">
        <div className="container-page py-20 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
            <Sparkles className="size-3.5 text-primary" /> AI-powered workflow automation
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] md:text-6xl">
            Make work flow.
            <br />
            <em className="text-primary not-italic">Not pile up.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            FlowPilot connects your tools, automates repetitive tasks and gives your team more time
            for meaningful work.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">
                Start Free <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/features">
                <Play className="size-4" /> Explore Platform
              </Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Trusted by <b className="text-foreground">2,000+</b> modern teams
          </p>

          <div className="mt-14 rounded-2xl border border-border bg-card p-5 text-left shadow-lift">
            <div className="flex items-center justify-between text-xs font-semibold tracking-widest text-muted-foreground">
              <span>LIVE WORKFLOW</span>
              <span className="flex items-center gap-2 text-success">
                <i className="size-2 rounded-full bg-success" /> Running
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {flow.map((node, index) => (
                <div
                  key={node.title}
                  className={`rounded-xl border p-4 ${
                    index === 1
                      ? "border-primary/40 bg-accent"
                      : index === 3
                        ? "border-success/40 bg-success/10"
                        : "border-border bg-background"
                  }`}
                >
                  <node.icon className="size-5 text-primary" />
                  <b className="mt-2 block text-sm">{node.title}</b>
                  <small className="text-xs text-muted-foreground">{node.tag}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionIntro
          eyebrow="One workspace"
          title="Everything your team needs to automate."
          subtitle="Build, manage and measure workflows without switching between a dozen different tools."
          center={false}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-7 shadow-soft md:col-span-2">
            <div className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Workflow className="size-5" />
            </div>
            <span className="mt-4 block text-xs font-bold tracking-widest text-muted-foreground">
              WORKFLOW BUILDER
            </span>
            <h3 className="mt-2 text-xl font-semibold">Build powerful workflows without code.</h3>
            <p className="mt-2 text-muted-foreground">
              Connect triggers, decisions and actions with a visual builder anyone can understand.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-md bg-secondary px-3 py-1.5">Trigger</span>→
              <span className="rounded-md bg-secondary px-3 py-1.5">AI</span>→
              <span className="rounded-md bg-secondary px-3 py-1.5">Action</span>
            </div>
          </article>
          <article className="rounded-2xl border border-border bg-card p-7 shadow-soft">
            <div className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Bot className="size-5" />
            </div>
            <span className="mt-4 block text-xs font-bold tracking-widest text-muted-foreground">
              AI ASSISTANT
            </span>
            <h3 className="mt-2 text-xl font-semibold">Let AI handle repetitive work.</h3>
            <p className="mt-2 text-muted-foreground">
              Describe what you want to automate and FlowPilot builds the workflow for you.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-7 shadow-soft">
            <div className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Inbox className="size-5" />
            </div>
            <span className="mt-4 block text-xs font-bold tracking-widest text-muted-foreground">
              TEAM INBOX
            </span>
            <h3 className="mt-2 text-xl font-semibold">One place for every task.</h3>
            <p className="mt-2 text-muted-foreground">
              Keep requests, alerts and approvals organized.
            </p>
          </article>
          <article className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-7 shadow-soft md:col-span-2 md:flex-row md:items-end">
            <div>
              <div className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <ChartNoAxesColumn className="size-5" />
              </div>
              <span className="mt-4 block text-xs font-bold tracking-widest text-muted-foreground">
                ANALYTICS
              </span>
              <h3 className="mt-2 text-xl font-semibold">
                Know what your automations are doing.
              </h3>
              <p className="mt-2 text-muted-foreground">
                Track runs, success rates and time saved with simple dashboards.
              </p>
            </div>
            <div className="rounded-xl bg-ink p-5 text-ink-foreground">
              <small className="text-xs tracking-widest text-ink-muted">
                TIME SAVED THIS MONTH
              </small>
              <strong className="mt-1 block text-3xl">1,284 hrs</strong>
              <span className="text-sm text-success">↑ 24.8%</span>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-ink py-20 text-ink-foreground">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="eyebrow">Your command center</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              See your business move in real time.
            </h2>
            <p className="mt-3 text-ink-muted">
              Monitor workflows, tasks and performance from one clean dashboard.
            </p>
          </div>
          <div className="mt-10 grid gap-6 rounded-2xl border border-ink-border bg-white/5 p-6 md:grid-cols-3">
            {[
              { label: "ACTIVE WORKFLOWS", value: "48", delta: "+12%" },
              { label: "TASKS COMPLETED", value: "12,840", delta: "+28%" },
              { label: "SUCCESS RATE", value: "98.7%", delta: "+1.4%" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-ink-border p-5">
                <small className="text-xs tracking-widest text-ink-muted">{stat.label}</small>
                <b className="mt-1 block text-3xl font-semibold">{stat.value}</b>
                <em className="text-sm not-italic text-success">{stat.delta}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <span className="font-display text-3xl font-bold text-primary">{step.n}</span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-soft py-20">
        <div className="container-page">
          <SectionIntro eyebrow="Integrations" title="Connect everything you use." />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {integrations.map((name) => (
              <div
                key={name}
                className="rounded-xl border border-border bg-card px-4 py-4 text-center text-sm font-medium shadow-soft"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionIntro eyebrow="Customer stories" title="Teams get their time back." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-border bg-card p-7 shadow-soft"
            >
              <div className="text-primary">★★★★★</div>
              <p className="mt-3 text-muted-foreground">“{item.quote}”</p>
              <footer className="mt-5 flex items-center gap-3">
                <div className="brand-surface grid size-10 place-items-center rounded-full text-sm font-bold text-primary-foreground">
                  {item.initials}
                </div>
                <div>
                  <b className="block text-sm">{item.name}</b>
                  <small className="text-xs text-muted-foreground">{item.role}</small>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="brand-surface rounded-3xl px-8 py-14 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to make work flow?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Start free today. No credit card required.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-7">
            <Link to="/signup">
              Start Free <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
