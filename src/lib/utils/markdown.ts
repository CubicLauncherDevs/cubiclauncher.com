import DOMPurify from "dompurify";

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
    const line = raw.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

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
