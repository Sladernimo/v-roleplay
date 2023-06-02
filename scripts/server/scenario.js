// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: scenario.js
// DESC: Provides scenario data and functions
// TYPE: Server (JavaScript)
// ===========================================================================

class ScenarioData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.vehicles = [];
		this.npcs = [];
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.enabled = false;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["scenario_id"]);
			this.name = toString(dbAssoc["scenario_name"]);
			this.whoAdded = toInteger(dbAssoc["scenario_who_added"]);
			this.whenAdded = toInteger(dbAssoc["scenario_when_added"]);
		}
	}
};

// ===========================================================================

class ScenarioVehicleData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.scenarioId = 0;
		this.scenarioIndex = -1;
		this.index = -1;
		this.vehicleId = 0;
		this.vehicleIndex = -1;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["scenario_veh_id"]);
			this.scenarioId = toInteger(dbAssoc["scenario_veh_scenario"]);
			this.vehicleId = toInteger(dbAssoc["scenario_veh_veh"]);

			this.vehicleIndex = getVehicleIndexFromDatabaseId(this.vehicleId);
			this.scenarioIndex = getScenarioIndexFromDatabaseId(this.scenarioId);
		}
	}
};

// ===========================================================================

class ScenarioNPCData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.scenarioId = 0;
		this.scenarioIndex = -1;
		this.index = -1;
		this.npcId = 0;
		this.npcIndex = -1;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["scenario_npc_id"]);
			this.scenarioId = toInteger(dbAssoc["scenario_npc_scenario"]);
			this.vehicleId = toInteger(dbAssoc["scenario_npc_npc"]);

			this.npcIndex = getNPCIndexFromDatabaseId(this.npcId);
			this.scenarioIndex = getScenarioIndexFromDatabaseId(this.scenarioId);
		}
	}
};

// ===========================================================================

function initScenarioScript() {
	logToConsole(LOG_INFO, "[V.RP.Scenario]: Initializing scenario script ...");
	logToConsole(LOG_INFO, "[V.RP.Scenario]: Scenario script initialized successfully!");
	return true;
}

// ===========================================================================

function loadScenariosFromDatabase() {
	logToConsole(LOG_DEBUG, "[V.RP.Scenario]: Loading scenarios from database ...");
	let dbConnection = connectToDatabase();
	let tempScenarios = [];
	let dbAssoc = [];
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM scenario_main WHERE scenario_server = ${getServerId()} AND scenario_deleted = 0;`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempScenarioData = new ScenarioData(dbAssoc[i]);
				tempScenarios.push(tempScenarioData);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[V.RP.Scenario]: ${tempScenarios.length} scenarios loaded from database successfully!`);
	return tempScenarios;
}

// ===========================================================================

function enableScenario(scenarioIndex) {
	let scenarioData = getScenarioData(scenarioIndex);
	if (scenarioData == null) {
		return false;
	}

	scenarioData.enabled = true;

	spawnScenarioVehicles(scenarioIndex);
	spawnScenarioNPCs(scenarioIndex);
}

// ===========================================================================

function disableScenario(scenarioIndex) {
	let scenarioData = getScenarioData(scenarioIndex);
	if (scenarioData == null) {
		return false;
	}

	scenarioData.enabled = false;
	despawnScenarioVehicles(scenarioIndex);
	despawnScenarioNPCs(scenarioIndex);
}

// ===========================================================================

function spawnScenarioVehicles(scenarioIndex) {
	let scenarioData = getScenarioData(scenarioIndex);
	for (let i in scenarioData.vehicles) {
		let vehicleData = serverData.vehicles[scenarioData.vehicles[i]];
		if (vehicleData != null) {
			if (vehicleData.vehicle == null) {
				deleteGameElement(vehicleData.vehicle);
				vehicleData.vehicle = null;
			}
			spawnVehicle(vehicleData);
		}
	}
}

// ===========================================================================

