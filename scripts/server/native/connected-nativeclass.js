// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: connected.js
// DESC: Provides wrapped natives for GTA Connected and Mafia Connected mods
// TYPE: Server (JavaScript)
// ===========================================================================

class CustomNatives {
	getPlayerPosition(client) {
		if(!areServerElementsSupported()) {
			return getPlayerData(client).syncPosition;
		} else {
			if(getPlayerPed(client) != null) {
				return getPlayerPed(client).position;
			}
		}
	};

	static setPlayerPosition(client, position) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s position to ${position.x}, ${position.y}, ${position.z}`);
		sendPlayerSetPosition(client, position);
	}

	static getPlayerHeading(client) {
		if(!areServerElementsSupported()) {
			return getPlayerData(client).syncHeading;
		} else {
			if(getPlayerPed(client) != null) {
				return getPlayerPed(client).heading;
			}
		}
	}
	static setPlayerHeading(client, heading) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s heading to ${heading}`);
		sendPlayerSetHeading(client, heading);
	}

	static getPlayerVehicle(client) {
		if(!areServerElementsSupported())  {
			return getPlayerData().syncVehicle;
		} else {
			if(getPlayerPed(client).vehicle) {
				return getPlayerPed(client).vehicle;
			}
		}
		return false;
	}
	static getPlayerDimension(client) {
		if(!areServerElementsSupported()) {
			return getPlayerData(client).syncDimension;
		} else {
			if(getPlayerPed(client) != null) {
				return getPlayerPed(client).dimension;
			}
		}
	}
	static getPlayerInterior(client) {
		return getPlayerCurrentSubAccount(client).interior || 0;
	}

	static setPlayerDimension(client, dimension) {
		logToConsole(LOG_VERBOSE, `Setting ${getPlayerDisplayForConsole(client)}'s dimension to ${dimension}`);
		if(!areServerElementsSupported()) {
			getPlayerData(client).syncDimension = dimension;
		} else {
			if(getPlayerPed(client) != null) {
				getPlayerPed(client).dimension = dimension;
			}
		}
	}

	static setPlayerInterior(client, interior) {
		logToConsole(LOG_VERBOSE, `Setting ${getPlayerDisplayForConsole(client)}'s interior to ${interior}`);
		sendPlayerSetInterior(client, interior);
		if(isPlayerLoggedIn(client) && isPlayerSpawned(client)) {
			getPlayerCurrentSubAccount(client).interior = interior;
		}
	}

	static isPlayerInAnyVehicle(client) {
		if(!areServerElementsSupported())  {
			return (getPlayerData().syncVehicle != null);
		} else {
			return (getPlayerPed(client).vehicle != null);
		}
	}

	static getPlayerVehicleSeat(client) {
		if(!isPlayerInAnyVehicle(client)) {
			return false;
		}

		if(!areServerElementsSupported()) {
			return getPlayerData().syncVehicleSeat;
		} else {
			for(let i = 0 ; i <= 8 ; i++) {
				if(getPlayerVehicle(client).getOccupant(i) == getPlayerPed(client)) {
					return i;
				}
			}
		}

		return false;
	}

	static isPlayerSpawned(client) {
		return getPlayerData(client).spawned;
	}

	static getVehiclePosition(vehicle) {
		return vehicle.position;
	}

	static getVehicleHeading(vehicle) {
		return vehicle.heading;
	}

	static setVehicleHeading(vehicle, heading) {
		if(getGame() == VRR_GAME_GTA_IV) {
			return sendNetworkEventToPlayer("vrr.vehPosition", null, getVehicleForNetworkEvent(vehicle), heading);
		}
		return vehicle.heading = heading;
	}

	static getElementTransient(element) {
		if(typeof element.transient != "undefined") {
			return element.transient;
		}
		return false;
	}

	static setElementTransient(element, state) {
		if(typeof element.transient != "undefined") {
			element.transient = state;
			return true;
		}
		return false;
	}

	static getVehicleSyncer(vehicle) {
		return getElementSyncer(vehicle);
	}

	static getVehicleForNetworkEvent(vehicle) {
		if(getGame() == VRR_GAME_GTA_IV) {
			if(getVehicleData(vehicle).ivNetworkId != -1) {
				return getVehicleData(vehicle).ivNetworkId;
			}
			return -1;
		}
		return vehicle.id;
	}

	static deleteGameElement(element) {
		try {
			if(element != null) {
				destroyElement(element);
				return true;
			}
		} catch(error) {
			return false;
		}
	}

	static isPlayerInFrontVehicleSeat(client) {
		return (getPlayerVehicleSeat(client) == 0 || getPlayerVehicleSeat(client) == 1);
	}

	static removePlayerFromVehicle(client) {
		logToConsole(LOG_DEBUG, `Removing ${getPlayerDisplayForConsole(client)} from their vehicle`);
		sendPlayerRemoveFromVehicle(client);
		return true;
	}

	static setPlayerSkin(client, skinIndex) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s skin to ${getGameConfig().skins[getGame()][skinIndex][0]} (Index: ${skinIndex}, Name: ${getGameConfig().skins[getGame()][skinIndex][1]})`);
		if(getGame() == VRR_GAME_GTA_IV) {
			triggerNetworkEvent("vrr.localPlayerSkin", client, getGameConfig().skins[getGame()][skinIndex][0]);
		} else {
			getPlayerPed(client).modelIndex = getGameConfig().skins[getGame()][skinIndex][0];
		}
	}

	static getPlayerSkin(client) {
		return getSkinIndexFromModel(client.player.modelIndex);
	}

	static setPlayerHealth(client, health) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to ${health}`);
		sendPlayerSetHealth(client, health);
		getServerData(client).health = health;
	}

	static getPlayerHealth(client) {
		return getPlayerData(client).health;
	}

	static setPlayerArmour(client, armour) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to ${armour}`);
		sendPlayerSetArmour(client, armour);
		//client.player.armour = armour;
	}

	static getPlayerArmour(client) {
		if(areServerElementsSupported(client)) {
			return getPlayerPed(client).armour;
		} else {
			return getPlayerData(client).syncArmour;
		}
	}

	static setPlayerCash(client, amount) {
		if(client == null) {
			return false;
		}

		if(isNaN(amount)) {
			return false;
		}

		getPlayerCurrentSubAccount(client).cash = toInteger(amount);
		updatePlayerCash(client);
	}

	static givePlayerCash(client, amount) {
		if(client == null) {
			return false;
		}

		if(isNaN(amount)) {
			return false;
		}

		getPlayerCurrentSubAccount(client).cash = getPlayerCurrentSubAccount(client).cash + toInteger(amount);
		updatePlayerCash(client);
	}

	static takePlayerCash(client, amount) {
		if(client == null) {
			return false;
		}

		if(isNaN(amount)) {
			return false;
		}

		getPlayerCurrentSubAccount(client).cash = getPlayerCurrentSubAccount(client).cash - toInteger(amount);
		updatePlayerCash(client);
	}

	static disconnectPlayer(client) {
		logToConsole(LOG_DEBUG, `Disconnecting (kicking) ${getPlayerDisplayForConsole(client)}`);
		disconnectPlayer(client);
		return false;
	}

	static getElementSyncer(element) {
		return getClients()[element.syncer];
	}

	static getPlayerWeaponAmmo(client) {
		return getPlayerPed(client).weaponAmmunition;
	}

	static setPlayerVelocity(client, velocity) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s velocity to ${velocity.x}, ${velocity.y}, ${velocity.z}`);
		if(typeof getPlayerPed(client).velocity != "undefined") {
			getPlayerPed(client).velocity = velocity;
		}
	}

	static getPlayerVelocity(client) {
		if(typeof getPlayerPed(client).velocity != "undefined") {
			return getPlayerPed(client).velocity;
		}
		return toVector3(0.0, 0.0, 0.0);
	}

	static getElementDimension(element) {
		if(typeof element.dimension != "undefined") {
			return element.dimension;
		}
		return 0;
	}

	static setElementDimension(element, dimension) {
		if(typeof element.dimension != "undefined") {
			logToConsole(LOG_VERBOSE, `Setting element ${element} (${element.id}) dimension to ${dimension}`);
			element.dimension = dimension;
			return true;
		}
		return false;
	}

	static setElementRotation(element, rotation) {
		if(typeof element.setRotation != "undefined") {
			element.setRotation(rotation);
		} else {
			return element.rotation = rotation;
		}
	}

	static givePlayerHealth(client, amount) {
		if(getPlayerHealth(client)+amount > 100) {
			logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to 100`);
			setPlayerHealth(client, 100);
		} else {
			logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to ${getPlayerHealth(client)+amount}`);
			setPlayerHealth(client, getPlayerHealth(client)+amount);
		}
	}

	static givePlayerArmour(client, amount) {
		if(getPlayerArmour(client)+amount > 100) {
			logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to 100`);
			setPlayerArmour(client, 100);
		} else {
			logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to ${getPlayerArmour(client)+amount}`);
			setPlayerArmour(client, getPlayerArmour(client)+amount);
		}
	}

	static consolePrint(text) {
		console.log(text);
	}

	static consoleWarn(text) {
		console.warn(text);
	}

	static consoleError(text) {
		console.error(text);
	}

	static getPlayerName(client) {
		return client.name;
	}

	static getServerName() {
		return server.name;
	}

	static createGamePickup(modelIndex, position, type) {
		if(!isGameFeatureSupported("pickups")) {
			return false;
		}
		return game.createPickup(modelIndex, position, type);
	}

	static createGameBlip(position, type = 0, colour = toColour(255, 255, 255, 255)) {
		if(!isGameFeatureSupported("blips")) {
			return false;
		}
		return game.createBlip(type, position, 1, colour);
	}

	static createGameObject(modelIndex, position) {
		if(!isGameFeatureSupported("objects")) {
			return false;
		}
		return game.createObject(getGameConfig().objects[getGame()][modelIndex][0], position);
	}

	static setElementOnAllDimensions(element, state) {
		if(!isNull(element) && element != false) {
			if(typeof element.netFlags != "undefined") {
				if(typeof element.netFlags.onAllDimensions != "undefined") {
					element.netFlags.onAllDimensions = state;
				}
			} else {
				if(typeof element.onAllDimensions != "undefined") {
					element.onAllDimensions = state;
				}
			}
		}
	}

	static destroyGameElement(element) {
		if(!isNull(element) && element != false) {
			destroyElement(element);
		}
	}

	static isMeleeWeapon(weaponId, gameId = getGame()) {
		return (getGameConfig().meleeWeapons[gameId].indexOf(weaponId) != -1);
	}

	static getPlayerLastVehicle(client) {
		return getPlayerData(client).lastVehicle;
	}

	static isVehicleObject(vehicle) {
		if(vehicle == null || vehicle == undefined) {
			return false;
		}
		return (vehicle.type == ELEMENT_VEHICLE);
	}

	static repairVehicle(vehicle) {
		vehicle.fix();
	}

	static setVehicleLights(vehicle, lights) {
		setEntityData(vehicle, "vrr.lights", lights, true);
		sendNetworkEventToPlayer("vrr.veh.lights", null, vehicle.id, lights);
	}

	static setVehicleEngine(vehicle, engine) {
		vehicle.engine = engine;
		setEntityData(vehicle, "vrr.engine", engine, true);
	}

	static setVehicleLocked(vehicle, locked) {
		vehicle.locked = locked;
	}

	static setVehicleSiren(vehicle, siren) {
		vehicle.siren = siren;
	}

	static getVehicleLights(vehicle) {
		return vehicle.lights;
	}

	static getVehicleEngine(vehicle) {
		return vehicle.engine;
	}

	static getVehicleLocked(vehicle) {
		return vehicle.lockedStatus;
	}

	static getVehicleSiren(vehicle) {
		return vehicle.siren;
	}

	static setVehicleColours(vehicle, colour1, colour2, colour3 = -1, colour4 = -1) {
		vehicle.colour1 = colour1;
		vehicle.colour2 = colour2;

		if(colour3 != -1) {
			vehicle.colour3 = colour3;
		}

		if(colour4 != -1) {
			vehicle.colour4 = colour4;
		}
	}

	static createGameVehicle(modelIndex, position, heading, toClient = null) {
		if(areServerElementsSupported()) {
			return game.createVehicle(getGameConfig().vehicles[getGame()][modelIndex][0], position, heading);
		}
	}

	static createGameCivilian(modelIndex, position, heading, toClient = null) {
		if(areServerElementsSupported()) {
			let civilian = game.createCivilian(getGameConfig().skins[getGame()][modelIndex][0], 0);
			if(!isNull(civilian)) {
				civilian.position = position;
				civilian.heading = heading;
				addToWorld(civilian);
				return civilian;
			}
		}

		return false;
	}

	static getIsland(position) {
		if(getGame() == VRR_GAME_GTA_III) {
			if(position.x > 616) {
				return VRR_ISLAND_PORTLAND;
			} else if(position.x < -283) {
				return VRR_ISLAND_SHORESIDEVALE;
			}
			return VRR_ISLAND_STAUNTON;
		} else {
			return VRR_ISLAND_NONE;
		}

		//return game.getIslandFromPosition(position);
	}

	static isValidVehicleModel(model) {
		if(getVehicleModelIndexFromModel(model) != false) {
			return true;
		}

		return false;
	}

	static setGameTime(hour, minute, minuteDuration = 1000) {
		if(isTimeSupported()) {
			game.time.hour = hour;
			game.time.minute = minute;
			game.time.minuteDuration = minuteDuration;
		}
	}

	static setPlayerFightStyle(client, fightStyleId) {
		if(!isPlayerSpawned(client)) {
			return false;
		}

		if(!areFightStylesSupported()) {
			return false;
		}

		setEntityData(getPlayerElement(client), "vrr.fightStyle", [getGameConfig().fightStyles[getGame()][fightStyleId][1][0], getGameConfig().fightStyles[getGame()][fightStyleId][1][1]]);
		forcePlayerToSyncElementProperties(null, getPlayerElement(client));
	}

	static isPlayerAtGym(client) {
		return true;
	}

	static getPlayerElement(client) {
		return client.player;
	}

	static setElementPosition(element, position) {
		sendNetworkEventToPlayer("vrr.elementPosition", null, element.id, position);
	}

	static getElementPosition(element) {
		return element.position;
	}

	static getElementHeading(element) {
		return element.heading;
	}

	static setElementInterior(element, interior) {
		setEntityData(element, "vrr.interior", interior, true);
		forcePlayerToSyncElementProperties(null, element);
	}

	static setElementCollisionsEnabled(element, state) {
		sendNetworkEventToPlayer("vrr.elementCollisions", null, element.id, state);
	}

	static isTaxiVehicle(vehicle) {
		if(taxiModels[getGame()].indexOf(vehicle.modelIndex) != -1) {
			return true;
		}

		return false;
	}

	static getVehicleName(vehicle) {
		let model = getElementModel(vehicle);
		return getVehicleNameFromModel(model) || "Unknown";
	}

	static getElementModel(element) {
		if(typeof element.modelIndex != "undefined") {
			return element.modelIndex;
		}

		if(typeof element.model != "undefined") {
			return element.model;
		}
	}

	static givePlayerWeaponAmmo(client, ammo) {
		givePlayerWeapon(client, getPlayerWeapon(client), getPlayerWeaponAmmo(client) + ammo);
	}

	static getPlayerWeapon(client) {
		if(areServerElementsSupported(client)) {
			return getPlayerPed(client).weapon;
		} else {
			return getPlayerData(client).syncWeapon;
		}
	}

	static connectToDatabase() {
		if(getDatabaseConfig().usePersistentConnection) {
			if(persistentDatabaseConnection == null) {
				logToConsole(LOG_DEBUG, `[VRR.Database] Initializing database connection ...`);
				persistentDatabaseConnection = module.mysql.connect(getDatabaseConfig().host, getDatabaseConfig().user, getDatabaseConfig().pass, getDatabaseConfig().name, getDatabaseConfig().port);
				if(persistentDatabaseConnection.error) {
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
			if(databaseConnection.error) {
				logToConsole(LOG_ERROR, `[VRR.Database] Database connection error: ${persistentDatabaseConnection.error}`);
				return false;
			} else {
				return databaseConnection;
			}
		}
	}

	static disconnectFromDatabase(dbConnection) {
		if(!getDatabaseConfig().usePersistentConnection) {
			try {
				dbConnection.close();
				logToConsole(LOG_DEBUG, `[VRR.Database] Database connection closed successfully`);
			} catch(error) {
				logToConsole(LOG_ERROR, `[VRR.Database] Database connection could not be closed! (Error: ${error})`);
			}
		}
		return true;
	}

	static queryDatabase(dbConnection, queryString, useThread = false) {
		logToConsole(LOG_DEBUG, `[VRR.Database] Query string: ${queryString}`);
		if(useThread == true) {
			Promise.resolve().then(() => {
				let queryResult = dbConnection.query(queryString);
				return queryResult;
			});
		} else {
			return dbConnection.query(queryString);
		}
	}

	static escapeDatabaseString(dbConnection, unsafeString = "") {
		if(!dbConnection) {
			dbConnection = connectToDatabase();
		}

		if(typeof unsafeString == "string") {
			return dbConnection.escapeString(unsafeString);
		}
		return unsafeString;
	}

	static getDatabaseInsertId(dbConnection) {
		return dbConnection.insertId;
	}

	static getQueryNumRows(dbQuery) {
		return dbQuery.numRows;
	}

	static getDatabaseError(dbConnection) {
		return dbConnection.error;
	}

	static freeDatabaseQuery(dbQuery) {
		if(dbQuery != null) {
			dbQuery.free();
		}
		return;
	}

	static fetchQueryAssoc(dbQuery) {
		return dbQuery.fetchAssoc();
	}

	static quickDatabaseQuery(queryString) {
		let dbConnection = connectToDatabase();
		let insertId = 0;
		if(dbConnection) {
			//logToConsole(LOG_DEBUG, `[VRR.Database] Query string: ${queryString}`);
			let dbQuery = queryDatabase(dbConnection, queryString);
			if(getDatabaseInsertId(dbConnection)) {
				insertId = getDatabaseInsertId(dbConnection);
				logToConsole(LOG_DEBUG, `[VRR.Database] Query returned insert id ${insertId}`);
			}

			if(dbQuery) {
				try {
					freeDatabaseQuery(dbQuery);
					logToConsole(LOG_DEBUG, `[VRR.Database] Query result free'd successfully`);
				} catch(error) {
					logToConsole(LOG_ERROR, `[VRR.Database] Query result could not be free'd! (Error: ${error})`);
				}
			}

			disconnectFromDatabase(dbConnection);

			if(insertId != 0) {
				return insertId;
			}

			return true;
		}
		return false;
	}

	static executeDatabaseQueryCommand(command, params, client) {
		if(areParamsEmpty(params)) {
			messagePlayerSyntax(client, getCommandSyntaxText(command));
			return false;
		}

		if(!targetClient) {
			messagePlayerError(client, "That player was not found!");
			return false;
		}

		if(targetCode == "") {
			messagePlayerError(client, "You didn't enter any code!");
			return false;
		}

		let success = quickDatabaseQuery(params);

		if(!success) {
			messagePlayerAlert(client, `Database query failed to execute: {ALTCOLOUR}${query}`);
		} else if(typeof success != "boolean") {
			messagePlayeSuccess(client, `Database query successful: {ALTCOLOUR}${query}`);
			messagePlayerInfo(client, `Returns: ${success}`);
		} else {
			messagePlayerSuccess(client, `Database query successful: {ALTCOLOUR}${query}`);
		}
		return true;
	}

	static setConstantsAsGlobalVariablesInDatabase() {
		let dbConnection = connectToDatabase();
		let entries = Object.entries(global);
		for(let i in entries) {
			logToConsole(LOG_DEBUG, `[VRR.Database] Checking entry ${i} (${entries[i]})`);
			if(toString(i).slice(0, 3).indexOf("VRR_") != -1) {
				logToConsole(LOG_DEBUG, `[VRR.Database] Adding ${i} (${entries[i]}) to database global variables`);
			}
		}
	}

	static createDatabaseInsertQuery(tableName, data) {
		let fields = [];
		let values = [];

		for(let i in data) {
			if(data[i][1] != "undefined" && data[i][1] != NaN && data[i][0] != 'NaN') {
				if(data[i][1] != "undefined" && data[i][1] != NaN && data[i][1] != 'NaN') {
					fields.push(data[i][0]);

					if(typeof data[i][1] == "string") {
						if(data[i][1] == "{UNIXTIMESTAMP}") {
							values.push("UNIX_TIMESTAMP()");
						} else {
							values.push(`'${data[i][1]}'`);
						}
					} else {
						values.push(data[i][1]);
					}
				}
			}
		}

		let queryString = `INSERT INTO ${tableName} (${fields.join(", ")}) VALUES (${values.join(", ")})`;
		return queryString;
	}

	static createDatabaseUpdateQuery(tableName, data, whereClause) {
		let values = [];

		for(let i in data) {
			if(data[i][0] != "undefined" && data[i][0] != NaN && data[i][0] != 'NaN') {
				if(data[i][1] != "undefined" && data[i][1] != NaN && data[i][1] != 'NaN') {
					if(typeof data[i][1] == "string") {
						if(data[i][1] == "{UNIXTIMESTAMP}") {
							values.push(`${data[i][0]}=UNIX_TIMESTAMP()`);
						} else {
							values.push(`${data[i][0]}='${data[i][1]}'`);
						}
					} else {
						values.push(`${data[i][0]}=${data[i][1]}`);
					}
				}
			}
		}

		let queryString = `UPDATE ${tableName} SET ${values.join(", ")} WHERE ${whereClause}`;
		return queryString;
	}

	static sendNetworkEventToPlayer(eventName, client, ...args) {
		let argsArray = [eventName, client];
		argsArray = argsArray.concat(args);
		triggerNetworkEvent.apply(null, argsArray);
	}

	static addNetworkEventHandler(eventName, handlerFunction) {
		addNetworkHandler(eventName, handlerFunction);
	}

	static getElementId(element) {
		return element.id;
	}

	static getClientFromIndex(index) {
		let clients = getClients();
		for(let i in clients) {
			if(clients[i].index == index) {
				return clients[i];
			}
		}
	}

	static getClientsInRange(position, distance) {
		return getPlayersInRange(position, distance);
	}

	static getCiviliansInRange(position, distance) {
		return getElementsByTypeInRange(ELEMENT_PED, position, distance).filter(x => !x.isType(ELEMENT_PLAYER));
	}

	static getPlayersInRange(position, distance) {
		return getClients().filter(x => getDistance(position, getPlayerPosition(x)) <= distance);
	}

	static getElementsByTypeInRange(elementType, position, distance) {
		return getElementsByType(elementType).filter(x => getDistance(position, getElementPosition(x)) <= distance);
	}

	static getClosestCivilian(position) {
		return getClosestElementByType(ELEMENT_PED, position).filter(ped => !ped.isType(ELEMENT_PLAYER));
	}

	static getVehiclesInRange(position, range) {
		if(getGame() == VRR_GAME_GTA_IV) {
			return getServerData().vehicles.reduce((i, j) => (getDistance(position, i.syncPosition) <= getDistance(position, j.syncPosition)) ? i : j);
		}
		return getElementsByTypeInRange(ELEMENT_VEHICLE, position, range);
	}

	static getClosestVehicle(position) {
		return getClosestElementByType(ELEMENT_VEHICLE, position);
	}

	static getClosestElementByType(elementType, position) {
		return getElementsByType(elementType).reduce((i, j) => (getDistance(position, getElementPosition(i)) <= getDistance(position, getElementPosition(j))) ? i : j);
	}

	static getVehicleFirstEmptySeat(vehicle) {
		for(let i = 0; i <= 4; i++) {
			if(vehicle.getOccupant(i) == null) {
				return i;
			}
		}

		return false;
	}

	static isVehicleTrain(vehicle) {
		if(getGame() == VRR_GAME_GTA_III) {
			if(vehicle.modelIndex == 124) {
				return true;
			}
		}

		return false
	}

	static warpPedIntoVehicle(ped, vehicle, seatId) {
		ped.warpIntoVehicle(vehicle, seatId);
	}

	static getPlayerPing(client) {
		return client.ping
	}

	static setVehicleHealth(vehicle, health) {
		vehicle.health = 1000;
	}

	static givePlayerWeapon(client, weaponId, ammo, active = true) {
		logToConsole(LOG_DEBUG, `[VRR.Client] Sending signal to ${getPlayerDisplayForConsole(client)} to give weapon (Weapon: ${weaponId}, Ammo: ${ammo})`);
		sendNetworkEventToPlayer("vrr.giveWeapon", client, weaponId, ammo, active);
	}

	static setPlayerWantedLevel(client, wantedLevel) {
		sendNetworkEventToPlayer("vrr.wantedLevel", client, wantedLevel);
		return true;
	}

	static setElementStreamInDistance(element, distance) {
		if(!isNull(element) && element != false) {
			if(typeof element == "Entity") {
				if(typeof element.streamInDistance != "undefined") {
					element.streamInDistance = distance;
				}
			}
		}
	}

	static setElementStreamOutDistance(element, distance) {
		if(!isNull(element) && element != false) {
			if(typeof element == "Entity") {
				if(typeof element.streamOutDistance != "undefined") {
					element.streamOutDistance = distance;
				}
			}
		}
	}

	static getPlayerPed(client) {
		if(getGame() == VRR_GAME_GTA_IV) {
			return getPlayerData(client).ped;
		} else {
			return client.player;
		}
	}

	static setEntityData(entity, dataName, dataValue, syncToClients = true) {
		if(entity != null) {
			if(areServerElementsSupported()) {
				return entity.setData(dataName, dataValue, syncToClients);
			}
		}
		return false;
	}

	static removeEntityData(entity, dataName) {
		if(entity != null) {
			if(areServerElementsSupported()) {
				return entity.removeData(dataName);
			}
		}
		return false;
	}

	static doesEntityDataExist(entity, dataName) {
		if(entity != null) {
			if(areServerElementsSupported()) {
				return (entity.getData(dataName) != null);
			} else {
				return false;
			}
		}
		return null;
	}

	static disconnectPlayer(client) {
		client.disconnect();
	}

	static getPlayerId(client) {
		return client.index;
	}

	static getPlayerIP(client) {
		return client.ip;
	}

	static getPlayerGameVersion(client) {
		client.gameVersion;
	}

	static setPlayerNativeAdminState(client, state) {
		client.administrator = state;
	}

	static despawnPlayer(client) {
		client.despawnPlayer();
	}

	static getGame() {
		return server.game;
	}

	static getCountryNameFromIP(ip) {
		if(module.geoip.getCountryName(ip)) {
			return module.geoip.getCountryName(ip);
		}
		return false;
	}

	static getServerPort() {
		return server.port;
	}

	static serverBanIP(ip) {
		server.banIP(ip);
	}

	static setVehicleTrunkState(vehicle, trunkState) {
		sendNetworkEventToPlayer("vrr.veh.trunk", null, getVehicleForNetworkEvent(vehicle), trunkState);
	}

	static addCommandHandler(command, params, client) {
		addCommandHandler(command, params, client);
	}

	static removeCommandHandler(command, params, client) {
		removeCommandHandler(command);
	}

	static onScriptInit() {
		onScriptInit();
	}

	static onScriptExit() {
		onScriptExit();
	}

	static onPlayerEnterVehicle() {
		onPlayerEnterVehicle();
	}

	static onPlayerExitVehicle() {
		onPlayerExitVehicle();
	}
};

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
