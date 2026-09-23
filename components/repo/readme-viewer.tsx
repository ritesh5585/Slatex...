"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  content: string;
}

export function ReadmeViewer({ content }: Props) {
  if (!content) return null;

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="inline-flex rounded-xl bg-zinc-700/30 p-2 text-zinc-300 ring-1 ring-zinc-700/40">
          <BookOpen className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-semibold text-white">README</h2>
      </div>

      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-white prose-headings:font-semibold
        prose-p:text-zinc-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-code:text-blue-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
        prose-strong:text-white prose-li:text-zinc-300
        prose-table:text-sm prose-th:text-zinc-200 prose-td:text-zinc-400
        prose-hr:border-zinc-800">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </Card>
  );
}