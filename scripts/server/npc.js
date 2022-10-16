// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: npc.js
// DESC: Provides NPC usage and functions
// TYPE: Server (JavaScript)
// ===========================================================================

// NPC Trigger Condition Match Types
const AGRP_NPC_COND_MATCH_NONE = 0;               // None (invalid)
const AGRP_NPC_COND_MATCH_EQ = 1;                 // Must be equal to
const AGRP_NPC_COND_MATCH_GT = 2;                 // Must be greater than
const AGRP_NPC_COND_MATCH_LT = 3;                 // Must be less than
const AGRP_NPC_COND_MATCH_GTEQ = 4;               // Must be greater than or equal to
const AGRP_NPC_COND_MATCH_LTEQ = 5;               // Must be less than or equal to
const AGRP_NPC_COND_MATCH_CONTAINS = 6;           // Must contain string (case insensitive)
const AGRP_NPC_COND_MATCH_CONTAINS_CASE = 7;      // Must contain string (case sensitive)
const AGRP_NPC_COND_MATCH_EXACT = 8;              // Must match string exactly (case insensitive)
const AGRP_NPC_COND_MATCH_EXACT_CASE = 9;         // Must match string exactly (case insensitive)

// ===========================================================================

// NPC Owner Types
const AGRP_NPC_OWNER_NONE = 0;                     // Not owned
const AGRP_NPC_OWNER_PLAYER = 1;                   // Owned by a player (character/subaccount)
const AGRP_NPC_OWNER_JOB = 2;                      // Owned by a job
const AGRP_NPC_OWNER_CLAN = 3;                     // Owned by a clan
const AGRP_NPC_OWNER_FACTION = 4;                  // Owned by a faction (not used at the moment)
const AGRP_NPC_OWNER_PUBLIC = 5;                   // Public NPC. Anybody can do stuff with it.
const AGRP_NPC_OWNER_BIZ = 6;                      // Owned by a business

// ===========================================================================

