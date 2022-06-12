// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: business.js
// DESC: Provides business functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initBusinessScript() {
	logToConsole(LOG_INFO, "[VRR.Business]: Initializing business script ...");


	logToConsole(LOG_INFO, "[VRR.Business]: Business script initialized successfully!");
	return true;
}

// ===========================================================================

function loadBusinessFromId(businessId) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM biz_main WHERE biz_id = ${businessId} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			let dbAssoc = fetchQueryAssoc(dbQuery);
			freeDatabaseQuery(dbQuery);
			return new BusinessData(dbAssoc);
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function loadBusinessesFromDatabase() {
	logToConsole(LOG_INFO, "[VRR.Business]: Loading businesses from database ...");

	let tempBusinesses = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if (dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM biz_main WHERE biz_deleted = 0 AND biz_server = ${getServerId()}`);
		if (dbQuery) {
			if (dbQuery.numRows > 0) {
				while (dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempBusinessData = new BusinessData(dbAssoc);
					//tempBusinessData.locations = loadBusinessLocationsFromDatabase(tempBusinessData.databaseId);
					//tempBusinessData.gameScripts = loadBusinessGameScriptsFromDatabase(tempBusinessData.databaseId);
					tempBusinesses.push(tempBusinessData);
					logToConsole(LOG_VERBOSE, `[VRR.Business]: Business '${tempBusinessData.name}' (ID ${tempBusinessData.databaseId}) loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[VRR.Business]: ${tempBusinesses.length} businesses loaded from database successfully!`);
	return tempBusinesses;
}

// ===========================================================================

function loadBusinessLocationsFromDatabase(businessId) {
	logToConsole(LOG_VERBOSE, `[VRR.Business]: Loading business locations for business ${businessId} from database ...`);

	let tempBusinessLocations = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;
	let dbQueryString = "";

	if (dbConnection) {
		dbQueryString = `SELECT * FROM biz_loc WHERE biz_loc_biz = ${businessId}`;
		dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			if (dbQuery.numRows > 0) {
				while (dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempBusinessLocationData = new BusinessLocationData(dbAssoc);
					tempBusinessLocations.push(tempBusinessLocationData);
					logToConsole(LOG_VERBOSE, `[VRR.Business]: Location '${tempBusinessLocationData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_VERBOSE, `[VRR.Business]: ${tempBusinessLocations.length} location for business ${businessId} loaded from database successfully!`);
	return tempBusinessLocations;
}

// ===========================================================================

/*
function loadBusinessGameScriptsFromDatabase(businessId) {
	logToConsole(LOG_VERBOSE, `[VRR.Business]: Loading business game scripts for business ${businessId} from database ...`);

	let tempBusinessGameScripts = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;
	let dbQueryString = "";

	if(dbConnection) {
		dbQueryString = `SELECT * FROM biz_script WHERE biz_script_biz = ${businessId}`;
		dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempBusinessGameScriptData = new BusinessGameScriptData(dbAssoc);
					tempBusinessGameScripts.push(tempBusinessGameScriptData);
					logToConsole(LOG_VERBOSE, `[VRR.Business]: Game script '${tempBusinessGameScriptData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_VERBOSE, `[VRR.Business]: ${tempBusinessGameScripts.length} game scripts for business ${businessId} loaded from database successfully!`);
	return tempBusinessGameScripts;
}
*/

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
function createBusinessCommand(command, params, client) {
	createBusiness(params, getPlayerPosition(client), toVector3(0.0, 0.0, 0.0), getGameConfig().pickupModels[getGame()].Business, -1, getPlayerInterior(client), getPlayerDimension(client), getPlayerData(client).interiorCutscene);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created business: {businessBlue}${params}`);
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
function createBusinessLocationCommand(command, params, client) {
	if (!isPlayerSpawned(client)) {
		messagePlayerError(client, "You must be spawned to use this command!");
		return false;
	}

	let locationType = toString(getParam(params, " ", 1));
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let tempBusinessLocationData = createBusinessLocation(locationType, businessId);
	getServerData().businesses[businessId].push(tempBusinessLocationData);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created location {businessBlue}${params}{MAINCOLOUR} for business {businessBlue}${tempBusinessData.name}`);
}

// ===========================================================================

