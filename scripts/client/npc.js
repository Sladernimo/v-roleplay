// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: npc.js
// DESC: Provides NPC functions and processing
// TYPE: Client (JavaScript)
// ===========================================================================

function processNPCMovement(npc) {
	//if(npc.isSyncer == true) {
	if (getEntityData(npc, "v.rp.lookAtClosestPlayer") == true) {
		let closestPlayer = getClosestPlayer(getElementPosition(npc.id));
		setPedLookAt(npc, getElementPosition(closestPlayer.id));
	}
	//}
}

// ===========================================================================