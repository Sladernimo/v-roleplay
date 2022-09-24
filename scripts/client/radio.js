// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: radio.js
// DESC: Provides internet streaming radio functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

function playStreamingRadio(url, loop, volume, element = false) {
	if (streamingRadio != null) {
		streamingRadio.stop();
	}

	streamingRadioVolume = volume;

	streamingRadio = audio.createSoundFromURL(url, loop);
	streamingRadio.volume = volume / 100;
	streamingRadio.play();
}

// ===========================================================================

function stopStreamingRadio() {
	if (streamingRadio != null) {
		streamingRadio.stop();
	}
	streamingRadio = null;
}

// ===========================================================================

function setStreamingRadioVolume(volume) {
	if (streamingRadio != null) {
		streamingRadioVolume = volume;
		streamingRadio.volume = volume / 100;
	}
}

// ===========================================================================

function playAudioFile(audioName, loop, volume) {
	findResourceByName("connectedrp-extra").exports.playCustomAudio(audioName, volume / 100, loop);
}

// ===========================================================================

function getStreamingRadioVolumeForPosition(position1, position2) {
	return false;
}