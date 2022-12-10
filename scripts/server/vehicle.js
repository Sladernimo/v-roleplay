// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: vehicle.js
// DESC: Provides vehicle functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Vehicle Owner Types
const AGRP_VEHOWNER_NONE = 0;                     // Not owned
const AGRP_VEHOWNER_PLAYER = 1;                   // Owned by a player (character/subaccount)
const AGRP_VEHOWNER_JOB = 2;                      // Owned by a job
const AGRP_VEHOWNER_CLAN = 3;                     // Owned by a clan
const AGRP_VEHOWNER_FACTION = 4;                  // Owned by a faction (not used at the moment)
const AGRP_VEHOWNER_PUBLIC = 5;                   // Public vehicle. Anybody can drive it.
const AGRP_VEHOWNER_BIZ = 6;                      // Owned by a business (also includes dealerships since they're businesses)

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
		this.syncHeading = 0.0;

		// Ownership
		this.ownerType = AGRP_VEHOWNER_NONE;
		this.ownerId = 0;
		this.buyPrice = 0;
		this.rentPrice = 0;
		this.rentedBy = false;
		this.rentStart = 0;

		// Position and Rotation
		this.spawnPosition = (vehicle) ? vehicle.position : toVector3(0.0, 0.0, 0.0);
		this.spawnRotation = (vehicle) ? vehicle.heading : 0.0;
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

		this.trunkItemCache = [];
		this.dashItemCache = [];

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

		this.lastActiveTime = false;

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
			this.spawnRotation = toInteger(dbAssoc["veh_rot_z"]);
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
		}
	}

	saveToDatabase() {
		saveVehicleToDatabase(this);
	}

	respawn() {
		respawnVehicle(this.vehicle);
	}
};

// ===========================================================================

function initVehicleScript() {
	logToConsole(LOG_INFO, "[AGRP.Vehicle]: Initializing vehicle script ...");
	logToConsole(LOG_INFO, "[AGRP.Vehicle]: Vehicle script initialized successfully!");
	return true;
}

// ===========================================================================

function loadVehiclesFromDatabase() {
	logToConsole(LOG_INFO, "[AGRP.Vehicle]: Loading vehicles from database ...");
	let dbConnection = connectToDatabase();
	let tempVehicles = [];
	let dbAssoc;
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM veh_main WHERE veh_server = ${getServerId()} AND veh_deleted = 0`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			while (dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempVehicleData = new VehicleData(dbAssoc);
				tempVehicles.push(tempVehicleData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[AGRP.Vehicle]: ${tempVehicles.length} vehicles loaded from database successfully!`);
	return tempVehicles;
}

// ===========================================================================

function saveAllVehiclesToDatabase() {
	if (getServerConfig().devServer) {
		return false;
	}

	logToConsole(LOG_DEBUG, "[AGRP.Vehicle]: Saving all server vehicles to database ...");
	let vehicles = getServerData().vehicles;
	for (let i in vehicles) {
		if (vehicles[i].needsSaved) {
			saveVehicleToDatabase(i);
		}
	}
	logToConsole(LOG_INFO, "[AGRP.Vehicle]: Saved all server vehicles to database!");

	return true;
}

// ===========================================================================

