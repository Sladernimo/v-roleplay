// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: tutorial.js
// DESC: Provides tutorial functions and features
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

function startTutorial(client) {
	getPlayerData(client).tutorialItem = createGroundItem(tutorialItem[0], tutorialItem[1], tutorialItem[3]);
	getPlayerData(client).tutorialVehicle = createGroundItem(tutorialItem[0], tutorialItem[1], tutorialItem[3]);
}

// ===========================================================================

function hasPlayerFinishedTutorial(client) {

}

// ===========================================================================

function isPlayerInTutorial(client) {

}

// ===========================================================================