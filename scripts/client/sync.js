// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: sync.js
// DESC: Provides some elements and data sync
// TYPE: Client (JavaScript)
// ===========================================================================

function processSync(event, deltaTime) {
	if (localPlayer != null) {
		if (!areServerElementsSupported()) {
			sendNetworkEventToServer("v.rp.plr.pos", (localPlayer.vehicle != null) ? localPlayer.vehicle.position : localPlayer.position);
			sendNetworkEventToServer("v.rp.plr.rot", (localPlayer.vehicle != null) ? localPlayer.vehicle.heading : localPlayer.heading);

			//if(localPlayer.vehicle != null) {
			//    sendNetworkEventToServer("v.rp.veh.pos", getVehicleForNetworkEvent(localPlayer.vehicle), localPlayer.vehicle.position);
			//    sendNetworkEventToServer("v.rp.veh.rot", getVehicleForNetworkEvent(localPlayer.vehicle), localPlayer.vehicle.heading);
			//}
		}

		if (localPlayer.health <= 0) {
			if (!calledDeathEvent) {
				logToConsole(LOG_DEBUG, `Local player died`);
				localPlayer.clearWeapons();
				calledDeathEvent = true;
				sendNetworkEventToServer("v.rp.playerDeath");
			}
		}
	}

	if (localPlayer.health <= 0) {
		if (!calledDeathEvent) {
			logToConsole(LOG_DEBUG, `Local player died`);
			localPlayer.clearWeapons();
			calledDeathEvent = true;
			sendNetworkEventToServer("v.rp.playerDeath");
		}
	}

	if (streamingRadioElement) {
		//streamingRadio.volume = getStreamingRadioVolumeForPosition(streamingRadio.position);
	}
}

// ===========================================================================

function setVehicleLights(vehicleId, state) {
	//if (getGame() == V_GAME_GTA_IV) {
	//	if (!state) {
	//		natives.forceCarLights(natives.getVehicleFromNetworkId(vehicleId, 0));
	//	} else {
	//		natives.forceCarLights(natives.getVehicleFromNetworkId(vehicleId, 1));
	//	}
	//} else {
	getElementFromId(vehicleId).lights = state;
	//}
}

// ===========================================================================

function repairVehicle(syncId) {
	getVehicleFromSyncId(syncId).fix();
}

// ===========================================================================

function syncVehicleProperties(vehicle) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (doesEntityDataExist(vehicle, "v.rp.lights")) {
		let lightStatus = getEntityData(vehicle, "v.rp.lights");
		vehicle.lights = lightStatus;
	}

	if (doesEntityDataExist(vehicle, "v.rp.locked")) {
		let lockStatus = getEntityData(vehicle, "v.rp.locked");
		vehicle.locked = lockStatus;
	}

	if (doesEntityDataExist(vehicle, "v.rp.invincible")) {
		let invincible = getEntityData(vehicle, "v.rp.invincible");
		element.setProofs(invincible, invincible, invincible, invincible, invincible);
	}

	if (doesEntityDataExist(vehicle, "v.rp.panelStatus")) {
		let panelsStatus = getEntityData(vehicle, "v.rp.panelStatus");
		for (let i in panelsStatus) {
			vehicle.setPanelStatus(i, panelsStatus[i]);
		}
	}

	if (doesEntityDataExist(vehicle, "v.rp.wheelStatus")) {
		let wheelsStatus = getEntityData(vehicle, "v.rp.wheelStatus");
		for (let i in wheelsStatus) {
			vehicle.setWheelStatus(i, wheelsStatus[i]);
		}
	}

	if (doesEntityDataExist(vehicle, "v.rp.lightStatus")) {
		let lightStatus = getEntityData(vehicle, "v.rp.lightStatus");
		for (let i in lightStatus) {
			vehicle.setLightStatus(i, lightStatus[i]);
		}
	}

	if (doesEntityDataExist(vehicle, "v.rp.suspensionHeight")) {
		let suspensionHeight = getEntityData(vehicle, "v.rp.suspensionHeight");
		vehicle.setSuspensionHeight(suspensionHeight);
	}

	if (isGameFeatureSupported("vehicleUpgrades")) {
		//let allUpgrades = getGameConfig().vehicleUpgrades[getGame()];
		//for(let i in allUpgrades) {
		//	vehicle.removeUpgrade(i);
		//}

		if (doesEntityDataExist(vehicle, "v.rp.upgrades")) {
			let upgrades = getEntityData(vehicle, "v.rp.upgrades");
			for (let i in upgrades) {
				if (upgrades[i] != 0) {
					vehicle.addUpgrade(upgrades[i]);
				}
			}
		}
	}

	if (getGame() == V_GAME_GTA_SA || getGame() == V_GAME_GTA_IV) {
		if (doesEntityDataExist(vehicle, "v.rp.livery")) {
			let livery = getEntityData(vehicle, "v.rp.livery");
			if (getGame() == V_GAME_GTA_SA) {
				vehicle.setPaintJob(livery);
			} else if (getGame() == V_GAME_GTA_IV) {
				vehicle.livery = livery;
			}
		}
	}
}

