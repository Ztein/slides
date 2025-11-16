// Navigation module for MCP presentation slides
(function() {
    'use strict';

    // All available slides
    const slides = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const totalSlides = slides[slides.length - 1]; // Use last slide number (19) instead of count

    // Extract current slide number from filename
    function getCurrentSlideNumber() {
        const filename = window.location.pathname.split('/').pop();
        const match = filename.match(/(\d+)\.html/);
        if (match) {
            return parseInt(match[1], 10);
        }
        return null;
    }

    // Navigate to a specific slide
    function goToSlide(slideNumber) {
        const paddedNumber = slideNumber.toString().padStart(3, '0');
        window.location.href = `${paddedNumber}.html`;
    }

    // Navigate to next slide
    function goNext() {
        const currentSlide = getCurrentSlideNumber();
        if (!currentSlide) return;
        
        const currentIndex = slides.indexOf(currentSlide);
        if (currentIndex < slides.length - 1) {
            goToSlide(slides[currentIndex + 1]);
        }
    }

    // Navigate to previous slide
    function goPrevious() {
        const currentSlide = getCurrentSlideNumber();
        if (!currentSlide) return;
        
        const currentIndex = slides.indexOf(currentSlide);
        if (currentIndex > 0) {
            goToSlide(slides[currentIndex - 1]);
        }
    }

    // Navigate to first slide
    function goToFirst() {
        goToSlide(slides[0]);
    }

    // Navigate to last slide
    function goToLast() {
        goToSlide(slides[slides.length - 1]);
    }

    // Initialize navigation when DOM is ready
    function initNavigation() {
        const currentSlide = getCurrentSlideNumber();
        if (!currentSlide) {
            console.warn('Could not determine current slide number');
            return;
        }

        const currentIndex = slides.indexOf(currentSlide);
        const slideIndicator = document.getElementById('slideIndicator');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Update slide indicator
        if (slideIndicator) {
            slideIndicator.textContent = `${currentSlide}/${totalSlides}`;
        }

        // Enable/disable buttons based on position
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = currentIndex === slides.length - 1;
        }

        // Button event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', goNext);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', goPrevious);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Prevent navigation when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            switch(e.key) {
                case 'ArrowRight':
                case 'PageDown':
                case ' ': // Spacebar
                    e.preventDefault();
                    goNext();
                    break;
                case 'ArrowLeft':
                case 'PageUp':
                    e.preventDefault();
                    goPrevious();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToFirst();
                    break;
                case 'End':
                    e.preventDefault();
                    goToLast();
                    break;
            }
        });
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
})();

