// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: property.js
// DESC: Provides property (house, business, etc) with functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Property Types
const AGRP_PROP_TYPE_NONE = 0;						// None (invalid)
const AGRP_PROP_TYPE_BIZ_NORMAL = 1;				// Normal business (sells items)
const AGRP_PROP_TYPE_BIZ_BANK = 2;					// Bank business
const AGRP_PROP_TYPE_BIZ_PUBLIC = 3;				// Public business (Government, public service, etc)
const AGRP_PROP_TYPE_BIZ_PAINTBALL = 4;				// Paintball arena. Player joins paintball/airsoft when they enter
const AGRP_PROP_TYPE_BIZ_DEALERSHIP = 5;			// Vehicle Dealership (also for airplane, boat, etc)
const AGRP_PROP_TYPE_HOUSE = 6;						// House

// ===========================================================================

// Property Location Types
const AGRP_PROP_LOC_NONE = 0;						// None
const AGRP_PROP_LOC_GATE = 1;						// Moveable gate that belongs to the property
const AGRP_PROP_LOC_GARAGE = 2;						// Location for attached garage (pos1 = outside, pos2 = inside). Use pos to teleport or spawn veh/ped
const AGRP_PROP_LOC_FUEL = 3;						// Fuel pump
const AGRP_PROP_LOC_DRIVETHRU = 4;					// Drivethrough
const AGRP_PROP_LOC_VENDMACHINE = 5;				// Vending machine
const AGRP_PROP_LOC_ATM = 6;						// ATM
const AGRP_PROP_LOC_PAYPHONE = 7;					// Payphone

// ===========================================================================

// Property Owner Types
const AGRP_PROP_OWNER_NONE = 0;                     // Not owned
const AGRP_PROP_OWNER_PLAYER = 1;                   // Owned by a player (character/subaccount)
const AGRP_PROP_OWNER_JOB = 2;                      // Owned by a job
const AGRP_PROP_OWNER_CLAN = 3;                     // Owned by a clan
const AGRP_PROP_OWNER_FACTION = 4;                  // Owned by a faction (not used at the moment)
const AGRP_PROP_OWNER_PUBLIC = 5;                   // Public property. Used for goverment/official places like police, fire, city hall, DMV, etc

// ===========================================================================

/**
 * @class Representing a property's data. Loaded and saved in the database
 * @property {Array.<PropertyLocationData>} locations
 */
class PropertyData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.ownerType = AGRP_PROP_OWNER_NONE;
		this.ownerId = 0;
		this.buyPrice = 0;
		this.locked = false;
		this.hasInterior = false;
		this.index = -1;
		this.needsSaved = false;
		this.interiorLights = true;
		this.propertyType = AGRP_PROP_TYPE_NONE;

		this.entrancePosition = false;
		this.entranceRotation = 0.0;
		this.entranceInterior = 0;
		this.entranceDimension = 0;
		this.entrancePickupModel = -1;
		this.entranceBlipModel = -1;
		this.entrancePickup = null;
		this.entranceBlip = null;
		this.entranceScene = "";

		this.exitPosition = false;
		this.exitRotation = 0.0;
		this.exitInterior = 0;
		this.exitDimension = 0;
		this.exitPickupModel = -1;
		this.exitBlipModel = -1;
		this.exitPickup = null;
		this.exitBlip = null;
		this.exitScene = "";

		this.streamingRadioStation = 0;
		this.streamingRadioStationIndex = -1;

		this.labelHelpType = AGRP_PROPLABEL_INFO_NONE;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["prop_id"]);
			this.name = toString(dbAssoc["prop_name"]);
			this.ownerType = toInteger(dbAssoc["prop_owner_type"]);
			this.ownerId = toInteger(dbAssoc["prop_owner_id"]);
			this.buyPrice = toInteger(dbAssoc["prop_buy_price"]);
			this.locked = intToBool(toInteger(dbAssoc["prop_locked"]));
			this.hasInterior = intToBool(toInteger(dbAssoc["prop_has_interior"]));
			this.interiorLights = intToBool(toInteger(dbAssoc["prop_interior_lights"]));
			this.type = toInteger(dbAssoc["prop_type"]);

			this.entrancePosition = toVector3(toFloat(dbAssoc["prop_entrance_pos_x"]), toFloat(dbAssoc["prop_entrance_pos_y"]), toFloat(dbAssoc["prop_entrance_pos_z"]));
			this.entranceRotation = toInteger(dbAssoc["prop_entrance_rot_z"]);
			this.entranceInterior = toInteger(dbAssoc["prop_entrance_int"]);
			this.entranceDimension = toInteger(dbAssoc["prop_entrance_vw"]);
			this.entrancePickupModel = toInteger(dbAssoc["prop_entrance_pickup"]);
			this.entranceBlipModel = toInteger(dbAssoc["prop_entrance_blip"]);
			this.entranceScene = toString(dbAssoc["prop_entrance_scene"]);

			this.exitPosition = toVector3(dbAssoc["prop_exit_pos_x"], dbAssoc["prop_exit_pos_y"], dbAssoc["prop_exit_pos_z"]);
			this.exitRotation = toInteger(dbAssoc["prop_exit_rot_z"]);
			this.exitInterior = toInteger(dbAssoc["prop_exit_int"]);
			this.exitDimension = toInteger(dbAssoc["prop_exit_vw"]);
			this.exitPickupModel = toInteger(dbAssoc["prop_exit_pickup"]);
			this.exitBlipModel = toInteger(dbAssoc["prop_exit_blip"]);
			this.exitScene = toString(dbAssoc["prop_exit_scene"]);

			this.labelHelpType = toInteger(dbAssoc["prop_label_help_type"]);
			this.streamingRadioStation = toInteger(dbAssoc["prop_radio_station"]);
		}
	};
};

/**
 * @class Representing a property's location data. Multiple can be used for a single property. Used for things like doors, fuel pumps, drive thru positions, etc. Loaded and saved in the database
 */
class PropertyLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.type = 0;
		this.propertyIndex = 0;
		this.propertyId = 0;
		this.enabled = false;
		this.index = -1;
		this.needsSaved = false;

		this.position = toVector3(0.0, 0.0, 0.0);
		this.interior = 0;
		this.dimension = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["prop_loc_id"]);
			this.name = toString(dbAssoc["prop_loc_name"]);
			this.type = toInteger(dbAssoc["prop_loc_type"]);
			this.business = toInteger(dbAssoc["prop_loc_biz"]);
			this.enabled = intToBool(toInteger(dbAssoc["prop_loc_enabled"]));

			this.position = toVector3(toFloat(dbAssoc["prop_loc_pos_x"]), toFloat(dbAssoc["prop_loc_pos_y"]), toFloat(dbAssoc["prop_loc_pos_z"]));
			this.interior = toInteger(dbAssoc["prop_loc_int"]);
			this.dimension = toInteger(dbAssoc["prop_loc_vw"]);
		}
	}
};

// ===========================================================================

function initPropertyScript() {
	logToConsole(LOG_INFO, "[AGRP.Property]: Initializing property script ...");
	logToConsole(LOG_INFO, "[AGRP.Property]: Property script initialized successfully!");
	return true;
}

// ===========================================================================

function loadPropertyFromId(propertyIndex) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM prop_main WHERE prop_id = ${propertyIndex} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			let dbAssoc = fetchQueryAssoc(dbQuery);
			freeDatabaseQuery(dbQuery);
			return new PropertyData(dbAssoc);
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function loadPropertiesFromDatabase() {
	logToConsole(LOG_INFO, "[AGRP.Property]: Loading properties from database ...");

	let tempProperties = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if (dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM prop_main WHERE prop_deleted = 0 AND prop_server = ${getServerId()}`);
		if (dbQuery) {
			if (dbQuery.numRows > 0) {
				while (dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempPropertyData = new PropertyData(dbAssoc);
					tempPropertyData.locations = loadPropertyLocationsFromDatabase(tempPropertyData.databaseId);
					tempProperties.push(tempPropertyData);
					logToConsole(LOG_VERBOSE, `[AGRP.Property]: Property '${tempPropertyData.name}' (ID ${tempPropertyData.databaseId}) loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[AGRP.Property]: ${tempProperties.length} properties loaded from database successfully!`);
	return tempProperties;
}

// ===========================================================================

function loadPropertyLocationsFromDatabase(propertyIndex) {
	logToConsole(LOG_VERBOSE, `[AGRP.Property]: Loading property locations for property ${propertyIndex} from database ...`);

	let tempPropertyLocations = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;
	let dbQueryString = "";

	if (dbConnection) {
		dbQueryString = `SELECT * FROM prop_loc WHERE prop_loc_prop = ${propertyIndex}`;
		dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			if (dbQuery.numRows > 0) {
				while (dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempPropertyLocationData = new PropertyLocationData(dbAssoc);
					tempPropertyLocations.push(tempPropertyLocationData);
					logToConsole(LOG_VERBOSE, `[AGRP.Property]: Location '${tempPropertyLocationData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_VERBOSE, `[AGRP.Property]: ${tempPropertyLocations.length} location for property ${propertyIndex} loaded from database successfully!`);
	return tempPropertyLocations;
}

// ===========================================================================

function createPropertyCommand(command, params, client) {
	createProperty(
		params,
		getPlayerPosition(client),
		toVector3(0.0, 0.0, 0.0),
		(isGameFeatureSupported("pickup")) ? getGameConfig().pickupModels[getGame()].Property : -1,
		-1,
		getPlayerInterior(client),
		getPlayerDimension(client),
		getPlayerData(client).interiorScene
	);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created business: ${getInlinePropertyColour(propertyIndex)}${params}`);
}

// ===========================================================================

function createPropertyLocationCommand(command, params, client) {
	if (!isPlayerSpawned(client)) {
		messagePlayerError(client, "You must be spawned to use this command!");
		return false;
	}

	let locationType = toString(getParam(params, " ", 1));
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let tempPropertyLocationData = createPropertyLocation(locationType, propertyIndex);
	getServerData().properties[propertyIndex].push(tempPropertyLocationData);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created location ${getInlinePropertyColour(propertyIndex)}${params}{MAINCOLOUR} for business ${getInlinePropertyColour(propertyIndex)}${tempPropertyData.name}`);
}

