// script-album.js
document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica del Menú Desplegable Principal ---
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // Muestra/Oculta el menú desplegable al hacer clic en el botón
    menuToggle.addEventListener('click', function() {
        dropdownMenu.classList.toggle('show');
    });

    // Cierra el menú desplegable si se hace clic fuera de él
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // --- Lógica de "Mostrar Más Fotos" ---
    const photoGrid = document.getElementById('photoGrid');
    const showMoreBtn = document.getElementById('showMoreBtn');

    // Función para obtener las fotos ocultas en su orden original
    function hiddenPhotosByOrder() {
        return Array.from(photoGrid.querySelectorAll('.photo-card.hidden-photo'));
    }

    let photosToShowPerClick = 5; // Cantidad de fotos a mostrar con cada clic

    function showNextPhotos() {
        let photosShownCount = 0;
        const currentHiddenPhotos = hiddenPhotosByOrder();

        for (let i = 0; i < currentHiddenPhotos.length; i++) {
            if (photosShownCount < photosToShowPerClick) {
                currentHiddenPhotos[i].classList.remove('hidden-photo');
                photosShownCount++;
            } else {
                break; // Detener una vez que se han mostrado las deseadas
            }
        }

        // Si ya no quedan fotos ocultas, ocultar el botón "Mostrar Más"
        if (photoGrid.querySelectorAll('.photo-card.hidden-photo').length === 0) {
            showMoreBtn.style.display = 'none';
        }
    }

    // Inicializar el estado del botón al cargar la página
    if (hiddenPhotosByOrder().length === 0) {
        showMoreBtn.style.display = 'none'; // Si no hay fotos ocultas, no mostrar el botón
    }

    showMoreBtn.addEventListener('click', showNextPhotos);

    // --- Lógica de la Vista Previa de Fotos con Descarga ---
    const previewOverlay = document.querySelector('.preview-overlay');
    const previewImage = previewOverlay.querySelector('img');
    const downloadBtn = previewOverlay.querySelector('.download-btn');
    const closeBtn = previewOverlay.querySelector('.close-btn');

    const allPhotoCards = photoGrid.querySelectorAll('.photo-card');

    allPhotoCards.forEach(card => {
        const imgElement = card.querySelector('img');
        const imgSrc = imgElement.src;
        const altText = imgElement.alt;

        imgElement.style.cursor = 'pointer'; // Indica que es clicable
        
        imgElement.addEventListener('click', () => {
            previewImage.src = imgSrc;
            previewImage.alt = altText;
            
            // Configurar el enlace de descarga
            // Obtiene el nombre del archivo de la ruta y lo usa para la descarga
            const fileName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1);
            downloadBtn.href = imgSrc;
            downloadBtn.download = fileName; 
            
            previewOverlay.style.display = 'flex'; // Muestra el overlay
            document.body.style.overflow = 'hidden'; // Evita el scroll del cuerpo
        });
    });

    // Cierra el overlay de vista previa al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', () => {
        previewOverlay.style.display = 'none';
        document.body.style.overflow = ''; // Restaura el scroll del cuerpo
    });

    // Opcional: Cierra el overlay al hacer clic fuera de la imagen (pero dentro del overlay)
    previewOverlay.addEventListener('click', (event) => {
        if (event.target === previewOverlay) { // Solo si se hizo clic directamente en el overlay, no en la imagen o botón
            previewOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});