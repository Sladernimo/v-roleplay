// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: utilities.js
// DESC: Provides util functions and arrays with data
// TYPE: Client (JavaScript)
// ===========================================================================

function setLocalPlayerFrozenState(state) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Setting frozen state to ${state}`);
	gui.showCursor(state, !state);
}

// ===========================================================================

function setLocalPlayerControlState(controlState, cursorState = false) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Setting control state to ${controlState} (Cursor: ${cursorState})`);
	controlsEnabled = controlState;
	game.setPlayerControl(controlState);
	if (getGame() == V_GAME_GTA_III || getGame() == V_GAME_GTA_VC) {
		game.SET_PLAYER_CONTROL(game.GET_PLAYER_ID(), boolToInt(controlState));
	} else if (getGame() <= V_GAME_GTA_IV) {
		setElementCollisionsEnabled(localPlayer.id, controlState);
		setPedInvincible(localPlayer, true);
	}
}

// ===========================================================================

function removeLocalPlayerFromVehicle() {
	if (getGame() == V_GAME_MAFIA_ONE) {
		localPlayer.removeFromVehicle();
		localPlayer.position = getPosAbovePos(getLocalPlayerPosition(), 5);
	}

	localPlayer.removeFromVehicle();
}

// ===========================================================================

function restoreLocalCamera() {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Camera restored`);
	if (isGameFeatureSupported("customCamera")) {
		game.restoreCamera(true);
	}
};

// ===========================================================================

function setLocalCameraLookAt(cameraPosition, cameraLookAt) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Set camera to look at [${cameraLookAt.x}, ${cameraLookAt.y}, ${cameraLookAt.z}] from [${cameraPosition.x}, ${cameraPosition.y}, ${cameraPosition.z}]`);
	if (isGameFeatureSupported("customCamera")) {
		game.setCameraLookAt(cameraPosition, cameraLookAt, true);
	}
}

// ===========================================================================

function clearLocalPlayerOwnedPeds() {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Clearing all self-owned peds ...`);
	clearSelfOwnedPeds();
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] All self-owned peds cleared`);
};

// ===========================================================================

function setCityAmbienceState(state, clearElements = false) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Ambient civilians and traffic ${(state) ? "enabled" : "disabled"}`);
	game.setTrafficEnabled(state);

	if (getMultiplayerMod() == V_MPMOD_GTAC) {
		game.setGenerateCarsAroundCamera(state);
		if (getGame() != V_GAME_GTA_SA) {
			game.setCiviliansEnabled(state);
		}

		if (clearElements) {
			clearSelfOwnedPeds();
			clearSelfOwnedVehicles();
		}
	}
}

// ===========================================================================

function runClientCode(code, returnTo, shouldReturn) {
	let returnValue = "Nothing";
	try {
		returnValue = eval("(" + code + ")");
	} catch (error) {
		if (shouldReturn) {
			sendNetworkEventToServer("v.rp.runCodeFail", returnTo, error.toString());
		}
		return false;
	}
	let returnValueString = returnValue;
	if (returnValue != null && returnValue != undefined) {
		returnValueString = `${returnValue.toString()} (${typeof returnValue})`;
	} else {
		returnValueString = "null/undefined";
	}
	if (shouldReturn) {
		sendNetworkEventToServer("v.rp.runCodeSuccess", returnTo, returnValueString);
	}
}

// ===========================================================================

function enterVehicleAsPassenger() {
	if (localPlayer.vehicle == null) {
		let tempVehicle = getClosestVehicle(getLocalPlayerPosition());
		if (getGame() != V_GAME_GTA_IV) {
			if (tempVehicle != null) {
				localPlayer.enterVehicle(tempVehicle, false);
			}
		}
		// else {
		// Disable for now. GTA IV has built-in passenger entry

		//for(let i = 0 ; i <= natives.getMaximumNumberOfPassengers(tempVehicle); i++) {
		//    if(natives.isCarPassengerSeatFree(tempVehicle, i)) {
		//        natives.taskEnterCarAsPassenger(localPlayer, tempVehicle, i, 10000);
		//    }
		//}
		//}
	}
}

// ===========================================================================

function giveLocalPlayerWeapon(weaponId, clipAmmo, ammo, active) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Giving weapon ${weaponId} with ${ammo} ammo`);
	forceWeapon = weaponId;
	if (getGame() == V_GAME_MAFIA_ONE) {
		localPlayer.giveWeapon(weaponId, clipAmmo, ammo);
		forceWeaponAmmo = clipAmmo;
		forceWeaponClipAmmo = ammo;
	} else {
		localPlayer.giveWeapon(weaponId, ammo, active);
		if (getGame() < V_GAME_GTA_IV) {
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
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Clearing weapons`);
	localPlayer.clearWeapons();
	if (clearData == true) {
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

function setLocalPlayerInterior(interior) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Setting interior to ${interior}`);
	if (getMultiplayerMod() == V_MPMOD_GTAC) {
		if (!isGTAIV()) {
			localPlayer.interior = interior;
			game.cameraInterior = interior;
		} //else {
		//if(gameData.mainWorldInterior != interior) {
		//	let interiorId = natives.getInteriorAtCoords(localPlayer.position);
		//	natives.activateInterior(interiorId, true);
		//	natives.loadAllObjectsNow();
		//}
		//let interiorId = natives.getInteriorAtCoords(localPlayer.position);
		//natives.activateInterior(interiorId, true);
		//}
	}

	if (isGameFeatureSupported("serverElements") && isGameFeatureSupported("interiorId")) {
		let vehicles = getElementsByType(ELEMENT_VEHICLE);
		for (let i in vehicles) {
			if (getEntityData(vehicles[i], "v.rp.interior")) {
				vehicles[i].interior = getEntityData(vehicles[i], "v.rp.interior");
			}
		}
	}
}

