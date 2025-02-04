// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
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

let vehiclePurchaseState = V_VEHBUYSTATE_NONE;
let vehiclePurchasing = null;
let vehiclePurchasePosition = null;

let cruiseControlEnabled = false;
let cruiseControlSpeed = 0.0;

let localPlayerVehicleSeat = -1;

// ===========================================================================

function receiveVehicleFromServer(vehicleId, position, model, colour1, colour2, colour3 = 0, colour4 = 0, locked = false, lights = false, engine = false, licensePlate = "") {
	logToConsole(LOG_DEBUG, `[V.RP.Vehicle] Received vehicle ${vehicleId} (${getVehicleNameFromModel(model, getGame())}) from server`);

	if (getGame() != V_GAME_GTA_IV) {
		return false;
	}

	if (getVehicleData(vehicleId) != null) {
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
		//logToConsole(LOG_DEBUG, `[V.RP.Vehicle] Vehicle ${vehicleId} doesn't exist. Adding ...`);
		//let tempVehicleData = new VehicleData(vehicleId, name, position, blipModel, pickupModel);

		//vehicles.push(tempVehicleData);
		//setAllJobDataIndexes();
	}
}

// ===========================================================================

function processVehiclePurchasing() {
	if (vehiclePurchaseState == V_VEHBUYSTATE_TESTDRIVE) {
		if (getLocalPlayerVehicle() == null) {
			vehiclePurchaseState = V_VEHBUYSTATE_EXITVEH;
			sendNetworkEventToServer("v.rp.vehBuyState", V_VEHBUYSTATE_EXITVEH);
			return false;
		} else {
			if (vehiclePurchasing == getLocalPlayerVehicle()) {
				if (getDistance(getLocalPlayerVehicle().position, vehiclePurchasePosition) >= 25) {
					vehiclePurchaseState = V_VEHBUYSTATE_FARENOUGH;
					sendNetworkEventToServer("v.rp.vehBuyState", V_VEHBUYSTATE_FARENOUGH);
				}
			} else {
				vehiclePurchaseState = V_VEHBUYSTATE_WRONGVEH;
				sendNetworkEventToServer("v.rp.vehBuyState", V_VEHBUYSTATE_WRONGVEH);
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

	if (vehicleId != null) {
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
	for (let i in serverData.vehicles) {
		if (serverData.vehicles[i].vehicleId == vehicleId) {
			return serverData.vehicles[i];
		}
	}

	return null;
}

// ===========================================================================

function setAllVehicleDataIndexes() {
	for (let i in serverData.vehicles) {
		serverData.vehicles[i].index = i;
	}
}

// ===========================================================================

function toggleLocalVehicleCruiseControl() {
	if (!localPlayer.vehicle.isSyncer) {
		return false;
	}

	cruiseControlEnabled = !cruiseControlEnabled;
	cruiseControlSpeed = getVehicleSpeed(vehicle);
}

// ===========================================================================

function getVehicleSpeed(vehicle) {
	let matrix = vehicle.matrix;
	let frontSpeed = true;
	let vecMoveSpeed = vehicle.velocity;
	let speed;

	if (frontSpeed) {
		speed = getDotProduct(vecMoveSpeed[0], vecMoveSpeed[1], vecMoveSpeed[2], matrix.getElement(1 * 4 + 0), matrix.getElement(1 * 4 + 1), matrix.getElement(1 * 4 + 2));
	} else {
		speed = getLength(vecMoveSpeed[0], vecMoveSpeed[1], vecMoveSpeed[2]);
	}

	if (getGame() == V_GAME_GTA_IV || getGame() == V_GAME_GTA_IV_EFLC) {
		speed /= 40.0;
	}

	speed = speed * 90;
	speed = Math.abs(speed);

	return speed;
}

// ===========================================================================

function removeVehiclesFromClient() {
	// Need to destroy elements before clearing array

	serverData.vehicles.splice(0);
}

// ===========================================================================

function processLocalPlayerVehicleControlState() {
	if (isGameFeatureSupported("serverElements")) {
		if (localPlayer.vehicle != null) {
			if (doesEntityDataExist(localPlayer.vehicle, "v.rp.engine")) {
				if (getEntityData(localPlayer.vehicle, "v.rp.engine") == false) {
					//setImmediate(function () {
					//	localPlayer.vehicle.engine = false;
					//});

					if (!getEntityData(localPlayer.vehicle, "v.rp.engine")) {
						if (typeof localPlayer.vehicle.velocity != "undefined") {
							localPlayer.vehicle.velocity = toVector3(0.0, 0.0, 0.0);
							localPlayer.vehicle.turnVelocity = toVector3(0.0, 0.0, 0.0);
						}
					}
				}
			}
		}
	}

	if (getLocalPlayerVehicleSeat() != localPlayerVehicleSeat) {
		localPlayerVehicleSeat = getLocalPlayerVehicleSeat();
		sendNetworkEventToServer("v.rp.veh.seat", getLocalPlayerVehicleSeat());
	}
}

// ===========================================================================