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

	if (getGame() == V_GAME_MAFIA_ONE) {
		payPhoneRingingSoundFilePath = "files/sounds/payphone/old-payphone-ring.mp3";
		payPhoneDialingSoundFilePath = "files/sounds/payphone/old-payphone-dial.mp3";
		payPhonePickupSoundFilePath = "files/sounds/payphone/old-payphone-pickup.mp3";
		payPhoneHangupSoundFilePath = "files/sounds/payphone/old-payphone-hangup.mp3";
	} else {
		if (getGame() != V_GAME_GTA_SA) {
			payPhoneRingingSoundFilePath = "files/sounds/payphone/old-payphone-ring.mp3";
			payPhoneDialingSoundFilePath = "files/sounds/payphone/old-payphone-dial.mp3";
			payPhonePickupSoundFilePath = "files/sounds/payphone/old-payphone-pickup.mp3";
			payPhoneHangupSoundFilePath = "files/sounds/payphone/old-payphone-hangup.mp3";
		}
	}

	//payPhoneRingingIndicatorImage = loadPayPhoneRingingIndicatorImage();
	payPhoneRingingSound = loadPayPhoneRingingSound();
	payPhoneDialingSound = loadPayPhoneDialingSound();
	payPhonePickupSound = loadPayPhonePickupSound();
	payPhoneHangupSound = loadPayPhoneHangupSound();
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

function loadPayPhoneRingingSound() {
	if (payPhoneRingingSoundFilePath == "") {
		return null;
	}

	let soundStream = openFile(payPhoneRingingSoundFilePath);
	let tempSound = null;
	if (soundStream != null) {
		tempSound = audio.createSound(soundStream, true);
		soundStream.close();
	}

	return tempSound;
}

// ===========================================================================

function loadPayPhoneDialingSound() {
	if (payPhoneDialingSoundFilePath == "") {
		return null;
	}

	let soundStream = openFile(payPhoneDialingSoundFilePath);
	let tempSound = null;
	if (soundStream != null) {
		tempSound = audio.createSound(soundStream, false);
		soundStream.close();
	}

	if (tempSound != null) {
		tempSound.volume = 1.0;
	}

	return tempSound;
}

// ===========================================================================

function loadPayPhonePickupSound() {
	if (payPhonePickupSoundFilePath == "") {
		return null;
	}

	let soundStream = openFile(payPhonePickupSoundFilePath);
	let tempSound = null;
	if (soundStream != null) {
		tempSound = audio.createSound(soundStream, false);
		soundStream.close();
	}

	if (tempSound != null) {
		tempSound.volume = 1.0;
	}

	return tempSound;
}

// ===========================================================================

function loadPayPhoneHangupSound() {
	if (payPhoneHangupSoundFilePath == "") {
		return null;
	}

	let soundStream = openFile(payPhoneHangupSoundFilePath);
	let tempSound = null;
	if (soundStream != null) {
		tempSound = audio.createSound(soundStream, false);
		soundStream.close();
	}

	if (tempSound != null) {
		tempSound.volume = 1.0;
	}

	return tempSound;
}

// ===========================================================================

function processPayPhonesDistance() {
	if (payPhoneRingingSound == null) {
		return false;
	}

	let tempRingingPhone = -1;
	for (let i in getServerData().payPhones) {
		if (getServerData().payPhones[i].state == V_PAYPHONE_STATE_RINGING) {
			if (getDistance(getLocalPlayerPosition(), getServerData().payPhones[i].position) <= payPhoneMaxAudibleDistance) {
				if (tempRingingPhone != -1) {
					if (getDistance(getLocalPlayerPosition(), getServerData().payPhones[i].position) <= getDistance(getLocalPlayerPosition(), getServerData().payPhones[tempRingingPhone].position)) {
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
		payPhoneRingingSound.stop();
	} else {
		let distance = getDistance(getLocalPlayerPosition(), getServerData().payPhones[tempRingingPhone].position);
		let distancePercent = (payPhoneRingMaxVolume - (distance * 100 / payPhoneMaxAudibleDistance));
		payPhoneRingingSound.volume = distancePercent / 100;

		if (ringingPayPhone == -1) {
			logToConsole(LOG_VERBOSE, "[V.RP.PayPhone]: No previous phone ringing, starting ring sound");
			payPhoneRingingSound.play();
		}
	}

	ringingPayPhone = tempRingingPhone;
}

// ===========================================================================

function receivePayPhoneFromServer(payPhoneId, isDeleted, state, position) {
	logToConsole(LOG_DEBUG, `[V.RP.PayPhone] Received payphone ${payPhoneId} from server`);

	if (!areServerElementsSupported() || getGame() == V_GAME_MAFIA_ONE || getGame() == V_GAME_GTA_IV) {
		if (isDeleted == true) {
			getServerData().payPhones.splice(payPhoneId, 1);
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
			getServerData().payPhones.push(tempPayPhoneData);
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
		for (let i in getServerData().payPhones) {
			getServerData().payPhones[i].state = state;
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

	for (let i in getServerData().payPhones) {
		if (getServerData().payPhones[i].payPhoneId == payPhoneId) {
			return getServerData().payPhones[i];
		}
	}

	return false;
}

// ===========================================================================

function removePayPhonesFromClient() {
	clearArray(getServerData().payPhones);
}

// ===========================================================================

function payPhoneDial() {
	if (payPhoneDialingSound == null) {
		logToConsole(LOG_DEBUG | LOG_ERROR, "[V.RP.PayPhone]: Attempted to play payphone dial sound, but sound object is null");
		return false;
	}

	logToConsole(LOG_DEBUG, "[V.RP.PayPhone]: Playing payphone dial sound");
	payPhoneDialingSound.play();
}

// ===========================================================================

function payPhoneHangup() {
	if (payPhoneHangupSound == null) {
		logToConsole(LOG_DEBUG | LOG_ERROR, "[V.RP.PayPhone]: Attempted to play payphone hangup sound, but sound object is null");
		return false;
	}

	logToConsole(LOG_DEBUG, "[V.RP.PayPhone]: Playing payphone hangup sound");
	payPhoneHangupSound.play();
}

// ===========================================================================

function payPhonePickup() {
	if (payPhonePickupSound == null) {
		logToConsole(LOG_DEBUG | LOG_ERROR, "[V.RP.PayPhone]: Attempted to play payphone pickup sound, but sound object is null");
		return false;
	}

	logToConsole(LOG_DEBUG, "[V.RP.PayPhone]: Playing payphone pickup sound");
	payPhonePickupSound.play();
}

// ===========================================================================