class NPCData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.name = "NPC";
		this.skin = 0;
		this.cash = 0;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.rotation = toVector3(0.0, 0.0, 0.0);
		this.scale = toVector3(1.0, 1.0, 1.0);
		this.heading = 0.0;
		this.clan = 0;
		this.rank = 0;
		this.isWorking = false;
		this.jobUniform = this.skin;
		this.lastJobVehicle = null;
		this.job = 0;
		this.weapons = [];
		this.interior = 0;
		this.dimension = 0;
		this.walkStyle = 0;
		this.fightStyle = 0;
		this.health = 100;
		this.armour = 100;
		this.currentAction = AGRP_NPC_ACTION_NONE;
		this.triggers = [];
		this.typeFlags = 0;
		this.heedThreats = false;
		this.threats = 0;
		this.invincible = false;
		this.animationName = "";
		this.ownerType = AGRP_NPC_OWNER_NONE;
		this.ownerId = 0;
		this.enabled = false;

		this.bodyParts = {
			hair: [0, 0],
			head: [0, 0],
			upper: [0, 0],
			lower: [0, 0],
		};

		this.bodyProps = {
			hair: [0, 0],
			eyes: [0, 0],
			head: [0, 0],
			leftHand: [0, 0],
			rightHand: [0, 0],
			leftWrist: [0, 0],
			rightWrist: [0, 0],
			hip: [0, 0],
			leftFoot: [0, 0],
			rightFoot: [0, 0],
		};

		this.triggers = [];

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["npc_id"]);
			this.serverId = toInteger(dbAssoc["npc_server"]);
			this.name = dbAssoc["npc_name"];
			this.skin = toInteger(dbAssoc["npc_skin"]);
			this.cash = toInteger(dbAssoc["npc_cash"]);
			this.position = toVector3(toFloat(dbAssoc["npc_pos_x"]), toFloat(dbAssoc["npc_pos_y"]), toFloat(dbAssoc["npc_pos_z"]));
			this.rotation = toVector3(toFloat(dbAssoc["npc_rot_x"]), toFloat(dbAssoc["npc_rot_y"]), toFloat(dbAssoc["npc_rot_z"]));
			this.scale = toVector3(toFloat(dbAssoc["npc_scale_x"]), toFloat(dbAssoc["npc_scale_y"]), toFloat(dbAssoc["npc_scale_z"]));
			this.heading = toFloat(dbAssoc["npc_rot_z"]);
			this.rank = toInteger(dbAssoc["npc_rank"]);
			this.title = toInteger(dbAssoc["npc_title"]);
			this.job = toInteger(dbAssoc["npc_job"]);
			this.interior = toInteger(dbAssoc["npc_int"]);
			this.dimension = toInteger(dbAssoc["npc_vw"]);
			this.walkStyle = toInteger(dbAssoc["npc_walk_style"]);
			this.fightStyle = toInteger(dbAssoc["npc_fight_style"]);
			this.health = toInteger(dbAssoc["npc_health"]);
			this.armour = toInteger(dbAssoc["npc_armour"]);
			this.typeFlags = toInteger(dbAssoc["npc_type_flags"]);
			this.heedThreats = intToBool(dbAssoc["npc_headthreats"]);
			this.threats = toInteger(dbAssoc["npc_threats"]);
			this.invincible = intToBool(dbAssoc["npc_invincible"]);
			this.animationName = toString(dbAssoc["npc_animation"]);
			this.enabled = intToBool(dbAssoc["npc_enabled"]);
			this.lookAtPlayer = intToBool(dbAssoc["npc_lookatplr"]);

			this.bodyParts = {
				hair: [toInteger(dbAssoc["npc_hd_part_hair_model"]) || 0, toInteger(dbAssoc["npc_hd_part_hair_texture"]) || 0],
				head: [toInteger(dbAssoc["npc_hd_part_head_model"]) || 0, toInteger(dbAssoc["npc_hd_part_head_texture"]) || 0],
				upper: [toInteger(dbAssoc["npc_hd_part_upper_model"]) || 0, toInteger(dbAssoc["npc_hd_part_upper_texture"]) || 0],
				lower: [toInteger(dbAssoc["npc_hd_part_lower_model"]) || 0, toInteger(dbAssoc["npc_hd_part_lower_texture"]) || 0],
			};

			this.bodyProps = {
				hair: [toInteger(dbAssoc["npc_hd_prop_hair_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_hair_texture"]) || 0],
				eyes: [toInteger(dbAssoc["npc_hd_prop_eyes_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_eyes_texture"]) || 0],
				head: [toInteger(dbAssoc["npc_hd_prop_head_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_head_texture"]) || 0],
				leftHand: [toInteger(dbAssoc["npc_hd_prop_lefthand_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_lefthand_texture"]) || 0],
				rightHand: [toInteger(dbAssoc["npc_hd_prop_righthand_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_righthand_texture"]) || 0],
				leftWrist: [toInteger(dbAssoc["npc_hd_prop_leftwrist_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_leftwrist_texture"]) || 0],
				rightWrist: [toInteger(dbAssoc["npc_hd_prop_rightwrist_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_rightwrist_texture"]) || 0],
				hip: [toInteger(dbAssoc["npc_hd_prop_hip_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_hip_texture"]) || 0],
				leftFoot: [toInteger(dbAssoc["npc_hd_prop_leftfoot_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_leftfoot_texture"]) || 0],
				rightFoot: [toInteger(dbAssoc["npc_hd_prop_rightfoot_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_rightfoot_texture"]) || 0],
			};
		}
	}
};

// ===========================================================================

class NPCTriggerData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.npcId = 0;
		this.index = 0;
		this.npc = 0;
		this.npcIndex = -1;
		this.triggerType = 0;
		this.conditions = [];
		this.responses = [];

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["npc_trig_id"]);
			this.npc = toInteger(dbAssoc["npc_trig_npc"]);
			this.triggerType = toInteger(dbAssoc["npc_trig_type"]);
		}
	}
};

// ===========================================================================

class NPCTriggerConditionData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.triggerId = 0;
		this.index = 0;
		this.triggerIndex = 0;
		this.conditionType = 0;
		this.conditionValue = false;
		this.matchType = false;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["npc_trig_cond_id"]);
			this.npc = toInteger(dbAssoc["npc_trig_cond_trig"]);
			this.conditionType = toInteger(dbAssoc["npc_trig_cond_type"]);
			this.conditionValue = toInteger(dbAssoc["npc_trig_cond_val"]);
			this.matchType = toInteger(dbAssoc["npc_trig_cond_val"]);
		}
	}
};

