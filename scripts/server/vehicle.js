// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: vehicle.js
// DESC: Provides vehicle functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Vehicle Owner Types
const V_VEH_OWNER_NONE = 0;                     // Not owned
const V_VEH_OWNER_PLAYER = 1;                   // Owned by a player (character/subaccount)
const V_VEH_OWNER_JOB = 2;                      // Owned by a job
const V_VEH_OWNER_CLAN = 3;                     // Owned by a clan
const V_VEH_OWNER_FACTION = 4;                  // Owned by a faction (not used at the moment)
const V_VEH_OWNER_PUBLIC = 5;                   // Public vehicle. Anybody can drive it.
const V_VEH_OWNER_BIZ = 6;                      // Owned by a business (not including dealerships)
const V_VEH_OWNER_DEALERSHIP = 7;				// Owned by a dealership (will respawn new car after buying)
const V_VEH_OWNER_SCENARIO = 8;					// Owned by a scenario (car crashes, random situations, etc)

// ===========================================================================

/**
 * @class Representing a vehicle's data. Loaded and saved in the database
 * @property {Array.<Number>} trunkItemCache
 * @property {Array.<Number>} dashItemCache
 */
class VehicleData {
	constructor(dbAssoc = false, vehicle = false) {
		// General Info
		this.databaseId = 0;
		this.serverId = getServerId();
		this.model = (vehicle != false) ? getVehicleModelIndexFromModel(vehicle.modelIndex) : 0;
		this.vehicle = vehicle;
		this.index = -1;
		this.needsSaved = false;

		// GTA IV
		this.ivNetworkId = -1;
		this.syncPosition = toVector3(0.0, 0.0, 0.0);
		this.syncHeading = toVector3(0.0, 0.0, 0.0);

		// Ownership
		this.ownerType = V_VEH_OWNER_NONE;
		this.ownerId = 0;
		this.buyPrice = 0;
		this.rentPrice = 0;
		this.rentedBy = null;
		this.rentStart = 0;

		// Position and Rotation
		this.spawnPosition = (vehicle) ? vehicle.position : toVector3(0.0, 0.0, 0.0);
		this.spawnRotation = (vehicle) ? vehicle.rotation : toVector3(0.0, 0.0, 0.0);
		this.spawnLocked = false;
		this.interior = 0;
		this.dimension = 0;

		// Colour Info
		this.colour1IsRGBA = 0;
		this.colour2IsRGBA = 0;
		this.colour3IsRGBA = 0;
		this.colour4IsRGBA = 0;
		this.colour1 = (vehicle) ? vehicle.colour1 : 1;
		this.colour2 = (vehicle) ? vehicle.colour2 : 1;
		this.colour3 = (vehicle) ? vehicle.colour3 : 1;
		this.colour4 = (vehicle) ? vehicle.colour4 : 1;
		this.livery = 3;

		// Vehicle Attributes
		this.locked = false;
		this.engine = false;
		this.lights = false;
		this.health = 1000;
		this.engineDamage = 0;
		this.visualDamage = 0;
		this.dirtLevel = 0;
		this.hazardLights = false;
		this.interiorLight = false;

		// Inventory
		this.trunkItemCache = [];
		this.dashItemCache = [];

		// Radio Station
		this.streamingRadioStation = 0;
		this.streamingRadioStationIndex = -1;

		// Other/Misc
		this.insuranceAccount = 0;
		this.fuel = 0;
		this.flags = 0;
		this.needsSaved = false;
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.licensePlate = "";
		this.radioFrequency = -1;
		this.lastActiveTime = getCurrentUnixTimestamp();
		this.rank = 0;
		this.taxExempt = false;

		// Scene Switching
		this.switchingScenes = false;
		this.sceneSwitchPosition = toVector3(0.0, 0.0, 0.0);
		this.sceneSwitchRotation = toVector3(0.0, 0.0, 0.0);
		this.sceneSwitchInterior = 0;
		this.sceneSwitchDimension = 0;

		if (dbAssoc) {
			// General Info
			this.databaseId = toInteger(dbAssoc["veh_id"]);
			this.serverId = toInteger(dbAssoc["veh_server"]);
			this.model = toInteger(dbAssoc["veh_model"]);

			// Ownership
			this.ownerType = toInteger(dbAssoc["veh_owner_type"]);
			this.ownerId = toInteger(dbAssoc["veh_owner_id"]);
			this.buyPrice = toInteger(dbAssoc["veh_buy_price"]);
			this.rentPrice = toInteger(dbAssoc["veh_rent_price"]);

			// Position and Rotation
			this.spawnPosition = toVector3(dbAssoc["veh_pos_x"], dbAssoc["veh_pos_y"], dbAssoc["veh_pos_z"]);
			this.spawnRotation = toVector3(dbAssoc["veh_rot_x"], dbAssoc["veh_rot_y"], dbAssoc["veh_rot_z"]);
			this.spawnLocked = intToBool(toInteger(dbAssoc["veh_spawn_lock"]));
			this.interior = toInteger(dbAssoc["veh_int"]);
			this.dimension = toInteger(dbAssoc["veh_vw"]);

			// Colour Info
			this.colour1IsRGBA = intToBool(toInteger(dbAssoc["veh_col1_isrgba"]));
			this.colour2IsRGBA = intToBool(toInteger(dbAssoc["veh_col2_isrgba"]));
			this.colour3IsRGBA = intToBool(toInteger(dbAssoc["veh_col3_isrgba"]));
			this.colour4IsRGBA = intToBool(toInteger(dbAssoc["veh_col4_isrgba"]));
			this.colour1 = toInteger(dbAssoc["veh_col1"]);
			this.colour2 = toInteger(dbAssoc["veh_col2"]);
			this.colour3 = toInteger(dbAssoc["veh_col3"]);
			this.colour4 = toInteger(dbAssoc["veh_col4"]);
			this.livery = toInteger(dbAssoc["veh_livery"]);

			// Extras (components on SA, extras on IV+)
			//this.extras = [
			//	toInteger(dbAssoc["veh_extra1"]),
			//	toInteger(dbAssoc["veh_extra2"]),
			//	toInteger(dbAssoc["veh_extra3"]),
			//	toInteger(dbAssoc["veh_extra4"]),
			//	toInteger(dbAssoc["veh_extra5"]),
			//	toInteger(dbAssoc["veh_extra6"]),
			//	toInteger(dbAssoc["veh_extra7"]),
			//	toInteger(dbAssoc["veh_extra8"]),
			//	toInteger(dbAssoc["veh_extra9"]),
			//	toInteger(dbAssoc["veh_extra10"]),
			//	toInteger(dbAssoc["veh_extra11"]),
			//	toInteger(dbAssoc["veh_extra12"]),
			//	toInteger(dbAssoc["veh_extra13"]),
			//];

			// Vehicle Attributes
			this.locked = intToBool(toInteger(dbAssoc["veh_locked"]));
			this.engine = intToBool(toInteger(dbAssoc["veh_engine"]));
			this.lights = intToBool(toInteger(dbAssoc["veh_lights"]));
			this.health = toInteger(dbAssoc["veh_damage_normal"]);
			this.engineDamage = toInteger(dbAssoc["veh_damage_engine"]);
			this.visualDamage = toInteger(dbAssoc["veh_damage_visual"]);
			this.dirtLevel = toInteger(dbAssoc["veh_dirt_level"]);

			// Other/Misc
			this.insuranceAccount = toInteger(0);
			this.fuel = toInteger(0);
			this.flags = toInteger(0);
			this.needsSaved = false;
			this.whoAdded = toInteger(dbAssoc["veh_who_added"]);
			this.whenAdded = toInteger(dbAssoc["veh_when_added"]);
			this.licensePlate = toInteger(dbAssoc["veh_license_plate"]);
			this.rank = toInteger(dbAssoc["veh_rank"]);
			this.radioFrequency = toInteger(dbAssoc["veh_radio_freq"]);
			this.taxExempt = toInteger(dbAssoc["veh_tax_exempt"]);
		}
	}
};

// ===========================================================================

function initVehicleScript() {
	logToConsole(LOG_INFO, "[V.RP.Vehicle]: Initializing vehicle script ...");
	logToConsole(LOG_INFO, "[V.RP.Vehicle]: Vehicle script initialized successfully!");
	return true;
}

// ===========================================================================

function loadVehiclesFromDatabase() {
	logToConsole(LOG_INFO, "[V.RP.Vehicle]: Loading vehicles from database ...");
	let dbConnection = connectToDatabase();
	let tempVehicles = [];
	let dbAssoc;
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM veh_main WHERE veh_server = ${getServerId()} AND veh_deleted = 0`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempVehicleData = new VehicleData(dbAssoc[i], false);
				tempVehicles.push(tempVehicleData);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[V.RP.Vehicle]: ${tempVehicles.length} vehicles loaded from database successfully!`);
	return tempVehicles;
}

// ===========================================================================

function saveAllVehiclesToDatabase() {
	if (serverConfig.devServer) {
		return false;
	}

	logToConsole(LOG_DEBUG, "[V.RP.Vehicle]: Saving all server vehicles to database ...");
	let vehicles = serverData.vehicles;
	for (let i in vehicles) {
		if (vehicles[i].needsSaved) {
			saveVehicleToDatabase(i);
		}
	}
	logToConsole(LOG_INFO, "[V.RP.Vehicle]: Saved all server vehicles to database!");

	return true;
}

