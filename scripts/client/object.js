// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
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
		sendNetworkEventToServer("agrp.objectSave", object.id, object.position, object.rotation);
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
