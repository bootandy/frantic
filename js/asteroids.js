imagesA = new Array();
imagesA[0] = new Image();
imagesA[0].src = 'images/asteroid1.png';
imagesA[1] = new Image();
imagesA[1].src = 'images/asteroid2.png';

function AsteroidCollection(){
	var counter = 0;
	var asteroids = new Array();
	
	this.move = function(){
		if (Math.random() * 400000  < counter && asteroids.length < wave) {
			asteroids.push(new Asteroid());
			counter = wave * 1000;
		}
		counter++;
				
		for (var i = 0; i < asteroids.length; i++) {
			var asteroid = asteroids[i]
			if (asteroid.move()) {
				asteroids.splice(i, 1);
				i--;
			}
		}
		
	}
	
	this.draw = function(){
		for (var i = 0; i < asteroids.length; i++) {
			asteroids[i].draw()
		}
	}
	
	this.imHit = function(byX, byY, margin) {
		for(var j=0; j < asteroids.length; j++) {
			asteroid = asteroids[j];
			if (asteroid.imHit(byX, byY, margin)) {
				return true;
			}
		}
		return false;
	}	
	
	this.imLaserHit = function(byX, byY, margin, damage) {
		for(var j=0; j < asteroids.length; j++) {
			asteroid = asteroids[j];
			asteroid.imLaserHit(byX, byY, margin, damage);
		}
		return null;
	}
	
	function Asteroid(){
		
		var type = parseInt(Math.random() * 2);
		var x = Math.random()*(width-50) + 25;
		var y = - imagesA[type].height / 2;
		var dx = Math.random() - 0.5;
		var dy = 1 + Math.random() * 5;
		var rotation = 0;
		var rotationRate = Math.random()/10.0;
		var flashWhite = false;
		
		this.move = function(){
			y += dy;
			x += dx;
			rotation += rotationRate;
			if (y > height + imagesA[type].height / 2 || y < 0 - imagesA[type].height / 2) {
				return true;
			}
		}
		
		this.draw = function(){
			ctx.save()
			ctx.translate(x, y)
			ctx.rotate(rotation);

			// Incase Firefox throws an image not loaded yet exception
			try {
				ctx.drawImage(imagesA[type], - imagesA[type].width / 2, - imagesA[type].height / 2);
			} 
			catch (e) {
				if (window.console != undefined) {
					console.log(e);
				}
			}
			ctx.restore();

			if (flashWhite) {
				ctx.fillStyle = '#FFFFFF';
				ctx.beginPath();
				ctx.arc(x, y + imagesA[type].height/2, 15, 0, Math.PI * 2, false);
				ctx.closePath();
				ctx.fill();
				flashWhite = false;
			}
		}
		
			
		this.imHit = function(byX, byY, margin) {
			var fullMargin = margin + imagesA[type].width / 2;
			
			if (byX - fullMargin <= x && byX + fullMargin >= x 
					&& byY - fullMargin <= y && byY + fullMargin >= y ) {
				dy -= 0.3;
				flashWhite = true;
				return true;
			}
		}
		
		this.imLaserHit = function(byX, byY, margin, damage) {
			if (byX - (margin + imagesA[type].width/2) <= x && byX + (margin + imagesA[type].width/2) >= x && byY > y) {
				flashWhite = true;
				dy -= damage/30.0;
			}
		}
	}
}