// ===========================================================================

function saveVehicleToDatabase(vehicleDataId) {
	if (serverConfig.devServer) {
		return false;
	}

	if (typeof serverData.vehicles[vehicleDataId] == "undefined") {
		return false;
	}

	let tempVehicleData = serverData.vehicles[vehicleDataId];

	if (tempVehicleData.databaseId == -1) {
		// Temp vehicle, no need to save
		return false;
	}

	if (!tempVehicleData.needsSaved) {
		// Vehicle hasn't changed. No need to save.
		return false;
	}

	logToConsole(LOG_VERBOSE, `[V.RP.Vehicle]: Saving vehicle ${tempVehicleData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		if (tempVehicleData.vehicle != false) {
			if (!tempVehicleData.spawnLocked) {
				if (isGameFeatureSupported("serverElements")) {
					tempVehicleData.spawnPosition = tempVehicleData.vehicle.position;
					tempVehicleData.spawnRotation = tempVehicleData.vehicle.rotation;
				} else {
					tempVehicleData.spawnPosition = tempVehicleData.syncPosition;
					tempVehicleData.spawnRotation = tempVehicleData.syncRotation;
				}
			}
		}

		let data = [
			["veh_server", getServerId()],
			["veh_model", toInteger(tempVehicleData.model)],
			["veh_owner_type", toInteger(tempVehicleData.ownerType)],
			["veh_owner_id", toInteger(tempVehicleData.ownerId)],
			["veh_locked", boolToInt(tempVehicleData.locked)],
			["veh_spawn_lock", boolToInt(tempVehicleData.spawnLocked)],
			["veh_buy_price", toInteger(tempVehicleData.buyPrice)],
			["veh_rent_price", toInteger(tempVehicleData.rentPrice)],
			["veh_pos_x", toFloat(tempVehicleData.spawnPosition.x)],
			["veh_pos_y", toFloat(tempVehicleData.spawnPosition.y)],
			["veh_pos_z", toFloat(tempVehicleData.spawnPosition.z)],
			["veh_rot_x", toFloat(tempVehicleData.spawnRotation.x)],
			["veh_rot_y", toFloat(tempVehicleData.spawnRotation.y)],
			["veh_rot_z", toFloat(tempVehicleData.spawnRotation.z)],
			["veh_col1", toInteger(tempVehicleData.colour1)],
			["veh_col2", toInteger(tempVehicleData.colour2)],
			["veh_col3", toInteger(tempVehicleData.colour3)],
			["veh_col4", toInteger(tempVehicleData.colour4)],
			["veh_col1_isrgb", boolToInt(tempVehicleData.colour1IsRGBA)],
			["veh_col2_isrgb", boolToInt(tempVehicleData.colour2IsRGBA)],
			["veh_col3_isrgb", boolToInt(tempVehicleData.colour3IsRGBA)],
			["veh_col4_isrgb", boolToInt(tempVehicleData.colour4IsRGBA)],
			//["veh_extra1", tempVehicleData.extras[0]],
			//["veh_extra2", tempVehicleData.extras[1]],
			//["veh_extra3", tempVehicleData.extras[2]],
			//["veh_extra4", tempVehicleData.extras[3]],
			//["veh_extra5", tempVehicleData.extras[4]],
			//["veh_extra6", tempVehicleData.extras[5]],
			//["veh_extra7", tempVehicleData.extras[6]],
			//["veh_extra8", tempVehicleData.extras[7]],
			//["veh_extra9", tempVehicleData.extras[8]],
			//["veh_extra10", tempVehicleData.extras[9]],
			//["veh_extra11", tempVehicleData.extras[10]],
			//["veh_extra12", tempVehicleData.extras[11]],
			//["veh_extra13", tempVehicleData.extras[12]],
			["veh_engine", intToBool(tempVehicleData.engine)],
			["veh_lights", intToBool(tempVehicleData.lights)],
			["veh_health", toInteger(tempVehicleData.health)],
			["veh_damage_engine", toInteger(tempVehicleData.engineDamage)],
			["veh_damage_visual", toInteger(tempVehicleData.visualDamage)],
			["veh_dirt_level", toInteger(tempVehicleData.dirtLevel)],
			["veh_int", toInteger(tempVehicleData.interior)],
			["veh_vw", toInteger(tempVehicleData.dimension)],
			["veh_livery", toInteger(tempVehicleData.livery)],
			["veh_rank", toInteger(tempVehicleData.rank)],
			["veh_radio_station", (getRadioStationData(tempVehicleData.streamingRadioStationIndex) != null) ? toInteger(getRadioStationData(tempVehicleData.streamingRadioStationIndex).databaseId) : -1],
			["veh_who_added", toInteger(tempVehicleData.whoAdded)],
			["veh_when_added", toInteger(tempVehicleData.whoAdded)],
			["veh_tax_exempt", toInteger(tempVehicleData.taxExempt)],
		];

		let dbQuery = null;
		if (tempVehicleData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("veh_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			serverData.vehicles[vehicleDataId].databaseId = getDatabaseInsertId(dbConnection);
			serverData.vehicles[vehicleDataId].needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("veh_main", data, `veh_id=${tempVehicleData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString, true);
			serverData.vehicles[vehicleDataId].needsSaved = false;
		}

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[V.RP.Vehicle]: Saved vehicle ${vehicleDataId} to database!`);

	return false;
}

// ===========================================================================

function spawnAllVehicles() {
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].vehicle == false) {
			let vehicle = spawnVehicle(serverData.vehicles[i]);
			serverData.vehicles[i].vehicle = vehicle;
		}
	}
	setAllVehicleIndexes();
}

// ===========================================================================

/**
	* @param {Vehicle} vehicle - The vehicle element
	* @return {VehicleData} The vehicles's data (class instance)
	*/
function getVehicleData(vehicle) {
	if (isVehicleObject(vehicle)) {
		for (let i in serverData.vehicles) {
			if (serverData.vehicles[i].vehicle == vehicle) {
				return serverData.vehicles[i];
			}
		}
	}

	return null;
}

// ===========================================================================

function createVehicleCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let modelIndex = getVehicleModelIndexFromParams(params);

	if (!modelIndex) {
		messagePlayerError(client, "That vehicle type is invalid!");
		return false;
	}

	let heading = getPlayerHeading(client);
	if (getGame() == V_GAME_MAFIA_ONE) {
		heading = degToRad(getPlayerHeading(client));
	}

	let frontPos = getPosInFrontOfPos(getPlayerPosition(client), getPlayerHeading(client), globalConfig.spawnCarDistance);
	let vehicle = createPermanentVehicle(modelIndex, frontPos, getRotationFromHeading(heading), getPlayerInterior(client), getPlayerDimension(client), getPlayerData(client).accountData.databaseId);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a {vehiclePurple}${getVehicleName(vehicle)}`, true);
}

// ===========================================================================

function createTemporaryVehicleCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let modelIndex = getVehicleModelIndexFromParams(params);

	if (!modelIndex) {
		messagePlayerError(client, "That vehicle type is invalid!");
		return false;
	}

	let heading = getPlayerHeading(client);
	if (getGame() == V_GAME_MAFIA_ONE) {
		heading = degToRad(getPlayerHeading(client));
	}

	let frontPos = getPosInFrontOfPos(getPlayerPosition(client), getPlayerHeading(client), globalConfig.spawnCarDistance);
	let vehicle = createTemporaryVehicle(modelIndex, frontPos, getRotationFromHeading(heading), getPlayerInterior(client), getPlayerDimension(client), getPlayerData(client).accountData.databaseId);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a temporary {vehiclePurple}${getVehicleName(vehicle)}`, true);
}

// ===========================================================================

function createSingleUseRentalCommand(command, params, client) {
	if (getGame() > V_GAME_GTA_IV) {
		messagePlayerError(client, getLocaleString(client, "GameFeatureNotSupported"));
		return false;
	}

	if (typeof serverData.singleUseVehicle[client.name] != "undefined") {
		messagePlayerError(client, "You already used your one-time Faggio!");
		return false;
	}

	let modelIndex = getVehicleModelIndexFromParams("Faggio");

	let heading = getPlayerHeading(client);
	//if (getGame() == V_GAME_MAFIA_ONE) {
	//	heading = degToRad(getPlayerHeading(client));
	//}

	let frontPos = getPosInFrontOfPos(getPlayerPosition(client), heading, globalConfig.spawnCarDistance);
	let vehicle = createTemporaryVehicle(modelIndex, frontPos, getRotationFromHeading(heading), getPlayerInterior(client), getPlayerDimension(client), getPlayerData(client).accountData.databaseId);

	getVehicleData(vehicle).rentPrice = 5;

	setTimeout(function () {
		despawnVehicle(vehicle);
		serverData.vehicles.splice(getVehicleData(vehicle).index, 1);
	}, 1000 * 60 * 10);

	serverData.singleUseVehicle[client.name] = true;

	messagePlayerSuccess(client, `You spawned a temporary Faggio. It will despawn in 10 minutes.`);
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)}{MAINCOLOUR} created a temporary 10-minute {vehiclePurple}Faggio`, true);
}

// ===========================================================================

