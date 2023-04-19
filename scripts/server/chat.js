// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: chat.js
// DESC: Provides chat functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

const V_CHAT_TYPE_NONE = 0;					// None (invalid)
const V_CHAT_TYPE_GLOBAL = 1;				// Global OOC
const V_CHAT_TYPE_LOCAL = 2;				// Local OOC
const V_CHAT_TYPE_TALK = 3;					// Local IC (normal talking)
const V_CHAT_TYPE_SHOUT = 4;				// Local IC (shouting)
const V_CHAT_TYPE_WHISPER = 5;				// Local IC (whispering)

// ===========================================================================

function initChatScript() {
	logToConsole(LOG_INFO, "[V.RP.Chat]: Initializing chat script ...");
	logToConsole(LOG_INFO, "[V.RP.Chat]: Chat script initialized successfully!");
	return true;
}

// ===========================================================================

function processPlayerChat(client, messageText) {
	if (!isConsole(client)) {
		if (getPlayerData(client) == null) {
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

		if (getPlayerData(client).usingPayPhone != -1 && getPayPhoneData(getPlayerData(client).usingPayPhone).state == V_PAYPHONE_STATE_ACTIVE_CALL) {
			messagePlayerPhoneCall(client, getPlayerData(client).payPhoneOtherPlayer, messageText);
			return true;
		}

		switch (serverConfig.normalChatType) {
			case V_CHAT_TYPE_TALK:
				talkToNearbyPlayers(client, messageText);
				break;

			case V_CHAT_TYPE_SHOUT:
				shoutToNearbyPlayers(client, messageText);
				break;

			case V_CHAT_TYPE_WHISPER:
				whisperToNearbyPlayers(client, messageText);
				break;

			case V_CHAT_TYPE_LOCAL:
				oocToNearbyPlayers(client, messageText);
				break;

			case V_CHAT_TYPE_NONE:
				messagePlayerError(client, getLocaleString(client, "NormalChatDisabled"));
				break;

			case V_CHAT_TYPE_GLOBAL:
			default:
				oocToAllPlayers(client, messageText);
				break;
		}
	} else {
		messagePlayerNormal(null, `🛡️ (ADMIN) - ${messageText}`);
	}

	/*
	let clients = getClients();
	for(let i in clients) {
		let translatedText;
		translatedText = translateMessage(messageText, getPlayerData(client).locale, getPlayerData(clients[i]).locale);

		let original = (getPlayerData(client).locale == getPlayerData(clients[i]).locale) ? `` : ` {ALTCOLOUR}(${messageText})`;
		messagePlayerNormal(clients[i], `💬 ${getCharacterFullName(client)}: [#FFFFFF]${translatedText}${original}`, clients[i], getColourByName("mediumGrey"));
	}
	*/

	//messageDiscordChatChannel(`💬 ${getCharacterFullName(client)}: ${messageText}`);
}

// ===========================================================================

function globalOOCCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!serverConfig.globalChatEnabled) {
		messagePlayerError(client, getLocaleString(client, "GlobalChatDisabled"));
		return false;
	}

	oocToAllPlayers(client, params);
	markPlayerActionTipSeen(client, "UseGlobalChat");
	return true;
}

// ===========================================================================

function localOOCCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	oocToNearbyPlayers(client, params);
	return true;
}

// ===========================================================================

function meActionCommand(command, params, client) {
	if (isPlayerMuted(client)) {
		messagePlayerError(client, getLocaleString(client, "MutedCantChat"));
		return false;
	}

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

	messageDiscordAdminChannel(`${getPlayerData(client).accountData.staffTitle} ${getPlayerData(client).accountData.name}: ${params}`);
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

	if (getPlayerClan(client) == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (getClanData(getPlayerClan) == false) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
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

	messagePlayerPrivateMessage(getPlayerData(client).privateMessageReplyTo, client, params);

	markPlayerActionTipSeen(client, "ReplyToDirectMessage");
}

// ===========================================================================

function talkToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= globalConfig.talkDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerTalk(clients[i], client, messageText);
			}
		}
	}

	if (globalConfig.discord.sendLocalChat) {
		messageDiscordChatChannel(`🗣️ ${getPlayerAccentInlineOutput(talkingClient)}${getClientSubAccountName(talkingClient)} says: ${messageText}`);
	}
}

// ===========================================================================

function phoneOutgoingToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= globalConfig.talkDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
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
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= globalConfig.phoneSpeakerDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
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
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= globalConfig.whisperDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerWhisper(clients[i], client, messageText);
			}
		}
	}

	if (globalConfig.discord.sendLocalChat) {
		messageDiscordChatChannel(`🤫 ${getPlayerAccentInlineOutput(whisperingClient)}${getClientSubAccountName(whisperingClient)} whispers: ${messageText}`);
	}
}

// ===========================================================================

function shoutToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= globalConfig.shoutDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerShout(clients[i], client, messageText);
			}
		}
	}

	if (globalConfig.discord.sendLocalChat) {
		messageDiscordChatChannel(`🗣️ ${getPlayerAccentInlineOutput(shoutingClient)}${getClientSubAccountName(shoutingClient)} shouts: ${messageText}!`);
	}
}

// ===========================================================================

function megaPhoneToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= globalConfig.megaphoneDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerMegaPhone(clients[i], client, messageText);
			}
		}
	}

	if (globalConfig.discord.sendLocalChat) {
		messageDiscordChatChannel(`📢 ${getPlayerAccentInlineOutput(shoutingClient)}${getClientSubAccountName(shoutingClient)} (megaphone): ${messageText}!`);
	}
}

// ===========================================================================

function doActionToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= globalConfig.doActionDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerDoAction(clients[i], client, messageText);
			}
		}
	}

	if (globalConfig.discord.sendAction) {
		messageDiscordChatChannel(`🙋 *${messageText} (${getCharacterFullName(client)})*`);
	}
}

// ===========================================================================

function meActionToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= globalConfig.meActionDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerMeAction(clients[i], client, messageText);
			}
		}
	}

	if (globalConfig.discord.sendAction) {
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

	//if (globalConfig.discord.sendClan) {
	//	messageDiscordClanWebhook(getPlayerClan(client), getClanDiscordWebhookFlagValue("ClanChat"), fullString);
	//}
}

// ===========================================================================

function canPlayerUseMegaphone(client) {
	if (getPlayerFirstItemSlotByUseType(client, V_ITEM_USE_TYPE_MEGAPHONE) != -1) {
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

function oocToAllPlayers(client, messageText) {
	messagePlayerNormal(null, `💬 ${getCharacterFullName(client)}: {MAINCOLOUR}(( ${messageText} ))`, getPlayerColour(client));
	messageDiscordChatChannel(`💬 ${getCharacterFullName(client)}: (( ${messageText} ))`);

	// Action tip for other players
	let clients = getClients();
	for (let i in clients) {
		if (clients[i] != client) {
			if (!hasPlayerSeenActionTip(clients[i], "UseGlobalChat")) {
				if ((getCurrentUnixTimestamp() - getPlayerData(clients[i]).lastGlobalChatMessageTimeStamp) <= globalConfig.globalChatActionTipCooldown) {
					messagePlayerActionTip(clients[i], getGroupedLocaleString(clients[i], "ActionTips", "UseGlobalChat", `{ALTCOLOUR}/o{MAINCOLOUR}`));
				}
			}
		}
	}
}

// ===========================================================================

function oocToNearbyPlayers(client, messageText) {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerSpawned(clients[i])) {
			if (hasBitFlag(getPlayerData(clients[i]).accountData.flags.moderation, getModerationFlagValue("CanHearEverything")) || (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= globalConfig.doActionDistance && getPlayerDimension(client) == getPlayerDimension(clients[i]))) {
				messagePlayerNormal(clients[i], `💬 ${getCharacterFullName(client)}: {lightGrey}(( ${messageText} ))`, getPlayerColour(client));
			}
		}
	}

	messageDiscordChatChannel(`💬 ${getCharacterFullName(client)}: (( ${messageText} ))`);
}

// ===========================================================================

function updatePlayerChatBoxStates(client) {
	sendPlayerChatBoxTimeStampsState(client, isPlayerAccountSettingEnabled(client, "ChatBoxTimestamps"));
	sendPlayerChatEmojiState(client, isPlayerAccountSettingEnabled(client, "ChatEmoji"));
	sendPlayerProfanityFilterState(client, isPlayerAccountSettingEnabled(client, "ProfanityFilter"));
	sendPlayerChatScrollLines(client, getPlayerData(client).accountData.chatScrollLines);
}