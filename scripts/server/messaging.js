// ===========================================================================
// Vortrex's Roleplay Script
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: messaging.js
// DESC: Provides messaging functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initMessagingScript() {
	logToConsole(LOG_INFO, "[V.RP.Messaging]: Initializing messaging script ...");
	logToConsole(LOG_INFO, "[V.RP.Messaging]: Messaging script initialized successfully!");
}

// ===========================================================================

function announceAdminAction(localeString, ...args) {
	let clients = getClients();
	for (let i in clients) {
		let argsArray = [clients[i], localeString];
		argsArray = argsArray.concat(args);
		let messageText = getLocaleString.apply(null, argsArray);
		messagePlayerNormal(clients[i], `⚠️ ${messageText}`, getColourByName("orange"));
	}

	messageDiscordEventChannel(getLanguageLocaleString.apply(null, [0, localeString].concat(args)));
}

// ===========================================================================

/**
 * Sends a normal message to a player without any extra type
 *
 * @param {Client} client - The client/player to send the message to
 * @param {string} messageText - The message string
 * @param {Colour} colour - Colour given by toColour
 * @return {bool} Whether or not the message was sent
 *
 */
function messagePlayerNormal(client, messageText, colour = COLOUR_WHITE) {
	if (client != null) {
		if (client.console) {
			logToConsole(LOG_INFO, `${removeColoursInMessage(messageText)}`);
			return false;
		}
	}

	sendChatBoxMessageToPlayer(client, messageText, colour);
	return true;
}

// ===========================================================================

function messageAdmins(messageText, announceToEventChannel = false) {
	let clients = getClients();
	for (let i in clients) {
		if (doesPlayerHaveStaffPermission(clients[i], getStaffFlagValue("BasicModeration"))) {
			messagePlayerNormal(clients[i], `🛡️ ${messageText}`, getColourByName("white"));
		}
	}

	let plainMessage = removeColoursInMessage(messageText);
	messageDiscordAdminChannel(plainMessage);
	logToConsole(LOG_INFO, `🛡️ ${plainMessage}`);

	if (announceToEventChannel == true) {
		messageDiscordEventChannel(`🛡️ ${plainMessage}`);
	}
}

// ===========================================================================

function messagePlayerError(client, messageText) {
	if (!isClientFromDiscord(client)) {
		messagePlayerNormal(client, `❌ ${messageText}`, getColourByName("white"));
	} else {
		messageDiscordUser(client, `❌ ${messageText}`);
	}
}

// ===========================================================================

function messagePlayerSyntax(client, messageText) {
	if (!isClientFromDiscord(client)) {
		messagePlayerNormal(client, `⌨️ USAGE: {MAINCOLOUR} ${messageText}`, getColourByType("syntaxMessage"));
	} else {
		messageDiscordUser(client, `⌨️ ${messageText}`);
	}
}

// ===========================================================================

function messagePlayerAlert(client, messageText) {
	if (!isClientFromDiscord(client)) {
		messagePlayerNormal(client, `⚠️ ${messageText}`, getColourByName("white"));
	} else {
		messageDiscordUser(client, `⚠️ ${messageText}`);
	}
}

// ===========================================================================

function messagePlayerSuccess(client, messageText) {
	if (!isClientFromDiscord(client)) {
		messagePlayerNormal(client, `✔️ ${messageText}`, getColourByName("white"));
	} else {
		messageDiscordUser(client, `✔️ ${messageText}`);
	}
}

// ===========================================================================

function messagePlayerInfo(client, messageText) {
	if (!isClientFromDiscord(client)) {
		messagePlayerNormal(client, `ℹ️ ${messageText}`, getColourByName("white"));
	} else {
		messageDiscordUser(client, `:information_source: ${messageText}`);
	}
}

// ===========================================================================

function messagePlayerTip(client, messageText) {
	if (!isClientFromDiscord(client)) {
		messagePlayerNormal(client, `💡 ${messageText}`, getColourByName("white"));
	} else {
		messageDiscordUser(client, `:bulb: ${messageText}`);
	}
}

// ===========================================================================

