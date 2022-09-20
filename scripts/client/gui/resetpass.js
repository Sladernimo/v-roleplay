// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: resetpass.js
// DESC: Provides password reset GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let passwordReset = {
	window: null,
	logoImage: null,
	messageLabel: null,
	emailInput: null,
	resetPasswordButton: null,
	backToLoginButton: null,
	backToLoginLabel: null,
};

// ===========================================================================

function initResetPasswordGUI() {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Creating password reset GUI ...`);
	passwordReset.window = mexui.window(getScreenWidth() / 2 - 150, getScreenHeight() / 2 - 135, 300, 275, 'RESET PASSWORD', {
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
	passwordReset.window.titleBarIconSize = toVector2(0, 0);
	passwordReset.window.titleBarHeight = 0;
	passwordReset.window.titleBarShown = false;

	passwordReset.logoImage = passwordReset.window.image(100, 20, 100, 100, mainLogoPath, {
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	passwordReset.messageLabel = passwordReset.window.text(20, 135, 260, 20, 'Please confirm your email', {
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

	passwordReset.emailInput = passwordReset.window.textInput(20, 170, 260, 25, '', {
		main: {
			backgroundColour: toColour(0, 0, 0, 120),
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], textInputAlpha),
			textColour: toColour(200, 200, 200, 255),
			textSize: 10.0,
			textFont: mainFont,
		},
		caret: {
			lineColour: toColour(255, 255, 255, 255),
		},
		placeholder: {
			textColour: toColour(200, 200, 200, 150),
			textSize: 10.0,
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], 255),
		},
	});
	passwordReset.emailInput.placeholder = "Email";

	passwordReset.resetPasswordButton = passwordReset.window.button(20, 205, 260, 30, 'RESET PASSWORD', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			textSize: 12.0,
			textFont: mainFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		},
	}, checkResetPassword);

	passwordReset.backToLoginButton = passwordReset.window.button(200, 240, 80, 15, 'LOGIN', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			textSize: 8.0,
			textFont: mainFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		},
	}, switchToLoginGUI);

	passwordReset.backToLoginLabel = passwordReset.window.text(110, 240, 60, 15, 'Remember your password?', {
		main: {
			textSize: 8.0,
			textAlign: 1.0,
			textColour: toColour(200, 200, 200, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	logToConsole(LOG_DEBUG, `[AGRP.GUI] Created password reset GUI`);
}

// ===========================================================================

function showResetPasswordGUI() {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Showing password reset window`);
	setChatWindowEnabled(false);
	mexui.setInput(true);
	passwordReset.window.shown = true;
	mexui.focusedControl = passwordReset.emailInput;
	guiSubmitKey = checkResetPassword;

	showLocaleChooserGUI(new Vec2(getScreenWidth() / 2 - (localeChooser.window.size.x / 2), passwordReset.window.position.y + passwordReset.window.size.y + 20));
	//showSmallGameMessage(`If you don't have a mouse cursor, press ${toUpperCase(getKeyNameFromId(disableGUIKey))} to disable GUI`, COLOUR_WHITE, 7500);
}

// ===========================================================================

function checkResetPassword() {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Checking password reset with server (${passwordReset.emailInput.lines[0]}) ...`);
	sendNetworkEventToServer("agrp.checkResetPassword", passwordReset.emailInput.lines[0]);
}

// ===========================================================================

function resetPasswordFailed(errorMessage) {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Server reports password reset failed`);
	passwordReset.messageLabel.text = errorMessage;
	passwordReset.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	passwordReset.emailInput.text = "";
}

// ===========================================================================

function resetPasswordCodeInputGUI() {
	logToConsole(LOG_DEBUG | LOG_WARN, `[AGRP.GUI] Server reports password reset email confirmation was successful. Asking for code ...`);
	closeAllWindows();

	passwordReset.messageLabel.text = getLocaleString("GUIResetPasswordCodeInputLabel");
	//passwordReset.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	passwordReset.emailInput.lines[0] = "";
	passwordReset.emailInput.placeholder = getLocaleString("GUIResetPasswordCodePlaceholder");

	guiSubmitKey = checkResetPassword;
	showResetPasswordGUI();
}

// ===========================================================================

function resetPasswordEmailInputGUI() {
	logToConsole(LOG_DEBUG | LOG_WARN, `[AGRP.GUI] Server reports password reset request was approved. Asking for email ...`);
	closeAllWindows();

	passwordReset.messageLabel.text = getLocaleString("GUIResetPasswordConfirmEmailLabel");
	//passwordReset.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	passwordReset.emailInput.text = "";
	passwordReset.emailInput.placeholder = getLocaleString("GUIResetPasswordEmailPlaceholder");

	guiSubmitKey = checkResetPassword;
	showResetPasswordGUI();
}

// ===========================================================================

function switchToLoginGUI() {
	guiSubmitKey = false;
	closeAllWindows();
	showLoginGUI();
}

// ===========================================================================