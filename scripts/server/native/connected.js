// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: connected.js
// DESC: Provides wrapped natives for GTA Connected and Mafia Connected mods
// TYPE: Server (JavaScript)
// ===========================================================================

// Most of the scripting API is the same between the two mods, but there are some differences
// The differences are explained in JSDoc documentation comments

// If getGame() returns less than 10, then the game is on GTA Connected (GTAC)
// If getGame() returns 10 or higher, then the game is on Mafia Connected (MafiaC)

// Internally, client is known as a "net machine". It's the entity connected to the server.
// Objects of class "Player" is a game human/ped character, attached to (and controlled by) the client.
// The difference between client and player, is the client doesn't exist in the game world.
// The player ped exists in the game world which is why it has physical properties (like position).
// You can have a client without a player ped (although they won't have a ped to control), and vice verse (although the ped won't be controlled by a client, similar to an NPC ped)

// The game entities follow a heirarchy, and inherit properties from their parent class:
// Entity > Ped > Player
// Entity > Vehicle
// Entity > Object (For GTAC only, MafiaC doesn't have game object support)
// Entity > Pickup (For GTAC only, MafiaC doesn't have game pickup support)
// Entity > Marker (For GTAC only, MafiaC doesn't have game marker support)
// Entity > Blip

// All "get data" functions like getPlayerData and getVehicleData return an object of their respective data class (ClientData, VehicleData, etc)
// If the data can't be found, these functions will return null

// Locale strings that indicate an entity that can't be found or doesn't exist, will have a key starting with "Invalid" (e.g. InvalidPlayer, InvalidVehicle, etc)
// On most command handler functions, these are usually followed by a return statement to prevent the rest of the command from executing.

// ===========================================================================

// Players are sometimes referred to as clients in this script. They are used interchangeably.
// Not to be confused with "player ped", which is of class "Player" which is the player's game human/ped object
/**
 * @typedef Client
 * @property {string} name - The client's name
 * @property {string} ip - The client's IP address
 * @property {number} ping - The client's ping
 * @property {number} game - The client's game ID
 * @property {number} gameVersion - The client's game version
 * @property {boolean} administrator - Whether or not the client can use GTAC and MafiaC built-in admin commands
 * @property {boolean} console - Whether or not the client is the server console
 * @property {number} index - The client's index (some multiplayer modifications call it ID)
 * @property {Player} player - The client's player ped object
 * @method setData - Attaches a key and value to a client, synced to all clients
 * @method getData - Gets the value of a key attached to a client
 * @method removeData - Removes a key and value attached to a client
 * @method removeAllData - Removes all keys and values attached to a client
 * @method disconnect - Disconnects a client
 * @method despawnPlayer - Removes a player's ped and resets their camera
 */

// ===========================================================================

/**
 * @typedef Entity
 * @property {*} modelIndex - The model of the entity. GTA Connected uses a number, Mafia Connected uses a string
 * @property {Vec3} position - The entity's position
 * @property {Vec3} rotation - The entity's rotation
 */

// ===========================================================================

/**
 * @typedef Ped
 * @extends {Entity}
 * @property {string} name - The ped's name
 * @property {number} health - The ped's health
 * @property {number} armour - The ped's armour. On MafiaC, this is always 0
 */

// ===========================================================================

/**
 * @typedef Vehicle
 * @extends {Entity}
 * @property {boolean} engine - The vehicle's engine state
 * @property {boolean} lights - The vehicle's lights state
 * @property {boolean} locked - The vehicle's door lock state
 * @property {boolean} siren - The vehicle's siren state
 */

// ===========================================================================

let builtInCommands = [
	"refresh",
	"restart",
	"stop",
	"start",
	"reconnect",
	"setname",
	"connect",
	"disconnect",
	"say",
	"dumpdoc",
];

// ===========================================================================

let disconnectReasons = [
	"LostConnection",
	"Disconnected",
	"UnsupportedClient",
	"WrongGame",
	"IncorrectPassword",
	"UnsupportedExecutable",
	"Disconnected",
	"Banned",
	"Failed",
	"InvalidName",
	"Crashed",
	"ModifiedGame"
];

// ===========================================================================

function getPlayerPosition(client) {
	if (!isGameFeatureSupported("serverElements")) {
		return getPlayerData(client).syncPosition;
	} else {
		// Check if Mafia 1, player position is bugged when in a vehicle
		if (getGame() == V_GAME_MAFIA_ONE) {
			if (isPlayerInAnyVehicle(client)) {
				return getPlayerVehicle(client).position;
			} else {
				return getPlayerPed(client).position;
			}
		} else {
			if (getPlayerPed(client) != null) {
				return getPlayerPed(client).position;
			} else {
				return toVector3(0.0, 0.0, 0.0);
			}
		}
	}


}

// ===========================================================================

function setPlayerPosition(client, position) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s position to ${position.x}, ${position.y}, ${position.z}`);
	sendPlayerSetPosition(client, position);
}

// ===========================================================================

function getPlayerHeading(client) {
	if (!isGameFeatureSupported("serverElements")) {
		return getPlayerData(client).syncHeading;
	} else {
		if (getGame() == V_GAME_MAFIA_ONE) {
			if (isPlayerInAnyVehicle(client)) {
				return getPlayerVehicle(client).heading;
			} else {
				return getPlayerPed(client).heading;
			}
		} else {
			if (getPlayerPed(client) != null) {
				return getPlayerPed(client).heading;
			}
		}
	}
}

// ===========================================================================

function setPlayerHeading(client, heading) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s heading to ${heading}`);
	sendPlayerSetHeading(client, heading);
}

// ===========================================================================

