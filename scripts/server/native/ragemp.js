// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: connected.js
// DESC: Provides wrapped natives for GTA Connected and Mafia Connected mods
// TYPE: Server (JavaScript)
// ===========================================================================

let builtInCommands = [
	"refresh",
	"restart",
	"stop",
	"start",
	"reconnect",
	"setname",
	"connect",
	"disconnect",
	"say",
	"dumpdoc",
];

// ===========================================================================

let disconnectReasons = [
	"Lost Connection",
	"Disconnected",
	"Unsupported Client",
	"Wrong Game",
	"Incorrect Password",
	"Unsupported Executable",
	"Disconnected",
	"Banned",
	"Failed",
	"Invalid Name",
	"Crashed",
	"Modified Game"
];

// ===========================================================================

function getPlayerPosition(client) {
	if (!areServerElementsSupported()) {
		return getPlayerData(client).syncPosition;
	} else {
		if (getPlayerPed(client) != null) {
			return getPlayerPed(client).position;
		}
	}
}

// ===========================================================================

function setPlayerPosition(client, position) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s position to ${position.x}, ${position.y}, ${position.z}`);
	sendPlayerSetPosition(client, position);
}

// ===========================================================================

function getPlayerHeading(client) {
	if (!areServerElementsSupported()) {
		return getPlayerData(client).syncHeading;
	} else {
		if (getPlayerPed(client) != null) {
			return getPlayerPed(client).heading;
		}
	}
}

// ===========================================================================

function setPlayerHeading(client, heading) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s heading to ${heading}`);
	sendPlayerSetHeading(client, heading);
}

// ===========================================================================

function getPlayerVehicle(client) {
	if (!areServerElementsSupported()) {
		return getPlayerData().syncVehicle;
	} else {
		if (getPlayerPed(client).vehicle) {
			return getPlayerPed(client).vehicle;
		}
	}
	return false;
}

// ===========================================================================

function getPlayerDimension(client) {
	if (!areServerElementsSupported()) {
		return getPlayerData(client).syncDimension;
	} else {
		if (getPlayerPed(client) != null) {
			return getPlayerPed(client).dimension;
		}
	}
}

// ===========================================================================

function getPlayerInterior(client) {
	return getPlayerCurrentSubAccount(client).interior || 0;
}

// ===========================================================================

function setPlayerDimension(client, dimension) {
	logToConsole(LOG_VERBOSE, `Setting ${getPlayerDisplayForConsole(client)}'s dimension to ${dimension}`);
	if (!areServerElementsSupported()) {
		getPlayerData(client).syncDimension = dimension;
	} else {
		if (getPlayerPed(client) != null) {
			getPlayerPed(client).dimension = dimension;
		}
	}
}

// ===========================================================================

function setPlayerInterior(client, interior) {
	logToConsole(LOG_VERBOSE, `Setting ${getPlayerDisplayForConsole(client)}'s interior to ${interior}`);
	sendPlayerSetInterior(client, interior);
	if (isPlayerLoggedIn(client) && isPlayerSpawned(client)) {
		getPlayerCurrentSubAccount(client).interior = interior;
	}
}

// ===========================================================================

function isPlayerInAnyVehicle(client) {
	if (!areServerElementsSupported()) {
		return (getPlayerData().syncVehicle != null);
	} else {
		return (getPlayerPed(client).vehicle != null);
	}
}

// ===========================================================================

function getPlayerVehicleSeat(client) {
	if (!isPlayerInAnyVehicle(client)) {
		return false;
	}

	if (!areServerElementsSupported()) {
		return getPlayerData().syncVehicleSeat;
	} else {
		for (let i = 0; i <= 8; i++) {
			if (getPlayerVehicle(client).getOccupant(i) == getPlayerPed(client)) {
				return i;
			}
		}
	}

	return false;
}

// ===========================================================================

function isPlayerSpawned(client) {
	return getPlayerData(client).spawned;
}

// ===========================================================================

function getVehiclePosition(vehicle) {
	return vehicle.position;
}

// ===========================================================================

function getVehicleHeading(vehicle) {
	return vehicle.heading;
}

