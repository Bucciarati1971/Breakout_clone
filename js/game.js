var canvas =document.getElementById('Canvas');
var ctx =canvas.getContext('2d');

var x =canvas.width /2;
var y =canvas.height -30;
var dx=2;
var dy=-2;
var ballRadius=10;

var score=0;
var lives=3;
var speed;
var gameRunning=false; 
var gameStart=false;
var gameInterval;

var paddleHeight=15;
var paddleWidth=75;
var paddleX=(canvas.width-paddleWidth)/2;

var rightPressed=false;
var leftPressed=false;

var brickRowCount = 5;
var brickColumCount =8;
var brickWidth=65;
var brickHeight=20;
var brickPadding=5;
var brickOffsetTop=40;
var brickOffsetLeft =20;


var beep=document.createElement('audio'),
	boom=document.createElement('audio'),
	blip=document.createElement('audio'),
	gameover=document.createElement('audio');

if (!!(beep.canPlayType&&beep.canPlayType('audio/mpeg').replace(/no/,' '))) {
	beep.src='src/beep.mp3';
	blip.src='src/blip04.mp3';
	boom.src='src/small_drum1.mp3';
	gameover.src='src/gameover.mp3';
}else{
	beep.src='src/beep.ogg';
	gameover.src='src/gameover.ogg';

}

 //var img = new Image(); 
// img.src = 'src/wood.jpg';

var bricks = [];
var bricksNumber= brickColumCount*brickRowCount;
for (var c = 0; c < brickColumCount; c++) {
	bricks[c]=[];
	for (var r = 0; r < brickRowCount; r++) {

		bricks[c][r]={x:0,y:0,status:1};
		if (false) {
			bricks[c][r].status=0;
			bricksNumber--;
		}
	}
}

document.addEventListener("DOMContentLoaded",function(){

	var levels =document.querySelectorAll(".button");
		for (var i = 0; i < levels.length; i++) {
			levels[i].addEventListener("click",startGame);
		}
});

document.getElementById('retry').addEventListener("click",function(){
	clearInterval(gameInterval);
	document.getElementById("overlay").style.display="block";
	document.getElementById("overlay2").style.display="none";
	document.getElementById("tip").style.display="none";


});

function startGame(level){
	beep.play();
	document.getElementById("overlay").style.display="none";
	document.getElementById("tip").style.display="block";
	speed=parseInt(level.target.getAttribute("data-i"));
	console.log(speed);
	paddleWidth=speed*15;
	gameStart=true;
	score=0;
	lives=3;
	gameInterval=setInterval(draw,speed);
	for (var c = 0; c < brickColumCount; c++) {
	
		for (var r = 0; r < brickRowCount; r++) {
			bricks[c][r].status=1;
			if (false) {
				bricks[c][r].status=0;
				bricksNumber--;
			}
		}
	}
}

canvas.addEventListener("click",function(){

	if (!gameRunning&&gameStart) {
		gameRunning=true;
		document.getElementById("tip").style.display="none";
	}

});


document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);
document.addEventListener("mousemove",mouseMoveHandler,false);

function keyDownHandler(e){
	if (e.keyCode==39) {
		rightPressed=true;
	}else if (e.keyCode==37) {
		leftPressed=true;
	}

};
function keyUpHandler(e){
	if (e.keyCode==39) {
		rightPressed=false;
	}else if (e.keyCode==37) {
		leftPressed=false;
	}

};

function mouseMoveHandler(e){
	
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX>0 && relativeX<canvas.width) {

		paddleX=relativeX-paddleWidth/2;
		if (paddleX+paddleWidth>canvas.width) {
			paddleX=canvas.width-paddleWidth;
		}
		if (paddleX<0) {
			paddleX=0;
		}
	}

};
function drawBall(){
	ctx.beginPath();

	ctx.arc(x,y,ballRadius,0,Math.PI*2);
	ctx.fillStyle="rgb(200, 0, 0)";
	ctx.fill();

	ctx.closePath();

	ctx.beginPath();
	
	ctx.arc(x-2,y-2,ballRadius-6,0,Math.PI*2);
	ctx.fillStyle="rgb(250, 150, 150)";
	ctx.fill();

	ctx.closePath();

}

