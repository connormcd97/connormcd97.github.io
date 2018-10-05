const paddleSpeed = 0.6;
const ballSpeed = .4;
let brickCols = 5;
let brickRows = 5;
let margin = 3;
let brickGap = 3;
spin = .4;


let level, lives, score;

const stages = {
  cookieMonster: [
    '000wwww0wwww0000',
    '000wwww0wkkw0000',
    '0kkwkkwbwkkwkkk0',
    '0bbwkkbbwwwwbbb0',
    '0bbbbbbbbbbbbbb0',
    '0bbbbbbbbbbbbbb0',
    '0bkkbbbbbbbbbbb0',
    '0bbbkkbbbbbkkkk0',
    '0bbbkkkkkkkbbbb0',
    '0bbbbbbbbbbbbbb0',
    "0bbbbbbbbbbbbbb0",
    '0kbbbbbbbbbbbbk0',
    '0kbbbbbbbbbbbbk0',
    "0bkkkbbbbbbbbkk0",
  ],
  joker: ['000ggggggggg0000',
    '00gggwgggggggg00',
    '0ggwwwwwgggggg00',
    '0ggwwwwwwwwwggg0',
    '0ggwkkwwwwkwggg0',
    '0ggwwkkwwwkkwgg0',
    '0gggwkwkwkwkwgg0',
    '0ggwwkkwwwkkwgg0',
    '0ggwwwwwwwwwgg00',
    '0ggwpwwwwwwwgg00',
    '0ggwwpppppwwwgg0',
    '0ggwwwwwwwwkk000',
    '0ggwwwwwwwwkk000',
    '0kgkkkkwwwk00000',
    '0000000kkk000000',
    '0000000rrr000000',
    '00000000r0000000',
    '0000000rrr000000',
    '0000000rrr000000',
    '00000000r0000000',
  ],
  mario: [
    " 000rrrrr0000",
    " 0rrrrrrrrr00",
    " 0nnnoono0000",
    " 0nonooonooo0",
    " 0nonnooonooo",
    " 0nnoooonnnn0",
    " 000ooooooo00",
    " 00nnrnnn0000",
    " 0nnnrnnrnnn0",
    " nnnnrrrrnnnn",
    " oonrorrornoo",
    " ooorrrrrrooo",
    " oorrrrrrrroo",
    " 00rrr00rrr00",
    " 0nnn0000nnn0",
    " nnnn0000nnnn",


  ]


}

const Direction = {
  LEFT: 0,
  RIGHT: 1,
  STOP: 2
}
alert('spacebar to start left-right arrows to play')
let canvas = document.createElement("canvas");


$('body').append(canvas);


//game javascript
var ball, paddle;
bricks = []
let brickTotal;
//new game
let height, width, wall;
setDimensions();
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
let ctx = canvas.getContext('2d');

//game  loop
//timeStamp between frames
let timeStamp, timeLast;
//requestAnimationFrame() perform an animation and requests that the browser
//all a specified function to update an animation before the next repaint.
requestAnimationFrame(loop);

function loop(timeNow) {
  if (!timeLast) {
    timeLast = timeNow;
  }
  //differneces in times
  timeStamp = (timeNow - timeLast) / 1000;
  timeLast = timeNow;
  //upate
  if (game) {
    updatePaddle(timeStamp);
    updateBricks(timeStamp);
    updateBall(timeStamp);

  }
  drawBackground();
  drawText();

  drawPaddle();
  drawBricks();
  drawBall();


  requestAnimationFrame(loop);
}

function getColor(color) {

  switch (color) {
    case 'k':
      color = '#000000';
      break;
    case 'w':
      color = '#FFFFFF';
      break;
    case 'b':
      color = '#3D7DEC';
      break;
    case 'o':
      color = "#F8AB00";
      break;
    case 'g':
      color = "#69BB01";
      break;
    case 'p':
      color = "#e60000";
      break;
    case 'n':
      color = '#706800';
      break;
    case 'r':
      color = "#e60000";
      break;
    default:
      color = null;
  }

  return color;
}

function applyBallSpeed(angle) {
  ball.dx = ball.spd * Math.cos(angle); //move ball at start x direction
  ball.dy = -ball.spd * Math.sin(angle); //move ball at start y direction
}

