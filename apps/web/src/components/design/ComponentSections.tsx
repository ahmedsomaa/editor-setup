import { ArrowUpRight } from "lucide-react";
import { AppearanceTag, LicenseTag } from "@/components/common/Tag";
import { Reveal } from "@/components/layout/Reveal";
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
        <Button>Explore the Registry</Button>
        <Button variant="outline">Add a Pair</Button>
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
