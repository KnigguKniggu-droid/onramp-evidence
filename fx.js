// OnRamp Evidence Explorer: enhancement layer (Claude Code, 2026-10-13).
// The page is complete without this file. It adds:
//   - a Three.js suite map that recolours by classification (reactive scene)
//   - GSAP ScrollTrigger: a scroll-played blind-fix sequence, section reveals and number tickers
//   - pointer parallax with a cloth-like tilt on the hero layers
//   - an opt-in WebAudio chime when a run is classified
// Everything honours prefers-reduced-motion, and nothing here hides or replaces evidence text.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// ---------- sound (off by default; the user turns it on) ----------
const sound = (() => {
  const btn = document.getElementById('sound');
  let on = false, ac = null;
  try { on = localStorage.getItem('onramp-sound') === '1'; } catch (e) { /* storage blocked */ }
  const paint = () => { if (!btn) return; btn.setAttribute('aria-pressed', String(on)); btn.firstElementChild.textContent = on ? '♪ Sound on' : '♪ Sound off'; };
  paint();
  btn?.addEventListener('click', () => {
    on = !on; paint();
    try { localStorage.setItem('onramp-sound', on ? '1' : '0'); } catch (e) { /* ignore */ }
    if (on) play((window.__onramp_result && window.__onramp_result.state) || 'warn');
  });
  function play(state) {
    if (!on) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      // clean = rising fifth, regression = falling minor third, warn/inconclusive = repeated neutral tone
      const notes = state === 'ok' ? [659.25, 987.77] : state === 'bad' ? [523.25, 440] : [587.33, 587.33];
      notes.forEach((f, i) => {
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * 0.13;
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.11, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 1);
      });
    } catch (e) { /* audio unavailable */ }
  }
  return { play };
})();

// ---------- GSAP: reveals, tickers, scroll-played sequence, parallax ----------
const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
if (gsap && ScrollTrigger) {
  document.documentElement.classList.add('fx');
  gsap.registerPlugin(ScrollTrigger);
  // trigger positions go stale when the demo renders its cards and map, so refresh whenever the page height changes
  let rt = 0, lastH = 0;
  new ResizeObserver(() => {
    const h = document.body.scrollHeight; if (Math.abs(h - lastH) < 2) return; lastH = h;
    clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 120);
  }).observe(document.body);
  const steps = document.getElementById('steps');
  if (!reduce) {
    // section reveals: elements start visible in the HTML; GSAP only animates *from* an offset
    gsap.utils.toArray('main section .sh, main section .two, main section .strip, main .runs, main .who, main .timeline').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      gsap.from(el, { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    // stats ticker: counts up to the exact number in the HTML, then restores the original text
    document.querySelectorAll('.stat > b').forEach(b => {
      const final = b.textContent, n = parseInt(final.replace(/,/g, ''), 10);
      if (!n) return;
      const sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = final;
      b.setAttribute('aria-hidden', 'true'); b.after(sr);
      const o = { v: 0 };
      gsap.to(o, { v: n, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: b, start: 'top 95%', once: true },
        onUpdate: () => { b.textContent = Math.round(o.v).toLocaleString('en-US'); }, onComplete: () => { b.textContent = final; } });
    });
    // scroll-played sequence: the blind-fix steps light up in order as you scroll (scrubbed, never pinned)
    if (steps) {
      steps.classList.add('seq');
      const items = [...steps.children];
      gsap.set(items, { opacity: 0.75 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: steps, start: 'top 85%', end: 'bottom 55%', scrub: 0.5 } });
      tl.to(steps, { '--prog': 1, ease: 'none', duration: items.length }, 0);
      items.forEach((li, i) => tl.to(li, { opacity: 1, duration: 0.4 }, i + 0.1));
    }
    // pointer parallax + cloth-like tilt on the hero layers (fine pointers only)
    const hero = document.querySelector('.hero');
    if (hero && finePointer) {
      const layers = [...hero.querySelectorAll('[data-depth]')].map(el => ({
        el, d: +el.dataset.depth, t: +(el.dataset.tilt || 0),
        x: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }),
        rx: el.dataset.tilt ? gsap.quickTo(el, 'rotationX', { duration: 1.1, ease: 'power3' }) : null,
        ry: el.dataset.tilt ? gsap.quickTo(el, 'rotationY', { duration: 1.1, ease: 'power3' }) : null,
      }));
      layers.forEach(l => { if (l.t) gsap.set(l.el, { transformPerspective: 900 }); });
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach(l => { l.x(nx * l.d); l.y(ny * l.d); if (l.rx) { l.rx(-ny * l.t); l.ry(nx * l.t); } });
      });
      hero.addEventListener('pointerleave', () => layers.forEach(l => { l.x(0); l.y(0); if (l.rx) { l.rx(0); l.ry(0); } }));
    }
  }
}

