// ---- Reference "design" measurements. These describe the depression
// background at one reference size, and the size + position of every
// overlay image relative to it (position = offset from depression's own
// top-left corner). At runtime a single scale factor is computed from the
// current window size and applied uniformly to all of these numbers, so
// every ratio -- both size and position -- stays identical no matter what
// screen this runs on. Nothing below is a hardcoded screen pixel. ----
const REF = {
  depression: { w: 702, h: 550 },
  acceptance: { w: 194, h: 194, x: 270, y: 149 },
  anger: { w: 206, h: 189, x: 464.5, y: 151.9 },
  denial: { w: 190, h: 190, x: 270, y: 335 },
  bargain: { w: 198, h: 198, x: 460, y: 335 }
};

// Fraction of the window reserved as empty margin on each side, so the
// whole composition always has visible black space on all four edges --
// even when the window's aspect ratio happens to match the art's.
const MARGIN_RATIO = 0.05;

// ---- Image arrays, filled in preload() ----
let depressionImgs = [];
let acceptanceImgs = [];
let angerImgs = [];
let denialImgs = [];
let bargainImgs = [];

// ---- Rotation patterns (1-based image numbers, exactly as specified) ----
const patterns = {
  depression: [1, 2, 3, 4, 5],
  acceptance: [1, 2, 3, 4, 5],
  anger: [1, 2, 3, 4, 3, 2],
  denial: [1, 2, 3, 1, 4, 5, 6, 4],
  bargain: [1, 2, 1, 3]
};

function preload() {
  for (let i = 1; i <= 5; i++) depressionImgs.push(loadImage(`assets/depression${i}.png`));
  for (let i = 1; i <= 5; i++) acceptanceImgs.push(loadImage(`assets/acceptance${i}.png`));
  for (let i = 1; i <= 4; i++) angerImgs.push(loadImage(`assets/anger${i}.png`));
  for (let i = 1; i <= 6; i++) denialImgs.push(loadImage(`assets/denial${i}.png`));
  for (let i = 1; i <= 3; i++) bargainImgs.push(loadImage(`assets/bargain${i}.png`));
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
}

// Keep the canvas filling the window as it's resized; draw() recomputes
// the fit/scale every frame, so this is all that's needed.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Every layer shares the same real-world clock, so all switches land on
// the same 1-second beat even though each pattern has a different length.
function currentIndex(pattern) {
  const elapsedSeconds = Math.floor(millis() / 1000);
  return pattern[elapsedSeconds % pattern.length] - 1; // -> 0-based array index
}

function draw() {
  background(0);

  // Fit the reference composition (sized REF.depression.w x .h) into the
  // window minus margin, preserving its aspect ratio (no stretching), then
  // center the result -- equal black space on left/right and top/bottom.
  const availW = width * (1 - 2 * MARGIN_RATIO);
  const availH = height * (1 - 2 * MARGIN_RATIO);
  const scale = Math.min(availW / REF.depression.w, availH / REF.depression.h);

  const depW = REF.depression.w * scale;
  const depH = REF.depression.h * scale;
  const offsetX = (width - depW) / 2;
  const offsetY = (height - depH) / 2;

  // Places `img` so its top-left corner sits (ref.x, ref.y) reference units
  // from the depression image's top-left corner, sized ref.w x ref.h
  // reference units -- converted to real screen pixels via `scale` and
  // shifted by the centering offset above.
  const place = (img, ref) => {
    image(
      img,
      offsetX + (ref.x || 0) * scale,
      offsetY + (ref.y || 0) * scale,
      ref.w * scale,
      ref.h * scale
    );
  };

  place(depressionImgs[currentIndex(patterns.depression)], REF.depression);
  place(acceptanceImgs[currentIndex(patterns.acceptance)], REF.acceptance);
  place(angerImgs[currentIndex(patterns.anger)], REF.anger);
  place(denialImgs[currentIndex(patterns.denial)], REF.denial);
  place(bargainImgs[currentIndex(patterns.bargain)], REF.bargain);
}