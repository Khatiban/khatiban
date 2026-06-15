import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

const CONFIG = {
  bg: '#c4c3af',
  glow: new THREE.Color('#fff2d4'),
  glowCool: new THREE.Color('#cfe8ff'),
  node: new THREE.Color('#3a3a30'),
  nodeBright: new THREE.Color('#fff6e0'),
  nodeCount: 300,
  linkDistance: 17,
  maxLinksPerNode: 3,
  bloom: { strength: 0.62, radius: 0.42, threshold: 0.72 },
};

// Waypoints the camera path threads through (one rough region per scroll section).
const WAYPOINTS = [
  [0, 0, 14],
  [-9, 5, -10],
  [11, -4, -36],
  [-13, 7, -64],
  [15, -6, -94],
  [-11, 5, -124],
  [9, -7, -152],
  [-6, 4, -182],
  [0, 1, -210],
];

export default class SynapseScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.size = { w: window.innerWidth, h: window.innerHeight };
    this.clock = new THREE.Clock();
    this.progress = 0;
    this.targetProgress = 0;
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseLerp = new THREE.Vector2(0, 0);
    this.tint = 0; // 0..1 blends warm -> cool glow across the journey

    this._initRenderer();
    this._initScene();
    this._buildCurve();
    this._buildNetwork();
    this._buildPath();
    this._buildComet();
    this._initComposer();
    this._bindEvents();

    this.update(0);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(this.size.w, this.size.h);
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.setClearColor(new THREE.Color(CONFIG.bg), 1);
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.bg);
    this.scene.fog = new THREE.Fog(new THREE.Color(CONFIG.bg), 60, 240);

    this.camera = new THREE.PerspectiveCamera(58, this.size.w / this.size.h, 0.1, 600);
    this.camera.position.set(0, 0, 16);

    this.world = new THREE.Group();
    this.scene.add(this.world);
  }

  _buildCurve() {
    const pts = WAYPOINTS.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    this.curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  }

  _buildNetwork() {
    // Sample anchor points along the curve so the web always surrounds the camera.
    const anchors = [];
    for (let i = 0; i < 16; i++) anchors.push(this.curve.getPointAt(i / 15));

    const positions = [];
    const dark = [];
    const bright = [];
    const tmp = new THREE.Vector3();

    for (let i = 0; i < CONFIG.nodeCount; i++) {
      const a = anchors[(Math.random() * anchors.length) | 0];
      tmp.set(
        (Math.random() - 0.5) * 46,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40
      );
      const p = a.clone().add(tmp);
      positions.push(p);
      if (Math.random() < 0.16) bright.push(p);
      else dark.push(p);
    }
    this.nodes = positions;

    // --- network lines (the dark synapse web) ---
    const linePts = [];
    let links = 0;
    for (let i = 0; i < positions.length; i++) {
      let made = 0;
      for (let j = i + 1; j < positions.length && made < CONFIG.maxLinksPerNode; j++) {
        if (positions[i].distanceTo(positions[j]) < CONFIG.linkDistance) {
          linePts.push(positions[i].x, positions[i].y, positions[i].z);
          linePts.push(positions[j].x, positions[j].y, positions[j].z);
          made++;
          links++;
        }
      }
    }
    this.linkCount = links;
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePts, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: CONFIG.node,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    this.lines = new THREE.LineSegments(lineGeo, lineMat);
    this.world.add(this.lines);

    // --- dark structural nodes ---
    const dotTex = this._dotTexture();
    this.world.add(
      this._points(dark, {
        color: CONFIG.node,
        size: 1.5,
        opacity: 0.85,
        map: dotTex,
        additive: false,
      })
    );
    // --- bright glowing nodes (catch the bloom) ---
    this.brightPoints = this._points(bright, {
      color: CONFIG.nodeBright,
      size: 2.6,
      opacity: 1,
      map: dotTex,
      additive: true,
    });
    this.world.add(this.brightPoints);
  }

  _points(list, opt) {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(list.length * 3);
    list.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const mat = new THREE.PointsMaterial({
      color: opt.color,
      size: opt.size,
      map: opt.map,
      transparent: true,
      opacity: opt.opacity,
      depthWrite: false,
      sizeAttenuation: true,
      blending: opt.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    return new THREE.Points(geo, mat);
  }

  _dotTexture() {
    const s = 64;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.9)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _buildPath() {
    const geo = new THREE.TubeGeometry(this.curve, 700, 0.09, 8, false);

    this.pathMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uColor: { value: CONFIG.glow.clone() },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uProgress;
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main(){
          float along = vUv.x;
          if (along > uProgress) discard;
          float d = uProgress - along;          // distance behind the drawing head
          float head = smoothstep(0.05, 0.0, d); // bright comet near the head
          float trail = exp(-d * 5.0) * 0.45 + 0.09;
          float pulse = 0.5 + 0.5 * sin(along * 55.0 - uTime * 3.5);
          float intensity = trail + head * 1.5 + pulse * 0.09;
          gl_FragColor = vec4(uColor * intensity, 1.0);
        }
      `,
    });
    this.path = new THREE.Mesh(geo, this.pathMat);
    this.world.add(this.path);

    // faint full-route ghost so the path ahead is hinted
    const ghostMat = new THREE.MeshBasicMaterial({
      color: CONFIG.glow,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.ghost = new THREE.Mesh(
      new THREE.TubeGeometry(this.curve, 400, 0.04, 6, false),
      ghostMat
    );
    this.world.add(this.ghost);
  }

  _buildComet() {
    const g = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.26, 3),
      new THREE.MeshBasicMaterial({ color: CONFIG.glow })
    );
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: this._dotTexture(),
        color: CONFIG.glow,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    halo.scale.set(4, 4, 1);
    g.add(core, halo);
    this.comet = g;
    this.cometCore = core;
    this.cometHalo = halo;
    this.world.add(g);
  }

  _initComposer() {
    // bloom is naturally blurry, so render it at half resolution — ~4x cheaper
    this.bloomScale = 0.5;
    const rt = new THREE.WebGLRenderTarget(this.size.w, this.size.h, {
      type: THREE.HalfFloatType,
    });
    this.composer = new EffectComposer(this.renderer, rt);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(
      new THREE.Vector2(this.size.w * this.bloomScale, this.size.h * this.bloomScale),
      CONFIG.bloom.strength,
      CONFIG.bloom.radius,
      CONFIG.bloom.threshold
    );
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
  }

  _bindEvents() {
    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);
    window.addEventListener(
      'pointermove',
      (e) => {
        this.mouse.x = (e.clientX / this.size.w) * 2 - 1;
        this.mouse.y = (e.clientY / this.size.h) * 2 - 1;
      },
      { passive: true }
    );
  }

  // progress: 0..1 from the scroll controller
  setProgress(p) {
    this.targetProgress = THREE.MathUtils.clamp(p, 0, 1);
  }

  setTint(t) {
    this.tint = THREE.MathUtils.clamp(t, 0, 1);
  }

  update() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    // smooth the scrubbed progress for a fluid glide
    this.progress += (this.targetProgress - this.progress) * Math.min(1, dt * 6);
    const p = THREE.MathUtils.clamp(this.progress, 0, 0.999);
    const head = THREE.MathUtils.clamp(p + 0.055, 0, 1);

    // camera flies along the curve, looking just ahead at the drawing head
    const pos = this.curve.getPointAt(p);
    const look = this.curve.getPointAt(head);
    const tangent = this.curve.getTangentAt(p);

    this.mouseLerp.x += (this.mouse.x - this.mouseLerp.x) * Math.min(1, dt * 3);
    this.mouseLerp.y += (this.mouse.y - this.mouseLerp.y) * Math.min(1, dt * 3);

    const side = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
    this.camera.position.copy(pos)
      .addScaledVector(side, this.mouseLerp.x * 2.2)
      .add(new THREE.Vector3(0, -this.mouseLerp.y * 1.6 + 0.6, 0));
    this.camera.lookAt(look);

    // glowing path + comet follow the head
    this.pathMat.uniforms.uProgress.value = head;
    this.pathMat.uniforms.uTime.value = t;
    const headPos = this.curve.getPointAt(head);
    this.comet.position.copy(headPos);
    const flick = 0.85 + Math.sin(t * 9) * 0.12;
    this.cometCore.scale.setScalar(flick);
    this.cometHalo.scale.setScalar(4 + Math.sin(t * 3) * 0.5);

    // warm -> cool glow shift across the journey
    const col = CONFIG.glow.clone().lerp(CONFIG.glowCool, this.tint * 0.6);
    this.pathMat.uniforms.uColor.value.copy(col);
    this.cometCore.material.color.copy(col);
    this.cometHalo.material.color.copy(col);

    // gentle drift of the whole web
    this.world.rotation.y = Math.sin(t * 0.05) * 0.04 + this.mouseLerp.x * 0.04;
    this.world.rotation.x = Math.cos(t * 0.04) * 0.02 - this.mouseLerp.y * 0.03;

    this.composer.render();
  }

  resize() {
    this.size.w = window.innerWidth;
    this.size.h = window.innerHeight;
    this.camera.aspect = this.size.w / this.size.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(this.size.w, this.size.h);
    this.composer.setSize(this.size.w, this.size.h);
    this.bloom.setSize(this.size.w * this.bloomScale, this.size.h * this.bloomScale);
  }

  dispose() {
    window.removeEventListener('resize', this._onResize);
  }
}
