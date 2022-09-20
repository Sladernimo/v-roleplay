// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: subaccount.js
// DESC: Provides subaccount (character) functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================


/**
 * @class Representing a character's (subaccount) data. Loaded and saved in the database
 */
class SubAccountData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.firstName = "John";
		this.lastName = "Doe";
		this.middleName = "Q";
		this.account = 0;
		this.skin = 0;
		this.cash = 0;
		this.spawnPosition = toVector3(0.0, 0.0, 0.0);
		this.spawnHeading = 0.0;
		this.lastLogin = 0;
		this.clan = 0;
		this.clanFlags = 0;
		this.clanRank = 0;
		this.clanTitle = 0;
		this.isWorking = false;
		this.jobUniform = this.skin;
		this.job = 0;
		this.jobIndex = -1;
		this.jobRank = 0;
		this.jobRankIndex = -1;
		this.weapons = [];
		this.inJail = false;
		this.interior = 0;
		this.dimension = 0;
		this.pedScale = toVector3(1.0, 1.0, 1.0);
		this.walkStyle = 0;
		this.fightStyle = 0;
		this.health = 100;
		this.armour = 100;
		this.inHouse = 0;
		this.inBusiness = 0;
		this.accent = "";

		this.bodyParts = {
			hair: [0, 0],
			head: [0, 0],
			upper: [0, 0],
			lower: [0, 0],
		};

		this.bodyProps = {
			hair: [0, 0],
			eyes: [0, 0],
			head: [0, 0],
			leftHand: [0, 0],
			rightHand: [0, 0],
			leftWrist: [0, 0],
			rightWrist: [0, 0],
			hip: [0, 0],
			leftFoot: [0, 0],
			rightFoot: [0, 0],
		};

		if (dbAssoc) {
			this.databaseId = dbAssoc["sacct_id"];
			this.serverId = toInteger(dbAssoc["sacct_server"]);
			this.firstName = dbAssoc["sacct_name_first"];
			this.lastName = dbAssoc["sacct_name_last"];
			this.middleName = dbAssoc["sacct_name_middle"] || "";
			this.account = toInteger(dbAssoc["sacct_acct"]);
			this.skin = toInteger(dbAssoc["sacct_svr_skin"]);
			this.cash = toInteger(dbAssoc["sacct_cash"]);
			this.spawnPosition = toVector3(toFloat(dbAssoc["sacct_pos_x"]), toFloat(dbAssoc["sacct_pos_y"]), toFloat(dbAssoc["sacct_pos_z"]));
			this.spawnHeading = toFloat(dbAssoc["sacct_rot_z"]);
			this.lastLogin = toInteger(dbAssoc["sacct_when_lastlogin"]);
			this.clan = toInteger(dbAssoc["sacct_svr_clan"]);
			this.clanFlags = toInteger(dbAssoc["sacct_svr_clan_flags"]);
			this.clanRank = toInteger(dbAssoc["sacct_svr_clan_rank"]);
			this.clanTitle = toInteger(dbAssoc["sacct_svr_clan_title"]);
			this.job = toInteger(dbAssoc["sacct_svr_job"]);
			this.jobRank = toInteger(dbAssoc["sacct_svr_job_rank"]);
			this.interior = toInteger(dbAssoc["sacct_int"]);
			this.dimension = toInteger(dbAssoc["sacct_vw"]);
			this.pedScale = toVector3(toFloat(dbAssoc["sacct_svr_scale_x"]), toFloat(dbAssoc["sacct_svr_scale_y"]), toFloat(dbAssoc["sacct_svr_scale_z"]));
			this.walkStyle = toInteger(dbAssoc["sacct_svr_walkstyle"]);
			this.fightStyle = toInteger(dbAssoc["sacct_svr_fightstyle"]);
			this.health = toInteger(dbAssoc["sacct_health"]);
			this.armour = toInteger(dbAssoc["sacct_armour"]);
			this.inHouse = toInteger(dbAssoc["sacct_inhouse"]);
			this.inBusiness = toInteger(dbAssoc["sacct_inbusiness"]);
			this.accent = toString(dbAssoc["sacct_accent"]);

			this.bodyParts = {
				hair: [toInteger(dbAssoc["sacct_svr_hd_part_hair_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_part_hair_texture"]) || 0],
				head: [toInteger(dbAssoc["sacct_svr_hd_part_head_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_part_head_texture"]) || 0],
				upper: [toInteger(dbAssoc["sacct_svr_hd_part_upper_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_part_upper_texture"]) || 0],
				lower: [toInteger(dbAssoc["sacct_svr_hd_part_lower_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_part_lower_texture"]) || 0],
			};

			this.bodyProps = {
				hair: [toInteger(dbAssoc["sacct_svr_hd_prop_hair_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_hair_texture"]) || 0],
				eyes: [toInteger(dbAssoc["sacct_svr_hd_prop_eyes_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_eyes_texture"]) || 0],
				head: [toInteger(dbAssoc["sacct_svr_hd_prop_head_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_head_texture"]) || 0],
				leftHand: [toInteger(dbAssoc["sacct_svr_hd_prop_lefthand_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_lefthand_texture"]) || 0],
				rightHand: [toInteger(dbAssoc["sacct_svr_hd_prop_righthand_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_righthand_texture"]) || 0],
				leftWrist: [toInteger(dbAssoc["sacct_svr_hd_prop_leftwrist_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_leftwrist_texture"]) || 0],
				rightWrist: [toInteger(dbAssoc["sacct_svr_hd_prop_rightwrist_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_rightwrist_texture"]) || 0],
				hip: [toInteger(dbAssoc["sacct_svr_hd_prop_hip_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_hip_texture"]) || 0],
				leftFoot: [toInteger(dbAssoc["sacct_svr_hd_prop_leftfoot_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_leftfoot_texture"]) || 0],
				rightFoot: [toInteger(dbAssoc["sacct_svr_hd_prop_rightfoot_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_rightfoot_texture"]) || 0],
			};
		}
	}
};

