// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: account.js
// DESC: Provides account functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Account Contact Types
const V_CONTACT_NONE = 0;
const V_CONTACT_NEUTRAL = 1;                   // Contact is neutral. Used for general contacts with no special additional features
const V_CONTACT_FRIEND = 2;                    // Contact is a friend. Shows when they're online.
const V_CONTACT_BLOCKED = 3;                   // Contact is blocked. Prevents all communication to/from them except for RP

// ===========================================================================

// Account Authentication Methods
const V_ACCT_AUTHMETHOD_NONE = 0;              // None
const V_ACCT_AUTHMETHOD_EMAIL = 1;             // Email
const V_ACCT_AUTHMETHOD_PHONENUM = 2;          // Phone number
const V_ACCT_AUTHMETHOD_2FA = 3;               // Two factor authentication app (authy, google authenticator, etc)
const V_ACCT_AUTHMETHOD_PEBBLE = 4;            // Pebble watch (this one's for Vortrex but anybody with a Pebble can use)
const V_ACCT_AUTHMETHOD_PHONEAPP = 5;          // The Android/iOS companion app (will initially be a web based thing until I can get the apps created)

// ===========================================================================

// Two-Factor Authentication States
const V_2FA_STATE_NONE = 0;                    // None
const V_2FA_STATE_CODEINPUT = 1;               // Waiting on player to enter code to play
const V_2FA_STATE_SETUP_CODETOAPP = 2;         // Providing player with a code to put in their auth app
const V_2FA_STATE_SETUP_CODEFROMAPP = 3;       // Waiting on player to enter code from auth app to set up

// ===========================================================================

// Reset Password States
const V_RESETPASS_STATE_NONE = 0;             // None
const V_RESETPASS_STATE_CODEINPUT = 1;        // Waiting on player to enter code sent via email
const V_RESETPASS_STATE_SETPASS = 2;          // Waiting on player to enter new password
const V_RESETPASS_STATE_EMAILCONFIRM = 3;	  // Waiting on player to enter email to verify it's correct

// ===========================================================================

/**
 * @class Representing an account, loaded/saved in the database
 */
class AccountData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.password = "";
		this.passwordRevision = 0;
		this.whenRegistered = 0;
		this.flags = {
			moderation: 0,
			admin: 0,
		};
		this.staffTitle = "";
		this.ircAccount = "";
		this.discordAccount = 0;
		this.settings = 0;
		this.seenActionTips = 0;
		this.emailAddress = "";
		this.ipAddress = 0;

		this.notes = [];
		this.messages = [];
		this.contacts = [];
		this.subAccounts = [];

		this.emailVerificationCode = "";
		this.twoFactorAuthVerificationCode = "";

		this.chatScrollLines = 1;

		this.streamingRadioVolume = 20;
		this.locale = 0;

		if (dbAssoc != false) {
			this.databaseId = toInteger(dbAssoc["acct_id"]);
			this.name = toString(dbAssoc["acct_name"]);
			this.password = toString(dbAssoc["acct_pass"]);
			this.passwordRevision = toString(dbAssoc["acct_pass_revision"]);
			this.whenRegistered = toInteger(dbAssoc["acct_when_registered"]);
			this.flags = {
				moderation: toInteger(dbAssoc["acct_svr_mod_flags"]),
				admin: toInteger(dbAssoc["acct_svr_staff_flags"]),
			};
			this.staffTitle = toString(dbAssoc["acct_svr_staff_title"]);
			this.ircAccount = toInteger(dbAssoc["acct_irc"]);
			this.discordAccount = toInteger(dbAssoc["acct_discord"]);
			this.settings = toInteger(dbAssoc["acct_svr_settings"]);
			this.seenActionTips = toInteger(dbAssoc["acct_svr_seen_action_tips"]);
			this.emailAddress = toString(dbAssoc["acct_email"]);
			this.ipAddress = toString(dbAssoc["acct_ip"]);

			this.notes = [];
			this.messages = [];
			this.contacts = [];
			this.subAccounts = [];

			this.emailVerificationCode = toString(dbAssoc["acct_code_verifyemail"]);
			this.twoFactorAuthVerificationCode = toString(dbAssoc["acct_code_2fa"]);
			this.chatScrollLines = toInteger(dbAssoc["acct_svr_chat_scroll_lines"]);
			this.streamingRadioVolume = toInteger(dbAssoc["acct_streaming_radio_volume"]);
			this.locale = toInteger(dbAssoc["acct_locale"]);
		}
	}
};

// ===========================================================================

/**
 * @class Representing an account's contact list, loaded/saved in the database
 */
class AccountContactData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.accountId = 0;
		this.contactAccountId = 0;
		this.type = 0;
		this.whenAdded = 0;
		this.needsSaved = false;

		if (dbAssoc) {
			this.databaseId = dbAssoc["acct_contact_id"];
			this.accountId = dbAssoc["acct_contact_acct"];
			this.contactAccountId = dbAssoc["acct_contact_contact"];
			this.type = dbAssoc["acct_contact_type"];
			this.whenAdded = dbAssoc["acct_contact_when_added"];
		}
	}
};

// ===========================================================================

/**
 * @class Representing an account's messages, loaded/saved in the database
 */
class AccountMessageData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.account = 0;
		this.whoSent = 0;
		this.whenSent = 0;
		this.whenRead = 0;
		this.deleted = false;
		this.whenDeleted = 0;
		this.folder = 0;
		this.message = "";
		this.needsSaved = false;

		if (dbAssoc) {
			this.databaseId = dbAssoc["acct_msg_id"];
			this.account = dbAssoc["acct_msg_acct"];
			this.whoSent = dbAssoc["acct_msg_who_sent"];
			this.whenSent = dbAssoc["acct_msg_when_sent"];
			this.whenRead = dbAssoc["acct_msg_when_read"];
			this.deleted = intToBool(dbAssoc["acct_msg_deleted"]);
			this.whenDeleted = dbAssoc["acct_msg_when_deleted"];
			this.folder = dbAssoc["acct_msg_folder"];
			this.message = dbAssoc["acct_msg_message"];
		}
	}
};

// ===========================================================================

/**
 * @class Representing an account's staff notes. Visible only to staff and loaded/saved in the database
 */
class AccountStaffNoteData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.account = 0;
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.deleted = false;
		this.whenDeleted = 0;
		this.serverId = 0;
		this.note = "";
		this.needsSaved = false;

		if (dbAssoc) {
			this.databaseId = dbAssoc["acct_note_id"];
			this.account = dbAssoc["acct_note_acct"];
			this.whoAdded = dbAssoc["acct_note_who_added"];
			this.whenAdded = dbAssoc["acct_note_when_added"];
			this.deleted = intToBool(dbAssoc["acct_note_deleted"]);
			this.whenDeleted = dbAssoc["acct_note_when_deleted"];
			this.serverId = dbAssoc["acct_note_server"];
			this.note = dbAssoc["acct_note_message"];
		}
	}
};

// ===========================================================================

function initAccountScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Account]: Initializing account script ...");
	logToConsole(LOG_DEBUG, "[V.RP.Account]: Account script initialized!");
}

// ===========================================================================

