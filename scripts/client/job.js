// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: job.js
// DESC: Provides job functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let localPlayerJobType = 0;
let localPlayerWorking = false;
let jobRouteLocationBlip = null;
let jobRouteLocationSphere = null;

let jobBlipBlinkAmount = 0;
let jobBlipBlinkTimes = 10;
let jobBlipBlinkInterval = 500;
let jobBlipBlinkTimer = null;

// ===========================================================================

class JobData {
	constructor(jobId, jobLocationId, name, position, blipModel, pickupModel) {
		this.index = -1;
		this.jobId = jobId;
		this.jobLocationId = jobLocationId;
		this.name = name;
		this.position = position;
		this.blipModel = blipModel;
		this.pickupModel = pickupModel;
		this.blipId = -1;
	}
}

// ===========================================================================

function initJobScript() {
	logToConsole(LOG_DEBUG, "[AGRP.Job]: Initializing job script ...");
	logToConsole(LOG_DEBUG, "[AGRP.Job]: Job script initialized!");
}

// ===========================================================================

function setLocalPlayerJobType(tempJobType) {
	logToConsole(LOG_DEBUG, `[AGRP.Job] Set local player job type to ${tempJobType}`);
	localPlayerJobType = tempJobType;
}

// ===========================================================================

function setLocalPlayerWorkingState(tempWorking) {
	logToConsole(LOG_DEBUG, `[AGRP.Job] Setting working state to ${tempWorking}`);
	localPlayerWorking = tempWorking;
}

// ===========================================================================

function showJobRouteLocation(position, colour) {
	logToConsole(LOG_DEBUG, `[AGRP.Job] Showing job route location at ${position.x}, ${position.y}, ${position.z}`);
	hideJobRouteLocation();
	if (getMultiplayerMod() == AGRP_MPMOD_GTAC) {
		if (getGame() == AGRP_GAME_GTA_SA) {
			// Server-side spheres don't show in GTA SA for some reason.
			jobRouteLocationSphere = game.createPickup(1318, position, 1);
		} else {
			jobRouteLocationSphere = game.createSphere(position, 3);
			jobRouteLocationSphere.colour = colour;
		}

		if (jobRouteLocationBlip != null) {
			destroyElement(jobRouteLocationBlip);
		}

		// Blinking is bugged if player hit the spot before it stops blinking.
		blinkJobRouteLocationBlip(10, position, colour);
		jobRouteLocationBlip = game.createBlip(position, 0, 2, colour);
	}
}

// ===========================================================================

function enteredJobRouteSphere() {
	logToConsole(LOG_DEBUG, `[AGRP.Job] Entered job route sphere`);
	hideJobRouteLocation();
	tellServerPlayerArrivedAtJobRouteLocation();
}

// ===========================================================================

function blinkJobRouteLocationBlip(times, position, colour) {
	jobBlipBlinkTimes = times;
	jobBlipBlinkTimer = setInterval(function () {
		if (jobRouteLocationBlip != null) {
			destroyElement(jobRouteLocationBlip);
			jobRouteLocationBlip = null;
		} else {
			jobRouteLocationBlip = game.createBlip(position, 0, 3, colour);
		}

		if (jobBlipBlinkAmount >= jobBlipBlinkTimes) {
			if (jobRouteLocationBlip != null) {
				destroyElement(jobRouteLocationBlip);
				jobRouteLocationBlip = null;
			}

			jobBlipBlinkAmount = 0;
			jobBlipBlinkTimes = 0;
			jobRouteLocationBlip = game.createBlip(position, 0, 3, colour);
			clearInterval(jobBlipBlinkTimer);
		}
	}, jobBlipBlinkInterval);
}

// ===========================================================================

