// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: prompt.js
// DESC: Provides prompt (yes/no confirmations) functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Prompts (used for prompt responses)
const V_PROMPT_NONE = 0;
const V_PROMPT_CREATEFIRSTCHAR = 1;
const V_PROMPT_BIZORDER = 2;
const V_PROMPT_GIVEVEHTOCLAN = 3;
const V_PROMPT_GIVEBIZTOCLAN = 4;
const V_PROMPT_GIVEHOUSETOCLAN = 5;
const V_PROMPT_BUYBIZ = 6;
const V_PROMPT_BUYHOUSE = 7;
const V_PROMPT_RESETKEYBINDS = 8;
const V_PROMPT_RESETACTIONTIPS = 9;
const V_PROMPT_JOBINVITE = 10;
const V_PROMPT_CLANINVITE = 11;
const V_PROMPT_COPYKEYBINDSTOSERVER = 12;
const V_PROMPT_GIVEVEHTOBIZ = 13;

// ===========================================================================

function initPromptScript() {
	logToConsole(LOG_INFO, "[V.RP.Prompt]: Initializing Prompt script ...");
	logToConsole(LOG_INFO, "[V.RP.Prompt]: Prompt script initialized successfully!");
}

// ===========================================================================

function showPlayerPrompt(client, promptMessage, promptTitle, yesButtonText, noButtonText) {
	if (doesPlayerUseGUI(client)) {
		showPlayerPromptGUI(client, promptMessage, promptTitle, yesButtonText, noButtonText);
	} else {
		messagePlayerNormal(client, `🛎️ ${promptMessage} `);
		messagePlayerInfo(client, getLocaleString(client, "PromptResponseTip", `{ALTCOLOUR}/yes{MAINCOLOUR}`, `{ALTCOLOUR}/no{MAINCOLOUR}`));
	}
}

// ===========================================================================

function playerPromptAnswerNo(client) {
	if (getPlayerData(client).promptType == V_PROMPT_NONE) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Prompt] ${getPlayerDisplayForConsole(client)} answered NO to their prompt (${getPlayerData(client).promptType})`);

	switch (getPlayerData(client).promptType) {
		case V_PROMPT_CREATEFIRSTCHAR:
			logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} chose not to create a first character. Kicking them from the server ...`);
			showPlayerErrorGUI(client, getLocaleString(client, "DidNotCreateCharacter"), getLocaleString(client, getLocaleString(client, "GUIWarningTitle")));
			getPlayerData(targetClient).customDisconnectReason = "FailedToCreateCharacter";
			setTimeout(function () { disconnectPlayer(client); }, 5000);
			break;

		case V_PROMPT_BIZORDER:
			showPlayerError(client, getLocaleString(client, "BusinessOrderCanceled"), getLocaleString(client, "GUIWarningTitle"));
			break;

		case V_PROMPT_CLANINVITE: {
			if (getPlayerData(client).promptValue == false) {
				return false;
			}

			let invitingPlayer = getPlayerData(client).promptValue;

			messagePlayerSuccess(client, getLocaleString(client, "DeclinedClanInvite", getCharacterFullName(invitingPlayer)));
			messagePlayerAlert(invitingPlayer, getLocaleString(client, "PlayerDeclinedClanInvite", getCharacterFullName(client)));

			getPlayerData(client).promptValue = false;
			break;
		}

		case V_PROMPT_JOBINVITE: {
			if (getPlayerData(client).promptValue == false) {
				return false;
			}

			let invitingPlayer = getPlayerData(client).promptValue;

			messagePlayerSuccess(client, getLocaleString(client, "DeclinedJobInvite", getCharacterFullName(invitingPlayer)));
			messagePlayerAlert(invitingPlayer, getLocaleString(client, "PlayerDeclinedJobInvite", getCharacterFullName(client)));

			getPlayerData(client).promptValue = false;
			break;
		}

		default:
			messagePlayerError(client, getLocaleString(client, "NoPromptReject"));
			submitBugReport(client, `[AUTOMATED REPORT] Tried to reject invalid prompt type: ${getPlayerData(client).promptType}`);
			break;
	}

	getPlayerData(client).promptType = V_PROMPT_NONE;
}

// ===========================================================================

