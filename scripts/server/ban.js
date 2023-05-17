// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: bans.js
// DESC: Provides ban functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Ban Types
const V_BANTYPE_NONE = 0;
const V_BANTYPE_ACCOUNT = 1;
const V_BANTYPE_SUBACCOUNT = 2;
const V_BANTYPE_IPADDRESS = 3;
const V_BANTYPE_SUBNET = 4;

// ===========================================================================

class BanData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.type = V_BANTYPE_NONE;
		this.detail = "";
		this.ipAddress = "";
		this.ipAddressStart = "";
		this.ipAddressEnd = "";
		this.name = "";
		this.reason = "";
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["ban_id"]);
			this.type = dbAssoc["ban_type"];
			//this.detail = toInteger(dbAssoc["ban_detail"]);
			this.ipAddressStart = toString(dbAssoc["ban_ip_start"]);
			this.ipAddressEnd = toString(dbAssoc["ban_ip_end"]);
			this.ipAddressEnd = toString(dbAssoc["ban_ip_end"]);
			this.reason = toString(dbAssoc["ban_reason"]);
			this.whoAdded = toInteger(dbAssoc["ban_who_added"]);
			this.whenAdded = toInteger(dbAssoc["ban_when_added"]);
		}
	}
}

// ===========================================================================

function initBanScript() {
	logToConsole(LOG_INFO, "[V.RP.Ban]: Initializing ban script ...");
	addServerBans();
	logToConsole(LOG_INFO, "[V.RP.Ban]: Ban script initialized!");
}

// ===========================================================================

function accountBanCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let reason = splitParams.slice(1).join(" ");

	if (!targetClient) {
		messagePlayerError(client, "That player is not connected!")
		return false;
	}

	// Prevent banning admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, "ManageServer") || doesPlayerHaveStaffPermission(targetClient, "Developer")) {
		messagePlayerError(client, getLocaleString(client, "CantBanClient"));
		return false;
	}

	logToConsole(LOG_WARN, `[V.RP.Ban]: ${getPlayerDisplayForConsole(targetClient)} (${getPlayerData(targetClient).accountData.name}) account was banned by ${getPlayerDisplayForConsole(client)}. Reason: ${reason}`);

	announceAdminAction(`PlayerAccountBanned`, `{ALTCOLOUR}${getPlayerName(targetClient)}{MAINCOLOUR}`);
	banAccount(getPlayerData(targetClient).accountData.databaseId, getPlayerData(client).accountData.databaseId, reason);

	getPlayerData(targetClient).customDisconnectReason = "Banned";
	disconnectPlayer(targetClient);
}

// ===========================================================================

function subAccountBanCommand(command, params, client, fromDiscord) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let reason = splitParams.slice(1).join(" ");

	if (!targetClient) {
		messagePlayerError(client, "That player is not connected!")
		return false;
	}

	// Prevent banning admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, "ManageServer") || doesPlayerHaveStaffPermission(targetClient, "Developer")) {
		messagePlayerError(client, getLocaleString(client, "CantBanClient"));
		return false;
	}

	let currentSubAccount = getPlayerData(targetClient).currentSubAccount;

	logToConsole(LOG_WARN, `[V.RP.Ban]: ${getPlayerDisplayForConsole(targetClient)} (${getPlayerData(targetClient).accountData.name})'s subaccount was banned by ${getPlayerDisplayForConsole(client)}. Reason: ${reason}`);



	getPlayerData(client).subAccounts[currentSubAccount].deleted = true;
	getPlayerData(client).subAccounts[currentSubAccount].whoDeleted = getPlayerData(client).accountData.databaseId;
	getPlayerData(client).subAccounts[currentSubAccount].whenDeleted = getCurrentUnixTimestamp();
	getPlayerData(client).subAccounts[currentSubAccount].needsSaved = true;
	saveSubAccountToDatabase(getPlayerData(client).subAccounts[currentSubAccount]);

	getPlayerData(client).subAccounts.splice(currentSubAccount, 1);
	forcePlayerIntoSwitchCharacterScreen(targetClient);

	announceAdminAction(`PlayerCharacterBanned`, `{ALTCOLOUR}${getPlayerName(targetClient)}{MAINCOLOUR}`);
}

// ===========================================================================

function ipBanCommand(command, params, client, fromDiscord) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let reason = splitParams.slice(1).join(" ");

	if (!targetClient) {
		messagePlayerError(client, "That player is not connected!")
		return false;
	}

	// Prevent banning admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, "ManageServer") || doesPlayerHaveStaffPermission(targetClient, "Developer")) {
		messagePlayerError(client, getLocaleString(client, "CantBanClient"));
		return false;
	}

	announceAdminAction(`PlayerIPBanned`, `{ALTCOLOUR}${getPlayerName(targetClient)}{MAINCOLOUR}`);
	banIPAddress(getPlayerIP(targetClient), getPlayerData(client).accountData.databaseId, reason);

	getPlayerData(targetClient).customDisconnectReason = "Banned";
	disconnectPlayer(targetClient);
}

