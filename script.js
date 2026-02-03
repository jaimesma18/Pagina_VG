// ===== COUNTDOWN =====
// Cache de valores para evitar actualizaciones innecesarias del DOM
let lastCountdownValues = { days: null, hours: null, minutes: null, seconds: null };

function updateCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;
    
    // Fecha del evento: 17 de mayo de 2026, 16:30 (4:30 PM) hora de Cartagena (America/Bogota, UTC-5)
    const eventDate = new Date('2026-05-17T16:30:00-05:00').getTime();
    const now = new Date().getTime();
    const difference = eventDate - now;

    let days, hours, minutes, seconds;
    
    if (difference > 0) {
        days = Math.floor(difference / (1000 * 60 * 60 * 24));
        hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((difference % (1000 * 60)) / 1000);
    } else {
        days = 0;
        hours = 0;
        minutes = 0;
        seconds = 0;
    }

    // Solo actualizar DOM si los valores cambiaron (reduce reflows)
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Usar requestAnimationFrame para sincronizar con el ciclo de rendering
    // Esto simula el comportamiento cuando el screen recorder está activo
    requestAnimationFrame(() => {
        if (daysEl && lastCountdownValues.days !== days) {
            daysEl.textContent = String(days).padStart(2, '0');
            lastCountdownValues.days = days;
        }
        
        if (hoursEl && lastCountdownValues.hours !== hours) {
            hoursEl.textContent = String(hours).padStart(2, '0');
            lastCountdownValues.hours = hours;
        }
        
        if (minutesEl && lastCountdownValues.minutes !== minutes) {
            minutesEl.textContent = String(minutes).padStart(2, '0');
            lastCountdownValues.minutes = minutes;
        }
        
        // Segundos siempre cambian, pero usar requestAnimationFrame anidado para reducir impacto
        if (secondsEl && lastCountdownValues.seconds !== seconds) {
            requestAnimationFrame(() => {
                if (secondsEl) {
                    secondsEl.textContent = String(seconds).padStart(2, '0');
                }
            });
            lastCountdownValues.seconds = seconds;
        }
    });
}

// Actualizar countdown cada segundo usando requestAnimationFrame para mejor sincronización
let countdownInterval;
function startCountdown() {
    updateCountdown();
    countdownInterval = setInterval(() => {
        updateCountdown();
    }, 1000);
}

startCountdown();

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (mobileMenuBtn && navbarMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
    }
}

// Inicializar menú móvil cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileMenu);
} else {
    setupMobileMenu();
}


// ===== FAQ TOGGLE =====
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Cerrar todos los FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Abrir el clickeado si no estaba abierto
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ===== RSVP MODAL =====
function openRSVPModal() {
    const modal = document.getElementById('rsvpModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRSVPModal() {
    const modal = document.getElementById('rsvpModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Cerrar modal al hacer clic fuera
document.getElementById('rsvpModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeRSVPModal();
    }
});

// Cerrar modal con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('rsvpModal');
        if (modal.classList.contains('active')) {
            closeRSVPModal();
        }
    }
});

// ===== RSVP FORM SUBMIT =====
function handleRSVPSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('rsvpName').value,
        email: document.getElementById('rsvpEmail').value,
        guests: document.getElementById('rsvpGuests').value,
        message: document.getElementById('rsvpMessage').value
    };
    
    // Aquí iría la lógica para enviar el formulario
    // Por ejemplo: EmailJS, Formspree, o una API propia
    console.log('RSVP Data:', formData);
    
    alert('¡Gracias por tu confirmación! Te contactaremos pronto con más detalles.');
    
    // Limpiar formulario
    document.getElementById('rsvpForm').reset();
    closeRSVPModal();
    
    // NOTA: Conecta este formulario con tu servicio de email preferido
    // Opciones: EmailJS, Formspree, o crear una API route en tu backend
}

// ===== MOBILE ACCORDION =====
let accordionInitialized = false;