function getNearbyVehiclesCommand(command, params, client) {
	let distance = 10.0;

	if (!areParamsEmpty(params)) {
		distance = getParam(params, " ", 1);
	}

	if (isNaN(distance)) {
		messagePlayerError(client, "The distance must be a number!");
		return false;
	}

	distance = toFloat(distance);

	if (distance <= 0) {
		messagePlayerError(client, "The distance must be more than 0!");
		return false;
	}

	let nearbyVehicles = getVehiclesInRange(getPlayerPosition(client), distance);

	if (nearbyVehicles.length == 0) {
		messagePlayerAlert(client, getLocaleString(client, "NoVehiclesWithinRange", distance));
		return false;
	}

	let vehiclesList = nearbyVehicles.map(function (x) {
		return `{chatBoxListIndex}${getVehicleData(x).index}: {MAINCOLOUR}${getVehicleName(x)} {mediumGrey}(${toFloat(getDistance(getPlayerPosition(client), getVehiclePosition(x))).toFixed(2)} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), getVehiclePosition(x)))))})`;
	});
	let chunkedList = splitArrayIntoChunks(vehiclesList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderVehiclesInRangeList", `${distance} ${toLowerCase(getLocaleString(client, "Meters"))}`)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function vehicleTrunkCommand(command, params, client) {
	let vehicle = getClosestVehicle(getPlayerPosition(client));

	let behindPosition = getPosBehindPos(getVehiclePosition(vehicle), getVehicleHeading(vehicle), globalConfig.vehicleTrunkDistance);
	if (!getPlayerVehicle(client) && getDistance(behindPosition, getPlayerPosition(client)) > globalConfig.vehicleTrunkDistance) {
		messagePlayerError(client, getLocaleString(client, "MustBeInOrNearVehicle"));
		return false;
	}

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!doesPlayerHaveVehicleKeys(client, vehicle)) {
		messagePlayerError(client, getLocaleString(client, "DontHaveVehicleKey"));
		return false;
	}

	getVehicleData(vehicle).trunk = !getVehicleData(vehicle).trunk;
	getVehicleData(vehicle).needsSaved = true;
	setVehicleTrunkState(vehicle, getVehicleData(vehicle).trunk);

	meActionToNearbyPlayers(client, `${toLowerCase(getOpenedClosedFromBool(getVehicleData(vehicle).trunk))} the ${getVehicleName(vehicle)} 's trunk.`);
}

// ===========================================================================

