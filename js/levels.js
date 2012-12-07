// ----------------------- START deploy & move functions ----------------------
emptyFunc = function(i) { return 0 }
flatFunc = function(i) {
	return (i+30)/4.0;
}
flatFuncBackwards = function(i) {
	return -flatFunc(i);
}
flatFuncDouble = function(i) {
	return flatFunc(i*2);
}
flatFuncDoubleBackwards = function(i) {
	return -flatFuncDouble(i);
}

littleSin = function(i) {
	return Math.sin((i/100)*Math.PI*2) * 3 ;
}
littleSinBackwards = function(i) {
	return -littleSin(i)
}
littleCos = function(i) {
	return Math.sin((i/100)*Math.PI*2 + Math.PI/2) * 3;
}
littleCosBackwards = function(i) {
	return -littleCos(i)
}
bigSin = function(i) {
	return littleSin(i) * 2;
}
bigCos = function(i) {
	return littleCos(i) * 2;
}
halfBigCos = function(i) {
	return bigCos(i/2);
}
halfBigSin = function(i) {
	return bigSin(i/2);
}
littleSinPlusConstant = function(i) {
	return littleSin(i) + 20; 
}

// ----------- START move only functions ----------------
tinyCos = function(i) {
	return Math.sin((i/100)*Math.PI*2 + Math.PI/2) * 2;
}
tinyCosBackwards = function(i) {
	return -tinyCos(i)
}
dropOnPlayer = function(i,x,y) {
	var hypotenuse = Math.sqrt( (playerShip.x - x)*(playerShip.x - x) + (playerShip.y - y)*(playerShip.y - y) )

	var dx = (playerShip.x - x) * 6 / hypotenuse
	var dy = (playerShip.y - y) * 6 / hypotenuse
	return [dx, dy, 0, -0.00001]
}

lobDropOnPlayer = function(i, x, y){
	return lobDropOnTarget(i, x, y, playerShip.x, playerShip.y)
}

crossOverLobDrop = function(i, x, y){ 
	targetX = width - x
	return lobDropOnTarget(i, x, y, targetX, height)
}

lobDropMiddle = function(i, x, y){
	return lobDropOnTarget(i, x, y, width/2, height)
}

lobDropOnTarget = function(i, x, y, targetX, targetY){
	if (targetX == x) {
		targetX--
	}
	if (targetY == y) {
		targetY--
	}
	var hypotenuse = Math.sqrt((targetX - x) * (targetX - x) + (targetY - y) * (targetY - y))
	
	var dx = (targetX - x) * 8 / hypotenuse
	var dy = (targetY - y) * 8 / hypotenuse
	
	var stepsToHit = (targetX - x) / dx
	var totalY = (targetY - y);
	
	var ddy = (totalY * 8) / (stepsToHit * (stepsToHit + 1)/.5 )
	
	return [dx, -dy, 0, ddy]
}
// ----------------------- END deploy & move functions ----------------------

// ----------------------- START complex move functions ----------------------

standStill = function(i,x,y) {
	return [0,0]
}
waveySlowDrop = function(i,x,y){
	return[ littleCos(i), 4 ];
} 
waveyThenRandomDropOnPlayer = function(i, x, y){
	if ((i < 100) || (Math.random() > 0.01)) {
		return [littleCos(i), 0]
	} else {
		return lobDropOnPlayer(i, x, y)
	} 
}
waveyThenDrop = function(i, x, y){
	if (i < 150) {
		return [littleCos(i), 0]
	} else {
		return [0, 0, 0.01 - (Math.random()*0.02), 0.15]
	} 
}
helixRandomDrop = function(i,x,y) {
	if ((i < 120) || (Math.random() > 0.01)) {
		return [littleCos((y + i) ), 0]
	} else {
		return [0, 0, 0.02 - (Math.random()*0.04), 0.15]
	} 
}

