// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: scoreboard.js
// DESC: Provides scoreboard features and rendering
// TYPE: Client (JavaScript)
// ===========================================================================

let scoreBoardTitleFont = null;
let scoreBoardListFont = null;

let pausedColour = COLOUR_RED;

let scoreBoardKey = null;

// ===========================================================================

function initScoreBoardScript() {
	logToConsole(LOG_DEBUG, "[V.RP.ScoreBoard]: Initializing scoreboard script ...");
	scoreBoardTitleFont = initScoreBoardTitleFont();
	scoreBoardListFont = initScoreBoardListFont();
	scoreBoardKey = getKeyIdFromParams("f5");
	logToConsole(LOG_DEBUG, "[V.RP.ScoreBoard]: Scoreboard script initialized!");
}

// ===========================================================================

function initScoreBoardTitleFont() {
	return lucasFont.createDefaultFont(22.0, "Roboto", "Regular");
}

// ===========================================================================

function initScoreBoardListFont() {
	return lucasFont.createDefaultFont(12.0, "Roboto", "Light");
}

// ===========================================================================

function processScoreBoardRendering() {
	if (!scriptInitialized) {
		return false;
	}

	if (!renderScoreBoard) {
		logToConsole(LOG_VERBOSE | LOG_ERROR, `[V.RP.ScoreBoard] Could not render scoreboard. Scoreboard rendering is disabled!`);
		return false;
	}

	if (scoreBoardListFont == null) {
		logToConsole(LOG_VERBOSE | LOG_ERROR, `[V.RP.ScoreBoard] Could not render scoreboard. List font is null!`);
		return false;
	}

	if (scoreBoardTitleFont == null) {
		logToConsole(LOG_VERBOSE | LOG_ERROR, `[V.RP.ScoreBoard] Could not render scoreboard. Title font is null!`);
		return false;
	}

	if (isAnyGUIActive()) {
		logToConsole(LOG_VERBOSE | LOG_ERROR, `[V.RP.ScoreBoard] Could not render scoreboard. A GUI window is active!`);
		return false;
	}

	if (scoreBoardKey == null) {
		return false;
	}

	if (typeof scoreBoardKey != "number") {
		return false;
	}

	if (!isKeyDown(scoreBoardKey)) {
		return false;
	}

	let scoreboardStart = (game.height / 2) - (Math.floor(getClients().length / 2) * 20);
	let titleSize = scoreBoardTitleFont.measure("PLAYERS", game.width, 0.0, 1.0, 10, false, false);
	scoreBoardTitleFont.render("PLAYERS", [game.width / 2, scoreboardStart - 50], 0, 0.5, 0.0, scoreBoardTitleFont.size, COLOUR_WHITE, false, false, false, true);

	titleSize = scoreBoardTitleFont.measure("____________________________", game.width, 0.0, 1.0, 10, false, false);
	scoreBoardTitleFont.render("____________________________", [game.width / 2, scoreboardStart - 35], 0, 0.5, 0.0, scoreBoardTitleFont.size, COLOUR_WHITE, false, false, false, true);

	let clients = getClients();
	for (let i in clients) {
		if (!clients[i].console) {
			let name = clients[i].name;
			let colour = COLOUR_WHITE;
			let paused = false;
			let ping = "-1";

			if (typeof playerNames[clients[i].name] != "undefined") {
				name = playerNames[clients[i].name];
			}

			if (typeof playerPaused[clients[i].name] != "undefined") {
				paused = playerPaused[clients[i].name];
			}

			if (typeof playerColours[clients[i].name] != "undefined") {
				colour = playerColours[clients[i].name];
			}

			if (typeof playerPing[clients[i].name] != "undefined") {
				ping = toString(playerPing[clients[i].name]);
			}

			// Player ID
			let text = String(clients[i].index);
			let size = scoreBoardListFont.measure(text, 75, 0.0, 1.0, 10, false, false);
			scoreBoardListFont.render(text, [game.width / 2 - 100, scoreboardStart + (i * 20)], 0, 0.5, 0.0, scoreBoardListFont.size, COLOUR_WHITE, false, false, false, true);

			// Player Name
			text = name;
			size = scoreBoardListFont.measure(text, 100, 0.0, 1.0, 10, false, false);
			scoreBoardListFont.render(text, [game.width / 2, scoreboardStart + (i * 20)], 0, 0.5, 0.0, scoreBoardListFont.size, colour, false, false, false, true);

			// Ping
			text = ping;
			size = scoreBoardListFont.measure(ping, 75, 0.0, 1.0, 10, false, false);
			scoreBoardListFont.render(ping, [game.width / 2 + 100, scoreboardStart + (i * 20)], 0, 0.5, 0.0, scoreBoardListFont.size, COLOUR_WHITE, false, false, false, true);

			// PAUSED Status (depends on resource "afk")
			if (paused == true) {
				size = scoreBoardListFont.measure("PAUSED", 100, 0.0, 1.0, 10, false, false);
				scoreBoardListFont.render("PAUSED", [game.width / 2 + 200, scoreboardStart + (i * 20)], 0, 0.5, 0.0, scoreBoardListFont.size, pausedColour, false, false, false, true);
			}
		}
	}
}

// ===========================================================================

function setScoreBoardKey(key) {
	if (key == -1) {
		scoreBoardKey = null;
	} else {
		scoreBoardKey = toInteger(key);
	}
}

// ===========================================================================