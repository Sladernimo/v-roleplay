// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: gps.js
// DESC: Provides GPS functions and commands
// TYPE: Server (JavaScript)
// ===========================================================================

// GPS State Types
const AGRP_GPS_TYPE_NONE = 0;                     // None (invalid)
const AGRP_GPS_TYPE_BUSINESS = 1;                 // Business
const AGRP_GPS_TYPE_POLICE = 2;                   // Police Station
const AGRP_GPS_TYPE_HOSPITAL = 3;                 // Hospital
const AGRP_GPS_TYPE_JOB = 4;                      // Job
const AGRP_GPS_TYPE_GAMELOC = 5;                  // Game Location

// ===========================================================================

function gpsCommand(command, params, client) {
	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBusinessList")));

	let locationType = AGRP_GPS_TYPE_NONE;
	let useType = AGRP_ITEM_USE_TYPE_NONE;
	let blipColour = "white";

	switch (toLowerCase(params)) {
		case "police":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_POLICE;
			break;

		case "hospital":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_HOSPITAL;
			break;

		case "job":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_JOB;
			break;

		case "skin":
		case "skins":
		case "clothes":
		case "player":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_BUSINESS;
			useType = AGRP_ITEM_USE_TYPE_SKIN;
			break;

		case "gun":
		case "guns":
		case "weapon":
		case "weapons":
		case "wep":
		case "weps":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_BUSINESS;
			useType = AGRP_ITEM_USE_TYPE_WEAPON;
			break;

		case "food":
		case "eat":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_BUSINESS;
			useType = AGRP_ITEM_USE_TYPE_FOOD;
			break;

		case "drink":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_BUSINESS;
			useType = AGRP_ITEM_USE_TYPE_DRINK;
			break;

		case "alcohol":
		case "booze":
		case "bar":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_BUSINESS;
			useType = AGRP_ITEM_USE_TYPE_ALCOHOL;
			break;

		case "repair":
		case "carrepair":
		case "vehrepair":
		case "spray":
		case "fix":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_BUSINESS;
			useType = AGRP_ITEM_USE_TYPE_VEHREPAIR;
			break;

		case "vehiclecolour":
		case "vehcolour":
		case "carcolour":
		case "colour":
			blipColour = "businessBlue"
			locationType = AGRP_GPS_TYPE_BUSINESS;
			useType = AGRP_ITEM_USE_TYPE_VEHCOLOUR;
			break;

		default: {
			let itemTypeId = getItemTypeFromParams(params);
			if (getItemTypeData(itemTypeId) != false) {
				locationType = AGRP_GPS_TYPE_BUSINESS;
				blipColour = "businessBlue";
				useType = getItemTypeData(itemTypeId).useType;
			} else {
				let gameLocationId = getGameLocationFromParams(params);
				if (gameLocationId != false) {
					position = getGameConfig().locations[getServerGame()][gameLocationId][1]
				}
			}
		}
	}

	if (locationType == AGRP_GPS_TYPE_NONE) {
		messagePlayerError(client, getLocaleString(client, "InvalidGPSLocation"));
		return false;
	}

	if (locationType == AGRP_GPS_TYPE_BUSINESS) {
		let businessId = getClosestBusinessWithBuyableItemOfUseType(useType);
		if (!businessId) {
			messagePlayerError(client, getLocaleString(client, "NoBusinessWithItemType"));
			return false;
		}

		if (!getBusinessData(businessId)) {
			messagePlayerError(client, getLocaleString(client, "NoBusinessWithItemType"));
			return false;
		}

		hideAllBlipsForPlayerGPS(client);
		blinkGenericGPSBlipForPlayer(client, getBusinessData(businessId).entrancePosition, getBusinessData(businessId).entranceBlipModel, getColourByType(blipColour), 10);
		messagePlayerSuccess(client, "Look for the blinking icon on your mini map");
	}

	if (locationType == AGRP_GPS_TYPE_GAMELOC) {
		hideAllBlipsForPlayerGPS(client);
		blinkGenericGPSBlipForPlayer(client, position, 0, getColourByType(blipColour), 10);
		messagePlayerSuccess(client, "Look for the blinking icon on your mini map");
		return true;
	}
}

// ===========================================================================