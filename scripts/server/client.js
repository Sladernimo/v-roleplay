// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: client.js
// DESC: Provides client communication and cross-endpoint operations
// TYPE: Server (JavaScript)
// ===========================================================================

function initClientScript() {
	logToConsole(LOG_DEBUG, "[VRR.Client]: Initializing client script ...");
	addAllNetworkHandlers();
	logToConsole(LOG_DEBUG, "[VRR.Client]: Client script initialized!");
}

// ===========================================================================

function addAllNetworkHandlers() {
	logToConsole(LOG_DEBUG, "[VRR.Client]: Adding network handlers ...");

	// KeyBind
	addNetworkEventHandler("vrr.useKeyBind", playerUsedKeyBind);

	// GUI
	addNetworkEventHandler("vrr.promptAnswerNo", playerPromptAnswerNo);
	addNetworkEventHandler("vrr.promptAnswerYes", playerPromptAnswerYes);
	addNetworkEventHandler("vrr.toggleGUI", playerToggledGUI);
	addNetworkEventHandler("vrr.2fa", checkPlayerTwoFactorAuthentication);

	// AFK
	addNetworkEventHandler("vrr.afk", playerChangeAFKState);

	// Event
	addNetworkEventHandler("vrr.pickup", onPlayerNearPickup);
	addNetworkEventHandler("vrr.enteredSphere", onPlayerEnteredSphere);
	addNetworkEventHandler("vrr.exitedSphere", onPlayerExitedSphere);
	addNetworkEventHandler("vrr.playerDeath", onPlayerDeath);
	addNetworkEventHandler("vrr.onPlayerEnterVehicle", onPlayerEnteredVehicle);
	addNetworkEventHandler("vrr.onPlayerExitVehicle", onPlayerExitedVehicle);

	// Job
	addNetworkEventHandler("vrr.arrivedAtJobRouteLocation", playerArrivedAtJobRouteLocation);

	// Client
	addNetworkEventHandler("vrr.clientReady", playerClientReady);
	addNetworkEventHandler("vrr.guiReady", playerGUIReady);
	addNetworkEventHandler("vrr.clientStarted", playerClientStarted);
	addNetworkEventHandler("vrr.clientStopped", playerClientStopped);

	// Account
	addNetworkEventHandler("vrr.checkLogin", checkLogin);
	addNetworkEventHandler("vrr.checkRegistration", checkRegistration);
	addNetworkEventHandler("vrr.checkResetPassword", checkAccountResetPasswordRequest);
	addNetworkEventHandler("vrr.checkChangePassword", checkAccountChangePassword);

	// Developer
	addNetworkEventHandler("vrr.runCodeSuccess", clientRunCodeSuccess);
	addNetworkEventHandler("vrr.runCodeFail", clientRunCodeFail);

	// SubAccount
	addNetworkEventHandler("vrr.checkNewCharacter", checkNewCharacter);
	addNetworkEventHandler("vrr.nextCharacter", checkNextCharacter);
	addNetworkEventHandler("vrr.previousCharacter", checkPreviousCharacter);
	addNetworkEventHandler("vrr.selectCharacter", selectCharacter);

	// Item
	addNetworkEventHandler("vrr.itemActionDelayComplete", playerItemActionDelayComplete);
	addNetworkEventHandler("vrr.weaponDamage", playerDamagedByPlayer);

	// Locale
	addNetworkEventHandler("vrr.localeSelect", playerSelectedNewLocale);

	// Misc
	addNetworkEventHandler("vrr.plr.pos", updatePositionInPlayerData);
	addNetworkEventHandler("vrr.plr.rot", updateHeadingInPlayerData);
	addNetworkEventHandler("vrr.skinSelected", playerFinishedSkinSelection);
	addNetworkEventHandler("vrr.clientInfo", updateConnectionLogOnClientInfoReceive);
	addNetworkEventHandler("vrr.vehBuyState", receiveVehiclePurchaseStateUpdateFromClient);
	addNetworkEventHandler("vrr.playerPedId", receivePlayerPedNetworkId);
	addNetworkEventHandler("vrr.playerCop", setPlayerAsCopState);
}

// ===========================================================================

function updatePlayerNameTag(client) {
	//logToConsole(LOG_DEBUG, `[VRR.Client] Sending ${getPlayerDisplayForConsole(client)}'s updated nametag to all players`);
	sendNetworkEventToPlayer("vrr.nametag", null, getPlayerName(client), getPlayerNameForNameTag(client), getPlayerColour(client), getPlayerData(client).afk, getPlayerPing(client));
}

// ===========================================================================

