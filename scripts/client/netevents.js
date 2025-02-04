// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: netevents.js
// DESC: Provides server communication and cross-endpoint network events
// TYPE: Client (JavaScript)
// ===========================================================================

function initNetworkEventsScript() {
	logToConsole(LOG_DEBUG, "[V.RP.NetEvents]: Initializing server script ...");
	logToConsole(LOG_DEBUG, "[V.RP.NetEvents]: Server script initialized!");
}

// ===========================================================================

function addAllNetworkHandlers() {
	logToConsole(LOG_DEBUG, "[V.RP.Server]: Adding network handlers ...");

	// Chat Box
	addNetworkEventHandler("m", receiveChatBoxMessageFromServer); // Not prefixed with VRR to make it as small as possible
	addNetworkEventHandler("v.rp.chatScrollLines", setChatScrollLines);
	addNetworkEventHandler("v.rp.chatAutoHideDelay", setChatAutoHideDelay);
	addNetworkEventHandler("v.rp.chatTimeStamps", setChatTimeStampsState);
	addNetworkEventHandler("v.rp.chatEmoji", setChatEmojiState);

	// Messaging (like textdraws and stuff)
	addNetworkEventHandler("v.rp.smallGameMessage", showSmallGameMessage);

	// Job
	addNetworkEventHandler("v.rp.job", receiveJobFromServer);
	addNetworkEventHandler("v.rp.removeJobs", removeJobsFromClient);
	addNetworkEventHandler("v.rp.working", setLocalPlayerWorkingState);
	addNetworkEventHandler("v.rp.jobType", setLocalPlayerJobType);
	addNetworkEventHandler("v.rp.showJobRouteLocation", showJobRouteLocation);
	addNetworkEventHandler("v.rp.hideJobRouteLocation", hideJobRouteLocation);

	// Local player states and values
	addNetworkEventHandler("v.rp.restoreCamera", restoreLocalCamera);
	addNetworkEventHandler("v.rp.cameraLookAt", setLocalCameraLookAt);
	addNetworkEventHandler("v.rp.freeze", setLocalPlayerFrozenState);
	addNetworkEventHandler("v.rp.control", setLocalPlayerControlState);
	addNetworkEventHandler("v.rp.fadeCamera", fadeLocalCamera);
	addNetworkEventHandler("v.rp.removeFromVehicle", removePedFromVehicle);
	addNetworkEventHandler("v.rp.clearWeapons", clearLocalPlayerWeapons);
	addNetworkEventHandler("v.rp.giveWeapon", giveLocalPlayerWeapon);
	addNetworkEventHandler("v.rp.position", setLocalPlayerPosition);
	addNetworkEventHandler("v.rp.heading", setLocalPlayerHeading);
	addNetworkEventHandler("v.rp.interior", setLocalPlayerInterior);
	addNetworkEventHandler("v.rp.spawned", onServerSpawnedLocalPlayer);
	addNetworkEventHandler("v.rp.money", setLocalPlayerMoney);
	addNetworkEventHandler("v.rp.armour", setLocalPlayerArmour);
	addNetworkEventHandler("v.rp.localPlayerSkin", setLocalPlayerSkin);
	addNetworkEventHandler("v.rp.pedSpeak", makePedSpeak);
	addNetworkEventHandler("v.rp.infiniteRun", setLocalPlayerInfiniteRun);
	addNetworkEventHandler("v.rp.playerCop", setLocalPlayerAsCopState);
	addNetworkEventHandler("v.rp.health", setLocalPlayerHealth);
	addNetworkEventHandler("v.rp.wantedLevel", setLocalPlayerWantedLevel);
	addNetworkEventHandler("v.rp.playerPedId", sendLocalPlayerNetworkIdToServer);
	addNetworkEventHandler("v.rp.ped", setLocalPlayerPedPartsAndProps);
	//addNetworkEventHandler("v.rp.spawn", serverRequestedLocalPlayerSpawn);
	addNetworkEventHandler("v.rp.clearPedState", clearLocalPedState);
	addNetworkEventHandler("v.rp.drunkEffect", setLocalPlayerDrunkEffect);
	addNetworkEventHandler("v.rp.deleteLocalPlayerPed", deleteLocalPlayerPed);

	// Vehicle
	addNetworkEventHandler("v.rp.vehicle", receiveVehicleFromServer);
	addNetworkEventHandler("v.rp.removeVehicles", removeVehiclesFromClient);
	addNetworkEventHandler("v.rp.veh.lights", setVehicleLights);
	addNetworkEventHandler("v.rp.veh.engine", setVehicleEngine);
	addNetworkEventHandler("v.rp.veh.locked", setVehicleLock);
	addNetworkEventHandler("v.rp.veh.siren", setVehicleSiren);
	addNetworkEventHandler("v.rp.veh.hazardLights", setVehicleHazardLights);
	addNetworkEventHandler("v.rp.veh.alarm", setVehicleAlarm);
	addNetworkEventHandler("v.rp.veh.upgrades", setVehicleUpgrades);
	addNetworkEventHandler("v.rp.veh.livery", setVehicleLivery);
	addNetworkEventHandler("v.rp.veh.interiorLight", setVehicleInteriorLight);
	addNetworkEventHandler("v.rp.veh.taxiLight", setVehicleTaxiLight);
	addNetworkEventHandler("v.rp.veh.colour", setVehicleColours);
	addNetworkEventHandler("v.rp.veh.repair", repairVehicle);
	addNetworkEventHandler("v.rp.cruiseControl", toggleLocalVehicleCruiseControl);
	addNetworkEventHandler("v.rp.passenger", enterVehicleAsPassenger);
	addNetworkEventHandler("v.rp.vehBuyState", setVehiclePurchaseState);

	// Radio
	addNetworkEventHandler("v.rp.radioStream", playStreamingRadio);
	addNetworkEventHandler("v.rp.audioFileStream", playAudioFile);
	addNetworkEventHandler("v.rp.stopRadioStream", stopStreamingRadio);
	addNetworkEventHandler("v.rp.radioVolume", setStreamingRadioVolume);

	// Key Bindings
	addNetworkEventHandler("v.rp.delKeyBind", unBindAccountKey);
	addNetworkEventHandler("v.rp.addKeyBind", bindAccountKey);
	addNetworkEventHandler("v.rp.clearKeyBinds", clearKeyBinds);

	// Weapon Damage
	addNetworkEventHandler("v.rp.weaponDamageEnabled", setPlayerWeaponDamageEnabled);
	addNetworkEventHandler("v.rp.weaponDamageEvent", setPlayerWeaponDamageEvent);

	// GUI
	addNetworkEventHandler("v.rp.showRegistration", showRegistrationGUI);
	addNetworkEventHandler("v.rp.showNewCharacter", showNewCharacterGUI);
	addNetworkEventHandler("v.rp.showLogin", showLoginGUI);
	addNetworkEventHandler("v.rp.2fa", showTwoFactorAuthGUI);
	addNetworkEventHandler("v.rp.showResetPasswordCodeInput", resetPasswordCodeInputGUI);
	addNetworkEventHandler("v.rp.showResetPasswordEmailInput", resetPasswordEmailInputGUI);
	addNetworkEventHandler("v.rp.showChangePassword", showChangePasswordGUI);
	addNetworkEventHandler("v.rp.showCharacterSelect", showCharacterSelectGUI);
	addNetworkEventHandler("v.rp.switchCharacterSelect", switchCharacterSelectGUI);
	addNetworkEventHandler("v.rp.showError", showErrorGUI);
	addNetworkEventHandler("v.rp.showInfo", showInfoGUI);
	addNetworkEventHandler("v.rp.showPrompt", showYesNoPromptGUI);
	addNetworkEventHandler("v.rp.loginSuccess", loginSuccess);
	addNetworkEventHandler("v.rp.characterSelectSuccess", characterSelectSuccess);
	addNetworkEventHandler("v.rp.loginFailed", loginFailed);
	addNetworkEventHandler("v.rp.registrationSuccess", registrationSuccess);
	addNetworkEventHandler("v.rp.registrationFailed", registrationFailed);
	addNetworkEventHandler("v.rp.newCharacterFailed", newCharacterFailed);
	addNetworkEventHandler("v.rp.changePassword", showChangePasswordGUI);
	addNetworkEventHandler("v.rp.showLocaleChooser", showLocaleChooserGUI);
	addNetworkEventHandler("v.rp.guiColour", setGUIColours);
	addNetworkEventHandler("v.rp.mapChangingSoon", setMapChangeWarningState);

	// 2D Rendering
	addNetworkEventHandler("v.rp.set2DRendering", set2DRendering);
	addNetworkEventHandler("v.rp.logo", setServerLogoRenderState);
	addNetworkEventHandler("v.rp.showItemActionDelay", showItemActionDelay);

	// Business
	addNetworkEventHandler("v.rp.business", receiveBusinessFromServer);
	addNetworkEventHandler("v.rp.removeBusinesses", removeBusinessesFromClient);

	// House
	addNetworkEventHandler("v.rp.house", receiveHouseFromServer);
	addNetworkEventHandler("v.rp.removeHouses", removeHousesFromClient);

	// GPS
	addNetworkEventHandler("v.rp.showGPSBlip", showGPSLocation);

	// Locale
	addNetworkEventHandler("v.rp.locale", setLocale);
	addNetworkEventHandler("v.rp.localeChooser", toggleLocaleChooserGUI);

	// Animation
	addNetworkEventHandler("v.rp.anim", makePedPlayAnimation);
	addNetworkEventHandler("v.rp.stopAnim", makePedStopAnimation);
	addNetworkEventHandler("v.rp.forceAnim", forcePedAnimation);

	// Nametags
	addNetworkEventHandler("v.rp.nametag", updatePlayerNameTag);
	addNetworkEventHandler("v.rp.nametagDistance", setNameTagDistance);

	// PayPhones
	addNetworkEventHandler("v.rp.payPhone", receivePayPhoneFromServer);
	addNetworkEventHandler("v.rp.payPhoneState", receivePayPhoneStateFromServer);
	addNetworkEventHandler("v.rp.removePayPhones", removePayPhonesFromClient);
	addNetworkEventHandler("v.rp.payPhoneDial", payPhoneDial);
	addNetworkEventHandler("v.rp.payPhoneHangup", payPhoneHangup);
	addNetworkEventHandler("v.rp.payPhonePickup", payPhonePickup);

	// Misc
	addNetworkEventHandler("v.rp.mouseCursor", toggleMouseCursor);
	addNetworkEventHandler("v.rp.mouseCamera", toggleMouseCamera);
	addNetworkEventHandler("v.rp.mouseCameraForce", setMouseCameraState);
	addNetworkEventHandler("v.rp.clearPeds", clearLocalPlayerOwnedPeds);
	addNetworkEventHandler("v.rp.clearPickups", clearLocalPlayerOwnedPickups);
	addNetworkEventHandler("v.rp.ambience", setCityAmbienceState);
	addNetworkEventHandler("v.rp.runCode", runClientCode);
	addNetworkEventHandler("v.rp.minuteDuration", setMinuteDuration);
	addNetworkEventHandler("v.rp.snow", setSnowState);
	addNetworkEventHandler("v.rp.enterPropertyKey", setEnterPropertyKey);
	addNetworkEventHandler("v.rp.scoreBoardKey", setScoreBoardKey);
	addNetworkEventHandler("v.rp.skinSelect", toggleSkinSelect);
	addNetworkEventHandler("v.rp.hotbar", updatePlayerHotBar);
	addNetworkEventHandler("v.rp.logLevel", setLogLevel);
	addNetworkEventHandler("v.rp.hideAllGUI", hideAllGUI);
	addNetworkEventHandler("v.rp.ping", updatePlayerPing);
	addNetworkEventHandler("v.rp.clientInfo", serverRequestedClientInfo);
	addNetworkEventHandler("v.rp.interiorLights", updateInteriorLightsState);
	addNetworkEventHandler("v.rp.scene", changeScene);
	addNetworkEventHandler("v.rp.syncElement", forceSyncElementProperties);
	addNetworkEventHandler("v.rp.elementPosition", setElementPosition);
	addNetworkEventHandler("v.rp.elementCollisions", setElementCollisionsEnabled);
	addNetworkEventHandler("v.rp.holdObject", makePedHoldObject);
	addNetworkEventHandler("v.rp.profanityFilter", setProfanityFilterState);
	addNetworkEventHandler("v.rp.currencyString", receiveCurrencyStringFromServer);
	addNetworkEventHandler("v.rp.token", serverRequestedToken);
	addNetworkEventHandler("v.rp.incomingDamageMultiplier", setIncomingDamageMultiplier);
	addNetworkEventHandler("v.rp.warpIntoVehicle", warpPedIntoVehicle);
	addNetworkEventHandler("v.rp.godMode", setGodModeState);
	addNetworkEventHandler("v.rp.countDown", startCountDown);
}

