// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: house.js
// DESC: Provides house commands, functions, and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// House Location Types
const V_HOUSE_LOC_NONE = 0;                     // None
const V_HOUSE_LOC_GATE = 1;                     // Center of any moveable gate that belongs to the house
const V_HOUSE_LOC_GARAGE = 2;                   // Location for garage (pos1 = outside, pos2 = inside). Use pos to teleport or spawn veh/ped

// ===========================================================================

// House Owner Types
const V_HOUSE_OWNER_NONE = 0;                   // Not owned
const V_HOUSE_OWNER_PLAYER = 1;                 // Owner is a player (character/subaccount)
const V_HOUSE_OWNER_JOB = 2;                    // Owned by a job
const V_HOUSE_OWNER_CLAN = 3;                   // Owned by a clan
const V_HOUSE_OWNER_FACTION = 4;                // Owned by a faction
const V_HOUSE_OWNER_PUBLIC = 5;                 // Is a public house. Technically not owned. This probably won't be used.

// ===========================================================================

/**
 * @class Representing a house's data. Loaded and saved in the database
 */
class HouseData {
	constructor(dbAssoc = false) {
		this.databaseId = 0
		this.description = "";
		this.ownerType = V_HOUSE_OWNER_NONE;
		this.ownerId = 0;
		this.buyPrice = 0;
		this.rentPrice = 0;
		this.renter = 0;
		this.locked = false;
		this.hasInterior = false;
		this.index = -1;
		this.needsSaved = false;
		this.interiorLights = true;
		this.propertyType = V_PROPERTY_TYPE_HOUSE;

		this.itemCache = [];
		this.locations = [];
		//this.gameScripts = [];

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
		this.exitDimension = -1;
		this.exitPickupModel = -1;
		this.exitBlipModel = -1;
		this.exitPickup = null;
		this.exitBlip = null;
		this.exitScene = "";

		this.streamingRadioStation = 0;
		this.streamingRadioStationIndex = -1;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["house_id"]);
			this.description = toString(dbAssoc["house_description"]);
			this.ownerType = toInteger(dbAssoc["house_owner_type"]);
			this.ownerId = toInteger(dbAssoc["house_owner_id"]);
			this.buyPrice = toInteger(dbAssoc["house_buy_price"]);
			this.rentPrice = toInteger(dbAssoc["house_rent_price"]);
			this.renter = toInteger(dbAssoc["house_renter"]);
			this.locked = intToBool(toInteger(dbAssoc["house_locked"]));
			this.hasInterior = intToBool(toInteger(dbAssoc["house_has_interior"]));
			this.interiorLights = intToBool(toInteger(dbAssoc["house_interior_lights"]));

			this.entrancePosition = toVector3(toFloat(dbAssoc["house_entrance_pos_x"]), toFloat(dbAssoc["house_entrance_pos_y"]), toFloat(dbAssoc["house_entrance_pos_z"]));
			this.entranceRotation = toFloat(dbAssoc["house_entrance_rot_z"]);
			this.entranceInterior = toInteger(dbAssoc["house_entrance_int"]);
			this.entranceDimension = toInteger(dbAssoc["house_entrance_vw"]);
			this.entrancePickupModel = toInteger(dbAssoc["house_entrance_pickup"]);
			this.entranceBlipModel = toInteger(dbAssoc["house_entrance_blip"]);
			this.entranceScene = toString(dbAssoc["house_entrance_scene"]);

			this.exitPosition = toVector3(toFloat(dbAssoc["house_exit_pos_x"]), toFloat(dbAssoc["house_exit_pos_y"]), toFloat(dbAssoc["house_exit_pos_z"]));
			this.exitRotation = toFloat(dbAssoc["house_exit_rot_z"]);
			this.exitInterior = toInteger(dbAssoc["house_exit_int"]);
			this.exitDimension = toInteger(dbAssoc["house_exit_vw"]);
			this.exitPickupModel = toInteger(dbAssoc["house_exit_pickup"]);
			this.exitBlipModel = toInteger(dbAssoc["house_exit_blip"]);
			this.exitScene = toString(dbAssoc["house_exit_scene"]);
		}
	}
};

// ===========================================================================

/**
 * @class Representing a houses's location data. Multiple can be used for a single house. Used for things like doors, garage entry/exit/vehspawn, gates, etc. Loaded and saved in the database
 */
class HouseLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.type = 0;
		this.house = 0;
		this.enabled = false;
		this.index = -1;
		this.houseIndex = -1;
		this.needsSaved = false;

		this.position = toVector3(0.0, 0.0, 0.0);
		this.interior = 0;
		this.dimension = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["house_loc_id"]);
			this.name = toString(dbAssoc["house_loc_name"]);
			this.type = toInteger(dbAssoc["house_loc_type"]);
			this.house = toInteger(dbAssoc["house_loc_house"]);
			this.enabled = intToBool(toInteger(dbAssoc["house_loc_enabled"]));
			this.index = -1;

			this.position = toVector3(toFloat(dbAssoc["house_loc_pos_x"]), toFloat(dbAssoc["house_loc_pos_y"]), toFloat(dbAssoc["house_loc_pos_z"]));
			this.interior = toInteger(dbAssoc["house_loc_int"]);
			this.dimension = toInteger(dbAssoc["house_loc_vw"]);
		}
	};

	//saveToDatabase = () => {
	//	saveHouseLocationToDatabase(this.houseIndex, this.index);
	//}
};

// ===========================================================================

/**
 * @class Representing a house's game scripts. Multiple can be used for a single house
 */
class HouseGameScriptData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.houseId = 0;
		this.state = false;
		this.index = -1;
		this.houseIndex = -1;
		this.needsSaved = false;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["house_script_id"]);
			this.name = toString(dbAssoc["house_script_name"]);
			this.state = toInteger(dbAssoc["house_script_state"]);
			this.houseId = toInteger(dbAssoc["house_script_house"]);
		}
	}
};

// ===========================================================================

function initHouseScript() {
	logToConsole(LOG_INFO, "[V.RP.House]: Initializing house script ...");
	logToConsole(LOG_INFO, "[V.RP.House]: House script initialized successfully!");
	return true;
}

// ===========================================================================

