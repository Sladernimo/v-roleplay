// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: developer.js
// DESC: Provides developer operation, commands, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initDeveloperScript() {
	logToConsole(LOG_INFO, "[VRR.Developer]: Initializing developer script ...");

	// Use GTAC command handlers for these since they need to be available on console
	//addCommandHandler("sc", executeServerCodeCommand);
	//addCommandHandler("cc", executeServerCodeCommand);
	//addCommandHandler("docmd", simulateCommandForPlayerCommand);
	//addCommandHandler("allcmd", simulateCommandForAllPlayersCommand);
	//addCommandHandler("addloglvl", setServerLogLevelCommand);

	logToConsole(LOG_INFO, "[VRR.Developer]: Developer script initialized successfully!");
	return true;
}

// ===========================================================================

function p(params) {
	return getPlayerFromParams(params);
}

// ===========================================================================

function o(params) {
	return getElementsByType(ELEMENT_OBJECT)[params];
}

// ===========================================================================

function io(params) {
	return getItemData(params).object;
}

// ===========================================================================

function pd(params) {
	return getPlayerData(getPlayerFromParams(params));
}

// ===========================================================================

function cv(params) {
	return getClosestVehicle(getPlayerPosition(getPlayerFromParams(params)));
}

// ===========================================================================

function iv(params) {
	return getPlayerVehicle(getPlayerFromParams(params));
}

// ===========================================================================

function bd(params) {
	return getBusinessFromParams(params);
}

// ===========================================================================

function hd(params) {
	return getHouseFromParams(params);
}

// ===========================================================================

function jd(params) {
	return getJobFromParams(params);
}

// ===========================================================================

function jld(params, jobLocationIndex) {
	return getJobFromParams(params).locations[jobLocationIndex];
}

// ===========================================================================

function vd(params) {
	return getVehicleData(getVehicleFromParams(params));
}

// ===========================================================================

function pad(params) {
	return getPlayerData(getPlayerFromParams(params)).accountData;
}

// ===========================================================================

function pcsd(params) {
	return getPlayerCurrentSubAccount(getPlayerFromParams(params));
}

// ===========================================================================

function psd(params, subAccountIndex) {
	return getPlayerData(getPlayerFromParams(params)).subAccounts[subAccountIndex];
}

// ===========================================================================

function pv(params) {
	return getPlayerVehicle(getPlayerFromParams(params));
}

// ===========================================================================

function pvd(params) {
	return getVehicleData(getPlayerVehicle(getPlayerFromParams(params)));
}

// ===========================================================================

function addLogLevelCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	switch(toLowerCase(params)) {
		case "debug":
			logLevel = logLevel | LOG_DEBUG;
			break;

		case "warn":
			logLevel = logLevel | LOG_WARN;
			break;

		case "error":
			logLevel = logLevel | LOG_ERROR;
			break;

		case "info":
			logLevel = logLevel | LOG_INFO;
			break;

		case "verbose":
			logLevel = logLevel | LOG_VERBOSE;
			break;

		default:
			return;
	}

	sendPlayerLogLevel(null, logLevel);

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}enabled log level {ALTCOLOUR}${toLowerCase(params)}`);

	return true;
}

// ===========================================================================

function getLogLevelCommand(command, params, client) {
	let logLevels = [];

	if(hasBitFlag(logLevel, LOG_DEBUG)) {
		logLevels.push("debug");
	}

	if(hasBitFlag(logLevel, LOG_WARN)) {
		logLevels.push("warn");
	}

	if(hasBitFlag(logLevel, LOG_ERROR)) {
		logLevels.push("error");
	}

	if(hasBitFlag(logLevel, LOG_INFO)) {
		logLevels.push("info");
	}

	if(hasBitFlag(logLevel, LOG_VERBOSE)) {
		logLevels.push("verbose");
	}

	messagePlayerAlert(`{MAINCOLOUR}Current log levels: {ALTCOLOUR}${toLowerCase(logLevels.join(", "))}`);

	return true;
}

// ===========================================================================

function removeLogLevelCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	switch(toLowerCase(params)) {
		case "debug":
			logLevel = logLevel & ~LOG_DEBUG;
			break;

		case "warn":
			logLevel = logLevel & ~LOG_WARN;
			break;

		case "error":
			logLevel = logLevel & ~LOG_ERROR;
			break;

		case "info":
			logLevel = logLevel & ~LOG_INFO;
			break;

		case "verbose":
			logLevel = logLevel & ~LOG_VERBOSE;
			break;

		default:
			return;
	}

	sendPlayerLogLevel(null, logLevel);

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}disabled log level {ALTCOLOUR}${toLowerCase(params)}`);

	return true;
}

