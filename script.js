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

// ===== GALLERY =====
const photos = [
    {
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
        alt: 'Cartagena atardecer'
    },
    {
        src: 'https://images.unsplash.com/photo-1587330979470-3585a3e40a18?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1587330979470-3585a3e40a18?w=400&h=300&fit=crop',
        alt: 'Ciudad amurallada'
    },
    {
        src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        alt: 'Playa Cartagena'
    },
    {
        src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        alt: 'Arquitectura colonial'
    },
    {
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
        alt: 'Getsemaní'
    },
    {
        src: 'https://images.unsplash.com/photo-1587330979470-3585a3e40a18?w=1200&h=800&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1587330979470-3585a3e40a18?w=400&h=300&fit=crop',
        alt: 'Castillo San Felipe'
    }
];

function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    photos.forEach((photo, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.onclick = () => openLightbox(index);
        
        const img = document.createElement('img');
        img.src = photo.thumbnail;
        img.alt = photo.alt;
        img.loading = 'lazy';
        
        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    });
}

// Cargar galería cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGallery);
} else {
    loadGallery();
}

// ===== LIGHTBOX =====
function openLightbox(index) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox active';
    lightbox.onclick = (e) => {
        if (e.target === lightbox) {
            closeLightbox(lightbox);
        }
    };
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    lightboxContent.onclick = (e) => e.stopPropagation();
    
    const img = document.createElement('img');
    img.src = photos[index].src;
    img.alt = photos[index].alt;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => closeLightbox(lightbox);
    closeBtn.setAttribute('aria-label', 'Cerrar');
    
    lightboxContent.appendChild(img);
    lightboxContent.appendChild(closeBtn);
    lightbox.appendChild(lightboxContent);
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
}

function closeLightbox(lightbox) {
    lightbox.classList.remove('active');
    setTimeout(() => {
        if (lightbox.parentNode) {
            lightbox.parentNode.removeChild(lightbox);
        }
        document.body.style.overflow = '';
    }, 300);
}

// Cerrar lightbox con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const lightbox = document.querySelector('.lightbox.active');
        if (lightbox) {
            closeLightbox(lightbox);
        }
    }
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

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
