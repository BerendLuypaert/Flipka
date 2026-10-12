const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const dropdowns = document.querySelectorAll(".nav-dropdown");

let isCompact = false;
let ticking = false;

const updateHeaderState = () => {
  if (!header) return;

  const shouldCompact = isCompact ? window.scrollY > 10 : window.scrollY > 42;
  if (shouldCompact !== isCompact) {
    isCompact = shouldCompact;
    header.classList.toggle("is-scrolled", isCompact);
  }
};

const requestHeaderUpdate = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateHeaderState();
    ticking = false;
  });
};

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

dropdowns.forEach((dropdown) => {
  const button = dropdown.querySelector(".nav-dropdown-toggle");
  const menu = dropdown.querySelector(".nav-dropdown-menu");

  if (!button || !menu) return;

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("is-open");
    menu.hidden = !isOpen;
    button.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", () => {
    dropdown.classList.remove("is-open");
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
    header?.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", () => {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("is-open");
    const menu = dropdown.querySelector(".nav-dropdown-menu");
    if (menu) menu.hidden = true;
    dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("is-open");
    const menu = dropdown.querySelector(".nav-dropdown-menu");
    if (menu) menu.hidden = true;
    dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
});

updateHeaderState();
window.addEventListener("scroll", requestHeaderUpdate, { passive: true });

const flipbook = document.querySelector("[data-flipbook]");

if (flipbook) {
  const pages = [...flipbook.querySelectorAll("[data-page]")];
  const previousButton = flipbook.querySelector("[data-flip-prev]");
  const nextButton = flipbook.querySelector("[data-flip-next]");
  const counter = flipbook.querySelector("[data-flip-count]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentPage = 0;
  let direction = 1;
  let isPaused = false;

  const renderFlipbook = () => {
    pages.forEach((page, index) => {
      const isCurrent = index === currentPage;
      const isFlipped = index < currentPage;
      const zIndex = isFlipped ? index + 1 : pages.length - index;

      page.classList.toggle("is-current", isCurrent);
      page.classList.toggle("is-flipped", isFlipped);
      page.style.zIndex = String(zIndex);
    });

    if (previousButton) previousButton.disabled = currentPage === 0;
    if (nextButton) nextButton.disabled = currentPage === pages.length - 1;
    if (counter) counter.textContent = `${String(currentPage + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
  };

  const showPage = (pageIndex) => {
    currentPage = Math.max(0, Math.min(pageIndex, pages.length - 1));
    renderFlipbook();
  };

  const nextPage = () => showPage(currentPage + 1);
  const previousPage = () => showPage(currentPage - 1);

  previousButton?.addEventListener("click", previousPage);
  nextButton?.addEventListener("click", nextPage);

  pages.forEach((page) => {
    page.addEventListener("click", () => {
      if (currentPage < pages.length - 1) nextPage();
    });
  });

  flipbook.addEventListener("mouseenter", () => { isPaused = true; });
  flipbook.addEventListener("mouseleave", () => { isPaused = false; });
  flipbook.addEventListener("focusin", () => { isPaused = true; });
  flipbook.addEventListener("focusout", () => { isPaused = false; });

  flipbook.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") previousPage();
    if (event.key === "ArrowRight") nextPage();
  });

  renderFlipbook();

  if (!reducedMotion) {
    window.setInterval(() => {
      if (isPaused) return;
      if (currentPage === pages.length - 1) direction = -1;
      if (currentPage === 0) direction = 1;
      showPage(currentPage + direction);
    }, 5200);
  }
}
