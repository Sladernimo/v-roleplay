// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: tazer.js
// DESC: Provides features and usage for the tazer item type
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

function isPlayerTazed(client) {
	return (getPlayerData(client).pedState == VRR_PEDSTATE_TAZED);
}

// ===========================================================================

function tazePlayer(client) {
	getPlayerData(client).pedState = VRR_PEDSTATE_TAZED;
	setPlayerControlState(client, false);

	let animationId = getAnimationFromParams("tazed");
	if(animationId != false) {
		forcePlayerPlayAnimation(client, animationId);
	}

	setTimeout(function() {
		unTazePlayer(client);
		doActionToNearbyPlayers(client, `The tazer effect wears off`);
	}, getGlobalConfig().tazerEffectDuration);
}

// ===========================================================================

function unTazePlayer(client) {
	getPlayerData(client).pedState = VRR_PEDSTATE_READY;

	setPlayerControlState(client, true);
	setPlayerPosition(client, getPlayerData(client).currentAnimationPositionReturnTo);
	makePedStopAnimation(getPlayerData(client).ped);

}

// ===========================================================================