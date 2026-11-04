(() => {
  const root = document.querySelector('[data-home-location-gallery]');
  if (!root) return;

  const track = root.querySelector('[data-home-location-track]');
  const dots = Array.from(root.querySelectorAll('[data-home-location-dot]'));
  const prevBtn = root.querySelector('[data-home-location-prev]');
  const nextBtn = root.querySelector('[data-home-location-next]');
  if (!track) return;

  const desktopQuery = window.matchMedia('(min-width: 750px)');
  const slides = () => Array.from(track.querySelectorAll('[data-home-location-slide]'));

  let index = 0;

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap) || 0;
  };

  const getStep = () => {
    const first = slides()[0];
    if (!first) return track.clientWidth;
    if (desktopQuery.matches) return track.clientWidth;
    return first.getBoundingClientRect().width + getGap();
  };

  const clampIndex = (value) => {
    const max = Math.max(0, slides().length - 1);
    return Math.min(max, Math.max(0, value));
  };

  const syncUi = () => {
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', String(on));
    });

    const atStart = index <= 0;
    const atEnd = index >= slides().length - 1;

    if (prevBtn) {
      prevBtn.disabled = atStart;
      prevBtn.setAttribute('aria-disabled', String(atStart));
    }
    if (nextBtn) {
      nextBtn.disabled = atEnd;
      nextBtn.setAttribute('aria-disabled', String(atEnd));
    }
  };

  const goTo = (nextIndex, behavior = 'smooth') => {
    index = clampIndex(nextIndex);
    const step = getStep();
    track.scrollTo({ left: index * step, behavior });
    syncUi();
  };

  const syncFromScroll = () => {
    const step = getStep();
    if (step <= 0) return;
    index = clampIndex(Math.round(track.scrollLeft / step));
    syncUi();
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  prevBtn?.addEventListener('click', () => goTo(index - 1));
  nextBtn?.addEventListener('click', () => goTo(index + 1));

  track.addEventListener(
    'scroll',
    () => {
      window.requestAnimationFrame(syncFromScroll);
    },
    { passive: true }
  );

  const onBreakpointChange = () => {
    goTo(index, 'auto');
  };

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', onBreakpointChange);
  } else {
    desktopQuery.addListener(onBreakpointChange);
  }

  window.addEventListener('resize', () => {
    window.requestAnimationFrame(() => goTo(index, 'auto'));
  });

  syncUi();
})();
