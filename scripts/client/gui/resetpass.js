// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: resetpass.js
// DESC: Provides password reset GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let resetPassword = {
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
    logToConsole(LOG_DEBUG, `[VRR.GUI] Creating password reset GUI ...`);
	resetPassword.window = mexui.window(game.width/2-150, game.height/2-130, 300, 260, 'RESET PASSWORD', {
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
	resetPassword.window.titleBarIconSize = toVector2(0,0);
	resetPassword.window.titleBarHeight = 0;
	resetPassword.window.titleBarShown = false;

	resetPassword.logoImage = resetPassword.window.image(5, 20, 290, 80, mainLogoPath, {
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	resetPassword.messageLabel = resetPassword.window.text(20, 135, 260, 20, 'Please confirm your email', {
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

	resetPassword.emailInput = resetPassword.window.textInput(20, 170, 260, 25, '', {
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
	resetPassword.emailInput.placeholder = "Email";

	resetPassword.resetPasswordButton = resetPassword.window.button(20, 205, 260, 30, 'RESET PASSWORD', {
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

	resetPassword.backToLoginButton = resetPassword.window.button(200, 240, 80, 15, 'LOGIN', {
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

	resetPassword.backToLoginLabel = resetPassword.window.text(125, 240, 60, 15, 'Remember your password?', {
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

	logToConsole(LOG_DEBUG, `[VRR.GUI] Created password reset GUI`);
}

// ===========================================================================

function showResetPasswordGUI() {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing password reset window`);
	setChatWindowEnabled(false);
	mexui.setInput(true);
	resetPassword.window.shown = true;
	mexui.focusedControl = resetPassword.emailInput;
	guiSubmitButton = checkResetPassword;
	//showSmallGameMessage(`If you don't have a mouse cursor, press ${toUpperCase(getKeyNameFromId(disableGUIKey))} to disable GUI`, COLOUR_WHITE, 7500);
}

// ===========================================================================

function checkResetPassword() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Checking password reset with server ...`);
	sendNetworkEventToServer("vrr.checkResetPassword", resetPassword.emailInput.lines[0]);
}

// ===========================================================================

function resetPasswordFailed(errorMessage) {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports password reset failed`);
	resetPassword.messageLabel.text = errorMessage;
	resetPassword.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	resetPassword.emailInput.text = "";
}

// ===========================================================================

function resetPasswordCodeInputGUI() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports password reset was successful`);

	resetPassword.messageLabel.text = "Check your email for a verification code";
	resetPassword.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	resetPassword.emailInput.text = "";
	resetPassword.emailInput.placeholder = "Verification Code";

	guiSubmitButton = checkResetPassword;
	closeAllWindows();
}

// ===========================================================================

function switchToLoginGUI() {
	guiSubmitKey = false;
    closeAllWindows();
    showLoginGUI();
}

// ===========================================================================