// ===========================================================================

function createProperty(name, entrancePosition, exitPosition, entrancePickupModel = -1, entranceBlipModel = -1, entranceInterior = 0, entranceDimension = 0, entranceScene = -1) {
	let tempPropertyData = new PropertyData(false);
	tempPropertyData.name = name;

	tempPropertyData.entrancePosition = entrancePosition;
	tempPropertyData.entranceRotation = 0.0;
	tempPropertyData.entrancePickupModel = entrancePickupModel;
	tempPropertyData.entranceBlipModel = entranceBlipModel;
	tempPropertyData.entranceInterior = entranceInterior;
	tempPropertyData.entranceDimension = entranceDimension;
	tempPropertyData.entranceScene = entranceScene;

	tempPropertyData.exitPosition = exitPosition;
	tempPropertyData.exitRotation = 0.0;
	tempPropertyData.exitPickupModel = 0;
	tempPropertyData.exitBlipModel = -1;
	tempPropertyData.exitInterior = 0;
	tempPropertyData.exitDimension = 0;
	tempPropertyData.exitScene = -1;

	tempPropertyData.needsSaved = true;
	let propertyIndex = getServerData().properties.push(tempPropertyData);
	setPropertyDataIndexes();
	saveAllPropertyesToDatabase();

	createPropertyPickups(propertyIndex - 1);
	createPropertyBlips(propertyIndex - 1);

	return tempPropertyData;
}

// ===========================================================================

function deletePropertyCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	deleteProperty(propertyIndex, getPlayerData(client).accountData.databaseId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}`);
}

// ===========================================================================

function deletePropertyLocationCommand(command, params, client) {
	//let propertyIndex = toInteger(getParam(params, " ", 2));
	//deletePropertyLocation(propertyIndex);
	//messagePlayerSuccess(client, `Property '${tempPropertyData.name} deleted!`);
}

// ===========================================================================

function setPropertyNameCommand(command, params, client) {
	let newPropertyName = toString(params);

	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	let oldPropertyName = getPropertyData(propertyIndex).name;
	getPropertyData(propertyIndex).name = newPropertyName;
	setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.name", getPropertyData(propertyIndex).name, true);
	getPropertyData(propertyIndex).needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} renamed property ${getInlinePropertyColour(propertyIndex)}${oldPropertyName}{MAINCOLOUR} to ${getInlinePropertyColour(propertyIndex)}${newPropertyName}`);
}

// ===========================================================================

function setPropertyOwnerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let newPropertyOwner = getPlayerFromParams(params);
	let propertyIndex = getPlayerProperty(client);

	if (!newPropertyOwner) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	getPropertyData(propertyIndex).ownerType = AGRP_BIZ_OWNER_PLAYER;
	getPropertyData(propertyIndex).ownerId = getPlayerCurrentSubAccount(newPropertyOwner).databaseId;
	getPropertyData(propertyIndex).needsSaved = true;

	messagePlayerSuccess(client, `{MAINCOLOUR}You gave property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} to {ALTCOLOUR}${getCharacterFullName(newPropertyOwner)}`);
}

// ===========================================================================

function setPropertyJobCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params);
	let propertyIndex = getPlayerProperty(client);

	if (!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	getPropertyData(propertyIndex).ownerType = AGRP_BIZ_OWNER_JOB;
	getPropertyData(propertyIndex).ownerId = getJobData(jobId).databaseId;
	getPropertyData(propertyIndex).needsSaved = true;

	messagePlayerSuccess(client, `{MAINCOLOUR}You set the owner of business ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name} {MAINCOLOUR}to the {jobYellow}${getJobData(jobId).name}`);
}

// ===========================================================================

function setPropertyClanCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (getPropertyData(business).ownerType != AGRP_VEHOWNER_PLAYER) {
		messagePlayerError(client, getLocaleString(client, "MustOwnProperty"));
		return false;
	}

	if (getPropertyData(business).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
		messagePlayerError(client, getLocaleString(client, "MustOwnProperty"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "SetPropertyClanConfirmMessage"), getLocaleString(client, "SetPropertyClanConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = AGRP_PROMPT_BIZGIVETOCLAN;

	//getPropertyData(propertyIndex).ownerType = AGRP_BIZ_OWNER_CLAN;
	//getPropertyData(propertyIndex).ownerId = getClanData(clanId).databaseId;
	//getPropertyData(propertyIndex).needsSaved = true;
}

// ===========================================================================

function setPropertyRankCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let rankId = params;

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	if (getVehicleData(vehicle).ownerType == AGRP_VEHOWNER_CLAN) {
		let clanId = getClanIndexFromDatabaseId(getPropertyData(propertyIndex).ownerId);
		rankId = getClanRankFromParams(clanId, params);
		if (!getClanRankData(clanId, rankId)) {
			messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
			return false;
		}
		getPropertyData(propertyIndex).rank = getClanRankData(clanId, rankId).databaseId;
		messagePlayerSuccess(client, `{MAINCOLOUR}You set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name} {MAINCOLOUR}rank to {ALTCOLOUR}${getClanRankData(clanId, rankId).name} {MAINCOLOUR}of the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan!`);
	} else if (getPropertyData(propertyIndex).ownerType == AGRP_VEHOWNER_JOB) {
		getPropertyData(propertyIndex).rank = rankId;
		messagePlayerSuccess(client, `{MAINCOLOUR}You set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name} {MAINCOLOUR}rank to {ALTCOLOUR}${rankId} {MAINCOLOUR}of the {jobYellow}${getJobData(getJobIdFromDatabaseId(getPropertyData(propertyIndex).ownerId)).name} {MAINCOLOUR}job!`);
	}

	getPropertyData(propertyIndex).needsSaved = true;
}

// ===========================================================================

function setPropertyRankCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let clanRankId = getClanRankFromParams(clanId, params);

	if (!getClanRankData(clanId, clanRankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	if (getClanRankData(clanId, clanRankId).level > getPlayerCurrentSubAccount(client).clanRank) {
		messagePlayerError(client, "That rank is above your level!");
		return false;
	}

	getPropertyData(propertyIndex).clanRank = getClanRankData(clanId, clanRankId).level;

	getPropertyData(propertyIndex).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR}'s clan rank to {clanOrange}${getClanRankData(clanId, clanRankId).name} {MAINCOLOUR}(level ${getClanRankData(clanId, clanRankId).level}) and above!`);
}

// ===========================================================================

function setPropertyJobCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	let closestJobLocation = getClosestJobLocation(getVehiclePosition(vehicle));
	let jobId = closestJobLocation.job;

	if (!areParamsEmpty(params)) {
		jobId = getJobIdFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	getPropertyData(propertyIndex).ownerType = AGRP_BIZ_OWNER_JOB;
	getPropertyData(propertyIndex).ownerId = getJobData(jobId).databaseId;

	getPropertyData(propertyIndex).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name} {MAINCOLOUR}owner to the {jobYellow}${getJobData(jobId).name} {MAINCOLOUR}job`);
}

// ===========================================================================

function setPropertyPublicCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	getPropertyData(propertyIndex).ownerType = AGRP_BIZ_OWNER_PUBLIC;
	getPropertyData(propertyIndex).ownerId = 0;

	getPropertyData(propertyIndex).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name} {MAINCOLOUR}owner set to {ALTCOLOUR}public`);
}

// ===========================================================================

function removePropertyOwnerCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	getPropertyData(propertyIndex).ownerType = AGRP_BIZ_OWNER_NONE;
	getPropertyData(propertyIndex).ownerId = -1;
	getPropertyData(propertyIndex).needsSaved = true;

	messagePlayerSuccess(client, `{MAINCOLOUR}You removed property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}'s{MAINCOLOUR} owner`);
}

// ===========================================================================

function togglePropertyInteriorLightsCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, "You can't change the interior lights for this property!");
		return false;
	}

	getPropertyData(propertyIndex).interiorLights = !getPropertyData(propertyIndex).interiorLights;
	updatePropertyInteriorLightsForOccupants(propertyIndex);

	getPropertyData(propertyIndex).needsSaved = true;
	meActionToNearbyPlayers(client, `turns ${toLowerCase(getOnOffFromBool(getPropertyData(propertyIndex).interiorLights))} the property lights`);
}

// ===========================================================================

