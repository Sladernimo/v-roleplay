// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: event.js
// DESC: Provides handlers for built in GTAC and Asshat-Gaming created events
// TYPE: Client (JavaScript)
// ===========================================================================

function initEventScript() {
	logToConsole(LOG_DEBUG, "[VRR.Event]: Initializing event script ...");
	addAllEventHandlers();
	logToConsole(LOG_DEBUG, "[VRR.Event]: Event script initialized!");
}

// ===========================================================================

function addAllEventHandlers() {
	bindEventHandler("OnResourceStart", thisResource, onResourceStart);
	bindEventHandler("OnResourceReady", thisResource, onResourceReady);
	bindEventHandler("OnResourceStop", thisResource, onResourceStop);
	addEventHandler("OnProcess", onProcess);
	addEventHandler("OnKeyUp", onKeyUp);
	addEventHandler("OnDrawnHUD", onDrawnHUD);
	addEventHandler("OnPedWasted", onPedWasted);
	addEventHandler("OnElementStreamIn", onElementStreamIn);
	addEventHandler("OnPedEnteredVehicleEx", onPedEnteredVehicle);
	addEventHandler("OnPedExitedVehicleEx", onPedExitedVehicle);
	addEventHandler("OnPedEnteredSphereEx", onPedEnteredSphere);
	addEventHandler("OnPedExitedSphereEx", onPedExitedSphere);
	addEventHandler("OnPedChangeWeapon", onPedChangeWeapon);
	addEventHandler("OnPedInflictDamage", onPedInflictDamage);
	addEventHandler("OnLostFocus", onLostFocus);
	addEventHandler("OnFocus", onFocus);
	addEventHandler("OnCameraProcess", onCameraProcess);
	addEventHandler("OnMouseWheel", onMouseWheel);
	addEventHandler("OnEntityProcess", onEntityProcess);
}

// ===========================================================================

function onResourceStart(event, resource) {
	sendResourceStartedSignalToServer();
	//garbageCollectorInterval = setInterval(collectAllGarbage, 1000*60);
}

// ===========================================================================

function onResourceStop(event, resource) {
	sendResourceStoppedSignalToServer();
}

// ===========================================================================

function onResourceReady(event, resource) {
	sendResourceReadySignalToServer();
}

// ===========================================================================

function onProcess(event, deltaTime) {
	if (localPlayer == null) {
		return false;
	}

	if (!isSpawned) {
		return false;
	}

	processSync();
	processLocalPlayerControlState();
	processLocalPlayerVehicleControlState();
	forceLocalPlayerEquippedWeaponItem();
	processWantedLevelReset();
	processGameSpecifics();
	processNearbyPickups();
	processVehiclePurchasing();
	processVehicleBurning();
	//checkChatBoxAutoHide(); // Will be uncommented on 1.4.0 GTAC update
	//processVehicleFires();

}

// ===========================================================================

function onKeyUp(event, keyCode, scanCode, keyModifiers) {
	processSkinSelectKeyPress(keyCode);
	//processKeyDuringAnimation();
	processGUIKeyPress(keyCode);
	processToggleGUIKeyPress(keyCode);
}

// ===========================================================================

function onDrawnHUD(event) {
	if (!renderHUD) {
		return false;
	}

	if (!localPlayer) {
		return false;
	}

	processSmallGameMessageRendering();
	processScoreBoardRendering();
	processLabelRendering();
	processLogoRendering();
	processItemActionRendering();
	processSkinSelectRendering();
	processNameTagRendering();
	processInteriorLightsRendering();
}

// ===========================================================================

function onPedWasted(event, wastedPed, killerPed, weapon, pedPiece) {
	logToConsole(LOG_DEBUG, `[VRR.Event] Ped ${wastedPed.name} died`);
	wastedPed.clearWeapons();
}

// ===========================================================================

function onElementStreamIn(event, element) {
	syncElementProperties(element);
}

// ===========================================================================

function onPedExitedVehicle(event, ped, vehicle, seat) {
	//logToConsole(LOG_DEBUG, `[VRR.Event] Local player exited vehicle`);
	//sendNetworkEventToServer("agrp.onPlayerExitVehicle", getVehicleForNetworkEvent(vehicle), seat);

	//if (inVehicleSeat) {
	//	parkedVehiclePosition = false;
	//	parkedVehicleHeading = false;
	//}
}

// ===========================================================================

function onPedEnteredVehicle(event, ped, vehicle, seat) {
	logToConsole(LOG_DEBUG, `[VRR.Event] Local player entered vehicle`);
	//sendNetworkEventToServer("agrp.onPlayerEnterVehicle", getVehicleForNetworkEvent(vehicle), seat);

	//if (areServerElementsSupported()) {
	//if(inVehicleSeat == 0) {
	//setVehicleEngine(vehicle, false);
	//if(!inVehicle.engine) {
	//	parkedVehiclePosition = inVehicle.position;
	//	parkedVehicleHeading = inVehicle.heading;
	//}
	//}
	//}
}

// ===========================================================================

function onPedInflictDamage(event, damagedEntity, damagerEntity, weaponId, healthLoss, pedPiece) {
	//let damagerEntityString = (!isNull(damagedEntity)) ? `${damagerEntity.name} (${damagerEntity.name}, ${damagerEntity.type} - ${typeof damagerEntity})` : `Unknown ped`;
	//let damagedEntityString = (!isNull(damagedEntity)) ? `${damagedEntity.name} (${damagedEntity.name}, ${damagedEntity.type} - ${typeof damagedEntity})` : `Unknown ped`;
	//logToConsole(LOG_DEBUG, `[VRR.Event] ${damagerEntityString} damaged ${damagedEntityString}'s '${pedPiece} with weapon ${weaponId}`);
	if (!isNull(damagedEntity) && !isNull(damagerEntity)) {
		if (damagedEntity.isType(ELEMENT_PLAYER)) {
			if (damagedEntity == localPlayer) {
				if (!weaponDamageEnabled[damagerEntity.name]) {
					preventDefaultEventAction(event);
				}
				sendNetworkEventToServer("agrp.weaponDamage", damagerEntity.name, weaponId, pedPiece, healthLoss);
			}
		}
	}
}

// ===========================================================================

function onPedEnteredSphere(event, ped, sphere) {
	if (!isNull(localPlayer) && !isNull(ped)) {
		if (ped == localPlayer) {
			logToConsole(LOG_DEBUG, `[VRR.Event] Local player entered sphere`);
			//if (sphere == jobRouteLocationSphere) {
			//	enteredJobRouteSphere();
			//}
		}
	}
}

// ===========================================================================

function onPedExitedSphere(event, ped, sphere) {
	if (!isNull(localPlayer) && !isNull(ped)) {
		if (ped == localPlayer) {
			logToConsole(LOG_DEBUG, `[VRR.Event] Local player exited sphere`);
		}
	}
}

// ===========================================================================

function onLostFocus(event) {
	processLostFocusAFK();
}

// ===========================================================================

function onFocus(event) {
	processFocusAFK();
}

// ===========================================================================

function onPedChangeWeapon(event, ped, oldWeapon, newWeapon) {

}

// ===========================================================================

function onCameraProcess(event) {

}

// ===========================================================================

function onMouseWheel(event, mouseId, deltaCoordinates, flipped) {
	processMouseWheelForChatBox(mouseId, deltaCoordinates, flipped);
}

// ===========================================================================

function onEntityProcess(event, entity) {

}

// ===========================================================================