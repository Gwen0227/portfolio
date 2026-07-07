import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/projects",
	}),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		year: z.number(),
		cover: z.string(),
		tech: z.array(z.string()),
		github: z.string().optional(),
		demo: z.string().optional(),
	}),
});

export const collections = {
	projects,
};