// ===========================================================================

function syncCivilianProperties(civilian) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (isGameFeatureSupported("pedScale")) {
		if (doesEntityDataExist(civilian, "v.rp.scale")) {
			let scaleFactor = getEntityData(civilian, "v.rp.scale");
			let tempMatrix = civilian.matrix;
			tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = civilian.position;
			civilian.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			civilian.position = tempPosition;
		}
	}

	if (getGame() == V_GAME_GTA_SA) {
		if (doesEntityDataExist(civilian, "v.rp.fightStyle")) {
			let fightStyle = getEntityData(civilian, "v.rp.fightStyle");
			civilian.setFightStyle(fightStyle[0], fightStyle[1]);
		}
	}

	if (getGame() == V_GAME_GTA_SA) {
		if (doesEntityDataExist(civilian, "v.rp.walkStyle")) {
			let walkStyle = getEntityData(civilian, "v.rp.walkStyle");
			civilian.walkStyle = walkStyle;
		}
	}

	if (getGame() == V_GAME_GTA_IV) {
		if (doesEntityDataExist(civilian, "v.rp.bodyPropHair")) {
			let bodyPropHair = getEntityData(civilian, "v.rp.bodyPropHair");
			civilian.changeBodyProp(0, bodyPropHair[0], bodyPropHair[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropHead")) {
			let bodyPropHead = getEntityData(civilian, "v.rp.bodyPropHead");
			civilian.changeBodyProp(1, bodyPropHead[0], bodyPropHead[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropEyes")) {
			let bodyPropEyes = getEntityData(civilian, "v.rp.bodyPropEyes");
			civilian.changeBodyProp(1, bodyPropEyes[0], bodyPropEyes[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropLeftHand")) {
			let bodyPropLeftHand = getEntityData(civilian, "v.rp.bodyPropLeftHand");
			civilian.changeBodyProp(1, bodyPropLeftHand[0], bodyPropLeftHand[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropRightHand")) {
			let bodyPropRightHand = getEntityData(civilian, "v.rp.bodyPropRightHand");
			civilian.changeBodyProp(1, bodyPropRightHand[0], bodyPropRightHand[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropLeftWrist")) {
			let bodyPropLeftWrist = getEntityData(civilian, "v.rp.bodyPropLeftWrist");
			civilian.changeBodyProp(1, bodyPropLeftWrist[0], bodyPropLeftWrist[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(civilian, "v.rp.bodyPropRightWrist");
			civilian.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(civilian, "v.rp.bodyPropRightWrist");
			civilian.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropHip")) {
			let bodyPropHip = getEntityData(civilian, "v.rp.bodyPropHip");
			civilian.changeBodyProp(1, bodyPropHip[0], bodyPropHip[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropLeftFoot")) {
			let bodyPropLeftFoot = getEntityData(civilian, "v.rp.bodyPropLeftFoot");
			civilian.changeBodyProp(1, bodyPropLeftFoot[0], bodyPropLeftFoot[1]);
		}

		if (doesEntityDataExist(civilian, "v.rp.bodyPropRightFoot")) {
			let bodyPropRightFoot = getEntityData(civilian, "v.rp.bodyPropRightFoot");
			civilian.changeBodyProp(1, bodyPropRightFoot[0], bodyPropRightFoot[1]);
		}
	}

	if (doesEntityDataExist(civilian, "v.rp.anim")) {
		let animationSlot = getEntityData(civilian, "v.rp.anim");
		let animationData = getAnimationData(animationSlot);
		civilian.addAnimation(animationData.groupId, animationData.animId);
	}
}

// ===========================================================================

function syncObjectProperties(object) {
	if (!areServerElementsSupported()) {
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

function syncPlayerProperties(player) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (isGameFeatureSupported("pedScale")) {
		if (doesEntityDataExist(player, "v.rp.scale")) {
			let scaleFactor = getEntityData(player, "v.rp.scale");
			let tempMatrix = player.matrix;
			tempMatrix.setScale(toVector3(scaleFactor.x, scaleFactor.y, scaleFactor.z));
			let tempPosition = player.position;
			player.matrix = tempMatrix;
			tempPosition.z += scaleFactor.z;
			player.position = tempPosition;
		}
	}

	if (getGame() == V_GAME_GTA_SA) {
		if (doesEntityDataExist(player, "v.rp.fightStyle")) {
			let fightStyle = getEntityData(player, "v.rp.fightStyle");
			player.setFightStyle(fightStyle[0], fightStyle[1]);
		}
	}

	//if(getGame() == V_GAME_GTA_SA) {
	//    if(doesEntityDataExist(player, "v.rp.walkStyle")) {
	//        let walkStyle = getEntityData(player, "v.rp.walkStyle");
	//        player.walkStyle = walkStyle;
	//    }
	//}

	if (getGame() == V_GAME_GTA_IV) {
		if (doesEntityDataExist(player, "v.rp.bodyPartHair")) {
			let bodyPartHead = getEntityData(player, "v.rp.bodyPartHair");
			player.changeBodyPart(0, bodyPartHead[0], bodyPartHair[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPartHead")) {
			let bodyPartHead = getEntityData(player, "v.rp.bodyPartHead");
			player.changeBodyPart(1, bodyPartHead[0], bodyPartHead[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPartUpper")) {
			let bodyPartUpper = getEntityData(player, "v.rp.bodyPartUpper");
			player.changeBodyPart(1, bodyPartUpper[0], bodyPartUpper[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPartLower")) {
			let bodyPartLower = getEntityData(player, "v.rp.bodyPartLower");
			player.changeBodyPart(1, bodyPartLower[0], bodyPartLower[1]);
		}
	}

	if (getGame() == V_GAME_GTA_IV) {
		if (doesEntityDataExist(player, "v.rp.bodyPropHair")) {
			let bodyPropHair = getEntityData(player, "v.rp.bodyPropHair");
			player.changeBodyProp(0, bodyPropHair[0], bodyPropHair[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropHead")) {
			let bodyPropHead = getEntityData(player, "v.rp.bodyPropHead");
			player.changeBodyProp(1, bodyPropHead[0], bodyPropHead[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropEyes")) {
			let bodyPropEyes = getEntityData(player, "v.rp.bodyPropEyes");
			player.changeBodyProp(1, bodyPropEyes[0], bodyPropEyes[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropLeftHand")) {
			let bodyPropLeftHand = getEntityData(player, "v.rp.bodyPropLeftHand");
			player.changeBodyProp(1, bodyPropLeftHand[0], bodyPropLeftHand[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropRightHand")) {
			let bodyPropRightHand = getEntityData(player, "v.rp.bodyPropRightHand");
			player.changeBodyProp(1, bodyPropRightHand[0], bodyPropRightHand[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropLeftWrist")) {
			let bodyPropLeftWrist = getEntityData(player, "v.rp.bodyPropLeftWrist");
			player.changeBodyProp(1, bodyPropLeftWrist[0], bodyPropLeftWrist[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(player, "v.rp.bodyPropRightWrist");
			player.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropRightWrist")) {
			let bodyPropRightWrist = getEntityData(player, "v.rp.bodyPropRightWrist");
			player.changeBodyProp(1, bodyPropRightWrist[0], bodyPropRightWrist[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropHip")) {
			let bodyPropHip = getEntityData(player, "v.rp.bodyPropHip");
			player.changeBodyProp(1, bodyPropHip[0], bodyPropHip[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropLeftFoot")) {
			let bodyPropLeftFoot = getEntityData(player, "v.rp.bodyPropLeftFoot");
			player.changeBodyProp(1, bodyPropLeftFoot[0], bodyPropLeftFoot[1]);
		}

		if (doesEntityDataExist(player, "v.rp.bodyPropRightFoot")) {
			let bodyPropRightFoot = getEntityData(player, "v.rp.bodyPropRightFoot");
			player.changeBodyProp(1, bodyPropRightFoot[0], bodyPropRightFoot[1]);
		}
	}
}

// ===========================================================================

function syncElementProperties(element) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (isGameFeatureSupported("interior")) {
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
				syncCivilianProperties(element);
				break;

			case ELEMENT_PLAYER:
				syncPlayerProperties(element);
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

}

// ===========================================================================

function receiveHouseFromServer(houseId, entrancePosition, blipModel, pickupModel, hasInterior) {
	if (getGame() == V_GAME_GTA_IV) {

	}
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