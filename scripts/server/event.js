// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: event.js
// DESC: Provides handlers for built in GTAC and Asshat-Gaming created events
// TYPE: Server (JavaScript)
// ===========================================================================

function initEventScript() {
	logToConsole(LOG_INFO, "[VRR.Event]: Initializing event script ...");
	addAllEventHandlers();
	logToConsole(LOG_INFO, "[VRR.Event]: Event script initialized!");
}

// ===========================================================================

function addAllEventHandlers() {
	addEventHandler("onResourceStart", onResourceStart);
	addEventHandler("onResourceStop", onResourceStop);
	addEventHandler("onProcess", onProcess);
	addEventHandler("onPlayerConnect", onPlayerConnect);
	addEventHandler("onPlayerJoin", onPlayerJoin);
	addEventHandler("onPlayerJoined", onPlayerJoined);
	addEventHandler("onPlayerChat", onPlayerChat);
	addEventHandler("onPlayerQuit", onPlayerQuit);
	addEventHandler("onElementStreamIn", onElementStreamIn);
	addEventHandler("onElementStreamOut", onElementStreamOut);
	addEventHandler("onPedSpawn", onPedSpawn);
	addEventHandler("onPedEnteredVehicleEx", onPedEnteredVehicle);
	addEventHandler("onPedExitedVehicleEx", onPedExitedVehicle);
	addEventHandler("onPedEnteredSphereEx", onPedEnteredSphere);
	addEventHandler("onPedExitedSphereEx", onPedExitedSphere);
	addEventHandler("OnPickupPickedUp", onPedPickupPickedUp);
}

// ===========================================================================

function onPlayerConnect(event, ipAddress, port) {
	logToConsole(LOG_INFO, `[VRR.Event] Client connecting (IP: ${ipAddress})`);
	//if(isIpAddressBanned(ipAddress)) {
	//    messagePlayerError(client, "You are banned from this server!");
	//    return false;
	//}
}

// ===========================================================================

function onPlayerJoin(event, client) {
	logToConsole(LOG_INFO, `[VRR.Event] Client ${getPlayerName(client)}[${getPlayerId(client)}] joining from ${getPlayerIP(client)}`);

	//if (isFadeCameraSupported()) {
	//	fadeCamera(client, true, 1.0);
	//}

	//if(isCustomCameraSupported()) {
	//	showConnectCameraToPlayer(client);
	//}

	let messageText = `👋 ${getPlayerName(client)} is connecting to the server ...`;
	messageDiscordEventChannel(messageText);

	let clients = getClients();
	for (let i in clients) {
		messagePlayerNormal(clients[i], getLocaleString(clients[i], "PlayerConnecting", getPlayerName(client)));
	}

	//messageDiscordEventChannel(`👋 ${getPlayerDisplayForConsole(client)} has joined the server.`);
}

// ===========================================================================

function onPlayerJoined(event, client) {
	//initClient(client);
}

// ===========================================================================

function onElementStreamIn(event, element, client) {
	//if(getPlayerDimension(client) != getElementDimension(element)) {
	//    event.preventDefault();
	//}

	if (getPlayerData(getClientFromIndex(element.owner)) != false) {
		if (hasBitFlag(getPlayerData(getClientFromIndex(element.owner)).accountData.flags.moderation, getModerationFlagValue("DontSyncClientElements"))) {
			event.preventDefault();
			destroyGameElement(element);
		}
	}
}

// ===========================================================================

function onElementStreamOut(event, element, client) {

}

// ===========================================================================

