// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: race.js
// DESC: Provides racing usage and functions
// TYPE: Server (JavaScript)
// ===========================================================================

function initRaceScript() {
	logToConsole(LOG_INFO, "[VRR.Race]: Initializing race script ...");
	logToConsole(LOG_INFO, "[VRR.Race]: Race script initialized successfully!");
}

// ===========================================================================

/**
 * @param {Number} raceId - The data index of the race
 * @return {RaceData} The race's data (class instance)
 */
function getRaceData(raceId) {
	if(typeof getServerData().races[raceId] != "undefined") {
		return getServerData().races[raceId];
	}
	return false;
}

// ===========================================================================

function setAllRaceDataIndexes() {
	for(let i in getServerData().races) {
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
	if(getServerConfig().devServer) {
		return false;
	}

	for(let i in getServerData().races) {
		saveRaceToDatabase(getServerData().races[i]);
	}
}

// ===========================================================================

function saveRaceToDatabase(raceData) {
	return true;
}

// ===========================================================================

function createRaceCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let raceId = getRaceFromParams(params);

	if(raceId == false) {
		messagePlayerError(client, "A race with that name already exists!");
		return false;
	}

	createRace(params);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created race {ALTCOLOUR}${params}`);
}

// ===========================================================================