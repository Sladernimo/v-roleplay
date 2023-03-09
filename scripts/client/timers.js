// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: timers.js
// DESC: Provides timer functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let localPlayerMoneyInterval = null;

// ===========================================================================

function initTimersScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Timers]: Initializing timer script ...");
	logToConsole(LOG_DEBUG, "[V.RP.Timers]: Timers script initialized!");
}

// ===========================================================================

function initTimers() {
	localPlayerMoneyInterval = setInterval(updateLocalPlayerMoney, 1000 * 5);
}

// ===========================================================================