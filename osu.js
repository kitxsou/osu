//var delay = 30;
//var lastCircleFrame = -delay;
var heartImage;
var w2;
var lastBassEnergy = 0;
var fft;
var peakDetect;
var song, analyzer;
var currentFrame = 0;
var scoreCount = 0;
var liveCount = 5;
var currentCircleId = 0;
var rotation = 0;
var currentColor;
var scoreSize = 1;
var amt, startColor, newColor;
var lightOrDark;
var firstColor,
  secondColor,
  firstStartingCirclesColor1,
  firstStartingCirclesColor2,
  secondStartingCirclesColor1,
  secondStartingCirclesColor2,
  secondStartingCirclesColor3,
  startingTextColor1,
  startingTextColor2;
var animationFrameCount = 0;
var moveCount = 0;
var fade = 0;
var defaultRadius = 70;

var fireworks = [];
var sliders = [];
var particles = [];
var circles = [];
var missedCircles = [];
var songs = [
  // "assets/animalcrossing.mp3",
  // "assets/sayso.mp3",
  // "assets/waitaminute.mp3",
  // "assets/tomo.mp3",
  // "assets/buttercup.mp3",
  // "assets/honeypie.mp3",
  // "assets/needs.mp3",
  'assets/songs/the-best-day.mp3',
  'assets/songs/funky-background.mp3',
  'assets/songs/free-falling.mp3',
  'assets/songs/upbeat-pop-theme.mp3',
  'assets/songs/funny.mp3',
  'assets/songs/j-pop-beat.mp3',
  'assets/songs/upbeat-pop-keyboard.mp3',
];

var isLightMode = true;
var isDarkMode = false;
var isStartingScreen = true;
var isGameOver = false;
var isRunningGame = false;
var isModeScreen = false;
var isEndingScreen = false;
var isShowingFireworks = false;
var isInstructionScreen = false;
var isOneLifeMode = false;
var isDoubleSpeedMode = false;
var isNormalMode = false;
var isHardMode = false;

