// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: payphone.js
// DESC: Provides payphone functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

const V_PAYPHONE_STATE_NONE = 0;
const V_PAYPHONE_STATE_IDLE = 1;
const V_PAYPHONE_STATE_RINGING = 2;
const V_PAYPHONE_STATE_ACTIVE_CALL = 3;
const V_PAYPHONE_STATE_BROKEN = 4;

// ===========================================================================

class PayPhoneData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.state = V_PAYPHONE_STATE_IDLE;
		this.number = 0;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.usingPlayer = false;
		this.connectedPlayer = false;
		this.enabled = false;
		this.broken = false;
		this.price = 0;
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["payphone_id"]);
			this.serverId = toInteger(dbAssoc["payphone_server"]);
			this.number = toInteger(dbAssoc["payphone_number"]);
			this.enabled = intToBool(dbAssoc["payphone_enabled"]);
			this.broken = intToBool(dbAssoc["payphone_broken"]);
			this.position = toVector3(toFloat(dbAssoc["payphone_pos_x"]), toFloat(dbAssoc["payphone_pos_y"]), toFloat(dbAssoc["payphone_pos_z"]));
			this.price = toInteger(dbAssoc["payphone_price"]);
			this.whoAdded = toInteger(dbAssoc["payphone_who_added"]);
			this.whenAdded = toInteger(dbAssoc["payphone_when_added"]);
		}
	}
};

// ===========================================================================

function initPayPhoneScript() {
	logToConsole(LOG_INFO, "[V.RP.PayPhone]: Initializing payphone script ...");
	logToConsole(LOG_INFO, "[V.RP.PayPhone]: Payphone script initialized successfully!");
}

// ===========================================================================

function createPayPhoneCommand(command, params, client) {
	let payPhoneNumber = generateRandomPhoneNumber();

	if (areParamsEmpty(params)) {
		if (isNaN(params)) {
			messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
			return false;
		}

		payPhoneNumber = toInteger(params);
	}

	createPayPhone(getPlayerPosition(client), payPhoneNumber);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a payphone with number {ALTCOLOUR}${payPhoneNumber}`);
}

// ===========================================================================

function createPayPhone(position, number) {
	let tempPayPhoneData = new PayPhoneData(false);
	tempPayPhoneData.number = number;
	tempPayPhoneData.position = position;
	tempPayPhoneData.needsSaved = true;

	getServerData().payphones.push(tempPayPhoneData);

	return true;
}

// ===========================================================================

function getClosestPayPhone(position) {
	let closest = 0;
	for (let i in getServerData().payPhones) {
		if (getDistance(position, getServerData().payPhones[i].position) <= getDistance(position, getServerData().payPhones[closest].position)) {
			closest = i;
		}
	}

	return closest;
}

// ===========================================================================

/**
 * @param {Number} payPhoneIndex - The data index of the payphone
 * @return {PayPhoneData} The payphone's data (class instance)
 */
function getPayPhoneData(payPhoneIndex) {
	if (payPhoneIndex == -1) {
		return false;
	}

	if (typeof getServerData().payPhones[payPhoneIndex] != "undefined") {
		return getServerData().payPhones[payPhoneIndex];
	}

	return false;
}

// ===========================================================================

function callPlayerCommand(command, params, client) {

}

// ===========================================================================

function loadPayPhonesFromDatabase() {
	logToConsole(LOG_DEBUG, `[V.RP.PayPhone]: Loading payphones from database ...`);
	let dbConnection = connectToDatabase();
	let tempPayPhones = [];
	let dbAssoc = [];
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM payphone_main WHERE payphone_server = ${getServerId()} AND payphone_enabled = 1`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempPayPhoneData = new PayPhoneData(dbAssoc[i]);
				tempPayPhones.push(tempPayPhoneData);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.PayPhone]: ${tempPayPhones.length} payphones loaded from database successfully!`);
	return tempPayPhones;
}

// ===========================================================================

function saveAllPayPhonesToDatabase() {
	if (getServerConfig().devServer) {
		return false;
	}

	for (let i in getServerData().payPhones) {
		savePayPhoneToDatabase(i);
	}
}

// ===========================================================================

function savePayPhoneToDatabase(payPhoneIndex) {
	if (getServerConfig().devServer) {
		logToConsole(LOG_VERBOSE, `[V.RP.PayPhone]: Payphone ${payPhoneIndex} can't be saved because server is running as developer only. Aborting save ...`);
		return false;
	}

	if (getPayPhoneData(payPhoneIndex) == false) {
		logToConsole(LOG_VERBOSE, `[V.RP.PayPhone]: Payphone ${payPhoneIndex} data is invalid. Aborting save ...`);
		return false;
	}

	let tempPayPhoneData = getPayPhoneData(payPhoneIndex);

	if (tempPayPhoneData.databaseId == -1) {
		logToConsole(LOG_VERBOSE, `[V.RP.PayPhone]: Payphone ${payPhoneIndex} is a temp payphone. Aborting save ...`);
		return false;
	}

	if (!tempPayPhoneData.needsSaved) {
		logToConsole(LOG_VERBOSE, `[V.RP.PayPhone]: Payphone ${payPhoneIndex} hasn't changed data. Aborting save ...`);
		return false;
	}

	logToConsole(LOG_VERBOSE, `[V.RP.PayPhone]: Saving payphone ${tempPayPhoneData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let data = [
			["payphone_server", getServerId()],
			["payphone_number", toInteger(tempPayPhoneData.number)],
			["payphone_enabled", boolToInt(tempPayPhoneData.enabled)],
			["payphone_price", toInteger(tempPayPhoneData.price)],
			["payphone_who_added", toInteger(tempPayPhoneData.whoAdded)],
			["payphone_when_added", toInteger(tempPayPhoneData.whenAdded)],
			["payphone_pos_x", toFloat(tempPayPhoneData.position.x)],
			["payphone_pos_y", toFloat(tempPayPhoneData.position.y)],
			["payphone_pos_z", toFloat(tempPayPhoneData.position.z)],
		];

		let dbQuery = null;
		if (tempPayPhoneData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("payphone_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempPayPhoneData.databaseId = getDatabaseInsertId(dbConnection);
			tempPayPhoneData.needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("payphone_main", data, `payphone_id=${tempPayPhoneData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempPayPhoneData.needsSaved = false;
		}

		logToConsole(LOG_VERBOSE, `[V.RP.PayPhone]: Saved payphone ${payPhoneIndex} to database!`);

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}

	return false;
}

// ===========================================================================
