// ===== COUNTDOWN =====
function updateCountdown() {
    // Fecha del evento: 17 de mayo de 2026, 16:30 (4:30 PM) hora de Cartagena (America/Bogota, UTC-5)
    const eventDate = new Date('2026-05-17T16:30:00-05:00').getTime();
    const now = new Date().getTime();
    const difference = eventDate - now;

    if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// Actualizar countdown cada segundo
setInterval(updateCountdown, 1000);
updateCountdown();

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
    function handleAccordionClick(e) {
        e.preventDefault();
        
        const contentId = this.getAttribute('aria-controls');
        const content = document.getElementById(contentId);
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Cerrar todas las secciones
        accordionContents.forEach(accContent => {
            accContent.classList.remove('accordion-open');
        });
        accordionHeaders.forEach(accHeader => {
            accHeader.setAttribute('aria-expanded', 'false');
        });

        // Si estaba cerrada, abrirla
        if (!isExpanded && content) {
            content.classList.add('accordion-open');
            this.setAttribute('aria-expanded', 'true');
            
            // Scroll suave solo si el header no está completamente visible
            setTimeout(() => {
                const headerRect = this.getBoundingClientRect();
                const viewportTop = window.pageYOffset;
                const viewportBottom = viewportTop + window.innerHeight;
                const headerTop = viewportTop + headerRect.top;
                const headerBottom = headerTop + headerRect.height;
                const offset = 80; // altura del navbar
                
                // Solo hacer scroll si el header no está visible o está parcialmente oculto
                if (headerTop < viewportTop + offset || headerBottom > viewportBottom) {
                    const targetPosition = headerTop - offset;
                    window.scrollTo({
                        top: Math.max(0, targetPosition),
                        behavior: 'smooth'
                    });
                }
            }, 150);
        }
    }

    // Solo agregar event listeners una vez
    if (!accordionInitialized) {
        accordionHeaders.forEach(header => {
            header.removeEventListener('click', handleAccordionClick); // Limpiar por si acaso
            header.addEventListener('click', handleAccordionClick);
        });
        accordionInitialized = true;
    }
    
    // Abrir RSVP por defecto (o primera sección si no existe RSVP)
    const rsvpSection = document.getElementById('accordion-rsvp');
    const firstSection = accordionContents[0];
    
    // Cerrar todas primero
    accordionContents.forEach(accContent => {
        accContent.classList.remove('accordion-open');
    });
    accordionHeaders.forEach(accHeader => {
        accHeader.setAttribute('aria-expanded', 'false');
    });
    
    if (rsvpSection) {
        rsvpSection.classList.add('accordion-open');
        const rsvpHeader = document.querySelector('[aria-controls="accordion-rsvp"]');
        if (rsvpHeader) {
            rsvpHeader.setAttribute('aria-expanded', 'true');
        }
    } else if (firstSection) {
        firstSection.classList.add('accordion-open');
        const firstHeader = document.querySelector(`[aria-controls="${firstSection.id}"]`);
        if (firstHeader) {
            firstHeader.setAttribute('aria-expanded', 'true');
        }
    }
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
            if (!target) {
                return;
            }
            
            // Cerrar menú móvil si está abierto
            const navbarMenu = document.getElementById('navbarMenu');
            if (navbarMenu) {
                navbarMenu.classList.remove('active');
            }
            
            // En móvil, si es una sección de acordeón, abrirla primero
            if (window.innerWidth < 768 && target.classList.contains('accordion-section')) {
                const sectionId = target.id;
                const contentId = `accordion-${sectionId}`;
                const content = document.getElementById(contentId);
                const header = document.querySelector(`[aria-controls="${contentId}"]`);
                
                if (content && header) {
                    // Cerrar todas las secciones primero
                    document.querySelectorAll('.accordion-content').forEach(accContent => {
                        accContent.classList.remove('accordion-open');
                    });
                    document.querySelectorAll('.accordion-header').forEach(accHeader => {
                        accHeader.setAttribute('aria-expanded', 'false');
                    });
                    
                    // Forzar reflow
                    void document.body.offsetHeight;
                    
                    // Abrir la sección objetivo
                    content.classList.add('accordion-open');
                    header.setAttribute('aria-expanded', 'true');
                    
                    // Scroll al header después de que el DOM se actualice
                    setTimeout(() => {
                        const rect = header.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const offset = 80;
                        const targetPosition = rect.top + scrollTop - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                    
                    return;
                }
            }
            
            // Comportamiento normal de scroll (desktop o secciones sin acordeón)
            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const offset = 80;
            const targetPosition = rect.top + scrollTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Inicializar smooth scroll cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSmoothScroll);
} else {
    setupSmoothScroll();
}