// ===========================================================================

function setSnowState(falling, ground, forceGround) {
	if (!isGameFeatureSupported("snow")) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Setting falling snow to ${falling} and ground snow to ${ground}`);
	snowing = falling;
	//snow.force = ground;
	//if (forceGround == true) {
	//	forceSnowing(forceGround);
	//	groundSnow.flush();
	//} else {
	//	snow.enabled = ground;
	//}
}

// ===========================================================================

function setLocalPlayerHealth(health) {
	if (localPlayer == null) {
		return false;
	}
	localPlayer.health = health;
}

// ===========================================================================

function playPedSpeech(pedName, speechId) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Making ${pedName}'s ped talk (${speechId})`);
	if (getMultiplayerMod() == V_MPMOD_GTAC) {
		game.SET_CHAR_SAY(int, int);
	}
}

// ===========================================================================

function clearLocalPedState() {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Clearing local ped state`);
	localPlayer.clearObjective();
}

// ===========================================================================

function getWeaponSlot(weaponId) {
	return gameData.weaponSlots[getGame()][weaponId];
}

// ===========================================================================

function setLocalPlayerDrunkEffect(amount, duration) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Drunk effect set to ${amount} for ${duration} ms`);
	if (getMultiplayerMod() == V_MPMOD_GTAC) {
		if (getGame() == V_GAME_GTA_IV) {
			natives.setDrunkCam(natives.getGameCam(), amount / 100, duration);
			natives.setPedIsDrunk(localPlayer, true);
		} else {
			drunkEffectAmount = 0;
			drunkEffectDurationTimer = setInterval(function () {
				drunkEffectAmount = drunkEffectAmount;
				if (drunkEffectAmount > 0) {
					//game.SET_MOTION_BLUR(drunkEffectAmount);
					game.SET_PLAYER_DRUNKENNESS(drunkEffectAmount, duration);
				} else {
					clearInterval(drunkEffectDurationTimer);
					drunkEffectDurationTimer = null;
				}
			}, 1000);
		}
	}
}

// ===========================================================================

function getLocalPlayerVehicleSeat() {
	if (localPlayer.vehicle != null) {
		if (getGame() != V_GAME_MAFIA_ONE) {
			for (let i = 0; i <= 8; i++) {
				if (localPlayer.vehicle.getOccupant(i) == localPlayer) {
					return i;
				}
			}
		} else {
			return inVehicleSeat;
		}
	} else {
		return -1;
	}
}

// ===========================================================================

function clearSelfOwnedPeds() {
	logToConsole(LOG_DEBUG, `Clearing self-owned peds`);
	getElementsByType(ELEMENT_PED).forEach(function (ped) {
		//if(ped.isOwner) {
		destroyElement(ped);
		//}
	});
}

