// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: class.js
// DESC: Provides classes
// TYPE: Server (JavaScript)
// ===========================================================================

function initClassScript() {
	logToConsole(LOG_INFO, "[VRR.Class]: Initializing class script ...");
	logToConsole(LOG_INFO, "[VRR.Class]: Class script initialized successfully!");
}

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
		this.inflationMultiplier = 1;
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

		this.discordConfig = {
			sendEvents: true,
			sendChat: true,
			sendAdmin: true,
		};

		if(dbAssoc) {
			this.databaseId = dbAssoc["svr_id"];
			this.newCharacter = {
				spawnPosition: toVector3(dbAssoc["svr_newchar_pos_x"], dbAssoc["svr_newchar_pos_y"], dbAssoc["svr_newchar_pos_z"]),
				spawnHeading: dbAssoc["svr_newchar_rot_z"],
				money: dbAssoc["svr_newchar_money"],
				bank: dbAssoc["svr_newchar_bank"],
				skin: dbAssoc["svr_newchar_skin"],
			},

			this.connectCameraPosition = toVector3(dbAssoc["svr_connectcam_pos_x"], dbAssoc["svr_connectcam_pos_y"], dbAssoc["svr_connectcam_pos_z"]);
			this.connectCameraLookAt = toVector3(dbAssoc["svr_connectcam_lookat_x"], dbAssoc["svr_connectcam_lookat_y"], dbAssoc["svr_connectcam_lookat_z"]);

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
			this.guiColourPrimary = [toInteger(dbAssoc["svr_gui_col1_r"]), toInteger(dbAssoc["svr_gui_col1_g"]), toInteger(dbAssoc["svr_gui_col1_b"])];
			this.guiColourSecondary = [toInteger(dbAssoc["svr_gui_col2_r"]), toInteger(dbAssoc["svr_gui_col2_g"]), toInteger(dbAssoc["svr_gui_col2_b"])];
			this.guiTextColourPrimary = [toInteger(dbAssoc["svr_gui_textcol1_r"]), toInteger(dbAssoc["svr_gui_textcol1_g"]), toInteger(dbAssoc["svr_gui_textcol1_b"])];
			//this.guiTextColourSecondary = [toInteger(dbAssoc["svr_gui_textcol2_r"]), toInteger(dbAssoc["svr_gui_textcol2_g"]), toInteger(dbAssoc["svr_gui_textcol2_b"])];
			this.inflationMultiplier = toFloat(dbAssoc["svr_inflation_multiplier"]);
			this.nameTagDistance = toFloat(dbAssoc["svr_nametag_distance"]);
			this.discordBotToken = intToBool(dbAssoc["svr_discord_bot_token"]);
			this.introMusicURL = dbAssoc["svr_intro_music"];

			//this.useRealTime = intToBool(toInteger(dbAssoc["svr_real_time_enabled"]));
			//this.realTimeZone = dbAssoc["svr_real_time_timezone"];

			this.discord = {
				sendEvents: intToBool(dbAssoc["svr_discord_send_events"]),
				sendChat: intToBool(dbAssoc["svr_discord_send_chat"]),
				sendAdmin: intToBool(dbAssoc["svr_discord_send_admin"]),
			};

			this.economy = {
				inflationMultiplier: toFloat(dbAssoc["svr_inflation_multiplier"]),
				incomeTaxRate: toFloat(dbAssoc["svr_income_tax_rate"]),
				passiveIncome: toFloat(dbAssoc["svr_passive_income"]),
			}

			this.devServer = intToBool(toInteger(server.getCVar("vrr_devserver")));
			this.testerOnly = intToBool(toInteger(server.getCVar("vrr_testeronly")));
		}
	}
};

/**
 * @class Representing extra data for a client
 */
class ClientData {
	constructor(client, accountData, subAccounts) {
		this.accountData = accountData;
		this.subAccounts = subAccounts; // Characters
		this.client = client;
		this.currentSubAccount = -1;
		this.loggedIn = false;
		this.index = -1;
		this.connectTime = 0;
		this.clientVersion = "0.0.0";
		this.loginAttemptsRemaining = 3;
		this.passwordResetAttemptsRemaining = 3;
		this.afk = false;

		this.jobRoute = -1;
		this.jobRouteLocation = -1;
		this.jobRouteVehicle = false;

		this.spawned = false;

		this.rentingVehicle = false;
		this.buyingVehicle = false;

		this.lastVehicle = false;

		this.returnToJobVehicleTick = 0;
		this.returnToJobVehicleTimer = null;

		this.switchingCharacter = false;

		this.tutorialStep = -1;
		this.tutorialItem = null;
		this.tutorialVehicle = null;

		this.hotBarItems = new Array(9).fill(-1);
		this.activeHotBarSlot = -1;
		this.toggleUseItem = false;

		this.jobLockerCache = new Array(9).fill(-1);
		this.jobEquipmentCache = [];
		this.jobUniform = 0;

		this.itemActionState = VRR_ITEM_ACTION_NONE;
		this.itemActionItem = -1;

		this.alcoholLevel = 0;

		this.pedState = VRR_PEDSTATE_NONE;
		this.promptType = VRR_PROMPT_NONE;

		this.businessOrderAmount = 0;
		this.businessOrderBusiness = -1;
		this.businessOrderItem = -1;
		this.businessOrderValue = -1;

		this.syncPosition = null;
		this.syncHeading = null;
		this.syncVehicle = null;
		this.syncVehicleSeat = null;

		this.twoFactorAuthenticationState = VRR_2FA_STATE_NONE;
		this.twoFactorAuthenticationCode = 0;

		this.payDayAmount = 0;
		this.payDayTickStart = 0;

		this.creatingCharacter = false;
		this.creatingCharacterSkin = -1;

		this.streamingRadioStation = -1;
		this.streamingRadioElement = false;

		this.returnToPosition = null;
		this.returnToHeading = null;
		this.returnToInterior = null;
		this.returnToDimension = null;
		this.returnToHouse = null;
		this.returnToBusiness = null;
		this.returnToType = VRR_RETURNTO_TYPE_NONE;

		this.changingCharacterName = false;
		this.currentPickup = false;
		this.usingSkinSelect = false;
		this.keyBinds = [];
		this.sessionId = 0;
		this.incomingDamageMultiplier = 1;
		this.weaponDamageEvent = VRR_WEAPON_DAMAGE_EVENT_NORMAL;

		this.currentAnimation = -1;
		this.currentAnimationPositionOffset = false;
		this.currentAnimationPositionReturnTo = false;
		this.animationStart = 0;
		this.animationForced = false;

		this.passwordResetState = VRR_RESETPASS_STATE_NONE;
		this.passwordResetCode = "";

		this.lastJobVehicle = null;
		this.health = 100;
		this.locale = 0;

		this.enteringVehicle = null;

		this.customDisconnectReason = "";

		this.interiorCutscene = -1;
	}
};

/**
 * @class Representing an account, loaded/saved in the database
 */