// ===========================================================================

function initSubAccountScript() {
	logToConsole(LOG_DEBUG, "[AGRP.SubAccount]: Initializing subaccount script ...");
	logToConsole(LOG_INFO, "[AGRP.SubAccount]: SubAccount script initialized!");
}

// ===========================================================================

function loadSubAccountFromName(firstName, lastName) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		firstName = escapeDatabaseString(dbConnection, firstName);
		lastName = escapeDatabaseString(dbConnection, lastName);
		let dbQueryString = `SELECT * FROM sacct_main INNER JOIN sacct_svr ON sacct_svr.sacct_svr_sacct=sacct_main.sacct_id AND sacct_svr.sacct_svr_server=${getServerId()} WHERE sacct_name_first = '${firstName}' AND sacct_name_last = '${lastName}' LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			let dbAssoc = fetchQueryAssoc(dbQuery);
			freeDatabaseQuery(dbQuery);
			return new SubAccountData(dbAssoc);
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function loadSubAccountFromId(subAccountId) {
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM sacct_main INNER JOIN sacct_svr ON sacct_svr.sacct_svr_sacct=sacct_main.sacct_id AND sacct_svr.sacct_svr_server=${getServerId()} WHERE sacct_id = ${subAccountId} LIMIT 1;`;
		let dbQuery = queryDatabase(dbConnection, dbQueryString);
		if (dbQuery) {
			let dbAssoc = fetchQueryAssoc(dbQuery);
			freeDatabaseQuery(dbQuery);
			return new SubAccountData(dbAssoc);
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function loadSubAccountsFromAccount(accountId) {
	let tempSubAccounts = [];
	let dbAssoc = false;
	if (accountId > 0) {
		let dbConnection = connectToDatabase();
		if (dbConnection) {
			let dbQueryString = `SELECT * FROM sacct_main INNER JOIN sacct_svr ON sacct_svr.sacct_svr_sacct=sacct_main.sacct_id AND sacct_svr.sacct_svr_server=${getServerId()} WHERE sacct_acct = ${accountId} AND sacct_server = ${getServerId()}`;
			let dbQuery = queryDatabase(dbConnection, dbQueryString);
			if (dbQuery) {
				while (dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempSubAccount = new SubAccountData(dbAssoc);

					// Make sure skin is valid
					if (tempSubAccount.skin == -1) {
						tempSubAccount.skin = getServerConfig().newCharacter.skin;
					}

					// Check if clan and rank are still valid
					if (tempSubAccount.clan != 0) {
						let clanIndex = getClanIndexFromDatabaseId(tempSubAccount.clan);
						if (!getClanData(clanIndex)) {
							tempSubAccount.clan = 0;
							tempSubAccount.clanRank = 0;
							tempSubAccount.clanIndex = -1;
							tempSubAccount.clanRankIndex = -1;
							tempSubAccount.clanTitle = "";
							tempSubAccount.clanFlags = 0;
						} else {
							let clanRankIndex = getClanRankIndexFromDatabaseId(clanIndex, tempSubAccount.clanRank);
							if (!getClanRankData(clanIndex, clanRankIndex)) {
								let newClanRankIndex = getLowestClanRank(clanIndex);
								tempSubAccount.clanRank = getClanRankData(clanIndex, newClanRankIndex).databaseId
								tempSubAccount.clanRankIndex = newClanRankIndex;
							} else {
								tempSubAccount.clanRankIndex = clanRankIndex;
							}

							tempSubAccount.clanIndex = clanIndex;
						}
					}

					// Check if job and rank are still valid
					if (tempSubAccount.job != 0) {
						let jobIndex = getJobIndexFromDatabaseId(tempSubAccount.job);
						if (!getJobData(jobIndex)) {
							tempSubAccount.job = 0;
							tempSubAccount.jobRank = 0;
							tempSubAccount.jobIndex = -1;
							tempSubAccount.jobRankIndex = -1;
						} else {
							if (getJobData(jobIndex).ranks.length > 0) {
								let jobRankIndex = getJobRankIndexFromDatabaseId(jobIndex, tempSubAccount.jobRank);
								if (!getJobRankData(jobIndex, jobRankIndex)) {
									let newJobRankIndex = getLowestJobRank(jobIndex);
									console.log(`[AGRP.SubAccount]: Job ${jobIndex} has no rank ${tempSubAccount.jobRank}! Using lowest rank ${newJobRankIndex} instead.`);
									tempSubAccount.jobRank = getJobRankData(jobIndex, newJobRankIndex).databaseId;
									tempSubAccount.jobRankIndex = newJobRankIndex;
								} else {
									tempSubAccount.jobRankIndex = jobRankIndex;
								}
							} else {
								tempSubAccount.jobRankIndex = -1;
							}

							tempSubAccount.jobIndex = jobIndex;
						}
					}

					tempSubAccounts.push(tempSubAccount);
				}
				freeDatabaseQuery(dbQuery);
			}
			disconnectFromDatabase(dbConnection);
		}
	}

	return tempSubAccounts;
}

// ===========================================================================

function saveSubAccountToDatabase(subAccountData) {
	let dbConnection = connectToDatabase();

	if (dbConnection) {
		let safeClanTag = escapeDatabaseString(dbConnection, subAccountData.ClanTag);
		let safeClanTitle = escapeDatabaseString(dbConnection, subAccountData.clanTitle);
		let safeFirstName = escapeDatabaseString(dbConnection, subAccountData.firstName);
		let safeLastName = escapeDatabaseString(dbConnection, subAccountData.lastName);
		let safeMiddleName = escapeDatabaseString(dbConnection, subAccountData.middleName);

		let data = [
			//["sacct_svr", getServerId()],
			["sacct_acct", subAccountData.account],
			["sacct_name_first", safeFirstName],
			["sacct_name_last", safeLastName],
			["sacct_name_middle", safeMiddleName],
			["sacct_cash", subAccountData.cash],
			["sacct_when_lastlogin", subAccountData.lastLogin],
			["sacct_pos_x", subAccountData.spawnPosition.x],
			["sacct_pos_y", subAccountData.spawnPosition.y],
			["sacct_pos_z", subAccountData.spawnPosition.z],
			["sacct_rot_z", subAccountData.spawnHeading],
			["sacct_int", subAccountData.interior],
			["sacct_vw", subAccountData.dimension],
			["sacct_health", subAccountData.health],
			["sacct_armour", subAccountData.armour],
			["sacct_accent", subAccountData.accent],
		];

		let dbQuery = null;
		let queryString = createDatabaseUpdateQuery("sacct_main", data, `sacct_id=${subAccountData.databaseId}`);
		dbQuery = queryDatabase(dbConnection, queryString);
		freeDatabaseQuery(dbQuery);

		let data2 = [
			//["sacct_svr_svr", getServerId()],
			["sacct_svr_sacct", subAccountData.databaseId],
			["sacct_svr_job", subAccountData.job],
			//["sacct_svr_job_rank", getServerId()],
			["sacct_svr_clan", subAccountData.clan],
			["sacct_svr_clan_rank", subAccountData.clanRank],
			["sacct_svr_clan_tag", safeClanTag],
			["sacct_svr_clan_title", safeClanTitle],
			["sacct_svr_clan_flags", subAccountData.clanFlags],
			["sacct_svr_scale_x", subAccountData.pedScale.x],
			["sacct_svr_scale_y", subAccountData.pedScale.y],
			["sacct_svr_scale_z", subAccountData.pedScale.z],
			["sacct_svr_skin", subAccountData.skin],
			["sacct_svr_fightstyle", subAccountData.fightStyle],
			["sacct_svr_walkstyle", subAccountData.walkStyle],
			["sacct_svr_hd_part_hair_model", subAccountData.bodyParts.hair[0]],
			["sacct_svr_hd_part_hair_texture", subAccountData.bodyParts.hair[1]],
			["sacct_svr_hd_part_head_model", subAccountData.bodyParts.head[0]],
			["sacct_svr_hd_part_head_texture", subAccountData.bodyParts.head[1]],
			["sacct_svr_hd_part_upper_model", subAccountData.bodyParts.upper[0]],
			["sacct_svr_hd_part_upper_texture", subAccountData.bodyParts.upper[1]],
			["sacct_svr_hd_part_lower_model", subAccountData.bodyParts.lower[0]],
			["sacct_svr_hd_part_lower_texture", subAccountData.bodyParts.lower[1]],
			["sacct_svr_hd_prop_hair_model", subAccountData.bodyProps.hair[0]],
			["sacct_svr_hd_prop_hair_texture", subAccountData.bodyProps.hair[1]],
			["sacct_svr_hd_prop_eyes_model", subAccountData.bodyProps.eyes[0]],
			["sacct_svr_hd_prop_eyes_texture", subAccountData.bodyProps.eyes[1]],
			["sacct_svr_hd_prop_head_model", subAccountData.bodyProps.head[0]],
			["sacct_svr_hd_prop_head_texture", subAccountData.bodyProps.head[1]],
			["sacct_svr_hd_prop_lefthand_model", subAccountData.bodyProps.leftHand[0]],
			["sacct_svr_hd_prop_lefthand_texture", subAccountData.bodyProps.leftHand[1]],
			["sacct_svr_hd_prop_righthand_model", subAccountData.bodyProps.rightHand[0]],
			["sacct_svr_hd_prop_righthand_texture", subAccountData.bodyProps.rightHand[1]],
			["sacct_svr_hd_prop_leftwrist_model", subAccountData.bodyProps.leftWrist[0]],
			["sacct_svr_hd_prop_leftwrist_texture", subAccountData.bodyProps.leftWrist[1]],
			["sacct_svr_hd_prop_rightwrist_model", subAccountData.bodyProps.rightWrist[0]],
			["sacct_svr_hd_prop_rightwrist_texture", subAccountData.bodyProps.rightWrist[1]],
			["sacct_svr_hd_prop_hip_model", subAccountData.bodyProps.hip[0]],
			["sacct_svr_hd_prop_hip_texture", subAccountData.bodyProps.hip[1]],
			["sacct_svr_hd_prop_leftfoot_model", subAccountData.bodyProps.leftFoot[0]],
			["sacct_svr_hd_prop_leftfoot_texture", subAccountData.bodyProps.leftFoot[1]],
			["sacct_svr_hd_prop_rightfoot_model", subAccountData.bodyProps.rightFoot[0]],
			["sacct_svr_hd_prop_rightfoot_texture", subAccountData.bodyProps.rightFoot[1]],
		];

		dbQuery = null;
		queryString = "";
		queryString = createDatabaseUpdateQuery("sacct_svr", data2, `sacct_svr_sacct=${subAccountData.databaseId} AND sacct_svr_server = ${getServerId()}`);
		dbQuery = queryDatabase(dbConnection, queryString);
		freeDatabaseQuery(dbQuery);

		disconnectFromDatabase(dbConnection);
	}
}

// ===========================================================================

function createSubAccount(accountId, firstName, lastName) {
	logToConsole(LOG_DEBUG, `[AGRP.Account] Attempting to create subaccount ${firstName} ${lastName} in database`);

	let dbConnection = connectToDatabase();
	let dbQuery = false;

	if (dbConnection) {
		firstName = fixCharacterName(firstName);
		lastName = fixCharacterName(lastName);
		let safeFirstName = escapeDatabaseString(dbConnection, firstName);
		let safeLastName = escapeDatabaseString(dbConnection, lastName);

		dbQuery = queryDatabase(dbConnection, `INSERT INTO sacct_main (sacct_acct, sacct_name_first, sacct_name_last, sacct_pos_x, sacct_pos_y, sacct_pos_z, sacct_rot_z, sacct_cash, sacct_server, sacct_health, sacct_when_made, sacct_when_lastlogin) VALUES (${accountId}, '${safeFirstName}', '${safeLastName}', ${getServerConfig().newCharacter.spawnPosition.x}, ${getServerConfig().newCharacter.spawnPosition.y}, ${getServerConfig().newCharacter.spawnPosition.z}, ${getServerConfig().newCharacter.spawnHeading}, ${getServerConfig().newCharacter.money}, ${getServerId()}, 100, CURRENT_TIMESTAMP(), 0)`);
		//if(dbQuery) {
		if (getDatabaseInsertId(dbConnection) > 0) {
			let dbInsertId = getDatabaseInsertId(dbConnection);
			createDefaultSubAccountServerData(dbInsertId, getServerConfig().newCharacter.skin);
			let tempSubAccount = loadSubAccountFromId(dbInsertId);
			return tempSubAccount;
		}
		//freeDatabaseQuery(dbQuery);
		//}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function showCharacterSelectToClient(client) {
	getPlayerData(client).switchingCharacter = true;

	if (doesPlayerHaveAutoSelectLastCharacterEnabled(client)) {
		if (getPlayerData(client).subAccounts.length > 0) {
			logToConsole(LOG_DEBUG, `[AGRP.SubAccount] ${getPlayerDisplayForConsole(client)} is being auto-spawned as character ID ${getPlayerLastUsedSubAccount(client)}`);
			selectCharacter(client, getPlayerLastUsedSubAccount(client));
			return true;
		}
	}

	if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
		getPlayerData(client).currentSubAccount = 0;
		logToConsole(LOG_DEBUG, `[AGRP.SubAccount] Setting ${getPlayerDisplayForConsole(client)}'s character to ID ${getPlayerData(client).currentSubAccount}`);
		let tempSubAccount = getPlayerData(client).subAccounts[0];
		let clanName = (tempSubAccount.clan != 0) ? getClanData(getClanIndexFromDatabaseId(tempSubAccount.clan)).name : "None";
		let lastPlayedText = (tempSubAccount.lastLogin != 0) ? `${msToTime(getCurrentUnixTimestamp() - tempSubAccount.lastLogin)} ago` : "Never";
		showPlayerCharacterSelectGUI(client, tempSubAccount.firstName, tempSubAccount.lastName, tempSubAccount.cash, clanName, lastPlayedText, getGameConfig().skins[getGame()][tempSubAccount.skin][0]);

		//spawnPlayer(client, getServerConfig().characterSelectPedPosition, getServerConfig().characterSelectPedHeading, getPlayerCurrentSubAccount(client).skin, getServerConfig().characterSelectInterior, getServerConfig().characterSelectDimension);
		//setTimeout(function() {
		//	showCharacterSelectCameraToPlayer(client);
		//}, 500);
		logToConsole(LOG_DEBUG, `[AGRP.SubAccount] ${getPlayerDisplayForConsole(client)} is being shown the character select GUI`);
	} else {
		let charactersList = getPlayerData(client).subAccounts.map((sacct, index) => `{teal}${index + 1}: {ALTCOLOUR}${sacct.firstName} ${sacct.lastName}`);
		let chunkedList = splitArrayIntoChunks(charactersList, 5);
		messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderCharactersListSelf")));
		for (let i in chunkedList) {
			messagePlayerNormal(client, chunkedList[i].join("{MAINCOLOUR} • "));
		}
		messagePlayerInfo(client, getLocaleString(client, "CharacterSelectHelpText", `{ALTCOLOUR}/usechar{MAINCOLOUR}`, `{ALTCOLOUR}/newchar{MAINCOLOUR}`));
		logToConsole(LOG_DEBUG, `[AGRP.SubAccount] ${getPlayerDisplayForConsole(client)} is being shown the character select/list message (GUI disabled)`);
	}
}

// ===========================================================================

function checkNewCharacter(client, firstName, lastName) {
	if (areParamsEmpty(firstName)) {
		showPlayerNewCharacterFailedGUI(client, "First name cannot be blank!");
		return false;
	}
	firstName = firstName.trim();

	if (areParamsEmpty(lastName)) {
		showPlayerNewCharacterFailedGUI(client, "Last name cannot be blank!");
		return false;
	}
	lastName = lastName.trim();

	if (doesNameContainInvalidCharacters(firstName) || doesNameContainInvalidCharacters(lastName)) {
		logToConsole(LOG_INFO | LOG_WARN, `[AGRP.Account] Subaccount ${firstName} ${lastName} could not be created (invalid characters in name)`);
		showPlayerNewCharacterFailedGUI(client, "Invalid characters in name!");
		return false;
	}

	if (getPlayerData(client).changingCharacterName) {
		getPlayerCurrentSubAccount(client).firstName = fixCharacterName(firstName);
		getPlayerCurrentSubAccount(client).lastName = fixCharacterName(lastName);
		updateAllPlayerNameTags(client);
		hideAllPlayerGUI(client);
		return true;
	}

	let subAccountData = createSubAccount(getPlayerData(client).accountData.databaseId, firstName, lastName);
	if (!subAccountData) {
		if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
			showPlayerNewCharacterFailedGUI(client, "Your character could not be created!");
		} else {
			messagePlayerError(client, "Your character could not be created!");
		}
		messagePlayerAlert(client, `${getServerName()} staff have been notified of the problem and will fix it soon.`);
		return false;
	}

	getPlayerData(client).subAccounts = loadSubAccountsFromAccount(getPlayerData(client).accountData.databaseId);
	getPlayerData(client).currentSubAccount = 0;
	getPlayerData(client).creatingCharacter = false;
	showCharacterSelectToClient(client);
}