// ===========================================================================

function clearSelfOwnedVehicles() {
	logToConsole(LOG_DEBUG, `Clearing self-owned vehicles`);
	getElementsByType(ELEMENT_VEHICLE).forEach(function (vehicle) {
		//if(vehicle.isOwner) {
		destroyElement(vehicle);
		//}
	});
}

// ===========================================================================

function setMouseCameraState(state) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] ${(state) ? "Enabled" : "Disabled"} mouse camera`);
	mouseCameraEnabled = state;
	SetStandardControlsEnabled(!mouseCameraEnabled);
}

// ===========================================================================

function toggleMouseCursor() {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] ${(!gui.cursorEnabled) ? "Enabled" : "Disabled"} mouse cursor`);
	gui.showCursor(!gui.cursorEnabled, gui.cursorEnabled);
}

// ===========================================================================

function toggleMouseCursor() {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] ${(!gui.cursorEnabled) ? "Enabled" : "Disabled"} mouse cursor`);
	setMouseCameraState(!mouseCameraEnabled);
}

// ===========================================================================

function setPlayerWeaponDamageEvent(clientName, eventType) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Set ${clientName} damage event type to ${eventType}`);
	weaponDamageEvent[clientName] = eventType;
}

// ===========================================================================

function setPlayerWeaponDamageEnabled(clientName, state) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] ${(state) ? "Enabled" : "Disabled"} damage from ${clientName}`);
	weaponDamageEnabled[clientName] = state;
}

// ===========================================================================

function destroyAutoCreatedPickups() {
	if (typeof ELEMENT_PICKUP != "undefined") {
		getElementsByType(ELEMENT_PICKUP).forEach(function (pickup) {
			if (pickup.isOwner) {
				destroyElement(pickup);
			}
		});
	}
}

// ===========================================================================

function processLocalPlayerControlState() {
	if (localPlayer == null) {
		return false;
	}

	if (isSpawned) {
		return false;
	}

	if (!controlsEnabled) {
		clearLocalPedState();
	}
}

// ===========================================================================

function processWantedLevelReset() {
	if (localPlayer == null) {
		return false;
	}

	if (!isSpawned) {
		return false;
	}

	if (typeof localPlayer.wantedLevel != "undefined") {
		localPlayer.wantedLevel = forceWantedLevel;
	}
}

// ===========================================================================

function forceLocalPlayerEquippedWeaponItem() {
	if (typeof localPlayer.weapon != "undefined") {
		if (forceWeapon != 0) {
			if (localPlayer.weapon != forceWeapon) {
				localPlayer.weapon = forceWeapon;
				if (getGame() < V_GAME_GTA_IV) {
					localPlayer.setWeaponClipAmmunition(getWeaponSlot(forceWeapon), forceWeaponClipAmmo);
					localPlayer.setWeaponAmmunition(getWeaponSlot(forceWeapon), forceWeaponAmmo);
				}
			} else {
				//if(getGame() < V_GAME_GTA_IV) {
				//	forceWeaponClipAmmo = localPlayer.getWeaponClipAmmunition(getWeaponSlot(forceWeapon));
				//	forceWeaponAmmo = localPlayer.getWeaponAmmunition(getWeaponSlot(forceWeapon));
				//}
			}
		} else {
			if (localPlayer.weapon > 0) {
				localPlayer.clearWeapons();
			}
		}
	}
}

// ===========================================================================

function getVehicleForNetworkEvent(vehicle) {
	if (getGame() == V_GAME_GTA_IV) {
		return natives.getNetworkIdFromVehicle(vehicle);
	}
	return vehicle.id;
}

// ===========================================================================

function setMinuteDuration(minuteDuration) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Setting minute duration to ${minuteDuration}ms`);

	if (isGameFeatureSupported("time")) {
		game.time.minuteDuration = minuteDuration;
	}
}

// ===========================================================================

function getStreamingRadioVolumeForPosition(position) {
	return streamingRadioVolume;
}

// ===========================================================================

function getLocalPlayerLookAtPosition() {
	if (localPlayer != null) {
		let centerCameraPos = getWorldFromScreenPosition(toVector3(game.width / 2, game.height / 2, 0));
		return getWorldFromScreenPosition(toVector3(game.width / 2, game.height / 2, getDistance(centerCameraPos, localPlayer.position) + 20));
	}
}

