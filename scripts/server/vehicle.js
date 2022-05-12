// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: vehicle.js
// DESC: Provides vehicle functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initVehicleScript() {
	logToConsole(LOG_INFO, "[VRR.Vehicle]: Initializing vehicle script ...");
	logToConsole(LOG_INFO, "[VRR.Vehicle]: Vehicle script initialized successfully!");
	return true;
}

// ===========================================================================

function loadVehiclesFromDatabase() {
	logToConsole(LOG_INFO, "[VRR.Vehicle]: Loading vehicles from database ...");
	let dbConnection = connectToDatabase();
	let tempVehicles = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM veh_main WHERE veh_server = ${getServerId()} AND veh_deleted = 0`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempVehicleData = new VehicleData(dbAssoc);
				tempVehicles.push(tempVehicleData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.Vehicle]: ${tempVehicles.length} vehicles loaded from database successfully!`);
	return tempVehicles;
}

// ===========================================================================

function saveAllVehiclesToDatabase() {
	if(getServerConfig().devServer) {
		return false;
	}

	logToConsole(LOG_INFO, "[VRR.Vehicle]: Saving all server vehicles to database ...");
	let vehicles = getServerData().vehicles;
	for(let i in vehicles) {
		if(vehicles[i].needsSaved) {
			saveVehicleToDatabase(i);
		}
	}
	logToConsole(LOG_INFO, "[VRR.Vehicle]: Saved all server vehicles to database!");

	return true;
}

// ===========================================================================

function saveVehicleToDatabase(vehicleDataId) {
	if(getVehicleData(vehicleDataId) == null) {
		// Invalid vehicle data
		return false;
	}

	let tempVehicleData = getServerData().vehicles[vehicleDataId];

	if(tempVehicleData.databaseId == -1) {
		// Temp vehicle, no need to save
		return false;
	}

	if(!tempVehicleData.needsSaved) {
		// Vehicle hasn't changed. No need to save.
		return false;
	}

	logToConsole(LOG_VERBOSE, `[VRR.Vehicle]: Saving vehicle ${tempVehicleData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		if(tempVehicleData.vehicle != false) {
			if(!tempVehicleData.spawnLocked) {
				if(areServerElementsSupported()) {
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
			["veh_extra1", tempVehicleData.extras[0]],
			["veh_extra2", tempVehicleData.extras[1]],
			["veh_extra3", tempVehicleData.extras[2]],
			["veh_extra4", tempVehicleData.extras[3]],
			["veh_extra5", tempVehicleData.extras[4]],
			["veh_extra6", tempVehicleData.extras[5]],
			["veh_extra7", tempVehicleData.extras[6]],
			["veh_extra8", tempVehicleData.extras[7]],
			["veh_extra9", tempVehicleData.extras[8]],
			["veh_extra10", tempVehicleData.extras[9]],
			["veh_extra11", tempVehicleData.extras[10]],
			["veh_extra12", tempVehicleData.extras[11]],
			["veh_extra13", tempVehicleData.extras[12]],
			["veh_engine", intToBool(tempVehicleData.engine)],
			["veh_lights", intToBool(tempVehicleData.lights)],
			["veh_health", toInteger(tempVehicleData.health)],
			["veh_damage_engine", toInteger(tempVehicleData.engineDamage)],
			["veh_damage_visual", toInteger(tempVehicleData.visualDamage)],
			["veh_dirt_level", toInteger(tempVehicleData.dirtLevel)],
			["veh_int", toInteger(tempVehicleData.interior)],
			["veh_vw", toInteger(tempVehicleData.dimension)],
			["veh_livery", toInteger(tempVehicleData.livery)],
		];

		let dbQuery = null;
		if(tempVehicleData.databaseId == 0) {
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
	logToConsole(LOG_VERBOSE, `[VRR.Vehicle]: Saved vehicle ${vehicleDataId} to database!`);

	return false;
}

// ===========================================================================

function spawnAllVehicles() {
	for(let i in getServerData().vehicles) {
		let vehicle = spawnVehicle(getServerData().vehicles[i]);
		getServerData().vehicles[i].vehicle = vehicle;
		setEntityData(vehicle, "vrr.dataSlot", i, false);
		setAllVehicleIndexes();
	}
}

// ===========================================================================

/**
	* @param {Vehicle} vehicle - The vehicle element
	* @return {VehicleData} The vehicles's data (class instance)
	*/
function getVehicleData(vehicle) {
	if(getGame() != VRR_GAME_GTA_IV) {
		if(isVehicleObject(vehicle)) {
			let dataIndex = getEntityData(vehicle, "vrr.dataSlot");
			if(typeof getServerData().vehicles[dataIndex] != "undefined") {
				return getServerData().vehicles[dataIndex];
			}
		}
	} else {
		return getServerVehicles().find((v) => v.ivNetworkId == vehicle);
	}

	return false;
}

// ===========================================================================

function createVehicleCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let modelIndex = getVehicleModelIndexFromParams(params);

	if(!modelIndex) {
		messagePlayerError(client, "That vehicle type is invalid!");
		return false;
	}

	let heading = getPlayerHeading(client);
	if(getGame() == VRR_GAME_MAFIA_ONE) {
		heading = degToRad(getPlayerHeading(client));
	}

	let frontPos = getPosInFrontOfPos(getPlayerPosition(client), getPlayerHeading(client), getGlobalConfig().spawnCarDistance);
	let vehicle = createPermanentVehicle(modelIndex, frontPos, heading, getPlayerInterior(client), getPlayerDimension(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a {vehiclePurple}${getVehicleName(vehicle)}`);
}

