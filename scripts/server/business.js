// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: business.js
// DESC: Provides business functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Business Types
const V_BIZ_TYPE_NONE = 0;                     // None (invalid)
const V_BIZ_TYPE_NORMAL = 1;                   // Normal business (sells items)
const V_BIZ_TYPE_BANK = 2;                     // Bank
const V_BIZ_TYPE_PUBLIC = 3;                   // Public business (Government, public service, etc)
const V_BIZ_TYPE_PAINTBALL = 4;				  // Paintball arena. Player joins paintball/airsoft when they enter
const V_BIZ_TYPE_DEALERSHIP = 5;				  // Vehicle Dealership (also for airplane, boat, etc)

// ===========================================================================

// Business Location Types
const V_BIZ_LOC_NONE = 0;                       // None
const V_BIZ_LOC_GATE = 1;                       // Center of any moveable gate that belongs to the biz
const V_BIZ_LOC_GARAGE = 2;                     // Location for attached garage (pos1 = outside, pos2 = inside). Use pos to teleport or spawn veh/ped
const V_BIZ_LOC_FUEL = 3;                       // Fuel pump
const V_BIZ_LOC_DRIVETHRU = 4;                  // Drivethrough
const V_BIZ_LOC_VENDMACHINE = 5;                // Vending machine
const V_BIZ_LOC_ATM = 6;						// ATM
const V_BIZ_LOC_PAYPHONE = 7;				    // Payphone
const V_BIZ_LOC_MECHANIC_GARAGE = 8;			// Mechanic garage

// ===========================================================================

// Business Owner Types
const V_BIZ_OWNER_NONE = 0;                     // Not owned
const V_BIZ_OWNER_PLAYER = 1;                   // Owned by a player (character/subaccount)
const V_BIZ_OWNER_JOB = 2;                      // Owned by a job
const V_BIZ_OWNER_CLAN = 3;                     // Owned by a clan
const V_BIZ_OWNER_FACTION = 4;                  // Owned by a faction (not used at the moment)
const V_BIZ_OWNER_PUBLIC = 5;                   // Public Business. Used for goverment/official places like police, fire, city hall, DMV, etc

// ===========================================================================

/**
 * @class Representing a businesses' data. Loaded and saved in the database
 * @property {Array.<BusinessLocationData>} locations
 * @property {Array.<Number>} floorItemCache
 * @property {Array.<Number>} storageItemCache
 */
class BusinessData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.ownerType = V_BIZ_OWNER_NONE;
		this.ownerId = 0;
		this.buyPrice = 0;
		this.locked = false;
		this.hasInterior = false;
		this.index = -1;
		this.needsSaved = false;
		this.interiorLights = true;
		this.type = V_BIZ_TYPE_NONE;
		this.propertyType = V_PROPERTY_TYPE_BUSINESS;

		this.floorItemCache = [];
		this.storageItemCache = [];
		this.locations = [];
		//this.gameScripts = [];

		this.entrancePosition = toVector3(0.0, 0.0, 0.0);
		this.entranceRotation = 0.0;
		this.entranceInterior = 0;
		this.entranceDimension = 0;
		this.entrancePickupModel = -1;
		this.entranceBlipModel = -1;
		this.entrancePickup = null;
		this.entranceBlip = null;
		this.entranceScene = "";

		this.exitPosition = toVector3(0.0, 0.0, 0.0);
		this.exitRotation = 0.0;
		this.exitInterior = 0;
		this.exitDimension = 0;
		this.exitPickupModel = -1;
		this.exitBlipModel = -1;
		this.exitPickup = null;
		this.exitBlip = null;
		this.exitScene = "";

		this.entranceFee = 0;
		this.till = 0;

		this.streamingRadioStation = 0;
		this.streamingRadioStationIndex = -1;

		this.paintBallPlayers = [];

		this.labelHelpType = V_PROPLABEL_INFO_NONE;

		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["biz_id"]);
			this.name = toString(dbAssoc["biz_name"]);
			this.ownerType = toInteger(dbAssoc["biz_owner_type"]);
			this.ownerId = toInteger(dbAssoc["biz_owner_id"]);
			this.buyPrice = toInteger(dbAssoc["biz_buy_price"]);
			this.locked = intToBool(toInteger(dbAssoc["biz_locked"]));
			this.hasInterior = intToBool(toInteger(dbAssoc["biz_has_interior"]));
			this.interiorLights = intToBool(toInteger(dbAssoc["biz_interior_lights"]));
			this.type = toInteger(dbAssoc["biz_type"]);

			this.entrancePosition = toVector3(toFloat(dbAssoc["biz_entrance_pos_x"]), toFloat(dbAssoc["biz_entrance_pos_y"]), toFloat(dbAssoc["biz_entrance_pos_z"]));
			this.entranceRotation = toInteger(dbAssoc["biz_entrance_rot_z"]);
			this.entranceInterior = toInteger(dbAssoc["biz_entrance_int"]);
			this.entranceDimension = toInteger(dbAssoc["biz_entrance_vw"]);
			this.entrancePickupModel = toInteger(dbAssoc["biz_entrance_pickup"]);
			this.entranceBlipModel = toInteger(dbAssoc["biz_entrance_blip"]);
			this.entranceScene = toString(dbAssoc["biz_entrance_scene"]);

			this.exitPosition = toVector3(dbAssoc["biz_exit_pos_x"], dbAssoc["biz_exit_pos_y"], dbAssoc["biz_exit_pos_z"]);
			this.exitRotation = toInteger(dbAssoc["biz_exit_rot_z"]);
			this.exitInterior = toInteger(dbAssoc["biz_exit_int"]);
			this.exitDimension = toInteger(dbAssoc["biz_exit_vw"]);
			this.exitPickupModel = toInteger(dbAssoc["biz_exit_pickup"]);
			this.exitBlipModel = toInteger(dbAssoc["biz_exit_blip"]);
			this.exitScene = toString(dbAssoc["biz_exit_scene"]);

			this.entranceFee = toInteger(dbAssoc["biz_entrance_fee"]);
			this.till = toInteger(dbAssoc["biz_till"]);
			this.labelHelpType = toInteger(dbAssoc["biz_label_help_type"]);
			this.streamingRadioStation = toInteger(dbAssoc["biz_radio_station"]);
			this.whoAdded = toInteger(dbAssoc["biz_who_added"]);
			this.whenAdded = toInteger(dbAssoc["biz_when_added"]);
		}
	};
};

/**
 * @class Representing a business's location data. Multiple can be used for a single business. Used for things like doors, fuel pumps, drive thru positions, etc. Loaded and saved in the database
 */
class BusinessLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.type = 0;
		this.business = 0;
		this.enabled = false;
		this.index = -1;
		this.businessIndex = -1;
		this.needsSaved = false;

		this.position = toVector3(0.0, 0.0, 0.0);
		this.interior = 0;
		this.dimension = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["biz_loc_id"]);
			this.name = toString(dbAssoc["biz_loc_name"]);
			this.type = toInteger(dbAssoc["biz_loc_type"]);
			this.business = toInteger(dbAssoc["biz_loc_biz"]);
			this.enabled = intToBool(toInteger(dbAssoc["biz_loc_enabled"]));

			this.position = toVector3(toFloat(dbAssoc["biz_loc_pos_x"]), toFloat(dbAssoc["biz_loc_pos_y"]), toFloat(dbAssoc["biz_loc_pos_z"]));
			this.interior = toInteger(dbAssoc["biz_loc_int"]);
			this.dimension = toInteger(dbAssoc["biz_loc_vw"]);
		}
	}
};

/**
 * @class Representing a business's game scripts. Multiple can be used for a single business. Used for things like bar and club NPCs and other actions
 */
class BusinessGameScriptData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.business = 0;
		this.enabled = false;
		this.index = -1;
		this.businessIndex = -1;
		this.needsSaved = false;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["biz_script_id"]);
			this.name = toString(dbAssoc["biz_script_name"]);
			this.state = toInteger(dbAssoc["biz_script_state"]);
			this.business = toInteger(dbAssoc["biz_script_biz"]);
		}
	}
};

