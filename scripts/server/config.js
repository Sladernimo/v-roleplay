// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: config.js
// DESC: Provides server configuration
// TYPE: Server (JavaScript)
// ===========================================================================

/**
 * @class Representing data for server configuration
 */
class ServerConfigData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.needsSaved = false;

		this.newCharacter = {
			spawnPosition: toVector3(0.0, 0.0, 0.0),
			spawnHeading: 0.0,
			spawnInterior: 0,
			spawnDimension: 0,
			money: 0,
			bank: 0,
			skin: 0,
		};

		this.connectCameraPosition = toVector3(0.0, 0.0, 0.0);
		this.connectCameraLookAt = toVector3(0.0, 0.0, 0.0);

		this.characterSelectCameraPosition = toVector3(0.0, 0.0, 0.0);
		this.characterSelectCameraLookAt = toVector3(0.0, 0.0, 0.0);
		this.characterSelectPedPosition = toVector3(0.0, 0.0, 0.0);
		this.characterSelectPedHeading = 0.0;
		this.characterSelectInterior = 0;
		this.characterSelectDimension = 0;

		this.name = "";
		this.password = "";
		this.hour = 0;
		this.minute = 0
		this.minuteDuration = 1000;
		this.weather = 0
		this.fallingSnow = false;
		this.groundSnow = false;
		this.useGUI = true;
		this.guiColourPrimary = [200, 200, 200];
		this.guiColourSecondary = [200, 200, 200];
		this.guiTextColourPrimary = [0, 0, 0];
		this.guiTextColourSecondary = [0, 0, 0];
		this.showLogo = true;
		this.testerOnly = false;
		this.devServer = false;
		this.nameTagDistance = 50.0;

		this.antiCheat = {
			enabled: false,
			//checkGameScripts: false,
			//gameScriptWhiteListEnabled: false,
			//gameScriptBlackListEnabled: false,
			//gameScriptWhiteList: [],
			//gameScriptBlackList: [],
		};

		this.discordBotToken = "";
		this.discordEnabled = false;

		this.createJobPickups = false;
		this.createBusinessPickups = false;
		this.createHousePickups = false;
		this.createJobBlips = false;
		this.createBusinessBlips = false;
		this.createHouseBlips = false;

		this.introMusicURL = "";

		this.pauseSavingToDatabase = false;

		this.useRealTime = false;
		this.realTimeZone = 0;

		this.normalChatType = V_CHAT_TYPE_GLOBAL;

		this.discordConfig = {
			sendEvents: true,
			sendChat: true,
			sendAdmin: true,
		};

		this.economy = {
			inflationMultiplier: 1.0,
			passiveIncomePerPayDay: 2000,
			applyTax: true,
			applyUpkeep: true,
			grossIncomeMultiplier: 1.0,
			incomeTaxRate: 0.7,
			currencyString: "${AMOUNT}",
			upKeepCosts: {
				upKeepPerVehicle: 250,
				upKeepPerHouse: 350,
				upKeepPerBusiness: 600
			},
			incomeInflationMultiplier: 1.0
		};

		if (dbAssoc) {
			this.databaseId = dbAssoc["svr_id"];
			this.newCharacter = {
				spawnPosition: toVector3(dbAssoc["svr_newchar_pos_x"], dbAssoc["svr_newchar_pos_y"], dbAssoc["svr_newchar_pos_z"]),
				spawnHeading: toFloat(dbAssoc["svr_newchar_rot_z"]),
				money: toInteger(dbAssoc["svr_newchar_money"]),
				bank: toInteger(dbAssoc["svr_newchar_bank"]),
				skin: toInteger(dbAssoc["svr_newchar_skin"]),
			};

			this.connectCameraPosition = toVector3(dbAssoc["svr_connectcam_pos_x"], dbAssoc["svr_connectcam_pos_y"], dbAssoc["svr_connectcam_pos_z"]);
			this.connectCameraLookAt = toVector3(dbAssoc["svr_connectcam_lookat_x"], dbAssoc["svr_connectcam_lookat_y"], dbAssoc["svr_connectcam_lookat_z"]);

			this.name = toInteger(dbAssoc["svr_name"]);
			this.password = toInteger(dbAssoc["svr_password"]);
			this.hour = toInteger(dbAssoc["svr_start_time_hour"]);
			this.minute = toInteger(dbAssoc["svr_start_time_min"]);
			this.minuteDuration = toInteger(dbAssoc["svr_time_min_duration"]);
			this.weather = toInteger(dbAssoc["svr_start_weather"]);
			this.fallingSnow = intToBool(toInteger(dbAssoc["svr_snow_falling"]));
			this.groundSnow = intToBool(toInteger(dbAssoc["svr_snow_ground"]));
			this.useGUI = intToBool(toInteger(dbAssoc["svr_gui"]));
			this.showLogo = intToBool(toInteger(dbAssoc["svr_logo"]));
			this.createJobPickups = intToBool(toInteger(dbAssoc["svr_job_pickups"]));
			this.createBusinessPickups = intToBool(toInteger(dbAssoc["svr_biz_pickups"]));
			this.createHousePickups = intToBool(toInteger(dbAssoc["svr_house_pickups"]));
			this.createJobBlips = intToBool(toInteger(dbAssoc["svr_job_blips"]));
			this.createBusinessBlips = intToBool(toInteger(dbAssoc["svr_biz_blips"]));
			this.createHouseBlips = intToBool(toInteger(dbAssoc["svr_house_blips"]));
			this.createPlayerBlips = intToBool(toInteger(dbAssoc["svr_player_blips"]));
			this.guiColourPrimary = [toInteger(dbAssoc["svr_gui_col1_r"]), toInteger(dbAssoc["svr_gui_col1_g"]), toInteger(dbAssoc["svr_gui_col1_b"])];
			this.guiColourSecondary = [toInteger(dbAssoc["svr_gui_col2_r"]), toInteger(dbAssoc["svr_gui_col2_g"]), toInteger(dbAssoc["svr_gui_col2_b"])];
			this.guiTextColourPrimary = [toInteger(dbAssoc["svr_gui_textcol1_r"]), toInteger(dbAssoc["svr_gui_textcol1_g"]), toInteger(dbAssoc["svr_gui_textcol1_b"])];
			//this.guiTextColourSecondary = [toInteger(dbAssoc["svr_gui_textcol2_r"]), toInteger(dbAssoc["svr_gui_textcol2_g"]), toInteger(dbAssoc["svr_gui_textcol2_b"])];
			this.inflationMultiplier = toFloat(dbAssoc["svr_inflation_multiplier"]);
			this.nameTagDistance = toFloat(dbAssoc["svr_nametag_distance"]);
			this.discordBotToken = intToBool(dbAssoc["svr_discord_bot_token"]);
			this.introMusicURL = dbAssoc["svr_intro_music"];

			this.useRealTime = intToBool(toInteger(dbAssoc["svr_real_time"]));
			this.realTimeZone = toInteger(dbAssoc["svr_real_time_timezone"]);

			this.discord = {
				sendEvents: intToBool(dbAssoc["svr_discord_send_events"]),
				sendChat: intToBool(dbAssoc["svr_discord_send_chat"]),
				sendAdmin: intToBool(dbAssoc["svr_discord_send_admin"]),
			};

			this.economy = {
				inflationMultiplier: toFloat(dbAssoc["svr_inflation_multiplier"]),
				incomeTaxRate: toFloat(dbAssoc["svr_tax_income"]),
				passiveIncomePerPayDay: toFloat(dbAssoc["svr_passive_income"]),
				applyTax: intToBool(dbAssoc["svr_tax_enabled"]),
				applyUpkeep: intToBool(dbAssoc["svr_upkeep_enabled"]),
				grossIncomeMultiplier: toFloat(dbAssoc["svr_gross_income_multiplier"]),
				currencyString: toString(dbAssoc["svr_currency_string"]),
				upKeepCosts: {
					upKeepPerVehicle: toInteger(dbAssoc["svr_upkeep_veh"]),
					upKeepPerHouse: toInteger(dbAssoc["svr_upkeep_house"]),
					upKeepPerBusiness: toInteger(dbAssoc["svr_upkeep_biz"]),
				},
				incomeInflationMultiplier: toInteger(dbAssoc["svr_income_inflation_multiplier"]),
			};

			this.devServer = intToBool(toInteger(server.getCVar("v_devserver")));
			this.testerOnly = intToBool(toInteger(server.getCVar("v_testeronly")));

			this.normalChatType = toInteger(dbAssoc["svr_chat_type"]);
			this.globalChatEnabled = intToBool(dbAssoc["svr_chat_global_enabled"]);
		}
	}
};

