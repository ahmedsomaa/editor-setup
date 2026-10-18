import { ArrowUpRight } from "lucide-react";
import { LicenseTag } from "@/components/common/Tag";
import { TermList } from "@/components/common/TermList";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { ADD_PRESET_URL, GITHUB_URL } from "@/lib/site";

const TERMS = [
  [
    "Preset",
    "One Font with one Theme. Each Preset is one JSON file in the repository.",
  ],
  [
    "Config",
    "The Settings for one Preset in one Editor, as plain text with no color overrides.",
  ],
  [
    "Snapshot",
    "One 16:9 image of a Preset, showing its Font and Theme together.",
  ],
  [
    "Presets",
    "The page that lists every Preset whose file is on main with a Snapshot and at least one Config.",
  ],
] as const;

export function TermsSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="terms">
      <h2 id="terms">Words we use</h2>
      <TermList terms={TERMS} />
    </Reveal>
  );
}

export function LicensesSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="licenses">
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
      </dl>
    </Reveal>
  );
}

export function AddPresetSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="add">
      <h2 id="add">Add a Preset</h2>
      <p className="text-muted-foreground mt-6 max-w-[60ch]">
        Open a pull request with a Preset file and its Snapshot. Make the Snapshot
        in Preset Studio, using an Open or Free Font and Theme. The
        guide to adding a Preset lists the fields and the image size.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          nativeButton={false}
          render={<a href={ADD_PRESET_URL} target="_blank" rel="noreferrer" />}
        >
          Read the guide to adding a Preset
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
    </Reveal>
  );
}

const CREDITS = [
  ["TanStack Start", "https://tanstack.com/start"],
  ["Fontsource", "https://fontsource.org"],
  ["Lucide", "https://lucide.dev"],
  ["Shiki", "https://shiki.style"],
] as const;

const CREDIT_LINK =
  "text-foreground decoration-foreground/30 hover:decoration-foreground underline underline-offset-4 transition-colors";

export function CreditsSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="credits">
      <h2 id="credits">Credits</h2>
      <p className="text-muted-foreground mt-6 max-w-[60ch]">
        Built with{" "}
        {CREDITS.map(([name, href], i) => (
          <span key={name}>
            {i > 0 ? (i === CREDITS.length - 1 ? " and " : ", ") : ""}
            <a href={href} target="_blank" rel="noreferrer" className={CREDIT_LINK}>
              {name}
            </a>
          </span>
        ))}
        . Illustrations from{" "}
        <a href="https://koboyo.com/icons" target="_blank" rel="noreferrer" className={CREDIT_LINK}>
          Koboyo
        </a>
        .
      </p>
    </Reveal>
  );
}