// ===========================================================================

function initBusinessScript() {
	logToConsole(LOG_INFO, "[V.RP.Business]: Initializing business script ...");
	logToConsole(LOG_INFO, "[V.RP.Business]: Business script initialized successfully!");
	return true;
}

// ===========================================================================

function loadBusinessFromId(businessId) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM biz_main WHERE biz_id = ${businessId} LIMIT 1;`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			return new BusinessData(dbAssoc[0]);
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function loadBusinessesFromDatabase() {
	logToConsole(LOG_INFO, "[V.RP.Business]: Loading businesses from database ...");

	let tempBusinesses = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM biz_main WHERE biz_deleted = 0 AND biz_server = ${getServerId()}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempBusinessData = new BusinessData(dbAssoc[i]);
				//tempBusinessData.locations = loadBusinessLocationsFromDatabase(tempBusinessData.databaseId);
				//tempBusinessData.gameScripts = loadBusinessGameScriptsFromDatabase(tempBusinessData.databaseId);
				tempBusinesses.push(tempBusinessData);
				logToConsole(LOG_VERBOSE, `[V.RP.Business]: Business '${tempBusinessData.name}' (ID ${tempBusinessData.databaseId}) loaded from database successfully!`);
			}
		}

		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[V.RP.Business]: ${tempBusinesses.length} businesses loaded from database successfully!`);
	return tempBusinesses;
}

// ===========================================================================

function loadBusinessLocationsFromDatabase(businessId) {
	logToConsole(LOG_VERBOSE, `[V.RP.Business]: Loading business locations for business ${businessId} from database ...`);

	let tempBusinessLocations = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];
	let dbQueryString = "";

	if (dbConnection) {
		dbQueryString = `SELECT * FROM biz_loc WHERE biz_loc_biz = ${businessId}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempBusinessLocationData = new BusinessLocationData(dbAssoc[i]);
				tempBusinessLocations.push(tempBusinessLocationData);
				logToConsole(LOG_VERBOSE, `[V.RP.Business]: Location '${tempBusinessLocationData.name}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_VERBOSE, `[V.RP.Business]: ${tempBusinessLocations.length} location for business ${businessId} loaded from database successfully!`);
	return tempBusinessLocations;
}

// ===========================================================================

