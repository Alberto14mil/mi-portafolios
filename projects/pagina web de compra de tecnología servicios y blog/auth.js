document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const logoutButton = document.getElementById('logoutButton');
    const cartItemCountSpan = document.querySelector('.cart-item-count');

    function updateAuthUI() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const loggedInUser = localStorage.getItem('loggedInUser');

        if (isLoggedIn && loggedInUser) {
            if (loginButton) loginButton.style.display = 'none';
            if (registerButton) registerButton.style.display = 'none';
            if (welcomeMessage) {
                welcomeMessage.textContent = `Hola, ${loggedInUser}`;
                welcomeMessage.style.display = 'inline';
            }
            if (logoutButton) logoutButton.style.display = 'inline-block'; // Usar inline-block para mantener estilo de botón
        } else {
            if (loginButton) loginButton.style.display = 'inline-block';
            if (registerButton) registerButton.style.display = 'inline-block';
            if (welcomeMessage) welcomeMessage.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'none';
        }
    }

    function handleLogout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loggedInUser');
        // Opcional: limpiar también el carrito si quieres que se borre al cerrar sesión
        // localStorage.removeItem('cart'); 
        updateAuthUI(); // Actualizar la UI inmediatamente
        updateCartItemCount(); // Asegurarse de que el carrito también se actualice
        alert('Sesión cerrada correctamente.');
        window.location.href = 'index.html'; // Redirigir a la página de inicio
    }

    // Asignar el evento al botón de cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Función para actualizar el contador de ítems del carrito
    function updateCartItemCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (cartItemCountSpan) { // Asegurarse de que el elemento existe
            if (totalItems > 0) {
                cartItemCountSpan.textContent = totalItems;
                cartItemCountSpan.style.display = 'inline';
            } else {
                cartItemCountSpan.style.display = 'none';
            }
        }
    }

    // Ejecutar al cargar la página
    updateAuthUI();
    updateCartItemCount();
});