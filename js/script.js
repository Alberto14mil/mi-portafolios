// Lógica para la pantalla de introducción
document.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.getElementById('intro-screen');
    const enterButton = document.getElementById('enter-portfolio-btn');
    const portfolioContent = document.getElementById('portfolio-content');
    const body = document.body; // Referencia al body para cambiar clases de tema

    // Elementos del switcher de tema
    const lightThemeBtn = document.getElementById('light-theme-btn');
    const darkThemeBtn = document.getElementById('dark-theme-btn');
    const csThemeBtn = document.getElementById('cs-theme-btn');
    const themeButtons = [lightThemeBtn, darkThemeBtn, csThemeBtn];

    // Función para aplicar el tema
    function applyTheme(themeName) {
        // Elimina todas las clases de tema existentes
        body.classList.remove('dark-theme', 'cs-theme');
        // Añade la clase del tema seleccionado si no es 'light'
        if (themeName === 'dark') {
            body.classList.add('dark-theme');
        } else if (themeName === 'cs') {
            body.classList.add('cs-theme');
        }
        // Guarda la preferencia en localStorage
        localStorage.setItem('portfolioTheme', themeName);

        // Actualiza el estado 'active' de los botones
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        if (themeName === 'light') {
            lightThemeBtn.classList.add('active');
        } else if (themeName === 'dark') {
            darkThemeBtn.classList.add('active');
        } else if (themeName === 'cs') {
            csThemeBtn.classList.add('active');
        }
    }

    // Carga el tema guardado al inicio
    const savedTheme = localStorage.getItem('portfolioTheme') || 'light'; // Por defecto: 'light'
    applyTheme(savedTheme);

    // Asegúrate de que el contenido del portafolio esté oculto al cargar
    portfolioContent.style.display = 'none';

    enterButton.addEventListener('click', function() {
        // Oculta la pantalla de introducción con una transición
        introScreen.classList.add('fade-out');

        // Después de que la pantalla de introducción termine de desvanecerse
        introScreen.addEventListener('transitionend', function() {
            introScreen.style.display = 'none'; // Quita la pantalla de intro del flujo de la página

            // Muestra el contenido del portafolio y activa la animación de "encendido"
            portfolioContent.style.display = 'block'; // Asegura que sea visible para la animación
            setTimeout(() => {
                portfolioContent.classList.add('show-portfolio'); // Añade la clase que dispara la animación
                // Vuelve a verificar y mostrar/ocultar el botón de scroll-to-top si es necesario
                scrollFunction();
            }, 50); // Pequeño retardo para asegurar que display:block se aplique antes de la transición
        }, { once: true }); // Para asegurar que el evento se dispare solo una vez
    });

    // Event listeners para los botones de tema
    lightThemeBtn.addEventListener('click', () => applyTheme('light'));
    darkThemeBtn.addEventListener('click', () => applyTheme('dark'));
    csThemeBtn.addEventListener('click', () => applyTheme('cs'));
});


// EL RESTO DE TU CÓDIGO JAVASCRIPT EXISTENTE VA AQUÍ ABAJO:
// JavaScript para el botón de Scroll-to-Top
let mybutton = document.getElementById("scrollTopBtn");

// Cuando el usuario hace scroll hacia abajo 20px desde la parte superior de la página, muestra el botón
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    // Asegúrate de que el botón de scroll-to-top solo aparezca si el portafolio está visible
    if (document.getElementById('portfolio-content') && document.getElementById('portfolio-content').classList.contains('show-portfolio')) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    } else {
        mybutton.style.display = "none"; // Oculta si la pantalla de intro está activa
    }
}

// Cuando el usuario hace clic en el botón, se desplaza hacia la parte superior del documento
function topFunction() {
    document.body.scrollTop = 0; // Para Safari
    document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera
}

// JavaScript para el desplazamiento suave de la navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Asegúrate de que la navegación solo funcione después de que el portafolio sea visible
        // Verifica si portfolioContent está definido y tiene la clase 'show-portfolio'
        const portfolioContent = document.getElementById('portfolio-content');
        if (portfolioContent && portfolioContent.classList.contains('show-portfolio')) {
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});