/*
function loadBusinessGameScriptsFromDatabase(businessId) {
	logToConsole(LOG_VERBOSE, `[V.RP.Business]: Loading business game scripts for business ${businessId} from database ...`);

	let tempBusinessGameScripts = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc = [];
	let dbQueryString = "";

	if(dbConnection) {
		dbQueryString = `SELECT * FROM biz_script WHERE biz_script_biz = ${businessId}`;
			dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
			if (dbAssoc.length > 0) {
				for (let i in dbAssoc) {
					let tempBusinessGameScriptData = new BusinessGameScriptData(dbAssoc[i]);
					tempBusinessGameScripts.push(tempBusinessGameScriptData);
					logToConsole(LOG_VERBOSE, `[V.RP.Business]: Game script '${tempBusinessGameScriptData.name}' loaded from database successfully!`);
				}
			}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_VERBOSE, `[V.RP.Business]: ${tempBusinessGameScripts.length} game scripts for business ${businessId} loaded from database successfully!`);
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
	createBusiness(
		params,
		getPlayerPosition(client),
		toVector3(0.0, 0.0, 0.0),
		(isGameFeatureSupported("pickup")) ? gameData.pickupModels[getGame()].Business : -1,
		-1,
		getPlayerInterior(client),
		getPlayerDimension(client),
		getPlayerData(client).interiorScene,
		getPlayerData(client).accountData.databaseId
	);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created business: {businessBlue}${params}`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let tempBusinessLocationData = createBusinessLocation(locationType, businessId);
	serverData.businesses[businessId].push(tempBusinessLocationData);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created location {businessBlue}${params}{MAINCOLOUR} for business {businessBlue}${tempBusinessData.name}`, true);
}

// ===========================================================================

function createBusiness(name, entrancePosition, exitPosition, entrancePickupModel = -1, entranceBlipModel = -1, entranceInterior = 0, entranceDimension = 0, entranceScene = -1, whoAdded = defaultNoAccountId) {
	let tempBusinessData = new BusinessData(false);
	tempBusinessData.name = name;

	tempBusinessData.entrancePosition = entrancePosition;
	tempBusinessData.entranceRotation = 0.0;
	tempBusinessData.entrancePickupModel = entrancePickupModel;
	tempBusinessData.entranceBlipModel = entranceBlipModel;
	tempBusinessData.entranceInterior = entranceInterior;
	tempBusinessData.entranceDimension = entranceDimension;
	tempBusinessData.entranceScene = entranceScene;

	tempBusinessData.exitPosition = exitPosition;
	tempBusinessData.exitRotation = 0.0;
	tempBusinessData.exitPickupModel = 0;
	tempBusinessData.exitBlipModel = -1;
	tempBusinessData.exitInterior = 0;
	tempBusinessData.exitDimension = 0;
	tempBusinessData.exitScene = "";

	tempBusinessData.whoAdded = whoAdded;
	tempBusinessData.whenAdded = getCurrentUnixTimestamp();

	tempBusinessData.needsSaved = true;
	let businessId = serverData.businesses.push(tempBusinessData);
	setAllBusinessDataIndexes();
	saveAllBusinessesToDatabase();

	spawnBusinessPickups(businessId - 1);
	spawnBusinessBlips(businessId - 1);

	updateBusinessPickupLabelData(businessId - 1, false);

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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted business {businessBlue}${getBusinessData(businessId).name}`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	let oldBusinessName = getBusinessData(businessId).name;
	getBusinessData(businessId).name = newBusinessName;
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} renamed business {businessBlue}${oldBusinessName}{MAINCOLOUR} to {businessBlue}${newBusinessName}`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = V_BIZ_OWNER_PLAYER;
	getBusinessData(businessId).ownerId = getPlayerCurrentSubAccount(newBusinessOwner).databaseId;
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

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

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = V_BIZ_OWNER_JOB;
	getBusinessData(businessId).ownerId = getJobData(jobId).databaseId;
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

	messagePlayerSuccess(client, `{MAINCOLOUR}You set the owner of business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} to the {jobYellow}${getJobData(jobId).name}`);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (getBusinessData(businessId).ownerType != V_BIZ_OWNER_PLAYER) {
		messagePlayerError(client, getLocaleString(client, "MustOwnBusiness"));
		return false;
	}

	if (getBusinessData(businessId).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
		messagePlayerError(client, getLocaleString(client, "MustOwnBusiness"));
		return false;
	}

	// Use confirm prompt
	showPlayerPrompt(client, getLocaleString(client, "SetBusinessClanConfirmMessage"), getLocaleString(client, "SetBusinessClanConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = V_PROMPT_GIVEBIZTOCLAN;

	//getBusinessData(businessId).ownerType = V_BIZ_OWNER_CLAN;
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let rankId = params;

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	if (getVehicleData(vehicle).ownerType == V_VEH_OWNER_CLAN) {
		let clanId = getClanIndexFromDatabaseId(getBusinessData(businessId).ownerId);
		rankId = getClanRankFromParams(clanId, params);
		if (!getClanRankData(clanId, rankId)) {
			messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
			return false;
		}
		getBusinessData(businessId).rank = getClanRankData(clanId, rankId).databaseId;
		messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}rank to {ALTCOLOUR}${getClanRankData(clanId, rankId).name} {MAINCOLOUR}of the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan!`);
	} else if (getBusinessData(businessId).ownerType == V_VEH_OWNER_JOB) {
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let clanRankId = getClanRankFromParams(clanId, params);

	if (!getClanRankData(clanId, clanRankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	getBusinessData(businessId).ownerType = V_BIZ_OWNER_JOB;
	getBusinessData(businessId).ownerId = getJobData(jobId).databaseId;
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = V_BIZ_OWNER_PUBLIC;
	getBusinessData(businessId).ownerId = 0;
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).ownerType = V_BIZ_OWNER_NONE;
	getBusinessData(businessId).ownerId = -1;
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

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

	if (getBusinessData(businessId) == null) {
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	getBusinessData(businessId).entranceFee = entranceFee;
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

	messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} entrance fee to {ALTCOLOUR}${getCurrencyString(entranceFee)}`);
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
function setBusinessPaintBallCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	getBusinessData(businessId).type = V_BIZ_TYPE_PAINTBALL;
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

	messagePlayerSuccess(client, getLocaleString(client, "BusinessIsNowPaintBall"));
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
function setBusinessBankCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	getBusinessData(businessId).type = V_BIZ_TYPE_BANK;
	getBusinessData(businessId).labelHelpType == V_PROPLABEL_INFO_BANK;
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

	messagePlayerSuccess(client, getLocaleString(client, "BusinessIsNowBank"));
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let businessData = getBusinessData(businessId);

	let ownerName = "Unknown";
	switch (businessData.ownerType) {
		case V_BIZ_OWNER_CLAN:
			ownerName = getClanData(getClanIndexFromDatabaseId(businessData.ownerId)).name;
			break;

		case V_BIZ_OWNER_JOB:
			ownerName = getJobData(businessData.ownerId).name;
			break;

		case V_BIZ_OWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(businessData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			break;

		case V_BIZ_OWNER_PUBLIC:
			ownerName = "Public";
			break;

		case V_BIZ_OWNER_NONE:
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
		[`BuyPrice`, `${getCurrencyString(businessData.buyPrice)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(businessData.buyPrice))})`],
		//[`RentPrice`, `${businessData.rentPrice}`],
		[`HasInterior`, `${getYesNoFromBool(businessData.hasInterior)}`],
		[`CustomInterior`, `${getYesNoFromBool(businessData.customInterior)}`],
		[`HasBuyableItems`, `${getYesNoFromBool(doesBusinessHaveAnyItemsToBuy(businessId))}`],
		[`EntranceFee`, `${getCurrencyString(businessData.entranceFee)}`],
		[`InteriorLights`, `${getOnOffFromBool(businessData.interiorLights)}`],
		[`Balance`, `${getCurrencyString(businessData.till)}`],
		[`RadioStation`, `${(getRadioStationData(businessData.streamingRadioStationIndex) != null) ? getRadioStationData(businessData.streamingRadioStationIndex).name : "none"}`],
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

	if (getBusinessData(businessId) == null) {
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (isNaN(typeParam)) {
		if (isNull(gameData.pickupModels[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid pickup type! Use a pickup type name or a model ID");
			let pickupTypes = Object.keys(gameData.pickupModels[getGame()]);
			let chunkedList = splitArrayIntoChunks(pickupTypes, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPickupTypes")));
			for (let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getBusinessData(businessId).entrancePickupModel = gameData.pickupModels[getGame()][typeParam];
	} else {
		getBusinessData(businessId).entrancePickupModel = toInteger(typeParam);
	}

	resetBusinessPickups(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} pickup to {ALTCOLOUR}${typeParam}!`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (typeof gameData.interiors[getGame()] == "undefined") {
		messagePlayerError(client, `There are no interiors available for this game!`);
		return false;
	}

	if (isNaN(typeParam)) {
		if (toLowerCase(typeParam) == "none") {
			getBusinessData(businessId).exitPosition = toVector3(0.0, 0.0, 0.0);
			getBusinessData(businessId).exitDimension = 0;
			getBusinessData(businessId).exitInterior = -1;
			getBusinessData(businessId).hasInterior = false;
			getBusinessData(businessId).entranceScene = "";
			getBusinessData(businessId).exitScene = "";
			getBusinessData(businessId).exitPickupModel = -1;
			getBusinessData(businessId).customInterior = false;
			getBusinessData(businessId).exitScene = "";
			getBusinessData(businessId).entranceScene = "";
			messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} interior`, true);
			return false;
		}

		if (isNull(gameData.interiors[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid interior type! Use an interior type name");
			let interiorTypesList = Object.keys(gameData.interiors[getGame()]);
			let chunkedList = splitArrayIntoChunks(interiorTypesList, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderInteriorTypes")));
			for (let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getBusinessData(businessId).exitPosition = gameData.interiors[getGame()][typeParam][0];
		getBusinessData(businessId).exitInterior = gameData.interiors[getGame()][typeParam][1];
		getBusinessData(businessId).exitDimension = getBusinessData(businessId).databaseId + globalConfig.businessDimensionStart;
		getBusinessData(businessId).exitPickupModel = (isGameFeatureSupported("pickup")) ? gameData.pickupModels[getGame()].Exit : -1;
		getBusinessData(businessId).hasInterior = true;
		getBusinessData(businessId).customInterior = gameData.interiors[getGame()][typeParam][2];

		if (isGameFeatureSupported("interiorScene")) {
			getBusinessData(businessId).exitScene = typeParam;
			getBusinessData(businessId).entranceScene = getPlayerCurrentSubAccount(client).scene;
		}
	}

	//deleteBusinessExitPickup(businessId);
	//deleteBusinessExitBlip(businessId);
	//spawnBusinessExitBlip(businessId);
	//spawnBusinessExitPickup(businessId);

	resetBusinessPickups(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} interior type to {ALTCOLOUR}${typeParam}`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (typeof gameData.interiors[getGame()] == "undefined") {
		messagePlayerError(client, `There are no property templates available for this game!`);
		return false;
	}

	if (isNaN(propertyTemplateParam)) {
		if (isNull(gameData.interiors[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid interior type! Use an interior type name");
			let interiorTypesList = Object.keys(gameData.properties[getGame()]);
			let chunkedList = splitArrayIntoChunks(interiorTypesList, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPropertyTemplateTypes")));
			for (let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getBusinessData(businessId).exitPosition = gameData.interiors[getGame()][typeParam][0];
		getBusinessData(businessId).exitInterior = gameData.interiors[getGame()][typeParam][1];
		getBusinessData(businessId).exitDimension = getBusinessData(businessId).databaseId + globalConfig.businessDimensionStart;
		getBusinessData(businessId).exitPickupModel = gameData.pickupModels[getGame()].Exit;
		getBusinessData(businessId).hasInterior = true;
		getBusinessData(businessId).customInterior = gameData.interiors[getGame()][typeParam][2];
		getBusinessData(businessId).interiorScene = gameData.interiors[getGame()][typeParam][3];
	}

	//deleteBusinessExitPickup(businessId);
	//deleteBusinessExitBlip(businessId);
	//spawnBusinessExitBlip(businessId);
	//spawnBusinessExitPickup(businessId);

	resetBusinessPickups(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} property template to {ALTCOLOUR}${typeParam}`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (isNaN(typeParam)) {
		if (isNull(gameData.blipSprites[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid business type! Use a business type name or a blip image ID");

			let blipTypes = Object.keys(gameData.blipSprites[getGame()]);
			let chunkedList = splitArrayIntoChunks(blipTypes, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBlipTypes")));
			for (let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getBusinessData(businessId).entranceBlipModel = gameData.blipSprites[getGame()][typeParam];
	} else {
		getBusinessData(businessId).entranceBlipModel = toInteger(typeParam);
	}

	resetBusinessBlips(businessId);
	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} blip to {ALTCOLOUR}${typeParam}`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!isNaN(typeParam)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	saveBusinessToDatabase(businessId);

	if (isNull(gameData.defaultBusinessItems[getGame()][typeParam])) {
		messagePlayerError(client, "Invalid business items type! Use a business items type name");
		let businessItemTypes = Object.keys(gameData.defaultBusinessItems[getGame()]);
		let chunkedList = splitArrayIntoChunks(businessItemTypes, 10);

		messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderDefaultBusinessItemTypes")));
		for (let i in chunkedList) {
			messagePlayerInfo(client, chunkedList[i].join(", "));
		}
		return false;
	}

	for (let i in gameData.defaultBusinessItems[getGame()][typeParam]) {
		let itemTypeId = getItemTypeFromParams(gameData.defaultBusinessItems[getGame()][typeParam][i][0]);
		let itemTypeData = getItemTypeData(itemTypeId);
		if (itemTypeData) {
			let newItemIndex = createItem(itemTypeId, itemTypeData.orderValue, V_ITEM_OWNER_BIZFLOOR, getBusinessData(businessId).databaseId, gameData.defaultBusinessItems[getGame()][typeParam][i][1]);
			getItemData(newItemIndex).buyPrice = applyServerInflationMultiplier(itemTypeData.orderPrice) * gameData.defaultBusinessItems[getGame()][typeParam][i][2];
		}
	}

	cacheBusinessItems(businessId);
	updateBusinessPickupLabelData(businessId);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} gave business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} the default items for ${typeParam}`, true);
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
function setBusinessDealershipCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).labelHelpType == V_PROPLABEL_INFO_ENTERVEHICLE;
	getBusinessData(businessId).type = V_BIZ_TYPE_DEALERSHIP;
	updateBusinessPickupLabelData(businessId);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the type of business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} to dealership`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let tempCache = getBusinessData(businessId).floorItemCache;
	for (let i in tempCache) {
		deleteItem(tempCache[i], getPlayerData(client).accountData.databaseId, false);
	}

	cacheBusinessItems(businessId);
	setAllItemDataIndexes();

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted all on-sale items for business {businessBlue}${getBusinessData(businessId).name}`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	let tempCache = getBusinessData(businessId).storageItemCache;
	for (let i in tempCache) {
		deleteItem(tempCache[i], getPlayerData(client).accountData.databaseId, false);
	}

	cacheBusinessItems(businessId);
	setAllItemDataIndexes();

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted all storage items for business {businessBlue}${getBusinessData(businessId).name}`, true);
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

	if (getBusinessData(businessId) == null) {
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

	messagePlayerSuccess(client, `You withdrew ${getCurrencyString(amount)} from business {businessBlue}${getBusinessData(businessId).name} till`);
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

	if (getBusinessData(businessId) == null) {
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
	getBusinessData(businessId).needsSaved = true;
	updateBusinessPickupLabelData(businessId);

	messagePlayerSuccess(client, `{MAINCOLOUR}You set business {businessBlue}${getBusinessData(businessId).name}'s{MAINCOLOUR} for-sale price to {ALTCOLOUR}${getCurrencyString(amount)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(amount))})`);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	// Let anybody deposit money
	//if(!canPlayerManageBusiness(client, businessId)) {
	//	messagePlayerError(client, "You can't deposit cash into this business!");
	//	return false;
	//}

	if (getPlayerCurrentSubAccount(client).cash < amount) {
		messagePlayerError(client, `You don't have that much money! You only have ${getCurrencyString(getPlayerCurrentSubAccount(client).cash)}`);
		return false;
	}

	getBusinessData(businessId).till += amount;
	takePlayerCash(client, amount);
	updatePlayerCash(client);

	getBusinessData(businessId).needsSaved = true;
	messagePlayerSuccess(client, `You deposited ${getCurrencyString(amount)} into business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} till`);
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
		messagePlayerError(client, getLocaleString(client, "InvalidItemType"));
		messagePlayerInfo(client, `Use {ALTCOLOUR}/itemtypes{MAINCOLOUR} for a list of items`);
		return false;
	}
	let pricePerItem = getOrderPriceForItemType(itemType);

	let amount = toInteger(splitParams.slice(-2, -1)) || 1;
	let sellPrice = toInteger(splitParams.slice(-1)) || pricePerItem;
	//let value = getItemTypeData(itemType).orderValue;
	let businessId = getPlayerBusiness(client);

	logToConsole(LOG_DEBUG, `[V.RP.Business] ${getPlayerDisplayForConsole(client)} is ordering ${amount} ${splitParams.slice(0, -2).join(" ")}`);

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	let orderTotalCost = pricePerItem * amount;

	//getPlayerData(client).promptType = V_PROMPT_BIZORDER;
	getPlayerData(client).businessOrderAmount = amount;
	getPlayerData(client).businessOrderBusiness = businessId;
	getPlayerData(client).businessOrderItem = itemType;
	getPlayerData(client).businessOrderCost = orderTotalCost;
	getPlayerData(client).businessOrderSellPrice = sellPrice;
	getBusinessData(businessId).needsSaved = true;

	showPlayerPrompt(client, `Ordering ${amount} ${getPluralForm(getItemTypeData(itemType).name)} will cost a total of ${getCurrencyString(orderTotalCost)}`, "Business Order Cost");
	getPlayerData(client).promptType = V_PROMPT_BIZORDER;
}

// ===========================================================================

function orderItemForBusiness(businessId, itemType, amount) {
	if (getBusinessData(businessId).till < orderTotalCost) {
		let neededAmount = orderTotalCost - getBusinessData(businessId).till;
		//messagePlayerError(client, `The business doesn't have enough money (needs {ALTCOLOUR}${getCurrencyString(neededAmount)} {MAINCOLOUR}more)! Use {ALTCOLOUR}/bizdeposit {MAINCOLOUR}to add money to the business.`);
		return false;
	}

	getBusinessData(businessId).till -= orderTotalCost;
	addToBusinessInventory(businessId, itemType, amount);
	//messagePlayerSuccess(client, `You ordered ${amount} ${getPluralForm(getItemTypeData(itemType).name)} (${getItemValueDisplay(itemType, value)}) at ${getCurrencyString(getItemTypeData(itemType).orderPrice)} each for business {businessBlue}${getBusinessData(businessId).name}`);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (!canPlayerManageBusiness(client, businessId)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
		return false;
	}

	messagePlayerSuccess(client, `Business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} till has {ALTCOLOUR}${getCurrencyString(getBusinessData(businessId).till)}`);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (getBusinessData(businessId).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "BusinessNotForSale"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).cash < applyServerInflationMultiplier(getBusinessData(businessId).buyPrice)) {
		messagePlayerError(client, getLocaleString(client, "BusinessPurchaseNotEnoughMoney"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "BuyBusinessConfirmMessage"), getLocaleString(client, "BuyBusinessConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = V_PROMPT_BUYBIZ;
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).entrancePosition = getPlayerPosition(client);
	getBusinessData(businessId).entranceRotation = getPlayerHeading(client);
	getBusinessData(businessId).entranceDimension = getPlayerDimension(client);
	getBusinessData(businessId).entranceInterior = getPlayerInterior(client);

	//deleteBusinessEntranceBlip(businessId);
	//deleteBusinessEntrancePickup(businessId);
	//spawnBusinessEntranceBlip(businessId);
	//spawnBusinessEntrancePickup(businessId);

	resetBusinessPickups(businessId);
	resetBusinessBlips(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} entrance to their position`, true);
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

	if (getBusinessData(businessId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	getBusinessData(businessId).exitPosition = getPlayerPosition(client);
	getBusinessData(businessId).exitRotation = getPlayerHeading(client);
	getBusinessData(businessId).exitDimension = getPlayerDimension(client);
	getBusinessData(businessId).exitInterior = getPlayerInterior(client);

	deleteBusinessExitBlip(businessId);
	deleteBusinessExitPickup(businessId);

	spawnBusinessExitBlip(businessId);
	spawnBusinessExitPickup(businessId);

	getBusinessData(businessId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved business {businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR} exit to their position`, true);
}

// ===========================================================================

function getBusinessDataFromDatabaseId(databaseId) {
	if (databaseId <= 0) {
		return false;
	}

	let matchingBusinesses = serverData.businesses.filter(b => b.databaseId == databaseId)
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
	for (let i in serverData.businesses) {
		if (serverData.businesses[i].entranceDimension == dimension) {
			if (getDistance(position, serverData.businesses[i].entrancePosition) <= getDistance(position, serverData.businesses[closest].entrancePosition)) {
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
	for (let i in serverData.businesses) {
		if (serverData.businesses[i].hasInterior && serverData.businesses[i].exitDimension == dimension) {
			if (getDistance(position, serverData.businesses[i].exitPosition) <= getDistance(position, serverData.businesses[closest].exitPosition)) {
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
	for (let i in serverData.businesses) {
		if (serverData.businesses[i].hasInterior && serverData.businesses[i].exitDimension == getPlayerDimension(client)) {
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
	if (serverData.businesses.length == 0) {
		return -1;
	}

	if (getPlayerDimension(client) == gameData.mainWorldDimension[getGame()]) {
		let closestEntrance = getClosestBusinessEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getPlayerPosition(client), getBusinessData(closestEntrance).entrancePosition) <= globalConfig.enterPropertyDistance) {
			return getBusinessData(closestEntrance).index;
		}
	} else {
		let closestEntrance = getClosestBusinessEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getPlayerPosition(client), getBusinessData(closestEntrance).entrancePosition) <= globalConfig.enterPropertyDistance) {
			return getBusinessData(closestEntrance).index;
		}

		let closestExit = getClosestBusinessExit(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getPlayerPosition(client), getBusinessData(closestExit).exitPosition) <= globalConfig.exitPropertyDistance) {
			return getBusinessData(closestExit).index;
		}

		for (let i in serverData.businesses) {
			if (serverData.businesses[i].hasInterior && serverData.businesses[i].exitDimension == getPlayerDimension(client)) {
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
	if (serverConfig.devServer) {
		return false;
	}

	for (let i in serverData.businesses) {
		if (serverData.businesses[i].needsSaved) {
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
	if (serverConfig.devServer) {
		return false;
	}

	let tempBusinessData = getBusinessData(businessId);

	if (!tempBusinessData.needsSaved) {
		return false;
	}

	if (tempBusinessData.databaseId == -1) {
		// Temp business, no need to save
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Business]: Saving business '${tempBusinessData.name}' to database ...`);
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
			["biz_entrance_scene", tempBusinessData.entranceScene],
			["biz_exit_pos_x", tempBusinessData.exitPosition.x],
			["biz_exit_pos_y", tempBusinessData.exitPosition.y],
			["biz_exit_pos_z", tempBusinessData.exitPosition.z],
			["biz_exit_rot_z", tempBusinessData.exitRotation],
			["biz_exit_int", tempBusinessData.exitInterior],
			["biz_exit_vw", tempBusinessData.exitDimension],
			["biz_exit_pickup", tempBusinessData.exitPickupModel],
			["biz_exit_blip", tempBusinessData.exitBlipModel],
			["biz_exit_scene", tempBusinessData.exitScene],
			["biz_has_interior", boolToInt(tempBusinessData.hasInterior)],
			["biz_interior_lights", boolToInt(tempBusinessData.interiorLights)],
			["biz_label_help_type", tempBusinessData.labelHelpType],
			["biz_radio_station", (getRadioStationData(tempBusinessData.streamingRadioStationIndex) != null) ? toInteger(getRadioStationData(tempBusinessData.streamingRadioStationIndex).databaseId) : -1],
			["biz_custom_interior", boolToInt(tempBusinessData.customInterior)],
			["biz_buy_price", tempBusinessData.buyPrice],
			["biz_who_added", tempBusinessData.whoAdded],
			["biz_when_added", tempBusinessData.whenAdded],
			//["biz_rent_price", tempBusinessData.rentPrice],
		];

		let dbQuery = null;
		if (tempBusinessData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("biz_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			serverData.businesses[businessId].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("biz_main", data, `biz_id=${tempBusinessData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		getBusinessData(businessId).needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[V.RP.Business]: Saved business '${tempBusinessData.name}' to database!`);

	return false;
}

// ===========================================================================

/**
 * Creates all server pickups for all businesses
 *
 * @return {Boolean} Whether or not the server pickups were created
 *
 */
