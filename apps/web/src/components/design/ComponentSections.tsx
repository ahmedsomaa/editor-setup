import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { AppearanceTag, LicenseTag } from "@/components/common/Tag";
import { Reveal } from "@/components/layout/Reveal";
import {
  ComparingVersionsSpot,
  DuplicatingSettingsSpot,
  PickingThemeSpot,
  RecordingSnapshotSpot,
  ReviewingPullRequestSpot,
  SavingDocumentSpot,
  SearchingListSpot,
  type SpotProps,
} from "@/components/home/SpotIcons";
import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site";

export function ButtonsSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="buttons">
      <h2 id="buttons">Buttons</h2>
      <p className="text-muted-foreground mt-6 max-w-[60ch]">
        One ink button per view. The rest are outline or ghost. Labels start
        with a verb.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button>Explore the Presets</Button>
        <Button variant="outline">Add a Preset</Button>
        <Button variant="secondary">Copy Settings</Button>
        <Button variant="ghost">Save PNG</Button>
        <Button variant="link">Read more</Button>
      </div>
    </Reveal>
  );
}

export function TagsSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="tags">
      <h2 id="tags">Tags</h2>
      <p className="text-muted-foreground mt-6 max-w-[60ch]">
        Color is always paired with a word and an icon, never alone.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <LicenseTag license="open" />
        <LicenseTag license="free" />
        <AppearanceTag appearance="dark" />
        <AppearanceTag appearance="light" />
      </div>
    </Reveal>
  );
}

const SPOTS: [string, string, (props: SpotProps) => ReactNode][] = [
  ["Take a look around", "Searching a list", SearchingListSpot],
  ["Can’t pick?", "Comparing two versions", ComparingVersionsSpot],
  ["Found your favorite?", "Duplicating a settings panel", DuplicatingSettingsSpot],
  ["Couldn’t find what you’re looking for?", "Recording a visual snapshot", RecordingSnapshotSpot],
  ["Make the Snapshot", "Picking a theme", PickingThemeSpot],
  ["Add the Preset file", "Saving a document", SavingDocumentSpot],
  ["Open a pull request", "Reviewing a pull request", ReviewingPullRequestSpot],
];

export function IconsSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="icons">
      <h2 id="icons">Spot illustrations</h2>
      <p className="text-muted-foreground mt-6 max-w-[60ch]">
        One style: black line drawings of a person at work. They head a feature
        or a step, never a button or a tag.
      </p>
      <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-4">
        {SPOTS.map(([use, name, Spot]) => (
          <li
            key={use}
            className="border-border bg-card flex flex-col items-start rounded-2xl border p-6"
          >
            <Spot className="size-28" />
            <p className="mt-4 font-medium">{use}</p>
            <p className="text-muted-foreground mt-1 text-sm">{name}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function SourceSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="source">
      <h2 id="source">Source</h2>
      <p className="text-muted-foreground mt-6 max-w-[60ch]">
        Tokens, component guidelines and the full rules live in the repository.
      </p>
      <div className="mt-8">
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a
              href={`${GITHUB_URL}/tree/main/docs/design-system`}
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          Read the design docs
          <ArrowUpRight aria-hidden />
        </Button>
      </div>
    </Reveal>
  );
}
