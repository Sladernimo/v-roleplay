// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: locale.js
// DESC: Provides locale structures, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

class LocaleData {
	constructor() {
		this.id = 0;
		this.name = "";
		this.englishName = "";
		this.stringsFile = "";
		this.flagImagePath = "";
		this.contributors = "";
		this.countries = [];
		this.requiresUnicode = false;
	}
}

// ===========================================================================

let englishLocale = 0;

// ===========================================================================

function initLocaleScript() {
	logToConsole(LOG_DEBUG, "[AGRP.Locale]: Initializing locale script ...");
	logToConsole(LOG_INFO, "[AGRP.Locale]: Locale script initialized!");
}

// ===========================================================================

function getLocaleString(client, stringName, ...args) {
	if (client == null) {
		return "";
	}

	let tempString = getRawLocaleString(getPlayerData(client).locale, stringName);
	if (tempString == "" || tempString == null || typeof tempString == "undefined") {
		logToConsole(LOG_WARN, `[AGRP.Locale] Locale string missing for ${stringName} on language ${getLocaleData(getPlayerData(client).locale).englishName}`);
		submitBugReport(client, `(AUTOMATED REPORT) Locale string "${stringName}" is missing for "${getPlayerLocaleName(client)}"`);
		return "";
	}

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

function getLanguageLocaleString(localeId, stringName, ...args) {
	let tempString = getRawLocaleString(localeId, stringName);
	if (tempString == "" || tempString == null || typeof tempString == "undefined") {
		logToConsole(LOG_WARN, `[AGRP.Locale] Locale string missing for ${stringName} on language ${getLocaleData(localeId).englishName}`);
		submitBugReport(null, `(AUTOMATED REPORT) Locale string "${stringName}" is missing for "${getLocaleData(localeId).englishName}"`);
		return "";
	}

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

function getLanguageGroupedLocaleString(localeId, stringName, index, ...args) {
	let tempString = getRawGroupedLocaleString(localeId, stringName, index);
	if (tempString == "" || tempString == null || typeof tempString == "undefined") {
		logToConsole(LOG_WARN, `[AGRP.Locale] Locale string missing for index ${index} of "${stringName}" on language ${getLocaleData(localeId).englishName}`);
		submitBugReport(null, `(AUTOMATED REPORT) Locale string index ${index} of "${stringName}" is missing for "${getLocaleData(localeId).englishName}"`);
		return "";
	}

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

function getGroupedLocaleString(client, stringName, index, ...args) {
	if (client == null) {
		return "";
	}

	let tempString = getRawGroupedLocaleString(getPlayerData(client).locale, stringName, index);

	for (let i = 1; i <= args.length; i++) {
		tempString = tempString.replace(`{${i}}`, args[i - 1]);
	}

	return tempString;
}

// ===========================================================================

function getRawLocaleString(localeId, stringName) {
	if (typeof getLocaleStrings()[localeId][stringName] == "undefined") {
		logToConsole(LOG_WARN, `[AGRP.Locale] Locale string missing for ${getLocaleStrings()[localeId][stringName]} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		submitBugReport(null, `(AUTOMATED REPORT) Locale string is missing for "${getLocaleStrings()[localeId][stringName]}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		return "";
	}

	return getLocaleStrings()[localeId][stringName];

	//if(findResourceByName("agrp_locale").exports.doesLocaleStringExist(localeId, stringName) == false) {
	//	return "";
	//}

	//let tempString = findResourceByName("agrp_locale").exports.getRawLocaleString(localeId, stringName);
	//if(tempString == "" || tempString == null || tempString == undefined) {
	//	return "";
	//}
}

// ===========================================================================

function getRawGroupedLocaleString(localeId, stringName, index) {
	if (typeof getLocaleStrings()[localeId][stringName][index] == "undefined") {
		logToConsole(LOG_WARN, `[AGRP.Locale] Grouped locale string missing for index ${index} of string ${getLocaleStrings()[localeId][stringName][index]} on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		submitBugReport(null, `(AUTOMATED REPORT) Grouped locale string is missing for index ${index} of string "${getLocaleStrings()[localeId][stringName][index]}" on language ${getLocaleData(localeId).englishName}[${localeId}]`);
		return "";
	}

	return getLocaleStrings()[localeId][stringName][index];

	//if(findResourceByName("agrp_locale").exports.doesLocaleStringExist(localeId, stringName) == false) {
	//	return "";
	//}

	//let tempString = findResourceByName("agrp_locale").exports.getRawLocaleString(localeId, stringName);
	//if(tempString == "" || tempString == null || tempString == undefined) {
	//	return "";
	//}
}

// ===========================================================================

function getPlayerLocaleName(client) {
	if (client == null) {
		return "";
	}

	let localeId = getPlayerData(client).locale;
	return getLocales()[localeId].englishName;
}

// ===========================================================================

function loadAllLocaleStrings() {
	let tempLocaleStrings = {};

	let locales = getGlobalConfig().locale.locales;
	for (let i in locales) {
		let localeData = locales[i];
		let localeFile = JSON.parse(loadTextFile(`locale/${localeData.stringsFile}`));
		tempLocaleStrings[i] = localeFile;
	}

	return tempLocaleStrings;
}

// ===========================================================================

function getLocaleStrings() {
	return getServerData().localeStrings;
}

// ===========================================================================

function getLocaleFromParams(params) {
	let locales = getLocales();
	if (isNaN(params)) {
		for (let i in locales) {
			if (toLowerCase(locales[i].isoCode).indexOf(toLowerCase(params)) != -1) {
				return i;
			}

			if (toLowerCase(locales[i].englishName).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	}

	return -1;
}

// ===========================================================================

function getLocales() {
	return getGlobalConfig().locale.locales;
}

// ===========================================================================

function showLocaleListCommand(command, params, client) {
	let localeList = getLocales().map(function (x) { return x[0]; });
	let chunkedList = splitArrayIntoChunks(localeList, 10);

	messagePlayerInfo(client, getLocaleString(client, "HeaderLocaleList"));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function setLocaleCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let localeId = getLocaleFromParams(params);

	if (!getLocaleData(localeId)) {
		messagePlayerInfo(client, getLocaleString(client, "InvalidLocale"));
		return false;
	}

	getPlayerData(client).accountData.locale = localeId;
	getPlayerData(client).locale = localeId;
	messagePlayerSuccess(client, getLocaleString(client, "LocaleChanged1", getLocaleString(client, "LocaleNativeName")));
	//sendPlayerLocaleStrings(client);
	sendPlayerLocaleId(client, localeId);
}

// ===========================================================================

function getLocaleData(localeId) {
	if (typeof getLocales()[localeId] != "undefined") {
		return getLocales()[localeId];
	}

	return false;
}

// ===========================================================================

function reloadLocaleConfigurationCommand(command, params, client) {
	getGlobalConfig().locale = loadLocaleConfig();
	getServerData().localeStrings = loadAllLocaleStrings();

	// Translation Cache
	getServerData().cachedTranslations = new Array(getGlobalConfig().locale.locales.length);
	getServerData().cachedTranslationFrom = new Array(getGlobalConfig().locale.locales.length);
	getServerData().cachedTranslationFrom.fill([]);
	getServerData().cachedTranslations.fill(getServerData().cachedTranslationFrom);

	getGlobalConfig().locale.defaultLanguageId = getLocaleFromParams(getGlobalConfig().locale.defaultLanguage);

	messageAdmins(`${getPlayerName(client)}{MAINCOLOUR} has reloaded the locale settings and texts`);
}

// ===========================================================================

async function translateMessage(messageText, translateFrom = getGlobalConfig().locale.defaultLanguageId, translateTo = getGlobalConfig().locale.defaultLanguageId) {
	return new Promise(resolve => {
		if (translateFrom == translateTo) {
			resolve(messageText);
		}

		for (let i in cachedTranslations[translateFrom][translateTo]) {
			if (cachedTranslations[translateFrom][translateTo][i][0] == messageText) {
				logToConsole(LOG_DEBUG, `[Translate]: Using existing translation for ${getGlobalConfig().locale.locales[translateFrom].englishName} to ${getGlobalConfig().locale.locales[translateTo].englishName} - (${messageText}), (${cachedTranslations[translateFrom][translateTo][i][1]})`);
				resolve(cachedTranslations[translateFrom][translateTo][i][1]);
				return true;
			}
		}

		let thisTranslationURL = getGlobalConfig().locale.translateURL.format(encodeURIComponent(messageText), toUpperCase(getGlobalConfig().locale.locales[translateFrom].isoCode), toUpperCase(getGlobalConfig().locale.locales[translateTo].isoCode), getGlobalConfig().locale.apiEmail);
		httpGet(
			thisTranslationURL,
			"",
			function (data) {
				data = ArrayBufferToString(data);
				let translationData = JSON.parse(data);
				cachedTranslations[translateFrom][translateTo].push([messageText, translationData.responseData.translatedText]);
				resolve(translationData.responseData.translatedText);
			},
			function (data) {
			}
		);
	});
}

// ===========================================================================

function getLocaleFromCountryISO(isoCode) {
	for (let i in getLocales()) {
		for (let j in getLocales()[i].countries) {
			if (toLowerCase(getLocales()[i].countries[j]) == toLowerCase(isoCode)) {
				return getLocales()[i].id;
			}
		}
	}
}

// ===========================================================================