// ===========================================================================

function simulateCommandForPlayerCommand(command, params, client) {
	if(getCommand(command).requireLogin) {
		if(!isPlayerLoggedIn(client)) {
			messagePlayerError(client, "You must be logged in to use this command!");
			return false;
		}
	}

	if(!doesPlayerHaveStaffPermission(client, getCommandRequiredPermissions(command))) {
		messagePlayerError(client, "You do not have permission to use this command!");
		return false;
	}

	if(areParamsEmpty(params) || !areThereEnoughParams(params, 2)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let tempCommand = getParam(params, " ", 2);
	tempCommand.replace("/", "");
	let tempParams = splitParams.slice(2).join(" ");

	if(!targetClient) {
		messagePlayerError(client, "Invalid player name or ID");
		return false;
	}

	if(!getCommand(tempCommand)) {
		messagePlayerError(client, `The command {ALTCOLOUR}/${command} {MAINCOLOUR}does not exist! Use /help for commands and information.`);
		return false;
	}

	getCommand(toLowerCase(tempCommand)).handlerFunction(tempCommand, tempParams, targetClient);
	messagePlayerSuccess(client, `The command string {ALTCOLOUR}/${tempCommand} ${tempParams}{MAINCOLOUR} has been simulated for {ALTCOLOUR}${getPlayerName(targetClient)}`);
	return true;
}

// ===========================================================================

function simulateCommandForAllPlayersCommand(command, params, client) {
	if(getCommand(command).requireLogin) {
		if(!isPlayerLoggedIn(client)) {
			messagePlayerError(client, "You must be logged in to use this command!");
			return false;
		}
	}

	if(!doesPlayerHaveStaffPermission(client, getCommandRequiredPermissions(command))) {
		messagePlayerError(client, "You do not have permission to use this command!");
		return false;
	}

	if(areParamsEmpty(params) || !areThereEnoughParams(params, 2)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let tempCommand = getParam(params, " ", 1);
	tempCommand.replace("/", "");
	let tempParams = splitParams.slice(1).join(" ");

	if(!getCommand(tempCommand)) {
		messagePlayerError(client, `The command {ALTCOLOUR}/${command} {MAINCOLOUR}does not exist! Use /help for commands and information.`);
		return false;
	}

	let clients = getClients();
	for(let i in clients) {
		if(!clients[i].console) {
			getCommand(toLowerCase(tempCommand)).handlerFunction(tempCommand, tempParams, clients[i]);
		}
	}
	messagePlayerSuccess(client, `The command string {ALTCOLOUR}/${tempCommand} ${tempParams}{MAINCOLOUR} has been simulated for all players!`);
	return true;
}

// ===========================================================================

function executeServerCodeCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let returnValue = "Nothing";
	try {
		returnValue = eval("(" + params + ")");
	} catch(error) {
		messagePlayerError(client, "The code could not be executed!");
		return false;
	}

	messagePlayerSuccess(client, "Server code executed!");
	messagePlayerNormal(client, `Code: ${params}`, COLOUR_YELLOW);
	messagePlayerNormal(client, `Returns: ${returnValue} (${typeof returnValue})`, COLOUR_YELLOW);
	logToConsole(LOG_INFO, `Server code executed by ${getPlayerDisplayForConsole(client)}: ${params}`);
	return true;
}

// ===========================================================================

function executeClientCodeCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let targetCode = splitParams.slice(1).join(" ");

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(targetCode == "") {
		messagePlayerError(client, "You didn't enter any code!");
		return false;
	}

	sendRunCodeToClient(targetClient, targetCode, client);

	messagePlayerSuccess(client, `Executing client code for ${getPlayerName(targetClient)}`);
	messagePlayerNormal(client, `Code: ${targetCode}`);
	return true;
}

// ===========================================================================

function setPlayerTesterStatusCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!hasBitFlag(getPlayerData(targetClient).accountData.flags.moderation, getModerationFlagValue("IsTester"))) {
		getPlayerData(targetClient).accountData.flags.moderation = addBitFlag(getPlayerData(targetClient).accountData.flags.moderation, getModerationFlagValue("IsTester"));
	} else {
		getPlayerData(targetClient).accountData.flags.moderation = removeBitFlag(getPlayerData(targetClient).accountData.flags.moderation, getModerationFlagValue("IsTester"));
	}

	let enabled = hasBitFlag(getPlayerData(targetClient).accountData.flags.moderation, getModerationFlagValue("IsTester"));

	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} ${getBoolRedGreenInlineColour(enabled)}${toUpperCase(getEnabledDisabledFromBool(enabled))} {ALTCOLOUR}${getPlayerName(targetClient)}'s {MAINCOLOUR}tester status`)
	return true;
}

