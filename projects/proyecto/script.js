document.addEventListener('DOMContentLoaded', () => {

    const photos = [
        'imagen/imagen1.jpg',
        'imagen/imagen2.jpg',
        'imagen/imagen3.jpg',
        'imagen/imagen4.jpg',
        'imagen/imagen5.jpg',
        'imagen/imagen6.jpg',
        'imagen/imagen7.jpg'
    ];

    const documents = [
        { name: 'Informe del Proyecto 2023', path: 'doc/SC.I5SA GRUPO 6 Alberto santiago y samuel  01-05-2025.pdf' },
        { name: 'Diapositiva de Exposición', path: 'doc/Gráfico de Mapa Conceptual Circular con Flechas Geométrico Multicolor (2).jpg' }
    ];
    
    const communityMessages = [
        '¡Únete a nuestra jornada de voluntariado el próximo mes!',
        'Tu apoyo hace la diferencia en nuestra comunidad.',
        'Conoce los logros de nuestros proyectos este semestre.'
    ];

    const photoGallery = document.querySelector('.photo-gallery');
    const documentsList = document.querySelector('.documents-list ul');
    const sideNav = document.getElementById('side-nav');
    const openNavBtn = document.querySelector('.open-nav-btn');
    const closeNavBtn = document.querySelector('.close-nav-btn');
    const header = document.querySelector('header');

    // Inserta las imágenes en la galería
    photos.forEach(photoUrl => {
        const img = document.createElement('img');
        img.src = photoUrl;
        img.alt = 'Foto del servicio comunitario';
        photoGallery.appendChild(img);
    });

    // Inserta los documentos en la lista
    documents.forEach(doc => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = doc.path;
        link.textContent = doc.name;
        link.target = "_blank";

        listItem.appendChild(link);
        documentsList.appendChild(listItem);
    });
    
    // Inserta los mensajes de la comunidad en el header
    const messagesContainer = document.querySelector('.community-messages-container');
    
    communityMessages.forEach(message => {
        const messageSpan = document.createElement('span');
        messageSpan.classList.add('community-message');
        messageSpan.textContent = message;
        messagesContainer.appendChild(messageSpan);
    });

    // Función para abrir el menú
    openNavBtn.addEventListener('click', () => {
        sideNav.style.width = '250px';
    });

    // Función para cerrar el menú
    closeNavBtn.addEventListener('click', () => {
        sideNav.style.width = '0';
    });

});