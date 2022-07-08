// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: bank.js
// DESC: Provides banking functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// House Owner Types
const AGRP_BANK_ACCT_OWNER_NONE = 0;					// Not owned
const AGRP_BANK_ACCT_OWNER_PLAYER = 1;				// Owner is a player (character/subaccount)
const AGRP_BANK_ACCT_OWNER_JOB = 2;					// Owned by a job
const AGRP_BANK_ACCT_OWNER_CLAN = 3;					// Owned by a clan
const AGRP_BANK_ACCT_OWNER_FACTION = 4;				// Owned by a faction
const AGRP_BANK_ACCT_OWNER_BIZ = 4;					// Owned by a faction
const AGRP_BANK_ACCT_OWNER_PUBLIC = 5;				// Is a public bank account. Technically not owned. This probably won't be used.

// ===========================================================================

function isPlayerAtBank(client) {
	if (isPositionAtATM(getPlayerPosition(client))) {
		return true;
	}

	let businessId = getPlayerBusiness(client);
	if (getBusinessData(client) != false) {
		if (getBusinessData(businessId).type == AGRP_BIZ_TYPE_BANK) {
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

// ===========================================================================