// ===========================================================================

function setVehicleHeading(vehicle, heading) {
	if (getGame() == VRR_GAME_GTA_IV) {
		return sendNetworkEventToPlayer("agrp.vehPosition", null, getVehicleForNetworkEvent(vehicle), heading);
	}
	return vehicle.heading = heading;
}

// ===========================================================================

function getElementTransient(element) {
	if (typeof element.transient != "undefined") {
		return element.transient;
	}
	return false;
}

// ===========================================================================

function setElementTransient(element, state) {
	if (typeof element.transient != "undefined") {
		element.transient = state;
		return true;
	}
	return false;
}

// ===========================================================================

function getVehicleSyncer(vehicle) {
	return getElementSyncer(vehicle);
}

// ===========================================================================

function getVehicleForNetworkEvent(vehicle) {
	if (getGame() == VRR_GAME_GTA_IV) {
		if (getVehicleData(vehicle).ivNetworkId != -1) {
			return getVehicleData(vehicle).ivNetworkId;
		}
		return -1;
	}
	return vehicle.id;
}

// ===========================================================================

function deleteGameElement(element) {
	try {
		if (element != null) {
			destroyElement(element);
			return true;
		}
	} catch (error) {
		return false;
	}
}

// ===========================================================================

function isPlayerInFrontVehicleSeat(client) {
	return (getPlayerVehicleSeat(client) == 0 || getPlayerVehicleSeat(client) == 1);
}

// ===========================================================================

function removePlayerFromVehicle(client) {
	logToConsole(LOG_DEBUG, `Removing ${getPlayerDisplayForConsole(client)} from their vehicle`);
	sendPlayerRemoveFromVehicle(client);
	return true;
}

// ===========================================================================

function setPlayerSkin(client, skinIndex) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s skin to ${getGameConfig().skins[getGame()][skinIndex][0]} (Index: ${skinIndex}, Name: ${getGameConfig().skins[getGame()][skinIndex][1]})`);
	if (getGame() == VRR_GAME_GTA_IV) {
		triggerNetworkEvent("agrp.localPlayerSkin", client, getGameConfig().skins[getGame()][skinIndex][0]);
	} else {
		getPlayerPed(client).modelIndex = getGameConfig().skins[getGame()][skinIndex][0];
	}
}

// ===========================================================================

function getPlayerSkin(client) {
	return getSkinIndexFromModel(client.player.modelIndex);
}

// ===========================================================================

function setPlayerHealth(client, health) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to ${health}`);
	sendPlayerSetHealth(client, health);
	getServerData(client).health = health;
}

// ===========================================================================

function getPlayerHealth(client) {
	return getPlayerData(client).health;
}

// ===========================================================================

function setPlayerArmour(client, armour) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to ${armour}`);
	sendPlayerSetArmour(client, armour);
	//client.player.armour = armour;
}

// ===========================================================================

function getPlayerArmour(client) {
	if (areServerElementsSupported(client)) {
		return getPlayerPed(client).armour;
	} else {
		return getPlayerData(client).syncArmour;
	}
}

// ===========================================================================

function setPlayerCash(client, amount) {
	if (client == null) {
		return false;
	}

	if (isNaN(amount)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).cash = toInteger(amount);
	updatePlayerCash(client);
}

// ===========================================================================

function givePlayerCash(client, amount) {
	if (client == null) {
		return false;
	}

	if (isNaN(amount)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).cash = getPlayerCurrentSubAccount(client).cash + toInteger(amount);
	updatePlayerCash(client);
}

// ===========================================================================

function takePlayerCash(client, amount) {
	if (client == null) {
		return false;
	}

	if (isNaN(amount)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).cash = getPlayerCurrentSubAccount(client).cash - toInteger(amount);
	updatePlayerCash(client);
}

// ===========================================================================

function disconnectPlayer(client) {
	logToConsole(LOG_DEBUG, `Disconnecting (kicking) ${getPlayerDisplayForConsole(client)}`);
	disconnectPlayer(client);
	return false;
}

// ===========================================================================

function getElementSyncer(element) {
	return getClients()[element.syncer];
}

// ===========================================================================

function getPlayerWeaponAmmo(client) {
	return getPlayerPed(client).weaponAmmunition;
}

// ===========================================================================

function setPlayerVelocity(client, velocity) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s velocity to ${velocity.x}, ${velocity.y}, ${velocity.z}`);
	if (typeof getPlayerPed(client).velocity != "undefined") {
		getPlayerPed(client).velocity = velocity;
	}
}

