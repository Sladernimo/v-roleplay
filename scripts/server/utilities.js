// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: utilities.js
// DESC: Provides util functions and arrays with data
// TYPE: Server (JavaScript)
// ===========================================================================

function getPositionArea(position) {
	if (typeof position == "Vec3") {
		position = vec3ToVec2(position);
	}

	let gameAreas = getGameAreas(getGame());
	for (let i in gameAreas) {
		if (isPositionInArea(position, gameAreas[i][1])) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getAreaName(position) {
	let areaId = getPositionArea(position);
	if (!areaId) {
		return false;
	}

	return getGameAreas()[areaId][0];
}

// ===========================================================================

function getGameAreas(gameId) {
	return gameData.areas[gameId];
}

// ===========================================================================

/**
 * @param {Client} client - The client
 * @return {ClientData} The player/client's data (class instancee)
 */
function getPlayerData(client) {
	if (client == null) {
		return false;
	}

	if (!isClientInitialized(client)) {
		return false;
	}

	if (typeof serverData.clients[getPlayerId(client)] == "undefined") {
		return false;
	}

	return serverData.clients[getPlayerId(client)];
}

// ===========================================================================

function initAllClients() {
	getClients().forEach(function (client) {
		initClient(client);
	});
}

// ===========================================================================

function updateServerRules() {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities]: Updating all server rules ...`);

	let timeWeatherRule = [];
	let tempText = "";

	if (isTimeSupported()) {
		if (getServerConfig() != false) {
			tempText = makeReadableTime(serverConfig.hour, serverConfig.minute);
			timeWeatherRule.push(tempText);
		}
	} else {
		if (getGame() == V_GAME_MAFIA_ONE) {
			if (isNightTime(serverConfig.hour)) {
				tempText = "Night";
			} else {
				tempText = "Day";
			}

			timeWeatherRule.push(tempText);
		}
	}

	if (isWeatherSupported()) {
		if (getServerConfig() != false) {
			if (getWeatherData(serverConfig.weather) != false) {
				let tempText = getWeatherData(serverConfig.weather).name;
				timeWeatherRule.push(tempText);
			}
		}
	}

	if (isSnowSupported()) {
		if (getServerConfig() != false) {
			if (serverConfig.fallingSnow == true) {
				timeWeatherRule.push("Snowing");
			}
		}
	}

	setServerRule("Time & Weather", timeWeatherRule.join(", "));
	logToConsole(LOG_DEBUG, `[V.RP.Utilities]: All server rules updated successfully!`);
}

// ===========================================================================

function getWeatherFromParams(params) {
	if (isNaN(params)) {
		for (let i in gameData.weather[getGame()]) {
			if (toLowerCase(gameData.weather[getGame()][i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		for (let i in gameData.weather[getGame()]) {
			if (typeof gameData.weather[getGame()][i].weatherId != "undefined") {
				return toInteger(i);
			}
		}
	}

	return false;
}

// ===========================================================================

function getFightStyleFromParams(params) {
	if (isNaN(params)) {
		for (let i in gameData.fightStyles[getGame()]) {
			if (toLowerCase(gameData.fightStyles[getGame()][i][0]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof gameData.fightStyles[getGame()][params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

function getClosestHospital(position) {
	if (typeof gameData.hospitals[getGame()] == "undefined") {
		return { position: serverConfig.newCharacter.spawnPosition };
	} else {
		let closest = 0;
		for (let i in gameData.hospitals[getGame()]) {
			if (getDistance(gameData.hospitals[getGame()][i].position, position) < getDistance(gameData.hospitals[getGame()][closest].position, position)) {
				closest = i;
			}
		}

		return gameData.hospitals[getGame()][closest];
	}
}

// ===========================================================================

function getClosestPoliceStation(position) {
	if (typeof gameData.policeStations[getGame()] == "undefined") {
		return { position: serverConfig.newCharacter.spawnPosition };
	} else {
		let closest = 0;
		for (let i in gameData.policeStations[getGame()]) {
			if (getDistance(gameData.policeStations[getGame()][i].position, position) < getDistance(gameData.policeStations[getGame()][closest].position, position)) {
				closest = i;
			}
		}

		return gameData.policeStations[getGame()][closest];
	}
}

// ===========================================================================

function getPlayerDisplayForConsole(client) {
	if (isNull(client)) {
		return "(Unknown client/all clients)";
	}
	return `${getPlayerName(client)}[${getPlayerId(client)}]`;
}

// ===========================================================================

function getPlayerNameForNameTag(client) {
	if (isPlayerSpawned(client)) {
		return `${getPlayerCurrentSubAccount(client).firstName} ${getPlayerCurrentSubAccount(client).lastName}`;
	}
	return getPlayerName(client);
}

// ===========================================================================

function isPlayerSpawned(client) {
	if (!getPlayerData(client)) {
		return false;
	}
	return getPlayerData(client).spawned;
}

// ===========================================================================

function getPlayerIsland(client) {
	return getIsland(getPlayerPosition(client));
}

// ===========================================================================

function isAtPayAndSpray(position) {
	for (let i in gameData.payAndSprays[getGame()]) {
		if (getDistance(position, gameData.payAndSprays[getGame()][i]) <= globalConfig.payAndSprayDistance) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getPlayerFromCharacterId(subAccountId) {
	let clients = getClients();
	for (let i in clients) {
		for (let j in getPlayerData(clients[i]).subAccounts) {
			if (getPlayerData(clients[i]).subAccounts[j].databaseId == subAccountId) {
				return clients[i];
			}
		}
	}

	return false;
}

// ===========================================================================

function checkPlayerPedStates() {
	let clients = getClients();
	for (let i in clients) {
		if (getPlayerData(clients[i])) {
			if (getPlayerData(clients[i]).pedState) {
				if (isPlayerInAnyVehicle(clients[i])) {
					if (getPlayerData(clients[i]).pedState == V_PEDSTATE_EXITINGVEHICLE) {
						getPlayerData(clients[i]).pedState == V_PEDSTATE_READY;
					}
				}
			}
		}
	}
}

// ===========================================================================

function showConnectCameraToPlayer(client) {
	if (isFadeCameraSupported()) {
		fadePlayerCamera(client, true, 1000);
	}

	if (isCustomCameraSupported()) {
		//setPlayerInterior(client, 0);
		//setPlayerDimension(client, 0);
		setPlayerCameraLookAt(client, serverConfig.connectCameraPosition, serverConfig.connectCameraLookAt);
	}
	setPlayer2DRendering(client, false, false, false, false, false, false);
}

// ===========================================================================

function showCharacterSelectCameraToPlayer(client) {
	setPlayerCameraLookAt(client, serverConfig.characterSelectCameraPosition, serverConfig.characterSelectCameraPosition);
}

// ===========================================================================

function getClosestPlayer(position, exemptPlayer) {
	let clients = getClients();
	let closest = 0;
	for (let i in clients) {
		if (exemptPlayer != clients[i]) {
			if (getDistance(getPlayerPosition(clients[i]), position) < getDistance(getPlayerPosition(clients[closest]), position)) {
				closest = i;
			}
		}
	}
	return clients[closest];
}

// ===========================================================================

function isPlayerMuted(client) {
	return hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("Muted"));
}

// ===========================================================================

function getPlayerFromParams(params) {
	let clients = getClients();
	if (isNaN(params)) {
		for (let i in clients) {
			if (!clients[i].console) {
				if (toLowerCase(clients[i].name).indexOf(toLowerCase(params)) != -1) {
					return clients[i];
				}

				if (toLowerCase(getCharacterFullName(clients[i])).indexOf(toLowerCase(params)) != -1) {
					return clients[i];
				}
			}
		}
	} else {
		if (typeof clients[toInteger(params)] != "undefined") {
			return clients[toInteger(params)];
		}
	}

	return false;
}

// ===========================================================================

function updateConnectionLogOnQuit(client) {
	if (getPlayerData(client) != false) {
		quickDatabaseQuery(`UPDATE conn_main SET conn_when_disconnect=NOW() WHERE conn_id = ${getPlayerData(client).sessionId}`);
	}
}

// ===========================================================================

function updateConnectionLogOnAuth(client, authId) {
	quickDatabaseQuery(`UPDATE conn_main SET conn_auth=${authId} WHERE conn_id = ${getPlayerData(client).sessionId}`);
}

// ===========================================================================

function updateConnectionLogOnClientInfoReceive(client, clientVersion, screenWidth, screenHeight) {
	if (getPlayerData(client) != false) {
		getPlayerData(client).clientVersion = clientVersion;
	}

	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeClientVersion = escapeDatabaseString(dbConnection, clientVersion);
		let safeScreenWidth = escapeDatabaseString(dbConnection, toString(screenWidth));
		let safeScreenHeight = escapeDatabaseString(dbConnection, toString(screenHeight));
		quickDatabaseQuery(`UPDATE conn_main SET conn_client_version='${safeClientVersion}', conn_screen_width='${safeScreenWidth}', conn_screen_height='${safeScreenHeight}' WHERE conn_id = ${getPlayerData(client).sessionId}`);
	}
}

// ===========================================================================

function generateRandomPhoneNumber() {
	return getRandom(100000, 999999);
}

// ===========================================================================

function doesNameContainInvalidCharacters(name) {
	let disallowedCharacters = globalConfig.subAccountNameAllowedCharacters;
	name = toLowerCase(name);
	for (let i = 0; i < name.length; i++) {
		if (disallowedCharacters.toLowerCase().indexOf(name.charAt(i)) == -1) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getClientFromSyncerId(syncerId) {
	return getClients().filter(c => c.index == syncerId)[0];
}

// ===========================================================================

function clearTemporaryVehicles() {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for (let i in vehicles) {
		if (!getVehicleData(vehicles[i])) {
			let occupants = vehicles[i].getOccupants();
			for (let j in occupants) {
				destroyGameElement(occupants[j]);
			}
			destroyGameElement(vehicles[i]);
		}
	}
}

// ===========================================================================

function clearTemporaryPeds() {
	let peds = getElementsByType(ELEMENT_PED);
	for (let i in peds) {
		if (peds[i].owner == -1) {
			if (!peds[i].isType(ELEMENT_PLAYER)) {
				if (peds[i].vehicle == null) {
					if (!getNPCData(peds[i])) {
						destroyElement(peds[i]);
					}
				}
			}
		}
	}
}

// ===========================================================================

function isClientInitialized(client) {
	//if (typeof serverData.clients[getPlayerId(client)] == "undefined") {
	//	return false;
	//}

	if (playerInitialized[getPlayerId(client)] == true) {
		return true;
	}

	return false;
}

// ===========================================================================

function getPedForNetworkEvent(ped) {
	//if (getGame() == V_GAME_GTA_IV) {
	//	return ped;
	//} else {
	//	return ped.id;
	//}

	return ped.id;
}

// ===========================================================================

// Get how many times a player connected in the last month by name
function getPlayerConnectionsInLastMonthByName(name) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, name);
		let result = quickDatabaseQuery(`SELECT COUNT(*) AS count FROM conn_main WHERE conn_when_connect >= NOW() - INTERVAL 1 MONTH AND conn_name = '${safeName}'`);
		if (result) {
			return result[0].count;
		}
	}

	return 0;
}

// ===========================================================================

function addPrefixNumberFill(number, amount) {
	let numberString = toString(number);
	while (numberString.length < amount) {
		numberString = toString(`0${numberString}`);
	}
	return toString(numberString);
}

// ===========================================================================

function updateAllPlayerWeaponDamageStates() {
	let clients = getClients();
	for (let i in players) {
		if (isPlayerLoggedIn(clients[i]) && isPlayerSpawned(clients[i])) {
			setPlayerWeaponDamageEvent(clients[i], getPlayerData(clients[i]).weaponDamageEvent);
		}
	}
}

// ===========================================================================

function removeAllPlayersFromProperties() {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerInAnyBusiness(clients[i])) {
			removePlayerFromBusiness(clients[i]);
		}

		if (isPlayerInAnyHouse(clients[i])) {
			removePlayerFromHouse(clients[i]);
		}
	}
	return false;
}

// ===========================================================================

function removeAllPlayersFromVehicles() {
	let clients = getClients();
	for (let i in clients) {
		if (isPlayerInAnyVehicle(clients[i])) {
			removePedFromVehicle(getPlayerPed(clients[i]));
		}
	}
	return false;
}

// ===========================================================================

function processPlayerSceneSwitch(client, spawn = false) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities]: Processing scene switch for player ${getPlayerDisplayForConsole(client)} ...`);

	/*
	let position = toVector3(0.0, 0.0, 0.0);
	let rotation = 0.0;
	let dimension = 0;
	let interior = 0;

	if (getPlayerData(client).pedState != V_PEDSTATE_ENTERINGPROPERTY && getPlayerData(client).pedState != V_PEDSTATE_EXITINGPROPERTY) {
		position = getPlayerCurrentSubAccount(client).spawnPosition;
		rotation = getPlayerCurrentSubAccount(client).spawnHeading;
		dimension = getPlayerCurrentSubAccount(client).dimension;
		interior = getPlayerCurrentSubAccount(client).interior;
	}
	*/

	if (spawn == true) {
		let skin = gameData.skins[getGame()][getPlayerCurrentSubAccount(client).skin][0];
		if (isPlayerWorking(client)) {
			if (getPlayerData(client).jobUniform != -1) {
				skin = gameData.skins[getGame()][getPlayerData(client).jobUniform][0];
			}
		}

		logToConsole(LOG_DEBUG, `[V.RP.Utilities]: Spawning ped after scene switch for player ${getPlayerDisplayForConsole(client)} (Interior: ${getPlayerCurrentSubAccount(client).scene}, Game: ${getSceneForInterior(getPlayerCurrentSubAccount(client).scene)}). ...`);
		spawnPlayer(client, getPlayerCurrentSubAccount(client).spawnPosition, getPlayerCurrentSubAccount(client).spawnHeading, skin);
		setPlayerControlState(client, false);
	} else {
		// Set interior before position
		if (isGameFeatureSupported("interior")) {
			logToConsole(LOG_DEBUG, `[V.RP.Utilities]: Setting interior for player ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).interior}`);
			setPlayerInterior(client, getPlayerCurrentSubAccount(client).interior);
		}

		setPlayerPosition(client, getPlayerCurrentSubAccount(client).spawnPosition);
		setPlayerHeading(client, getPlayerCurrentSubAccount(client).spawnHeading);
	}

	if (isGameFeatureSupported("dimension")) {
		logToConsole(LOG_DEBUG, `[V.RP.Utilities]: Setting dimension for player ${getPlayerDisplayForConsole(client)} to ${getPlayerCurrentSubAccount(client).dimension}`);
		setPlayerDimension(client, getPlayerCurrentSubAccount(client).dimension);
	}

	setTimeout(function () {
		if (spawn == false) {
			if (isFadeCameraSupported()) {
				logToConsole(LOG_DEBUG, `[V.RP.Utilities]: Fading camera IN for player ${getPlayerDisplayForConsole(client)}`);
				fadePlayerCamera(client, true, 1000);
			}
		}

		logToConsole(LOG_DEBUG, `[V.RP.Utilities]: Setting interior lights ${getOnOffFromBool(getPlayerData(client).interiorLights)} for player ${getPlayerDisplayForConsole(client)}`);
		updateInteriorLightsForPlayer(client, getPlayerData(client).interiorLights);

		if (getPlayerData(client).inPaintBall) {
			startPaintBall(client);
		}

		setTimeout(function () {
			logToConsole(LOG_DEBUG, `[V.RP.NetEvents] Enabling all rendering states for player ${getPlayerDisplayForConsole(client)} since map switch finished`);

			if (getPlayerCurrentSubAccount(client).spawnVehicle != -1) {
				if (serverData.vehicles[getPlayerCurrentSubAccount(client).spawnVehicle].vehicle != null) {
					warpPedIntoVehicle(getPlayerPed(client), serverData.vehicles[getPlayerCurrentSubAccount(client).spawnVehicle].vehicle, getPlayerCurrentSubAccount(client).spawnVehicleSeat);
				}
			}

			if (spawn == true) {
				onPlayerSpawn(client);
			}

			setPlayerControlState(client, true);

			// Clear some scene switching states
			getPlayerCurrentSubAccount(client).spawnVehicle = -1;
			getPlayerCurrentSubAccount(client).spawnVehicleSeat = -1;

			getPlayerData(client).pedState = V_PEDSTATE_READY;
		}, 500);
	}, 1000);
}

// ===========================================================================

function getPlayerCountryISOCode(client) {
	if (getPlayerIP(client) == "127.0.0.1" || getPlayerIP(client).indexOf("192.168.") != -1) {
		return "US";
	}

	return module.geoip.getCountryISO(globalConfig.geoIPCountryDatabaseFilePath, getPlayerIP(client));
}

// ===========================================================================

function exportAllFunctions() {
	exportFunction("forceAllVehicleEngines", forceAllVehicleEngines);
	exportFunction("doesPlayerHaveStaffPermission", doesPlayerHaveStaffPermission);
	exportFunction("getStaffFlagValue", getStaffFlagValue);
}

// ===========================================================================