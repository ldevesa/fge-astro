import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    image: z.string(),
    publishDate: z.date(),
  })
});

export const collections = {
  'blog': blogCollection
};