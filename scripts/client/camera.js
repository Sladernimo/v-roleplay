// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
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
let cameraFadeAlpha = 0;

// ===========================================================================

function processCameraFadeRendering() {
	if (cameraFadeEnabled) {
		logToConsole(LOG_VERBOSE, `[V.RP.Camera] Camera fade enabled`);
		let finishTime = cameraFadeStart + cameraFadeDuration;
		if (sdl.ticks >= finishTime) {
			logToConsole(LOG_VERBOSE, `[V.RP.Camera] Camera fade finished`);
			cameraFadeEnabled = false;
			cameraFadeDuration = 0;
			cameraFadeStart = 0;
		} else {
			logToConsole(LOG_VERBOSE, `[V.RP.Camera] Camera fade processing`);
			let currentTick = sdl.ticks - cameraFadeStart;
			let progressPercent = Math.ceil(currentTick * 100 / cameraFadeDuration);
			let rgbaArray = rgbaArrayFromToColour(cameraFadeColour);

			cameraFadeAlpha = (cameraFadeIn) ? Math.ceil(((100 - progressPercent) / 100) * 255) : Math.ceil(255 * (progressPercent / 100));
			logToConsole(LOG_VERBOSE, `[V.RP.Camera] Camera fade progress: ${progressPercent}% (Alpha: ${cameraFadeAlpha})`);

			cameraFadeColour = toColour(rgbaArray[0], rgbaArray[1], rgbaArray[2], cameraFadeAlpha);
			graphics.drawRectangle(null, toVector2(0, 0), toVector2(game.width, game.height), cameraFadeColour, cameraFadeColour, cameraFadeColour, cameraFadeColour);
		}
	}
}

// ===========================================================================