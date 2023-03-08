// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
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
	logToConsole(LOG_DEBUG, "[V.RP.Business]: Initializing business script ...");
	logToConsole(LOG_INFO, "[V.RP.Business]: Business script initialized!");
}

// ===========================================================================

function receiveBusinessFromServer(businessId, isDeleted, name, entrancePosition, blipModel, pickupModel, buyPrice, rentPrice, hasInterior, locked, hasItems, entranceFee) {
	logToConsole(LOG_DEBUG, `[V.RP.Business] Received business ${businessId} (${name}) from server`);

	if (!areServerElementsSupported() || getGame() == V_GAME_MAFIA_ONE || getGame() == V_GAME_GTA_IV) {
		if (isDeleted == true) {
			if (getGame() == V_GAME_GTA_IV) {
				natives.removeBlipAndClearIndex(getBusinessData(businessId).blipId);
			}

			getServerData().businesses.splice(businessId, 1);
			return false;
		}

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

			if (businessData.buyPrice > 0) {
				businessData.labelInfoType = V_PROPLABEL_INFO_BUYBIZ;
			} else {
				if (hasInterior) {
					businessData.labelInfoType = V_PROPLABEL_INFO_ENTER;
				} else {
					if (hasItems) {
						businessData.labelInfoType = V_PROPLABEL_INFO_BUY;
					} else {
						businessData.labelInfoType = V_PROPLABEL_INFO_NONE;
					}
				}
			}

			logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId} already exists. Checking blip ...`);
			if (blipModel == -1) {
				if (businessData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId}'s blip has been removed by the server`);
					if (getGame() == V_GAME_GTA_IV) {
						natives.removeBlipAndClearIndex(getBusinessData(businessId).blipId);
					} else {
						destroyElement(getElementFromId(blipId));
					}
					businessData.blipId = -1;
					//businesses.splice(businessData.index, 1);
					//setAllBusinessDataIndexes();
				} else {
					logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId}'s blip is unchanged`);
				}
			} else {
				if (businessData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId}'s blip has been changed by the server`);
					if (getGame() == V_GAME_GTA_IV) {
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
					logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
				}
			}
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId} doesn't exist. Adding ...`);
			let businessData = new BusinessData(businessId, name, entrancePosition, blipModel, pickupModel, hasInterior, locked, hasItems, entranceFee);
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
			if (blipModel != -1) {
				let blipId = createGameBlip(businessData.blipModel, businessData.entrancePosition, businessData.name);
				if (blipId != -1) {
					businessData.blipId = blipId;
				}
				logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
			} else {
				logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId} has no blip.`);
			}
			getServerData().businesses.push(businessData);
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

function removeBusinessesFromClient() {
	getServerData().businesses.splice(0);
}

// ===========================================================================