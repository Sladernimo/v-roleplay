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
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPCs from database ...`);
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

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCs.length} NPCs loaded from database successfully!`);
	return tempNPCs;
}

// ===========================================================================

function loadNPCTriggersFromDatabase(npcDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPC triggers for NPC ${npcDatabaseId} from database ...`);
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

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCTriggers.length} NPC triggers loaded for NPC ${npcDatabaseId} from database successfully!`);
	return tempNPCTriggers;
}

// ===========================================================================

function loadNPCTriggerConditionsFromDatabase(npcTriggerDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPC trigger conditions for trigger ${npcTriggerDatabaseId} from database ...`);
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

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCTriggerConditions.length} conditions loaded for trigger ${npcTriggerDatabaseId} from database successfully!`);
	return tempNPCTriggerConditions;
}

// ===========================================================================

function loadNPCTriggerResponsesFromDatabase(npcTriggerDatabaseId) {
	logToConsole(LOG_INFO, `[VRR.NPC]: Loading NPC trigger responses for trigger ${npcTriggerDatabaseId} from database ...`);
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

	logToConsole(LOG_INFO, `[VRR.NPC]: ${tempNPCTriggerResponses.length} responses loaded for trigger ${npcTriggerDatabaseId} from database successfully!`);
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
		logToConsole(LOG_VERBOSE, `[VRR.NPC]: NPC ${npcDataId} can't be saved because server is running as developer only. Aborting save ...`);
		return false;
	}

	if (getNPCData(npcDataId) == false) {
		logToConsole(LOG_VERBOSE, `[VRR.NPC]: NPC ${npcDataId} data is invalid. Aborting save ...`);
		return false;
	}

	let tempNPCData = getNPCData(npcDataId);

	if (tempNPCData.databaseId == -1) {
		logToConsole(LOG_VERBOSE, `[VRR.NPC]: NPC ${npcDataId} is a temp NPC. Aborting save ...`);
		return false;
	}

	if (!tempNPCData.needsSaved) {
		logToConsole(LOG_VERBOSE, `[VRR.NPC]: NPC ${npcDataId} hasn't changed data. Aborting save ...`);
		return false;
	}

	logToConsole(LOG_VERBOSE, `[VRR.NPC]: Saving NPC ${tempNPCData.databaseId} to database ...`);
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
	logToConsole(LOG_VERBOSE, `[VRR.NPC]: Saved NPC ${npcDataId} to database!`);

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
		setEntityData(ped, "vrr.dataIndex", npcIndex, false);
		if (npcData.animationName != "") {
			let animationId = getAnimationFromParams(npcData.animationName);
			if (animationId != false) {
				setEntityData(ped, "vrr.anim", animationId, true);
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
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted NPC {npcPink}${npcName}`);
}

// ===========================================================================

function deleteNPC(npcId) {
	quickDatabaseQuery(`DELETE FROM npc_main WHERE npc_id=${getNPCData(npcId).databaseId}`);

	if (getNPCData(npcId)) {
		if (getNPCData(npcId).ped != false) {
			deleteEntity(getNPCData(npcId).ped);
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

function toggleNPCLookAtClosestPlayerCommand(command, params, client) {
	let closestNPC = getClosestNPC(getPlayerPosition(client), getPlayerDimension(client), getPlayerInterior(client));

	if (!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	getNPCData(closestNPC).lookAtClosestPlayer = !getNPCData(closestNPC).lookAtClosestPlayer;
	getNPCData(closestNPC).needsSaved = true;
	setEntityData(getNPCData(closestNPC).ped, "vrr.lookAtClosestPlayer", getNPCData(closestNPC).lookAtClosestPlayer, true);
	forcePlayerToSyncElementProperties(null, getNPCData(closestNPC).ped);
	//messagePlayerSuccess(client, getLocaleString(client, "NPCLookAtClosestPlayerSet", `{ALTCOLOUR}${getNPCData(closestNPC).name}{MAINCOLOUR}));
}

// ===========================================================================

function getNPCInfoCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let closestNPC = getClosestNPC(getPlayerPosition(client));

	if (!getNPCData(closestNPC)) {
		messagePlayerError(client, getLocaleString(client, "InvalidNPC"));
		return false;
	}

	let npcData = getNPCData(closestNPC);

	let ownerName = "Nobody";
	let ownerType = "None";
	switch (npcData.ownerType) {
		case VRR_NPCOWNER_CLAN:
			ownerName = getClanData(getClanIdFromDatabaseId(npcData.ownerId)).name;
			ownerType = "clan";
			break;

		case VRR_NPCOWNER_JOB:
			ownerName = getJobData(getJobIdFromDatabaseId(npcData.ownerId)).name;
			ownerType = "job";
			break;

		case VRR_NPCOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(npcData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			ownerType = "player";
			break;

		case VRR_NPCOWNER_BIZ:
			ownerName = getBusinessData(getBusinessIdFromDatabaseId(npcData.ownerId)).name;
			ownerType = "business";
			break;

		case VRR_NPCOWNER_PUBLIC:
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

function getClosestNPC(position, interior, dimension) {
	let npcs = getServerData().npcs;

	let closest = 0;
	for (let i in npcs) {
		if (getDistance(npcs[i].ped.position, position) < getDistance(npcs[closest].ped.position, position) && npcs[closest].interior == interior && npcs[closest].dimension == dimension) {
			closest = i;
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