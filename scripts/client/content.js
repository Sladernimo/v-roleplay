// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: content.js
// DESC: Provides connection to extra content resources
// TYPE: Client (JavaScript)
// ===========================================================================

function getCustomImage(imageName) {
	let contentResource = findResourceByName(getGameConfig().extraContentResource[getGame()]);
	if (contentResource != null) {
		if (contentResource.isStarted) {
			let image = contentResource.exports.getCustomImage(imageName);
			if (image != null) {
				return image;
			}
		}
	}
	return false;
}

// ===========================================================================

function getCustomFont(fontName) {
	let contentResource = findResourceByName(getGameConfig().extraContentResource[getGame()]);
	if (contentResource != null) {
		if (contentResource.isStarted) {
			let font = contentResource.exports.getCustomFont(fontName);
			if (font != null) {
				return font;
			}
		}
	}
	return false;
}

// ===========================================================================

function getCustomAudio(audioName) {
	let contentResource = findResourceByName(getGameConfig().extraContentResource[getGame()]);
	if (contentResource != null) {
		if (contentResource.isStarted) {
			let audioFile = contentResource.exports.getCustomAudio(audioName);
			if (audioFile != null) {
				return audioFile;
			}
		}
	}
	return false;
}

// ===========================================================================

function playCustomAudio(audioName, volume = 0.5, loop = false) {
	let contentResource = findResourceByName(getGameConfig().extraContentResource[getGame()]);
	if (contentResource != null) {
		if (contentResource.isStarted) {
			contentResource.exports.playCustomAudio(audioName, volume, loop);
		}
	}
	return false;
}

// ===========================================================================