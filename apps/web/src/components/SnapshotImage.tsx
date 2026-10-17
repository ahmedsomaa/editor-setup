import { cn } from "cn";

/**
 * A Snapshot file keeps its backdrop. This shows only the code window: it is centred,
 * 1420 x 750 of the 1600 x 900 image, so crop to that and scale the image up.
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
      className={cn("overflow-hidden", !bare && "ring-border ring-1", className)}
      style={{ aspectRatio: "1420 / 750" }}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        width={1600}
        height={900}
        className="block h-auto w-[112.68%] max-w-none -ms-[6.34%] -mt-[5.28%]"
      />
    </div>
  );
}
