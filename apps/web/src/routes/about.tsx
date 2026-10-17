import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PageHero } from "@/components/PagePattern";
import { LicenseTag } from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { CONTRIBUTE_URL, GITHUB_URL } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About · EditorSetup" }] }),
  component: About,
});

const TERMS = [
  [
    "Pair",
    "One Font with one Theme. Each Pair is one JSON file in the repository.",
  ],
  [
    "Config",
    "The Settings for one Pair in one Editor, as plain text with no color overrides.",
  ],
  [
    "Snapshot",
    "One 16:9 image of a Pair, showing its Font and Theme together.",
  ],
  [
    "Registry",
    "Every Pair whose file is on main with a Snapshot and at least one Config.",
  ],
] as const;

function About() {
  return (
    <main id="main">
      <PageHero variant="about" className="pb-4 sm:pb-6">
        <h1>About</h1>
        <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
          EditorSetup is a list of Font and Theme Pairs for code editors.
          Everything lives in a Git repository, so the history is the record of
          who added what.
        </p>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <section className="mt-20" aria-labelledby="terms">
          <h2 id="terms">Words we use</h2>
          <dl className="border-border mt-8 border-t">
            {TERMS.map(([term, text]) => (
              <div
                key={term}
                className="border-border grid gap-1 border-b py-5 sm:grid-cols-[10rem_1fr] sm:gap-8"
              >
                <dt className="font-medium">{term}</dt>
                <dd className="text-muted-foreground max-w-[60ch]">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-20" aria-labelledby="licenses">
          <h2 id="licenses">Licenses</h2>
          <p className="text-muted-foreground mt-6 max-w-[60ch]">
            Every Font and Theme lists the terms it is available under.
          </p>
          <dl className="border-border mt-8 border-t">
            <div className="border-border grid items-start gap-2 border-b py-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <dt>
                <LicenseTag license="open" />
              </dt>
              <dd className="text-muted-foreground max-w-[60ch]">
                An open license such as OFL or MIT. Free to use and embed.
              </dd>
            </div>
            <div className="border-border grid items-start gap-2 border-b py-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <dt>
                <LicenseTag license="free" />
              </dt>
              <dd className="text-muted-foreground max-w-[60ch]">
                No cost, with limits such as private use only.
              </dd>
            </div>
            <div className="border-border grid items-start gap-2 border-b py-5 sm:grid-cols-[10rem_1fr] sm:gap-8">
              <dt>
                <LicenseTag license="paid" />
              </dt>
              <dd className="text-muted-foreground max-w-[60ch]">
                Never rendered on the site. A developer who owns the license can
                add a Snapshot of it.
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-20" aria-labelledby="add">
          <h2 id="add">Add a Pair</h2>
          <p className="text-muted-foreground mt-6 max-w-[60ch]">
            Open a pull request with a Pair file and its Snapshot. Make the
            Snapshot in Snapshot Studio, using an Open or Free Font and Theme.
            The contribution guide lists the fields and the image size.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={
                <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />
              }
            >
              Read the contribution guide
              <ArrowUpRight aria-hidden />
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<a href={GITHUB_URL} target="_blank" rel="noreferrer" />}
            >
              View the repository
              <ArrowUpRight aria-hidden />
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
