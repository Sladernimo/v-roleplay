// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: gate.js
// DESC: Provides gate functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

function doesPlayerHaveGateKeys(client, vehicle) {
	let gateData = getGateData(vehicle);

	if(gateData.ownerType == VRR_GATEOWNER_PUBLIC) {
		return true;
	}

	if(gateData.ownerType == VRR_GATEOWNER_PLAYER) {
		if(gateData.ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_CLAN) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
			return true;
		}

		if(gateData.ownerId == getPlayerCurrentSubAccount(client).clan) {
			if(gateData.clanRank <= getPlayerCurrentSubAccount(client).clanRank) {
				return true;
			}
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_FACTION) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageFactions"))) {
			return true;
		}

		if(gateData.ownerId == getPlayerCurrentSubAccount(client).faction) {
			if(gateData.factionRank <= getPlayerCurrentSubAccount(client).factionRank) {
				return true;
			}
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_JOB) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageJobs"))) {
			return true;
		}

		if(gateData.ownerId == getPlayerCurrentSubAccount(client).job) {
			return true;
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_BUSINESS) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
			return true;
		}

		if(canPlayerManageBusiness(client, getBusinessIdFromDatabaseId(gateData.ownerId))) {
			return true;
		}
	}

	if(gateData.ownerType == VRR_GATEOWNER_HOUSE) {
		if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
			return true;
		}

		if(canPlayerManageHouse(client, getHouseIdFromDatabaseId(gateData.ownerId))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function getGateData(gateId) {
	if(typeof getServerData().gates[gateId] != "undefined") {
		return getServerData().gates[gateId];
	}

	return false;
}

// ===========================================================================

function getClosestGate(position) {
	let closest = 0;
	for(let i in getServerData().gates[getServerGame()]) {
		if(getDistance(getServerData().gates[i].position, position) < getDistance(getServerData().gates[closest].position, position)) {
			closest = i;
		}
	}

	return closest;
}

// ===========================================================================

function triggerGateCommand(command, params, client) {
	let closestGate = getClosestGate(getPlayerPosition(client));

	if(!getGateData(closestGate)) {
		messagePlayerError(client, getLocaleString(client, "InvalidGate"));
	}

	if(!canPlayerUseGate(client, closestGate)) {
		messagePlayerError(client, getLocaleString(client, "NoGateAccess"));
		return false;
	}

	triggerGate(getGateData(closestGate).scriptName);
}

// ===========================================================================

function saveAllGatesToDatabase() {
	if(getServerConfig().devServer) {
		return false;
	}

	for(let i in getServerData().gates) {
		saveGateToDatabase(i);
	}
}

// ===========================================================================

function saveGateToDatabase(gateId) {
	if(getGateData(gateId) == null) {
		// Invalid gate data
		return false;
	}

	let tempGateData = getGateData(gateId);

	if(tempGateData.databaseId == -1) {
		// Temp gate, no need to save
		return false;
	}

	if(!tempGateData.needsSaved) {
		// Gate hasn't changed. No need to save.
		return false;
	}

	logToConsole(LOG_VERBOSE, `[VRR.Gate]: Saving gate ${tempGateData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
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
		if(tempGateData.databaseId == 0) {
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
	logToConsole(LOG_VERBOSE, `[VRR.Gate]: Saved gate ${gateDataId} to database!`);

	return false;
}

// ===========================================================================