// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: anticheat.js
// DESC: Provides anticheat functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initAntiCheatScript() {
	logToConsole(LOG_DEBUG, "[V.RP.AntiCheat]: Initializing anticheat script ...");
	logToConsole(LOG_DEBUG, "[V.RP.AntiCheat]: Anticheat script initialized!");
}

// ===========================================================================

function clearPlayerStateToEnterExitProperty(client) {
	if (getPlayerData(client).pedState != V_PEDSTATE_READY) {
		if (getPlayerData(client).pedState == V_PEDSTATE_ENTERINGVEHICLE) {
			sendPlayerClearPedState(client);
			getPlayerData(client).pedState = V_PEDSTATE_READY;
		} else {
			return false;
		}
	}
}

// ===========================================================================

function isPlayerExemptFromAntiCheat(client) {
	if (hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("ExemptFromAntiCheat"))) {
		return true;
	}

	return false;
}

// ===========================================================================

function canPlayerUsePoliceJob(client) {
	if (getPlayerData(client).accountData.flags.moderation & getServerBitFlags().moderationFlags.policeBanned) {
		return false;
	}

	return true;
}

// ===========================================================================

function canClientUseFireJob(client) {
	if (getPlayerData(client).accountData.flags.moderation & getServerBitFlags().moderationFlags.fireBanned) {
		return false;
	}

	return true;
}

// ===========================================================================

function canClientUseAmmunations(client) {
	if (getPlayerData(client).accountData.flags.moderation & getServerBitFlags().moderationFlags.AmmuBanned) {
		return false;
	}

	return true;
}

// ===========================================================================

function canClientUseGuns(client) {
	if (getPlayerData(client).accountData.flags.moderation & getServerBitFlags().moderationFlags.GunBanned) {
		return false;
	}

	return true;
}

// ===========================================================================