function createBusiness(name, entrancePosition, exitPosition, entrancePickupModel = -1, entranceBlipModel = -1, entranceInterior = 0, entranceDimension = 0, entranceCutscene = -1) {
	let tempBusinessData = new BusinessData(false);
	tempBusinessData.name = name;

	tempBusinessData.entrancePosition = entrancePosition;
	tempBusinessData.entranceRotation = 0.0;
	tempBusinessData.entrancePickupModel = entrancePickupModel;
	tempBusinessData.entranceBlipModel = entranceBlipModel;
	tempBusinessData.entranceInterior = entranceInterior;
	tempBusinessData.entranceDimension = entranceDimension;
	tempBusinessData.entranceCutscene = entranceCutscene;

	tempBusinessData.exitPosition = exitPosition;
	tempBusinessData.exitRotation = 0.0;
	tempBusinessData.exitPickupModel = 0;
	tempBusinessData.exitBlipModel = -1;
	tempBusinessData.exitInterior = 0;
	tempBusinessData.exitDimension = 0;
	tempBusinessData.exitCutscene = -1;

	tempBusinessData.needsSaved = true;
	let businessId = getServerData().businesses.push(tempBusinessData);
	setBusinessDataIndexes();
	saveAllBusinessesToDatabase();

	createBusinessPickups(businessId - 1);
	createBusinessBlips(businessId - 1);

	return tempBusinessData;
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
function deleteBusinessCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted business {businessBlue}${getBusinessData(businessId).name}`);
	deleteBusiness(businessId, getPlayerData(client).accountData.databaseId);
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
function deleteBusinessLocationCommand(command, params, client) {
	//let businessId = toInteger(getParam(params, " ", 2));
	//deleteBusinessLocation(businessId);
	//messagePlayerSuccess(client, `Business '${tempBusinessData.name} deleted!`);
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
function setBusinessNameCommand(command, params, client) {
	let newBusinessName = toString(params);

	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	let oldBusinessName = getBusinessData(businessId).name;
	getBusinessData(businessId).name = newBusinessName;
	setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.name", getBusinessData(businessId).name, true);
	getBusinessData(businessId).needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} renamed business {businessBlue}${oldBusinessName}{MAINCOLOUR} to {businessBlue}${newBusinessName}`);
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
function setBusinessOwnerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let newBusinessOwner = getPlayerFromParams(params);
	let businessId = getPlayerBusiness(client);

	if (!newBusinessOwner) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_PLAYER;
	getBusinessData(businessId).ownerId = getPlayerCurrentSubAccount(newBusinessOwner).databaseId;
	getBusinessData(businessId).needsSaved = true;

	messagePlayerSuccess(client, `{MAINCOLOUR}You gave business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} to {ALTCOLOUR}${getCharacterFullName(newBusinessOwner)}`);
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
function setBusinessJobCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params);
	let businessId = getPlayerBusiness(client);

	if (!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_JOB;
	getBusinessData(businessId).ownerId = getJobData(jobId).databaseId;
	getBusinessData(businessId).needsSaved = true;

	messagePlayerSuccess(client, `{MAINCOLOUR}You set the owner of business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}to the {jobYellow}${getJobData(jobId).name}`);
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
function setBusinessClanCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (getBusinessData(business).ownerType != VRR_VEHOWNER_PLAYER) {
		messagePlayerError(client, getLocaleString(client, "MustOwnBusiness"));
		return false;
	}

	if (getBusinessData(business).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
		messagePlayerError(client, getLocaleString(client, "MustOwnBusiness"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "SetBusinessClanConfirmMessage"), getLocaleString(client, "SetBusinessClanConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = VRR_PROMPT_BIZGIVETOCLAN;

	//getBusinessData(businessId).ownerType = VRR_BIZOWNER_CLAN;
	//getBusinessData(businessId).ownerId = getClanData(clanId).databaseId;
	//getBusinessData(businessId).needsSaved = true;
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
function setBusinessRankCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let rankId = params;

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	if (getVehicleData(vehicle).ownerType == VRR_VEHOWNER_CLAN) {
		let clanId = getClanIdFromDatabaseId(getBusinessData(businessId).ownerId);
		rankId = getClanRankFromParams(clanId, params);
		if (!getClanRankData(clanId, rankId)) {
			messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
			return false;
		}
		getBusinessData(businessId).rank = getClanRankData(clanId, rankId).databaseId;
		messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}rank to {ALTCOLOUR}${getClanRankData(clanId, rankId).name} {MAINCOLOUR}of the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan!`);
	} else if (getBusinessData(businessId).ownerType == VRR_VEHOWNER_JOB) {
		getBusinessData(businessId).rank = rankId;
		messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}rank to {ALTCOLOUR}${rankId} {MAINCOLOUR}of the {jobYellow}${getJobData(getJobIdFromDatabaseId(getBusinessData(businessId).ownerId)).name} {MAINCOLOUR}job!`);
	}

	getBusinessData(businessId).needsSaved = true;
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
function setBusinessRankCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let clanRankId = getClanRankFromParams(clanId, params);

	if (!getClanRankData(clanId, clanRankId)) {
		messagePlayerError(client, getLocaleString(client, "ClanRankInvalid"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	if (getClanRankData(clanId, clanRankId).level > getPlayerCurrentSubAccount(client).clanRank) {
		messagePlayerError(client, "That rank is above your level!");
		return false;
	}

	getBusinessData(businessId).clanRank = getClanRankData(clanId, clanRankId).level;

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR}'s clan rank to {clanOrange}${getClanRankData(clanId, clanRankId).name} {MAINCOLOUR}(level ${getClanRankData(clanId, clanRankId).level}) and above!`);
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
function setBusinessJobCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	let closestJobLocation = getClosestJobLocation(getVehiclePosition(vehicle));
	let jobId = closestJobLocation.job;

	if (!areParamsEmpty(params)) {
		jobId = getJobIdFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_JOB;
	getBusinessData(businessId).ownerId = getJobData(jobId).databaseId;

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}owner to the {jobYellow}${getJobData(jobId).name} {MAINCOLOUR}job`);
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
function setBusinessPublicCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_PUBLIC;
	getBusinessData(businessId).ownerId = 0;

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}owner set to {ALTCOLOUR}public`);
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
function removeBusinessOwnerCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = VRR_BIZOWNER_NONE;
	getBusinessData(businessId).ownerId = -1;
	getBusinessData(businessId).needsSaved = true;

	messagePlayerSuccess(client, `{MAINCOLOUR}You removed business {businessBlue}${getBusinessData(businessId).name}'s{MAINCOLOUR} owner`);
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
function toggleBusinessInteriorLightsCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, "You can't change the interior lights for this business!");
		return false;
	}

	getBusinessData(businessId).interiorLights = !getBusinessData(businessId).interiorLights;
	updateBusinessInteriorLightsForOccupants(businessId);

	getBusinessData(businessId).needsSaved = true;
	meActionToNearbyPlayers(client, `turns ${toLowerCase(getOnOffFromBool(getBusinessData(businessId).interiorLights))} the business lights`);
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
function setBusinessEntranceFeeCommand(command, params, client) {
	let entranceFee = toInteger(getParam(params, " ", 1)) || 0;
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	getBusinessData(businessId).entranceFee = entranceFee;
	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}entrance fee to [#AAAAAAA]$${entranceFee}`);
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
function getBusinessInfoCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let businessData = getBusinessData(businessId);

	let ownerName = "Unknown";
	switch (businessData.ownerType) {
		case VRR_BIZOWNER_CLAN:
			ownerName = getClanData(businessData.ownerId).name;
			break;

		case VRR_BIZOWNER_JOB:
			ownerName = getJobData(businessData.ownerId).name;
			break;

		case VRR_BIZOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(businessData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			break;

		case VRR_BIZOWNER_PUBLIC:
			ownerName = "Public";
			break;

		case VRR_BIZOWNER_NONE:
			//submitBugReport(client, `[AUTOMATED REPORT] getBusinessInfoCommand() - Invalid ownerType for business ${businessId}/${getBusinessData(businessId).databaseId}`);
			ownerName = "None";
			break;

		default:
			submitBugReport(client, `[AUTOMATED REPORT] getBusinessInfoCommand() - Invalid ownerType ${businessData.ownerType} for business ${businessId}/${getBusinessData(businessId).databaseId}`);
			ownerName = "None";
			break;
	}


	let tempStats = [
		[`Name`, `${businessData.name}`],
		[`ID`, `${businessData.index}/${businessData.databaseId}`],
		[`Owner`, `${ownerName} (${getBusinessOwnerTypeText(businessData.ownerType)})`],
		[`Locked`, `${getLockedUnlockedFromBool(businessData.locked)}`],
		[`BuyPrice`, `$${businessData.buyPrice}`],
		//[`RentPrice`, `${businessData.rentPrice}`],
		[`HasInterior`, `${getYesNoFromBool(businessData.hasInterior)}`],
		[`CustomInterior`, `${getYesNoFromBool(businessData.customInterior)}`],
		[`HasBuyableItems`, `${getYesNoFromBool(doesBusinessHaveAnyItemsToBuy(businessId))}`],
		[`EntranceFee`, `$${businessData.entranceFee}`],
		[`InteriorLights`, `${getOnOffFromBool(businessData.interiorLights)}`],
		[`Balance`, `$${businessData.till}`],
		[`RadioStation`, `${businessData.streamingRadioStation}`],
		[`LabelHelpType`, `${businessData.labelHelpType}`],
	];

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBusinessInfo", businessData.name)));
	let chunkedList = splitArrayIntoChunks(stats, 6);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}

	//messagePlayerInfo(client, `🏢 {businessBlue}[Business Info] {MAINCOLOUR}Name: {ALTCOLOUR}${getBusinessData(businessId).name}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName} (${getBusinessOwnerTypeText(getBusinessData(businessId).ownerType)}), {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(intToBool(getBusinessData(businessId).locked))}, {MAINCOLOUR}ID: {ALTCOLOUR}${businessId}/${getBusinessData(businessId).databaseId}`);
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
function getBusinessFloorItemsCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	showBusinessFloorInventoryToPlayer(client, businessId);
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
function getBusinessStorageItemsCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	showBusinessStorageInventoryToPlayer(client, businessId);
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
function setBusinessPickupCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (isNaN(typeParam)) {
		if (isNull(getGameConfig().pickupModels[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid pickup type! Use a pickup type name or a model ID");
			let pickupTypes = Object.keys(getGameConfig().pickupModels[getGame()]);
			let chunkedList = splitArrayIntoChunks(pickupTypes, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPickupTypes")));
			for (let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getBusinessData(businessId).entrancePickupModel = getGameConfig().pickupModels[getGame()][typeParam];
	} else {
		getBusinessData(businessId).entrancePickupModel = toInteger(typeParam);
	}

	resetBusinessPickups(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} pickup display to {ALTCOLOUR}${typeParam}!`);
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
function setBusinessInteriorTypeCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (typeof getGameConfig().interiors[getGame()] == "undefined") {
		messagePlayerError(client, `There are no interiors available for this game!`);
		return false;
	}

	if (isNaN(typeParam)) {
		if (toLowerCase(typeParam) == "None") {
			getBusinessData(businessId).exitPosition = toVector3(0.0, 0.0, 0.0);
			getBusinessData(businessId).exitDimension = 0;
			getBusinessData(businessId).exitInterior = -1;
			getBusinessData(businessId).hasInterior = false;
			getBusinessData(businessId).interiorCutscene = "";
			getBusinessData(businessId).exitPickupModel = -1;
			getBusinessData(businessId).customInterior = false;
			messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} interior`);
			return false;
		}

		if (isNull(getGameConfig().interiors[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid interior type! Use an interior type name");
			let interiorTypesList = Object.keys(getGameConfig().interiors[getGame()]);
			let chunkedList = splitArrayIntoChunks(interiorTypesList, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderInteriorTypes")));
			for (let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getBusinessData(businessId).exitPosition = getGameConfig().interiors[getGame()][typeParam][0];
		getBusinessData(businessId).exitInterior = getGameConfig().interiors[getGame()][typeParam][1];
		getBusinessData(businessId).exitDimension = getBusinessData(businessId).databaseId + getGlobalConfig().businessDimensionStart;
		getBusinessData(businessId).exitPickupModel = getGameConfig().pickupModels[getGame()].Exit;
		getBusinessData(businessId).hasInterior = true;
		getBusinessData(businessId).customInterior = getGameConfig().interiors[getGame()][typeParam][2];
		getBusinessData(businessId).interiorCutscene = getGameConfig().interiors[getGame()][typeParam][3];
	}

	//deleteBusinessExitPickup(businessId);
	//deleteBusinessExitBlip(businessId);
	//createBusinessExitBlip(businessId);
	//createBusinessExitPickup(businessId);

	resetBusinessPickups(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} interior type to {ALTCOLOUR}${typeParam}`);
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
function addBusinessPropertyTemplateEntities(command, params, client) {
	let propertyTemplateParam = getParam(params, " ", 1) || "business";
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (typeof getGameConfig().interiors[getGame()] == "undefined") {
		messagePlayerError(client, `There are no property templates available for this game!`);
		return false;
	}

	if (isNaN(propertyTemplateParam)) {
		if (isNull(getGameConfig().interiors[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid interior type! Use an interior type name");
			let interiorTypesList = Object.keys(getGameConfig().properties[getGame()]);
			let chunkedList = splitArrayIntoChunks(interiorTypesList, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPropertyTemplateTypes")));
			for (let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getBusinessData(businessId).exitPosition = getGameConfig().interiors[getGame()][typeParam][0];
		getBusinessData(businessId).exitInterior = getGameConfig().interiors[getGame()][typeParam][1];
		getBusinessData(businessId).exitDimension = getBusinessData(businessId).databaseId + getGlobalConfig().businessDimensionStart;
		getBusinessData(businessId).exitPickupModel = getGameConfig().pickupModels[getGame()].Exit;
		getBusinessData(businessId).hasInterior = true;
		getBusinessData(businessId).customInterior = getGameConfig().interiors[getGame()][typeParam][2];
		getBusinessData(businessId).interiorCutscene = getGameConfig().interiors[getGame()][typeParam][3];
	}

	//deleteBusinessExitPickup(businessId);
	//deleteBusinessExitBlip(businessId);
	//createBusinessExitBlip(businessId);
	//createBusinessExitPickup(businessId);

	resetBusinessPickups(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} interior type to {ALTCOLOUR}${typeParam}`);
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
function setBusinessBlipCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (isNaN(typeParam)) {
		if (isNull(getGameConfig().blipSprites[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid business type! Use a business type name or a blip image ID");

			let blipTypes = Object.keys(getGameConfig().blipSprites[getGame()]);
			let chunkedList = splitArrayIntoChunks(blipTypes, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBlipTypes")));
			for (let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getBusinessData(businessId).entranceBlipModel = getGameConfig().blipSprites[getGame()][typeParam];
	} else {
		getBusinessData(businessId).entranceBlipModel = toInteger(typeParam);
	}

	resetBusinessBlips(businessId);
	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} blip display to {ALTCOLOUR}${typeParam}`);
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
function giveDefaultItemsToBusinessCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!isNaN(typeParam)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (isNull(getGameConfig().defaultBusinessItems[getGame()][typeParam])) {
		messagePlayerError(client, "Invalid business items type! Use a business items type name");
		let businessItemTypes = Object.keys(getGameConfig().defaultBusinessItems[getGame()]);
		let chunkedList = splitArrayIntoChunks(businessItemTypes, 10);

		messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderDefaultBusinessItemTypes")));
		for (let i in chunkedList) {
			messagePlayerInfo(client, chunkedList[i].join(", "));
		}
		return false;
	}

	for (let i in getGameConfig().defaultBusinessItems[getGame()][typeParam]) {
		let itemTypeId = getItemTypeFromParams(getGameConfig().defaultBusinessItems[getGame()][typeParam][i][0]);
		let itemTypeData = getItemTypeData(itemTypeId);
		if (itemTypeData) {
			let newItemIndex = createItem(itemTypeId, itemTypeData.orderValue, VRR_ITEM_OWNER_BIZFLOOR, getBusinessData(businessId).databaseId, getGameConfig().defaultBusinessItems[getGame()][typeParam][i][1]);
			getItemData(newItemIndex).buyPrice = applyServerInflationMultiplier(itemTypeData.orderPrice) * getGameConfig().defaultBusinessItems[getGame()][typeParam][i][2];
		}
	}

	cacheBusinessItems(businessId);
	updateBusinessPickupLabelData(businessId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} gave business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} the default items for ${toLowerCase(typeParam)}`);
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
function setBusinessEntranceLabelToDealershipCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).labelHelpType == VRR_PROPLABEL_INFO_ENTERVEHICLE;
	updateBusinessPickupLabelData(businessId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the business type of {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} to dealership`);
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
function deleteBusinessFloorItemsCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let tempCache = getBusinessData(businessId).floorItemCache;
	for (let i in tempCache) {
		deleteItem(tempCache[i]);
	}

	cacheBusinessItems(businessId);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted all on-sale items for business {businessBlue}${getBusinessData(businessId).name}`);
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
function deleteBusinessStorageItemsCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let tempCache = getBusinessData(businessId).storageItemCache;
	for (let i in tempCache) {
		deleteItem(tempCache[i]);
	}

	cacheBusinessItems(businessId);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted all stored items for business {businessBlue}${getBusinessData(businessId).name}`);
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
function withdrawFromBusinessCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	if (getBusinessData(businessId).till < amount) {
		messagePlayerError(client, `Business {businessBlue}${tempBusinessData.name} doesn't have that much money! Use /bizbalance.`);
		return false;
	}

	getBusinessData(businessId).till -= amount;
	givePlayerCash(client, amount);
	updatePlayerCash(client);
	getBusinessData(businessId).needsSaved = true;

	messagePlayerSuccess(client, `You withdrew $${amount} from business {businessBlue}${getBusinessData(businessId).name} till`);
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
function setBusinessBuyPriceCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	if (amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getBusinessData(businessId).buyPrice = amount;
	setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.price", getBusinessData(businessId).buyPrice, true);

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name}'s {MAINCOLOUR}for-sale price to {ALTCOLOUR}$${makeLargeNumberReadable(amount)}`);
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
function depositIntoBusinessCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	// Let anybody deposit money
	//if(!canPlayerManageBusiness(client, businessId)) {
	//	messagePlayerError(client, "You can't deposit cash into this business!");
	//	return false;
	//}

	if (getPlayerCurrentSubAccount(client).cash < amount) {
		messagePlayerError(client, `You don't have that much money! You only have $${getPlayerCurrentSubAccount(client).cash}`);
		return false;
	}

	getBusinessData(businessId).till += amount;
	takePlayerCash(client, amount);
	updatePlayerCash(client);

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `You deposited $${amount} into business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}till`);
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
function orderItemForBusinessCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!areThereEnoughParams(params, 3, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let itemType = getItemTypeFromParams(splitParams.slice(0, -2).join(" "));

	if (!getItemTypeData(itemType)) {
		messagePlayerError(client, `Invalid item type name or ID!`);
		messagePlayerInfo(client, `Use {ALTCOLOUR}/itemtypes {MAINCOLOUR}for a list of items`);
		return false;
	}
	let pricePerItem = getOrderPriceForItemType(itemType);

	let amount = toInteger(splitParams.slice(-2, -1)) || 1;
	let value = toInteger(splitParams.slice(-1)) || getItemTypeData(itemType).capacity;
	let businessId = getPlayerBusiness(client);

	logToConsole(LOG_DEBUG, `[VRR.Business] ${getPlayerDisplayForConsole(client)} is ordering ${amount} ${splitParams.slice(0, -2).join(" ")} (${value})`);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	let orderTotalCost = pricePerItem * amount;

	//getPlayerData(client).promptType = VRR_PROMPT_BIZORDER;
	getPlayerData(client).businessOrderAmount = amount;
	getPlayerData(client).businessOrderBusiness = businessId;
	getPlayerData(client).businessOrderItem = itemType;
	getPlayerData(client).businessOrderValue = value;
	getPlayerData(client).businessOrderCost = orderTotalCost;

	getBusinessData(businessId).needsSaved = true;
	showPlayerPrompt(client, `Ordering ${amount} ${getPluralForm(getItemTypeData(itemType).name)} (${getItemValueDisplay(itemType, value)}) at $${makeLargeNumberReadable(pricePerItem)} each will cost a total of $${makeLargeNumberReadable(orderTotalCost)}`, "Business Order Cost");
	getPlayerData(client).promptType = VRR_PROMPT_BIZORDER;
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
function orderItemForBusiness(businessId, itemType, amount) {
	if (getBusinessData(businessId).till < orderTotalCost) {
		let neededAmount = orderTotalCost - getBusinessData(businessId).till;
		//messagePlayerError(client, `The business doesn't have enough money (needs {ALTCOLOUR}$${neededAmount} {MAINCOLOUR}more)! Use {ALTCOLOUR}/bizdeposit {MAINCOLOUR}to add money to the business.`);
		return false;
	}

	getBusinessData(businessId).till -= orderTotalCost;
	addToBusinessInventory(businessId, itemType, amount);
	//messagePlayerSuccess(client, `You ordered ${amount} ${getPluralForm(getItemTypeData(itemType).name)} (${getItemValueDisplay(itemType, value)}) at $${getItemTypeData(itemType).orderPrice} each for business {businessBlue}${getBusinessData(businessId).name}`);
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
function viewBusinessTillAmountCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	messagePlayerSuccess(client, `Business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} till has {ALTCOLOUR}$${getBusinessData(businessId).till}`);
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
function buyBusinessCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (getBusinessData(businessId).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "BusinessNotForSale"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).cash < getBusinessData(businessId).buyPrice) {
		messagePlayerError(client, getLocaleString(client, "BusinessPurchaseNotEnoughMoney"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "BuyBusinessConfirmMessage"), getLocaleString(client, "BuyBusinessConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = VRR_PROMPT_BIZBUY;
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
function moveBusinessEntranceCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).entrancePosition = getPlayerPosition(client);
	getBusinessData(businessId).entranceDimension = getPlayerDimension(client);
	getBusinessData(businessId).entranceInterior = getPlayerInterior(client);

	//deleteBusinessEntranceBlip(businessId);
	//deleteBusinessEntrancePickup(businessId);
	//createBusinessEntranceBlip(businessId);
	//createBusinessEntrancePickup(businessId);

	resetBusinessPickups(businessId);
	resetBusinessBlips(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} entrance to their position`);
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
function moveBusinessExitCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!areParamsEmpty(params)) {
		businessId = getBusinessFromParams(params);
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).exitPosition = getPlayerPosition(client);
	getBusinessData(businessId).exitDimension = getPlayerDimension(client);
	getBusinessData(businessId).exitInterior = getPlayerInterior(client);

	deleteBusinessExitBlip(businessId);
	deleteBusinessExitPickup(businessId);

	createBusinessExitBlip(businessId);
	createBusinessExitPickup(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR}exit to their position`);
}

// ===========================================================================

function getBusinessDataFromDatabaseId(databaseId) {
	let matchingBusinesses = getServerData().businesses.filter(b => b.databaseId == businessId)
	if (matchingBusinesses.length == 1) {
		return matchingBusinesses[0];
	}
	return false;
}

// ===========================================================================

/**
 * Gets the closest business entrance to a position
 *
 * @param {Vector3} position - The position to check
 * @param {Number} dimension - The dimension to check
 * @return {Number} The data index of the business
 *
 */
function getClosestBusinessEntrance(position, dimension) {
	let closest = 0;
	for (let i in getServerData().businesses) {
		if (getServerData().businesses[i].entranceDimension == dimension) {
			if (getDistance(position, getServerData().businesses[i].entrancePosition) <= getDistance(position, getServerData().businesses[closest].entrancePosition)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

/**
 * Gets the closest business exit to a position
 *
 * @param {Vector3} position - The position to check
 * @param {Number} dimension - The dimension to check
 * @return {Number} The data index of the business
 *
 */
function getClosestBusinessExit(position, dimension) {
	let closest = 0;
	for (let i in getServerData().businesses) {
		if (getServerData().businesses[i].hasInterior && getServerData().businesses[i].exitDimension == dimension) {
			if (getDistance(position, getServerData().businesses[i].exitPosition) <= getDistance(position, getServerData().businesses[closest].exitPosition)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

/**
 * Gets whether or not a client is in a business
 *
 * @param {Client} client - The client to check whether or not is in a business
 * @return {Boolean} Whether or not the client is in a business
 *
 */
function isPlayerInAnyBusiness(client) {
	for (let i in getServerData().businesses) {
		if (getServerData().businesses[i].hasInterior && getServerData().businesses[i].exitDimension == getPlayerDimension(client)) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

/**
 * Gets the data index of the business a client is in
 *
 * @param {Client} client - The client to check whether or not is in a business
 * @return {Number} The data index of the business
 *
 */
function getPlayerBusiness(client) {
	if (getServerData().businesses.length == 0) {
		return -1;
	}

	if (getPlayerDimension(client) == getGameConfig().mainWorldDimension[getGame()]) {
		let closestEntrance = getClosestBusinessEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getPlayerPosition(client), getBusinessData(closestEntrance).entrancePosition) <= getGlobalConfig().enterPropertyDistance) {
			return getBusinessData(closestEntrance).index;
		}
	} else {
		let closestEntrance = getClosestBusinessEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getPlayerPosition(client), getBusinessData(closestEntrance).entrancePosition) <= getGlobalConfig().enterPropertyDistance) {
			return getBusinessData(closestEntrance).index;
		}

		for (let i in getServerData().businesses) {
			if (getServerData().businesses[i].hasInterior && getServerData().businesses[i].exitDimension == getPlayerDimension(client)) {
				return i;
			}
		}
	}
	return -1;
}

// ===========================================================================

/**
 * Saves all server businesses to the database
 *
 * @return {Boolean} Whether or not the businesses were saved
 *
 */
function saveAllBusinessesToDatabase() {
	if (getServerConfig().devServer) {
		return false;
	}

	for (let i in getServerData().businesses) {
		if (getServerData().businesses[i].needsSaved) {
			saveBusinessToDatabase(i);
		}
	}

	return true
}

// ===========================================================================

/**
 * Saves a server businesses to the database by data index
 *
 * @param {Number} businessId - The data index of the business to save
 * @return {Boolean} Whether or not the business was saved
 *
 */
function saveBusinessToDatabase(businessId) {
	let tempBusinessData = getServerData().businesses[businessId];

	if (!tempBusinessData.needsSaved) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Business]: Saving business '${tempBusinessData.name}' to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeBusinessName = escapeDatabaseString(dbConnection, tempBusinessData.name);

		let data = [
			["biz_server", getServerId()],
			["biz_name", safeBusinessName],
			["biz_owner_type", tempBusinessData.ownerType],
			["biz_owner_id", tempBusinessData.ownerId],
			["biz_locked", boolToInt(tempBusinessData.locked)],
			["biz_entrance_fee", tempBusinessData.entranceFee],
			["biz_till", tempBusinessData.till],
			["biz_entrance_pos_x", tempBusinessData.entrancePosition.x],
			["biz_entrance_pos_y", tempBusinessData.entrancePosition.y],
			["biz_entrance_pos_z", tempBusinessData.entrancePosition.z],
			["biz_entrance_rot_z", tempBusinessData.entranceRotation],
			["biz_entrance_int", tempBusinessData.entranceInterior],
			["biz_entrance_vw", tempBusinessData.entranceDimension],
			["biz_entrance_pickup", tempBusinessData.entrancePickupModel],
			["biz_entrance_blip", tempBusinessData.entranceBlipModel],
			["biz_entrance_cutscene", tempBusinessData.entranceCutscene],
			["biz_exit_pos_x", tempBusinessData.exitPosition.x],
			["biz_exit_pos_y", tempBusinessData.exitPosition.y],
			["biz_exit_pos_z", tempBusinessData.exitPosition.z],
			["biz_exit_rot_z", tempBusinessData.exitRotation],
			["biz_exit_int", tempBusinessData.exitInterior],
			["biz_exit_vw", tempBusinessData.exitDimension],
			["biz_exit_pickup", tempBusinessData.exitPickupModel],
			["biz_exit_blip", tempBusinessData.exitBlipModel],
			["biz_exit_cutscene", tempBusinessData.exitCutscene],
			["biz_has_interior", boolToInt(tempBusinessData.hasInterior)],
			["biz_interior_lights", boolToInt(tempBusinessData.interiorLights)],
			["biz_label_help_type", tempBusinessData.labelHelpType],
			["biz_radiostation", tempBusinessData.streamingRadioStation],
			["biz_custom_interior", boolToInt(tempBusinessData.customInterior)],
			["biz_buy_price", boolToInt(tempBusinessData.buyPrice)],
			//["biz_rent_price", boolToInt(tempBusinessData.rentPrice)],
		];

		let dbQuery = null;
		if (tempBusinessData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("biz_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			getServerData().businesses[businessId].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("biz_main", data, `biz_id=${tempBusinessData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		getBusinessData(businessId).needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Business]: Saved business '${tempBusinessData.name}' to database!`);

	return false;
}

// ===========================================================================

/**
 * Creates all server pickups for all businesses
 *
 * @return {Boolean} Whether or not the server pickups were created
 *
 */
function createAllBusinessPickups() {
	if (!getServerConfig().createBusinessPickups) {
		return false;
	}

	if (!isGameFeatureSupported("pickups")) {
		return false;
	}

	for (let i in getServerData().businesses) {
		createBusinessEntrancePickup(i);
		createBusinessExitPickup(i);
		updateBusinessPickupLabelData(i);
	}

	return true;
}

// ===========================================================================

/**
 * Creates all server blips for all businesses
 *
 * @return {Boolean} Whether or not the server blips were created
 *
 */
function createAllBusinessBlips() {
	if (!getServerConfig().createBusinessBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blips")) {
		return false;
	}

	for (let i in getServerData().businesses) {
		createBusinessEntranceBlip(i);
		createBusinessExitBlip(i);
	}
}

// ===========================================================================

/**
 * Creates the entrance pickup for a business by data index
 *
 * @param {Number} businessId - The data index of the business to create the pickup for
 * @return {Boolean} Whether or not the blip was created
 *
 */
function createBusinessEntrancePickup(businessId) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!getServerConfig().createBusinessPickups) {
		return false;
	}

	if (!isGameFeatureSupported("pickups")) {
		return false;
	}

	let businessData = getBusinessData(businessId);

	//if(businessData.hasInterior) {
	//	return false;
	//}

	if (businessData.entrancePickupModel == -1) {
		return false;
	}

	let pickupModelId = getGameConfig().pickupModels[getGame()].Business;

	if (businessData.entrancePickupModel != 0) {
		pickupModelId = businessData.entrancePickupModel;
	}

	logToConsole(LOG_VERBOSE, `[VRR.Job]: Creating entrance pickup for business ${businessData.name} (model ${pickupModelId})`);

	if (areServerElementsSupported()) {
		let entrancePickup = createGamePickup(pickupModelId, businessData.entrancePosition, getGameConfig().pickupTypes[getGame()].business);
		if (entrancePickup != null) {
			if (businessData.entranceDimension != -1) {
				setElementDimension(entrancePickup, businessData.entranceDimension);
				setElementOnAllDimensions(entrancePickup, false);
			} else {
				setElementOnAllDimensions(entrancePickup, true);
			}

			if (getGlobalConfig().businessPickupStreamInDistance == -1 || getGlobalConfig().businessPickupStreamOutDistance == -1) {
				entrancePickup.netFlags.distanceStreaming = false;
			} else {
				setElementStreamInDistance(entrancePickup, getGlobalConfig().businessPickupStreamInDistance);
				setElementStreamOutDistance(entrancePickup, getGlobalConfig().businessPickupStreamOutDistance);
			}
			setElementTransient(entrancePickup, false);
			getBusinessData(businessId).entrancePickup = entrancePickup;
			updateBusinessPickupLabelData(businessId);
		}
	} else {
		let pickupModelId = getGameConfig().pickupModels[getGame()].Business;

		if (businessData.entrancePickupModel != 0) {
			pickupModelId = businessData.entrancePickupModel;
		}
		sendBusinessToPlayer(null, businessId, businessData.name, businessData.entrancePosition, blipModelId, pickupModelId, businessData.hasInterior, doesBusinessHaveAnyItemsToBuy(businessId));
	}

	return false;
}

// ===========================================================================

/**
 * Creates the entrance pickup for a business by data index
 *
 * @param {Number} businessId - The data index of the business to create the entrance pickup for
 * @return {Boolean} Whether or not the blip was created
 *
 */
function createBusinessEntranceBlip(businessId) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!getServerConfig().createBusinessBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blips")) {
		return false;
	}

	let businessData = getBusinessData(businessId);

	//if(businessData.hasInterior) {
	//	return false;
	//}

	if (businessData.entranceBlipModel == -1) {
		return false;
	}

	let blipModelId = getGameConfig().blipSprites[getGame()].Business;

	if (businessData.entranceBlipModel != 0) {
		blipModelId = businessData.entranceBlipModel;
	}

	logToConsole(LOG_VERBOSE, `[VRR.Job]: Creating entrance blip for business ${businessData.name} (model ${blipModelId})`);

	if (areServerElementsSupported()) {
		let entranceBlip = createGameBlip(businessData.entrancePosition, blipModelId, 1, getColourByType("businessBlue"));
		if (entranceBlip != null) {
			if (businessData.entranceDimension != -1) {
				setElementDimension(entranceBlip, businessData.entranceDimension);
				setElementOnAllDimensions(entranceBlip, false);
			} else {
				setElementOnAllDimensions(entranceBlip, true);
			}

			if (getGlobalConfig().businessBlipStreamInDistance == -1 || getGlobalConfig().businessBlipStreamOutDistance == -1) {
				entranceBlip.netFlags.distanceStreaming = false;
			} else {
				setElementStreamInDistance(entranceBlip, getGlobalConfig().businessBlipStreamInDistance);
				setElementStreamOutDistance(entranceBlip, getGlobalConfig().businessBlipStreamOutDistance);
			}
			setElementTransient(entranceBlip, false);
			businessData.entranceBlip = entranceBlip;
		}
	}
}

// ===========================================================================

/**
 * Creates the exit pickup for a business by data index
 *
 * @param {Number} businessId - The data index of the business to create the exit pickup for
 * @return {Boolean} Whether or not the pickup was created
 *
 */
function createBusinessExitPickup(businessId) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!getServerConfig().createBusinessPickups) {
		return false;
	}

	if (!isGameFeatureSupported("pickups")) {
		return false;
	}

	let businessData = getBusinessData(businessId);

	//if(!businessData.hasInterior) {
	//	return false;
	//}

	if (businessData.exitPickupModel == -1) {
		return false;
	}

	let pickupModelId = getGameConfig().pickupModels[getGame()].Exit;

	if (businessData.exitPickupModel != 0) {
		pickupModelId = businessData.exitPickupModel;
	}

	logToConsole(LOG_VERBOSE, `[VRR.Job]: Creating exit pickup for business ${businessData.name} (model ${pickupModelId})`);

	let exitPickup = createGamePickup(pickupModelId, businessData.exitPosition, getGameConfig().pickupTypes[getGame()].business);
	if (exitPickup != null) {
		if (businessData.exitDimension != -1) {
			setElementDimension(exitPickup, businessData.exitDimension);
			setElementOnAllDimensions(exitPickup, false);
		} else {
			setElementOnAllDimensions(exitPickup, true);
		}

		if (getGlobalConfig().businessPickupStreamInDistance == -1 || getGlobalConfig().businessPickupStreamOutDistance == -1) {
			exitPickup.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(exitPickup, getGlobalConfig().businessPickupStreamInDistance);
			setElementStreamOutDistance(exitPickup, getGlobalConfig().businessPickupStreamOutDistance);
		}
		setElementTransient(exitPickup, false);
		getBusinessData(businessId).exitPickup = exitPickup;
		updateBusinessPickupLabelData(businessId);
	}
}

// ===========================================================================

/**
 * Creates the exit blip for a business by data index
 *
 * @param {Number} businessId - The data index of the business to create the exit blip for
 * @return {Boolean} Whether or not the blip was created
 *
 */
function createBusinessExitBlip(businessId) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!getServerConfig().createBusinessBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blips")) {
		return false;
	}

	let businessData = getBusinessData(businessId);

	//if(!businessData.hasInterior) {
	//	return false;
	//}

	if (businessData.exitBlipModel == -1) {
		return false;
	}

	let blipModelId = getGameConfig().blipSprites[getGame()].Business;

	if (businessData.exitBlipModel != 0) {
		blipModelId = businessData.exitBlipModel;
	}

	logToConsole(LOG_VERBOSE, `[VRR.Job]: Creating exit blip for business ${businessData.name} (model ${blipModelId})`);

	let exitBlip = createGameBlip(businessData.exitPosition, blipModelId, 1, getColourByName("businessBlue"));
	if (exitBlip != null) {
		if (businessData.exitDimension != -1) {
			setElementDimension(exitBlip, businessData.exitDimension);
			setElementOnAllDimensions(exitBlip, false);
		} else {
			setElementOnAllDimensions(exitBlip, true);
		}

		if (getGlobalConfig().businessBlipStreamInDistance == -1 || getGlobalConfig().businessBlipStreamOutDistance == -1) {
			exitBlip.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(exitBlip, getGlobalConfig().businessBlipStreamInDistance);
			setElementStreamOutDistance(exitBlip, getGlobalConfig().businessBlipStreamOutDistance);
		}
		setElementTransient(exitBlip, false);
		businessData.exitBlip = exitBlip;
	}
}

// ===========================================================================

/**
 * Deletes a business data and removes it from the database by data index
 *
 * @param {Number} businessId - The data index of the business to delete
 * @return {Boolean} Whether or not the business was deleted
 *
 */
function deleteBusiness(businessId, whoDeleted = 0) {
	let tempBusinessData = getServerData().businesses[businessId];

	let dbConnection = connectToDatabase();
	let dbQuery = null;

	deleteBusinessBlips(businessId);
	deleteBusinessPickups(businessId);

	if (dbConnection) {
		dbQuery = queryDatabase(dbConnection, `UPDATE biz_main WHERE biz_deleted = 1, biz_when_deleted = UNIX_TIMESTAMP(), biz_who_deleted = ${whoDeleted} WHERE biz_id ${tempBusinessData.databaseId}`);
		if (dbQuery) {
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	removePlayersFromBusiness(businessId);

	getServerData().businesses.splice(businessId, 1);

	return true;
}

// ===========================================================================

/**
 * Forces all players to exit a business
 *
 * @param {Number} businessId - The data index of the business to force all players inside to exit from
 * @return {Boolean} Whether or not the players were forced to exit
 *
 */
function removePlayersFromBusiness(businessId) {
	getClients().forEach(function (client) {
		if (doesBusinessHaveInterior(businessId)) {
			if (getPlayerBusiness(client) == businessId) {
				exitBusiness(client);
			}
		}
	});

	return true;
}

// ===========================================================================

/**
 * Forces a player to exit a business
 *
 * @param {Client} client - The client to force to exit the business
 * @return {Boolean} Whether or not the player was forced to exit
 *
 */
function removePlayerFromBusiness(client) {
	exitBusiness(client);
	return false;
}

// ===========================================================================

/**
 * Handles a player exiting a business
 *
 * @param {Client} client - The client to force to exit the business
 * @return {Boolean} Whether or not the player successfully exited the business
 *
 */
function exitBusiness(client) {
	let businessId = getPlayerBusiness(client);

	if (businessId == false) {
		return false;
	}

	if (isPlayerSpawned(client)) {
		setPlayerInterior(client, getServerData().businesses[businessId].entranceInterior);
		setPlayerDimension(client, getServerData().businesses[businessId].entranceDimension);
		setPlayerPosition(client, getServerData().businesses[businessId].entrancePosition);
		return true;
	}

	return false;
}

// ===========================================================================

/**
 * Gets the name of the type of a business owner by type ID
 *
 * @param {Number} ownerType - The business owner type ID
 * @return {String} Name of the business owner type
 *
 */
function getBusinessOwnerTypeText(ownerType) {
	switch (ownerType) {
		case VRR_BIZOWNER_CLAN:
			return "clan";

		case VRR_BIZOWNER_JOB:
			return "job";

		case VRR_BIZOWNER_PLAYER:
			return "player";

		case VRR_BIZOWNER_NONE:
		case VRR_BIZOWNER_PUBLIC:
			return "not owned";

		default:
			return "unknown";
	}
}

// ===========================================================================

/**
 * @param {number} businessId - The data index of the business
 * @return {BusinessData} The business's data (class instance)
 */
function getBusinessData(businessId) {
	if (typeof getServerData().businesses[businessId] != null) {
		return getServerData().businesses[businessId];
	}
	return false;
}

// ===========================================================================

/**
 *
 * @param {Number} businessId - The data index of the business
 * @returns {Boolean} Whether or not the business has an interior
 */
function doesBusinessHaveInterior(businessId) {
	return getBusinessData(businessId).hasInterior;
}

// ===========================================================================

/**
 *
 * @param {Number} businessId - The data index of the business
 * @returns {Boolean} Whether or not the entrance pickup of the business was deleted
 */
function deleteBusinessEntrancePickup(businessId) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!isGameFeatureSupported("pickups")) {
		return false;
	}

	if (getBusinessData(businessId).entrancePickup != null) {
		//removeFromWorld(getBusinessData(businessId).entrancePickup);
		deleteGameElement(getBusinessData(businessId).entrancePickup);
		getBusinessData(businessId).entrancePickup = null;

		return true;
	}

	return false;
}

// ===========================================================================

/**
 *
 * @param {Number} businessId - The data index of the business
 * @returns {Boolean} Whether or not the exit pickup of the business was deleted
 */
function deleteBusinessExitPickup(businessId) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!isGameFeatureSupported("pickups")) {
		return false;
	}

	if (getBusinessData(businessId).exitPickup != null) {
		//removeFromWorld(getBusinessData(businessId).exitPickup);
		deleteGameElement(getBusinessData(businessId).exitPickup);
		getBusinessData(businessId).exitPickup = null;
	}
}

// ===========================================================================

/**
 *
 * @param {Number} businessId - The data index of the business
 * @returns {Boolean} Whether or not the entrance blip of the business was deleted
 */
function deleteBusinessEntranceBlip(businessId) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!isGameFeatureSupported("blips")) {
		return false;
	}

	if (getBusinessData(businessId).entranceBlip != null) {
		//removeFromWorld(getBusinessData(businessId).entranceBlip);
		deleteGameElement(getBusinessData(businessId).entranceBlip);
		getBusinessData(businessId).entranceBlip = null;
	}
}

// ===========================================================================

/**
 *
 * @param {Number} businessId - The data index of the business
 * @returns {Boolean} Whether or not the exit blip of the business was deleted
 */
function deleteBusinessExitBlip(businessId) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	if (getBusinessData(businessId).exitBlip != null) {
		//removeFromWorld(getBusinessData(businessId).exitBlip);
		deleteGameElement(getBusinessData(businessId).exitBlip);
		getBusinessData(businessId).exitBlip = null;
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
function reloadAllBusinessesCommand(command, params, client) {
	let clients = getClients();
	for (let i in clients) {
		removePlayerFromBusiness(clients[i]);
	}

	for (let i in getServerData().businesses) {
		deleteBusinessExitBlip(i);
		deleteBusinessEntranceBlip(i);
		deleteBusinessExitPickup(i);
		deleteBusinessEntrancePickup(i);
	}

	//forceAllPlayersToStopWorking();
	clearArray(getServerData().businesses);
	getServerData().businesses = loadBusinessesFromDatabase();
	createAllBusinessPickups();
	createAllBusinessBlips();
	setBusinessDataIndexes();
	cacheAllBusinessItems();

	announceAdminAction(`AllBusinessesReloaded`);
}

// ===========================================================================

/**
 * Sets the indexes of all businesses
 *
 * @returns {Boolean} Whether or not the exit blip of the business was deleted
 */
function setBusinessDataIndexes() {
	for (let i in getServerData().businesses) {
		getServerData().businesses[i].index = i;
	}
}

// ===========================================================================

// Adds an item to a business inventory by item type, amount and buy price
function addToBusinessInventory(businessId, itemType, amount, buyPrice) {
	let tempItemData = new ItemData(false);
	tempItemData.amount = amount;
	tempItemData.buyPrice = buyPrice;
	tempItemData.itemType = getItemTypeData(itemType).databaseId;
	tempItemData.ownerId = getBusinessData(business).databaseId;
	tempItemData.ownerType = VRR_ITEMOWNER_BIZ;
	tempItemData.ownerIndex = businessId;
	tempItemData.itemTypeIndex = itemType;
	saveItemToDatabase(tempItemData);
	getServerData().items.push(tempItemData);

	let index = getServerData().items.length - 1;
	getServerData().items[index].index = index;
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
function buyFromBusinessCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (areParamsEmpty(params)) {
		showBusinessFloorInventoryToPlayer(client, businessId);
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (getBusinessData(businessId).locked) {
		messagePlayerError(client, `This business is closed!`);
		return false;
	}

	if (getBusinessData(businessId).hasInterior) {
		if (!getPlayerBusiness(client)) {
			if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "enter")) {
				messagePlayerTip(client, getLocaleString(client, "NeedToEnterPropertyKeyPress", "business", `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "enter")).key)}{MAINCOLOUR}`));
			} else {
				messagePlayerNormal(client, getLocaleString(client, "NeedToEnterBusinessCommand", "business", "{ALTCOLOUR}/enter{MAINCOLOUR}"));
			}
			return false;
		}
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 1;

	if (typeof getBusinessData(businessId).floorItemCache[itemSlot - 1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if (getBusinessData(businessId).floorItemCache[itemSlot - 1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let amount = 1;
	if (areThereEnoughParams(params, 2, " ")) {
		amount = toInteger(getParam(params, " ", 2)) || 1;
		if (amount <= 0) {
			messagePlayerError(client, getLocaleString(client, "AmountMustBeMoreThan", "0"));
			return false;
		}
	}

	if (getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).amount < amount) {
		messagePlayerError(client, `There are only ${getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).amount} ${getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).itemTypeIndex).name} in slot ${itemSlot - 1}`);
		return false;
	}

	let firstSlot = getPlayerFirstEmptyHotBarSlot(client);
	if (firstSlot == -1) {
		messagePlayerError(client, messagePlayerError(client, getLocaleString(client, "InventoryFullCantCarry")));
		return false;
	}

	let totalCost = getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).buyPrice * amount;
	let itemName = getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).itemTypeIndex).name;

	if (getPlayerCurrentSubAccount(client).cash < totalCost) {
		messagePlayerError(client, getLocaleString(client, "NotEnoughCashNeedAmountMore", `{ALTCOLOUR}${getBusinessData(businessId).floorItemCache[itemSlot - 1].buyPrice * amount - getPlayerCurrentSubAccount(client).cash}{MAINCOLOUR}`));
		return false;
	}

	takePlayerCash(client, totalCost);
	createItem(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).itemTypeIndex, getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).value, VRR_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId, amount);
	cachePlayerHotBarItems(client);
	getBusinessData(businessId).till = getBusinessData(businessId).till + totalCost;

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).amount = getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).amount - amount;
	if (getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).amount == 0) {
		destroyItem(getBusinessData(businessId).floorItemCache[itemSlot - 1]);
	}

	let useType = getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).itemTypeIndex).useType;
	if (useType == VRR_ITEM_USETYPE_WEAPON || VRR_ITEM_USETYPE_TAZER || useType == VRR_ITEM_USETYPE_AMMO_CLIP) {
		if (isPlayerWeaponBanned(client) && !isPlayerExemptFromAntiCheat(client)) {
			messagePlayerError(client, getLocaleString(client, "WeaponBanned"));
			return false;
		}
	}

	//messagePlayerSuccess(client, `You bought ${amount} {ALTCOLOUR}${itemName} {MAINCOLOUR}for ${totalCost} ${priceEach}`);
	meActionToNearbyPlayers(client, `buys a ${itemName}`);

	if (doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand("inv")) {
		let keyData = getPlayerKeyBindForCommand("inv");
		messagePlayerNewbieTip(client, getLocaleString(client, "ViewInventoryKeyPressTip", `{ALTCOLOUR}${getKeyNameFromId(keyData.key)}{MAINCOLOUR}`));
	} else {
		messagePlayerNewbieTip(client, getLocaleString(client, "ViewInventoryCommandTip", `{ALTCOLOUR}/inv{MAINCOLOUR}`));
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
function setBusinessItemSellPriceCommand(command, params, client) {
	let businessId = getBusinessFromParams(getParam(params, " ", 3)) || getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 0;

	if (typeof getBusinessData(businessId).floorItemCache[itemSlot - 1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot - 1} doesn't exist!`);
		return false;
	}

	if (getBusinessData(businessId).floorItemCache[itemSlot - 1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot - 1} slot is empty!`);
		return false;
	}

	let oldPrice = getBusinessData(businessId).floorItemCache[itemSlot - 1].buyPrice;
	let newPrice = toInteger(getParam(params, " ", 2)) || oldPrice;
	if (newPrice < 0) {
		messagePlayerError(client, "The price can't be negative!");
		return false;
	}

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).buyPrice = newPrice;

	messagePlayerSuccess(client, `You changed the price of the {ALTCOLOUR}${getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).itemTypeIndex).name}'s {MAINCOLOUR}in slot {ALTCOLOUR}${itemSlot} {MAINCOLOUR}from $${makeLargeNumberReadable(oldPrice)} to $${makeLargeNumberReadable(newprice)}`);
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
function storeItemInBusinessStorageCommand(command, params, client) {
	let businessId = getBusinessFromParams(getParam(params, " ", 3)) || getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 0;

	if (typeof getBusinessData(businessId).floorItemCache[itemSlot - 1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if (getBusinessData(businessId).floorItemCache[itemSlot - 1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let firstSlot = getBusinessStorageFirstFreeItemSlot(businessId);

	if (firstSlot == -1) {
		messagePlayerError(client, `There isn't any room in this business storage`);
		return false;
	}

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).ownerType = VRR_ITEM_OWNER_BIZSTORAGE;
	getBusinessData(businessId).storageItemCache[firstSlot] = getBusinessData(businessId).floorItemCache[itemSlot - 1];
	getBusinessData(businessId).storageItemCache[itemSlot - 1] = -1;
	messagePlayerSuccess(client, `You moved the ${getItemTypeData(getItemData(getBusinessData(businessId).storageItemCache[firstSlot]).itemTypeIndex).name}s in slot ${itemSlot} to the business storage in slot ${firstSlot}`);
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
function stockItemOnBusinessFloorCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 0;

	if (typeof getBusinessData(businessId).storageItemCache[itemSlot - 1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if (getBusinessData(businessId).storageItemCache[itemSlot - 1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let firstSlot = getBusinessFloorFirstFreeItemSlot(businessId);

	if (firstSlot == -1) {
		messagePlayerError(client, `There isn't any room in this business storage`);
		return false;
	}

	getItemData(getBusinessData(businessId).storageItemCache[itemSlot - 1]).ownerType = VRR_ITEM_OWNER_BIZFLOOR;
	getBusinessData(businessId).floorItemCache[firstSlot] = getBusinessData(businessId).storageItemCache[itemSlot - 1];
	getBusinessData(businessId).storageItemCache[itemSlot - 1] = -1;
	messagePlayerSuccess(client, `You moved the ${getItemTypeData(getItemData(getBusinessData(businessId).storageItemCache[firstSlot]).itemTypeIndex).name}s in slot ${itemSlot} of the business storage to the business floor slot ${firstSlot}`);
}

// ===========================================================================

// Gets the first free slot in a business's storage items
function getBusinessStorageFirstFreeItemSlot(businessId) {
	return getBusinessData(businessId).storageItemCache.findIndex(item => item == -1);
}

// ===========================================================================

// Gets the first free slot in a business's floor items
function getBusinessFloorFirstFreeItemSlot(businessId) {
	return getBusinessData(businessId).floorItemCache.findIndex(item => item == -1);
}

// ===========================================================================

// Caches all items for all businesses
function cacheAllBusinessItems() {
	logToConsole(LOG_DEBUG, "[VRR.Business] Caching all business items ...");
	for (let i in getServerData().businesses) {
		cacheBusinessItems(i);
	}
	logToConsole(LOG_DEBUG, "[VRR.Business] Cached all business items successfully!");
}

// ===========================================================================

// Caches all items for a business by businessId
function cacheBusinessItems(businessId) {
	clearArray(getBusinessData(businessId).floorItemCache);
	clearArray(getBusinessData(businessId).storageItemCache);

	//let businessData = getBusinessData(businessId);
	//logToConsole(LOG_VERBOSE, `[VRR.Business] Caching business items for business ${businessId} (${businessData.name}) ...`);
	//getBusinessData(businessId).floorItemCache = getServerData().items.filter(item => item.ownerType == VRR_ITEM_OWNER_BIZFLOOR && item.ownerId == businessData.databaseId).map(i => i.index);
	//getBusinessData(businessId).storageItemCache = getServerData().items.filter(item => item.ownerType == VRR_ITEM_OWNER_BIZSTORAGE && item.ownerId == businessData.databaseId);

	logToConsole(LOG_VERBOSE, `[VRR.Business] Caching business items for business ${businessId} (${getBusinessData(businessId).name}) ...`);
	for (let i in getServerData().items) {
		if (getItemData(i).ownerType == VRR_ITEM_OWNER_BIZFLOOR && getItemData(i).ownerId == getBusinessData(businessId).databaseId) {
			getBusinessData(businessId).floorItemCache.push(i);
		} else if (getItemData(i).ownerType == VRR_ITEM_OWNER_BIZSTORAGE && getItemData(i).ownerId == getBusinessData(businessId).databaseId) {
			getBusinessData(businessId).storageItemCache.push(i);
		}
	}

	logToConsole(LOG_VERBOSE, `[VRR.Business] Successfully cached ${getBusinessData(businessId).floorItemCache.length} floor items and ${getBusinessData(businessId).storageItemCache} storage items for business ${businessId} (${getBusinessData(businessId).name})!`);
}

// ===========================================================================

// Gets a business's data index from a business's databaseId
function getBusinessIdFromDatabaseId(databaseId) {
	return getServerData().businesses.findIndex(business => business.databaseId == databaseId);
}

// ===========================================================================

// Updates all pickup data for a business by businessId
function updateBusinessPickupLabelData(businessId) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (getBusinessData(businessId).exitPickup != null) {
		setEntityData(getBusinessData(businessId).exitPickup, "vrr.owner.type", VRR_PICKUP_BUSINESS_EXIT, false);
		setEntityData(getBusinessData(businessId).exitPickup, "vrr.owner.id", businessId, false);
		setEntityData(getBusinessData(businessId).exitPickup, "vrr.label.type", VRR_LABEL_EXIT, true);
	}

	if (getBusinessData(businessId).entrancePickup != null) {
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.owner.type", VRR_PICKUP_BUSINESS_ENTRANCE, false);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.owner.id", businessId, false);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.type", VRR_LABEL_BUSINESS, true);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.name", getBusinessData(businessId).name, true);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.locked", getBusinessData(businessId).locked, true);
		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_NONE, true);

		switch (getBusinessData(businessId).labelHelpType) {
			case VRR_PROPLABEL_INFO_ENTERVEHICLE: {
				setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_ENTERVEHICLE, true);
				break;
			}

			case VRR_PROPLABEL_INFO_ENTER: {
				setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_ENTER, true);
				break;
			}

			case VRR_PROPLABEL_INFO_REPAIR: {
				setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_REPAIR, true);
				break;
			}

			default: {
				if (getBusinessData(businessId).hasInterior) {
					setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_ENTER, true);
				} else {
					if (doesBusinessHaveAnyItemsToBuy(businessId)) {
						setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_BUY, true);
					} else {
						removeEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.help");
					}
				}
				break;
			}
		}

		setEntityData(getBusinessData(businessId).entrancePickup, "vrr.label.price", getBusinessData(businessId).buyPrice, true);
	}
}

