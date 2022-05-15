// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: utilities.js
// DESC: Provides util functions and arrays with data
// TYPE: Client (JavaScript)
// ===========================================================================

function setLocalPlayerFrozenState(state) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting frozen state to ${state}`);
	gui.showCursor(state, !state);
}

// ===========================================================================

function setLocalPlayerControlState(controlState, cursorState = false) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting control state to ${controlState} (Cursor: ${cursorState})`);
	controlsEnabled = controlState;
	if(getGame() == VRR_GAME_GTA_III || getGame() == VRR_GAME_GTA_VC) {
		game.SET_PLAYER_CONTROL(game.GET_PLAYER_ID(), boolToInt(controlState));
	} else if(getGame() != VRR_GAME_GTA_IV) {
		setElementCollisionsEnabled(localPlayer, controlState);
		setPedInvincible(localPlayer, true);
	}
}

// ===========================================================================

function fadeLocalCamera(state, time) {
	if(isFadeCameraSupported()) {
		logToConsole(LOG_DEBUG, `[VRR.Utilities] Fading camera ${(state)?"in":"out"} for ${time} seconds`);

		if(isFadeCameraSupported()) {
			game.fadeCamera(state, time);
		}
	}
}

// ===========================================================================

function removeLocalPlayerFromVehicle() {
	localPlayer.removeFromVehicle();
}

// ===========================================================================

function restoreLocalCamera() {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Camera restored`);
	if(isCustomCameraSupported()) {
		game.restoreCamera(true);
	}
};

// ===========================================================================

function clearLocalPlayerOwnedPeds() {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Clearing all self-owned peds ...`);
	clearSelfOwnedPeds();
	logToConsole(LOG_DEBUG, `[VRR.Utilities] All self-owned peds cleared`);
};

// ===========================================================================

function setLocalCameraLookAt(cameraPosition, cameraLookAt) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Set camera to look at [${cameraLookAt.x}, ${cameraLookAt.y}, ${cameraLookAt.z}] from [${cameraPosition.x}, ${cameraPosition.y}, ${cameraPosition.z}]`);
	if(isCustomCameraSupported()) {
		game.setCameraLookAt(cameraPosition, cameraLookAt, true);
	}
}

// ===========================================================================

function setCityAmbienceState(state, clearElements = false) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Ambient civilians and traffic ${(state) ? "enabled" : "disabled"}`);
	game.setTrafficEnabled(state);

	if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
		game.setGenerateCarsAroundCamera(state);
		if(getGame() != VRR_GAME_GTA_SA) {
			game.setCiviliansEnabled(state);
		}

		if(clearElements) {
			clearSelfOwnedPeds();
			clearSelfOwnedVehicles();
		}
	}
}

// ===========================================================================

function runClientCode(code, returnTo) {
	let returnValue = "Nothing";
	try {
		returnValue = eval("(" + code + ")");
	} catch(error) {
		sendNetworkEventToServer("vrr.runCodeFail", returnTo, error.toString());
		return false;
	}
	let returnValueString = returnValue;
	if(returnValue != null && returnValue != undefined) {
		returnValueString = `${returnValue.toString()} (${typeof returnValue})`;
	} else {
		returnValueString = "null/undefined";
	}
	sendNetworkEventToServer("vrr.runCodeSuccess", returnTo, returnValueString);
}

// ===========================================================================

function enterVehicleAsPassenger() {
	if(localPlayer.vehicle == null) {
		let tempVehicle = getClosestVehicle(localPlayer.position);
		if(getGame() != VRR_GAME_GTA_IV) {
			if(tempVehicle != null) {
				localPlayer.enterVehicle(tempVehicle, false);
			}
		} else {
			// Disable for now. GTA IV has built-in passenger entry

			//for(let i = 0 ; i <= natives.getMaximumNumberOfPassengers(tempVehicle); i++) {
			//    if(natives.isCarPassengerSeatFree(tempVehicle, i)) {
			//        natives.taskEnterCarAsPassenger(localPlayer, tempVehicle, i, 10000);
			//    }
			//}
		}
	}
}

// ===========================================================================

