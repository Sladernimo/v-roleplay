// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: economy.js
// DESC: Provides economy functions
// TYPE: Client (JavaScript)
// ===========================================================================

let currencyString = "${AMOUNT}";

// ===========================================================================

function getCurrencyString(amount) {
	let tempString = currencyString;
	tempString = tempString.replace("{AMOUNT}", toString(makeLargeNumberReadable(amount)));
	return tempString;
}

// ===========================================================================