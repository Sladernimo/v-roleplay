// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: fishing.js
// DESC: Provides fishing functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

// Fishing Catch Types (Probably not going to be used, in favor of items and their use type)
const V_FISHING_CATCH_TYPE_NONE = 0;
const V_FISHING_CATCH_TYPE_FISH = 1;
const V_FISHING_CATCH_TYPE_JUNK = 2;

// Fishing Line States
const V_FISHING_LINE_STATE_NONE = 0;
const V_FISHING_LINE_STATE_READY = 1;
const V_FISHING_LINE_STATE_CASTING = 2;
const V_FISHING_LINE_STATE_CASTED = 3;
const V_FISHING_LINE_STATE_REELING = 4;
const V_FISHING_LINE_STATE_HOOKED = 5;

// ===========================================================================

class FishingLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.index = -1;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.enabled = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["fish_loc_id"]);
			this.serverId = toInteger(dbAssoc["fish_loc_server"]);
			this.enabled = intToBool(dbAssoc["fish_loc_enabled"]);
			this.position = toVector3(toFloat(dbAssoc["fish_loc_pos_x"]), toFloat(dbAssoc["fish_loc_pos_y"]), toFloat(dbAssoc["fish_loc_pos_z"]));
			this.whoAdded = toInteger(dbAssoc["fish_loc_who_added"]);
			this.whenAdded = toInteger(dbAssoc["fish_loc_when_added"]);
		}
	}
};

// ===========================================================================

let fishingCollectables = [
	// Fish
	["Salmon", V_FISHING_CATCH_TYPE_FISH],
	["Tuna", V_FISHING_CATCH_TYPE_FISH],
	["Crab", V_FISHING_CATCH_TYPE_FISH],
	["Trout", V_FISHING_CATCH_TYPE_FISH],
	["Sea Bass", V_FISHING_CATCH_TYPE_FISH],
	["Shark", V_FISHING_CATCH_TYPE_FISH],
	["Turtle", V_FISHING_CATCH_TYPE_FISH],
	["Manta Ray", V_FISHING_CATCH_TYPE_FISH],
	["Cat Fish", V_FISHING_CATCH_TYPE_FISH],
	["Blue Marlin", V_FISHING_CATCH_TYPE_FISH],

	// Junk
	["Rusty Can", V_FISHING_CATCH_TYPE_JUNK],
	["Old Pants", V_FISHING_CATCH_TYPE_JUNK],
	["Old Shoes", V_FISHING_CATCH_TYPE_JUNK],
	["Garbage", V_FISHING_CATCH_TYPE_JUNK],
	["Baby Diaper", V_FISHING_CATCH_TYPE_JUNK],
	["Old Tire", V_FISHING_CATCH_TYPE_JUNK],
	["Old Car Battery", V_FISHING_CATCH_TYPE_JUNK],
	["Horse Hoove", V_FISHING_CATCH_TYPE_JUNK],
	["Soggy Log", V_FISHING_CATCH_TYPE_JUNK],
	["Soggy Dildo", V_FISHING_CATCH_TYPE_JUNK],
	["Clump of Seaweed", V_FISHING_CATCH_TYPE_JUNK],
];

// ===========================================================================

let fishingAnimations = {
	[V_GAME_GTA_III]: {
		"fishingLineCasting": "bathit1",
		"fishingLineReeling": "aimdown",
	},
	[V_GAME_GTA_VC]: {
		"fishingLineCasting": "frontpunch",
		"fishingLineReeling": "aimdown",
	},
	[V_GAME_GTA_SA]: {
		"fishingLineCasting": "none",
		"fishingLineReeling": "none",
	},
	//[V_GAME_MAFIA_ONE]: {
	//	"fishingLineCasting": "none",
	//	"fishingLineReeling": "none",
	//}
};

// ===========================================================================

let fishingParticleEffects = {
	[V_GAME_GTA_III]: {
		"fishingLineCast": [
			"MediumSprayingWater",
			0.2,
			500
		],
		"fishingLineReel": [
			"MediumSprayingWater",
			0.2,
			500
		]
	}
};

// ===========================================================================

function initFishingScript() {
	logToConsole(LOG_INFO, "[V.RP.Fishing]: Initializing fishing script ...");
	logToConsole(LOG_INFO, "[V.RP.Fishing]: Fishing script initialized successfully!");
}

// ===========================================================================