class AccountData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.password = "";
		this.registerDate = 0;
		this.flags = {
			moderation: 0,
			admin: 0,
		};
		this.staffTitle = "";
		this.ircAccount = "";
		this.discordAccount = 0,
		this.settings = 0,
		this.emailAddress = "";
		this.ipAddress = 0,

		this.notes = [];
		this.messages = [];
		this.contacts = [];
		this.subAccounts = [];

		this.emailVerificationCode = "";
		this.twoFactorAuthVerificationCode = "";

		this.chatScrollLines = 1;
		this.chatAutoHideDelay = 0;

		this.streamingRadioVolume = 20;
		this.locale = 0;

		if(dbAssoc) {
			this.databaseId = dbAssoc["acct_id"];
			this.name = dbAssoc["acct_name"];
			this.password = dbAssoc["acct_pass"];
			this.registerDate = dbAssoc["acct_when_made"];
			this.flags = {
				moderation: dbAssoc["acct_svr_mod_flags"],
				admin: dbAssoc["acct_svr_staff_flags"],
			};
			this.staffTitle = dbAssoc["acct_svr_staff_title"];
			this.ircAccount = dbAssoc["acct_irc"];
			this.discordAccount = dbAssoc["acct_discord"];
			this.settings = dbAssoc["acct_svr_settings"];
			this.emailAddress = dbAssoc["acct_email"];
			this.whenRegistered = dbAssoc["acct_when_registered"];
			this.ipAddress = dbAssoc["acct_ip"];

			this.notes = [];
			this.messages = [];
			this.contacts = [];
			this.subAccounts = [];

			this.emailVerificationCode = dbAssoc["acct_code_verifyemail"];
			this.twoFactorAuthVerificationCode = dbAssoc["acct_code_2fa"];
			this.chatScrollLines = toInteger(dbAssoc["acct_svr_chat_scroll_lines"]);
			this.chatAutoHideDelay = toInteger(dbAssoc["acct_svr_chat_auto_hide_delay"]);
			this.streamingRadioVolume = toInteger(dbAssoc["acct_streaming_radio_volume"]);
			this.locale = toInteger(dbAssoc["acct_locale"]);
		}
	}
};

/**
 * @class Representing an account's contact list, loaded/saved in the database
 */
class AccountContactData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.accountId = 0;
		this.contactAccountId = 0;
		this.type = 0;
		this.whenAdded = 0;
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = dbAssoc["acct_contact_id"];
			this.accountId = dbAssoc["acct_contact_acct"];
			this.contactAccountId = dbAssoc["acct_contact_contact"];
			this.type = dbAssoc["acct_contact_type"];
			this.whenAdded = dbAssoc["acct_contact_when_added"];
		}
	}
};

/**
 * @class Representing an account's messages, loaded/saved in the database
 */
class AccountMessageData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.account = 0;
		this.whoSent = 0;
		this.whenSent = 0;
		this.whenRead = 0;
		this.deleted = false;
		this.whenDeleted = 0;
		this.folder = 0;
		this.message = "";
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = dbAssoc["acct_msg_id"];
			this.account = dbAssoc["acct_msg_acct"];
			this.whoSent = dbAssoc["acct_msg_who_sent"];
			this.whenSent = dbAssoc["acct_msg_when_sent"];
			this.whenRead = dbAssoc["acct_msg_when_read"];
			this.deleted = intToBool(dbAssoc["acct_msg_deleted"]);
			this.whenDeleted = dbAssoc["acct_msg_when_deleted"];
			this.folder = dbAssoc["acct_msg_folder"];
			this.message = dbAssoc["acct_msg_message"];
		}
	}
};

/**
 * @class Representing an account's staff notes. Visible only to staff and loaded/saved in the database
 */
class AccountStaffNoteData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.account = 0;
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.deleted = false;
		this.whenDeleted = 0;
		this.serverId = 0;
		this.note = "";
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = dbAssoc["acct_note_id"];
			this.account = dbAssoc["acct_note_acct"];
			this.whoAdded = dbAssoc["acct_note_who_added"];
			this.whenAdded = dbAssoc["acct_note_when_added"];
			this.deleted = intToBool(dbAssoc["acct_note_deleted"]);
			this.whenDeleted = dbAssoc["acct_note_when_deleted"];
			this.serverId = dbAssoc["acct_note_server"];
			this.note = dbAssoc["acct_note_message"];
		}
	}
};

/**
 * @class Representing a character's (subaccount) data. Loaded and saved in the database
 */
class SubAccountData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.firstName = "John";
		this.lastName = "Doe";
		this.middleName = "Q";
		this.account = 0;
		this.skin = 0;
		this.cash = 0;
		this.spawnPosition = toVector3(0.0, 0.0, 0.0);
		this.spawnHeading = 0.0;
		this.lastLogin = 0;
		this.clan = 0;
		this.clanFlags = 0;
		this.clanRank = 0;
		this.clanTitle = 0;
		this.isWorking = false;
		this.jobUniform = this.skin;
		this.job = 0;
		this.jobRank = 0;
		this.weapons = [];
		this.inJail = false;
		this.interior = 0;
		this.dimension = 0;
		this.pedScale = toVector3(1.0, 1.0, 1.0);
		this.walkStyle = 0;
		this.fightStyle = 0;
		this.health = 100;
		this.armour = 100;
		this.inHouse = 0;
		this.inBusiness = 0;
		this.accent = "";

		this.bodyParts = {
			hair: [0,0],
			head: [0,0],
			upper: [0,0],
			lower: [0,0],
		};

		this.bodyProps = {
			hair: [0,0],
			eyes: [0,0],
			head: [0,0],
			leftHand: [0,0],
			rightHand: [0,0],
			leftWrist: [0,0],
			rightWrist: [0,0],
			hip: [0,0],
			leftFoot: [0,0],
			rightFoot: [0,0],
		};

		if(dbAssoc) {
			this.databaseId = dbAssoc["sacct_id"];
			this.serverId = toInteger(dbAssoc["sacct_server"]);
			this.firstName = dbAssoc["sacct_name_first"];
			this.lastName = dbAssoc["sacct_name_last"];
			this.middleName = dbAssoc["sacct_name_middle"] || "";
			this.account = toInteger(dbAssoc["sacct_acct"]);
			this.skin = toInteger(dbAssoc["sacct_svr_skin"]);
			this.cash = toInteger(dbAssoc["sacct_cash"]);
			this.spawnPosition = toVector3(toFloat(dbAssoc["sacct_pos_x"]), toFloat(dbAssoc["sacct_pos_y"]), toFloat(dbAssoc["sacct_pos_z"]));
			this.spawnHeading = toFloat(dbAssoc["sacct_rot_z"]);
			this.lastLogin = toInteger(dbAssoc["sacct_when_lastlogin"]);
			this.clan = toInteger(dbAssoc["sacct_svr_clan"]);
			this.clanFlags = toInteger(dbAssoc["sacct_svr_clan_flags"]);
			this.clanRank = toInteger(dbAssoc["sacct_svr_clan_rank"]);
			this.clanTitle = toInteger(dbAssoc["sacct_svr_clan_title"]);
			this.job = toInteger(dbAssoc["sacct_svr_job"]);
			this.jobRank = toInteger(dbAssoc["sacct_svr_job_rank"]);
			this.interior = toInteger(dbAssoc["sacct_int"]);
			this.dimension = toInteger(dbAssoc["sacct_vw"]);
			this.pedScale = toVector3(toFloat(dbAssoc["sacct_svr_scale_x"]), toFloat(dbAssoc["sacct_svr_scale_y"]), toFloat(dbAssoc["sacct_svr_scale_z"]));
			this.walkStyle = toInteger(dbAssoc["sacct_svr_walkstyle"]);
			this.fightStyle = toInteger(dbAssoc["sacct_svr_fightstyle"]);
			this.health = toInteger(dbAssoc["sacct_health"]);
			this.armour = toInteger(dbAssoc["sacct_armour"]);
			this.inHouse = toInteger(dbAssoc["sacct_inhouse"]);
			this.inBusiness = toInteger(dbAssoc["sacct_inbusiness"]);
			this.accent = toString(dbAssoc["sacct_accent"]);

			this.bodyParts = {
				hair: [toInteger(dbAssoc["sacct_svr_hd_part_hair_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_part_hair_texture"]) || 0],
				head: [toInteger(dbAssoc["sacct_svr_hd_part_head_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_part_head_texture"]) || 0],
				upper: [toInteger(dbAssoc["sacct_svr_hd_part_upper_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_part_upper_texture"]) || 0],
				lower: [toInteger(dbAssoc["sacct_svr_hd_part_lower_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_part_lower_texture"]) || 0],
			};

			this.bodyProps = {
				hair: [toInteger(dbAssoc["sacct_svr_hd_prop_hair_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_hair_texture"]) || 0],
				eyes: [toInteger(dbAssoc["sacct_svr_hd_prop_eyes_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_eyes_texture"]) || 0],
				head: [toInteger(dbAssoc["sacct_svr_hd_prop_head_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_head_texture"]) || 0],
				leftHand: [toInteger(dbAssoc["sacct_svr_hd_prop_lefthand_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_lefthand_texture"]) || 0],
				rightHand: [toInteger(dbAssoc["sacct_svr_hd_prop_righthand_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_righthand_texture"]) || 0],
				leftWrist: [toInteger(dbAssoc["sacct_svr_hd_prop_leftwrist_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_leftwrist_texture"]) || 0],
				rightWrist: [toInteger(dbAssoc["sacct_svr_hd_prop_rightwrist_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_rightwrist_texture"]) || 0],
				hip: [toInteger(dbAssoc["sacct_svr_hd_prop_hip_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_hip_texture"]) || 0],
				leftFoot: [toInteger(dbAssoc["sacct_svr_hd_prop_leftfoot_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_leftfoot_texture"]) || 0],
				rightFoot: [toInteger(dbAssoc["sacct_svr_hd_prop_rightfoot_model"]) || 0, toInteger(dbAssoc["sacct_svr_hd_prop_rightfoot_texture"]) || 0],
			};
		}
	}
};

