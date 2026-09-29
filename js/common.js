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

async function updateAccountNavigation() {
  const accountLink = document.querySelector(
    '.head-right a[href="auth.html"], .head-right a[href="profile.html"]',
  );
  if (!accountLink) return;

  try {
    const response = await fetch("./api/session.php", {
      credentials: "same-origin",
    });
    if (!response.ok) return;

    const result = await response.json();
    if (!result.authenticated) return;
    accountLink.href = "profile.html";
    accountLink.textContent = "PROFILE";
    accountLink.setAttribute("aria-label", `Profile for ${result.player_name}`);
    if (window.location.pathname.split("/").pop() === "profile.html") {
      accountLink.classList.add("active");
    }
  } catch {
    // Leave the access link unchanged when the account service is unavailable.
  }
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
  updateAccountNavigation();
});
