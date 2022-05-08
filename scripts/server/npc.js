// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: npc.js
// DESC: Provides NPC usage and functions
// TYPE: Server (JavaScript)
// ===========================================================================

function initNPCScript() {
	logToConsole(LOG_INFO, "[VRR.NPC]: Initializing NPC script ...");
	logToConsole(LOG_INFO, "[VRR.NPC]: NPC script initialized successfully!");
}

// ===========================================================================

/**
 * @param {Number} npcId - The data index of the NPC
 * @return {NPCData} The NPC's data (class instancee)
 */
function getNPCData(npcId) {
	if(typeof getServerData().npcs[npcId] != "undefined") {
		return getServerData().npcs[npcId];
	}
	return false;
}

// ===========================================================================

function createNPCCommand(client, command, params) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let skinId = getSkinModelIndexFromParams(params);

	if(!skinId) {
		messagePlayerError(client, getLocaleString(client, "InvalidSkin"));
		return false;
	}

	let position = getPosInFrontOfPos(getPlayerPosition(client), getPlayerHeading(client), 3);

	let npcId = createNPC(skinId, position, getPlayerHeading(client), getPlayerInterior(client), getPlayerDimension());
	messageAdmins(`${getPlayerName(client)}{MAINCOLOUR} created a ${getSkinNameFromIndex(getNPCData(npcId).skin)} NPC!`);
}

// ===========================================================================

function loadNPCsFromDatabase() {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPCs from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCs = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM npc_main WHERE npc_server = ${getServerId()} AND npc_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCData = new NPCData(dbAssoc);
				tempNPCData.triggers = loadNPCTriggersFromDatabase();
				tempNPCs.push(tempNPCData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCs.length} NPCs loaded from database successfully!`);
	return tempNPCs;
}

// ===========================================================================

function loadNPCTriggersFromDatabase(npcDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPC triggers for NPC ${npcDatabaseId} from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCTriggers = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM npc_trig WHERE npc_trig_npc = ${npcDatabaseId} AND npc_trig_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCTriggerData = new NPCTriggerData(dbAssoc);
				tempNPCTriggerData.conditions = loadNPCTriggerConditionsFromDatabase(tempNPCTriggerData.databaseId);
				tempNPCTriggerData.responses = loadNPCTriggerResponsesFromDatabase(tempNPCTriggerData.databaseId);
				tempNPCTriggers.push(tempNPCTriggerData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCTriggers.length} NPC triggers loaded for NPC ${npcDatabaseId} from database successfully!`);
	return tempNPCTriggers;
}

// ===========================================================================

