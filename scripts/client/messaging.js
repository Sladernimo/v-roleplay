// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: messaging.js
// DESC: Provides messaging/textdraw functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let bigGameMessageFonts = {};
let bigGameMessageFontName = "";
let bigGameMessageText = "";
let bigGameMessageColour = COLOUR_WHITE;
let bigGameMessageTimer = null;

let smallGameMessageFonts = {};
let smallGameMessageFontName = "";
let smallGameMessageText = "";
let smallGameMessageColour = COLOUR_WHITE;
let smallGameMessageTimer = null;

// ===========================================================================

function initMessagingScript() {
	logToConsole(LOG_DEBUG, "[VRR.Messaging]: Initializing messaging script ...");
	smallGameMessageFonts = loadSmallGameMessageFonts();
	bigGameMessageFonts = loadSmallGameMessageFonts();
	logToConsole(LOG_DEBUG, "[VRR.Messaging]: Messaging script initialized!");
}

// ===========================================================================

function loadSmallGameMessageFonts() {
	let tempSmallGameMessageFonts = {};
	let fontStream = openFile("files/fonts/pricedown.ttf");
	if(fontStream != null) {
		tempSmallGameMessageFonts["Pricedown"] = lucasFont.createFont(fontStream, 20.0);
		fontStream.close();
	}

	tempSmallGameMessageFonts["Roboto"] = lucasFont.createDefaultFont(20.0, "Roboto");
	tempSmallGameMessageFonts["RobotoLight"] = lucasFont.createDefaultFont(20.0, "Roboto", "Light");

	return tempSmallGameMessageFonts;
}

// ===========================================================================

function loadBigGameMessageFont() {
	let tempBigGameMessageFonts = {};
	let fontStream = openFile("files/fonts/pricedown.ttf");
	if(fontStream != null) {
		tempBigGameMessageFonts["Pricedown"] = lucasFont.createFont(fontStream, 28.0);
		fontStream.close();
	}

	tempBigGameMessageFonts["Roboto"] = lucasFont.createDefaultFont(28.0, "Roboto");
	tempBigGameMessageFonts["RobotoLight"] = lucasFont.createDefaultFont(28.0, "Roboto", "Light");

	return tempBigGameMessageFonts;
}

// ===========================================================================

function processSmallGameMessageRendering() {
	if(renderSmallGameMessage) {
		if(smallGameMessageText != "") {
			if(smallGameMessageFonts[smallGameMessageFontName] != null) {
				smallGameMessageFonts[smallGameMessageFontName].render(smallGameMessageText, [0, game.height-90], game.width, 0.5, 0.0, smallGameMessageFonts[smallGameMessageFontName].size, smallGameMessageColour, true, true, false, true);
			}
		}
	}
}

// ===========================================================================

function showSmallGameMessage(text, colour, duration, fontName) {
	logToConsole(LOG_DEBUG, `[VRR.Messaging] Showing small game message '${text}' using font ${fontName} for ${duration}ms`);
	if(smallGameMessageText != "") {
		clearTimeout(smallGameMessageTimer);
	}

	smallGameMessageFontName = fontName;
	smallGameMessageColour = colour;
	smallGameMessageText = text;

	smallGameMessageTimer = setTimeout(function() {
		smallGameMessageText = "";
		smallGameMessageColour = COLOUR_WHITE;
		smallGameMessageTimer = null;
		smallGameMessageFontName = "";
	}, duration);
}

// ===========================================================================