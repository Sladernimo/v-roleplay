// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: bank.js
// DESC: Provides banking functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// House Owner Types
const V_BANK_ACCT_OWNER_NONE = 0;					// Not owned
const V_BANK_ACCT_OWNER_PLAYER = 1;				// Owner is a player (character/subaccount)
const V_BANK_ACCT_OWNER_JOB = 2;					// Owned by a job
const V_BANK_ACCT_OWNER_CLAN = 3;					// Owned by a clan
const V_BANK_ACCT_OWNER_FACTION = 4;				// Owned by a faction
const V_BANK_ACCT_OWNER_BIZ = 4;					// Owned by a faction
const V_BANK_ACCT_OWNER_PUBLIC = 5;				// Is a public bank account. Technically not owned. This probably won't be used.

// ===========================================================================

function isPlayerAtBank(client) {
	let businessId = getPlayerBusiness(client);
	if (getBusinessData(businessId) != false) {
		if (getBusinessData(businessId).type == V_BIZ_TYPE_BANK) {
			return true;
		}
	}

	//if (isPositionAtATM(getPlayerPosition(client))) {
	//	return true;
	//}
	return false;
}

// ===========================================================================

function isPositionAtATM(position) {
	let atmId = getClosestATM(position);

	let atmData = getServerData().atmLocationCache[atmId];

	if (getDistance(position, atmData[2]) <= getGlobalConfig().atmDistance) {
		return true;
	}

	return false;
}

// ===========================================================================

function getClosestATM(position) {
	let atmLocations = getServerData().atmLocationCache;
	let closest = 0;

	for (let i in atmLocations) {
		if (getDistance(position, atmLocations[i]) < getDistance(position, atmLocations[closest])) {
			closest = i;
		}
	}

	return closest;
}

// ===========================================================================

function isPositionAtATM(position) {
	let atmId = getClosestATM(position);

	let atmData = getServerData().atmLocationCache[atmId];

	if (getDistance(position, atmData[2]) <= getGlobalConfig().atmDistance) {
		return true;
	}

	return false;
}

// ===========================================================================

function bankWithdrawCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!isPlayerAtBank(client)) {
		messagePlayerError(client, getLocaleString(client, "NotAtBank"));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
		return false;
	}

	let amount = toInteger(params);

	if (amount < 0) {
		messagePlayerError(client, getLocaleString(client, "CantUseNegative"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).bank < amount) {
		messagePlayerError(client, getLocaleString(client, "NotEnoughCashNeedAmountMore", `{ALTCOLOUR}${getCurrencyString(amount - getPlayerCurrentSubAccount(client).bank)}{MAINCOLOUR}`));
		return false;
	}

	getPlayerCurrentSubAccount(client).bank = getPlayerCurrentSubAccount(client).bank - amount;
	givePlayerCash(client, amount);

	messagePlayerSuccess(client, getLocaleString(client, "BankMoneyWithdrawn", `{ALTCOLOUR}${getCurrencyString(amount)}{MAINCOLOUR}`));
}

// ===========================================================================

function bankDepositCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!isPlayerAtBank(client)) {
		messagePlayerError(client, getLocaleString(client, "NotAtBank"));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
		return false;
	}

	let amount = toInteger(params);

	if (amount < 0) {
		messagePlayerError(client, getLocaleString(client, "CantUseNegative"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).cash < amount) {
		messagePlayerError(client, getLocaleString(client, "NotEnoughCashNeedAmountMore", `{ALTCOLOUR}${getCurrencyString(amount - getPlayerCurrentSubAccount(client).cash)}{MAINCOLOUR}`));
		return false;
	}

	getPlayerCurrentSubAccount(client).bank = getPlayerCurrentSubAccount(client).bank + amount;
	takePlayerCash(client, amount);

	messagePlayerSuccess(client, getLocaleString(client, "BankMoneyDeposited", `{ALTCOLOUR}${getCurrencyString(amount)}{MAINCOLOUR}`));
}

// ===========================================================================

function bankBalanceCommand(command, params, client) {
	if (!isPlayerAtBank(client)) {
		messagePlayerError(client, getLocaleString(client, "NotAtBank"));
		return false;
	}

	messagePlayerInfo(client, getLocaleString(client, "BankBalance", `{ALTCOLOUR}${getCurrencyString(getPlayerCurrentSubAccount(client).bank)}{MAINCOLOUR}`));
}

// ===========================================================================