// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: skin-select.js
// DESC: Provides skin-selector functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let skinSelectMessageFontTop = null;
let skinSelectMessageFontBottom = null;
let skinSelectMessageTextTop = "Skin Name";
let skinSelectMessageTextBottom = "Choose a skin using LEFT and RIGHT arrow keys. Use ENTER to finish or BACKSPACE to cancel.";
let skinSelectMessageTextBottomParts = "Use UP and DOWN keys to select a body part to change.";
let skinSelectMessageColourTop = COLOUR_YELLOW;
let skinSelectMessageColourBottom = COLOUR_WHITE;

let usingSkinSelector = false;
let skinSelectorIndex = 0;

let skinSelectHead = [0, 0];
let skinSelectUpper = [0, 0];
let skinSelectLower = [0, 0];
let skinSelectHat = 0;

let skinSelectPosition = null;
let skinSelectHeading = null;

let skinSelectPart = 0;

let maxBodyPartVariants = 3;

let skinSelectForceSkin = -1;

let skinSelectParts = [
	{ name: "Skin", id: V_SKINSELECT_SKIN },
	{ name: "Head", id: V_SKINSELECT_HEAD },
	{ name: "UpperBody", id: V_SKINSELECT_UPPER },
	{ name: "LowerBody", id: V_SKINSELECT_LOWER },
	{ name: "Hat", id: V_SKINSELECT_HAT },
];

// ===========================================================================

