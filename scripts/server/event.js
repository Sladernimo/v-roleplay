// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: event.js
// DESC: Provides handlers for built in GTAC and Asshat-Gaming created events
// TYPE: Server (JavaScript)
// ===========================================================================

function initEventScript() {
	logToConsole(LOG_INFO, "[V.RP.Event]: Initializing event script ...");
	addAllEventHandlers();
	logToConsole(LOG_INFO, "[V.RP.Event]: Event script initialized!");
}

// ===========================================================================

function onPlayerConnect(event, ipAddress, port) {
	logToConsole(LOG_INFO, `[V.RP.Event] onPlayerConnect - Client connecting (IP: ${ipAddress})`);
	//if(isIpAddressBanned(ipAddress)) {
	//    messagePlayerError(client, "You are banned from this server!");
	//    return false;
	//}
}

// ===========================================================================

function onPlayerJoin(event, client) {
	logToConsole(LOG_INFO, `[V.RP.Event] onPlayerJoin - Client ${getPlayerDisplayForConsole(client)} joining from ${getPlayerIP(client)}`);

	playerResourceReady[getPlayerId(client)] = false;
	playerResourceStarted[getPlayerId(client)] = false;
	playerInitialized[getPlayerId(client)] = false;
	playerGUIReady[getPlayerId(client)] = false;

	serverData.clients[getPlayerId(client)] = null;

	let messageText = `👋 ${getPlayerName(client)} is connecting to the server ...`;
	messageDiscordEventChannel(messageText);

	let clients = getClients();
	for (let i in clients) {
		messagePlayerNormal(clients[i], getLocaleString(clients[i], "PlayerConnecting", getPlayerName(client)));
	}
}

// ===========================================================================

function onPlayerJoined(event, client) {
	logToConsole(LOG_INFO, `[V.RP.Event] onPlayerJoined - Client ${getPlayerDisplayForConsole(client)} joined from ${getPlayerIP(client)}`);
	//initClient(client);
}

// ===========================================================================

function onElementStreamIn(event, element, client) {
	//if(getPlayerDimension(client) != getElementDimension(element)) {
	//    event.preventDefault();
	//}

	if (getPlayerData(getClientFromIndex(element.owner)) != null) {
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
	let disconnectName = disconnectReasons[quitReasonId];

	let reasonTextEnglish = getLanguageGroupedLocaleString(englishLocale, "DisconnectReasons", disconnectName);
	let clientName = getPlayerName(client);

	if (getPlayerData(client) != null) {
		if (getPlayerData(client).customDisconnectReason != "") {
			disconnectName = getPlayerData(client).customDisconnectReason;
		}
	}

	updateConnectionLogOnQuit(client, disconnectName);

	resetClientStuff(client);

	if (isPlayerLoggedIn(client)) {
		savePlayerToDatabase(client);
	}

	if (getPlayerData(client) != null) {
		if (getPlayerData(client).loginTimeout != null) {
			clearTimeout(getPlayerData(client).loginTimeout);
		}
	}

	playerResourceReady[client.index] = false;
	playerResourceStarted[client.index] = false;
	playerInitialized[client.index] = false;
	playerGUIReady[client.index] = false;

	serverData.clients[getPlayerId(client)] = null;

	logToConsole(LOG_INFO, `👋 Client ${getPlayerDisplayForConsole(client)} disconnected (quitReasonId - ${reasonTextEnglish})`);
	//messageDiscordEventChannel(`👋 ${clientName} has left the server (${reasonTextEnglish})`);
	messageDiscordEventChannel(`👋 ${getLanguageLocaleString(englishLocale, "PlayerLeftServer", clientName, reasonTextEnglish)}`);

	getClients().filter(c => c != client).forEach(forClient => {
		messagePlayerNormal(forClient, getLocaleString(forClient, "PlayerLeftServer", clientName, getGroupedLocaleString(forClient, "DisconnectReasons", disconnectName)));
	});
}

// ===========================================================================

function onPlayerChat(event, client, messageText) {
	event.preventDefault();
	processPlayerChat(client, messageText);
}

// ===========================================================================

function onProcess(event, deltaTime) {
	logToConsole(LOG_VERBOSE, `[V.RP.Event] onProcess - Processing server tick ...`);

	//updateServerGameTime();
	//checkPlayerSpawning();
	//checkPlayerPedState();
	//checkVehicleBurning();

	processVehiclePurchasing();
	processPlayerDragging();
}

// ===========================================================================

function onEntityProcess(event, entity) {
}

// ===========================================================================

function onPedEnteringVehicle(event, ped, vehicle, seat) {
	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		getPlayerData(client).pedState = V_PEDSTATE_ENTERINGVEHICLE;

		if (getVehicleData(vehicle) == null) {
			return false;
		}

		if (getVehicleData(vehicle).locked) {
			showVehicleLockedMessageForPlayer(client, vehicle);

			//getPlayerData(client).enteringVehicle = null;
			//makePlayerStopAnimation(client);
			return false;
		}

		getPlayerData(client).enteringVehicle = vehicle;
	}
}

