// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: account.js
// DESC: Provides account functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initAccountScript() {
	logToConsole(LOG_DEBUG, "[VRR.Account]: Initializing account script ...");
	logToConsole(LOG_DEBUG, "[VRR.Account]: Account script initialized!");
}

// ===========================================================================

function loginCommand(command, params, client) {
	if(!isPlayerRegistered(client)) {
		messagePlayerError(client, getLocaleString(client, "NameNotRegistered"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	checkLogin(client, params);
	return true;
}

// ===========================================================================

function toggleAutoLoginByIPCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("AutoLoginIP");

	if(hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "AutomaticLoginIPToggle", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}`));
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "AutomaticLoginIPToggle", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}`));
	}
	return true;
}

// ===========================================================================

function toggleNoRandomTipsCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("NoRandomTips");

	if(hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "RandomTipsToggle", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}`));
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "RandomTipsToggle", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}`));
	}
	return true;
}

// ===========================================================================

function toggleNoActionTipsCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("NoActionTips");

	if(hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "ActionTipsToggle", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}`));
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "ActionTipsToggle", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}`));
	}
	return true;
}

// ===========================================================================

function toggleAutoSelectLastCharacterCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("AutoSelectLastCharacter");

	if(hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "AutoSpawnLastCharToggle", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}`));
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "AutoSpawnLastCharToggle", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}`));
	}
	return true;
}

// ===========================================================================

function toggleAccountGUICommand(command, params, client) {
	// Remember, the flag is BACKWARD. Enabled = NO GUI!
	let flagValue = getAccountSettingsFlagValue("NoGUI");

	if(doesPlayerHaveGUIEnabled(client)) {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerNormal(client, getLocaleString(client, "GUIAccountSettingToggle", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} has toggled GUI for their account OFF.`);
	} else {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerNormal(client, getLocaleString(client, "GUIAccountSettingToggle", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} has toggled GUI for their account ON.`);
	}

	if(!isPlayerLoggedIn(client)) {
		if(getPlayerData().accountData.databaseId != 0) {
			if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
				showPlayerLoginGUI(client);
				logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the login GUI`);
			} else {
				hideAllPlayerGUI(client);
				messagePlayerNormal(client, getLocaleString(client, "WelcomeBack", getServerName(), getPlayerName(client), "{ALTCOLOUR}/login{MAINCOLOUR}"));
				logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the login message (GUI disabled)`);
			}
		} else {
			if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
				showPlayerRegistrationGUI(client);
				logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the register GUI`);
			} else {
				hideAllPlayerGUI(client);
				messagePlayerNormal(client, getLocaleString(client, "WelcomeNewPlayer", getServerName(), getPlayerName(client), "{ALTCOLOUR}/register{MAINCOLOUR}"));
				logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the register message (GUI disabled)`);
			}
		}
	}
	return true;
}

// ===========================================================================

function toggleAccountLoginAttemptNotificationsCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("AuthAttemptAlert");

	if(doesPlayerHaveLoginAlertsEnabled(client)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerNormal(client, `⚙️ You turned ${getBoolRedGreenInlineColour(false)}OFF{MAINCOLOUR} notification by email when somebody tries to login to your account`);
		logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} has toggled the login attempt email notifications OFF for their account`);
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerNormal(client, `⚙️ You turned ${getBoolRedGreenInlineColour(true)}ON{MAINCOLOUR} notification by email when somebody tries to login to your account`);
		logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} has toggled the login attempt email notifications OFF for their account`);
	}

	return true;
}

// ===========================================================================

function toggleAccountServerLogoCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("NoServerLogo");

	if(!doesPlayerHaveLogoEnabled(client)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "AccountServerLogoSet", `${getBoolRedGreenInlineColour(true)}${getLocaleString(client, "On")}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} has toggled the server logo ON for their account`);
		if(getServerConfig().showLogo) {
			updatePlayerShowLogoState(client, true);
		}
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "AccountServerLogoSet", `${getBoolRedGreenInlineColour(false)}${getLocaleString(client, "Off")}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} has toggled the server logo OFF for their account`);
		updatePlayerShowLogoState(client, false);
	}

	return true;
}

// ===========================================================================

function toggleAccountTwoFactorAuthCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("TwoStepAuth");

	if(getEmailConfig().enabled) {
		if(getPlayerData(client).accountData.emailAddress == "") {
			messagePlayerError(client, getLocaleString(client, "NeedEmailFor2FA"));
			messagePlayerTip(client, getLocaleString(client, "SetEmailHelpTip", `{ALTCOLOUR}/setemail{MAINCOLOUR}`));
			return false;
		}

		if(!isAccountEmailVerified(getPlayerData(client).accountData)) {
			messagePlayerError(client, getLocaleString(client, "NeedEmailVerifiedFor2FA"));
			messagePlayerTip(client, getLocaleString(client, "VerifyEmailHelpTip", `{ALTCOLOUR}/verifyemail{MAINCOLOUR}`));
			return false;
		}
	}

	if(!doesPlayerHaveTwoFactorAuthEnabled(client)) {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "TwoFactorAuthSet", `${getBoolRedGreenInlineColour(true)}${getLocaleString(client, "On")}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} has toggled two-factor authentication ON for their account`);
	} else {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "TwoFactorAuthSet", `${getBoolRedGreenInlineColour(false)}${toUpperCase(getLocaleString(client, "Off"))}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} has toggled two-factor authentication OFF for their account`);
	}
	return true;
}

// ===========================================================================

function registerCommand(command, params, client) {
	if(isPlayerRegistered(client)) {
		messagePlayerError(client, getLocaleString(client, "AccountNameAlreadyRegistered"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	checkRegistration(client, params);
	//getPlayerData(client).accountData = accountData;
	//messagePlayerSuccess(client, `Your account has been created!`);
	//messagePlayerAlert(client, `To play on the server, you will need to make a character.`);
}

// ===========================================================================

function changeAccountPasswordCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let oldPassword = getParam(params, " ", 1);
	let newPassword = getParam(params, " ", 2);

	if(isAccountPasswordCorrect(getPlayerData(client).accountData, hashAccountPassword(getPlayerData(client).accountData.name, oldPassword))) {
		messagePlayerError(client, `The old password is invalid!`);
		return false;
	}

	if(!doesPasswordMeetRequirements(newPassword)) {
		messagePlayerError(client, getLocaleString(client, "PasswordNotGoodEnough"));
		messagePlayerInfo(client, getLocaleString(client, "PasswordNeedsBase", `${getLocaleString(client, "PasswordNeedsCapitals", getGlobalConfig().passwordRequiredCapitals)}, ${getLocaleString(client, "PasswordNeedsSymbols", getGlobalConfig().passwordRequiredSymbols)}`));
		return false;
	}

	getPlayerData(client).accountData.password = hashAccountPassword(getPlayerData(client).accountData.name, params);
	messagePlayerSuccess(client, `Your password has been changed!`);
}

// ===========================================================================

function setAccountChatScrollLinesCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(isNaN(params)) {
		messagePlayerError(client, getLocaleString(client, "ChatScrollLinesNotNumber"));
		return false;
	}

	if(toInteger(params) < 1 || toInteger(params) > 6) {
		messagePlayerError(client, getLocaleString(client, "ChatScrollLinesMustBeBetween", getGlobalConfig().minChatLines, getGlobalConfig().maxChatLines));
		return false;
	}

	let lines = Math.ceil(toInteger(params));

	getPlayerData(client).accountData.chatScrollLines = lines;
	sendPlayerChatScrollLines(client, lines);
	messagePlayerSuccess(client, getLocaleString(client, "ChatScrollLinesSet", lines));
}

// ===========================================================================

function setAccountChatAutoHideDelayCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(isNaN(params)) {
		messagePlayerError(client, `The delay time must be a number!`);
		return false;
	}

	let delay = Math.ceil(toInteger(params));

	getPlayerData(client).accountData.chatAutoHideDelay = delay;
	sendPlayerChatAutoHideDelay(client, delay);
	messagePlayerSuccess(client, `Your chatbox will now automatically hide after ${toInteger(delay)} seconds!`);
}

