// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: startup.js
// DESC: Provides startup/shutdown procedures
// TYPE: Server (JavaScript)
// ===========================================================================

function initServerScripts() {
	checkForAllRequiredModules();

	initClassScript();
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

	// Load config and stuff
	loadGlobalConfig();
	loadServerConfig();
	applyConfigToServer(getServerConfig());

	// Load all the server data
	loadServerDataFromDatabase();
	setAllServerDataIndexes();
	createAllServerElements();

	initAllClients();
	initTimers();

	serverStartTime = getCurrentUnixTimestamp();
}

// ===========================================================================

function checkForHashingModule() {
	if (typeof module.hashing == "undefined") {
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
	if (typeof module.smtp == "undefined") {
		return false;
	}

	return true;
}

// ===========================================================================

function checkForAllRequiredModules() {
	logToConsole(LOG_DEBUG, "[VRR.Startup]: Checking for required modules ...");

	if (!checkForHashingModule()) {
		logToConsole(LOG_WARN, "[VRR.Startup]: Hashing module is not loaded!");
		logToConsole(LOG_WARN, "[VRR.Startup]: This resource will now shutdown.");
		thisResource.stop();
	}

	if (!checkForMySQLModule()) {
		logToConsole(LOG_WARN, "[VRR.Startup]: MySQL module is not loaded!");
		logToConsole(LOG_WARN, "[VRR.Startup]: This resource will now shutdown.");
		thisResource.stop();
	}

	if (!checkForSMTPModule()) {
		logToConsole(LOG_WARN, "[VRR.Startup]: SMTP Email module is not loaded!");
		logToConsole(LOG_WARN, "[VRR.Startup]: Email features will NOT be available!");
	}

	logToConsole(LOG_DEBUG, "[VRR.Startup]: All required modules loaded!");
	return true;
}

// ===========================================================================

function loadServerDataFromDatabase() {
	logToConsole(LOG_INFO, "[VRR.Config]: Loading server data ...");

	// Always load these regardless of "test server" status
	getServerData().localeStrings = loadAllLocaleStrings();
	getServerData().allowedSkins = getAllowedSkins(getGame());

	getServerData().itemTypes = loadItemTypesFromDatabase();

	// Translation Cache
	getServerData().cachedTranslations = new Array(getGlobalConfig().locale.locales.length);
	getServerData().cachedTranslationFrom = new Array(getGlobalConfig().locale.locales.length);
	getServerData().cachedTranslationFrom.fill([]);
	getServerData().cachedTranslations.fill(getServerData().cachedTranslationFrom);

	// Only load these if the server isn't a testing/dev server
	if (!getServerConfig().devServer) {
		getServerData().items = loadItemsFromDatabase();
		getServerData().businesses = loadBusinessesFromDatabase();
		getServerData().houses = loadHousesFromDatabase();
		getServerData().vehicles = loadVehiclesFromDatabase();
		getServerData().clans = loadClansFromDatabase();
		getServerData().npcs = loadNPCsFromDatabase();
		getServerData().races = loadRacesFromDatabase();
		getServerData().radioStations = loadRadioStationsFromDatabase();
		getServerData().gates = loadGatesFromDatabase();
		getServerData().jobs = loadJobsFromDatabase();
	}

	getServerData().commands = loadCommands();
}

// ===========================================================================

function setAllServerDataIndexes() {
	setAllItemTypeDataIndexes();
	setAllItemDataIndexes();
	setBusinessDataIndexes();
	setHouseDataIndexes();
	setAllClanDataIndexes();
	setAllJobDataIndexes();
	setNPCDataIndexes();
	setAllRaceDataIndexes();
	setAllRadioStationIndexes();
	cacheAllGroundItems();
	cacheAllBusinessItems();
	cacheAllCommandsAliases();
}

// ===========================================================================

function createAllServerElements() {
	createAllBusinessPickups();
	createAllBusinessBlips();
	createAllHousePickups();
	createAllHouseBlips();
	createAllJobPickups();
	createAllJobBlips();
	createAllGroundItemObjects();
	spawnAllVehicles();
	spawnAllNPCs();
	addAllCommandHandlers();
}

// ===========================================================================

initServerScripts();

// ===========================================================================