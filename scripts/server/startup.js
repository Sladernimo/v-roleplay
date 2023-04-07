// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: startup.js
// DESC: Provides startup/shutdown procedures
// TYPE: Server (JavaScript)
// ===========================================================================

function initServerScripts() {
	serverStarting = true;
	checkForAllRequiredModules();

	initDatabaseScript();
	initConfigScript();
	initEmailScript();
	initBitFlagScript();
	initItemScript();
	initBusinessScript();
	initClanScript();
	initHouseScript();
	initChatScript();
	initStaffScript();
	initAccountScript();
	initSubAccountScript();
	initChatScript();
	initJobScript();
	initVehicleScript();
	initDeveloperScript();
	initKeyBindScript();
	initEventScript();
	initAntiCheatScript();
	initClientScript();
	initMessagingScript();
	initHelpScript();
	initFishingScript();
	initGUIScript();
	initEconomyScript();
	initRadioScript();
	initLocaleScript();
	initCommandScript();
	initPayPhoneScript();

	// Load config and stuff
	loadGlobalConfig();
	loadServerConfig();
	applyConfigToServer(getServerConfig());

	// Load all the server data
	loadServerDataFromDatabase();
	setAllServerDataIndexes();

	checkServerGameTime();

	// In Mafia 1, server elements are spawned after possible map switch
	// Other games can spawn elements immediately
	if (getGame() != V_GAME_MAFIA_ONE) {
		spawnAllServerElements();
	}

	addAllNetworkEventHandlers();
	//addAllCommandHandlers();
	initAllClients();
	initTimers();
	exportAllFunctions();
	removeUnusedGameData();

	serverStartTime = getCurrentUnixTimestamp();
	serverStarting = false;
}

// ===========================================================================

function checkForHashingModule() {
	if (typeof module.hashing == "undefined") {
		return false;
	}
	return true;
}

// ===========================================================================

function checkForGeoIPModule() {
	if (typeof module.geoip == "undefined") {
		return false;
	}
	return true;
}

// ===========================================================================

function checkForMySQLModule() {
	if (typeof module.mysql == "undefined") {
		return false;
	}

	return true;
}

// ===========================================================================

function checkForSMTPModule() {
	//if (typeof module.smtp == "undefined") {
	//	return false;
	//}

	return true;
}

// ===========================================================================

function checkForAllRequiredModules() {
	logToConsole(LOG_DEBUG, "[V.RP.Startup]: Checking for required modules ...");

	if (!checkForHashingModule()) {
		logToConsole(LOG_WARN, "[V.RP.Startup]: Hashing module is not loaded!");
		logToConsole(LOG_ERROR, "[V.RP.Startup]: This server will now shutdown.");
		shutdownServer();
	}

	if (!checkForMySQLModule()) {
		logToConsole(LOG_WARN, "[V.RP.Startup]: MySQL module is not loaded!");
		logToConsole(LOG_ERROR, "[V.RP.Startup]: This server will now shutdown.");
		shutdownServer();
	}

	//if (!checkForSMTPModule()) {
	//	logToConsole(LOG_WARN, "[V.RP.Startup]: SMTP Email module is not loaded!");
	//	logToConsole(LOG_WARN, "[V.RP.Startup]: Email features will NOT be available!");
	//}

	logToConsole(LOG_DEBUG, "[V.RP.Startup]: All required modules loaded!");
	return true;
}

// ===========================================================================

function loadServerDataFromDatabase() {
	logToConsole(LOG_INFO, "[V.RP.Config]: Loading server data ...");

	// Always load these regardless of "test server" status
	serverData.localeStrings = loadAllLocaleStrings();
	serverData.allowedSkins = getAllowedSkins(getGame());
	serverData.itemTypes = loadItemTypesFromDatabase();

	// Translation Cache
	serverData.cachedTranslations = new Array(globalConfig.locale.locales.length);
	serverData.cachedTranslationFrom = new Array(globalConfig.locale.locales.length);
	serverData.cachedTranslationFrom.fill([]);
	serverData.cachedTranslations.fill(serverData.cachedTranslationFrom);

	// Only load these if the server isn't a testing/dev server
	if (!serverConfig.devServer) {
		serverData.items = loadItemsFromDatabase();
		//serverData.businesses = loadBusinessesFromDatabase();
		serverData.houses = loadHousesFromDatabase();
		serverData.vehicles = loadVehiclesFromDatabase();
		serverData.clans = loadClansFromDatabase();
		serverData.npcs = loadNPCsFromDatabase();
		serverData.races = loadRacesFromDatabase();
		serverData.radioStations = loadRadioStationsFromDatabase();
		serverData.gates = loadGatesFromDatabase();
		serverData.jobs = loadJobsFromDatabase();
		serverData.payPhones = loadPayPhonesFromDatabase();
	}

	serverData.businesses = loadBusinessesFromDatabase();

	serverData.commands = loadCommands();
}

// ===========================================================================

function setAllServerDataIndexes() {
	setAllItemTypeDataIndexes();
	setAllItemDataIndexes();
	setAllBusinessDataIndexes();
	setAllHouseDataIndexes();
	setAllClanDataIndexes();
	setAllJobDataIndexes();
	setAllNPCDataIndexes();
	setAllRaceDataIndexes();
	setAllRadioStationDataIndexes();
	setAllPayPhoneDataIndexes();
	setAllVehicleRadioFrequencies();
	cacheAllGroundItems();
	cacheAllBusinessItems();
	cacheAllItemItems();
	cacheAllCommandsAliases();
	cacheAllPaintBallItemTypes();
}

// ===========================================================================

function spawnAllServerElements() {
	spawnAllBusinessPickups();
	spawnAllBusinessBlips();
	spawnAllHousePickups();
	spawnAllHouseBlips();
	spawnAllJobPickups();
	spawnAllJobBlips();
	spawnAllGroundItemObjects();
	spawnAllVehicles();
	spawnAllNPCs();

	// Using client-side spheres since server-side ones don't show on GTAC atm (bug)
	//createAllJobRouteLocationMarkers();
}

// ===========================================================================

function despawnAllServerElements() {
	//despawnAllBusinessPickups();
	//despawnAllBusinessBlips();
	//despawnAllHousePickups();
	//despawnAllHouseBlips();
	//despawnAllJobPickups();
	//despawnAllJobBlips();
	//despawnAllGroundItemObjects();
	despawnAllVehicles();
	despawnAllNPCs();

	// Using client-side spheres since server-side ones don't show on GTAC atm (bug)
	//createAllJobRouteLocationMarkers();
}

// ===========================================================================

initServerScripts();

// ===========================================================================