// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: timers.js
// DESC: Provides timer functions and features
// TYPE: Server (JavaScript)
// ===========================================================================

let serverTimers = {};

// ===========================================================================

function saveServerDataToDatabase() {
	if (serverConfig.pauseSavingToDatabase) {
		return false;
	}

	logToConsole(LOG_DEBUG, "[V.RP.Utilities]: Saving all server data to database ...");

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
		updateVehicleSavedPositions();
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
		saveAllPayPhonesToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save payphones to database: ${error}`);
	}

	try {
		saveServerConfigToDatabase();
	} catch (error) {
		logToConsole(LOG_ERROR, `Could not save server config to database: ${error}`);
	}

	logToConsole(LOG_DEBUG, "[V.RP.Utilities]: Saved all server data to database!");
}

// ===========================================================================

function initTimers() {
	//if (isDevelopmentServer()) {
	//	return false;
	//}

	serverTimers.updatePingsTimer = setInterval(updatePings, 1000 * 5);
	serverTimers.oneMinuteTimer = setInterval(oneMinuteTimerFunction, 1000 * 60);
	serverTimers.fiveMinuteTimer = setInterval(fiveMinuteTimerFunction, 1000 * 60 * 5);
	serverTimers.tenMinuteTimer = setInterval(tenMinuteTimerFunction, 1000 * 60 * 10);
	serverTimers.thirtyMinuteTimer = setInterval(thirtyMinuteTimerFunction, 1000 * 60 * 30);
}

// ===========================================================================

function oneMinuteTimerFunction() {
	logToConsole(LOG_DEBUG, `[V.RP.Event] Checking server game time`);
	checkServerGameTime();

	if (getClients().length > 0) {
		logToConsole(LOG_DEBUG, `[V.RP.Event] Checking rentable vehicles`);
		checkVehicleRenting();

		logToConsole(LOG_DEBUG, `[V.RP.Event] Updating all player name tags`);
		updateAllPlayerNameTags();
	}

	updateVehicleSavedPositions();
	fixDesyncedPayPhones();
}

// ===========================================================================

function fiveMinuteTimerFunction() {
	saveServerDataToDatabase();
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

	checkInactiveVehicleRespawns();

	if (isGameFeatureSupported("snow")) {
		setSnowWithChance();
	}

	if (isGameFeatureSupported("weather")) {
		setRandomWeather();
	}

	updateServerRules();
}

// ===========================================================================

function checkVehicleRenting() {
	let renting = serverData.rentingVehicleCache;
	for (let i in renting) {
		if (isClientInitialized(renting[i])) {
			if (getPlayerData(renting[i]) != null) {
				if (isPlayerLoggedIn(renting[i] && isPlayerSpawned(renting[i]))) {
					if (getPlayerData(renting[i]).rentingVehicle != null) {
						if (getPlayerCurrentSubAccount(renting[i]).cash < serverData.vehicles[getPlayerData(renting[i]).rentingVehicle].rentPrice) {
							messagePlayerAlert(renting[i], `You do not have enough money to continue renting this vehicle!`);
							stopRentingVehicle(renting[i]);
						} else {
							takePlayerCash(renting[i], serverData.vehicles[getPlayerData(renting[i]).rentingVehicle].rentPrice);
						}
					}
				}
			}
		}
	}

	/*
	for(let i in serverData.vehicles) {
		if(serverData.vehicles[i] != null) {
			if(serverData.vehicles[i].rentPrice > 0) {
				if(serverData.vehicles[i].rentedBy != false) {
					let rentedBy = serverData.vehicles[i].rentedBy;
					if(getPlayerData(rentedBy) != false) {
						if(getPlayerCurrentSubAccount(rentedBy).cash < serverData.vehicles[i].rentPrice) {
							messagePlayerAlert(rentedBy, `You do not have enough money to continue renting this vehicle!`);
							stopRentingVehicle(rentedBy);
						} else {
							takePlayerCash(rentedBy, serverData.vehicles[i].rentPrice);
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
			}
		}
	}
}

// ===========================================================================

function checkServerGameTime() {
	//logToConsole(LOG_DEBUG | LOG_WARN, "[V.RP.Timers] Checking server game time");

	//if (isGameFeatureSupported("time")) {
	//	return false;
	//}

	if (!serverConfig.useRealTime) {
		if (serverConfig.minute >= 59) {
			serverConfig.minute = 0;
			if (serverConfig.hour >= 23) {
				serverConfig.hour = 0;
			} else {
				serverConfig.hour = serverConfig.hour + 1;
			}
		} else {
			serverConfig.minute = serverConfig.minute + 1;
		}
	} else {
		let dateTime = getCurrentTimeStampWithTimeZone(serverConfig.realTimeZone);
		serverConfig.hour = dateTime.getHours();
		serverConfig.minute = dateTime.getMinutes();
		setGameMinuteDuration(60);
	}

	if (!serverConfig.devServer) {
		if (getGame() == V_GAME_MAFIA_ONE) {
			if (gameData.mainWorldScene[getGame()] == "FREERIDE") {
				//if (isServerGoingToChangeMapsSoon(serverConfig.hour, serverConfig.minute)) {
				//	sendMapChangeWarningToPlayer(null, true);
				//}

				if (isNightTime(serverConfig.hour)) {
					logToConsole(LOG_INFO | LOG_WARN, `[V.RP.Timers] Changing server map to night`);
					messageDiscordEventChannel("🌙 Changing server map to night");
					gameData.mainWorldScene[getGame()] = "FREERIDENOC";
					setServerPassword(generateRandomString(10, globalConfig.alphaNumericCharacters));
					if (!serverStarting) {
						kickAllClients();
						saveServerDataToDatabase();
						despawnAllServerElements();
					}
					game.changeMap(gameData.mainWorldScene[getGame()]);
					spawnAllServerElements();
					setServerPassword("");
				} else {
					if (serverStarting) {
						spawnAllServerElements();
					}
				}
			} else if (gameData.mainWorldScene[getGame()] == "FREERIDENOC") {
				//if (isServerGoingToChangeMapsSoon(serverConfig.hour, serverConfig.minute)) {
				//	sendMapChangeWarningToPlayer(null, true);
				//}

				if (!isNightTime(serverConfig.hour)) {
					logToConsole(LOG_INFO | LOG_WARN, `[V.RP.Timers] Changing server map to day`);
					messageDiscordEventChannel("🌞 Changing server map to day");
					gameData.mainWorldScene[getGame()] = "FREERIDE";
					setServerPassword(generateRandomString(10, globalConfig.alphaNumericCharacters));
					if (!serverStarting) {
						kickAllClients();
						saveServerDataToDatabase();
						despawnAllServerElements();
					}
					game.changeMap(gameData.mainWorldScene[getGame()]);
					spawnAllServerElements();
					setServerPassword("");
				} else {
					if (serverStarting) {
						spawnAllServerElements();
					}
				}
			}
		}
	}

	if (isGameFeatureSupported("time")) {
		game.time.hour = serverConfig.hour;
		game.time.minute = serverConfig.minute;
	}

	updateServerRules();
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

				//if(sdl.ticks-getPlayerData(clients[i]).payDayTickStart >= globalConfig.payDayTickCount) {
				//	getPlayerData(clients[i]).payDayStart = sdl.ticks;
				//	playerPayDay(clients[i]);
				//}
			}
		}
	}

	for (let i in serverData.businesses) {
		if (getBusinessData(i).ownerType != V_BIZ_OWNER_NONE && getBusinessData(i).ownerType != V_BIZ_OWNER_PUBLIC && getBusinessData(i).ownerType != V_BIZ_OWNER_FACTION) {
			let addToTill = serverConfig.economy.passiveIncomePerPayDay;
			if (isDoubleBonusActive()) {
				addToTill = addToTill * 2;
			}
			getBusinessData(i).till = getBusinessData(i).till + addToTill;
			getBusinessData(i).needsSaved = true;
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
					let tipId = getRandom(0, serverData.localeStrings[localeId]["RandomTips"].length - 1);
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
		if (getVehicleData(vehicles[i]) != null) {
			if (isVehicleUnoccupied(vehicles[i])) {
				if (getCurrentUnixTimestamp() - getVehicleData(vehicles[i]).lastActiveTime >= globalConfig.vehicleInactiveRespawnDelay) {
					respawnVehicle(vehicles[i]);
					//getVehicleData(vehicles[i]).lastActiveTime = false;
				}
			} else {
				getVehicleData(vehicles[i]).lastActiveTime = getCurrentUnixTimestamp();
			}
		}
	}
}

// ===========================================================================

function setSnowWithChance() {
	let date = new Date();

	let shouldBeSnowing = getRandomBoolWithProbability(globalConfig.monthlyChanceOfSnow[date.getMonth()]);
	serverConfig.groundSnow = shouldBeSnowing;
	serverConfig.fallingSnow = shouldBeSnowing;

	updatePlayerSnowState(null, false);
}

// ===========================================================================

function setRandomWeather() {
	let randomWeatherIndex = getRandom(0, gameData.weather[getGame()].length - 1);

	if (serverConfig.fallingSnow == true) {
		while (getWeatherData(randomWeatherIndex).allowWithSnow == false) {
			randomWeatherIndex = getRandom(0, gameData.weather[getGame()].length - 1);
		}
	}

	game.forceWeather(getWeatherData(randomWeatherIndex).weatherId);
	serverConfig.weather = randomWeatherIndex;

	serverConfig.needsSaved = true;
}

// ===========================================================================