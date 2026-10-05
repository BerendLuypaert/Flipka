const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");

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

updateHeaderState();
window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
