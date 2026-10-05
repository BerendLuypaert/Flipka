const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });
