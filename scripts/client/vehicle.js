// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: vehicle.js
// DESC: Provides vehicle functions and arrays with data
// TYPE: Client (JavaScript)
// ===========================================================================

function receiveVehicleFromServer(vehicleId, position, model, colour1, colour2, colour3 = 0, colour4 = 0) {
	logToConsole(LOG_DEBUG, `[VRR.Job] Received vehicle ${vehicleId} (${getVehicleNameFromModel(model, getGame())}) from server`);

	if(getGame() == VRR_GAME_GTA_IV) {

	}
}

// ===========================================================================

function processVehiclePurchasing() {
	if(vehiclePurchaseState == VRR_VEHBUYSTATE_TESTDRIVE) {
		if(getLocalPlayerVehicle() == false) {
			vehiclePurchaseState = VRR_VEHBUYSTATE_EXITVEH;
			sendNetworkEventToServer("vrr.vehBuyState", VRR_VEHBUYSTATE_EXITVEH);
			return false;
		} else {
			if(vehiclePurchasing == getLocalPlayerVehicle()) {
				if(getDistance(getLocalPlayerVehicle().position, vehiclePurchasePosition) >= 25) {
					vehiclePurchaseState = VRR_VEHBUYSTATE_FARENOUGH;
					sendNetworkEventToServer("vrr.vehBuyState", VRR_VEHBUYSTATE_FARENOUGH);
				}
			} else {
				vehiclePurchaseState = VRR_VEHBUYSTATE_WRONGVEH;
				sendNetworkEventToServer("vrr.vehBuyState", VRR_VEHBUYSTATE_WRONGVEH);
			}
		}
	}
}

// ===========================================================================

function processVehicleBurning() {
	getElementsByType(ELEMENT_VEHICLE).filter(vehicle => vehicle.isSyncer && vehicle.health < 250).forEach((vehicle) => {
		vehicle.health = 250;
	});
}

// ===========================================================================

function setVehiclePurchaseState(state, vehicleId, position) {
	vehiclePurchaseState = state;

	if(vehicleId != null) {
		vehiclePurchasing = getElementFromId(vehicleId);
	} else {
		vehiclePurchasing = null;
	}

	vehiclePurchasePosition = position;
}

// ===========================================================================