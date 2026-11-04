(() => {
  const header = document.querySelector('#header-component');
  if (!header) return;

  const hero = document.querySelector('[data-home-hero]');
  const isHome = Boolean(
    document.body.classList.contains('template-index') ||
      document.querySelector('main[data-template="index"]')
  );

  if (isHome) {
    document.body.classList.add('template-index');
  }

  const compactOffset = 48;
  let pastHeroPrevious = false;
  let ticking = false;

  const update = () => {
    let compact = window.scrollY > compactOffset;

    if (hero && isHome) {
      const pastHero = hero.getBoundingClientRect().bottom <= 0;
      document.body.classList.toggle('is-over-hero', !pastHero);
      document.body.classList.toggle('is-past-hero', pastHero);

      if (pastHero && !pastHeroPrevious) {
        header.classList.add('salon-header--entering');
        void header.offsetWidth;
        window.requestAnimationFrame(() => {
          header.classList.remove('salon-header--entering');
        });
      }

      header.classList.toggle('salon-header--solid', pastHero);
      pastHeroPrevious = pastHero;
      compact = pastHero;
    } else {
      header.classList.toggle('salon-header--solid', compact);
    }

    header.classList.toggle('salon-header--compact', compact);
    document.body.classList.toggle('is-header-compact', compact);
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener('resize', update, { passive: true });
  update();
})();
