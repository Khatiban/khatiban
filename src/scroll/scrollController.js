import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { drawHeroLinks } from '../ui/interface.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

export function setupScroll(scene) {
  // ---- master: scroll position -> camera progress along the curve ----
  ScrollTrigger.create({
    trigger: '#content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      scene.setProgress(self.progress);
      scene.setTint(self.progress);
    },
  });

  // ---- per-section content reveals ----
  $$('.panel').forEach((panel) => {
    const targets = panel.querySelectorAll(
      '.kicker, .lead, .about__body p, .fact, .edu__row, .skill, .job, .proj, .contact__title, .contact__body, .clink, .contact__foot'
    );
    if (!targets.length) return; // e.g. the home panel reveals via the hero intro
    gsap.set(targets, { opacity: 0, y: 42 });
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 72%',
      once: false,
      onEnter: () => reveal(targets),
      onEnterBack: () => reveal(targets),
    });
  });

  // ---- nav active state ----
  $$('.panel').forEach((panel) => {
    ScrollTrigger.create({
      trigger: panel,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) setActiveNav(panel.id);
      },
    });
  });

  // ---- hero parallax: words drift out & wordmark fades as you leave home ----
  gsap.to('.hero__words', {
    scale: 1.35,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('#heroLinks', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'center top', scrub: true },
  });
  gsap.to('.hero__title', {
    yPercent: -18,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true },
  });

  // ---- fade the scroll hint once moving ----
  ScrollTrigger.create({
    start: 'top -80',
    onToggle: (self) => gsap.to('#scrollHint', { opacity: self.isActive ? 0 : 1, duration: 0.4 }),
  });

  // ---- smooth anchor nav ----
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const node = id && $(id);
      if (node) {
        e.preventDefault();
        node.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- redraw hero links on resize ----
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      drawHeroLinks();
      ScrollTrigger.refresh();
    }, 180);
  });
}

function reveal(targets) {
  gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.07,
    ease: 'power3.out',
    overwrite: 'auto',
  });
}

function setActiveNav(id) {
  $$('.nav__item').forEach((n) => n.classList.toggle('is-active', n.dataset.nav === id));
}

// Intro after the preloader lifts.
export function heroIntro() {
  drawHeroLinks();
  const lines = $$('.hero__link');
  lines.forEach((l) => {
    let len = 300;
    try {
      len = l.getTotalLength() || 300;
    } catch (e) {
      /* getTotalLength unsupported -> fall back to fade */
    }
    l.style.strokeDasharray = len;
    l.style.strokeDashoffset = len;
  });

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.hero__title-line', { yPercent: 115, duration: 1.1, stagger: 0.12 }, 0)
    .from('.hero__role', { opacity: 0, y: 16, duration: 0.8 }, 0.5)
    .to(lines, { strokeDashoffset: 0, duration: 1.2, stagger: 0.03, ease: 'power2.out' }, 0.45)
    .from(
      '.hero__word',
      { opacity: 0, scale: 0.6, duration: 0.9, stagger: { each: 0.04, from: 'random' } },
      0.55
    )
    .from('#hud, .badge, .foot', { opacity: 0, duration: 1, stagger: 0.1 }, 0.7);
  return tl;
}
