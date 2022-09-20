// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: skin-select.js
// DESC: Provides skin-selector functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let skinSelectMessageFontTop = null;
let skinSelectMessageFontBottom = null;
let skinSelectMessageTextTop = "Skin Name";
let skinSelectMessageTextBottom = "Choose a skin using LEFT and RIGHT arrow keys. Use ENTER to finish or BACKSPACE to cancel.";
let skinSelectMessageColourTop = COLOUR_YELLOW;
let skinSelectMessageColourBottom = COLOUR_WHITE;

let usingSkinSelector = false;
let skinSelectorIndex = 0;

let skinSelectPosition = null;
let skinSelectHeading = null;

// ===========================================================================

function initSkinSelectScript() {
	logToConsole(LOG_DEBUG, "[AGRP.SkinSelect]: Initializing skin selector script ...");
	skinSelectMessageFontTop = loadSkinSelectMessageFontTop();
	skinSelectMessageFontBottom = loadSkinSelectMessageFontBottom();
	logToConsole(LOG_DEBUG, "[AGRP.SkinSelect]: Skin selector script initialized!");
}

// ===========================================================================

function loadSkinSelectMessageFontTop() {
	return lucasFont.createDefaultFont(20.0, "Roboto");
}

// ===========================================================================

function loadSkinSelectMessageFontBottom() {
	return lucasFont.createDefaultFont(12.0, "Roboto", "Light");
}

// ===========================================================================

function processSkinSelectKeyPress(keyCode) {
	if (usingSkinSelector) {
		if (keyCode == getKeyIdFromParams("left") || keyCode == getKeyIdFromParams("a")) {
			if (skinSelectorIndex >= allowedSkins.length - 1) {
				skinSelectorIndex = 1;
			} else {
				skinSelectorIndex = skinSelectorIndex + 1;
			}
			logToConsole(LOG_DEBUG, `Switching to skin ${allowedSkins[skinSelectorIndex][1]} (Index: ${skinSelectorIndex}, Skin: ${allowedSkins[skinSelectorIndex][0]})`);
			skinSelectMessageTextTop = allowedSkins[skinSelectorIndex][1];
			setLocalPlayerSkin(allowedSkins[skinSelectorIndex][0]);
		} else if (keyCode == getKeyIdFromParams("right") || keyCode == getKeyIdFromParams("d")) {
			if (skinSelectorIndex <= 0) {
				skinSelectorIndex = allowedSkins.length - 1;
			} else {
				skinSelectorIndex = skinSelectorIndex - 1;
			}
			logToConsole(LOG_DEBUG, `Switching to skin ${allowedSkins[skinSelectorIndex][1]} (Index: ${skinSelectorIndex}, Skin: ${allowedSkins[skinSelectorIndex][0]})`);
			skinSelectMessageTextTop = allowedSkins[skinSelectorIndex][1];
			setLocalPlayerSkin(allowedSkins[skinSelectorIndex][0]);
		} else if (keyCode == getKeyIdFromParams("enter")) {
			sendNetworkEventToServer("agrp.skinSelected", skinSelectorIndex);
			toggleSkinSelect(false);
			return true;
		} else if (keyCode == getKeyIdFromParams("backspace")) {
			sendNetworkEventToServer("agrp.skinSelected", -1);
			toggleSkinSelect(false);
			return true;
		}

		if (getGame() <= AGRP_GAME_GTA_SA) {
			localPlayer.heading = skinSelectHeading;
		}
	}
}

// ===========================================================================

function processSkinSelectRendering() {
	if (usingSkinSelector) {
		if (skinSelectMessageFontTop != null && skinSelectMessageFontBottom != null) {
			if (skinSelectMessageTextTop != "" && skinSelectMessageTextBottom != "") {
				skinSelectMessageFontTop.render(skinSelectMessageTextTop, [0, game.height - 100], game.width, 0.5, 0.0, skinSelectMessageFontTop.size, skinSelectMessageColourTop, true, true, false, true);
				skinSelectMessageFontBottom.render(skinSelectMessageTextBottom, [0, game.height - 65], game.width, 0.5, 0.0, skinSelectMessageFontBottom.size, skinSelectMessageColourBottom, true, true, false, true);
			}
		}
	}
}

// ===========================================================================

function toggleSkinSelect(state) {
	if (state) {
		skinSelectorIndex = getAllowedSkinIndexFromSkin(localPlayer.skin);
		if (!skinSelectorIndex) {
			skinSelectorIndex = 0;
		}

		usingSkinSelector = true;
		skinSelectPosition = localPlayer.position;
		skinSelectHeading = localPlayer.heading;

		if (isCustomCameraSupported()) {
			let cameraPosition = localPlayer.position;
			let playerPosition = localPlayer.position;
			if (getGame() == AGRP_GAME_MAFIA_ONE) {
				cameraPosition.y += 1.5;
				playerPosition.y += 1.5;
				distance = 3;
			} else {
				cameraPosition.z += 0.5;
				distance = 3;
			}
			let frontCameraPosition = getPosInFrontOfPos(cameraPosition, localPlayer.heading, distance);
			game.setCameraLookAt(frontCameraPosition, playerPosition, true);
		}

		if (getGame() == AGRP_GAME_GTA_IV) {
			let skinId = allowedSkins[skinSelectorIndex][0];
			if (natives.isModelInCdimage(skinId)) {
				natives.requestModel(skinId);
				natives.loadAllObjectsNow();
				if (natives.hasModelLoaded(skinId)) {
					natives.changePlayerModel(natives.getPlayerId(), skinId);
				}
			}
		} else {
			localPlayer.skin = allowedSkins[skinSelectorIndex][0];
		}

		skinSelectMessageTextTop = allowedSkins[skinSelectorIndex][1];
		setLocalPlayerControlState(false, false);
	} else {
		usingSkinSelector = false;
		setLocalPlayerControlState(false, false);
	}
}

// ===========================================================================