// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
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
let propertyLabelHeight = (getGame() == V_GAME_MAFIA_ONE) ? 1.75 : 1.0;
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

let businessWorldIconPath = "files/images/icons/business-icon.png";
let jobWorldIconPath = "files/images/icons/job-icon.png";
let houseWorldIconPath = "files/images/icons/house-icon.png";
let businessWorldIconImage = null;
let jobWorldIconImage = null;
let houseWorldIconImage = null;
let businessWorldIconSize = [64, 64];
let jobWorldIconSize = [64, 64];
let houseWorldIconSize = [64, 64];
let worldIconRenderDistance = 15.0;
let businessWorldIconRenderDistance = worldIconRenderDistance;
let houseWorldIconRenderDistance = worldIconRenderDistance;
let jobWorldIconRenderDistance = worldIconRenderDistance;

// ===========================================================================

function initLabelScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Label]: Initializing label script ...");
	propertyLabelNameFont = initLabelPropertyNameFont();
	propertyLabelLockedFont = initLabelPropertyLockedFont();
	jobNameLabelFont = initLabelJobNameFont();
	jobHelpLabelFont = initLabelJobHelpFont();

	businessWorldIconImage = initBusinessWorldIcon();
	jobWorldIconImage = initJobWorldIcon();
	houseWorldIconImage = initHouseWorldIcon();
	logToConsole(LOG_DEBUG, "[V.RP.Label]: Label script initialized!");
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

function initBusinessWorldIcon() {
	let imageStream = openFile(businessWorldIconPath);
	let tempImage = null;
	if (imageStream != null) {
		tempImage = graphics.loadPNG(imageStream);
		imageStream.close();
	}

	return tempImage;
}

// ===========================================================================

function initJobWorldIcon() {
	let imageStream = openFile(jobWorldIconPath);
	let tempImage = null;
	if (imageStream != null) {
		tempImage = graphics.loadPNG(imageStream);
		imageStream.close();
	}

	return tempImage;
}

// ===========================================================================

