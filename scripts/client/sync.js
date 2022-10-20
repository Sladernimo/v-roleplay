// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: sync.js
// DESC: Provides some elements and data sync
// TYPE: Client (JavaScript)
// ===========================================================================

function processSync(event, deltaTime) {
	if (localPlayer != null) {
		if (!areServerElementsSupported()) {
			sendNetworkEventToServer("agrp.plr.pos", (localPlayer.vehicle != null) ? localPlayer.vehicle.position : localPlayer.position);
			sendNetworkEventToServer("agrp.plr.rot", (localPlayer.vehicle != null) ? localPlayer.vehicle.heading : localPlayer.heading);

			//if(localPlayer.vehicle != null) {
			//    sendNetworkEventToServer("agrp.veh.pos", getVehicleForNetworkEvent(localPlayer.vehicle), localPlayer.vehicle.position);
			//    sendNetworkEventToServer("agrp.veh.rot", getVehicleForNetworkEvent(localPlayer.vehicle), localPlayer.vehicle.heading);
			//}
		}

		if (localPlayer.health <= 0) {
			if (!calledDeathEvent) {
				logToConsole(LOG_DEBUG, `Local player died`);
				localPlayer.clearWeapons();
				calledDeathEvent = true;
				sendNetworkEventToServer("agrp.playerDeath");
			}
		}
	}

	if (localPlayer.health <= 0) {
		if (!calledDeathEvent) {
			logToConsole(LOG_DEBUG, `Local player died`);
			localPlayer.clearWeapons();
			calledDeathEvent = true;
			sendNetworkEventToServer("agrp.playerDeath");
		}
	}

	if (streamingRadioElement) {
		//streamingRadio.volume = getStreamingRadioVolumeForPosition(streamingRadio.position);
	}
}

// ===========================================================================

function setVehicleLights(vehicleId, state) {
	if (getGame() == AGRP_GAME_GTA_IV) {
		if (!state) {
			natives.forceCarLights(natives.getVehicleFromNetworkId(vehicleId, 0));
		} else {
			natives.forceCarLights(natives.getVehicleFromNetworkId(vehicleId, 1));
		}
	} else {
		getElementFromId(vehicleId).lights = state;
	}
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

	if (doesEntityDataExist(vehicle, "agrp.lights")) {
		let lightStatus = getEntityData(vehicle, "agrp.lights");
		if (!lightStatus) {
			vehicle.lightStatus = 2;
		} else {
			vehicle.lightStatus = 1;
		}
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

	if (isGameFeatureSupported("vehicleUpgrades")) {
		//let allUpgrades = getGameConfig().vehicleUpgrades[getGame()];
		//for(let i in allUpgrades) {
		//	vehicle.removeUpgrade(i);
		//}

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

function syncCivilianProperties(civilian) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (isGameFeatureSupported("pedScale")) {
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

	if (getGame() == AGRP_GAME_GTA_SA) {
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
		let animationSlot = getEntityData(civilian, "agrp.anim");
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

function syncPlayerProperties(player) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (isGameFeatureSupported("pedScale")) {
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

function syncElementProperties(element) {
	if (!areServerElementsSupported()) {
		return false;
	}

	if (isGameFeatureSupported("interior")) {
		if (doesEntityDataExist(element, "agrp.interior")) {
			if (typeof element.interior != "undefined") {
				element.interior = getEntityData(element, "agrp.interior");
			}
		}
	}

	if (isGameFeatureSupported("toggleCollision")) {
		if (doesEntityDataExist(element, "agrp.collisions")) {
			element.collisionsEnabled = getEntityData(element, "agrp.collisions");
		}
	}

	if (getGame() == AGRP_GAME_MAFIA_ONE) {
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
	if (getGame() == AGRP_GAME_GTA_IV) {

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