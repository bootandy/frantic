var ctx;
var width = 600;
var height = 600;
var shots;
var playerShip;
var invaderGroups;
var totalInvadersDestroyed = 0
var explosionCollection;
var starCollection;
var playerShotCollection;
var messageCollection
var powerUpCollection;
var asteroidCollection;
var totalTime = 1
var backgroundTime;
var level = 1;
var wave = 1; // more ugly duplicate data with level
var playerMove= 0;
var score = 0;
var showBackground = true;

var backImage = new Image();
backImage.src = 'images/back2.jpg';

window.onresize = doCanvasSize;

function doCanvasSize() {
	var canvas = document.getElementById('main');
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth
	
	widthScale = canvas.width/600;
	heightScale = canvas.height/600;

	ctx = canvas.getContext('2d');
	
	// If game over draw the instructions
	if (playerShip == null || playerShip.shieldTimer < 0) {
		drawInstructions();
	}
}

function initCanvas(){
	var canvas = document.getElementById('main');
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth
	doCanvasSize();
	backgroundTime = 500;
	
	drawInstructions();
//	startGame();
}

function initGameObjects() {
	playerShip = new PlayerShip();
	starCollection = new StarCollection();
	explosionCollection = new ExplosionCollection();
	playerShotCollection = new PlayerShotCollection();
	messageCollection = new MessageCollection();
	powerUpCollection = new PowerUpCollection();
	asteroidCollection = new AsteroidCollection();
	
	shots = new Array();
	invaderGroups = new Array();
	totalInvadersDestroyed = 0;
	
	score = 0;
	level = 1;
	wave = 1;
	totalTime = 1;
	backgroundTime = 500;
	
	update();
}

function update() {
	if (playerMove==2) {
		playerMove=0;
		totalTime++;
		updateLevel();
		moveAll();
		drawAll();
	}

	movePlayerShip();
	playerMove += 1;
	
	if (playerShip.shieldTimer > -50) {
		setTimeout('update()', 20)
	} else {
		endGame();
	}
}


function movePlayerShip() {
	playerShip.move();
}

function moveAll() {
	starCollection.move();
	explosionCollection.move();
	
    for(var i=0; i < shots.length; i++) {
        if (shots[i].move()) {
			shots.splice(i, 1);
			i--;
		}
    }
	
	for(var i=0; i < invaderGroups.length; i++) {
		if (invaderGroups[i].move()) {
			invaderGroups.splice(i, 1)
		}
    }
	asteroidCollection.move();
	messageCollection.move();
	playerShotCollection.move();
	powerUpCollection.move();
}

/**
 * draw notes:
 * Pre Speed cramming
 * FF (slowest)
 * crazy time change: last 2 groups to spawn=2
 * FF draw time ~ 640
 * comment out draw invader groups time ~ 320
 * comment out all draw except invader groups time ~ 460
 * comment out everything except fill Rect time ~ 100
 */
function drawAll() {
	ctx.fillStyle = '#000000';
	ctx.fillRect(0,0,width*widthScale,height*heightScale);
	
	if (showBackground) {
		var imgStart = (backImage.height - height * heightScale) - (backgroundTime % (backImage.height - height * heightScale));
		var widthMiddle = (width * widthScale - 800) / 2;
		ctx.drawImage(backImage, 0, imgStart, 800, height * heightScale, 0, 0, 800, height * heightScale);
	}

	ctx.save()
	ctx.scale(widthScale, heightScale)
	
	starCollection.draw();
	explosionCollection.draw();
	
	for(var i=0; i < invaderGroups.length; i++) {
        invaderGroups[i].draw();
    }
	
	for(var i=0; i < shots.length; i++) {
        shots[i].draw();
    }

	playerShotCollection.draw();
	playerShip.draw();
	messageCollection.draw();
	powerUpCollection.draw();

	asteroidCollection.draw();	
	
	ctx.restore();
	backgroundTime++;

	drawDash2();
}

function prettyPrintScore(){
	var scoreString = ''+score;
	while (scoreString.length < 6) {
		scoreString = '0'+scoreString
	}
	return scoreString;
}

