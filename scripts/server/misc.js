// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: misc.js
// DESC: Provides any uncategorized functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Pickup Types
const AGRP_PICKUP_NONE = 0;
const AGRP_PICKUP_JOB = 1;
const AGRP_PICKUP_BUSINESS_ENTRANCE = 2;
const AGRP_PICKUP_BUSINESS_EXIT = 3;
const AGRP_PICKUP_HOUSE_ENTRANCE = 4;
const AGRP_PICKUP_HOUSE_EXIT = 5;
const AGRP_PICKUP_EXIT = 6;

// ===========================================================================

// Blip Owner Types
const AGRP_BLIP_NONE = 0;
const AGRP_BLIP_JOB = 1;
const AGRP_BLIP_BUSINESS_ENTRANCE = 2;
const AGRP_BLIP_BUSINESS_EXIT = 3;
const AGRP_BLIP_HOUSE_ENTRANCE = 4;
const AGRP_BLIP_HOUSE_EXIT = 5;
const AGRP_BLIP_EXIT = 6;

// ===========================================================================

// Ped States
const AGRP_PEDSTATE_NONE = 0;                     // None
const AGRP_PEDSTATE_READY = 1;                    // Ready
const AGRP_PEDSTATE_DRIVER = 2;                   // Driving a vehicle
const AGRP_PEDSTATE_PASSENGER = 3;                // In a vehicle as passenger
const AGRP_PEDSTATE_DEAD = 4;                     // Dead
const AGRP_PEDSTATE_ENTERINGPROPERTY = 5;         // Entering a property
const AGRP_PEDSTATE_EXITINGPROPERTY = 6;          // Exiting a property
const AGRP_PEDSTATE_ENTERINGVEHICLE = 7;          // Entering a vehicle
const AGRP_PEDSTATE_EXITINGVEHICLE = 8;           // Exiting a vehicle
const AGRP_PEDSTATE_BINDED = 9;                   // Binded by rope or handcuffs
const AGRP_PEDSTATE_TAZED = 10;                   // Under incapacitating effect of tazer
const AGRP_PEDSTATE_INTRUNK = 11;                 // In vehicle trunk
const AGRP_PEDSTATE_INITEM = 12;                  // In item (crate, box, etc)
const AGRP_PEDSTATE_HANDSUP = 13;                 // Has hands up (surrendering)
const AGRP_PEDSTATE_SPAWNING = 14;                // Spawning

// Property Types
const AGRP_PROPERTY_TYPE_NONE = 0;				  // None
const AGRP_PROPERTY_TYPE_BUSINESS = 1;			  // Business
const AGRP_PROPERTY_TYPE_HOUSE = 2;				  // House

// ===========================================================================

function initMiscScript() {
	logToConsole(LOG_DEBUG, "[AGRP.Misc]: Initializing misc script ...");
	logToConsole(LOG_INFO, "[AGRP.Misc]: Misc script initialized successfully!");
	return true;
}

// ===========================================================================

function getPositionCommand(command, params, client) {
	let position = getPlayerPosition(client);

	messagePlayerNormal(client, `Your position is: ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`);
	logToConsole(LOG_INFO, `${getPlayerDisplayForConsole(client)}'s position is: ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`);
	return true;
}

// ===========================================================================

function toggleMouseCursorCommand(command, params, client) {
	sendPlayerMouseCursorToggle(client);
	return true;
}

// ===========================================================================

function suicideCommand(command, params, client) {
	if (!isPlayerSpawned(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeSpawned"));
		return false;
	}

	if (isPlayerSurrendered(client)) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (isPlayerRestrained(client)) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).inJail) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (isPlayerInPaintBall(client)) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (isPlayerInAnyVehicle(client)) {
		removePlayerFromVehicle(client);
	}

	processPlayerDeath(client);
	return true;
}

// ===========================================================================

function toggleMouseCameraCommand(command, params, client) {
	if (getGame() != AGRP_GAME_GTA_VC) {
		sendPlayerMouseCameraToggle(client);
	}
	return true;
}

// ===========================================================================