// ===========================================================================

function getPlayerVelocity(client) {
	if (typeof getPlayerPed(client).velocity != "undefined") {
		return getPlayerPed(client).velocity;
	}
	return toVector3(0.0, 0.0, 0.0);
}

// ===========================================================================

function getElementDimension(element) {
	if (typeof element.dimension != "undefined") {
		return element.dimension;
	}
	return 0;
}

// ===========================================================================

function setElementDimension(element, dimension) {
	if (typeof element.dimension != "undefined") {
		logToConsole(LOG_VERBOSE, `Setting element ${element} (${element.id}) dimension to ${dimension}`);
		element.dimension = dimension;
		return true;
	}
	return false;
}

// ===========================================================================

function setElementRotation(element, rotation) {
	if (typeof element.setRotation != "undefined") {
		element.setRotation(rotation);
	} else {
		return element.rotation = rotation;
	}
}

// ===========================================================================

function givePlayerHealth(client, amount) {
	if (getPlayerHealth(client) + amount > 100) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to 100`);
		setPlayerHealth(client, 100);
	} else {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to ${getPlayerHealth(client) + amount}`);
		setPlayerHealth(client, getPlayerHealth(client) + amount);
	}
}

// ===========================================================================

function givePlayerArmour(client, amount) {
	if (getPlayerArmour(client) + amount > 100) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to 100`);
		setPlayerArmour(client, 100);
	} else {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to ${getPlayerArmour(client) + amount}`);
		setPlayerArmour(client, getPlayerArmour(client) + amount);
	}
}

// ===========================================================================

function consolePrint(text) {
	console.log(text);
}

// ===========================================================================

function consoleWarn(text) {
	console.warn(text);
}

// ===========================================================================

function consoleError(text) {
	console.error(text);
}

// ===========================================================================

function getPlayerName(client) {
	return client.name;
}

// ===========================================================================

function getServerName() {
	return server.name;
}

// ===========================================================================

function createGamePickup(modelIndex, position, type) {
	if (!isGameFeatureSupported("pickups")) {
		return false;
	}
	return game.createPickup(modelIndex, position, type);
}

// ===========================================================================

function createGameBlip(position, type = 0, colour = toColour(255, 255, 255, 255)) {
	if (!isGameFeatureSupported("blips")) {
		return false;
	}
	return game.createBlip(type, position, 1, colour);
}

// ===========================================================================

function createGameObject(modelIndex, position) {
	if (!isGameFeatureSupported("objects")) {
		return false;
	}
	return game.createObject(getGameConfig().objects[getGame()][modelIndex][0], position);
}

// ===========================================================================

function setElementOnAllDimensions(element, state) {
	if (!isNull(element) && element != false) {
		if (typeof element.netFlags != "undefined") {
			if (typeof element.netFlags.onAllDimensions != "undefined") {
				element.netFlags.onAllDimensions = state;
			}
		} else {
			if (typeof element.onAllDimensions != "undefined") {
				element.onAllDimensions = state;
			}
		}
	}
}

// ===========================================================================

function destroyGameElement(element) {
	if (!isNull(element) && element != false) {
		destroyElement(element);
	}
}

// ===========================================================================

function isMeleeWeapon(weaponId, gameId = getGame()) {
	return (getGameConfig().meleeWeapons[gameId].indexOf(weaponId) != -1);
}

// ===========================================================================

function getPlayerLastVehicle(client) {
	return getPlayerData(client).lastVehicle;
}

// ===========================================================================

function isVehicleObject(vehicle) {
	if (vehicle == null || vehicle == undefined) {
		return false;
	}
	return (vehicle.type == ELEMENT_VEHICLE);
}

// ===========================================================================

