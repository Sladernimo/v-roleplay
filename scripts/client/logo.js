// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: logo.js
// DESC: Provides logo rendering functions
// TYPE: Client (JavaScript)
// ===========================================================================

let logoImage = null;
let logoPos = (getGame() == V_GAME_MAFIA_ONE) ? toVector2(80, game.height - 80) : toVector2(64, 64);
let logoSize = toVector2(128, 128);

// ===========================================================================

function initLogoScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Logo]: Initializing logo script ...");
	//logoImage = loadLogoImage();
	logToConsole(LOG_DEBUG, "[V.RP.Logo]: Logo script initialized!");
}

// ===========================================================================

function loadLogoImage() {
	//if (getGame() == V_GAME_MAFIA_ONE) {
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
	if (getGame() == V_GAME_MAFIA_ONE) {
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
	logToConsole(LOG_DEBUG, `[V.RP.Main] Server logo ${(state) ? "enabled" : "disabled"}`);
	renderLogo = state;
}

// ===========================================================================