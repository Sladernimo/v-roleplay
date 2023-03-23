// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: job.js
// DESC: Provides job functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let localPlayerJobType = -1;
let localPlayerWorking = false;
let jobRouteLocationBlip = null;
let jobRouteLocationSphere = null;
let jobRouteLocationRadius = 5.0;

let jobRouteLocationIndicatorPosition = toVector3(0.0, 0.0, 0.0);
let jobRouteLocationIndicatorSize = toVector2(32, 32);
let jobRouteLocationIndicatorEnabled = false;
let jobRouteLocationIndicatorImagePath = "files/images/icons/objective-icon.png";
let jobRouteLocationIndicatorImage = null;

let jobBlipBlinkAmount = 0;
let jobBlipBlinkTimes = 10;
let jobBlipBlinkInterval = 500;
let jobBlipBlinkTimer = null;

// ===========================================================================

class JobData {
	constructor() {
		this.index = -1;
		this.jobId = -1;
		this.jobLocationId = -1;
		this.name = "";
		this.position = toVector3(0.0, 0.0, 0.0);
		this.blipModel = -1;
		this.pickupModel = -1;
		this.dimension = -1;
		this.blipId = -1;
	}
}

// ===========================================================================

function initJobScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Job]: Initializing job script ...");
	jobRouteLocationIndicatorImage = loadJobRouteLocationIndicatorImage();
	logToConsole(LOG_DEBUG, "[V.RP.Job]: Job script initialized!");
}

// ===========================================================================

function loadJobRouteLocationIndicatorImage() {
	let imageStream = openFile(jobRouteLocationIndicatorImagePath);
	let tempImage = null;
	if (imageStream != null) {
		tempImage = graphics.loadPNG(imageStream);
		imageStream.close();
	}

	return tempImage;
}

// ===========================================================================

function setLocalPlayerJobType(tempJobType) {
	logToConsole(LOG_DEBUG, `[V.RP.Job] Set local player job type to ${tempJobType}`);
	localPlayerJobType = tempJobType;
}

// ===========================================================================

function setLocalPlayerWorkingState(tempWorking) {
	logToConsole(LOG_DEBUG, `[V.RP.Job] Setting working state to ${tempWorking}`);
	localPlayerWorking = tempWorking;
}

// ===========================================================================