// ===========================================================================

function sendResourceReadySignalToServer() {
	sendNetworkEventToServer("v.rp.clientReady");
}

// ===========================================================================

function sendResourceStartedSignalToServer() {
	sendNetworkEventToServer("v.rp.clientStarted");
}

// ===========================================================================

function sendResourceStoppedSignalToServer() {
	if (isConnected) {
		sendNetworkEventToServer("v.rp.clientStopped");
	}
}

// ===========================================================================

function set2DRendering(hudState, labelState, smallGameMessageState, scoreboardState, hotBarState, itemActionDelayState) {
	logToConsole(LOG_DEBUG, `[V.RP.Main] Updating render states (HUD: ${hudState}, Labels: ${labelState}, Bottom Text: ${smallGameMessageState}, Scoreboard: ${scoreboardState}, HotBar: ${hotBarState}, Item Action Delay: ${itemActionDelayState})`);
	renderHUD = hudState;

	if (getGame() == V_GAME_GTA_IV) {
		natives.displayCash(hudState);
		natives.displayAmmo(hudState);
		natives.displayHud(hudState);
		natives.displayRadar(hudState);
		natives.displayAreaName(hudState);
	} else {
		if (typeof setHUDEnabled != "undefined") {
			setHUDEnabled(hudState);
		}
	}

	renderLabels = labelState;
	renderSmallGameMessage = smallGameMessageState;
	renderScoreBoard = scoreboardState;
	renderHotBar = hotBarState;
	renderItemActionDelay = itemActionDelayState;
}

