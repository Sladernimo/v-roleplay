// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: netevents.js
// DESC: Provides client communication and cross-endpoint network events
// TYPE: Server (JavaScript)
// ===========================================================================

function initNetworkEventsScript() {
	logToConsole(LOG_DEBUG, "[V.RP.NetEvents]: Initializing network events script ...");
	logToConsole(LOG_INFO, "[V.RP.NetEvents]: Network events script initialized!");
}

// ===========================================================================

function addAllNetworkEventHandlers() {
	logToConsole(LOG_DEBUG, "[V.RP.Client]: Adding network handlers ...");

	// KeyBind
	addNetworkEventHandler("v.rp.useKeyBind", playerUsedKeyBind);

	// GUI
	addNetworkEventHandler("v.rp.promptAnswerNo", playerPromptAnswerNo);
	addNetworkEventHandler("v.rp.promptAnswerYes", playerPromptAnswerYes);
	addNetworkEventHandler("v.rp.toggleGUI", playerToggledGUI);
	addNetworkEventHandler("v.rp.2fa", checkPlayerTwoFactorAuthentication);

	// AFK
	addNetworkEventHandler("v.rp.afk", playerChangeAFKState);

	// Event
	addNetworkEventHandler("v.rp.pickup", onPlayerNearPickup);
	addNetworkEventHandler("v.rp.playerDeath", onPlayerDeath);

	// Job
	addNetworkEventHandler("v.rp.arrivedAtJobRouteLocation", playerArrivedAtJobRouteLocation);

	// Client
	addNetworkEventHandler("v.rp.clientReady", playerClientReady);
	addNetworkEventHandler("v.rp.guiReady", playerGUIReady);
	addNetworkEventHandler("v.rp.clientStarted", playerClientStarted);
	addNetworkEventHandler("v.rp.clientStopped", playerClientStopped);

	// Account
	addNetworkEventHandler("v.rp.checkLogin", checkLogin);
	addNetworkEventHandler("v.rp.checkRegistration", checkRegistration);
	addNetworkEventHandler("v.rp.checkResetPassword", checkAccountResetPasswordRequest);
	addNetworkEventHandler("v.rp.checkChangePassword", checkAccountChangePassword);

	// Developer
	addNetworkEventHandler("v.rp.runCodeSuccess", clientRunCodeSuccess);
	addNetworkEventHandler("v.rp.runCodeFail", clientRunCodeFail);

	// SubAccount
	addNetworkEventHandler("v.rp.checkNewCharacter", checkNewCharacter);
	addNetworkEventHandler("v.rp.nextCharacter", checkNextCharacter);
	addNetworkEventHandler("v.rp.previousCharacter", checkPreviousCharacter);
	addNetworkEventHandler("v.rp.selectCharacter", selectCharacter);

	// Item
	addNetworkEventHandler("v.rp.itemActionDelayComplete", playerItemActionDelayComplete);
	addNetworkEventHandler("v.rp.weaponDamage", playerDamagedByPlayer);

	// Locale
	addNetworkEventHandler("v.rp.localeSelect", playerSelectedNewLocale);

	// Misc
	addNetworkEventHandler("v.rp.plr.pos", updatePositionInPlayerData);
	addNetworkEventHandler("v.rp.plr.rot", updateHeadingInPlayerData);
	addNetworkEventHandler("v.rp.skinSelected", playerFinishedSkinSelection);
	addNetworkEventHandler("v.rp.clientInfo", updateConnectionLogOnClientInfoReceive);
	addNetworkEventHandler("v.rp.vehBuyState", receiveVehiclePurchaseStateUpdateFromClient);
	addNetworkEventHandler("v.rp.playerPedId", receivePlayerPedNetworkId);
	addNetworkEventHandler("v.rp.playerCop", setPlayerAsCopState);
	addNetworkEventHandler("v.rp.mapLoaded", playerMapLoaded);
}

// ===========================================================================

function updatePlayerNameTag(client) {
	if (client == null) {
		return false;
	}

	if (getPlayerData(client) == null) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending ${getPlayerDisplayForConsole(client)}'s updated nametag to all players`);
	sendNetworkEventToPlayer("v.rp.nametag", null, getPlayerName(client), getPlayerNameForNameTag(client), getPlayerColour(client), getPlayerData(client).afk, getPlayerPing(client));
}

// ===========================================================================

function updateAllPlayerNameTags() {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending updated nametags to all players`);
	let clients = getClients();
	for (let i in clients) {
		updatePlayerNameTag(clients[i]);
	}
}

// ===========================================================================

function updatePlayerPing(client) {
	//logToConsole(LOG_DEBUG, `[AGRP.Client] Sending ${getPlayerDisplayForConsole(client)}'s ping to all players`);
	sendNetworkEventToPlayer("v.rp.ping", null, getPlayerName(client), getPlayerPing(client));
}

// ===========================================================================

function playerClientReady(client) {
	playerResourceReady[client.index] = true;
	logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s client resources are downloaded and ready! Started: ${getYesNoFromBool(playerResourceStarted[client.index])}`);
	if (playerResourceStarted[client.index] == true && playerInitialized[client.index] == false) {
		initClient(client);
	}
}

// ===========================================================================

function playerGUIReady(client) {
	playerGUI[client.index] = true;
	logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s client GUI is initialized and ready!`);
}

// ===========================================================================