function updateAllPlayerNameTags() {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending updated nametags to all players`);
	let clients = getClients();
	for(let i in clients) {
		updatePlayerNameTag(clients[i]);
	}
}

// ===========================================================================

function updatePlayerPing(client) {
	//logToConsole(LOG_DEBUG, `[VRR.Client] Sending ${getPlayerDisplayForConsole(client)}'s ping to all players`);
	sendNetworkEventToPlayer("vrr.ping", null, getPlayerName(client), getPlayerPing(client));
}

// ===========================================================================

function playerClientReady(client) {
	setEntityData(client, "vrr.isReady", true, false);
	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s client resources are downloaded and ready!`);
	if(getEntityData(client, "vrr.isStarted") == true) {
		initClient(client);
	}
}

// ===========================================================================

function playerGUIReady(client) {
	setEntityData(client, "vrr.guiReady", true, false);
	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s client GUI is initialized and ready!`);
}

// ===========================================================================

function playerClientStarted(client) {
	setEntityData(client, "vrr.isStarted", true, false);
	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s client resources are started and running!`);
	if(getEntityData(client, "vrr.isReady") == true) {
		initClient(client);
	}
}

// ===========================================================================

function playerClientStopped(client) {
	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s client resources have stopped (possibly error?). Kicking them from the server ...`);
	disconnectPlayer(client);
}

// ===========================================================================

function showGameMessage(client, text, colour, duration, fontName = "Pricedown") {
	logToConsole(LOG_DEBUG, `[VRR.Client] Showing game message to ${getPlayerDisplayForConsole(client)} (${text}) for ${duration} milliseconds`);
	sendNetworkEventToPlayer("vrr.smallGameMessage", client, text, colour, duration, fontName);
}

// ===========================================================================

function enableCityAmbienceForPlayer(client, clearElements = false) {
	//if(server.getCVar("civilians") == false) {
	//    return false;
	//}

	//logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s city ambience to ${toUpperCase(getOnOffFromBool(false))}`);
	//sendNetworkEventToPlayer("vrr.ambience", client, true);
}

// ===========================================================================

function disableCityAmbienceForPlayer(client, clearElements = false) {
	//if(server.getCVar("civilians") == true) {
	//    return false;
	//}

	//logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s city ambience to ${toUpperCase(getOnOffFromBool(false))}`);
	//sendNetworkEventToPlayer("vrr.ambience", client, false, clearElements);
}

// ===========================================================================

function clearPlayerOwnedPeds(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Clearing peds owned by ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.clearPeds", client);
}

// ===========================================================================

function updatePlayerSpawnedState(client, state) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s spawned state ${toUpperCase(getOnOffFromBool(state))}`);
	getPlayerData(client).spawned = true;
	sendNetworkEventToPlayer("vrr.spawned", client, state);
}

// ===========================================================================

function setPlayerControlState(client, state) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s control state ${toUpperCase(getOnOffFromBool(state))}`);
	sendNetworkEventToPlayer("vrr.control", client, state, !state);
}

// ===========================================================================

function updatePlayerShowLogoState(client, state) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s logo state ${toUpperCase(getOnOffFromBool(state))}`);
	sendNetworkEventToPlayer("vrr.logo", client, state);
}

// ===========================================================================

function restorePlayerCamera(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Restoring ${getPlayerDisplayForConsole(client)}'s camera`);
	sendNetworkEventToPlayer("vrr.restoreCamera", client);
}

// ===========================================================================

function setPlayer2DRendering(client, hudState = false, labelState = false, smallGameMessageState = false, scoreboardState = false, hotBarState = false, itemActionDelayState = false) {
	sendNetworkEventToPlayer("vrr.set2DRendering", client, hudState, labelState, smallGameMessageState, scoreboardState, hotBarState, itemActionDelayState);
}

// ===========================================================================

function syncPlayerProperties(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to sync ${getPlayerDisplayForConsole(client)}'s player ped properties`);
	sendNetworkEventToPlayer("vrr.syncElement", null, getPlayerPed(client).id);
}

// ===========================================================================

function updatePlayerSnowState(client) {
	if(isSnowSupported(getGame())) {
		logToConsole(LOG_DEBUG, `[VRR.Client] Setting ${getPlayerDisplayForConsole(client)}'s snow state (Falling: ${toUpperCase(getOnOffFromBool(getServerConfig().fallingSnow))}, Ground: ${toUpperCase(getOnOffFromBool(getServerConfig().groundSnow))})`);
		sendNetworkEventToPlayer("vrr.snow", client, getServerConfig().fallingSnow, getServerConfig().groundSnow);
	}
}

// ===========================================================================

