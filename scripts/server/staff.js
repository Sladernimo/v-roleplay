// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: staff.js
// DESC: Provides staff commands, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initStaffScript() {
	logToConsole(LOG_INFO, "[AGRP.Staff]: Initializing staff script ...");
	logToConsole(LOG_INFO, "[AGRP.Staff]: Staff script initialized successfully!");
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function kickClientCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	// Prevent kicking admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot kick this person!");
			return false;
		}
	}

	//getPlayerData(targetClient).customDisconnectReason = reason;
	announceAdminAction(`PlayerKicked`, getPlayerName(targetClient));
	getPlayerData(targetClient).customDisconnectReason = "Kicked";
	disconnectPlayer(targetClient);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setStaffTitleCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let staffTitle = splitParams.slice(1).join(" ");

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	// Prevent setting titles on staff with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot set this person's staff title!");
			return false;
		}
	}

	getPlayerData(targetClient).accountData.staffTitle = staffTitle;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set {ALTCOLOUR}${getPlayerName(targetClient)}'s{MAINCOLOUR} staff title to ${staffTitle}`);
	messagePlayerAlert(targetClient, `${getPlayerName(client)} set your staff title to ${staffTitle}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function muteClientCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	// Prevent muting admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot mute this person!");
			return false;
		}
	}

	messageAdmins(`{adminOrange}${getPlayerName(targetClient)}{MAINCOLOUR} has been muted by {adminOrange}${getPlayerName(client)}`);
	getPlayerData(targetClient).muted = true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function unMuteClientCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	// Prevent unmuting admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot unmute this person!");
			return false;
		}
	}

	messageAdmins(`{adminOrange}${getPlayerName(targetClient)}{MAINCOLOUR} has been un-muted by {adminOrange}${getPlayerName(client)}`);
	getPlayerData(targetClient).muted = false;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function freezeClientCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	// Prevent freeze admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot freeze this person!");
			return false;
		}
	}

	messageAdmins(`{adminOrange}${getPlayerName(targetClient)}{MAINCOLOUR} has been frozen by ${getPlayerName(client)}`);
	//setPlayerFrozenState(client, state);
	setPlayerControlState(client, false);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function unFreezeClientCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	// Prevent unfreezing admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot freeze this person!");
			return false;
		}
	}

	messageAdmins(`{adminOrange}${getPlayerName(targetClient)}{MAINCOLOUR} has been un-frozen by ${getPlayerName(client)}`);
	//sendPlayerFrozenState(client, false);
	setPlayerControlState(client, true);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function gotoPlayerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getPosBehindPos(getPlayerPosition(targetClient), getPlayerHeading(targetClient), 2));
	setPlayerHeading(client, getPlayerHeading(targetClient));
	setPlayerInterior(client, getPlayerInterior(targetClient));
	setPlayerDimension(client, getPlayerInterior(targetClient));
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getPosBehindPos(getPlayerPosition(targetClient), getPlayerHeading(targetClient), 2));
	//	setPlayerHeading(client, getPlayerHeading(targetClient));
	//	setPlayerInterior(client, getPlayerInterior(targetClient));
	//	setPlayerDimension(client, getPlayerInterior(targetClient));
	//	updateInteriorLightsForPlayer(client, true);
	//}, 1000);

	messagePlayerSuccess(client, `You teleported to {ALTCOLOUR}${getPlayerName(targetClient)}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getPlayerGeoIPInformationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	let countryName = module.geoip.getCountryName(getGlobalConfig().geoIPCountryDatabaseFilePath, getPlayerIP(targetClient));
	let subDivisionName = module.geoip.getSubdivisionName(getGlobalConfig().geoIPCityDatabaseFilePath, getPlayerIP(targetClient));
	let cityName = module.geoip.getCityName(getGlobalConfig().geoIPCityDatabaseFilePath, getPlayerIP(targetClient));

	messagePlayerInfo(client, `{ALTCOLOUR}${getPlayerName(targetClient)}{MAINCOLOUR} is from {ALTCOLOUR}${cityName}, ${subDivisionName}, ${countryName}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getPlayerIPInformationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	messagePlayerInfo(client, `{ALTCOLOUR}${getPlayerName(targetClient)}'s{MAINCOLOUR} IP is ${getPlayerIP(targetClient)}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function gotoVehicleCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (typeof getServerData().vehicles[toInteger(params)] == "undefined") {
		messagePlayerError(client, "That vehicle ID doesn't exist!");
	}

	let vehicle = getServerData().vehicles[toInteger(params)].vehicle;

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getPosAbovePos(getVehiclePosition(vehicle), 3.0));
	setPlayerInterior(client, 0);
	setPlayerDimension(client, getElementDimension(vehicle));
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getPosAbovePos(getVehiclePosition(vehicle), 3.0));
	//	setPlayerInterior(client, 0);
	//	setPlayerDimension(client, getElementDimension(vehicle));
	//	updateInteriorLightsForPlayer(client, true);
	//}, 500);

	messagePlayerSuccess(client, `You teleported to a {vehiclePurple}${getVehicleName(vehicle)} {ALTCOLOUR}(ID ${vehicle.id})`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getVehicleCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (typeof getServerData().vehicles[toInteger(params) - 1] == "undefined") {
		messagePlayerError(client, "That vehicle ID doesn't exist!");
	}

	let vehicle = getServerData().vehicles[toInteger(params) - 1].vehicle;

	setElementPosition(vehicle, getPosInFrontOfPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), 5.0));
	setElementInterior(vehicle, getPlayerInterior(client));
	setElementDimension(vehicle, getPlayerDimension(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} teleported a {vehiclePurple}${getVehicleName(vehicle)}{ALTCOLOUR} (ID ${vehicle.id}){MAINCOLOUR} to their position`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function warpIntoVehicleCommand(command, params, client) {
	let vehicle = getClosestVehicle(getPlayerPosition(client));

	if (areParamsEmpty(params)) {
		if (!getPlayerVehicle(client) && getDistance(getVehiclePosition(vehicle), getPlayerPosition(client)) > getGlobalConfig().vehicleLockDistance) {
			messagePlayerError(client, getLocaleString(client, "MustBeInOrNearVehicle"));
			return false;
		}
	} else {
		let vehicleIndex = getParam(params, " ", 1);
		if (typeof getServerData().vehicles[vehicleIndex] == "undefined") {
			messagePlayerError(client, getLocaleString(client, "InvalidVehicle"));
			return false;
		}

		vehicle = getServerData().vehicles[vehicleIndex].vehicle;
	}

	if (getVehicleData(vehicle)) {
		getPlayerData(client).enteringVehicle = vehicle;
	}

	let seatId = getParam(params, " ", 2) || 0;

	warpPedIntoVehicle(getPlayerData(client).ped, vehicle, seatId);
	messagePlayerSuccess(client, `You warped into a ${getVehicleName(vehicle)} (ID ${getVehicleData(vehicle).index}/${getVehicleData(vehicle).databaseId})`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function gotoBusinessCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let businessId = getBusinessFromParams(params)

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getBusinessData(businessId).entrancePosition);
	setPlayerInterior(client, getBusinessData(businessId).entranceInterior);
	setPlayerDimension(client, getBusinessData(businessId).entranceDimension);
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getBusinessData(businessId).entrancePosition);
	//	setPlayerInterior(client, getBusinessData(businessId).entranceInterior);
	//	setPlayerDimension(client, getBusinessData(businessId).entranceDimension);
	//	updateInteriorLightsForPlayer(client, true);
	//}, 500);

	messagePlayerSuccess(client, `You teleported to business {businessBlue}${getBusinessData(businessId).name} {ALTCOLOUR}(ID ${businessId})`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function gotoGameLocationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let gameLocationId = getGameLocationFromParams(params);

	if (gameLocationId == false) {
		messagePlayerError(client, "That game location doesn't exist!");
		return false;
	}

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getGameConfig().locations[getGame()][gameLocationId][1]);
	setPlayerHeading(client, getGameConfig().locations[getGame()][gameLocationId][1]);
	setPlayerInterior(client, 0);
	setPlayerDimension(client, 0);
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getGameConfig().locations[getGame()][gameLocationId][1]);
	//	setPlayerInterior(client, 0);
	//	setPlayerDimension(client, 0);
	//	updateInteriorLightsForPlayer(client, true);
	//}, 500);

	messagePlayerSuccess(client, `You teleported to game location {ALTCOLOUR}${getGameConfig().locations[getGame()][gameLocationId][0]}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function gotoHouseCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let houseId = getHouseFromParams(params)

	if (!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getHouseData(houseId).entrancePosition);
	setPlayerInterior(client, getHouseData(houseId).entranceInterior);
	setPlayerDimension(client, getHouseData(houseId).entranceDimension);
	updateInteriorLightsForPlayer(client, true);

	//setTimeout(function() {
	//	setPlayerPosition(client, getHouseData(houseId).entrancePosition);
	//	setPlayerInterior(client, getHouseData(houseId).entranceInterior);
	//	setPlayerDimension(client, getHouseData(houseId).entranceDimension);
	//	updateInteriorLightsForPlayer(client, true);
	//}, 500);

	messagePlayerSuccess(client, `You teleported to house {houseGreen}${getHouseData(houseId).description} {ALTCOLOUR}(ID ${houseId})`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function gotoJobLocationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(getParam(params, " ", 1)) || getClosestJobLocation(getPlayerPosition(client)).job;

	if (!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	let jobLocationId = getParam(params, " ", 2) || 0;

	if (typeof getJobData(jobId).locations[jobLocationId] == "undefined") {
		messagePlayerError(client, `That location ID does not exist!`);
		return false;
	}

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getJobData(jobId).locations[jobLocationId].position);
	setPlayerInterior(client, getJobData(jobId).locations[jobLocationId].interior);
	setPlayerDimension(client, getJobData(jobId).locations[jobLocationId].dimension);
	updateInteriorLightsForPlayer(client, true);

	messagePlayerSuccess(client, `You teleported to location {ALTCOLOUR}${jobLocationId} {MAINCOLOUR}for the ${getInlineChatColourByName("jobYellow")}${getJobData(jobId).name} {MAINCOLOUR}job`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function gotoNewPlayerSpawnCommand(command, params, client) {
	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerPosition(client, getServerConfig().newCharacter.spawnPosition);
	setPlayerInterior(client, 0);
	setPlayerDimension(client, 0);
	updateInteriorLightsForPlayer(client, true);

	messagePlayerSuccess(client, `You teleported to the new character spawn location!`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function gotoPositionCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	params = params.replace(",", "");
	let x = getParam(params, " ", 1);
	let y = getParam(params, " ", 2);
	let z = getParam(params, " ", 3);
	let int = getParam(params, " ", 4);
	let vw = getParam(params, " ", 5);

	setPlayerVelocity(client, toVector3(0.0, 0.0, 0.0));
	setPlayerInterior(client, toInteger(int));
	setPlayerDimension(client, toInteger(vw));
	setPlayerPosition(client, toVector3(toFloat(x), toFloat(y), toFloat(z)));
	updateInteriorLightsForPlayer(client, true);

	messagePlayerSuccess(client, `You teleported to coordinates {ALTCOLOUR}${x}, ${y}, ${z} with interior ${int} and dimension ${vw}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function teleportForwardCommand(command, params, client) {
	let distance = 1.0;
	if (!areParamsEmpty(params)) {
		if (!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosInFrontOfPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), distance));

	messagePlayerSuccess(client, `You teleported forward ${distance} meters`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function teleportBackwardCommand(command, params, client) {
	let distance = 1.0;
	if (!areParamsEmpty(params)) {
		if (!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosBehindPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), distance));

	messagePlayerSuccess(client, `You teleported backward {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function teleportLeftCommand(command, params, client) {
	let distance = 1.0;
	if (!areParamsEmpty(params)) {
		if (!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosToLeftOfPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), distance));

	messagePlayerSuccess(client, `You teleported left {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function teleportUpCommand(command, params, client) {
	let distance = 1.0;
	if (!areParamsEmpty(params)) {
		if (!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosAbovePos(getPlayerPosition(client), distance));

	messagePlayerSuccess(client, `You teleported up {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function teleportDownCommand(command, params, client) {
	let distance = 1.0;
	if (!areParamsEmpty(params)) {
		if (!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosBelowPos(getPlayerPosition(client), distance));

	messagePlayerSuccess(client, `You teleported down {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

function teleportRightCommand(command, params, client) {
	let distance = 1.0;
	if (!areParamsEmpty(params)) {
		if (!isNaN(params)) {
			distance = toFloat(params);
		}
	}

	setPlayerPosition(client, getPosToRightOfPos(getPlayerPosition(client), fixAngle(getPlayerHeading(client)), distance));

	messagePlayerSuccess(client, `You teleported right {ALTCOLOUR}${distance} {MAINCOLOUR}meters`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function playerInteriorCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getParamsCount(params, " ") == 1) {
		messagePlayerInfo(client, `${getPlayerName(targetClient)}'s interior is {ALTCOLOUR}${getPlayerInterior(targetClient)}`);
		return false;
	}

	let interiorId = getParam(params, " ", 2);
	setPlayerInterior(targetClient, Number(interiorId));
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set {ALTCOLOUR}${getPlayerName(targetClient)}'s{MAINCOLOUR} interior to {ALTCOLOUR}${interiorId}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function playerVirtualWorldCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getParamsCount(params, " ") == 1) {
		messagePlayerInfo(client, `{ALTCOLOUR}${getPlayerName(targetClient)}'s{MAINCOLOUR} virtual world is {ALTCOLOUR}${getPlayerDimension(targetClient)}`);
		return false;
	}

	let dimensionId = getParam(params, " ", 2);
	setPlayerDimension(targetClient, Number(dimensionId));
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set {ALTCOLOUR}${getPlayerName(targetClient)}'s{MAINCOLOUR} virtual world to {ALTCOLOUR}${dimensionId}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getPlayerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	removePlayerFromVehicle(targetClient);

	getPlayerData(targetClient).returnToPosition = getPlayerPosition(targetClient);
	getPlayerData(targetClient).returnToHeading = getPlayerPosition(targetClient);
	getPlayerData(targetClient).returnToDimension = getPlayerDimension(targetClient);
	getPlayerData(targetClient).returnToInterior = getPlayerInterior(targetClient);
	getPlayerData(targetClient).returnToType = AGRP_RETURNTO_TYPE_ADMINGET;

	setPlayerPosition(targetClient, getPosBehindPos(getPlayerPosition(client), getPlayerHeading(client), 2));
	setPlayerHeading(targetClient, getPlayerHeading(client));
	setPlayerInterior(targetClient, getPlayerInterior(client));
	setPlayerDimension(targetClient, getPlayerDimension(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} teleported {ALTCOLOUR}${getPlayerName(targetClient)}{MAINCOLOUR} to their position.`);
	messagePlayerAlert(targetClient, `An admin has teleported you to their location`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function returnPlayerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	removePlayerFromVehicle(targetClient);

	if (getPlayerData(targetClient).returnToPosition == null) {
		messagePlayerError(client, "There is nowhere to return that player to!");
		return false;
	}

	setPlayerPosition(targetClient, getPlayerData(targetClient).returnToPosition);
	setPlayerHeading(targetClient, getPlayerData(targetClient).returnToHeading);
	setPlayerInterior(targetClient, getPlayerData(targetClient).returnToInterior);
	setPlayerDimension(targetClient, getPlayerData(targetClient).returnToDimension);

	getPlayerData(targetClient).returnToPosition = null;
	getPlayerData(targetClient).returnToHeading = null;
	getPlayerData(targetClient).returnToDimension = null;
	getPlayerData(targetClient).returnToInterior = null;
	getPlayerData(targetClient).returnToHouse = null;
	getPlayerData(targetClient).returnToBusiness = null;
	getPlayerData(targetClient).returnToType = AGRP_RETURNTO_TYPE_NONE;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} returned {ALTCOLOUR}${getPlayerName(targetClient)}{MAINCOLOUR} to their previous position.`);
	messagePlayerAlert(targetClient, `An admin has returned you to your previous location`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function addPlayerStaffFlagCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let flagName = getParam(params, " ", 2) || "None";

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getStaffFlagValue(flagName) == false) {
		messagePlayerError(client, getLocaleString(client, "InvalidStaffFlag"));
		return false;
	}

	// Prevent setting flags on admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot give staff flags to this person!");
			return false;
		}
	}

	givePlayerStaffFlag(targetClient, flagName);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} has given {ALTCOLOUR}${getPlayerName(targetClient)}{MAINCOLOUR} the {ALTCOLOUR}${flagName}{MAINCOLOUR} staff flag`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function removePlayerStaffFlagCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let flagName = getParam(params, " ", 2) || "None";

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getStaffFlagValue(flagName) == false) {
		messagePlayerError(client, "That staff flag doesn't exist!");
		return false;
	}

	// Prevent setting flags on admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot take staff flags from this person!");
			return false;
		}
	}

	takePlayerStaffFlag(targetClient, flagName);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} has taken the {ALTCOLOUR}${flagName}{MAINCOLOUR} staff flag from {ALTCOLOUR}${getPlayerName(targetClient)}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function removePlayerStaffFlagsCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	// Prevent setting flags on admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("ManageServer")) || doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue("Developer"))) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer")) && !doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer"))) {
			messagePlayerError(client, "You cannot clear staff flags for this person!");
			return false;
		}
	}

	clearPlayerStaffFlags(targetClient);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed all staff flags from {ALTCOLOUR}${getPlayerName(targetClient)}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getPlayerStaffFlagsCommand(command, params, client) {
	if (getCommand(command).requireLogin) {
		if (!isPlayerLoggedIn(client)) {
			messagePlayerError(client, "You must be logged in to use this command!");
			return false;
		}
	}

	if (!doesPlayerHaveStaffPermission(client, getCommandRequiredPermissions(command))) {
		messagePlayerError(client, "You do not have permission to use this command!");
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	let tempStaffFlags = [];
	let serverBitFlagKeys = getServerBitFlagKeys();
	for (let i in serverBitFlagKeys) {
		let tempFlagValue = getStaffFlagValue(serverBitFlagKeys[i]);
		if (doesPlayerHaveStaffPermission(targetClient, tempFlagValue)) {
			tempStaffFlags.push(serverBitFlagKeys[i]);
		}
	}

	let flagList = [];
	for (let i in getServerBitFlagKeys().staffFlagKeys) {
		if (doesPlayerHaveStaffPermission(targetClient, getStaffFlagValue(getServerBitFlagKeys().staffFlagKeys[i]))) {
			flagList.push(`{softGreen}${getServerBitFlagKeys().staffFlagKeys[i]}`);
		} else {
			flagList.push(`{softRed}${getServerBitFlagKeys().staffFlagKeys[i]}`);
		}
	}

	let chunkedList = splitArrayIntoChunks(flagList, 8);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerStaffFlagsList", getPlayerData(targetClient).accountData.name)));

	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join("{MAINCOLOUR}, "));
	}
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getStaffFlagsCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getParam(params, " ", 1);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	let chunkedList = splitArrayIntoChunks(getServerBitFlagKeys().staffFlagKeys, 8);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderStaffFlagsList")));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join("{MAINCOLOUR}, "));
	}
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function givePlayerMoneyCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let amount = toInteger(getParam(params, " ", 2));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	givePlayerCash(targetClient, toInteger(amount));
	updatePlayerCash(targetClient);
	//messagePlayerSuccess(client, `You gave {ALTCOLOUR}${getCurrencyString(amount)} {MAINCOLOUR}to {ALTCOLOUR}${getCharacterFullName(targetClient)}`);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} gave {ALTCOLOUR}${getCurrencyString(amount)}{MAINCOLOUR} to {ALTCOLOUR}${getCharacterFullName(targetClient)}`)
	messagePlayerAlert(targetClient, `An admin gave you {ALTCOLOUR}${getCurrencyString(amount)}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function forcePlayerAccentCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let newAccent = getParam(params, " ", 2) || "None";

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (toLowerCase(newAccent) == "None") {
		newAccent = "";
	}

	setPlayerAccentText(client, newAccent);

	if (newAccent == "") {
		//messagePlayerSuccess(client, `You removed {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}accent.`);
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed {ALTCOLOUR}${getCharacterFullName(targetClient)}'s{MAINCOLOUR} accent.`);
		messagePlayerAlert(client, `An admin removed your accent.`);
	} else {
		//messagePlayerSuccess(client, `You set {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}accent to {ALTCOLOUR}${newAccent}`);
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set {ALTCOLOUR}${getCharacterFullName(targetClient)}'s{MAINCOLOUR} accent to {ALTCOLOUR}${newAccent}`)
		messagePlayerAlert(client, `An admin set your accent to {ALTCOLOUR}${newAccent}`);
	}
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function forceCharacterNameChangeCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	getPlayerData(targetClient).changingCharacterName = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} forced {ALTCOLOUR}${getPlayerName(targetClient)} (${getCharacterFullName(targetClient)}){MAINCOLOUR} to change their character's name.`);
	showPlayerNewCharacterFailedGUI(targetClient, getLocaleString(targetClient, "NonRPName"));
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function forceCharacterNameCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	//if(areThereEnoughParams(params, 3, " ")) {
	//	messagePlayerSyntax(client, getCommandSyntaxText(command));
	//	return false;
	//}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let firstName = getParam(params, " ", 2);
	let lastName = getParam(params, " ", 3);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	firstName = fixCharacterName(firstName);
	lastName = fixCharacterName(lastName);
	let newName = `${firstName} ${lastName}`;
	let oldName = getCharacterFullName(targetClient);

	getPlayerCurrentSubAccount(targetClient).firstName = firstName;
	getPlayerCurrentSubAccount(targetClient).lastName = lastName;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set {ALTCOLOUR}${getPlayerName(targetClient)}'s{MAINCOLOUR} current character name from {ALTCOLOUR}${oldName}{MAINCOLOUR} to {ALTCOLOUR}${newName}`);

	updateAllPlayerNameTags();
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function forcePlayerSkinCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	//if(areThereEnoughParams(params, 3, " ")) {
	//	messagePlayerSyntax(client, getCommandSyntaxText(command));
	//	return false;
	//}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(splitParams[0]);
	let skinIndex = getSkinModelIndexFromParams(splitParams.slice(1).join(" "), getGame());

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!skinIndex) {
		messagePlayerError(client, getLocaleString(client, "InvalidSkin"));
		return false;
	}

	getPlayerCurrentSubAccount(targetClient).skin = skinIndex;
	setPlayerSkin(targetClient, skinIndex);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set ${getPlayerName(targetClient)}'s{MAINCOLOUR} skin to {ALTCOLOUR}${getGameConfig().skins[getGame()][skinIndex][1]}`);
}

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setPlayerStaffTitleCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(splitParams[0]);
	let newTitle = splitParams.slice(1).join(" ");

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	getPlayerData(client).accountData.staffTitle = newTitle;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set ${getPlayerName(targetClient)}'s{MAINCOLOUR} staff title to {ALTCOLOUR}${newTitle}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function forcePlayerHealthCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	//if(areThereEnoughParams(params, 3, " ")) {
	//	messagePlayerSyntax(client, getCommandSyntaxText(command));
	//	return false;
	//}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let health = getParam(params, " ", 2);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	setPlayerHealth(targetClient, health);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set ${getPlayerName(targetClient)}'s{MAINCOLOUR} health to {ALTCOLOUR}${health}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function forcePlayerArmourCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let armour = getParam(params, " ", 2);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	setPlayerArmour(targetClient, armour);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set ${getPlayerName(targetClient)}'s{MAINCOLOUR} armour to {ALTCOLOUR}${armour}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function setPlayerInfiniteRunCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let state = getParam(params, " ", 2) || 0;

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (isNaN(state)) {
		messagePlayerError(client, `The infinite run state must be a number!`);
		return false;
	}

	state = toInteger(state);
	setPlayerInfiniteRun(targetClient, intToBool(state));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getBoolRedGreenInlineColour(state)}${(state) ? "enabled" : "disabled"}{MAINCOLOUR} infinite run for {ALTCOLOUR}${getPlayerName(targetClient)}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function forcePlayerWantedLevelCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let wantedLevel = getParam(params, " ", 2);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	setPlayerWantedLevel(targetClient, wantedLevel);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set ${getPlayerName(targetClient)}'s{MAINCOLOUR} wanted level to {ALTCOLOUR}${wantedLevel}`);
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getVehiclesOwnedByPlayerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	let vehicles = getAllVehiclesOwnedByPlayer(targetClient);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerVehiclesList", getCharacterFullName(targetClient))));
	for (let i in vehicles) {
		messagePlayerNormal(client, `🚗 {vehiclePurple}[Vehicle Info] {MAINCOLOUR}ID: {ALTCOLOUR}${vehicles[i].index}, {MAINCOLOUR}DatabaseID: {ALTCOLOUR}${vehicles[i].databaseId}, {MAINCOLOUR}Type: {ALTCOLOUR}${getVehicleName(vehicles[i].vehicle)}[${vehicles[i].model}], {MAINCOLOUR}BuyPrice: {ALTCOLOUR}${vehicles[i].buyPrice}, {MAINCOLOUR}RentPrice: {ALTCOLOUR}${vehicles[i].rentPrice}, {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(vehicles[i].locked)}, {MAINCOLOUR}Engine: {ALTCOLOUR}${getYesNoFromBool(vehicles[i].engine)}`);
	}
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getBusinessesOwnedByPlayerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	let businesses = getAllBusinessesOwnedByPlayer(targetClient);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerBusinessesList", getCharacterFullName(targetClient))));
	for (let i in businesses) {
		let info = [
			`Name: ${businesses[i].name}`,
			`Locked: ${businesses[i].locked}`,
			`ID: ${businesses[i].index}/${businesses[i].databaseId}`,
		]
		messagePlayerNormal(client, `🏢 {businessBlue}[Business Info] {MAINCOLOUR}${info.join(", ")}`);
	}
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getHousesOwnedByPlayerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	let houses = getAllHousesOwnedByPlayer(targetClient);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerHousesList", getCharacterFullName(targetClient))));
	for (let i in houses) {
		messagePlayerNormal(client, `🏠 {houseGreen}[House Info] {MAINCOLOUR}Description: {ALTCOLOUR}${houses[i].description}, {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(intToBool(houses[i].locked))}, {MAINCOLOUR}ID: {ALTCOLOUR}${houses[i].index}/${houses[i].databaseId}`);
	}
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function forceAccountPasswordResetCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function toggleSyncForElementsSpawnedByPlayerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("DontSyncClientElements"))) {
		getPlayerData(client).accountData.flags.moderation = addBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("DontSyncClientElements"));
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} turned {softGreen}ON{MAINCOLOUR} client element sync for {ALTCOLOUR}${getPlayerName(targetClient)}`);
	} else {
		getPlayerData(client).accountData.flags.moderation = removeBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("DontSyncClientElements"));
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} turned {softRed}OFF{MAINCOLOUR} client element sync for {ALTCOLOUR}${getPlayerName(targetClient)}`);
	}
}

