import { ArtPlayer } from "@/components/ArtPlayer";
import { EditorArt, type Colors } from "@/components/EditorArt";

/**
 * Decorative Compare: two editor windows in two Themes overlap, and each takes its turn in front,
 * the way you flip between two options to weigh them.
 */
export function CompareArt({ a, b, className }: { a: Colors; b: Colors; className?: string }) {
  return (
    <ArtPlayer className={className}>
      <div aria-hidden className="art-compare relative aspect-[100/68] w-full">
        <div className="cmp-a absolute top-0 left-0 w-[76%]">
          <EditorArt complete className="w-full" colors={a} />
          <div className="cmp-dim cmp-dim-a" />
        </div>
        <div className="cmp-b absolute right-0 bottom-0 w-[76%]">
          <EditorArt complete className="w-full" colors={b} />
          <div className="cmp-dim cmp-dim-b" />
        </div>
      </div>
    </ArtPlayer>
  );
}