function repairVehicle(vehicle) {
	vehicle.fix();
}

// ===========================================================================

function setVehicleLights(vehicle, lights) {
	setEntityData(vehicle, "agrp.lights", lights, true);
	sendNetworkEventToPlayer("agrp.veh.lights", null, vehicle.id, lights);
}

// ===========================================================================

function setVehicleEngine(vehicle, engine) {
	vehicle.engine = engine;
	setEntityData(vehicle, "agrp.engine", engine, true);
}

// ===========================================================================

function setVehicleLocked(vehicle, locked) {
	vehicle.locked = locked;
}

// ===========================================================================

function setVehicleSiren(vehicle, siren) {
	vehicle.siren = siren;
}

// ===========================================================================

function getVehicleLights(vehicle) {
	return vehicle.lights;
}

// ===========================================================================

function getVehicleEngine(vehicle) {
	return vehicle.engine;
}

// ===========================================================================

function getVehicleLocked(vehicle) {
	return vehicle.lockedStatus;
}

// ===========================================================================

function getVehicleSiren(vehicle) {
	return vehicle.siren;
}

// ===========================================================================

function setVehicleColours(vehicle, colour1, colour2, colour3 = -1, colour4 = -1) {
	vehicle.colour1 = colour1;
	vehicle.colour2 = colour2;

	if (colour3 != -1) {
		vehicle.colour3 = colour3;
	}

	if (colour4 != -1) {
		vehicle.colour4 = colour4;
	}
}

// ===========================================================================

function createGameVehicle(modelIndex, position, heading) {
	if (areServerElementsSupported()) {
		return mp.vehicles.new(getGameConfig().vehicles[getGame()][modelIndex][0], position, {
			heading: heading,
			numberPlate: "",
			alpha: 255,
			color: [[255, 255, 255], [255, 255, 255]],
			locked: false,
			engine: false,
			dimension: 0
		});
	}
}

// ===========================================================================

function createGameCivilian(modelIndex, position, heading) {
	if (areServerElementsSupported()) {
		return mp.peds.new(getGameConfig().skins[getGame()][modelIndex][1], position, heading, 0);
	}

	return false;
}

// ===========================================================================

function getIsland(position) {
	return 0;
}

// ===========================================================================

function isValidVehicleModel(model) {
	if (getVehicleModelIndexFromModel(model) != false) {
		return true;
	}

	return false;
}

// ===========================================================================

function setGameTime(hour, minute, minuteDuration = 1000) {
	if (isTimeSupported()) {
		game.time.hour = hour;
		game.time.minute = minute;
		game.time.minuteDuration = minuteDuration;
	}
}

// ===========================================================================

function setGameWeather(weather) {
	if (isWeatherSupported()) {
		mp.world.weather = weather;
	}
}

// ===========================================================================

function setPlayerFightStyle(client, fightStyleId) {
	return false;
}

// ===========================================================================

function isPlayerAtGym(client) {
	return true;
}

// ===========================================================================

function getPlayerElement(client) {
	return client.player;
}

// ===========================================================================

function setElementPosition(element, position) {
	sendNetworkEventToPlayer("agrp.elementPosition", null, element.id, position);
}

// ===========================================================================

function getElementPosition(element) {
	return element.position;
}

// ===========================================================================

function getElementHeading(element) {
	return element.heading;
}

// ===========================================================================

function setElementInterior(element, interior) {
	return false;
}

// ===========================================================================

function setElementCollisionsEnabled(element, state) {
	//sendNetworkEventToPlayer("agrp.elementCollisions", null, element.id, state);
}

// ===========================================================================

function isTaxiVehicle(vehicle) {
	if (getGameConfig().taxiModels[getGame()].indexOf(vehicle.modelIndex) != -1) {
		return true;
	}

	return false;
}

// ===========================================================================

function getVehicleName(vehicle) {
	let model = getElementModel(vehicle);
	return getVehicleNameFromModel(model) || "Unknown";
}

// ===========================================================================

function getElementModel(element) {
	if (typeof element.model != "undefined") {
		return element.model;
	}
}

// ===========================================================================