// ===========================================================================

function onPedExitingVehicle(event, ped, vehicle) {
	if (getVehicleData(vehicle) == null) {
		return false;
	}

	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		getPlayerData(client).pedState = V_PEDSTATE_EXITINGVEHICLE;
	}
}

// ===========================================================================

function onResourceStart(event, resource) {
	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Resource ${resource.name} started!`);

	if (resource == thisResource) {
		//messageAdmins(`{MAINCOLOUR}Resource {ALTCOLOUR}${resource.name}{MAINCOLOUR} started!`);
		messageDiscordEventChannel(`✅ Server is starting up!`);
	}
}

// ===========================================================================

function onResourceStop(event, resource) {
	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Resource ${resource.name} stopped!`);

	//if(resource != thisResource) {
	//	messageAdmins(`{MAINCOLOUR}Resource {ALTCOLOUR}${resource.name}{MAINCOLOUR} stopped!`);
	//}

	if (resource == thisResource) {
		kickAllClients();
		saveServerDataToDatabase();
		disconnectFromDatabase(persistentDatabaseConnection, true);
		//collectAllGarbage();

		messageDiscordEventChannel(`⛔ Server is shutting down!`);
	}
}

// ===========================================================================

function onPedEnteredSphere(event, ped, sphere) {
	logToConsole(LOG_WARN | LOG_VERBOSE, `[V.RP.Event] OnPedEnteredSphere event called`);

	if (ped == null) {
		return false;
	}

	if (sphere == null) {
		return false;
	}

	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} entered sphere ${sphere.id}!`);
	//if (ped.isType(ELEMENT_PLAYER)) {
	//	let client = getClientFromPlayerElement(ped);

	// Handled client-side since server spheres aren't showing on GTAC atm (bug)
	//if (isPlayerOnJobRoute(client)) {
	//	if (sphere == getJobRouteLocationData(getPlayerJob(client), getPlayerJobRoute(client), getPlayerJobRouteLocation(client)).marker) {
	//		playerArrivedAtJobRouteLocation(client);
	//	}
	//}
	//}
}

// ===========================================================================

function onPedExitedSphere(event, ped, sphere) {
	logToConsole(LOG_WARN | LOG_VERBOSE, `[V.RP.Event] OnPedExitedSphere event called`);

	if (ped == null) {
		return false;
	}

	if (sphere == null) {
		return false;
	}

	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} exited sphere ${sphere.id}!`);
	//if (ped.isType(ELEMENT_PLAYER)) {
	//	let client = getClientFromPlayerElement(ped);
	//}
}

// ===========================================================================

function onPedPickupPickedUp(event, ped, pickup) {
	logToConsole(LOG_WARN | LOG_VERBOSE, `[V.RP.Event] OnPedPickupPickedUp event called`);

	if (ped == null) {
		return false;
	}

	if (pickup == null) {
		return false;
	}

	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} picked up pickup ${pickup.id}!`);

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

/*
function onPedWasted(event, ped, killerPed, weapon, pedPiece) {
	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} wasted by ped ${killerPed.id}!`);

	if (ped.isType(ELEMENT_PLAYER)) {
		let killerClient = null;
		if (killerPed != null && killerPed.type == ELEMENT_PLAYER) {
			killerClient = getClientFromPlayerElement(killerPed);
		}
		onPlayerWasted(getClientFromPlayerElement(ped), killerClient, weapon, pedPiece);
	}
}
*/

// ===========================================================================

