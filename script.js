var myGamePiece;
var myBackground;
var myObstacleTop;
var myObstacleBottom;
var score = 0;
var gamestart = 0;
var timer;

function startGame() {
    myGamePiece = new component(30, 30, "bird.png", 125, 120);
	myBackground = new component(480, 320, "BirdBackground.png", 0, 0);
	myObstacleTop = new component(45, 320, "BirdPipeUp.png", 350, 200);
	myObstacleBottom = new component(45, 320, "BirdPipeDown.png", 350, 100); 	
	myObstacleTop2 = new component(45, 320, "BirdPipeUp.png", 690, 250);
	myObstacleBottom2 = new component(45, 320, "BirdPipeDown.png", 690, 150); 	
	//test = new component(5, 5, "Black.png", 350, 200);
	
    myGameArea.start();
	updateGameArea();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 320;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        //this.frameNo = 0;
        //this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        //clearInterval(this.interval);
		clearInterval(timer);
    }
}

function component(width, height, imageurl, x, y) {
    this.image = new Image();
    this.image.src = imageurl;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
		if (imageurl == "BirdPipeDown.png"){
			ctx.save();
			ctx.translate(this.x + this.width ,this.y);
			ctx.rotate(180*Math.PI/180);
			ctx.drawImage(this.image, 0, 0, this.width, this.height);
			ctx.restore();
		}
		else{
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
		
		
		if (imageurl == "BirdBackground.png"){
			ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
		}
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
		if (imageurl == "BirdBackground.png"){
			if (this.x == -(this.width)) {
                this.x = 0;
            }
		}		
    }
}


function CheckEdge(){
	var BirdTop = myGamePiece.y + 3;
	var BirdBottom = myGamePiece.y + (myGamePiece.height) - 5;
	
	if((BirdBottom <= 0) || (BirdTop >= 320)){
		myGameArea.stop();
	}	
}


function CrashCheck (PipeObject, PipeTwo){
	var BirdLeft = myGamePiece.x  + 7;
	var BirdRight = myGamePiece.x + (myGamePiece.width) - 7;
	var BirdTop = myGamePiece.y + 7;
	var BirdBottom = myGamePiece.y + (myGamePiece.height) - 7;
	
	var PipeObjectLeft = PipeObject.x;
	var PipeObjectRight = PipeObject.x + (PipeObject.width);
	var PipeObjectTop = PipeObject.y;
	var PipeObjectBottom = PipeObject.y + (PipeObject.height);
	
	var PipeTwoLeft = PipeTwo.x;
	var PipeTwoRight = PipeTwo.x + (PipeTwo.width);
	var PipeTwoTop = 0;
	var PipeTwoBottom = PipeTwo.y;	
	
	
	var crash = false
	
	if ((BirdBottom <  PipeObjectTop) ||
		(BirdTop >  PipeObjectBottom) ||
		(BirdRight <  PipeObjectLeft) ||
		(BirdLeft >  PipeObjectRight)) {
		crash = false;
	}
	else{
		return true;
	}
	
	if ((BirdBottom <  PipeTwoTop) ||
		(BirdTop >  PipeTwoBottom) ||
		(BirdRight <  PipeTwoLeft) ||
		(BirdLeft >  PipeTwoRight)) {
		crash = false;
	}

	else{
		return true;
	}
	
	return false;
}

function PipeUpdate(choice){
	var random = Math.floor(Math.random() * 220) + 100;
	if(choice == 1){
		myObstacleTop = new component(45, 320, "BirdPipeUp.png", 610, random);
		myObstacleBottom = new component(45, 320, "BirdPipeDown.png", 610, random-100);
	}
	else if (choice == 2){
		myObstacleTop2 = new component(45, 320, "BirdPipeUp.png", 610, random);
		myObstacleBottom2 = new component(45, 320, "BirdPipeDown.png", 610, random-100);	
	}
}

function BirdSpeed(){
	if(myGamePiece.speedY == 0){
		myGamePiece.image.src = "bird.png";
	}
	else if(myGamePiece.speedY > 0){
		myGamePiece.image.src = "BirdDown.png";
	}
	else if(myGamePiece.speedY < 0){
		myGamePiece.image.src = "birdup.png";
	}
	
	
	if((myGamePiece.speedY + 0.2) > 6.5) {
		myGamePiece.speedY = 6.5;
	}
	else{
		myGamePiece.speedY += 0.2;
	}
}

function updateGameArea() {
	
	CheckEdge();	
	if (CrashCheck(myObstacleTop, myObstacleBottom)) {
       myGameArea.stop();
    }
	if (CrashCheck(myObstacleTop2, myObstacleBottom2)) {
       myGameArea.stop();
    } 

	
	if (myObstacleTop.x + myObstacleTop.width  <= 0){
		PipeUpdate(1);		
	}
	else if (myObstacleTop2.x + myObstacleTop2.width  <= 0){
		PipeUpdate(2);		
	}

	
	//Background Move
    myGameArea.clear();
	myBackground.speedX = -1;
	myBackground.newPos();
	myBackground.update();

	//Bird Change
	BirdSpeed();
	myGamePiece.newPos();
    myGamePiece.update();

	//First Set of Pipe________________________________________________________
	myObstacleTop.speedX = -2;
	myObstacleTop.newPos();
	myObstacleTop.update();

	myObstacleBottom.speedX = -2;
	myObstacleBottom.newPos();
	myObstacleBottom.update();

	//Second Set of Pipe________________________________________________________
	myObstacleTop2.speedX = -2;
	myObstacleTop2.newPos();
	myObstacleTop2.update();

	myObstacleBottom2.speedX = -2;
	myObstacleBottom2.newPos();
	myObstacleBottom2.update();	
	
	if (gamestart == 1){
	ctx.font = "30px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Score: " + Math.floor(score/10),10,50); 
	score += 1;
	}
	
	if (gamestart == 0){
		ctx.globalAlpha=0.5;
		ctx.fillStyle="grey";
		ctx.fillRect(0,0,480,320); 
		ctx.font = "30px Arial";
		ctx.fillText("Click Game to Start",110,160);
		ctx.globalAlpha=1;
	}
}

function move(dir) {
	
	if (gamestart == 0){
		timer = setInterval(updateGameArea, 20);
		gamestart = 1;
	}
	else {
		if ((myGamePiece.speedY - 6) < -6.5){
			myGamePiece.speedY = -6
		}
		else{
			myGamePiece.speedY -= 6;
		}
	}
}
