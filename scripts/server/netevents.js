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
	logToConsole(LOG_DEBUG, "[V.RP.NetEvents]: Adding network handlers ...");

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
	addNetworkEventHandler("v.rp.playerDeath", processPlayerDeath);

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
	addNetworkEventHandler("v.rp.plr.rot", updateRotationInVehicleData);
	addNetworkEventHandler("v.rp.veh.seat", updatePlayerVehicleSeat);
	addNetworkEventHandler("v.rp.skinSelected", playerFinishedSkinSelection);
	addNetworkEventHandler("v.rp.skinCanceled", playerCanceledSkinSelection);
	addNetworkEventHandler("v.rp.clientInfo", updateConnectionLogOnClientInfoReceive);
	addNetworkEventHandler("v.rp.vehBuyState", receiveVehiclePurchaseStateUpdateFromClient);
	addNetworkEventHandler("v.rp.playerPedId", receivePlayerPedNetworkId);
	addNetworkEventHandler("v.rp.playerCop", setPlayerAsCopState);
	addNetworkEventHandler("v.rp.mapLoaded", playerMapLoaded);
	addNetworkEventHandler("v.rp.vehicleSeat", receiveVehicleSeatFromPlayer);
	addNetworkEventHandler("v.rp.enteredVehicle", receiveEnteredVehicleFromPlayer);
	addNetworkEventHandler("v.rp.exitedVehicle", receiveExitedVehicleFromPlayer);
}

// ===========================================================================

function updatePlayerNameTag(client) {
	if (client == null) {
		return false;
	}

	if (getPlayerData(client) == null) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending ${getPlayerDisplayForConsole(client)}'s updated nametag to all players`);
	sendNetworkEventToPlayer("v.rp.nametag", null, getPlayerName(client), getPlayerNameForNameTag(client), getPlayerColour(client), getPlayerData(client).afk, getPlayerPing(client));
}

// ===========================================================================

function updateAllPlayerNameTags() {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending updated nametags to all players`);
	let clients = getClients();
	for (let i in clients) {
		updatePlayerNameTag(clients[i]);
	}
}

// ===========================================================================

function updatePlayerPing(client) {
	//logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending ${getPlayerDisplayForConsole(client)}'s ping to all players`);
	sendNetworkEventToPlayer("v.rp.ping", null, getPlayerName(client), getPlayerPing(client));
	//setEntityData(client, "v.rp.ping", getPlayerPing(client), true);
}

// ===========================================================================

function playerClientReady(client) {
	playerResourceReady[client.index] = true;
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s client resources are downloaded and ready! Started: ${getYesNoFromBool(playerResourceStarted[client.index])}`);
	if (playerResourceStarted[client.index] == true && playerInitialized[client.index] == false) {
		initClient(client);
	}
}

// ===========================================================================

function playerGUIReady(client) {
	playerGUI[client.index] = true;
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s client GUI is initialized and ready!`);
}

// ===========================================================================

function playerClientStarted(client) {
	playerResourceStarted[client.index] = true;
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s client resources are started and running! Ready: ${getYesNoFromBool(playerResourceReady[client.index])}`);
	if (playerResourceReady[client.index] == true && playerInitialized[client.index] == false) {
		initClient(client);
	}
}

// ===========================================================================

function playerClientStopped(client) {
	logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s client resources have stopped (possibly error?)`);
	//getPlayerData(client).customDisconnectReason = "ClientScriptVerificationFail";
	//disconnectPlayer(client);
}

// ===========================================================================

function showSmallGameMessage(client, text, colour, duration, fontName = "Roboto") {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing game message to ${getPlayerDisplayForConsole(client)} (${text}) for ${duration} milliseconds`);

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

	//logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Setting ${getPlayerDisplayForConsole(client)}'s city ambience to ${toUpperCase(getOnOffFromBool(false))}`);
	//sendNetworkEventToPlayer("v.rp.ambience", client, true);
}

// ===========================================================================

function disableCityAmbienceForPlayer(client, clearElements = false) {
	//if(server.getCVar("civilians") == true) {
	//    return false;
	//}

	//logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Setting ${getPlayerDisplayForConsole(client)}'s city ambience to ${toUpperCase(getOnOffFromBool(false))}`);
	//sendNetworkEventToPlayer("v.rp.ambience", client, false, clearElements);
}

// ===========================================================================

function clearPlayerOwnedPeds(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Clearing peds owned by ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.clearPeds", client);
}

// ===========================================================================

