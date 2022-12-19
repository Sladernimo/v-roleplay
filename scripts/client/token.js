// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: token.js
// DESC: Provides "remember me" auto-login token system and functions
// TYPE: Client (JavaScript)
// ===========================================================================

function saveToken(token) {
	saveDataToFile("config/client/token.js", token);
}

// ===========================================================================

function loadToken() {
	return loadDataFromFile("config/client/token.js");
}

// ===========================================================================