// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: gui.js
// DESC: Provides GUI functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initGUIScript() {
	logToConsole(LOG_INFO, "[AGRP.GUI]: Initializing GUI script ...");
	logToConsole(LOG_INFO, "[AGRP.GUI]: GUI script initialized successfully!");
}

// ===========================================================================

function doesPlayerUseGUI(client) {
	return (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client));
}

// ===========================================================================

function playerToggledGUI(client) {
	toggleAccountGUICommand("gui", "", client);
}

// ===========================================================================