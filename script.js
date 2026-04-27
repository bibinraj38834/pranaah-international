/* ============================================================
   PRANAAH INTERNATIONAL — JAVASCRIPT
   Full interactivity: nav, roles, testimonials, counter,
   particles, form validation, scroll-reveal, back-to-top
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────
     1. NAVBAR
  ────────────────────────────────────── */
  var navbar = document.getElementById('navbar');
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var sections = document.querySelectorAll('section[id]');

  function onNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
    toggleBackToTop();
  }

  window.addEventListener('scroll', onNavScroll, { passive: true });
  onNavScroll();

  // Hamburger toggle
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      var isOpen = hamburgerBtn.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
      if (mobileMenu) {
        mobileMenu.classList.toggle('open', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
      }
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (hamburgerBtn) hamburgerBtn.classList.remove('open');
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', true);
      }
    });
  });

  // Active nav link based on scroll
  function updateActiveNavLink() {
    var currentSection = '';
    sections.forEach(function (section) {
      var sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href && currentSection && href.indexOf(currentSection) !== -1) {
        link.classList.add('active');
      }
    });
  }

  // Escape key closes mobile menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', false);
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', true);
      hamburgerBtn.focus();
    }
  });

  /* ──────────────────────────────────────
     2. ROLE CARDS — Expandable
  ────────────────────────────────────── */
  var roleCards = document.querySelectorAll('.role-card');

  function closeAllCards() {
    roleCards.forEach(function (c) {
      c.classList.remove('expanded');
      c.setAttribute('aria-expanded', 'false');
      var exp = c.querySelector('.role-card-expanded');
      if (exp) exp.setAttribute('aria-hidden', 'true');
    });
  }

  function openCard(card) {
    closeAllCards();
    card.classList.add('expanded');
    card.setAttribute('aria-expanded', 'true');
    var exp = card.querySelector('.role-card-expanded');
    if (exp) exp.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  roleCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      // If close button was clicked, just close
      if (e.target.classList.contains('role-close-btn') || e.target.closest('.role-close-btn')) {
        e.stopPropagation();
        closeAllCards();
        return;
      }
      // Toggle: if already expanded, close; else open
      if (card.classList.contains('expanded')) {
        closeAllCards();
      } else {
        openCard(card);
      }
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (card.classList.contains('expanded')) {
          closeAllCards();
        } else {
          openCard(card);
        }
      }
    });
  });

  /* ──────────────────────────────────────
     3. TESTIMONIALS CAROUSEL (Dynamic)
  ────────────────────────────────────── */

  // ── Default testimonials (always shown) ──
  var DEFAULT_TESTIMONIALS = [
    {
      id: 'default-1',
      name: 'Rahul Agarwal',
      role: 'Sous Chef · Placed in Germany',
      quote: 'Pranaah International placed me as a Sous Chef in Germany within 6 weeks. Their screening process was thorough and the onboarding support was excellent. The free German course was a game-changer.',
      rating: 5,
      initials: 'RA',
      colorStyle: 'linear-gradient(135deg, #c9a96e, #a07840)',
      isDefault: true
    },
    {
      id: 'default-2',
      name: 'Maria Klein',
      role: 'HR Director · Luxury Resort Group',
      quote: 'We needed 8 F&B professionals for our resort opening. Pranaah delivered pre-screened, communication-ready candidates on schedule. The quality was exceptional — not one mismatch.',
      rating: 5,
      initials: 'MK',
      colorStyle: 'linear-gradient(135deg, #1a3a6e, #0d2147)',
      isDefault: true
    },
    {
      id: 'default-3',
      name: 'Priya Sharma',
      role: 'Front Office Manager · Placed in Dubai',
      quote: 'From first contact to airport departure, Pranaah handled everything professionally. As a Front Office Manager placed in Dubai, I felt fully supported throughout the whole process.',
      rating: 5,
      initials: 'PS',
      colorStyle: 'linear-gradient(135deg, #2d8a6e, #1a5a47)',
      isDefault: true
    },
    {
      id: 'default-4',
      name: 'Jean Beaumont',
      role: 'Operations Head · European Hotel Chain',
      quote: 'As a hotel chain with properties across Europe, we rely on Pranaah for consistent housekeeping staff. Their long-term matchmaking approach has significantly reduced our turnover rates.',
      rating: 5,
      initials: 'JB',
      colorStyle: 'linear-gradient(135deg, #8a3d6e, #5a2047)',
      isDefault: true
    }
  ];

  var AVATAR_COLORS = {
    gold:   'linear-gradient(135deg, #c9a96e, #a07840)',
    navy:   'linear-gradient(135deg, #1a3a6e, #0d2147)',
    green:  'linear-gradient(135deg, #2d8a6e, #1a5a47)',
    purple: 'linear-gradient(135deg, #8a3d6e, #5a2047)',
    rose:   'linear-gradient(135deg, #c94e6e, #8a2040)'
  };

  var STORAGE_KEY = 'pranaah_testimonials';

  function getAllTestimonials() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      // First visit initialization
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TESTIMONIALS));
      return DEFAULT_TESTIMONIALS;
    }
    try {
      return JSON.parse(stored) || [];
    } catch (e) {
      return [];
    }
  }

  function saveTestimonials(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function starsHtml(n) {
    var filled = '★'.repeat(n);
    var empty  = '☆'.repeat(5 - n);
    return filled + empty;
  }

  // ── Build carousel DOM from testimonials array ──
  var track = document.getElementById('testimonials-track');
  var dotsContainer = document.getElementById('test-dots');
  var prevBtn = document.getElementById('test-prev-btn');
  var nextBtn = document.getElementById('test-next-btn');
  var currentSlide = 0;
  var autoSlideTimer = null;
  var testimonialCards = [];

  function buildCarousel() {
    if (!track || !dotsContainer) return;
    stopAutoSlide();
    currentSlide = 0;

    var all = getAllTestimonials();

    // Rebuild track cards
    track.innerHTML = '';
    all.forEach(function (t) {
      var card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML =
        '<div class="test-stars">' + starsHtml(t.rating || 5) + '</div>' +
        '<p class="test-quote">"' + t.quote + '"</p>' +
        '<div class="test-author">' +
          '<div class="test-avatar" style="background:' + t.colorStyle + ';">' + t.initials + '</div>' +
          '<div class="test-info">' +
            '<strong>' + t.name + '</strong>' +
            '<span>' + t.role + '</span>' +
          '</div>' +
        '</div>';
      track.appendChild(card);
    });
    track.style.transform = 'translateX(0)';

    // Rebuild dots
    dotsContainer.innerHTML = '';
    all.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'test-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      dot.addEventListener('click', function () {
        goToSlide(i);
        startAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });

    // Refresh references
    testimonialCards = Array.from(track.querySelectorAll('.testimonial-card'));

    // Touch support re-bind
    bindTouchSwipe();
  }

  function goToSlide(index) {
    testimonialCards = Array.from(track.querySelectorAll('.testimonial-card'));
    if (!track || testimonialCards.length === 0) return;
    var total = testimonialCards.length;
    currentSlide = ((index % total) + total) % total;
    var slideWidth = testimonialCards[0].offsetWidth || testimonialCards[0].getBoundingClientRect().width;
    track.style.transform = 'translateX(-' + (currentSlide * slideWidth) + 'px)';
    var allDots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.test-dot')) : [];
    allDots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(function () { goToSlide(currentSlide + 1); }, 3000);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) { clearInterval(autoSlideTimer); autoSlideTimer = null; }
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); startAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); startAutoSlide(); });

  var touchBound = false;
  function bindTouchSwipe() {
    if (touchBound || !track) return;
    touchBound = true;
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1); startAutoSlide(); }
    });
  }

  // Pause on hover
  var testimonialsSection = document.getElementById('testimonials');
  if (testimonialsSection) {
    testimonialsSection.addEventListener('mouseenter', stopAutoSlide);
    testimonialsSection.addEventListener('mouseleave', startAutoSlide);
  }

  // Build initial carousel + start when visible
  buildCarousel();
  var carouselStarted = false;
  if (testimonialsSection) {
    var carouselObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !carouselStarted) {
        carouselStarted = true;
        goToSlide(0);
        startAutoSlide();
      }
    }, { threshold: 0.2 });
    carouselObserver.observe(testimonialsSection);
  }

  /* ──────────────────────────────────────
     4. ANIMATED COUNTER (Stats)
  ────────────────────────────────────── */
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  var countersStarted = false;

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 2000;
    var startTime = performance.now();

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }


    requestAnimationFrame(update);
  }

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    statNumbers.forEach(animateCounter);
  }

  /* ──────────────────────────────────────
     5. INTERSECTION OBSERVER — Reveal & Counter
  ────────────────────────────────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // Stats counter observer
  var statsSection = document.getElementById('vision');
  if (statsSection) {
    var counterObs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        startCounters();
        counterObs.disconnect();
      }
    }, { threshold: 0.4 });
    counterObs.observe(statsSection);
  }

  // Reveal targets (no role cards — they need stable state for expand)
  var revealTargets = [
    ...document.querySelectorAll('.why-card'),
    ...document.querySelectorAll('.step-item'),
    ...document.querySelectorAll('.dual-card'),
    document.querySelector('.contact-info'),
    document.querySelector('.contact-form-wrap'),
  ].filter(Boolean);

  revealTargets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = ((i % 4) * 0.1) + 's';
    revealObserver.observe(el);
  });

  /* ──────────────────────────────────────
     6. PARTICLE SYSTEM (Hero & Vision)
  ────────────────────────────────────── */
  function createParticles(containerId, count) {
    var container = document.getElementById(containerId);
    if (!container) return;
    for (var i = 0; i < count; i++) {
      var particle = document.createElement('div');
      var size = Math.random() * 3 + 1;
      var x = Math.random() * 100;
      var y = Math.random() * 100;
      var dur = Math.random() * 15 + 10;
      var delay = Math.random() * 15;
      var opacity = Math.random() * 0.4 + 0.05;
      particle.style.cssText = [
        'position:absolute',
        'left:' + x + '%',
        'top:' + y + '%',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'border-radius:50%',
        'background:rgba(201,169,110,' + opacity + ')',
        'animation:float ' + dur + 's ease-in-out infinite',
        'animation-delay:-' + delay + 's',
        'pointer-events:none'
      ].join(';');
      container.appendChild(particle);
    }
  }

  createParticles('hero-particles', 30);
  createParticles('vision-particles', 20);

  /* ──────────────────────────────────────
     7. CONTACT FORM VALIDATION
  ────────────────────────────────────── */
  var contactForm = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');

  function showError(fieldId, msg) {
    var input = document.getElementById(fieldId);
    var key = fieldId.replace('form-', '');
    var errorEl = document.getElementById('error-' + key);
    if (input) input.classList.add('invalid');
    if (errorEl) errorEl.textContent = msg;
  }

  function clearError(fieldId) {
    var input = document.getElementById(fieldId);
    var key = fieldId.replace('form-', '');
    var errorEl = document.getElementById('error-' + key);
    if (input) input.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm && formSuccess) {
    // Hide success by default
    formSuccess.classList.remove('visible');

    // Real-time validation clear
    contactForm.querySelectorAll('.form-input').forEach(function (input) {
      input.addEventListener('input', function () {
        clearError('form-' + input.name);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      ['name', 'email', 'type', 'subject', 'message'].forEach(function (f) {
        clearError('form-' + f);
      });

      var nameVal = document.getElementById('form-name').value.trim();
      var emailVal = document.getElementById('form-email').value.trim();
      var typeVal = document.getElementById('form-type').value;
      var subjectVal = document.getElementById('form-subject').value.trim();
      var messageVal = document.getElementById('form-message').value.trim();

      if (!nameVal || nameVal.length < 2) {
        showError('form-name', 'Please enter your full name (min. 2 characters).');
        valid = false;
      }
      if (!emailVal || !validateEmail(emailVal)) {
        showError('form-email', 'Please enter a valid email address.');
        valid = false;
      }
      if (!typeVal) {
        showError('form-type', 'Please select your role.');
        valid = false;
      }
      if (!subjectVal || subjectVal.length < 3) {
        showError('form-subject', 'Please enter a subject.');
        valid = false;
      }
      if (!messageVal || messageVal.length < 15) {
        showError('form-message', 'Please enter a message (min. 15 characters).');
        valid = false;
      }

      if (valid) {
        var submitBtn = document.getElementById('form-submit-btn');
        var submitText = submitBtn.querySelector('.submit-text');
        var originalText = submitText.textContent;
        submitText.textContent = 'Sending\u2026';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        setTimeout(function () {
          // Trigger the user's email client with pre-filled form data
          var subjectText = encodeURIComponent('Pranaah Inquiry: ' + subjectVal);
          var bodyText = encodeURIComponent(
            'Name: ' + nameVal + '\n' +
            'Role: ' + typeVal + '\n' +
            'Email: ' + emailVal + '\n\n' +
            'Message:\n' + messageVal
          );
          window.location.href = 'mailto:contact@pranaahinternational.com?subject=' + subjectText + '&body=' + bodyText;

          contactForm.reset();
          formSuccess.classList.add('visible');
          submitText.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';

          setTimeout(function () {
            formSuccess.classList.remove('visible');
          }, 6000);
        }, 1500);
      }
    });
  }

  /* ──────────────────────────────────────
     8. BACK TO TOP BUTTON
  ────────────────────────────────────── */
  var backToTopBtn = document.getElementById('back-to-top-btn');

  function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 500) {
      backToTopBtn.removeAttribute('hidden');
    } else {
      backToTopBtn.setAttribute('hidden', '');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────
     9. SMOOTH ANCHOR NAVIGATION
  ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var navHeight = navbar ? navbar.offsetHeight : 76;
        var targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────
     10. WHY CARD — Mouse glow effect
  ────────────────────────────────────── */
  document.querySelectorAll('.why-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var glow = card.querySelector('.why-card-glow');
      if (glow) {
        glow.style.position = 'absolute';
        glow.style.left = (x - 60) + 'px';
        glow.style.top = (y - 60) + 'px';
        glow.style.width = '150px';
        glow.style.height = '150px';
      }
    });
    card.addEventListener('mouseleave', function () {
      var glow = card.querySelector('.why-card-glow');
      if (glow) {
        glow.style.top = '-40px';
        glow.style.right = '-40px';
        glow.style.left = '';
        glow.style.width = '120px';
        glow.style.height = '120px';
      }
    });
  });

  /* ──────────────────────────────────────
     11. STEP ITEMS — Stagger delay
  ────────────────────────────────────── */
  document.querySelectorAll('.step-item').forEach(function (step, i) {
    step.style.transitionDelay = (i * 0.15) + 's';
  });

  /* ──────────────────────────────────────
     12. DYNAMIC YEAR
  ────────────────────────────────────── */
  var copyrightEl = document.querySelector('.footer-copy');
  if (copyrightEl) {
    copyrightEl.textContent = '\u00a9 ' + new Date().getFullYear() + ' Pranaah International. All rights reserved.';
  }

  /* ──────────────────────────────────────
     13. HERO PARALLAX (Subtle)
  ────────────────────────────────────── */
  var heroSection = document.querySelector('.hero-section');
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking && heroSection) {
      requestAnimationFrame(function () {
        var scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroSection.style.backgroundPositionY = (50 + scrolled * 0.2) + '%';
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  console.log('%c Pranaah International', 'font-size: 18px; font-weight: bold; color: #c9a96e;');
  console.log('%c Right Time \u00b7 Right Place \u00b7 Right People', 'color: #1a3570; font-size: 12px;');

  /* ──────────────────────────────────────
     14. ADMIN PANEL — Testimonials Management
  ────────────────────────────────────── */
  var adminOverlay    = document.getElementById('admin-overlay');
  var screenLogin     = document.getElementById('admin-screen-login');
  var screenDashboard = document.getElementById('admin-screen-dashboard');
  var adminPasswordIn = document.getElementById('admin-password-input');
  var adminLoginBtn   = document.getElementById('admin-login-btn');
  var adminLoginErr   = document.getElementById('admin-login-error');
  var adminClosLogin  = document.getElementById('admin-close-login-btn');
  var adminClosDash   = document.getElementById('admin-close-dash-btn');
  var adminLogoutBtn  = document.getElementById('admin-logout-btn');
  var tabListBtn      = document.getElementById('tab-list-btn');
  var tabAddBtn       = document.getElementById('tab-add-btn');
  var tabContentList  = document.getElementById('tab-content-list');
  var tabContentAdd   = document.getElementById('tab-content-add');
  var adminTestList   = document.getElementById('admin-test-list');
  var newTestName     = document.getElementById('new-test-name');
  var newTestRole     = document.getElementById('new-test-role');
  var newTestQuote    = document.getElementById('new-test-quote');
  var newTestRating   = document.getElementById('new-test-rating');
  var newTestColor    = document.getElementById('new-test-color');
  var adminSaveBtn    = document.getElementById('admin-save-btn');
  var adminCancelAdd  = document.getElementById('admin-cancel-add-btn');
  var adminAddErr     = document.getElementById('admin-add-error');

  var ADMIN_PASSWORD = 'pranaah2024';
  var isAdminLoggedIn = false;

  function openAdminPanel() {
    if (!adminOverlay) return;
    adminOverlay.classList.add('open');
    adminOverlay.setAttribute('aria-hidden', 'false');
    if (isAdminLoggedIn) {
      showAdminScreen('dashboard');
    } else {
      showAdminScreen('login');
      setTimeout(function () { if (adminPasswordIn) adminPasswordIn.focus(); }, 100);
    }
  }

  function closeAdminPanel() {
    if (!adminOverlay) return;
    adminOverlay.classList.remove('open');
    adminOverlay.setAttribute('aria-hidden', 'true');
    if (adminLoginErr) adminLoginErr.textContent = '';
    if (adminPasswordIn) adminPasswordIn.value = '';
  }

  function showAdminScreen(name) {
    if (!screenLogin || !screenDashboard) return;
    if (name === 'login') {
      screenLogin.classList.remove('hidden');
      screenDashboard.classList.add('hidden');
    } else {
      screenLogin.classList.add('hidden');
      screenDashboard.classList.remove('hidden');
      renderAdminList();
      switchAdminTab('list');
    }
  }

  // Triple-click footer logo to open admin
  var footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) {
    var adminClickCount = 0;
    var adminClickTimer = null;
    footerLogo.addEventListener('click', function (e) {
      e.preventDefault();
      adminClickCount++;
      if (adminClickCount >= 3) {
        adminClickCount = 0;
        clearTimeout(adminClickTimer);
        openAdminPanel();
      } else {
        clearTimeout(adminClickTimer);
        adminClickTimer = setTimeout(function () { adminClickCount = 0; }, 700);
      }
    });
  }


  // Close on backdrop click
  if (adminOverlay) {
    adminOverlay.addEventListener('click', function (e) {
      if (e.target === adminOverlay) closeAdminPanel();
    });
  }

  // Login button
  if (adminLoginBtn) adminLoginBtn.addEventListener('click', attemptAdminLogin);
  if (adminPasswordIn) {
    adminPasswordIn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') attemptAdminLogin();
    });
  }

  function attemptAdminLogin() {
    var val = adminPasswordIn ? adminPasswordIn.value : '';
    if (val === ADMIN_PASSWORD) {
      isAdminLoggedIn = true;
      if (adminLoginErr) adminLoginErr.textContent = '';
      showAdminScreen('dashboard');
    } else {
      if (adminLoginErr) adminLoginErr.textContent = 'Incorrect password. Please try again.';
      if (adminPasswordIn) adminPasswordIn.select();
    }
  }

  if (adminClosLogin) adminClosLogin.addEventListener('click', closeAdminPanel);
  if (adminClosDash)  adminClosDash.addEventListener('click', closeAdminPanel);
  if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', function () {
    isAdminLoggedIn = false;
    closeAdminPanel();
  });

  // Tabs
  function switchAdminTab(name) {
    if (!tabListBtn || !tabAddBtn || !tabContentList || !tabContentAdd) return;
    if (name === 'list') {
      tabListBtn.classList.add('active');
      tabAddBtn.classList.remove('active');
      tabContentList.classList.remove('hidden');
      tabContentAdd.classList.add('hidden');
    } else {
      tabAddBtn.classList.add('active');
      tabListBtn.classList.remove('active');
      tabContentAdd.classList.remove('hidden');
      tabContentList.classList.add('hidden');
      clearAddForm();
    }
  }

  if (tabListBtn) tabListBtn.addEventListener('click', function () { switchAdminTab('list'); });
  if (tabAddBtn)  tabAddBtn.addEventListener('click',  function () { switchAdminTab('add');  });
  if (adminCancelAdd) adminCancelAdd.addEventListener('click', function () { switchAdminTab('list'); });

  // Render existing testimonials in admin list
  function renderAdminList() {
    if (!adminTestList) return;
    var all = getAllTestimonials();
    adminTestList.innerHTML = '';

    if (all.length === 0) {
      adminTestList.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:2rem 0;">No testimonials yet.</p>';
      return;
    }

    all.forEach(function (t) {
      var item = document.createElement('div');
      item.className = 'admin-test-item';
      var badgeClass = t.isDefault ? 'badge-default' : 'badge-custom';
      var badgeLabel = t.isDefault ? 'Default' : 'Custom';

      item.innerHTML =
        '<div class="admin-test-avatar" style="background:' + t.colorStyle + ';">' + t.initials + '</div>' +
        '<div class="admin-test-body">' +
          '<div class="admin-test-name">' + escapeHtml(t.name) + '</div>' +
          '<div class="admin-test-role-label">' + escapeHtml(t.role) + '</div>' +
          '<div class="admin-test-preview">' + escapeHtml(t.quote) + '</div>' +
        '</div>' +
        '<div class="admin-test-actions">' +
          '<span class="admin-test-badge ' + badgeClass + '">' + badgeLabel + '</span>' +
          '<button class="admin-delete-btn" data-id="' + t.id + '">Delete</button>' +
        '</div>';

      var deleteBtn = item.querySelector('.admin-delete-btn');
      (function (tid, tname) {
        deleteBtn.addEventListener('click', function () {
          if (confirm('Remove this testimonial by ' + tname + '?')) {
            var updated = getAllTestimonials().filter(function (c) { return c.id !== tid; });
            saveTestimonials(updated);
            buildCarousel();
            renderAdminList();
          }
        });
      })(t.id, t.name);

      adminTestList.appendChild(item);
    });
  }

  // Save new testimonial
  if (adminSaveBtn) {
    adminSaveBtn.addEventListener('click', function () {
      if (adminAddErr) adminAddErr.textContent = '';

      var nameVal   = newTestName  ? newTestName.value.trim()  : '';
      var roleVal   = newTestRole  ? newTestRole.value.trim()  : '';
      var quoteVal  = newTestQuote ? newTestQuote.value.trim() : '';
      var ratingVal = newTestRating ? parseInt(newTestRating.value, 10) : 5;
      var colorKey  = newTestColor ? newTestColor.value : 'gold';

      if (!nameVal) { if (adminAddErr) adminAddErr.textContent = 'Full Name is required.'; return; }
      if (!roleVal) { if (adminAddErr) adminAddErr.textContent = 'Role & Location is required.'; return; }
      if (!quoteVal || quoteVal.length < 20) { if (adminAddErr) adminAddErr.textContent = 'Quote must be at least 20 characters.'; return; }

      var parts    = nameVal.split(' ');
      var initials = parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : nameVal.slice(0, 2).toUpperCase();

      var newEntry = {
        id: 'custom-' + Date.now(),
        name: nameVal,
        role: roleVal,
        quote: quoteVal,
        rating: ratingVal,
        initials: initials,
        colorStyle: AVATAR_COLORS[colorKey] || AVATAR_COLORS.gold,
        isDefault: false
      };

      var updated = getAllTestimonials();
      updated.push(newEntry);
      saveTestimonials(updated);

      buildCarousel();
      clearAddForm();
      switchAdminTab('list');
    });
  }

  function clearAddForm() {
    if (newTestName)   newTestName.value   = '';
    if (newTestRole)   newTestRole.value   = '';
    if (newTestQuote)  newTestQuote.value  = '';
    if (newTestRating) newTestRating.value = '5';
    if (newTestColor)  newTestColor.value  = 'gold';
    if (adminAddErr)   adminAddErr.textContent = '';
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

});