function messagePlayerTalk(client, talkingClient, messageText) {
	messagePlayerNormal(client, `🗣️ ${getPlayerAccentInlineOutput(talkingClient)}${getClientSubAccountName(talkingClient)} says: ${messageText}`, getColourByType("talkMessage"));
}

// ===========================================================================

function messagePlayerPhone(client, talkingClient, messageText) {
	messagePlayerNormal(client, `🗣️ ${getPlayerAccentInlineOutput(talkingClient)}${getClientSubAccountName(talkingClient)} says (phone): ${messageText}`, getColourByType("talkMessage"));
}

// ===========================================================================

function messagePlayerWhisper(client, whisperingClient, messageText) {
	messagePlayerNormal(client, `🤫 ${getPlayerAccentInlineOutput(whisperingClient)}${getClientSubAccountName(whisperingClient)} whispers: ${messageText}`, getColourByType("whisperMessage"));
}

// ===========================================================================

function messagePlayerMegaPhone(client, shoutingClient, messageText) {
	messagePlayerNormal(client, `📢 ${getPlayerAccentInlineOutput(shoutingClient)}${getClientSubAccountName(shoutingClient)} (megaphone): ${messageText}!`, getColourByType("yellow"));
}

// ===========================================================================

function messagePlayerShout(client, shoutingClient, messageText) {
	messagePlayerNormal(client, `🗣️ ${getPlayerAccentInlineOutput(shoutingClient)}${getClientSubAccountName(shoutingClient)} shouts: ${messageText}!`, getColourByType("shoutMessage"));
}

// ===========================================================================

function messagePlayerDoAction(client, doingActionClient, messageText) {
	if (!isClientFromDiscord(client)) {
		messagePlayerNormal(client, `${messageText} * (${getClientSubAccountName(doingActionClient)})`, getColourByType("doActionMessage"));
	}
}

// ===========================================================================

function messagePlayerMeAction(client, doingActionClient, messageText) {
	messagePlayerNormal(client, `${getCharacterFullName(doingActionClient)} ${messageText}`, getColourByType("meActionMessage"));
}

// ===========================================================================

function messagePlayerClanChat(client, clanChattingClient, messageText) {
	messagePlayerNormal(client, `👥 ${getInlineChatColourByName("clanOrange")}${(getPlayerClanRank(clanChattingClient) != -1) ? getClanRankData(getPlayerClan(clanChattingClient), getPlayerClanRank(clanChattingClient)).name : "No Rank"} ${getCharacterFullName(clanChattingClient)} {MAINCOLOUR}says (clan): {ALTCOLOUR}${messageText}`, getColourByType("clanChatMessage"));
}

// ===========================================================================

function messagePlayerAdminChat(client, adminChattingClient, messageText) {
	messagePlayerNormal(client, `🛡️ [ADMIN CHAT] {ALTCOLOUR}${getPlayerData(adminChattingClient).accountData.staffTitle} {lightGrey}${getPlayerData(adminChattingClient).accountData.name}: {MAINCOLOUR}${messageText}`, getColourByType("orange"));
}

// ===========================================================================

function messagePlayerNewbieTip(client, message) {
	if (!hasBitFlag(getPlayerData(client).accountData.settings, getAccountSettingsFlagValue("NoActionTips"))) {
		messagePlayerNormal(client, `💡 ${message}`);
	}
}

// ===========================================================================

function messagePlayerActionTip(client, message) {
	messagePlayerNormal(client, `💡 ${message}`);
}

// ===========================================================================

function messagePlayerTimedRandomTip(client, message) {
	if (isPlayerLoggedIn(client) && isPlayerSpawned(client)) {
		if (!hasBitFlag(getPlayerData(client).accountData.settings, getAccountSettingsFlagValue("NoRandomTips"))) {
			messagePlayerNormal(client, `💡 ${message}`);
		}
	}
}

// ===========================================================================

function makeChatBoxSectionHeader(name) {
	let resultString = `{clanOrange}== {jobYellow}${name} `;
	let endFiller = fillStringWithCharacter("=", globalConfig.chatSectionHeaderLength - resultString.length);
	return `${resultString} {clanOrange}${endFiller}`;
}

// ===========================================================================

