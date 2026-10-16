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

// ---------- Motion Toggle Pause: decorative motion can be paused (Webflow interactions guidance) ----------
const motion = (() => {
  const btn = document.getElementById('motionbtn');
  let still = false;
  try { still = localStorage.getItem('onramp-still') === '1'; } catch (e) { /* storage blocked */ }
  const listeners = [];
  const apply = () => {
    document.documentElement.classList.toggle('still', still);
    if (btn) {
      btn.setAttribute('aria-pressed', String(still));
      btn.lastElementChild.textContent = still ? 'Resume motion' : 'Pause motion';
    }
    listeners.forEach(f => f(still));
  };
  if (btn) { btn.addEventListener('click', () => { still = !still; try { localStorage.setItem('onramp-still', still ? '1' : '0'); } catch (e) { /* ignore */ } apply(); }); }
  apply();
  return { get still() { return still || reduce; }, on: f => listeners.push(f) };
})();

// Supplied cinematic hero video is decorative only: keep it in sync with the
// existing motion contract and leave a truthful black fallback when motion is reduced.
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const syncHeroVideo = paused => {
    if (paused) heroVideo.pause();
    else heroVideo.play().catch(() => { /* autoplay may be blocked; black fallback remains */ });
  };
  // never autoplay from markup: start only when motion is allowed and the hero is on screen; pause off-screen
  let heroVisible = false;
  new IntersectionObserver(es => { heroVisible = es[0].isIntersecting; syncHeroVideo(motion.still || !heroVisible); }).observe(heroVideo.closest('header') || heroVideo);
  motion.on(still => syncHeroVideo(still || !heroVisible));
}

// ---------- sound (off by default; the user turns it on) ----------
const sound = (() => {
  const btn = document.getElementById('sound');
  let on = false, ac = null;
  try { on = localStorage.getItem('onramp-sound') === '1'; } catch (e) { /* storage blocked */ }
  const paint = () => { if (!btn) return; btn.setAttribute('aria-pressed', String(on)); btn.setAttribute('aria-label', 'Classification chime'); const lab = btn.querySelector('span[aria-hidden]'); if (lab) lab.textContent = on ? 'Sound on' : 'Sound off'; };
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
  // Page Scroll Progress Bar (Magic UI scroll-progress pattern): a state indicator, so it also runs under reduced motion
  const sprog = document.querySelector('.sprog');
  if (sprog) ScrollTrigger.create({ start: 0, end: 'max', onUpdate: st => sprog.style.setProperty('--sp', st.progress.toFixed(4)) });
  // In-page anchors scroll smoothly via JS instead of CSS scroll-behavior
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', a.getAttribute('href'));
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  });
  const steps = document.getElementById('steps');
  // Variant B (frontend-design skill): one orchestrated moment only, so no per-section reveals or stat tickers
  const quiet = document.documentElement.dataset.variant === 'b';
  if (!reduce) {
    // section reveals: elements start visible in the HTML; GSAP only animates *from* an offset
    if (!quiet) gsap.utils.toArray('main section .sh, main section .two, main section .strip, main .runs, main .who, main .timeline').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) return;
      gsap.from(el, { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'clamp(top 90%)', once: true } });
    });
    // stats ticker: counts up to the exact number in the HTML, then restores the original text
    if (!quiet) document.querySelectorAll('.stat > b').forEach(b => {
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
      // evidence stays fully visible; scroll only moves the progress node and marks the active step
      const tl = gsap.timeline({ scrollTrigger: { trigger: steps, start: 'clamp(top 85%)', end: 'clamp(bottom 45%)', scrub: 0.5 } });
      tl.to(steps, { '--prog': 1, ease: 'none', duration: items.length }, 0);
      items.forEach((li, i) => {
        tl.call(() => items.forEach((x, j) => x.classList.toggle('active', j <= i)), null, i + 0.1);
      });
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
        if (motion.still) return;
        const r = hero.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach(l => { l.x(nx * l.d); l.y(ny * l.d); if (l.rx) { l.rx(-ny * l.t); l.ry(nx * l.t); } });
      });
      hero.addEventListener('pointerleave', () => layers.forEach(l => { l.x(0); l.y(0); if (l.rx) { l.rx(0); l.ry(0); } }));
    }
  }
}

// ---------- Hero Off-Screen Drift Pause ----------
const liquid = document.querySelector('.liquid');
if (liquid) new IntersectionObserver(es => liquid.classList.toggle('paused', !es[0].isIntersecting)).observe(document.querySelector('.hero'));

