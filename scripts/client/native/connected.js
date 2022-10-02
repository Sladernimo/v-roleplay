// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
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
	if (getGame() == AGRP_GAME_GTA_IV) {
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

function deleteGameElement(elementId, position = toVector3(0.0, 0.0, 0.0)) {
	if (!getElementFromId(elementId).isOwner) {
		return false;
	}

	destroyGameElement(getElementFromId(elementId));
}

// ===========================================================================

function deleteLocalGameElement(element) {
	destroyGameElement(element);
}

// ===========================================================================

function createGameVehicle(modelIndex, position, heading) {
	return game.createVehicle(getGameConfig().vehicles[getGame()][modelIndex][0], position, heading);
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
	if (getGame() == AGRP_GAME_GTA_IV) {
		let blipId = natives.addBlipForCoord(position);
		if (blipId) {
			natives.changeBlipSprite(blipId, blipModel);
			natives.setBlipMarkerLongDistance(blipId, false);
			natives.setBlipAsShortRange(blipId, true);
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
	//getElementFromId(vehicleId).netFlags.sendSync = state;
	getElementFromId(vehicleId).engine = state;
}

// ===========================================================================

function setVehicleLights(vehicleId, state) {
	getElementFromId(vehicleId).lights = state;
}

// ===========================================================================

function repairVehicle(syncId) {
	getVehicleFromSyncId(syncId).fix();
}

// ===========================================================================

function syncVehicleProperties(vehicle) {
	if (doesEntityDataExist(vehicle, "agrp.lights")) {
		let lightStatus = getEntityData(vehicle, "agrp.lights");
		vehicle.lights = lightStatus;
	}

	if (doesEntityDataExist(vehicle, "agrp.invincible")) {
		let invincible = getEntityData(vehicle, "agrp.invincible");
		element.setProofs(invincible, invincible, invincible, invincible, invincible);
	}

	if (doesEntityDataExist(vehicle, "agrp.panelStatus")) {
		let panelsStatus = getEntityData(vehicle, "agrp.panelStatus");
		for (let i in panelsStatus) {
			vehicle.setPanelStatus(i, panelsStatus[i]);
		}
	}

	if (doesEntityDataExist(vehicle, "agrp.wheelStatus")) {
		let wheelsStatus = getEntityData(vehicle, "agrp.wheelStatus");
		for (let i in wheelsStatus) {
			vehicle.setWheelStatus(i, wheelsStatus[i]);
		}
	}

	if (doesEntityDataExist(vehicle, "agrp.lightStatus")) {
		let lightStatus = getEntityData(vehicle, "agrp.lightStatus");
		for (let i in lightStatus) {
			vehicle.setLightStatus(i, lightStatus[i]);
		}
	}

	if (doesEntityDataExist(vehicle, "agrp.suspensionHeight")) {
		let suspensionHeight = getEntityData(vehicle, "agrp.suspensionHeight");
		vehicle.setSuspensionHeight(suspensionHeight);
	}

	if (getGame() == AGRP_GAME_GTA_SA) {
		let allUpgrades = getGameConfig().vehicleUpgrades[getGame()];
		for (let i in allUpgrades) {
			vehicle.removeUpgrade(i);
		}

		if (doesEntityDataExist(vehicle, "agrp.upgrades")) {
			let upgrades = getEntityData(vehicle, "agrp.upgrades");
			for (let i in upgrades) {
				if (upgrades[i] != 0) {
					vehicle.addUpgrade(upgrades[i]);
				}
			}
		}
	}

	if (getGame() == AGRP_GAME_GTA_SA || getGame() == AGRP_GAME_GTA_IV) {
		if (doesEntityDataExist(vehicle, "agrp.livery")) {
			let livery = getEntityData(vehicle, "agrp.livery");
			if (getGame() == AGRP_GAME_GTA_SA) {
				vehicle.setPaintJob(livery);
			} else if (getGame() == AGRP_GAME_GTA_IV) {
				vehicle.livery = livery;
			}
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

function syncCivilianProperties(civilian) {
	if (getGame() == AGRP_GAME_GTA_III) {
		if (doesEntityDataExist(civilian, "agrp.scale")) {
			let scaleFactor = getEntityData(civilian, "agrp.scale");
			let tempMatrix = civilian.matrix;
			tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = civilian.position;
			civilian.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			civilian.position = tempPosition;
		}
	}

	if (getGame() == AGRP_GAME_GTA_SA) {
		if (doesEntityDataExist(civilian, "agrp.fightStyle")) {
			let fightStyle = getEntityData(civilian, "agrp.fightStyle");
			civilian.setFightStyle(fightStyle[0], fightStyle[1]);
		}
	}

	if (getGame() == AGRP_GAME_GTA_III) {
		if (doesEntityDataExist(civilian, "agrp.walkStyle")) {
			let walkStyle = getEntityData(civilian, "agrp.walkStyle");
			civilian.walkStyle = walkStyle;
		}
	}

	if (getGame() == AGRP_GAME_GTA_IV) {
		if (doesEntityDataExist(civilian, "agrp.bodyPropHair")) {
			let bodyPropHair = getEntityData(civilian, "agrp.bodyPropHair");
			civilian.changeBodyProp(0, bodyPropHair[0], bodyPropHair[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropHead")) {
			let bodyPropHead = getEntityData(civilian, "agrp.bodyPropHead");
			civilian.changeBodyProp(1, bodyPropHead[0], bodyPropHead[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropEyes")) {
			let bodyPropEyes = getEntityData(civilian, "agrp.bodyPropEyes");
			civilian.changeBodyProp(1, bodyPropEyes[0], bodyPropEyes[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropLeftHand")) {
			let bodyPropLeftHand = getEntityData(civilian, "agrp.bodyPropLeftHand");
			civilian.changeBodyProp(1, bodyPropLeftHand[0], bodyPropLeftHand[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropRightHand")) {
			let bodyPropRightHand = getEntityData(civilian, "agrp.bodyPropRightHand");
			civilian.changeBodyProp(1, bodyPropRightHand[0], bodyPropRightHand[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropLeftWrist")) {
			let bodyPropLeftWrist = getEntityData(civilian, "agrp.bodyPropLeftWrist");
			civilian.changeBodyProp(1, bodyPropLeftWrist[0], bodyPropLeftWrist[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(civilian, "agrp.bodyPropRightWrist");
			civilian.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(civilian, "agrp.bodyPropRightWrist");
			civilian.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropHip")) {
			let bodyPropHip = getEntityData(civilian, "agrp.bodyPropHip");
			civilian.changeBodyProp(1, bodyPropHip[0], bodyPropHip[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropLeftFoot")) {
			let bodyPropLeftFoot = getEntityData(civilian, "agrp.bodyPropLeftFoot");
			civilian.changeBodyProp(1, bodyPropLeftFoot[0], bodyPropLeftFoot[1]);
		}

		if (doesEntityDataExist(civilian, "agrp.bodyPropRightFoot")) {
			let bodyPropRightFoot = getEntityData(civilian, "agrp.bodyPropRightFoot");
			civilian.changeBodyProp(1, bodyPropRightFoot[0], bodyPropRightFoot[1]);
		}
	}

	if (doesEntityDataExist(civilian, "agrp.anim")) {
		let animData = getEntityData(vehicle, "agrp.anim");
		civilian.addAnimation(animData[0], animData[1]);
	}
}

// ===========================================================================

function preventDefaultEventAction(event) {
	event.preventDefault();
}

// ===========================================================================

function syncPlayerProperties(player) {
	if (getGame() == AGRP_GAME_GTA_III) {
		if (doesEntityDataExist(player, "agrp.scale")) {
			let scaleFactor = getEntityData(player, "agrp.scale");
			let tempMatrix = player.matrix;
			tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = player.position;
			player.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			player.position = tempPosition;
		}
	}

	if (getGame() == AGRP_GAME_GTA_SA) {
		if (doesEntityDataExist(player, "agrp.fightStyle")) {
			let fightStyle = getEntityData(player, "agrp.fightStyle");
			player.setFightStyle(fightStyle[0], fightStyle[1]);
		}
	}

	//if(getGame() == AGRP_GAME_GTA_SA) {
	//    if(doesEntityDataExist(player, "agrp.walkStyle")) {
	//        let walkStyle = getEntityData(player, "agrp.walkStyle");
	//        player.walkStyle = walkStyle;
	//    }
	//}

	if (getGame() == AGRP_GAME_GTA_IV) {
		if (doesEntityDataExist(player, "agrp.bodyPartHair")) {
			let bodyPartHead = getEntityData(player, "agrp.bodyPartHair");
			player.changeBodyPart(0, bodyPartHead[0], bodyPartHair[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPartHead")) {
			let bodyPartHead = getEntityData(player, "agrp.bodyPartHead");
			player.changeBodyPart(1, bodyPartHead[0], bodyPartHead[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPartUpper")) {
			let bodyPartUpper = getEntityData(player, "agrp.bodyPartUpper");
			player.changeBodyPart(1, bodyPartUpper[0], bodyPartUpper[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPartLower")) {
			let bodyPartLower = getEntityData(player, "agrp.bodyPartLower");
			player.changeBodyPart(1, bodyPartLower[0], bodyPartLower[1]);
		}
	}

	if (getGame() == AGRP_GAME_GTA_IV) {
		if (doesEntityDataExist(player, "agrp.bodyPropHair")) {
			let bodyPropHair = getEntityData(player, "agrp.bodyPropHair");
			player.changeBodyProp(0, bodyPropHair[0], bodyPropHair[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropHead")) {
			let bodyPropHead = getEntityData(player, "agrp.bodyPropHead");
			player.changeBodyProp(1, bodyPropHead[0], bodyPropHead[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropEyes")) {
			let bodyPropEyes = getEntityData(player, "agrp.bodyPropEyes");
			player.changeBodyProp(1, bodyPropEyes[0], bodyPropEyes[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropLeftHand")) {
			let bodyPropLeftHand = getEntityData(player, "agrp.bodyPropLeftHand");
			player.changeBodyProp(1, bodyPropLeftHand[0], bodyPropLeftHand[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropRightHand")) {
			let bodyPropRightHand = getEntityData(player, "agrp.bodyPropRightHand");
			player.changeBodyProp(1, bodyPropRightHand[0], bodyPropRightHand[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropLeftWrist")) {
			let bodyPropLeftWrist = getEntityData(player, "agrp.bodyPropLeftWrist");
			player.changeBodyProp(1, bodyPropLeftWrist[0], bodyPropLeftWrist[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(player, "agrp.bodyPropRightWrist");
			player.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(player, "agrp.bodyPropRightWrist");
			player.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropHip")) {
			let bodyPropHip = getEntityData(player, "agrp.bodyPropHip");
			player.changeBodyProp(1, bodyPropHip[0], bodyPropHip[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropLeftFoot")) {
			let bodyPropLeftFoot = getEntityData(player, "agrp.bodyPropLeftFoot");
			player.changeBodyProp(1, bodyPropLeftFoot[0], bodyPropLeftFoot[1]);
		}

		if (doesEntityDataExist(player, "agrp.bodyPropRightFoot")) {
			let bodyPropRightFoot = getEntityData(player, "agrp.bodyPropRightFoot");
			player.changeBodyProp(1, bodyPropRightFoot[0], bodyPropRightFoot[1]);
		}
	}
}

// ===========================================================================

function syncObjectProperties(object) {
	if (getGame() == AGRP_GAME_GTA_III || getGame() == AGRP_GAME_GTA_VC) {
		if (doesEntityDataExist(object, "agrp.scale")) {
			let scaleFactor = getEntityData(object, "agrp.scale");
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
	if (doesEntityDataExist(element, "agrp.interior")) {
		if (typeof element.interior != "undefined") {
			element.interior = getEntityData(element, "agrp.interior");
		}
	}

	switch (element.type) {
		case ELEMENT_VEHICLE:
			syncVehicleProperties(element);
			break;

		case ELEMENT_PED:
			syncCivilianProperties(element);
			break;

		case ELEMENT_PLAYER:
			syncPlayerProperties(element);
			break;

		case ELEMENT_OBJECT:
			syncObjectProperties(element);
			break;

		default:
			break;
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

// ===========================================================================

function openAllGarages() {
	switch (getGame()) {
		case AGRP_GAME_GTA_III:
			for (let i = 0; i <= 26; i++) {
				openGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case AGRP_GAME_GTA_VC:
			for (let i = 0; i <= 32; i++) {
				openGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case AGRP_GAME_GTA_SA:
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
		case AGRP_GAME_GTA_III:
			for (let i = 0; i <= 26; i++) {
				closeGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case AGRP_GAME_GTA_VC:
			for (let i = 0; i <= 32; i++) {
				closeGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case AGRP_GAME_GTA_SA:
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
	if (getGame() == AGRP_GAME_GTA_SA) {
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
	destroyElement(localPlayer);
}

// ===========================================================================