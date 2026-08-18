// ---- Canvas size (matches the depression background art, full res) ----
const CANVAS_W = 2925;
const CANVAS_H = 2290;

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

// ---- Fixed top-left placement for each layer (depression is full-bleed at 0,0) ----
const positions = {
  acceptance: { x: 365.0465, y: 242.8809 },
  anger: { x: 565.301, y: 242.8809 },
  denial: { x: 365.0465, y: 432.1069 },
  bargain: { x: 565.301, y: 433.3637 }
};

function preload() {
  for (let i = 1; i <= 5; i++) depressionImgs.push(loadImage(`assets/depression${i}.png`));
  for (let i = 1; i <= 5; i++) acceptanceImgs.push(loadImage(`assets/acceptance${i}.png`));
  for (let i = 1; i <= 4; i++) angerImgs.push(loadImage(`assets/anger${i}.png`));
  for (let i = 1; i <= 6; i++) denialImgs.push(loadImage(`assets/denial${i}.png`));
  for (let i = 1; i <= 3; i++) bargainImgs.push(loadImage(`assets/bargain${i}.png`));
}

function setup() {
  const canvas = createCanvas(CANVAS_W, CANVAS_H);
  canvas.parent('sketch-holder');
  // Draw buffer stays at full native resolution; CSS in index.html scales
  // it down to fit the viewport without changing any coordinates below.
}

// Every layer shares the same real-world clock, so all switches land on
// the same 1-second beat even though each pattern has a different length.
function currentIndex(pattern) {
  const elapsedSeconds = Math.floor(millis() / 1000);
  return pattern[elapsedSeconds % pattern.length] - 1; // -> 0-based array index
}

function draw() {
  background(0);

  image(depressionImgs[currentIndex(patterns.depression)], 0, 0);
  image(acceptanceImgs[currentIndex(patterns.acceptance)], positions.acceptance.x, positions.acceptance.y);
  image(angerImgs[currentIndex(patterns.anger)], positions.anger.x, positions.anger.y);
  image(denialImgs[currentIndex(patterns.denial)], positions.denial.x, positions.denial.y);
  image(bargainImgs[currentIndex(patterns.bargain)], positions.bargain.x, positions.bargain.y);
}