function onPlayerQuit(event, client, quitReasonId) {
	logToConsole(LOG_INFO, `👋 Client ${getPlayerDisplayForConsole(client)} disconnected (${disconnectReasons[quitReasonId]}[${quitReasonId}])`);
	updateConnectionLogOnQuit(client, quitReasonId);

	let reasonText = disconnectReasons[quitReasonId];
	if (getPlayerData(client) != false) {
		if (getPlayerData(client).customDisconnectReason != "") {
			reasonText = getPlayerData(client).customDisconnectReason;
		}
	}

	//messagePlayerNormal(null, `👋 ${getPlayerName(client)} has left the server (${reasonText})`, getColourByName("softYellow"));

	//if (isPlayerFishing(client)) {
	//	stopFishing(client);
	//}

	if (isPlayerInPaintBall(client)) {
		stopPaintBall(client);
	}

	if (isPlayerOnJobRoute(client)) {
		stopJobRoute(client);
	}

	if (isPlayerWorking(client)) {
		stopWorking(client);
	}

	if (isPlayerLoggedIn(client)) {
		savePlayerToDatabase(client);
		resetClientStuff(client);
	}

	if (getPlayerData(client).loginTimeout != null) {
		clearTimeout(getPlayerData(client).loginTimeout);
	}

	playerResourceReady[client.index] = false;
	playerResourceStarted[client.index] = false;
	playerInitialized[client.index] = false;
	playerGUIReady[client.index] = false;

	messageDiscordEventChannel(`👋 ${getPlayerName(client)} has left the server (${reasonText})`);
	getClients().forEach(forClient => {
		let reasonText = getGroupedLocaleString(forClient, "DisconnectReasons", quitReasonId);
		messagePlayerNormal(forClient, getLocaleString(forClient, "PlayerLeftServer", getPlayerName(client), reasonText));
	});

	getServerData().clients[getPlayerId(client)] = null;
}

// ===========================================================================

async function onPlayerChat(event, client, messageText) {
	event.preventDefault();
	processPlayerChat(client, messageText);
}

// ===========================================================================

function onProcess(event, deltaTime) {
	updateServerGameTime();
	//checkPlayerSpawning();
	//checkPlayerPedState();
	//checkVehicleBurning();

	processVehiclePurchasing();
}

// ===========================================================================

function onEntityProcess(event, entity) {
}

// ===========================================================================

