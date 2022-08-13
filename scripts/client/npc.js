// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: npc.js
// DESC: Provides NPC functions and processing
// TYPE: Client (JavaScript)
// ===========================================================================

function processNPCMovement(npc) {
	//if(npc.isSyncer == true) {
	if (getEntityData(npc, "agrp.lookAtClosestPlayer") == true) {
		let closestPlayer = getClosestPlayer(getElementPosition(npc.id));
		setPedLookAt(npc, getElementPosition(closestPlayer.id));
	}
	//}
}

// ===========================================================================