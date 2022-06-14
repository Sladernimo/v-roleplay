// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: item.js
// DESC: Provides item functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initItemScript() {
	logToConsole(LOG_INFO, "[VRR.Item]: Initializing item script ...");
	logToConsole(LOG_INFO, "[VRR.Item]: Item script initialized successfully!");
	return true;
}

// ===========================================================================

function loadItemsFromDatabase() {
	let tempItems = [];
	let dbConnection = connectToDatabase();
	let dbFetchAssoc;
	if (dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `SELECT * FROM item_main WHERE item_deleted = 0 AND item_server = ${getServerId()}`);
		if (dbQuery) {
			if (dbQuery.numRows > 0) {
				while (dbFetchAssoc = fetchQueryAssoc(dbQuery)) {
					let tempItemData = new ItemData(dbFetchAssoc);
					tempItems.push(tempItemData);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}
	return tempItems;
}

// ===========================================================================

function loadItemTypesFromDatabase() {
	let tempItemTypes = [];
	let dbConnection = connectToDatabase();
	let dbFetchAssoc;
	if (dbConnection) {
		let dbQuery = queryDatabase(dbConnection, `SELECT * FROM item_type WHERE item_type_deleted = 0 AND item_type_enabled = 1 AND item_type_server = ${getServerId()}`);
		if (dbQuery) {
			if (getQueryNumRows(dbQuery) > 0) {
				while (dbFetchAssoc = fetchQueryAssoc(dbQuery)) {
					let tempItemTypeData = new ItemTypeData(dbFetchAssoc);
					tempItemTypes.push(tempItemTypeData);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	return tempItemTypes;
}

// ===========================================================================

function createItem(itemTypeId, value, ownerType, ownerId, amount = 1) {
	let tempItemData = new ItemData(false);
	tempItemData.itemType = getItemTypeData(itemTypeId).databaseId;
	tempItemData.ownerType = ownerType;
	tempItemData.ownerId = ownerId;
	tempItemData.amount = amount;
	tempItemData.value = value;
	tempItemData.needsSaved = true;
	let slot = getServerData().items.push(tempItemData);
	let index = slot - 1;
	getServerData().items[slot - 1].index = index;
	getServerData().items[slot - 1].itemTypeIndex = itemTypeId;
	return index;
}

// ===========================================================================

function createGroundItem(itemTypeId, value, position, dimension = 0) {
	let itemIndex = createItem(itemTypeId, value, VRR_ITEM_OWNER_GROUND, 0);
	getItemData(itemIndex).position = position;
	getItemData(itemIndex).dimension = dimension;
	createGroundItemObject(itemIndex);
	return itemIndex;
}

// ===========================================================================

function createGroundItemObject(itemId) {
	if (!getItemData(itemId)) {
		return false;
	}

	if (getItemData(itemId).object != null) {
		deleteGroundItemObject(itemId);
	}

	let object = createGameObject(getItemTypeData(getItemData(itemId).itemTypeIndex).dropModel, applyOffsetToPos(getItemData(itemId).position, getItemTypeData(getItemData(itemId).itemTypeIndex).dropPosition));
	if (object != false) {
		getItemData(itemId).object = object;
		setElementRotation(getItemData(itemId).object, getItemTypeData(getItemData(itemId).itemTypeIndex).dropRotation);
		setElementOnAllDimensions(getItemData(itemId).object, false);
		setElementDimension(getItemData(itemId).object, getItemData(itemId).dimension);
		//setEntityData(getItemData(itemId).object, "vrr.scale", getItemTypeData(getItemData(itemId).itemTypeIndex).dropScale, true);
		addToWorld(getItemData(itemId).object);
	}

	getServerData().groundItemCache.push(itemId);
}

// ===========================================================================

function deleteGroundItemObject(itemId) {
	if (getServerData().groundItemCache.indexOf(itemId) != -1) {
		getServerData().groundItemCache.splice(getServerData().groundItemCache.indexOf(itemId), 1);
	}

	if (getItemData(itemId).object != null) {
		destroyGameElement(getItemData(itemId).object);
		getItemData(itemId).object = null;
	}
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
function createGroundItemCommand(command, params, client) {
	let splitParams = params.split(" ");
	let itemType = getItemTypeFromParams(splitParams.slice(0, -1).join(" "));
	let value = splitParams.slice(-1) || 1;

	if (!getItemTypeData(itemType)) {
		messagePlayerError(client, getLocaleString(client, "InvalidItemType"));
		return false;
	}

	//if(value <= 0) {
	//	messagePlayerError(client, `The value must be more than 0!`);
	//	return false;
	//}

	let itemId = createGroundItem(itemType, toInteger(value), getPlayerPosition(client), getPlayerDimension(client));
	messagePlayerSuccess(client, `You created a ${getItemTypeData(itemType).name} on the ground at your position`);
	meActionToNearbyPlayers(client, `drops ${getProperDeterminerForName(getItemTypeData(itemType).name)} ${getItemTypeData(itemType).name} on the ground`);
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
function createItemCommand(command, params, client) {
	let splitParams = params.split(" ");
	let itemType = getItemTypeFromParams(splitParams.slice(0, -1).join(" "));
	let value = splitParams.slice(-1) || 1;

	if (!getItemTypeData(itemType)) {
		messagePlayerError(client, getLocaleString(client, "InvalidItemType"));
		return false;
	}

	//if(value <= 0) {
	//	messagePlayerError(client, `The value must be more than 0!`);
	//	return false;
	//}

	let itemId = createItem(itemType, toInteger(value), VRR_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId);
	cachePlayerHotBarItems(client);
	messagePlayerSuccess(client, `You created a ${getItemTypeData(itemType).name} in your inventory`);
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
function useItemCommand(command, params, client) {
	clearPlayerItemActionState(client);

	let hotBarSlot = getPlayerData(client).activeHotBarSlot;
	if (!areParamsEmpty(params)) {
		hotBarSlot = toInteger(params);
		hotBarSlot = hotBarSlot - 1;
	}

	if (hotBarSlot == -1) {
		return false;
	}

	if (getPlayerData(client).hotBarItems[hotBarSlot] == -1) {
		return false;
	}

	let itemId = getPlayerData(client).hotBarItems[hotBarSlot];

	if (!getItemData(itemId)) {
		messagePlayerError(client, getLocaleString(client, "UseItemBug"));
		submitBugReport(client, `(AUTOMATED REPORT) Use Item: Getting item data for item ${itemId} in player hotbar slot ${hotBarSlot} (cache ${getPlayerData(client).hotBarItems[hotBarSlot]}) returned false.`);
		return false;
	}

	if (!getItemTypeData(getItemData(itemId).itemTypeIndex)) {
		messagePlayerError(client, getLocaleString(client, "UseItemBug"));
		submitBugReport(client, `(AUTOMATED REPORT) Use Item: Getting item type ${getItemData(itemId).itemType} data for item ${itemId}/${getItemData(itemId).databaseId} in player hotbar slot ${hotBarSlot} (cache ${getPlayerData(client).hotBarItems[hotBarSlot]}) returned false.`);
		return false;
	}

	if (getPlayerData(client).itemActionState != VRR_ITEM_ACTION_NONE) {
		messagePlayerError(client, getLocaleString(client, "HandsBusy"));
		return false;
	}

	if (getPlayerData(client).usingSkinSelect) {
		messagePlayerError(client, getLocaleString(client, "CantUseItemInSkinChange"));
		return false;
	}

	if (getItemTypeData(getItemData(itemId).itemTypeIndex).useAnimationIndex != false) {
		forcePlayerPlayAnimation(client, getItemTypeData(getItemData(itemId).itemTypeIndex).useAnimationIndex, 0.0);
	}

	getPlayerData(client).itemActionState = VRR_ITEM_ACTION_USE;
	getPlayerData(client).itemActionItem = hotBarSlot;
	showPlayerItemUseDelay(client, hotBarSlot);

	//clearPlayerItemActionStateAfterDelay(client, getGlobalConfig().itemActionStateReset);
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
function deleteGroundItemCommand(command, params, client) {
	let itemId = getClosestItemOnGround(getPlayerPosition(client));

	if (!getItemData(itemId)) {
		messagePlayerError(client, `The item you're trying to delete is bugged. A bug report has been sent to the server developers.`);
		submitBugReport(client, `(AUTOMATED REPORT) Delete Ground Item: Getting item data for item ${itemId} on ground returned false.`);
		return false;
	}

	if (!getItemTypeData(getItemData(itemId).itemTypeIndex)) {
		messagePlayerError(client, `The item you're trying to delete is bugged. A bug report has been sent to the server developers.`);
		submitBugReport(client, `(AUTOMATED REPORT) Delete Ground Item: Getting item type ${getItemData(itemId).itemType} data for item ${itemId}/${getItemData(itemId).databaseId} on ground returned false.`);
		return false;
	}

	let tempName = getItemData(itemId).name;
	deleteItem(itemId);
	messagePlayerSuccess(client, `You deleted the ${tempName} item near you`);
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
function pickupItemCommand(command, params, client) {
	clearPlayerItemActionState(client);

	let itemId = getClosestItemOnGround(getPlayerPosition(client));

	if (!getItemData(itemId)) {
		//messagePlayerError(client, `The item you're trying to pick up is bugged. A bug report has been sent to the server developers.`);
		messagePlayerError(client, getPlayerLocale(client, "NoItemCloseEnough"));
		submitBugReport(client, `(AUTOMATED REPORT) Pickup Item: Getting item data for item ${itemId} on ground returned false.`);
		return false;
	}

	if (!getItemTypeData(getItemData(itemId).itemTypeIndex)) {
		//messagePlayerError(client, `The item you're trying to pick up is bugged. A bug report has been sent to the server developers.`);
		messagePlayerError(client, getPlayerLocale(client, "NoItemCloseEnough"));
		submitBugReport(client, `(AUTOMATED REPORT) Pickup Item: Getting item type ${getItemData(itemId).itemType} data for item ${itemId}/${getItemData(itemId).databaseId} on ground returned false.`);
		return false;
	}

	if (getDistance(getPlayerPosition(client), getItemData(itemId).position) > getGlobalConfig().droppedItemPickupRange) {
		messagePlayerError(client, getPlayerLocale(client, "NoItemCloseEnough"));
		return false;
	}

	let firstSlot = getPlayerFirstEmptyHotBarSlot(client);
	if (firstSlot == -1) {
		messagePlayerError(client, getPlayerLocale(client, "NoSpaceSelfInventory"));
		return false;
	}

	if (getPlayerData(client).itemActionState != VRR_ITEM_ACTION_NONE) {
		messagePlayerError(client, getLocaleString(client, "HandsBusy"));
		return false;
	}

	if (getPlayerData(client).usingSkinSelect) {
		messagePlayerError(client, getLocaleString(client, "CantPickupItemInSkinChange"));
		return false;
	}

	if (getItemTypeData(getItemData(itemId).itemTypeIndex).dropAnimationIndex != false) {
		forcePlayerPlayAnimation(client, getItemTypeData(getItemData(itemId).itemTypeIndex).pickupAnimationIndex, 0.0);
	}

	getPlayerData(client).itemActionState = VRR_ITEM_ACTION_PICKUP;
	getPlayerData(client).itemActionItem = itemId;
	showPlayerItemPickupDelay(client, itemId);

	//clearPlayerItemActionStateAfterDelay(client, getGlobalConfig().itemActionStateReset);
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
function dropItemCommand(command, params, client) {
	clearPlayerItemActionState(client);

	let hotBarSlot = getPlayerData(client).activeHotBarSlot;
	if (!areParamsEmpty(params)) {
		hotBarSlot = toInteger(params);
		hotBarSlot = hotBarSlot - 1;
	}

	if (hotBarSlot == -1) {
		messagePlayerError(client, getLocaleString(client, "NoItemEquipped"));
		return false;
	}

	if (getPlayerData(client).hotBarItems[hotBarSlot] == -1) {
		messagePlayerError(client, getLocaleString(client, "NoItemInActiveSlot"));
		return false;
	}

	let itemId = getPlayerData(client).hotBarItems[hotBarSlot];

	if (!getItemData(itemId)) {
		messagePlayerError(client, getLocaleString(client, "DropItemBugged"));
		submitBugReport(client, `(AUTOMATED REPORT) Drop Item: Getting item data for item ${itemId} in player hotbar slot ${hotBarSlot} (cache ${getPlayerData(client).hotBarItems[hotBarSlot]}) returned false.`);
		return false;
	}

	if (!getItemTypeData(getItemData(itemId).itemTypeIndex)) {
		messagePlayerError(client, getLocaleString(client, "DropItemBugged"));
		submitBugReport(client, `(AUTOMATED REPORT) Drop Item: Getting item type ${getItemData(itemId).itemType} data for item ${itemId}/${getItemData(itemId).databaseId} in player hotbar slot ${hotBarSlot} (cache ${getPlayerData(client).hotBarItems[hotBarSlot]}) returned false.`);
		return false;
	}

	if (getPlayerData(client).itemActionState != VRR_ITEM_ACTION_NONE) {
		messagePlayerError(client, getLocaleString(client, "HandsBusy"));
		return false;
	}

	if (getPlayerData(client).usingSkinSelect) {
		messagePlayerError(client, getLocaleString(client, "CantDropItemInSkinChange"));
		return false;
	}

	if (isPlayerItemFromJobEquipment(client, hotBarSlot)) {
		messagePlayerError(client, getLocaleString(client, "CantDropJobEquipmentItem"));
		return false;
	}

	if (getItemTypeData(getItemData(itemId).itemTypeIndex).dropAnimationIndex != false) {
		forcePlayerPlayAnimation(client, getItemTypeData(getItemData(itemId).itemTypeIndex).dropAnimationIndex, 0.0);
	}

	getPlayerData(client).itemActionState = VRR_ITEM_ACTION_DROP;
	getPlayerData(client).itemActionItem = hotBarSlot;
	showPlayerItemDropDelay(client, hotBarSlot);

	//clearPlayerItemActionStateAfterDelay(client, getGlobalConfig().itemActionStateReset);
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
function putItemCommand(command, params, client) {
	clearPlayerItemActionState(client);

	let hotBarSlot = toInteger(params);

	let itemId = getPlayerData(client).hotBarItems[hotBarSlot];

	if (!getItemData(itemId)) {
		messagePlayerError(client, `The item you're trying to store is bugged. A bug report has been sent to the server developers.`);
		submitBugReport(client, `(AUTOMATED REPORT) Put Item: Getting item data for item ${itemId} in player hotbar slot ${hotBarSlot} (cache ${getPlayerData(client).hotBarItems[hotBarSlot]}) returned false.`);
		return false;
	}

	if (!getItemTypeData(getItemData(itemId).itemTypeIndex)) {
		messagePlayerError(client, `The item you're trying to store is bugged. A bug report has been sent to the server developers.`);
		submitBugReport(client, `(AUTOMATED REPORT) Put Item: Getting item type ${getItemData(itemId).itemType} data for item ${itemId}/${getItemData(itemId).databaseId} in player hotbar slot ${hotBarSlot} (cache ${getPlayerData(client).hotBarItems[hotBarSlot]}) returned false.`);
		return false;
	}

	if (getPlayerData(client).itemActionState != VRR_ITEM_ACTION_NONE) {
		messagePlayerError(client, getLocaleString(client, "HandsBusy"));
		return false;
	}

	if (getPlayerData(client).usingSkinSelect) {
		messagePlayerError(client, getLocaleString(client, "CantPutItemInSkinChange"));
		return false;
	}

	if (isPlayerItemFromJobEquipment(client, hotBarSlot)) {
		messagePlayerError(client, getLocaleString(client, "CantPutJobEquipmentItem"));
		return false;
	}

	if (getItemTypeData(getItemData(itemId).itemTypeIndex).putAnimationIndex != false) {
		forcePlayerPlayAnimation(client, getItemTypeData(getItemData(itemId).itemTypeIndex).putAnimationIndex, 0.0);
	}

	getPlayerData(client).itemActionItem = hotBarSlot;
	getPlayerData(client).itemActionState = VRR_ITEM_ACTION_PUT;
	showPlayerItemPutDelay(client, hotBarSlot);

	//clearPlayerItemActionStateAfterDelay(client, getGlobalConfig().itemActionStateReset);
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
function takeItemCommand(command, params, client) {
	clearPlayerItemActionState(client);

	let firstSlot = getPlayerFirstEmptyHotBarSlot(client);
	if (firstSlot == -1) {
		messagePlayerError(client, getLocaleString(client, "NoSpaceSelfInventory"));
		return false;
	}

	let itemSlot = toInteger(params) || 0;

	let bestOwner = getBestItemToTake(client, itemSlot);
	let itemId = bestOwner[2];

	if (bestOwner[1] == VRR_ITEM_OWNER_NONE) {
		messagePlayerError(client, getLocaleString(client, "NothingToTakeItemFrom"));
		return false;
	}

	if (getPlayerData(client).itemActionState != VRR_ITEM_ACTION_NONE) {
		messagePlayerError(client, getLocaleString(client, "HandsBusy"));
		return false;
	}

	if (getPlayerData(client).usingSkinSelect) {
		messagePlayerError(client, getLocaleString(client, "CantTakeItemInSkinChange"));
		return false;
	}

	//if(isPlayerItemFromJobEquipment(client, hotBarSlot)) {
	//	messagePlayerError(client, `You can't take job items`);
	//	return false;
	//}

	if (getItemTypeData(getItemData(itemId).itemTypeIndex).takeAnimationIndex != false) {
		forcePlayerPlayAnimation(client, getItemTypeData(getItemData(itemId).itemTypeIndex).takeAnimationIndex, 0.0);
	}

	getPlayerData(client).itemActionItem = itemId;
	getPlayerData(client).itemActionState = VRR_ITEM_ACTION_TAKE;
	showPlayerItemTakeDelay(client, itemId);

	//clearPlayerItemActionStateAfterDelay(client, getGlobalConfig().itemActionStateReset);
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
function createItemTypeCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let itemTypeIndex = createItemType(params);
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} created new item {ALTCOLOUR}${params}. {MAINCOLOUR}ID: ${itemTypeIndex}/${getItemTypeData(itemTypeIndex).databaseId}!`);
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
function setItemTypeDropModelCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let itemTypeIndex = getItemTypeFromParams(splitParams.slice(0, -1).join(" "));
	let modelIndex = getObjectModelIndexFromParams(splitParams.slice(-1).join(" "));

	if (!getItemTypeData(itemTypeIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidItemType"));
		return false;
	}

	getItemTypeData(itemTypeIndex).dropModel = modelIndex;
	getItemTypeData(itemTypeIndex).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} set item type {ALTCOLOUR}${getItemTypeData(itemTypeIndex).name}'s dropped object model index to ${modelIndex}`);
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
function setItemTypeOrderPriceCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let itemTypeIndex = getItemTypeFromParams(splitParams.slice(0, -1).join(" "));
	let orderPrice = splitParams[splitParams.length - 1];

	if (!getItemTypeData(itemTypeIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidItemType"));
		return false;
	}

	getItemTypeData(itemTypeIndex).orderPrice = orderPrice;
	getItemTypeData(itemTypeIndex).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} set item type {ALTCOLOUR}${getItemTypeData(itemTypeIndex).name} {MAINCOLOUR}base price to {ALTCOLOUR}$${orderPrice}`);
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
function setItemTypeRiskMultiplierCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let itemTypeIndex = getItemTypeFromParams(splitParams.slice(0, -1).join(" "));
	let riskMultiplier = splitParams[splitParams.length - 1];

	if (!getItemTypeData(itemTypeIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidItemType"));
		return false;
	}

	getItemTypeData(itemTypeIndex).riskMultiplier = riskMultiplier;
	getItemTypeData(itemTypeIndex).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} set item type {ALTCOLOUR}${getItemTypeData(itemTypeIndex).name}{MAINCOLOUR} risk multiplier to {ALTCOLOUR}$${riskMultiplier}`);
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
function toggleItemTypeEnabledCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let itemTypeIndex = getItemTypeFromParams(params);

	if (!getItemTypeData(itemTypeIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidItemType"));
		return false;
	}

	getItemTypeData(itemTypeIndex).enabled = !getItemTypeData(itemTypeIndex).enabled;
	getItemTypeData(itemTypeIndex).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} ${getEnabledDisabledFromBool(getItemTypeData(itemTypeIndex).enabled)} item type {ALTCOLOUR}${getItemTypeData(itemTypeIndex).name}`);
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
function setItemTypeUseTypeCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let itemTypeIndex = getItemTypeFromParams(splitParams.slice(0, -1).join(" "));
	let useType = splitParams[splitParams.length - 1];

	if (!getItemTypeData(itemTypeIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidItemType"));
		return false;
	}

	getItemTypeData(itemTypeIndex).useType = useType;
	getItemTypeData(itemTypeIndex).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} set item type {ALTCOLOUR}${getItemTypeData(itemTypeIndex).name}{MAINCOLOUR} use type to {ALTCOLOUR}$${useType}`);
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
function setItemTypeUseValueCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let itemTypeIndex = getItemTypeFromParams(splitParams.slice(0, -1).join(" "));
	let useValue = splitParams[splitParams.length - 1];

	if (!getItemTypeData(itemTypeIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidItemType"));
		return false;
	}

	getItemTypeData(itemTypeIndex).useValue = useValue;
	getItemTypeData(itemTypeIndex).needsSaved = true;
	messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} set item type {ALTCOLOUR}${getItemTypeData(itemTypeIndex).name}{MAINCOLOUR} use value to {ALTCOLOUR}$${useValue}`);
}

// ===========================================================================

function playerUseItem(client, hotBarSlot) {
	let itemIndex = getPlayerData(client).hotBarItems[hotBarSlot];

	if (itemIndex == -1) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[VRR.Item] ${getPlayerDisplayForConsole(client)} tried to use an empty hotbar slot ${hotBarSlot}`);
		return false;
	}

	if (!getItemData(itemIndex)) {
		submitBugReport(client, `[AUTOMATED REPORT] Tried to use invalid item (index ${itemIndex} in player slot ${hotBarSlot})`);
		cachePlayerHotBarItems(client);
		return false;
	}

	let itemData = getItemData(itemIndex);
	let itemTypeData = getItemTypeData(itemData.itemTypeIndex);
	let hotBarItems = getPlayerData(client).hotBarItems;

	logToConsole(LOG_DEBUG, `[VRR.Item] ${getPlayerDisplayForConsole(client)} used a ${itemTypeData.name} (use type ${itemTypeData.useType} - ${typeof itemTypeData.useType}) item (ID: ${itemData.index}/${itemData.databaseId}, TypeID: ${itemTypeData.index}/${itemTypeData.databaseId})`);

	switch (toInteger(itemTypeData.useType)) {
		case VRR_ITEM_USETYPE_SKIN: {
			getPlayerData(client).itemActionItem = itemIndex;
			forcePlayerIntoSkinSelect(client);
			break;
		}

		case VRR_ITEM_USETYPE_WEAPON: {
			for (let i in hotBarItems) {
				if (hotBarItems[i] != -1) {
					if (getItemData(hotBarItems[i]) != false) {
						if (getItemTypeData(getItemData(hotBarItems[i]).itemTypeIndex).useType == VRR_ITEM_USETYPE_AMMO_CLIP) {
							let ammoItemData = getItemData(hotBarItems[i]);
							let ammoItemTypeData = getItemTypeData(ammoItemData.itemTypeIndex);
							if (ammoItemTypeData.useId == itemTypeData.databaseId) {
								givePlayerWeaponAmmo(client, ammoItemData.value);
								itemData.value = itemData.value + ammoItemData.value;
								deleteItem(hotBarItems[i]);
								meActionToNearbyPlayers(client, `loads some ammo into their ${itemTypeData.name}`);
								return true;
							}
						}
					}
				}
			}
			messagePlayerError(client, getLocaleString(client, "NoAmmoToLoadIntoWeapon", itemTypeData.name));
			break;
		}

		case VRR_ITEM_USETYPE_AMMO_CLIP: {
			if (doesPlayerHaveKeyBindForCommand(client, "use")) {
				messagePlayerError(client, getLocaleString(client, "LoadAmmoIntoWeaponHelpKeyPress", `{ALTCOLOUR}${toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "use").key))}{MAINCOLOUR}`));
			} else {
				messagePlayerError(client, getLocaleString(client, "LoadAmmoIntoWeaponHelpCommand", `{ALTCOLOUR}/use{MAINCOLOUR}`));
			}
			break;
		}

		case VRR_ITEM_USETYPE_STORAGE: {
			showItemInventoryToPlayer(client, itemIndex);
			break;
		}

		case VRR_ITEM_USETYPE_FOOD: {
			meActionToNearbyPlayers(client, `eats some of their ${itemTypeData.name}`);
			givePlayerHealth(client, itemTypeData.useValue);
			itemData.value = itemData.value - tempItemTypeData.useValue;
			if (getItemData(itemIndex).value <= 0) {
				deleteItem(itemIndex);
				switchPlayerActiveHotBarSlot(client, -1);
			}
			break;
		}

		case VRR_ITEM_USETYPE_DRINK: {
			meActionToNearbyPlayers(client, `drinks some of their ${itemTypeData.name}`);
			givePlayerHealth(client, itemTypeData.useValue);
			itemData.value = itemData.value - itemTypeData.useValue;
			if (itemData.value <= 0) {
				deleteItem(itemIndex);
				switchPlayerActiveHotBarSlot(client, -1);
			}
			break;
		}

		case VRR_ITEM_USETYPE_ARMOUR: {
			meActionToNearbyPlayers(client, `puts on a ${itemTypeData.name}`);
			givePlayerArmour(client, itemTypeData.useValue);
			deleteItem(itemIndex);
			switchPlayerActiveHotBarSlot(client, -1);
			break;
		}

		case VRR_ITEM_USETYPE_ROPE: {
			let closestPlayer = getClosestPlayer(getPlayerPosition(client), client);

			if (!getPlayerData(closestPlayer)) {
				messagePlayerError(client, getLocaleString(client, "NobodyCloseEnoughToTie"));
				return false;
			}

			if (getDistance(getPlayerPosition(closestPlayer), getPlayerPosition(client)) > getGlobalConfig().handcuffPlayerDistance) {
				messagePlayerError(client, getLocaleString(client, "NobodyCloseEnoughToTie"));
				return false;
			}

			if (!isPlayerSurrendered(closestPlayer)) {
				messagePlayerError(client, getLocaleString(client, "PlayerNotSurrenderedTie", getCharacterFullName(closestPlayer)));
				return false;
			}

			if (isPlayerHandCuffed(closestPlayer)) {
				ropeUnTiePlayer(closestPlayer);
				meActionToNearbyPlayers(client, `unties the rope from ${getCharacterFullName(closestPlayer)}'s hands and feet`);
			} else {
				if (!isPlayerSurrendered(closestPlayer)) {
					messagePlayerError(client, `${getCharacterFullName(closestPlayer)} can't be tied up! They either need to have their hands up, be knocked out, or tazed`);
					return false;
				}

				ropeTiePlayer(closestPlayer);
				meActionToNearbyPlayers(client, `takes their rope and ties ${getCharacterFullName(closestPlayer)}'s hands and feet together.`);
			}
			break;
		}

		case VRR_ITEM_USETYPE_HANDCUFF: {
			let closestPlayer = getClosestPlayer(getPlayerPosition(client), client);

			if (!getPlayerData(closestPlayer)) {
				messagePlayerError(client, getLocaleString(client, "NobodyCloseEnoughToHandcuff"));
				return false;
			}

			if (getDistance(getPlayerPosition(closestPlayer), getPlayerPosition(client)) > getGlobalConfig().handcuffPlayerDistance) {
				messagePlayerError(client, getLocaleString(client, "NobodyCloseEnoughToHandcuff"));
				return false;
			}

			if (isPlayerHandCuffed(closestPlayer)) {
				unHandCuffPlayer(closestPlayer);
				meActionToNearbyPlayers(client, `takes their key and removes the handcuffs from ${getCharacterFullName(closestPlayer)}`);
			} else {
				if (!isPlayerSurrendered(closestPlayer)) {
					messagePlayerError(client, getLocaleString(client, "PlayerNotSurrenderedHandcuffed", getCharacterFullName(closestPlayer)));
					return false;
				}

				handCuffPlayer(closestPlayer);
				meActionToNearbyPlayers(client, `takes their cuffs and places them on ${getCharacterFullName(closestPlayer)}`);
			}
			break;
		}

		case VRR_ITEM_USETYPE_VEHREPAIR: {
			let vehicle = getClosestVehicle(getPlayerPosition(client));
			if (getDistance(getPlayerPosition(client), getVehiclePosition(vehicle)) <= getGlobalConfig().vehicleRepairDistance) {
				meActionToNearbyPlayers(client, `takes their repair kit and fixes the vehicle`);
				repairVehicle(vehicle);

				itemData.value = itemData.value - itemTypeData.useValue;
				if (itemData.value <= 0) {
					destroyItem(itemIndex);
				}
			} else {
				messagePlayerError(client, getLocaleString(client, "VehicleRepairFailedTooFar"));
			}
			break;
		}

		case VRR_ITEM_USETYPE_VEHUPGRADE_PART: {
			let vehicle = getClosestVehicle(getPlayerPosition(client));
			if (getDistance(getPlayerPosition(client), getVehiclePosition(vehicle)) <= getGlobalConfig().vehicleRepairDistance) {
				meActionToNearbyPlayers(client, `takes their upgrade kit and adds a ${itemTypeData.name} to the vehicle.`);
				addVehicleUpgrade(vehicle, itemTypeData.useId);
			}
			break;
		}

		case VRR_ITEM_USETYPE_VEHLIVERY: {
			let vehicle = getClosestVehicle(getPlayerPosition(client));
			if (getDistance(getPlayerPosition(client), getVehiclePosition(vehicle)) <= getGlobalConfig().vehicleRepairDistance) {
				meActionToNearbyPlayers(client, `takes their decal kit and adds some decals to the vehicle.`);
				setVehicleLivery(vehicle, itemData.value);
			}
			break;
		}

		case VRR_ITEM_USETYPE_VEHCOLOUR: {
			let vehicle = getClosestVehicle(getPlayerPosition(client));
			if (getDistance(getPlayerPosition(client), getVehiclePosition(vehicle)) <= getGlobalConfig().vehicleRepairDistance) {
				if (itemData.useId == 1) {
					meActionToNearbyPlayers(client, `takes their vehicle colour kit and changes the primary colour of the vehicle.`);
					vehicle.colour1 = itemData.value;
				} else {
					if (itemTypeData.useId == 1) {
						meActionToNearbyPlayers(client, `takes their vehicle colour kit and changes the secondary colour of the vehicle.`);
						vehicle.colour2 = itemData.value;
					}
				}
			}
			break;
		}

		case VRR_ITEM_USETYPE_FUELCAN: {
			let vehicle = getClosestVehicle(getPlayerPosition(client));
			let fuelPump = getClosestFuelPump(getPlayerPosition(client));
			if (getDistance(getPlayerPosition(client), getVehiclePosition(vehicle)) <= getDistance(getPlayerPosition(client), getFuelPumpData(fuelPump).position)) {
				if (getDistance(getPlayerPosition(client), getVehiclePosition(vehicle)) <= getGlobalConfig().vehicleRepairDistance) {
					meActionToNearbyPlayers(client, `takes their fuel can and refills the vehicle`);
					if (itemData.value < itemTypeData.useValue) {
						getVehicleData(vehicle).fuel += itemData.value;
					} else {
						getVehicleData(vehicle).fuel += itemTypeData.useValue;
					}

					itemData.value = itemData.value - itemTypeData.useValue;
					//if(itemData.value <= 0) {
					//	destroyItem(itemIndex);
					//}
				}
			} else {
				if (getDistance(getPlayerPosition(client), getFuelPumpData(fuelPump).position) <= getGlobalConfig().vehicleRepairDistance) {
					if (itemData.useId == 1) {
						meActionToNearbyPlayers(client, `takes their vehicle colour kit and changes the primary colour of the vehicle.`);
						vehicle.colour1 = itemTypeData.value;
					} else {
						if (itemData.useId == 1) {
							meActionToNearbyPlayers(client, `takes their vehicle colour kit and changes the secondary colour of the vehicle.`);
							vehicle.colour2 = itemData.value;
						}
					}
				}
			}
			break;
		}

		case VRR_ITEM_USETYPE_WALKIETALKIE: {
			itemData.enabled = !itemData.enabled;
			meActionToNearbyPlayers(client, `turns ${toLowerCase(getOnOffFromBool(itemData.enabled))} their walkie-talkie`);
			break;
		}

		case VRR_ITEM_USETYPE_PHONE: {
			if (itemData.value == 0) {
				let phoneNumber = generateRandomPhoneNumber();
				itemData.value = phoneNumber;
				messagePlayerAlert(client, `Your ${itemTypeData.name} has been set up with number ${phoneNumber}`);
			} else {
				itemData.enabled = !itemData.enabled;
				if (itemData.enabled) {
					//messagePlayerAlert(client, `You turned on your phone in slot ${getPlayerData(client).activeHotBarSlot+1} ${getItemValueDisplayForItem(itemIndex)}`);
					meActionToNearbyPlayers(client, `turns on their phone`);
				} else {
					//messagePlayerAlert(client, `You turned OFF your phone in slot ${getPlayerData(client).activeHotBarSlot+1}`);
					meActionToNearbyPlayers(client, `turns off their phone`);
				}
			}
			break;
		}

		case VRR_ITEM_USETYPE_SMOKEDRUG: {
			meActionToNearbyPlayers(client, `smokes some ${itemTypeData.name}`);
			getPlayerData(client).incomingDamageMultiplier = getPlayerData(client).incomingDamageMultiplier - (itemTypeData.useValue / 100);
			if (getPlayerData(client).incomingDamageMultiplier < 0.25) {
				getPlayerData(client).incomingDamageMultiplier = 0.25;
			}
			deleteItem(itemIndex);
			switchPlayerActiveHotBarSlot(client, -1);
			break;
		}

		case VRR_ITEM_USETYPE_SNORTDRUG: {
			meActionToNearbyPlayers(client, `snorts some ${itemTypeData.name}`);
			getPlayerData(client).incomingDamageMultiplier = getPlayerData(client).incomingDamageMultiplier - (itemTypeData.useValue / 100);
			if (getPlayerData(client).incomingDamageMultiplier < 0.25) {
				getPlayerData(client).incomingDamageMultiplier = 0.25;
			}
			deleteItem(itemIndex);
			switchPlayerActiveHotBarSlot(client, -1);
			break;
		}

		case VRR_ITEM_USETYPE_INJECTDRUG: {
			meActionToNearbyPlayers(client, `shoots up some ${itemTypeData.name}`);
			getPlayerData(client).incomingDamageMultiplier = getPlayerData(client).incomingDamageMultiplier - (itemTypeData.useValue / 100);
			if (getPlayerData(client).incomingDamageMultiplier < 0.25) {
				getPlayerData(client).incomingDamageMultiplier = 0.25;
			}
			deleteItem(itemIndex);
			switchPlayerActiveHotBarSlot(client, -1);
			break;
		}

		case VRR_ITEM_USETYPE_PLANT: {
			meActionToNearbyPlayers(client, `bends down and plants a ${itemTypeData.name} in the ground`);
			createGroundPlant(itemIndex);
			if (itemData.value == 0) {
				destroyItem(itemIndex);
				switchPlayerActiveHotBarSlot(client, -1);
			}
			break;
		}

		case VRR_ITEM_USETYPE_BADGE: {
			meActionToNearbyPlayers(client, `shows their badge to everyone nearby.`);
			let clients = getClients();
			for (let i in clients) {
				if (getDistance(getPlayerPosition(client), getPlayerPosition(clients[i])) <= 7) {
					makeChatBoxSectionHeader(clients[i], getLocaleString(client, "HeaderBadgeInfo", getCharacterFullName(client)));
					messagePlayerNormal(client, `{clanOrange}Type:{MAINCOLOUR} ${getJobData(getPlayerJob(client)).name}`);
					messagePlayerNormal(client, `{clanOrange}ID:{MAINCOLOUR} ${addPrefixNumberFill(getPlayerCurrentSubAccount(client).databaseId, 5)}`);
					messagePlayerNormal(client, `{clanOrange}Rank:{MAINCOLOUR} ${getJobRankName(getPlayerJob(client), getPlayerJobRank(client))}`);
				}
			}
			break;
		}

		case VRR_ITEM_USETYPE_AMMO_CLIP: {
			messagePlayerError(client, `Equip a compatible weapon and press R to use an ammo clip/magazine`);
			break;
		}

		case VRR_ITEM_USETYPE_HEALTH: {
			let closestPlayer = getClosestPlayer(getPlayerPosition(client), client);

			if (!getPlayerData(closestPlayer)) {
				messagePlayerError(client, "There isn't anyone close enough to heal!");
				return false;
			}

			if (getDistance(getPlayerPosition(closestPlayer), getPlayerPosition(client)) > getGlobalConfig().firstAidKitPlayerDistance) {
				messagePlayerError(client, "There isn't anyone close enough to heal!");
				return false;
			}
			break;
		}

		case VRR_ITEM_USETYPE_LOTTOTICKET: {
			messagePlayerError(client, getLocaleString(client, "ItemDoesntDoAnythingOnUse", itemTypeData.name));
			break;
		}

		case VRR_ITEM_USETYPE_AREARADIO: {
			itemData.enabled = !itemData.enabled;
			meActionToNearbyPlayers(client, `turns ${getOnOffFromBool(itemData.enabled)} the boombox radio`);
			messagePlayerAlert(client, getLocaleString(client, "ItemRadioStationTip", `{ALTCOLOUR}/radiostation{MAINCOLOUR}`));
			break;
		}

		case VRR_ITEM_USETYPE_PERSONALRADIO: {
			itemData.enabled = !itemData.enabled;
			meActionToNearbyPlayers(client, `turns ${getOnOffFromBool(itemData.enabled)} their personal radio`);
			messagePlayerAlert(client, getLocaleString(client, "ItemRadioStationTip", `{ALTCOLOUR}/radiostation{MAINCOLOUR}`));
			break;
		}

		case VRR_ITEM_USETYPE_NONE: {
			messagePlayerError(client, getLocaleString(client, "ItemDoesntDoAnythingOnUse", itemTypeData.name));
			break;
		}

		default: {
			messagePlayerError(client, getLocaleString(client, "ItemDoesntDoAnythingOnUse", itemTypeData.name));
			break;
		}
	}

	if (getItemData(itemIndex) != false) {
		getItemData(itemIndex).needsSaved = true;
	}

	cachePlayerHotBarItems(client);
	updatePlayerHotBar(client);
}

// ===========================================================================

function playerDropItem(client, hotBarSlot) {
	let itemId = getPlayerData(client).hotBarItems[hotBarSlot];
	if (itemId != -1) {
		meActionToNearbyPlayers(client, `drops ${getProperDeterminerForName(getItemName(itemId))} ${getItemName(itemId)} on the ground`);

		resyncWeaponItemAmmo(client);

		getPlayerData(client).hotBarItems[hotBarSlot] = -1;
		updatePlayerHotBar(client);
		clearPlayerWeapons(client);

		getItemData(itemId).ownerType = VRR_ITEM_OWNER_GROUND;
		getItemData(itemId).ownerId = 0;
		getItemData(itemId).position = getPlayerPosition(client);
		getItemData(itemId).dimension = getPlayerDimension(client);
		createGroundItemObject(itemId);
		getItemData(itemId).needsSaved = true;
	}
}

// ===========================================================================

function playerPutItem(client, hotBarSlot) {
	let itemId = getPlayerData(client).hotBarItems[hotBarSlot];

	let bestNewOwner = getBestNewOwnerToPutItem(client);

	getItemData(itemId).ownerType = bestNewOwner[0];
	getItemData(itemId).ownerId = bestNewOwner[1];
	getItemData(itemId).position = toVector(0.0, 0.0, 0.0);
	getItemData(itemId).dimension = 0;
	getItemData(itemId).needsSaved = true;

	resyncWeaponItemAmmo(client);
	clearPlayerWeapons(client);

	getPlayerData(client).hotBarItems[hotBarSlot] = -1;
	updatePlayerHotBar(client);

	switch (bestNewOwner[0]) {
		case VRR_ITEM_OWNER_HOUSE:
			meActionToNearbyPlayers(client, `places ${getProperDeterminerForName(getItemName(itemId))} ${getItemName(itemId)} in the house`);
			break;

		case VRR_ITEM_OWNER_BIZFLOOR:
			meActionToNearbyPlayers(client, `places ${getProperDeterminerForName(getItemName(itemId))} ${getItemName(itemId)} for sale in the business`);
			break;

		case VRR_ITEM_OWNER_BIZSTORAGE:
			meActionToNearbyPlayers(client, `places ${getProperDeterminerForName(getItemName(itemId))} ${getItemName(itemId)} in the business storage room`);
			break;

		case VRR_ITEM_OWNER_VEHTRUNK:
			meActionToNearbyPlayers(client, `places ${getProperDeterminerForName(getItemName(itemId))} ${getItemName(itemId)} in the ${getVehicleName(getVehicleFromDatabaseId(bestNewOwner[1]))}'s trunk`);
			break;
	}
}

// ===========================================================================

function playerPickupItem(client, itemId) {
	meActionToNearbyPlayers(client, `picks up ${getProperDeterminerForName(getItemName(itemId))} ${getItemName(itemId)} from the ground`);

	let firstSlot = getPlayerFirstEmptyHotBarSlot(client);
	if (firstSlot != -1) {
		getItemData(itemId).ownerType = VRR_ITEM_OWNER_PLAYER;
		getItemData(itemId).ownerId = getPlayerCurrentSubAccount(client).databaseId;
		getItemData(itemId).position = toVector3(0.0, 0.0, 0.0);
		getItemData(itemId).dimension = 0;
		deleteGroundItemObject(itemId);

		getPlayerData(client).hotBarItems[firstSlot] = itemId;
		updatePlayerHotBar(client);
	}
}

// ===========================================================================

function playerTakeItem(client, itemId) {
	let firstSlot = getPlayerFirstEmptyHotBarSlot(client);
	if (firstSlot == -1) {
		messagePlayerError(client, getLocaleString(client, "NoSpaceSelfInventory"));
		return false;
	}

	let ownerId = getItemIdFromDatabaseId(getItemData(itemId).ownerId);

	getItemData(itemId).ownerType = VRR_ITEM_OWNER_PLAYER;
	getItemData(itemId).ownerId = getPlayerCurrentSubAccount(client).databaseId;

	getPlayerData(client).hotBarItems[firstSlot] = itemId;
	updatePlayerHotBar(client);

	switch (bestOwner[1]) {
		case VRR_ITEM_OWNER_HOUSE:
			meActionToNearbyPlayers(client, getLocaleString(client, "TakeItemFromHouse", getItemName(itemId)));
			break;

		case VRR_ITEM_OWNER_BIZFLOOR:
			meActionToNearbyPlayers(client, getLocaleString(client, "TakeItemFromBusiness", getItemName(itemId)));
			break;

		case VRR_ITEM_OWNER_BIZSTORAGE:
			meActionToNearbyPlayers(client, getLocaleString(client, "TakeItemFromBusinessStorage", getItemName(itemId)));
			break;

		case VRR_ITEM_OWNER_VEHTRUNK:
			meActionToNearbyPlayers(client, getLocaleString(client, "TakeItemFromVehicleTrunk", getItemName(itemId)));
			break;

		case VRR_ITEM_OWNER_VEHDASH:
			meActionToNearbyPlayers(client, getLocaleString(client, "TakeItemFromVehicleDash", getItemName(itemId)));
			break;

		case VRR_ITEM_OWNER_ITEM:
			meActionToNearbyPlayers(client, getLocaleString(client, "TakeItemFromItem", getItemName(itemId)), getItemName(ownerId));
			break;
	}
}

// ===========================================================================

function playerSwitchItem(client, newHotBarSlot) {
	if (newHotBarSlot < -1 || newHotBarSlot > 9) {
		return false;
	}

	let currentHotBarSlot = getPlayerData(client).activeHotBarSlot;
	logToConsole(LOG_DEBUG, `[VRR.Item] ${getPlayerDisplayForConsole(client)} switched from hotbar slot ${currentHotBarSlot} to ${newHotBarSlot}`);

	let currentHotBarItem = -1;
	let newHotBarItem = -1;

	// Check if new slot is the same as the current one
	// If true, clear active item slot (puts current item away)
	if (currentHotBarSlot != -1 && newHotBarSlot != -1) {
		if (currentHotBarSlot == newHotBarSlot) {
			newHotBarSlot = -1;
		}
	}

	if (currentHotBarSlot != -1) {
		currentHotBarItem = getPlayerData(client).hotBarItems[currentHotBarSlot];
	}

	if (newHotBarSlot != -1) {
		newHotBarItem = getPlayerData(client).hotBarItems[newHotBarSlot];
	}

	resyncWeaponItemAmmo(client);
	clearPlayerWeapons(client);

	//if(currentHotBarItem != -1) {
	//	if(getItemData(currentHotBarItem)) {
	//		if(getGlobalConfig().weaponEquippableTypes.indexOf(getItemTypeData(getItemData(currentHotBarItem).itemTypeIndex).useType) != -1) {
	//			clearPlayerWeapons(client);
	//		}
	//	}
	//}

	if (newHotBarItem != -1) {
		if (getItemData(newHotBarItem)) {
			if (getItemTypeData(getItemData(newHotBarItem).itemTypeIndex).useType == VRR_ITEM_USETYPE_WEAPON) {
				if (getItemData(newHotBarItem).value > 0 || isMeleeWeapon(toInteger(getItemTypeData(getItemData(newHotBarItem).itemTypeIndex).useId))) {
					givePlayerWeapon(client, toInteger(getItemTypeData(getItemData(newHotBarItem).itemTypeIndex).useId), toInteger(getItemData(newHotBarItem).value), true, true);
					setPlayerWeaponDamageEnabled(client, true);
					setPlayerWeaponDamageEvent(client, VRR_WEAPON_DAMAGE_EVENT_NORMAL);
				} else {
					let ammoItemSlot = getPlayerFirstAmmoItemForWeapon(client, getItemTypeData(getItemData(newHotBarItem).itemTypeIndex).useId);
					if (ammoItemSlot != false) {
						getItemData(newHotBarItem).value = getItemData(getPlayerData(client).hotBarItems[ammoItemSlot]).value;
						givePlayerWeapon(client, toInteger(getItemTypeData(getItemData(newHotBarItem).itemTypeIndex).useId), toInteger(getItemData(newHotBarItem).value), true, true);
						setPlayerWeaponDamageEnabled(client, true);
						setPlayerWeaponDamageEvent(client, VRR_WEAPON_DAMAGE_EVENT_NORMAL);
						deleteItem(getPlayerData(client).hotBarItems[ammoItemSlot]);
					} else {
						messagePlayerError(client, getLocaleString(client, "ItemUnequippableNoAmmo", getItemName(newHotBarItem), newHotBarSlot));
					}
				}
			} else if (getItemTypeData(getItemData(newHotBarItem).itemTypeIndex).useType == VRR_ITEM_USETYPE_TAZER) {
				if (getItemData(newHotBarItem).value > 0) {
					givePlayerWeapon(client, toInteger(getItemTypeData(getItemData(newHotBarItem).itemTypeIndex).useId), toInteger(getItemData(newHotBarItem).value), true, true);
					setPlayerWeaponDamageEnabled(client, false);
					setPlayerWeaponDamageEvent(client, VRR_WEAPON_DAMAGE_EVENT_TAZER);
				} else {
					messagePlayerError(client, getLocaleString(client, "ItemUnequippableNoAmmo", getItemName(newHotBarItem), newHotBarSlot));
				}
			}
		}
	}

	if (currentHotBarItem != -1 && newHotBarItem != -1) {
		// Player switches from item to item
		meActionToNearbyPlayers(client, `puts away ${getProperDeterminerForName(getItemName(currentHotBarItem))} ${getItemName(currentHotBarItem)} and pulls out ${getProperDeterminerForName(getItemName(newHotBarItem))} ${getItemName(newHotBarItem)}`);
	} else if (currentHotBarItem != -1 && newHotBarItem == -1) {
		// Player switches from item to none
		meActionToNearbyPlayers(client, `puts away ${getProperDeterminerForName(getItemName(currentHotBarItem))} ${getItemName(currentHotBarItem)}`);
	} else if (currentHotBarItem == -1 && newHotBarItem != -1) {
		// Player switches from none to item
		meActionToNearbyPlayers(client, `pulls out ${getProperDeterminerForName(getItemName(newHotBarItem))} ${getItemName(newHotBarItem)}`);
	} else {
		return false;
	}

	getPlayerData(client).activeHotBarSlot = newHotBarSlot;
	updatePlayerHotBar(client);
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
function playerSwitchHotBarSlotCommand(command, params, client) {
	clearPlayerItemActionState(client);

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let hotBarSlot = toInteger(params);

	if (hotBarSlot < 0 || hotBarSlot > 9) {
		messagePlayerError(client, getLocaleString(client, "ItemSlotMustBeBetween", "1", "9"));
		return false;
	}

	if (hotBarSlot == 0) {
		hotBarSlot = -1;
	} else {
		hotBarSlot = hotBarSlot - 1;
	}

	if (hotBarSlot != -1) {
		if (getPlayerData(client).activeHotBarSlot == hotBarSlot) {
			hotBarSlot = -1;
		}
	}

	if (getPlayerData(client).itemActionState != VRR_ITEM_ACTION_NONE) {
		messagePlayerError(client, getLocaleString(client, "HandsBusy"));
		return false;
	}

	if (getPlayerData(client).usingSkinSelect) {
		messagePlayerError(client, getLocaleString(client, "CantSwitchItemInSkinChange"));
		return false;
	}

	switchPlayerActiveHotBarSlot(client, hotBarSlot);
}

// ===========================================================================

function getClosestItemOnGround(position) {
	let items = getServerData().groundItemCache;
	let closest = 0;
	for (let i in items) {
		if (getDistance(getItemData(items[i]).position, position) <= getDistance(getItemData(items[closest]).position, position)) {
			closest = i;
		}
	}

	return items[closest];
}

// ===========================================================================

function setAllItemDataIndexes() {
	for (let i in getServerData().items) {
		if (getServerData().items[i]) {
			getServerData().items[i].index = i;
			getServerData().items[i].itemTypeIndex = getItemTypeIndexFromDatabaseId(getServerData().items[i].itemType);
		}
	}
}

// ===========================================================================

function setAllItemTypeDataIndexes() {
	for (let i in getServerData().itemTypes) {
		if (getServerData().itemTypes[i]) {
			getServerData().itemTypes[i].index = i;
			getServerData().itemTypes[i].useAnimationIndex = getAnimationFromParams(getServerData().itemTypes[i].useAnimationName);
			getServerData().itemTypes[i].switchAnimationIndex = getAnimationFromParams(getServerData().itemTypes[i].switchAnimationName);
			getServerData().itemTypes[i].dropAnimationIndex = getAnimationFromParams(getServerData().itemTypes[i].dropAnimationName);
			getServerData().itemTypes[i].putAnimationIndex = getAnimationFromParams(getServerData().itemTypes[i].putAnimationName);
			getServerData().itemTypes[i].takeAnimationIndex = getAnimationFromParams(getServerData().itemTypes[i].takeAnimationName);
			getServerData().itemTypes[i].giveAnimationIndex = getAnimationFromParams(getServerData().itemTypes[i].giveAnimationName);
			getServerData().itemTypes[i].pickupAnimationIndex = getAnimationFromParams(getServerData().itemTypes[i].pickupAnimationName);
		}
	}
}

// ===========================================================================

function cacheAllGroundItems() {
	clearArray(getServerData().groundItemCache);
	for (let i in getServerData().items) {
		if (getServerData().items[i].ownerType == VRR_ITEM_OWNER_GROUND) {
			getServerData().groundItemCache.push(i);
		}
	}
}

// ===========================================================================

function createAllGroundItemObjects() {
	for (let i in getServerData().groundItemCache) {
		createGroundItemObject(i);
	}
}

// ===========================================================================

function syncPlayerInventoryWeapons(client) {

}

// ===========================================================================

function getPlayerFirstEmptyHotBarSlot(client) {
	for (let i in getPlayerData(client).hotBarItems) {
		if (getPlayerData(client).hotBarItems[i] == -1) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function cachePlayerHotBarItems(client) {
	if (isPlayerWorking(client)) {
		return false;
	}

	for (let i = 0; i < 9; i++) {
		getPlayerData(client).hotBarItems[i] = -1;
	}

	for (let i in getServerData().items) {
		if (getItemData(i).ownerType == VRR_ITEM_OWNER_PLAYER) {
			if (getItemData(i).ownerId == getPlayerCurrentSubAccount(client).databaseId) {
				let firstSlot = getPlayerFirstEmptyHotBarSlot(client);
				if (firstSlot != -1) {
					getPlayerData(client).hotBarItems[firstSlot] = i;
				}
			}
		}
	}
}

// ===========================================================================

function deleteItem(itemId, whoDeleted = -1) {
	let owner = -1;
	let ownerTypeString = "Unknown";
	switch (getItemData(itemId).ownerType) {
		case VRR_ITEM_OWNER_GROUND:
			ownerTypeString = "Ground/Dropped";
			deleteGroundItemObject(itemId);
			getServerData().groundItemCache.splice(getServerData().groundItemCache.indexOf(itemId), 1);
			break;

		case VRR_ITEM_OWNER_PLAYER:
			ownerTypeString = "Player";
			owner = getPlayerFromCharacterId(getItemData(itemId).ownerId);
			if (getPlayerData(owner) != false) {
				switchPlayerActiveHotBarSlot(owner, -1);
				getPlayerData(owner).hotBarItems[getPlayerData(owner).hotBarItems.indexOf(itemId)] = -1;
				updatePlayerHotBar(owner);
			}
			break;

		case VRR_ITEM_OWNER_JOBLOCKER:
			ownerTypeString = "Job Locker";
			owner = getPlayerFromCharacterId(getItemData(itemId).ownerId);
			if (getPlayerData(owner) != false) {
				getPlayerData(owner).jobLockerCache.splice(getPlayerData(owner).jobLockerCache.indexOf(itemId), 1);
			}
			break;

		case VRR_ITEM_OWNER_LOCKER:
			ownerTypeString = "Locker";
			owner = getPlayerFromCharacterId(getItemData(itemId).ownerId);
			if (getPlayerData(owner) != false) {
				getPlayerData(owner).lockerCache.splice(getPlayerData(owner).lockerCache.indexOf(itemId), 1);
			}
			break;

		case VRR_ITEM_OWNER_VEHTRUNK:
			ownerTypeString = "Vehicle Trunk";
			owner = getVehicleFromDatabaseId(getItemData(itemId).ownerId)
			if (getVehicleData(owner) != false) {
				getVehicleDataIndex(getItemData(itemId).ownerId).trunkItemCache.splice(getVehicleData(owner).trunkItemCache.indexOf(itemId), 1);
			}
			break;

		case VRR_ITEM_OWNER_BIZFLOOR:
			ownerTypeString = "Business Floor";
			owner = getBusinessIdFromDatabaseId(getItemData(itemId).ownerId);
			if (getBusinessData(owner) != false) {
				getBusinessData(owner).floorItemCache.splice(getBusinessData(owner).floorItemCache.indexOf(itemId), 1);
			}
			break;

		case VRR_ITEM_OWNER_BIZSTORAGE:
			ownerTypeString = "Business Storage";
			owner = getBusinessIdFromDatabaseId(getItemData(itemId).ownerId);
			if (getBusinessData(owner) != false) {
				getBusinessData(owner).storageItemCache.splice(getBusinessData(owner).storageItemCache.indexOf(itemId), 1);
			}
			break;

		case VRR_ITEM_OWNER_HOUSE:
			ownerTypeString = "House";
			owner = getHouseIdFromDatabaseId(getItemData(itemId).ownerId);
			if (getHouseData(owner) != false) {
				getHouseData(owner).itemCache.splice(getHouseData(owner).itemCache.indexOf(itemId), 1);
			}
			break;
	}
	logToConsole(LOG_DEBUG, `Deleted item ${itemId} (DBID: ${getItemData(itemId).databaseId}, Owner Type: ${ownerTypeString}, Owner ID: ${getItemData(itemId).ownerId})`);

	if (getItemData(itemId).databaseId > 0) {
		quickDatabaseQuery(`UPDATE item_main SET item_deleted = 1, item_when_deleted = UNIX_TIMESTAMP() WHERE item_id = ${getItemData(itemId).databaseId}`);
	}
	getServerData().items[itemId] = false;
	setAllItemDataIndexes();
}

// ===========================================================================

function getBestNewOwnerToPutItem(client) {
	let closestDistance = 100.0;
	let position = getPlayerPosition(client);

	let possibleHouse = getPlayerHouse(client);
	if (getHouseData(possibleHouse)) {
		return [VRR_ITEM_OWNER_HOUSE, possibleHouse];
	}

	let possibleBusiness = getPlayerBusiness(client);
	if (getBusinessData(possibleBusiness)) {
		return [VRR_ITEM_OWNER_BIZSTORAGE, possibleBusiness];
	}

	let possibleVehicle = getClosestVehicle(position);
	if (getDistance(getVehicleTrunkPosition(possibleVehicle), position) <= closestDistance) {
		return [VRR_ITEM_OWNER_VEHTRUNK, possibleVehicle];
	}

	return [VRR_ITEM_OWNER_NONE, 0];
}

// ===========================================================================

function getBestItemToTake(client, slot) {
	let closestDistance = 100.0;
	let position = getPlayerPosition(client);
	let itemId = -1;
	let ownerType = VRR_ITEM_OWNER_NONE;
	let ownerId = 0;

	let possibleHouse = getPlayerHouse(client);
	if (getHouseData(possibleHouse)) {
		if (typeof getHouseData(possibleHouse).itemCache[slot] != "undefined") {
			itemId = getHouseData(possibleHouse).itemCache[slot];
			ownerType = VRR_ITEM_OWNER_HOUSE;
			ownerId = possibleHouse;
		}
	}

	let possibleBusiness = getPlayerBusiness(client);
	if (getBusinessData(possibleBusiness)) {
		if (typeof getBusinessData(possibleBusiness).floorItemCache[slot] != "undefined") {
			itemId = getBusinessData(possibleBusiness).floorItemCache[slot];
			ownerType = VRR_ITEM_OWNER_BIZFLOOR;
			ownerId = possibleBusiness;
		}
	}

	let possibleVehicle = getClosestVehicle(position);
	if (getVehicleData(possibleVehicle)) {
		if (getDistance(getVehicleTrunkPosition(possibleVehicle), position) <= closestDistance) {
			if (typeof getVehicleData(possibleVehicle).trunkItemCache[slot] != "undefined") {
				itemId = getVehicleData(possibleVehicle).trunkItemCache[slot];
				ownerType = VRR_ITEM_OWNER_VEHTRUNK;
				ownerId = possibleVehicle;
			}
		}
	}

	return [ownerType, ownerId, itemId];
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
function listPlayerInventoryCommand(command, params, client) {
	//let targetClient = client;
	//if(!areParamsEmpty(client)) {
	//	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("BasicModeration"))) {
	//		if(targetClient == false) {
	//			sendMessageToPlayer(client, getLocaleString(client, "InvalidPlayer"));
	//			return false;
	//		}
	//
	//		targetClient = getPlayerFromParams(params);
	//	}
	//}
	//showPlayerInventoryToPlayer(client, targetClient);

	showPlayerInventoryToPlayer(client, client);
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
function listBusinessStorageInventoryCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (getBusinessData(businessId).locked) {
		messagePlayerError(client, "This business is closed!");
		return false;
	}

	showBusinessStorageInventoryToPlayer(client, businessId);
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
function listBusinessFloorInventoryCommand(command, params, client) {
	let businessId = getPlayerBusiness(client);

	if (!getBusinessData(businessId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
		return false;
	}

	if (getBusinessData(businessId).locked) {
		messagePlayerError(client, "This business is closed!");
		return false;
	}

	showBusinessFloorInventoryToPlayer(client, businessId);
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
function listHouseInventoryCommand(command, params, client) {
	let houseId = getPlayerHouse(client);

	if (!getHouseData(houseId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
		return false;
	}

	if (getHouseData(houseId).locked) {
		messagePlayerError(client, "This house is locked!");
		return false;
	}

	showHouseInventoryToPlayer(client, houseId);
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
function listItemInventoryCommand(command, params, client) {
	let itemId = getClosestItemOnGround(getPlayerPosition(client));

	if (getDistance(getPlayerPosition(client), getItemData(itemId).position) > getGlobalConfig().droppedItemPickupRange) {
		messagePlayerError(client, `You're too far away!`);
		return false;
	}

	if (getItemTypeData(getItemData(itemId).itemTypeIndex).useType != VRR_ITEM_USETYPE_STORAGE) {
		messagePlayerError(client, "This item can't hold anything!");
		return false;
	}

	showItemInventoryToPlayer(client, itemId);
}

// ===========================================================================

/**
 * @param {number} itemId - The data index of the item
 * @return {ItemData} The item's data (class instance)
 */
function getItemData(itemId) {
	if (typeof getServerData().items[itemId] != "undefined") {
		return getServerData().items[itemId];
	}

	return false;
}

// ===========================================================================

/**
 * @param {number} itemTypeId - The data index of the item type
 * @return {ItemTypeData} The item type's data (class instance)
 */
function getItemTypeData(itemTypeId) {
	if (typeof getServerData().itemTypes[itemTypeId] != "undefined") {
		return getServerData().itemTypes[itemTypeId];
	}

	return false;
}

// ===========================================================================

function saveAllItemsToDatabase() {
	if (getServerConfig().devServer) {
		return false;
	}

	for (let i in getServerData().items) {
		saveItemToDatabase(i);
	}
}

// ===========================================================================

function saveAllItemTypesToDatabase() {
	if (getServerConfig().devServer) {
		return false;
	}

	for (let i in getServerData().itemTypes) {
		saveItemTypeToDatabase(i);
	}
}

// ===========================================================================

function saveItemToDatabase(itemId) {
	let itemData = getItemData(itemId);
	if (itemData == false) {
		return false;
	}

	if (itemData.databaseId == -1) {
		return false;
	}

	if (!itemData.needsSaved) {
		return false;
	}

	logToConsole(LOG_VERBOSE, `[VRR.Item]: Saving item '${itemData.index}' to database ...`);

	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let data = [
			["item_server", getServerId()],
			["item_type", itemData.itemType],
			["item_owner_type", itemData.ownerType],
			["item_owner_id", itemData.ownerId],
			["item_amount", itemData.amount],
			["item_pos_x", itemData.position.x],
			["item_pos_y", itemData.position.y],
			["item_pos_z", itemData.position.z],
			["item_int", itemData.interior],
			["item_vw", itemData.dimension],
			["item_buy_price", itemData.buyPrice],
			["item_enabled", itemData.enabled],
			["item_value", itemData.value],
		];

		let dbQuery = null;
		if (itemData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("item_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			itemData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("item_main", data, `item_id=${itemData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		itemData.needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}

	return false;
}

// ===========================================================================

function saveItemTypeToDatabase(itemTypeId) {
	let itemTypeData = getItemTypeData(itemTypeId);
	if (itemTypeData == false) {
		return false;
	}

	if (itemTypeData.databaseId == -1) {
		return false;
	}

	if (!itemTypeData.needsSaved) {
		return false;
	}

	logToConsole(LOG_VERBOSE, `[VRR.Item]: Saving item type '${itemTypeData.name}' to database ...`);

	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeItemTypeName = escapeDatabaseString(dbConnection, itemTypeData.name);
		let safeAnimationUse = escapeDatabaseString(dbConnection, itemTypeData.useAnimationName);
		let safeAnimationDrop = escapeDatabaseString(dbConnection, itemTypeData.dropAnimationName);
		let safeAnimationPickup = escapeDatabaseString(dbConnection, itemTypeData.pickupAnimationName);
		let safeAnimationGive = escapeDatabaseString(dbConnection, itemTypeData.giveAnimationName);
		let safeAnimationTake = escapeDatabaseString(dbConnection, itemTypeData.takeAnimationName);
		let safeAnimationSwitch = escapeDatabaseString(dbConnection, itemTypeData.switchAnimationName);

		let data = [
			["item_type_id", itemTypeData.databaseId],
			["item_type_server", itemTypeData.serverId],
			["item_type_name", safeItemTypeName],
			["item_type_enabled", itemTypeData.enabled],
			["item_type_use_type", itemTypeData.useType],
			["item_type_drop_type", itemTypeData.dropType],
			["item_type_use_id", itemTypeData.useId],
			["item_type_drop_pos_x", itemTypeData.dropPosition.x],
			["item_type_drop_pos_y", itemTypeData.dropPosition.y],
			["item_type_drop_pos_z", itemTypeData.dropPosition.z],
			["item_type_drop_rot_x", itemTypeData.dropRotation.x],
			["item_type_drop_rot_y", itemTypeData.dropRotation.y],
			["item_type_drop_rot_z", itemTypeData.dropRotation.z],
			["item_type_drop_scale_x", itemTypeData.dropScale.x],
			["item_type_drop_scale_y", itemTypeData.dropScale.y],
			["item_type_drop_scale_z", itemTypeData.dropScale.z],
			["item_type_drop_model", itemTypeData.dropModel],
			["item_type_use_value", itemTypeData.useValue],
			//["item_type_max_value", itemTypeData.maxValue],
			["item_type_order_price", itemTypeData.orderPrice],
			["item_type_order_value", itemTypeData.orderValue],
			["item_type_demand_multiplier", itemTypeData.demandMultiplier],
			["item_type_supply_multiplier", itemTypeData.supplyMultiplier],
			["item_type_risk_multiplier", itemTypeData.riskMultiplier],
			["item_type_size", itemTypeData.size],
			["item_type_capacity", itemTypeData.capacity],
			["item_type_delay_use", itemTypeData.useDelay],
			["item_type_delay_switch", itemTypeData.switchDelay],
			["item_type_delay_pickup", itemTypeData.pickupDelay],
			["item_type_delay_put", itemTypeData.putDelay],
			["item_type_delay_take", itemTypeData.takeDelay],
			["item_type_delay_give", itemTypeData.giveDelay],
			["item_type_delay_drop", itemTypeData.dropDelay],
			["item_type_anim_use", safeAnimationUse],
			["item_type_anim_drop", safeAnimationDrop],
			["item_type_anim_pickup", safeAnimationPickup],
			["item_type_anim_give", safeAnimationGive],
			["item_type_anim_take", safeAnimationTake],
			["item_type_anim_switch", safeAnimationSwitch],
		];

		let dbQuery = null;
		if (itemTypeData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("item_type", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			itemTypeData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("item_type", data, `item_type_id=${itemTypeData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}

		itemTypeData.needsSaved = false;
		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}

	return false;
}

// ===========================================================================

function storePlayerItemsInJobLocker(client) {
	for (let i = 0; i < 9; i++) {
		getPlayerData(client).jobLockerCache[i] = getPlayerData(client).hotBarItems[i];
		getPlayerData(client).hotBarItems[i] = -1;
	}

	//cachePlayerHotBarItems(client);
	updatePlayerHotBar(client);
}

// ===========================================================================

function restorePlayerJobLockerItems(client) {
	for (let i in getPlayerData(client).jobEquipmentCache) {
		if (getPlayerData(client).jobEquipmentCache[i] != -1) {
			deleteItem(getPlayerData(client).jobEquipmentCache[i]);
		}
	}

	for (let i = 0; i < 9; i++) {
		getPlayerData(client).hotBarItems[i] = getPlayerData(client).jobLockerCache[i];
		getPlayerData(client).jobLockerCache[i] = -1;
	}

	cachePlayerHotBarItems(client);
	updatePlayerHotBar(client);
}

// ===========================================================================

function getItemIndexFromDatabaseId(databaseId) {
	for (let i in getServerData().items) {
		if (getServerData().items[i].databaseId == databaseId) {
			return i;
		}
	}
	return false;
}

// ===========================================================================

function getItemTypeIndexFromDatabaseId(databaseId) {
	for (let i in getServerData().itemTypes) {
		if (getServerData().itemTypes[i].databaseId == databaseId) {
			return i;
		}
	}
	return false;
}

// ===========================================================================

function playerItemActionDelayComplete(client) {
	logToConsole(LOG_VERBOSE, `[VRR.Item]: Player ${getPlayerDisplayForConsole(client)} item action delay complete (State: ${getPlayerData(client).itemActionState})`);
	switch (getPlayerData(client).itemActionState) {
		case VRR_ITEM_ACTION_USE:
			playerUseItem(client, getPlayerData(client).itemActionItem);
			break;

		case VRR_ITEM_ACTION_DROP:
			playerDropItem(client, getPlayerData(client).itemActionItem);
			break;

		case VRR_ITEM_ACTION_TAKE:
			playerTakeItem(client, getPlayerData(client).itemActionItem);
			break;

		case VRR_ITEM_ACTION_PUT:
			playerPutItem(client, getPlayerData(client).itemActionItem);
			break;

		case VRR_ITEM_ACTION_PICKUP:
			playerPickupItem(client, getPlayerData(client).itemActionItem);
			break;

		case VRR_ITEM_ACTION_SWITCH:
			playerSwitchItem(client, getPlayerData(client).itemActionItem);
			break;

		default:
			break;
	}

	clearPlayerItemActionState(client);
}

// ===========================================================================

function getItemValueDisplayForItem(itemId) {
	if (!getItemData(itemId)) {
		return "[unknown]";
	}

	if (isMeleeWeapon(getItemTypeData(getItemData(itemId).itemTypeIndex).useId)) {
		return "";
	}

	return `[${getItemValueDisplay(getItemData(itemId).itemTypeIndex, getItemData(itemId).value)}]`;
}

// ===========================================================================

function getItemValueDisplay(itemType, value) {
	if (getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_SKIN) {
		return "any";
	} else if (getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_FOOD || getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_DRINK || getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_EXTINGUISHER || getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_SPRAYPAINT || getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_PEPPERSPRAY) {
		return getPercentage(toString(value), getItemTypeData(itemType).capacity) + "%";
	} else if (getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_PHONE) {
		return toString(value);
	} else if (getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_WEAPON || getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_TAZER) {
		if (isMeleeWeapon(getItemTypeData(itemType).useId)) {
			return false;
		}
		return toString(value) + " rounds";
	} else if (getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_WALKIETALKIE) {
		return toString(toString(value).slice(0, -2) + "." + toString(value).slice(-1) + "MHz");
	} else if (getItemTypeData(itemType).useType == VRR_ITEM_USETYPE_VEHCOLOUR) {
		return `[${getGameConfig().vehicleColourHex[value]}]SAMPLE[#FFFFFF]`;
	} else {
		return value;
	}
	return false;
}

// ===========================================================================

function getPlayerFirstItemSlotByUseType(client, useType) {
	for (let i in getPlayerData(client).hotBarItems) {
		if (getPlayerData(client).hotBarItems[i] != -1) {
			if (getItemData(getPlayerData(client).hotBarItems[i])) {
				if (getItemTypeData(getItemData(getPlayerData(client).hotBarItems[i]).itemTypeIndex).useType == useType) {
					return i;
				}
			}
		}
	}

	return -1;
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
function toggleItemEnabledCommand(command, params, client) {
	if (!getPlayerActiveItem(client)) {
		messagePlayerError(client, `You aren't holding anything!`);
		return false;
	}

	if (!getItemData(getPlayerActiveItem(client))) {
		messagePlayerError(client, `You aren't holding anything!`);
		return false;
	}

	getItemData(getPlayerActiveItem(client)).enabled = !getItemData(getPlayerActiveItem(client)).enabled;
	messagePlayerNormal(client, `You turned ${getBoolRedGreenInlineColour(getItemData(itemIndex).enabled)}${toUpperCase(getOnOffFromBool(getItemData(itemIndex).enabled))} {MAINCOLOUR}your ${getItemName(getPlayerActiveItem(client))} in slot ${getPlayerActiveItemSlot(client)} {ALTCOLOUR}${getItemValueDisplayForItem(getPlayerActiveItem(client))}`);
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
function deleteItemInPlayerInventoryCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let hotBarSlot = getParam(params, " ", 2);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (isNaN(hotBarSlot)) {
		messagePlayerError(client, getLocaleString(client, "ItemSlotNotNumber"));
		return false;
	}

	if (toInteger(hotBarSlot) <= 0 || toInteger(hotBarSlot) > 9) {
		messagePlayerError(client, getLocaleString(client, "ItemSlotMustBeBetween", "1", "9"));
		return false;
	}

	if (getPlayerData(targetClient).hotBarItems[hotBarSlot - 1] == -1) {
		messagePlayerError(client, `${getCharacterFullName(targetClient)} doesn't have anything in that slot!`);
		return false;
	}

	if (!getItemData(getPlayerData(targetClient).hotBarItems[hotBarSlot - 1])) {
		messagePlayerError(client, `${getCharacterFullName(targetClient)} doesn't have anything in that slot!`);
		return false;
	}

	let tempName = getItemTypeData(getItemData(getPlayerData(targetClient).hotBarItems[hotBarSlot - 1]).itemTypeIndex).name
	deleteItem(getPlayerData(targetClient).hotBarItems[hotBarSlot - 1]);
	messagePlayerSuccess(client, `You deleted the {ALTCOLOUR}${tempName} {MAINCOLOUR}item in {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}inventory`);
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
function deleteAllItemsInPlayerInventoryCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let hotBarSlot = getParam(params, " ", 2);

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	for (let i = 0; i < 9; i++) {
		deleteItem(getPlayerData(targetClient).hotBarItems[i]);
	}

	messagePlayerSuccess(client, `You deleted all items in {ALTCOLOUR}${getCharacterFullName(targetClient)}'s {MAINCOLOUR}inventory`);
}

// ===========================================================================

function getItemName(itemId) {
	if (getItemData(itemId)) {
		return getItemTypeData(getItemData(itemId).itemTypeIndex).name;
	}
}

// ===========================================================================

function getPlayerActiveItem(client) {
	if (getPlayerData(client).activeHotBarSlot != -1) {
		if (getPlayerData(client).hotBarItems[getPlayerData(client).activeHotBarSlot] != -1) {
			return getPlayerData(client).hotBarItems[getPlayerData(client).activeHotBarSlot];
		}
	}
}

// ===========================================================================

function getPlayerItemSlot(client, slot) {
	if (slot != -1) {
		if (getPlayerData(client).hotBarItems[slot] != -1) {
			return getPlayerData(client).hotBarItems[slot];
		}
	}
}

// ===========================================================================

function resyncWeaponItemAmmo(client) {
	if (getPlayerData(client).currentHotBarItem != -1) {
		if (getPlayerData(client).hotBarItems[getPlayerData(client).currentHotBarItem] != -1) {
			if (getItemData(getPlayerData(client).hotBarItems[getPlayerData(client).currentHotBarItem])) {
				if (getGlobalConfig().weaponEquippableTypes.indexOf(getItemTypeData(getItemData(getPlayerData(client).hotBarItems[getPlayerData(client).currentHotBarItem]).itemTypeIndex).useType)) {
					if (getPlayerWeaponAmmo(client) <= getItemData(getPlayerData(client).hotBarItems[getPlayerData(client).currentHotBarItem]).value) {
						getItemData(getPlayerData(client).hotBarItems[getPlayerData(client).currentHotBarItem]).value = getPlayerWeaponAmmo(client);
					} else {
						setPlayerWeaponAmmo(client, getItemTypeData(getItemData(getPlayerData(client).hotBarItems[getPlayerData(client).currentHotBarItem]).itemTypeIndex).useId, getItemData(getPlayerData(client).hotBarItems[getPlayerData(client).currentHotBarItem]).value);
					}
				}
			}
		}
	}
}

// ===========================================================================

function getOrderPriceForItemType(itemType) {
	return getItemTypeData(itemType).orderPrice * getServerConfig().inflationMultiplier * getItemTypeData(itemType).demandMultiplier * getItemTypeData(itemType).supplyMultiplier * getItemTypeData(itemType).riskMultiplier;
}

// ===========================================================================

function clearPlayerItemActionState(client) {
	if (getPlayerData(client).itemActionItem != -1) {
		switch (getPlayerData(client).itemActionState) {
			case VRR_ITEM_ACTION_DROP: {
				if (getItemTypeData(getItemData(getPlayerData(client).itemActionItem).itemTypeIndex).dropAnimationIndex != -1) {
					makePlayerStopAnimation(client);
				}
				break;
			}

			case VRR_ITEM_ACTION_USE: {
				if (getItemTypeData(getItemData(getPlayerData(client).itemActionItem).itemTypeIndex).useAnimationIndex != -1) {
					makePlayerStopAnimation(client);
				}
				break;
			}

			case VRR_ITEM_ACTION_PICKUP: {
				if (getItemTypeData(getItemData(getPlayerData(client).itemActionItem).itemTypeIndex).pickupAnimationIndex != -1) {
					makePlayerStopAnimation(client);
				}
				break;
			}

			case VRR_ITEM_ACTION_TAKE: {
				if (getItemTypeData(getItemData(getPlayerData(client).itemActionItem).itemTypeIndex).takeAnimationIndex != -1) {
					makePlayerStopAnimation(client);
				}
				break;
			}

			case VRR_ITEM_ACTION_PUT: {
				if (getItemTypeData(getItemData(getPlayerData(client).itemActionItem).itemTypeIndex).putAnimationIndex != -1) {
					makePlayerStopAnimation(client);
				}
				break;
			}

			case VRR_ITEM_ACTION_SWITCH: {
				if (getItemTypeData(getItemData(getPlayerData(client).itemActionItem).itemTypeIndex).switchAnimationIndex != -1) {
					makePlayerStopAnimation(client);
				}
				break;
			}
		}
	}

	getPlayerData(client).itemActionState = VRR_ITEM_ACTION_NONE;
	getPlayerData(client).itemActionItem = -1;
}

// ===========================================================================

function clearPlayerItemActionStateAfterDelay(client, delay) {
	setTimeout(function () {
		clearPlayerItemActionState(client);
	}, delay);
}

// ===========================================================================

function showBusinessFloorInventoryToPlayer(client, businessId) {
	let itemDisplay = [];

	for (let i in getBusinessData(businessId).floorItemCache) {
		if (getBusinessData(businessId).floorItemCache == -1) {
			itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}{ALTCOLOUR}(Empty)`);
		} else {
			itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}: {ALTCOLOUR}${getItemTypeData(getItemData(getBusinessData(businessId).floorItemCache[i]).itemTypeIndex).name} - ${(getPlayerCurrentSubAccount(client).cash > getItemData(getBusinessData(businessId).floorItemCache[i]).buyPrice) ? "{softGreen}" : "{softRed}"}$${getItemData(getBusinessData(businessId).floorItemCache[i]).buyPrice}`);
		}
	}

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBusinessFloorItemList")));
	let chunkedList = splitArrayIntoChunks(itemDisplay, 5);
	for (let i in chunkedList) {
		messagePlayerNormal(client, chunkedList[i].join(`{MAINCOLOUR} • `), COLOUR_WHITE);
	}
}

// ===========================================================================

function showBusinessStorageInventoryToPlayer(client, businessId) {
	let itemDisplay = [];
	for (let i in getBusinessData(businessId).storageItemCache) {
		if (getBusinessData(businessId).storageItemCache == -1) {
			itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}{ALTCOLOUR}(Empty)`);
		} else {
			itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}: {ALTCOLOUR}${getItemTypeData(getItemData(getBusinessData(businessId).storageItemCache[i]).itemTypeIndex).name}`);
		}
	}

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBusinessStorageItemList")));

	let chunkedList = splitArrayIntoChunks(itemDisplay, 5);
	for (let i in chunkedList) {
		messagePlayerNormal(client, chunkedList[i].join(`{MAINCOLOUR} • `), COLOUR_WHITE);
	}
}

// ===========================================================================

function showItemInventoryToPlayer(client, itemId) {
	let itemDisplay = [];
	for (let i in getItemData(itemId).itemCache) {
		if (getItemData(itemId).itemCache == -1) {
			itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}{ALTCOLOUR}(Empty)`);
		} else {
			itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}: {ALTCOLOUR}${getItemTypeData(getItemData(getItemData(itemId).itemCache[i]).itemTypeIndex).name}`);
		}
	}

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderItemItemsList")));

	let chunkedList = splitArrayIntoChunks(itemDisplay, 5);
	for (let i in chunkedList) {
		messagePlayerNormal(client, chunkedList[i].join(`{MAINCOLOUR} • `), COLOUR_WHITE);
	}
}

// ===========================================================================

function showPlayerInventoryToPlayer(showToClient, targetClient) {
	resyncWeaponItemAmmo(targetClient);
	let itemDisplay = [];
	for (let i in getPlayerData(targetClient).hotBarItems) {
		let colour = "{ALTCOLOUR}";
		if (getPlayerData(targetClient).activeHotBarSlot == i) {
			colour = "{yellow}";
		}
		if (getPlayerData(targetClient).hotBarItems[i] == -1) {
			itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}: ${colour}(Empty)`);
		} else {
			let itemTypeData = getItemTypeData(getItemData(getPlayerData(targetClient).hotBarItems[i]).itemTypeIndex);
			if (itemTypeData != false) {
				itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}: ${colour}${itemTypeData.name}`);
			} else {
				itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}: ${colour}(Empty)`);
			}
		}
	}

	if (showToClient == targetClient) {
		messagePlayerNormal(showToClient, makeChatBoxSectionHeader(getLocaleString(showToClient, "HeaderSelfItemList")));
	} else {
		messagePlayerNormal(showToClient, makeChatBoxSectionHeader(getLocaleString(showToClient, "HeaderPlayerItemList", getCharacterFullName(targetClient))));
	}

	let chunkedList = splitArrayIntoChunks(itemDisplay, 5);
	for (let i in chunkedList) {
		messagePlayerNormal(showToClient, chunkedList[i].join(`{MAINCOLOUR} • `), COLOUR_WHITE);
	}
}

// ===========================================================================

function showHouseInventoryToPlayer(client, houseId) {
	let itemDisplay = [];
	for (let i in getHouseData(houseId).itemCache) {
		if (getHouseData(houseId).itemCache == -1) {
			itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}{ALTCOLOUR}(Empty)`);
		} else {
			itemDisplay.push(`{MAINCOLOUR}${toInteger(i) + 1}: {ALTCOLOUR}${getItemTypeData(getItemData(getHouseData(houseId).itemCache[i]).itemTypeIndex).name}`);
		}
	}

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderHouseItemList")));
	let chunkedList = splitArrayIntoChunks(itemDisplay, 5);

	for (let i in chunkedList) {
		messagePlayerNormal(client, chunkedList[i].join(`{MAINCOLOUR} • `), COLOUR_WHITE);
	}
}

// ===========================================================================

function switchPlayerActiveHotBarSlot(client, slotId) {
	getPlayerData(client).itemActionItem = slotId;
	getPlayerData(client).itemActionState = VRR_ITEM_ACTION_SWITCH;
	if (slotId != -1) {
		showPlayerItemSwitchDelay(client, slotId);
	}
	//clearPlayerItemActionStateAfterDelay(client, getGlobalConfig().itemActionStateReset);
}

// ===========================================================================

function isPlayerItemFromJobEquipment(client, hotBarSlot) {
	let itemId = getPlayerData(client).hotBarItems[hotBarSlot];
	if (!getItemData(itemId)) {
		return false;
	}

	if (getItemData(itemId).databaseId == -1) {
		return true;
	}

	return false;
}

// ===========================================================================

function getItemPosition(itemId) {
	switch (getItemData(itemId).ownerType) {
		case VRR_ITEM_OWNER_PLAYER:
			return getPlayerPosition(getPlayerFromCharacterId(getItemData(itemId).ownerId));

		case VRR_ITEM_OWNER_VEHDASH:
		case VRR_ITEM_OWNER_VEHTRUNK:
			return getVehiclePosition(getVehicleFromDatabaseId(getItemData(itemId).ownerId));

		case VRR_ITEM_OWNER_GROUND:
			return getItemData(itemId).position;
	}
}

// ===========================================================================

function createGroundPlant(itemId) {
	createGroundItem(getItemTypeData(itemId).useId, 1, position, dimension);
	groundPlantCache.push(itemId);
	groundItemCache.push(itemId);
}

// ===========================================================================

function getItemTypeFromParams(params) {
	if (isNaN(params)) {
		for (let i in getServerData().itemTypes) {
			if (toLowerCase(getServerData().itemTypes[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof getServerData().itemTypes[params] != "undefined") {
			return toInteger(params);
		}
	}
	return false;
}

// ===========================================================================

function getPlayerFirstAmmoItemForWeapon(client, weaponId) {
	for (let i in getPlayerData(client).hotBarItems) {
		if (getPlayerData(client).hotBarItems[i] != -1) {
			if (getItemData(getPlayerData(client).hotBarItems[i]) != false) {
				if (getItemTypeData(getItemData(getPlayerData(client).hotBarItems[i]).itemTypeIndex).useType == VRR_ITEM_USETYPE_AMMO_CLIP) {
					if (getItemTypeData(getItemData(getPlayerData(client).hotBarItems[i]).itemTypeIndex).useId == weaponId) {
						return i;
					}
				}
			}
		}
	}

	return false;
}

// ===========================================================================