// ===========================================================================

function onServerSpawnedLocalPlayer(state) {
	logToConsole(LOG_DEBUG, `[V.RP.Main] Setting spawned state to ${state}`);
	isSpawned = state;
	calledDeathEvent = false;

	if (state) {
		setTimeout(function () {
			setUpInitialGame();
			syncPedProperties(localPlayer);

			getElementsByType(ELEMENT_PED).forEach(ped => {
				syncPedProperties(ped);
			});

			getElementsByType(ELEMENT_VEHICLE).forEach(vehicle => {
				syncVehicleProperties(vehicle);
			});
		}, 250);
	}
}

// ===========================================================================

function tellServerPlayerUsedKeyBind(key) {
	sendNetworkEventToServer("v.rp.useKeyBind", key);
}

// ===========================================================================

function tellServerPlayerArrivedAtJobRouteLocation() {
	sendNetworkEventToServer("v.rp.arrivedAtJobRouteLocation");
}

// ===========================================================================

function tellServerItemActionDelayComplete() {
	sendNetworkEventToServer("v.rp.itemActionDelayComplete");
}

// ===========================================================================

function sendServerClientInfo() {
	let clientVersion = "0.0.0.0";
	if (typeof CLIENT_VERSION_MAJOR != "undefined") {
		clientVersion = `${CLIENT_VERSION_MAJOR}.${CLIENT_VERSION_MINOR}.${CLIENT_VERSION_PATCH}.${CLIENT_VERSION_BUILD}`;
	}
	sendNetworkEventToServer("v.rp.clientInfo", clientVersion, game.width, game.height);
}

