// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: job.js
// DESC: Provides job functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initJobScript() {
	logToConsole(LOG_INFO, "[VRR.Job]: Initializing job script ...");
	logToConsole(LOG_INFO, "[VRR.Job]: Job script initialized successfully!");
	return true;
}

// ===========================================================================

function loadJobsFromDatabase() {
	logToConsole(LOG_DEBUG, "[VRR.Job]: Loading jobs from database ...");

	let tempJobs = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM job_main WHERE job_enabled = 1 AND job_server = ${getServerId()}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobData = new JobData(dbAssoc);
					tempJobData.locations = loadJobLocationsFromDatabase(tempJobData.databaseId);
					tempJobData.equipment = loadJobEquipmentsFromDatabase(tempJobData.databaseId);
					tempJobData.uniforms = loadJobUniformsFromDatabase(tempJobData.databaseId);
					tempJobData.routes = loadJobRoutesFromDatabase(tempJobData.databaseId);
					tempJobs.push(tempJobData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job '${tempJobData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobs.length} jobs loaded from database successfully!`);
	return tempJobs;
}

// ===========================================================================

function loadAllJobEquipmentFromDatabase() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].equipment = loadJobEquipmentsFromDatabase(getServerData().jobs[i].databaseId);
	}
}

// ===========================================================================

function loadAllJobUniformsFromDatabase() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].uniforms = loadJobUniformsFromDatabase(getServerData().jobs[i].databaseId);
	}
}

// ===========================================================================

function loadAllJobRoutesFromDatabase() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].routes = loadJobRoutesFromDatabase(getServerData().jobs[i].databaseId);
	}
}

// ===========================================================================

function loadAllJobLocationsFromDatabase() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].locations = loadJobLocationsFromDatabase(getServerData().jobs[i].databaseId);
	}
}

// ===========================================================================

function loadJobRoutesFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job routes for job ${jobDatabaseId} from database ...`);

	let tempJobRoutes = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM job_route WHERE job_route_enabled = 1 AND job_route_job = ${jobDatabaseId}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobRouteData = new JobRouteData(dbAssoc);
					tempJobRouteData.locations = loadJobRouteLocationsFromDatabase(tempJobRouteData.databaseId);
					tempJobRoutes.push(tempJobRouteData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job route '${tempJobRouteData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobRoutes.length} job routes for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobRoutes;
}

// ===========================================================================

function loadJobRouteLocationsFromDatabase(jobRouteId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading locations for job route ${jobRouteId} from database ...`);

	let tempJobRouteLocations = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, `SELECT * FROM job_route_loc WHERE job_route_loc_enabled = 1 AND job_route_loc_route = ${jobRouteId}`);
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobRouteLocationData = new JobRouteLocationData(dbAssoc);
					tempJobRouteLocations.push(tempJobRouteLocationData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job route location '${tempJobRouteLocationData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobRouteLocations.length} locations for job route ${jobRouteId} loaded from database successfully!`);
	return tempJobRouteLocations;
}

// ===========================================================================

function loadJobEquipmentsFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job equipments for job ${jobDatabaseId} from database ...`);

	let tempJobEquipments = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_equip` WHERE `job_equip_enabled` = 1 AND `job_equip_job` = " + toString(jobDatabaseId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobEquipmentData = new JobEquipmentData(dbAssoc);
					tempJobEquipmentData.items = loadJobEquipmentItemsFromDatabase(tempJobEquipmentData.databaseId);
					tempJobEquipments.push(tempJobEquipmentData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job equipment '${tempJobEquipmentData.name}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobEquipments.length} job equipments for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobEquipments;
}

// ===========================================================================

function loadJobLocationsFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job locations for job ${jobDatabaseId} from database ...`);

	let tempJobLocations = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_loc` WHERE `job_loc_enabled` = 1 AND `job_loc_job` = " + toString(jobDatabaseId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobLocationData = new JobLocationData(dbAssoc);
					tempJobLocations.push(tempJobLocationData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job location '${tempJobLocationData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobLocations.length} job locations for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobLocations;
}

// ===========================================================================

function loadJobUniformsFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job uniforms for job ${jobDatabaseId} from database ...`);

	let tempJobUniforms = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_uniform` WHERE `job_uniform_enabled` = 1 AND `job_uniform_job` = " + toString(jobDatabaseId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobUniformData = new JobUniformData(dbAssoc);
					tempJobUniforms.push(tempJobUniformData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job uniform '${tempJobUniformData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobUniforms.length} job uniforms for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobUniforms;
}

// ===========================================================================

