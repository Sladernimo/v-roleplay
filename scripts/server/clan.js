// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: clan.js
// DESC: Provides clan functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

/**
 * @class Representing a clan's data. Loaded and saved in the database
 * @property {Array.<ClanRankData>} ranks
 * @property {Array.<ClanMemberData>} members
 */
class ClanData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.name = "";
		this.ownerId = 0;
		this.tag = "";
		this.enabled = false;
		this.index = -1;
		this.colour = COLOUR_WHITE;
		this.colours = [];
		this.needsSaved = false;
		this.motd = "";
		this.discordWebhookURL = ""; // For clan webhooks if they have their own discord server
		this.discordWebhookFlags = 0; // What to send to the clan discord's webhooks
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.bank = 0;

		/** @type {Array.<ClanRankData>} */
		this.ranks = [];

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["clan_id"]);
			this.name = dbAssoc["clan_name"];
			this.ownerId = toInteger(dbAssoc["clan_owner"]);
			this.tag = dbAssoc["clan_tag"];
			this.enabled = intToBool(toInteger(dbAssoc["clan_enabled"]));
			this.colour = toColour(toInteger(dbAssoc["clan_col_r"]), toInteger(dbAssoc["clan_col_g"]), toInteger(dbAssoc["clan_col_b"]));
			this.colours = [toInteger(dbAssoc["clan_col_r"]), toInteger(dbAssoc["clan_col_g"]), toInteger(dbAssoc["clan_col_b"])];
			this.motd = toString(dbAssoc["clan_motd"]);
			this.discordWebhookURL = toString(dbAssoc["clan_discord_webhook_url"]);
			this.discordWebhookFlags = toInteger(dbAssoc["clan_discord_webhook_flags"]);
			this.whoAdded = toInteger(dbAssoc["clan_who_added"]);
			this.whenAdded = toInteger(dbAssoc["clan_when_added"]);
			this.bank = toInteger(dbAssoc["clan_bank"]);
		}
	}
};

// ===========================================================================

/**
 * @class Representing a clan rank's data. Loaded and saved in the database
 */
class ClanRankData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.clan = 0;
		this.name = "";
		this.level = 0;
		this.flags = 0;
		this.customTag = "";
		this.enabled = true;
		this.index = -1;
		this.clanIndex = -1;
		this.needsSaved = false;
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.pay = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["clan_rank_id"]);
			this.clan = toInteger(dbAssoc["clan_rank_clan"]);
			this.name = dbAssoc["clan_rank_name"];
			this.level = toInteger(dbAssoc["clan_rank_level"]);
			this.flags = toInteger(dbAssoc["clan_rank_flags"]);
			this.tag = dbAssoc["clan_rank_tag"];
			this.enabled = intToBool(toInteger(dbAssoc["clan_rank_enabled"]));
			this.whoAdded = toInteger(dbAssoc["clan_rank_who_added"]);
			this.whenAdded = toInteger(dbAssoc["clan_rank_when_added"]);
			this.pay = toInteger(dbAssoc["clan_rank_pay"]);
		}
	}
};

// ===========================================================================

function initClanScript() {
	logToConsole(LOG_INFO, "[V.RP.Clan]: Initializing clans script ...");
	logToConsole(LOG_INFO, "[V.RP.Clan]: Clan script initialized successfully!");
	return true;
}

// ===========================================================================

function loadClansFromDatabase() {
	logToConsole(LOG_INFO, "[V.RP.Clan]: Loading clans from database ...");

	let tempClans = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM clan_main WHERE clan_deleted = 0 AND clan_server = ${getServerId()}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempClanData = new ClanData(dbAssoc[i]);
				tempClanData.ranks = loadClanRanksFromDatabase(tempClanData.databaseId);
				tempClans.push(tempClanData);
				logToConsole(LOG_DEBUG, `[V.RP.Clan]: Clan '${tempClanData.name}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[V.RP.Clan]: ${tempClans.length} clans loaded from database successfully!`);
	return tempClans;
}

// ===========================================================================

function loadClanRanksFromDatabase(clanDatabaseId) {
	logToConsole(LOG_INFO, `[V.RP.Clan]: Loading ranks for clan ${clanDatabaseId} from database ...`);

	let dbConnection = connectToDatabase();
	let dbAssoc = [];
	let tempClanRanks = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM clan_rank WHERE clan_rank_clan = ${clanDatabaseId}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempClanRankData = new ClanRankData(dbAssoc[i]);
				tempClanRanks.push(tempClanRankData);
				logToConsole(LOG_VERBOSE, `[V.RP.Clan]: Clan rank '${tempClanRankData.name}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[V.RP.Clan]: Loaded ranks for clan ${clanDatabaseId} from database successfully!`);
	return tempClanRanks;
}

// ===========================================================================

function createClanRank(clanId, level, rankName, whoAdded = defaultNoAccountId) {
	let tempClanRankData = new ClanRankData(false);
	tempClanRankData.level = level;
	tempClanRankData.name = rankName;
	tempClanRankData.clan = getClanData(clanId).databaseId;
	tempClanRankData.clanIndex = clanId;
	tempClanRankData.needsSaved = true;

	let rankIndex = getClanData(clanId).ranks.push(tempClanRankData);
	setAllClanDataIndexes();

	saveClanRanksToDatabase(clanId);
	return rankIndex;
}

