// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: keybind.js
// DESC: Provides keybind handlers and functions
// TYPE: Server (JavaScript)

// ===========================================================================

function initKeyBindScript() {
	logToConsole(LOG_INFO, "[VRR.KeyBind]: Initializing key bind script ...");
	logToConsole(LOG_INFO, "[VRR.KeyBind]: Key bind script initialized!");
}

// ===========================================================================

function addKeyBindCommand(command, params, client) {
	let splitParams = params.split(" ");

	let keyId = getKeyIdFromParams(getParam(params, " ", 1));
	let tempCommand = getParam(params, " ", 2);
	let tempParams = (splitParams.length > 2) ? splitParams.slice(2).join(" ") : "";

	if(!keyId) {
		messagePlayerError(client, "The key ID or name you input is invalid!");
		messagePlayerTip(client, "Use simple key names, letters, or numbers. Don't add spaces.");
		messagePlayerInfo(client, `Examples: {ALTCOLOUR}1, 2, a, b, numplus, num1, f1, f2, pageup, delete, insert, rightshift, leftctrl`);
		return false;
	}

	if(!keyId) {
		messagePlayerError(client, "That key name/id is invalid!");
		return false;
	}

	if(areParamsEmpty(tempCommand)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	addPlayerKeyBind(client, keyId, tempCommand, tempParams);
	messagePlayerSuccess(client, `You binded the {ALTCOLOUR}${toUpperCase(getKeyNameFromId(keyId))} {MAINCOLOUR}key to command: {ALTCOLOUR}/${tempCommand} ${tempParams}`);
}

// ===========================================================================

function removeKeyBindCommand(command, params, client) {
	let keyId = getKeyIdFromParams(getParam(params, " ", 1));

	if(!keyId) {
		messagePlayerError(client, "The key ID or name you input is invalid!");
		messagePlayerTip(client, "Use simple key names, letters, or numbers. Don't add spaces.");
		messagePlayerInfo(client, `Examples: {ALTCOLOUR}1, 2, a, b, numplus, num1, f1, f2, pageup, delete, insert, rightshift, leftctrl`);
		return false;
	}

	if(!keyId) {
		messagePlayerError(client, "That key name/id is invalid!");
		return false;
	}

	removePlayerKeyBind(client, keyId);
	messagePlayerSuccess(client, `You removed the keybind for the {ALTCOLOUR}${toUpperCase(getKeyNameFromId(keyId))} {MAINCOLOUR}key`);
}

// ===========================================================================

function addPlayerKeyBind(client, keys, command, params, tempKey = false) {
	let keyBindData = new KeyBindData(false, keys, `${command} ${params}`);
	if(tempKey == true) {
		keyBindData.databaseId = -1;
	}

	getPlayerData(client).keyBinds.push(keyBindData);
	sendAddAccountKeyBindToClient(client, keys, (keys.length > 1) ? VRR_KEYSTATE_COMBO : VRR_KEYSTATE_UP);

	if(!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "enter")) {
		let keyId = getPlayerKeyBindForCommand(client, "enter");
		logToConsole(LOG_DEBUG, `[VRR.Event] Sending custom enter property key ID (${keyId.key}, ${toUpperCase(getKeyNameFromId(keyId.key))}) to ${getPlayerDisplayForConsole(client)}`);
		sendPlayerEnterPropertyKey(client, keyId.key);
	} else {
		sendPlayerEnterPropertyKey(client, false);
	}
}

// ===========================================================================

