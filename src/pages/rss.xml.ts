import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { postUrl } from '../utils/post-url';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: 'Eric Wu — 科技產業分析',
    description: '解讀 AI、新創與科技巨頭的商業策略',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: postUrl(post.id),
    })),
  });
}
