document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const authSection = document.getElementById('auth-section');
    const authForm = document.getElementById('auth-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const logoutButton = document.getElementById('logout-button');
    const authMessage = document.getElementById('auth-message');
    const authTitle = document.getElementById('auth-title');

    const votacionSection = document.getElementById('votacion');
    const currentUserSpan = document.getElementById('current-user');
    const evaluadoSelect = document.getElementById('evaluado-select');
    const votationButton = document.getElementById('voting-form').querySelector('button[type="submit"]');
    const votingForm = document.getElementById('voting-form');

    const showWinnersEffectButton = document.getElementById('show-winners-effect');
    const mejorEvaluadoCard = document.getElementById('mejor-evaluado-card');

    // --- Variables de Estado Temporales (sessionStorage) ---
    // sessionStorage es temporal por sesión de navegador, se borra al cerrar la pestaña/navegador.
    let users = JSON.parse(sessionStorage.getItem('registeredUsers')) || {}; // {username: password}
    let votes = JSON.parse(sessionStorage.getItem('currentVotes')) || {
        'luis': 0,
        'maria': 0,
        'carolina': 0
    };
    let currentUser = sessionStorage.getItem('loggedInUser') || null;

    // --- Configuración del Gráfico ---
    const chartLabels = ['Luis Medina', 'María Ramírez', 'Carolina Molina'];
    const backgroundColors = [
        'rgba(75, 192, 192, 0.6)', // Luis Medina
        'rgba(153, 102, 255, 0.6)', // María Ramírez
        'rgba(255, 159, 64, 0.6)'  // Carolina Molina
    ];
    const borderColors = [
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];

    const ctx = document.getElementById('votingChart').getContext('2d');
    const votingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Votos Recibidos',
                data: Object.values(votes),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Resultados de Votación',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });

    // --- Funciones de Utilidad ---

    // Guarda los usuarios en sessionStorage
    function saveUsers() {
        sessionStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    // Guarda los votos en sessionStorage
    function saveVotes() {
        sessionStorage.setItem('currentVotes', JSON.stringify(votes));
    }

    // Actualiza el estado de la UI (mostrar/ocultar secciones)
    function updateUI() {
        if (currentUser) {
            authSection.style.display = 'none'; // Ocultar sección de login
            votacionSection.style.display = 'block'; // Mostrar sección de votación
            currentUserSpan.textContent = currentUser; // Mostrar nombre de usuario
            logoutButton.style.display = 'block'; // Mostrar botón de cerrar sesión
            authTitle.textContent = `Bienvenido, ${currentUser}`; // Cambiar título
        } else {
            authSection.style.display = 'block'; // Mostrar sección de login
            votacionSection.style.display = 'none'; // Ocultar sección de votación
            logoutButton.style.display = 'none'; // Ocultar botón de cerrar sesión
            authTitle.textContent = 'Regístrate o Inicia Sesión'; // Restablecer título
        }
        updateWinnersDisplay(); // Asegura que los ganadores siempre estén actualizados
        toggleVotationButton(); // Asegura que el botón de votar esté en el estado correcto
    }

    // Actualiza los ganadores en las tarjetas
    function updateWinnersDisplay() {
        let bestEvaluadoName = '¡Esperando votos!';
        let bestEvaluadoVotes = -1;

        // Itera sobre los votos de los evaluados para encontrar al ganador
        for (const [key, value] of Object.entries(votes)) {
            if (value > bestEvaluadoVotes) {
                bestEvaluadoVotes = value;
                switch(key) {
                    case 'luis': bestEvaluadoName = 'Luis Medina'; break;
                    case 'maria': bestEvaluadoName = 'María Ramírez'; break;
                    case 'carolina': bestEvaluadoName = 'Carolina Molina'; break;
                }
            }
        }

        document.querySelector('#mejor-evaluado-card .winner-name').textContent = bestEvaluadoName;
        document.querySelector('#mejor-evaluado-card .winner-score').textContent = bestEvaluadoVotes > 0 ? `¡Con ${bestEvaluadoVotes} votos!` : '';
    }

    // Habilita/deshabilita el botón de votar
    function toggleVotationButton() {
        if (currentUser && evaluadoSelect.value) { // Solo si hay usuario logueado Y se seleccionó un evaluado
            votationButton.removeAttribute('disabled');
        } else {
            votationButton.setAttribute('disabled', 'true');
        }
    }

    // --- Event Listeners ---

    // Registro de Usuario
    registerButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previene envío de formulario
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            authMessage.textContent = 'Por favor, introduce un nombre de usuario y contraseña.';
            authMessage.style.color = 'red';
            return;
        }

        if (users[username]) {
            authMessage.textContent = 'Ese nombre de usuario ya existe. Intenta iniciar sesión.';
            authMessage.style.color = 'orange';
        } else {
            users[username] = password;
            saveUsers();
            authMessage.textContent = '¡Registro exitoso! Ya puedes iniciar sesión.';
            authMessage.style.color = 'var(--primary-color)';
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });

    // Inicio de Sesión
    loginButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previene envío de formulario
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (users[username] === password) {
            currentUser = username;
            sessionStorage.setItem('loggedInUser', currentUser);
            authMessage.textContent = `¡Bienvenido, ${currentUser}!`;
            authMessage.style.color = 'var(--primary-color)';
            usernameInput.value = '';
            passwordInput.value = '';
            updateUI(); // Actualiza la interfaz después del login
        } else {
            authMessage.textContent = 'Nombre de usuario o contraseña incorrectos.';
            authMessage.style.color = 'red';
        }
    });

    // Cerrar Sesión
    logoutButton.addEventListener('click', () => {
        currentUser = null;
        sessionStorage.removeItem('loggedInUser');
        authMessage.textContent = 'Sesión cerrada.';
        authMessage.style.color = 'var(--primary-color)';
        updateUI(); // Actualiza la interfaz después del logout
    });


    // Cambio en el selector de evaluado (para habilitar/deshabilitar botón de votar)
    evaluadoSelect.addEventListener('change', toggleVotationButton);


    // Envío del formulario de votación
    votingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!currentUser) {
            alert('Debes iniciar sesión para votar.');
            return;
        }

        const selectedEvaluado = evaluadoSelect.value;

        if (!selectedEvaluado) {
            alert('Por favor, selecciona un Evaluado para votar.');
            return;
        }

        // Simular el registro de votos y actualizar los datos del gráfico
        if (votes.hasOwnProperty(selectedEvaluado)) {
            votes[selectedEvaluado]++;
            saveVotes(); // Guarda los votos actualizados
            
            // Actualizar los datos del gráfico con los nuevos votos
            votingChart.data.datasets[0].data = Object.values(votes);
            votingChart.update(); // Redibuja la gráfica

            updateWinnersDisplay(); // Actualiza la sección de ganadores

            alert('¡Voto registrado con éxito!');
        } else {
            alert('Error: Evaluado no válido.');
        }

        // Resetear el formulario y deshabilitar el botón
        votingForm.reset();
        toggleVotationButton();
    });

    // --- Lógica para el Efecto del Ganador ---
    showWinnersEffectButton.addEventListener('click', () => {
        // Eliminar efectos previos
        mejorEvaluadoCard.classList.remove('winner-highlight');
        const existingConfetti = document.querySelector('.confetti-container');
        if (existingConfetti) existingConfetti.remove();

        // Determinar quién es el mejor evaluado
        let bestEvaluadoValue = -1;
        let hasVotes = false;
        for (const value of Object.values(votes)) {
            if (value > 0) hasVotes = true;
            if (value > bestEvaluadoValue) {
                bestEvaluadoValue = value;
            }
        }
        
        if (hasVotes && bestEvaluadoValue > 0) { // Solo si hay votos y un ganador claro
             mejorEvaluadoCard.classList.add('winner-highlight');
             createConfetti(); // Generar confeti solo si hay un ganador con votos
        } else {
            alert('Aún no hay votos suficientes para determinar un ganador o no hay votos registrados.');
        }
    });

    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti-container');
        document.body.appendChild(confettiContainer);

        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#00c853', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = Math.random() * -20 + 'vh';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            confetti.style.transform = `scale(${Math.random() * 0.8 + 0.2})`;
            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => {
            confettiContainer.remove();
        }, 4000);
    }

    // --- Inicialización al cargar la página ---
    updateUI(); // Configura la interfaz según el estado de login
});