import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const INPUT_DIR = path.join(
	ROOT,
	"frontend",
	"public",
	"images"
);

const SUPPORTED_EXTENSIONS = new Set([
	".jpg",
	".jpeg",
	".png",
]);

const MAX_SIZE = 1500;
const WEBP_QUALITY = 82;

let processed = 0;
let failed = 0;

async function getAllImages(dir) {
	const entries = await fs.readdir(dir, {
		withFileTypes: true,
	});

	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(
			dir,
			entry.name
		);

		if (entry.isDirectory()) {
			files.push(
				...(await getAllImages(fullPath))
			);
			continue;
		}

		const ext = path.extname(
			entry.name
		).toLowerCase();

		if (
			SUPPORTED_EXTENSIONS.has(ext)
		) {
			files.push(fullPath);
		}
	}

	return files;
}

async function optimizeImage(inputPath) {
	const ext = path.extname(
		inputPath
	).toLowerCase();

	const relativePath = path.relative(
		INPUT_DIR,
		inputPath
	);

	const parsed =
		path.parse(relativePath);

	const outputPath = path.join(
		INPUT_DIR,
		parsed.dir,
		`${parsed.name}.webp`
	);

	try {
		const metadata =
			await sharp(inputPath).metadata();

		let image = sharp(inputPath);

		if (
			metadata.width &&
			metadata.height &&
			(
				metadata.width > MAX_SIZE ||
				metadata.height > MAX_SIZE
			)
		) {
			image = image.resize({
				width: MAX_SIZE,
				height: MAX_SIZE,
				fit: "inside",
				withoutEnlargement: true,
			});
		}

		await image
			.webp({
				quality: WEBP_QUALITY,
				effort: 5,
			})
			.toFile(outputPath);

		const original =
			await fs.stat(inputPath);

		const converted =
			await fs.stat(outputPath);

		const originalKB =
			original.size / 1024;

		const convertedKB =
			converted.size / 1024;

		const saved =
			(1 -
				converted.size /
					original.size) *
			100;

		console.log(
			`✓ ${relativePath}`
		);

		console.log(
			`  ${originalKB.toFixed(0)} KB → ${convertedKB.toFixed(0)} KB  (-${saved.toFixed(1)}%)`
		);

		processed++;
	} catch (error) {
		console.error(
			`✗ ${relativePath}`
		);

		console.error(
			error.message
		);

		failed++;
	}
}

async function main() {
	console.log("");
	console.log(
		"🖼️ 開始批次最佳化圖片"
	);
	console.log("");

	console.log(
		`來源：${INPUT_DIR}`
	);

	console.log(
		`最大尺寸：${MAX_SIZE}px`
	);

	console.log(
		`WebP 品質：${WEBP_QUALITY}`
	);

	console.log("");

	try {
		await fs.access(INPUT_DIR);
	} catch {
		console.error(
			"找不到 frontend/public/images"
		);

		process.exit(1);
	}

	const images =
		await getAllImages(INPUT_DIR);

	console.log(
		`找到 ${images.length} 張圖片`
	);

	console.log("");

	for (const image of images) {
		await optimizeImage(image);
	}

	console.log("");
	console.log(
		"=============================="
	);
	console.log(
		"圖片最佳化完成"
	);
	console.log(
		"=============================="
	);
	console.log(
		`成功：${processed} 張`
	);
	console.log(
		`失敗：${failed} 張`
	);
	console.log("");
}

main();
