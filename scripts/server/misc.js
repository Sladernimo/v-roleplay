// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: misc.js
// DESC: Provides any uncategorized functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Pickup Types
const V_PICKUP_NONE = 0;
const V_PICKUP_JOB = 1;
const V_PICKUP_BUSINESS_ENTRANCE = 2;
const V_PICKUP_BUSINESS_EXIT = 3;
const V_PICKUP_HOUSE_ENTRANCE = 4;
const V_PICKUP_HOUSE_EXIT = 5;
const V_PICKUP_EXIT = 6;

// ===========================================================================

// Blip Owner Types
const V_BLIP_NONE = 0;
const V_BLIP_JOB = 1;
const V_BLIP_BUSINESS_ENTRANCE = 2;
const V_BLIP_BUSINESS_EXIT = 3;
const V_BLIP_HOUSE_ENTRANCE = 4;
const V_BLIP_HOUSE_EXIT = 5;
const V_BLIP_EXIT = 6;

// ===========================================================================

// Ped States
const V_PEDSTATE_NONE = 0;                     // None
const V_PEDSTATE_READY = 1;                    // Ready
const V_PEDSTATE_DRIVER = 2;                   // Driving a vehicle
const V_PEDSTATE_PASSENGER = 3;                // In a vehicle as passenger
const V_PEDSTATE_DEAD = 4;                     // Dead
const V_PEDSTATE_ENTERINGPROPERTY = 5;         // Entering a property
const V_PEDSTATE_EXITINGPROPERTY = 6;          // Exiting a property
const V_PEDSTATE_ENTERINGVEHICLE = 7;          // Entering a vehicle
const V_PEDSTATE_EXITINGVEHICLE = 8;           // Exiting a vehicle
const V_PEDSTATE_BINDED = 9;                   // Binded by rope or handcuffs
const V_PEDSTATE_TAZED = 10;                   // Under incapacitating effect of tazer
const V_PEDSTATE_INTRUNK = 11;                 // In vehicle trunk
const V_PEDSTATE_INITEM = 12;                  // In item (crate, box, etc)
const V_PEDSTATE_HANDSUP = 13;                 // Has hands up (surrendering)
const V_PEDSTATE_SPAWNING = 14;                // Spawning
const V_PEDSTATE_TELEPORTING = 15;                // Spawning

// Property Types
const V_PROPERTY_TYPE_NONE = 0;				  // None
const V_PROPERTY_TYPE_BUSINESS = 1;			  // Business
const V_PROPERTY_TYPE_HOUSE = 2;				  // House

// ===========================================================================

function initMiscScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Misc]: Initializing misc script ...");
	logToConsole(LOG_INFO, "[V.RP.Misc]: Misc script initialized successfully!");
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
		removePedFromVehicle(getPlayerPed(client));
	}

	processPlayerDeath(client);
	return true;
}

// ===========================================================================

function toggleMouseCameraCommand(command, params, client) {
	if (getGame() != V_GAME_GTA_VC) {
		sendPlayerMouseCameraToggle(client);
	}
	return true;
}

// ===========================================================================

function setNewCharacterSpawnPositionCommand(command, params, client) {
	let position = getPlayerPosition(client);
	let heading = getPlayerHeading(client);

	serverConfig.newCharacter.spawnPosition = position;
	serverConfig.newCharacter.spawnHeading = heading;
	serverConfig.needsSaved = true;

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

	serverConfig.newCharacter.cash = amount;
	serverConfig.needsSaved = true;

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

	serverConfig.newCharacter.skin = skinId;
	serverConfig.needsSaved = true;

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

	messagePlayerNormal(client, getLocaleString(client, "SuggestionSubmitted"));
	return true;
}

// ===========================================================================

function submitBugReportCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	submitBugReport(client, params);

	messagePlayerNormal(client, getLocaleString(client, "BugReportSubmitted"));
	return true;
}

// ===========================================================================

