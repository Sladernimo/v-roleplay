// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: trigger.js
// DESC: Provides trigger system functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

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

// ===========================================================================

function initTriggerScript() {
	logToConsole(LOG_INFO, "[VRR.Trigger]: Initializing trigger script ...");
	logToConsole(LOG_INFO, "[VRR.Trigger]: Trigger script initialized successfully!");
	return true;
}

// ===========================================================================

function createTriggerCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function deleteTriggerCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function addTriggerConditionCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function removeTriggerConditionCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function addTriggerResponseCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function removeTriggerResponseCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function listTriggersCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function listTriggerConditionsCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function listTriggerResponsesCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================

function toggleTriggerEnabledCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}
}

// ===========================================================================