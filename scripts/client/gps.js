// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: gps.js
// DESC: Provides GPS functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let gpsBlip = null;
let gpsBlipBlinkTimes = 0;
let gpsBlipBlinkAmount = 0;
let gpsBlipBlinkInterval = 500;
let gpsBlipBlinkTimer = null;

// ===========================================================================

function showGPSLocation(position, colour) {
	logToConsole(LOG_DEBUG, `[AGRP.GPS] Showing gps location`);
	if (getMultiplayerMod() == AGRP_MPMOD_GTAC) {
		if (getGame() == AGRP_GAME_GTA_SA) {
			// Server-side spheres don't show in GTA SA for some reason.
			gpsSphere = game.createPickup(1318, position, 1);
		} else {
			gpsSphere = game.createSphere(position, 3);
			gpsSphere.colour = colour;
		}

		if (gpsBlip != null) {
			destroyElement(gpsBlip);
		}

		// Blinking is bugged if player hit the spot before it stops blinking.
		blinkGPSBlip(10, position, colour);
		gpsBlip = game.createBlip(position, 0, 2, colour);
	}
}

// ===========================================================================

function blinkGPSBlip(times, position, colour) {
	gpsBlipBlinkTimes = times;
	gpsBlipBlinkTimer = setInterval(function () {
		if (gpsBlip != null) {
			destroyElement(gpsBlip);
			gpsBlip = null;
		} else {
			gpsBlip = game.createBlip(position, 0, 2, colour);
		}

		if (gpsBlipBlinkAmount >= gpsBlipBlinkTimes) {
			if (gpsBlip != null) {
				destroyElement(gpsBlip);
				gpsBlip = null;
			}

			gpsBlipBlinkAmount = 0;
			gpsBlipBlinkTimes = 0;
			gpsBlip = game.createBlip(position, 0, 2, colour);
			clearInterval(gpsBlipBlinkTimer);
		}
	}, gpsBlipBlinkInterval);
}

// ===========================================================================