const navBar = document.querySelector("[data-nav]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = menu ? Array.from(menu.querySelectorAll("a")) : [];
const revealNodes = document.querySelectorAll(".reveal");
const sectionNodes = Array.from(document.querySelectorAll("main section[id]"));

let lastScrollY = window.scrollY;

function setMenuState(open) {
  if (!menu || !menuToggle) return;

  menu.classList.toggle("is-open", open);
  menuToggle.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    setMenuState(open);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener(
  "scroll",
  () => {
    const currentScrollY = window.scrollY;
    const shouldHide = currentScrollY > lastScrollY && currentScrollY > 96;

    if (navBar) {
      navBar.classList.toggle("is-hidden", shouldHide);
    }

    lastScrollY = Math.max(currentScrollY, 0);
  },
  { passive: true }
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeId = entry.target.id;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-20% 0px -45% 0px",
  }
);

sectionNodes.forEach((section) => sectionObserver.observe(section));

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    setMenuState(false);
  }
});