function loadHousesFromDatabase() {
	logToConsole(LOG_INFO, "[V.RP.House]: Loading houses from database ...");
	let tempHouses = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM house_main WHERE house_deleted = 0 AND house_server = ${getServerId()}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempHouseData = new HouseData(dbAssoc[i]);
				tempHouses.push(tempHouseData);
				logToConsole(LOG_VERBOSE, `[V.RP.House]: House '${tempHouseData.description}' (ID ${tempHouseData.databaseId}) loaded!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}
	logToConsole(LOG_INFO, `[V.RP.House]: ${tempHouses.length} houses loaded from database successfully!`);
	return tempHouses;
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
function createHouseCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	createHouse(
		params,
		getPlayerPosition(client),
		toVector3(0.0, 0.0, 0.0),
		(isGameFeatureSupported("pickup")) ? gameData.pickupModels[getGame()].House : -1,
		-1,
		getPlayerInterior(client),
		getPlayerDimension(client),
		getPlayerData(client).interiorScene
	);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created house: {houseGreen}${params}`, true);
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
function toggleHouseInteriorLightsCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	getHouseData(houseId).interiorLights = !getHouseData(houseId).interiorLights;

	getHouseData(houseId).needsSaved = true;

	updateHouseInteriorLightsForOccupants(houseId);
	meActionToNearbyPlayers(client, `turns ${toLowerCase(getOnOffFromBool(getHouseData(houseId).interiorLights))} the house lights`);
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
function setHouseDescriptionCommand(command, params, client) {
	let newHouseDescription = toString(params);

	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let oldDescription = getHouseData(houseId).description;
	getHouseData(houseId).description = newHouseDescription;

	setEntityData(getHouseData(houseId).entrancePickup, "v.rp.label.name", getHouseData(houseId).description, true);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} renamed house {houseGreen}${oldDescription}{MAINCOLOUR} to {houseGreen}${getHouseData(houseId).description}`, true);
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
function setHouseOwnerCommand(command, params, client) {
	let newHouseOwner = getPlayerFromParams(params);
	let houseId = getPlayerHouse(client);

	if (!newHouseOwner) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		if (getHouseData(houseId).ownerType == V_HOUSE_OWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			messagePlayerError(client, getLocaleString(client, "CantModifyHouse"));
			return false;
		}
	}

	getHouseData(houseId).ownerType = V_HOUSE_OWNER_PLAYER;
	getHouseData(houseId).ownerId = getPlayerCurrentSubAccount(newHouseOwner).databaseId;

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} gave house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} to {ALTCOLOUR}${getCharacterFullName(newHouseOwner)}`);
}

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function removeHouseOwnerCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		if (getHouseData(houseId).ownerType == V_HOUSE_OWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			messagePlayerError(client, getLocaleString(client, "CantModifyHouse"));
			return false;
		}
	}

	getHouseData(houseId).ownerType = V_HOUSE_OWNER_NONE;
	getHouseData(houseId).ownerId = -1;
	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed house {houseGreen}${getHouseData(houseId).description}'s{MAINCOLOUR} owner`);
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
function setHouseClanCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (getHouseData(houseId).ownerType != V_VEH_OWNER_PLAYER) {
		messagePlayerError(client, getLocaleString(client, "MustOwnHouse"));
		return false;
	}

	if (getHouseData(houseId).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
		messagePlayerError(client, getLocaleString(client, "MustOwnHouse"));
		return false;
	}

	getPlayerData(client).promptType = V_PROMPT_GIVEHOUSETOCLAN;
	showPlayerPrompt(client, getLocaleString(client, "SetHouseClanConfirmMessage"), getLocaleString(client, "SetHouseClanConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));

	//messagePlayerSuccess(`{MAINCOLOUR}You gave house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan!`);
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
function setHouseRankCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	getHouseData(houseId).clanRank = getClanRankData(clanId, clanRankId).level;
	getHouseData(houseId).needsSaved = true;
	messagePlayerSuccess(`{MAINCOLOUR}You set house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR}'s clan rank to {clanOrange}${getClanRankData(clanId, clanRankId).name} {MAINCOLOUR}(level ${getClanRankData(clanId, clanRankId).level}) and above!`);
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
function setHousePickupCommand(command, params, client) {
	let typeParam = params || "house";
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if (isNaN(typeParam)) {
		if (toLowerCase(typeParam) == "None") {
			getHouseData(houseId).entrancePickupModel = -1;
		} else {
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

			getHouseData(houseId).entrancePickupModel = gameData.pickupModels[getGame()][typeParam];
		}
	} else {
		getHouseData(houseId).entrancePickupModel = toInteger(typeParam);
	}

	despawnHouseEntrancePickup(houseId);
	spawnHouseEntrancePickup(houseId);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} pickup to {ALTCOLOUR}${toLowerCase(typeParam)}`, true);
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
function setHouseInteriorTypeCommand(command, params, client) {
	let typeParam = getParam(params, " ", 1) || "None";
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if (typeof gameData.interiors[getGame()] == "undefined") {
		messagePlayerError(client, `There are no interiors available for this game!`);
		return false;
	}

	if (isNaN(typeParam)) {
		if (toLowerCase(typeParam) == "none") {
			getHouseData(houseId).exitPosition = toVector3(0.0, 0.0, 0.0);
			getHouseData(houseId).exitDimension = 0;
			getHouseData(houseId).exitInterior = -1;
			getHouseData(houseId).hasInterior = false;
			getHouseData(houseId).entranceScene = "";
			getHouseData(houseId).exitScene = "";
			getHouseData(houseId).exitPickupModel = -1;
			getHouseData(houseId).customInterior = false;
			getHouseData(houseId).exitScene = "";
			getHouseData(houseId).entranceScene = "";
			messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} interior`, true);
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

		getHouseData(houseId).exitPosition = gameData.interiors[getGame()][typeParam][0];
		getHouseData(houseId).exitInterior = gameData.interiors[getGame()][typeParam][1];
		getHouseData(houseId).exitDimension = getHouseData(houseId).databaseId + globalConfig.houseDimensionStart;
		getHouseData(houseId).exitPickupModel = (isGameFeatureSupported("pickup")) ? gameData.pickupModels[getGame()].Exit : -1;
		getHouseData(houseId).hasInterior = true;
		getHouseData(houseId).customInterior = gameData.interiors[getGame()][typeParam][2];

		if (isGameFeatureSupported("interiorScene")) {
			getHouseData(houseId).exitScene = typeParam;
			getHouseData(houseId).entranceScene = getPlayerCurrentSubAccount(client).scene;
		}
	}

	//despawnHouseEntrancePickup(houseId);
	//despawnHouseExitPickup(houseId);
	//spawnHouseEntrancePickup(houseId);
	//spawnHouseExitPickup(houseId);

	resetHousePickups(houseId);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} interior type to {ALTCOLOUR}${typeParam}`, true);
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
function setHouseBlipCommand(command, params, client) {
	let typeParam = params || "house";
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if (isNaN(typeParam)) {
		if (toLowerCase(typeParam) == "None") {
			getHouseData(houseId).entranceBlipModel = -1;
		} else {
			if (isNull(gameData.blipSprites[getGame()][typeParam])) {
				let blipTypes = Object.keys(gameData.blipSprites[getGame()]);
				let chunkedList = splitArrayIntoChunks(blipTypes, 10);

				messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBlipTypes")));
				for (let i in chunkedList) {
					messagePlayerInfo(client, chunkedList[i].join(", "));
				}
				return false;
			}

			getHouseData(houseId).entranceBlipModel = gameData.blipSprites[getGame()][typeParam];
		}
	} else {
		getHouseData(houseId).entranceBlipModel = toInteger(typeParam);
	}

	if (getHouseData(houseId).entranceBlip != null) {
		deleteGameElement(getHouseData(houseId).entranceBlip);
	}

	resetHouseBlips(houseId);
	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} blip to {ALTCOLOUR}${toLowerCase(typeParam)}`, true);
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
function moveHouseEntranceCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	getHouseData(houseId).entrancePosition = getPlayerPosition(client);
	getHouseData(houseId).entranceDimension = getPlayerDimension(client);
	getHouseData(houseId).entranceInterior = getPlayerInterior(client);

	//deleteAllHouseBlips(houseId);
	//deleteAllHousePickups(houseId);
	//createAllHouseBlips(houseId);
	//createAllHousePickups(houseId);

	resetHouseBlips();
	resetHousePickups();

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} entrance to their position`, true);
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
function moveHouseExitCommand(command, params, client) {
	let houseId = getClosestHouseEntrance(getPlayerPosition(client), getPlayerDimension(client));

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	getHouseData(houseId).locations = [];

	getHouseData(houseId).exitPosition = getPlayerPosition(client);
	getHouseData(houseId).exitDimension = getPlayerDimension(client);
	getHouseData(houseId).exitInterior = getPlayerInterior(client);

	//deleteAllHouseBlips(houseId);
	//deleteAllHousePickups(houseId);
	//createAllHouseBlips(houseId);
	//createAllHousePickups(houseId);

	despawnHouseExitPickup(houseId);
	despawnHouseExitBlip(houseId);
	spawnHouseExitPickup(houseId);
	spawnHouseExitBlip(houseId);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} exit to their position`, true);
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
function deleteHouseCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted house {houseGreen}${getHouseData(houseId).description}`);
	deleteHouse(houseId, getPlayerData(client).accountData.databaseId);
}

// ===========================================================================

/**
 * This function deletes a house by house data array index
 *
 * @param {number} houseId - The index of the house in the house data array to delete
 * @param {number} whoDeleted - The parameters/args string used with the command by the player
 * @return {bool} Whether or not the house was successfully deleted
 *
 */
function deleteHouse(houseIndex, whoDeleted = 0) {
	if (!getHouseData(houseIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let tempHouseData = serverData.houses[houseIndex];

	let dbConnection = connectToDatabase();
	let dbQuery = null;

	if (dbConnection) {
		dbQuery = queryDatabase(dbConnection, `UPDATE house_main SET house_deleted = 1, house_when_deleted = UNIX_TIMESTAMP(), house_who_deleted = ${whoDeleted} WHERE house_id = ${tempHouseData.databaseId}`);
		if (dbQuery) {
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	despawnHouseEntrancePickup(houseIndex);
	despawnHouseExitPickup(houseIndex);

	despawnHouseEntranceBlip(houseIndex);
	despawnHouseExitBlip(houseIndex);

	removePlayersFromHouse(houseIndex);

	serverData.houses.splice(houseIndex, 1);

	updateHousePickupLabelData(houseId, true);
}

// ===========================================================================

/**
 * This function removes a client/player from their current house (teleports them outside)
 *
 * @param {Client} client - The client/player to remove from their current house
 * @return {bool} Whether or not the player was successfully removed from the house
 *
 */
function removePlayerFromHouse(client) {
	exitHouse(client);
}

// ===========================================================================

/**
 * Forces all players to exit a house
 *
 * @param {Number} houseId - The data index of the house to force all players inside to exit from
 * @return {Boolean} Whether or not the players were forced to exit
 *
 */
function removePlayersFromHouse(houseIndex) {
	getClients().forEach(function (client) {
		if (doesHouseHaveInterior(houseIndex)) {
			if (getPlayerHouse(client) == houseIndex) {
				if (getPlayerInterior(client) == getHouseData(houseIndex).exitInterior && getPlayerDimension(client) == getHouseData(houseIndex).exitDimension) {
					exitHouse(client);
				}
			}
		}
	});

	return true;
}

// ===========================================================================

/**
 * This function creates a house
 *
 * @param {string} description - The description of the house (displayed as the name in the world label)
 * @param {houseLocationData} entranceLocation - The houseLocationData object for the main entrance to the house
 * @return {bool} Whether or not the player was successfully removed from the house
 *
 */
function createHouse(description, entrancePosition, exitPosition, entrancePickupModel = -1, entranceBlipModel = -1, entranceInterior = 0, entranceDimension = 0, entranceScene = -1) {
	let tempHouseData = new HouseData(false);
	tempHouseData.description = description;

	tempHouseData.entrancePosition = entrancePosition;
	tempHouseData.entranceRotation = 0.0;
	tempHouseData.entrancePickupModel = entrancePickupModel;
	tempHouseData.entranceBlipModel = entranceBlipModel;
	tempHouseData.entranceInterior = entranceInterior;
	tempHouseData.entranceDimension = entranceDimension;
	tempHouseData.entranceScene = entranceScene;

	tempHouseData.exitPosition = exitPosition;
	tempHouseData.exitRotation = 0.0;
	tempHouseData.exitPickupModel = 0;
	tempHouseData.exitBlipModel = -1;
	tempHouseData.exitInterior = 0;
	tempHouseData.exitDimension = 0;
	tempHouseData.exitScene = -1;

	tempHouseData.needsSaved = true;

	let houseId = serverData.houses.push(tempHouseData);

	saveHouseToDatabase(houseId - 1);
	setAllHouseDataIndexes();

	spawnHousePickups(houseId - 1);
	spawnHouseBlips(houseId - 1);

	return houseId - 1;
}

// ===========================================================================

function getHouseDataFromDatabaseId(databaseId) {
	if (databaseId <= 0) {
		return false;
	}

	let matchingHouses = serverData.houses.filter(b => b.databaseId == databaseId)
	if (matchingHouses.length == 1) {
		return matchingHouses[0];
	}
	return false;
}

// ===========================================================================

function getClosestHouseEntrance(position, dimension) {
	let closest = 0;
	for (let i in serverData.houses) {
		if (serverData.houses[i].entranceDimension == dimension) {
			if (getDistance(serverData.houses[i].entrancePosition, position) <= getDistance(serverData.houses[closest].entrancePosition, position)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function getClosestHouseExit(position, dimension) {
	let closest = 0;
	for (let i in serverData.houses) {
		if (serverData.houses[i].entranceDimension == dimension) {
			if (getDistance(serverData.houses[i].exitPosition, position) <= getDistance(serverData.houses[closest].exitPosition, position)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function getPlayerHouse(client) {
	if (serverData.houses.length == 0) {
		return -1;
	}

	if (getPlayerDimension(client) == gameData.mainWorldDimension[getGame()]) {
		let closestEntrance = getClosestHouseEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getPlayerPosition(client), getHouseData(closestEntrance).entrancePosition) <= globalConfig.enterPropertyDistance) {
			return getHouseData(closestEntrance).index;
		}
	} else {
		let closestEntrance = getClosestHouseEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getPlayerPosition(client), getHouseData(closestEntrance).entrancePosition) <= globalConfig.enterPropertyDistance) {
			return getHouseData(closestEntrance).index;
		}

		for (let i in serverData.houses) {
			if (serverData.houses[i].hasInterior && serverData.houses[i].exitDimension == getPlayerDimension(client)) {
				return i;
			}
		}
	}

	return -1;
}

// ===========================================================================

function saveAllHousesToDatabase() {
	logToConsole(LOG_DEBUG, `[V.RP.House]: Saving all server houses to database ...`);
	if (serverConfig.devServer) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.House]: Aborting save all houses to database, dev server is enabled.`);
		return false;
	}

	for (let i in serverData.houses) {
		if (serverData.houses[i].needsSaved) {
			saveHouseToDatabase(i);
		}
	}
	logToConsole(LOG_INFO, `[V.RP.House]: Saved all server houses to database`);
}

