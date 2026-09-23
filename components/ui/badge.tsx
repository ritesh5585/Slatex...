import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors select-none focus:outline-none focus:ring-2 focus:ring-blue-500/50",
  {
    variants: {
      variant: {
        default:
          "border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
        secondary:
          "border border-zinc-800 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-white",
        outline:
          "border border-zinc-700/70 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
        glow:
          "border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]",
        success:
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        muted:
          "border border-zinc-800/60 bg-zinc-900/60 text-zinc-400 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