function removePlayerKeyBind(client, keyId) {
	//if(isPlayerLoggedIn(client)) {
	//	quickDatabaseQuery(`DELETE FROM acct_hotkey WHERE acct_hotkey_acct = ${getPlayerData(client).accountData.databaseId} AND acct_hotkey_key = ${keyId}`);
	//}

	//for(let i in getPlayerData(client).keyBinds) {
	//	if(getPlayerData(client).keyBinds[i].key == keyId) {
	//		getPlayerData(client).keyBinds.splice(i, 1);
	//	}
	//}
	getPlayerData(client).keyBinds = getPlayerData(client).keyBinds.filter(keyBind => keyBind.key != keyId);
	sendRemoveAccountKeyBindToClient(client, keyId);

	if(!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "enter")) {
		let keyId = getPlayerKeyBindForCommand(client, "enter");
		logToConsole(LOG_DEBUG, `[VRR.Event] Sending custom enter property key ID (${keyId.key}, ${toUpperCase(getKeyNameFromId(keyId.key))}) to ${getPlayerDisplayForConsole(client)}`);
		sendPlayerEnterPropertyKey(client, keyId.key);
	} else {
		sendPlayerEnterPropertyKey(client, false);
	}
}

// ===========================================================================

function doesPlayerHaveKeyBindForCommand(client, command) {
	for(let i in getPlayerData(client).keyBinds) {
		if(toLowerCase(getPlayerData(client).keyBinds[i].commandString.split(" ")[0]) == toLowerCase(command)) {
			return true;
		}
	}
	return false;
}

// ===========================================================================

function getPlayerKeyBindForCommand(client, command) {
	for(let i in getPlayerData(client).keyBinds) {
		if(toLowerCase(getPlayerData(client).keyBinds[i].commandString.split(" ")[0]) == toLowerCase(command)) {
			return getPlayerData(client).keyBinds[i];
		}
	}
	return false;
}

// ===========================================================================

function doesPlayerHaveKeyBindForKey(client, key) {
	for(let i in getPlayerData(client).keyBinds) {
		if(getPlayerData(client).keyBinds[i].key == key) {
			return true;
		}
	}
	return false;
}

// ===========================================================================

function doesPlayerHaveKeyBindsDisabled(client) {
	return hasBitFlag(getPlayerData(client).accountData.settings, getAccountSettingsFlagValue("NoKeyBinds"));
}

// ===========================================================================

function getPlayerKeyBindForKey(client, key) {
	for(let i in getPlayerData(client).keyBinds) {
		if(getPlayerData(client).keyBinds[i].key == key) {
			return getPlayerData(client).keyBinds[i];
		}
	}
	return false;
}

// ===========================================================================

function playerUsedKeyBind(client, key) {
	if(!isPlayerLoggedIn(client)) {
		return false;
	}

	if(!isPlayerSpawned(client)) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.KeyBind] ${getPlayerDisplayForConsole(client)} used keybind ${toUpperCase(getKeyNameFromId(key))} (${key})`);
	if(!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForKey(client, key)) {
		let keyBindData = getPlayerKeyBindForKey(client, key);
		if(keyBindData.enabled) {
			let splitCommandString = keyBindData.commandString.split(" ");
			let tempCommand = splitCommandString[0];
			let tempParams = "";
			if(splitCommandString.length > 1) {
				tempParams = splitCommandString.slice(1).join(" ");
			}
			getCommand(toLowerCase(tempCommand)).handlerFunction(tempCommand, tempParams, client);
			//triggerEvent("OnPlayerCommand", null, tempCommand, tempParams, client);
		}
	}
}

// ===========================================================================

function sendAccountKeyBindsToClient(client) {
	sendClearKeyBindsToClient(client);
	for(let i in getPlayerData(client).keyBinds) {
		sendAddAccountKeyBindToClient(client, getPlayerData(client).keyBinds[i].key, getPlayerData(client).keyBinds[i].keyState);
	}
}

// ===========================================================================

function showKeyBindListCommand(command, params, client) {
	let keybindList = getPlayerData(client).keyBinds.map(function(x) { return `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(x.key))}: {MAINCOLOUR}${x.commandString}`; });

	let chunkedList = splitArrayIntoChunks(keybindList, 6);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderKeyBindsList")));

	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================