function givePlayerWeaponAmmo(client, ammo) {
	client.setWeaponAmmo(ammo);
}

// ===========================================================================

function getPlayerWeapon(client) {
	return client.weapon;
}

// ===========================================================================

function connectToDatabase() {
	if (getDatabaseConfig().usePersistentConnection) {
		if (persistentDatabaseConnection == null) {
			logToConsole(LOG_DEBUG, `[VRR.Database] Initializing database connection ...`);
			persistentDatabaseConnection = module.mysql.connect(getDatabaseConfig().host, getDatabaseConfig().user, getDatabaseConfig().pass, getDatabaseConfig().name, getDatabaseConfig().port);
			if (persistentDatabaseConnection.error) {
				logToConsole(LOG_ERROR, `[VRR.Database] Database connection error: ${persistentDatabaseConnection.error}`);
				persistentDatabaseConnection = null;
				return false;
			}

			logToConsole(LOG_DEBUG, `[VRR.Database] Database connection successful!`);
			return persistentDatabaseConnection;
		} else {
			logToConsole(LOG_DEBUG, `[VRR.Database] Using existing database connection.`);
			return persistentDatabaseConnection;
		}
	} else {
		let databaseConnection = module.mysql.connect(getDatabaseConfig().host, getDatabaseConfig().user, getDatabaseConfig().pass, getDatabaseConfig().name, getDatabaseConfig().port);
		if (databaseConnection.error) {
			logToConsole(LOG_ERROR, `[VRR.Database] Database connection error: ${persistentDatabaseConnection.error}`);
			return false;
		} else {
			return databaseConnection;
		}
	}
}

// ===========================================================================

function disconnectFromDatabase(dbConnection) {
	if (!getDatabaseConfig().usePersistentConnection) {
		try {
			dbConnection.close();
			logToConsole(LOG_DEBUG, `[VRR.Database] Database connection closed successfully`);
		} catch (error) {
			logToConsole(LOG_ERROR, `[VRR.Database] Database connection could not be closed! (Error: ${error})`);
		}
	}
	return true;
}

// ===========================================================================

function queryDatabase(dbConnection, queryString, useThread = false) {
	logToConsole(LOG_DEBUG, `[VRR.Database] Query string: ${queryString}`);
	if (useThread == true) {
		Promise.resolve().then(() => {
			let queryResult = dbConnection.query(queryString);
			return queryResult;
		});
	} else {
		return dbConnection.query(queryString);
	}
}

// ===========================================================================

function escapeDatabaseString(dbConnection, unsafeString = "") {
	if (!dbConnection) {
		dbConnection = connectToDatabase();
	}

	if (typeof unsafeString == "string") {
		return dbConnection.escapeString(unsafeString);
	}
	return unsafeString;
}

// ===========================================================================

function getDatabaseInsertId(dbConnection) {
	return dbConnection.insertId;
}

// ===========================================================================

function getQueryNumRows(dbQuery) {
	return dbQuery.numRows;
}

// ===========================================================================

function getDatabaseError(dbConnection) {
	return dbConnection.error;
}

// ===========================================================================

function freeDatabaseQuery(dbQuery) {
	if (dbQuery != null) {
		dbQuery.free();
	}
	return;
}

// ===========================================================================

function fetchQueryAssoc(dbQuery) {
	return dbQuery.fetchAssoc();
}

// ===========================================================================

function quickDatabaseQuery(queryString) {
	let dbConnection = connectToDatabase();
	let insertId = 0;
	if (dbConnection) {
		//logToConsole(LOG_DEBUG, `[VRR.Database] Query string: ${queryString}`);
		let dbQuery = queryDatabase(dbConnection, queryString);
		if (getDatabaseInsertId(dbConnection)) {
			insertId = getDatabaseInsertId(dbConnection);
			logToConsole(LOG_DEBUG, `[VRR.Database] Query returned insert id ${insertId}`);
		}

		if (dbQuery) {
			try {
				freeDatabaseQuery(dbQuery);
				logToConsole(LOG_DEBUG, `[VRR.Database] Query result free'd successfully`);
			} catch (error) {
				logToConsole(LOG_ERROR, `[VRR.Database] Query result could not be free'd! (Error: ${error})`);
			}
		}

		disconnectFromDatabase(dbConnection);

		if (insertId != 0) {
			return insertId;
		}

		return true;
	}
	return false;
}

