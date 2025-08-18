// Lógica para la pantalla de introducción
document.addEventListener('DOMContentLoaded', function() {
    const introScreen = document.getElementById('intro-screen');
    const enterButton = document.getElementById('enter-portfolio-btn');
    const portfolioContent = document.getElementById('portfolio-content');
    const body = document.body;
    
    // Nuevo: Elementos del asistente virtual
    const assistantContainer = document.getElementById('virtual-assistant');
    if (assistantContainer) { // Verificar que el elemento existe
        assistantContainer.classList.add('hidden');
    }

    // Elementos del switcher de tema
    const lightThemeBtn = document.getElementById('light-theme-btn');
    const darkThemeBtn = document.getElementById('dark-theme-btn');
    const csThemeBtn = document.getElementById('cs-theme-btn');
    const themeButtons = [lightThemeBtn, darkThemeBtn, csThemeBtn];

    // Función para aplicar el tema
    function applyTheme(themeName) {
        body.classList.remove('dark-theme', 'cs-theme');
        if (themeName === 'dark') {
            body.classList.add('dark-theme');
        } else if (themeName === 'cs') {
            body.classList.add('cs-theme');
        }
        localStorage.setItem('portfolioTheme', themeName);
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
    const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
    applyTheme(savedTheme);

    // Asegúrate de que el contenido del portafolio esté oculto al cargar
    portfolioContent.style.display = 'none';

    enterButton.addEventListener('click', function() {
        introScreen.classList.add('fade-out');
        introScreen.addEventListener('transitionend', function() {
            introScreen.style.display = 'none';
            portfolioContent.style.display = 'block';
            setTimeout(() => {
                portfolioContent.classList.add('show-portfolio');
                // Nuevo: Muestra el asistente después de la animación de entrada
                if (assistantContainer) {
                    assistantContainer.classList.remove('hidden');
                }
                scrollFunction();
            }, 50);
        }, { once: true });
    });

    // Event listeners para los botones de tema
    lightThemeBtn.addEventListener('click', () => applyTheme('light'));
    darkThemeBtn.addEventListener('click', () => applyTheme('dark'));
    csThemeBtn.addEventListener('click', () => applyTheme('cs'));
    
    // Código para el Asistente Virtual de Preguntas Frecuentes
    const assistantIcon = assistantContainer.querySelector('.assistant-icon-container');
    const faqChatBox = assistantContainer.querySelector('.faq-chat-box');
    const faqItems = faqChatBox.querySelectorAll('.faq-item');

    // Clic en el ícono del asistente para mostrar/ocultar el chat
    assistantIcon.addEventListener('click', () => {
        assistantContainer.classList.toggle('active');
    });

    // Clic en cada pregunta para mostrar/ocultar la respuesta
    faqItems.forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

});


// EL RESTO DE TU CÓDIGO JAVASCRIPT EXISTENTE VA AQUÍ ABAJO:
let mybutton = document.getElementById("scrollTopBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.getElementById('portfolio-content') && document.getElementById('portfolio-content').classList.contains('show-portfolio')) {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    } else {
        mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const portfolioContent = document.getElementById('portfolio-content');
        if (portfolioContent && portfolioContent.classList.contains('show-portfolio')) {
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
