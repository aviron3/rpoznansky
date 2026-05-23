const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const scrollLinks = document.querySelectorAll("[data-scroll-link]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxMeta = document.querySelector("[data-lightbox-meta]");
const lightboxCloseTriggers = document.querySelectorAll("[data-lightbox-close]");
const lightboxButtons = document.querySelectorAll("[data-lightbox-src]");

let lastFocusedElement = null;
let scrollTicking = false;

function closeMenu() {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  menuToggle.innerHTML = '<svg><use href="#icon-menu"></use></svg>';
  mobileMenu.hidden = true;
  document.body.classList.remove("menu-open");
}

function openMenu() {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");
  menuToggle.innerHTML = '<svg><use href="#icon-x"></use></svg>';
  mobileMenu.hidden = false;
  document.body.classList.add("menu-open");
}

function handleSmoothScroll(event, targetId) {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  event.preventDefault();

  const offset = 80;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
  closeMenu();
}

function updateScrollEffects() {
  const scrollY = window.scrollY;
  const root = document.documentElement;

  header?.classList.toggle("scrolled", scrollY > 20);

  root.style.setProperty("--orb-one-x", `${scrollY * 0.3}px`);
  root.style.setProperty("--orb-one-y", `${scrollY * 0.2}px`);
  root.style.setProperty("--hero-copy-y", `${scrollY * 0.15}px`);

  const opacity = Math.max(0.32, 1 - scrollY / 900);
  root.style.setProperty("--hero-copy-opacity", opacity.toFixed(3));

  scrollTicking = false;
}

function requestScrollEffects() {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;
  window.requestAnimationFrame(updateScrollEffects);
}

function blockTouchScroll(e) {
  e.preventDefault();
}

function openLightbox(button) {
  if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxMeta) {
    return;
  }

  lastFocusedElement = document.activeElement;
  lightboxImage.src = button.dataset.lightboxSrc || "";
  lightboxImage.alt = button.querySelector("img")?.alt || "";
  lightboxTitle.textContent = button.dataset.lightboxTitle || "";
  lightboxMeta.textContent = button.dataset.lightboxMeta || "";
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  lightbox.addEventListener("touchmove", blockTouchScroll, { passive: false });
  lightbox.querySelector(".lightbox-close")?.focus();
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.classList.remove("menu-open");
  lightbox.removeEventListener("touchmove", blockTouchScroll);
  lastFocusedElement?.focus?.();
}

menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  if (expanded) {
    closeMenu();
  } else {
    openMenu();
  }
});

scrollLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || !href.startsWith("#")) {
    return;
  }

  link.addEventListener("click", (event) => {
    handleSmoothScroll(event, href.slice(1));
  });
});

window.addEventListener("scroll", requestScrollEffects, { passive: true });
window.addEventListener("resize", requestScrollEffects);
updateScrollEffects();

lightboxButtons.forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});

lightboxCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeLightbox();
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!formStatus) {
    return;
  }

  formStatus.textContent = "Thanks for reaching out. This form is still front-end only for now, but the message flow is ready to be wired up.";
  contactForm.reset();

  window.setTimeout(() => {
    formStatus.textContent = "";
  }, 3000);
});
