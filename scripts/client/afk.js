// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: afk.js
// DESC: Provides AFK detection
// TYPE: Client (JavaScript)
// ===========================================================================

// Init AFK script
function initAFKScript() {
	logToConsole(LOG_DEBUG, "[VRR.AFK]: Initializing AFK script ...");
	logToConsole(LOG_DEBUG, "[VRR.AFK]: AFK script initialized!");
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