waveyThenLobDropOnPlayer = function(i, x, y){
	if ((i > 100) && (Math.random() < 0.02)) {
		return lobDropOnPlayer(i,x,y)
	}
	return [littleCos(i), 0]
}
waveyWalkLeft = function(i, x, y) {
	return [ littleCos(i) - 1.5, 0]
}
waveyWalkRight = function(i, x, y) {
	return [ tinyCos(i) + 1.5, 0]
}
walkLeftThenDrop = function(i, x, y) {
	if (x > 20) {
		return [-6, 0]
	} else {
		return dropOnPlayer(i,x,y);
	}
}
walkRightThenDrop = function(i, x, y) {
	if (x < width - 20) {
		return [6, 0]
	} else {
		return dropOnPlayer(i,x,y);
	}
}
walkAlongBottom = function(i,x,y) {
	if (y > height - 20) {
		return [6, 0];
	} else if (x > 20) {
		return [-4, 4];
	} else {
		return [0, 6];
	}
}

waitThenDropOnPlayer = function(i, x, y) {
	if (i < 100) {
		return [0,0]
	} else {
		return dropOnPlayer(i,x,y)
	}
} 
waitThenRandomLobDropOnPlayer = function(i, x, y) {
	if (i < 50) {
		return [0,0]
	} else if (Math.random() < 0.002) {
		return lobDropOnPlayer(i,x,y)
	}
	return [0,0]
} 
waitThenLobDropOnPlayer = function(i, x, y) {
	if (i < 100) {
		return [0,0]
	} else {
		return lobDropOnPlayer(i,x,y)
	}
} 
// ----------------------- END complex move functions ----------------------


newWorstInvader = function (x, y, color, moveFunc) {
	return new Invader(x,y, 10, 10, color, 1, getRandomShot, 0.03, moveFunc )
}
newShootDownInvader = function (x, y, color, moveFunc) {
	return new Invader(x,y, 15, 20, color,  0, getDownShot, 0.03, moveFunc)
}

newRandomDownLobberInvader = function (x, y, color, moveFunc) {
	return new Invader(x,y, 15, 20, color, 2, getLobbedRandomDownShot, 0.03, moveFunc )
}	
newRandomDownInvader = function (x, y, color, moveFunc) {
	return new Invader(x,y, 10, 10, color, 8, getRandomDownShot, 0.04, moveFunc )
}	
newRandomLobberInvader = function (x, y, color, moveFunc) {
	return new Invader(x,y, 15, 20, color, 4, getLobbedRandomShot, 0.04, moveFunc )
}

newAcurateInvader = function (x, y, color, moveFunc) {
	return new Invader(x,y, 15, 20, color, 5, getLobbedAccurateShot, 0.01, moveFunc )
}
newAcurateLobberInvader = function (x, y, color, moveFunc) {
	return new Invader(x,y, 20, 20, color, 6, getAccurateShot, 0.02, moveFunc )
}