function saveVehicleToDatabase(vehicleDataId) {
	if (getVehicleData(vehicleDataId) == null) {
		// Invalid vehicle data
		return false;
	}

	let tempVehicleData = getServerData().vehicles[vehicleDataId];

	if (tempVehicleData.databaseId == -1) {
		// Temp vehicle, no need to save
		return false;
	}

	if (!tempVehicleData.needsSaved) {
		// Vehicle hasn't changed. No need to save.
		return false;
	}

	logToConsole(LOG_VERBOSE, `[AGRP.Vehicle]: Saving vehicle ${tempVehicleData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		if (tempVehicleData.vehicle != false) {
			if (!tempVehicleData.spawnLocked) {
				if (areServerElementsSupported()) {
					tempVehicleData.spawnPosition = tempVehicleData.vehicle.position;
					tempVehicleData.spawnRotation = tempVehicleData.vehicle.heading;
				} else {
					tempVehicleData.spawnPosition = tempVehicleData.syncPosition;
					tempVehicleData.spawnRotation = tempVehicleData.syncHeading;
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
			["veh_rot_z", toFloat(tempVehicleData.spawnRotation)],
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
			["veh_radio_station", (getRadioStationData(tempVehicleData.streamingRadioStationIndex) != false) ? toInteger(getRadioStationData(tempVehicleData.streamingRadioStationIndex).databaseId) : -1],
		];

		let dbQuery = null;
		if (tempVehicleData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("veh_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			getServerData().vehicles[vehicleDataId].databaseId = getDatabaseInsertId(dbConnection);
			getServerData().vehicles[vehicleDataId].needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("veh_main", data, `veh_id=${tempVehicleData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString, true);
			getServerData().vehicles[vehicleDataId].needsSaved = false;
		}

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[AGRP.Vehicle]: Saved vehicle ${vehicleDataId} to database!`);

	return false;
}

// ===========================================================================

function spawnAllVehicles() {
	for (let i in getServerData().vehicles) {
		let vehicle = spawnVehicle(getServerData().vehicles[i]);
		getServerData().vehicles[i].vehicle = vehicle;
		setEntityData(vehicle, "agrp.dataSlot", i, false);
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
		let dataIndex = getEntityData(vehicle, "agrp.dataSlot");
		if (typeof getServerData().vehicles[dataIndex] != "undefined") {
			return getServerData().vehicles[dataIndex];
		}
	}

	return false;
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
	if (getGame() == AGRP_GAME_MAFIA_ONE) {
		heading = degToRad(getPlayerHeading(client));
	}

	let frontPos = getPosInFrontOfPos(getPlayerPosition(client), getPlayerHeading(client), getGlobalConfig().spawnCarDistance);
	let vehicle = createPermanentVehicle(modelIndex, frontPos, heading, getPlayerInterior(client), getPlayerDimension(client));

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

	let frontPos = getPosInFrontOfPos(getPlayerPosition(client), getPlayerHeading(client), getGlobalConfig().spawnCarDistance);
	let vehicle = createTemporaryVehicle(modelIndex, frontPos, getPlayerHeading(client), getPlayerInterior(client), getPlayerDimension(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a temporary {vehiclePurple}${getVehicleName(vehicle)}`, true);
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
		return `{ALTCOLOUR}${getVehicleData(x).index}: {MAINCOLOUR}${getVehicleName(x)} {mediumGrey}(${toFloat(getDistance(getPlayerPosition(client), getVehiclePosition(x))).toFixed(2)} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), getVehiclePosition(x)))))})`;
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

	let behindPosition = getPosBehindPos(getVehiclePosition(vehicle), getVehicleHeading(vehicle), getGlobalConfig().vehicleTrunkDistance);
	if (!getPlayerVehicle(client) && getDistance(behindPosition, getPlayerPosition(client)) > getGlobalConfig().vehicleTrunkDistance) {
		messagePlayerError(client, getLocaleString(client, "MustBeInOrNearVehicle"));
		return false;
	}

	if (!getVehicleData(vehicle)) {
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

function vehicleLightsCommand(command, params, client) {
	if (!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (getPlayerVehicleSeat(client) > 1) {
		messagePlayerError(client, getLocaleString(client, "MustBeInVehicleFrontSeat"));
		return false;
	}

	getVehicleData(vehicle).lights = !getVehicleData(vehicle).lights;
	getVehicleData(vehicle).needsSaved = true;
	setVehicleLightsState(vehicle, getVehicleData(vehicle).lights);

	meActionToNearbyPlayers(client, `turned the ${getVehicleName(vehicle)}'s lights ${toLowerCase(getOnOffFromBool(getVehicleData(vehicle).lights))}`);
}

// ===========================================================================

function deleteVehicleCommand(command, params, client) {
	if (!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let dataIndex = getEntityData(vehicle, "agrp.dataSlot");
	let vehicleName = getVehicleName(vehicle);

	quickDatabaseQuery(`UPDATE veh_main SET veh_deleted = 1 WHERE veh_id = ${getVehicleData(vehicle).databaseId}`);

	getServerData().vehicles.splice(dataIndex, 1);
	destroyElement(vehicle);

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

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	getVehicleData(vehicle).engine = !getVehicleData(vehicle).engine;
	vehicle.engine = getVehicleData(vehicle).engine;
	setEntityData(vehicle, "agrp.engine", getVehicleData(vehicle).engine, true);

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

	if (!getVehicleData(vehicle)) {
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
	vehicle.siren = getVehicleData(vehicle).siren;

	getVehicleData(vehicle).needsSaved = true;

	meActionToNearbyPlayers(client, `turns the ${getVehicleName(vehicle)}'s siren ${toLowerCase(getOnOffFromBool(getVehicleData(vehicle).siren))}`);
}

// ===========================================================================

function vehicleAdminColourCommand(command, params, client) {
	if (areParamsEmpty(params) && areThereEnoughParams(params, 2)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let colour1 = toInteger(getParam(params, " ", 1)) || 0;
	let colour2 = toInteger(getParam(params, " ", 2)) || 0;

	//takePlayerCash(client, getGlobalConfig().resprayVehicleCost);
	//updatePlayerCash(client);
	vehicle.colour1 = colour1;
	vehicle.colour2 = colour2;
	getVehicleData(vehicle).colour1 = colour1;
	getVehicleData(vehicle).colour2 = colour2;

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

	if (!getVehicleData(vehicle)) {
		logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} could not repair their ${getVehicleName(vehicle)} vehicle. Not a server vehicle.`);
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} repaired their ${getVehicleName(vehicle)} vehicle`);
	//takePlayerCash(client, getGlobalConfig().repairVehicleCost);
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

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	//if (getPlayerCurrentSubAccount(client).cash < getGlobalConfig().repairVehicleCost) {
	//	messagePlayerError(client, `You don't have enough money to change the vehicle's livery (need ${getCurrencyString(getGlobalConfig().resprayVehicleCost - getPlayerCurrentSubAccount(client).cash)} more!)`);
	//	return false;
	//}

	let livery = toInteger(params) || 3;

	takePlayerCash(client, getGlobalConfig().resprayVehicleCost);
	updatePlayerCash(client);
	getVehicleData(vehicle).livery = livery;
	getVehicleData(vehicle).needsSaved = true;

	setEntityData(vehicle, "agrp.livery", livery, true);
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

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (getVehicleData(vehicle).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "VehicleNotForSale"));
		return false;
	}

	if (doesPlayerOwnVehicle(client, vehicle)) {
		messagePlayerError(client, getLocaleString(client, "AlreadyOwnVehicle"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).cash < getVehicleData(vehicle).buyPrice) {
		messagePlayerError(client, getLocaleString(client, "VehiclePurchaseNotEnoughMoney"));
		return false;
	}

	getPlayerData(client).buyingVehicle = vehicle;
	getVehicleData(vehicle).engine = true;
	vehicle.engine = true;
	setEntityData(vehicle, "agrp.engine", getVehicleData(vehicle).engine, true);

	getVehicleData(vehicle).needsSaved = true;
	setPlayerBuyingVehicleState(client, AGRP_VEHBUYSTATE_TESTDRIVE, vehicle.id, getVehiclePosition(vehicle));
	meActionToNearbyPlayers(client, `receives a set of keys to test drive the ${getVehicleName(vehicle)} and starts the engine`);
	messagePlayerInfo(client, getLocaleString(client, "DealershipPurchaseTestDrive"));
	getServerData().purchasingVehicleCache.push(client);
}

// ===========================================================================

function rentVehicleCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (getVehicleData(vehicle).rentPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "VehicleNotForRent"));
		return false;
	}

	if (getPlayerData(client).rentingVehicle) {
		messagePlayerAlert(client, getLocaleString(client, "StoppedRentingVehicle"));
		stopRentingVehicle(client);
		return false;
	}

	if (getVehicleData(vehicle).rentedBy != false) {
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
	getServerData().rentingVehicleCache.push(client);
	getVehicleData(vehicle).needsSaved = true;

	meActionToNearbyPlayers(client, `rents the ${getVehicleName(vehicle)} and receives a set of vehicle keys!`);
	messagePlayerAlert(client, getLocaleString(client, "StartedRentingVehicle", `{ALTCOLOUR}${getVehicleName(vehicle)}{MAINCOLOUR}`, `{ALTCOLOUR}${getCurrencyString(getVehicleData(vehicle).rentPrice)}{MAINCOLOUR}`, `{ALTCOLOUR}/vehstoprent{MAINCOLOUR}`));

	if (!getVehicleData(vehicle).engine) {
		if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "engine")) {
			messagePlayerAlert(client, getLocaleString(client, "VehicleEngineStartCommandTip", `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "engine").key))}{MAINCOLOUR}`));
		} else {
			messagePlayerAlert(client, getLocaleString(client, "VehicleEngineStartKeyPressTip", `{ALTCOLOUR}/engine{MAINCOLOUR}`));
		}
	}
}

