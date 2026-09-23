import { FolderGit2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showBackHome?: boolean;
}

export function EmptyState({
  title = "No public repositories yet",
  description = "This user hasn't created or published any public repositories on GitHub.",
  showBackHome = false,
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-zinc-800 bg-zinc-900/30">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400 ring-1 ring-zinc-700/60 mb-4 shadow-inner">
        <FolderGit2 className="h-7 w-7 text-zinc-400" />
      </div>
      <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-zinc-400 leading-relaxed">
        {description}
      </p>
      {showBackHome && (
        <div className="mt-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Analyze Another User</span>
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