// ===========================================================================

function deleteClanRank(clanId, rankId, whoDeleted = defaultNoAccountId) {
	let tempClanRankData = getClanRankData(clanId, rankId);
	if (!tempClanRankData) {
		return false;
	}

	quickDatabaseQuery(`UPDATE clan_rank SET clan_rank_deleted = 1, clan_rank_when_deleted = UNIX_TIMESTAMP(), clan_rank_who_deleted = ${whoDeleted} WHERE clan_id = ${tempClanRankData.database}`);
	getClanData(clanId).ranks.splice(tempClanRankData.index, 1);
}

// ===========================================================================

function listClansCommand(command, params, client) {
	let clans = serverData.clans;

	if (!areParamsEmpty(params)) {
		clans = clans.filter(clan => toLowerCase(clan.name).indexOf(toLowerCase(params)) != -1);
		return false;
	}

	let nameList = clans.map((clan) => { return clan.name; });

	let chunkedList = splitArrayIntoChunks(nameList, 5);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderClansList")));

	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function listClanRanksCommand(command, params, client) {
	let clanId = getPlayerClan(client);

	if (!areParamsEmpty(params)) {
		if (doesPlayerHaveStaffPermission(client, "ManageClans")) {
			clanId = getClanFromParams(params);
		}
	}

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let rankNameList = getClanData(clanId).ranks.map((clanRank) => { return `[${clanRank.level}] ${clanRank.name}`; });

	let chunkedList = splitArrayIntoChunks(rankNameList, 5);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderClanRanksList")));

	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function createClanCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (doesClanNameExist(params)) {
		messagePlayerError(client, "A clan with that name already exists!");
		return false;
	}

	// Create clan without owner. Can set owner with /clanowner afterward
	createClan(params, getPlayerData(client).accountData.databaseId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created clan {clanOrange}${params}`);
}

// ===========================================================================

function deleteClanCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getClanFromParams(params);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted clan {clanOrange}${getClanData(clanId).name}`);
	deleteClan(clanId, getPlayerData(client).accountData.databaseId);
}

// ===========================================================================

function setClanOwnerCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("Owner"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let clanIndex = getClanFromParams(getParam(params, " ", 2));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getClanData(clanIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (doesPlayerHaveStaffPermission(client, "ManageClans")) {
		let highestRankIndex = getHighestClanRank(clanIndex);
		getClanData(clanIndex).ownerId = getPlayerCurrentSubAccount(targetClient).databaseId;
		getPlayerCurrentSubAccount(targetClient).clan = getClanData(clanIndex).databaseId;
		getPlayerCurrentSubAccount(targetClient).clanIndex = clanIndex;
		getPlayerCurrentSubAccount(targetClient).clanRank = getClanRankData(clanIndex, highestRankIndex).databaseId;
		getPlayerCurrentSubAccount(targetClient).clanRankIndex = highestRankIndex;
		getClanData(clanIndex).needsSaved = true;
		messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} changed clan {clanOrange}${getClanData(clanIndex).name}'s{MAINCOLOUR} owner to {ALTCOLOUR}${getCharacterFullName(targetClient)}`);
	} else {
		showPlayerPrompt(targetClient, getLocaleString(targetClient, "ClanOwnershipTransferRequest", `{ALTCOLOUR}${getCharacterFullName(client)}{MAINCOLOUR}`, `{clanOrange}${getClanData(clanIndex).name}{MAINCOLOUR}`), getLocaleString(targetClient, "GUIAlertTitle"), getLocaleString(targetClient, "Yes"), getLocaleString(targetClient, "No"));
		messagePlayerAlert(client, getLocaleString(client, "ClanOwnershipTransferSent", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));
	}
}

// ===========================================================================

function setClanTagCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ClanTag"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	getClanData(clanId).tag = params;
	getClanData(clanId).needsSaved = true;

	//messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}set clan {clanOrange}${getClanData(clanId).index} {MAINCOLOUR}tag to {ALTCOLOUR}${params}`);
	messagePlayerSuccess(client, `You changed the clan tag to {ALTCOLOUR}${params}`);
}

// ===========================================================================

function setClanNameCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ClanName"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	getClanData(clanId).name = params;
	getClanData(clanId).needsSaved = true;

	//messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}set clan {clanOrange}${getClanData(clanId).index} {MAINCOLOUR}name to {ALTCOLOUR}${params}`);
	messagePlayerSuccess(client, `You changed the clan name to {ALTCOLOUR}${params}`);
}

// ===========================================================================

function setClanMOTDCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ClanMOTD"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	getClanData(clanId).motd = params;
	getClanData(clanId).needsSaved = true;

	//messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}set clan {clanOrange}${getClanData(clanId).index} {MAINCOLOUR}name to {ALTCOLOUR}${params}`);
	messagePlayerSuccess(client, `You changed the clan message of the day to {ALTCOLOUR}${params}`);
}

// ===========================================================================

function setClanDiscordWebhookCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ClanDiscordWebhook"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	getClanData(clanId).discordWebhook = params;
	getClanData(clanId).needsSaved = true;

	//messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}set clan {clanOrange}${getClanData(clanId).index} {MAINCOLOUR}name to {ALTCOLOUR}${params}`);
	messagePlayerSuccess(client, `You changed the clan discord webhook!`);
}

// ===========================================================================

function createClanRankCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!areThereEnoughParams(params, 2, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let splitParams = params.split(" ");
	let level = toInteger(getParam(params, " ", 1)) || 1;
	let rankName = splitParams.slice(-1).join(" ");

	let rankIndex = createClanRank(clanId, level, rankName);

	messagePlayerSuccess(client, `You added the {ALTCOLOUR}${rankName} {MAINCOLOUR}rank (Level {ALTCOLOUR}${level}`);
	messagePlayerSuccess(client, `Use {ALTCOLOUR}/clanaddrankflag ${rankName} <clan flag name> {MAINCOLOUR} to add permission flags to this rank.`);
}

// ===========================================================================

function deleteClanRankCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let rankId = getClanRankFromParams(clanId, params);
	let tempRankName = getClanRankData(clanId, rankId);

	if (!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	deleteClanRank(clanId, rankId, getPlayerData(client).accountData.databaseId);
	getClanData(clanId).needsSaved = true;

	messagePlayerSuccess(client, `You removed the {ALTCOLOUR}${tempRankName}{MAINCOLOUR} rank`);
}

// ===========================================================================

function setClanMemberTagCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("manageMembers"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!arePlayersInSameClan(client, targetClient)) {
		if (!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, "That player is not in your clan!");
			return false;
		}
	}

	if (!doesPlayerHaveStaffPermission("ManageClans") && !doesPlayerHaveClanPermission("memberFlags")) {
		messagePlayerError(client, getLocaleString(client, "CantChangeRank"));
		return false;
	}

	if (getClanRankData(clanId, rankId).level > getClanRankData(clanId, getPlayerClanRank(client)).level) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
			messagePlayerError(client, getLocaleString(client, "CantChangeRank"));
			return false;
		}
	}

	getPlayerCurrentSubAccount(targetClient).clanTag = getParam(params, " ", 2);

	messagePlayerSuccess(client, `You set {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}clan tag to {ALTCOLOUR}${getParam(params, " ", 2)}`);
	messagePlayerAlert(client, `{ALTCOLOUR}${getCharacterFullName(targetClient)} {MAINCOLOUR}set your clan tag to {ALTCOLOUR}${getParam(params, " ", 2)}`);
}

// ===========================================================================

function setClanRankTagCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let rankId = getClanRankFromParams(clanId, splitParams.slice(0, -1));
	let newTag = splitParams.slice(-1);

	if (!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	if (getClanRankData(clanId, rankId).level > getClanRankData(clanId, getPlayerClanRank(client)).level) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
			messagePlayerError(client, getLocaleString(client, "CantChangeRank"));
			return false;
		}
	}

	getClanRankData(clanId, rankId).customTag = newTag;
	getClanRankData(clanId, rankId).needsSaved = true;
}

// ===========================================================================

function setClanRankLevelCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let splitParams = params.split(" ");
	let rankId = getClanRankFromParams(clanId, splitParams.slice(0, -1));
	let newLevel = splitParams.slice(-1);

	if (!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	if (getClanRankData(clanId, rankId).level > getClanRankData(clanId, getPlayerClanRank(client)).level) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
			messagePlayerError(client, getLocaleString(client, "CantChangeRank"));
			return false;
		}
	}

	if (isNaN(newLevel)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
		return false;
	}

	if (toInteger(newLevel) < 0) {
		messagePlayerError(client, getLocaleString(client, "CantUseNegativeNumber"));
		return false;
	}

	getClanRankData(clanId, rankId).level = toInteger(newLevel);
	getClanRankData(clanId, rankId).needsSaved = true;

	messagePlayerSuccess(client, `You set {ALTCOLOUR}${getClanRankData(clanId, rankId).name}'s{MAINCOLOUR} level to {ALTCOLOUR}${newLevel}`);
}

// ===========================================================================

function setClanRankPayCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks")) || !doesPlayerHaveClanPermission(client, getClanFlagValue("ManageBank"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let splitParams = params.split(" ");
	let rankId = getClanRankFromParams(clanId, splitParams.slice(0, -1));
	let newPay = splitParams.slice(-1);

	if (!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	if (getClanRankData(clanId, rankId).level > getClanRankData(clanId, getPlayerClanRank(client)).level) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
			messagePlayerError(client, getLocaleString(client, "CantChangeRank"));
			return false;
		}
	}

	if (isNaN(newPay)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
		return false;
	}

	if (toInteger(newPay) < 0) {
		messagePlayerError(client, getLocaleString(client, "CantUseNegativeNumber"));
		return false;
	}

	getClanRankData(clanId, rankId).pay = toInteger(newPay);
	getClanRankData(clanId, rankId).needsSaved = true;

	messagePlayerSuccess(client, `You set {ALTCOLOUR}${getClanRankData(clanId, rankId).name}'s{MAINCOLOUR} pay to {ALTCOLOUR}${getCurrencyString(newLevel)}`);
}

