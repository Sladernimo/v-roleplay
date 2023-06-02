// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: locale.js
// DESC: Provides locale functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let localLocaleId = 0;

// ===========================================================================

function getLocaleString(stringName, ...args) {
	if (typeof serverData.localeStrings[localLocaleId][stringName] == undefined) {
		return "";
	}

	let tempString = serverData.localeStrings[localLocaleId][stringName];

	if (tempString == "" || tempString == null || tempString == undefined) {
		return "";
	}

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

function getGroupedLocaleString(stringName, indexName, ...args) {
	if (typeof serverData.localeStrings[localLocaleId][stringName][indexName] == undefined) {
		return "";
	}

	let tempString = serverData.localeStrings[localLocaleId][stringName][indexName];

	if (tempString == "" || tempString == null || tempString == undefined) {
		return "";
	}

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

function getAvailableLocaleOptions() {
	return serverData.localeOptions.filter(localeOption => localeOption.enabled == true && localeOption.requiresUnicode == false);
}

// ===========================================================================

function loadLocaleConfig() {
	let configFile = loadTextFile("config/client/locale.json");
	serverData.localeOptions = JSON.parse(configFile);

	//resetLocaleChooserOptions();
	loadAllLocaleStrings();
}

// ===========================================================================

function loadAllLocaleStrings() {
	let localeOptions = serverData.localeOptions;
	for (let i in localeOptions) {
		logToConsole(LOG_INFO, `[V.RP.Locale] Loading locale strings for ${localeOptions[i].englishName} (${i})`);
		let localeStringFile = loadTextFile(`locale/${localeOptions[i].stringsFile}`);
		let localeStringData = JSON.parse(localeStringFile);

		let localeId = localeOptions[i].id;
		serverData.localeStrings[localeId] = localeStringData;
	}

	resetGUIStrings();
}

// ===========================================================================

function setLocale(tempLocaleId) {
	logToConsole(LOG_DEBUG, `[V.RP.Locale] Setting locale to ${tempLocaleId} (${serverData.localeOptions[tempLocaleId].englishName})`);
	localLocaleId = tempLocaleId;
	resetGUIStrings();
}

// ===========================================================================