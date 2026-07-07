import imagesLoaded from "imagesloaded";

// Preloader element reference
let loading;

// Initialize the preloader element.
const initializeElements = () => {
	loading = document.querySelector(".loading");
};

// Load all images and background images on the page.
const loadImages = () => {
	return new Promise((resolve) => {
		// Collect all <img> elements
		const imgElements = document.querySelectorAll("img");

		// Collect elements with background images
		const bgElements = [...document.querySelectorAll("*")].filter((el) => {
			const style = window.getComputedStyle(el);
			return style.backgroundImage !== "none";
		});

		const allElements = [...imgElements, ...bgElements];

		const imgLoad = imagesLoaded(allElements, {
			background: true,
		});

		// 顯示哪些圖片失敗
		imgLoad.on("fail", () => {
			console.warn("Some images failed to load.");
		});

		// 無論成功或失敗，都繼續
		imgLoad.on("always", () => {
			resolve();
		});
	});
};

// Load assets and dispatch a custom event.
const loadAssets = async () => {
	await loadImages();

	document.dispatchEvent(
		new CustomEvent("assetsLoaded")
	);
};

// Show the preloader, load assets, then always hide it.
const toggleLoading = async () => {
	if (!loading) return;

	if (sessionStorage.getItem("preloadComplete") === "true") {
		hide();
		return;
	}

	show();

	try {
		await loadAssets();
		sessionStorage.setItem("preloadComplete", "true");
	} catch (error) {
		console.error(error);
	} finally {
		hide();
	}
};

// Display the preloader.
const show = () => {
	if (loading) {
		loading.classList.remove("hidden");
	}
};

// Hide the preloader.
const hide = () => {
	if (loading) {
		loading.classList.add("hidden");
	}
};

// Cleanup.
const cleanup = () => {
	loading = null;
};

// Initialize.
const init = () => {
	initializeElements();
	toggleLoading();
};

// Execute callback only on homepage.
const handlePageEvent = (callback) => {
	const page = document.documentElement.getAttribute("data-page");

	if (page === "home") {
		callback();
	}
};

// Astro page events
document.addEventListener("astro:page-load", () => {
	handlePageEvent(init);
});

document.addEventListener("astro:before-swap", () => {
	handlePageEvent(cleanup);
});

// Show loader again after refresh
window.addEventListener("beforeunload", () => {
	sessionStorage.removeItem("preloadComplete");
});