function loginCommand(command, params, client) {
	if (!isPlayerRegistered(client)) {
		messagePlayerError(client, getLocaleString(client, "NameNotRegistered"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	checkLogin(client, params);
	return true;
}

// ===========================================================================

function toggleAutoLoginByIPCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("AutoLoginIP");

	if (hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
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

	if (hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
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

	if (hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
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

	if (hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
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

	if (doesPlayerHaveGUIEnabled(client)) {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerNormal(client, getLocaleString(client, "GUIAccountSettingToggle", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} has toggled GUI for their account OFF.`);
	} else {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerNormal(client, getLocaleString(client, "GUIAccountSettingToggle", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} has toggled GUI for their account ON.`);
	}

	if (!isPlayerLoggedIn(client)) {
		if (getPlayerData().accountData.databaseId != 0) {
			if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
				showPlayerLoginGUI(client);
				logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login GUI`);
			} else {
				hideAllPlayerGUI(client);
				messagePlayerNormal(client, getLocaleString(client, "WelcomeBack", getServerName(), getPlayerName(client), "{ALTCOLOUR}/login{MAINCOLOUR}"));
				logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login message (GUI disabled)`);
			}
		} else {
			if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
				showPlayerRegistrationGUI(client);
				logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the register GUI`);
			} else {
				hideAllPlayerGUI(client);
				messagePlayerNormal(client, getLocaleString(client, "WelcomeNewPlayer", getServerName(), getPlayerName(client), "{ALTCOLOUR}/register{MAINCOLOUR}"));
				logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the register message (GUI disabled)`);
			}
		}
	}
	return true;
}

// ===========================================================================

function toggleAccountLoginAttemptNotificationsCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("AuthAttemptAlert");

	if (doesPlayerHaveLoginAlertsEnabled(client)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerNormal(client, `⚙️ You turned ${getBoolRedGreenInlineColour(false)}OFF{MAINCOLOUR} notification by email when somebody tries to login to your account`);
		logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} has toggled the login attempt email notifications OFF for their account`);
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerNormal(client, `⚙️ You turned ${getBoolRedGreenInlineColour(true)}ON{MAINCOLOUR} notification by email when somebody tries to login to your account`);
		logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} has toggled the login attempt email notifications OFF for their account`);
	}

	return true;
}

// ===========================================================================

function toggleAccountServerLogoCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("NoServerLogo");

	if (!doesPlayerHaveLogoEnabled(client)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "AccountServerLogoSet", `${getBoolRedGreenInlineColour(true)}${getLocaleString(client, "On")}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} has toggled the server logo ON for their account`);
		if (serverConfig.showLogo) {
			updatePlayerShowLogoState(client, true);
		}
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "AccountServerLogoSet", `${getBoolRedGreenInlineColour(false)}${getLocaleString(client, "Off")}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} has toggled the server logo OFF for their account`);
		updatePlayerShowLogoState(client, false);
	}

	return true;
}

// ===========================================================================

function toggleAccountTwoFactorAuthCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("TwoStepAuth");

	if (getEmailConfig().enabled) {
		if (getPlayerData(client).accountData.emailAddress == "") {
			messagePlayerError(client, getLocaleString(client, "NeedEmailFor2FA"));
			messagePlayerTip(client, getLocaleString(client, "SetEmailHelpTip", `{ALTCOLOUR}/setemail{MAINCOLOUR}`));
			return false;
		}

		if (!doesPlayerHaveEmailVerified(client)) {
			messagePlayerError(client, getLocaleString(client, "NeedEmailVerifiedFor2FA"));
			messagePlayerTip(client, getLocaleString(client, "VerifyEmailHelpTip", `{ALTCOLOUR}/verifyemail{MAINCOLOUR}`));
			return false;
		}
	}

	if (!doesPlayerHaveTwoFactorAuthEnabled(client)) {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "TwoFactorAuthSet", `${getBoolRedGreenInlineColour(true)}${getLocaleString(client, "On")}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} has toggled two-factor authentication ON for their account`);
	} else {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "TwoFactorAuthSet", `${getBoolRedGreenInlineColour(false)}${toUpperCase(getLocaleString(client, "Off"))}{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} has toggled two-factor authentication OFF for their account`);
	}
	return true;
}

// ===========================================================================

function toggleChatBoxTimeStampsCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("ChatBoxTimestamps");

	if (hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "ChatBoxTimestampsToggle", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}{MAINCOLOUR}`));
		sendPlayerChatBoxTimeStampsState(client, false);
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "ChatBoxTimestampsToggle", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}{MAINCOLOUR}`));
		sendPlayerChatBoxTimeStampsState(client, true);
	}
	return true;
}

// ===========================================================================

function toggleAccountProfanityFilterCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("ProfanityFilter");

	if (hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "ProfanityFilterSet", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}{MAINCOLOUR}`));
		sendPlayerProfanityFilterState(client, false);
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "ProfanityFilterSet", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}{MAINCOLOUR}`));
		sendPlayerProfanityFilterState(client, true);
	}
	return true;
}

// ===========================================================================

function toggleAccountReplaceEmojiCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("ChatEmoji");

	if (hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "ChatEmojiSet", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}{MAINCOLOUR}`));
		sendPlayerChatEmojiState(client, false);
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "ChatEmojiSet", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}{MAINCOLOUR}`));
		sendPlayerChatEmojiState(client, true);
	}
	return true;
}

// ===========================================================================

function toggleAccountHideBloodCommand(command, params, client) {
	let flagValue = getAccountSettingsFlagValue("NoBlood");

	if (hasBitFlag(getPlayerData(client).accountData.settings, flagValue)) {
		getPlayerData(client).accountData.settings = removeBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "HideBloodSet", `{softRed}${toUpperCase(getLocaleString(client, "Off"))}{MAINCOLOUR}`));
		sendPlayerChatBoxTimeStampsState(client, false);
	} else {
		getPlayerData(client).accountData.settings = addBitFlag(getPlayerData(client).accountData.settings, flagValue);
		messagePlayerSuccess(client, getLocaleString(client, "HideBloodSet", `{softGreen}${toUpperCase(getLocaleString(client, "On"))}{MAINCOLOUR}`));
		sendPlayerChatBoxTimeStampsState(client, true);
	}
	return true;
}

// ===========================================================================

function registerCommand(command, params, client) {
	if (isPlayerRegistered(client)) {
		messagePlayerError(client, getLocaleString(client, "AccountNameAlreadyRegistered"));
		return false;
	}

	if (areParamsEmpty(params)) {
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
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let oldPassword = getParam(params, " ", 1);
	let newPassword = getParam(params, " ", 2);

	if (isAccountPasswordCorrect(getPlayerData(client).accountData, hashAccountPassword(getPlayerData(client).accountData.name, oldPassword))) {
		messagePlayerError(client, `The old password is invalid!`);
		return false;
	}

	if (!doesPasswordMeetRequirements(newPassword)) {
		messagePlayerError(client, getLocaleString(client, "PasswordNotGoodEnough"));
		messagePlayerInfo(client, getLocaleString(client, "PasswordNeedsBase", `${getLocaleString(client, "PasswordNeedsCapitals", globalConfig.passwordRequiredCapitals)}, ${getLocaleString(client, "PasswordNeedsSymbols", globalConfig.passwordRequiredSymbols)}`));
		return false;
	}

	getPlayerData(client).accountData.password = hashAccountPassword(getPlayerData(client).accountData.name, params);
	messagePlayerSuccess(client, getLocaleString(client, "PasswordChanged"));
}

// ===========================================================================

function setAccountChatScrollLinesCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, getLocaleString(client, "ChatScrollLinesNotNumber"));
		return false;
	}

	if (toInteger(params) < 1 || toInteger(params) > 6) {
		messagePlayerError(client, getLocaleString(client, "ChatScrollLinesMustBeBetween", globalConfig.minChatLines, globalConfig.maxChatLines));
		return false;
	}

	let lines = Math.ceil(toInteger(params));

	getPlayerData(client).accountData.chatScrollLines = lines;
	sendPlayerChatScrollLines(client, lines);
	messagePlayerSuccess(client, getLocaleString(client, "ChatScrollLinesSet", lines));
}