// ===========================================================================

function sendServerNewAFKStatus(state) {
	sendNetworkEventToServer("v.rp.afk", state);
}

// ===========================================================================

function anchorBoat(vehicleId) {

}

// ===========================================================================

function setEnterPropertyKey(key) {
	if (key == -1) {
		enterPropertyKey = null;
	} else {
		enterPropertyKey = toInteger(key);
	}
}

// ===========================================================================

function serverRequestedClientInfo() {
	sendServerClientInfo();
}

// ===========================================================================

function updateInteriorLightsState(state) {
	interiorLightsEnabled = state;
}

// ===========================================================================

function forceSyncElementProperties(elementId) {
	if (getElementFromId(elementId) == null) {
		return false;
	}

	syncElementProperties(getElementFromId(elementId));
}

// ===========================================================================

function setLocalPlayerArmour(armour) {
	if (typeof localPlayer.armour != "undefined") {
		localPlayer.armour = armour;
	}
}

// ===========================================================================

function setLocalPlayerWantedLevel(wantedLevel) {
	forceWantedLevel = toInteger(wantedLevel);
}

// ===========================================================================

function setLogLevel(level) {
	logLevel = level;
}

// ===========================================================================

function setLocalPlayerInfiniteRun(state) {
	if (localPlayer != null) {
		if (getGame() == V_GAME_GTA_III || getGame() == V_GAME_GTA_VC) {
			game.SET_PLAYER_NEVER_GETS_TIRED(game.GET_PLAYER_ID(), boolToInt(state));
		}
	}
}

