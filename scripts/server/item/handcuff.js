// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: handcuff.js
// DESC: Provides features and usage for the handcuff item type
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

function isPlayerHandCuffed(client) {
	return (getPlayerData(client).pedState == VRR_PEDSTATE_BINDED);
}

// ===========================================================================

function handCuffPlayer(client) {
	getPlayerData(client).pedState = VRR_PEDSTATE_BINDED;
	setPlayerControlState(client, false);
}

// ===========================================================================

function unHandCuffPlayer(client) {
	getPlayerData(client).pedState = VRR_PEDSTATE_READY;
	setPlayerControlState(client, true);
}

// ===========================================================================

function isPlayerSurrendered(client) {
	return true; //(getPlayerData(client).pedState == VRR_PEDSTATE_TAZED || getPlayerData(client).pedState == VRR_PEDSTATE_HANDSUP);
}

// ===========================================================================