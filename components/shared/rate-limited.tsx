import { Clock } from "lucide-react";
import ErrorPage from "@/components/shared/Error";

interface RateLimitedProps {
  retryAfter: number; // seconds
}

export function RateLimited({ retryAfter }: RateLimitedProps) {
  const mins = Math.ceil(retryAfter / 60);
  return (
    <ErrorPage
      icon={Clock}
      iconClass="bg-amber-500/10 text-amber-400 ring-amber-500/20"
      title="Too Many Requests"
      description={`Free lookups for this hour are exhausted. Try again in ~${mins} min${mins !== 1 ? "s" : ""}.`}
    />
  );
}