function loadJobEquipmentItemsFromDatabase(jobEquipmentDatabaseId) {
	logToConsole(LOG_DEBUG, `[VRR.Job]: Loading job equipment items for job equipment ${jobEquipmentDatabaseId} from database ...`);

	let tempJobEquipmentItems = [];
	let dbConnection = connectToDatabase();
	let dbQuery = null;
	let dbAssoc;

	if(dbConnection) {
		dbQuery = queryDatabase(dbConnection, "SELECT * FROM `job_equip_item` WHERE `job_equip_item_enabled` = 1 AND `job_equip_item_equip` = " + toString(jobEquipmentDatabaseId));
		if(dbQuery) {
			if(dbQuery.numRows > 0) {
				while(dbAssoc = fetchQueryAssoc(dbQuery)) {
					let tempJobEquipmentItemData = new JobEquipmentItemData(dbAssoc);
					tempJobEquipmentItems.push(tempJobEquipmentItemData);
					logToConsole(LOG_DEBUG, `[VRR.Job]: Job equipment item '${tempJobEquipmentItemData.databaseId}' loaded from database successfully!`);
				}
			}
			freeDatabaseQuery(dbQuery);
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: ${tempJobEquipmentItems.length} job equipment items for equipment ${jobEquipmentDatabaseId} loaded from database successfully!`);
	return tempJobEquipmentItems;
}

// ===========================================================================

function createAllJobBlips() {
	if(!getServerConfig().createJobBlips) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job] Spawning all job location blips ...`);
	for(let i in getServerData().jobs) {
		for(let j in getServerData().jobs[i].locations) {
			createJobLocationBlip(i, j);
		}
	}
	logToConsole(LOG_DEBUG, `[VRR.Job] All job location blips spawned!`);
}

// ===========================================================================

function createAllJobPickups() {
	if(!getServerConfig().createJobPickups) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job] Spawning all job location pickups ...`);
	let pickupCount = 0;
	for(let i in getServerData().jobs) {
		if(getServerData().jobs[i].pickupModel != 0) {
			for(let j in getServerData().jobs[i].locations) {
				pickupCount++;
				getServerData().jobs[i].locations[j].pickup = game.createPickup(getServerData().jobs[i].pickupModel, getServerData().jobs[i].locations[j].position);
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.owner.type", VRR_PICKUP_JOB, false);
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.owner.id", j, false);
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.label.type", VRR_LABEL_JOB, true);
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.label.name", getServerData().jobs[i].name, true);
				setEntityData(getServerData().jobs[i].locations[j].pickup, "vrr.label.jobType", getServerData().jobs[i].databaseId, true);
				setElementOnAllDimensions(getServerData().jobs[i].locations[j].pickup, false);
				setElementDimension(getServerData().jobs[i].locations[j].pickup, getServerData().jobs[i].locations[j].dimension);
				addToWorld(getServerData().jobs[i].locations[j].pickup);

				logToConsole(LOG_DEBUG, `[VRR.Job] Job '${getServerData().jobs[i].name}' location pickup ${j} spawned!`);
			}
		}
	}
	logToConsole(LOG_DEBUG, `[VRR.Job] All job location pickups (${pickupCount}) spawned!`);
}

// ===========================================================================

function showJobInformationToPlayer(client, jobType) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	if(jobType == getPlayerCurrentSubAccount(client).job) {
		messagePlayerInfo("Welcome back to your job. Use /startwork to begin.");
		return false;
	}

	switch(jobType) {
		case VRR_JOB_POLICE:
			if(!canPlayerUsePoliceJob(client)) {
				return false;
			}

			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Police Officers are enforcers of the law.");
			messagePlayerInfo(client, "- Use /startwork at a police station to work as a Police Officer.");
			messagePlayerInfo(client, "- Use /laws to see a list of laws.");
			messagePlayerInfo(client, "- Commands are: /cuff, /drag, /detain, /arrest, /search /tazer /radio");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_MEDICAL:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Paramedics help people by healing them.");
			messagePlayerInfo(client, "- Use /startwork at the hospital to work as a Paramedic.");
			messagePlayerInfo(client, "- People can enter your ambulance to get healed.");
			messagePlayerInfo(client,  "- The pay depends on the player's health before healing them.");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_FIRE:
			if(!canClientUseFireJob(client)) {
				return false;
			}
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Firefighters put out vehicle and building fires.");
			messagePlayerInfo(client, "- Use /startwork at the fire station to work as a Firefighter.");
			messagePlayerInfo(client, "- Get in a firetruck and you will be told where to go.");
			messagePlayerInfo(client, "- Use the firetruck hose to put out fires");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_BUS:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Bus Drivers transport people around the city on a route");
			messagePlayerInfo(client, "- Use /startwork at the bus depot to work as a Bus Driver.");
			messagePlayerInfo(client, "- Passengers can get on/off at any stop on your route");
			messagePlayerInfo(client, "- Stay on your assigned route. You will be paid when finished.");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_TAXI:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Taxi Drivers transport people around the city");
			messagePlayerInfo(client, "- Use /startwork at the taxi depot to work as a Taxi Driver.");
			messagePlayerInfo(client, "- Use /fare to set a fare. Fares start when a player gets in.");
			messagePlayerInfo(client, "- The meter will run until the player exits the vehicle.");
			messagePlayerInfo(client, "- You will automatically receive the fare money");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_GARBAGE:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Garbage Collectors pick up the trash around the city.");
			messagePlayerInfo(client, "- Use /startwork at the garbage depot to work as a Garbage Collector.");
			messagePlayerInfo(client, "- Drive up to a garbage can or dumpster, and right click to grab a bag.");
			messagePlayerInfo(client, "- Walk up to the back of your truck and right click again to throw the bag in.");
			messagePlayerInfo(client, "- Your truck can hold 25 trashbags. Each bag is worth $25");
			messagePlayerInfo(client, "- Drive to the garbage depot again to deliver trash");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case VRR_JOB_WEAPON:
			break;

		case VRR_JOB_DRUG:
			break;

		default:
			break;
	}
}

// ===========================================================================

function jobListCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use any jobs!");
		return false;
	}

	let jobList = getServerData().jobs.map(function(x) { return `${x.name}`});
	let chunkedList = splitArrayIntoChunks(jobList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobList")));
	for(let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
	return true;
}

// ===========================================================================

function takeJobCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use any jobs!");
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));
	let jobData = getJobData(closestJobLocation.jobIndex);

	if(closestJobLocation.position.distance(getPlayerPosition(client)) > getGlobalConfig().takeJobDistance) {
		messagePlayerError(client, "There are no job points close enough!");
		return false;
	}

	if(getPlayerCurrentSubAccount(client).job > VRR_JOB_NONE) {
		messagePlayerInfo(client, getLocaleString(client, "QuitJobToTakeAnother", "{ALTCOLOUR}/quitjob{MAINCOLOUR}"));
		return false;
	}

	if(!canPlayerUseJob(client, closestJobLocation.jobIndex)) {
		messagePlayerError(client, "You can't use this job!");
		return false;
	}

	takeJob(client, closestJobLocation.jobIndex);
	messagePlayerSuccess(client, `{MAINCOLOUR}You now have the {jobYellow}${jobData.name} {MAINCOLOUR}job`);
	return true;
}

// ===========================================================================

function startWorkingCommand(command, params, client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));
	let jobData = false;

	if(closestJobLocation.position.distance(getPlayerPosition(client)) > getGlobalConfig().startWorkingDistance) {
		let closestVehicle = getClosestVehicle(getPlayerPosition(client));
		if(getDistance(getVehiclePosition(closestVehicle), getPlayerPosition(client)) > getGlobalConfig().startWorkingDistance) {
			messagePlayerError(client, "You need to be near your job site or vehicle that belongs to your job!");
			return false;
		}

		if(getVehicleData(closestVehicle).ownerType != VRR_VEHOWNER_JOB) {
			messagePlayerError(client, getLocaleString(client, "NotAJobVehicle"));
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != getVehicleData(closestVehicle).ownerId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJobVehicle"));
			return false;
		}

		jobData = getJobData(getJobIdFromDatabaseId(getVehicleData(closestVehicle).ownerId));
	} else {
		if(getPlayerCurrentSubAccount(client).job == VRR_JOB_NONE) {
			messagePlayerError(client, "You don't have a job!");
			messagePlayerInfo(client, "You can get a job by going the yellow points on the map.");
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != closestJobLocation.jobId) {
			messagePlayerError(client, "This is not your job!");
			messagePlayerInfo(client, getLocaleString(client, "QuitJobToTakeAnother", "{ALTCOLOUR}/quitjob{MAINCOLOUR}"));
			return false;
		}

		jobData = getJobData(closestJobLocation.jobIndex);
	}

	if(!jobData.enabled) {
		messagePlayerError(client, getLocaleString(client, "JobDisabled", jobData.name));
		return false;
	}

	messagePlayerSuccess(client, `💼 You are now working for the {jobYellow}${jobData.name}{MAINCOLOUR} job`);
	messageDiscordEventChannel(`💼 ${getCharacterFullName(client)} started working for the {jobYellow}${jobData.name}{MAINCOLOUR} job`);

	startWorking(client);
	//messagePlayerNewbieTip(client, `Enter a job vehicle to get started!`);
	return true;
}

// ===========================================================================

function stopWorkingCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working!");
		return false;
	}

	deleteJobItems(client);
	stopWorking(client);
	messagePlayerSuccess(client, "You have stopped working!");
	return true;
}

// ===========================================================================

function startWorking(client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	switchPlayerActiveHotBarSlot(client, -1);
	getPlayerCurrentSubAccount(client).skin = getPlayerSkin(client);
	storePlayerItemsInJobLocker(client);
	messagePlayerInfo(client, "Your personal items have been stored in your locker while you work");

	getPlayerCurrentSubAccount(client).isWorking = true;

	let jobId = getPlayerCurrentSubAccount(client).job;
	switch(getJobIndexFromDatabaseId(jobId)) {
		case VRR_JOB_POLICE:
			messagePlayerInfo(client, getLocaleString(client, "JobEquipAndUniformLabel", `{ALTCOLOUR}/uniform{MAINCOLOUR}, {ALTCOLOUR}/equip{MAINCOLOUR}`));
			break;

		case VRR_JOB_MEDICAL:
			messagePlayerInfo(client, getLocaleString(client, "JobEquipAndUniformLabel", `{ALTCOLOUR}/uniform{MAINCOLOUR}, {ALTCOLOUR}/equip{MAINCOLOUR}`));
			break;

		case VRR_JOB_FIRE:
			messagePlayerInfo(client, getLocaleString(client, "JobEquipAndUniformLabel", `{ALTCOLOUR}/uniform{MAINCOLOUR}, {ALTCOLOUR}/equip{MAINCOLOUR}`));
			break;

		case VRR_JOB_BUS:
			messagePlayerInfo(client, getLocaleString(client, "GetStartedJobVehicle", getGroupedLocaleString(client, "VehicleTypes", "Bus")));
			break;

		case VRR_JOB_TAXI:
			messagePlayerInfo(client, getLocaleString(client, "GetStartedJobVehicle", getGroupedLocaleString(client, "VehicleTypes", "Taxi")));
			break;

		case VRR_JOB_GARBAGE:
			messagePlayerInfo(client, getLocaleString(client, "GetStartedJobVehicle", getGroupedLocaleString(client, "VehicleTypes", "GarbageTruck")));
			break;

		case VRR_JOB_WEAPON:
			break;

		case VRR_JOB_DRUG:
			break;

		default:
			break;
	}

	updatePlayerNameTag(client);
	sendPlayerWorkingState(client, true);
	//showStartedWorkingTip(client);
}

// ===========================================================================

function getJobInfoCommand(command, params, client) {
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));

	messagePlayerInfo(client, `{jobYellow}[Job Info] {MAINCOLOUR}Name: {ALTCOLOUR}${getJobData(closestJobLocation.jobIndex).name}, {MAINCOLOUR}Enabled: {ALTCOLOUR}${getYesNoFromBool(intToBool(getJobData(closestJobLocation.jobIndex).enabled))}, {MAINCOLOUR}Whitelisted: {ALTCOLOUR}${getYesNoFromBool(intToBool(getJobData(closestJobLocation.jobIndex).whiteListEnabled))}, {MAINCOLOUR}Blacklisted: {ALTCOLOUR}${getYesNoFromBool(intToBool(getJobData(closestJobLocation.jobIndex).blackListEnabled))}, {MAINCOLOUR}ID: {ALTCOLOUR}${getJobData(closestJobLocation.jobIndex).databaseId}/${closestJobLocation.jobIndex}`);
}

// ===========================================================================

function getJobLocationInfoCommand(command, params, client) {
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));

	messagePlayerInfo(client, `{jobYellow}[Job Location Info] {MAINCOLOUR}Job: {ALTCOLOUR}${getJobData(closestJobLocation.jobIndex).name} (${getJobData(closestJobLocation.jobIndex).databaseId}/${closestJobLocation.jobIndex}), {MAINCOLOUR}Enabled: {ALTCOLOUR}${getYesNoFromBool(closestJobLocation.enabled)}, {MAINCOLOUR}Database ID: {ALTCOLOUR}${closestJobLocation.databaseId}`);
}

// ===========================================================================

function givePlayerJobEquipment(client, equipmentId) {
	if(!canPlayerUseJobs(client)) {
		return false;
	}

	let jobId = getPlayerJob(client);

	for(let i in getJobData(jobId).equipment[equipmentId].items) {
		let value = getJobData(jobId).equipment[equipmentId].items[i].value
		if(getItemTypeData(getItemTypeIndexFromDatabaseId(getJobData(jobId).equipment[equipmentId].items[i].itemType)).useType == VRR_ITEM_USETYPE_WALKIETALKIE) {
			value = getJobData(jobId).walkieTalkieFrequency;
		}
		let itemId = createItem(getItemTypeIndexFromDatabaseId(getJobData(jobId).equipment[equipmentId].items[i].itemType), value, VRR_ITEM_OWNER_PLAYER, getPlayerCurrentSubAccount(client).databaseId);
		getItemData(itemId).needsSaved = false;
		getItemData(itemId).databaseId = -1; // Make sure it doesnt save
		let freeSlot = getPlayerFirstEmptyHotBarSlot(client);
		getPlayerData(client).hotBarItems[freeSlot] = itemId;
		getPlayerData(client).jobEquipmentCache.push(itemId);
		updatePlayerHotBar(client);
	}

	switchPlayerActiveHotBarSlot(client, -1);
}

// ===========================================================================

function stopWorking(client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	if(!isPlayerWorking(client)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).isWorking = false;

	setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);

	let jobVehicle = getPlayerData(client).lastJobVehicle;
	if(jobVehicle) {
		if(getPlayerVehicle(client) == jobVehicle) {
			removePlayerFromVehicle(client);
			//getPlayerPed(client).removeFromVehicle();
		}

		respawnVehicle(jobVehicle);

		getPlayerData(client).lastJobVehicle = false;
	}

	setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);
	deleteJobItems(client);
	restorePlayerJobLockerItems(client);
	respawnJobVehicle(client);
	sendPlayerStopJobRoute(client);
	messageDiscordEventChannel(`💼 ${getPlayerName(client)} has stopped working as a ${getJobData(jobId).name}`);

	let jobId = getPlayerJob(client);
	switch(getJobType(jobId)) {
		case VRR_JOB_POLICE:
			messagePlayerInfo(client, "Your uniform, equipment, and vehicle have been returned to the police station");
			break;

		case VRR_JOB_MEDICAL:
			messagePlayerInfo(client, "Your uniform, equipment, and vehicle have been returned to the hospital");
			break;

		case VRR_JOB_FIRE:
			messagePlayerInfo(client, "Your uniform, equipment, and vehicle have been returned to the fire station");
			break;

		case VRR_JOB_BUS:
			messagePlayerInfo(client, "Your vehicle has been returned to the bus depot");
			break;

		case VRR_JOB_TAXI:
			messagePlayerInfo(client, "Your vehicle has been returned to the taxi depot");
			break;

		case VRR_JOB_GARBAGE:
			messagePlayerInfo(client, "Your vehicle has been returned to the city trash dump");
			break;

		case VRR_JOB_WEAPON:
			break;

		case VRR_JOB_DRUG:
			break;

		case VRR_JOB_GENERIC:
			messagePlayerInfo(client, "Your vehicle has been respawned at your job location");
			break;

		default:
			break;
	}

	updatePlayerNameTag(client);
	sendPlayerWorkingState(client, false);
	//cachePlayerHotBarItems(client); // Done in restorePlayerJobLockerItems
}

// ===========================================================================

function jobUniformCommand(command, params, client) {
	if(!getPlayerJob(client)) {
		messagePlayerError(client, "You don't have a job!");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork at your job location or a job vehicle.");
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));
	let jobData = false;

	if(closestJobLocation.position.distance(getPlayerPosition(client)) > getGlobalConfig().startWorkingDistance) {
		let closestVehicle = getClosestVehicle(getPlayerPosition(client));
		if(getDistance(getVehiclePosition(closestVehicle), getPlayerPosition(client)) > getGlobalConfig().startWorkingDistance) {
			messagePlayerError(client, "You need to be near your job site or vehicle that belongs to your job!");
			return false;
		}

		if(getVehicleData(closestVehicle).ownerType != VRR_VEHOWNER_JOB) {
			messagePlayerError(client, getLocaleString(client, "NotAJobVehicle"));
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != getVehicleData(closestVehicle).ownerId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJobVehicle"));
			return false;
		}

		jobData = getJobData(getJobIdFromDatabaseId(getVehicleData(closestVehicle).ownerId));
	} else {
		if(getPlayerCurrentSubAccount(client).job == VRR_JOB_NONE) {
			messagePlayerError(client, getLocaleString(client, "NotYourJob"));
			messagePlayerInfo(client, getLocaleString(client, "JobPoints"));
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != closestJobLocation.jobId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJob"));
			messagePlayerInfo(client, getLocaleString(client, "QuitJobToTakeAnother", "{ALTCOLOUR}/quitjob{MAINCOLOUR}"));
			return false;
		}

		jobData = getJobData(closestJobLocation.jobIndex);
	}

	if(!jobData.enabled) {
		messagePlayerError(client, getLocaleString(client, "JobDisabled", jobData.name));
		return false;
	}

	let uniforms = jobData.uniforms;

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));

		let uniformList = jobData.uniforms.map(function(x) { return `{MAINCOLOUR}${toInteger(x.index)+1}: {ALTCOLOUR}${x.name}`});
		let chunkedList = splitArrayIntoChunks(uniformList, 4);

		messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobUniformList")));
		for(let i in chunkedList) {
			messagePlayerInfo(client, chunkedList[i].join(", "));
		}
		return false;
	}

	let uniformId = toInteger(params) || 1;
	if(uniformId < 0 || uniformId > uniforms.length) {
		messagePlayerError(client, getLocaleString(client, "InvalidJobUniform"));
		return false;
	}

	if(uniformId == 0) {
		setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);
		meActionToNearbyPlayers(client, `takes off their uniform`);
	} else {
		setPlayerSkin(client, jobData.uniforms[uniformId-1].skin);
		meActionToNearbyPlayers(client, `puts on ${getProperDeterminerForName(jobData.uniforms[uniformId-1].name)} ${jobData.uniforms[uniformId-1].name} uniform`);
	}
}

// ===========================================================================

function jobEquipmentCommand(command, params, client) {
	if(!getPlayerJob(client)) {
		messagePlayerError(client, "You don't have a job!");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork at your job location.");
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));
	let jobData = false;

	if(closestJobLocation.position.distance(getPlayerPosition(client)) > getGlobalConfig().startWorkingDistance) {
		let closestVehicle = getClosestVehicle(getPlayerPosition(client));
		if(getDistance(getVehiclePosition(closestVehicle), getPlayerPosition(client)) > getGlobalConfig().startWorkingDistance) {
			messagePlayerError(client, "You need to be near your job site or vehicle that belongs to your job!");
			return false;
		}

		if(getVehicleData(closestVehicle).ownerType != VRR_VEHOWNER_JOB) {
			messagePlayerError(client, getLocaleString(client, "NotAJobVehicle"));
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != getVehicleData(closestVehicle).ownerId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJobVehicle"));
			return false;
		}

		jobData = getJobData(getJobIdFromDatabaseId(getVehicleData(closestVehicle).ownerId));
	} else {
		if(getPlayerCurrentSubAccount(client).job == VRR_JOB_NONE) {
			messagePlayerError(client, getLocaleString(client, "NotYourJob"));
			messagePlayerInfo(client, getLocaleString(client, "JobPoints"));
			return false;
		}

		if(getPlayerCurrentSubAccount(client).job != closestJobLocation.jobId) {
			messagePlayerError(client, "This is not your job!");
			messagePlayerInfo(client, getLocaleString(client, "QuitJobToTakeAnother", "{ALTCOLOUR}/quitjob{MAINCOLOUR}"));
			return false;
		}

		jobData = getJobData(closestJobLocation.jobIndex);
	}

	if(!jobData.enabled) {
		messagePlayerError(client, getLocaleString(client, "JobDisabled", jobData.name));
		return false;
	}

	let equipments = jobData.equipment;

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		messagePlayerNormal(client, `0: No equipment`);
		for(let i in equipments) {
			messagePlayerNormal(client, `${toInteger(i)+1}: ${equipments[i].name} (Requires rank ${equipments[i].requiredRank})`);
		}
		return false;
	}

	let equipmentId = toInteger(params) || 1;

	if(equipmentId == 0) {
		meActionToNearbyPlayers(client, `puts their equipment into the locker`);
		return true;
	}

	if(equipmentId < 1 || equipmentId > equipments.length) {
		messagePlayerError(client, "That equipment ID is invalid!");
		return false;
	}

	deleteJobItems(client);
	givePlayerJobEquipment(client, equipmentId-1);
	//messagePlayerSuccess(client, `You have been given the ${equipments[equipmentId-1].name} equipment`);
	meActionToNearbyPlayers(client, `grabs the ${jobData.equipment[equipmentId-1].name} equipment from the locker`);
	if(doesPlayerHaveKeyBindForCommand(client, "inv")) {
		messagePlayerTip(client, getLocaleString(client, "JobEquipmentInventoryKeyBindTip", toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "inv").key))));
	} else {
		messagePlayerTip(client, getLocaleString(client, "JobEquipmentInventoryCommandTip", "/inv"));
	}
}

// ===========================================================================

function quitJobCommand(command, params, client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	stopWorking(client);
	quitJob(client);
	messagePlayerSuccess(client, "You are now unemployed!");
	return true;
}

// ===========================================================================

function jobRadioCommand(command, params, client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	return true;
}

// ===========================================================================

function jobDepartmentRadioCommand(command, params, client) {
	if(!canPlayerUseJobs(client)){
		return false;
	}

	return true;
}

// ===========================================================================

function getJobType(jobId) {
	return getJobData(jobId).type;
}

// ===========================================================================

function doesPlayerHaveJobType(client, jobType) {
	return (getJobType(getJobIdFromDatabaseId(getPlayerCurrentSubAccount(client).job)) == jobType) ? true : false;
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @return {JobData} The job's data (class instance)
 */
function getJobData(jobId) {
	if(typeof getServerData().jobs[jobId] != "undefined") {
		return getServerData().jobs[jobId];
	}

	return false;
}

// ===========================================================================

function quitJob(client) {
	stopWorking(client);
	getPlayerCurrentSubAccount(client).job = 0;
	sendPlayerJobType(client, 0);
	updateJobBlipsForPlayer(client);
}

// ===========================================================================

function takeJob(client, jobId) {
	getPlayerCurrentSubAccount(client).job = getJobData(jobId).databaseId;
	sendPlayerJobType(client, getJobData(jobId).databaseId);
	updateJobBlipsForPlayer(client);
}

// ===========================================================================

function reloadAllJobsCommand(command, params, client) {
	forceAllPlayersToStopWorking();

	deleteAllJobBlips();
	deleteAllJobPickups();
	clearArray(getServerData().jobs);

	Promise.resolve().then(() => {
		getServerData().jobs = loadJobsFromDatabase();
		createJobLocationPickup(i, j);
		createJobLocationBlip(i, j);
    });

	announceAdminAction("AllJobsReloaded");
}

// ===========================================================================

function createJobCommand(command, params, client) {
	createJob(params);

	messagePlayerSuccess(client, `Job {jobYellow}${params} {MAINCOLOUR}created!`);
	return true;
}

// ===========================================================================

function createJob(name) {
	let tempJobData = new JobData(false);
	tempJobData.serverId = getServerId();
	tempJobData.name = name;
	tempJobData.enabled = true;
	tempJobData.needsSaved = true;
	tempJobData.blipModel = getGameConfig().blipSprites[getGame()].Job;
	tempJobData.pickupModel = getGameConfig().pickupModels[getGame()].Job;
	tempJobData.colour = toColour(255, 255, 255, 255);

	getServerData().jobs.push(tempJobData);
	saveJobToDatabase(tempJobData);
	setAllJobDataIndexes();
}

// ===========================================================================

function createJobLocationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params);

	if(!getJobData(jobId)) {
		messagePlayerError(client, "That job was not found!");
		return false;
	}

	createJobLocation(jobId, getPlayerPosition(client), getPlayerInterior(client), getPlayerDimension(client));
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a location for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
	return true;
}

// ===========================================================================

function deleteJobLocationCommand(command, params, client) {
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted location {ALTCOLOUR}${closestJobLocation.index} (DB ID ${closestJobLocation.databaseId}){MAINCOLOUR} for the {jobYellow}${getJobData(closestJobLocation.jobIndex).name}{MAINCOLOUR} job`);


	deleteJobLocation(closestJobLocation);
}

