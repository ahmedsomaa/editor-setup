import { SECTION } from "@/components/home/section-styles";
import { Reveal } from "@/components/layout/Reveal";
import { LicenseTag } from "@/components/common/Tag";
import type { License } from "@/lib/registry/pairs";
import { cn } from "cn";

const LICENSES: Array<{ license: License; title: string; body: string }> = [
  {
    license: "open",
    title: "Use it anywhere",
    body: "An open license such as OFL or MIT. Free to use and to embed. Snapshot Studio can show it live.",
  },
  {
    license: "free",
    title: "Free, with limits",
    body: "No cost, but restricted, for example to private use. Read its terms before you use it for work.",
  },
];

/** The two Licenses, in plain words. A Pair shows the strictest of its Font and Theme. */
export function LicenseSection() {
  return (
    <section className={cn(SECTION, "bg-muted/40")} aria-labelledby="license">
      <div className="mx-auto max-w-6xl">
        <h2 id="license" className="max-w-xl">
          Know what you can use.
        </h2>
        <p className="text-muted-foreground mt-4 max-w-[52ch] text-lg">
          Each Font and each Theme has its own License. A Pair shows the
          strictest of the two.
        </p>
        <ul className="border-border m-0 mt-14 grid list-none divide-y p-0 md:grid-cols-2 md:divide-x md:divide-y-0 border-y">
          {LICENSES.map(({ license, title, body }) => (
            <Reveal
              as="li"
              index={LICENSES.findIndex((l) => l.license === license)}
              key={license}
              className="px-0 py-8 md:px-8 md:first:ps-0 md:last:pe-0"
            >
              <LicenseTag license={license} />
              <h3 className="mt-5">{title}</h3>
              <p className="text-muted-foreground mt-3 max-w-[40ch]">{body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
