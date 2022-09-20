// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: 2fa.js
// DESC: Provides two factor authentication GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let twoFactorAuth = {
	window: null,
	logoImage: null,
	qrCode: null,
	messageLabel: null,
	codeLabel: null,
	codeInput: null,
	submitButton: null,
};

// ===========================================================================

function initTwoFactorAuthenticationGUI() {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Creating two factor auth GUI ...`);
	twoFactorAuth.window = mexui.window(game.width / 2 - 150, game.height / 2 - 129, 300, 258, 'LOGIN', {
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
	twoFactorAuth.window.titleBarIconSize = toVector2(0, 0);
	twoFactorAuth.window.titleBarHeight = 0;

	twoFactorAuth.qrCode = twoFactorAuth.window.image(100, 20, 100, 100, mainLogoPath, {
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	twoFactorAuth.codeLabel = twoFactorAuth.window.text(20, 135, 260, 20, 'Please enter the code sent to your email!', {
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

	twoFactorAuth.codeInput = twoFactorAuth.window.textInput(20, 170, 260, 25, '', {
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
	twoFactorAuth.codeInput.placeholder = "Code";

	twoFactorAuth.submitButton = twoFactorAuth.window.button(20, 205, 260, 30, 'SUBMIT', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(0, 0, 0, 255),
			textSize: 10.0,
			textFont: mainFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		},
	}, checkTwoFactorAuth);

	logToConsole(LOG_DEBUG, `[AGRP.GUI] Created two factor auth GUI`);
}

// ===========================================================================

function showTwoFactorAuthGUI() {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Showing two-factor authentication window`);
	setChatWindowEnabled(false);
	mexui.setInput(true);
	twoFactorAuth.window.shown = true;
	mexui.focusedControl = twoFactorAuth.codeInput;
	guiSubmitKey = checkTwoFactorAuth;
}

// ===========================================================================

function twoFactorAuthFailed(errorMessage) {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Server reports two-factor authentication failed. Reason: ${errorMessage}`);
	twoFactorAuth.messageLabel.text = errorMessage;
	twoFactorAuth.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	twoFactorAuth.codeInput.text = "";
}

// ===========================================================================

function twoFactorAuthSuccess() {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Server reports two-factor authentication was successful`);
	closeAllWindows();
}

// ===========================================================================

function checkTwoFactorAuth() {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Checking two-factor authentication with server ...`);
	sendNetworkEventToServer("agrp.2fa", twoFactorAuth.codeInput.lines[0]);
}

// ===========================================================================