// ===========================================================================

function setAccountChatAutoHideDelayCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
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
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let emailAddress = getParam(params, " ", 1);

	if (!isValidEmailAddress(emailAddress)) {
		messagePlayerError(client, getLocaleString(client, "RegistrationFailedInvalidEmail"));
		return false;
	}

	//if(.emailAddress != "") {
	//	messagePlayerError(client, `Your email is already set!`);
	//	return false;
	//}

	if (getPlayerData(client).accountData.emailAddress != "" && doesPlayerHaveEmailVerified(client)) {
		messagePlayerError(client, getLocaleString(client, "AccountEmailAlreadySetAndVerified"));
		return false;
	}

	setAccountEmail(getPlayerData(client).accountData, emailAddress);

	let emailVerificationCode = generateEmailVerificationCode();
	let hashingFunction = getAccountHashingFunction();
	getPlayerData(client).accountData.emailVerificationCode = hashingFunction(toString(emailVerificationCode));
	sendEmailVerificationEmail(client, emailVerificationCode);

	messagePlayerSuccess(client, getLocaleString(client, "EmailSet"));
	messagePlayerAlert(client, getLocaleString(client, "RegistrationEmailVerifyReminder"));
	messagePlayerAlert(client, getLocaleString(client, "EmailVerificationCodeSent"));
	saveAccountToDatabase(getPlayerData(client).accountData);
}

// ===========================================================================

function verifyAccountEmailCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		if (getPlayerData(client).accountData.emailVerificationCode == "") {
			messagePlayerInfo(client, getLocaleString(client, "EmailVerificationCodeSent"));
			let emailVerificationCode = generateEmailVerificationCode();

			let hashingFunction = getAccountHashingFunction();
			getPlayerData(client).accountData.emailVerificationCode = hashingFunction(toString(emailVerificationCode));
			sendEmailVerificationEmail(client, emailVerificationCode);
			return false;
		}

		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let verificationCode = getParam(params, " ", 1);

	if (doesPlayerHaveEmailVerified(client)) {
		messagePlayerError(client, getLocaleString(client, "AccountEmailAlreadyVerified"));
		return false;
	}

	if (module.hashing.sha512(verificationCode) != getPlayerData(client).accountData.emailVerificationCode) {
		messagePlayerError(client, getLocaleString(client, "InvalidEmailVerificationCode"));
		messagePlayerInfo(client, getLocaleString(client, "EmailVerificationCodeSent"));

		let emailVerificationCode = generateEmailVerificationCode();
		let hashingFunction = getAccountHashingFunction();
		getPlayerData(client).accountData.emailVerificationCode = hashingFunction(toString(emailVerificationCode));

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

function resetActionTipsCommand(command, params, client) {
	getPlayerData(client).promptType = V_PROMPT_RESETACTIONTIPS;
	showPlayerPrompt(client, getLocaleString(client, "ResetActionTipsConfirm"), getLocaleString(client, "GUIWarningTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
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
	messagePlayerError(client, getLocaleString(client, "CommandDisabled"));
	return false;

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let discordName = getParam(params, " ", 1);

	if (!isValidEmailAddress(emailAddress)) {
		messagePlayerError(client, `The discord '${discordName} is not valid!`);
		return false;
	}

	// TO-DO: Command (like /verifydiscord or use this one for second step too) to input verification code sent to email.
	//getPlayerData(client).accountData.emailAddress = emailAddress;
	//messagePlayerSuccess(client, "Your discord account has been attached to your game account!");
}

// ===========================================================================

function isPlayerLoggedIn(client) {
	if (isConsole(client)) {
		return true;
	}

	if (getPlayerData(client) != null) {
		return getPlayerData(client).loggedIn;
	}

	return false;
}

// ===========================================================================

function isPlayerRegistered(client) {
	if (isConsole(client)) {
		return true;
	}

	if (getPlayerData(client).accountData != null) {
		if (getPlayerData(client).accountData.databaseId != 0) {
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
	if (accountData.password == password) {
		return true;
	}

	return false;
}

// ===========================================================================

function loadAccountFromName(accountName, fullLoad = false) {
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		accountName = escapeDatabaseString(dbConnection, accountName);
		let dbQueryString = `SELECT acct_main.*, acct_svr.* FROM acct_main INNER JOIN acct_svr ON acct_svr.acct_svr_acct = acct_main.acct_id AND acct_svr.acct_svr_svr = ${getServerId()} WHERE acct_name = '${accountName}' LIMIT 1;`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			let tempAccountData = new AccountData(dbAssoc[0]);
			if (fullLoad) {
				tempAccountData.messages = loadAccountMessagesFromDatabase(tempAccountData.databaseId);
				tempAccountData.notes = loadAccountStaffNotesFromDatabase(tempAccountData.databaseId);
				tempAccountData.contacts = loadAccountContactsFromDatabase(tempAccountData.databaseId);
			}
			return tempAccountData;
		}
		disconnectFromDatabase(dbConnection);
	}
	return null;
}

// ===========================================================================

function loadAccountFromId(accountId, fullLoad = false) {
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT acct_main.*, acct_svr.* FROM acct_main INNER JOIN acct_svr ON acct_svr.acct_svr_acct = acct_main.acct_id AND acct_svr.acct_svr_svr = ${getServerId()} WHERE acct_id = ${accountId} LIMIT 1;`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			let tempAccountData = new AccountData(dbAssoc[0]);
			if (fullLoad) {
				tempAccountData.messages = loadAccountMessagesFromDatabase(tempAccountData.databaseId);
				tempAccountData.notes = loadAccountStaffNotesFromDatabase(tempAccountData.databaseId);
				tempAccountData.contacts = loadAccountContactsFromDatabase(tempAccountData.databaseId);
			}

			return tempAccountData;
		}
		disconnectFromDatabase(dbConnection);
	}

	return null;
}

// ===========================================================================

function getAccountHashingFunction() {
	switch (toLowerCase(globalConfig.accountPasswordHash)) {
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
	if (accountData != null) {
		if (accountData.databaseId > 0) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function hashAccountPassword(name, password, revision = 0) {
	let hashFunction = getAccountHashingFunction();
	let saltedInfo = saltAccountInfo(name, password, revision);
	return hashFunction(saltedInfo);
}

// ===========================================================================

function saltAccountInfo(name, password, revision = 0) {
	let tempString = getSecurityConfig().accountPasswordSaltAlgorithm[revision];

	tempString = tempString.replace("{NAME}", name);
	tempString = tempString.replace("{PASSWORD}", password);
	tempString = tempString.replace("{SALTHASH}", getSecurityConfig().accountSaltHash[revision]);
	return tempString;
}

// ===========================================================================

function loginSuccess(client) {
	logToConsole(LOG_INFO, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} successfully logged in.`);
	getPlayerData(client).loggedIn = true;

	if (getPlayerData(client).loginTimeout != null) {
		clearTimeout(getPlayerData(client).loginTimeout);
		getPlayerData(client).loginTimeout = null;
	}

	updateConnectionLogOnAuth(client, getPlayerData(client).accountData.databaseId);

	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("Developer")) || doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageServer"))) {
		logToConsole(LOG_WARN, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} has needed permissions and is being given administrator access`);
		setPlayerNativeAdminState(client, true);
	}

	if (doesServerHaveTesterOnlyEnabled()) {
		if (!hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("IsTester"))) {
			setTimeout(function () {
				getPlayerData(client).customDisconnectReason = "NotATester";
				disconnectPlayer(client);
			}, 3500);

			if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
				logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the error GUI (not a tester).`);
				showPlayerErrorGUI(client, getLocaleString(client, "NotATester"), getLocaleString(client, "AccessDenied"));
				return false;
			} else {
				logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the "not a tester" error message (GUI disabled).`);
				messagePlayerError(client, getLocaleString(client, "NotATester"));
				return false;
			}
		}
	}

	if (getPlayerData(client).subAccounts.length == 0) {
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerPrompt(client, getLocaleString(client, "NoCharactersGUIMessage"), getLocaleString(client, "NoCharactersGUIWindowTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
			getPlayerData(client).promptType = V_PROMPT_CREATEFIRSTCHAR;
			logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the no characters prompt GUI`);
		} else {
			messagePlayerAlert(client, getLocaleString(client, "NoCharactersChatMessage", `{ALTCOLOUR}/newchar{MAINCOLOUR}`));
			logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the no characters message (GUI disabled)`);
		}
	} else {
		showCharacterSelectToClient(client);
	}

	getPlayerData(client).accountData.ipAddress = getPlayerIP(client);
	updatePlayerChatBoxStates(client);
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
	if (dbConnection) {
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
			["acct_pass_revision", accountData.passwordRevision],
		];

		let data2 = [
			["acct_svr_settings", (accountData.settings != NaN) ? toInteger(accountData.settings) : 0],
			["acct_svr_seen_action_tips", (accountData.seenActionTips != NaN) ? toInteger(accountData.seenActionTips) : 0],
			["acct_svr_staff_title", toString(safeStaffTitle)],
			["acct_svr_staff_flags", (accountData.flags.admin != NaN) ? toInteger(accountData.flags.admin) : 0],
			["acct_svr_mod_flags", (accountData.flags.moderation != NaN) ? toInteger(accountData.flags.moderation) : 0],
			["acct_svr_chat_scroll_lines", (accountData.chatScrollLines != NaN) ? toInteger(accountData.chatScrollLines) : 1],
			//["acct_svr_chat_auto_hide_delay", accountData.chatAutoHideDelay],
		];

		let queryString1 = createDatabaseUpdateQuery("acct_main", data, `acct_id=${accountData.databaseId}`);
		let dbQuery1 = queryDatabase(dbConnection, queryString1);
		freeDatabaseQuery(dbQuery1);

		let queryString2 = createDatabaseUpdateQuery("acct_svr", data2, `acct_svr_acct=${accountData.databaseId} AND acct_svr_svr=${getServerId()}`);
		let dbQuery2 = queryDatabase(dbConnection, queryString2);
		freeDatabaseQuery(dbQuery2);

		//saveAllAccountCommandAliasesToDatabase(accountData);
		//saveAllAccountStaffNotesToDatabase(accountData);
		//saveAllAccountKeyBindsToDatabase(accountData);

		disconnectFromDatabase(dbConnection);
		return true;
	}
}

// ===========================================================================

function saveAccountKeyBindToDatabase(keyBindData) {
	if (keyBindData.databaseId == -1) {
		// Keybind is a default or temporary keybind, don't save
		return false;
	}

	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeCommandString = escapeDatabaseString(dbConnection, keyBindData.commandString);

		let data = [
			["acct_hotkey_acct", keyBindData.account],
			["acct_hotkey_enabled", boolToInt(keyBindData.enabled)],
			["acct_hotkey_deleted", boolToInt(keyBindData.deleted)],
			["acct_hotkey_cmdstr", safeCommandString],
			["acct_hotkey_key", keyBindData.key],
			["acct_hotkey_down", boolToInt(keyBindData.keyState)],
			["acct_hotkey_when_added", keyBindData.whenAdded],
			["acct_hotkey_server", keyBindData.whenAdded],
		];

		let dbQuery = null;
		if (keyBindData.databaseId == 0) {
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
	if (dbConnection) {
		let safeNoteContent = escapeDatabaseString(dbConnection, staffNoteData.note);

		let data = [
			["acct_note_message", safeNoteContent],
			["acct_note_who_added", staffNoteData.whoAdded],
			["acct_note_when_added", staffNoteData.whenAdded],
			["acct_note_server", staffNoteData.server],
			["acct_note_acct", staffNoteData.account],
		];

		let dbQuery = null;
		if (staffNoteData.databaseId == 0) {
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

function saveAccountCommandAliasesToDatabase(commandAliasData) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeOriginalCommandName = escapeDatabaseString(dbConnection, commandAliasData.forCommand);
		let safeAliasCommandName = escapeDatabaseString(dbConnection, commandAliasData.aliasCommand);

		let data = [
			["acct_cmd_for_cmd", safeOriginalCommandName],
			["acct_cmd_alias_cmd", safeAliasCommandName],
			["acct_cmd_deleted", boolToInt(commandAliasData.whoAdded)],
			["acct_cmd_when_added", commandAliasData.whenAdded],
			["acct_cmd_server", commandAliasData.server],
			["acct_cmd_acct", commandAliasData.account],
		];

		let dbQuery = null;
		if (commandAliasData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("acct_cmd", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			commandAliasData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("acct_cmd", data, `acct_cmd_id=${commandAliasData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		commandAliasData.needsSaved = false;
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

function createAccount(name, password, email = "", passwordRevision = 0) {
	let dbConnection = connectToDatabase();

	if (dbConnection) {
		let hashedPassword = hashAccountPassword(name, password, passwordRevision);
		let safeName = escapeDatabaseString(dbConnection, name);
		let safeEmail = escapeDatabaseString(dbConnection, email);

		queryDatabase(dbConnection, `INSERT INTO acct_main (acct_name, acct_pass, acct_email, acct_when_registered, acct_pass_revision) VALUES ('${safeName}', '${hashedPassword}', '${safeEmail}', UNIX_TIMESTAMP(), ${passwordRevision})`);
		if (getDatabaseInsertId(dbConnection) > 0) {
			let insertId = getDatabaseInsertId(dbConnection);
			createDefaultAccountServerData(insertId);

			let tempAccountData = new AccountData(false);
			tempAccountData.databaseId = insertId;
			tempAccountData.name = name;
			tempAccountData.password = hashedPassword;
			tempAccountData.email = email;
			tempAccountData.passwordRevision = passwordRevision;
			tempAccountData.whenRegistered = getCurrentUnixTimestamp();
			tempAccountData.flags.admin = 0;
			tempAccountData.flags.moderation = 0;
			tempAccountData.settings = globalConfig.defaultEnabledAccountSettings;

			tempAccountData.messages = [];
			tempAccountData.notes = [];
			tempAccountData.contacts = [];
			return tempAccountData;
		}
	}

	return null;
}

// ===========================================================================

function checkLogin(client, password) {
	getPlayerData(client).loginAttemptsRemaining = getPlayerData(client).loginAttemptsRemaining - 1;
	if (getPlayerData(client).loginAttemptsRemaining <= 0) {
		getPlayerData(client).customDisconnectReason = "FailedToLogin";
		disconnectPlayer(client);
	}

	if (isPlayerLoggedIn(client)) {
		logToConsole(LOG_WARN, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} attempted to login but is already logged in`);
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginSuccessGUI(client);
		} else {
			messagePlayerError(client, getLocaleString(client, "AlreadyLoggedIn"));
		}

		return false;
	}

	if (!isPlayerRegistered(client)) {
		logToConsole(LOG_WARN, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} attempted to login but is not registered`);
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerRegistrationGUI(client);
			logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the register GUI`);
		} else {
			messagePlayerError(client, "Your name is not registered! Use /register to make an account.");
			logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the register message (GUI disabled)`);
		}
		return false;
	}

	if (areParamsEmpty(password)) {
		logToConsole(LOG_WARN, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} attempted to login but failed (empty password). ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining`);
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginFailedGUI(client, getLocaleString(client, "LoginFailedInvalidPassword", getPlayerData(client).loginAttemptsRemaining));
			logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login GUI with ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining alert.`);
		} else {
			messagePlayerError(client, getLocaleString(client, "LoginFailedNoPassword", getPlayerData(client).loginAttemptsRemaining));
			logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login message (GUI disabled) with ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining alert.`);
		}

		// Disabling email login alerts for now. It hangs the server for a couple seconds. Need a way to thread it.
		if (doesPlayerHaveEmailVerified(client) && !isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("AuthAttemptAlert"))) {
			sendAccountLoginFailedNotification(getPlayerData(client).accountData.emailAddress, getPlayerName(client), getPlayerIP(client), getGame());
		}
		return false;
	}

	if (!isAccountPasswordCorrect(getPlayerData(client).accountData, hashAccountPassword(getPlayerName(client), password))) {
		logToConsole(LOG_WARN, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} attempted to login but failed (wrong password). ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining`);
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginFailedGUI(client, getLocaleString(client, "LoginFailedInvalidPassword", getPlayerData(client).loginAttemptsRemaining));
			logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login GUI with ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining alert.`);
		} else {
			messagePlayerError(client, getLocaleString(client, "LoginFailedInvalidPassword", getPlayerData(client).loginAttemptsRemaining));
			logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login message (GUI disabled) with ${getPlayerData(client).loginAttemptsRemaining} login attempts remaining alert.`);
		}

		// Disabling email login alerts for now. It hangs the server for a couple seconds. Need a way to thread it.
		if (doesPlayerHaveEmailVerified(client) && !isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("AuthAttemptAlert"))) {
			sendAccountLoginFailedNotification(getPlayerData(client).accountData.emailAddress, getPlayerName(client), getPlayerIP(client), getGame());
		}
		return false;
	}

	if (doesPlayerHaveTwoFactorAuthEnabled(client) && checkForSMTPModule() && getEmailConfig().enabled) {
		//getPlayerData(client).twoFactorAuthCode = toUpperCase(generateRandomString(6));
		getPlayerData(client).twoFactorAuthCode = getRandom(100000, 999999);
		showPlayerTwoFactorAuthenticationGUI(client);
		sendAccountTwoFactorAuthCode(getPlayerData(client).accountData.emailAddress, getPlayerName(client), getPlayerData(client).twoFactorAuthCode);
		return true;
	}

	if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		showPlayerLoginSuccessGUI(client);
	}

	loginSuccess(client);

	// Disabling email login alerts for now. It hangs the server for a couple seconds. Need a way to thread it.
	//if (isAccountEmailVerified(getPlayerData(client).accountData) && !isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("AuthAttemptAlert"))) {
	//	sendAccountLoginSuccessNotification(getPlayerData(client).accountData.emailAddress, getPlayerName(client), getPlayerIP(client), getGame());
	//}
}

