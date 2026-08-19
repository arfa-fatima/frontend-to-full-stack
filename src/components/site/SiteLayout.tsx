import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  center = false,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="hero-surface border-b border-border">
      <div className={`container-page py-20 ${center ? "text-center" : ""}`}>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl mx-auto data-[left=true]:mx-0">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground mx-auto data-[left=true]:mx-0">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
