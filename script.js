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
const flipbookScroll = document.querySelector("[data-flipbook-scroll]");

if (flipbook && flipbookScroll) {
  const pages = [...flipbook.querySelectorAll("[data-page]")];
  let currentPage = -1;
  let tickingFlipbook = false;

  const renderFlipbook = (pageIndex) => {
    if (pageIndex === currentPage) return;
    currentPage = pageIndex;

    pages.forEach((page, index) => {
      page.classList.toggle("is-current", index === currentPage);
      page.classList.toggle("is-flipped", index !== currentPage);
      page.style.zIndex = String(index < currentPage ? index + 1 : pages.length - index);
    });
  };

  const updateFlipbookFromScroll = () => {
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const availableHeight = window.innerHeight - headerHeight;
    const centeredTop = headerHeight + Math.max(16, (availableHeight - flipbook.offsetHeight) / 2);
    const stickTop = Math.max(headerHeight + 16, centeredTop);
    const sectionRect = flipbookScroll.getBoundingClientRect();
    const hasStarted = sectionRect.top <= stickTop;
    const hasFinished = sectionRect.bottom <= stickTop + flipbook.offsetHeight;

    flipbook.style.setProperty("--flipbook-top", `${centeredTop}px`);
    flipbook.classList.toggle("is-pinned", hasStarted && !hasFinished);
    flipbook.classList.toggle("is-finished", hasFinished);

    const scrollDistance = Math.max(1, flipbookScroll.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -sectionRect.top / scrollDistance));
    const pageIndex = Math.min(pages.length - 1, Math.floor(progress * pages.length));
    renderFlipbook(pageIndex);
  };

  const requestFlipbookUpdate = () => {
    if (tickingFlipbook) return;
    tickingFlipbook = true;
    window.requestAnimationFrame(() => {
      updateFlipbookFromScroll();
      tickingFlipbook = false;
    });
  };

  renderFlipbook(0);
  updateFlipbookFromScroll();
  window.addEventListener("scroll", requestFlipbookUpdate, { passive: true });
  window.addEventListener("resize", requestFlipbookUpdate);
}
