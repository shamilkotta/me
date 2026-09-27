import { createHighlighter, type BundledLanguage, type Highlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const theme = {
  name: "geist",
  type: "dark",
  colors: {
    "editor.foreground": "var(--shiki-color-text)",
    "editor.background": "var(--shiki-color-background)",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: "var(--shiki-token-comment)" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "variable.language",
        "variable.other.enummember",
      ],
      settings: { foreground: "var(--shiki-token-constant)" },
    },
    {
      scope: [
        "entity.name.function",
        "entity.name.tag",
        "support.class.component",
        "support.function",
      ],
      settings: { foreground: "var(--shiki-token-function)" },
    },
    {
      scope: ["keyword", "storage", "storage.type", "storage.modifier"],
      settings: { foreground: "var(--shiki-token-keyword)" },
    },
    {
      scope: ["keyword.operator", "keyword.operator.expression"],
      settings: { foreground: "var(--shiki-token-punctuation)" },
    },
    {
      scope: ["string", "string punctuation.section.embedded source", "attribute.value"],
      settings: { foreground: "var(--shiki-token-string)" },
    },
    {
      scope: "string.regexp",
      settings: { foreground: "var(--shiki-token-string)" },
    },
    {
      scope: [
        "punctuation",
        "punctuation.definition.string",
        "punctuation.definition.variable",
        "punctuation.definition.string.begin",
        "punctuation.definition.string.end",
        "punctuation.section.embedded.begin",
        "punctuation.section.embedded.end",
      ],
      settings: { foreground: "var(--shiki-token-punctuation)" },
    },
    {
      scope: ["meta.function-call.generic", "meta.function-call"],
      settings: { foreground: "var(--shiki-token-function)" },
    },
    {
      scope: "markup.underline.link",
      settings: { foreground: "var(--shiki-token-string)" },
    },
  ],
} as const;

const LANGS = ["tsx", "typescript", "javascript", "bash", "json", "css"] as const;

const EXT: Record<string, BundledLanguage> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "tsx",
  mjs: "javascript",
  cjs: "javascript",
  css: "css",
  json: "json",
  sh: "bash",
  bash: "bash",
};

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: [theme],
    langs: [...LANGS],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighterPromise;
}

export function langFromFilename(filename?: string): BundledLanguage {
  const base = filename?.split("·")[0]?.trim() ?? "";
  const ext = base.includes(".") ? (base.split(".").pop()?.toLowerCase() ?? "") : "";
  return EXT[ext] ?? "tsx";
}

export async function highlightNlCode(code: string, lang: BundledLanguage = "tsx") {
  const highlighter = await getHighlighter();
  const resolved = highlighter.getLoadedLanguages().includes(lang) ? lang : "tsx";
  return highlighter.codeToHtml(code, {
    lang: resolved,
    theme: "geist",
  });
}