function initSkinSelectScript() {
	logToConsole(LOG_DEBUG, "[V.RP.SkinSelect]: Initializing skin selector script ...");
	skinSelectMessageFontTop = loadSkinSelectMessageFontTop();
	skinSelectMessageFontBottom = loadSkinSelectMessageFontBottom();
	logToConsole(LOG_DEBUG, "[V.RP.SkinSelect]: Skin selector script initialized!");
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
		if (keyCode == getKeyIdFromParams("up") || keyCode == getKeyIdFromParams("w")) {
			if (!isGameFeatureSupported("customBodyPart")) {
				return false;
			}

			let lowestSkinSelectPart = (skinSelectForceSkin == -1) ? 0 : 1;

			if (skinSelectPart == lowestSkinSelectPart) {
				skinSelectPart = skinSelectParts.length - 1;
			} else {
				skinSelectPart = skinSelectPart - 1;
			}
		} else if (keyCode == getKeyIdFromParams("down") || keyCode == getKeyIdFromParams("s")) {
			if (!isGameFeatureSupported("customBodyPart")) {
				return false;
			}

			let lowestSkinSelectPart = (skinSelectForceSkin == -1) ? 0 : 1;

			if (skinSelectPart >= skinSelectParts.length - 1) {
				skinSelectPart = lowestSkinSelectPart;
			} else {
				skinSelectPart = skinSelectPart + 1;
			}
		} else if (keyCode == getKeyIdFromParams("left") || keyCode == getKeyIdFromParams("a")) {
			switch (skinSelectParts[skinSelectPart].id) {
				case V_SKINSELECT_SKIN:
					if (skinSelectorIndex == 0) {
						skinSelectorIndex = allowedSkins.length - 1;
					} else {
						skinSelectorIndex = skinSelectorIndex - 1;
					}
					logToConsole(LOG_DEBUG, `Switching to skin ${allowedSkins[skinSelectorIndex][1]} (Index: ${skinSelectorIndex}, Skin: ${allowedSkins[skinSelectorIndex][0]})`);
					skinSelectMessageTextTop = allowedSkins[skinSelectorIndex][1];
					setLocalPlayerSkin(allowedSkins[skinSelectorIndex][0]);
					break;

				case V_SKINSELECT_HEAD:
					if (!isGameFeatureSupported("customBodyPart")) {
						return false;
					}

					// If reached end of models and textures, reset both to 0
					if (skinSelectHead[0] == maxBodyPartVariants) {
						skinSelectHead = [0, 0];
					} else {
						// If reached end of textures, increment model and reset texture to 0
						if (skinSelectHead[1] >= maxBodyPartVariants) {
							skinSelectHead = [skinSelectHead[0] + 1, 0];
						} else {
							skinSelectHead = [skinSelectHead[0], skinSelectHead[1] + 1];
						}
					}
					//skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", "Head");
					setLocalPlayerBodyPart(0, skinSelectHead[0], skinSelectHead[1]);
					break;

				case V_SKINSELECT_UPPER:
					if (!isGameFeatureSupported("customBodyPart")) {
						return false;
					}

					// If reached end of models and textures, reset both to 0
					if (skinSelectUpper[0] == maxBodyPartVariants) {
						skinSelectUpper = [0, 0];
					} else {
						// If reached end of textures, increment model and reset texture to 0
						if (skinSelectUpper[1] >= maxBodyPartVariants) {
							skinSelectUpper = [skinSelectUpper[0] + 1, 0];
						} else {
							skinSelectUpper = [skinSelectUpper[0], skinSelectUpper[1] + 1];
						}
					}
					//skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", "UpperBody");
					setLocalPlayerBodyPart(1, skinSelectUpper[0], skinSelectUpper[1]);
					break;

				case V_SKINSELECT_LOWER:
					if (!isGameFeatureSupported("customBodyPart")) {
						return false;
					}

					// If reached end of models and textures, reset both to 0
					if (skinSelectLower[0] == maxBodyPartVariants) {
						skinSelectLower = [0, 0];
					} else {
						// If reached end of textures, increment model and reset texture to 0
						if (skinSelectLower[1] >= maxBodyPartVariants) {
							skinSelectLower = [skinSelectLower[0] + 1, 0];
						} else {
							skinSelectLower = [skinSelectLower[0], skinSelectLower[1] + 1];
						}
					}
					//skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", "LowerBody");
					setLocalPlayerBodyPart(2, skinSelectLower[0], skinSelectLower[1]);
					break;

				case V_SKINSELECT_HAT:
					if (!isGameFeatureSupported("customBodyPart")) {
						return false;
					}

					if (skinSelectHat == maxBodyPartVariants) {
						skinSelectHat = 0;
					} else {
						skinSelectHat = skinSelectHat + 1;
					}
					skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", "Hat");
					natives.setCharPropIndex(localPlayer, 0, skinSelectHat);
					break;
			}
		} else if (keyCode == getKeyIdFromParams("right") || keyCode == getKeyIdFromParams("d")) {
			switch (skinSelectParts[skinSelectPart].id) {
				case V_SKINSELECT_SKIN:
					if (skinSelectorIndex == allowedSkins.length - 1) {
						skinSelectorIndex = 0;
					} else {
						skinSelectorIndex = skinSelectorIndex + 1;
					}
					logToConsole(LOG_DEBUG, `Switching to skin ${allowedSkins[skinSelectorIndex][1]} (Index: ${skinSelectorIndex}, Skin: ${allowedSkins[skinSelectorIndex][0]})`);
					//skinSelectMessageTextTop = allowedSkins[skinSelectorIndex][1];
					setLocalPlayerSkin(allowedSkins[skinSelectorIndex][0]);
					break;

				case V_SKINSELECT_HEAD:
					if (!isGameFeatureSupported("customBodyPart")) {
						return false;
					}

					// If reached beginning of models and textures, reset both to max
					if (skinSelectHead[0] == 0) {
						skinSelectHead = [maxBodyPartVariants, maxBodyPartVariants];
					} else {
						// If reached beginning of textures, decrement model and reset texture to max
						if (skinSelectHead[1] == 0) {
							skinSelectHead = [skinSelectHead[0] - 1, maxBodyPartVariants];
						} else {
							skinSelectHead = [skinSelectHead[0], skinSelectHead[1] - 1];
						}
					}
					//skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", "Head");
					setLocalPlayerBodyPart(0, skinSelectHead[0], skinSelectHead[1]);
					break;

				case V_SKINSELECT_UPPER:
					if (!isGameFeatureSupported("customBodyPart")) {
						return false;
					}

					// If reached end of models and textures, reset both to 0
					if (skinSelectUpper[0] == 0) {
						skinSelectUpper = [maxBodyPartVariants, maxBodyPartVariants];
					} else {
						// If reached beginning of textures, decrement model and reset texture to max
						if (skinSelectUpper[1] <= 0) {
							skinSelectUpper = [skinSelectUpper[0] - 1, maxBodyPartVariants];
						} else {
							skinSelectUpper = [skinSelectUpper[0], skinSelectUpper[1] - 1];
						}
					}
					//skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", "UpperBody");
					setLocalPlayerBodyPart(1, skinSelectUpper[0], skinSelectUpper[1]);
					break;

				case V_SKINSELECT_LOWER:
					if (!isGameFeatureSupported("customBodyPart")) {
						return false;
					}

					// If reached end of models and textures, reset both to 0
					if (skinSelectLower[0] == 0) {
						skinSelectLower = [maxBodyPartVariants, maxBodyPartVariants];
					} else {
						// If reached beginning of textures, decrement model and reset texture to max
						if (skinSelectLower[1] <= 0) {
							skinSelectLower = [skinSelectLower[0] - 1, maxBodyPartVariants];
						} else {
							skinSelectLower = [skinSelectLower[0], skinSelectLower[1] - 1];
						}
					}
					//skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", "LowerBody");
					setLocalPlayerBodyPart(2, skinSelectLower[0], skinSelectLower[1]);
					break;

				case V_SKINSELECT_HAT:
					if (!isGameFeatureSupported("customBodyPart")) {
						return false;
					}

					if (skinSelectHat == 0) {
						skinSelectHat = maxBodyPartVariants;
					} else {
						skinSelectHat = skinSelectHat - 1;
					}
					//skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", "Hat");
					natives.setCharPropIndex(localPlayer, 0, skinSelectHat);
					break;
			}
		} else if (keyCode == getKeyIdFromParams("enter")) {
			let skinIndex = skinSelectForceSkin;
			if (skinSelectForceSkin == -1) {
				skinIndex = getSkinIndexFromModel(allowedSkins[skinSelectorIndex][0]);
			}

			sendNetworkEventToServer("v.rp.skinSelected", skinIndex, skinSelectHead, skinSelectUpper, skinSelectLower, skinSelectHat);
			toggleSkinSelect(false);
			return true;
		} else if (keyCode == getKeyIdFromParams("backspace")) {
			sendNetworkEventToServer("v.rp.skinCanceled");
			toggleSkinSelect(false);
			return true;
		}

		if (skinSelectParts[skinSelectPart].id == V_SKINSELECT_SKIN) {
			skinSelectMessageTextTop = allowedSkins[skinSelectorIndex][1];
		} else {
			skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", skinSelectParts[skinSelectPart].name);
		}

		if (getGame() <= V_GAME_GTA_SA) {
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
				if (isGameFeatureSupported("customBodyPart")) {
					skinSelectMessageFontBottom.render(skinSelectMessageTextBottomParts, [0, game.height - 30], game.width, 0.5, 0.0, skinSelectMessageFontBottom.size, skinSelectMessageColourBottom, true, true, false, true);
				}
			}
		}
	}
}