function updatePlayerHotBar(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending updated hotbar data to ${getPlayerDisplayForConsole(client)}`);
	let tempHotBarItems = [];
	for(let i in getPlayerData(client).hotBarItems) {
		let itemImage = "";
		let itemValue = 0;
		let itemExists = false;
		if(getPlayerData(client).hotBarItems[i] != -1) {
			if(getItemData(getPlayerData(client).hotBarItems[i])) {
				let itemData = getItemData(getPlayerData(client).hotBarItems[i]);
				let itemTypeData = getItemTypeData(itemData.itemTypeIndex);
				itemExists = true;
				itemImage = itemTypeData.hotbarImage;
				itemValue = itemData.value;
			}
		}
		tempHotBarItems.push([i, itemExists, itemImage, itemValue]);
	}
	sendNetworkEventToPlayer("vrr.hotbar", client, getPlayerData(client).activeHotBarSlot, tempHotBarItems);
}

// ===========================================================================

function setPlayerWeaponDamageEnabled(client, state) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending weapon damage state for ${getPlayerDisplayForConsole(client)} to all players`);
	sendNetworkEventToPlayer("vrr.weaponDamageEnabled", null, getPlayerName(client), state);
}

// ===========================================================================

function setPlayerWeaponDamageEvent(client, eventType) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending weapon damage event (${eventType}) for ${getPlayerDisplayForConsole(client)} to all players`);
	sendNetworkEventToPlayer("vrr.weaponDamageEvent", null, getPlayerName(client), eventType);
	getPlayerData(client).weaponDamageEvent = eventType;
}

// ===========================================================================

function sendJobRouteLocationToPlayer(client, position, colour) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending job route stop data to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.showJobRouteLocation", client, position, colour);
}

// ===========================================================================

function showPlayerLoginSuccessGUI(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending login success GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.loginSuccess", client);
}

// ===========================================================================

function showPlayerLoginFailedGUI(client, errorMessage) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending login failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.loginFailed", client, errorMessage);
}

// ===========================================================================

function showPlayerRegistrationSuccessGUI(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending registration success GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.registrationSuccess", client);
}

// ===========================================================================

function showPlayerRegistrationFailedGUI(client, errorMessage) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending registration failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.registrationFailed", client, errorMessage);
}

// ===========================================================================

function sendPlayerGUIColours(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending GUI colours to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.guiColour", client, getServerConfig().guiColourPrimary[0], getServerConfig().guiColourPrimary[1], getServerConfig().guiColourPrimary[2], getServerConfig().guiColourSecondary[0], getServerConfig().guiColourSecondary[1], getServerConfig().guiColourSecondary[2], getServerConfig().guiTextColourPrimary[0], getServerConfig().guiTextColourPrimary[1], getServerConfig().guiTextColourPrimary[2]);
}

// ===========================================================================

function sendPlayerGUIInit(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending GUI init signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.guiInit", client);
}

// ===========================================================================

function showPlayerLoginGUI(client, errorMessage = "") {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending show login GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.showLogin", client);
}

// ===========================================================================

function showPlayerRegistrationGUI(client, errorMessage = "") {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending show registration GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.showRegistration", client);
}

// ===========================================================================

function showPlayerNewCharacterGUI(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending show new character GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.showNewCharacter", client);
}

// ===========================================================================

function showPlayerChangePasswordGUI(client, errorMessage = "") {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending show change password GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.showChangePassword", client, errorMessage);
}

// ===========================================================================

function showPlayerResetPasswordCodeInputGUI(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending show reset password code input GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.showResetPasswordCodeInput", client);
}

// ===========================================================================

function showPlayerResetPasswordEmailInputGUI(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending show reset password email input GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.showResetPasswordEmailInput", client);
}

// ===========================================================================

function showPlayerCharacterSelectGUI(client, firstName, lastName, cash, clan, lastPlayed, skin) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending character select GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.showCharacterSelect", client, firstName, lastName, cash, clan, lastPlayed, skin);
}

// ===========================================================================

function updatePlayerCharacterSelectGUI(client, firstName, lastName, cash, clan, lastPlayed, skin) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending update character select GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.switchCharacterSelect", client, firstName, lastName, cash, clan, lastPlayed, skin);
}

// ===========================================================================

function showPlayerCharacterSelectSuccessGUI(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending character select success GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.characterSelectSuccess", client);
}

// ===========================================================================

function showPlayerCharacterSelectFailedGUI(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending character select failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.characterSelectFailed", client);
}

// ===========================================================================

function showPlayerPromptGUI(client, promptMessage, promptTitle, yesButtonText = "Yes", noButtonText = "No") {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending show prompt GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${promptTitle}, Message: ${promptMessage}, YesButton: ${yesButtonText}, NoButton: ${noButtonText})`);
	sendNetworkEventToPlayer("vrr.showPrompt", client, promptMessage, promptTitle, yesButtonText, noButtonText);
}

// ===========================================================================

