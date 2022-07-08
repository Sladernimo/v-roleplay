// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: phone.js
// DESC: Provides features and usage for the phone item type
// TYPE: Server (JavaScript)
// ===========================================================================

function getItemWithPhoneNumber(phoneNumber) {
	for (let i in getServerData().items) {
		if (getItemTypeData(getItemData(i).itemTypeIndex).useType == AGRP_ITEM_USE_TYPE_PHONE) {
			if (getItemData(i).value == phoneNumber) {
				return i;
			}
		}
	}
	return -1;
}

// ===========================================================================

function isPhoneItemEnabled(itemIndex) {
	return getItemData(itemIndex).enabled;
}

// ===========================================================================

function ringPhoneForNearbyPlayers(itemIndex) {
	/*
	if(isPhoneItemEnabled(itemIndex)) {
		switch(getItemData(itemIndex).ownerType) {
			case AGRP_ITEM_OWNER_GROUND:
				playRingtoneForPlayersInRange(getItemData(itemIndex).position, getItemData(i).extra);
				break;

			case AGRP_ITEM_OWNER_VEHTRUNK:
				playRingtoneForPlayersInRange(getVehiclePosition(getItemData(itemIndex).ownerId), getItemData(i).extra);
				break;

			case AGRP_ITEM_OWNER_VEHDASH:
				playRingtoneForPlayersInRange(getVehiclePosition(getItemData(itemIndex).ownerId), getItemData(i).extra);
				break;
		}
	}
	*/
}

// ===========================================================================

function phoneTransmit(radioFrequency, messageText, transmittingPlayer) {
	phoneOutgoingToNearbyPlayers(transmittingPlayer, messageText);
}

// ===========================================================================