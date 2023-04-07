// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: callbox.js
// DESC: Provides callbox (for police) functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

class CallBoxData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.index = -1;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.enabled = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["callbox_id"]);
			this.serverId = toInteger(dbAssoc["callbox_server"]);
			this.enabled = intToBool(dbAssoc["callbox_enabled"]);
			this.position = toVector3(toFloat(dbAssoc["callbox_pos_x"]), toFloat(dbAssoc["callbox_pos_y"]), toFloat(dbAssoc["callbox_pos_z"]));
			this.whoAdded = toInteger(dbAssoc["callbox_who_added"]);
			this.whenAdded = toInteger(dbAssoc["callbox_when_added"]);
		}
	}
};

// ===========================================================================

function initCallBoxScript() {
	logToConsole(LOG_INFO, "[V.RP.CallBox]: Initializing callbox script ...");
	logToConsole(LOG_INFO, "[V.RP.CallBox]: Callbox script initialized successfully!");
}

// ===========================================================================

function createCallBoxCommand(command, params, client) {
	let closestCallBox = getClosestCallBox(getPlayerPosition(client));
	if (closestCallBox != -1) {
		if (getDistance(getPlayerPosition(client), getCallBoxData(closestCallBox).position) <= globalConfig.callBoxUseDistance) {
			messagePlayerError(client, "There is already a callbox at this location!");
			return false;
		}
	}

	createCallBox(getPlayerPosition(client), getPlayerData(client).accountData.databaseId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a callbox.`);
}

// ===========================================================================

function createCallBox(position, addedBy = defaultNoAccountId) {
	let tempCallBoxData = new CallBoxData(false);
	tempCallBoxData.position = position;
	tempCallBoxData.needsSaved = true;
	tempCallBoxData.whoAdded = addedBy;
	tempCallBoxData.whenAdded = getCurrentUnixTimestamp();
	tempCallBoxData.enabled = true;

	serverData.callBoxes.push(tempCallBoxData);

	setAllCallBoxDataIndexes();
	saveAllCallBoxesToDatabase();

	return true;
}

// ===========================================================================

function getClosestCallBox(position) {
	if (serverData.callBoxes.length > 0) {

		let closest = 0;
		for (let i in serverData.callBoxes) {
			if (getDistance(position, serverData.callBoxes[i].position) < getDistance(position, serverData.callBoxes[closest].position)) {
				closest = i;
			}
		}

		return closest;
	}

	return -1;
}

// ===========================================================================

/**
 * @param {Number} callBoxIndex - The data index of the payphone
 * @return {PayPhoneData} The payphone's data (class instance)
 */
function getPayPhoneData(callBoxIndex) {
	if (callBoxIndex == -1) {
		return false;
	}

	if (typeof serverData.callBoxes[callBoxIndex] != "undefined") {
		return serverData.callBoxes[callBoxIndex];
	}

	return false;
}

// ===========================================================================

function deleteCallBoxCommand(command, params, client) {
	let callBoxIndex = getClosestCallBox(getPlayerPosition(client));

	if (!areParamsEmpty(params)) {
		callBoxIndex = getCallBoxFromParams(params);
	}

	if (callBoxIndex == -1) {
		messagePlayerError(client, "Call box not found!");
		return false;
	}

	if (getCallBoxData(callBoxIndex) == false) {
		messagePlayerError(client, "Call box not found!");
		return false;
	}

	messagePlayerSuccess(client, "The call box was deleted");

	quickDatabaseQuery(`UPDATE callbox_main SET callbox_deleted = 1, callbox_who_deleted = ${getPlayerData(client).accountData.databaseId}, callbox_when_deleted = UNIX_TIMESTAMP() WHERE callbox_id = ${getCallBoxData(callBoxIndex).databaseId}`);

	serverData.callBoxes.splice(callBoxIndex, 1);
	setAllCallBoxDataIndexes();
}

// ===========================================================================

function loadCallBoxesFromDatabase() {
	logToConsole(LOG_DEBUG, `[V.RP.CallBox]: Loading call boxes from database ...`);
	let dbConnection = connectToDatabase();
	let tempCallBoxes = [];
	let dbAssoc = [];
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM callbox_main WHERE callbox_server = ${getServerId()} AND callbox_enabled = 1`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempCallBoxData = new CallBoxData(dbAssoc[i]);
				tempCallBoxes.push(tempCallBoxData);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.CallBox]: ${tempCallBoxes.length} call boxes loaded from database successfully!`);
	return tempCallBoxes;
}

// ===========================================================================

function saveAllCallBoxesToDatabase() {
	if (serverConfig.devServer) {
		return false;
	}

	for (let i in serverData.callBoxes) {
		saveCallBoxToDatabase(i);
	}
}

// ===========================================================================

function saveCallBoxToDatabase(callBoxIndex) {
	if (serverConfig.devServer) {
		logToConsole(LOG_VERBOSE, `[V.RP.CallBox]: Call box ${callBoxIndex} can't be saved because server is running as developer only. Aborting save ...`);
		return false;
	}

	if (getCallBoxData(callBoxIndex) == false) {
		logToConsole(LOG_VERBOSE, `[V.RP.CallBox]: Call box ${callBoxIndex} data is invalid. Aborting save ...`);
		return false;
	}

	let tempCallBoxData = getCallBoxData(callBoxIndex);

	if (tempPayPhoneData.databaseId == -1) {
		logToConsole(LOG_VERBOSE, `[V.RP.CallBox]: Call box ${callBoxIndex} is a temp call box. Aborting save ...`);
		return false;
	}

	if (!tempCallBoxData.needsSaved) {
		logToConsole(LOG_VERBOSE, `[V.RP.CallBox]: Call box ${callBoxIndex} hasn't changed data. Aborting save ...`);
		return false;
	}

	logToConsole(LOG_VERBOSE, `[V.RP.CallBox]: Saving call box ${tempCallBoxData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let data = [
			["payphone_server", getServerId()],
			["payphone_enabled", boolToInt(tempCallBoxData.enabled)],
			["payphone_who_added", toInteger(tempCallBoxData.whoAdded)],
			["payphone_when_added", toInteger(tempCallBoxData.whenAdded)],
			["payphone_pos_x", toFloat(tempCallBoxData.position.x)],
			["payphone_pos_y", toFloat(tempCallBoxData.position.y)],
			["payphone_pos_z", toFloat(tempCallBoxData.position.z)],
		];

		let dbQuery = null;
		if (tempCallBoxData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("callbox_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempCallBoxData.databaseId = getDatabaseInsertId(dbConnection);
			tempCallBoxData.needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("callbox_main", data, `callbox_id=${tempCallBoxData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempCallBoxData.needsSaved = false;
		}

		logToConsole(LOG_VERBOSE, `[V.RP.CallBox]: Saved call box ${callBoxIndex} to database!`);

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}

	return false;
}

