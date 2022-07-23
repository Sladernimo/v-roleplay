// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: betting.js
// DESC: Provides betting GUI (used for multiple casino games)
// TYPE: Client (JavaScript)
// ===========================================================================

let bettingGUI = {
	window: null,
	amountLabel: null,
	fiveThousandLabel: null,
	fiveThousandPlusButton: null,
	fiveThousandMinusButton: null,
	oneThousandLabel: null,
	oneThousandPlusButton: null,
	oneThousandMinusButton: null,
	fiveHundredPlusButton: null,
	fiveHundredMinusButton: null,
	oneHundredLabel: null,
	oneHundredPlusButton: null,
	oneHundredMinusButton: null,
	fiftyLabel: null,
	fiftyPlusButton: null,
	fiftyMinusButton: null,
	twentyLabel: null,
	twentyPlusButton: null,
	twentyMinusButton: null,
	tenLabel: null,
	tenPlusButton: null,
	tenMinusButton: null,
	fiveLabel: null,
	fivePlusButton: null,
	fiveMinusButton: null,
	oneLabel: null,
	onePlusButton: null,
	oneMinusButton: null,
}

// ===========================================================================

function initBettingGUI() {
	bettingGUI.window = mexui.window(getScreenWidth() / 2 - 125, getScreenHeight() / 2 - 250, 250, 500, 'BETTING', {
		main: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
			transitionTime: 500,
		},
		title: {
			textSize: 0.0,
			textColour: toColour(0, 0, 0, 0),
		},
		icon: {
			textSize: 0.0,
			textColour: toColour(0, 0, 0, 0),
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});
	bettingGUI.window.titleBarIconSize = toVector2(0, 0);
	bettingGUI.window.titleBarHeight = 0;
	bettingGUI.window.titleBarShown = false;

	bettingGUI.amountLabel = bettingGUI.window.text(10, 20, 230, 20, 'Amount: 0', {
		main: {
			textSize: 20.0,
			textAlign: 0.5,
			textColour: toColour(200, 200, 200, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	bettingGUI.oneLabel = bettingGUI.window.text(10, 50, 230, 20, '1', {
		main: {
			textSize: 10.0,
			textAlign: 0.5,
			textColour: toColour(200, 200, 200, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	bettingGUI.fiveLabel = bettingGUI.window.text(10, 65, 230, 20, '1', {
		main: {
			textSize: 10.0,
			textAlign: 0.5,
			textColour: toColour(200, 200, 200, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	bettingGUI.tenLabel = bettingGUI.window.text(10, 80, 230, 20, '1', {
		main: {
			textSize: 10.0,
			textAlign: 0.5,
			textColour: toColour(200, 200, 200, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	bettingGUI.fiftyLabel = bettingGUI.window.text(10, 95, 230, 20, '1', {
		main: {
			textSize: 10.0,
			textAlign: 0.5,
			textColour: toColour(200, 200, 200, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	bettingGUI.hundredLabel = bettingGUI.window.text(10, 95, 230, 20, '1', {
		main: {
			textSize: 10.0,
			textAlign: 0.5,
			textColour: toColour(200, 200, 200, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	bettingGUI.window.shown = false;
}

// ===========================================================================

function showBettingGUI() {

}

// ===========================================================================