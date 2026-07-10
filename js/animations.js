// ========== BLUR ON SCROLL OBSERVER ==========
function initBlurOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
    },
  );

  // Observe all blur-on-scroll elements
  document.querySelectorAll(".blur-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}

// ========== PARALLAX SCROLL EFFECT ==========
function initParallax() {
  const parallaxElements = document.querySelectorAll(".parallax-bg");

  if (parallaxElements.length === 0) return;

  window.addEventListener("scroll", () => {
    parallaxElements.forEach((el) => {
      const scrollY = window.scrollY;
      const offset = scrollY * 0.5; // Adjust speed (0.5 = slower)
      el.style.transform = `translateY(${offset}px)`;
    });
  });
}

// ========== PRELOAD BLUR STATE ==========
function preloadBlurState() {
  document
    .querySelectorAll(".blur-on-scroll")
    .forEach((el) => el.classList.add("loaded"));
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  preloadBlurState();
  initBlurOnScroll();
  initParallax();
});
