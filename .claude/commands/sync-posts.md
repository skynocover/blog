Sync blog posts from Obsidian vault to this Astro project.

## Source

Read all `.md` files from: `/Users/ericwu/Documents/vibe_writing/blog/`
(This is a symlink to the iCloud Obsidian vault)

## Destination

Write to: `src/content/posts/` in this project.

## Steps

1. List all `.md` files in the source directory.
2. List all `.md` files in `src/content/posts/`.
3. For each source file, check if it already exists in destination (compare by reading existing posts' frontmatter `title` field against the source filename/content).
4. For **new or updated** files:
   - Read the full content of the source file.
   - Generate frontmatter with these fields (matching the schema in `src/content/config.ts`):
     - `title`: Clean up the filename or first heading as the title
     - `date`: Use the file's last modified date (YYYY-MM-DD format)
     - `tag`: Choose between "深度分析" or "本週科技" based on content
     - `description`: Generate a 1-2 sentence summary of the article in the same tone/language as the content
     - `featured`: Set to `true` only if the article is particularly notable
   - Generate an English `slug` from the title (kebab-case, concise)
   - Strip any existing `# Title` heading from the content (since title is in frontmatter)
   - Write to `src/content/posts/{slug}.md` with frontmatter + content
5. Report what was added, updated, or skipped.

## Important

- Do NOT modify any files in the source directory (Obsidian vault).
- If a post already exists and the source content hasn't changed, skip it.
- Preserve all original content - only add frontmatter and rename the file.