// ===========================================================================

function addClanMemberFlagCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("manageMembers"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!arePlayersInSameClan(client, targetClient)) {
		if (!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, getLocaleString(client, "ClanPlayerNotInSameClan"));
			return false;
		}
	}

	if (!doesPlayerHaveStaffPermission("ManageClans") && !doesPlayerHaveClanPermission("memberFlags")) {
		messagePlayerError(client, "You cannot set clan member flags!");
		return false;
	}

	if (getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if (!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, "You cannot set that clan member's flags!");
			return false;
		}
	}

	let flagName = getParam(params, " ", 2);
	let flagValue = getClanFlagValue(flagName);

	if (!flagValue) {
		messagePlayerError(client, "Clan flag not found!");
		return false;
	}

	getPlayerCurrentSubAccount(client).clanFlags = getPlayerCurrentSubAccount(client).clanFlags | flagValue;
	messagePlayerSuccess(client, `You added the {ALTCOLOUR}${getParam(params, " ", 2)} {MAINCOLOUR}clan flag to {ALTCOLOUR}${getCharacterFullName(client)}`);
}

// ===========================================================================

function removeClanMemberFlagCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("manageMembers"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!arePlayersInSameClan(client, targetClient)) {
		if (!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, getLocaleString(client, "ClanPlayerNotInSameClan"));
			return false;
		}
	}

	if (!doesPlayerHaveStaffPermission("ManageClans") && !doesPlayerHaveClanPermission("memberFlags")) {
		messagePlayerError(client, "You cannot set clan member flags!");
		return false;
	}

	if (getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if (!doesPlayerHaveStaffPermission("ManageClans")) {
			messagePlayerError(client, "You cannot set that clan member's flags!");
			return false;
		}
	}

	let flagName = getParam(params, " ", 2);
	let flagValue = getClanFlagValue(flagName);

	if (!flagValue) {
		messagePlayerError(client, "Clan flag not found!");
		return false;
	}

	getPlayerCurrentSubAccount(client).clanFlags = getPlayerCurrentSubAccount(client).clanFlags & ~flagValue;
	messagePlayerSuccess(client, `You removed the {ALTCOLOUR}${getParam(params, " ", 2)} {MAINCOLOUR}clan flag from {ALTCOLOUR}${getCharacterFullName(client)}`);
}

// ===========================================================================

function addClanRankFlagCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let splitParams = params.split(" ");
	let rankId = getClanRankFromParams(clanId, splitParams.slice(0, -1));
	let flagName = splitParams.slice(-1);

	if (!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	let flagValue = getClanFlagValue(flagName);

	if (!flagValue) {
		messagePlayerError(client, "Clan flag not found!");
		return false;
	}

	getClanRankData(clanId, rankId).flags = addBitFlag(getClanRankData(clanId, rankId).flags, flagValue);
	getClanRankData(clanId, rankId).needsSaved = true;
	messagePlayerSuccess(client, `You added the {ALTCOLOUR}${getParam(params, " ", 2)} {MAINCOLOUR}clan flag to rank {ALTCOLOUR}${getClanRankData(clanId, rankId).name}`);
}

// ===========================================================================

function removeClanRankFlagCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let splitParams = params.split(" ");
	let rankId = getClanRankFromParams(clanId, splitParams.slice(0, -1));
	let flagName = splitParams.slice(-1);

	if (!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	let flagValue = getClanFlagValue(flagName);

	if (!flagValue) {
		messagePlayerError(client, "Clan flag not found!");
		return false;
	}

	getClanRankData(clanId, rankId).flags = removeBitFlag(getClanRankData(clanId, rankId).flags, flagValue);
	getClanRankData(clanId, rankId).needsSaved = true;
	messagePlayerSuccess(client, `You removed the {ALTCOLOUR}${getParam(params, " ", 2)} {MAINCOLOUR}clan flag from rank {ALTCOLOUR}${getClanRankData(clanId, rankId).name}`);
}

// ===========================================================================

function showClanRankFlagsCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let rankId = getClanRankFromParams(clanId, params);

	if (!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	let currentFlags = getClanRankData(clanId, rankId).flags;
	let clanFlagKeys = getServerBitFlagKeys().clanFlagKeys.filter((flagKey) => flagKey != "None");
	let flagList = [];
	for (let i in clanFlagKeys) {
		if (hasBitFlag(currentFlags, getClanFlagValue(clanFlagKeys[i]))) {
			flagList.push(`{softGreen}${clanFlagKeys[i]}`);
		} else {
			flagList.push(`{softRed}${clanFlagKeys[i]}`);
		}
	}

	let chunkedList = splitArrayIntoChunks(flagList, 6);

	makeChatBoxSectionHeader(client, getLocaleString(client, "HeaderClanFlagsList", getClanRankData(clanId, rankId).name));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join("{MAINCOLOUR}, "));
	}
}

// ===========================================================================

function showClanMembersCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("RemoveMember"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanIndex = getPlayerClan(client);

	if (getClanData(clanIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let rankId = getClanRankFromParams(clanIndex, params);

	if (!getClanRankData(clanIndex, rankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	let clanMembers = loadClanMembersFromDatabase(getClanData(clanIndex).databaseId);

	let memberList = clanMembers.map((member) => {
		if (isSubAccountOnline(subAccountId)) {
			return `{MAINCOLOUR}[${getClanRankData(clanId, getClanRankIndexFromDatabaseId(clanIndex, member.clanRank)).name}] ${member.firstName} ${member.lastName}{MAINCOLOUR}`;
		} else {
			return `{ALTCOLOUR}[${getClanRankData(clanId, getClanRankIndexFromDatabaseId(clanIndex, member.clanRank)).name}] ${member.firstName} ${member.lastName}{MAINCOLOUR}`;
		}
	});

	let chunkedList = splitArrayIntoChunks(memberList, 5);

	makeChatBoxSectionHeader(client, getLocaleString(client, "HeaderClanMembersList", getClanData(clanIndex).name));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function setClanMemberTitleCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageMembers"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!arePlayersInSameClan(client, targetClient)) {
		if (!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, getLocaleString(client, "ClanPlayerNotInSameClan"));
			return false;
		}
	}

	if (getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if (!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, "You cannot set that clan member's custom title!");
			return false;
		}
	}

	let oldMemberTitle = getPlayerCurrentSubAccount(client).clanTitle;
	getPlayerCurrentSubAccount(client).clanTitle = getParam(params, " ", 2);
	messagePlayerSuccess(client, `You changed the name of {ALTCOLOUR}${getCharacterFullName(client)} {MAINCOLOUR}from {ALTCOLOUR}${oldMemberTitle} {MAINCOLOUR}to {ALTCOLOUR}${params}`);
}

// ===========================================================================

function setClanRankTitleCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("ManageRanks"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanIndex = getPlayerClan(client);

	if (getClanData(clanIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let splitParams = params.split(" ");
	let rankIndex = getClanRankFromParams(clanIndex, getParam(params, " ", 1));
	let rankName = splitParams.slice(1).join(" ");

	if (!getClanRankData(clanIndex, rankIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	let oldRankName = getClanRankData(clanIndex, rankIndex).name;
	getClanRankData(clanIndex, rankIndex).name = rankName
	getClanRankData(clanIndex, rankIndex).needsSaved = true;
	messagePlayerSuccess(client, `You changed the name of rank {ALTCOLOUR}${rankIndex}{MAINCOLOUR} from {ALTCOLOUR}${oldRankName}{MAINCOLOUR} to {ALTCOLOUR}${rankName}`);
}

// ===========================================================================

function setClanMemberRankCommand(command, params, client) {
	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("MemberRank"))) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let clanId = getPlayerClan(client);

	if (getClanData(clanId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let rankId = getClanRankFromParams(clanId, splitParams.slice(-1).join(" "));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!getClanRankData(clanId, rankId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidClanRank"));
		return false;
	}

	if (!arePlayersInSameClan(client, targetClient)) {
		if (!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, getLocaleString(client, "ClanPlayerNotInSameClan"));
			return false;
		}
	}

	if (getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if (!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, "You cannot set that clan member's rank!");
			return false;
		}
	}

	if (getPlayerClanRank(client) <= getPlayerClanRank(targetClient)) {
		if (!doesPlayerHaveStaffPermission(client, "ManageClans")) {
			messagePlayerError(client, "You can't set a member's rank that high!");
			return false;
		}
	}

	let oldClanRank = getClanRankData(clanId, getPlayerClanRank(targetClient));
	getPlayerCurrentSubAccount(targetClient).clanRank = getClanRankData(clanId, rankId).databaseId;
	getPlayerCurrentSubAccount(targetClient).clanRankIndex = rankId;
	messagePlayerSuccess(client, `You changed {ALTCOLOUR}${getCharacterFullName(targetClient)}'s{MAINCOLOUR} rank from {ALTCOLOUR}${oldClanRank.name}{MAINCOLOUR} to {ALTCOLOUR}${getClanRankData(clanId, rankId).name}`);
}

// ===========================================================================

function createClan(name, whoAdded = defaultNoAccountId) {
	let dbConnection = connectToDatabase();

	if (dbConnection) {
		//escapedName = escapeDatabaseString(dbConnection, escapedName)
		//queryDatabase(dbConnection, `INSERT INTO clan_main (clan_server, clan_name) VALUES (${getServerId()}, '${escapedName}')`);

		let tempClan = new ClanData(false);
		tempClan.databaseId = 0;
		tempClan.serverId = getServerId();
		tempClan.name = name;
		tempClan.needsSaved = true;
		tempClan.whoAdded = whoAdded;
		tempClan.whenAdded = getCurrentUnixTimestamp();
		tempClan.ownerId = 0;
		tempClan.enabled = true;

		let tempClanRankData = new ClanRankData(false);
		tempClanRankData.databaseId = 0;
		tempClanRankData.level = 1;
		tempClanRankData.name = "Default Rank";
		tempClanRankData.clan = 0;
		tempClanRankData.clanIndex = -1;
		tempClanRankData.needsSaved = true;
		tempClanRankData.whoAdded = whoAdded;
		tempClanRankData.whenAdded = getCurrentUnixTimestamp();
		tempClanRankData.enabled = true;
		tempClan.ranks.push(tempClanRankData);

		serverData.clans.push(tempClan);

		setAllClanDataIndexes();
		saveAllClansToDatabase();
	}
	return true;
}

// ===========================================================================

function deleteClan(clanId, whoDeleted = 0) {
	//saveAllClansToDatabase();

	if (getClanData(clanId) == null) {
		return false;
	}

	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `UPDATE clan_main SET clan_deleted = 1, clan_when_deleted = UNIX_TIMESTAMP, clan_who_deleted = ${whoDeleted} WHERE clan_id = ${clanId}`);
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);

		reloadAllClans();
		return true;
	}

	return false;
}

