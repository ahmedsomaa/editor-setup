import { Link } from "@tanstack/react-router";
import { GitHubStars } from "@/components/GitHubStars";
import { Mark } from "@/components/Mark";

const NAV = [
  { to: "/registry", label: "Registry" },
  { to: "/compare", label: "Compare" },
  { to: "/studio", label: "Snapshot Studio" },
  { to: "/about", label: "About" },
] as const;

export default function Header() {
  return (
    <header className="site-header border-border bg-background/90 sticky top-0 z-40 border-b backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:grid-cols-[1fr_auto_1fr]"
      >
        <div className="flex min-w-0 items-center">
          <Link
            to="/"
            className="text-foreground inline-flex items-center gap-2.5 text-lg font-medium tracking-tighter no-underline"
          >
            <Mark className="size-6" />
            EditorSetup
          </Link>
        </div>
        <ul className="hidden list-none items-center justify-center gap-1 p-0 sm:flex">
          {NAV.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="text-muted-foreground hover:text-foreground inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium no-underline transition-colors"
                activeProps={{
                  className: "bg-muted text-accent-text hover:text-accent-text",
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-end">
          <GitHubStars />
        </div>
      </nav>
      <ul className="border-border mx-auto flex max-w-6xl list-none gap-1 overflow-x-auto border-t px-4 py-2 p-0 sm:hidden">
        {NAV.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className="text-muted-foreground hover:text-foreground inline-flex h-9 items-center rounded-full px-3 text-sm font-medium no-underline"
              activeProps={{
                className: "bg-muted text-accent-text hover:text-accent-text",
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
