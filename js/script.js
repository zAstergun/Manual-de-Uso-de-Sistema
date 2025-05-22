const sections = document.querySelectorAll("main section");
const navLinks = document.querySelectorAll(".nav-link");
const subNavLinks = document.querySelectorAll("aside nav ul ul a");

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;

      navLinks.forEach((link) => link.classList.remove("active"));
      const mainNavLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (mainNavLink) mainNavLink.classList.add("active");

      subNavLinks.forEach((link) => link.classList.remove("active"));
      const subNavLink = document.querySelector(
        `aside nav ul ul a[href="#${id}"]`
      );
      if (subNavLink) {
        subNavLink.classList.add("active");
        const parentNavLink = subNavLink
          .closest("li")
          .closest("ul").previousElementSibling;
        if (parentNavLink && parentNavLink.classList.contains("nav-link")) {
          parentNavLink.classList.add("active");
        }
      }
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});
