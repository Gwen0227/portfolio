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

		/*
		 * Lightbox 圖片
		 *
		 * 第一張通常使用 cover，
		 * 其他圖片放在這裡。
		 */
		gallery: z.array(z.string()).optional(),

		/*
		 * 封面圖下方的圖說
		 */
		coverCaption:
			z.string().optional(),

		category:
			z.string().optional(),

		github:
			z.string().optional(),

		demo:
			z.string().optional(),

		tech:
			z.array(z.string()),

		/*
		 * 作品模式
		 *
		 * zoom
		 * → 點擊開啟 Lightbox
		 *
		 * page
		 * → 點擊進入作品詳細頁
		 *
		 * link
		 * → 點擊前往外部網站
		 */
		mode:
			z.enum([
				"zoom",
				"page",
				"link",
			]).optional(),

		/*
		 * link 模式使用的外部網址
		 */
		link:
			z.string().url().optional(),
	}),
});

export const collections = {
	projects,
};