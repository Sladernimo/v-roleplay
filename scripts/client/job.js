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

let jobRouteLocationEnabled = false;
let jobRouteLocationPosition = toVector3(0.0, 0.0, 0.0);
let jobRouteLocationColour = toColour(0, 0, 0, 0);

let jobRouteLocationBlip = null;
let jobRouteLocationSphere = null;
let jobRouteLocationRadius = 5.0;
let jobRouteLocationDimension = 0;
let jobRouteLocationType = V_JOB_ROUTE_LOC_TYPE_NONE;

let jobRouteLocationIndicatorSize = toVector2(32, 32);
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

function showJobRouteLocation(position, dimension, colour) {
	logToConsole(LOG_DEBUG, `[V.RP.Job] Showing job route location at ${position.x}, ${position.y}, ${position.z}`);
	hideJobRouteLocation();

	jobRouteLocationEnabled = true;
	jobRouteLocationPosition = position;
	jobRouteLocationDimension = dimension;
	jobRouteLocationColour = colour;

	if (getGame() == V_GAME_GTA_SA) {
		// Server-side spheres don't show in GTA SA for some reason.
		jobRouteLocationSphere = game.createPickup(1318, position, 1);
	} else if (getGame() < V_GAME_GTA_SA) {
		jobRouteLocationSphere = game.createSphere(position, 3);
		jobRouteLocationSphere.colour = colour;
	}

	if (jobRouteLocationBlip != null) {
		destroyElement(jobRouteLocationBlip);
	}

	// Blinking is bugged if player hit the spot before it stops blinking.
	if (getGame() <= V_GAME_GTA_SA) {
		blinkJobRouteLocationBlip(10, position, colour);
		jobRouteLocationBlip = game.createBlip(position, 0, 2, colour);
	}

	if (getGame() == V_GAME_GTA_IV) {
		jobRouteLocationBlip = createGameBlip(gameData.blipSprites[getGame()].Waypoint, position, "Job route stop");
		natives.setBlipMarkerLongDistance(jobRouteLocationBlip, true);
		natives.setBlipAsShortRange(jobRouteLocationBlip, false);
	}
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

	jobRouteLocationPosition = toVector3(0.0, 0.0, 0.0);
	jobRouteLocationEnabled = false;

	if (isGameFeatureSupported("blip")) {
		if (jobRouteLocationBlip != null) {
			if (getGame() == V_GAME_GTA_IV) {
				natives.removeBlip(jobRouteLocationBlip);
			} else {
				destroyElement(jobRouteLocationBlip);
			}
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
}

// ===========================================================================

function receiveJobFromServer(jobId, isDeleted, jobLocationId, name, position, blipModel, pickupModel, hasPublicRank, dimension) {
	logToConsole(LOG_DEBUG, `[V.RP.Job] Received job ${jobId}/${jobLocationId} (${name}) from server`);

	if (!isGameFeatureSupported("serverElements") || getGame() == V_GAME_MAFIA_ONE || getGame() == V_GAME_GTA_IV) {
		if (isDeleted == true) {
			if (getGame() == V_GAME_GTA_IV) {
				natives.removeBlipAndClearIndex(getJobData(jobId, jobLocationId).blipId);
			}

			serverData.jobs.splice(jobs, 1);
			return false;
		}

		if (getJobData(jobId, jobLocationId) != null) {
			let jobData = getJobData(jobId, jobLocationId);
			jobData.jobId = jobId;
			jobData.jobLocationId = jobLocationId;
			jobData.name = name;
			jobData.position = position;
			jobData.blipModel = blipModel;
			jobData.pickupModel = pickupModel;
			jobData.hasPublicRank = hasPublicRank;
			jobData.dimension = dimension;

			if (isGameFeatureSupported("blip")) {
				logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}/${jobLocationId} already exists. Checking blip ...`);
				if (blipModel == -1) {
					if (jobData.blipId != -1) {
						logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}/${jobLocationId}'s blip has been removed by the server`);
						if (getGame() == V_GAME_GTA_IV) {
							natives.removeBlipAndClearIndex(getJobData(jobId, jobLocationId).blipId);
						} else {
							destroyElement(getElementFromId(blipId));
						}
						jobData.blipId = -1;
					} else {
						logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}/${jobLocationId}'s blip is unchanged`);
					}
				} else {
					if (jobData.blipId != -1) {
						logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}/${jobLocationId}'s blip has been changed by the server`);
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
						logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}/${jobLocationId}'s blip has been added by the server (Model ${blipModel}, ID ${blipId})`);
					}
				}
			}
		} else {
			logToConsole(LOG_DEBUG, `[V.RP.Job] Job ${jobId}/${jobLocationId} doesn't exist. Adding ...`);
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

			serverData.jobs.push(jobData);
			setAllJobDataIndexes();
		}
	}
}

