(() => {
  const root = document.querySelector('[data-home-location-gallery]');
  if (!root) return;

  const track = root.querySelector('[data-home-location-track]');
  const dots = Array.from(root.querySelectorAll('[data-home-location-dot]'));
  if (!track) return;

  const slides = () => Array.from(track.querySelectorAll('[data-home-location-slide]'));

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap) || 0;
  };

  const getStep = () => {
    const first = slides()[0];
    if (!first) return track.clientWidth;
    return first.getBoundingClientRect().width + getGap();
  };

  const activeIndex = () => {
    const step = getStep();
    if (step <= 0) return 0;
    return Math.round(track.scrollLeft / step);
  };

  const syncDots = () => {
    const index = activeIndex();
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', String(on));
    });
  };

  const goTo = (index) => {
    const step = getStep();
    track.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goTo(index));
  });

  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(syncDots);
  }, { passive: true });

  window.addEventListener('resize', () => {
    window.requestAnimationFrame(syncDots);
  });

  syncDots();
})();
