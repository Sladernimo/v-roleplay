// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: fishing.js
// DESC: Provides fishing functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

// Fishing Catch Types (Probably not going to be used, in favor of items and their use type)
const AGRP_FISHING_CATCH_TYPE_NONE = 1;
const AGRP_FISHING_CATCH_TYPE_FISH = 1;
const AGRP_FISHING_CATCH_TYPE_JUNK = 2;

// ===========================================================================

let fishingCollectables = [
	// Fish
	["Salmon", AGRP_FISHING_CATCH_TYPE_FISH],
	["Tuna", AGRP_FISHING_CATCH_TYPE_FISH],
	["Crab", AGRP_FISHING_CATCH_TYPE_FISH],
	["Trout", AGRP_FISHING_CATCH_TYPE_FISH],
	["Sea Bass", AGRP_FISHING_CATCH_TYPE_FISH],
	["Shark", AGRP_FISHING_CATCH_TYPE_FISH],
	["Turtle", AGRP_FISHING_CATCH_TYPE_FISH],
	["Manta Ray", AGRP_FISHING_CATCH_TYPE_FISH],
	["Cat Fish", AGRP_FISHING_CATCH_TYPE_FISH],
	["Blue Marlin", AGRP_FISHING_CATCH_TYPE_FISH],

	// Junk
	["Rusty Can", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Old Pants", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Old Shoes", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Garbage", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Baby Diaper", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Old Tire", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Old Car Battery", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Horse Hoove", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Soggy Log", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Soggy Dildo", AGRP_FISHING_CATCH_TYPE_JUNK],
	["Clump of Seaweed", AGRP_FISHING_CATCH_TYPE_JUNK],
];

// ===========================================================================

function initFishingScript() {
	logToConsole(LOG_INFO, "[VRR.Fishing]: Initializing fishing script ...");
	logToConsole(LOG_INFO, "[VRR.Fishing]: Fishing script initialized successfully!");
}

// ===========================================================================

function castFishingLineCommand(client) {
	if (isPlayerInFishingSpot(client)) {
		messagePlayerError(client, getLocaleString(client, "CantFishHere"));
		return false;
	}

	if (doesPlayerHaveItemOfUseTypeEquipped(client, AGRP_ITEM_USE_TYPE_FISHINGROD)) {
		messagePlayerError(client, getLocaleString(client, "NeedFishingRod"));
		return false;
	}

	getPlayerData(client).fishingLineCastStart = getCurrentUnixTimestamp();
	makePedPlayAnimation(getPlayerPed(client), getAnimationFromParams("batswing"));

	let messageText = getLocaleString(client, "FishingCastCommandHelp")
	if (doesPlayerHaveKeyBindForCommand(client, "fish")) {
		messageText = getLocaleString(client, "FishingCastKeyPressHelp")
	}

	showGameMessage(client, messageText);
}

// ===========================================================================

function resetFishingLineCommand(client) {
	if (doesPlayerHaveFishingLineCast(client)) {
		messagePlayerError(client, getLocaleString(client, "FishingLineNotCast"));
		return false;
	}

	if (doesPlayerHaveItemOfUseTypeEquipped(client, AGRP_ITEM_USE_TYPE_FISHINGROD)) {
		messagePlayerError(client, getLocaleString(client, "CantFishHere"));
		return false;
	}

	makePedStopAnimation(getPlayerPed(client));

	let messageText = getLocaleString(client, "FishingCastCommandHelp")
	if (doesPlayerHaveKeyBindForCommand(client, "fish")) {
		messageText = getLocaleString(client, "FishingCastKeyPressHelp")
	}

	showGameMessage(client, messageText);
}

// ===========================================================================

function doesPlayerHaveFishingLineCast(client) {
	return getPlayerData(client).fishingLineCastStart != 0;
}

// ===========================================================================

function isPlayerInFishingSpot(client) {
	if (isPlayerOnBoat(client)) {
		return true;
	}

	let closestFishingLocation = getClosestFishingLocation(getPlayerPosition(client));
	if (closestFishingLocation != false) {
		if (getDistance(getPlayerPosition(client), closestFishingLocation) < getGlobalConfig().fishingSpotDistance) {
			return true;
		}
	}

	return false;
}

// ===========================================================================