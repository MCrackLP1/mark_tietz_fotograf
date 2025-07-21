document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.testimonial-slides');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.testimonial-dots');
  let currentSlide = 0;

  if (slides.length > 0 && slider && dotsContainer) {
    const slideCount = slides.length;
    let dots = [];

    // Clear existing dots and create new ones
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }

    // Set initial slide positions
    function initSlider() {
      slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${index * 100}%)`;
      });
      updateDots();
    }

    // Update dot indicators
    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
      currentSlide = (slideIndex + slideCount) % slideCount;
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      updateDots();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    let slideInterval = setInterval(nextSlide, 7000); // Increased interval

    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
      sliderContainer.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 7000));

      let touchStartX = 0;
      let touchEndX = 0;

      sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        if (touchEndX < touchStartX) nextSlide();
        if (touchEndX > touchStartX) prevSlide();
      }
    }
    
    initSlider();
  }
});
