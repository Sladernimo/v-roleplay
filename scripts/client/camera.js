// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: camera.js
// DESC: Provides camera functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let cameraFadeEnabled = false;
let cameraFadeIn = false;
let cameraFadeStart = 0;
let cameraFadeDuration = 0;
let cameraFadeColour = 0;

// ===========================================================================

function processCameraFadeRendering() {
	if (cameraFadeEnabled) {
		let finishTime = cameraFadeStart + cameraFadeDuration;
		if (sdl.ticks >= finishTime) {
			cameraFadeEnabled = false;
			cameraFadeDuration = 0;
			cameraFadeStart = 0;
		} else {
			let currentTick = sdl.ticks - cameraFadeStart;
			let progressPercent = Math.ceil(currentTick * 100 / cameraFadeDuration);
			let rgbaArray = rgbaArrayFromToColour(cameraFadeColour);

			let alpha = (cameraFadeIn) ? Math.ceil(255 / progressPercent) : Math.ceil(progressPercent / 255);

			cameraFadeColour = toColour(rgbaArray[0], rgbaArray[1], rgbaArray[2], alpha);
			graphics.drawRectangle(null, toVector2(0, 0), toVector2(game.width, game.height), cameraFadeColour, cameraFadeColour, cameraFadeColour, cameraFadeColour);
		}
	}
}

// ===========================================================================