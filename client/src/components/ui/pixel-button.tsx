
import { ButtonHTMLAttributes, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pixelButtonVariants = cva(
  "relative inline-flex items-center justify-center font-space font-bold border-2 border-black transition-all duration-200 ease-in-out active:translate-y-1 active:shadow-none group",
  {
    variants: {
      variant: {
        default: "bg-maximally-red text-white hover:bg-maximally-yellow hover:text-black hover:shadow-[3px_3px_8px_rgba(255,215,0,0.3)]",
        secondary: "bg-maximally-blue text-white hover:bg-maximally-blue/80 hover:shadow-[3px_3px_8px_rgba(60,158,231,0.3)]",
        outline: "bg-white text-maximally-black hover:bg-gray-50 hover:shadow-[3px_3px_8px_rgba(0,0,0,0.2)]",
        yellow: "bg-maximally-yellow text-black hover:bg-maximally-red hover:text-white hover:shadow-[3px_3px_8px_rgba(229,9,20,0.3)]",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm shadow-[3px_3px_0_0_#000000] gap-2",
        lg: "h-14 px-8 py-4 text-base shadow-[4px_4px_0_0_#000000] gap-3",
        xl: "h-16 px-10 py-5 text-lg shadow-[5px_5px_0_0_#000000] gap-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface PixelButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pixelButtonVariants> {}

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(pixelButtonVariants({ variant, size, className }), "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:group-hover:scale-110")}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
PixelButton.displayName = "PixelButton";

export { PixelButton, pixelButtonVariants };
