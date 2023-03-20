// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: economy.js
// DESC: Provides economy/financial utils, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initEconomyScript() {
	logToConsole(LOG_INFO, "[V.RP.Economy]: Initializing economy script ...");
	logToConsole(LOG_INFO, "[V.RP.Economy]: Economy script initialized successfully!");
}

// ===========================================================================

function getTimeDisplayUntilPlayerPayDay(client) {
	return getTimeDifferenceDisplay(sdl.ticks - getPlayerData(client).payDayTickStart);
}

// ===========================================================================

function applyServerInflationMultiplier(value) {
	return toInteger(Math.round(value * getServerConfig().economy.inflationMultiplier))
}

// ===========================================================================

function applyIncomeInflationMultiplier(value) {
	return toInteger(Math.round(value * getServerConfig().economy.incomeInflationMultiplier))
}

// ===========================================================================

function playerPayDay(client) {
	let wealth = calculateWealth(client);
	let grossIncome = getPlayerCurrentSubAccount(client).payDayAmount;

	// Passive income
	grossIncome = Math.round(grossIncome + getServerConfig().economy.passiveIncomePerPayDay);

	// Job Pay
	if (getPlayerJob(client) != -1) {
		if (!getJobRankData(getPlayerJob(client), getPlayerJobRank(client))) {
			grossIncome = grossIncome + 0;
		} else {
			grossIncome = Math.round(grossIncome + getJobRankData(getPlayerJob(client), getPlayerJobRank(client)).pay);
		}
	}

	// Payday bonus
	grossIncome = Math.round(grossIncome * getServerConfig().economy.grossIncomeMultiplier);

	// Double bonus
	if (isDoubleBonusActive()) {
		grossIncome = Math.round(grossIncome * 2);
	}

	let incomeTaxAmount = Math.round(calculateIncomeTax(wealth));
	let fineAmount = Math.round(getPlayerCurrentSubAccount(client).fineAmount) || 0;

	let netIncome = Math.round(grossIncome - incomeTaxAmount - fineAmount);
	netIncome = applyIncomeInflationMultiplier(netIncome);

	messagePlayerAlert(client, "== Payday! =============================");
	messagePlayerInfo(client, `Paycheck: {ALTCOLOUR}${getCurrencyString(grossIncome)}`);
	messagePlayerInfo(client, `Taxes: {ALTCOLOUR}${getCurrencyString(incomeTaxAmount)}`);

	if (fineAmount > 0) {
		messagePlayerInfo(client, `Fines: {ALTCOLOUR}${getCurrencyString(fineAmount)}`);
	}

	messagePlayerInfo(client, `You receive: {ALTCOLOUR}${getCurrencyString(netIncome)}`);
	if (netIncome < incomeTaxAmount) {
		let totalCash = getPlayerCurrentSubAccount(client);
		let canPayNow = totalCash + netIncome;
		if (incomeTaxAmount <= canPayNow) {
			takePlayerCash(client, canPayNow);
			messagePlayerInfo(client, `{orange}${getLocaleString(client, "RemainingTaxPaidInMoney", `{ALTCOLOUR}${getCurrencyString(canPayNow)}{MAINCOLOUR}`)}`);
			messagePlayerAlert(client, `{orange}${getLocaleString(client, "LostMoneyFromTaxes")}`);
			messagePlayerAlert(client, `{orange}${getLocaleString(client, "NextPaycheckRepossessionWarning")}`);
		} else {
			messagePlayerInfo(client, `{orange}${getLocaleString(client, "NotEnoughMoneyForTax")}`);
			takePlayerCash(client, canPayNow);

			let oldVehicleCount = getAllVehiclesOwnedByPlayer(client).length;
			let oldHouseCount = getAllHousesOwnedByPlayer(client).length;
			let oldBusinessCount = getAllBusinessesOwnedByPlayer(client).length;

			attemptRepossession(client, incomeTaxAmount - canPayNow);

			let newVehicleCount = getAllVehiclesOwnedByPlayer(client).length;
			let newHouseCount = getAllHousesOwnedByPlayer(client).length;
			let newBusinessCount = getAllBusinessesOwnedByPlayer(client).length;
			messagePlayerInfo(client, `{orange}${getLocaleString(client, "AssetsRepossessedForTax", newVehicleCount - oldVehicleCount, newHouseCount - oldHouseCount, newBusinessCount - oldBusinessCount)}`);
		}
	} else {
		givePlayerCash(client, netIncome);
	}

	getPlayerCurrentSubAccount(client).payDayAmount = 0;
	getPlayerCurrentSubAccount(client).fineAmount = 0;
}