function setPropertyEntranceFeeCommand(command, params, client) {
	let entranceFee = toInteger(getParam(params, " ", 1)) || 0;
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	getPropertyData(propertyIndex).entranceFee = entranceFee;
	getPropertyData(propertyIndex).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} entrance fee to {ALTCOLOUR}${getCurrencyString(entranceFee)}`);
}

// ===========================================================================

function setPropertyPaintBallCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	getPropertyData(propertyIndex).type = AGRP_BIZ_TYPE_PAINTBALL;
	getPropertyData(propertyIndex).needsSaved = true;
	messagePlayerSuccess(client, getLocaleString(client, "PropertyIsNowPaintBall"));
}

// ===========================================================================

function getPropertyInfoCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let propertyData = getPropertyData(propertyIndex);

	let ownerName = "Unknown";
	switch (propertyData.ownerType) {
		case AGRP_BIZ_OWNER_CLAN:
			ownerName = getClanData(propertyData.ownerId).name;
			break;

		case AGRP_BIZ_OWNER_JOB:
			ownerName = getJobData(propertyData.ownerId).name;
			break;

		case AGRP_BIZ_OWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(propertyData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			break;

		case AGRP_BIZ_OWNER_PUBLIC:
			ownerName = "Public";
			break;

		case AGRP_BIZ_OWNER_NONE:
			//submitBugReport(client, `[AUTOMATED REPORT] getPropertyInfoCommand() - Invalid ownerType for business ${propertyIndex}/${getPropertyData(propertyIndex).databaseId}`);
			ownerName = "None";
			break;

		default:
			submitBugReport(client, `[AUTOMATED REPORT] getPropertyInfoCommand() - Invalid ownerType ${propertyData.ownerType} for property ${propertyIndex}/${getPropertyData(propertyIndex).databaseId}`);
			ownerName = "None";
			break;
	}


	let tempStats = [
		[`Name`, `${propertyData.name}`],
		[`ID`, `${propertyData.index}/${propertyData.databaseId}`],
		[`Owner`, `${ownerName} (${getPropertyOwnerTypeText(propertyData.ownerType)})`],
		[`Locked`, `${getLockedUnlockedFromBool(propertyData.locked)}`],
		[`BuyPrice`, `${getCurrencyString(propertyData.buyPrice)}`],
		//[`RentPrice`, `${propertyData.rentPrice}`],
		[`HasInterior`, `${getYesNoFromBool(propertyData.hasInterior)}`],
		[`CustomInterior`, `${getYesNoFromBool(propertyData.customInterior)}`],
		[`HasBuyableItems`, `${getYesNoFromBool(doesPropertyHaveAnyItemsToBuy(propertyIndex))}`],
		[`EntranceFee`, `${getCurrencyString(propertyData.entranceFee)}`],
		[`InteriorLights`, `${getOnOffFromBool(propertyData.interiorLights)}`],
		[`Balance`, `${getCurrencyString(propertyData.till)}`],
		[`RadioStation`, `${propertyData.streamingRadioStation}`],
		[`LabelHelpType`, `${propertyData.labelHelpType}`],
	];

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPropertyInfo", propertyData.name)));
	let chunkedList = splitArrayIntoChunks(stats, 6);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}

	//messagePlayerInfo(client, `🏢 ${getInlinePropertyColour(propertyIndex)}[Property Info] {MAINCOLOUR}Name: {ALTCOLOUR}${getPropertyData(propertyIndex).name}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName} (${getPropertyOwnerTypeText(getPropertyData(propertyIndex).ownerType)}), {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(intToBool(getPropertyData(propertyIndex).locked))}, {MAINCOLOUR}ID: {ALTCOLOUR}${propertyIndex}/${getPropertyData(propertyIndex).databaseId}`);
}

// ===========================================================================

function getPropertyFloorItemsCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	showPropertyFloorInventoryToPlayer(client, propertyIndex);
}

// ===========================================================================

function getPropertyStorageItemsCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	showPropertyStorageInventoryToPlayer(client, propertyIndex);
}

// ===========================================================================

function setPropertyPickupCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
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

		getPropertyData(propertyIndex).entrancePickupModel = getGameConfig().pickupModels[getGame()][typeParam];
	} else {
		getPropertyData(propertyIndex).entrancePickupModel = toInteger(typeParam);
	}

	resetPropertyPickups(propertyIndex);

	getPropertyData(propertyIndex).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} pickup display to {ALTCOLOUR}${typeParam}!`);
}

// ===========================================================================

function setPropertyInteriorTypeCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (typeof getGameConfig().interiors[getGame()] == "undefined") {
		messagePlayerError(client, `There are no interiors available for this game!`);
		return false;
	}

	if (isNaN(typeParam)) {
		if (toLowerCase(typeParam) == "None") {
			getPropertyData(propertyIndex).exitPosition = toVector3(0.0, 0.0, 0.0);
			getPropertyData(propertyIndex).exitDimension = 0;
			getPropertyData(propertyIndex).exitInterior = -1;
			getPropertyData(propertyIndex).hasInterior = false;
			getPropertyData(propertyIndex).entranceScene = "";
			getPropertyData(propertyIndex).exitScene = "";
			getPropertyData(propertyIndex).exitPickupModel = -1;
			getPropertyData(propertyIndex).customInterior = false;
			messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} interior`);
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

		getPropertyData(propertyIndex).exitPosition = getGameConfig().interiors[getGame()][typeParam][0];
		getPropertyData(propertyIndex).exitInterior = getGameConfig().interiors[getGame()][typeParam][1];
		getPropertyData(propertyIndex).exitDimension = getPropertyData(propertyIndex).databaseId + getGlobalConfig().propertyDimensionStart;
		getPropertyData(propertyIndex).exitPickupModel = getGameConfig().pickupModels[getGame()].Exit;
		getPropertyData(propertyIndex).hasInterior = true;
		getPropertyData(propertyIndex).customInterior = getGameConfig().interiors[getGame()][typeParam][2];

		if (isGameFeatureSupported("interiorScene")) {
			if (isMainWorldScene(getPlayerData(client).scene)) {
				getPropertyData(propertyIndex).exitScene = getGameConfig().mainWorldScene[getGame()];
			} else {
				getPropertyData(propertyIndex).exitScene = getGameConfig().interiors[getGame()][typeParam][3];
			}
		}
	}

	//deletePropertyExitPickup(propertyIndex);
	//deletePropertyExitBlip(propertyIndex);
	//createPropertyExitBlip(propertyIndex);
	//createPropertyExitPickup(propertyIndex);

	resetPropertyPickups(propertyIndex);

	getPropertyData(propertyIndex).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} interior type to {ALTCOLOUR}${typeParam}`);
}

// ===========================================================================

function addPropertyPropertyTemplateEntities(command, params, client) {
	let propertyTemplateParam = getParam(params, " ", 1) || "business";
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
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

		getPropertyData(propertyIndex).exitPosition = getGameConfig().interiors[getGame()][typeParam][0];
		getPropertyData(propertyIndex).exitInterior = getGameConfig().interiors[getGame()][typeParam][1];
		getPropertyData(propertyIndex).exitDimension = getPropertyData(propertyIndex).databaseId + getGlobalConfig().businessDimensionStart;
		getPropertyData(propertyIndex).exitPickupModel = getGameConfig().pickupModels[getGame()].Exit;
		getPropertyData(propertyIndex).hasInterior = true;
		getPropertyData(propertyIndex).customInterior = getGameConfig().interiors[getGame()][typeParam][2];
		getPropertyData(propertyIndex).interiorScene = getGameConfig().interiors[getGame()][typeParam][3];
	}

	//deletePropertyExitPickup(propertyIndex);
	//deletePropertyExitBlip(propertyIndex);
	//createPropertyExitBlip(propertyIndex);
	//createPropertyExitPickup(propertyIndex);

	resetPropertyPickups(propertyIndex);

	getPropertyData(propertyIndex).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} interior type to {ALTCOLOUR}${typeParam}`);
}

// ===========================================================================

function setPropertyBlipCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (isNaN(typeParam)) {
		if (isNull(getGameConfig().blipSprites[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid property type! Use a property type name or a blip image ID");

			let blipTypes = Object.keys(getGameConfig().blipSprites[getGame()]);
			let chunkedList = splitArrayIntoChunks(blipTypes, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBlipTypes")));
			for (let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getPropertyData(propertyIndex).entranceBlipModel = getGameConfig().blipSprites[getGame()][typeParam];
	} else {
		getPropertyData(propertyIndex).entranceBlipModel = toInteger(typeParam);
	}

	resetPropertyBlips(propertyIndex);
	getPropertyData(propertyIndex).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set business ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} blip display to {ALTCOLOUR}${typeParam}`);
}

// ===========================================================================

function giveDefaultItemsToPropertyCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "business";
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!isNaN(typeParam)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (isNull(getGameConfig().defaultPropertyItems[getGame()][typeParam])) {
		messagePlayerError(client, "Invalid property items type! Use a property items type name");
		let businessItemTypes = Object.keys(getGameConfig().defaultPropertyItems[getGame()]);
		let chunkedList = splitArrayIntoChunks(businessItemTypes, 10);

		messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderDefaultPropertyItemTypes")));
		for (let i in chunkedList) {
			messagePlayerInfo(client, chunkedList[i].join(", "));
		}
		return false;
	}

	for (let i in getGameConfig().defaultPropertyItems[getGame()][typeParam]) {
		let itemTypeId = getItemTypeFromParams(getGameConfig().defaultPropertyItems[getGame()][typeParam][i][0]);
		let itemTypeData = getItemTypeData(itemTypeId);
		if (itemTypeData) {
			let newItemIndex = createItem(itemTypeId, itemTypeData.orderValue, AGRP_ITEM_OWNER_BIZFLOOR, getPropertyData(propertyIndex).databaseId, getGameConfig().defaultPropertyItems[getGame()][typeParam][i][1]);
			getItemData(newItemIndex).buyPrice = applyServerInflationMultiplier(itemTypeData.orderPrice) * getGameConfig().defaultPropertyItems[getGame()][typeParam][i][2];
		}
	}

	cachePropertyItems(propertyIndex);
	updatePropertyPickupLabelData(propertyIndex);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} gave property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} the default items for ${toLowerCase(typeParam)}`);
}

// ===========================================================================

function setPropertyDealershipCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	getPropertyData(propertyIndex).labelHelpType == AGRP_PROPLABEL_INFO_ENTERVEHICLE;
	getPropertyData(propertyIndex).type = AGRP_BIZ_TYPE_DEALERSHIP;
	updatePropertyPickupLabelData(propertyIndex);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the property type of ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} to dealership`);
}

// ===========================================================================

function deletePropertyFloorItemsCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let tempCache = getPropertyData(propertyIndex).floorItemCache;
	for (let i in tempCache) {
		deleteItem(tempCache[i]);
	}

	cachePropertyItems(propertyIndex);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted all on-sale items for property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}`);
}

// ===========================================================================

function deletePropertyStorageItemsCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let tempCache = getPropertyData(propertyIndex).storageItemCache;
	for (let i in tempCache) {
		deleteItem(tempCache[i]);
	}

	cachePropertyItems(propertyIndex);

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted all stored items for property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}`);
}

// ===========================================================================

function withdrawFromPropertyCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	if (getPropertyData(propertyIndex).till < amount) {
		messagePlayerError(client, `Property ${getInlinePropertyColour(propertyIndex)}${tempPropertyData.name} doesn't have that much money! Use /bizbalance.`);
		return false;
	}

	getPropertyData(propertyIndex).till -= amount;
	givePlayerCash(client, amount);
	updatePlayerCash(client);
	getPropertyData(propertyIndex).needsSaved = true;

	messagePlayerSuccess(client, `You withdrew ${getCurrencyString(amount)} from property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name} till`);
}

// ===========================================================================

function setPropertyBuyPriceCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	if (amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getPropertyData(propertyIndex).buyPrice = amount;
	setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.price", getPropertyData(propertyIndex).buyPrice, true);

	getPropertyData(propertyIndex).needsSaved = true;
	messagePlayerSuccess(client, `{MAINCOLOUR}You set property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}'s{MAINCOLOUR} for-sale price to {ALTCOLOUR}${getCurrencyString(amount)}`);
}

// ===========================================================================

function depositIntoPropertyCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	// Let anybody deposit money
	//if(!canPlayerManageProperty(client, propertyIndex)) {
	//	messagePlayerError(client, "You can't deposit cash into this property!");
	//	return false;
	//}

	if (getPlayerCurrentSubAccount(client).cash < amount) {
		messagePlayerError(client, `You don't have that much money! You only have ${getCurrencyString(getPlayerCurrentSubAccount(client).cash)}`);
		return false;
	}

	getPropertyData(propertyIndex).till += amount;
	takePlayerCash(client, amount);
	updatePlayerCash(client);

	getPropertyData(propertyIndex).needsSaved = true;
	messagePlayerSuccess(client, `You deposited ${getCurrencyString(amount)} into property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} till`);
}

// ===========================================================================

function orderItemForPropertyCommand(command, params, client) {
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
	let propertyIndex = getPlayerProperty(client);

	logToConsole(LOG_DEBUG, `[AGRP.Property] ${getPlayerDisplayForConsole(client)} is ordering ${amount} ${splitParams.slice(0, -2).join(" ")} (${value})`);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	let orderTotalCost = pricePerItem * amount;

	//getPlayerData(client).promptType = AGRP_PROMPT_BIZORDER;
	getPlayerData(client).businessOrderAmount = amount;
	getPlayerData(client).businessOrderProperty = propertyIndex;
	getPlayerData(client).businessOrderItem = itemType;
	getPlayerData(client).businessOrderValue = value;
	getPlayerData(client).businessOrderCost = orderTotalCost;

	getPropertyData(propertyIndex).needsSaved = true;
	showPlayerPrompt(client, `Ordering ${amount} ${getPluralForm(getItemTypeData(itemType).name)} (${getItemValueDisplay(itemType, value)}) at ${getCurrencyString(pricePerItem)} each will cost a total of ${getCurrencyString(orderTotalCost)}`, "Property Order Cost");
	getPlayerData(client).promptType = AGRP_PROMPT_BIZORDER;
}

// ===========================================================================

function orderItemForProperty(propertyIndex, itemType, amount) {
	if (getPropertyData(propertyIndex).till < orderTotalCost) {
		let neededAmount = orderTotalCost - getPropertyData(propertyIndex).till;
		//messagePlayerError(client, `The business doesn't have enough money (needs {ALTCOLOUR}${getCurrencyString(neededAmount)} {MAINCOLOUR}more)! Use {ALTCOLOUR}/bizdeposit {MAINCOLOUR}to add money to the business.`);
		return false;
	}

	getPropertyData(propertyIndex).till -= orderTotalCost;
	addToPropertyInventory(propertyIndex, itemType, amount);
	//messagePlayerSuccess(client, `You ordered ${amount} ${getPluralForm(getItemTypeData(itemType).name)} (${getItemValueDisplay(itemType, value)}) at ${getCurrencyString(getItemTypeData(itemType).orderPrice)} each for business ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}`);
}

// ===========================================================================

function viewPropertyTillAmountCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (!canPlayerManageProperty(client, propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantModifyProperty"));
		return false;
	}

	messagePlayerSuccess(client, `Property ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} till has {ALTCOLOUR}${getCurrencyString(getPropertyData(propertyIndex).till)}`);
}

// ===========================================================================

function buyPropertyCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (getPropertyData(propertyIndex).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "PropertyNotForSale"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).cash < getPropertyData(propertyIndex).buyPrice) {
		messagePlayerError(client, getLocaleString(client, "PropertyPurchaseNotEnoughMoney"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "BuyPropertyConfirmMessage"), getLocaleString(client, "BuyPropertyConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = AGRP_PROMPT_BIZBUY;
}

// ===========================================================================

function movePropertyEntranceCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	getPropertyData(propertyIndex).entrancePosition = getPlayerPosition(client);
	getPropertyData(propertyIndex).entranceDimension = getPlayerDimension(client);
	getPropertyData(propertyIndex).entranceInterior = getPlayerInterior(client);

	//deletePropertyEntranceBlip(propertyIndex);
	//deletePropertyEntrancePickup(propertyIndex);
	//createPropertyEntranceBlip(propertyIndex);
	//createPropertyEntrancePickup(propertyIndex);

	resetPropertyPickups(propertyIndex);
	resetPropertyBlips(propertyIndex);

	getPropertyData(propertyIndex).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved business ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR} entrance to their position`);
}

// ===========================================================================

function movePropertyExitCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!areParamsEmpty(params)) {
		propertyIndex = getPropertyFromParams(params);
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	getPropertyData(propertyIndex).exitPosition = getPlayerPosition(client);
	getPropertyData(propertyIndex).exitDimension = getPlayerDimension(client);
	getPropertyData(propertyIndex).exitInterior = getPlayerInterior(client);

	deletePropertyExitBlip(propertyIndex);
	deletePropertyExitPickup(propertyIndex);

	createPropertyExitBlip(propertyIndex);
	createPropertyExitPickup(propertyIndex);

	getPropertyData(propertyIndex).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved business ${getInlinePropertyColour(propertyIndex)}${getPropertyData(propertyIndex).name}{MAINCOLOUR}exit to their position`);
}

// ===========================================================================

function getPropertyDataFromDatabaseId(databaseId) {
	if (databaseId <= 0) {
		return false;
	}

	let matchingPropertyes = getServerData().properties.filter(b => b.databaseId == databaseId)
	if (matchingPropertyes.length == 1) {
		return matchingPropertyes[0];
	}
	return false;
}

// ===========================================================================

