import { ArrowUpRight } from "lucide-react";
import { cn } from "cn";
import { AppearanceTag, LicenseTag } from "@/components/common/Tag";
import type { Appearance, License } from "@/lib/registry/pairs";

export function PairDetail({
  title,
  name,
  license,
  links,
  appearance,
  className,
}: {
  title: string;
  name: string;
  license: License;
  links: string[];
  appearance?: Appearance;
  className?: string;
}) {
  const realLinks = links.filter((href) => href && href !== "#");

  return (
    <div className={cn("py-8", className)}>
      <h3 className="text-muted-foreground font-sans text-sm font-normal tracking-normal">
        {title}
      </h3>
      <p className="font-heading mt-2 text-3xl tracking-[-0.02em]">{name}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <LicenseTag license={license} />
        {appearance ? <AppearanceTag appearance={appearance} /> : null}
      </div>
      {realLinks.length > 0 ? (
        <ul className="mt-5 flex list-none flex-col gap-2 p-0">
          {realLinks.map((href) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-foreground inline-flex min-h-6 max-w-full items-center gap-1.5 text-sm underline hover:no-underline"
              >
                <span className="break-all">{linkLabel(href)}</span>
                <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function linkLabel(href: string): string {
  try {
    const url = new URL(href);
    const item = url.searchParams.get("itemName");
    return item
      ? `${url.hostname.replace(/^www\./, "")} · ${item}`
      : url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/$/, "");
  } catch {
    return href;
  }
}