/**
 * @class Representing a businesses' data. Loaded and saved in the database
 */
class BusinessData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.ownerType = VRR_BIZOWNER_NONE;
		this.ownerId = 0;
		this.buyPrice = 0;
		this.locked = false;
		this.hasInterior = false;
		this.index = -1;
		this.needsSaved = false;
		this.interiorLights = true;

		this.floorItemCache = [];
		this.storageItemCache = [];
		this.locations = [];
		this.gameScripts = [];

		this.entrancePosition = false;
		this.entranceRotation = 0.0;
		this.entranceInterior = 0;
		this.entranceDimension = 0;
		this.entrancePickupModel = -1;
		this.entranceBlipModel = -1;
		this.entrancePickup = null;
		this.entranceBlip = null;
		this.entranceCutscene = -1;

		this.exitPosition = false;
		this.exitRotation = 0.0;
		this.exitInterior = 0;
		this.exitDimension = 0;
		this.exitPickupModel = -1;
		this.exitBlipModel = -1;
		this.exitPickup = null;
		this.exitBlip = null;
		this.exitCutscene = -1;

		this.entranceFee = 0;
		this.till = 0;

		this.streamingRadioStation = -1;

		this.labelHelpType = VRR_PROPLABEL_INFO_NONE;

		this.triggers = [];

		this.customInterior = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["biz_id"]);
			this.name = toString(dbAssoc["biz_name"]);
			this.ownerType = toInteger(dbAssoc["biz_owner_type"]);
			this.ownerId = toInteger(dbAssoc["biz_owner_id"]);
			this.buyPrice = toInteger(dbAssoc["biz_buy_price"]);
			this.locked = intToBool(toInteger(dbAssoc["biz_locked"]));
			this.hasInterior = intToBool(toInteger(dbAssoc["biz_has_interior"]));
			this.interiorLights = intToBool(toInteger(dbAssoc["biz_interior_lights"]));

			this.entrancePosition = toVector3(toFloat(dbAssoc["biz_entrance_pos_x"]), toFloat(dbAssoc["biz_entrance_pos_y"]), toFloat(dbAssoc["biz_entrance_pos_z"]));
			this.entranceRotation = toInteger(dbAssoc["biz_entrance_rot_z"]);
			this.entranceInterior = toInteger(dbAssoc["biz_entrance_int"]);
			this.entranceDimension = toInteger(dbAssoc["biz_entrance_vw"]);
			this.entrancePickupModel = toInteger(dbAssoc["biz_entrance_pickup"]);
			this.entranceBlipModel = toInteger(dbAssoc["biz_entrance_blip"]);
			this.entranceCutscene = toInteger(dbAssoc["biz_entrance_cutscene"]);

			this.exitPosition = toVector3(dbAssoc["biz_exit_pos_x"], dbAssoc["biz_exit_pos_y"], dbAssoc["biz_exit_pos_z"]);
			this.exitRotation = toInteger(dbAssoc["biz_exit_rot_z"]);
			this.exitInterior = toInteger(dbAssoc["biz_exit_int"]);
			this.exitDimension = toInteger(dbAssoc["biz_exit_vw"]);
			this.exitPickupModel = toInteger(dbAssoc["biz_exit_pickup"]);
			this.exitBlipModel = toInteger(dbAssoc["biz_exit_blip"]);
			this.exitCutscene = toInteger(dbAssoc["biz_exit_cutscene"]);

			this.entranceFee = toInteger(dbAssoc["biz_entrance_fee"]);
			this.till = toInteger(dbAssoc["biz_till"]);

			this.labelHelpType = toInteger(dbAssoc["biz_label_help_type"]);
			this.streamingRadioStation = toInteger(dbAssoc["biz_radiostation"]);
			this.customInterior = intToBool(toInteger(dbAssoc["biz_custom_interior"]));
		}
	};
};

/**
 * @class Representing a business's location data. Multiple can be used for a single business. Used for things like doors, fuel pumps, drive thru positions, etc. Loaded and saved in the database
 */
class BusinessLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.type = 0;
		this.business = 0;
		this.enabled = false;
		this.index = -1;
		this.businessIndex = -1;
		this.needsSaved = false;

		this.position = toVector3(0.0, 0.0, 0.0);
		this.interior = 0;
		this.dimension = 0;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["biz_loc_id"]);
			this.name = toString(dbAssoc["biz_loc_name"]);
			this.type = toInteger(dbAssoc["biz_loc_type"]);
			this.business = toInteger(dbAssoc["biz_loc_biz"]);
			this.enabled = intToBool(toInteger(dbAssoc["biz_loc_enabled"]));

			this.position = toVector3(toFloat(dbAssoc["biz_loc_pos_x"]), toFloat(dbAssoc["biz_loc_pos_y"]), toFloat(dbAssoc["biz_loc_pos_z"]));
			this.interior = toInteger(dbAssoc["biz_loc_int"]);
			this.dimension = toInteger(dbAssoc["biz_loc_vw"]);
		}
	}
};

/**
 * @class Representing a business's game scripts. Multiple can be used for a single business. Used for things like bar and club NPCs and other actions
 */
class BusinessGameScriptData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.business = 0;
		this.enabled = false;
		this.index = -1;
		this.businessIndex = -1;
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["biz_script_id"]);
			this.name = toString(dbAssoc["biz_script_name"]);
			this.state = toInteger(dbAssoc["biz_script_state"]);
			this.business = toInteger(dbAssoc["biz_script_biz"]);
		}
	}
};

/**
 * @class Representing a house's data. Loaded and saved in the database
 */
