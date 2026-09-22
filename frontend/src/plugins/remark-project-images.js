export function remarkProjectImages() {
	return function (tree) {
		const children = tree.children;

		const isImageParagraph = (node) => {
			return (
				node?.type === "paragraph" &&
				node.children?.length === 1 &&
				node.children[0]?.type === "image"
			);
		};

		const isCaptionParagraph = (node) => {
			return (
				node?.type === "paragraph" &&
				node.children?.length === 1 &&
				node.children[0]?.type === "emphasis"
			);
		};

		const createImageGrid = (imageNodes) => {
			return {
				type: "html",
				value: `<div class="image-grid">${imageNodes
					.map((node) => {
						const image = node.children[0];

						const src = image.url || "";
						const alt = image.alt || "";

						return `<img src="${src}" alt="${alt}" />`;
					})
					.join("")}</div>`,
			};
		};

		const newChildren = [];

		for (let i = 0; i < children.length; i++) {
			const current = children[i];
			const next = children[i + 1];
			const caption = children[i + 2];

			/*
			 * =====================================================
			 * 兩張連續圖片
			 * =====================================================
			 *
			 * Markdown 正常寫：
			 *
			 * ![圖片 1](...)
			 *
			 * ![圖片 2](...)
			 *
			 * *共同圖說*
			 *
			 * 中間保留一個空白行沒有問題。
			 */

			if (
				isImageParagraph(current) &&
				isImageParagraph(next)
			) {
				newChildren.push(
					createImageGrid([current, next])
				);

				/*
				 * 如果下一個是共同圖說，
				 * 一起保留下來。
				 */
				if (isCaptionParagraph(caption)) {
					newChildren.push(caption);
					i += 2;
				} else {
					i += 1;
				}

				continue;
			}

			/*
			 * =====================================================
			 * 單張圖片
			 * =====================================================
			 */

			if (isImageParagraph(current)) {
				newChildren.push(current);
				continue;
			}

			newChildren.push(current);
		}

		tree.children = newChildren;
	};
}