// ===========================================================================

function checkPreviousCharacter(client) {
	if (getPlayerData(client).subAccounts.length > 1) {
		if (getPlayerData(client).currentSubAccount <= 0) {
			getPlayerData(client).currentSubAccount = getPlayerData(client).subAccounts.length - 1;
		} else {
			getPlayerData(client).currentSubAccount--;
		}

		let subAccountId = getPlayerData(client).currentSubAccount;
		let tempSubAccount = getPlayerData(client).subAccounts[subAccountId];

		let clanName = (tempSubAccount.clan != 0) ? getClanData(getClanIndexFromDatabaseId(tempSubAccount.clan)).name : "None";
		let lastPlayedText = (tempSubAccount.lastLogin != 0) ? `${msToTime(getCurrentUnixTimestamp() - tempSubAccount.lastLogin)} ago` : "Never";
		showPlayerCharacterSelectGUI(client, tempSubAccount.firstName, tempSubAccount.lastName, tempSubAccount.cash, clanName, lastPlayedText, getGameConfig().skins[getGame()][tempSubAccount.skin][0]);

		logToConsole(LOG_DEBUG, `[AGRP.SubAccount] Setting ${getPlayerDisplayForConsole(client)}'s character to ID ${getPlayerData(client).currentSubAccount}`);
	}
}

