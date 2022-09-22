// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: logo.js
// DESC: Provides logo rendering functions
// TYPE: Client (JavaScript)
// ===========================================================================

let logoImage = null;
let logoPos = toVector2(game.width - 132, game.height - 132);
let logoSize = toVector2(128, 128);

// ===========================================================================

function initLogoScript() {
	logToConsole(LOG_DEBUG, "[AGRP.Logo]: Initializing logo script ...");
	//logoImage = loadLogoImage();
	logToConsole(LOG_DEBUG, "[AGRP.Logo]: Logo script initialized!");
}

// ===========================================================================

function loadLogoImage() {
	//if (getGame() == AGRP_GAME_MAFIA_ONE) {
	//	return false;
	//}

	let logoStream = openFile(mainLogoPath);
	let tempLogoImage = null;
	if (logoStream != null) {
		tempLogoImage = graphics.loadPNG(logoStream);
		logoStream.close();
	}

	return tempLogoImage;
}

// ===========================================================================

function processLogoRendering() {
	if (getGame() == AGRP_GAME_MAFIA_ONE) {
		return false;
	}

	if (renderLogo) {
		if (logoImage != null) {
			graphics.drawRectangle(logoImage, logoPos, logoSize);
		}
	}
}

// ===========================================================================

function setServerLogoRenderState(state) {
	logToConsole(LOG_DEBUG, `[AGRP.Main] Server logo ${(state) ? "enabled" : "disabled"}`);
	renderLogo = state;
}

// ===========================================================================