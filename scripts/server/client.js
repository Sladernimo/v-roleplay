// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: client.js
// DESC: Provides client communication and cross-endpoint operations
// TYPE: Server (JavaScript)
// ===========================================================================

// Return-To types (for when a player is teleported)
const AGRP_RETURNTO_TYPE_NONE = 0;                // "Return to" data is invalid
const AGRP_RETURNTO_TYPE_ADMINGET = 1;            // "Return to" data is from admin teleporting
const AGRP_RETURNTO_TYPE_SKINSELECT = 2;          // "Return to" data is from skin select

// ===========================================================================

/**
 * @class Representing extra data for a client
 */
class ClientData {
	constructor(client, accountData, subAccounts) {
		/** @member {AccountData} accountData */
		this.accountData = accountData;

		/** @member {Array.<SubAccountData>} subAccounts */
		this.subAccounts = subAccounts; // Characters

		// General Info
		this.client = client;
		this.currentSubAccount = -1;
		this.loggedIn = false;
		this.index = -1;
		this.connectTime = 0;
		this.clientVersion = "0.0.0";
		this.afk = false;
		this.spawned = false;
		this.sessionId = 0;

		// Security
		this.passwordResetState = AGRP_RESETPASS_STATE_NONE;
		this.passwordResetCode = "";
		this.twoFactorAuthenticationState = AGRP_2FA_STATE_NONE;
		this.twoFactorAuthenticationCode = 0;
		this.loginTimeout = null;
		this.loginAttemptsRemaining = 3;

		// Job Stuff
		this.jobEquipmentCache = [];
		this.jobUniform = 0;
		this.jobRoute = -1;
		this.jobRouteLocation = -1;
		this.jobRouteVehicle = false;
		this.returnToJobVehicleTick = 0;
		this.returnToJobVehicleTimer = null;

		this.rentingVehicle = false;
		this.buyingVehicle = false;
		this.lastVehicle = false;

		this.switchingCharacter = false;

		this.tutorialStep = -1;
		this.tutorialItem = null;
		this.tutorialVehicle = null;

		// Items
		this.tempLockerCache = new Array(9).fill(-1);
		this.tempLockerType = AGRP_TEMP_LOCKER_TYPE_NONE;
		this.hotBarItems = new Array(9).fill(-1);
		this.activeHotBarSlot = -1;
		this.toggleUseItem = false;
		this.itemActionState = AGRP_ITEM_ACTION_NONE;
		this.itemActionItem = -1;
		this.paintBallItemCache = [];

		// Ordering for business
		this.businessOrderAmount = 0;
		this.businessOrderBusiness = -1;
		this.businessOrderItem = -1;
		this.businessOrderValue = -1;

		// For Non-Server Elements
		this.syncPosition = null;
		this.syncHeading = null;
		this.syncVehicle = null;
		this.syncVehicleSeat = null;

		// Payday
		this.payDayAmount = 0;
		this.payDayTickStart = 0;

		// Creating Character
		//this.creatingCharacter = false;
		//this.creatingCharacterSkin = -1;

		// Radio
		this.streamingRadioStation = -1;
		this.streamingRadioElement = false;

		// Return To (when being teleported)
		this.returnToPosition = null;
		this.returnToHeading = null;
		this.returnToInterior = null;
		this.returnToDimension = null;
		this.returnToHouse = null;
		this.returnToBusiness = null;
		this.returnToType = AGRP_RETURNTO_TYPE_NONE;

		// Animation
		this.currentAnimation = -1;
		this.currentAnimationPositionOffset = false;
		this.currentAnimationPositionReturnTo = false;
		this.animationStart = 0;
		this.animationForced = false;

		// Misc
		this.changingCharacterName = false;
		this.currentPickup = false;
		this.usingSkinSelect = false;
		this.keyBinds = [];
		this.incomingDamageMultiplier = 1;
		this.weaponDamageEvent = AGRP_WEAPON_DAMAGE_EVENT_NORMAL;
		this.lastJobVehicle = null;
		this.health = 100;
		this.locale = 0;
		this.enteringVehicle = null;
		this.customDisconnectReason = "";
		this.interiorCutscene = -1;
		this.playerBlip = null;
		this.alcoholLevel = 0;
		this.pedState = AGRP_PEDSTATE_NONE;
		this.promptType = AGRP_PROMPT_NONE;
		this.privateMessageReplyTo = null;

		this.inPaintBall = false;
		this.paintBallBusiness = -1;
		this.paintBallDeaths = 0;
		this.paintBallKills = 0;
	}
};

// ===========================================================================

function initClientScript() {
	logToConsole(LOG_DEBUG, "[VRR.Client]: Initializing client script ...");
	logToConsole(LOG_DEBUG, "[VRR.Client]: Client script initialized!");
}

// ===========================================================================

function resetClientStuff(client) {
	logToConsole(LOG_DEBUG, `[VRR.Utilities] Resetting client data for ${getPlayerDisplayForConsole(client)}`);

	if (!getPlayerData(client)) {
		return false;
	}

	if (isPlayerOnJobRoute(client)) {
		stopJobRoute(client, false, false);
	}

	if (getPlayerData(client).rentingVehicle) {
		stopRentingVehicle(client);
	}

	deleteJobItems(client);
	deletePaintBallItems(client);
	//deletePlayerTemporaryLockerItems(client);

	getPlayerData(client).lastVehicle = null;
}

// ===========================================================================

function kickAllClients() {
	getClients().forEach((client) => {
		getPlayerData(client).customDisconnectReason = `Kicked - All clients are being disconnected`;
		disconnectPlayer(client);
	})
}

// ===========================================================================