// ===========================================================================

function checkNextCharacter(client) {
	if (getPlayerData(client).subAccounts.length > 1) {
		if (getPlayerData(client).currentSubAccount >= getPlayerData(client).subAccounts.length - 1) {
			getPlayerData(client).currentSubAccount = 0;
		} else {
			getPlayerData(client).currentSubAccount++;
		}

		let subAccountId = getPlayerData(client).currentSubAccount;
		let tempSubAccount = getPlayerData(client).subAccounts[subAccountId];

		let clanName = (tempSubAccount.clan != 0) ? getClanData(getClanIndexFromDatabaseId(tempSubAccount.clan)).name : "None";
		let lastPlayedText = (tempSubAccount.lastLogin != 0) ? `${msToTime(getCurrentUnixTimestamp() - tempSubAccount.lastLogin)} ago` : "Never";
		showPlayerCharacterSelectGUI(client, tempSubAccount.firstName, tempSubAccount.lastName, tempSubAccount.cash, clanName, lastPlayedText, getGameConfig().skins[getGame()][tempSubAccount.skin][0]);

		logToConsole(LOG_DEBUG, `[AGRP.SubAccount] Setting ${getPlayerDisplayForConsole(client)}'s character to ID ${getPlayerData(client).currentSubAccount}`);
	}
}