// ===========================================================================

function createTemporaryVehicleCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let modelIndex = getVehicleModelIndexFromParams(params);

	if(!modelIndex) {
		messagePlayerError(client, "That vehicle type is invalid!");
		return false;
	}

	let frontPos = getPosInFrontOfPos(getPlayerPosition(client), getPlayerHeading(client), getGlobalConfig().spawnCarDistance);
	let vehicle = createTemporaryVehicle(modelIndex, frontPos, getPlayerHeading(client), getPlayerInterior(client), getPlayerDimension(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a temporary {vehiclePurple}${getVehicleName(vehicle)}`);
}

// ===========================================================================

function getNearbyVehiclesCommand(command, params, client) {
	let distance = 10.0;

	if(!areParamsEmpty(params)) {
		distance = getParam(params, " ", 1);
	}

	if(isNaN(distance)) {
		messagePlayerError(client, "The distance must be a number!");
		return false;
	}

	distance = toFloat(distance);

	if(distance <= 0) {
		messagePlayerError(client, "The distance must be more than 0!");
		return false;
	}

	let nearbyVehicles = getVehiclesInRange(getPlayerPosition(client), distance);

	if(nearbyVehicles.length == 0) {
		messagePlayerAlert(client, getLocaleString(client, "NoVehiclesWithinRange", distance));
		return false;
	}

	let vehiclesList = nearbyVehicles.map(function(x) { return `{ALTCOLOUR}${getVehicleData(x).index}: {MAINCOLOUR}${getVehicleName(x)} {darkGrey}(${getDistance(getPlayerPosition(client), getVehiclePosition(x))} ${getLocaleString(client, "Meters")} ${getGroupedLocaleString(client, "CardinalDirections")[getCardinalDirection(getPlayerPosition(client), getVehiclePosition(x))]}})`; });
	let chunkedList = splitArrayIntoChunks(vehiclesList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderVehiclesInRangeList")));
	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function vehicleTrunkCommand(command, params, client) {
	let vehicle = getClosestVehicle(getPlayerPosition(client));

	let behindPosition = getPosBehindPos(getVehiclePosition(vehicle), getVehicleHeading(vehicle), getGlobalConfig().vehicleTrunkDistance);
	if(!getPlayerVehicle(client) && getDistance(behindPosition, getPlayerPosition(client)) > getGlobalConfig().vehicleTrunkDistance) {
		messagePlayerError(client, getLocaleString(client, "MustBeInOrNearVehicle"));
		return false;
	}

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(!doesPlayerHaveVehicleKeys(client, vehicle)) {
		messagePlayerError(client, getLocaleString(client, "DontHaveVehicleKey"));
		return false;
	}

	getVehicleData(vehicle).trunk = !getVehicleData(vehicle).trunk;
	getVehicleData(vehicle).needsSaved = true;
	setVehicleTrunkState(vehicle, getVehicleData(vehicle).trunk);

	meActionToNearbyPlayers(client, `${toLowerCase(getOpenedClosedFromBool(getVehicleData(vehicle).trunk))} the ${getVehicleName(vehicle)}'s trunk.`);
}

// ===========================================================================

