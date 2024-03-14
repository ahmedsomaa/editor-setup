import Image from "next/image";
import { Pair } from "@/pages/api/pairs";
import { ArrowUpRightIcon, SwatchBookIcon, TypeIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card";

interface PairCardProps {
  pair: Pair;
}

export default function PairCard({ pair }: PairCardProps) {
  return (
    <Card className="max-w-2xl">
      <div className="aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          width={400}
          height={300}
          src={pair.image}
          className="object-cover w-full aspect-none"
          alt={`Screenshot of ${pair.font} and ${pair.theme} on visual studio code`}
        />
      </div>
      <CardContent className="p-4 md:p-6 grid gap-2">
        <CardTitle className="flex flex-col items-start justify-start gap-3 whitespace-nowrap">
          <p className="text-sm flex flex-row items-center gap-2 hover:text-zinc-500 transition-all">
            <TypeIcon
              size={16}
              className="border rounded bg-transparent p-0.5"
              strokeWidth={2}
            />
            <a href={pair.font.url} target="_blank">
              {pair.font.name}
            </a>
          </p>
          <p className="text-sm flex flex-row items-center gap-2 hover:text-zinc-500 transition-all">
            <SwatchBookIcon
              size={16}
              strokeWidth={2}
              className="border rounded bg-transparent p-0.5"
            />
            <a href={pair.theme.url} target="_blank">
              {pair.theme.name}
            </a>
          </p>
        </CardTitle>
      </CardContent>
    </Card>
  );
}