function getPlayerVehicle(client) {
	if (isNull(client)) {
		return null;
	}

	if (!isGameFeatureSupported("serverElements")) {
		return getPlayerData().syncVehicle;
	} else {
		if (getPlayerPed(client).vehicle) {
			return getPlayerPed(client).vehicle;
		}
	}
	return null;
}

// ===========================================================================

function getPlayerDimension(client) {
	if (!isGameFeatureSupported("dimension")) {
		return 0;
	}

	if (!isGameFeatureSupported("serverElements")) {
		return getPlayerData(client).syncDimension;
	} else {
		if (getPlayerPed(client) != null) {
			return getPlayerPed(client).dimension;
		}
	}
}

// ===========================================================================

function getPlayerInterior(client) {
	if (!isGameFeatureSupported("interiorId")) {
		return 0;
	}

	return getPlayerCurrentSubAccount(client).interior || 0;
}

// ===========================================================================

function setPlayerDimension(client, dimension) {
	logToConsole(LOG_VERBOSE, `Setting ${getPlayerDisplayForConsole(client)}'s dimension to ${dimension}`);
	if (!isGameFeatureSupported("serverElements")) {
		getPlayerData(client).syncDimension = dimension;
	} else {
		if (getPlayerPed(client) != null) {
			getPlayerPed(client).dimension = dimension;
		}
	}
}

// ===========================================================================

function setPlayerInterior(client, interior) {
	logToConsole(LOG_VERBOSE, `Setting ${getPlayerDisplayForConsole(client)}'s interior to ${interior}`);
	sendPlayerSetInterior(client, interior);
	if (isPlayerLoggedIn(client) && isPlayerSpawned(client)) {
		getPlayerCurrentSubAccount(client).interior = interior;
	}
}

// ===========================================================================

function isPlayerInAnyVehicle(client) {
	if (!isGameFeatureSupported("serverElements")) {
		return (getPlayerData().syncVehicle != null);
	} else {
		if (getPlayerPed(client) == null) {
			return false;
		}

		return (getPlayerPed(client).vehicle != null);
	}
}

// ===========================================================================

function getPlayerVehicleSeat(client) {
	if (!isPlayerInAnyVehicle(client)) {
		return -1;
	}

	if (getPlayerData(client).vehicleSeat != -1) {
		return getPlayerData(client).vehicleSeat;
	}

	if (!isGameFeatureSupported("serverElements")) {
		return getPlayerData().syncVehicleSeat;
	} else {
		for (let i = 0; i <= 8; i++) {
			if (getPlayerVehicle(client).getOccupant(i) == getPlayerPed(client)) {
				return i;
			}
		}
	}

	return -1;
}

// ===========================================================================

function isPlayerSpawned(client) {
	return getPlayerData(client).spawned;
}

// ===========================================================================

function getVehiclePosition(vehicle) {
	if (vehicle == null) {
		return false;
	}

	return vehicle.position;
}

// ===========================================================================

function getVehicleRotation(vehicle) {
	if (vehicle == null) {
		return false;
	}

	if (getGame() == V_GAME_MAFIA_ONE) {
		return getRotationFromHeading(vehicle.heading);
	}

	return vehicle.rotation;
}

// ===========================================================================

function getVehicleHeading(vehicle) {
	if (vehicle == null) {
		return false;
	}

	return vehicle.heading;
}

// ===========================================================================

function setVehicleHeading(vehicle, heading) {
	//if (getGame() == V_GAME_GTA_IV) {
	//	return sendNetworkEventToPlayer("v.rp.vehPosition", null, getVehicleForNetworkEvent(vehicle), heading);
	//}
	return vehicle.heading = heading;
}

// ===========================================================================

function getElementTransient(element) {
	if (typeof element.transient != "undefined") {
		return element.transient;
	}
	return false;
}

// ===========================================================================

function setElementTransient(element, state) {
	if (typeof element.transient != "undefined") {
		element.transient = state;
		return true;
	}
	return false;
}

// ===========================================================================

function getVehicleSyncer(vehicle) {
	return getElementSyncer(vehicle);
}

// ===========================================================================

function getVehicleForNetworkEvent(vehicle) {
	//if (getGame() == V_GAME_GTA_IV) {
	//	if (getVehicleData(vehicle).ivNetworkId != -1) {
	//		return getVehicleData(vehicle).ivNetworkId;
	//	}
	//	return -1;
	//}
	return vehicle.id;
}

// ===========================================================================

function deleteGameElement(element) {
	try {
		if (element != null) {
			destroyElement(element);
			return true;
		}
	} catch (error) {
		return false;
	}
}

// ===========================================================================

function isPlayerInFrontVehicleSeat(client) {
	return (getPlayerVehicleSeat(client) == 0 || getPlayerVehicleSeat(client) == 1);
}

// ===========================================================================

function removePedFromVehicle(ped) {
	logToConsole(LOG_DEBUG, `Removing ped ${ped.id} from their vehicle`);

	if (ped.vehicle == null) {
		return false;
	}

	sendPedRemoveFromVehicle(null, ped.id);
	return true;
}

// ===========================================================================

function setPlayerSkin(client, skinIndex) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s skin to ${gameData.skins[getGame()][skinIndex][0]} (Index: ${skinIndex}, Name: ${gameData.skins[getGame()][skinIndex][1]})`);
	if (getGame() == V_GAME_GTA_IV) {
		triggerNetworkEvent("v.rp.localPlayerSkin", client, gameData.skins[getGame()][skinIndex][0]);
	} else {
		getPlayerPed(client).modelIndex = gameData.skins[getGame()][skinIndex][0];
	}
}

// ===========================================================================

function getPlayerSkin(client) {
	return getPlayerCurrentSubAccount(client).skin; //getSkinIndexFromModel(getPlayerData().modelIndex);
}

// ===========================================================================

function setPlayerHealth(client, health) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to ${health}`);
	sendPlayerSetHealth(client, health);
	getPlayerCurrentSubAccount(client).health = health;
}

