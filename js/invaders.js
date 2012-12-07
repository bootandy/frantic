
// --------------------------- BEGIN shot functions ---------------------------


getLobbedCircleShot = function (x,y, color) {
	
	var bit = 0.0;
	var bitInc =  Math.PI/2 / 2;
	
	while (bit <= Math.PI/2) {
		
		var o = Math.sin(bit) ;
		var a = Math.cos(bit) ;
		bit += bitInc;
		
		new Shot(x, y, o, a, 0.35,  2)
		new Shot(x, y, -o, a, 0.35,  2)
		new Shot(x, y, -o, -a, 0.35,  2)
		new Shot(x, y, o, -a, 0.35,  2)
	}
}

getLobbedParachuteShot = function (x,y, color) {
	
	var bit = 0.0;
	var bitInc =  Math.PI/2 / 6;
	
	while (bit <= Math.PI/2 - 0.8) {
		
		var o = Math.sin(bit) * 1;
		var a = Math.cos(bit) * 1;
		bit += bitInc;
		
		new Shot(x, y, -o, -a, 0.3,  2)
		new Shot(x, y, o, -a, 0.3,  2)
	}
}

getRandomDownShot = function (x, y, color) {
	var dx = Math.random() *9  - 4.5
	var dy = Math.random() *3 + 6
	new Shot(x, y, dx, dy, 0,  1)
}
getRandomShot = function (x, y, color) {
	var theta = Math.random() * Math.PI * 2
	var dx = Math.sin(theta) * 6
	var dy = Math.cos(theta) * 6
	new Shot(x, y, dx, dy, 0, 6)
}
getAccurateShot = function (x, y, color) {
	var hypotenuse = Math.sqrt( (playerShip.x - x)*(playerShip.x - x) + (playerShip.y - y)*(playerShip.y - y) )

	var dx = (playerShip.x - x) * 8 / hypotenuse
	var dy = (playerShip.y - y) * 8 / hypotenuse
	new Shot(x, y, dx, dy, 0, 0)
}
getDownShot = function (x, y, color) {
	var dx = 0
	var dy = 10
	new Shot(x, y, dx, dy, 0, 4)
}
getLobbedRandomDownShot = function (x, y, color) {
	var dx = Math.random() *9  - 3.5
	var dy = -(Math.random() *3 + 3)
	new Shot(x, y, dx, dy, 0.25,  0)
}
getLobbedRandomShot = function (x, y, color) {
	var theta = Math.random() * Math.PI * 2
	var dx = Math.sin(theta) * 1
	var dy = Math.cos(theta) * 1
	var dd = -0.2
	if (dy < 0) {
		dd = 0.2
	}
	new Shot(x, y, dx, dy, dd, 3)
}
getLobbedAccurateShot = function (x, y, color) {
	var hypotenuse = Math.sqrt( (playerShip.x - x)*(playerShip.x - x) + (playerShip.y - y)*(playerShip.y - y) )
	
	var dx = (playerShip.x - x) *8 / hypotenuse
	var dy = (playerShip.y - y) *8 / hypotenuse
	
	var stepsToHit = (playerShip.x - x) / dx
	var totalY = (playerShip.y - y);
	
	var dd = (totalY*8) / (stepsToHit * (stepsToHit+1)/.5)
	new Shot(x, y, dx, -dy, dd, 5)
}
// --------------------------- END shot functions ---------------------------

 var blue = '#AAAAFF'
 var yellow = '#FFFF00'
 var green = '#00FF00'


// pre load images & sound to stop the game pausing when it needs them
invaderImage = new Image(); // 9 invaders each one size: 20 X 24 
invaderImage.src = 'images/invaders.png';
bangs = new Array();
bangs[0] = new Audio("sounds/bang2.ogg");
bangs[1] = new Audio("sounds/bang1.ogg");
bangs[2] = new Audio("sounds/bang3.ogg");
bangs[0].pause();
bangs[1].pause();
bangs[2].pause();

