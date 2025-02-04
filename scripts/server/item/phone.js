// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: phone.js
// DESC: Provides features and usage for the phone item type
// TYPE: Server (JavaScript)
// ===========================================================================

function getItemWithPhoneNumber(phoneNumber) {
	for (let i in serverData.items) {
		if (serverData.items[i] != null) {
			if (getItemTypeData(getItemData(i).itemTypeIndex).useType == V_ITEM_USE_TYPE_PHONE) {
				if (getItemData(i).value == phoneNumber) {
					return i;
				}
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
			case V_ITEM_OWNER_GROUND:
				playRingtoneForPlayersInRange(getItemData(itemIndex).position, getItemData(i).extra);
				break;

			case V_ITEM_OWNER_VEHTRUNK:
				playRingtoneForPlayersInRange(getVehiclePosition(getItemData(itemIndex).ownerId), getItemData(i).extra);
				break;

			case V_ITEM_OWNER_VEHDASH:
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