function createBricks(obj) {
  let array = obj;
  brickRows = array.length;
  brickCols = array[1].length
  brickTotal = brickCols * brickRows;
  let areaY = 470;

  let totalRows = margin + brickRows;
  let rowH = areaY / totalRows;
  let borderBricks = brickGap;
  let h = rowH - borderBricks;

  // column dimensions
  let totalSpaceX = width - 3 * 2;
  let colW = (totalSpaceX - borderBricks) / brickCols;
  let w = colW - borderBricks;

  bricks = [];

  brickCols = array[1].length
  let color, left, top;
  for (let i = 0; i < brickRows; i++) {

    bricks[i] = [];

    top = (margin + i) * rowH
    for (let j = 0; j < brickCols; j++) {
      left = borderBricks + j * colW;
      color = getColor(array[i][j])

      if (color) {
        bricks[i][j] = new Brick(left, top, w, h, color);
      } else {
        bricks[i][j] = null;
      }
    }
  }

}


function drawBackground() {
  ctx.fillStyle = '#D4CBE6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawText() {
  ctx.font = "30px 'Press Start 2P'";
  ctx.fillStyle = "#C9797B";
  ctx.textAlign = 'left';
  ctx.fillText("Score:" + score, 0, 50);
  ctx.textAlign = 'center';
  ctx.fillText("Balls:" + lives + "/3", canvas.width / 2, 50);
  ctx.textAlign = 'right';
  ctx.fillText("level:" + level, canvas.width, 50);
  if (!game) {
    ctx.fillText("GAME OVER", canvas.width / 2, paddle.y - 200);
    ctx.font = "10px 'Press Start 2P'";
    ctx.fillText("press space for new game!", canvas.width / 2, paddle.y - 150);
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);

  ctx.fill();
  ctx.closePath();

}

function drawBricks() {

  for (let row of bricks) {
    for (let brick of row) {
      if (brick == null) {
        continue;
      }
      ctx.fillStyle = brick.color;

      ctx.fillRect(brick.left, brick.top, brick.w, brick.h);
    }
  }
}

function drawPaddle() {

  //ctx.fillStyle="red";
  //ctx.fillRect(paddle.x - paddle.w * 0.5, paddle.y - paddle.h * 0.5, paddle.w, paddle.h);
  img = new Image();
  img.src = '..brickBreaker/images/paddle.png'
  ctx.drawImage(img, paddle.x - paddle.w * 0.5, paddle.y - paddle.h * 0.5, paddle.w, paddle.h);
}


function keyDown(ev) {
  switch (ev.keyCode) {
    case 32:

      serve();
      if (!game) {
        newGame();
      }

      break;
    case 37:

      movePaddle(Direction.LEFT);

      break;
    case 39:
      movePaddle(Direction.RIGHT);
      break;
  }
}

function keyUp(ev) {
  switch (ev.keyCode) {
    case 37:
    case 39:
      movePaddle(Direction.STOP);
      break;
  }
}

function movePaddle(direction) {

  switch (direction) {

    case Direction.LEFT:

      paddle.dx = -paddle.spd;

      break;
    case Direction.RIGHT:
      paddle.dx = paddle.spd;
      break;
    case Direction.STOP:
      paddle.dx = 0;
      break;
  }

}

function setDimensions() {
  height = window.innerHeight;
  width = window.innerWidth;
  canvas.width = width;
  canvas.height = height;
  newGame();
}

function newBall() {
  paddle = new Paddle();
  ball = new Ball();
}

function newGame() {
  game = true;
  lives = 3;
  level = 1;
  score = 0;
  newLevel(level);
}

function newLevel(level) {

  newBall();

  let map = (Object.keys(stages)[level-1])

  createBricks(stages[map])
}

//createBricks(stages[0]);

function serve() {
  if (ball.dy != 0) {
    return;
  }

  let angle = Math.random() * Math.PI / 2 + Math.PI / 4 //random angle between
  //45 and 135 degrees


  applyBallSpeed(angle);
}

function newAngleAfterColision() {
  //           takes the velocities of the ball and returns a angle in rads
  // -dy to change directions

  let angle = Math.atan2(-ball.dy, ball.dx);

  angle += (Math.random() * Math.PI / 2 - Math.PI / 4) * spin;

  //gets a random degree +- 45 degrees than uses spin to
  //change the trajectory slightly
  if (ball.dy < 0) {

    if (angle < Math.PI / 6) {
      angle = Math.PI / 6 //make sure the angle isnt smaller than 30 degress
    } else if (angle > Math.PI * 5 / 6) {
      angle = Math.PI * 5 / 6 //make sure angle isnt greater than 150 degrees

    }
  } else {
    if (angle > (-(Math.PI / 6))) {
      angle = (-(Math.PI / 6)) //make sure the angle isnt smaller than 30 degress
    } else if (angle < (-(Math.PI * 5 / 6))) {
      angle = Math.PI * 5 / 6 //make sure angle isnt greater than 150 degrees
    }
  }


  applyBallSpeed(angle);
}



