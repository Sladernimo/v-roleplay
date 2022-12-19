// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: blackjack.js
// DESC: Provides blackjack game GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let blackJackGUI = {
	window: null,
	dealerHand: [],
	playerHand: [],
};

// ===========================================================================

let playerCards = [];
let dealerCards = [];

// ===========================================================================

function initBlackJackGUI() {
	// Render a blackjack game in MexUI
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Creating blackjack GUI ...`);
	blackJackGUI.window = mexui.window(game.width / 2 - 200, game.height - 150, 400, 400, 'Blackjack', {
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
	blackJackGUI.window.titleBarShown = false;

	blackJackGUI.window.shown = false;

	logToConsole(LOG_DEBUG, `[AGRP.GUI] Created blackjack GUI`);
}

// ===========================================================================