// ===========================================================================

function calculateWealth(client) {
	let vehicles = getAllVehiclesOwnedByPlayer(client);
	let houses = getAllHousesOwnedByPlayer(client);
	let businesses = getAllBusinessesOwnedByPlayer(client);

	let vehicleUpKeep = applyServerInflationMultiplier(vehicles.length * getServerConfig().economy.upKeepCosts.upKeepPerVehicle);
	let houseUpKeep = applyServerInflationMultiplier(houses.length * getServerConfig().economy.upKeepCosts.upKeepPerHouse);
	let businessUpKeep = applyServerInflationMultiplier(businesses.length * getServerConfig().economy.upKeepCosts.upKeepPerBusiness);

	return vehicleUpKeep + houseUpKeep + businessUpKeep;
}

// ===========================================================================

function calculateIncomeTax(amount) {
	return amount * getServerConfig().economy.incomeTaxRate;
}

// ===========================================================================

function forcePlayerPayDayCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(params);
	if (!targetClient) {
		messagePlayerError(client, "That player is not connected!");
		return false;
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} gave {ALTCOLOUR}${getPlayerName(targetClient)}{MAINCOLOUR} an instant payday`);
	playerPayDay(targetClient);
}

// ===========================================================================

function taxInfoCommand(command, params, client) {
	let wealth = calculateWealth(client);
	let tax = calculateIncomeTax(wealth);
	messagePlayerInfo(client, getLocaleString(client, "YourTax", `{ALTCOLOUR}${getCurrencyString(tax)}{MAINCOLOUR}`, `{ALTCOLOUR}/help tax{MAINCOLOUR}`));
}

// ===========================================================================

function wealthInfoCommand(command, params, client) {
	let wealth = calculateWealth(client);
	messagePlayerInfo(client, getLocaleString(client, "YourWealth", `{ALTCOLOUR}${getCurrencyString(wealth)}{MAINCOLOUR}`, `{ALTCOLOUR}/help wealth{MAINCOLOUR}`));
}

// ===========================================================================

function attemptRepossession(client, totalToPay) {
	let leftToPay = totalToPay;

	while (leftToPay > 0) {
		let repossessionValue = repossessFirstAsset(client);
		leftToPay = leftToPay - repossessionValue;
	}
	return true;
}

// ===========================================================================

function repossessFirstAsset(client) {
	let vehicles = getAllVehiclesOwnedByPlayer(client);
	if (vehicles.length > 0) {
		deleteVehicle(vehicles[0]);
		return getServerConfig().economy.upKeepCosts.upKeepPerVehicle;
	}

	let houses = getAllHousesOwnedByPlayer(client);
	if (houses.length > 0) {
		deleteHouse(houses[0].index);
		return getServerConfig().economy.upKeepCosts.upKeepPerHouse;
	}

	let businesses = getAllBusinessesOwnedByPlayer(client);
	if (businesses.length > 0) {
		deleteBusiness(businesses[0].index);
		return getServerConfig().economy.upKeepCosts.upKeepPerBusiness;
	}
}

// ===========================================================================

function getAllVehiclesOwnedByPlayer(client) {
	return getServerData().vehicles.filter((v) => v.ownerType == V_VEHOWNER_PLAYER && v.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

function getAllBusinessesOwnedByPlayer(client) {
	return getServerData().businesses.filter((b) => b.ownerType == V_BIZ_OWNER_PLAYER && b.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

function getAllHousesOwnedByPlayer(client) {
	return getServerData().houses.filter((h) => h.ownerType == V_HOUSE_OWNER_PLAYER && h.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

function isDoubleBonusActive() {
	//if (isWeekend()) {
	//	return true;
	//}

	return false;
}

// ===========================================================================

function getCurrencyString(amount) {
	let tempString = getServerConfig().economy.currencyString;
	tempString = tempString.replace("{AMOUNT}", toString(makeLargeNumberReadable(amount)));
	return tempString;
}

// ===========================================================================

function setPassiveIncomeCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, "The amount needs to be a number!");
		return false;
	}

	let amount = toInteger(params);

	if (amount <= 0) {
		messagePlayerError(client, "The amount can't be negative!");
		return false;
	}

	getServerConfig().economy.passiveIncomePerPayDay = amount;
	getServerConfig().needsSaved = true;
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the passive income to {ALTCOLOUR}${getCurrencyString(amount)}`);
}

