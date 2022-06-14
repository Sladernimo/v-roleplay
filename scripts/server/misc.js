// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: misc.js
// DESC: Provides any uncategorized functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

function initMiscScript() {
	logToConsole(LOG_INFO, "[VRR.Misc]: Initializing misc script ...");
	logToConsole(LOG_INFO, "[VRR.Misc]: Misc script initialized successfully!");
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

function toggleMouseCameraCommand(command, params, client) {
	if (getGame() != VRR_GAME_GTA_VC) {
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

	messagePlayerNormal(client, `The new character money has been set to $${amount}`);
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

	if (areServerElementsSupported()) {
		if (!getPlayerData(client).currentPickup) {
			return false;
		}

		let ownerType = getEntityData(getPlayerData(client).currentPickup, "vrr.owner.type");
		let ownerId = getEntityData(getPlayerData(client).currentPickup, "vrr.owner.id");

		switch (ownerType) {
			case VRR_PICKUP_BUSINESS_ENTRANCE:
				isBusiness = true;
				isEntrance = true;
				closestProperty = getServerData().businesses[ownerId];
				break;

			case VRR_PICKUP_BUSINESS_EXIT:
				isBusiness = true;
				isEntrance = false;
				closestProperty = getServerData().businesses[ownerId];
				break;

			case VRR_PICKUP_HOUSE_ENTRANCE:
				isBusiness = false;
				isEntrance = true;
				closestProperty = getServerData().houses[ownerId];
				break;

			case VRR_PICKUP_HOUSE_EXIT:
				isBusiness = false;
				isEntrance = false;
				closestProperty = getServerData().houses[ownerId];
				break;

			default:
				return false;
		}
	} else {
		for (let i in getServerData().businesses) {
			if (getPlayerDimension(client) == getGameConfig().mainWorldDimension[getGame()] && getPlayerInterior(client) == getGameConfig().mainWorldInterior[getGame()]) {
				let businessId = getClosestBusinessEntrance(getPlayerPosition(client), getPlayerDimension(client));
				isBusiness = true;
				isEntrance = true;
				closestProperty = getServerData().businesses[businessId];
			} else {
				let businessId = getClosestBusinessExit(getPlayerPosition(client), getPlayerDimension(client));
				isBusiness = true;
				isEntrance = false;
				closestProperty = getServerData().businesses[businessId];
			}
		}

		for (let j in getServerData().houses) {
			if (getPlayerDimension(client) == getGameConfig().mainWorldDimension[getGame()] && getPlayerInterior(client) == getGameConfig().mainWorldInterior[getGame()]) {
				let houseId = getClosestHouseEntrance(getPlayerPosition(client), getPlayerDimension(client));
				isBusiness = false;
				isEntrance = true;
				closestProperty = getServerData().businesses[houseId];
			} else {
				let houseId = getClosestHouseExit(getPlayerPosition(client), getPlayerDimension(client));
				isBusiness = false;
				isEntrance = false;
				closestProperty = getServerData().businesses[houseId];
			}
		}
	}

	if (closestProperty == null) {
		return false;
	}

	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s closest door is ${(isBusiness) ? closestProperty.name : closestProperty.description} ${(isEntrance) ? "entrance" : "exit"}`);

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
			getPlayerData(client).pedState = VRR_PEDSTATE_ENTERINGPROPERTY;
			meActionToNearbyPlayers(client, getLocaleString(client, "EntersProperty", (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House")));

			if (isFadeCameraSupported()) {
				fadeCamera(client, false, 1.0);
			}

			setTimeout(function () {
				setPlayerInCutsceneInterior(client, closestProperty.exitCutscene);
				setPlayerDimension(client, closestProperty.exitDimension);
				setPlayerInterior(client, closestProperty.exitInterior);
				setPlayerPosition(client, closestProperty.exitPosition);
				setPlayerHeading(client, closestProperty.exitRotation);
				setTimeout(function () {
					if (isFadeCameraSupported()) {
						fadeCamera(client, true, 1.0);
					}
					updateInteriorLightsForPlayer(client, closestProperty.interiorLights);
				}, 1000);
				//setPlayerInCutsceneInterior(client, closestProperty.exitCutscene);
				//updateAllInteriorVehiclesForPlayer(client, closestProperty.exitInterior, closestProperty.exitDimension);
			}, 1100);
			if (closestProperty.streamingRadioStation != -1) {
				if (getRadioStationData(closestProperty.streamingRadioStation)) {
					playRadioStreamForPlayer(client, getRadioStationData(closestProperty.streamingRadioStation).url);
					getPlayerData(client).streamingRadioStation = closestProperty.streamingRadioStation;
				}
			}
			return true;
		}
	} else {
		if (getDistance(closestProperty.exitPosition, getPlayerPosition(client)) <= getGlobalConfig().exitPropertyDistance) {
			if (closestProperty.locked) {
				meActionToNearbyPlayers(client, getLocaleString(client, "EnterExitPropertyDoorLocked", (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House")));
				return false;
			}
			getPlayerData(client).pedState = VRR_PEDSTATE_EXITINGPROPERTY;
			clearPlayerStateToEnterExitProperty(client)
			meActionToNearbyPlayers(client, getLocaleString(client, "ExitsProperty", (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House")));

			if (isFadeCameraSupported()) {
				fadeCamera(client, false, 1.0);
			}

			disableCityAmbienceForPlayer(client, true);
			setTimeout(function () {
				setPlayerInCutsceneInterior(client, closestProperty.entranceCutscene);
				setPlayerPosition(client, closestProperty.entrancePosition);
				setPlayerHeading(client, closestProperty.entranceRotation);
				setPlayerDimension(client, closestProperty.entranceDimension);
				setPlayerInterior(client, closestProperty.entranceInterior);
				setTimeout(function () {
					if (isFadeCameraSupported()) {
						fadeCamera(client, true, 1.0);
					}

					updateInteriorLightsForPlayer(client, true);
				}, 1000);
			}, 1100);
			//setPlayerInCutsceneInterior(client, closestProperty.entranceCutscene);
			stopRadioStreamForPlayer(client);
			getPlayerData(client).streamingRadioStation = -1;

			//logToConsole(LOG_DEBUG, `[VRR.Misc] ${getPlayerDisplayForConsole(client)} exited business ${inBusiness.name}[${inBusiness.index}/${inBusiness.databaseId}]`);
			return true;
		}
	}

	return true;
}

// ===========================================================================

function getPlayerInfoCommand(command, params, client) {
	let targetClient = client;

	if (!areParamsEmpty(params)) {
		if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("BasicModeration"))) {
			targetClient = getPlayerFromParams(params);

			if (!getPlayerData(targetClient)) {
				messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
				return false;
			}
		}
	}

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerInfo")));

	let clan = (getPlayerCurrentSubAccount(targetClient).clan != 0) ? `{ALTCOLOUR}${getClanData(getClanIdFromDatabaseId(getPlayerCurrentSubAccount(targetClient).clan)).name}[${getPlayerCurrentSubAccount(targetClient).clan}] (Rank: ${getClanRankData(getPlayerCurrentSubAccount(targetClient).clan, getPlayerCurrentSubAccount(targetClient).clanRank).name}[Level: ${getClanRankData(getPlayerCurrentSubAccount(targetClient).clan, getPlayerCurrentSubAccount(targetClient).clanRank).level}, DBID: ${getClanRankData(getPlayerCurrentSubAccount(targetClient).clan, getPlayerCurrentSubAccount(targetClient).clanRank).databaseId}` : `(None)`;
	let job = (getPlayerCurrentSubAccount(targetClient).job != 0) ? `{ALTCOLOUR}${getJobData(getJobIdFromDatabaseId(getPlayerCurrentSubAccount(targetClient).job)).name}[${getPlayerCurrentSubAccount(targetClient).job}] (Rank: ${getPlayerCurrentSubAccount(targetClient).jobRank})` : `(None)`;

	let tempStats = [
		["Account", `${getPlayerData(targetClient).accountData.name}[${getPlayerData(targetClient).accountData.databaseId}]`],
		["Character", `${getCharacterFullName(targetClient)}[${getPlayerCurrentSubAccount(targetClient).databaseId}]`],
		["Connected", `${getTimeDifferenceDisplay(getCurrentUnixTimestamp(), getPlayerData(targetClient).connectTime)} ago`],
		["Registered", `${getPlayerData(targetClient).accountData.registerDate}`],
		["Game Version", `${targetClient.gameVersion}`],
		["Client Version", `${getPlayerData(targetClient).clientVersion}`],
		["Skin", `${getSkinNameFromModel(getPlayerCurrentSubAccount(targetClient).skin)}[${getPlayerCurrentSubAccount(targetClient).skin}]`],
		["Clan", `${clan}`],
		["Job", `${job}`],
		["Cash", `${getPlayerCurrentSubAccount(client).cash}`],
	]

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	let chunkedList = splitArrayIntoChunks(stats, 6);
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
	if (canPlayerUseGUI(client)) {
		showPlayerPromptGUI(client, promptMessage, promptTitle, yesButtonText, noButtonText);
	} else {
		messagePlayerNormal(client, `❓ ${promptMessage}`);
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
					admins.push(`{ALTCOLOUR}[${getPlayerData(clients[i]).accountData.staffTitle}] {MAINCOLOUR}${getCharacterFullName(clients[i])}`);
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
function gpsCommand(command, params, client) {
	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBusinessList")));

	let locationType = VRR_GPS_TYPE_NONE;
	let useType = VRR_ITEM_USETYPE_NONE;
	let blipColour = "white";

	switch (toLowerCase(params)) {
		case "police":
		case "policestation":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_POLICE;
			break;

		case "hospital":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_HOSPITAL;
			break;

		case "job":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_JOB;
			break;

		case "skin":
		case "skins":
		case "clothes":
		case "player":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_BUSINESS;
			useType = VRR_ITEM_USETYPE_SKIN;
			break;

		case "gun":
		case "guns":
		case "weapon":
		case "weapons":
		case "wep":
		case "weps":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_BUSINESS;
			useType = VRR_ITEM_USETYPE_WEAPON;
			break;

		case "food":
		case "eat":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_BUSINESS;
			useType = VRR_ITEM_USETYPE_FOOD;
			break;

		case "drink":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_BUSINESS;
			useType = VRR_ITEM_USETYPE_DRINK;
			break;

		case "alcohol":
		case "booze":
		case "bar":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_BUSINESS;
			useType = VRR_ITEM_USETYPE_ALCOHOL;
			break;

		case "repair":
		case "carrepair":
		case "vehrepair":
		case "spray":
		case "fix":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_BUSINESS;
			useType = VRR_ITEM_USETYPE_VEHREPAIR;
			break;

		case "vehiclecolour":
		case "vehcolour":
		case "carcolour":
		case "colour":
			blipColour = "mediumGrey"
			locationType = VRR_GPS_TYPE_BUSINESS;
			useType = VRR_ITEM_USETYPE_VEHCOLOUR;
			break;

		default: {
			let itemTypeId = getItemTypeFromParams(params);
			if (getItemTypeData(itemTypeId) != false) {
				locationType = VRR_GPS_TYPE_BUSINESS;
				blipColour = "mediumGrey";
				useType = getItemTypeData(itemTypeId).useType;
			} else {
				let gameLocationId = getGameLocationFromParams(params);
				if (gameLocationId != false) {
					position = getGameConfig().locations[getGame()][gameLocationId][1]
				}
			}
		}
	}

	if (locationType == VRR_GPS_TYPE_NONE) {
		messagePlayerError(client, getLocaleString(client, "InvalidGPSLocation"));
		return false;
	}

	if (locationType == VRR_GPS_TYPE_BUSINESS) {
		let businessId = getClosestBusinessWithBuyableItemOfUseType(useType);
		if (!businessId) {
			messagePlayerError(client, getLocaleString(client, "NoBusinessWithItemType"));
			return false;
		}

		if (!getBusinessData(businessId)) {
			messagePlayerError(client, getLocaleString(client, "NoBusinessWithItemType"));
			return false;
		}

		hideAllBlipsForPlayerGPS(client);
		blinkGenericGPSBlipForPlayer(client, getBusinessData(businessId).entrancePosition, getBusinessData(businessId).entranceBlipModel, getColourByType(blipColour), 10);
		messagePlayerSuccess(client, "Look for the blinking icon on your mini map");
	}

	if (locationType == VRR_GPS_TYPE_GAMELOC) {
		hideAllBlipsForPlayerGPS(client);
		blinkGenericGPSBlipForPlayer(client, position, 0, getColourByType(blipColour), 10);
		messagePlayerSuccess(client, "Look for the blinking icon on your mini map");
		return true;
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
		if (getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == VRR_RETURNTO_TYPE_SKINSELECT) {
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

			getPlayerData(client).returnToType = VRR_RETURNTO_TYPE_NONE;
		}
	}

	//if(getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == VRR_RETURNTO_TYPE_ADMINGET) {
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

	if (!isGameFeatureSupported("attachedBlips")) {
		return false;
	}

	if (getServerConfig().createPlayerBlips) {
		return false;
	}

	let blip = createAttachedGameBlip(getPlayerPed(client), 0, 1, getPlayerColour(client));
	if (blip) {
		if (getGlobalConfig().playerBlipStreamInDistance == -1 || getGlobalConfig().playerBlipStreamOutDistance == -1) {
			blip.netFlags.distanceStreaming = false;
		} else {
			setElementStreamInDistance(blip, getGlobalConfig().playerBlipStreamInDistance);
			setElementStreamOutDistance(blip, getGlobalConfig().playerBlipStreamOutDistance);
		}
		getPlayerData(client).playerBlip = blip;
	}
}

// ===========================================================================

function deletePlayerBlip(client) {
	if (!isGameFeatureSupported("attachedBlips")) {
		return false;
	}

	if (getPlayerData(client).playerBlip != null) {
		deleteGameElement(getPlayerData(client).playerBlip);
		getPlayerData(client).playerBlip = null;
	}
}

// ===========================================================================