// ---------- demo reactions: verdict transition, card tickers, chime ----------
function onResult(detail) {
  if (gsap && reduce && !motion.still && !document.hidden) gsap.fromTo('#verdict, #cards', { opacity: 0.4 }, { opacity: 1, duration: 0.15 });
  // Result Change Confirm: numbers appear final immediately; only a 200 ms opacity confirmation (none when paused)
  if (gsap && !reduce && !motion.still && !document.hidden) gsap.fromTo('#verdict, #cards', { opacity: 0.45 }, { opacity: 1, duration: 0.2, ease: 'power1.out' });
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
    // The map is intentionally decorative; authoritative counts and text remain the accessible interface.
    canvas.style.pointerEvents = 'auto';
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

    let ids = [], index = new Map(), base = null, hi = null, colors = null, target = null, sizesHi = null, kindOf = [];
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
      kindOf = new Array(ids.length).fill(null);
      if (!res) return;
      KEYS.forEach(k => {
        tmp.set(css(COLORS[k]) || '#888');
        const strong = k !== 'unchanged_pass' && k !== 'new_test';
        (res[k] || []).forEach(id => {
          const i = index.get(id); if (i === undefined) return;
          kindOf[i] = k;
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
      if (reduce || motion.still) { colors.set(target); from = null; base.geometry.attributes.color.needsUpdate = true; }
      spin(); kick();
    }

    // interaction: controlled pointer/keyboard rotation; yaw is intentionally unbounded so the
    // point cloud can make a complete 360-degree turn without losing its evidence mapping.
    const TAU = Math.PI * 2, PITCH_MIN = -1.25, PITCH_MAX = 1.25;
    let dragging = false, activePointer = null, lx = 0, ly = 0, dragDistance = 0, suppressClick = false, vy = 0;
    const rotateBy = (yaw, pitch) => {
      group.rotation.y = (group.rotation.y + yaw) % TAU;
      group.rotation.x = Math.max(PITCH_MIN, Math.min(PITCH_MAX, group.rotation.x + pitch));
      kick();
    };
    const resetView = () => { group.rotation.y = 0; group.rotation.x = 0.35; kick(); };
    const spin = () => { kick(); };
    canvas.addEventListener('pointerenter', spin);
    motion.on(still => { if (still) { vy = 0; } });

    // Suite Map Hover Pick (three.js manual: picking with Raycaster): name the test under the pointer
    const ray = new THREE.Raycaster(); ray.params.Points.threshold = 0.045;
    const ndc = new THREE.Vector2();
    const tip = document.createElement('div'); tip.className = 'tip'; tip.hidden = true; box.appendChild(tip);
    const LABEL = { unchanged_pass: 'unchanged (passed before and now)', inherited: 'inherited failure', regression: 'regression', new_failure: 'new failing test',
      fixed: 'fixed (ran and passed)', new_test: 'new passing test', not_run: 'not run in this run', skipped: 'skipped' };
    function pick(e) {
      if (!base || dragging) { tip.hidden = true; return; }
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObject(base).filter(h => { const p = h.point.clone(); group.worldToLocal(p); return true; })
        .sort((a, b) => a.distanceToRay - b.distanceToRay || a.distance - b.distance)[0];
      if (!hit) { tip.hidden = true; return; }
      const id = ids[hit.index], kind = kindOf[hit.index] || 'not in this run';
      const status = box.querySelector('.suite-status');
      if (status) status.textContent = id + ': ' + (LABEL[kind] || kind);
      tip.innerHTML = '';
      const b = document.createElement('b'); b.textContent = LABEL[kind] || kind; tip.appendChild(b);
      tip.appendChild(document.createTextNode(id));
      tip.hidden = false;
      const bx = box.getBoundingClientRect();
      tip.style.left = Math.max(4, Math.min(e.clientX - bx.left + 12, bx.width - tip.offsetWidth - 4)) + 'px'; tip.style.top = (e.clientY - bx.top + 12) + 'px';
    }
    canvas.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') pick(e); });
    canvas.addEventListener('pointerleave', () => { tip.hidden = true; });
    canvas.addEventListener('click', e => {
      if (suppressClick) { suppressClick = false; return; }
      pick(e);
    });
    canvas.addEventListener('pointerdown', e => {
      if (activePointer !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
      activePointer = e.pointerId; dragging = true; dragDistance = 0; lx = e.clientX; ly = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', e => {
      if (!dragging || e.pointerId !== activePointer) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      dragDistance += Math.abs(dx) + Math.abs(dy);
      if (dragDistance > 6) suppressClick = true;
      rotateBy(dx * 0.008, dy * 0.006);
      lx = e.clientX; ly = e.clientY; kick();
    });
    const endDrag = e => {
      if (activePointer !== null && e.pointerId !== activePointer) return;
      dragging = false; activePointer = null; dragDistance = 0;
    };
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);
    canvas.addEventListener('lostpointercapture', endDrag);
    canvas.addEventListener('keydown', e => {
      if (e.target !== canvas) return;
      const step = Math.PI / 18;
      if (e.key === 'ArrowLeft') { e.preventDefault(); rotateBy(-step, 0); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); rotateBy(step, 0); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); rotateBy(0, -step); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); rotateBy(0, step); }
      else if (e.key.toLowerCase() === 'r') { e.preventDefault(); resetView(); }
    });
    box.querySelectorAll('[data-suite-rotate]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-suite-rotate');
        if (action === 'left') rotateBy(-Math.PI / 18, 0);
        else if (action === 'right') rotateBy(Math.PI / 18, 0);
        else if (action === 'up') rotateBy(0, -Math.PI / 18);
        else if (action === 'down') rotateBy(0, Math.PI / 18);
        else if (action === 'reset') resetView();
      });
    });

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