function showPlayerInfoGUI(client, infoMessage, infoTitle, buttonText = "OK") {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending show info GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${infoTitle}, Message: ${infoMessage})`);
	sendNetworkEventToPlayer("vrr.showInfo", client, infoMessage, infoTitle, buttonText);
}

// ===========================================================================

function showPlayerErrorGUI(client, errorMessage, errorTitle, buttonText = "OK") {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending show error GUI signal to ${getPlayerDisplayForConsole(client)} (Title: ${errorTitle}, Message: ${errorMessage})`);
	sendNetworkEventToPlayer("vrr.showError", client, errorMessage, errorTitle, buttonText);
}

// ===========================================================================

function sendRunCodeToClient(client, code, returnTo) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending runcode to ${getPlayerDisplayForConsole(client)} (returnTo: ${getPlayerDisplayForConsole(getClientFromIndex(returnTo))}, Code: ${code})`);
	sendNetworkEventToPlayer("vrr.runCode", client, code, getPlayerId(returnTo));
}

// ===========================================================================

function sendPlayerWorkingState(client, state) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending working state (${toUpperCase(getYesNoFromBool(state))}) to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.working", client, state);
}

// ===========================================================================

function sendPlayerJobType(client, jobType) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending job type (${jobType}) to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.jobType", client, jobType);
}

// ===========================================================================

function sendPlayerStopJobRoute(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to abort job route to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.hideJobRouteLocation", client);
}

// ===========================================================================

function sendPlayerMouseCameraToggle(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to toggle mouse camera ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.mouseCamera", client);
}

// ===========================================================================

function setPlayerMouseCameraState(client, state) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to toggle mouse camera ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.mouseCameraForce", client, state);
}

// ===========================================================================

function sendPlayerMouseCursorToggle(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to toggle mouse cursor ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.mouseCursor", client);
}

// ===========================================================================

function sendAddAccountKeyBindToClient(client, key, keyState) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending added keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))}, State: ${(keyState) ? "down" : "up"})`);
	sendNetworkEventToPlayer("vrr.addKeyBind", client, toInteger(key), (keyState) ? KEYSTATE_DOWN : KEYSTATE_UP);
}

// ===========================================================================

function sendClearKeyBindsToClient(client, key, keyState) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending added keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))}, State: ${(keyState) ? "down" : "up"})`);
	sendNetworkEventToPlayer("vrr.clearKeyBinds", client);
}

// ===========================================================================

function sendRemoveAccountKeyBindToClient(client, key) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending deleted keybind to ${getPlayerDisplayForConsole(client)} (Key: ${toUpperCase(getKeyNameFromId(key))})`);
	sendNetworkEventToPlayer("vrr.delKeyBind", client, toInteger(key));
}

// ===========================================================================

function sendPlayerSetPosition(client, position) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending set position signal to ${getPlayerDisplayForConsole(client)} (Position: ${position.x}, ${position.y}, ${position.z})`);
	sendNetworkEventToPlayer("vrr.position", client, position);
}

// ===========================================================================

function sendPlayerSetHeading(client, heading) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending set heading signal to ${getPlayerDisplayForConsole(client)} (Heading: ${heading})`);
	sendNetworkEventToPlayer("vrr.heading", client, heading);
}

// ===========================================================================

function sendPlayerSetInterior(client, interior) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending set interior signal to ${getPlayerDisplayForConsole(client)} (Interior: ${interior})`);
	sendNetworkEventToPlayer("vrr.interior", client, interior);
}

// ===========================================================================

function sendPlayerFrozenState(client, state) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending set frozen signal to ${getPlayerDisplayForConsole(client)} (State: ${toUpperCase(getYesNoFromBool(state))})`);
	sendNetworkEventToPlayer("vrr.frozen", client, state);
}

// ===========================================================================

