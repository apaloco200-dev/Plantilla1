// Countdown Timer
function updateCountdown() {
    const weddingDate = new Date('January 15, 2026 16:30:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    } else {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

// RSVP Form Submission
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validación básica
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const guests = document.getElementById('guests').value;
    const attendance = document.querySelector('input[name="attendance"]:checked');
    
    if (!name || !email || !guests || !attendance) {
        alert('Por favor, completa todos los campos obligatorios');
        return;
    }
    
    const attendanceValue = attendance.value;
    
    const messageDiv = document.getElementById('formMessage');
    messageDiv.style.display = 'block';
    
    if (attendanceValue === 'yes') {
        messageDiv.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <strong>¡Gracias ${name}!</strong> Hemos confirmado tu asistencia para ${guests} ${guests === '1' ? 'persona' : 'personas'}. 
                Te esperamos con mucha ilusión.
            </div>
        `;
        
        // Efecto de confeti al confirmar asistencia
        createConfetti();
        
        // Guardar en localStorage
        saveToLocalStorage({
            name: name,
            email: email,
            guests: guests,
            attendance: 'yes',
            date: new Date().toLocaleString()
        });
    } else {
        messageDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-heart"></i>
                <strong>Gracias ${name}</strong> por confirmarnos. Lamentamos mucho que no puedas acompañarnos, 
                pero te llevaremos en nuestro corazón.
            </div>
        `;
        
        saveToLocalStorage({
            name: name,
            email: email,
            guests: guests,
            attendance: 'no',
            date: new Date().toLocaleString()
        });
    }
    
    // Limpiar formulario
    document.getElementById('rsvpForm').reset();
    
    // Desplazar hacia el mensaje
    messageDiv.scrollIntoView({ behavior: 'smooth' });
});

// Guardar en localStorage
function saveToLocalStorage(data) {
    try {
        let rsvps = JSON.parse(localStorage.getItem('weddingRSVPs')) || [];
        rsvps.push(data);
        localStorage.setItem('weddingRSVPs', JSON.stringify(rsvps));
        console.log('RSVP guardado localmente');
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

// Efecto de confeti
function createConfetti() {
    const colors = ['#f0d5b8', '#d4b596', '#b8a287', '#8b7355'];
    const container = document.body;
    
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Posición aleatoria
        confetti.style.left = Math.random() * 100 + 'vw';
        
        // Color aleatorio
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Tamaño aleatorio
        const size = Math.random() * 10 + 5;
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        
        // Animación con parámetros aleatorios
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 1;
        confetti.style.animation = `confettiFall ${duration}s ease-out ${delay}s forwards`;
        
        // Rotación aleatoria
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(confetti);
        
        // Eliminar después de la animación
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, (duration + delay) * 1000);
    }
}

// Smooth scrolling para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Inicializar countdown
updateCountdown();
setInterval(updateCountdown, 1000);

// Mostrar mensaje si ya había confirmado antes
window.addEventListener('DOMContentLoaded', function() {
    const rsvps = JSON.parse(localStorage.getItem('weddingRSVPs')) || [];
    if (rsvps.length > 0) {
        console.log('Ya tienes confirmaciones guardadas:', rsvps);
    }
});