class HouseData {
	constructor(dbAssoc = false) {
		this.databaseId = 0
		this.description = "";
		this.ownerType = VRR_HOUSEOWNER_NONE;
		this.ownerId = 0;
		this.buyPrice = 0;
		this.rentPrice = 0;
		this.renter = 0;
		this.locked = false;
		this.hasInterior = false;
		this.index = -1;
		this.needsSaved = false;
		this.interiorLights = true;

		this.itemCache = [];
		this.locations = [];
		//this.gameScripts = [];

		this.entrancePosition = false;
		this.entranceRotation = 0.0;
		this.entranceInterior = 0;
		this.entranceDimension = 0;
		this.entrancePickupModel = -1;
		this.entranceBlipModel = -1;
		this.entrancePickup = null;
		this.entranceBlip = null;

		this.exitPosition = false;
		this.exitRotation = 0.0;
		this.exitInterior = 0;
		this.exitDimension = -1;
		this.exitPickupModel = -1;
		this.exitBlipModel = -1;
		this.exitPickup = null;
		this.exitBlip = null;

		this.streamingRadioStation = -1;

		this.triggers = [];

		this.customInterior = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["house_id"]);
			this.description = toString(dbAssoc["house_description"]);
			this.ownerType = toInteger(dbAssoc["house_owner_type"]);
			this.ownerId = toInteger(dbAssoc["house_owner_id"]);
			this.buyPrice = toInteger(dbAssoc["house_buy_price"]);
			this.rentPrice = toInteger(dbAssoc["house_rent_price"]);
			this.renter = toInteger(dbAssoc["house_renter"]);
			this.locked = intToBool(toInteger(dbAssoc["house_locked"]));
			this.hasInterior = intToBool(toInteger(dbAssoc["house_has_interior"]));
			this.interiorLights = intToBool(toInteger(dbAssoc["house_interior_lights"]));

			this.entrancePosition = toVector3(toFloat(dbAssoc["house_entrance_pos_x"]), toFloat(dbAssoc["house_entrance_pos_y"]), toFloat(dbAssoc["house_entrance_pos_z"]));
			this.entranceRotation = toFloat(dbAssoc["house_entrance_rot_z"]);
			this.entranceInterior = toInteger(dbAssoc["house_entrance_int"]);
			this.entranceDimension = toInteger(dbAssoc["house_entrance_vw"]);
			this.entrancePickupModel = toInteger(dbAssoc["house_entrance_pickup"]);
			this.entranceBlipModel = toInteger(dbAssoc["house_entrance_blip"]);
			this.entranceCutscene = toInteger(dbAssoc["house_entrance_cutscene"]);

			this.exitPosition = toVector3(toFloat(dbAssoc["house_exit_pos_x"]), toFloat(dbAssoc["house_exit_pos_y"]), toFloat(dbAssoc["house_exit_pos_z"]));
			this.exitRotation = toFloat(dbAssoc["house_exit_rot_z"]);
			this.exitInterior = toInteger(dbAssoc["house_exit_int"]);
			this.exitDimension = toInteger(dbAssoc["house_exit_vw"]);
			this.exitPickupModel = toInteger(dbAssoc["house_exit_pickup"]);
			this.exitBlipModel = toInteger(dbAssoc["house_exit_blip"]);
			this.exitCutscene = toInteger(dbAssoc["house_exit_cutscene"]);

			this.customInterior = intToBool(toInteger(dbAssoc["house_custom_interior"]));
		}
	}
};

/**
 * @class Representing a houses's location data. Multiple can be used for a single house. Used for things like doors, garage entry/exit/vehspawn, gates, etc. Loaded and saved in the database
 */
class HouseLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.type = 0;
		this.house = 0;
		this.enabled = false;
		this.index = -1;
		this.houseIndex = -1;
		this.needsSaved = false;

		this.position = toVector3(0.0, 0.0, 0.0);
		this.interior = 0;
		this.dimension = 0;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["house_loc_id"]);
			this.name = toString(dbAssoc["house_loc_name"]);
			this.type = toInteger(dbAssoc["house_loc_type"]);
			this.house = toInteger(dbAssoc["house_loc_house"]);
			this.enabled = intToBool(toInteger(dbAssoc["house_loc_enabled"]));
			this.index = -1;

			this.position = toVector3(toFloat(dbAssoc["house_loc_pos_x"]), toFloat(dbAssoc["house_loc_pos_y"]), toFloat(dbAssoc["house_loc_pos_z"]));
			this.interior = toInteger(dbAssoc["house_loc_int"]);
			this.dimension = toInteger(dbAssoc["house_loc_vw"]);
		}
	};

	//saveToDatabase = () => {
	//	saveHouseLocationToDatabase(this.houseIndex, this.index);
	//}
};

/**
 * @class Representing a house's game scripts. Multiple can be used for a single house
 */
class HouseGameScriptData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.business = 0;
		this.state = false;
		this.index = -1;
		this.houseIndex = -1;
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["house_script_id"]);
			this.name = toString(dbAssoc["house_script_name"]);
			this.state = toInteger(dbAssoc["house_script_state"]);
			this.business = toInteger(dbAssoc["house_script_biz"]);
		}
	}
};

/**
 * @class Representing a clan's data. Loaded and saved in the database
 */
class ClanData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.ownerId = 0;
		this.tag = "";
		this.enabled = false;
		this.index = -1;
		this.colour = COLOUR_WHITE;
		this.colours = [];
		this.initialRank = 0;
		this.members = [];
		this.ranks = [];
		this.needsSaved = false;
		this.motd = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["clan_id"]);
			this.name = dbAssoc["clan_name"];
			this.owner = toInteger(dbAssoc["clan_owner"]);
			this.tag = dbAssoc["clan_tag"];
			this.enabled = intToBool(toInteger(dbAssoc["clan_enabled"]));
			this.colour = toColour(toInteger(dbAssoc["clan_col_r"]), toInteger(dbAssoc["clan_col_g"]), toInteger(dbAssoc["clan_col_b"]));
			this.colours = [toInteger(dbAssoc["clan_col_r"]), toInteger(dbAssoc["clan_col_g"]), toInteger(dbAssoc["clan_col_b"])];
			this.motd = dbAssoc["clan_motd"];
		}
	}
};

/**
 * @class Representing a clan rank's data. Loaded and saved in the database
 */
class ClanRankData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.clan = 0;
		this.name = "";
		this.level = 0;
		this.flags = 0;
		this.customTag = "";
		this.enabled = true;
		this.index = -1;
		this.clanIndex = -1;
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["clan_rank_id"]);
			this.clan = toInteger(dbAssoc["clan_rank_clan"]);
			this.name = dbAssoc["clan_rank_name"];
			this.level = toInteger(dbAssoc["clan_rank_level"]);
			this.flags = toInteger(dbAssoc["clan_rank_flags"]);
			this.tag = dbAssoc["clan_rank_tag"];
			this.enabled = intToBool(toInteger(dbAssoc["clan_rank_enabled"]));
		}
	}
};

/**
 * @class Representing a clan member's data. Loaded and saved in the database
 */
class ClanMemberData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.clan = 0;
		this.subAccount = 0;
		this.flags = 0;
		this.customTitle = "";
		this.customTag = "";
		this.rank = 0;
		this.enabled = false;
		this.index = -1;
		this.clanIndex = -1;
		this.rankIndex = -1;
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["clan_member_id"]);
			this.subAccount = toInteger(dbAssoc["clan_member_sacct"]);
			this.clan = toInteger(dbAssoc["clan_member_clan"]);
			this.name = dbAssoc["clan_member_name"];
			this.rank = toInteger(dbAssoc["clan_member_rank"]);
			this.flags = toInteger(dbAssoc["clan_member_flags"]);
			this.customTag = dbAssoc["clan_member_tag"];
			this.customTitle = dbAssoc["clan_member_title"];
		}
	}
};

/**
 * @class Representing a vehicle's data. Loaded and saved in the database
 */
