// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: accent.js
// DESC: Provides accent functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function getPlayerAccentText(client) {
	return getPlayerCurrentSubAccount(client).accent;
}

// ===========================================================================

function setPlayerAccentText(client, text) {
	getPlayerCurrentSubAccount(client).accent = text;
}

// ===========================================================================

function doesPlayerHaveAccent(client) {
	return (getPlayerCurrentSubAccount(client).accent != "");
}

// ===========================================================================

function getPlayerAccentInlineOutput(client) {
	let outputText = "";
	if (doesPlayerHaveAccent(client)) {
		outputText = `[${getPlayerAccentText(client)}] `;
	}

	return outputText;
}

// ===========================================================================

function setAccentCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (toLowerCase(params).indexOf("none") != -1) {
		getPlayerCurrentSubAccount(client).accent = "";
		messagePlayerSuccess(client, `Your accent is removed`);
		return false;
	}

	let accentId = getAccentFromParams(params);

	if (!accentId) {
		messagePlayerError(client, getLocaleString(client, "AccentNotFound"));
		return false;
	}

	let accentString = globalConfig.accents[accentId];

	getPlayerCurrentSubAccount(client).accent = accentString;

	messagePlayerSuccess(client, getLocaleString(client, "AccentSet", accentString));
}

// ===========================================================================

function listAccentsCommand(command, params, client) {
	let accentList = globalConfig.accents;

	let chunkedList = splitArrayIntoChunks(accentList, 8);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "AccentsListHeader")));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function getAccentFromParams(params) {
	if (isNaN(params)) {
		for (let i in globalConfig.accents) {
			if (toLowerCase(globalConfig.accents[i]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof globalConfig.accents[params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

function reloadAccentConfigurationCommand(command, params, client) {
	globalConfig.accents = loadAccentConfig();
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}has reloaded the accent list`);
}

// ===========================================================================

function addAccentCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let newAccentName = params;

	if (getAccentFromParams(newAccentName) != false) {
		messagePlayerError(client, `That accent already exists!`)
		return false;
	}

	globalConfig.accents.push(newAccentName);
	saveAccentConfig();
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} added a new accent: {ALTCOLOUR}${newAccentName}{MAINCOLOUR}`);
}

// ===========================================================================

function removeAccentCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let newAccentName = params;

	if (!getAccentFromParams(newAccentName)) {
		messagePlayerError(client, `That accent doesn't exist!`)
		return false;
	}

	globalConfig.accents.push(newAccentName);
	saveAccentConfig();
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed an accent: {ALTCOLOUR}${newAccentName}{MAINCOLOUR}`);
}

// ===========================================================================