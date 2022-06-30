// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: bank.js
// DESC: Provides banking functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function isPlayerAtBank(client) {
	if (isPositionAtATM(getPlayerPosition(client))) {
		return true;
	}

	let businessId = getPlayerBusiness(client);
	if (getBusinessData(client) != false) {
		if (getBusinessData(businessId).entranceType == AGRP_BIZ_ENTRANCE_TYPE_BANK) {
			return true;
		}
	}

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