function despawnScenarioVehicles(scenarioIndex) {
	let scenarioData = getScenarioData(scenarioIndex);
	for (let i in scenarioData.vehicles) {
		let vehicleData = serverData.vehicles[scenarioData.vehicles[i]];
		if (vehicleData != null) {
			if (vehicleData.vehicle != null) {
				deleteGameElement(vehicleData.vehicle);
				vehicleData.vehicle = null;
			}
		}
	}
}

// ===========================================================================

function spawnScenarioNPCs(scenarioIndex) {
	let scenarioData = getScenarioData(scenarioIndex);
	for (let i in scenarioData.npcs) {
		let npcData = serverData.npcs[scenarioData.npcs[i]];
		if (npcData != null) {
			if (npcData.ped == null) {
				deleteGameElement(npcData.ped);
				npcData.ped = null;
			}
			spawnNPC(npcData);
		}
	}
}

// ===========================================================================

function despawnScenarioNPCs(scenarioIndex) {
	let scenarioData = getScenarioData(scenarioIndex);
	for (let i in scenarioData.npcs) {
		let npcData = serverData.npcs[scenarioData.npcs[i]];
		if (npcData != null) {
			if (npcData.ped == null) {
				deleteGameElement(npcData.ped);
				npcData.ped = null;
			}
		}
	}
}

// ===========================================================================

function setAllScenarioDataIndexes() {
	for (let i in serverData.scenarios) {
		serverData.scenarios[i].index = i;
	}
}

// ===========================================================================

function cacheAllScenarioVehicles() {
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].ownerType == V_VEH_OWNER_SCENARIO) {
			for (let j in serverData.scenarios) {
				if (serverData.vehicles[i].ownerId == serverData.scenarios[j].databaseId) {
					serverData.scenarios[j].vehicles.push(i);
				}
			}
		}
	}
}

// ===========================================================================

function cacheAllScenarioNPCs() {
	for (let i in serverData.npcs) {
		if (serverData.npcs[i].ownerType = V_NPC_OWNER_SCENARIO) {
			for (let j in serverData.scenarios) {
				if (serverData.npcs[i].ownerId == serverData.scenarios[j].databaseId) {
					serverData.scenarios[j].npcs.push(i);
				}
			}
		}
	}
}

// ===========================================================================

function createScenarioCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let scenarioName = params;

	createScenario(params, getPlayerData(client).accountData.databaseId);

	messageAdmins(`{adminOrange}${getPlayerName(client)} created scenario ${scenarioName}.`);
}

// ===========================================================================

function deleteScenarioCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let scenarioIndex = getScenarioFromParams(params);

	if (getScenarioData(scenarioIndex) == null) {
		messagePlayerError(client, "Scenario not found");
		return false;
	}

	let scenarioData = getScenarioData(scenarioIndex);
	messageAdmins(`{adminOrange}${getPlayerName(client)} deleted scenario ${scenarioData.name}{MAINCOLOUR}.`);
	deleteScenario(scenarioIndex);
}

// ===========================================================================

function enableScenarioCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let scenarioIndex = getScenarioFromParams(params);

	if (getScenarioData(scenarioIndex) == null) {
		messagePlayerError(client, "Scenario not found");
		return false;
	}

	enableScenario(scenarioIndex);

	messageAdmins(`{adminOrange}${getPlayerName(client)} enabled scenario {scenarioTeal}${getScenarioData(scenarioIndex).name}{MAINCOLOUR}.`);
}

// ===========================================================================

function disableScenarioCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let scenarioIndex = getScenarioFromParams(params);

	if (getScenarioData(scenarioIndex) == null) {
		messagePlayerError(client, "Scenario not found");
		return false;
	}

	disableScenario(scenarioIndex);

	messageAdmins(`{adminOrange}${getPlayerName(client)} disabled scenario {scenarioTeal}${getScenarioData(scenarioIndex).name}{MAINCOLOUR}.`);
}

// ===========================================================================

