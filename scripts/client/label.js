// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: labels.js
// DESC: Provides functionality for world labels (3D labels)
// TYPE: Client (JavaScript)
// ===========================================================================

let businessLabels = [];
let houseLabels = [];
let jobLabels = [];

let propertyLabelNameFont = null;
let propertyLabelLockedFont = null;
let propertyLabelHeight = (getGame() == AGRP_GAME_MAFIA_ONE) ? 2.0 : 1.0;
let propertyPickupRenderDistance = 75.0;
let propertyLabelRenderDistance = 5.0;
let propertyLabelLockedOffset = 16;
let propertyLabelNameOffset = 20;
let propertyLabelPriceOffset = 16;

let jobNameLabelFont = null;
let jobHelpLabelFont = null;

let unlockedColour = toColour(50, 205, 50, 255);
let lockedColour = toColour(205, 92, 92, 255);
let jobHelpColour = toColour(234, 198, 126, 255);

// ===========================================================================

function initLabelScript() {
	logToConsole(LOG_DEBUG, "[AGRP.Label]: Initializing label script ...");
	propertyLabelNameFont = initLabelPropertyNameFont();
	propertyLabelLockedFont = initLabelPropertyLockedFont();
	jobNameLabelFont = initLabelJobNameFont();
	jobHelpLabelFont = initLabelJobHelpFont();
	logToConsole(LOG_DEBUG, "[AGRP.Label]: Label script initialized!");
}

// ===========================================================================

function initLabelPropertyNameFont() {
	return lucasFont.createDefaultFont(16.0, "Roboto", "Regular");
}

// ===========================================================================

function initLabelPropertyLockedFont() {
	return lucasFont.createDefaultFont(12.0, "Roboto", "Light");
}

// ===========================================================================

function initLabelJobNameFont() {
	return lucasFont.createDefaultFont(16.0, "Roboto", "Regular");
}

// ===========================================================================

function initLabelJobHelpFont() {
	return lucasFont.createDefaultFont(10.0, "Roboto", "Light");
}

// ===========================================================================