function updatePlayerSpawnedState(client, state) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Setting ${getPlayerDisplayForConsole(client)}'s spawned state ${toUpperCase(getOnOffFromBool(state))}`);
	getPlayerData(client).spawned = true;
	sendNetworkEventToPlayer("v.rp.spawned", client, state);
}

// ===========================================================================

function setPlayerControlState(client, state) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Setting ${getPlayerDisplayForConsole(client)}'s control state ${toUpperCase(getOnOffFromBool(state))}`);
	sendNetworkEventToPlayer("v.rp.control", client, state, !state);
}

// ===========================================================================

function updatePlayerShowLogoState(client, state) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Setting ${getPlayerDisplayForConsole(client)}'s logo state ${toUpperCase(getOnOffFromBool(state))}`);
	sendNetworkEventToPlayer("v.rp.logo", client, state);
}

// ===========================================================================

function restorePlayerCamera(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Restoring ${getPlayerDisplayForConsole(client)}'s camera`);
	sendNetworkEventToPlayer("v.rp.restoreCamera", client);
}

// ===========================================================================

function setPlayer2DRendering(client, hudState = false, labelState = false, smallGameMessageState = false, scoreboardState = false, hotBarState = false, itemActionDelayState = false) {
	sendNetworkEventToPlayer("v.rp.set2DRendering", client, hudState, labelState, smallGameMessageState, scoreboardState, hotBarState, itemActionDelayState);
}

// ===========================================================================

function syncPedProperties(ped) {
	sendNetworkEventToPlayer("v.rp.syncElement", null, ped.id);
}

// ===========================================================================

function updatePlayerSnowState(client, forceGroundSnow = false) {
	if (isGameFeatureSupported("snow")) {
		logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Setting ${getPlayerDisplayForConsole(client)}'s snow state (Falling: ${toUpperCase(getOnOffFromBool(serverConfig.fallingSnow))}, Ground: ${toUpperCase(getOnOffFromBool(serverConfig.groundSnow))})`);
		sendNetworkEventToPlayer("v.rp.snow", client, serverConfig.fallingSnow, serverConfig.groundSnow, forceGroundSnow);
	}
}

// ===========================================================================

function updatePlayerHotBar(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending updated hotbar data to ${getPlayerDisplayForConsole(client)}`);
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
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending weapon damage state for ${getPlayerDisplayForConsole(client)} to all players`);
	sendNetworkEventToPlayer("v.rp.weaponDamageEnabled", null, getPlayerName(client), state);
}

// ===========================================================================

function setPlayerWeaponDamageEvent(client, eventType) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending weapon damage event (${eventType}) for ${getPlayerDisplayForConsole(client)} to all players`);
	sendNetworkEventToPlayer("v.rp.weaponDamageEvent", null, getPlayerName(client), eventType);
	getPlayerData(client).weaponDamageEvent = eventType;
}

// ===========================================================================

function sendJobRouteLocationToPlayer(client, position, dimension, colour) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending job route location data to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showJobRouteLocation", client, position, dimension, colour);
}

// ===========================================================================

function showPlayerLoginSuccessGUI(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending login success GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.loginSuccess", client);
}

// ===========================================================================

function showPlayerLoginFailedGUI(client, errorMessage) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending login failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.loginFailed", client, errorMessage);
}

// ===========================================================================

function showPlayerRegistrationSuccessGUI(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending registration success GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.registrationSuccess", client);
}

// ===========================================================================

function showPlayerRegistrationFailedGUI(client, errorMessage) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending registration failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.registrationFailed", client, errorMessage);
}

// ===========================================================================

function sendPlayerGUIColours(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending GUI colours to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.guiColour", client, serverConfig.guiColourPrimary[0], serverConfig.guiColourPrimary[1], serverConfig.guiColourPrimary[2], serverConfig.guiColourSecondary[0], serverConfig.guiColourSecondary[1], serverConfig.guiColourSecondary[2], serverConfig.guiTextColourPrimary[0], serverConfig.guiTextColourPrimary[1], serverConfig.guiTextColourPrimary[2]);
}

// ===========================================================================

function sendPlayerGUIInit(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending GUI init signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.guiInit", client);
}

// ===========================================================================

function showPlayerLoginGUI(client, errorMessage = "") {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending show login GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showLogin", client);
}

// ===========================================================================

function showPlayerRegistrationGUI(client, errorMessage = "") {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending show registration GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showRegistration", client);
}

// ===========================================================================

function showPlayerNewCharacterGUI(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending show new character GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showNewCharacter", client);
}

// ===========================================================================

function showPlayerChangePasswordGUI(client, errorMessage = "") {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending show change password GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showChangePassword", client, errorMessage);
}

// ===========================================================================

function showPlayerResetPasswordCodeInputGUI(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending show reset password code input GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showResetPasswordCodeInput", client);
}

// ===========================================================================

function showPlayerResetPasswordEmailInputGUI(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending show reset password email input GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showResetPasswordEmailInput", client);
}

// ===========================================================================

function showPlayerCharacterSelectGUI(client, firstName, lastName, cash, clan, lastPlayed, skin) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending character select GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.showCharacterSelect", client, firstName, lastName, cash, clan, lastPlayed, skin);
}

// ===========================================================================

function updatePlayerCharacterSelectGUI(client, firstName, lastName, cash, clan, lastPlayed, skin) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending update character select GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.switchCharacterSelect", client, firstName, lastName, cash, clan, lastPlayed, skin);
}

// ===========================================================================

function showPlayerCharacterSelectSuccessGUI(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending character select success GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.characterSelectSuccess", client);
}

// ===========================================================================

function showPlayerCharacterSelectFailedGUI(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending character select failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.characterSelectFailed", client);
}

// ===========================================================================

function showPlayerPromptGUI(client, promptMessage, promptTitle, yesButtonText = "Yes", noButtonText = "No") {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending show prompt GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${promptTitle}, Message: ${promptMessage}, YesButton: ${yesButtonText}, NoButton: ${noButtonText})`);
	sendNetworkEventToPlayer("v.rp.showPrompt", client, promptMessage, promptTitle, yesButtonText, noButtonText);
}

