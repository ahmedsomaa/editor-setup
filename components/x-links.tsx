import Image from "next/image";

export function XLinks() {
  return (
    <div className="mb-12 flex flex-col items-center justify-center gap-2 text-sm">
      <span className="text-zinc-500">Brought to you by</span>
      <span className="-ml-0.5 flex -space-x-2">
        <a
          className="group relative h-7 w-7 overflow-hidden rounded-full border-2 border-background"
          href="https://x.com/intent/follow?screen_name=som3aware"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            width={24}
            height={24}
            src="/avatar.png"
            alt="Som3aware's profile image"
            className="absolute inset-0 object-cover object-center transition-transform duration-300 group-hover:scale-110"
          />
        </a>
      </span>
    </div>
  );
}