function onPedEnteringVehicle(event, ped, vehicle, seat) {
	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		getPlayerData(client).pedState = AGRP_PEDSTATE_ENTERINGVEHICLE;

		if (!getVehicleData(vehicle)) {
			return false;
		}

		if (getVehicleData(vehicle).locked) {
			if (doesPlayerHaveVehicleKeys(client, vehicle)) {
				if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "lock")) {
					messagePlayerTip(client, getLocaleString(client, "VehicleLockedCommandTip", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "lock").key))}{MAINCOLOUR}`));
				} else {
					messagePlayerTip(client, getLocaleString(client, "VehicleLockedCommandTip", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}/lock{MAINCOLOUR}`));
				}
			} else {
				messagePlayerNormal(client, messagePlayerTip(client, getLocaleString(client, "VehicleLockedCantUnlock", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`)));
			}

			//getPlayerData(client).enteringVehicle = null;
			//makePlayerStopAnimation(client);
			return false;
		}

		getPlayerData(client).enteringVehicle = vehicle;
	}
}

// ===========================================================================

function onPedExitingVehicle(event, ped, vehicle) {
	if (!getVehicleData(vehicle)) {
		return false;
	}

	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		getPlayerData(client).pedState = AGRP_PEDSTATE_EXITINGVEHICLE;
	}

	if (!getVehicleData(vehicle).spawnLocked) {
		getVehicleData(vehicle).spawnPosition = getVehiclePosition(vehicle);
		getVehicleData(vehicle).spawnRotation = getVehicleHeading(vehicle);
		getVehicleData(vehicle).needsSaved = true;
	}
}

// ===========================================================================

function onResourceStart(event, resource) {
	logToConsole(LOG_WARN, `[VRR.Event] Resource ${resource.name} started!`);

	//if(resource != thisResource) {
	//	messageAdmins(`{MAINCOLOUR}Resource {ALTCOLOUR}${resource.name}{MAINCOLOUR} started!`);
	//}
}

// ===========================================================================

function onResourceStop(event, resource) {
	logToConsole(LOG_WARN, `[VRR.Event] Resource ${resource.name} stopped!`);

	//if(resource != thisResource) {
	//	messageAdmins(`{MAINCOLOUR}Resource {ALTCOLOUR}${resource.name}{MAINCOLOUR} stopped!`);
	//}

	if (resource == thisResource) {
		kickAllClients();
		saveServerDataToDatabase();
		disconnectFromDatabase(persistentDatabaseConnection, true);
		collectAllGarbage();
	}
}

// ===========================================================================

function onPedEnteredSphere(event, ped, sphere) {
	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);

		// Handled client-side since server spheres aren't showing on GTAC atm (bug)
		//if (isPlayerOnJobRoute(client)) {
		//	if (sphere == getJobRouteLocationData(getPlayerJob(client), getPlayerJobRoute(client), getPlayerJobRouteLocation(client)).marker) {
		//		playerArrivedAtJobRouteLocation(client);
		//	}
		//}
	}
}

// ===========================================================================

function onPedExitedSphere(event, ped, sphere) {
	//if (ped.isType(ELEMENT_PLAYER)) {
	//	let client = getClientFromPlayerElement(ped);
	//}
}

// ===========================================================================

function onPedPickupPickedUp(event, ped, pickup) {
	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);

		//if (isPlayerOnJobRoute(client)) {
		//	if (pickup == getJobRouteLocationData(getPlayerJob(client), getPlayerJobRoute(client), getPlayerJobRouteLocation(client)).marker) {
		//		playerArrivedAtJobRouteLocation(client);
		//	}
		//}
	}
}

// ===========================================================================

function onPedWasted(event, ped, killerPed, weapon, pedPiece) {
	if (ped.isType(ELEMENT_PLAYER)) {
		let killerClient = null;
		if (killerPed != null && killerPed.type == ELEMENT_PLAYER) {
			killerClient = getClientFromPlayerElement(killerPed);
		}
		onPlayerWasted(getClientFromPlayerElement(ped), killerClient, weapon, pedPiece);
	}
}

// ===========================================================================

function onPlayerDeath(client, killer, weapon, pedPiece) {
	logToConsole(LOG_INFO, `${getPlayerDisplayForConsole(client)} died.`);
	getPlayerData(client).pedState = AGRP_PEDSTATE_DEAD;
	updatePlayerSpawnedState(client, false);
	setPlayerControlState(client, false);
	setTimeout(function () {
		if (isFadeCameraSupported()) {
			fadeCamera(client, false, 1.0);
		}
		setTimeout(function () {
			if (isPlayerInPaintBall(client)) {
				getPlayerData(killer).paintBallKills++;
				getPlayerData(client).paintBallDeaths++;

				if (getPlayerData(killer).paintBallDeaths >= getGlobalConfig().paintBallMaxKills) {
					let paintBallPlayers = getAllPlayersInBusiness(getPlayerData(client).paintBallBusiness);
					let winner = paintBallPlayers[i];
					for (let i in paintBallPlayers) {
						if (getPlayerData(paintBallPlayers[i]).paintBallKills > getPlayerData(winner).paintBallKills) {
							winner = paintBallPlayers[i];
						}
					}

					for (let i in paintBallPlayers) {
						showSmallGameMessage(paintBallPlayers[i], `${getLocaleString(paintBallPlayers[i], "PaintBallEnded")} ${getLocaleString(paintBallPlayers[i], "Winners", `${getCharacterFullName(winner)}`)}`);
						stopPaintBall(paintBallPlayers[i]);
					}
				} else {
					respawnPlayerForPaintBall(client);
				}
			} else {
				if (getPlayerCurrentSubAccount(client).inJail) {
					let closestJail = getClosestPoliceStation(getPlayerPosition(client));
					despawnPlayer(client);
					getPlayerCurrentSubAccount(client).interior = closestJail.interior;
					getPlayerCurrentSubAccount(client).dimension = closestJail.dimension;

					if (isPlayerWorking(client)) {
						stopWorking(client);
					}

					spawnPlayer(client, closestJail.position, closestJail.heading, getGameConfig().skins[getGame()][getPlayerCurrentSubAccount(client).skin][0]);

					if (isFadeCameraSupported()) {
						fadeCamera(client, true, 1.0);
					}
					updatePlayerSpawnedState(client, true);
					makePlayerStopAnimation(client);
					setPlayerControlState(client, true);
					resetPlayerBlip(client);
				} else {
					let closestHospital = getClosestHospital(getPlayerPosition(client));
					despawnPlayer(client);
					getPlayerCurrentSubAccount(client).interior = closestHospital.interior;
					getPlayerCurrentSubAccount(client).dimension = closestHospital.dimension;

					if (isPlayerWorking(client)) {
						stopWorking(client);
					}

					spawnPlayer(client, closestHospital.position, closestHospital.heading, getGameConfig().skins[getGame()][getPlayerCurrentSubAccount(client).skin][0]);

					if (isFadeCameraSupported()) {
						fadeCamera(client, true, 1.0);
					}

					updatePlayerSpawnedState(client, true);
					makePlayerStopAnimation(client);
					setPlayerControlState(client, true);
					resetPlayerBlip(client);
				}
			}
		}, 2000);
	}, 1000);

	/*
	let queryData = [
		["log_death_server", getServerId()]
		["log_death_who_died", getPlayerCurrentSubAccount(client).databaseId],
		["log_death_when_died", "{UNIXTIMESTAMP}"],
		["log_death_pos_x", position.x],
		["log_death_pos_y", position.y],
		["log_death_pos_z", position.x],
	];
	let queryString = createDatabaseInsertQuery("log_death", queryData);
	addToQueryQueue(queryString);
	*/
}

// ===========================================================================

function onPedSpawn(ped) {
	if (ped.type == ELEMENT_PLAYER) {
		//setTimeout(onPlayerSpawn, 250, ped);
		onPlayerSpawn();
	}
}

// ===========================================================================

async function onPlayerSpawn(client) {
	//logToConsole(LOG_DEBUG, `[VRR.Event] Checking for ${getPlayerDisplayForConsole(client)}'s player ped`);
	//if(getPlayerPed(client) == null) {
	//    logToConsole(LOG_DEBUG, `[VRR.Event] ${getPlayerDisplayForConsole(client)}'s player element not set yet. Rechecking ...`);
	//    setTimeout(onPlayerSpawn, 500, client);
	//    return false;
	//}
	//logToConsole(LOG_DEBUG, `[VRR.Event] ${getPlayerDisplayForConsole(client)}'s player ped is valid. Continuing spawn processing ...`);

	if (areServerElementsSupported()) {
		await waitUntil(() => client != null && getPlayerPed(client) != null);
	}

	//logToConsole(LOG_DEBUG, `[VRR.Event] Checking ${getPlayerDisplayForConsole(client)}'s player data`);
	if (!getPlayerData(client)) {
		logToConsole(LOG_DEBUG, `[VRR.Event] ${getPlayerDisplayForConsole(client)}'s player data is invalid. Kicking them from server.`);
		getPlayerData(targetClient).customDisconnectReason = `Kicked - Spawn bug. Data invalid.`;
		disconnectPlayer(client);
		return false;
	}

	//logToConsole(LOG_DEBUG, `[VRR.Event] Checking ${getPlayerDisplayForConsole(client)}'s login status`);
	if (!isPlayerLoggedIn(client)) {
		logToConsole(LOG_DEBUG, `[VRR.Event] ${getPlayerDisplayForConsole(client)} is NOT logged in. Despawning their player.`);
		getPlayerData(targetClient).customDisconnectReason = `Kicked - Tried to force spawn without logging in.`;
		disconnectPlayer(client);
		return false;
	}

	//logToConsole(LOG_DEBUG, `[VRR.Event] Checking ${getPlayerDisplayForConsole(client)}'s selected character status`);
	if (getPlayerData(client).currentSubAccount == -1) {
		logToConsole(LOG_DEBUG, `[VRR.Event] ${getPlayerDisplayForConsole(client)} has NOT selected a character. Despawning their player.`);
		getPlayerData(targetClient).customDisconnectReason = `Kicked - Tried to force spawn without selecting a character.`;
		disconnectPlayer(client);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Event] ${getPlayerDisplayForConsole(client)}'s player data is valid. Continuing spawn processing ...`);

	if (isGameFeatureSupported("pedScale")) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Setting ${getPlayerDisplayForConsole(client)}'s ped scale (${getPlayerCurrentSubAccount(client).pedScale})`);
		setEntityData(getPlayerPed(client), "agrp.scale", getPlayerCurrentSubAccount(client).pedScale, true);
	}

	//if (isPlayerSwitchingCharacter(client) || isPlayerCreatingCharacter(client)) {
	//	logToConsole(LOG_DEBUG, `[VRR.Event] ${getPlayerDisplayForConsole(client)}'s ped is being used for character selection/creation. No further spawn processing needed'`);
	//	return false;
	//}

	if (isCustomCameraSupported() && getGame() != AGRP_GAME_GTA_IV && getGame() != AGRP_GAME_GTA_IV_EFLC) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Restoring ${getPlayerDisplayForConsole(client)}'s camera`);
		restorePlayerCamera(client);
	}

	if (areServerElementsSupported()) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Storing ${getPlayerDisplayForConsole(client)} ped in client data `);
		getPlayerData(client).ped = getPlayerPed(client);
	}

	logToConsole(LOG_DEBUG, `[VRR.Event] Sending ${getPlayerDisplayForConsole(client)} the 'now playing as' message`);
	messagePlayerAlert(client, `You are now playing as: {businessBlue}${getCharacterFullName(client)}`, getColourByName("white"));
	//messagePlayerNormal(client, "This server is in early development and may restart at any time for updates.", getColourByName("orange"));
	//messagePlayerNormal(client, "Please report any bugs using /bug and suggestions using /idea", getColourByName("yellow"));

	// Tried this. Doesn't work for some reason.
	// Mafia Connected needs fixed to set position on spawn.
	//if (getGame() == AGRP_GAME_MAFIA_ONE) {
	//	setPlayerPosition(client, getPlayerCurrentSubAccount(client).spawnPosition);
	//	setPlayerHeading(client, getPlayerCurrentSubAccount(client).spawnHeading);
	//	setPlayerDimension(client, getPlayerCurrentSubAccount(client).dimension);
	//}

	if (isGameFeatureSupported("interior")) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Setting player interior for ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).interior}`);
		setPlayerInterior(client, getPlayerCurrentSubAccount(client).interior);
	}

	logToConsole(LOG_DEBUG, `[VRR.Event] Setting player dimension for ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).dimension}`);
	setPlayerDimension(client, getPlayerCurrentSubAccount(client).dimension);

	//if(getPlayerCurrentSubAccount(client).interior != 0 || getPlayerCurrentSubAccount(client).dimension != 0) {
	//    updateAllInteriorVehiclesForPlayer(client, getPlayerCurrentSubAccount(client).interior, getPlayerCurrentSubAccount(client).dimension);
	//}

	logToConsole(LOG_DEBUG, `[VRR.Event] Setting player health for ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).health}`);
	setPlayerHealth(client, getPlayerCurrentSubAccount(client).health);

	if (isGameFeatureSupported("pedArmour")) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Setting player armour for ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).armour}`);
		setPlayerArmour(client, getPlayerCurrentSubAccount(client).armour);
	}

	logToConsole(LOG_DEBUG, `[VRR.Event] Sending ${getPlayerDisplayForConsole(client)}'s job type to their client (${getJobIndexFromDatabaseId(getPlayerCurrentSubAccount(client))})`);
	sendPlayerJobType(client, getPlayerCurrentSubAccount(client).job);

	if (isGameFeatureSupported("rendering2D")) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Enabling all rendering states for ${getPlayerDisplayForConsole(client)}`);
		setPlayer2DRendering(client, true, true, true, true, true, true);
	}

	if (isGameFeatureSupported("snow")) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Sending snow states to ${getPlayerDisplayForConsole(client)}`);
		updatePlayerSnowState(client);
	}

	if (areServerElementsSupported() && isGameFeatureSupported("walkStyle")) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Setting player walking style for ${getPlayerDisplayForConsole(client)}`);
		setEntityData(getPlayerPed(client), "agrp.walkStyle", getPlayerCurrentSubAccount(client).walkStyle, true);
	}

	if (isGameFeatureSupported("fightStyle")) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Setting player fighting style for ${getPlayerDisplayForConsole(client)}`);
		setPlayerFightStyle(client, getPlayerCurrentSubAccount(client).fightStyle);
	}

	if (isGameFeatureSupported("rendering2D")) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Updating logo state for ${getPlayerDisplayForConsole(client)}`);
		updatePlayerShowLogoState(client, (getServerConfig().showLogo && doesPlayerHaveLogoEnabled(client)));
	}

	logToConsole(LOG_DEBUG, `[VRR.Event] Caching ${getPlayerDisplayForConsole(client)}'s hotbar items`);
	cachePlayerHotBarItems(client);

	logToConsole(LOG_DEBUG, `[VRR.Event] Syncing ${getPlayerDisplayForConsole(client)}'s hotbar`);
	updatePlayerHotBar(client);

	logToConsole(LOG_DEBUG, `[VRR.Event] Setting ${getPlayerDisplayForConsole(client)}'s switchchar state to false`);
	getPlayerData(client).switchingCharacter = false;

	if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "enter")) {
		let keyId = getPlayerKeyBindForCommand(client, "enter");
		logToConsole(LOG_DEBUG, `[VRR.Event] Sending custom enter property key ID (${keyId.key}, ${toUpperCase(getKeyNameFromId(keyId.key))}) to ${getPlayerDisplayForConsole(client)}`);
		sendPlayerEnterPropertyKey(client, keyId.key);
	}

	//if(isGTAIV()) {
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartHair", getPlayerCurrentSubAccount(client).bodyParts.hair, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartHead", getPlayerCurrentSubAccount(client).bodyParts.head, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartUpper", getPlayerCurrentSubAccount(client).bodyParts.upper, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartLower", getPlayerCurrentSubAccount(client).bodyParts.lower, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPropHair", getPlayerCurrentSubAccount(client).bodyProps.hair, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPropEyes", getPlayerCurrentSubAccount(client).bodyProps.eyes, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartHead", getPlayerCurrentSubAccount(client).bodyProps.head, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartLeftHand", getPlayerCurrentSubAccount(client).bodyProps.leftHand, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartRightHand", getPlayerCurrentSubAccount(client).bodyProps.rightHand, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartLeftWrist", getPlayerCurrentSubAccount(client).bodyProps.leftWrist, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartRightWrist", getPlayerCurrentSubAccount(client).bodyProps.rightWrist, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartHip", getPlayerCurrentSubAccount(client).bodyProps.hip, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartLeftFoot", getPlayerCurrentSubAccount(client).bodyProps.leftFoot, true);
	//    setEntityData(getPlayerPed(client), "agrp.bodyPartRightFoot", getPlayerCurrentSubAccount(client).bodyProps.rightFoot, true);
	//}

	if (isGTAIV()) {
		//sendPlayerPedPartsAndProps(client);
	}

	logToConsole(LOG_DEBUG, `[VRR.Event] Setting ${getPlayerDisplayForConsole(client)}'s ped state to ready`);
	getPlayerData(client).pedState = AGRP_PEDSTATE_READY;

	if (areServerElementsSupported()) {
		syncPlayerProperties(client);
		//setTimeout(function() {
		//    syncPlayerProperties(client);
		//}, 1000);
	}

	logToConsole(LOG_DEBUG, `[VRR.Event] Syncing ${getPlayerDisplayForConsole(client)}'s cash ${getPlayerCurrentSubAccount(client).cash}`);
	updatePlayerCash(client);

	if (isGameFeatureSupported("customNametag")) {
		logToConsole(LOG_DEBUG, `[VRR.Event] Sending player nametag distance to ${getPlayerDisplayForConsole(client)}`);
		sendNameTagDistanceToClient(client, getServerConfig().nameTagDistance);
	}

	if (!areServerElementsSupported()) {
		sendAllBusinessesToPlayer(client);
		sendAllHousesToPlayer(client);
		//sendAllJobsToPlayer(client);
		//sendAllVehiclesToPlayer(client);
		requestPlayerPedNetworkId(client);
	}

	logToConsole(LOG_DEBUG, `[VRR.Event] Updating spawned state for ${getPlayerDisplayForConsole(client)} to true`);
	updatePlayerSpawnedState(client, true);

	getPlayerData(client).payDayTickStart = sdl.ticks;

	// Locales are handled via resource files now. No need to send anymore, but kept in case revert is needed.
	//sendPlayerLocaleStrings(client);

	logToConsole(LOG_DEBUG, `[VRR.Event] Updating all player name tags`);
	updateAllPlayerNameTags();

	setPlayerWeaponDamageEvent(client, AGRP_WEAPON_DAMAGE_EVENT_NORMAL);

	if (areServerElementsSupported()) {
		if (getGlobalConfig().playerStreamInDistance == -1 || getGlobalConfig().playerStreamOutDistance == -1) {
			getPlayerPed(client).netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(getPlayerPed(client), getServerConfig().playerStreamInDistance);
			setElementStreamOutDistance(getPlayerPed(client), getServerConfig().playerStreamOutDistance);
		}

		resetPlayerBlip(client);
	}

	// Radio stuff must be last thing sent to client because it hangs the client for a second, which blocks processing of other incoming packets
	// Start playing business/house radio if in one
	if (getPlayerCurrentSubAccount(client).interior != getGameConfig().mainWorldInterior[getGame()] || getPlayerCurrentSubAccount(client).dimension != getGameConfig().mainWorldDimension[getGame()]) {
		let businessId = getPlayerBusiness(client);
		let houseId = getPlayerHouse(client);
		if (businessId != -1) {
			if (getBusinessData(businessId).streamingRadioStation != -1) {
				playRadioStreamForPlayer(client, getRadioStationData(getBusinessData(businessId).streamingRadioStation).url, true, getPlayerStreamingRadioVolume(client), null);
			}
		} else if (houseId != -1) {
			if (getHouseData(houseId).streamingRadioStation != -1) {
				playRadioStreamForPlayer(client, getRadioStationData(getHouseData(houseId).streamingRadioStation).url, true, getPlayerStreamingRadioVolume(client), null);
			}
		} else {
			stopRadioStreamForPlayer(client);
		}
	} else {
		stopRadioStreamForPlayer(client);
	}

	messageDiscordEventChannel(`🧍 ${getPlayerName(client)} spawned as ${getCharacterFullName(client)}`);
}