function vehicleHazardLightsCommand(command, params, client) {
	if (!isGameFeatureSupported("vehicleHazardLights")) {
		messagePlayerError(client, getLocaleString(client, "GameFeatureNotSupported"));
		return false;
	}

	if (!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	if (getPlayerVehicleSeat(client) > 1) {
		messagePlayerError(client, getLocaleString(client, "MustBeInVehicleFrontSeat"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	getVehicleData(vehicle).hazardLights = !getVehicleData(vehicle).hazardLights;
	getVehicleData(vehicle).needsSaved = true;
	setVehicleHazardLights(vehicle, getVehicleData(vehicle).hazardLights);

	meActionToNearbyPlayers(client, `turned ${toLowerCase(getOnOffFromBool(getVehicleData(vehicle).hazardLights))} the ${getVehicleName(vehicle)}'s hazard lights.`);
}

// ===========================================================================

function vehicleInteriorLightCommand(command, params, client) {
	if (!isGameFeatureSupported("vehicleInteriorLight")) {
		messagePlayerError(client, getLocaleString(client, "GameFeatureNotSupported"));
		return false;
	}

	if (!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	getVehicleData(vehicle).interiorLight = !getVehicleData(vehicle).interiorLight;
	getVehicleData(vehicle).needsSaved = true;
	setVehicleInteriorLight(vehicle, getVehicleData(vehicle).interiorLight);

	meActionToNearbyPlayers(client, `turned ${toLowerCase(getOnOffFromBool(getVehicleData(vehicle).interiorLight))} the ${getVehicleName(vehicle)}'s interior light.`);
}

// ===========================================================================

function vehicleTaxiLightCommand(command, params, client) {
	if (!isGameFeatureSupported("vehicleTaxiLight")) {
		messagePlayerError(client, getLocaleString(client, "GameFeatureNotSupported"));
		return false;
	}

	if (!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	getVehicleData(vehicle).taxiLight = !getVehicleData(vehicle).taxiLight;
	getVehicleData(vehicle).needsSaved = true;
	setVehicleTaxiLight(vehicle, getVehicleData(vehicle).taxiLight);

	meActionToNearbyPlayers(client, `turned on the ${toLowerCase(getOpenedClosedFromBool(getVehicleData(vehicle).trunk))} the ${getVehicleName(vehicle)}'s taxi light.`);
}

// ===========================================================================

function deleteVehicleCommand(command, params, client) {
	let vehicle = getClosestVehicle(getPlayerPosition(client));

	if (getPlayerVehicle(client)) {
		vehicle = getPlayerVehicle(client);
	}

	let vehicleName = getVehicleName(vehicle);

	deleteVehicle(vehicle);

	messagePlayerSuccess(client, `The ${vehicleName} has been deleted!`);
}

// ===========================================================================

function vehicleEngineCommand(command, params, client) {
	if (!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	if (getPlayerVehicleSeat(client) > 0) {
		messagePlayerError(client, getLocaleString(client, "MustBeInVehicleDriverSeat"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (!doesPlayerHaveVehicleKeys(client, vehicle)) {
		messagePlayerError(client, getLocaleString(client, "DontHaveVehicleKey"));
		return false;
	}

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (globalConfig.forceAllVehicleEngines != 0) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	getVehicleData(vehicle).engine = !getVehicleData(vehicle).engine;
	getVehicleData(vehicle).needsSaved = true;
	setVehicleEngine(vehicle, getVehicleData(vehicle).engine);
	//vehicle.engine = getVehicleData(vehicle).engine;
	//setEntityData(vehicle, "v.rp.engine", getVehicleData(vehicle).engine, true);

	getVehicleData(vehicle).needsSaved = true;

	meActionToNearbyPlayers(client, `turned the ${getVehicleName(vehicle)}'s engine ${toLowerCase(getOnOffFromBool(getVehicleData(vehicle).engine))}`);
}

// ===========================================================================

function vehicleSirenCommand(command, params, client) {
	if (!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (getPlayerVehicleSeat(client) > 1) {
		messagePlayerError(client, getLocaleString(client, "MustBeInVehicleFrontSeat"));
		return false;
	}

	if (!doesPlayerHaveVehicleKeys(client, vehicle)) {
		messagePlayerError(client, getLocaleString(client, "DontHaveVehicleKey"));
		return false;
	}

	getVehicleData(vehicle).siren = !getVehicleData(vehicle).siren;
	getVehicleData(vehicle).needsSaved = true;
	setVehicleSiren(vehicle, getVehicleData(vehicle).siren);

	getVehicleData(vehicle).needsSaved = true;

	meActionToNearbyPlayers(client, `turns the ${getVehicleName(vehicle)}'s siren ${toLowerCase(getOnOffFromBool(getVehicleData(vehicle).siren))}`);
}

// ===========================================================================

function vehicleAdminColourCommand(command, params, client) {
	if (!isGameFeatureSupported("vehicleColour")) {
		messagePlayerError(client, getLocaleString(client, "GameFeatureNotSupported"));
		return false;
	}

	if (areParamsEmpty(params) && areThereEnoughParams(params, 2)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let colour1 = toInteger(getParam(params, " ", 1)) || 0;
	let colour2 = toInteger(getParam(params, " ", 2)) || 0;
	let colour3 = toInteger(getParam(params, " ", 3)) || 0;
	let colour4 = toInteger(getParam(params, " ", 4)) || 0;

	setVehicleColours(vehicle, colour1, colour2, colour3, colour4);
	getVehicleData(vehicle).colour1 = colour1;
	getVehicleData(vehicle).colour2 = colour2;
	getVehicleData(vehicle).colour3 = colour3;
	getVehicleData(vehicle).colour4 = colour4;

	getVehicleData(vehicle).needsSaved = true;

	//meActionToNearbyPlayers(client, `resprays the ${getVehicleName(vehicle)}'s colours`);
}

// ===========================================================================

function vehicleAdminRepairCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} could not repair their vehicle. Reason: Not in a vehicle.`);
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} could not repair their ${getVehicleName(vehicle)} vehicle. Not a server vehicle.`);
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} repaired their ${getVehicleName(vehicle)} vehicle`);
	//takePlayerCash(client, globalConfig.repairVehicleCost);
	repairVehicle(vehicle);
	getVehicleData(vehicle).needsSaved = true;
	//meActionToNearbyPlayers(client, `repairs the ${getVehicleName(vehicle)}`);
}

// ===========================================================================

function vehicleAdminLiveryCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	//if (getPlayerCurrentSubAccount(client).cash < globalConfig.repairVehicleCost) {
	//	messagePlayerError(client, `You don't have enough money to change the vehicle's livery (need ${getCurrencyString(globalConfig.resprayVehicleCost - getPlayerCurrentSubAccount(client).cash)} more!)`);
	//	return false;
	//}

	let livery = toInteger(params) || 3;

	takePlayerCash(client, globalConfig.resprayVehicleCost);
	updatePlayerCash(client);
	getVehicleData(vehicle).livery = livery;
	getVehicleData(vehicle).needsSaved = true;

	setEntityData(vehicle, "v.rp.livery", livery, true);
	forcePlayerToSyncElementProperties(null, vehicle);

	//meActionToNearbyPlayers(client, `sets the ${getVehicleName(vehicle)}'s livery/paintjob'`);
}

// ===========================================================================

function buyVehicleCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (getVehicleData(vehicle).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "VehicleNotForSale"));
		return false;
	}

	if (canPlayerManageVehicle(client, vehicle, true, true)) {
		messagePlayerError(client, getLocaleString(client, "AlreadyOwnVehicle"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).cash < applyServerInflationMultiplier(getVehicleData(vehicle).buyPrice)) {
		messagePlayerError(client, getLocaleString(client, "VehiclePurchaseNotEnoughMoney"));
		return false;
	}

	getPlayerData(client).buyingVehicle = vehicle;
	getVehicleData(vehicle).engine = true;
	vehicle.engine = true;
	setEntityData(vehicle, "v.rp.engine", getVehicleData(vehicle).engine, true);

	getVehicleData(vehicle).needsSaved = true;
	setPlayerBuyingVehicleState(client, V_VEHBUYSTATE_TESTDRIVE, vehicle.id, getVehiclePosition(vehicle));
	meActionToNearbyPlayers(client, `receives a set of keys to test drive the ${getVehicleName(vehicle)} and starts the engine`);
	messagePlayerInfo(client, getLocaleString(client, "DealershipPurchaseTestDrive"));
	serverData.purchasingVehicleCache.push(client);
}

// ===========================================================================

function rentVehicleCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (getVehicleData(vehicle).rentPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "VehicleNotForRent"));
		return false;
	}

	if (getPlayerData(client).rentingVehicle != null) {
		messagePlayerAlert(client, getLocaleString(client, "StoppedRentingVehicle"));
		stopRentingVehicle(client);
		return false;
	}

	if (getVehicleData(vehicle).rentedBy != null) {
		if (getVehicleData(vehicle).rentedBy != client) {
			messagePlayerAlert(client, getLocaleString(client, "VehicleAlreadyRentedByOther"));
			return false;
		} else {
			messagePlayerAlert(client, getLocaleString(client, "VehicleAlreadyRentedBySelf"));
			return false;
		}
	}

	if (getVehicleData(vehicle).rentPrice > getPlayerCurrentSubAccount(client).cash) {
		messagePlayerError(client, getLocaleString(client, "NotEnoughCashNeedAmountMore", getVehicleData(vehicle).rentPrice - getPlayerCurrentSubAccount(client).cash));
		return false;
	}

	getVehicleData(vehicle).rentedBy = client;
	getPlayerData(client).rentingVehicle = vehicle;
	getVehicleData(vehicle).rentStart = getCurrentUnixTimestamp();
	serverData.rentingVehicleCache.push(client);
	getVehicleData(vehicle).needsSaved = true;

	meActionToNearbyPlayers(client, `rents the ${getVehicleName(vehicle)} and receives a set of vehicle keys!`);
	messagePlayerAlert(client, getLocaleString(client, "StartedRentingVehicle", `{ALTCOLOUR}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}${getCurrencyString(getVehicleData(vehicle).rentPrice)}{MAINCOLOUR}`, `{ALTCOLOUR}/vehstoprent{MAINCOLOUR}`));

	if (!getVehicleData(vehicle).engine) {
		showVehicleEngineOffMessageForPlayer(client, vehicle);
	}
}

// ===========================================================================

function enterVehicleAsPassengerCommand(command, params, client) {
	if (getGame() == V_GAME_MAFIA_ONE) {
		return false;
	}

	sendNetworkEventToPlayer("v.rp.passenger", client);
}

// ===========================================================================

function stopRentingVehicleCommand(command, params, client) {
	if (getPlayerData(client).rentingVehicle == null) {
		messagePlayerError(client, getLocaleString(client, "NotRentingAVehicle"));
		return false;
	}

	let vehicle = getPlayerData(client).rentingVehicle;
	messagePlayerAlert(client, getLocaleString(client, "StoppedRentingVehicle", `{vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR}`));
	stopRentingVehicle(client);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function doesPlayerHaveVehicleKeys(client, vehicle) {
	let vehicleData = getVehicleData(vehicle);

	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
		return true;
	}

	if (vehicleData.ownerType == V_VEH_OWNER_PUBLIC) {
		return true;
	}

	if (vehicleData.ownerType == V_VEH_OWNER_PLAYER) {
		if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if (vehicleData.ownerType == V_VEH_OWNER_CLAN) {
		if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).clan) {
			if (getClanRankData(getPlayerClan(client), getPlayerClanRank(client)).level >= vehicleData.rank) {
				return true;
			}
		}
	}

	if (vehicleData.ownerType == V_VEH_OWNER_BIZ) {
		if (canPlayerManageBusiness(client, getBusinessIndexFromDatabaseId(vehicleData.ownerId), exemptAdminFlag)) {
			return true;
		}
	}

	//if (vehicleData.ownerType == V_VEH_OWNER_FACTION) {
	//	if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).faction) {
	//		if (vehicleData.factionRank <= getPlayerCurrentSubAccount(client).factionRank) {
	//			return true;
	//		}
	//	}
	//}

	if (vehicleData.ownerType == V_VEH_OWNER_JOB) {
		if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).job) {
			if (getJobRankData(getPlayerJob(client), getPlayerJobRank(client)).level >= vehicleData.rank) {
				return true;
			}
		}
	}

	if (vehicleData.rentedBy == client) {
		return true;
	}

	return false;
}

// ===========================================================================

function canPlayerManageVehicle(client, vehicle, exemptAdminFlag = false, onlyPersonalVehicles = false) {
	let vehicleData = getVehicleData(vehicle);

	if (!exemptAdminFlag) {
		if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
			return true;
		}
	}

	if (vehicleData.ownerType == V_VEH_OWNER_PLAYER) {
		if (vehicleData.ownerId == getPlayerData(client).accountData.databaseId) {
			return true;
		}
	}

	if (onlyPersonalVehicles == false) {
		if (vehicleData.ownerType == V_VEH_OWNER_CLAN) {
			if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).clan) {
				if (doesPlayerHaveClanPermission(client, "ManageVehicles")) {
					return true;
				}
			}
		}
	}

	if (onlyPersonalVehicles == false) {
		if (vehicleData.ownerType == V_VEH_OWNER_BIZ) {
			if (canPlayerManageBusiness(client, getBusinessIndexFromDatabaseId(vehicleData.ownerId), exemptAdminFlag)) {
				return true;
			}
		}
	}

	return false;
}

// ===========================================================================

function setVehicleJobCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getVehiclePosition(vehicle));
	let jobId = closestJobLocation.job;

	if (!areParamsEmpty(params)) {
		jobId = getJobFromParams(params);
	}

	//if(!jobId) {
	//	messagePlayerError(client, getLocaleString(client, "InvalidJob"));
	//	messagePlayerInfo(client, "Please specify a job ID or leave it out to get the closest job.");
	//	return false;
	//}

	getVehicleData(vehicle).ownerType = V_VEH_OWNER_JOB;
	getVehicleData(vehicle).ownerId = getJobData(jobId).databaseId;

	getVehicleData(vehicle).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} owner to the {jobYellow}${getJobData(jobId).name} {MAINCOLOUR}job! (Job ID ${jobId})`, true);
}

// ===========================================================================

function setVehicleRankCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let level = toInteger(params);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (getVehicleData(vehicle).ownerType == V_VEH_OWNER_CLAN) {
		getVehicleData(vehicle).rank = level
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} minimum rank to {ALTCOLOUR}${level}{MAINCOLOUR} of the {clanOrange}${getClanData(getVehicleData(vehicle).ownerId).name}{MAINCOLOUR} clan!`, true);
	} else if (getVehicleData(vehicle).ownerType == V_VEH_OWNER_JOB) {
		getVehicleData(vehicle).rank = level;
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} minimum rank to {ALTCOLOUR}${level}{MAINCOLOUR} of the {jobYellow}${getJobData(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)).name}{MAINCOLOUR} job!`, true);
	}

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehicleClanCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let clanId = getPlayerClan(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (getVehicleData(vehicle).ownerType != V_VEH_OWNER_PLAYER) {
		messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
		return false;
	}

	if (getVehicleData(vehicle).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
		messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "SetVehicleClanConfirmMessage"), getLocaleString(client, "SetVehicleClanConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = V_PROMPT_GIVEVEHTOCLAN;
}

// ===========================================================================

function setVehicleBusinessCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let businessIndex = getClosestBusinessEntrance(getVehiclePosition(getPlayerVehicle(client)));

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!getBusinessData(businessIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let businessData = getBusinessData(businessIndex);

	if (getVehicleData(vehicle).ownerType != V_VEH_OWNER_PLAYER) {
		messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
		return false;
	}

	if (getVehicleData(vehicle).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
		messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "SetVehicleBusinessConfirmMessage", `{businessBlue}${businessData.name}{MAINCOLOUR}`), getLocaleString(client, "GUIWarningTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = V_PROMPT_GIVEVEHTOBIZ;
}

// ===========================================================================

function setVehicleOwnerCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let targetClient = getPlayerFromParams(params);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (canPlayerManageVehicle(client, vehicle) == false) {
		messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
		return false;
	}

	getVehicleData(vehicle).ownerType = V_VEH_OWNER_PLAYER;
	getVehicleData(vehicle).ownerId = getPlayerCurrentSubAccount(targetClient).databaseId;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} owner to {ALTCOLOUR}${getClientSubAccountName(targetClient)}`, true);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehiclePublicCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	getVehicleData(vehicle).ownerType = V_VEH_OWNER_PUBLIC;
	getVehicleData(vehicle).ownerId = 0;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} to a public vehicle!`, true);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehicleRentPriceCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!canPlayerManageVehicle(client, vehicle)) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
			messagePlayerError(client, "You can't set the rent price for this vehicle!");
			return false;
		}
	}

	let amount = toInteger(params) || 0;

	getVehicleData(vehicle).rentPrice = amount;
	getVehicleData(vehicle).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} rent price to {ALTCOLOUR}${getCurrencyString(amount)}`, true);
}

// ===========================================================================

function setVehicleBuyPriceCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!canPlayerManageVehicle(client, vehicle)) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
			messagePlayerError(client, "You can't set the buy price for this vehicle!");
			return false;
		}
	}

	let amount = toInteger(params) || 0;

	getVehicleData(vehicle).buyPrice = amount;
	getVehicleData(vehicle).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}'s{MAINCOLOUR} buy price to {ALTCOLOUR}${getCurrencyString(amount)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(amount))})`, true);
}