function preload() {
  myFont = loadFont('assets/ArchivoBlack-Regular.ttf');
  neonFont = loadFont('assets/NEON ABSOLUTE SANS1.ttf');
  song = loadSound(songs[Math.floor(random(0, songs.length))]);
  clickSound = loadSound('assets/click.mp3');
  clappingSound = loadSound('assets/clapping.mp3');
  missedSound = loadSound('assets/missed2.mp3');
  niceSound = loadSound('assets/nice.mp3');
  badSound = loadSound('assets/badsound.mp3');
  introSong = loadSound('assets/intro-song.mp3');
  choosingSound = loadSound('assets/choosing.mp3');
  heartImage = loadImage('assets/heart.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();

  angleMode(DEGREES);
  song.rate(1);

  introSong.loop();
  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude();
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();
  w2 = width / 64;

  // Patch the input to an volume analyzer
  analyzer.setInput(introSong);

  // for (var i = 0; i < 3; i++) {
  //   sliders.push(new Slider(200 + i * 100, 100, 20, 10));
  // }

  // for (var i = 0; i < 3; i++) {
  //   sliders.push(new Slider(100 + i * 100, 100, 5, 10));
  // }

  startColor = color(255, 255, 255);
  newColor = color(random(255), random(255), random(255));
  amt = 0;
}

function draw() {
  // text(Math.floor(frameRate()), 100, 100);
  lightOrDarkMode();
  gradient(firstColor, secondColor);
  rotation++;
  currentFrame++;
  noStroke();

  if (isRunningGame) {
    fft.analyze();
    peakDetect.update(fft);
    if (peakDetect.isDetected) {
      var c = new Circle();
      circles.push(c);
      if (isHardMode) {
        c.hardMode();
      } else if (isDoubleSpeedMode) {
        c.doubleSpeedMode();
      }
    }
  }

  if (isStartingScreen) {
    startingScreen(
      firstStartingCirclesColor1,
      firstStartingCirclesColor2,
      secondStartingCirclesColor1,
      secondStartingCirclesColor2,
      secondStartingCirclesColor3,
      startingTextColor1,
      startingTextColor2
    );
    lightOrDarkModeSwitch(lightOrDark);
  } else if (isInstructionScreen) {
    instructionScreen();
  } else if (isModeScreen) {
    modeScreen();
    lightOrDarkModeSwitch(lightOrDark);
  } else if (isGameOver) {
    gameOver();
  } else if (isEndingScreen) {
    endingResults();
  } else if (isRunningGame) {
    runGame();
  }

  if (scoreSize > 1) {
    scoreSize -= 1 / 10;
  }

  //instruction cirlce animation
  if (approach > 0) {
    approach -= 2;
  } else if (approach === 0) {
    approach = 30 * 13;
  }

  cursorSkin();
  // text(Math.floor(frameRate()), 200, 200);
}

class Circle {
  constructor() {
    this.radius = defaultRadius;
    this.x = random(this.radius * 4, width - this.radius * 4);
    this.y = random(this.radius * 3, height - this.radius * 3);
    this.color = color(random(0, 255), random(0, 255), random(0, 255));
    this.framesTilDeath = 30 * 20;
    this.id = currentCircleId++;
  }

  show() {
    push();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
    fill(255);
    textAlign(CENTER);
    textFont(myFont);
    textSize(50);
    text((this.id % 5) + 1, this.x, this.y + 15);
    pop();
  }

  showApproachCircle() {
    push();
    noFill();
    strokeWeight(5);
    stroke(255 - this.framesTilDeath, 20, 0 + this.framesTilDeath * 5);
    ellipse(this.x, this.y, this.radius * 2 + this.framesTilDeath);
    pop();
  }

  hardMode() {
    this.radius = defaultRadius * 0.8;
    this.framesTilDeath = 30 * 15;
  }

  doubleSpeedMode() {
    this.framesTilDeath = 30 * 10;
  }
}
// function createRandomCircle() {
//   if (isHardMode) {
//     radius = defaultRadius * 0.75;
//     framesTilDeath = 30 * 2;
//   } else if (isEasyMode) {
//     radius = defaultRadius * 1.75;
//     framesTilDeath = 30 * 6;
//   } else if (isNormalMode) {
//     radius = defaultRadius;
//     framesTilDeath = 30 * 4;
//   }

//   return {
//     x: random(radius * 5, width - radius * 5),
//     y: random(radius * 5, height - radius * 5),
//     radius: radius,
//     color: color(random(0, 255), random(0, 255), random(0, 255)),
//     framesTilDeath: framesTilDeath,
//     id: currentCircleId++
//   };
// }
// function drawCircle(circle, i) {
//   push();
//   fill(circle.color);
//   ellipse(circle.x, circle.y, circle.radius * 2, circle.radius * 2);
//   fill(255);
//   textAlign(CENTER);
//   textFont(myFont);
//   textSize(50);
//   text((circle.id % 5) + 1, circle.x, circle.y + 15);
//   pop();
// }

// function drawApproachCircle(circle) {
//   push();
//   noFill();
//   strokeWeight(5);
//   stroke(255 - circle.framesTilDeath, 20, 0 + circle.framesTilDeath * 5);
//   ellipse(
//     circle.x,
//     circle.y,
//     circle.radius * 2 + circle.framesTilDeath,
//     circle.radius * 2 + circle.framesTilDeath
//   );
//   pop();
// }
function lineBetweenCircles() {
  if (circles.length >= 2) {
    var newestCircle = circles[circles.length - 1];
    var beforeCircle = circles[circles.length - 2];
    push();
    stroke(255);
    strokeWeight(3);
    line(beforeCircle.x, beforeCircle.y, newestCircle.x, newestCircle.y);
    pop();
  }
}

function checkCircleClick() {
  if (isGameOver || isEndingScreen) {
    return;
  }

  for (var i = 0; i < circles.length; i++) {
    var currentCircle = circles[i];

    var d = dist(mouseX, mouseY, currentCircle.x, currentCircle.y);
    if (d < currentCircle.radius) {
      circles.splice(i, 1);
      scoreSize = 1.5;
      clickSound.play();
      if (currentCircle.framesTilDeath >= 30) {
        scoreCount += 100;
        scoreSize = 2.5;
        niceSound.play();
      } else {
        scoreCount += 10;
      }
      return;
    }
  }
}

function mousePressed() {
  var rms = analyzer.getLevel();
  rect(width / 15, height / 15, 80, 30, 30);
  //light or dark mode switch
  if (isStartingScreen || isModeScreen) {
    if (
      mouseX >= width / 15 - 40 &&
      mouseX <= width / 15 + 40 &&
      mouseY >= height / 15 - 15 &&
      mouseY <= height / 15 + 15
    ) {
      if (isLightMode) {
        isLightMode = false;
        isDarkMode = true;
      } else if (isDarkMode) {
        isLightMode = true;
        isDarkMode = false;
      }
    }
  }

  checkCircleClick();

  //test for if in slider
  // for (var i = 0; i < sliders.length; i++) {
  //   if (sliders[i].isInSlider(mouseX, mouseY)) {
  //     // console.log("inSlider");
  //     sliders.splice(i, 1);
  //   }
  // }

  var dDoubleSpeedMode = dist(mouseX, mouseY, width / 2, (height / 4) * 2.8);
  if (isModeScreen && dDoubleSpeedMode < 160 + rms * 100) {
    choosingSound.play();
    isModeScreen = false;
    isRunningGame = true;
    isGameOver = false;
    isEndingScreen = false;
    isDoubleSpeedMode = true;
    circles = [];
    missedCircles = [];
    currentFrame = 0;
    scoreCount = 0;
    liveCount = 5;
    analyzer.setInput(song);
    introSong.stop();
    song.play();
    song.rate(1.5);
    animationFrameCount = 0;
  }

  var dNormalMode = dist(mouseX, mouseY, width / 2, height / 4);
  if (isModeScreen && dNormalMode < 160 + rms * 100) {
    isModeScreen = false;
    isRunningGame = true;
    isEndingScreen = false;
    isGameOver = false;
    circles = [];
    missedCircles = [];
    currentFrame = 0;
    scoreCount = 0;
    liveCount = 5;
    analyzer.setInput(song);
    introSong.stop();
    song.play();
    song.rate(1);
    animationFrameCount = 0;
  }

  var dOneLifeMode = dist(mouseX, mouseY, (width / 5) * 4, (height / 4) * 2.8);
  if (isModeScreen && dOneLifeMode < 160 + rms * 100) {
    isModeScreen = false;
    isEndingScreen = false;
    isRunningGame = true;
    isGameOver = false;
    circles = [];
    missedCircles = [];
    currentFrame = 0;
    scoreCount = 0;
    liveCount = 1;
    analyzer.setInput(song);
    introSong.stop();
    song.play();
    song.rate(1);
    animationFrameCount = 0;
  }

  var dHardMode = dist(mouseX, mouseY, width / 5, (height / 4) * 2.8);
  if (isModeScreen && dHardMode < 160 + rms * 100) {
    isModeScreen = false;
    isEndingScreen = false;
    isRunningGame = true;
    isGameOver = false;
    circles = [];
    missedCircles = [];
    currentFrame = 0;
    scoreCount = 0;
    liveCount = 5;
    analyzer.setInput(song);
    introSong.stop();
    song.play();
    song.rate(1);
    animationFrameCount = 0;
    isHardMode = true;
  }
  //starting screen circle
  var dStartingScreenCircle = dist(mouseX, mouseY, width / 2, height / 2);
  if (isStartingScreen && dStartingScreenCircle < 160 + rms * 100) {
    choosingSound.play();
    isStartingScreen = false;
    isInstructionScreen = true;
    fireworks = [];
  }

  //retry
  if (
    isGameOver &&
    mouseX >= width / 2 - 100 &&
    mouseX <= width / 2 + 100 &&
    mouseY >= (height / 3) * 2 - 50 &&
    mouseY <= (height / 3) * 2 + 50
  ) {
    isGameOver = false;
    isModeScreen = true;
    isHardMode = false;
    isDoubleSpeedMode = false;
    introSong.loop();
    fireworks = [];
  }

  //again
  if (
    isEndingScreen &&
    mouseX >= width / 2 - 100 &&
    mouseX <= width / 2 + 100 &&
    mouseY >= (height / 3) * 2 - 50 &&
    mouseY <= (height / 3) * 2 + 50
  ) {
    isEndingScreen = false;
    isModeScreen = true;
    isHardMode = false;
    isDoubleSpeedMode = false;
    introSong.loop();
    fireworks = [];
  }

  // if (
  //   isRunningGame &&
  //   mouseX >= width / 4 - 50 &&
  //   mouseX <= width / 4 + 50 &&
  //   mouseY >= height / 2 - 100 &&
  //   mouseY <= height / 2 + 100
  // ) {
  //   song.jump(10);
  // }
}

function keyPressed() {
  if (keyCode === 32) {
    // press space
    choosingSound.play();
    isHardMode = false;
    isDoubleSpeedMode = false;
    fireworks.splice(0, fireworks.length);

    if (isInstructionScreen) {
      isInstructionScreen = false;
      isModeScreen = true;
    } else if (isRunningGame) {
      isRunningGame = false;
      isModeScreen = true;
      song.stop();
      introSong.loop();
    }
  }

  if (keyCode === 89 || keyCode === 88) {
    checkCircleClick();
  }
}

function runGame() {
  musicCircle(musicCircleColor);
  bgSoundVis();
  //skipIntro();
  changeColor();

  // var rms = analyzer.getLevel();
  // var bassEnergy = fft.getEnergy("bass"); //war nur ein versuch, wurde verworfen
  // var spectrum = fft.analyze();
  // if (bassEnergy >= 230 && currentFrame > lastCircleFrame + delay) {
  //   lastCircleFrame = currentFrame;
  // (rms >= 0.28 && currentFrame > lastCircleFrame + delay)
  // circles.push(createRandomCircle());
  // }

  // lastBassEnergy = bassEnergy;
  // increase difficulty every 3s
  //if (currentFrame % 90 === 0) {framesToDrawOn -= 2;}

  lineBetweenCircles();

  for (var i in circles) {
    var currentCircle = circles[i];
    // draw all circles
    currentCircle.showApproachCircle();
    currentCircle.show();
    currentCircle.framesTilDeath -= 10;

    if (currentCircle.framesTilDeath === 0) {
      liveCount--;
      circles.splice(currentCircle, 1);
      currentCircle.framesTilDeath = 30 * 10;
      missedCircles.push(currentCircle);
      missedSound.play();
    }
  }

  //missed circle animaton
  for (var currentCircle of missedCircles) {
    drawMissed(
      currentCircle.x,
      currentCircle.y,
      currentCircle.framesTilDeath / (30 * 10)
    );
    currentCircle.framesTilDeath -= 10;
    if (currentCircle.framesTilDeath <= 0) {
      missedCircles.splice(currentCircle, 1);
    }
  }

  if (song.duration() === 0 && scoreCount > 0) {
    isRunningGame = false;
  }

  if (liveCount === 0) {
    isGameOver = true;
    badSound.play();
  } else if (isRunningGame && song.currentTime() === 0 && scoreCount > 0) {
    isEndingScreen = true;
    clappingSound.play();
  }
  //had to remove fireworks from ingame bc it lagged too much :((
  if (
    (scoreCount >= 1000 && liveCount === 5) ||
    (scoreCount >= 5000 && liveCount >= 3) ||
    (scoreCount >= 10000 && liveCount >= 1)
  ) {
    isShowingFireworks = true;
  } else {
    isShowingFireworks = false;
  }

  //slide in animation
  var songProgress = song.currentTime() / song.duration();
  if (
    (songProgress > 0.2 ||
      songProgress > 0.5 ||
      songProgress > 0.7 ||
      songProgress > 0.9) &&
    animationFrameCount < 30 * 8
  ) {
    animationFrameCount++;
    slideIn(0, moveCount);
    slideIn(width, -1 * moveCount);
  } else {
    moveCount = 0;
  }
  if (animationFrameCount <= 90) {
    moveCount++;
  } else if (animationFrameCount > 150 && animationFrameCount <= 240) {
    moveCount--;
  }

  if (isShowingFireworks) {
    showAllFireworks();
  } else {
    fireworks = [];
  }

  if (isRunningGame && scoreCount <= 0 && songProgress <= 0.2) {
    push();
    if (currentFrame % 90 > 60) {
      textSize(100);
      textAlign(CENTER);
      textFont(myFont);
      fill(255);
      text('ready?', width / 2, height / 2);
    }
    pop();
  }

  if (liveCount > 1) {
    lives(0);
  } else {
    lives(random(-5, 5));
  }
  score();
  songBar();
}

function score() {
  push();
  fill(255);
  textSize(30);
  textFont(myFont);
  text('score: ', height / 24, width / 25);
  fill(startColor);
  textSize(25 * scoreSize);
  text(scoreCount, (height / 24) * 6, width / 25);
  pop();
}

function lives(jitter) {
  push();
  imageMode(CENTER);
  translate((width / 4) * 1.6, (height / 35) * 2.5);
  fill(255);
  for (var i = 1; i < liveCount + 1; i++) {
    //rect((width / 20) * i + jitter, 0, 30, 30, 10);
    image(heartImage, (width / 30) * i + jitter, 0, 80, 50);
  }
  pop();
}

function musicCircle(musicCircleColor) {
  var rms = analyzer.getLevel();
  push();
  fill(musicCircleColor);
  ellipse(width / 10, (height / 10) * 8, 120 + rms * 300, 120 + rms * 300);
  ellipse(width / 10, (height / 10) * 8, 80 + rms * 300, 80 + rms * 300);
  ellipse(width / 10, (height / 10) * 8, 50 + rms * 300, 50 + rms * 300);
  ellipse(
    (width / 10) * 9,
    (height / 10) * 8,
    120 + rms * 300,
    120 + rms * 300
  );
  ellipse((width / 10) * 9, (height / 10) * 8, 80 + rms * 300, 80 + rms * 300);
  ellipse((width / 10) * 9, (height / 10) * 8, 50 + rms * 300, 50 + rms * 300);
  pop();
}

function cursorSkin() {
  var p = new Particle();
  particles.push(p);
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
  if (particles.length >= 10) {
    particles.shift();
  }

  push();
  fill(255, 255, 255, 80);
  stroke(252, 231, 164);
  strokeWeight(4);
  ellipse(mouseX, mouseY, 49);
  stroke(245, 127, 153);
  ellipse(mouseX, mouseY, 44);
  // line(mouseX, mouseY, pmouseX, pmouseY);
  strokeWeight(4);
  line(mouseX, mouseY - 6, mouseX, mouseY + 6);
  line(mouseX - 6, mouseY, mouseX + 6, mouseY);
  // point(mouseX, mouseY);

  translate(mouseX, mouseY);
  strokeWeight(3);
  stroke(187, 135, 230);
  rotate(1 * rotation);
  arc(0, 0, 30, 30, 0, 180 / 3);
  rotate(180);
  arc(0, 0, 30, 30, 0, 180 / 3);
  pop();
}

function drawMissed(x, y, opacity) {
  push();
  fill(255, 0, 0, opacity * 255);
  textSize(40);
  text('missed', x, y);
  pop();
}

function songBar() {
  push();
  fill(255);
  rect(width / 2 - song.duration(), height / 35, song.duration() * 2, 5, 10);
  fill(255, 0, 0);
  rect(width / 2 - song.duration(), height / 35, song.currentTime() * 2, 5, 10);
  pop();
}

function gameOver() {
  push();
  background(0);
  rectMode(CENTER);
  fill(firstColor);
  textSize(100);
  textAlign(CENTER);
  textFont(neonFont);
  text('GAME OVER', width / 2, height / 3);
  fill(secondColor);

  text('GAME OVER', width / 2 + 10, height / 3 + 10);

  textSize(50);
  textFont(myFont);
  text('score: ' + scoreCount, width / 2, (height / 3) * 1.5);
  fill(255);
  rect(width / 2, (height / 3) * 2, 200, 100, 30);
  fill(firstColor);
  text('retry', width / 2, (height / 3) * 2 + 15);
  pop();

  song.stop();
}

function startingScreen(c1, c2, c3, c4, c5, c6, c7) {
  var rms = analyzer.getLevel();
  //sliderBody();
  // Draw an ellipse with size based on volume
  push();
  fill(c5);
  ellipse(width / 2, height / 2, 700 + rms * 450, 700 + rms * 450);

  fill(c4);
  ellipse(width / 2, height / 2, 630 + rms * 450, 630 + rms * 450);

  fill(c3);
  ellipse(width / 2, height / 2, 500 + rms * 450, 500 + rms * 450);

  fill(c2);
  ellipse(width / 2, height / 2, 390 + rms * 500, 390 + rms * 500);

  fill(c1);
  ellipse(width / 2, height / 2, 330 + rms * 500, 330 + rms * 500);

  //text(frameCount, 50, 50);

  if (currentFrame % 90 < 60) {
    // for 2s on, for 1s off
    fill(c7);
    textAlign(CENTER);
    textFont(myFont);
    textSize(52);
    text('CLICK ME', width / 2, height / 2 + 20);
    fill(c6);
    textSize(48);
    text('CLICK ME', width / 2, height / 2 + 10);
    pop();

    showAllFireworks();
  }
}

function modeScreen() {
  var rms = analyzer.getLevel();
  push();
  fill(startColor);
  stroke(255, 85);
  strokeWeight(30);
  ellipse(width / 2, height / 4, 160 + rms * 100);
  ellipse(width / 5, (height / 4) * 2.8, 160 + rms * 100);
  ellipse(width / 2, (height / 4) * 2.8, 160 + rms * 100);
  ellipse((width / 5) * 4, (height / 4) * 2.8, 160 + rms * 100);
  pop();

  if (currentFrame % 90 < 60) {
    push();
    textAlign(CENTER);
    textFont(myFont);
    textSize(25);
    fill(255);

    text('normal', width / 2, height / 4);
    text('hard', width / 5, (height / 4) * 2.8);
    text('x2 speed', width / 2, (height / 4) * 2.8);
    text('1 life', (width / 5) * 4, (height / 4) * 2.8);

    fill(255, 80);
    textSize(27);
    text('normal', width / 2, height / 4 + 8);
    text('hard', width / 5, (height / 4) * 2.8 + 8);
    text('x2 speed', width / 2, (height / 4) * 2.8 + 8);
    text('1 life', (width / 5) * 4, (height / 4) * 2.8 + 8);
    pop();
  }

  modeCircles(width / 2, height / 4);
  modeCircles(width / 5, (height / 4) * 2.8);
  modeCircles(width / 2, (height / 4) * 2.8);
  modeCircles((width / 5) * 4, (height / 4) * 2.8);
}
function gradient(firstColor, secondColor) {
  push();
  var startColor = firstColor; //top color 51, 68, 105
  var endColor = secondColor; //bottom color 222, 113, 126
  var gradientX = 0; //
  var gradientY = 0; // rectangle of gradient box
  var w = width; //
  var h = height; //

  var rms = analyzer.getLevel();
  //console.log(Math.floor(rms * 100));
  for (var i = gradientY; i <= gradientY + h; i = i + 1.0) {
    var gradientProgress = map(i, gradientY, gradientY + h, 0, rms * 10);
    var gradientColor = lerpColor(startColor, endColor, gradientProgress);
    stroke(gradientColor);
    line(gradientX, i, gradientX + w, i);
  }
  // pop();
  // push();
  // var startColor = color(199, 150, 255); //top color
  // var endColor = color(255, 155, 112); //bottom color
  // var gradientX = 0; //
  // var gradientY = 0; // rectangle of gradient box
  // var w = width; //
  // var h = height; //

  // var rms = analyzer.getLevel();
  // //console.log(Math.floor(rms * 100));
  // for (var i = gradientY; i <= gradientY + h; i = i + 1) {
  //   var gradientProgress = map(i, gradientY, gradientY + h, 0, rms * 10);
  //   var gradientColor = lerpColor(startColor, endColor, gradientProgress);
  //   stroke(gradientColor);
  //   line(gradientX, i, gradientX + w, i);
  // }
  // pop();
}

function bgSoundVis() {
  push();
  var spectrum = fft.analyze();
  stroke(255);
  for (var i = 0; i < spectrum.length; i++) {
    var amp = spectrum[i];
    var y = map(amp, 0, 256, height, 0);
    line(i * w2, height, i * w2, y);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function endingResults() {
  push();
  background(0);
  rectMode(CENTER);
  fill(firstColor);
  textSize(100);
  textAlign(CENTER);
  textFont(neonFont);
  text('WELL DONE!', width / 2, height / 3);
  fill(secondColor);
  text('WELL DONE!', width / 2 + 10, height / 3 + 10);

  textSize(50);
  textFont(myFont);
  text('score: ' + scoreCount, width / 2, (height / 3) * 1.5);
  fill(255);
  rect(width / 2, (height / 3) * 2, 200, 100, 30);
  fill(firstColor);
  text('again', width / 2, (height / 3) * 2 + 15);
  pop();

  showAllFireworks();
}

class Particle {
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.r = 255;
    this.g = 248;
    this.b = 235;
    this.opacity = 70;
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
  }

  show() {
    fill(this.r, this.g, this.b, this.opacity);
    ellipse(this.x, this.y, 30);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }
}

class Slider {
  constructor(x, y, x2, y2) {
    // this.x = 100;
    // this.y = 100;
    // this.x2 = 200;
    // this.y2 = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.radius = 50;
    this.history = [];
    this.location = createVector(x, y);
    this.velocity = createVector(x2, y2);
    this.length = 300;
  }

  show() {
    // var v1 = createVector(this.x, this.y);
    // var v2 = createVector(this.x2 - this.x, this.y2 - this.y);

    // for (var i = 0; i <= v2.x && i <= v2.y; i ++) {
    //   ellipse(v1.x + i, v1.y + i, this.radius);
    // }

    // for (var i = 0; i <= v2.x; i++) {
    //   for (var e = 0; e <= v2.y; e++) {
    //     ellipse(v1.x + i, v1.y + e, this.radius);
    //   }
    // }

    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      fill(this.r, this.g, this.b);
      ellipse(pos.x, pos.y, this.radius);

      fill(this.r, this.g, this.b);
      ellipse(this.location.x, this.location.y, this.radius);
      //ellipse(this.x2, this.y2, this.radius);
    }
  }

  update() {
    // this.x++;
    // this.y++;

    var lastCircle;
    if (this.history.length === 0) {
      lastCircle = this.location;
    } else {
      lastCircle = this.history[this.history.length - 1];
    }

    if (
      this.history.length === 0 ||
      lastCircle.x <= this.location.x + this.length
    ) {
      var v = createVector(lastCircle.x, lastCircle.y).add(this.velocity);
      this.history.push(v);
    }
  }

  isInSlider(x, y) {
    // for (var i = 0; i < sliders.length; i++) {
    //   var currentSlider = sliders[i];
    //   var d = dist(x, y, currentSlider.x, currentSlider.y);
    //   if (d < this.radius) {
    //     //console.log("clicked");
    //     this.r = 255;
    //     this.g = 255;
    //     this.b = 255;
    //     sliders.splice(i, 1);
    //   }
    // }
    // for (var i = 0; i < sliders.length; i++) {
    //   var currentSlider = sliders[i];
    //   if (currentColor === [0, 0, 0, 255]) {
    //     sliders.splice(i, 1);
    //     console.log("clicked");

    /*
    var c = color(0).levels; // array [r, g, b, o]
    currentColor = get(mouseX, mouseY); // array [r, g, b, o]
    if (
      currentColor[0] === c[0] &&
      currentColor[1] === c[1] &&
      currentColor[2] === c[2] &&
      currentColor[3] === c[3]
    ) {
      // sliders.splice(i, 1);
      console.log("clicked");
    }*/

    // geg.: x, y & slider(circles)

    for (var i = 0; i < this.history.length; i++) {
      var vec = this.history[i];
      var d = dist(x, y, vec.x, vec.y);

      if (d <= this.radius) {
        return true;
      }
    }

    return false;
  }

  isInStartingCirlce(x, y) {}

  isInEndingCircle(x, y) {}
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-5, -1);
    this.opacity = 255;
  }
  show() {
    fill(255, this.opacity);
    ellipse(this.x, this.y, 25);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity -= 5;
  }
  finished() {
    return this.opacity <= 0;
  }
}

