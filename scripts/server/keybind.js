// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: keybind.js
// DESC: Provides keybind handlers and functions
// TYPE: Server (JavaScript)

// ===========================================================================

class KeyBindData {
	constructor(dbAssoc = false, key = 0, commandString = "", keyState = AGRP_KEYSTATE_UP) {
		this.databaseId = 0;
		this.key = key;
		this.account = 0;
		this.commandString = commandString;
		this.whenAdded = 0;
		this.enabled = true;
		this.keyState = false;
		this.index = -1;
		this.needsSaved = false;

		if (dbAssoc) {
			this.databaseId = dbAssoc["acct_hotkey_id"];
			this.key = toInteger(dbAssoc["acct_hotkey_key"]);
			this.account = toInteger(dbAssoc["acct_hotkey_acct"]);
			this.commandString = dbAssoc["acct_hotkey_cmdstr"];
			this.whenAdded = dbAssoc["acct_hotkey_when_added"];
			this.enabled = intToBool(dbAssoc["acct_hotkey_enabled"]);
			this.keyState = intToBool(dbAssoc["acct_hotkey_down"]);
		}
	}
};

// ===========================================================================

function initKeyBindScript() {
	logToConsole(LOG_DEBUG, "[AGRP.KeyBind]: Initializing key bind script ...");
	logToConsole(LOG_INFO, "[AGRP.KeyBind]: Key bind script initialized!");
}

// ===========================================================================