// ===========================================================================

function checkRegistration(client, password, confirmPassword = "", emailAddress = "") {
	logToConsole(LOG_DEBUG, `[V.RP.Account]: Checking registration for ${getPlayerName(client)}`);

	if (isPlayerRegistered(client)) {
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginGUI(client);
		} else {
			messagePlayerError(client, getLocaleString(client, "AlreadyRegistered"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (already registered)`);
		}
		return false;
	}

	if (isPlayerLoggedIn(client)) {
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerLoginSuccessGUI(client);
		} else {
			messagePlayerError(client, getLocaleString(client, "AlreadyLoggedIn"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (already logged in)`);
		}
		return false;
	}

	if (areParamsEmpty(password)) {
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedNoPassword"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password is blank)`);
		} else {
			messagePlayerError(client, getLocaleString(client, "RegistrationFailedNoPassword"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password is blank)`);
		}
		return false;
	}

	if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		if (areParamsEmpty(confirmPassword)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedNoPasswordConfirm"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password confirm is blank)`);
			return false;
		}
	}

	if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		if (areParamsEmpty(emailAddress)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedNoEmail"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (email address is blank)`);
			return false;
		}
	}

	if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		if (password != confirmPassword) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedPasswordMismatch"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password and confirm don't match)`);
			return false;
		}
	}

	if (!doesPasswordMeetRequirements(password)) {
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			// Work on this later. Function should return true by default anyway for now.
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedNoPasswordWeak"));
			logToConsole(LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to create an account (password doesn't meet requirements)`);
		} else {
			messagePlayerError(client, getLocaleString(client, "PasswordNotGoodEnough"));
			let passwordRequirements = []
			if (globalConfig.passwordRequiredCapitals > 0) {
				passwordRequirements.push(getLocaleString(client, "PasswordNeedsCapitals", globalConfig.passwordRequiredCapitals))
			}

			if (globalConfig.passwordRequiredNumbers > 0) {
				passwordRequirements.push(getLocaleString(client, "PasswordNeedsNumbers", globalConfig.passwordRequiredNumbers))
			}

			if (globalConfig.passwordRequiredSymbols > 0) {
				passwordRequirements.push(getLocaleString(client, "PasswordNeedsSymbols", globalConfig.passwordRequiredSymbols))
			}
			messagePlayerInfo(client, getLocaleString(client, "PasswordNeedsBase", passwordRequirements.join(", ")));
		}
		return false;
	}

	if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		if (!isValidEmailAddress(emailAddress)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedInvalidEmail"));
			return false;
		}
	}

	let accountData = createAccount(getPlayerName(client), password, emailAddress);
	if (accountData == null) {
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerRegistrationFailedGUI(client, getLocaleString(client, "RegistrationFailedCreateError"));
		} else {
			messagePlayerAlert(client, getLocaleString(client, "RegistrationFailedCreateError"));
		}

		messagePlayerAlert(client, getLocaleString(client, "DevelopersNotified"));
		return false;
	}

	getPlayerData(client).accountData = accountData;
	getPlayerData(client).loggedIn = true;
	getPlayerData(client).accountData.settings = 0;
	getPlayerData(client).accountData.flags.moderation = 0;
	getPlayerData(client).accountData.flags.admin = 0;
	getPlayerData(client).accountData.needsSaved = true;

	messagePlayerSuccess(client, getLocaleString(client, "RegistrationSuccess"));
	logToConsole(LOG_INFO, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} successfully registered their account`);

	if (checkForSMTPModule() && getEmailConfig().enabled) {
		let emailVerificationCode = generateEmailVerificationCode();
		let hashingFunction = getAccountHashingFunction();
		getPlayerData(client).accountData.emailVerificationCode = hashingFunction(toString(emailVerificationCode));

		sendEmailVerificationEmail(client, emailVerificationCode);
		messagePlayerAlert(client, getLocaleString(client, "VerifyEmailHelpTip", `{ALTCOLOUR}/verifyemail{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} was sent a registration email verification code`);
	}

	if (doesServerHaveTesterOnlyEnabled() && !isPlayerATester(client)) {
		setTimeout(function () {
			getPlayerData(client).customDisconnectReason = "NotATester";
			disconnectPlayer(client);
		}, 5000);

		showPlayerError(client, getLocaleString(client, "NotATester"), getLocaleString(client, "AccessDenied"));
		logToConsole(LOG_WARN, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is not a tester. Kicking them from the server ...`);
		return false;
	} else {
		messagePlayerAlert(client, getLocaleString(client, "RegistrationCreateCharReminder"));

		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			//showPlayerRegistrationSuccessGUI(client);
			showPlayerPrompt(client, getLocaleString(client, "NoCharactersGUIMessage"), getLocaleString(client, "NoCharactersGUIWindowTitle"), getLocaleString(client, "Yes"), getLocaleString(client, "No"));
			getPlayerData(client).promptType = V_PROMPT_CREATEFIRSTCHAR;
		} else {
			messagePlayerAlert(client, getLocaleString(client, "NoCharactersChatMessage", `{ALTCOLOUR}/newchar{MAINCOLOUR}`));
		}
		logToConsole(LOG_INFO, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the "no characters" prompt.`);
	}
};

// ===========================================================================

function checkAccountResetPasswordRequest(client, inputText) {
	if (!checkForSMTPModule() || !getEmailConfig().enabled) {
		return false;
	}

	switch (getPlayerData(client).passwordResetState) {
		case V_RESETPASS_STATE_EMAILCONFIRM: {
			if (toLowerCase(getPlayerData(client).accountData.emailAddress) != toLowerCase(inputText)) {
				logToConsole(LOG_INFO | LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to reset their password (email not correct)`);
				showPlayerErrorGUI(client, getLocaleString(client, "GUIErrorResetPasswordFailedInvalidEmail"), getLocaleString(client, "GUIErrorTitle"), getLocaleString(client, "GUIOkButton"));
				return false;
			}

			let passwordResetCode = toUpperCase(toString(generateEmailVerificationCode()));
			getPlayerData(client).passwordResetState = V_RESETPASS_STATE_CODEINPUT;
			getPlayerData(client).passwordResetCode = passwordResetCode;
			showPlayerResetPasswordCodeInputGUI(client);
			sendPasswordResetEmail(client, passwordResetCode);
			logToConsole(LOG_INFO, `${getPlayerDisplayForConsole(client)} submitted successful email for password reset. Sending email and awaiting verification code input (${passwordResetCode}) ...`);
			break;
		}

		case V_RESETPASS_STATE_CODEINPUT: {
			logToConsole(LOG_INFO, `${getPlayerDisplayForConsole(client)} submitted code for password reset (${inputText}) ...`);
			if (inputText != "") {
				if (getPlayerData(client).passwordResetCode == toUpperCase(inputText)) {
					getPlayerData(client).passwordResetState = V_RESETPASS_STATE_SETPASS;
					showPlayerChangePasswordGUI(client);
					logToConsole(LOG_INFO, `${getPlayerDisplayForConsole(client)} entered the correct reset password verification code. Awaiting new password input ...`);
				} else {
					getPlayerData(client).passwordResetAttemptsRemaining = getPlayerData(client).passwordResetAttemptsRemaining - 1;
					logToConsole(LOG_INFO | LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to reset their password (verification code not correct, ${getPlayerData(client).passwordResetAttemptsRemaining} attempts remaining)`);
					if (getPlayerData(client).passwordResetAttemptsRemaining <= 0) {
						logToConsole(LOG_INFO | LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to reset their password (verification code not correct, no more attempts remaining, kicking ...)`);
						getPlayerData(client).customDisconnectReason = "FailedToLogin";
						disconnectPlayer(client);
						return false;
					}
				}
			}
			break;
		}

		case V_RESETPASS_STATE_NONE: {
			logToConsole(LOG_INFO, `${getPlayerDisplayForConsole(client)} requested a password reset. Awaiting email input ...`);
			showPlayerResetPasswordEmailInputGUI(client);
			getPlayerData(client).passwordResetState = V_RESETPASS_STATE_EMAILCONFIRM;
			break;
		}
	}

	return false;
}

