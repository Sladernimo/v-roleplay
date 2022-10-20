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

let chatTimeStampsEnabled = false;
let chatEmojiEnabled = false;

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
	logToConsole(LOG_DEBUG, "[AGRP.Chat]: Initializing chat script ...");
	scrollUpKey = getKeyIdFromParams("pageup");
	scrollDownKey = getKeyIdFromParams("pagedown");
	bindChatBoxKeys();
	logToConsole(LOG_INFO, "[AGRP.Chat]: Chat script initialized!");
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

function receiveChatBoxMessageFromServer(messageString, colour, hour, minute, second) {
	logToConsole(LOG_DEBUG, `[AGRP.Chat]: Received chatbox message from server: ${messageString}`);

	// Just in case it's hidden by auto hide
	//setChatWindowEnabled(true);

	//let timeStamp = findResourceByName("agrp_time").exports.getCurrentUnixTimeStampSquirrel();

	hour = fillLeadingZeros(hour, 2);
	minute = fillLeadingZeros(minute, 2);
	second = fillLeadingZeros(second, 2);

	addToChatBoxHistory(messageString, colour, hour, minute, second);

	//let unixTimeStampMS = new Date().getTime();
	//let timeStampDate = new Date(unixTimeStampMS);
	//let timeStampDate = new Date(timeStamp);
	//let timeStampText = `${timeStampDate.getHours()}:${timeStampDate.getMinutes()}:${timeStampDate.getSeconds()}`;

	let outputString = messageString;
	if (chatTimeStampsEnabled == true) {
		let colourRGBA = rgbaArrayFromToColour(colour);
		let timeStampString = `{TIMESTAMPCOLOUR}[${hour}:${minute}:${second}][${rgbToHex(colourRGBA[0], colourRGBA[1], colourRGBA[2])}] `;
		outputString = `${timeStampString}${messageString}`;
	}

	logToConsole(LOG_DEBUG, `[AGRP.Chat]: Changed colours in string: ${outputString}`);
	outputString = replaceColoursInMessage(`${outputString}`);

	if (chatEmojiEnabled == true) {
		logToConsole(LOG_DEBUG, `[AGRP.Chat]: Enabled emoji in string: ${outputString}`);
		outputString = replaceEmojiInMessage(outputString);
	}

	if (profanityFilterEnabled == true) {
		logToConsole(LOG_DEBUG, `[AGRP.Chat]: Removed profanity in string: ${outputString}`);
		outputString = replaceProfanityInMessage(outputString);
	}

	message(outputString, colour);
	bottomMessageIndex = chatBoxHistory.length - 1;

	chatLastUse = getCurrentUnixTimestamp();
}

// ===========================================================================

function setChatScrollLines(amount) {
	scrollAmount = amount;
}

// ===========================================================================

function setChatTimeStampsState(state) {
	chatTimeStampsEnabled = state;
	updateChatBox();
}

// ===========================================================================

function setChatEmojiState(state) {
	chatEmojiEnabled = state;
	updateChatBox();
}

// ===========================================================================

function setChatAutoHideDelay(delay) {
	chatAutoHideDelay = delay * 1000;
}

// ===========================================================================

function addToChatBoxHistory(messageString, colour, hour, minute, second) {
	chatBoxHistory.push([messageString, colour, hour, minute, second]);
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
			if (chatTimeStampsEnabled == true) {
				let timeStampText = `${chatBoxHistory[i][2]}:${chatBoxHistory[i][3]}:${chatBoxHistory[i][4]}`;
				let colourRGBA = rgbaArrayFromToColour(chatBoxHistory[i][1]);
				outputString = `{TIMESTAMPCOLOUR}[${timeStampText}][${rgbToHex(colourRGBA[0], colourRGBA[1], colourRGBA[2])}] ${chatBoxHistory[i][0]}`;
			}

			outputString = replaceColoursInMessage(outputString);

			if (chatEmojiEnabled == true) {
				outputString = replaceEmojiInMessage(outputString);
			}

			if (profanityFilterEnabled == true) {
				outputString = replaceProfanityInMessage(outputString);
			}

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