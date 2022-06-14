// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: vehicle.js
// DESC: Provides vehicle functions and arrays with data
// TYPE: Client (JavaScript)
// ===========================================================================

class VehicleData {
	constructor(vehicleId, model, position, heading, colour1, colour2, colour3, colour4, locked, lights, engine, licensePlate) {
		this.index = -1;
		this.vehicleId = vehicleId;
		this.model = model;
		this.position = position;
		this.heading = heading;
		this.colour1 = colour1;
		this.colour2 = colour2;
		this.colour3 = colour3;
		this.colour4 = colour4;
		this.pickupModel = pickupModel;
		this.locked = locked;
		this.lights = lights;
		this.engine = engine;
		this.licensePlate = licensePlate;
		this.ivNetworkId = -1;
	}
}

// ===========================================================================

function receiveVehicleFromServer(vehicleId, position, model, colour1, colour2, colour3 = 0, colour4 = 0, locked = false, lights = false, engine = false, licensePlate = "") {
	logToConsole(LOG_DEBUG, `[VRR.Vehicle] Received vehicle ${vehicleId} (${getVehicleNameFromModel(model, getGame())}) from server`);

	if(getGame() != VRR_GAME_GTA_IV) {
		return false;
	}

	if(getVehicleData(vehicleId) != false) {
		let vehicleData = getVehicleData(vehicleId);
		//vehicleData.position = position;
		//vehicleData.heading = heading;
		//vehicleData.model
		vehicleData.colour1 = colour1;
		vehicleData.colour2 = colour2;
		vehicleData.colour3 = colour3;
		vehicleData.colour4 = colour4;
		vehicleData.engine = engine;
		vehicleData.lights = lights;
		vehicleData.locked = locked;
		vehicleData.licensePlate = "";

		let vehicle = natives.getVehicleFromNetworkId(vehicleId.ivNetworkId);
	} else {
		//logToConsole(LOG_DEBUG, `[VRR.Vehicle] Vehicle ${vehicleId} doesn't exist. Adding ...`);
		//let tempVehicleData = new VehicleData(vehicleId, name, position, blipModel, pickupModel);

		//vehicles.push(tempVehicleData);
		//setAllJobDataIndexes();
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

/**
 * @param {number} vehicleId - The ID of the job (initially provided by server)
 * @return {VehicleData} The vehicle's data (class instance)
 */
 function getVehicleData(vehicleId) {
	for(let i in getServerData().vehicles) {
		if(getServerData().vehicles[i].vehicleId == vehicleId) {
			return getServerData().vehicles[i];
		}
	}

	return false;
}

// ===========================================================================

function setAllVehicleDataIndexes() {
	for(let i in getServerData().vehicles) {
		getServerData().vehicles[i].index = i;
	}
}

// ===========================================================================