// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: handcuff.js
// DESC: Provides features and usage for the handcuff item type
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

function isPlayerTied(client) {
	return (getPlayerData(client).pedState == AGRP_PEDSTATE_BINDED);
}

// ===========================================================================

function ropeTiePlayer(client) {
	getPlayerData(client).pedState = AGRP_PEDSTATE_BINDED;
	setPlayerControlState(client, false);
}

// ===========================================================================

function ropeUnTiePlayer(client) {
	getPlayerData(client).pedState = AGRP_PEDSTATE_READY;
	setPlayerControlState(client, true);
}

// ===========================================================================