// RC FITNESS PREMIUM SCRIPT

document.addEventListener('DOMContentLoaded', () => {
    // 1. LENIS SMOOTH SCROLL
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. LOADING SCREEN ANIMATION
    const loadingTimeline = gsap.timeline();

    loadingTimeline.to('.loader-bar', {
        width: '100%',
        duration: 2,
        ease: 'power4.inOut'
    })
    .to('.loader-logo', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power4.inOut'
    })
    .to('.loader', {
        height: 0,
        duration: 1.5,
        ease: 'expo.inOut',
        onComplete: () => {
            document.querySelector('.loader').style.display = 'none';
            initHeroAnimations();
        }
    });

    // Manual split for character reveal
    const splitToChars = (element) => {
        const text = element.innerText;
        element.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char;
            span.classList.add('char');
            element.appendChild(span);
        });
        return element.querySelectorAll('.char');
    };

    // Split all reveal types immediately
    document.querySelectorAll('.reveal-type').forEach(el => splitToChars(el));
    const heroTitle = document.querySelector('.hero-title');
    const titleChars = splitToChars(heroTitle);

    // 3. HERO ENTRANCE ANIMATION
    function initHeroAnimations() {
        const heroTL = gsap.timeline();
        
        heroTL.from('.hero-video-container', {
            scale: 1.5,
            duration: 2,
            ease: 'power4.out'
        }, 0)
        .to(titleChars, {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            duration: 1,
            ease: 'back.out(1.7)'
        }, 0.5);

        // Mouse Parallax for Hero
        document.querySelector('.hero').addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 40;
            const yPos = (clientY / window.innerHeight - 0.5) * 40;

            gsap.to('.hero-content', {
                x: xPos,
                y: yPos,
                duration: 1,
                ease: 'power2.out'
            });

            gsap.to('.hero-video', {
                x: -xPos * 0.5,
                y: -yPos * 0.5,
                duration: 1,
                ease: 'power2.out'
            });
        });

        // Scroll Zoom for Hero
        gsap.to('.hero-video-container', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            scale: 1.2,
            ease: 'none'
        });

        heroTL.from('.hero-subtitle', {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power4.out'
        }, 1.2)
        .from('.hero-btns .btn', {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 1,
            ease: 'power4.out'
        }, 1.4)
        .from('.hero-scroll-indicator', {
            opacity: 0,
            duration: 1
        }, 2);
    }

    // 4. FAQ ACCORDION LOGIC
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 5. BEFORE/AFTER SLIDER LOGIC
    const slider = document.querySelector('.before-after-container');
    const beforeImg = document.querySelector('.before-img');
    const handle = document.querySelector('.slider-handle');

    if (slider) {
        let isResizing = false;

        const move = (e) => {
            if (!isResizing) return;
            let x = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
            let rect = slider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            beforeImg.style.width = `${position}%`;
            handle.style.left = `${position}%`;
        };

        handle.addEventListener('mousedown', () => isResizing = true);
        handle.addEventListener('touchstart', () => isResizing = true);
        window.addEventListener('mouseup', () => isResizing = false);
        window.addEventListener('touchend', () => isResizing = false);
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move);
    }

    // 6. SCROLLTRIGGER TEXT REVEAL
    const revealTextElements = document.querySelectorAll('.reveal-type');
    revealTextElements.forEach((el) => {
        const chars = el.querySelectorAll('.char');
        gsap.to(chars, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1,
            },
            opacity: 1,
            stagger: 0.1,
            ease: 'none'
        });
    });

    // Parallax Effect for Hero Video
    gsap.to('.hero-video', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 200,
        scale: 1.2
    });

    // Section reveal items
    const revealItems = document.querySelectorAll('.reveal-item');
    revealItems.forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Pinned effect logic for Why RC Fitness
    if (window.innerWidth > 768) {
        ScrollTrigger.create({
            trigger: '.why-us',
            start: 'top top',
            end: 'bottom bottom',
            pin: '.why-text',
            scrub: true
        });
    }

    const giantTexts = document.querySelectorAll('.why-text .giant-text');
    giantTexts.forEach((text, i) => {
        gsap.to(text, {
            scrollTrigger: {
                trigger: document.querySelectorAll('.why-item')[i],
                start: 'top 50%',
                end: 'bottom 50%',
                toggleActions: 'play reverse play reverse',
            },
            color: '#D4AF37',
            webkitTextStroke: '1px #D4AF37',
            duration: 0.5
        });
    });

    // 7. FACILITY HORIZONTAL SCROLL
    const horizontalContainer = document.querySelector('.horizontal-container');
    const panels = gsap.utils.toArray('.horizontal-panel');

    if (horizontalContainer && window.innerWidth > 768) {
        gsap.to(panels, {
            xPercent: -100 * (panels.length - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: '#facility',
                pin: true,
                scrub: 1,
                end: () => '+=' + horizontalContainer.offsetWidth,
                markers: false,
            }
        });
    }

    // 8. STATS COUNTER ANIMATION
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        
        gsap.to(stat, {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            scrollTrigger: {
                trigger: stat,
                start: 'top 90%',
            }
        });
    });

    // 9. TRAINER CARD TILT & SPOTLIGHT EFFECT
    const trainerCards = document.querySelectorAll('.trainer-card');
    trainerCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Spotlight positioning
            card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--y', `${(y / rect.height) * 100}%`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // 11. PARTICLES EFFECT
    const initParticles = () => {
        const canvas = document.getElementById('hero-particles');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 100;

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    };
    initParticles();

    // 12. TESTIMONIAL CAROUSEL
    const track = document.querySelector('.testimonials-track');
    if (track) {
        const cards = track.querySelectorAll('.testimonial-card');
        const trackWidth = track.offsetWidth;
        const totalScroll = track.scrollWidth - window.innerWidth + 100;

        gsap.to(track, {
            x: -totalScroll,
            ease: 'none',
            scrollTrigger: {
                trigger: '.testimonials',
                start: 'top 20%',
                end: () => `+=${totalScroll}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });
    }

    // 10. IMAGE REVEAL ANIMATIONS
    const images = document.querySelectorAll('.panel-content img, .trainer-img img');
    images.forEach(img => {
        gsap.from(img, {
            scrollTrigger: {
                trigger: img,
                start: 'top 80%',
            },
            scale: 1.5,
            duration: 1.5,
            ease: 'power4.out'
        });
    });
});