// ===========================================================================

function isPlayerWeaponBanned(client) {
	if (hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("WeaponBanned"))) {
		return true;
	}

	return false;
}

// ===========================================================================

function isPlayerJobBanned(client) {
	if (hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("JobBanned"))) {
		return true;
	}

	return false;
}

// ===========================================================================

function isPlayerPoliceBanned(client) {
	let jobId = getJobFromParams("Police");
	if (doesJobHaveWhiteListEnabled(jobId)) {
		if (isPlayerOnJobWhiteList(client, jobId)) {
			return true;
		}
	}

	if (doesJobHaveBlackListEnabled(jobId)) {
		if (!isPlayerOnJobBlackList(client, jobId)) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function forcePlayerFightStyleCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let fightStyleId = getFightStyleFromParams(getParam(params, " ", 2));

	//if(!targetClient) {
	//	messagePlayerError(client, `Player not found!`);
	//	return false;
	//}

	//if(!getPlayerData(targetClient)) {
	//	messagePlayerError(client, `Player not found!`);
	//	return false;
	//}

	//if(!isPlayerSpawned(targetClient)) {
	//	messagePlayerError(client, `That player isn't spawned`);
	//	return false;
	//}

	if (!fightStyleId) {
		messagePlayerError(client, `That fight style doesn't exist!`);
		messagePlayerError(client, `Fight styles: ${getGameConfig().fightStyles[getGame()].map(fs => fs[0]).join(", ")}`);
		return false;
	}

	getPlayerCurrentSubAccount(client).fightStyle = fightStyleId;
	setPlayerFightStyle(client, fightStyleId);
	messagePlayerSuccess(client, `You set ${getCharacterFullName(targetClient)}'s fight style to ${getGameConfig().fightStyles[getGame()][fightStyleId][0]}`)

	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getPlayerCurrentHouseCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	let houseId = getPlayerHouse(targetClient);

	if (!houseId) {
		messagePlayerAlert(client, `${getPlayerName(targetClient)} isn't in or at a house!`);
		return false;
	}

	let houseData = getHouseData(houseId);
	messagePlayerInfo(client, `${getPlayerName(targetClient)}'s is at/in house '${houseData.description}' (ID ${houseId}/${houseData.databaseId})`);
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function getPlayerCurrentBusinessCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	let businessId = getPlayerBusiness(targetClient);

	if (!businessId) {
		messagePlayerAlert(client, `${getPlayerName(targetClient)} isn't in or at a house!`);
		return false;
	}

	let businessData = getBusinessData(houseId);
	messagePlayerInfo(client, `${getPlayerName(targetClient)}'s is at/in business '${businessData.name}' (ID ${businessId}/${businessData.databaseId})`);
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function addAccountStaffNoteCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let noteMessage = params.split(" ").slice(1).join(" ");

	if (!getPlayerData(targetClient)) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}
	//let dbConnection = connectToDatabase();
	//let safeNoteMessage = escapeDatabaseString(dbConnection, noteMessage);
	//queryDatabase(dbConnection, `INSERT INTO acct_note (acct_note_acct, acct_note_server, acct_note_message, acct_note_who_added, acct_note_when_added) VALUES (${getPlayerData(targetClient).accountData.databaseId}, ${getServerId()}, ${safeNoteMessage}, ${}, UNIX_TIMESTAMP())`);

	let tempNoteData = new AccountStaffNoteData();
	tempNoteData.whoAdded = getPlayerData(client).accountData.databaseId;
	tempNoteData.whenAdded = getCurrentUnixTimestamp();
	tempNoteData.note = noteMessage;
	tempNoteData.account = getPlayerData(targetClient).databaseId;
	tempNoteData.serverId = getServerId();
	tempNoteData.deleted = false;
	tempNoteData.needsSaved = true;
	getPlayerData(targetClient).accountData.staffNotes.push(tempNoteData);

	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} added a staff note for {ALTCOLOUR}${targetClient.name}{MAINCOLOUR}: ${noteMessage}`);
	return true;
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function showAccountStaffNotesCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let noteMessage = params.split(" ").slice(1).join(" ");

	if (!getPlayerData(targetClient)) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	let staffNoteList = getPlayerData(targetClient).accountData.staffNotes.map(function (x, i, a) { return `{ALTCOLOUR}${toInteger(i) + 1}. (Added by ${loadAccountFromId(x.whoAdded).name} on ${new Date(x.whenAdded).toLocaleString()}: ${x.note}` });

	//let chunkedList = splitArrayIntoChunks(staffNoteList, 1);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderAccountStaffNotesList")));

	for (let i in staffNoteList) {
		messagePlayerInfo(client, staffNoteList[i]);
	}
	return true;
}

// ===========================================================================