// ===========================================================================

function getPlayerHealth(client) {
	return getPlayerData(client).health;
}

// ===========================================================================

function setPlayerArmour(client, armour) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to ${armour}`);
	sendPlayerSetArmour(client, armour);
	//client.player.armour = armour;
}

// ===========================================================================

function getPlayerArmour(client) {
	if (isGameFeatureSupported("pedArmour")) {
		return getPlayerPed(client).armour;
	} else {
		return getPlayerData(client).syncArmour;
	}
}

// ===========================================================================

function setPlayerCash(client, amount) {
	if (client == null) {
		return false;
	}

	if (isNaN(amount)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).cash = toInteger(amount);
	updatePlayerCash(client);
}

// ===========================================================================

function givePlayerCash(client, amount) {
	if (client == null) {
		return false;
	}

	if (isNaN(amount)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).cash = getPlayerCurrentSubAccount(client).cash + toInteger(amount);
	updatePlayerCash(client);
}

// ===========================================================================

function takePlayerCash(client, amount) {
	if (client == null) {
		return false;
	}

	if (isNaN(amount)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).cash = getPlayerCurrentSubAccount(client).cash - toInteger(amount);
	updatePlayerCash(client);
}

// ===========================================================================

function disconnectPlayer(client) {
	logToConsole(LOG_DEBUG, `Disconnecting (kicking) ${getPlayerDisplayForConsole(client)}`);
	disconnectPlayer(client);
	return false;
}

// ===========================================================================

function getElementSyncer(element) {
	return getClients()[element.syncer];
}

// ===========================================================================

function getPlayerWeaponAmmo(client) {
	return getPlayerPed(client).weaponAmmunition;
}

// ===========================================================================

function setPlayerVelocity(client, velocity) {
	logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s velocity to ${velocity.x}, ${velocity.y}, ${velocity.z}`);
	if (typeof getPlayerPed(client).velocity != "undefined") {
		getPlayerPed(client).velocity = velocity;
	}
}

// ===========================================================================

function getPlayerVelocity(client) {
	if (typeof getPlayerPed(client).velocity != "undefined") {
		return getPlayerPed(client).velocity;
	}
	return toVector3(0.0, 0.0, 0.0);
}

// ===========================================================================

function getElementDimension(element) {
	if (typeof element.dimension != "undefined") {
		return element.dimension;
	}
	return 0;
}

// ===========================================================================

function setElementDimension(element, dimension) {
	if (typeof element.dimension != "undefined") {
		logToConsole(LOG_VERBOSE, `Setting element ${element} (${element.id}) dimension to ${dimension}`);
		element.dimension = dimension;
		return true;
	}
	return false;
}

// ===========================================================================

function setElementRotation(element, rotation) {
	if (element.type == ELEMENT_VEHICLE && getGame() == V_GAME_MAFIA_ONE) {
		//element.heading = rotation.y;
		return false;
	}

	if (typeof element.setRotation != "undefined") {
		element.setRotation(rotation);
	} else {
		return element.rotation = rotation;
	}
}

// ===========================================================================

function givePlayerHealth(client, amount) {
	if (getPlayerHealth(client) + amount > 100) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to 100`);
		setPlayerHealth(client, 100);
	} else {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s health to ${getPlayerHealth(client) + amount}`);
		setPlayerHealth(client, getPlayerHealth(client) + amount);
	}
}

// ===========================================================================

