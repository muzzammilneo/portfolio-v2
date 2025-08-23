// Optional scroll indicator animation
document.addEventListener("scroll", () => {
  const scrollText = document.querySelector(".scroll");
  if (window.scrollY > 100) {
    scrollText.style.opacity = "0";
  } else {
    scrollText.style.opacity = "1";
  }
});