// ===========================================================================

function setAccountEmailCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let emailAddress = getParam(params, " ", 1);

	if(!isValidEmailAddress(emailAddress)) {
		messagePlayerError(client, getLocaleString(client, "RegistrationFailedInvalidEmail"));
		return false;
	}

	//if(.emailAddress != "") {
	//	messagePlayerError(client, `Your email is already set!`);
	//	return false;
	//}

	if(getPlayerData(client).accountData.emailAddress != "" && isAccountEmailVerified(getPlayerData(client).accountData)) {
		messagePlayerError(client, getLocaleString(client, "AccountEmailAlreadySetAndVerified"));
		return false;
	}

	setAccountEmail(getPlayerData(client).accountData, emailAddress);

	let emailVerificationCode = generateEmailVerificationCode();
	setAccountEmailVerificationCode(getPlayerData(client).accountData, emailVerificationCode);
	sendEmailVerificationEmail(client, emailVerificationCode);

	messagePlayerSuccess(client, getLocaleString(client, "EmailSet"));
	messagePlayerAlert(client, getLocaleString(client, "RegistrationEmailVerifyReminder"));
	messagePlayerAlert(client, getLocaleString(client, "EmailVerificationCodeSent"));
	saveAccountToDatabase(getPlayerData(client).accountData);
}

// ===========================================================================

function verifyAccountEmailCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let verificationCode = getParam(params, " ", 1);

	if(isAccountEmailVerified(getPlayerData(client).accountData)) {
		messagePlayerError(client, `You already verified your email!`);
		return false;
	}

	if(module.hashing.sha512(verificationCode) != getPlayerData(client).accountData.emailVerificationCode) {
		messagePlayerError(client, getLocaleString(client, "InvalidEmailVerificationCode"));
		let emailVerificationCode = generateEmailVerificationCode();
		setAccountEmailVerificationCode(getPlayerData(client).accountData, emailVerificationCode);
		sendEmailVerificationEmail(client, emailVerificationCode);
		return false;
	}

	getPlayerData(client).accountData.flags.moderation = addBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("EmailVerified"));
	getPlayerData(client).accountData.emailVerificationCode = "";

	messagePlayerSuccess(client, getLocaleString(client, "EmailVerified"));
	messagePlayerAlert(client, getLocaleString(client, "EmailVerifiedTip"));
	saveAccountToDatabase(getPlayerData(client).accountData);
}

// ===========================================================================

/*
function resetAccountPasswordCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let verificationCode = getParam(params, " ", 1) || "";

	if(!isAccountEmailVerified(getPlayerData(client).accountData)) {
		messagePlayerError(client, `Your email is not verified. Your password will not be reset!`);
		return false;
	}

	if(!areParamsEmpty(verificationCode)) {
		if(module.hashing.sha512(verificationCode) != getPlayerData(client).accountData.resetPasswordVerificationCode) {
			messagePlayerError(client, `Invalid reset password verification code! A new one has been created and sent to your email.`);
			let resetPasswordVerificationCode = generateResetPasswordVerificationCode();
			setAccountEmailVerificationCode(getPlayerData(client).accountData, emailVerificationCode);
			sendEmailVerificationEmail(client, emailVerificationCode);
			return false;
		}
	}

	saveAccountToDatabase(getPlayerData(client).accountData);
}
*/

// ===========================================================================

function setAccountDiscordCommand(command, params, client) {
	messagePlayerError(client, `This command is not yet finished and will be available soon!`);
	return false;

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let discordName = getParam(params, " ", 1);

	if(!isValidEmailAddress(emailAddress)) {
		messagePlayerError(client, `The discord '${discordName} is not valid!`);
		return false;
	}

	// TO-DO: Command (like /verifydiscord or use this one for second step too) to input verification code sent to email.
	//getPlayerData(client).accountData.emailAddress = emailAddress;
	//messagePlayerSuccess(client, "Your discord account has been attached to your game account!");
}

// ===========================================================================

function isPlayerLoggedIn(client) {
	if(isConsole(client)) {
		return true;
	}

	if(getPlayerData(client) != null) {
		return getPlayerData(client).loggedIn;
	}

	return false;
}

// ===========================================================================

