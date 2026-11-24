/**
 * Splits the article body into H2 sections so each one renders as a titled block.
 * The body format is defined in src/lib/data/security.ts.
 */
export function splitArticleSections(body: string): { heading: string; markdown: string }[] {
  const sections: { heading: string; markdown: string }[] = [];
  const lines = body.split("\n");
  let heading: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (heading !== null) sections.push({ heading, markdown: buffer.join("\n").trim() });
    buffer = [];
  };

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      flush();
      heading = match[1].trim();
      continue;
    }
    if (heading !== null) buffer.push(line);
  }
  flush();

  return sections;
}