function clearChatBox(client) {
	//game.messages.clear();
	for (let i = 0; i <= 20; i++) {
		messageClient(" ", client, COLOUR_WHITE);
	}
}

// ===========================================================================

function messagePlayerHelpContent(client, messageString) {
	messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}${messageString}`);
}

// ===========================================================================

function messagePlayersInRace(raceId, message) {
	for (let i in clients) {
		if (getPlayerRace(clients[i]) == raceId) {
			messagePlayerNormal(clients[i], message);
		}
	}
}

// ===========================================================================

function messagePlayerPrivateMessage(toClient, fromClient, messageText) {
	messagePlayerNormal(toClient, `📥 {yellow}DM from ${getCharacterFullName(fromClient)}{MAINCOLOUR}: ${messageText}`);
	messagePlayerNormal(fromClient, `📤 {yellow}DM to ${getCharacterFullName(toClient)}{MAINCOLOUR}: ${messageText}`);
}

// ===========================================================================

function showPlayerInfo(client, infoMessage, infoTitle = "Info") {
	//if (doesPlayerUseGUI(client)) {
	//	showPlayerErrorGUI(client, errorMessage, errorTitle, getLocaleString(client, "GUIOkButton"));
	//} else {
	messagePlayerInfo(client, infoMessage);
	//}
}

// ===========================================================================

function showPlayerError(client, errorMessage, errorTitle = "Error") {
	//if (doesPlayerUseGUI(client)) {
	//	showPlayerErrorGUI(client, errorMessage, errorTitle, getLocaleString(client, "GUIOkButton"));
	//} else {
	messagePlayerError(client, errorMessage);
	//}
}

// ===========================================================================

function showPlayerAlert(client, alertMessage, alertTitle = "Alert") {
	//if (doesPlayerUseGUI(client)) {
	//	showPlayerInfoGUI(client, alertMessage, alertTitle);
	//} else {
	messagePlayerAlert(client, alertMessage);
	//}
}

// ===========================================================================

function messagePlayerPhoneCall(talkingPlayer, receivingPlayer, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(talkingPlayer), getPlayerPosition(clients[i])) <= globalConfig.talkDistance && getPlayerDimension(talkingPlayer) == getPlayerDimension(clients[i]))) {
				messagePlayerPhone(clients[i], talkingPlayer, messageText);
			}
		}
	}

	messagePlayerNormal(receivingPlayer, `📞 {ALTCOLOUR}(On Phone): {MAINCOLOUR}${messageText}`);
}

// ===========================================================================

function showServerInDevelopmentMessage(client) {
	messagePlayerNormal(client, "This server is in early development and may restart at any time for updates.", getColourByName("orange"));
	messagePlayerNormal(client, "Some jobs may not be available or have nothing to do. They will be ready soon.", getColourByName("orange"));
	//messagePlayerNormal(client, "Player movement and weapons are NOT synced yet. Jack needs to add it to GTA Connected.", getColourByName("softRed"));
	messagePlayerNormal(client, `Please report bugs and ideas on the Connected Roleplay discord: https://discord.gg/yJABnrHujG`, getColourByName("yellow"));
}

// ===========================================================================

function showVehicleLockedMessageForPlayer(client, vehicle) {
	if (doesPlayerHaveVehicleKeys(client, vehicle)) {
		if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "lock")) {
			messagePlayerTip(client, getLocaleString(client, "VehicleLockedKeyPressTip", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "lock").key))}{MAINCOLOUR}`));
		} else {
			messagePlayerTip(client, getLocaleString(client, "VehicleLockedCommandTip", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}/lock{MAINCOLOUR}`));
		}
	} else {
		messagePlayerNormal(client, messagePlayerTip(client, getLocaleString(client, "VehicleLockedCantUnlock", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`)));
	}
}

// ===========================================================================

function showVehicleEngineOffMessageForPlayer(client, vehicle) {
	if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "engine")) {
		messagePlayerAlert(client, getLocaleString(client, "VehicleEngineStartKeyPressTip", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "engine").key))}{MAINCOLOUR}`));
	} else {
		messagePlayerAlert(client, getLocaleString(client, "VehicleEngineStartCommandTip", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}/engine{MAINCOLOUR}`));
	}
}

// ===========================================================================