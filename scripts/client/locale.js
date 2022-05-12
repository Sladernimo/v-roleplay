// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: locale.js
// DESC: Provides locale functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

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

function receiveLocaleStringsFromServer(strings) {
	for(let i in strings) {
		let stringName = strings[i][0];
		getServerData().localeStrings[stringName] = strings[i][1];
	}
}

// ===========================================================================