function isPlayerRegistered(client) {
	if(isConsole(client)) {
		return true;
	}

	if(getPlayerData(client).accountData != false) {
		if(getPlayerData(client).accountData.databaseId != 0) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function doesPasswordMeetRequirements(password) {
	// Will be added soon
	return true;
}

// ===========================================================================

function isAccountPasswordCorrect(accountData, password) {
	if(accountData.password == password) {
		return true;
	}

	return false;
}

// ===========================================================================

function loadAccountFromName(accountName, fullLoad = false) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		accountName = escapeDatabaseString(dbConnection, accountName);
		let dbQueryString = `SELECT acct_main.*, acct_svr.* FROM acct_main INNER JOIN acct_svr ON acct_svr.acct_svr_acct = acct_main.acct_id AND acct_svr.acct_svr_svr = ${getServerId()} WHERE acct_name = '${accountName}' LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				let dbAssoc = fetchQueryAssoc(dbQuery);
				let tempAccountData = new AccountData(dbAssoc);
				if(fullLoad) {
					tempAccountData.messages = loadAccountMessagesFromDatabase(tempAccountData.databaseId);
					tempAccountData.notes = loadAccountStaffNotesFromDatabase(tempAccountData.databaseId);
					tempAccountData.contacts = loadAccountContactsFromDatabase(tempAccountData.databaseId);
				}
				freeDatabaseQuery(dbQuery);
				return tempAccountData;
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function loadAccountFromId(accountId, fullLoad = false) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let dbQueryString = `SELECT *, acct_ip AS ipstring FROM acct_main WHERE acct_id = ${accountId} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if(dbQuery) {
			let dbAssoc = fetchQueryAssoc(dbQuery);
			let tempAccountData = new AccountData(dbAssoc);
			freeDatabaseQuery(dbQuery);
			if(fullLoad) {
				tempAccountData.messages = loadAccountMessagesFromDatabase(tempAccountData.databaseId);
				tempAccountData.notes = loadAccountStaffNotesFromDatabase(tempAccountData.databaseId);
				tempAccountData.contacts = loadAccountContactsFromDatabase(tempAccountData.databaseId);
			}

			return tempAccountData;
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function getAccountHashingFunction() {
	switch(toLowerCase(getGlobalConfig().accountPasswordHash)) {
		case "md5":
			return module.hashing.md5;

		case "sha1":
			return module.hashing.sha1;

		case "sha224":
			return module.hashing.sha224;

		case "sha256":
			return module.hashing.sha256;

		case "sha384":
			return module.hashing.sha384;

		case "sha512":
			return module.hashing.sha512;

		case "ripemd128":
			return module.hashing.ripemd128;

		case "ripemd160":
			return module.hashing.ripemd160;

		case "ripemd256":
			return module.hashing.ripemd256;

		case "ripemd320":
			return module.hashing.ripemd320;

		case "whirlpool":
			return module.hashing.whirlpool;
	}
}

// ===========================================================================

function isNameRegistered(name) {
	let accountData = loadAccountFromName(name, true);
	if(accountData.databaseId > 0) {
		return true;
	}

	return false;
}

// ===========================================================================

function hashAccountPassword(name, password) {
	let hashFunction = getAccountHashingFunction();
	let saltedInfo = saltAccountInfo(name, password);
	return hashFunction(saltedInfo);
}

// ===========================================================================

function saltAccountInfo(name, password) {
	return `ag.gaming.${accountSaltHash}.${name}.${password}`;
}

// ===========================================================================

function loginSuccess(client) {
	logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} successfully logged in.`);
	getPlayerData(client).loggedIn = true;

	updateConnectionLogOnAuth(client, getPlayerData(client).accountData.databaseId);

	if(doesPlayerHaveStaffPermission(client, "Developer") || doesPlayerHaveStaffPermission(client, "ManageServer")) {
		logToConsole(LOG_WARN, `[VRR.Account] ${getPlayerDisplayForConsole(client)} has needed permissions and is being given administrator access`);
		setPlayerNativeAdminState(client, true);
	}

	if(doesServerHaveTesterOnlyEnabled()) {
		if(!hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("IsTester"))) {
			setTimeout(function() {
				getPlayerData(client).customDisconnectReason = "Kicked - Not a tester";
				disconnectPlayer(client);
			}, 3500);

			if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
				logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the error GUI (not a tester).`);
				showPlayerErrorGUI(client, getLocaleString(client, "NotATester"), getLocaleString(client, "AccessDenied"));
				return false;
			} else {
				logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the "not a tester" error message (GUI disabled).`);
				messagePlayerError(client, getLocaleString(client, "NotATester"));
				return false;
			}
		}
	}

	if(getPlayerData(client).subAccounts.length == 0) {
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerPrompt(client, getLocaleString(client, "NoCharactersGUIMessage"), getLocaleString(client, "NoCharactersGUIWindowTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
			getPlayerData(client).promptType = VRR_PROMPT_CREATEFIRSTCHAR;
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the no characters prompt GUI`);
		} else {
			messagePlayerAlert(client, getLocaleString(client, "NoCharactersChatMessage", `{ALTCOLOUR}/newchar{MAINCOLOUR}`));
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the no characters message (GUI disabled)`);
		}
	} else {
		showCharacterSelectToClient(client);
	}

	getPlayerData(client).accountData.ipAddress = getPlayerIP(client);
	sendPlayerChatScrollLines(client, getPlayerData(client).accountData.chatScrollLines);

	messageDiscordChatChannel(`👋 ${getPlayerName(client)} has joined the server`);

	//let countryName = "Unknown";
	//if(getCountryNameFromIP(getPlayerIP(client))) {
	//	countryName = getCountryNameFromIP(getPlayerIP(client));
	//}

	//let clients = getClients();
	//for(let i in clients) {
	//	messagePlayerNormal(clients[i], getLocaleString(clients[i], "PlayerJoinedServer", `{ALTCOLOUR}${getPlayerName(client)}{MAINCOLOUR}`, `{ALTCOLOUR}${countryName}{MAINCOLOUR}`), getColourByName("softYellow"));
	//}
}

// ===========================================================================

function saveAccountToDatabase(accountData) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		logToConsole(LOG_VERBOSE, `Escaping account data for ${accountData.name}`);
		let safeAccountName = escapeDatabaseString(dbConnection, accountData.name);
		logToConsole(LOG_VERBOSE, `${accountData.name}'s name escaped successfully`);
		let safePassword = escapeDatabaseString(dbConnection, accountData.password);
		logToConsole(LOG_VERBOSE, `${accountData.name}'s password escaped successfully`);
		let safeStaffTitle = escapeDatabaseString(dbConnection, accountData.staffTitle);
		logToConsole(LOG_VERBOSE, `${accountData.name}'s staff title escaped successfully`);
		let safeEmailAddress = escapeDatabaseString(dbConnection, accountData.emailAddress);
		logToConsole(LOG_VERBOSE, `${accountData.name}'s email address escaped successfully`);

		let data = [
			["acct_name", safeAccountName],
			["acct_pass", safePassword],
			["acct_email", safeEmailAddress],
			["acct_discord", accountData.discordAccount],
			["acct_code_verifyemail", accountData.emailVerificationCode],
			["acct_streaming_radio_volume", accountData.streamingRadioVolume],
			["acct_ip", accountData.ipAddress],
			["acct_locale", accountData.locale],
		];

		let data2 = [
			["acct_svr_settings", accountData.settings],
			["acct_svr_staff_title", safeStaffTitle],
			["acct_svr_staff_flags", accountData.flags.admin],
			["acct_svr_mod_flags", accountData.flags.moderation],
			["acct_svr_chat_scroll_lines", accountData.chatScrollLines],
			["acct_svr_chat_auto_hide_delay", accountData.chatAutoHideDelay],
		];

		let queryString1 = createDatabaseUpdateQuery("acct_main", data, `acct_id=${accountData.databaseId}`);
		let dbQuery1 = queryDatabase(dbConnection, queryString1);
		freeDatabaseQuery(dbQuery1);

		let queryString2 = createDatabaseUpdateQuery("acct_svr", data2, `acct_svr_acct=${accountData.databaseId} AND acct_svr_svr=${getServerId()}`);
		let dbQuery2 = queryDatabase(dbConnection, queryString2);
		freeDatabaseQuery(dbQuery2);

		disconnectFromDatabase(dbConnection);
		return true;
	}
}

