import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/projects",
		retainBody: true,
	}),

	schema: z.object({
		title: z.string(),
		slug: z.string(),
		year: z.number(),

		cover: z.string(),

		// 封面圖下方的圖說文字（選填）
		coverCaption: z.string().optional(),

		category: z.string().optional(),

		github: z.string().optional(),
		demo: z.string().optional(),

		tech: z.array(z.string()),

		// zoom = 留在首頁使用 Lightbox
		// page = 進入獨立作品頁
		mode: z.enum(["zoom", "page"]).optional(),
	}),
});

export const collections = {
	projects,
};