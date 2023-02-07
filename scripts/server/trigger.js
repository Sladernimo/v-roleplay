// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: trigger.js
// DESC: Provides trigger system functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

const V_TRIG_TYPE_NONE = 0;
const V_TRIG_TYPE_BIZ_OWNER_CHANGE = 1;
const V_TRIG_TYPE_BIZ_NAME_CHANGE = 2;
const V_TRIG_TYPE_BIZ_LOCK_CHANGE = 3;
const V_TRIG_TYPE_BIZ_PLAYER_ENTER = 4;
const V_TRIG_TYPE_BIZ_PLAYER_EXIT = 5;
const V_TRIG_TYPE_BIZ_NPC_ENTER = 6;
const V_TRIG_TYPE_BIZ_NPC_EXIT = 7;
const V_TRIG_TYPE_BIZ_DAMAGE = 8;
const V_TRIG_TYPE_BIZ_ROBBED = 9;
const V_TRIG_TYPE_BIZ_PLAYER_PURCHASE = 10;
const V_TRIG_TYPE_BIZ_NPC_PURCHASE = 11;
const V_TRIG_TYPE_HOUSE_OWNER_CHANGE = 12;
const V_TRIG_TYPE_HOUSE_NAME_CHANGE = 13;
const V_TRIG_TYPE_HOUSE_LOCK_CHANGE = 14;
const V_TRIG_TYPE_HOUSE_PLAYER_ENTER = 15;
const V_TRIG_TYPE_HOUSE_PLAYER_EXIT = 16;
const V_TRIG_TYPE_HOUSE_NPC_ENTER = 17;
const V_TRIG_TYPE_HOUSE_NPC_EXIT = 18;
const V_TRIG_TYPE_HOUSE_DAMAGE = 19;
const V_TRIG_TYPE_HOUSE_ROBBED = 20;
const V_TRIG_TYPE_VEH_OWNER_CHANGE = 21;
const V_TRIG_TYPE_VEH_PLAYER_ENTER = 22;
const V_TRIG_TYPE_VEH_PLAYER_EXIT = 23;
const V_TRIG_TYPE_VEH_NPC_ENTER = 24;
const V_TRIG_TYPE_VEH_NPC_EXIT = 25;
const V_TRIG_TYPE_VEH_COLLISION = 26;
const V_TRIG_TYPE_VEH_DAMAGED = 27;
const V_TRIG_TYPE_VEH_SHOT = 28;
const V_TRIG_TYPE_VEH_TRUNK_CHANGE = 29;
const V_TRIG_TYPE_VEH_ITEM_TAKEN = 30;
const V_TRIG_TYPE_VEH_ITEM_STORED = 31;
const V_TRIG_TYPE_VEH_ENGINE_CHANGE = 32;
const V_TRIG_TYPE_VEH_LIGHTS_CHANGE = 33;
const V_TRIG_TYPE_VEH_SIREN_CHANGE = 34;
const V_TRIG_TYPE_VEH_LOCK_CHANGE = 35;
const V_TRIG_TYPE_VEH_REPAIRED = 36;
const V_TRIG_TYPE_VEH_COLOUR_CHANGE = 37;
const V_TRIG_TYPE_VEH_EXTRA_CHANGE = 38;
const V_TRIG_TYPE_PLAYER_SHOUT = 39;
const V_TRIG_TYPE_PLAYER_TALK = 40;
const V_TRIG_TYPE_PLAYER_WHISPER = 41;

// ===========================================================================

// Need to plan this out
const V_TRIG_COND_TYPE_NONE = 0;
const V_TRIG_COND_TYPE_VEH_OCCUPANT = 1;
const V_TRIG_COND_TYPE_VEH_DRIVER = 3;
const V_TRIG_COND_TYPE_VEH_OWNER_TYPE = 2;
const V_TRIG_COND_TYPE_VEH_OWNER_ID = 4;

// ===========================================================================