function addKeyBindCommand(command, params, client) {
	if (areParamsEmpty(command)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let keyId = getKeyIdFromParams(getParam(params, " ", 1));
	let tempCommand = getParam(params, " ", 2);
	let tempParams = (splitParams.length > 2) ? splitParams.slice(2).join(" ") : "";

	if (!keyId) {
		messagePlayerError(client, getLocaleString(client, "InvalidKeyBindName"));
		messagePlayerTip(client, getLocaleString(client, "KeyBindNameTip"));
		messagePlayerInfo(client, getLocaleString(client, "UniversalInlineExampleList", `{ALTCOLOUR}1, 2, a, b, numplus, num1, f1, f2, pageup, delete, insert, rightshift, leftctrl{MAINCOLOR}`));
		return false;
	}

	addPlayerKeyBind(client, keyId, tempCommand, tempParams);
	messagePlayerSuccess(client, getLocaleString(client, "KeyBindRemoved", `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(keyId))}{MAINCOLOUR}`, `{ALTCOLOUR}/${tempCommand} ${tempParams}`));
}

// ===========================================================================

function removeKeyBindCommand(command, params, client) {
	if (areParamsEmpty(command)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let keyId = getKeyIdFromParams(getParam(params, " ", 1));

	if (!keyId) {
		messagePlayerError(client, getLocaleString(client, "InvalidKeyBindName"));
		messagePlayerTip(client, getLocaleString(client, "KeyBindNameTip"));
		messagePlayerInfo(client, getLocaleString(client, "UniversalInlineExamplesList", `{ALTCOLOUR}1, 2, a, b, numplus, num1, f1, f2, pageup, delete, insert, rightshift, leftctrl{MAINCOLOR}`));
		return false;
	}

	removePlayerKeyBind(client, keyId);
	messagePlayerSuccess(client, getLocaleString(client, "KeyBindRemoved", `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(keyId))}{MAINCOLOUR}`));
}

// ===========================================================================

function resetKeyBindsCommand(command, params, client) {
	getPlayerData(client).promptType = AGRP_PROMPT_RESETKEYBINDS;
	showPlayerPrompt(client, getLocaleString(client, "ResetAllKeyBindsConfirm"), getLocaleString(client, "GUIWarningTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	//removePlayerKeyBind(client, keyId);
	//messagePlayerSuccess(client, `You removed the keybind for the {ALTCOLOUR}${toUpperCase(getKeyNameFromId(keyId))} {MAINCOLOUR}key`);
}

// ===========================================================================

function copyKeyBindsToServerCommand(command, params, client) {
	getPlayerData(client).promptType = AGRP_PROMPT_COPYKEYBINDSTOSERVER;
	showPlayerPrompt(client, getLocaleString(client, "CopyAllKeyBindsToServerConfirm"), getLocaleString(client, "GUIWarningTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	//removePlayerKeyBind(client, keyId);
	//messagePlayerSuccess(client, `You removed the keybind for the {ALTCOLOUR}${toUpperCase(getKeyNameFromId(keyId))} {MAINCOLOUR}key`);
}

// ===========================================================================

function addPlayerKeyBind(client, keyId, command, params, tempKey = false) {
	let keyBindData = new KeyBindData(false, keys, `${command} ${params}`);
	if (tempKey == true) {
		keyBindData.databaseId = -1;
	}

	getPlayerData(client).keyBinds.push(keyBindData);
	sendAddAccountKeyBindToClient(client, keyId, AGRP_KEYSTATE_UP);

	if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "enter")) {
		let keyId = getPlayerKeyBindForCommand(client, "enter");
		logToConsole(LOG_DEBUG, `[AGRP.Event] Sending custom enter property key ID (${keyId.key}, ${toUpperCase(getKeyNameFromId(keyId.key))}) to ${getPlayerDisplayForConsole(client)}`);
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

	if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "enter")) {
		let keyId = getPlayerKeyBindForCommand(client, "enter");
		logToConsole(LOG_DEBUG, `[AGRP.Event] Sending custom enter property key ID (${keyId.key}, ${toUpperCase(getKeyNameFromId(keyId.key))}) to ${getPlayerDisplayForConsole(client)}`);
		sendPlayerEnterPropertyKey(client, keyId.key);
	} else {
		sendPlayerEnterPropertyKey(client, false);
	}
}

// ===========================================================================

function doesPlayerHaveKeyBindForCommand(client, command) {
	for (let i in getPlayerData(client).keyBinds) {
		if (toLowerCase(getPlayerData(client).keyBinds[i].commandString.split(" ")[0]) == toLowerCase(command)) {
			return true;
		}
	}
	return false;
}

// ===========================================================================

function getPlayerKeyBindForCommand(client, command) {
	for (let i in getPlayerData(client).keyBinds) {
		if (toLowerCase(getPlayerData(client).keyBinds[i].commandString.split(" ")[0]) == toLowerCase(command)) {
			return getPlayerData(client).keyBinds[i];
		}
	}
	return false;
}

// ===========================================================================

function doesPlayerHaveKeyBindForKey(client, key) {
	for (let i in getPlayerData(client).keyBinds) {
		if (getPlayerData(client).keyBinds[i].key == key) {
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
	for (let i in getPlayerData(client).keyBinds) {
		if (getPlayerData(client).keyBinds[i].key == key) {
			return getPlayerData(client).keyBinds[i];
		}
	}
	return false;
}

// ===========================================================================

function playerUsedKeyBind(client, key, duration = 0) {
	if (!isPlayerLoggedIn(client)) {
		return false;
	}

	if (!isPlayerSpawned(client)) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.KeyBind] ${getPlayerDisplayForConsole(client)} used keybind ${toUpperCase(getKeyNameFromId(key))} (${key})`);
	if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForKey(client, key)) {
		let keyBindData = getPlayerKeyBindForKey(client, key);
		if (keyBindData.enabled) {
			let splitCommandString = keyBindData.commandString.split(" ");
			let tempCommand = splitCommandString[0];
			let tempParams = "";
			if (splitCommandString.length > 1) {
				tempParams = splitCommandString.slice(1).join(" ");
			}
			getPlayerData(client).keyBindDuration = duration;
			getCommand(toLowerCase(tempCommand)).handlerFunction(tempCommand, tempParams, client);
			getPlayerData(client).keyBindDuration = 0;
			//triggerEvent("OnPlayerCommand", null, tempCommand, tempParams, client);
		}
	}
}

// ===========================================================================

function sendAccountKeyBindsToClient(client) {
	sendClearKeyBindsToClient(client);
	for (let i in getPlayerData(client).keyBinds) {
		sendAddAccountKeyBindToClient(client, getPlayerData(client).keyBinds[i].key, getPlayerData(client).keyBinds[i].keyState);
	}
}

// ===========================================================================

function showKeyBindListCommand(command, params, client) {
	let keybindList = getPlayerData(client).keyBinds.map(function (x) { return `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(x.key))}: {MAINCOLOUR}${x.commandString}`; });

	let chunkedList = splitArrayIntoChunks(keybindList, 6);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderKeyBindsList")));

	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================