function hideJobRouteLocation() {
	logToConsole(LOG_DEBUG, `[AGRP.Job] Hiding job route location`);

	if (jobRouteLocationBlip != null) {
		destroyElement(jobRouteLocationBlip);
		jobRouteLocationBlip = null;
	}

	if (jobRouteLocationSphere != null) {
		destroyElement(jobRouteLocationSphere);
		jobRouteLocationSphere = null;
	}

	if (jobBlipBlinkTimer != null) {
		clearInterval(jobBlipBlinkTimer);
	}

	jobBlipBlinkAmount = 0;
	jobBlipBlinkTimes = 0;
}

// ===========================================================================

function receiveJobFromServer(jobId, jobLocationId, name, position, blipModel, pickupModel) {
	logToConsole(LOG_DEBUG, `[AGRP.Job] Received job ${jobId} (${name}) from server`);

	if (getGame() == AGRP_GAME_GTA_IV) {
		if (getJobData(jobId) != false) {
			let jobData = getJobData(jobId);
			jobData.jobLocationId = jobLocationId;
			jobData.name = name;
			jobData.position = position;
			jobData.blipModel = blipModel;
			jobData.pickupModel = pickupModel;

			logToConsole(LOG_DEBUG, `[AGRP.Job] Job ${jobId} already exists. Checking blip ...`);
			if (blipModel == -1) {
				if (jobData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[AGRP.Job] Job ${jobId}'s blip has been removed by the server`);
					if (getGame() == AGRP_GAME_GTA_IV) {
						natives.removeBlipAndClearIndex(getJobData(jobId).blipId);
					} else {
						destroyElement(getElementFromId(blipId));
					}
					jobData.blipId = -1;
				} else {
					logToConsole(LOG_DEBUG, `[AGRP.Job] Job ${jobId}'s blip is unchanged`);
				}
			} else {
				if (jobData.blipId != -1) {
					logToConsole(LOG_DEBUG, `[AGRP.Job] Job ${jobId}'s blip has been changed by the server`);
					if (getGame() == AGRP_GAME_GTA_IV) {
						natives.setBlipCoordinates(jobData.blipId, jobData.position);
						natives.changeBlipSprite(jobData.blipId, jobData.blipModel);
						natives.setBlipMarkerLongDistance(jobData.blipId, false);
						natives.setBlipAsShortRange(jobData.blipId, true);
						natives.changeBlipNameFromAscii(jobData.blipId, `${jobData.name.substr(0, 24)}${(jobData.name.length > 24) ? " ..." : ""}`);
					}
				} else {
					let blipId = createGameBlip(jobData.blipModel, jobData.position, jobData.name);
					if (blipId != -1) {
						jobData.blipId = blipId;
					}
					logToConsole(LOG_DEBUG, `[AGRP.Job] Job ${jobId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
				}
			}
		} else {
			logToConsole(LOG_DEBUG, `[AGRP.Job] Job ${jobId} doesn't exist. Adding ...`);
			let tempJobData = new JobData(jobId, jobLocationId, name, position, blipModel, pickupModel);
			if (blipModel != -1) {
				let blipId = createGameBlip(blipModel, tempJobData.position, tempJobData.name);
				if (blipId != -1) {
					tempJobData.blipId = blipId;
				}
				logToConsole(LOG_DEBUG, `[AGRP.Job] Job ${jobId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
			} else {
				logToConsole(LOG_DEBUG, `[AGRP.Job] Job ${jobId} has no blip.`);
			}
			getServerData().jobs.push(tempJobData);
			setAllJobDataIndexes();
		}
	}
}

// ===========================================================================

/**
 * @param {number} job - The ID of the job (initially provided by server)
 * @return {JobData} The job's data (class instance)
 */
function getJobData(jobId) {
	for (let i in getServerData().jobs) {
		if (getServerData().jobs[i].jobId == jobId) {
			return getServerData().jobs[i];
		}
	}

	return false;
}

// ===========================================================================

function setAllJobDataIndexes() {
	for (let i in getServerData().jobs) {
		jobs[i].index = i;
	}
}

// ===========================================================================