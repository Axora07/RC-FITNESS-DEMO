document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const body = document.body;

  function toggleMobileNav() {
    burgerMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.classList.toggle('overflow-hidden');
  }

  if (burgerMenu) {
    burgerMenu.addEventListener('click', toggleMobileNav);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileNav();
      }
    });
  });

  // Header style change on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to track it further
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     STATISTICS COUNTER ANIMATION
     ========================================================================== */
  const counterElements = document.querySelectorAll('.stat-number');
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetElement = entry.target;
        const targetValue = parseInt(targetElement.getAttribute('data-target'), 10);
        const prefix = targetElement.getAttribute('data-prefix') || '';
        const suffix = targetElement.getAttribute('data-suffix') || '';
        animateCounter(targetElement, targetValue, prefix, suffix);
        observer.unobserve(targetElement);
      }
    });
  }, {
    threshold: 0.5
  });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target, prefix, suffix) {
    let start = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeProgress * target);

      el.textContent = `${prefix}${currentValue.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /* ==========================================================================
     DRAGGABLE BEFORE/AFTER SLIDER
     ========================================================================== */
  const sliderWrap = document.querySelector('.transformation-slider-wrap');
  const beforeImgContainer = document.querySelector('.transformation-img-before');
  const sliderBar = document.querySelector('.transformation-slider-bar');

  if (sliderWrap && beforeImgContainer && sliderBar) {
    let isDragging = false;

    function moveSlider(clientX) {
      const rect = sliderWrap.getBoundingClientRect();
      const positionX = clientX - rect.left;
      let percentage = (positionX / rect.width) * 100;

      // Keep boundary limits
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      beforeImgContainer.style.width = `${percentage}%`;
      sliderBar.style.left = `${percentage}%`;
    }

    // Mouse Events
    sliderWrap.addEventListener('mousedown', (e) => {
      isDragging = true;
      moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    // Touch Events for Mobile responsiveness
    sliderWrap.addEventListener('touchstart', (e) => {
      isDragging = true;
      moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      moveSlider(e.touches[0].clientX);
    });
  }

  /* ==========================================================================
     MEMBERSHIP PRICING TOGGLE
     ========================================================================== */
  const billingToggle = document.getElementById('billing-toggle');
  const essentialPrice = document.getElementById('essential-price');
  const performancePrice = document.getElementById('performance-price');
  const elitePrice = document.getElementById('elite-price');
  const billingPeriodLabel = document.querySelectorAll('.pricing-period');
  
  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;
      
      if (isAnnual) {
        // Annual rates (approx 20% discount)
        animatePriceChange(essentialPrice, 119);
        animatePriceChange(performancePrice, 199);
        animatePriceChange(elitePrice, 399);
        
        billingPeriodLabel.forEach(label => label.textContent = '/ MO, BILLED ANNUALLY');
      } else {
        // Monthly rates
        animatePriceChange(essentialPrice, 149);
        animatePriceChange(performancePrice, 249);
        animatePriceChange(elitePrice, 499);
        
        billingPeriodLabel.forEach(label => label.textContent = '/ MO, BILLED MONTHLY');
      }
    });
  }

  function animatePriceChange(element, targetPrice) {
    if (!element) return;
    
    // Premium fade out/in effect
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      element.textContent = targetPrice;
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 250);
  }

  /* ==========================================================================
     TESTIMONIALS CAROUSEL
     ========================================================================== */
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsContainer = document.querySelector('.testimonials-dots');
  const prevBtn = document.querySelector('.testimonials-arrow-prev');
  const nextBtn = document.querySelector('.testimonials-arrow-next');

  if (track && cards.length > 0) {
    let currentIndex = 0;
    let cardSize = getCardWidth();
    let isTransitioning = false;
    let autoPlayInterval;

    // Create dynamic indicators
    const itemsVisible = getVisibleItemsCount();
    const dotsCount = Math.max(1, cards.length - itemsVisible + 1);
    
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('testimonials-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          if (isTransitioning) return;
          goToSlide(i);
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    }

    const dots = document.querySelectorAll('.testimonials-dot');

    function getCardWidth() {
      if (!track) return 0;
      const style = window.getComputedStyle(track);
      const gap = parseInt(style.gap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    }

    function getVisibleItemsCount() {
      const width = window.innerWidth;
      if (width > 1024) return 3;
      if (width > 768) return 2;
      return 1;
    }

    function goToSlide(index) {
      if (index < 0) index = 0;
      const maxIndex = cards.length - getVisibleItemsCount();
      if (index > maxIndex) index = maxIndex;

      currentIndex = index;
      isTransitioning = true;
      
      cardSize = getCardWidth();
      track.style.transform = `translateX(-${currentIndex * cardSize}px)`;
      
      // Update dots
      if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
          dots[currentIndex].classList.add('active');
        }
      }
      
      setTimeout(() => {
        isTransitioning = false;
      }, 600);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        if (currentIndex > 0) {
          goToSlide(currentIndex - 1);
        } else {
          // Wrap to end
          goToSlide(cards.length - getVisibleItemsCount());
        }
        resetAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        const maxIndex = cards.length - getVisibleItemsCount();
        if (currentIndex < maxIndex) {
          goToSlide(currentIndex + 1);
        } else {
          // Wrap to start
          goToSlide(0);
        }
        resetAutoPlay();
      });
    }

    // Auto Play Functionality
    function startAutoPlay() {
      autoPlayInterval = setInterval(() => {
        if (isTransitioning) return;
        const maxIndex = cards.length - getVisibleItemsCount();
        if (currentIndex < maxIndex) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(0);
        }
      }, 5000); // Auto scroll every 5s
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    startAutoPlay();

    // Pause auto play on hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Re-adjust slide size on resize
    window.addEventListener('resize', () => {
      goToSlide(currentIndex);
    });
  }

  /* ==========================================================================
     LIGHTBOX GALLERY
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (galleryItems.length > 0 && lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('.gallery-img');
        const imgSrc = img.getAttribute('src');
        
        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', img.getAttribute('alt') || 'Gym view');
        
        lightbox.classList.add('active');
        body.classList.add('overflow-hidden');
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      body.classList.remove('overflow-hidden');
      // Wait for transition before resetting src to avoid visual flash
      setTimeout(() => {
        lightboxImg.setAttribute('src', '');
      }, 300);
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Escape key press to close lightbox
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ==========================================================================
     LEAD CAPTURE FORM VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('rc-contact-form');
  const formResponseMsg = document.querySelector('.form-response-msg');

  if (contactForm && formResponseMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      
      // Basic input validation
      if (!name || !email || !phone) {
        showFormResponse('Please fill in all required fields.', 'error');
        return;
      }
      
      if (!validateEmail(email)) {
        showFormResponse('Please enter a valid email address.', 'error');
        return;
      }

      // Visual sending state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing Access...</span>';
      
      // Mock API call to simulate high-end server processing
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Success state
        showFormResponse('ACCESS GRANTED. One of our Concierge Officers will contact you shortly.', 'success');
        contactForm.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          formResponseMsg.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  function showFormResponse(text, type) {
    formResponseMsg.textContent = text;
    formResponseMsg.className = 'form-response-msg'; // Reset
    formResponseMsg.classList.add(type);
    formResponseMsg.style.display = 'block';
  }
});