// ===========================================================================

function selectCharacter(client, characterId = -1) {
	logToConsole(LOG_DEBUG, `[AGRP.SubAccount] ${getPlayerDisplayForConsole(client)} character select called (Character ID ${characterId})`);
	if (characterId != -1) {
		logToConsole(LOG_DEBUG, `[AGRP.SubAccount] ${getPlayerDisplayForConsole(client)} provided character ID (${characterId}) to spawn with`);
		getPlayerData(client).currentSubAccount = characterId;
	}

	showPlayerCharacterSelectSuccessGUI(client);

	let spawnPosition = getPlayerCurrentSubAccount(client).spawnPosition;
	let spawnHeading = getPlayerCurrentSubAccount(client).spawnHeading;
	let spawnInterior = getPlayerCurrentSubAccount(client).interior;
	let spawnDimension = getPlayerCurrentSubAccount(client).dimension;
	let skin = getPlayerCurrentSubAccount(client).skin;

	getPlayerData(client).switchingCharacter = false;

	logToConsole(LOG_DEBUG, `[AGRP.SubAccount] Spawning ${getPlayerDisplayForConsole(client)} as character ID ${getPlayerData(client).currentSubAccount} with skin ${skin} (${spawnPosition.x}, ${spawnPosition.y}, ${spawnPosition.z})`);
	//setPlayerCameraLookAt(client, getPosBehindPos(spawnPosition, spawnHeading, 5), spawnPosition);
	getPlayerData(client).pedState = AGRP_PEDSTATE_SPAWNING;

	if (getGame() <= AGRP_GAME_GTA_SA) {
		spawnPlayer(client, spawnPosition, spawnHeading, getGameConfig().skins[getGame()][skin][0], spawnInterior, spawnDimension);
		onPlayerSpawn(client);
	} else if (getGame() == AGRP_GAME_GTA_IV) {
		//spawnPlayer(client, spawnPosition, spawnHeading, getGameConfig().skins[getGame()][skin][0], spawnInterior, spawnDimension);
		clearPlayerWeapons(client);
		setPlayerPosition(client, spawnPosition);
		setPlayerHeading(client, spawnHeading);
		//setPlayerInterior(client, spawnInterior);
		//setPlayerDimension(client, spawnDimension);
		restorePlayerCamera(client);
		setPlayerSkin(client, skin);
		setTimeout(function () {
			onPlayerSpawn(client);
			//stopRadioStreamForPlayer(client);
		}, 500);
	} else if (getGame() == AGRP_GAME_MAFIA_ONE) {
		//spawnPlayer(client, spawnPosition, spawnHeading, getGameConfig().skins[getGame()][skin][0]);
		//logToConsole(LOG_DEBUG, `[AGRP.SubAccount] Spawning ${getPlayerDisplayForConsole(client)} as ${getGameConfig().skins[getGame()][skin][1]} (${getGameConfig().skins[getGame()][skin][0]})`);
		spawnPlayer(client, spawnPosition, spawnHeading, getGameConfig().skins[getGame()][skin][0]);
		onPlayerSpawn(client);
	}

	removePlayerKeyBind(client, getKeyIdFromParams("insert"));

	logToConsole(LOG_DEBUG, `[AGRP.SubAccount] Spawned ${getPlayerDisplayForConsole(client)} as character ID ${getPlayerData(client).currentSubAccount} with skin ${skin} (${spawnPosition.x}, ${spawnPosition.y}, ${spawnPosition.z})`);

	getPlayerCurrentSubAccount(client).lastLogin = getCurrentUnixTimestamp();
}

