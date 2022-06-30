// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: netevents.js
// DESC: Provides server communication and cross-endpoint network events
// TYPE: Client (JavaScript)
// ===========================================================================

function initServerScript() {
	logToConsole(LOG_DEBUG, "[VRR.Server]: Initializing server script ...");
	addAllNetworkHandlers();
	logToConsole(LOG_DEBUG, "[VRR.Server]: Server script initialized!");
}

// ===========================================================================

function addAllNetworkHandlers() {
	logToConsole(LOG_DEBUG, "[VRR.Server]: Adding network handlers ...");

	// Chat Box
	addNetworkEventHandler("m", receiveChatBoxMessageFromServer); // Not prefixed with VRR to make it as small as possible
	addNetworkEventHandler("agrp.chatScrollLines", setChatScrollLines);
	addNetworkEventHandler("agrp.chatAutoHideDelay", setChatAutoHideDelay);
	addNetworkEventHandler("agrp.chatTimeStamps", setChatBoxTimeStampsState);

	// Messaging (like textdraws and stuff)
	addNetworkEventHandler("agrp.smallGameMessage", showSmallGameMessage);

	// Job
	addNetworkEventHandler("agrp.job", receiveJobFromServer);
	addNetworkEventHandler("agrp.working", setLocalPlayerWorkingState);
	addNetworkEventHandler("agrp.jobType", setLocalPlayerJobType);
	addNetworkEventHandler("agrp.showJobRouteLocation", showJobRouteLocation);
	addNetworkEventHandler("agrp.hideJobRouteLocation", hideJobRouteLocation);

	// Local player states and values
	addNetworkEventHandler("agrp.restoreCamera", restoreLocalCamera);
	addNetworkEventHandler("agrp.cameraLookAt", setLocalCameraLookAt);
	addNetworkEventHandler("agrp.freeze", setLocalPlayerFrozenState);
	addNetworkEventHandler("agrp.control", setLocalPlayerControlState);
	addNetworkEventHandler("agrp.fadeCamera", fadeLocalCamera);
	addNetworkEventHandler("agrp.removeFromVehicle", removeLocalPlayerFromVehicle);
	addNetworkEventHandler("agrp.clearWeapons", clearLocalPlayerWeapons);
	addNetworkEventHandler("agrp.giveWeapon", giveLocalPlayerWeapon);
	addNetworkEventHandler("agrp.position", setLocalPlayerPosition);
	addNetworkEventHandler("agrp.heading", setLocalPlayerHeading);
	addNetworkEventHandler("agrp.interior", setLocalPlayerInterior);
	addNetworkEventHandler("agrp.spawned", onServerSpawnedLocalPlayer);
	addNetworkEventHandler("agrp.money", setLocalPlayerCash);
	addNetworkEventHandler("agrp.armour", setLocalPlayerArmour);
	addNetworkEventHandler("agrp.localPlayerSkin", setLocalPlayerSkin);
	addNetworkEventHandler("agrp.pedSpeak", makeLocalPlayerPedSpeak);
	addNetworkEventHandler("agrp.infiniteRun", setLocalPlayerInfiniteRun);
	addNetworkEventHandler("agrp.playerCop", setLocalPlayerAsCopState);
	addNetworkEventHandler("agrp.health", setLocalPlayerHealth);
	addNetworkEventHandler("agrp.wantedLevel", setLocalPlayerWantedLevel);
	addNetworkEventHandler("agrp.playerPedId", sendLocalPlayerNetworkIdToServer);
	addNetworkEventHandler("agrp.ped", setLocalPlayerPedPartsAndProps);
	addNetworkEventHandler("agrp.spawn", serverRequestedLocalPlayerSpawn);
	addNetworkEventHandler("agrp.clearPedState", clearLocalPedState);
	addNetworkEventHandler("agrp.drunkEffect", setLocalPlayerDrunkEffect);
	addNetworkEventHandler("agrp.deleteLocalPlayerPed", deleteLocalPlayerPed);

	// Vehicle
	addNetworkEventHandler("agrp.vehicle", receiveVehicleFromServer);
	addNetworkEventHandler("agrp.veh.lights", setVehicleLights);
	addNetworkEventHandler("agrp.veh.engine", setVehicleEngine);
	addNetworkEventHandler("agrp.veh.repair", repairVehicle);

	// Radio
	addNetworkEventHandler("agrp.radioStream", playStreamingRadio);
	addNetworkEventHandler("agrp.audioFileStream", playAudioFile);
	addNetworkEventHandler("agrp.stopRadioStream", stopStreamingRadio);
	addNetworkEventHandler("agrp.radioVolume", setStreamingRadioVolume);

	// Key Bindings
	addNetworkEventHandler("agrp.delKeyBind", unBindAccountKey);
	addNetworkEventHandler("agrp.addKeyBind", bindAccountKey);
	addNetworkEventHandler("agrp.clearKeyBinds", clearKeyBinds);

	// Weapon Damage
	addNetworkEventHandler("agrp.weaponDamageEnabled", setPlayerWeaponDamageEnabled);
	addNetworkEventHandler("agrp.weaponDamageEvent", setPlayerWeaponDamageEvent);

	// GUI
	addNetworkEventHandler("agrp.showRegistration", showRegistrationGUI);
	addNetworkEventHandler("agrp.showNewCharacter", showNewCharacterGUI);
	addNetworkEventHandler("agrp.showLogin", showLoginGUI);
	addNetworkEventHandler("agrp.2fa", showTwoFactorAuthGUI);
	addNetworkEventHandler("agrp.showResetPasswordCodeInput", resetPasswordCodeInputGUI);
	addNetworkEventHandler("agrp.showResetPasswordEmailInput", resetPasswordEmailInputGUI);
	addNetworkEventHandler("agrp.showChangePassword", showChangePasswordGUI);
	addNetworkEventHandler("agrp.showCharacterSelect", showCharacterSelectGUI);
	addNetworkEventHandler("agrp.switchCharacterSelect", switchCharacterSelectGUI);
	addNetworkEventHandler("agrp.showError", showErrorGUI);
	addNetworkEventHandler("agrp.showInfo", showInfoGUI);
	addNetworkEventHandler("agrp.showPrompt", showYesNoPromptGUI);
	addNetworkEventHandler("agrp.loginSuccess", loginSuccess);
	addNetworkEventHandler("agrp.characterSelectSuccess", characterSelectSuccess);
	addNetworkEventHandler("agrp.loginFailed", loginFailed);
	addNetworkEventHandler("agrp.registrationSuccess", registrationSuccess);
	addNetworkEventHandler("agrp.registrationFailed", registrationFailed);
	addNetworkEventHandler("agrp.newCharacterFailed", newCharacterFailed);
	addNetworkEventHandler("agrp.changePassword", showChangePasswordGUI);
	addNetworkEventHandler("agrp.showLocaleChooser", showLocaleChooserGUI);
	addNetworkEventHandler("agrp.guiColour", setGUIColours);

	// Business
	addNetworkEventHandler("agrp.business", receiveBusinessFromServer);

	// House
	addNetworkEventHandler("agrp.house", receiveHouseFromServer);

	// GPS
	addNetworkEventHandler("agrp.showGPSBlip", showGPSLocation);

	// Locale
	addNetworkEventHandler("agrp.locale", setLocale);
	addNetworkEventHandler("agrp.localeChooser", toggleLocaleChooserGUI);

	// Misc
	addNetworkEventHandler("agrp.mouseCursor", toggleMouseCursor);
	addNetworkEventHandler("agrp.mouseCamera", toggleMouseCamera);
	addNetworkEventHandler("agrp.clearPeds", clearLocalPlayerOwnedPeds);
	addNetworkEventHandler("agrp.clearPickups", clearLocalPlayerOwnedPickups);
	addNetworkEventHandler("agrp.passenger", enterVehicleAsPassenger);
	addNetworkEventHandler("agrp.logo", setServerLogoRenderState);
	addNetworkEventHandler("agrp.ambience", setCityAmbienceState);
	addNetworkEventHandler("agrp.runCode", runClientCode);
	addNetworkEventHandler("agrp.minuteDuration", setMinuteDuration);
	addNetworkEventHandler("agrp.snow", setSnowState);
	addNetworkEventHandler("agrp.enterPropertyKey", setEnterPropertyKey);
	addNetworkEventHandler("agrp.skinSelect", toggleSkinSelect);
	addNetworkEventHandler("agrp.hotbar", updatePlayerHotBar);
	addNetworkEventHandler("agrp.showItemActionDelay", showItemActionDelay);
	addNetworkEventHandler("agrp.set2DRendering", set2DRendering);
	addNetworkEventHandler("agrp.mouseCameraForce", setMouseCameraState);
	addNetworkEventHandler("agrp.logLevel", setLogLevel);
	addNetworkEventHandler("agrp.hideAllGUI", hideAllGUI);
	addNetworkEventHandler("agrp.nametag", updatePlayerNameTag);
	addNetworkEventHandler("agrp.nametagDistance", setNameTagDistance);
	addNetworkEventHandler("agrp.ping", updatePlayerPing);
	addNetworkEventHandler("agrp.anim", makePedPlayAnimation);
	addNetworkEventHandler("agrp.stopAnim", makePedStopAnimation);
	addNetworkEventHandler("agrp.forceAnim", forcePedAnimation);
	addNetworkEventHandler("agrp.clientInfo", serverRequestedClientInfo);
	addNetworkEventHandler("agrp.interiorLights", updateInteriorLightsState);
	addNetworkEventHandler("agrp.cutsceneInterior", setCutsceneInterior);
	addNetworkEventHandler("agrp.syncElement", forceSyncElementProperties);
	addNetworkEventHandler("agrp.elementPosition", setElementPosition);
	addNetworkEventHandler("agrp.elementCollisions", setElementCollisionsEnabled);
	addNetworkEventHandler("agrp.vehBuyState", setVehiclePurchaseState);
	addNetworkEventHandler("agrp.holdObject", makePedHoldObject);
}