function vehicleLightsCommand(command, params, client) {
	if(!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(getPlayerVehicleSeat(client) > 1) {
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
	if(!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let dataIndex = getEntityData(vehicle, "vrr.dataSlot");
	let vehicleName = getVehicleName(vehicle);

	quickDatabaseQuery(`DELETE FROM veh_main WHERE veh_id = ${getVehicleData(vehicle).databaseId}`);

	getServerData().vehicles.splice(dataIndex, 1);
	destroyElement(vehicle);

	messagePlayerSuccess(client, `The ${vehicleName} has been deleted!`);
}

// ===========================================================================

function vehicleEngineCommand(command, params, client) {
	if(!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	if(getPlayerVehicleSeat(client) > 0) {
		messagePlayerError(client, getLocaleString(client, "MustBeInVehicleDriverSeat"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!doesPlayerHaveVehicleKeys(client, vehicle)) {
		messagePlayerError(client, getLocaleString(client, "DontHaveVehicleKey"));
		return false;
	}

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	getVehicleData(vehicle).engine = !getVehicleData(vehicle).engine;
	vehicle.engine = getVehicleData(vehicle).engine;
	setEntityData(vehicle, "vrr.engine", getVehicleData(vehicle).engine, true);

	getVehicleData(vehicle).needsSaved = true;

	meActionToNearbyPlayers(client, `turned the ${getVehicleName(vehicle)}'s engine ${toLowerCase(getOnOffFromBool(getVehicleData(vehicle).engine))}`);
}

// ===========================================================================

function vehicleSirenCommand(command, params, client) {
	if(!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(getPlayerVehicleSeat(client) > 1) {
		messagePlayerError(client, getLocaleString(client, "MustBeInVehicleFrontSeat"));
		return false;
	}

	if(!doesPlayerHaveVehicleKeys(client, vehicle)) {
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
	if(areParamsEmpty(params) && areThereEnoughParams(params, 2)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let colour1 = toInteger(getParam(params, " ", 1)) || 0;
	let colour2 = toInteger(getParam(params, " ", 2)) || 0;

	takePlayerCash(client, getGlobalConfig().resprayVehicleCost);
	updatePlayerCash(client);
	vehicle.colour1 = colour1;
	vehicle.colour2 = colour2;
	getVehicleData(vehicle).colour1 = colour1;
	getVehicleData(vehicle).colour2 = colour2;

	getVehicleData(vehicle).needsSaved = true;

	meActionToNearbyPlayers(client, `resprays the ${getVehicleName(vehicle)}'s colours`);
}

// ===========================================================================

function vehicleAdminRepairCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} could not repair their vehicle. Reason: Not in a vehicle.`);
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} could not repair their ${getVehicleName(vehicle)} vehicle. Not a server vehicle.`);
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} repaired their ${getVehicleName(vehicle)} vehicle`);
	takePlayerCash(client, getGlobalConfig().repairVehicleCost);
	repairVehicle(vehicle);
	getVehicleData(vehicle).needsSaved = true;
	meActionToNearbyPlayers(client, `repairs the ${getVehicleName(vehicle)}`);
}

// ===========================================================================

function vehicleAdminLiveryCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(getPlayerCurrentSubAccount(client).cash < getGlobalConfig().repairVehicleCost) {
		messagePlayerError(client, `You don't have enough money to change the vehicle's livery (need $${makeLargeNumberReadable(getGlobalConfig().resprayVehicleCost-getPlayerCurrentSubAccount(client).cash)} more!)`);
		return false;
	}

	let livery = toInteger(params) || 3;

	takePlayerCash(client, getGlobalConfig().resprayVehicleCost);
	updatePlayerCash(client);
	getVehicleData(vehicle).livery = livery;
	getVehicleData(vehicle).needsSaved = true;

	setEntityData(vehicle, "vrr.livery", livery, true);
	forcePlayerToSyncElementProperties(null, vehicle);

	meActionToNearbyPlayers(client, `sets the ${getVehicleName(vehicle)}'s livery/paintjob'`);
}

// ===========================================================================

function buyVehicleCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(getVehicleData(vehicle).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "VehicleNotForSale"));
		return false;
	}

	if(getPlayerCurrentSubAccount(client).cash < getVehicleData(vehicle).buyPrice) {
		messagePlayerError(client, getLocaleString(client, "VehiclePurchaseNotEnoughMoney"));
		return false;
	}

	getPlayerData(client).buyingVehicle = vehicle;
	getVehicleData(vehicle).engine = true;
	vehicle.engine = true;
	setEntityData(vehicle, "vrr.engine", getVehicleData(vehicle).engine, true);

	getVehicleData(vehicle).needsSaved = true;
	setPlayerBuyingVehicleState(client, VRR_VEHBUYSTATE_TESTDRIVE, vehicle.id, getVehiclePosition(vehicle));
	meActionToNearbyPlayers(client, `receives a set of keys to test drive the ${getVehicleName(vehicle)} and starts the engine`);
	messagePlayerInfo(client, getLocaleString(client, "DealershipPurchaseTestDrive"));
	getServerData().purchasingVehicleCache.push(client);
}

// ===========================================================================

function rentVehicleCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(getVehicleData(vehicle).rentPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "VehicleNotForRent"));
		return false;
	}

	if(getPlayerData(client).rentingVehicle) {
		messagePlayerAlert(client, `You are no longer renting the ${getVehicleName(vehicle)}`);
		stopRentingVehicle(client);
		return false;
	}

	if(getVehicleData(vehicle).rentedBy != false) {
		if(getVehicleData(vehicle).rentedBy != client) {
			messagePlayerAlert(client, `Someone else is already renting this vehicle!`);
			return false;
		} else {
			messagePlayerAlert(client, `You are already renting this vehicle!`);
			return false;
		}
	}

	if(getVehicleData(vehicle).rentPrice > getPlayerCurrentSubAccount(client).cash) {
		messagePlayerError(client, getLocaleString(client, "NotEnoughCashNeedAmountMore", getVehicleData(vehicle).rentPrice-getPlayerCurrentSubAccount(client).cash));
		return false;
	}

	getVehicleData(vehicle).rentedBy = client;
	getPlayerData(client).rentingVehicle = vehicle;
	getVehicleData(vehicle).rentStart = getCurrentUnixTimestamp();
	getServerData().rentingVehicleCache.push(client);
	getVehicleData(vehicle).needsSaved = true;

	meActionToNearbyPlayers(client, `rents the ${getVehicleName(vehicle)} and receives a set of vehicle keys!`);
	messagePlayerAlert(client, `You will be charged $${makeLargeNumberReadable(getVehicleData(vehicle).rentPrice)} per minute to use this vehicle. To stop renting this vehicle, use /vehrent again.`);

	if(!getVehicleData(vehicle).engine) {
		if(!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "engine")) {
			messagePlayerTip(client, `The ${getVehicleName(vehicle)}'s engine is off. Press {ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "engine").key))} {MAINCOLOUR}to start it.`);
		} else {
			messagePlayerAlert(client, `The ${getVehicleName(vehicle)}'s engine is off. Use /engine to start it`);
		}
	}
}

// ===========================================================================

function enterVehicleAsPassengerCommand(command, params, client) {
	sendNetworkEventToPlayer("vrr.passenger", client);
}

// ===========================================================================

function stopRentingVehicleCommand(command, params, client) {
	if(!getPlayerData(client).rentingVehicle) {
		messagePlayerError(client, "You aren't renting a vehicle!");
		return false;
	}

	let vehicle = getPlayerData(client).rentingVehicle;
	messagePlayerAlert(client, `You are no longer renting the ${getVehicleName(vehicle)}`);
	stopRentingVehicle(client);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function doesPlayerHaveVehicleKeys(client, vehicle) {
	let vehicleData = getVehicleData(vehicle);

	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
		return true;
	}

	if(vehicleData.ownerType == VRR_VEHOWNER_PUBLIC) {
		return true;
	}

	if(vehicleData.ownerType == VRR_VEHOWNER_PLAYER) {
		if(vehicleData.ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if(vehicleData.ownerType == VRR_VEHOWNER_CLAN) {
		if(vehicleData.ownerId == getPlayerCurrentSubAccount(client).clan) {
			if(vehicleData.clanRank <= getPlayerCurrentSubAccount(client).clanRank) {
				return true;
			}
		}
	}

	if(vehicleData.ownerType == VRR_VEHOWNER_FACTION) {
		if(vehicleData.ownerId == getPlayerCurrentSubAccount(client).faction) {
			if(vehicleData.factionRank <= getPlayerCurrentSubAccount(client).factionRank) {
				return true;
			}
		}
	}

	if(vehicleData.ownerType == VRR_VEHOWNER_JOB) {
		if(vehicleData.ownerId == getPlayerCurrentSubAccount(client).job) {
			return true;
		}
	}

	if(vehicleData.rentedBy == client) {
		return true;
	}

	return false;
}

// ===========================================================================

function doesClientOwnVehicle(client, vehicle) {
	let vehicleData = getVehicleData(vehicle);

	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
		return true;
	}

	if(vehicleData.ownerType == VRR_VEHOWNER_PLAYER) {
		if(vehicleData.ownerId == getPlayerData(client).accountData.databaseId) {
			return true;
		}
	}

	if(vehicleData.ownerType == VRR_VEHOWNER_CLAN) {
		if(vehicleData.ownerId == getPlayerCurrentSubAccount(client).clan) {
			if(doesPlayerHaveClanPermission(client, "ManageVehicles") || doesPlayerHaveClanPermission(client, "owner")) {
				return true;
			}
		}
	}

	return false;
}

// ===========================================================================

function setVehicleJobCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getVehiclePosition(vehicle));
	let jobId = closestJobLocation.job;

	if(!areParamsEmpty(params)) {
		jobId = getJobFromParams(params);
	}

	//if(!jobId) {
	//	messagePlayerError(client, "That job is invalid!");
	//	messagePlayerInfo(client, "Please specify a job ID or leave it out to get the closest job.");
	//	return false;
	//}

	getVehicleData(vehicle).ownerType = VRR_VEHOWNER_JOB;
	getVehicleData(vehicle).ownerId = getJobData(jobId).databaseId;

	getVehicleData(vehicle).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} owner to the {jobYellow}${getJobData(jobId).name} {MAINCOLOUR}job! (Job ID ${jobId})`);
}

// ===========================================================================

function setVehicleRankCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let rankId = params;

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(getVehicleData(vehicle).ownerType == VRR_VEHOWNER_CLAN) {
		rankId = getClanRankFromParams(getVehicleData(vehicle).ownerId, params);
		if(!getClanRankData(getVehicleData(vehicle).ownerId, rankId)) {
			messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
			return false;
		}
		getVehicleData(vehicle).rank = getClanRankData(getVehicleData(vehicle).ownerId, rankId).databaseId;
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} rank to {ALTCOLOUR}${getClanRankData(getVehicleData(vehicle).ownerId, rankId).name}{MAINCOLOUR} of the {clanOrange}${getClanData(getVehicleData(vehicle).ownerId).name}{MAINCOLOUR} clan!`);
	} else if(getVehicleData(vehicle).ownerType == VRR_VEHOWNER_JOB) {
		getVehicleData(vehicle).rank = rankId;
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} rank to {ALTCOLOUR}${rankId}{MAINCOLOUR} of the {jobYellow}${getJobData(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)).name}{MAINCOLOUR} job!`);
	}

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehicleClanCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let clanId = getPlayerClan(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(!getClanData(clanId)) {
		messagePlayerError(client, "That clan is invalid or doesn't exist!");
		return false;
	}

	if(getVehicleData(vehicle).ownerType != VRR_VEHOWNER_PLAYER) {
		messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
		return false;
	}

	if(getVehicleData(vehicle).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
		messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "SetVehicleClanConfirmMessage"), getLocaleString(client, "SetVehicleClanConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = VRR_PROMPT_GIVEVEHTOCLAN;

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehicleToBusinessCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let businessId = getPlayerBusiness(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getVehicleData(vehicle).ownerType = VRR_VEHOWNER_BIZ;
	getVehicleData(vehicle).ownerId = getBusinessData(businessId).databaseId;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} owner to the {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}business`);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehicleOwnerCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let targetClient = getPlayerFromParams(params);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(!targetClient) {
		messagePlayerError(client, "That player is invalid or isn't connected!");
		return false;
	}

	getVehicleData(vehicle).ownerType = VRR_VEHOWNER_PLAYER;
	getVehicleData(vehicle).ownerId = getPlayerCurrentSubAccount(targetClient).databaseId;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} owner to {ALTCOLOUR}${getClientSubAccountName(targetClient)}`);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehiclePublicCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	getVehicleData(vehicle).ownerType = VRR_VEHOWNER_PUBLIC;
	getVehicleData(vehicle).ownerId = 0;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} to a public vehicle!`);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function setVehicleRentPriceCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(!doesClientOwnVehicle(client, vehicle)) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
			messagePlayerError(client, "You can't set the rent price for this vehicle!");
		}
	}

	let amount = toInteger(params) || 0;

	getVehicleData(vehicle).rentPrice = amount;
	getVehicleData(vehicle).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} rent price to {ALTCOLOUR}$${makeLargeNumberReadable(amount)}`);
}

// ===========================================================================

function setVehicleBuyPriceCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(!doesClientOwnVehicle(client, vehicle)) {
		if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageVehicles"))) {
			messagePlayerError(client, "You can't set the buy price for this vehicle!");
		}
	}

	let amount = toInteger(params) || 0;

	getVehicleData(vehicle).buyPrice = amount;
	getVehicleData(vehicle).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}'s{MAINCOLOUR} buy price to {ALTCOLOUR}$${makeLargeNumberReadable(amount)}`);
}