function drawPaddle(){
	
	drawRoundRect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight,8,"rgb(255, 255, 128)",'fill');
	drawRoundRect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight,8,"rgb(155, 155, 28)",'stroke')
}

function drawBricks(){
	var brickX;
	var brickY;
	 
  	 
	for (var c = 0; c < brickColumCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status==1) {

			brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
			brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;

			bricks[c][r].x=brickX;
			bricks[c][r].y=brickY;
			
  			
			drawRoundRect(brickX,brickY,brickWidth,brickHeight,6,"rgb(153, 102, 51)",'fill');
			//drawRoundRect(brickX,brickY,brickWidth,brickHeight,6,"rgb(255, 255, 255)",'stroke');
    		//ctx.drawImage(img,brickX,brickY,brickWidth,brickHeight);
 			
 			



			}
		}
	}
 

}

function drawRoundRect(Rx,Ry,width,height,radius,color,type){

	ctx.beginPath();
	ctx.moveTo(Rx,Ry+radius);
	ctx.lineTo(Rx,Ry+height-radius);
	ctx.quadraticCurveTo(Rx,Ry+height,Rx+radius,Ry+height);
	ctx.lineTo(Rx+width-radius,Ry+height);
	ctx.quadraticCurveTo(Rx+width,Ry+height,Rx+width,Ry+height-radius);
	ctx.lineTo(Rx+width,Ry+radius);
	ctx.quadraticCurveTo(Rx+width,Ry,Rx+width-radius,Ry);
	ctx.lineTo(Rx+radius,Ry);
	ctx.quadraticCurveTo(Rx,Ry,Rx,Ry+radius);
	
	ctx[type+'Style']=color;
	ctx[type]();
	ctx.closePath();



}


function drawScore(){
	ctx.font="16px fantasy";
	ctx.fillStyle="black";
	ctx.fillText("Score: "+score,8,20);

};

function drawLives(){

	ctx.font = "16px fantasy";
    ctx.fillStyle = "black";
    ctx.fillText("Lives: "+lives, canvas.width-80, 20);
}

function collisionDetection(){

	 for(var c=0; c<brickColumCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status==1) {
            	 if(x +ballRadius > b.x && x-ballRadius < b.x+brickWidth && y +ballRadius> b.y && y-ballRadius < b.y+brickHeight){
            		beep.cloneNode().play();
            		dy=-dy;
            		score++;
            		b.status=0;
            		if (score==bricksNumber) {
            			gameStart=false;
            			gameRunning=false;
            			document.getElementById("overlay2").style.display="block";
            			
            		}
            	}
            }
        }
    }
}

function draw() {
	

	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	collisionDetection();
	drawScore();
	drawLives();
	if (x+dx>canvas.width-ballRadius||x+dx<ballRadius) {
		dx=-dx;
		
	}
	if (y+dy<ballRadius) {
		dy=-dy;
		
		
	}else if (y+dy>canvas.height-ballRadius-paddleHeight) {

		if (x>paddleX&&x<paddleX+paddleWidth) {
			dy=-dy;
			boom.play();
		}else if (y+dy>canvas.height-ballRadius){
			lives--;
			blip.play();
			gameRunning=false;
			if (lives==0) {

				gameRunning=false;
				gameStart=false;
				document.querySelector("#overlay2 .msg").innerHTML="You Lose!";
				document.getElementById("overlay2").style.display="block";
				//document.location.reload();
			}else{

				x= paddleX+paddleWidth/2;
				y= canvas.height-paddleHeight- ballRadius;

				dx=2;
				dy=-2;

				
				
			}
		}
	}

	if (rightPressed&& paddleX<canvas.width-paddleWidth) {
		paddleX+=7;
	}
	if (leftPressed&&paddleX>0) {
		paddleX-=7;
	}

	if (gameRunning) {
		x+=dx;
		y+=dy;
	}else{
		x= paddleX+paddleWidth/2;
		y= canvas.height-paddleHeight- ballRadius;

		dx=2;
		dy=-2;
		if (gameStart) {
		document.getElementById("tip").style.display="block";
		}

	}





}