function givePlayerArmour(client, amount) {
	if (getPlayerArmour(client) + amount > 100) {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to 100`);
		setPlayerArmour(client, 100);
	} else {
		logToConsole(LOG_DEBUG, `Setting ${getPlayerDisplayForConsole(client)}'s armour to ${getPlayerArmour(client) + amount}`);
		setPlayerArmour(client, getPlayerArmour(client) + amount);
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

function getServerName() {
	return "Connected Roleplay";
}

// ===========================================================================

function createGamePickup(modelIndex, position, type) {
	if (!isGameFeatureSupported("pickup")) {
		return false;
	}
	return game.createPickup(modelIndex, position, type);
}

// ===========================================================================

function createGameDummyElement(position) {
	if (!isGameFeatureSupported("dummyElement")) {
		return false;
	}
	return game.createDummyElement(position);
}

// ===========================================================================

function createGameBlip(position, type = 0, size = 1, colour = toColour(255, 255, 255, 255)) {
	if (!isGameFeatureSupported("blip")) {
		return false;
	}
	return game.createBlip(type, position, size, colour);
}

// ===========================================================================

function createGameSphere(position, size = 1, colour = toColour(255, 255, 255, 255)) {
	if (!isGameFeatureSupported("sphere")) {
		return false;
	}

	let sphere = game.createSphere(position, size);
	//sphere.colour = colour;
	return sphere;
}

// ===========================================================================

function createGameObject(modelIndex, position) {
	if (!isGameFeatureSupported("object")) {
		return false;
	}
	return game.createObject(gameData.objects[getGame()][modelIndex][0], position);
}

// ===========================================================================

function setElementOnAllDimensions(element, state) {
	if (!isNull(element) && element != false) {
		if (typeof element.netFlags != "undefined") {
			if (typeof element.netFlags.onAllDimensions != "undefined") {
				element.netFlags.onAllDimensions = state;
			}
		} else {
			if (typeof element.onAllDimensions != "undefined") {
				element.onAllDimensions = state;
			}
		}
	}
}

// ===========================================================================

function isMeleeWeapon(weaponId, gameId = getGame()) {
	return (gameData.meleeWeapons[gameId].indexOf(weaponId) != -1);
}

// ===========================================================================

function getPlayerLastVehicle(client) {
	return getPlayerData(client).lastVehicle != null;
}

// ===========================================================================

function isVehicleObject(vehicle) {
	if (vehicle == null || vehicle == undefined) {
		return false;
	}
	return (vehicle.type == ELEMENT_VEHICLE);
}

// ===========================================================================

function repairVehicle(vehicle) {
	vehicle.fix();
}

// ===========================================================================

function setVehicleLights(vehicle, lights) {
	setEntityData(vehicle, "v.rp.lights", lights, true);
	sendNetworkEventToPlayer("v.rp.veh.lights", null, vehicle.id, lights);
}

// ===========================================================================

function setVehicleEngine(vehicle, engine) {
	//vehicle.engine = engine;
	setEntityData(vehicle, "v.rp.engine", engine, true);
	sendNetworkEventToPlayer("v.rp.veh.engine", null, vehicle.id, engine);
}

// ===========================================================================

function setVehicleLocked(vehicle, locked) {
	setEntityData(vehicle, "v.rp.locked", locked, true);
	sendNetworkEventToPlayer("v.rp.veh.locked", null, vehicle.id, locked);

	if (isGameFeatureSupported("vehicleLock")) {
		vehicle.locked = locked;
	}
}

// ===========================================================================

function setVehicleSiren(vehicle, state) {
	setEntityData(vehicle, "v.rp.siren", state, true);
	sendNetworkEventToPlayer("v.rp.veh.siren", null, vehicle.id, state);
}

// ===========================================================================

function setVehicleHazardLights(vehicle, state) {
	if (!isGameFeatureSupported("vehicleHazardLights")) {
		return false;
	}

	setEntityData(vehicle, "v.rp.hazardLights", state, true);
	sendNetworkEventToPlayer("v.rp.veh.hazardLights", null, vehicle.id, state);
}

// ===========================================================================

function setVehicleAlarm(vehicle, state) {
	if (!isGameFeatureSupported("vehicleAlarm")) {
		return false;
	}

	setEntityData(vehicle, "v.rp.alarm", state, true);
	sendNetworkEventToPlayer("v.rp.veh.alarm", null, vehicle.id, state);
}

// ===========================================================================

function setVehicleDirtLevel(vehicle, dirtLevel = 0) {
	if (!isGameFeatureSupported("vehicleDirtLevel")) {
		return false;
	}

	setEntityData(vehicle, "v.rp.dirtLevel", dirtLevel, true);
	sendNetworkEventToPlayer("v.rp.veh.dirtLevel", null, vehicle.id, dirtLevel);
}

// ===========================================================================

function setVehicleLivery(vehicle, livery) {
	if (!isGameFeatureSupported("vehicleLivery")) {
		return false;
	}

	setEntityData(vehicle, "v.rp.livery", livery, true);
	sendNetworkEventToPlayer("v.rp.veh.livery", null, vehicle.id, livery);
}

// ===========================================================================

function setVehicleUpgrades(vehicle, upgrades) {
	if (!isGameFeatureSupported("vehicleUpgrades")) {
		return false;
	}

	setEntityData(vehicle, "v.rp.upgrades", upgrades, true);
	sendNetworkEventToPlayer("v.rp.veh.upgrades", null, vehicle.id, upgrades);
}

// ===========================================================================

function setVehicleInteriorLight(vehicle, state) {
	if (!isGameFeatureSupported("vehicleInteriorLight")) {
		return false;
	}

	setEntityData(vehicle, "v.rp.interiorLight", state, true);
	sendNetworkEventToPlayer("v.rp.veh.interiorLight", null, vehicle.id, state);
}

// ===========================================================================

function setVehicleTaxiLight(vehicle, state) {
	if (!isGameFeatureSupported("vehicleTaxiLight")) {
		return false;
	}

	setEntityData(vehicle, "v.rp.taxiLight", state, true);
	sendNetworkEventToPlayer("v.rp.veh.taxiLight", null, vehicle.id, state);
}

// ===========================================================================

function setVehicleAlarm(vehicle, state) {
	if (!isGameFeatureSupported("vehicleAlarm")) {
		return false;
	}

	setEntityData(vehicle, "v.rp.vehAlarm", state, true);
	sendNetworkEventToPlayer("v.rp.veh.alarm", null, vehicle.id, state);
}

// ===========================================================================

function getVehicleLights(vehicle) {
	return vehicle.lights;
}

// ===========================================================================

function getVehicleEngine(vehicle) {
	return vehicle.engine;
}

// ===========================================================================

function getVehicleLocked(vehicle) {
	return vehicle.lockedStatus;
}

// ===========================================================================

function getVehicleSiren(vehicle) {
	return vehicle.siren;
}

// ===========================================================================

function setVehicleColours(vehicle, colour1, colour2, colour3 = -1, colour4 = -1) {
	if (getGame() == V_GAME_GTA_IV) {
		setEntityData(vehicle, "v.rp.colour", [colour1, colour2, colour3, colour4], true);
		sendNetworkEventToPlayer("v.rp.veh.colour", null, vehicle.id, colour1, colour2, colour3, colour4);
	} else {
		vehicle.colour1 = colour1;
		vehicle.colour2 = colour2;

		if (colour3 != -1) {
			vehicle.colour3 = colour3;
		}

		if (colour4 != -1) {
			vehicle.colour4 = colour4;
		}
	}

}

// ===========================================================================

function createGameVehicle(modelIndex, position, rotation, toClient = null) {
	if (isGameFeatureSupported("serverElements")) {
		let vehicle = game.createVehicle(gameData.vehicles[getGame()][modelIndex][0], position, rotation.z);
		if (getGame() != V_GAME_MAFIA_ONE) {
			vehicle.rotation = rotation;
		}

		return vehicle;
	}

	return null;
}

// ===========================================================================

function createGamePed(modelIndex, position, heading, toClient = null) {
	if (isGameFeatureSupported("serverElements")) {
		let ped = game.createPed(gameData.skins[getGame()][modelIndex][0], position);
		if (ped) {
			//ped.position = position;
			ped.heading = heading;
			ped.rotation = toVector3(0, 0, heading);
			return ped;
		}
	}

	return false;
}

// ===========================================================================

function getIsland(position) {
	if (getGame() == V_GAME_GTA_III) {
		if (position.x > 616) {
			return V_ISLAND_PORTLAND;
		} else if (position.x < -283) {
			return V_ISLAND_SHORESIDEVALE;
		}
		return V_ISLAND_STAUNTON;
	} else {
		return V_ISLAND_NONE;
	}

	//return game.getIslandFromPosition(position);
}

// ===========================================================================

function isValidVehicleModel(model) {
	if (getVehicleModelIndexFromModel(model) != false) {
		return true;
	}

	return false;
}

// ===========================================================================

function setGameTime(hour, minute, minuteDuration = 1000) {
	if (isGameFeatureSupported("time")) {
		game.time.hour = hour;
		game.time.minute = minute;
		game.time.minuteDuration = minuteDuration;
	}
}

// ===========================================================================

function setGameWeather(weather) {
	if (isGameFeatureSupported("weather")) {
		mp.world.weather = weather;
	}
}

// ===========================================================================

function setPlayerFightStyle(client, fightStyleId) {
	if (!isPlayerSpawned(client)) {
		return false;
	}

	if (!isGameFeatureSupported("pedFightStyle")()) {
		return false;
	}

	setEntityData(getPlayerElement(client), "v.rp.fightStyle", [gameData.fightStyles[getGame()][fightStyleId][1][0], gameData.fightStyles[getGame()][fightStyleId][1][1]]);
	forcePlayerToSyncElementProperties(null, getPlayerElement(client));
}

// ===========================================================================

function isPlayerAtGym(client) {
	return true;
}

// ===========================================================================

function getPlayerElement(client) {
	return client.player;
}

// ===========================================================================

function setElementPosition(element, position) {
	sendNetworkEventToPlayer("v.rp.elementPosition", null, element.id, position);
}

// ===========================================================================

function getElementPosition(element) {
	return element.position;
}

// ===========================================================================

function getElementHeading(element) {
	return element.heading;
}

// ===========================================================================

function setElementInterior(element, interior) {
	if (!isGameFeatureSupported("interiorId")) {
		return false;
	}

	setEntityData(element, "v.rp.interior", interior, true);
	sendNetworkEventToPlayer("v.rp.interior", null, element.id, interior);
}

// ===========================================================================

function setElementCollisionsEnabled(element, state) {
	sendNetworkEventToPlayer("v.rp.elementCollisions", null, element.id, state);
}

// ===========================================================================

function isTaxiVehicle(vehicle) {
	if (taxiModels[getGame()].indexOf(vehicle.modelIndex) != -1) {
		return true;
	}

	return false;
}

// ===========================================================================

function getVehicleName(vehicle) {
	let model = getElementModel(vehicle);
	return getVehicleNameFromModel(model) || "Unknown";
}

// ===========================================================================

function getElementModel(element) {
	if (element == null) {
		return -1;
	}
	return element.modelIndex;
}

// ===========================================================================

function givePlayerWeaponAmmo(client, ammo) {
}

// ===========================================================================

function getPlayerWeapon(client) {
	return getPlayerPed(client).weapon;
}

// ===========================================================================

function connectToDatabase() {
	if (getDatabaseConfig().usePersistentConnection) {
		if (persistentDatabaseConnection == null) {
			logToConsole(LOG_DEBUG, `[V.RP.Database] Initializing database connection ...`);
			persistentDatabaseConnection = module.mysql.connect(getDatabaseConfig().host, getDatabaseConfig().user, getDatabaseConfig().pass, getDatabaseConfig().name, getDatabaseConfig().port, getDatabaseConfig().useSSL);
			if (persistentDatabaseConnection.error) {
				logToConsole(LOG_ERROR, `[V.RP.Database] Database connection error: ${persistentDatabaseConnection.error}`);
				persistentDatabaseConnection = null;
				return false;
			}

			logToConsole(LOG_DEBUG, `[V.RP.Database] Database connection successful!`);
			return persistentDatabaseConnection;
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.Database] Using existing database connection.`);
			return persistentDatabaseConnection;
		}
	} else {
		let databaseConnection = module.mysql.connect(getDatabaseConfig().host, getDatabaseConfig().user, getDatabaseConfig().pass, getDatabaseConfig().name, getDatabaseConfig().port, getDatabaseConfig().useSSL);
		if (databaseConnection.error) {
			logToConsole(LOG_ERROR, `[V.RP.Database] Database connection error: ${persistentDatabaseConnection.error}`);
			return false;
		} else {
			return databaseConnection;
		}
	}
}

// ===========================================================================

function disconnectFromDatabase(dbConnection, force = false) {
	if (!getDatabaseConfig().usePersistentConnection || force == true) {
		try {
			dbConnection.close();
			logToConsole(LOG_DEBUG, `[V.RP.Database] Database connection closed successfully`);
		} catch (error) {
			logToConsole(LOG_ERROR, `[V.RP.Database] Database connection could not be closed! (Error: ${error})`);
		}
	}
	return true;
}

// ===========================================================================

function queryDatabase(dbConnection, queryString) {
	logToConsole(LOG_DEBUG, `[V.RP.Database] Query string: ${queryString}`);
	return dbConnection.query(queryString);
}

// ===========================================================================

function escapeDatabaseString(dbConnection, unsafeString = "") {
	if (!dbConnection) {
		dbConnection = connectToDatabase();
	}

	if (typeof unsafeString == "string") {
		return dbConnection.escapeString(unsafeString);
	}
	return unsafeString;
}

// ===========================================================================

function getDatabaseInsertId(dbConnection) {
	return dbConnection.insertId;
}

// ===========================================================================

function getQueryNumRows(dbQuery) {
	return dbQuery.numRows;
}

// ===========================================================================

function getDatabaseError(dbConnection) {
	return dbConnection.error;
}

// ===========================================================================

function freeDatabaseQuery(dbQuery) {
	if (dbQuery != null) {
		dbQuery.free();
	}
	return;
}

// ===========================================================================

function fetchQueryAssoc(dbConnection, queryString) {
	let assocArray = [];
	let dbAssoc = null;

	let dbQuery = dbConnection.query(queryString);
	if (dbQuery) {
		while (dbAssoc = dbQuery.fetchAssoc()) {
			assocArray.push(dbAssoc);
		}
		freeDatabaseQuery(dbQuery);
	}

	return assocArray;
}

// ===========================================================================

function quickDatabaseQuery(queryString) {
	logToConsole(LOG_DEBUG, `[V.RP.Database] Query string: ${queryString}`);
	let dbConnection = connectToDatabase();
	let insertId = 0;
	if (dbConnection) {
		//logToConsole(LOG_DEBUG, `[V.RP.Database] Query string: ${queryString}`);
		let dbQuery = queryDatabase(dbConnection, queryString);
		if (getDatabaseInsertId(dbConnection)) {
			insertId = getDatabaseInsertId(dbConnection);
			logToConsole(LOG_DEBUG, `[V.RP.Database] Query returned insert id ${insertId}`);
		}

		if (dbQuery) {
			try {
				freeDatabaseQuery(dbQuery);
				logToConsole(LOG_DEBUG, `[V.RP.Database] Query result free'd successfully`);
			} catch (error) {
				logToConsole(LOG_ERROR, `[V.RP.Database] Query result could not be free'd! (Error: ${error})`);
			}
		}

		disconnectFromDatabase(dbConnection);

		if (insertId != 0) {
			return insertId;
		}

		return true;
	}
}

