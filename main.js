/*
  PONG.JS
  Author: David Deighan
  Date:   07/27/2021
  Description: A simple game of Pong made using vanilla JavaScript.
*/

// Canvas definitions + DOM references
let canvas = document.getElementById('pong-canvas');
let ctx = canvas.getContext('2d');
let btn = document.querySelector('.stop');
let reset = document.querySelector('.reset');
let pOne = document.querySelector('#player-one');
let pTwo = document.querySelector('#player-two');
let ann = document.querySelector('#announcer');

// vars
let leftDownPressed = false;
let leftUpPressed = false;
let rightDownPressed = false;
let rightUpPressed = false;
let playerOneScore = 0;
let playerTwoScore = 0;
let recentScore = '';
let counter = 8;
let gameStart = 0;

// Object definitions
class Ball{
  constructor(x, y, dx, dy, radius){
    this.x = x;              // ball x coordinate
    this.y = y;              // ball y coordinate
    this.dx = dx;            // ball x speed, range [0, 10]
    this.dy = dy;            // ball y speed, range [0, 10]
    this.radius = radius;    // ball radius
  }
}

class Paddle{
  constructor(x, y, w, h, dy){
    this.x = x;   // paddle x coordinate
    this.y = y;   // paddle y coordinate
    this.w = w;   // paddle width
    this.h = h;   // paddle height
    this.dy = dy; // paddle y speed
  }
}

// Ball and paddle object declarations
let b = new Ball(100, 240, 5, 4, 15);
let pLeft = new Paddle(0, 180, 20, 90, 5);
let pRight = new Paddle(620, 180, 20, 90, 5);

// Ball drawing function
function drawBall(){
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
  ctx.fillStyle = '#323264';
  ctx.fill();
  ctx.closePath();
}

// Left paddle
function drawLeftPaddle(){
  ctx.beginPath();
  ctx.rect(pLeft.x, pLeft.y, pLeft.w, pLeft.h);
  ctx.fillStyle = '#323264';
  ctx.fill();
  ctx.closePath();
}

// Right paddle
function drawRightPaddle(){
  ctx.beginPath();
  ctx.rect(pRight.x, pRight.y, pRight.w, pRight.h);
  ctx.fillStyle = '#323264';
  ctx.fill();
  ctx.closePath();
}

// Center line
function drawCenterLine(){
  ctx.beginPath()
  ctx.rect(315, 0, 10, 640);
  ctx.fillStyle = 'rgba(20,20,80,0.3)';
  ctx.fill();
  ctx.closePath();
}

// Player position graphics
function drawText(){
  ctx.font = '48px consolas';
  ctx.fillStyle = 'rgba(20,20,80,0.3)';
  ctx.fillText('P1', 25, 50);
  ctx.fillText('P2', 560, 50);
}

// Paddle controls
document.addEventListener('keydown', leftPlayerKeyDown, false);
document.addEventListener('keyup', leftPlayerKeyUp, false);
document.addEventListener('keydown', rightPlayerKeyDown, false);
document.addEventListener('keyup', rightPlayerKeyUp, false);

function leftPlayerKeyDown(e){
  if (e.key == 's'){
    leftDownPressed = true;
  } else if (e.key == 'w'){
    leftUpPressed = true;
  }
}

function leftPlayerKeyUp(e){
  if (e.key == 's'){
    leftDownPressed = false;
  } else if (e.key == 'w'){
    leftUpPressed = false;
  }
}

function rightPlayerKeyDown(e){
  if (e.key == 'Up' || e.key == 'ArrowUp'){
    rightUpPressed = true;
  } else if (e.key == 'Down' || e.key == 'ArrowDown'){
    rightDownPressed = true;
  }
}

function rightPlayerKeyUp(e){
  if (e.key == 'Up' || e.key == 'ArrowUp'){
    rightUpPressed = false;
  } else if (e.key == 'Down' || e.key == 'ArrowDown'){
    rightDownPressed = false;
  }
}

