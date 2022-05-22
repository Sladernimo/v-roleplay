// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: info.js
// DESC: Provides info dialog box GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let infoDialog = {
	window: null,
	messageLabel: null,
	okayButton: null,
};

// ===========================================================================

function initInfoDialogGUI() {
    logToConsole(LOG_DEBUG, `[VRR.GUI] Creating info dialog GUI ...`);
	infoDialog.window = mexui.window(getScreenWidth()/2-200, getScreenHeight()/2-70, 400, 140, 'Information', {
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

	infoDialog.messageLabel = infoDialog.window.text(15, 50, 370, 20, 'Information Message', {
		main: {
			textSize: 10.0,
			textAlign: 0.5,
			textColour: toColour(255, 255, 255, 220),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	infoDialog.okayButton = infoDialog.window.button(5, 105, 390, 30, 'OK', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			textSize: 10.0,
			textFont: mainFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], 255),
		},
	}, closeInfoDialog);
	logToConsole(LOG_DEBUG, `[VRR.GUI] Created info dialog GUI`);
}

// ===========================================================================

function closeInfoDialog() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Closing info dialog`);
	infoDialog.window.shown = false;
	mexui.setInput(false);
}

// ===========================================================================

function showInfoGUI(infoMessage, infoTitle, buttonText) {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing info dialog window. Info: ${infoTitle} - ${infoMessage}`);
	mexui.setInput(true);
	infoDialog.messageLabel.text = infoMessage;
	infoDialog.okayButton.text = buttonText;
	infoDialog.window.title = infoTitle;
	infoDialog.window.shown = true;
}

// ===========================================================================