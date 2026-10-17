import { Reveal } from "@/components/layout/Reveal";
import { ENTRIES } from "@/lib/changelog";

/** One row per release, newest first. */
export function ChangelogList() {
  return (
    <ol className="border-border mt-16 list-none border-t p-0">
      {ENTRIES.map((entry) => (
        <Reveal
          as="li"
          key={`${entry.date}-${entry.title}`}
          className="border-border grid gap-2 border-b py-8 sm:grid-cols-[10rem_1fr] sm:gap-8"
        >
          <time
            dateTime={entry.date}
            className="text-muted-foreground font-mono text-sm"
          >
            {entry.date}
          </time>
          <div>
            <h2 className="text-3xl md:text-3xl">{entry.title}</h2>
            <ul className="text-muted-foreground mt-4 max-w-[60ch] list-disc space-y-1 ps-5">
              {entry.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