function playerClientStarted(client) {
	playerResourceStarted[client.index] = true;
	logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s client resources are started and running! Ready: ${getYesNoFromBool(playerResourceReady[client.index])}`);
	if (playerResourceReady[client.index] == true && playerInitialized[client.index] == false) {
		initClient(client);
	}
}

// ===========================================================================

function playerClientStopped(client) {
	logToConsole(LOG_DEBUG | LOG_WARN, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s client resources have stopped (possibly error?)`);
	getPlayerData(client).customDisconnectReason = "ClientScriptVerificationFail";
	//disconnectPlayer(client);
}

// ===========================================================================

function showSmallGameMessage(client, text, colour, duration, fontName = "Roboto") {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Showing game message to ${getPlayerDisplayForConsole(client)} (${text}) for ${duration} milliseconds`);

	if (getGame() <= V_GAME_GTA_IV_EFLC) {
		fontName = "Pricedown";
	} else {
		fontName = "AuroraBdCnBT";
	}
	sendNetworkEventToPlayer("v.rp.smallGameMessage", client, text, colour, duration, fontName);
}

// ===========================================================================

function enableCityAmbienceForPlayer(client, clearElements = false) {
	//if(server.getCVar("civilians") == false) {
	//    return false;
	//}

	//logToConsole(LOG_DEBUG, `[AGRP.Client] Setting ${getPlayerDisplayForConsole(client)}'s city ambience to ${toUpperCase(getOnOffFromBool(false))}`);
	//sendNetworkEventToPlayer("v.rp.ambience", client, true);
}

// ===========================================================================

function disableCityAmbienceForPlayer(client, clearElements = false) {
	//if(server.getCVar("civilians") == true) {
	//    return false;
	//}

	//logToConsole(LOG_DEBUG, `[AGRP.Client] Setting ${getPlayerDisplayForConsole(client)}'s city ambience to ${toUpperCase(getOnOffFromBool(false))}`);
	//sendNetworkEventToPlayer("v.rp.ambience", client, false, clearElements);
}

// ===========================================================================

function clearPlayerOwnedPeds(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Clearing peds owned by ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.clearPeds", client);
}

// ===========================================================================

function updatePlayerSpawnedState(client, state) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Setting ${getPlayerDisplayForConsole(client)}'s spawned state ${toUpperCase(getOnOffFromBool(state))}`);
	getPlayerData(client).spawned = true;
	sendNetworkEventToPlayer("v.rp.spawned", client, state);
}

// ===========================================================================

function setPlayerControlState(client, state) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Setting ${getPlayerDisplayForConsole(client)}'s control state ${toUpperCase(getOnOffFromBool(state))}`);
	sendNetworkEventToPlayer("v.rp.control", client, state, !state);
}

// ===========================================================================

function updatePlayerShowLogoState(client, state) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Setting ${getPlayerDisplayForConsole(client)}'s logo state ${toUpperCase(getOnOffFromBool(state))}`);
	sendNetworkEventToPlayer("v.rp.logo", client, state);
}

// ===========================================================================

function restorePlayerCamera(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Restoring ${getPlayerDisplayForConsole(client)}'s camera`);
	sendNetworkEventToPlayer("v.rp.restoreCamera", client);
}

// ===========================================================================

function setPlayer2DRendering(client, hudState = false, labelState = false, smallGameMessageState = false, scoreboardState = false, hotBarState = false, itemActionDelayState = false) {
	sendNetworkEventToPlayer("v.rp.set2DRendering", client, hudState, labelState, smallGameMessageState, scoreboardState, hotBarState, itemActionDelayState);
}

// ===========================================================================

function syncPlayerProperties(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending signal to sync ${getPlayerDisplayForConsole(client)}'s player ped properties`);
	sendNetworkEventToPlayer("v.rp.syncElement", null, getPlayerPed(client).id);
}

// ===========================================================================

function updatePlayerSnowState(client, forceGroundSnow = false) {
	if (isSnowSupported(getGame())) {
		logToConsole(LOG_DEBUG, `[AGRP.Client] Setting ${getPlayerDisplayForConsole(client)}'s snow state (Falling: ${toUpperCase(getOnOffFromBool(getServerConfig().fallingSnow))}, Ground: ${toUpperCase(getOnOffFromBool(getServerConfig().groundSnow))})`);
		sendNetworkEventToPlayer("v.rp.snow", client, getServerConfig().fallingSnow, getServerConfig().groundSnow, forceGroundSnow);
	}
}

// ===========================================================================

function updatePlayerHotBar(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending updated hotbar data to ${getPlayerDisplayForConsole(client)}`);
	let tempHotBarItems = [];
	for (let i in getPlayerData(client).hotBarItems) {
		let itemImage = "";
		let itemValue = 0;
		let itemExists = false;
		if (getPlayerData(client).hotBarItems[i] != -1) {
			if (getItemData(getPlayerData(client).hotBarItems[i])) {
				let itemData = getItemData(getPlayerData(client).hotBarItems[i]);
				let itemTypeData = getItemTypeData(itemData.itemTypeIndex);
				itemExists = true;
				itemImage = itemTypeData.hotbarImage;
				itemValue = itemData.value;
			}
		}
		tempHotBarItems.push([i, itemExists, itemImage, itemValue]);
	}
	sendNetworkEventToPlayer("v.rp.hotbar", client, getPlayerData(client).activeHotBarSlot, tempHotBarItems);
}

// ===========================================================================

function setPlayerWeaponDamageEnabled(client, state) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending weapon damage state for ${getPlayerDisplayForConsole(client)} to all players`);
	sendNetworkEventToPlayer("v.rp.weaponDamageEnabled", null, getPlayerName(client), state);
}

// ===========================================================================