// ===========================================================================

function executeDatabaseQueryCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!targetClient) {
		messagePlayerError(client, "That player was not found!");
		return false;
	}

	if (targetCode == "") {
		messagePlayerError(client, "You didn't enter any code!");
		return false;
	}

	let success = quickDatabaseQuery(params);

	if (!success) {
		messagePlayerAlert(client, `Database query failed to execute: {ALTCOLOUR}${query}`);
	} else if (typeof success != "boolean") {
		messagePlayeSuccess(client, `Database query successful: {ALTCOLOUR}${query}`);
		messagePlayerInfo(client, `Returns: ${success}`);
	} else {
		messagePlayerSuccess(client, `Database query successful: {ALTCOLOUR}${query}`);
	}
	return true;
}

// ===========================================================================

function sendNetworkEventToPlayer(eventName, client, ...args) {
	let argsArray = [eventName, client];
	argsArray = argsArray.concat(args);
	triggerNetworkEvent.apply(null, argsArray);
}

// ===========================================================================

function addNetworkEventHandler(eventName, handlerFunction) {
	addNetworkHandler(eventName, handlerFunction);
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

function getClientsInRange(position, distance) {
	return getPlayersInRange(position, distance);
}

// ===========================================================================

function getCiviliansInRange(position, distance) {
	return getElementsByTypeInRange(ELEMENT_PED, position, distance).filter(x => !x.isType(ELEMENT_PLAYER));
}

// ===========================================================================

function getPlayersInRange(position, distance) {
	return getClients().filter(x => getDistance(position, getPlayerPosition(x)) <= distance);
}

// ===========================================================================

function getElementsByTypeInRange(elementType, position, distance) {
	return getElementsByType(elementType).filter(x => getDistance(position, getElementPosition(x)) <= distance);
}

// ===========================================================================

function getClosestCivilian(position) {
	return getClosestElementByType(ELEMENT_PED, position).filter(ped => !ped.isType(ELEMENT_PLAYER));
}

// ===========================================================================

function getVehiclesInRange(position, range) {
	//if (getGame() == V_GAME_GTA_IV) {
	//	return serverData.vehicles.reduce((i, j) => (getDistance(position, i.syncPosition) <= getDistance(position, j.syncPosition)) ? i : j);
	//}
	return getElementsByTypeInRange(ELEMENT_VEHICLE, position, range);
}

// ===========================================================================

function getClosestVehicle(position) {
	return getClosestElementByType(ELEMENT_VEHICLE, position) || false;
}

// ===========================================================================

function getClosestElementByType(elementType, position) {
	return getElementsByType(elementType).reduce((i, j) => (getDistance(position, getElementPosition(i)) <= getDistance(position, getElementPosition(j))) ? i : j);
}

// ===========================================================================

function getVehicleFirstEmptySeat(vehicle) {
	for (let i = 0; i <= 4; i++) {
		if (vehicle.getOccupant(i) == null) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function isVehicleTrain(vehicle) {
	if (getGame() == V_GAME_GTA_III) {
		if (vehicle.modelIndex == 124) {
			return true;
		}
	}

	return false
}

// ===========================================================================

function warpPedIntoVehicle(ped, vehicle, seatId) {
	if (getGame() == V_GAME_MAFIA_ONE) {
		sendWarpPedIntoVehicle(null, ped.id, vehicle.id, seatId);
		return true;
	}

	ped.warpIntoVehicle(vehicle, seatId);
}

// ===========================================================================

function forcePedToEnterVehicle(ped, vehicle, seat) {
	sendNetworkEventToPlayer("v.rp.enterVehicle", ped.syncer, ped.id, vehicle.id, seat);
}

// ===========================================================================

function getPlayerPing(client) {
	return client.ping
}

// ===========================================================================

function setVehicleHealth(vehicle, health) {
	vehicle.health = health;
}

// ===========================================================================

function givePlayerWeapon(client, weaponId, clipAmmo, ammo, active = true) {
	logToConsole(LOG_DEBUG, `[V.RP.Client] Sending signal to ${getPlayerDisplayForConsole(client)} to give weapon (Weapon: ${weaponId}, Ammo: ${ammo})`);
	sendNetworkEventToPlayer("v.rp.giveWeapon", client, weaponId, clipAmmo, ammo, active);
}

// ===========================================================================

function setPlayerWantedLevel(client, wantedLevel) {
	sendNetworkEventToPlayer("v.rp.wantedLevel", client, wantedLevel);
	return true;
}

// ===========================================================================

function setElementStreamInDistance(element, distance) {
	if (!isNull(element) && element != false) {
		if (typeof element == "Entity") {
			if (typeof element.streamInDistance != "undefined") {
				element.streamInDistance = distance;
			}
		}
	}
}

// ===========================================================================

function setElementStreamOutDistance(element, distance) {
	if (!isNull(element) && element != false) {
		if (typeof element == "Entity") {
			if (typeof element.streamOutDistance != "undefined") {
				element.streamOutDistance = distance;
			}
		}
	}
}

// ===========================================================================

function getElementStreamInDistance(element) {
	if (!isNull(element) && element != false) {
		if (typeof element == "Entity") {
			if (typeof element.streamInDistance != "undefined") {
				return element.streamInDistance;
			}
		}
	}
}

// ===========================================================================

function getElementStreamOutDistance(element) {
	if (!isNull(element) && element != false) {
		if (typeof element == "Entity") {
			if (typeof element.streamOutDistance != "undefined") {
				return element.streamOutDistance;
			}
		}
	}
}

// ===========================================================================

/**
 * @param {Client} client - The player/client to get the ped for
 * @return {Player} The client's player ped
 */
function getPlayerPed(client) {
	if (isNull(client)) {
		return null;
	}

	return client.player;
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

function setEntityData(entity, dataName, dataValue, syncToClients = true) {
	if (entity != null) {
		if (isGameFeatureSupported("serverElements")) {
			return entity.setData(dataName, dataValue, syncToClients);
		}
	}
	return false;
}

// ===========================================================================

function removeEntityData(entity, dataName) {
	if (entity != null) {
		if (isGameFeatureSupported("serverElements")) {
			return entity.removeData(dataName);
		}
	}
	return false;
}

// ===========================================================================

function doesEntityDataExist(entity, dataName) {
	if (entity != null) {
		if (isGameFeatureSupported("serverElements")) {
			return (entity.getData(dataName) != null);
		} else {
			return false;
		}
	}
	return null;
}

// ===========================================================================

function disconnectPlayer(client) {
	client.disconnect();
}

// ===========================================================================

function getPlayerId(client) {
	return client.index;
}

// ===========================================================================

function getPlayerIP(client) {
	return client.ip;
}

// ===========================================================================

function getPlayerGameVersion(client) {
	client.gameVersion;
}

// ===========================================================================

function setPlayerNativeAdminState(client, state) {
	client.administrator = state;
}

// ===========================================================================

function despawnPlayer(client) {
	client.despawnPlayer();
}

// ===========================================================================

function getGame() {
	return server.game;
}

// ===========================================================================

function getCountryNameFromIP(ip) {
	if (module.geoip.getCountryName(ip)) {
		return module.geoip.getCountryName(ip);
	}
	return false;
}

// ===========================================================================

function getServerPort() {
	return server.port;
}

// ===========================================================================

function serverBanIP(ip, durationInMilliseconds = 0) {
	server.banIP(ip, durationInMilliseconds);
}

// ===========================================================================

function setVehicleTrunkState(vehicle, trunkState) {
	sendNetworkEventToPlayer("v.rp.veh.trunk", null, getVehicleForNetworkEvent(vehicle), trunkState);
}

// ===========================================================================

function addServerCommandHandler(command, handlerFunction) {
	addCommandHandler(command, handlerFunction);
}

// ===========================================================================

function addServerEventHandler(eventName, handlerFunction) {
	addEventHandler(eventName, function (event, ...args) {
		let result = handlerFunction.apply(this, args);
		if (result == false) {
			event.preventDefault();
		}
	});
}

// ===========================================================================

function bindServerEventHandler(eventName, bindTo, handlerFunction) {
	addEventHandler(eventName, bindTo, function (event, ...args) {
		let result = handlerFunction.apply(this, args);
		if (result == false) {
			event.preventDefault();
		}
	});
}

// ===========================================================================

function setElementName(element, name) {
	element.name = name;
}

// ===========================================================================

function hideElementForPlayer(element, client) {
	if (isNull(element)) {
		return false;
	}

	if (typeof element.setExistsFor == "undefined") {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Native.Connected] Hiding element ${element.id} for player ${getPlayerDisplayForConsole(client)}`);
	element.setExistsFor(client, false);
}

// ===========================================================================

function showElementForPlayer(element, client) {
	if (isNull(element)) {
		return false;
	}

	if (typeof element.setExistsFor == "undefined") {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Native.Connected] Showing element ${element.id} for player ${getPlayerDisplayForConsole(client)}`);
	element.setExistsFor(client, true);
}

// ===========================================================================

function setElementShownByDefault(element, state) {
	if (typeof element.netFlags == "undefined") {
		return false;
	}

	if (typeof element.defaultExistance == "undefined") {
		return false;
	}

	element.netFlags.defaultExistance = state;
}

// ===========================================================================

function createAttachedGameBlip(element, type, size, colour = toColour(255, 255, 255, 255)) {
	if (isGameFeatureSupported("attachedBlip")) {
		return game.createBlipAttachedTo(element, type, size, colour, true, false);
	}
}

// ===========================================================================

function deletePlayerPed(client) {
	if (isGameFeatureSupported("serverElements")) {
		destroyElement(client.player);
	} else {
		sendNetworkEventToPlayer("v.rp.deleteLocalPlayerPed", client);
	}

}

// ===========================================================================

function isPlayerOnBoat(client) {
	return false;
}

// ===========================================================================

function setServerName(name) {
	server.name = name;
}

// ===========================================================================

function setServerPassword(password) {
	//server.setPassword(password);
}

// ===========================================================================

function shutdownServer() {
	server.shutdown();
}

// ===========================================================================

function setServerRule(ruleName, ruleValue) {
	server.setRule(ruleName, ruleValue);
}

// ===========================================================================

function addAllEventHandlers() {
	addEventHandler("onResourceStart", onResourceStart);
	addEventHandler("onResourceStop", onResourceStop);
	addEventHandler("onProcess", onProcess);
	addEventHandler("onPlayerConnect", onPlayerConnect);
	addEventHandler("onPlayerJoin", onPlayerJoin);
	addEventHandler("onPlayerJoined", onPlayerJoined);
	addEventHandler("onPlayerChat", onPlayerChat);
	addEventHandler("onPlayerQuit", onPlayerQuit);
	addEventHandler("onElementStreamIn", onElementStreamIn);
	addEventHandler("onElementStreamOut", onElementStreamOut);
	addEventHandler("onPedSpawn", onPedSpawn);
	addEventHandler("onPedDeathEx", onPlayerDeath);

	addEventHandler("onPlayerCommand", function (event, client, command, params) {
		processPlayerCommand(command, params, client);
	});

	if (getGame() <= V_GAME_GTA_IV) {
		addEventHandler("onPedEnteredVehicle", onPedEnteredVehicle);
		addEventHandler("onPedExitedVehicle", onPedExitedVehicle);
	}

	if (getGame() == V_GAME_GTA_IV) {
		addEventHandler("onPedEnteredVehicleEx", onPedEnteredVehicle);
		addEventHandler("onPedExitedVehicleEx", onPedExitedVehicle);
	}

	if (getGame() <= V_GAME_GTA_SA) {
		addEventHandler("OnPickupCollected", onPedPickupPickedUp);
	}

	//if (getGame() == V_GAME_MAFIA_ONE) {
	//	addEventHandler("onPedEnteringVehicle", onPedEnteredVehicle);
	//	addEventHandler("onPedExitingVehicle", onPedExitedVehicle);
	//addEventHandler("onPedDeathEx", onPlayerDeath);
	//}
}

// ===========================================================================

function getVehicleOccupants(vehicle) {
	let occupants = [];

	let clients = getClients();
	for (let i in clients) {
		if (getPlayerVehicle(clients[i]) == vehicle) {
			occupants.push(clients[i]);
		}
	}

	return occupants;
}

// ===========================================================================

function getFirstFreeRearVehicleSeat(vehicle) {
	let occupants = [null, null, null, null];

	let clients = getClients();
	for (let i in clients) {
		if (getPlayerVehicle(clients[i]) == vehicle) {
			occupants[getPlayerVehicleSeat(clients[i])] = clients[i];
		}
	}

	if (occupants[2] == null) {
		return 2;
	}

	if (occupants[3] == null) {
		return 3;
	}

	// By this point, no rear seats are available. Check for front seat.
	if (occupants[1] == null) {
		return 1;
	}

	return -1;
}

// ===========================================================================

function setGameMinuteDuration(duration) {
	if (isGameFeatureSupported("time") && getGame() <= V_GAME_GTA_SA) {
		game.time.minuteDuration = duration;
	}
}

// ===========================================================================

function setPedBodyPart(ped, bodyPart, value) {
	switch (bodyPart) {
		case V_SKINSELECT_HEAD:
			setEntityData(ped, "v.rp.bodyPartHead", value, true);
			break;

		case V_SKINSELECT_UPPER:
			setEntityData(ped, "v.rp.bodyPartUpper", value, true);
			break;

		case V_SKINSELECT_LOWER:
			setEntityData(ped, "v.rp.bodyPartLower", value, true);
			break;

		case V_SKINSELECT_HAT:
			setEntityData(ped, "v.rp.bodyPropHead", value, true);
			break;
	}

	forcePlayerToSyncElementProperties(null, ped);
}

// ===========================================================================

function isServerScript() {
	return true;
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

function setPedBleeding(ped, state) {
	if (!isGameFeatureSupported("pedBleeding")) {
		return false;
	}

	setEntityData(ped, "v.rp.bleeding", state, true);
	sendNetworkEventToPlayer("v.rp.bleeding", null, ped.id, state);
}

// ===========================================================================

function loadArrayDataFromDatabase(queryString, dataClass) {
	let tempArray = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		dbAssoc = fetchQueryAssoc(dbConnection, queryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempData = new dataClass(dbAssoc[i]);
				tempArray.push(tempData);
			}
		}

		disconnectFromDatabase(dbConnection);
	}

	return tempArray;
}

// ===========================================================================

function setPedHeading(ped, heading) {
	ped.heading = heading;
	sendNetworkEventToPlayer("v.rp.elementHeading", null, ped.id, heading);
}

// ===========================================================================