// ===========================================================================

function toggleJobLocationEnabledCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));

	closestJobLocation.enabled = !closestJobLocation.enabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(closestJobLocation.enabled)} location {ALTCOLOUR}${closestJobLocation.databaseId} {MAINCOLOUR}for the {jobYellow}${getJobData(closestJobLocation.jobIndex).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function toggleJobEnabledCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	getJobData(jobId).enabled = !getJobData(jobId).enabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}${getEnabledDisabledFromBool(getJobData(jobId).enabled)}{MAINCOLOUR} the {jobYellow}${getJobData(jobId).name} {MAINCOLOUR}job`);
}

// ===========================================================================

function addJobUniformCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!areThereEnoughParams(params, 4, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;
	let skinIndex = getSkinIndexFromParams(getParam(params, " ", 2));
	let rankLevel = getParam(params, " ", 2) || 0;

	createJobUniform(jobId, skinIndex, rankLevel);
	getJobData(jobId).needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} added a {ALTCOLOUR}${getSkinNameFromIndex(skinIndex)}{MAINCOLOUR} to job {jobYellow}${getJobData(jobId).name}{MAINCOLOUR}`);
}

// ===========================================================================

function createJobUniform(jobId, skinIndex, rankLevel) {
	let tempJobUniformData = new JobUniformData(false);
	tempJobUniformData.skin = skinIndex;
	tempJobUniformData.job = getJobData(jobId).databaseId;
	tempJobUniformData.jobIndex = jobId;
	tempJobUniformData.requiredRank = rankLevel;

	getJobData(jobId).uniforms.push(tempJobUniformData);
	return true;
}

// ===========================================================================

function setJobColourCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!areThereEnoughParams(params, 4, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;
	let red = getParam(params, " ", 2) || 255;
	let green = getParam(params, " ", 3) || 255;
	let blue = getParam(params, " ", 4) || 255;

	getJobData(jobId).colour = toColour(toInteger(red), toInteger(green), toInteger(blue), 255);
	getJobData(jobId).needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set job {jobYellow}${getJobData(jobId).name}'s{MAINCOLOUR} colour to ${red}, ${green}, ${blue}`);

	// Force nametag update in case somebody is using this job
	updateAllPlayerNameTags();
}

// ===========================================================================

function setJobBlipCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!areThereEnoughParams(params, 4, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(getParam(params, " ", 1)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;
	let blipParam = getParam(params, " ", 2);

	let blipId = getJobData(jobId).blipModel;
	let blipString = "unchanged";

	if(isNaN(blipParam)) {
		if(toLowerCase(blipParam) == "none") {
			blipId = -1;
		} else {
			let blipTypes = Object.keys(getGameConfig().blipSprites[getGame()]).join(", ");
			let chunkedList = splitArrayIntoChunks(blipTypes, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBlipTypes")));
			for(let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}

			blipId = getGameConfig().blipSprites[getGame()][blipParam];
			blipString = toString(blipParam);
		}
	} else {
		blipId = toInteger(blipParam);
		blipString = toString(blipId);
	}

	getJobData(jobId).blipModel = blipId;
	getJobData(jobId).needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set job {jobYellow}${getJobData(jobId).name}'s{MAINCOLOUR} blip model to ${blipString}`);
	resetAllJobBlips();
}

// ===========================================================================

function setJobPickupCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if(!areThereEnoughParams(params, 4, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(getParam(params, " ", 1)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;
	let pickupParam = getParam(params, " ", 2);

	let pickupId = getJobData(jobId).pickupModel;
	let pickupString = "unchanged";

	if(isNaN(pickupParam)) {
		if(toLowerCase(pickupParam) == "none") {
			pickupId = -1;
		} else {
			let pickupTypes = Object.keys(getGameConfig().pickupModels[getGame()]).join(", ");
			let chunkedList = splitArrayIntoChunks(pickupTypes, 10);

			messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPickupTypes")));
			for(let i in chunkedList) {
				messagePlayerInfo(client, chunkedList[i].join(", "));
			}

			pickupId = getGameConfig().pickupModels[getGame()][pickupParam];
			pickupString = toString(pickupParam);
		}
	} else {
		pickupId = toInteger(pickupParam);
		pickupString = toString(pickupId);
	}

	getJobData(jobId).pickupModel = pickupId;
	getJobData(jobId).needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set job {jobYellow}${getJobData(jobId).name}'s{MAINCOLOUR} pickup to ${pickupString}`);
	resetAllJobPickups();
}

// ===========================================================================

function toggleJobRouteEnabledCommand(command, params, client) {
	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	let clients = getClients();
	for(let i in clients) {
		if(isPlayerWorking(clients[i])) {
			if(isPlayerOnJobRoute(clients[i])) {
				if(getPlayerJob(clients[i]) == jobId && getPlayerJobRoute(clients[i]) == jobRoute) {
					stopJobRoute(clients[i], true, false);
					messagePlayerAlert(clients[i], "The job route you were on has been disabled by an admin");
				}
			}
		}
	}

	getJobData(jobId).routes[jobRoute].enabled = !getJobData(jobId).routes[jobRoute].enabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(getJobRouteData(jobId, jobRoute).enabled)} route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteNameCommand(command, params, client) {
	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	let oldName = getJobData(jobId).routes[jobRoute].name;
	getJobData(jobId).routes[jobRoute].name = params;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set route {ALTCOLOUR}${oldName}{MAINCOLOUR} to {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteAllLocationDelaysCommand(command, params, client) {
	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);
	let delay = getParam(params, " ", 1);

	if(isNaN(delay)) {
		messagePlayerError(client, getLocaleString(client, "TimeNotNumber"))
		return false;
	}

	for(let i in getJobData(jobId).routes[jobRoute].locations) {
		getJobData(jobId).routes[jobRoute].locations[i].stopDelay = delay;
		getJobData(jobId).routes[jobRoute].locations[i].needsSaved = true;
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set route {ALTCOLOUR}${oldName}{MAINCOLOUR} location's stop delays to {ALTCOLOUR}${delay/1000}{MAINCOLOUR} seconds for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteVehicleColoursCommand(command, params, client) {
	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	let colour1 = getParam(params, " ", 1);
	let colour2 = getParam(params, " ", 2);

	getJobRouteData(getPlayerJob(client), getPlayerJobRoute(client)).vehicleColour1 = toInteger(colour1);
	getJobRouteData(getPlayerJob(client), getPlayerJobRoute(client)).vehicleColour2 = toInteger(colour2);
	getJobRouteData(getPlayerJob(client), getPlayerJobRoute(client)).needsSaved = true;

	let clients = getClients();
	for(let i in clients) {
		if(isPlayerWorking(clients[i])) {
			if(isPlayerOnJobRoute(clients[i])) {
				if(getPlayerJob(clients[i]) == jobId && getPlayerJobRoute(clients[i]) == jobRoute) {
					setVehicleColours(getPlayerVehicle(clients[i]), toInteger(colour1), toInteger(colour2), 1, 1);
					messagePlayerAlert(clients[i], getLocaleString(client, "CurrentJobRouteVehicleColoursChanged"));
				}
			}
		}
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the vehicle colours to {ALTCOLOUR}${colour1}, ${colour2}{MAINCOLOUR} for route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteFinishMessageCommand(command, params, client) {
	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	getJobData(jobId).routes[jobRoute].finishMessage = params;
	getJobData(jobId).routes[jobRoute].needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the finish message to {ALTCOLOUR}"${params}"{MAINCOLOUR} for route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteStartMessageCommand(command, params, client) {
	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	getJobData(jobId).routes[jobRoute].startMessage = params;
	getJobData(jobId).routes[jobRoute].needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the start message to {ALTCOLOUR}"${params}"{MAINCOLOUR} for route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteLocationPositionCommand(command, params, client) {
	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);
	let jobRouteLocation = getPlayerJobRouteLocation(client);

	getJobData(jobId).routes[jobRoute].locations[jobRouteLocation].position = position;
	getJobData(jobId).routes[jobRoute].locations[jobRouteLocation].needsSaved = true;
	showCurrentJobLocation(client);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(getJobData(jobId).enabled)} set the position for location ${getJobRouteLocationData(jobId, jobRoute, jobRouteLocation).name} on route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteLocationArriveMessageCommand(command, params, client) {
	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	getJobData(jobId).routes[jobRoute].locationArriveMessage = params;
	getJobData(jobId).routes[jobRoute].needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(getJobData(jobId).enabled)} set the location arrival message to {ALTCOLOUR}"${params}"{MAINCOLOUR} for route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteLocationNextMessageCommand(command, params, client) {
	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	getJobData(jobId).routes[jobRoute].locationNextMessage = params;
	getJobData(jobId).routes[jobRoute].needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(getJobData(jobId).enabled)}{MAINCOLOUR} set the location next message to {ALTCOLOUR}"${params}"{MAINCOLOUR} for route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRoutePayCommand(command, params, client) {
	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	let amount = getParam(params, " ", 1);

	if(isNaN(amount)) {
		getLocaleString(client, "MustBeNumber", "amount");
		return false;
	}

	getJobData(jobId).routes[jobRoute].pay = amount;
	getJobData(jobId).routes[jobRoute].needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the pay for route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job to {ALTCOLOUR}${makeLargeNumberReadable(amount)}{MAINCOLOUR}`);
}

// ===========================================================================

function toggleJobWhiteListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	getJobData(jobId).whiteListEnabled = !getJobData(jobId).whiteListEnabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}${getEnabledDisabledFromBool(getJobData(jobId).whiteListEnabled)} {MAINCOLOUR}the whitelist for the {ALTCOLOUR}${getJobData(jobId).name} {MAINCOLOUR}job`);
}

// ===========================================================================

function toggleJobBlackListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	getJobData(jobId).blackListEnabled = !getJobData(jobId).blackListEnabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(getJobData(jobId).blackListEnabled)} the blacklist for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function addPlayerToJobBlackListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let jobId = getJobFromParams(getParam(params, " ", 2)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if(isPlayerOnJobBlackList(targetClient, jobId)) {
		messagePlayerError(client, `That player is already blacklisted from that job!`);
		return false;
	}

	addPlayerToJobBlackList(targetClient, jobId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} added {ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR} to the blacklist for the {jobYellow}${jobData.name}{MAINCOLOUR} job`);
}

// ===========================================================================

function removePlayerFromJobBlackListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let jobId = getJobFromParams(getParam(params, " ", 2)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if(!isPlayerOnJobBlackList(targetClient, jobId)) {
		messagePlayerError(client, `That player is not blacklisted from that job!`);
		return false;
	}

	removePlayerFromJobBlackList(targetClient, jobId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed {ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR} from the blacklist for the {jobYellow}${jobData.name}{MAINCOLOUR} job`);
}

// ===========================================================================

function addPlayerToJobWhiteListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let jobId = getJobFromParams(getParam(params, " ", 2)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if(isPlayerOnJobWhiteList(targetClient, jobId)) {
		messagePlayerError(client, `That player is already whitelisted from that job!`);
		return false;
	}

	addPlayerToJobWhiteList(targetClient, jobId);
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}added {ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR} to the whitelist for the {jobYellow}${jobData.name}{MAINCOLOUR} job`);
}

// ===========================================================================

function removePlayerFromJobWhiteListCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let jobId = getJobFromParams(getParam(params, " ", 2)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	if(!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if(!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if(!isPlayerOnJobWhiteList(targetClient, jobId)) {
		messagePlayerError(client, `That player is not whitelisted from that job!`);
		return false;
	}

	removePlayerFromJobWhiteList(targetClient, jobId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed {ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR} from the whitelist for the {jobYellow}${jobData.name}{MAINCOLOUR} job`);
}

// ===========================================================================

function forceAllPlayersToStopWorking() {
	getClients().forEach(function(client) {
		if(!client.console) {
			stopWorking(client);
		}
	});
}

// ===========================================================================

function jobStartRouteCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You aren't working yet! Use /startwork first.");
		return false;
	}

	if(getJobData(getPlayerJob(client)).routes.length == 0) {
		messagePlayerError(client, "Your job doesn't have any routes for this location!");
		return false;
	}

	if(!isPlayerInJobVehicle(client)) {
		messagePlayerError(client, "You need to be in a vehicle that belongs to your job!");
		return false;
	}

	if(isPlayerOnJobRoute(client)) {
		messagePlayerError(client, "You're already on a job route! Finish the route or use /stoproute");
		return false;
	}

	let forceRoute = -1;
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageJobs"))) {
		if(!areParamsEmpty(params)) {
			let tempRoute = getJobRouteFromParams(params, getPlayerJob(client));
			if(tempRoute != false) {
				forceRoute = tempRoute;
			}
		}
	}

	startJobRoute(client, forceRoute);
	return true;
}

// ===========================================================================

function jobStopRouteCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You aren't working yet! Use /startwork first.");
		return false;
	}

	//if(!doesPlayerHaveJobType(client, VRR_JOB_BUS) && !doesPlayerHaveJobType(client, VRR_JOB_GARBAGE)) {
	//	messagePlayerError(client, "Your job doesn't use a route!");
	//    return false;
	//}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, "You aren't on a job route!");
		return false;
	}

	if(!getJobRouteData(getPlayerJob(client), getPlayerJobRoute(client)).enabled) {
		setAllJobDataIndexes();
		getJobRouteData(getPlayerJob(client), getPlayerJobRoute(client)).enabled = true;
	}

	stopJobRoute(client, false, false);
	return true;
}