// ===========================================================================

function setCurrencyStringCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (params.indexOf("{AMOUNT}") == -1) {
		messagePlayerError(client, "The currency text must include {AMOUNT}");
		return false;
	}

	getServerConfig().economy.currencyString = params;
	getServerConfig().needsSaved = true;
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the to currency string to {ALTCOLOUR}${params}. Example: ${getCurrencyString(1000)}`);
}

// ===========================================================================

function setVehicleUpkeepCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, "The amount needs to be a number!");
		return false;
	}

	let amount = toInteger(params);

	if (amount <= 0) {
		messagePlayerError(client, "The amount can't be negative!");
		return false;
	}

	getServerConfig().economy.upKeepCosts.upKeepPerVehicle = amount;
	getServerConfig().needsSaved = true;
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the base upkeep per vehicle to {ALTCOLOUR}${getCurrencyString(amount)}`);
}

// ===========================================================================

function setBusinessUpkeepCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, "The amount needs to be a number!");
		return false;
	}

	let amount = toInteger(params);

	if (amount <= 0) {
		messagePlayerError(client, "The amount can't be negative!");
		return false;
	}

	getServerConfig().economy.upKeepCosts.upKeepPerBusiness = amount;
	getServerConfig().needsSaved = true;
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the base upkeep per business to {ALTCOLOUR}${getCurrencyString(amount)}`);
}

// ===========================================================================

function setHouseUpkeepCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, "The amount needs to be a number!");
		return false;
	}

	let amount = toInteger(params);

	if (amount <= 0) {
		messagePlayerError(client, "The amount can't be negative!");
		return false;
	}

	getServerConfig().economy.upKeepCosts.upKeepPerHouse = amount;
	getServerConfig().needsSaved = true;
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the base upkeep per house to {ALTCOLOUR}${getCurrencyString(amount)}`);
}

// ===========================================================================

function setIncomeTaxCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, "The amount needs to be a number!");
		return false;
	}

	let amount = toInteger(params);

	if (amount <= 0) {
		messagePlayerError(client, "The amount can't be negative!");
		return false;
	}

	getServerConfig().economy.incomeTaxRate = amount / 100;
	getServerConfig().needsSaved = true;
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the income tax rate to {ALTCOLOUR}${amount}%`);
}

// ===========================================================================

function setGrossIncomeMultiplierCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, "The amount needs to be a number!");
		return false;
	}

	let amount = toInteger(params);

	if (amount <= 0) {
		messagePlayerError(client, "The amount can't be negative!");
		return false;
	}

	getServerConfig().economy.grossIncomeMultiplier = amount / 100;
	getServerConfig().needsSaved = true;
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the gross income multiplier to {ALTCOLOUR}${amount}%`);
}

// ===========================================================================

function setInflationMultiplierCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, "The amount needs to be a number!");
		return false;
	}

	let amount = toInteger(params);

	if (amount <= 0) {
		messagePlayerError(client, "The amount can't be negative!");
		return false;
	}

	getServerConfig().economy.inflationMultiplier = amount / 100;
	getServerConfig().needsSaved = true;
	sendAllJobsToPlayer(null);
	sendAllVehiclesToPlayer(null);
	sendAllBusinessesToPlayer(null);
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the server inflation to {ALTCOLOUR}${amount}%`);
}

// ===========================================================================

function setIncomeInflationMultiplierCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (isNaN(params)) {
		messagePlayerError(client, "The amount needs to be a number!");
		return false;
	}

	let amount = toInteger(params);

	if (amount <= 0) {
		messagePlayerError(client, "The amount can't be negative!");
		return false;
	}

	getServerConfig().economy.incomeInflationMultiplier = amount / 100;
	getServerConfig().needsSaved = true;
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the income inflation to {ALTCOLOUR}${amount}%`);
}

// ===========================================================================