// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: paintball.js
// DESC: Provides paintball/airsoft arena functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

let paintBallItems = [];

// ===========================================================================

let paintBallItemNames = {
	[AGRP_GAME_GTA_III]: [
		"Colt 45",
		"Uzi",
		"Shotgun",
		"AK-47",
		"Sniper Rifle",
	],

	[AGRP_GAME_GTA_VC]: [
		"Colt 45",
		"Pump Shotgun",
		"Ingram",
		"MP5",
		"Ruger",
		"Sniper Rifle",
	],

	[AGRP_GAME_GTA_SA]: [
		"Desert Eagle",
		"Shotgun",
		"MP5",
		"AK-47",
		"Sniper Rifle",
	],

	[AGRP_GAME_GTA_IV]: [
		"Glock 9mm",
		"Micro Uzi",
		"Stubby Shotgun",
		"AK-47",
		"Sniper Rifle",
	],
};

// ===========================================================================

function initPaintBallScript() {
	logToConsole(LOG_DEBUG, "[AGRP.PaintBall]: Initializing paintball script ...");
	logToConsole(LOG_DEBUG, "[AGRP.PaintBall]: Paintball script initialized successfully!");
}

// ===========================================================================

function startPaintBall(client) {
	if (isPlayerInPaintBall(client)) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Starting paintball for ${getPlayerDisplayForConsole(client)} ...`);
	if (isPlayerWorking(client)) {
		stopWorking(client);
	}

	storePlayerItemsInTempLocker(client);
	getPlayerData(client).tempLockerType = AGRP_TEMP_LOCKER_TYPE_PAINTBALL;

	getPlayerData(client).inPaintBall = true;
	getPlayerData(client).paintBallBusiness = getPlayerBusiness(client);
	getPlayerData(client).paintBallKills = 0;
	getPlayerData(client).paintBallDeaths = 0;
	getBusinessData(getPlayerData(client).paintBallBusiness).paintBallPlayers.push(client.index);
	getBusinessData(getPlayerData(client).paintBallBusiness).paintBallPot += getBusinessData(getPlayerData(client).paintBallBusiness).entranceFee * 2;

	givePlayerPaintBallItems(client);

	messagePlayerAlert(client, getLocaleString(client, "JoinedPaintBall"));

	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Started paintball for ${getPlayerDisplayForConsole(client)} successfully`);
}

// ===========================================================================

function stopPaintBall(client) {
	if (!isPlayerInPaintBall(client)) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Stopping paintball for ${getPlayerDisplayForConsole(client)} ...`);
	clearPlayerWeapons(client);
	deletePaintBallItems(client);
	restorePlayerTempLockerItems(client);

	let tempBusiness = getPlayerData(client).paintBallBusiness;

	messagePlayerAlert(client, getLocaleString(client, "LeftPaintBall"));

	getBusinessData(tempBusiness).paintBallPlayers.splice(getBusinessData(tempBusiness).paintBallPlayers.indexOf(client.index), 1);

	if (getBusinessData(tempBusiness).paintBallPlayers.length == 0) {
		messagePlayerAlert(client, getLocaleString(client, "PaintBallEnded"));
		messagePlayerInfo(client, getLocaleString(client, "YourPaintBallResults", getPlayerData(client).paintBallKills, getPlayerData(client).paintBallDeaths));

		//messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderEventWinners")));
		//messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderEventWinners")));

		givePlayerCash(client, getBusinessData(tempBusiness).paintBallPot);
		getBusinessData(tempBusiness).paintBallPot = 0;
	}

	getPlayerData(client).inPaintBall = false;
	getPlayerData(client).paintBallBusiness = false;
	getPlayerData(client).tempLockerType = AGRP_TEMP_LOCKER_TYPE_NONE;
	getPlayerData(client).paintBallKills = 0;
	getPlayerData(client).paintBallDeaths = 0;

	//checkRemainingPaintBallPlayers(tempBusiness);

	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Stopped paintball for ${getPlayerDisplayForConsole(client)} successfully`);
}

// ===========================================================================

function givePlayerPaintBallItems(client) {
	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Giving ${getPlayerDisplayForConsole(client)} paintball items ...`);
	for (let i in paintBallItems) {
		let itemId = createItem(paintBallItems[i], 999999, AGRP_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId);
		getItemData(itemId).needsSaved = false;
		getItemData(itemId).databaseId = -1; // Make sure it doesnt save
		let freeSlot = getPlayerFirstEmptyHotBarSlot(client);
		getPlayerData(client).hotBarItems[freeSlot] = itemId;
		getPlayerData(client).paintBallItemCache.push(itemId);
		updatePlayerHotBar(client);
	}
	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Gave ${getPlayerDisplayForConsole(client)} paintball items successfully`);
}

// ===========================================================================

function deletePaintBallItems(client) {
	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Deleting paintball items for ${getPlayerDisplayForConsole(client)} ...`);
	for (let i in getPlayerData(client).paintBallItemCache) {
		deleteItem(getPlayerData(client).paintBallItemCache[i]);
	}

	cachePlayerHotBarItems(client);
	updatePlayerHotBar(client);
	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Deleting paintball items for ${getPlayerDisplayForConsole(client)} successfully`);
}

// ===========================================================================

function cacheAllPaintBallItemTypes() {
	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Cacheing all paintball item types ...`);
	for (let i in paintBallItemNames[getGame()]) {
		let itemTypeId = getItemTypeFromParams(paintBallItemNames[getGame()][i]);
		if (itemTypeId != -1 && getItemTypeData(itemTypeId) != false) {
			paintBallItems.push(itemTypeId);
		}
	}

	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Cached all paintball item types`);
}

// ===========================================================================

function respawnPlayerForPaintBall(client) {
	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Respawning ${getPlayerDisplayForConsole(client)} for paintball ...`);
	despawnPlayer(client);

	let businessId = getPlayerData(client).paintBallBusiness;
	//let spawnId = getRandom(0, getBusinessData(businessId).paintBallSpawns.length - 1);
	//spawnPlayer(client, getBusinessData(businessId).paintBallSpawns[spawnId], 0.0, getPlayerSkin(client), getBusinessData(businessId).exitInterior, getBusinessData(businessId).exitPosition, getBusinessData(businessId).exitDimension);

	spawnPlayer(client, getBusinessData(businessId).exitPosition, 0.0, getPlayerSkin(client), getBusinessData(businessId).exitInterior, getBusinessData(businessId).exitDimension);
	if (isFadeCameraSupported()) {
		fadeCamera(client, true, 0.5);
	}
	updatePlayerSpawnedState(client, true);
	makePlayerStopAnimation(client);
	setPlayerControlState(client, true);
	resetPlayerBlip(client);
	logToConsole(LOG_DEBUG, `[AGRP.PaintBall]: Respawned ${getPlayerDisplayForConsole(client)} for paintball successfully`);
}

// ===========================================================================

function isPlayerInPaintBall(client) {
	return getPlayerData(client).inPaintBall;
}

// ===========================================================================

function checkRemainingPaintBallPlayers(businessIndex) {
	//if (getBusinessData(businessIndex).paintBallPlayers.length == 0) {
	//
	//}
}

// ===========================================================================