// ===========================================================================

function removeVehicleOwnerCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let targetClient = getPlayerFromParams(params);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	getVehicleData(vehicle).ownerType = V_VEH_OWNER_NONE;
	getVehicleData(vehicle).ownerId = 0;

	getVehicleData(vehicle).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} owner to nobody!`, true);
	messagePlayerInfo(client, `Nobody will be able to use this vehicle until it receives a new owner (either bought or set by admin).`);
}

// ===========================================================================

function getVehicleInfoCommand(command, params, client) {
	let vehicle = getClosestVehicle(getPlayerPosition(client));

	if (!vehicle) {
		messagePlayerError(client, getLocaleString(client, "InvalidVehicle"));
		return false;
	}

	if (getPlayerVehicle(client)) {
		vehicle = getPlayerVehicle(client);
	}

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	showVehicleInfoToPlayer(client, getVehicleData(vehicle));

	//messagePlayerNormal(client, `🚗 {vehiclePurple}[Vehicle Info] {MAINCOLOUR}ID: {ALTCOLOUR}${getElementId(vehicle)}, {MAINCOLOUR}Index: {ALTCOLOUR}${vehicleData.index}, {MAINCOLOUR}DatabaseID: {ALTCOLOUR}${vehicleData.databaseId}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName}[ID ${vehicleData.ownerId}] (${ownerType}), {MAINCOLOUR}Type: {ALTCOLOUR}${getVehicleName(vehicle)}[ID: ${vehicle.modelIndex}, Index: ${getVehicleModelIndexFromModel(vehicle.modelIndex)}], {MAINCOLOUR}BuyPrice: {ALTCOLOUR}${vehicleData.buyPrice}, {MAINCOLOUR}RentPrice: {ALTCOLOUR}${vehicleData.rentPrice}`);
}

// ===========================================================================

function getLastVehicleInfoCommand(command, params, client) {
	let vehicle = getPlayerLastVehicle(client);

	if (!vehicle) {
		messagePlayerError(client, getLocaleString(client, "InvalidVehicle"));
		return false;
	}

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	showVehicleInfoToPlayer(client, getVehicleData(vehicle));
}

// ===========================================================================

function toggleVehicleSpawnLockCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (getVehicleData(vehicle) == null) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	getVehicleData(vehicle).spawnLocked = !getVehicleData(vehicle).spawnLocked;
	if (getVehicleData(vehicle).spawnLocked) {
		getVehicleData(vehicle).spawnPosition = getVehiclePosition(vehicle);
		getVehicleData(vehicle).spawnRotation = getVehicleRotation(vehicle);
		getVehicleData(vehicle).dimension = getElementDimension(vehicle);
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} to spawn {ALTCOLOUR}${(getVehicleData(vehicle).spawnLocked) ? "at it's current location" : "wherever a player leaves it."}`, true);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function reloadAllVehiclesCommand(command, params, client) {
	despawnAllVehicles();
	serverData.vehicles = [];
	serverData.vehicles = loadVehiclesFromDatabase();
	setAllVehicleIndexes();
	spawnAllVehicles();

	announceAdminAction(`AllVehiclesReloaded`);

	//getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function respawnVehicleCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	//removeAllOccupantsFromVehicle(vehicle);
	respawnVehicle(vehicle);

	setAllVehicleIndexes();

	messagePlayerSuccess(client, getLocaleString(client, `YourVehicleRespawned`));
}

// ===========================================================================

function respawnAllVehiclesCommand(command, params, client) {
	for (let i in serverData.vehicles) {
		respawnVehicle(serverData.vehicles[i].vehicle);
	}

	//let randomVehicles = getElementsByType(ELEMENT_VEHICLE).filter(v => getVehicleData(v) == false);
	//for (let i in randomVehicles) {
	//	destroyElement(randomVehicles[i]);
	//}

	setAllVehicleIndexes();

	announceAdminAction(`AllVehiclesRespawned`);
}

// ===========================================================================

function respawnEmptyVehiclesCommand(command, params, client) {
	for (let i in serverData.vehicles) {
		if (isVehicleUnoccupied(serverData.vehicles[i].vehicle)) {
			respawnVehicle(serverData.vehicles[i].vehicle);
		}
	}

	//let clientVehicles = getElementsByType(ELEMENT_VEHICLE).filter(v => getVehicleData(v) == false);
	//for (let i in clientVehicles) {
	//	if (!isVehicleUnoccupied(clientVehicles[i])) {
	//		destroyElement(clientVehicles[i]);
	//	}
	//}

	setAllVehicleIndexes();

	announceAdminAction(`EmptyVehiclesRespawned`);
}

// ===========================================================================

function respawnJobVehiclesCommand(command, params, client) {
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].ownerType == V_VEH_OWNER_JOB) {
			respawnVehicle(serverData.vehicles[i].vehicle);
		}
	}

	setAllVehicleIndexes();

	announceAdminAction(`JobVehiclesRespawned`);
}

// ===========================================================================

function respawnClanVehiclesCommand(command, params, client) {
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].ownerType == V_VEH_OWNER_CLAN) {
			respawnVehicle(serverData.vehicles[i].vehicle);
		}
	}

	setAllVehicleIndexes();

	announceAdminAction(`ClanVehiclesRespawned`);
}

// ===========================================================================

function respawnPlayerVehiclesCommand(command, params, client) {
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].ownerType == V_VEH_OWNER_PLAYER) {
			respawnVehicle(serverData.vehicles[i].vehicle);
		}
	}

	setAllVehicleIndexes();

	announceAdminAction(`PlayerVehiclesRespawned`);
}

// ===========================================================================

function respawnPublicVehiclesCommand(command, params, client) {
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].ownerType == V_VEH_OWNER_PUBLIC) {
			respawnVehicle(serverData.vehicles[i].vehicle);
		}
	}

	setAllVehicleIndexes();

	announceAdminAction(`PublicVehiclesRespawned`);
}

// ===========================================================================

function respawnBusinessVehiclesCommand(command, params, client) {
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].ownerType == V_VEH_OWNER_BIZ) {
			respawnVehicle(serverData.vehicles[i].vehicle);
		}
	}

	setAllVehicleIndexes();

	announceAdminAction(`BusinessVehiclesRespawned`);
}

// ===========================================================================

function stopRentingVehicle(client) {
	serverData.rentingVehicleCache.splice(serverData.rentingVehicleCache.indexOf(client), 1);

	let vehicle = getPlayerData(client).rentingVehicle;

	if (vehicle != null) {
		getVehicleData(vehicle).rentedBy = null;
		removeAllOccupantsFromVehicle(vehicle);
		setTimeout(function () {
			respawnVehicle(vehicle);
		}, 1000);
	}

	getPlayerData(client).rentingVehicle = null;
}

// ===========================================================================