// ===========================================================================

function setLocalPlayerSkin(skinId) {
	logToConsole(LOG_INFO, `[V.RP.Server] Setting locale player skin to ${skinId}`);
	if (getGame() == V_GAME_GTA_IV) {
		if (natives.isModelInCdimage(skinId)) {
			natives.requestModel(skinId);
			natives.loadAllObjectsNow();
			if (natives.hasModelLoaded(skinId)) {
				natives.changePlayerModel(natives.getPlayerId(), skinId);
			}
		}
	} else {
		localPlayer.skin = skinId;
	}
}

// ===========================================================================

function makePedHoldObject(pedId, modelIndex) {
	if (getGame() == V_GAME_GTA_IV) {
		natives.givePedAmbientObject(natives.getPedFromNetworkId(pedId), gameData.objects[getGame()][modelIndex][1])
	}
}

// ===========================================================================

function sendLocalPlayerNetworkIdToServer() {
	if (getGame() == V_GAME_GTA_IV || getGame() == V_GAME_GTA_IV_EFLC) {
		sendNetworkEventToServer("v.rp.playerPedId", natives.getNetworkIdFromPed(localPlayer));
	}
}

// ===========================================================================

function changeScene(sceneName) {
	if (getGame() == V_GAME_GTA_IV) {
		if (sceneName == "") {
			natives.clearCutscene();
		} else {
			if (natives.isInteriorScene()) {
				natives.clearCutscene();
			}
			natives.initCutscene(sceneName);
		}
	} else if (getGame() == V_GAME_MAFIA_ONE) {
		renderHUD = false;
		renderHotBar = false;
		renderInteriorLights = false;
		renderItemActionDelay = false;
		renderLabels = false;
		renderLogo = false;
		renderScoreBoard = false;
		renderSmallGameMessage = false;
		setTimeout(function () {
			game.changeMap(sceneName, false);
		}, 250);
	}
}

// ===========================================================================