function getClosestPropertyEntrance(position, dimension) {
	let closest = 0;
	for (let i in getServerData().properties) {
		if (getServerData().properties[i].entranceDimension == dimension) {
			if (getDistance(position, getServerData().properties[i].entrancePosition) <= getDistance(position, getServerData().properties[closest].entrancePosition)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function getClosestPropertyExit(position, dimension) {
	let closest = 0;
	for (let i in getServerData().properties) {
		if (getServerData().properties[i].hasInterior && getServerData().properties[i].exitDimension == dimension) {
			if (getDistance(position, getServerData().properties[i].exitPosition) <= getDistance(position, getServerData().properties[closest].exitPosition)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function isPlayerInAnyProperty(client) {
	for (let i in getServerData().properties) {
		if (getServerData().properties[i].hasInterior && getServerData().properties[i].exitDimension == getPlayerDimension(client)) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getPlayerProperty(client) {
	if (getServerData().properties.length == 0) {
		return -1;
	}

	if (getPlayerDimension(client) == getGameConfig().mainWorldDimension[getGame()]) {
		let closestEntrance = getClosestPropertyEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getPlayerPosition(client), getPropertyData(closestEntrance).entrancePosition) <= getGlobalConfig().enterPropertyDistance) {
			return getPropertyData(closestEntrance).index;
		}
	} else {
		let closestEntrance = getClosestPropertyEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getPlayerPosition(client), getPropertyData(closestEntrance).entrancePosition) <= getGlobalConfig().enterPropertyDistance) {
			return getPropertyData(closestEntrance).index;
		}

		for (let i in getServerData().properties) {
			if (getServerData().properties[i].hasInterior && getServerData().properties[i].exitDimension == getPlayerDimension(client)) {
				return i;
			}
		}
	}
	return -1;
}

// ===========================================================================

function saveAllPropertyesToDatabase() {
	if (getServerConfig().devServer) {
		return false;
	}

	for (let i in getServerData().properties) {
		if (getServerData().properties[i].needsSaved) {
			savePropertyToDatabase(i);
		}
	}

	return true
}

// ===========================================================================

function savePropertyToDatabase(propertyIndex) {
	let tempPropertyData = getServerData().properties[propertyIndex];

	if (!tempPropertyData.needsSaved) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.Property]: Saving business '${tempPropertyData.name}' to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safePropertyName = escapeDatabaseString(dbConnection, tempPropertyData.name);

		let data = [
			["prop_server", getServerId()],
			["prop_name", safePropertyName],
			["prop_owner_type", tempPropertyData.ownerType],
			["prop_owner_id", tempPropertyData.ownerId],
			["prop_locked", boolToInt(tempPropertyData.locked)],
			["prop_entrance_fee", tempPropertyData.entranceFee],
			["prop_till", tempPropertyData.till],
			["prop_entrance_pos_x", tempPropertyData.entrancePosition.x],
			["prop_entrance_pos_y", tempPropertyData.entrancePosition.y],
			["prop_entrance_pos_z", tempPropertyData.entrancePosition.z],
			["prop_entrance_rot_z", tempPropertyData.entranceRotation],
			["prop_entrance_int", tempPropertyData.entranceInterior],
			["prop_entrance_vw", tempPropertyData.entranceDimension],
			["prop_entrance_pickup", tempPropertyData.entrancePickupModel],
			["prop_entrance_blip", tempPropertyData.entranceBlipModel],
			["prop_entrance_scene", tempPropertyData.entranceScene],
			["prop_exit_pos_x", tempPropertyData.exitPosition.x],
			["prop_exit_pos_y", tempPropertyData.exitPosition.y],
			["prop_exit_pos_z", tempPropertyData.exitPosition.z],
			["prop_exit_rot_z", tempPropertyData.exitRotation],
			["prop_exit_int", tempPropertyData.exitInterior],
			["prop_exit_vw", tempPropertyData.exitDimension],
			["prop_exit_pickup", tempPropertyData.exitPickupModel],
			["prop_exit_blip", tempPropertyData.exitBlipModel],
			["prop_exit_scene", tempPropertyData.exitScene],
			["prop_has_interior", boolToInt(tempPropertyData.hasInterior)],
			["prop_interior_lights", boolToInt(tempPropertyData.interiorLights)],
			["prop_label_help_type", tempPropertyData.labelHelpType],
			["prop_radio_station", (getRadioStationData(tempPropertyData.streamingRadioStationIndex) != false) ? toInteger(getRadioStationData(tempPropertyData.streamingRadioStationIndex).databaseId) : -1],
			["prop_custom_interior", boolToInt(tempPropertyData.customInterior)],
			["prop_buy_price", tempPropertyData.buyPrice],
			//["prop_rent_price", tempPropertyData.rentPrice],
		];

		let dbQuery = null;
		if (tempPropertyData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("prop_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			getServerData().properties[propertyIndex].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("prop_main", data, `prop_id=${tempPropertyData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		getPropertyData(propertyIndex).needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[AGRP.Property]: Saved property '${tempPropertyData.name}' to database!`);

	return false;
}

// ===========================================================================

function createAllPropertyPickups() {
	if (!getServerConfig().createPropertyPickups) {
		return false;
	}

	for (let i in getServerData().properties) {
		createPropertyEntrancePickup(i);
		createPropertyExitPickup(i);
		updatePropertyPickupLabelData(i);
	}

	return true;
}

// ===========================================================================

function createAllPropertyBlips() {
	if (!getServerConfig().createPropertyBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	for (let i in getServerData().properties) {
		createPropertyEntranceBlip(i);
		createPropertyExitBlip(i);
	}
}

// ===========================================================================

function createPropertyEntrancePickup(propertyIndex) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!getServerConfig().createPropertyPickups) {
		return false;
	}

	let propertyData = getPropertyData(propertyIndex);

	//if(propertyData.hasInterior) {
	//	return false;
	//}

	if (propertyData.entrancePickupModel == -1) {
		return false;
	}

	logToConsole(LOG_VERBOSE, `[AGRP.Job]: Creating entrance pickup for property ${propertyData.name}`);

	if (areServerElementsSupported() && getGame() != AGRP_GAME_MAFIA_ONE) {
		let entrancePickup = null;
		if (isGameFeatureSupported("pickup")) {
			let pickupModelId = getGameConfig().pickupModels[getGame()].Property;

			if (propertyData.entrancePickupModel != 0) {
				pickupModelId = propertyData.entrancePickupModel;
			}

			entrancePickup = createGamePickup(pickupModelId, propertyData.entrancePosition, getGameConfig().pickupTypes[getGame()].business);
		} else if (isGameFeatureSupported("dummyElement")) {
			entrancePickup = createGameDummyElement(propertyData.entrancePosition);
		}

		if (entrancePickup != null) {
			if (propertyData.entranceDimension != -1) {
				setElementDimension(entrancePickup, propertyData.entranceDimension);
				setElementOnAllDimensions(entrancePickup, false);
			} else {
				setElementOnAllDimensions(entrancePickup, true);
			}

			if (getGlobalConfig().propertyPickupStreamInDistance == -1 || getGlobalConfig().propertyPickupStreamOutDistance == -1) {
				entrancePickup.netFlags.distanceStreaming = false;
			} else {
				setElementStreamInDistance(entrancePickup, getGlobalConfig().propertyPickupStreamInDistance);
				setElementStreamOutDistance(entrancePickup, getGlobalConfig().propertyPickupStreamOutDistance);
			}
			setElementTransient(entrancePickup, false);
			getPropertyData(propertyIndex).entrancePickup = entrancePickup;
			updatePropertyPickupLabelData(propertyIndex);
		}
	} else {
		let pickupModelId = getGameConfig().pickupModels[getGame()].Property;

		if (propertyData.entrancePickupModel != 0) {
			pickupModelId = propertyData.entrancePickupModel;
		}
		sendPropertyToPlayer(null, propertyIndex, propertyData.name, propertyData.entrancePosition, blipModelId, pickupModelId, propertyData.hasInterior, propertyData.buyPrice, propertyData.rentPrice, doesPropertyHaveAnyItemsToBuy(propertyIndex));
	}

	return false;
}

// ===========================================================================

function createPropertyEntranceBlip(propertyIndex) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!getServerConfig().createPropertyBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	let propertyData = getPropertyData(propertyIndex);

	//if(propertyData.hasInterior) {
	//	return false;
	//}

	if (propertyData.entranceBlipModel == -1) {
		return false;
	}

	let blipModelId = getGameConfig().blipSprites[getGame()].Property;

	if (propertyData.entranceBlipModel != 0) {
		blipModelId = propertyData.entranceBlipModel;
	}

	logToConsole(LOG_VERBOSE, `[AGRP.Job]: Creating entrance blip for business ${propertyData.name} (model ${blipModelId})`);

	if (areServerElementsSupported()) {
		let entranceBlip = createGameBlip(propertyData.entrancePosition, blipModelId, 1, getColourByType("propertyColour"));
		if (entranceBlip != null) {
			if (propertyData.entranceDimension != -1) {
				setElementDimension(entranceBlip, propertyData.entranceDimension);
				setElementOnAllDimensions(entranceBlip, false);
			} else {
				setElementOnAllDimensions(entranceBlip, true);
			}

			if (getGlobalConfig().propertyBlipStreamInDistance == -1 || getGlobalConfig().propertyBlipStreamOutDistance == -1) {
				entranceBlip.netFlags.distanceStreaming = false;
			} else {
				setElementStreamInDistance(entranceBlip, getGlobalConfig().propertyBlipStreamInDistance);
				setElementStreamOutDistance(entranceBlip, getGlobalConfig().propertyBlipStreamOutDistance);
			}
			setElementTransient(entranceBlip, false);
			propertyData.entranceBlip = entranceBlip;
		}
	}
}

// ===========================================================================

function createPropertyExitPickup(propertyIndex) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!getServerConfig().createPropertyPickups) {
		return false;
	}

	let propertyData = getPropertyData(propertyIndex);

	//if(!propertyData.hasInterior) {
	//	return false;
	//}

	if (propertyData.exitPickupModel == -1) {
		return false;
	}

	logToConsole(LOG_VERBOSE, `[AGRP.Job]: Creating exit pickup for business ${propertyData.name}`);

	let exitPickup = null;
	if (isGameFeatureSupported("pickup")) {
		let pickupModelId = getGameConfig().pickupModels[getGame()].Exit;

		if (propertyData.exitPickupModel != 0) {
			pickupModelId = propertyData.exitPickupModel;
		}

		exitPickup = createGamePickup(pickupModelId, propertyData.exitPosition, getGameConfig().pickupTypes[getGame()].business);
	} else if (isGameFeatureSupported("dummyElement")) {
		//exitPickup = createGameDummyElement(propertyData.exitPosition);
	}

	if (exitPickup != null) {
		if (propertyData.exitDimension != -1) {
			setElementDimension(exitPickup, propertyData.exitDimension);
			setElementOnAllDimensions(exitPickup, false);
		} else {
			setElementOnAllDimensions(exitPickup, true);
		}

		if (getGlobalConfig().propertyPickupStreamInDistance == -1 || getGlobalConfig().propertyPickupStreamOutDistance == -1) {
			exitPickup.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(exitPickup, getGlobalConfig().propertyPickupStreamInDistance);
			setElementStreamOutDistance(exitPickup, getGlobalConfig().propertyPickupStreamOutDistance);
		}
		setElementTransient(exitPickup, false);
		getPropertyData(propertyIndex).exitPickup = exitPickup;
		updatePropertyPickupLabelData(propertyIndex);
	}

}

// ===========================================================================

function createPropertyExitBlip(propertyIndex) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!getServerConfig().createPropertyBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	let propertyData = getPropertyData(propertyIndex);

	//if(!propertyData.hasInterior) {
	//	return false;
	//}

	if (propertyData.exitBlipModel == -1) {
		return false;
	}

	let blipModelId = getGameConfig().blipSprites[getGame()].Property;

	if (propertyData.exitBlipModel != 0) {
		blipModelId = propertyData.exitBlipModel;
	}

	logToConsole(LOG_VERBOSE, `[AGRP.Job]: Creating exit blip for property ${propertyData.name} (model ${blipModelId})`);

	let exitBlip = createGameBlip(propertyData.exitPosition, blipModelId, 1, getColourByName("propertyColour"));
	if (exitBlip != null) {
		if (propertyData.exitDimension != -1) {
			setElementDimension(exitBlip, propertyData.exitDimension);
			setElementOnAllDimensions(exitBlip, false);
		} else {
			setElementOnAllDimensions(exitBlip, true);
		}

		if (getGlobalConfig().propertyBlipStreamInDistance == -1 || getGlobalConfig().propertyBlipStreamOutDistance == -1) {
			exitBlip.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(exitBlip, getGlobalConfig().propertyBlipStreamInDistance);
			setElementStreamOutDistance(exitBlip, getGlobalConfig().propertyBlipStreamOutDistance);
		}
		setElementTransient(exitBlip, false);
		propertyData.exitBlip = exitBlip;
	}
}

// ===========================================================================

function deleteProperty(propertyIndex, whoDeleted = 0) {
	let tempPropertyData = getPropertyData(propertyIndex);

	let dbConnection = connectToDatabase();
	let dbQuery = null;

	deleteProperdeletePropertyPickupstyBlips(propertyIndex);
	(propertyIndex);

	if (dbConnection) {
		dbQuery = queryDatabase(dbConnection, `UPDATE prop_main SET prop_deleted = 1, prop_when_deleted = UNIX_TIMESTAMP(), prop_who_deleted = ${whoDeleted} WHERE prop_id = ${tempPropertyData.databaseId}`);
		if (dbQuery) {
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	removePlayersFromProperty(propertyIndex);

	getServerData().properties.splice(propertyIndex, 1);

	return true;
}

// ===========================================================================

function removePlayersFromProperty(propertyIndex) {
	getClients().forEach(function (client) {
		if (doesPropertyHaveInterior(propertyIndex)) {
			if (getPlayerProperty(client) == propertyIndex) {
				if (getPlayerInterior(client) == getPropertyData(propertyIndex).exitInterior && getPlayerDimension(client) == getPropertyData(propertyIndex).exitDimension) {
					exitProperty(client);
				}
			}
		}
	});

	return true;
}

// ===========================================================================

function removePlayerFromProperty(client) {
	exitProperty(client);
	return false;
}

// ===========================================================================

function exitProperty(client) {
	let propertyIndex = getPlayerProperty(client);

	if (propertyIndex == false) {
		return false;
	}

	if (isPlayerSpawned(client)) {
		setPlayerInterior(client, getServerData().properties[propertyIndex].entranceInterior);
		setPlayerDimension(client, getServerData().properties[propertyIndex].entranceDimension);
		setPlayerPosition(client, getServerData().properties[propertyIndex].entrancePosition);
		return true;
	}

	return false;
}

// ===========================================================================

function getPropertyOwnerTypeText(ownerType) {
	switch (ownerType) {
		case AGRP_BIZ_OWNER_CLAN:
			return "clan";

		case AGRP_BIZ_OWNER_JOB:
			return "job";

		case AGRP_BIZ_OWNER_PLAYER:
			return "player";

		case AGRP_BIZ_OWNER_NONE:
		case AGRP_BIZ_OWNER_PUBLIC:
			return "not owned";

		default:
			return "unknown";
	}
}

// ===========================================================================

function getPropertyData(propertyIndex) {
	if (propertyIndex == -1) {
		return false;
	}

	if (typeof getServerData().properties[propertyIndex] != null) {
		return getServerData().properties[propertyIndex];
	}
	return false;
}

// ===========================================================================

function doesPropertyHaveInterior(propertyIndex) {
	return getPropertyData(propertyIndex).hasInterior;
}

// ===========================================================================

function deletePropertyEntrancePickup(propertyIndex) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (getPropertyData(propertyIndex).entrancePickup != null) {
		deleteGameElement(getPropertyData(propertyIndex).entrancePickup);
		getPropertyData(propertyIndex).entrancePickup = null;

		return true;
	}

	return false;
}

// ===========================================================================

function deletePropertyExitPickup(propertyIndex) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (getPropertyData(propertyIndex).exitPickup != null) {
		//removeFromWorld(getPropertyData(propertyIndex).exitPickup);
		deleteGameElement(getPropertyData(propertyIndex).exitPickup);
		getPropertyData(propertyIndex).exitPickup = null;
	}
}

// ===========================================================================

function deletePropertyEntranceBlip(propertyIndex) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	if (getPropertyData(propertyIndex).entranceBlip != null) {
		//removeFromWorld(getPropertyData(propertyIndex).entranceBlip);
		deleteGameElement(getPropertyData(propertyIndex).entranceBlip);
		getPropertyData(propertyIndex).entranceBlip = null;
	}
}

// ===========================================================================

function deletePropertyExitBlip(propertyIndex) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	if (getPropertyData(propertyIndex).exitBlip != null) {
		//removeFromWorld(getPropertyData(propertyIndex).exitBlip);
		deleteGameElement(getPropertyData(propertyIndex).exitBlip);
		getPropertyData(propertyIndex).exitBlip = null;
	}
}