// ===========================================================================

class NPCTriggerResponseData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.triggerId = 0;
		this.index = 0;
		this.triggerIndex = 0;
		this.responseType = 0;
		this.responseValue = false;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["npc_trig_resp_id"]);
			this.npc = toInteger(dbAssoc["npc_trig_resp_trig"]);
			this.responseType = toInteger(dbAssoc["npc_trig_resp_type"]);
			this.responseValue = toInteger(dbAssoc["npc_trig_resp_val"]);
		}
	}
};

// ===========================================================================

function initNPCScript() {
	logToConsole(LOG_DEBUG, "[AGRP.NPC]: Initializing NPC script ...");
	logToConsole(LOG_INFO, "[AGRP.NPC]: NPC script initialized successfully!");
}

// ===========================================================================

/**
 * @param {Number} npcId - The data index of the NPC
 * @return {NPCData} The NPC's data (class instancee)
 */
function getNPCData(npcId) {
	if (typeof getServerData().npcs[npcId] != "undefined") {
		return getServerData().npcs[npcId];
	}
	return false;
}

// ===========================================================================

function createNPCCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let skinIndex = getSkinModelIndexFromParams(params);

	if (!skinIndex) {
		messagePlayerError(client, getLocaleString(client, "InvalidSkin"));
		return false;
	}

	let position = getPlayerPosition(client);
	setPlayerPosition(client, getPosBehindPos(position, getPlayerHeading(client), 1.5))
	let npcId = createNPC(skinIndex, position, getPlayerHeading(client), getPlayerInterior(client), getPlayerDimension(client));
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a {ALTCOLOUR}${getSkinNameFromIndex(getNPCData(npcId).skin)}{MAINCOLOUR} NPC!`);
}

// ===========================================================================

function loadNPCsFromDatabase() {
	logToConsole(LOG_DEBUG, `[AGRP.NPC]: Loading NPCs from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCs = [];
	let dbAssoc;
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM npc_main WHERE npc_server = ${getServerId()} AND npc_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			while (dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCData = new NPCData(dbAssoc);
				tempNPCData.triggers = loadNPCTriggersFromDatabase(tempNPCData.databaseId);
				tempNPCs.push(tempNPCData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[AGRP.NPC]: ${tempNPCs.length} NPCs loaded from database successfully!`);
	return tempNPCs;
}

// ===========================================================================

function loadNPCTriggersFromDatabase(npcDatabaseId) {
	logToConsole(LOG_DEBUG, `[AGRP.NPC]: Loading NPC triggers for NPC ${npcDatabaseId} from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCTriggers = [];
	let dbAssoc;
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM npc_trig WHERE npc_trig_npc = ${npcDatabaseId} AND npc_trig_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			while (dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCTriggerData = new NPCTriggerData(dbAssoc);
				tempNPCTriggerData.conditions = loadNPCTriggerConditionsFromDatabase(tempNPCTriggerData.databaseId);
				tempNPCTriggerData.responses = loadNPCTriggerResponsesFromDatabase(tempNPCTriggerData.databaseId);
				tempNPCTriggers.push(tempNPCTriggerData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[AGRP.NPC]: ${tempNPCTriggers.length} NPC triggers loaded for NPC ${npcDatabaseId} from database successfully!`);
	return tempNPCTriggers;
}

// ===========================================================================

function loadNPCTriggerConditionsFromDatabase(npcTriggerDatabaseId) {
	logToConsole(LOG_DEBUG, `[AGRP.NPC]: Loading NPC trigger conditions for trigger ${npcTriggerDatabaseId} from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCTriggerConditions = [];
	let dbAssoc;
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM npc_cond WHERE npc_cond_trig = ${npcTriggerDatabaseId} AND npc_cond_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			while (dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCTriggerConditionData = new NPCTriggerConditionData(dbAssoc);
				tempNPCTriggerConditions.push(tempNPCTriggerConditionData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[AGRP.NPC]: ${tempNPCTriggerConditions.length} conditions loaded for trigger ${npcTriggerDatabaseId} from database successfully!`);
	return tempNPCTriggerConditions;
}

// ===========================================================================

function loadNPCTriggerResponsesFromDatabase(npcTriggerDatabaseId) {
	logToConsole(LOG_DEBUG, `[AGRP.NPC]: Loading NPC trigger responses for trigger ${npcTriggerDatabaseId} from database ...`);
	let dbConnection = connectToDatabase();
	let tempNPCTriggerResponses = [];
	let dbAssoc;
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM npc_resp WHERE npc_resp_trig = ${npcTriggerDatabaseId} AND npc_resp_enabled = 1`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			while (dbAssoc = fetchQueryAssoc(dbQuery)) {
				let tempNPCTriggerResponseData = new NPCTriggerResponseData(dbAssoc);
				tempNPCTriggerResponses.push(tempNPCTriggerResponseData);
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[AGRP.NPC]: ${tempNPCTriggerResponses.length} responses loaded for trigger ${npcTriggerDatabaseId} from database successfully!`);
	return tempNPCTriggerResponses;
}

// ===========================================================================

function saveAllNPCsToDatabase() {
	if (getServerConfig().devServer) {
		return false;
	}

	for (let i in getServerData().npcs) {
		saveNPCToDatabase(i);
	}
}

// ===========================================================================

function saveNPCToDatabase(npcDataId) {
	if (getServerConfig().devServer) {
		logToConsole(LOG_VERBOSE, `[AGRP.NPC]: NPC ${npcDataId} can't be saved because server is running as developer only. Aborting save ...`);
		return false;
	}

	if (getNPCData(npcDataId) == false) {
		logToConsole(LOG_VERBOSE, `[AGRP.NPC]: NPC ${npcDataId} data is invalid. Aborting save ...`);
		return false;
	}

	let tempNPCData = getNPCData(npcDataId);

	if (tempNPCData.databaseId == -1) {
		logToConsole(LOG_VERBOSE, `[AGRP.NPC]: NPC ${npcDataId} is a temp NPC. Aborting save ...`);
		return false;
	}

	if (!tempNPCData.needsSaved) {
		logToConsole(LOG_VERBOSE, `[AGRP.NPC]: NPC ${npcDataId} hasn't changed data. Aborting save ...`);
		return false;
	}

	logToConsole(LOG_VERBOSE, `[AGRP.NPC]: Saving NPC ${tempNPCData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		if (tempNPCData.ped != false) {
			if (!tempNPCData.spawnLocked) {
				if (areServerElementsSupported()) {
					tempNPCData.position = tempNPCData.ped.position;
					tempNPCData.heading = tempNPCData.ped.heading;
				} else {
					tempNPCData.position = tempNPCData.syncPosition;
					tempNPCData.heading = tempNPCData.syncHeading;
				}
			}
		}

		let safeAnimationName = escapeDatabaseString(dbConnection, tempNPCData.animationName);
		let safeName = escapeDatabaseString(dbConnection, tempNPCData.name);
		let safeTitle = escapeDatabaseString(dbConnection, tempNPCData.title);

		let data = [
			["npc_server", getServerId()],
			["npc_skin", toInteger(tempNPCData.skin)],
			["npc_name", safeName],
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
			["npc_int", toInteger(tempNPCData.interior)],
			["npc_vw", toInteger(tempNPCData.dimension)],
			["npc_fight_style", toInteger(tempNPCData.fightStyle)],
			["npc_walk_style", toInteger(tempNPCData.walkStyle)],
			["npc_rank", toInteger(tempNPCData.rank)],
			["npc_title", toString(safeTitle)],
			["npc_enabled", boolToInt(tempNPCData.enabled)],
			["npc_lookatplr", boolToInt(tempNPCData.lookAtPlayer)],
			//["npc_recreate", toInteger(tempNPCData.recreateOnDeath)],
		];

		let dbQuery = null;
		if (tempNPCData.databaseId == 0) {
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
	logToConsole(LOG_VERBOSE, `[AGRP.NPC]: Saved NPC ${npcDataId} to database!`);

	return false;
}

// ===========================================================================

function setNPCDataIndexes() {
	for (let i in getServerData().npcs) {
		getServerData().npcs[i].index = i;

		for (let j in getServerData().npcs[i].triggers) {
			getServerData().npcs[i].triggers[j].index = j;
			getServerData().npcs[i].triggers[j].npcIndex = i;

			for (let k in getServerData().npcs[i].triggers[j].conditions) {
				getServerData().npcs[i].triggers[j].conditions[k].index = k;
				getServerData().npcs[i].triggers[j].conditions[m].triggerIndex = j;
			}

			for (let m in getServerData().npcs[i].triggers[j].responses) {
				getServerData().npcs[i].triggers[j].responses[m].index = m;
				getServerData().npcs[i].triggers[j].responses[m].triggerIndex = j;
			}
		}
	}
}

// ===========================================================================

function spawnNPC(npcIndex) {
	let npcData = getNPCData(npcIndex);
	let ped = createGamePed(npcData.skin, npcData.position, npcData.rotation.z);
	if (ped) {
		getNPCData(npcIndex).ped = ped;
		setEntityData(ped, "agrp.dataIndex", npcIndex, false);
		if (npcData.animationName != "") {
			let animationId = getAnimationFromParams(npcData.animationName);
			if (animationId != false) {
				setEntityData(ped, "agrp.anim", animationId, true);
			}
		}
		setElementDimension(ped, npcData.dimension);
		setElementInterior(ped, npcData.interior);
	}
}

// ===========================================================================

function spawnAllNPCs() {
	for (let i in getServerData().npcs) {
		spawnNPC(i);
	}
}

// ===========================================================================

function deleteNPCCommand(command, params, client) {
	let closestNPC = getClosestNPC(getPlayerPosition(client), getPlayerDimension(client), getPlayerInterior(client));

	if (!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	let npcName = getNPCData(closestNPC).name;

	deleteNPC(closestNPC);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted NPC {npcPink}${npcName}`, true);
}

// ===========================================================================

function deleteNPC(npcId) {
	quickDatabaseQuery(`DELETE FROM npc_main WHERE npc_id=${getNPCData(npcId).databaseId}`);

	if (getNPCData(npcId)) {
		if (getNPCData(npcId).ped != false) {
			deleteGameElement(getNPCData(npcId).ped);
		}
		getServerData().npcs.splice(npcId, 1);
	}

	setNPCDataIndexes();
}

// ===========================================================================

function setNPCAnimationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let closestNPC = getClosestNPC(getPlayerPosition(client), getPlayerDimension(client), getPlayerInterior(client));
	let animationId = getAnimationFromParams(getParam(params, " ", 1));
	let animationPositionOffset = 1;

	if (!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	if (!getAnimationData(animationId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidAnimation"));
		return false;
	}

	if (areThereEnoughParams(params, 2, " ")) {
		if (toInteger(animationPositionOffset) < 0 || toInteger(animationPositionOffset) > 3) {
			messagePlayerError(client, getLocaleString(client, "InvalidAnimationDistance"));
			return false;
		}
		animationPositionOffset = getParam(params, " ", 2);
	}

	getNPCData(closestNPC).animationName = getAnimationData(animationId).name;
	getNPCData(closestNPC).needsSaved = true;

	makePedPlayAnimation(getNPCData(closestNPC).ped, animationId, animationPositionOffset);
	messagePlayerSuccess(client, getLocaleString(client, "NPCAnimationSet", `{ALTCOLOUR}${getNPCData(closestNPC).name}{MAINCOLOUR}`, `{ALTCOLOUR}${getAnimationData(animationId).name}{MAINCOLOUR}`));
}

// ===========================================================================

function setNPCNameCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let closestNPC = getClosestNPC(getPlayerPosition(client), getPlayerDimension(client), getPlayerInterior(client));
	let name = params;

	if (!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	let oldName = getNPCData(closestNPC).name;
	getNPCData(closestNPC).name = name;
	getNPCData(closestNPC).needsSaved = true;

	setElementName(getNPCData(closestNPC).ped, name);
	messagePlayerSuccess(client, getLocaleString(client, "NPCNameSet", `{ALTCOLOUR}${oldName}{MAINCOLOUR}`, `{ALTCOLOUR}${getNPCData(closestNPC).name}{MAINCOLOUR}`));
}

// ===========================================================================

function setNPCClanCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let closestNPC = getClosestNPC(getPlayerPosition(client), getPlayerDimension(client), getPlayerInterior(client));
	let clanId = getClanFromParams(params);

	if (!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	if (!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	getNPCData(closestNPC).ownerType = AGRP_NPC_OWNER_CLAN;
	getNPCData(closestNPC).ownerId = getClanData(clanId).databaseId;
	getNPCData(closestNPC).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set {npcPink}${getNPCData(closestNPC).name}${MAINCOLOUR}'s clan to {clanOrange}${getClanData(clanId).name}`, true);
}

// ===========================================================================

function addNPCTriggerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let closestNPC = getClosestNPC(getPlayerPosition(client), getPlayerDimension(client), getPlayerInterior(client));

	if (!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}
}

// ===========================================================================

function toggleNPCLookAtClosestPlayerCommand(command, params, client) {
	let closestNPC = getClosestNPC(getPlayerPosition(client), getPlayerDimension(client), getPlayerInterior(client));

	if (!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	getNPCData(closestNPC).lookAtClosestPlayer = !getNPCData(closestNPC).lookAtClosestPlayer;
	getNPCData(closestNPC).needsSaved = true;
	setEntityData(getNPCData(closestNPC).ped, "agrp.lookAtClosestPlayer", getNPCData(closestNPC).lookAtClosestPlayer, true);
	forcePlayerToSyncElementProperties(null, getNPCData(closestNPC).ped);
	//messagePlayerSuccess(client, getLocaleString(client, "NPCLookAtClosestPlayerSet", `{ALTCOLOUR}${getNPCData(closestNPC).name}{MAINCOLOUR}));
}

// ===========================================================================

function getNPCInfoCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let closestNPC = getClosestNPC(getPlayerPosition(client), getPlayerDimension(client), getPlayerInterior(client));

	if (!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	let npcData = getNPCData(closestNPC);

	let ownerName = "Nobody";
	let ownerType = "None";
	switch (npcData.ownerType) {
		case AGRP_NPC_OWNER_CLAN:
			ownerName = getClanData(getClanIndexFromDatabaseId(npcData.ownerId)).name;
			ownerType = "clan";
			break;

		case AGRP_NPC_OWNER_JOB:
			ownerName = getJobData(getJobIndexFromDatabaseId(npcData.ownerId)).name;
			ownerType = "job";
			break;

		case AGRP_NPC_OWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(npcData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			ownerType = "player";
			break;

		case AGRP_NPC_OWNER_BIZ:
			ownerName = getBusinessData(getBusinessIdFromDatabaseId(npcData.ownerId)).name;
			ownerType = "business";
			break;

		case AGRP_NPC_OWNER_PUBLIC:
			ownerName = "Nobody";
			ownerType = "public";
			break;

		default:
			break;
	}

	let tempStats = [
		[`Skin`, `${getGameConfig().skins[npcData.skin][0]} (${getGameConfig().skins[npcData.skin][1]})`],
		[`ID`, `${npcData.index}/${npcData.databaseId}`],
		[`Owner`, `${ownerName} (${ownerType})`],
		[`Animation`, `${npcData.animationName}`],
	];

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderNPCInfo")));
	let chunkedList = splitArrayIntoChunks(stats, 6);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function getClosestNPC(position, dimension, interior) {
	let npcs = getServerData().npcs;

	let closest = 0;
	for (let i in npcs) {
		if (npcs[i].interior == interior && npcs[i].dimension == dimension) {
			if (getDistance(npcs[i].ped.position, position) < getDistance(npcs[closest].ped.position, position)) {
				closest = i;
			}
		}
	}

	return closest;
}

// ===========================================================================

function createNPC(skinIndex, position, heading, interior, dimension) {
	let tempNPCData = new NPCData(false);
	tempNPCData.position = position;
	tempNPCData.rotation = toVector3(0.0, 0.0, heading);
	tempNPCData.skin = skinIndex;
	tempNPCData.interior = interior;
	tempNPCData.dimension = dimension;
	tempNPCData.animationName = "";
	tempNPCData.needsSaved = true;

	let npcIndex = getServerData().npcs.push(tempNPCData);
	setNPCDataIndexes();

	spawnNPC(npcIndex - 1);

	return npcIndex - 1;
}

// ===========================================================================