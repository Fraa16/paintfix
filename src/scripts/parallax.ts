/**
 * Paintfix Aviation motion system (aviation page + Home interlude only).
 *
 * Markup contract:
 *   [data-parallax-scope]              section that drives its children (ScrollTrigger trigger)
 *   [data-parallax-start="top"]        scope sits at the top of the page (hero): 0 → value over its height
 *   [data-parallax-y="-12"]            travel in % of the element's own height (xPercent / yPercent)
 *   [data-parallax-x="6"]              horizontal travel in %
 *   [data-parallax-fade]               fades out over the scope (hero copy)
 *   [data-flyby]                       aircraft crosses the viewport horizontally
 *
 * Transforms only (no layout thrash). Disabled entirely with prefers-reduced-motion.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function initParallax() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  const coarse = matchMedia('(pointer: coarse)').matches;
  const header = document.querySelector<HTMLElement>('[data-header]');

  // Smooth wheel scrolling for the gliding feel. Touch devices keep native scrolling.
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    anchors: { offset: -(header?.offsetHeight ?? 80) },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Smaller amplitude on touch devices: less motion, less GPU work.
  const amp = coarse ? 0.55 : 1;

  document.querySelectorAll<HTMLElement>('[data-parallax-scope]').forEach((scope) => {
    const atTop = scope.dataset.parallaxStart === 'top';
    const els = scope.querySelectorAll<HTMLElement>(
      '[data-parallax-y], [data-parallax-x], [data-parallax-fade]',
    );

    els.forEach((el) => {
      if (el.closest('[data-parallax-scope]') !== scope) return;

      if (el.hasAttribute('data-flyby')) {
        const stage = el.closest<HTMLElement>('.sky-scene') ?? scope;
        gsap.fromTo(
          el,
          { x: 0, yPercent: 0 },
          {
            x: () => window.innerWidth * 1.75,
            yPercent: -40 * amp,
            ease: 'none',
            scrollTrigger: {
              trigger: stage,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
        return;
      }

      const y = parseFloat(el.dataset.parallaxY ?? '0') * amp;
      const x = parseFloat(el.dataset.parallaxX ?? '0') * amp;
      const fade = el.hasAttribute('data-parallax-fade');
      const from = atTop
        ? { yPercent: 0, xPercent: 0, opacity: 1 }
        : { yPercent: -y / 2, xPercent: -x / 2 };
      const to: gsap.TweenVars = atTop
        ? { yPercent: y, xPercent: x }
        : { yPercent: y / 2, xPercent: x / 2 };
      if (fade) to.opacity = 0;

      gsap.fromTo(el, from, {
        ...to,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: atTop ? 'top top' : 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  });

  // Images load after init; recalculate once everything has its final size.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
