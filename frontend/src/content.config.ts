import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/projects",
	}),

	schema: z.object({
		/*
		 * ========================================
		 * 基本作品資料
		 * ========================================
		 */

		title: z.string(),

		slug: z.string(),

		year: z.number(),

		cover: z.string(),


		/*
		 * ========================================
		 * Lightbox 圖片
		 *
		 * 第一張通常使用 cover，
		 * 其他圖片放在 gallery。
		 *
		 * 例如：
		 *
		 * gallery:
		 *   - /images/project/01.jpg
		 *   - /images/project/02.jpg
		 * ========================================
		 */

		gallery:
			z.array(z.string()).optional(),


		/*
		 * ========================================
		 * Lightbox 作品說明
		 *
		 * 顯示在燈箱圖片下方。
		 *
		 * 例如：
		 *
		 * lightboxCaption: 這是一個品牌視覺設計專案。
		 * ========================================
		 */

		lightboxCaption:
			z.string().optional(),


		/*
		 * ========================================
		 * Lightbox 每張圖片的個別圖說
		 *
		 * 順序會對應 gallery。
		 *
		 * 例如：
		 *
		 * gallery:
		 *   - /images/project/01.jpg
		 *   - /images/project/02.jpg
		 *
		 * galleryCaptions:
		 *   - 第一張圖片的說明
		 *   - 第二張圖片的說明
		 *
		 * 如果沒有設定個別圖說，
		 * Lightbox 會使用 lightboxCaption。
		 * ========================================
		 */

		galleryCaptions:
			z.array(z.string()).optional(),


		/*
		 * ========================================
		 * Lightbox 圖片裁切模式
		 *
		 * contain
		 * → 保留完整圖片比例
		 *
		 * square
		 * → 裁切成正方形
		 *
		 * 不設定
		 * → 預設使用 contain
		 *
		 * 例如：
		 *
		 * imageCrop: square
		 * ========================================
		 */

		imageCrop:
			z.enum([
				"contain",
				"square",
			]).optional(),


		/*
		 * ========================================
		 * 封面圖下方的圖說
		 * ========================================
		 */

		coverCaption:
			z.string().optional(),


		/*
		 * ========================================
		 * 作品分類
		 * ========================================
		 */

		category:
			z.string().optional(),


		/*
		 * ========================================
		 * GitHub
		 * ========================================
		 */

		github:
			z.string().optional(),


		/*
		 * ========================================
		 * Demo
		 * ========================================
		 */

		demo:
			z.string().optional(),


		/*
		 * ========================================
		 * 使用技術
		 * ========================================
		 */

		tech:
			z.array(z.string()),


		/*
		 * ========================================
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
		 * ========================================
		 */

		mode:
			z.enum([
				"zoom",
				"page",
				"link",
			]).optional(),


		/*
		 * ========================================
		 * link 模式使用的外部網址
		 * ========================================
		 */

		link:
			z.string().url().optional(),
	}),
});

export const collections = {
	projects,
};