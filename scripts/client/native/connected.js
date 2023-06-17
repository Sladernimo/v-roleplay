// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: connected.js
// DESC: Provides wrapped natives for GTA Connected and Mafia Connected mods
// TYPE: Server (JavaScript)
// ===========================================================================

let disconnectReasons = [
	"Lost Connection",
	"Disconnected",
	"Unsupported Client",
	"Wrong Game",
	"Incorrect Password",
	"Unsupported Executable",
	"Disconnected",
	"Banned",
	"Failed",
	"Invalid Name",
	"Crashed",
	"Modified Game"
];

// ===========================================================================

function sendNetworkEventToPlayer(networkEvent, client, ...args) {
	triggerNetworkEvent.apply(null, networkEvent, client, args);
}

// ===========================================================================

function getPlayerPosition() {
	return localPlayer.position;
}

// ===========================================================================

function setPlayerPosition(position) {
	if (getGame() == V_GAME_GTA_IV) {
		natives.setCharCoordinates(localPlayer, position);
	} else {
		localPlayer.position = position;
	}
}

// ===========================================================================

function getElementPosition(elementId) {
	return getElementFromId(elementId).position;
}

// ===========================================================================

function getElementHeading(elementId) {
	return getElementFromId(elementId).heading;
}

// ===========================================================================

function setElementPosition(elementId, position) {
	if (getElementFromId(elementId) == null) {
		return false;
	}

	if (!getElementFromId(elementId).isSyncer) {
		return false;
	}

	getElementFromId(elementId).position = position;
}

// ===========================================================================

function setElementInterior(elementId, interior) {
	if (!isGameFeatureSupported("interiorId")) {
		return false;
	}

	if (getElementFromId(elementId) == null) {
		return false;
	}

	getElementFromId(elementId).interior = interior;
}

// ===========================================================================

function deleteGameElement(elementId, position = toVector3(0.0, 0.0, 0.0)) {
	if (getElementFromId(elementId) == null) {
		return false;
	}

	deleteElement(getElementFromId(elementId));
}

// ===========================================================================

function createGameVehicle(modelIndex, position, heading) {
	return game.createVehicle(gameData.vehicles[getGame()][modelIndex][0], position, heading);
}

// ===========================================================================

function addNetworkEventHandler(eventName, handlerFunction) {
	addNetworkHandler(eventName, handlerFunction);
}

// ===========================================================================

function sendNetworkEventToServer(eventName, ...args) {
	let argsArray = [eventName];
	argsArray = argsArray.concat(args);
	triggerNetworkEvent.apply(null, argsArray);
}

// ===========================================================================

function getElementId(element) {
	return element.id;
}

// ===========================================================================

function getClientFromIndex(index) {
	let clients = getClients();
	for (let i in clients) {
		if (clients[i].index == index) {
			return clients[i];
		}
	}
}

// ===========================================================================

function getVehiclesInRange(position, distance) {
	return getElementsByType(ELEMENT_VEHICLE).filter(x => x.player && x.position.distance(position) <= distance);
}

// ===========================================================================

function getClientsInRange(position, distance) {
	return getPlayersInRange(position, distance);
}

// ===========================================================================

function getCiviliansInRange(position, distance) {
	return getElementsByType(ELEMENT_PED).filter(x => !x.isType(ELEMENT_PLAYER) && x.position.distance(position) <= distance);
}

// ===========================================================================

function getPlayersInRange(position, distance) {
	return getClients().filter(x => getPlayerPosition(x).distance(position) <= distance);
}

// ===========================================================================

function getElementsByTypeInRange(elementType, position, distance) {
	return getElementsByType(elementType).filter(x => x.position.distance(position) <= distance);
}

// ===========================================================================

function getClosestCivilian(position) {
	return getElementsByType(ELEMENT_PED).reduce((i, j) => ((i.position.distance(position) <= j.position.distance(position)) ? i : j));
}

// ===========================================================================

function getClosestPlayer(position) {
	return getElementsByType(ELEMENT_PLAYER).reduce((i, j) => ((i.position.distance(position) <= j.position.distance(position)) ? i : j));
}

// ===========================================================================

function is2dPositionOnScreen(pos2d) {
	return pos2d.x >= 0 && pos2d.y >= 0 && pos2d.x <= game.width && pos2d.y <= game.height;
}

// ===========================================================================

function getVehiclesInRange(position, range) {
	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	let inRangeVehicles = [];
	for (let i in vehicles) {
		if (getDistance(position, vehicles[i].position) <= range) {
			inRangeVehicles.push(vehicles[i]);
		}
	}
	return inRangeVehicles;
}

