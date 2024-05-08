import { getCollection } from "astro:content";

export async function getAllTags() {
  const posts = await getCollection("blog")
  return [...new Set(posts.map(post => post.data.tags).flat().sort())]
}