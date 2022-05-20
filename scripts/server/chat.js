// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: chat.js
// DESC: Provides chat functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initChatScript() {
	logToConsole(LOG_INFO, "[VRR.Chat]: Initializing chat script ...");
	logToConsole(LOG_INFO, "[VRR.Chat]: Chat script initialized successfully!");
	return true;
}

// ===========================================================================

function processPlayerChat(client, messageText) {
	if(!isConsole(client)) {
		if(!getPlayerData(client)) {
			messagePlayerError(client, "You need to login before you can chat!");
			return false;
		}

		if(!isPlayerLoggedIn(client)) {
			messagePlayerError(client, "You need to login before you can chat!");
			return false;
		}

		if(!isPlayerSpawned(client)) {
			messagePlayerError(client, "You need to spawn before you can chat!");
			return false;
		}

		if(isPlayerMuted(client)) {
			messagePlayerError(client, "You are muted and can't chat!");
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
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	meActionToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function doActionCommand(command, params, client) {
	if(isPlayerMuted(client)) {
		messagePlayerError(client, "You are muted and can't chat!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	doActionToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function shoutCommand(command, params, client) {
	if(isPlayerMuted(client)) {
		messagePlayerError(client, "You are muted and can't chat!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	shoutToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function megaphoneChatCommand(command, params, client) {
	if(isPlayerMuted(client)) {
		messagePlayerError(client, "You are muted and can't chat!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!canPlayerUseMegaphone(client)) {
		messagePlayerError(client, "You must have a megaphone item or be in an emergency vehicle!");
		return false;
	}

	megaPhoneToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function talkCommand(command, params, client) {
	if(isPlayerMuted(client)) {
		messagePlayerError(client, "You are muted and can't chat!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	talkToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function whisperCommand(command, params, client) {
	if(isPlayerMuted(client)) {
		messagePlayerError(client, "You are muted and can't chat!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	whisperToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function adminChatCommand(command, params, client) {
	if(isPlayerMuted(client)) {
		messagePlayerError(client, "You are muted and can't chat!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	messageAdmins(`{jobYellow}[Admin Chat] {ALTCOLOUR}${getPlayerName(client)}: ${params}`);
}

// ===========================================================================

function clanChatCommand(command, params, client) {
	if(isPlayerMuted(client)) {
		messagePlayerError(client, "You are muted and can't chat!");
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	clanChat(client, params);
}

// ===========================================================================

function talkToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerSpawned(clients[i])) {
			if(hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().talkDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerTalk(clients[i], client, messageText);
			}
		}
	}
}

// ===========================================================================

function phoneOutgoingToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerSpawned(clients[i])) {
			if(hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().talkDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerNormal(`[#CCCCCC]${getCharacterFullName(client)} {ALTCOLOUR}(to phone): {MAINCOLOUR}${messageText}`);
			}
		}
	}
}

// ===========================================================================

function phoneIncomingToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerSpawned(clients[i])) {
			if(hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().phoneSpeakerDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerNormal(`[#CCCCCC]${getCharacterFullName(client)} {ALTCOLOUR}(from phone): {MAINCOLOUR}${messageText}`);
			}
		}
	}
}

// ===========================================================================

function whisperToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerSpawned(clients[i])) {
			if(hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().whisperDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerWhisper(clients[i], client, messageText);
			}
		}
	}
}

// ===========================================================================

function shoutToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerSpawned(clients[i])) {
			if(hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().shoutDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerShout(clients[i], client, messageText);
			}
		}
	}
}

// ===========================================================================

function megaPhoneToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerSpawned(clients[i])) {
			if(hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().megaphoneDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerMegaPhone(clients[i], client, messageText);
			}
		}
	}
}

// ===========================================================================

function doActionToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerSpawned(clients[i])) {
			if(hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().doActionDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerDoAction(clients[i], client, messageText);
			}
		}
	}
}

// ===========================================================================

function meActionToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerSpawned(clients[i])) {
			if(hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= getGlobalConfig().meActionDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerMeAction(clients[i], client, messageText);
			}
		}
	}
}

// ===========================================================================

function clanChat(client, messageText) {
	let clients = getClients();
	for(let i in clients) {
		if(isPlayerSpawned(clients[i])) {
			if(hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || arePlayersInSameClan(client, clients[i])) {
				messagePlayerClanChat(clients[i], client, messageText);
			}
		}
	}
}

// ===========================================================================

function canPlayerUseMegaphone(client) {
	if(getPlayerFirstItemSlotByUseType(client, VRR_ITEM_USETYPE_MEGAPHONE) != -1) {
		if(isPlayerActiveItemEnabled(client)) {
			return true;
		}
	}

	if(getPlayerVehicle(client)) {
		if(doesVehicleHaveMegaphone(getPlayerVehicle(client))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================