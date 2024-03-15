import Link from "next/link";
import { PencilRulerIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  color?: string;
}

export default function Logo({ color }: LogoProps) {
  return (
    <Link href="/">
      <div className="flex flex-row space-x-2 items-center justify-center">
        <PencilRulerIcon size={30} className={color} />
        <span className={cn("font-medium text-lg text-white", color)}>
          EditorSetup
        </span>
      </div>
    </Link>
  );
}
