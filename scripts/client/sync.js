// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: sync.js
// DESC: Provides some elements and data sync
// TYPE: Client (JavaScript)
// ===========================================================================

function processSync(event, deltaTime) {
	if (localPlayer != null) {
		if (!isGameFeatureSupported("serverElements")) {
			sendNetworkEventToServer("v.rp.plr.pos", (localPlayer.vehicle != null) ? localPlayer.vehicle.position : localPlayer.position);
			sendNetworkEventToServer("v.rp.plr.rot", (localPlayer.vehicle != null) ? localPlayer.vehicle.heading : localPlayer.heading);

			//if(localPlayer.vehicle != null) {
			//	sendNetworkEventToServer("v.rp.veh.pos", getVehicleForNetworkEvent(localPlayer.vehicle), localPlayer.vehicle.position);
			//    sendNetworkEventToServer("v.rp.veh.rot", getVehicleForNetworkEvent(localPlayer.vehicle), localPlayer.vehicle.heading);
			//}
		}
	}
}

// ===========================================================================