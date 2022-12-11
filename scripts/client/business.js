// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: business.js
// DESC: Provides business functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

class BusinessData {
	constructor(businessId, name, entrancePosition, blipModel, pickupModel, hasInterior, hasItems) {
		this.index = -1;
		this.businessId = businessId;
		this.name = name;
		this.entrancePosition = entrancePosition;
		this.blipModel = blipModel;
		this.pickupModel = pickupModel;
		this.hasInterior = hasInterior;
		this.rentPrice = 0;
		this.buyPrice = 0;
		this.hasItems = hasItems;
		this.blipId = -1;
		this.labelInfoType = 0;
		this.locked = false;
		this.entranceFee = 0;
	}
}

// ===========================================================================

function initBusinessScript() {
	logToConsole(LOG_DEBUG, "[AGRP.Business]: Initializing business script ...");
	logToConsole(LOG_INFO, "[AGRP.Business]: Business script initialized!");
}

// ===========================================================================

function receiveBusinessFromServer(businessId, name, entrancePosition, blipModel, pickupModel, buyPrice, rentPrice, hasInterior, locked, hasItems, entranceFee) {
	logToConsole(LOG_DEBUG, `[AGRP.Business] Received business ${businessId} (${name}) from server`);

	if (!areServerElementsSupported() || getGame() == AGRP_GAME_MAFIA_ONE || getGame() == AGRP_GAME_GTA_IV) {
		if (getBusinessData(businessId) != false) {
			let businessData = getBusinessData(businessId);
			businessData.name = name;
			businessData.entrancePosition = entrancePosition;
			businessData.blipModel = blipModel;
			businessData.pickupModel = pickupModel;
			businessData.hasInterior = hasInterior;
			businessData.buyPrice = buyPrice;
			businessData.rentPrice = rentPrice;
			businessData.hasItems = hasItems;
			businessData.locked = locked;
			businessData.entranceFee = entranceFee;

			if (hasInterior && !hasItems) {
				businessData.labelInfoType = AGRP_PROPLABEL_INFO_ENTER;
			} else if (!hasInterior && hasItems) {
				businessData.labelInfoType = AGRP_PROPLABEL_INFO_BUY;
			} else {
				if (businessData.buyPrice > 0) {
					businessData.labelInfoType = AGRP_PROPLABEL_INFO_BUYBIZ;
				}
			}

			logToConsole(LOG_DEBUG, `[AGRP.Business] Business ${businessId} already exists. Checking blip ...`);
			if (blipModel == -1) {
				if (businessData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[AGRP.Business] Business ${businessId}'s blip has been removed by the server`);
					if (getGame() == AGRP_GAME_GTA_IV) {
						natives.removeBlipAndClearIndex(getBusinessData(businessId).blipId);
					} else {
						destroyElement(getElementFromId(blipId));
					}
					businessData.blipId = -1;
					//businesses.splice(businessData.index, 1);
					//setAllBusinessDataIndexes();
				} else {
					logToConsole(LOG_DEBUG, `[AGRP.Business] Business ${businessId}'s blip is unchanged`);
				}
			} else {
				if (businessData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[AGRP.Business] Business ${businessId}'s blip has been changed by the server`);
					if (getGame() == AGRP_GAME_GTA_IV) {
						natives.setBlipCoordinates(businessData.blipId, businessData.entrancePosition);
						natives.changeBlipSprite(businessData.blipId, businessData.blipModel);
						natives.setBlipMarkerLongDistance(businessData.blipId, false);
						natives.setBlipAsShortRange(tempBusinessData.blipId, true);
						natives.changeBlipNameFromAscii(businessData.blipId, `${businessData.name.substr(0, 24)}${(businessData.name.length > 24) ? " ..." : ""}`);
					}
				} else {
					let blipId = createGameBlip(tempBusinessData.blipModel, tempBusinessData.entrancePosition, tempBusinessData.name);
					if (blipId != -1) {
						tempBusinessData.blipId = blipId;
					}
					logToConsole(LOG_DEBUG, `[AGRP.Business] Business ${businessId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
				}
			}
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.Business] Business ${businessId} doesn't exist. Adding ...`);
			let tempBusinessData = new BusinessData(businessId, name, entrancePosition, blipModel, pickupModel, hasInterior, hasItems);
			if (blipModel != -1) {
				let blipId = createGameBlip(tempBusinessData.blipModel, tempBusinessData.entrancePosition, tempBusinessData.name);
				if (blipId != -1) {
					tempBusinessData.blipId = blipId;
				}
				logToConsole(LOG_DEBUG, `[AGRP.Business] Business ${businessId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
			} else {
				logToConsole(LOG_DEBUG, `[AGRP.Business] Business ${businessId} has no blip.`);
			}
			getServerData().businesses.push(tempBusinessData);
			setAllBusinessDataIndexes();
		}
	}
}

// ===========================================================================

/**
 * @param {number} businessId - The ID of the business (initially provided by server)
 * @return {BusinessData} The business's data (class instance)
 */
function getBusinessData(businessId) {
	//let tempBusinessData = businesses.find((b) => b.businessId == businessId);
	//return (typeof tempBusinessData != "undefined") ? tempBusinessData[0] : false;

	let businesses = getServerData().businesses;

	for (let i in businesses) {
		if (businesses[i].businessId == businessId) {
			return businesses[i];
		}
	}

	return false;
}

// ===========================================================================

function setAllBusinessDataIndexes() {
	for (let i in getServerData().businesses) {
		getServerData().businesses[i].index = i;
	}
}

// ===========================================================================