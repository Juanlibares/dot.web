const images = [...document.querySelectorAll('main img:not([data-no-zoom])')];
const viewer = document.createElement('dialog');
viewer.className = 'image-viewer';
viewer.setAttribute('aria-label', 'Imagen ampliada');
viewer.innerHTML = `<button class="viewer-close" aria-label="Cerrar imagen">×</button><img class="viewer-image" alt=""><p class="viewer-caption" aria-live="polite"></p><div class="viewer-navigation"><button class="viewer-prev" aria-label="Imagen anterior">←</button><button class="viewer-next" aria-label="Imagen siguiente">→</button></div>`;
document.body.append(viewer);
const expanded = viewer.querySelector('img');
const caption = viewer.querySelector('p');
let group = [], index = 0, previousOverflow = '';
function showImage() {
  expanded.src = group[index].currentSrc || group[index].src;
  expanded.alt = group[index].alt;
  caption.textContent = `${expanded.alt}${group.length > 1 ? ` · ${index + 1} / ${group.length}` : ''}`;
  viewer.querySelector('.viewer-navigation').hidden = group.length < 2;
}
function move(delta) { index = (index + delta + group.length) % group.length; showImage(); }
for (const image of images) {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Ampliar: ${image.alt}`);
  image.setAttribute('aria-haspopup', 'dialog');
  image.classList.add('zoomable');
  function open() {
    const gallery = image.closest('.screenshots');
    group = gallery ? [...gallery.querySelectorAll('img')] : [image];
    index = group.indexOf(image);
    showImage();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    viewer.showModal();
  }
  image.addEventListener('click', open);
  image.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  });
}
viewer.querySelector('.viewer-close').onclick = () => viewer.close();
viewer.querySelector('.viewer-prev').onclick = () => move(-1);
viewer.querySelector('.viewer-next').onclick = () => move(1);
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1); }
});
viewer.addEventListener('close', () => { document.body.style.overflow = previousOverflow; });