// ===========================================================================

/**
 * @param {number} jobId - The ID of the job (initially provided by server)
 * @param {number} jobLocationId - The ID of the job location (initially provided by server)
 * @return {JobData} The job's data (class instance)
 */
function getJobData(jobId, jobLocationId) {
	for (let i in serverData.jobs) {
		if (serverData.jobs[i].jobId == jobId && serverData.jobs[i].jobLocationId == jobLocationId) {
			return serverData.jobs[i];
		}
	}

	return null;
}

// ===========================================================================

function setAllJobDataIndexes() {
	for (let i in serverData.jobs) {
		serverData.jobs[i].index = i;
	}
}

// ===========================================================================

function removeJobsFromClient() {
	serverData.jobs.splice(0);
}

// ===========================================================================

function processJobLocationIndicatorRendering() {
	if (jobRouteLocationIndicatorImage == null) {
		logToConsole(LOG_VERBOSE, `[V.RP.Job]: Can't render job location indicator. Image is null.`);
		return false;
	}

	if (!jobRouteLocationEnabled) {
		logToConsole(LOG_VERBOSE, `[V.RP.Job]: Can't render job location indicator. Disabled`);
		return false;
	}

	if (jobRouteLocationDimension != getLocalPlayerDimension()) {
		logToConsole(LOG_VERBOSE, `[V.RP.Job]: Can't render job location indicator. Wrong dimension`);
		return false;
	}

	if (getGame() == V_GAME_MAFIA_ONE) {
		let screenPosition = getScreenFromWorldPosition(jobRouteLocationPosition);
		screenPosition = fixOffScreenPosition(screenPosition, jobRouteLocationIndicatorSize);
		graphics.drawRectangle(jobRouteLocationIndicatorImage, [screenPosition.x - (jobRouteLocationIndicatorSize.x / 2), screenPosition.y - (jobRouteLocationIndicatorSize.y / 2)], [jobRouteLocationIndicatorSize.x, jobRouteLocationIndicatorSize.y]);
		return true;
	}

	if (getGame() == V_GAME_GTA_IV) {
		let colourArray = rgbaArrayFromToColour(jobRouteLocationColour);
		natives.drawColouredCylinder(jobRouteLocationPosition.x, jobRouteLocationPosition.y, jobRouteLocationPosition.z, jobRouteLocationRadius, jobRouteLocationRadius, colourArray[0], colourArray[1], colourArray[2], colourArray[3]);
	}
}

// ===========================================================================

function processJobRouteLocationDistance() {
	if (jobRouteLocationEnabled == false) {
		return false;
	}

	if (jobRouteLocationType != V_JOB_ROUTE_LOC_TYPE_CHECKPOINT) {
		return false;
	}

	if (getDistance(getLocalPlayerPosition(), jobRouteLocationPosition) <= jobRouteLocationRadius) {
		logToConsole(LOG_DEBUG, `[V.RP.Job] Reached job route location`);
		hideJobRouteLocation();
		tellServerPlayerArrivedAtJobRouteLocation();
	}
}

// ===========================================================================