function castFishingLineCommand(command, params, client) {
	if (!isPlayerInFishingSpot(client)) {
		messagePlayerError(client, getLocaleString(client, "CantFishHere"));
		return false;
	}

	if (doesPlayerHaveItemOfUseTypeEquipped(client, V_ITEM_USE_TYPE_FISHINGROD)) {
		messagePlayerError(client, getLocaleString(client, "NeedFishingRod"));
		return false;
	}

	if (doesPlayerHaveFishingLineCast(client)) {
		messagePlayerError(client, getLocaleString(client, "FishingLineAlreadyCast"));
		return false;
	}

	let maxStrength = globalConfig.fishingCastMaxStrength;
	let minStrength = globalConfig.fishingCastMinStrength;
	let keyDuration = getPlayerData(client).keyBindDuration;

	let strength = Math.round((maxStrength - minStrength) * (keyDuration / globalConfig.fishingLineCastDuration));

	castPlayerFishingLine(client, strength);

	let messageText = getLocaleString(client, "FishingCastCommandHelp");
	if (doesPlayerHaveKeyBindForCommand(client, "fish")) {
		messageText = getLocaleString(client, "FishingCastKeyPressHelp");
	}
	showSmallGameMessage(client, messageText);
}

// ===========================================================================

function resetFishingLineCommand(client) {
	if (doesPlayerHaveFishingLineCast(client)) {
		messagePlayerError(client, getLocaleString(client, "FishingLineNotCast"));
		return false;
	}

	if (doesPlayerHaveItemOfUseTypeEquipped(client, V_ITEM_USE_TYPE_FISHINGROD)) {
		messagePlayerError(client, getLocaleString(client, "NeedFishingRod"));
		return false;
	}

	if (!isPlayerInFishingSpot(client)) {
		messagePlayerError(client, getLocaleString(client, "CantFishHere"));
		return false;
	}

	makePedStopAnimation(getPlayerPed(client));

	let messageText = getLocaleString(client, "FishingCastCommandHelp");
	if (doesPlayerHaveKeyBindForCommand(client, "fish")) {
		messageText = getLocaleString(client, "FishingCastKeyPressHelp");
	}

	showSmallGameMessage(client, messageText);

	getPlayerData(client).fishingLineState = V_FISHING_LINE_STATE_NONE;
	getPlayerData(client).fishingLineCastStart = 0;
}

// ===========================================================================

function doesPlayerHaveFishingLineCast(client) {
	return getPlayerData(client).fishingLineCastStart != 0;
}

// ===========================================================================

function castPlayerFishingLine(client, strength) {
	let frontPosition = getPosInFrontOfPos(getPlayerPosition(client), getPlayerHeading(client), strength * 2);

	makePlayerPlayAnimation(client, getAnimationFromParams(fishingAnimations[getGame()]["fishingLineCasting"]));

	setTimeout(function () {
		let particleEffectName = fishingParticleEffects[getGame()].fishingLineCast[1];
		showParticleEffect(frontPosition, gameData.particleEffects[getGame()][particleEffectName], fishingParticleEffects[getGame()].fishingLineCast[1], fishingParticleEffects[getGame()].fishingLineCast[2]);

		getPlayerData(client).fishingLineCastPosition = frontPosition;
		getPlayerData(client).fishingLineState = V_FISHING_LINE_STATE_CASTED;
	}, strength * 10);
}

// ===========================================================================

function isPlayerInFishingSpot(client) {
	if (isPlayerOnBoat(client)) {
		return true;
	}

	let closestFishingLocation = getClosestFishingLocation(getPlayerPosition(client));
	if (closestFishingLocation != false) {
		if (getDistance(getPlayerPosition(client), closestFishingLocation) < globalConfig.fishingSpotDistance) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function isPlayerFishing(client) {
	return (getPlayerData(client).fishingLineState != V_FISHING_LINE_STATE_NONE);
}

// ===========================================================================

function isPlayerFishing(client) {
	return (getPlayerData(client).fishingLineState != V_FISHING_LINE_STATE_NONE);
}

// ===========================================================================

function getClosestFishingLocation(position) {
	let closest = 0;
	for (let i in serverData.fishingLocations) {
		if (getDistance(position, serverData.fishingLocations[i].position) < getDistance(position, serverData.fishingLocations[closest].position))
			closest = i;
	}

	return closest;
}

// ===========================================================================