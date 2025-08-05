document.addEventListener('DOMContentLoaded', function() {
    const codeIntroScreen = document.getElementById('code-intro-screen');
    const codeCanvas = document.getElementById('code-canvas');
    const enterProfileBtn = document.getElementById('enter-profile-btn');
    const profileMainContent = document.getElementById('profile-main-content');
    const ctx = codeCanvas.getContext('2d');
    const body = document.body;

    // Elementos del switcher de tema
    const matrixThemeBtn = document.getElementById('matrix-theme-btn');
    const blueThemeBtn = document.getElementById('blue-theme-btn');
    const themeButtons = [matrixThemeBtn, blueThemeBtn]; // Solo dos botones ahora

    // Función para aplicar el tema
    function applyTheme(themeName) {
        // Elimina todas las clases de tema existentes
        body.classList.remove('blue-theme'); // Solo necesitamos remover 'blue-theme'
        
        // Añade la clase de tema si no es el tema 'matrix' (que es el predeterminado en :root)
        if (themeName === 'blue') {
            body.classList.add('blue-theme');
        }
        
        localStorage.setItem('paginaTheme', themeName); // Guarda el tema seleccionado

        // Actualiza el estado 'active' de los botones
        themeButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        if (themeName === 'matrix') {
            matrixThemeBtn.classList.add('active');
        } else if (themeName === 'blue') {
            blueThemeBtn.classList.add('active');
        }
    }

    // Cargar el tema guardado en localStorage al inicio
    const savedTheme = localStorage.getItem('paginaTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('matrix'); // Establece el tema Matrix como predeterminado si no hay ninguno guardado
    }

    // Event Listeners para los botones de cambio de tema
    matrixThemeBtn.addEventListener('click', () => applyTheme('matrix'));
    blueThemeBtn.addEventListener('click', () => applyTheme('blue'));


    // Configuración del canvas para el efecto de código
    codeCanvas.width = window.innerWidth;
    codeCanvas.height = window.innerHeight;

    const font_size = 16;
    const columns = codeCanvas.width / font_size;
    const drops = [];

    // Inicializar gotas en la parte superior
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    // Caracteres para el efecto "Matrix"
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:",./<>?';

    // Función para dibujar el efecto de código
    function drawCodeEffect() {
        // Fondo semitransparente para el rastro de los caracteres
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);

        // Color del texto del código (verde brillante)
        ctx.fillStyle = '#0F0'; // Verde brillante fijo para la animación Matrix
        ctx.font = font_size + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            // Enviar la "gota" de vuelta a la parte superior aleatoriamente
            if (drops[i] * font_size > codeCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Incrementar la posición Y de la gota
            drops[i]++;
        }
    }

    let animationInterval;

    // Función para iniciar la animación
    function startCodeAnimation() {
        // Asegúrate de que el canvas esté visible antes de empezar a dibujar
        codeCanvas.style.display = 'block'; 
        animationInterval = setInterval(drawCodeEffect, 33); // Aproximadamente 30 FPS
    }

    // Función para detener la animación
    function stopCodeAnimation() {
        clearInterval(animationInterval);
        ctx.clearRect(0, 0, codeCanvas.width, codeCanvas.height); // Limpiar el canvas
        codeCanvas.style.display = 'none'; // Ocultar el canvas cuando no se usa
    }

    // Redimensionar el canvas con la ventana
    window.addEventListener('resize', () => {
        codeCanvas.width = window.innerWidth;
        codeCanvas.height = window.innerHeight;
        const newColumns = codeCanvas.width / font_size;
        // Ajustar 'drops' si cambia el número de columnas
        if (newColumns > drops.length) {
            for (let i = drops.length; i < newColumns; i++) {
                drops[i] = 1;
            }
        } else {
            drops.length = newColumns;
        }
    });

    // Iniciar la animación al cargar la página
    startCodeAnimation();

    // Mostrar el botón de entrada después de un breve retardo para que se vea el efecto
    setTimeout(() => {
        enterProfileBtn.classList.remove('hidden');
        enterProfileBtn.classList.add('fade-in'); // Clase para animar la aparición del botón
    }, 2000); // Aparece después de 2 segundos

    enterProfileBtn.addEventListener('click', function() {
        // Detener la animación del código
        stopCodeAnimation();

        // Ocultar la pantalla de introducción con una transición
        codeIntroScreen.classList.add('fade-out');

        codeIntroScreen.addEventListener('transitionend', function() {
            codeIntroScreen.style.display = 'none'; // Elimina la pantalla de intro del flujo

            // Mostrar el contenido del portafolio con una animación
            profileMainContent.style.display = 'block';
            setTimeout(() => {
                profileMainContent.classList.add('show-content'); // Dispara la animación de entrada
                // Asegurarse de que el botón de scroll-to-top funcione correctamente
                scrollFunction();
            }, 50); // Pequeño retardo para asegurar que display:block se aplique
        }, { once: true });
    });

    // JavaScript para el botón de Scroll-to-Top (adaptado para esta página)
    let mybutton = document.getElementById("scrollTopBtn");

    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        if (profileMainContent.classList.contains('show-content')) {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                mybutton.style.display = "block";
            } else {
                mybutton.style.display = "none";
            }
        } else {
            mybutton.style.display = "none";
        }
    }

    // Cuando el usuario hace clic en el botón, se desplaza hacia la parte superior del documento
    window.topFunction = function() { // Hacerla global para que el onclick funcione
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    // JavaScript para el desplazamiento suave de la navegación (adaptado para esta página)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (profileMainContent.classList.contains('show-content')) {
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});