// frontend/src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./src/content/projects", // 🎯 指定去抓此路徑下的 Markdown 檔案
    }),
    schema: z.object({
        title: z.string(),
        slug: z.string(),
        year: z.number(),
        cover: z.string(),
        tech: z.array(z.string()),
        category: z.string().optional(),
        github: z.string().optional(),
        demo: z.string().optional(),
        // 🚀 核心修正：讓每個作品可以個別設定 "zoom" (放大) 或 "page" (內頁)
        mode: z.enum(["zoom", "page"]).optional(),
    }),
});

export const collections = {
    projects,
};