// ===========================================================================

function enterVehicleAsPassengerCommand(command, params, client) {
	sendNetworkEventToPlayer("agrp.passenger", client);
}

// ===========================================================================

function stopRentingVehicleCommand(command, params, client) {
	if (!getPlayerData(client).rentingVehicle) {
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

	if (vehicleData.ownerType == AGRP_VEHOWNER_PUBLIC) {
		return true;
	}

	if (vehicleData.ownerType == AGRP_VEHOWNER_PLAYER) {
		if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if (vehicleData.ownerType == AGRP_VEHOWNER_CLAN) {
		if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).clan) {
			if (vehicleData.clanRank <= getPlayerCurrentSubAccount(client).clanRank) {
				return true;
			}
		}
	}

	if (vehicleData.ownerType == AGRP_VEHOWNER_FACTION) {
		if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).faction) {
			if (vehicleData.factionRank <= getPlayerCurrentSubAccount(client).factionRank) {
				return true;
			}
		}
	}

	if (vehicleData.ownerType == AGRP_VEHOWNER_JOB) {
		if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).job) {
			return true;
		}
	}

	if (vehicleData.rentedBy == client) {
		return true;
	}

	return false;
}

// ===========================================================================

function canPlayerManageVehicle(client, vehicle) {
	let vehicleData = getVehicleData(vehicle);

	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
		return true;
	}

	if (vehicleData.ownerType == AGRP_VEHOWNER_PLAYER) {
		if (vehicleData.ownerId == getPlayerData(client).accountData.databaseId) {
			return true;
		}
	}

	if (vehicleData.ownerType == AGRP_VEHOWNER_CLAN) {
		if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).clan) {
			if (doesPlayerHaveClanPermission(client, "ManageVehicles") || doesPlayerHaveClanPermission(client, "owner")) {
				return true;
			}
		}
	}

	if (vehicleData.ownerType == AGRP_VEHOWNER_BIZ) {
		if (canPlayerManageBusiness(client, getBusinessIdFromDatabaseId(vehicleData.ownerId))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function doesPlayerOwnVehicle(client, vehicle) {
	let vehicleData = getVehicleData(vehicle);

	if (vehicleData.ownerType == AGRP_VEHOWNER_PLAYER) {
		if (vehicleData.ownerId == getPlayerData(client).accountData.databaseId) {
			return true;
		}
	}

	if (vehicleData.ownerType == AGRP_VEHOWNER_CLAN) {
		if (vehicleData.ownerId == getPlayerCurrentSubAccount(client).clan) {
			if (doesPlayerHaveClanPermission(client, "ManageVehicles") || doesPlayerHaveClanPermission(client, "owner")) {
				return true;
			}
		}
	}

	if (vehicleData.ownerType == AGRP_VEHOWNER_BIZ) {
		if (canPlayerManageBusiness(client, getBusinessIdFromDatabaseId(vehicleData.ownerId))) {
			return true;
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

	if (!getVehicleData(vehicle)) {
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

	getVehicleData(vehicle).ownerType = AGRP_VEHOWNER_JOB;
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

	let vehicle = getPlayerVehicle(client);
	let rankId = params;

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (getVehicleData(vehicle).ownerType == AGRP_VEHOWNER_CLAN) {
		rankId = getClanRankFromParams(getVehicleData(vehicle).ownerId, params);
		if (!getClanRankData(getVehicleData(vehicle).ownerId, rankId)) {
			messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
			return false;
		}
		getVehicleData(vehicle).rank = getClanRankData(getVehicleData(vehicle).ownerId, rankId).databaseId;
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} minimum rank to {ALTCOLOUR}${getClanRankData(getVehicleData(vehicle).ownerId, rankId).name}{MAINCOLOUR} of the {clanOrange}${getClanData(getVehicleData(vehicle).ownerId).name}{MAINCOLOUR} clan!`, true);
	} else if (getVehicleData(vehicle).ownerType == AGRP_VEHOWNER_JOB) {
		getVehicleData(vehicle).rank = rankId;
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} minimum rank to {ALTCOLOUR}${rankId}{MAINCOLOUR} of the {jobYellow}${getJobData(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)).name}{MAINCOLOUR} job!`, true);
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

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (getVehicleData(vehicle).ownerType != AGRP_VEHOWNER_PLAYER) {
		messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
		return false;
	}

	if (getVehicleData(vehicle).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
		messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "SetVehicleClanConfirmMessage"), getLocaleString(client, "SetVehicleClanConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = AGRP_PROMPT_GIVEVEHTOCLAN;

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehicleBusinessCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let businessId = getClosestBusinessEntrance(client);

	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses")) && !isNull(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getVehicleData(vehicle).ownerType = AGRP_VEHOWNER_BIZ;
	getVehicleData(vehicle).ownerId = getBusinessData(businessId).databaseId;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} owner to the {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}business`, true);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehicleOwnerCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let targetClient = getPlayerFromParams(params);

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	getVehicleData(vehicle).ownerType = AGRP_VEHOWNER_PLAYER;
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

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	getVehicleData(vehicle).ownerType = AGRP_VEHOWNER_PUBLIC;
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

	if (!getVehicleData(vehicle)) {
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

	if (!getVehicleData(vehicle)) {
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

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}'s{MAINCOLOUR} buy price to {ALTCOLOUR}${getCurrencyString(amount)}`, true);
}

// ===========================================================================

function removeVehicleOwnerCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let targetClient = getPlayerFromParams(params);

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	getVehicleData(vehicle).ownerType = AGRP_VEHOWNER_NONE;
	getVehicleData(vehicle).ownerId = 0;

	getVehicleData(vehicle).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} owner to nobody!`, true);
	messagePlayerInfo(client, `Nobody will be able to use this vehicle until it receives a new owner (either bought or set by admin).`);
}

// ===========================================================================

function getVehicleInfoCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let vehicleData = getVehicleData(vehicle);

	let ownerName = "Nobody";
	let ownerType = "None";
	switch (vehicleData.ownerType) {
		case AGRP_VEHOWNER_CLAN:
			ownerName = getClanData(getClanIndexFromDatabaseId(vehicleData.ownerId)).name;
			ownerType = "clan";
			break;

		case AGRP_VEHOWNER_JOB:
			ownerName = getJobData(getJobIdFromDatabaseId(vehicleData.ownerId)).name;
			ownerType = "job";
			break;

		case AGRP_VEHOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(vehicleData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			ownerType = "player";
			break;

		case AGRP_VEHOWNER_BIZ:
			ownerName = getBusinessData(getBusinessIdFromDatabaseId(vehicleData.ownerId)).name;
			ownerType = "business";
			break;

		case AGRP_VEHOWNER_PUBLIC:
			ownerName = "Nobody";
			ownerType = "public";
			break;

		default:
			break;
	}

	let tempStats = [
		[`Type`, `${getGameConfig().vehicles[getGame()][vehicleData.model][1]} (${getGameConfig().vehicles[getGame()][vehicleData.model][0]})`],
		[`ID`, `${vehicleData.index}/${vehicleData.databaseId}`],
		[`Owner`, `${ownerName} (${getVehicleOwnerTypeText(vehicleData.ownerType)})`],
		[`Locked`, `${getYesNoFromBool(vehicleData.locked)}`],
		[`Engine`, `${getOnOffFromBool(vehicleData.engine)}`],
		[`Lights`, `${getOnOffFromBool(vehicleData.lights)}`],
		[`Buy Price`, `${vehicleData.buyPrice}`],
		[`Rent Price`, `${vehicleData.rentPrice}`],
		[`Radio Station`, `${(vehicleData.streamingRadioStationIndex == -1) ? "None" : getRadioStationData(vehicleData.streamingRadioStationIndex).name}`],
		[`Parked`, `${getYesNoFromBool(vehicleData.spawnLocked)}`],
		[`License Plate`, `${vehicleData.licensePlate}`],
		[`Colour`, `${getVehicleColourInfoString(vehicleData.colour1, vehicleData.colour1IsRGBA)}, ${getVehicleColourInfoString(vehicleData.colour1, vehicleData.colour1IsRGBA)}`],
		[`Last Driver`, `${vehicleData.lastDriverName}`],
	];

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderVehicleInfo")));
	let chunkedList = splitArrayIntoChunks(stats, 6);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}

	//messagePlayerNormal(client, `🚗 {vehiclePurple}[Vehicle Info] {MAINCOLOUR}ID: {ALTCOLOUR}${getElementId(vehicle)}, {MAINCOLOUR}Index: {ALTCOLOUR}${vehicleData.index}, {MAINCOLOUR}DatabaseID: {ALTCOLOUR}${vehicleData.databaseId}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName}[ID ${vehicleData.ownerId}] (${ownerType}), {MAINCOLOUR}Type: {ALTCOLOUR}${getVehicleName(vehicle)}[ID: ${vehicle.modelIndex}, Index: ${getVehicleModelIndexFromModel(vehicle.modelIndex)}], {MAINCOLOUR}BuyPrice: {ALTCOLOUR}${vehicleData.buyPrice}, {MAINCOLOUR}RentPrice: {ALTCOLOUR}${vehicleData.rentPrice}`);
}

// ===========================================================================

function getLastVehicleInfoCommand(command, params, client) {
	//if(!isPlayerInAnyVehicle(client)) {
	//	messagePlayerError(client, "You need to be in a vehicle!");
	//	return false;
	//}

	let vehicle = getPlayerLastVehicle(client);

	if (!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let vehicleData = getVehicleData(vehicle);

	let ownerName = "Nobody";
	let ownerType = "None";
	switch (vehicleData.ownerType) {
		case AGRP_VEHOWNER_CLAN:
			ownerName = getClanData(vehicleData.ownerId).name;
			ownerType = "clan";
			break;

		case AGRP_VEHOWNER_JOB:
			ownerName = getJobData(vehicleData.ownerId).name;
			ownerType = "job";
			break;

		case AGRP_VEHOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(vehicleData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			ownerType = "player";
			break;

		case AGRP_VEHOWNER_BIZ:
			ownerName = getBusinessData(vehicleData.ownerId).name;
			ownerType = "business";
			break;

		case AGRP_VEHOWNER_PUBLIC:
			ownerName = "None";
			ownerType = "public";
			break;

		default:
			ownerName = "None";
			ownerType = "unowned";
			break;
	}

	messagePlayerNormal(client, `🚗 {vehiclePurple}[Vehicle Info] {MAINCOLOUR}ID: {ALTCOLOUR}${vehicle.id}, {MAINCOLOUR}DatabaseID: {ALTCOLOUR}${vehicleData.databaseId}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName}[ID ${vehicleData.ownerId}] (${ownerType}), {MAINCOLOUR}Type: {ALTCOLOUR}${getVehicleName(vehicle)}[${vehicle.modelIndex}], {MAINCOLOUR}BuyPrice: {ALTCOLOUR}${vehicleData.buyPrice}, {MAINCOLOUR}RentPrice: {ALTCOLOUR}${vehicleData.rentPrice}`);
}

// ===========================================================================

function toggleVehicleSpawnLockCommand(command, params, client) {
	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	getVehicleData(vehicle).spawnLocked = !getVehicleData(vehicle).spawnLocked;
	if (getVehicleData(vehicle).spawnLocked) {
		getVehicleData(vehicle).spawnPosition = getVehiclePosition(vehicle);
		getVehicleData(vehicle).spawnRotation = getVehicleHeading(vehicle);
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} to spawn {ALTCOLOUR}${(getVehicleData(vehicle).spawnLocked) ? "at it's current location" : "wherever a player leaves it."}`, true);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function reloadAllVehiclesCommand(command, params, client) {
	for (let i in getServerData().vehicles) {
		if (getServerData().vehicles[i].vehicle) {
			deleteGameElement(getServerData().vehicles[i].vehicle);
		}
	}

	clearArray(getServerData().vehicles);
	getServerData().vehicles = loadVehiclesFromDatabase();
	spawnAllVehicles();

	announceAdminAction(`AllVehiclesReloaded`);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function respawnVehicleCommand(command, params, client) {
	if (isPlayerInAnyVehicle(client)) {
		removeAllOccupantsFromVehicle(getPlayerVehicle(client));
		respawnVehicle(getPlayerVehicle(client));
	}

	setAllVehicleIndexes();

	messagePlayerSuccess(client, getLocaleString(client, `YourVehicleRespawned`));
}


// ===========================================================================

function respawnAllVehiclesCommand(command, params, client) {
	for (let i in getServerData().vehicles) {
		respawnVehicle(getServerData().vehicles[i].vehicle);
	}

	let randomVehicles = getElementsByType(ELEMENT_VEHICLE).filter(v => getVehicleData(v) == false);
	for (let i in randomVehicles) {
		destroyElement(randomVehicles[i]);
	}

	setAllVehicleIndexes();

	announceAdminAction(`AllVehiclesRespawned`);
}

// ===========================================================================

function respawnEmptyVehiclesCommand(command, params, client) {
	for (let i in getServerData().vehicles) {
		if (!isVehicleUnoccupied(getServerData().vehicles[i].vehicle)) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	let clientVehicles = getElementsByType(ELEMENT_VEHICLE).filter(v => getVehicleData(v) == false);
	for (let i in clientVehicles) {
		if (!isVehicleUnoccupied(clientVehicles[i])) {
			destroyElement(clientVehicles[i]);
		}
	}

	announceAdminAction(`EmptyVehiclesRespawned`);
}

// ===========================================================================

function respawnJobVehiclesCommand(command, params, client) {
	for (let i in getServerData().vehicles) {
		if (getServerData().vehicles[i].ownerType == AGRP_VEHOWNER_JOB) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	announceAdminAction(`JobVehiclesRespawned`);
}

// ===========================================================================

function respawnClanVehiclesCommand(command, params, client) {
	for (let i in getServerData().vehicles) {
		if (getServerData().vehicles[i].ownerType == AGRP_VEHOWNER_CLAN) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	announceAdminAction(`ClanVehiclesRespawned`);
}

// ===========================================================================

function respawnPlayerVehiclesCommand(command, params, client) {
	for (let i in getServerData().vehicles) {
		if (getServerData().vehicles[i].ownerType == AGRP_VEHOWNER_PLAYER) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	announceAdminAction(`PlayerVehiclesRespawned`);
}

// ===========================================================================

function respawnPublicVehiclesCommand(command, params, client) {
	for (let i in getServerData().vehicles) {
		if (getServerData().vehicles[i].ownerType == AGRP_VEHOWNER_PUBLIC) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	announceAdminAction(`PublicVehiclesRespawned`);
}

// ===========================================================================

function respawnBusinessVehiclesCommand(command, params, client) {
	for (let i in getServerData().vehicles) {
		if (getServerData().vehicles[i].ownerType == AGRP_VEHOWNER_BIZ) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	announceAdminAction(`BusinessVehiclesRespawned`);
}

// ===========================================================================

function stopRentingVehicle(client) {
	getServerData().rentingVehicleCache.splice(getServerData().rentingVehicleCache.indexOf(client), 1);
	let vehicle = getPlayerData(client).rentingVehicle;
	getPlayerData(client).rentingVehicle = false;
	getVehicleData(vehicle).rentedBy = false;
	respawnVehicle(vehicle);
}

// ===========================================================================

function respawnVehicle(vehicle) {
	let vehicles = getServerData().vehicles;
	for (let i in vehicles) {
		if (vehicle == vehicles[i].vehicle) {
			if (vehicles[i].spawnLocked == true) {
				vehicles[i].engine = false;
			}

			if (vehicles[i].ownerType == AGRP_VEHOWNER_JOB) {
				vehicles[i].locked = true;
			}

			destroyElement(vehicle);
			vehicles[i].vehicle = false;

			let newVehicle = spawnVehicle(vehicles[i]);
			vehicles[i].vehicle = newVehicle;
			setEntityData(newVehicle, "agrp.dataSlot", i, false);
		}
	}

	//getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function spawnVehicle(vehicleData) {
	logToConsole(LOG_DEBUG, `[AGRP.Vehicle]: Spawning ${getVehicleNameFromModel(vehicleData.model)} at ${vehicleData.spawnPosition.x}, ${vehicleData.spawnPosition.y}, ${vehicleData.spawnPosition.z} with heading ${vehicleData.spawnRotation}`);
	let vehicle = createGameVehicle(vehicleData.model, vehicleData.spawnPosition, vehicleData.spawnRotation);

	if (!vehicle) {
		return false;
	}

	setVehicleHeading(vehicle, vehicleData.spawnRotation);
	setElementDimension(vehicle, vehicleData.dimension);

	vehicleData.vehicle = vehicle;

	if (isGameFeatureSupported("vehicleColour")) {
		if (vehicleData.colour1IsRGBA && vehicleData.colour2IsRGBA) {
			vehicle.setRGBColours(vehicleData.colour1RGBA, vehicleData.colour2RGBA);
			let colour1 = rgbaArrayFromToColour(vehicleData.colour1RGBA);
			let colour2 = rgbaArrayFromToColour(vehicleData.colour2RGBA);
			logToConsole(LOG_VERBOSE, `[AGRP.Vehicle]: Setting vehicle ${vehicle.id}'s colours to RGBA [${colour1[0]}, ${colour1[1]}, ${colour1[2]}, ${colour1[3]}], [(]${colour2[0]}, ${colour2[1]}, ${colour2[2]}, ${colour2[3]}]`);
			vehicle.setRGBColours(vehicleData.colour1RGBA, vehicleData.colour2RGBA);
		} else {
			setVehicleColours(vehicle, vehicleData.colour1, vehicleData.colour2, vehicleData.colour3, vehicleData.colour4);
			logToConsole(LOG_VERBOSE, `[AGRP.Vehicle]: Setting vehicle ${vehicle.id}'s colours to ${vehicleData.colour1}, ${vehicleData.colour2}, ${vehicleData.colour3}, ${vehicleData.colour4}`);
		}
	}

	if (vehicleData.spawnLocked == true) {
		setVehicleEngine(vehicle, false);
		logToConsole(LOG_VERBOSE, `[AGRP.Vehicle]: Setting vehicle ${vehicle.id}'s engine to OFF`);
	} else {
		setVehicleEngine(vehicle, intToBool(vehicleData.engine));
		logToConsole(LOG_VERBOSE, `[AGRP.Vehicle]: Setting vehicle ${vehicle.id}'s engine to ${toUpperCase(getOnOffFromBool(getVehicleEngine(vehicle)))}`);
	}

	if (typeof vehicle.locked != "undefined") {
		setVehicleLocked(vehicle, intToBool(vehicleData.locked));
		logToConsole(LOG_VERBOSE, `[AGRP.Vehicle]: Setting vehicle ${vehicle.id}'s lock state to ${toUpperCase(getOnOffFromBool(getVehicleLocked(vehicle)))}`);
	}

	//setVehicleHealth(vehicle, 1000);
	repairVehicle(vehicle);

	setEntityData(vehicle, "agrp.livery", vehicleData.livery, true);
	setEntityData(vehicle, "agrp.upgrades", vehicleData.extras, true);
	setEntityData(vehicle, "agrp.interior", vehicleData.interior, true);
	setEntityData(vehicle, "agrp.engine", vehicleData.engine, true);

	setEntityData(vehicle, "agrp.server", true, true);

	forcePlayerToSyncElementProperties(null, vehicle);
	setElementTransient(vehicle, false);

	return vehicle;
}

// ===========================================================================

function isVehicleAtPayAndSpray(vehicle) {
	for (let i in getServerData().payAndSprays[getGame()]) {
		if (getDistance(getVehiclePosition(vehicle), getServerData().payAndSprays[getGame()][i].position) <= getGlobalConfig().payAndSprayDistance) {
			return true;
		}
	}
	return false;
}

// ===========================================================================

function getVehicleOwnerTypeText(ownerType) {
	switch (ownerType) {
		case AGRP_VEHOWNER_CLAN:
			return "clan";

		case AGRP_VEHOWNER_JOB:
			return "job";

		case AGRP_VEHOWNER_PLAYER:
			return "player";

		case AGRP_VEHOWNER_BIZ:
			return "business";

		case AGRP_VEHOWNER_PUBLIC:
			return "public";

		default:
			return "unknown";
	}
}

// ===========================================================================

function isVehicleOwnedByJob(vehicle, jobId) {
	if (getVehicleData(vehicle).ownerType == AGRP_VEHOWNER_JOB) {
		return (getVehicleData(vehicle).ownerId == jobId);
	}
	return false;
}

// ===========================================================================

async function getPlayerNewVehicle(client) {
	while (true) {
		if (isPlayerInAnyVehicle(client)) {
			return getPlayerVehicle(client);
		}
		await null;
	}
}

// ===========================================================================

function createNewDealershipVehicle(modelIndex, spawnPosition, spawnRotation, price, dealershipId, interior = 0, dimension = 0) {
	let vehicle = createGameVehicle(modelIndex, spawnPosition, spawnRotation);
	if (!vehicle) {
		return false;
	}
	setVehicleHeading(vehicle, spawnRotation);
	setElementInterior(vehicle, interior);
	setElementDimension(vehicle, dimension);
	addToWorld(vehicle);

	let tempVehicleData = new VehicleData(false, vehicle);
	tempVehicleData.buyPrice = price;
	tempVehicleData.spawnLocked = true;
	tempVehicleData.spawnPosition = spawnPosition;
	tempVehicleData.spawnRotation = spawnRotation;
	tempVehicleData.ownerType = AGRP_VEHOWNER_BIZ;
	tempVehicleData.ownerId = dealershipId;
	tempVehicleData.needsSaved = true;
	tempVehicleData.interior = interior;
	tempVehicleData.dimension = dimension;

	let slot = getServerData().vehicles.push(tempVehicleData);
	setEntityData(vehicle, "agrp.dataSlot", slot - 1, false);
}

// ===========================================================================

function createTemporaryVehicle(modelIndex, position, heading, interior = 0, dimension = 0) {
	let vehicle = createGameVehicle(modelIndex, position, heading);
	setVehicleHeading(vehicle, heading);
	setElementInterior(vehicle, interior);
	setElementDimension(vehicle, dimension);
	addToWorld(vehicle);

	let tempVehicleData = new VehicleData(false, vehicle);
	tempVehicleData.model = modelIndex;
	tempVehicleData.databaseId = -1;
	tempVehicleData.interior = interior;
	tempVehicleData.dimension = dimension;
	if (!isGameFeatureSupported("vehicleColour")) {
		tempVehicleData.colour1 = 0;
		tempVehicleData.colour2 = 0;
		tempVehicleData.colour3 = 0;
		tempVehicleData.colour4 = 0;
	}

	let slot = getServerData().vehicles.push(tempVehicleData);
	setAllVehicleIndexes();

	if (areServerElementsSupported()) {
		setEntityData(vehicle, "agrp.dataSlot", slot - 1, false);
	}

	return vehicle;
}

// ===========================================================================

function createPermanentVehicle(modelIndex, position, heading, interior = 0, dimension = 0) {
	let vehicle = createGameVehicle(modelIndex, position, heading);
	setVehicleHeading(vehicle, heading);
	setElementInterior(vehicle, interior);
	setElementDimension(vehicle, dimension);
	addToWorld(vehicle);

	let tempVehicleData = new VehicleData(false, vehicle);
	tempVehicleData.model = modelIndex;
	tempVehicleData.interior = interior;
	tempVehicleData.dimension = dimension;
	if (!isGameFeatureSupported("vehicleColour")) {
		tempVehicleData.colour1 = 0;
		tempVehicleData.colour2 = 0;
		tempVehicleData.colour3 = 0;
		tempVehicleData.colour4 = 0;
	}

	let slot = getServerData().vehicles.push(tempVehicleData);
	setAllVehicleIndexes();

	if (areServerElementsSupported()) {
		setEntityData(vehicle, "agrp.dataSlot", slot - 1, false);
	}

	return vehicle;
}

// ===========================================================================

function processVehiclePurchasing() {
	if (!getGlobalConfig().useServerSideVehiclePurchaseCheck) {
		return false;
	}

	let purchasingVehicles = getServerData().purchasingVehicleCache;
	for (let i in purchasingVehicles) {
		checkVehiclePurchasing(purchasingVehicles[i]);
	}

	return false;
}

// ===========================================================================

function checkVehiclePurchasing(client) {
	if (!isPlayerLoggedIn(client)) {
		setPlayerBuyingVehicleState(client, AGRP_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if (!isPlayerSpawned(client)) {
		setPlayerBuyingVehicleState(client, AGRP_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if (!getPlayerData(client)) {
		setPlayerBuyingVehicleState(client, AGRP_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if (!getPlayerData(client).buyingVehicle) {
		setPlayerBuyingVehicleState(client, AGRP_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if (!isPlayerInAnyVehicle(client)) {
		if (getPlayerData(client).buyingVehicle != false) {
			getServerData().purchasingVehicleCache.splice(getServerData().purchasingVehicleCache.indexOf(client), 1);
			messagePlayerError(client, getLocaleString(client, "DealershipPurchaseExitedVehicle"));
			respawnVehicle(getPlayerData(client).buyingVehicle);
			getPlayerData(client).buyingVehicle = false;
			setPlayerBuyingVehicleState(client, AGRP_VEHBUYSTATE_NONE, null, null);
		}
		return false;
	}

	if (getDistance(getVehiclePosition(getPlayerData(client).buyingVehicle), getVehicleData(getPlayerData(client).buyingVehicle).spawnPosition) > getGlobalConfig().buyVehicleDriveAwayDistance) {
		if (getPlayerCurrentSubAccount(client).cash < getVehicleData(getPlayerData(client).buyingVehicle).buyPrice) {
			getServerData().purchasingVehicleCache.splice(getServerData().purchasingVehicleCache.indexOf(client), 1);
			messagePlayerError(client, getLocaleString(client, "VehiclePurchaseNotEnoughMoney"));
			respawnVehicle(getPlayerData(client).buyingVehicle);
			getPlayerData(client).buyingVehicle = false;
			setPlayerBuyingVehicleState(client, AGRP_VEHBUYSTATE_NONE, null, null);
			return false;
		}

		getServerData().purchasingVehicleCache.splice(getServerData().purchasingVehicleCache.indexOf(client), 1);
		createNewDealershipVehicle(getVehicleData(getPlayerData(client).buyingVehicle).model, getVehicleData(getPlayerData(client).buyingVehicle).spawnPosition, getVehicleData(getPlayerData(client).buyingVehicle).spawnRotation, getVehicleData(getPlayerData(client).buyingVehicle).buyPrice, getVehicleData(getPlayerData(client).buyingVehicle).ownerId);
		takePlayerCash(client, getVehicleData(getPlayerData(client).buyingVehicle).buyPrice);
		updatePlayerCash(client);
		getVehicleData(getPlayerData(client).buyingVehicle).ownerId = getPlayerCurrentSubAccount(client).databaseId;
		getVehicleData(getPlayerData(client).buyingVehicle).ownerType = AGRP_VEHOWNER_PLAYER;
		getVehicleData(getPlayerData(client).buyingVehicle).buyPrice = 0;
		getVehicleData(getPlayerData(client).buyingVehicle).rentPrice = 0;
		getVehicleData(getPlayerData(client).buyingVehicle).spawnLocked = false;
		getPlayerData(client).buyingVehicle = false;
		messagePlayerSuccess(client, getLocaleString(client, "VehiclePurchaseComplete"));
		setPlayerBuyingVehicleState(client, AGRP_VEHBUYSTATE_NONE, null, null);
		return true;
	}
}

// ===========================================================================

function processVehicleBurning() {
	if (!getGlobalConfig().useServerSideVehicleBurnCheck) {
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
	for (let i in getServerData().vehicles) {
		for (let j in getServerData().items) {
			if (getItemData(j).ownerType == AGRP_ITEM_OWNER_VEHTRUNK && getItemData(j).ownerId == getServerData().vehicles[i].databaseId) {
				getServerData().vehicles[i].trunkItemCache.push(j);
			} else if (getItemData(j).ownerType == AGRP_ITEM_OWNER_VEHDASH && getItemData(j).ownerId == getServerData().vehicles[i].databaseId) {
				getServerData().vehicles[i].dashItemCache.push(j);
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
	for (let i in getServerData().vehicles) {
		getServerData().vehicles[i].index = i;

		if (getServerData().vehicles[i].streamingRadioStation != 0) {
			getServerData().vehicles[i].streamingRadioStationIndex = getRadioStationIndexFromDatabase(getServerData().vehicles[i].streamingRadioStation);
		}
	}
}

// ===========================================================================

function doesVehicleHaveMegaphone(vehicle) {
	if (getVehicleData(vehicle).ownerType == AGRP_VEHOWNER_JOB) {
		if (getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == AGRP_JOB_POLICE) {
			return true;
		}

		if (getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == AGRP_JOB_FIRE) {
			return true;
		}

		if (getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == AGRP_JOB_MEDICAL) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getVehicleFromDatabaseId(databaseId) {
	let vehicles = getServerData().vehicles;
	for (let i in vehicles) {
		if (vehicles[i].databaseId == databaseId) {
			return vehicles[i].vehicle;
		}
	}
}

// ===========================================================================

function isVehicleUnoccupied(vehicle) {
	for (let i = 0; i <= 8; i++) {
		if (vehicle.getOccupant(i) != null) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getClosestTaxi(position) {
	getElementsByTypeInRange(ELEMENT_VEHICLE, position, 25)
		.filter(v => isTaxiVehicle(vehicles[i]))
		.reduce((i, j) => ((i.position.distance(position) <= j.position.distance(position)) ? i : j));
}

// ===========================================================================

function getVehicleTrunkPosition(vehicle) {
	return getPosBehindPos(getVehiclePosition(vehicle), getVehicleHeading(vehicle), getGlobalConfig().vehicleTrunkRearDistance);
}

// ===========================================================================

function removeAllOccupantsFromVehicle(vehicle) {
	for (let i = 0; i <= 16; i++) {
		if (vehicle.getOccupant(i) != null) {
			removePlayerFromVehicle(vehicle.getOccupant(i));
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

	if (getPlayerVehicleSeat(client) != 0) {
		return false;
	}

	return false;
}

// ===========================================================================