// ===========================================================================

function createGameBlip(blipModel, position, name = "") {
	if (getGame() == V_GAME_GTA_IV) {
		let blipId = natives.addBlipForCoord(position);
		if (blipId) {
			natives.changeBlipSprite(blipId, blipModel);
			//natives.setBlipMarkerLongDistance(blipId, false);
			//natives.setBlipAsShortRange(blipId, true);
			natives.changeBlipNameFromAscii(blipId, `${name.substr(0, 24)}${(name.length > 24) ? " ..." : ""}`);
			return blipId;
		}
	}

	return -1;
}

// ===========================================================================

function setEntityData(entity, dataName, dataValue, syncToClients = true) {
	if (entity != null) {
		return entity.setData(dataName, dataValue);
	}
}

// ===========================================================================

function setVehicleEngine(vehicleId, state) {
	if (getElementFromId(vehicleId) == null) {
		return false;
	}

	if (getGame() != V_GAME_MAFIA_ONE) {
		getElementFromId(vehicleId).engine = state;
	}
}

// ===========================================================================

function setVehicleColours(vehicleId, colour1, colour2, colour3, colour4) {
	if (getElementFromId(vehicleId) == null) {
		return false;
	}

	getElementFromId(vehicleId).colour1 = colour1;
	getElementFromId(vehicleId).colour2 = colour2;

	if (colour3 != -1) {
		getElementFromId(vehicleId).colour3 = colour3;
	}

	if (colour4 != -1) {
		getElementFromId(vehicleId).colour4 = colour4;
	}
}

// ===========================================================================

function setVehicleLock(vehicleId, state) {
	if (getElementFromId(vehicleId) == null) {
		return false;
	}

	//getElementFromId(vehicleId).netFlags.sendSync = state;
	getElementFromId(vehicleId).lockedStatus = (state == false) ? 0 : 2;
}

// ===========================================================================

function setVehicleLights(vehicleId, state) {
	if (getElementFromId(vehicleId) == null) {
		return false;
	}

	getElementFromId(vehicleId).lights = state;
}

// ===========================================================================

function repairVehicle(vehicleId) {
	if (getElementFromId(vehicleId) == null) {
		return false;
	}

	getVehicleFromSyncId(vehicleId).fix();
}

// ===========================================================================

function syncVehicleProperties(vehicle) {
	if (vehicle == null) {
		return false;
	}

	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (doesEntityDataExist(vehicle, "v.rp.colour")) {
		if (doesEntityDataExist(vehicle, "v.rp.colour")) {
			let colours = getEntityData(vehicle, "v.rp.colour");
			setVehicleColours(vehicle.id, colours[0], colours[1], colours[2], colours[3]);
		}
	}

	if (doesEntityDataExist(vehicle, "v.rp.lights")) {
		if (doesEntityDataExist(vehicle, "v.rp.lights")) {
			let lightStatus = getEntityData(vehicle, "v.rp.lights");
			setVehicleLights(vehicle.id, lightStatus);
		}
	}

	if (isGameFeatureSupported("vehicleLock")) {
		if (doesEntityDataExist(vehicle, "v.rp.locked")) {
			let lockStatus = getEntityData(vehicle, "v.rp.locked");
			setVehicleLock(vehicle.id, (lockStatus == false) ? 0 : 2);
		}
	}

	if (doesEntityDataExist(vehicle, "v.rp.hazardLights")) {
		if (doesEntityDataExist(vehicle, "v.rp.hazardLights")) {
			let hazardLightsState = getEntityData(vehicle, "v.rp.hazardLights");
			setVehicleHazardLights(vehicle.id, hazardLightsState);
		}
	}

	if (doesEntityDataExist(vehicle, "v.rp.interiorLight")) {
		if (doesEntityDataExist(vehicle, "v.rp.interiorLight")) {
			let interiorLightState = getEntityData(vehicle, "v.rp.interiorLight");
			setVehicleInteriorLight(vehicle.id, interiorLightState);
		}
	}

	if (isGameFeatureSupported("vehicleUpgrades")) {
		if (doesEntityDataExist(vehicle, "v.rp.upgrades")) {
			setVehicleUpgrades(vehicle.id, getEntityData(vehicle, "v.rp.upgrades"));
		}
	}

	if (getGame() == V_GAME_GTA_SA || getGame() == V_GAME_GTA_IV) {
		if (doesEntityDataExist(vehicle, "v.rp.livery")) {
			let livery = getEntityData(vehicle, "v.rp.livery");
			setVehicleLivery(vehicle.id, livery);
		}
	}
}