// ===========================================================================

/**
 * @param {number} clanId - The data index of the clan
 * @return {ClanData} The clan's data (class instance)
 */
function getClanData(clanId) {
	if (clanId == -1) {
		return null;
	}

	if (typeof serverData.clans[clanId] != "undefined") {
		return serverData.clans[clanId];
	}

	return null;
}

// ===========================================================================

function doesClanNameExist(name) {
	let clans = serverData.clans;
	for (let i in clans) {
		if (clans[i].name == name) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function doesClanIdExist(clanId) {
	let clans = serverData.clans;
	for (let i in clans) {
		if (clans[i].databaseId == clanId) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function reloadAllClans() {
	if (serverConfig.devServer) {
		return false;
	}

	serverData.clans = loadClansFromDatabase();
}

// ===========================================================================

function saveClanRanksToDatabase(clanId) {
	if (serverConfig.devServer) {
		return false;
	}

	let ranks = serverData.clans[clanId].ranks;
	for (let i in ranks) {
		saveClanRankToDatabase(clanId, i);
	}
}

// ===========================================================================

/**
 * @param {ClanData} clanData - The data of the clan to save
 */
function saveClanToDatabase(clanData) {
	if (serverConfig.devServer) {
		return false;
	}

	if (!clanData) {
		return false;
	}

	if (clanData.databaseId == -1) {
		// Temp clan, don't save
		return false;
	}

	if (!clanData.needsSaved) {
		return false;
	}

	let dbConnection = connectToDatabase();
	if (dbConnection) {
		if (clanData.needsSaved) {
			let safeName = escapeDatabaseString(dbConnection, clanData.name);
			let safeTag = escapeDatabaseString(dbConnection, clanData.tag);
			let safeMOTD = escapeDatabaseString(dbConnection, clanData.motd);
			let safeDiscordWebhookURL = escapeDatabaseString(dbConnection, clanData.discordWebhookURL);

			let data = [
				["clan_name", safeName],
				["clan_server", clanData.serverId],
				["clan_owner", clanData.ownerId],
				["clan_tag", safeTag],
				["clan_motd", safeMOTD],
				["clan_discord_webhook_url", safeDiscordWebhookURL],
				["clan_discord_webhook_flags", clanData.discordWebhookFlags],
				["clan_enabled", boolToInt(clanData.enabled)],
				["clan_who_added", toInteger(clanData.whoAdded)],
				["clan_when_added", toInteger(clanData.whenAdded)],
				["clan_bank", toInteger(clanData.bank)],
			];

			let dbQuery = null;
			if (clanData.databaseId == 0) {
				let queryString = createDatabaseInsertQuery("clan_main", data);
				dbQuery = queryDatabase(dbConnection, queryString);
				getClanData(clanId).databaseId = getDatabaseInsertId(dbConnection);
				getClanData(clanId).needsSaved = false;
			} else {
				let queryString = createDatabaseUpdateQuery("clan_main", data, `clan_id=${clanData.databaseId} LIMIT 1`);
				dbQuery = queryDatabase(dbConnection, queryString);
				getClanData(clanId).needsSaved = false;
			}

			freeDatabaseQuery(dbQuery);
			disconnectFromDatabase(dbConnection);
		}

		saveClanRanksToDatabase(clanData.index);
		return true;
	}

	return false;
}

// ===========================================================================

/**
 * @param {ClanRankData} clanRankData - The data of the clan rank to save
 */
function saveClanRankToDatabase(clanRankData) {
	if (!clanRankData.needsSaved) {
		return false;
	}

	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, clanRankData.name);
		let safeTag = escapeDatabaseString(dbConnection, clanRankData.customTag);
		//let safeTitle = escapeDatabaseString(dbConnection, clanRankData.name);

		let data = [
			["clan_rank_name", safeName],
			["clan_rank_clan", clanRankData.clan],
			["clan_rank_custom_tag", safeTag],
			//["clan_rank_title", safeTitle],
			["clan_rank_flags", clanRankData.flags],
			["clan_rank_level", clanRankData.level],
			["clan_rank_enabled", boolToInt(clanRankData.enabled)],
		];

		let dbQuery = null;
		if (clanRankData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("clan_rank", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			clanRankData.databaseId = getDatabaseInsertId(dbConnection);
			clanRankData.needsSaved = false;
		} else {
			let queryString = createDatabaseUpdateQuery("clan_rank", data, `clan_rank_id=${clanRankData.databaseId} LIMIT 1`);
			dbQuery = queryDatabase(dbConnection, queryString);
			clanRankData.needsSaved = false;
		}

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}

	return false;
}

// ===========================================================================

function setClanTag(clanId, tag) {
	getClanData(clanId).tag = tag;
	getClanData(clanId).needsSaved = true;
}

// ===========================================================================

function setClanOwner(clanId, ownerId) {
	getClanData(clanId).ownerId = ownerId;
	getClanData(clanId).needsSaved = true;
}

// ===========================================================================

function setClanRankTag(clanId, rankId, tag) {
	getClanRankData(clanId, rankId).tag = tag;
	getClanRankData(clanId, rankId).needsSaved = true;
}

// ===========================================================================

function setClanRankFlags(clanId, rankId, flags) {
	getClanRankData(clanId, rankId).flags = flags;
	getClanRankData(clanId, rankId).needsSaved = true;
}

// ===========================================================================

function setClanRankTitle(clanId, rankId, title) {
	getClanRankData(clanId, rankId).title = title;
	getClanRankData(clanId, rankId).needsSaved = true;
}

// ===========================================================================

function saveAllClansToDatabase() {
	logToConsole(LOG_DEBUG, `[V.RP.Clan]: Saving all server clans to database ...`);

	if (serverConfig.devServer) {
		logToConsole(LOG_DEBUG, `[V.RP.Clan]: Aborting save all clans to database, dev server is enabled.`);
		return false;
	}

	for (let i in serverData.clans) {
		saveClanToDatabase(serverData.clans[i]);
	}

	logToConsole(LOG_INFO, `[V.RP.Clan]: Saved all server clans to database`);
}

// ===========================================================================

function setAllClanDataIndexes() {
	for (let i in serverData.clans) {
		serverData.clans[i].index = i;

		for (let j in serverData.clans[i].ranks) {
			serverData.clans[i].ranks[j].index = j;
			serverData.clans[i].ranks[j].clanIndex = i;
		}
	}
}

// ===========================================================================

function arePlayersInSameClan(client1, client2) {
	if (getPlayerClan(client1) == getPlayerClan(client2)) {
		return true;
	}

	return false;
}

// ===========================================================================

function getPlayerClanRank(client) {
	return getPlayerCurrentSubAccount(client).clanRankIndex;
}

// ===========================================================================

function getPlayerClan(client) {
	return getPlayerCurrentSubAccount(client).clanIndex;
}

// ===========================================================================

function getClanIndexFromDatabaseId(databaseId) {
	if (databaseId == 0) {
		return -1;
	}

	for (let i in serverData.clans) {
		if (serverData.clans[i].databaseId == databaseId) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function getClanRankIndexFromDatabaseId(clanIndex, databaseId) {
	if (databaseId == 0) {
		return -1;
	}

	if (clanIndex == -1) {
		return -1;
	}

	for (let i in serverData.clans[clanIndex].ranks) {
		if (serverData.clans[clanIndex].ranks[i].databaseId == databaseId) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

/**
 * @param {number} clanIndex - The data index of the clan
 * @param {number} rankIndex - The data index of the clan rank
 * @return {ClanRankData} The clan rank's data (class instance)
 */
function getClanRankData(clanIndex, rankIndex) {
	if (clanIndex == -1) {
		return null;
	}

	if (rankIndex == -1) {
		return null;
	}

	if (typeof serverData.clans[clanIndex] == "undefined") {
		return null;
	}

	if (typeof serverData.clans[clanIndex].ranks[rankIndex] == "undefined") {
		return null;
	}

	return serverData.clans[clanIndex].ranks[rankIndex];
}

// ===========================================================================

function getPlayerSubAccountClanRank(client) {
	return getPlayerCurrentSubAccount(client).clanRank;
}

// ===========================================================================

function getPlayerClanRankName(client) {
	if (getPlayerClanRank(client) != 0) {
		let clanId = getPlayerClan(client);
		return getClanRankData(clanId, getPlayerClanRank(client)).name;
	} else {
		return false;
	}
}

// ===========================================================================

function showClanFlagListCommand(command, params, client) {
	let flagList = getServerBitFlagKeys().clanFlagKeys;

	let chunkedList = splitArrayIntoChunks(flagList, 10);

	messagePlayerInfo(client, `{clanOrange}== {jobYellow}Clan Permissions List {clanOrange}=====================`);

	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

/**
 * @param {String} params - The params to search for
 * @return {Number} The data index of a matching clan
 */
function getClanFromParams(params) {
	if (isNaN(params)) {
		for (let i in serverData.clans) {
			if (toLowerCase(serverData.clans[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof serverData.clans[params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

/**
 * @param {Number} clanId - The clan ID to search ranks for
 * @param {String} params - The params to search for
 * @return {Number} The data index of a matching clan
 */
function getClanRankFromParams(clanId, params) {
	if (isNaN(params)) {
		for (let i in getClanData(clanId).ranks) {
			if ((toLowerCase(getClanData(clanId).ranks[i].name).indexOf(toLowerCase(params)) != -1)) {
				return i;
			}
		}
	} else {
		for (let i in getClanData(clanId).ranks) {
			if (getClanData(clanId).ranks[i].level == toInteger(params)) {
				return i;
			}
		}
	}

	return -1;
}

// ===========================================================================

function getLowestClanRank(clanIndex) {
	let lowestRank = 0;
	for (let i in serverData.clans[clanIndex].ranks) {
		if (getClanRankData(clanIndex, i).level < getClanRankData(clanIndex, lowestRank).level) {
			lowestRank = i;
		}
	}
	return lowestRank;
}

// ===========================================================================

function getHighestClanRank(clanIndex) {
	let highestRank = 0;
	for (let i in serverData.clans[clanIndex].ranks) {
		if (getClanRankData(clanIndex, i).level > getClanRankData(clanIndex, highestRank).level) {
			highestRank = i;
		}
	}
	return highestRank;
}

// ===========================================================================

function clanInviteCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (getPlayerClan(client) == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("InviteMember"))) {
		messagePlayerError(client, getLocaleString(client, "CantAddClanMembers"));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (getPlayerClan(targetClient) != -1) {
		messagePlayerError(client, getLocaleString(client, "ClanInviteAlreadyHasClan"));
		return false;
	}

	messagePlayerSuccess(client, getLocaleString(client, "ClanInviteSent", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));
	showPlayerPrompt(targetClient, getLocaleString(targetClient, "ClanInviteRequest", `{ALTCOLOUR}${getCharacterFullName(client)}{MAINCOLOUR}`, `{clanOrange}${getClanData(getPlayerClan(client)).name}{MAINCOLOUR}`, getLocaleString(targetClient, "GUIAlertTitle"), getLocaleString(targetClient, "Yes"), getLocaleString(targetClient, "No")));
	getPlayerData(targetClient).promptType = V_PROMPT_CLANINVITE;
	getPlayerData(targetClient).promptValue = client;
}

// ===========================================================================

function clanUninviteCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (getPlayerClan(client) == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	if (!doesPlayerHaveClanPermission(client, getClanFlagValue("UninviteMember"))) {
		messagePlayerError(client, getLocaleString(client, "CantRemoveClanMembers"));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (getPlayerClan(targetClient) != getPlayerClan(client)) {
		messagePlayerError(client, getLocaleString(client, "ClanPlayerNotInSameClan"));
		return false;
	}

	if (getClanRankData(getPlayerClan(client), getPlayerClanRank(client)).level <= getClanRankData(getPlayerClan(targetClient), getPlayerClanRank(targetClient)).level) {
		messagePlayerError(client, getLocaleString(client, "ClanUnInviteTooLow"));
		return false;
	}

	messagePlayerSuccess(client, getLocaleString(client, "PlayerRemovedFromClan", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));
	messagePlayerAlert(targetClient, getLocaleString(client, "RemovedFromClan", `{ALTCOLOUR}${getCharacterFullName(client)}{MAINCOLOUR}`));


	getPlayerCurrentSubAccount(targetClient).clan = 0;
	getPlayerCurrentSubAccount(targetClient).clanIndex = -1;
	getPlayerCurrentSubAccount(targetClient).clanRank = 0;
	getPlayerCurrentSubAccount(targetClient).clanRankIndex = -1;
}

// ===========================================================================

function clanLeaveCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (getPlayerClan(client) == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidClan"));
		return false;
	}

	let clanData = getClanData(getPlayerClan(client));

	removePlayerFromClan(client);
	messagePlayerSuccess(client, getLocaleString(client, "LeftClan", `{clanOrange}${clanData.name}{MAINCOLOUR}`));
}

// ===========================================================================

function isPlayerInAnyClan(client) {
	return (getPlayerClan(client) != -1);
}

// ===========================================================================

function addPlayerToClan(client, clanIndex, clanRankIndex = 0) {
	getPlayerCurrentSubAccount(client).clan = getClanData(clanIndex).databaseId;
	getPlayerCurrentSubAccount(client).clanIndex = clanIndex;
	getPlayerCurrentSubAccount(client).clanRank = getClanRankData(clanIndex, clanRankIndex).databaseId;
	getPlayerCurrentSubAccount(client).clanRankIndex = clanRankIndex;
}

// ===========================================================================

function removePlayerFromClan(client) {
	getPlayerCurrentSubAccount(client).clan = 0;
	getPlayerCurrentSubAccount(client).clanIndex = -1;
	getPlayerCurrentSubAccount(client).clanRank = 0;
	getPlayerCurrentSubAccount(client).clanRankIndex = -1;
}

// ===========================================================================

function areAnyClanMembersOnline(clanIndex) {
	return (getClients().filter(client => getPlayerClan(client) == clanIndex).length > 0);
}

// ===========================================================================

function loadClanMembersFromDatabase(clanDatabaseId) {
	let dbConnection = connectToDatabase();
	let tempClanMembers = [];
	if (dbConnection) {
		let memberAssoc = fetchQueryAssoc(dbConnection, `SELECT * FROM sacct_main WHERE sacct_clan = ${clanDatabaseId}`);
		for (let i in memberAssoc) {
			let tempMemberData = new SubAccountData(memberAssoc[i]);
			tempClanMembers.push(tempMemberData);
		}
	}

	return tempClanMembers;
}

// ===========================================================================