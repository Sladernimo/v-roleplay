// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: hud.js
// DESC: Provides custom HUD functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let customHUDItemImagePosition = toVector2(game.width - 85, 20);
let customHUDItemImageSize = toVector2(64, 64);
let customHUDItemImage = null;

let customHUDDividerLineSize = toVector2((getGame() == V_GAME_MAFIA_ONE) ? 200 : 300, 2);
let customHUDDividerLinePosition = toVector2(game.width - customHUDDividerLineSize.x - 20, 45); //toVector2(customHUDItemImagePosition.x - customHUDDividerLineSize.x - 20, 45);
let customHUDDividerLineColour = toColour(200, 0, 0, 255);
let customHUDDividerLineThickness = 1;

let customHUDItemNameFont = null;
let customHUDItemNameColour = toColour(255, 255, 255, 255);
let customHUDItemNameFontSize = (getGame() == V_GAME_MAFIA_ONE) ? 18.0 : 16.0;
let customHUDItemNameFontFilePath = (game.game >= 10) ? "files/fonts/aurora-bold-condensed.ttf" : "files/fonts/pricedown.ttf"
let customHUDItemNamePosition = toVector2(customHUDDividerLinePosition.x, (getGame() == V_GAME_MAFIA_ONE) ? customHUDDividerLinePosition.y - customHUDItemNameFontSize - 10 : customHUDDividerLinePosition.y - customHUDItemNameFontSize - 15);

let customHUDMoneyFont = null;
let customHUDMoneyColour = toColour(255, 255, 255, 255);
let customHUDMoneyFontSize = 16.0;
let customHUDMoneyFontFilePath = (game.game >= 10) ? "files/fonts/aurora-bold-condensed.ttf" : "files/fonts/pricedown.ttf"
let customHUDMoneyPosition = toVector2(customHUDDividerLinePosition.x + 5, (getGame() == V_GAME_MAFIA_ONE) ? customHUDDividerLinePosition.y + 5 : customHUDDividerLinePosition.y + 2);

let customHUDTimeFont = null;
let customHUDTimeColour = toColour(255, 255, 255, 255);
let customHUDTimeFontSize = 16.0;
let customHUDTimeFontFilePath = (game.game >= 10) ? "files/fonts/aurora-bold-condensed.ttf" : "files/fonts/pricedown.ttf"
let customHUDTimePosition = toVector2(customHUDDividerLinePosition.x + 5, (getGame() == V_GAME_MAFIA_ONE) ? customHUDDividerLinePosition.y + 5 : customHUDDividerLinePosition.y + 2);

// ===========================================================================

function initCustomHUDScript() {
	logToConsole(LOG_DEBUG, "[V.RP.HUD]: Initializing HUD script ...");
	customHUDMoneyFont = loadCustomFont(customHUDMoneyFontFilePath, customHUDMoneyFontSize);
	customHUDTimeFont = loadCustomFont(customHUDTimeFontFilePath, customHUDTimeFontSize);
	customHUDItemNameFont = loadCustomFont(customHUDItemNameFontFilePath, customHUDItemNameFontSize);
	logToConsole(LOG_DEBUG, "[V.RP.HUD]: HUD script initialized!");
}

// ===========================================================================

function processCustomHUDRendering() {
	logToConsole(LOG_VERBOSE, "[V.RP.HUD]: Processing custom HUD rendering ...");

	if (renderHUD == false) {
		return false;
	}

	if (getGame() == V_GAME_MAFIA_ONE || getGame() == V_GAME_GTA_IV) {
		if (customHUDItemImage != null) {
			graphics.drawRectangle(customHUDItemImage, customHUDItemImagePosition, customHUDItemImageSize);
		}

		graphics.drawRectangle(null, customHUDDividerLinePosition, customHUDDividerLineSize, customHUDDividerLineColour, customHUDDividerLineColour, customHUDDividerLineColour, customHUDDividerLineColour);

		if (customHUDMoneyFont != null) {
			let moneyText = getCurrencyString(localPlayerMoney);
			customHUDMoneyFont.render(moneyText, customHUDMoneyPosition, customHUDDividerLineSize[0] - 10, 1.0, 0.0, customHUDMoneyFont.size, customHUDMoneyColour, true, true, false, true);
		}

		if (customHUDTimeFont != null) {
			let timeText = makeReadableTime(serverTime.hour, serverTime.minute, !serverTime.twelveHourClock);
			customHUDTimeFont.render(timeText, customHUDTimePosition, customHUDDividerLineSize[0] - 10, 0.0, 0.0, customHUDTimeFont.size, customHUDTimeColour, true, true, false, true);
		}

		if (customHUDItemNameFont != null) {
			let itemNameText = currentItemName;
			customHUDItemNameFont.render(itemNameText, customHUDItemNamePosition, customHUDDividerLineSize[0], 0.5, 0.0, customHUDItemNameFont.size, customHUDItemNameColour, true, true, false, true);
		}
	}
}

// ===========================================================================