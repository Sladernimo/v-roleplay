// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: house.js
// DESC: Provides house functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

class HouseData {
	constructor(houseId, description, entrancePosition, blipModel, pickupModel, hasInterior) {
		this.index = -1;
		this.houseId = houseId;
		this.description = description;
		this.entrancePosition = entrancePosition;
		this.blipModel = blipModel;
		this.pickupModel = pickupModel;
		this.hasInterior = hasInterior;
		this.rentPrice = 0;
		this.buyPrice = 0;
		this.blipId = -1;
		this.locked = false;
	}
}

// ===========================================================================

function receiveHouseFromServer(houseId, description, entrancePosition, blipModel, pickupModel, buyPrice, rentPrice, hasInterior, locked) {
	logToConsole(LOG_DEBUG, `[AGRP.House] Received house ${houseId} (${name}) from server`);

	if (!areServerElementsSupported() || getGame() == AGRP_GAME_MAFIA_ONE || getGame() == AGRP_GAME_GTA_IV) {
		if (getHouseData(houseId) != false) {
			let houseData = getHouseData(houseId);
			houseData.description = description;
			houseData.entrancePosition = entrancePosition;
			houseData.blipModel = blipModel;
			houseData.pickupModel = pickupModel;
			houseData.hasInterior = hasInterior;
			houseData.buyPrice = buyPrice;
			houseData.rentPrice = rentPrice;
			houseData.locked = locked;

			if (houseData.buyPrice > 0) {
				houseData.labelInfoType = AGRP_PROPLABEL_INFO_BUYHOUSE;
			} else {
				if (houseData.rentPrice > 0) {
					houseData.labelInfoType = AGRP_PROPLABEL_INFO_RENTHOUSE;
				} else {
					houseData.labelInfoType = AGRP_PROPLABEL_INFO_ENTER;
				}
			}

			logToConsole(LOG_DEBUG, `[AGRP.House] House ${houseId} already exists. Checking blip ...`);
			if (blipModel == -1) {
				if (houseData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[AGRP.House] House ${houseId}'s blip has been removed by the server`);
					if (getGame() == AGRP_GAME_GTA_IV) {
						natives.removeBlipAndClearIndex(getHouseData(houseId).blipId);
					} else {
						destroyElement(getElementFromId(blipId));
					}
					houseData.blipId = -1;
				} else {
					logToConsole(LOG_DEBUG, `[AGRP.House] House ${houseId}'s blip is unchanged`);
				}
			} else {
				if (houseData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[AGRP.House] House ${houseId}'s blip has been changed by the server`);
					if (getGame() == AGRP_GAME_GTA_IV) {
						natives.setBlipCoordinates(houseData.blipId, houseData.entrancePosition);
						natives.changeBlipSprite(houseData.blipId, houseData.blipModel);
						natives.setBlipMarkerLongDistance(houseData.blipId, false);
						natives.setBlipAsShortRange(houseData.blipId, true);
						natives.changeBlipNameFromAscii(houseData.blipId, `${houseData.name.substr(0, 24)}${(houseData.name.length > 24) ? " ..." : ""}`);
					}
				} else {
					let blipId = createGameBlip(houseData.blipModel, houseData.entrancePosition, houseData.name);
					if (blipId != -1) {
						houseData.blipId = blipId;
					}
					logToConsole(LOG_DEBUG, `[AGRP.House] House ${houseId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
				}
			}
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.House] House ${houseId} doesn't exist. Adding ...`);
			let tempHouseData = new HouseData(houseId, description, entrancePosition, blipModel, pickupModel, hasInterior);
			if (blipModel != -1) {
				let blipId = createGameBlip(tempHouseData.blipModel, tempHouseData.entrancePosition, "House");
				if (blipId != -1) {
					tempHouseData.blipId = blipId;
				}
				logToConsole(LOG_DEBUG, `[AGRP.House] House ${houseId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
			} else {
				logToConsole(LOG_DEBUG, `[AGRP.House] House ${houseId} has no blip.`);
			}
			getServerData().houses.push(tempHouseData);
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
	let houses = getServerData().houses;
	for (let i in houses) {
		if (houses[i].houseId == houseId) {
			return houses[i];
		}
	}

	return false;
}

// ===========================================================================

function setAllHouseDataIndexes() {
	for (let i in getServerData().houses) {
		getServerData().houses[i].index = i;
	}
}

// ===========================================================================