// ===========================================================================

function saveAccountKeyBindToDatabase(keyBindData) {
	if(keyBindData.databaseId == -1) {
		// Keybind is a default or temporary keybind, don't save
		return false;
	}

	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeCommandString = escapeDatabaseString(dbConnection, keyBindData.commandString);

		let data = [
			["acct_hotkey_acct", keyBindData.account],
			["acct_hotkey_enabled", keyBindData.enabled],
			["acct_hotkey_deleted", keyBindData.deleted],
			["acct_hotkey_cmdstr", safeCommandString],
			["acct_hotkey_key", keyBindData.key],
			["acct_hotkey_down", boolToInt(keyBindData.keyState)],
		];

		let dbQuery = null;
		if(keyBindData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("acct_hotkey", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			keyBindData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("acct_hotkey", data, `acct_hotkey_id=${keyBindData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		keyBindData.needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
	}
}

// ===========================================================================

function saveAccountStaffNotesDatabase(staffNoteData) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeNoteContent = escapeDatabaseString(dbConnection, staffNoteData.note);

		let data = [
			["acct_note_message", safeNoteContent],
			["acct_note_who_added", staffNoteData.whoAdded],
			["acct_note_when_added", staffNoteData.whenAdded],
			["acct_note_server", staffNoteData.server],
			["acct_note_acct", staffNoteData.account],
		];

		let dbQuery = null;
		if(staffNoteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("acct_note", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			staffNoteData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("acct_note", data, `acct_note_id=${staffNoteData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		staffNoteData.needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
	}
}

// ===========================================================================

/*
function saveAccountContactsToDatabase(accountContactData) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeNoteContent = escapeDatabaseString(dbConnection, accountContactData.note);
		if(accountContactData.databaseId == 0) {
			let dbQueryString = `INSERT INTO acct_contact (acct_contact_note, acct_contact_, acct_note_when_added, acct_note_server, acct_note_acct) VALUES ('${safeNoteContent}', ${staffNoteData.whoAdded}, UNIX_TIMESTAMP(), ${getServerId()}, ${staffNoteData.account}`;
			staffNoteData.databaseId = getDatabaseInsertId(dbConnection);
			let dbQuery = queryDatabase(dbConnection, dbQueryString);
			freeDatabaseQuery(dbQuery);
		}// else {
		//	let dbQueryString = `UPDATE acct_hotkey SET acct_hotkey_cmdstr='${safeCommandString}', acct_hotkey_key=${keyBindData.key}, acct_hotkey_down=${boolToInt(keyBindData.keyState)}, acct_hotkey_enabled=${boolToInt(keyBindData.enabled)} WHERE acct_hotkey_id=${keyBindData.databaseId}`;
		//	let dbQuery = queryDatabase(dbConnection, dbQueryString);
		//	freeDatabaseQuery(dbQuery);
		//}

		disconnectFromDatabase(dbConnection);
	}
}
*/

// ===========================================================================

function createAccount(name, password, email = "") {
	let dbConnection = connectToDatabase();

	if(dbConnection) {
		let hashedPassword = hashAccountPassword(name, password);
		let safeName = escapeDatabaseString(dbConnection, name);
		let safeEmail = escapeDatabaseString(dbConnection, email);

		let dbQuery = queryDatabase(dbConnection, `INSERT INTO acct_main (acct_name, acct_pass, acct_email, acct_when_registered) VALUES ('${safeName}', '${hashedPassword}', '${safeEmail}', CURRENT_TIMESTAMP())`);
		if(getDatabaseInsertId(dbConnection) > 0) {
			let tempAccountData = loadAccountFromId(getDatabaseInsertId(dbConnection), false);
			createDefaultAccountServerData(tempAccountData.databaseId);
			tempAccountData.messages = loadAccountMessagesFromDatabase(tempAccountData.databaseId);
			tempAccountData.notes = loadAccountStaffNotesFromDatabase(tempAccountData.databaseId);
			tempAccountData.contacts = loadAccountContactsFromDatabase(tempAccountData.databaseId);
			tempAccountData.flags.admin = 0;
			return tempAccountData;
		}
	}

	return false;
}

// ===========================================================================

function checkLogin(client, password) {
	getPlayerData(client).loginAttemptsRemaining = getPlayerData(client).loginAttemptsRemaining-1;
	if(getPlayerData(client).loginAttemptsRemaining <= 0) {
		disconnectPlayer(client);
	}

	if(isPlayerLoggedIn(client)) {
		logToConsole(LOG_WARN, `[VRR.Account] ${getPlayerDisplayForConsole(client)} attempted to login but is already logged in`);
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginSuccessGUI(client);
		} else {
			messagePlayerError(client, "You are already logged in!");
		}

		return false;
	}

	if(!isPlayerRegistered(client)) {
		logToConsole(LOG_WARN, `[VRR.Account] ${getPlayerDisplayForConsole(client)} attempted to login but is not registered`);
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerRegistrationGUI(client);
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the register GUI`);
		} else {
			messagePlayerError(client, "Your name is not registered! Use /register to make an account.");
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the register message (GUI disabled)`);
		}
		return false;
	}

	if(areParamsEmpty(password)) {
		logToConsole(LOG_WARN, `[VRR.Account] ${getPlayerDisplayForConsole(client)} attempted to login but failed (empty password). ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining`);
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginFailedGUI(client, `Invalid password! ${getPlayerData(client).loginAttemptsRemaining} tries remaining.`);
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the login GUI with ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining alert.`);
		} else {
			messagePlayerError(client, `You must enter a password! ${getPlayerData(client).loginAttemptsRemaining} tries remaining.`);
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the login message (GUI disabled) with ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining alert.`);
		}

		if(isAccountEmailVerified(getPlayerData(client).accountData) && !isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("AuthAttemptAlert"))) {
			sendAccountLoginFailedNotification(getPlayerData(client).accountData.emailAddress, getPlayerName(client), getPlayerIP(client), getGame());
		}
		return false;
	}

	if(!isAccountPasswordCorrect(getPlayerData(client).accountData, hashAccountPassword(getPlayerName(client), password))) {
		logToConsole(LOG_WARN, `[VRR.Account] ${getPlayerDisplayForConsole(client)} attempted to login but failed (wrong password). ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining`);
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginFailedGUI(client, `Invalid password! ${getPlayerData(client).loginAttemptsRemaining} tries remaining.`);
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the login GUI with ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining alert.`);
		} else {
			messagePlayerError(client, `Invalid password! ${getPlayerData(client).loginAttemptsRemaining} tries remaining.`);
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the login message (GUI disabled) with ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining alert.`);
		}

		if(isAccountEmailVerified(getPlayerData(client).accountData) && !isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("AuthAttemptAlert"))) {
			sendAccountLoginFailedNotification(getPlayerData(client).accountData.emailAddress, getPlayerName(client), getPlayerIP(client), getGame());
		}
		return false;
	}

	if(doesPlayerHaveTwoFactorAuthEnabled(client) && checkForSMTPModule() && getEmailConfig().enabled) {
		getPlayerData(client).twoFactorAuthCode = toUpperCase(generateRandomString(6));
		showPlayerTwoFactorAuthenticationGUI(client);
		sendAccountTwoFactorAuthCode(getPlayerData(client).accountData.emailAddress, getPlayerName(client), getPlayerData(client).twoFactorAuthCode);
		return true;
	}

	if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		showPlayerLoginSuccessGUI(client);
	}

	loginSuccess(client);

	if(isAccountEmailVerified(getPlayerData(client).accountData) && !isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("AuthAttemptAlert"))) {
		sendAccountLoginSuccessNotification(getPlayerData(client).accountData.emailAddress, getPlayerName(client), getPlayerIP(client), getGame());
	}
}