function setPlayerWeaponDamageEvent(client, eventType) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending weapon damage event (${eventType}) for ${getPlayerDisplayForConsole(client)} to all players`);
	sendNetworkEventToPlayer("v.rp.weaponDamageEvent", null, getPlayerName(client), eventType);
	getPlayerData(client).weaponDamageEvent = eventType;
}

// ===========================================================================

function sendJobRouteLocationToPlayer(client, position, colour) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending job route location data to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showJobRouteLocation", client, position, colour);
}

// ===========================================================================

function showPlayerLoginSuccessGUI(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending login success GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.loginSuccess", client);
}

// ===========================================================================

function showPlayerLoginFailedGUI(client, errorMessage) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending login failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.loginFailed", client, errorMessage);
}

// ===========================================================================

function showPlayerRegistrationSuccessGUI(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending registration success GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.registrationSuccess", client);
}

// ===========================================================================

function showPlayerRegistrationFailedGUI(client, errorMessage) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending registration failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.registrationFailed", client, errorMessage);
}

// ===========================================================================

function sendPlayerGUIColours(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending GUI colours to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.guiColour", client, getServerConfig().guiColourPrimary[0], getServerConfig().guiColourPrimary[1], getServerConfig().guiColourPrimary[2], getServerConfig().guiColourSecondary[0], getServerConfig().guiColourSecondary[1], getServerConfig().guiColourSecondary[2], getServerConfig().guiTextColourPrimary[0], getServerConfig().guiTextColourPrimary[1], getServerConfig().guiTextColourPrimary[2]);
}

// ===========================================================================

function sendPlayerGUIInit(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending GUI init signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.guiInit", client);
}

// ===========================================================================

function showPlayerLoginGUI(client, errorMessage = "") {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending show login GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showLogin", client);
}

// ===========================================================================

function showPlayerRegistrationGUI(client, errorMessage = "") {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending show registration GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showRegistration", client);
}

// ===========================================================================

function showPlayerNewCharacterGUI(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending show new character GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showNewCharacter", client);
}

// ===========================================================================

function showPlayerChangePasswordGUI(client, errorMessage = "") {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending show change password GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showChangePassword", client, errorMessage);
}

// ===========================================================================

function showPlayerResetPasswordCodeInputGUI(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending show reset password code input GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showResetPasswordCodeInput", client);
}

// ===========================================================================

function showPlayerResetPasswordEmailInputGUI(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending show reset password email input GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showResetPasswordEmailInput", client);
}

// ===========================================================================

function showPlayerCharacterSelectGUI(client, firstName, lastName, cash, clan, lastPlayed, skin) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending character select GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showCharacterSelect", client, firstName, lastName, cash, clan, lastPlayed, skin);
}

// ===========================================================================

function updatePlayerCharacterSelectGUI(client, firstName, lastName, cash, clan, lastPlayed, skin) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending update character select GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.switchCharacterSelect", client, firstName, lastName, cash, clan, lastPlayed, skin);
}

// ===========================================================================

function showPlayerCharacterSelectSuccessGUI(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending character select success GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.characterSelectSuccess", client);
}

// ===========================================================================

function showPlayerCharacterSelectFailedGUI(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending character select failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.characterSelectFailed", client);
}

// ===========================================================================

function showPlayerPromptGUI(client, promptMessage, promptTitle, yesButtonText = "Yes", noButtonText = "No") {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending show prompt GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${promptTitle}, Message: ${promptMessage}, YesButton: ${yesButtonText}, NoButton: ${noButtonText})`);
	sendNetworkEventToPlayer("v.rp.showPrompt", client, promptMessage, promptTitle, yesButtonText, noButtonText);
}

// ===========================================================================

function showPlayerInfoGUI(client, infoMessage, infoTitle, buttonText = "OK") {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending show info GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${infoTitle}, Message: ${infoMessage})`);
	sendNetworkEventToPlayer("v.rp.showInfo", client, infoMessage, infoTitle, buttonText);
}

// ===========================================================================

function showPlayerErrorGUI(client, errorMessage, errorTitle, buttonText = "OK") {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending show error GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${errorTitle}, Message: ${errorMessage})`);
	sendNetworkEventToPlayer("v.rp.showError", client, errorMessage, errorTitle, buttonText);
}

// ===========================================================================

function sendRunCodeToClient(client, code, returnTo) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending runcode to ${getPlayerDisplayForConsole(client)} (returnTo: ${getPlayerDisplayForConsole(getClientFromIndex(returnTo))}, Code: ${code})`);
	sendNetworkEventToPlayer("v.rp.runCode", client, code, getPlayerId(returnTo));
}

// ===========================================================================

function sendPlayerWorkingState(client, state) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending working state (${toUpperCase(getYesNoFromBool(state))}) to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.working", client, state);
}

// ===========================================================================

function sendPlayerJobType(client, jobType) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending job type (${jobType}) to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.jobType", client, jobType);
}

// ===========================================================================

function sendPlayerStopJobRoute(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending signal to abort job route to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.hideJobRouteLocation", client);
}

// ===========================================================================

function sendPlayerMouseCameraToggle(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending signal to toggle mouse camera ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.mouseCamera", client);
}

// ===========================================================================

function setPlayerMouseCameraState(client, state) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending signal to toggle mouse camera ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.mouseCameraForce", client, state);
}

// ===========================================================================

function sendPlayerMouseCursorToggle(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending signal to toggle mouse cursor ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.mouseCursor", client);
}

// ===========================================================================

function sendAddAccountKeyBindToClient(client, key, keyState) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending added keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))}, State: ${(keyState) ? "down" : "up"})`);
	sendNetworkEventToPlayer("v.rp.addKeyBind", client, toInteger(key), (keyState) ? KEYSTATE_DOWN : KEYSTATE_UP);
}

