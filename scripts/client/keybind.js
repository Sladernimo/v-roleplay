// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: keybind.js
// DESC: Provides keybind features
// TYPE: Client (JavaScript)
// ===========================================================================

let keyBinds = [];
let lastKeyBindUse = 0;
let keyBindDelayTime = 500;
let keyBindShortHoldDuration = 500;
let keyBindLongHoldDuration = 1500;

// ===========================================================================

function initKeyBindScript() {
	logToConsole(LOG_DEBUG, "[AGRP.KeyBind]: Initializing key bind script ...");
	logToConsole(LOG_DEBUG, "[AGRP.KeyBind]: Key bind script initialized!");
}

// ===========================================================================

function bindAccountKey(key, keyState) {
	logToConsole(LOG_DEBUG, `[AGRP.KeyBind]: Binded key ${toUpperCase(getKeyNameFromId(key))} (${key})`);
	keyBinds.push(toInteger(key));
	bindKey(toInteger(key), keyState, function (event) {
		if (isAnyGUIActive()) {
			return false;
		}

		if (hasKeyBindDelayElapsed()) {
			if (canLocalPlayerUseKeyBinds()) {
				logToConsole(LOG_DEBUG, `[AGRP.KeyBind]: Using keybind for key ${toUpperCase(getKeyNameFromId(key))} (${key})`);
				lastKeyBindUse = sdl.ticks;
				tellServerPlayerUsedKeyBind(key);
			} else {
				logToConsole(LOG_DEBUG, `[AGRP.KeyBind]: Failed to use keybind for key ${toUpperCase(getKeyNameFromId(key))} (${key}) - Not allowed to use keybinds!`);
			}
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.KeyBind]: Failed to use keybind for key ${toUpperCase(getKeyNameFromId(key))} (${key}) - Not enough time has passed since last keybind use!`);
		}
	});
}

// ===========================================================================

function unBindAccountKey(key) {
	logToConsole(LOG_DEBUG, `[AGRP.KeyBind]: Unbinded key ${toUpperCase(getKeyNameFromId(key))} (${key})`);
	unbindKey(key);
	keyBinds.splice(keyBinds.indexOf(key), 1);
	return true;
}

// ===========================================================================

function hasKeyBindDelayElapsed() {
	if (sdl.ticks - lastKeyBindUse >= keyBindDelayTime) {
		return true;
	}

	return false;
}

// ===========================================================================

function canLocalPlayerUseKeyBinds() {
	if (isAnyGUIActive()) {
		return false;
	}

	if (!isSpawned) {
		return false;
	}

	if (itemActionDelayEnabled) {
		return false;
	}

	return true;
}

// ===========================================================================

function clearKeyBinds() {
	for (let i in keyBinds) {
		unbindKey(keyBinds[i]);
	}
	keyBinds = [];
}

// ===========================================================================