import { cn } from "cn";

/**
 * A Snapshot is the whole 16:9 code window, so it is shown whole. `object-cover` keeps it filling
 * its box without stretching, and costs nothing here because the box and the image are both 16:9.
 */
export function SnapshotImage({
  src,
  alt,
  className,
  loading,
  bare = false,
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  /** Leave off the hairline ring, for a card that draws its own edge. */
  bare?: boolean;
}) {
  return (
    <div
      className={cn(
        "aspect-video overflow-hidden",
        !bare && "ring-border ring-1",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        width={1600}
        height={900}
        className="block size-full object-cover"
      />
    </div>
  );
}