function clearPlayerWeapons(client, clearData = true) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to ${getPlayerDisplayForConsole(client)} to clear weapons`);
	sendNetworkEventToPlayer("vrr.clearWeapons", client, clearData);
}

// ===========================================================================

function showPlayerNewCharacterFailedGUI(client, errorMessage) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending new character failed GUI signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.newCharacterFailed", client, errorMessage);
}

// ===========================================================================

function sendPlayerRemoveFromVehicle(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Sending remove from vehicle signal to ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.removeFromVehicle", client);
}

// ===========================================================================

function sendChatBoxMessageToPlayer(client, messageText, colour) {
	//messageClient(messageText, client, colour);
	sendNetworkEventToPlayer("m", client, messageText, colour);
}

// ===========================================================================

function showPlayerItemTakeDelay(client, itemId) {
	if(getItemData(itemId)) {
		let delay = getItemTypeData(getItemData(itemId).itemTypeIndex).pickupDelay;
		if(delay > 0) {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item TAKE delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item TAKE delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemUseDelay(client, itemSlot) {
	if(getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
		let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).useDelay;
		if(delay > 0) {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item USE delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item USE delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemDropDelay(client, itemSlot) {
	if(getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
		let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).dropDelay;
		if(delay > 0) {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item DROP delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item DROP delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemPickupDelay(client, itemId) {
	if(getItemData(itemId)) {
		let delay = getItemTypeData(getItemData(itemId).itemTypeIndex).pickupDelay;
		if(delay > 0) {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item PICKUP delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item PICKUP delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemPutDelay(client, itemSlot) {
	if(getItemData(getPlayerData(client).hotBarItems[itemSlot])) {
		let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).putDelay;
		if(delay > 0) {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item PUT delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
			sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
		} else {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item PUT delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	}
}

// ===========================================================================

function showPlayerItemSwitchDelay(client, itemSlot) {
	if(itemSlot != -1) {
		if(getPlayerData(client).hotBarItems[itemSlot] != -1) {
			let delay = getItemTypeData(getItemData(getPlayerData(client).hotBarItems[itemSlot]).itemTypeIndex).switchDelay;
			if(delay > 0) {
				logToConsole(LOG_DEBUG, `[VRR.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (${delay} milliseconds)`);
				sendNetworkEventToPlayer("vrr.showItemActionDelay", client, delay);
			} else{
				logToConsole(LOG_DEBUG, `[VRR.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
				playerItemActionDelayComplete(client);
			}
		} else {
			logToConsole(LOG_DEBUG, `[VRR.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
			playerItemActionDelayComplete(client);
		}
	} else {
		logToConsole(LOG_DEBUG, `[VRR.Client] Showing item switch delay to ${getPlayerDisplayForConsole(client)} (instant)`);
		playerSwitchItem(client, itemSlot);
	}
}

// ===========================================================================

function sendPlayerDrunkEffect(client, amount, duration) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Setting drunk effect for ${getPlayerDisplayForConsole(client)} to ${amount} for ${duration} milliseconds`);
	sendNetworkEventToPlayer("vrr.drunkEffect", client, amount, duration);
}

// ===========================================================================

function sendPlayerClearPedState(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Clearing ped state for ${getPlayerDisplayForConsole(client)}`);
	sendNetworkEventToPlayer("vrr.clearPedState", client);
}

// ===========================================================================

function playerDamagedByPlayer(client, damagerEntityName, weaponId, pedPiece, healthLoss) {
	let damagerEntity = getPlayerFromParams(damagerEntityName);

	if(isNull(damagerEntity)) {
		logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager entity from ID is null`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)} was damaged by ${damagerEntity}`);

	if(isNull(damagerEntity)) {
		logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager client is INVALID`);
		return false;
	}

	if(!getPlayerData(damagerEntity) || !getPlayerData(client)) {
		logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager's client data is INVALID`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager is ${getPlayerDisplayForConsole(damagerEntity)}`);

	switch(getPlayerData(damagerEntity).weaponDamageEvent) {
		case VRR_WEAPON_DAMAGE_EVENT_TAZER:
			logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} is using a tazer`);
			if(!isPlayerTazed(client) && !isPlayerHandCuffed(client) && !isPlayerInAnyVehicle(client)) {
				logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)} was not previously tazed, binded, or in a vehicle. Taze successful`);
				meActionToNearbyPlayers(damagerEntity, `electrifies ${getCharacterFullName(client)} with their tazer`);
				tazePlayer(client);
			}
			break;

		case VRR_WEAPON_DAMAGE_EVENT_EXTINGUISH:
			break;

		case VRR_WEAPON_DAMAGE_EVENT_MACE:
			break;

		case VRR_WEAPON_DAMAGE_EVENT_NORMAL:
			logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} caused ${healthLoss} damage (damage reduction makes it ${(healthLoss*getPlayerData(client).incomingDamageMultiplier)})`);
			setPlayerHealth(client, getPlayerHealth(client)-(healthLoss*getPlayerData(client).incomingDamageMultiplier));
			break;

		default:
			logToConsole(LOG_DEBUG, `[VRR.Client] ${getPlayerDisplayForConsole(client)}'s damager ${getPlayerDisplayForConsole(damagerEntity)} caused ${healthLoss} damage (damage reduction makes it ${(healthLoss*getPlayerData(client).incomingDamageMultiplier)})`);
			setPlayerHealth(client, getPlayerHealth(client)-(healthLoss*getPlayerData(client).incomingDamageMultiplier));
			break;
	}
}

// ===========================================================================

function setPlayerCameraLookAt(client, cameraPosition, lookAtPosition) {
	sendNetworkEventToPlayer("vrr.cameraLookAt", client, cameraPosition, lookAtPosition);
}

// ===========================================================================