// ===========================================================================

function removeEntityData(entity, dataName) {
	if (entity != null) {
		return entity.removeData(dataName);
	}
	return null;
}

// ===========================================================================

function doesEntityDataExist(entity, dataName) {
	if (entity != null) {
		return (entity.getData(dataName) != null);
	}
	return null;
}

// ===========================================================================

function syncPedProperties(ped) {
	if (ped == null) {
		return false;
	}

	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	//if (isGameFeatureSupported("pedArmour")) {
	//	if (doesEntityDataExist(ped, "v.rp.armour")) {
	//		let armour = getEntityData(ped, "v.rp.armour");
	//		ped.armour = armour;
	//	}
	//}

	if (isGameFeatureSupported("pedScale")) {
		if (doesEntityDataExist(ped, "v.rp.scale")) {
			let scaleFactor = getEntityData(ped, "v.rp.scale");
			let tempMatrix = ped.matrix;
			tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = ped.position;
			ped.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			ped.position = tempPosition;
		}
	}

	if (isGameFeatureSupported("pedFightStyle")) {
		if (doesEntityDataExist(ped, "v.rp.fightStyle")) {
			let fightStyle = getEntityData(ped, "v.rp.fightStyle");
			ped.setFightStyle(fightStyle[0], fightStyle[1]);
		}
	}

	if (isGameFeatureSupported("pedWalkStyle")) {
		if (doesEntityDataExist(ped, "v.rp.walkStyle")) {
			let walkStyle = getEntityData(ped, "v.rp.walkStyle");
			ped.walkStyle = walkStyle;
		}
	}

	if (getGame() == V_GAME_GTA_IV) {
		if (doesEntityDataExist(ped, "v.rp.bodyPartHead")) {
			let bodyPartHead = getEntityData(ped, "v.rp.bodyPartHead");
			ped.changeBodyPart(0, bodyPartHead[0], bodyPartHead[1]);
		}

		if (doesEntityDataExist(ped, "v.rp.bodyPartUpper")) {
			let bodyPartUpper = getEntityData(ped, "v.rp.bodyPartUpper");
			ped.changeBodyPart(1, bodyPartUpper[0], bodyPartUpper[1]);
		}

		if (doesEntityDataExist(ped, "v.rp.bodyPartLower")) {
			let bodyPartLower = getEntityData(ped, "v.rp.bodyPartLower");
			ped.changeBodyPart(2, bodyPartLower[0], bodyPartLower[1]);
		}

		if (doesEntityDataExist(ped, "v.rp.bodyPropHead")) {
			let bodyPropHead = getEntityData(ped, "v.rp.bodyPropHead");
			natives.setCharPropIndex(ped, 0, bodyPropHead);
		}
	}

	if (doesEntityDataExist(ped, "v.rp.anim")) {
		let animationSlot = getEntityData(ped, "v.rp.anim");
		let animationData = getAnimationData(animationSlot);
		ped.addAnimation(animationData.groupId, animationData.animId);
	}

	if (doesEntityDataExist(ped, "v.rp.bleeding")) {
		let bleedingState = getEntityData(ped, "v.rp.bleeding");
		ped.bleeding = bleedingState;
	}
}

// ===========================================================================

function preventDefaultEventAction(event) {
	event.preventDefault();
}

// ===========================================================================

function syncObjectProperties(object) {
	if (object == null) {
		return false;
	}

	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (isGameFeatureSupported("objectScale")) {
		if (doesEntityDataExist(object, "v.rp.scale")) {
			let scaleFactor = getEntityData(object, "v.rp.scale");
			let tempMatrix = object.matrix;
			tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = object.position;
			object.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			object.position = tempPosition;
		}
	}
}

// ===========================================================================

function consolePrint(text) {
	console.log(text);
}

// ===========================================================================

function consoleWarn(text) {
	console.warn(text);
}

// ===========================================================================

function consoleError(text) {
	console.error(text);
}

// ===========================================================================

function getPlayerName(client) {
	return client.name;
}

// ===========================================================================

function getGame() {
	return game.game;
}

// ===========================================================================

function getPlayerId(client) {
	return client.index;
}

// ===========================================================================