function respawnVehicle(vehicle) {
	for (let i in serverData.vehicles) {
		if (vehicle == serverData.vehicles[i].vehicle) {
			removeAllOccupantsFromVehicle(vehicle);

			updateVehicleSavedPosition(i);

			if (serverData.vehicles[i].spawnLocked == true) {
				serverData.vehicles[i].engine = false;
			}

			if (serverData.vehicles[i].ownerType == V_VEH_OWNER_JOB) {
				serverData.vehicles[i].locked = true;
			}

			if (vehicle != null) {
				deleteGameElement(vehicle);
			}

			serverData.vehicles[i].vehicle = null;

			let newVehicle = spawnVehicle(serverData.vehicles[i]);
			serverData.vehicles[i].vehicle = newVehicle;
		}
	}

	//getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

/**
	* @param {VehicleData} vehicleData - The vehicle's server data
	* @return {Vehicle} The vehicle game object
	*/
function spawnVehicle(vehicleData) {
	logToConsole(LOG_DEBUG, `[V.RP.Vehicle]: Spawning ${gameData.vehicles[getGame()][vehicleData.model][1]} at ${vehicleData.spawnPosition.x.toFixed(2)}, ${vehicleData.spawnPosition.y.toFixed(2)}, ${vehicleData.spawnPosition.z.toFixed(2)}`);

	let position = vehicleData.spawnPosition;
	let rotation = vehicleData.spawnRotation;
	let interior = vehicleData.interior;
	let dimension = vehicleData.dimension;

	if (vehicleData.switchingScenes == true) {
		position = vehicleData.sceneSwitchPosition;
		rotation = vehicleData.sceneSwitchRotation;
		interior = vehicleData.sceneSwitchInterior;
		dimension = vehicleData.sceneSwitchDimension;
	}

	let vehicle = createGameVehicle(vehicleData.model, position, rotation);

	if (!vehicle) {
		return false;
	}

	if (getGame() == V_GAME_MAFIA_ONE) {
		setVehicleHeading(vehicle, getHeadingFromRotation(rotation));
	} else {
		setElementRotation(vehicle, rotation);
	}

	setElementDimension(vehicle, dimension);
	setElementInterior(vehicle, interior);

	vehicleData.vehicle = vehicle;

	if (isGameFeatureSupported("vehicleColour")) {
		if (vehicleData.colour1IsRGBA && vehicleData.colour2IsRGBA) {
			vehicle.setRGBColours(vehicleData.colour1RGBA, vehicleData.colour2RGBA);
			let colour1 = rgbaArrayFromToColour(vehicleData.colour1RGBA);
			let colour2 = rgbaArrayFromToColour(vehicleData.colour2RGBA);
			logToConsole(LOG_VERBOSE, `[V.RP.Vehicle]: Setting vehicle ${vehicle.id}'s colours to RGBA [${colour1[0]}, ${colour1[1]}, ${colour1[2]}, ${colour1[3]}], [(]${colour2[0]}, ${colour2[1]}, ${colour2[2]}, ${colour2[3]}]`);
			vehicle.setRGBColours(vehicleData.colour1RGBA, vehicleData.colour2RGBA);
		} else {
			setVehicleColours(vehicle, vehicleData.colour1, vehicleData.colour2, vehicleData.colour3, vehicleData.colour4);
			logToConsole(LOG_VERBOSE, `[V.RP.Vehicle]: Setting vehicle ${vehicle.id}'s colours to ${vehicleData.colour1}, ${vehicleData.colour2}, ${vehicleData.colour3}, ${vehicleData.colour4}`);
		}
	}

	if (vehicleData.spawnLocked == true && vehicleData.switchingScenes == false) {
		vehicleData.engine = false;
		vehicleData.locked = true;
		vehicleData.lights = false;
		vehicleData.interiorLight = false;
		vehicleData.hazardLights = false;

		// Unlock cars that are for sale or rent, or are publicly usable
		if (vehicleData.rentPrice > 0 || vehicleData.buyPrice > 0 || vehicleData.ownerType == V_VEH_OWNER_PUBLIC) {
			vehicleData.locked = false;
		}

		logToConsole(LOG_VERBOSE, `[V.RP.Vehicle]: Setting parked vehicle ${vehicle.id}'s initial engine and lock state`);
	}

	if (globalConfig.forceAllVehicleEngines == 1) {
		vehicleData.engine = false;
	} else if (globalConfig.forceAllVehicleEngines == 1) {
		vehicleData.engine = true;
	}

	//setVehicleHealth(vehicle, 1000);
	repairVehicle(vehicle);

	setEntityData(vehicle, "v.rp.upgrades", vehicleData.extras, true);
	setEntityData(vehicle, "v.rp.interior", interior, true);
	setEntityData(vehicle, "v.rp.server", true, true);

	setVehicleLights(vehicle, vehicleData.lights);
	setVehicleEngine(vehicle, vehicleData.engine);
	setVehicleLocked(vehicle, vehicleData.locked);
	setVehicleHazardLights(vehicle, vehicleData.hazardLights);
	setVehicleInteriorLight(vehicle, vehicleData.interiorLight);
	setVehicleDirtLevel(vehicle, vehicleData.dirtLevel);
	setVehicleLivery(vehicle, vehicleData.livery);

	forcePlayerToSyncElementProperties(null, vehicle);
	setElementTransient(vehicle, false);

	return vehicle;
}

// ===========================================================================

function isVehicleAtPayAndSpray(vehicle) {
	for (let i in serverData.payAndSprays[getGame()]) {
		if (getDistance(getVehiclePosition(vehicle), serverData.payAndSprays[getGame()][i].position) <= globalConfig.payAndSprayDistance) {
			return true;
		}
	}
	return false;
}

// ===========================================================================

function getVehicleOwnerTypeText(ownerType) {
	switch (ownerType) {
		case V_VEH_OWNER_CLAN:
			return "clan";

		case V_VEH_OWNER_JOB:
			return "job";

		case V_VEH_OWNER_PLAYER:
			return "player";

		case V_VEH_OWNER_BIZ:
			return "business";

		case V_VEH_OWNER_PUBLIC:
			return "public";

		default:
			return "unknown";
	}
}

// ===========================================================================

function isVehicleOwnedByJob(vehicle, jobId) {
	if (getVehicleData(vehicle).ownerType == V_VEH_OWNER_JOB) {
		return (getVehicleData(vehicle).ownerId == jobId);
	}
	return false;
}

// ===========================================================================

function createNewDealershipVehicle(modelIndex, spawnPosition, spawnRotation, price, ownerType, dealershipId, interior = 0, dimension = 0) {
	let vehicle = createGameVehicle(modelIndex, spawnPosition, spawnRotation);

	if (vehicle == null) {
		return false;
	}

	setElementRotation(vehicle, spawnRotation);
	setElementInterior(vehicle, interior);
	setElementDimension(vehicle, dimension);
	addToWorld(vehicle);

	let tempVehicleData = new VehicleData(false, vehicle);
	tempVehicleData.buyPrice = price;
	tempVehicleData.spawnLocked = true;
	tempVehicleData.spawnPosition = spawnPosition;
	tempVehicleData.spawnRotation = spawnRotation;
	tempVehicleData.ownerType = ownerType;
	tempVehicleData.ownerId = dealershipId;
	tempVehicleData.needsSaved = true;
	tempVehicleData.interior = interior;
	tempVehicleData.dimension = dimension;
	tempVehicleData.whoAdded = defaultNoAccountId;
	tempVehicleData.whenAdded = getCurrentUnixTimestamp();

	if (!isGameFeatureSupported("vehicleColour")) {
		tempVehicleData.colour1 = 0;
		tempVehicleData.colour2 = 0;
		tempVehicleData.colour3 = 0;
		tempVehicleData.colour4 = 0;
	}

	serverData.vehicles.push(tempVehicleData);

	setAllVehicleIndexes();
}

// ===========================================================================

function createTemporaryVehicle(modelIndex, position, rotation, interior = 0, dimension = 0, whoAdded = defaultNoAccountId) {
	let vehicle = createGameVehicle(modelIndex, position, rotation);

	if (vehicle == null) {
		return false;
	}

	setElementRotation(vehicle, rotation);
	setElementInterior(vehicle, interior);
	setElementDimension(vehicle, dimension);
	addToWorld(vehicle);

	let tempVehicleData = new VehicleData(false, vehicle);
	tempVehicleData.model = modelIndex;
	tempVehicleData.databaseId = -1;
	tempVehicleData.interior = interior;
	tempVehicleData.dimension = dimension;
	tempVehicleData.needsSaved = true;
	tempVehicleData.whoAdded = whoAdded;
	tempVehicleData.whenAdded = getCurrentUnixTimestamp();

	if (!isGameFeatureSupported("vehicleColour")) {
		tempVehicleData.colour1 = 0;
		tempVehicleData.colour2 = 0;
		tempVehicleData.colour3 = 0;
		tempVehicleData.colour4 = 0;
	}

	serverData.vehicles.push(tempVehicleData);

	setAllVehicleIndexes();

	return vehicle;
}

// ===========================================================================

function createPermanentVehicle(modelIndex, position, rotation, interior = 0, dimension = 0, whoAdded = defaultNoAccountId) {
	let vehicle = createGameVehicle(modelIndex, position, rotation);

	if (vehicle == null) {
		return false;
	}

	setElementRotation(vehicle, rotation);
	setElementInterior(vehicle, interior);
	setElementDimension(vehicle, dimension);
	addToWorld(vehicle);

	let tempVehicleData = new VehicleData(false, vehicle);
	tempVehicleData.model = modelIndex;
	tempVehicleData.interior = interior;
	tempVehicleData.dimension = dimension;
	tempVehicleData.needsSaved = true;
	tempVehicleData.whoAdded = whoAdded;
	tempVehicleData.whenAdded = getCurrentUnixTimestamp();

	if (!isGameFeatureSupported("vehicleColour")) {
		tempVehicleData.colour1 = 0;
		tempVehicleData.colour2 = 0;
		tempVehicleData.colour3 = 0;
		tempVehicleData.colour4 = 0;
	}

	serverData.vehicles.push(tempVehicleData);

	setAllVehicleIndexes();

	return vehicle;
}

// ===========================================================================

function processVehiclePurchasing() {
	logToConsole(LOG_VERBOSE, `[V.RP.Event] Processing vehicle purchasing ...`);

	if (!globalConfig.useServerSideVehiclePurchaseCheck) {
		logToConsole(LOG_VERBOSE | LOG_WARN, `[V.RP.Event] Aborting process vehicle purchasing! Server side vehicle purchase check is disabled.`);
		return false;
	}

	serverData.purchasingVehicleCache.forEach(function (client) {
		checkVehiclePurchasing(client);
	});

	return true;
}

// ===========================================================================

function checkVehiclePurchasing(client) {
	logToConsole(LOG_VERBOSE, `[V.RP.Event] Checking purchasing for player ${getPlayerDisplayForConsole(client)}! Server side vehicle purchase check is disabled.`);

	if (client == null) {
		logToConsole(LOG_VERBOSE | LOG_WARN, `[V.RP.Event] Aborting vehicle purchasing for player ${getPlayerDisplayForConsole(client)}! Client is null.`);
		return false;
	}

	if (getPlayerData(client) == null) {
		logToConsole(LOG_VERBOSE | LOG_WARN, `[V.RP.Event] Aborting vehicle purchasing for player ${getPlayerDisplayForConsole(client)}! Player data is null.`);
		setPlayerBuyingVehicleState(client, V_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if (!isPlayerLoggedIn(client)) {
		logToConsole(LOG_VERBOSE | LOG_WARN, `[V.RP.Event] Aborting vehicle purchasing for player ${getPlayerDisplayForConsole(client)}! Player is not logged in.`);
		setPlayerBuyingVehicleState(client, V_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if (!isPlayerSpawned(client)) {
		logToConsole(LOG_VERBOSE | LOG_WARN, `[V.RP.Event] Aborting vehicle purchasing for player ${getPlayerDisplayForConsole(client)}! Player is not spawned.`);
		setPlayerBuyingVehicleState(client, V_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if (getPlayerData(client).buyingVehicle == null) {
		logToConsole(LOG_VERBOSE | LOG_WARN, `[V.RP.Event] Aborting vehicle purchasing for player ${getPlayerDisplayForConsole(client)}! Buying vehicle is null.`);
		setPlayerBuyingVehicleState(client, V_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if (!isPlayerInAnyVehicle(client)) {
		if (getPlayerData(client).buyingVehicle != null) {
			serverData.purchasingVehicleCache.splice(serverData.purchasingVehicleCache.indexOf(client), 1);
			messagePlayerError(client, getLocaleString(client, "DealershipPurchaseExitedVehicle"));
			respawnVehicle(getPlayerData(client).buyingVehicle);
			getPlayerData(client).buyingVehicle = null;
			setPlayerBuyingVehicleState(client, V_VEHBUYSTATE_NONE, null, null);
			logToConsole(LOG_VERBOSE | LOG_WARN, `[V.RP.Event] Aborting vehicle purchasing for player ${getPlayerDisplayForConsole(client)}! Player exited vehicle.`);
		}
		return false;
	}

	let buyingVehicle = getPlayerData(client).buyingVehicle;
	let buyingVehicleData = getVehicleData(buyingVehicle);

	if (getDistance(getVehiclePosition(buyingVehicle), buyingVehicleData.spawnPosition) > globalConfig.buyVehicleDriveAwayDistance) {
		if (getPlayerCurrentSubAccount(client).cash < buyingVehicleData.buyPrice) {
			serverData.purchasingVehicleCache.splice(serverData.purchasingVehicleCache.indexOf(client), 1);
			messagePlayerError(client, getLocaleString(client, "VehiclePurchaseNotEnoughMoney"));
			respawnVehicle(buyingVehicle);
			getPlayerData(client).buyingVehicle = null;
			setPlayerBuyingVehicleState(client, V_VEHBUYSTATE_NONE, null, null);
			logToConsole(LOG_VERBOSE | LOG_WARN, `[V.RP.Event] Aborting vehicle purchasing for player ${getPlayerDisplayForConsole(client)}! Player doesn't have enough money.`);
			return false;
		}

		serverData.purchasingVehicleCache.splice(serverData.purchasingVehicleCache.indexOf(client), 1);
		if (buyingVehicleData.ownerType == V_VEH_OWNER_BIZ) {
			getBusinessData(getBusinessIndexFromDatabaseId(buyingVehicleData.ownerId)).till += (buyingVehicleData.buyPrice - (buyingVehicleData.buyPrice * incomeTaxRate));
			createNewDealershipVehicle(buyingVehicleData.model, buyingVehicleData.spawnPosition, buyingVehicleData.spawnRotation, buyingVehicleData.buyPrice, buyingVehicleData.ownerType, buyingVehicleData.ownerId);
		} else if (buyingVehicleData.ownerType == V_VEH_OWNER_NONE) {
			createPermanentVehicle(buyingVehicleData.model, buyingVehicleData.spawnPosition, buyingVehicleData.spawnRotation, buyingVehicleData.buyPrice);
		}
		takePlayerCash(client, buyingVehicleData.buyPrice);
		updatePlayerCash(client);
		buyingVehicleData.ownerId = getPlayerCurrentSubAccount(client).databaseId;
		buyingVehicleData.ownerType = V_VEH_OWNER_PLAYER;
		buyingVehicleData.buyPrice = 0;
		buyingVehicleData.rentPrice = 0;
		buyingVehicleData.spawnLocked = false;
		getPlayerData(client).buyingVehicle = null;
		messagePlayerSuccess(client, getLocaleString(client, "VehiclePurchaseComplete"));
		setPlayerBuyingVehicleState(client, V_VEHBUYSTATE_NONE, null, null);
		return true;
	}
}

// ===========================================================================

function processVehicleBurning() {
	if (!globalConfig.useServerSideVehicleBurnCheck) {
		return false;
	}

	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for (let i in vehicles) {
		if (vehicles[i].syncer == null) {
			if (vehicles[i].health <= 250) {
				vehicles[i].health = 250;
			}
		}
	}
}

// ===========================================================================

function cacheAllVehicleItems() {
	for (let i in serverData.vehicles) {
		serverData.vehicles[i].trunkItemCache = [];
		serverData.vehicles[i].dashItemCache = [];
		for (let j in serverData.items) {
			if (serverData.items[j] != null) {
				if (getItemData(j).ownerType == V_ITEM_OWNER_VEHTRUNK && getItemData(j).ownerId == serverData.vehicles[i].databaseId) {
					serverData.vehicles[i].trunkItemCache.push(j);
				} else if (getItemData(j).ownerType == V_ITEM_OWNER_VEHDASH && getItemData(j).ownerId == serverData.vehicles[i].databaseId) {
					serverData.vehicles[i].dashItemCache.push(j);
				}
			}
		}
	}
}

// ===========================================================================

function resetVehiclePosition(vehicle) {
	if (!getVehicleData(vehicle).spawnLocked) {
		getVehicleData(vehicle).spawnPosition = getVehiclePosition(vehicle);
		getVehicleData(vehicle).spawnHeading = getVehiclePosition(vehicle);
	}
}

// ===========================================================================

function setAllVehicleIndexes() {
	for (let i in serverData.vehicles) {
		serverData.vehicles[i].index = i;

		if (serverData.vehicles[i].streamingRadioStation != 0) {
			serverData.vehicles[i].streamingRadioStationIndex = getRadioStationIdFromDatabaseId(serverData.vehicles[i].streamingRadioStation);
		}
	}
}

// ===========================================================================

function doesVehicleHaveMegaphone(vehicle) {
	if (getVehicleData(vehicle).ownerType == V_VEH_OWNER_JOB) {
		if (getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == V_JOB_POLICE) {
			return true;
		}

		if (getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == V_JOB_FIRE) {
			return true;
		}

		if (getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == V_JOB_MEDICAL) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getVehicleFromDatabaseId(databaseId) {
	let vehicles = serverData.vehicles;
	for (let i in vehicles) {
		if (vehicles[i].databaseId == databaseId) {
			return vehicles[i].vehicle;
		}
	}
}

// ===========================================================================

function isVehicleUnoccupied(vehicle) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].player != null) {
			if (clients[i].player.vehicle != false) {
				if (clients[i].player.vehicle == vehicle) {
					return false;
				}
			}
		}
	}

	return true;
}

// ===========================================================================

function getClosestTaxi(position) {
	getElementsByTypeInRange(ELEMENT_VEHICLE, position, 25)
		.filter(v => isTaxiVehicle(vehicles[i]))
		.reduce((i, j) => ((i.position.distance(position) <= j.position.distance(position)) ? i : j));
}

// ===========================================================================

function getVehicleTrunkPosition(vehicle) {
	return getPosBehindPos(getVehiclePosition(vehicle), getVehicleHeading(vehicle), globalConfig.vehicleTrunkDistance);
}

// ===========================================================================

function removeAllOccupantsFromVehicle(vehicle) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].player != null) {
			if (clients[i].player.vehicle != false) {
				if (clients[i].player.vehicle == vehicle) {
					removePedFromVehicle(getPlayerPed(clients[i]));
				}
			}
		}
	}
}

// ===========================================================================

function getVehicleColourInfoString(colour, isRGBA) {
	if (isRGBA) {
		let arrayColour = rgbaArrayFromToColour(colour);
		return `RGBA [${arrayColour[0]}, ${arrayColour[1]}, ${arrayColour[2]}, ${arrayColour[3]}]`;
	} else {
		return `GAME [${colour}]`;
	}
}

// ===========================================================================

function toggleVehicleCruiseControlCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		return false;
	}

	if (!isPlayerInVehicleDriverSeat(client)) {
		return false;
	}

	sendPlayerToggleVehicleCruiseControl(client);
}

// ===========================================================================

function isPlayerInVehicleDriverSeat(client) {
	if (!isPlayerInAnyVehicle(client)) {
		return false;
	}

	if (getPlayerVehicleSeat(client) == 0) {
		return true;
	}

	return false;
}

// ===========================================================================

function despawnAllVehicles() {
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].vehicle != false) {
			deleteGameElement(serverData.vehicles[i].vehicle);
			serverData.vehicles[i].vehicle = false;
		}
	}

	setAllVehicleIndexes();
}

