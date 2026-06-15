# Ehsan Khatiban — Portfolio

An interactive, scroll-driven portfolio inspired by [Synapser Studio](https://www.synapserstudio.com/),
themed around the **neural-network / synapse** idea — fitting for an AI / ML engineer.

Built with **Three.js** (WebGL scene, glowing camera path, selective bloom) and
**GSAP + ScrollTrigger** (scroll choreography, reveals, hero intro).

## The experience

- A giant `EHSAN KHATIBAN` wordmark with radiating italic keywords connected by hairlines — the "synapse map".
- A 3D neural field of nodes + links behind everything, rendered on a fixed canvas.
- A **glowing path** the camera flies along as you scroll; a comet head leads the way and the scene
  shifts section to section (warm → cool glow), with HDR bloom for the glow.
- Six sections: `Home · About · Skills · Work · Projects · Contact`, all driven from one data file.
- Custom cursor, numbered nav, "Open to work" badge, generated ambient-sound toggle, robust preloader.

## Run it

```bash
npm install      # already done
npm run dev      # dev server with hot reload -> http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # preview the production build -> http://localhost:4173
```

## Editing your content

Everything you'd want to change lives in **`src/data/content.js`**:

- `profile` — name, role, email, LinkedIn, GitHub.
- `heroWords` — the floating keywords (each with `x`/`y` as viewport %).
- `about`, `skills`, `experience` (incl. linked GitHub `repos`), `projects`, `contact`.

Visual tuning lives in **`src/scene/SynapseScene.js`** (`CONFIG` at the top): glow colours,
node count, bloom strength/threshold, and the camera `WAYPOINTS`.
Theme colours and typography are CSS variables at the top of **`src/style.css`**.

## Structure

```
index.html                  markup shell + fixed UI
src/
  main.js                   boot: scene + content + scroll + preloader
  style.css                 all styling (sage / grain / grid aesthetic)
  data/content.js           ← all your content
  scene/SynapseScene.js     Three.js scene, glowing path, bloom
  scroll/scrollController.js GSAP ScrollTrigger choreography
  ui/interface.js           builds sections, hero links, cursor, sound
```

## Deploying

The build output in `dist/` is fully static — drop it on **Netlify**, **Vercel**, **Cloudflare Pages**
or **GitHub Pages**. With Vercel/Netlify you can point them at this repo and they'll run
`npm run build` and serve `dist/` automatically.

## Notes

- The design is intentionally typographic (no photo required, like the reference). If you want a
  portrait in the About section, drop your own image in `public/` and reference it — I did **not**
  insert a stock photo of a stranger.
- Fonts load from Google Fonts (Archivo, Newsreader, Space Mono) with system fallbacks.
