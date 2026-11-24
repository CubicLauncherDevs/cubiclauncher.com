export type SeverityLevel = "critical" | "high" | "medium" | "low" | "none";

export interface SecurityArticle {
  /** URL slug: /security/<slug> */
  slug: string;
  /** CVE or upstream identifier assigned to the vulnerability. */
  cve: string | null;
  /** "minecraft" for vulnerabilities in Minecraft or its ecosystem, "launcher" for CubicLauncher. */
  category: "minecraft" | "launcher";
  severity: SeverityLevel;
  publishedAt: string;
  /**
   * Translation key prefix under `security.articles.<key>`.
   * The entry resolves `title`, `summary` and `body`.
   */
  key: string;
  /** Primary reference: upstream advisory, commit or issue. */
  source: string;
}

/** Article texts resolved by the page for the active locale. */
export interface SecurityArticleText {
  title: string;
  summary: string;
  body: SecurityArticleBody;
}

export interface SecurityArticleBody {
  /** Introductory paragraphs, in Markdown. */
  paragraphs: string[];
  /** Key data shown between the summary and the version table. */
  details: { label: string; value: string }[];
  /** Version matrix. `status` selects the wording from `security.status.*`. */
  versions: { versions: string; status: SeverityLevel; notes: string }[];
  /** Main analysis as `## Heading` sections, in Markdown. */
  sections: string;
  mitigationTitle: string;
  /** Mitigation steps, in Markdown (list items allowed). */
  mitigation: string;
  riskTitle: string;
  /** What the vulnerability allows, in Markdown (list items allowed). */
  risk: string;
  caveatTitle: string;
  /** Optional caution block, in Markdown. Empty string hides the block. */
  caveat: string;
}

/**
 * Published articles. Add an entry here and its texts in
 * src/lib/i18n/*.json under `security.articles.<key>`.
 * Locales without the article texts do not list it.
 */
export const SECURITY_ARTICLES: SecurityArticle[] = [
  {
    slug: "minecraft2shell",
    cve: "CVE-2026-10701",
    category: "minecraft",
    severity: "high",
    publishedAt: "2026-11-22T00:00:00.000Z",
    key: "minecraft2shell",
    source: "https://github.com/bikini/minecraft2shell",
  },
];

export function getSecurityArticle(slug: string): SecurityArticle | undefined {
  return SECURITY_ARTICLES.find((article) => article.slug === slug);
}
