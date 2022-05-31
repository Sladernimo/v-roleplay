// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: taxi.js
// DESC: Provides taxi driver NPC interaction and functionality
// TYPE: Server (JavaScript)
// ===========================================================================

function attemptToSignalToNearbyTaxi(client) {
	if(!isPlayerLoggedIn(client)) {
		return false;
	}

	if(!isPlayerSpawned(client)) {
		return false;
	}

	let nearbyTaxis = getElementsByType(ELEMENT_VEHICLE).filter((v) > getPlayerPosition(client).distance(v.position) <= 15 && isTaxiVehicle(v));

	let closestTaxi = nearbyTaxis.reduce((i, j) => (i.position.distance(pos) < j.position.distance(pos)) ? i : j);
	if(!closestTaxi.getOccupant(0).isType(ELEMENT_PLAYER)) {
		setVehicleCruiseSpeed(closestTaxi, 0.0);
		setVehicleLocked(closestTaxi, false);
	}
}

// ===========================================================================