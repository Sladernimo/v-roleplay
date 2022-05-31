// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: gui.js
// DESC: Provides GUI functionality and styles (using MexUI)
// TYPE: Client (JavaScript)
// ===========================================================================

var app = {};

let mainFont = "Roboto"; // "Arial"

//let mainLogoPath = (typeof gta == "undefined") ? "files/images/mafiac-logo.png" : "files/images/gtac-logo.png";
let mainLogoPath = "files/images/asshat-logo.png";

let primaryColour = [200, 200, 200];
let secondaryColour = [16, 16, 16];
let primaryTextColour = [0, 0, 0];
let focusedColour = [200, 200, 200];
let invalidValueColour = [200, 200, 200];

let focusedColourOffset = 50;

let windowAlpha = 200;
let windowTitleAlpha = 180;
let buttonAlpha = 180;
let textInputAlpha = 180;

let guiReady = false;

// ===========================================================================

let characterData = [];
let currentCharacter = 0;

let inCharacterSelectScreen = false;
let creatingCharacter = false;

// ===========================================================================

function initGUIScript() {
	logToConsole(LOG_DEBUG, "[VRR.GUI]: Initializing GUI script ...");
	logToConsole(LOG_DEBUG, "[VRR.GUI]: GUI script initialized!");
}

// ===========================================================================

function initGUI() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Initializing GUI ...`);

	initLoginGUI();
	initRegisterGUI();
	initNewCharacterGUI();
	initCharacterSelectGUI();
	initInfoDialogGUI();
	initErrorDialogGUI();
	initYesNoDialogGUI();
	initTwoFactorAuthenticationGUI();
	initListGUI();
	initResetPasswordGUI();
	initChangePasswordGUI();
	initLocaleChooserGUI();

	closeAllWindows();
	guiReady = true;

	logToConsole(LOG_DEBUG, `[VRR.GUI] All GUI created successfully!`);

	loadLocaleConfig();
	loadAllLocaleStrings();

	resetGUIStrings();
	resetLocaleChooserOptions();

	sendNetworkEventToServer("vrr.guiReady", true);
};

// ===========================================================================

function closeAllWindows() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Closing all GUI windows`);
	infoDialog.window.shown = false;
	yesNoDialog.window.shown = false;
	errorDialog.window.shown = false;
	register.window.shown = false;
	login.window.shown = false;
	newCharacter.window.shown = false;
	characterSelect.window.shown = false;
	twoFactorAuth.window.shown = false;
	listDialog.window.shown = false;
	passwordReset.window.shown = false;
	passwordChange.window.shown = false;
	localeChooser.window.shown = false;

	mexui.setInput(false);
	mexui.focusedControl = false;

	guiSubmitKey = false;
	guiLeftKey = false;
	guiRightKey = false;
	guiUpKey = false;
	guiDownKey = false;

	setChatWindowEnabled(true);
}

// ===========================================================================

function isAnyGUIActive() {
	if(!guiReady) {
		return false;
	}

	if(infoDialog.window.shown == true) {
		return true;
	}

	if(yesNoDialog.window.shown == true) {
		return true;
	}

	if(errorDialog.window.shown == true) {
		return true;
	}

	if(register.window.shown == true) {
		return true;
	}

	if(login.window.shown == true) {
		return true;
	}

	if(newCharacter.window.shown == true) {
		return true;
	}

	if(characterSelect.window.shown == true) {
		return true;
	}

	if(twoFactorAuth.window.shown == true) {
		return true;
	}

	if(listDialog.window.shown == true) {
		return true;
	}

	if(passwordReset.window.shown == true) {
		return true;
	}

	if(passwordChange.window.shown == true) {
		return true;
	}

	if(localeChooser.window.shown == true) {
		return true;
	}

	return false;
}

// ===========================================================================

function setGUIColours(red1, green1, blue1, red2, green2, blue2, red3, green3, blue3) {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Received new GUI colours from server: ${red1}, ${green1}, ${blue1} / ${red2}, ${green2}, ${blue2} / ${red3}, ${green3}, ${blue3}`);
	primaryColour = [red1, green1, blue1];
	secondaryColour = [red2, green2, blue2];
	primaryTextColour = [red3, green3, blue3];
	focusedColour = [red1+focusedColourOffset, green1+focusedColourOffset, blue1+focusedColourOffset];

	initGUI();
}

// ===========================================================================

function hideAllGUI() {
	closeAllWindows();
	setChatWindowEnabled(true);
	guiSubmitKey = false;
}

// ===========================================================================

function processGUIKeyPress(keyCode) {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Processing key press: ${keyCode}`);

	if(!isAnyGUIActive()) {
		logToConsole(LOG_DEBUG, `[VRR.GUI] GUI is not active. Cancelling keypress processing.`);
		return false;
	}

	if(keyCode == SDLK_RETURN || keyCode == SDLK_RETURN2) {
		logToConsole(LOG_DEBUG, `[VRR.GUI] Key press is submit (${guiSubmitKey})`);
		if(guiSubmitKey != false) {
			logToConsole(LOG_DEBUG, `[VRR.GUI] Calling submit key function`);
			guiSubmitKey.call();
		}
	} else if(keyCode == getKeyIdFromParams("left") || keyCode == getKeyIdFromParams("a")) {
		logToConsole(LOG_DEBUG, `[VRR.GUI] Key press is left (${guiLeftKey})`);
		if(guiLeftKey != false) {
			logToConsole(LOG_DEBUG, `[VRR.GUI] Calling left key function`);
			guiLeftKey.call();
		}
	} else if(keyCode == getKeyIdFromParams("right") || keyCode == getKeyIdFromParams("d")) {
		logToConsole(LOG_DEBUG, `[VRR.GUI] Key press is right (${guiRightKey})`);
		if(guiRightKey != false) {
			logToConsole(LOG_DEBUG, `[VRR.GUI] Calling right key function`);
			guiRightKey.call();
		}
	} else if(keyCode == getKeyIdFromParams("down") || keyCode == getKeyIdFromParams("s")) {
		logToConsole(LOG_DEBUG, `[VRR.GUI] Key press is down (${guiDownKey})`);
		if(guiDownKey != false) {
			logToConsole(LOG_DEBUG, `[VRR.GUI] Calling down key function`);
			guiDownKey.call();
		}
	} else if(keyCode == getKeyIdFromParams("up") || keyCode == getKeyIdFromParams("w")) {
		logToConsole(LOG_DEBUG, `[VRR.GUI] Key press is up (${guiUpKey})`);
		if(guiUpKey != false) {
			logToConsole(LOG_DEBUG, `[VRR.GUI] Calling up key function`);
			guiUpKey.call();
		}
	}
}

