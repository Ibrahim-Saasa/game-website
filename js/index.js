const nextButton = document.querySelector(".next-btn");
const video = document.querySelector(".hero-video");

const movieList = [
  "videos/hero-1.mp4",
  "videos/hero-2.mp4",
  "videos/hero-3.mp4",
  "videos/hero-4.mp4",
];

let index = 0;
nextButton.addEventListener("click", function () {
  index += 1;
  video.src = movieList[index];

  if (index === 3) {
    index = -1;
  }
});

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
  }
);

// Observe hero section
const heroSection = document.querySelector(".hero-section");
observer.observe(heroSection);

document
  .querySelectorAll(".blur-on-scroll")
  .forEach((el) => el.classList.add("loaded"));
