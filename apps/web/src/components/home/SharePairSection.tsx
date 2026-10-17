import { Link } from "@tanstack/react-router";
import { ArrowRight, Camera, FileText, GitPullRequest } from "lucide-react";
import { SECTION } from "@/components/home/section-styles";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { CONTRIBUTE_URL } from "@/lib/site";

/** Last ask before the footer: the Pair file is the whole submission, so show one. */
export function SharePairSection() {
  const steps = [
    {
      icon: Camera,
      title: "Make the Snapshot",
      body: "Try your Font and Theme on your own code in Snapshot Studio, then save a 1600×900 image.",
    },
    {
      icon: FileText,
      title: "Add the Pair file",
      body: "One JSON file with the Font, the Theme and the Settings, next to your Snapshot in the Registry.",
    },
    {
      icon: GitPullRequest,
      title: "Open a pull request",
      body: "Send both files on GitHub. Once it is merged, your Pair is in the Registry for everyone.",
    },
  ];

  return (
    <section className={SECTION} aria-labelledby="share">
      <div className="mx-auto max-w-6xl">
        <h2 id="share" className="max-w-md">
          Share your Pair.
        </h2>
        <p className="text-muted-foreground mt-4 max-w-[48ch]">
          Three steps, no account. Everything happens in a pull request.
        </p>
        <ol className="m-0 mt-12 grid list-none gap-4 p-0 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <Reveal
              as="li"
              index={i}
              key={title}
              className="group border-border bg-card relative isolate flex flex-col overflow-hidden rounded-2xl border p-6 sm:p-8"
            >
              <svg
                aria-hidden
                viewBox="0 0 64 100"
                className="text-foreground/[0.07] group-hover:text-accent-text/25 pointer-events-none absolute inset-y-0 end-2 -z-10 h-full w-auto transition-colors duration-200 ease-out"
              >
                <text
                  x="64"
                  y="90"
                  textAnchor="end"
                  fontSize="120"
                  fill="currentColor"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {i + 1}
                </text>
              </svg>
              <Icon aria-hidden className="size-8" />
              <h3 className="mt-8">{title}</h3>
              <p className="text-muted-foreground mt-3">{body}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" nativeButton={false} render={<Link to="/studio" />}>
            Open Snapshot Studio
            <ArrowRight aria-hidden />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={
              <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />
            }
          >
            Read the contribution guide
          </Button>
        </div>
      </div>
    </section>
  );
}