function initAccordion() {
    // Solo en móvil
    if (window.innerWidth >= 768) {
        // En desktop, asegurar que todo esté visible
        document.querySelectorAll('.accordion-content').forEach(content => {
            content.classList.add('accordion-open');
        });
        accordionInitialized = false; // Reset para que se reinicialice si vuelve a móvil
        return;
    }

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const accordionContents = document.querySelectorAll('.accordion-content');
    
    // Función para manejar el click en un header
    // MOBILE ONLY: Only open/close accordion, NO scroll, NO hash updates, NO focus scroll
    function handleAccordionClick(e) {
        const isMobile = window.innerWidth < 768;
        const header = this;
        
        // ALWAYS preventDefault en mobile - NO permitir scroll nativo ni focus scroll
        if (isMobile) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Prevent focus-triggered scrolling by removing focus immediately
            // Blur immediately to prevent browser from scrolling to focused element
            header.blur();
            
            // Also blur in next frame as backup
            requestAnimationFrame(() => {
                header.blur();
            });
        } else {
            e.preventDefault();
        }
        
        const contentId = header.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        // Si estaba abierta, cerrarla
        if (isExpanded && content) {
            content.classList.remove('accordion-open');
            header.setAttribute('aria-expanded', 'false');
            return;
        }

        // Si estaba cerrada, abrirla (SIN cerrar otras)
        if (!isExpanded && content) {
            content.classList.add('accordion-open');
            header.setAttribute('aria-expanded', 'true');
        }
    }

    // Solo agregar event listeners una vez
    if (!accordionInitialized) {
        accordionHeaders.forEach(header => {
            // Prevent focus scroll by setting tabindex to -1 on mobile
            if (window.innerWidth < 768) {
                header.setAttribute('tabindex', '-1');
            }
            
            header.removeEventListener('click', handleAccordionClick); // Limpiar por si acaso
            header.addEventListener('click', handleAccordionClick);
        });
        accordionInitialized = true;
    }
    
    // Cerrar todas las secciones - NO abrir ninguna por defecto
    // El usuario debe hacer click para abrir una sección (evita scroll automático)
    accordionContents.forEach(accContent => {
        accContent.classList.remove('accordion-open');
    });
    accordionHeaders.forEach(accHeader => {
        accHeader.setAttribute('aria-expanded', 'false');
    });
}

// Inicializar acordeón al cargar y al redimensionar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
} else {
    initAccordion();
}

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Si cambia a desktop, mostrar todo; si cambia a móvil, inicializar acordeón
        if (window.innerWidth >= 768) {
            // Desktop: mostrar todo
            document.querySelectorAll('.accordion-content').forEach(content => {
                content.classList.add('accordion-open');
            });
            document.querySelectorAll('.accordion-header').forEach(header => {
                header.setAttribute('aria-expanded', 'false');
            });
            accordionInitialized = false; // Reset para que se reinicialice si vuelve a móvil
        } else {
            // Móvil: reinicializar acordeón
            accordionInitialized = false; // Reset para reinicializar
            initAccordion();
        }
    }, 250);
});

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const target = document.querySelector(href);
            if (!target) return;
            
            // Cerrar menú móvil primero antes de hacer scroll
            const navbarMenu = document.getElementById('navbarMenu');
            if (navbarMenu && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                setTimeout(() => {
                    handleScroll(target, href);
                }, 100);
            } else {
                handleScroll(target, href);
            }
        }, true);
    });
}


// ===== SMOOTH SCROLL (Menú hamburguesa) =====
function handleScroll(target, href) {
    // En móvil, si es una sección de acordeón, abrirla primero
    if (window.innerWidth < 768 && target.classList.contains('accordion-section')) {
        const sectionId = target.id;
        const contentId = `accordion-${sectionId}`;
        const content = document.getElementById(contentId);
        const header = document.querySelector(`[aria-controls="${contentId}"]`);
        
        if (content && header) {
            // Abrir la sección objetivo (sin cerrar otras)
            if (!content.classList.contains('accordion-open')) {
                content.classList.add('accordion-open');
                header.setAttribute('aria-expanded', 'true');
            }
            
            // Scroll suave al header después de un frame para que el contenido se abra
            requestAnimationFrame(() => {
                header.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
            
            // Actualizar URL sin cambiar scroll
            history.replaceState(null, '', href);
            return;
        }
    }
    
    // Comportamiento normal (desktop o secciones sin acordeón)
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    history.replaceState(null, '', href);
}

// Inicializar smooth scroll cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSmoothScroll);
} else {
    setupSmoothScroll();
}