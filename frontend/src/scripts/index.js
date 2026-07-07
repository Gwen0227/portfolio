import gsap from "gsap";

// DOM elements and animation-related variables
let lines;
let textSliders;
let gridContainer;
let gridItems;
let hasPreloaderComponent;
let animationTimeline;

// Initialize DOM elements
const initializeVariables = () => {
	lines = document.querySelectorAll("hr");
	textSliders = document.querySelectorAll("header .oh > .oh__inner");
	gridContainer = document.querySelector("[data-grid]");
	gridItems = gridContainer ? Array.from(gridContainer.children) : [];
	hasPreloaderComponent = document.querySelector(".loading");
};

// Homepage animation
const animateHomepageElements = () => {
	if (!gridContainer || !gridItems.length) return;

	// 先隱藏作品區
	gsap.set(gridContainer, { autoAlpha: 0 });

	animationTimeline = gsap.timeline({
		defaults: {
			duration: 1.2,
			ease: "power3.out",
		},
		onComplete: () => {
			document.dispatchEvent(new CustomEvent("gridRendered"));
		},
	});

	// Header 線條
	animationTimeline.fromTo(
		lines,
		{
			transformOrigin: "0% 50%",
			scaleX: 0,
		},
		{
			duration: 1,
			scaleX: 1,
			stagger: 0.2,
			ease: "power2.out",
		},
	);

	// Header 文字
	animationTimeline.from(
		textSliders,
		{
			yPercent: 100,
			stagger: 0.05,
		},
		0.1
	);

	// 顯示作品區
	animationTimeline.set(
		gridContainer,
		{
			autoAlpha: 1,
		},
		"<+=0.2"
	);

	// ★ 所有作品一起淡入（不再一張張）
	animationTimeline.from(
		gridItems,
		{
			autoAlpha: 0,
			duration: 0.45,
			ease: "power2.out",
		},
		"<"
	);
};

// Cleanup
const cleanup = () => {
	if (animationTimeline) {
		animationTimeline.kill();
		animationTimeline = null;
	}

	lines = null;
	textSliders = null;
	gridContainer = null;
	gridItems = null;
	hasPreloaderComponent = null;
};

// Init
const init = () => {
	initializeVariables();

	if ("scrollRestoration" in history) {
		history.scrollRestoration = "manual";
	}

	window.scrollTo(0, 0);

	if (
		hasPreloaderComponent &&
		sessionStorage.getItem("preloadComplete") !== "true"
	) {
		document.addEventListener("assetsLoaded", animateHomepageElements, {
			once: true,
		});
	} else {
		animateHomepageElements();
	}
};

// Run only on homepage
const handlePageEvent = (_, callback) => {
	const page = document.documentElement.getAttribute("data-page");

	if (page === "home") {
		callback();
	}
};

// Astro lifecycle
document.addEventListener("astro:page-load", () => {
	handlePageEvent("page-load", init);
});

document.addEventListener("astro:before-swap", () => {
	handlePageEvent("before-swap", cleanup);
});