// ===========================================================================

let serverConfig = false;
let gameConfig = false;

// ===========================================================================

let globalConfig = {
	keyBind: [],
	database: {},
	locale: {},
	accents: {},
	discord: {},
	email: {},
	security: {},
	accountPasswordHash: "SHA512",
	npcFarProximity: 100,
	npcMediumProximity: 40,
	npcCloseProximity: 12,
	meActionDistance: 20,
	doActionDistance: 15,
	shoutDistance: 30,
	talkDistance: 10,
	whisperDistance: 2,
	megaphoneDistance: 40,
	vehicleLockDistance: 5.5,
	startWorkingDistance: 5,
	takeJobDistance: 5,
	stopWorkingDistance: 10,
	spawnCarDistance: 5,
	payAndSprayDistance: 5,
	exitPropertyDistance: 3.0,
	enterPropertyDistance: 3.0,
	businessDimensionStart: 5000,
	houseDimensionStart: 100,
	buyVehicleDriveAwayDistance: 25.0,
	returnToJobVehicleTime: 30,
	radioTransmitSpeakerDistance: 15,
	radioTransmitTalkDistance: 15,
	phoneSpeakerDistance: 15,
	phoneTalkDistance: 15,
	tazerEffectDuration: 15000,
	vehicleRepairDistance: 5,
	itemActionStateReset: 5000,
	subAccountNameAllowedCharacters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	accountNameAllowedCharacters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .:[](){}$%&*!@#_-+",
	alphaNumericCharacters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	emailValidationRegex: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
	itemActionDelayExtraTimeout: 1000,
	geoIPCountryDatabaseFilePath: "modules/geoip/geoip-country.mmdb",
	geoIPCityDatabaseFilePath: "modules/geoip/geoip-city.mmdb",
	randomTipInterval: 600000,
	weaponEquippableTypes: [
		V_ITEM_USE_TYPE_WEAPON,
		V_ITEM_USE_TYPE_TAZER,
		V_ITEM_USE_TYPE_EXTINGUISHER,
		V_ITEM_USE_TYPE_SPRAYPAINT,
		V_ITEM_USE_TYPE_PEPPERSPRAY,
	],
	onFootOnlyItems: [
		V_ITEM_USE_TYPE_VEHREPAIR,
		V_ITEM_USE_TYPE_VEHCOLOUR,
		V_ITEM_USE_TYPE_VEHUPGRADE_PART,
		V_ITEM_USE_TYPE_VEHLIVERY,
		V_ITEM_USE_TYPE_VEHTIRE,
	],
	vehicleInactiveRespawnDelay: 1000 * 60 * 60, // 60 minutes
	chatSectionHeaderLength: 96,
	useServerSideVehiclePurchaseCheck: true,
	useServerSideVehicleBurnCheck: false,
	businessPickupStreamInDistance: 100,
	businessPickupStreamOutDistance: 120,
	housePickupStreamInDistance: 100,
	housePickupStreamOutDistance: 120,
	jobPickupStreamInDistance: 100,
	jobPickupStreamOutDistance: 120,
	businessBlipStreamInDistance: 150,
	businessBlipStreamOutDistance: 200,
	houseBlipStreamInDistance: 100,
	houseBlipStreamOutDistance: 120,
	jobBlipStreamInDistance: -1,
	jobBlipStreamOutDistance: -1,
	playerStreamInDistance: -1,
	playerStreamOutDistance: -1,
	playerBlipStreamInDistance: -1,
	playerBlipStreamOutDistance: -1,
	handcuffPlayerDistance: 3,
	firstAidKitPlayerDistance: 3,
	droppedItemPickupRange: 2,
	passwordRequiredCapitals: 0,
	passwordRequiredNumbers: 0,
	passwordRequiredSymbols: 0,
	minChatLines: 1,
	maxChatLines: 6,
	vehicleTrunkDistance: 3.5,
	fishingSpotDistance: 10.0,
	atmDistance: 1.5,
	loginTimeout: 60000,
	fishingCastMaxStrength: 100,
	fishingCastMinStrength: 30,
	jobRouteLocationSphereRadius: 3,
	monthlyChanceOfSnow: [90, 50, 10, 0, 0, 0, 0, 0, 0, 0, 50, 90],
	defaultEnabledAccountSettings: [
		"ChatBoxTimestamps",
		"ChatEmoji",
	],
	nightMapStartHour: 19,
	nightMapEndHour: 7,
	payPhoneGiveDistance: 2.5,
	payPhoneAnswerDistance: 2.5,
	vehicleTransmitRadioUseDistance: 1.5,
	transmitRadioSpeakerDistance: 15.0,
	searchPlayerDistance: 2.0,
	givePlayerMoneyDistance: 2.0,
	finePlayerDistance: 10.0,
	fineCommission: 0.05,
	forceAllVehicleEngines: 0,
	maxAnimationMoveDistance: 3,
	minAnimationMoveDistance: 0,
	jobRouteStartCooldown: 60 * 2, // 2 minutes
	payPhonePickupToTalkAnimationDelay: 2000,
	payPhonePickupToDialAnimationDelay: 2000,
	payPhoneDialToTalkAnimationDelay: 7000,
	blackJackPayoutMultiplier: 1.5,
	playerSceneSwitchVirtualWorldStart: 50000,
	skinChangeDimensionStart: 10000,
	globalChatActionTipCooldown: 1000 * 60 * 5,
	localChatActionTipCooldown: 1000 * 60 * 5,
};