// ===========================================================================

function checkAccountChangePassword(client, newPassword, confirmNewPassword) {
	if (!isPlayerLoggedIn(client)) {
		if (getPlayerData(client).passwordResetState != V_RESETPASS_STATE_SETPASS) {
			//getPlayerData(client).passwordResetState = V_RESETPASS_STATE_NONE;
			//disconnectPlayer(client);
			logToConsole(LOG_DEBUG | LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to change their password (not logged in or not using reset password)`);
			return false;
		}
	}

	//if(isAccountPasswordCorrect(getPlayerData(client).accountData, hashAccountPassword(getPlayerName(client), oldPassword))) {
	//	messagePlayerError(client, `The old password is incorrect!`);
	//	return false;
	//}

	if (!doesPasswordMeetRequirements(newPassword)) {
		let passwordRequirementsString = `${needsCapitals}, ${needsNumbers}, ${needsSymbols}`;
		let needsCapitals = getLocaleString(client, "PasswordNeedsCapitals", globalConfig.passwordRequiredCapitals);
		let needsNumbers = getLocaleString(client, "PasswordNeedsNumbers", globalConfig.passwordRequiredNumbers);
		let needsSymbols = getLocaleString(client, "PasswordNeedsSymbols", globalConfig.passwordRequiredSymbols);

		messagePlayerError(client, getLocaleString(client, "AccountPasswordNeedsImproved"));
		messagePlayerInfo(client, getLocaleString(client, "PasswordNeedsBase", passwordRequirementsString));
		logToConsole(LOG_DEBUG | LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to change their password (password doesn't mean requirements)`);
		return false;
	}

	if (newPassword != confirmNewPassword) {
		messagePlayerError(client, getLocaleString(client, "PasswordsDontMatch"));
		logToConsole(LOG_DEBUG | LOG_WARN, `${getPlayerDisplayForConsole(client)} failed to change their password (password and confirm don't match)`);
		return false;
	}

	getPlayerData(client).accountData.password = hashAccountPassword(getPlayerData(client).accountData.name, newPassword);
	getPlayerData(client).accountData.needsSaved = true;
	getPlayerData(client).passwordResetCode = "";

	saveAccountToDatabase(getPlayerData(client).accountData);

	if (getPlayerData(client).passwordResetState == V_RESETPASS_STATE_SETPASS) {
		getPlayerData(client).passwordResetState = V_RESETPASS_STATE_NONE;
	}

	messagePlayerSuccess(client, getLocaleString(client, "PasswordChanged"));
	showPlayerLoginGUI(client);
}

// ===========================================================================

function isValidEmailAddress(emailAddress) {
	if (emailAddress == null || emailAddress == "") {
		return false;
	}

	if (emailAddress.indexOf("@") == -1) {
		return false;
	}

	if (emailAddress.indexOf(".") == -1) {
		return false;
	}

	return true;
}

// ===========================================================================

function saveAllPlayersToDatabase() {
	logToConsole(LOG_DEBUG, "[V.RP.Account]: Saving all clients to database ...");
	getClients().forEach(function (client) {
		savePlayerToDatabase(client);
	});
	logToConsole(LOG_DEBUG, "[V.RP.Account]: All clients saved to database successfully!");
}

// ===========================================================================

function savePlayerToDatabase(client) {
	if (getPlayerData(client) == null) {
		return false;
	}

	if (!isPlayerLoggedIn(client)) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Account]: Saving client ${getPlayerName(client)} to database ...`);
	saveAccountToDatabase(getPlayerData(client).accountData);

	if (getPlayerData(client).currentSubAccount != -1) {
		//let subAccountData = getPlayerCurrentSubAccount(client);

		if (getPlayerPed(client) != null) {
			if (getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType != V_RETURNTO_TYPE_ADMINGET) {
				getPlayerCurrentSubAccount(client).spawnPosition = getPlayerData(client).returnToPosition;
				getPlayerCurrentSubAccount(client).spawnHeading = getPlayerData(client).returnToHeading.z;
				getPlayerCurrentSubAccount(client).interior = getPlayerData(client).returnToInterior;
				getPlayerCurrentSubAccount(client).dimension = getPlayerData(client).returnToDimension;

				if (isMainWorldScene(getPlayerData(client).returnToScene)) {
					getPlayerCurrentSubAccount(client).scene = "V.RP.MAINWORLD";
				}
			} else {
				getPlayerCurrentSubAccount(client).spawnPosition = getPlayerPosition(client);
				getPlayerCurrentSubAccount(client).spawnHeading = getPlayerHeading(client);
				getPlayerCurrentSubAccount(client).interior = getPlayerInterior(client);
				getPlayerCurrentSubAccount(client).dimension = getPlayerDimension(client);

				if (isMainWorldScene(getPlayerCurrentSubAccount(client).scene)) {
					getPlayerCurrentSubAccount(client).scene = "V.RP.MAINWORLD";
				}
			}
		}

		saveSubAccountToDatabase(getPlayerCurrentSubAccount(client));

		for (let i in getPlayerData(client).keyBinds) {
			// keyBinds array is a mix of both default keybinds (set as databaseId -1) and account keybinds. Only save account keybinds.
			if (getPlayerData(client).keyBinds[i].databaseId != -1) {
				saveAccountKeyBindToDatabase(getPlayerData(client).keyBinds[i]);
			}
		}
	}
	logToConsole(LOG_DEBUG, `[V.RP.Account]: Saved client ${getPlayerDisplayForConsole(client)} to database successfully!`);
	return true;
}

// ===========================================================================

function saveConnectionToDatabase(client) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, getPlayerName(client));
		let dbQueryString = `INSERT INTO conn_main (conn_when_connect, conn_server, conn_script_version, conn_game_version, conn_client_version, conn_name, conn_ip) VALUES (NOW(), ${serverConfig.databaseId}, '${scriptVersion}', '${getPlayerGameVersion(client)}', '0.0.0', '${safeName}', '${getPlayerIP(client)}')`;
		queryDatabase(dbConnection, dbQueryString);
		return getDatabaseInsertId(dbConnection);
	}
	return 0;
}

// ===========================================================================

function createDefaultAccountServerData(accountDatabaseId) {
	let dbConnection = connectToDatabase();
	let serversAssoc = fetchQueryAssoc(dbConnection, "SELECT * FROM svr_main");

	let defaultSettings = 0;
	for (let i in globalConfig.defaultEnabledAccountSettings) {
		defaultSettings = addBitFlag(defaultSettings, getAccountSettingsFlagValue(globalConfig.defaultEnabledAccountSettings[i]));
	}

	for (let i in serversAssoc) {
		let dbQueryString = `INSERT INTO acct_svr (acct_svr_acct, acct_svr_svr, acct_svr_settings) VALUES (${accountDatabaseId}, ${serversAssoc[i]["svr_id"]}, ${defaultSettings})`;
		quickDatabaseQuery(dbQueryString);
	}

	disconnectFromDatabase(dbConnection);
}

// ===========================================================================

function loadAccountKeybindsFromDatabase(accountDatabaseId = 0) {
	logToConsole(LOG_DEBUG, `[V.RP.Account]: Loading account keybinds for account ${accountDatabaseId} from database ...`);

	let tempAccountKeybinds = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	for (let i in globalConfig.keyBind.defaultKeyBinds) {
		let tempKeyBindData = new KeyBindData(false);
		tempKeyBindData.databaseId = -1;
		tempKeyBindData.key = getKeyIdFromParams(globalConfig.keyBind.defaultKeyBinds[i].keyName);
		tempKeyBindData.commandString = globalConfig.keyBind.defaultKeyBinds[i].commandString;
		tempKeyBindData.keyState = globalConfig.keyBind.defaultKeyBinds[i].keyState;
		tempAccountKeybinds.push(tempKeyBindData);
	}

	if (accountDatabaseId != 0) {
		if (dbConnection) {
			let dbQueryString = `SELECT * FROM acct_hotkey WHERE acct_hotkey_enabled = 1 AND acct_hotkey_acct = ${accountDatabaseId} AND acct_hotkey_server = ${getServerId()}`;
			dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
			if (dbAssoc.length > 0) {
				for (let i in dbAssoc) {
					let tempAccountKeyBindData = new KeyBindData(dbAssoc[i]);
					tempAccountKeybinds.push(tempAccountKeyBindData);
					logToConsole(LOG_DEBUG, `[V.RP.Account]: Account keybind '${tempAccountKeyBindData.databaseId}' (Key ${tempAccountKeyBindData.key} '${toUpperCase(getKeyNameFromId(tempAccountKeyBindData.key))}') loaded from database successfully!`);
				}
			}
			disconnectFromDatabase(dbConnection);
		}
	}

	logToConsole(LOG_DEBUG, `[V.RP.Account]: ${tempAccountKeybinds.length} account keybinds for account ${accountDatabaseId} loaded from database successfully!`);
	return tempAccountKeybinds;
}

// ===========================================================================

function loadAccountStaffNotesFromDatabase(accountDatabaseID) {
	logToConsole(LOG_DEBUG, `[V.RP.Account]: Loading account staff notes for account ${accountDatabaseID} from database ...`);

	let tempAccountStaffNotes = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = "SELECT * FROM `acct_note` WHERE `acct_note_deleted` = 0 AND `acct_note_acct` = " + toString(accountDatabaseID);
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempAccountStaffNoteData = new AccountStaffNoteData(dbAssoc[i]);
				tempAccountStaffNotes.push(tempAccountStaffNoteData);
				logToConsole(LOG_DEBUG, `[V.RP.Account]: Account staff note '${tempAccountStaffNoteData.databaseId}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Account]: ${tempAccountStaffNotes.length} account staff notes for account ${accountDatabaseID} loaded from database successfully!`);
	return tempAccountStaffNotes;
}

