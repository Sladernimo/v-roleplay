// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: newchar.js
// DESC: Provides new character creation GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let newCharacter = {
	window: null,
	messageLabel: null,
	firstNameInput: null,
	lastNameInput: null,
	createCharacterButton: null,
	mainLogoImage: null,
};

// ===========================================================================

function initNewCharacterGUI() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Creating new character GUI ...`);
	newCharacter.window = mexui.window(game.width/2-130, game.height/2-115, 300, 230, 'NEW CHARACTER', {
		main: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
			transitionTime: 500,
		},
		title: {
			textSize: 12.0,
			textFont: mainFont,
			textColour: toColour(0, 0, 0, 0),
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
		},
		icon: {
			textSize: 0.0,
			textColour: toColour(0, 0, 0, 0),
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
		}
	});
	newCharacter.window.titleBarIconSize = toVector2(0, 0);
	newCharacter.window.titleBarIconShown = false;
	newCharacter.window.titleBarShown = false;
	newCharacter.window.titleBarHeight = 30;

	newCharacter.mainLogoImage = newCharacter.window.image(80, 20, 80, 80, mainLogoPath, {
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	newCharacter.messageLabel = newCharacter.window.text(20, 100, 260, 20, 'Name your character', {
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

	newCharacter.firstNameInput = newCharacter.window.textInput(20, 125, 260, 25, '', {
		main: {
			backgroundColour: toColour(0, 0, 0, 120),
			textColour: toColour(200, 200, 200, 255),
			textSize: 10.0,
			textFont: mainFont,
		},
		caret: {
			lineColour: toColour(255, 255, 255, 255),
		},
		placeholder: {
			backgroundColour: toColour(0, 0, 0, 120),
			textColour: toColour(200, 200, 200, 200),
			textSize: 10.0,
			textFont: mainFont,
		}
	});
	newCharacter.firstNameInput.placeholder = "First Name";

	newCharacter.lastNameInput = newCharacter.window.textInput(20, 155, 260, 25, '', {
		main: {
			backgroundColour: toColour(0, 0, 0, 120),
			textColour: toColour(200, 200, 200, 255),
			textSize: 10.0,
			textFont: mainFont,
		},
		caret: {
			lineColour: toColour(255, 255, 255, 255),
		},
		placeholder: {
			backgroundColour: toColour(0, 0, 0, 120),
			textColour: toColour(150, 150, 150, 200),
			textSize: 10.0,
			textFont: mainFont,
		}
	});
	newCharacter.lastNameInput.placeholder = "Last Name";

	newCharacter.createCharacterButton = newCharacter.window.button(20, 185, 260, 25, 'CREATE CHARACTER', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(255, 255, 255, 255),
			textSize: 10.0,
			textFont: mainFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		},
	}, checkNewCharacter);
	logToConsole(LOG_DEBUG, `[VRR.GUI] Created new character GUI`);
}

// ===========================================================================

function newCharacterFailed(errorMessage) {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports new character creation failed. Reason: ${errorMessage}`);
	newCharacter.messageLabel.text = errorMessage;
	newCharacter.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	newCharacter.firstNameInput.text = "";
	newCharacter.lastNameInput.text = "";

	if(!newCharacter.window.shown) {
		closeAllWindows();
		setChatWindowEnabled(false);
		mexui.setInput(true);
		setHUDEnabled(false);
		newCharacter.window.shown = true;
	}
}

// ===========================================================================

function checkNewCharacter() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Checking new character with server ...`);
	if(newCharacter.firstNameInput.lines[0].length < 2) {
		return false;
	}

	if(newCharacter.lastNameInput.lines[0].length < 2) {
		return false;
	}

	sendNetworkEventToServer("vrr.checkNewCharacter",
		newCharacter.firstNameInput.lines[0],
		newCharacter.lastNameInput.lines[0],
	);
}

// ===========================================================================

function showNewCharacterGUI() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing new character window`);
	closeAllWindows();
	setChatWindowEnabled(false);
	mexui.setInput(true);
	newCharacter.window.shown = true;
	mexui.focusedInput = newCharacter.firstNameInput;
	guiSubmitButton = checkNewCharacter;

	showLocaleChooserGUI();
}

// ===========================================================================