// ===========================================================================

function switchCharacterCommand(command, params, client) {
	logToConsole(LOG_DEBUG, `[AGRP.SubAccount] ${getPlayerDisplayForConsole(client)} is requesting to switch characters (current character: ${getCharacterFullName(client)} [${getPlayerData(client).currentSubAccount}/${getPlayerCurrentSubAccount(client).databaseId}])`);
	if (!isPlayerSpawned(client)) {
		logToConsole(LOG_WARN, `[AGRP.SubAccount] ${getPlayerDisplayForConsole(client)} is not allowed to switch characters (not spawned)`);
		return false;
	}

	if (isPlayerSwitchingCharacter(client)) {
		logToConsole(LOG_WARN, `[AGRP.SubAccount] ${getPlayerDisplayForConsole(client)} is not allowed to switch characters (already in switch char mode)`);
		messagePlayerError(client, "You are already selecting/switching characters!");
		return false;
	}

	forcePlayerIntoSwitchCharacterScreen(client);
}

// ===========================================================================

function newCharacterCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let firstName = getParam(params, " ", 1);
	let lastName = getParam(params, " ", 2);

	checkNewCharacter(client, firstName, lastName);
}

// ===========================================================================

function useCharacterCommand(command, params, client) {
	if (!getPlayerData(client).switchingCharacter) {
		messagePlayerError(client, "Use /switchchar to save this character and return to the characters screen first!");
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let characterId = toInteger(params) || 1;

	selectCharacter(client, characterId - 1);
}

// ===========================================================================

function getPlayerLastUsedSubAccount(client) {
	let subAccounts = getPlayerData(client).subAccounts;
	let lastUsed = 0;
	for (let i in subAccounts) {
		if (subAccounts[i].lastLogin > subAccounts[lastUsed].lastLogin) {
			lastUsed = i;
		}
	}
	return lastUsed;
}

// ===========================================================================

function transferCharacterToServer(subAccountDatabaseId, newServerId) {
	quickDatabaseQuery(`UPDATE sacct_main SET sacct_server = ${newServerId}, sacct_skin = ${loadServerConfigFromId(newServerId).newCharacter.skin} WHERE sacct_id = ${subAccountDatabaseId} LIMIT 1;`);
}

// ===========================================================================

function getCharacterFullName(client) {
	return `${getPlayerCurrentSubAccount(client).firstName} ${getPlayerCurrentSubAccount(client).lastName}`;
}

// ===========================================================================

function isPlayerSwitchingCharacter(client) {
	return getPlayerData(client).switchingCharacter;
}

// ===========================================================================

function isPlayerCreatingCharacter(client) {
	return false; //getPlayerData(client).creatingCharacter;
}

// ===========================================================================

/**
 *
 * @return {SubAccountData} - The player's current subaccount/character data
 *
 */
function getPlayerCurrentSubAccount(client) {
	if (!getPlayerData(client)) {
		return false;
	}

	let subAccountId = getPlayerData(client).currentSubAccount;
	if (subAccountId == -1) {
		return false;
	}

	if (typeof getPlayerData(client).subAccounts[subAccountId] == "undefined") {
		return false;
	}

	return getPlayerData(client).subAccounts[subAccountId];
}

// ===========================================================================

function getClientSubAccountName(client) {
	let subAccountData = getPlayerCurrentSubAccount(client);
	return `${subAccountData.firstName} ${subAccountData.lastName}`;
}

// ===========================================================================

function setFightStyleCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let fightStyleId = getFightStyleFromParams(params);

	if (!fightStyle) {
		messagePlayerError(client, `That fight style doesn't exist!`);
		messagePlayerError(client, `Fight styles: ${getGameConfig().fightStyles[getGame()].map(fs => fs[0]).join(", ")}`);
		return false;
	}

	if (!isPlayerAtGym(client)) {
		if (!doesPlayerHaveStaffPermission(client, getStaffFlagValue("BasicModeration"))) {
			messagePlayerError(client, `You need to be at a gym!`);
			return false
		}
	}

	setPlayerFightStyle(client, fightStyleId);
	messagePlayerSuccess(client, `Your fight style has been set to ${getGameConfig().fightStyles[getGame()][fightStyleId][0]}`)

	return true;
}

