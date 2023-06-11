// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: radio.js
// DESC: Provides radio station streaming
// TYPE: Server (JavaScript)
// ===========================================================================

class RadioStationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.url = "";
		this.genre = "";
		this.codec = "";
		this.index = -1;
		this.isFile = false;
		this.fileLength = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["radio_id"]);
			this.name = toString(dbAssoc["radio_name"]);
			this.url = toString(dbAssoc["radio_url"]);
			this.genre = toString(dbAssoc["radio_genre"]);
			this.codec = toInteger(dbAssoc["radio_codec"]);
			this.isFile = intToBool(dbAssoc["radio_is_file"]);
			this.fileLength = toInteger(dbAssoc["radio_file_length"]);
		}
	}
};

// ===========================================================================

function initRadioScript() {
	logToConsole(LOG_INFO, "[V.RP.Radio]: Initializing radio script ...");
	logToConsole(LOG_INFO, "[V.RP.Radio]: Radio script initialized successfully!");
	return true;
}

// ===========================================================================

function loadRadioStationsFromDatabase() {
	logToConsole(LOG_INFO, "[V.RP.Radio]: Loading radio stations from database ...");
	let dbConnection = connectToDatabase();
	let tempRadioStations = [];
	let dbAssoc = [];
	if (dbConnection) {
		let dbQueryString = `SELECT * FROM radio_main`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempRadioStationData = new RadioStationData(dbAssoc[i]);
				tempRadioStations.push(tempRadioStationData);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_INFO, `[V.RP.Radio]: ${tempRadioStations.length} radio stations loaded from database successfully!`);
	return tempRadioStations;
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
function playStreamingRadioCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		messagePlayerInfo(client, "Use /radiostations for a list of available radio stations.");
		return false;
	}

	let radioStationId = -1;
	if (toLowerCase(params) != "none") {
		radioStationId = getRadioStationFromParams(params);

		if (getRadioStationData(radioStationId) == null) {
			messagePlayerError(client, getLocaleString(client, "InvalidRadioStation"));
			return false;
		}
	}

	if (isPlayerInAnyVehicle(client)) {
		let vehicle = getPlayerVehicle(client);

		if (getVehicleData(vehicle) == null) {
			messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
			return false;
		}

		if (radioStationId == -1) {
			getVehicleData(vehicle).streamingRadioStation = -1;
			getVehicleData(vehicle).needsSaved = true;
			getPlayerData(client).streamingRadioStation = -1;
			meActionToNearbyPlayers(client, `turns off their vehicle's radio`);

			let clients = getClients();
			for (let i in clients) {
				if (getPlayerVehicle(client) == getPlayerVehicle(clients[i])) {
					playRadioStreamForPlayer(clients[i], "");
				}
			}
			return false;
		}

		getVehicleData(vehicle).streamingRadioStation = radioStationId;
		getPlayerData(client).streamingRadioStation = radioStationId;
		meActionToNearbyPlayers(client, getLocaleString(client, "ActionVehicleRadioStationChange", getRadioStationData(radioStationId).name, getRadioStationData(radioStationId).genre));

		let clients = getClients();
		for (let i in clients) {
			if (vehicle == getPlayerVehicle(clients[i])) {
				playRadioStreamForPlayer(clients[i], getRadioStationData(radioStationId).url, true, getPlayerStreamingRadioVolume(client));
			}
		}
	} else {
		if (isPlayerInAnyHouse(client)) {
			let houseId = getPlayerHouse(client);
			if (radioStationId == -1) {
				getHouseData(houseId).streamingRadioStationIndex = -1;
				getHouseData(houseId).streamingRadioStationIndex = 0;
				getHouseData(houseId).needsSaved = true;
				getPlayerData(client).streamingRadioStation = -1;
				meActionToNearbyPlayers(client, `turns off the house radio`);

				let clients = getClients();
				for (let i in clients) {
					if (getPlayerHouse(client) == houseId) {
						playRadioStreamForPlayer(clients[i], "");
					}
				}
			} else {
				getHouseData(houseId).streamingRadioStationIndex = radioStationId;
				getHouseData(houseId).streamingRadioStation = getRadioStationData(radioStationId).databaseId;
				getHouseData(houseId).needsSaved = true;
				getPlayerData(client).streamingRadioStation = radioStationId;
				meActionToNearbyPlayers(client, getLocaleString(client, "ActionHouseRadioStationChange", getRadioStationData(radioStationId).name, getRadioStationData(radioStationId).genre));

				let clients = getClients();
				for (let i in clients) {
					if (getPlayerHouse(client) == houseId) {
						playRadioStreamForPlayer(clients[i], getRadioStationData(radioStationId).url, true, getPlayerStreamingRadioVolume(clients[i]));
					}
				}
			}
		} else if (isPlayerInAnyBusiness(client)) {
			let businessId = getPlayerBusiness(client);
			if (radioStationId == -1) {
				getBusinessData(businessId).streamingRadioStation = 0;
				getBusinessData(businessId).streamingRadioStationIndex = -1;
				getBusinessData(businessId).needsSaved = true;
				getPlayerData(client).streamingRadioStation = -1;
				meActionToNearbyPlayers(client, `turns off the business radio`);

				let clients = getClients();
				for (let i in clients) {
					if (getPlayerBusiness(clients[i]) == businessId) {
						stopRadioStreamForPlayer(clients[i]);
					}
				}
			} else {
				getBusinessData(businessId).streamingRadioStationIndex = radioStationId;
				getBusinessData(businessId).streamingRadioStation = getRadioStationData(radioStationId).databaseId;
				getBusinessData(businessId).needsSaved = true;
				getPlayerData(client).streamingRadioStation = radioStationId;
				meActionToNearbyPlayers(client, getLocaleString(client, "ActionBusinessRadioStationChange", getRadioStationData(radioStationId).name, getRadioStationData(radioStationId).genre));

				let clients = getClients();
				for (let i in clients) {
					if (getPlayerBusiness(clients[i]) == businessId) {
						playRadioStreamForPlayer(clients[i], getRadioStationData(radioStationId).url, true, getPlayerStreamingRadioVolume(clients[i]));
					}
				}
			}
		} else {
			messagePlayerError(client, getLocaleString(client, "RadioStationLocationInvalid"));
			return false;
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
function setStreamingRadioVolumeCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let volumeLevel = params;

	if (isNaN(volumeLevel)) {
		messagePlayerError(client, getLocaleString(client, "RadioVolumeNotNumber"));
		return false;
	}

	setPlayerStreamingRadioVolume(client, toInteger(volumeLevel));
	getPlayerData(client).accountData.streamingRadioVolume = toInteger(volumeLevel);
	let volumeEmoji = '';
	if (volumeLevel >= 60) {
		volumeEmoji = '🔊';
	} else if (volumeLevel >= 30 && volumeLevel < 60) {
		volumeEmoji = '🔉';
	} else if (volumeLevel > 0 && volumeLevel < 30) {
		volumeEmoji = '🔈';
	} else if (volumeLevel <= 0) {
		volumeEmoji = '🔇';
	}

	messagePlayerSuccess(client, getLocaleString(client, "RadioVolumeChanged", volumeEmoji, volumeLevel));
}

// ===========================================================================

function getPlayerStreamingRadioVolume(client) {
	if (getPlayerData(client) == null || !isPlayerLoggedIn(client) || !isPlayerSpawned(client)) {
		return 20;
	}
	return getPlayerData(client).accountData.streamingRadioVolume;
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
function showRadioStationListCommand(command, params, client) {
	let stationList = serverData.radioStations.map(function (x) { return `{chatBoxListIndex}${toInteger(x.index) + 1}: {MAINCOLOUR}${x.name}`; });

	let chunkedList = splitArrayIntoChunks(stationList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderRadioStationsList")));

	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function setAllRadioStationDataIndexes() {
	for (let i in serverData.radioStations) {
		serverData.radioStations[i].index = i;
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
function reloadAllRadioStationsCommand(command, params, client) {
	stopRadioStreamForPlayer(null);
	serverData.radioStations = [];
	serverData.radioStations = loadRadioStationsFromDatabase();
	setRadioStationIndexes();

	announceAdminAction(`AllRadioStationsReloaded`);
}

// ===========================================================================

function getRadioStationFromParams(params) {
	if (isNaN(params)) {
		for (let i in serverData.radioStations) {
			if (toLowerCase(serverData.radioStations[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof serverData.radioStations[params - 1] != "undefined") {
			return toInteger(params - 1);
		}
	}

	return -1;
}

// ===========================================================================

function getRadioStationIdFromDatabaseId(databaseId) {
	if (databaseId <= 0) {
		return -1;
	}

	for (let i in serverData.radioStations) {
		if (serverData.radioStations[i].databaseId == databaseId) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

/**
 * @param {Number} radioStationIndex - The data index of the radio station
 * @return {RadioStationData} The radio station's data (class instance)
 */
function getRadioStationData(radioStationIndex) {
	if (radioStationIndex == -1) {
		return null;
	}

	if (typeof serverData.radioStations[radioStationIndex] != "undefined") {
		return serverData.radioStations[radioStationIndex];
	}

	return null;
}

// ===========================================================================

function radioTransmitCommand(command, params, client) {
	let frequency = getPossibleRadioTransmitFrequency(client);

	if (frequency == -1) {
		messagePlayerError(client, getLocaleString(client, "NoRadioToUse"));
		return false;
	}

	sendRadioTransmission(frequency, params, client);
}

// ===========================================================================

function sendRadioTransmission(frequency, messageText, sentFromClient) {
	let seenClients = [];
	let clients = getClients();

	for (let i in clients) {
		if (seenClients.indexOf(clients[i]) == -1) {
			if (getDistance(getPlayerPosition(clients[i]), getPlayerPosition(sentFromClient)) <= globalConfig.talkDistance) {
				seenClients.push(clients[i]);
				messagePlayerNormal(clients[i], `[#CCCCCC]${getCharacterFullName(sentFromClient)} {ALTCOLOUR}(to radio): {MAINCOLOUR}${messageText}`);
			}
		}
	}

	let vehicles = serverData.vehicles;
	for (let i in vehicles) {
		if (serverData.vehicles[i].radioFrequency == frequency) {
			for (let j in clients) {
				if (seenClients.indexOf(clients[j]) == -1) {
					if (getDistance(getPlayerPosition(clients[j]), getVehiclePosition(serverData.vehicles[i].vehicle)) <= globalConfig.transmitRadioSpeakerDistance) {
						seenClients.push(clients[j]);
						messagePlayerNormal(clients[j], `📻 {ALTCOLOUR}(On Radio): {MAINCOLOUR}${messageText}`);
					}
				}
			}
		}
	}

	let items = serverData.items;
	for (let i in items) {
		if (items[i] != null) {
			if (items[i].enabled) {
				if (getItemTypeData(items[i].itemTypeIndex).useType == V_ITEM_USE_TYPE_WALKIETALKIE) {
					if (items[i].value == frequency) {
						for (let j in clients) {
							if (seenClients.indexOf(clients[j]) == -1) {
								if (getDistance(getPlayerPosition(clients[j], getItemPosition(i))) <= globalConfig.transmitRadioSpeakerDistance) {
									seenClients.push(clients[j]);
									messagePlayerNormal(clients[j], `📻 {ALTCOLOUR}(On Radio): {MAINCOLOUR}${messageText}`);
								}
							}
						}
					}
				}
			}
		}
	}
}

// ===========================================================================

function setRadioFrequencyCommand(command, params, client) {
	// Needs finished
	return false;

	/*
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, ``);
		return false;
	}

	params = toInteger(params);

	if (params < 100 || params > 500) {
		messagePlayerError(client, `The frequency channel must be between 100 and 500!`);
		return false;
	}

	if (!getPlayerActiveItem(client)) {
		messagePlayerError(client, `You aren't holding a walkie talkie!`);
		return false;
	}

	if (!getItemData(getPlayerActiveItem(client))) {
		messagePlayerError(client, `You aren't holding a walkie talkie!`);
		return false;
	}

	if (getItemData(getPlayerActiveItem(client)).enabled) {
		if (!doesPlayerHaveKeyBindsDisabled(client) && doesPlayerHaveKeyBindForCommand(client, "use")) {
			messagePlayerError(client, `Your walkie talkie is turned off. Press ${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "use")).key)} to turn it on`);
		} else {
			messagePlayerError(client, `Your walkie talkie is turned off. Type {ALTCOLOUR}/use {MAINCOLOUR}to turn it on`);
		}
		return false;
	}

	getItemData(getPlayerActiveItem(client)).value = params * 100;
	messagePlayerSuccess(client, getLocaleString(client, "FrequencyChannelChanged", `Walkie Talkie`, `${getPlayerData(client).activeHotBarSlot + 1}`, `${getItemValueDisplayForItem(getPlayerActiveItem(client))}`));
	*/
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
function setRadioStationURLCommand(command, params, client) {
	let radioStationIndex = getRadioStationFromParams(getParam(params, " ", 1));
	let url = params.split(" ").slice(1).join(" ");

	if (getRadioStationData(radioStationIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidRadioStation"));
		return false;
	}

	getRadioStationData(radioStationIndex).url = url;
	getRadioStationData(radioStationIndex).needsSaved = true;

	let clients = getClients();
	for (let i in clients) {
		if (getPlayerData(clients[i]).streamingRadioStation == radioStationIndex) {
			stopRadioStreamForPlayer(clients[i]);
			playRadioStreamForPlayer(clients[i], getRadioStationData(radioStationIndex).url, false, getPlayerStreamingRadioVolume(client));
		}
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} has changed the URL for radio station {ALTCOLOUR}${getRadioStationData(radioStationIndex).name}{MAINCOLOUR} to {ALTCOLOUR}${url}`);
}

// ===========================================================================

function getPossibleRadioTransmitFrequency(client) {
	let possibleRadio = getPlayerFirstItemSlotByUseType(client, V_ITEM_USE_TYPE_WALKIETALKIE);

	if (possibleRadio != -1) {
		if (getItemData(possibleRadio).enabled) {
			return getItemData(possibleRadio).value;
		}
	}

	let vehicle = null;
	if (isPlayerInAnyVehicle(client)) {
		vehicle = getPlayerVehicle(client);
	} else {
		let tempVehicle = getClosestVehicle(getPlayerPosition(client));
		if (getDistance(getPlayerPosition(client), getVehiclePosition(tempVehicle)) <= globalConfig.vehicleTrunkDistance) {
			vehicle = tempVehicle;
		}
	}

	if (vehicle != null) {
		if (doesVehicleHaveTransmitRadio(vehicle)) {
			return getVehicleData(vehicle).radioFrequency;
		}
	}

	if (getPlayerJob(client) != -1) {
		if (getJobData(getPlayerJob(client)).radioFrequency != 0) {
			let callBoxIndex = getClosestCallBox(getPlayerPosition(client));
			if (callBoxIndex != -1) {
				if (getCallBoxData(callBoxIndex) != null) {
					return getJobData(getPlayerJob(client)).radioFrequency;
				}
			}
		}
	}
}

// ===========================================================================