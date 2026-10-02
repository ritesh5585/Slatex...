import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[8px] px-2 py-0.5 text-[12px] font-medium select-none",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--accent)]30 bg-[var(--accent-muted)] text-[var(--accent)]",
        secondary:
          "border border-[var(--border)] bg-[var(--elevated)] text-[var(--text-secondary)]",
        outline:
          "border border-[var(--border)] text-[var(--text-tertiary)]",
        success:
          "border border-[#22c55e30] bg-[#22c55e15] text-[#4ade80]",
        muted:
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-tertiary)]",
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
