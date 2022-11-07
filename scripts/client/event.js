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
	logToConsole(LOG_DEBUG, "[AGRP.Event]: Initializing event script ...");
	addAllEventHandlers();
	logToConsole(LOG_DEBUG, "[AGRP.Event]: Event script initialized!");
}

// ===========================================================================

function addAllEventHandlers() {
	addEventHandler("OnResourceStart", onResourceStart);
	addEventHandler("OnResourceReady", onResourceReady);
	addEventHandler("OnResourceStop", onResourceStop);
	addEventHandler("OnProcess", onProcess);
	addEventHandler("OnKeyUp", onKeyUp);
	addEventHandler("OnDrawnHUD", onDrawnHUD);
	addEventHandler("OnPedWasted", onPedWasted);
	addEventHandler("OnElementStreamIn", onElementStreamIn);
	addEventHandler("OnPedChangeWeapon", onPedChangeWeapon);
	addEventHandler("OnPedInflictDamage", onPedInflictDamage);
	addEventHandler("OnLostFocus", onLostFocus);
	addEventHandler("OnFocus", onFocus);
	addEventHandler("OnCameraProcess", onCameraProcess);
	addEventHandler("OnMouseWheel", onMouseWheel);
	addEventHandler("OnEntityProcess", onEntityProcess);

	if (findResourceByName("v-events") != null) {
		if (findResourceByName("v-events").isStarted) {
			addEventHandler("OnPedEnteredVehicleEx", onPedEnteredVehicle);
			addEventHandler("OnPedExitedVehicleEx", onPedExitedVehicle);
			addEventHandler("OnPedEnteredSphereEx", onPedEnteredSphere);
			addEventHandler("OnPedExitedSphereEx", onPedExitedSphere);
		}
	}

	if (getGame() == AGRP_GAME_MAFIA_ONE) {
		addEventHandler("OnMapLoaded", onMapLoaded);
	}
}

// ===========================================================================

function onResourceStart(event, resource) {
	if (resource == findResourceByName("v-events")) {
		// Remove and re-add events, in case v-events was loaded after agrp_main
		removeEventHandler("OnPedEnteredVehicleEx");
		removeEventHandler("OnPedExitedVehicleEx");
		removeEventHandler("OnPedEnteredSphereEx");
		removeEventHandler("OnPedExitedSphereEx");

		addEventHandler("OnPedEnteredVehicleEx", onPedEnteredVehicle);
		addEventHandler("OnPedExitedVehicleEx", onPedExitedVehicle);
		addEventHandler("OnPedEnteredSphereEx", onPedEnteredSphere);
		addEventHandler("OnPedExitedSphereEx", onPedExitedSphere);
	}

	if (resource == thisResource) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[AGRP.Event] onResourceStart called - Sending signal to server`);
		garbageCollectorInterval = setInterval(collectAllGarbage, 1000 * 60);
		localPlayerMoneyInterval = setInterval(updateLocalPlayerMoney, 1000 * 5);
		sendResourceStartedSignalToServer();
	}
}

// ===========================================================================

function onResourceStop(event, resource) {
	if (resource == thisResource) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[AGRP.Event] onResourceStop called - Sending signal to server`);
		sendResourceStoppedSignalToServer();
	}
}

// ===========================================================================

function onResourceReady(event, resource) {
	if (resource == thisResource) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[AGRP.Event] onResourceReady called - Sending signal to server`);
		loadLocaleConfig();
		sendResourceReadySignalToServer();
	}
}

// ===========================================================================

function onProcess(event, deltaTime) {
	logToConsole(LOG_VERBOSE, `[AGRP.Event] onProcess`);
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
	processVehicleCruiseControl();
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
	logToConsole(LOG_VERBOSE, `[AGRP.Event] HUD drawn`);
	processMouseCursorRendering();

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
	logToConsole(LOG_DEBUG, `[AGRP.Event] Ped ${wastedPed.name} died`);
	wastedPed.clearWeapons();
}

// ===========================================================================

function onElementStreamIn(event, element) {
	syncElementProperties(element);
}

// ===========================================================================

function onPedExitedVehicle(event, ped, vehicle, seat) {
	//logToConsole(LOG_DEBUG, `[AGRP.Event] Local player exited vehicle`);
	//sendNetworkEventToServer("agrp.onPlayerExitVehicle", getVehicleForNetworkEvent(vehicle), seat);

	cruiseControlEnabled = false;
	cruiseControlSpeed = 0.0;

	if (localPlayer != null) {
		if (ped == localPlayer) {
			if (areServerElementsSupported()) {
				if (inVehicleSeat == 0) {
					//setVehicleEngine(vehicle.id, false);
					//if (!inVehicle.engine) {
					//	parkedVehiclePosition = false;
					//	parkedVehicleHeading = false;
					//}
				}
			}
		}
	}
}

// ===========================================================================

function onPedExitingVehicle(event, ped, vehicle, seat) {
	//logToConsole(LOG_DEBUG, `[AGRP.Event] Local player exited vehicle`);
	//sendNetworkEventToServer("agrp.onPlayerExitVehicle", getVehicleForNetworkEvent(vehicle), seat);

	if (localPlayer != null) {
		if (ped == localPlayer) {
			cruiseControlEnabled = false;
			cruiseControlSpeed = 0.0;
		}
	}
}

// ===========================================================================

function onPedEnteredVehicle(event, ped, vehicle, seat) {
	logToConsole(LOG_DEBUG, `[AGRP.Event] Ped entered vehicle`);
	//sendNetworkEventToServer("agrp.onPlayerEnterVehicle", getVehicleForNetworkEvent(vehicle), seat);

	cruiseControlEnabled = false;
	cruiseControlSpeed = 0.0;

	if (localPlayer != null) {
		if (ped == localPlayer) {
			if (areServerElementsSupported()) {
				if (inVehicleSeat == 0) {
					//parkedVehiclePosition = inVehicle.position;
					//parkedVehicleHeading = inVehicle.heading;
					if (doesEntityDataExist(vehicle, "agrp.server") == true) {
						//setVehicleEngine(vehicle.id, false);
						setVehicleEngine(vehicle.id, getEntityData(vehicle, "agrp.engine"));
						//setLocalPlayerControlState(false, false);
					}
				}
			}
		}
	}
}

// ===========================================================================

function onPedInflictDamage(event, damagedEntity, damagerEntity, weaponId, healthLoss, pedPiece) {
	//let damagerEntityString = (!isNull(damagedEntity)) ? `${damagerEntity.name} (${damagerEntity.name}, ${damagerEntity.type} - ${typeof damagerEntity})` : `Unknown ped`;
	//let damagedEntityString = (!isNull(damagedEntity)) ? `${damagedEntity.name} (${damagedEntity.name}, ${damagedEntity.type} - ${typeof damagedEntity})` : `Unknown ped`;
	//logToConsole(LOG_DEBUG, `[AGRP.Event] ${damagerEntityString} damaged ${damagedEntityString}'s '${pedPiece} with weapon ${weaponId}`);
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
	if (sphere == jobRouteLocationSphere) {
		enteredJobRouteSphere();
	}
}

// ===========================================================================

function onPedExitedSphere(event, ped, sphere) {

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

function onMapLoaded(mapName) {
	sendNetworkEventToServer("agrp.mapLoaded", mapName);
}

// ===========================================================================