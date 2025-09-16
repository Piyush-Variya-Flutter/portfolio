// Section animation
document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    observer.observe(section);
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-menu li a').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        window.scrollTo({
          top: targetEl.offsetTop - 20,
          behavior: 'smooth'
        });
        document.querySelectorAll('.nav-menu li a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        // Close menu on mobile after click
        if (window.innerWidth <= 850) {
          const nm = document.querySelector('.nav-menu');
          const no = document.querySelector('.nav-overlay');
          if (nm) nm.classList.remove('show');
          if (no) no.classList.remove('show');
        }
      }
    });
  });

  // Navbar auto-highlights current section on scroll
  const navLinks = document.querySelectorAll('.nav-link');
  const pageSections = Array.from(sections);

  window.addEventListener('scroll', () => {
    let current = "";
    const scrollY = window.pageYOffset + 120; // offset for sticky nav height
    pageSections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === "#" + current) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (navMenu) navMenu.classList.add('show');
      if (navOverlay) navOverlay.classList.add('show');
      // prevent body scroll when menu open
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    });
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('show');
      if (navOverlay) navOverlay.classList.remove('show');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu on resize to large screens
  window.addEventListener('resize', () => {
    if (window.innerWidth > 850) {
      if (navMenu) navMenu.classList.remove('show');
      if (navOverlay) navOverlay.classList.remove('show');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    // resize blob canvas when viewport changes
    resizeBlobCanvas();
  });

  // Contact form feedback
  const form = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');
  if (form) {
    form.addEventListener('submit', function (e) {
      formMessage.textContent = 'Sending...';
      setTimeout(() => {
        formMessage.textContent = 'Thank you! Your message has been sent.';
        form.reset();
      }, 1500); // simulate feedback; replace with Formspree for real delivery
    });
  }

  // Hero circle blob animation (draws inside outlined circle)
  const canvas = document.getElementById('blobCanvas');
  let ctx, t = 0;
  function resizeBlobCanvas() {
    if (!canvas) return;
    // size to parent width but respect max (350)
    const parent = canvas.parentElement;
    let width = Math.min(parent.clientWidth, 350);
    // ensure minimum size for very small devices
    width = Math.max(width, 90);
    // account for devicePixelRatio for sharpness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(width * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = width + 'px';
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }

  function drawBlob() {
    if (!canvas) return;
    if (!ctx) ctx = canvas.getContext('2d');
    // clear using logical size (no dpr)
    const logicalW = canvas.width / (window.devicePixelRatio || 1);
    const logicalH = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, logicalW, logicalH);
    ctx.save();
    ctx.translate(logicalW / 2, logicalH / 2);

    // Draw the morphing blob using scaled radii relative to canvas size
    const baseR = Math.min(logicalW, logicalH) * 0.31; // ~110 @ 350
    ctx.beginPath();
    for (let i = 0; i < 360; i += 6) {
      const angle = (i * Math.PI) / 180;
      const r = baseR + (baseR * 0.16) * Math.sin(angle * 2.3 + t) + (baseR * 0.12) * Math.cos(angle * 2.1 - t * 1.1);
      ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(31,214,193,0.48)";
    ctx.globalAlpha = 0.82;
    ctx.fill();

    ctx.restore();
    t += 0.025;
    requestAnimationFrame(drawBlob);
  }

  // Initialize canvas size and start animation
  resizeBlobCanvas();
  drawBlob();

  // Also ensure canvas resized after a short delay (accounts for fonts/layout)
  setTimeout(resizeBlobCanvas, 300);
});