function loadNPCTriggerConditionsFromDatabase(npcTriggerDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPC trigger conditions for trigger ${npcTriggerDatabaseId} from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCTriggerConditions = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM npc_cond WHERE npc_cond_trig = ${npcTriggerDatabaseId} AND npc_cond_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCTriggerConditionData = new NPCTriggerConditionData(dbAssoc);
				tempNPCTriggerConditions.push(tempNPCTriggerConditionData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCTriggerConditions.length} conditions loaded for trigger ${npcTriggerDatabaseId} from database successfully!`);
	return tempNPCTriggerConditions;
}

// ===========================================================================

function loadNPCTriggerResponsesFromDatabase(npcTriggerDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPC trigger responses for trigger ${npcTriggerDatabaseId} from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCTriggerResponses = [];
	let dbAssoc;
	if(dbConnection) {
		let dbQueryString = `SELECT * FROM npc_resp WHERE npc_resp_trig = ${npcTriggerDatabaseId} AND npc_resp_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCTriggerResponseData = new NPCTriggerResponseData(dbAssoc);
				tempNPCTriggerResponses.push(tempNPCTriggerResponseData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCTriggerResponses.length} responses loaded for trigger ${npcTriggerDatabaseId} from database successfully!`);
	return tempNPCTriggerResponses;
}

// ===========================================================================

function saveAllNPCsToDatabase() {
	if(getServerConfig().devServer) {
		return false;
	}

	for(let i in getServerData().npcs) {
		saveNPCToDatabase(i);
	}
}

// ===========================================================================

function saveNPCToDatabase(npcDataId) {
	if(getServerConfig().devServer) {
		return false;
	}

	if(getNPCData(npcDataId) == null) {
		// Invalid NPC data
		return false;
	}

	let tempNPCData = getNPCData(npcDataId);

	if(tempNPCData.databaseId == -1) {
		// Temp NPC, no need to save
		return false;
	}

	if(!tempNPCData.needsSaved) {
		// NPC hasn't changed. No need to save.
		return false;
	}

	logToConsole(LOG_VERBOSE, `[VRR.NPC]: Saving NPC ${tempNPCData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		if(tempNPCData.ped != false) {
			if(!tempNPCData.spawnLocked) {
				if(areServerElementsSupported()) {
					tempNPCData.position = tempNPCData.ped.position;
					tempNPCData.heading = tempNPCData.ped.heading;
				} else {
					tempNPCData.position = tempNPCData.syncPosition;
					tempNPCData.heading = tempNPCData.syncHeading;
				}
			}
		}

		let safeAnimationName = escapeDatabaseString(tempNPCData.animationName);
		let safeFirstName = escapeDatabaseString(tempNPCData.firstName);
		let safeLastName = escapeDatabaseString(tempNPCData.lastName);
		let safeMiddleName = escapeDatabaseString(tempNPCData.middleName);

		let data = [
			["npc_server", getServerId()],
			["npc_skin", toInteger(tempNPCData.model)],
			["npc_name_first", safeFirstName],
			["npc_name_middle", safeMiddleName],
			["npc_name_last", safeLastName],
			["npc_owner_type", toInteger(tempNPCData.ownerType)],
			["npc_owner_id", toInteger(tempNPCData.ownerId)],
			["npc_pos_x", toFloat(tempNPCData.position.x)],
			["npc_pos_y", toFloat(tempNPCData.position.y)],
			["npc_pos_z", toFloat(tempNPCData.position.z)],
			["npc_rot_z", toFloat(tempNPCData.heading)],
			["npc_scale_x", toFloat(tempNPCData.scale.x)],
			["npc_scale_y", toFloat(tempNPCData.scale.y)],
			["npc_scale_z", toFloat(tempNPCData.scale.z)],
			["npc_animation", safeAnimationName],
			["npc_health", toInteger(tempNPCData.health)],
			["npc_armour", toInteger(tempNPCData.armour)],
			["npc_invincible", boolToInt(tempNPCData.invincible)],
			["npc_heedthreats", boolToInt(tempNPCData.heedThreats)],
			["npc_threats", toInteger(tempNPCData.threats)],
			["npc_stay", boolToInt(tempNPCData.stay)],
			["npc_type_flags", toInteger(tempNPCData.typeFlags)],
		];

		let dbQuery = null;
		if(tempNPCData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("npc_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempNPCData.databaseId = getDatabaseInsertId(dbConnection);
			tempNPCData.needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("npc_main", data, `npc_id=${tempNPCData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempNPCData.needsSaved = false;
		}

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[VRR.NPC]: Saved NPC ${npcDataId} to database!`);

	return false;
}

// ===========================================================================

function setNPCDataIndexes() {
	for(let i in getServerData().npcs) {
		getServerData().npcs[i].index = i;

		for(let j in getServerData().npcs[i].triggers) {
			getServerData().npcs[i].triggers[j].index = j;
			getServerData().npcs[i].triggers[j].npcIndex = i;

			for(let k in getServerData().npcs[i].triggers[j].conditions) {
				getServerData().npcs[i].triggers[j].conditions[k].index = k;
				getServerData().npcs[i].triggers[j].conditions[m].triggerIndex = j;
			}

			for(let m in getServerData().npcs[i].triggers[j].responses) {
				getServerData().npcs[i].triggers[j].responses[m].index = m;
				getServerData().npcs[i].triggers[j].responses[m].triggerIndex = j;
			}
		}
	}
}

// ===========================================================================

function spawnNPC(npcIndex) {
	let civilian = createGameCivilian(getNPCData(npcIndex).model, getNPCData(npcIndex).spawnPosition, getNPCData(npcIndex).spawnRotation);
	if(civilian) {
		civilian.setData("vrr.dataIndex", npcIndex);
		if(getNPCData(npcIndex).animationName != "") {
			civilian.setData("vrr.animation", getNPCData(npcIndex).animationName);
		}
		getNPCData(npcIndex).ped = civilian;
	}
}

// ===========================================================================

function spawnAllNPCs() {
	for(let i in getServerData().npcs) {
		spawnNPC(npcIndex);
	}
}

// ===========================================================================

function deleteNPCCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, command);
		return false;
	}

	let closestNPC = getClosestNPC(getPlayerPosition(client));

	if(!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	let npcName = getNPCData(closestNPC).name;

	deleteNPC(closestNPC);
	messageAdmins(`${getPlayerName(client)}{MAINCOLOUR} deleted NPC {npcPink}${npcName}`);
}

// ===========================================================================

function deleteNPC(npcId) {
	quickDatabaseQuery(`DELETE FROM npc_main WHERE npc_id=${getNPCData(npcId).databaseId}`);

	if(getNPCData(npcId)) {
		if(getNPCData(npcId).ped != false) {
			deleteEntity(getNPCData(npcId).ped);
		}
		getServerData().npcs.splice(npcId, 1);
	}

	setNPCDataIndexes();
}

// ===========================================================================

function setNPCAnimationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, command);
		return false;
	}

	let closestNPC = getClosestNPC(getPlayerPosition(client));
	let animationId = getAnimationFromParams(getParam(params, " ", 1));
	let animationPositionOffset = 1;

	if(!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	if(!getAnimationData(animationId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidAnimation"));
		return false;
	}

	if(areThereEnoughParams(params, 2, " ")) {
		if(toInteger(animationPositionOffset) < 0 || toInteger(animationPositionOffset) > 3) {
			messagePlayerError(client, getLocaleString(client, "InvalidAnimationDistance"));
			return false;
		}
		animationPositionOffset = getParam(params, " ", 2);
	}

	getNPCData(closestNPC).animationName = animation;
	makePedPlayAnimation(getNPCData(closestNPC).ped, animationId, animationPositionOffset);
}

// ===========================================================================

function getClosestNPC(position) {
	let npcs = getServerData().npcs;
	let closest = 0;
	for(let i in npcs) {
		if(getDistance(npcs[i].ped.position, position) < getDistance(npcs[i].ped.position, position)) {
			closest = i;
		}
	}

	return closest;
}

// ===========================================================================

function createNPC(skinIndex, position, heading, interior, dimension) {
	let tempNPCData = new NPCData(false);
	tempNPCData.position = position;
	tempNPCData.heading = heading;
	tempNPCData.skin = skinIndex;
	tempNPCData.interior = interior;
	tempNPCData.dimension = dimension;
	tempNPCData.animationName = "";

	let npcIndex = getServerData().npcs.push(tempNPCData);
	setNPCDataIndexes();

	spawnNPC(npcIndex-1);

	return npcIndex-1;
}

// ===========================================================================