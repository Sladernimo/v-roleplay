// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: payphone.js
// DESC: Provides payphone functions and processing
// TYPE: Client (JavaScript)
// ===========================================================================

let payPhoneMaxAudibleDistance = 75;
let payPhoneRingMaxVolume = 50;

let payPhoneRingingIndicatorImage = null;
let payPhoneRingingIndicatorImagePath = "files/images/payphone-ringing.png";

// Will be unnecessary once MafiaC has game sound playback in scripting
let payPhoneRingingSound = null;
let payPhoneDialingSound = null;
let payPhonePickupSound = null;
let payPhoneHangupSound = null;

let payPhoneRingingSoundFilePath = "";
let payPhoneDialingSoundFilePath = "";
let payPhonePickupSoundFilePath = "";
let payPhoneHangupSoundFilePath = "";

let ringingPayPhone = -1;

// ===========================================================================

class PayPhoneData {
	constructor(payPhoneId, state, position) {
		this.index = -1;
		this.payPhoneId = payPhoneId;
		this.position = position;
		this.state = state;
	}
}

// ===========================================================================

function initPayPhoneScript() {
	logToConsole(LOG_DEBUG, "[V.RP.PayPhone]: Initializing payphone script ...");

	logToConsole(LOG_DEBUG, "[V.RP.PayPhone]: Payphone script initialized!");
}

// ===========================================================================

function loadPayPhoneRingingIndicatorImage() {
	if (payPhoneRingingIndicatorImagePath == "") {
		return null;
	}

	let imageStream = openFile(payPhoneRingingIndicatorImagePath);
	let tempImage = null;
	if (imageStream != null) {
		tempImage = graphics.loadPNG(imageStream);
		imageStream.close();
	}

	return tempImage;
}

// ===========================================================================

function processPayPhonesDistance() {
	if (payPhoneRingingSound == null) {
		return false;
	}

	let tempRingingPhone = -1;
	for (let i in serverData.payPhones) {
		if (serverData.payPhones[i].state == V_PAYPHONE_STATE_RINGING) {
			if (getDistance(getLocalPlayerPosition(), serverData.payPhones[i].position) <= payPhoneMaxAudibleDistance) {
				if (tempRingingPhone != -1) {
					if (getDistance(getLocalPlayerPosition(), serverData.payPhones[i].position) <= getDistance(getLocalPlayerPosition(), serverData.payPhones[tempRingingPhone].position)) {
						tempRingingPhone = i;
					}
				} else {
					tempRingingPhone = i;
				}
			}
		}
	}

	if (tempRingingPhone == -1) {
		logToConsole(LOG_VERBOSE, "[V.RP.PayPhone]: No phones are ringing, stopping all ring sounds");
		stopCustomAudio("payPhoneRing");
	} else {
		let distance = getDistance(getLocalPlayerPosition(), serverData.payPhones[tempRingingPhone].position);
		let distancePercent = (payPhoneRingMaxVolume - (distance * 100 / payPhoneMaxAudibleDistance));

		if (ringingPayPhone == -1) {
			logToConsole(LOG_VERBOSE, "[V.RP.PayPhone]: No previous phone ringing, starting ring sound");
			playCustomAudio("payPhoneRing", distancePercent, false);
		}
	}

	ringingPayPhone = tempRingingPhone;
}

// ===========================================================================

function receivePayPhoneFromServer(payPhoneId, isDeleted, state, position) {
	logToConsole(LOG_DEBUG, `[V.RP.PayPhone] Received payphone ${payPhoneId} from server`);

	if (!isGameFeatureSupported("serverElements") || getGame() == V_GAME_MAFIA_ONE || getGame() == V_GAME_GTA_IV) {
		if (isDeleted == true) {
			serverData.payPhones.splice(payPhoneId, 1);
			return false;
		}

		if (getPayPhoneData(payPhoneId) != false) {
			logToConsole(LOG_DEBUG, `[V.RP.PayPhone] Payphone ${payPhoneId} already exists. Updating ...`);
			let payPhoneData = getPayPhoneData(payPhoneId);
			payPhoneData.state = state;
			payPhoneData.position = position;
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.PayPhone] Payphone ${payPhoneId} doesn't exist. Adding ...`);
			let tempPayPhoneData = new PayPhoneData(payPhoneId, state, position);
			serverData.payPhones.push(tempPayPhoneData);
		}
	}
}

// ===========================================================================

function receivePayPhoneStateFromServer(payPhoneId, state) {
	logToConsole(LOG_DEBUG, `[V.RP.PayPhone] Received payphone ${payPhoneId} state (${state}) from server`);

	if (payPhoneId != -1) {
		if (getPayPhoneData(payPhoneId) == false) {
			return false;
		}

		getPayPhoneData(payPhoneId).state = state;
	} else {
		for (let i in serverData.payPhones) {
			serverData.payPhones[i].state = state;
		}
	}
}

// ===========================================================================

/**
 * @param {number} payPhoneId - The ID of the payphone (initially provided by server)
 * @return {PayPhoneData} The payphone's data (class instance)
 */
function getPayPhoneData(payPhoneId) {
	if (payPhoneId == -1) {
		return false;
	}

	for (let i in serverData.payPhones) {
		if (serverData.payPhones[i].payPhoneId == payPhoneId) {
			return serverData.payPhones[i];
		}
	}

	return false;
}

// ===========================================================================

function removePayPhonesFromClient() {
	serverData.payPhones = [];
}

// ===========================================================================

function payPhoneDial() {
	if (payPhoneDialingSound == null) {
		logToConsole(LOG_DEBUG | LOG_ERROR, "[V.RP.PayPhone]: Attempted to play payphone dial sound, but sound object is null");
		return false;
	}

	logToConsole(LOG_DEBUG, "[V.RP.PayPhone]: Playing payphone dial sound");
	playCustomAudio("payPhoneDial", 50, false);
}

// ===========================================================================

function payPhoneHangup() {
	if (payPhoneHangupSound == null) {
		logToConsole(LOG_DEBUG | LOG_ERROR, "[V.RP.PayPhone]: Attempted to play payphone hangup sound, but sound object is null");
		return false;
	}

	logToConsole(LOG_DEBUG, "[V.RP.PayPhone]: Playing payphone hangup sound");
	playCustomAudio("payPhoneHangup", 50, false);
}

// ===========================================================================

function payPhonePickup() {
	if (payPhonePickupSound == null) {
		logToConsole(LOG_DEBUG | LOG_ERROR, "[V.RP.PayPhone]: Attempted to play payphone pickup sound, but sound object is null");
		return false;
	}

	logToConsole(LOG_DEBUG, "[V.RP.PayPhone]: Playing payphone pickup sound");
	playCustomAudio("payPhonePickup", 50, false);
}

// ===========================================================================