// ===========================================================================

function sendNetworkEventToPlayer(eventName, client, ...args) {
	let argsArray = [eventName, client];
	argsArray = argsArray.concat(args);
	triggerNetworkEvent.apply(null, argsArray);
}

// ===========================================================================

function addNetworkEventHandler(eventName, handlerFunction) {
	addNetworkHandler(eventName, handlerFunction);
}

// ===========================================================================

function getElementId(element) {
	return element.id;
}

// ===========================================================================

function getClientFromIndex(index) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].index == index) {
			return clients[i];
		}
	}
}

// ===========================================================================

function getClientsInRange(position, distance) {
	return getPlayersInRange(position, distance);
}

// ===========================================================================

function getCiviliansInRange(position, distance) {
	return getElementsByTypeInRange(ELEMENT_PED, position, distance).filter(x => !x.isType(ELEMENT_PLAYER));
}

// ===========================================================================

function getPlayersInRange(position, distance) {
	return getClients().filter(x => getDistance(position, getPlayerPosition(x)) <= distance);
}

// ===========================================================================

function getElementsByTypeInRange(elementType, position, distance) {
	return getElementsByType(elementType).filter(x => getDistance(position, getElementPosition(x)) <= distance);
}

// ===========================================================================

function getClosestCivilian(position) {
	return getClosestElementByType(ELEMENT_PED, position).filter(ped => !ped.isType(ELEMENT_PLAYER));
}

// ===========================================================================

function getVehiclesInRange(position, range) {
	if (getGame() == VRR_GAME_GTA_IV) {
		return getServerData().vehicles.reduce((i, j) => (getDistance(position, i.syncPosition) <= getDistance(position, j.syncPosition)) ? i : j);
	}
	return getElementsByTypeInRange(ELEMENT_VEHICLE, position, range);
}

// ===========================================================================

function getClosestVehicle(position) {
	return getClosestElementByType(ELEMENT_VEHICLE, position);
}

// ===========================================================================

function getClosestElementByType(elementType, position) {
	return getElementsByType(elementType).reduce((i, j) => (getDistance(position, getElementPosition(i)) <= getDistance(position, getElementPosition(j))) ? i : j);
}

// ===========================================================================

