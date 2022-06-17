// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: paintball.js
// DESC: Provides paintball/airsoft arena functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

let paintBallItems = [];

// ===========================================================================

let paintBallItemNames = {
	[VRR_GAME_GTA_III]: [
		"Colt 45",
		"Uzi",
		"Shotgun",
		"AK-47",
		"Sniper Rifle",
	],

	[VRR_GAME_GTA_VC]: [
		"Colt 45",
		"Pump Shotgun",
		"Ingram",
		"MP5",
		"Ruger",
		"Sniper Rifle",
	],

	[VRR_GAME_GTA_SA]: [
		"Desert Eagle",
		"Shotgun",
		"MP5",
		"AK-47",
		"Sniper Rifle",
	],

	[VRR_GAME_GTA_IV]: [
		"Glock 9mm",
		"Micro Uzi",
		"Stubby Shotgun",
		"AK-47",
		"Sniper Rifle",
	],
};

// ===========================================================================

function initPaintBallScript() {
	logToConsole(LOG_DEBUG, "[VRR.PaintBall]: Initializing paintball script ...");
	logToConsole(LOG_DEBUG, "[VRR.PaintBall]: Paintball script initialized successfully!");
}

// ===========================================================================

function startPaintBall(client) {
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Starting paintball for ${getPlayerDisplayForConsole(client)} ...`);
	if (isPlayerWorking(client)) {
		stopWorking(client);
	}

	storePlayerItemsInTempLocker(client);
	getPlayerData(client).tempLockerType = VRR_TEMP_LOCKER_TYPE_PAINTBALL;

	getPlayerData(client).inPaintBall = true;
	getPlayerData(client).paintBallBusiness = getPlayerBusiness(client);

	givePlayerPaintBallItems(client);
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Started paintball for ${getPlayerDisplayForConsole(client)} successfully`);
}

// ===========================================================================

function stopPaintBall(client) {
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Stopping paintball for ${getPlayerDisplayForConsole(client)} ...`);
	deletePaintBallItems(client);
	restorePlayerTempLockerItems(client);
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Stopped paintball for ${getPlayerDisplayForConsole(client)} successfully`);
}

// ===========================================================================

function givePlayerPaintBallItems(client) {
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Giving ${getPlayerDisplayForConsole(client)} paintball items ...`);
	for (let i in paintBallItems) {
		let itemId = createItem(paintBallItems[i], value, VRR_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId);
		getItemData(itemId).needsSaved = false;
		getItemData(itemId).databaseId = -1; // Make sure it doesnt save
		let freeSlot = getPlayerFirstEmptyHotBarSlot(client);
		getPlayerData(client).hotBarItems[freeSlot] = itemId;
		getPlayerData(client).paintBallItemCache.push(itemId);
		updatePlayerHotBar(client);
	}
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Gave ${getPlayerDisplayForConsole(client)} paintball items successfully`);
}

// ===========================================================================

function deletePaintBallItems(client) {
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Deleting paintball items for ${getPlayerDisplayForConsole(client)} ...`);
	for (let i in getPlayerData(client).paintBallItemCache) {
		deleteItem(getPlayerData(client).paintBallItemCache[i]);
	}

	cachePlayerHotBarItems(client);
	updatePlayerHotBar(client);
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Deleting paintball items for ${getPlayerDisplayForConsole(client)} successfully`);
}

// ===========================================================================

function cacheAllPaintBallItemTypes() {
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Cacheing all paintball item types ...`);
	for (let i in paintBallItemNames[getGame()]) {
		let itemTypeId = getItemTypeFromParams(paintBallItems[getGame()][i]);
		if (itemTypeId != -1 && getItemTypeData(itemTypeId) != false) {
			paintBallItems.push(getItemTypeData(itemTypeId));
		}
	}

	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Cached all paintball item types`);
}

// ===========================================================================

function respawnPlayerForPaintBall(client) {
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Respawning ${getPlayerDisplayForConsole(client)} for paintball ...`);
	despawnPlayer(client);

	let businessId = getPlayerData(client).paintBallBusiness;
	let spawnId = getRandom(0, getBusinessData(businessId).paintBallSpawns.length - 1);

	spawnPlayer(client, getBusinessData(businessId).paintBallSpawns[spawnId], 0.0, getPlayerSkin(client), getBusinessData(businessId).exitInterior, getBusinessData(businessId).exitPosition, getBusinessData(businessId).exitDimension);
	logToConsole(LOG_DEBUG, `[VRR.PaintBall]: Respawned ${getPlayerDisplayForConsole(client)} for paintball successfully`);
}

// ===========================================================================