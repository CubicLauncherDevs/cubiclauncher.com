import DOMPurify from "isomorphic-dompurify";

type TableAlignment = "left" | "center" | "right" | null;

export function renderMarkdown(md: string): string {
  let html = md;

  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const lines = html.split("\n");
  const out: string[] = [];
  let inCodeBlock = false;
  let codeBuf: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" | null = null;
  let listBuf: string[] = [];

  function flushList() {
    if (listBuf.length > 0 && listType) {
      out.push(`<${listType}>\n${listBuf.join("\n")}\n</${listType}>`);
      listBuf = [];
    }
    inList = false;
    listType = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = normalizeLine(raw);

    if (inCodeBlock) {
      if (line.trim().startsWith("```")) {
        out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
        codeBuf = [];
        inCodeBlock = false;
      } else {
        codeBuf.push(line);
      }
      continue;
    }

    if (line.trim().startsWith("```")) {
      flushList();
      inCodeBlock = true;
      codeBuf = [];
      continue;
    }

    const trimmed = line.trim();

    if (trimmed === "") {
      flushList();
      out.push("");
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushList();
      const level = heading[1].length;
      const content = inlineMarkdown(heading[2]);
      out.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    const hr = trimmed.match(/^[-*_]{3,}$/);
    if (hr) {
      flushList();
      out.push("<hr>");
      continue;
    }

    const tableHeader = splitTableRow(trimmed);
    if (tableHeader) {
      const delimiterIndex = nextNonEmptyLineIndex(lines, i + 1);
      const delimiter = delimiterIndex < lines.length ? normalizeLine(lines[delimiterIndex]).trim() : "";
      if (isTableDelimiter(delimiter)) {
        flushList();
        const alignments = parseTableAlignments(delimiter);
        i = delimiterIndex;
        const rows: string[][] = [];
        let cursor = delimiterIndex + 1;
        while (cursor < lines.length) {
          const rowIndex = nextNonEmptyLineIndex(lines, cursor);
          if (rowIndex >= lines.length) break;
          const next = normalizeLine(lines[rowIndex]).trim();
          const nextDelimiterIndex = nextNonEmptyLineIndex(lines, rowIndex + 1);
          const nextDelimiter = nextDelimiterIndex < lines.length
            ? normalizeLine(lines[nextDelimiterIndex]).trim()
            : "";
          if (!next.includes("|") || isTableDelimiter(next) || isTableDelimiter(nextDelimiter)) break;
          rows.push(splitTableRow(next) ?? []);
          i = rowIndex;
          cursor = rowIndex + 1;
        }
        out.push(renderTable(tableHeader, alignments, rows));
        continue;
      }
    }

    const ulItem = trimmed.match(/^[-*+]\s+(.+)$/);
    if (ulItem) {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      inList = true;
      listBuf.push(`<li>${inlineMarkdown(ulItem[1])}</li>`);
      continue;
    }

    const olItem = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (olItem) {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      inList = true;
      listBuf.push(`<li>${inlineMarkdown(olItem[1])}</li>`);
      continue;
    }

    flushList();
    out.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  flushList();
  if (inCodeBlock && codeBuf.length > 0) {
    out.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
  }

  const result = out.join("\n");
  return DOMPurify.sanitize(result, {
    ALLOWED_TAGS: ["a", "b", "blockquote", "br", "code", "dd", "details", "div", "dl", "dt",
      "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "ins", "kbd", "li", "mark",
      "ol", "p", "pre", "q", "s", "samp", "small", "span", "strong", "sub", "summary", "sup",
      "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul", "var"],
    ALLOWED_ATTR: ["src", "alt", "title", "href", "target", "rel", "class", "id", "style"],
  });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function normalizeLine(raw: string): string {
  return raw.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function nextNonEmptyLineIndex(lines: string[], start: number): number {
  let index = start;
  while (index < lines.length && normalizeLine(lines[index]).trim() === "") index++;
  return index;
}

function splitTableRow(line: string): string[] | null {
  if (!line.includes("|")) return null;
  let value = line.trim();
  if (value.startsWith("|")) value = value.slice(1);
  if (value.endsWith("|")) value = value.slice(0, -1);

  const cells: string[] = [];
  let cell = "";
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (char === "\\" && value[index + 1] === "|") {
      cell += "|";
      index += 1;
      continue;
    }
    if (char === "|") {
      cells.push(cell.trim());
      cell = "";
      continue;
    }
    cell += char;
  }
  cells.push(cell.trim());
  return cells;
}

function isTableDelimiter(line: string): boolean {
  const cells = splitTableRow(line);
  if (!cells || cells.length === 0) return false;
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function parseTableAlignments(line: string): TableAlignment[] {
  return (splitTableRow(line) ?? []).map((cell) => {
    const left = cell.startsWith(":");
    const right = cell.endsWith(":");
    if (left && right) return "center";
    if (right) return "right";
    if (left) return "left";
    return null;
  });
}

function renderTable(headers: string[], alignments: TableAlignment[], rows: string[][]): string {
  const cellStyle = (index: number) => {
    const alignment = alignments[index];
    return alignment ? ` style="text-align: ${alignment}"` : "";
  };

  const head = headers
    .map((cell, index) => `<th${cellStyle(index)}>${inlineMarkdown(cell)}</th>`)
    .join("");
  const body = rows
    .map((row) => {
      const cells = headers
        .map((_, index) => `<td${cellStyle(index)}>${inlineMarkdown(row[index] ?? "")}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("\n");

  return `<div class="md-table"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function inlineMarkdown(text: string): string {
  let s = escapeHtml(text);

  s = s.replace(/\\`/g, "\x00CODEBACKTICK\x00");

  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\x00CODEBACKTICK\x00/g, "`");

  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.+?)\*/g, "<em>$1</em>");
  s = s.replace(/~~(.+?)~~/g, "<s>$1</s>");

  s = s.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  s = s.replace(/\n/g, "<br>");

  return s;
}