// ===========================================================================

function checkRegistration(client, password, confirmPassword = "", emailAddress = "") {
	logToConsole(LOG_DEBUG, `[VRR.Account]: Checking registration for ${getPlayerName(client)}`);

	if(isPlayerRegistered(client)) {
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginGUI(client);
		} else {
			messagePlayerError(client, getLocaleString(client, "AlreadyRegistered"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (already registered)`);
		}
		return false;
	}

	if(isPlayerLoggedIn(client)) {
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginSuccessGUI(client);
		} else {
			messagePlayerError(client, getLocaleString(client, "AlreadyLoggedIn"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (already logged in)`);
		}
		return false;
	}

	if(areParamsEmpty(password)) {
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedNoPassword"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password is blank)`);
		} else {
			messagePlayerError(client, "The password cannot be blank!");
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password is blank)`);
		}
		return false;
	}

	if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		if(areParamsEmpty(confirmPassword)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedNoPasswordConfirm"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password confirm is blank)`);
			return false;
		}
	}

	if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		if(areParamsEmpty(emailAddress)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedNoEmail"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (email address is blank)`);
			return false;
		}
	}

	if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		if(password != confirmPassword) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedPasswordMismatch"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password and confirm don't match)`);
			return false;
		}
	}

	if(!doesPasswordMeetRequirements(password)) {
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			// Work on this later. Function should return true by default anyway for now.
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedNoPasswordWeak"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password doesn't meet requirements)`);
		} else {
			messagePlayerError(client, "Password doesn't meet requirements!");
		}
		return false;
	}

	if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		if(!isValidEmailAddress(emailAddress)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedInvalidEmail"));
			return false;
		}
	}

	let accountData = createAccount(getPlayerName(client), password, emailAddress);
	if(!accountData) {
		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedCreateError"));
		} else {
			messagePlayerAlert(client, getLocaleString(client, "RegistrationFailedCreateError"));
		}

		messagePlayerAlert(client, `${getServerName()} staff have been notified of the problem and will fix it shortly.`);
		return false;
	}

	getPlayerData(client).accountData = accountData;
	getPlayerData(client).loggedIn = true;

	messagePlayerSuccess(client, getLocaleString(client, "RegistrationSuccess"));
	if(checkForSMTPModule() && getEmailConfig().enabled) {
		messagePlayerAlert(client, getLocaleString(client, "RegistrationEmailVerifyReminder"));
		let emailVerificationCode = generateEmailVerificationCode();
		setAccountEmailVerificationCode(getPlayerData(client).accountData, emailVerificationCode);
		sendEmailVerificationEmail(client, emailVerificationCode);
		logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} was sent a registration email verification code`);
	}

	if(doesServerHaveTesterOnlyEnabled() && !isPlayerATester(client)) {
		setTimeout(function() {
			disconnectPlayer(client);
		}, 5000);

		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the error GUI (not a tester).`);
			showPlayerErrorGUI(client, getLocaleString(client, "NotATester"), getLocaleString(client, "AccessDenied"));
			return false;
		} else {
			logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the "not a tester" error message (GUI disabled).`);
			messagePlayerError(client, getLocaleString(client, "NotATester"));
			return false;
		}
	} else {
		messagePlayerAlert(client, getLocaleString(client, "RegistrationCreateCharReminder"));

		if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerRegistrationSuccessGUI(client);
			showPlayerPrompt(client, getLocaleString(client, "NoCharactersMessage"), getLocaleString(client, "NoCharactersWindowTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
			getPlayerData(client).promptType = VRR_PROMPT_CREATEFIRSTCHAR;
		} else {
			messagePlayerAlert(client, getLocaleString(client, "NoCharactersChatMessage"), `{ALTCOLOUR}/newchar{MAINCOLOUR}`);
		}
	}
};

// ===========================================================================

function checkAccountResetPasswordRequest(client, inputText) {
	if(!checkForSMTPModule() || !getEmailConfig().enabled) {
		return false;
	}

	if(getPlayerData(client).passwordResetState == VRR_RESETPASS_STATE_NONE) {
		if(toLowerCase(getPlayerData(client).accountData.emailAddress) != toLowerCase(inputText)) {
			logToConsole(LOG_DEBUG|LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to reset their password (email not correct)`);
			return false;
		}

		let passwordResetCode = toUpperCase(generateEmailVerificationCode());
		getPlayerData(client).passwordResetState = VRR_RESETPASS_STATE_CODEINPUT;
		getPlayerData(client).passwordResetCode = passwordResetCode;
		sendPasswordResetEmail(client, passwordResetCode);
		showPlayerResetPasswordCodeInputGUI(client);
		logToConsole(LOG_DEBUG|LOG_WARN, `${getPlayerDisplayForConsole(client)} reset their password. Awaiting verification code input ...`);
	} else if(getPlayerData(client).passwordResetState == VRR_RESETPASS_STATE_CODEINPUT) {
		if(getPlayerData(client).passwordResetCode == toUpperCase(inputText)) {
			getPlayerData(client).passwordResetState = VRR_RESETPASS_STATE_SETPASS;
			showPlayerChangePasswordGUI(client);
			logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} entered the correct reset password verification code. Awaiting new password input ...`);
		} else {
			getPlayerData(client).passwordResetState = VRR_RESETPASS_STATE_NONE;
			disconnectPlayer(client);
			logToConsole(LOG_DEBUG|LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to reset their password (verification code not correct)`);
		}
	}

	return false;
}

// ===========================================================================

