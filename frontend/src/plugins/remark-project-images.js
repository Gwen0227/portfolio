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

		const createDiv = (className, children) => {
			return {
				type: "paragraph",
				data: {
					hName: "div",
					hProperties: {
						className: className.split(" "),
					},
				},
				children,
			};
		};

		const newChildren = [];

		for (let i = 0; i < children.length; i++) {
			const current = children[i];

			// --------------------------------------------------
			// 兩張連續圖片
			// --------------------------------------------------
			if (
				isImageParagraph(current) &&
				isImageParagraph(children[i + 1])
			) {
				const image1 = current;
				const image2 = children[i + 1];

				// 找兩張圖片後面是否緊接著共同圖說
				const caption = children[i + 2];

				const imageGrid = createDiv("image-grid", [
					image1,
					image2,
				]);

				newChildren.push(imageGrid);

				// 如果後面是 *斜體圖說*，一起保留
				if (isCaptionParagraph(caption)) {
					newChildren.push(caption);
					i += 2;
				} else {
					i += 1;
				}

				continue;
			}

			// --------------------------------------------------
			// 單張圖片
			// --------------------------------------------------
			if (isImageParagraph(current)) {
				const caption = children[i + 1];

				// 單張圖片＋斜體圖說
				if (isCaptionParagraph(caption)) {
					const imageWithCaption = createDiv("image-with-caption", [
						current,
						caption,
					]);

					newChildren.push(imageWithCaption);
					i += 1;

					continue;
				}

				// 單純單張圖片
				newChildren.push(current);
				continue;
			}

			newChildren.push(current);
		}

		tree.children = newChildren;
	};
}