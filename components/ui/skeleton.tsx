import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-zinc-800/60 border border-zinc-700/20",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