// ===========================================================================

function isPlayerInJobVehicle(client) {
	if(getPlayerVehicle(client)) {
		let vehicle = getPlayerVehicle(client);
		if(isVehicleOwnedByJob(vehicle, getPlayerCurrentSubAccount(client).job)) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function isPlayerWorking(client) {
	if(!getPlayerCurrentSubAccount(client)) {
		return false;
	}
	return getPlayerCurrentSubAccount(client).isWorking;
}

// ===========================================================================

function startJobRoute(client, forceRoute = -1) {
	let jobId = getPlayerJob(client);
	let jobRoute = 0;

	if(forceRoute == -1) {
		jobRoute = getRandomJobRouteForLocation(getClosestJobLocationForJob(getPlayerPosition(client), jobId));
	} else {
		jobRoute = forceRoute;
	}

	if(jobRoute == -1) {
		messagePlayerError(client, `There are no routes for this location.`);
		return false;
	}

	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} is starting job route ${getJobRouteData(jobId, jobRoute).name} (${jobRoute}) for the ${getJobData(jobId).name} (${jobId}) job`);

	getPlayerData(client).jobRoute = jobRoute;
	getPlayerData(client).jobRouteLocation = 0;
	getPlayerData(client).jobRouteVehicle = getPlayerVehicle(client);

	getPlayerVehicle(client).colour1 = getJobRouteData(jobId, jobRoute).vehicleColour1;
	getPlayerVehicle(client).colour2 = getJobRouteData(jobId, jobRoute).vehicleColour2;

	messagePlayerNormal(client, replaceJobRouteStringsInMessage(getJobRouteData(jobId, jobRoute).startMessage, jobId, jobRoute));

	// Don't announce routes that an admin just created
	if(forceRoute == -1) {
		messageDiscordEventChannel(`💼 ${getCharacterFullName(client)} started the ${getJobRouteData(jobId, jobRoute).name} route for the ${getJobData(jobId).name} job`);
	}

	if(getJobRouteData(jobId, jobRoute).locations.length > 0) {
		showCurrentJobLocation(client);
	} else {
		messagePlayerError(client, `There are no locations for this route.`);
	}
}

// ===========================================================================

function stopJobRoute(client, successful = false, alertPlayer = true) {
	let jobId = getPlayerJob(client);
	let routeId = getPlayerJobRoute(client);

	if(alertPlayer) {
		messagePlayerAlert(client, replaceJobRouteStringsInMessage(getJobRouteData(jobId, routeId).finishMessage, jobId, routeId));
	}

	if(successful == true) {
		finishSuccessfulJobRoute(client);
		return false;
	}

	messageDiscordEventChannel(`💼 ${getCharacterFullName(client)} failed to finish the ${getJobRouteData(jobId, getPlayerJobRoute(client)).name} route for the ${getJobData(jobId).name} job and didn't earn anything.`);

	stopReturnToJobVehicleCountdown(client);
	sendPlayerStopJobRoute(client);
	respawnVehicle(getPlayerData(client).jobRouteVehicle);

	getPlayerData(client).jobRouteVehicle = false;
	getPlayerData(client).jobRoute = -1;
	getPlayerData(client).jobRouteLocation = -1;
}

// ===========================================================================

function isPlayerOnJobRoute(client) {
	if(getPlayerData(client).jobRoute != -1) {
		return true;
	}

	return false;
}

// ===========================================================================

function getPlayerJobRouteVehicle(client) {
	if(!isPlayerOnJobRoute(client)) {
		return false;
	}

	return getPlayerData(client).jobRouteVehicle;
}

// ===========================================================================

function startReturnToJobVehicleCountdown(client) {
	getPlayerData(client).returnToJobVehicleTick = getGlobalConfig().returnToJobVehicleTime;
	getPlayerData(client).returnToJobVehicleTimer = setInterval(function() {
		//logToConsole(LOG_DEBUG, getPlayerData(client).returnToJobVehicleTick);
		if(getPlayerData(client).returnToJobVehicleTick > 0) {
			getPlayerData(client).returnToJobVehicleTick = getPlayerData(client).returnToJobVehicleTick - 1;
			//logToConsole(LOG_WARN, `You have ${getPlayerData(client).returnToJobVehicleTick} seconds to return to your job vehicle!`);
			showGameMessage(client, `You have ${getPlayerData(client).returnToJobVehicleTick} seconds to return to your job vehicle!`, getColourByName("softRed"), 1500);
		} else {
			clearInterval(getPlayerData(client).returnToJobVehicleTimer);
			getPlayerData(client).returnToJobVehicleTimer = null;
			getPlayerData(client).returnToJobVehicleTick = 0;
			stopJobRoute(client, false);
		}
	}, 1000);
}

// ===========================================================================

function stopReturnToJobVehicleCountdown(client) {
	if(getPlayerData(client).returnToJobVehicleTimer != null) {
		clearInterval(getPlayerData(client).returnToJobVehicleTimer);
		getPlayerData(client).returnToJobVehicleTimer = null;
	}

	//getPlayerData(client).returnToJobVehicleTick = 0;
}

// ===========================================================================

function canPlayerUseJob(client, jobId) {
	if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageJobs"))) {
		return true;
	}

	if(!getJobData(jobId)) {
		return false;
	}

	if(isJobWhiteListed(jobId)) {
		if(!isPlayerOnJobWhiteList(client, jobId)) {
			return false;
		}
	}

	if(!isJobBlackListed(jobId)) {
		if(isPlayerOnJobBlackList(client, jobId)) {
			return false;
		}
	}

	return true;
}

// ===========================================================================

function deleteJobLocation(jobLocationData) {
	if(jobLocationData.databaseId > 0) {
		quickDatabaseQuery(`DELETE FROM job_loc WHERE job_loc_id = ${jobLocationData.databaseId}`);
	}

	deleteJobLocationBlip(tempJob, tempLocation);
	deleteJobLocationPickup(tempJob, tempLocation);
	getJobData(getJobIdFromDatabaseId(tempJob)).locations.splice(tempLocation, 1);
	setAllJobDataIndexes();
}

// ===========================================================================

function freezePlayerJobVehicleForRouteLocation(client) {
	getVehicleData(getPlayerVehicle(client)).engine = false;
	setVehicleEngine(getPlayerVehicle(client), getVehicleData(getPlayerVehicle(client)).engine);
	//setPlayerControlState(client, false);
}

// ===========================================================================

function unFreezePlayerJobVehicleForRouteLocation(client) {
	getVehicleData(getPlayerVehicle(client)).engine = true;
	setVehicleEngine(getPlayerVehicle(client), getVehicleData(getPlayerVehicle(client)).engine);
	//setPlayerControlState(client, true);
}

// ===========================================================================

function getJobIdFromDatabaseId(databaseId) {
	for(let i in getServerData().jobs) {
		if(getServerData().jobs[i].databaseId == databaseId) {
			return i;
		}
	}
	return false;
}

// ===========================================================================

function setAllJobDataIndexes() {
	for(let i in getServerData().jobs) {
		getServerData().jobs[i].index = i;
		for(let j in getServerData().jobs[i].locations) {
			getServerData().jobs[i].locations[j].index = j;
			getServerData().jobs[i].locations[j].jobIndex = i;

			for(let u in getServerData().jobs[i].routes) {
				if(getServerData().jobs[i].routes[u].locationId == getServerData().jobs[i].locations[j].databaseId) {
					getServerData().jobs[i].locations[j].routeCache.push(u);
				}
			}
		}

		for(let k in getServerData().jobs[i].uniforms) {
			getServerData().jobs[i].uniforms[k].index = k;
			getServerData().jobs[i].uniforms[k].jobIndex = i;
		}

		for(let m in getServerData().jobs[i].equipment) {
			getServerData().jobs[i].equipment[m].index = m;
			getServerData().jobs[i].equipment[m].jobIndex = i;
			for(let n in getServerData().jobs[i].equipment[m].items) {
				getServerData().jobs[i].equipment[m].items[n].index = n;
				getServerData().jobs[i].equipment[m].items[n].jobIndex = i;
				getServerData().jobs[i].equipment[m].items[n].equipmentIndex = m;
			}
		}

		for(let o in getServerData().jobs[i].blackList) {
			getServerData().jobs[i].blackList[o].index = o;
			getServerData().jobs[i].blackList[o].jobIndex = i;
		}

		for(let v in getServerData().jobs[i].whiteList) {
			getServerData().jobs[i].blackList[v].index = v;
			getServerData().jobs[i].blackList[v].jobIndex = i;
		}

		for(let t in getServerData().jobs[i].routes) {
			getServerData().jobs[i].routes[t].index = t;
			getServerData().jobs[i].routes[t].jobIndex = i;
		}
	}
}

// ===========================================================================

function createJobLocation(jobId, position, interior, dimension) {
	let jobLocationData = new JobLocationData(false);
	jobLocationData.position = position;
	jobLocationData.jobId = getJobData(jobId).databaseId;
	jobLocationData.interior = interior;
	jobLocationData.dimension = dimension;
	jobLocationData.enabled = true;
	jobLocationData.jobIndex = jobId;
	jobLocationData.needsSaved = true;

	getServerData().jobs[jobId].locations.push(jobLocationData);
	let newSlot = getServerData().jobs[jobId].locations.length-1;
	getServerData().jobs[jobId].locations[newSlot].index = newSlot;
	createJobLocationPickup(jobId, newSlot);
	saveJobLocationToDatabase(jobLocationData);
}

// ===========================================================================

