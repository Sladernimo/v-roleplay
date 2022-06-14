// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
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