// ===========================================================================

function saveHouseToDatabase(houseId) {
	if (serverConfig.devServer) {
		return false;
	}

	let tempHouseData = getHouseData(houseId);

	if (!tempHouseData.needsSaved) {
		return false;
	}

	if (tempHouseData.databaseId == -1) {
		return false;
	}

	logToConsole(LOG_VERBOSE, `[V.RP.House]: Saving house '${tempHouseData.description}' to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeHouseDescription = escapeDatabaseString(dbConnection, tempHouseData.description);

		let data = [
			["house_server", getServerId()],
			["house_description", safeHouseDescription],
			["house_owner_type", tempHouseData.ownerType],
			["house_owner_id", tempHouseData.ownerId],
			["house_locked", boolToInt(tempHouseData.locked)],
			//["house_entrance_fee", tempHouseData.entranceFee],
			["house_entrance_pos_x", tempHouseData.entrancePosition.x],
			["house_entrance_pos_y", tempHouseData.entrancePosition.y],
			["house_entrance_pos_z", tempHouseData.entrancePosition.z],
			["house_entrance_rot_z", tempHouseData.entranceRotation],
			["house_entrance_int", tempHouseData.entranceInterior],
			["house_entrance_vw", tempHouseData.entranceDimension],
			["house_entrance_pickup", tempHouseData.entrancePickupModel],
			["house_entrance_blip", tempHouseData.entranceBlipModel],
			["house_entrance_scene", tempHouseData.entranceScene],
			["house_exit_pos_x", tempHouseData.exitPosition.x],
			["house_exit_pos_y", tempHouseData.exitPosition.y],
			["house_exit_pos_z", tempHouseData.exitPosition.z],
			["house_exit_rot_z", tempHouseData.exitRotation],
			["house_exit_int", tempHouseData.exitInterior],
			["house_exit_vw", tempHouseData.exitDimension],
			["house_exit_pickup", tempHouseData.exitPickupModel],
			["house_exit_blip", tempHouseData.exitBlipModel],
			["house_exit_scene", tempHouseData.exitScene],
			["house_buy_price", tempHouseData.buyPrice],
			["house_rent_price", tempHouseData.rentPrice],
			["house_has_interior", boolToInt(tempHouseData.hasInterior)],
			["house_interior_lights", boolToInt(tempHouseData.interiorLights)],
			["house_custom_interior", boolToInt(tempHouseData.customInterior)],
			["house_radio_station", (getRadioStationData(tempHouseData.streamingRadioStationIndex) != null) ? getRadioStationData(tempHouseData.streamingRadioStationIndex).databaseId : -1],
		];

		let dbQuery = null;
		if (tempHouseData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("house_main", data);
			logToConsole(queryString);
			dbQuery = queryDatabase(dbConnection, queryString);
			serverData.houses[houseId].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("house_main", data, `house_id=${tempHouseData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		getHouseData(houseId).needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[V.RP.House]: Saved house '${tempHouseData.description}' to database!`);

	return false;
}

// ===========================================================================

function saveHouseLocationToDatabase(houseId, locationId) {
	let tempHouseLocationData = serverData.houses[houseId].locations[locationId];

	if (!tempHouseLocationData.needsSaved) {
		return false;
	}

	logToConsole(LOG_VERBOSE, `[V.RP.House]: Saving house location ${locationId} for house ${houseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let data = [
			["house_loc_house", getHouseData(houseId).databaseId],
			["house_loc_type", tempHouseLocationData.type],
			["house_loc_enabled", boolToInt(tempHouseLocationData.enabled)],
			["house_loc_locked", boolToInt(tempHouseLocationData.locked)],
			["house_loc_pos1_x", tempHouseLocationData.positionOne.x],
			["house_loc_pos1_y", tempHouseLocationData.positionOne.y],
			["house_loc_pos1_z", tempHouseLocationData.positionOne.z],
			["house_loc_rot1_z", tempHouseLocationData.rotationOne.z],
			["house_loc_int1", tempHouseLocationData.interiorOne],
			["house_loc_vw1", tempHouseLocationData.dimensionOne],
			["house_loc_pickup1", tempHouseLocationData.pickupModelOne],
			["house_loc_blip1", tempHouseLocationData.blipModelOne],
			["house_loc_pos2_x", tempHouseLocationData.positionTwo.x],
			["house_loc_pos2_y", tempHouseLocationData.positionTwo.y],
			["house_loc_pos2_z", tempHouseLocationData.positionTwo.z],
			["house_loc_rot2_z", tempHouseLocationData.rotationTwo],
			["house_loc_int2", tempHouseLocationData.interiorTwo],
			["house_loc_vw2", getHouseData(houseId).databaseId + globalConfig.houseDimensionStart],
			["house_loc_pickup2", tempHouseLocationData.pickupTwo],
			["house_loc_blip2", tempHouseLocationData.blipTwo],
		];

		let dbQuery = null;
		if (tempHouseData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("house_loc", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			serverData.houses[houseId].locations[locationId].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("house_loc", data, `house_loc_id=${tempHouseLocationData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		serverData.houses[houseId].locations[locationId].needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[V.RP.House]: Saved location ${locationId} for house ${houseId} to database`);

	return false;
}

// ===========================================================================

function spawnAllHousePickups() {
	for (let i in serverData.houses) {
		spawnHouseEntrancePickup(i);
		spawnHouseExitPickup(i);
	}
}

// ===========================================================================

function spawnAllHouseBlips() {
	for (let i in serverData.houses) {
		spawnHouseEntranceBlip(i);
		spawnHouseExitBlip(i);
	}
}

// ===========================================================================

function spawnHouseEntrancePickup(houseId) {
	if (!serverConfig.createHousePickups) {
		return false;
	}

	if (getHouseData(houseId) == null) {
		return false;
	}

	let houseData = getHouseData(houseId);

	//if(houseData.hasInterior) {
	//	return false;
	//}

	logToConsole(LOG_VERBOSE, `[V.RP.House]: Creating entrance pickup for house ${houseData.description} (${houseData.databaseId})`);

	if (isGameFeatureSupported("serverElements") && getGame() != V_GAME_MAFIA_ONE && getGame() != V_GAME_GTA_IV) {
		let entrancePickup = null;
		if (isGameFeatureSupported("pickup")) {
			let pickupModelId = gameData.pickupModels[getGame()].House;

			if (houseData.entrancePickupModel == -1) {
				return false;
			}

			if (serverData.houses[houseId].entrancePickupModel != 0) {
				pickupModelId = getHouseData(houseId).entrancePickupModel;
			}

			entrancePickup = createGamePickup(pickupModelId, houseData.entrancePosition, gameData.pickupTypes[getGame()].house);
		}

		if (entrancePickup != null) {
			if (houseData.entranceDimension != -1) {
				setElementDimension(entrancePickup, houseData.entranceDimension);
				setElementOnAllDimensions(entrancePickup, false);
			} else {
				setElementOnAllDimensions(entrancePickup, true);
			}

			if (globalConfig.housePickupStreamInDistance == -1 || globalConfig.housePickupStreamOutDistance == -1) {
				entrancePickup.netFlags.distanceStreaming = false;
			} else {
				setElementStreamInDistance(entrancePickup, globalConfig.housePickupStreamInDistance);
				setElementStreamOutDistance(entrancePickup, globalConfig.housePickupStreamInDistance);
			}
			setElementTransient(entrancePickup, false);
			getHouseData(houseId).entrancePickup = entrancePickup;
			updateHousePickupLabelData(houseId);
		}
	}

	updateHousePickupLabelData(houseId);
}

// ===========================================================================

function spawnHouseEntranceBlip(houseId) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (!serverConfig.createHouseBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	if (getHouseData(houseId) == null) {
		return false;
	}

	let houseData = getHouseData(houseId);

	//if(houseData.hasInterior) {
	//	return false;
	//}

	if (houseData.entranceBlipModel == -1) {
		return false;
	}

	let blipModelId = gameData.blipSprites[getGame()].House;
	if (serverData.houses[houseId].entranceBlipModel != 0) {
		blipModelId = getHouseData(houseId).entranceBlipModel;
	}

	let entranceBlip = createGameBlip(houseData.entrancePosition, blipModelId, 1, getColourByName("houseGreen"));
	if (entranceBlip != null) {
		if (houseData.exitDimension != -1) {
			setElementDimension(entranceBlip, houseData.entranceDimension);
			setElementOnAllDimensions(entranceBlip, false);
		} else {
			setElementOnAllDimensions(entranceBlip, true);
		}

		if (globalConfig.houseBlipStreamInDistance == -1 || globalConfig.houseBlipStreamOutDistance == -1) {
			entranceBlip.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(entranceBlip, globalConfig.houseBlipStreamInDistance);
			setElementStreamOutDistance(entranceBlip, globalConfig.houseBlipStreamOutDistance);
		}

		setEntityData(entranceBlip, "v.rp.owner.type", V_BLIP_HOUSE_ENTRANCE, false);
		setEntityData(entranceBlip, "v.rp.owner.id", houseId, false);

		houseData.entranceBlip = entranceBlip;
	}
}

// ===========================================================================

function spawnHouseExitPickup(houseId) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (!serverConfig.createHousePickups) {
		return false;
	}

	if (getHouseData(houseId) == null) {
		return false;
	}

	let houseData = getHouseData(houseId);

	//if(houseData.hasInterior) {
	//	return false;
	//}

	if (houseData.exitPickupModel == -1) {
		return false;
	}

	let exitPickup = null;
	if (isGameFeatureSupported("pickup")) {
		let pickupModelId = gameData.pickupModels[getGame()].Exit;

		if (serverData.houses[houseId].exitPickupModel != 0) {
			pickupModelId = houseData.exitPickupModel;
		}

		exitPickup = createGamePickup(pickupModelId, houseData.exitPosition, gameData.pickupTypes[getGame()].house);
	} else if (isGameFeatureSupported("dummyElement")) {
		//exitPickup = createGameDummyElement(houseData.exitPosition);
	}

	if (exitPickup != null) {
		setElementDimension(exitPickup, houseData.exitDimension);
		setElementOnAllDimensions(exitPickup, false);
		setElementStreamInDistance(exitPickup, globalConfig.housePickupStreamInDistance);
		setElementStreamOutDistance(exitPickup, globalConfig.housePickupStreamOutDistance);
		setElementTransient(exitPickup, false);

		getHouseData(houseId).exitPickup = exitPickup;
		updateHousePickupLabelData(houseId);
	}
}

// ===========================================================================

function spawnHouseExitBlip(houseId) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (!serverConfig.createHouseBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	if (getHouseData(houseId) == null) {
		return false;
	}

	let houseData = getHouseData(houseId);

	//if(houseData.hasInterior) {
	//	return false;
	//}

	if (houseData.exitBlipModel == -1) {
		return false;
	}

	let blipModelId = gameData.blipSprites[getGame()].Exit;

	if (serverData.houses[houseId].exitBlipModel != 0) {
		blipModelId = houseData.exitBlipModel;
	}

	let exitBlip = createGameBlip(houseData.exitPosition, blipModelId, 1, getColourByName("houseGreen"));
	if (exitBlip != null) {
		if (houseData.exitDimension != -1) {
			setElementDimension(exitBlip, houseData.exitDimension);
			setElementOnAllDimensions(exitBlip, false);
		} else {
			setElementOnAllDimensions(entranceBlip, true);
		}

		if (globalConfig.houseBlipStreamInDistance == -1 || globalConfig.houseBlipStreamOutDistance == -1) {
			exitBlip.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(exitBlip, globalConfig.houseBlipStreamInDistance);
			setElementStreamOutDistance(exitBlip, globalConfig.houseBlipStreamOutDistance);
		}
		setElementTransient(exitBlip, false);
		setEntityData(exitBlip, "v.rp.owner.type", V_BLIP_HOUSE_EXIT, false);
		setEntityData(exitBlip, "v.rp.owner.id", houseId, false);
		getHouseData(houseId).exitBlip = exitBlip;
	}
}

// ===========================================================================

function getHouseOwnerTypeText(ownerType) {
	switch (ownerType) {
		case V_HOUSE_OWNER_CLAN:
			return "clan";

		case V_HOUSE_OWNER_PLAYER:
			return "player";

		case V_HOUSE_OWNER_NONE:
			return "not owned";

		case V_HOUSE_OWNER_PUBLIC:
			return "not owned";

		case V_HOUSE_OWNER_JOB:
			return "job";

		case V_HOUSE_OWNER_BIZ:
			return "business";

		default:
			return "unknown";
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
function getHouseInfoCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if (!areParamsEmpty(params)) {
		houseId = toInteger(params);
	}

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let houseData = getHouseData(houseId);

	let ownerName = "Unknown";
	switch (houseData.ownerType) {
		case V_HOUSE_OWNER_CLAN:
			ownerName = getClanData(getClanIndexFromDatabaseId(houseData.ownerId)).name;
			break;

		case V_HOUSE_OWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(houseData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			break;

		case V_HOUSE_OWNER_NONE:
			ownerName = "None";
			break;

		case V_HOUSE_OWNER_PUBLIC:
			ownerName = "Public";
			break;

		case V_HOUSE_OWNER_BIZ:
			ownerName = getBusinessDataFromDatabaseId(houseData.ownerId).name;
			break;

		case V_HOUSE_OWNER_JOB:
			ownerName = getJobData(getJobIndexFromDatabaseId(houseData.ownerId)).name;
			break;
	}


	let tempStats = [
		[`Name`, `${houseData.description}`],
		[`ID`, `${houseData.index}/${houseData.databaseId}`],
		[`Owner`, `${ownerName} (${getHouseOwnerTypeText(houseData.ownerType)})`],
		[`Locked`, `${getLockedUnlockedFromBool(houseData.locked)}`],
		[`BuyPrice`, `${getCurrencyString(houseData.buyPrice)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(houseData.buyPrice))})`],
		[`RentPrice`, `${getCurrencyString(houseData.rentPrice)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(houseData.rentPrice))})`],
		[`HasInterior`, `${getYesNoFromBool(houseData.hasInterior)}`],
		[`CustomInterior`, `${getYesNoFromBool(houseData.customInterior)}`],
		[`InteriorLights`, `${getOnOffFromBool(houseData.interiorLights)}`],
		[`RadioStation`, `${(getRadioStationData(houseData.streamingRadioStationIndex) != null) ? getRadioStationData(houseData.streamingRadioStationIndex).name : "none"}`],
	];

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderHouseInfo", houseData.description)));
	let chunkedList = splitArrayIntoChunks(stats, 6);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}

	//messagePlayerNormal(client, `🏠 {houseGreen}[House Info]{MAINCOLOUR} Description: {ALTCOLOUR}${getHouseData(houseId).description}, {MAINCOLOUR}Owner: {ALTCOLOUR}${ownerName} (${getHouseOwnerTypeText(getHouseData(houseId).ownerType)}), {MAINCOLOUR}Locked: {ALTCOLOUR}${getYesNoFromBool(intToBool(getHouseData(houseId).locked))}, {MAINCOLOUR}ID: {ALTCOLOUR}${houseId}/${getHouseData(houseId).databaseId}`);
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
function setHouseBuyPriceCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if (amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getHouseData(houseId).buyPrice = amount;
	getHouseData(houseId).needsSaved = true;
	updateHousePickupLabelData(houseId);
	messagePlayerSuccess(client, `{MAINCOLOUR}You set house {houseGreen}${getHouseData(houseId).description}'s{MAINCOLOUR} for-sale price to {ALTCOLOUR}${getCurrencyString(amount)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(amount))})`);
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
function setHouseRentPriceCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if (amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getHouseData(houseId).rentPrice = amount;
	getHouseData(houseId).needsSaved = true;
	updateHousePickupLabelData(houseId);
	messagePlayerSuccess(client, `{MAINCOLOUR}You set house {houseGreen}${getHouseData(houseId).description}'s{MAINCOLOUR} rent price to {ALTCOLOUR}${getCurrencyString(amount)} (with inflation: ${getCurrencyString(applyServerInflationMultiplier(amount))})`);
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
function buyHouseCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if (getHouseData(houseId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if (getHouseData(houseId).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "HouseNotForSale"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).cash < applyServerInflationMultiplier(getHouseData(houseId).buyPrice)) {
		messagePlayerError(client, getLocaleString(client, "HousePurchaseNotEnoughMoney"));
		return false;
	}

	getPlayerData(client).promptType = V_PROMPT_BUYHOUSE;
	showPlayerPrompt(client, getLocaleString(client, "BuyHouseConfirmMessage"), getLocaleString(client, "BuyHouseConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
}

// ===========================================================================

/**
 * @param {number} houseIndex - The data index of the house
 * @return {HouseData} The house's data (class instance)
 */
function getHouseData(houseId) {
	if (houseId == -1) {
		return null;
	}

	if (typeof serverData.houses[houseId] != "undefined") {
		return serverData.houses[houseId];
	}

	return null;
}

// ===========================================================================

function doesHouseHaveInterior(houseId) {
	return getHouseData(houseId).hasInterior;
}

// ===========================================================================

function despawnHouseEntrancePickup(houseId) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (getHouseData(houseId).entrancePickup != null) {
		//removeFromWorld(getHouseData(houseId).entrancePickup);
		deleteGameElement(getHouseData(houseId).entrancePickup);
		getHouseData(houseId).entrancePickup = null;
	}
}

// ===========================================================================

function despawnHouseExitPickup(houseId) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (getHouseData(houseId).exitPickup != null) {
		//removeFromWorld(getHouseData(houseId).exitPickup);
		deleteGameElement(getHouseData(houseId).exitPickup);
		getHouseData(houseId).exitPickup = null;
	}
}

// ===========================================================================

function despawnHouseEntranceBlip(houseId) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (getHouseData(houseId).entranceBlip != null) {
		//removeFromWorld(getHouseData(houseId).entranceBlip);
		deleteGameElement(getHouseData(houseId).entranceBlip);
		getHouseData(houseId).entranceBlip = null;
	}
}

// ===========================================================================

function despawnHouseExitBlip(houseId) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (getHouseData(houseId).exitBlip != null) {
		//removeFromWorld(getHouseData(houseId).exitBlip);
		deleteGameElement(getHouseData(houseId).exitBlip);
		getHouseData(houseId).exitBlip = null;
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
function reloadAllHousesCommand(command, params, client) {
	let clients = getClients();
	for (let i in clients) {
		if (getPlayerHouse(clients[i]) != -1) {
			removePlayerFromHouse(clients[i]);
		}
	}

	for (let i in serverData.houses) {
		despawnHouseExitBlip(i);
		despawnHouseEntranceBlip(i);
		despawnHouseExitPickup(i);
		despawnHouseEntrancePickup(i);
	}

	serverData.houses = [];
	serverData.houses = loadHousesFromDatabase();
	createAllHousePickups();
	createAllHouseBlips();

	announceAdminAction(`AllHousesReloaded`);
}

// ===========================================================================

function exitHouse(client) {
	let houseId = getPlayerHouse(client);
	if (isPlayerSpawned(client)) {
		setPlayerInterior(client, serverData.houses[houseId].entranceInterior);
		setPlayerDimension(client, serverData.houses[houseId].entranceDimension);
		setPlayerPosition(client, serverData.houses[houseId].entrancePosition);
	}
}

// ===========================================================================

function setAllHouseDataIndexes() {
	for (let i in serverData.houses) {
		serverData.houses[i].index = i;

		//for(let j in serverData.houses[i].locations) {
		//	serverData.houses[i].locations[j].index = j;
		//	serverData.houses[i].locations[j].houseIndex = i;
		//}

		//for(let j in serverData.houses[i].gameScripts) {
		//	serverData.houses[i].gameScripts[j].index = j;
		//	serverData.houses[i].gameScripts[j].houseIndex = i;
		//}
	}
}

// ===========================================================================

function cacheAllHouseItems() {
	for (let i in serverData.houses) {
		cacheHouseItems(i);
	}
}

// ===========================================================================

function cacheHouseItems(houseIndex) {
	getHouseData(houseIndex).itemCache = serverData.items.filter(i => i.ownerType == V_ITEM_OWNER_HOUSE && i.ownerId == getHouseData(houseIndex).databaseId).map(filteredItem => filteredItem.index);
}

// ===========================================================================

function getHouseIndexFromDatabaseId(databaseId) {
	let houses = serverData.houses;
	for (let i in houses) {
		if (houses[i].databaseId == databaseId) {
			return i;
		}
	}
}

// ===========================================================================

//function sendPlayerHouseGameScripts(client, houseId) {
//	for(let i in getHouseData(houseId).gameScripts) {
//		sendPlayerGameScriptState(client, getHouseData(houseId).gameScripts[i].state);
//	}
//}

// ===========================================================================

//function clearPlayerHouseGameScripts(client, houseId) {
//	for(let i in getHouseData(houseId).gameScripts) {
//		sendPlayerGameScriptState(client, V_GAMESCRIPT_DENY);
//	}
//}

// ===========================================================================

function updateHouseInteriorLightsForOccupants(houseId) {
	let clients = getClients()
	for (let i in clients) {
		if (getPlayerHouse(clients[i]) == houseId) {
			updateInteriorLightsForPlayer(clients[i], getHouseData(houseId).interiorLights);
		}
	}
}

// ===========================================================================

function canPlayerSetHouseInteriorLights(client, houseId) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		return true;
	}

	if (getHouseData(houseId).ownerType == V_HOUSE_OWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getHouseData(houseId).ownerType == V_HOUSE_OWNER_CLAN && getHouseData(houseId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerLockUnlockHouse(client, houseId) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		return true;
	}

	if (getHouseData(houseId).ownerType == V_HOUSE_OWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if (getHouseData(houseId).ownerType == V_HOUSE_OWNER_CLAN && getHouseData(houseId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function resetHousePickups(houseId) {
	despawnHouseEntrancePickup(houseId);
	despawnHouseExitPickup(houseId);
	spawnHouseEntrancePickup(houseId);
	spawnHouseExitPickup(houseId);
}

// ===========================================================================

function resetHouseBlips(houseId) {
	despawnHouseEntranceBlip(houseId);
	despawnHouseExitBlip(houseId);
	spawnHouseEntranceBlip(houseId);
	spawnHouseExitBlip(houseId);
}

// ===========================================================================

function resetAllHousePickups() {
	for (let i in serverData.houses) {
		resetHousePickups(i);
	}
}

// ===========================================================================

function resetAllHouseBlips() {
	for (let i in serverData.houses) {
		resetHouseBlips(i);
	}
}

// ===========================================================================

function canPlayerManageHouse(client, houseId) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		return true;
	}

	if (getHouseData(houseId).ownerType == V_HOUSE_OWNER_PLAYER) {
		if (getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if (getHouseData(houseId).ownerType == V_HOUSE_OWNER_CLAN) {
		if (getHouseData(houseId).ownerId == getPlayerClan(client)) {
			if (doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
				return true;
			}
			//if(getHouseData(houseId).clanRank <= getClanRankData(getPlayerClan(client), getPlayerClanRank(client)).level) {
			//	return true;
			//}
		}
	}

	return false;
}

// ===========================================================================

function getHouseFromParams(params) {
	if (isNaN(params)) {
		for (let i in serverData.houses) {
			if (toLowerCase(serverData.houses[i].description).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof serverData.houses[params] != "undefined") {
			return toInteger(params);
		}
	}
	return false;
}

// ===========================================================================

function updateHousePickupLabelData(houseId, deleted = false) {
	/** @type {HouseData} */
	let houseData = false;

	if (deleted == false) {
		houseData = getHouseData(houseId);
	}

	if (!isGameFeatureSupported("serverElements") || getGame() == V_GAME_GTA_IV || (!isGameFeatureSupported("pickup") && !isGameFeatureSupported("blip"))) {
		if (houseData == null) {
			sendHouseToPlayer(
				null,
				houseId,
				true,
				"",
				toVector3(0.0, 0.0, 0.0),
				toVector3(0.0, 0.0, 0.0),
				-1,
				-1,
				0,
				0,
				false,
				V_PROPLABEL_INFO_NONE,
				0,
				0
			);
		} else {
			sendHouseToPlayer(
				null,
				houseId,
				false,
				houseData.description,
				houseData.entrancePosition,
				houseData.exitPosition,
				getHouseEntranceBlipModelForNetworkEvent(houseId),
				getHouseEntrancePickupModelForNetworkEvent(houseId),
				applyServerInflationMultiplier(houseData.buyPrice),
				applyServerInflationMultiplier(houseData.rentPrice),
				houseData.locked,
				getHousePropertyInfoLabelType(houseId),
				houseData.entranceDimension,
				houseData.exitDimension,
			);
		}
		return false;
	}

	if (houseData.entrancePickup != null) {
		setEntityData(houseData.entrancePickup, "v.rp.owner.type", V_PICKUP_HOUSE_ENTRANCE, false);
		setEntityData(houseData.entrancePickup, "v.rp.owner.id", houseId, false);
		setEntityData(houseData.entrancePickup, "v.rp.label.type", V_LABEL_HOUSE, true);
		setEntityData(houseData.entrancePickup, "v.rp.label.name", houseData.description, true);
		setEntityData(houseData.entrancePickup, "v.rp.label.locked", houseData.locked, true);
		setEntityData(houseData.entrancePickup, "v.rp.label.price", applyServerInflationMultiplier(houseData.buyPrice), true);
		setEntityData(houseData.entrancePickup, "v.rp.label.rentprice", applyServerInflationMultiplier(houseData.rentPrice), true);
		setEntityData(houseData.entrancePickup, "v.rp.label.help", getHousePropertyInfoLabelType(houseId), true);
	}

	if (houseData.exitPickup != null) {
		setEntityData(houseData.exitPickup, "v.rp.owner.type", V_PICKUP_HOUSE_EXIT, false);
		setEntityData(houseData.exitPickup, "v.rp.owner.id", houseId, false);
		setEntityData(houseData.exitPickup, "v.rp.label.type", V_LABEL_EXIT, true);
	}
}

// ===========================================================================

function deleteAllHouseBlips() {
	for (let i in serverData.houses) {
		despawnHouseEntranceBlip(i);
		despawnHouseExitBlip(i);
	}
}

// ===========================================================================

function deleteAllHousePickups() {
	for (let i in serverData.houses) {
		despawnHouseEntrancePickup(i);
		despawnHouseExitPickup(i);
	}
}

// ===========================================================================

function spawnHouseBlips(houseId) {
	spawnHouseEntranceBlip(houseId);
	spawnHouseExitBlip(houseId);
}

// ===========================================================================

function spawnHousePickups(houseId) {
	spawnHouseEntrancePickup(houseId);
	spawnHouseExitPickup(houseId);
}

// ===========================================================================

/**
 * Gets whether or not a client is in a house
 *
 * @param {Client} client - The client to check whether or not is in a house
 * @return {Boolean} Whether or not the client is in a house
 *
 */
function isPlayerInAnyHouse(client) {
	for (let i in serverData.houses) {
		if (serverData.houses[i].hasInterior && serverData.houses[i].exitDimension == getPlayerDimension(client)) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getHouseEntranceBlipModelForNetworkEvent(houseIndex) {
	let blipModelId = -1;
	if (isGameFeatureSupported("blip")) {
		blipModelId = gameData.blipSprites[getGame()].House;

		if (getHouseData(houseIndex).entranceBlipModel != 0) {
			blipModelId = getHouseData(houseIndex).entranceBlipModel;
		}
	}

	return blipModelId;
}

// ===========================================================================

function getHouseEntrancePickupModelForNetworkEvent(houseIndex) {
	let pickupModelId = -1;
	if (isGameFeatureSupported("pickup")) {
		pickupModelId = gameData.pickupModels[getGame()].House;

		if (getHouseData(houseIndex).entrancePickupModel != 0) {
			pickupModelId = getHouseData(houseIndex).entrancePickupModel;
		}
	}

	return pickupModelId;
}

// ===========================================================================

function getNearbyHousesCommand(command, params, client) {
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

	let nearbyHouses = getHousesInRange(getPlayerPosition(client), distance);

	if (nearbyHouses.length == 0) {
		messagePlayerAlert(client, getLocaleString(client, "NoHousesWithinRange", distance));
		return false;
	}

	let houseList = nearbyHouses.map(function (x) {
		return `{chatBoxListIndex}${x.index}: {MAINCOLOUR}${x.description} {mediumGrey}(${toFloat(getDistance(getPlayerPosition(client), x.entrancePosition)).toFixed(2)} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.entrancePosition))))})`;
	});
	let chunkedList = splitArrayIntoChunks(houseList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderHouseInRangeList", `${distance} ${toLowerCase(getLocaleString(client, "Meters"))}`)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function getHousesInRange(position, distance) {
	return serverData.houses.filter((house) => getDistance(position, house.entrancePosition) <= distance);
}

// ===========================================================================

function getHousePropertyInfoLabelType(houseIndex) {
	if (getHouseData(houseIndex) == null) {
		return V_PROPLABEL_INFO_NONE;
	}

	switch (getHouseData(houseIndex).labelHelpType) {
		case V_PROPLABEL_INFO_ENTER:
			return V_PROPLABEL_INFO_ENTER;

		default:
			if (getHouseData(houseIndex).buyPrice > 0) {
				return V_PROPLABEL_INFO_BUYHOUSE;
			}

			if (getHouseData(houseIndex).rentPrice > 0) {
				return V_PROPLABEL_INFO_RENTHOUSE;
			}

			if (getHouseData(houseIndex).hasInterior) {
				return V_PROPLABEL_INFO_ENTER;
			}
			break;
	}

	return V_PROPLABEL_INFO_NONE;
}

// ===========================================================================

function listPersonalHousesCommand(command, params, client) {
	let houses = getAllHousesOwnedByPlayer(client);

	let houseList = houses.map(function (x) {
		return `{chatBoxListIndex}${x.index}: {MAINCOLOUR}${x.description} {mediumGrey}(${Math.round(getDistance(getPlayerPosition(client), x.entrancePosition))} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.entrancePosition))))})`;
	});
	let chunkedList = splitArrayIntoChunks(houseList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerHousesList", getCharacterFullName(client))));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function listClanHousesCommand(command, params, client) {
	let clanIndex = getPlayerClan(client);

	if (!areParamsEmpty(params) && doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		clanIndex = getClanFromParams(params);
	}

	if (getClanData(clanIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let houses = getAllHousesOwnedByClan(jobIndex);

	let houseList = houses.map(function (x) {
		return `{chatBoxListIndex}${x.index}: {MAINCOLOUR}${x.description} {mediumGrey}(${Math.round(getDistance(getPlayerPosition(client), x.entrancePosition))} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.entrancePosition))))})`;
	});
	let chunkedList = splitArrayIntoChunks(houseList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderClanHousesList", getClanData(clanIndex).name)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function listJobHousesCommand(command, params, client) {
	let jobIndex = getPlayerJob(client);

	if (!areParamsEmpty(params) && doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		jobIndex = getJobFromParams(params);
	}

	if (getJobData(jobIndex) == false) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	let houses = getAllHousesOwnedByJob(jobIndex);

	let houseList = houses.map(function (x) {
		return `{chatBoxListIndex}${x.index}/${x.databaseId}: {MAINCOLOUR}${x.description} {mediumGrey}(${Math.round(getDistance(getPlayerPosition(client), x.entrancePosition))} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.entrancePosition))))})`;
	});
	let chunkedList = splitArrayIntoChunks(houseList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobHousesList", getJobData(jobIndex).name)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================