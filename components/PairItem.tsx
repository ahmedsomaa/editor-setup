import { TypeIcon, SwatchBookIcon } from "lucide-react";

interface PairItemProps {
  url: string;
  name: string;
  variant: "font" | "theme";
}

export default function PairItem({ url, name, variant }: PairItemProps) {
  return (
    <p className="text-sm flex flex-row items-center gap-1 hover:text-[#007ACC] transition-all">
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