class VehicleData {
	constructor(dbAssoc = false, vehicle = false) {
		// General Info
		this.databaseId = 0;
		this.serverId = getServerId();
		this.model = (vehicle != false) ? getVehicleModelIndexFromModel(vehicle.modelIndex) : 0;
		this.vehicle = vehicle;
		this.index = -1;
		this.needsSaved = false;

		// GTA IV
		this.ivNetworkId = -1;
		this.syncPosition = toVector3(0.0, 0.0, 0.0);
		this.syncHeading = 0.0;

		// Ownership
		this.ownerType = VRR_VEHOWNER_NONE;
		this.ownerId = 0;
		this.buyPrice = 0;
		this.rentPrice = 0;
		this.rentedBy = false;
		this.rentStart = 0;

		// Position and Rotation
		this.spawnPosition = (vehicle) ? vehicle.position : toVector3(0.0, 0.0, 0.0);
		this.spawnRotation = (vehicle) ? vehicle.heading : 0.0;
		this.spawnLocked = false;

		// Colour Info
		this.colour1IsRGBA = 0;
		this.colour2IsRGBA = 0;
		this.colour3IsRGBA = 0;
		this.colour4IsRGBA = 0;
		this.colour1 = (vehicle) ? vehicle.colour1 : 1;
		this.colour2 = (vehicle) ? vehicle.colour2 : 1;
		this.colour3 = (vehicle) ? vehicle.colour3 : 1;
		this.colour4 = (vehicle) ? vehicle.colour4 : 1;
		this.livery = 3;

		this.mods = [];

		// Vehicle Attributes
		this.locked = false;
		this.engine = false;
		this.lights = false;
		this.health = 1000;
		this.engineDamage = 0;
		this.visualDamage = 0;
		this.dirtLevel = 0;

		this.trunkItemCache = [];
		this.dashItemCache = [];

		this.streamingRadioStation = -1;

		// Other/Misc
		this.insuranceAccount = 0;
		this.fuel = 0;
		this.flags = 0;
		this.needsSaved = false;
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.licensePlate = "";

		this.interior = 0;
		this.dimension = 0;

		this.lastActiveTime = false;

		this.triggers = [];

		if(dbAssoc) {
			// General Info
			this.databaseId = toInteger(dbAssoc["veh_id"]);
			this.serverId = toInteger(dbAssoc["veh_server"]);
			this.model = toInteger(dbAssoc["veh_model"]);

			// Ownership
			this.ownerType = toInteger(dbAssoc["veh_owner_type"]);
			this.ownerId = toInteger(dbAssoc["veh_owner_id"]);
			this.buyPrice = toInteger(dbAssoc["veh_buy_price"]);
			this.rentPrice = toInteger(dbAssoc["veh_rent_price"]);

			// Position and Rotation
			this.spawnPosition = toVector3(dbAssoc["veh_pos_x"], dbAssoc["veh_pos_y"], dbAssoc["veh_pos_z"]);
			this.spawnRotation = toInteger(dbAssoc["veh_rot_z"]);
			this.spawnLocked = intToBool(toInteger(dbAssoc["veh_spawn_lock"]));

			// Colour Info
			this.colour1IsRGBA = intToBool(toInteger(dbAssoc["veh_col1_isrgba"]));
			this.colour2IsRGBA = intToBool(toInteger(dbAssoc["veh_col2_isrgba"]));
			this.colour3IsRGBA = intToBool(toInteger(dbAssoc["veh_col3_isrgba"]));
			this.colour4IsRGBA = intToBool(toInteger(dbAssoc["veh_col4_isrgba"]));
			this.colour1 = toInteger(dbAssoc["veh_col1"]);
			this.colour2 = toInteger(dbAssoc["veh_col2"]);
			this.colour3 = toInteger(dbAssoc["veh_col3"]);
			this.colour4 = toInteger(dbAssoc["veh_col4"]);
			this.livery = toInteger(dbAssoc["veh_livery"]);

			// Vehicle Attributes
			this.locked = intToBool(toInteger(dbAssoc["veh_locked"]));
			this.engine = intToBool(toInteger(dbAssoc["veh_engine"]));
			this.lights = intToBool(toInteger(dbAssoc["veh_lights"]));
			this.health = toInteger(dbAssoc["veh_damage_normal"]);
			this.engineDamage = toInteger(dbAssoc["veh_damage_engine"]);
			this.visualDamage = toInteger(dbAssoc["veh_damage_visual"]);
			this.dirtLevel = toInteger(dbAssoc["veh_dirt_level"]);

			// Other/Misc
			this.insuranceAccount = toInteger(0);
			this.fuel = toInteger(0);
			this.flags = toInteger(0);
			this.needsSaved = false;
			this.whoAdded = toInteger(dbAssoc["veh_who_added"]);
			this.whenAdded = toInteger(dbAssoc["veh_when_added"]);
			this.licensePlate = toInteger(dbAssoc["veh_license_plate"]);

			this.interior = toInteger(dbAssoc["veh_int"]);
			this.dimension = toInteger(dbAssoc["veh_vw"]);
		}
	}
};

/**
 * @class Representing a command's data.
 */
class CommandData {
	enable() {
		this.enabled = true;
	}

	disable() {
		this.enabled = false;
	}

	toggleEnabled() {
		this.enabled = !this.enabled;
	}

	constructor(command, handlerFunction, syntaxString = "", requiredStaffFlags = 0, requireLogin = true, allowOnDiscord = false, helpDescription = "") {
		this.command = command;
		this.handlerFunction = handlerFunction;
		this.syntaxString = syntaxString;
		this.requiredStaffFlags = requiredStaffFlags;
		this.enabled = true;
		this.requireLogin = requireLogin;
		this.allowOnDiscord = allowOnDiscord;
		this.helpDescription = helpDescription;
		this.aliases = [];
	}
};

/**
 * @class Representing a crime's data. Loaded and saved in the database
 */
class CrimeData {
	constructor(suspectId, crimeType, reporterId = 0) {
		this.crimeType = crimeType;
		this.suspectId = suspectId;
		this.reporterId = reporterId;
		this.whenCommitted = 0;
		this.whenReported = 0;
		this.databaseId = 0;
	}
};

/**
 * @class Representing a job's data. Loaded and saved in the database
 */
class JobData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.type = VRR_JOB_NONE;
		this.name = "Unnamed";
		this.enabled = true;
		this.blipModel = -1
		this.pickupModel = -1
		this.colour = toColour(0, 0, 0, 255);
		this.whiteListEnabled = false;
		this.blackListEnabled = false;
		this.walkieTalkieFrequency = 0;
		this.index = -1;
		this.needsSaved = false;

		this.equipment = [];
		this.uniforms = [];
		this.locations = [];
		this.whiteList = [];
		this.blackList = [];
		this.routes = [];

		if(dbAssoc) {
			this.databaseId = dbAssoc["job_id"];
			this.serverId = dbAssoc["job_server"];
			this.type = dbAssoc["job_type"];
			this.name = dbAssoc["job_name"];
			this.enabled = dbAssoc["job_enabled"];
			this.blipModel = dbAssoc["job_blip"];
			this.pickupModel = dbAssoc["job_pickup"];
			this.colour = toColour(dbAssoc["job_colour_r"], dbAssoc["job_colour_g"], dbAssoc["job_colour_b"], 255);
			this.whiteListEnabled = dbAssoc["job_wl"];
			this.blackListEnabled = dbAssoc["job_bl"];
			this.walkieTalkieFrequency = dbAssoc["job_walkietalkiefreq"];

			this.equipment = [];
			this.uniforms = [];
			this.locations = [];
			this.whiteList = [];
			this.blackList = [];
			this.routes = [];
		}
	}
};

/**
 * @class Representing a job equipment set's data. Loaded and saved in the database
 */
