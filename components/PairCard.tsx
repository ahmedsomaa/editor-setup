import Image from "next/image";
import { useState } from "react";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";

import PairItem from "./PairItem";
import { Pair } from "@/models/pair";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

interface PairCardProps {
  pair: Pair;
}

export default function PairCard({ pair }: PairCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (font: string, theme: string) => {
    navigator.clipboard.writeText(`{
      "editor.fontFamily": ${font},
      "workbench.colorTheme": ${theme}
      }`);
    setCopied((prev) => !prev);
  };

  return (
    <Card className="max-w-2xl">
      <div className="aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          width={640}
          height={360}
          src={pair.image}
          className="object-cover w-full aspect-none"
          alt={`Screenshot of ${pair.font} and ${pair.theme} on visual studio code`}
        />
      </div>
      <CardContent className="p-4 md:p-6 grid gap-2">
        <CardTitle className="flex flex-col items-start justify-start gap-3 whitespace-nowrap">
          {pair.theme.name.split(" ")[0]}
          {pair.font.name.split(" ")[0]}
        </CardTitle>
        <CardDescription>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
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
            <Button
              size="icon"
              variant="outline"
              onClick={() =>
                copied ? null : copyToClipboard(pair.font.name, pair.theme.name)
              }
            >
              {copied ? (
                <ClipboardCheckIcon className="h-4 w-4" />
              ) : (
                <ClipboardIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
