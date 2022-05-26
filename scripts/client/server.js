// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: server.js
// DESC: Provides server communication and cross-endpoint operations
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

	// Chat history
	addNetworkEventHandler("m", receiveChatBoxMessageFromServer); // Not prefixed with VRR to make it as small as possible
	addNetworkEventHandler("vrr.chatScrollLines", setChatScrollLines);
	addNetworkEventHandler("vrr.chatAutoHideDelay", setChatAutoHideDelay);

	// Messaging (like textdraws and stuff)
	addNetworkEventHandler("vrr.smallGameMessage", showSmallGameMessage);

	// Job
	addNetworkEventHandler("vrr.job", receiveJobFromServer);
	addNetworkEventHandler("vrr.working", setLocalPlayerWorkingState);
	addNetworkEventHandler("vrr.jobType", setLocalPlayerJobType);
	addNetworkEventHandler("vrr.showJobRouteLocation", showJobRouteLocation);
	addNetworkEventHandler("vrr.hideJobRouteLocation", hideJobRouteLocation);

	// Local player states and values
	addNetworkEventHandler("vrr.restoreCamera", restoreLocalCamera);
	addNetworkEventHandler("vrr.cameraLookAt", setLocalCameraLookAt);
	addNetworkEventHandler("vrr.freeze", setLocalPlayerFrozenState);
	addNetworkEventHandler("vrr.control", setLocalPlayerControlState);
	addNetworkEventHandler("vrr.fadeCamera", fadeLocalCamera);
	addNetworkEventHandler("vrr.removeFromVehicle", removeLocalPlayerFromVehicle);
	addNetworkEventHandler("vrr.clearWeapons", clearLocalPlayerWeapons);
	addNetworkEventHandler("vrr.giveWeapon",  giveLocalPlayerWeapon);
	addNetworkEventHandler("vrr.position", setLocalPlayerPosition);
	addNetworkEventHandler("vrr.heading", setLocalPlayerHeading);
	addNetworkEventHandler("vrr.interior", setLocalPlayerInterior);
	addNetworkEventHandler("vrr.spawned", onServerSpawnedLocalPlayer);
	addNetworkEventHandler("vrr.money", setLocalPlayerCash);
	addNetworkEventHandler("vrr.armour", setLocalPlayerArmour);
	addNetworkEventHandler("vrr.localPlayerSkin", setLocalPlayerSkin);
	addNetworkEventHandler("vrr.pedSpeak", makeLocalPlayerPedSpeak);
	addNetworkEventHandler("vrr.infiniteRun", setLocalPlayerInfiniteRun);
	addNetworkEventHandler("vrr.playerCop", setLocalPlayerAsCopState);
	addNetworkEventHandler("vrr.health", setLocalPlayerHealth);
	addNetworkEventHandler("vrr.wantedLevel", setLocalPlayerWantedLevel);
	addNetworkEventHandler("vrr.playerPedId", sendLocalPlayerNetworkIdToServer);
	addNetworkEventHandler("vrr.ped", setLocalPlayerPedPartsAndProps);
	addNetworkEventHandler("vrr.spawn", serverRequestedLocalPlayerSpawn);
	addNetworkEventHandler("vrr.clearPedState", clearLocalPedState);
	addNetworkEventHandler("vrr.drunkEffect", setLocalPlayerDrunkEffect);

	// Vehicle
	addNetworkEventHandler("vrr.vehicle", receiveVehicleFromServer);
	addNetworkEventHandler("vrr.veh.lights", setVehicleLights);
	addNetworkEventHandler("vrr.veh.engine", setVehicleEngine);
	addNetworkEventHandler("vrr.veh.repair", repairVehicle);

	// Radio
	addNetworkEventHandler("vrr.radioStream", playStreamingRadio);
	addNetworkEventHandler("vrr.audioFileStream", playAudioFile);
	addNetworkEventHandler("vrr.stopRadioStream", stopStreamingRadio);
	addNetworkEventHandler("vrr.radioVolume", setStreamingRadioVolume);

	// Key Bindings
	addNetworkEventHandler("vrr.delKeyBind", unBindAccountKey);
	addNetworkEventHandler("vrr.addKeyBind", bindAccountKey);
	addNetworkEventHandler("vrr.clearKeyBinds", clearKeyBinds);

	// Weapon Damage
	addNetworkEventHandler("vrr.weaponDamageEnabled", setPlayerWeaponDamageEnabled);
	addNetworkEventHandler("vrr.weaponDamageEvent", setPlayerWeaponDamageEvent);

	// GUI
	addNetworkEventHandler("vrr.showRegistration", showRegistrationGUI);
	addNetworkEventHandler("vrr.showNewCharacter", showNewCharacterGUI);
	addNetworkEventHandler("vrr.showLogin", showLoginGUI);
	addNetworkEventHandler("vrr.2fa", showTwoFactorAuthGUI);
	addNetworkEventHandler("vrr.showResetPasswordCodeInput", resetPasswordCodeInputGUI);
	addNetworkEventHandler("vrr.showResetPasswordEmailInput", resetPasswordEmailInputGUI);
	addNetworkEventHandler("vrr.showChangePassword", showChangePasswordGUI);
	addNetworkEventHandler("vrr.showCharacterSelect", showCharacterSelectGUI);
	addNetworkEventHandler("vrr.switchCharacterSelect", switchCharacterSelectGUI);
	addNetworkEventHandler("vrr.showError", showErrorGUI);
	addNetworkEventHandler("vrr.showInfo", showInfoGUI);
	addNetworkEventHandler("vrr.showPrompt", showYesNoPromptGUI);
	addNetworkEventHandler("vrr.loginSuccess", loginSuccess);
	addNetworkEventHandler("vrr.characterSelectSuccess", characterSelectSuccess);
	addNetworkEventHandler("vrr.loginFailed", loginFailed);
	addNetworkEventHandler("vrr.registrationSuccess", registrationSuccess);
	addNetworkEventHandler("vrr.registrationFailed", registrationFailed);
	addNetworkEventHandler("vrr.newCharacterFailed", newCharacterFailed);
	addNetworkEventHandler("vrr.changePassword", showChangePasswordGUI);
	addNetworkEventHandler("vrr.showLocaleChooser", showLocaleChooserGUI);
	addNetworkEventHandler("vrr.guiColour", setGUIColours);

	// Business
	addNetworkEventHandler("vrr.business", receiveBusinessFromServer);

	// House
	addNetworkEventHandler("vrr.house", receiveHouseFromServer);

	// GPS
	addNetworkEventHandler("vrr.showGPSBlip", showGPSLocation);

	// Locale
	addNetworkEventHandler("vrr.locale", setLocale);
	addNetworkEventHandler("vrr.localeChooser", toggleLocaleChooserGUI);

	// Misc
	addNetworkEventHandler("vrr.mouseCursor", toggleMouseCursor);
	addNetworkEventHandler("vrr.mouseCamera", toggleMouseCamera);
	addNetworkEventHandler("vrr.clearPeds", clearLocalPlayerOwnedPeds);
	addNetworkEventHandler("vrr.passenger", enterVehicleAsPassenger);
	addNetworkEventHandler("vrr.logo", setServerLogoRenderState);
	addNetworkEventHandler("vrr.ambience", setCityAmbienceState);
	addNetworkEventHandler("vrr.runCode", runClientCode);
	addNetworkEventHandler("vrr.minuteDuration", setMinuteDuration);
	addNetworkEventHandler("vrr.snow", setSnowState);
	addNetworkEventHandler("vrr.enterPropertyKey", setEnterPropertyKey);
	addNetworkEventHandler("vrr.skinSelect", toggleSkinSelect);
	addNetworkEventHandler("vrr.hotbar", updatePlayerHotBar);
	addNetworkEventHandler("vrr.showItemActionDelay", showItemActionDelay);
	addNetworkEventHandler("vrr.set2DRendering", set2DRendering);
	addNetworkEventHandler("vrr.mouseCameraForce", setMouseCameraState);
	addNetworkEventHandler("vrr.logLevel", setLogLevel);
	addNetworkEventHandler("vrr.hideAllGUI", hideAllGUI);
	addNetworkEventHandler("vrr.nametag", updatePlayerNameTag);
	addNetworkEventHandler("vrr.nametagDistance", setNameTagDistance);
	addNetworkEventHandler("vrr.ping", updatePlayerPing);
	addNetworkEventHandler("vrr.anim", makePedPlayAnimation);
	addNetworkEventHandler("vrr.stopAnim", makePedStopAnimation);
	addNetworkEventHandler("vrr.forceAnim", forcePedAnimation);
	addNetworkEventHandler("vrr.clientInfo", serverRequestedClientInfo);
	addNetworkEventHandler("vrr.interiorLights", updateInteriorLightsState);
	addNetworkEventHandler("vrr.cutsceneInterior", setCutsceneInterior);
	addNetworkEventHandler("vrr.syncElement", forceSyncElementProperties);
	addNetworkEventHandler("vrr.elementPosition", setElementPosition);
	addNetworkEventHandler("vrr.elementCollisions", setElementCollisionsEnabled);
	addNetworkEventHandler("vrr.vehBuyState", setVehiclePurchaseState);
	addNetworkEventHandler("vrr.holdObject", makePedHoldObject);
}