class JobEquipmentData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.job = 0;
		this.name = "Unnamed";
		this.requiredRank = 0;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;
		this.items = [];

		if(dbAssoc) {
			this.databaseId = dbAssoc["job_equip_id"];
			this.job = dbAssoc["job_equip_job"];
			this.name = dbAssoc["job_equip_name"];
			this.requiredRank = dbAssoc["job_equip_minrank"];
			this.enabled = dbAssoc["job_equip_enabled"];
		}
	}
};

/**
 * @class Representing a job equipment set item's data. Loaded and saved in the database
 */
class JobEquipmentItemData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.equipmentId = 0;
		this.itemType = 0;
		this.value = 0;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = dbAssoc["job_equip_item_id"];
			this.equipmentId = dbAssoc["job_equip_item_equip"];
			this.itemType = dbAssoc["job_equip_item_type"];
			this.value = dbAssoc["job_equip_item_value"];
			this.enabled = dbAssoc["job_equip_item_enabled"];
		}
	}
};

/**
 * @class Representing a job uniform's data. Loaded and saved in the database
 */
class JobUniformData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.job = 0;
		this.name = "Unnamed";
		this.requiredRank = 0
		this.skin = -1;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;

		this.bodyParts = {
			hair: [0,0],
			head: [0,0],
			upper: [0,0],
			lower: [0,0],
		};

		this.bodyProps = {
			hair: [0,0],
			eyes: [0,0],
			head: [0,0],
			leftHand: [0,0],
			rightHand: [0,0],
			leftWrist: [0,0],
			rightWrist: [0,0],
			hip: [0,0],
			leftFoot: [0,0],
			rightFoot: [0,0],
		};

		if(dbAssoc) {
			this.databaseId = dbAssoc["job_uniform_id"];
			this.job = dbAssoc["job_uniform_job"];
			this.name = dbAssoc["job_uniform_name"];
			this.requiredRank = dbAssoc["job_uniform_minrank"];
			this.skin = dbAssoc["job_uniform_skin"];
			this.enabled = intToBool(dbAssoc["job_uniform_enabled"]);

			this.bodyParts = {
				hair: [toInteger(dbAssoc["job_uniform_hd_part_hair_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_part_hair_texture"]) || 0],
				head: [toInteger(dbAssoc["job_uniform_hd_part_head_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_part_head_texture"]) || 0],
				upper: [toInteger(dbAssoc["job_uniform_hd_part_upper_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_part_upper_texture"]) || 0],
				lower: [toInteger(dbAssoc["job_uniform_hd_part_lower_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_part_lower_texture"]) || 0],
			};

			this.bodyProps = {
				hair: [toInteger(dbAssoc["job_uniform_hd_prop_hair_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_hair_texture"]) || 0],
				eyes: [toInteger(dbAssoc["job_uniform_hd_prop_eyes_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_eyes_texture"]) || 0],
				head: [toInteger(dbAssoc["job_uniform_hd_prop_head_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_head_texture"]) || 0],
				leftHand: [toInteger(dbAssoc["job_uniform_hd_prop_lefthand_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_lefthand_texture"]) || 0],
				rightHand: [toInteger(dbAssoc["job_uniform_hd_prop_righthand_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_righthand_texture"]) || 0],
				leftWrist: [toInteger(dbAssoc["job_uniform_hd_prop_leftwrist_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_leftwrist_texture"]) || 0],
				rightWrist: [toInteger(dbAssoc["job_uniform_hd_prop_rightwrist_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_rightwrist_texture"]) || 0],
				hip: [toInteger(dbAssoc["job_uniform_hd_prop_hip_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_hip_texture"]) || 0],
				leftFoot: [toInteger(dbAssoc["job_uniform_hd_prop_leftfoot_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_leftfoot_texture"]) || 0],
				rightFoot: [toInteger(dbAssoc["job_uniform_hd_prop_rightfoot_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_rightfoot_texture"]) || 0],
			};
		}
	}
};

/**
 * @class JobLocationData Representing a job uniform's data. Loaded and saved in the database
 */
class JobLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.jobId = 0;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.blip = false;
		this.pickup = false;
		this.enabled = false;
		this.interior = 0;
		this.dimension = 0;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;
		this.routeCache = [];

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["job_loc_id"]);
			this.jobId = toInteger(dbAssoc["job_loc_job"]);
			this.position = toVector3(toFloat(dbAssoc["job_loc_pos_x"]), toFloat(dbAssoc["job_loc_pos_y"]), toFloat(dbAssoc["job_loc_pos_z"]));
			this.enabled = toInteger(dbAssoc["job_loc_enabled"]);
			this.interior = toInteger(dbAssoc["job_loc_int"]);
			this.dimension = toInteger(dbAssoc["job_loc_vw"]);
		}
	}
};

class JobWhiteListData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.job = 0;
		this.subAccount = 0
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = dbAssoc["job_wl_id"];
			this.job = dbAssoc["job_wl_job"];
			this.subAccount = dbAssoc["job_wl_sacct"]
			this.enabled = dbAssoc["job_wl_enabled"];
		}
	}
};

class JobBlackListData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.job = 0;
		this.subAccount = 0
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = dbAssoc["job_bl_id"];
			this.job = dbAssoc["job_bl_job"];
			this.subAccount = dbAssoc["job_bl_sacct"]
			this.enabled = dbAssoc["job_bl_enabled"];
		}
	}
};

class KeyBindData {
	constructor(dbAssoc = false, key = 0, commandString = "", keyState = VRR_KEYSTATE_UP) {
		this.databaseId = 0;
		this.key = key;
		this.account = 0;
		this.commandString = commandString;
		this.whenAdded = 0;
		this.enabled = true;
		this.keyState = false;
		this.index = -1;
		this.needsSaved = false;

		if(dbAssoc) {
			this.databaseId = dbAssoc["acct_hotkey_id"];
			this.key = toInteger(dbAssoc["acct_hotkey_key"]);
			this.account = toInteger(dbAssoc["acct_hotkey_acct"]);
			this.commandString = dbAssoc["acct_hotkey_cmdstr"];
			this.whenAdded = dbAssoc["acct_hotkey_when_added"];
			this.enabled = intToBool(dbAssoc["acct_hotkey_enabled"]);
			this.keyState = intToBool(dbAssoc["acct_hotkey_down"]);
		}
	}
};

class RadioStationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.url = "";
		this.genre = "";
		this.codec = "";
		this.index = -1;

		if(dbAssoc) {
			this.databaseId = dbAssoc["radio_id"];
			this.name = dbAssoc["radio_name"];
			this.url = dbAssoc["radio_url"];
			this.genre = dbAssoc["radio_genre"];
			this.codec = dbAssoc["radio_codec"];
		}
	}
};

class ItemData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.index = 0;
		this.itemTypeIndex = 0;
		this.itemType = 0;
		this.ownerType = VRR_ITEM_OWNER_NONE;
		this.ownerId = 0;
		this.ownerIndex = -1;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.interior = 0;
		this.dimension = 0;
		this.object = null;
		this.buyPrice = 0;
		this.needsSaved = false;
		this.amount = 0;
		this.value = 0;
		this.enabled = false;
		this.extra = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["item_id"]);
			this.index = 0;
			this.itemTypeIndex = 0;
			this.itemType = toInteger(dbAssoc["item_type"]);
			this.ownerType = toInteger(dbAssoc["item_owner_type"]);;
			this.ownerId = toInteger(dbAssoc["item_owner_id"]);
			this.position = toVector3(toFloat(dbAssoc["item_pos_x"]), toFloat(dbAssoc["item_pos_y"]), toFloat(dbAssoc["item_pos_z"]));
			this.interior = toInteger(dbAssoc["item_int"]);
			this.dimension = toInteger(dbAssoc["item_vw"]);
			this.buyPrice = toInteger(dbAssoc["item_buy_price"]);
			this.amount = toInteger(dbAssoc["item_amount"]);
			this.value = toInteger(dbAssoc["item_value"]);
			this.enabled = intToBool(toInteger(dbAssoc["item_enabled"]));
		}
	}
};

