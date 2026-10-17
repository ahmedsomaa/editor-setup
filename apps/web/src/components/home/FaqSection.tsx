const FAQS = [
  {
    q: "What is EditorSetup?",
    a: "A list of Font and Theme Pairs from real editor setups. Each Pair has Settings you can copy and a Snapshot of how it looks.",
  },
  {
    q: "Do I need an account?",
    a: "No. Browse the Registry, open a Pair and copy its Settings. Adding a Pair is a pull request on GitHub.",
  },
  {
    q: "Which Editors are supported?",
    a: "VS Code and Zed for now. A Pair can have a Config for one or both.",
  },
  {
    q: "Is it free?",
    a: "The site is free. Each Font and Theme has its own License, shown on every Pair as Open or Free.",
  },
  {
    q: "How do I add a Pair?",
    a: "Open a pull request with a Pair file and its Snapshot. Make the Snapshot in Snapshot Studio, or with the snapshot-studio skill in Claude Code. There is no form on the site.",
  },
] as const;

export function FaqSection() {
  return (
    <section
      className="border-border border-t px-4 py-24 sm:py-32"
      aria-labelledby="faq"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
        <div>
          <h2 id="faq">Questions</h2>
          <p className="text-muted-foreground mt-4 text-sm">
            Something else? Write to{" "}
            <a
              href="mailto:abokahfa@gmail.com"
              className="text-foreground underline hover:no-underline"
            >
              abokahfa@gmail.com
            </a>
            .
          </p>
        </div>
        <div>
          <ul className="faq border-border m-0 list-none border-t p-0">
            {FAQS.map(({ q, a }) => (
              <li key={q} className="border-border border-b">
                <details className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                    {q}
                    <span
                      aria-hidden
                      className="text-muted-foreground relative size-4 shrink-0"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                      <span className="faq-bar absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
                    </span>
                  </summary>
                  <p className="text-muted-foreground max-w-[60ch] pb-5">{a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
