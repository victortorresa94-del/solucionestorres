/* ============================================
   SOLUCIONES TORRES — JavaScript
   Interactions, animations & form handling
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar scroll effect ──
    const navbar = document.getElementById('navbar');
    const handleNavbarScroll = () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // initial check

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Fade-in on scroll (Intersection Observer) ──
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
        fadeObserver.observe(el);
    });

    // ── Counter animation for trust metrics ──
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 2000;
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);
                    el.textContent = current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.trust-number').forEach(el => {
        counterObserver.observe(el);
    });

    // ── WhatsApp floating button show/hide ──
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (whatsappFloat) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                whatsappFloat.classList.add('show');
            } else {
                whatsappFloat.classList.remove('show');
            }
        });
    }

    // ── Form handling — redirect to WhatsApp ──
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value.trim();

            // Basic validation
            if (!nombre || !telefono) {
                showFormFeedback('Por favor, rellena al menos tu nombre y teléfono.', 'error');
                return;
            }

            // Build WhatsApp message
            const servicioText = servicio ? `\n📋 *Servicio:* ${servicio}` : '';
            const mensajeText = mensaje ? `\n📝 *Descripción:* ${mensaje}` : '';
            const whatsappMsg = `¡Hola Jaime! 👋\n\nMe gustaría pedir un presupuesto.\n\n👤 *Nombre:* ${nombre}\n📞 *Teléfono:* ${telefono}${servicioText}${mensajeText}\n\n¡Gracias!`;

            const encoded = encodeURIComponent(whatsappMsg);
            const whatsappURL = `https://wa.me/34614325066?text=${encoded}`;

            // Show success feedback
            showFormFeedback('¡Perfecto! Te estoy redirigiendo a WhatsApp...', 'success');

            // Redirect after a short delay
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
            }, 800);
        });
    }

    // ── Form feedback helper ──
    function showFormFeedback(message, type) {
        // Remove existing feedback
        const existing = document.querySelector('.form-feedback');
        if (existing) existing.remove();

        const feedback = document.createElement('div');
        feedback.className = `form-feedback form-feedback-${type}`;
        feedback.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18">
        ${type === 'success'
                ? '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />'
                : '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />'
            }
      </svg>
      <span>${message}</span>
    `;

        const submitBtn = contactForm.querySelector('.btn-submit');
        submitBtn.parentNode.insertBefore(feedback, submitBtn.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 300);
        }, 5000);
    }

    // ── Staggered animation delays for grid items ──
    const staggerGrids = ['.services-grid', '.value-grid', '.portfolio-grid', '.trust-grid'];
    staggerGrids.forEach(gridSelector => {
        const grid = document.querySelector(gridSelector);
        if (grid) {
            const items = grid.querySelectorAll('.fade-in');
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 0.1}s`;
            });
        }
    });

});
