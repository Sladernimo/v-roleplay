// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: payphone.js
// DESC: Provides payphone functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

class PayPhoneData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.index = -1;
		this.state = V_PAYPHONE_STATE_IDLE;
		this.number = 0;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.usingPlayer = null;
		this.connectedPlayer = null;
		this.enabled = false;
		this.broken = false;
		this.price = 0;
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.otherPayPhone = -1;

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

	if (!areParamsEmpty(params)) {
		if (isNaN(params)) {
			messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
			return false;
		}

		payPhoneNumber = toInteger(params);
	}

	let closestPayPhone = getClosestPayPhone(getPlayerPosition(client));
	if (closestPayPhone != -1) {
		if (getDistance(getPlayerPosition(client), getPayPhoneData(closestPayPhone).position) <= globalConfig.payPhoneAnswerDistance) {
			messagePlayerError(client, "There is already a payphone at this location!");
			return false;
		}
	}

	createPayPhone(getPlayerPosition(client), payPhoneNumber, getPlayerData(client).accountData.databaseId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a payphone with number {ALTCOLOUR}${payPhoneNumber}`);
}

// ===========================================================================

function createPayPhone(position, number, addedBy = defaultNoAccountId) {
	let tempPayPhoneData = new PayPhoneData(false);
	tempPayPhoneData.number = number;
	tempPayPhoneData.position = position;
	tempPayPhoneData.state = V_PAYPHONE_STATE_IDLE;
	tempPayPhoneData.needsSaved = true;
	tempPayPhoneData.whoAdded = addedBy;
	tempPayPhoneData.whenAdded = getCurrentUnixTimestamp();
	tempPayPhoneData.whoDeleted = defaultNoAccountId;
	tempPayPhoneData.whenDeleted = 0;
	tempPayPhoneData.enabled = true;

	serverData.payPhones.push(tempPayPhoneData);

	setAllPayPhoneDataIndexes();
	saveAllPayPhonesToDatabase();

	sendPayPhoneToPlayer(null, serverData.payPhones.length - 1, false, tempPayPhoneData.state, tempPayPhoneData.position);

	return true;
}

// ===========================================================================

function getClosestPayPhone(position) {
	if (serverData.payPhones.length > 0) {

		let closest = 0;
		for (let i in serverData.payPhones) {
			if (getDistance(position, serverData.payPhones[i].position) < getDistance(position, serverData.payPhones[closest].position)) {
				closest = i;
			}
		}

		return closest;
	}

	return -1;
}

// ===========================================================================

/**
 * @param {Number} payPhoneIndex - The data index of the payphone
 * @return {PayPhoneData} The payphone's data (class instance)
 */
function getPayPhoneData(payPhoneIndex) {
	if (payPhoneIndex == -1) {
		return null;
	}

	if (typeof serverData.payPhones[payPhoneIndex] != "undefined") {
		return serverData.payPhones[payPhoneIndex];
	}

	return null;
}

// ===========================================================================

function getPayPhoneNumberCommand(command, params, client) {
	let closestPayPhone = getClosestPayPhone(getPlayerPosition(client));

	if (closestPayPhone == -1) {
		messagePlayerError(client, getLocaleString(client, "NoPayPhoneCloseEnough"));
		return false;
	}

	if (getDistance(getPlayerPosition(client), getPayPhoneData(closestPayPhone).position) > globalConfig.payPhoneAnswerDistance) {
		messagePlayerError(client, getLocaleString(client, "NoPayPhoneCloseEnough"));
		return false;
	}

	messagePlayerInfo(client, getLocaleString(client, "ThisPayPhoneNumber", getPayPhoneData(closestPayPhone).number));
}

// ===========================================================================

function deletePayPhoneCommand(command, params, client) {
	let payPhoneIndex = getClosestPayPhone(getPlayerPosition(client));

	if (!areParamsEmpty(params)) {
		payPhoneIndex = getPayPhoneFromParams(params);
	}

	if (payPhoneIndex == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidPayPhone"));
		return false;
	}

	if (getPayPhoneData(payPhoneIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidPayPhone"));
		return false;
	}

	messagePlayerInfo(client, getLocaleString(client, "PayPhoneDeleted", getPayPhoneData(payPhoneIndex).number));

	// Alert player using the phone, if any
	if (getPayPhoneData(payPhoneIndex).usingPlayer != null) {
		messagePlayerAlert(client, getLocaleString(client, "UsingPayPhoneDeleted"));
	}

	// Alert player on the other end of the call, if any
	if (getPayPhoneData(payPhoneIndex).connectedPlayer != null) {
		messagePlayerNormal(getPayPhoneData(payPhoneIndex).connectedPlayer, getLocaleString("PayPhoneRecipientHangup", "0"));
	}

	stopUsingPayPhone(getPayPhoneData(payPhoneIndex).usingPlayer);
	stopUsingPayPhone(getPayPhoneData(payPhoneIndex).connectedPlayer);

	quickDatabaseQuery(`UPDATE payphone_main SET payphone_deleted = 1, payphone_who_deleted = ${getPlayerData(client).accountData.databaseId}, payphone_when_deleted = UNIX_TIMESTAMP() WHERE payphone_id = ${getPayPhoneData(payPhoneIndex).databaseId}`);

	serverData.payPhones.splice(payPhoneIndex, 1);
}

// ===========================================================================

function callPayPhoneCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (getPlayerData(client).usingPayPhone != -1) {
		messagePlayerError(client, getLocaleString(client, "AlreadyUsingPayPhone"));
		return false;
	}

	let closestPayPhone = getClosestPayPhone(getPlayerPosition(client));

	if (closestPayPhone == -1) {
		messagePlayerError(client, getLocaleString(client, "NoPayPhoneCloseEnough"));
		return false;
	}

	if (getDistance(getPlayerPosition(client), getPayPhoneData(closestPayPhone).position) > globalConfig.payPhoneAnswerDistance) {
		messagePlayerError(client, getLocaleString(client, "NoPayPhoneCloseEnough"));
		return false;
	}

	// Will work on dual number/player calling param later
	//let targetRecipient = getPayPhoneRecipientFromParams(params);

	let targetClient = getPlayerFromParams(params);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!canPlayerBeCalledOnPayPhone(targetClient)) {
		messagePlayerError(client, getLocaleString(client, "UnableToCallPlayer", getCharacterFullName(targetClient)));
		return false;
	}

	let closestPayPhoneTarget = getClosestPayPhone(getPlayerPosition(targetClient));

	if (closestPayPhoneTarget == closestPayPhone) {
		messagePlayerError(client, getLocaleString(client, "UnableToCallPlayer", getCharacterFullName(targetClient)));
		return false;
	}

	messagePlayerAlert(targetClient, getLocaleString(
		targetClient,
		"PayPhoneIncomingCall",
		Math.round(getDistance(getPlayerPosition(targetClient), getPayPhoneData(closestPayPhoneTarget).position)),
		toLowerCase(getLocaleString(targetClient, "Meters")),
		toLowerCase(getGroupedLocaleString(targetClient, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(targetClient), getPayPhoneData(closestPayPhoneTarget).position)))),
		`{ALTCOLOUR}/answer{MAINCOLOUR}`
	));

	getPayPhoneData(closestPayPhone).state = V_PAYPHONE_STATE_CALLING;
	getPayPhoneData(closestPayPhone).usingPlayer = client;

	sendPayPhonePickupToPlayer(client);

	makePlayerPlayAnimation(client, getAnimationFromParams("phonepickup"));
	let nearbyPlayers = getPlayersInRange(getPlayerPosition(client), 3);
	for (let i in nearbyPlayers) {
		sendPayPhonePickupToPlayer(nearbyPlayers[i]);
	}

	setTimeout(function () {
		for (let i in nearbyPlayers) {
			sendPayPhoneDialingToPlayer(nearbyPlayers[i]);
		}
		setTimeout(function () {
			makePlayerPlayAnimation(client, getAnimationFromParams("phonetalk"));
			getPayPhoneData(closestPayPhoneTarget).state = V_PAYPHONE_STATE_RINGING;
			getPayPhoneData(closestPayPhoneTarget).usingPlayer = client;
			getPayPhoneData(closestPayPhoneTarget).otherPayPhone = closestPayPhone;
			getPayPhoneData(closestPayPhone).otherPayPhone = closestPayPhoneTarget;

			getPlayerData(client).usingPayPhone = closestPayPhone;

			sendPayPhoneStateToPlayer(null, closestPayPhone, V_PAYPHONE_STATE_CALLING);
			sendPayPhoneStateToPlayer(null, closestPayPhoneTarget, V_PAYPHONE_STATE_RINGING);
		}, globalConfig.payPhoneDialToTalkAnimationDelay);
	}, globalConfig.payPhonePickupToDialAnimationDelay);
}

// ===========================================================================

function givePayPhoneToPlayerCommand(command, params, client) {
	if (getPlayerData(client).usingPayPhone == -1) {
		messagePlayerError(client, "NotUsingPayPhone");
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getDistance(getPlayerPosition(client), getPlayerPosition(targetClient)) >= globalConfig.payPhoneGiveDistance) {
		messagePlayerError(client, getLocaleString(client, "NoPlayerCloseEnough"))
		return false;
	}

	let otherClient = getPlayerData(client).payPhoneOtherPlayer;
	messagePlayerAlert(otherClient, getLocaleString(otherClient, "PayPhoneOccupantSwitched"));
	messagePlayerAlert(targetClient, getLocaleString(targetClient, "PayPhoneReceived", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));
	messagePlayerSuccess(client, getLocaleString(client, "PayPhoneGiven", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));

	getPlayerData(targetClient).payPhoneCallStart = getPlayerData(client).payPhoneCallStart;
	getPlayerData(targetClient).payPhoneOtherPlayer = otherClient;
	getPlayerData(targetClient).usingPayPhone = getPlayerData(client).usingPayPhone;
	getPlayerData(targetClient).payPhoneInitiatedCall = getPlayerData(client).payPhoneInitiatedCall;

	getPlayerData(client).payPhoneCallStart = 0;
	getPlayerData(client).payPhoneOtherPlayer = null;
	getPlayerData(client).usingPayPhone = -1;
	getPlayerData(client).payPhoneInitiatedCall = false;

	getPlayerData(otherClient).payPhoneCallStart = getCurrentUnixTimestamp();
	getPlayerData(otherClient).payPhoneOtherPlayer = targetClient;

	makePlayerStopAnimation(client);
	makePlayerPlayAnimation(targetClient, getAnimationFromParams("phonetalk"));
}

// ===========================================================================

function answerPayPhoneCommand(command, params, client) {
	//if (areParamsEmpty(params)) {
	//	messagePlayerSyntax(client, getCommandSyntaxText(command));
	//	return false;
	//}

	if (getPlayerData(client).usingPayPhone != -1) {
		messagePlayerError(client, getLocaleString(client, "AlreadyUsingPayPhone"));
		return false;
	}

	let closestPayPhone = getClosestPayPhone(getPlayerPosition(client));

	if (getDistance(getPlayerPosition(client), getPayPhoneData(closestPayPhone).position) > globalConfig.payPhoneAnswerDistance) {
		messagePlayerError(client, getLocaleString(client, "NoPayPhoneCloseEnough"));
		return false;
	}

	if (getPayPhoneData(closestPayPhone).state != V_PAYPHONE_STATE_RINGING) {
		messagePlayerError(client, getLocaleString(client, "PayPhoneNotRinging"));
		return false;
	}

	let otherClient = getPayPhoneData(closestPayPhone).usingPlayer;
	messagePlayerAlert(otherClient, getLocaleString(client, "PayPhoneRecipientAnswered"));
	messagePlayerNormal(client, getLocaleString(client, "PayPhoneAnswered"));

	getPlayerData(client).payPhoneCallStart = getCurrentUnixTimestamp();
	getPlayerData(client).payPhoneOtherPlayer = otherClient;
	getPlayerData(client).usingPayPhone = closestPayPhone;
	getPlayerData(otherClient).payPhoneCallStart = getCurrentUnixTimestamp();
	getPlayerData(otherClient).payPhoneOtherPlayer = client;

	getPayPhoneData(closestPayPhone).state = V_PAYPHONE_STATE_ACTIVE_CALL;
	getPayPhoneData(closestPayPhone).usingPlayer = client;
	getPayPhoneData(getPlayerData(otherClient).usingPayPhone).state = V_PAYPHONE_STATE_ACTIVE_CALL;

	sendPayPhoneStateToPlayer(null, closestPayPhone, V_PAYPHONE_STATE_ACTIVE_CALL);
	sendPayPhoneStateToPlayer(null, getPlayerData(otherClient).usingPayPhone, V_PAYPHONE_STATE_ACTIVE_CALL);

	makePlayerPlayAnimation(client, getAnimationFromParams("phonepickup"));
	let nearbyPlayers = getPlayersInRange(getPlayerPosition(client), 3);
	for (let i in nearbyPlayers) {
		sendPayPhonePickupToPlayer(nearbyPlayers[i]);
	}

	setTimeout(function () {
		makePlayerPlayAnimation(client, getAnimationFromParams("phonepickup"));
	}, globalConfig.payPhonePickupToTalkAnimationDelay);

	setPlayerControlState(client, false);
	setPlayerControlState(otherClient, false);
}

// ===========================================================================

function hangupPayPhoneCommand(command, params, client) {
	//if (areParamsEmpty(params)) {
	//	messagePlayerSyntax(client, getCommandSyntaxText(command));
	//	return false;
	//}

	if (getPlayerData(client).usingPayPhone == -1) {
		messagePlayerError(client, getLocaleString(client, "NotUsingPayPhone"));
		return false;
	}

	if (getPayPhoneData(getPlayerData(client).usingPayPhone) == null) {
		getPlayerData(client).usingPayPhone = -1
		messagePlayerError(client, getLocaleString(client, "InvalidPayPhone"));
		return false;
	}

	let clientPayPhoneIndex = getPlayerData(client).usingPayPhone;
	let clientPayPhone = getPayPhoneData(clientPayPhoneIndex);

	if (clientPayPhone.state == V_PAYPHONE_STATE_CALLING) {
		clientPayPhone.state = V_PAYPHONE_STATE_IDLE;
		clientPayPhone.usingPlayer = null;
		clientPayPhone.otherPayPhone = -1;

		sendPayPhoneStateToPlayer(null, clientPayPhoneIndex, V_PAYPHONE_STATE_IDLE);

		let otherPayPhoneIndex = getPayPhoneUsedByPlayer(client);
		if (clientPayPhoneIndex != otherPayPhoneIndex) {
			getPayPhoneData(otherPayPhoneIndex).state = V_PAYPHONE_STATE_IDLE;
			getPayPhoneData(otherPayPhoneIndex).usingPlayer = null;
			getPayPhoneData(otherPayPhoneIndex).otherPayPhone = -1;

			sendPayPhoneStateToPlayer(null, otherPayPhoneIndex, V_PAYPHONE_STATE_IDLE);
			makePlayerPlayAnimation(client, getAnimationFromParams("phonehangup"));

			let nearbyPlayers = getPlayersInRange(getPlayerPosition(client), 3);
			for (let i in nearbyPlayers) {
				sendPayPhoneHangupToPlayer(nearbyPlayers[i]);
			}

			setPlayerControlState(client, true);
		}
	} else if (clientPayPhone.state == V_PAYPHONE_STATE_ACTIVE_CALL) {
		let otherClient = getPlayerData(client).payPhoneOtherPlayer;
		let otherClientPayPhoneIndex = getPlayerData(otherClient).usingPayPhone;
		let otherClientPayPhone = getPayPhoneData(otherClientPayPhoneIndex);

		if (getPlayerData(client).payPhoneInitiatedCall == true) {
			messagePlayerNormal(client, getLocaleString(client, "PayPhoneRecipientHangup", getPayPhoneCallPrice(clientPayPhoneIndex, getCurrentUnixTimestamp() - getPlayerData(client).payPhoneCallStart)));
			takePlayerCash(client, getPayPhoneCallPrice(getCurrentUnixTimestamp() - getPlayerData(client).payPhoneCallStart));
			messagePlayerAlert(otherClient, getLocaleString(client, "PayPhoneHangup"));
		} else {
			messagePlayerNormal(otherClient, getLocaleString(client, "PayPhoneRecipientHangup", getPayPhoneCallPrice(otherClientPayPhoneIndex, getCurrentUnixTimestamp() - getPlayerData(client).payPhoneCallStart)));
			takePlayerCash(otherClient, getPayPhoneCallPrice(getCurrentUnixTimestamp() - getPlayerData(client).payPhoneCallStart));
			messagePlayerAlert(client, getLocaleString(client, "PayPhoneHangup"));
		}

		makePlayerPlayAnimation(client, getAnimationFromParams("phonehangup"));
		let nearbyPlayers = getPlayersInRange(getPlayerPosition(client), 3);
		for (let i in nearbyPlayers) {
			sendPayPhoneHangupToPlayer(nearbyPlayers[i]);
		}

		makePlayerPlayAnimation(otherClient, getAnimationFromParams("phonehangup"));
		nearbyPlayers = getPlayersInRange(getPlayerPosition(otherClient), 3);
		for (let i in nearbyPlayers) {
			sendPayPhoneHangupToPlayer(nearbyPlayers[i]);
		}

		setPlayerControlState(client, true);
		setPlayerControlState(otherClient, true);

		clientPayPhone.state = V_PAYPHONE_STATE_IDLE;
		clientPayPhone.otherPayPhone = -1;
		otherClientPayPhone.state = V_PAYPHONE_STATE_IDLE;
		otherClientPayPhone.otherPayPhone = -1;

		sendPayPhoneStateToPlayer(null, clientPayPhone, V_PAYPHONE_STATE_IDLE);
		sendPayPhoneStateToPlayer(null, otherClientPayPhone, V_PAYPHONE_STATE_IDLE);

		getPlayerData(otherClient).payPhoneCallStart = 0;
		getPlayerData(otherClient).payPhoneOtherPlayer = null;
		getPlayerData(otherClient).usingPayPhone = -1;
	}

	getPlayerData(client).payPhoneCallStart = 0;
	getPlayerData(client).payPhoneOtherPlayer = null;
	getPlayerData(client).usingPayPhone = -1;
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
	if (serverConfig.devServer) {
		return false;
	}

	for (let i in serverData.payPhones) {
		savePayPhoneToDatabase(i);
	}
}

// ===========================================================================

function savePayPhoneToDatabase(payPhoneIndex) {
	if (serverConfig.devServer) {
		logToConsole(LOG_VERBOSE, `[V.RP.PayPhone]: Payphone ${payPhoneIndex} can't be saved because server is running as developer only. Aborting save ...`);
		return false;
	}

	if (getPayPhoneData(payPhoneIndex) == null) {
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
			getPayPhoneData(payPhoneIndex).needsSaved = false;
		}

		logToConsole(LOG_VERBOSE, `[V.RP.PayPhone]: Saved payphone ${payPhoneIndex} to database!`);

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}

	return false;
}