// Canvas edge collision
function edgeCollision(){
  // ball horizontal
  if (b.x + b.dx < b.radius){
    b.dx = -b.dx;
    playerTwoScore++;
    recentScore = 2;
    pTwo.textContent = playerTwoScore;
    gamePause();
  }
  if (b.x + b.dx > canvas.width - b.radius){
    b.dx = -b.dx;
    playerOneScore++;
    recentScore = 1;
    pOne.textContent = playerOneScore;
    gamePause();
  }
  // ball vertical
  if (b.y + b.dy < b.radius || b.y + b.dy > canvas.height - b.radius){
    b.dy = -b.dy;
  }
}

// ball-paddle collision detection
function collisionDetection(){
  // left paddle
  if (b.y > pLeft.y - 10 && b.y < pLeft.y + pLeft.h + 10 && b.x == pLeft.x + pLeft.w + b.radius){
    if (b.y > pLeft.y - 10 && b.y <= pLeft.y + (pLeft.h / 2)){
      b.dy = -(Math.abs(b.dy));
    } else {
      b.dy = (Math.abs(b.dy));
    }
    b.dx = -b.dx;
  }
  // right paddle
  if (b.y > pRight.y - 10 && b.y < pRight.y + pRight.h + 10 && b.x == pRight.x - b.radius){
    if (b.y > pRight.y - 10 && b.y <= pRight.y + (pRight.h / 2)){
      b.dy = -(Math.abs(b.dy));
    } else {
      b.dy = (Math.abs(b.dy));
    }
    b.dx = -b.dx;
  }
}

// pause for each score
function gamePause(){
  clearInterval(play);
  ann.style.color = 'black';
  if (playerOneScore == 10 || playerTwoScore == 10){
      ann.textContent = `Player ${recentScore} wins!!!`;
  } else {
      ann.textContent = `Player ${recentScore} scores!`;
      let pauseMode = setInterval(function(){
        counter--;
        ballPlacement();
        pLeft.y = 180;
        pRight.y = 180;
        if (counter <= 5 && counter > 0){
          ann.textContent = `Next round in ${counter}...`;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawBall();
          drawLeftPaddle();
          drawRightPaddle();
          drawCenterLine();
          drawText();
        }
        if (counter == 0){
          ann.style.color='white';
          clearInterval(pauseMode);
          counter = 8;
          play = setInterval(draw, 10);
        }
      }, 1000);
  }
}

// Controls ball placement after a score; whoever serves last, the ball is
//  served from their side of the field.
function ballPlacement(){
  if (recentScore == 1){
    b.x = 160;
    b.y = 240;
    b.dx = 5;
    b.dy = 4;
  } else if (recentScore == 2){
    b.x = 480;
    b.y = 240;
    b.dx = -5;
    b.dy = -4;
  }
}

// Main loop
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawLeftPaddle();
  drawRightPaddle();
  drawCenterLine();
  drawText();
  edgeCollision();
  collisionDetection();
  b.x += b.dx;
  b.y += b.dy;

  // controls + paddle edge collision
  if (leftUpPressed){
    pLeft.y -= pLeft.dy;
    if (pLeft.y < 0){
      pLeft.y = 0;
    }
  } else if (leftDownPressed){
    pLeft.y += pLeft.dy;
    if (pLeft.y + pLeft.h > canvas.height){
      pLeft.y = canvas.height - pLeft.h;
    }
  }

  if (rightUpPressed){
    pRight.y -= pRight.dy;
    if (pRight.y < 0){
      pRight.y = 0;
    }
  } else if (rightDownPressed){
    pRight.y += pRight.dy;
    if (pRight.y + pRight.h > canvas.height){
      pRight.y = canvas.height - pRight.h;
    }
  }
}

drawLeftPaddle();
drawRightPaddle();
drawCenterLine();
drawText();
reset.addEventListener('click', function(){
  document.location.reload();
});

let play = setInterval(draw, 10);
clearInterval(play);
btn.addEventListener('click', function(){
  let n = 6;
  ann.style.color = 'black';
  let countdown = setInterval(function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawLeftPaddle();
    drawRightPaddle();
    drawCenterLine();
    drawText();
    n--;
    ann.textContent = `Game starts in ${n}...`;
    if (n == 0){
      ann.style.color = 'white';
      clearInterval(countdown);
      btn.setAttribute('disabled', '');
      play = setInterval(draw, 10);
    }
  }, 1000);
});
