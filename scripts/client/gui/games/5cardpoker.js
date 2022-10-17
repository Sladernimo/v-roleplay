// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: 5cardpoker.js
// DESC: Provides 5-card poker games GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let fiveCardPokerGUI = {
	window: null,
}

function initFiveCardPokerGUI() {
	// Render a five card poker game in MexUI
	//logToConsole(LOG_DEBUG, `[AGRP.GUI] Creating five-card poker GUI ...`);
	fiveCardPokerGUI.window = mexui.window(game.width / 2 - 200, game.height - 150, 400, 400, 'Five Card Poker', {
		main: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], 0),
		},
		title: {
			textSize: 11.0,
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
		},
		icon: {
			textSize: 0.0,
			textColour: toColour(0, 0, 0, 0),
			backgroundColour: toColour(0, 0, 0, 0),
		},
	});
	fiveCardPokerGUI.window.titleBarShown = false;

	fiveCardPokerGUI.window.shown = false;

	logToConsole(LOG_DEBUG, `[AGRP.GUI] Created five card poker GUI`);
}

// ===========================================================================