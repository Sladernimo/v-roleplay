// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: race.js
// DESC: Provides racing usage and functions
// TYPE: Server (JavaScript)
// ===========================================================================

function initRaceScript() {
	logToConsole(LOG_INFO, "[AGRP.Race]: Initializing race script ...");
	logToConsole(LOG_INFO, "[AGRP.Race]: Race script initialized successfully!");
}

// ===========================================================================

/**
 * @param {Number} raceId - The data index of the race
 * @return {RaceData} The race's data (class instance)
 */
function getRaceData(raceId) {
	if (typeof getServerData().races[raceId] != "undefined") {
		return getServerData().races[raceId];
	}
	return false;
}

// ===========================================================================

function setAllRaceDataIndexes() {
	for (let i in getServerData().races) {
		getServerData().races[i].index = i;
	}
}

// ===========================================================================

function loadRacesFromDatabase() {
	// To-do
	return [];
}

// ===========================================================================

function saveRacesToDatabase() {
	if (getServerConfig().devServer) {
		return false;
	}

	for (let i in getServerData().races) {
		saveRaceToDatabase(getServerData().races[i]);
	}
}

// ===========================================================================

function saveRaceToDatabase(raceData) {
	return true;
}

// ===========================================================================

function createRaceCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let raceId = getRaceFromParams(params);

	if (raceId == false) {
		messagePlayerError(client, "A race with that name already exists!");
		return false;
	}

	createRace(params);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created race {ALTCOLOUR}${params}`);
}

// ===========================================================================

function createRaceCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let raceId = createRace(params, getPlayerPosition(client));
	getRaceData(raceId).enabled = false;
	initRace(raceId);
	joinRace(client, raceId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created race {ALTCOLOUR}${params}`);
}

// ===========================================================================

function createRaceLocationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let raceId = getPlayerRace(client);
	if (raceId == false) {
		messagePlayerError(client, "You are not in a race!");
		return false;
	}

	let raceLocationName = params;
	createRaceLocation(raceId, raceLocationName, getPlayerPosition(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created race {ALTCOLOUR}${params}`);
}

// ===========================================================================

function createRaceLocationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let raceId = getPlayerRace(client);
	if (raceId == false) {
		messagePlayerError(client, "You are not in a race!");
		return false;
	}

	let raceLocationName = params;
	createRaceLocation(raceId, raceLocationName, getPlayerPosition(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created race {ALTCOLOUR}${params}`);
}

// ===========================================================================

function stopRacingCommand(command, params, client) {
	if (!isPlayerInARace(client)) {
		messagePlayerError(client, "You aren't in a race!");
		return false;
	}

	leaveRace(client);
	messagePlayerSuccess(client, "You left the race!");
	messagePlayersInRace(`${getCharacterFullName(client)} left the race!`);
	checkRemainingPlayersInRace(raceId)
}

// ===========================================================================