// ===========================================================================

function reloadAllPropertyesCommand(command, params, client) {
	let clients = getClients();
	for (let i in clients) {
		removePlayerFromProperty(clients[i]);
	}

	for (let i in getServerData().properties) {
		deletePropertyExitBlip(i);
		deletePropertyEntranceBlip(i);
		deletePropertyExitPickup(i);
		deletePropertyEntrancePickup(i);
	}

	//forceAllPlayersToStopWorking();
	clearArray(getServerData().properties);
	getServerData().properties = loadPropertyesFromDatabase();
	createAllPropertyPickups();
	createAllPropertyBlips();
	setPropertyDataIndexes();
	cacheAllPropertyItems();

	announceAdminAction(`AllPropertyesReloaded`);
}

// ===========================================================================

function setPropertyDataIndexes() {
	for (let i in getServerData().properties) {
		getServerData().properties[i].index = i;

		//if (getServerData().properties[i].streamingRadioStation > 0) {
		//	let radioStationIndex = getRadioStationFromDatabaseId(getServerData().properties[i].streamingRadioStation);
		//	if (radioStationIndex != -1) {
		//		getServerData().properties[i].streamingRadioStationIndex = radioStationIndex;
		//	}
		//}

		for (let j in getServerData().properties[i].locations) {
			if (getServerData().properties[i].locations[j].type == AGRP_BIZ_LOC_ATM) {
				getServerData().atmLocationCache.push([i, j, getServerData().properties[i].locations[j].position]);
			}
		}
	}
}

// ===========================================================================

// Adds an item to a property inventory by item type, amount and buy price
function addToPropertyInventory(propertyIndex, itemType, amount, buyPrice) {
	let tempItemData = new ItemData(false);
	tempItemData.amount = amount;
	tempItemData.buyPrice = buyPrice;
	tempItemData.itemType = getItemTypeData(itemType).databaseId;
	tempItemData.ownerId = getPropertyData(propertyIndex).databaseId;
	tempItemData.ownerType = AGRP_ITEMOWNER_BIZ;
	tempItemData.ownerIndex = propertyIndex;
	tempItemData.itemTypeIndex = itemType;
	saveItemToDatabase(tempItemData);
	getServerData().items.push(tempItemData);

	let index = getServerData().items.length - 1;
	getServerData().items[index].index = index;
}

// ===========================================================================

function buyFromPropertyCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (areParamsEmpty(params)) {
		showPropertyFloorInventoryToPlayer(client, propertyIndex);
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	if (getPropertyData(propertyIndex).locked) {
		messagePlayerError(client, `This property is closed!`);
		return false;
	}

	if (getPropertyData(propertyIndex).hasInterior) {
		if (!getPlayerProperty(client)) {
			if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "enter")) {
				messagePlayerTip(client, getLocaleString(client, "NeedToEnterPropertyKeyPress", getLocaleString(client, getPropertyTypeName(propertyIndex)), `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "enter")).key)}{MAINCOLOUR}`));
			} else {
				messagePlayerNormal(client, getLocaleString(client, "NeedToEnterPropertyCommand", getLocaleString(client, getPropertyTypeName(propertyIndex)), "{ALTCOLOUR}/enter{MAINCOLOUR}"));
			}
			return false;
		}
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 1;

	if (typeof getPropertyData(propertyIndex).floorItemCache[itemSlot - 1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if (getPropertyData(propertyIndex).floorItemCache[itemSlot - 1] == -1) {
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

	if (getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).amount < amount) {
		messagePlayerError(client, `There are only ${getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).amount} ${getItemTypeData(getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).itemTypeIndex).name} in slot ${itemSlot - 1}`);
		return false;
	}

	let firstSlot = getPlayerFirstEmptyHotBarSlot(client);
	if (firstSlot == -1) {
		messagePlayerError(client, messagePlayerError(client, getLocaleString(client, "InventoryFullCantCarry")));
		return false;
	}

	let totalCost = getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).buyPrice * amount;
	let itemName = getItemTypeData(getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).itemTypeIndex).name;

	if (getPlayerCurrentSubAccount(client).cash < totalCost) {
		messagePlayerError(client, getLocaleString(client, "NotEnoughCashNeedAmountMore", `{ALTCOLOUR}${getPropertyData(propertyIndex).floorItemCache[itemSlot - 1].buyPrice * amount - getPlayerCurrentSubAccount(client).cash}{MAINCOLOUR}`));
		return false;
	}

	takePlayerCash(client, totalCost);
	createItem(getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).itemTypeIndex, getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).value, AGRP_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId, amount);
	cachePlayerHotBarItems(client);
	getPropertyData(propertyIndex).till = getPropertyData(propertyIndex).till + totalCost;

	getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).amount = getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).amount - amount;
	if (getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).amount == 0) {
		destroyItem(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]);
	}

	let useType = getItemTypeData(getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).itemTypeIndex).useType;
	if (useType == AGRP_ITEM_USE_TYPE_WEAPON || AGRP_ITEM_USE_TYPE_TAZER || useType == AGRP_ITEM_USE_TYPE_AMMO_CLIP) {
		if (isPlayerWeaponBanned(client) && !isPlayerExemptFromAntiCheat(client)) {
			messagePlayerError(client, getLocaleString(client, "WeaponBanned"));
			return false;
		}
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

	markPlayerActionTipSeen(client, "ViewInventory");
}

// ===========================================================================

function setPropertyItemSellPriceCommand(command, params, client) {
	let propertyIndex = getPropertyFromParams(getParam(params, " ", 3)) || getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 0;

	if (typeof getPropertyData(propertyIndex).floorItemCache[itemSlot - 1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot - 1} doesn't exist!`);
		return false;
	}

	if (getPropertyData(propertyIndex).floorItemCache[itemSlot - 1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot - 1} slot is empty!`);
		return false;
	}

	let oldPrice = getPropertyData(propertyIndex).floorItemCache[itemSlot - 1].buyPrice;
	let newPrice = toInteger(getParam(params, " ", 2)) || oldPrice;
	if (newPrice < 0) {
		messagePlayerError(client, "The price can't be negative!");
		return false;
	}

	getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).buyPrice = newPrice;

	messagePlayerSuccess(client, `You changed the price of the {ALTCOLOUR}${getItemTypeData(getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).itemTypeIndex).name}'s {MAINCOLOUR}in slot {ALTCOLOUR}${itemSlot} {MAINCOLOUR}from ${getCurrencyString(oldPrice)} to ${getCurrencyString(newprice)}`);
}

// ===========================================================================

