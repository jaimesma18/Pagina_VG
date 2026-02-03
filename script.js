// ===== SCROLL DEBUGGING =====
// Wrap scrollIntoView to log all calls with stack traces
const originalScrollIntoView = Element.prototype.scrollIntoView;
Element.prototype.scrollIntoView = function(...args) {
    console.log('[SCROLL-DEBUG] scrollIntoView called:', {
        element: this.tagName + (this.id ? '#' + this.id : '') + (this.className ? '.' + this.className.split(' ')[0] : ''),
        args: args
    });
    console.trace('[SCROLL-DEBUG] scrollIntoView stack trace:');
    return originalScrollIntoView.apply(this, args);
};

// Wrap window.scrollTo to log all calls with stack traces
const originalWindowScrollTo = window.scrollTo;
window.scrollTo = function(...args) {
    console.log('[SCROLL-DEBUG] window.scrollTo called:', {
        args: args
    });
    console.trace('[SCROLL-DEBUG] window.scrollTo stack trace:');
    return originalWindowScrollTo.apply(window, args);
};

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
            console.log('[ACCORDION] Collapsed section via header click:', contentId);
            return;
        }

        // Si estaba abierta, cerrarla
        if (isExpanded && content) {
            content.classList.remove('accordion-open');
            header.setAttribute('aria-expanded', 'false');
            console.log('[ACCORDION] Collapsed section via header click:', contentId);
        } 
        // Si estaba cerrada, abrirla (SIN cerrar otras)
        else if (content) {
            console.log('[ACCORDION] Opening section:', contentId);
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
            
            const isMobile = window.innerWidth < 768;
            const scrollYBefore = window.pageYOffset || window.scrollY;
            
            console.log('[NAV] Click detected', {
                href,
                isMobile,
                scrollYBefore,
                timestamp: Date.now()
            });
            
            // ALWAYS preventDefault en mobile para navbar section links - NO permitir salto nativo
            // Esto elimina completamente el scroll nativo de anchor/hash
            if (isMobile) {
                console.log('[NAV] preventDefault() called (mobile) - blocking native anchor jump completely');
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            } else {
                e.preventDefault();
                e.stopPropagation();
            }
            
            const target = document.querySelector(href);
            if (!target) {
                console.log('[NAV] Target not found:', href);
                return;
            }
            
            // Cerrar menú móvil PRIMERO antes de hacer cualquier scroll
            const navbarMenu = document.getElementById('navbarMenu');
            if (navbarMenu && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                // Pequeño delay para que el menú se cierre antes de calcular posiciones
                setTimeout(() => {
                    handleScroll(target, href, scrollYBefore);
                }, 100);
            } else {
                handleScroll(target, href, scrollYBefore);
            }
        }, true); // Use capture phase to intercept before any other handlers
    });
}

// Logs para detectar doble scroll
window.addEventListener('hashchange', function(e) {
    console.log('[HASHCHANGE] Hash changed:', {
        oldURL: e.oldURL,
        newURL: e.newURL,
        hash: window.location.hash,
        scrollY: window.pageYOffset || window.scrollY,
        timestamp: Date.now()
    });
    console.trace('[HASHCHANGE] hashchange stack trace:');
});

let lastScrollLog = 0;
let lastScrollY = window.pageYOffset || window.scrollY;
let scrollSource = 'unknown'; // Track what caused the scroll
let isOurScroll = false; // Flag to mark our programmatic scrolls

window.addEventListener('scroll', function() {
    const now = Date.now();
    const currentScrollY = window.pageYOffset || window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    
    // Throttle logs a 50ms for better detection
    if (now - lastScrollLog > 50) {
        // Detect if this is an unexpected scroll
        const isUnexpected = !isOurScroll && Math.abs(scrollDelta) > 10;
        const logLevel = isUnexpected ? '⚠️ [SCROLL-ERROR]' : '[SCROLL]';
        
        console.log(`${logLevel} Scroll event:`, {
            scrollY: currentScrollY,
            scrollDelta: scrollDelta.toFixed(2),
            source: scrollSource,
            isOurScroll: isOurScroll,
            isUnexpected: isUnexpected,
            timestamp: now,
            stack: isUnexpected ? new Error().stack : undefined
        });
        
        lastScrollY = currentScrollY;
        lastScrollLog = now;
        isOurScroll = false; // Reset flag after logging
        scrollSource = 'unknown';
    }
}, { passive: true });

// Helper para esperar que termine una transición CSS
function waitForTransition(element) {
    return new Promise((resolve) => {
        // Verificar si hay transición activa
        const computedStyle = window.getComputedStyle(element);
        const transitionDuration = computedStyle.transitionDuration;
        const duration = parseFloat(transitionDuration) || 0;
        
        // Si no hay transición o duration es 0, resolver inmediatamente
        if (duration === 0 || !transitionDuration || transitionDuration === '0s') {
            resolve();
            return;
        }
        
        // Esperar transitionend
        const handleTransitionEnd = (e) => {
            // SOLO escuchar transiciones de max-height (la propiedad que animamos)
            if (e.propertyName === 'max-height') {
                console.log('[transitionend] max-height transition ended for', element.id || element.className);
                element.removeEventListener('transitionend', handleTransitionEnd);
                resolve();
            }
        };
        
        element.addEventListener('transitionend', handleTransitionEnd);
        
        // Fallback de seguridad: si no hay transitionend en tiempo razonable, resolver
        setTimeout(() => {
            element.removeEventListener('transitionend', handleTransitionEnd);
            resolve();
        }, (duration * 1000) + 100); // duration en ms + 100ms buffer
    });
}