// ===========================================================================

function updateVehicleSavedPositions() {
	logToConsole(LOG_DEBUG, `[V.RP.Vehicle] Updating all vehicle's saved positions ...`);

	for (let i in serverData.vehicles) {
		updateVehicleSavedPosition(i);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Vehicle] Updated all vehicle's saved positions`);
}

// ===========================================================================

function updateVehicleSavedPosition(vehicleId) {
	if (serverData.vehicles[vehicleId].vehicle == null) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.Vehicle] Failed to update saved position for vehicle ${vehicleId}. Vehicle is null`);
		return false;
	}

	if (!serverData.vehicles[vehicleId].spawnLocked) {
		if (!isVehicleUnoccupied(serverData.vehicles[vehicleId].vehicle)) {
			serverData.vehicles[vehicleId].spawnPosition = getVehiclePosition(serverData.vehicles[vehicleId].vehicle);
			serverData.vehicles[vehicleId].spawnRotation = getVehicleRotation(serverData.vehicles[vehicleId].vehicle);
			serverData.vehicles[vehicleId].dimension = getElementDimension(serverData.vehicles[vehicleId].vehicle);
		}
	}
}

// ===========================================================================

function getVehicleDataIndexFromVehicle(vehicle) {
	if (isVehicleObject(vehicle)) {
		for (let i in serverData.vehicles) {
			if (serverData.vehicles[i].vehicle == vehicle) {
				return i;
			}
		}
	}

	return -1;
}

// ===========================================================================

function doesVehicleHaveTransmitRadio(vehicle) {
	if (getVehicleData(vehicle).ownerType == V_VEH_OWNER_JOB) {
		if (getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == V_JOB_POLICE) {
			return true;
		}

		if (getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == V_JOB_FIRE) {
			return true;
		}

		if (getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == V_JOB_MEDICAL) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function setAllVehicleRadioFrequencies() {
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].ownerType == V_VEH_OWNER_JOB) {
			if (getJobData(getJobIdFromDatabaseId(serverData.vehicles[i].ownerId)) != null) {
				serverData.vehicles[i].radioFrequency = getJobData(getJobIdFromDatabaseId(serverData.vehicles[i].ownerId)).radioFrequency;
			}
		}
	}
}

// ===========================================================================

function showVehicleInfoToPlayer(client, vehicleData) {
	let ownerName = "Nobody";
	let ownerType = "None";
	switch (vehicleData.ownerType) {
		case V_VEH_OWNER_CLAN:
			ownerName = getClanData(getClanIndexFromDatabaseId(vehicleData.ownerId)).name;
			ownerType = "clan";
			break;

		case V_VEH_OWNER_JOB:
			ownerName = getJobData(getJobIdFromDatabaseId(vehicleData.ownerId)).name;
			ownerType = "job";
			break;

		case V_VEH_OWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(vehicleData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			ownerType = "player";
			break;

		case V_VEH_OWNER_BIZ:
			ownerName = getBusinessData(getBusinessIndexFromDatabaseId(vehicleData.ownerId)).name;
			ownerType = "business";
			break;

		case V_VEH_OWNER_PUBLIC:
			ownerName = "Nobody";
			ownerType = "public";
			break;

		default:
			break;
	}

	let tempStats = [
		[`Type`, `${gameData.vehicles[getGame()][vehicleData.model][1]} (${gameData.vehicles[getGame()][vehicleData.model][0]})`],
		[`ID`, `${vehicleData.index}/${vehicleData.databaseId}`],
		[`Owner`, `${ownerName} (${getVehicleOwnerTypeText(vehicleData.ownerType)})`],
		[`Locked`, `${getYesNoFromBool(vehicleData.locked)}`],
		[`Engine`, `${getOnOffFromBool(vehicleData.engine)}`],
		[`Lights`, `${getOnOffFromBool(vehicleData.lights)}`],
		[`Buy Price`, `${getCurrencyString(vehicleData.buyPrice)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(vehicleData.buyPrice))})`],
		[`Rent Price`, `${getCurrencyString(vehicleData.rentPrice)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(vehicleData.rentPrice))})`],
		[`Radio Station`, `${(getRadioStationData(vehicleData.streamingRadioStationIndex) == null) ? "None" : getRadioStationData(vehicleData.streamingRadioStationIndex).name}`],
		[`Parked`, `${getYesNoFromBool(vehicleData.spawnLocked)}`],
		[`License Plate`, `${vehicleData.licensePlate}`],
		[`Colour`, `${getVehicleColourInfoString(vehicleData.colour1, vehicleData.colour1IsRGBA)}, ${getVehicleColourInfoString(vehicleData.colour1, vehicleData.colour1IsRGBA)}`],
		[`Last Driver`, `${vehicleData.lastDriverName}`],
		[`Added By`, `${loadAccountFromId(vehicleData.whoAdded).name}`],
		[`Added On`, `${new Date(vehicleData.whenAdded).toLocaleDateString("en-GB")}`],
		[`Rank Level`, `${vehicleData.rank}`],
	];

	let stats = tempStats.map(stat => `{chatBoxListIndex}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderVehicleInfo")));
	let chunkedList = splitArrayIntoChunks(stats, 6);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function despawnVehicle(vehicleData) {
	if (vehicleData.vehicle != null) {
		deleteGameElement(vehicleData.vehicle);
		vehicleData.vehicle = null;
	}
}