function syncElementProperties(element) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (isGameFeatureSupported("interiorId")) {
		if (doesEntityDataExist(element, "v.rp.interior")) {
			if (typeof element.interior != "undefined") {
				element.interior = getEntityData(element, "v.rp.interior");
			}
		}
	}

	if (isGameFeatureSupported("toggleCollision")) {
		if (doesEntityDataExist(element, "v.rp.collisions")) {
			element.collisionsEnabled = getEntityData(element, "v.rp.collisions");
		}
	}

	if (getGame() == V_GAME_MAFIA_ONE) {
		switch (element.type) {
			case ELEMENT_VEHICLE:
				syncVehicleProperties(element);
				break;

			case ELEMENT_PED:
			case ELEMENT_PLAYER:
				syncPedProperties(element);
				break;

			default:
				break;
		}
	} else {
		switch (element.type) {
			case ELEMENT_VEHICLE:
				syncVehicleProperties(element);
				break;

			case ELEMENT_PED:
			case ELEMENT_PLAYER:
				syncPedProperties(element);
				break;

			case ELEMENT_OBJECT:
				syncObjectProperties(element);
				break;

			default:
				break;
		}
	}
}

// ===========================================================================

function getPlayerPed(client) {
	return client.player;
}

// ===========================================================================

function getScreenWidth() {
	return game.width;
}

// ===========================================================================

function getScreenHeight() {
	return game.height;
}

// ===========================================================================

function openAllGarages() {
	switch (getGame()) {
		case V_GAME_GTA_III:
			for (let i = 0; i <= 26; i++) {
				openGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case V_GAME_GTA_VC:
			for (let i = 0; i <= 32; i++) {
				openGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case V_GAME_GTA_SA:
			for (let i = 0; i <= 44; i++) {
				openGarage(i);
			}
			break;

		default:
			break;
	}
}

// ===========================================================================

function closeAllGarages() {
	switch (getGame()) {
		case V_GAME_GTA_III:
			for (let i = 0; i <= 26; i++) {
				closeGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case V_GAME_GTA_VC:
			for (let i = 0; i <= 32; i++) {
				closeGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case V_GAME_GTA_SA:
			for (let i = 0; i <= 44; i++) {
				closeGarage(i);
			}
			break;

		default:
			break;
	}
}

// ===========================================================================

function setPedInvincible(ped, state) {
	ped.invincible = state;
}

// ===========================================================================

function setPedLookAt(ped, position) {
	if (getGame() == V_GAME_GTA_SA) {
		ped.lookAt(position, 10000);
		return true;
	} else {
		setElementHeading(ped.id, getHeadingFromPosToPos(getElementPosition(ped.id), position));
	}
}

// ===========================================================================

function setElementHeading(elementId, heading) {
	getElementFromId(elementId).heading = heading;
}

// ===========================================================================

function deleteLocalPlayerPed() {
	destroyGameElement(localPlayer);
}

// ===========================================================================

function setElementCollisionsEnabled(elementId, state) {
	if (getElementFromId(elementId) == null) {
		return false;
	}

	if (!isGameFeatureSupported("toggleCollision")) {
		return false;
	}

	getElementFromId(elementId).collisionsEnabled = state;
}

// ===========================================================================

function getElementCollisionsEnabled(elementId, state) {
	if (getElementFromId(elementId) == null) {
		return false;
	}

	if (!isGameFeatureSupported("toggleCollision")) {
		return false;
	}

	return getElementFromId(elementId).collisionsEnabled;
}

// ===========================================================================

function getLocalPlayerPosition() {
	if (localPlayer.vehicle != null) {
		return localPlayer.vehicle.position;
	}

	return localPlayer.position;
}

// ===========================================================================

function setLocalPlayerPosition(position) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Setting position to ${position.x}, ${position.y}, ${position.z}`);
	if (typeof localPlayer.velocity != "undefined") {
		localPlayer.velocity = toVector3(0.0, 0.0, 0.0);
	}

	if (typeof localPlayer.position != "undefined") {
		localPlayer.position = position;
	}
}

// ===========================================================================

function setLocalPlayerHeading(heading) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Setting heading to ${heading}`);
	if (typeof localPlayer.heading != "undefined") {
		localPlayer.heading = heading;
	}
}

// ===========================================================================

function getLocalPlayerDimension() {
	return localPlayer.dimension;
}

// ===========================================================================

function getEntityData(entity, dataName) {
	if (entity != null) {
		if (entity.getData != null) {
			return entity.getData(dataName);
		}
	}
	return null;
}

// ===========================================================================

function setLocalPlayerBodyPart(bodyPart, model, texture) {
	localPlayer.changeBodyPart(bodyPart, model, texture);
}

// ===========================================================================

function setLocalPlayerPedPartsAndProps(parts, props) {
	for (let i in parts) {
		localPlayer.changeBodyPart(parts[i][0], parts[i][1], parts[i][2]);
	}

	for (let j in props) {
		localPlayer.changeBodyProp(props[j][0], props[j][1]);
	}
}

// ===========================================================================

function setVehicleHazardLights(vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);

	if (vehicle != null) {
		natives.setVehHazardlights(vehicle, state);
	}
}

// ===========================================================================

function setVehicleInteriorLight(vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);

	if (vehicle != null) {
		natives.setVehInteriorlight(vehicle, state);
	}
}


