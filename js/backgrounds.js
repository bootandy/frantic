

function StarCollection() {
	var stars = new Array();

	this.newStar = function() {
		x = parseInt(Math.random()*width);
		dy = Math.random()*20 + 5
		s = new Star(x, 0, dy);
		stars.push(s)
	}
	
	this.move = function(){
		if (Math.random() < 0.4) {
			this.newStar();
		}
		for(var i=0; i < stars.length; i++) {
	        if (stars[i].move()) {
				stars.splice(i, 1);
				i--;
			}
    	}
	}
	
	this.draw = function(){
		for(var i=0; i < stars.length; i++) {
	        stars[i].draw()
		}
	}
	
	function Star(x,y,dy) {
		color =  "#CCCCCC"
		
		this.move = function(){
			y += dy
			if (y + 30 > height) {
				return true
			}
			return false;
		}
		this.draw = function() {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.rect(x - 2, y - 2, 1, dy/5)
			ctx.closePath();
			ctx.fill();
		
		}
	}
}


function DebrisCollection() {
	debris = new Array();

	this.newDebris = function(x,y,color) {
		for (var i = 0; i < 10; i++) {
			debris.push(new Debris(x, y, 2 - Math.random()*4, 2 - Math.random()*4, color))
		}
	}
	
	this.move = function(){
		for(var i=0; i < debris.length; i++) {
	        if (debris[i].move()) {
				debris.splice(i, 1);
				i--;
			}
    	}
	}
	
	this.draw = function(){
		for(var i=0; i < debris.length; i++) {
	        debris[i].draw()
		}
	}
	
	function Debris(x,y,dx,dy,color) {
		var life = 15 + Math.random()*10
		
		this.move = function(){
			y += dy
			x += dx
			life--
			if (life < 0) {
				return true
			}
			return false;
		}
		this.draw = function() {
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.rect(x, y, 2, 2)
			ctx.closePath();
			ctx.fill();
		}
	}
}

function ExplosionCollection() {
	explosions = new Array();

	explosionImage = new Image(); // 13 explosions 36X36 
	explosionImage.src = 'images/explosionsBig.png';

	this.newExplosion = function(x,y) {
		explosions.push(new Explosion(x, y))
	}
	
	this.move = function(){
		for(var i=0; i < explosions.length; i++) {
	        if (explosions[i].move()) {
				explosions.splice(i, 1);
				i--;
			}
    	}
	}
	
	this.draw = function(){
		for(var i=0; i < explosions.length; i++) {
	        explosions[i].draw()
		}
	}
	
	function Explosion(x,y) {
		var life = 0;
		
		this.move = function(){
			life++
			if (life > 12) {
				return true
			}
			return false;
		}
		this.draw = function() {
			ctx.drawImage(explosionImage, 36*life, 0, 36, 36, x - 18, y - 18, 36, 36);
		}
	}
}

function MessageCollection() {
	var messages = new Array();

	this.newScore = function(x,y,value) {
		score += value * wave
		var fontSize = value / 3 + 8;
		this.newMessageWithFont(x, y, '+'+value, fontSize+'px Courier');
	}

	this.newMessage = function(x,y,value) {
		this.newMessageWithFont(x, y, value, '12px Courier');
	}
	
	this.newMessageWithFont = function(x,y,value, font) {
		var y = Math.max(y, 10);
		var y = Math.min(y, height - 10);
		var s = new Message(x, y, value, font);
		messages.push(s)
	}
	
	this.move = function(){
		for(var i=0; i < messages.length; i++) {
	        if (messages[i].move()) {
				messages.splice(i, 1);
				i--;
			}
    	}
	}
	
	this.draw = function(){
		ctx.beginPath();
		for(var i=0; i < messages.length; i++) {
	        messages[i].draw()
		}
		ctx.closePath();
		ctx.fill();
	}
	
	function Message(x,y,value, font) {
		var timeLeft = 50
		
		this.move = function(){
			timeLeft -= 1
			if (timeLeft == 0) {
				return true;
			}
		}
		this.draw = function() {
			var myColor = timeLeft * 4 + 55
			var myColorString = myColor.toString(16)
			ctx.fillStyle = '#'+myColorString+myColorString+myColorString
			ctx.font = font;
			ctx.fillText(value, x - 10, y + 5)
		}
	}
}
