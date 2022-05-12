// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: localechooser.js
// DESC: Provides locale chooser GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let localeChooser = {
	window: null,
	flagImages: []
};

// ===========================================================================

function initLocaleChooserGUI() {
    logToConsole(LOG_DEBUG, `[VRR.GUI] Creating locale chooser GUI ...`);
	localeChooser.window = mexui.window(game.width/2-200, game.height/2-70, 400, 140, 'Choose a language', {
		main: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
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
	login.window.titleBarShown = false;

	for(let i in localeOptions) {
		let flagImage = localeChooser.window.image(25, 25, 100, 100, localeOptions[i].flagImage, {
			focused: {
				borderColour: toColour(0, 0, 0, 0),
			},
		});

		flagImage.callback = function() {
			localeChooserSetLocale(localeOptions[i].locale);
		}

		localeChooser.flagImages.push(flagImage);
	}

	logToConsole(LOG_DEBUG, `[VRR.GUI] Created locale chooser GUI`);
}

// ===========================================================================

function closeLocaleChooser() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Closing locale chooser window`);
	localeChooser.window.shown = false;
	mexui.setInput(false);
}

// ===========================================================================

function showLocaleChooser() {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing locale chooser window`);
	mexui.setInput(true);
}

// ===========================================================================