var imageTitle = new Image()
imageTitle.src = 'images/instruction-title.png';


function drawInstructions() {
	ctx.fillStyle = '#000000';
	ctx.fillRect(0,0,width*widthScale,height*heightScale);
		
		
	// FF throws weird errors if the image isn't loaded - can't get image onload function to work correctly 
	try {
		if (showBackground) {
			var imgStart = (backImage.height - height * heightScale) - (backgroundTime % (backImage.height - height * heightScale));
			var widthMiddle = (width * widthScale - 800) / 2
			ctx.drawImage(backImage, 0, imgStart, 800, height * heightScale, 0, 0, 800, height * heightScale);
		}
		
		ctx.drawImage(imageTitle, width*widthScale/2 - imageTitle.width/2, 50);
	} catch(e) {
		if (window.console != undefined) {
	        console.log(e);
	    }
	}

	var menuX = width*widthScale/2 - 200;
	var instructionY = 400;
	ctx.font = 'bold 16px Helvetica';
	ctx.fillStyle = '#CCCCCC'
	ctx.fillText("Instructions:", menuX, instructionY)

	ctx.font = '14px Helvetica';
	ctx.fillStyle = '#CCCCCC'
	ctx.fillText("Shoot invaders and collect power ups", menuX+20, instructionY+40);
	ctx.fillText("If you get hit you loose your powerup and then you start to loose shields", menuX+20, instructionY+70);
	ctx.fillText("Destroy Everything :-) ", menuX+20, instructionY+100);
	ctx.fillText("Click mouse inside this window then press any key to start ", menuX+60, instructionY+130);
	
	
	var controlY = 200;
	ctx.font = 'bold 16px Helvetica';
	ctx.fillStyle = '#CCCCCC'
	ctx.fillText("Controls:", menuX, controlY)
	
	ctx.font = '14px Helvetica';
	ctx.fillStyle = '#CCCCCC'
	ctx.fillText("Arrow Keys: ", menuX+20, controlY+20);
	ctx.fillText("Z:", menuX+20, controlY+40);
	ctx.fillText("X:", menuX+20, controlY+60);
	ctx.fillText("Z+X or C:", menuX+20, controlY+80);
	ctx.fillText("B:", menuX+20, controlY+130);
	ctx.fillText("Move", menuX+100,  controlY+20);
	ctx.fillText("Fire sideways", menuX+100,  controlY+40);
	ctx.fillText("Fire forwards", menuX+100,  controlY+60);
	ctx.fillText("Fire everything (slows ship down)", menuX+100,  controlY+80);
	ctx.fillText("Hide / Show background (hide to make game run faster) ", menuX+100,  controlY+130);
	ctx.fillText("You can 'hold down' fire - you dont need to 'mash'", menuX+100, controlY+100);
	ctx.fillText("By Andy Boot", menuX+170, height*heightScale - 50);

	// clear the main screen
	document.onkeydown = keyDownInInstructions;
}