function onPedSpawn(ped) {
	logToConsole(LOG_WARN | LOG_VERBOSE, `[V.RP.Event] OnPedSpawn event called`);

	if (ped != null) {
		return false;
	}

	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} spawned!`);

	//if (ped.type == ELEMENT_PLAYER) {
	//	if (getGame() != V_GAME_MAFIA_ONE) {
	//		//setTimeout(onPlayerSpawn, 250, getClientFromPlayerElement(ped));
	//		//onPlayerSpawn(getClientFromPlayerElement(ped));
	//	}
	//}
}

// ===========================================================================

function onPlayerSpawn(client) {
	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Player ${getPlayerDisplayForConsole(client)} spawned!`);

	//if (isGameFeatureSupported("serverElements")) {
	//	waitUntil(() => client != null && getPlayerPed(client) != null);
	//}

	stopRadioStreamForPlayer(client);

	if (getPlayerData(client) == null) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] ${getPlayerDisplayForConsole(client)}'s player data is invalid. Kicking them from server.`);
		getPlayerData(targetClient).customDisconnectReason = "Desync";
		disconnectPlayer(client);
		return false;
	}

	if (!isPlayerLoggedIn(client)) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] ${getPlayerDisplayForConsole(client)} is NOT logged in. Despawning their player.`);
		getPlayerData(targetClient).customDisconnectReason = "Desync";
		disconnectPlayer(client);
		return false;
	}

	if (getPlayerData(client).currentSubAccount == -1) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] ${getPlayerDisplayForConsole(client)} has NOT selected a character. Despawning their player.`);
		getPlayerData(targetClient).customDisconnectReason = "Desync";
		disconnectPlayer(client);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Event] ${getPlayerDisplayForConsole(client)}'s player data is valid. Continuing spawn processing ...`);

	//if (getGame != V_GAME_MAFIA_ONE && (getPlayerData(client).pedState == V_PEDSTATE_ENTERINGPROPERTY || getPlayerData(client).pedState == V_PEDSTATE_EXITINGPROPERTY)) {
	//	logToConsole(LOG_DEBUG, `[V.RP.Event] ${getPlayerDisplayForConsole(client)} does not need to initialize spawn (entering/exiting property). Aborting spawn processing ...`);
	//	return false;
	//}

	if (isGameFeatureSupported("pedScale")) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Setting ${getPlayerDisplayForConsole(client)}'s ped scale (${getPlayerCurrentSubAccount(client).pedScale})`);
		setEntityData(getPlayerPed(client), "v.rp.scale", getPlayerCurrentSubAccount(client).pedScale, true);
	}

	if (isGameFeatureSupported("customCamera")) {
		restorePlayerCamera(client);
	}

	if (isGameFeatureSupported("serverElements")) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Storing ${getPlayerDisplayForConsole(client)} ped in client data`);
		getPlayerData(client).ped = getPlayerPed(client);
	}

	if (getPlayerData(client).spawnInit == false) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Sending ${getPlayerDisplayForConsole(client)} the 'now playing as' message`);
		messagePlayerAlert(client, `You are now playing as: {businessBlue}${getCharacterFullName(client)}`, getColourByName("white"));
	}

	if (isGameFeatureSupported("interiorId") && (getPlayerCurrentSubAccount(client).interior != getPlayerInterior(client))) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Setting player interior for ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).interior}`);
		setPlayerInterior(client, getPlayerCurrentSubAccount(client).interior);
	}

	if (isGameFeatureSupported("dimension") && (getPlayerCurrentSubAccount(client).dimension != getPlayerDimension(client))) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Setting player dimension for ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).dimension}`);
		setPlayerDimension(client, getPlayerCurrentSubAccount(client).dimension);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Event] Setting player health for ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).health}`);
	setPlayerHealth(client, getPlayerCurrentSubAccount(client).health);

	if (isGameFeatureSupported("pedArmour")) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Setting player armour for ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).armour}`);
		setPlayerArmour(client, getPlayerCurrentSubAccount(client).armour);
	}

	if (isGameFeatureSupported("serverElements") && isGameFeatureSupported("pedWalkStyle")) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Setting player walking style for ${getPlayerDisplayForConsole(client)}`);
		setEntityData(getPlayerPed(client), "v.rp.walkStyle", getPlayerCurrentSubAccount(client).walkStyle, true);
	}

	if (isGameFeatureSupported("serverElements") && isGameFeatureSupported("pedFightStyle")) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Setting player fighting style for ${getPlayerDisplayForConsole(client)}`);
		setEntityData(getPlayerPed(client), "v.rp.fightStyle", getPlayerCurrentSubAccount(client).fightStyle, true);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Event] Setting ${getPlayerDisplayForConsole(client)}'s switchchar state to false`);
	getPlayerData(client).switchingCharacter = false;

	cachePlayerHotBarItems(client);
	updatePlayerCash(client);
	updatePlayerHotBar(client);
	updatePlayerKeyBinds(client);
	updatePlayerChatBoxStates(client);
	updateAllPlayerNameTags();
	setPlayerWeaponDamageEvent(client, V_WEAPON_DAMAGE_EVENT_NORMAL);
	updateJobBlipsForPlayer(client);
	sendPlayerJobType(client, (getPlayerCurrentSubAccount(client).job != 0) ? getPlayerCurrentSubAccount(client).jobIndex : -1);

	if (isGameFeatureSupported("rendering2D")) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Enabling all rendering states for ${getPlayerDisplayForConsole(client)}`);
		setPlayer2DRendering(client, true, true, true, true, true, true);

		logToConsole(LOG_DEBUG, `[V.RP.Event] Updating logo state for ${getPlayerDisplayForConsole(client)}`);
		updatePlayerShowLogoState(client, (serverConfig.showLogo && doesPlayerHaveLogoEnabled(client)));
	}

	if (isGTAIV()) {
		setPlayerPedPartsAndProps(client);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Event] Setting ${getPlayerDisplayForConsole(client)}'s ped state to ready`);
	getPlayerData(client).pedState = V_PEDSTATE_READY;

	if (isGameFeatureSupported("serverElements")) {
		syncPlayerProperties(client);
	}

	if (isGameFeatureSupported("customNametag")) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Sending player nametag distance to ${getPlayerDisplayForConsole(client)}`);
		sendNameTagDistanceToClient(client, serverConfig.nameTagDistance);
	}

	if (!isGameFeatureSupported("serverElements") || (!isGameFeatureSupported("pickup") && !isGameFeatureSupported("dummyElement"))) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Sending properties, jobs, and vehicles to ${getPlayerDisplayForConsole(client)} (no server elements)`);
		sendAllBusinessesToPlayer(client);
		sendAllHousesToPlayer(client);
		sendAllPayPhonesToPlayer(client);
		sendAllJobsToPlayer(client);
		//requestPlayerPedNetworkId(client);
	}

	if (!isGameFeatureSupported("serverElements")) {
		sendAllVehiclesToPlayer(client);
	}

	getPlayerData(client).payDayTickStart = sdl.ticks;

	if (getGame() == V_GAME_GTA_IV) {
		showServerInDevelopmentMessage(client);
	}

	showPlayerRegionalLanguageOffer(client);

	if (isGameFeatureSupported("serverElements") && isGameFeatureSupported("perElementStreamDistance")) {
		if (globalConfig.playerStreamInDistance == -1 || globalConfig.playerStreamOutDistance == -1) {
			//getPlayerPed(client).netFlags.distanceStreaming = false;
			setElementStreamInDistance(getPlayerPed(client), 99999);
			setElementStreamOutDistance(getPlayerPed(client), 99999);
		} else {
			setElementStreamInDistance(getPlayerPed(client), serverConfig.playerStreamInDistance);
			setElementStreamOutDistance(getPlayerPed(client), serverConfig.playerStreamOutDistance);
		}

		resetPlayerBlip(client);
	}

	// Radio stuff must be last thing sent to client because it hangs the client for a second, which blocks processing of other incoming packets
	// Start playing business/house radio if in one
	if (getPlayerDimension(client) != gameData.mainWorldDimension[getGame()]) {
		let businessId = getPlayerBusiness(client);
		let houseId = getPlayerHouse(client);
		if (businessId != -1) {
			if (getRadioStationData(getBusinessData(businessId).streamingRadioStation) != null) {
				playRadioStreamForPlayer(client, getRadioStationData(getBusinessData(businessId).streamingRadioStation).url, true, getPlayerStreamingRadioVolume(client), null);
			}
		} else if (houseId != -1) {
			if (getRadioStationData(getHouseData(houseId).streamingRadioStation) != null) {
				playRadioStreamForPlayer(client, getRadioStationData(getHouseData(houseId).streamingRadioStation).url, true, getPlayerStreamingRadioVolume(client), null);
			}
		} else {
			stopRadioStreamForPlayer(client);
		}
	}

	logToConsole(LOG_DEBUG, `[V.RP.Event] Updating spawned state for ${getPlayerDisplayForConsole(client)} to true`);
	updatePlayerSpawnedState(client, true);

	getPlayerData(client).spawnInit = true;

	messageDiscordEventChannel(`🧍 ${getPlayerName(client)} spawned as ${getCharacterFullName(client)}`);
}

