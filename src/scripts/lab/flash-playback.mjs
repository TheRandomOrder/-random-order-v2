const intervals = new Set([450, 700, 1000]);

/**
 * The motion lab deliberately supports a small set of reviewable timings.
 * @param {number} count
 * @param {number} interval
 */
export function flashPlaybackPlan(count, interval) {
  const total = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));
  const delay = intervals.has(interval) ? interval : 700;
  const frames = Math.min(total, Math.floor(30_000 / delay));
  return { total, interval: delay, frames, duration: frames * delay };
}

/**
 * A user-started, one-pass sequence. Removing a visibility or motion blocker
 * never starts playback. The renderer owns media and announcements.
 * @param {{count:number, interval?:number, schedule?:(callback:()=>void, delay:number)=>unknown, cancel?:(id:unknown)=>void, onChange?:(state:{index:number, playing:boolean, interval:number, total:number, frames:number, duration:number}, message:string)=>void}} options
 */
export function createFlashPlayback(options) {
  let plan = flashPlaybackPlan(options.count, options.interval ?? 700);
  let index = 0;
  let playing = false;
  let timer;
  let destroyed = false;
  const blockers = new Map();
  const schedule = options.schedule ?? ((callback, delay) => setTimeout(callback, delay));
  const cancel = options.cancel ?? ((id) => clearTimeout(/** @type {ReturnType<typeof setTimeout>} */ (id)));
  const state = () => ({ index, playing, ...plan });
  const emit = (message = '') => options.onChange?.(state(), message);
  const clear = () => {
    if (timer !== undefined) cancel(timer);
    timer = undefined;
  };
  const stop = (message = 'Stopped. Step through or play once to restart.') => {
    clear();
    playing = false;
    emit(message);
  };
  const advance = () => {
    timer = undefined;
    if (!playing || destroyed) return;
    if (index + 1 >= plan.frames) {
      playing = false;
      emit(plan.frames < plan.total ? 'Review complete at the 30-second limit.' : 'Review complete.');
      return;
    }
    index += 1;
    emit();
    timer = schedule(advance, plan.interval);
  };
  return {
    state,
    play() {
      if (destroyed || !plan.frames) return false;
      if (blockers.size) {
        emit([...blockers.values()][0]);
        return false;
      }
      clear();
      index = 0;
      playing = true;
      emit(`Playing once at ${plan.interval} milliseconds per image.`);
      timer = schedule(advance, plan.interval);
      return true;
    },
    stop,
    reset() {
      clear();
      playing = false;
      index = 0;
      emit('Reset. Ready to review.');
    },
    /** @param {number} direction */
    step(direction) {
      clear();
      playing = false;
      index = plan.total ? (index + Math.sign(direction) + plan.total) % plan.total : 0;
      emit('Manual review.');
    },
    /** @param {number} interval */
    setInterval(interval) {
      clear();
      playing = false;
      plan = flashPlaybackPlan(plan.total, interval);
      emit(`Timing set to ${plan.interval} milliseconds. Play once to restart.`);
    },
    /** @param {string} key @param {boolean} blocked @param {string} message */
    setBlocker(key, blocked, message) {
      if (blocked) {
        blockers.set(key, message);
        if (playing) stop(message);
      } else {
        blockers.delete(key);
      }
    },
    destroy() {
      clear();
      playing = false;
      destroyed = true;
    },
  };
}