class ItemTypeData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.index = 0;
		this.name = "Unknown";
		this.enabled = false;
		this.useType = VRR_ITEM_USETYPE_NONE;
		this.useId = 0;
		this.useValue = 0;
		this.maxValue = 0;
		this.dropType = VRR_ITEM_DROPTYPE_NONE;
		this.useId = 0;
		this.dropPosition = toVector3(0.0, 0.0, 0.0);
		this.dropRotation = toVector3(0.0, 0.0, 0.0);
		this.dropScale = toVector3(0.0, 0.0, 0.0);
		this.dropModel = 0;
		this.orderPrice = 0;
		this.orderValue = 0;
		this.demandMultiplier = 1;
		this.supplyMultiplier = 1;
		this.riskMultiplier = 1;
		this.needsSaved = false;
		this.useDelay = 0;
		this.switchDelay = 0;
		this.pickupDelay = 0;
		this.putDelay = 0;
		this.takeDelay = 0;
		this.giveDelay = 0;
		this.dropDelay = 0;
		this.useAnimationName = "";
		this.dropAnimationName = "";
		this.pickupAnimationName = "";
		this.giveAnimationName = "";
		this.putAnimationName = "";
		this.takeAnimationName = "";
		this.switchAnimationName = "";
		this.useAnimationIndex = false;
		this.dropAnimationIndex = false;
		this.pickupAnimationIndex = false;
		this.giveAnimationIndex = false;
		this.putAnimationIndex = false;
		this.takeAnimationIndex = false;
		this.switchAnimationIndex = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["item_type_id"]);
			this.serverId = toInteger(dbAssoc["item_type_server"]);
			this.name = dbAssoc["item_type_name"];
			this.enabled = intToBool(toInteger(dbAssoc["item_type_enabled"]));
			this.useType = toInteger(dbAssoc["item_type_use_type"]);
			this.dropType = toInteger(dbAssoc["item_type_drop_type"]);
			this.useId = toInteger(dbAssoc["item_type_use_id"]);
			this.dropPosition = toVector3(toFloat(dbAssoc["item_type_drop_pos_x"]), toFloat(dbAssoc["item_type_drop_pos_y"]), toFloat(dbAssoc["item_type_drop_pos_z"]));
			this.dropRotation = toVector3(toFloat(dbAssoc["item_type_drop_rot_x"]), toFloat(dbAssoc["item_type_drop_rot_y"]), toFloat(dbAssoc["item_type_drop_rot_z"]));
			this.dropScale = toVector3(toFloat(dbAssoc["item_type_drop_scale_x"]), toFloat(dbAssoc["item_type_drop_scale_y"]), toFloat(dbAssoc["item_type_drop_scale_z"]));
			this.dropModel = toInteger(dbAssoc["item_type_drop_model"]);
			this.useId = toInteger(dbAssoc["item_type_use_id"]);
			this.useValue = toInteger(dbAssoc["item_type_use_value"]);
			this.maxValue = toInteger(dbAssoc["item_type_max_value"]);
			this.orderPrice = toInteger(dbAssoc["item_type_order_price"]);
			this.orderValue = toInteger(dbAssoc["item_type_order_value"]);
			this.demandMultiplier = toFloat(dbAssoc["item_type_demand_multiplier"]);
			this.supplyMultiplier = toFloat(dbAssoc["item_type_supply_multiplier"]);
			this.riskMultiplier = toFloat(dbAssoc["item_type_risk_multiplier"]);
			this.size = toInteger(dbAssoc["item_type_size"]);
			this.capacity = toInteger(dbAssoc["item_type_capacity"]);
			this.useDelay = toInteger(dbAssoc["item_type_delay_use"]);
			this.switchDelay = toInteger(dbAssoc["item_type_delay_switch"]);
			this.pickupDelay = toInteger(dbAssoc["item_type_delay_pickup"]);
			this.putDelay = toInteger(dbAssoc["item_type_delay_put"]);
			this.takeDelay = toInteger(dbAssoc["item_type_delay_take"]);
			this.giveDelay = toInteger(dbAssoc["item_type_delay_give"]);
			this.dropDelay = toInteger(dbAssoc["item_type_delay_drop"]);
			this.useAnimationName = toInteger(dbAssoc["item_type_anim_use"]);
			this.switchAnimationName = toInteger(dbAssoc["item_type_anim_switch"]);
			this.pickupAnimationName = toInteger(dbAssoc["item_type_anim_pickup"]);
			this.putAnimationName = toInteger(dbAssoc["item_type_anim_put"]);
			this.takeAnimationName = toInteger(dbAssoc["item_type_anim_take"]);
			this.giveAnimationName = toInteger(dbAssoc["item_type_anim_give"]);
			this.dropAnimationName = toInteger(dbAssoc["item_type_anim_drop"]);
		}
	}
};

