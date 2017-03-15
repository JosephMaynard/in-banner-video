/************** Instructions **************

• Create composition in Adobe After Effects and export frames as a PNG Sequence
• Load PNGs into stack in Photoshop (File > Scripts > Load Files into Stack...)
• Reverse layer order (Select all layers, and use: Layer > Arrange > Reverse)
• Create Frame Animation
• On the frames Timeline menu, Make Frames From Layers
• Use the SpritePlane Photoshop Script to convert the animation to a sprite sheet ( https://github.com/mediochrea/SpritePlane ). You will need to tweak the numbers of rows and columns to get the sprite sheet to be roughly square to keep the required memory to a minimum on mobile devices.
• Save out the sprite sheet and use Fireworks to compress it to get the best file size to quality balance. (Fireworks supports Selective JPEG Quality were 2 compression levels can be applied to different parts of the image. This video shows the usage: http://www.youtube.com/watch?v=5_RdG2RGpDE )
• Adjust the variables at the top of script to set the number of frames, the frame rate of the video, the width and height of the video, the number of columns in the sprite sheet and the URL of the sprite sheet.
Set up the banner in the following way:

<a href="http://example.com" id="mbeBanner"><img src="banner.gif" alt="Video Banner" id="mbeBannerImg"></a>
<script src="video_banner.js"></script>


REMOVE THESE INSTRUCTIONS AND MINIFY BEFORE DEPLOYING SCRIPT

This site works well:|
http://jscompress.com/

DON'T SAVE THE MINIFIED VERSION OVER THE ORIGINAL!!!

Usual convention is to save as filename.min.js


*****************************************/



var mbeVideoBanner = (function() {

	// Adjust these variables for each project
	var frames = 92, // Number of frames in the sequence
		frameRate = 12.5, // Frame rate of the sequence
		frameWidth = 320,  // Width of Video Area
		frameHeight = 50, // Height of Video Area
		frameCols = 4, // Number of columns in the sprite sheet
		lastFrameHold = 0, // Time in seconds to hold on last frame of video - Set to 0 for no delay
		pauseTime = 3, // Time between playing video in seconds - Set to length of animated GIF to show it fully between video or to 0 for continuous looping video
		spriteSheetURL = "http://cdn.mobileembrace.com/uploads/mobileembrace.com/endersgame/endersgame.jpg", //Location of sprite sheet

		//Don't change these variables
		nextFrame = 0,		
		mbeBanner = document.getElementById('mbeBanner'),
		mbeBannerImg = document.getElementById('mbeBannerImg');

	//Add CSS properties to the banner container DIV
	mbeBanner.style.position = 'relative';
	mbeBanner.style.display = 'block';
	mbeBanner.style.margin = '0 auto';
	mbeBanner.style.width =  '320px';
	mbeBanner.style.height = '50px';

	//Remove Image Padding - Fixes BBC News Issue
	mbeBannerImg.style.padding = '0';

	//Remove Image Border IE fix
	mbeBannerImg.style.border = 'none';

	//Set up Video DIV - Adjust these settings to shange the position on the video in the banner
	var mbeVideo = document.createElement('div');
	mbeVideo.id = 'mbeVideo';
	mbeVideo.style.position = 'absolute';
	mbeVideo.style.width =  frameWidth + 'px';
	mbeVideo.style.height = frameHeight + 'px';
	mbeVideo.style.top = '0px';
	mbeVideo.style.left = '0px';
	mbeVideo.style.background = 'url(' + spriteSheetURL + ') no-repeat 0px 0px';

	function runAnimation(){
		if (nextFrame < frames) {
			mbeVideo.style.backgroundPosition = "-" + ((nextFrame % frameCols) * frameWidth) + "px -" + (Math.floor(nextFrame / frameCols) * frameHeight) + "px";
			nextFrame++;
			setTimeout(runAnimation, 1000 / frameRate);
		} else {
			setTimeout(function(){
				if(pauseTime != 0){
					mbeVideo.style.display="none";
				}
				nextFrame = 0;
				resetGif(mbeBannerImg);
				setTimeout(function(){
					mbeVideo.style.display="block";
					runAnimation();
				}, (pauseTime * 1000));
			}, lastFrameHold * 1000);
		}
	}

	//Restarts Animated GIF from begining after video has run
	function resetGif(gif){
		var gifSrc = gif.getAttribute("src");
		gif.removeAttribute("src");
		gif.setAttribute("src", gifSrc);
	}

	//Preload Images
	(function(){
		var preLoader = new Image();
		preLoader.onload = function(){ 		
			setTimeout(function(){
				mbeBanner.appendChild(mbeVideo);
				runAnimation();
			}, 1000);
		};
		preLoader.src = spriteSheetURL;
	})();

}());