// ===========================================================================

function sendResourceReadySignalToServer() {
	sendNetworkEventToServer("agrp.clientReady");
}

// ===========================================================================

function sendResourceStartedSignalToServer() {
	sendNetworkEventToServer("agrp.clientStarted");
}

// ===========================================================================

function sendResourceStoppedSignalToServer() {
	if (isConnected) {
		sendNetworkEventToServer("agrp.clientStopped");
	}
}

// ===========================================================================

function set2DRendering(hudState, labelState, smallGameMessageState, scoreboardState, hotBarState, itemActionDelayState) {
	logToConsole(LOG_DEBUG, `[VRR.Main] Updating render states (HUD: ${hudState}, Labels: ${labelState}, Bottom Text: ${smallGameMessageState}, Scoreboard: ${scoreboardState}, HotBar: ${hotBarState}, Item Action Delay: ${itemActionDelayState})`);
	renderHUD = hudState;

	if (getGame() == VRR_GAME_GTA_IV) {
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
	logToConsole(LOG_DEBUG, `[VRR.Main] Setting spawned state to ${state}`);
	isSpawned = state;
	setUpInitialGame();
	if (state) {
		setTimeout(function () {
			calledDeathEvent = false;
		}, 1000);

		getElementsByType(ELEMENT_PED).filter(ped => !ped.isType(ELEMENT_PLAYER)).forEach(ped => {
			syncCivilianProperties(ped);
		});

		getElementsByType(ELEMENT_PLAYER).forEach(player => {
			syncPlayerProperties(player);
		});

		getElementsByType(ELEMENT_VEHICLE).forEach(vehicle => {
			syncVehicleProperties(vehicle);
		});
	}
}

// ===========================================================================

function tellServerPlayerUsedKeyBind(key) {
	sendNetworkEventToServer("agrp.useKeyBind", key);
}

// ===========================================================================

function tellServerPlayerArrivedAtJobRouteLocation() {
	sendNetworkEventToServer("agrp.arrivedAtJobRouteLocation");
}

// ===========================================================================

function tellServerItemActionDelayComplete() {
	sendNetworkEventToServer("agrp.itemActionDelayComplete");
}

// ===========================================================================

function sendServerClientInfo() {
	let clientVersion = "0.0.0.0";
	if (typeof CLIENT_VERSION_MAJOR != "undefined") {
		clientVersion = `${CLIENT_VERSION_MAJOR}.${CLIENT_VERSION_MINOR}.${CLIENT_VERSION_PATCH}.${CLIENT_VERSION_BUILD}`;
	}
	sendNetworkEventToServer("agrp.clientInfo", clientVersion, game.width, game.height);
}

// ===========================================================================

function sendServerNewAFKStatus(state) {
	sendNetworkEventToServer("agrp.afk", state);
}

// ===========================================================================

function anchorBoat(vehicleId) {

}

// ===========================================================================

function setEnterPropertyKey(key) {
	enterPropertyKey = key;
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

function setElementCollisionsEnabled(elementId, state) {
	if (getElementFromId(elementId) == null) {
		return false;
	}

	getElementFromId(elementId).collisionsEnabled = state;
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
		if (getGame() == VRR_GAME_GTA_III || getGame() == VRR_GAME_GTA_VC) {
			game.SET_PLAYER_NEVER_GETS_TIRED(game.GET_PLAYER_ID(), boolToInt(state));
		}
	}
}

// ===========================================================================

function setLocalPlayerSkin(skinId) {
	logToConsole(LOG_INFO, `[VRR.Server] Setting locale player skin to ${skinId}`);
	if (getGame() == VRR_GAME_GTA_IV) {
		natives.changePlayerModel(natives.getPlayerId(), skinId);
	} else {
		localPlayer.skin = skinId;
	}
}

// ===========================================================================

function makePedHoldObject(pedId, modelIndex) {
	if (getGame() == VRR_GAME_GTA_IV) {
		natives.givePedAmbientObject(natives.getPedFromNetworkId(pedId), getGameConfig().objects[getGame()][modelIndex][1])
	}
}

// ===========================================================================

function sendLocalPlayerNetworkIdToServer() {
	sendNetworkEventToServer("agrp.playerPedId", natives.getNetworkIdFromPed(localPlayer));
}

// ===========================================================================

function setCutsceneInterior(cutsceneName) {
	if (getGame() == VRR_GAME_GTA_IV) {
		if (cutsceneName == "") {
			natives.clearCutscene();
		} else {
			if (natives.isInteriorScene()) {
				natives.clearCutscene();
			}
			natives.initCutscene(cutsceneName);
		}
	}
}

// ===========================================================================

function makeLocalPlayerPedSpeak(speechName) {
	if (getGame() == VRR_GAME_GTA_IV) {
		// if player is in vehicle, allow megaphone (if last arg is "1", it will cancel megaphone echo)
		// Only speeches with _MEGAPHONE will have the bullhorn effect
		// Afaik it only works on police voices anyway
		if (localPlayer.vehicle != null) {
			natives.sayAmbientSpeech(localPlayer, speechName, true, false, 0);
		} else {
			natives.sayAmbientSpeech(localPlayer, speechName, true, false, 1);
		}
	} else if (getGame() == VRR_GAME_GTA_III || getGame() == VRR_GAME_GTA_VC) {
		// Don't have a way to get the ped ref ID and can't use ped in arg
		//game.SET_CHAR_SAY(game.GET_PLAYER_ID(), int);
	}
}

// ===========================================================================

function setLocalPlayerAsCopState(state) {
	if (getGame() == VRR_GAME_GTA_IV) {
		natives.setPlayerAsCop(natives.getPlayerId(), state);
		natives.setPoliceIgnorePlayer(natives.getPlayerId(), state);
	}
}

// ===========================================================================

function serverRequestedLocalPlayerSpawn(skinId, position) {
	if (getGame() == VRR_GAME_GTA_IV) {
		natives.createPlayer(skinId, position);
		//if(isCustomCameraSupported()) {
		//	game.restoreCamera(true);
		//}
	}
}

// ===========================================================================

function sendLocaleSelectToServer(localeId) {
	sendNetworkEventToServer("agrp.localeSelect", localeId);
}

// ===========================================================================

function clearLocalPlayerOwnedPickups() {
	let pickups = getPickups().filter(pickup => pickup.isLocal == true);
	for (let i in pickups) {
		deleteLocalGameElement(pickups[i]);
	}
}

// ===========================================================================