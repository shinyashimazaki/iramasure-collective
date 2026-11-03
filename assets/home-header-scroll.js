(() => {
  const hero = document.querySelector('[data-home-hero]');
  const header = document.querySelector('#header-component');
  if (!hero || !header) return;

  const main = document.querySelector('main[data-template="index"]');
  if (!main) return;

  document.body.classList.add('template-index');

  let pastHeroPrevious = false;
  let ticking = false;

  const update = () => {
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
