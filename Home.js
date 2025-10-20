const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");

let currentIndex = 0;

function updateCarousel() {
  const slideWidth = slides[0].getBoundingClientRect().width;
  track.style.transform = "translateX(-" + slideWidth * currentIndex + "px)";
}

nextButton.addEventListener("click", () => {
  if (currentIndex < slides.length - 1) {
    currentIndex++;
    updateCarousel();
  }
});

prevButton.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});
