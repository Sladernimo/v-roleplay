// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
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