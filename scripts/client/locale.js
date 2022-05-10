// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: locale.js
// DESC: Provides locale functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let flagImagesPosition = toVector2(getScreenWidth()/2, login.window.position.y+100);
let flagImageSize = toVector2(50, 50);

function getLocaleString(stringName, ...args) {
	if(typeof getServerData().localeStrings[stringName] == undefined) {
		return "";
	}

	let tempString = getServerData().localeStrings[stringName];

	for(let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i-1]);
	}

	return tempString;
}

// ===========================================================================

function receiveLocaleStringFromServer(stringName, stringValue) {
	logToConsole(LOG_INFO, `[VRR.Locale]: Received locale string "${stringName}" from server (${stringValue})`);
	getServerData().localeStrings[stringName] = stringValue;
}

// ===========================================================================