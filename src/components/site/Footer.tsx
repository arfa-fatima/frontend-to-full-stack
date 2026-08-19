import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-soft">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-base font-bold">
            <span className="brand-surface grid size-8 place-items-center rounded-lg text-xs font-bold text-primary-foreground">
              FP
            </span>
            FlowPilot
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            AI-powered workflow automation that gives your team time back for meaningful work.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/features" className="hover:text-foreground">
                Features
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-foreground">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-foreground">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Get started</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/signup" className="hover:text-foreground">
                Create account
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-foreground">
                Login
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">hello@flowpilot.com</p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FlowPilot. All rights reserved.
      </div>
    </footer>
  );
}
