// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: event.js
// DESC: Provides handlers for built in GTAC and Asshat-Gaming created events
// TYPE: Client (JavaScript)
// ===========================================================================

function initEventScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Event]: Initializing event script ...");
	addAllEventHandlers();
	logToConsole(LOG_DEBUG, "[V.RP.Event]: Event script initialized!");
}

// ===========================================================================

function addAllEventHandlers() {
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

	if (getGame() <= V_GAME_GTA_SA) {
		if (findResourceByName("v-events") != null) {
			if (findResourceByName("v-events").isStarted) {
				addEventHandler("OnPedEnteredVehicleEx", onPedEnteredVehicle);
				addEventHandler("OnPedExitedVehicleEx", onPedExitedVehicle);
				addEventHandler("OnPedEnteredSphereEx", onPedEnteredSphere);
				addEventHandler("OnPedExitedSphereEx", onPedExitedSphere);
			}
		}
	}

	if (getGame() == V_GAME_MAFIA_ONE) {
		addEventHandler("OnMapLoaded", onMapLoaded);
		addEventHandler("OnPedEnteringVehicle", onPedEnteredVehicle);
		addEventHandler("OnPedExitingVehicle", onPedExitedVehicle);
		addEventHandler("OnPedInflictDamage", onPedHit);
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

		if (getGame() <= V_GAME_GTA_SA) {
			if (findResourceByName("v-events") != null) {
				if (findResourceByName("v-events").isStarted) {
					addEventHandler("OnPedEnteredVehicleEx", onPedEnteredVehicle);
					addEventHandler("OnPedExitedVehicleEx", onPedExitedVehicle);
					addEventHandler("OnPedEnteredSphereEx", onPedEnteredSphere);
					addEventHandler("OnPedExitedSphereEx", onPedExitedSphere);
				}
			}
		}
	}

	if (resource == thisResource) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.Event] onResourceStart called - Sending signal to server`);
		//localPlayerMoneyInterval = setInterval(updateLocalPlayerMoney, 1000 * 5);
		sendResourceStartedSignalToServer();
	}
}

// ===========================================================================

function onResourceStop(event, resource) {
	if (resource == thisResource) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.Event] onResourceStop called - Sending signal to server`);
		sendResourceStoppedSignalToServer();
	}
}

// ===========================================================================

function onResourceReady(event, resource) {
	if (resource == thisResource) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.Event] onResourceReady called - Sending signal to server`);

		setTimeout(function () {
			initClientScripts();
			sendResourceReadySignalToServer();
		}, 500);
	}
}

// ===========================================================================

function onProcess(event, deltaTime) {
	logToConsole(LOG_VERBOSE, `[V.RP.Event] onProcess`);

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
	processPayPhonesDistance();
	processJobRouteLocationDistance();
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
	logToConsole(LOG_VERBOSE, `[V.RP.Event] HUD drawn`);
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
	processCustomHUDRendering();
	processCameraFadeRendering();
	processJobLocationIndicatorRendering();
	processMapChangeWarning();
	processCameraLookFromEyesForAnimation();
}

// ===========================================================================

function onPedWasted(event, wastedPed, killerPed, weapon, pedPiece) {
	logToConsole(LOG_DEBUG, `[V.RP.Event] Ped ${wastedPed.name} died`);
	wastedPed.clearWeapons();
}

// ===========================================================================

function onElementStreamIn(event, element) {
	syncElementProperties(element);
}

// ===========================================================================

function onPedExitedVehicle(event, ped, vehicle, seat) {
	//logToConsole(LOG_DEBUG, `[V.RP.Event] Local player exited vehicle`);
	//sendNetworkEventToServer("v.rp.onPlayerExitVehicle", getVehicleForNetworkEvent(vehicle), seat);

	cruiseControlEnabled = false;
	cruiseControlSpeed = 0.0;

	/*
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
	*/
}

// ===========================================================================

function onPedExitingVehicle(event, ped, vehicle, seat) {
	//logToConsole(LOG_DEBUG, `[V.RP.Event] Local player exited vehicle`);
	//sendNetworkEventToServer("v.rp.onPlayerExitVehicle", getVehicleForNetworkEvent(vehicle), seat);

	if (localPlayer != null) {
		if (ped == localPlayer) {
			cruiseControlEnabled = false;
			cruiseControlSpeed = 0.0;

			sendNetworkEventToServer("v.rp.vehicleSeat", -1);
		}
	}
}

// ===========================================================================

function onPedEnteredVehicle(event, ped, vehicle, seat) {
	logToConsole(LOG_DEBUG, `[V.RP.Event] Ped entered vehicle`);
	//sendNetworkEventToServer("v.rp.onPlayerEnterVehicle", getVehicleForNetworkEvent(vehicle), seat);

	cruiseControlEnabled = false;
	cruiseControlSpeed = 0.0;

	if (localPlayer != null) {
		if (ped == localPlayer) {
			if (areServerElementsSupported()) {
				inVehicle = vehicle;
				inVehicleSeat = seat;
				sendNetworkEventToServer("v.rp.vehicleSeat", seat);
				if (seat == 0) {
					//parkedVehiclePosition = inVehicle.position;
					//parkedVehicleHeading = inVehicle.heading;
					if (doesEntityDataExist(vehicle, "v.rp.server") == true) {
						//setVehicleEngine(vehicle.id, false);
						setVehicleEngine(vehicle.id, getEntityData(vehicle, "v.rp.engine"));
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
	//logToConsole(LOG_DEBUG, `[V.RP.Event] ${damagerEntityString} damaged ${damagedEntityString}'s '${pedPiece} with weapon ${weaponId}`);
	if (!isNull(damagedEntity) && !isNull(damagerEntity)) {
		if (damagedEntity.isType(ELEMENT_PLAYER)) {
			if (damagedEntity == localPlayer) {
				if (!weaponDamageEnabled[damagerEntity.name]) {
					preventDefaultEventAction(event);
				}
				sendNetworkEventToServer("v.rp.weaponDamage", damagerEntity.name, weaponId, pedPiece, healthLoss);
			}
		}
	}
}

// ===========================================================================

function onPedHit(event, hitPed, vec1, vec2, vec3, hitType, damage, bodyPart) {
	logToConsole(LOG_DEBUG, `[V.RP.Event] Ped ${hitPed.id} (${hitPed.name}) hit using type ${hitType}, causing ${damage} to body part ${bodyPart}`);
	event.preventDefault();

	if (!isInRace) {
		let newHealth = localPlayer.health;
		if (hitPed == localPlayer) {
			newHealth = localPlayer.health - (damage * weaponDamageMultiplier);
			if (newHealth < 5) {
				sendNetworkEventToServer("v.rp.death");
			} else {
				localPlayer.health = newHealth;
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

function onMapLoaded(event, mapName) {
	sendNetworkEventToServer("v.rp.mapLoaded", mapName);
}

// ===========================================================================