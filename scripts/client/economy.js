// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: economy.js
// DESC: Provides economy functions
// TYPE: Client (JavaScript)
// ===========================================================================

let currencyString = "${AMOUNT}";

// ===========================================================================

function getCurrencyString(amount) {
	let tempString = currencyString;
	tempString = tempString.replace("{AMOUNT}", toString(makeLargeNumberReadable(amount)));
	return tempString;
}

// ===========================================================================

function updateLocalPlayerMoney() {
	if (localPlayer == null) {
		return false;
	}

	if (typeof localPlayer.money != "undefined") {
		localPlayer.money = toInteger(amount);
	}

	if (getGame() == AGRP_GAME_GTA_IV) {
		natives.setMultiplayerHudCash(amount);
	}
}

// ===========================================================================

function setLocalPlayerMoney(amount) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting local player money`);
	localPlayerCash = amount;
	updateLocalPlayerMoney();
}

// ===========================================================================