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
	return toInteger(Math.round(value * serverConfig.economy.inflationMultiplier))
}

// ===========================================================================

function applyIncomeInflationMultiplier(value) {
	return toInteger(Math.round(value * serverConfig.economy.incomeInflationMultiplier))
}

// ===========================================================================

function playerPayDay(client) {
	let wealth = calculateWealth(client);
	let grossIncome = getPlayerCurrentSubAccount(client).payDayAmount;

	// Passive income
	grossIncome = Math.round(grossIncome + serverConfig.economy.passiveIncomePerPayDay);

	// Job Pay
	if (getPlayerJob(client) != -1) {
		if (!getJobRankData(getPlayerJob(client), getPlayerJobRank(client))) {
			grossIncome = grossIncome + 0;
		} else {
			grossIncome = Math.round(grossIncome + getJobRankData(getPlayerJob(client), getPlayerJobRank(client)).pay);
		}
	}

	// Payday bonus
	grossIncome = Math.round(grossIncome * serverConfig.economy.grossIncomeMultiplier);

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

	let totalCash = getPlayerCurrentSubAccount(client).cash;
	if (incomeTaxAmount > netIncome) {
		let canPayNow = totalCash + netIncome;
		if (canPayNow >= incomeTaxAmount) {
			let payInCash = incomeTaxAmount - netIncome;
			takePlayerCash(client, payInCash);
			messagePlayerInfo(client, `{orange}${getLocaleString(client, "RemainingTaxPaidInMoney", `{ALTCOLOUR}${getCurrencyString(payInCash)}{MAINCOLOUR}`)}`);
			messagePlayerAlert(client, `{orange}${getLocaleString(client, "LostMoneyFromTaxes")}`);
			messagePlayerAlert(client, `{orange}${getLocaleString(client, "NextPaycheckRepossessionWarning")}`);
		} else {
			messagePlayerInfo(client, `{orange}${getLocaleString(client, "NotEnoughMoneyForTax")}`);
			takePlayerCash(client, totalCash);

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

	let vehicleUpKeep = applyServerInflationMultiplier(vehicles.length * serverConfig.economy.upKeepCosts.upKeepPerVehicle);
	let houseUpKeep = applyServerInflationMultiplier(houses.length * serverConfig.economy.upKeepCosts.upKeepPerHouse);
	let businessUpKeep = applyServerInflationMultiplier(businesses.length * serverConfig.economy.upKeepCosts.upKeepPerBusiness);

	return vehicleUpKeep + houseUpKeep + businessUpKeep;
}

// ===========================================================================

function calculateIncomeTax(amount) {
	return amount * serverConfig.economy.incomeTaxRate;
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
		return serverConfig.economy.upKeepCosts.upKeepPerVehicle;
	}

	let houses = getAllHousesOwnedByPlayer(client);
	if (houses.length > 0) {
		deleteHouse(houses[0].index);
		return serverConfig.economy.upKeepCosts.upKeepPerHouse;
	}

	let businesses = getAllBusinessesOwnedByPlayer(client);
	if (businesses.length > 0) {
		deleteBusiness(businesses[0].index);
		return serverConfig.economy.upKeepCosts.upKeepPerBusiness;
	}
}

// ===========================================================================

/**
 * @param {Client} client The player
 * @return {Array.<VehicleData>} Array of vehicles owned by the player
 */
function getAllVehiclesOwnedByPlayer(client) {
	return serverData.vehicles.filter((v) => v.ownerType == V_VEH_OWNER_PLAYER && v.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

/**
 * @param {Client} client The player
 * @return {Array.<BusinessData>} Array of businesses owned by the player
 */
function getAllBusinessesOwnedByPlayer(client) {
	return serverData.businesses.filter((b) => b.ownerType == V_BIZ_OWNER_PLAYER && b.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

/**
 * @param {Client} client The player
 * @return {Array.<HouseData>} Array of houses owned by the player
 */
function getAllHousesOwnedByPlayer(client) {
	return serverData.houses.filter((h) => h.ownerType == V_HOUSE_OWNER_PLAYER && h.ownerId == getPlayerCurrentSubAccount(client).databaseId);
}

// ===========================================================================

/**
 * @param {Number} clanIndex The index of the clan
 * @return {Array.<VehicleData>} Array of vehicles owned by the clan
 */
function getAllVehiclesOwnedByClan(clanIndex) {
	return serverData.vehicles.filter((v) => v.ownerType == V_VEH_OWNER_CLAN && v.ownerId == getClanData(clanIndex).databaseId);
}

// ===========================================================================

/**
 * @param {Number} clanIndex The index of the clan
 * @return {Array.<BusinessData>} Array of businesses owned by the clan
 */
function getAllBusinessesOwnedByClan(clanIndex) {
	return serverData.businesses.filter((b) => b.ownerType == V_BIZ_OWNER_CLAN && b.ownerId == getClanData(clanIndex).databaseId);
}

// ===========================================================================

/**
 * @param {Number} clanIndex The index of the clan
 * @return {Array.<HouseData>} Array of houses owned by the clan
 */
function getAllHousesOwnedByClan(clanIndex) {
	return serverData.houses.filter((h) => h.ownerType == V_HOUSE_OWNER_CLAN && h.ownerId == getClanData(clanIndex).databaseId);
}

// ===========================================================================

/**
 * @param {Number} jobIndex The index of the job
 * @return {Array.<VehicleData>} Array of vehicles owned by the job
 */
function getAllVehiclesOwnedByJob(jobIndex) {
	return serverData.vehicles.filter((v) => v.ownerType == V_VEH_OWNER_JOB && v.ownerId == getJobData(jobIndex).databaseId);
}

// ===========================================================================

/**
 * @param {Number} jobIndex The index of the job
 * @return {Array.<BusinessData>} Array of businesses owned by the job
 */
function getAllBusinessesOwnedByJob(jobIndex) {
	return serverData.businesses.filter((b) => b.ownerType == V_BIZ_OWNER_JOB && b.ownerId == getJobData(jobIndex).databaseId);
}

// ===========================================================================

/**
 * @param {Number} jobIndex The index of the job
 * @return {Array.<HouseData>} Array of houses owned by the job
 */
function getAllHousesOwnedByJob(jobIndex) {
	return serverData.houses.filter((h) => h.ownerType == V_HOUSE_OWNER_JOB && h.ownerId == getJobData(jobIndex).databaseId);
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
	let tempString = serverConfig.economy.currencyString;
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

	serverConfig.economy.passiveIncomePerPayDay = amount;
	serverConfig.needsSaved = true;
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

	serverConfig.economy.currencyString = params;
	serverConfig.needsSaved = true;
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

	serverConfig.economy.upKeepCosts.upKeepPerVehicle = amount;
	serverConfig.needsSaved = true;
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

	serverConfig.economy.upKeepCosts.upKeepPerBusiness = amount;
	serverConfig.needsSaved = true;
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

	serverConfig.economy.upKeepCosts.upKeepPerHouse = amount;
	serverConfig.needsSaved = true;
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

	serverConfig.economy.incomeTaxRate = amount / 100;
	serverConfig.needsSaved = true;
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

	serverConfig.economy.grossIncomeMultiplier = amount / 100;
	serverConfig.needsSaved = true;
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

	serverConfig.economy.inflationMultiplier = amount / 100;
	serverConfig.needsSaved = true;
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

	serverConfig.economy.incomeInflationMultiplier = amount / 100;
	serverConfig.needsSaved = true;
	messageAdmins(`{adminOrange}${client.name}{MAINCOLOUR} set the income inflation to {ALTCOLOUR}${amount}%`);
}

// ===========================================================================