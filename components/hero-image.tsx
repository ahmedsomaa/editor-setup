import Image from "next/image";

export function HeroImage() {
  return (
    <div className="-m-2 rounded-xl bg-neutral-900/5 dark:bg-neutral-100/10 p-2 ring-1 ring-inset ring-neutral-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
      <Image
        alt="Hero"
        height="400"
        width="600"
        src="/hero-img.png"
        style={{
          aspectRatio: "16/9",
          objectFit: "cover",
        }}
        className="rounded-md bg-white shadow-2xl ring-1 ring-sky-900/10"
      />
    </div>
  );
}
