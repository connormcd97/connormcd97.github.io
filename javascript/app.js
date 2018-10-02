const height=550;
const paddleSpeed=0.7;
const ballSpeed=.5;


const width=height*0.9;


let serveAngle=150;
let add=0;
let start=false;

const Direction={
  LEFT:0,
  RIGHT:1,
  STOP:2
}

let canvas = document.createElement("canvas");
canvas.width=width;
canvas.height=height;
$('body').append(canvas);
let ctx = canvas.getContext('2d');
ctx.lineWidth=width/50;

//game javascript
var ball, paddle;

//new game
newGame();
document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

//game  loop
let timeDelta,timeLast;
requestAnimationFrame(loop);
function loop(timeNow){
  if(!timeLast){
    timeLast=timeNow;
  }
  timeDelta=(timeNow-timeLast)/1000;
  timeLast=timeNow;
  //upate

  updatePaddle(timeDelta);
  updateBall(timeDelta);

  drawBackground();


  drawPaddle();


  drawBall();


  requestAnimationFrame(loop);
}
function applyBallSpeed(angle){
  ball.dx=ball.spd*Math.cos(angle);
  ball.dy= ball.spd*Math.sin(angle);
}
  function drawBackground(){
    ctx.fillStyle='black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  function drawBall() {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(ball.x, ball.y, 10, 0, Math.PI*2);

        ctx.fill();
        ctx.closePath();





   }
  function drawPaddle(){
    ctx.fillStyle="red";
    ctx.fillRect(paddle.x - paddle.w * 0.5, paddle.y - paddle.h * 0.5, paddle.w, paddle.h);
  }



       function keyDown(ev) {
             switch (ev.keyCode) {
                 case 32:

                 serve();
                 start=true;
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

    function movePaddle(direction){

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

  function newGame(){
      paddle=new Paddle();
      ball=new Ball();
    }
    function serve(){




      var deltaX = (serveAngle+ball.x)  - ball.x;
      var deltaY = 500;
      var rad = Math.atan2(deltaY, deltaX);
      var deg = rad * (180 / Math.PI)

      applyBallSpeed(deg);
    }
  function updateBall(delta){


    if(ball.dy===0){
      ball.x=paddle.x;
    }
        ball.x += ball.dx*delta;
        ball.y += ball.dy*delta;

      }

  function  updatePaddle(delta){

      paddle.x += paddle.dx*delta;


    }

    function Ball() {
     this.w = 30;
     this.h = 30;
     this.x = paddle.x;
     this.y = paddle.y - paddle.h / 2 - this.h / 2;
     this.spd = ballSpeed * width;
     this.dx = 0;
     this.dy = 0;
 }
    function Paddle(){
      this.w=80;
      this.h=10;
      this.spd=paddleSpeed*width;
      this.x=canvas.width/2;
      this.y=canvas.height-30;
      this.dx=0;
    }
