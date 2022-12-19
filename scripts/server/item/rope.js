// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: handcuff.js
// DESC: Provides features and usage for the handcuff item type
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

function isPlayerTied(client) {
	return (getPlayerData(client).pedState == V_PEDSTATE_BINDED);
}

// ===========================================================================

function ropeTiePlayer(client) {
	getPlayerData(client).pedState = V_PEDSTATE_BINDED;
	setPlayerControlState(client, false);
}

// ===========================================================================

function ropeUnTiePlayer(client) {
	getPlayerData(client).pedState = V_PEDSTATE_READY;
	setPlayerControlState(client, true);
}

// ===========================================================================