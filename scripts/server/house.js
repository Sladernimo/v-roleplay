// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: house.js
// DESC: Provides house commands, functions, and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initHouseScript() {
	logToConsole(LOG_INFO, "[VRR.House]: Initializing house script ...");
	logToConsole(LOG_INFO, "[VRR.House]: House script initialized successfully!");
	return true;
}

// ===========================================================================

function loadHousesFromDatabase() {
	logToConsole(LOG_INFO, "[VRR.House]: Loading houses from database ...");
	let tempHouses = [];
	let dbConnection = connectToDatabase();
	let dbAssoc;

	if(dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `SELECT * FROM house_main WHERE house_server = ${getServerId()}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempHouseData = new HouseData(dbAssoc);
					tempHouses.push(tempHouseData);
					logToConsole(LOG_VERBOSE, `[VRR.House]: House '${tempHouseData.description}' (ID ${tempHouseData.databaseId}) loaded!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}
	logToConsole(LOG_INFO, `[VRR.House]: ${tempHouses.length} houses loaded from database successfully!`);
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
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	createHouse(params, getPlayerPosition(client), toVector3(0.0, 0.0, 0.0), getGameConfig().pickupModels[getGame()].House, -1, getPlayerInterior(client), getPlayerDimension(client), getPlayerData(client).interiorCutscene);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created house: {houseGreen}${params}`);
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

	if(!getHouseData(houseId)) {
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

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let oldDescription = getHouseData(houseId).description;
	getHouseData(houseId).description = newHouseDescription;

	setEntityData(getHouseData(houseId).entrancePickup, "vrr.label.name", getHouseData(houseId).description, true);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} renamed house {houseGreen}${oldDescription}{MAINCOLOUR} to {houseGreen}${getHouseData(houseId).description}`);
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

	if(!newHouseOwner) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			messagePlayerError(client, getLocaleString(client, "CantModifyHouse"));
			return false;
		}
	}

	getHouseData(houseId).needsSaved = true;

	getHouseData(houseId).ownerType = VRR_HOUSEOWNER_PLAYER;
	getHouseData(houseId).ownerId = getPlayerCurrentSubAccount(newHouseOwner).databaseId;
	messagePlayerSuccess(`{MAINCOLOUR}You gave house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} to {ALTCOLOUR}${newHouseOwner.name}`);
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

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			messagePlayerError(client, getLocaleString(client, "CantModifyHouse"));
			return false;
		}
	}

	getHouseData(houseId).ownerType = VRR_HOUSEOWNER_NONE;
	getHouseData(houseId).ownerId = -1;
	getHouseData(houseId).needsSaved = true;

	messagePlayerSuccess(client, `{MAINCOLOUR}You removed house {houseGreen}${getHouseData(houseId).description}'s{MAINCOLOUR} owner`);
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

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let clanId = getPlayerClan(params);

	if(!getClanData(clanId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if(getHouseData(houseId).ownerType != VRR_VEHOWNER_PLAYER) {
		messagePlayerError(client, getLocaleString(client, "MustOwnHouse"));
		return false;
	}

	if(getHouseData(houseId).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
		messagePlayerError(client, getLocaleString(client, "MustOwnHouse"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "SetHouseClanConfirmMessage"), getLocaleString(client, "SetHouseClanConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = VRR_PROMPT_HOUSEGIVETOCLAN;

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

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let clanId = getPlayerClan(params);

	if(!getClanData(clanId)) {
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

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(isNaN(typeParam)) {
		if(toLowerCase(typeParam) == "None") {
			getHouseData(houseId).entrancePickupModel = -1;
		} else {
			if(isNull(getGameConfig().pickupModels[getGame()][typeParam])) {
				messagePlayerError(client, "Invalid pickup type! Use a pickup type name or a model ID");
				let pickupTypes = Object.keys(getGameConfig().pickupModels[getGame()]);
				let chunkedList = splitArrayIntoChunks(pickupTypes, 10);

				messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPickupTypes")));
				for(let i in chunkedList) {
					messagePlayerInfo(client, chunkedList[i].join(", "));
				}
				return false;
			}

			getHouseData(houseId).entrancePickupModel = getGameConfig().pickupModels[getGame()][typeParam];
		}
	} else {
		getHouseData(houseId).entrancePickupModel = toInteger(typeParam);
	}

	deleteHouseEntrancePickup(houseId);
	createHouseEntrancePickup(houseId);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} pickup display to {ALTCOLOUR}${toLowerCase(typeParam)}`);
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

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(typeof getGameConfig().interiors[getGame()] == "undefined") {
		messagePlayerError(client, `There are no interiors available for this game!`);
		return false;
	}

	if(isNaN(typeParam)) {
		let tempHouseLocation = new HouseLocationData(false);

		if(toLowerCase(typeParam) == "None") {
			tempHouseLocation.exitPosition = toVector3(0.0, 0.0, 0.0);
			tempHouseLocation.exitInterior = -1;
			getHouseData(houseId).exitPickupModel = -1;
			getHouseData(houseId).hasInterior = false;
			messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} interior`);
			return false;
		}

		if(isNull(getGameConfig().interiors[getGame()][typeParam])) {
			messagePlayerError(client, "Invalid interior type! Use an interior type name");
			let interiorTypesList = Object.keys(getGameConfig().interiors[getGame()]);
			let chunkedList = splitArrayIntoChunks(interiorTypesList, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader("InteriorTypes"));
			for(let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}
			return false;
		}

		getHouseData(houseId).exitPosition = getGameConfig().interiors[getGame()][typeParam][0];
		getHouseData(houseId).exitInterior = getGameConfig().interiors[getGame()][typeParam][1];
		getHouseData(houseId).exitDimension = getHouseData(houseId).databaseId+getGlobalConfig().houseDimensionStart;
		getHouseData(houseId).exitPickupModel = getGameConfig().pickupModels[getGame()].Exit;
		getHouseData(houseId).hasInterior = true;
	}

	deleteHouseEntrancePickup(houseId);
	deleteHouseExitPickup(houseId);
	createHouseEntrancePickup(houseId);
	createHouseExitPickup(houseId);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} interior type to {ALTCOLOUR}${toLowerCase(typeParam)}`);
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

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(isNaN(typeParam)) {
		if(toLowerCase(typeParam) == "None") {
			getHouseData(houseId).entranceBlipModel = -1;
		} else {
			if(isNull(getGameConfig().blipSprites[getGame()][typeParam])) {
				let blipTypes = Object.keys(getGameConfig().blipSprites[getGame()]);
				let chunkedList = splitArrayIntoChunks(blipTypes, 10);

				messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBlipTypes")));
				for(let i in chunkedList) {
					messagePlayerInfo(client, chunkedList[i].join(", "));
				}
				return false;
			}

			getHouseData(houseId).entranceBlipModel = getGameConfig().blipSprites[getGame()][typeParam];
		}
	} else {
		getHouseData(houseId).entranceBlipModel = toInteger(typeParam);
	}

	if(getHouseData(houseId).entranceBlip != null) {
		deleteGameElement(getHouseData(houseId).entranceBlip);
	}

	resetHouseBlips(houseId);
	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} blip display to {ALTCOLOUR}${toLowerCase(typeParam)}`);
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

	if(!getHouseData(houseId)) {
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

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} entrance to their position`);
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

	if(!getHouseData(houseId)) {
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

	deleteHouseExitPickup(houseId);
	deleteHouseExitBlip(houseId);
	createHouseExitPickup(houseId);
	createHouseExitBlip(houseId);

	getHouseData(houseId).needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} moved house {houseGreen}${getHouseData(houseId).description}{MAINCOLOUR} exit to their position`);
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

	if(!getHouseData(houseId)) {
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
function deleteHouse(houseId, whoDeleted = 0) {
	let tempHouseData = getServerData().houses[houseId];

	let dbConnection = connectToDatabase();
	let dbQuery = null;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `DELETE FROM house_main WHERE house_id = ${tempHouseData.databaseId}`);
		if(dbQuery) {
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	deleteHouseEntrancePickup(houseId);
	deleteHouseExitPickup(houseId);

	deleteHouseEntranceBlip(houseId);
	deleteHouseExitBlip(houseId);

	removePlayersFromHouse(houseId);

	getServerData().houses.splice(houseId, 1);
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
 * This function creates a house
 *
 * @param {string} description - The description of the house (displayed as the name in the world label)
 * @param {houseLocationData} entranceLocation - The houseLocationData object for the main entrance to the house
 * @return {bool} Whether or not the player was successfully removed from the house
 *
 */
function createHouse(description, entrancePosition, exitPosition, entrancePickupModel = -1, entranceBlipModel = -1, entranceInterior = 0, entranceDimension = 0, entranceCutscene = -1) {
	let tempHouseData = new HouseData(false);
	tempHouseData.description = description;

	tempHouseData.entrancePosition = entrancePosition;
	tempHouseData.entranceRotation = 0.0;
	tempHouseData.entrancePickupModel = entrancePickupModel;
	tempHouseData.entranceBlipModel = entranceBlipModel;
	tempHouseData.entranceInterior = entranceInterior;
	tempHouseData.entranceDimension = entranceDimension;
	tempHouseData.entranceCutscene = entranceCutscene;

	tempHouseData.exitPosition = exitPosition;
	tempHouseData.exitRotation = 0.0;
	tempHouseData.exitPickupModel = 0;
	tempHouseData.exitBlipModel = -1;
	tempHouseData.exitInterior = 0;
	tempHouseData.exitDimension = 0;
	tempHouseData.exitCutscene = -1;

	tempHouseData.needsSaved = true;

	let houseId = getServerData().houses.push(tempHouseData);

	saveHouseToDatabase(houseId-1);
	setHouseDataIndexes();

	createHousePickups(houseId-1);
	createHouseBlips(houseId-1);

	return houseId-1;
}

// ===========================================================================

function getHouseDataFromDatabaseId(databaseId) {
	let matchingHouses = getServerData().houses.filter(b => b.databaseId == databaseId)
	if(matchingHouses.length == 1) {
		return matchingHouses[0];
	}
	return false;
}

// ===========================================================================

function getClosestHouseEntrance(position, dimension) {
	let closest = 0;
	for(let i in getServerData().houses) {
		if(getServerData().houses[i].entranceDimension == dimension) {
			if(getDistance(getServerData().houses[i].entrancePosition, position) <= getDistance(getServerData().houses[closest].entrancePosition, position)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function getClosestHouseExit(position, dimension) {
	let closest = 0;
	for(let i in getServerData().houses) {
		if(getServerData().houses[i].entranceDimension == dimension) {
			if(getDistance(getServerData().houses[i].exitPosition, position) <= getDistance(getServerData().houses[closest].exitPosition, position)) {
				closest = i;
			}
		}
	}
	return closest;
}

// ===========================================================================

function getPlayerHouse(client) {
	if(getPlayerDimension(client) == getGameConfig().mainWorldDimension[getGame()]) {
		let closestEntrance = getClosestHouseEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if(getDistance(getPlayerPosition(client), getHouseData(closestEntrance).entrancePosition) <= getGlobalConfig().enterPropertyDistance) {
			return getHouseData(closestEntrance).index;
		}
	} else {
		let closestEntrance = getClosestHouseEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if(getDistance(getPlayerPosition(client), getHouseData(closestEntrance).entrancePosition) <= getGlobalConfig().enterPropertyDistance) {
			return getHouseData(closestEntrance).index;
		}

		for(let i in getServerData().houses) {
			if(getServerData().houses[i].hasInterior && getServerData().houses[i].exitDimension == getPlayerDimension(client)) {
				return i;
			}
		}
	}

	return -1;
}

// ===========================================================================

function saveAllHousesToDatabase() {
	if(getServerConfig().devServer) {
		return false;
	}

	logToConsole(LOG_INFO, `[VRR.House]: Saving all server houses to database ...`);
	for(let i in getServerData().houses) {
		if(getServerData().houses[i].needsSaved) {
			saveHouseToDatabase(i);
		}
	}
	logToConsole(LOG_INFO, `[VRR.House]: Saving all server houses to database ...`);
}

// ===========================================================================

function saveHouseToDatabase(houseId) {
	let tempHouseData = getServerData().houses[houseId];

	if(!tempHouseData.needsSaved) {
		return false;
	}

	logToConsole(LOG_VERBOSE, `[VRR.House]: Saving house '${tempHouseData.databaseId}' to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
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
			["house_entrance_cutscene", tempHouseData.entranceCutscene],
			["house_exit_pos_x", tempHouseData.exitPosition.x],
			["house_exit_pos_y", tempHouseData.exitPosition.y],
			["house_exit_pos_z", tempHouseData.exitPosition.z],
			["house_exit_rot_z", tempHouseData.exitRotation],
			["house_exit_int", tempHouseData.exitInterior],
			["house_exit_vw", tempHouseData.exitDimension],
			["house_exit_pickup", tempHouseData.exitPickupModel],
			["house_exit_blip", tempHouseData.exitBlipModel],
			["house_exit_cutscene", tempHouseData.exitCutscene],
			["house_buy_price", tempHouseData.buyPrice],
			["house_rent_price", tempHouseData.rentPrice],
			["house_has_interior", boolToInt(tempHouseData.hasInterior)],
			["house_interior_lights", boolToInt(tempHouseData.interiorLights)],
			["house_custom_interior", boolToInt(tempHouseData.customInterior)],
		];

		let dbQuery = null;
		if(tempHouseData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("house_main", data);
			logToConsole(queryString);
			dbQuery = queryDatabase(dbConnection, queryString);
			getServerData().houses[houseId].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("house_main", data, `house_id=${tempHouseData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		getHouseData(houseId).needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[VRR.House]: Saved house '${tempHouseData.description}' to database!`);

	return false;
}

// ===========================================================================

function saveHouseLocationToDatabase(houseId, locationId) {
	let tempHouseLocationData = getServerData().houses[houseId].locations[locationId];

	if(!tempHouseLocationData.needsSaved) {
		return false;
	}

	logToConsole(LOG_VERBOSE, `[VRR.House]: Saving house location '${locationId}' for house '${getHouseData(houseId).databaseId}' to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeHouseDescription = escapeDatabaseString(dbConnection, getHouseData(houseId).description);

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
			["house_loc_vw2", getHouseData(houseId).databaseId+getGlobalConfig().houseDimensionStart],
			["house_loc_pickup2", tempHouseLocationData.pickupTwo],
			["house_loc_blip2", tempHouseLocationData.blipTwo],
		];

		let dbQuery = null;
		if(tempHouseData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("house_loc", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			getServerData().houses[houseId].locations[locationId].databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("house_loc", data, `house_loc_id=${tempHouseLocationData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		getServerData().houses[houseId].locations[locationId].needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_VERBOSE, `[VRR.House]: Saved house '${tempHouseData.description}' to database!`);

	return false;
}

// ===========================================================================

function createAllHousePickups() {
	for(let i in getServerData().houses) {
		createHouseEntrancePickup(i);
		createHouseExitPickup(i);
	}
}

// ===========================================================================

function createAllHouseBlips() {
	for(let i in getServerData().houses) {
		createHouseEntranceBlip(i);
		createHouseExitBlip(i);
	}
}

// ===========================================================================

function createHouseEntrancePickup(houseId) {
	if(!areServerElementsSupported()) {
		return false;
	}

	if(!getServerConfig().createHousePickups) {
		return false;
	}

	if(!getHouseData(houseId)) {
		return false;
	}

	let houseData = getHouseData(houseId);

	//if(houseData.hasInterior) {
	//	return false;
	//}

	if(houseData.entrancePickupModel == -1) {
		return false;
	}

	let pickupModelId = getGameConfig().pickupModels[getGame()].House;

	if(getServerData().houses[houseId].entrancePickupModel != 0) {
		pickupModelId = getHouseData(houseId).entrancePickupModel;
	}

	let entrancePickup = createGamePickup(pickupModelId, getHouseData(houseId).entrancePosition, getGameConfig().pickupTypes[getGame()].house);
	if(entrancePickup != null) {
		setElementOnAllDimensions(entrancePickup, false);
		setElementDimension(entrancePickup, getHouseData(houseId).entranceDimension);
		setElementStreamInDistance(entrancePickup, getGlobalConfig().housePickupStreamInDistance);
		setElementStreamOutDistance(entrancePickup, getGlobalConfig().housePickupStreamOutDistance);
		setElementTransient(entrancePickup, false);

		getHouseData(houseId).entrancePickup = entrancePickup;
		updateHousePickupLabelData(houseId);
	}
}

// ===========================================================================

function createHouseEntranceBlip(houseId) {
	if(!areServerElementsSupported()) {
		return false;
	}

	if(!getServerConfig().createHouseBlips) {
		return false;
	}

	if(!getHouseData(houseId)) {
		return false;
	}

	let houseData = getHouseData(houseId);

	//if(houseData.hasInterior) {
	//	return false;
	//}

	if(houseData.entranceBlipModel == -1) {
		return false;
	}

	let blipModelId = getGameConfig().blipSprites[getGame()].House;
	if(getServerData().houses[houseId].entranceBlipModel != 0) {
		blipModelId = getHouseData(houseId).entranceBlipModel;
	}

	let entranceBlip = createGameBlip(houseData.entrancePosition, blipModelId, getColourByName("houseGreen"));
	if(entranceBlip != null) {
		if(houseData.exitDimension != -1) {
			setElementDimension(entranceBlip, houseData.entranceDimension);
			setElementOnAllDimensions(entranceBlip, false);
		} else {
			setElementOnAllDimensions(entranceBlip, true);
		}

		if(getGlobalConfig().houseBlipStreamInDistance == -1 || getGlobalConfig().houseBlipStreamOutDistance == -1)	{
			entranceBlip.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(entranceBlip, getGlobalConfig().houseBlipStreamInDistance);
			setElementStreamOutDistance(entranceBlip, getGlobalConfig().houseBlipStreamOutDistance);
		}

		setEntityData(entranceBlip, "vrr.owner.type", VRR_BLIP_HOUSE_ENTRANCE, false);
		setEntityData(entranceBlip, "vrr.owner.id", houseId, false);

		houseData.entranceBlip = entranceBlip;
	}
}

// ===========================================================================

function createHouseExitPickup(houseId) {
	if(!areServerElementsSupported()) {
		return false;
	}

	if(!getServerConfig().createHousePickups) {
		return false;
	}

	if(!getHouseData(houseId)) {
		return false;
	}

	let houseData = getHouseData(houseId);

	//if(houseData.hasInterior) {
	//	return false;
	//}

	if(houseData.exitPickupModel == -1) {
		return false;
	}

	let pickupModelId = getGameConfig().pickupModels[getGame()].Exit;

	if(getServerData().houses[houseId].exitPickupModel != 0) {
		pickupModelId = houseData.exitPickupModel;
	}

	let exitPickup = createGamePickup(pickupModelId, houseData.exitPosition, getGameConfig().pickupTypes[getGame()].house);
	if(exitPickup != null) {
		setElementDimension(exitPickup, houseData.exitDimension);
		setElementOnAllDimensions(exitPickup, false);
		setElementStreamInDistance(exitPickup, getGlobalConfig().housePickupStreamInDistance);
		setElementStreamOutDistance(exitPickup, getGlobalConfig().housePickupStreamOutDistance);
		setElementTransient(exitPickup, false);

		getHouseData(houseId).exitPickup = exitPickup;
		updateHousePickupLabelData(houseId);
	}
}

// ===========================================================================

function createHouseExitBlip(houseId) {
	if(!areServerElementsSupported()) {
		return false;
	}

	if(!getServerConfig().createHouseBlips) {
		return false;
	}

	if(!getHouseData(houseId)) {
		return false;
	}

	let houseData = getHouseData(houseId);

	//if(houseData.hasInterior) {
	//	return false;
	//}

	if(houseData.exitBlipModel == -1) {
		return false;
	}

	let blipModelId = getGameConfig().blipSprites[getGame()].Exit;

	if(getServerData().houses[houseId].exitBlipModel != 0) {
		blipModelId = houseData.exitBlipModel;
	}

	let exitBlip = createGameBlip(houseData.exitPosition, blipModelId, 1, getColourByName("houseGreen"));
	if(exitBlip != null) {
		if(houseData.exitDimension != -1) {
			setElementDimension(exitBlip, houseData.exitDimension);
			setElementOnAllDimensions(exitBlip, false);
		} else {
			setElementOnAllDimensions(entranceBlip, true);
		}

		if(getGlobalConfig().houseBlipStreamInDistance == -1 || getGlobalConfig().houseBlipStreamOutDistance == -1)	{
			exitBlip.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(exitBlip, getGlobalConfig().houseBlipStreamInDistance);
			setElementStreamOutDistance(exitBlip, getGlobalConfig().houseBlipStreamOutDistance);
		}
		setElementTransient(exitBlip, false);
		setEntityData(exitBlip, "vrr.owner.type", VRR_BLIP_HOUSE_EXIT, false);
		setEntityData(exitBlip, "vrr.owner.id", houseId, false);
		getHouseData(houseId).exitBlip = exitBlip;
	}
}

// ===========================================================================

function getHouseOwnerTypeText(ownerType) {
	switch(ownerType) {
		case VRR_HOUSEOWNER_CLAN:
			return "clan";

		case VRR_HOUSEOWNER_PLAYER:
			return "player";

		case VRR_HOUSEOWNER_NONE:
			return "not owned";

		case VRR_HOUSEOWNER_PUBLIC:
			return "not owned";

		case VRR_HOUSEOWNER_JOB:
			return "job";

		case VRR_HOUSEOWNER_BIZ:
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

	if(!areParamsEmpty(params)) {
		houseId = toInteger(params);
	}

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	let houseData = getHouseData(houseId);

	let ownerName = "Unknown";
	switch(getHouseData(houseId).ownerType) {
		case VRR_HOUSEOWNER_CLAN:
			ownerName = getClanData(houseData).name;
			break;

		case VRR_HOUSEOWNER_PLAYER:
			let subAccountData = loadSubAccountFromId(houseData.ownerId);
			ownerName = `${subAccountData.firstName} ${subAccountData.lastName} [${subAccountData.databaseId}]`;
			break;

		case VRR_HOUSEOWNER_NONE:
			ownerName = "None";
			break;

		case VRR_HOUSEOWNER_PUBLIC:
			ownerName = "Public";
			break;

		case VRR_HOUSEOWNER_BIZ:
			ownerName = getBusinessDataFromDatabaseId(houseData.ownerId).name;
			break;

		case VRR_HOUSEOWNER_JOB:
			ownerName = getJobData(houseData.ownerId).name;
			break;
	}


	let tempStats = [
		[`Name`, `${houseData.description}`],
		[`ID`, `${houseData.index}/${houseData.databaseId}`],
		[`Owner`, `${ownerName} (${getHouseOwnerTypeText(houseData.ownerType)})`],
		[`Locked`, `${getLockedUnlockedFromBool(houseData.locked)}`],
		[`BuyPrice`, `${houseData.buyPrice}`],
		[`RentPrice`, `${houseData.rentPrice}`],
		[`HasInterior`, `${getYesNoFromBool(houseData.hasInterior)}`],
		[`CustomInterior`, `${getYesNoFromBool(houseData.customInterior)}`],
		[`InteriorLights`, `${getOnOffFromBool(houseData.interiorLights)}`],
		[`RadioStation`, `${houseData.streamingRadioStation}`],
	];

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderHouseInfo", houseData.description)));
	let chunkedList = splitArrayIntoChunks(stats, 6);
	for(let i in chunkedList) {
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
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getHouseData(houseId).buyPrice = amount;
	getHouseData(houseId).needsSaved = true;
	updateHousePickupLabelData(houseId);
	messagePlayerSuccess(client, `{MAINCOLOUR}You set house {houseGreen}${getHouseData(houseId).description}'s{MAINCOLOUR} for-sale price to {ALTCOLOUR}$${makeLargeNumberReadable(amount)}`);
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
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");

	let amount = toInteger(getParam(params, " ", 1)) || 0;
	let houseId = getPlayerHouse(client);

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(amount < 0) {
		messagePlayerError(client, `The amount can't be less than 0!`);
		return false;
	}

	getHouseData(houseId).rentPrice = amount;
	getHouseData(houseId).needsSaved = true;
	updateHousePickupLabelData(houseId);
	messagePlayerSuccess(client, `{MAINCOLOUR}You set house {houseGreen}${getHouseData(houseId).description}'s{MAINCOLOUR} rent price to {ALTCOLOUR}$${makeLargeNumberReadable(amount)}`);
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

	if(!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if(getHouseData(houseId).buyPrice <= 0) {
		messagePlayerError(client, getLocaleString(client, "HouseNotForSale"));
		return false;
	}

	if(getPlayerCurrentSubAccount(client).cash < getHouseData(houseId).buyPrice) {
		messagePlayerError(client, getLocaleString(client, "HousePurchaseNotEnoughMoney"));
		return false;
	}

	showPlayerPrompt(client, getLocaleString(client, "BuyHouseConfirmMessage"), getLocaleString(client, "BuyHouseConfirmTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
	getPlayerData(client).promptType = VRR_PROMPT_HOUSEBUY;
}

// ===========================================================================

/**
 * @param {number} houseIndex - The data index of the house
 * @return {HouseData} The house's data (class instance)
 */
function getHouseData(houseId) {
	if(typeof getServerData().houses[houseId] != "undefined") {
		return getServerData().houses[houseId];
	}
}

// ===========================================================================

function doesHouseHaveInterior(houseId) {
	return getHouseData(houseId).hasInterior;
}

// ===========================================================================

function deleteHouseEntrancePickup(houseId) {
	if(!areServerElementsSupported()) {
		return false;
	}

	if(getHouseData(houseId).entrancePickup != null) {
		//removeFromWorld(getHouseData(houseId).entrancePickup);
		deleteGameElement(getHouseData(houseId).entrancePickup);
		getHouseData(houseId).entrancePickup = null;
	}
}

// ===========================================================================

function deleteHouseExitPickup(houseId) {
	if(!areServerElementsSupported()) {
		return false;
	}

	if(getHouseData(houseId).exitPickup != null) {
		//removeFromWorld(getHouseData(houseId).exitPickup);
		deleteGameElement(getHouseData(houseId).exitPickup);
		getHouseData(houseId).exitPickup = null;
	}
}

// ===========================================================================

function deleteHouseEntranceBlip(houseId) {
	if(!areServerElementsSupported()) {
		return false;
	}

	if(getHouseData(houseId).entranceBlip != null) {
		//removeFromWorld(getHouseData(houseId).entranceBlip);
		deleteGameElement(getHouseData(houseId).entranceBlip);
		getHouseData(houseId).entranceBlip = null;
	}
}

// ===========================================================================

function deleteHouseExitBlip(houseId) {
	if(!areServerElementsSupported()) {
		return false;
	}

	if(getHouseData(houseId).exitBlip != null) {
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
	for(let i in clients) {
		if(getPlayerHouse(clients[i]) != -1) {
			removePlayerFromHouse(clients[i]);
		}
	}

	for(let i in getServerData().houses) {
		deleteHouseExitBlip(i);
		deleteHouseEntranceBlip(i);
		deleteHouseExitPickup(i);
		deleteHouseEntrancePickup(i);
	}

	clearArray(getServerData().houses);
	getServerData().houses = loadHousesFromDatabase();
	createAllHousePickups();
	createAllHouseBlips();

	announceAdminAction(`AllHousesReloaded`);
}

// ===========================================================================

function exitHouse(client) {
	let houseId = getPlayerHouse(client);
	if(isPlayerSpawned(client)) {
		setPlayerInterior(client, getServerData().house[houseId].entranceInterior);
		setPlayerDimension(client, getServerData().house[houseId].entranceDimension);
		setPlayerPosition(client, getServerData().house[houseId].entrancePosition);
	}
}

// ===========================================================================

function setHouseDataIndexes() {
	for(let i in getServerData().houses) {
		getServerData().houses[i].index = i;

		//for(let j in getServerData().houses[i].locations) {
		//	getServerData().houses[i].locations[j].index = j;
		//	getServerData().houses[i].locations[j].houseIndex = i;
		//}

		//for(let j in getServerData().houses[i].gameScripts) {
		//	getServerData().houses[i].gameScripts[j].index = j;
		//	getServerData().houses[i].gameScripts[j].houseIndex = i;
		//}
	}
}

// ===========================================================================

function cacheAllHouseItems() {
	for(let i in getServerData().houses) {
		cacheHouseItems(i);
	}
}

// ===========================================================================

function cacheHouseItems(houseId) {
	getHouseData(houseId).itemCache = [];

	for(let i in getServerData().items) {
		if(getItemData(i).ownerType == VRR_ITEM_OWNER_HOUSE && getItemData(i).ownerId == getHouseData(houseId).databaseId) {
			getHouseData(houseId).itemCache.push(i);
		}
	}
}

// ===========================================================================

function getHouseIdFromDatabaseId(databaseId) {
	let houses = getServerData().houses;
	for(let i in houses) {
		if(houses[i].databaseId == databaseId) {
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
//		sendPlayerGameScriptState(client, VRR_GAMESCRIPT_DENY);
//	}
//}

// ===========================================================================

function updateHouseInteriorLightsForOccupants(houseId) {
	let clients = getClients()
	for(let i in clients) {
		if(getPlayerHouse(clients[i]) == houseId) {
			updateInteriorLightsForPlayer(clients[i], getHouseData(houseId).interiorLights);
		}
	}
}

// ===========================================================================

function canPlayerSetHouseInteriorLights(client, houseId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_CLAN && getHouseData(houseId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerLockUnlockHouse(client, houseId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER && getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_CLAN && getHouseData(houseId).ownerId == getClanData(getPlayerClan(client)).databaseId) {
		if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function resetHousePickups(houseId) {
	deleteHouseEntrancePickup(houseId);
	deleteHouseExitPickup(houseId);
	createHouseEntrancePickup(houseId);
	createHouseExitPickup(houseId);
}

// ===========================================================================

function resetHouseBlips(houseId) {
	deleteHouseEntranceBlip(houseId);
	deleteHouseExitBlip(houseId);
	createHouseEntranceBlip(houseId);
	createHouseExitBlip(houseId);
}

// ===========================================================================

function resetAllHousePickups() {
	for(let i in getServerData().houses) {
		resetHousePickups(i);
	}
}

// ===========================================================================

function resetAllHouseBlips() {
	for(let i in getServerData().houses) {
		resetHouseBlips(i);
	}
}

// ===========================================================================

function canPlayerManageHouse(client, houseId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageHouses"))) {
		return true;
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_PLAYER) {
		if(getHouseData(houseId).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	if(getHouseData(houseId).ownerType == VRR_HOUSEOWNER_CLAN) {
		if(getHouseData(houseId).ownerId == getPlayerClan(client)) {
			if(doesPlayerHaveClanPermission(client, getClanFlagValue("ManageHouses"))) {
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
	if(isNaN(params)) {
		for(let i in getServerData().houses) {
			if(toLowerCase(getServerData().houses[i].description).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getServerData().houses[params] != "undefined") {
			return toInteger(params);
		}
	}
	return false;
}

// ===========================================================================

function updateHousePickupLabelData(houseId) {
	if(!areServerElementsSupported()) {
		return false;
	}

	let houseData = getHouseData(houseId);

	if(houseData.entrancePickup != null) {
		setEntityData(houseData.entrancePickup, "vrr.owner.type", VRR_PICKUP_HOUSE_ENTRANCE, false);
		setEntityData(houseData.entrancePickup, "vrr.owner.id", houseId, false);
		setEntityData(houseData.entrancePickup, "vrr.label.type", VRR_LABEL_HOUSE, true);
		setEntityData(houseData.entrancePickup, "vrr.label.name", houseData.description, true);
		setEntityData(houseData.entrancePickup, "vrr.label.locked", houseData.locked, true);
		if(houseData.buyPrice > 0) {
			setEntityData(houseData.entrancePickup, "vrr.label.price", houseData.buyPrice, true);
			setEntityData(houseData.entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_BUYHOUSE, true);
		} else {
			if(houseData.rentPrice > 0) {
				setEntityData(houseData.entrancePickup, "vrr.label.rentprice", houseData.rentPrice, true);
				setEntityData(houseData.entrancePickup, "vrr.label.help", VRR_PROPLABEL_INFO_RENTHOUSE, true);
			}
		}
	}

	if(houseData.exitPickup != null) {
		setEntityData(houseData.exitPickup, "vrr.owner.type", VRR_PICKUP_HOUSE_EXIT, false);
		setEntityData(houseData.exitPickup, "vrr.owner.id", houseId, false);
		setEntityData(houseData.exitPickup, "vrr.label.type", VRR_LABEL_EXIT, true);
	}
}

// ===========================================================================

function deleteAllHouseBlips() {
	for(let i in getServerData().houses) {
		deleteHouseEntranceBlip(i);
		deleteHouseExitBlip(i);
	}
}

// ===========================================================================

function deleteAllHousePickups() {
	for(let i in getServerData().houses) {
		deleteHouseEntrancePickup(i);
		deleteHouseExitPickup(i);
	}
}

// ===========================================================================

function createHouseBlips(houseId) {
	createHouseEntranceBlip(houseId);
	createHouseExitBlip(houseId);
}

// ===========================================================================

function createHousePickups(houseId) {
	createHouseEntrancePickup(houseId);
	createHouseExitPickup(houseId);
}

// ===========================================================================