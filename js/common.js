// ========== ACTIVE NAVIGATION STATE ==========
function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".head-right a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// ========== HAMBURGER MENU (MOBILE) ==========
function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const headRight = document.querySelector(".head-right");

  if (!hamburger) return; // Only on mobile view

  hamburger.addEventListener("click", () => {
    headRight.classList.toggle("mobile-active");
    hamburger.classList.toggle("active");
  });

  // Close menu when a link is clicked
  const navLinks = headRight.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      headRight.classList.remove("mobile-active");
      hamburger.classList.remove("active");
    });
  });
}

// ========== SMOOTH SCROLL TO SECTIONS ==========
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initHamburgerMenu();
});
