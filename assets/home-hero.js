(() => {
  const root = document.querySelector('[data-home-hero]');
  if (!root) return;

  const slides = [...root.querySelectorAll('.home-hero__slide')];
  const dots = [...root.querySelectorAll('[data-hero-dot]')];
  if (slides.length < 2) return;

  const intervalMs = (Number.parseFloat(getComputedStyle(root).getPropertyValue('--home-hero-interval')) || 5) * 1000;
  let index = 0;
  let timer;

  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  const play = () => {
    clearInterval(timer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => show(index + 1), intervalMs);
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      show(Number(dot.dataset.heroDot));
      play();
    });
  });

  play();
})();
