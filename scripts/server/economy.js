// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: economy.js
// DESC: Provides economy/financial utils, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initEconomyScript() {
	logToConsole(LOG_INFO, "[AGRP.Economy]: Initializing economy script ...");
	logToConsole(LOG_INFO, "[AGRP.Economy]: Economy script initialized successfully!");
}

// ===========================================================================

function getTimeDisplayUntilPlayerPayDay(client) {
	return getTimeDifferenceDisplay(sdl.ticks - getPlayerData(client).payDayTickStart);
}

// ===========================================================================

function applyServerInflationMultiplier(value) {
	return toInteger(Math.round(value * getServerConfig().inflationMultiplier))
}

// ===========================================================================

function playerPayDay(client) {
	let wealth = calculateWealth(client);
	let grossIncome = getPlayerData(client).payDayAmount;

	// Passive income
	grossIncome = Math.round(grossIncome + getGlobalConfig().economy.passiveIncomePerPayDay);

	// Payday bonus
	grossIncome = Math.round(grossIncome * getGlobalConfig().economy.grossIncomeMultiplier);

	// Double bonus
	if (isDoubleBonusActive()) {
		grossIncome = Math.round(grossIncome * 2);
	}

	let incomeTaxAmount = Math.round(calculateIncomeTax(wealth));

	let netIncome = Math.round(grossIncome - incomeTaxAmount);

	messagePlayerAlert(client, "== Payday! =============================");
	messagePlayerInfo(client, `Paycheck: {ALTCOLOUR}${getCurrencyString(grossIncome)}`);
	messagePlayerInfo(client, `Taxes: {ALTCOLOUR}${getCurrencyString(incomeTaxAmount)}`);
	messagePlayerInfo(client, `You receive: {ALTCOLOUR}${getCurrencyString(netIncome)}`);
	if (netIncome < incomeTaxAmount) {
		let totalCash = getPlayerCash(client);
		let canPayNow = totalCash + netIncome;
		if (incomeTaxAmount <= canPayNow) {
			takePlayerCash(client, canPayNow);
			messagePlayerInfo(client, `{orange}${getLocaleString(client, "RemainingTaxPaidInCash", `{ALTCOLOUR}${getCurrencyString(canPayNow)}{MAINCOLOUR}`)}`);
			messagePlayerAlert(client, `{orange}${getLocaleString(client, "LostMoneyFromTaxes")}`);
			messagePlayerAlert(client, `{orange}${getLocaleString(client, "NextPaycheckRepossessionWarning")}`);
		} else {
			messagePlayerInfo(client, `{orange}${getLocaleString(client, "NotEnoughCashForTax")}`);
			takePlayerCash(client, canPayNow);

			let vehicleCount = getAllVehiclesOwnedByPlayer(client).length;
			let houseCount = getAllHousesOwnedByPlayer(client).length;
			let businessCount = getAllBusinessesOwnedByPlayer(client).length;

			attemptRepossession(client, incomeTaxAmount - canPayNow);

			let newVehicleCount = getAllVehiclesOwnedByPlayer(client).length;
			let newHouseCount = getAllHousesOwnedByPlayer(client).length;
			let newBusinessCount = getAllBusinessesOwnedByPlayer(client).length;
			messagePlayerInfo(client, `{orange}${getLocaleString(client, "AssetsRepossessedForTaxes", newVehicleCount - vehicleCount, newHouseCount - houseCount, newBusinessCount - businessCount)}`);
		}
	}

	givePlayerCash(client, netIncome);
}

// ===========================================================================

function calculateWealth(client) {
	let vehicles = getAllVehiclesOwnedByPlayer(client);
	let houses = getAllHousesOwnedByPlayer(client);
	let businesses = getAllBusinessesOwnedByPlayer(client);

	let vehicleUpKeep = applyServerInflationMultiplier(vehicles.length * getGlobalConfig().economy.upKeepCosts.upKeepPerVehicle);
	let houseUpKeep = applyServerInflationMultiplier(houses.length * getGlobalConfig().economy.upKeepCosts.upKeepPerHouse);
	let businessUpKeep = applyServerInflationMultiplier(businesses.length * getGlobalConfig().economy.upKeepCosts.upKeepPerBusiness);

	return vehicleUpKeep + houseUpKeep + businessUpKeep;
}

// ===========================================================================

function calculateIncomeTax(amount) {
	return amount * getGlobalConfig().economy.incomeTaxRate;
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

function setPayDayBonusMultiplier(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let newMultiplier = params;

	if (isNaN(newMultiplier)) {
		messagePlayerError(client, getLocaleString(client, "AmountNotNumber"));
		return false;
	}

	getGlobalConfig().economy.grossIncomeMultiplier = newMultiplier;

	announceAdminAction(`PaydayBonusSet`, `{adminOrange}${getPlayerName(client)}{MAINCOLOUR}`, `{ALTCOLOUR}${newMultiplier * 100}%{MAINCOLOUR}`);
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
		return getGlobalConfig().economy.upKeepCosts.upKeepPerVehicle;
	}

	let houses = getAllHousesOwnedByPlayer(client);
	if (houses.length > 0) {
		deleteHouse(houses[0].index);
		return getGlobalConfig().economy.upKeepCosts.upKeepPerHouse;
	}

	let businesses = getAllBusinessesOwnedByPlayer(client);
	if (businesses.length > 0) {
		deleteBusiness(businesses[0].index);
		return getGlobalConfig().economy.upKeepCosts.upKeepPerBusiness;
	}
}

// ===========================================================================

function getAllVehiclesOwnedByPlayer(client) {
	return getServerData().vehicles.filter((v) => v.ownerType == AGRP_VEHOWNER_PLAYER && v.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

function getAllBusinessesOwnedByPlayer(client) {
	return getServerData().businesses.filter((b) => b.ownerType == AGRP_BIZ_OWNER_PLAYER && b.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

function getAllHousesOwnedByPlayer(client) {
	return getServerData().houses.filter((h) => h.ownerType == AGRP_HOUSE_OWNER_PLAYER && h.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

function isDoubleBonusActive() {
	if (isWeekend()) {
		return true;
	}

	return false;
}

// ===========================================================================

function getCurrencyString(amount) {
	let tempString = getGlobalConfig().economy.currencyString;
	tempString = tempString.replace("{AMOUNT}", toString(makeLargeNumberReadable(amount)));
	return tempString;
}

// ===========================================================================