function enterExitPropertyCommand(command, params, client) {
	let closestProperty = null;
	let isEntrance = false;
	let isBusiness = false;

	// Make sure they aren't already trying to enter/exit a property
	if (getPlayerData(client).pedState == V_PEDSTATE_ENTERINGPROPERTY || getPlayerData(client).pedState == V_PEDSTATE_EXITINGPROPERTY) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	let position = getPlayerPosition(client);
	let dimension = getPlayerDimension(client);

	/*
	// The player's currentPickup wasn't always being set. This prevented entering/exiting a property.
	// Needs further testing and tweaks.
	if (getPlayerData(client).currentPickup != null) {
		if (getDistance(getPlayerData(client).currentPickup.position, getPlayerPosition(client)) <= 2) {
			let ownerType = getEntityData(getPlayerData(client).currentPickup, "v.rp.owner.type");
			let ownerId = getEntityData(getPlayerData(client).currentPickup, "v.rp.owner.id");

			switch (ownerType) {
				case V_PICKUP_BUSINESS_ENTRANCE:
					isBusiness = true;
					isEntrance = true;
					closestProperty = serverData.businesses[ownerId];
					break;

				case V_PICKUP_BUSINESS_EXIT:
					isBusiness = true;
					isEntrance = false;
					closestProperty = serverData.businesses[ownerId];
					break;

				case V_PICKUP_HOUSE_ENTRANCE:
					isBusiness = false;
					isEntrance = true;
					closestProperty = serverData.houses[ownerId];
					break;

				case V_PICKUP_HOUSE_EXIT:
					isBusiness = false;
					isEntrance = false;
					closestProperty = serverData.houses[ownerId];
					break;

				default:
					return false;
			}
		} else {
			getPlayerData(client).currentPickup = null;
		}
	}
	*/

	/*
	// Check businesses first
	if (closestProperty == null) {
		let businessIndex = getClosestBusinessEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getBusinessData(businessIndex).entrancePosition, getPlayerPosition(client)) <= 1.5) {
			isBusiness = true;
			isEntrance = true;
			closestProperty = serverData.businesses[businessIndex];
		}
	}

	if (closestProperty == null) {
		let businessIndex = getClosestBusinessExit(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getBusinessData(businessIndex).exitPosition, getPlayerPosition(client)) <= 1.5) {
			isBusiness = true;
			isEntrance = false;
			closestProperty = serverData.businesses[businessIndex];
		}
	}

	// Check houses second
	if (closestProperty == null) {
		let houseIndex = getClosestHouseEntrance(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getHouseData(houseIndex).entrancePosition, getPlayerPosition(client)) <= 1.5) {
			isBusiness = false;
			isEntrance = true;
			closestProperty = serverData.houses[houseIndex];
		}
	}

	if (closestProperty == null) {
		let houseIndex = getClosestHouseExit(getPlayerPosition(client), getPlayerDimension(client));
		if (getDistance(getHouseData(houseIndex).exitPosition, getPlayerPosition(client)) <= 1.5) {
			isBusiness = false;
			isEntrance = false;
			closestProperty = serverData.houses[houseIndex];
		}
	}
	*/

	// Check businesses first
	if (closestProperty == null) {
		let businessId = getPlayerBusiness(client);
		if (businessId != -1) {
			if (serverData.businesses[businessId].entranceDimension == dimension) {
				if (getDistance(position, serverData.businesses[businessId].entrancePosition) <= globalConfig.enterPropertyDistance) {
					isBusiness = true;
					isEntrance = true;
					closestProperty = serverData.businesses[businessId];
				}
			} else if (serverData.businesses[businessId].exitDimension == dimension) {
				if (getDistance(position, serverData.businesses[businessId].exitPosition) <= globalConfig.exitPropertyDistance) {
					isBusiness = true;
					isEntrance = false;
					closestProperty = serverData.businesses[businessId];
				}
			}
		}
	}

	if (closestProperty == null) {
		let houseId = getPlayerHouse(client);
		if (houseId != -1) {
			if (serverData.houses[houseId].entranceDimension == dimension) {
				if (getDistance(position, serverData.houses[houseId].entrancePosition) <= globalConfig.enterPropertyDistance) {
					isBusiness = false;
					isEntrance = true;
					closestProperty = serverData.houses[houseId];
				}
			} else if (serverData.houses[houseId].exitDimension == dimension) {
				if (getDistance(position, serverData.houses[houseId].exitPosition) <= globalConfig.exitPropertyDistance) {
					isBusiness = false;
					isEntrance = false;
					closestProperty = serverData.houses[houseId];
				}
			}
		}
	}

	if (closestProperty == null) {
		logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s closest door is null`);
		return false;
	}

	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)}'s closest door is ${(isBusiness) ? closestProperty.name : closestProperty.description} ${(isEntrance) ? "entrance" : "exit"}`);

	let englishId = getLocaleFromParams("English");
	let typeString = (isBusiness) ? getLanguageLocaleString(englishId, "Business") : getLanguageLocaleString(englishId, "House");
	let nameString = (isBusiness) ? closestProperty.name : closestProperty.description;

	let vehicle = getPlayerVehicle(client);
	let vehicleIndex = -1;

	if (vehicle != null) {
		if (getVehicleData(vehicle) != null) {
			vehicleIndex = getVehicleDataIndexFromVehicle(vehicle);
		}
	}

	if (isEntrance) {
		if (getDistance(closestProperty.entrancePosition, getPlayerPosition(client)) <= globalConfig.enterPropertyDistance) {
			if (closestProperty.locked) {
				meActionToNearbyPlayers(client, getLocaleString(client, "EnterExitPropertyDoorLocked", (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House")));
				return false;
			}

			if (!closestProperty.hasInterior) {
				messagePlayerAlert(client, getLocaleString(client, "PropertyNoInterior", (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House")));
				return false;
			}

			if (closestProperty.exitScene != "" && closestProperty.exitScene != "V.RP.MAINWORLD") {
				if (gameData.interiors[getGame()][closestProperty.exitScene][5] == false && closestProperty.allowVehicles == false) {
					if (isPlayerInAnyVehicle(client)) {
						messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
						return false;
					}
				}
			}

			meActionToNearbyPlayers(client, getLanguageLocaleString(englishId, "EntersProperty", typeString, nameString));

			if (vehicleIndex != -1) {
				if (isPlayerInVehicleDriverSeat(client)) {
					let vehicleData = getVehicleData(vehicle);
					getClients().filter(c1 => getPlayerVehicle(c1) == vehicle).forEach(c => {
						let seat = getPlayerVehicleSeat(c);
						removePedFromVehicle(getPlayerPed(c));
						stopRadioStreamForPlayer(c);
						updateInteriorLightsForPlayer(c, true);
						getPlayerData(c).pedState = V_PEDSTATE_ENTERINGPROPERTY;
						getPlayerData(c).streamingRadioStation = closestProperty.streamingRadioStationIndex;
						getPlayerData(c).interiorLights = closestProperty.interiorLights;
						setTimeout(function () {
							initPlayerPropertySwitch(
								c,
								closestProperty.exitPosition,
								closestProperty.exitRotation,
								closestProperty.exitInterior,
								closestProperty.exitDimension,
								vehicleIndex,
								seat,
								closestProperty.exitScene,
							);
						}, 500);
					});

					setTimeout(function () {
						despawnVehicle(vehicleData);

						// Spawn vehicle in the other side
						vehicleData.sceneSwitchPosition = closestProperty.exitPosition;
						vehicleData.sceneSwitchRotation = getRotationFromHeading(closestProperty.exitRotation);
						vehicleData.sceneSwitchInterior = closestProperty.exitInterior;
						vehicleData.sceneSwitchDimension = closestProperty.exitDimension;
						vehicleData.switchingScenes = true;
						spawnVehicle(vehicleData);
						vehicleData.switchingScenes = false;
					}, 1000);
				}
			} else {
				stopRadioStreamForPlayer(client);
				updateInteriorLightsForPlayer(client, true);
				getPlayerData(client).pedState = V_PEDSTATE_ENTERINGPROPERTY;
				getPlayerData(client).streamingRadioStation = closestProperty.streamingRadioStationIndex;
				getPlayerData(client).interiorLights = closestProperty.interiorLights;
				setTimeout(function () {
					initPlayerPropertySwitch(
						client,
						closestProperty.exitPosition,
						closestProperty.exitRotation,
						closestProperty.exitInterior,
						closestProperty.exitDimension,
						-1,
						-1,
						closestProperty.exitScene,
					);
				}, 500);
			}

			return true;
		}
	} else {
		if (getDistance(closestProperty.exitPosition, getPlayerPosition(client)) <= globalConfig.exitPropertyDistance) {
			if (closestProperty.locked) {
				meActionToNearbyPlayers(client, getLocaleString(client, "EnterExitPropertyDoorLocked", (isBusiness) ? getLocaleString(client, "Business") : getLocaleString(client, "House")));
				return false;
			}

			if (closestProperty.entranceScene != "" && closestProperty.entranceScene != "V.RP.MAINWORLD") {
				if (gameData.interiors[getGame()][closestProperty.entranceScene][5] == false && closestProperty.allowVehicles == false) {
					if (isPlayerInAnyVehicle(client)) {
						messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
						return false;
					}
				}
			}

			meActionToNearbyPlayers(client, getLanguageLocaleString(englishId, "ExitsProperty", typeString, nameString));

			if (vehicleIndex != -1) {
				if (isPlayerInVehicleDriverSeat(client)) {
					let vehicleData = getVehicleData(vehicle);
					getClients().filter(c1 => getPlayerVehicle(c1) == vehicle).forEach(c => {
						let seat = getPlayerVehicleSeat(c);
						removePedFromVehicle(getPlayerPed(c));
						stopRadioStreamForPlayer(c);
						updateInteriorLightsForPlayer(c, true);
						getPlayerData(c).streamingRadioStation = closestProperty.streamingRadioStationIndex;
						getPlayerData(c).interiorLights = closestProperty.interiorLights;
						getPlayerData(c).pedState = V_PEDSTATE_EXITINGPROPERTY;
						setTimeout(function () {
							initPlayerPropertySwitch(
								c,
								closestProperty.entrancePosition,
								closestProperty.entranceRotation,
								closestProperty.entranceInterior,
								closestProperty.entranceDimension,
								vehicleIndex,
								seat,
								closestProperty.entranceScene
							);
						}, 500);
					});

					setTimeout(function () {
						despawnVehicle(vehicleData);

						// Spawn vehicle in the other side
						vehicleData.sceneSwitchPosition = closestProperty.entrancePosition;
						vehicleData.sceneSwitchRotation = getRotationFromHeading(closestProperty.entranceRotation);
						vehicleData.sceneSwitchInterior = closestProperty.entranceInterior;
						vehicleData.sceneSwitchDimension = closestProperty.entranceDimension;
						vehicleData.switchingScenes = true;
						spawnVehicle(vehicleData);
						vehicleData.switchingScenes = false;
					}, 1000);
				}
			} else {
				stopRadioStreamForPlayer(client);
				updateInteriorLightsForPlayer(client, true);
				getPlayerData(client).pedState = V_PEDSTATE_EXITINGPROPERTY;
				getPlayerData(client).streamingRadioStation = closestProperty.streamingRadioStationIndex;
				getPlayerData(client).interiorLights = closestProperty.interiorLights;
				setTimeout(function () {
					initPlayerPropertySwitch(
						client,
						closestProperty.entrancePosition,
						closestProperty.entranceRotation,
						closestProperty.entranceInterior,
						closestProperty.entranceDimension,
						-1,
						-1,
						closestProperty.entranceScene,
					);
				}, 500);
			}
		}
	}
	//logToConsole(LOG_DEBUG, `[V.RP.Misc] ${getPlayerDisplayForConsole(client)} exited business ${inBusiness.name}[${inBusiness.index}/${inBusiness.databaseId}]`);
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

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPlayerInfo", `${getPlayerName(targetClient)} - ${getCharacterFullName(targetClient)}`)));

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

	let clan = (getClanData(clanIndex) != null) ? `{ALTCOLOUR}${clanData.name}{mediumGrey}[${clanData.databaseId}]{ALTCOLOUR} (Rank ${clanRankData.level}: ${clanRankData.name}{mediumGrey}[${clanRankData.databaseId}]{ALTCOLOUR})` : `None`;
	let job = (getJobData(jobIndex) != null) ? `{ALTCOLOUR}${jobData.name}{mediumGrey}[${jobData.databaseId}]{ALTCOLOUR} ${jobRankText}` : `None`;
	let skinIndex = getPlayerCurrentSubAccount(targetClient).skin;
	let skinModel = gameData.skins[getGame()][skinIndex][0];
	let skinName = getSkinNameFromModel(skinModel);
	let registerDate = new Date(getPlayerData(targetClient).accountData.registerDate * 1000);
	let currentDate = new Date();
	let localeInfo = `${getLocaleData(getPlayerData(targetClient).accountData.locale).englishName}[${getPlayerData(targetClient).accountData.locale}]`;

	let tempStats = [
		["ID", `${getPlayerId(targetClient)}`],
		["Account", `${getPlayerData(targetClient).accountData.name}{mediumGrey}[${getPlayerData(targetClient).accountData.databaseId}]{ALTCOLOUR}`],
		["Character", `${getCharacterFullName(targetClient)}{mediumGrey}[${getPlayerCurrentSubAccount(targetClient).databaseId}]{ALTCOLOUR}`],
		["Account", `${getPlayerData(targetClient).accountData.name}{mediumGrey}[${getPlayerData(targetClient).accountData.databaseId}]`],
		["Character", `${getCharacterFullName(targetClient)}{mediumGrey}[${getPlayerCurrentSubAccount(targetClient).databaseId}]`],
		["Connected", `${getTimeDifferenceDisplay(getCurrentUnixTimestamp(), getPlayerData(targetClient).connectTime)} ago`],
		["Registered", `${registerDate.toLocaleDateString("en-GB")}`],
		["Game Version", `${targetClient.gameVersion}`],
		["Client Version", `${getPlayerData(targetClient).clientVersion}`],
		["Cash", `${getCurrencyString(getPlayerCurrentSubAccount(targetClient).cash)}`],
		["Bank", `${getCurrencyString(getPlayerCurrentSubAccount(targetClient).bank)}`],
		["Skin", `${skinName}{mediumGrey}[${skinModel}/${skinIndex}]{ALTCOLOUR}`],
		["Clan", `${clan}`],
		["Job", `${job}`],
		["Language", localeInfo],
		["Current Date", `${currentDate.toLocaleDateString("en-GB")}`],
		["Script Version", `${scriptVersion}`],
	];

	let stats = tempStats.map(stat => `{MAINCOLOUR}${stat[0]}: {ALTCOLOUR}${stat[1]} {MAINCOLOUR}`);

	let chunkedList = splitArrayIntoChunks(stats, 5);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function playerChangeAFKState(client, afkState) {
	if (getPlayerData(client) == null) {
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
					if (getPlayerData(clients[i]).ped == null) {
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

function updateServerGameTime() {
	if (isGameFeatureSupported("time")) {
		game.time.hour = serverConfig.hour;
		game.time.minute = serverConfig.minute;
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
			if (isPlayerLoggedIn(clients[i])) {
				if (typeof getPlayerData(clients[i]).accountData.flags.admin != "undefined") {
					if (getPlayerData(clients[i]).accountData.flags.admin > 0 || getPlayerData(clients[i]).accountData.flags.admin == -1) {
						admins.push(`{ALTCOLOUR}[${getPlayerData(clients[i]).accountData.staffTitle}]{MAINCOLOUR} ${getCharacterFullName(clients[i])}`);
					}
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
	if ((getCurrentUnixTimestamp() - getPlayerData(client).lastStuckCommand) < globalConfig.stuckCommandInterval) {
		messagePlayerError(client, "CantUseCommandYet");
		return false;
	}

	let dimension = getPlayerDimension(client);
	let interior = getPlayerInterior(client);

	messagePlayerAlert(client, getLocaleString(client, "FixingStuck"));

	if (typeof gameData.skinChangePosition[getGame()] != "undefined") {
		if (getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == V_RETURNTO_TYPE_SKINSELECT) {
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

			getPlayerData(client).returnToType = V_RETURNTO_TYPE_NONE;
		}
	}

	//if(getPlayerData(client).returnToPosition != null && getPlayerData(client).returnToType == V_RETURNTO_TYPE_ADMINGET) {
	//    messagePlayerError(client, `You were teleported by an admin and can't use the stuck command`);
	//    return false;
	//}

	if (dimension > 0) {
		let businesses = serverData.businesses;
		for (let i in businesses) {
			if (businesses[i].exitDimension == dimension) {
				setPlayerPosition(client, businesses[i].entrancePosition);
				setPlayerDimension(client, businesses[i].entranceDimension);
				setPlayerInterior(client, businesses[i].entranceInterior);

				return true;
			}
		}

		let houses = serverData.houses;
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
		setPlayerDimension(client, gameData.mainWorldDimension[getGame()]);
		setPlayerInterior(client, gameData.mainWorldInterior[getGame()]);
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

	makePedSpeak(getPlayerPed(client), params);
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

		if (getVehicleData(vehicle) == null) {
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
		if (getDistance(getPlayerPosition(client), getVehiclePosition(vehicle)) <= globalConfig.vehicleLockDistance) {
			if (getVehicleData(vehicle) == null) {
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

		if (getVehicleData(vehicle) == null) {
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
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (!isGameFeatureSupported("attachedBlip")) {
		return false;
	}

	if (serverConfig.createPlayerBlips) {
		return false;
	}

	let blip = createAttachedGameBlip(getPlayerPed(client), 0, 1, getPlayerColour(client));
	if (blip) {
		if (globalConfig.playerBlipStreamInDistance == -1 || globalConfig.playerBlipStreamOutDistance == -1) {
			//getPlayerPed(client).netFlags.distanceStreaming = false;
			getPlayerPed(client).streamInDistance = 999998;
			getPlayerPed(client).streamOutDistance = 999999;
		} else {
			//getPlayerPed(client).netFlags.distanceStreaming = true;
			setElementStreamInDistance(getPlayerPed(client), globalConfig.playerBlipStreamInDistance);
			setElementStreamOutDistance(getPlayerPed(client), globalConfig.playerBlipStreamOutDistance);
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
	}
	getPlayerData(client).playerBlip = null;
}

// ===========================================================================

function processPlayerDeath(client) {
	logToConsole(LOG_INFO, `Player ${getPlayerDisplayForConsole(client)} died.`);

	// Death is already being processed
	if (getPlayerData(client).pedState == V_PEDSTATE_DEAD) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.Events] Player ${getPlayerDisplayForConsole(client)} already in death ped state. Aborting death processing ...`);
		return false;
	}

	logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.Events] Player ${getPlayerDisplayForConsole(client)} ped state set to death and removing control`);
	getPlayerData(client).pedState = V_PEDSTATE_DEAD;
	updatePlayerSpawnedState(client, false);
	setPlayerControlState(client, false);

	logDeath(getPlayerCurrentSubAccount(client).databaseId, defaultNoAccountId, getPlayerPosition(client));

	if (isPlayerWorking(client)) {
		logToConsole(LOG_DEBUG, `[V.RP.Events] Player ${getPlayerDisplayForConsole(client)} died while working, forcing them to stop work ...`);
		stopWorking(client);
	}

	if (isPlayerInAnyVehicle(client)) {
		logToConsole(LOG_DEBUG, `[V.RP.Events] Player ${getPlayerDisplayForConsole(client)} died in a vehicle, forcing them out ...`);
		removePedFromVehicle(getPlayerPed(client));
	}

	if (isPlayerInPaintBall(client)) {
		logToConsole(LOG_DEBUG, `[V.RP.Events] Player ${getPlayerDisplayForConsole(client)} died in paintball ...`);
		getPlayerData(killer).paintBallKills++;
		getPlayerData(client).paintBallDeaths++;

		if (getPlayerData(killer).paintBallDeaths >= globalConfig.paintBallMaxKills) {
			let paintBallPlayers = getAllPlayersInBusiness(getPlayerData(client).paintBallBusiness);
			let winner = paintBallPlayers[i];
			for (let i in paintBallPlayers) {
				if (getPlayerData(paintBallPlayers[i]).paintBallKills > getPlayerData(winner).paintBallKills) {
					winner = paintBallPlayers[i];
				}
			}

			for (let i in paintBallPlayers) {
				showSmallGameMessage(paintBallPlayers[i], `${getLocaleString(paintBallPlayers[i], "PaintBallEnded")} ${getLocaleString(paintBallPlayers[i], "Winners", `${getCharacterFullName(winner)}`)}`);
				stopPaintBall(paintBallPlayers[i]);
			}
		} else {
			respawnPlayerForPaintBall(client);
			getPlayerData(client).pedState = V_PEDSTATE_READY;
		}
	} else {
		if (getPlayerCurrentSubAccount(client).inJail) {
			getPlayerData(client).pedState = V_PEDSTATE_INJAIL;

			let prisonCell = getFirstAvailablePrisonCell();

			getPlayerData(client).streamingRadioStation = -1;
			getPlayerData(client).interiorLights = true;

			let interior = 0;
			let dimension = 0;
			let scene = "";
			let businessData = false;

			if (prisonCell.businessId != 0) {
				businessData = getBusinessData(getBusinessIndexFromDatabaseId(prisonCell.businessId));
				interior = businessData.exitInterior;
				dimension = businessData.exitDimension;
				scene = businessData.exitScene;

				getPlayerData(client).streamingRadioStation = businessData.streamingRadioStationIndex;
				getPlayerData(client).interiorLights = businessData.interiorLights
			}

			if (!isSameScene(getPlayerCurrentSubAccount(client).scene, scene)) {
				initPlayerPropertySwitch(
					client,
					prisonCell.position,
					prisonCell.rotation,
					interior,
					dimension,
					-1,
					-1,
					scene
				);

				return false;
			}

			setTimeout(function () {
				if (isGameFeatureSupported("fadeCamera")) {
					fadePlayerCamera(client, false, 1000);
				}

				setTimeout(function () {
					despawnPlayer(client);
					getPlayerCurrentSubAccount(client).interior = interior;
					getPlayerCurrentSubAccount(client).dimension = dimension;

					if (isPlayerWorking(client)) {
						stopWorking(client);
					}

					spawnPlayer(client, prisonCell.position, prisonCell.rotation, gameData.skins[getGame()][getPlayerCurrentSubAccount(client).skin][0]);

					if (isGameFeatureSupported("fadeCamera")) {
						fadePlayerCamera(client, true, 1000);
					}

					updatePlayerSpawnedState(client, true);
					makePlayerStopAnimation(client);
					setPlayerControlState(client, true);
					resetPlayerBlip(client);
					getPlayerData(client).pedState = V_PEDSTATE_READY;
				}, 1000);
			}, 1000);
		} else {
			getPlayerData(client).pedState = V_PEDSTATE_DEAD;
			let closestHospital = getClosestHospital(getPlayerPosition(client));

			getPlayerData(client).streamingRadioStation = -1;
			getPlayerData(client).interiorLights = true;

			let interior = 0;
			let dimension = 0;
			let scene = "";
			let businessData = false;

			if (closestHospital.businessId != 0) {
				businessData = getBusinessData(getBusinessIndexFromDatabaseId(closestHospital.businessId));
				interior = businessData.exitInterior;
				dimension = businessData.exitDimension;
				scene = businessData.exitScene;

				getPlayerData(client).streamingRadioStation = businessData.streamingRadioStationIndex;
				getPlayerData(client).interiorLights = businessData.interiorLights
			}

			if (!isSameScene(getPlayerCurrentSubAccount(client).scene, scene)) {
				removePedFromVehicle(getPlayerPed(client));
				initPlayerPropertySwitch(
					client,
					closestHospital.position,
					closestHospital.rotation,
					interior,
					dimension,
					-1,
					-1,
					scene
				);

				return false;
			}

			setTimeout(function () {
				if (isGameFeatureSupported("fadeCamera")) {
					fadePlayerCamera(client, false, 1000);
				}

				setTimeout(function () {
					despawnPlayer(client);
					getPlayerCurrentSubAccount(client).interior = interior;
					getPlayerCurrentSubAccount(client).dimension = dimension;

					if (isPlayerWorking(client)) {
						stopWorking(client);
					}

					spawnPlayer(client, closestHospital.position, closestHospital.rotation, gameData.skins[getGame()][getPlayerCurrentSubAccount(client).skin][0]);

					if (isGameFeatureSupported("fadeCamera")) {
						fadePlayerCamera(client, true, 1000);
					}

					updatePlayerSpawnedState(client, true);
					makePlayerStopAnimation(client);
					setPlayerControlState(client, true);
					resetPlayerBlip(client);
					getPlayerData(client).pedState = V_PEDSTATE_READY;
				}, 1000);
			}, 1000);
		}

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
}

// ===========================================================================

function isPlayerSurrendered(client) {
	return (getPlayerData(client).pedState == V_PEDSTATE_TAZED || getPlayerData(client).pedState == V_PEDSTATE_HANDSUP);
}

// ===========================================================================

function isPlayerRestrained(client) {
	return (getPlayerData(client).pedState == V_PEDSTATE_BINDED);
}

// ===========================================================================

function getPlayerInPropertyData(client) {
	let businessId = getPlayerBusiness(client);
	if (businessId != -1) {
		getPlayerData(client).inProperty = [V_PROPERTY_TYPE_BUSINESS, businessId];
		return false;
	}

	let houseId = getPlayerHouse(client);
	if (houseId != -1) {
		getPlayerData(client).inProperty = [V_PROPERTY_TYPE_HOUSE, houseId];
		return false;
	}

	getPlayerData(client).inProperty = null;
}

// ===========================================================================

function scoreBoardCommand(command, params, client) {
	// Handled client side
	return false;
}

// ===========================================================================

function locatePlayerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!isPlayerSpawned(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeSpawned"));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!isPlayerSpawned(targetClient)) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	messagePlayerInfo(client, getLocaleString(client, "PlayerLocateDistanceAndDirection", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`, `{ALTCOLOUR}${Math.round(getDistance(getPlayerPosition(client), getPlayerPosition(targetClient)))} ${getLocaleString(client, "Meters")}{MAINCOLOUR}`, `{ALTCOLOUR}${getGroupedLocaleString(client, "CardinalDirections", getCardinalDirectionName(getCardinalDirection(getPlayerPosition(client), getPlayerPosition(targetClient))))}`))
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
function givePlayerMoneyCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let amount = toInteger(getParam(params, " ", 2));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getDistance(getPlayerPosition(client), getPlayerPosition(targetClient)) > globalConfig.givePlayerMoneyDistance) {
		messagePlayerError(client, getLocaleString(client, "PlayerTooFar", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).cash < amount) {
		messagePlayerError(client, getLocaleString(client, "NotEnoughCashNeedAmountMore", `{ALTCOLOUR}${amount - getPlayerCurrentSubAccount(client).cash}{MAINCOLOUR}`));
		return false;
	}

	takePlayerCash(client, toInteger(amount));
	givePlayerCash(targetClient, toInteger(amount));

	updatePlayerCash(client);
	updatePlayerCash(targetClient);

	messagePlayerAlert(client, getLocaleString(client, "GaveMoneyToPlayer", `{ALTCOLOUR}${getCurrencyString(amount)}{MAINCOLOUR}`, `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));
	messagePlayerAlert(targetClient, getLocaleString(targetClient, "ReceivedMoneyFromPlayer", `{ALTCOLOUR}${getCharacterFullName(client)}{MAINCOLOUR}`, `{ALTCOLOUR}${getCurrencyString(amount)}{MAINCOLOUR}`));
}

// ===========================================================================

function detainPlayerCommand(command, params, client) {
	let targetClient = getClosestPlayer(getPlayerPosition(client), client);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getDistance(getPlayerPosition(client), getPlayerPosition(targetClient)) > globalConfig.detainPlayerDistance) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	let targetVehicle = getClosestVehicle(getPlayerPosition(client));

	if (!targetVehicle) {
		messagePlayerError(client, getLocaleString(client, "InvalidVehicle"));
		return false;
	}

	if (getDistance(getPlayerPosition(client), getVehiclePosition(targetVehicle)) > globalConfig.detainPlayerDistance) {
		messagePlayerError(client, getLocaleString(client, "VehicleTooFar"));
		return false;
	}

	if (getVehicleData(targetVehicle).locked) {
		showVehicleLockedMessageForPlayer(client, targetVehicle);
		return false;
	}

	meActionToNearbyPlayers(client, `throws ${getCharacterFullName(targetClient)} into the back of the ${getVehicleName(targetVehicle)}`);
	stopDraggingPlayer(client, targetClient);
	setPlayerControlState(targetClient, false);
	warpPedIntoVehicle(getPlayerPed(targetClient), targetVehicle, getFirstFreeRearVehicleSeat(targetVehicle));
}

// ===========================================================================

function searchPlayerCommand(command, params, client) {
	let targetClient = getClosestPlayer(getPlayerPosition(client), client);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getDistance(getPlayerPosition(client), getPlayerPosition(targetClient)) > globalConfig.detainPlayerDistance) {
		messagePlayerError(client, getLocaleString(client, "PlayerTooFar"));
		return false;
	}

	if (!isPlayerSurrendered(targetClient)) {
		messagePlayerError(client, getLocaleString(client, "MustBeSurrendered"));
		return false;
	}

	meActionToNearbyPlayers(client, `frisks ${getCharacterFullName(targetClient)}, checking for items`);
	showPlayerInventoryToPlayer(client, targetClient);
}

// ===========================================================================

function dragPlayerCommand(command, params, client) {
	if (getPlayerData(client).draggingPlayer != null) {
		meActionToNearbyPlayers(client, `stops dragging ${getCharacterFullName(getPlayerData(client).draggingPlayer)}`);
		stopDraggingPlayer(client, getPlayerData(client).draggingPlayer);
		return false;
	}

	let targetClient = getClosestPlayer(getPlayerPosition(client), client);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getDistance(getPlayerPosition(client), getPlayerPosition(targetClient)) > globalConfig.detainPlayerDistance) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (!isPlayerRestrained(targetClient)) {
		messagePlayerError(client, getLocaleString(client, "MustBeRestrained"));
		return false;
	}

	startDraggingPlayer(client, targetClient);
	meActionToNearbyPlayers(client, `starts dragging ${getCharacterFullName(getPlayerData(client).draggingPlayer)}`);
}

// ===========================================================================

function processPlayerDragging() {
	serverData.draggingPlayersCache.forEach(function (dragData) {
		setPlayerPosition(dragData.draggedPlayer, getPlayerPosition(dragData.draggingPlayer));
	});
}

// ===========================================================================

function stopDraggingPlayer(draggingPlayer, draggedPlayer) {
	for (let i in serverData.draggingPlayersCache) {
		if (serverData.draggingPlayersCache[i].draggingPlayer == draggingPlayer && serverData.draggingPlayersCache[i].draggedPlayer == draggedPlayer) {
			serverData.draggingPlayersCache.splice(i, 1);
			break;
		}
	}

	getPlayerData(draggedPlayer).draggedByPlayer = null;
	getPlayerData(draggingPlayer).draggingPlayer = null;
}

// ===========================================================================

function startDraggingPlayer(draggingPlayer, draggedPlayer) {
	getPlayerData(draggedPlayer).draggedByPlayer = draggingPlayer;
	getPlayerData(draggingPlayer).draggingPlayer = draggedPlayer;

	serverData.draggingPlayersCache.push({
		draggingPlayer: draggingPlayer,
		draggedPlayer: draggedPlayer
	});
}

// ===========================================================================

function afkCommand(command, params, client) {
	if (getPlayerData(client).afk == true) {
		messagePlayerNormal(client, getLocaleString(client, "DisabledAFK"));
		getPlayerData(client).afk = false;
		updatePlayerNameTag(client);
	} else {
		messagePlayerNormal(client, getLocaleString(client, "EnabledAFK"));
		getPlayerData(client).afk = true;
		updatePlayerNameTag(client);
	}
}

// ===========================================================================

function showPlayerSelectableList(client, title, items) {
	getPlayerData(client).selectableListItems = items;
	if (doesPlayerUseGUI(client)) {
		showPlayerListGUI(client, title, items);
	} else {
		showPlayerListInChat(client, title, items);
	}
}

// ===========================================================================

function showPlayerListInChat(client, title, items, chunks = 1, delimiter = ", ") {
	messagePlayerNormal(client, makeChatBoxSectionHeader(title));

	let chunkedList = splitArrayIntoChunks(items, chunks);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(delimiter));
	}
}

// ===========================================================================

function saveNonRPNameToDatabase(firstName, lastName, forAccountId = defaultNoAccountId, whoAdded = defaultNoAccountId) {
	let dbConnection = connectToDatabase();
	let safeFirstName = escapeDatabaseString(dbConnection, firstName);
	let safeLastName = escapeDatabaseString(dbConnection, lastName);

	queryDatabase(dbConnection, `INSERT INTO log_nonrpname (log_nonrpname_first, log_nonrpname_last, log_nonrpname_server, log_nonrpname_acct, log_nonrpname_who_added, log_nonrpname_when_added) VALUES ('${safeFirstName}', '${safeLastName}', ${getServerId()}, ${forAccountId}, ${whoAdded}, ${getCurrentUnixTimestamp()})`);

	disconnectFromDatabase(dbConnection);
}

// ===========================================================================

function isNonRPName(firstName, lastName) {
	// Don't allow duplicate first and last names
	if (toLowerCase(firstName) == toLowerCase(lastName)) {
		return true;
	}

	let dbConnection = connectToDatabase();
	let safeFirstName = escapeDatabaseString(dbConnection, firstName);
	let safeLastName = escapeDatabaseString(dbConnection, lastName);

	let queryAssoc = fetchQueryAssoc(dbConnection, `SELECT * FROM log_nonrpname WHERE log_nonrpname_first = '${safeFirstName}' AND log_nonrpname_last = '${safeLastName}' LIMIT 1`);
	if (queryAssoc.length > 0) {
		return true;
	}

	return false;
}

// ===========================================================================

function logDeath(whoDied = defaultNoAccountId, whoKilled = defaultNoAccountId, position = toVector3(0.0, 0.0, 0.0)) {
	if (serverConfig.devServer) {
		return false;
	}

	let dbConnection = connectToDatabase();

	queryDatabase(dbConnection, `INSERT INTO log_death (log_death_server, log_death_who_died, log_death_who_killed, log_death_timestamp, log_death_pos_x, log_death_pos_y, log_death_pos_z) VALUES (${getServerId()}, ${whoDied}, ${whoKilled}, UNIX_TIMESTAMP(), ${position.x}, ${position.y}, ${position.z})`);
	disconnectFromDatabase(dbConnection);
}

// ===========================================================================