// ===========================================================================

function resetBusinessPickups(businessId) {
	deleteBusinessPickups(businessId);
	createBusinessEntrancePickup(businessId);
	createBusinessExitPickup(businessId);
}

// ===========================================================================

function resetBusinessBlips(businessId) {
	deleteBusinessBlips(businessId);
	createBusinessEntranceBlip(businessId);
	createBusinessExitBlip(businessId);
}

// ===========================================================================

function resetAllBusinessPickups(businessId) {
	deleteBusinessPickups(businessId);
	createBusinessEntrancePickup(businessId);
	createBusinessExitPickup(businessId);
}

// ===========================================================================

function resetAllBusinessBlips() {
	for (let i in getServerData().businesses) {
		deleteBusinessBlips(i);
		createBusinessBlips(i);
	}
}

// ===========================================================================

function createBusinessBlips(businessId) {
	createBusinessEntranceBlip(businessId);
	createBusinessExitBlip(businessId);
}

// ===========================================================================

function resetAllBusinessPickups() {
	for (let i in getServerData().businesses) {
		deleteBusinessPickups(i);
		createBusinessPickups(i);
	}
}

// ===========================================================================

function createBusinessPickups(businessId) {
	createBusinessEntrancePickup(businessId);
	createBusinessExitPickup(businessId);
}