function showJobRouteLocation(position, colour) {
	logToConsole(LOG_DEBUG, `[V.RP.Job] Showing job route location at ${position.x}, ${position.y}, ${position.z}`);
	hideJobRouteLocation();
	if (getMultiplayerMod() == V_MPMOD_GTAC) {
		if (getGame() == V_GAME_GTA_SA) {
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

	if (getGame() == V_GAME_MAFIA_ONE) {
		jobRouteLocationIndicatorPosition = position;
		jobRouteLocationIndicatorEnabled = true;
	}
}

// ===========================================================================

function enteredJobRouteSphere() {
	logToConsole(LOG_DEBUG, `[V.RP.Job] Entered job route sphere`);
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
	logToConsole(LOG_DEBUG, `[V.RP.Job] Hiding job route location`);

	if (isGameFeatureSupported("blip")) {
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

	if (getGame() == V_GAME_MAFIA_ONE) {
		jobRouteLocationIndicatorPosition = toVector3(0.0, 0.0, 0.0);
		jobRouteLocationIndicatorEnabled = false;
	}
}

// ===========================================================================

function receiveJobFromServer(jobId, isDeleted, jobLocationId, name, position, blipModel, pickupModel, hasPublicRank, dimension) {
	logToConsole(LOG_DEBUG, `[V.RP.Job] Received job ${jobId} (${name}) from server`);

	if (!areServerElementsSupported() || getGame() == V_GAME_MAFIA_ONE || getGame() == V_GAME_GTA_IV) {
		if (isDeleted == true) {
			if (getGame() == V_GAME_GTA_IV) {
				natives.removeBlipAndClearIndex(getJobData(jobId).blipId);
			}

			getServerData().jobs.splice(jobs, 1);
			return false;
		}

		if (getJobData(jobId) != false) {
			let jobData = getJobData(jobId);
			jobData.jobId = jobId;
			jobData.jobLocationId = jobLocationId;
			jobData.name = name;
			jobData.position = position;
			jobData.blipModel = blipModel;
			jobData.pickupModel = pickupModel;
			jobData.hasPublicRank = hasPublicRank;
			jobData.dimension = dimension;

			if (isGameFeatureSupported("blip")) {
				logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId} already exists. Checking blip ...`);
				if (blipModel == -1) {
					if (jobData.blipId != -1) {
						logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}'s blip has been removed by the server`);
						if (getGame() == V_GAME_GTA_IV) {
							natives.removeBlipAndClearIndex(getJobData(jobId).blipId);
						} else {
							destroyElement(getElementFromId(blipId));
						}
						jobData.blipId = -1;
					} else {
						logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}'s blip is unchanged`);
					}
				} else {
					if (jobData.blipId != -1) {
						logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}'s blip has been changed by the server`);
						if (getGame() == V_GAME_GTA_IV) {
							natives.setBlipCoordinates(jobData.blipId, jobData.position);
							natives.changeBlipSprite(jobData.blipId, jobData.blipModel);
							natives.changeBlipScale(jobData.blipId, 0.5);
							natives.setBlipMarkerLongDistance(jobData.blipId, false);
							natives.setBlipAsShortRange(jobData.blipId, true);
							natives.changeBlipNameFromAscii(jobData.blipId, `${jobData.name.substr(0, 24)}${(jobData.name.length > 24) ? " ..." : ""} Job`);
						}
					} else {
						let blipId = createGameBlip(jobData.blipModel, jobData.position, jobData.name);
						if (blipId != -1) {
							jobData.blipId = blipId;
						}
						logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
					}
				}
			}
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId} doesn't exist. Adding ...`);
			let jobData = new JobData();
			jobData.jobId = jobId;
			jobData.jobLocationId = jobLocationId;
			jobData.name = name;
			jobData.position = position;
			jobData.blipModel = blipModel;
			jobData.pickupModel = pickupModel;
			jobData.hasPublicRank = hasPublicRank;
			jobData.dimension = dimension;

			if (isGameFeatureSupported("blip")) {
				if (blipModel != -1) {
					let blipId = createGameBlip(blipModel, jobData.position, jobData.name);
					if (blipId != -1) {
						jobData.blipId = blipId;
						if (getGame() == V_GAME_GTA_IV) {
							natives.setBlipCoordinates(jobData.blipId, jobData.position);
							natives.changeBlipSprite(jobData.blipId, jobData.blipModel);
							natives.changeBlipScale(jobData.blipId, 0.5);
							natives.setBlipMarkerLongDistance(jobData.blipId, false);
							natives.setBlipAsShortRange(jobData.blipId, true);
							natives.changeBlipNameFromAscii(jobData.blipId, `${jobData.name.substr(0, 24)}${(jobData.name.length > 24) ? " ..." : " Job"}`);
						}
					} else {
						let blipId = createGameBlip(jobData.blipModel, jobData.position, jobData.name);
						if (blipId != -1) {
							jobData.blipId = blipId;
						}
					}
					logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
				} else {
					logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId} has no blip.`);
				}
			}

			getServerData().jobs.push(jobData);
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
		getServerData().jobs[i].index = i;
	}
}

// ===========================================================================

function removeJobsFromClient() {
	getServerData().jobs.splice(0);
}

// ===========================================================================

function processJobLocationIndicatorRendering() {
	if (jobRouteLocationIndicatorImage == null) {
		logToConsole(LOG_VERBOSE, `[V.RP.Job]: Can't render job location indicator. Image is null.`);
		return false;
	}

	if (getGame() != V_GAME_MAFIA_ONE) {
		logToConsole(LOG_VERBOSE, `[V.RP.Job]: Can't render job location indicator. Unsupported game.`);
		return false;
	}

	if (!jobRouteLocationIndicatorEnabled) {
		logToConsole(LOG_VERBOSE, `[V.RP.Job]: Can't render job location indicator. Disabled`);
		return false;
	}

	let screenPosition = getScreenFromWorldPosition(jobRouteLocationIndicatorPosition);
	screenPosition = fixOffScreenPosition(screenPosition, jobRouteLocationIndicatorSize);
	graphics.drawRectangle(jobRouteLocationIndicatorImage, [screenPosition.x - (jobRouteLocationIndicatorSize.x / 2), screenPosition.y - (jobRouteLocationIndicatorSize.y / 2)], [jobRouteLocationIndicatorSize.x, jobRouteLocationIndicatorSize.y]);
}

// ===========================================================================

function processJobRouteLocationDistance() {
	if (getGame() != V_GAME_MAFIA_ONE) {
		return false;
	}

	if (jobRouteLocationIndicatorEnabled == false) {
		return false;
	}

	if (getDistance(getLocalPlayerPosition(), jobRouteLocationIndicatorPosition) <= jobRouteLocationRadius) {
		logToConsole(LOG_DEBUG, `[V.RP.Job] Reached job route location`);
		hideJobRouteLocation();
		tellServerPlayerArrivedAtJobRouteLocation();
	}
}

// ===========================================================================