// ===========================================================================

function forceAllVehicleEngines(state) {
	globalConfig.forceAllVehicleEngines = state;

	if (state != 0) {
		for (let i in serverData.vehicles) {
			serverData.vehicles[i].engine = (state == 1) ? false : true;
			setVehicleEngine(serverData.vehicles[i].vehicle, serverData.vehicles[i].engine);
		}
	}
}

// ===========================================================================

function listPersonalVehiclesCommand(command, params, client) {
	let vehicles = getAllVehiclesOwnedByPlayer(client);

	let vehiclesList = vehicles.map(function (x) {
		let location = `${Math.round(getDistance(getPlayerPosition(client), getVehiclePosition(x.vehicle)))} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), getVehiclePosition(x.vehicle)))))}`;
		return `{chatBoxListIndex}${x.index}/${x.databaseId}: {MAINCOLOUR}${getVehicleName(x.vehicle)} {mediumGrey}(${location})`;
	});
	let chunkedList = splitArrayIntoChunks(vehiclesList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerVehiclesList", getCharacterFullName(client))));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function listClanVehiclesCommand(command, params, client) {
	let clanIndex = getPlayerClan(client);

	if (!areParamsEmpty(params) && doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
		clanIndex = getClanFromParams(params);
	}

	if (getClanData(clanIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let vehicles = getAllVehiclesOwnedByClan(clanIndex);

	let vehiclesList = vehicles.map(function (x) {
		return `{chatBoxListIndex}${x.index}/${x.databaseId}: {MAINCOLOUR}${getVehicleName(x.vehicle)} {mediumGrey}(${Math.round(getDistance(getPlayerPosition(client), getVehiclePosition(x.vehicle)))} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), getVehiclePosition(x.vehicle)))))})`;
	});
	let chunkedList = splitArrayIntoChunks(vehiclesList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderClanVehiclesList", getClanData(clanIndex).name)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function listJobVehiclesCommand(command, params, client) {
	let jobIndex = getPlayerJob(client);

	if (!areParamsEmpty(params) && doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
		jobIndex = getJobFromParams(params);
	}

	if (getJobData(jobIndex) == false) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	let vehicles = getAllVehiclesOwnedByJob(jobIndex);

	let vehiclesList = vehicles.map(function (x) {
		return `{chatBoxListIndex}${x.index}/${x.databaseId}: {MAINCOLOUR}${getVehicleName(x.vehicle)} {mediumGrey}(${Math.round(getDistance(getPlayerPosition(client), getVehiclePosition(x.vehicle)))} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), getVehiclePosition(x.vehicle)))))})`;
	});
	let chunkedList = splitArrayIntoChunks(vehiclesList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobVehiclesList", getJobData(jobIndex).name)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function setVehicleBurning(vehicle, state) {
	getVehicleData(vehicle).burning = state;

	if (state == true) {
		serverData.burningVehiclesCache.push(vehicle);
	} else {
		serverData.burningVehiclesCache = serverData.burningVehiclesCache.filter(x => x != vehicle);
	}
	return true;
}

// ===========================================================================

function processVehicleBurning() {
	for (let i in serverData.burningVehiclesCache) {
		let vehicle = serverData.burningVehiclesCache[i];
		if (vehicle != null) {
			if (getGame() <= V_GAME_GTA_SA) {
				setVehicleHealth(vehicle, 250);
			}
		}
	}
}

// ===========================================================================

function deleteVehicle(vehicle) {
	if (vehicle == null) {
		return false;
	}

	let vehicleIndex = getVehicleData(vehicle).index;

	if (getVehicleData(vehicle).databaseId > 0) {
		quickDatabaseQuery(`UPDATE veh_main SET veh_deleted = 1 WHERE veh_id = ${getVehicleData(vehicle).databaseId}`);
	}

	serverData.vehicles.splice(vehicleIndex, 1);

	deleteGameElement(vehicle);

	setAllVehicleIndexes();
}

// ===========================================================================