function makePedSpeak(pedId, speechName) {
	if (getElementFromId(pedId) == null) {
		return false;
	}

	if (getGame() == V_GAME_GTA_IV) {
		// if player is in vehicle, allow megaphone (if last arg is "1", it will cancel megaphone echo)
		// Only speeches with _MEGAPHONE will have the bullhorn effect
		// Afaik it only works on police voices anyway
		if (localPlayer.vehicle != null) {
			natives.sayAmbientSpeech(getElementFromId(pedId), speechName, true, false, 0);
		} else {
			natives.sayAmbientSpeech(getElementFromId(pedId), speechName, true, false, 1);
		}
	} else if (getGame() == V_GAME_GTA_III || getGame() == V_GAME_GTA_VC) {
		// Don't have a way to get the ped ref ID and can't use ped in arg
		//game.SET_CHAR_SAY(game.GET_PLAYER_ID(), int);
	}
}

// ===========================================================================

function setLocalPlayerAsCopState(state) {
	if (getGame() == V_GAME_GTA_IV) {
		natives.setPlayerAsCop(natives.getPlayerId(), state);
		natives.setPoliceIgnorePlayer(natives.getPlayerId(), state);
	}
}

// ===========================================================================

function serverRequestedLocalPlayerSpawn(skinId, position) {
	if (getGame() == V_GAME_GTA_IV) {
		natives.createPlayer(skinId, position);
		//if(isGameFeatureSupported("customCamera")) {
		//	game.restoreCamera(true);
		//}
	}
}

// ===========================================================================

function sendLocaleSelectToServer(localeId) {
	sendNetworkEventToServer("v.rp.localeSelect", localeId);
}

// ===========================================================================

function clearLocalPlayerOwnedPickups() {
	let pickups = getPickups().filter(pickup => pickup.isLocal == true);
	for (let i in pickups) {
		deleteGameElement(pickups[i]);
	}
}

// ===========================================================================

function receiveCurrencyStringFromServer(newCurrencyString) {
	currencyString = newCurrencyString;
}

// ===========================================================================

function setMapChangeWarningState(state, changeToNight) {
	mapChangeWarning = state;
	mapChangeToNight = changeToNight;
}

// ===========================================================================

function updatePlayerPing(playerName, ping) {
	playerPing[playerName] = ping;
}

// ===========================================================================

function receiveClientVariablesFromServer(clientVariablesString) {
	serverData.cvars = JSON.parse(clientVariablesString);
}

// ===========================================================================

function serverRequestedToken() {
	let token = loadToken();
	sendNetworkEventToServer("v.rp.token", token);
}

// ===========================================================================

function setIncomingDamageMultiplier(tempMultiplier) {
	weaponDamageMultiplier = tempMultiplier;
}

// ===========================================================================

function warpPedIntoVehicle(pedId, vehicleId, seatId) {
	if (getElementFromId(pedId) == null) {
		logToConsole(LOG_DEBUG | LOG_ERROR, `[V.RP.NetEvents] Could not warp ped ${pedId} into vehicle ${vehicleId}. Ped does not exist`);
		return false;
	}

	if (getElementFromId(vehicleId) == null) {
		logToConsole(LOG_DEBUG | LOG_ERROR, `[V.RP.NetEvents] Could not warp ped ${pedId} into vehicle ${vehicleId}. Vehicle does not exist`);
		return false;
	}

	if (!getElementFromId(pedId).isSyncer) {
		logToConsole(LOG_DEBUG | LOG_ERROR, `[V.RP.NetEvents] Could not warp ped ${pedId} into vehicle ${vehicleId}. Is not syncer of ped`);
		return false;
	}

	getElementFromId(pedId).warpIntoVehicle(getElementFromId(vehicleId), seatId);
}

// ===========================================================================

function removePedFromVehicle(pedId) {
	if (getElementFromId(pedId) == null) {
		logToConsole(LOG_DEBUG | LOG_ERROR, `[V.RP.NetEvents] Could not remove ped ${pedId} from their vehicle. Ped does not exist`);
		return false;
	}

	getElementFromId(pedId).removeFromVehicle();
}

// ===========================================================================

function setGodModeState(state) {
	godMode = state;

	return true;
}

// ===========================================================================