// ---------- pause decorative drift when the hero is off-screen ----------
const liquid = document.querySelector('.liquid');
if (liquid) new IntersectionObserver(es => liquid.classList.toggle('paused', !es[0].isIntersecting)).observe(document.querySelector('.hero'));

// ---------- demo reactions: verdict transition, card tickers, chime ----------
function onResult(detail) {
  if (gsap && !reduce) {
    gsap.fromTo('#verdict', { opacity: 0.35, y: 4 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    gsap.from('#cards .card', { opacity: 0, y: 8, duration: 0.3, stagger: 0.035, ease: 'power2.out' });
    document.querySelectorAll('#cards .card b').forEach(b => {
      const final = b.textContent, n = parseInt(final.replace(/,/g, ''), 10);
      if (!n) return;
      const o = { v: 0 };
      gsap.to(o, { v: n, duration: 0.7, ease: 'power2.out', onUpdate: () => { b.textContent = Math.round(o.v).toLocaleString('en-US'); }, onComplete: () => { b.textContent = final; } });
    });
  }
  if (detail.user) sound.play(detail.state);
  suite.update(detail.res);
}

// ---------- Three.js suite map ----------
const suite = (() => {
  const box = document.getElementById('suite');
  let ready = null, pending = null, api = null;
  const COLORS = { unchanged_pass: '--muted', inherited: '--warn', regression: '--bad', new_failure: '--bad', fixed: '--ok', new_test: '--ok', not_run: '--info', skipped: '--info' };
  const KEYS = Object.keys(COLORS);

  async function init() {
    if (!box) return null;
    let THREE;
    try {
      THREE = await import('./vendor/three.module.min.js');
    } catch (e) { box.classList.add('nogl'); return null; }
    const canvas = box.querySelector('canvas');
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { box.classList.add('nogl'); return null; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0, 3.35);
    const group = new THREE.Group(); scene.add(group);
    group.rotation.x = 0.35;

    // round, soft points
    const dot = document.createElement('canvas'); dot.width = dot.height = 64;
    const g2 = dot.getContext('2d'); const grd = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.55, 'rgba(255,255,255,0.95)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g2.fillStyle = grd; g2.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(dot);

    let ids = [], index = new Map(), base = null, hi = null, colors = null, target = null, sizesHi = null;
    const matBase = new THREE.PointsMaterial({ size: 0.055, map: sprite, vertexColors: true, transparent: true, depthWrite: false, opacity: 0.9 });
    const matHi = new THREE.PointsMaterial({ size: 0.11, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const tmp = new THREE.Color();

    function layout(all) {
      ids = all; index = new Map(ids.map((id, i) => [id, i]));
      const n = ids.length, pos = new Float32Array(n * 3);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {  // Fibonacci sphere, ordered by test id so modules form bands
        const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
        pos[i * 3] = Math.cos(th) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(th) * r;
      }
      [base, hi].forEach(o => { if (o) { group.remove(o); o.geometry.dispose(); } });
      colors = new Float32Array(n * 3); target = new Float32Array(n * 3);
      const gb = new THREE.BufferGeometry();
      gb.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      gb.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      base = new THREE.Points(gb, matBase);
      // highlight layer: failures, fixes and not-run tests drawn larger on top
      const gh = new THREE.BufferGeometry();
      gh.setAttribute('position', new THREE.BufferAttribute(pos.slice(), 3));
      sizesHi = new Float32Array(n * 3);
      gh.setAttribute('color', new THREE.BufferAttribute(sizesHi, 3));
      hi = new THREE.Points(gh, matHi);
      group.add(base, hi);
    }

    function paintTargets(res) {
      const bg = new THREE.Color(css('--panel') || '#161a23');
      for (let i = 0; i < ids.length; i++) { target.set([bg.r, bg.g, bg.b], i * 3); sizesHi.fill(0, i * 3, i * 3 + 3); }
      if (!res) return;
      KEYS.forEach(k => {
        tmp.set(css(COLORS[k]) || '#888');
        const strong = k !== 'unchanged_pass' && k !== 'new_test';
        (res[k] || []).forEach(id => {
          const i = index.get(id); if (i === undefined) return;
          const dim = k === 'not_run' ? 0.7 : k === 'unchanged_pass' ? 0.8 : 1;
          target.set([tmp.r * dim, tmp.g * dim, tmp.b * dim], i * 3);
          if (strong && k !== 'not_run') sizesHi.set([tmp.r, tmp.g, tmp.b], i * 3);
        });
      });
      hi.geometry.attributes.color.needsUpdate = true;
    }

    let t0 = 0, from = null;
    function update(res) {
      const all = res ? [...new Set(KEYS.flatMap(k => res[k] || []))].sort() : ids;
      if (!base || all.length !== ids.length || all.some((id, i) => id !== ids[i])) {
        // keep the union of every run seen so dots never jump position between scenarios
        const merged = [...new Set([...ids, ...all])].sort();
        if (merged.length !== ids.length) layout(merged);
      }
      if (!base) return;
      from = colors.slice(); paintTargets(res); t0 = performance.now();
      if (reduce) { colors.set(target); from = null; base.geometry.attributes.color.needsUpdate = true; }
      spin(); kick();
    }

    // interaction: drag to rotate; slow auto-rotation unless reduced motion
    let dragging = false, lx = 0, ly = 0, vy = 0, idleT = 0;
    const spin = () => { if (reduce) return; vy = 0.0016; clearTimeout(idleT); idleT = setTimeout(() => { vy = 0; }, 6000); kick(); };
    canvas.addEventListener('pointerenter', spin);
    canvas.addEventListener('pointerdown', e => { dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', e => {
      if (!dragging) return;
      group.rotation.y += (e.clientX - lx) * 0.008; group.rotation.x = Math.max(-1.2, Math.min(1.2, group.rotation.x + (e.clientY - ly) * 0.006));
      lx = e.clientX; ly = e.clientY; kick();
    });
    canvas.addEventListener('pointerup', () => { dragging = false; });
    canvas.addEventListener('pointercancel', () => { dragging = false; });

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight || w;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); kick();
    }
    new ResizeObserver(resize).observe(canvas);

    let visible = true, raf = 0;
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(canvas);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
    function frame(now) {
      raf = 0;
      let animating = false;
      if (from) {
        const k = Math.min(1, (now - t0) / 650), e = 1 - Math.pow(1 - k, 3);
        for (let i = 0; i < colors.length; i++) colors[i] = from[i] + (target[i] - from[i]) * e;
        base.geometry.attributes.color.needsUpdate = true;
        if (k < 1) animating = true; else from = null;
      }
      if (!dragging && vy) group.rotation.y += vy;
      renderer.render(scene, camera);
      if ((animating || vy) && visible && !document.hidden) kick();
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (api.last) update(api.last); });
    resize();
    return { update };
  }

  function update(res) {
    pending = res;
    if (!ready) {
      // load Three.js only when the demo is near the viewport
      ready = new Promise(resolve => {
        if (!box) return resolve(null);
        const idle = window.requestIdleCallback || (f => setTimeout(f, 200));
        const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); idle(() => init().then(resolve), { timeout: 1500 }); } });
        io.observe(box);
      });
      ready.then(a => { api = a; if (a) { api.last = pending; a.update(pending); } });
      return;
    }
    if (api) { api.last = res; api.update(res); }
  }
  return { update };
})();

document.addEventListener('onramp:result', e => onResult(e.detail));
if (window.__onramp_result) onResult(window.__onramp_result);  // the first result may arrive before this module runs
