# CLAUDE.md

## Project

Astro 5 blog deployed on Cloudflare Pages.

## Conventions

### Tailwind CSS
- Use canonical Tailwind classes instead of arbitrary values
  - `max-w-180` not `max-w-[720px]`
  - `text-2xl` not `text-[1.5rem]`
- When a utility class has a standard equivalent, always prefer it

### Formatting
- Prettier is configured with `prettier-plugin-astro`
- Run `npx prettier --write "src/**/*.{astro,ts,js}"` to format
- See `.prettierrc` for settings

### Content Collections (Astro 5)
- Config at `src/content.config.ts` (not `src/content/config.ts`)
- Uses `glob()` loader
- Collections: `posts`, `projects`
- Posts are categorized by `tag` field: `科技觀察`, `技術筆記`, `隨筆`