// ===========================================================================

function sendResourceReadySignalToServer() {
	sendNetworkEventToServer("vrr.clientReady");
}

// ===========================================================================

function sendResourceStartedSignalToServer() {
	sendNetworkEventToServer("vrr.clientStarted");
}

// ===========================================================================

function sendResourceStoppedSignalToServer() {
	if(isConnected) {
		sendNetworkEventToServer("vrr.clientStopped");
	}
}

// ===========================================================================

function set2DRendering(hudState, labelState, smallGameMessageState, scoreboardState, hotBarState, itemActionDelayState) {
	logToConsole(LOG_DEBUG, `[VRR.Main] Updating render states (HUD: ${hudState}, Labels: ${labelState}, Bottom Text: ${smallGameMessageState}, Scoreboard: ${scoreboardState}, HotBar: ${hotBarState}, Item Action Delay: ${itemActionDelayState})`);
	renderHUD = hudState;

	if(getGame() == VRR_GAME_GTA_IV) {
		natives.displayCash(hudState);
		natives.displayAmmo(hudState);
		natives.displayHud(hudState);
		natives.displayRadar(hudState);
		natives.displayAreaName(hudState);
	} else {
		if(typeof setHUDEnabled != "undefined") {
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
	if(state) {
		setTimeout(function() {
			calledDeathEvent = false;
		}, 1000);

		getPeds().filter(ped => !ped.isType(ELEMENT_PLAYER)).forEach(ped => {
			syncCivilianProperties(ped);
		});

		getPlayers().forEach(player => {
			syncPlayerProperties(player);
		});

		getVehicles().forEach(veh => {
			syncVehicleProperties(veh);
		});
	}
}

// ===========================================================================

function tellServerPlayerUsedKeyBind(key) {
	sendNetworkEventToServer("vrr.useKeyBind", key);
}

// ===========================================================================

function tellServerPlayerArrivedAtJobRouteLocation() {
	sendNetworkEventToServer("vrr.arrivedAtJobRouteLocation");
}

// ===========================================================================

function tellServerItemActionDelayComplete() {
	sendNetworkEventToServer("vrr.itemActionDelayComplete");
}

// ===========================================================================

function sendServerClientInfo() {
	let clientVersion = "0.0.0.0";
	if(typeof CLIENT_VERSION_MAJOR != "undefined") {
		clientVersion = `${CLIENT_VERSION_MAJOR}.${CLIENT_VERSION_MINOR}.${CLIENT_VERSION_PATCH}.${CLIENT_VERSION_BUILD}`;
	}
	sendNetworkEventToServer("vrr.clientInfo", clientVersion, game.width, game.height);
}

// ===========================================================================

function sendServerNewAFKStatus(state) {
	sendNetworkEventToServer("vrr.afk", state);
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
	if(getElementFromId(elementId) == null) {
		return false;
	}

	syncElementProperties(getElementFromId(elementId));
}

// ===========================================================================

function setElementCollisionsEnabled(elementId, state) {
	if(getElementFromId(elementId) == null) {
		return false;
	}

	getElementFromId(elementId).collisionsEnabled = state;
}

// ===========================================================================

function setLocalPlayerArmour(armour) {
	if(typeof localPlayer.armour != "undefined") {
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
	if(localPlayer != null) {
		if(getGame() == VRR_GAME_GTA_III || getGame() == VRR_GAME_GTA_VC) {
			game.SET_PLAYER_NEVER_GETS_TIRED(game.GET_PLAYER_ID(), boolToInt(state));
		}
	}
}

// ===========================================================================

function setLocalPlayerSkin(skinId) {
	logToConsole(LOG_INFO, `[VRR.Server] Setting locale player skin to ${skinId}`);
	if(getGame() == VRR_GAME_GTA_IV) {
		natives.changePlayerModel(natives.getPlayerId(), skinId);
	} else {
		localPlayer.skin = skinId;
	}
}

// ===========================================================================

function makePedHoldObject(pedId, modelIndex) {
	if(getGame() == VRR_GAME_GTA_IV) {
		natives.givePedAmbientObject(natives.getPedFromNetworkId(pedId), getGameConfig().objects[getGame()][modelIndex][1])
	}
}

// ===========================================================================

function sendLocalPlayerNetworkIdToServer() {
	sendNetworkEventToServer("vrr.playerPedId", natives.getNetworkIdFromPed(localPlayer));
}

// ===========================================================================

function setCutsceneInterior(cutsceneName) {
	if(getGame() == VRR_GAME_GTA_IV) {
		if(cutsceneName == "") {
			natives.clearCutscene();
		} else {
			if(natives.isInteriorScene()) {
				natives.clearCutscene();
			}
			natives.initCutscene(cutsceneName);
		}
	}
}

// ===========================================================================

function makeLocalPlayerPedSpeak(speechName) {
	if(getGame() == VRR_GAME_GTA_IV) {
		// if player is in vehicle, allow megaphone (if last arg is "1", it will cancel megaphone echo)
		// Only speeches with _MEGAPHONE will have the bullhorn effect
		// Afaik it only works on police voices anyway
		if(localPlayer.vehicle != null) {
			natives.sayAmbientSpeech(localPlayer, speechName, true, false, 0);
		} else {
			natives.sayAmbientSpeech(localPlayer, speechName, true, false, 1);
		}
	} else if(getGame() == VRR_GAME_GTA_III || getGame() == VRR_GAME_GTA_VC) {
		// Don't have a way to get the ped ref ID and can't use ped in arg
		//game.SET_CHAR_SAY(game.GET_PLAYER_ID(), int);
	}
}

// ===========================================================================

function setLocalPlayerAsCopState(state) {
	if(getGame() == VRR_GAME_GTA_IV) {
		natives.setPlayerAsCop(natives.getPlayerId(), state);
		natives.setPoliceIgnorePlayer(natives.getPlayerId(), state);
	}
}

// ===========================================================================

function serverRequestedLocalPlayerSpawn(skinId, position) {
	if(getGame() == VRR_GAME_GTA_IV) {
		natives.createPlayer(skinId, position);
		//if(isCustomCameraSupported()) {
		//	game.restoreCamera(true);
		//}
	}
}

// ===========================================================================

function sendLocaleSelectToServer(localeId) {
	sendNetworkEventToServer("vrr.localeSelect", localeId);
}

// ===========================================================================