// ===========================================================================

function processInteriorLightsRendering() {
	if (renderInteriorLights) {
		if (!interiorLightsEnabled) {
			graphics.drawRectangle(null, toVector2(0.0, 0.0), toVector2(game.width, game.height), interiorLightsColour, interiorLightsColour, interiorLightsColour, interiorLightsColour);
		}
	}
}

// ===========================================================================

function getPlayerFromParams(params) {
	let clients = getClients();
	if (isNaN(params)) {
		for (let i in clients) {
			if (!clients[i].console) {
				if (toLowerCase(clients[i].name).indexOf(toLowerCase(params)) != -1) {
					return clients[i];
				}
			}
		}
	} else {
		if (typeof clients[toInteger(params)] != "undefined") {
			return clients[toInteger(params)];
		}
	}

	return false;
}

// ===========================================================================

function processNearbyPickups() {
	if (typeof ELEMENT_PICKUP != "undefined") {
		let pickups = getElementsByType(ELEMENT_PICKUP);
		for (let i in pickups) {
			if (getDistance(pickups[i].position, getLocalPlayerPosition()) < 5) {
				//if(pickups[i].interior == localPlayer.interior && pickups[i].dimension == localPlayer.dimension) {
				if (currentPickup != pickups[i]) {
					currentPickup = pickups[i];
					sendNetworkEventToServer("v.rp.pickup", pickups[i].id);
				}
				//}
			}
		}
	}
}

// ===========================================================================

function processGameSpecifics() {
	if (getGame() < V_GAME_GTA_IV) {
		game.clearMessages();
	}

	if (getGame() == V_GAME_GTA_IV || getGame() == V_GAME_GTA_IV_EFLC) {
		gta.terminateScript("mpcellphonemain");
	}

	destroyAutoCreatedPickups();
}

// ===========================================================================

function setProfanityFilterState(state) {
	profanityFilterEnabled = state;
	updateChatBox();
}

// ===========================================================================

function processVehicleCruiseControl() {
	if (localPlayer.vehicle == null) {
		return false;
	}

	if (!localPlayer.vehicle.isSyncer) {
		return false;
	}

	if (getLocalPlayerVehicleSeat() != 0) {
		return false;
	}

	if (cruiseControlEnabled) {
		setVehicleSpeed(cruiseControlSpeed);
	}
}

// ===========================================================================

function getCurrencyString(amount) {
	let tempString = currencyString;
	tempString = tempString.replace("{AMOUNT}", toString(makeLargeNumberReadable(amount)));
	return tempString;
}

// ===========================================================================

function updateLocalPlayerMoney() {
	if (localPlayer == null) {
		return false;
	}

	if (typeof localPlayer.money != "undefined") {
		localPlayer.money = toInteger(localPlayerMoney);
	}

	if (getGame() == V_GAME_GTA_IV) {
		natives.setMultiplayerHudCash(localPlayerMoney);
	}
}

// ===========================================================================

function setLocalPlayerMoney(amount) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Setting local player money`);
	localPlayerMoney = amount;
	updateLocalPlayerMoney();
}

// ===========================================================================

function fixOffScreenPosition(position, margin = toVector2(0.0, 0.0)) {
	if (position.x <= 0) {
		position.x = 0.0 + (margin.x / 2);
	} else if (position.x > game.width) {
		position.x = game.width - (margin.x / 2);
	}

	if (position.y <= 0) {
		position.y = 0.0 + (margin.y / 2);
	} else if (position.y > game.height) {
		position.y = game.height - (margin.y / 2);
	}

	return position;
}

// ===========================================================================

function processMapChangeWarning() {
	if (mapChangeWarning == false) {
		return false;
	}

	smallGameMessageFonts["AuroraBdCnBT"].render(`Map is changing to ${(mapChangeToNight) ? "night" : "day"} soon!`, [0, game.height - 90], game.width, 0.5, 0.0, smallGameMessageFonts["AuroraBdCnBT"].size, getColourByName("yellow"), true, true, false, true);
}

// ===========================================================================

function getDummyElements() {
	return getElementsByType(ELEMENT_ELEMENT).filter(element => element.type != ELEMENT_VEHICLE && element.type != ELEMENT_PLAYER && element.type != ELEMENT_PED);
}

// ===========================================================================