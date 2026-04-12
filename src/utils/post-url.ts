export function postUrl(id: string): string {
  return `/posts/${id.replace(/\.md$/, '')}/`;
}