// Need to plan this out
const V_TRIG_COND_MATCH_NONE = 0;
const V_TRIG_COND_MATCH_EXACT_VALUE = 1;
const V_TRIG_COND_MATCH_GREATER_THAN = 2;
const V_TRIG_COND_MATCH_LESS_THAN = 2;
const V_TRIG_COND_MATCH_NOT_EQUAL = 3;
const V_TRIG_COND_MATCH_CLAN = 4;
const V_TRIG_COND_MATCH_JOB = 5;
const V_TRIG_COND_MATCH_BIZ = 6;
const V_TRIG_COND_MATCH_HOUSE = 7;
const V_TRIG_COND_MATCH_VEH = 8;
const V_TRIG_COND_MATCH_NPC = 9;

// ===========================================================================

const V_TRIG_RESP_TYPE_NONE = 0;
const V_TRIG_RESP_SHOUT = 1;
const V_TRIG_RESP_TALK = 2;
const V_TRIG_RESP_WHISPER = 3;

// ===========================================================================

let triggerTypes = {
	BusinessOwnerChange: V_TRIG_TYPE_BIZ_OWNER_CHANGE,
	BusinessNameChange: V_TRIG_TYPE_BIZ_NAME_CHANGE,
	BusinessLockChange: V_TRIG_TYPE_BIZ_LOCK_CHANGE,
	BusinessPlayerEnter: V_TRIG_TYPE_BIZ_PLAYER_ENTER,
	BusinessPlayerExit: V_TRIG_TYPE_BIZ_PLAYER_EXIT,
	BusinessNPCEnter: V_TRIG_TYPE_BIZ_NPC_ENTER,
	BusinessNPCExit: V_TRIG_TYPE_BIZ_NPC_EXIT,
	BusinessDamage: V_TRIG_TYPE_BIZ_DAMAGE,
	BusinessRobbed: V_TRIG_TYPE_BIZ_ROBBED,
	BusinessPlayerPurchase: V_TRIG_TYPE_BIZ_PLAYER_PURCHASE,
	BusinessNPCPurchase: V_TRIG_TYPE_BIZ_NPC_PURCHASE,
	HouseOwnerChange: V_TRIG_TYPE_HOUSE_OWNER_CHANGE,
	HouseNameChange: V_TRIG_TYPE_HOUSE_NAME_CHANGE,
	HouseLockChange: V_TRIG_TYPE_HOUSE_LOCK_CHANGE,
	HousePlayerEnter: V_TRIG_TYPE_HOUSE_PLAYER_ENTER,
	HousePlayerExit: V_TRIG_TYPE_HOUSE_PLAYER_EXIT,
	HouseNPCEnter: V_TRIG_TYPE_HOUSE_NPC_ENTER,
	HouseNPCExit: V_TRIG_TYPE_HOUSE_NPC_EXIT,
	HouseDamage: V_TRIG_TYPE_HOUSE_DAMAGE,
	HouseRobbed: V_TRIG_TYPE_HOUSE_ROBBED,
	VehicleOwnerChange: V_TRIG_TYPE_VEH_OWNER_CHANGE,
	VehiclePlayerEnter: V_TRIG_TYPE_VEH_PLAYER_ENTER,
	VehiclePlayerExit: V_TRIG_TYPE_VEH_PLAYER_EXIT,
	VehicleNPCEnter: V_TRIG_TYPE_VEH_NPC_ENTER,
	VehicleNPCExit: V_TRIG_TYPE_VEH_NPC_EXIT,
	VehicleCollision: V_TRIG_TYPE_VEH_COLLISION,
	VehicleDamaged: V_TRIG_TYPE_VEH_DAMAGED,
	VehicleShot: V_TRIG_TYPE_VEH_SHOT,
	VehicleTrunkChange: V_TRIG_TYPE_VEH_TRUNK_CHANGE,
	VehicleItemTaken: V_TRIG_TYPE_VEH_ITEM_TAKEN,
	VehicleItemStored: V_TRIG_TYPE_VEH_ITEM_STORED,
	VehicleEngineChange: V_TRIG_TYPE_VEH_ENGINE_CHANGE,
	VehicleLightsChange: V_TRIG_TYPE_VEH_LIGHTS_CHANGE,
	VehicleSirenChange: V_TRIG_TYPE_VEH_SIREN_CHANGE,
	VehicleLockChange: V_TRIG_TYPE_VEH_LOCK_CHANGE,
	VehicleRepaired: V_TRIG_TYPE_VEH_REPAIRED,
	VehicleColourChange: V_TRIG_TYPE_VEH_COLOUR_CHANGE,
	VehicleExtraChange: V_TRIG_TYPE_VEH_EXTRA_CHANGE,
	PlayerShout: V_TRIG_TYPE_PLAYER_SHOUT,
	PlayerTalk: V_TRIG_TYPE_PLAYER_TALK,
	PlayerWhisper: V_TRIG_TYPE_PLAYER_WHISPER,
};

