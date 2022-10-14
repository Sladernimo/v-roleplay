// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
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
 * @property {AccountData} accountData
 * @property {Array.<SubAccountData>} subAccounts
 */
class ClientData {
	constructor(client, accountData, subAccounts) {
		this.accountData = accountData;
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
		this.scene = "";
		this.playerBlip = null;
		this.alcoholLevel = 0;
		this.pedState = AGRP_PEDSTATE_NONE;
		this.promptType = AGRP_PROMPT_NONE;
		this.privateMessageReplyTo = null;
		this.enteringExitingProperty = null;
		this.inProperty = null;

		// Paintball
		this.inPaintBall = false;
		this.paintBallBusiness = -1;
		this.paintBallDeaths = 0;
		this.paintBallKills = 0;

		// Job Route Editing
		this.jobRouteEditNextLocationDelay = 0;
		this.jobRouteEditNextLocationArriveMessage = "";
		this.jobRouteEditNextLocationGotoMessage = "";
		this.jobRouteEditNextLocationType = AGRP_JOB_ROUTE_LOCATION_TYPE_NONE;

		// Casino Stuff
		this.casinoChips = 0; // This might become an item with a useId of a business (for chips belonging to specific casinos)
		this.casinoCardHand = [];
		this.casinoPlayingGame = AGRP_CASINO_GAME_NONE;
	}
};

// ===========================================================================

function initClientScript() {
	logToConsole(LOG_DEBUG, "[AGRP.Client]: Initializing client script ...");
	logToConsole(LOG_DEBUG, "[AGRP.Client]: Client script initialized!");
}

// ===========================================================================

function resetClientStuff(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Utilities] Resetting client data for ${getPlayerDisplayForConsole(client)}`);

	if (!getPlayerData(client)) {
		return false;
	}

	if (isPlayerOnJobRoute(client)) {
		stopJobRoute(client, false, false);
	}

	if (isPlayerWorking(client)) {
		stopWorking(client);
	}

	if (getPlayerData(client).rentingVehicle) {
		stopRentingVehicle(client);
	}

	if (isPlayerInPaintBall(client)) {
		stopPaintBall(client);
	}

	//if (isPlayerFishing(client)) {
	//	stopFishing(client);
	//}

	deleteJobItems(client);
	deletePaintBallItems(client);
	//deletePlayerTemporaryLockerItems(client);

	//getPlayerData(client).lastVehicle = null;
}

// ===========================================================================

function kickAllClients() {
	getClients().forEach((client) => {
		getPlayerData(client).customDisconnectReason = "ServerRestarting";
		disconnectPlayer(client);
	})
}

// ===========================================================================

function initClient(client) {
	logToConsole(LOG_DEBUG, `[AGRP.Account] Initializing client ${getPlayerDisplayForConsole(client)} ...`);

	if (isConsole(client)) {
		logToConsole(LOG_DEBUG | LOG_ERROR, `[AGRP.Account] Client initialization failed for ${getPlayerDisplayForConsole(client)}! (is console client)`);
		return false;
	}

	if (playerInitialized[client.index] == true) {
		logToConsole(LOG_DEBUG | LOG_ERROR, `[AGRP.Account] Client initialization failed for ${getPlayerDisplayForConsole(client)}! (already initialized)`);
		return false;
	}

	playerInitialized[client.index] = true;

	//setEntityData(client, "agrp.isInitialized", true, false);

	logToConsole(LOG_DEBUG, `[AGRP.Account] Initializing GUI for ${getPlayerDisplayForConsole(client)} ...`);
	sendPlayerCurrencyString(client);
	sendPlayerGUIColours(client);
	sendPlayerGUIInit(client);
	updatePlayerSnowState(client);

	//logToConsole(LOG_DEBUG, `[AGRP.Account] Showing connect camera to ${getPlayerDisplayForConsole(client)} ...`);
	//showConnectCameraToPlayer(client);

	messageClient(`Please wait ...`, client, getColourByName("softGreen"));

	logToConsole(LOG_DEBUG, `[AGRP.Account] Waiting for 2.5 seconds to prevent race attack ...`);
	setTimeout(function () {
		if (client != null) {
			clearChatBox(client);
			logToConsole(LOG_DEBUG, `[AGRP.Account] Loading account for ${getPlayerDisplayForConsole(client)}`);
			let tempAccountData = loadAccountFromName(getPlayerName(client), true);

			logToConsole(LOG_DEBUG, `[AGRP.Account] Loading subaccounts for ${getPlayerDisplayForConsole(client)}`);
			let tempSubAccounts = loadSubAccountsFromAccount(tempAccountData.databaseId);

			getServerData().clients[getPlayerId(client)] = new ClientData(client, tempAccountData, tempSubAccounts);

			getServerData().clients[getPlayerId(client)].sessionId = saveConnectionToDatabase(client);
			getServerData().clients[getPlayerId(client)].connectTime = getCurrentUnixTimestamp();
			requestClientInfo(client);

			if (tempAccountData != false) {
				sendPlayerLocaleId(client, getPlayerData(client).accountData.locale);
				if (isAccountAutoIPLoginEnabled(tempAccountData) && getPlayerData(client).accountData.ipAddress == getPlayerIP(client)) {
					messagePlayerAlert(client, getLocaleString(client, "AutoLoggedInIP"));
					loginSuccess(client);
					playRadioStreamForPlayer(client, getServerIntroMusicURL(), true, getPlayerStreamingRadioVolume(client));
				} else {
					if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
						logToConsole(LOG_DEBUG, `[AGRP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login GUI.`);
						showPlayerLoginGUI(client);
					} else {
						logToConsole(LOG_DEBUG, `[AGRP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login message (GUI disabled).`);
						messagePlayerNormal(client, getLocaleString(client, "WelcomeBack", getServerName(), getPlayerName(client), "/login"), getColourByName("softGreen"));

						if (checkForGeoIPModule()) {
							let iso = module.geoip.getCountryISO(getPlayerIP(client));
							let localeId = getLocaleFromCountryISO(iso);

							if (localeId != 0) {
								if (getLocaleData(localeId).enabled) {
									messagePlayerTip(client, getLanguageLocaleString(localeId, "LocaleOffer", `/lang ${getLocaleData(localeId).isoCode}`), getColourByName("white"), 10000, "Roboto");
								}
							}
						}
					}
					startLoginTimeoutForPlayer(client);
					playRadioStreamForPlayer(client, getServerIntroMusicURL(), true, getPlayerStreamingRadioVolume(client));
				}
			} else {
				sendPlayerLocaleId(client, 0);
				if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
					logToConsole(LOG_DEBUG, `[AGRP.Account] ${getPlayerDisplayForConsole(client)} is being shown the register GUI.`);
					showPlayerRegistrationGUI(client);
				} else {
					logToConsole(LOG_DEBUG, `[AGRP.Account] ${getPlayerDisplayForConsole(client)} is being shown the register message (GUI disabled).`);
					messagePlayerNormal(client, getLocaleString(client, "WelcomeNewPlayer", getServerName(), getPlayerName(client), "/register"), getColourByName("softGreen"));
				}
				playRadioStreamForPlayer(client, getServerIntroMusicURL(), true, getPlayerStreamingRadioVolume(client));
			}

			getServerData().clients[getPlayerId(client)].keyBinds = loadAccountKeybindsFromDatabase(getServerData().clients[getPlayerId(client)].accountData.databaseId);
			sendAccountKeyBindsToClient(client);
		}
	}, 2500);
}

// ===========================================================================