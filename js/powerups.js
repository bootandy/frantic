
function PowerUpCollection() {
	var counter = 0;
	var ups = new Array();
	var images = new Array(3);
	images[0] = new Image();
	images[0].src = 'images/powerup-laser.png';
	images[1] = new Image();
	images[1].src = 'images/powerup-ghost.png';
	images[2] = new Image();
	images[2].src = 'images/powerup-bombs.png';
	images[3] = new Image();
	images[3].src = 'images/powerup-electric.png';
	images[4] = new Image();
	images[4].src = 'images/powerup-energy.png';
	images[5] = new Image();
	images[5].src = 'images/powerup-shields.png';
 	var pickupSound = new Audio("sounds/powerup.ogg");
	pickupSound.pause()

	this.move = function(){
		if (Math.random() * 5000 * wave < counter) {
			ups.push( new Powerup() );
			counter = 0;
		}
		counter++;
		
		
		for(var i=0; i < ups.length; i++) {
			var up = ups[i]
	        if (up.move()) {
				ups.splice(i, 1);
				i--;
			}
    	}
		
	}
	
	this.draw = function(){
		for(var i=0; i < ups.length; i++) {
	        ups[i].draw()
		}
	}
	
	
	function Powerup() {
			
		var type = parseInt(Math.random() * 6);
		var x = Math.random()*(width-50) + 25;
		var y = 0;
		
		this.move = function(){
			y += 5;
			if (y > height) {
				return true;
			}
			// if we are near the ship:
			if (x - 35 <= playerShip.x && x + 35 >= playerShip.x
					&& y - 35 <= playerShip.y && y + 35 >= playerShip.y) {
				this.pickupPowerUp();
				return true;
			}
				
		}
	
		this.draw = function(){
			// Incase Firefox throws an image not loaded yet exception
			try {
				ctx.drawImage(images[type], x - images[type].width/2, y - images[type].height/2);
			} catch(e) {
				if (window.console != undefined) {
			        console.log(e);
					console.log(type);
			    }
			}
		}
		
		this.pickupPowerUp = function() {
			pickupSound.play();
			switch(type) {
				case 0: playerShip.powerUp = new LaserCannons(); 
						messageCollection.newMessage(playerShip.x - 70, playerShip.y + 40, 'Power up: '+playerShip.powerUp.name());
						break;
				case 1: playerShip.powerUp = new GhostShip();
						messageCollection.newMessage(playerShip.x - 70, playerShip.y + 40, 'Power up: '+playerShip.powerUp.name());
						break;
				case 2: playerShip.powerUp = new Bombs();
						messageCollection.newMessage(playerShip.x - 40, playerShip.y + 40, 'Power up: '+playerShip.powerUp.name());
						break;
				case 3: playerShip.powerUp = new ElectricShock();
						messageCollection.newMessage(playerShip.x - 40, playerShip.y + 40, 'Power up: '+playerShip.powerUp.name());
						break;
				case 4: playerShip.firing = playerShip.firingMax2;
						messageCollection.newMessage(playerShip.x - 30, playerShip.y + 40, 'Full energy');
						break;
				case 5: playerShip.fillShields();
						break;
			}
		
		}
	}
		
}

function NoPowerup() {
	this.name = function() {
		return "None"
	}
	this.draw = function(){
	}
	this.fire = function(){
	}
}

function GhostShip() {
	this.draw = function() {
		ctx.save();
		ctx.globalAlpha =  0.3;
		playerShip.drawSpaceShipImage((width - playerShip.x), playerShip.y);
		ctx.restore();
	}
	
	this.fire = function(forwards, sideways){
		if (forwards) {
			playerShotCollection.fireForwards((width - playerShip.x), playerShip.y);
		}
		if (sideways) {
			playerShotCollection.fireDiagonal((width - playerShip.x), playerShip.y);
		}
	}
	
	this.name = function() {
		return "Ghost Ship"
	}
}

function LaserCannons() {
	
	var counter = 1;
	sidekickImage = new Image();
	sidekickImage.src = 'images/sidelaser.png';

	this.draw = function(){
		try {
			ctx.drawImage(sidekickImage, playerShip.x - sidekickImage.width/2 - 25, playerShip.y - sidekickImage.height/4);
			ctx.drawImage(sidekickImage, playerShip.x - sidekickImage.width/2 + 25, playerShip.y - sidekickImage.height/4 );
		} catch(e) {
			if (window.console != undefined) {
		        console.log(e);
		    }
		}
	}

	this.fire = function() {
		counter--;
		if (counter <= 0) {
			counter = 5;
			playerShotCollection.sideLaserFire();
		}
	}
	
	this.name = function() {
		return "Laser Cannons"
	}

}

function ElectricShock() {
	
	var counter = 1;
	sidekickImage = new Image();
	sidekickImage.src = 'images/electric.png';

	this.draw = function(){
		try {
			ctx.drawImage(sidekickImage, playerShip.x - sidekickImage.width/2 - 25, playerShip.y - sidekickImage.height/4);
			ctx.drawImage(sidekickImage, playerShip.x - sidekickImage.width/2 + 25, playerShip.y - sidekickImage.height/4 );
		} catch(e) {
			if (window.console != undefined) {
		        console.log(e);
		    }
		}
	}

	this.fire = function() {
		playerShotCollection.sideElectricFire();
	}
	
	this.name = function() {
		return "Electric Orbs"
	}

}

function Bombs() {
	var counter = 1;
	var sidekickImage = new Image();
	sidekickImage.src = 'images/sidebombs.png';


	this.fire = function() {
		counter--;
		if (counter <= 0) {
			counter = 4;
			playerShotCollection.bombFire();
		}
	}
	this.draw = function() {
		try {
			ctx.drawImage(sidekickImage, playerShip.x - sidekickImage.width/2 - 25, playerShip.y - sidekickImage.height/4);
			ctx.drawImage(sidekickImage, playerShip.x - sidekickImage.width/2 + 25, playerShip.y - sidekickImage.height/4);
		} catch(e) {
			if (window.console != undefined) {
		        console.log(e);
		    }
		}
	}
	
	this.name = function() {
		return "Bombs"
	}
}
