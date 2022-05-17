// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: utilities.js
// DESC: Provides util functions and arrays with data
// TYPE: Server (JavaScript)
// ===========================================================================



// ===========================================================================

function getPositionArea(position) {
	if(typeof position == "Vec3") {
		position = vec3ToVec2(position);
	}

	let gameAreas = getGameAreas(getGame());
	for(let i in gameAreas) {
		if(isPositionInArea(position, gameAreas[i][1])) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getAreaName(position) {
	let areaId = getPositionArea(position);
	if(!areaId) {
		return false;
	}

	return getGameAreas()[areaId][0];
}

// ===========================================================================

function getGameAreas(gameId) {
	return getGameConfig().areas[gameId];
}

// ===========================================================================

/**
 * @param {Client} client - The client
 * @return {ClientData} The player/client's data (class instancee)
 */
function getPlayerData(client) {
	if(client != null) {
		if(isClientInitialized(client)) {
			return getServerData().clients[getPlayerId(client)];
		}
	}
	return false;
}

// ===========================================================================

function initAllClients() {
	getClients().forEach(function(client) {
		initClient(client);
	});
}

// ===========================================================================

function updateServerRules() {
	logToConsole(LOG_DEBUG, `[VRR.Utilities]: Updating all server rules ...`);

	logToConsole(LOG_DEBUG, `[VRR.Utilities]: Time support: ${isTimeSupported()}`);
	if(isTimeSupported()) {
		if(getServerConfig() != false) {
			let value = makeReadableTime(getServerConfig().hour, getServerConfig().minute);
			logToConsole(LOG_DEBUG, `[VRR.Utilities]: Setting server rule "Time" as ${value}`);
			server.setRule("Time", value);
		}
	}

	if(isWeatherSupported()) {
		if(getServerConfig() != false) {
			if(typeof getGameConfig().weatherNames[getGame()] != "undefined") {
				let value = getGameConfig().weatherNames[getGame()][getServerConfig().weather];
				logToConsole(LOG_DEBUG, `[VRR.Utilities]: Setting server rule "Weather" as ${value}`);
				server.setRule("Weather", value);
			}
		}
	}

	if(isSnowSupported()) {
		if(getServerConfig() != false) {
			let value = getYesNoFromBool(getServerConfig().fallingSnow);
			logToConsole(LOG_DEBUG, `[VRR.Utilities]: Setting server rule "Snowing" as ${value}`);
			server.setRule("Snowing", value);
		}
	}
	logToConsole(LOG_DEBUG, `[VRR.Utilities]: All server rules updated successfully!`);
}

// ===========================================================================

function getWeatherFromParams(params) {
	if(isNaN(params)) {
		for(let i in getGameConfig().weatherNames[getGame()]) {
			if(toLowerCase(getGameConfig().weatherNames[getGame()][i]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getGameConfig().weatherNames[getGame()][params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

function getFightStyleFromParams(params) {
	if(isNaN(params)) {
		for(let i in getGameConfig().fightStyles[getGame()]) {
			if(toLowerCase(getGameConfig().fightStyles[getGame()][i][0]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getGameConfig().fightStyles[getGame()][params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

function getClosestHospital(position) {
	if(typeof getGameConfig().hospitals[getGame()] == "undefined") {
		return {position: getServerConfig().newCharacter.spawnPosition};
	} else {
		let closest = 0;
		for(let i in getGameConfig().hospitals[getGame()]) {
			if(getDistance(getGameConfig().hospitals[getGame()][i].position, position) < getDistance(getGameConfig().hospitals[getGame()][closest].position, position)) {
				closest = i;
			}
		}

		return getGameConfig().hospitals[getGame()][closest];
	}
}

// ===========================================================================

function getClosestPoliceStation(position) {
	if(typeof getGameConfig().policeStations[getGame()] == "undefined") {
		return {position: getServerConfig().newCharacter.spawnPosition};
	} else {
		let closest = 0;
		for(let i in getGameConfig().policeStations[getGame()]) {
			if(getDistance(getGameConfig().policeStations[getGame()][i].position, position) < getDistance(getGameConfig().policeStations[getGame()][closest].position, position)) {
				closest = i;
			}
		}

		return getGameConfig().policeStations[getGame()][closest];
	}
}

// ===========================================================================

function getPlayerDisplayForConsole(client) {
	if(isNull(client)) {
		return "(Unknown client)";
	}
	return `${getPlayerName(client)}[${getPlayerId(client)}]`;
}

// ===========================================================================

function getPlayerNameForNameTag(client) {
	if(isPlayerSpawned(client)) {
		return `${getPlayerCurrentSubAccount(client).firstName} ${getPlayerCurrentSubAccount(client).lastName}`;
	}
	return getPlayerName(client);
}

// ===========================================================================

function isPlayerSpawned(client) {
	if(!getPlayerData(client)) {
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
	for(let i in getGameConfig().payAndSprays[getGame()]) {
		if(getDistance(position, getGameConfig().payAndSprays[getGame()][i]) <= getGlobalConfig().payAndSprayDistance) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function resetClientStuff(client) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Resetting client data for ${getPlayerDisplayForConsole(client)}`);

	if(!getPlayerData(client)) {
		return false;
	}

	if(isPlayerOnJobRoute(client)) {
		stopJobRoute(client, false, false);
	}

	if(getPlayerData(client).rentingVehicle) {
		stopRentingVehicle(client);
	}

	deleteJobItems(client);

	getPlayerData(client).lastVehicle = null;
}

// ===========================================================================

function getPlayerFromCharacterId(subAccountId) {
	let clients = getClients();
	for(let i in clients) {
		for(let j in getPlayerData(clients[i]).subAccounts) {
			if(getPlayerData(clients[i]).subAccounts[j].databaseId == subAccountId) {
				return clients[i];
			}
		}
	}

	return false;
}

// ===========================================================================

function checkPlayerPedStates() {
	let clients = getClients();
	for(let i in clients) {
		if(getPlayerData(clients[i])) {
			if(getPlayerData(clients[i]).pedState) {
				if(isPlayerInAnyVehicle(clients[i])) {
					if(getPlayerData(clients[i]).pedState == VRR_PEDSTATE_EXITINGVEHICLE) {
						getPlayerData(clients[i]).pedState == VRR_PEDSTATE_READY;
					}
				}
			}
		}
	}
}

// ===========================================================================

function showConnectCameraToPlayer(client) {
	if(isFadeCameraSupported()) {
		fadeCamera(client, true, 1);
	}

	if(isCustomCameraSupported()) {
		//setPlayerInterior(client, 0);
		//setPlayerDimension(client, 0);
		setPlayerCameraLookAt(client, getServerConfig().connectCameraPosition, getServerConfig().connectCameraLookAt);
	}
	setPlayer2DRendering(client, false, false, false, false, false, false);
}

// ===========================================================================

function showCharacterSelectCameraToPlayer(client) {
	setPlayerCameraLookAt(client, getServerConfig().characterSelectCameraPosition, getServerConfig().characterSelectCameraPosition);
}

// ===========================================================================

function getClosestPlayer(position, exemptPlayer) {
	let clients = getClients();
	let closest = 0;
	for(let i in clients) {
		if(exemptClient != clients[i]) {
			if(getDistance(getPlayerPosition(clients[i]), position) < getDistance(getPlayerPosition(clients[closest]), position)) {
				closest = i;
			}
		}
	}
	return clients[closest];
}

// ===========================================================================

function isPlayerMuted(client) {
	return getPlayerData(client).muted;
}

// ===========================================================================

function getPlayerFromParams(params) {
	let clients = getClients();
	if(isNaN(params)) {
		for(let i in clients) {
			if(!clients[i].console) {
				if(toLowerCase(clients[i].name).indexOf(toLowerCase(params)) != -1) {
					return clients[i];
				}

				if(toLowerCase(getCharacterFullName(clients[i])).indexOf(toLowerCase(params)) != -1) {
					return clients[i];
				}
			}
		}
	} else {
		if(typeof clients[toInteger(params)] != "undefined") {
			return clients[toInteger(params)];
		}
	}

	return false;
}

// ===========================================================================

function updateConnectionLogOnQuit(client, quitReasonId) {
	if(getPlayerData(client) != false) {
		quickDatabaseQuery(`UPDATE conn_main SET conn_when_disconnect=NOW(), conn_how_disconnect=${quitReasonId} WHERE conn_id = ${getPlayerData(client).sessionId}`);
	}
}

// ===========================================================================

function updateConnectionLogOnAuth(client, authId) {
	quickDatabaseQuery(`UPDATE conn_main SET conn_auth=${authId} WHERE conn_id = ${getPlayerData(client).sessionId}`);
}

// ===========================================================================

function updateConnectionLogOnClientInfoReceive(client, clientVersion, screenWidth, screenHeight) {
	if(getPlayerData(client) != false) {
		getPlayerData(client).clientVersion = clientVersion;
	}

	let dbConnection = connectToDatabase();
	if(dbConnection) {
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
	let disallowedCharacters = getGlobalConfig().subAccountNameAllowedCharacters;
	name = toLowerCase(name);
	for(let i = 0; i < name.length; i++) {
		if(disallowedCharacters.toLowerCase().indexOf(name.charAt(i)) == -1) {
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

function triggerWebHook(messageString, serverId = getServerId(), type = VRR_DISCORD_WEBHOOK_LOG) {
	if(!getGlobalConfig().discord.webhook.enabled) {
		return false;
	}

	let tempURL = getGlobalConfig().discord.webhook.webhookBaseURL;
	tempURL = tempURL.replace("{0}", encodeURI(messageString));
	tempURL = tempURL.replace("{1}", serverId);
	tempURL = tempURL.replace("{2}", type);
	tempURL = tempURL.replace("{3}", getGlobalConfig().discord.webhook.pass);

	httpGet(
		tempURL,
		"",
		function(data) {

		},
		function(data) {
		}
	);
}

// ===========================================================================

function clearTemporaryVehicles() {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for(let i in vehicles) {
		if(!getVehicleData(vehicles[i])) {
			let occupants = vehicles[i].getOccupants();
			for(let j in occupants) {
				destroyGameElement(occupants[j]);
			}
			destroyGameElement(vehicles[i]);
		}
	}
}

// ===========================================================================

function clearTemporaryPeds() {
	let peds = getElementsByType(ELEMENT_PED);
	for(let i in peds) {
		if(peds[i].owner == -1) {
			if(!peds[i].isType(ELEMENT_PLAYER)) {
				if(peds[i].vehicle == null) {
					if(!getNPCData(peds[i])) {
						destroyElement(peds[i]);
					}
				}
			}
		}
	}
}

// ===========================================================================

function kickAllClients() {
	getClients().forEach((client) => {
		disconnectPlayer(client);
	})
}

// ===========================================================================

function updateTimeRule() {
	if(isTimeSupported()) {
		server.setRule("Time", makeReadableTime(game.time.hour, game.time.minute));
	}
}

// ===========================================================================

function isClientInitialized(client) {
	return (typeof getServerData().clients[getPlayerId(client)] != "undefined");
}

// ===========================================================================

function getPedForNetworkEvent(ped) {
	if(getGame() == VRR_GAME_GTA_IV) {
		return ped;
	} else {
		return ped.id;
	}
}

// ===========================================================================

// Get how many times a player connected in the last month by name
function getPlayerConnectionsInLastMonthByName(name) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, name);
		let result = quickDatabaseQuery(`SELECT COUNT(*) AS count FROM conn_main WHERE conn_when_connect >= NOW() - INTERVAL 1 MONTH AND conn_name = '${safeName}'`);
		if(result) {
			return result[0].count;
		}
	}

	return 0;
}

// ===========================================================================

function addPrefixNumberFill(number, amount) {
	let numberString = toString(number);
	while(numberString.length < amount) {
		numberString = toString(`0${numberString}`);
	}
	return toString(numberString);
}

// ===========================================================================