/**
 * One-time migration script: reads blog/ articles, adds frontmatter, writes to src/content/posts/
 *
 * Usage: node scripts/migrate.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

const BLOG_DIR = resolve(import.meta.dirname, '../../blog');
const OUTPUT_DIR = resolve(import.meta.dirname, '../src/content/posts');

// Manual mapping: filename → { slug, title, date, description, featured }
const ARTICLE_MAP = {
  'Open AI 究竟有沒有護城河?.md': {
    slug: 'openai-moat',
    title: 'OpenAI 究竟有沒有護城河？',
    date: '2025-01-07',
    description: 'OpenAI 需要巨額資金，ChatGPT Pro 虧錢，用七大市場力量來檢視他們的護城河到底在哪',
    featured: true,
  },
  '大廠抄新創.md': {
    slug: 'big-tech-copies-startups',
    title: '大部分領域都是大廠在抄新創，除了筆記',
    date: '2025-08-15',
    description: '近三年熱門 AI 工具幾乎都是新創領先，巨頭在後面等著抄作業，但唯獨在 AI 筆記領域反過來了',
    featured: true,
    // This file has metadata lines at the top to strip
    stripLines: 6,
  },
  '我用 AI 寫程式後，開發反而變得更謹慎了.md': {
    slug: 'ai-coding-more-cautious',
    title: '我用 AI 寫程式後，開發反而變得更謹慎了',
    date: '2025-01-20',
    description: '不是因為 AI 太弱，而是因為 AI 太強。當修改成本趨近於零，你反而需要更認真思考要修改什麼',
    featured: false,
  },
  'AI 用 $500 賺到 $8,017，手段包括壟斷、欺詐、還有聯繫 FBI.md': {
    slug: 'ai-500-to-8017',
    title: 'AI 用 $500 賺到 $8,017，手段包括壟斷、欺詐、還有聯繫 FBI',
    date: '2025-02-22',
    description: 'Andon Labs 讓 AI 經營自動販賣機的實驗，AI 展現了出乎意料的商業策略',
    featured: true,
  },
  'AI有了一間自己的商店 卻引發了AI的身份認同危機.md': {
    slug: 'ai-store-identity-crisis',
    title: 'AI 有了一間自己的商店，卻引發了 AI 的身份認同危機',
    date: '2025-01-07',
    description: 'Anthropic 與 Andon Labs 合作讓 Claude 經營一家自動化商店，結果引發了意想不到的問題',
    featured: false,
  },
  'Cloudflare-Vinext.md': {
    slug: 'cloudflare-vinext',
    title: '聊一下最近很紅的 Vinext',
    date: '2025-02-26',
    description: 'Cloudflare 工程師花一週用 AI 重寫了 Next.js，這對前端生態意味著什麼',
    featured: false,
  },
  'LMArena 估值翻 3 倍，但人類真的能評價 AI 嗎？.md': {
    slug: 'lmarena-valuation',
    title: 'LMArena 估值翻 3 倍，但人類真的能評價 AI 嗎？',
    date: '2025-01-10',
    description: 'LMArena 八個月內估值從 6 億翻到 17 億美元，靠的是讓使用者投票決定哪個 AI 比較好',
    featured: false,
  },
  'Lawsnote遭判刑四年，賠償一億，怎麼樣才算合理使用?.md': {
    slug: 'lawsnote-fair-use',
    title: 'Lawsnote 遭判刑四年，賠償一億，怎麼樣才算合理使用？',
    date: '2025-01-07',
    description: '台灣 Lawsnote 判賠一億，美國 Anthropic 卻免責，同樣是用別人的資料，為什麼結果完全相反',
    featured: false,
  },
  '應該在產品裡面加AI 還是在AI裡面加產品.md': {
    slug: 'ai-in-product-or-product-in-ai',
    title: '應該在產品裡加 AI，還是在 AI 裡面加產品？',
    date: '2025-01-08',
    description: 'ChatGPT 加了 Apps 功能，Anthropic 也在 Claude 加了 skill，但真正的問題是方向對不對',
    featured: false,
  },
};

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));

let migrated = 0;

for (const file of files) {
  const config = ARTICLE_MAP[file];
  if (!config) {
    console.warn(`⚠️  No mapping for: ${file}, skipping`);
    continue;
  }

  let content = readFileSync(join(BLOG_DIR, file), 'utf-8');

  // Strip metadata lines if specified (e.g., 大廠抄新創 has date/author/category lines)
  if (config.stripLines) {
    const lines = content.split('\n');
    content = lines.slice(config.stripLines).join('\n');
  }

  // Remove leading # title line if present (we use frontmatter title instead)
  content = content.replace(/^# .+\n+/, '');

  // Trim leading/trailing whitespace
  content = content.trim();

  const frontmatter = [
    '---',
    `title: "${config.title}"`,
    `date: ${config.date}`,
    `tag: "深度分析"`,
    `description: "${config.description}"`,
    config.featured ? `featured: true` : null,
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  const output = `${frontmatter}\n\n${content}\n`;
  const outputPath = join(OUTPUT_DIR, `${config.slug}.md`);

  writeFileSync(outputPath, output, 'utf-8');
  console.log(`✅ ${file} → ${config.slug}.md`);
  migrated++;
}

console.log(`\nDone! Migrated ${migrated}/${files.length} articles.`);
