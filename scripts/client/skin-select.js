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
let skinSelectMessageTextBottom = "Choose a skin using PAGEUP and PAGEDOWN keys. Use ENTER to finish or BACKSPACE to cancel.";
let skinSelectMessageColourTop = COLOUR_YELLOW;
let skinSelectMessageColourBottom = COLOUR_WHITE;

let usingSkinSelector = false;
let skinSelectorIndex = 0;

let skinSelectPosition = null;
let skinSelectHeading = null;

// ===========================================================================

function initSkinSelectScript() {
	logToConsole(LOG_DEBUG, "[VRR.SkinSelect]: Initializing skin selector script ...");
	skinSelectMessageFontTop = loadSkinSelectMessageFontTop();
	skinSelectMessageFontBottom = loadSkinSelectMessageFontBottom();
	logToConsole(LOG_DEBUG, "[VRR.SkinSelect]: Skin selector script initialized!");
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
		if (keyCode == SDLK_LEFT || keyCode == SDLK_A) {
			if (skinSelectorIndex >= allowedSkins.length - 1) {
				skinSelectorIndex = 1;
			} else {
				skinSelectorIndex = skinSelectorIndex + 1;
			}
			logToConsole(LOG_DEBUG, `Switching to skin ${allowedSkins[skinSelectorIndex][1]} (Index: ${skinSelectorIndex}, Skin: ${allowedSkins[skinSelectorIndex][0]})`);
			skinSelectMessageTextTop = allowedSkins[skinSelectorIndex][1];
			setLocalPlayerSkin(allowedSkins[skinSelectorIndex][0]);
		} else if (keyCode == SDLK_RIGHT || keyCode == SDLK_D) {
			if (skinSelectorIndex <= 0) {
				skinSelectorIndex = allowedSkins.length - 1;
			} else {
				skinSelectorIndex = skinSelectorIndex - 1;
			}
			logToConsole(LOG_DEBUG, `Switching to skin ${allowedSkins[skinSelectorIndex][1]} (Index: ${skinSelectorIndex}, Skin: ${allowedSkins[skinSelectorIndex][0]})`);
			skinSelectMessageTextTop = allowedSkins[skinSelectorIndex][1];
			setLocalPlayerSkin(allowedSkins[skinSelectorIndex][0]);
		} else if (keyCode == SDLK_RETURN) {
			sendNetworkEventToServer("agrp.skinSelected", skinSelectorIndex);
			toggleSkinSelect(false);
			return true;
		} else if (keyCode == SDLK_BACKSPACE) {
			sendNetworkEventToServer("agrp.skinSelected", -1);
			toggleSkinSelect(false);
			return true;
		}
		localPlayer.heading = skinSelectHeading;
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
			let tempPosition = localPlayer.position;
			tempPosition.z += 0.5;
			let frontCameraPosition = getPosInFrontOfPos(tempPosition, localPlayer.heading, 3);
			game.setCameraLookAt(frontCameraPosition, localPlayer.position, true);
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