newParachuteFiringInvader = function (x, y, color, moveFunc) {
	return new Invader(x,y, 25, 30, color, 7, getLobbedParachuteShot, 0.008, moveFunc )
}
newCircleFiringInvader = function (x, y, color, moveFunc) {
	return new Invader(x,y, 15, 30, color, 3, getLobbedCircleShot, 0.005, moveFunc )
}	

 
function updateLevel(){

	switch (totalTime) {
		case parseInt(11*level):
			new InvaderGroup(3*width/4, -20, blue, newWorstInvader, 6, emptyFunc, flatFunc, helixRandomDrop);
			new InvaderGroup(1*width/4, -20, blue, newWorstInvader, 6, emptyFunc, flatFunc, helixRandomDrop);
			break;
		case parseInt(200*level):
			new InvaderGroup(width/2, -100, yellow, newRandomDownLobberInvader, 6, bigCos, littleSinPlusConstant, waveyThenLobDropOnPlayer);
			break;
		case parseInt(350*level):
			new InvaderGroup(width+20, 70, blue, newRandomDownInvader, 5, flatFuncDoubleBackwards, littleCos, helixRandomDrop);
			break;
		case parseInt(450*level):
			new InvaderGroup(-20, 120, yellow, newCircleFiringInvader, 5, flatFuncDouble, bigCos,  waveySlowDrop);
			break
		case parseInt(550*level):
			new InvaderGroup(width, -50, blue, newParachuteFiringInvader, 5, flatFuncDoubleBackwards, littleSin, waveySlowDrop);
			break;
		case parseInt(700*level):
			new InvaderGroup(width+20, 50, green, newShootDownInvader, 5, flatFuncDoubleBackwards, emptyFunc, waveySlowDrop);
			new InvaderGroup(-20, 100, blue, newWorstInvader, 5, flatFuncDouble, emptyFunc, waveySlowDrop);
			break;
		case parseInt(800*level):
			new InvaderGroup(width+20, 50, green, newRandomLobberInvader, 10, flatFuncDoubleBackwards, flatFunc, walkAlongBottom );
			break;
		case parseInt(900*level):
			new InvaderGroup(-20, 130, yellow, newShootDownInvader, 3, flatFuncDouble, littleCos, waveyThenDrop);
			break;
		case parseInt(950*level):
			new InvaderGroup(-20, 50, green, newRandomDownLobberInvader, 5, flatFuncDouble, emptyFunc, crossOverLobDrop);
			break;
		case parseInt(1050*level):
			new InvaderGroup(-20, 150, yellow, newRandomLobberInvader, 10, flatFuncDouble, littleSin, waveyThenLobDropOnPlayer);
			new InvaderGroup(width+20, 50, blue, newRandomLobberInvader, 10, flatFuncDoubleBackwards, littleSinBackwards, waveyThenLobDropOnPlayer);
			break;
		case parseInt(1100*level):
			new InvaderGroup(-20, 200, green, newWorstInvader, 10, flatFunc, emptyFunc, crossOverLobDrop);
			new InvaderGroup(width+20, 200, green, newWorstInvader, 10, flatFuncBackwards, emptyFunc, crossOverLobDrop);
			break;
		case parseInt(1250*level):
			new InvaderGroup(100, -20, yellow, newRandomDownInvader, 5, littleCosBackwards, flatFunc, crossOverLobDrop);
			break;
		case parseInt(1290*level):
			new InvaderGroup(width-100, -20, yellow, newRandomDownInvader, 5, littleCos, flatFunc, crossOverLobDrop);
			break;
		case parseInt(1400*level):
			new InvaderGroup(-20, 90,  blue, newRandomDownLobberInvader, 5, flatFuncDouble, emptyFunc, waitThenRandomLobDropOnPlayer);
			new InvaderGroup(-20, 150, blue, newRandomDownLobberInvader, 10, flatFuncDouble, emptyFunc, waitThenLobDropOnPlayer );
			break;
		case parseInt(1500*level):
			new InvaderGroup(width+20, 50, yellow, newRandomLobberInvader, 10, flatFuncDoubleBackwards, flatFunc, walkAlongBottom );
			break;
		case parseInt(1650*level):
			new InvaderGroup(-20, 20, green, newAcurateInvader, 7, littleSinBackwards, flatFunc, waveyWalkRight);
			new InvaderGroup(width+20, 20, green, newAcurateInvader, 7, littleSin, flatFunc, waveyWalkLeft);
			break;
		case parseInt(1750*level):
			new InvaderGroup(width+20, 120, yellow, newWorstInvader, 5, flatFuncBackwards, emptyFunc, crossOverLobDrop);
			new InvaderGroup(-20, 120, blue, newWorstInvader, 5, flatFunc, emptyFunc, crossOverLobDrop);
			break;
		case parseInt(1900*level):
			new InvaderGroup(width+20, 20, green, newParachuteFiringInvader, 5, flatFuncDoubleBackwards, emptyFunc, waitThenDropOnPlayer);
			break;
		case parseInt(1950*level):
			new InvaderGroup(-20, 190, green, newWorstInvader, 4, flatFuncDouble, emptyFunc, lobDropMiddle);
			break;
		case parseInt(2050*level):
			new InvaderGroup(width+20, -40, blue, newParachuteFiringInvader, 5, flatFuncDoubleBackwards, tinyCos, waveySlowDrop);
			break;
		case parseInt(2100*level):
			new InvaderGroup(width+20, 80, yellow, newRandomDownInvader, 5, flatFuncDoubleBackwards, emptyFunc, waveyThenRandomDropOnPlayer);
			new InvaderGroup(width+20, 60, green, newRandomDownInvader, 5, flatFuncDoubleBackwards, emptyFunc, waveyThenRandomDropOnPlayer);
			break;
		case parseInt(2250*level):
			new InvaderGroup(width+20, 40, blue, newWorstInvader, 3, flatFuncDoubleBackwards, tinyCos, helixRandomDrop);
			break;
		case parseInt(2350*level):
			new InvaderGroup(3*width/4, -20, yellow, newCircleFiringInvader, 8, littleCos, littleSinPlusConstant, waveyThenLobDropOnPlayer);
			new InvaderGroup(1*width/4, -20, blue, newCircleFiringInvader, 8, littleCos, littleSinPlusConstant, waveyThenLobDropOnPlayer);
			break;
		case parseInt(2580*level):
			new InvaderGroup(width+20, 20, green, newWorstInvader, 5, flatFuncBackwards, flatFunc, walkLeftThenDrop);
			new InvaderGroup(-20, 20, green, newWorstInvader, 5, flatFunc, flatFunc, walkRightThenDrop);
			break;
		case parseInt(2760*level):
			new InvaderGroup(1*width/4, -20, blue, newAcurateInvader, 5, littleCos, flatFunc, waveyThenRandomDropOnPlayer);
			new InvaderGroup(3*width/4, -20, yellow, newAcurateInvader, 5, littleCosBackwards, flatFunc, waveyThenRandomDropOnPlayer);
			new InvaderGroup(width+20, -20, green, newParachuteFiringInvader, 5, flatFuncDoubleBackwards, emptyFunc, waveySlowDrop);
			break;
		case parseInt(3000*level):
 			new InvaderGroup(-20, 120, yellow, newAcurateLobberInvader, 5, flatFuncDouble, tinyCos, waveyThenLobDropOnPlayer);
			new InvaderGroup(-20, 60, blue, newAcurateLobberInvader, 5, flatFuncDouble, tinyCosBackwards, waveyThenLobDropOnPlayer);
			break;
		case parseInt(3100*level):
			new InvaderGroup(-20, 150, yellow, newWorstInvader, 5, flatFuncDouble, tinyCos, walkAlongBottom );
			break;
		case parseInt(3200*level):
			new InvaderGroup(width+20, 20, blue, newAcurateInvader, 5, flatFuncDoubleBackwards, flatFunc, walkLeftThenDrop);
			new InvaderGroup(-20, 20, green, newAcurateInvader, 5, flatFuncDouble, flatFunc, walkRightThenDrop);
			break;
		case parseInt(3350*level):
			new InvaderGroup(-20, 120, blue, newRandomDownInvader, 3, flatFuncDouble, emptyFunc, crossOverLobDrop);
			break;
		case parseInt(3500*level):
			new InvaderGroup(width/2, -20, yellow, newAcurateLobberInvader, 6, emptyFunc, flatFunc, helixRandomDrop);
			break;
		case parseInt(3600*level):
			new InvaderGroup(3*width/4, -20, green, newAcurateInvader, 3, emptyFunc, flatFunc, helixRandomDrop);
			new InvaderGroup(1*width/4, -20, blue,  newAcurateInvader, 3, emptyFunc, flatFunc, helixRandomDrop);
			break;
		case parseInt(3800*level):
			new InvaderGroup(width+20, 20, blue, newParachuteFiringInvader, 5, flatFuncDoubleBackwards, emptyFunc, waitThenDropOnPlayer );
			break;
		case parseInt(3850*level):
			new InvaderGroup(width+20, 100, yellow, newRandomLobberInvader, 5, flatFuncDoubleBackwards, emptyFunc, helixRandomDrop );
			new InvaderGroup(width+20, 150, yellow, newRandomLobberInvader, 5, flatFuncDoubleBackwards, emptyFunc, helixRandomDrop );
			break;
			
		case parseInt(4140*level): //wrap round
			totalTime = 1;
			messageCollection.newMessage(100, height/2, "Wave "+wave+" Complete... lets step it up");
			playerShip.timeOfInvadersShotRecentlyMessage = 0;
			level = level - 0.1;
			wave = wave + 1;
			if (level <= 0) {
				messageCollection.newMessage(100, height/3, "Should not happen - you've beaten this game");
			}
			break;
		
	}
	
}
//setTimeout('totalTime=190;', 100);

	