// ===========================================================================

function createDefaultSubAccountServerData(databaseId, thisServerSkin) {
	for (let i = 1; i <= 5; i++) {
		if (i == getServerId()) {
			let dbQueryString = `INSERT INTO sacct_svr (sacct_svr_sacct, sacct_svr_server, sacct_svr_skin) VALUES (${databaseId}, ${i}, ${thisServerSkin})`;
			quickDatabaseQuery(dbQueryString);
		} else {
			let dbQueryString = `INSERT INTO sacct_svr (sacct_svr_sacct, sacct_svr_server, sacct_svr_skin) VALUES (${databaseId}, ${i}, -1)`;
			quickDatabaseQuery(dbQueryString);
		}
	}
}

// ===========================================================================

function forcePlayerIntoSwitchCharacterScreen(client) {
	getPlayerCurrentSubAccount(client).spawnPosition = getPlayerPosition(client);
	getPlayerCurrentSubAccount(client).spawnHeading = getPlayerHeading(client);
	getPlayerCurrentSubAccount(client).health = getPlayerHealth(client);

	if (isGameFeatureSupported("dimension")) {
		getPlayerCurrentSubAccount(client).dimension = getPlayerDimension(client);
	} else {
		getPlayerCurrentSubAccount(client).dimension = 0;
	}

	if (isGameFeatureSupported("interior")) {
		getPlayerCurrentSubAccount(client).interior = getPlayerInterior(client);
	} else {
		getPlayerCurrentSubAccount(client).interior = 0;
	}

	if (isGameFeatureSupported("pedArmour")) {
		getPlayerCurrentSubAccount(client).armour = getPlayerArmour(client);
	} else {
		getPlayerCurrentSubAccount(client).armour = 0;
	}

	logToConsole(client, `Saving ${getPlayerDisplayForConsole(client)}'s subaccount (${getCharacterFullName(client)} [${getPlayerData(client).currentSubAccount}/${getPlayerCurrentSubAccount(client).databaseId}] to database`)
	saveSubAccountToDatabase(getPlayerCurrentSubAccount(client));

	disableCityAmbienceForPlayer(client);

	resetClientStuff(client);

	getPlayerData(client).switchingCharacter = true;

	showConnectCameraToPlayer(client);

	showCharacterSelectToClient(client);
}

// ===========================================================================