// ===========================================================================

function loadAccountCommandAliasesFromDatabase(accountDatabaseID) {
	logToConsole(LOG_DEBUG, `[V.RP.Account]: Loading account command aliases for account ${accountDatabaseID} from database ...`);

	let tempAccountCommandAliases = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM acct_cmd WHERE acct_cmd_deleted = 0 AND acct_cmd_acct = ${accountDatabaseID}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempAccountCommandAliasData = new AccountCommandAliasData(dbAssoc[i]);
				tempAccountCommandAliases.push(tempAccountCommandAliasData);
				logToConsole(LOG_DEBUG, `[V.RP.Account]: Account command alias '${tempAccountCommandAliasData.databaseId}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Account]: ${tempAccountCommandAliases.length} account command aliases for account ${accountDatabaseID} loaded from database successfully!`);
	return tempAccountCommandAliases;
}

// ===========================================================================

function loadAccountContactsFromDatabase(accountDatabaseID) {
	logToConsole(LOG_DEBUG, `[V.RP.Account]: Loading account contacts for account ${accountDatabaseID} from database ...`);

	let tempAccountContacts = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = "SELECT * FROM `acct_contact` WHERE `acct_contact_deleted` = 0 AND `acct_contact_acct` = " + toString(accountDatabaseID);
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempAccountContactData = new AccountContactData(dbAssoc[i]);
				tempAccountContacts.push(tempAccountContactData);
				logToConsole(LOG_DEBUG, `[V.RP.Account]: Account contact '${tempAccountContactData.databaseId}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Account]: ${tempAccountContacts.length} account contacts for account ${accountDatabaseID} loaded from database successfully!`);
	return tempAccountContacts;
}