// ===========================================================================

function onPlayerCommand(event, client, command, params) {
	logToConsole(LOG_WARN | LOG_VERBOSE, `[V.RP.Event] OnPlayerCommand event called`);

	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Player used command ${command}!`);

	if (!doesCommandExist(command)) {
		processPlayerCommand(command, params, client);
	}
}

// ===========================================================================

function onPedExitedVehicle(event, ped, vehicle, seat) {
	logToConsole(LOG_WARN | LOG_VERBOSE, `[V.RP.Event] OnPedExitedVehicle event called`);

	if (ped == null) {
		return false;
	}

	if (vehicle == null) {
		return false;
	}

	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} exited vehicle ${vehicle.id} from seat ${seat}!`);

	if (getVehicleData(vehicle) == null) {
		return false;
	}

	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		if (client != null) {
			getPlayerData(client).pedState = V_PEDSTATE_READY;

			if (getVehicleData(vehicle).spawnLocked == false && canPlayerManageVehicle(client, vehicle) == true) {
				getVehicleData(vehicle).spawnPosition = getVehiclePosition(vehicle);
				getVehicleData(vehicle).spawnRotation = getVehicleHeading(vehicle);
				getVehicleData(vehicle).needsSaved = true;
			}

			stopRadioStreamForPlayer(client);

			if (getVehicleData(vehicle) == null) {
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

			logToConsole(LOG_DEBUG, `[V.RP.Event] ${getPlayerDisplayForConsole(client)} exited a ${getVehicleName(vehicle)} (ID: ${getVehicleDataIndexFromVehicle(vehicle)}, Database ID: ${getVehicleData(vehicle).databaseId})`);
		}
	}
}