// ===========================================================================

function showPlayerInfoGUI(client, infoMessage, infoTitle, buttonText = "OK") {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending show info GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${infoTitle}, Message: ${infoMessage})`);
	sendNetworkEventToPlayer("v.rp.showInfo", client, infoMessage, infoTitle, buttonText);
}

// ===========================================================================

function showPlayerErrorGUI(client, errorMessage, errorTitle, buttonText = "OK") {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending show error GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${errorTitle}, Message: ${errorMessage})`);
	sendNetworkEventToPlayer("v.rp.showError", client, errorMessage, errorTitle, buttonText);
}

// ===========================================================================

function sendRunCodeToClient(client, code, returnTo, shouldReturn = true) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending runcode to ${getPlayerDisplayForConsole(client)} (returnTo: ${getPlayerDisplayForConsole(getClientFromIndex(returnTo))}, Code: ${code})`);
	sendNetworkEventToPlayer("v.rp.runCode", client, code, getPlayerId(returnTo), shouldReturn);
}

// ===========================================================================

function sendPlayerWorkingState(client, state) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending working state (${toUpperCase(getYesNoFromBool(state))}) to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.working", client, state);
}

// ===========================================================================

function sendPlayerJobType(client, jobType) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending job type (${jobType}) to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.jobType", client, jobType);
}

// ===========================================================================

function sendPlayerStopJobRoute(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending signal to abort job route to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.hideJobRouteLocation", client);
}

// ===========================================================================

function sendPlayerMouseCameraToggle(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending signal to toggle mouse camera ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.mouseCamera", client);
}

// ===========================================================================

function setPlayerMouseCameraState(client, state) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending signal to toggle mouse camera ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.mouseCameraForce", client, state);
}

// ===========================================================================

function sendPlayerMouseCursorToggle(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending signal to toggle mouse cursor ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.mouseCursor", client);
}

// ===========================================================================

function sendAddAccountKeyBindToClient(client, key, keyState) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending added keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))}, State: ${(keyState) ? "down" : "up"})`);
	sendNetworkEventToPlayer("v.rp.addKeyBind", client, toInteger(key), (keyState) ? KEYSTATE_DOWN : KEYSTATE_UP);
}

// ===========================================================================

function sendClearKeyBindsToClient(client, key, keyState) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending added keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))}, State: ${(keyState) ? "down" : "up"})`);
	sendNetworkEventToPlayer("v.rp.clearKeyBinds", client);
}

// ===========================================================================

function sendRemoveAccountKeyBindToClient(client, key) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending deleted keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))})`);
	sendNetworkEventToPlayer("v.rp.delKeyBind", client, toInteger(key));
}

// ===========================================================================

