document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Logic
    const preloader = document.querySelector('.preloader-container');
    const countSpan = document.querySelector('.count');
    const body = document.body;

    // Freeze scroll initially
    body.style.overflow = 'hidden';

    let loadCount = 0;
    const updateCount = () => {
        loadCount++;
        if (countSpan) { // Check if countSpan exists before updating
            countSpan.textContent = loadCount;
        }

        if (loadCount < 100) {
            // Randomize speed for realism
            setTimeout(updateCount, Math.random() * 20 + 10);
        } else {
            // Load Complete
            if (countSpan) {
                countSpan.style.color = 'var(--accent)';
                countSpan.style.transition = 'color 0.3s ease';
                const percentSpan = document.querySelector('.percent');
                if (percentSpan) {
                    percentSpan.style.color = 'var(--accent)';
                    percentSpan.style.transition = 'color 0.3s ease';
                }
            }

            setTimeout(() => {
                if (preloader) { // Check if preloader exists before adding class
                    preloader.classList.add('preloader-hidden');
                }
                body.style.overflow = ''; // Restore scroll

                // Trigger Hero Animations after loader clears
                setTimeout(() => {
                    const hero = document.querySelector('.hero');
                    if (hero) { // Check if hero exists
                        hero.classList.add('hero-visible');
                    }
                    // Remove preloader from DOM for performance
                    if (preloader) {
                        preloader.remove();
                    }
                }, 1000);
            }, 500);
        }
    };

    updateCount();

    // 3. Smooth Scrolling (Lenis)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo Out
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 4. Custom Cursor Logic (Advanced)
    const cursor = document.querySelector('.cursor-dot');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const speed = 0.15; // Slightly heavier lag

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Default cursor state
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursor.textContent = '';
        cursor.classList.remove('cursor-text-mode');
    });

    // RAF for smooth cursor
    function animateCursor() {
        const dist = mouseX - cursorX;
        const distY = mouseY - cursorY;

        cursorX = cursorX + (dist * speed);
        cursorY = cursorY + (distY * speed);

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Sticking to native high-quality scroll for now to ensure no bugs.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 4. Reveal Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 

                // Manually trigger simple inline styles if classes aren't enough
                if (entry.target.classList.contains('reveal-opacity')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);

    // Initial styles for js-reveals
    const revealElements = document.querySelectorAll('.reveal-opacity, .reveal-slide, .project-item');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // Add Intersection Observer callback to handle the transition
    // (The Loop above sets initial state, the observer changes it back)
    // We need to modify the observer logic slightly to match the inline styles:
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
});
