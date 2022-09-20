// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: afk.js
// DESC: Provides AFK detection
// TYPE: Client (JavaScript)
// ===========================================================================

// Init AFK script
function initAFKScript() {
	logToConsole(LOG_DEBUG, "[AGRP.AFK]: Initializing AFK script ...");
	logToConsole(LOG_DEBUG, "[AGRP.AFK]: AFK script initialized!");
}

// ===========================================================================

// Process stuff when game loses focus
function processLostFocusAFK(event) {
	sendServerNewAFKStatus(true);
}

// ===========================================================================

// Process stuff when game gains focus
function processFocusAFK(event) {
	sendServerNewAFKStatus(false);
}

// ===========================================================================