// ===========================================================================

function initConfigScript() {
	logToConsole(LOG_INFO, "[V.RP.Config]: Initializing config script ...");
	logToConsole(LOG_INFO, "[V.RP.Config]: Config script initialized!");
}

// ===========================================================================

function loadGlobalConfig() {
	logToConsole(LOG_DEBUG, "[V.RP.Config] Loading global configuration ...");
	try {
		globalConfig.database = loadDatabaseConfig();
	} catch (error) {
		logToConsole(LOG_ERROR, `[V.RP.Config] Failed to load global configuration. Error: ${error}`);
		thisResource.stop();
	}

	try {
		globalConfig.locale = loadLocaleConfig();
	} catch (error) {
		logToConsole(LOG_ERROR, `[V.RP.Config] Failed to load locale configuration. Error: ${error}`);
		thisResource.stop();
	}

	try {
		globalConfig.accents = loadAccentConfig();
	} catch (error) {
		logToConsole(LOG_ERROR, `[V.RP.Config] Failed to load accent configuration. Error: ${error}`);
		thisResource.stop();
	}

	try {
		globalConfig.discord = loadDiscordConfig();
	} catch (error) {
		logToConsole(LOG_ERROR, `[V.RP.Config] Failed to load discord configuration. Error: ${error}`);
		thisResource.stop();
	}

	try {
		globalConfig.keyBind = loadKeyBindConfig();
	} catch (error) {
		logToConsole(LOG_ERROR, `[V.RP.Config] Failed to load keybind configuration. Error: ${error}`);
		thisResource.stop();
	}

	try {
		globalConfig.email = loadEmailConfig();
	} catch (error) {
		logToConsole(LOG_ERROR, `[V.RP.Config] Failed to load email configuration. Error: ${error}`);
		thisResource.stop();
	}

	try {
		globalConfig.security = loadSecurityConfig();
	} catch (error) {
		logToConsole(LOG_ERROR, `[V.RP.Config] Failed to load security configuration. Error: ${error}`);
		thisResource.stop();
	}

	logToConsole(LOG_DEBUG, "[V.RP.Config] Loaded global configuration successfully!");
}