function renderPropertyEntranceLabel(name, position, locked, isBusiness, price, rentPrice, labelInfoType, fee) {
	if (localPlayer == null) {
		return false;
	}

	if (propertyLabelNameFont == null) {
		return false;
	}

	if (propertyLabelLockedFont == null) {
		return false;
	}

	if (getGame() == AGRP_GAME_GTA_IV) {
		if (!natives.doesViewportExist(natives.getGameViewportId())) {
			logToConsole(LOG_INFO, "[AGRP.Label]: Game viewport does not exist!");
			return false;
		}

		if (!natives.isViewportActive(natives.getGameViewportId())) {
			logToConsole(LOG_INFO, "[AGRP.Label]: Game viewport is not active!");
			return false;
		}
	}

	position = getPosAbovePos(position, propertyLabelHeight);
	let screenPosition = new Vec3(0.0, 0.0, 0.0);
	if (getGame() == AGRP_GAME_GTA_IV) {
		screenPosition = natives.getViewportPositionOfCoord(position, natives.getGameViewportId());
	} else {
		screenPosition = getScreenFromWorldPosition(position);
	}

	logToConsole(LOG_VERBOSE, `[AGRP.Label] World [${position.x}, ${position.y}, ${position.z}] to screen [${screenPosition.x}, ${screenPosition.y}, ${screenPosition.z}]`);

	if (screenPosition.x < 0 || screenPosition.x > game.width) {
		return false;
	}

	let text = "";
	if (toInteger(price) > 0) {
		text = getLocaleString("PropertyForSaleLabel", getCurrencyString(price));
		let size = propertyLabelLockedFont.measure(text, game.width, 0.0, 0.0, propertyLabelLockedFont.size, true, true);
		propertyLabelLockedFont.render(text, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, propertyLabelLockedFont.size, toColour(200, 200, 200, 255), false, true, false, true);

		screenPosition.y -= propertyLabelPriceOffset;
	}

	text = "";
	if (toInteger(rentPrice) > 0) {
		text = getLocaleString("PropertyForRentLabel", getCurrencyString(rentPrice));
		let size = propertyLabelLockedFont.measure(text, game.width, 0.0, 0.0, propertyLabelLockedFont.size, true, true);
		propertyLabelLockedFont.render(text, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, propertyLabelLockedFont.size, toColour(200, 200, 200, 255), false, true, false, true);

		screenPosition.y -= propertyLabelPriceOffset;
	}

	text = "";
	if (toInteger(fee) > 0) {
		text = getLocaleString("PropertyEntranceFeeLabel", getCurrencyString(fee));
		let size = propertyLabelLockedFont.measure(text, game.width, 0.0, 0.0, propertyLabelLockedFont.size, true, true);
		propertyLabelLockedFont.render(text, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, propertyLabelLockedFont.size, toColour(200, 200, 200, 255), false, true, false, true);

		screenPosition.y -= propertyLabelPriceOffset;
	}

	if (isBusiness) {
		text = (locked) ? toUpperCase(getLocaleString("Closed")) : toUpperCase(getLocaleString("Open"));
	} else {
		text = (locked) ? toUpperCase(getLocaleString("Locked")) : toUpperCase(getLocaleString("Unlocked"));
	}

	if (!locked && labelInfoType != AGRP_PROPLABEL_INFO_NONE) {
		let infoText = "";
		switch (labelInfoType) {
			case AGRP_PROPLABEL_INFO_ENTER: {
				if (enterPropertyKey) {
					infoText = getLocaleString("PropertyEnterKeyPressLabel", toUpperCase(getKeyNameFromId(enterPropertyKey)));
				} else {
					infoText = getLocaleString("PropertyEnterCommandLabel", "/enter");
				}
				break;
			}

			case AGRP_PROPLABEL_INFO_BUY: {
				infoText = getLocaleString("BusinessBuyItemsLabel", "/buy");
				break;
			}

			case AGRP_PROPLABEL_INFO_BUYBIZ: {
				infoText = getLocaleString("BuyBusinessLabel", "/bizbuy");
				break;
			}

			case AGRP_PROPLABEL_INFO_BUYHOUSE: {
				infoText = getLocaleString("BuyHouseLabel", "/housebuy");
				break;
			}

			case AGRP_PROPLABEL_INFO_RENTHOUSE: {
				infoText = getLocaleString("RentHouseLabel", "/houserent");
				break;
			}

			case AGRP_PROPLABEL_INFO_ENTERVEHICLE: {
				infoText = getLocaleString("VehicleDealershipLabel");
				break;
			}

			default: {
				if (enterPropertyKey) {
					infoText = getLocaleString("PropertyEnterKeyPressLabel", toUpperCase(getKeyNameFromId(enterPropertyKey)));
				} else {
					infoText = getLocaleString("PropertyEnterCommandLabel", "/enter");
				}
				break;
			}
		}
		if (getDistance(localPlayer.position, position) <= propertyLabelRenderDistance - 2) {
			let size = propertyLabelLockedFont.measure(infoText, game.width, 0.0, 0.0, propertyLabelLockedFont.size, true, true);
			propertyLabelLockedFont.render(infoText, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, propertyLabelLockedFont.size, toColour(234, 198, 126, 255), false, true, false, true);
			screenPosition.y -= propertyLabelLockedOffset;
		}
	}

	let size = propertyLabelLockedFont.measure(text, game.width, 0.0, 0.0, propertyLabelLockedFont.size, true, true);
	propertyLabelLockedFont.render(text, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, propertyLabelLockedFont.size, (locked) ? lockedColour : unlockedColour, false, true, false, true);

	screenPosition.y -= propertyLabelNameOffset;

	text = name || " ";
	if (profanityFilterEnabled) {
		text = replaceProfanityInMessage(text);
	}

	size = propertyLabelNameFont.measure(text, game.width, 0.0, 0.0, propertyLabelNameFont.size, true, true);
	propertyLabelNameFont.render(text, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, propertyLabelNameFont.size, (isBusiness) ? toColour(0, 153, 255, 255) : toColour(17, 204, 17, 255), false, true, false, true);
}

