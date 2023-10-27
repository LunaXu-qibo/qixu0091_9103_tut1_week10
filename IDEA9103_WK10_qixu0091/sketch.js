
let song;
let fft;
let particles = [];
let isPlaying = false;
let playButton;
let sizeSlider;
let colorSlider;

function preload() {
  // load the music file
  song = loadSound('audio/sample-visualisation.mp3');
}

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  fft = new p5.FFT();

  // play button
  playButton = createButton('Play');
  playButton.position(20, height - 40);
  playButton.mousePressed(togglePlay);

  // particle size slider
  sizeSlider = createSlider(1, 10, 5, 0.1);
  sizeSlider.position(20, height - 70);
  let sizeLabel = createP('Particle Size');
  sizeLabel.position(20, height - 110); 
  sizeLabel.style('color', '#fff'); 

  // color slider
  colorSlider = createSlider(0, 360, 180, 1);
  colorSlider.position(20, height - 110); 
  let colorLabel = createP('Particle Color');
  colorLabel.position(20, height - 150); 
  colorLabel.style('color', '#fff'); 
}

function draw() {
  background(0);

  // audio spectrum
  let spectrum = fft.analyze();
  noFill();

  // use the user-selected color
  let selectedColor = color(colorSlider.value(), 100, 100);
  stroke(selectedColor);


  translate(width / 2, height / 2);

  // particles based on audio spectrum data
  for (let i = 0; i < spectrum.length; i += 10) { 
    let angle = map(i, 0, spectrum.length, 0, 360);
    let amp = spectrum[i];

    let r = map(amp, 0, 256, 80, 500);
    let x = r * cos(angle);
    let y = r * sin(angle);

    // use the user-selected particle size
    let particleSize = sizeSlider.value();

    let particle = new Particle(x, y, particleSize);
    particles.push(particle);
  }

  // display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].finished()) {
      particles.splice(i, 1);
    } else {
      particles[i].update();
      particles[i].show();
    }
  }
}

function togglePlay() {
  // toggle the play state
  if (isPlaying) {
    song.pause();
    playButton.html('Play');
  } else {
    song.play();
    playButton.html('Pause');
  }
  isPlaying = !isPlaying;
}

class Particle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size; 
    this.alpha = 255; // initial opacity
  }

  // update the status
  update() {
    this.size -= 0.05;  // reduce the particle's size
    this.alpha -= 5;    // reduce opacity to make the particle transparent
  }

  // make sure if the particle has finished
  finished() {
    return this.alpha < 0;  // if opacity is less than 0, the particle has finishe
  }

  // draw the particle
  show() {
    // use the user-selected color
    let selectedColor = color(colorSlider.value(), 200,200);
    stroke(selectedColor);
    ellipse(this.x, this.y, this.size * 2);
  }
}
//create by Luna Xu