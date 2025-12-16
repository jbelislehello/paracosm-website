import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  showScrollIndicators?: boolean;
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, children, showScrollIndicators = false, ...props }, ref) => {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(false);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !showScrollIndicators) return;

    const checkScroll = () => {
      setCanScrollUp(viewport.scrollTop > 10);
      setCanScrollDown(
        viewport.scrollTop < viewport.scrollHeight - viewport.clientHeight - 10
      );
    };

    checkScroll();
    viewport.addEventListener('scroll', checkScroll);
    
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(viewport);

    return () => {
      viewport.removeEventListener('scroll', checkScroll);
      resizeObserver.disconnect();
    };
  }, [showScrollIndicators]);

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport 
        ref={viewportRef}
        className="h-full w-full rounded-[inherit]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      
      {showScrollIndicators && (
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 h-8 pointer-events-none z-10",
            "bg-gradient-to-b from-background to-transparent",
            "transition-opacity duration-200",
            canScrollUp ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      
      {showScrollIndicators && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10",
            "bg-gradient-to-t from-background to-transparent",
            "transition-opacity duration-200",
            canScrollDown ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