// ===========================================================================

function subNetBanCommand(command, params, client, fromDiscord) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let octetAmount = Number(getParam(params, " ", 2));
	let reason = splitParams.slice(2).join(" ");

	if (!targetClient) {
		messagePlayerError(client, "That player is not connected!")
		return false;
	}

	// Prevent banning admins with really high permissions
	if (doesPlayerHaveStaffPermission(targetClient, "ManageServer") || doesPlayerHaveStaffPermission(targetClient, "Developer")) {
		messagePlayerError(client, getLocaleString(client, "CantBanClient"));
		return false;
	}

	announceAdminAction(`PlayerSubNetBanned`, `{ALTCOLOUR}${getPlayerName(client)}{MAINCOLOUR}`);
	banSubNet(getPlayerIP(targetClient), getSubNet(getPlayerIP(targetClient), octetAmount), getPlayerData(client).accountData.databaseId, reason);

	getPlayerData(targetClient).customDisconnectReason = "Banned";
	disconnectPlayer(targetClient);
	//serverBanIP(getPlayerIP(targetClient));
}

// ===========================================================================

function banAccount(accountId, adminAccountId = defaultNoAccountId, reason = "No reason provided") {
	let tempBanData = new BanData(null);
	tempBanData.ipAddressStart = "";
	tempBanData.whoAdded = adminAccountId;
	tempBanData.reason = reason;
	tempBanData.detail = accountId;
	tempBanData.banType = V_BANTYPE_ACCOUNT;
	tempBanData.whenAdded = getCurrentUnixTimestamp();

	serverData.bans.push(tempBanData);

	return false;
}

// ===========================================================================

function banSubAccount(subAccountId, adminAccountId = defaultNoAccountId, reason = "No reason provided") {
	let tempBanData = new BanData(null);
	tempBanData.ipAddressStart = "";
	tempBanData.whoAdded = adminAccountId;
	tempBanData.reason = reason;
	tempBanData.detail = subAccountId;
	tempBanData.banType = V_BANTYPE_SUBACCOUNT;
	tempBanData.whenAdded = getCurrentUnixTimestamp();

	serverData.bans.push(tempBanData);

	return false;
}

// ===========================================================================

function banIPAddress(ipAddress, adminAccountId = defaultNoAccountId, reason = "No reason provided") {
	let tempBanData = new BanData(null);
	tempBanData.ipAddress = ipAddress;
	tempBanData.whoAdded = adminAccountId;
	tempBanData.reason = reason;
	tempBanData.banType = V_BANTYPE_IPADDRESS;
	tempBanData.whenAdded = getCurrentUnixTimestamp();

	serverData.bans.push(tempBanData);

	serverBanIP(ipAddress);

	return false;
}

// ===========================================================================

function banSubNet(ipAddressStart, adminAccountId = defaultNoAccountId, reason = "No reason provided") {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeReason = dbConnection.escapetoString(reason);
		let dbQuery = queryDatabase(dbConnection, `INSERT INTO ban_main (ban_type, ban_ip_start, ban_ip_end, ban_who_banned, ban_reason) VALUES (${V_BANTYPE_SUBNET}, INET_ATON(${ipAddressStart}), INET_ATON(${ipAddressEnd}), ${adminAccountId}, '${safeReason}');`);
		freeDatabaseQuery(dbQuery);
		dbConnection.close();
		return true;
	}

	return false;
}

// ===========================================================================

function unbanAccount(accountId, adminAccountId) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `UPDATE ban_main SET ban_who_removed=${adminAccountId}, ban_removed=1 WHERE ban_type=${V_BANTYPE_ACCOUNT} AND ban_detail=${accountId}`);
		freeDatabaseQuery(dbQuery);
		dbConnection.close();
		return true;
	}

	return false;
}

// ===========================================================================

function unbanSubAccount(subAccountId, adminAccountId) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `UPDATE ban_main SET ban_who_removed=${adminAccountId}, ban_removed=1 WHERE ban_type=${V_BANTYPE_SUBACCOUNT} AND ban_detail=${subAccountId}`);
		freeDatabaseQuery(dbQuery);
		dbConnection.close();
		return true;
	}

	return false;
}

// ===========================================================================

function unbanIPAddress(ipAddress, adminAccountId) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `UPDATE ban_main SET ban_who_removed=${adminAccountId}, ban_removed=1 WHERE ban_type=${V_BANTYPE_IPADDRESS} AND ban_detail=INET_ATON(${ipAddress})`);
		freeDatabaseQuery(dbQuery);
		dbConnection.close();
		return true;
	}

	return false;
}

// ===========================================================================

