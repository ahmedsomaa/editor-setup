import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "cn";

const Popover = PopoverPrimitive.Root;

function PopoverTrigger({
  className,
  ...props
}: PopoverPrimitive.Trigger.Props) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      className={cn(
        "text-muted-foreground hover:text-foreground data-[popup-open]:text-foreground inline-flex size-9 shrink-0 cursor-pointer items-center justify-center transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] [&_svg]:size-6",
        className,
      )}
      {...props}
    />
  );
}

function PopoverContent({
  className,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, "side" | "sideOffset" | "align">) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "border-border bg-popover text-popover-foreground w-[min(22rem,calc(100vw-2rem))] origin-(--transform-origin) rounded-xl border p-4 text-sm shadow-[var(--shadow-overlay)] outline-none motion-safe:transition-opacity motion-safe:duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            className,
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

const PopoverTitle = PopoverPrimitive.Title;

export { Popover, PopoverContent, PopoverTitle, PopoverTrigger };