function Invader(x, y, health, points, color, index, shotFunc, shotProbability, moveFunc) {
	var dx = 0;
	var dy = 0;
	var ddx = 0;
	var ddy = 0;
	var flashWhite = false;

	
	this.draw = function() {
		if (flashWhite) {
			ctx.fillStyle = '#FFFFFF';
			ctx.beginPath();
			ctx.arc(x, y, 15, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.fill();
			flashWhite = false;
		}
		ctx.drawImage(invaderImage, 20*index, 0, 20, 24, x - 10, y - 12, 20, 24);
	}
	
	this.deployMove = function(xNudge, yNudge) {
		x += xNudge;
		y += yNudge;
	}
		
	this.move = function(setupTime) {
		// If we are not in 'parabolic' flight then we are still calling the move function
		if (ddx == 0 && ddy == 0) {
			
			if (setupTime > 200) { // If we are old
				if (y > height) { // Clear us off the board
					return true;
				} 
				moveData = lobDropMiddle(setupTime, x, y) // or lob drop us on the middle
			} else {
				moveData = moveFunc(setupTime, x, y)
			}
			
			dx = moveData[0]
			dy = moveData[1]
			
			if (moveData.length == 4) { //If we got a parabolic flight order
				ddx = moveData[2]
				ddy = moveData[3]
			}
		}
		x = x + dx;
		y = y + dy;
		dy = Math.min(dy + ddy, 20);
		dx = Math.min(dx + ddx, 20);
		
		
		if ( x < 0 && (ddx < 0 || setupTime > 200)) {
			return true;
		}
		if ( y < 0 && (ddy < 0 || setupTime > 200)) {
			return true;
		}
		if ( x > width && (ddx > 0  || setupTime > 200)) {
			return true;
		}
		if ( y > height && (ddy > 0 || setupTime > 200)) {
			return true;
		} 
		return false;
	}
	
	this.shoot = function(nudgeUpForLessInvaders) {
		if (Math.random() < shotProbability / level) {
			shotFunc(x, y, color)
		}
	}
	
	this.imHit = function(byX, byY, margin) {
		if (byX - margin <= x && byX + margin >= x && byY - margin <= y && byY + margin >= y ) {
			
			if (this.imHitAmIDead(10)) {
				return "invader-dead";
			}
			// ugly Tri-state return - we most tell the playerShotCollection to remove the shot 
			// but not have the invader group remove the invader
			return "shot-hit";
		}
		return ""
	}
	
	this.imLaserHit = function(byX, byY, margin, damage) {
		if (byX - margin <= x && byX + margin >= x && byY > y) {
			return this.imHitAmIDead(damage);
		}
		return false
	}
	
	this.imHitAmIDead = function(damage) {
		health -= damage;
		flashWhite = true;

		if (health <= 0) {
			explosionCollection.newExplosion(x, y)
			messageCollection.newScore(x, y, points)
			totalInvadersDestroyed++;
			playerShip.playerShotInvader(x, y);
			bangs[Math.abs(parseInt(y)) % 3].play();
			return true;
		}
		return false;
	}
}
/**
 * 
 * @param {Int} x - starting x for deployment 
 * @param {Int} y - starting y for deployment
 * @param {String} color - Color of invaders and their bombs
 * @param {Object} newInvaderFunc - Called when we should create a new invader in this group
 * @param {Object} deployOn - We count setupTime from -50 -> 0 when we hit (n % deployOn == 0) we create a new Invader 
 * @param {Object} deployXFunc - How x increases as the setupTime increments
 * @param {Object} deployYFunc - How y increases as the setupTime increments
 * @param {Object} moveFunc - Function to move the invader once freed from the deployent phase. (setupTime > 0)
 */
function InvaderGroup(x, y, color, newInvaderFunc, deployOn, deployXFunc, deployYFunc, moveFunc) {
	var finishSetupTime = 0;
	var setupTime = -50;
	var invaders = new Array();
	var oneHasEscaped = false;
	
	for (var i = 0; i <= 50; i++) {
		if (i % deployOn == 0) {
			invaders.push(newInvaderFunc(x, y, color, moveFunc))
		}
	}

	this.move = function() {
		if (setupTime <= finishSetupTime) {
			for (var i = 0; i < invaders.length; i++) {
				x2 = deployXFunc((i) * 100.0 / (invaders.length) ) / 5;
				y2 = deployYFunc((i) * 100.0 / (invaders.length) ) / 5; 
				invaders[i].deployMove(x2, y2);
			}
		}
		else {
			for (var i = 0; i < invaders.length; i++) {
				if(invaders[i].move(setupTime)) {
					invaders.splice(i, 1);
					oneHasEscaped = true;
				}
			}
		}
		for (var i = 0; i < invaders.length; i++) {
			invaders[i].shoot( 1/invaders.length )
		}
		setupTime++;
		if (invaders.length == 0 && setupTime >= 0) {
			return true;
		}
	}
	
	this.draw = function() {
		for (var i = 0; i < invaders.length; i++) {
			var invader = invaders[i];
			invader.draw();
		}
   	}
	
	this.imHit = function(byX, byY, margin) {
		for(var j=0; j < invaders.length; j++) {
			invader = invaders[j];
			var whatHappenedToShot = invader.imHit(byX, byY, margin);
			if (whatHappenedToShot == "invader-dead") {
				invaders.splice(j, 1)
				this.areWeAllShotDown(byX, byY);
				return true;
			}
			if (whatHappenedToShot == "shot-hit") {
				return true;
			}
		}
		return null;
	}	
	
	this.imLaserHit = function(byX, byY, margin, damage) {
		for(var j=0; j < invaders.length; j++) {
			invader = invaders[j];
			if (invader.imLaserHit(byX, byY, margin, damage)) {
				invaders.splice(j, 1)
				this.areWeAllShotDown(byX, byY - 50);
			}
		}
		return null;
	}
	
	this.areWeAllShotDown = function(x, y) {
		if (invaders.length == 0 && !oneHasEscaped) {
			messageCollection.newScore(x, y - 30, 50)
		}
	} 
	
	this.getColor = function() {
		return color
	}
	
	this.getTotalInvaders = function() {
		return invaders.length;
	}
	
	invaderGroups.push(this);
}

var shotImage = new Image(); // 9 invaders each one size: 20 X 24 
shotImage.src = 'images/shots2.png';

function Shot(x,y,dx,dy, dd, index) {
 

//	if (dd == 0) { //If non-accelerating shot
//		this.drawWidth = 5
//		this.drawHeight = 5
//	} else {
//		this.drawWidth = 2
//		this.drawHeight = 8
//	}
	
    this.move = function() {
		dx=dx;
		dy=dy+dd;
		
        x+=dx ;
        y+=dy ;
        if(x <= 0 || x >= width) {
            return true;
        }
        if(y <= 0 || y >= height) {
            return true;
        }
		
		return false;
    }

	this.draw = function() {
		if (isOnScreen(x, y)) {
//		    ctx.beginPath();	
//		    ctx.fillStyle = color;
//			ctx.rect(x - this.drawWidth / 2, y - this.drawHeight / 2, this.drawWidth, this.drawHeight)
//		    ctx.closePath();
//		    ctx.fill();
			ctx.drawImage(shotImage, 10*index, 0, 10, 12, x - 5, y - 6, 10, 12);

		}
	}
	
	this.imHit = function(byX, byY) {
		if (byX - 20 <= x && byX + 20 >= x && byY - 20 <= y && byY + 20 >= y) {
			return 1
		}
		return null
	}
	shots.push(this);
}