function giveLocalPlayerWeapon(weaponId, ammo, active) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Giving weapon ${weaponId} with ${ammo} ammo`);
	forceWeapon = weaponId;
	if(getGame() == VRR_GAME_MAFIA_ONE) {
		localPlayer.giveWeapon(weaponId, 0, ammo);
		forceWeaponAmmo = 0;
		forceWeaponClipAmmo = ammo;
	} else {
		localPlayer.giveWeapon(weaponId, ammo, active);
		if(getGame() < VRR_GAME_GTA_IV) {
			forceWeaponAmmo = localPlayer.getWeaponAmmunition(getWeaponSlot(weaponId));
			forceWeaponClipAmmo = localPlayer.getWeaponClipAmmunition(getWeaponSlot(weaponId));
		} else {
			forceWeaponAmmo = ammo;
			forceWeaponClipAmmo = ammo;
		}
	}
}

// ===========================================================================

function clearLocalPlayerWeapons(clearData) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Clearing weapons`);
	localPlayer.clearWeapons();
	if(clearData == true) {
		forceWeapon = 0;
		forceWeaponAmmo = 0;
		forceWeaponClipAmmo = 0;
	}
}

// ===========================================================================

function getClosestVehicle(pos) {
	return getElementsByType(ELEMENT_VEHICLE).reduce((i, j) => (i.position.distance(pos) < j.position.distance(pos)) ? i : j);
}

// ===========================================================================

function setLocalPlayerPosition(position) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting position to ${position.x}, ${position.y}, ${position.z}`);
	if(typeof localPlayer.velocity != "undefined") {
		localPlayer.velocity = toVector3(0.0, 0.0, 0.0);
	}

	if(typeof localPlayer.position != "undefined") {
		localPlayer.position = position;
	}
}

// ===========================================================================

function setLocalPlayerHeading(heading) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting heading to ${heading}`);
	if(typeof localPlayer.heading != "undefined") {
		localPlayer.heading = heading;
	}
}

// ===========================================================================

function setLocalPlayerInterior(interior) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting interior to ${interior}`);
	if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
		if(!isGTAIV()) {
			localPlayer.interior = interior;
			game.cameraInterior = interior;
		} //else {
			//if(getGameConfig().mainWorldInterior != interior) {
			//	let interiorId = natives.getInteriorAtCoords(localPlayer.position);
			//	natives.activateInterior(interiorId, true);
			//	natives.loadAllObjectsNow();
			//}
			//let interiorId = natives.getInteriorAtCoords(localPlayer.position);
			//natives.activateInterior(interiorId, true);
		//}
	}

	let vehicles = getElementsByType(ELEMENT_VEHICLE);
	for(let i in vehicles) {
	    if(getEntityData(vehicles[i], "vrr.interior")) {
	        vehicles[i].interior = getEntityData(vehicles[i], "vrr.interior");
	    }
	}
}

// ===========================================================================

function setSnowState(falling, ground) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting falling snow to ${falling} and ground snow to ${ground}`);
	snowing = falling;
	if(ground) {
		forceSnowing(false);
		forceSnowing(ground);
	}
}

// ===========================================================================

function setLocalPlayerHealth(health) {
	localPlayer.health = health;
}

// ===========================================================================

function playPedSpeech(pedName, speechId) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Making ${pedName}'s ped talk (${speechId})`);
	if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
		game.SET_CHAR_SAY(int, int);
	}
}

// ===========================================================================

function clearLocalPedState() {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Clearing local ped state`);
	localPlayer.clearObjective();
}

// ===========================================================================

function getWeaponSlot(weaponId) {
	return getGameConfig().weaponSlots[getGame()][weaponId];
}

// ===========================================================================

function setLocalPlayerDrunkEffect(amount, duration) {
	if(getMultiplayerMod() == VRR_MPMOD_GTAC) {
		logToConsole(LOG_DEBUG, `[VRR.Utilities] Drunk effect set to ${amount} for ${duration} ms`);
		drunkEffectAmount = 0;
		drunkEffectDurationTimer = setInterval(function() {
			drunkEffectAmount = drunkEffectAmount;
			if(drunkEffectAmount > 0) {
				//game.SET_MOTION_BLUR(drunkEffectAmount);
				game.SET_PLAYER_DRUNKENNESS(drunkEffectAmount, duration);
			} else {
				clearInterval(drunkEffectDurationTimer);
				drunkEffectDurationTimer = null;
			}
		}, 1000);
	}
}

// ===========================================================================

function getLocalPlayerVehicleSeat() {
	for(let i = 0 ; i <= 4 ; i++) {
		if(localPlayer.vehicle.getOccupant(i) == localPlayer) {
			return i;
		}
	}
}

// ===========================================================================

function clearSelfOwnedPeds() {
	logToConsole(LOG_DEBUG, `Clearing self-owned peds`);
	getElementsByType(ELEMENT_PED).forEach(function(ped) {
		//if(ped.isOwner) {
			destroyElement(ped);
		//}
	});
}

// ===========================================================================

function clearSelfOwnedVehicles() {
	logToConsole(LOG_DEBUG, `Clearing self-owned vehicles`);
	getElementsByType(ELEMENT_VEHICLE).forEach(function(vehicle) {
		//if(vehicle.isOwner) {
			destroyElement(vehicle);
		//}
	});
}

// ===========================================================================

function setMouseCameraState(state) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] ${(state)?"Enabled":"Disabled"} mouse camera`);
	mouseCameraEnabled = state;
	SetStandardControlsEnabled(!mouseCameraEnabled);
}