function setNewCharacterSpawnPositionCommand(command, params, client) {
	let position = getPlayerPosition(client);
	let heading = getPlayerHeading(client);

	getServerConfig().newCharacter.spawnPosition = position;
	getServerConfig().newCharacter.spawnHeading = heading;
	getServerConfig().needsSaved = true;

	messagePlayerNormal(client, `The new character spawn position has been set to ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`)
	return true;
}

// ===========================================================================

function setNewCharacterMoneyCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let amount = toInteger(getParam(params, " ", 1)) || 1000;

	getServerConfig().newCharacter.cash = amount;
	getServerConfig().needsSaved = true;

	messagePlayerNormal(client, `The new character money has been set to ${getCurrencyString(amount)}`);
	return true;
}

// ===========================================================================

function setNewCharacterSkinCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let skinId = getSkinModelIndexFromParams(params);

	getServerConfig().newCharacter.skin = skinId;
	getServerConfig().needsSaved = true;

	messagePlayerNormal(client, `The new character skin has been set to ${getSkinNameFromModel(skinId)} (Index ${skinId})`);
	return true;
}

// ===========================================================================

function submitIdeaCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	submitIdea(client, params);

	messagePlayerNormal(client, `Your suggestion/idea has been sent to the developers!`);
	return true;
}

// ===========================================================================

function submitBugReportCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	submitBugReport(client, params);

	messagePlayerNormal(client, `Your bug report has been sent to the developers!`);
	return true;
}

// ===========================================================================