function sendPlayerSetPosition(client, position) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending set position signal to ${getPlayerDisplayForConsole(client)} (Position: ${position.x}, ${position.y}, ${position.z})`);
	sendNetworkEventToPlayer("v.rp.position", client, position);
}

// ===========================================================================

function sendPlayerSetHeading(client, heading) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending set heading signal to ${getPlayerDisplayForConsole(client)} (Heading: ${heading})`);
	sendNetworkEventToPlayer("v.rp.heading", client, heading);
}

// ===========================================================================

function sendPlayerSetInterior(client, interior) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending set interior signal to ${getPlayerDisplayForConsole(client)} (Interior: ${interior})`);
	sendNetworkEventToPlayer("v.rp.interior", client, interior);
}

// ===========================================================================

function sendPlayerFrozenState(client, state) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending set frozen signal to ${getPlayerDisplayForConsole(client)} (State: ${toUpperCase(getYesNoFromBool(state))})`);
	sendNetworkEventToPlayer("v.rp.frozen", client, state);
}

// ===========================================================================

function clearPlayerWeapons(client, clearData = true) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending signal to ${getPlayerDisplayForConsole(client)} to clear weapons`);
	sendNetworkEventToPlayer("v.rp.clearWeapons", client, clearData);
}

// ===========================================================================

function showPlayerNewCharacterFailedGUI(client, errorMessage) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending new character failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.newCharacterFailed", client, errorMessage);
}

// ===========================================================================

function sendPlayerRemoveFromVehicle(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending remove from vehicle signal to ${getPlayerDisplayForConsole(client)}`);
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
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item TAKE delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item TAKE delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemUseDelay(client, itemSlot) {
	if (getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
		let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).useDelay;
		if (delay > 0) {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item USE delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item USE delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemDropDelay(client, itemSlot) {
	if (getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
		let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).dropDelay;
		if (delay > 0) {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item DROP delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item DROP delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemPickupDelay(client, itemId) {
	if (getItemData(itemId)) {
		let delay = getItemTypeData(getItemData(itemId).itemTypeIndex).pickupDelay;
		if (delay > 0) {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item PICKUP delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item PICKUP delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemPutDelay(client, itemSlot) {
	if (getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
		let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).putDelay;
		if (delay > 0) {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item PUT delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item PUT delay to ${getPlayerDisplayForConsole(client)} (instant)`);
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
				logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
				sendNetworkEventToPlayer("v.rp.showItemActionDelay", client, delay);
			} else {
				logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
				playerItemActionDelayComplete(client);
			}
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	} else {
		logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
		playerSwitchItem(client, itemSlot);
	}
}

// ===========================================================================

function sendPlayerDrunkEffect(client, amount, duration) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Setting drunk effect for ${getPlayerDisplayForConsole(client)} to ${amount} for ${duration} milliseconds`);
	sendNetworkEventToPlayer("v.rp.drunkEffect", client, amount, duration);
}

// ===========================================================================

function sendPlayerClearPedState(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Clearing ped state for ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.clearPedState", client);
}

// ===========================================================================

function playerDamagedByPlayer(client, damagerEntityName, weaponId, pedPiece, healthLoss) {
	let damagerEntity = getPlayerFromParams(damagerEntityName);

	if (isNull(damagerEntity)) {
		logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s damager entity from ID is null`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)} was damaged by ${damagerEntity}`);

	if (isNull(damagerEntity)) {
		logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s damager client is INVALID`);
		return false;
	}

	if (getPlayerData(damagerEntity) == null || getPlayerData(client) == null) {
		logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s damager's client data is INVALID`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s damager is ${getPlayerDisplayForConsole(damagerEntity)}`);

	switch (getPlayerData(damagerEntity).weaponDamageEvent) {
		case V_WEAPON_DAMAGE_EVENT_TAZER:
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} is using a tazer`);
			if (!isPlayerTazed(client) && !isPlayerHandCuffed(client) && !isPlayerInAnyVehicle(client)) {
				logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)} was not previously tazed, binded, or in a vehicle. Taze successful`);
				meActionToNearbyPlayers(damagerEntity, `electrifies ${getCharacterFullName(client)} with their tazer`);
				tazePlayer(client);
			}
			break;

		case V_WEAPON_DAMAGE_EVENT_EXTINGUISH:
			break;

		case V_WEAPON_DAMAGE_EVENT_MACE:
			break;

		case V_WEAPON_DAMAGE_EVENT_NORMAL:
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} caused ${healthLoss} damage (damage reduction makes it ${(healthLoss * getPlayerData(client).incomingDamageMultiplier)})`);
			let remainingDamage = healthLoss * getPlayerData(client).incomingDamageMultiplier;
			if (getPlayerArmour(client) > 0) {
				//logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s armour was ${getPlayerArmour(client)}, so it was reduced by ${healthLoss}`);
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
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} caused ${healthLoss} damage (damage reduction makes it ${(healthLoss * getPlayerData(client).incomingDamageMultiplier)})`);
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

function updateRotationInVehicleData(client, vehicle, rotation) {
	getVehicleData(vehicle).syncRotation = rotation;
}

// ===========================================================================

function forcePlayerIntoSkinSelect(client, forceCurrentSkin = -1) {
	if (typeof gameData.skinChangePosition[getGame()] != "undefined") {
		getPlayerData(client).returnToPosition = getPlayerPosition(client);
		getPlayerData(client).returnToHeading = getPlayerHeading(client);
		getPlayerData(client).returnToInterior = getPlayerInterior(client);
		getPlayerData(client).returnToDimension = getPlayerDimension(client);
		getPlayerData(client).returnToType = V_RETURNTO_TYPE_SKINSELECT;

		setPlayerPosition(client, gameData.skinChangePosition[getGame()][0]);
		setPlayerHeading(client, gameData.skinChangePosition[getGame()][1]);
		setPlayerInterior(client, gameData.skinChangePosition[getGame()][2]);
		setPlayerDimension(client, getPlayerId(client) + globalConfig.skinChangeDimensionStart);
	}

	sendNetworkEventToPlayer("v.rp.skinSelect", client, true, getPlayerCurrentSubAccount(client).skin, forceCurrentSkin);
}

// ===========================================================================

function updatePlayerCash(client) {
	logToConsole(LOG_DEBUG, `[V.RP.Event] Syncing ${getPlayerDisplayForConsole(client)}'s cash (${getCurrencyString(getPlayerCurrentSubAccount(client).cash)})`);
	sendNetworkEventToPlayer("v.rp.money", client, getPlayerCurrentSubAccount(client).cash);
}

// ===========================================================================

function sendAllPoliceStationBlips(client) {
	if (gameData.blipSprites[getGame()].policeStation != -1) {
		let tempBlips = [];
		for (let i in serverData.policeStations[getGame()]) {
			tempBlips.push([
				gameData.blipSprites[getGame()].policeStation,
				serverData.policeStations[getGame()][i].position.x,
				serverData.policeStations[getGame()][i].position.y,
				serverData.policeStations[getGame()][i].position.z,
				3,
				getColourByName("policeBlue"),
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllFireStationBlips(client) {
	if (gameData.blipSprites[getGame()].fireStation != -1) {
		let tempBlips = [];
		for (let i in serverData.fireStations[getGame()]) {
			tempBlips.push([
				gameData.blipSprites[getGame()].fireStation,
				serverData.fireStations[getGame()][i].position.x,
				serverData.fireStations[getGame()][i].position.y,
				serverData.fireStations[getGame()][i].position.z,
				3,
				getColourByName("firefighterRed"),
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllHospitalBlips(client) {
	if (gameData.blipSprites[getGame()].hospital != -1) {
		let tempBlips = [];
		for (let i in serverData.hospitals[getGame()]) {
			tempBlips.push([
				gameData.blipSprites[getGame()].hospital,
				serverData.hospitals[getGame()][i].position.x,
				serverData.hospitals[getGame()][i].position.y,
				serverData.hospitals[getGame()][i].position.z,
				3,
				getColourByName("medicPink"),
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllAmmunationBlips(client) {
	if (gameData.blipSprites[getGame()].ammunation != -1) {
		let tempBlips = [];
		for (let i in serverData.ammunations[getGame()]) {
			tempBlips.push([
				gameData.blipSprites[getGame()].ammunation,
				serverData.ammunations[getGame()][i].position.x,
				serverData.ammunations[getGame()][i].position.y,
				serverData.ammunations[getGame()][i].position.z,
				3,
				0
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllPayAndSprayBlips(client) {
	if (gameData.blipSprites[getGame()].payAndSpray != -1) {
		let tempBlips = [];
		for (let i in serverData.payAndSprays[getGame()]) {
			tempBlips.push([
				gameData.blipSprites[getGame()].payAndSpray,
				serverData.payAndSprays[getGame()][i].position.x,
				serverData.payAndSprays[getGame()][i].position.y,
				serverData.payAndSprays[getGame()][i].position.z,
				3,
				0
			]);
		}
		sendNetworkEventToPlayer("v.rp.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllFuelStationBlips(client) {
	if (gameData.blipSprites[getGame()].fuelStation != -1) {
		let tempBlips = [];
		for (let i in serverData.fuelStations[getGame()]) {
			tempBlips.push([
				gameData.blipSprites[getGame()].fuelStation,
				serverData.fuelStations[getGame()][i].position.x,
				serverData.fuelStations[getGame()][i].position.y,
				serverData.fuelStations[getGame()][i].position.z,
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

function playerFinishedSkinSelection(client, skinIndex, bodyPartHead, bodyPartUpper, bodyPartLower, bodyPartHat) {
	if (isPlayerWorking(client)) {
		//setPlayerSkin(client, getPlayerData(client).jobUniform);
		//if (isGameFeatureSupported("pedBodyPart")) {
		//	setPedBodyPart(getPlayerPed(client), V_SKINSELECT_HEAD, bodyPartHead);
		//	setPedBodyPart(getPlayerPed(client), V_SKINSELECT_UPPER, bodyPartUpper);
		//	setPedBodyPart(getPlayerPed(client), V_SKINSELECT_LOWER, bodyPartLower);
		//	setPedBodyPart(getPlayerPed(client), V_SKINSELECT_HAT, bodyPartHat);
		//}
		//messagePlayerAlert(client, "Your new skin has been saved but won't be shown until you stop working.");
	} else {
		getPlayerCurrentSubAccount(client).skin = skinIndex;

		getPlayerCurrentSubAccount(client).bodyParts.head = bodyPartHead;
		getPlayerCurrentSubAccount(client).bodyParts.upper = bodyPartUpper;
		getPlayerCurrentSubAccount(client).bodyParts.lower = bodyPartLower;
		getPlayerCurrentSubAccount(client).bodyProps.head = bodyPartHat;

		//setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);
		//setPedBodyPart(getPlayerPed(client), V_SKINSELECT_HEAD, bodyPartHead);
		//setPedBodyPart(getPlayerPed(client), V_SKINSELECT_UPPER, bodyPartUpper);
		//setPedBodyPart(getPlayerPed(client), V_SKINSELECT_LOWER, bodyPartLower);
		//setPedBodyPart(getPlayerPed(client), V_SKINSELECT_HAT, bodyPartHat);
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

	if (!isPlayerWorking(client)) {
		meActionToNearbyPlayers(client, `changes their skin to ${gameData.skins[getGame()][skinIndex][1]}`);
	}
}

// ===========================================================================

function playerCanceledSkinSelection(client) {
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
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Forcing ${getPlayerDisplayForConsole(client)} to stream ${streamURL}`);
	sendNetworkEventToPlayer("v.rp.radioStream", client, streamURL, loop, volume, element);
}

// ===========================================================================

function playAudioFileForPlayer(client, audioName, loop = true, volume = 0, element = false) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Forcing ${getPlayerDisplayForConsole(client)} to play audio ${audioName}`);
	sendNetworkEventToPlayer("v.rp.audioFileStream", client, audioName, loop, volume);
}

// ===========================================================================

function stopRadioStreamForPlayer(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Forcing ${getPlayerDisplayForConsole(client)} to stop their radio stream`);
	sendNetworkEventToPlayer("v.rp.stopRadioStream", client);
}

// ===========================================================================

function setPlayerStreamingRadioVolume(client, volumeLevel, elementId = -1) {
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

function sendPlayerScoreBoardKey(client, key) {
	sendNetworkEventToPlayer("v.rp.scoreBoardKey", client, key);
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
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].vehicle != false) {
			if (serverData.vehicles[i].interior == interior && serverData.vehicles[i].dimension == dimension) {
				forcePlayerToSyncElementProperties(client, serverData.vehicles[i].vehicle);
			}
		}
	}
}

// ===========================================================================

function setPlayerBuyingVehicleState(client, state, vehicleId, position) {
	if (globalConfig.useServerSideVehiclePurchaseCheck == false) {
		sendNetworkEventToPlayer("v.rp.vehBuyState", client, state, vehicleId, position);
	}
}

// ==========================================================================

function receiveVehiclePurchaseStateUpdateFromClient(client, state) {
	if (globalConfig.useServerSideVehiclePurchaseCheck == false) {
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

function sendBusinessToPlayer(client, businessId, isDeleted, name, entrancePosition, exitPosition, blipModel, pickupModel, buyPrice, rentPrice, locked, entranceFee, labelInfoType, entranceDimension, exitDimension) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending business ${businessId} (${name}) to player ${getPlayerDisplayForConsole(client)} (entrance dimension: ${entranceDimension})`);

	sendNetworkEventToPlayer(
		"v.rp.business",
		client,
		businessId,
		isDeleted,
		name,
		entrancePosition,
		exitPosition,
		blipModel,
		pickupModel,
		buyPrice,
		rentPrice,
		locked,
		entranceFee,
		labelInfoType,
		entranceDimension,
		exitDimension
	);
}

// ==========================================================================

function sendHouseToPlayer(client, houseId, isDeleted, description, entrancePosition, exitPosition, blipModel, pickupModel, buyPrice, rentPrice, locked, labelInfoType, entranceDimension, exitDimension) {
	sendNetworkEventToPlayer("v.rp.house", client,
		houseId,
		isDeleted,
		description,
		entrancePosition,
		exitPosition,
		blipModel,
		pickupModel,
		buyPrice,
		rentPrice,
		locked,
		labelInfoType,
		entranceDimension,
		exitDimension
	);
}

// ==========================================================================

function sendJobToPlayer(client, jobId, isDeleted, jobLocationId, name, position, blipModel, pickupModel, hasPublicRank, dimension) {
	sendNetworkEventToPlayer("v.rp.job", client, jobId, isDeleted, jobLocationId, name, position, blipModel, pickupModel, hasPublicRank, dimension);
}

// ==========================================================================

function sendVehicleToPlayer(client, vehicleId, isDeleted, model, position, heading, colour1, colour2, colour3, colour4, dimension) {
	sendNetworkEventToPlayer("v.rp.vehicle", client, vehicleId, isDeleted, model, position, heading, colour1, colour2, colour3, colour4, dimension);
}

// ==========================================================================

function sendPayPhoneToPlayer(client, payPhoneId, isDeleted, state, position) {
	sendNetworkEventToPlayer("v.rp.payPhone", client, payPhoneId, isDeleted, state, position);
}

// ==========================================================================

function sendAllBusinessesToPlayer(client) {
	sendNetworkEventToPlayer("v.rp.removeBusinesses", client);

	let businesses = serverData.businesses;
	for (let i in businesses) {
		sendBusinessToPlayer(client,
			businesses[i].index,
			false,
			businesses[i].name,
			businesses[i].entrancePosition,
			businesses[i].exitPosition,
			getBusinessEntranceBlipModelForNetworkEvent(businesses[i].index),
			getBusinessEntrancePickupModelForNetworkEvent(businesses[i].index),
			applyServerInflationMultiplier(businesses[i].buyPrice),
			applyServerInflationMultiplier(businesses[i].rentPrice),
			businesses[i].locked,
			businesses[i].entranceFee,
			getBusinessPropertyInfoLabelType(i),
			businesses[i].entranceDimension,
			businesses[i].exitDimension
		);
	}
}

// ==========================================================================

function sendAllHousesToPlayer(client) {
	sendNetworkEventToPlayer("v.rp.removeHouses", client);

	let houses = serverData.houses;
	for (let i in houses) {
		sendHouseToPlayer(client,
			houses[i].index,
			false,
			houses[i].description,
			houses[i].entrancePosition,
			houses[i].exitPosition,
			getHouseEntranceBlipModelForNetworkEvent(houses[i].index),
			getHouseEntrancePickupModelForNetworkEvent(houses[i].index),
			applyServerInflationMultiplier(houses[i].buyPrice),
			applyServerInflationMultiplier(houses[i].rentPrice),
			houses[i].locked,
			getHousePropertyInfoLabelType(houses[i].index),
			houses[i].entranceDimension,
			houses[i].exitDimension,
		);
	}
}

// ==========================================================================

function sendAllJobsToPlayer(client) {
	sendNetworkEventToPlayer("v.rp.removeJobs", client);

	let jobs = serverData.jobs;
	for (let i in jobs) {
		for (let j in jobs[i].locations) {
			sendJobToPlayer(
				client,
				jobs[i].index,
				false,
				jobs[i].locations[j].index,
				jobs[i].name,
				jobs[i].locations[j].position,
				getJobLocationBlipModelForNetworkEvent(i),
				getJobLocationPickupModelForNetworkEvent(i),
				doesJobHavePublicRank(i),
				0
			);
		}
	}
}

// ==========================================================================

function sendAllVehiclesToPlayer(client) {
	sendNetworkEventToPlayer("v.rp.removeVehicles", client);

	let vehicles = serverData.vehicles;
	for (let i in vehicles) {
		sendVehicleToPlayer(client, vehicles[i].index, false, vehicles[i].model, vehicles[i].syncPosition, vehicles[i].syncHeading, vehicles[i].colour1, vehicles[i].colour2, vehicles[i].colour3, vehicles[i].colour4);
	}
}

// ==========================================================================

function sendAllPayPhonesToPlayer(client) {
	sendNetworkEventToPlayer("v.rp.removePayPhones", client);

	let payPhones = serverData.payPhones;
	for (let i in payPhones) {
		sendPayPhoneToPlayer(client, payPhones[i].index, false, payPhones[i].state, payPhones[i].position);
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

function setPlayerScene(client, interiorName) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Changing player ${getPlayerDisplayForConsole(client)}'s scene to ${interiorName} (Game: ${getSceneForInterior(interiorName)})`);
	sendNetworkEventToPlayer("v.rp.scene", client, getSceneForInterior(interiorName));
}

// ==========================================================================

function makePedSpeak(ped, pedSpeechName) {
	sendNetworkEventToPlayer("v.rp.pedSpeak", null, ped.id, pedSpeechName);
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
	let strings = globalConfig.locale.sendStringsToClient;
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
	sendNetworkEventToPlayer("v.rp.currencyString", client, serverConfig.economy.currencyString);
}

// ==========================================================================

function sendMapChangeWarningToPlayer(client, changingToNight) {
	sendNetworkEventToPlayer("v.rp.mapChangingSoon", client, changingToNight);
}

// ==========================================================================

function playerMapLoaded(client, mapName) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Map changed to ${mapName} for player ${getPlayerDisplayForConsole(client)}`);
	//updateAllInteriorVehiclesForPlayer(client, propertyData.exitInterior, propertyData.exitDimension);
	//if (getPlayerData(client).pedState == V_PEDSTATE_ENTERINGPROPERTY || getPlayerData(client).pedState == V_PEDSTATE_EXITINGPROPERTY || getPlayerData(client).pedState == V_PEDSTATE_SPAWNING) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Attempting processing of scene switch to ${mapName} for player ${getPlayerDisplayForConsole(client)} ...`);
	processPlayerSceneSwitch(client, true);
	//}
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

function sendPayPhoneStateToPlayer(client, payPhoneIndex, state) {
	sendNetworkEventToPlayer("v.rp.payPhoneState", client, payPhoneIndex, state);
}

// ==========================================================================

function sendPayPhoneDialingToPlayer(client) {
	sendNetworkEventToPlayer("v.rp.payPhoneDial", client);
}

// ==========================================================================

function sendPayPhoneHangupToPlayer(client) {
	sendNetworkEventToPlayer("v.rp.payPhoneHangup", client);
}

// ==========================================================================

function sendPayPhonePickupToPlayer(client) {
	sendNetworkEventToPlayer("v.rp.payPhonePickup", client);
}

// ==========================================================================

function sendIncomingDamageMultiplierToClient(client, multiplier) {
	sendNetworkEventToPlayer("v.rp.incomingDamageMultiplier", client, multiplier);
}

// ==========================================================================

function receiveVehicleSeatFromPlayer(client, seat) {
	getPlayerData(client).seat = seat;
}

// ==========================================================================

function sendWarpPedIntoVehicle(client, pedId, vehicleId, seatId) {
	sendNetworkEventToPlayer("v.rp.warpIntoVehicle", client, pedId, vehicleId, seatId);
}

// ==========================================================================

function sendPedRemoveFromVehicle(client, pedId) {
	sendNetworkEventToPlayer("v.rp.removeFromVehicle", client, pedId);
}

// ==========================================================================

function receiveEnteredVehicleFromPlayer(client, pedId, vehicleId, seat) {
	onPedEnteredVehicle(null, getElementFromId(pedId), getElementFromId(vehicleId), seat);
}

// ==========================================================================

function receiveExitedVehicleFromPlayer(client, pedId, vehicleId, seat) {
	onPedExitedVehicle(null, getElementFromId(pedId), getElementFromId(vehicleId), seat);
}

// ==========================================================================

function sendPlayerGodMode(client, state) {
	sendNetworkEventToPlayer("v.rp.godmode", client, state);
}

// ==========================================================================

function startCountDownForPlayer(client) {
	sendNetworkEventToPlayer("v.rp.countDown", client);
}

// ==========================================================================

function showPlayerListGUI(client) {
	logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Sending gui list to player ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("v.rp.list", client);
}

// ==========================================================================

function updatePlayerVehicleSeat(client, seat) {
	if (client == null) {
		return false;
	}

	if (getPlayerData(client) == null) {
		return false;
	}

	getPlayerData(client).vehicleSeat = seat;
}

// ==========================================================================