// ===========================================================================

function toggleSkinSelect(state, forceCurrentSkin) {
	if (state) {
		skinSelectorIndex = forceCurrentSkin;
		if (forceCurrentSkin == -1) {
			skinSelectorIndex = getAllowedSkinIndexFromSkin(gameData.skins[getGame()][0][0]);
			//setLocalPlayerSkin(allowedSkins[skinSelectorIndex][0]);
		} else {
			//setLocalPlayerSkin(gameData.skins[getGame()][forceCurrentSkin][0]);
		}

		if (!skinSelectorIndex) {
			skinSelectorIndex = 0;
		}

		usingSkinSelector = true;
		skinSelectPosition = localPlayer.position;
		skinSelectHeading = localPlayer.heading;
		skinSelectForceSkin = forceCurrentSkin;
		skinSelectPart = (skinSelectForceSkin == -1) ? 0 : 1;

		skinSelectHead = [0, 0];
		skinSelectUpper = [0, 0];
		skinSelectLower = [0, 0];
		skinSelectHat = 0;

		if (isCustomCameraSupported()) {
			let cameraPosition = localPlayer.position;
			let playerPosition = localPlayer.position;
			if (getGame() == V_GAME_MAFIA_ONE) {
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

		if (forceCurrentSkin == -1) {
			setLocalPlayerSkin(allowedSkins[skinSelectorIndex][0]);
		} else {
			setLocalPlayerSkin(gameData.skins[getGame()][forceCurrentSkin][0]);
		}

		if (getGame() == V_GAME_GTA_IV) {
			setLocalPlayerBodyPart(0, skinSelectHead[0], skinSelectHead[1]);
			setLocalPlayerBodyPart(1, skinSelectUpper[0], skinSelectUpper[1]);
			setLocalPlayerBodyPart(2, skinSelectLower[0], skinSelectLower[1]);
			natives.setCharPropIndex(localPlayer, 0, skinSelectHat);
		}

		if (skinSelectParts[skinSelectPart].id == V_SKINSELECT_SKIN) {
			if (forceCurrentSkin == -1) {
				skinSelectMessageTextTop = allowedSkins[skinSelectorIndex][1];
			} else {
				skinSelectMessageTextTop = gameData.skins[getGame()][forceCurrentSkin][1];
			}
		} else {
			skinSelectMessageTextTop = getGroupedLocaleString("SkinSelectBodyPartNames", skinSelectParts[skinSelectPart].name);
		}

		setLocalPlayerControlState(false, false);
	} else {
		usingSkinSelector = false;
		setLocalPlayerControlState(false, false);
	}
}

// ===========================================================================