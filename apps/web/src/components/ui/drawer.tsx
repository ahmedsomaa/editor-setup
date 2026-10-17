import { useEffect, useState } from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "cn"

/** Same anatomy as the shadcn Base UI Drawer, drawn with this site's tokens. Side panel from `md`, bottom sheet below. */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)")
    const update = () => setDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return desktop
}

function Drawer({
  swipeDirection,
  ...props
}: DrawerPrimitive.Root.Props) {
  const desktop = useIsDesktop()
  return (
    <DrawerPrimitive.Root
      swipeDirection={swipeDirection ?? (desktop ? "right" : "down")}
      {...props}
    />
  )
}

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerClose = DrawerPrimitive.Close

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Backdrop
        data-slot="drawer-overlay"
        className="fixed inset-0 z-50 min-h-dvh bg-black/30 opacity-[calc(1*(1-var(--drawer-swipe-progress,0)))] transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:duration-0 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 motion-reduce:duration-0"
      />
      <DrawerPrimitive.Viewport className="fixed inset-0 z-50 flex items-end justify-center md:items-stretch md:justify-end">
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          className={cn(
            "bg-popover text-foreground border-border flex w-full flex-col overflow-hidden border-t outline-none",
            "max-h-[88dvh] rounded-t-[1.75rem] [transform:translateY(var(--drawer-swipe-movement-y,0px))] data-[starting-style]:[transform:translateY(100%)] data-[ending-style]:[transform:translateY(100%)]",
            "md:h-full md:max-h-none md:w-[28rem] md:max-w-[calc(100vw-2rem)] md:rounded-none md:rounded-s-[1.75rem] md:border-t-0 md:border-s md:[transform:translateX(var(--drawer-swipe-movement-x,0px))] md:data-[starting-style]:[transform:translateX(100%)] md:data-[ending-style]:[transform:translateX(100%)]",
            "shadow-[var(--shadow-overlay)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[swiping]:duration-0 data-[ending-style]:duration-150 motion-reduce:duration-0",
            className,
          )}
          {...props}
        >
          <div
            aria-hidden
            className="bg-border mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full md:hidden"
          />
          {children}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 px-6 pt-5 pb-4 md:pt-6", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "border-border mt-auto flex items-center justify-between gap-3 border-t px-6 py-4",
        className,
      )}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-heading text-2xl leading-none", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