// ===========================================================================

function processToggleGUIKeyPress(keyCode) {
	if(keyCode == disableGUIKey) {
		sendNetworkEventToServer("vrr.toggleGUI");
	}
}

// ===========================================================================

function resetGUIStrings() {
	// Login GUI
	login.messageLabel.text = getLocaleString("GUILoginWindowLabelEnterPassword");
	login.passwordInput.placeholder = getLocaleString("GUILoginWindowPasswordPlaceholder");
	login.loginButton.text = toUpperCase(getLocaleString("GUILoginWindowSubmitButton"));
	login.forgotPasswordButton.text = toUpperCase(getLocaleString("GUILoginWindowResetPasswordButton"));
	login.resetPasswordLabel.text = getLocaleString("GUILoginWindowForgotPasswordLabel");

	// Register GUI
	register.messageLabel.text = getLocaleString("GUIRegisterWindowLabelCreateAccount");
	register.passwordInput.placeholder = getLocaleString("GUIRegisterWindowPasswordPlaceholder");
	register.confirmPasswordInput.placeholder = getLocaleString("GUIRegisterWindowConfirmPasswordPlaceholder");
	register.emailInput.placeholder = getLocaleString("GUIRegisterWindowEmailPlaceholder");
	register.registerButton.text = toUpperCase(getLocaleString("GUIRegisterWindowSubmitButton"));

	// Change Password GUI
	passwordChange.window.title = toUpperCase(getLocaleString("GUIChangePasswordWindowTitle"));
	passwordChange.messageLabel.text = getLocaleString("GUIChangePasswordPasswordLabel");
	passwordChange.passwordInput.placeholder = getLocaleString("GUIChangePasswordPasswordPlaceholder");
	passwordChange.confirmPasswordInput.placeholder = getLocaleString("GUIChangePasswordConfirmPasswordPlaceholder");
	passwordChange.submitButton.text = toUpperCase(getLocaleString("GUIChangePasswordSubmitButton"));

	// Reset Password GUI
	passwordReset.messageLabel.text = toUpperCase(getLocaleString("GUIResetPasswordConfirmEmailLabel"));
	passwordReset.emailInput.placeholder = getLocaleString("GUIResetPasswordEmailPlaceholder");
	passwordReset.resetPasswordButton.text = toUpperCase(getLocaleString("GUIResetPasswordSubmitButton"));
	passwordReset.backToLoginButton.text = toUpperCase(getLocaleString("GUIResetPasswordLoginButton"));
	passwordReset.backToLoginLabel.text = getLocaleString("GUIResetPasswordRememberMessage");

	// Character Selection GUI
	characterSelect.window.title = toUpperCase(getLocaleString("GUICharacterSelectWindowTitle"));
	characterSelect.cashText.text = getLocaleString("GUICharacterSelectMoneyLabel", "0");
	characterSelect.clanText.text = getLocaleString("GUICharacterSelectClanLabel", "None");
	characterSelect.lastPlayedText.text = getLocaleString("GUICharacterSelectLastPlayedLabel", "Never");
	characterSelect.previousCharacterButton.text = toUpperCase(getLocaleString("GUIPreviousCharacterButton"));
	characterSelect.nextCharacterButton.text = toUpperCase(getLocaleString("GUINextCharacterButton"));
	characterSelect.selectCharacterButton.text = toUpperCase(getLocaleString("GUIPlayAsCharacterButton"));
	characterSelect.newCharacterButton.text = toUpperCase(getLocaleString("GUINewCharacterButton"));

	// Character Creation GUI
	newCharacter.messageLabel.text = getLocaleString("GUINewCharacterMessageLabel");
	newCharacter.firstNameInput.placeholder = getLocaleString("GUINewCharacterFirstNamePlaceholder");
	newCharacter.lastNameInput.placeholder = getLocaleString("GUINewCharacterLastNamePlaceholder");
	newCharacter.createCharacterButton.text = toUpperCase(getLocaleString("GUINewCharacterSubmitButton"));
}