// ===========================================================================

function doesBusinessHaveAnyItemsToBuy(businessId) {
	return (getBusinessData(businessId).floorItemCache.length > 0);
}

// ===========================================================================

//function sendPlayerBusinessGameScripts(client, businessId) {
//	for(let i in getBusinessData(businessId).gameScripts) {
//		sendPlayerGameScriptState(client, getBusinessData(businessId).gameScripts[i].state);
//	}
//}

// ===========================================================================

//function clearPlayerBusinessGameScripts(client, businessId) {
//	for(let i in getBusinessData(businessId).gameScripts) {
//		sendPlayerGameScriptState(client, VRR_GAMESCRIPT_DENY);
//	}
//}

// ===========================================================================

function updateBusinessInteriorLightsForOccupants(businessId) {
	let clients = getClients()
	for (let i in clients) {
		if (getPlayerBusiness(clients[i]) == businessId) {
			updateInteriorLightsForPlayer(clients[i], getBusinessData(businessId).interiorLights);
		}
	}
}

// ===========================================================================

function canPlayerWithdrawFromBusinessTill(client, businessId) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == VRR_BIZOWNER_PLAYER && getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == VRR_BIZOWNER_CLAN && getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBusinesses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerSetBusinessInteriorLights(client, businessId) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == VRR_BIZOWNER_PLAYER && getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == VRR_BIZOWNER_CLAN && getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBusinesses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerLockUnlockBusiness(client, businessId) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == VRR_BIZOWNER_PLAYER && getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == VRR_BIZOWNER_CLAN && getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBusinesses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerManageBusiness(client, businessId) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == VRR_BIZOWNER_PLAYER) {
		if (getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if (getBusinessData(businessId).ownerType == VRR_BIZOWNER_CLAN) {
		if (getBusinessData(businessId).ownerId == getPlayerClan(client)) {
			if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBusinesses"))) {
				return true;
			}

			//if(getBusinessData(businessId).clanRank <= getClanRankData(getPlayerClan(client), getPlayerClanRank(client)).level) {
			//	return true;
			//}
		}
	}

	return false;
}

