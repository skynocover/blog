const CHARS_PER_MINUTE = 500;

function stripMarkdown(text: string): string {
  return (
    text
      // code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      // images
      .replace(/!\[.*?\]\(.*?\)/g, '')
      // links (keep text)
      .replace(/\[([^\]]*)\]\(.*?\)/g, '$1')
      // headings
      .replace(/^#{1,6}\s+/gm, '')
      // bold/italic
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
      // strikethrough
      .replace(/~~([^~]+)~~/g, '$1')
      // frontmatter
      .replace(/^---[\s\S]*?---/m, '')
      // html tags
      .replace(/<[^>]+>/g, '')
  );
}

export function getReadingTime(body: string | undefined): number {
  if (!body) return 1;
  const cleaned = stripMarkdown(body);
  const chars = cleaned.replace(/\s/g, '').length;
  return Math.max(1, Math.round(chars / CHARS_PER_MINUTE));
}
