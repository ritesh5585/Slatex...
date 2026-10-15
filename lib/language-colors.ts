export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00add8",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  Dart: "#00b4ab",
  PHP: "#4f5d95",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  SCSS: "#c6538c",
  Sass: "#a53b70",
  "C#": "#178600",
  Bash: "#89e051",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  R: "#198CE7",
  Scala: "#c22d40",
  Clojure: "#db5855",
  Zig: "#ec915c",
  Solidity: "#AA6746",
  "Jupyter Notebook": "#DA5B0B",
  Makefile: "#427819",
  Dockerfile: "#384d54",
  GraphQL: "#e10098",
  PowerShell: "#012456",
  ObjectiveC: "#438eff",
  "Objective-C": "#438eff",
  Assembly: "#6E4C13",
  Perl: "#0298c3",
  Julia: "#a270ba",
  OCaml: "#3be133",
  Nix: "#7e7eff",
  Nim: "#ffc200",
  CoffeeScript: "#244776",
  "Vim Script": "#199f4b",
  Markdown: "#083fa1",
  TeX: "#3D6117",
};

export const FALLBACK_LANGUAGE_COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f43f5e", // Rose
  "#84cc16", // Lime
  "#a855f7", // Purple
  "#0ea5e9", // Sky
];

export function getLanguageColor(language: string | null | undefined): string {
  if (!language) return "#71717a"; // Zinc-500 for unknown/empty

  // 1. Direct match
  if (LANGUAGE_COLORS[language]) {
    return LANGUAGE_COLORS[language];
  }

  // 2. Case-insensitive match (GitHub sometimes returns "javascript" vs "JavaScript")
  const lowerLang = language.toLowerCase();
  const foundKey = Object.keys(LANGUAGE_COLORS).find(
    (key) => key.toLowerCase() === lowerLang,
  );
  if (foundKey) {
    return LANGUAGE_COLORS[foundKey];
  }

  // 3. Deterministic hash fallback (same language always gets same color)
  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_LANGUAGE_COLORS.length;
  return FALLBACK_LANGUAGE_COLORS[index];
}
export const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
};