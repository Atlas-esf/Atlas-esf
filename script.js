// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', function() {
    // Create all Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize animations and interactions
    initScrollAnimations();
    initPriceToggles();
    initParallaxEffect();
    initProductCards();
    initSmoothScroll();
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(function(card) {
        observer.observe(card);
    });

    // Observe model cards
    const modelCards = document.querySelectorAll('.model-card');
    modelCards.forEach(function(card) {
        observer.observe(card);
    });

    // Observe contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(function(card) {
        observer.observe(card);
    });
}

// Price Toggle Functionality
function initPriceToggles() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(function(card) {
        const toggleBtn = card.querySelector('.price-toggle-btn');
        const priceDisplay = card.querySelector('.price-display');
        
        if (toggleBtn && priceDisplay) {
            // Toggle button click
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Hide all other price displays first
                document.querySelectorAll('.price-display').forEach(function(display) {
                    if (display !== priceDisplay) {
                        display.classList.add('hidden');
                    }
                });
                
                // Reset all other toggle buttons
                document.querySelectorAll('.price-toggle-btn').forEach(function(btn) {
                    if (btn !== toggleBtn) {
                        btn.style.display = 'flex';
                    }
                });
                
                // Toggle current price display
                toggleBtn.style.display = 'none';
                priceDisplay.classList.remove('hidden');
                
                // Reinitialize icons for the new elements
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
            
            // Price display click to hide
            priceDisplay.addEventListener('click', function(e) {
                e.stopPropagation();
                priceDisplay.classList.add('hidden');
                toggleBtn.style.display = 'flex';
                
                // Reinitialize icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        }
    });
    
    // Close price displays when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.price-display').forEach(function(display) {
            display.classList.add('hidden');
        });
        document.querySelectorAll('.price-toggle-btn').forEach(function(btn) {
            btn.style.display = 'flex';
        });
    });
}

// Parallax Effect
function initParallaxEffect() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const parallaxBg = document.querySelector('.parallax-bg');
                
                if (parallaxBg) {
                    parallaxBg.style.transform = 'translateY(' + (scrolled * 0.5) + 'px)';
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// Product Cards Animation on Scroll
function initProductCards() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(function(card, index) {
        setTimeout(function() {
            card.style.animationDelay = (index * 150) + 'ms';
        }, 100);
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Image Loading with Fallback
function handleImageError(img) {
    img.style.opacity = '0.5';
    console.warn('Image failed to load:', img.src);
}

// Add image error handlers
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
});

// Performance Optimization: Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy Loading for Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(function(img) {
        imageObserver.observe(img);
    });
}

// Handle page visibility for animations
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('.animate-pulse, .animate-spin, .animate-bounce').forEach(function(el) {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page is visible
        document.querySelectorAll('.animate-pulse, .animate-spin, .animate-bounce').forEach(function(el) {
            el.style.animationPlayState = 'running';
        });
    }
});

// Preload critical images
function preloadImages() {
    const imagesToPreload = [
        'logo.jpg',
        'P1.jpg',
        'P2.jpg',
        'P3.jpg',
        'P4.jpg'
    ];

    imagesToPreload.forEach(function(src) {
        const img = new Image();
        img.src = src;
    });
}

// Call preload when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadImages);
} else {
    preloadImages();
}

// Add loading state
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Reinitialize all Lucide icons after page load
    setTimeout(function() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
});

// Handle external links
document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
    link.setAttribute('rel', 'noopener noreferrer');
});

// Console message
console.log('%c🏗️ جرثقیل سازی اطلس اصفهان', 'font-size: 20px; font-weight: bold; color: #f59e0b;');
console.log('%cWebsite developed with ❤️', 'font-size: 14px; color: #64748b;');

// Performance monitoring (optional)
if (window.performance) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('⚡ Page load time:', pageLoadTime + 'ms');
        }, 0);
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close price displays
    if (e.key === 'Escape') {
        document.querySelectorAll('.price-display').forEach(function(display) {
            display.classList.add('hidden');
        });
        document.querySelectorAll('.price-toggle-btn').forEach(function(btn) {
            btn.style.display = 'flex';
        });
    }
});

// Add touch support detection
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

// Re-initialize icons periodically to catch any dynamic content
setInterval(function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}, 2000);
