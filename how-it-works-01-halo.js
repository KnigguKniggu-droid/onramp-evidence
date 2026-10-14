/* How it Works / Halo: a small, dependency-free reveal for the static site. */
(function () {
  const section = document.querySelector('.halo-how');
  if (!section) return;

  const reveal = [...section.querySelectorAll('.halo-step, .halo-cta-row')];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    reveal.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      self.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  reveal.forEach((node) => observer.observe(node));
})();