function getScenarioFromParams(params) {
	if (isNaN(params)) {
		for (let i in serverData.scenarios) {
			if (toLowerCase(serverData.scenarios[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof serverData.scenarios[params - 1] != "undefined") {
			return toInteger(params - 1);
		}
	}

	return -1;
}

// ===========================================================================

function getScenarioIndexFromDatabaseId(databaseId) {
	if (databaseId <= 0) {
		return -1;
	}

	for (let i in serverData.scenarios) {
		if (serverData.scenarios[i].databaseId == databaseId) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

/**
 * @param {Number} scenarioIndex - The data index of the scenario
 * @return {ScenarioData} The scenarios's data (class instance)
 */
function getScenarioData(scenarioIndex) {
	if (scenarioIndex == -1) {
		return null;
	}

	if (typeof serverData.scenarios[scenarioIndex] != "undefined") {
		return serverData.scenarios[scenarioIndex];
	}

	return null;
}

// ===========================================================================

function createScenario(name, whoAdded = defaultNoAccountId) {
	let scenarioData = new ScenarioData();
	scenarioData.name = name;
	scenarioData.whoAdded = whoAdded;
	scenarioData.whenAdded = getCurrentUnixTimestamp();
	scenarioData.enabled = false;
	scenarioData.needsSaved = true;

	let scenarioIndex = serverData.scenarios.push(scenarioData);

	saveScenarioToDatabase(scenarioIndex - 1);

	return true;
}

// ===========================================================================

function deleteScenario(scenarioIndex, whoDeleted = defaultNoAccountId) {
	let scenarioName = getScenarioData(scenarioIndex).name;
	disableScenario(scenarioIndex);
	quickDatabaseQuery(`UPDATE scenario_main SET scenario_deleted = 1, scenario_who_deleted = ${whoDeleted}, scenario_when_deleted = ${getCurrentUnixTimestamp()} WHERE scenario_id = ${getScenarioData(scenarioIndex).databaseId}`);

	serverData.scenarios.splice(scenarioIndex, 1);
	messageAdmins(`{adminOrange}${getPlayerName(client)} deleted scenario {scenarioTeal}${scenarioName}{MAINCOLOUR}.`);
}

// ===========================================================================

function saveScenarioToDatabase(scenarioIndex) {
	if (serverConfig.devServer) {
		logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Scenario ${scenarioIndex} can't be saved because server is running as developer only. Aborting save ...`);
		return false;
	}

	if (getScenarioData(scenarioIndex) == false) {
		logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Scenario ${scenarioIndex} data is invalid. Aborting save ...`);
		return false;
	}

	let tempScenarioData = getScenarioData(scenarioIndex);

	if (tempScenarioData.databaseId == -1) {
		logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Scenario ${scenarioIndex} is a temp scenario. Aborting save ...`);
		return false;
	}

	if (!tempScenarioData.needsSaved) {
		logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Scenario ${scenarioIndex} hasn't changed data. Aborting save ...`);
		return false;
	}

	logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Saving scenario ${tempScenarioData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, tempScenarioData.name);

		let data = [
			["scenario_server", getServerId()],
			["scenario_name", safeName],
			["scenario_who_added", toInteger(tempScenarioData.whoAdded)],
			["scenario_when_added", toInteger(tempScenarioData.whenAdded)],
			["scenario_enabled", boolToInt(tempScenarioData.enabled)],
		];

		let dbQuery = null;
		if (tempScenarioData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("scenario_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempScenarioData.databaseId = getDatabaseInsertId(dbConnection);
			tempScenarioData.needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("scenario_main", data, `scenario_id=${tempScenarioData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempScenarioData.needsSaved = false;
		}

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Saved scenario ${scenarioIndex} to database!`);

	return false;
}

// ===========================================================================

function saveScenarioVehicleToDatabase(scenarioIndex, vehicleIndex) {
	if (serverConfig.devServer) {
		logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Scenario vehicle ${scenarioIndex}/${vehicleIndex} can't be saved because server is running as developer only. Aborting save ...`);
		return false;
	}

	let tempScenarioVehicleData = getScenarioVehicleData(scenarioIndex, vehicleIndex);

	logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Saving scenario vehicle ${scenarioIndex}/${vehicleIndex} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let data = [
			["scenario_veh_scenario", toInteger(tempScenarioVehicleData.scenarioId)],
			["scenario_veh_veh", toInteger(tempScenarioVehicleData.vehicleId)],
			["scenario_veh_who_added", toInteger(tempScenarioVehicleData.whoAdded)],
			["scenario_veh_when_added", toInteger(tempScenarioVehicleData.whenAdded)],
			["scenario_veh_enabled", boolToInt(tempScenarioVehicleData.enabled)],
		];

		let dbQuery = null;
		if (tempScenarioVehicleData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("scenario_veh", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempScenarioVehicleData.databaseId = getDatabaseInsertId(dbConnection);
			tempScenarioVehicleData.needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("scenario_veh", data, `scenario_veh_id=${tempScenarioVehicleData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempScenarioVehicleData.needsSaved = false;
		}

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Saved scenario vehicle ${scenarioIndex}/${vehicleIndex} to database!`);

	return false;
}

// ===========================================================================

function saveScenarioNPCToDatabase(scenarioIndex, npcIndex) {
	if (serverConfig.devServer) {
		logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Scenario NPC ${scenarioIndex}/${npcIndex} can't be saved because server is running as developer only. Aborting save ...`);
		return false;
	}

	let tempScenarioNPCData = getScenarioNPCData(scenarioIndex, npcIndex);

	logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Saving scenario NPC ${scenarioIndex}/${npcIndex} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let data = [
			["scenario_npc_scenario", toInteger(tempScenarioNPCData.scenarioId)],
			["scenario_npc_npc", toInteger(tempScenarioNPCData.npcId)],
			["scenario_npc_who_added", toInteger(tempScenarioNPCData.whoAdded)],
			["scenario_npc_when_added", toInteger(tempScenarioNPCData.whenAdded)],
			["scenario_npc_enabled", boolToInt(tempScenarioNPCData.enabled)],
		];

		let dbQuery = null;
		if (tempScenarioNPCData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("scenario_npc", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempScenarioNPCData.databaseId = getDatabaseInsertId(dbConnection);
			tempScenarioNPCData.needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("scenario_npc", data, `scenario_npc_id=${tempScenarioNPCData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempScenarioNPCData.needsSaved = false;
		}

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[V.RP.Scenario]: Saved scenario NPC ${scenarioIndex}/${npcIndex} to database!`);

	return false;
}

// ===========================================================================

/**
 * @param {number} scenarioIndex - The data index of the scenario
 * @param {number} vehicleIndex - The data index of the vehicle
 * @return {ScenarioVehicleData} The scenario vehicle's data (class instance)
 */
function getScenarioVehicleData(scenarioIndex, vehicleIndex) {
	if (scenarioIndex == -1) {
		return null;
	}

	if (vehicleIndex == -1) {
		return null;
	}

	if (typeof serverData.scenarios[scenarioIndex] == "undefined") {
		return null;
	}

	if (typeof serverData.scenarios[scenarioIndex].vehicles[vehicleIndex] == "undefined") {
		return null;
	}

	return serverData.scenarios[scenarioIndex].vehicles[vehicleIndex];
}

// ===========================================================================

/**
 * @param {number} scenarioIndex - The data index of the scenario
 * @param {number} npcIndex - The data index of the npc
 * @return {ScenarioNPCData} The scenario vehicle's data (class instance)
 */
function getScenarioNPCData(scenarioIndex, npcIndex) {
	if (scenarioIndex == -1) {
		return null;
	}

	if (vehicleIndex == -1) {
		return null;
	}

	if (typeof serverData.scenarios[scenarioIndex] == "undefined") {
		return null;
	}

	if (typeof serverData.scenarios[scenarioIndex].npcs[npcIndex] == "undefined") {
		return null;
	}

	return serverData.scenarios[scenarioIndex].npcs[npcIndex];
}