function showAllFireworks() {
  if (currentFrame % 5 === 0) {
    fireworks.push(new Firework(width / 6, (height / 2) * 2));
    fireworks.push(new Firework((width / 6) * 5, (height / 2) * 2));
  }
  for (var i = 0; i < fireworks.length; i++) {
    fireworks[i].show();
    fireworks[i].update();
    if (fireworks[i].finished()) {
      fireworks.splice(i, 1);
    }
  }
  // if (fireworks.length >= 50) {
  //   isShowingFireworks = false;

  // for (var i of fireworks) {
  //   fireworks.splice(i, 1);
  //}
}

//rotating arcs um circles im modescreen, diy aber inspiriert von einem audio visualizer design aus einer website, deren Namen ich leider vergessen habe :(
function modeCircles(x, y) {
  var rms = analyzer.getLevel();

  // push();
  // translate(width / 2, height / 2);
  // fill(50, 50, 50);
  // ellipse(0, 0, 80);
  // beginShape();
  // for (var i = 0; i <= 360; i++) {
  //   // rotate((PI / 180) * i);
  //   stroke(255);
  //   noFill();

  //   var r = 100;
  //   var x = r * cos(i);
  //   var y = r * sin(i);

  //   vertex(x, y);
  // }
  // endShape();
  // pop();

  push();
  translate(x, y);
  rotate(1 * rotation);
  strokeWeight(10);
  noFill();

  stroke(startColor);
  var degrees = 20;
  for (var i = 0; i < 360; i += degrees) {
    arc(0, 0, 200 + rms * 250, 200 + rms * 250, 0, 1);
    rotate(degrees);
  }

  rotate(2 * -rotation);
  for (var i = 0; i < 360; i += degrees) {
    arc(0, 0, 280 + rms * 250, 280 + rms * 250, 0, 1);
    rotate(degrees);
  }
  pop();
  changeColor();
}