function updateBall(delta) {

  ball.x += ball.dx * delta;
  ball.y += ball.dy * delta;

  if (ball.x < 0 + ball.r) {
    ball.x = 0 + ball.r;
    ball.dx = -ball.dx;
    newAngleAfterColision(); //change angle based on sligt spin

  } else if (ball.x > canvas.width - ball.r) {
    ball.x = canvas.width - ball.r;
    ball.dx = -ball.dx;
    newAngleAfterColision(); //change angle based on sligt spin

  } else if (ball.y < 0 + ball.r) {
    ball.y = 0 + ball.r;
    ball.dy = -ball.dy;
    newAngleAfterColision(); //change angle based on sligt spin

  }


  //paddle collision
  if (ball.y > paddle.y - paddle.h / 2 - ball.r &&
    ball.y < paddle.y &&
    ball.x > paddle.x - paddle.w / 2 - ball.r &&
    ball.x < paddle.x + paddle.w / 2 + ball.r) {
    ball.y = paddle.y - paddle.h / 2 - ball.r;
    ball.dy = -ball.dy;
    newAngleAfterColision(); //change angle based on sligt spin

  }

  // modify the angle based off ball spin

  function outOfBounds() {
    if (lives > 0) {
      lives--;
    } else {
      game = false;
    }
  }
  //ball out of bounds
  if (ball.y > canvas.height) {
    outOfBounds();
    ball.x = paddle.x; //ball starts on paddle
    ball.y = paddle.y - paddle.h / 2 - ball.h / 2; //sets it on top
    ball.dx = 0;
    ball.dy = 0;


  }

  //start ball on paddle
  if (ball.dy === 0) {
    ball.x = paddle.x;
  }
}

function updateBricks(delta) {
  // outer/break fixes bug that causes multiple rows to be deleted
  OUTER: for (let i = 0; i < bricks.length; i++) {
    for (let j = 0; j < brickCols; j++) {
      if (bricks[i][j] != null && bricks[i][j].intersect(ball)) {
        score += 1;
        brickTotal--;
        if (ball.dy < 0) { // upwards
          ball.y = bricks[i][j].bot + ball.h/2;
        } else { // downwards
          ball.y = bricks[i][j].top - ball.r/2;
        }
        bricks[i][j] = null;



        ball.dy = -ball.dy;
        newAngleAfterColision(); //change angle based on sligt spin
        if (brickTotal == 0) {
          level++;
          if(level>4){
            game=false;
          }
          newLevel(level);
        }

        break OUTER;

      }
    }
  }
}

function updatePaddle(delta) {
  paddle.x += paddle.dx * delta;
  if (paddle.x < 0 + paddle.w / 2) {
    paddle.x = 0 + paddle.w / 2

  } else if (paddle.x > width - paddle.w / 2) {
    paddle.x = width - paddle.w / 2
  }


}

function Ball() {
  this.w = 30;
  this.h = 30;
  this.r = 10;
  this.x = paddle.x; //ball starts on paddle
  this.y = paddle.y - paddle.h / 2 - this.h / 2; //sets it on top
  this.spd = ballSpeed * width;
  this.dx = 0;
  this.dy = 0;
}

function Brick(left, top, w, h, color) {
  this.w = w;
  this.h = h;
  this.bot = top + h;
  this.left = left;
  this.right = left + w;
  this.top = top;
  this.color = color;


  this.intersect = function(ball) {
    let bBot = ball.y + ball.r;
    let bLeft = ball.x - ball.r;
    let bRight = ball.x + ball.r;
    let bTop = ball.y - ball.r;
    return this.left < bRight &&
      bLeft < this.right &&
      this.bot > bTop &&
      bBot > this.top;


  }
}

function Paddle() {
  this.w = 110;
  this.h = 20;
  this.spd = paddleSpeed * width;
  this.x = canvas.width / 2; //halfway across screen
  this.y = canvas.height - 30; //bottom of screen with space underneeth
  this.dx = 0;


}