// ===========================================================================

function testPromptGUICommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	showPlayerPromptGUI(targetClient, "Testing the two button prompt GUI", "Testing", getLocaleString(client, "Yes"), getLocaleString(client, "No"))
	return true;
}

// ===========================================================================

function testInfoGUICommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	showPlayerInfoGUI(targetClient, "Testing the info dialog GUI", "Testing", "Ok");
	return true;
}

// ===========================================================================

function testErrorGUICommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	showPlayerErrorGUI(targetClient, "Testing the error dialog GUI", "Testing", "Ok");
	return true;
}

// ===========================================================================

function saveServerDataCommand(command, params, client) {
	messageAdmins(`{adminOrange}Vortrex{MAINCOLOUR} has forced a manual save of all data. Initiating ...`);
	saveServerDataToDatabase();
	messageAdmins(`{MAINCOLOUR}All server data saved to database successfully!`);
	return true;
}

// ===========================================================================

function testEmailCommand(command, params, client) {
	try {
		messagePlayerAlert(client, `Sending test email to ${params}`);
		sendEmail(params, "Player",  "Test email", "Just testing the SMTP module for the server!");
	} catch(error) {
		messagePlayerError(client, "The email could not be sent! Error: ${error}");
		return false;
	}

	return true;
}

// ===========================================================================

function restartGameModeCommand(command, params, client) {
	messagePlayerNormal(null, `The server game mode is restarting!`, getColourByName("orange"));
	thisResource.restart();
	return true;
}

// ===========================================================================

function clientRunCodeFail(client, returnTo, error) {
	let returnClient = getClientFromIndex(returnTo);
	if(!returnClient) {
		return false;
	}

	messagePlayerError(returnClient, `(${getPlayerName(client)}). Error: ${error}`);
}

// ===========================================================================

function clientRunCodeSuccess(client, returnTo, returnVal) {
	let returnClient = getClientFromIndex(returnTo);
	if(!returnClient) {
		return false;
	}

	//messagePlayerSuccess(returnClient, `Client code executed for ${getPlayerName(client)}!`);
	//messagePlayerNormal(returnClient, `Code: ${code}`, getColourByName("yellow"));
	messagePlayerNormal(returnClient, `(${getPlayerName(client)}) Code returns: ${returnVal}`, getColourByName("white"));
}

// ===========================================================================

function submitIdea(client, ideaText) {
	let position = (getPlayerVehicle(client)) ? getVehiclePosition(getPlayerVehicle(client)) : getPlayerPosition(client);
	let heading = (getPlayerVehicle(client)) ? getVehicleHeading(getPlayerVehicle(client)) : getPlayerHeading(client);
	let session = 0;
	let databaseId = 0;

	if(isConsole(client)) {
		databaseId = -1;
	} else {
		databaseId = getPlayerData(client).accountData.databaseId;
	}

	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeIdeaMessage = escapeDatabaseString(dbConnection, ideaText);
		queryDatabase(dbConnection, `INSERT INTO idea_main (idea_server, idea_script_ver, idea_who_added, idea_when_added, idea_message, idea_pos_x, idea_pos_y, idea_pos_z, idea_rot_z, idea_svr_start, idea_session) VALUES (${getServerId()}, '${scriptVersion}', ${databaseId}, NOW(), '${safeIdeaMessage}',${position.x}, ${position.y}, ${position.z}, ${heading}, ${serverStartTime}, ${session})`);
	}
}

// ===========================================================================

function submitBugReport(client, bugText) {
	let position = (getPlayerVehicle(client)) ? getVehiclePosition(getPlayerVehicle(client)) : getPlayerPosition(client);
	let heading = (getPlayerVehicle(client)) ? getVehicleHeading(getPlayerVehicle(client)) : getPlayerHeading(client);
	let session = 0;
	let databaseId = 0;

	if(isConsole(client)) {
		databaseId = -1;
	} else {
		databaseId = getPlayerData(client).accountData.databaseId;
	}

	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeBugMessage = escapeDatabaseString(dbConnection, bugText);
		queryDatabase(dbConnection, `INSERT INTO bug_main (bug_server, bug_script_ver, bug_who_added, bug_when_added, bug_message, bug_pos_x, bug_pos_y, bug_pos_z, bug_rot_z, bug_svr_start, bug_session) VALUES (${getServerId()}, '${scriptVersion}', ${databaseId}, NOW(), '${safeBugMessage}', ${position.x}, ${position.y}, ${position.z}, ${heading}, ${serverStartTime}, ${session})`);
	}
}

