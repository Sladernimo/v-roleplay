// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: locale.js
// DESC: Provides locale functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

function getLocaleString(stringName, ...args) {
	if (typeof getServerData().localeStrings[localLocaleId][stringName] == undefined) {
		return "";
	}

	let tempString = getServerData().localeStrings[localLocaleId][stringName];

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
	return getServerData().localeOptions.filter(localeOption => localeOption.requiresUnicode == false);
}

// ===========================================================================

function loadLocaleConfig() {
	let configFile = loadTextFile("config/client/locale.json");
	getServerData().localeOptions = JSON.parse(configFile);

	//resetLocaleChooserOptions();
	loadAllLocaleStrings();
}

// ===========================================================================

function loadAllLocaleStrings() {
	let localeOptions = getServerData().localeOptions;
	for (let i in localeOptions) {
		logToConsole(LOG_INFO, `[AGRP.Locale] Loading locale strings for ${localeOptions[i].englishName} (${i})`);
		let localeStringFile = loadTextFile(`locale/${localeOptions[i].stringsFile}`);
		let localeStringData = JSON.parse(localeStringFile);

		let localeId = localeOptions[i].id;
		getServerData().localeStrings[localeId] = localeStringData;
	}

	resetGUIStrings();
}

// ===========================================================================

function setLocale(tempLocaleId) {
	logToConsole(LOG_DEBUG, `[AGRP.Locale] Setting locale to ${tempLocaleId} (${getServerData().localeOptions[tempLocaleId].englishName})`);
	localLocaleId = tempLocaleId;
	resetGUIStrings();
}