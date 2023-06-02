// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
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
	logToConsole(LOG_DEBUG, `[V.RP.GUI] Creating locale chooser GUI ...`);
	localeChooser.window = mexui.window(game.width / 2 - 200, game.height - 150, 60, 60, 'Choose a language', {
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

	localeChooser.window.shown = false;

	//resetLocaleChooserOptions();

	logToConsole(LOG_DEBUG, `[V.RP.GUI] Created locale chooser GUI`);
}

// ===========================================================================

function closeLocaleChooserGUI() {
	logToConsole(LOG_DEBUG, `[V.RP.GUI] Closing locale chooser window`);
	localeChooser.window.shown = false;
	for (let i in localeChooser.flagImages) {
		localeChooser.flagImages[i].shown = false;
	}
	mexui.setInput(false);
}

// ===========================================================================

function showLocaleChooserGUI(position = toVector2(0.0, 0.0)) {
	logToConsole(LOG_DEBUG, `[V.RP.GUI] Showing locale chooser window`);
	if (position.x != 0.0 && position.y != 0.0) {
		localeChooser.window.position = position;
	} else {
		localeChooser.window.position = toVector2((getScreenWidth() / 2) - (localeChooser.window.size.x / 2), getScreenHeight() - 100);
	}

	//closeAllWindows();
	mexui.setInput(true);

	for (let i in localeChooser.flagImages) {
		localeChooser.flagImages[i].shown = true;
	}

	localeChooser.window.shown = true;
}

// ===========================================================================

function toggleLocaleChooserGUI() {
	if (localeChooser.window.shown == true) {
		closeLocaleChooserGUI();
	} else {
		showLocaleChooserGUI();
	}
}

// ===========================================================================

function localeChooserSetLocale(localeId) {
	logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.GUI] Asking server to change locale to ${localeId}`);
	sendLocaleSelectToServer(localeId);
}

// ===========================================================================

function resetLocaleChooserOptions() {
	logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.GUI] Resetting locale chooser options`);

	// Crashed on Mafia 1, disable for now
	if (getGame() == V_GAME_MAFIA_ONE) {
		return false;
	}

	// let tempLocaleOptions = serverData.localeOptions; // getAvailableLocaleOptions();
	let tempLocaleOptions = getAvailableLocaleOptions();

	localeChooser.window.size = toVector2((tempLocaleOptions.length * (flagImageSize.x + flagImageGap.x)) + flagImageGap.x, flagImageSize.y + flagImageGap.y * 2);
	localeChooser.window.position = toVector2((getScreenWidth() / 2) - (localeChooser.window.size.x / 2), getScreenHeight() - 100);

	for (let i in localeChooser.flagImages) {
		localeChooser.flagImages[i].remove();
	}

	for (let i in tempLocaleOptions) {
		tempLocaleOptions
		let imagePath = `files/images/flags/${tempLocaleOptions[i].flagImageFile}`;
		let tempImage = localeChooser.window.image((i * (flagImageSize.x + flagImageGap.x)) + flagImageGap.x, flagImageGap.y, flagImageSize.x, flagImageSize.y, imagePath, {
			focused: {
				borderColour: toColour(0, 0, 0, 0),
			},
		}, function () {
			localeChooserSetLocale(tempLocaleOptions[i].id);
		});

		if (tempImage.image != false && tempImage.image != null) {
			localeChooser.flagImages.push(tempImage);
			tempImage.shown = false;
		}

		logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.GUI] Created locale chooser option ${tempLocaleOptions[i].englishName} with image ${imagePath}`);

		//localeChooser.activeRingImages.push(activeRingImage);
	}
}

// ===========================================================================