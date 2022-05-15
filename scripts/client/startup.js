// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: startup.js
// DESC: Provides startup/shutdown procedures
// TYPE: Client (JavaScript)
// ===========================================================================

function initClientScripts() {
	initGUIScript();
	initNameTagScript();
	initScoreBoardScript();
	initMessagingScript();
	initServerScript();
	initLogoScript();
	initLabelScript();
	initChatBoxScript();
	initAFKScript();
	initKeyBindScript();
	initEventScript();
	initSkinSelectScript();
}

// ===========================================================================

function setUpInitialGame() {
	switch(getGame()) {
		case [VRR_GAME_GTA_III]: {
			game.SET_PLAYER_NEVER_GETS_TIRED(game.GET_PLAYER_ID(), 0);
			game.setGameStat(STAT_PROGRESSMADE, 9999);
			game.setGameStat(STAT_TOTALPROGRESSINGAME, 9999);
			//game.SET_CAR_DENSITY_MULTIPLIER(3.0); // No visual effect. Needs tweaking and testing.
			//game.SET_PED_DENSITY_MULTIPLIER(3.0); // No visual effect. Needs tweaking and testing.
			game.onMission = true; // Disables taxi/vigilante/etc and other start mission triggers
			SetStandardControlsEnabled(true); // Provided by mouse camera script (mousecam.js)
			break;
		}

		case [VRR_GAME_GTA_VC]: {
			game.SET_PLAYER_NEVER_GETS_TIRED(game.GET_PLAYER_ID(), 0);
			game.setGameStat(STAT_PROGRESSMADE, 9999);
			game.setGameStat(STAT_TOTALPROGRESSINGAME, 9999);
			//game.SET_CAR_DENSITY_MULTIPLIER(3.0); // No visual effect. Needs tweaking and testing.
			//game.SET_PED_DENSITY_MULTIPLIER(3.0); // No visual effect. Needs tweaking and testing.

			game.REQUEST_ANIMATION("bikev");
			game.REQUEST_ANIMATION("bikeh");
			game.REQUEST_ANIMATION("biked");
			game.REQUEST_ANIMATION("knife");
			game.REQUEST_ANIMATION("python");
			game.REQUEST_ANIMATION("shotgun");
			game.REQUEST_ANIMATION("buddy");
			game.REQUEST_ANIMATION("tec");
			game.REQUEST_ANIMATION("uzi");
			game.REQUEST_ANIMATION("rifle");
			game.REQUEST_ANIMATION("m60");
			game.REQUEST_ANIMATION("sniper");
			game.REQUEST_ANIMATION("grenade");
			game.REQUEST_ANIMATION("flame");
			game.REQUEST_ANIMATION("medic");
			game.REQUEST_ANIMATION("sunbathe");
			//game.REQUEST_ANIMATION("playidles");
			game.REQUEST_ANIMATION("riot");
			game.REQUEST_ANIMATION("strip");
			game.REQUEST_ANIMATION("lance");
			game.REQUEST_ANIMATION("skate");

			game.LOAD_ALL_MODELS_NOW();
			game.onMission = true; // Disables taxi/vigilante/etc and other start mission triggers
			SetStandardControlsEnabled(true); // Provided by mouse camera script (mousecam.js)
			break;
		}

		case [VRR_GAME_GTA_SA]: {
			game.setGameStat(STAT_WEAPONTYPE_PISTOL_SKILL, 400);
			game.setGameStat(STAT_WEAPONTYPE_PISTOL_SILENCED_SKILL, 400);
			game.setGameStat(STAT_WEAPONTYPE_DESERT_EAGLE_SKILL, 400);
			game.setGameStat(STAT_WEAPONTYPE_SHOTGUN_SKILL, 400);
			game.setGameStat(STAT_WEAPONTYPE_SAWNOFF_SHOTGUN_SKILL, 400);
			game.setGameStat(STAT_WEAPONTYPE_SPAS12_SHOTGUN_SKILL, 400);
			game.setGameStat(STAT_WEAPONTYPE_MICRO_UZI_SKILL, 400);
			game.setGameStat(STAT_WEAPONTYPE_MP5_SKILL, 400);
			game.setGameStat(STAT_WEAPONTYPE_AK47_SKILL, 400);
			game.setGameStat(STAT_WEAPONTYPE_M4_SKILL, 400);
			game.setGameStat(STAT_DRIVING_SKILL, 9999);
			game.setGameStat(STAT_FAT, 9999);
			game.setGameStat(STAT_ENERGY, 9999);
			game.setGameStat(STAT_CYCLE_SKILL, 9999);
			game.setGameStat(STAT_BIKE_SKILL, 9999);
			game.setGameStat(STAT_GAMBLING, 9999);
			game.setGameStat(STAT_PROGRESS_MADE, 9999);
			game.setGameStat(STAT_RESPECT, 0);
			game.setGameStat(STAT_RESPECT_TOTAL, 0);
			game.setGameStat(STAT_SEX_APPEAL, 0);
			game.setGameStat(STAT_STAMINA, 9999);
			game.setGameStat(STAT_TOTAL_PROGRESS, 9999);
			game.setGameStat(STAT_UNDERWATER_STAMINA, 9999);
			game.setGameStat(STAT_BODY_MUSCLE, 9999);

			game.setDefaultInteriors(false); // Disables default yellow cone at doors for entering places in singleplayer
			game.onMission = true; // Disables taxi/vigilante/etc and other start mission triggers
			break;
		}

		case [VRR_GAME_GTA_IV]: {
			natives.allowEmergencyServices(false);
			natives.setCreateRandomCops(true);
			natives.setMaxWantedLevel(0);
			natives.setWantedMultiplier(0.0);
			natives.allowPlayerToCarryNonMissionObjects(natives.getPlayerId(), true);
			natives.setPlayerTeam(natives.getPlayerId(), 0);
			natives.loadAllObjectsNow();
			natives.setCellphoneRanked(false);
			natives.setOverrideNoSprintingOnPhoneInMultiplayer(false);
			natives.setSyncWeatherAndGameTime(false);
			natives.usePlayerColourInsteadOfTeamColour(true);
			natives.disablePauseMenu(true);
			//natives.allowReactionAnims(localPlayer, false);
			natives.allowGameToPauseForStreaming(false);
			natives.allowStuntJumpsToTrigger(false);
			natives.setPickupsFixCars(false);
			natives.forceFullVoice(localPlayer);

			// HUD and Display
			//natives.displayCash(false);
			//natives.displayAmmo(false);
			//natives.displayHud(false);
			//natives.displayRadar(false);
			//natives.displayAreaName(false);
			natives.displayPlayerNames(true);
			natives.setPoliceRadarBlips(false);
			natives.removeTemporaryRadarBlipsForPickups();
			natives.displayNonMinigameHelpMessages(false);
			natives.setDisplayPlayerNameAndIcon(natives.getPlayerId(), true);

			// Item/Money Dropping
			natives.setMoneyCarriedByAllNewPeds(0);
			natives.setDeadPedsDropWeapons(false);
			natives.setPlayersDropMoneyInNetworkGame(false);

			// Population
			//natives.dontSuppressAnyCarModels(5.0);
			//natives.dontSuppressAnyPedModels(5.0);
			//natives.forceGenerateParkedCarsTooCloseToOthers(true);
			//natives.setParkedCarDensityMultiplier(5.0);
			//natives.setRandomCarDensityMultiplier(5.0);
			//natives.setPedDensityMultiplier(5.0);
			//natives.setCarDensityMultiplier(5.0);
			//natives.setScenarioPedDensityMultiplier(5.0, 5.0);
			natives.switchRandomTrains(true);
			natives.switchRandomBoats(true);
			natives.switchAmbientPlanes(true);
			natives.switchMadDrivers(false);

			// Singleplayer Cellphone
			//natives.requestScript("spcellphone");
			//natives.startNewScript("spcellphone", 0);
			// Script "v-blockedscripts" blocks the mpcellphone scripts
			natives.setMessagesWaiting(false); // Seems to have no effect
			natives.setMobilePhoneRadioState(false);

			// Animation libraries
			natives.requestAnims("DANCING");

			// Some last steps
			//natives.loadAllObjectsNow();
			break;
		}

		case VRR_GAME_MAFIA_ONE: {
			game.mapEnabled = false;
			game.setTrafficEnabled(false);
			break;
		}
	}
}

// ===========================================================================

function initClient() {
	loadLocaleConfig();
	loadAllLocaleStrings();

	setUpInitialGame();
}

// ===========================================================================

initClientScripts();

// ===========================================================================