function drawDash2() {
	// --------- draw score: --------- 
	ctx.strokeStyle = '#CCCCCC';
	ctx.font = 'bold 36px Courier ';
	
    ctx.strokeText( prettyPrintScore() , width*widthScale - 150, 50);
	
	ctx.fillStyle = '#CCCCCC';
	ctx.font = 'bold 20px Courier';
    ctx.fillText( 'Power up: ' + playerShip.powerUp.name() , 10, 50);

    ctx.fillText(  totalTime, 10, height*heightScale - 50);
//    ctx.fillText(  playerShip.timeOfInvadersShotRecentlyMessage, 10, height*heightScale - 100);
//	ctx.fillText(  playerShip.levelOfInvadersShotRecentlyMessage, 10, height*heightScale - 150);
//	ctx.fillText(  playerShip.invadersShotRecently, 10, height*heightScale - 200);
//	ctx.fillText(  playerShip.invadersShotRecentlyMax, 10, height*heightScale - 250);
	
	ctx.font = '12px Courier';

	
	// --------- draw kill rate: ---------
	var xBar = width*widthScale - 20;
	var yBar = height*heightScale - 400;
	ctx.strokeStyle = '#AAAAAA'
	
	ctx.save();
	ctx.translate( xBar-10, yBar-20)
	ctx.rotate(Math.PI/2+Math.PI);
	ctx.fillStyle = '#AAAAAA';
	ctx.fillText("Kill Rate", 0, 0);
	ctx.restore();
	
	ctx.strokeRect(xBar, yBar, 10, -100);
	ctx.fillStyle = '#FF0000';
	if (playerShip.invadersShotRecently >= playerShip.invadersShotRecentlyMax * 0.8) {
		ctx.fillStyle = '#FFFFFF';
	}
	var howLongToDraw = ( playerShip.invadersShotRecently / playerShip.invadersShotRecentlyMax ) * 100;
	ctx.fillRect(xBar, yBar, 10, -howLongToDraw);


	// --------- draw weapon power: ---------
	ctx.save();
	ctx.translate( width*widthScale - 50, height*heightScale - 50)
	ctx.rotate(Math.PI/2+Math.PI);
	ctx.fillStyle = '#AAAAAA';
	ctx.fillText("Weapons", 0, 0);
	ctx.restore();
	
	drawDashWeaponPower(width*widthScale - 20, height*heightScale - 50, 0, playerShip.firingMax1)
	drawDashWeaponPower(width*widthScale - 40, height*heightScale - 50, playerShip.firingMax1, playerShip.firingMax2)
	
	// --------- draw shields: ---------
	var xBar = width*widthScale - 20;
	var yBar = height*heightScale - 250;
	ctx.strokeStyle = '#AAAAAA'
	
	ctx.save();
	ctx.translate( xBar-10, yBar-20)
	ctx.rotate(Math.PI/2+Math.PI);
	ctx.fillStyle = '#AAAAAA';
	ctx.fillText("Shields", 0, 0);
	ctx.restore();
	
	ctx.strokeRect(xBar, yBar, 10, -100);
	ctx.fillStyle = '#FF0000';
	if (playerShip.invulnerable) {
		ctx.fillStyle = '#FFFFFF';
	}
	var howLongToDraw = ( playerShip.shieldTimer / playerShip.shieldMax ) * 100;
	ctx.fillRect(xBar, yBar, 10, -howLongToDraw);


	function drawDashWeaponPower(x, y, minForBar, maxForBar) {
		ctx.strokeStyle = '#AAAAAA'
		ctx.fillStyle = '#FF0000';
		if (playerShip.firing >= maxForBar) {
			ctx.fillStyle = '#FFFFFF';
		}
		
		if (playerShip.firing >= maxForBar) {
			var howLongToDraw = 100;
		}
		else if (playerShip.firing <= minForBar) {
			var howLongToDraw = 0;
		}
		else {
			var howLongToDraw = (playerShip.firing) % (maxForBar-minForBar+1) / (maxForBar-minForBar) * 100;
		}
		ctx.strokeRect(x, y, 5, -100);
		ctx.fillRect(x, y, 5, -howLongToDraw);
	
		ctx.beginPath();
		ctx.arc(x+2, y-110, 4, 0, Math.PI*2,true);
		ctx.closePath();
		ctx.stroke();
		
		if (playerShip.firing >= maxForBar) {
			ctx.fill();
		}
	}

}

function isOnScreen(x,y) {
	if (x > 0 && x < width && y > 0 && y < height) {
		return true;
	}
	return false;
}

keyDownInInstructions = function(event) {
  var keyCode; 
  if(event == null) {
    keyCode = window.event.keyCode; 
  }
  else {
    keyCode = event.keyCode; 
  }
  
  switch (keyCode) {
  	case 66:
  		showBackground = !showBackground;
		drawInstructions()
  		break;
  	default:
  		startGame();
  		break;
  }
}

keyDownInEndGame = function(event) {
	drawInstructions();
}

keyDownInGame = function(event) {
  var keyCode; 
  if(event == null) {
    keyCode = window.event.keyCode; 
  }
  else {
    keyCode = event.keyCode; 
  }
  
  switch(keyCode)
  {
    case 37:
       playerShip.dx = -1;
       break;
     
    case 38:
       playerShip.dy = -1;
       break; 
      
    case 39:
       playerShip.dx = 1;
       break; 
    
    case 40:
       	playerShip.dy = 1;
      	break;
		 
   	case 32:
		messageCollection.newMessage(playerShip.x - 50, playerShip.y - 40, 'Press Z or X to fire')
		break;
  	case 66:
  		showBackground = !showBackground;
		break;
	case 88:
		playerShip.fireForwards = true
		break;
	case 90:
		playerShip.fireSideways = true
		break;
	case 67:
		playerShip.fireForwards = true
		playerShip.fireSideways = true
		break;
    default: 
      break; 
  } 
}

document.onkeyup = function(event) {
  var keyCode; 
  if(event == null) {
    keyCode = window.event.keyCode; 
  }
  else {
    keyCode = event.keyCode; 
  }
 
  switch(keyCode)
  {
    case 37:
		if (playerShip.dx < 0) {
			playerShip.dx = 0
		}
		break;
    case 39:
		if (playerShip.dx > 0) {
			playerShip.dx = 0
		}
	    break; 
      
    case 38:
		if (playerShip.dy < 0) {
			playerShip.dy = 0
		}
		break;
    case 40:
        if (playerShip.dy > 0) {
			playerShip.dy = 0
		}
		break;	
	case 88:
		playerShip.fireForwards = false
		break;
	case 90:
		playerShip.fireSideways = false;
		break;
	case 67:
		playerShip.fireForwards = false
		playerShip.fireSideways = false
		break;
		
	default: 
      	break; 
  } 
 
  
}


function startGame(){
	initGameObjects();
	document.onkeydown = keyDownInGame;
}

function endGame(){
	ctx.beginPath();
	ctx.fillStyle = '#FFFFFF';
	ctx.font = '60px courier';
	ctx.fillText('Final score: '+prettyPrintScore(),  width*widthScale/2 - 300, height/2)
	ctx.font = '32px courier';
	ctx.fillText('Press any key to play again', width*widthScale/2 - 200, height/2+50)
	ctx.closePath();
	ctx.fill();

	document.onkeydown = keyDownInEndGame;
}