// ===========================================================================

function isDevelopmentServer() {
	return intToBool(server.getCVar("devserver") || 0);
}

// ===========================================================================

function migrateSubAccountsToPerServerData() {
	let dbConnection = connectToDatabase();
	let dbQuery = false;
	let dbAssoc = false;
	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM sacct_main`);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				createDefaultSubAccountServerData(dbAssoc["sacct_id"]);

				let dbQuery2 = queryDatabase(dbConnection, `UPDATE sacct_svr SET sacct_svr_skin = ${dbAssoc["sacct_skin"]}, sacct_svr_job = ${dbAssoc["sacct_job"]} WHERE sacct_svr_sacct=${dbAssoc["sacct_id"]} AND sacct_svr_server=${dbAssoc["sacct_server"]}`);
				if(dbQuery2) {
					freeDatabaseQuery(dbQuery2);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
	}
}

// ===========================================================================

function resetAllAccountsHotkeysToDefault() {
	let dbConnection = connectToDatabase();
	let dbQuery = false;
	let dbAssoc = false;
	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT acct_id FROM acct_main`);
		if(dbQuery) {
			while(dbAssoc = fetchQueryAssoc(dbQuery)) {
				createDefaultKeybindsForAccount(dbAssoc["acct_id"]);
			}
			freeDatabaseQuery(dbQuery);
		}
	}
}

// ===========================================================================

function togglePauseSavingToDatabaseCommand(command, params, client) {
	getServerConfig().pauseSavingToDatabase = !getServerConfig().pauseSavingToDatabase;
}

// ===========================================================================

function createAccountDataForNewServer(serverId) {
	let dbConnection = connectToDatabase();
	let dbQuery = false;
	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM acct_main`);
		if(dbQuery) {
			let dbQueryString = `INSERT INTO acct_svr (acct_svr_acct, acct_svr_svr) VALUES (${accountDatabaseId}, ${serverId})`;
			quickDatabaseQuery(dbQueryString);
		}
	}
}

// ===========================================================================

function streamAudioURLToAllPlayersCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let url = getParam(params, " ", 1);
	let volume = getParam(params, " ", 2);

	playRadioStreamForPlayer(null, url, false, volume);
}

// ===========================================================================

function streamAudioNameToAllPlayersCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let name = getParam(params, " ", 1);
	let volume = getParam(params, " ", 2);

	playAudioFileForPlayer(null, name, false, volume);
}

// ===========================================================================

function fixAllServerBlipsCommand(command, params, client) {
	deleteAllBusinessBlips();
	deleteAllJobBlips();
	deleteAllHouseBlips();

	let blips = getElementsByType(ELEMENT_BLIP);
	blips.forEach((blip) => {
		deleteGameElement(blip);
	});

	createAllJobBlips();
	createAllBusinessBlips();
	createAllHouseBlips();
}

// ===========================================================================

function fixAllServerPickupsCommand(command, params, client) {
	let pickups = getElementsByType(ELEMENT_PICKUP);
	pickups.forEach((pickup) => {
		deleteGameElement(pickup);
	});

	createAllJobPickups();
	createAllBusinessPickups();
	createAllHousePickups();
}

// ===========================================================================

function resetAllServerAmbienceElementsCommand(command, params, client) {
	clearTemporaryPeds();
	cleartTemporaryVehicles();
}

// ===========================================================================

function reloadEconomyConfigurationCommand(command, params, client) {
	getGlobalConfig().economy = loadEconomyConfig();
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}has reloaded the economy settings`);
}

// ===========================================================================

function showLocalePickerTestCommand(command, params, client) {
	showLocaleChooserForPlayer(client);
}

// ===========================================================================

function executeDatabaseQueryCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!targetClient) {
		messagePlayerError(client, "That player was not found!");
		return false;
	}

	if(targetCode == "") {
		messagePlayerError(client, "You didn't enter any code!");
		return false;
	}

	let success = quickDatabaseQuery(params);

	if(!success) {
		messagePlayerAlert(client, `Database query failed to execute: {ALTCOLOUR}${query}`);
	} else if(typeof success != "boolean") {
		messagePlayeSuccess(client, `Database query successful: {ALTCOLOUR}${query}`);
		messagePlayerInfo(client, `Returns: ${success}`);
	} else {
		messagePlayerSuccess(client, `Database query successful: {ALTCOLOUR}${query}`);
	}
	return true;
}

// ===========================================================================