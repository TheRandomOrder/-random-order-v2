import { createFlashPlayback } from './flash-playback.mjs';

type Cleanup = () => void;
type FlashFrame = { src: string; alt: string; title: string };
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const initialized = new WeakSet<Element>();
const cleanups: Cleanup[] = [];
const suspenders: Cleanup[] = [];
const inlineVideos = new Set<HTMLVideoElement>();

function pauseVideos(except?: HTMLVideoElement) {
  for (const video of inlineVideos) if (video !== except) video.pause();
}

function initVideos() {
  for (const container of document.querySelectorAll<HTMLElement>('[data-lab-media]')) {
    if (initialized.has(container)) continue;
    const video = container.querySelector<HTMLVideoElement>('[data-lab-video]');
    const button = container.querySelector<HTMLButtonElement>('[data-lab-video-toggle]');
    if (!video || !button) continue;
    initialized.add(container);
    inlineVideos.add(video);
    video.autoplay = false;
    video.removeAttribute('autoplay');
    let visible = true;
    const label = video.dataset.label || button.dataset.label || 'project film';
    const update = () => {
      const playing = !video.paused;
      button.textContent = playing ? 'Pause film' : 'Play film';
      button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${label}`);
      button.setAttribute('aria-pressed', String(playing));
      container.classList.toggle('is-playing', playing);
      video.toggleAttribute('data-playing', playing || video.currentTime > 0);
    };
    button.hidden = false;
    button.addEventListener('click', async () => {
      if (!video.paused) {
        video.pause();
        return;
      }
      if (!video.getAttribute('src') && video.dataset.src) video.src = video.dataset.src;
      pauseVideos(video);
      try { await video.play(); } catch { update(); }
    });
    video.addEventListener('play', () => {
      if (!visible || document.hidden) video.pause();
      else pauseVideos(video);
      update();
    });
    video.addEventListener('pause', update);
    video.addEventListener('ended', update);
    video.addEventListener('loadeddata', update);
    video.addEventListener('error', () => {
      video.pause();
      video.removeAttribute('data-playing');
      button.disabled = true;
      button.textContent = 'Film unavailable';
      button.setAttribute('aria-label', `${label} unavailable`);
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) video.pause();
    }, { threshold: 0.1 });
    observer.observe(container);
    cleanups.push(() => { observer.disconnect(); video.pause(); inlineVideos.delete(video); });
    update();
  }
}

function initGallery(root: HTMLElement) {
  if (initialized.has(root)) return;
  initialized.add(root);
  const items = [...root.querySelectorAll<HTMLElement>('[data-gallery-item]')];
  const filters = [...root.querySelectorAll<HTMLButtonElement>('[data-archive-filter]')];
  const filterStatus = root.querySelector<HTMLElement>('[data-archive-status]');
  const triggers = [...root.querySelectorAll<HTMLButtonElement>('[data-lightbox-item]')];
  const visibleTriggers = () => triggers.filter(item => !item.closest('[hidden]'));
  for (const filter of filters) {
    filter.hidden = false;
    filter.addEventListener('click', () => {
      const selection = filter.dataset.archiveFilter || 'all';
      for (const item of items) {
        item.hidden = selection !== 'all' && item.dataset.collection !== selection;
        if (item.hidden) item.querySelectorAll('video').forEach(video => video.pause());
      }
      for (const control of filters) control.setAttribute('aria-pressed', String(control === filter));
      const count = items.filter(item => !item.hidden).length;
      if (filterStatus) filterStatus.textContent = `${count} ${count === 1 ? 'asset' : 'assets'} shown.`;
    });
  }

  const dialog = root.querySelector<HTMLDialogElement>('[data-lightbox]');
  const media = dialog?.querySelector<HTMLElement>('[data-lightbox-media]');
  const close = dialog?.querySelector<HTMLButtonElement>('[data-lightbox-close]');
  const previous = dialog?.querySelector<HTMLButtonElement>('[data-lightbox-prev]');
  const next = dialog?.querySelector<HTMLButtonElement>('[data-lightbox-next]');
  const heading = dialog?.querySelector<HTMLElement>('[data-lightbox-title]');
  const caption = dialog?.querySelector<HTMLElement>('[data-lightbox-caption]');
  const count = dialog?.querySelector<HTMLElement>('[data-lightbox-count]');
  if (dialog && media && close && previous && next && typeof dialog.showModal === 'function') {
    let opener: HTMLButtonElement | undefined;
    let current: HTMLButtonElement | undefined;
    const render = (trigger: HTMLButtonElement) => {
      current = trigger;
      for (const video of media.querySelectorAll('video')) video.pause();
      media.replaceChildren();
      const kind = trigger.dataset.kind || 'image';
      const src = trigger.dataset.src;
      if (!src) return;
      if (kind === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.playsInline = true;
        video.preload = 'none';
        video.setAttribute('aria-label', trigger.dataset.alt || trigger.dataset.title || 'Project film');
        if (trigger.dataset.poster) video.poster = trigger.dataset.poster;
        video.addEventListener('play', () => pauseVideos());
        media.append(video);
      } else {
        const image = document.createElement('img');
        image.src = src;
        image.alt = trigger.dataset.alt || '';
        image.decoding = 'async';
        const width = Number(trigger.dataset.width);
        const height = Number(trigger.dataset.height);
        if (width > 0) image.width = width;
        if (height > 0) image.height = height;
        media.append(image);
      }
      if (heading) heading.textContent = trigger.dataset.title || 'Gallery detail';
      if (caption) caption.textContent = trigger.dataset.caption || trigger.dataset.alt || '';
      const available = visibleTriggers();
      if (count) count.textContent = `${available.indexOf(trigger) + 1} / ${available.length}`;
      previous.disabled = available.length < 2;
      next.disabled = available.length < 2;
    };
    const navigate = (direction: number) => {
      const available = visibleTriggers();
      if (!available.length) return;
      const index = Math.max(0, current ? available.indexOf(current) : 0);
      render(available[(index + direction + available.length) % available.length]);
    };
    for (const trigger of triggers) {
      if (!trigger.dataset.src) continue;
      trigger.hidden = false;
      trigger.addEventListener('click', () => {
        for (const openDialog of document.querySelectorAll<HTMLDialogElement>('[data-lightbox][open]')) openDialog.close();
        pauseVideos();
        opener = trigger;
        render(trigger);
        dialog.showModal();
        close.focus({ preventScroll: true });
      });
    }
    close.addEventListener('click', () => dialog.close());
    previous.addEventListener('click', () => navigate(-1));
    next.addEventListener('click', () => navigate(1));
    dialog.addEventListener('keydown', event => {
      const target = event.target;
      if (target instanceof Element && target.closest('video, audio, input, select, textarea')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        navigate(event.key === 'ArrowLeft' ? -1 : 1);
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      for (const video of media.querySelectorAll('video')) video.pause();
      media.replaceChildren();
      if (!document.querySelector('dialog[open]') && opener?.isConnected) opener.focus({ preventScroll: true });
    });
    const closeDialog = () => { if (dialog.open) dialog.close(); };
    suspenders.push(closeDialog);
    cleanups.push(closeDialog);
  }

  const panels = [...root.querySelectorAll<HTMLElement>('[data-cinematic-panel]')];
  if (panels.length) {
    panels[0].classList.add('is-current');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('is-current', entry.isIntersecting && entry.intersectionRatio >= 0.25);
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    for (const panel of panels) observer.observe(panel);
    cleanups.push(() => observer.disconnect());
  }
  root.classList.add('is-enhanced');
}

function readFrames(root: HTMLElement): FlashFrame[] {
  try {
    const input: unknown = JSON.parse(root.querySelector('[data-flash-frames]')?.textContent || '[]');
    if (!Array.isArray(input)) return [];
    return input.filter((frame): frame is FlashFrame => !!frame && typeof frame.src === 'string' && !!frame.src && typeof frame.alt === 'string' && typeof frame.title === 'string');
  } catch { return []; }
}

function initFlash(root: HTMLElement) {
  if (initialized.has(root)) return;
  const frames = readFrames(root);
  const image = root.querySelector<HTMLImageElement>('[data-flash-image]');
  const title = root.querySelector<HTMLElement>('[data-flash-title]');
  const count = root.querySelector<HTMLElement>('[data-flash-count]');
  const status = root.querySelector<HTMLElement>('[data-flash-status]');
  const speed = root.querySelector<HTMLSelectElement>('[data-flash-speed]');
  const play = root.querySelector<HTMLButtonElement>('[data-flash-play]');
  const stop = root.querySelector<HTMLButtonElement>('[data-flash-stop]');
  const reset = root.querySelector<HTMLButtonElement>('[data-flash-reset]');
  const previous = root.querySelector<HTMLButtonElement>('[data-flash-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-flash-next]');
  if (!frames.length || !image || !speed || !play || !stop || !reset || !previous || !next) return;
  initialized.add(root);
  const controller = createFlashPlayback({
    count: frames.length,
    interval: Number(speed.value),
    onChange(state, message) {
      const frame = frames[state.index];
      if (image.getAttribute('src') !== frame.src) image.src = frame.src;
      image.alt = frame.alt;
      if (title) title.textContent = frame.title;
      if (count) count.textContent = `${String(state.index + 1).padStart(2, '0')} / ${String(frames.length).padStart(2, '0')}`;
      root.classList.toggle('is-playing', state.playing);
      root.dataset.playback = state.playing ? 'playing' : 'stopped';
      stop.disabled = !state.playing;
      play.disabled = motionPreference.matches || state.playing;
      if (status && message) status.textContent = message === 'Manual review.'
        ? `${frame.title}. Image ${state.index + 1} of ${frames.length}.`
        : message;
    },
  });
  for (const button of [play, stop, reset, previous, next]) button.hidden = false;
  speed.hidden = false;
  let preparation = 0;
  let preparing = false;
  let prepared = false;
  const syncButtons = () => {
    play.disabled = motionPreference.matches || controller.state().playing || preparing;
    stop.disabled = !controller.state().playing && !preparing;
  };
  const cancelPreparation = () => {
    if (preparing && status) status.textContent = 'Preparation stopped. Play once to restart.';
    preparation += 1;
    preparing = false;
    syncButtons();
  };
  const prepareImages = () => Promise.all([...new Set(frames.map(frame => frame.src))].map(src => new Promise<boolean>(resolve => {
    const preload = new Image();
    const timeout = window.setTimeout(() => resolve(false), 10_000);
    const finish = (ok: boolean) => { window.clearTimeout(timeout); resolve(ok); };
    preload.onload = async () => {
      try { await preload.decode(); } catch { /* The loaded image can still be used if decoding is unavailable. */ }
      finish(true);
    };
    preload.onerror = () => finish(false);
    preload.src = src;
  })));
  const preferenceChanged = () => {
    if (motionPreference.matches) cancelPreparation();
    controller.setBlocker('motion', motionPreference.matches, 'Timed playback is off because reduced motion is enabled. Use the step controls.');
    play.disabled = motionPreference.matches || controller.state().playing;
    if (motionPreference.matches && status) status.textContent = 'Timed playback is off because reduced motion is enabled. Use the step controls.';
  };
  const visibilityChanged = () => {
    if (document.hidden) cancelPreparation();
    controller.setBlocker('document', document.hidden, 'Stopped while this tab was in the background. Play once to restart.');
  };
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) cancelPreparation();
    controller.setBlocker('viewport', !entry.isIntersecting, 'Stopped outside the viewport. Play once to restart.');
  }, { threshold: 0.1 });
  play.addEventListener('click', async () => {
    if (motionPreference.matches) return;
    const request = ++preparation;
    if (!prepared) {
      preparing = true;
      syncButtons();
      if (status) status.textContent = 'Preparing the selected images…';
      const loaded = await prepareImages();
      if (request !== preparation) return;
      preparing = false;
      prepared = loaded.every(Boolean);
      if (!prepared) {
        controller.stop('Some images could not load. Try again or use the step controls.');
        syncButtons();
        return;
      }
    }
    controller.play();
    syncButtons();
  });
  stop.addEventListener('click', () => { cancelPreparation(); controller.stop(); });
  reset.addEventListener('click', () => { cancelPreparation(); controller.reset(); });
  previous.addEventListener('click', () => { cancelPreparation(); controller.step(-1); });
  next.addEventListener('click', () => { cancelPreparation(); controller.step(1); });
  speed.addEventListener('change', () => { cancelPreparation(); controller.setInterval(Number(speed.value)); });
  document.addEventListener('visibilitychange', visibilityChanged);
  motionPreference.addEventListener('change', preferenceChanged);
  controller.reset();
  preferenceChanged();
  visibilityChanged();
  observer.observe(root.querySelector('[data-flash-viewport]') ?? root);
  root.classList.add('is-enhanced');
  suspenders.push(() => {
    cancelPreparation();
    if (controller.state().playing) controller.stop('Stopped after leaving the page. Play once to restart.');
  });
  cleanups.push(() => {
    cancelPreparation();
    controller.destroy();
    observer.disconnect();
    document.removeEventListener('visibilitychange', visibilityChanged);
    motionPreference.removeEventListener('change', preferenceChanged);
  });
}

function initTypography(root: HTMLElement) {
  if (initialized.has(root)) return;
  const play = root.querySelector<HTMLButtonElement>('[data-type-play]');
  if (!play) return;
  initialized.add(root);
  let timer: number | undefined;
  let frame: number | undefined;
  const cancel = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    root.classList.remove('is-playing');
    play.setAttribute('aria-pressed', 'false');
  };
  const preferenceChanged = () => {
    if (motionPreference.matches) cancel();
    play.disabled = motionPreference.matches;
    play.title = motionPreference.matches ? 'Reduced motion is enabled; the complete text remains visible.' : '';
  };
  play.hidden = false;
  play.addEventListener('click', () => {
    cancel();
    if (motionPreference.matches) return;
    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        root.classList.add('is-playing');
        play.setAttribute('aria-pressed', 'true');
        timer = window.setTimeout(cancel, 1900);
      });
    });
  });
  motionPreference.addEventListener('change', preferenceChanged);
  preferenceChanged();
  root.classList.add('is-enhanced');
  suspenders.push(cancel);
  cleanups.push(() => { cancel(); motionPreference.removeEventListener('change', preferenceChanged); });
}

function init() {
  initVideos();
  document.querySelectorAll<HTMLElement>('[data-lab-gallery]').forEach(initGallery);
  document.querySelectorAll<HTMLElement>('[data-flash]').forEach(initFlash);
  document.querySelectorAll<HTMLElement>('[data-type-treatment]').forEach(initTypography);
}

const pauseAllMedia = () => {
  pauseVideos();
  for (const video of document.querySelectorAll<HTMLVideoElement>('[data-lightbox] video')) video.pause();
};
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAllMedia(); });
motionPreference.addEventListener('change', pauseAllMedia);
window.addEventListener('pagehide', event => {
  pauseAllMedia();
  suspenders.forEach(suspend => suspend());
  // A back/forward-cache restore keeps working controls and never resumes motion.
  if (!event.persisted) cleanups.splice(0).forEach(cleanup => cleanup());
});
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