async function handleScroll(target, href, scrollYBefore) {
    const scrollYBeforeScroll = window.pageYOffset || window.scrollY;
    console.log('[SCROLL] handleScroll called', {
        targetId: target.id,
        href,
        scrollYBefore,
        scrollYBeforeScroll,
        timestamp: Date.now()
    });
    
    // En móvil, si es una sección de acordeón, abrirla primero
    if (window.innerWidth < 768 && target.classList.contains('accordion-section')) {
        const sectionId = target.id;
        const contentId = `accordion-${sectionId}`;
        const content = document.getElementById(contentId);
        const header = document.querySelector(`[aria-controls="${contentId}"]`);
        
        if (content && header) {
            console.log('[ACCORDION] Mobile accordion navigation started', {
                sectionId,
                contentId,
                scrollYBefore: scrollYBeforeScroll
            });
            
            // PASO 1: Cerrar todas las secciones primero (solo una abierta a la vez)
            const accordionContents = document.querySelectorAll('.accordion-content');
            const closingElements = [];
            
            accordionContents.forEach(accContent => {
                if (accContent.classList.contains('accordion-open')) {
                    closingElements.push(accContent);
                    accContent.classList.remove('accordion-open');
                }
            });
            document.querySelectorAll('.accordion-header').forEach(accHeader => {
                accHeader.setAttribute('aria-expanded', 'false');
            });
            
            console.log('[ACCORDION] Closing', closingElements.length, 'sections');
            
            // PASO 2: Esperar a que todas las secciones que se están cerrando terminen su transición
            if (closingElements.length > 0) {
                await Promise.all(closingElements.map(el => waitForTransition(el)));
                console.log('[ACCORDION] All sections closed, scrollY:', window.pageYOffset || window.scrollY);
            }
            
            // PASO 3: Esperar a que el layout se estabilice después del cierre
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                });
            });
            
            // PASO 4: Abrir la sección objetivo
            // El layout está estable después del cierre (igual que cuando está cerrada)
            content.classList.add('accordion-open');
            header.setAttribute('aria-expanded', 'true');
            console.log('[ACCORDION] Opening section', sectionId);
            
            // PASO 5: Esperar a que termine la animación de apertura
            await waitForTransition(content);
            console.log('[ACCORDION] Section opened, scrollY:', window.pageYOffset || window.scrollY);
            
            // Esperar a que el layout esté completamente estable antes del scroll
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                });
            });
            
            // UN SOLO scrollIntoView() al header - NO usar window.scrollTo
            const scrollYBeforeScrollIntoView = window.pageYOffset || window.scrollY;
            console.log('[SCROLL] Calling scrollIntoView (ONLY scroll call), scrollY before:', scrollYBeforeScrollIntoView);
            
            // Marcar que este scroll es nuestro ANTES de llamar scrollIntoView
            isOurScroll = true;
            scrollSource = 'scrollIntoView-mobile-accordion';
            
            header.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Mantener el flag durante la animación smooth (puede durar ~500-1000ms)
            setTimeout(() => {
                isOurScroll = false;
                scrollSource = 'unknown';
            }, 1200); // Reset después de que termine la animación smooth
            
            // Actualizar hash DESPUÉS del scroll final - NO usar location.hash
            // Esperar un momento para que el scroll comience
            setTimeout(() => {
                const scrollYAfter = window.pageYOffset || window.scrollY;
                console.log('[SCROLL] scrollIntoView completed, scrollY after:', scrollYAfter, 'delta:', (scrollYAfter - scrollYBeforeScrollIntoView).toFixed(2));
                console.log('[URL] Updating URL with history.replaceState (AFTER scroll)');
                history.replaceState(null, '', href);
                console.log('[URL] URL updated, hash:', window.location.hash);
            }, 100);
            
            return;
        }
    }
    
    // Comportamiento normal de scroll (desktop o secciones sin acordeón)
    // En desktop, usar scrollIntoView también (NO window.scrollTo)
    console.log('[SCROLL] Normal scroll (desktop) - using scrollIntoView');
    
    // Marcar que este scroll es nuestro
    isOurScroll = true;
    scrollSource = 'scrollIntoView-desktop';
    
    // Usar scrollIntoView en lugar de window.scrollTo
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Actualizar hash DESPUÉS del scroll final
    setTimeout(() => {
        const scrollYAfter = window.pageYOffset || window.scrollY;
        console.log('[SCROLL] scrollIntoView completed, scrollY after:', scrollYAfter);
        console.log('[URL] Updating URL with history.replaceState (AFTER scroll)');
        history.replaceState(null, '', href);
        console.log('[URL] URL updated, hash:', window.location.hash);
    }, 100);
}

// Inicializar smooth scroll cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSmoothScroll);
} else {
    setupSmoothScroll();
}