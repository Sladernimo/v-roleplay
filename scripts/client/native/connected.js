// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
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
	if(getGame() == VRR_GAME_GTA_IV) {
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
	if(getElementFromId(elementId) == null) {
		return false;
	}

	if(!getElementFromId(elementId).isSyncer) {
		return false;
	}

	getElementFromId(elementId).position = position;
}

// ===========================================================================

function deleteGameElement(elementId, position) {
	if(!getElementFromId(elementId).isOwner) {
		return false;
	}

	destroyGameElement(getElementFromId(elementId));
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
	for(let i in clients) {
		if(clients[i].index == index) {
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
	for(let i in vehicles) {
		if(getDistance(position, vehicles[i].position) <= range) {
			inRangeVehicles.push(vehicles[i]);
		}
	}
	return inRangeVehicles;
}

// ===========================================================================

function createGameBlip(blipModel, position, name = "") {
	if(getGame() == VRR_GAME_GTA_IV) {
		let blipId = natives.addBlipForCoord(position);
		if(blipId) {
			natives.changeBlipSprite(blipId, blipModel);
			natives.setBlipMarkerLongDistance(blipId, false);
			natives.setBlipAsShortRange(blipId, true);
			natives.changeBlipNameFromAscii(blipId, `${name.substr(0, 24)}${(name.length > 24) ? " ...": ""}`);
			return blipId;
		}
	}

	return -1;
}

// ===========================================================================

function setEntityData(entity, dataName, dataValue, syncToClients = true) {
	if(entity != null) {
		return entity.setData(dataName, dataValue);
	}
}

// ===========================================================================

function setVehicleEngine(vehicleId, state) {
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
	if(doesEntityDataExist(vehicle, "vrr.lights")) {
		let lightStatus = getEntityData(vehicle, "vrr.lights");
		vehicle.lights = lightStatus;
	}

	if(doesEntityDataExist(vehicle, "vrr.invincible")) {
		let invincible = getEntityData(vehicle, "vrr.invincible");
		element.setProofs(invincible, invincible, invincible, invincible, invincible);
	}

	if(doesEntityDataExist(vehicle, "vrr.panelStatus")) {
		let panelsStatus = getEntityData(vehicle, "vrr.panelStatus");
		for(let i in panelsStatus) {
			vehicle.setPanelStatus(i, panelsStatus[i]);
		}
	}

	if(doesEntityDataExist(vehicle, "vrr.wheelStatus")) {
		let wheelsStatus = getEntityData(vehicle, "vrr.wheelStatus");
		for(let i in wheelsStatus) {
			vehicle.setWheelStatus(i, wheelsStatus[i]);
		}
	}

	if(doesEntityDataExist(vehicle, "vrr.lightStatus")) {
		let lightStatus = getEntityData(vehicle, "vrr.lightStatus");
		for(let i in lightStatus) {
			vehicle.setLightStatus(i, lightStatus[i]);
		}
	}

	if(doesEntityDataExist(vehicle, "vrr.suspensionHeight")) {
		let suspensionHeight = getEntityData(vehicle, "vrr.suspensionHeight");
		vehicle.setSuspensionHeight(suspensionHeight);
	}

	if(getGame() == VRR_GAME_GTA_SA) {
		let allUpgrades = getGameConfig().vehicleUpgrades[getGame()];
		for(let i in allUpgrades) {
			vehicle.removeUpgrade(i);
		}

		if(doesEntityDataExist(vehicle, "vrr.upgrades")) {
			let upgrades = getEntityData(vehicle, "vrr.upgrades");
			for(let i in upgrades) {
				if(upgrades[i] != 0) {
					vehicle.addUpgrade(upgrades[i]);
				}
			}
		}
	}

	if(getGame() == VRR_GAME_GTA_SA || getGame() == VRR_GAME_GTA_IV) {
		if(doesEntityDataExist(vehicle, "vrr.livery")) {
			let livery = getEntityData(vehicle, "vrr.livery");
			if(getGame() == VRR_GAME_GTA_SA) {
				vehicle.setPaintJob(livery);
			} else if(getGame() == VRR_GAME_GTA_IV) {
				vehicle.livery = livery;
			}
		}
	}
}

// ===========================================================================

function removeEntityData(entity, dataName) {
	if(entity != null) {
		return entity.removeData(dataName);
	}
	return null;
}

// ===========================================================================

function doesEntityDataExist(entity, dataName) {
	if(entity != null) {
		return (entity.getData(dataName) != null);
	}
	return null;
}

// ===========================================================================

function syncCivilianProperties(civilian) {
	if(getGame() == VRR_GAME_GTA_III) {
		if(doesEntityDataExist(civilian, "vrr.scale")) {
			let scaleFactor = getEntityData(civilian, "vrr.scale");
			let tempMatrix = civilian.matrix;
			tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = civilian.position;
			civilian.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			civilian.position = tempPosition;
		}
	}

	if(getGame() == VRR_GAME_GTA_SA) {
		if(doesEntityDataExist(civilian, "vrr.fightStyle")) {
			let fightStyle = getEntityData(civilian, "vrr.fightStyle");
			civilian.setFightStyle(fightStyle[0], fightStyle[1]);
		}
	}

	if(getGame() == VRR_GAME_GTA_III) {
		if(doesEntityDataExist(civilian, "vrr.walkStyle")) {
			let walkStyle = getEntityData(civilian, "vrr.walkStyle");
			civilian.walkStyle = walkStyle;
		}
	}

	if(getGame() == VRR_GAME_GTA_IV) {
		if(doesEntityDataExist(civilian, "vrr.bodyPropHair")) {
			let bodyPropHair = getEntityData(civilian, "vrr.bodyPropHair");
			civilian.changeBodyProp(0, bodyPropHair[0], bodyPropHair[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropHead")) {
			let bodyPropHead = getEntityData(civilian, "vrr.bodyPropHead");
			civilian.changeBodyProp(1, bodyPropHead[0], bodyPropHead[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropEyes")) {
			let bodyPropEyes = getEntityData(civilian, "vrr.bodyPropEyes");
			civilian.changeBodyProp(1, bodyPropEyes[0], bodyPropEyes[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropLeftHand")) {
			let bodyPropLeftHand = getEntityData(civilian, "vrr.bodyPropLeftHand");
			civilian.changeBodyProp(1, bodyPropLeftHand[0], bodyPropLeftHand[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropRightHand")) {
			let bodyPropRightHand = getEntityData(civilian, "vrr.bodyPropRightHand");
			civilian.changeBodyProp(1, bodyPropRightHand[0], bodyPropRightHand[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropLeftWrist")) {
			let bodyPropLeftWrist = getEntityData(civilian, "vrr.bodyPropLeftWrist");
			civilian.changeBodyProp(1, bodyPropLeftWrist[0], bodyPropLeftWrist[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(civilian, "vrr.bodyPropRightWrist");
			civilian.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(civilian, "vrr.bodyPropRightWrist");
			civilian.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropHip")) {
			let bodyPropHip = getEntityData(civilian, "vrr.bodyPropHip");
			civilian.changeBodyProp(1, bodyPropHip[0], bodyPropHip[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropLeftFoot")) {
			let bodyPropLeftFoot = getEntityData(civilian, "vrr.bodyPropLeftFoot");
			civilian.changeBodyProp(1, bodyPropLeftFoot[0], bodyPropLeftFoot[1]);
		}

		if(doesEntityDataExist(civilian, "vrr.bodyPropRightFoot")) {
			let bodyPropRightFoot = getEntityData(civilian, "vrr.bodyPropRightFoot");
			civilian.changeBodyProp(1, bodyPropRightFoot[0], bodyPropRightFoot[1]);
		}
	}

	if(doesEntityDataExist(civilian, "vrr.anim")) {
		let animData = getEntityData(vehicle, "vrr.anim");
		civilian.addAnimation(animData[0], animData[1]);
	}
}

// ===========================================================================

function preventDefaultEventAction(event) {
	event.preventDefault();
}

// ===========================================================================

function syncPlayerProperties(player) {
	if(getGame() == VRR_GAME_GTA_III) {
		if(doesEntityDataExist(player, "vrr.scale")) {
			let scaleFactor = getEntityData(player, "vrr.scale");
			let tempMatrix = player.matrix;
			tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = player.position;
			player.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			player.position = tempPosition;
		}
	}

	if(getGame() == VRR_GAME_GTA_SA) {
		if(doesEntityDataExist(player, "vrr.fightStyle")) {
			let fightStyle = getEntityData(player, "vrr.fightStyle");
			player.setFightStyle(fightStyle[0], fightStyle[1]);
		}
	}

	//if(getGame() == VRR_GAME_GTA_SA) {
	//    if(doesEntityDataExist(player, "vrr.walkStyle")) {
	//        let walkStyle = getEntityData(player, "vrr.walkStyle");
	//        player.walkStyle = walkStyle;
	//    }
	//}

	if(getGame() == VRR_GAME_GTA_IV) {
		if(doesEntityDataExist(player, "vrr.bodyPartHair")) {
			let bodyPartHead = getEntityData(player, "vrr.bodyPartHair");
			player.changeBodyPart(0, bodyPartHead[0], bodyPartHair[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPartHead")) {
			let bodyPartHead = getEntityData(player, "vrr.bodyPartHead");
			player.changeBodyPart(1, bodyPartHead[0], bodyPartHead[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPartUpper")) {
			let bodyPartUpper = getEntityData(player, "vrr.bodyPartUpper");
			player.changeBodyPart(1, bodyPartUpper[0], bodyPartUpper[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPartLower")) {
			let bodyPartLower = getEntityData(player, "vrr.bodyPartLower");
			player.changeBodyPart(1, bodyPartLower[0], bodyPartLower[1]);
		}
	}

	if(getGame() == VRR_GAME_GTA_IV) {
		if(doesEntityDataExist(player, "vrr.bodyPropHair")) {
			let bodyPropHair = getEntityData(player, "vrr.bodyPropHair");
			player.changeBodyProp(0, bodyPropHair[0], bodyPropHair[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropHead")) {
			let bodyPropHead = getEntityData(player, "vrr.bodyPropHead");
			player.changeBodyProp(1, bodyPropHead[0], bodyPropHead[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropEyes")) {
			let bodyPropEyes = getEntityData(player, "vrr.bodyPropEyes");
			player.changeBodyProp(1, bodyPropEyes[0], bodyPropEyes[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropLeftHand")) {
			let bodyPropLeftHand = getEntityData(player, "vrr.bodyPropLeftHand");
			player.changeBodyProp(1, bodyPropLeftHand[0], bodyPropLeftHand[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropRightHand")) {
			let bodyPropRightHand = getEntityData(player, "vrr.bodyPropRightHand");
			player.changeBodyProp(1, bodyPropRightHand[0], bodyPropRightHand[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropLeftWrist")) {
			let bodyPropLeftWrist = getEntityData(player, "vrr.bodyPropLeftWrist");
			player.changeBodyProp(1, bodyPropLeftWrist[0], bodyPropLeftWrist[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(player, "vrr.bodyPropRightWrist");
			player.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(player, "vrr.bodyPropRightWrist");
			player.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropHip")) {
			let bodyPropHip = getEntityData(player, "vrr.bodyPropHip");
			player.changeBodyProp(1, bodyPropHip[0], bodyPropHip[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropLeftFoot")) {
			let bodyPropLeftFoot = getEntityData(player, "vrr.bodyPropLeftFoot");
			player.changeBodyProp(1, bodyPropLeftFoot[0], bodyPropLeftFoot[1]);
		}

		if(doesEntityDataExist(player, "vrr.bodyPropRightFoot")) {
			let bodyPropRightFoot = getEntityData(player, "vrr.bodyPropRightFoot");
			player.changeBodyProp(1, bodyPropRightFoot[0], bodyPropRightFoot[1]);
		}
	}
}

// ===========================================================================

function syncObjectProperties(object) {
	if(getGame() == VRR_GAME_GTA_III || getGame() == VRR_GAME_GTA_VC) {
		if(doesEntityDataExist(object, "vrr.scale")) {
			let scaleFactor = getEntityData(object, "vrr.scale");
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
	if(doesEntityDataExist(element, "vrr.interior")) {
		if(typeof element.interior != "undefined") {
			element.interior = getEntityData(element, "vrr.interior");
		}
	}

	switch(element.type) {
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
	switch(getGame()) {
		case VRR_GAME_GTA_III:
			for(let i=0;i<=26;i++) {
				openGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case VRR_GAME_GTA_VC:
			for(let i=0;i<=32;i++) {
				openGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case VRR_GAME_GTA_SA:
			for(let i=0;i<=44;i++) {
				openGarage(i);
			}
			break;

		default:
			break;
	}
}

// ===========================================================================

function closeAllGarages() {
	switch(getGame()) {
		case VRR_GAME_GTA_III:
			for(let i=0;i<=26;i++) {
				closeGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case VRR_GAME_GTA_VC:
			for(let i=0;i<=32;i++) {
				closeGarage(i);
				game.NO_SPECIAL_CAMERA_FOR_THIS_GARAGE(i);
			}
			break;

		case VRR_GAME_GTA_SA:
			for(let i=0;i<=44;i++) {
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
	if(getGame() == VRR_GAME_GTA_SA) {
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