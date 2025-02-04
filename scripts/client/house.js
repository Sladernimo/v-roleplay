// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: house.js
// DESC: Provides house functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

class HouseData {
	constructor() {
		this.index = -1;
		this.houseId = -1;
		this.description = "";
		this.entrancePosition = toVector3(0.0, 0.0, 0.0);
		this.exitPosition = toVector3(0.0, 0.0, 0.0);
		this.blipModel = -1;
		this.pickupModel = -1;
		this.rentPrice = 0;
		this.buyPrice = 0;
		this.blipId = -1;
		this.locked = false;
		this.labelInfoType = V_PROPLABEL_INFO_NONE;
		this.entranceDimension = 0;
		this.exitDimension = 0;
	}
}

// ===========================================================================

function initHouseScript() {
	logToConsole(LOG_DEBUG, "[V.RP.House]: Initializing house script ...");
	logToConsole(LOG_DEBUG, "[V.RP.House]: House script initialized!");
}

// ===========================================================================

function receiveHouseFromServer(houseId, isDeleted, description, entrancePosition, exitPosition, blipModel, pickupModel, buyPrice, rentPrice, locked, labelInfoType, entranceDimension, exitDimension) {
	logToConsole(LOG_DEBUG, `[V.RP.House] Received house ${houseId} (${description}) from server`);

	if (!isGameFeatureSupported("serverElements") || getGame() == V_GAME_MAFIA_ONE || getGame() == V_GAME_GTA_IV) {
		if (isDeleted == true) {
			if (getGame() == V_GAME_GTA_IV) {
				natives.removeBlipAndClearIndex(getHouseData(houseId).blipId);
			}

			serverData.houses.splice(houseId, 1);
			return false;
		}

		if (getHouseData(houseId) != null) {
			let houseData = getHouseData(houseId);
			houseData.houseId = houseId;
			houseData.description = description;
			houseData.entrancePosition = entrancePosition;
			houseData.exitPosition = exitPosition;
			houseData.blipModel = blipModel;
			houseData.pickupModel = pickupModel;
			houseData.buyPrice = buyPrice;
			houseData.rentPrice = rentPrice;
			houseData.locked = locked;
			houseData.labelInfoType = labelInfoType;
			houseData.entranceDimension = entranceDimension;
			houseData.exitDimension = exitDimension;

			logToConsole(LOG_DEBUG, `[V.RP.House] House ${houseId} already exists. Checking blip ...`);
			if (blipModel == -1) {
				if (houseData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[V.RP.House] House ${houseId}'s blip has been removed by the server`);
					if (getGame() == V_GAME_GTA_IV) {
						natives.removeBlipAndClearIndex(getHouseData(houseId).blipId);
					} else {
						destroyElement(getElementFromId(blipId));
					}
					houseData.blipId = -1;
				} else {
					logToConsole(LOG_DEBUG, `[V.RP.House] House ${houseId}'s blip is unchanged`);
				}
			} else {
				if (houseData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[V.RP.House] House ${houseId}'s blip has been changed by the server`);
					if (getGame() == V_GAME_GTA_IV) {
						natives.setBlipCoordinates(houseData.blipId, houseData.entrancePosition);
						natives.changeBlipSprite(houseData.blipId, houseData.blipModel);
						natives.setBlipMarkerLongDistance(houseData.blipId, false);
						natives.setBlipAsShortRange(houseData.blipId, true);
						natives.changeBlipNameFromAscii(houseData.blipId, `${houseData.name.substr(0, 24)}${(houseData.description.length > 24) ? " ..." : ""}`);
					}
				} else {
					let blipId = createGameBlip(houseData.blipModel, houseData.entrancePosition, houseData.name);
					if (blipId != -1) {
						houseData.blipId = blipId;
					}
					logToConsole(LOG_DEBUG, `[V.RP.House] House ${houseId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
				}
			}
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.House] House ${houseId} doesn't exist. Adding ...`);
			let houseData = new HouseData();
			houseData.houseId = houseId;
			houseData.description = description;
			houseData.entrancePosition = entrancePosition;
			houseData.exitPosition = exitPosition;
			houseData.blipModel = blipModel;
			houseData.pickupModel = pickupModel;
			houseData.buyPrice = buyPrice;
			houseData.rentPrice = rentPrice;
			houseData.locked = locked;
			houseData.labelInfoType = labelInfoType;
			houseData.entranceDimension = entranceDimension;
			houseData.exitDimension = exitDimension;

			if (isGameFeatureSupported("blip")) {
				if (blipModel != -1) {
					let blipId = createGameBlip(houseData.blipModel, houseData.entrancePosition, "House");
					if (blipId != -1) {
						houseData.blipId = blipId;

						if (getGame() == V_GAME_GTA_IV) {
							natives.setBlipCoordinates(houseData.blipId, houseData.entrancePosition);
							natives.changeBlipSprite(houseData.blipId, houseData.blipModel);
							natives.setBlipMarkerLongDistance(houseData.blipId, false);
							natives.setBlipAsShortRange(houseData.blipId, true);
							natives.changeBlipNameFromAscii(houseData.blipId, `${houseData.name.substr(0, 24)}${(houseData.description.length > 24) ? " ..." : ""}`);
						}
					}
					logToConsole(LOG_DEBUG, `[V.RP.House] House ${houseId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
				} else {
					logToConsole(LOG_DEBUG, `[V.RP.House] House ${houseId} has no blip.`);
				}
			}

			serverData.houses.push(houseData);
			setAllHouseDataIndexes();
		}
	}
}

// ===========================================================================

/**
 * @param {number} houseId - The ID of the house (initially provided by server)
 * @return {HouseData} The house's data (class instance)
 */
function getHouseData(houseId) {
	let houses = serverData.houses;
	for (let i in houses) {
		if (houses[i].houseId == houseId) {
			return houses[i];
		}
	}

	return null;
}

// ===========================================================================

function setAllHouseDataIndexes() {
	for (let i in serverData.houses) {
		serverData.houses[i].index = i;
	}
}

// ===========================================================================

function removeHousesFromClient() {
	serverData.houses.splice(0);
}

// ===========================================================================