// ===========================================================================

/**
 * @class Representing a trigger's data. Loaded and saved in the database
 * @property {Array.<TriggerConditionData>} conditions
 * @property {Array.<TriggerResponseData>} responses
 */
class TriggerData {
	constructor(dbAssoc) {
		this.databaseId = 0
		this.type = V_TRIG_TYPE_NONE;
		this.enabled = false;
		this.whoAdded = 0;
		this.whenAdded = 0;


		this.conditions = [];
		this.responses = [];

		if (dbAssoc != false) {
			this.databaseId = toInteger(dbAssoc["trig_id"]);
			this.type = toInteger(dbAssoc["trig_type"]);
			this.enabled = intToBool(dbAssoc["trig_enabled"]);
			this.whoAdded = toInteger(dbAssoc["trig_who_added"]);
			this.whenAdded = toInteger(dbAssoc["trig_when_added"]);
		}
	}
}

// ===========================================================================

/**
 * @class Representing a trigger condition's data. Loaded and saved in the database
 */
class TriggerConditionData {
	constructor(dbAssoc) {
		this.databaseId = 0
		this.index = -1;
		this.triggerId = 0;
		this.triggerIndex = -1;
		this.type = V_TRIG_COND_TYPE_NONE;
		this.matchType = V_TRIG_COND_MATCH_NONE;
		this.enabled = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc != false) {
			this.databaseId = toInteger(dbAssoc["trig_cond_id"]);
			this.type = toInteger(dbAssoc["trig_cond_type"]);
			this.triggerId = toInteger(dbAssoc["trig_cond_trig"]);
			this.data = dbAssoc["trig_cond_data"];
			this.matchType = toInteger(dbAssoc["trig_cond_match_type"]);
			this.enabled = intToBool(dbAssoc["trig_cond_enabled"]);
			this.whoAdded = toInteger(dbAssoc["trig_cond_who_added"]);
			this.whenAdded = toInteger(dbAssoc["trig_cond_when_added"]);
		}
	}
}

// ===========================================================================

/**
 * @class Representing a trigger response's data. Loaded and saved in the database
 */
class TriggerResponseData {
	constructor(dbAssoc) {
		this.databaseId = 0
		this.index = -1;
		this.triggerId = 0;
		this.triggerIndex = -1;
		this.priority = 0;
		this.type = V_TRIG_RESP_TYPE_NONE;
		this.enabled = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc != false) {
			this.databaseId = toInteger(dbAssoc["trig_resp_id"]);
			this.type = toInteger(dbAssoc["trig_resp_type"]);
			this.triggerId = toInteger(dbAssoc["trig_resp_trig"]);
			this.enabled = intToBool(dbAssoc["trig_resp_enabled"]);
			this.whoAdded = toInteger(dbAssoc["trig_resp_who_added"]);
			this.whenAdded = toInteger(dbAssoc["trig_resp_when_added"]);
		}
	}
}

// ===========================================================================

function initTriggerScript() {
	logToConsole(LOG_INFO, "[V.RP.Trigger]: Initializing trigger script ...");
	logToConsole(LOG_INFO, "[V.RP.Trigger]: Trigger script initialized successfully!");
	return true;
}

// ===========================================================================

function loadTriggersFromDatabase() {

}

// ===========================================================================

function loadTriggerConditionsFromDatabase(triggerDatabaseId) {

}

// ===========================================================================

function loadTriggerResponsesFromDatabase(triggerDatabaseId) {

}

// ===========================================================================

function createTriggerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function deleteTriggerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function addTriggerConditionCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function removeTriggerConditionCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function addTriggerResponseCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function removeTriggerResponseCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function listTriggersCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function listTriggerConditionsCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function listTriggerResponsesCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function toggleTriggerEnabledCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================