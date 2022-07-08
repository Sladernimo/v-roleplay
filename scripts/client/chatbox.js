// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: chatbox.js
// DESC: Provides extra chatbox features
// TYPE: Client (JavaScript)
// ===========================================================================

// ===========================================================================

let chatBoxTimeStampsEnabled = false;
let chatBoxHistory = [];
let bottomMessageIndex = 0;
let maxChatBoxHistory = 500;

let scrollAmount = 1;
let maxChatBoxLines = 6;

let chatAutoHideDelay = 0;
let chatLastUse = 0;

let scrollUpKey = false;
let scrollDownKey = false;

// ===========================================================================

function initChatBoxScript() {
	logToConsole(LOG_DEBUG, "[VRR.ChatBox]: Initializing chatbox script ...");
	scrollUpKey = getKeyIdFromParams("pageup");
	scrollDownKey = getKeyIdFromParams("pagedown");
	bindChatBoxKeys();
	logToConsole(LOG_DEBUG, "[VRR.ChatBox]: Chatbox script initialized!");
}

// ===========================================================================

function bindChatBoxKeys() {
	bindKey(toInteger(scrollUpKey), KEYSTATE_DOWN, chatBoxScrollUp);
	bindKey(toInteger(scrollDownKey), KEYSTATE_DOWN, chatBoxScrollDown);
}

// ===========================================================================

function unBindChatBoxKeys() {
	unbindKey(toInteger(scrollUpKey));
	unbindKey(toInteger(scrollDownKey));
}

// ===========================================================================

function receiveChatBoxMessageFromServer(messageString, colour) {
	logToConsole(LOG_DEBUG, `[VRR.ChatBox]: Received chatbox message from server: ${messageString}`);

	// Just in case it's hidden by auto hide
	//setChatWindowEnabled(true);

	let timeStamp = findResourceByName("agrp_time").exports.getCurrentUnixTimeStampSquirrel();

	addToChatBoxHistory(messageString, colour, timeStamp);

	//let unixTimeStampMS = new Date().getTime();
	//let timeStampDate = new Date(unixTimeStampMS);
	//let timeStampDate = new Date(timeStamp);
	//let timeStampText = `${timeStampDate.getHours()}:${timeStampDate.getMinutes()}:${timeStampDate.getSeconds()}`;

	let outputString = messageString;
	let timeStampString = "";
	if (chatBoxTimeStampsEnabled == true) {
		timeStampString = `{TIMESTAMPCOLOUR}[${findResourceByName("agrp_time").exports.getTimeStampOutput(timeStamp)}]{MAINCOLOUR}`;
	}

	logToConsole(LOG_DEBUG, `[VRR.ChatBox]: Changed colours in string: ${outputString}`);
	let colouredString = replaceColoursInMessage(`${timeStampString}${outputString}`);

	message(colouredString, colour);
	bottomMessageIndex = chatBoxHistory.length - 1;

	chatLastUse = getCurrentUnixTimestamp();
}

// ===========================================================================

function setChatScrollLines(amount) {
	scrollAmount = amount;
}

// ===========================================================================

function setChatBoxTimeStampsState(state) {
	chatBoxTimeStampsEnabled = state;
	updateChatBox();
}

// ===========================================================================

function setChatAutoHideDelay(delay) {
	chatAutoHideDelay = delay * 1000;
}

// ===========================================================================

function addToChatBoxHistory(messageString, colour, timeStamp) {
	chatBoxHistory.push([messageString, colour, timeStamp]);
}

// ===========================================================================

function chatBoxScrollUp() {
	if (bottomMessageIndex > maxChatBoxLines) {
		bottomMessageIndex = bottomMessageIndex - scrollAmount;
		updateChatBox();
	}
}

// ===========================================================================

function chatBoxScrollDown() {
	if (bottomMessageIndex < chatBoxHistory.length - 1) {
		bottomMessageIndex = bottomMessageIndex + scrollAmount;
		updateChatBox();
	}
}

// ===========================================================================

function clearChatBox() {
	for (let i = 0; i <= maxChatBoxLines; i++) {
		message("", COLOUR_WHITE);
	}
}

// ===========================================================================

function updateChatBox() {
	clearChatBox();
	for (let i = bottomMessageIndex - maxChatBoxLines; i <= bottomMessageIndex; i++) {
		if (typeof chatBoxHistory[i] != "undefined") {
			let outputString = chatBoxHistory[i][0];
			if (chatBoxTimeStampsEnabled == true) {
				//let timeStampDate = new Date(chatBoxHistory[i][2]);
				//let timeStampText = `${timeStampDate.getHours()}:${timeStampDate.getMinutes()}:${timeStampDate.getSeconds()}`;
				let timeStampText = findResourceByName("agrp_time").exports.getTimeStampOutput(chatBoxHistory[i][2]);

				outputString = `{TIMESTAMPCOLOUR}[${timeStampText}]{MAINCOLOUR} ${chatBoxHistory[i][0]}`;
			}

			outputString = replaceColoursInMessage(outputString);
			message(outputString, chatBoxHistory[i][1]);
		} else {
			message("", COLOUR_WHITE);
		}
	}
	chatLastUse = getCurrentUnixTimestamp();
}

// ===========================================================================

function processMouseWheelForChatBox(mouseId, deltaCoordinates, flipped) {
	// There isn't a way to detect whether chat input is active, but mouse cursor is forced shown when typing so ¯\_(ツ)_/¯
	if (!gui.cursorEnabled) {
		return false;
	}

	if (!flipped) {
		if (deltaCoordinates.y > 0) {
			chatBoxScrollUp();
		} else {
			chatBoxScrollDown();
		}
	} else {
		if (deltaCoordinates.y > 0) {
			chatBoxScrollDown();
		} else {
			chatBoxScrollUp();
		}
	}
}

// ===========================================================================

function checkChatAutoHide() {
	return false;

	// Make sure chat input isn't active
	if (gui.cursorEnabled) {
		return false;
	}

	// Don't process auto-hide if it's disabled
	if (chatAutoHideDelay == 0) {
		return false;
	}

	if (getCurrentUnixTimestamp() - chatLastUse >= chatAutoHideDelay) {
		setChatWindowEnabled(false);
	}
}

// ===========================================================================