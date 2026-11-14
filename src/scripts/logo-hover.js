import { gsap } from 'gsap';
function initLogoLockSpin() {
  const logos = document.querySelectorAll('a.logo');
  if (!logos.length) return;

  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function randomLetter(exclude) {
    let ch;
    let guard = 0;
    do {
      ch = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      guard += 1;
    } while (ch === exclude && guard < 10);
    return ch;
  }

  logos.forEach((logo) => {
    const sourceText = logo.textContent.trim().toUpperCase();
    const slotCount = sourceText.length;
    if (!slotCount) return;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // stays as static text, no spin at all

    const src = sourceText.split('');
    logo.textContent = '';
    logo.classList.add('logo-lock');

    const wheels = src.map((ch, i) => {
      const overshoot = i % 2 === 0;
      const slot = document.createElement('span');
      slot.className = 'logo-slot';
      const track = document.createElement('span');
      track.className = 'logo-track';
      slot.appendChild(track);
      logo.appendChild(slot);

      function addFrame(text) {
        const frame = document.createElement('span');
        frame.className = 'logo-frame';
        frame.textContent = text === ' ' ? ' ' : text;
        track.appendChild(frame);
        return frame;
      }
      addFrame(ch);
      addFrame(ch === ' ' ? randomLetter() : randomLetter(ch));

      return { slot, track, overshoot, addFrame, spinning: false, tl: null };
    });

    let frameHeight = 0;

    function trimToOne(track) {
      while (track.children.length > 2) track.removeChild(track.firstChild);
    }

    function spinStep(w, i) {
      if (!w.spinning) return;
      const duration = 0.18 + (i % 4) * 0.03; // brisk, slightly varied per wheel
      const next = randomLetter(w.track.lastChild.textContent);
      w.addFrame(next);
      const targetY = -(w.track.children.length - 1) * frameHeight;
      w.tl = gsap.to(w.track, {
        y: targetY,
        duration,
        ease: 'power1.inOut',
        onComplete: () => {
          trimToOne(w.track);
          gsap.set(w.track, { y: -frameHeight });
          spinStep(w, i);
        },
      });
    }

    // speed: 1 = normal (hover-off pace), 2 = twice as fast (used when a
    // click interrupts a spin, so the wheels still resolve to the real
    // name instead of leaving the page mid-spin). Returns the total time
    // (seconds) the settle takes, so a caller can wait for it.
    function settle(w, i, toChar, speed = 1) {
      w.spinning = false;
      if (w.tl) w.tl.kill();
      while (w.track.children.length > 1) w.track.removeChild(w.track.lastChild);
      gsap.set(w.track, { y: 0 });
      w.addFrame(toChar);
      const finalY = -frameHeight;
      const duration = (0.5 + (i % 4) * 0.08) / speed; // same pacing the classic hover-in used
      if (w.overshoot) {
        const overshootY = finalY - frameHeight * 0.16;
        const correctionDuration = 0.09 / speed;
        gsap.timeline()
          .to(w.track, { y: overshootY, duration, ease: 'power2.out' })
          .to(w.track, { y: finalY, duration: correctionDuration, ease: 'power1.out' });
        return duration + correctionDuration;
      }
      gsap.to(w.track, { y: finalY, duration, ease: 'power3.out' });
      return duration;
    }

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
      let maxWidth = 0;
      wheels.forEach(({ track }) => {
        Array.from(track.children).forEach((frame) => {
          maxWidth = Math.max(maxWidth, frame.getBoundingClientRect().width);
        });
      });
      // Slots are sized to the widest letter that could ever appear in
      // them, which leaves narrower letters looking over-spaced. Pulling
      // each slot 30% closer to the next (via negative margin, not a
      // narrower slot) tightens that gap without risking clipping wide
      // glyphs when they spin through.
      const TIGHTEN = 0.22; // matches the tighter tracking in the reference screenshot
      // The O→M gap (inside "RANDOM") reads too tight at the uniform value —
      // even character slots aren't noticeable once the wheels are spinning,
      // so this one pair is left unpulled while the rest stay tightened.
      let shiftGroupLeft = false; // set once we reach the first "O" (in "RANDOM"); stays on for every slot after
      wheels.forEach(({ slot }, i) => {
        slot.style.width = Math.ceil(maxWidth) + 'px';
        if (i < wheels.length - 1) {
          const isOM = src[i] === 'O' && src[i + 1] === 'M';
          const tighten = isOM ? 0 : TIGHTEN;
          slot.style.marginRight = -(maxWidth * tighten) + 'px';
        }
        // Nudges the first "O" (in "RANDOM") 3px right of where the slot grid alone puts it.
        if (src[i] === 'O' && src[i + 1] === 'M') slot.style.marginLeft = '3px';
        // A further 1px nudge right, via relative positioning rather than
        // margin — offsets only this slot's own box, so it can't drag the
        // slots after it along with it the way a margin change would.
        if (src[i] === 'O' && src[i + 1] === 'M') {
          slot.style.position = 'relative';
          slot.style.left = '1px';
        }
        if (src[i] === 'O' && src[i + 1] === 'M') shiftGroupLeft = true;
        // Group nudge: everything from the first "O" onward (inclusive)
        // moves 3.5px left as a block, relative to whatever offset it
        // already has — again via position:relative so it can't drag
        // earlier, untouched letters (R, A, N, D) along with it.
        if (shiftGroupLeft) {
          const current = parseFloat(slot.style.left) || 0;
          slot.style.position = 'relative';
          slot.style.left = (current - 3.5) + 'px';
        }
      });
      frameHeight = wheels[0].slot.getBoundingClientRect().height;
      wheels.forEach((w) => gsap.set(w.track, { y: 0 }));

      logo.addEventListener('mouseenter', () => {
        wheels.forEach((w, i) => {
          if (w.tl) w.tl.kill();
          w.spinning = true;
          spinStep(w, i);
        });
      });
      logo.addEventListener('mouseleave', () => {
        wheels.forEach((w, i) => settle(w, i, src[i]));
      });
      logo.addEventListener('click', (e) => {
        const wasSpinning = wheels.some((w) => w.spinning);
        if (!wasSpinning) return; // already resting on the real name — navigate as normal
        e.preventDefault();
        const href = logo.href;
        let maxDuration = 0;
        wheels.forEach((w, i) => {
          maxDuration = Math.max(maxDuration, settle(w, i, src[i], 2));
        });
        setTimeout(() => { window.location.href = href; }, maxDuration * 1000 * 0.95);
      });
    });
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLogoLockSpin, {once:true});
else initLogoLockSpin();