function saveJobToDatabase(jobData) {
	if(jobData == null) {
		// Invalid job data
		return false;
	}

	if(jobData.needsSaved == false) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job ${jobData.name} doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job ${jobData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobData.name);
		let colour = rgbaArrayFromToColour(jobData.colour);
		let data = [
			["job_name", safeName],
			["job_server", jobData.serverId],
			["job_enabled", boolToInt(jobData.enabled)],
			["job_pickup", jobData.pickupModel],
			["job_blip", jobData.blipModel],
			["job_type", jobData.type],
			["job_colour_r", colour[0]],
			["job_colour_g", colour[1]],
			["job_colour_b", colour[2]],
			["job_walkietalkiefreq", jobData.walkieTalkieFrequency],
			["job_wl", jobData.whiteListEnabled],
			["job_bl", jobData.blackListEnabled],
		];

		let dbQuery = null;
		if(jobData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_main", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_main", data, `job_id=${jobData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job ${jobData.name} to database!`);

	return false;
}

// ===========================================================================

function saveJobRouteToDatabase(jobRouteData) {
	if(!jobRouteData) {
		// Invalid job route data
		return false;
	}

	if(jobRouteData.needsSaved == false) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job route ${jobRouteData.name} (DB ID ${jobRouteData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job route ${jobRouteData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobRouteData.name);
		let safeStartMessage = escapeDatabaseString(dbConnection, jobRouteData.startMessage);
		let safeFinishMessage = escapeDatabaseString(dbConnection, jobRouteData.finishMessage);
		let safeLocationArriveMessage = escapeDatabaseString(dbConnection, jobRouteData.locationArriveMessage);
		let safeLocationNextMessage = escapeDatabaseString(dbConnection, jobRouteData.locationNextMessage);

		let data = [
			["job_route_job", jobRouteData.jobId],
			["job_route_job_loc", jobRouteData.locationId],
			["job_route_enabled", boolToInt(jobRouteData.enabled)],
			["job_route_name", safeName],
			["job_route_veh_colour1", jobRouteData.vehicleColour1],
			["job_route_veh_colour2", jobRouteData.vehicleColour2],
			["job_route_start_msg", safeStartMessage],
			["job_route_finish_msg", safeFinishMessage],
			["job_route_loc_arrive_msg", safeLocationArriveMessage],
			["job_route_loc_next_msg", safeLocationNextMessage],
			["job_route_pay", jobRouteData.pay],
			["job_route_detail", jobRouteData.detail],
		];

		let dbQuery = null;
		if(jobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_route", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobRouteData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_route", data, `job_route_id=${jobRouteData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobRouteData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job route ${jobRouteData.name} to database!`);

	return false;
}

// ===========================================================================

function saveJobRouteLocationToDatabase(jobRouteLocationData) {
	if(!jobRouteLocationData) {
		// Invalid job route position data
		return false;
	}

	if(jobRouteLocationData.needsSaved == false) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job route location ${jobRouteLocationData.name} (DB ID ${jobRouteLocationData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job route location ${jobRouteLocationData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobRouteLocationData.name);
		let data = [
			["job_route_loc_route", jobRouteLocationData.routeId],
			["job_route_loc_enabled", boolToInt(jobRouteLocationData.enabled)],
			["job_route_loc_name", safeName],
			["job_route_loc_x", jobRouteLocationData.position.x],
			["job_route_loc_y", jobRouteLocationData.position.y],
			["job_route_loc_z", jobRouteLocationData.position.z],
			["job_route_loc_pay", jobRouteLocationData.pay],
			["job_route_loc_delay", jobRouteLocationData.stopDelay],

		];

		let dbQuery = null;
		if(jobRouteLocationData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_route_loc", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobRouteLocationData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_route_loc", data, `job_route_loc_id=${jobRouteLocationData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobRouteLocationData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job route location ${jobRoutePositionData.name} (${jobRouteLocationData.databaseId}) to database!`);

	return false;
}

// ===========================================================================

function saveJobLocationToDatabase(jobLocationData) {
	if(jobLocationData == null) {
		// Invalid job location data
		return false;
	}

	if(!jobLocationData.needsSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job location ${jobLocationData.name} (${jobLocationData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job location ${jobLocationData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let data = [
			["job_loc_job", jobLocationData.jobId],
			["job_loc_enabled", boolToInt(jobLocationData.enabled)],
			["job_loc_pos_x", jobLocationData.position.x],
			["job_loc_pos_y", jobLocationData.position.y],
			["job_loc_pos_z", jobLocationData.position.z],
			["job_loc_int", jobLocationData.interior],
			["job_loc_vw", jobLocationData.dimension],
		];

		let dbQuery = null;
		if(jobLocationData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_loc", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobLocationData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_loc", data, `job_loc_id=${jobLocationData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobLocationData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job location ${jobLocationData.databaseId} to database`);

	return false;
}

// ===========================================================================

function saveJobEquipmentToDatabase(jobEquipmentData) {
	if(jobEquipmentData == null) {
		// Invalid job equipment data
		return false;
	}

	if(!jobEquipmentData.needsSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job equipment ${jobEquipmentData.name} (${jobEquipmentData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job equipment ${jobEquipmentData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobEquipmentData.name);
		let data = [
			["job_equip_job", jobEquipmentData.job],
			["job_equip_enabled", boolToInt(jobEquipmentData.enabled)],
			["job_equip_minrank", jobLocationData.requiredRank],
			["job_equip_name", safeName],
		];

		let dbQuery = null;
		if(tempJobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_equip", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobEquipmentData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_equip", data, `job_equip_id=${jobEquipmentData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobEquipmentData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job equipment ${jobEquipmentData.databaseId} to database`);

	return false;
}

// ===========================================================================

function saveJobEquipmentItemToDatabase(jobEquipmentItemData) {
	if(jobEquipmentItemData == null) {
		// Invalid job equipment weapon data
		return false;
	}

	if(!jobEquipmentItemData.needsSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job equipment item ${jobEquipmentItemData.databaseId} doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job equipment weapon ${jobEquipmentItemData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let data = [
			["job_equip_item_equip", jobEquipmentItemData.equipmentId],
			["job_equip_item_enabled", boolToInt(jobEquipmentItemData.enabled)],
			["job_equip_item_type", jobEquipmentItemData.itemType],
			["job_equip_item_value", jobEquipmentItemData.value],
		];

		let dbQuery = null;
		if(tempJobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_equip_item", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobEquipmentItemData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_equip_item", data, `job_equip_id=${jobEquipmentItemData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobEquipmentItemData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job equipment weapon ${jobEquipmentItemData.databaseId} to database`);

	return false;
}

// ===========================================================================

function saveJobUniformToDatabase(jobUniformData) {
	if(jobUniformData == null) {
		// Invalid job uniform data
		return false;
	}

	if(!jobUniformData.needSaved) {
		logToConsole(LOG_DEBUG, `[VRR.Job]: Job uniform ${jobUniformData.databaseId} doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[VRR.Job]: Saving job uniform ${jobUniformData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if(dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobUniformData.name);
		let data = [
			["job_uniform_job", jobUniformData.jobId],
			["job_uniform_enabled", boolToInt(jobUniformData.enabled)],
			["job_uniform_minrank", jobUniformData.requiredRank],
			["job_uniform_name", safeName],
		];

		let dbQuery = null;
		if(tempJobRouteData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_uniform", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobUniformData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_uniform", data, `job_uniform_id=${jobUniformData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobUniformData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[VRR.Job]: Saved job uniform ${jobUniformData.databaseId} to database`);

	return false;
}

// ===========================================================================

function saveAllJobsToDatabase() {
	for(let i in getServerData().jobs) {
		saveJobToDatabase(getServerData().jobs[i]);

		for(let j in getServerData().jobs[i].locations) {
			saveJobLocationToDatabase(getServerData().jobs[i].locations[j]);
		}

		for(let k in getServerData().jobs[i].uniforms) {
			saveJobUniformToDatabase(getServerData().jobs[i].uniforms[k]);
		}

		for(let m in getServerData().jobs[i].equipment) {
			saveJobEquipmentToDatabase(getServerData().jobs[i].equipment[m]);

			for(let n in getServerData().jobs[i].equipment[m].items) {
				saveJobEquipmentItemToDatabase(getServerData().jobs[i].equipment[m].items[n]);
			}
		}

		for(let p in getServerData().jobs[i].routes) {
			saveJobRouteToDatabase(getServerData().jobs[i].routes[p]);

			for(let q in getServerData().jobs[i].routes[p].locations) {
				saveJobRouteLocationToDatabase(getServerData().jobs[i].routes[p].locations[q]);
			}
		}
	}
}

// ===========================================================================

function deleteJobLocationBlip(jobId, locationId) {
	if(getJobData(jobId).locations[locationId].blip != null) {
		deleteGameElement(getJobData(jobId).locations[locationId].blip);
		getJobData(jobId).locations[locationId].blip = null;
	}
}

// ===========================================================================

function deleteJobLocationPickup(jobId, locationId) {
	if(getServerData().jobs[jobId].locations[locationId].pickup != null) {
		deleteGameElement(getJobData(jobId).locations[locationId].pickup);
		getServerData().jobs[jobId].locations[locationId].pickup = null;
	}
}

// ===========================================================================

function createJobLocationPickup(jobId, locationId) {
	if(!getServerConfig().createJobPickups) {
		return false;
	}

	let tempJobData = getJobData(jobId);

	if(tempJobData.pickupModel != -1) {
		let pickupModelId = getGameConfig().pickupModels[getGame()].Job;

		if(tempJobData.pickupModel != 0) {
			pickupModelId = tempJobData.pickupModel;
		}

		logToConsole(LOG_VERBOSE, `[VRR.Job]: Creating pickup for location ${locationId} of the ${tempJobData.name} job`);

		if(areServerElementsSupported()) {
			let pickup = createGamePickup(pickupModelId, tempJobData.locations[locationId].position, getGameConfig().pickupTypes[getGame()].job);
			if(pickup != false) {
				tempJobData.locations[locationId].pickup = pickup;
				setElementDimension(pickup, tempJobData.locations[locationId].dimension);
				setElementOnAllDimensions(pickup, false);
				setEntityData(pickup, "vrr.owner.type", VRR_PICKUP_JOB, false);
				setEntityData(pickup, "vrr.owner.id", locationId, false);
				setEntityData(pickup, "vrr.label.type", VRR_LABEL_JOB, true);
				setEntityData(pickup, "vrr.label.name", tempJobData.name, true);
				setEntityData(pickup, "vrr.label.jobType", tempJobData.databaseId, true);
				addToWorld(pickup);
			}
		} else {
			// sendJobToPlayer(null, jobId, tempJobData.name, tempJobData.locations[locationId].position, pickupModel);
		}
	}
}

// ===========================================================================

function createJobLocationBlip(jobId, locationId) {
	if(!getServerConfig().createJobBlips) {
		return false;
	}

	let tempJobData = getJobData(jobId);

	if(getJobData(jobId).blipModel == -1) {
		return false;
	}

	let blipModelId = getGameConfig().blipSprites[getGame()].Job;

	if(getJobData(jobId).blipModel != 0) {
		blipModelId = getJobData(jobId).blipModel;
	}

	if(areServerElementsSupported()) {
		let blip = createGameBlip(tempJobData.locations[locationId].position, blipModelId, 1, getColourByName("yellow"));
		if(blip != false) {
			tempJobData.locations[locationId].blip = blip;

			if(getGlobalConfig().jobBlipStreamInDistance == -1 || getGlobalConfig().jobBlipStreamOutDistance == -1)	{
				blip.netFlags.distanceStreaming = false;
			} else {
				setElementStreamInDistance(getServerData().jobs[i].locations[j].blip, getGlobalConfig().jobBlipStreamInDistance);
				setElementStreamOutDistance(getServerData().jobs[i].locations[j].blip, getGlobalConfig().jobBlipStreamOutDistance);
			}

			setElementOnAllDimensions(blip, false);
			setElementDimension(blip, tempJobData.locations[locationId].dimension);

			let clients  = getClients();
			for(let i in clients) {
				if(getPlayerJob(client) == false) {
					showElementForPlayer(blip, clients[i]);
				} else {
					if(getPlayerJob(clients[i]) == getServerData().jobs[i].databaseId) {
						showElementForPlayer(blip, clients[i]);
					} else {
						hideElementForPlayer(blip, clients[i]);
					}
				}
			}
		}
	} else {
		sendJobToPlayer(null, jobId, tempJobData.name, tempJobData.locations[locationId].position, blipModelId);
	}
}

// ===========================================================================

function getPlayerJob(client) {
	let jobDatabaseId = getPlayerCurrentSubAccount(client).job;
	for(let i in getServerData().jobs) {
		if(jobDatabaseId == getServerData().jobs[i].databaseId) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function canPlayerUseJobs(client) {
	if(hasBitFlag(getPlayerData(client).accountData.flags.moderation, getServerBitFlags().moderationFlags.JobBanned)) {
		return false;
	}

	return true;
}

// ===========================================================================

function getJobIndexFromDatabaseId(databaseId) {
	for(let i in getServerData().jobs) {
		if(getServerData().jobs[i].databaseId == databaseId) {
			return i;
		}
	}
	return false;
}

// ===========================================================================

function isJobWhiteListed(jobId) {
	return getJobData(jobId).whiteListEnabled;
}

// ===========================================================================

function isPlayerOnJobWhiteList(client, jobId) {
	for(let i in getJobData(jobId).whiteList) {
		if(getJobData(jobId).whiteList[i].subAccount == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function isJobBlackListed(jobId) {
	return getJobData(jobId).blackListEnabled;
}

// ===========================================================================

function isPlayerOnJobBlackList(client, jobId) {
	for(let i in getJobData(jobId).blackList) {
		if(getJobData(jobId).blackList[i].subAccount == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function playerArrivedAtJobRouteLocation(client) {
	let jobId = getPlayerJob(client);

	if(!isPlayerOnJobRoute(client)) {
		return false;
	}

	if(isLastLocationOnJobRoute(jobId, getPlayerJobRoute(client), getPlayerJobRouteLocation(client))) {
		finishSuccessfulJobRoute(client);
		return false;
	}

	showGameMessage(client, replaceJobRouteStringsInMessage(removeColoursInMessage(getJobRouteData(jobId, getPlayerJobRoute(client)).locationArriveMessage), jobId, getPlayerJobRoute(client)), getJobData(jobId).colour, 3500);
	if(getJobRouteLocationData(jobId, getPlayerJobRoute(client),getPlayerJobRouteLocation(client)).stopDelay > 0) {
		freezePlayerJobVehicleForRouteLocation(client);
		getPlayerData(client).jobRouteLocation = getNextLocationOnJobRoute(jobId, getPlayerJobRoute(client), getPlayerJobRouteLocation(client));
		setTimeout(function() {
			showCurrentJobLocation(client);
			showGameMessage(client, replaceJobRouteStringsInMessage(removeColoursInMessage(getJobRouteData(jobId, getPlayerJobRoute(client)).locationNextMessage), jobId, getPlayerJobRoute(client)), getJobData(jobId).colour, 3500);
			unFreezePlayerJobVehicleForRouteLocation(client);
		}, getJobRouteLocationData(jobId, getPlayerJobRoute(client),getPlayerJobRouteLocation(client)).stopDelay);
	} else {
		getPlayerData(client).jobRouteLocation = getNextLocationOnJobRoute(jobId, getPlayerJobRoute(client), getPlayerJobRouteLocation(client));
		showCurrentJobLocation(client);
		showGameMessage(client, replaceJobRouteStringsInMessage(removeColoursInMessage(getJobRouteData(jobId, getPlayerJobRoute(client)).locationNextMessage), jobId, getPlayerJobRoute(client)), getJobData(jobId).colour, 3500);
	}
}

// ===========================================================================

function deleteJobItems(client) {
	for(let i in getPlayerData(client).jobEquipmentCache) {
		deleteItem(getPlayerData(client).jobEquipmentCache[i]);
	}

	cachePlayerHotBarItems(client);
	updatePlayerHotBar(client);
}

// ===========================================================================

function getJobRankName(jobId, rankId) {
	return jobRankNames[jobId][rankId];
}

// ===========================================================================

function respawnPlayerLastJobVehicle(client) {
	if(getPlayerCurrentSubAccount(client).lastJobVehicle == null) {
		return false;
	}
	respawnVehicle(getPlayerCurrentSubAccount(client).lastJobVehicle);
}

// ===========================================================================

function resetAllJobBlips() {
	deleteAllJobBlips();
	createAllJobBlips();
}

// ===========================================================================

function resetAllJobPickups() {
	deleteAllJobPickups();
	createAllJobPickups();
}

// ===========================================================================

function deleteAllJobBlips() {
	for(let i in getServerData().jobs) {
		deleteJobBlips(i);
	}
}

// ===========================================================================

function deleteAllJobPickups() {
	for(let i in getServerData().jobs) {
		deleteJobPickups(i);
	}
}

// ===========================================================================

function deleteJobBlips(jobId) {
	for(let j in getServerData().jobs[jobId].locations) {
		deleteJobLocationBlip(jobId, j);
	}
}

// ===========================================================================

function deleteJobPickups(jobId) {
	for(let j in getServerData().jobs[jobId].locations) {
		deleteJobLocationPickup(jobId, j);
	}
}

// ===========================================================================

function createJobRouteCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));

	if(!getJobData(jobId)) {
		messagePlayerError(client, `You need to take the job that you want to make a route for.`);
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "AlreadyOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	let routeId = createJobRoute(params, closestJobLocation);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created route {ALTCOLOUR}${params}{MAINCOLOUR} for job {jobYellow}${getJobData(jobId).name}`);
	startJobRoute(client, routeId);
	return true;
}

// ===========================================================================

function createJobRouteLocationCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);

	if(!getJobData(jobId)) {
		messagePlayerError(client, `You need to take the job that you want to make a route location for.`);
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if(!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	let routeId = getPlayerData(client).jobRoute;
	let jobRouteData = getServerData().jobs[jobId].routes[routeId];
	let routeLocationName = params;

	createJobRouteLocation(routeLocationName, getPlayerPosition(client), jobRouteData);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created location {ALTCOLOUR}${routeLocationName}{MAINCOLOUR} for route {ALTCOLOUR}${jobRouteData.name}{MAINCOLOUR} for job {jobYellow}${getJobData(jobId).name}`);
	return true;
}

// ===========================================================================

function createJobUniformCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(getParam(params, " ", 1));
	let skinIndex = getSkinModelIndexFromParams(splitParams.slice(1).join(" "), getGame());

	if(!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if(!skinIndex) {
		messagePlayerError(client, getLocaleString(client, "InvalidSkin"));
		return false;
	}

	createJobUniform(jobId, skinIndex);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created uniform with skin {ALTCOLOUR}${getGameConfig().skins[skinIndex][1]} (}${getGameConfig().skins[skinIndex][0]}){MAINCOLOUR} for job {jobYellow}${getJobData(jobId).name}`);
	return true;
}

// ===========================================================================

function createJobRoute(routeName, closestJobLocation) {
	let tempJobRouteData = new JobRouteData(false);
	tempJobRouteData.name = routeName;
	tempJobRouteData.jobId = closestJobLocation.jobId;
	tempJobRouteData.locationId = closestJobLocation.databaseId;
	tempJobRouteData.enabled = false;
	tempJobRouteData.needsSaved = true;
	tempJobRouteData.vehicleColour1 = 1;
	tempJobRouteData.vehicleColour2 = 1;
	tempJobRouteData.pay = 500;
	tempJobRouteData.jobIndex = closestJobLocation.jobIndex;
	tempJobRouteData.startMessage = `You are now on route {ALTCOLOUR}{JOBROUTENAME}{MAINCOLOUR} for the {jobYellow}{JOBNAME}{MAINCOLOUR} job!`;
	tempJobRouteData.finishMessage = `You have finished the {ALTCOLOUR}{JOBROUTENAME}{MAINCOLOUR} route and {ALTCOLOUR}{JOBROUTEPAY}{MAINCOLOUR} has been added to your next paycheck!`;
	tempJobRouteData.locationArriveMessage = `You arrived at a stop.`;
	tempJobRouteData.locationNextMessage = `Drive to the next stop.`;

	let routeId = getJobData(closestJobLocation.jobIndex).routes.push(tempJobRouteData);
	saveJobRouteToDatabase(tempJobRouteData);
	setAllJobDataIndexes();
	return routeId-1;
}

// ===========================================================================

function createJobRouteLocation(routeLocationName, position, jobRouteData) {
	let tempJobRouteLocationData = new JobRouteLocationData(false);
	tempJobRouteLocationData.name = routeLocationName;
	tempJobRouteLocationData.routeId = jobRouteData.databaseId;
	tempJobRouteLocationData.enabled = true;
	tempJobRouteLocationData.needsSaved = true;
	tempJobRouteLocationData.position = position;
	tempJobRouteLocationData.routeIndex = jobRouteData.index;

	getJobData(jobRouteData.jobIndex).routes[jobRouteData.index].locations.push(tempJobRouteLocationData);
	//saveJobRouteLocationToDatabase(tempJobRouteLocationData);
	//setAllJobDataIndexes();
}

// ===========================================================================

function createJobUniform(jobId, skinIndex) {
	let tempJobUniformData = new JobUniformData(false);
	tempJobUniformData.skin = skinIndex;
	tempJobUniformData.jobIndex = jobId;
	tempJobUniformData.job = getJobData(jobId);
	tempJobUniformData.needsSaved = true;

	getJobData(jobId).uniforms.push(tempJobUniformData);
	setAllJobDataIndexes();
}

// ===========================================================================

function deleteJobRouteLocationCommand(command, params, client) {
	let closestJobRouteLocation = getClosestJobRouteLocation(getPlayerPosition(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted route location {ALTCOLOUR}${closestJobRouteLocation.index} (DB ID ${closestJobRouteLocation.databaseId}){MAINCOLOUR} for the {ALTCOLOUR}${closestJobRouteLocation.name}{jobYellow} route of the {jobYellow}${getJobData(closestJobLocation.jobIndex).name}{MAINCOLOUR} job`);

	if(closestJobRouteLocation.databaseId > 0) {
		quickDatabaseQuery(`DELETE FROM job_route_loc WHERE job_route_loc_id = ${closestJobRouteLocation.databaseId}`);
	}

	let tempIndex = closestJobRouteLocation.index;
	let tempJobRoute = closestJobRouteLocation.routeIndex;

	getJobData(getJobIdFromDatabaseId(tempJob)).routes[tempJobRoute].locations.splice(tempIndex, 1);
	setAllJobDataIndexes();
	collectAllGarbage();
}

// ===========================================================================

function deleteJobRouteCommand(command, params, client) {
	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerData(client).jobRoute;

	if(!areParamsEmpty(client)) {
		jobRoute = getJobRouteFromParams(params, jobId);
	}

	let jobRouteData = getServerData().jobs[jobId].routes[jobRoute];

	let clients = getClients();
	for(let i in clients) {
		if(isPlayerWorking(clients[i])) {
			if(isPlayerOnJobRoute(clients[i])) {
				if(getPlayerJob(clients[i]) == jobId && getPlayerData(clients[i]).jobRoute == jobRoute) {
					stopJobRoute(clients[i], true, false);
					messagePlayerAlert(clients[i], getLocaleString(client, "CurrentJobRouteDeleted"));
				}
			}
		}
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted route {ALTCOLOUR}${jobRouteData.name} (DB ID ${jobRouteData.databaseId}){MAINCOLOUR} for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);

	if(jobRouteData.databaseId > 0) {
		quickDatabaseQuery(`DELETE FROM job_route WHERE job_route_id = ${jobRouteData.databaseId}`);
		quickDatabaseQuery(`DELETE FROM job_route_loc WHERE job_route_loc_route = ${jobRouteData.databaseId}`);
	}

	clearArray(getServerData().jobs[jobId].routes[jobRoute].locations);
	getServerData().jobs[jobId].routes.splice(jobRoute, 1);

	setAllJobDataIndexes();
	collectAllGarbage();
}

// ===========================================================================

function deleteJobUniformCommand(command, params, client) {
	let jobId = getJobFromParams(getParam(params, " ", 1));
	let uniformIndex = getParam(params, " ", 1);

	if(!getJobData(jobId)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if(isNaN(uniformIndex)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber", "uniform ID"));
		return false;
	}

	if(typeof getJobData(jobId).uniforms[uniformIndex] == "undefined") {
		messagePlayerError(client, getLocaleString(client, "InvalidJobUniform"));
		return false;
	}

	quickDatabaseQuery(`DELETE FROM job_uniform WHERE job_uniform_id = ${getJobData(jobId).uniforms[uniformIndex].databaseId}`);
	getJobData(jobId).uniforms.splice(uniformIndex, 1);

	setAllJobDataIndexes();
	collectAllGarbage();
}

// ===========================================================================

function getJobFromParams(params) {
	if(isNaN(params)) {
		for(let i in getServerData().jobs) {
			if(toLowerCase(getServerData().jobs[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getServerData().jobs[params] != "undefined") {
			return params;
		}
	}

	return false;
}

// ===========================================================================

/**
 * @param {Vector3} position - The position to get the closest job location for
 * @param {Number} dimension - The dimension to get the closest job location for
 * @return {JobLocationData} The job location's data (class instance)
 */
function getClosestJobLocation(position, dimension = 0) {
	let closestJobLocation = false;
	let jobs = getServerData().jobs;
	for(let i in jobs) {
		let locations = jobs[i].locations;
		for(let j in locations) {
			if(locations[j].dimension != dimension) {
				let businessId = getClosestBusinessExit(locations[j].position, locations[j].dimension);
				if(getBusinessData(businessId) != false) {
					if(!closestJobLocation || getBusinessData(businessId).entrancePosition.distance(position) < closestJobLocation.position.distance(position)) {
						closestJobLocation = locations[j];
					}
				}
			}

			if(!closestJobLocation || locations[j].position.distance(position) < closestJobLocation.position.distance(position)) {
				closestJobLocation = locations[j];
			}
		}
	}
	return closestJobLocation;
}

// ===========================================================================

/**
 * @param {Vector3} position - The position to get the closest job route location for
 * @return {JobRouteLocationData} The job route location's data (class instance)
 */
function getClosestJobRouteLocation(position) {
	let closestJobRouteLocation = false;
	for(let i in getServerData().jobs) {
		for(let j in getServerData().jobs[i].routes) {
			for(let k in getServerData().jobs[i].routes[j].locations) {
				if(!closestJobRouteLocation || getServerData().jobs[i].routes[j].locations[k].position.distance(position) < closestJobRouteLocation.position.distance(position)) {
					closestJobRouteLocation = getServerData().jobs[i].routes[j].locations[k];
				}
			}
		}
	}
	return closestJobRouteLocation;
}

// ===========================================================================

function getJobPointsInRange(position, distance) {
	return getServerData().jobs[getGame()].filter(x => x.position.distance(position) <= distance);
}

// ===========================================================================

function respawnJobVehicle(client) {
	respawnVehicle(getPlayerJobVehicle(client));
}

// ===========================================================================

function getPlayerJobVehicle(client) {
	return getPlayerData(client).lastJobVehicle;
}

// ===========================================================================

function getRandomJobRouteForLocation(closestJobLocation) {
	if(closestJobLocation.routeCache.length > 0) {
		let randomRoute = getRandom(0, closestJobLocation.routeCache.length-1);
		let routeId = closestJobLocation.routeCache[randomRoute];
		if(!getJobRouteData(closestJobLocation.jobIndex, routeId).enabled) {
			return getRandomJobRouteForLocation(closestJobLocation);
		}
		return getJobRouteData(closestJobLocation.jobIndex, routeId).index;
	}
	return -1;
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @param {number} routeIndex - The data index of the job route
 * @return {JobRouteData} The jobroutes's data (class instance)
 */
function getJobRouteData(jobId, routeId) {
	return getServerData().jobs[jobId].routes[routeId];
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @param {number} routeIndex - The data index of the job route
 * @return {JobRouteLocationData} The jobroutes's data (class instance)
 */
 function getJobRouteLocationData(jobId, routeId, routeLocationId) {
	return getServerData().jobs[jobId].routes[routeId].locations[routeLocationId];
}

// ===========================================================================

function getClosestJobLocationForJob(position, jobId) {
	let closestJobLocation = false;
	for(let i in getServerData().jobs[jobId].locations) {
		if(!closestJobLocation || getServerData().jobs[jobId].locations[i].position.distance(position) < closestJobLocation.position.distance(position)) {
			closestJobLocation = getServerData().jobs[jobId].locations[i];
		}
	}
	return closestJobLocation;
}

// ===========================================================================

function getPlayerJobRoute(client) {
	return getPlayerData(client).jobRoute;
}

// ===========================================================================

function getPlayerJobRouteLocation(client) {
	return getPlayerData(client).jobRouteLocation;
}

// ===========================================================================

function showCurrentJobLocation(client) {
	let jobId = getPlayerJob(client);
	sendJobRouteLocationToPlayer(client, getJobRouteLocationData(jobId, getPlayerJobRoute(client), getPlayerJobRouteLocation(client)).position, getJobData(jobId).colour);
}

// ===========================================================================

function finishSuccessfulJobRoute(client) {
	let jobId = getPlayerJob(client);
	let jobRouteData = getJobRouteData(jobId, getPlayerJobRoute(client));
	let payout = toInteger(applyServerInflationMultiplier(jobRouteData.pay));
	getPlayerData(client).payDayAmount = getPlayerData(client).payDayAmount + payout;

	messageDiscordEventChannel(`💼 ${getCharacterFullName(client)} finished the ${getJobRouteData(jobId, getPlayerJobRoute(client)).name} route for the ${getJobData(jobId).name} job and earned $${getJobRouteData(jobId, jobRouteId).pay}!`);
	messagePlayerSuccess(client, replaceJobRouteStringsInMessage(jobRouteData.finishMessage, jobId, jobRouteData.index));

	stopReturnToJobVehicleCountdown(client);
	sendPlayerStopJobRoute(client);
	respawnVehicle(getPlayerData(client).jobRouteVehicle);

	getPlayerData(client).jobRouteVehicle = false;
	getPlayerData(client).jobRoute = -1;
	getPlayerData(client).jobRouteLocation = -1;
}

// ===========================================================================

function getNextLocationOnJobRoute(jobId, routeId, currentLocationId) {
	if(!isLastLocationOnJobRoute(jobId, routeId, currentLocationId)) {
		return currentLocationId+1;
	} else {
		return getJobRouteData(jobId, routeId).locations.length-1;
	}
}

// ===========================================================================

function isLastLocationOnJobRoute(jobId, routeId, currentLocationId) {
	if(currentLocationId == getJobRouteData(jobId, routeId).locations.length-1) {
		return true;
	}
	return false;
}

// ===========================================================================

function getJobRouteFromParams(params, jobId) {
	if(isNaN(params)) {
		for(let i in getServerData().jobs[jobId].routes) {
			if(toLowerCase(getServerData().jobs[jobId].routes[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getServerData().jobs[jobId].routes[params] != "undefined") {
			return toInteger(params);
		}
	}

	return false;
}

// ===========================================================================

function replaceJobRouteStringsInMessage(messageText, jobId, jobRouteId) {
	let tempJobRouteData = getJobRouteData(jobId, jobRouteId);

	let tempFind = `{JOBROUTENAME}`;
	let tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, tempJobRouteData.name);

	tempFind = `{JOBROUTEPAY}`;
	tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, `$${tempJobRouteData.pay}`);

	tempFind = `{JOBNAME}`;
	tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, getJobData(tempJobRouteData.jobIndex).name);

	return messageText;
}

// ===========================================================================

function updateJobBlipsForPlayer(client) {
	for(let i in getServerData().jobs) {
		for(let j in getServerData().jobs[i].locations) {
			if(getPlayerJob(client) == 0 || getPlayerJob(client) == i) {
				showElementForPlayer(getServerData().jobs[i].locations[j].blip, client);
			} else {
				hideElementForPlayer(getServerData().jobs[i].locations[j].blip, client);
			}
		}
	}
}

// ===========================================================================