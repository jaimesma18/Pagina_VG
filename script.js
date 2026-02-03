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
// Optimizado para prevenir recálculos innecesarios en móvil
(function() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let isScrolled = false;
    let scrollTimeout = null;
    
    // Throttle para reducir recálculos en móvil
    function handleScroll() {
        if (window.innerWidth < 768) {
            // En móvil, usar throttling más agresivo
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                const shouldBeScrolled = window.scrollY > 50;
                if (shouldBeScrolled !== isScrolled) {
                    isScrolled = shouldBeScrolled;
                    // Usar requestAnimationFrame para sincronizar con el ciclo de rendering
                    requestAnimationFrame(() => {
                        if (shouldBeScrolled) {
                            navbar.classList.add('scrolled');
                        } else {
                            navbar.classList.remove('scrolled');
                        }
                    });
                }
                scrollTimeout = null;
            }, 100); // Throttle a 100ms en móvil
        } else {
            // En desktop, comportamiento normal
            const shouldBeScrolled = window.scrollY > 50;
            if (shouldBeScrolled !== isScrolled) {
                isScrolled = shouldBeScrolled;
                if (shouldBeScrolled) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
})();

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

// ===== PREVENIR SCROLL AUTOMÁTICO CUANDO LA BARRA DE URL CAMBIA =====
// Solución agresiva para prevenir scroll automático y colapso de secciones
(function() {
    if (window.innerWidth >= 768) return; // Solo en móvil
    
    let lastViewportHeight = window.innerHeight;
    let lastScrollY = window.pageYOffset || window.scrollY;
    let isUserScrolling = false;
    let scrollRestoreTimeout = null;
    let viewportChangeDetected = false;
    
    // Guardar estado de secciones abiertas
    const openSections = new Set();
    let isUserClicking = false; // Bandera para detectar clicks del usuario
    
    function saveOpenSections() {
        openSections.clear();
        document.querySelectorAll('.accordion-content.accordion-open').forEach(section => {
            openSections.add(section);
        });
    }
    
    function restoreOpenSections() {
        // Solo restaurar si NO es una acción del usuario
        if (!isUserClicking && viewportChangeDetected) {
            openSections.forEach(section => {
                if (section && !section.classList.contains('accordion-open')) {
                    section.classList.add('accordion-open');
                }
            });
        }
    }
    
    // Detectar cambios en el viewport de forma más agresiva
    function handleViewportChange() {
        const currentViewportHeight = window.innerHeight;
        const currentScrollY = window.pageYOffset || window.scrollY;
        const viewportDelta = Math.abs(currentViewportHeight - lastViewportHeight);
        
        // Si el viewport cambió significativamente (barra de URL se movió)
        if (viewportDelta > 30 && !isUserScrolling) {
            viewportChangeDetected = true;
            
            // Restaurar posición de scroll inmediatamente
            if (Math.abs(currentScrollY - lastScrollY) > 10) {
                // El scroll cambió sin interacción del usuario, restaurarlo
                window.scrollTo({
                    top: lastScrollY,
                    behavior: 'auto'
                });
            }
            
            // Restaurar secciones abiertas
            restoreOpenSections();
            
            // Limpiar timeout anterior
            if (scrollRestoreTimeout) {
                clearTimeout(scrollRestoreTimeout);
            }
            
            // Verificar y restaurar después de un breve delay
            scrollRestoreTimeout = setTimeout(() => {
                const finalScrollY = window.pageYOffset || window.scrollY;
                if (Math.abs(finalScrollY - lastScrollY) > 10 && !isUserScrolling) {
                    window.scrollTo({
                        top: lastScrollY,
                        behavior: 'auto'
                    });
                }
                restoreOpenSections();
                viewportChangeDetected = false;
            }, 100);
            
            lastViewportHeight = currentViewportHeight;
        } else if (viewportDelta < 10) {
            // Viewport estable, actualizar posición
            if (!isUserScrolling) {
                lastScrollY = currentScrollY;
            }
        }
    }
    
    // Monitorear cambios de viewport más frecuentemente
    let viewportCheckInterval = setInterval(() => {
        if (window.innerWidth < 768) {
            handleViewportChange();
        } else {
            clearInterval(viewportCheckInterval);
        }
    }, 50); // Más frecuente
    
    // Escuchar eventos de resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (window.innerWidth < 768) {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                handleViewportChange();
            }, 10); // Más rápido
        }
    }, { passive: true });
    
    // Detectar scroll del usuario vs scroll automático
    let scrollTimeout;
    let lastScrollTime = Date.now();
    window.addEventListener('scroll', function() {
        const now = Date.now();
        const timeSinceLastScroll = now - lastScrollTime;
        lastScrollTime = now;
        
        // Si el scroll es muy rápido (< 16ms), probablemente es automático
        if (timeSinceLastScroll < 16) {
            // Scroll automático detectado
            if (viewportChangeDetected) {
                // Restaurar posición
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: lastScrollY,
                        behavior: 'auto'
                    });
                });
            }
        } else {
            // Scroll del usuario
            isUserScrolling = true;
            lastScrollY = window.pageYOffset || window.scrollY;
            saveOpenSections();
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 150);
    }, { passive: true });
    
    // Protección agresiva de secciones del acordeón
    function setupAccordionProtection() {
        const accordionContents = document.querySelectorAll('.accordion-content');
        if (accordionContents.length === 0) return;
        
        saveOpenSections();
        
        accordionContents.forEach(function(section) {
            const observer = new MutationObserver(function(mutations) {
                // Ignorar cambios cuando el usuario está haciendo click
                if (isUserClicking) return;
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isOpen = section.classList.contains('accordion-open');
                        
                        // Solo restaurar si:
                        // 1. La sección estaba abierta
                        // 2. Se cerró inesperadamente
                        // 3. NO es scroll del usuario
                        // 4. NO es un click del usuario
                        // 5. Hay un cambio de viewport detectado
                        if (openSections.has(section) && !isOpen && !isUserScrolling && viewportChangeDetected) {
                            // Restaurar inmediatamente solo si fue por cambio de viewport
                            section.classList.add('accordion-open');
                        } else if (isOpen) {
                            // Guardar que está abierta
                            openSections.add(section);
                        } else if (!isOpen && !isUserClicking) {
                            // Remover de la lista si se cerró (pero no por click del usuario)
                            openSections.delete(section);
                        }
                    }
                });
            });
            
            observer.observe(section, {
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }
    
    // Detectar clicks del usuario en headers del acordeón
    document.addEventListener('click', function(e) {
        if (e.target.closest('.accordion-header')) {
            // Marcar que el usuario está haciendo click
            isUserClicking = true;
            
            // Guardar estado ANTES del cambio (para saber qué estaba abierto)
            saveOpenSections();
            
            // Después de que el click se procese, actualizar el estado
            setTimeout(() => {
                saveOpenSections(); // Actualizar con el nuevo estado
                // Permitir que el cambio se complete antes de desactivar la protección
                setTimeout(() => {
                    isUserClicking = false;
                }, 200);
            }, 50);
        }
    }, true);
    
    // Configurar protección cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAccordionProtection);
    } else {
        setupAccordionProtection();
    }
})();