// ===========================================================================

function sendClearKeyBindsToClient(client, key, keyState) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending added keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))}, State: ${(keyState) ? "down" : "up"})`);
	sendNetworkEventToPlayer("v.rp.clearKeyBinds", client);
}

// ===========================================================================

function sendRemoveAccountKeyBindToClient(client, key) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending deleted keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))})`);
	sendNetworkEventToPlayer("v.rp.delKeyBind", client, toInteger(key));
}

// ===========================================================================

function sendPlayerSetPosition(client, position) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending set position signal to ${getPlayerDisplayForConsole(client)} (Position: ${position.x}, ${position.y}, ${position.z})`);
	sendNetworkEventToPlayer("v.rp.position", client, position);
}

// ===========================================================================

function sendPlayerSetHeading(client, heading) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending set heading signal to ${getPlayerDisplayForConsole(client)} (Heading: ${heading})`);
	sendNetworkEventToPlayer("v.rp.heading", client, heading);
}

// ===========================================================================

function sendPlayerSetInterior(client, interior) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending set interior signal to ${getPlayerDisplayForConsole(client)} (Interior: ${interior})`);
	sendNetworkEventToPlayer("v.rp.interior", client, interior);
}

// ===========================================================================

function sendPlayerFrozenState(client, state) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending set frozen signal to ${getPlayerDisplayForConsole(client)} (State: ${toUpperCase(getYesNoFromBool(state))})`);
	sendNetworkEventToPlayer("v.rp.frozen", client, state);
}

// ===========================================================================

function clearPlayerWeapons(client, clearData = true) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending signal to ${getPlayerDisplayForConsole(client)} to clear weapons`);
	sendNetworkEventToPlayer("v.rp.clearWeapons", client, clearData);
}

// ===========================================================================

function showPlayerNewCharacterFailedGUI(client, errorMessage) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending new character failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.newCharacterFailed", client, errorMessage);
}

// ===========================================================================

function sendPlayerRemoveFromVehicle(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Sending remove from vehicle signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.removeFromVehicle", client);
}

// ===========================================================================

function sendChatBoxMessageToPlayer(client, messageText, colour) {
	//messageClient(messageText, client, colour);
	let date = new Date();
	sendNetworkEventToPlayer("m", client, messageText, colour, date.getHours(), date.getMinutes(), date.getSeconds());
}

// ===========================================================================

function showPlayerItemTakeDelay(client, itemId) {
	if (getItemData(itemId)) {
		let delay = getItemTypeData(getItemData(itemId).itemTypeIndex).pickupDelay;
		if (delay > 0) {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item TAKE delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item TAKE delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemUseDelay(client, itemSlot) {
	if (getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
		let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).useDelay;
		if (delay > 0) {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item USE delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item USE delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemDropDelay(client, itemSlot) {
	if (getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
		let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).dropDelay;
		if (delay > 0) {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item DROP delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item DROP delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemPickupDelay(client, itemId) {
	if (getItemData(itemId)) {
		let delay = getItemTypeData(getItemData(itemId).itemTypeIndex).pickupDelay;
		if (delay > 0) {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item PICKUP delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item PICKUP delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemPutDelay(client, itemSlot) {
	if (getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
		let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).putDelay;
		if (delay > 0) {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item PUT delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item PUT delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemSwitchDelay(client, itemSlot) {
	if (itemSlot != -1) {
		if (getPlayerData(client).hotBarItems[itemSlot] != -1) {
			let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).switchDelay;
			if (delay > 0) {
				logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
				sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
			} else {
				logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
				playerItemActionDelayComplete(client);
			}
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	} else {
		logToConsole(LOG_DEBUG, `[AGRP.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
		playerSwitchItem(client, itemSlot);
	}
}

// ===========================================================================

