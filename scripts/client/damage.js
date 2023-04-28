// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: chatbox.js
// DESC: Provides extra chatbox features
// TYPE: Client (JavaScript)
// ===========================================================================

let weaponDamageEnabled = {};
let weaponDamageEvent = {};
let weaponDamageMultiplier = 1.0;
let oldHealth = 100;

// ===========================================================================

function initDamageScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Damage]: Initializing damage script ...");
	logToConsole(LOG_INFO, "[V.RP.Damage]: Damage script initialized!");
}

// ===========================================================================

function processLocalPlayerReceivedDamage() {
	if (getGame() != V_GAME_GTA_IV) {
		return false;
	}

	if (godMode == true) {
		oldHealth = 100;
		setLocalPlayerHealth(100);
		return false;
	}

	if (weaponDamageEnabled == false) {
		oldHealth = localPlayer.health;
		return false;
	}

	if (localPlayer.health >= oldHealth) {
		oldHealth = localPlayer.health;
		return false;
	}

	let healthChange = oldHealth - newHealth;
	let fixedDamage = healthChange * weaponDamageMultiplier;
	if (fixedDamage > 0) {
		oldHealth = oldHealth - fixedDamage;
		setLocalPlayerHealth(oldHealth);
	}
}

// ===========================================================================