function sendTimeMinuteDurationToPlayer(client, minuteDuration) {
	sendNetworkEventToPlayer("vrr.minuteDuration", client, minuteDuration);
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
	if(typeof getGameConfig().skinChangePosition[getGame()] != "undefined") {
		getPlayerData(client).returnToPosition = getPlayerPosition(client);
		getPlayerData(client).returnToHeading = getPlayerHeading(client);
		getPlayerData(client).returnToInterior = getPlayerInterior(client);
		getPlayerData(client).returnToDimension = getPlayerDimension(client);
		getPlayerData(client).returnToType = VRR_RETURNTO_TYPE_SKINSELECT;

		setPlayerPosition(client, getGameConfig().skinChangePosition[getGame()][0]);
		setPlayerHeading(client, getGameConfig().skinChangePosition[getGame()][1]);
		setPlayerInterior(client, getGameConfig().skinChangePosition[getGame()][2]);
		setPlayerDimension(client, getPlayerId(client)+500);
	}

	sendNetworkEventToPlayer("vrr.skinSelect", client, true);
}

// ===========================================================================

function updatePlayerCash(client) {
	sendNetworkEventToPlayer("vrr.money", client, getPlayerCurrentSubAccount(client).cash);
}

// ===========================================================================

function sendAllPoliceStationBlips(client) {
	if(getGameConfig().blipSprites[getGame()].policeStation != -1) {
		let tempBlips = [];
		for(let i in getServerData().policeStations[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].policeStation,
				getServerData().policeStations[getGame()][i].position.x,
				getServerData().policeStations[getGame()][i].position.y,
				getServerData().policeStations[getGame()][i].position.z,
				3,
				getColourByName("policeBlue"),
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllFireStationBlips(client) {
	if(getGameConfig().blipSprites[getGame()].fireStation != -1) {
		let tempBlips = [];
		for(let i in getServerData().fireStations[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].fireStation,
				getServerData().fireStations[getGame()][i].position.x,
				getServerData().fireStations[getGame()][i].position.y,
				getServerData().fireStations[getGame()][i].position.z,
				3,
				getColourByName("firefighterRed"),
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllHospitalBlips(client) {
	if(getGameConfig().blipSprites[getGame()].hospital != -1) {
		let tempBlips = [];
		for(let i in getServerData().hospitals[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].hospital,
				getServerData().hospitals[getGame()][i].position.x,
				getServerData().hospitals[getGame()][i].position.y,
				getServerData().hospitals[getGame()][i].position.z,
				3,
				getColourByName("medicPink"),
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllAmmunationBlips(client) {
	if(getGameConfig().blipSprites[getGame()].ammunation != -1) {
		let tempBlips = [];
		for(let i in getServerData().ammunations[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].ammunation,
				getServerData().ammunations[getGame()][i].position.x,
				getServerData().ammunations[getGame()][i].position.y,
				getServerData().ammunations[getGame()][i].position.z,
				3,
				0
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllPayAndSprayBlips(client) {
	if(getGameConfig().blipSprites[getGame()].payAndSpray != -1) {
		let tempBlips = [];
		for(let i in getServerData().payAndSprays[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].payAndSpray,
				getServerData().payAndSprays[getGame()][i].position.x,
				getServerData().payAndSprays[getGame()][i].position.y,
				getServerData().payAndSprays[getGame()][i].position.z,
				3,
				0
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendAllFuelStationBlips(client) {
	if(getGameConfig().blipSprites[getGame()].fuelStation != -1) {
		let tempBlips = [];
		for(let i in getServerData().fuelStations[getGame()]) {
			tempBlips.push([
				getGameConfig().blipSprites[getGame()].fuelStation,
				getServerData().fuelStations[getGame()][i].position.x,
				getServerData().fuelStations[getGame()][i].position.y,
				getServerData().fuelStations[getGame()][i].position.z,
				3,
				getColourByName("burntOrange"),
			]);
		}
		sendNetworkEventToPlayer("vrr.blips", client, tempBlips);
	}
}

// ===========================================================================

function sendPlayerSetHealth(client, health) {
	sendNetworkEventToPlayer("vrr.health", client, toInteger(health));
}

// ===========================================================================

function sendPlayerSetArmour(client, armour) {
	sendNetworkEventToPlayer("vrr.armour", client, armour);
}

// ===========================================================================

function playerFinishedSkinSelection(client, allowedSkinIndex) {
	sendNetworkEventToPlayer("vrr.skinSelect", client, false);
	if(allowedSkinIndex == -1) {
		messagePlayerAlert(client, "You canceled the skin change.");
		restorePlayerCamera(client);

		if(getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == VRR_RETURNTO_TYPE_SKINSELECT) {
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
		if(isPlayerWorking(client)) {
			messagePlayerAlert(client, "Your new skin has been saved but won't be shown until you stop working.");
			setPlayerSkin(client, getJobData(getPlayerCurrentSubAccount(client).job).uniforms[getPlayerData(client).jobUniform].skinId);
		} else {
			setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);
		}

		if(getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == VRR_RETURNTO_TYPE_SKINSELECT) {
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
	sendNetworkEventToPlayer("vrr.chatScrollLines", client, amount);
}

// ===========================================================================

function sendPlayerChatAutoHideDelay(client, delay) {
	sendNetworkEventToPlayer("vrr.chatAutoHideDelay", client, delay);
}

// ===========================================================================

function playRadioStreamForPlayer(client, streamURL, loop = true, volume = 0, element = false) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Forcing ${getPlayerDisplayForConsole(client)} to stream ${streamURL}`);
	sendNetworkEventToPlayer("vrr.radioStream", client, streamURL, loop, volume, element);
}

// ===========================================================================

function playAudioFileForPlayer(client, audioName, loop = true, volume = 0, element = false) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Forcing ${getPlayerDisplayForConsole(client)} to play audio ${audioName}`);
	sendNetworkEventToPlayer("vrr.audioFileStream", client, audioName, loop, volume);
}

// ===========================================================================

function stopRadioStreamForPlayer(client) {
	logToConsole(LOG_DEBUG, `[VRR.Client] Forcing ${getPlayerDisplayForConsole(client)} to stop their radio stream`);
	sendNetworkEventToPlayer("vrr.stopRadioStream", client);
}

// ===========================================================================

function setPlayerStreamingRadioVolume(client, volumeLevel, elementId = false) {
	getPlayerData(client).accountData.streamingRadioVolume = volumeLevel;
	getPlayerData(client).streamingRadioElement = elementId;
	sendNetworkEventToPlayer("vrr.radioVolume", client, volumeLevel, elementId);
}

// ===========================================================================

function setVehicleLightsState(vehicle, state) {
	setEntityData(vehicle, "vrr.lights", getVehicleData(vehicle).lights);
	sendNetworkEventToPlayer("vrr.veh.lights", null, vehicle.id, state);
}

// ===========================================================================

function sendPlayerEnterPropertyKey(client, key) {
	sendNetworkEventToPlayer("vrr.enterPropertyKey", client, key);
}

// ===========================================================================

function makePedPlayAnimation(ped, animationSlot, positionOffset) {
	setEntityData(ped, "vrr.anim", animationSlot, true);
	sendNetworkEventToPlayer("vrr.anim", null, getPedForNetworkEvent(ped), animationSlot, positionOffset);
}

// ===========================================================================

function makePedStopAnimation(ped) {
	removeEntityData(ped, "vrr.anim");
	sendNetworkEventToPlayer("vrr.stopAnim", null, getPedForNetworkEvent(ped));
}

// ===========================================================================

function forcePedAnimation(ped, animationSlot, positionOffset = 0) {
	addEntityData(ped, "vrr.anim", animationSlot, true);
	sendNetworkEventToPlayer("vrr.forceAnim", null, getPedForNetworkEvent(ped), animationSlot, positionOffset);
}

// ===========================================================================

function hideAllPlayerGUI(client) {
	sendNetworkEventToPlayer("vrr.hideAllGUI", client);
}

// ===========================================================================

function requestClientInfo(client) {
	sendNetworkEventToPlayer("vrr.clientInfo", client);
}

// ===========================================================================

function updateInteriorLightsForPlayer(client, state) {
	sendNetworkEventToPlayer("vrr.interiorLights", client, state);
}

// ===========================================================================

function forcePlayerToSyncElementProperties(client, element) {
	sendNetworkEventToPlayer("vrr.syncElement", client, element.id);
}

// ===========================================================================

function sendPlayerPedPartsAndProps(client) {
	let bodyParts = getPlayerCurrentSubAccount(client).bodyParts;
	let bodyProps = getPlayerCurrentSubAccount(client).bodyProps;

	sendNetworkEventToPlayer("vrr.ped", client, [bodyParts.hair, bodyParts.head, bodyParts.upper, bodyParts.lower], [bodyProps.hair, bodyProps.eyes, bodyProps.head, bodyProps.leftHand, bodyProps.rightHand, bodyProps.leftWrist, bodyProps.rightWrist, bodyParts.hip, bodyProps.leftFoot, bodyProps.rightFoot]);
}

// ===========================================================================

function onPlayerNearPickup(client, pickupId) {
	getPlayerData(client).currentPickup = getElementFromId(pickupId);
}

// ===========================================================================

function updateAllInteriorVehiclesForPlayer(client, interior, dimension) {
	for(let i in getServerData().vehicles) {
		if(getServerData().vehicles[i].vehicle != false) {
			if(getServerData().vehicles[i].interior == interior && getServerData().vehicles[i].dimension == dimension) {
				forcePlayerToSyncElementProperties(client, getServerData().vehicles[i].vehicle);
			}
		}
	}
}

// ===========================================================================

function setPlayerBuyingVehicleState(client, state, vehicleId, position) {
	if(getGlobalConfig().useServerSideVehiclePurchaseCheck == false) {
		sendNetworkEventToPlayer("vrr.vehBuyState", client, state, vehicleId, position);
	}
}

// ==========================================================================

function receiveVehiclePurchaseStateUpdateFromClient(client, state) {
	if(getGlobalConfig().useServerSideVehiclePurchaseCheck == false) {
		checkVehiclePurchasing(client);
	}
}

// ===========================================================================

function sendPlayerLogLevel(client, tempLogLevel = logLevel) {
	sendNetworkEventToPlayer("vrr.logLevel", client, tempLogLevel);
}

// ==========================================================================

function setPlayerInfiniteRun(client, state) {
	sendNetworkEventToPlayer("vrr.infiniteRun", client, state);
}

// ==========================================================================

function sendBusinessToPlayer(client, businessId, name, entrancePosition, blipModel, pickupModel, hasInterior, hasItems) {
	sendNetworkEventToPlayer("vrr.business", client, businessId, name, entrancePosition, blipModel, pickupModel, hasInterior, hasItems);
}

// ==========================================================================

function sendHouseToPlayer(client, houseId, description, entrancePosition, blipModel, pickupModel, hasInterior) {
	sendNetworkEventToPlayer("vrr.house", client, houseId, description, entrancePosition, blipModel, pickupModel, hasInterior);
}

// ==========================================================================

function sendAllBusinessesToPlayer(client) {
	let businesses = getServerData().businesses;
	for(let i in businesses) {
		sendBusinessToPlayer(client, businesses[i].index, businesses[i].name, businesses[i].entrancePosition, businesses[i].entranceBlipModel, businesses[i].entrancePickupModel, businesses[i].hasInterior, false);
	}
}

// ==========================================================================

function sendAllHousesToPlayer(client) {
	let houses = getServerData().houses;
	for(let i in houses) {
		sendHouseToPlayer(client, houses[i].index, houses[i].entrancePosition, houses[i].entranceBlipModel, houses[i].entrancePickupModel, houses[i].hasInterior);
	}
}

// ==========================================================================

function sendAllJobsToPlayer(client) {
	//let jobs = getServerData().jobs;
	//for(let i in jobs) {
	//    for(let j in jobs[i].locations) {
	//        sendJobToPlayer(client, jobs[i].index, jobs[i].name, jobs[i].locations[j].position, jobs[i].blipModel);
	//    }
	//}
}

// ==========================================================================

function makePlayerHoldObjectModel(client, modelIndex) {
	sendNetworkEventToPlayer("vrr.holdObject", client, getPlayerData(client).ped, modelIndex);
}

// ==========================================================================

function receivePlayerPedNetworkId(client, pedId) {
	getPlayerData(client).ped = pedId;
}

// ==========================================================================

function requestPlayerPedNetworkId(client) {
	sendNetworkEventToPlayer("vrr.playerPedId", client);
}

// ==========================================================================

function setPlayerInCutsceneInterior(client, cutsceneName) {
	getPlayerData(client).interiorCutscene = cutsceneName;
	sendNetworkEventToPlayer("vrr.cutsceneInterior", client, cutsceneName);
}

// ==========================================================================

function makePlayerPedSpeak(client, pedSpeechName) {
	sendNetworkEventToPlayer("vrr.pedSpeak", client, pedSpeechName);
}

// ==========================================================================

function setPlayerAsCopState(client, state) {
	sendNetworkEventToPlayer("vrr.playerCop", client, state);
}

// ==========================================================================

function tellPlayerToSpawn(client, skinId, position) {
	sendNetworkEventToPlayer("vrr.spawn", client, skinId, position);
}

// ==========================================================================

function sendNameTagDistanceToClient(client, distance) {
	sendNetworkEventToPlayer("vrr.nameTagDistance", client, distance);
}

// ==========================================================================

function sendGPSBlipToPlayer(client, position, colour) {
	sendNetworkEventToPlayer("vrr.showGPSBlip", client, position, colour);
}

// ==========================================================================

function playerSelectedNewLocale(client, localeId) {
	getPlayerData(client).locale = localeId;
	sendPlayerLocaleId(client, localeId);
}

// ==========================================================================

function sendPlayerLocaleId(client, localeId) {
	sendNetworkEventToPlayer("vrr.locale", client, localeId);
}

// ==========================================================================

function showLocaleChooserForPlayer(client) {
	sendNetworkEventToPlayer("vrr.localeChooser", client);
}

// ==========================================================================