// -------------------------------------------------------------------------

function renderPropertyExitLabel(position) {
	if (localPlayer == null) {
		return false;
	}

	if (propertyLabelNameFont == null) {
		return false;
	}

	if (propertyLabelLockedFont == null) {
		return false;
	}

	if (getGame() == AGRP_GAME_GTA_IV) {
		if (!natives.doesViewportExist(natives.getGameViewportId())) {
			logToConsole(LOG_INFO, "[AGRP.Label]: Game viewport does not exist!");
			return false;
		}

		if (!natives.isViewportActive(natives.getGameViewportId())) {
			logToConsole(LOG_INFO, "[AGRP.Label]: Game viewport is not active!");
			return false;
		}
	}

	let tempPosition = position;
	tempPosition.z = tempPosition.z + propertyLabelHeight;
	let screenPosition = new Vec3(0.0, 0.0, 0.0);
	if (getGame() == AGRP_GAME_GTA_IV) {
		screenPosition = natives.getViewportPositionOfCoord(tempPosition, natives.getGameViewportId());
	} else {
		screenPosition = getScreenFromWorldPosition(tempPosition);
	}

	if (screenPosition.x < 0 || screenPosition.x > game.width) {
		return false;
	}

	let text = "EXIT";
	let size = propertyLabelNameFont.measure(text, game.width, 0.0, 0.0, propertyLabelNameFont.size, true, true);
	propertyLabelNameFont.render(text, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, propertyLabelNameFont.size, COLOUR_WHITE, false, true, false, true);
}

// -------------------------------------------------------------------------

function renderJobLabel(name, position, jobType) {
	if (localPlayer == null) {
		return false;
	}

	if (jobNameLabelFont == null) {
		return false;
	}

	if (jobHelpLabelFont == null) {
		return false;
	}

	if (getGame() == AGRP_GAME_GTA_IV) {
		if (!natives.doesViewportExist(natives.getGameViewportId())) {
			logToConsole(LOG_INFO, "[AGRP.Label]: Game viewport does not exist!");
			return false;
		}

		if (!natives.isViewportActive(natives.getGameViewportId())) {
			logToConsole(LOG_INFO, "[AGRP.Label]: Game viewport is not active!");
			return false;
		}
	}

	let tempPosition = position;
	tempPosition.z = tempPosition.z + propertyLabelHeight;
	let screenPosition = new Vec3(0.0, 0.0, 0.0);
	if (getGame() == AGRP_GAME_GTA_IV) {
		screenPosition = natives.getViewportPositionOfCoord(tempPosition, natives.getGameViewportId());
	} else {
		screenPosition = getScreenFromWorldPosition(tempPosition);
	}

	if (screenPosition.x < 0 || screenPosition.x > game.width) {
		return false;
	}

	let text = "";
	if (jobType == localPlayerJobType) {
		if (localPlayerWorking) {
			text = getLocaleString("JobEquipAndUniformLabel", "/equip", "/uniform", "/stopwork");
		} else {
			text = getLocaleString("StartWorkLabel", "/startwork");
		}
	} else {
		if (localPlayerJobType == 0) {
			text = getLocaleString("TakeJobLabel", "/takejob");
		} else {
			text = getLocaleString("NotYourJobLabel", "/quitjob");
		}
	}

	let size = jobHelpLabelFont.measure(text, game.width, 0.0, 0.0, jobHelpLabelFont.size, true, true);
	jobHelpLabelFont.render(text, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, jobHelpLabelFont.size, COLOUR_YELLOW, false, true, false, true);

	screenPosition.y -= 18;

	text = getLocaleString("JobLabel", name);
	size = jobNameLabelFont.measure(text, game.width, 0.0, 0.0, jobNameLabelFont.size, true, true);
	jobNameLabelFont.render(text, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, jobNameLabelFont.size, COLOUR_WHITE, false, true, false, true);
}

// -------------------------------------------------------------------------

