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
	flagImages: [],
	activeRingImages: [],
};

let flagImageSize = toVector2(30, 30);
let flagImageGap = toVector2(5, 5);

// ===========================================================================

function initLocaleChooserGUI() {
    logToConsole(LOG_DEBUG, `[VRR.GUI] Creating locale chooser GUI ...`);
	localeChooser.window = mexui.window(game.width/2-200, game.height-150, 60, 60, 'Choose a language', {
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
	localeChooser.window.titleBarShown = false;

	loadLocaleConfig();

	logToConsole(LOG_DEBUG, `[VRR.GUI] Created locale chooser GUI`);
}

// ===========================================================================

function closeLocaleChooserGUI() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Closing locale chooser window`);
	localeChooser.window.shown = false;
	mexui.setInput(false);
}

// ===========================================================================

function showLocaleChooserGUI(position = toVector2(0.0, 0.0)) {
	if(position.x != 0.0 && position.y != 0.0) {
		localeChooser.window.position = position;
	} else {
		localeChooser.window.position = toVector2((getScreenWidth()/2)-(localeChooser.window.size.x/2), getScreenHeight()-100);
	}

	//closeAllWindows();
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing locale chooser window`);
	mexui.setInput(true);
	localeChooser.window.shown = true;
}

// ===========================================================================

function toggleLocaleChooserGUI() {
	if(localeChooser.window.shown) {
		closeLocaleChooserGUI();
	} else {
		showLocaleChooserGUI();
	}
}

// ===========================================================================

function localeChooserSetLocale(localeId) {
	logToConsole(LOG_DEBUG|LOG_WARN, `[VRR.GUI] Asking server to change locale to ${localeId}`);
	sendLocaleSelectToServer(localeId);
}

// ===========================================================================

function resetLocaleChooserOptions() {
	logToConsole(LOG_DEBUG|LOG_WARN, `[VRR.GUI] Resetting locale chooser options`);

	// let tempLocaleOptions = getServerData().localeOptions; // getAvailableLocaleOptions();
	let tempLocaleOptions = getAvailableLocaleOptions();

	localeChooser.window.size = toVector2((tempLocaleOptions.length*(flagImageSize.x+flagImageGap.x))+flagImageGap.x, flagImageSize.y+flagImageGap.y*2);
	localeChooser.window.position = toVector2((getScreenWidth()/2)-(localeChooser.window.size.x/2), getScreenHeight()-100);

	for(let i in localeChooser.flagImages) {
		localeChooser.flagImages[i].remove();
	}

	for(let i in tempLocaleOptions) {
		let imagePath = `files/images/flags/${tempLocaleOptions[i].flagImageFile}`;
		localeChooser.flagImages[i] = localeChooser.window.image((i*(flagImageSize.x+flagImageGap.x))+flagImageGap.x, flagImageGap.y, flagImageSize.x, flagImageSize.y, imagePath, {
			focused: {
				borderColour: toColour(0, 0, 0, 0),
			},
		}, function() {
			localeChooserSetLocale(tempLocaleOptions[i].id);
		});

		logToConsole(LOG_DEBUG|LOG_WARN, `[VRR.GUI] Created locale chooser option ${tempLocaleOptions[i].englishName} with image ${imagePath}`);

		//localeChooser.activeRingImages.push(activeRingImage);
	}
}

// ===========================================================================