function storeItemInPropertyStorageCommand(command, params, client) {
	let propertyIndex = getPropertyFromParams(getParam(params, " ", 3)) || getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 0;

	if (typeof getPropertyData(propertyIndex).floorItemCache[itemSlot - 1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if (getPropertyData(propertyIndex).floorItemCache[itemSlot - 1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let firstSlot = getPropertyStorageFirstFreeItemSlot(propertyIndex);

	if (firstSlot == -1) {
		messagePlayerError(client, `There isn't any room in this business storage`);
		return false;
	}

	getItemData(getPropertyData(propertyIndex).floorItemCache[itemSlot - 1]).ownerType = AGRP_ITEM_OWNER_BIZSTORAGE;
	getPropertyData(propertyIndex).storageItemCache[firstSlot] = getPropertyData(propertyIndex).floorItemCache[itemSlot - 1];
	getPropertyData(propertyIndex).storageItemCache[itemSlot - 1] = -1;
	messagePlayerSuccess(client, `You moved the ${getItemTypeData(getItemData(getPropertyData(propertyIndex).storageItemCache[firstSlot]).itemTypeIndex).name}s in slot ${itemSlot} to the business storage in slot ${firstSlot}`);
}

// ===========================================================================

function stockItemOnPropertyFloorCommand(command, params, client) {
	let propertyIndex = getPlayerProperty(client);

	if (!getPropertyData(propertyIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidProperty"));
		return false;
	}

	let itemSlot = toInteger(getParam(params, " ", 1)) || 0;

	if (typeof getPropertyData(propertyIndex).storageItemCache[itemSlot - 1] == "undefined") {
		messagePlayerError(client, `Item slot ${itemSlot} doesn't exist!`);
		return false;
	}

	if (getPropertyData(propertyIndex).storageItemCache[itemSlot - 1] == -1) {
		messagePlayerError(client, `Item slot ${itemSlot} slot is empty!`);
		return false;
	}

	let firstSlot = getPropertyFloorFirstFreeItemSlot(propertyIndex);

	if (firstSlot == -1) {
		messagePlayerError(client, `There isn't any room in this business storage`);
		return false;
	}

	getItemData(getPropertyData(propertyIndex).storageItemCache[itemSlot - 1]).ownerType = AGRP_ITEM_OWNER_BIZFLOOR;
	getPropertyData(propertyIndex).floorItemCache[firstSlot] = getPropertyData(propertyIndex).storageItemCache[itemSlot - 1];
	getPropertyData(propertyIndex).storageItemCache[itemSlot - 1] = -1;
	messagePlayerSuccess(client, `You moved the ${getItemTypeData(getItemData(getPropertyData(propertyIndex).storageItemCache[firstSlot]).itemTypeIndex).name}s in slot ${itemSlot} of the business storage to the business floor slot ${firstSlot}`);
}

// ===========================================================================

// Gets the first free slot in a business's storage items
function getPropertyStorageFirstFreeItemSlot(propertyIndex) {
	return getPropertyData(propertyIndex).storageItemCache.findIndex(item => item == -1);
}

// ===========================================================================

// Gets the first free slot in a business's floor items
function getPropertyFloorFirstFreeItemSlot(propertyIndex) {
	return getPropertyData(propertyIndex).floorItemCache.findIndex(item => item == -1);
}

// ===========================================================================

// Caches all items for all businesses
function cacheAllPropertyItems() {
	logToConsole(LOG_DEBUG, "[AGRP.Property] Caching all business items ...");
	for (let i in getServerData().properties) {
		cachePropertyItems(i);
	}
	logToConsole(LOG_DEBUG, "[AGRP.Property] Cached all business items successfully!");
}

// ===========================================================================

// Caches all items for a business by propertyIndex
function cachePropertyItems(propertyIndex) {
	clearArray(getPropertyData(propertyIndex).floorItemCache);
	clearArray(getPropertyData(propertyIndex).storageItemCache);

	//let propertyData = getPropertyData(propertyIndex);
	//logToConsole(LOG_VERBOSE, `[AGRP.Property] Caching business items for business ${propertyIndex} (${propertyData.name}) ...`);
	//getPropertyData(propertyIndex).floorItemCache = getServerData().items.filter(item => item.ownerType == AGRP_ITEM_OWNER_BIZFLOOR && item.ownerId == propertyData.databaseId).map(i => i.index);
	//getPropertyData(propertyIndex).storageItemCache = getServerData().items.filter(item => item.ownerType == AGRP_ITEM_OWNER_BIZSTORAGE && item.ownerId == propertyData.databaseId);

	logToConsole(LOG_VERBOSE, `[AGRP.Property] Caching business items for business ${propertyIndex} (${getPropertyData(propertyIndex).name}) ...`);
	for (let i in getServerData().items) {
		if (getItemData(i).ownerType == AGRP_ITEM_OWNER_BIZFLOOR && getItemData(i).ownerId == getPropertyData(propertyIndex).databaseId) {
			getPropertyData(propertyIndex).floorItemCache.push(i);
		} else if (getItemData(i).ownerType == AGRP_ITEM_OWNER_BIZSTORAGE && getItemData(i).ownerId == getPropertyData(propertyIndex).databaseId) {
			getPropertyData(propertyIndex).storageItemCache.push(i);
		}
	}

	logToConsole(LOG_VERBOSE, `[AGRP.Property] Successfully cached ${getPropertyData(propertyIndex).floorItemCache.length} floor items and ${getPropertyData(propertyIndex).storageItemCache} storage items for business ${propertyIndex} (${getPropertyData(propertyIndex).name})!`);
}

// ===========================================================================

// Gets a business's data index from a business's databaseId
function getPropertyIdFromDatabaseId(databaseId) {
	return getServerData().properties.findIndex(business => business.databaseId == databaseId);
}

// ===========================================================================

// Updates all pickup data for a business by propertyIndex
function updatePropertyPickupLabelData(propertyIndex) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (getPropertyData(propertyIndex).exitPickup != null) {
		setEntityData(getPropertyData(propertyIndex).exitPickup, "agrp.owner.type", AGRP_PICKUP_BUSINESS_EXIT, false);
		setEntityData(getPropertyData(propertyIndex).exitPickup, "agrp.owner.id", propertyIndex, false);
		setEntityData(getPropertyData(propertyIndex).exitPickup, "agrp.label.type", AGRP_LABEL_EXIT, true);
	}

	if (getPropertyData(propertyIndex).entrancePickup != null) {
		setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.owner.type", AGRP_PICKUP_BUSINESS_ENTRANCE, false);
		setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.owner.id", propertyIndex, false);
		setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.type", AGRP_LABEL_BUSINESS, true);
		setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.name", getPropertyData(propertyIndex).name, true);
		setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.locked", getPropertyData(propertyIndex).locked, true);
		setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.help", AGRP_PROPLABEL_INFO_NONE, true);

		switch (getPropertyData(propertyIndex).labelHelpType) {
			case AGRP_PROPLABEL_INFO_ENTERVEHICLE: {
				setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.help", AGRP_PROPLABEL_INFO_ENTERVEHICLE, true);
				break;
			}

			case AGRP_PROPLABEL_INFO_ENTER: {
				setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.help", AGRP_PROPLABEL_INFO_ENTER, true);
				break;
			}

			case AGRP_PROPLABEL_INFO_REPAIR: {
				setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.help", AGRP_PROPLABEL_INFO_REPAIR, true);
				break;
			}

			default: {
				if (getPropertyData(propertyIndex).hasInterior) {
					setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.help", AGRP_PROPLABEL_INFO_ENTER, true);
				} else {
					if (doesPropertyHaveAnyItemsToBuy(propertyIndex)) {
						setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.help", AGRP_PROPLABEL_INFO_BUY, true);
					} else {
						removeEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.help");
					}
				}
				break;
			}
		}

		setEntityData(getPropertyData(propertyIndex).entrancePickup, "agrp.label.price", getPropertyData(propertyIndex).buyPrice, true);
	}
}

// ===========================================================================

function resetPropertyPickups(propertyIndex) {
	deletePropertyPickups(propertyIndex);
	createPropertyEntrancePickup(propertyIndex);
	createPropertyExitPickup(propertyIndex);
}

// ===========================================================================

function resetPropertyBlips(propertyIndex) {
	deletePropertyBlips(propertyIndex);
	createPropertyEntranceBlip(propertyIndex);
	createPropertyExitBlip(propertyIndex);
}

// ===========================================================================

function resetAllPropertyPickups(propertyIndex) {
	deletePropertyPickups(propertyIndex);
	createPropertyEntrancePickup(propertyIndex);
	createPropertyExitPickup(propertyIndex);
}

// ===========================================================================

function resetAllPropertyBlips() {
	for (let i in getServerData().properties) {
		deletePropertyBlips(i);
		createPropertyBlips(i);
	}
}

// ===========================================================================

function createPropertyBlips(propertyIndex) {
	createPropertyEntranceBlip(propertyIndex);
	createPropertyExitBlip(propertyIndex);
}

// ===========================================================================

function resetAllPropertyPickups() {
	for (let i in getServerData().properties) {
		deletePropertyPickups(i);
		createPropertyPickups(i);
	}
}

// ===========================================================================

function createPropertyPickups(propertyIndex) {
	createPropertyEntrancePickup(propertyIndex);
	createPropertyExitPickup(propertyIndex);
}

// ===========================================================================

function doesPropertyHaveAnyItemsToBuy(propertyIndex) {
	return (getPropertyData(propertyIndex).floorItemCache.length > 0);
}

// ===========================================================================

//function sendPlayerPropertyGameScripts(client, propertyIndex) {
//	for(let i in getPropertyData(propertyIndex).gameScripts) {
//		sendPlayerGameScriptState(client, getPropertyData(propertyIndex).gameScripts[i].state);
//	}
//}

// ===========================================================================

//function clearPlayerPropertyGameScripts(client, propertyIndex) {
//	for(let i in getPropertyData(propertyIndex).gameScripts) {
//		sendPlayerGameScriptState(client, AGRP_GAMESCRIPT_DENY);
//	}
//}

// ===========================================================================

function updatePropertyInteriorLightsForOccupants(propertyIndex) {
	let clients = getClients()
	for (let i in clients) {
		if (getPlayerProperty(clients[i]) == propertyIndex) {
			updateInteriorLightsForPlayer(clients[i], getPropertyData(propertyIndex).interiorLights);
		}
	}
}

// ===========================================================================

function canPlayerWithdrawFromPropertyTill(client, propertyIndex) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManagePropertyes"))) {
		return true;
	}

	if (getPropertyData(propertyIndex).ownerType == AGRP_BIZ_OWNER_PLAYER && getPropertyData(propertyIndex).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getPropertyData(propertyIndex).ownerType == AGRP_BIZ_OWNER_CLAN && getPropertyData(propertyIndex).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManagePropertyes"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerSetPropertyInteriorLights(client, propertyIndex) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManagePropertyes"))) {
		return true;
	}

	if (getPropertyData(propertyIndex).ownerType == AGRP_BIZ_OWNER_PLAYER && getPropertyData(propertyIndex).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getPropertyData(propertyIndex).ownerType == AGRP_BIZ_OWNER_CLAN && getPropertyData(propertyIndex).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManagePropertyes"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerLockUnlockProperty(client, propertyIndex) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManagePropertyes"))) {
		return true;
	}

	if (getPropertyData(propertyIndex).ownerType == AGRP_BIZ_OWNER_PLAYER && getPropertyData(propertyIndex).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getPropertyData(propertyIndex).ownerType == AGRP_BIZ_OWNER_CLAN && getPropertyData(propertyIndex).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManagePropertyes"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerManageProperty(client, propertyIndex) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManagePropertyes"))) {
		return true;
	}

	if (getPropertyData(propertyIndex).ownerType == AGRP_BIZ_OWNER_PLAYER) {
		if (getPropertyData(propertyIndex).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if (getPropertyData(propertyIndex).ownerType == AGRP_BIZ_OWNER_CLAN) {
		if (getPropertyData(propertyIndex).ownerId == getPlayerClan(client)) {
			if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManagePropertyes"))) {
				return true;
			}

			//if(getPropertyData(propertyIndex).clanRank <= getClanRankData(getPlayerClan(client), getPlayerClanRank(client)).level) {
			//	return true;
			//}
		}
	}

	return false;
}

// ===========================================================================

function deletePropertyBlips(business) {
	deletePropertyExitBlip(business);
	deletePropertyEntranceBlip(business);
}

// ===========================================================================

function deletePropertyPickups(business) {
	deletePropertyExitPickup(business);
	deletePropertyEntrancePickup(business);
}

// ===========================================================================

function getPropertyFromParams(params) {
	if (isNaN(params)) {
		for (let i in getServerData().properties) {
			if (toLowerCase(getServerData().properties[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof getServerData().properties[params] != "undefined") {
			return toInteger(params);
		}
	}
	return false;
}

// ===========================================================================

function deleteAllPropertyBlips() {
	for (let i in getServerData().properties) {
		deletePropertyBlips(i);
	}
}

// ===========================================================================

function deleteAllPropertyPickups() {
	for (let i in getServerData().properties) {
		deletePropertyPickups(i);
	}
}

// ===========================================================================

function getPropertyFromInteriorAndDimension(dimension, interior) {
	let businesses = getServerData().properties;
	for (let i in businesses) {
		if (businesses[i].exitInterior == interior && businesses[i].exitDimension == dimension) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function getClosestPropertyWithBuyableItemOfUseType(position, useType) {
	let availablePropertyes = getPropertyesWithBuyableItemOfUseType(useType);

	let closestProperty = 0;
	for (let i in availablePropertyes) {
		if (getDistance(position, getPropertyData(availablePropertyes[i]).entrancePosition) < getDistance(position, getPropertyData(availablePropertyes[closestProperty]).entrancePosition)) {
			closestProperty = i;
		}
	}
	return availablePropertyes[closestProperty];
}

// ===========================================================================

function getPropertyesWithBuyableItemOfUseType(useType) {
	let businesses = getServerData().properties;
	let availablePropertyes = [];
	for (let i in businesses) {
		if (doesPropertyHaveBuyableItemOfUseType(i, useType)) {
			availablePropertyes.push(i);
		}
	}

	return availablePropertyes;
}

// ===========================================================================

function doesPropertyHaveBuyableItemOfUseType(propertyIndex, useType) {
	let floorItems = getPropertyData(propertyIndex).floorItemCache;
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

function getInlinePropertyColour(propertyIndex) {
	if (getPropertyData(propertyIndex).type == AGRP_PROP_TYPE_HOUSE) {
		return "{houseGreen}";
	} else {
		return "{businessBlue}";
	}
}

// ===========================================================================

function getPropertyTypeName(propertyIndex) {
	if (getPropertyData(propertyIndex).type == AGRP_PROP_TYPE_HOUSE) {
		return "House";
	} else {
		return "Business";
	}
}

// ===========================================================================