// ===========================================================================

function onPedEnteredVehicle(event, ped, vehicle, seat) {
	logToConsole(LOG_WARN | LOG_VERBOSE, `[V.RP.Event] OnPedEnteredVehicle event called`);

	if (ped == null) {
		logToConsole(LOG_ERROR | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} entered vehicle ${vehicle.id} in seat ${seat}, but ped is null`);
		return false;
	}

	if (vehicle == null) {
		logToConsole(LOG_ERROR | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} entered vehicle ${vehicle.id} in seat ${seat}, but vehicle is null`);
		return false;
	}

	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} entered vehicle ${vehicle.id} in seat ${seat}!`);

	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		if (client != null) {
			if (getPlayerData(client) == null) {
				logToConsole(LOG_ERROR | LOG_DEBUG, `[V.RP.Event] ${getPlayerDisplayForConsole(client)} entered vehicle ${vehicle.id} in seat ${seat}, but player data is false`);
				return false;
			}

			if (getVehicleData(vehicle) == null) {
				logToConsole(LOG_ERROR | LOG_DEBUG, `[V.RP.Event] ${getPlayerDisplayForConsole(client)} entered vehicle ${vehicle.id} in seat ${seat}, but vehicle data is false`);
				return false;
			}

			logToConsole(LOG_DEBUG, `[V.RP.Event] ${getPlayerDisplayForConsole(client)} entered a ${getVehicleName(vehicle)} (ID: ${getVehicleDataIndexFromVehicle(vehicle)}, Database ID: ${getVehicleData(vehicle).databaseId})`);

			getPlayerData(client).lastVehicle = vehicle;
			getPlayerData(client).vehicleSeat = seat;
			getVehicleData(vehicle).lastActiveTime = getCurrentUnixTimestamp();

			if (seat == V_VEHSEAT_DRIVER) {
				vehicle.engine = getVehicleData(vehicle).engine;
				setEntityData(vehicle, "v.rp.engine", getVehicleData(vehicle).engine, true);
				//vehicle.netFlags.sendSync = getVehicleData(vehicle).engine;

				if (getVehicleData(vehicle).buyPrice > 0) {
					messagePlayerAlert(client, getLocaleString(client, "VehicleForSale", getVehicleName(vehicle), `{ALTCOLOUR}${getCurrencyString(applyServerInflationMultiplier(getVehicleData(vehicle).buyPrice))}{MAINCOLOUR}`, `{ALTCOLOUR}/vehbuy{MAINCOLOUR}`));
					resetVehiclePosition(vehicle);
				} else if (getVehicleData(vehicle).rentPrice > 0) {
					if (getVehicleData(vehicle).rentedBy != client) {
						messagePlayerAlert(client, getLocaleString(client, "VehicleForRent", getVehicleName(vehicle), `{ALTCOLOUR}${getCurrencyString(applyServerInflationMultiplier(getVehicleData(vehicle).rentPrice))}{MAINCOLOUR}`, `{ALTCOLOUR}/vehrent{MAINCOLOUR}`));
						resetVehiclePosition(vehicle);
					} else {
						messagePlayerAlert(client, getLocaleString(client, "CurrentlyRentingThisVehicle", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}${getCurrencyString(applyServerInflationMultiplier(getVehicleData(vehicle).rentPrice))}`, `{ALTCOLOUR}/stoprent{MAINCOLOUR}`));
					}
				} else {
					let ownerName = "Nobody";
					let ownerType = getLocaleString(client, "NotOwned");
					ownerType = toLowerCase(getVehicleOwnerTypeText(getVehicleData(vehicle).ownerType));
					switch (getVehicleData(vehicle).ownerType) {
						case V_VEH_OWNER_CLAN:
							ownerName = getClanData(getClanIndexFromDatabaseId(getVehicleData(vehicle).ownerId)).name;
							ownerType = getLocaleString(client, "Clan");
							break;

						case V_VEH_OWNER_JOB:
							ownerName = getJobData(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)).name;
							ownerType = getLocaleString(client, "Job");
							break;

						case V_VEH_OWNER_PLAYER:
							let subAccountData = loadSubAccountFromId(getVehicleData(vehicle).ownerId);
							ownerName = `${subAccountData.firstName} ${subAccountData.lastName}`;
							ownerType = getLocaleString(client, "Player");
							break;

						case V_VEH_OWNER_BIZ:
							ownerName = getBusinessData(getBusinessIndexFromDatabaseId(getVehicleData(vehicle).ownerId)).name;
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
					if (getVehicleData(vehicle).ownerType == V_VEH_OWNER_JOB) {
						if (getVehicleData(vehicle).ownerId == getPlayerCurrentSubAccount(client).job) {
							if (doesJobLocationHaveAnyRoutes(getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)))) {
								getPlayerCurrentSubAccount(client).lastJobVehicle = vehicle;
								if (!hasPlayerSeenActionTip(client, "JobRouteStart")) {
									messagePlayerInfo(client, getGroupedLocaleString(client, "ActionTips", "JobRouteStart", `{ALTCOLOUR}/startroute{MAINCOLOUR}`));
								}
							}
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
	} else {
		let clients = getClients();
		for (let i in clients) {
			if (ped == getPlayerData(clients[i]).jobRouteLocationElement) {
				playerArrivedAtJobRouteLocation(clients[i]);
			}
		}
	}
}

