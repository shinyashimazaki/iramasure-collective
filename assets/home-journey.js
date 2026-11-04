(() => {
  const root = document.querySelector('[data-home-journey]');
  if (!root) return;

  const track = root.querySelector('[data-home-journey-track]');
  const prevBtn = root.querySelector('[data-home-journey-prev]');
  const nextBtn = root.querySelector('[data-home-journey-next]');
  if (!track) return;

  const cards = () => Array.from(track.querySelectorAll('.home-journey__card'));

  const getGap = () => {
    const styles = window.getComputedStyle(track);
    return parseFloat(styles.columnGap || styles.gap) || 0;
  };

  const getStep = () => {
    const first = cards()[0];
    if (!first) return track.clientWidth;
    return first.getBoundingClientRect().width + getGap();
  };

  const updateControls = () => {
    const max = track.scrollWidth - track.clientWidth;
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= max - 2;

    if (prevBtn) {
      prevBtn.disabled = atStart;
      prevBtn.setAttribute('aria-disabled', String(atStart));
    }
    if (nextBtn) {
      nextBtn.disabled = atEnd || max <= 0;
      nextBtn.setAttribute('aria-disabled', String(atEnd || max <= 0));
    }

    root.classList.toggle('is-scrollable', max > 2);
  };

  const scrollByDir = (dir) => {
    track.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
  };

  prevBtn?.addEventListener('click', () => scrollByDir(-1));
  nextBtn?.addEventListener('click', () => scrollByDir(1));

  let isPointerDown = false;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  let pointerId = null;

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    isPointerDown = true;
    moved = false;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
    track.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isPointerDown || event.pointerId !== pointerId) return;

    const delta = event.clientX - startX;
    if (Math.abs(delta) > 4) moved = true;
    track.scrollLeft = startScroll - delta;
  };

  const onPointerUp = (event) => {
    if (!isPointerDown || event.pointerId !== pointerId) return;

    isPointerDown = false;
    pointerId = null;
    track.classList.remove('is-dragging');
    track.releasePointerCapture?.(event.pointerId);
    updateControls();
  };

  track.addEventListener('pointerdown', onPointerDown);
  track.addEventListener('pointermove', onPointerMove);
  track.addEventListener('pointerup', onPointerUp);
  track.addEventListener('pointercancel', onPointerUp);
  track.addEventListener('scroll', () => window.requestAnimationFrame(updateControls), { passive: true });

  // Prevent accidental link clicks after a drag.
  track.addEventListener(
    'click',
    (event) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    },
    true
  );

  track.addEventListener(
    'wheel',
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (track.scrollWidth <= track.clientWidth) return;

      event.preventDefault();
      track.scrollLeft += event.deltaY;
      updateControls();
    },
    { passive: false }
  );

  window.addEventListener('resize', updateControls, { passive: true });
  updateControls();
})();
