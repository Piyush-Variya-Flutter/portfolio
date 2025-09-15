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
          document.querySelector('.nav-menu').classList.remove('show');
          document.querySelector('.nav-overlay').classList.remove('show');
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
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show');
    navOverlay.classList.add('show');
  });
  navOverlay.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navOverlay.classList.remove('show');
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
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let t = 0;

    function drawBlob() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Draw the morphing blob
      ctx.beginPath();
      for (let i = 0; i < 360; i += 6) {
        const angle = (i * Math.PI) / 180;
        const r = 110 + 18 * Math.sin(angle * 2.3 + t) + 14 * Math.cos(angle * 2.1 - t * 1.1);
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
    drawBlob();
  }
});