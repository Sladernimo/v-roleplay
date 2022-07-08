// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: trigger.js
// DESC: Provides trigger system functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

const AGRP_TRIG_TYPE_NONE = 0;

// ===========================================================================

const AGRP_TRIG_COND_TYPE_NONE = 0;

// ===========================================================================

const AGRP_TRIG_RESP_TYPE_NONE = 0;

// ===========================================================================

const AGRP_TRIG_COND_MATCH_NONE = 0;

// ===========================================================================

/*
const triggerTypes = [
	"onBusinessOwnerChange",
	"onBusinessNameChange",
	"onBusinessLockChange",
	"onBusinessPlayerEnter",
	"onBusinessPlayerExit",
	"onBusinessBotEnter",
	"onBusinessBotExit",
	"onBusinessDamage",
	"onBusinessRobbed",
	"onBusinessPlayerPurchase",
	"onBusinessBotPurchase",
	"onHouseOwnerChange",
	"onHouseNameChange",
	"onHouseLockChange",
	"onHousePlayerEnter",
	"onHousePlayerExit",
	"onHouseBotEnter",
	"onHouseBotExit",
	"onHouseDamage",
	"onHouseRobbed",
	"onVehicleOwnerChange",
	"onVehiclePlayerEnter",
	"onVehiclePlayerExit",
	"onVehicleBotEnter",
	"onVehicleBotExit",
	"onVehicleCollision",
	"onVehicleDamaged",
	"onVehicleShot",
	"onVehicleTrunkChange",
	"onVehicleItemTaken",
	"onVehicleItemStored",
	"onVehicleEngineChange",
	"onVehicleLightsChange",
	"onVehicleSirenChange",
	"onVehicleLockChange",
	"onVehicleRepaired",
	"onVehicleColourChange",
	"onVehicleExtraChange",
	"onPlayerShout",
	"onPlayerTalk",
	"onPlayerWhisper",
];
*/

// ===========================================================================

/**
 * @class Representing a trigger's data. Loaded and saved in the database
 * @property {Array.<TriggerConditionData>} conditions
 * @property {Array.<TriggerResponseData>} responses
 */
class TriggerData {
	constructor(dbAssoc) {
		this.databaseId = 0
		this.type = AGRP_TRIG_TYPE_NONE;
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
		this.type = AGRP_TRIG_COND_TYPE_NONE;
		this.matchType = AGRP_TRIG_COND_MATCH_NONE;
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
		this.type = AGRP_TRIG_RESP_TYPE_NONE;
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
	logToConsole(LOG_INFO, "[VRR.Trigger]: Initializing trigger script ...");
	logToConsole(LOG_INFO, "[VRR.Trigger]: Trigger script initialized successfully!");
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