function getVehicleFirstEmptySeat(vehicle) {
	for (let i = 0; i <= 4; i++) {
		if (vehicle.getOccupant(i) == null) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function isVehicleTrain(vehicle) {
	// To-do
	return false
}

// ===========================================================================

function warpPedIntoVehicle(ped, vehicle, seatId) {
	ped.putIntoVehicle(vehicle, seatId);
}

// ===========================================================================

function getPlayerPing(client) {
	return client.ping;
}

// ===========================================================================

function setVehicleHealth(vehicle, health) {
	vehicle.health = health;
}

// ===========================================================================

function givePlayerWeapon(client, weaponId, ammo, active = true) {
	//logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to ${getPlayerDisplayForConsole(client)} to give weapon (Weapon: ${weaponId}, Ammo: ${ammo})`);
	//sendNetworkEventToPlayer("agrp.giveWeapon", client, weaponId, ammo, active);
	client.giveWeapon(weaponId, ammo);
}

// ===========================================================================

function setPlayerWantedLevel(client, wantedLevel) {
	//sendNetworkEventToPlayer("agrp.wantedLevel", client, wantedLevel);
	return true;
}

// ===========================================================================

function setElementStreamInDistance(element, distance) {
	return false;
}

// ===========================================================================

function setElementStreamOutDistance(element, distance) {
	return false;
}

// ===========================================================================

function getPlayerPed(client) {
	return client;
}

// ===========================================================================

function setEntityData(entity, dataName, dataValue, syncToClients = true) {
	if (entity != null) {
		if (areServerElementsSupported()) {
			if (syncToClients) {
				return entity.setVariable(dataName, dataValue);
			} else {
				return entity.setOwnVariable(dataName, dataValue);
			}
		}
	}
	return false;
}

// ===========================================================================

function removeEntityData(entity, dataName) {
	if (entity != null) {
		if (areServerElementsSupported()) {
			return entity.setVariable(dataName, null);
		}
	}
	return false;
}

// ===========================================================================

function doesEntityDataExist(entity, dataName) {
	if (entity != null) {
		if (areServerElementsSupported()) {
			return (entity.getVariable(dataName) != null);
		} else {
			return false;
		}
	}
	return null;
}

// ===========================================================================

function disconnectPlayer(client) {
	//client.disconnect();
	client.kick();
}

// ===========================================================================

function getPlayerId(client) {
	return client.id;
}

// ===========================================================================

function getPlayerIP(client) {
	return client.ip;
}

// ===========================================================================

function getPlayerGameVersion(client) {
	//client.gameVersion;
	return "0";
}

// ===========================================================================

function setPlayerNativeAdminState(client, state) {
	//client.administrator = state;
	return false;
}

// ===========================================================================

function despawnPlayer(client) {
	return false;
}

// ===========================================================================

function getGame() {
	return VRR_GAME_GTA_V;
}

// ===========================================================================

function getCountryNameFromIP(ip) {
	//if(module.geoip.getCountryName(ip)) {
	//	return module.geoip.getCountryName(ip);
	//}
	return "";
}

// ===========================================================================

function getSubdivisionNameFromIP(ip) {
	//if(module.geoip.getSubdivisionName(ip)) {
	//	return module.geoip.getSubdivisionName(ip);
	//}
	return "";
}

// ===========================================================================

function getCityNameFromIP(ip) {
	//if(module.geoip.getCityNameFromIP(ip)) {
	//	return module.geoip.getCityNameFromIP(ip);
	//}
	return "";
}

// ===========================================================================

function getServerPort() {
	return server.port;
}

// ===========================================================================

function serverBanIP(ip) {
	//server.banIP(ip);
}

// ===========================================================================

function setVehicleTrunkState(vehicle, trunkState) {
	//sendNetworkEventToPlayer("agrp.veh.trunk", null, getVehicleForNetworkEvent(vehicle), trunkState);
}

// ===========================================================================

function addAllEventHandlers() {
	addServerEventHandler("onResourceStart", onResourceStart);
	addServerEventHandler("onResourceStop", onResourceStop);
	addServerEventHandler("onServerStop", onResourceStop);

	addServerEventHandler("onProcess", onProcess);
	addServerEventHandler("onEntityProcess", onEntityProcess);

	addServerEventHandler("onPlayerConnect", onInitialConnectionToServer);
	addServerEventHandler("playerJoin", onPlayerJoin);
	addServerEventHandler("onPlayerJoined", onPlayerJoined);
	addServerEventHandler("onPlayerChat", onPlayerChat);
	addServerEventHandler("onPlayerQuit", onPlayerQuit);
	addServerEventHandler("onElementStreamIn", onElementStreamIn);
	addServerEventHandler("onElementStreamOut", onElementStreamOut);

	addServerEventHandler("onPedSpawn", onPedSpawn);
	addServerEventHandler("onPedEnterVehicle", onPedEnteringVehicle);
	addServerEventHandler("onPedExitVehicle", onPedExitingVehicle);

	addServerEventHandler("onPedEnteringVehicle", onPedEnteringVehicle);
	addServerEventHandler("onPedExitingVehicle", onPedExitingVehicle);
}

// ===========================================================================

function addServerCommandHandler(command, handlerFunction) {
	mp.events.addCommand(command, function (client, ...args) {
		handlerFunction.call(command, args.join(" "), client);
	});
}

// ===========================================================================

function addServerEventHandler(eventName, handlerFunction) {
	mp.events.add(eventName, function (event, ...args) {
		let result = handlerFunction.apply(this, args);
	});
}

// ===========================================================================

function bindServerEventHandler(eventName, bindTo, handlerFunction) {
	mp.events.add(eventName, function (event, ...args) {
		let result = handlerFunction.apply(this, args);
	});
}

// ===========================================================================