// ===========================================================================

function setAllPayPhoneDataIndexes() {
	for (let i in serverData.payPhones) {
		serverData.payPhones[i].index = i;
	}
}

// ===========================================================================

function getPayPhoneCallPrice(payPhoneIndex, durationSeconds) {
	// Charge price for every 10 seconds
	return getPayPhoneData(payPhoneIndex).price * Math.ceil(durationSeconds / 10);
}

// ===========================================================================

function getPayPhoneUsedByPlayer(client) {
	for (let i in serverData.payPhones) {
		if (serverData.payPhones[i].usingPlayer) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function getNearbyPayPhonesCommand(command, params, client) {
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

	let nearbyPayPhones = getPayPhonesInRange(getPlayerPosition(client), distance);

	if (nearbyPayPhones.length == 0) {
		messagePlayerAlert(client, getLocaleString(client, "NoPayPhonesWithinRange", distance));
		return false;
	}

	let payPhonesList = nearbyPayPhones.map(function (x) {
		return `{chatBoxListIndex}${x.index}: {MAINCOLOUR}${x.number} {mediumGrey}(${toFloat(getDistance(getPlayerPosition(client), x.position)).toFixed(2)} ${toLowerCase(getLocaleString(client, "Meters"))} ${toLowerCase(getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), x.position))))})`;
	});
	let chunkedList = splitArrayIntoChunks(payPhonesList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPayPhonesInRangeList", `${distance} ${toLowerCase(getLocaleString(client, "Meters"))}`)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function getPayPhonesInRange(position, distance) {
	return serverData.payPhones.filter((payPhone) => getDistance(position, payPhone.position) <= distance);
}

// ===========================================================================

function stopUsingPayPhone(client) {
	if (client == null) {
		return false;
	}

	if (getPlayerData(client) == null) {
		return false;
	}

	if (getPlayerData(client).usingPayPhone == -1) {
		return false;
	}

	getPayPhoneData(getPlayerData(client).usingPayPhone).state = V_PAYPHONE_STATE_IDLE;
	sendPayPhoneStateToPlayer(client, getPlayerData(client).usingPayPhone, V_PAYPHONE_STATE_IDLE);

	getPlayerData(client).payPhoneCallStart = 0
	getPlayerData(client).payPhoneOtherPlayer = null;
	getPlayerData(client).usingPayPhone = -1;
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
function getPayPhoneInfoCommand(command, params, client) {
	let payPhoneIndex = getClosestPayPhone(getPlayerPosition(client));

	if (!areParamsEmpty(params)) {
		payPhoneIndex = getPayPhoneFromParams(params);
	}

	if (getPayPhoneData(payPhoneIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidPayPhone"));
		return false;
	}

	let payPhoneData = getPayPhoneData(payPhoneIndex);

	let tempStats = [
		[`ID`, `${payPhoneData.index}/${payPhoneData.databaseId}`],
		[`Number`, `${payPhoneData.number}`],
		[`State`, `${getPayPhoneStateName(payPhoneData.state)}`],
		[`Added By`, `${loadAccountFromId(payPhoneData.whoAdded).name} on ${new Date(payPhoneData.whenAdded * 1000).toLocaleString()}`],
	];

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPayPhoneInfo", payPhoneData.number)));
	let chunkedList = splitArrayIntoChunks(stats, 6);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function resetAllPayPhonesCommand(command, params, client) {
	resetAllPayPhones();
}

// ===========================================================================

function resetAllPayPhones() {
	for (let i in serverData.payPhones) {
		if (serverData.payPhones[i].usingPlayer != null) {
			getPlayerData(serverData.payPhones[i].usingPlayer).usingPayPhone = -1;
			getPlayerData(serverData.payPhones[i].usingPlayer).payPhoneCallStart = 0;
			getPlayerData(serverData.payPhones[i].usingPlayer).payPhoneInitiatedCall = false;
			getPlayerData(serverData.payPhones[i].usingPlayer).payPhoneOtherPlayer = null;
		}
		serverData.payPhones[i].state = V_PAYPHONE_STATE_IDLE;
	}

	sendPayPhoneStateToPlayer(null, -1, V_PAYPHONE_STATE_IDLE);
}

// ===========================================================================

function fixDesyncedPayPhones() {
	for (let i in serverData.payPhones) {
		switch (serverData.payPhones[i].state) {
			case V_PAYPHONE_STATE_RINGING:
				if (getPayPhoneData(i).otherPayPhone != -1) {
					if (getPayPhoneData(getPayPhoneData(i).otherPayPhone).state != V_PAYPHONE_STATE_CALLING) {
						if (serverData.payPhones[i].usingPlayer != null) {
							getPlayerData(serverData.payPhones[i].usingPlayer).usingPayPhone = -1;
							getPlayerData(serverData.payPhones[i].usingPlayer).payPhoneCallStart = 0;
							getPlayerData(serverData.payPhones[i].usingPlayer).payPhoneInitiatedCall = false;
							getPlayerData(serverData.payPhones[i].usingPlayer).payPhoneOtherPlayer = null;
						}
						getPayPhoneData(i).otherPayPhone = -1;
						setPayPhoneState(i, V_PAYPHONE_STATE_IDLE);
					}
				}
				break;

			default:
				break;
		}
	}
}

// ===========================================================================

function setPayPhoneState(payPhoneIndex, state) {
	getPayPhoneData(payPhoneIndex).state = state;
	sendPayPhoneStateToPlayer(false, payPhoneIndex, state);
}

// ===========================================================================

function canPlayerBeCalledOnPayPhone(client) {
	if (getPlayerData(client).usingPayPhone != -1) {
		return false;
	}

	if (isPlayerRestrained(client)) {
		return false;
	}

	if (isPlayerSurrendered(client)) {
		return false;
	}

	if (isPlayerMuted(client)) {
		return false;
	}

	if (!isPlayerSpawned(client)) {
		return false;
	}

	return true;
}

// ===========================================================================

function getPayPhoneFromParams(params) {
	if (typeof serverData.payPhones[params] != "undefined") {
		return toInteger(params);
	}

	for (let i in serverData.payPhones) {
		if (serverData.payPhones[i].number == toInteger(params)) {
			return i;
		}
	}

	return false;
}