function sendPlayerDrunkEffect(client, amount, duration) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Setting drunk effect for ${getPlayerDisplayForConsole(client)} to ${amount} for ${duration} milliseconds`);
	sendNetworkEventToPlayer("v.rp.drunkEffect", client, amount, duration);
}

// ===========================================================================

function sendPlayerClearPedState(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Clearing ped state for ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.clearPedState", client);
}

// ===========================================================================

function playerDamagedByPlayer(client, damagerEntityName, weaponId, pedPiece, healthLoss) {
	let damagerEntity = getPlayerFromParams(damagerEntityName);

	if (isNull(damagerEntity)) {
		logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s damager entity from ID is null`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)} was damaged by ${damagerEntity}`);

	if (isNull(damagerEntity)) {
		logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s damager client is INVALID`);
		return false;
	}

	if (!getPlayerData(damagerEntity) || !getPlayerData(client)) {
		logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s damager's client data is INVALID`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s damager is ${getPlayerDisplayForConsole(damagerEntity)}`);

	switch (getPlayerData(damagerEntity).weaponDamageEvent) {
		case V_WEAPON_DAMAGE_EVENT_TAZER:
			logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} is using a tazer`);
			if (!isPlayerTazed(client) && !isPlayerHandCuffed(client) && !isPlayerInAnyVehicle(client)) {
				logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)} was not previously tazed, binded, or in a vehicle. Taze successful`);
				meActionToNearbyPlayers(damagerEntity, `electrifies ${getCharacterFullName(client)} with their tazer`);
				tazePlayer(client);
			}
			break;

		case V_WEAPON_DAMAGE_EVENT_EXTINGUISH:
			break;

		case V_WEAPON_DAMAGE_EVENT_MACE:
			break;

		case V_WEAPON_DAMAGE_EVENT_NORMAL:
			logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} caused ${healthLoss} damage (damage reduction makes it ${(healthLoss * getPlayerData(client).incomingDamageMultiplier)})`);
			let remainingDamage = healthLoss * getPlayerData(client).incomingDamageMultiplier;
			if (getPlayerArmour(client) > 0) {
				//logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s armour was ${getPlayerArmour(client)}, so it was reduced by ${healthLoss}`);
				if (getPlayerArmour(client) - remainingDamage < 0) {
					setPlayerArmour(client, 0);
					remainingDamage = remainingDamage - getPlayerArmour(client);
				} else {
					setPlayerArmour(client, getPlayerArmour(client) - remainingDamage);
				}
			}
			setPlayerHealth(client, getPlayerHealth(client) - remainingDamage);
			break;

		default:
			logToConsole(LOG_DEBUG, `[AGRP.Client] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} caused ${healthLoss} damage (damage reduction makes it ${(healthLoss * getPlayerData(client).incomingDamageMultiplier)})`);
			setPlayerHealth(client, getPlayerHealth(client) - (healthLoss * getPlayerData(client).incomingDamageMultiplier));
			break;
	}
}

// ===========================================================================

function setPlayerCameraLookAt(client, cameraPosition, lookAtPosition) {
	sendNetworkEventToPlayer("v.rp.cameraLookAt", client, cameraPosition, lookAtPosition);
}

// ===========================================================================

function sendTimeMinuteDurationToPlayer(client, minuteDuration) {
	sendNetworkEventToPlayer("v.rp.minuteDuration", client, minuteDuration);
}

// ===========================================================================

function updatePositionInPlayerData(client, position) {
	getPlayerData(client).syncPosition = position;
}

// ===========================================================================

function updateHeadingInPlayerData(client, heading) {
	getPlayerData(client).syncHeading = heading;
}

// ===========================================================================

function updatePositionInVehicleData(client, vehicle, position) {
	getVehicleData(vehicle).syncPosition = position;
}

// ===========================================================================

function updateHeadingInVehicleData(client, vehicle, heading) {
	getVehicleData(vehicle).syncHeading = heading;
}

// ===========================================================================

function forcePlayerIntoSkinSelect(client) {
	if (typeof getGameConfig().skinChangePosition[getGame()] != "undefined") {
		getPlayerData(client).returnToPosition = getPlayerPosition(client);
		getPlayerData(client).returnToHeading = getPlayerHeading(client);
		getPlayerData(client).returnToInterior = getPlayerInterior(client);
		getPlayerData(client).returnToDimension = getPlayerDimension(client);
		getPlayerData(client).returnToType = V_RETURNTO_TYPE_SKINSELECT;

		setPlayerPosition(client, getGameConfig().skinChangePosition[getGame()][0]);
		setPlayerHeading(client, getGameConfig().skinChangePosition[getGame()][1]);
		setPlayerInterior(client, getGameConfig().skinChangePosition[getGame()][2]);
		setPlayerDimension(client, getPlayerId(client) + 500);
	}

	sendNetworkEventToPlayer("v.rp.skinSelect", client, true);
}

// ===========================================================================

function updatePlayerCash(client) {
	sendNetworkEventToPlayer("v.rp.money", client, getPlayerCurrentSubAccount(client).cash);
}

// ===========================================================================