// ===========================================================================

function onPlayerCommand(event, client, command, params) {
	if (!doesCommandExist(command)) {
		processPlayerCommand(command, params, client);
	}
}

// ===========================================================================

function onPedExitedVehicle(event, ped, vehicle, seat) {
	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		if (client != null) {
			getPlayerData(client).pedState = AGRP_PEDSTATE_READY;

			stopRadioStreamForPlayer(client);

			if (!getVehicleData(vehicle)) {
				return false;
			}

			if (isPlayerWorking(client)) {
				if (isPlayerOnJobRoute(client)) {
					if (vehicle == getPlayerJobRouteVehicle(client)) {
						startReturnToJobVehicleCountdown(client);
					}
				}
			}

			getVehicleData(vehicle).lastActiveTime = getCurrentUnixTimestamp();

			logToConsole(LOG_DEBUG, `[VRR.Event] ${getPlayerDisplayForConsole(client)} exited a ${getVehicleName(vehicle)} (ID: ${vehicle.getData("agrp.dataSlot")}, Database ID: ${getVehicleData(vehicle).databaseId})`);
		}
	}
}

// ===========================================================================

function onPedEnteredVehicle(event, ped, vehicle, seat) {
	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		if (client != null) {
			if (getPlayerData(client) == false) {
				return false;
			}

			if (getGame() == AGRP_GAME_GTA_IV) {
				vehicle = getVehicleFromIVNetworkId(clientVehicle);
			}

			if (!getVehicleData(vehicle)) {
				return false;
			}

			logToConsole(LOG_DEBUG, `[VRR.Event] ${getPlayerDisplayForConsole(client)} entered a ${getVehicleName(vehicle)} (ID: ${vehicle.getData("agrp.dataSlot")}, Database ID: ${getVehicleData(vehicle).databaseId})`);

			getPlayerData(client).lastVehicle = vehicle;
			getVehicleData(vehicle).lastActiveTime = getCurrentUnixTimestamp();

			if (seat == AGRP_VEHSEAT_DRIVER) {
				vehicle.engine = getVehicleData(vehicle).engine;

				if (getVehicleData(vehicle).buyPrice > 0) {
					messagePlayerAlert(client, getLocaleString(client, "VehicleForSale", getVehicleName(vehicle), `{ALTCOLOUR}${getCurrencyString(getVehicleData(vehicle).buyPrice)}{MAINCOLOUR}`, `{ALTCOLOUR}/vehbuy{MAINCOLOUR}`));
					resetVehiclePosition(vehicle);
				} else if (getVehicleData(vehicle).rentPrice > 0) {
					if (getVehicleData(vehicle).rentedBy != client) {
						messagePlayerAlert(client, getLocaleString(client, "VehicleForRent", getVehicleName(vehicle), `{ALTCOLOUR}${getCurrencyString(getVehicleData(vehicle).rentPrice)}{MAINCOLOUR}`, `{ALTCOLOUR}/vehrent{MAINCOLOUR}`));
						resetVehiclePosition(vehicle);
					} else {
						messagePlayerAlert(client, getLocaleString(client, "CurrentlyRentingThisVehicle", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}${getCurrencyString(getVehicleData(vehicle).rentPrice)}`, `{ALTCOLOUR}/stoprent{MAINCOLOUR}`));
					}
				} else {
					let ownerName = "Nobody";
					let ownerType = getLocaleString(client, "NotOwned");
					ownerType = toLowerCase(getVehicleOwnerTypeText(getVehicleData(vehicle).ownerType));
					switch (getVehicleData(vehicle).ownerType) {
						case AGRP_VEHOWNER_CLAN:
							ownerName = getClanData(getClanIndexFromDatabaseId(getVehicleData(vehicle).ownerId)).name;
							ownerType = getLocaleString(client, "Clan");
							break;

						case AGRP_VEHOWNER_JOB:
							ownerName = getJobData(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)).name;
							ownerType = getLocaleString(client, "Job");
							break;

						case AGRP_VEHOWNER_PLAYER:
							let subAccountData = loadSubAccountFromId(getVehicleData(vehicle).ownerId);
							ownerName = `${subAccountData.firstName} ${subAccountData.lastName}`;
							ownerType = getLocaleString(client, "Player");
							break;

						case AGRP_VEHOWNER_BIZ:
							ownerName = getBusinessData(getVehicleData(vehicle).ownerId).name;
							ownerType = getLocaleString(client, "Business");
							break;

						default:
							break;
					}
					messagePlayerAlert(client, getLocaleString(client, "VehicleBelongsTo", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}${ownerName}{MAINCOLOUR}`, `{ALTCOLOUR}${ownerType}{MAINCOLOUR}`));
				}

				if (!getVehicleData(vehicle).engine) {
					if (getVehicleData(vehicle).buyPrice == 0 && getVehicleData(vehicle).rentPrice == 0) {
						if (doesPlayerHaveVehicleKeys(client, vehicle)) {
							if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "engine")) {
								messagePlayerTip(client, `This ${getVehicleName(vehicle)}'s engine is off. Press {ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "engine").key))} {MAINCOLOUR}to start it.`);
							} else {
								messagePlayerAlert(client, `This ${getVehicleName(vehicle)}'s engine is off. Use /engine to start it`);
							}
						} else {
							messagePlayerAlert(client, `This ${getVehicleName(vehicle)}'s engine is off and you don't have the keys to start it`);

						}
					}
					resetVehiclePosition(vehicle);
				}

				let currentSubAccount = getPlayerCurrentSubAccount(client);

				if (isPlayerWorking(client)) {
					if (getVehicleData(vehicle).ownerType == AGRP_VEHOWNER_JOB) {
						if (getVehicleData(vehicle).ownerId == getPlayerCurrentSubAccount(client).job) {
							getPlayerCurrentSubAccount(client).lastJobVehicle = vehicle;
							messagePlayerInfo(client, `Use /startroute to start working in this vehicle`);
						}
					}
				}

				if (isPlayerWorking(client)) {
					if (isPlayerOnJobRoute(client)) {
						if (vehicle == getPlayerJobRouteVehicle(client)) {
							stopReturnToJobVehicleCountdown(client);
						}
					}
				}
			}

			let radioStationIndex = getVehicleData(vehicle).streamingRadioStationIndex;
			if (radioStationIndex != -1) {
				if (getPlayerData(client).streamingRadioStation != radioStationIndex) {
					playRadioStreamForPlayer(client, getRadioStationData(radioStationIndex).url, true, getPlayerStreamingRadioVolume(client));
				}
			}
		}
	}
}

// ===========================================================================

function onPedEnteringVehicle(event, ped, vehicle, seat) {
	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		if (client != null) {
			onPlayerEnteringVehicle(client, vehicle, seat);
		}
	}
}

// ===========================================================================

function onPedExitingVehicle(event, ped, vehicle, seat) {
	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		if (client != null) {
			onPlayerExitingVehicle(client, vehicle, seat);
		}
	}
}

// ===========================================================================

function onPlayerEnteringVehicle(client, vehicle, seat) {

}

// ===========================================================================

function onPlayerExitingVehicle(client, vehicle, seat) {

}

// ===========================================================================