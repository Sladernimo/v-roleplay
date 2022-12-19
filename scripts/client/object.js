// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: object.js
// DESC: Provides object functions and processing
// TYPE: Client (JavaScript)
// ===========================================================================

let movingObject = null;

// ===========================================================================

function startMovingObject(object) {

}

// ===========================================================================

function stopMovingObject(object, save = true) {
	if (save) {
		sendNetworkEventToServer("v.rp.objectSave", object.id, object.position, object.rotation);
	}
}

// ===========================================================================

function isMovingObject() {
	return movingObject != null;
}

// ===========================================================================

function getMovingObject() {
	return movingObject;
}

// ===========================================================================