function spawnAllBusinessPickups() {
	if (!serverConfig.createBusinessPickups) {
		return false;
	}

	for (let i in serverData.businesses) {
		spawnBusinessEntrancePickup(i);
		spawnBusinessExitPickup(i);
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
function spawnAllBusinessBlips() {
	if (!serverConfig.createBusinessBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	for (let i in serverData.businesses) {
		spawnBusinessEntranceBlip(i);
		spawnBusinessExitBlip(i);
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
function spawnBusinessEntrancePickup(businessId) {
	if (!serverConfig.createBusinessPickups) {
		return false;
	}

	let businessData = getBusinessData(businessId);

	//if(businessData.hasInterior) {
	//	return false;
	//}

	logToConsole(LOG_VERBOSE, `[V.RP.Business]: Creating entrance pickup for business ${businessData.name} (${businessData.databaseId})`);

	if (isGameFeatureSupported("serverElements")) {
		let entrancePickup = null;
		if (isGameFeatureSupported("pickup")) {
			let pickupModelId = gameData.pickupModels[getGame()].Business;

			if (businessData.entrancePickupModel == -1) {
				return false;
			}

			if (businessData.entrancePickupModel != 0) {
				pickupModelId = businessData.entrancePickupModel;
			}

			entrancePickup = createGamePickup(pickupModelId, businessData.entrancePosition, gameData.pickupTypes[getGame()].business);
		} else {
			if (isGameFeatureSupported("dummyElement")) {
				entrancePickup = createGameDummyElement(businessData.entrancePosition);
				entrancePickup.position = businessData.entrancePosition;
				entrancePickup.dimension = businessData.entranceDimension;
				//entrancePickup.interior = businessData.entranceDimension;
			}
		}

		if (entrancePickup != null) {
			if (businessData.entranceDimension != -1) {
				setElementDimension(entrancePickup, businessData.entranceDimension);
				setElementOnAllDimensions(entrancePickup, false);
			} else {
				setElementOnAllDimensions(entrancePickup, true);
			}

			if (globalConfig.businessPickupStreamInDistance == -1 || globalConfig.businessPickupStreamOutDistance == -1) {
				entrancePickup.netFlags.distanceStreaming = false;
			} else {
				setElementStreamInDistance(entrancePickup, globalConfig.businessPickupStreamInDistance);
				setElementStreamOutDistance(entrancePickup, globalConfig.businessPickupStreamOutDistance);
			}
			setElementTransient(entrancePickup, false);
			getBusinessData(businessId).entrancePickup = entrancePickup;
			updateBusinessPickupLabelData(businessId);
		}
	}

	updateBusinessPickupLabelData(businessId);

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
function spawnBusinessEntranceBlip(businessId) {
	if (!serverConfig.createBusinessBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	let businessData = getBusinessData(businessId);

	//if(businessData.hasInterior) {
	//	return false;
	//}

	if (businessData.entranceBlipModel == -1) {
		return false;
	}

	let blipModelId = gameData.blipSprites[getGame()].Business;

	if (businessData.entranceBlipModel != 0) {
		blipModelId = businessData.entranceBlipModel;
	}

	logToConsole(LOG_VERBOSE, `[V.RP.Job]: Creating entrance blip for business ${businessData.name} (model ${blipModelId})`);

	if (isGameFeatureSupported("serverElements") && getGame() != V_GAME_MAFIA_ONE && getGame() != V_GAME_GTA_IV) {
		let entranceBlip = createGameBlip(businessData.entrancePosition, blipModelId, 1, getColourByType("businessBlue"));
		if (entranceBlip != null) {
			if (businessData.entranceDimension != -1) {
				setElementDimension(entranceBlip, businessData.entranceDimension);
				setElementOnAllDimensions(entranceBlip, false);
			} else {
				setElementOnAllDimensions(entranceBlip, true);
			}

			if (globalConfig.businessBlipStreamInDistance == -1 || globalConfig.businessBlipStreamOutDistance == -1) {
				entranceBlip.netFlags.distanceStreaming = false;
			} else {
				setElementStreamInDistance(entranceBlip, globalConfig.businessBlipStreamInDistance);
				setElementStreamOutDistance(entranceBlip, globalConfig.businessBlipStreamOutDistance);
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
function spawnBusinessExitPickup(businessId) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (!serverConfig.createBusinessPickups) {
		return false;
	}

	let businessData = getBusinessData(businessId);

	//if(!businessData.hasInterior) {
	//	return false;
	//}

	if (businessData.exitPickupModel == -1) {
		return false;
	}

	logToConsole(LOG_VERBOSE, `[V.RP.Job]: Creating exit pickup for business ${businessData.name}`);

	let exitPickup = null;
	if (isGameFeatureSupported("pickup")) {
		let pickupModelId = gameData.pickupModels[getGame()].Exit;

		if (businessData.exitPickupModel != 0) {
			pickupModelId = businessData.exitPickupModel;
		}

		exitPickup = createGamePickup(pickupModelId, businessData.exitPosition, gameData.pickupTypes[getGame()].business);
	}

	if (exitPickup != null) {
		if (businessData.exitDimension != -1) {
			setElementDimension(exitPickup, businessData.exitDimension);
			setElementOnAllDimensions(exitPickup, false);
		} else {
			setElementOnAllDimensions(exitPickup, true);
		}

		if (globalConfig.businessPickupStreamInDistance == -1 || globalConfig.businessPickupStreamOutDistance == -1) {
			exitPickup.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(exitPickup, globalConfig.businessPickupStreamInDistance);
			setElementStreamOutDistance(exitPickup, globalConfig.businessPickupStreamOutDistance);
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
function spawnBusinessExitBlip(businessId) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (!serverConfig.createBusinessBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	let businessData = getBusinessData(businessId);

	//if(!businessData.hasInterior) {
	//	return false;
	//}

	if (businessData.exitBlipModel == -1) {
		return false;
	}

	let blipModelId = gameData.blipSprites[getGame()].Business;

	if (businessData.exitBlipModel != 0) {
		blipModelId = businessData.exitBlipModel;
	}

	logToConsole(LOG_VERBOSE, `[V.RP.Job]: Creating exit blip for business ${businessData.name} (model ${blipModelId})`);

	let exitBlip = createGameBlip(businessData.exitPosition, blipModelId, 1, getColourByName("businessBlue"));
	if (exitBlip != null) {
		if (businessData.exitDimension != -1) {
			setElementDimension(exitBlip, businessData.exitDimension);
			setElementOnAllDimensions(exitBlip, false);
		} else {
			setElementOnAllDimensions(exitBlip, true);
		}

		if (globalConfig.businessBlipStreamInDistance == -1 || globalConfig.businessBlipStreamOutDistance == -1) {
			exitBlip.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(exitBlip, globalConfig.businessBlipStreamInDistance);
			setElementStreamOutDistance(exitBlip, globalConfig.businessBlipStreamOutDistance);
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
	let tempBusinessData = getBusinessData(businessId);

	let dbConnection = connectToDatabase();
	let dbQuery = null;

	deleteBusinessBlips(businessId);
	deleteBusinessPickups(businessId);

	if (dbConnection) {
		dbQuery = queryDatabase(dbConnection, `UPDATE biz_main SET biz_deleted = 1, biz_when_deleted = UNIX_TIMESTAMP(), biz_who_deleted = ${whoDeleted} WHERE biz_id = ${tempBusinessData.databaseId}`);
		if (dbQuery) {
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	removePlayersFromBusiness(businessId);
	serverData.businesses.splice(businessId, 1);
	updateBusinessPickupLabelData(businessId, true);

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
function removePlayersFromBusiness(businessIndex) {
	getClients().forEach(function (client) {
		if (doesBusinessHaveInterior(businessIndex)) {
			if (getPlayerBusiness(client) == businessIndex) {
				if (getPlayerInterior(client) == getBusinessData(businessIndex).exitInterior && getPlayerDimension(client) == getBusinessData(businessIndex).exitDimension) {
					exitBusiness(client);
				}
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
		setPlayerInterior(client, serverData.businesses[businessId].entranceInterior);
		setPlayerDimension(client, serverData.businesses[businessId].entranceDimension);
		setPlayerPosition(client, serverData.businesses[businessId].entrancePosition);
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
		case V_BIZ_OWNER_CLAN:
			return "clan";

		case V_BIZ_OWNER_JOB:
			return "job";

		case V_BIZ_OWNER_PLAYER:
			return "player";

		case V_BIZ_OWNER_NONE:
		case V_BIZ_OWNER_PUBLIC:
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
	if (businessId == -1) {
		return null;
	}

	if (typeof serverData.businesses[businessId] != "undefined") {
		return serverData.businesses[businessId];
	}

	return null;
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
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (getBusinessData(businessId).entrancePickup != null) {
		//removeFromWorld(getBusinessData(businessId).entrancePickup);
		deleteGameElement(getBusinessData(businessId).entrancePickup);
		getBusinessData(businessId).entrancePickup = null;
		updateBusinessPickupLabelData(businessId);
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
	if (!isGameFeatureSupported("serverElements")) {
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
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
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
	if (!isGameFeatureSupported("serverElements")) {
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

	for (let i in serverData.businesses) {
		deleteBusinessExitBlip(i);
		deleteBusinessEntranceBlip(i);
		deleteBusinessExitPickup(i);
		deleteBusinessEntrancePickup(i);
	}

	serverData.businesses = [];
	serverData.businesses = loadBusinessesFromDatabase();
	spawnAllBusinessPickups();
	spawnAllBusinessBlips();
	setAllBusinessDataIndexes();
	cacheAllBusinessItems();

	announceAdminAction(`AllBusinessesReloaded`);
}

// ===========================================================================

/**
 * Sets the indexes of all businesses
 *
 * @returns {Boolean} Whether or not the exit blip of the business was deleted
 */
function setAllBusinessDataIndexes() {
	for (let i in serverData.businesses) {
		serverData.businesses[i].index = i;

		//if (serverData.businesses[i].streamingRadioStation > 0) {
		//	let radioStationIndex = getRadioStationFromDatabaseId(serverData.businesses[i].streamingRadioStation);
		//	if (radioStationIndex != -1) {
		//		serverData.businesses[i].streamingRadioStationIndex = radioStationIndex;
		//	}
		//}

		for (let j in serverData.businesses[i].locations) {
			if (serverData.businesses[i].locations[j].type == V_BIZ_LOC_ATM) {
				serverData.atmLocationCache.push([i, j, serverData.businesses[i].locations[j].position]);
			}
		}
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
	tempItemData.ownerType = V_ITEMOWNER_BIZ;
	tempItemData.ownerIndex = businessId;
	tempItemData.itemTypeIndex = itemType;
	serverData.items.push(tempItemData);

	setAllItemDataIndexes();
	cacheAllBusinessItems();
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

	if (getBusinessData(businessId) == null) {
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

	let useType = getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).itemTypeIndex).useType;
	if (useType == V_ITEM_USE_TYPE_WEAPON || V_ITEM_USE_TYPE_TAZER || useType == V_ITEM_USE_TYPE_AMMO_CLIP) {
		if (isPlayerWeaponBanned(client) && !isPlayerExemptFromAntiCheat(client)) {
			messagePlayerError(client, getLocaleString(client, "WeaponBanned"));
			return false;
		}
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

	let totalCost = applyServerInflationMultiplier(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).buyPrice) * amount;
	let itemName = getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).itemTypeIndex).name;

	if (getPlayerCurrentSubAccount(client).cash < totalCost) {
		messagePlayerError(client, getLocaleString(client, "NotEnoughCashNeedAmountMore", `{ALTCOLOUR}${totalCost - getPlayerCurrentSubAccount(client).cash}{MAINCOLOUR}`));
		return false;
	}

	takePlayerCash(client, totalCost);
	let itemIndex = createItem(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).itemTypeIndex, getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).value, V_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId, amount);
	cachePlayerHotBarItems(client);
	getBusinessData(businessId).till = getBusinessData(businessId).till + totalCost;

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).amount = getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).amount - amount;
	if (getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).amount == 0) {
		deleteItem(getBusinessData(businessId).floorItemCache[itemSlot - 1]);
	}

	//messagePlayerSuccess(client, `You bought ${amount} {ALTCOLOUR}${itemName} {MAINCOLOUR}for ${totalCost} ${priceEach}`);
	meActionToNearbyPlayers(client, `buys a ${itemName}`);

	if (!hasPlayerSeenActionTip(client, "ViewInventory")) {
		if (doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand("inv")) {
			let keyData = getPlayerKeyBindForCommand("inv");
			messagePlayerActionTip(client, getGroupedLocaleString(client, "ActionTips", "ViewInventory", `{ALTCOLOUR}${getKeyNameFromId(keyData.key)}{MAINCOLOUR}`));
		} else {
			messagePlayerActionTip(client, getGroupedLocaleString(client, "ActionTips", "ViewInventory", `{ALTCOLOUR}/inv{MAINCOLOUR}`));
		}
	}

	logBusinessItemPurchase(getBusinessData(businessId).databaseId, getPlayerCurrentSubAccount(client).databaseId, getItemData(itemIndex).databaseId);
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

	if (getBusinessData(businessId) == null) {
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

	messagePlayerSuccess(client, `You changed the price of the {ALTCOLOUR}${getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).itemTypeIndex).name}'s {MAINCOLOUR}in slot {ALTCOLOUR}${itemSlot} {MAINCOLOUR}from ${getCurrencyString(oldPrice)} to ${getCurrencyString(newPrice)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(newPrice))})`);
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

	if (getBusinessData(businessId) == null) {
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

	getItemData(getBusinessData(businessId).floorItemCache[itemSlot - 1]).ownerType = V_ITEM_OWNER_BIZSTORAGE;
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

	if (getBusinessData(businessId) == null) {
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

	getItemData(getBusinessData(businessId).storageItemCache[itemSlot - 1]).ownerType = V_ITEM_OWNER_BIZFLOOR;
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
	logToConsole(LOG_DEBUG, "[V.RP.Business] Caching all business items ...");
	for (let i in serverData.businesses) {
		cacheBusinessItems(i);
	}
	logToConsole(LOG_DEBUG, "[V.RP.Business] Cached all business items successfully!");
}

// ===========================================================================

// Caches all items for a business by businessId
function cacheBusinessItems(businessIndex) {
	let businessData = getBusinessData(businessIndex);

	businessData.floorItemCache = [];
	businessData.storageItemCache = [];

	logToConsole(LOG_VERBOSE, `[V.RP.Business] Caching business items for business ${businessIndex} (${businessData.name}) ...`);
	businessData.floorItemCache = serverData.items.filter(item => item != null && item.ownerType == V_ITEM_OWNER_BIZFLOOR && item.ownerId == businessData.databaseId).map(i => i.index);
	businessData.storageItemCache = serverData.items.filter(item2 => item2 != null && item2.ownerType == V_ITEM_OWNER_BIZSTORAGE && item2.ownerId == businessData.databaseId).map(i2 => i2.index);

	logToConsole(LOG_VERBOSE, `[V.RP.Business] Successfully cached ${getBusinessData(businessIndex).floorItemCache.length} floor items and ${getBusinessData(businessIndex).storageItemCache} storage items for business ${businessIndex} (${getBusinessData(businessIndex).name})!`);
}

// ===========================================================================

// Gets a business's data index from a business's databaseId
function getBusinessIndexFromDatabaseId(databaseId) {
	return serverData.businesses.findIndex(business => business.databaseId == databaseId);
}

// ===========================================================================

// Updates all pickup data for a business by businessId
function updateBusinessPickupLabelData(businessId, deleted = false) {
	/** @type {BusinessData} */
	let businessData = false;

	if (deleted == false) {
		businessData = getBusinessData(businessId);
	}

	if (!isGameFeatureSupported("serverElements") || getGame() == V_GAME_GTA_IV || (!isGameFeatureSupported("pickup") && !isGameFeatureSupported("blip"))) {
		if (businessData == null) {
			sendBusinessToPlayer(null, businessId, true, "", false, -1, -1, 0, 0, false, 0, V_PROPLABEL_INFO_NONE, 0, 0);
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.Business] Sending business ${businessId} (${businessData.name}) to player ${getPlayerDisplayForConsole(null)} (entrance dimension: ${businessData.entranceDimension})`);

			sendBusinessToPlayer(
				null,
				businessId,
				false,
				businessData.name,
				businessData.entrancePosition,
				businessData.exitPosition,
				getBusinessEntranceBlipModelForNetworkEvent(businessId),
				getBusinessEntrancePickupModelForNetworkEvent(businessId),
				applyServerInflationMultiplier(businessData.buyPrice),
				applyServerInflationMultiplier(businessData.rentPrice),
				businessData.locked,
				businessData.entranceFee,
				getBusinessPropertyInfoLabelType(businessId),
				businessData.entranceDimension,
				businessData.exitDimension
			);
		}
		return false;
	}

	if (getBusinessData(businessId).exitPickup != null) {
		setEntityData(getBusinessData(businessId).exitPickup, "v.rp.owner.type", V_PICKUP_BUSINESS_EXIT, false);
		setEntityData(getBusinessData(businessId).exitPickup, "v.rp.owner.id", businessId, false);
		setEntityData(getBusinessData(businessId).exitPickup, "v.rp.label.type", V_LABEL_EXIT, true);
	}

	if (getBusinessData(businessId).entrancePickup != null) {
		setEntityData(getBusinessData(businessId).entrancePickup, "v.rp.owner.type", V_PICKUP_BUSINESS_ENTRANCE, false);
		setEntityData(getBusinessData(businessId).entrancePickup, "v.rp.owner.id", businessId, false);
		setEntityData(getBusinessData(businessId).entrancePickup, "v.rp.label.type", V_LABEL_BUSINESS, true);
		setEntityData(getBusinessData(businessId).entrancePickup, "v.rp.label.name", getBusinessData(businessId).name, true);
		setEntityData(getBusinessData(businessId).entrancePickup, "v.rp.label.locked", getBusinessData(businessId).locked, true);
		setEntityData(getBusinessData(businessId).entrancePickup, "v.rp.label.help", getBusinessPropertyInfoLabelType(businessId), true);

		setEntityData(getBusinessData(businessId).entrancePickup, "v.rp.label.price", applyServerInflationMultiplier(getBusinessData(businessId).buyPrice), true);
		setEntityData(getBusinessData(businessId).entrancePickup, "v.rp.label.fee", applyServerInflationMultiplier(getBusinessData(businessId).entranceFee), true);
	}
}

// ===========================================================================

function resetBusinessPickups(businessId) {
	deleteBusinessPickups(businessId);
	spawnBusinessEntrancePickup(businessId);
	spawnBusinessExitPickup(businessId);

	//updateBusinessPickupLabelData(businessId, false);
}

// ===========================================================================

function resetBusinessBlips(businessId) {
	deleteBusinessBlips(businessId);
	spawnBusinessEntranceBlip(businessId);
	spawnBusinessExitBlip(businessId);

	//updateBusinessPickupLabelData(businessId, false);
}

// ===========================================================================

function resetAllBusinessPickups(businessId) {
	deleteBusinessPickups(businessId);
	spawnBusinessEntrancePickup(businessId);
	spawnBusinessExitPickup(businessId);

	//updateBusinessPickupLabelData(businessId, false);
}

// ===========================================================================

function resetAllBusinessBlips() {
	for (let i in serverData.businesses) {
		deleteBusinessBlips(i);
		spawnBusinessBlips(i);

		//updateBusinessPickupLabelData(i, false);
	}
}

// ===========================================================================

function spawnBusinessBlips(businessId) {
	spawnBusinessEntranceBlip(businessId);
	spawnBusinessExitBlip(businessId);
}

// ===========================================================================

function resetAllBusinessPickups() {
	for (let i in serverData.businesses) {
		deleteBusinessPickups(i);
		spawnBusinessPickups(i);
	}
}

// ===========================================================================

function spawnBusinessPickups(businessId) {
	spawnBusinessEntrancePickup(businessId);
	spawnBusinessExitPickup(businessId);
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
//		sendPlayerGameScriptState(client, V_GAMESCRIPT_DENY);
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

	if (getBusinessData(businessId).ownerType == V_BIZ_OWNER_PLAYER && getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == V_BIZ_OWNER_CLAN && getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
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

	if (getBusinessData(businessId).ownerType == V_BIZ_OWNER_PLAYER && getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == V_BIZ_OWNER_CLAN && getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
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

	if (getBusinessData(businessId).ownerType == V_BIZ_OWNER_PLAYER && getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getBusinessData(businessId).ownerType == V_BIZ_OWNER_CLAN && getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBusinesses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerManageBusiness(client, businessId, exemptAdminFlag = false) {
	if (exemptAdminFlag == false) {
		if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
			return true;
		}
	}

	if (getBusinessData(businessId).ownerType == V_BIZ_OWNER_PLAYER) {
		if (getBusinessData(businessId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if (getBusinessData(businessId).ownerType == V_BIZ_OWNER_CLAN) {
		if (getBusinessData(businessId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
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
		return serverData.businesses.findIndex(business => business.name.toLowerCase().indexOf(params.toLowerCase()) != -1);
	} else {
		if (typeof serverData.businesses[params] != "undefined") {
			return toInteger(params);
		}
	}
	return false;
}

// ===========================================================================

function deleteAllBusinessBlips() {
	for (let i in serverData.businesses) {
		deleteBusinessBlips(i);
	}
}

// ===========================================================================

function deleteAllBusinessPickups() {
	for (let i in serverData.businesses) {
		deleteBusinessPickups(i);
	}
}

// ===========================================================================

function getBusinessFromInteriorAndDimension(dimension, interior) {
	return serverData.businesses.findIndex(business => business.exitInterior == interior && business.exitDimension == dimension);
}

// ===========================================================================

function getClosestBusinessWithBuyableItemOfUseType(position, useType) {
	return getBusinessesWithBuyableItemOfUseType(useType).reduce((i, j) => (getDistance(position, i.entrancePosition) <= getDistance(position, j.entrancePosition)) ? i : j);
}

// ===========================================================================

function getBusinessesWithBuyableItemOfUseType(useType) {
	return serverData.businesses.filter(business => doesBusinessHaveBuyableItemOfUseType(business.index, useType));
}

// ===========================================================================

function doesBusinessHaveBuyableItemOfUseType(businessId, useType) {
	return (getBusinessData(businessId).floorItemCache.filter(item => getItemData(item) != null && getItemTypeData(getItemData(item)).useType == useType).length > 0);
}

// ===========================================================================

function getBusinessEntranceBlipModelForNetworkEvent(businessIndex) {
	let blipModelId = -1;
	if (isGameFeatureSupported("blip")) {
		blipModelId = gameData.blipSprites[getGame()].Business;

		if (getBusinessData(businessIndex).entranceBlipModel != 0) {
			blipModelId = getBusinessData(businessIndex).entranceBlipModel;
		}
	}

	return blipModelId;
}

// ===========================================================================

function getBusinessEntrancePickupModelForNetworkEvent(businessIndex) {
	let pickupModelId = -1;
	if (isGameFeatureSupported("pickup")) {
		pickupModelId = gameData.pickupModels[getGame()].Business;

		if (getBusinessData(businessIndex).entrancePickupModel != 0) {
			pickupModelId = getBusinessData(businessIndex).entrancePickupModel;
		}
	}

	return pickupModelId;
}

// ===========================================================================

function getBusinessesInRange(position, distance) {
	return serverData.businesses.filter((business) => getDistance(position, business.entrancePosition) <= distance);
}

// ===========================================================================

function getNearbyBusinessesCommand(command, params, client) {
	let distance = 10.0;

	if (!areParamsEmpty(params)) {
		distance = getParam(params, " ", 1);
	}

	if (isNaN(distance)) {
		messagePlayerError(client, "The distance must be a number!");
		return false;
	}

	distance = toFloat(distance);

	if (distance <= 0) {
		messagePlayerError(client, "The distance must be more than 0!");
		return false;
	}

	let nearbyBusinesses = getBusinessesInRange(getPlayerPosition(client), distance);

	if (nearbyBusinesses.length == 0) {
		messagePlayerAlert(client, getLocaleString(client, "NoBusinessesWithinRange", distance));
		return false;
	}

	let businessesList = nearbyBusinesses.map(function (x) {
		return `{chatBoxListIndex}${x.index}: {MAINCOLOUR}${x.name} {mediumGrey}(${toFloat(getDistance(getPlayerPosition(client), x.entrancePosition)).toFixed(2)} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.entrancePosition))))})`;
	});
	let chunkedList = splitArrayIntoChunks(businessesList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBusinessesInRangeList", `${distance} ${toLowerCase(getLocaleString(client, "Meters"))}`)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function logBusinessItemPurchase(businessId, purchaserId, itemId) {
	//if (serverConfig.devServer) {
	//	return false;
	//}

	//quickDatabaseQuery(`INSERT INTO log_biz_buy (log_biz_buy_biz, log_biz_buy_who, log_biz_buy_item, log_biz_buy_when) VALUES (${businessId}, ${purchaserId}, ${itemId}, UNIX_TIMESTAMP())`);
	//
	//logItemMove(itemId, V_ITEM_OWNER_BIZFLOOR, businessId, V_ITEM_OWNER_PLAYER, purchaserId)
}

// ===========================================================================

function getBusinessPropertyInfoLabelType(businessId) {
	if (getBusinessData(businessId) == null) {
		return V_PROPLABEL_INFO_NONE;
	}

	switch (getBusinessData(businessId).labelHelpType) {
		case V_PROPLABEL_INFO_ENTERVEHICLE:
			return V_PROPLABEL_INFO_ENTERVEHICLE;

		case V_PROPLABEL_INFO_ENTER:
			return V_PROPLABEL_INFO_ENTER;

		case V_PROPLABEL_INFO_REPAIR:
			return V_PROPLABEL_INFO_REPAIR;

		default:
			if (getBusinessData(businessId).hasInterior) {
				return V_PROPLABEL_INFO_ENTER;
			} else {
				if (doesBusinessHaveAnyItemsToBuy(businessId)) {
					return V_PROPLABEL_INFO_BUY;
				} else {
					return V_PROPLABEL_INFO_NONE;
				}
			}
			break;
	}

	return V_PROPLABEL_INFO_NONE;
}

// ===========================================================================

function listPersonalBusinessesCommand(command, params, client) {
	let businesses = getAllBusinessesOwnedByPlayer(client);

	let businessList = businesses.map(function (x) {
		return `{chatBoxListIndex}${x.index}: {MAINCOLOUR}${x.name} {mediumGrey}(${Math.round(getDistance(getPlayerPosition(client), x.entrancePosition))} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.entrancePosition))))})`;
	});
	let chunkedList = splitArrayIntoChunks(businessList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerBusinessesList", getCharacterFullName(client))));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function listClanBusinessesCommand(command, params, client) {
	let clanIndex = getPlayerClan(client);

	if (!areParamsEmpty(params) && doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		clanIndex = getClanFromParams(params);
	}

	if (getClanData(clanIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let businesses = getAllBusinessesOwnedByClan(clanIndex);

	let businessList = businesses.map(function (x) {
		return `{chatBoxListIndex}${x.index}: {MAINCOLOUR}${x.name}{mediumGrey} (${Math.round(getDistance(getPlayerPosition(client), x.entrancePosition))} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.entrancePosition))))})`;
	});
	let chunkedList = splitArrayIntoChunks(businessList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderClanBusinessesList", getClanData(clanIndex).name)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function listJobBusinessesCommand(command, params, client) {
	let jobIndex = getPlayerJob(client);

	if (!areParamsEmpty(params) && doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageBusinesses"))) {
		jobIndex = getJobFromParams(params);
	}

	if (getJobData(jobIndex) == false) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	let businesses = getAllBusinessesOwnedByJob(jobIndex);

	let businessList = businesses.map(function (x) {
		return `{chatBoxListIndex}${x.index}: {MAINCOLOUR}${x.name}{mediumGrey} (${Math.round(getDistance(getPlayerPosition(client), x.entrancePosition))} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.entrancePosition))))})`;
	});
	let chunkedList = splitArrayIntoChunks(businessList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobBusinessesList", getJobData(jobIndex).name)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================