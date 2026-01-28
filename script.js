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
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navbarMenu = document.getElementById('navbarMenu');

mobileMenuBtn.addEventListener('click', function() {
    navbarMenu.classList.toggle('active');
});

// Cerrar menú móvil al hacer clic en un link
const navLinks = document.querySelectorAll('.navbar-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navbarMenu.classList.remove('active');
    });
});


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

// ===== SECCIONES INDEPENDIENTES =====
const mainContent = document.getElementById('mainContent');

// Función para verificar si estamos en móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para mostrar una sección específica
function showSection(sectionId) {
    if (!isMobile()) {
        // En desktop, usar scroll normal
        const target = document.getElementById(sectionId);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        return;
    }
    
    // En móvil: mostrar solo la sección seleccionada
    // Ocultar todas las secciones y resetear sus alturas
    document.querySelectorAll('.section-wrapper').forEach(wrapper => {
        wrapper.classList.remove('active');
        // Resetear altura para que se recalcule en la próxima activación
        wrapper.style.height = '';
        wrapper.style.maxHeight = '';
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.querySelector(`.section-wrapper[data-section="${sectionId}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Ajustar la altura del wrapper al contenido real
        setTimeout(() => {
            const contentHeight = targetSection.scrollHeight;
            const viewportHeight = window.innerHeight;
            
            // Si el contenido es más corto que el viewport, ajustar la altura
            if (contentHeight < viewportHeight) {
                targetSection.style.height = `${contentHeight}px`;
                targetSection.style.maxHeight = `${contentHeight}px`;
            } else {
                // Si el contenido es más largo, usar 100vh para permitir scroll
                targetSection.style.height = '100vh';
                targetSection.style.maxHeight = '100vh';
            }
        }, 100);
        
        // Hacer scroll al inicio de la sección
        targetSection.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Inicializar: mostrar la primera sección en móvil
window.addEventListener('DOMContentLoaded', function() {
    if (isMobile()) {
        const currentHash = window.location.hash.substring(1) || 'inicio';
        showSection(currentHash);
    }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        showSection(targetId);
    });
});

// Manejar cambios de tamaño de ventana
window.addEventListener('resize', function() {
    if (!isMobile()) {
        // En desktop, mostrar todas las secciones
        document.querySelectorAll('.section-wrapper').forEach(wrapper => {
            wrapper.classList.add('active');
        });
        // Restaurar scroll normal del body
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
    } else {
        // En móvil, mostrar solo la sección actual
        const currentHash = window.location.hash.substring(1) || 'inicio';
        showSection(currentHash);
    }
});
