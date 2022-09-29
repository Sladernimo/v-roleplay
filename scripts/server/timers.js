// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: timers.js
// DESC: Provides timer functions and features
// TYPE: Server (JavaScript)
// ===========================================================================

let serverTimers = {};

// ===========================================================================

function saveServerDataToDatabase() {
	if (getServerConfig().pauseSavingToDatabase) {
		return false;
	}

	logToConsole(LOG_DEBUG, "[AGRP.Utilities]: Saving all server data to database ...");

	try {
		saveAllPlayersToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save players to database: ${error}`);
	}

	try {
		saveAllClansToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save clans to database: ${error}`);
	}

	try {
		saveAllHousesToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save houses to database: ${error}`);
	}

	try {
		saveAllBusinessesToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save businesses to database: ${error}`);
	}

	try {
		saveAllVehiclesToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save vehicles to database: ${error}`);
	}

	try {
		saveAllItemTypesToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save item types to database: ${error}`);
	}

	try {
		saveAllItemsToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save items to database: ${error}`);
	}

	try {
		saveAllJobsToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save jobs to database: ${error}`);
	}

	try {
		saveAllNPCsToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save NPCs to database: ${error}`);
	}

	try {
		saveAllGatesToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save gates to database: ${error}`);
	}

	try {
		saveServerConfigToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save server config to database: ${error}`);
	}

	logToConsole(LOG_DEBUG, "[AGRP.Utilities]: Saved all server data to database!");
}

// ===========================================================================

function initTimers() {
	//if (isDevelopmentServer()) {
	//	return false;
	//}

	serverTimers.updatePingsTimer = setInterval(updatePings, 5000);
	serverTimers.oneMinuteTimer = setInterval(oneMinuteTimerFunction, 60000);
	serverTimers.tenMinuteTimer = setInterval(tenMinuteTimerFunction, 600000);
	serverTimers.thirtyMinuteTimer = setInterval(thirtyMinuteTimerFunction, 1800000);
}

// ===========================================================================

function oneMinuteTimerFunction() {
	logToConsole(LOG_DEBUG, `[AGRP.Event] Checking server game time`);
	checkServerGameTime();

	if (getClients().length > 0) {
		logToConsole(LOG_DEBUG, `[AGRP.Event] Checking rentable vehicles`);
		checkVehicleRenting();

		logToConsole(LOG_DEBUG, `[AGRP.Event] Updating all player name tags`);
		updateAllPlayerNameTags();
	}

	logToConsole(LOG_DEBUG, `[AGRP.Event] Collecting all garbage`);
	collectAllGarbage();
}

// ===========================================================================

function tenMinuteTimerFunction() {
	//showRandomTipToAllPlayers();
	//saveServerDataToDatabase();
	//checkInactiveVehicleRespawns();
}

// ===========================================================================

function thirtyMinuteTimerFunction() {
	if (getClients().length > 0) {
		checkPayDays();
	}
	saveServerDataToDatabase();
	checkInactiveVehicleRespawns();
}

// ===========================================================================

function checkVehicleRenting() {
	let renting = getServerData().rentingVehicleCache;
	for (let i in renting) {
		if (isClientInitialized(renting[i])) {
			if (getPlayerData(renting[i]) != false) {
				if (isPlayerLoggedIn(renting[i] && isPlayerSpawned(renting[i]))) {
					if (getPlayerData(renting[i]).rentingVehicle != false) {
						if (getPlayerCurrentSubAccount(renting[i]).cash < getServerData().vehicles[getPlayerData(renting[i]).rentingVehicle].rentPrice) {
							messagePlayerAlert(renting[i], `You do not have enough money to continue renting this vehicle!`);
							stopRentingVehicle(renting[i]);
						} else {
							takePlayerCash(renting[i], getServerData().vehicles[getPlayerData(renting[i]).rentingVehicle].rentPrice);
						}
					}
				}
			}
		}
	}

	/*
	for(let i in getServerData().vehicles) {
		if(getServerData().vehicles[i] != null) {
			if(getServerData().vehicles[i].rentPrice > 0) {
				if(getServerData().vehicles[i].rentedBy != false) {
					let rentedBy = getServerData().vehicles[i].rentedBy;
					if(getPlayerData(rentedBy) != false) {
						if(getPlayerCurrentSubAccount(rentedBy).cash < getServerData().vehicles[i].rentPrice) {
							messagePlayerAlert(rentedBy, `You do not have enough money to continue renting this vehicle!`);
							stopRentingVehicle(rentedBy);
						} else {
							takePlayerCash(rentedBy, getServerData().vehicles[i].rentPrice);
						}
					}
				}
			}
		}
	}
	*/
}

// ===========================================================================

function updatePings() {
	if (getClients().length == 0) {
		return false;
	}

	let clients = getClients();
	for (let i in clients) {
		if (isClientInitialized(clients[i])) {
			if (!clients[i].console) {
				updatePlayerPing(clients[i]);
				if (isPlayerSpawned(clients[i])) {
					updatePlayerCash(clients[i]);
				}
			}
		}
	}
}

// ===========================================================================

function checkServerGameTime() {
	//logToConsole(LOG_DEBUG | LOG_WARN, "[AGRP.Timers] Checking server game time");

	//if (isGameFeatureSupported("time")) {
	//	return false;
	//}

	if (!getServerConfig().useRealTime) {
		if (getServerConfig().minute >= 59) {
			getServerConfig().minute = 0;
			if (getServerConfig().hour >= 23) {
				getServerConfig().hour = 0;
			} else {
				getServerConfig().hour = getServerConfig().hour + 1;
			}
		} else {
			getServerConfig().minute = getServerConfig().minute + 1;
		}
	} else {
		let dateTime = getCurrentTimeStampWithTimeZone(getServerConfig().realTimeZone);
		getServerConfig().hour = dateTime.getHours();
		getServerConfig().minute = dateTime.getMinutes();
	}

	if (getGame() == AGRP_GAME_MAFIA_ONE) {
		if (getGameConfig().mainWorldScene[getGame()] == "FREERIDE") {
			if (isServerGoingToChangeMapsSoon(getServerConfig().hour, getServerConfig().minute)) {
				sendMapChangeWarningToPlayer(null, true);
			}

			if (isNightTime(getServerConfig().hour)) {
				getGameConfig().mainWorldScene[getGame()] = "FREERIDENOC";
				removeAllPlayersFromProperties();
				removeAllPlayersFromVehicles();
				saveServerDataToDatabase();
				logToConsole(LOG_INFO | LOG_WARN, `[AGRP.Timers] Changing server map to night`);
				messageDiscordEventChannel("🌙 Changing server map to night");
				game.changeMap(getGameConfig().mainWorldScene[getGame()]);
			}
		} else if (getGameConfig().mainWorldScene[getGame()] == "FREERIDENOC") {
			if (isServerGoingToChangeMapsSoon(getServerConfig().hour, getServerConfig().minute)) {
				sendMapChangeWarningToPlayer(null, true);
			}

			if (!isNightTime(getServerConfig().hour)) {
				getGameConfig().mainWorldScene[getGame()] = "FREERIDE";
				removeAllPlayersFromProperties();
				removeAllPlayersFromVehicles();
				saveServerDataToDatabase();
				logToConsole(LOG_INFO | LOG_WARN, `[AGRP.Timers] Changing server map to day`);
				messageDiscordEventChannel("🌞 Changing server map to day");
				game.changeMap(getGameConfig().mainWorldScene[getGame()]);
			}
		}
	}

	if (isGameFeatureSupported("time")) {
		game.time.hour = getServerConfig().hour;
		game.time.minute = getServerConfig().minute;
	}

	updateTimeRule();
}

// ===========================================================================

function checkPayDays() {
	if (getClients().length == 0) {
		return false;
	}

	let clients = getClients();
	for (let i in clients) {
		if (isClientInitialized(clients[i])) {
			if (isPlayerLoggedIn(clients[i]) && isPlayerSpawned(clients[i])) {
				getPlayerData(clients[i]).payDayStart = sdl.ticks;
				playerPayDay(clients[i]);

				//if(sdl.ticks-getPlayerData(clients[i]).payDayTickStart >= getGlobalConfig().payDayTickCount) {
				//	getPlayerData(clients[i]).payDayStart = sdl.ticks;
				//	playerPayDay(clients[i]);
				//}
			}
		}
	}

	for (let i in getServerData().businesses) {
		if (getBusinessData(i).ownerType != AGRP_BIZ_OWNER_NONE && getBusinessData(i).ownerType != AGRP_BIZ_OWNER_PUBLIC && getBusinessData(i).ownerType != AGRP_BIZ_OWNER_FACTION) {
			getBusinessData(i).till += 1000;
		}
	}
}

// ===========================================================================

function showRandomTipToAllPlayers() {
	if (getClients().length == 0) {
		return false;
	}

	let clients = getClients();
	for (let i in clients) {
		if (isClientInitialized(clients[i])) {
			if (isPlayerLoggedIn(clients[i]) && isPlayerSpawned(clients[i])) {
				if (!doesPlayerHaveRandomTipsDisabled(clients[i])) {
					let localeId = getPlayerData(clients[i]).locale;
					let tipId = getRandom(0, getServerData().localeStrings[localeId]["RandomTips"].length - 1);
					messagePlayerTip(clients[i], getGroupedLocaleString(clients[i], "RandomTips", tipId));
				}
			}
		}
	}
}

// ===========================================================================

function checkInactiveVehicleRespawns() {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for (let i in vehicles) {
		if (getVehicleData(vehicles[i] != false)) {
			if (isVehicleUnoccupied(vehicles[i])) {
				if (getVehicleData(vehicles[i]).lastActiveTime != false) {
					if (getCurrentUnixTimestamp() - getVehicleData(vehicles[i]).lastActiveTime >= getGlobalConfig().vehicleInactiveRespawnDelay) {
						respawnVehicle(vehicles[i]);
						getVehicleData(vehicles[i]).lastActiveTime = false;
					}
				}
			} else {
				getVehicleData(vehicles[i]).lastActiveTime = getCurrentUnixTimestamp();
			}
		}
	}
}

// ===========================================================================