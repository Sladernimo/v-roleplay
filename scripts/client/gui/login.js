// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: login.js
// DESC: Provides login GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let login = {
	window: null,
	logoImage: null,
	messageLabel: null,
	passwordInput: null,
	loginButton: null,
	forgotPasswordButton: null,
	resetPasswordLabel: null,
};

// ===========================================================================

let loginHTML =
`<html>
    <head>
        <title>Asshat Gaming Roleplay: Login</title>
        <style type="text/css" rel="stylesheet">
            .input-box
            {
                font-family: "Roboto";
                font-size: 14px;
                border-style: solid;
                border-colour: #0066AA;
                border-radius: 2px;
                color: #0066AA;
            };
        </style>
    </head>
    <body>
    </body>
</html>`;

// ===========================================================================

function initLoginGUI() {
    logToConsole(LOG_DEBUG, `[VRR.GUI] Creating login GUI ...`);
	login.window = mexui.window(getScreenWidth()/2-150, getScreenHeight()/2-135, 300, 275, 'LOGIN', {
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
	login.window.titleBarIconSize = toVector2(0,0);
	login.window.titleBarHeight = 0;
	login.window.titleBarShown = false;

	login.logoImage = login.window.image(100, 20, 100, 100, mainLogoPath, {
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	login.messageLabel = login.window.text(20, 135, 260, 20, 'Please enter your password!', {
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

	login.passwordInput = login.window.textInput(20, 170, 260, 25, '', {
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
	login.passwordInput.masked = true;
	login.passwordInput.placeholder = "Password";

	login.loginButton = login.window.button(20, 205, 260, 30, 'LOGIN', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(0, 0, 0, 255),
			textSize: 12.0,
			textFont: mainFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		},
	}, checkLogin);

	login.forgotPasswordButton = login.window.button(180, 240, 100, 15, 'RESET PASS', {
		main: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
			textColour: toColour(0, 0, 0, 255),
			textSize: 8.0,
			textFont: mainFont,
			textAlign: 0.5,
		},
		focused: {
			borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
		},
	}, switchToPasswordResetGUI);

	login.resetPasswordLabel = login.window.text(110, 240, 60, 15, 'Forgot your password?', {
		main: {
			textSize: 8.0,
			textAlign: 1.0,
			textColour: toColour(180, 180, 180, 255),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	logToConsole(LOG_DEBUG, `[VRR.GUI] Created login GUI`);
}

// ===========================================================================

function showLoginGUI() {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[VRR.GUI] Showing login window`);
	setChatWindowEnabled(false);
	mexui.setInput(true);
	login.window.shown = true;
	mexui.focusedControl = login.passwordInput;
	guiSubmitKey = checkLogin;

	showLocaleChooserGUI(new Vec2(getScreenWidth()/2-(localeChooser.window.size.x/2), login.window.position.y+login.window.size.y+20));
	//showSmallGameMessage(`If you don't have a mouse cursor, press ${toUpperCase(getKeyNameFromId(disableGUIKey))} to disable GUI`, COLOUR_WHITE, 7500);
}

// ===========================================================================

function checkLogin() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Checking login with server ...`);
	sendNetworkEventToServer("vrr.checkLogin", login.passwordInput.lines[0]);
}

// ===========================================================================

function loginFailed(errorMessage) {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports login failed`);
	login.messageLabel.text = errorMessage;
	login.messageLabel.styles.main.textColour = toColour(180, 32, 32, 255);
	login.passwordInput.text = "";
}

// ===========================================================================

function loginSuccess() {
	logToConsole(LOG_DEBUG, `[VRR.GUI] Server reports login was successful`);
	guiSubmitKey = false;
	closeAllWindows();
}

// ===========================================================================

function switchToPasswordResetGUI() {
	//closeAllWindows();
	//logToConsole(LOG_DEBUG, `[VRR.GUI] Showing password reset dialog window`);
	//showResetPasswordGUI();
	sendNetworkEventToServer("vrr.checkResetPassword", "");
	return false;
}

// ===========================================================================