var approach = 30 * 13;
function instructionScreen() {
  push();
  fill(219, 96, 96);
  ellipse(width / 4, height / 2, 120);

  noFill();
  strokeWeight(5);
  stroke(255 - approach, 20, 0 + approach * 5);
  ellipse(width / 4, height / 2, 120 + approach);

  fill(255);
  noStroke();
  textAlign(CENTER);
  textFont(myFont);
  textSize(50);
  text('1', width / 4, height / 2 + 15);
  textSize(25);
  textAlign(LEFT);

  text(
    "Click the circle while the approaching circle isn't touching the inner circle. The sooner the better.",
    (width / 3) * 1.5,
    height / 4 + 15,
    600,
    500
  );

  text(
    'You can either just click the circle, or hover over them and press X or Y. While in game you can press space to return to menu.',
    (width / 3) * 1.5,
    (height / 4) * 2,
    600,
    500
  );

  textAlign(CENTER);
  if (currentFrame % 90 > 60) {
    text('press space to continue', width / 2, (height / 10) * 9.5);
  }
  textSize(50);
  text('How To Play', width / 2, height / 10);
  pop();
}

function changeColor() {
  push();
  colorMode(HSB, 100);
  stroke(lerpColor(startColor, newColor, amt));
  amt += 0.01;
  if (amt >= 1) {
    amt = 0.0;
    startColor = newColor;
    newColor = color(random(100), 51, 96);
  }
  pop();
}

