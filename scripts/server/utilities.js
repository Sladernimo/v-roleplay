// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: utilities.js
// DESC: Provides util functions and arrays with data
// TYPE: Server (JavaScript)
// ===========================================================================



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
	return getGameConfig().areas[gameId];
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

	if (typeof getServerData().clients[getPlayerId(client)] == "undefined") {
		return false;
	}

	return getServerData().clients[getPlayerId(client)];
}

// ===========================================================================

function initAllClients() {
	getClients().forEach(function (client) {
		initClient(client);
	});
}

// ===========================================================================

function updateServerRules() {
	logToConsole(LOG_DEBUG, `[AGRP.Utilities]: Updating all server rules ...`);

	let timeWeatherRule = [];
	let tempText = "";

	if (isTimeSupported()) {
		if (getServerConfig() != false) {
			tempText = makeReadableTime(getServerConfig().hour, getServerConfig().minute);
			timeWeatherRule.push(tempText);
		}
	} else {
		if (getGame() == AGRP_GAME_MAFIA_ONE) {
			if (isNightTime(getServerConfig().hour)) {
				tempText = "Night";
			} else {
				tempText = "Day";
			}

			timeWeatherRule.push(tempText);
		}
	}

	if (isWeatherSupported()) {
		if (getServerConfig() != false) {
			if (getWeatherData(getServerConfig().weather) != false) {
				let tempText = getWeatherData(getServerConfig().weather).name;
				timeWeatherRule.push(tempText);
			}
		}
	}

	if (isSnowSupported()) {
		if (getServerConfig() != false) {
			if (getServerConfig().fallingSnow == true) {
				timeWeatherRule.push("Snowing");
			}
		}
	}

	setServerRule("Time & Weather", timeWeatherRule.join(", "));
	logToConsole(LOG_DEBUG, `[AGRP.Utilities]: All server rules updated successfully!`);
}

// ===========================================================================

