// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: nametags.js
// DESC: Provides nametag rendering
// TYPE: Client (JavaScript)
// ===========================================================================

// Configuration
let nametagFont = null;
let afkStatusFont = null;
let pingFont = null;
let nametagDistance = 50.0;
let nametagWidth = 70;
let nametagHeight = (getGame() == V_GAME_MAFIA_ONE) ? 2.0 : 0.9;

let playerNames = {};
let playerColours = {};
let playerPaused = {};
let playerPing = {};

// ===========================================================================

function initNameTagScript() {
	logToConsole(LOG_DEBUG, "[V.RP.NameTag]: Initializing nametag script ...");
	nametagFont = loadNameTagFont();
	afkStatusFont = loadPausedStatusFont();
	logToConsole(LOG_DEBUG, "[V.RP.NameTag]: Nametag script initialized!");
}

// ===========================================================================

function loadNameTagFont() {
	return lucasFont.createDefaultFont(12.0, "Roboto", "Light");
}

// ===========================================================================

function loadPausedStatusFont() {
	return lucasFont.createDefaultFont(18.0, "Roboto", "Light");
}

// ===========================================================================

function updatePlayerNameTag(clientName, characterName, colour, paused, ping) {
	if (profanityFilterEnabled) {
		characterName = replaceProfanityInMessage(characterName);
	}

	playerNames[clientName] = characterName;
	playerColours[clientName] = colour;
	playerPaused[clientName] = paused;
	playerPing[clientName] = ping;

	if (getGame() == V_GAME_GTA_IV) {
		let client = getPlayerFromParams(clientName);
		if (client != false) {
			if (getPlayerPed(client) != null) {
				getPlayerPed(client).removeNametag();
			}
		}
	}
}

// ===========================================================================

function updatePlayerPing(clientName, ping) {
	playerPing[clientName] = ping;
}

// ===========================================================================

function drawNametag(x, y, health, armour, text, ping, alpha, distance, colour, afk, skin) {
	if (nametagFont == null) {
		return false;
	}

	alpha *= 0.75;
	let width = nametagWidth;
	health = Math.max(0.0, Math.min(1.0, health));
	armour = Math.max(0.0, Math.min(1.0, armour));

	// Starts at bottom and works it's way up
	// -------------------------------------------
	// Health Bar

	if (getGame() == V_GAME_GTA_III) {
		// Mickey Hamfists is ridiculously tall. Raise the nametag for him a bit
		if (skin == 109) {
			y -= 15;
		}
	}

	y -= 5;

	if (health > 0.0) {
		let hx = x - width / 2;
		let hy = y - 10 / 2;
		let colourB = toColour(0, 0, 0, Math.floor(255.0 * alpha)); // Background colour (black)
		graphics.drawRectangle(null, [hx, hy], [width, 8], colourB, colourB, colourB, colourB);
		let colour = toColour(Math.floor(255.0 - (health * 255.0)), Math.floor(health * 255.0), 0, Math.floor(255.0 * alpha)); // Health bar colour (varies, depending on health)
		graphics.drawRectangle(null, [hx + 2, hy + 2], [(width - 4) * health, 10 - 6], colour, colour, colour, colour);
	}

	// Armour Bar
	if (armour > 0.0) {
		// Go up 10 pixels to draw the next part
		y -= 10;
		let hx = x - width / 2;
		let hy = y - 10 / 2;
		let colourB = toColour(255, 0, 0, 0); // Background colour (black)
		graphics.drawRectangle(null, [hx, hy], [width, 8], colourB, colourB, colourB, colourB);
		let colour = toColour(255, 255, 255, 255); // Armour bar colour (white)
		graphics.drawRectangle(null, [hx + 2, hy + 2], [(width - 4) * armour, 10 - 6], colour, colour, colour, colour);
	}

	y -= 20;

	// Nametag
	if (nametagFont != null) {
		let size = nametagFont.measure(text, game.width, 0.0, 0.0, nametagFont.size, false, false);
		nametagFont.render(text, [x - size[0] / 2, y - size[1] / 2], game.width, 0.0, 0.0, nametagFont.size, colour, false, false, false, true);
	}

	// Go up another 10 pixels for the next part
	y -= 20;

	// AFK Status
	if (afkStatusFont != null) {
		if (afk) {
			let size = afkStatusFont.measure(getLocaleString("Paused"), game.width, 0.0, 0.0, afkStatusFont.size, false, false);
			afkStatusFont.render(getLocaleString("Paused"), [x - size[0] / 2, y - size[1] / 2], game.width, 0.0, 0.0, afkStatusFont.size, toColour(255, 0, 0, 255), false, false, false, true);
		}
	}
}

// ===========================================================================

function updateNametag(element) {
	if (!isGameFeatureSupported("customNametag")) {
		return false;
	}

	if (element == null) {
		return false;
	}

	if (localPlayer != null) {
		let playerPosition = getLocalPlayerPosition();
		let elementPosition = element.position;

		elementPosition = getPosAbovePos(elementPosition, nametagHeight);

		let screenPosition = getScreenFromWorldPosition(elementPosition);
		if (screenPosition[2] >= 0.0 || getGame() == V_GAME_MAFIA_ONE) {
			let health = element.health / 100.0;
			if (health > 1.0) {
				health = 1.0;
			}

			let armour = element.armour / 100.0;
			if (armour > 1.0) {
				armour = 1.0;
			}

			let distance = playerPosition.distance(elementPosition);
			if (distance <= nametagDistance) {
				if (typeof game.processLineOfSight != "undefined") {
					let losCheck = game.processLineOfSight(playerPosition, elementPosition, true, false, false, true, true, false, true, true);
					if (losCheck != null) {
						return false;
					}
				}

				if (element.type == ELEMENT_PLAYER) {
					let name = element.name;
					let colour = COLOUR_WHITE;
					let paused = false;
					let ping = -1;

					if (typeof playerNames[element.name] != "undefined") {
						name = playerNames[element.name];
					}

					if (typeof playerPaused[element.name] != "undefined") {
						paused = playerPaused[element.name];
					}

					if (typeof playerColours[element.name] != "undefined") {
						colour = playerColours[element.name];
					}

					if (typeof playerPing[element.name] != "undefined") {
						ping = playerPing[element.name];
					}

					drawNametag(screenPosition[0], screenPosition[1], health, armour, name, ping, 1.0 - distance / nametagDistance, distance, colour, paused, element.skin);
				}
			}
		}
	}
}

// ===========================================================================

function getClientFromPlayer(player) {
	getClients().forEach(function (client) {
		if (getPlayerPed(client) == player) {
			return client;
		}
	});
}

// ===========================================================================

function processNameTagRendering(event) {
	//if(getGame() >= GAME_GTA_IV) {
	//	return false;
	//}

	getElementsByType(ELEMENT_PLAYER).forEach(function (player) {
		if (player != localPlayer) {
			if (getGame() == V_GAME_MAFIA_ONE) {
				if (player.vehicle != null) {
					return false;
				}
			}

			updateNametag(player);
		}
	});
}

// ===========================================================================

function createColour(alpha, red, green, blue) {
	return alpha << 24 | red << 16 | green << 8 | blue;
}

// ===========================================================================

function setNameTagDistance(distance) {
	nametagDistance = distance;
}

// ===========================================================================