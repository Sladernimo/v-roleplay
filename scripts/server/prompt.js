// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: prompt.js
// DESC: Provides prompt (yes/no confirmations) functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Prompts (used for prompt responses)
const AGRP_PROMPT_NONE = 0;
const AGRP_PROMPT_CREATEFIRSTCHAR = 1;
const AGRP_PROMPT_BIZORDER = 2;
const AGRP_PROMPT_GIVEVEHTOCLAN = 3;
const AGRP_PROMPT_GIVEBIZTOCLAN = 4;
const AGRP_PROMPT_GIVEHOUSETOCLAN = 5;
const AGRP_PROMPT_BUYBIZ = 6;
const AGRP_PROMPT_BUYHOUSE = 7;
const AGRP_PROMPT_RESETKEYBINDS = 8;

// ===========================================================================

function initPromptScript() {
	logToConsole(LOG_INFO, "[AGRP.Prompt]: Initializing Prompt script ...");
	logToConsole(LOG_INFO, "[AGRP.Prompt]: Prompt script initialized successfully!");
}

// ===========================================================================

function playerPromptAnswerNo(client) {
	if (getPlayerData(client).promptType == AGRP_PROMPT_NONE) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.Prompt] ${getPlayerDisplayForConsole(client)} answered NO to their prompt (${getPlayerData(client).promptType})`);

	switch (getPlayerData(client).promptType) {
		case AGRP_PROMPT_CREATEFIRSTCHAR:
			logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} chose not to create a first character. Kicking them from the server ...`);
			showPlayerErrorGUI(client, getLocaleString(client, "DidNotCreateCharacter"), getLocaleString(client, getLocaleString(client, "GUIWarningTitle")));
			getPlayerData(targetClient).customDisconnectReason = "FailedToCreateCharacter";
			setTimeout(function () { disconnectPlayer(client); }, 5000);
			break;

		case AGRP_PROMPT_BIZORDER:
			if (getPlayerData(client).businessOrderAmount > 0) {
				if (doesPlayerUseGUI(client)) {
					showPlayerErrorGUI(client, getLocaleString(client, "BusinessOrderCanceled"), getLocaleString(client, "Alert"));
				} else {
					logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} canceled the order of ${getPlayerData(client).businessOrderAmount} ${getPlayerData(client).businessOrderItem} at ${getPlayerData(client).businessOrderCost / getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness)}`);
					messagePlayerError(client, getLocaleString(client, "BusinessOrderCanceled"));
				}
			} else {
				showPlayerErrorGUI(client, getLocaleString(client, "NotOrderingAnyBusinessItems"), getLocaleString(client, getLocaleString(client, "GUIWarningTitle")));
			}
			break;

		default:
			messagePlayerError(client, getLocaleString(client, "NoPromptReject"));
			submitBugReport(client, `[AUTOMATED REPORT] Tried to reject invalid prompt type: ${getPlayerData(client).promptType}`);
			break;
	}

	getPlayerData(client).promptType = AGRP_PROMPT_NONE;
}

// ===========================================================================

function playerPromptAnswerYes(client) {
	if (getPlayerData(client).promptType == AGRP_PROMPT_NONE) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[AGRP.Prompt] ${getPlayerDisplayForConsole(client)} answered YES to their prompt (${getPlayerData(client).promptType})`);

	switch (getPlayerData(client).promptType) {
		case AGRP_PROMPT_CREATEFIRSTCHAR: {
			showPlayerNewCharacterGUI(client);
			break;
		}

		case AGRP_PROMPT_BIZORDER: {
			if (getPlayerData(client).businessOrderAmount > 0) {
				if (getBusinessData(getPlayerData(client).businessOrderBusiness).till < getPlayerData(client).businessOrderCost) {
					logToConsole(LOG_DEBUG, `[AGRP.Prompt] ${getPlayerDisplayForConsole(client)} failed to order ${getPlayerData(client).businessOrderAmount} ${getItemTypeData(getPlayerData(client).businessOrderItem).name} at ${getPlayerData(client).businessOrderCost / getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness).name} (Reason: Not enough money in business till)`);
					if (doesPlayerHaveGUIEnabled(client)) {
						showPlayerErrorGUI(client, getLocaleString(client, "BusinessOrderNotEnoughMoney", `{ALTCOLOUR}/bizdeposit{MAINCOLOUR}`), getLocaleString(client, "BusinessOrderCanceled"));
					} else {
						messagePlayerError(client, getLocaleString(client, "BusinessOrderNotEnoughMoney", `{ALTCOLOUR}/bizdeposit{MAINCOLOUR}`));
					}
					getPlayerData(client).businessOrderAmount = 0;
					getPlayerData(client).businessOrderBusiness = false;
					getPlayerData(client).businessOrderItem = -1;
					getPlayerData(client).businessOrderValue = -1;
				} else {
					logToConsole(LOG_DEBUG, `[AGRP.Prompt] ${getPlayerDisplayForConsole(client)} successfully ordered ${getPlayerData(client).businessOrderAmount} ${getItemTypeData(getPlayerData(client).businessOrderItem).name} at ${getPlayerData(client).businessOrderCost / getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness).name}`);

					showPlayerInfoGUI(client, getLocaleString(client, "BusinessOrderSuccessInfo", getPlayerData(client).businessOrderAmount, getItemTypeData(getPlayerData(client).businessOrderItem).name, getItemValueDisplay(getPlayerData(client).businessOrderItem, getPlayerData(client).businessOrderValue), getPlayerData(client).businessOrderCost), getLocaleString(client, "GUIInfoTitle"));
					createItem(getPlayerData(client).businessOrderItem, getPlayerData(client).businessOrderValue, AGRP_ITEM_OWNER_BIZFLOOR, getBusinessData(getPlayerData(client).businessOrderBusiness).databaseId, getPlayerData(client).businessOrderAmount);
					cacheBusinessItems(getPlayerData(client).businessOrderBusiness);
					getBusinessData(getPlayerData(client).businessOrderBusiness).till -= getPlayerData(client).businessOrderCost;
					updateBusinessPickupLabelData(getPlayerData(client).businessOrderBusiness);
					getPlayerData(client).businessOrderAmount = 0;
					getPlayerData(client).businessOrderBusiness = false;
					getPlayerData(client).businessOrderItem = -1;
					getPlayerData(client).businessOrderValue = -1;
				}
			} else {
				showPlayerErrorGUI(client, ``, `Business Order Canceled`);
			}
			break;
		}

		case AGRP_PROMPT_GIVEVEHTOCLAN: {
			if (!isPlayerInAnyVehicle(client)) {
				messagePlayerError(client, getLocaleString(client, "MustBeInVehicle"));
				return false;
			}

			if (!getVehicleData(getPlayerVehicle(client))) {
				messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
				return false;
			}

			if (getVehicleData(getPlayerVehicle(client)).ownerType != AGRP_VEHOWNER_PLAYER) {
				messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
				return false;
			}

			if (getVehicleData(getPlayerVehicle(client)).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
				messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
				return false;
			}

			getVehicleData(getPlayerVehicle(client)).ownerType = AGRP_VEHOWNER_CLAN;
			getVehicleData(getPlayerVehicle(client)).ownerId = getPlayerCurrentSubAccount(client).clan;
			messagePlayerSuccess(client, getLocaleString(client, "GaveVehicleToClan", getVehicleName(getPlayerVehicle(client))));
			//messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set their {vehiclePurple}${getVehicleName(vehicle)} {MAINCOLOUR}owner to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan`);
			break;
		}

		case AGRP_PROMPT_GIVEHOUSETOCLAN: {
			let houseId = getPlayerHouse(client);
			if (!houseId) {
				messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
				return false;
			}

			if (getHouseData(houseId).ownerType != AGRP_VEHOWNER_PLAYER) {
				messagePlayerError(client, getLocaleString(client, "MustOwnHouse"));
				return false;
			}

			if (getHouseData(houseId).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
				messagePlayerError(client, getLocaleString(client, "MustOwnHouse"));
				return false;
			}

			getHouseData(houseId).ownerType = AGRP_HOUSE_OWNER_CLAN;
			getHouseData(houseId).ownerId = getPlayerCurrentSubAccount(client).clan;
			messagePlayerSuccess(client, getLocaleString(client, "GaveHouseToClan"));
			//messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set their {vehiclePurple}${getVehicleName(vehicle)} {MAINCOLOUR}owner to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan`);
			break;
		}

		case AGRP_PROMPT_GIVEBIZTOCLAN: {
			let businessId = getPlayerBusiness(client);
			if (!businessId) {
				messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
				return false;
			}

			if (getBusinessData(businessId).ownerType != AGRP_VEHOWNER_PLAYER) {
				messagePlayerError(client, getLocaleString(client, "MustOwnBusiness"));
				return false;
			}

			if (getBusinessData(businessId).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
				messagePlayerError(client, getLocaleString(client, "MustOwnBusiness"));
				return false;
			}

			getBusinessData(businessId).ownerType = AGRP_BIZ_OWNER_CLAN;
			getBusinessData(businessId).ownerId = getPlayerCurrentSubAccount(client).clan;
			messagePlayerSuccess(client, getLocaleString(client, "GaveBusinessToClan"));
			//messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set their {vehiclePurple}${getVehicleName(vehicle)} {MAINCOLOUR}owner to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan`);
			break;
		}

		case AGRP_PROMPT_BUYHOUSE: {
			let houseId = getPlayerHouse(client);
			if (!houseId) {
				messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
				return false;
			}

			if (getHouseData(houseId).buyPrice <= 0) {
				messagePlayerError(client, getLocaleString(client, "HouseNotForSale"));
				return false;
			}

			if (getPlayerCurrentSubAccount(client).cash < getHouseData(houseId).buyPrice) {
				messagePlayerError(client, getLocaleString(client, "HousePurchaseNotEnoughMoney"));
				return false;
			}

			getHouseData(houseId).ownerType = AGRP_HOUSE_OWNER_PLAYER;
			getHouseData(houseId).ownerId = getPlayerCurrentSubAccount(client).databaseId;
			getHouseData(houseId).buyPrice = 0;
			getHouseData(houseId).needsSaved = true;
			updateHousePickupLabelData(houseId);

			messageDiscordEventChannel(`🏘️ ${getCharacterFullName(client)} is now the owner of house *${getHouseData(houseId).description}*!`);
			messagePlayerSuccess(client, `🏘️ You are now the owner of {houseGreen}${getHouseData(houseId).description}`);
			break;
		}

		case AGRP_PROMPT_BUYBIZ: {
			let businessId = getPlayerBusiness(client);
			if (!businessId) {
				messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
				return false;
			}

			if (getBusinessData(businessId).buyPrice <= 0) {
				messagePlayerError(client, getLocaleString(client, "BusinessNotForSale"));
				return false;
			}

			if (getPlayerCurrentSubAccount(client).cash < getBusinessData(businessId).buyPrice) {
				messagePlayerError(client, getLocaleString(client, "BusinessPurchaseNotEnoughMoney"));
				return false;
			}

			getBusinessData(businessId).ownerType = AGRP_BIZ_OWNER_PLAYER;
			getBusinessData(businessId).ownerId = getPlayerCurrentSubAccount(client).databaseId;
			getBusinessData(businessId).buyPrice = 0;
			getBusinessData(businessId).needsSaved = true;
			updateBusinessPickupLabelData(businessId);

			messageDiscordEventChannel(`🏢 ${getCharacterFullName(client)} is now the owner of *${getBusinessData(businessId).name}*!`);
			messagePlayerSuccess(client, getLocaleString(client, "BusinessPurchased", `{businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR}`));
			break;
		}

		case AGRP_PROMPT_RESETKEYBINDS: {
			// TODO: Needs database query!

			//for (let i in getPlayerData(client).keyBinds) {
			//	removePlayerKeyBind(client, getPlayerData(client).keyBinds[i].key)
			//}

			//for (let i in getGlobalConfig().keyBind.defaultKeyBinds) {
			//	let tempKeyBindData = new KeyBindData(false);
			//	tempKeyBindData.databaseId = -1;
			//	tempKeyBindData.key = getKeyIdFromParams(getGlobalConfig().keyBind.defaultKeyBinds[i].keyName);
			//	tempKeyBindData.commandString = getGlobalConfig().keyBind.defaultKeyBinds[i].commandString;
			//	tempKeyBindData.keyState = getGlobalConfig().keyBind.defaultKeyBinds[i].keyState;
			//	getPlayerData(client).keyBinds.push(tempKeyBindData);
			//}

			//messagePlayerSuccess(client, getLocaleString(client, "KeyBindsReset"));
			break;
		}

		case AGRP_PROMPT_COPYKEYBINDSTOSERVER: {
			//messagePlayerSuccess(client, getLocaleString(client, "KeyBindsCopiedToServer", serverName));
			break;
		}

		default: {
			messagePlayerError(client, getLocaleString(client, "NoPromptAccept"));
			submitBugReport(client, `[AUTOMATED REPORT] Tried to accept invalid prompt type: ${getPlayerData(client).promptType}`);
			break;
		}
	}

	getPlayerData(client).promptType = AGRP_PROMPT_NONE;
}

// ===========================================================================

function playerPromptAnswerYesCommand(command, params, client) {
	playerPromptAnswerYes(client);
}

// ===========================================================================

function playerPromptAnswerNoCommand(command, params, client) {
	playerPromptAnswerNo(client);
}

// ===========================================================================

function showPlayerTwoFactorAuthenticationGUI(client) {
	sendNetworkEventToPlayer("agrp.2fa", client);
}

// ===========================================================================