// ===========================================================================

function setAllCallBoxDataIndexes() {
	for (let i in serverData.callBoxes) {
		serverData.callBoxes[i].index = i;
	}
}

// ===========================================================================

function getNearbyCallBoxesCommand(command, params, client) {
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

	let nearbyCallBoxes = getCallBoxesInRange(getPlayerPosition(client), distance);

	if (nearbyCallBoxes.length == 0) {
		messagePlayerAlert(client, `There are no call boxes within ${distance} meters`);
		return false;
	}

	let callBoxesList = nearbyCallBoxes.map(function (x) {
		return `{chatBoxListIndex}${x.index}: {mediumGrey}(${toFloat(getDistance(getPlayerPosition(client), x.position)).toFixed(2)} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.position))))})`;
	});
	let chunkedList = splitArrayIntoChunks(callBoxesList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(`Call Boxes (within ${distance} meters)`));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function getCallBoxesInRange(position, distance) {
	return serverData.callBoxes.filter((callBox) => getDistance(position, callBox.position) <= distance);
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
function getCallBoxInfoCommand(command, params, client) {
	let callBoxIndex = getClosestCallBox(getPlayerPosition(client));

	if (!areParamsEmpty(params)) {
		callBoxIndex = getCallBoxFromParams(params);
	}

	if (!getCallBoxData(callBoxIndex)) {
		messagePlayerError(client, "Call box not found!");
		return false;
	}

	let callBoxData = getCallBoxData(callBoxIndex);

	let tempInfo = [
		[`ID`, `${callBoxData.index}/${callBoxData.databaseId}`],
		[`Added By`, `${loadAccountFromId(callBoxData.whoAdded).name} on ${new Date(callBoxData.whenAdded * 1000).toLocaleString()}`],
	];

	let infoList = tempInfo.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader("Call Box Info"));
	let chunkedList = splitArrayIntoChunks(infoList, 6);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function getCallBoxFromParams(params) {
	if (typeof serverData.callBoxes[params] != "undefined") {
		return toInteger(params);
	}

	return false;
}

// ===========================================================================