// ===========================================================================

function toggleMouseCursor() {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] ${(!gui.cursorEnabled)?"Enabled":"Disabled"} mouse cursor`);
	gui.showCursor(!gui.cursorEnabled, gui.cursorEnabled);
}

// ===========================================================================

function toggleMouseCursor() {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] ${(!gui.cursorEnabled)?"Enabled":"Disabled"} mouse cursor`);
	setMouseCameraState(!mouseCameraEnabled);
}

// ===========================================================================

function setPlayerWeaponDamageEvent(clientName, eventType) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Set ${clientName} damage event type to ${eventType}`);
	weaponDamageEvent[clientName] = eventType;
}

// ===========================================================================

function setPlayerWeaponDamageEnabled(clientName, state) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] ${(state)?"Enabled":"Disabled"} damage from ${clientName}`);
	weaponDamageEnabled[clientName] = state;
}

// ===========================================================================

function setLocalPlayerCash(amount) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting local player money`);
	if(typeof localPlayer.money != "undefined") {
		localPlayer.money = toInteger(amount);
	}

	if(getGame() == VRR_GAME_GTA_IV) {
		natives.setMultiplayerHudCash(amount);
	}
}

// ===========================================================================

function destroyAutoCreatedPickups() {
	if(typeof ELEMENT_PICKUP != "undefined") {
		getElementsByType(ELEMENT_PICKUP).forEach(function(pickup) {
			if(pickup.isOwner) {
				destroyElement(pickup);
			}
		});
	}
}

// ===========================================================================

function processLocalPlayerControlState() {
	if(localPlayer == null) {
		return false;
	}

	if(isSpawned) {
		return false;
	}

	if(!controlsEnabled) {
		clearLocalPedState();
	}
}

// ===========================================================================

function processWantedLevelReset() {
	if(localPlayer == null) {
		return false;
	}

	if(!isSpawned) {
		return false;
	}

	if(typeof localPlayer.wantedLevel != "undefined") {
		localPlayer.wantedLevel = forceWantedLevel;
	}
}

// ===========================================================================

function processLocalPlayerVehicleControlState() {
	if(areServerElementsSupported()) {
		if(inVehicle && localPlayer.vehicle != null) {
			if(doesEntityDataExist(localPlayer.vehicle, "vrr.engine")) {
				if(getEntityData(localPlayer.vehicle, "vrr.engine") == false) {
					localPlayer.vehicle.engine = false;
					if(!localPlayer.vehicle.engine) {
						if(typeof localPlayer.vehicle.velocity != "undefined") {
							localPlayer.vehicle.velocity = toVector3(0.0, 0.0, 0.0);
							localPlayer.vehicle.turnVelocity = toVector3(0.0, 0.0, 0.0);
						}

						//if(parkedVehiclePosition) {
						//	localPlayer.vehicle.position = parkedVehiclePosition;
						//	localPlayer.vehicle.heading = parkedVehicleHeading;
						//}
					}
				}
			}
		}
	}
}

// ===========================================================================

function processLocalPlayerSphereEntryExitHandling() {
	let position = getLocalPlayerPosition();

	if(areMarkersSupported()) {
		getElementsByType(ELEMENT_MARKER).forEach(function(sphere) {
			if(getDistance(position, sphere.position) <= sphere.radius) {
				if(!inSphere) {
					inSphere = sphere;
					triggerEvent("OnLocalPlayerEnterSphere", null, sphere);
				}
			} else {
				if(inSphere) {
					inSphere = false;
					triggerEvent("OnLocalPlayerExitSphere", null, sphere);
				}
			}
		});
	}
}

// ===========================================================================

function processJobRouteSphere() {
	if(getGame() == VRR_GAME_GTA_SA) {
		let position = getLocalPlayerPosition();
		if(jobRouteLocationSphere != null) {
			if(getDistance(position, jobRouteLocationSphere.position) <= 2.0) {
				enteredJobRouteSphere();
			}
		}
	}
}

// ===========================================================================

function forceLocalPlayerEquippedWeaponItem() {
	if(typeof localPlayer.weapon != "undefined") {
		if(forceWeapon != 0) {
			if(localPlayer.weapon != forceWeapon) {
				localPlayer.weapon = forceWeapon;
				if(getGame() < VRR_GAME_GTA_IV) {
					localPlayer.setWeaponClipAmmunition(getWeaponSlot(forceWeapon), forceWeaponClipAmmo);
					localPlayer.setWeaponAmmunition(getWeaponSlot(forceWeapon), forceWeaponAmmo);
				}
			} else {
				//if(getGame() < VRR_GAME_GTA_IV) {
				//	forceWeaponClipAmmo = localPlayer.getWeaponClipAmmunition(getWeaponSlot(forceWeapon));
				//	forceWeaponAmmo = localPlayer.getWeaponAmmunition(getWeaponSlot(forceWeapon));
				//}
			}
		} else {
			if(localPlayer.weapon > 0) {
				localPlayer.clearWeapons();
			}
		}
	}
}

// ===========================================================================

function getLocalPlayerPosition() {
	let position = localPlayer.position;
	if(localPlayer.vehicle) {
		position = localPlayer.vehicle.position;
	}

	return position;
}

// ===========================================================================

function processLocalPlayerVehicleEntryExitHandling() {
	if(localPlayer.vehicle) {
		if(!inVehicle) {
			inVehicle = localPlayer.vehicle;
			inVehicleSeat = getLocalPlayerVehicleSeat();
			triggerEvent("OnLocalPlayerEnteredVehicle", inVehicle, inVehicleSeat);
		}
	} else {
		if(inVehicle) {
			triggerEvent("OnLocalPlayerExitedVehicle", inVehicle, inVehicleSeat);
			inVehicle = false;
			inVehicleSeat = false;
		}
	}
}

// ===========================================================================

function getVehicleForNetworkEvent(vehicle) {
	if(getGame() == VRR_GAME_GTA_IV) {
		return natives.getNetworkIdFromVehicle(vehicle);
	}
	return vehicle.id;
}

// ===========================================================================

function setMinuteDuration(minuteDuration) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Setting minute duration to ${minuteDuration}ms`);

	if(isTimeSupported()) {
		game.time.minuteDuration = minuteDuration;
	}
}

