import Image from "next/image";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  contributors: any[];
}

export function ContributorsList({ contributors }: Props) {
  if (!contributors?.length) return null;

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="inline-flex rounded-xl bg-emerald-500/10 p-2 text-emerald-400 ring-1 ring-emerald-500/20">
          <Users className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">Top Contributors</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {contributors.slice(0, 6).map((c) => (
          <a
            key={c.id}
            href={c.html_url}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-center"
          >
            {/* <Image
              src={c.avatar_url}
              alt={c.login}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full ring-2 ring-zinc-800"
            /> */}
            <div className="min-w-0 w-full">
              <p className="text-xs font-medium text-zinc-200 truncate">
                @{c.login}
              </p>
              <p className="text-[10px] text-zinc-500 tabular-nums">
                {c.contributions} commits
              </p>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}