function lightOrDarkModeSwitch(lightOrDark) {
  push();
  rectMode(CENTER);
  fill(startingTextColor1);
  rect(width / 15, height / 15, 80, 30, 30);
  fill(firstStartingCirclesColor1);
  textFont(myFont);
  textAlign(CENTER);
  textSize(18);
  text(lightOrDark, width / 15, height / 15 + 5);
  pop();
}

function lightOrDarkMode() {
  var rms = analyzer.getLevel();

  if (isLightMode) {
    lightOrDark = 'light';
    firstColor = color(196, 156, 255);
    secondColor = color(95, 251, 241);
    firstStartingCirclesColor1 = color(255);
    firstStartingCirclesColor2 = color(255, 90);
    secondStartingCirclesColor1 = color(0, 121, 207, 90 * rms * 4);
    secondStartingCirclesColor2 = color(0, 121, 207, 80 * rms * 4);
    secondStartingCirclesColor3 = color(0, 121, 207, 40 * rms * 4);
    startingTextColor1 = color(108, 224, 188);
    startingTextColor2 = color(108, 224, 188, 80);
    musicCircleColor = color(88, 119, 191, 70 * rms * 8);
  } else if (isDarkMode) {
    lightOrDark = 'dark';
    firstColor = color(40, 21, 77);
    secondColor = color(140, 50, 112);
    firstStartingCirclesColor1 = color(247, 172, 106);
    firstStartingCirclesColor2 = color(247, 172, 106, 90);
    secondStartingCirclesColor1 = color(232, 107, 107, 90 * rms * 4);
    secondStartingCirclesColor2 = color(232, 107, 107, 80 * rms * 4);
    secondStartingCirclesColor3 = color(232, 107, 107, 40 * rms * 4);
    startingTextColor1 = color(255);
    startingTextColor2 = color(255, 80);
    musicCircleColor = color(255, 124, 105, 70 * rms * 10);
  }
}

function slideIn(x, m) {
  push();
  ellipseMode(CENTER);
  fill(255, Math.abs(fade + m * 3));
  ellipse(x + m, height / 2, 300, 300);
  pop();
}

function sliderBody() {
  push();
  stroke(255);
  strokeWeight(100);
  strokeCap(ROUND);
  line(300, 300, 300, 600);
  noStroke();
  fill(0, 0, 255);
  ellipse(300, 300, 100);
  ellipse(300, 600, 100);
  pop();
}

function skipIntro() {
  push();
  textAlign(CENTER);
  textFont(myFont);
  textSize(100);
  fill(firstStartingCirclesColor1);
  text('skip intro', width / 4, height / 2);
  fill(255);
  rectMode(CENTER);
  rect(width / 4, height / 2, 100, 200);
  pop();
}
