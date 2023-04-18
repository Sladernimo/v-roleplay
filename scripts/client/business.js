// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: business.js
// DESC: Provides business functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

class BusinessData {
	constructor() {
		this.index = -1;
		this.businessId = -1;
		this.name = "";
		this.entrancePosition = toVector3(0.0, 0.0, 0.0);
		this.exitPosition = toVector3(0.0, 0.0, 0.0);
		this.blipModel = -1;
		this.pickupModel = -1;
		this.rentPrice = 0;
		this.buyPrice = 0;
		this.blipId = -1;
		this.labelInfoType = 0;
		this.locked = false;
		this.entranceFee = 0;
		this.entranceDimension = 0;
		this.exitDimension = 0;
	}
}

// ===========================================================================

function initBusinessScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Business]: Initializing business script ...");
	logToConsole(LOG_INFO, "[V.RP.Business]: Business script initialized!");
}

// ===========================================================================

function receiveBusinessFromServer(businessId, isDeleted, name, entrancePosition, exitPosition, blipModel, pickupModel, buyPrice, rentPrice, locked, entranceFee, labelInfoType, entranceDimension, exitDimension) {
	logToConsole(LOG_DEBUG, `[V.RP.Business] Received business ${businessId} (${name}) from server`);

	if (!isGameFeatureSupported("serverElements") || getGame() == V_GAME_MAFIA_ONE || getGame() == V_GAME_GTA_IV) {
		if (isDeleted == true) {
			if (getGame() == V_GAME_GTA_IV) {
				natives.removeBlipAndClearIndex(getBusinessData(businessId).blipId);
			}

			serverData.businesses.splice(businessId, 1);
			return false;
		}

		if (getBusinessData(businessId) != null) {
			let businessData = getBusinessData(businessId);
			businessData.businessId = businessId;
			businessData.name = name;
			businessData.entrancePosition = entrancePosition;
			businessData.exitPosition = exitPosition;
			businessData.blipModel = blipModel;
			businessData.pickupModel = pickupModel;
			businessData.buyPrice = buyPrice;
			businessData.rentPrice = rentPrice;
			businessData.locked = locked;
			businessData.entranceFee = entranceFee;
			businessData.entranceDimension = entranceDimension;
			businessData.exitDimension = exitDimension;
			businessData.labelInfoType = labelInfoType;

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
						natives.setBlipAsShortRange(businessData.blipId, true);
						natives.changeBlipNameFromAscii(businessData.blipId, `${businessData.name.substr(0, 24)}${(businessData.name.length > 24) ? " ..." : ""}`);
					}
				} else {
					let blipId = createGameBlip(businessData.blipModel, businessData.entrancePosition, businessData.name);
					if (blipId != -1) {
						businessData.blipId = blipId;

						if (getGame() == V_GAME_GTA_IV) {
							natives.setBlipCoordinates(businessData.blipId, businessData.entrancePosition);
							natives.changeBlipSprite(businessData.blipId, businessData.blipModel);
							natives.setBlipMarkerLongDistance(businessData.blipId, false);
							natives.setBlipAsShortRange(businessData.blipId, true);
							natives.changeBlipNameFromAscii(businessData.blipId, `${businessData.name.substr(0, 24)}${(businessData.name.length > 24) ? " ..." : ""}`);
						}
					}
					logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
				}
			}
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId} doesn't exist. Adding ...`);
			let businessData = new BusinessData();
			businessData.businessId = businessId;
			businessData.name = name;
			businessData.entrancePosition = entrancePosition;
			businessData.exitPosition = exitPosition;
			businessData.blipModel = blipModel;
			businessData.pickupModel = pickupModel;
			businessData.buyPrice = buyPrice;
			businessData.rentPrice = rentPrice;
			businessData.locked = locked;
			businessData.entranceFee = entranceFee;
			businessData.entranceDimension = entranceDimension;
			businessData.exitDimension = exitDimension;
			businessData.labelInfoType = labelInfoType;

			if (isGameFeatureSupported("blip")) {
				if (blipModel != -1) {
					let blipId = createGameBlip(businessData.blipModel, businessData.entrancePosition, businessData.name);
					if (blipId != -1) {
						businessData.blipId = blipId;
						if (getGame() == V_GAME_GTA_IV) {
							natives.setBlipCoordinates(businessData.blipId, businessData.entrancePosition);
							natives.changeBlipSprite(businessData.blipId, businessData.blipModel);
							natives.setBlipMarkerLongDistance(businessData.blipId, false);
							natives.setBlipAsShortRange(businessData.blipId, true);
							natives.changeBlipNameFromAscii(businessData.blipId, `${businessData.name.substr(0, 24)}${(businessData.name.length > 24) ? " ..." : ""}`);
						}
					}
					logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
				} else {
					logToConsole(LOG_DEBUG, `[V.RP.Business] Business ${businessId} has no blip.`);
				}
			}

			serverData.businesses.push(businessData);
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

	let businesses = serverData.businesses;

	for (let i in businesses) {
		if (businesses[i].businessId == businessId) {
			return businesses[i];
		}
	}

	return false;
}

// ===========================================================================

function setAllBusinessDataIndexes() {
	for (let i in serverData.businesses) {
		serverData.businesses[i].index = i;
	}
}

// ===========================================================================

function removeBusinessesFromClient() {
	serverData.businesses.splice(0);
}

// ===========================================================================