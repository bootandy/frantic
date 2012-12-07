 

function PlayerShip(){
	this.x = width/2;
	this.y = height - 50;
	this.dx = 0;
	this.dy = 0;
	this.firing = 1;
	this.fireSideways = false;
	this.fireForwards = false;
	this.shieldTimer = 1000;
	this.invadersShotRecently = 0;
	this.invadersShotRecentlyMax = 1000;
	this.timeOfInvadersShotRecentlyMessage = 0;
	this.levelOfInvadersShotRecentlyMessage = 0;
	this.powerUp = new NoPowerup();
	this.moveMul = 4;
	this.invulnerable = 0;
	
	this.shieldMax = 1000;
	this.firingMax1 = 50;
	this.firingMax2 = 100;

	playerImage =  new Image();
	playerImage.src = 'images/ship.png';
	playerImageWidth = 48;
	playerImageHeight = 60;
	shieldsImage =  new Image();
	shieldsImage.src = 'images/shields.png';
	sheildsImageWidth = 25;
	sheildsImageHeight = 12;

	var soundImHit = new Audio("sounds/shield2.ogg");

    this.move = function() {
		if (this.shieldTimer < 0) {
			this.shieldTimer = this.shieldTimer - 1;
			return;
		}
		
    	this.x+=this.dx*this.moveMul;
        if (this.x < 20) {
			this.x = 20;
		} 
		else if (this.x > width-20) {
			this.x = width-20;
		}
		
        this.y+=this.dy*this.moveMul;
        if (this.y < 20) {
			this.y = 20;
		} 
		else if (this.y > height-20) {
			this.y = height-20;
		}
		
		if (this.firing == this.firingMax2 && (this.fireSideways || this.fireForwards) ) {
			this.firing = -80;
			playerShotCollection.laserFire(this.x,this.y);
			playerShotCollection.superFire(this.x,this.y, 6);
		}
		else if (this.firing >= this.firingMax1 && (this.fireSideways || this.fireForwards) ) {
			this.firing = 2;
			playerShotCollection.superFire(this.x,this.y, 6);
		}
		else if (this.firing > 14) {
			
			if (this.fireForwards) {
				this.firing = 2;
				playerShotCollection.fireForwards(this.x, this.y);
			}
			if (this.fireSideways) {
				this.firing = 2;
				playerShotCollection.fireDiagonal(this.x, this.y);
			}
			this.checkFire();
			if (this.fireSideways || this.fireForwards) {
				this.powerUp.fire(this.fireForwards, this.fireSideways);
			}
			
		}
		
		if (this.firing != this.firingMax2) {
			this.firing++;
		}
		
		if (this.shieldTimer >= 0 && this.shieldTimer < this.shieldMax) {
			this.shieldTimer += 1;
		}
		if (this.invulnerable > 0) {
			this.invulnerable--;
		}
		
		if (this.invadersShotRecently > 0) {
			this.invadersShotRecently -= 4;
		}
		
		this.didICrash();
    }
	
	
	this.checkFire = function() {
		// slow down ship if using all guns
		if (this.fireForwards && playerShip.fireSideways) {
			this.moveMul = 1;
		} else {
			this.moveMul = 4;
		}
	}
	
	this.fillShields = function(){
		if (this.shieldTimer >= 0) {
			this.shieldTimer = this.shieldMax;
			messageCollection.newMessage(playerShip.x - 30, playerShip.y + 40, 'Full shields');
		}
	}
	
  
	// ship collision detection:
	this.didICrash = function() {
		
		for (var i = 0; i < shots.length; i++) {
			var colorHitBy = shots[i].imHit(this.x,this.y)
			if (colorHitBy != null) {
				this.imHit(colorHitBy)
				shots.splice(i, 1)
				i--
			}
		}
		// Did we get a hit?
		for(var i=0; i < invaderGroups.length; i++) {
	        if (invaderGroups[i].imHit(this.x, this.y, 40)) {
				this.imHit(invaderGroups[i].getColor(), false)
			}
	    }
	
		// if you hit an asteroid you are automatically dead 
		if (asteroidCollection.imHit(this.x, this.y, 15)) {
			this.shieldTimer = -1;
			this.powerUp = new NoPowerup();
			this.imHit('FFFFFF');
		}
		
		this.imHit = function(color) {
			if (this.invulnerable > 0) {
				return;
			}
			this.invulnerable = 5;
			 
			soundImHit.play();
			 
			// if powerup = loose powerup & survive
			if (this.powerUp.name() != 'None') {
				messageCollection.newMessage(playerShip.x - 40, playerShip.y + 40, 'Power up Lost')
				this.powerUp = new NoPowerup();
				return;
			}
			
			//shields = survive
			this.shieldTimer = this.shieldTimer - this.shieldMax/4;
			if (this.shieldTimer >= 0) {
				return;
			}
			
			// else = dead
			this.shieldTimer = -1;
			explosionCollection.newExplosion(this.x, this.y);
			explosionCollection.newExplosion(this.x+15, this.y+15);
			explosionCollection.newExplosion(this.x+15, this.y-15);
			explosionCollection.newExplosion(this.x-15, this.y+15);
			explosionCollection.newExplosion(this.x-15, this.y-15);
			explosionCollection.newExplosion(this.x, this.y);
			messageCollection.newMessage(playerShip.x - 30, playerShip.y - 40, 'Game Over');
			deadSound = new Audio("sounds/player_dead.ogg");
			deadSound.play();
		}
		
	}

		
	this.draw = function() {
		if (this.shieldTimer < 0) {
			ctx.save()
			ctx.globalAlpha =  1 - (this.shieldTimer / -50);
			ctx.drawImage(playerImage, playerImageWidth, 0, playerImageWidth, playerImageHeight, this.x-playerImageWidth/2, this.y-playerImageHeight/2, playerImageWidth, playerImageHeight);
			ctx.restore();
			return;
		}
		
		//Draw invulnerable shield
		if (this.invulnerable) {
			ctx.fillStyle = '#FFFFFF';
			ctx.beginPath();
			ctx.arc(this.x, this.y, 20, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.fill();
		}
		
		else if (this.shieldTimer >= this.shieldMax) {
			xStartPoint = sheildsImageWidth * 2;
			try {
				ctx.drawImage(shieldsImage, xStartPoint, 0, sheildsImageWidth, sheildsImageHeight, this.x - sheildsImageWidth / 2, this.y - playerImageHeight + 20, sheildsImageWidth, sheildsImageHeight);
			} 
			catch (e) {
				if (window.console != undefined) {
					console.log(e);
				}
			}
		}
		else if (this.shieldTimer >= this.shieldMax/4) {
			xStartPoint = 0;
			try {
				ctx.drawImage(shieldsImage, xStartPoint, 0, sheildsImageWidth, sheildsImageHeight, this.x - sheildsImageWidth / 2, this.y - playerImageHeight + 20, sheildsImageWidth, sheildsImageHeight);
			} 
			catch (e) {
				if (window.console != undefined) {
					console.log(e);
				}
			}
		}
		
		this.drawSpaceShipImage(this.x, this.y);

		this.powerUp.draw();

	}
	
	this.drawSpaceShipImage = function(x,y) {
		var readFromX = playerImageWidth;
		if(this.dx < 0) {
			readFromX = 0;
		} else if(this.dx > 0) {
			readFromX = playerImageWidth * 2;
		}
		try { 
			ctx.drawImage(playerImage, readFromX, 0, playerImageWidth, playerImageHeight, x-playerImageWidth/2, y-playerImageHeight/2, playerImageWidth, playerImageHeight);
		} 
		catch (e) {
			if (window.console != undefined) {
				console.log(e);
			}
		}
		
	}
	
	this.playerShotInvader = function(x, y) {
		this.invadersShotRecently = Math.min(this.invadersShotRecently + 80, this.invadersShotRecentlyMax);

 		if (this.timeOfInvadersShotRecentlyMessage < totalTime && this.levelOfInvadersShotRecentlyMessage > 0) {
			this.levelOfInvadersShotRecentlyMessage = 0;
		}
		
		if (this.invadersShotRecently >= this.invadersShotRecentlyMax) {
			this.invadersShotRecently = 0;
			
			x = Math.max(220, x);
			x = Math.min(width-220, x);
			
			switch (this.levelOfInvadersShotRecentlyMessage) {
				case 0:
					messageCollection.newMessageWithFont(x-100, y, 'Mass Destruction!', '20px Courier');
					this.timeOfInvadersShotRecentlyMessage = totalTime + 300;
					this.levelOfInvadersShotRecentlyMessage = 1;
					break;
				case 1:
					messageCollection.newMessageWithFont(x-140, y, 'Total Destruction!!', '25px Courier');
					this.timeOfInvadersShotRecentlyMessage = totalTime + 260;
					this.levelOfInvadersShotRecentlyMessage = 2;
					break;
				case 2:
					messageCollection.newMessageWithFont(x-160, y, 'EPIC Destruction!!!', '30px Courier');
					this.timeOfInvadersShotRecentlyMessage = totalTime + 220;
					this.levelOfInvadersShotRecentlyMessage = 3;
					break;
				case 3:
					messageCollection.newMessageWithFont(x-200, y, 'AWESOME Destruction!!!!', '35px Courier');
					this.timeOfInvadersShotRecentlyMessage = totalTime + 180;
					this.levelOfInvadersShotRecentlyMessage = 4;
					break;
				case 4:
					messageCollection.newMessageWithFont(x-200, y,    '  LEGENDARY   ', '40px Courier');
					messageCollection.newMessageWithFont(x-200, y+50, 'Destruction!!!!!', '40px Courier');
					this.timeOfInvadersShotRecentlyMessage = totalTime + 180;
					break;
			}
		}
		// If too much time has passed downgrade the destruction level
	}
}


function PlayerShotCollection(){
	this.shots = new Array();
	var laserImage1 = new Image();
	laserImage1.src = 'images/laser1.png';
	var laserImage2 = new Image();
	laserImage2.src = 'images/laser2.png';
	var bombImage = new Image();
	bombImage.src = 'images/bomb2.png';
	var electricImage = new Image();
	electricImage.src = 'images/electric.png';
	
	var laserSound = new Audio("sounds/laser.ogg");
	var fireSound = new Audio("sounds/z3.ogg");
	var bombSound = new Audio("sounds/bomb.ogg");
	laserSound.pause();
	fireSound.pause();
	bombSound.pause();
	
	
	this.fireForwards = function(x, y) {
		fireSound.play();
		this.shots.push( new Shot(x -11, y -5, 0, -20) );
		this.shots.push( new Shot(x , y -5, 0, -20) );
		this.shots.push( new Shot(x +11, y -5, 0, -20) );
	}
	
	this.fireDiagonal = function(x, y) {
		fireSound.play();
		this.shots.push( new Shot(x -9, y -5, -4, -15) );
		this.shots.push( new Shot(x +9, y -5,  4, -15) );
		this.shots.push( new Shot(x -9, y -5, -15, -4) );
		this.shots.push( new Shot(x +9, y -5,  15, -4) );
		this.shots.push( new Shot(x -9, y -5, -9, -10) );
		this.shots.push( new Shot(x +9, y -5,  9, -10) );
//		this.shots.push( new Shot(x   , y -5, -4, -15) );
//		this.shots.push( new Shot(x   , y -5,  4, -15) );
	}
	
	this.superFire = function(x, y, howMany) {
		fireSound.play();
		var bit = 0.0;
		var bitInc =  Math.PI/2 / howMany;
		
		while (bit <= Math.PI/2) {
			
			var o = Math.sin(bit) * 15;
			var a = Math.cos(bit) * 15;
			bit += bitInc;
			
			this.shots.push( new Shot(x, y, o, a ) )
			this.shots.push( new Shot(x, y, -o, a) )
			this.shots.push( new Shot(x, y, -o, -a) )
			this.shots.push( new Shot(x, y, o, -a) )
		}
	}
	
	this.laserFire = function() {
		this.shots.push(new LaserShot(laserImage1, 40, 0, 10))
		laserSound.play();
	}
	this.sideLaserFire = function() {
		this.shots.push(new LaserShot(laserImage2, 25, -25, 3))
		this.shots.push(new LaserShot(laserImage2, 25, 25, 3))
		laserSound.play();
	}
	this.bombFire = function() {
		this.shots.push(new BombShot(playerShip.x - 25, playerShip.y - 5));
		this.shots.push(new BombShot(playerShip.x + 25, playerShip.y - 5));
	}
	this.sideElectricFire = function() {
		this.shots.push(new ElectricShot(laserImage2, 25, -25, 3))
		this.shots.push(new ElectricShot(laserImage2, 25, 25, 3))
	}
	
	
	this.move = function(){
		for(var i=0; i < this.shots.length; i++) {
	        if (this.shots[i].move()) {
				this.shots.splice(i, 1);
				i--;
			}
    	}
	}
	
	this.draw = function(){
		for(var i=0; i < this.shots.length; i++) {
	        this.shots[i].draw()
		}
	}
		
	function Shot(x,y, dx, dy) {
		
		this.move = function(){
			// Invaders may have moved up to 20 downwards - If the shot moves 20 upwards
			// The 2 could pass each other without 'colliding'
		    var didIHit = this.didIHit();
			if (didIHit) {
				return true;
			}

			y += dy
			x += dx;
		
		    didIHit = this.didIHit();
			if (didIHit) {
				return true;
			}
			
			if(x <= 0 || x >= width) {
            	return true;
	        }
	        if(y <= 0 || y >= height) {
	            return true;
	        }
			return false;
		}
		
		this.didIHit = function(){
			for (var i = 0; i < invaderGroups.length; i++) {
				if (invaderGroups[i].imHit(x, y, 11)) {
					return true;
				}
			}
			if (asteroidCollection.imHit(x, y, 1)) {
				return true;
			}
			return false;
		}
		
		this.draw = function() {
			ctx.beginPath();
			ctx.fillStyle = "#FF0000"
			ctx.rect(x - 1, y - 3, 3, 6)
			ctx.closePath();
			ctx.fill();
		}
	}
	
	function LaserShot(img, life, relativeX, damage) {

		this.draw = function() {
			var laserX = playerShip.x -img.width/2 + relativeX;
			try {
				ctx.drawImage(img, 0, 50 - (life % 50), img.width, 50, laserX, 0, img.width, playerShip.y );
			} catch(e) {
				if (window.console != undefined) {
			        console.log(e);
			    }
			}
		}
		
		this.move = function() {
			life--;
			if (life == 0) {
				return true;
			}
			this.didIHit();
		}
		
		this.didIHit = function(){
			for (var i = 0; i < invaderGroups.length; i++) {
				invaderGroups[i].imLaserHit(playerShip.x + relativeX , playerShip.y, img.width*3/2, damage)
			}
			asteroidCollection.imLaserHit(playerShip.x + relativeX , playerShip.y, img.width/2, damage);
			
		}
	}
	
	function BombShot(x,y) {
		var life = 10;
		
		this.move = function(){
			life--;
			y = y - life*3;
			
			if (life < 0) {
				bombSound.play();
				playerShotCollection.superFire(x, y, 2);
				return true;
			}
		}
		
		this.draw = function() {
			try {
				ctx.drawImage(bombImage, x - bombImage.width/2, y - bombImage.height/2 );
			} catch(e) {
				if (window.console != undefined) {
			        console.log(e);
			    }
			}
		}
	}
	
	function ElectricShot() {
		var life = 100;
		var x = playerShip.x - 100;
		var y = playerShip.y;
		
		this.move = function(){
			life--;
			if (life < 0) {
				return true;
			}
			
			var result = this.didIHit();
			if (result) {
				return result
			}
			x = playerShip.x - bigSin(life)*20;
			y = playerShip.y + bigCos(life)*20;
			
			var result = this.didIHit();
			if (result) {
				return result
			}
		}
		
		this.draw = function() {
			try {
				ctx.drawImage(electricImage, x - electricImage.width/2, y - electricImage.height/2 );
			} catch(e) {
				if (window.console != undefined) {
			        console.log(e);
			    }
			}
		}
		
		this.didIHit = function(){
			for (var i = 0; i < invaderGroups.length; i++) {
				if (invaderGroups[i].imHit(x, y, 15)) {
					return true;
				}
			}
			if (asteroidCollection.imHit(x, y, 5)) {
				return true;
			}
		}
		
	}
}
	