// ===========================================================================

function loadAccountMessagesFromDatabase(accountDatabaseID) {
	logToConsole(LOG_DEBUG, `[V.RP.Account]: Loading account messages for account ${accountDatabaseID} from database ...`);

	let tempAccountMessages = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = "SELECT * FROM`acct_msg` WHERE `acct_msg_deleted` = 0 AND`acct_msg_acct` = " + toString(accountDatabaseID);
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempAccountMessageData = new AccountContactData(dbAssoc[i]);
				tempAccountMessages.push(tempAccountMessageData);
				logToConsole(LOG_DEBUG, `[V.RP.Account]: Account contact '${tempAccountMessageData.databaseId}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Account]: ${tempAccountMessages.length} account messages for account ${accountDatabaseID} loaded from database successfully!`);
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
	return hasBitFlag(accountData.flags.moderation || 0, getModerationFlagValue("EmailVerified"));
}

// ===========================================================================

function doesPlayerHaveEmailVerified(client) {
	return hasBitFlag(getPlayerData(client).accountData.flags.moderation || 0, getModerationFlagValue("EmailVerified"));
}

// ===========================================================================

function doesPlayerHaveTwoFactorAuthEnabled(client) {
	return hasBitFlag(getPlayerData(client).accountData.settings, getAccountSettingsFlagValue("TwoStepAuth"));
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

function generateEmailVerificationCode() {
	//return toUpperCase(generateRandomString(6));
	return getRandom(100000, 999999);
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
	let countryName = module.geoip.getCountryName(globalConfig.geoIPCountryDatabaseFilePath, ip);
	let subDivisionName = module.geoip.getSubdivisionName(globalConfig.geoIPCityDatabaseFilePath, ip);
	let cityName = module.geoip.getCityName(globalConfig.geoIPCityDatabaseFilePath, ip);

	let emailBodyText = getEmailConfig().bodyContent.accountAuthFailAlert;
	emailBodyText = emailBodyText.replace("{GAMENAME}", getGameName(game));
	emailBodyText = emailBodyText.replace("{IPADDRESS}", ip);
	emailBodyText = emailBodyText.replace("{LOCATION}", `${cityName}, ${subDivisionName}, ${countryName}`);
	emailBodyText = emailBodyText.replace("{SERVERNAME}", getServerName());
	emailBodyText = emailBodyText.replace("{TIMESTAMP}", new Date().toLocaleString('en-US'));

	sendEmail(emailAddress, name, `Login failed on ${getServerName()}`, emailBodyText);
	return true;
}

// ===========================================================================

function sendAccountLoginSuccessNotification(emailAddress, name, ip, game = getGame()) {
	let countryName = module.geoip.getCountryName(globalConfig.geoIPCountryDatabaseFilePath, ip);
	let subDivisionName = module.geoip.getSubdivisionName(globalConfig.geoIPCityDatabaseFilePath, ip);
	let cityName = module.geoip.getCityName(globalConfig.geoIPCityDatabaseFilePath, ip);

	let emailBodyText = getEmailConfig().bodyContent.accountAuthSuccessAlert;
	emailBodyText = emailBodyText.replace("{GAMENAME}", getGameName(game));
	emailBodyText = emailBodyText.replace("{IPADDRESS}", ip);
	emailBodyText = emailBodyText.replace("{LOCATION}", `${cityName}, ${subDivisionName}, ${countryName}`);
	emailBodyText = emailBodyText.replace("{SERVERNAME}", getServerName());
	emailBodyText = emailBodyText.replace("{TIMESTAMP}", new Date().toLocaleString('en-US'));

	sendEmail(emailAddress, name, `Login successful on ${getServerName()}`, emailBodyText);
	return true;
}

// ===========================================================================

function isAccountSettingFlagEnabled(accountData, flagValue) {
	if (accountData == null) {
		return false;
	}

	return hasBitFlag(accountData.settings, flagValue);
}

// ===========================================================================

function isPlayerAccountSettingEnabled(client, flagName) {
	return hasBitFlag(getPlayerData(client).accountData.settings, getAccountSettingsFlagValue(flagName));
}


// ===========================================================================

function doesPlayerHaveRandomTipsDisabled(client) {
	return isAccountSettingFlagEnabled(getPlayerData(client).accountData, getAccountSettingsFlagValue("NoRandomTips"));
}

// ===========================================================================

function checkPlayerTwoFactorAuthentication(client, authCode) {
	if (getPlayerData(client).twoFactorAuthCode != "") {
		if (toUpperCase(getPlayerData(client).twoFactorAuthCode) == toUpperCase(authCode)) {
			loginSuccess(client);
			return true;
		}
	}

	getPlayerData(client).customDisconnectReason = "FailedToLogin";
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

function startLoginTimeoutForPlayer(client) {
	getPlayerData(client).loginTimeout = setTimeout(function () {
		if (isPlayerLoggedIn(client) == false && getPlayerData(client).passwordResetState == V_RESETPASS_STATE_NONE) {
			getPlayerData(client).customDisconnectReason = "FailedToLogin";
			disconnectPlayer(client);
		}
	}, globalConfig.loginTimeout);
}

// ===========================================================================

function isAccountOnline(accountId) {
	return (serverData.clients.filter(c => c.loggedIn && c.accountData.databaseId == accountId).length > 0);
}

// ===========================================================================