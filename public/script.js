document.addEventListener("DOMContentLoaded", () => {
  const current = document.body.dataset.page;
  if (!current) return;

  const links = document.querySelectorAll(".nav-button");
  links.forEach((link) => {
    if (link.dataset.page === current) {
      link.classList.add("is-active");
    }
  });
});
