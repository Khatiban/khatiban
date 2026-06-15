import './style.css';
import gsap from 'gsap';
import SynapseScene from './scene/SynapseScene.js';
import { buildContent, initCursor, initSound } from './ui/interface.js';
import { setupScroll, heroIntro } from './scroll/scrollController.js';

const $ = (s) => document.querySelector(s);

function boot() {
  // 1. content from the CV data
  buildContent();

  // 2. the WebGL synapse field
  const scene = new SynapseScene($('#webgl'));
  window.__scene = scene; // debug/verification hook (force a synchronous render)

  // 3. render loop (with a pause hook used for stable screenshots / hidden tab)
  let paused = false;
  let rafId;
  const tick = () => {
    scene.update();
    if (!paused) rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
  window.__capture = (on) => {
    const was = paused;
    paused = !!on;
    document.documentElement.classList.toggle('capture', paused);
    if (was && !paused) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.__capture(true);
    else window.__capture(false);
  });

  // 4. interface bits
  initCursor();
  initSound();

  // 5. scroll wiring
  setupScroll(scene);

  // 6. preloader -> reveal
  runPreloader().then(() => {
    window.__introTL = heroIntro();
  });
}

function runPreloader() {
  return new Promise((resolve) => {
    const bar = $('#pl-bar');
    const count = $('#pl-count');
    const pre = $('#preloader');
    let finished = false;

    // Completes exactly once. `instant` lifts without animation — used for the
    // setTimeout safety net, which still fires even when the tab is backgrounded
    // (where rAF / the GSAP ticker are paused and would otherwise stall here).
    const complete = (instant) => {
      if (finished) return;
      finished = true;
      count.textContent = '100';
      bar.style.width = '100%';
      if (instant) {
        pre.classList.add('is-done');
        pre.style.transition = 'transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)';
        pre.style.transform = 'translateY(-100%)';
        setTimeout(resolve, 60);
      } else {
        const tl = gsap.timeline({ onComplete: resolve });
        tl.to('.preloader__inner', { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' })
          .to('#preloader', {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut',
            onStart: () => pre.classList.add('is-done'),
          }, '-=0.1');
      }
    };

    // Nice animated counter when the tab is visible (ticker runs).
    const state = { v: 0 };
    gsap.to(state, {
      v: 100,
      duration: 2,
      ease: 'power1.inOut',
      onUpdate: () => {
        const cap = document.readyState === 'complete' ? 100 : 92;
        const v = Math.min(state.v, cap);
        count.textContent = Math.round(v);
        bar.style.width = v + '%';
      },
      onComplete: () => {
        if (document.readyState === 'complete') complete(false);
        else window.addEventListener('load', () => complete(false), { once: true });
      },
    });

    // Guaranteed completion regardless of visibility / ticker state.
    setTimeout(() => complete(document.hidden), 3500);
  });
}

boot();
