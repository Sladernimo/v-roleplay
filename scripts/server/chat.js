// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: chat.js
// DESC: Provides chat functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initChatScript() {
	logToConsole(LOG_INFO, "[AGRP.Chat]: Initializing chat script ...");
	logToConsole(LOG_INFO, "[AGRP.Chat]: Chat script initialized successfully!");
	return true;
}

// ===========================================================================

function processPlayerChat(client, messageText) {
	if (!isConsole(client)) {
		if (!getPlayerData(client)) {
			messagePlayerError(client, getLocaleString(client, "MustBeLoggedInAndSpawnedToChat"));
			return false;
		}

		if (!isPlayerLoggedIn(client)) {
			messagePlayerError(client, getLocaleString(client, "MustBeLoggedInAndSpawnedToChat"));
			return false;
		}

		if (!isPlayerSpawned(client)) {
			messagePlayerError(client, getLocaleString(client, "MustBeLoggedInAndSpawnedToChat"));
			return false;
		}

		if (isPlayerMuted(client)) {
			messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
			return false;
		}

		messageText = messageText.substring(0, 128);
		messagePlayerNormal(null, `💬 ${getCharacterFullName(client)}: {MAINCOLOUR}${messageText}`, getPlayerColour(client));
		messageDiscordChatChannel(`💬 ${getCharacterFullName(client)}: ${messageText}`);
	} else {
		messagePlayerNormal(null, `🛡️ (ADMIN) - ${messageText}`);
	}

	/*
	let clients = getClients();
	for(let i in clients) {
		let translatedText;
		translatedText = await translateMessage(messageText, getPlayerData(client).locale, getPlayerData(clients[i]).locale);

		let original = (getPlayerData(client).locale == getPlayerData(clients[i]).locale) ? `` : ` {ALTCOLOUR}(${messageText})`;
		messagePlayerNormal(clients[i], `💬 ${getCharacterFullName(client)}: [#FFFFFF]${translatedText}${original}`, clients[i], getColourByName("mediumGrey"));
	}
	*/

	//messageDiscordChatChannel(`💬 ${getCharacterFullName(client)}: ${messageText}`);
}

// ===========================================================================

function meActionCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	meActionToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function doActionCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	doActionToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function shoutCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	shoutToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function megaphoneChatCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!canPlayerUseMegaphone(client)) {
		messagePlayerError(client, getLocaleString(client, "CantUseMegaphone"));
		return false;
	}

	megaPhoneToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function talkCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	talkToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function whisperCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	whisperToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function adminChatCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clients = getClients();
	for (let i in clients) {
		if (doesPlayerHaveStaffPermission(clients[i], getStaffFlagValue("BasicModeration"))) {
			messagePlayerAdminChat(clients[i], client, params);
		}
	}

	messageDiscordAdminChannel(`${getPlayerData(client).accountData.staffTitle} ${getPlayerData(client).accountData.name}: ${messageText}`);
}

// ===========================================================================

function clanChatCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	clanChat(client, params);
}

// ===========================================================================

function privateMessageCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(splitParams[0]);
	let messageText = splitParams.slice(1).join(" ");

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	getPlayerData(targetClient).privateMessageReplyTo = client;
	messagePlayerPrivateMessage(targetClient, client, messageText);

	if (!hasPlayerSeenActionTip(targetClient, "ReplyToDirectMessage")) {
		messagePlayerTip(targetClient, getGroupedLocaleString(targetClient, "ActionTips", "ReplyToDirectMessage", "{ALTCOLOUR}/reply{MAINCOLOUR}"));
	}
}

// ===========================================================================

function replyToLastPrivateMessageCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (getPlayerData(client).privateMessageReplyTo == null) {
		messagePlayerError(client, getLocaleString(client, "NoPrivateMessageToReply"));
		return false;
	}

	getPlayerData(targetClient).privateMessageReplyTo = client;
	messagePlayerPrivateMessage(targetClient, client, messageText);

	markPlayerActionTipSeen(client, "ReplyToDirectMessage");
}

// ===========================================================================

function talkToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().talkDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerTalk(clients[i], client, messageText);
			}
		}
	}

	if (getGlobalConfig().discord.sendLocalChat) {
		messageDiscordChatChannel(`🗣️ ${getPlayerAccentInlineOutput(talkingClient)}${getClientSubAccountName(talkingClient)} says: ${messageText}`);
	}
}

// ===========================================================================

function phoneOutgoingToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().talkDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerNormal(`[#CCCCCC]${getCharacterFullName(client)} {ALTCOLOUR}(to phone): {MAINCOLOUR}${messageText}`);
			}
		}
	}
}

// ===========================================================================

function phoneIncomingToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().phoneSpeakerDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerNormal(`[#CCCCCC]${getCharacterFullName(client)} {ALTCOLOUR}(from phone): {MAINCOLOUR}${messageText}`);
			}
		}
	}
}

// ===========================================================================

function whisperToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().whisperDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerWhisper(clients[i], client, messageText);
			}
		}
	}

	if (getGlobalConfig().discord.sendLocalChat) {
		messageDiscordChatChannel(`🤫 ${getPlayerAccentInlineOutput(whisperingClient)}${getClientSubAccountName(whisperingClient)} whispers: ${messageText}`);
	}
}

// ===========================================================================

function shoutToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().shoutDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerShout(clients[i], client, messageText);
			}
		}
	}

	if (getGlobalConfig().discord.sendLocalChat) {
		messageDiscordChatChannel(`🗣️ ${getPlayerAccentInlineOutput(shoutingClient)}${getClientSubAccountName(shoutingClient)} shouts: ${messageText}!`);
	}
}

// ===========================================================================

function megaPhoneToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().megaphoneDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerMegaPhone(clients[i], client, messageText);
			}
		}
	}

	if (getGlobalConfig().discord.sendLocalChat) {
		messageDiscordChatChannel(`📢 ${getPlayerAccentInlineOutput(shoutingClient)}${getClientSubAccountName(shoutingClient)} (megaphone): ${messageText}!`);
	}
}

// ===========================================================================

function doActionToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().doActionDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerDoAction(clients[i], client, messageText);
			}
		}
	}

	if (getGlobalConfig().discord.sendAction) {
		messageDiscordChatChannel(`🙋 *${messageText} (${getCharacterFullName(client)})*`);
	}
}

// ===========================================================================

function meActionToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().meActionDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerMeAction(clients[i], client, messageText);
			}
		}
	}

	if (getGlobalConfig().discord.sendAction) {
		messageDiscordChatChannel(`🙋 *${getCharacterFullName(client)} ${messageText}*`);
	}
}

// ===========================================================================

function clanChat(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || arePlayersInSameClan(client, clients[i])) {
				messagePlayerClanChat(clients[i], client, messageText);
			}
		}
	}

	//if (getGlobalConfig().discord.sendClan) {
	//	messageDiscordClanWebhook(getPlayerClan(client), getClanDiscordWebhookFlagValue("ClanChat"), fullString);
	//}
}

// ===========================================================================

function canPlayerUseMegaphone(client) {
	if (getPlayerFirstItemSlotByUseType(client, AGRP_ITEM_USE_TYPE_MEGAPHONE) != -1) {
		if (isPlayerActiveItemEnabled(client)) {
			return true;
		}
	}

	if (getPlayerVehicle(client)) {
		if (doesVehicleHaveMegaphone(getPlayerVehicle(client))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================