// ===========================================================================

function setVehicleLivery(vehicleId, livery) {
	let vehicle = getElementFromId(vehicleId);

	if (vehicle != null) {
		if (getGame() == V_GAME_GTA_SA) {
			vehicle.setPaintJob(livery);
		} else if (getGame() == V_GAME_GTA_IV) {
			natives.setCarLivery(vehicle, livery);
		}
	}
}

// ===========================================================================

function setVehicleSiren(vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);

	if (vehicle != null) {
		vehicle.siren = state;
	}
}

// ===========================================================================

function setVehicleTaxiLight(vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);

	if (vehicle != null) {
		if (getGame() == V_GAME_GTA_IV) {
			natives.setTaxiLights(vehicle, state);
		} else if (getGame() <= V_GAME_GTA_VC) {

		}
	}
}

// ===========================================================================

function setVehicleUpgrades(vehicleId, upgrades) {
	let vehicle = getElementFromId(vehicleId);

	if (vehicle != null) {
		if (getGame() == V_GAME_GTA_SA) {
			for (let i in upgrades) {
				if (upgrades[i] != 0) {
					vehicle.addUpgrade(upgrades[i]);
				}
			}
		} else if (getGame() == V_GAME_GTA_IV) {
			for (let i = 0; i < upgrades.length; i++) {
				if (upgrades[i] != 0) {
					natives.turnOffVehicleExtra(vehicle, i, !boolToInt(upgrades[i]));
				}
			}
		}
	}
}

// ===========================================================================

function setVehicleAlarm(vehicleId, state) {
	let vehicle = getElementFromId(vehicleId);

	if (vehicle != null) {
		natives.setVehAlarmDuration(vehicle, 9999999);
		natives.setVehAlarm(vehicle, state);
	}
}

// ===========================================================================

function setPedBleeding(pedId, state) {
	let ped = getElementFromId(pedId);

	if (ped != null) {
		if (getGame() <= V_GAME_GTA_VC) {
			ped.bleeding = state;
		} else if (getGame() == V_GAME_GTA_IV) {
			natives.setCharBleeding(ped, state);
		}
	}
}

// ===========================================================================

function makePedEnterVehicle(pedId, vehicleId, seatId) {
	let ped = getElementFromId(pedId);

	if (ped != null) {
		if (getGame() <= V_GAME_GTA_VC) {
			ped.enterVehicle(getElementFromId(vehicleId), (seatId == 0) ? true : false);
		} else if (getGame() == V_GAME_GTA_IV) {
			warpPedIntoVehicle(ped, getElementFromId(vehicleId), seatId);
		} else if (getGame() == V_GAME_MAFIA_ONE) {
			warpPedIntoVehicle(ped, getElementFromId(vehicleId), seatId);
		}
	}
}

// ===========================================================================

function makePedExitVehicle(pedId) {
	let ped = getElementFromId(pedId);

	if (ped != null) {
		if (getGame() <= V_GAME_GTA_VC) {
			ped.exitVehicle();
		} else if (getGame() == V_GAME_GTA_IV) {
			removePedFromVehicle(pedId);
		} else if (getGame() == V_GAME_MAFIA_ONE) {
			removePedFromVehicle(pedId);
		}
	}
}

// ===========================================================================

function setElementHeading(elementId, heading) {
	let element = getElementFromId(elementId);

	element.heading = heading;
}

// ===========================================================================

function isServerScript() {
	return false;
}

// ===========================================================================

function getMultiplayerMod() {
	return (getGame() >= 10) ? V_MPMOD_MAFIAC : V_MPMOD_GTAC;
}

// ===========================================================================

function isGTAIV() {
	return (getGame() == V_GAME_GTA_IV);
}

// ===========================================================================

function getLocalPlayerVehicle() {
	return localPlayer.vehicle;
}