function checkAccountChangePassword(client, newPassword, confirmNewPassword) {
	if(!isPlayerLoggedIn(client)) {
		if(getPlayerData(client).passwordResetState != VRR_RESETPASS_STATE_SETPASS) {
			//getPlayerData(client).passwordResetState = VRR_RESETPASS_STATE_NONE;
			//disconnectPlayer(client);
			logToConsole(LOG_DEBUG|LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to change their password (not logged in or not using reset password)`);
			return false;
		}
	}

	//if(isAccountPasswordCorrect(getPlayerData(client).accountData, hashAccountPassword(getPlayerName(client), oldPassword))) {
	//	messagePlayerError(client, `The old password is incorrect!`);
	//	return false;
	//}

	if(!doesPasswordMeetRequirements(newPassword)) {
		let passwordRequirementsString = `${needsCapitals}, ${needsNumbers}, ${needsSymbols}`;
		let needsCapitals = getLocaleString(client, "PasswordNeedsCapitals", "1");
		let needsNumbers = getLocaleString(client, "PasswordNeedsNumbers", "1");
		let needsSymbols = getLocaleString(client, "PasswordNeedsSymbols", "1");

		messagePlayerError(client, getLocaleString(client, "AccountPasswordNeedsImproved"));
		messagePlayerInfo(client, getLocaleString(client, "PasswordNeedsBase", passwordRequirementsString));
		logToConsole(LOG_DEBUG|LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to change their password (password doesn't mean requirements)`);
		return false;
	}

	if(newPassword != confirmNewPassword) {
		messagePlayerError(client, getLocaleString(client, "PasswordsDontMatch"));
		logToConsole(LOG_DEBUG|LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to change their password (password and confirm don't match)`);
		return false;
	}

	getPlayerData(client).accountData.password = hashAccountPassword(getPlayerData(client).accountData.name, newPassword);
	getPlayerData(client).accountData.needsSaved = true;
	getPlayerData(client).passwordResetCode = "";

	saveAccountToDatabase(getPlayerData(client).accountData);

	if(getPlayerData(client).passwordResetState == VRR_RESETPASS_STATE_SETPASS) {
		getPlayerData(client).passwordResetState = VRR_RESETPASS_STATE_NONE;
	}

	messagePlayerSuccess(client, getLocaleString(client, "PasswordChanged"));
	showPlayerLoginGUI(client);
}

// ===========================================================================

function isValidEmailAddress(emailAddress) {
	return true;
}

// ===========================================================================

function saveAllPlayersToDatabase() {
	logToConsole(LOG_DEBUG, "[VRR.Account]: Saving all clients to database ...");
	getClients().forEach(function(client) {
		savePlayerToDatabase(client);
	});
	logToConsole(LOG_DEBUG, "[VRR.Account]: All clients saved to database successfully!");
}

// ===========================================================================

function savePlayerToDatabase(client) {
	if(getPlayerData(client) == null) {
		return false;
	}

	if(!isPlayerLoggedIn(client)) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Account]: Saving client ${getPlayerName(client)} to database ...`);
	saveAccountToDatabase(getPlayerData(client).accountData);

	if(getPlayerData(client).currentSubAccount != -1) {
		//let subAccountData = getPlayerCurrentSubAccount(client);

		if(getPlayerPed(client) != null) {
			if(getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType != VRR_RETURNTO_TYPE_ADMINGET) {
				getPlayerCurrentSubAccount(client).spawnPosition = getPlayerData(client).returnToPosition;
				getPlayerCurrentSubAccount(client).spawnHeading = getPlayerData(client).returnToHeading.z;
				getPlayerCurrentSubAccount(client).interior = getPlayerData(client).returnToInterior;
				getPlayerCurrentSubAccount(client).dimension = getPlayerData(client).returnToDimension;
			} else {
				getPlayerCurrentSubAccount(client).spawnPosition = getPlayerPosition(client);
				getPlayerCurrentSubAccount(client).spawnHeading = getPlayerHeading(client);
				getPlayerCurrentSubAccount(client).interior = getPlayerInterior(client);
				getPlayerCurrentSubAccount(client).dimension = getPlayerDimension(client);
			}
		}

		saveSubAccountToDatabase(getPlayerCurrentSubAccount(client));
	}
	logToConsole(LOG_DEBUG, `[VRR.Account]: Saved client ${getPlayerDisplayForConsole(client)} to database successfully!`);
	return true;
}

// ===========================================================================

function initClient(client) {
	if(isConsole(client)) {
		return false;
	}

	if(doesEntityDataExist(client, "vrr.isInitialized") || getEntityData(client, "vrr.isInitialized") == true) {
		return false;
	}

	setEntityData(client, "vrr.isInitialized", true, false);

	sendPlayerGUIColours(client);
	sendPlayerGUIInit(client);
	updatePlayerSnowState(client);

	showConnectCameraToPlayer(client);

	messageClient(`Please wait ...`, client, getColourByName("softGreen"));

	setTimeout(function() {
		if(client != null) {
			clearChatBox(client);
			let tempAccountData = loadAccountFromName(getPlayerName(client), true);
			let tempSubAccounts = loadSubAccountsFromAccount(tempAccountData.databaseId);

			getServerData().clients[getPlayerId(client)] = new ClientData(client, tempAccountData, tempSubAccounts);

			getServerData().clients[getPlayerId(client)].sessionId = saveConnectionToDatabase(client);
			getServerData().clients[getPlayerId(client)].connectTime = getCurrentUnixTimestamp();
			requestClientInfo(client);

			if(tempAccountData != false) {
				sendPlayerLocaleId(client, getPlayerData(client).accountData.locale);
				if(isAccountAutoIPLoginEnabled(tempAccountData) && getPlayerData(client).accountData.ipAddress == getPlayerIP(client)) {
					messagePlayerAlert(client, getLocaleString(client, "AutoLoggedInIP"));
					loginSuccess(client);
					playRadioStreamForPlayer(client, getServerIntroMusicURL(), true, getPlayerStreamingRadioVolume(client));
				} else {
					if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
						logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the login GUI.`);
						showPlayerLoginGUI(client);
					} else {
						logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the login message (GUI disabled).`);
						messagePlayerNormal(client, getLocaleString(client, "WelcomeBack", getServerName(), getPlayerName(client), "/login"),getColourByName("softGreen"));

						//if(checkForGeoIPModule()) {
						//	let iso = module.geoip.getCountryISO(getPlayerIP(client));
						//	let localeId = getLocaleFromCountryISO(iso);
						//}
						//showGameMessage(client, getLocaleString(client, "LocaleOffer", `/lang ${getLocaleData(localeId)[2]}`), getColourByName("white"), 10000, "Roboto");
					}
					playRadioStreamForPlayer(client, getServerIntroMusicURL(), true, getPlayerStreamingRadioVolume(client));
				}
			} else {
				sendPlayerLocaleId(client, 0);
				if(doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
					logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the register GUI.`);
					showPlayerRegistrationGUI(client);
				} else {
					logToConsole(LOG_DEBUG, `[VRR.Account] ${getPlayerDisplayForConsole(client)} is being shown the register message (GUI disabled).`);
					messagePlayerNormal(client, getLocaleString(client, "WelcomeNewPlayer", getServerName(), getPlayerName(client), "/register"), getColourByName("softGreen"));
				}
				playRadioStreamForPlayer(client, getServerIntroMusicURL(), true, getPlayerStreamingRadioVolume(client));
			}

			getServerData().clients[getPlayerId(client)].keyBinds = loadAccountKeybindsFromDatabase(getServerData().clients[getPlayerId(client)].accountData.databaseId);
			sendAccountKeyBindsToClient(client);


		}

	}, 2500);
}