function getWeatherFromParams(params) {
	if (isNaN(params)) {
		for (let i in getGameConfig().weather[getGame()]) {
			if (toLowerCase(getGameConfig().weather[getGame()][i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		for (let i in getGameConfig().weather[getGame()]) {
			if (typeof getGameConfig().weather[getGame()][i].weatherId != "undefined") {
				return toInteger(i);
			}
		}
	}

	return false;
}

// ===========================================================================

function getFightStyleFromParams(params) {
	if (isNaN(params)) {
		for (let i in getGameConfig().fightStyles[getGame()]) {
			if (toLowerCase(getGameConfig().fightStyles[getGame()][i][0]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof getGameConfig().fightStyles[getGame()][params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

function getClosestHospital(position) {
	if (typeof getGameConfig().hospitals[getGame()] == "undefined") {
		return { position: getServerConfig().newCharacter.spawnPosition };
	} else {
		let closest = 0;
		for (let i in getGameConfig().hospitals[getGame()]) {
			if (getDistance(getGameConfig().hospitals[getGame()][i].position, position) < getDistance(getGameConfig().hospitals[getGame()][closest].position, position)) {
				closest = i;
			}
		}

		return getGameConfig().hospitals[getGame()][closest];
	}
}

// ===========================================================================

function getClosestPoliceStation(position) {
	if (typeof getGameConfig().policeStations[getGame()] == "undefined") {
		return { position: getServerConfig().newCharacter.spawnPosition };
	} else {
		let closest = 0;
		for (let i in getGameConfig().policeStations[getGame()]) {
			if (getDistance(getGameConfig().policeStations[getGame()][i].position, position) < getDistance(getGameConfig().policeStations[getGame()][closest].position, position)) {
				closest = i;
			}
		}

		return getGameConfig().policeStations[getGame()][closest];
	}
}

// ===========================================================================

function getPlayerDisplayForConsole(client) {
	if (isNull(client)) {
		return "(Unknown client)";
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
	for (let i in getGameConfig().payAndSprays[getGame()]) {
		if (getDistance(position, getGameConfig().payAndSprays[getGame()][i]) <= getGlobalConfig().payAndSprayDistance) {
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
					if (getPlayerData(clients[i]).pedState == AGRP_PEDSTATE_EXITINGVEHICLE) {
						getPlayerData(clients[i]).pedState == AGRP_PEDSTATE_READY;
					}
				}
			}
		}
	}
}

// ===========================================================================

function showConnectCameraToPlayer(client) {
	if (isFadeCameraSupported()) {
		fadeCamera(client, true, 1);
	}

	if (isCustomCameraSupported()) {
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
	return getPlayerData(client).muted;
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
	let disallowedCharacters = getGlobalConfig().subAccountNameAllowedCharacters;
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
	//if (typeof getServerData().clients[getPlayerId(client)] == "undefined") {
	//	return false;
	//}

	if (playerInitialized[getPlayerId(client)] == true) {
		return true;
	}

	return false;
}

// ===========================================================================

function getPedForNetworkEvent(ped) {
	//if (getGame() == AGRP_GAME_GTA_IV) {
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
			removePlayerFromVehicle(clients[i]);
		}
	}
	return false;
}

// ===========================================================================

function processPlayerEnteringExitingProperty(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Utilities]: Processing property enter/exit for player ${getPlayerDisplayForConsole(client)} ...`);
	if (getPlayerData(client).enteringExitingProperty == null) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[AGRP.Utilities]: Aborting property enter/exit for player ${getPlayerDisplayForConsole(client)}. Assigned property data is null.`);
		return false;
	}

	let pedState = getPlayerData(client).pedState;
	if (pedState != AGRP_PEDSTATE_ENTERINGPROPERTY && pedState != AGRP_PEDSTATE_EXITINGPROPERTY) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[AGRP.Utilities]: Aborting property enter/exit for player ${getPlayerDisplayForConsole(client)}. Ped state is not entering or exiting property.`);
		return false;
	}

	let propertyData = null;
	if (getPlayerData(client).enteringExitingProperty[0] == AGRP_PROPERTY_TYPE_BUSINESS) {
		propertyData = getBusinessData(getPlayerData(client).enteringExitingProperty[1]);
	} else if (getPlayerData(client).enteringExitingProperty[0] == AGRP_PROPERTY_TYPE_HOUSE) {
		propertyData = getHouseData(getPlayerData(client).enteringExitingProperty[1]);
	}

	if (propertyData == null || propertyData == false) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[AGRP.Utilities]: Aborting property enter/exit for player ${getPlayerDisplayForConsole(client)}. Property is invalid.`);
		return false;
	}

	if (pedState == AGRP_PEDSTATE_ENTERINGPROPERTY) {
		logToConsole(LOG_VERBOSE, `[AGRP.Utilities]: Processing property ENTER for player ${getPlayerDisplayForConsole(client)} ...`);
		if (isGameFeatureSupported("interiorScene") && propertyData.exitScene != "") {
			logToConsole(LOG_VERBOSE, `[AGRP.Utilities]: Player ${getPlayerDisplayForConsole(client)} is entering a property with interior scene (${propertyData.exitScene})`);
			spawnPlayer(client, propertyData.exitPosition, propertyData.exitRotation, getGameConfig().skins[getGame()][getPlayerCurrentSubAccount(client).skin][0]);
			onPlayerSpawn(client);
		} else {
			setPlayerPosition(client, propertyData.exitPosition);
			setPlayerHeading(client, propertyData.exitRotation);
		}

		setPlayerDimension(client, propertyData.exitDimension);
		setPlayerInterior(client, propertyData.exitInterior);

		setTimeout(function () {
			if (isFadeCameraSupported()) {
				fadeCamera(client, true, 1.0);
			}
			updateInteriorLightsForPlayer(client, propertyData.interiorLights);
		}, 1000);

		if (getPlayerData(client).enteringExitingProperty[0] == AGRP_PROPERTY_TYPE_BUSINESS) {
			if (propertyData.type == AGRP_BIZ_TYPE_PAINTBALL) {
				startPaintBall(client);
			}
		}

		let radioStationIndex = propertyData.streamingRadioStationIndex;
		if (radioStationIndex != -1) {
			if (getRadioStationData(radioStationIndex)) {
				playRadioStreamForPlayer(client, getRadioStationData(radioStationIndex).url);
				getPlayerData(client).streamingRadioStation = radioStationIndex;
			}
		}

		getPlayerData(client).inProperty = [getPlayerData(client).enteringExitingProperty[0], getPlayerData(client).enteringExitingProperty[1]];
		getPlayerData(client).enteringExitingProperty = null;
		getPlayerData(client).pedState = AGRP_PEDSTATE_READY;
	} else if (pedState == AGRP_PEDSTATE_EXITINGPROPERTY) {
		logToConsole(LOG_VERBOSE, `[AGRP.Utilities]: Processing property EXIT for player ${getPlayerDisplayForConsole(client)} from property ID ${propertyData.index}/${propertyData.databaseId} ...`);
		if (isGameFeatureSupported("interiorScene") && propertyData.entranceScene != "") {
			logToConsole(LOG_VERBOSE, `[AGRP.Utilities]: Player ${getPlayerDisplayForConsole(client)} is exiting a property with external interior scene (${propertyData.entranceScene})`);
			spawnPlayer(client, propertyData.entrancePosition, propertyData.entranceRotation, getGameConfig().skins[getGame()][getPlayerCurrentSubAccount(client).skin][0]);
			onPlayerSpawn(client);
		} else {
			setPlayerPosition(client, propertyData.entrancePosition);
			setPlayerHeading(client, propertyData.entranceRotation);
		}

		setPlayerDimension(client, propertyData.entranceDimension);
		setPlayerInterior(client, propertyData.entranceInterior);

		// Check if exiting property was into another house/business
		let inProperty = false;
		let inPropertyType = AGRP_PROPERTY_TYPE_NONE;

		let inBusiness = getPlayerBusiness(client);
		if (inBusiness != -1) {
			inProperty = getBusinessData(inBusiness);
			inPropertyType = AGRP_PROPERTY_TYPE_BUSINESS;
		} else {
			let inHouse = getPlayerHouse(client);
			if (inHouse != -1) {
				inProperty = getHouseData(inHouse);
				inPropertyType = AGRP_PROPERTY_TYPE_HOUSE;
			}
		}

		setTimeout(function () {
			if (getGame() != AGRP_GAME_MAFIA_ONE && getGame() != AGRP_GAME_GTA_IV) {
				if (isFadeCameraSupported()) {
					fadeCamera(client, true, 1.0);
				}
			}
			updateInteriorLightsForPlayer(client, (inProperty != false) ? inProperty.interiorLights : true);
		}, 1000);

		stopPaintBall(client);

		if (inProperty != false) {
			if (getBusinessData(inBusiness).streamingRadioStationIndex != -1) {
				if (getRadioStationData(getBusinessData(inBusiness).streamingRadioStationIndex)) {
					playRadioStreamForPlayer(client, getRadioStationData(getBusinessData(inBusiness).streamingRadioStationIndex).url);
					getPlayerData(client).streamingRadioStation = getBusinessData(inBusiness).streamingRadioStationIndex;
				}
			}
		} else {
			stopRadioStreamForPlayer(client);
			getPlayerData(client).streamingRadioStation = -1;
		}

		getPlayerData(client).inProperty = [inPropertyType, inProperty.index];
		getPlayerData(client).enteringExitingProperty = null;
		getPlayerData(client).pedState = AGRP_PEDSTATE_READY;
	}
}

// ===========================================================================

function getPlayerCountryISOCode(client) {
	if (getPlayerIP(client) == "127.0.0.1" || getPlayerIP(client).indexOf("192.168.") != -1) {
		return "US";
	}

	return module.geoip.getCountryISO(getGlobalConfig().geoIPCountryDatabaseFilePath, getPlayerIP(client));
}

// ===========================================================================