function sendAllPoliceStationBlips(client) {
	if (getGameConfig().blipSprites[getGame()].policeStation != -1) {
		let tempBlips = [];
		for (let i in getServerData().policeStations[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].policeStation,
				getServerData().policeStations[getGame()][i].position.x,
				getServerData().policeStations[getGame()][i].position.y,
				getServerData().policeStations[getGame()][i].position.z,
				3,
				getColourByName("policeBlue"),
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllFireStationBlips(client) {
	if (getGameConfig().blipSprites[getGame()].fireStation != -1) {
		let tempBlips = [];
		for (let i in getServerData().fireStations[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].fireStation,
				getServerData().fireStations[getGame()][i].position.x,
				getServerData().fireStations[getGame()][i].position.y,
				getServerData().fireStations[getGame()][i].position.z,
				3,
				getColourByName("firefighterRed"),
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllHospitalBlips(client) {
	if (getGameConfig().blipSprites[getGame()].hospital != -1) {
		let tempBlips = [];
		for (let i in getServerData().hospitals[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].hospital,
				getServerData().hospitals[getGame()][i].position.x,
				getServerData().hospitals[getGame()][i].position.y,
				getServerData().hospitals[getGame()][i].position.z,
				3,
				getColourByName("medicPink"),
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllAmmunationBlips(client) {
	if (getGameConfig().blipSprites[getGame()].ammunation != -1) {
		let tempBlips = [];
		for (let i in getServerData().ammunations[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].ammunation,
				getServerData().ammunations[getGame()][i].position.x,
				getServerData().ammunations[getGame()][i].position.y,
				getServerData().ammunations[getGame()][i].position.z,
				3,
				0
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllPayAndSprayBlips(client) {
	if (getGameConfig().blipSprites[getGame()].payAndSpray != -1) {
		let tempBlips = [];
		for (let i in getServerData().payAndSprays[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].payAndSpray,
				getServerData().payAndSprays[getGame()][i].position.x,
				getServerData().payAndSprays[getGame()][i].position.y,
				getServerData().payAndSprays[getGame()][i].position.z,
				3,
				0
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllFuelStationBlips(client) {
	if (getGameConfig().blipSprites[getGame()].fuelStation != -1) {
		let tempBlips = [];
		for (let i in getServerData().fuelStations[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].fuelStation,
				getServerData().fuelStations[getGame()][i].position.x,
				getServerData().fuelStations[getGame()][i].position.y,
				getServerData().fuelStations[getGame()][i].position.z,
				3,
				getColourByName("burntOrange"),
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendPlayerSetHealth(client, health) {
	sendNetworkEventToPlayer("v.rp.health", client, toInteger(health));
}

// ===========================================================================

function sendPlayerSetArmour(client, armour) {
	sendNetworkEventToPlayer("v.rp.armour", client, armour);
}

// ===========================================================================

function playerFinishedSkinSelection(client, allowedSkinIndex) {
	sendNetworkEventToPlayer("v.rp.skinSelect", client, false);
	if (allowedSkinIndex == -1) {
		messagePlayerAlert(client, "You canceled the skin change.");
		restorePlayerCamera(client);

		if (getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == V_RETURNTO_TYPE_SKINSELECT) {
			setPlayerPosition(client, getPlayerData(client).returnToPosition);
			setPlayerHeading(client, getPlayerData(client).returnToHeading);
			setPlayerInterior(client, getPlayerData(client).returnToInterior);
			setPlayerDimension(client, getPlayerData(client).returnToDimension);

			getPlayerData(client).returnToPosition = null;
			getPlayerData(client).returnToHeading = null;
			getPlayerData(client).returnToInterior = null;
			getPlayerData(client).returnToDimension = null;
		}
		return false;
	} else {
		getPlayerCurrentSubAccount(client).skin = getSkinIndexFromModel(getServerData().allowedSkins[allowedSkinIndex][0]);
		if (isPlayerWorking(client)) {
			messagePlayerAlert(client, "Your new skin has been saved but won't be shown until you stop working.");
			setPlayerSkin(client, getJobData(getPlayerCurrentSubAccount(client).job).uniforms[getPlayerData(client).jobUniform].skinId);
		} else {
			setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);
		}

		if (getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == V_RETURNTO_TYPE_SKINSELECT) {
			setPlayerPosition(client, getPlayerData(client).returnToPosition);
			setPlayerHeading(client, getPlayerData(client).returnToHeading);
			setPlayerInterior(client, getPlayerData(client).returnToInterior);
			setPlayerDimension(client, getPlayerData(client).returnToDimension);

			getPlayerData(client).returnToPosition = null;
			getPlayerData(client).returnToHeading = null;
			getPlayerData(client).returnToInterior = null;
			getPlayerData(client).returnToDimension = null;
		}

		restorePlayerCamera(client);
		setPlayerControlState(client, true);

		deleteItem(getPlayerData(client).itemActionItem);
		switchPlayerActiveHotBarSlot(client, -1);
		cachePlayerHotBarItems(client);

		meActionToNearbyPlayers(client, `changes their skin to ${getServerData().allowedSkins[allowedSkinIndex][1]}`);
	}
}

// ===========================================================================

function sendPlayerChatScrollLines(client, amount) {
	sendNetworkEventToPlayer("v.rp.chatScrollLines", client, amount);
}

// ===========================================================================

function sendPlayerChatAutoHideDelay(client, delay) {
	sendNetworkEventToPlayer("v.rp.chatAutoHideDelay", client, delay);
}

// ===========================================================================

function playRadioStreamForPlayer(client, streamURL, loop = true, volume = 0, element = false) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Forcing ${getPlayerDisplayForConsole(client)} to stream ${streamURL}`);
	sendNetworkEventToPlayer("v.rp.radioStream", client, streamURL, loop, volume, element);
}

// ===========================================================================

function playAudioFileForPlayer(client, audioName, loop = true, volume = 0, element = false) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Forcing ${getPlayerDisplayForConsole(client)} to play audio ${audioName}`);
	sendNetworkEventToPlayer("v.rp.audioFileStream", client, audioName, loop, volume);
}

// ===========================================================================

function stopRadioStreamForPlayer(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Client] Forcing ${getPlayerDisplayForConsole(client)} to stop their radio stream`);
	sendNetworkEventToPlayer("v.rp.stopRadioStream", client);
}

// ===========================================================================

function setPlayerStreamingRadioVolume(client, volumeLevel, elementId = false) {
	getPlayerData(client).accountData.streamingRadioVolume = volumeLevel;
	getPlayerData(client).streamingRadioElement = elementId;
	sendNetworkEventToPlayer("v.rp.radioVolume", client, volumeLevel, elementId);
}

// ===========================================================================

function setVehicleLightsState(vehicle, state) {
	setEntityData(vehicle, "v.rp.lights", getVehicleData(vehicle).lights);
	sendNetworkEventToPlayer("v.rp.veh.lights", null, vehicle.id, state);
}

// ===========================================================================

function sendPlayerEnterPropertyKey(client, key) {
	sendNetworkEventToPlayer("v.rp.enterPropertyKey", client, key);
}

// ===========================================================================

function makePedPlayAnimation(ped, animationSlot, positionOffset) {
	if (getAnimationData(animationSlot).loop == true) {
		setEntityData(ped, "v.rp.anim", animationSlot, true);
	}
	sendNetworkEventToPlayer("v.rp.anim", null, getPedForNetworkEvent(ped), animationSlot, positionOffset);
}

// ===========================================================================

function makePedStopAnimation(ped) {
	removeEntityData(ped, "v.rp.anim");
	sendNetworkEventToPlayer("v.rp.stopAnim", null, getPedForNetworkEvent(ped));
}

// ===========================================================================

function forcePedAnimation(ped, animationSlot, positionOffset = 0) {
	setEntityData(ped, "v.rp.anim", animationSlot, true);
	sendNetworkEventToPlayer("v.rp.forceAnim", null, getPedForNetworkEvent(ped), animationSlot, positionOffset);
}

// ===========================================================================

function hideAllPlayerGUI(client) {
	sendNetworkEventToPlayer("v.rp.hideAllGUI", client);
}

// ===========================================================================

function requestClientInfo(client) {
	sendNetworkEventToPlayer("v.rp.clientInfo", client);
}

// ===========================================================================

function updateInteriorLightsForPlayer(client, state) {
	sendNetworkEventToPlayer("v.rp.interiorLights", client, state);
}

// ===========================================================================

function forcePlayerToSyncElementProperties(client, element) {
	sendNetworkEventToPlayer("v.rp.syncElement", client, element.id);
}

// ===========================================================================

function sendPlayerPedPartsAndProps(client) {
	let bodyParts = getPlayerCurrentSubAccount(client).bodyParts;
	let bodyProps = getPlayerCurrentSubAccount(client).bodyProps;

	sendNetworkEventToPlayer("v.rp.ped", client, [bodyParts.hair, bodyParts.head, bodyParts.upper, bodyParts.lower], [bodyProps.hair, bodyProps.eyes, bodyProps.head, bodyProps.leftHand, bodyProps.rightHand, bodyProps.leftWrist, bodyProps.rightWrist, bodyParts.hip, bodyProps.leftFoot, bodyProps.rightFoot]);
}

// ===========================================================================

function onPlayerNearPickup(client, pickupId) {
	getPlayerData(client).currentPickup = getElementFromId(pickupId);
}

// ===========================================================================

function updateAllInteriorVehiclesForPlayer(client, interior, dimension) {
	for (let i in getServerData().vehicles) {
		if (getServerData().vehicles[i].vehicle != false) {
			if (getServerData().vehicles[i].interior == interior && getServerData().vehicles[i].dimension == dimension) {
				forcePlayerToSyncElementProperties(client, getServerData().vehicles[i].vehicle);
			}
		}
	}
}

// ===========================================================================

function setPlayerBuyingVehicleState(client, state, vehicleId, position) {
	if (getGlobalConfig().useServerSideVehiclePurchaseCheck == false) {
		sendNetworkEventToPlayer("v.rp.vehBuyState", client, state, vehicleId, position);
	}
}

// ==========================================================================

function receiveVehiclePurchaseStateUpdateFromClient(client, state) {
	if (getGlobalConfig().useServerSideVehiclePurchaseCheck == false) {
		checkVehiclePurchasing(client);
	}
}

// ===========================================================================

function sendPlayerLogLevel(client, tempLogLevel = logLevel) {
	sendNetworkEventToPlayer("v.rp.logLevel", client, tempLogLevel);
}

// ==========================================================================

function setPlayerInfiniteRun(client, state) {
	sendNetworkEventToPlayer("v.rp.infiniteRun", client, state);
}

// ==========================================================================

function sendBusinessToPlayer(client, businessId, name, entrancePosition, blipModel, pickupModel, buyPrice, rentPrice, hasInterior, locked, hasItems) {
	sendNetworkEventToPlayer("v.rp.business", client, businessId, name, entrancePosition, blipModel, pickupModel, buyPrice, rentPrice, hasInterior, locked, hasItems);
}

// ==========================================================================

function sendHouseToPlayer(client, houseId, description, entrancePosition, blipModel, pickupModel, buyPrice, rentPrice, hasInterior, locked) {
	sendNetworkEventToPlayer("v.rp.house", client, houseId, description, entrancePosition, blipModel, pickupModel, buyPrice, rentPrice, hasInterior, locked);
}

// ==========================================================================

function sendJobToPlayer(client, jobId, jobLocationId, name, position, blipModel, pickupModel) {
	sendNetworkEventToPlayer("v.rp.job", client, jobId, jobLocationId, name, position);
}

// ==========================================================================

function sendVehicleToPlayer(client, vehicleId, model, position, heading, colour1, colour2, colour3, colour4) {
	sendNetworkEventToPlayer("v.rp.vehicle", client, vehicleId, model, position, heading, colour1, colour2, colour3, colour4);
}

// ==========================================================================

function sendAllBusinessesToPlayer(client) {
	let businesses = getServerData().businesses;
	for (let i in businesses) {
		sendBusinessToPlayer(client, businesses[i].index, businesses[i].name, businesses[i].entrancePosition, businesses[i].entranceBlipModel, businesses[i].entrancePickupModel, businesses[i].buyPrice, businesses[i].rentPrice, businesses[i].hasInterior, doesBusinessHaveAnyItemsToBuy(i));
	}
}

// ==========================================================================

function sendAllHousesToPlayer(client) {
	let houses = getServerData().houses;
	for (let i in houses) {
		sendHouseToPlayer(client, houses[i].index, houses[i].entrancePosition, houses[i].entranceBlipModel, houses[i].entrancePickupModel, houses[i].buyPrice, houses[i].rentPrice, houses[i].hasInterior);
	}
}

// ==========================================================================

function sendAllJobsToPlayer(client) {
	let jobs = getServerData().jobs;
	for (let i in jobs) {
		for (let j in jobs[i].locations) {
			sendJobToPlayer(client, jobs[i].index, jobs[i].locations[j].index, jobs[i].name, jobs[i].locations[j].position, jobs[i].pickupModel, jobs[i].blipModel);
		}
	}
}

// ==========================================================================

function sendAllVehiclesToPlayer(client) {
	let vehicles = getServerData().vehicles;
	for (let i in vehicles) {
		sendVehicleToPlayer(client, vehicles[i].index, vehicles[i].model, vehicles[i].syncPosition, vehicles[i].syncHeading, vehicles[i].colour1, vehicles[i].colour2, vehicles[i].colour3, vehicles[i].colour4);
	}
}

// ==========================================================================

function makePlayerHoldObjectModel(client, modelIndex) {
	sendNetworkEventToPlayer("v.rp.holdObject", client, getPlayerData(client).ped, modelIndex);
}

// ==========================================================================

function receivePlayerPedNetworkId(client, pedId) {
	getPlayerData(client).ped = pedId;
}

// ==========================================================================

function requestPlayerPedNetworkId(client) {
	sendNetworkEventToPlayer("v.rp.playerPedId", client);
}

// ==========================================================================

function setPlayerScene(client, sceneName) {
	getPlayerData(client).scene = sceneName;
	sendNetworkEventToPlayer("v.rp.scene", client, sceneName);
}

// ==========================================================================

function makePlayerPedSpeak(client, pedSpeechName) {
	sendNetworkEventToPlayer("v.rp.pedSpeak", client, pedSpeechName);
}

// ==========================================================================

function setPlayerAsCopState(client, state) {
	sendNetworkEventToPlayer("v.rp.playerCop", client, state);
}

// ==========================================================================

function tellPlayerToSpawn(client, skinId, position) {
	sendNetworkEventToPlayer("v.rp.spawn", client, skinId, position);
}

// ==========================================================================

function sendNameTagDistanceToClient(client, distance) {
	sendNetworkEventToPlayer("v.rp.nameTagDistance", client, distance);
}

// ==========================================================================

function sendGPSBlipToPlayer(client, position, colour) {
	sendNetworkEventToPlayer("v.rp.showGPSBlip", client, position, colour);
}

// ==========================================================================

function playerSelectedNewLocale(client, localeId) {
	getPlayerData(client).locale = localeId;
	sendPlayerLocaleId(client, localeId);
}

// ==========================================================================

function sendPlayerLocaleId(client, localeId) {
	sendNetworkEventToPlayer("v.rp.locale", client, localeId);
}

// ==========================================================================

function showLocaleChooserForPlayer(client) {
	sendNetworkEventToPlayer("v.rp.localeChooser", client);
}

// ==========================================================================

function sendPlayerLocaleStrings(client) {
	let strings = getGlobalConfig().locale.sendStringsToClient;
	for (let i in strings) {
		sendNetworkEventToPlayer("v.rp.localeString", client, strings[i], getLocaleString(client, strings[i]));
	}
}

// ==========================================================================

function clearLocalPickupsForPlayer(client) {
	sendNetworkEventToPlayer("v.rp.clearPickups", client);
}

// ==========================================================================

function sendPlayerChatBoxTimeStampsState(client, state) {
	sendNetworkEventToPlayer("v.rp.chatTimeStamps", client, state);
}

// ==========================================================================

function sendPlayerChatEmojiState(client, state) {
	sendNetworkEventToPlayer("v.rp.chatEmoji", client, state);
}

// ==========================================================================

function sendPlayerProfanityFilterState(client, state) {
	sendNetworkEventToPlayer("v.rp.profanityFilter", client, state);
}

// ==========================================================================

function sendPlayerToggleVehicleCruiseControl(client) {
	sendNetworkEventToPlayer("v.rp.cruiseControl", client);
}

// ==========================================================================

function showSingleParticleEffect(position, particleEffectId, strength = 1.0, duration = 5000) {
	sendNetworkEventToPlayer("v.rp.particleEffectSingle", null, position, particleEffectId, strength, duration);
}

// ==========================================================================

function sendPlayerCurrencyString(client) {
	sendNetworkEventToPlayer("v.rp.currencyString", client, getGlobalConfig().economy.currencyString);
}

// ==========================================================================

function sendMapChangeWarningToPlayer(client, changingToNight) {
	sendNetworkEventToPlayer("v.rp.mapChangingSoon", client, changingToNight);
}

// ==========================================================================

function playerMapLoaded(client, mapName) {
	//updateAllInteriorVehiclesForPlayer(client, propertyData.exitInterior, propertyData.exitDimension);
	getPlayerData(client).scene = mapName;

	setTimeout(function () {
		processPlayerEnteringExitingProperty(client);
	}, 500);
}

// ==========================================================================

function setMapChangeWarningForPlayer(client, isChanging) {
	sendNetworkEventToPlayer("v.rp.mapChangeWarning", client, isChanging);
}

// ==========================================================================

function fadePlayerCamera(client, fadeIn, time, colour = toColour(0, 0, 0, 255)) {
	sendNetworkEventToPlayer("v.rp.fadeCamera", client, fadeIn, time, colour);
}

// ==========================================================================

function sendClientVariablesToClient(client) {
	sendNetworkEventToPlayer("v.rp.cvar", client, JSON.stringify(clientVariables));
}

// ==========================================================================

function requestPlayerToken(client) {
	sendNetworkEventToPlayer("v.rp.token", client);
}

// ==========================================================================