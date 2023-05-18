// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: client.js
// DESC: Provides client communication and cross-endpoint operations
// TYPE: Server (JavaScript)
// ===========================================================================

// Return-To types (for when a player is teleported)
const V_RETURNTO_TYPE_NONE = 0;                // "Return to" data is invalid
const V_RETURNTO_TYPE_ADMINGET = 1;            // "Return to" data is from admin teleporting
const V_RETURNTO_TYPE_SKINSELECT = 2;          // "Return to" data is from skin select

// ===========================================================================

/**
 * @class Representing extra data for a client
 */
class ClientData {
	constructor(client, accountData = null, subAccounts = []) {
		/** @type {AccountData} */
		this.accountData = accountData;

		/** @type {Array.<SubAccountData>} */
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
		this.ped = null;

		// Security
		this.passwordResetState = V_RESETPASS_STATE_NONE;
		this.passwordResetCode = "";
		this.twoFactorAuthenticationState = V_2FA_STATE_NONE;
		this.twoFactorAuthenticationCode = 0;
		this.loginTimeout = null;
		this.loginAttemptsRemaining = 3;

		// Job Stuff
		this.jobEquipmentCache = [];
		this.jobUniform = -1;
		this.jobRoute = -1;
		this.jobRouteLocation = -1;
		this.jobRouteLocationElement = null;
		this.jobRouteVehicle = null;
		this.returnToJobVehicleTick = 0;
		this.returnToJobVehicleTimer = null;

		this.rentingVehicle = null;
		this.buyingVehicle = null;
		this.lastVehicle = null;

		this.switchingCharacter = false;

		this.tutorialStep = -1;
		this.tutorialItem = null;
		this.tutorialVehicle = null;

		// Items
		this.tempLockerCache = new Array(9).fill(-1);
		this.tempLockerType = V_TEMP_LOCKER_TYPE_NONE;
		this.hotBarItems = new Array(9).fill(-1);
		this.activeHotBarSlot = -1;
		this.toggleUseItem = false;
		this.itemActionState = V_ITEM_ACTION_NONE;
		this.itemActionItem = -1;
		this.paintBallItemCache = [];

		// Ordering for business
		this.businessOrderAmount = 0;
		this.businessOrderBusiness = -1;
		this.businessOrderItem = -1;
		this.businessOrderValue = -1;
		this.businessOrderSellPrice = 0;

		// For Non-Server Elements
		this.syncPosition = null;
		this.syncHeading = null;
		this.syncVehicle = null;
		this.syncVehicleSeat = null;

		// Creating Character
		//this.creatingCharacter = false;
		//this.creatingCharacterSkin = -1;

		// Radio
		this.streamingRadioStation = -1;
		this.streamingRadioElement = null;

		// Return To (when being teleported)
		this.returnToPosition = null;
		this.returnToHeading = null;
		this.returnToInterior = null;
		this.returnToDimension = null;
		this.returnToScene = "";
		this.returnToType = V_RETURNTO_TYPE_NONE;

		// Animation
		this.currentAnimation = -1;
		this.currentAnimationPositionOffset = null;
		this.currentAnimationPositionReturnTo = null;
		this.animationStart = 0;
		this.animationForced = false;

		// Misc
		this.changingCharacterName = false;
		this.currentPickup = null;
		this.usingSkinSelect = false;
		this.keyBinds = [];
		this.incomingDamageMultiplier = 1;
		this.weaponDamageEvent = V_WEAPON_DAMAGE_EVENT_NORMAL;
		this.lastJobVehicle = null;
		this.health = 100;
		this.locale = 0;
		this.enteringVehicle = null;
		this.customDisconnectReason = "";
		this.playerBlip = null;
		this.alcoholLevel = 0;
		this.pedState = V_PEDSTATE_NONE;
		this.promptType = V_PROMPT_NONE;
		this.promptValue = false;
		this.privateMessageReplyTo = null;
		this.enteringExitingProperty = null;
		this.inProperty = null;
		this.interiorLights = true;
		this.spawnInit = false;
		this.godMode = false;
		this.vehicleSeat = -1;
		this.lastJobRouteStart = 0;
		this.draggingPlayer = null;
		this.draggedByPlayer = null;
		this.lastGlobalChatMessageTimeStamp = 0;
		this.lastLocalChatMessageTimeStamp = 0;
		this.selectableListItems = [];

		// Paintball
		this.inPaintBall = false;
		this.paintBallBusiness = -1;
		this.paintBallDeaths = 0;
		this.paintBallKills = 0;

		// Job Route Editing
		this.jobRouteEditNextLocationDelay = 0;
		this.jobRouteEditNextLocationArriveMessage = "";
		this.jobRouteEditNextLocationGotoMessage = "";
		this.jobRouteEditNextLocationType = V_JOB_ROUTE_LOC_TYPE_NONE;

		// Casino Stuff
		this.casinoChips = 0; // This might become an item with a useId of a business (for chips belonging to specific casinos)
		this.casinoCardHand = [];
		this.casinoPlayingGame = V_CASINO_GAME_NONE;
		this.blackJackState = V_CASINO_BLACKJACK_PLAYSTATE_NONE;

		// PayPhone
		this.usingPayPhone = -1;
		this.payPhoneOtherPlayer = null;
		this.payPhoneCallStart = 0;
		this.payPhoneInitiatedCall = false;

		// Scene Switch
		// Position, rotation, scene, etc are in current character data
		this.sceneSwitchRadioStation = -1;
		this.sceneSwitchInteriorLights = true;
	}
};

// ===========================================================================

function initClientScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Client]: Initializing client script ...");
	logToConsole(LOG_DEBUG, "[V.RP.Client]: Client script initialized!");
}

// ===========================================================================

function resetClientStuff(client) {
	logToConsole(LOG_DEBUG, `[V.RP.Utilities] Resetting client data for ${getPlayerDisplayForConsole(client)}`);

	if (getPlayerData(client) == null) {
		return false;
	}

	if (isPlayerOnJobRoute(client)) {
		stopJobRoute(client, false, false);
	}

	if (isPlayerWorking(client)) {
		stopWorking(client);
	}

	if (getPlayerData(client).rentingVehicle != null) {
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
	deletePlayerBlip(client);

	if (getPlayerData(client).draggingPlayer != null) {
		stopDraggingPlayer(client, getPlayerData(client).draggingPlayer);
	}

	//getPlayerData(client).lastVehicle = null;
}

// ===========================================================================

function kickAllClients() {
	getClients().forEach((client) => {
		if (getPlayerData(client) != null) {
			getPlayerData(client).customDisconnectReason = "ServerRestarting";
		}
		disconnectPlayer(client);
	});
}

// ===========================================================================

function initClient(client) {
	logToConsole(LOG_DEBUG, `[V.RP.Account] Initializing client ${getPlayerDisplayForConsole(client)} ...`);

	if (isConsole(client)) {
		logToConsole(LOG_DEBUG | LOG_ERROR, `[V.RP.Account] Client initialization failed for ${getPlayerDisplayForConsole(client)}! (is console client)`);
		return false;
	}

	if (playerInitialized[client.index] == true) {
		logToConsole(LOG_DEBUG | LOG_ERROR, `[V.RP.Account] Client initialization failed for ${getPlayerDisplayForConsole(client)}! (already initialized)`);
		return false;
	}

	playerInitialized[client.index] = true;

	//setEntityData(client, "v.rp.isInitialized", true, false);

	logToConsole(LOG_DEBUG, `[V.RP.Account] Initializing GUI for ${getPlayerDisplayForConsole(client)} ...`);
	sendPlayerCurrencyString(client);
	sendPlayerGUIColours(client);
	sendPlayerGUIInit(client);
	updatePlayerSnowState(client, serverConfig.groundSnow);

	//logToConsole(LOG_DEBUG, `[V.RP.Account] Showing connect camera to ${getPlayerDisplayForConsole(client)} ...`);
	//showConnectCameraToPlayer(client);

	messageClient(`Please wait ...`, client, getColourByName("softGreen"));

	logToConsole(LOG_DEBUG, `[V.RP.Account] Waiting for 2.5 seconds to prevent race attack ...`);
	setTimeout(function () {
		if (client != null) {
			clearChatBox(client);
			logToConsole(LOG_DEBUG, `[V.RP.Account] Loading account for ${getPlayerDisplayForConsole(client)}`);
			let tempAccountData = loadAccountFromName(getPlayerName(client), true);

			logToConsole(LOG_DEBUG, `[V.RP.Account] Loading subaccounts for ${getPlayerDisplayForConsole(client)}`);
			let tempSubAccounts = [];
			if (tempAccountData != null) {
				if (tempAccountData.databaseId != 0) {
					tempSubAccounts = loadSubAccountsFromAccount(tempAccountData.databaseId);
				}
			}

			serverData.clients[getPlayerId(client)] = new ClientData(client, tempAccountData, tempSubAccounts);

			serverData.clients[getPlayerId(client)].sessionId = saveConnectionToDatabase(client);
			serverData.clients[getPlayerId(client)].connectTime = getCurrentUnixTimestamp();
			requestClientInfo(client);

			if (tempAccountData != null) {
				sendPlayerLocaleId(client, getPlayerData(client).accountData.locale);
				if (isAccountAutoIPLoginEnabled(tempAccountData) && getPlayerData(client).accountData.ipAddress == getPlayerIP(client)) {
					messagePlayerAlert(client, getLocaleString(client, "AutoLoggedInIP"));
					loginSuccess(client);
					playRadioStreamForPlayer(client, getServerIntroMusicURL(), true, getPlayerStreamingRadioVolume(client));
				} else {
					if (doesServerHaveGUIEnabled() && doesPlayerHaveGUIEnabled(client)) {
						logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login GUI.`);
						showPlayerLoginGUI(client);
					} else {
						logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the login message (GUI disabled).`);
						messagePlayerNormal(client, getLocaleString(client, "WelcomeBack", getServerName(), getPlayerName(client), "/login"), getColourByName("softGreen"));

						if (checkForGeoIPModule()) {
							let iso = module.geoip.getCountryISO(globalConfig.geoIPCountryDatabaseFilePath, getPlayerIP(client));
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
					logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the register GUI.`);
					showPlayerRegistrationGUI(client);
				} else {
					logToConsole(LOG_DEBUG, `[V.RP.Account] ${getPlayerDisplayForConsole(client)} is being shown the register message (GUI disabled).`);
					messagePlayerNormal(client, getLocaleString(client, "WelcomeNewPlayer", getServerName(), getPlayerName(client), "/register"), getColourByName("softGreen"));
				}
				playRadioStreamForPlayer(client, getServerIntroMusicURL(), true, getPlayerStreamingRadioVolume(client));
			}

			serverData.clients[getPlayerId(client)].keyBinds = loadAccountKeybindsFromDatabase((tempAccountData != null) ? tempAccountData.databaseId : 0);
			sendAccountKeyBindsToClient(client);
		}
	}, 2500);
}

// ===========================================================================