// ===========================================================================

function getStreamingRadioVolumeForPosition(position) {
	return streamingRadioVolume;
}

// ===========================================================================

function getLocalPlayerLookAtPosition() {
	if(localPlayer != null) {
		let centerCameraPos = getWorldFromScreenPosition(toVector3(game.width/2, game.height/2, 0));
		return getWorldFromScreenPosition(toVector3(game.width/2, game.height/2, getDistance(centerCameraPos, localPlayer.position)+20));
	}
}

// ===========================================================================

function processInteriorLightsRendering() {
	if(renderInteriorLights) {
		if(!interiorLightsEnabled) {
			graphics.drawRectangle(null, toVector2(0.0, 0.0), toVector2(game.width, game.height), interiorLightsColour, interiorLightsColour, interiorLightsColour, interiorLightsColour);
		}
	}
}

// ===========================================================================

function getPlayerFromParams(params) {
	let clients = getClients();
	if(isNaN(params)) {
		for(let i in clients) {
			if(!clients[i].console) {
				if(toLowerCase(clients[i].name).indexOf(toLowerCase(params)) != -1) {
					return clients[i];
				}
			}
		}
	} else {
		if(typeof clients[toInteger(params)] != "undefined") {
			return clients[toInteger(params)];
		}
	}

	return false;
}

// ===========================================================================

function processNearbyPickups() {
	if(typeof ELEMENT_PICKUP != "undefined") {
		let pickups = getElementsByType(ELEMENT_PICKUP);
		for(let i in pickups) {
			if(getDistance(pickups[i].position, localPlayer.position) < 5) {
				//if(pickups[i].interior == localPlayer.interior && pickups[i].dimension == localPlayer.dimension) {
					if(currentPickup != pickups[i]) {
						currentPickup = pickups[i];
						sendNetworkEventToServer("vrr.pickup", pickups[i].id);
					}
				//}
			}
		}
	}
}

// ===========================================================================

function processGameSpecifics() {
	if(getGame() < VRR_GAME_GTA_IV) {
		game.clearMessages();
	}

	destroyAutoCreatedPickups();
}

// ===========================================================================

function getServerData() {
	return serverData;
}

// ===========================================================================