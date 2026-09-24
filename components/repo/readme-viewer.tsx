"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  content: string;
  owner?: string;
  repoName?: string;
}

export function ReadmeViewer({ content, owner, repoName }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (!content) return null;

  const githubBase = owner && repoName
    ? `https://github.com/${owner}/${repoName}/blob/HEAD/`
    : "";

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/40 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-400 ring-1 ring-blue-500/20">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">README.md</h2>
            <p className="text-xs text-zinc-500">Project documentation</p>
          </div>
        </div>
        {owner && repoName && (
          <a
            href={`https://github.com/${owner}/${repoName}#readme`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-400"
          >
            Open on GitHub <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="relative px-5 py-6 sm:px-8">
        <div className={`overflow-hidden transition-[max-height] duration-500 ${expanded ? "max-h-none" : "max-h-120"}`}>
        <article
          className="prose prose-invert max-w-3xl prose-sm sm:prose-base
            prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight
            prose-h1:text-2xl prose-h1:border-b prose-h1:border-zinc-800 prose-h1:pb-2 prose-h1:mb-4
            prose-h2:text-xl prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-2 prose-h2:mt-8
            prose-h3:text-lg prose-h3:mt-6
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-em:text-zinc-300
            prose-code:text-blue-300 prose-code:bg-zinc-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
            prose-blockquote:border-l-blue-500 prose-blockquote:bg-zinc-900/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:not-italic prose-blockquote:text-zinc-400
            prose-ul:text-zinc-300 prose-ol:text-zinc-300 prose-li:my-1
            prose-table:text-sm prose-table:border prose-table:border-zinc-800 prose-table:rounded-lg prose-table:overflow-hidden
            prose-thead:bg-zinc-900 prose-thead:border-b prose-thead:border-zinc-800
            prose-th:text-zinc-200 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
            prose-td:text-zinc-400 prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-zinc-800
            prose-hr:border-zinc-800 prose-hr:my-6
            prose-img:rounded-lg prose-img:border prose-img:border-zinc-800 prose-img:my-4
            [&_img]:max-w-full [&_img]:h-auto
            [&_table]:w-full [&_table]:block [&_table]:overflow-x-auto sm:[&_table]:table
            [&_details]:rounded-lg [&_details]:border [&_details]:border-zinc-800 [&_details]:p-3 [&_details]:my-3
            [&_summary]:cursor-pointer [&_summary]:text-zinc-200 [&_summary]:font-medium
            [&_input[type=checkbox]]:accent-blue-500 [&_input[type=checkbox]]:mr-2
            prose-p:my-4 prose-headings:scroll-mt-20"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children, ...props }) => (
                <a
                  href={href?.startsWith("http") ? href : `${githubBase}${href?.replace(/^\.\//, "") || ""}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  {...props}
                >
                  {children}
                </a>
              ),
              img: ({ src, alt, ...props }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={typeof src === "string" && src.startsWith("http")
                    ? src
                    : `${githubBase}${typeof src === "string" ? src.replace(/^\.\//, "") : ""}`}
                  alt={alt || ""}
                  loading="lazy"
                  {...props}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
        </div>
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-16 h-28 bg-linear-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
        )}
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/70 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white"
        >
          {expanded ? "Show less" : "Read full README"}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
    </Card>
  );
}