function enterExitPropertyCommand(command, params, client) {
	let closestProperty = null;
	let isEntrance = false;
	let isBusiness = false;

	// Make sure they aren't already trying to enter/exit a property
	if (getPlayerData(client).pedState == AGRP_PEDSTATE_ENTERINGPROPERTY || getPlayerData(client).pedState == AGRP_PEDSTATE_EXITINGPROPERTY) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	// The player's currentPickup wasn't always being set. This prevented entering/exiting a property.
	// Needs further testing and tweaks.
	if (!getPlayerData(client).currentPickup) {
		let ownerType = getEntityData(getPlayerData(client).currentPickup, "agrp.owner.type");
		let ownerId = getEntityData(getPlayerData(client).currentPickup, "agrp.owner.id");

		switch (ownerType) {
			case AGRP_PICKUP_BUSINESS_ENTRANCE:
				isBusiness = true;
				isEntrance = true;
				closestProperty = getServerData().businesses[ownerId];
				break;

			case AGRP_PICKUP_BUSINESS_EXIT:
				isBusiness = true;
				isEntrance = false;
				closestProperty = getServerData().businesses[ownerId];
				break;

			case AGRP_PICKUP_HOUSE_ENTRANCE:
				isBusiness = false;
				isEntrance = true;
				closestProperty = getServerData().houses[ownerId];
				break;

			case AGRP_PICKUP_HOUSE_EXIT:
				isBusiness = false;
				isEntrance = false;
				closestProperty = getServerData().houses[ownerId];
				break;

			default:
				return false;
		}
	}

	// Check businesses first
	if (closestProperty == null) {
		let businessIndex = getClosestBusinessEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getBusinessData(businessIndex).entrancePosition, getPlayerPosition(client)) <= 1.5) {
			isBusiness = true;
			isEntrance = true;
			closestProperty = getServerData().businesses[businessIndex];
		}
	}

	if (closestProperty == null) {
		let businessIndex = getClosestBusinessExit(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getBusinessData(businessIndex).exitPosition, getPlayerPosition(client)) <= 1.5) {
			isBusiness = true;
			isEntrance = false;
			closestProperty = getServerData().businesses[businessIndex];
		}
	}

	// Check houses second
	if (closestProperty == null) {
		let houseIndex = getClosestHouseEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getHouseData(houseIndex).entrancePosition, getPlayerPosition(client)) <= 1.5) {
			isBusiness = false;
			isEntrance = true;
			closestProperty = getServerData().houses[houseIndex];
		}
	}

	if (closestProperty == null) {
		let houseIndex = getClosestHouseExit(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getHouseData(houseIndex).exitPosition, getPlayerPosition(client)) <= 1.5) {
			isBusiness = false;
			isEntrance = false;
			closestProperty = getServerData().houses[houseIndex];
		}
	}

	if (closestProperty == null) {
		logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s closest door is null`);
		return false;
	}

	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s closest door is ${(isBusiness) ? closestProperty.name : closestProperty.description} ${(isEntrance) ? "entrance" : "exit"}`);

	let englishId = getLocaleFromParams("English");
	let typeString = (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House");
	let nameString = (isBusiness) ? closestProperty.name : closestProperty.description;

	if (isEntrance) {
		if (getDistance(closestProperty.entrancePosition, getPlayerPosition(client)) <= getGlobalConfig().enterPropertyDistance) {
			if (closestProperty.locked) {
				meActionToNearbyPlayers(client, getLocaleString(client, "EnterExitPropertyDoorLocked", (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House")));
				return false;
			}

			if (!closestProperty.hasInterior) {
				messagePlayerAlert(client, getLocaleString(client, "PropertyNoInterior", (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House")));
				return false;
			}

			clearPlayerStateToEnterExitProperty(client);
			getPlayerData(client).pedState = AGRP_PEDSTATE_ENTERINGPROPERTY;
			getPlayerData(client).enteringExitingProperty = [(isBusiness) ? AGRP_PROPERTY_TYPE_BUSINESS : AGRP_PROPERTY_TYPE_HOUSE, closestProperty.index];

			meActionToNearbyPlayers(client, getLanguageLocaleString(englishId, "EntersProperty", typeString, nameString));

			if (closestProperty.exitScene != "" && isGameFeatureSupported("interiorScene")) {
				getPlayerCurrentSubAccount(client).spawnPosition = closestProperty.exitPosition;
				if (isMainWorldScene(closestProperty.exitScene) || closestProperty.exitScene == "AGRP.MAINWORLD") {
					setPlayerScene(client, getGameConfig().mainWorldScene[getGame()]);
				} else {
					setPlayerScene(client, closestProperty.exitScene);
				}
				return false;
			}

			if (isFadeCameraSupported()) {
				fadeCamera(client, false, 1.0);
			}

			setTimeout(function () {
				processPlayerEnteringExitingProperty(client);
			}, 1100);
			return true;
		}
	} else {
		if (getDistance(closestProperty.exitPosition, getPlayerPosition(client)) <= getGlobalConfig().exitPropertyDistance) {
			if (closestProperty.locked) {
				meActionToNearbyPlayers(client, getLocaleString(client, "EnterExitPropertyDoorLocked", (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House")));
				return false;
			}

			clearPlayerStateToEnterExitProperty(client);
			getPlayerData(client).pedState = AGRP_PEDSTATE_EXITINGPROPERTY;
			getPlayerData(client).enteringExitingProperty = [(isBusiness) ? AGRP_PROPERTY_TYPE_BUSINESS : AGRP_PROPERTY_TYPE_HOUSE, closestProperty.index];

			meActionToNearbyPlayers(client, getLanguageLocaleString(englishId, "ExitsProperty", typeString, nameString));

			if (closestProperty.entranceScene != "" && isGameFeatureSupported("interiorScene")) {
				getPlayerCurrentSubAccount(client).spawnPosition = closestProperty.entrancePosition;
				if (isMainWorldScene(closestProperty.entranceScene) || closestProperty.entranceScene == "AGRP.MAINWORLD") {
					setPlayerScene(client, getGameConfig().mainWorldScene[getGame()]);
				} else {
					setPlayerScene(client, closestProperty.entranceScene);
				}

				return false;
			}

			if (isFadeCameraSupported()) {
				fadeCamera(client, false, 1.0);
			}

			setTimeout(function () {
				processPlayerEnteringExitingProperty(client);
			}, 1100);
		}
	}
	//logToConsole(LOG_DEBUG, `[AGRP.Misc] ${getPlayerDisplayForConsole(client)} exited business ${inBusiness.name}[${inBusiness.index}/${inBusiness.databaseId}]`);
	return true;
}

// ===========================================================================

function getPlayerInfoCommand(command, params, client) {
	let targetClient = client;

	if (!areParamsEmpty(params)) {
		if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("BasicModeration"))) {
			targetClient = getPlayerFromParams(params);

			if (!targetClient) {
				messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
				return false;
			}
		}
	}

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerInfo", `${getPlayerName(client)} - ${getCharacterFullName(targetClient)}`)));

	let clanIndex = getClanIndexFromDatabaseId(getPlayerCurrentSubAccount(targetClient).clan);
	let clanRankIndex = getClanRankIndexFromDatabaseId(clanIndex, getPlayerCurrentSubAccount(targetClient).clanRank);
	let clanData = getClanData(clanIndex);
	let clanRankData = getClanRankData(clanIndex, clanRankIndex);

	let jobIndex = getPlayerCurrentSubAccount(targetClient).jobIndex;
	let jobRankIndex = getPlayerCurrentSubAccount(targetClient).jobRankIndex;
	let jobData = getJobData(jobIndex);

	let jobRankText = "(Rank: None)";
	if (jobRankIndex != -1) {
		let jobRankData = getJobRankData(jobIndex, jobRankIndex);
		jobRankText = `(Rank ${jobRankData.level}: ${jobRankData.name}{mediumGrey}[${jobRankData.databaseId}]{ALTCOLOUR})`;
	}

	let clan = (getPlayerCurrentSubAccount(targetClient).clan != 0) ? `{ALTCOLOUR}${clanData.name}{mediumGrey}[${clanData.databaseId}]{ALTCOLOUR} (Rank ${clanRankData.level}: ${clanRankData.name}{mediumGrey}[${clanRankData.databaseId}]{ALTCOLOUR})` : `None`;
	let job = (getPlayerCurrentSubAccount(targetClient).jobIndex != -1) ? `{ALTCOLOUR}${jobData.name}{mediumGrey}[${jobData.databaseId}]{ALTCOLOUR} ${jobRankText}` : `None`;
	let skinIndex = getPlayerCurrentSubAccount(targetClient).skin;
	let skinModel = getGameConfig().skins[getGame()][skinIndex][0];
	let skinName = getSkinNameFromModel(skinModel);
	let registerDate = new Date(getPlayerData(targetClient).accountData.registerDate * 1000);
	let currentDate = new Date();

	let tempStats = [
		["Account", `${getPlayerData(targetClient).accountData.name}{mediumGrey}[${getPlayerData(targetClient).accountData.databaseId}]{ALTCOLOUR}`],
		["Character", `${getCharacterFullName(targetClient)}{mediumGrey}[${getPlayerCurrentSubAccount(targetClient).databaseId}]{ALTCOLOUR}`],
		["Connected", `${getTimeDifferenceDisplay(getCurrentUnixTimestamp(), getPlayerData(targetClient).connectTime)} ago`],
		["Registered", `${registerDate.toLocaleDateString()}`],
		["Game Version", `${targetClient.gameVersion}`],
		["Script Version", `${scriptVersion}`],
		["Client Version", `${getPlayerData(targetClient).clientVersion}`],
		["Client Version", `${getPlayerData(targetClient).clientVersion}`],
		["Cash", `${getCurrencyString(getPlayerCurrentSubAccount(client).cash)}`],
		["Skin", `${skinName}{mediumGrey}[Model: ${skinModel}/Index: ${skinIndex}]{ALTCOLOUR}`],
		["Clan", `${clan}`],
		["Job", `${job}`],
		["Current Date", `${currentDate.toLocaleDateString()}`],
	]

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]} {MAINCOLOUR}`);

	let chunkedList = splitArrayIntoChunks(stats, 5);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function playerChangeAFKState(client, afkState) {
	if (!getPlayerData(client)) {
		return false;
	}

	getPlayerData(client).afk = afkState;
	updateAllPlayerNameTags();
}

// ===========================================================================

function checkPlayerSpawning() {
	let clients = getClients();
	for (let i in clients) {
		if (!isConsole(clients[i])) {
			if (getPlayerData(clients[i])) {
				if (isPlayerLoggedIn(clients[i])) {
					if (!getPlayerData(clients[i]).ped) {
						if (clients[i].player != null) {
							//getPlayerData(clients[i]).ped = clients[i].player;
							onPlayerSpawn(clients[i].player);
						}
					}
				}
			}
		}
	}
}

// ===========================================================================

function showPlayerPrompt(client, promptMessage, promptTitle, yesButtonText, noButtonText) {
	if (doesPlayerUseGUI(client)) {
		showPlayerPromptGUI(client, promptMessage, promptTitle, yesButtonText, noButtonText);
	} else {
		messagePlayerNormal(client, `🛎️ ${promptMessage} `);
		messagePlayerInfo(client, getLocaleString(client, "PromptResponseTip", `{ALTCOLOUR}/yes{MAINCOLOUR}`, `{ALTCOLOUR}/no{MAINCOLOUR}`));
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
function updateServerGameTime() {
	if (isTimeSupported()) {
		game.time.hour = getServerConfig().hour;
		game.time.minute = getServerConfig().minute;
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
function listOnlineAdminsCommand(command, params, client) {
	//== Admins ===================================
	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderAdminsList")));

	let admins = [];
	let clients = getClients();
	for (let i in clients) {
		if (getPlayerData(clients[i])) {
			if (typeof getPlayerData(clients[i]).accountData.flags.admin != "undefined") {
				if (getPlayerData(clients[i]).accountData.flags.admin > 0 || getPlayerData(clients[i]).accountData.flags.admin == -1) {
					admins.push(`{ALTCOLOUR}[${getPlayerData(clients[i]).accountData.staffTitle}]{MAINCOLOUR} ${getCharacterFullName(clients[i])}`);
				}
			}
		}
	}

	let chunkedList = splitArrayIntoChunks(admins, 3);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
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
function stuckPlayerCommand(command, params, client) {
	if ((getCurrentUnixTimestamp() - getPlayerData(client).lastStuckCommand) < getGlobalConfig().stuckCommandInterval) {
		messagePlayerError(client, "CantUseCommandYet");
		return false;
	}

	let dimension = getPlayerDimension(client);
	let interior = getPlayerInterior(client);

	messagePlayerAlert(client, getLocaleString(client, "FixingStuck"));

	if (getGameConfig().skinChangePosition[getGame()].length > 0) {
		if (getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == AGRP_RETURNTO_TYPE_SKINSELECT) {
			messagePlayerAlert(client, "You canceled the skin change.");
			restorePlayerCamera(client);

			setPlayerPosition(client, getPlayerData(client).returnToPosition);
			setPlayerHeading(client, getPlayerData(client).returnToHeading);
			setPlayerInterior(client, getPlayerData(client).returnToInterior);
			setPlayerDimension(client, getPlayerData(client).returnToDimension);

			getPlayerData(client).returnToPosition = null;
			getPlayerData(client).returnToHeading = null;
			getPlayerData(client).returnToInterior = null;
			getPlayerData(client).returnToDimension = null;

			getPlayerData(client).returnToType = AGRP_RETURNTO_TYPE_NONE;
		}
	}

	//if(getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == AGRP_RETURNTO_TYPE_ADMINGET) {
	//    messagePlayerError(client, `You were teleported by an admin and can't use the stuck command`);
	//    return false;
	//}

	if (dimension > 0) {
		let businesses = getServerData().businesses;
		for (let i in businesses) {
			if (businesses[i].exitDimension == dimension) {
				setPlayerPosition(client, businesses[i].entrancePosition);
				setPlayerDimension(client, businesses[i].entranceDimension);
				setPlayerInterior(client, businesses[i].entranceInterior);

				return true;
			}
		}

		let houses = getServerData().houses;
		for (let i in houses) {
			if (houses[i].exitDimension == dimension) {
				setPlayerPosition(client, houses[i].entrancePosition);
				setPlayerDimension(client, houses[i].entranceDimension);
				setPlayerInterior(client, houses[i].entranceInterior);

				return true;
			}
		}
	} else {
		setPlayerDimension(client, 1);
		setPlayerDimension(client, getGameConfig().mainWorldDimension[getGame()]);
		setPlayerInterior(client, getGameConfig().mainWorldInterior[getGame()]);
		setPlayerPosition(client, getPosAbovePos(getPlayerPosition(client), 2.0));
	}

	setPlayerInterior(client, 0);
	setPlayerDimension(client, 0);
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
function playerPedSpeakCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	makePlayerPedSpeak(client, params);
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
function lockCommand(command, params, client) {
	if (isPlayerInAnyVehicle(client)) {
		let vehicle = getPlayerVehicle(client);

		if (!getVehicleData(vehicle)) {
			messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
			return false;
		}

		if (!isPlayerInFrontVehicleSeat(client)) {
			messagePlayerError(client, getLocaleString(client, "MustBeInVehicleFrontSeat"));
			return false;
		}

		getVehicleData(vehicle).locked = !getVehicleData(vehicle).locked;
		setVehicleLocked(vehicle, getVehicleData(vehicle).locked);
		getVehicleData(vehicle).needsSaved = true;

		meActionToNearbyPlayers(client, `${toLowerCase(getLockedUnlockedFromBool(getVehicleData(vehicle).locked))} the ${getVehicleName(vehicle)}`);
		return true;
	} else {
		let vehicle = getClosestVehicle(getPlayerPosition(client));
		if (getDistance(getPlayerPosition(client), getVehiclePosition(vehicle)) <= getGlobalConfig().vehicleLockDistance) {
			if (!getVehicleData(vehicle)) {
				messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
				return false;
			}

			if (!doesPlayerHaveVehicleKeys(client, vehicle)) {
				messagePlayerError(client, getLocaleString(client, "DontHaveVehicleKey"));
				return false;
			}

			getVehicleData(vehicle).locked = !getVehicleData(vehicle).locked;
			setVehicleLocked(vehicle, getVehicleData(vehicle).locked);
			getVehicleData(vehicle).needsSaved = true;

			meActionToNearbyPlayers(client, `${toLowerCase(getLockedUnlockedFromBool(getVehicleData(vehicle).locked))} the ${getVehicleName(vehicle)}`);

			return true;
		}

		let businessId = getPlayerBusiness(client);
		if (businessId != -1) {
			if (!canPlayerManageBusiness(client, businessId)) {
				messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
				return false;
			}

			getBusinessData(businessId).locked = !getBusinessData(businessId).locked;
			updateBusinessPickupLabelData(businessId);
			getBusinessData(businessId).needsSaved = true;

			messagePlayerSuccess(client, `${getLockedUnlockedEmojiFromBool((getBusinessData(businessId).locked))} Business {businessBlue}${getBusinessData(businessId).name} {MAINCOLOUR}${getLockedUnlockedFromBool((getBusinessData(businessId).locked))}!`);
			return true;
		}

		let houseId = getPlayerHouse(client);
		if (houseId != -1) {
			if (!canPlayerManageHouse(client, houseId)) {
				messagePlayerError(client, getLocaleString(client, "CantModifyHouse"));
				return false;
			}

			getHouseData(houseId).locked = !getHouseData(houseId).locked;
			updateHousePickupLabelData(houseId);
			getHouseData(houseId).needsSaved = true;

			messagePlayerSuccess(client, `House {houseGreen}${getHouseData(houseId).description} {MAINCOLOUR}${getLockedUnlockedFromBool((getHouseData(houseId).locked))}!`);
			return true;
		}
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
function lightsCommand(command, params, client) {
	if (isPlayerInAnyVehicle(client)) {
		let vehicle = getPlayerVehicle(client);

		if (!getVehicleData(vehicle)) {
			messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
			return false;
		}

		if (!isPlayerInFrontVehicleSeat(client)) {
			messagePlayerError(client, getLocaleString(client, "MustBeInVehicleFrontSeat"));
			return false;
		}

		getVehicleData(vehicle).lights = !getVehicleData(vehicle).lights;
		setVehicleLights(vehicle, getVehicleData(vehicle).lights)
		getVehicleData(vehicle).needsSaved = true;

		meActionToNearbyPlayers(client, `turned ${toLowerCase(getOnOffFromBool(getVehicleData(vehicle).lights))} the ${getVehicleName(vehicle)}'s lights`);
	} else {
		/*
		let vehicle = getClosestVehicle(getPlayerPosition(client));
		if(vehicle != false) {
			if(getDistance(getPlayerPosition(client), getVehiclePosition(vehicle)) <= getGlobalConfig().vehicleLockDistance) {
				return false;
			}

			if(!getVehicleData(vehicle)) {
				messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
				return false;
			}

			if(!doesPlayerHaveVehicleKeys(client, vehicle)) {
				messagePlayerError(client, getLocaleString(client, "DontHaveVehicleKey"));
				return false;
			}

			getVehicleData(vehicle).lights = !getVehicleData(vehicle).lights;
			setVehicleLights(vehicle, getVehicleData(vehicle).lights);
			getVehicleData(vehicle).needsSaved = true;

			meActionToNearbyPlayers(client, `${toLowerCase(getLockedUnlockedFromBool(getVehicleData(vehicle).locked))} the ${getVehicleName(vehicle)}`);
			return true;
		}
		*/

		let businessId = getPlayerBusiness(client);
		if (businessId != -1) {
			if (!canPlayerManageBusiness(client, businessId)) {
				messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
				return false;
			}

			getBusinessData(businessId).interiorLights = !getBusinessData(businessId).interiorLights;
			getBusinessData(businessId).needsSaved = true;

			let clients = getClients();
			for (let i in clients) {
				if (getPlayerBusiness(client) == getPlayerBusiness(clients[i]) && getPlayerDimension(clients[i]) == getBusinessData(businessId).exitDimension) {
					updateInteriorLightsForPlayer(clients[i], getBusinessData(businessId).interiorLights);
				}
			}

			meActionToNearbyPlayers(client, `turned ${toLowerCase(getOnOffFromBool((getBusinessData(businessId).interiorLights)))} on the business lights`);
			return true;
		}

		let houseId = getPlayerHouse(client);
		if (houseId != -1) {
			if (!canPlayerManageHouse(client, houseId)) {
				messagePlayerError(client, getLocaleString(client, "CantModifyHouse"));
				return false;
			}

			getHouseData(houseId).interiorLights = !getHouseData(houseId).interiorLights;
			getHouseData(houseId).needsSaved = true;

			let clients = getClients();
			for (let i in clients) {
				if (getPlayerHouse(client) == getPlayerHouse(clients[i]) && getPlayerDimension(clients[i]) == getHouseData(houseId).exitDimension) {
					updateInteriorLightsForPlayer(clients[i], getHouseData(houseId).interiorLights);
				}
			}

			meActionToNearbyPlayers(client, `turned ${toLowerCase(getOnOffFromBool((getHouseData(houseId).interiorLights)))} on the house lights`);
			return true;
		}
	}
}

// ===========================================================================

function resetPlayerBlip(client) {
	deletePlayerBlip(client);
	createPlayerBlip(client);
}

// ===========================================================================

function createPlayerBlip(client) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (!isGameFeatureSupported("attachedBlip")) {
		return false;
	}

	if (getServerConfig().createPlayerBlips) {
		return false;
	}

	let blip = createAttachedGameBlip(getPlayerPed(client), 0, 1, getPlayerColour(client));
	if (blip) {
		if (getGlobalConfig().playerBlipStreamInDistance == -1 || getGlobalConfig().playerBlipStreamOutDistance == -1) {
			//getPlayerPed(client).netFlags.distanceStreaming = false;
			getPlayerPed(client).streamInDistance = 999998;
			getPlayerPed(client).streamOutDistance = 999999;
		} else {
			//getPlayerPed(client).netFlags.distanceStreaming = true;
			setElementStreamInDistance(getPlayerPed(client), getGlobalConfig().playerBlipStreamInDistance);
			setElementStreamOutDistance(getPlayerPed(client), getGlobalConfig().playerBlipStreamOutDistance);
		}
		//getPlayerPed(client).netFlags.defaultExistance = true;
		blip.netFlags.defaultExistance = true;
		blip.setExistsFor(client, false);
		getPlayerData(client).playerBlip = blip;
	}
}

// ===========================================================================

function deletePlayerBlip(client) {
	if (!isGameFeatureSupported("attachedBlip")) {
		return false;
	}

	if (getPlayerData(client).playerBlip != null) {
		deleteGameElement(getPlayerData(client).playerBlip);
		getPlayerData(client).playerBlip = null;
	}
}

// ===========================================================================

function processPlayerDeath(client) {
	getPlayerData(client).pedState = AGRP_PEDSTATE_DEAD;
	updatePlayerSpawnedState(client, false);
	setPlayerControlState(client, false);
	setTimeout(function () {
		fadePlayerCamera(client, false, 1000);
		setTimeout(function () {
			if (isPlayerInPaintBall(client)) {
				respawnPlayerForPaintBall(client);
			} else {
				if (getPlayerCurrentSubAccount(client).inJail) {
					let closestJail = getClosestPoliceStation(getPlayerPosition(client));
					despawnPlayer(client);
					getPlayerCurrentSubAccount(client).interior = closestJail.interior;
					getPlayerCurrentSubAccount(client).dimension = closestJail.dimension;

					if (isPlayerWorking(client)) {
						stopWorking(client);
					}

					spawnPlayer(client, closestJail.position, closestJail.heading, getGameConfig().skins[getGame()][getPlayerCurrentSubAccount(client).skin][0]);

					fadePlayerCamera(client, true, 1000);
					updatePlayerSpawnedState(client, true);
					makePlayerStopAnimation(client);
					setPlayerControlState(client, true);
					resetPlayerBlip(client);
				} else {
					let closestHospital = getClosestHospital(getPlayerPosition(client));
					despawnPlayer(client);
					getPlayerCurrentSubAccount(client).interior = closestHospital.interior;
					getPlayerCurrentSubAccount(client).dimension = closestHospital.dimension;

					if (isPlayerWorking(client)) {
						stopWorking(client);
					}

					spawnPlayer(client, closestHospital.position, closestHospital.heading, getGameConfig().skins[getGame()][getPlayerCurrentSubAccount(client).skin][0]);
					fadePlayerCamera(client, true, 1000);
					updatePlayerSpawnedState(client, true);
					makePlayerStopAnimation(client);
					setPlayerControlState(client, true);
					resetPlayerBlip(client);
				}
			}
		}, 2000);
	}, 1000);

	//let queryData = [
	//	["log_death_server", getServerId()]
	//	["log_death_who_died", getPlayerCurrentSubAccount(client).databaseId],
	//	["log_death_when_died", getCurrentUnixTimestamp()],
	//	["log_death_pos_x", position.x],
	//	["log_death_pos_y", position.y],
	//	["log_death_pos_z", position.x],
	//];
	//let queryString = createDatabaseInsertQuery("log_death", queryData);
	//queryDatabase(queryString);
}

// ===========================================================================

function isPlayerSurrendered(client) {
	return (getPlayerData(client).pedState == AGRP_PEDSTATE_TAZED || getPlayerData(client).pedState == AGRP_PEDSTATE_HANDSUP);
}

// ===========================================================================

function isPlayerRestrained(client) {
	return (getPlayerData(client).pedState == AGRP_PEDSTATE_BINDED);
}

// ===========================================================================

function getPlayerInPropertyData(client) {
	let businessId = getPlayerBusiness(client);
	if (businessId != -1) {
		getPlayerData(client).inProperty = [AGRP_PROPERTY_TYPE_BUSINESS, businessId];
		return false;
	}

	let houseId = getPlayerHouse(client);
	if (houseId != -1) {
		getPlayerData(client).inProperty = [AGRP_PROPERTY_TYPE_HOUSE, houseId];
		return false;
	}

	getPlayerData(client).inProperty = null;
}

// ===========================================================================