// ===========================================================================

function loadServerConfigFromGameAndPort(gameId, port) {
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM svr_main WHERE svr_game = ${gameId} AND svr_port = ${port} LIMIT 1;`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			let tempServerConfigData = new ServerConfigData(dbAssoc[0]);
			return tempServerConfigData;
		}
		disconnectFromDatabase(dbConnection);
	}
	return false;
}

// ===========================================================================

function loadServerConfigFromGame(gameId) {
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM svr_main WHERE svr_game = ${gameId} LIMIT 1;`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			let tempServerConfigData = new ServerConfigData(dbAssoc[0]);
			return tempServerConfigData;
		}
		disconnectFromDatabase(dbConnection);
	}
	return false;
}

// ===========================================================================

function loadServerConfigFromId(tempServerId) {
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM svr_main WHERE svr_id = ${tempServerId} LIMIT 1;`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			let tempServerConfigData = new ServerConfigData(dbAssoc[0]);
			return tempServerConfigData;
		}
		disconnectFromDatabase(dbConnection);
	}

	return false;
}

// ===========================================================================

function applyConfigToServer(tempServerConfig) {
	logToConsole(LOG_INFO, "[V.RP.Config]: Applying server config ...");
	logToConsole(LOG_DEBUG, "[V.RP.Config]: Server config applied successfully!");

	updateServerGameTime();

	//if (isGameFeatureSupported("time")) {
	//	logToConsole(LOG_DEBUG, `[V.RP.Config]: Setting time to to ${tempServerConfig.hour}:${tempServerConfig.minute} with minute duration of ${tempServerConfig.minuteDuration}`);
	//	setGameTime(tempServerConfig.hour, tempServerConfig.minute, tempServerConfig.minuteDuration);
	//}

	if (isGameFeatureSupported("weather")) {
		logToConsole(LOG_DEBUG, `[V.RP.Config]: Setting weather to ${tempServerConfig.weather}`);
		game.forceWeather(getWeatherData(tempServerConfig.weather).weatherId);
	}

	updateServerRules();
}

// ===========================================================================

function saveServerConfigToDatabase() {
	logToConsole(LOG_DEBUG, `[V.RP.Config]: Saving server ${serverConfig.databaseId} configuration to database ...`);
	if (serverConfig.needsSaved) {
		let dbConnection = connectToDatabase();
		if (dbConnection) {
			let data = [
				//["svr_settings", toInteger(serverConfig.settings)],
				["svr_start_time_hour", serverConfig.hour],
				["svr_start_time_min", serverConfig.minute],
				["svr_start_weather", serverConfig.weather],
				["svr_newchar_pos_x", serverConfig.newCharacter.spawnPosition.x],
				["svr_newchar_pos_y", serverConfig.newCharacter.spawnPosition.y],
				["svr_newchar_pos_z", serverConfig.newCharacter.spawnPosition.z],
				["svr_newchar_rot_z", serverConfig.newCharacter.spawnHeading],
				["svr_newchar_skin", serverConfig.newCharacter.skin],
				["svr_newchar_money", serverConfig.newCharacter.money],
				["svr_gui_col1_r", serverConfig.guiColourPrimary[0]],
				["svr_gui_col1_g", serverConfig.guiColourPrimary[1]],
				["svr_gui_col1_b", serverConfig.guiColourPrimary[2]],
				["svr_gui_col2_r", serverConfig.guiColourSecondary[0]],
				["svr_gui_col2_g", serverConfig.guiColourSecondary[1]],
				["svr_gui_col2_b", serverConfig.guiColourSecondary[2]],
				["svr_connectcam_pos_x", serverConfig.connectCameraPosition.x],
				["svr_connectcam_pos_y", serverConfig.connectCameraPosition.y],
				["svr_connectcam_pos_z", serverConfig.connectCameraPosition.z],
				["svr_connectcam_lookat_x", serverConfig.connectCameraLookAt.x],
				["svr_connectcam_lookat_y", serverConfig.connectCameraLookAt.y],
				["svr_connectcam_lookat_z", serverConfig.connectCameraLookAt.z],
				["svr_charselect_cam_pos_x", serverConfig.characterSelectCameraPosition.x],
				["svr_charselect_cam_pos_y", serverConfig.characterSelectCameraPosition.y],
				["svr_charselect_cam_pos_z", serverConfig.characterSelectCameraPosition.z],
				["svr_charselect_cam_lookat_x", serverConfig.characterSelectCameraLookAt.x],
				["svr_charselect_cam_lookat_y", serverConfig.characterSelectCameraLookAt.y],
				["svr_charselect_cam_lookat_z", serverConfig.characterSelectCameraLookAt.z],
				["svr_charselect_ped_pos_x", serverConfig.characterSelectPedPosition.x],
				["svr_charselect_ped_pos_y", serverConfig.characterSelectPedPosition.y],
				["svr_charselect_ped_pos_z", serverConfig.characterSelectPedPosition.z],
				["svr_charselect_ped_rot_z", serverConfig.characterSelectPedHeading],
				["svr_charselect_int", serverConfig.characterSelectInterior],
				["svr_charselect_vw", serverConfig.characterSelectDimension],
				["svr_intro_music", serverConfig.introMusicURL],
				["svr_gui", serverConfig.useGUI],
				["svr_logo", serverConfig.showLogo],
				["svr_snow_falling", serverConfig.fallingSnow],
				["svr_snow_ground", serverConfig.groundSnow],
				["svr_biz_blips", serverConfig.createBusinessBlips],
				["svr_biz_pickups", serverConfig.createBusinessPickups],
				["svr_house_blips", serverConfig.createHouseBlips],
				["svr_house_pickups", serverConfig.createHousePickups],
				["svr_job_blips", serverConfig.createJobBlips],
				["svr_job_pickups", serverConfig.createJobPickups],
				["svr_nametag_distance", serverConfig.nameTagDistance],
				["svr_real_time", boolToInt(serverConfig.useRealTime)],
				["svr_real_time_timezone", serverConfig.realTimeZone],
				["svr_inflation_multiplier", serverConfig.economy.inflationMultiplier],
				["svr_tax_income", serverConfig.economy.incomeTaxRate],
				["svr_passive_income", serverConfig.economy.passiveIncomePerPayDay],
				["svr_tax_enabled", boolToInt(serverConfig.economy.applyTax)],
				["svr_upkeep_enabled", boolToInt(serverConfig.economy.applyUpkeep)],
				["svr_gross_income_multiplier", serverConfig.economy.grossIncomeMultiplier],
				["svr_currency_string", serverConfig.economy.currencyString],
				["svr_upkeep_veh", serverConfig.economy.upKeepCosts.upKeepPerVehicle],
				["svr_upkeep_house", serverConfig.economy.upKeepCosts.upKeepPerHouse],
				["svr_upkeep_biz", serverConfig.economy.upKeepCosts.upKeepPerBusiness],
				["svr_chat_type", serverConfig.normalChatType],
			];

			let dbQuery = null;
			let queryString = createDatabaseUpdateQuery("svr_main", data, `svr_id=${serverConfig.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);

			serverConfig.needsSaved = false;
			freeDatabaseQuery(dbQuery);
			disconnectFromDatabase(dbConnection);

		}
	}
	logToConsole(LOG_DEBUG, `[V.RP.Config]: Server ${serverConfig.databaseId} configuration saved to database!`);
}

