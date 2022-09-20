// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: gate.js
// DESC: Provides gate functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

// Gate Owner Types
const AGRP_GATEOWNER_NONE = 0;                   // Not owned
const AGRP_GATEOWNER_PLAYER = 1;                 // Owner is a player (character/subaccount)
const AGRP_GATEOWNER_JOB = 2;                    // Owned by a job
const AGRP_GATEOWNER_CLAN = 3;                   // Owned by a clan
const AGRP_GATEOWNER_FACTION = 4;                // Owned by a faction
const AGRP_GATEOWNER_PUBLIC = 5;                 // Public gate. Technically not owned. This probably won't be used.
const AGRP_GATEOWNER_BUSINESS = 6;               // Owned by a business. Back lots, unloading areas, and other stuff like that
const AGRP_GATEOWNER_HOUSE = 7;                  // Owned by a house. Like for mansions with closed private areas.

// ===========================================================================

class GateData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.scriptName = "";
		this.enabled = false;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.locked = true;
		this.ownerType = AGRP_GATEOWNER_NONE;
		this.ownerId = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["gate_id"]);
			this.name = toString(dbAssoc["gate_name"]);
			this.scriptName = toString(dbAssoc["gate_script_name"]);
			this.enabled = intToBool(toInteger(dbAssoc["gate_enabled"]));
			this.position = toVector3(toFloat(dbAssoc["gate_pos_x"]), toFloat(dbAssoc["gate_pos_y"]), toFloat(dbAssoc["gate_pos_z"]));
			this.ownerType = toInteger(dbAssoc["gate_owner_type"]);
			this.ownerId = toInteger(dbAssoc["gate_owner_id"]);
		}
	}
}

// ===========================================================================

function initGateScript() {
	logToConsole(LOG_INFO, `[AGRP.Gate]: Initializing gate script ...`);
	logToConsole(LOG_INFO, `[AGRP.Gate]: Gate script initialized successfully!`);
}

// ===========================================================================

function doesPlayerHaveGateKeys(client, vehicle) {
	let gateData = getGateData(vehicle);

	if (gateData.ownerType == AGRP_GATEOWNER_PUBLIC) {
		return true;
	}

	if (gateData.ownerType == AGRP_GATEOWNER_PLAYER) {
		if (gateData.ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if (gateData.ownerType == AGRP_GATEOWNER_CLAN) {
		if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
			return true;
		}

		if (gateData.ownerId == getPlayerCurrentSubAccount(client).clan) {
			if (gateData.clanRank <= getPlayerCurrentSubAccount(client).clanRank) {
				return true;
			}
		}
	}

	if (gateData.ownerType == AGRP_GATEOWNER_FACTION) {
		if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageFactions"))) {
			return true;
		}

		if (gateData.ownerId == getPlayerCurrentSubAccount(client).faction) {
			if (gateData.factionRank <= getPlayerCurrentSubAccount(client).factionRank) {
				return true;
			}
		}
	}

	if (gateData.ownerType == AGRP_GATEOWNER_JOB) {
		if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageJobs"))) {
			return true;
		}

		if (gateData.ownerId == getPlayerCurrentSubAccount(client).job) {
			return true;
		}
	}

	if (gateData.ownerType == AGRP_GATEOWNER_BUSINESS) {
		if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
			return true;
		}

		if (canPlayerManageBusiness(client, getBusinessIdFromDatabaseId(gateData.ownerId))) {
			return true;
		}
	}

	if (gateData.ownerType == AGRP_GATEOWNER_HOUSE) {
		if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
			return true;
		}

		if (canPlayerManageHouse(client, getHouseIdFromDatabaseId(gateData.ownerId))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getGateData(gateId) {
	if (typeof getServerData().gates[gateId] != "undefined") {
		return getServerData().gates[gateId];
	}

	return false;
}

// ===========================================================================

function getClosestGate(position) {
	let closest = 0;
	for (let i in getServerData().gates[getGame()]) {
		if (getDistance(getServerData().gates[i].position, position) < getDistance(getServerData().gates[closest].position, position)) {
			closest = i;
		}
	}

	return closest;
}

// ===========================================================================

function triggerGateCommand(command, params, client) {
	let closestGate = getClosestGate(getPlayerPosition(client));

	if (!getGateData(closestGate)) {
		messagePlayerError(client, getLocaleString(client, "InvalidGate"));
	}

	if (!doesPlayerHaveGateKeys(client, closestGate)) {
		messagePlayerError(client, getLocaleString(client, "NoGateAccess"));
		return false;
	}

	triggerGate(getGateData(closestGate).scriptName);
}

// ===========================================================================

function saveAllGatesToDatabase() {
	if (getServerConfig().devServer) {
		return false;
	}

	for (let i in getServerData().gates) {
		saveGateToDatabase(i);
	}
}

// ===========================================================================

function saveGateToDatabase(gateId) {
	if (getGateData(gateId) == null) {
		// Invalid gate data
		return false;
	}

	let tempGateData = getGateData(gateId);

	if (tempGateData.databaseId == -1) {
		// Temp gate, no need to save
		return false;
	}

	if (!tempGateData.needsSaved) {
		// Gate hasn't changed. No need to save.
		return false;
	}

	logToConsole(LOG_VERBOSE, `[AGRP.Gate]: Saving gate ${tempGateData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeGateName = escapeDatabaseString(tempGateData.name);
		let safeGateScriptName = escapeDatabaseString(tempGateData.scriptName);

		let data = [
			["gate_server", getServerId()],
			["gate_name", safeGateName],
			["gate_script_name", safeGateScriptName],
			["gate_owner_type", toInteger(tempGateData.ownerType)],
			["gate_owner_id", toInteger(tempGateData.ownerId)],
			["gate_pos_x", toFloat(tempGateData.position.x)],
			["gate_pos_y", toFloat(tempGateData.position.y)],
			["gate_pos_z", toFloat(tempGateData.position.z)],
			["gate_radius", toFloat(tempGateData.radius)],
		];

		let dbQuery = null;
		if (tempGateData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("gate_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempGateData.databaseId = getDatabaseInsertId(dbConnection);
			tempGateData.needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("gate_main", data, `gate_id=${tempGateData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempGateData.needsSaved = false;
		}

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[AGRP.Gate]: Saved gate ${gateDataId} to database!`);

	return true;
}

// ===========================================================================

function loadGatesFromDatabase() {
	logToConsole(LOG_INFO, "[AGRP.Gate]: Loading gates from database ...");

	let tempGates = [];
	let dbConnection = connectToDatabase();
	let dbAssoc;

	if (dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `SELECT * FROM gate_main WHERE gate_server = ${getServerId()}`);
		if (dbQuery) {
			if (dbQuery.numRows > 0) {
				while (dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempGateData = new GateData(dbAssoc);
					tempGates.push(tempGateData);
					logToConsole(LOG_DEBUG, `[AGRP.Gate]: Gate '${tempGateData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[AGRP.Gate]: ${tempGates.length} gates loaded from database successfully!`);
	return tempGates;
}

// ===========================================================================