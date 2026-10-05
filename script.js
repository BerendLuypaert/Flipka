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
