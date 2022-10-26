// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: messaging.js
// DESC: Provides messaging functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initMessagingScript() {
	logToConsole(LOG_INFO, "[AGRP.Messaging]: Initializing messaging script ...");
	logToConsole(LOG_INFO, "[AGRP.Messaging]: Messaging script initialized successfully!");
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
	messagePlayerNormal(client, `👥 ${getInlineChatColourByName("clanOrange")}${(getPlayerClanRank(client) != -1) ? getClanRankData(getPlayerClan(client), getPlayerClanRank(client)).name : "No Rank"} ${getCharacterFullName(clanChattingClient)} {MAINCOLOUR}says (clan): {ALTCOLOUR}${messageText}`, getColourByType("clanChatMessage"));
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
	let endFiller = fillStringWithCharacter("=", getGlobalConfig().chatSectionHeaderLength - resultString.length);
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
	messagePlayerNormal(toClient, `{yellow}[DM] ${getCharacterFullName(fromClient)}{MAINCOLOUR}says: {ALTCOLOUR}${messageText}`);
}

// ===========================================================================

function showPlayerError(client, errorMessage, errorTitle = "Error") {
	if (doesPlayerUseGUI(client)) {
		showPlayerErrorGUI(client, errorMessage, errorTitle);
	} else {
		messagePlayerError(client, errorMessage);
	}
}

// ===========================================================================

function showPlayerAlert(client, alertMessage, alertTitle = "Alert") {
	if (doesPlayerUseGUI(client)) {
		showPlayerInfoGUI(client, alertMessage, alertTitle);
	} else {
		messagePlayerAlert(client, alertMessage);
	}
}

// ===========================================================================