// ===========================================================================

function saveConnectionToDatabase(client) {
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, getPlayerName(client));
		let dbQueryString = `INSERT INTO conn_main (conn_when_connect, conn_server, conn_script_version, conn_game_version, conn_client_version, conn_name, conn_ip) VALUES (NOW(), ${getServerConfig().databaseId}, '${scriptVersion}', '${getPlayerGameVersion(client)}', '0.0.0', '${safeName}', '${getPlayerIP(client)}')`;
		queryDatabase(dbConnection, dbQueryString);
		return getDatabaseInsertId(dbConnection);
	}
	return 0;
}

// ===========================================================================

function createDefaultAccountServerData(accountDatabaseId) {
	for(let i = 1 ; i <= 5 ; i++) {
		let dbQueryString = `INSERT INTO acct_svr (acct_svr_acct, acct_svr_svr) VALUES (${accountDatabaseId}, ${i})`;
		quickDatabaseQuery(dbQueryString);
	}
}

// ===========================================================================

function loadAccountKeybindsFromDatabase(accountDatabaseID) {
	logToConsole(LOG_DEBUG, `[VRR.Account]: Loading account keybinds for account ${accountDatabaseID} from database ...`);

	let tempAccountKeybinds = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	for(let i in getGlobalConfig().keyBind.defaultKeyBinds) {
		let tempKeyBindData = new KeyBindData(false);
		tempKeyBindData.databaseId = -1;
		tempKeyBindData.key = getKeyIdFromParams(getGlobalConfig().keyBind.defaultKeyBinds[i].keyName);
		tempKeyBindData.commandString = getGlobalConfig().keyBind.defaultKeyBinds[i].commandString;
		tempKeyBindData.keyState = getGlobalConfig().keyBind.defaultKeyBinds[i].keyState;
		tempAccountKeybinds.push(tempKeyBindData);
	}

	if(accountDatabaseID != 0 && typeof accountDatabaseId != "undefined") {
		if(dbConnection) {
			dbQuery = queryDatabase(dbConnection, `SELECT * FROM acct_hotkey WHERE acct_hotkey_enabled = 1 AND acct_hotkey_acct = ${accountDatabaseID} AND acct_hotkey_server = ${getServerId()}`);
			if(dbQuery) {
				if(dbQuery.numRows > 0) {
					while(dbAssoc = fetchQueryAssoc(dbQuery)) {
						let tempAccountKeyBindData = new KeyBindData(dbAssoc);
						tempAccountKeybinds.push(tempAccountKeyBindData);
						logToConsole(LOG_DEBUG, `[VRR.Account]: Account keybind '${tempAccountKeyBindData.databaseId}' (Key ${tempAccountKeyBindData.key} '${toUpperCase(getKeyNameFromId(tempAccountKeyBindData.key))}') loaded from database successfully!`);
					}
				}
				freeDatabaseQuery(dbQuery);
			}
			disconnectFromDatabase(dbConnection);
		}
	}

	logToConsole(LOG_DEBUG, `[VRR.Account]: ${tempAccountKeybinds.length} account keybinds for account ${accountDatabaseID} loaded from database successfully!`);
	return tempAccountKeybinds;
}

// ===========================================================================

function loadAccountStaffNotesFromDatabase(accountDatabaseID) {
	logToConsole(LOG_DEBUG, `[VRR.Account]: Loading account staff notes for account ${accountDatabaseID} from database ...`);

	let tempAccountStaffNotes = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `acct_note` WHERE `acct_note_deleted` = 0 AND `acct_note_acct` = " + toString(accountDatabaseID));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempAccountStaffNoteData = new AccountStaffNoteData(dbAssoc);
					tempAccountStaffNotes.push(tempAccountStaffNoteData);
					logToConsole(LOG_DEBUG, `[VRR.Account]: Account staff note '${tempAccountStaffNoteData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Account]: ${tempAccountStaffNotes.length} account staff notes for account ${accountDatabaseID} loaded from database successfully!`);
	return tempAccountStaffNotes;
}

// ===========================================================================

function loadAccountContactsFromDatabase(accountDatabaseID) {
	logToConsole(LOG_DEBUG, `[VRR.Account]: Loading account contacts for account ${accountDatabaseID} from database ...`);

	let tempAccountContacts = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `acct_contact` WHERE `acct_contact_deleted` = 0 AND `acct_contact_acct` = " + toString(accountDatabaseID));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempAccountContactData = new AccountContactData(dbAssoc);
					tempAccountContacts.push(tempAccountContactData);
					logToConsole(LOG_DEBUG, `[VRR.Account]: Account contact '${tempAccountContactData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Account]: ${tempAccountContacts.length} account contacts for account ${accountDatabaseID} loaded from database successfully!`);
	return tempAccountContacts;
}

// ===========================================================================

function loadAccountMessagesFromDatabase(accountDatabaseID) {
	logToConsole(LOG_DEBUG, `[VRR.Account]: Loading account messages for account ${accountDatabaseID} from database ...`);

	let tempAccountMessages = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `acct_msg` WHERE `acct_msg_deleted` = 0 AND `acct_msg_acct` = " + toString(accountDatabaseID));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempAccountMessageData = new AccountContactData(dbAssoc);
					tempAccountMessages.push(tempAccountMessageData);
					logToConsole(LOG_DEBUG, `[VRR.Account]: Account contact '${tempAccountMessageData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Account]: ${tempAccountMessages.length} account messages for account ${accountDatabaseID} loaded from database successfully!`);
	return tempAccountMessages;
}

// ===========================================================================

function isAccountAutoIPLoginEnabled(accountData) {
	return isAccountSettingFlagEnabled(accountData, getAccountSettingsFlagValue("AutoLoginIP"));
}

// ===========================================================================

function doesPlayerHaveAutoIPLoginEnabled(client) {
	return isAccountAutoIPLoginEnabled(getPlayerData(client).accountData);
}

// ===========================================================================

function doesPlayerHaveGUIEnabled(client) {
	return !isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("NoGUI"));
}

// ===========================================================================

function doesPlayerHaveLogoEnabled(client) {
	return !isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("NoServerLogo"));
}

// ===========================================================================

function doesPlayerHaveAutoSelectLastCharacterEnabled(client) {
	return isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("AutoSelectLastCharacter"));
}

