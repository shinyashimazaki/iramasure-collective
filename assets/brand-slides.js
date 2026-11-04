(() => {
  if (window.__brandSlidesInit) return;
  window.__brandSlidesInit = true;

  const roots = document.querySelectorAll('[data-brand-slides]');
  if (!roots.length) return;

  roots.forEach((root) => {
    const slides = [...root.querySelectorAll('.brand-slides__slide')];
    const dots = [...root.querySelectorAll('[data-brand-slide-dot]')];
    const credit = root.querySelector('[data-brand-slides-photographer]');
    if (slides.length < 2) return;

    const intervalMs =
      (Number.parseFloat(getComputedStyle(root).getPropertyValue('--brand-slide-interval')) || 5) * 1000;
    let index = 0;
    let timer;

    const updateCredit = (slide) => {
      if (!credit) return;
      const name = slide?.dataset.photographer?.trim() || '';
      credit.textContent = name;
      credit.classList.toggle('is-empty', name === '');
    };

    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      updateCredit(slides[index]);
    };

    const play = () => {
      clearInterval(timer);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(() => show(index + 1), intervalMs);
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        show(Number(dot.dataset.brandSlideDot));
        play();
      });
    });

    updateCredit(slides[index]);
    play();
  });
})();