// ===========================================================================

/**
 *
 * @return {ServerConfigData} - Server configuration data
 *
 */
function getServerConfig() {
	//if(serverId != getServerId()) {
	//	return loadServerConfigFromId(serverId);
	//}
	return serverConfig;
}

// ===========================================================================

function getGlobalConfig() {
	return globalConfig;
}

// ===========================================================================

/**
 *
 * @return {number} - This server's ID
 *
 */
function getServerId() {
	return serverConfig.databaseId;
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
function setTimeCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let hour = toInteger(getParam(params, " ", 1));
	let minute = toInteger(getParam(params, " ", 2)) || 0;

	if (hour > 23 || hour < 0) {
		messagePlayerError(client, "The hour must be between 0 and 23!");
		return false;
	}

	if (minute > 59 || minute < 0) {
		messagePlayerError(client, "The minute must be between 0 and 59!");
		return false;
	}

	serverConfig.hour = hour;
	serverConfig.minute = minute;

	game.time.hour = serverConfig.hour;
	game.time.minute = serverConfig.minute;

	//checkServerGameTime();

	serverConfig.needsSaved = true;

	announceAdminAction("ServerTimeSet", getPlayerName(client), makeReadableTime(hour, minute));
	return true;
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
function setMinuteDurationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let minuteDuration = toInteger(params);
	serverConfig.minuteDuration = minuteDuration;
	setTimeMinuteDuration(null, minuteDuration);

	serverConfig.needsSaved = true;

	announceAdminAction("ServerMinuteDurationSet", getPlayerName(client), makeReadableTime(hour, minute));
	return true;
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
function setWeatherCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let weatherIndex = getWeatherFromParams(getParam(params, " ", 1));

	if (!getWeatherData(weatherIndex)) {
		messagePlayerError(client, `That weather ID or name is invalid!`);
		return false;
	}

	game.forceWeather(getWeatherData(weatherIndex).weatherId);
	serverConfig.weather = weatherIndex;

	serverConfig.needsSaved = true;

	announceAdminAction("ServerWeatherSet", getPlayerName(client), getWeatherData(weatherIndex).name);
	updateServerRules();
	return true;
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
function setSnowingCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let falling = toInteger(getParam(params, " ", 1));
	let ground = toInteger(getParam(params, " ", 2));

	serverConfig.fallingSnow = intToBool(falling);
	serverConfig.groundSnow = intToBool(ground);

	updatePlayerSnowState(null);

	serverConfig.needsSaved = true;

	announceAdminAction("ServerSnowSet", getPlayerName(client), `${getBoolRedGreenInlineColour(falling)}${getOnOffFromBool(falling)}`, `${getBoolRedGreenInlineColour(ground)}${getOnOffFromBool(ground)}`);
	updateServerRules();
	return true;
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
function setServerGUIColoursCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let colourRed = toInteger(getParam(params, " ", 1)) || 255;
	let colourGreen = toInteger(getParam(params, " ", 2)) || 255;
	let colourBlue = toInteger(getParam(params, " ", 3)) || 255;

	serverConfig.guiColour = [colourRed, colourGreen, colourBlue];

	let clients = getClients();
	for (let i in clients) {
		sendPlayerGUIColours(clients[i]);
	}

	serverConfig.needsSaved = true;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} has set the server GUI colours to ${colourRed}, ${colourGreen}, ${colourBlue}`);
	//updateServerRules();
	return true;
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
function toggleServerLogoCommand(command, params, client) {
	serverConfig.useLogo = !serverConfig.useLogo;
	serverConfig.needsSaved = true;

	updatePlayerShowLogoState(null, serverConfig.useLogo);

	announceAdminAction(`ServerLogoSet`, `{adminOrange}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(serverConfig.useLogo)}${toUpperCase(getOnOffFromBool(serverConfig.useLogo))}`);
	updateServerRules();
	return true;
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
function toggleServerJobBlipsCommand(command, params, client) {
	serverConfig.createJobBlips = !serverConfig.createJobBlips;
	serverConfig.needsSaved = true;

	announceAdminAction("ServerJobBlipsSet", `{adminOrange}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(serverConfig.createJobBlips)}${toUpperCase(getOnOffFromBool(serverConfig.createJobBlips))}{MAINCOLOUR}`);
	resetAllJobBlips();
	return true;
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
function toggleServerJobPickupsCommand(command, params, client) {
	serverConfig.createJobPickups = !serverConfig.createJobPickups;
	serverConfig.needsSaved = true;

	announceAdminAction("ServerJobPickupsSet", `{adminOrange}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(serverConfig.createJobPickups)}${toUpperCase(getOnOffFromBool(serverConfig.createJobPickups))}{MAINCOLOUR}`);
	resetAllJobPickups();
	return true;
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
function toggleServerBusinessBlipsCommand(command, params, client) {
	serverConfig.createBusinessBlips = !serverConfig.createBusinessBlips;
	serverConfig.needsSaved = true;

	announceAdminAction("ServerBusinessBlipsSet", `{adminOrange}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(serverConfig.createBusinessBlips)}${toUpperCase(getOnOffFromBool(serverConfig.createBusinessBlips))}{MAINCOLOUR}`);
	resetAllBusinessBlips();
	return true;
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
function toggleServerBusinessPickupsCommand(command, params, client) {
	serverConfig.createBusinessPickups = !serverConfig.createBusinessPickups;
	serverConfig.needsSaved = true;

	announceAdminAction("ServerBusinessPickupsSet", `{adminOrange}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(serverConfig.createBusinessPickups)}${toUpperCase(getOnOffFromBool(serverConfig.createBusinessPickups))}{MAINCOLOUR}`);
	resetAllBusinessPickups();
	return true;
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
function toggleServerHouseBlipsCommand(command, params, client) {
	serverConfig.createHouseBlips = !serverConfig.createHouseBlips;
	serverConfig.needsSaved = true;

	announceAdminAction("ServerHouseBlipsSet", `{adminOrange}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(serverConfig.createHouseBlips)}${toUpperCase(getOnOffFromBool(serverConfig.createHouseBlips))}{MAINCOLOUR}`);
	resetAllHouseBlips();
	return true;
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
function toggleServerHousePickupsCommand(command, params, client) {
	serverConfig.createHousePickups = !serverConfig.createHousePickups;
	serverConfig.needsSaved = true;

	announceAdminAction("ServerHousePickupsSet", `{adminOrange}${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(serverConfig.createHousePickups)}${toUpperCase(getOnOffFromBool(serverConfig.createHousePickups))}{MAINCOLOUR}`);
	resetAllHousePickups();
	return true;
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
function toggleServerGUICommand(command, params, client) {
	serverConfig.useGUI = !serverConfig.useGUI;

	serverConfig.needsSaved = true;

	announceAdminAction(`ServerGUISet`, `${getPlayerName(client)}{MAINCOLOUR}`, `${getBoolRedGreenInlineColour(serverConfig.useGUI)}${toUpperCase(getOnOffFromBool(serverConfig.useGUI))}{MAINCOLOUR}`);
	updateServerRules();
	return true;
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
function toggleServerUseRealWorldTimeCommand(command, params, client) {
	serverConfig.useRealTime = !serverConfig.useRealTime;

	serverConfig.needsSaved = true;

	//announceAdminAction(`${getPlayerName(client)}{MAINCOLOUR} turned real-world time ${serverConfig.useRealTime} for this server (GMT ${addPositiveNegativeSymbol(serverConfig.realTimeZone)})`);
	updateServerGameTime();
	updateServerRules();
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} turned real-world time ${getOnOffFromBool(serverConfig.useRealTime)} for this server (GMT ${addPositiveNegativeSymbol(serverConfig.realTimeZone)})`);
	return true;
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
function setServerRealWorldTimeZoneCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	serverConfig.realTimeZone = toInteger(params);
	serverConfig.needsSaved = true;

	//announceAdminAction(`${getPlayerName(client)} {MAINCOLOUR}set the time zone for in-game's real-world time to GMT ${addPositiveNegativeSymbol(serverConfig.realTimeZone)}`);
	updateServerGameTime();
	updateServerRules();

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the timezone for in-game real-world time to GMT ${addPositiveNegativeSymbol(serverConfig.realTimeZone)}`);
	return true;
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
function reloadServerConfigurationCommand(command, params, client) {
	serverConfig = loadServerConfigFromGameAndPort(server.game, server.port);
	applyConfigToServer(serverConfig);
	updateServerRules();

	messagePlayerSuccess(client, `You reloaded the server configuration!`);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} reloaded the server config`);
	return true;
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
function reloadEmailConfigurationCommand(command, params, client) {
	globalConfig.email = loadEmailConfig();
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} reloaded the email config`);
	return true;
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
function reloadDatabaseConfigurationCommand(command, params, client) {
	if (getDatabaseConfig().usePersistentConnection && isDatabaseConnected(persistentDatabaseConnection)) {
		logToConsole(LOG_WARN, `[V.RP.Database] Closing persistent database connection`);
		persistentDatabaseConnection.close();
		persistentDatabaseConnection = null;
	}
	databaseEnabled = false;
	globalConfig.database = loadDatabaseConfig();
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} reloaded the database config`);
	databaseEnabled = true;
	if (getDatabaseConfig().usePersistentConnection) {
		connectToDatabase();
	}
	return true;
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
function setServerNameTagDistanceCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	serverConfig.nameTagDistance = toFloat(params);
	serverConfig.needsSaved = true;

	sendNameTagDistanceToClient(null, serverConfig.nameTagDistance);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the name tag distance to ${serverConfig.nameTagDistance}`);
	return true;
}

// ===========================================================================

function getServerIntroMusicURL() {
	return serverConfig.introMusicURL;
}

// ===========================================================================

function loadLocaleConfig() {
	logToConsole(LOG_DEBUG, "[V.RP.Config] Loading locale configuration ...");
	let localeConfig = JSON.parse(loadTextFile(`config/locale.json`));
	if (localeConfig != null) {
		return localeConfig;
	}
}

// ===========================================================================

function loadAccentConfig() {
	logToConsole(LOG_DEBUG, "[V.RP.Config] Loading accents configuration ...");
	let accentConfig = JSON.parse(loadTextFile(`config/accents.json`));
	if (accentConfig != null) {
		return accentConfig;
	}
}

// ===========================================================================

function loadDiscordConfig() {
	logToConsole(LOG_DEBUG, "[V.RP.Config] Loading discord configuration ...");
	let discordConfig = JSON.parse(loadTextFile(`config/discord.json`));
	if (discordConfig != null) {
		return discordConfig;
	}
	return false;
}

// ===========================================================================

function loadDatabaseConfig() {
	logToConsole(LOG_DEBUG, "[V.RP.Config] Loading database configuration ...");
	let databaseConfig = JSON.parse(loadTextFile("config/database.json"));
	if (databaseConfig != null) {
		return databaseConfig;
	}
	return false;
}

// ===========================================================================

function loadKeyBindConfig() {
	logToConsole(LOG_DEBUG, "[V.RP.Config] Loading keybind configuration ...");
	let keyBindConfig = JSON.parse(loadTextFile("config/keybind.json"));
	if (keyBindConfig != null) {
		return keyBindConfig;
	}
	return false;
}

// ===========================================================================

function loadEmailConfig() {
	logToConsole(LOG_DEBUG, "[V.RP.Config] Loading email configuration ...");
	let emailConfig = JSON.parse(loadTextFile("config/email.json"));
	if (emailConfig != null) {
		return emailConfig;
	}
	return false;
}

// ===========================================================================

function loadSecurityConfig() {
	logToConsole(LOG_DEBUG, "[V.RP.Config] Loading security configuration ...");
	let securityConfig = JSON.parse(loadTextFile("config/security.json"));
	if (securityConfig != null) {
		return securityConfig;
	}
	return false;
}

// ===========================================================================

function doesServerHaveGUIEnabled() {
	return serverConfig.useGUI;
}

// ===========================================================================

function doesServerHaveTesterOnlyEnabled() {
	return serverConfig.testerOnly;
}

// ===========================================================================

function doesServerHaveRealTimeEnabled() {
	return serverConfig.useRealTime;
}

// ===========================================================================

function doesServerHaveBusinessPickupsEnabled() {
	return serverConfig.createBusinessPickups
}

// ===========================================================================

function doesServerHaveHousePickupsEnabled() {
	return serverConfig.createHousePickups;
}

// ===========================================================================

function doesServerHaveJobPickupsEnabled() {
	return serverConfig.createJobPickups;
}

// ===========================================================================

function doesServerHaveBusinessBlipsEnabled() {
	return serverConfig.createBusinessBlips;
}

// ===========================================================================

function doesServerHaveHouseBlipsEnabled() {
	return serverConfig.createHouseBlips;
}

// ===========================================================================

function doesServerHaveJobBlipsEnabled() {
	return serverConfig.createJobBlips;
}

// ===========================================================================

function doesServerHaveFallingSnowEnabled() {
	return serverConfig.fallingSnow;
}

// ===========================================================================

function doesServerHaveGroundSnowEnabled() {
	return serverConfig.groundSnow;
}

// ===========================================================================

function getDatabaseConfig() {
	return globalConfig.database;
}

// ===========================================================================

function getSecurityConfig() {
	return globalConfig.security;
}

// ===========================================================================

function loadServerConfig() {
	logToConsole(LOG_DEBUG, "[V.RP.Config] Loading server configuration ...");

	if (toInteger(server.getCVar("v_devserver")) == 1) {
		try {
			serverConfig = loadServerConfigFromGame(getGame());

			if (serverConfig == false) {
				logToConsole(LOG_ERROR, `[V.RP.Config] Could not load server configuration for game ${getGame()}`);
				server.shutdown();
			}
		} catch (error) {
			logToConsole(LOG_ERROR, `[V.RP.Config] Could not load server configuration for game ${getGame()} (${error})`);
			server.shutdown();
		}
	} else {
		try {
			serverConfig = loadServerConfigFromGameAndPort(getGame(), getServerPort());

			if (serverConfig == false) {
				logToConsole(LOG_ERROR, `[V.RP.Config] Could not load server configuration for game ${getGame()} and port ${getServerPort()}`);
				server.shutdown();
			}
		} catch (error) {
			logToConsole(LOG_ERROR, `[V.RP.Config] Could not load server configuration for game ${getGame()} (${error})`);
			server.shutdown();
		}
	}

	//logToConsole(LOG_DEBUG | LOG_WARN, `Server ID: ${serverConfig.databaseId}`);
}

// ===========================================================================