function unbanSubNet(ipAddressStart, ipAddressEnd, adminAccountId) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `UPDATE ban_main SET ban_who_removed=${adminAccountId}, ban_removed=1 WHERE ban_type=${V_BANTYPE_SUBNET} AND ban_ip_start=INET_ATON(${ipAddressStart}) AND ban_ip_end=INET_ATON(${ipAddressEnd})`);
		freeDatabaseQuery(dbQuery);
		dbConnection.close();
		return true;
	}

	return false;
}

// ===========================================================================

function isAccountBanned(accountId) {
	let bans = serverData.bans.filter(ban => ban.type === V_BANTYPE_ACCOUNT && ban.detail === accountId);
	if (bans.length > 0) {
		return true;
	}

	return false;
}

// ===========================================================================

function isSubAccountBanned(subAccountId) {
	let bans = serverData.bans.filter(ban => ban.type === V_BANTYPE_SUBACCOUNT && ban.detail === subAccountId);
	if (bans.length > 0) {
		return true;
	}

	return false;
}

// ===========================================================================

function isIpAddressBanned(ipAddress) {
	let bans = serverData.bans.filter(ban => ban.type === V_BANTYPE_IPADDRESS && ban.detail === ipAddress);
	if (bans.length > 0) {
		return true;
	}

	return false;
}

// ===========================================================================

function loadBansFromDatabase() {
	logToConsole(LOG_DEBUG, `[V.RP.Ban]: Loading bans from database ...`);
	let dbConnection = connectToDatabase();
	let tempBans = [];
	let dbAssoc = [];
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM ban_main WHERE ban_server = ${getServerId()} AND ban_deleted = 0`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempBanData = new BanData(dbAssoc[i]);
				tempBans.push(tempBanData);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[V.RP.Ban]: ${tempBans.length} call boxes loaded from database successfully!`);
	return tempBans;
}

// ===========================================================================

function saveBanToDatabase(banIndex) {
	if (serverConfig.devServer) {
		logToConsole(LOG_DEBUG, `[V.RP.Ban]: Ban ${banIndex} can't be saved because server is running as developer only. Aborting save ...`);
		return false;
	}

	if (getBanData(banIndex) == false) {
		logToConsole(LOG_DEBUG, `[V.RP.Ban]: Ban ${banIndex} data is invalid. Aborting save ...`);
		return false;
	}

	let tempBanData = getBanData(banIndex);

	if (tempBanData.databaseId == -1) {
		logToConsole(LOG_DEBUG, `[V.RP.Ban]: Ban ${banIndex} is flagged as not to be saved. Aborting save ...`);
		return false;
	}

	if (!tempBanData.needsSaved) {
		logToConsole(LOG_DEBUG, `[V.RP.Ban]: Ban ${banIndex} hasn't changed data. Aborting save ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Ban]: Saving ban ${tempBanData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeUID = escapeDatabaseString(dbConnection, tempBanData.uid);
		let safeDetail = escapeDatabaseString(dbConnection, tempBanData.detail);
		let data = [
			["ban_server", getServerId()],
			["ban_deleted", boolToInt(tempBanData.deleted)],
			["ban_who_deleted", toInteger(tempBanData.whoDeleted)],
			["ban_when_deleted", toInteger(tempBanData.whenDeleted)],
			["ban_who_added", toInteger(tempBanData.whoAdded)],
			["ban_when_added", toInteger(tempBanData.whenAdded)],
			["ban_ip_start", toString(tempBanData.ipAddressStart)],
			["ban_ip_end", toString(tempBanData.ipAddressEnd)],
			["ban_uid", safeUID],
			["ban_detail", safeDetail],
		];

		let dbQuery = null;
		if (tempBanData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("ban_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempBanData.databaseId = getDatabaseInsertId(dbConnection);
			tempBanData.needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("ban_main", data, `ban_id=${tempBanData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
			tempBanData.needsSaved = false;
		}

		logToConsole(LOG_DEBUG, `[V.RP.Ban]: Saved ban ${banIndex} to database!`);

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}

	return false;
}

// ===========================================================================

/**
 * @param {number} banIndex - The data index of the ban
 * @return {BanData} The ban's data (class instance)
 */
function getBanData(banIndex) {
	if (banIndex == -1) {
		return null;
	}

	if (typeof serverData.bans[banIndex] != "undefined") {
		return serverData.bans[banIndex];
	}

	return null;
}

// ===========================================================================

function applyIpAddressBans() {
	for (let i in serverData.bans) {
		if (serverData.bans[i].type == V_BANTYPE_IPADDRESS) {
			serverBanIP(serverData.bans[i].ipAddressStart);
		}
	}
}

// ===========================================================================

function saveAllBansToDatabase() {
	for (let i in serverData.bans) {
		saveBanToDatabase(i);
	}
}

// ===========================================================================
