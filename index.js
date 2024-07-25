document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;

    function showNextSlide() {
        // Remove the 'active' class from the current slide
        slides[currentIndex].classList.remove('active');

        // Update the currentIndex to the next slide, wrapping around using modulo
        currentIndex = (currentIndex + 1) % slides.length;

        // Add the 'active' class to the new current slide
        slides[currentIndex].classList.add('active');
    }

    // Set an interval to automatically change to the next slide every 3000 milliseconds (3 seconds)
    setInterval(showNextSlide, 3000);
});

// Note: Ensure the first slide has the class 'active' in your HTML to start the slideshow