class NPCData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.name = "NPC";
		this.skin = 0;
		this.cash = 0;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.rotation = toVector3(0.0, 0.0, 0.0);
		this.scale = toVector3(1.0, 1.0, 1.0);
		this.heading = 0.0;
		this.clan = 0;
		this.isWorking = false;
		this.jobUniform = this.skin;
		this.lastJobVehicle = null;
		this.job = 0;
		this.weapons = [];
		this.interior = 0;
		this.dimension = 0;
		this.walkStyle = 0;
		this.fightStyle = 0;
		this.health = 100;
		this.armour = 100;
		this.currentAction = VRR_NPC_ACTION_NONE;
		this.triggers = [];
		this.typeFlags = 0;
		this.heedThreats = false;
		this.threats = 0;
		this.invincible = false;
		this.animationName = "";
		this.ownerType = VRR_NPCOWNER_NONE;
		this.ownerId = 0;

		this.bodyParts = {
			hair: [0,0],
			head: [0,0],
			upper: [0,0],
			lower: [0,0],
		};

		this.bodyProps = {
			hair: [0,0],
			eyes: [0,0],
			head: [0,0],
			leftHand: [0,0],
			rightHand: [0,0],
			leftWrist: [0,0],
			rightWrist: [0,0],
			hip: [0,0],
			leftFoot: [0,0],
			rightFoot: [0,0],
		};

		this.triggers = [];

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["npc_id"]);
			this.serverId = toInteger(dbAssoc["npc_server"]);
			this.name = dbAssoc["npc_name"];
			this.skin = toInteger(dbAssoc["npc_skin"]);
			this.cash = toInteger(dbAssoc["npc_cash"]);
			this.position = toVector3(toFloat(dbAssoc["npc_pos_x"]), toFloat(dbAssoc["npc_pos_y"]), toFloat(dbAssoc["npc_pos_z"]));
			this.rotation = toVector3(toFloat(dbAssoc["npc_rot_x"]), toFloat(dbAssoc["npc_rot_y"]), toFloat(dbAssoc["npc_rot_z"]));
			this.scale = toVector3(toFloat(dbAssoc["npc_scale_x"]), toFloat(dbAssoc["npc_scale_y"]), toFloat(dbAssoc["npc_scale_z"]));
			this.heading = toFloat(dbAssoc["npc_rot_z"]);
			this.lastLogin = toInteger(dbAssoc["npc_when_lastlogin"]);
			this.rank = toInteger(dbAssoc["npc_rank"]);
			this.title = toInteger(dbAssoc["npc_title"]);
			this.job = toInteger(dbAssoc["npc_job"]);
			this.interior = toInteger(dbAssoc["npc_int"]);
			this.dimension = toInteger(dbAssoc["npc_vw"]);
			this.walkStyle = toInteger(dbAssoc["npc_walkstyle"]);
			this.fightStyle = toInteger(dbAssoc["npc_fightstyle"]);
			this.health = toInteger(dbAssoc["npc_health"]);
			this.armour = toInteger(dbAssoc["npc_armour"]);
			this.typeFlags = toInteger(dbAssoc["npc_type_flags"]);
			this.heedThreats = intToBool(dbAssoc["npc_headthreats"]);
			this.threats = toInteger(dbAssoc["npc_threats"]);
			this.invincible = intToBool(dbAssoc["npc_invincible"]);
			this.animationName = intToBool(dbAssoc["npc_animation"]);

			this.bodyParts = {
				hair: [toInteger(dbAssoc["npc_hd_part_hair_model"]) || 0, toInteger(dbAssoc["npc_hd_part_hair_texture"]) || 0],
				head: [toInteger(dbAssoc["npc_hd_part_head_model"]) || 0, toInteger(dbAssoc["npc_hd_part_head_texture"]) || 0],
				upper: [toInteger(dbAssoc["npc_hd_part_upper_model"]) || 0, toInteger(dbAssoc["npc_hd_part_upper_texture"]) || 0],
				lower: [toInteger(dbAssoc["npc_hd_part_lower_model"]) || 0, toInteger(dbAssoc["npc_hd_part_lower_texture"]) || 0],
			};

			this.bodyProps = {
				hair: [toInteger(dbAssoc["npc_hd_prop_hair_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_hair_texture"]) || 0],
				eyes: [toInteger(dbAssoc["npc_hd_prop_eyes_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_eyes_texture"]) || 0],
				head: [toInteger(dbAssoc["npc_hd_prop_head_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_head_texture"]) || 0],
				leftHand: [toInteger(dbAssoc["npc_hd_prop_lefthand_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_lefthand_texture"]) || 0],
				rightHand: [toInteger(dbAssoc["npc_hd_prop_righthand_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_righthand_texture"]) || 0],
				leftWrist: [toInteger(dbAssoc["npc_hd_prop_leftwrist_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_leftwrist_texture"]) || 0],
				rightWrist: [toInteger(dbAssoc["npc_hd_prop_rightwrist_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_rightwrist_texture"]) || 0],
				hip: [toInteger(dbAssoc["npc_hd_prop_hip_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_hip_texture"]) || 0],
				leftFoot: [toInteger(dbAssoc["npc_hd_prop_leftfoot_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_leftfoot_texture"]) || 0],
				rightFoot: [toInteger(dbAssoc["npc_hd_prop_rightfoot_model"]) || 0, toInteger(dbAssoc["npc_hd_prop_rightfoot_texture"]) || 0],
			};
		}
	}
};

class NPCTriggerData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.npcId = 0;
		this.index = 0;
		this.npc = 0;
		this.npcIndex = -1;
		this.triggerType = 0;
		this.conditions = [];
		this.responses = [];

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["npc_trig_id"]);
			this.npc = toInteger(dbAssoc["npc_trig_npc"]);
			this.triggerType = toInteger(dbAssoc["npc_trig_type"]);
		}
	}
};

class NPCTriggerConditionData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.triggerId = 0;
		this.index = 0;
		this.triggerIndex = 0;
		this.conditionType = 0;
		this.conditionValue = false;
		this.matchType = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["npc_trig_cond_id"]);
			this.npc = toInteger(dbAssoc["npc_trig_cond_trig"]);
			this.conditionType = toInteger(dbAssoc["npc_trig_cond_type"]);
			this.conditionValue = toInteger(dbAssoc["npc_trig_cond_val"]);
			this.matchType = toInteger(dbAssoc["npc_trig_cond_val"]);
		}
	}
};

class NPCTriggerResponseData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.triggerId = 0;
		this.index = 0;
		this.triggerIndex = 0;
		this.responseType = 0;
		this.responseValue = false;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["npc_trig_resp_id"]);
			this.npc = toInteger(dbAssoc["npc_trig_resp_trig"]);
			this.responseType = toInteger(dbAssoc["npc_trig_resp_type"]);
			this.responseValue = toInteger(dbAssoc["npc_trig_resp_val"]);
		}
	}
};

class BanData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.type = VRR_BANTYPE_NONE;
		this.detail = "";
		this.ipAddress = "";
		this.name = "";
		this.reason = "";

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["ban_id"]);
			this.type = dbAssoc["ban_type"];
			this.detail = toInteger(dbAssoc["ban_detail"]);
			this.ipAddress = toInteger(dbAssoc["ban_ip"]);
			this.reason = toInteger(dbAssoc["ban_reason"]);
		}
	}
}

class JobRouteData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.jobId = 0;
		this.locationId = 0;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.locationIndex = -1;
		this.needsSaved = false;
		this.pay = 0;
		this.vehicleColour1 = 1;
		this.vehicleColour2 = 1;
		this.detail = 0;
		this.startMessage = "";
		this.finishMessage = "";
		this.locationArriveMessage = "";
		this.locationNextMessage = "";
		this.locations = [];

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["job_route_id"]);
			this.name = toString(dbAssoc["job_route_name"]);
			this.jobId = toInteger(dbAssoc["job_route_job"]);
			this.locationId = toInteger(dbAssoc["job_route_job_loc"]);
			this.enabled = intToBool(toInteger(dbAssoc["job_route_enabled"]));
			this.pay = toInteger(dbAssoc["job_route_pay"]);
			this.startMessage = toString(dbAssoc["job_route_start_msg"]);
			this.finishMessage = toString(dbAssoc["job_route_finish_msg"]);
			this.locationArriveMessage = toString(dbAssoc["job_route_loc_arrive_msg"]);
			this.locationNextMessage = toString(dbAssoc["job_route_loc_next_msg"]);
			this.vehicleColour1 = toInteger(dbAssoc["job_route_veh_colour1"]);
			this.vehicleColour2 = toInteger(dbAssoc["job_route_veh_colour2"]);
			this.detail = toInteger(dbAssoc["job_route_detail"]);
		}
	}
};

class JobRouteLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.routeId = 0;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.routeIndex = -1;
		this.needsSaved = false;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.stopDelay = 0;
		this.pay = 0;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["job_route_loc_id"]);
			this.name = toString(dbAssoc["job_route_loc_name"]);
			this.routeId = toInteger(dbAssoc["job_route_loc_route"]);
			this.enabled = intToBool(toInteger(dbAssoc["job_route_loc_enabled"]));
			this.position = toVector3(toFloat(dbAssoc["job_route_loc_x"]), toFloat(dbAssoc["job_route_loc_y"]), toFloat(dbAssoc["job_route_loc_z"]));
			this.stopDelay = toInteger(dbAssoc["job_route_loc_delay"]);
			this.pay = toInteger(dbAssoc["job_route_loc_pay"]);
		}
	}
};

class GateData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.scriptName = "";
		this.enabled = false;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.locked = true;
		this.ownerType = VRR_GATEOWNER_NONE;
		this.ownerId = 0;

		if(dbAssoc) {
			this.databaseId = toInteger(dbAssoc["gate_id"]);
			this.name = toString(dbAssoc["gate_name"]);
			this.scriptName = toString(dbAssoc["gate_script_name"]);
			this.enabled = intToBool(toInteger(dbAssoc["gate_enabled"]));
			this.position = toVector3(toFloat(dbAssoc["gate_pos_x"]), toFloat(dbAssoc["gate_pos_y"]), toFloat(dbAssoc["gate_pos_z"]));
			this.ownerType = toInteger(dbAssoc["gate_owner_type"]);
			this.ownerId = toInteger(dbAssoc["gate_owner_id"]);
		}
	}
}