// ===========================================================================

function onPedEnteringVehicle(event, ped, vehicle, seat) {
	logToConsole(LOG_WARN | LOG_VERBOSE, `[V.RP.Event] OnPedEnteringVehicle event called`);

	if (ped == null) {
		return false;
	}

	if (vehicle == null) {
		return false;
	}

	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} is entering vehicle ${vehicle.id} in seat ${seat}!`);

	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		if (client != null) {
			if (seat == V_VEHSEAT_DRIVER) {
				//vehicle.netFlags.sendSync = getVehicleData(vehicle).engine;
			}
			onPlayerEnteringVehicle(client, vehicle, seat);
		}
	}
}

// ===========================================================================

function onPedExitingVehicle(event, ped, vehicle, seat) {
	logToConsole(LOG_WARN | LOG_VERBOSE, `[V.RP.Event] OnPedExitingVehicle event called`);

	if (ped == null) {
		return false;
	}

	if (vehicle == null) {
		return false;
	}

	logToConsole(LOG_WARN | LOG_DEBUG, `[V.RP.Event] Ped ${ped.id} is exiting vehicle ${vehicle.id} in seat ${seat}!`);

	if (ped.isType(ELEMENT_PLAYER)) {
		let client = getClientFromPlayerElement(ped);
		if (client != null) {
			if (getPlayerData(client) != null) {
				getPlayerData(client).vehicleSeat = -1;
			}

			if (seat == V_VEHSEAT_DRIVER) {
				//vehicle.netFlags.sendSync = getVehicleData(vehicle).engine;
			}
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

function onPedFall(ped) {
	//if (ped.isType(ELEMENT_PLAYER)) {
	//	let client = getClientFromPlayerElement(ped);
	//	if (client != null) {
	//		processPlayerDeath(client);
	//	}
	//}
}

// ===========================================================================

function onPlayerDeath(event, client) {
	processPlayerDeath(client);
}

// ===========================================================================