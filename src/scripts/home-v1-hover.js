function initBlurHover() {
  const tiles = document.querySelectorAll('.home .featured-project[data-v1-blur] .media-container');
  if (!tiles.length || matchMedia('(prefers-reduced-motion: reduce)').matches || !window.CanvasRenderingContext2D) return;

  const CANVAS_W = 900, CANVAS_H = 675; // fixed 4:3, matches .work-tile .media
  const CELL = 6.75;
  const MAX_RADIUS = CELL * 0.62;
  const DOT_SPAN = 500; // window dots trigger across, now randomized per-dot
  const DEVELOP_DUR = 2000; // each dot's own growth window, once triggered
  const ENTER_DUR = 1300; // photo blur/fade duration
  const TOTAL_DUR = Math.max(ENTER_DUR, DOT_SPAN + DEVELOP_DUR);
  const LEAVE_DUR = 700;
  const MAX_BLUR = 7; // halved from the 14px in the comparison version

  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    const normalized = value.length === 3 ? [...value].map(char => char + char).join('') : value;
    const m = normalized.match(/.{2}/g);
    return m ? [parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16)] : [0, 0, 0];
  }
  function thresholdToBW(ctx, w, h, bg, ink) {
    const [br, bgc, bb] = hexToRgb(bg);
    const [ir, ig, ib] = hexToRgb(ink);
    const bLum = 0.2126 * br + 0.7152 * bgc + 0.0722 * bb;
    const iLum = 0.2126 * ir + 0.7152 * ig + 0.0722 * ib;
    const mid = (bLum + iLum) / 2;
    const toInk = iLum < bLum;
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      const useInk = toInk ? l < mid : l > mid;
      d[i] = useInk ? ir : br; d[i + 1] = useInk ? ig : bgc; d[i + 2] = useInk ? ib : bb;
    }
    ctx.putImageData(imageData, 0, 0);
  }
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutCubicLocal = (x) => 1 - Math.pow(1 - x, 3);
  function easeSigmoidLocal(t) {
    const k = 10;
    const raw = (x) => 1 / (1 + Math.exp(-k * (x - 0.5)));
    const r0 = raw(0), r1 = raw(1);
    return (raw(t) - r0) / (r1 - r0);
  }

  function coverRect(nw, nh, w, h) {
    const targetRatio = w / h, srcRatio = nw / nh;
    let sx = 0, sy = 0, sw = nw, sh = nh;
    if (srcRatio > targetRatio) { sw = nh * targetRatio; sx = (nw - sw) / 2; }
    else { sh = nw / targetRatio; sy = (nh - sh) / 2; }
    return { sx, sy, sw, sh };
  }

  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    if (!img) return;
    const video = tile.querySelector('video');
    const link = tile.closest('a') || tile;

    const style = getComputedStyle(tile);
    const bg = (style.getPropertyValue('--color-bg') || '#FFFFFF').trim();
    const ink = (style.getPropertyValue('--color-ink') || '#0A0A0A').trim();

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = CANVAS_W; canvas.height = CANVAS_H;
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: video ? '3' : '1', opacity: video ? '0' : '1', pointerEvents: 'none' });
    tile.insertBefore(canvas, img);
    Object.assign(img.style, { position: 'absolute', inset: '0', zIndex: video ? '4' : '2' });
    if (video) video.style.zIndex = '2';
    const ctx = canvas.getContext('2d');

    let dots = [], crop = null, elapsed = 0, raf = null, mode = 'idle', hovering = false;

    function buildLuminanceCover(w, h) {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const cx = c.getContext('2d');
      cx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, w, h);
      const data = cx.getImageData(0, 0, w, h).data;
      const lum = new Float32Array(w * h);
      for (let i = 0, p = 0; i < data.length; i += 4, p++) {
        lum[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      }
      return lum;
    }

    function buildDots(lum) {
      const list = [];
      for (let y = 0; y < CANVAS_H; y += CELL) {
        for (let x = 0; x < CANVAS_W; x += CELL) {
          const sx = Math.min(CANVAS_W - 1, Math.floor(x + CELL / 2));
          const sy = Math.min(CANVAS_H - 1, Math.floor(y + CELL / 2));
          const l = lum[sy * CANVAS_W + sx];
          const darkness = (255 - l) / 255;
          const radius = MAX_RADIUS * darkness;
          if (radius > 0.4) {
            // Random, not gxNorm-based — no left-to-right read, just scatter.
            const triggerMs = Math.random() * DOT_SPAN;
            list.push({ gx: x + CELL / 2, gy: y + CELL / 2, radius, triggerMs });
          }
        }
      }
      return list;
    }

    function dotRadiusAt(d, ms) {
      if (ms <= d.triggerMs) return 0;
      const localT = clamp01((ms - d.triggerMs) / DEVELOP_DUR);
      return d.radius * easeOutCubicLocal(localT);
    }

    function drawDots(radiusFn) {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = ink;
      dots.forEach((d, i) => {
        const r = radiusFn(d, i);
        if (r > 0.4) { ctx.beginPath(); ctx.arc(d.gx, d.gy, r, 0, Math.PI * 2); ctx.fill(); }
      });
      thresholdToBW(ctx, CANVAS_W, CANVAS_H, bg, ink);
    }

    function progressAt(ms) {
      return easeSigmoidLocal(clamp01(ms / ENTER_DUR));
    }

    function applyPhoto(p, blurP) {
      if (blurP === undefined) blurP = p;
      // While hovered, reveal the dot artwork over the approved poster. A
      // playing film underneath the fading canvas caused the red flash.
      const filmIdle = !!video?.hasAttribute('data-playing') && !hovering && mode === 'idle';
      img.style.opacity = filmIdle ? '0' : String(1 - p);
      if (video) { video.style.opacity = filmIdle ? '1' : '0'; canvas.style.opacity = filmIdle ? '0' : '1'; }
      img.style.filter = 'grayscale(1) blur(' + (blurP * MAX_BLUR).toFixed(2) + 'px)';
    }

    function renderForward(ms) {
      drawDots((d) => dotRadiusAt(d, ms));
      applyPhoto(progressAt(ms));
    }

    function setup() {
      if (!img.naturalWidth || !img.naturalHeight) return false;
      crop = coverRect(img.naturalWidth, img.naturalHeight, CANVAS_W, CANVAS_H);
      const lum = buildLuminanceCover(CANVAS_W, CANVAS_H);
      dots = buildDots(lum);
      renderForward(0);
      return true;
    }

    function startEnter() {
      if (!dots.length) return;
      if (raf) cancelAnimationFrame(raf);
      hovering = true; mode = 'enter';
      applyPhoto(progressAt(elapsed));
      const t0 = performance.now() - elapsed;
      function step(now) {
        if (mode !== 'enter') return;
        elapsed = now - t0;
        renderForward(Math.min(elapsed, TOTAL_DUR));
        if (elapsed < TOTAL_DUR) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }

    // Snapshots wherever the blur/fade and every dot currently are, then
    // reverses both together over LEAVE_DUR — matches the curtain/fade
    // hover-off pattern rather than a hard reset. The blur channel uses its
    // own, much steeper falloff (k cubed) than opacity — rolling off used
    // to read as MORE blurred than rolling on because the blur lingered at
    // full strength for most of the reverse; now it clears almost
    // immediately while the photo is still fading back in underneath.
    function startLeave() {
      if (!dots.length) return;
      if (raf) cancelAnimationFrame(raf);
      hovering = false; mode = 'leave';
      const snapMs = Math.min(elapsed, TOTAL_DUR);
      const snapProgress = progressAt(snapMs);
      const snapRadii = dots.map((d) => dotRadiusAt(d, snapMs));
      const t0 = performance.now();
      function step(now) {
        if (mode !== 'leave') return;
        const raw = Math.min(1, (now - t0) / LEAVE_DUR);
        const k = 1 - easeInOutCubic(raw);
        const blurK = k * k * k;
        elapsed = snapMs * k;
        drawDots((d, i) => snapRadii[i] * k);
        applyPhoto(snapProgress * k, snapProgress * blurK);
        if (raw < 1) raf = requestAnimationFrame(step);
        else { elapsed = 0; mode = 'idle'; applyPhoto(0); }
      }
      raf = requestAnimationFrame(step);
    }

    function init() {
      let ok = false;
      try { ok = setup(); } catch (err) { console.warn('Blur hover disabled for this tile:', err); }
      if (!ok) { canvas.remove(); img.style.position=''; img.style.inset=''; img.style.zIndex=''; if(video) video.style.zIndex=''; return; }
      link.addEventListener('mouseenter', startEnter);
      link.addEventListener('mouseleave', startLeave);
      if (tile.matches(':hover')) startEnter();
      if (video) {
        video.addEventListener('play', () => applyPhoto(progressAt(elapsed)));
        video.addEventListener('pause', () => applyPhoto(progressAt(elapsed)));
      }
    }

    if (img.complete && img.naturalWidth) init();
    else img.addEventListener('load', init, { once: true });
  });
}
function initColorBlurHover() {
  const tiles = document.querySelectorAll('.home .featured-project[data-v1-colour] .media-container');
  if (!tiles.length || matchMedia('(prefers-reduced-motion: reduce)').matches || !window.CanvasRenderingContext2D) return;

  const CANVAS_W = 900, CANVAS_H = 675;
  const CELL = 6.75;
  const MAX_RADIUS = CELL * 0.62;
  const DOT_SPAN = 500;
  const DEVELOP_DUR = 2000;
  const ENTER_DUR = 1300;
  const TOTAL_DUR = Math.max(ENTER_DUR, DOT_SPAN + DEVELOP_DUR);
  const LEAVE_DUR = 700;
  const MAX_BLUR = 7;

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutCubicLocal = (x) => 1 - Math.pow(1 - x, 3);
  function easeSigmoidLocal(t) {
    const k = 10;
    const raw = (x) => 1 / (1 + Math.exp(-k * (x - 0.5)));
    const r0 = raw(0), r1 = raw(1);
    return (raw(t) - r0) / (r1 - r0);
  }

  function coverRect(nw, nh, w, h) {
    const targetRatio = w / h, srcRatio = nw / nh;
    let sx = 0, sy = 0, sw = nw, sh = nh;
    if (srcRatio > targetRatio) { sw = nh * targetRatio; sx = (nw - sw) / 2; }
    else { sh = nw / targetRatio; sy = (nh - sh) / 2; }
    return { sx, sy, sw, sh };
  }

  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    if (!img) return;
    const link = tile.closest('a') || tile;

    const style = getComputedStyle(tile);
    const bg = (style.getPropertyValue('--color-bg') || '#FFFFFF').trim();

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = CANVAS_W; canvas.height = CANVAS_H;
    Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '1', pointerEvents: 'none' });
    tile.insertBefore(canvas, img);
    Object.assign(img.style, { position: 'absolute', inset: '0', zIndex: '2' });
    const ctx = canvas.getContext('2d');

    let dots = [], crop = null, elapsed = 0, raf = null, mode = 'idle';

    function buildColorDots() {
      const c = document.createElement('canvas');
      c.width = CANVAS_W; c.height = CANVAS_H;
      const cx = c.getContext('2d');
      cx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, CANVAS_W, CANVAS_H);
      const data = cx.getImageData(0, 0, CANVAS_W, CANVAS_H).data;

      function sampleAvg(sx, sy) {
        let r = 0, g = 0, b = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const px = Math.min(CANVAS_W - 1, Math.max(0, sx + dx));
            const py = Math.min(CANVAS_H - 1, Math.max(0, sy + dy));
            const idx = (py * CANVAS_W + px) * 4;
            r += data[idx]; g += data[idx + 1]; b += data[idx + 2]; n++;
          }
        }
        return [r / n, g / n, b / n];
      }

      const list = [];
      for (let y = 0; y < CANVAS_H; y += CELL) {
        for (let x = 0; x < CANVAS_W; x += CELL) {
          const sx = Math.min(CANVAS_W - 1, Math.floor(x + CELL / 2));
          const sy = Math.min(CANVAS_H - 1, Math.floor(y + CELL / 2));
          const rgb = sampleAvg(sx, sy);
          const lum = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
          const darkness = (255 - lum) / 255;
          const radius = MAX_RADIUS * darkness;
          if (radius > 0.4) {
            const triggerMs = Math.random() * DOT_SPAN;
            const fill = 'rgb(' + Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + Math.round(rgb[2]) + ')';
            list.push({ gx: x + CELL / 2, gy: y + CELL / 2, radius, triggerMs, fill });
          }
        }
      }
      return list;
    }

    function dotRadiusAt(d, ms) {
      if (ms <= d.triggerMs) return 0;
      const localT = clamp01((ms - d.triggerMs) / DEVELOP_DUR);
      return d.radius * easeOutCubicLocal(localT);
    }

    function drawDots(radiusFn) {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      dots.forEach((d, i) => {
        const r = radiusFn(d, i);
        if (r > 0.4) { ctx.fillStyle = d.fill; ctx.beginPath(); ctx.arc(d.gx, d.gy, r, 0, Math.PI * 2); ctx.fill(); }
      });
    }

    function progressAt(ms) {
      return easeSigmoidLocal(clamp01(ms / ENTER_DUR));
    }

    function applyPhoto(p, blurP) {
      if (blurP === undefined) blurP = p;
      img.style.opacity = String(1 - p);
      img.style.filter = 'blur(' + (blurP * MAX_BLUR).toFixed(2) + 'px)';
    }

    function renderForward(ms) {
      drawDots((d) => dotRadiusAt(d, ms));
      applyPhoto(progressAt(ms));
    }

    function setup() {
      if (!img.naturalWidth || !img.naturalHeight) return false;
      crop = coverRect(img.naturalWidth, img.naturalHeight, CANVAS_W, CANVAS_H);
      dots = buildColorDots();
      renderForward(0);
      return true;
    }

    function startEnter() {
      if (!dots.length) return;
      if (raf) cancelAnimationFrame(raf);
      mode = 'enter';
      const t0 = performance.now() - elapsed;
      function step(now) {
        if (mode !== 'enter') return;
        elapsed = now - t0;
        renderForward(Math.min(elapsed, TOTAL_DUR));
        if (elapsed < TOTAL_DUR) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }

    function startLeave() {
      if (!dots.length) return;
      if (raf) cancelAnimationFrame(raf);
      mode = 'leave';
      const snapMs = Math.min(elapsed, TOTAL_DUR);
      const snapProgress = progressAt(snapMs);
      const snapRadii = dots.map((d) => dotRadiusAt(d, snapMs));
      const t0 = performance.now();
      function step(now) {
        if (mode !== 'leave') return;
        const raw = Math.min(1, (now - t0) / LEAVE_DUR);
        const k = 1 - easeInOutCubic(raw);
        const blurK = k * k * k;
        elapsed = snapMs * k;
        drawDots((d, i) => snapRadii[i] * k);
        applyPhoto(snapProgress * k, snapProgress * blurK);
        if (raw < 1) raf = requestAnimationFrame(step);
        else elapsed = 0;
      }
      raf = requestAnimationFrame(step);
    }

    function init() {
      let ok = false;
      try { ok = setup(); } catch (err) { console.warn('Colour blur hover disabled for this tile:', err); }
      if (!ok) { canvas.remove(); img.style.position=''; img.style.inset=''; img.style.zIndex=''; return; }
      link.addEventListener('mouseenter', startEnter);
      link.addEventListener('mouseleave', startLeave);
      if (tile.matches(':hover')) startEnter();
    }

    if (img.complete && img.naturalWidth) init();
    else img.addEventListener('load', init, { once: true });
  });
}
if(matchMedia('(hover:hover) and (pointer:fine)').matches){initBlurHover();initColorBlurHover();}

// Scoped version of V1's image-link cursor label; the system pointer remains visible.
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 const label=document.createElement('div');label.className='home-project-cursor';label.setAttribute('aria-hidden','true');document.body.append(label);
 document.querySelectorAll('.home .featured-project .media-project-link').forEach(link=>{
  const card=link.closest('.featured-project');const name=card?.querySelector('.section-title')?.textContent?.trim();
  if(!name)return;
  link.addEventListener('pointerenter',()=>{label.textContent=name+' / View Work +';label.classList.add('is-visible');});
  link.addEventListener('pointermove',e=>{label.style.left=e.clientX+'px';label.style.top=e.clientY+'px';});
  link.addEventListener('pointerleave',()=>label.classList.remove('is-visible'));
  link.addEventListener('blur',()=>label.classList.remove('is-visible'));
 });
}