// ===========================================================================

function deleteBusinessBlips(business) {
	deleteBusinessExitBlip(business);
	deleteBusinessEntranceBlip(business);
}

// ===========================================================================

function deleteBusinessPickups(business) {
	deleteBusinessExitPickup(business);
	deleteBusinessEntrancePickup(business);
}

// ===========================================================================

function getBusinessFromParams(params) {
	if (isNaN(params)) {
		for (let i in getServerData().businesses) {
			if (toLowerCase(getServerData().businesses[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof getServerData().businesses[params] != "undefined") {
			return toInteger(params);
		}
	}
	return false;
}

// ===========================================================================

function deleteAllBusinessBlips() {
	for (let i in getServerData().businesses) {
		deleteBusinessBlips(i);
	}
}

// ===========================================================================

function deleteAllBusinessPickups() {
	for (let i in getServerData().businesses) {
		deleteBusinessPickups(i);
	}
}

// ===========================================================================

function getBusinessFromInteriorAndDimension(dimension, interior) {
	let businesses = getServerData().businesses;
	for (let i in businesses) {
		if (businesses[i].exitInterior == interior && businesses[i].exitDimension == dimension) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function getClosestBusinessWithBuyableItemOfUseType(position, useType) {
	let availableBusinesses = getBusinessesWithBuyableItemOfUseType(useType);

	let closestBusiness = 0;
	for (let i in availableBusinesses) {
		if (getDistance(position, getBusinessData(availableBusinesses[i]).entrancePosition) < getDistance(position, getBusinessData(availableBusinesses[closestBusiness]).entrancePosition)) {
			closestBusiness = i;
		}
	}
	return availableBusinesses[closestBusiness];
}

// ===========================================================================

function getBusinessesWithBuyableItemOfUseType(useType) {
	let businesses = getServerData().businesses;
	for (let i in businesses) {
		if (doesBusinessHaveBuyableItemOfUseType(i, useType)) {
			availableBusinesses.push(i);
		}
	}

	return availableBusinesses;
}

// ===========================================================================

function doesBusinessHaveBuyableItemOfUseType(businessId, useType) {
	let floorItems = getBusinessData(businessId).floorItemCache;
	for (let i in floorItems) {
		if (floorItems[i] != -1) {
			if (getItemData(floorItems[i]) != false) {
				if (getItemTypeData(getItemData(floorItems[i])).useType == useType) {
					return true;
				}
			}
		}
	}
	return false;
}

// ===========================================================================