// ===========================================================================

function getPlayerStaffTitle(client) {
	return getPlayerData(client).accountData.staffTitle;
}

// ===========================================================================

function isAccountEmailVerified(accountData) {
	return hasBitFlag(accountData.flags.moderation, getModerationFlagValue("EmailVerified"));
}

// ===========================================================================

function isAccountTwoFactorAuthenticationVerified(accountData) {
	return hasBitFlag(accountData.flags.moderation, getModerationFlagValue("TwoFactorAuthVerified"));
}

// ===========================================================================

function doesPlayerHaveTwoFactorAuthEnabled(client) {
	return hasBitFlag(getPlayerData(client).accountData.settings, getAccountSettingsFlagValue("TwoFactorAuth"));
}

// ===========================================================================

function doesPlayerHaveLoginAlertsEnabled(client) {
	return hasBitFlag(getPlayerData(client).accountData.settings, getAccountSettingsFlagValue("AuthAttemptAlert"));
}

// ===========================================================================

function setAccountEmail(accountData, emailAddress) {
	accountData.emailAddress = emailAddress;
}

// ===========================================================================

function setAccountEmailVerificationCode(accountData, emailVerificationCode) {
	accountData.emailVerificationCode = module.hashing.sha512(emailVerificationCode);
}

// ===========================================================================

function generateEmailVerificationCode() {
	return generateRandomString(10);
}

// ===========================================================================

function sendEmailVerificationEmail(client, emailVerificationCode) {
	let emailBodyText = getEmailConfig().bodyContent.confirmEmail;
	emailBodyText = emailBodyText.replace("{VERIFICATIONCODE}", emailVerificationCode);
	emailBodyText = emailBodyText.replace("{SERVERNAME}", getServerName());

	sendEmail(getPlayerData(client).accountData.emailAddress, getPlayerData(client).accountData.name, `Confirm email on ${getServerName()}`, emailBodyText);
}

// ===========================================================================

function sendPasswordResetEmail(client, verificationCode) {
	let emailBodyText = getEmailConfig().bodyContent.confirmPasswordReset;
	emailBodyText = emailBodyText.replace("{VERIFICATIONCODE}", verificationCode);
	emailBodyText = emailBodyText.replace("{SERVERNAME}", getServerName());

	sendEmail(getPlayerData(client).accountData.emailAddress, getPlayerData(client).accountData.name, `Reset your password on ${getServerName()}`, emailBodyText);
}

// ===========================================================================

function verifyAccountEmail(accountData, verificationCode) {
	let emailVerificationCode = generateRandomString(10);

	let emailBodyText = getEmailConfig().bodyContent.confirmEmail;
	emailBodyText = emailBodyText.replace("{VERIFICATIONCODE}", emailVerificationCode);
	emailBodyText = emailBodyText.replace("{SERVERNAME}", getServerName());

	sendEmail(getPlayerData(client).accountData.emailAddress, getPlayerData(client).accountData.name, `Confirm email on ${getServerName()}`, emailBodyText);

	getPlayerData(client).accountData.emailAddress = emailAddress;
	getPlayerData(client).accountData.emailVerificationCode = module.hashing.sha512(emailVerificationCode);
}

// ===========================================================================

function sendAccountLoginFailedNotification(emailAddress, name, ip, game = getGame()) {
	let countryName = module.geoip.getCountryName(getGlobalConfig().geoIPCountryDatabaseFilePath, ip);
	let subDivisionName = module.geoip.getSubdivisionName(getGlobalConfig().geoIPCityDatabaseFilePath, ip);
	let cityName = module.geoip.getCityName(getGlobalConfig().geoIPCityDatabaseFilePath, ip);

	let emailBodyText = getEmailConfig().bodyContent.accountAuthFailAlert;
	emailBodyText = emailBodyText.replace("{GAMENAME}", getGameName(game));
	emailBodyText = emailBodyText.replace("{IPADDRESS}", ip);
	emailBodyText = emailBodyText.replace("{LOCATION}", `${cityName}, ${subDivisionName}, ${countryName}`);
	emailBodyText = emailBodyText.replace("{SERVERNAME}", getServerName());
	emailBodyText = emailBodyText.replace("{TIMESTAMP}", date.toLocaleString('en-US'));

	sendEmail(emailAddress, name, `Login failed on ${getServerName()}`, emailBodyText);
	return true;
}

// ===========================================================================

function sendAccountLoginSuccessNotification(emailAddress, name, ip, game = getGame()) {
	let countryName = module.geoip.getCountryName(getGlobalConfig().geoIPCountryDatabaseFilePath, ip);
	let subDivisionName = module.geoip.getSubdivisionName(getGlobalConfig().geoIPCityDatabaseFilePath, ip);
	let cityName = module.geoip.getCityName(getGlobalConfig().geoIPCityDatabaseFilePath, ip);

	let emailBodyText = getEmailConfig().bodyContent.accountAuthSuccessAlert;
	emailBodyText = emailBodyText.replace("{GAMENAME}", getGameName(game));
	emailBodyText = emailBodyText.replace("{IPADDRESS}", ip);
	emailBodyText = emailBodyText.replace("{LOCATION}", `${cityName}, ${subDivisionName}, ${countryName}`);
	emailBodyText = emailBodyText.replace("{SERVERNAME}", getServerName());
	emailBodyText = emailBodyText.replace("{TIMESTAMP}", date.toLocaleString('en-US'));

	sendEmail(emailAddress, name, `Login failed on ${getServerName()}`, emailBodyText);
	return true;
}

// ===========================================================================

function isAccountSettingFlagEnabled(accountData, flagValue) {
	return hasBitFlag(accountData.settings, flagValue);
}

// ===========================================================================

function doesPlayerHaveRandomTipsDisabled(client) {
	return isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("NoRandomTips"));
}

// ===========================================================================

function checkPlayerTwoFactorAuthentication(client, authCode) {
	if(getPlayerData(client).twoFactorAuthCode != "") {
		if(toUpperCase(getPlayerData(client).twoFactorAuthCode) == toUpperCase(authCode)) {
			loginSuccess(client);
			return true;
		}
	}

	disconnectPlayer(client);
	return false;
}

// ===========================================================================

function isPlayerATester(client) {

}

// ===========================================================================

function sendAccountTwoFactorAuthCode(emailAddress, name, twoFactorAuthCode) {
	let emailBodyText = getEmailConfig().bodyContent.twoFactorAuthentication;
	emailBodyText = emailBodyText.replace("{2FACODE}", twoFactorAuthCode);
	emailBodyText = emailBodyText.replace("{GAMENAME}", getGameName(getGame()));
	emailBodyText = emailBodyText.replace("{SERVERNAME}", getServerName());

	sendEmail(emailAddress, name, `Login code for ${getServerName()}`, emailBodyText);
	return true;
}

// ===========================================================================