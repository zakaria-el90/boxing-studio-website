document.addEventListener("DOMContentLoaded", () => {
    const current = document.body.dataset.page;
    if (!current) return;

    const links = document.querySelectorAll(".nav-button");
    links.forEach((link) => {
        if (link.dataset.page === current) {
            link.classList.add("active");
        }
    });

    // Mobile Menu Toggle
    const toggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            toggle.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", isOpen);
        });
    }
});
