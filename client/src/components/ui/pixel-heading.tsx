
import { HTMLAttributes } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pixelHeadingVariants = cva(
  "font-space font-bold relative inline-block",
  {
    variants: {
      variant: {
        default: "text-maximally-black",
        contrast: "text-white",
      },
      size: {
        default: "text-2xl md:text-3xl",
        lg: "text-3xl md:text-4xl",
        xl: "text-4xl md:text-5xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface PixelHeadingProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof pixelHeadingVariants> {
  as?: "h1" | "h2" | "h3" | "h4";
}

const PixelHeading = ({
  className,
  variant,
  size,
  as: Component = "h2",
  children,
  ...props
}: PixelHeadingProps) => {
  return (
    <Component
      className={cn(pixelHeadingVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Component>
  );
};

export { PixelHeading, pixelHeadingVariants };