function processLabelRendering() {
	if (renderLabels) {
		if (!areServerElementsSupported() || getGame() == AGRP_GAME_MAFIA_ONE) {
			if (localPlayer != null) {
				getServerData().businesses.forEach((business) => {
					if (getDistance(localPlayer.position, business.entrancePosition) <= propertyPickupRenderDistance) {
						if (getGame() == AGRP_GAME_GTA_IV || getGame() == AGRP_GAME_GTA_IV_EFLC) {
							natives.drawColouredCylinder(getPosBelowPos(business.entrancePosition, 1.0), 0.0, 0.0, 0, 153, 255, 255);
						}

						if (getDistance(localPlayer.position, business.entrancePosition) <= propertyLabelRenderDistance) {
							renderPropertyEntranceLabel(business.name, business.entrancePosition, business.locked, true, business.buyPrice, business.rentPrice, business.labelInfoType, business.entranceFee);
						}
					}
				});

				getServerData().houses.forEach((house) => {
					if (getDistance(localPlayer.position, house.entrancePosition) <= propertyPickupRenderDistance) {
						if (getGame() == AGRP_GAME_GTA_IV || getGame() == AGRP_GAME_GTA_IV_EFLC) {
							natives.drawColouredCylinder(getPosBelowPos(house.entrancePosition, 1.0), 0.0, 0.0, 0, 200, 0, 255);
						}

						if (getDistance(localPlayer.position, house.entrancePosition) <= propertyLabelRenderDistance) {
							renderPropertyEntranceLabel(house.description, house.entrancePosition, house.locked, true, house.buyPrice, house.rentPrice, house.labelInfoType);
						}
					}
				});

				getServerData().jobs.forEach((job) => {
					if (getDistance(localPlayer.position, job.position) <= propertyPickupRenderDistance) {
						if (getGame() == AGRP_GAME_GTA_IV || getGame() == AGRP_GAME_GTA_IV_EFLC) {
							natives.drawColouredCylinder(getPosBelowPos(job.position, 1.0), 0.0, 0.0, 255, 255, 0, 255);
						}
					}

					if (getDistance(localPlayer.position, job.position) <= 5.0) {
						renderJobLabel(job.name, job.position, job.jobType);
					}
				});
			}
		}

		if (areWorldLabelsSupported()) {
			if (localPlayer != null) {
				let pickups = getElementsByType(ELEMENT_PICKUP);
				for (let i in pickups) {
					if (pickups[i].getData("agrp.label.type") != null) {
						if (getDistance(localPlayer.position, pickups[i].position) <= propertyLabelRenderDistance) {
							if (!pickups[i].isOnScreen) {
								let price = "0";
								let rentPrice = "0";
								let labelInfoType = AGRP_PROPLABEL_INFO_NONE;
								if (pickups[i].getData("agrp.label.price") != null) {
									price = pickups[i].getData("agrp.label.price");
								}

								if (pickups[i].getData("agrp.label.rentprice") != null) {
									rentPrice = pickups[i].getData("agrp.label.rentprice");
								}

								if (pickups[i].getData("agrp.label.help") != null) {
									labelInfoType = pickups[i].getData("agrp.label.help");
								}

								if (pickups[i].getData("agrp.label.fee") != null) {
									fee = pickups[i].getData("agrp.label.fee");
								}

								switch (pickups[i].getData("agrp.label.type")) {
									case AGRP_LABEL_BUSINESS: {
										renderPropertyEntranceLabel(pickups[i].getData("agrp.label.name"), pickups[i].position, pickups[i].getData("agrp.label.locked"), true, price, rentPrice, labelInfoType, fee);
										break;
									}

									case AGRP_LABEL_HOUSE: {
										renderPropertyEntranceLabel(pickups[i].getData("agrp.label.name"), pickups[i].position, pickups[i].getData("agrp.label.locked"), false, price, rentPrice, labelInfoType);
										break;
									}

									case AGRP_LABEL_JOB: {
										renderJobLabel(pickups[i].getData("agrp.label.name"), pickups[i].position, pickups[i].getData("agrp.label.jobType"));
										break;
									}

									case AGRP_LABEL_EXIT: {
										renderPropertyExitLabel(pickups[i].position);
										break;
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

// -------------------------------------------------------------------------