function initHouseWorldIcon() {
	let imageStream = openFile(houseWorldIconPath);
	let tempImage = null;
	if (imageStream != null) {
		tempImage = graphics.loadPNG(imageStream);
		imageStream.close();
	}

	return tempImage;
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

	position = getPosAbovePos(position, propertyLabelHeight);
	let screenPosition = getScreenFromWorldPosition(position);

	logToConsole(LOG_VERBOSE, `[V.RP.Label] World [${position.x}, ${position.y}, ${position.z}] to screen [${screenPosition.x}, ${screenPosition.y}, ${screenPosition.z}]`);

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

	if (!locked && labelInfoType != V_PROPLABEL_INFO_NONE) {
		let infoText = "";
		switch (labelInfoType) {
			case V_PROPLABEL_INFO_ENTER: {
				if (enterPropertyKey != null) {
					infoText = getLocaleString("PropertyEnterKeyPressLabel", toUpperCase(getKeyNameFromId(enterPropertyKey)));
				} else {
					infoText = getLocaleString("PropertyEnterCommandLabel", "/enter");
				}
				break;
			}

			case V_PROPLABEL_INFO_BUY: {
				infoText = getLocaleString("BusinessBuyItemsLabel", "/buy");
				break;
			}

			case V_PROPLABEL_INFO_BUYBIZ: {
				infoText = getLocaleString("BuyBusinessLabel", "/bizbuy");
				break;
			}

			case V_PROPLABEL_INFO_BUYHOUSE: {
				infoText = getLocaleString("BuyHouseLabel", "/housebuy");
				break;
			}

			case V_PROPLABEL_INFO_RENTHOUSE: {
				infoText = getLocaleString("RentHouseLabel", "/houserent");
				break;
			}

			case V_PROPLABEL_INFO_ENTERVEHICLE: {
				infoText = getLocaleString("VehicleDealershipLabel");
				break;
			}

			case V_PROPLABEL_INFO_BANK: {
				infoText = getLocaleString("BusinessBankInfoLabel");
				break;
			}

			default: {
				if (enterPropertyKey != null) {
					infoText = getLocaleString("PropertyEnterKeyPressLabel", toUpperCase(getKeyNameFromId(enterPropertyKey)));
				} else {
					infoText = getLocaleString("PropertyEnterCommandLabel", "/enter");
				}
				break;
			}
		}
		if (getDistance(getLocalPlayerPosition(), position) <= propertyLabelRenderDistance - 2) {
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

	position = getPosAbovePos(position, propertyLabelHeight);
	let screenPosition = getScreenFromWorldPosition(position);

	let text = "EXIT";
	let size = propertyLabelNameFont.measure(text, game.width, 0.0, 0.0, propertyLabelNameFont.size, true, true);
	propertyLabelNameFont.render(text, [screenPosition.x - size[0] / 2, screenPosition.y - size[1] / 2], game.width, 0.0, 0.0, propertyLabelNameFont.size, COLOUR_WHITE, false, true, false, true);
}

// -------------------------------------------------------------------------

function renderJobLabel(name, position, jobType, hasPublicRank) {
	if (localPlayer == null) {
		return false;
	}

	if (jobNameLabelFont == null) {
		return false;
	}

	if (jobHelpLabelFont == null) {
		return false;
	}

	position = getPosAbovePos(position, propertyLabelHeight);
	let screenPosition = getScreenFromWorldPosition(position);

	logToConsole(LOG_VERBOSE, `[V.RP.Label] World [${position.x}, ${position.y}, ${position.z}] to screen [${screenPosition.x}, ${screenPosition.y}, ${screenPosition.z}]`);

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
		if (!hasPublicRank) {
			text = getLocaleString("CantUseThisJob");
		} else {
			if (localPlayerJobType == -1) {
				text = getLocaleString("TakeJobLabel", "/takejob");
			} else {
				text = getLocaleString("NotYourJobLabel", "/quitjob");
			}
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
	//if (!isGameFeatureSupported("worldLabel")) {
	//	return false;
	//}

	if (renderLabels) {
		if (!areServerElementsSupported() || getGame() == V_GAME_MAFIA_ONE || getGame() == V_GAME_GTA_IV || getGame() == V_GAME_GTA_IV_EFLC) {
			if (localPlayer != null) {
				getServerData().businesses.forEach((business) => {
					let distance = getDistance(getLocalPlayerPosition(), business.entrancePosition);
					if (distance <= propertyLabelRenderDistance) {
						renderPropertyEntranceLabel(business.name, business.entrancePosition, business.locked, true, business.buyPrice, business.rentPrice, business.labelInfoType, business.entranceFee);
					}

					if (distance <= businessWorldIconRenderDistance) {
						if (getGame() == V_GAME_MAFIA_ONE) {
							renderBusinessWorldIcon(getPosAbovePos(business.entrancePosition, 1.0));
						}

						if (getGame() == V_GAME_GTA_IV || getGame() == V_GAME_GTA_IV_EFLC) {
							natives.drawColouredCylinder(getPosBelowPos(business.entrancePosition, 1.0), 0.0, 0.0, 0, 153, 255, 255);
						}
					}
				});

				getServerData().houses.forEach((house) => {
					let distance = getDistance(getLocalPlayerPosition(), house.entrancePosition);
					if (distance <= propertyLabelRenderDistance) {
						renderPropertyEntranceLabel(house.description, house.entrancePosition, house.locked, true, house.buyPrice, house.rentPrice, house.labelInfoType);
					}

					if (distance <= houseWorldIconRenderDistance) {
						if (getGame() == V_GAME_MAFIA_ONE) {
							renderHouseWorldIcon(getPosAbovePos(house.entrancePosition, 1.0));
						}

						if (getGame() == V_GAME_GTA_IV || getGame() == V_GAME_GTA_IV_EFLC) {
							natives.drawColouredCylinder(getPosBelowPos(house.entrancePosition, 1.0), 0.0, 0.0, 0, 200, 0, 255);
						}
					}
				});

				getServerData().jobs.forEach((job) => {
					let distance = getDistance(getLocalPlayerPosition(), job.position);
					if (distance <= propertyLabelRenderDistance) {
						renderJobLabel(job.name, job.position, job.jobId, job.hasPublicRank);
					}

					if (distance <= jobWorldIconRenderDistance) {
						if (getGame() == V_GAME_MAFIA_ONE) {
							renderJobWorldIcon(getPosAbovePos(job.position, 1.0));
						}

						if (getGame() == V_GAME_GTA_IV || getGame() == V_GAME_GTA_IV_EFLC) {
							natives.drawColouredCylinder(getPosBelowPos(job.position, 1.0), 0.0, 0.0, 255, 255, 0, 255);
						}
					}
				});
			}
		}

		if (arePickupsSupported() && areWorldLabelsSupported()) {
			if (localPlayer != null) {
				let pickups = getElementsByType(ELEMENT_PICKUP);
				for (let i in pickups) {
					if (pickups[i].getData("v.rp.label.type") != null) {
						if (getDistance(getLocalPlayerPosition(), pickups[i].position) <= propertyLabelRenderDistance) {
							if (!pickups[i].isOnScreen) {
								let price = "0";
								let rentPrice = "0";
								let fee = "0";

								let labelInfoType = V_PROPLABEL_INFO_NONE;
								if (pickups[i].getData("v.rp.label.price") != null) {
									price = pickups[i].getData("v.rp.label.price");
								}

								if (pickups[i].getData("v.rp.label.rentprice") != null) {
									rentPrice = pickups[i].getData("v.rp.label.rentprice");
								}

								if (pickups[i].getData("v.rp.label.help") != null) {
									labelInfoType = pickups[i].getData("v.rp.label.help");
								}

								if (pickups[i].getData("v.rp.label.fee") != null) {
									fee = pickups[i].getData("v.rp.label.fee");
								}

								switch (pickups[i].getData("v.rp.label.type")) {
									case V_LABEL_BUSINESS: {
										renderPropertyEntranceLabel(pickups[i].getData("v.rp.label.name"), pickups[i].position, pickups[i].getData("v.rp.label.locked"), true, price, rentPrice, labelInfoType, fee);
										break;
									}

									case V_LABEL_HOUSE: {
										renderPropertyEntranceLabel(pickups[i].getData("v.rp.label.name"), pickups[i].position, pickups[i].getData("v.rp.label.locked"), false, price, rentPrice, labelInfoType);
										break;
									}

									case V_LABEL_JOB: {
										renderJobLabel(pickups[i].getData("v.rp.label.name"), pickups[i].position, pickups[i].getData("v.rp.label.jobType"), pickups[i].getData("v.rp.label.publicRank"));
										break;
									}

									case V_LABEL_EXIT: {
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

function renderJobWorldIcon(position) {
	if (jobWorldIconImage == null) {
		logToConsole(LOG_VERBOSE, `[V.RP.Label]: Can't render job world icon. Image is null.`);
		return false;
	}

	if (getGame() != V_GAME_MAFIA_ONE) {
		logToConsole(LOG_VERBOSE, `[V.RP.Label]: Can't render job world icon. Unsupported game.`);
		return false;
	}

	let screenPosition = getScreenFromWorldPosition(position);
	graphics.drawRectangle(jobWorldIconImage, [screenPosition.x - (jobWorldIconSize[0] / 2), screenPosition.y - (jobWorldIconSize[1] / 2)], [jobWorldIconSize[0], jobWorldIconSize[1]]);
}

// -------------------------------------------------------------------------

function renderBusinessWorldIcon(position) {
	if (businessWorldIconImage == null) {
		logToConsole(LOG_VERBOSE, `[V.RP.Label]: Can't render business world icon. Image is null.`);
		return false;
	}

	if (getGame() != V_GAME_MAFIA_ONE) {
		logToConsole(LOG_VERBOSE, `[V.RP.Label]: Can't render business world icon. Unsupported game.`);
		return false;
	}

	let screenPosition = getScreenFromWorldPosition(position);
	graphics.drawRectangle(businessWorldIconImage, [screenPosition.x - (businessWorldIconSize[0] / 2), screenPosition.y - (businessWorldIconSize[1] / 2)], [businessWorldIconSize[0], businessWorldIconSize[1]]);
}

// -------------------------------------------------------------------------

function renderHouseWorldIcon(position) {
	if (houseWorldIconImage == null) {
		logToConsole(LOG_VERBOSE, `[V.RP.Label]: Can't render house world icon. Image is null.`);
		return false;
	}

	if (getGame() != V_GAME_MAFIA_ONE) {
		logToConsole(LOG_VERBOSE, `[V.RP.Label]: Can't render house world icon. Unsupported game.`);
		return false;
	}

	let screenPosition = getScreenFromWorldPosition(position);
	graphics.drawRectangle(houseWorldIconImage, [screenPosition.x - (houseWorldIconSize[0] / 2), screenPosition.y - (houseWorldIconSize[1] / 2)], [houseWorldIconSize[0], houseWorldIconSize[1]]);
}

// -------------------------------------------------------------------------