function playerPromptAnswerYes(client) {
	if (getPlayerData(client).promptType == V_PROMPT_NONE) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Prompt] ${getPlayerDisplayForConsole(client)} answered YES to their prompt (${getPlayerData(client).promptType})`);

	switch (getPlayerData(client).promptType) {
		case V_PROMPT_CREATEFIRSTCHAR: {
			showPlayerNewCharacterGUI(client);
			break;
		}

		case V_PROMPT_BIZORDER: {
			if (getPlayerData(client).businessOrderAmount > 0) {
				if (getBusinessData(getPlayerData(client).businessOrderBusiness).till < getPlayerData(client).businessOrderCost) {
					logToConsole(LOG_DEBUG, `[V.RP.Prompt] ${getPlayerDisplayForConsole(client)} failed to order ${getPlayerData(client).businessOrderAmount} ${getItemTypeData(getPlayerData(client).businessOrderItem).name} at ${getPlayerData(client).businessOrderCost / getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness).name} (Reason: Not enough money in business till)`);
					showPlayerError(client, getLocaleString(client, "BusinessOrderNotEnoughMoney", `{ALTCOLOUR}/bizdeposit{MAINCOLOUR}`), getLocaleString(client, "BusinessOrderCanceled"));
					getPlayerData(client).businessOrderAmount = 0;
					getPlayerData(client).businessOrderBusiness = false;
					getPlayerData(client).businessOrderItem = -1;
					getPlayerData(client).businessOrderValue = -1;
				} else {
					logToConsole(LOG_DEBUG, `[V.RP.Prompt] ${getPlayerDisplayForConsole(client)} successfully ordered ${getPlayerData(client).businessOrderAmount} ${getItemTypeData(getPlayerData(client).businessOrderItem).name} at ${getPlayerData(client).businessOrderCost / getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness).name}`);
					showPlayerInfo(client, getLocaleString(client, "BusinessOrderSuccessInfo", getPlayerData(client).businessOrderAmount, getItemTypeData(getPlayerData(client).businessOrderItem).name, getItemValueDisplay(getPlayerData(client).businessOrderItem, getPlayerData(client).businessOrderValue), getPlayerData(client).businessOrderCost), getLocaleString(client, "GUIInfoTitle"));
					createItem(getPlayerData(client).businessOrderItem, getPlayerData(client).businessOrderValue, V_ITEM_OWNER_BIZFLOOR, getBusinessData(getPlayerData(client).businessOrderBusiness).databaseId, getPlayerData(client).businessOrderAmount);
					cacheBusinessItems(getPlayerData(client).businessOrderBusiness);
					getBusinessData(getPlayerData(client).businessOrderBusiness).till -= getPlayerData(client).businessOrderCost;
					updateBusinessPickupLabelData(getPlayerData(client).businessOrderBusiness);
					getPlayerData(client).businessOrderAmount = 0;
					getPlayerData(client).businessOrderBusiness = false;
					getPlayerData(client).businessOrderItem = -1;
					getPlayerData(client).businessOrderValue = -1;
				}
			} else {
				showPlayerError(client, getLocaleString(client, "BusinessOrderCanceled"), getLocaleString(client, "GUIWarningTitle"));
			}
			break;
		}

		case V_PROMPT_GIVEVEHTOCLAN: {
			if (!isPlayerInAnyVehicle(client)) {
				messagePlayerError(client, getLocaleString(client, "MustBeInVehicle"));
				return false;
			}

			if (getVehicleData(getPlayerVehicle(client)) == null) {
				messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
				return false;
			}

			if (getVehicleData(getPlayerVehicle(client)).ownerType != V_VEH_OWNER_PLAYER) {
				messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
				return false;
			}

			if (getVehicleData(getPlayerVehicle(client)).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
				messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
				return false;
			}

			getVehicleData(getPlayerVehicle(client)).ownerType = V_VEH_OWNER_CLAN;
			getVehicleData(getPlayerVehicle(client)).ownerId = getPlayerCurrentSubAccount(client).clan;
			messagePlayerSuccess(client, getLocaleString(client, "GaveVehicleToClan", getVehicleName(getPlayerVehicle(client))));
			getVehicleData(getPlayerVehicle(client)).needsSaved = true;
			//messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set their {vehiclePurple}${getVehicleName(vehicle)} {MAINCOLOUR}owner to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan`);
			break;
		}

		case V_PROMPT_GIVEHOUSETOCLAN: {
			let houseId = getPlayerHouse(client);
			if (!houseId) {
				messagePlayerError(client, getLocaleString(client, "InvalidHouse"));
				return false;
			}

			if (getHouseData(houseId).ownerType != V_VEH_OWNER_PLAYER) {
				messagePlayerError(client, getLocaleString(client, "MustOwnHouse"));
				return false;
			}

			if (getHouseData(houseId).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
				messagePlayerError(client, getLocaleString(client, "MustOwnHouse"));
				return false;
			}

			getHouseData(houseId).ownerType = V_HOUSE_OWNER_CLAN;
			getHouseData(houseId).ownerId = getPlayerCurrentSubAccount(client).clan;
			messagePlayerSuccess(client, getLocaleString(client, "GaveHouseToClan"));
			getHouseData(houseId).needsSaved = true;
			//messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set their {vehiclePurple}${getVehicleName(vehicle)} {MAINCOLOUR}owner to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan`);
			break;
		}

		case V_PROMPT_GIVEBIZTOCLAN: {
			let businessId = getPlayerBusiness(client);
			if (!businessId) {
				messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
				return false;
			}

			if (getBusinessData(businessId).ownerType != V_VEH_OWNER_PLAYER) {
				messagePlayerError(client, getLocaleString(client, "MustOwnBusiness"));
				return false;
			}

			if (getBusinessData(businessId).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
				messagePlayerError(client, getLocaleString(client, "MustOwnBusiness"));
				return false;
			}

			getBusinessData(businessId).ownerType = V_BIZ_OWNER_CLAN;
			getBusinessData(businessId).ownerId = getPlayerCurrentSubAccount(client).clan;
			messagePlayerSuccess(client, getLocaleString(client, "GaveBusinessToClan"));
			getBusinessData(businessId).needsSaved = true;
			//messageAdmins(`{ALTCOLOUR}${getPlayerName(client)} {MAINCOLOUR}set their {vehiclePurple}${getVehicleName(vehicle)} {MAINCOLOUR}owner to the {clanOrange}${getClanData(clanId).name} {MAINCOLOUR}clan`);
			break;
		}

		case V_PROMPT_GIVEVEHTOBIZ: {
			if (!isPlayerInAnyVehicle(client)) {
				messagePlayerError(client, getLocaleString(client, "MustBeInVehicle"));
				return false;
			}

			if (getVehicleData(getPlayerVehicle(client)) == null) {
				messagePlayerError(client, getLocaleString(client, "RandomVehicleCommandsDisabled"));
				return false;
			}

			if (getVehicleData(getPlayerVehicle(client)).ownerType != V_VEH_OWNER_PLAYER) {
				messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
				return false;
			}

			if (getVehicleData(getPlayerVehicle(client)).ownerId != getPlayerCurrentSubAccount(client).databaseId) {
				messagePlayerError(client, getLocaleString(client, "MustOwnVehicle"));
				return false;
			}

			let businessIndex = getClosestBusinessEntrance(getPlayerPosition(client), getPlayerDimension(client));

			if (!getBusinessData(businessIndex)) {
				messagePlayerError(client, getLocaleString(client, "InvalidBusiness"));
				return false;
			}

			if (!canPlayerManageBusiness(client, businessIndex)) {
				messagePlayerError(client, getLocaleString(client, "CantModifyBusiness"));
				return false;
			}

			getVehicleData(getPlayerVehicle(client)).ownerType = V_VEH_OWNER_BIZ;
			getVehicleData(getPlayerVehicle(client)).ownerId = getBusinessData(businessIndex).databaseId;
			messagePlayerSuccess(client, getLocaleString(client, "GaveVehicleToBusiness", `{vehiclePurple}${getVehicleName(getPlayerVehicle(client))}{MAINCOLOUR}`, `{businessBlue}${getBusinessData(businessIndex).name}{MAINCOLOUR}`));

			getVehicleData(getPlayerVehicle(client)).needsSaved = true;
			break;
		}

		case V_PROMPT_BUYHOUSE: {
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

			getHouseData(houseId).ownerType = V_HOUSE_OWNER_PLAYER;
			getHouseData(houseId).ownerId = getPlayerCurrentSubAccount(client).databaseId;
			getHouseData(houseId).buyPrice = 0;
			getHouseData(houseId).needsSaved = true;
			updateHousePickupLabelData(houseId);

			messageDiscordEventChannel(`🏘️ ${getCharacterFullName(client)} is now the owner of house *${getHouseData(houseId).description}*!`);
			messagePlayerSuccess(client, `🏘️ You are now the owner of {houseGreen}${getHouseData(houseId).description}`);
			break;
		}

		case V_PROMPT_BUYBIZ: {
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

			takePlayerCash(client, getBusinessData(businessId).buyPrice);
			getBusinessData(businessId).ownerType = V_BIZ_OWNER_PLAYER;
			getBusinessData(businessId).ownerId = getPlayerCurrentSubAccount(client).databaseId;
			getBusinessData(businessId).buyPrice = 0;
			getBusinessData(businessId).needsSaved = true;

			updateBusinessPickupLabelData(businessId);

			messageDiscordEventChannel(`🏢 ${getCharacterFullName(client)} is now the owner of *${getBusinessData(businessId).name}*!`);
			messagePlayerSuccess(client, getLocaleString(client, "BusinessPurchased", `{businessBlue}${getBusinessData(businessId).name}{MAINCOLOUR}`));
			break;
		}

		case V_PROMPT_RESETKEYBINDS: {
			// TODO: Needs database query!

			//for (let i in getPlayerData(client).keyBinds) {
			//	removePlayerKeyBind(client, getPlayerData(client).keyBinds[i].key)
			//}

			//for (let i in globalConfig.keyBind.defaultKeyBinds) {
			//	let tempKeyBindData = new KeyBindData(false);
			//	tempKeyBindData.databaseId = -1;
			//	tempKeyBindData.key = getKeyIdFromParams(globalConfig.keyBind.defaultKeyBinds[i].keyName);
			//	tempKeyBindData.commandString = globalConfig.keyBind.defaultKeyBinds[i].commandString;
			//	tempKeyBindData.keyState = globalConfig.keyBind.defaultKeyBinds[i].keyState;
			//	getPlayerData(client).keyBinds.push(tempKeyBindData);
			//}

			//messagePlayerSuccess(client, getLocaleString(client, "KeyBindsReset"));
			break;
		}

		case V_PROMPT_COPYKEYBINDSTOSERVER: {
			//messagePlayerSuccess(client, getLocaleString(client, "KeyBindsCopiedToServer", serverName));
			break;
		}

		case V_PROMPT_RESETACTIONTIPS: {
			getPlayerData(client).accountData.seenActionTips = 0;
			messagePlayerSuccess(client, getLocaleString(client, "ActionTipsReset"));
			break;
		}

		case V_PROMPT_CLANINVITE: {
			if (getPlayerData(client).promptValue == false) {
				return false;
			}

			let invitingPlayer = getPlayerData(client).promptValue;

			if (getPlayerClan(invitingPlayer) == -1) {
				return false;
			}

			let clanIndex = getPlayerClan(invitingPlayer);
			let lowestClanRankIndex = getLowestClanRank(clanIndex);

			getPlayerCurrentSubAccount(client).clan = getClanData(clanIndex).databaseId;
			getPlayerCurrentSubAccount(client).clanIndex = clanIndex;
			getPlayerCurrentSubAccount(client).clanRank = getClanRankData(clanIndex, lowestClanRankIndex).databaseId;
			getPlayerCurrentSubAccount(client).clanRankIndex = lowestClanRankIndex;

			messagePlayerSuccess(client, getLocaleString(client, "AcceptedJobClanInvite", getCharacterFullName(invitingPlayer)));
			messagePlayerAlert(invitingPlayer, getLocaleString(client, "PlayerAcceptedClanInvite", getCharacterFullName(client)));

			getPlayerData(client).promptValue = false;
			break;
		}

		case V_PROMPT_JOBINVITE: {
			if (getPlayerData(client).promptValue == false) {
				return false;
			}

			let invitingPlayer = getPlayerData(client).promptValue;

			if (getPlayerJob(invitingPlayer) == -1) {
				return false;
			}

			let jobIndex = getPlayerJob(invitingPlayer);
			let lowestRankIndex = getLowestJobRank(jobIndex);

			getPlayerCurrentSubAccount(client).job = getJobData(jobIndex).databaseId;
			getPlayerCurrentSubAccount(client).jobIndex = jobIndex;
			getPlayerCurrentSubAccount(client).jobRank = getJobRankData(jobIndex, lowestRankIndex).databaseId;
			getPlayerCurrentSubAccount(client).jobRankIndex = lowestRankIndex;

			messagePlayerSuccess(client, getLocaleString(client, "AcceptedJobInvite", getCharacterFullName(invitingPlayer)));
			messagePlayerAlert(invitingPlayer, getLocaleString(client, "PlayerAcceptedJobInvite", getCharacterFullName(client)));

			getPlayerData(client).promptValue = false;
			break;
		}

		default: {
			messagePlayerError(client, getLocaleString(client, "NoPromptAccept"));
			submitBugReport(client, `[AUTOMATED REPORT] Tried to accept invalid prompt type: ${getPlayerData(client).promptType}`);
			break;
		}
	}

	getPlayerData(client).promptType = V_PROMPT_NONE;
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
	sendNetworkEventToPlayer("v.rp.2fa", client);
}

// ===========================================================================
