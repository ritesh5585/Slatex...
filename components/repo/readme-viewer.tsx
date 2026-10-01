"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { BookOpen, List, ExternalLink, Copy, Check, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  content: string;
  owner?: string;
  repoName?: string;
  branch?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function resolveReadmePath(path: string | undefined, base: string): string {
  if (!path || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path)) return path ?? "";
  return new URL(path.replace(/^\.\//, "").replace(/^\//, ""), base).toString();
}

function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_`~]/g, "").trim();
    const id = slugify(text);
    items.push({ id, text, level });
  }
  return items;
}

function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const code = typeof children === "string" ? children : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="group relative my-4">
      <pre className={`${className ?? ""} relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm overflow-x-auto text-zinc-300 font-mono leading-relaxed`}>
        <code>{children}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 rounded-lg border border-zinc-700 bg-zinc-800/80 p-1.5 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white hover:border-zinc-600 transition-all"
        title="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export function ReadmeViewer({ content, owner, repoName, branch = "HEAD" }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"preview" | "raw">("preview");
  const [showToc, setShowToc] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!content) return null;

  const toc = extractToc(content);
  const repositoryPath = owner && repoName ? `${owner}/${repoName}/${encodeURIComponent(branch)}/` : "";
  const githubBase = `https://github.com/${owner && repoName ? `${owner}/${repoName}/blob/${encodeURIComponent(branch)}/` : ""}`;
  const rawBase = `https://raw.githubusercontent.com/${repositoryPath}`;

  // Intersection observer for active ToC heading
  useEffect(() => {
    if (!contentRef.current) return;
    const headings = contentRef.current.querySelectorAll("h1, h2, h3");
    if (!headings.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-64px 0px -75% 0px", threshold: 0.2 }
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [content, viewMode]);

  const scrollToHeading = (id: string) => {
    const el = contentRef.current?.querySelector(`#${CSS.escape(id)}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  const headingComponent = (level: 1 | 2 | 3) =>
    // eslint-disable-next-line react/display-name
    ({ children, ...props }: any) => {
      const text = typeof children === "string" ? children : String(children ?? "");
      const id = slugify(text);
      const Tag = `h${level}` as const;
      const sizeClass = level === 1 ? "text-2xl font-bold border-b border-zinc-800 pb-2 mb-4 mt-6" :
                        level === 2 ? "text-xl font-semibold border-b border-zinc-800 pb-2 mb-3 mt-8" :
                        "text-base font-semibold mb-2 mt-6";
      return (
        <Tag id={id} className={`text-white ${sizeClass} scroll-mt-20 group flex items-center gap-2`} {...props}>
          {children}
          <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-indigo-400 transition-opacity text-sm">#</a>
        </Tag>
      );
    };

  return (
    <Card className="overflow-hidden border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md repo-card-anim">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 bg-zinc-900/60 px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-400 ring-1 ring-blue-500/20">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">README</h2>
            <p className="text-[11px] text-zinc-500">Project documentation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center rounded-lg border border-zinc-700/60 bg-zinc-800/60 p-0.5">
            {(["preview", "raw"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                  viewMode === mode
                    ? "bg-zinc-700 text-white shadow"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {mode === "preview" ? "Preview" : "Raw"}
              </button>
            ))}
          </div>

          {/* ToC toggle */}
          {toc.length > 0 && (
            <button
              type="button"
              onClick={() => setShowToc((v) => !v)}
              className={`hidden sm:flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                showToc
                  ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-400"
                  : "border-zinc-700 bg-zinc-800/60 text-zinc-500 hover:text-zinc-300"
              }`}
              title="Toggle table of contents"
            >
              <List className="h-3.5 w-3.5" />
              ToC
            </button>
          )}

          {owner && repoName && (
            <a
              href={`https://github.com/${owner}/${repoName}#readme`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0">
        {/* ToC sidebar */}
        {showToc && toc.length > 2 && viewMode === "preview" && (
          <aside className="hidden sm:flex flex-col w-52 shrink-0 border-r border-zinc-800/60 p-4 sticky top-0 max-h-[600px] overflow-y-auto">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              On this page
            </p>
            <nav className="flex flex-col gap-0.5">
              {toc.map(({ id, text, level }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToHeading(id)}
                  className={`text-left rounded px-2 py-1 text-xs transition-all duration-150 readme-toc-link ${
                    activeId === id
                      ? "text-indigo-400 bg-indigo-500/10 font-medium"
                      : "text-zinc-500 hover:text-zinc-300"
                  } ${level === 2 ? "pl-4" : level === 3 ? "pl-6" : ""}`}
                >
                  {text}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 px-5 py-6 sm:px-8" ref={contentRef}>
          {viewMode === "raw" ? (
            <div className="relative">
              <pre className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap break-words font-mono rounded-xl border border-zinc-800 bg-zinc-950 p-5 overflow-x-auto max-h-[640px] overflow-y-auto">
                {content}
              </pre>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(content)}
                className="absolute top-3 right-3 rounded-lg border border-zinc-700 bg-zinc-800 p-1.5 text-zinc-400 hover:text-white transition-colors"
                title="Copy raw"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <article className="prose prose-invert max-w-none
              prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white
              prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:my-4
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-em:text-zinc-300
              prose-code:text-blue-300 prose-code:bg-zinc-800/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none
              prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0
              prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-500/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-zinc-400 prose-blockquote:border-l-4
              prose-ul:text-zinc-300 prose-ol:text-zinc-300 prose-li:my-1
              prose-table:text-sm prose-table:border prose-table:border-zinc-800 prose-table:rounded-lg prose-table:overflow-hidden
              prose-thead:bg-zinc-900 prose-thead:border-b prose-thead:border-zinc-800
              prose-th:text-zinc-200 prose-th:px-4 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold
              prose-td:text-zinc-400 prose-td:px-4 prose-td:py-2.5 prose-td:border-t prose-td:border-zinc-800
              prose-hr:border-zinc-800 prose-hr:my-6
              prose-img:rounded-xl prose-img:border prose-img:border-zinc-800 prose-img:my-5
              [&_img]:max-w-full [&_img]:h-auto
              [&_table]:w-full [&_table]:block [&_table]:overflow-x-auto sm:[&_table]:table
              [&_details]:rounded-xl [&_details]:border [&_details]:border-zinc-800 [&_details]:p-4 [&_details]:my-3 [&_details]:bg-zinc-900/50
              [&_summary]:cursor-pointer [&_summary]:text-zinc-200 [&_summary]:font-medium [&_summary]:select-none
              [&_input[type=checkbox]]:accent-indigo-500 [&_input[type=checkbox]]:mr-2"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw as any]}
                components={{
                  a: ({ href, children, ...props }) => (
                    <a
                      href={resolveReadmePath(href, githubBase)}
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
                      src={resolveReadmePath(typeof src === "string" ? src : undefined, rawBase)}
                      alt={alt || ""}
                      loading="lazy"
                      {...props}
                    />
                  ),
                  // @ts-ignore
                  code: ({ inline, className, children, ...props }) => {
                    if (inline) {
                      return <code className={className} {...props}>{children}</code>;
                    }
                    return <CodeBlock className={className}>{children}</CodeBlock>;
                  },
                  h1: headingComponent(1),
                  h2: headingComponent(2),
                  h3: headingComponent(3),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          )}
        </div>
      </div>
    </Card>
  );
}
