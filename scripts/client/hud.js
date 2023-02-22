// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: hud.js
// DESC: Provides custom HUD functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let customHUDMoneyFont = null;
let customHUDMoneyColour = toColour(255, 255, 255, 255);
let customHUDMoneySize = 22.0;

// ===========================================================================

function initCustomHUDScript() {
	logToConsole(LOG_DEBUG, "[V.RP.HUD]: Initializing HUD script ...");
	customHUDMoneyFont = initCustomHUDMoneyFont();
	logToConsole(LOG_DEBUG, "[V.RP.HUD]: HUD script initialized!");
}

// ===========================================================================

function processCustomHUDRendering() {
	logToConsole(LOG_VERBOSE, "[V.RP.HUD]: Processing custom HUD rendering ...");

	if (renderHUD == false) {
		return false;
	}

	if (getGame() == V_GAME_MAFIA_ONE) {
		if (customHUDMoneyFont != null) {
			let text = getCurrencyString(localPlayerMoney);
			logToConsole(LOG_VERBOSE, `[V.RP.HUD]: Rendering custom HUD money (${text})...`);
			customHUDMoneyFont.render(text, [game.width - 150, 20], 130, 1.0, 0.0, customHUDMoneyFont.size, customHUDMoneyColour, true, true, false, true);
			graphics.drawRectangle()
		} else {
			logToConsole(LOG_VERBOSE | LOG_ERROR, `[V.RP.HUD]: Rendering custom HUD money FAILED. Font object is null!`);
		}
	}
}

// ===========================================================================

function initCustomHUDMoneyFont() {
	logToConsole(LOG_DEBUG, "[V.RP.HUD]: Loading custom HUD money font ...");
	let tempFont = null;
	let fontStream = openFile("files/fonts/aurora-bold-condensed.ttf");
	if (fontStream != null) {
		tempFont = lucasFont.createFont(fontStream, customHUDMoneySize);
		logToConsole(LOG_DEBUG, "[V.RP.HUD]: Custom HUD money font loaded successfully!");
	} else {
		logToConsole(LOG_DEBUG | LOG_ERROR, "[V.RP.HUD]: Loading custom HUD money font FAILED. Font file stream is null!");
	}

	return tempFont;
}

// ===========================================================================