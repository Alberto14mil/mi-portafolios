(function () {
  const modal = document.getElementById('modal');
  const content = modal.querySelector('.modal-content');

  function openModal(node) {
    const type = node.getAttribute('data-type');
    const src = node.getAttribute('data-src');
    content.innerHTML = '';

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      content.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Vista previa del proyecto';
      content.appendChild(img);
    }

    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    content.innerHTML = '';
  }

  document.addEventListener('click', (e) => {
    const preview = e.target.closest('.preview-btn');
    if (preview) {
      e.preventDefault();
      openModal(preview);
    }
    if (e.target.matches('[data-close]')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
})();
