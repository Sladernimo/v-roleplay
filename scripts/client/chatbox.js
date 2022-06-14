// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: chatbox.js
// DESC: Provides extra chatbox features
// TYPE: Client (JavaScript)
// ===========================================================================

// ===========================================================================

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

	let colouredString = replaceColoursInMessage(messageString);

	logToConsole(LOG_DEBUG, `[VRR.ChatBox]: Changed colours in string: ${colouredString}`);

	addToChatBoxHistory(colouredString, colour);
	//if(bottomMessageIndex >= chatBoxHistory.length-1) {
		message(colouredString, colour);
		bottomMessageIndex = chatBoxHistory.length-1;
	//}

	chatLastUse = getCurrentUnixTimestamp();
}

// ===========================================================================

function setChatScrollLines(amount) {
	scrollAmount = amount;
}

// ===========================================================================

function setChatAutoHideDelay(delay) {
	chatAutoHideDelay = delay*1000;
}

// ===========================================================================

function addToChatBoxHistory(messageString, colour) {
	chatBoxHistory.push([messageString, colour]);
}

// ===========================================================================

function chatBoxScrollUp() {
	if(bottomMessageIndex > maxChatBoxLines) {
		bottomMessageIndex = bottomMessageIndex-scrollAmount;
		updateChatBox();
	}
}

// ===========================================================================

function chatBoxScrollDown() {
	if(bottomMessageIndex < chatBoxHistory.length-1) {
		bottomMessageIndex = bottomMessageIndex+scrollAmount;
		updateChatBox();
	}
}

// ===========================================================================

function clearChatBox() {
	for(let i = 0 ; i <= maxChatBoxLines ; i++) {
		message("", COLOUR_WHITE);
	}
}

// ===========================================================================

function updateChatBox() {
	clearChatBox();
	for(let i = bottomMessageIndex-maxChatBoxLines ; i <= bottomMessageIndex ; i++) {
		if(typeof chatBoxHistory[i] != "undefined") {
			message(chatBoxHistory[i][0], chatBoxHistory[i][1]);
		} else {
			message("", COLOUR_WHITE);
		}
	}
	chatLastUse = getCurrentUnixTimestamp();
}

// ===========================================================================

function processMouseWheelForChatBox(mouseId, deltaCoordinates, flipped) {
	// There isn't a way to detect whether chat input is active, but mouse cursor is forced shown when typing so ¯\_(ツ)_/¯
	if(!gui.cursorEnabled) {
		return false;
	}

	if(!flipped) {
		if(deltaCoordinates.y > 0) {
			chatBoxScrollUp();
		} else {
			chatBoxScrollDown();
		}
	} else {
		if(deltaCoordinates.y > 0) {
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
	if(gui.cursorEnabled) {
		return false;
	}

	// Don't process auto-hide if it's disabled
	if(chatAutoHideDelay == 0) {
		return false;
	}

	if(getCurrentUnixTimestamp()-chatLastUse >= chatAutoHideDelay) {
		setChatWindowEnabled(false);
	}
}

// ===========================================================================