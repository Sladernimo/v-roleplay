// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: content.js
// DESC: Provides connection to extra content resources
// TYPE: Client (JavaScript)
// ===========================================================================

function getCustomImage(imageName) {
	let contentResource = findResourceByName(extraContentResource[getGame()]);
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
	let contentResource = findResourceByName(extraContentResource[getGame()]);
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
	let contentResource = findResourceByName(extraContentResource[getGame()]);
	if (contentResource != null) {
		if (contentResource.isStarted) {
			let audioObject = contentResource.exports.getCustomAudio(audioName);
			if (audioObject != null) {
				return audioObject;
			}
		}
	}
	return false;
}

// ===========================================================================

function playCustomAudio(audioName, volume = 0.5, loop = false) {
	let contentResource = findResourceByName(extraContentResource[getGame()]);
	if (contentResource != null) {
		if (contentResource.isStarted) {
			contentResource.exports.playCustomAudio(audioName, volume, loop);
			return true;
		}
	}
	return false;
}

// ===========================================================================

function stopCustomAudio(audioName) {
	let contentResource = findResourceByName(extraContentResource[getGame()]);
	if (contentResource != null) {
		if (contentResource.isStarted) {
			contentResource.exports.stopCustomAudio(audioName);
			return true;
		}
	}
	return false;
}

// ===========================================================================

function loadCustomFont(filePath, fontSize) {
	let tempFont = null;
	let fontStream = openFile(filePath);
	if (fontStream != null) {
		tempFont = lucasFont.createFont(fontStream, fontSize);
	}

	return tempFont;
}

// ===========================================================================