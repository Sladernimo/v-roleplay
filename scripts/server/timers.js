// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: timers.js
// DESC: Provides timer functions and features
// TYPE: Server (JavaScript)
// ===========================================================================

let serverTimers = {};

// ===========================================================================

function saveServerDataToDatabase() {
	if(getServerConfig().pauseSavingToDatabase) {
		return false;
	}

	logToConsole(LOG_DEBUG, "[VRR.Utilities]: Saving all server data to database ...");

	try {
		saveAllPlayersToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save players to database: ${error}`);
	}

	try {
		saveAllClansToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save clans to database: ${error}`);
	}

	try {
		saveAllHousesToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save houses to database: ${error}`);
	}

	try {
		saveAllBusinessesToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save businesses to database: ${error}`);
	}

	try {
		saveAllVehiclesToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save vehicles to database: ${error}`);
	}

	try {
		saveAllItemTypesToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save item types to database: ${error}`);
	}

	try {
		saveAllItemsToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save items to database: ${error}`);
	}

	try {
		saveAllJobsToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save jobs to database: ${error}`);
	}

	try {
		saveAllNPCsToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save NPCs to database: ${error}`);
	}

	try {
		saveAllGatesToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save gates to database: ${error}`);
	}

	try {
		saveServerConfigToDatabase();
	} catch(error) {
		logToConsole(LOG_ERROR, `Could not save server config to database: ${error}`);
	}

	logToConsole(LOG_DEBUG, "[VRR.Utilities]: Saved all server data to database!");
}

// ===========================================================================

function initTimers() {
	//if(!isDevelopmentServer()) {
		serverTimers.updatePingsTimer = setInterval(updatePings, 5000);
		serverTimers.oneMinuteTimer = setInterval(oneMinuteTimerFunction, 60000);
		serverTimers.fifteenMinuteTimer = setInterval(tenMinuteTimerFunction, 600000);
		serverTimers.thirtyMinuteTimer = setInterval(thirtyMinuteTimerFunction, 1800000);
	//}
}

// ===========================================================================

function oneMinuteTimerFunction() {
	logToConsole(LOG_DEBUG, `[VRR.Event] Checking server game time`);
	checkServerGameTime();

	logToConsole(LOG_DEBUG, `[VRR.Event] Checking rentable vehicles`);
	checkVehicleRenting();

	logToConsole(LOG_DEBUG, `[VRR.Event] Updating all player name tags`);
	updateAllPlayerNameTags();

	logToConsole(LOG_DEBUG, `[VRR.Event] Collecting all garbage`);
	collectAllGarbage();
}

// ===========================================================================

function tenMinuteTimerFunction() {
	showRandomTipToAllPlayers();
	saveServerDataToDatabase();
	checkInactiveVehicleRespawns();
}

// ===========================================================================

function thirtyMinuteTimerFunction() {
	checkPayDays();
}

// ===========================================================================

function checkVehicleRenting() {
	let renting = getServerData().rentingVehicleCache;
	for(let i in renting) {
		if(isClientInitialized(renting[i])) {
			if(getPlayerData(renting[i]) != false) {
				if(isPlayerLoggedIn(renting[i] && isPlayerSpawned(renting[i]))) {
					if(getPlayerData(renting[i]).rentingVehicle != false) {
						if(getPlayerCurrentSubAccount(renting[i]).cash < getServerData().vehicles[getPlayerData(renting[i]).rentingVehicle].rentPrice) {
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
	let clients = getClients();
	for(let i in clients) {
		if(isClientInitialized(clients[i])) {
			if(!clients[i].console) {
				updatePlayerPing(clients[i]);
				if(isPlayerSpawned(clients[i])) {
					updatePlayerCash(clients[i]);
				}
			}
		}
	}
}

// ===========================================================================

function checkServerGameTime() {
	//if(!getServerConfig().useRealTime) {
		if(getServerConfig().minute >= 59) {
			getServerConfig().minute = 0;
			if(getServerConfig().hour >= 23) {
				getServerConfig().hour = 0;
			} else {
				getServerConfig().hour = getServerConfig().hour + 1;
			}
		} else {
			getServerConfig().minute = getServerConfig().minute + 1;
		}
	//} else {
	//	let dateTime = getCurrentTimeStampWithTimeZone(getServerConfig().realTimeZone);
	//	getServerConfig().hour = dateTime.getHours();
	//	getServerConfig().minute = dateTime.getMinutes();
	//}

	updateTimeRule();
}

// ===========================================================================

function checkPayDays() {
	let clients = getClients();
	for(let i in clients) {
		if(isClientInitialized(clients[i])) {
			if(isPlayerLoggedIn(clients[i]) && isPlayerSpawned(clients[i])) {
				getPlayerData(clients[i]).payDayStart = sdl.ticks;
				playerPayDay(clients[i]);

				//if(sdl.ticks-getPlayerData(clients[i]).payDayTickStart >= getGlobalConfig().payDayTickCount) {
				//	getPlayerData(clients[i]).payDayStart = sdl.ticks;
				//	playerPayDay(clients[i]);
				//}
			}
		}
	}

	for(let i in getServerData().businesses) {
		if(getBusinessData(i).ownerType != VRR_BIZOWNER_NONE && getBusinessData(i).ownerType != VRR_BIZOWNER_PUBLIC && getBusinessData(i).ownerType != VRR_BIZOWNER_FACTION) {
			getBusinessData(i).till += 1000;
		}
	}
}

// ===========================================================================

function showRandomTipToAllPlayers() {
	let tipId = getRandom(0, randomTips.length-1);

	let clients = getClients();
	for(let i in clients) {
		if(isClientInitialized(clients[i])) {
			if(isPlayerLoggedIn(clients[i]) && isPlayerSpawned(clients[i])) {
				if(!doesPlayerHaveRandomTipsDisabled(clients[i])) {
					messagePlayerTimedRandomTip(null, randomTips[tipId]);
				}
			}
		}
	}
}

// ===========================================================================

function checkInactiveVehicleRespawns() {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for(let i in vehicles) {
		if(getVehicleData(vehicles[i] != false)) {
			if(isVehicleUnoccupied(vehicles[i])) {
				if(getVehicleData(vehicles[i]).lastActiveTime != false) {
					if(getCurrentUnixTimestamp() - getVehicleData(vehicles[i]).lastActiveTime >= getGlobalConfig().vehicleInactiveRespawnDelay) {
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