// ===========================================================================

function removeVehicleOwnerCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);
	let targetClient = getPlayerFromParams(params);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	if(!targetClient) {
		messagePlayerError(client, "That player is invalid or isn't connected!");
		return false;
	}

	getVehicleData(vehicle).ownerType = VRR_VEHOWNER_NONE;
	getVehicleData(vehicle).ownerId = 0;

	getVehicleData(vehicle).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} owner to nobody!`);
	messagePlayerInfo(client, `Nobody will be able to use this vehicle until it receives a new owner (either bought or set by admin).`);
}

// ===========================================================================

function getVehicleInfoCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let vehicleData = getVehicleData(vehicle);

	let ownerName = "Nobody";
	let ownerType = "None";
	ownerType = toLowerCase(getVehicleOwnerTypeText(vehicleData.ownerType));
	switch(vehicleData.ownerType) {
		case VRR_VEHOWNER_CLAN:
			ownerName = getClanData(getClanIdFromDatabaseId(vehicleData.ownerId)).name;
			ownerType = "clan";
			break;

		case VRR_VEHOWNER_JOB:
			ownerName = getJobData(getJobIdFromDatabaseId(vehicleData.ownerId)).name;
			ownerType = "job";
			break;

		case VRR_VEHOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(vehicleData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			ownerType = "player";
			break;

		case VRR_VEHOWNER_BIZ:
			ownerName = getBusinessData(getBusinessIdFromDatabaseId(vehicleData.ownerId)).name;
			ownerType = "business";
			break;

		default:
			break;
	}

	messagePlayerNormal(client, `🚗 {vehiclePurple}[Vehicle Info] {MAINCOLOUR}ID: {ALTCOLOUR}${getElementId(vehicle)}, {MAINCOLOUR}Index: {ALTCOLOUR}${vehicleData.index}, {MAINCOLOUR}DatabaseID: {ALTCOLOUR}${vehicleData.databaseId}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName}[ID ${vehicleData.ownerId}] (${ownerType}), {MAINCOLOUR}Type: {ALTCOLOUR}${getVehicleName(vehicle)}[ID: ${vehicle.modelIndex}, Index: ${getVehicleModelIndexFromModel(vehicle.modelIndex)}], {MAINCOLOUR}BuyPrice: {ALTCOLOUR}${vehicleData.buyPrice}, {MAINCOLOUR}RentPrice: {ALTCOLOUR}${vehicleData.rentPrice}`);
}

// ===========================================================================

function getLastVehicleInfoCommand(command, params, client) {
	//if(!isPlayerInAnyVehicle(client)) {
	//	messagePlayerError(client, "You need to be in a vehicle!");
	//	return false;
	//}

	let vehicle = getPlayerLastVehicle(client);

	if(!getVehicleData(vehicle)) {
		messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
		return false;
	}

	let vehicleData = getVehicleData(vehicle);

	let ownerName = "Nobody";
	let ownerType = "None";
	ownerType = toLowerCase(getVehicleOwnerTypeText(vehicleData.ownerType));
	switch(vehicleData.ownerType) {
		case VRR_VEHOWNER_CLAN:
			ownerName = getClanData(vehicleData.ownerId).name;
			ownerType = "clan";
			break;

		case VRR_VEHOWNER_JOB:
			ownerName = getJobData(vehicleData.ownerId).name;
			ownerType = "job";
			break;

		case VRR_VEHOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(vehicleData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			ownerType = "player";
			break;

		case VRR_VEHOWNER_BIZ:
			ownerName = getBusinessData(vehicleData.ownerId).name;
			ownerType = "business";
			break;

		default:
			break;
	}

	messagePlayerNormal(client, `🚗 {vehiclePurple}[Vehicle Info] {MAINCOLOUR}ID: {ALTCOLOUR}${vehicle.id}, {MAINCOLOUR}DatabaseID: {ALTCOLOUR}${vehicleData.databaseId}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName}[ID ${vehicleData.ownerId}] (${ownerType}), {MAINCOLOUR}Type: {ALTCOLOUR}${getVehicleName(vehicle)}[${vehicle.modelIndex}], {MAINCOLOUR}BuyPrice: {ALTCOLOUR}${vehicleData.buyPrice}, {MAINCOLOUR}RentPrice: {ALTCOLOUR}${vehicleData.rentPrice}`);
}

// ===========================================================================

function toggleVehicleSpawnLockCommand(command, params, client) {
	if(!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle!");
		return false;
	}

	let vehicle = getPlayerVehicle(client);

	getVehicleData(vehicle).spawnLocked = !getVehicleData(vehicle).spawnLocked;
	if(getVehicleData(vehicle).spawnLocked) {
		getVehicleData(vehicle).spawnPosition = getVehiclePosition(vehicle);
		getVehicleData(vehicle).spawnRotation = getVehicleHeading(vehicle);
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set their {vehiclePurple}${getVehicleName(vehicle)}{MAINCOLOUR} to spawn {ALTCOLOUR}${(getVehicleData(vehicle).spawnLocked) ? "at it's current location" : "wherever a player leaves it."}`);

	getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function reloadAllVehiclesCommand(command, params, client) {
	for(let i in getServerData().vehicles) {
		if(getServerData().vehicles[i].vehicle) {
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
	if(isPlayerInAnyVehicle(client)) {
		removeAllOccupantsFromVehicle(getPlayerVehicle(client));
		respawnVehicle(getPlayerVehicle(client));
	}

	setAllVehicleIndexes();

	messagePlayerSuccess(client, getLocaleString(client, `YourVehicleRespawned`));
}


// ===========================================================================

function respawnAllVehiclesCommand(command, params, client) {
	for(let i in getServerData().vehicles) {
		respawnVehicle(getServerData().vehicles[i].vehicle);
	}

	let randomVehicles = getElementsByType(ELEMENT_VEHICLE).filter(v => getVehicleData(v) == false);
	for(let i in randomVehicles) {
		destroyElement(randomVehicles[i]);
	}

	setAllVehicleIndexes();

	announceAdminAction(`AllVehiclesRespawned`);
}

// ===========================================================================

function respawnEmptyVehiclesCommand(command, params, client) {
	for(let i in getServerData().vehicles) {
		if(!isVehicleUnoccupied(getServerData().vehicles[i].vehicle)) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	let clientVehicles = getElementsByType(ELEMENT_VEHICLE).filter(v => getVehicleData(v) == false);
	for(let i in clientVehicles) {
		if(!isVehicleUnoccupied(clientVehicles[i])) {
			destroyElement(clientVehicles[i]);
		}
	}

	announceAdminAction(`EmptyVehiclesRespawned`);
}

// ===========================================================================

function respawnJobVehiclesCommand(command, params, client) {
	for(let i in getServerData().vehicles) {
		if(getServerData().vehicles[i].ownerType == VRR_VEHOWNER_JOB) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	announceAdminAction(`JobVehiclesRespawned`);
}

// ===========================================================================

function respawnClanVehiclesCommand(command, params, client) {
	for(let i in getServerData().vehicles) {
		if(getServerData().vehicles[i].ownerType == VRR_VEHOWNER_CLAN) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	announceAdminAction(`ClanVehiclesRespawned`);
}

// ===========================================================================

function respawnPlayerVehiclesCommand(command, params, client) {
	for(let i in getServerData().vehicles) {
		if(getServerData().vehicles[i].ownerType == VRR_VEHOWNER_PLAYER) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	announceAdminAction(`PlayerVehiclesRespawned`);
}

// ===========================================================================

function respawnPublicVehiclesCommand(command, params, client) {
	for(let i in getServerData().vehicles) {
		if(getServerData().vehicles[i].ownerType == VRR_VEHOWNER_PUBLIC) {
			respawnVehicle(getServerData().vehicles[i].vehicle);
		}
	}

	announceAdminAction(`PublicVehiclesRespawned`);
}

// ===========================================================================

function respawnBusinessVehiclesCommand(command, params, client) {
	for(let i in getServerData().vehicles) {
		if(getServerData().vehicles[i].ownerType == VRR_VEHOWNER_BIZ) {
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
	for(let i in vehicles) {
		if(vehicle == vehicles[i].vehicle) {
			if(vehicles[i].spawnLocked == true) {
				vehicles[i].engine = false;
			}

			if(vehicles[i].ownerType == VRR_VEHOWNER_JOB) {
				vehicles[i].locked = true;
			}

			destroyElement(vehicle);
			vehicles[i].vehicle = false;

			let newVehicle = spawnVehicle(vehicles[i]);
			vehicles[i].vehicle = newVehicle;
			setEntityData(newVehicle, "vrr.dataSlot", i, false);
		}
	}

	//getVehicleData(vehicle).needsSaved = true;
}

// ===========================================================================

function spawnVehicle(vehicleData) {
	logToConsole(LOG_DEBUG, `[VRR.Vehicle]: Spawning ${getVehicleNameFromModel(vehicleData.model)} at ${vehicleData.spawnPosition.x}, ${vehicleData.spawnPosition.y}, ${vehicleData.spawnPosition.z} with heading ${vehicleData.spawnRotation}`);
	let vehicle = createGameVehicle(vehicleData.model, vehicleData.spawnPosition, vehicleData.spawnRotation);
	setVehicleHeading(vehicle, vehicleData.spawnRotation);
	setElementTransient(vehicle, false);
	addToWorld(vehicle);

	if(!vehicle) {
		return false;
	}

	setVehicleHeading(vehicle, vehicleData.spawnRotation);
	setElementDimension(vehicle, vehicleData.dimension);
	addToWorld(vehicle);

	vehicleData.vehicle = vehicle;

	if(isGameFeatureSupported("vehicleColours")) {
		if(vehicleData.colour1IsRGBA && vehicleData.colour2IsRGBA) {
			vehicle.setRGBColours(vehicleData.colour1RGBA, vehicleData.colour2RGBA);
			let colour1 = rgbaArrayFromToColour(vehicleData.colour1RGBA);
			let colour2 = rgbaArrayFromToColour(vehicleData.colour2RGBA);
			logToConsole(LOG_VERBOSE, `[VRR.Vehicle]: Setting vehicle ${vehicle.id}'s colours to RGBA [${colour1[0]}, ${colour1[1]}, ${colour1[2]}, ${colour1[3]}], [(]${colour2[0]}, ${colour2[1]}, ${colour2[2]}, ${colour2[3]}]`);
			vehicle.setRGBColours(vehicleData.colour1RGBA, vehicleData.colour2RGBA);
		} else {
			setVehicleColours(vehicle, vehicleData.colour1, vehicleData.colour2, vehicleData.colour3, vehicleData.colour4);
			logToConsole(LOG_VERBOSE, `[VRR.Vehicle]: Setting vehicle ${vehicle.id}'s colours to ${vehicleData.colour1}, ${vehicleData.colour2}, ${vehicleData.colour3}, ${vehicleData.colour4}`);
		}
	}

	if(vehicleData.spawnLocked == true) {
		setVehicleEngine(vehicle, false);
		logToConsole(LOG_VERBOSE, `[VRR.Vehicle]: Setting vehicle ${vehicle.id}'s engine to OFF`);
	} else {
		setVehicleEngine(vehicle, intToBool(vehicleData.engine));logToConsole(LOG_VERBOSE, `[VRR.Vehicle]: Setting vehicle ${vehicle.id}'s engine to ${toUpperCase(getOnOffFromBool(getVehicleEngine(vehicle)))}`);
	}

	if(typeof vehicle.locked != "undefined") {
		setVehicleLocked(vehicle, intToBool(vehicleData.locked));
		logToConsole(LOG_VERBOSE, `[VRR.Vehicle]: Setting vehicle ${vehicle.id}'s lock state to ${toUpperCase(getOnOffFromBool(getVehicleLocked(vehicle)))}`);
	}

	//setVehicleHealth(vehicle, 1000);
	repairVehicle(vehicle);

	setEntityData(vehicle, "vrr.livery", vehicleData.livery, true);
	setEntityData(vehicle, "vrr.upgrades", vehicleData.extras, true);
	setEntityData(vehicle, "vrr.interior", vehicleData.interior, true);
	setEntityData(vehicle, "vrr.engine", vehicleData.engine, true);

	forcePlayerToSyncElementProperties(null, vehicle);


	return vehicle;
}

// ===========================================================================

function isVehicleAtPayAndSpray(vehicle) {
	for(let i in getServerData().payAndSprays[getGame()]) {
		if(getDistance(getVehiclePosition(vehicle), getServerData().payAndSprays[getGame()][i].position) <= getGlobalConfig().payAndSprayDistance) {
			return true;
		}
	}
	return false;
}

// ===========================================================================

function getVehicleOwnerTypeText(ownerType) {
	switch(ownerType) {
		case VRR_VEHOWNER_CLAN:
			return "clan";

		case VRR_VEHOWNER_JOB:
			return "job";

		case VRR_VEHOWNER_PLAYER:
			return "player";

		case VRR_VEHOWNER_BIZ:
			return "business";

		default:
			return "unknown";
	}
}

// ===========================================================================

function isVehicleOwnedByJob(vehicle, jobId) {
	if(getVehicleData(vehicle).ownerType == VRR_VEHOWNER_JOB) {
		return (getVehicleData(vehicle).ownerId == jobId);
	}
	return false;
}

// ===========================================================================

async function getPlayerNewVehicle(client) {
	while(true) {
		if(isPlayerInAnyVehicle(client)) {
			return getPlayerVehicle(client);
		}
		await null;
	}
}

// ===========================================================================

function createNewDealershipVehicle(modelIndex, spawnPosition, spawnRotation, price, dealershipId, interior = 0, dimension = 0) {
	let vehicle = createGameVehicle(modelIndex, spawnPosition, spawnRotation);
	if(!vehicle) {
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
	tempVehicleData.ownerType = VRR_VEHOWNER_BIZ;
	tempVehicleData.ownerId = dealershipId;
	tempVehicleData.needsSaved = true;
	tempVehicleData.interior = interior;
	tempVehicleData.dimension = dimension;

	let slot = getServerData().vehicles.push(tempVehicleData);
	setEntityData(vehicle, "vrr.dataSlot", slot-1, false);
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
	if(!isGameFeatureSupported("vehicleColours")) {
		tempVehicleData.colour1 = 0;
		tempVehicleData.colour2 = 0;
		tempVehicleData.colour3 = 0;
		tempVehicleData.colour4 = 0;
	}

	let slot = getServerData().vehicles.push(tempVehicleData);
	setEntityData(vehicle, "vrr.dataSlot", slot-1, false);

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
	if(!isGameFeatureSupported("vehicleColours")) {
		tempVehicleData.colour1 = 0;
		tempVehicleData.colour2 = 0;
		tempVehicleData.colour3 = 0;
		tempVehicleData.colour4 = 0;
	}

	let slot = getServerData().vehicles.push(tempVehicleData);

	if(areServerElementsSupported()) {
		setEntityData(vehicle, "vrr.dataSlot", slot-1, false);
	}


	return vehicle;
}

// ===========================================================================

function processVehiclePurchasing() {
	if(!getGlobalConfig().useServerSideVehiclePurchaseCheck) {
		return false;
	}

	let purchasingVehicles = getServerData().purchasingVehicleCache;
	for(let i in purchasingVehicles) {
		checkVehiclePurchasing(purchasingVehicles[i]);
	}

	return false;
}

// ===========================================================================

function checkVehiclePurchasing(client) {
	if(!isPlayerLoggedIn(client)) {
		setPlayerBuyingVehicleState(client, VRR_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if(!isPlayerSpawned(client)) {
		setPlayerBuyingVehicleState(client, VRR_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if(!getPlayerData(client)) {
		setPlayerBuyingVehicleState(client, VRR_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if(!getPlayerData(client).buyingVehicle) {
		setPlayerBuyingVehicleState(client, VRR_VEHBUYSTATE_NONE, null, null);
		return false;
	}

	if(!isPlayerInAnyVehicle(client)) {
		if(getPlayerData(client).buyingVehicle != false) {
			getServerData().purchasingVehicleCache.splice(getServerData().purchasingVehicleCache.indexOf(client), 1);
			messagePlayerError(client, getLocaleString(client, "DealershipPurchaseExitedVehicle"));
			respawnVehicle(getPlayerData(client).buyingVehicle);
			getPlayerData(client).buyingVehicle = false;
			setPlayerBuyingVehicleState(client, VRR_VEHBUYSTATE_NONE, null, null);
		}
		return false;
	}

	if(getDistance(getVehiclePosition(getPlayerData(client).buyingVehicle), getVehicleData(getPlayerData(client).buyingVehicle).spawnPosition) > getGlobalConfig().buyVehicleDriveAwayDistance) {
		if(getPlayerCurrentSubAccount(client).cash < getVehicleData(getPlayerData(client).buyingVehicle).buyPrice) {
			getServerData().purchasingVehicleCache.splice(getServerData().purchasingVehicleCache.indexOf(client), 1);
			messagePlayerError(client, getLocaleString(client, "VehiclePurchaseNotEnoughMoney"));
			respawnVehicle(getPlayerData(client).buyingVehicle);
			getPlayerData(client).buyingVehicle = false;
			setPlayerBuyingVehicleState(client, VRR_VEHBUYSTATE_NONE, null, null);
			return false;
		}

		getServerData().purchasingVehicleCache.splice(getServerData().purchasingVehicleCache.indexOf(client), 1);
		createNewDealershipVehicle(getVehicleData(getPlayerData(client).buyingVehicle).model, getVehicleData(getPlayerData(client).buyingVehicle).spawnPosition, getVehicleData(getPlayerData(client).buyingVehicle).spawnRotation, getVehicleData(getPlayerData(client).buyingVehicle).buyPrice, getVehicleData(getPlayerData(client).buyingVehicle).ownerId);
		takePlayerCash(client, getVehicleData(getPlayerData(client).buyingVehicle).buyPrice);
		updatePlayerCash(client);
		getVehicleData(getPlayerData(client).buyingVehicle).ownerId = getPlayerCurrentSubAccount(client).databaseId;
		getVehicleData(getPlayerData(client).buyingVehicle).ownerType = VRR_VEHOWNER_PLAYER;
		getVehicleData(getPlayerData(client).buyingVehicle).buyPrice = 0;
		getVehicleData(getPlayerData(client).buyingVehicle).rentPrice = 0;
		getVehicleData(getPlayerData(client).buyingVehicle).spawnLocked = false;
		getPlayerData(client).buyingVehicle = false;
		messagePlayerSuccess(client, getLocaleString(client, "VehiclePurchaseComplete"));
		setPlayerBuyingVehicleState(client, VRR_VEHBUYSTATE_NONE, null, null);
		return true;
	}
}

// ===========================================================================

function processVehicleBurning() {
	if(!getGlobalConfig().useServerSideVehicleBurnCheck) {
		return false;
	}

	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for(let i in vehicles) {
		if(vehicles[i].syncer == null) {
			if(vehicles[i].health <= 250) {
				vehicles[i].health = 250;
			}
		}
	}
}

// ===========================================================================

function cacheAllVehicleItems() {
	for(let i in getServerData().vehicles) {
		for(let j in getServerData().items) {
			if(getItemData(j).ownerType == VRR_ITEM_OWNER_VEHTRUNK && getItemData(j).ownerId == getServerData().vehicles[i].databaseId) {
				getServerData().vehicles[i].trunkItemCache.push(j);
			} else if(getItemData(j).ownerType == VRR_ITEM_OWNER_VEHDASH && getItemData(j).ownerId == getServerData().vehicles[i].databaseId) {
				getServerData().vehicles[i].dashItemCache.push(j);
			}
		}
	}
}

// ===========================================================================

function resetVehiclePosition(vehicle) {
	if(!getVehicleData(vehicle).spawnLocked) {
		getVehicleData(vehicle).spawnPosition = getVehiclePosition(vehicle);
		getVehicleData(vehicle).spawnHeading = getVehiclePosition(vehicle);
	}
}

// ===========================================================================

function setAllVehicleIndexes() {
	for(let i in getServerData().vehicles) {
		getServerData().vehicles[i].index = i;
	}
}

// ===========================================================================

function doesVehicleHaveMegaphone(vehicle) {
	if(getVehicleData(vehicle).ownerType == VRR_VEHOWNER_JOB) {
		if(getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == VRR_JOB_POLICE) {
			return true;
		}

		if(getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == VRR_JOB_FIRE) {
			return true;
		}

		if(getJobType(getJobIdFromDatabaseId(getVehicleData(vehicle).ownerId)) == VRR_JOB_MEDICAL) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getVehicleFromDatabaseId(databaseId) {
	let vehicles = getServerData().vehicles;
	for(let i in vehicles) {
		if(vehicles[i].databaseId == databaseId) {
			return vehicles[i].vehicle;
		}
	}
}

// ===========================================================================

function isVehicleUnoccupied(vehicle) {
	for(let i = 0 ; i <= 8 ; i++) {
		if(vehicle.getOccupant(i) != null) {
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
	for(let i = 0 ; i <= 16 ; i++) {
		if(vehicle.getOccupant(i) != null) {
			removePlayerFromVehicle(vehicle.getOccupant(i));
		}
	}
}

// ===========================================================================