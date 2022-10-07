// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: walkie-talkie.js
// DESC: Provides features and usage for the walkie-talkie item type
// TYPE: Server (JavaScript)
// ===========================================================================

function getPlayerActiveWalkieTalkieFrequency(client) {
	let walkieTalkieSlot = getPlayerFirstItemSlotByUseType(client, AGRP_ITEM_USE_TYPE_WALKIETALKIE);

	if (walkieTalkieSlot != -1) {
		if (getItemData(getPlayerData(client).hotBarItems[walkieTalkieSlot])) {
			if (getItemData(getPlayerData(client).hotBarItems[walkieTalkieSlot]).enabled) {
				return getItemData(getPlayerData(client).hotBarItems[walkieTalkieSlot]).value;
			}
		}
	}

	return false;
}

// ===========================================================================

function walkieTalkieTransmit(radioFrequency, messageText, transmittingPlayer) {
	walkieTalkieOutgoingToNearbyPlayers(transmittingPlayer, messageText);

	//let clients = getServerData().items;
	//for(let i in clients) {
	//	if(isPlayerSpawned(clients[i])) {
	//		if(!isSamePlayer(transmittingPlayer, clients[i])) {
	//			if(getPlayerActiveWalkieTalkieFrequency(clients[i]) == radioFrequency) {
	//				if(getItemData(getPlayerData(clients[i]).hotBarItems[getPlayerFirstItemSlotByUseType(clients[i], AGRP_ITEM_USE_TYPE_WALKIETALKIE)]).enabled) {
	//					walkieTalkieIncomingToNearbyPlayers(clients[i], messageText);
	//				}
	//			}
	//		}
	//	}
	//}

	let items = getServerData().items;
	for (let i in items) {
		if (items[i].enabled) {
			if (getItemTypeData(items[i].itemTypeIndex).useType == AGRP_ITEM_USE_TYPE_WALKIETALKIE) {
				if (items[i].value == radioFrequency) {
					walkieTalkieIncomingToNearbyPlayers(null, messageText, getItemPosition(i));
				}
			}
		}
	}
}

// ===========================================================================

function walkieTalkieOutgoingToNearbyPlayers(client, messageText) {
	let clients = getPlayersInRange(getPlayerPosition(client), getGlobalConfig().talkDistance);
	for (let i in clients) {
		messagePlayerNormal(clients[i], `[#CCCCCC]${getCharacterFullName(client)} {ALTCOLOUR}(to radio): {MAINCOLOUR}${messageText}`);
	}
}

// ===========================================================================

function walkieTalkieIncomingToNearbyPlayers(client, messageText, position = null) {
	let prefix = `{ALTCOLOUR}(Nearby radio)`;
	if (client != null) {
		prefix = `${getCharacterFullName(client)} {ALTCOLOUR}(from radio)`;
	}

	let clients = getPlayersInRange(getPlayerPosition(client), getGlobalConfig().walkieTalkieSpeakerDistance);
	for (let i in clients) {
		messagePlayerNormal(clients[i], `[#CCCCCC]${prefix}: {MAINCOLOUR}${messageText}`);
	}
}

// ===========================================================================

function setWalkieTalkieFrequencyCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, `The frequency channel must be a number!`);
		return false;
	}

	params = toInteger(params);

	if (params < 100 || params > 500) {
		messagePlayerError(client, `The frequency channel must be between 100 and 500!`);
		return false;
	}

	if (!getPlayerActiveItem(client)) {
		messagePlayerError(client, `You aren't holding a walkie talkie!`);
		return false;
	}

	if (!getItemData(getPlayerActiveItem(client))) {
		messagePlayerError(client, `You aren't holding a walkie talkie!`);
		return false;
	}

	if (getItemData(getPlayerActiveItem(client)).enabled) {
		if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "use")) {
			messagePlayerError(client, `Your walkie talkie is turned off. Press ${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "use")).key)} to turn it on`);
		} else {
			messagePlayerError(client, `Your walkie talkie is turned off. Type {ALTCOLOUR}/use {MAINCOLOUR}to turn it on`);
		}
		return false;
	}

	getItemData(getPlayerActiveItem(client)).value = params * 100;
	messagePlayerSuccess(client, getLocaleString(client, "FrequencyChannelChanged", `Walkie Talkie`, `${getPlayerData(client).activeHotBarSlot + 1}`, `${getItemValueDisplayForItem(getPlayerActiveItem(client))}`));
}

// ===========================================================================

function walkieTalkieChatCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let walkieTalkieSlot = getPlayerFirstItemSlotByUseType(client, AGRP_ITEM_USE_TYPE_WALKIETALKIE);
	if (!getItemData(getPlayerData(client).hotBarItems[walkieTalkieSlot]).enabled) {
		messagePlayerError(client, "Please turn on a walkie talkie first!");
		return false;
	}

	walkieTalkieTransmit(getPlayerActiveWalkieTalkieFrequency(client), params, client);

	markPlayerActionTipSeen(client, "RadioCommandAfterEnablingWalkieTalkie");
}

// ===========================================================================