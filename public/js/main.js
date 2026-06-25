/* ==========================================================================
   GALACTICLEGENDS GAMES - INTERACTIVE SITE ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --------------------------------------------------------------------------
  // 1. COSMIC PARTICLES CANVAS SYSTEM
  // --------------------------------------------------------------------------
  const initParticles = () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle template
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.color = Math.random() > 0.8 
          ? 'rgba(0, 229, 255, 0.6)'  /* Cyan */
          : Math.random() > 0.6 
            ? 'rgba(123, 47, 255, 0.6)' /* Purple */
            : 'rgba(240, 237, 255, 0.4)'; /* Cool Off-white */
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Loop screen borders
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const setup = () => {
      particlesArray = [];
      // Adjust density based on screen size
      const numberOfParticles = Math.floor((width * height) / 11000);
      for (let i = 0; i < Math.min(numberOfParticles, 120); i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background space wash
      const gradient = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, Math.max(width, height));
      gradient.addColorStop(0, '#0a071c');
      gradient.addColorStop(1, '#05030f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render nodes
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw faint connections for particles close together
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 90) {
            const opacity = (1 - (distance / 90)) * 0.12;
            ctx.strokeStyle = `rgba(155, 142, 196, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      setup();
    });

    setup();
    animate();
  };

  initParticles();

  // --------------------------------------------------------------------------
  // 2. STICKY NAVBAR & NAVIGATION HIGHLIGHTS
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Toggle sticky class
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Dynamic nav link active state based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      // Match section ID (supporting local anchors as well as direct page URLs)
      if (href && (href.endsWith(`#${current}`) || href === `#${current}`)) {
        link.classList.add('active');
      }
    });

    // Toggle Mobile Sticky CTA button visibility
    const mobileCta = document.querySelector('.mobile-sticky-cta');
    if (mobileCta) {
      if (window.scrollY > 400) {
        mobileCta.classList.add('visible');
      } else {
        mobileCta.classList.remove('visible');
      }
    }
  });

  // --------------------------------------------------------------------------
  // 3. MOBILE MENU INTERACTION
  // --------------------------------------------------------------------------
  const hamburger = document.querySelector('.hamburger');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-overlay .nav-link');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
  };

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', toggleMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileOverlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE 3D CARD TILT ON HOVER
  // --------------------------------------------------------------------------
  const gameCard = document.querySelector('.game-card-featured');
  if (gameCard) {
    gameCard.addEventListener('mousemove', (e) => {
      const rect = gameCard.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate within the element
      const y = e.clientY - rect.top;  // y coordinate within the element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation angles (-10 to 10 degrees)
      const rotateX = -10 * ((y - (height / 2)) / (height / 2));
      const rotateY = 10 * ((x - (width / 2)) / (width / 2));
      
      gameCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      gameCard.style.boxShadow = `
        ${-rotateY * 2}px ${rotateX * 2}px 30px rgba(123, 47, 255, 0.25),
        0 20px 40px rgba(0, 0, 0, 0.6),
        inset 0 0 25px rgba(0, 229, 255, 0.05)
      `;
    });

    gameCard.addEventListener('mouseleave', () => {
      gameCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      gameCard.style.boxShadow = '';
      gameCard.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    });

    gameCard.addEventListener('mouseenter', () => {
      gameCard.style.transition = 'none';
    });
  }

  // --------------------------------------------------------------------------
  // 5. SCROLL TRIGGERED REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once animation triggers
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --------------------------------------------------------------------------
  // 6. CONTACT FORM AJAX HANDLER & TOAST
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('galaxy-contact-form');
  const toastContainer = document.querySelector('.toast-container');

  const showToast = (message, type = 'success') => {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
      toast.style.borderColor = '#FF0000';
      toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 0, 0, 0.15)';
    }
    toast.innerText = message;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Remove toast after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4500);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
      };

      // Set loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Beacon... 🛰️';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Show cosmic success toast
          showToast("Message sent! We'll get back to you at lightspeed. 🚀");
          contactForm.reset();
        } else {
          showToast(result.message || "Failed to establish uplink.", "error");
        }
      } catch (err) {
        console.error("Communication failure:", err);
        showToast("Signal lost in the asteroid belt. Please check connection.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

});
