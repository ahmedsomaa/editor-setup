"use client";

import {
  ClipboardCheckIcon,
  ClipboardIcon,
  SwatchBookIcon,
  TypeIcon,
} from "lucide-react";
import Image from "next/image";
import { Pair } from "editor-setup";
import { useEffect, useState } from "react";

// --------- COMPONENTS ---------
function PairCard({ pair }: { pair: Pair }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => setCopied(false), 1000);
  });

  const copyToClipboard = (font: string, theme: string) => {
    navigator.clipboard.writeText(`{
          "editor.fontFamily": "${font}",
          "workbench.colorTheme": "${theme}"
        }`);
    setCopied((prev) => !prev);
  };

  return (
    <div className="rounded-lg shadow-sm">
      <div className="aspect-[16/9] overflow-hidden rounded-t-lg border-t border-l border-r border-border">
        <Image
          width={640}
          height={360}
          src={pair.image}
          className="object-cover w-full aspect-none"
          alt={`Screenshot of ${pair.font} and ${pair.theme} on visual studio code`}
        />
      </div>
      <div className="p-4 md:p-6 grid gap-2 border-b border-border border-l border-r rounded-b-lg shadow-sm">
        <h2 className="flex flex-col items-start justify-start gap-3 whitespace-nowrap font-bold text-xl">
          {pair.theme.name.split(" ")[0]}
          {pair.font.name.split(" ")[0]}
        </h2>
        <div className="text-muted-foreground">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-start text-justify gap-1">
              <PairItem
                variant="font"
                url={pair.font.url}
                name={pair.font.name}
              />
              <PairItem
                variant="theme"
                url={pair.theme.url}
                name={pair.theme.name}
              />
            </div>
            <button
              onClick={() =>
                copied ? null : copyToClipboard(pair.font.name, pair.theme.name)
              }
            >
              {copied ? (
                <ClipboardCheckIcon className="h-4 w-4" />
              ) : (
                <ClipboardIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PairItemProps {
  url: string;
  name: string;
  variant: "font" | "theme";
}

function PairItem({ url, name, variant }: PairItemProps) {
  return (
    <p className="text-sm flex flex-row items-center gap-2 hover:text-primary transition-all">
      {variant === "font" ? (
        <TypeIcon
          size={16}
          strokeWidth={2}
          className="border rounded bg-transparent p-0.5"
        />
      ) : (
        <SwatchBookIcon
          size={16}
          strokeWidth={2}
          className="border rounded bg-transparent p-0.5"
        />
      )}
      <a href={url} target="_blank" className="whitespace-nowrap">
        {name}
      </a>
    </p>
  );
}

// --------- SKELETON COMPONENTS ---------
function PairCardSkeleton() {
  return (
    <div className="rounded-lg shadow-sm animate-pulse">
      <div className="aspect-[16/9] overflow-hidden rounded-t-lg border-t border-l border-r border-border bg-muted" />
      <div className="p-4 md:p-6 grid gap-2 border-b border-border border-l border-r rounded-b-lg">
        <div className="h-6 bg-muted rounded-md w-32" />
        <div className="text-muted-foreground">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-start text-justify gap-2">
              <PairItemSkeleton />
              <PairItemSkeleton />
            </div>
            <div className="h-4 w-4 bg-muted rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PairItemSkeleton() {
  return (
    <div className="flex flex-row items-center gap-1">
      <div className="h-4 w-4 bg-muted rounded-md" />
      <div className="h-4 w-24 bg-muted rounded-md" />
    </div>
  );
}

// --------- EXPORTED COMPONENTS ---------
export { PairCard, PairCardSkeleton };
