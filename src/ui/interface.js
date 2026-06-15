import { profile, heroWords, sections, about, skills, experience, projects, contact } from '../data/content.js';

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

export function buildContent() {
  buildNav();
  buildHeroWords();
  buildAbout();
  buildSkills();
  buildWork();
  buildProjects();
  buildContact();
  $('#year').textContent = new Date().getFullYear();
}

function buildNav() {
  const nav = $('#nav');
  sections.forEach((s) => {
    const a = el('a', 'nav__item');
    a.href = `#${s.id}`;
    a.dataset.nav = s.id;
    a.innerHTML = `<i>${s.index}</i>${s.label}`;
    nav.appendChild(a);
  });
}

function buildHeroWords() {
  const wrap = $('#heroWords');
  heroWords.forEach((w, i) => {
    const span = el('span', 'hero__word', w.text);
    span.style.left = `${w.x}%`;
    span.style.top = `${w.y}%`;
    span.dataset.i = i;
    wrap.appendChild(span);
  });
}

// Draw SVG hairlines from each floating word toward the wordmark centre.
export function drawHeroLinks() {
  const svg = $('#heroLinks');
  const words = [...document.querySelectorAll('.hero__word')];
  const hero = $('.hero');
  if (!svg || !hero || !words.length) return;
  const r = hero.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
  svg.innerHTML = '';
  const cx = r.width / 2;
  const cy = r.height / 2;
  words.forEach((word) => {
    const wr = word.getBoundingClientRect();
    const wx = wr.left - r.left + wr.width / 2;
    const wy = wr.top - r.top + wr.height / 2;
    // stop the line short of the centre so it doesn't cross the wordmark
    const dx = cx - wx;
    const dy = cy - wy;
    const len = Math.hypot(dx, dy) || 1;
    const ex = wx + dx * (1 - 240 / len);
    const ey = wy + dy * (1 - 70 / len);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', wx);
    line.setAttribute('y1', wy);
    line.setAttribute('x2', ex);
    line.setAttribute('y2', ey);
    line.setAttribute('class', 'hero__link');
    svg.appendChild(line);
  });
  return svg;
}

function buildAbout() {
  $('#aboutHeading').textContent = about.heading;
  const body = $('#aboutBody');
  about.body.forEach((p) => body.appendChild(el('p', null, p)));

  const facts = $('#aboutFacts');
  about.facts.forEach((f) => {
    facts.appendChild(el('div', 'fact', `<b>${f.k}</b><span>${f.v}</span>`));
  });
  const edu = el('div', 'edu');
  about.education.forEach((e) => {
    edu.appendChild(
      el('div', 'edu__row', `<i>${e.period}</i><strong>${e.degree}</strong><em>${e.org}</em>`)
    );
  });
  facts.appendChild(edu);
}

function buildSkills() {
  const grid = $('#skillsGrid');
  skills.forEach((s) => {
    const card = el('div', 'skill');
    card.appendChild(el('div', 'skill__h', s.group));
    const ul = el('ul');
    s.items.forEach((it) => ul.appendChild(el('li', null, it)));
    card.appendChild(ul);
    grid.appendChild(card);
  });
}

function buildWork() {
  const list = $('#workList');
  experience.forEach((j) => {
    const row = el('div', 'job');
    row.appendChild(el('div', 'job__period', j.period));
    row.appendChild(el('div', 'job__head', `<h3>${j.role}</h3><span>${j.org}</span>`));
    const ul = el('ul', 'job__points');
    j.points.forEach((p) => ul.appendChild(el('li', null, p)));
    const pts = el('div');
    pts.appendChild(ul);
    if (j.repos && j.repos.length) {
      const repos = el('div', 'job__repos');
      j.repos.forEach((name) => {
        const a = el('a', 'repo-chip', `<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.49-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.52.56.83 1.28.83 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z"/></svg>${name}`);
        a.href = `${profile.github}/${name}`;
        a.target = '_blank';
        a.rel = 'noopener';
        repos.appendChild(a);
      });
      pts.appendChild(repos);
    }
    row.appendChild(pts);
    list.appendChild(row);
  });
}

function buildProjects() {
  const grid = $('#projectsGrid');
  projects.forEach((p) => {
    const card = el('div', 'proj');
    card.appendChild(el('div', 'proj__n', `PROJECT — ${p.n}`));
    card.appendChild(el('h3', 'proj__title', p.title));
    card.appendChild(el('p', 'proj__blurb', p.blurb));
    const tags = el('div', 'proj__tags');
    p.tags.forEach((t) => tags.appendChild(el('span', null, t)));
    card.appendChild(tags);
    grid.appendChild(card);
  });
}

function buildContact() {
  $('#contactHeading').textContent = contact.heading;
  $('#contactBody').textContent = contact.body;
  const links = $('#contactLinks');
  const data = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'LinkedIn', value: 'in/ehsankhatiban', href: profile.linkedin },
    { label: 'GitHub', value: profile.githubUser, href: profile.github },
  ];
  data.forEach((d) => {
    const a = el('a', 'clink');
    a.href = d.href;
    if (d.href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    a.innerHTML = `<span>${d.label}</span>${d.value}`;
    links.appendChild(a);
  });
}

/* ---------- Custom cursor ---------- */
export function initCursor() {
  const cursor = $('#cursor');
  if (!cursor || matchMedia('(pointer: coarse)').matches) return;
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let cx = x;
  let cy = y;
  window.addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
    },
    { passive: true }
  );
  const loop = () => {
    cx += (x - cx) * 0.2;
    cy += (y - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  const hoverSel = 'a, button, .proj, .skill, .job';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(hoverSel)) cursor.classList.add('is-hover');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(hoverSel)) cursor.classList.remove('is-hover');
  });
}

/* ---------- Ambient sound (generated, no asset needed) ---------- */
export function initSound() {
  const btn = $('#sound');
  if (!btn) return;
  let ctx = null;
  let on = false;
  let master = null;

  const start = () => {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    // two detuned low oscillators = soft ambient drone
    [55, 82.5].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.25;
      o.connect(g).connect(master);
      o.start();
    });
    // slow filtered noise shimmer
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.04;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 600;
    noise.connect(lp).connect(master);
    noise.start();
  };

  btn.addEventListener('click', () => {
    on = !on;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
    if (!ctx && on) start();
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(on ? 0.12 : 0, ctx.currentTime + 0.6);
    }
  });
}
