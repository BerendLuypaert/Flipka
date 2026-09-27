const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}
