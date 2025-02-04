// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: job.js
// DESC: Provides job functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Job Types
const V_JOB_NONE = 0;
const V_JOB_POLICE = 1;
const V_JOB_MEDICAL = 2;
const V_JOB_FIRE = 3;
const V_JOB_BUS = 4;
const V_JOB_TAXI = 5;
const V_JOB_GARBAGE = 6;
const V_JOB_WEAPON = 7;
const V_JOB_DRUG = 8;
const V_JOB_PIZZA = 9;
const V_JOB_GENERIC = 10;

// ===========================================================================

// Job Route States
const V_JOB_ROUTE_STATE_NONE = 0;                // None
const V_JOB_ROUTE_STATE_INPROGRESS = 1;          // Route is in progress. Player is in between stops but not at the last one.
const V_JOB_ROUTE_STATE_LASTSTOP = 2;            // Player is heading to the last stop on the route
const V_JOB_ROUTE_STATE_PAUSED = 3;              // Route is paused for some reason. For police, this could be player accepted callout and once finished, patrol route will resume
const V_JOB_ROUTE_STATE_ATSTOP = 4;              // For bus/trash stops that freeze player, this is the state when they're at one

// ===========================================================================

/**
 * @class Representing a job's data. Loaded and saved in the database
 */
class JobData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.serverId = 0;
		this.type = V_JOB_NONE;
		this.name = "Unnamed";
		this.enabled = true;
		this.blipModel = -1
		this.pickupModel = -1
		this.colour = toColour(0, 0, 0, 255);
		this.whiteListEnabled = false;
		this.blackListEnabled = false;
		this.radioFrequency = 0;
		this.index = -1;
		this.needsSaved = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		/** @type {Array.<JobEquipmentData>} */
		this.equipment = [];

		/** @type {Array.<JobUniformData>} */
		this.uniforms = [];

		/** @type {Array.<JobLocationData>} */
		this.locations = [];

		/** @type {Array.<JobWhiteListData>} */
		this.whiteList = [];

		/** @type {Array.<JobBlackListData>} */
		this.blackList = [];

		/** @type {Array.<JobRouteData>} */
		this.routes = [];

		/** @type {Array.<JobRankData>} */
		this.ranks = [];

		if (dbAssoc) {
			this.databaseId = dbAssoc["job_id"];
			this.serverId = dbAssoc["job_server"];
			this.type = dbAssoc["job_type"];
			this.name = dbAssoc["job_name"];
			this.enabled = dbAssoc["job_enabled"];
			this.blipModel = dbAssoc["job_blip"];
			this.pickupModel = dbAssoc["job_pickup"];
			this.colour = toColour(dbAssoc["job_colour_r"], dbAssoc["job_colour_g"], dbAssoc["job_colour_b"], 255);
			this.whiteListEnabled = dbAssoc["job_wl"];
			this.blackListEnabled = dbAssoc["job_bl"];
			this.radioFrequency = dbAssoc["job_radio_freq"];
			this.whoAdded = dbAssoc["job_who_added"];
			this.whenAdded = dbAssoc["job_when_added"];

			this.equipment = [];
			this.uniforms = [];
			this.locations = [];
			this.whiteList = [];
			this.blackList = [];
			this.routes = [];
			this.ranks = [];
		}
	}
};

// ===========================================================================

/**
 * @class Representing a job route's data. Loaded and saved in the database
 * @property {Array.<JobRouteLocationData>} locations
 */
class JobRouteData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.jobId = 0;
		this.locationId = 0;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.locationIndex = -1;
		this.needsSaved = false;
		this.pay = 0;
		this.vehicleColour1 = 1;
		this.vehicleColour2 = 1;
		this.detail = 0;
		this.startMessage = "";
		this.finishMessage = "";
		//this.failedMessage = "";
		this.locationArriveMessage = "";
		this.locationGotoMessage = "";
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.sphere = null;

		/** @type {Array.<JobRouteLocationData>} */
		this.locations = [];

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["job_route_id"]);
			this.name = toString(dbAssoc["job_route_name"]);
			this.jobId = toInteger(dbAssoc["job_route_job"]);
			this.locationId = toInteger(dbAssoc["job_route_job_loc"]);
			this.enabled = intToBool(toInteger(dbAssoc["job_route_enabled"]));
			this.pay = toInteger(dbAssoc["job_route_pay"]);
			this.startMessage = toString(dbAssoc["job_route_start_msg"]);
			this.finishMessage = toString(dbAssoc["job_route_finish_msg"]);
			//this.finishMessage = toString(dbAssoc["job_route_failed_msg"]);
			this.locationArriveMessage = toString(dbAssoc["job_route_loc_arrive_msg"]);
			this.locationGotoMessage = toString(dbAssoc["job_route_loc_goto_msg"]);
			this.vehicleColour1 = toInteger(dbAssoc["job_route_veh_colour1"]);
			this.vehicleColour2 = toInteger(dbAssoc["job_route_veh_colour2"]);
			this.detail = toInteger(dbAssoc["job_route_detail"]);
			this.whoAdded = dbAssoc["job_route_who_added"];
			this.whenAdded = dbAssoc["job_route_when_added"];
			this.sphere = null;
		}
	}
};

// ===========================================================================

/**
 * @class Representing a job route locations's data. Loaded and saved in the database
 */
class JobRouteLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.name = "";
		this.routeId = 0;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.routeIndex = -1;
		this.needsSaved = false;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.stopDelay = 0;
		this.pay = 0;
		this.type = V_JOB_ROUTE_LOC_TYPE_NONE;
		this.gotoMessage = "";
		this.arriveMessage = "";
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.dimension = 0;
		this.interior = 0;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["job_route_loc_id"]);
			this.name = toString(dbAssoc["job_route_loc_name"]);
			this.routeId = toInteger(dbAssoc["job_route_loc_route"]);
			this.enabled = intToBool(toInteger(dbAssoc["job_route_loc_enabled"]));
			this.position = toVector3(toFloat(dbAssoc["job_route_loc_x"]), toFloat(dbAssoc["job_route_loc_y"]), toFloat(dbAssoc["job_route_loc_z"]));
			this.stopDelay = toInteger(dbAssoc["job_route_loc_delay"]);
			this.pay = toInteger(dbAssoc["job_route_loc_pay"]);
			this.arriveMessage = toString(dbAssoc["job_route_loc_arrive_msg"]);
			this.gotoMessage = toString(dbAssoc["job_route_loc_goto_msg"]);
			this.whoAdded = toInteger(dbAssoc["job_route_loc_who_added"]);
			this.whenAdded = toInteger(dbAssoc["job_route_loc_when_added"]);
			this.dimension = toInteger(dbAssoc["job_route_loc_vw"]);
			this.interior = toInteger(dbAssoc["job_route_loc_int"]);
			this.type = toInteger(dbAssoc["job_route_loc_type"]);
		}
	}
};

// ===========================================================================

/**
 * @class Representing a job equipment set/loadout's data. Loaded and saved in the database
 * @property {Array.<JobEquipmentItemData>} items
 */
class JobEquipmentData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.job = 0;
		this.name = "Unnamed";
		this.requiredRank = 0;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		/** @type {Array.<JobEquipmentItemData>} */
		this.items = [];

		if (dbAssoc) {
			this.databaseId = dbAssoc["job_equip_id"];
			this.job = dbAssoc["job_equip_job"];
			this.name = dbAssoc["job_equip_name"];
			this.requiredRank = dbAssoc["job_equip_minrank"];
			this.enabled = dbAssoc["job_equip_enabled"];
			this.whoAdded = dbAssoc["job_equip_who_added"];
			this.whenAdded = dbAssoc["job_equip_when_added"];
		}
	}
};

// ===========================================================================

/**
 * @class Representing a job equipment set item's data. Loaded and saved in the database
 */
class JobEquipmentItemData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.equipmentId = 0;
		this.itemType = 0;
		this.value = 0;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc) {
			this.databaseId = dbAssoc["job_equip_item_id"];
			this.equipmentId = dbAssoc["job_equip_item_equip"];
			this.itemType = dbAssoc["job_equip_item_type"];
			this.value = dbAssoc["job_equip_item_value"];
			this.enabled = dbAssoc["job_equip_item_enabled"];
			this.whoAdded = dbAssoc["job_equip_item_who_added"];
			this.whenAdded = dbAssoc["job_equip_item_when_added"];
		}
	}
};

// ===========================================================================

/**
 * @class Representing a job uniform's data. Loaded and saved in the database
 */
class JobUniformData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.job = 0;
		this.name = "Unnamed";
		this.requiredRank = 0
		this.skin = -1;
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		/*
		this.bodyParts = {
			hair: [0, 0],
			head: [0, 0],
			upper: [0, 0],
			lower: [0, 0],
		};

		this.bodyProps = {
			hair: [0, 0],
			eyes: [0, 0],
			head: [0, 0],
			leftHand: [0, 0],
			rightHand: [0, 0],
			leftWrist: [0, 0],
			rightWrist: [0, 0],
			hip: [0, 0],
			leftFoot: [0, 0],
			rightFoot: [0, 0],
		};
		*/

		if (dbAssoc) {
			this.databaseId = dbAssoc["job_uniform_id"];
			this.job = dbAssoc["job_uniform_job"];
			this.name = dbAssoc["job_uniform_name"];
			this.requiredRank = dbAssoc["job_uniform_minrank"];
			this.skin = dbAssoc["job_uniform_skin"];
			this.enabled = intToBool(dbAssoc["job_uniform_enabled"]);
			this.whoAdded = dbAssoc["job_uniform_who_added"];
			this.whenAdded = dbAssoc["job_uniform_when_added"];

			/*
			this.bodyParts = {
				hair: [toInteger(dbAssoc["job_uniform_hd_part_hair_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_part_hair_texture"]) || 0],
				head: [toInteger(dbAssoc["job_uniform_hd_part_head_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_part_head_texture"]) || 0],
				upper: [toInteger(dbAssoc["job_uniform_hd_part_upper_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_part_upper_texture"]) || 0],
				lower: [toInteger(dbAssoc["job_uniform_hd_part_lower_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_part_lower_texture"]) || 0],
			};

			this.bodyProps = {
				hair: [toInteger(dbAssoc["job_uniform_hd_prop_hair_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_hair_texture"]) || 0],
				eyes: [toInteger(dbAssoc["job_uniform_hd_prop_eyes_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_eyes_texture"]) || 0],
				head: [toInteger(dbAssoc["job_uniform_hd_prop_head_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_head_texture"]) || 0],
				leftHand: [toInteger(dbAssoc["job_uniform_hd_prop_lefthand_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_lefthand_texture"]) || 0],
				rightHand: [toInteger(dbAssoc["job_uniform_hd_prop_righthand_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_righthand_texture"]) || 0],
				leftWrist: [toInteger(dbAssoc["job_uniform_hd_prop_leftwrist_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_leftwrist_texture"]) || 0],
				rightWrist: [toInteger(dbAssoc["job_uniform_hd_prop_rightwrist_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_rightwrist_texture"]) || 0],
				hip: [toInteger(dbAssoc["job_uniform_hd_prop_hip_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_hip_texture"]) || 0],
				leftFoot: [toInteger(dbAssoc["job_uniform_hd_prop_leftfoot_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_leftfoot_texture"]) || 0],
				rightFoot: [toInteger(dbAssoc["job_uniform_hd_prop_rightfoot_model"]) || 0, toInteger(dbAssoc["job_uniform_hd_prop_rightfoot_texture"]) || 0],
			};
			*/
		}
	}
};

// ===========================================================================

/**
 * @class JobLocationData Representing a job uniform's data. Loaded and saved in the database
 */
class JobLocationData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.jobId = 0;
		this.position = toVector3(0.0, 0.0, 0.0);
		this.blip = false;
		this.pickup = false;
		this.enabled = false;
		this.interior = 0;
		this.dimension = 0;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;
		this.routeCache = [];
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc) {
			this.databaseId = dbAssoc["job_loc_id"];
			this.jobId = dbAssoc["job_loc_job"];
			this.position = toVector3(dbAssoc["job_loc_pos_x"], dbAssoc["job_loc_pos_y"], dbAssoc["job_loc_pos_z"]);
			this.blip = false;
			this.pickup = false;
			this.enabled = intToBool(dbAssoc["job_loc_enabled"]);
			this.interior = dbAssoc["job_loc_int"];
			this.dimension = dbAssoc["job_loc_vw"];
			this.whoAdded = dbAssoc["job_loc_who_added"];
			this.whenAdded = dbAssoc["job_loc_when_added"];
		}
	}
};

// ===========================================================================

/**
 * @class JobRankData Representing a job rank's data. Loaded and saved in the database
 */
class JobRankData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.jobId = 0;
		this.index = -1;
		this.jobIndex = -1;
		this.name = "";
		this.level = 0;
		this.enabled = false;
		this.pay = 0;
		this.whoAdded = 0;
		this.whenAdded = 0;
		this.flags = 0;
		this.needsSaved = false;
		this.public = false;

		if (dbAssoc) {
			this.databaseId = toInteger(dbAssoc["job_rank_id"]);
			this.jobId = toInteger(dbAssoc["job_rank_job"]);
			this.name = toString(dbAssoc["job_rank_name"]);
			this.level = toInteger(dbAssoc["job_rank_level"]);
			this.enabled = intToBool(dbAssoc["job_rank_enabled"]);
			this.pay = toInteger(dbAssoc["job_rank_pay"]);
			this.whoAdded = toInteger(dbAssoc["job_rank_who_added"]);
			this.whenAdded = toInteger(dbAssoc["job_rank_when_added"]);
			this.flags = toInteger(dbAssoc["job_rank_flags"]);
			this.public = intToBool(dbAssoc["job_rank_public"]);
		}
	}
};

// ===========================================================================

class JobWhiteListData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.job = 0;
		this.subAccount = 0
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc) {
			this.databaseId = dbAssoc["job_wl_id"];
			this.job = dbAssoc["job_wl_job"];
			this.subAccount = dbAssoc["job_wl_sacct"]
			this.enabled = dbAssoc["job_wl_enabled"];
			this.whoAdded = dbAssoc["job_wl_who_added"];
			this.whenAdded = dbAssoc["job_wl_when_added"];
		}
	}
};

// ===========================================================================

class JobBlackListData {
	constructor(dbAssoc = false) {
		this.databaseId = 0;
		this.job = 0;
		this.subAccount = 0
		this.enabled = false;
		this.index = -1;
		this.jobIndex = -1;
		this.needsSaved = false;
		this.whoAdded = 0;
		this.whenAdded = 0;

		if (dbAssoc) {
			this.databaseId = dbAssoc["job_bl_id"];
			this.job = dbAssoc["job_bl_job"];
			this.subAccount = dbAssoc["job_bl_sacct"]
			this.enabled = dbAssoc["job_bl_enabled"];
			this.whoAdded = dbAssoc["job_bl_who_added"];
			this.whenAdded = dbAssoc["job_bl_when_added"];
		}
	}
};

// ===========================================================================

class JobRouteLocationTypeData {
	constructor(jobRouteLocationTypeId, name, extra = {}) {
		this.jobRouteLocationTypeId = jobRouteLocationTypeId;
		this.name = name;
		this.animStart = (typeof extra.animStart != "undefined") ? extra.animStart : "none";
		this.animStop = (typeof extra.animStop != "undefined") ? extra.animStop : "none";
		this.inVehicle = (typeof extra.inVehicle != "undefined") ? extra.inVehicle : false;
		this.nearVehicle = (typeof extra.nearVehicle != "undefined") ? extra.nearVehicle : false;
		this.nearVehicleDistance = (typeof extra.nearVehicleDistance != "undefined") ? extra.nearVehicleDistance : 0.0;
	}
};

// ===========================================================================

// For use with the /jobrouteloctype command
let jobRouteLocationTypes = {
	[V_GAME_GTA_III]: [
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_CHECKPOINT, "Checkpoint"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GROUND_GARBAGE, "GroundGarbage"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GARBAGE_BIN, "GarbagePickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_BURNING_VEHICLE, "BurningVehicle"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_INJURED_PED, "InjuredPed"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_PICKUP, "PassengerPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_DROPOFF, "PassengerDropoff"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_PICKUP, "ItemPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_DROPOFF, "ItemDropoff"),
	],

	[V_GAME_GTA_VC]: [
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_CHECKPOINT, "Checkpoint"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GROUND_GARBAGE, "GroundGarbage"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GARBAGE_BIN, "GarbagePickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_BURNING_VEHICLE, "BurningVehicle"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_INJURED_PED, "InjuredPed"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_PICKUP, "PassengerPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_DROPOFF, "PassengerDropoff"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_PICKUP, "ItemPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_DROPOFF, "ItemDropoff"),
	],

	[V_GAME_GTA_SA]: [
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_CHECKPOINT, "Checkpoint"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GROUND_GARBAGE, "GroundGarbage"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GARBAGE_BIN, "GarbagePickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_BURNING_VEHICLE, "BurningVehicle"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_INJURED_PED, "InjuredPed"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_PICKUP, "PassengerPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_DROPOFF, "PassengerDropoff"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_PICKUP, "ItemPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_DROPOFF, "ItemDropoff"),
	],

	[V_GAME_GTA_IV]: [
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_CHECKPOINT, "Checkpoint"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GROUND_GARBAGE, "GroundGarbage"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GARBAGE_BIN, "GarbagePickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_BURNING_VEHICLE, "BurningVehicle"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_INJURED_PED, "InjuredPed"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_PICKUP, "PassengerPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_DROPOFF, "PassengerDropoff"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_PICKUP, "ItemPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_DROPOFF, "ItemDropoff"),
	],

	[V_GAME_MAFIA_ONE]: [
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_CHECKPOINT, "Checkpoint"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GROUND_GARBAGE, "GroundGarbage"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GARBAGE_BIN, "GarbagePickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_BURNING_VEHICLE, "BurningVehicle"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_INJURED_PED, "InjuredPed"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_PICKUP, "PassengerPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_DROPOFF, "PassengerDropoff"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_PICKUP, "ItemPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_DROPOFF, "ItemDropoff"),
	],

	[V_GAME_MAFIA_TWO]: [
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_CHECKPOINT, "Checkpoint"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GROUND_GARBAGE, "GroundGarbage"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GARBAGE_BIN, "GarbagePickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_BURNING_VEHICLE, "BurningVehicle"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_INJURED_PED, "InjuredPed"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_PICKUP, "PassengerPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_DROPOFF, "PassengerDropoff"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_PICKUP, "ItemPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_DROPOFF, "ItemDropoff"),
	],

	[V_GAME_MAFIA_ONE_DE]: [
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_CHECKPOINT, "Checkpoint"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GROUND_GARBAGE, "GroundGarbage"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_GARBAGE_BIN, "GarbagePickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_BURNING_VEHICLE, "BurningVehicle"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_INJURED_PED, "InjuredPed"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_PICKUP, "PassengerPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_PASSENGER_DROPOFF, "PassengerDropoff"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_PICKUP, "ItemPickup"),
		new JobRouteLocationTypeData(V_JOB_ROUTE_LOC_TYPE_ITEM_DROPOFF, "ItemDropoff"),
	],
}

// ===========================================================================

function initJobScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Job]: Initializing job script ...");
	logToConsole(LOG_INFO, "[V.RP.Job]: Job script initialized successfully!");
	return true;
}

// ===========================================================================

function loadJobsFromDatabase() {
	logToConsole(LOG_DEBUG, "[V.RP.Job]: Loading jobs from database ...");

	let tempJobs = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM job_main WHERE job_deleted = 0 AND job_enabled = 1 AND job_server = ${getServerId()}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempJobData = new JobData(dbAssoc[i]);
				tempJobData.locations = loadJobLocationsFromDatabase(tempJobData.databaseId);
				tempJobData.equipment = loadJobEquipmentsFromDatabase(tempJobData.databaseId);
				tempJobData.uniforms = loadJobUniformsFromDatabase(tempJobData.databaseId);
				tempJobData.routes = loadJobRoutesFromDatabase(tempJobData.databaseId);
				tempJobData.ranks = loadJobRanksFromDatabase(tempJobData.databaseId);
				tempJobs.push(tempJobData);
				logToConsole(LOG_VERBOSE, `[V.RP.Job]: Job '${tempJobData.name}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: ${tempJobs.length} jobs loaded from database successfully!`);
	return tempJobs;
}

// ===========================================================================

function loadAllJobEquipmentFromDatabase() {
	for (let i in serverData.jobs) {
		serverData.jobs[i].equipment = loadJobEquipmentsFromDatabase(serverData.jobs[i].databaseId);
	}
}

// ===========================================================================

function loadAllJobUniformsFromDatabase() {
	for (let i in serverData.jobs) {
		serverData.jobs[i].uniforms = loadJobUniformsFromDatabase(serverData.jobs[i].databaseId);
	}
}

// ===========================================================================

function loadAllJobRoutesFromDatabase() {
	for (let i in serverData.jobs) {
		serverData.jobs[i].routes = loadJobRoutesFromDatabase(serverData.jobs[i].databaseId);
	}
}

// ===========================================================================

function loadAllJobLocationsFromDatabase() {
	for (let i in serverData.jobs) {
		serverData.jobs[i].locations = loadJobLocationsFromDatabase(serverData.jobs[i].databaseId);
	}
}

// ===========================================================================

function loadJobRanksFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Loading ranks for job ${jobDatabaseId} from database ...`);

	let tempJobRanks = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM job_rank WHERE job_rank_deleted = 0 AND job_rank_enabled = 1 AND job_rank_job = ${jobDatabaseId}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempJobRankData = new JobRankData(dbAssoc[i]);
				tempJobRanks.push(tempJobRankData);
				logToConsole(LOG_VERBOSE, `[V.RP.Job]: Job rank '${tempJobRankData.name}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: ${tempJobRanks.length} ranks for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobRanks;
}

// ===========================================================================

function loadJobRoutesFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Loading job routes for job ${jobDatabaseId} from database ...`);

	let tempJobRoutes = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM job_route WHERE job_route_deleted = 0 AND job_route_enabled = 1 AND job_route_job = ${jobDatabaseId}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempJobRouteData = new JobRouteData(dbAssoc[i]);
				tempJobRouteData.locations = loadJobRouteLocationsFromDatabase(tempJobRouteData.databaseId);
				tempJobRoutes.push(tempJobRouteData);
				logToConsole(LOG_VERBOSE, `[V.RP.Job]: Job route '${tempJobRouteData.name}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: ${tempJobRoutes.length} job routes for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobRoutes;
}

// ===========================================================================

function loadJobRouteLocationsFromDatabase(jobRouteId) {
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Loading locations for job route ${jobRouteId} from database ...`);

	let tempJobRouteLocations = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM job_route_loc WHERE job_route_loc_deleted = 0 AND job_route_loc_enabled = 1 AND job_route_loc_route = ${jobRouteId}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempJobRouteLocationData = new JobRouteLocationData(dbAssoc[i]);
				tempJobRouteLocations.push(tempJobRouteLocationData);
				logToConsole(LOG_VERBOSE, `[V.RP.Job]: Job route location '${tempJobRouteLocationData.databaseId}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: ${tempJobRouteLocations.length} locations for job route ${jobRouteId} loaded from database successfully!`);
	return tempJobRouteLocations;
}

// ===========================================================================

function loadJobEquipmentsFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Loading job equipments for job ${jobDatabaseId} from database ...`);

	let tempJobEquipments = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM job_equip WHERE job_equip_deleted = 0 AND job_equip_enabled = 1 AND job_equip_job = ${jobDatabaseId}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempJobEquipmentData = new JobEquipmentData(dbAssoc[i]);
				tempJobEquipmentData.items = loadJobEquipmentItemsFromDatabase(tempJobEquipmentData.databaseId);
				tempJobEquipments.push(tempJobEquipmentData);
				logToConsole(LOG_VERBOSE, `[V.RP.Job]: Job equipment '${tempJobEquipmentData.name}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: ${tempJobEquipments.length} job equipments for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobEquipments;
}

// ===========================================================================

function loadJobLocationsFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Loading job locations for job ${jobDatabaseId} from database ...`);

	let tempJobLocations = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = `SELECT * FROM job_loc WHERE job_loc_deleted = 0 AND job_loc_enabled = 1 AND job_loc_job = ${jobDatabaseId}`;
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempJobLocationData = new JobLocationData(dbAssoc[i]);
				tempJobLocations.push(tempJobLocationData);
				logToConsole(LOG_VERBOSE, `[V.RP.Job]: Job location '${tempJobLocationData.databaseId}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: ${tempJobLocations.length} job locations for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobLocations;
}

// ===========================================================================

function loadJobUniformsFromDatabase(jobDatabaseId) {
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Loading job uniforms for job ${jobDatabaseId} from database ...`);

	let tempJobUniforms = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = "SELECT * FROM `job_uniform` WHERE `job_uniform_enabled` = 1 AND `job_uniform_job` = " + toString(jobDatabaseId);
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempJobUniformData = new JobUniformData(dbAssoc[i]);
				tempJobUniforms.push(tempJobUniformData);
				logToConsole(LOG_VERBOSE, `[V.RP.Job]: Job uniform '${tempJobUniformData.databaseId}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: ${tempJobUniforms.length} job uniforms for job ${jobDatabaseId} loaded from database successfully!`);
	return tempJobUniforms;
}

// ===========================================================================

function loadJobEquipmentItemsFromDatabase(jobEquipmentDatabaseId) {
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Loading job equipment items for job equipment ${jobEquipmentDatabaseId} from database ...`);

	let tempJobEquipmentItems = [];
	let dbConnection = connectToDatabase();
	let dbAssoc = [];

	if (dbConnection) {
		let dbQueryString = "SELECT * FROM `job_equip_item` WHERE `job_equip_item_enabled` = 1 AND `job_equip_item_equip` = " + toString(jobEquipmentDatabaseId)
		dbAssoc = fetchQueryAssoc(dbConnection, dbQueryString);
		if (dbAssoc.length > 0) {
			for (let i in dbAssoc) {
				let tempJobEquipmentItemData = new JobEquipmentItemData(dbAssoc[i]);
				tempJobEquipmentItems.push(tempJobEquipmentItemData);
				logToConsole(LOG_VERBOSE, `[V.RP.Job]: Job equipment item '${tempJobEquipmentItemData.databaseId}' loaded from database successfully!`);
			}
		}
		disconnectFromDatabase(dbConnection);
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: ${tempJobEquipmentItems.length} job equipment items for equipment ${jobEquipmentDatabaseId} loaded from database successfully!`);
	return tempJobEquipmentItems;
}

// ===========================================================================

function spawnAllJobBlips() {
	if (!serverConfig.createJobBlips) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job] Spawning all job location blips ...`);
	for (let i in serverData.jobs) {
		for (let j in serverData.jobs[i].locations) {
			spawnJobLocationBlip(i, j);
		}
	}
	logToConsole(LOG_DEBUG, `[V.RP.Job] All job location blips spawned!`);
}

// ===========================================================================

function spawnAllJobPickups() {
	if (!serverConfig.createJobPickups) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job] Spawning all job location pickups ...`);
	let pickupCount = 0;
	for (let i in serverData.jobs) {
		if (serverData.jobs[i].pickupModel != 0) {
			for (let j in serverData.jobs[i].locations) {
				pickupCount++;
				serverData.jobs[i].locations[j].pickup = game.createPickup(serverData.jobs[i].pickupModel, serverData.jobs[i].locations[j].position);
				setEntityData(serverData.jobs[i].locations[j].pickup, "v.rp.owner.type", V_PICKUP_JOB, false);
				setEntityData(serverData.jobs[i].locations[j].pickup, "v.rp.owner.id", j, false);
				setEntityData(serverData.jobs[i].locations[j].pickup, "v.rp.label.type", V_LABEL_JOB, true);
				setEntityData(serverData.jobs[i].locations[j].pickup, "v.rp.label.name", serverData.jobs[i].name, true);
				setEntityData(serverData.jobs[i].locations[j].pickup, "v.rp.label.jobType", i, true);
				setEntityData(serverData.jobs[i].locations[j].pickup, "v.rp.label.publicRank", doesJobHavePublicRank(i), true);
				setElementOnAllDimensions(serverData.jobs[i].locations[j].pickup, false);
				setElementDimension(serverData.jobs[i].locations[j].pickup, serverData.jobs[i].locations[j].dimension);
				addToWorld(serverData.jobs[i].locations[j].pickup);

				logToConsole(LOG_VERBOSE, `[V.RP.Job] Job '${serverData.jobs[i].name}' location pickup ${j} spawned!`);
			}
		}
	}
	logToConsole(LOG_DEBUG, `[V.RP.Job] All job location pickups (${pickupCount}) spawned!`);
}

// ===========================================================================

function showJobInformationToPlayer(client, jobType) {
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	if (jobType == getPlayerCurrentSubAccount(client).job) {
		messagePlayerInfo("Welcome back to your job. Use /startwork to begin.");
		return false;
	}

	switch (jobType) {
		case V_JOB_POLICE:
			if (!canPlayerUsePoliceJob(client)) {
				return false;
			}

			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Police Officers are enforcers of the law.");
			messagePlayerInfo(client, "- Use /startwork at a police station to work as a Police Officer.");
			messagePlayerInfo(client, "- Use /laws to see a list of laws.");
			messagePlayerInfo(client, "- Commands are: /cuff, /drag, /detain, /arrest, /search /tazer /radio");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case V_JOB_MEDICAL:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Paramedics help people by healing them.");
			messagePlayerInfo(client, "- Use /startwork at the hospital to work as a Paramedic.");
			messagePlayerInfo(client, "- People can enter your ambulance to get healed.");
			messagePlayerInfo(client, "- The pay depends on the player's health before healing them.");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case V_JOB_FIRE:
			if (!canClientUseFireJob(client)) {
				return false;
			}
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Firefighters put out vehicle and building fires.");
			messagePlayerInfo(client, "- Use /startwork at the fire station to work as a Firefighter.");
			messagePlayerInfo(client, "- Get in a firetruck and you will be told where to go.");
			messagePlayerInfo(client, "- Use the firetruck hose to put out fires");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case V_JOB_BUS:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Bus Drivers transport people around the city on a route");
			messagePlayerInfo(client, "- Use /startwork at the bus depot to work as a Bus Driver.");
			messagePlayerInfo(client, "- Passengers can get on/off at any stop on your route");
			messagePlayerInfo(client, "- Stay on your assigned route. You will be paid when finished.");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case V_JOB_TAXI:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Taxi Drivers transport people around the city");
			messagePlayerInfo(client, "- Use /startwork at the taxi depot to work as a Taxi Driver.");
			messagePlayerInfo(client, "- Use /fare to set a fare. Fares start when a player gets in.");
			messagePlayerInfo(client, "- The meter will run until the player exits the vehicle.");
			messagePlayerInfo(client, "- You will automatically receive the fare money");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case V_JOB_GARBAGE:
			messagePlayerInfo(client, "== Job Help =================================");
			messagePlayerInfo(client, "- Garbage Collectors pick up the trash around the city.");
			messagePlayerInfo(client, "- Use /startwork at the garbage depot to work as a Garbage Collector.");
			messagePlayerInfo(client, "- Drive up to a garbage can or dumpster, and right click to grab a bag.");
			messagePlayerInfo(client, "- Walk up to the back of your truck and right click again to throw the bag in.");
			messagePlayerInfo(client, "- Your truck can hold 25 trashbags. Each bag is worth $25");
			messagePlayerInfo(client, "- Drive to the garbage depot again to deliver trash");
			messagePlayerInfo(client, "- When finished, use /stopwork to stop working.");
			break;

		case V_JOB_WEAPON:
			break;

		case V_JOB_DRUG:
			break;

		default:
			break;
	}
}

// ===========================================================================

function jobListCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use any jobs!");
		return false;
	}

	let jobList = serverData.jobs.map(function (x) { return `[${hexFromToColour(x.colour)}]${x.name}{MAINCOLOUR}` });
	let chunkedList = splitArrayIntoChunks(jobList, 4);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobList")));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
	return true;
}

// ===========================================================================

function takeJobCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, getLocaleString(client, "NotAllowedToUseJobs"));
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));
	let jobData = getJobData(closestJobLocation.jobIndex);

	if (closestJobLocation == false) {
		messagePlayerError(client, getLocaleString(client, "NoJobLocationCloseEnough"));
		return false;
	}

	if (closestJobLocation.position.distance(getPlayerPosition(client)) > globalConfig.takeJobDistance) {
		messagePlayerError(client, getLocaleString(client, "NoJobLocationCloseEnough"));
		return false;
	}

	if (getPlayerCurrentSubAccount(client).job > V_JOB_NONE) {
		messagePlayerInfo(client, getLocaleString(client, "QuitJobToTakeAnother", "{ALTCOLOUR}/quitjob{MAINCOLOUR}"));
		return false;
	}

	if (!canPlayerUseJob(client, closestJobLocation.jobIndex)) {
		messagePlayerError(client, getLocaleString(client, "CantUseThisJob"));
		return false;
	}

	takeJob(client, closestJobLocation.jobIndex);
	messagePlayerSuccess(client, getLocaleString(client, "JobChanged", `{jobYellow}${jobData.name}{MAINCOLOUR}`));
	return true;
}

// ===========================================================================

function startWorkingCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));
	let jobData = false;

	if (closestJobLocation.position.distance(getPlayerPosition(client)) > globalConfig.startWorkingDistance) {
		let closestVehicle = getClosestVehicle(getPlayerPosition(client));
		if (getDistance(getVehiclePosition(closestVehicle), getPlayerPosition(client)) > globalConfig.startWorkingDistance) {
			messagePlayerError(client, getLocaleString(client, "NeedToBeNearJob"));
			return false;
		}

		if (getVehicleData(closestVehicle).ownerType != V_VEH_OWNER_JOB) {
			messagePlayerError(client, getLocaleString(client, "NotAJobVehicle"));
			return false;
		}

		if (getPlayerCurrentSubAccount(client).job != getVehicleData(closestVehicle).ownerId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJobVehicle"));
			return false;
		}

		jobData = getJobData(getJobIdFromDatabaseId(getVehicleData(closestVehicle).ownerId));
	} else {
		if (getPlayerCurrentSubAccount(client).jobIndex == -1) {
			messagePlayerError(client, getLocaleString(client, "DontHaveAJob"));
			messagePlayerInfo(client, "You can get a job by going the yellow points on the map.");
			return false;
		}

		if (getPlayerCurrentSubAccount(client).job != closestJobLocation.jobId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJob"));
			messagePlayerInfo(client, getLocaleString(client, "QuitJobToTakeAnother", "{ALTCOLOUR}/quitjob{MAINCOLOUR}"));
			return false;
		}

		jobData = getJobData(closestJobLocation.jobIndex);
	}

	if (!jobData.enabled) {
		messagePlayerError(client, getLocaleString(client, "JobDisabled", jobData.name));
		return false;
	}

	messagePlayerSuccess(client, getLocaleString(client, "StartedWorking", jobData.name));
	messageDiscordEventChannel(`💼 ${getCharacterFullName(client)} started working for the {jobYellow}${jobData.name}{MAINCOLOUR} job`);

	startWorking(client);

	if (doesJobLocationHaveAnyRoutes(closestJobLocation)) {
		if (!hasPlayerSeenActionTip(client, "EnterJobVehicleForRoute")) {
			messagePlayerTip(client, getGroupedLocaleString(client, "ActionTips", "EnterJobVehicleForRoute"));
		}
	}
	return true;
}

// ===========================================================================

function stopWorkingCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	deleteJobItems(client);
	stopWorking(client);
	messagePlayerSuccess(client, getLocaleString(client, "StoppedWorking"));
	return true;
}

// ===========================================================================

function startWorking(client) {
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	switchPlayerActiveHotBarSlot(client, -1);
	getPlayerCurrentSubAccount(client).skin = getPlayerSkin(client);
	storePlayerItemsInTempLocker(client);
	getPlayerData(client).tempLockerType = V_TEMP_LOCKER_TYPE_JOB;
	messagePlayerInfo(client, getLocaleString(client, "ItemsStoredForJob"));

	getPlayerCurrentSubAccount(client).isWorking = true;

	let jobId = getPlayerCurrentSubAccount(client).job;
	switch (getJobIndexFromDatabaseId(jobId)) {
		case V_JOB_POLICE:
			messagePlayerInfo(client, getLocaleString(client, "JobEquipAndUniformLabel", `{ALTCOLOUR}/uniform{MAINCOLOUR}, {ALTCOLOUR}/equip{MAINCOLOUR}`));
			break;

		case V_JOB_MEDICAL:
			messagePlayerInfo(client, getLocaleString(client, "JobEquipAndUniformLabel", `{ALTCOLOUR}/uniform{MAINCOLOUR}, {ALTCOLOUR}/equip{MAINCOLOUR}`));
			break;

		case V_JOB_FIRE:
			messagePlayerInfo(client, getLocaleString(client, "JobEquipAndUniformLabel", `{ALTCOLOUR}/uniform{MAINCOLOUR}, {ALTCOLOUR}/equip{MAINCOLOUR}`));
			break;

		case V_JOB_BUS:
			messagePlayerInfo(client, getLocaleString(client, "GetStartedJobVehicle", getGroupedLocaleString(client, "VehicleTypes", "Bus")));
			break;

		case V_JOB_TAXI:
			messagePlayerInfo(client, getLocaleString(client, "GetStartedJobVehicle", getGroupedLocaleString(client, "VehicleTypes", "Taxi")));
			break;

		case V_JOB_GARBAGE:
			messagePlayerInfo(client, getLocaleString(client, "GetStartedJobVehicle", getGroupedLocaleString(client, "VehicleTypes", "GarbageTruck")));
			break;

		case V_JOB_WEAPON:
			break;

		case V_JOB_DRUG:
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

	messagePlayerInfo(client, `{jobYellow}[Job Info] {MAINCOLOUR}Name:{ALTCOLOUR} ${getJobData(closestJobLocation.jobIndex).name}, {MAINCOLOUR}Enabled:{ALTCOLOUR} ${getYesNoFromBool(intToBool(getJobData(closestJobLocation.jobIndex).enabled))}, {MAINCOLOUR}Whitelisted:{ALTCOLOUR} ${getYesNoFromBool(intToBool(getJobData(closestJobLocation.jobIndex).whiteListEnabled))}, {MAINCOLOUR}Blacklisted:{ALTCOLOUR} ${getYesNoFromBool(intToBool(getJobData(closestJobLocation.jobIndex).blackListEnabled))}, {MAINCOLOUR}ID:{ALTCOLOUR} ${getJobData(closestJobLocation.jobIndex).databaseId}/${closestJobLocation.jobIndex}`);
}

// ===========================================================================

function getJobLocationInfoCommand(command, params, client) {
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));

	messagePlayerInfo(client, `{jobYellow}[Job Location Info] {MAINCOLOUR}Job:{ALTCOLOUR} ${getJobData(closestJobLocation.jobIndex).name} (${getJobData(closestJobLocation.jobIndex).databaseId}/${closestJobLocation.jobIndex}), {MAINCOLOUR}Enabled:{ALTCOLOUR} ${getYesNoFromBool(closestJobLocation.enabled)}, {MAINCOLOUR}Database ID:{ALTCOLOUR} ${closestJobLocation.databaseId}`);
}

// ===========================================================================

function givePlayerJobEquipment(client, equipmentId) {
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	if (!doesPlayerHaveAnyJob(client)) {
		return false;
	}

	let jobId = getPlayerJob(client);

	for (let i in getJobData(jobId).equipment[equipmentId].items) {
		let value = getJobData(jobId).equipment[equipmentId].items[i].value
		if (getItemTypeData(getItemTypeIndexFromDatabaseId(getJobData(jobId).equipment[equipmentId].items[i].itemType)).useType == V_ITEM_USE_TYPE_WALKIETALKIE) {
			value = getJobData(jobId).radioFrequency;
		}
		let itemId = createItem(getItemTypeIndexFromDatabaseId(getJobData(jobId).equipment[equipmentId].items[i].itemType), value, V_ITEM_OWNER_JOB, getPlayerCurrentSubAccount(client).databaseId, 1, true);
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
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	if (!doesPlayerHaveAnyJob(client)) {
		return false;
	}

	if (!isPlayerWorking(client)) {
		return false;
	}

	getPlayerCurrentSubAccount(client).isWorking = false;

	setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);
	setPlayerPedPartsAndProps(client);

	let jobVehicle = getPlayerData(client).lastJobVehicle;
	if (jobVehicle) {
		if (getPlayerVehicle(client) == jobVehicle) {
			removePedFromVehicle(getPlayerPed(client));
		}

		if (isVehicleUnoccupied(jobVehicle)) {
			setTimeout(function () {
				respawnVehicle(jobVehicle);
			}, 1000);
		}

		getPlayerData(client).lastJobVehicle = null;
	}

	deleteJobItems(client);
	restorePlayerTempLockerItems(client);
	//respawnJobVehicle(client);
	sendPlayerStopJobRoute(client);
	getPlayerData(client).jobUniform = -1;

	let jobId = getPlayerJob(client);
	messageDiscordEventChannel(`💼 ${getCharacterFullName(client)} has stopped working as a ${getJobData(jobId).name}`);

	/*
	switch (getJobType(jobId)) {
		case V_JOB_POLICE:
			messagePlayerInfo(client, "Your uniform, equipment, and vehicle have been returned to the police station");
			break;

		case V_JOB_MEDICAL:
			messagePlayerInfo(client, "Your uniform, equipment, and vehicle have been returned to the hospital");
			break;

		case V_JOB_FIRE:
			messagePlayerInfo(client, "Your uniform, equipment, and vehicle have been returned to the fire station");
			break;

		case V_JOB_BUS:
			messagePlayerInfo(client, "Your vehicle has been returned to the bus depot");
			break;

		case V_JOB_TAXI:
			messagePlayerInfo(client, "Your vehicle has been returned to the taxi depot");
			break;

		case V_JOB_GARBAGE:
			messagePlayerInfo(client, "Your vehicle has been returned to the city trash dump");
			break;

		case V_JOB_WEAPON:
			break;

		case V_JOB_DRUG:
			break;

		case V_JOB_GENERIC:
			messagePlayerInfo(client, "Your vehicle has been respawned at your job location");
			break;

		default:
			break;
	}
	*/

	updatePlayerNameTag(client);
	sendPlayerWorkingState(client, false);
	//cachePlayerHotBarItems(client); // Done in restorePlayerTempLockerItems
}

// ===========================================================================

function jobUniformCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	if (!doesPlayerHaveAnyJob(client)) {
		messagePlayerError(client, getLocaleString(client, "DontHaveAJob"));
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", `{ALTCOLOUR}/startwork{MAINCOLOUR}`));
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));
	let jobData = false;

	if (closestJobLocation.position.distance(getPlayerPosition(client)) > globalConfig.startWorkingDistance) {
		let closestVehicle = getClosestVehicle(getPlayerPosition(client));
		if (getDistance(getVehiclePosition(closestVehicle), getPlayerPosition(client)) > globalConfig.startWorkingDistance) {
			messagePlayerError(client, getLocaleString(client, "NeedToBeNearJob"));
			return false;
		}

		if (getVehicleData(closestVehicle).ownerType != V_VEH_OWNER_JOB) {
			messagePlayerError(client, getLocaleString(client, "NotAJobVehicle"));
			return false;
		}

		if (getPlayerCurrentSubAccount(client).job != getVehicleData(closestVehicle).ownerId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJobVehicle"));
			return false;
		}

		jobData = getJobData(getJobIdFromDatabaseId(getVehicleData(closestVehicle).ownerId));
	} else {
		if (getPlayerCurrentSubAccount(client).job == V_JOB_NONE) {
			messagePlayerError(client, getLocaleString(client, "NotYourJob"));
			messagePlayerInfo(client, getLocaleString(client, "JobPoints"));
			return false;
		}

		if (getPlayerCurrentSubAccount(client).job != closestJobLocation.jobId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJob"));
			messagePlayerInfo(client, getLocaleString(client, "QuitJobToTakeAnother", "{ALTCOLOUR}/quitjob{MAINCOLOUR}"));
			return false;
		}

		jobData = getJobData(closestJobLocation.jobIndex);
	}

	if (!jobData.enabled) {
		messagePlayerError(client, getLocaleString(client, "JobDisabled", jobData.name));
		return false;
	}

	let uniforms = jobData.uniforms;

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));

		let uniformList = jobData.uniforms.map(function (x) { return `{MAINCOLOUR}${toInteger(x.index) + 1}: {ALTCOLOUR}${x.name}` });
		let chunkedList = splitArrayIntoChunks(uniformList, 4);

		messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobUniformList", jobData.name)));
		for (let i in chunkedList) {
			messagePlayerInfo(client, chunkedList[i].join(", "));
		}
		return false;
	}

	let jobIndex = getPlayerJob(client);
	let rankIndex = getPlayerJobRank(client);
	let uniformId = toInteger(params) || 1;
	let jobRankData = getJobRankData(jobIndex, rankIndex);

	if (uniformId == 0) {
		setPlayerSkin(client, getPlayerCurrentSubAccount(client).skin);
		setPlayerPedPartsAndProps(client);
		meActionToNearbyPlayers(client, `takes off their uniform`);
		return false;
	}

	if (uniformId < 1 || uniformId > uniforms.length) {
		messagePlayerError(client, getLocaleString(client, "InvalidJobUniform"));
		return false;
	}

	let uniformData = getJobUniformData(jobIndex, uniformId - 1);

	if (jobData.ranks.length > 0) {
		if (jobRankData.level < uniformData.requiredRank) {
			messagePlayerError(client, getLocaleString(client, "JobRankTooLow", jobRankData.level, uniformData.requiredRank));
			return false;
		}
	}

	setPlayerSkin(client, uniformData.skin);

	if (isGameFeatureSupported("pedBodyPart")) {
		forcePlayerIntoSkinSelect(client, uniformData.skin);
	}

	getPlayerData(client).jobUniform = uniformData.skin;
	meActionToNearbyPlayers(client, `puts on ${getProperDeterminerForName(uniformData.name)} ${uniformData.name} uniform`);
}

// ===========================================================================

function jobEquipmentCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	if (!doesPlayerHaveAnyJob(client)) {
		messagePlayerError(client, getLocaleString(client, "DontHaveAJob"));
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", `{ALTCOLOUR}/startwork{MAINCOLOUR}`));
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));
	let jobData = false;

	if (closestJobLocation.position.distance(getPlayerPosition(client)) > globalConfig.startWorkingDistance) {
		let closestVehicle = getClosestVehicle(getPlayerPosition(client));
		if (getDistance(getVehiclePosition(closestVehicle), getPlayerPosition(client)) > globalConfig.startWorkingDistance) {
			messagePlayerError(client, getLocaleString(client, "NeedToBeNearJob"));
			return false;
		}

		if (getVehicleData(closestVehicle).ownerType != V_VEH_OWNER_JOB) {
			messagePlayerError(client, getLocaleString(client, "NotAJobVehicle"));
			return false;
		}

		if (getPlayerCurrentSubAccount(client).job != getVehicleData(closestVehicle).ownerId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJobVehicle"));
			return false;
		}

		jobData = getJobData(getJobIdFromDatabaseId(getVehicleData(closestVehicle).ownerId));
	} else {
		if (getPlayerCurrentSubAccount(client).job == V_JOB_NONE) {
			messagePlayerError(client, getLocaleString(client, "NotYourJob"));

			//if (!hasPlayerSeenActionTip(client, "JobLocations")) {
			//	messagePlayerInfo(client, getGroupedLocaleString(client, "ActionTips", "JobPoints", "{ALTCOLOUR}/gps{MAINCOLOUR}"));
			//}
			return false;
		}

		if (getPlayerCurrentSubAccount(client).job != closestJobLocation.jobId) {
			messagePlayerError(client, getLocaleString(client, "NotYourJob"));
			messagePlayerInfo(client, getLocaleString(client, "QuitJobToTakeAnother", "{ALTCOLOUR}/quitjob{MAINCOLOUR}"));
			return false;
		}

		jobData = getJobData(closestJobLocation.jobIndex);
	}

	if (!jobData.enabled) {
		messagePlayerError(client, getLocaleString(client, "JobDisabled", jobData.name));
		return false;
	}

	let equipments = jobData.equipment;

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		messagePlayerNormal(client, `0: No equipment`);
		for (let i in equipments) {
			messagePlayerNormal(client, `${toInteger(i) + 1}: ${equipments[i].name} (Requires rank ${equipments[i].requiredRank})`);
		}
		return false;
	}

	let jobIndex = getPlayerJob(client);
	let rankIndex = getPlayerJobRank(client);
	let equipmentId = toInteger(params) || 1;
	let jobRankData = getJobRankData(jobIndex, rankIndex);

	if (equipmentId == 0) {
		meActionToNearbyPlayers(client, `puts their equipment into the locker`);
		deleteJobItems(client);
		return true;
	}

	if (equipmentId < 1 || equipmentId > equipments.length) {
		messagePlayerError(client, getLocaleString(client, "InvalidJobEquipment"));
		return false;
	}

	let jobEquipmentData = getJobEquipmentData(jobIndex, equipmentId - 1)

	if (jobData.ranks.length > 0) {
		if (jobRankData.level < jobEquipmentData.requiredRank) {
			messagePlayerError(client, getLocaleString(client, "JobRankTooLow", jobRankData.level, jobEquipmentData.requiredRank));
			return false;
		}
	}

	deleteJobItems(client);
	givePlayerJobEquipment(client, equipmentId - 1);
	//messagePlayerSuccess(client, `You have been given the ${equipments[equipmentId-1].name} equipment`);
	meActionToNearbyPlayers(client, `grabs the ${jobEquipmentData.name} equipment from the locker`);
	if (!hasPlayerSeenActionTip(client, "JobEquipmentInventory")) {
		if (doesPlayerHaveKeyBindForCommand(client, "inv")) {
			messagePlayerTip(client, getGroupedLocaleString(client, "ActionTips", "JobEquipmentInventory", toUpperCase(getKeyNameFromId(getPlayerKeyBindForCommand(client, "inv").key))));
		} else {
			messagePlayerTip(client, getGroupedLocaleString(client, "ActionTips", "JobEquipmentInventory", "/inv"));
		}
		markPlayerActionTipSeen(client, "JobEquipmentInventory");
	}

}

// ===========================================================================

function quitJobCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	if (!doesPlayerHaveAnyJob(client)) {
		return false;
	}

	stopWorking(client);
	quitJob(client);
	messagePlayerSuccess(client, "You are now unemployed!");
	return true;
}

// ===========================================================================

function jobRadioCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		return false;
	}

	return true;
}

// ===========================================================================

function jobDepartmentRadioCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
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
	if (typeof serverData.jobs[jobId] != "undefined") {
		return serverData.jobs[jobId];
	}

	return null;
}

// ===========================================================================

function quitJob(client) {
	stopWorking(client);
	getPlayerCurrentSubAccount(client).job = 0;
	getPlayerCurrentSubAccount(client).jobRank = 0;
	getPlayerCurrentSubAccount(client).jobIndex = -1;
	getPlayerCurrentSubAccount(client).jobRankIndex = -1;
	sendPlayerJobType(client, -1);
	updateJobBlipsForPlayer(client);
}

// ===========================================================================

function takeJob(client, jobId) {
	let rankIndex = -1;
	let rankId = 0;
	if (getJobData(jobId).ranks.length > 0) {
		rankIndex = getLowestJobRank(jobId);
		rankId = getJobRankData(jobId, rankId).databaseId;
	}
	getPlayerCurrentSubAccount(client).job = getJobData(jobId).databaseId;
	getPlayerCurrentSubAccount(client).jobRank = rankId;
	getPlayerCurrentSubAccount(client).jobIndex = jobId;
	getPlayerCurrentSubAccount(client).jobRankIndex = rankIndex;
	sendPlayerJobType(client, jobId);
	updateJobBlipsForPlayer(client);
}

// ===========================================================================

function reloadAllJobsCommand(command, params, client) {
	forceAllPlayersToStopWorking();

	deleteAllJobBlips();
	deleteAllJobPickups();
	serverData.jobs = [];

	//Promise.resolve().then(() => {
	serverData.jobs = loadJobsFromDatabase();
	spawnAllJobPickups();
	spawnAllJobBlips();
	//});

	announceAdminAction("AllJobsReloaded");
}

// ===========================================================================

function createJobCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	createJob(params, getPlayerData(client).accountData.databaseId);

	messagePlayerSuccess(client, `Job {jobYellow}${params} {MAINCOLOUR}created!`);
	return true;
}

// ===========================================================================

function createJob(name, whoAdded = defaultNoAccountId) {
	let tempJobData = new JobData(false);
	tempJobData.serverId = getServerId();
	tempJobData.name = name;
	tempJobData.enabled = true;
	tempJobData.needsSaved = true;
	tempJobData.blipModel = (isGameFeatureSupported("blip")) ? gameData.blipSprites[getGame()].Job : -1;
	tempJobData.pickupModel = (isGameFeatureSupported("pickup")) ? gameData.pickupModels[getGame()].Job : -1;
	tempJobData.colour = toColour(255, 255, 255, 255);
	tempJobData.whoAdded = whoAdded;

	serverData.jobs.push(tempJobData);
	saveJobToDatabase(tempJobData);
	setAllJobDataIndexes();
}

// ===========================================================================

function createJobRank(name, level) {
	let tempJobRankData = new JobRankData(false);
	tempJobRankData.serverId = getServerId();
	tempJobRankData.name = name;
	tempJobRankData.jobIndex = jobIndex;
	tempJobRankData.jobId = getJobData(jobIndex).databaseId;
	tempJobRankData.enabled = true;
	tempJobRankData.level = 1;
	tempJobRankData.public = false;
	tempJobRankData.needsSaved = true;

	serverData.jobs[jobIndex].push(tempJobRankData);
	saveJobRankToDatabase(tempJobRankData);
	setAllJobDataIndexes();
}

// ===========================================================================

function createJobLocationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params);

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	createJobLocation(jobId, getPlayerPosition(client), getPlayerInterior(client), getPlayerDimension(client), getPlayerData(client).accountData.databaseId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created a location for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
	return true;
}

// ===========================================================================

function deleteJobLocationCommand(command, params, client) {
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));

	deleteJobLocation(closestJobLocation.jobIndex, closestJobLocation.index, getPlayerData(client).accountData.databaseId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted location {ALTCOLOUR}${closestJobLocation.index} (DB ID ${closestJobLocation.databaseId}){MAINCOLOUR} for the {jobYellow}${getJobData(closestJobLocation.jobIndex).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function toggleJobLocationEnabledCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));

	closestJobLocation.enabled = !closestJobLocation.enabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(closestJobLocation.enabled)} location {ALTCOLOUR}${closestJobLocation.databaseId} {MAINCOLOUR}for the {jobYellow}${getJobData(closestJobLocation.jobIndex).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function toggleJobEnabledCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	getJobData(jobId).enabled = !getJobData(jobId).enabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}${getEnabledDisabledFromBool(getJobData(jobId).enabled)}{MAINCOLOUR} the {jobYellow}${getJobData(jobId).name} {MAINCOLOUR}job`);
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
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!areThereEnoughParams(params, 4, " ")) {
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

function setJobNameCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!areThereEnoughParams(params, 4, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
	}

	let newName = params;
	let oldName = getJobData(jobId).name;

	getJobData(jobId).name = newName;
	getJobData(jobId).needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set job {jobYellow}${oldName}'s{MAINCOLOUR} name to {jobYellow}${newName}{MAINCOLOUR}`);
}

// ===========================================================================

function setJobBlipCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!areThereEnoughParams(params, 2, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(getParam(params, " ", 1)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;
	let blipParam = getParam(params, " ", 2);

	let blipId = getJobData(jobId).blipModel;
	let blipString = "unchanged";

	if (isNaN(blipParam)) {
		if (toLowerCase(blipParam) == "none") {
			blipId = -1;
		} else {
			if (isNull(gameData.blipSprites[getGame()][blipParam])) {
				let blipTypes = Object.keys(gameData.blipSprites[getGame()]);
				let chunkedList = splitArrayIntoChunks(blipTypes, 10);

				messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBlipTypes")));
				for (let i in chunkedList) {
					messagePlayerInfo(client, chunkedList[i].join(", "));
				}
			} else {
				blipId = gameData.blipSprites[getGame()][blipParam];
				blipString = toString(blipParam);
			}
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
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!areThereEnoughParams(params, 2, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(getParam(params, " ", 1)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;
	let pickupParam = getParam(params, " ", 2);

	let pickupId = getJobData(jobId).pickupModel;
	let pickupString = "none";

	if (isNaN(pickupParam)) {
		if (toLowerCase(pickupParam) == "none") {
			pickupId = -1;
		} else {
			if (isNull(gameData.pickupModels[getGame()][pickupParam])) {
				messagePlayerError(client, "Invalid pickup type! Use a pickup type name or a model ID");
				let pickupTypes = Object.keys(gameData.pickupModels[getGame()]);
				let chunkedList = splitArrayIntoChunks(pickupTypes, 10);

				messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderPickupTypes")));
				for (let i in chunkedList) {
					messagePlayerInfo(client, chunkedList[i].join(", "));
				}
				return false;
			} else {
				pickupId = gameData.pickupModels[getGame()][pickupParam];
				pickupString = toString(pickupParam);
			}
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

function setPlayerJobRankCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobIndex = getPlayerJob(client);

	if (getJobData(jobIndex) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (!doesPlayerHaveJobPermission(client, getJobFlagValue("SetRank"))) {
		messagePlayerError(client, getLocaleString(client, "JobRankTooLow"));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let rankIndex = getJobRankFromParams(jobIndex, getParam(params, " ", 2));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (rankIndex == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidJobRank"));
		return false;
	}

	if (getJobRankData(jobIndex, rankIndex) == false) {
		messagePlayerError(client, getLocaleString(client, "InvalidJobRank"));
		return false;
	}

	getPlayerCurrentSubAccount(targetClient).jobRankIndex = rankIndex;
	getPlayerCurrentSubAccount(targetClient).jobRank = getJobRankData(jobIndex, rankIndex).databaseId;

	messagePlayerSuccess(client, `You set {ALTCOLOUR}${getCharacterFullName(targetClient)}'s{MAINCOLOUR} job rank to {ALTCOLOUR}${getJobRankData(jobIndex, rankIndex).name} (level ${getJobRankData(jobIndex, rankIndex).level}){MAINCOLOUR}`);
	messagePlayerAlert(targetClient, `{ALTCOLOUR}${getCharacterFullName(client)}{MAINCOLOUR} set your job rank to {ALTCOLOUR}${getJobRankData(jobIndex, rankIndex).name} (level ${getJobRankData(jobIndex, rankIndex).level}){MAINCOLOUR}`);
}

// ===========================================================================

function toggleJobRouteEnabledCommand(command, params, client) {
	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	let clients = getClients();
	for (let i in clients) {
		if (isPlayerWorking(clients[i])) {
			if (isPlayerOnJobRoute(clients[i])) {
				if (getPlayerJob(clients[i]) == jobId && getPlayerJobRoute(clients[i]) == jobRoute) {
					stopJobRoute(clients[i], true, false);
					messagePlayerAlert(clients[i], getLocaleString(clients[i], "CurrentJobRouteDeleted"));
				}
			}
		}
	}

	getJobData(jobId).routes[jobRoute].enabled = !getJobData(jobId).routes[jobRoute].enabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(getJobRouteData(jobId, jobRoute).enabled)} route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteNameCommand(command, params, client) {
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
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
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);
	let delay = getParam(params, " ", 1);

	if (isNaN(delay)) {
		messagePlayerError(client, getLocaleString(client, "TimeNotNumber"))
		return false;
	}

	for (let i in getJobData(jobId).routes[jobRoute].locations) {
		getJobData(jobId).routes[jobRoute].locations[i].stopDelay = toInteger(delay);
		getJobData(jobId).routes[jobRoute].locations[i].needsSaved = true;
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set route {ALTCOLOUR}${getJobData(jobId).routes[jobRoute].name}{MAINCOLOUR} location's stop delays to {ALTCOLOUR}${delay / 1000}{MAINCOLOUR} seconds for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteNextLocationDelayCommand(command, params, client) {
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);
	let delay = getParam(params, " ", 1);

	if (isNaN(delay)) {
		messagePlayerError(client, getLocaleString(client, "TimeNotNumber"))
		return false;
	}

	getPlayerData(client).jobRouteEditNextLocationDelay = delay;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the stop delay to {ALTCOLOUR}${delay / 1000}{MAINCOLOUR} seconds for the next location on route {ALTCOLOUR}${getJobData(jobId).routes[jobRoute].name}{MAINCOLOUR} for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteNextLocationArriveMessageCommand(command, params, client) {
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);
	let message = params;

	getPlayerData(client).jobRouteEditNextLocationArriveMessage = message;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the arrival message for the next location on route {ALTCOLOUR}${getJobData(jobId).routes[jobRoute].name}{MAINCOLOUR} for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job to {ALTCOLOUR}"${message}"{MAINCOLOUR}`);
}

// ===========================================================================

function setJobRouteNextLocationGotoMessageCommand(command, params, client) {
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);
	let message = params;

	getPlayerData(client).jobRouteEditNextLocationGotoMessage = message;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the goto message for the next location on route {ALTCOLOUR}${getJobData(jobId).routes[jobRoute].name}{MAINCOLOUR} for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job to {ALTCOLOUR}"${message}"{MAINCOLOUR}`);
}

// ===========================================================================

function setJobRouteNextLocationTypeCommand(command, params, client) {
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);
	let typeId = getJobRouteLocationTypeFromParams(params);

	if (typeId == -1) {
		messagePlayerError(client, `{ALTCOLOUR}${params}{MAINCOLOUR} is not a valid job route location type`);
		let nameList = jobRouteLocationTypes[getGame()].map((jobRouteLocationType) => { return jobRouteLocationType[1]; });
		let chunkedList = splitArrayIntoChunks(nameList, 10);
		messagePlayerNormal(client, makeChatBoxSectionHeader("Job Route Location Types"));
		for (let i in chunkedList) {
			messagePlayerInfo(client, chunkedList[i].join(", "));
		}
		return false;
	}

	getPlayerData(client).jobRouteEditNextLocationType = type;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the type for the next location on route {ALTCOLOUR}${getJobData(jobId).routes[jobRoute].name}{MAINCOLOUR} for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job to {ALTCOLOUR}${getJobRouteLocationTypeName(typeId)}{MAINCOLOUR}`);
}

// ===========================================================================

function setJobRouteVehicleColoursCommand(command, params, client) {
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
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
	for (let i in clients) {
		if (isPlayerWorking(clients[i])) {
			if (isPlayerOnJobRoute(clients[i])) {
				if (getPlayerJob(clients[i]) == jobId && getPlayerJobRoute(clients[i]) == jobRoute) {
					setVehicleColours(getPlayerVehicle(clients[i]), toInteger(colour1), toInteger(colour2), 1, 1);
					messagePlayerAlert(clients[i], getLocaleString(client, "CurrentJobRouteVehicleColoursChanged"));
				}
			}
		}
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} set the vehicle colours to {ALTCOLOUR}${colour1}, ${colour2}{MAINCOLOUR} for route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name} {MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteFinishMessageCommand(command, params, client) {
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
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
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
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
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);
	let jobRouteLocation = getPlayerJobRouteLocation(client);

	getJobData(jobId).routes[jobRoute].locations[jobRouteLocation].position = position;
	getJobData(jobId).routes[jobRoute].locations[jobRouteLocation].needsSaved = true;
	showCurrentJobLocation(client);
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR} ${getEnabledDisabledFromBool(getJobData(jobId).enabled)} set the position for location ${getJobRouteLocationData(jobId, jobRoute, jobRouteLocation).name} on route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name} {MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name} {MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteDefaultLocationArriveMessageCommand(command, params, client) {
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	getJobData(jobId).routes[jobRoute].locationArriveMessage = params;
	getJobData(jobId).routes[jobRoute].needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(getJobData(jobId).enabled)} set the location arrival message to {ALTCOLOUR}"${params}"{MAINCOLOUR} for route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name} {MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name} {MAINCOLOUR} job`);
}

// ===========================================================================

function setJobRouteDefaultLocationNextMessageCommand(command, params, client) {
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
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
	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerJobRoute(client);

	let amount = getParam(params, " ", 1);

	if (isNaN(amount)) {
		getLocaleString(client, "MustBeNumber");
		return false;
	}

	getJobData(jobId).routes[jobRoute].pay = toInteger(amount);
	getJobData(jobId).routes[jobRoute].needsSaved = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR} set the pay for route {ALTCOLOUR}${getJobRouteData(jobId, jobRoute).name}{MAINCOLOUR} of the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job to {ALTCOLOUR}${getCurrencyString(amount)} {MAINCOLOUR} `);
}

// ===========================================================================

function toggleJobWhiteListCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	getJobData(jobId).whiteListEnabled = !getJobData(jobId).whiteListEnabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR}${getEnabledDisabledFromBool(getJobData(jobId).whiteListEnabled)}{MAINCOLOUR} the whitelist for the {ALTCOLOUR}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function toggleJobBlackListCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getJobFromParams(params) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	getJobData(jobId).blackListEnabled = !getJobData(jobId).blackListEnabled;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} ${getEnabledDisabledFromBool(getJobData(jobId).blackListEnabled)} the blacklist for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function addPlayerToJobBlackListCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let jobId = getJobFromParams(getParam(params, " ", 2)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (isPlayerOnJobBlackList(targetClient, jobId)) {
		messagePlayerError(client, `That player is already blacklisted from that job!`);
		return false;
	}

	addPlayerToJobBlackList(targetClient, jobId);
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR} added {ALTCOLOUR}${getCharacterFullName(targetClient)} {MAINCOLOUR} to the blacklist for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function removePlayerFromJobBlackListCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let jobId = getJobFromParams(getParam(params, " ", 2)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (!isPlayerOnJobBlackList(targetClient, jobId)) {
		messagePlayerError(client, `That player is not blacklisted from that job!`);
		return false;
	}

	removePlayerFromJobBlackList(targetClient, jobId);
	messageAdmins(`{adminOrange}${getPlayerName(client)} {MAINCOLOUR} removed {ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR} from the blacklist for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function addPlayerToJobWhiteListCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let jobId = getJobFromParams(getParam(params, " ", 2)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (isPlayerOnJobWhiteList(targetClient, jobId)) {
		messagePlayerError(client, `That player is already whitelisted from that job!`);
		return false;
	}

	addPlayerToJobWhiteList(targetClient, jobId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} added {ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR} to the whitelist for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function removePlayerFromJobWhiteListCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let jobId = getJobFromParams(getParam(params, " ", 2)) || getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client)).jobIndex;

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (!isPlayerOnJobWhiteList(targetClient, jobId)) {
		messagePlayerError(client, `That player is not whitelisted from that job!`);
		return false;
	}

	removePlayerFromJobWhiteList(targetClient, jobId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} removed {ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR} from the whitelist for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);
}

// ===========================================================================

function forceAllPlayersToStopWorking() {
	getClients().forEach(function (client) {
		if (!client.console) {
			stopWorking(client);
		}
	});
}

// ===========================================================================

function jobStartRouteCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, getLocaleString(client, "NotAllowedToUseJobs"));
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (getJobData(getPlayerJob(client)).routes.length == 0) {
		messagePlayerError(client, getLocaleString(client, "NoJobRoutesForLocation"));
		return false;
	}

	if (!isPlayerInAnyVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "MustBeInAVehicle"));
		return false;
	}

	if (!isPlayerInJobVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeInJobVehicle"));
		return false;
	}

	if (isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "AlreadyOnJobRoute", "{ALTCOLOUR}/stoproute{MAINCOLOUR}"));
		return false;
	}

	if (getCurrentUnixTimestamp() - getPlayerData(client).lastJobRouteStart < globalConfig.jobRouteStartCooldown) {
		messagePlayerError(client, getLocaleString(client, "WaitForJobRouteStart", `{ALTCOLOUR}${getGroupedLocaleString(client, "TimeMeasurements", "Seconds", getCurrentUnixTimestamp() - getPlayerData(client).lastJobRouteStart)}{MAINCOLOUR}`));
		return false;
	}

	let forceRoute = -1;
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageJobs"))) {
		if (!areParamsEmpty(params)) {
			let tempRoute = getJobRouteFromParams(params, getPlayerJob(client));
			if (tempRoute != false) {
				forceRoute = tempRoute;
			}
		}
	}

	markPlayerActionTipSeen(client, "JobRouteStart");

	getPlayerData(client).jobRouteStartCooldown = getCurrentUnixTimestamp();
	startJobRoute(client, forceRoute);
	return true;
}

// ===========================================================================

function jobStopRouteCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, getLocaleString(client, "NotAllowedToUseJobs"));
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, "You aren't working yet! Use /startwork first.");
		return false;
	}

	//if(!doesPlayerHaveJobType(client, V_JOB_BUS) && !doesPlayerHaveJobType(client, V_JOB_GARBAGE)) {
	//	messagePlayerError(client, "Your job doesn't use a route!");
	//    return false;
	//}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, "You aren't on a job route!");
		return false;
	}

	if (!getJobRouteData(getPlayerJob(client), getPlayerJobRoute(client)).enabled) {
		setAllJobDataIndexes();
		getJobRouteData(getPlayerJob(client), getPlayerJobRoute(client)).enabled = true;
	}

	stopJobRoute(client, false, false);
	return true;
}

// ===========================================================================

function isPlayerInJobVehicle(client) {
	if (getPlayerVehicle(client) != null) {
		let vehicle = getPlayerVehicle(client);
		if (isVehicleOwnedByJob(vehicle, getPlayerCurrentSubAccount(client).job)) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function isPlayerWorking(client) {
	if (!getPlayerCurrentSubAccount(client)) {
		return false;
	}
	return getPlayerCurrentSubAccount(client).isWorking;
}

// ===========================================================================

function startJobRoute(client, forceRoute = -1) {
	let jobId = getPlayerJob(client);
	let jobRoute = 0;

	if (forceRoute == -1) {
		jobRoute = getRandomJobRouteForLocation(getClosestJobLocationForJob(getPlayerPosition(client), jobId));
	} else {
		jobRoute = forceRoute;
	}

	if (jobRoute == -1) {
		messagePlayerError(client, getLocaleString(client, "NoJobRoutesForLocation"));
		return false;
	}

	logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} is starting job route ${getJobRouteData(jobId, jobRoute).name} (${jobRoute}) for the ${getJobData(jobId).name}(${jobId}) job`);

	getPlayerData(client).jobRoute = jobRoute;
	getPlayerData(client).jobRouteLocation = 0;
	getPlayerData(client).jobRouteVehicle = getPlayerVehicle(client);

	if (isGameFeatureSupported("vehicleColour")) {
		getPlayerVehicle(client).colour1 = getJobRouteData(jobId, jobRoute).vehicleColour1;
		getPlayerVehicle(client).colour2 = getJobRouteData(jobId, jobRoute).vehicleColour2;
	}

	messagePlayerNormal(client, replaceJobRouteStringsInMessage(getJobRouteData(jobId, jobRoute).startMessage, jobId, jobRoute));

	showSmallGameMessage(client, replaceJobRouteStringsInMessage(removeColoursInMessage(getJobRouteData(jobId, getPlayerJobRoute(client)).locationGotoMessage), jobId, getPlayerJobRoute(client)), getJobData(jobId).colour, 3500);

	// Don't announce routes that an admin just created
	if (forceRoute == -1) {
		messageDiscordEventChannel(`💼 ${getCharacterFullName(client)} started the ${getJobRouteData(jobId, jobRoute).name} route for the ${getJobData(jobId).name} job`);
	}

	if (getJobRouteData(jobId, jobRoute).locations.length > 0) {
		showCurrentJobLocation(client);
	} else {
		messagePlayerError(client, `There are no locations for this route.`);
	}
}

// ===========================================================================

function stopJobRoute(client, successful = false, alertPlayer = true) {
	logToConsole(LOG_DEBUG, `[V.RP.Job] Stopping job route for player ${getPlayerDisplayForConsole(client)} ...`);

	if (!isPlayerOnJobRoute(client)) {
		logToConsole(LOG_DEBUG | LOG_WARN, `[V.RP.Job] Aborting stop job route for player ${getPlayerDisplayForConsole(client)}. Player is not on job route`);
		return false;
	}

	let jobId = getPlayerJob(client);
	let routeId = getPlayerJobRoute(client);

	let jobData = getJobData(jobId);
	let jobRouteData = getJobRouteData(jobId, routeId);

	if (successful == true) {
		if (alertPlayer) {
			messagePlayerAlert(client, replaceJobRouteStringsInMessage(jobRouteData.finishMessage, jobId, routeId));
		}

		finishSuccessfulJobRoute(client);
		return false;
	}

	if (alertPlayer) {
		messageDiscordEventChannel(`💼 ${getCharacterFullName(client)} failed to finish the ${jobRouteData.name} route for the ${jobData.name} job and didn't earn anything.`);
	}

	//if (alertPlayer) {
	//	messagePlayerAlert(client, replaceJobRouteStringsInMessage(getJobRouteData(jobId, routeId).failedMessage, jobId, routeId));
	//}

	stopReturnToJobVehicleCountdown(client);
	sendPlayerStopJobRoute(client);
	removePedFromVehicle(getPlayerPed(client));
	let vehicle = getPlayerData(client).jobRouteVehicle;
	setTimeout(function () {
		respawnVehicle(vehicle);
	}, 1000);

	getPlayerData(client).jobRouteVehicle = null;
	getPlayerData(client).jobRoute = -1;
	getPlayerData(client).jobRouteLocation = -1;
}

// ===========================================================================

function isPlayerOnJobRoute(client) {
	if (getPlayerData(client).jobRoute != -1) {
		return true;
	}

	return false;
}

// ===========================================================================

function getPlayerJobRouteVehicle(client) {
	if (!isPlayerOnJobRoute(client)) {
		return false;
	}

	return getPlayerData(client).jobRouteVehicle;
}

// ===========================================================================

function startReturnToJobVehicleCountdown(client) {
	if (client == null) {
		return false;
	}

	if (getPlayerData(client) == null) {
		return false;
	}

	getPlayerData(client).returnToJobVehicleTick = globalConfig.returnToJobVehicleTime;
	getPlayerData(client).returnToJobVehicleTimer = setInterval(function () {
		//logToConsole(LOG_DEBUG, getPlayerData(client).returnToJobVehicleTick);
		if (getPlayerData(client).returnToJobVehicleTick > 0) {
			getPlayerData(client).returnToJobVehicleTick = getPlayerData(client).returnToJobVehicleTick - 1;
			//logToConsole(LOG_WARN, `You have ${getPlayerData(client).returnToJobVehicleTick} seconds to return to your job vehicle!`);
			showSmallGameMessage(client, `You have ${getPlayerData(client).returnToJobVehicleTick} seconds to return to your job vehicle!`, getColourByName("softRed"), 1500);
		} else {
			if (getPlayerData(client).returnToJobVehicleTimer != null) {
				clearInterval(getPlayerData(client).returnToJobVehicleTimer);
			}
			getPlayerData(client).returnToJobVehicleTimer = null;
			getPlayerData(client).returnToJobVehicleTick = 0;
			stopJobRoute(client, false, true);
		}
	}, 1000);
}

// ===========================================================================

function stopReturnToJobVehicleCountdown(client) {
	logToConsole(LOG_DEBUG, `[V.RP.Job] Stopping job route vehicle countdown for player ${getPlayerDisplayForConsole(client)} ...`);
	if (getPlayerData(client).returnToJobVehicleTimer != null) {
		clearInterval(getPlayerData(client).returnToJobVehicleTimer);
		getPlayerData(client).returnToJobVehicleTimer = null;
		logToConsole(LOG_DEBUG, `[V.RP.Job] Stopped job route vehicle countdown for player ${getPlayerDisplayForConsole(client)}.`);
	} else {
		logToConsole(LOG_DEBUG, `[V.RP.Job] Aborting stop job route vehicle countdown for player ${getPlayerDisplayForConsole(client)} ... Player doesnt have a countdown.`);
	}

	//getPlayerData(client).returnToJobVehicleTick = 0;
}

// ===========================================================================

function canPlayerUseJob(client, jobId) {
	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageJobs"))) {
		return true;
	}

	if (getJobData(jobId) == null) {
		return false;
	}

	if (isJobWhiteListed(jobId)) {
		if (!isPlayerOnJobWhiteList(client, jobId)) {
			return false;
		}
	}

	if (!isJobBlackListed(jobId)) {
		if (isPlayerOnJobBlackList(client, jobId)) {
			return false;
		}
	}

	// Check if lowest rank is public rank
	let lowestRank = getLowestJobRank(jobId);
	if (getJobRankData(jobId, lowestRank).public == false) {
		return false;
	}

	return true;
}

// ===========================================================================

function deleteJobLocation(jobIndex, jobLocationIndex, whoDeleted = defaultNoAccountId) {
	if (getJobLocationData(jobIndex, jobLocationIndex).databaseId > 0) {
		quickDatabaseQuery(`UPDATE job_loc SET job_loc_deleted = 1, job_loc_who_deleted = ${whoDeleted}, job_loc_when_deleted = UNIX_TIMESTAMP() WHERE job_loc_id = ${getJobLocationData(jobIndex, jobLocationIndex).databaseId}`);
	}

	deleteJobLocationBlip(jobIndex, jobLocationIndex);
	deleteJobLocationPickup(jobIndex, jobLocationIndex);
	getJobData(getJobIdFromDatabaseId(jobIndex)).locations.splice(jobLocationIndex, 1);
	setAllJobDataIndexes();

	if (!isGameFeatureSupported("serverElements")) {
		sendJobToPlayer(client, jobIndex, true, -1, "", toVector3(0.0, 0.0, 0.0), -1, -1, doesJobHavePublicRank(jobIndex), 0);
	}
}

// ===========================================================================

function freezePlayerJobVehicleForRouteLocation(client) {
	if (getPlayerVehicle(client) == null) {
		return false;
	}

	getVehicleData(getPlayerVehicle(client)).engine = false;
	setVehicleEngine(getPlayerVehicle(client), getVehicleData(getPlayerVehicle(client)).engine);
	//setPlayerControlState(client, false);
}

// ===========================================================================

function unFreezePlayerJobVehicleForRouteLocation(client) {
	if (getPlayerVehicle(client) == null) {
		return false;
	}

	getVehicleData(getPlayerVehicle(client)).engine = true;
	setVehicleEngine(getPlayerVehicle(client), getVehicleData(getPlayerVehicle(client)).engine);
	//setPlayerControlState(client, true);
}

// ===========================================================================

function getJobIdFromDatabaseId(databaseId) {
	for (let i in serverData.jobs) {
		if (serverData.jobs[i].databaseId == databaseId) {
			return i;
		}
	}
	return false;
}

// ===========================================================================

function setAllJobDataIndexes() {
	for (let i in serverData.jobs) {
		serverData.jobs[i].index = i;
		for (let j in serverData.jobs[i].locations) {
			serverData.jobs[i].locations[j].index = j;
			serverData.jobs[i].locations[j].jobIndex = i;

			for (let u in serverData.jobs[i].routes) {
				if (serverData.jobs[i].routes[u].locationId == serverData.jobs[i].locations[j].databaseId) {
					serverData.jobs[i].locations[j].routeCache.push(u);
				}
			}
		}

		for (let k in serverData.jobs[i].uniforms) {
			serverData.jobs[i].uniforms[k].index = k;
			serverData.jobs[i].uniforms[k].jobIndex = i;
		}

		for (let m in serverData.jobs[i].equipment) {
			serverData.jobs[i].equipment[m].index = m;
			serverData.jobs[i].equipment[m].jobIndex = i;
			for (let n in serverData.jobs[i].equipment[m].items) {
				serverData.jobs[i].equipment[m].items[n].index = n;
				serverData.jobs[i].equipment[m].items[n].jobIndex = i;
				serverData.jobs[i].equipment[m].items[n].equipmentIndex = m;
			}
		}

		for (let o in serverData.jobs[i].blackList) {
			serverData.jobs[i].blackList[o].index = o;
			serverData.jobs[i].blackList[o].jobIndex = i;
		}

		for (let v in serverData.jobs[i].whiteList) {
			serverData.jobs[i].whiteList[v].index = v;
			serverData.jobs[i].whiteList[v].jobIndex = i;
		}

		for (let t in serverData.jobs[i].routes) {
			serverData.jobs[i].routes[t].index = t;
			serverData.jobs[i].routes[t].jobIndex = i;
		}
	}
}

// ===========================================================================

function createJobLocation(jobId, position, interior, dimension, whoAdded) {
	let jobLocationData = new JobLocationData(false);
	jobLocationData.position = position;
	jobLocationData.jobId = getJobData(jobId).databaseId;
	jobLocationData.interior = interior;
	jobLocationData.dimension = dimension;
	jobLocationData.enabled = true;
	jobLocationData.jobIndex = jobId;
	jobLocationData.needsSaved = true;
	jobLocationData.whoAdded = whoAdded;
	jobLocationData.whenAdded = getCurrentUnixTimestamp();

	serverData.jobs[jobId].locations.push(jobLocationData);
	let newSlot = serverData.jobs[jobId].locations.length - 1;
	serverData.jobs[jobId].locations[newSlot].index = newSlot;
	spawnJobLocationPickup(jobId, newSlot);
	spawnJobLocationBlip(jobId, newSlot);
	saveJobLocationToDatabase(jobLocationData);
}

// ===========================================================================

function saveJobToDatabase(jobData) {
	if (serverConfig.devServer) {
		return false;
	}

	if (jobData == null) {
		// Invalid job data
		return false;
	}

	if (jobData.databaseId == -1) {
		// Temp job, no need to save
		return false;
	}

	if (jobData.needsSaved == false) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job ${jobData.name} doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saving job ${jobData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
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
			["job_radio_freq", jobData.radioFrequency],
			["job_wl", jobData.whiteListEnabled],
			["job_bl", jobData.blackListEnabled],
			["job_who_added", jobData.whoAdded],
			["job_when_added", jobData.whenAdded],
		];

		let dbQuery = null;
		if (jobData.databaseId == 0) {
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
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saved job ${jobData.name} to database!`);

	return false;
}

// ===========================================================================

function saveJobRankToDatabase(jobRankData) {
	if (serverConfig.devServer) {
		// Dev server, don't save
		return false;
	}

	if (!jobRankData) {
		// Invalid job route data
		return false;
	}

	if (jobRankData.needsSaved == false) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job route ${jobRankData.name} (DB ID ${jobRankData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saving job route ${jobRankData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobRankData.name);

		let data = [
			["job_rank_job", jobRankData.jobId],
			["job_rank_enabled", boolToInt(jobRankData.enabled)],
			["job_rank_name", safeName],
			["job_rank_flags", jobRankData.flags],
			["job_rank_pay", jobRankData.pay],
			["job_rank_level", jobRankData.level],
			["job_rank_who_added", jobRankData.whoAdded],
			["job_rank_when_added", jobRankData.whenAdded],
			["job_rank_public", boolToInt(jobRankData.public)],
		];

		let dbQuery = null;
		if (jobRankData.databaseId == 0) {
			let queryString = createDatabaseInsertQuery("job_rank", data);
			dbQuery = queryDatabase(dbConnection, queryString);
			jobRankData.databaseId = getDatabaseInsertId(dbConnection);
		} else {
			let queryString = createDatabaseUpdateQuery("job_rank", data, `job_rank_id=${jobRankData.databaseId}`);
			dbQuery = queryDatabase(dbConnection, queryString);
		}
		jobRankData.needsSaved = false;

		freeDatabaseQuery(dbQuery);
		disconnectFromDatabase(dbConnection);
		return true;
	}
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saved job rank ${jobRankData.name} to database!`);

	return false;
}

// ===========================================================================

/**
 * Saves a job route to database
 *
 * @param {JobRouteData} jobRouteData - The data of the job route
 * @return {boolean} Whether the data saved (true) or not (false)
 *
 */
function saveJobRouteToDatabase(jobRouteData) {
	if (serverConfig.devServer) {
		// Dev server, don't save
		return false;
	}

	if (!jobRouteData) {
		// Invalid job route data
		return false;
	}

	if (jobRouteData.needsSaved == false) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job route ${jobRouteData.name} (DB ID ${jobRouteData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saving job route ${jobRouteData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
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
			["job_route_loc_goto_msg", safeLocationNextMessage],
			["job_route_pay", jobRouteData.pay],
			["job_route_detail", jobRouteData.detail],
			["job_route_who_added", jobRouteData.whoAdded],
			["job_route_when_added", jobRouteData.whenAdded],
		];

		let dbQuery = null;
		if (jobRouteData.databaseId == 0) {
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
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saved job route ${jobRouteData.name} to database!`);

	return false;
}

// ===========================================================================

/**
 * Saves a job route location to database
 *
 * @param {JobRouteLocationData} jobRouteLocationData - The data of the job route location
 * @return {boolean} Whether the data saved (true) or not (false)
 *
 */
function saveJobRouteLocationToDatabase(jobRouteLocationData) {
	if (serverConfig.devServer) {
		// Dev server, don't save
		return false;
	}

	if (!jobRouteLocationData) {
		// Invalid job route position data
		return false;
	}

	if (jobRouteLocationData.needsSaved == false) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job route location ${jobRouteLocationData.name} (DB ID ${jobRouteLocationData.index}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saving job route location ${jobRouteLocationData.name} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobRouteLocationData.name);
		let safeArriveMessage = escapeDatabaseString(dbConnection, jobRouteLocationData.arriveMessage);
		let safeGotoMessage = escapeDatabaseString(dbConnection, jobRouteLocationData.gotoMessage);

		let data = [
			["job_route_loc_route", jobRouteLocationData.routeId],
			["job_route_loc_enabled", boolToInt(jobRouteLocationData.enabled)],
			["job_route_loc_name", safeName],
			["job_route_loc_x", jobRouteLocationData.position.x],
			["job_route_loc_y", jobRouteLocationData.position.y],
			["job_route_loc_z", jobRouteLocationData.position.z],
			["job_route_loc_pay", jobRouteLocationData.pay],
			["job_route_loc_delay", jobRouteLocationData.stopDelay],
			["job_route_loc_who_added", jobRouteLocationData.whoAdded],
			["job_route_loc_when_added", jobRouteLocationData.whenAdded],
			["job_route_loc_vw", jobRouteLocationData.dimension],
			["job_route_loc_int", jobRouteLocationData.interior],
			["job_route_loc_goto_msg", safeGotoMessage],
			["job_route_loc_arrive_msg", safeArriveMessage],
		];

		let dbQuery = null;
		if (jobRouteLocationData.databaseId == 0) {
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
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saved job route location ${jobRouteLocationData.name} (${jobRouteLocationData.index}) to database!`);

	return false;
}

// ===========================================================================

/**
 * Saves a job location to database
 *
 * @param {JobLocationData} jobLocationData - The data of the job location
 * @return {boolean} Whether the data saved (true) or not (false)
 *
 */
function saveJobLocationToDatabase(jobLocationData) {
	if (serverConfig.devServer) {
		// Dev server, don't save
		return false;
	}

	if (jobLocationData == null) {
		// Invalid job location data
		return false;
	}

	if (!jobLocationData.needsSaved) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job location ${jobLocationData.name} (${jobLocationData.databaseId}) doesn't need saved. Skipping ...`);
		return false;
	}

	if (jobLocationData.databaseId == -1) {
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saving job location ${jobLocationData.databaseId} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let data = [
			["job_loc_job", jobLocationData.jobId],
			["job_loc_enabled", boolToInt(jobLocationData.enabled)],
			["job_loc_pos_x", jobLocationData.position.x],
			["job_loc_pos_y", jobLocationData.position.y],
			["job_loc_pos_z", jobLocationData.position.z],
			["job_loc_int", jobLocationData.interior],
			["job_loc_vw", jobLocationData.dimension],
			["job_loc_who_added", jobLocationData.whoAdded],
			["job_loc_when_added", jobLocationData.whenAdded],
		];

		let dbQuery = null;
		if (jobLocationData.databaseId == 0) {
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

	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saved job location ${jobLocationData.databaseId} to database`);

	return false;
}

// ===========================================================================

/**
 * Saves a job equipment to database
 *
 * @param {JobEquipmentData} jobEquipmentData - The data of the job equipment
 * @return {boolean} Whether the data saved (true) or not (false)
 *
 */
function saveJobEquipmentToDatabase(jobEquipmentData) {
	if (serverConfig.devServer) {
		// Dev server, don't save
		return false;
	}

	if (jobEquipmentData == null) {
		// Invalid job equipment data
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job equipment ${jobEquipmentData.index} is invalid. Skipping ...`);
		return false;
	}

	if (!jobEquipmentData.needsSaved) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job equipment ${jobEquipmentData.name} (${jobEquipmentData.index}) doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saving job equipment ${jobEquipmentData.index} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobEquipmentData.name);
		let data = [
			["job_equip_job", jobEquipmentData.job],
			["job_equip_enabled", boolToInt(jobEquipmentData.enabled)],
			["job_equip_minrank", jobLocationData.requiredRank],
			["job_equip_name", safeName],
			["job_equip_who_added", jobEquipmentData.whoAdded],
			["job_equip_when_added", jobEquipmentData.whenAdded],
		];

		let dbQuery = null;
		if (jobEquipmentData.databaseId == 0) {
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
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saved job equipment ${jobEquipmentData.index} to database`);

	return false;
}

// ===========================================================================

/**
 * Saves a job equipment item to database
 *
 * @param {JobEquipmentItemData} jobEquipmentItemData - The data of the job equipment item
 * @return {boolean} Whether the data saved (true) or not (false)
 *
 */
function saveJobEquipmentItemToDatabase(jobEquipmentItemData) {
	if (serverConfig.devServer) {
		// Dev server, don't save
		return false;
	}

	if (jobEquipmentItemData == null) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job equipment item ${jobEquipmentItemData.index} is invalid. Skipping ...`);
		// Invalid job equipment weapon data
		return false;
	}

	if (!jobEquipmentItemData.needsSaved) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job equipment item ${jobEquipmentItemData.index} doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saving job equipment weapon ${jobEquipmentItemData.index} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let data = [
			["job_equip_item_equip", jobEquipmentItemData.equipmentId],
			["job_equip_item_enabled", boolToInt(jobEquipmentItemData.enabled)],
			["job_equip_item_type", jobEquipmentItemData.itemType],
			["job_equip_item_value", jobEquipmentItemData.value],
			["job_equip_item_who_added", jobEquipmentItemData.whoAdded],
			["job_equip_item_when_added", jobEquipmentItemData.whenAdded],
		];

		let dbQuery = null;
		if (jobEquipmentItemData.databaseId == 0) {
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
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saved job equipment weapon ${jobEquipmentItemData.index} to database`);

	return false;
}

// ===========================================================================

/**
 * Saves a job uniform to database
 *
 * @param {JobUniformData} jobUniformData - The data of the job uniform
 * @return {boolean} Whether the data saved (true) or not (false)
 *
 */
function saveJobUniformToDatabase(jobUniformData) {
	if (serverConfig.devServer) {
		// Dev server, don't save
		return false;
	}

	if (jobUniformData == null) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job uniform ${jobUniformData.index} is invalid. Skipping ...`);
		return false;
	}

	if (jobUniformData.needSaved == false) {
		logToConsole(LOG_DEBUG, `[V.RP.Job]: Job uniform ${jobUniformData.index} doesn't need saved. Skipping ...`);
		return false;
	}

	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saving job uniform ${jobUniformData.index} to database ...`);
	let dbConnection = connectToDatabase();
	if (dbConnection) {
		let safeName = escapeDatabaseString(dbConnection, jobUniformData.name);
		let data = [
			["job_uniform_job", jobUniformData.job],
			["job_uniform_enabled", boolToInt(jobUniformData.enabled)],
			["job_uniform_minrank", jobUniformData.requiredRank],
			["job_uniform_name", safeName],
			["job_uniform_skin", jobUniformData.skin],
			["job_uniform_who_added", jobUniformData.whoAdded],
			["job_uniform_when_added", jobUniformData.whenAdded],
		];

		let dbQuery = null;
		if (jobUniformData.databaseId == 0) {
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
	logToConsole(LOG_DEBUG, `[V.RP.Job]: Saved job uniform ${jobUniformData.index} to database`);

	return false;
}

// ===========================================================================

function saveAllJobsToDatabase() {
	for (let i in serverData.jobs) {
		saveJobToDatabase(serverData.jobs[i]);

		for (let j in serverData.jobs[i].locations) {
			saveJobLocationToDatabase(serverData.jobs[i].locations[j]);
		}

		for (let k in serverData.jobs[i].uniforms) {
			saveJobUniformToDatabase(serverData.jobs[i].uniforms[k]);
		}

		for (let m in serverData.jobs[i].equipment) {
			saveJobEquipmentToDatabase(serverData.jobs[i].equipment[m]);

			for (let n in serverData.jobs[i].equipment[m].items) {
				saveJobEquipmentItemToDatabase(serverData.jobs[i].equipment[m].items[n]);
			}
		}

		for (let p in serverData.jobs[i].routes) {
			saveJobRouteToDatabase(serverData.jobs[i].routes[p]);

			for (let q in serverData.jobs[i].routes[p].locations) {
				saveJobRouteLocationToDatabase(serverData.jobs[i].routes[p].locations[q]);
			}
		}

		for (let r in serverData.jobs[i].ranks) {
			saveJobRankToDatabase(serverData.jobs[i].ranks[r]);
		}
	}
}

// ===========================================================================

function deleteJobLocationBlip(jobId, locationId) {
	if (getJobData(jobId).locations[locationId].blip != null) {
		deleteGameElement(getJobData(jobId).locations[locationId].blip);
		getJobData(jobId).locations[locationId].blip = null;
	}
}

// ===========================================================================

function deleteJobLocationPickup(jobId, locationId) {
	if (serverData.jobs[jobId].locations[locationId].pickup != null) {
		deleteGameElement(getJobData(jobId).locations[locationId].pickup);
		serverData.jobs[jobId].locations[locationId].pickup = null;
	}
}

// ===========================================================================

function spawnJobLocationPickup(jobId, locationId) {
	if (!serverConfig.createJobPickups) {
		return false;
	}

	let tempJobData = getJobData(jobId);
	let tempJobLocationData = getJobLocationData(jobId, locationId);

	logToConsole(LOG_VERBOSE, `[V.RP.Job]: Creating pickup for location ${locationId} of the ${tempJobData.name} job`);

	if (tempJobData.pickupModel != -1) {
		let pickupModelId = -1;
		if (isGameFeatureSupported("pickup")) {
			pickupModelId = gameData.pickupModels[getGame()].Job;

			if (tempJobData.pickupModel != 0) {
				pickupModelId = tempJobData.pickupModel;
			}
		}

		if (isGameFeatureSupported("serverElements") && (isGameFeatureSupported("pickup") || isGameFeatureSupported("dummyElement"))) {
			let pickup = createGamePickup(pickupModelId, tempJobLocationData.position, gameData.pickupTypes[getGame()].job);
			if (pickup != false) {
				tempJobLocationData.pickup = pickup;
				addToWorld(pickup);
				updateJobPickupLabelData(jobId);
			}
		} else {
			sendJobToPlayer(
				null,
				jobId,
				false,
				getJobData(jobId).name,
				tempJobData.name,
				tempJobLocationData.position,
				getJobLocationBlipModelForNetworkEvent(tempJobData.index),
				getJobLocationPickupModelForNetworkEvent(tempJobData.index),
				doesJobHavePublicRank(jobId),
				tempJobLocationData.dimension
			);
		}
	}
}

// ===========================================================================

function spawnJobLocationBlip(jobId, locationId) {
	if (!serverConfig.createJobBlips) {
		return false;
	}

	if (!isGameFeatureSupported("blip")) {
		return false;
	}

	let tempJobData = getJobData(jobId);

	if (getJobData(jobId).blipModel == -1) {
		return false;
	}

	let blipModelId = gameData.blipSprites[getGame()].Job;

	if (getJobData(jobId).blipModel != 0) {
		blipModelId = getJobData(jobId).blipModel;
	}

	if (isGameFeatureSupported("serverElements") && getGame() != V_GAME_MAFIA_ONE && getGame() != V_GAME_GTA_IV) {
		let blip = createGameBlip(tempJobData.locations[locationId].position, blipModelId, 2, getColourByName("yellow"));
		if (blip != false) {
			tempJobData.locations[locationId].blip = blip;

			if (globalConfig.jobBlipStreamInDistance == -1 || globalConfig.jobBlipStreamOutDistance == -1) {
				blip.netFlags.distanceStreaming = false;
			} else {
				setElementStreamInDistance(blip, globalConfig.jobBlipStreamInDistance);
				setElementStreamOutDistance(blip, globalConfig.jobBlipStreamOutDistance);
			}

			setElementOnAllDimensions(blip, false);
			setElementDimension(blip, tempJobData.locations[locationId].dimension);

			let clients = getClients();
			for (let i in clients) {
				updateJobBlipsForPlayer(clients[i]);
			}
		}
	}
}

// ===========================================================================

function getPlayerJob(client) {
	return getPlayerCurrentSubAccount(client).jobIndex;
}

// ===========================================================================

function getPlayerJobRank(client) {
	return getPlayerCurrentSubAccount(client).jobRankIndex;
}

// ===========================================================================

function doesPlayerHaveAnyJob(client) {
	return (getPlayerJob(client) != -1);
}

// ===========================================================================

function canPlayerUseJobs(client) {
	if (hasBitFlag(getPlayerData(client).accountData.flags.moderation, getModerationFlagValue("JobBanned"))) {
		return false;
	}

	return true;
}

// ===========================================================================

function getJobIndexFromDatabaseId(databaseId) {
	for (let i in serverData.jobs) {
		if (serverData.jobs[i].databaseId == databaseId) {
			return i;
		}
	}
	return false;
}

// ===========================================================================

function getJobRankIndexFromDatabaseId(jobIndex, databaseId) {
	if (jobIndex == -1) {
		return -1;
	}

	if (databaseId == 0) {
		return -1;
	}

	if (typeof serverData.jobs[jobIndex] == "undefined") {
		return -1;
	}

	for (let i in serverData.jobs[jobIndex].ranks) {
		if (serverData.jobs[jobIndex].ranks[i].databaseId == databaseId) {
			return i;
		}
	}

	return -1;
}

// ===========================================================================

function isJobWhiteListed(jobId) {
	return getJobData(jobId).whiteListEnabled;
}

// ===========================================================================

function isPlayerOnJobWhiteList(client, jobId) {
	for (let i in getJobData(jobId).whiteList) {
		if (getJobData(jobId).whiteList[i].subAccount == getPlayerCurrentSubAccount(client).databaseId) {
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
	for (let i in getJobData(jobId).blackList) {
		if (getJobData(jobId).blackList[i].subAccount == getPlayerCurrentSubAccount(client).databaseId) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function playerArrivedAtJobRouteLocation(client) {
	let jobId = getPlayerJob(client);
	let jobRouteId = getPlayerJobRoute(client);
	let jobRouteLocationId = getPlayerJobRouteLocation(client);

	let jobData = getJobData(jobId);
	let jobRouteData = getJobRouteData(jobId, jobRouteId);

	if (!isPlayerOnJobRoute(client)) {
		return false;
	}

	if (isLastLocationOnJobRoute(jobId, jobRouteId, jobRouteLocationId)) {
		finishSuccessfulJobRoute(client);
		return false;
	}

	if (getPlayerJobRouteVehicle(client) != getPlayerVehicle(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeInJobVehicle"));
		return false;
	}

	//hideElementForPlayer(getJobRouteLocationData(jobId, jobRouteId, jobRouteLocationId).marker, client);

	showSmallGameMessage(client, replaceJobRouteStringsInMessage(removeColoursInMessage(getJobRouteLocationData(jobId, jobRouteId, jobRouteLocationId).arriveMessage), jobId, jobRouteId), jobData.colour, 3500);

	switch (getJobRouteLocationData(jobId, jobRouteId, jobRouteLocationId).type) {
		case V_JOB_ROUTE_LOC_TYPE_CHECKPOINT:
			if (getJobRouteLocationData(jobId, jobRouteId, jobRouteLocationId).stopDelay > 0) {
				freezePlayerJobVehicleForRouteLocation(client);
				setVehicleHazardLights(getPlayerVehicle(client), true);
				getPlayerData(client).jobRouteLocation = getNextLocationOnJobRoute(jobId, jobRouteId, jobRouteLocationId);
				setTimeout(function () {
					showCurrentJobLocation(client);
					showSmallGameMessage(client, replaceJobRouteStringsInMessage(removeColoursInMessage(getJobRouteLocationData(jobId, jobRouteId, jobRouteLocationId).gotoMessage), jobId, jobRouteId), jobData.colour, 3500);
					unFreezePlayerJobVehicleForRouteLocation(client);
					setVehicleHazardLights(getPlayerVehicle(client), false);
				}, getJobRouteLocationData(jobId, jobRouteId, jobRouteLocationId).stopDelay);
				createElementForPlayerJobRouteLocation(client, jobId, jobRouteId, jobRouteLocationId);
			} else {
				getPlayerData(client).jobRouteLocation = getNextLocationOnJobRoute(jobId, jobRouteId, jobRouteLocationId);
				showCurrentJobLocation(client);
				showSmallGameMessage(client, replaceJobRouteStringsInMessage(removeColoursInMessage(getJobRouteLocationData(jobId, jobRouteId, jobRouteLocationId).gotoMessage), jobId, jobRouteId), jobData.colour, 3500);
				createElementForPlayerJobRouteLocation(client, jobId, jobRouteId, jobRouteLocationId);
			}
			break;

		case V_JOB_ROUTE_LOC_TYPE_PASSENGER_PICKUP:
			warpPedIntoVehicle(getPlayerData(client).jobRouteLocationElement, getPlayerVehicle(client), getFirstFreeRearVehicleSeat(client));
			getPlayerData(client).jobRouteLocation = getNextLocationOnJobRoute(jobId, jobRouteId, jobRouteLocationId);
			showCurrentJobLocation(client);
			showSmallGameMessage(client, replaceJobRouteStringsInMessage(removeColoursInMessage(jobRouteData.locationNextMessage), jobId, jobRouteId), jobData.colour, 3500);

			createElementForPlayerJobRouteLocation(client, jobId, jobRouteId, jobRouteLocationId);
			break;

		case V_JOB_ROUTE_LOC_TYPE_PASSENGER_DROPOFF:
			let ped = getPlayerData(client).jobRouteLocationElement;
			removePedFromVehicle(ped);
			setElementPosition(ped, getPosBehindPos(getVehiclePosition(getPlayerVehicle(client)), getVehicleHeading(getPlayerVehicle(client)), 2));

			setTimeout(function () {
				deleteGameElement(ped);
				getPlayerData(client).jobRouteLocation = getNextLocationOnJobRoute(jobId, jobRouteId, jobRouteLocationId);
				showCurrentJobLocation(client);
				showSmallGameMessage(client, replaceJobRouteStringsInMessage(removeColoursInMessage(jobRouteData.locationNextMessage), jobId, jobRouteId), jobData.colour, 3500);

				createElementForPlayerJobRouteLocation(client, jobId, jobRouteId, jobRouteLocationId);
			}, getJobRouteLocationData(jobId, jobRouteId, jobRouteLocationId).stopDelay);
			break;

		default:
			break;
	}
}

// ===========================================================================

function deleteJobItems(client) {
	for (let i in getPlayerData(client).jobEquipmentCache) {
		deleteItem(getPlayerData(client).jobEquipmentCache[i]);
	}

	getPlayerData(client).jobEquipmentCache = [];

	cachePlayerHotBarItems(client);
	updatePlayerHotBar(client);
}

// ===========================================================================

function getJobRankName(jobId, rankId) {
	return getJobRankData(jobId, rankId).name;
}

// ===========================================================================

function respawnPlayerLastJobVehicle(client) {
	if (getPlayerCurrentSubAccount(client).lastJobVehicle == null) {
		return false;
	}
	respawnVehicle(getPlayerCurrentSubAccount(client).lastJobVehicle);
}

// ===========================================================================

function resetAllJobBlips() {
	deleteAllJobBlips();
	spawnAllJobBlips();
}

// ===========================================================================

function resetAllJobPickups() {
	deleteAllJobPickups();
	spawnAllJobPickups();
}

// ===========================================================================

function deleteAllJobBlips() {
	for (let i in serverData.jobs) {
		deleteJobBlips(i);
	}
}

// ===========================================================================

function deleteAllJobPickups() {
	for (let i in serverData.jobs) {
		deleteJobPickups(i);
	}
}

// ===========================================================================

function deleteJobBlips(jobId) {
	for (let j in serverData.jobs[jobId].locations) {
		deleteJobLocationBlip(jobId, j);
	}
}

// ===========================================================================

function deleteJobPickups(jobId) {
	for (let j in serverData.jobs[jobId].locations) {
		deleteJobLocationPickup(jobId, j);
	}
}

// ===========================================================================

function createJobRankCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);

	if (getJobData(jobId) == null) {
		messagePlayerError(client, `You need to take the job that you want to make a rank for.`);
		return false;
	}

	createJobRank()
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created rank {ALTCOLOUR}${params}{MAINCOLOUR} for job {jobYellow}${getJobData(jobId).name}`);
	return true;
}

// ===========================================================================

function createJobRouteCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client), getPlayerDimension(client));

	if (getJobData(jobId) == null) {
		messagePlayerError(client, `You need to take the job that you want to make a route for.`);
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "AlreadyOnJobRoute", "{ALTCOLOUR}/stoproute{MAINCOLOUR}"));
		return false;
	}

	let routeId = createJobRoute(params, closestJobLocation, getPlayerData(client).accountData.databaseId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created route {ALTCOLOUR}${params}{MAINCOLOUR} for job {jobYellow}${getJobData(jobId).name}`);
	startJobRoute(client, routeId);
	return true;
}

// ===========================================================================

function createJobRouteLocationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobId = getPlayerJob(client);

	if (getJobData(jobId) == null) {
		messagePlayerError(client, `You need to take the job that you want to make a route location for.`);
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeWorking", "{ALTCOLOUR}/startwork{MAINCOLOUR}"));
		return false;
	}

	if (!isPlayerOnJobRoute(client)) {
		messagePlayerError(client, getLocaleString(client, "NeedToBeOnJobRoute", "{ALTCOLOUR}/startroute{MAINCOLOUR}"));
		return false;
	}

	let routeId = getPlayerData(client).jobRoute;
	let jobRouteData = getJobRouteData(jobId, routeId);
	let routeLocationName = params;

	createJobRouteLocation(
		routeLocationName,
		getPlayerPosition(client),
		jobRouteData,
		getPlayerData(client).accountData.databaseId,
		getPlayerData(client).jobRouteEditNextLocationDelay,
		getPlayerData(client).jobRouteEditNextLocationArriveMessage,
		getPlayerData(client).jobRouteEditNextLocationGotoMessage,
		getPlayerData(client).jobRouteEditNextLocationType
	);

	getPlayerData(client).jobRouteEditNextLocationDelay = 0;
	getPlayerData(client).jobRouteEditNextLocationArriveMessage = jobRouteData.locationArriveMessage;
	getPlayerData(client).jobRouteEditNextLocationGotoMessage = jobRouteData.locationGotoMessage;
	getPlayerData(client).jobRouteEditNextLocationType = jobRouteData.locationType;

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created location {ALTCOLOUR}${routeLocationName}{MAINCOLOUR} for route {ALTCOLOUR}${jobRouteData.name}{MAINCOLOUR} for job {jobYellow}${getJobData(jobId).name}`);
	return true;
}

// ===========================================================================

function createJobUniformCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let splitParams = params.split(" ");
	let jobId = getJobFromParams(getParam(params, " ", 1));
	let skinIndex = getPlayerCurrentSubAccount(client).skin;

	if (areThereEnoughParams(params, 2, " ")) {
		skinIndex = getSkinModelIndexFromParams(splitParams.slice(1).join(" "), getGame());
	}

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (!skinIndex) {
		messagePlayerError(client, getLocaleString(client, "InvalidSkin"));
		return false;
	}

	createJobUniform(jobId, skinIndex, getPlayerData(client).accountData.databaseId);
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} created uniform with skin {ALTCOLOUR}${getSkinNameFromIndex(skinIndex)} (${gameData.skins[getGame()][skinIndex][0]}){MAINCOLOUR} for job {jobYellow}${getJobData(jobId).name}`);
	return true;
}

// ===========================================================================

function createJobRoute(routeName, closestJobLocation, whoAdded = defaultNoAccountId) {
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
	tempJobRouteData.locationGotoMessage = `Drive to the next stop.`;
	tempJobRouteData.whoAdded = whoAdded;
	tempJobRouteData.whenAdded = getCurrentUnixTimestamp();

	let routeId = getJobData(closestJobLocation.jobIndex).routes.push(tempJobRouteData);
	saveJobRouteToDatabase(tempJobRouteData);
	setAllJobDataIndexes();
	return routeId - 1;
}

// ===========================================================================

function createJobRouteLocation(routeLocationName, position, jobRouteData, whoAdded = defaultNoAccountId, delay = 0, arriveMessage = "", gotoMessage = "", typeId = V_JOB_ROUTE_LOC_TYPE_NONE) {
	let tempJobRouteLocationData = new JobRouteLocationData(false);
	tempJobRouteLocationData.name = routeLocationName;
	tempJobRouteLocationData.routeId = jobRouteData.databaseId;
	tempJobRouteLocationData.enabled = true;
	tempJobRouteLocationData.needsSaved = true;
	tempJobRouteLocationData.position = position;
	tempJobRouteLocationData.routeIndex = jobRouteData.index;
	tempJobRouteLocationData.stopDelay = delay;
	tempJobRouteLocationData.arriveMessage = arriveMessage;
	tempJobRouteLocationData.gotoMessage = gotoMessage;
	tempJobRouteLocationData.type = typeId;
	tempJobRouteLocationData.whoAdded = whoAdded;
	tempJobRouteLocationData.whenAdded = getCurrentUnixTimestamp();

	getJobData(jobRouteData.jobIndex).routes[jobRouteData.index].locations.push(tempJobRouteLocationData);
	//saveJobRouteLocationToDatabase(tempJobRouteLocationData);
	//setAllJobDataIndexes();
}

// ===========================================================================

function createJobUniform(jobId, skinIndex, whoAdded = defaultNoAccountId) {
	let tempJobUniformData = new JobUniformData(false);
	tempJobUniformData.skin = skinIndex;
	tempJobUniformData.jobIndex = jobId;
	tempJobUniformData.job = getJobData(jobId).databaseId;
	tempJobUniformData.name = gameData.skins[getGame()][skinIndex][1];
	tempJobUniformData.whoAdded = whoAdded;
	tempJobUniformData.whenAdded = getCurrentUnixTimestamp();
	tempJobUniformData.needsSaved = true;
	tempJobUniformData.enabled = true;

	getJobData(jobId).uniforms.push(tempJobUniformData);

	setAllJobDataIndexes();
}

// ===========================================================================

function deleteJobRouteLocationCommand(command, params, client) {
	let closestJobRouteLocation = getClosestJobRouteLocation(getPlayerPosition(client));

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted route location {ALTCOLOUR}${closestJobRouteLocation.index} (DB ID ${closestJobRouteLocation.databaseId}){MAINCOLOUR} for the {ALTCOLOUR}${closestJobRouteLocation.name}{jobYellow} route of the {jobYellow}${getJobData(closestJobLocation.jobIndex).name}{MAINCOLOUR} job`);

	if (closestJobRouteLocation.databaseId > 0) {
		quickDatabaseQuery(`UPDATE job_route_loc SET job_route_loc_deleted = 1, job_route_loc_who_deleted = ${getPlayerData(client).accountData.databaseId}, job_route_loc_when_deleted = UNIX_TIMESTAMP() WHERE job_route_loc_id = ${closestJobRouteLocation.databaseId}`);
	}

	let tempIndex = closestJobRouteLocation.index;
	let tempJobRoute = closestJobRouteLocation.routeIndex;

	getJobData(getJobIdFromDatabaseId(tempJob)).routes[tempJobRoute].locations.splice(tempIndex, 1);
	setAllJobDataIndexes();
	//collectAllGarbage();
}

// ===========================================================================

function deleteJobRouteCommand(command, params, client) {
	let jobId = getPlayerJob(client);
	let jobRoute = getPlayerData(client).jobRoute;

	if (!areParamsEmpty(client)) {
		jobRoute = getJobRouteFromParams(params, jobId);
	}

	let jobRouteData = serverData.jobs[jobId].routes[jobRoute];

	let clients = getClients();
	for (let i in clients) {
		if (isPlayerWorking(clients[i])) {
			if (isPlayerOnJobRoute(clients[i])) {
				if (getPlayerJob(clients[i]) == jobId && getPlayerData(clients[i]).jobRoute == jobRoute) {
					stopJobRoute(clients[i], true, false);
					messagePlayerAlert(clients[i], getLocaleString(client, "CurrentJobRouteDeleted"));
				}
			}
		}
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} deleted route {ALTCOLOUR}${jobRouteData.name} (DB ID ${jobRouteData.databaseId}){MAINCOLOUR} for the {jobYellow}${getJobData(jobId).name}{MAINCOLOUR} job`);

	if (jobRouteData.databaseId > 0) {
		quickDatabaseQuery(`UPDATE job_route SET job_route_deleted = 1, job_route_who_deleted = ${getPlayerData(client).accountData.databaseId}, job_route_when_deleted = UNIX_TIMESTAMP() WHERE job_route_id = ${jobRouteData.databaseId}`);
		quickDatabaseQuery(`UPDATE job_route_loc SET job_route_loc_deleted = 1, job_route_loc_who_deleted = ${getPlayerData(client).accountData.databaseId}, job_route_loc_when_deleted = UNIX_TIMESTAMP() WHERE job_route_loc_route = ${jobRouteData.databaseId}`);
	}

	serverData.jobs[jobId].routes[jobRoute].locations = [];
	serverData.jobs[jobId].routes.splice(jobRoute, 1);

	setAllJobDataIndexes();
	//collectAllGarbage();
}

// ===========================================================================

function deleteJobUniformCommand(command, params, client) {
	let jobId = getJobFromParams(getParam(params, " ", 1));
	let uniformIndex = getParam(params, " ", 1);

	if (getJobData(jobId) == null) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (doesPlayerHaveJobPermission(client, getJobFlagValue("ManageUniforms"))) {
		messagePlayerError(client, "You can't edit job uniforms!");
		return false;
	}

	if (isNaN(uniformIndex)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
		return false;
	}

	if (typeof getJobData(jobId).uniforms[uniformIndex] == "undefined") {
		messagePlayerError(client, getLocaleString(client, "InvalidJobUniform"));
		return false;
	}

	quickDatabaseQuery(`UPDATE job_uniform SET job_uniform_deleted = 1, job_uniform_who_deleted = ${getPlayerData(client).accountData.databaseId}, job_uniform_when_deleted = UNIX_TIMESTAMP() WHERE job_uniform_id = ${getJobData(jobId).uniforms[uniformIndex].databaseId}`);
	getJobData(jobId).uniforms.splice(uniformIndex, 1);

	setAllJobDataIndexes();
	//collectAllGarbage();
}

// ===========================================================================

function setJobUniformMinimumRankCommand(command, params, client) {
	let uniformIndex = getParam(params, " ", 1);
	let newRankLevel = getParam(params, " ", 2);

	let jobIndex = getPlayerJob(client);

	if (jobIndex == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (doesPlayerHaveJobPermission(client, getJobFlagValue("ManageUniforms"))) {
		messagePlayerError(client, "You can't edit job uniforms!");
		return false;
	}

	if (isNaN(uniformIndex)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
		return false;
	}

	if (isNaN(newRankLevel)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
		return false;
	}

	if (typeof getJobData(jobId).uniforms[uniformIndex] == "undefined") {
		messagePlayerError(client, getLocaleString(client, "InvalidJobUniform"));
		return false;
	}

	if (newRankLevel < 0) {
		messagePlayerError(client, "The rank can't be negative!");
		return false;
	}

	getJobData(jobIndex).uniforms[uniformIndex].requiredRank = newRankLevel;
	getJobData(jobIndex).uniforms[uniformIndex].needsSaved = true;
	messagePlayerSuccess(client, `You set job uniform ${getJobUniformData(jobIndex, uniformIndex).name}'s minimum rank to ${newRankLevel}`);
}

// ===========================================================================

function setJobUniformNameCommand(command, params, client) {
	let uniformIndex = getParam(params, " ", 1);
	let newName = params.slice(1).join(" ");

	let jobIndex = getPlayerJob(client);

	if (jobIndex == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (doesPlayerHaveJobPermission(client, getJobFlagValue("ManageUniforms"))) {
		messagePlayerError(client, "You can't edit job uniforms!");
		return false;
	}

	if (isNaN(uniformIndex)) {
		messagePlayerError(client, getLocaleString(client, "InvalidJobUniform"));
		return false;
	}

	if (typeof getJobData(jobId).uniforms[uniformIndex] == "undefined") {
		messagePlayerError(client, getLocaleString(client, "InvalidJobUniform"));
		return false;
	}

	getJobData(jobIndex).uniforms[uniformIndex].name = newName;
	getJobData(jobIndex).uniforms[uniformIndex].needsSaved = true;
	messagePlayerSuccess(client, `You set job uniform ${getJobUniformData(jobIndex, uniformIndex).name}'s name to ${newName}`);
}

// ===========================================================================

function getJobFromParams(params) {
	if (isNaN(params)) {
		for (let i in serverData.jobs) {
			if (toLowerCase(serverData.jobs[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof serverData.jobs[params] != "undefined") {
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
	let jobs = serverData.jobs;
	for (let i in jobs) {
		let locations = jobs[i].locations;
		for (let j in locations) {
			if (locations[j].dimension != dimension) {
				let businessId = getClosestBusinessExit(locations[j].position, locations[j].dimension);
				if (getBusinessData(businessId) != null) {
					if (!closestJobLocation || getBusinessData(businessId).entrancePosition.distance(position) < closestJobLocation.position.distance(position)) {
						closestJobLocation = locations[j];
					}
				}
			}

			if (!closestJobLocation || locations[j].position.distance(position) < closestJobLocation.position.distance(position)) {
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
	for (let i in serverData.jobs) {
		for (let j in serverData.jobs[i].routes) {
			for (let k in serverData.jobs[i].routes[j].locations) {
				if (!closestJobRouteLocation || serverData.jobs[i].routes[j].locations[k].position.distance(position) < closestJobRouteLocation.position.distance(position)) {
					closestJobRouteLocation = serverData.jobs[i].routes[j].locations[k];
				}
			}
		}
	}
	return closestJobRouteLocation;
}

// ===========================================================================

function getJobPointsInRange(position, distance) {
	return serverData.jobs[getGame()].filter(x => x.position.distance(position) <= distance);
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
	if (closestJobLocation.routeCache.length > 0) {
		let randomRoute = getRandom(0, closestJobLocation.routeCache.length - 1);
		let routeId = closestJobLocation.routeCache[randomRoute];
		if (!getJobRouteData(closestJobLocation.jobIndex, routeId).enabled) {
			return getRandomJobRouteForLocation(closestJobLocation);
		}
		return getJobRouteData(closestJobLocation.jobIndex, routeId).index;
	}
	return -1;
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @param {number} uniformIndex - The data index of the job route
 * @return {JobUniformData} The jobroutes's data (class instance)
 */
function getJobUniformData(jobIndex, uniformIndex) {
	if (typeof serverData.jobs[jobIndex] == "undefined") {
		return false;
	}

	if (typeof serverData.jobs[jobIndex].uniforms[uniformIndex] == "undefined") {
		return false;
	}

	return serverData.jobs[jobIndex].uniforms[uniformIndex];
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @param {number} equipmentIndex - The data index of the job equipment loadout
 * @return {JobEquipmentData} The job equipment loadout's data (class instance)
 */
function getJobEquipmentData(jobIndex, equipmentIndex) {
	if (typeof serverData.jobs[jobIndex] == "undefined") {
		return false;
	}

	if (typeof serverData.jobs[jobIndex].equipment[equipmentIndex] == "undefined") {
		return false;
	}

	return serverData.jobs[jobIndex].equipment[equipmentIndex];
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @param {number} equipmentIndex - The data index of the job equipment loadout
 * @param {number} equipmentItemIndex - The data index of the job equipment item
 * @return {JobEquipmentItemData} The job equipment loadout's data (class instance)
 */
function getJobEquipmentItemData(jobIndex, equipmentIndex, equipmentItemIndex) {
	if (typeof serverData.jobs[jobIndex] == "undefined") {
		return false;
	}

	if (typeof serverData.jobs[jobIndex].equipment[equipmentIndex] == "undefined") {
		return false;
	}

	return serverData.jobs[jobIndex].equipment[equipmentIndex].items[equipmentItemIndex];
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @param {number} rankIndex - The data index of the job rank
 * @return {JobRankData} The job rank's data (class instance)
 */
function getJobRankData(jobIndex, rankIndex) {
	if (typeof serverData.jobs[jobIndex] == "undefined") {
		return false;
	}

	return serverData.jobs[jobIndex].ranks[rankIndex];
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @param {number} routeIndex - The data index of the job route
 * @return {JobRouteData} The job routes's data (class instance)
 */
function getJobRouteData(jobIndex, routeIndex) {
	if (typeof serverData.jobs[jobIndex] == "undefined") {
		return false;
	}

	if (typeof serverData.jobs[jobIndex].routes[routeIndex] == "undefined") {
		return false;
	}

	return serverData.jobs[jobIndex].routes[routeIndex];
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @param {number} routeIndex - The data index of the job route
 * @param {number} routeLocationIndex - The data index of the job route location
 * @return {JobRouteLocationData} The job route locations's data (class instance)
 */
function getJobRouteLocationData(jobIndex, routeIndex, routeLocationIndex) {
	if (typeof serverData.jobs[jobIndex] == "undefined") {
		return false;
	}

	if (typeof serverData.jobs[jobIndex].routes[routeIndex] == "undefined") {
		return false;
	}

	if (typeof serverData.jobs[jobIndex].routes[routeIndex].locations[routeLocationIndex] == "undefined") {
		return false;
	}

	return serverData.jobs[jobIndex].routes[routeIndex].locations[routeLocationIndex];
}

// ===========================================================================

/**
 * @param {number} jobIndex - The data index of the job
 * @param {number} locationIndex - The data index of the job location
 * @return {JobLocationData} The job route locations's data (class instance)
 */
function getJobLocationData(jobIndex, locationIndex) {
	if (typeof serverData.jobs[jobIndex] == "undefined") {
		return false;
	}

	if (typeof serverData.jobs[jobIndex].locations[locationIndex] == "undefined") {
		return false;
	}

	return serverData.jobs[jobIndex].locations[locationIndex];
}

// ===========================================================================

function getClosestJobLocationForJob(position, jobId) {
	let closestJobLocation = false;
	for (let i in serverData.jobs[jobId].locations) {
		if (!closestJobLocation || serverData.jobs[jobId].locations[i].position.distance(position) < closestJobLocation.position.distance(position)) {
			closestJobLocation = serverData.jobs[jobId].locations[i];
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
	let jobRouteData = getJobRouteLocationData(getPlayerJob(client), getPlayerJobRoute(client), getPlayerJobRouteLocation(client));
	sendJobRouteLocationToPlayer(client, jobRouteData.position, jobRouteData.dimension, getJobData(getPlayerJob(client)).colour);
	//showElementForPlayer(getJobRouteLocationData(getPlayerJob(client), getPlayerJobRoute(client), getPlayerJobRouteLocation(client)).marker, client);
}

// ===========================================================================

function finishSuccessfulJobRoute(client) {
	let jobId = getPlayerJob(client);
	let jobRouteId = getPlayerJobRoute(client);
	let jobRouteData = getJobRouteData(jobId, jobRouteId);
	let payout = toInteger(applyServerInflationMultiplier(jobRouteData.pay));
	getPlayerCurrentSubAccount(client).payDayAmount = getPlayerCurrentSubAccount(client).payDayAmount + payout;

	messageDiscordEventChannel(`💼 ${getCharacterFullName(client)} finished the ${jobRouteData.name} route for the ${getJobData(jobId).name} job and earned ${getCurrencyString(jobRouteData.pay)}!`);
	messagePlayerSuccess(client, replaceJobRouteStringsInMessage(jobRouteData.finishMessage, jobId, jobRouteData.index));

	stopReturnToJobVehicleCountdown(client);
	sendPlayerStopJobRoute(client);
	removePedFromVehicle(getPlayerPed(client));
	let vehicle = getPlayerData(client).jobRouteVehicle;
	setTimeout(function () {
		respawnVehicle(vehicle);
	}, 1000);

	getPlayerData(client).jobRouteVehicle = null;
	getPlayerData(client).jobRoute = -1;
	getPlayerData(client).jobRouteLocation = -1;
}

// ===========================================================================

function getNextLocationOnJobRoute(jobId, routeId, currentLocationId) {
	if (!isLastLocationOnJobRoute(jobId, routeId, currentLocationId)) {
		return currentLocationId + 1;
	} else {
		return getJobRouteData(jobId, routeId).locations.length - 1;
	}
}

// ===========================================================================

function isLastLocationOnJobRoute(jobId, routeId, currentLocationId) {
	if (currentLocationId == getJobRouteData(jobId, routeId).locations.length - 1) {
		return true;
	}
	return false;
}

// ===========================================================================

function getJobRouteFromParams(params, jobId) {
	if (isNaN(params)) {
		for (let i in serverData.jobs[jobId].routes) {
			if (toLowerCase(serverData.jobs[jobId].routes[i].name).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if (typeof serverData.jobs[jobId].routes[params] != "undefined") {
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
	messageText = messageText.replace(tempRegex, `${getCurrencyString(tempJobRouteData.pay)}`);

	tempFind = `{JOBNAME}`;
	tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, getJobData(tempJobRouteData.jobIndex).name);

	return messageText;
}

// ===========================================================================

function updateJobBlipsForPlayer(client) {
	if (!isGameFeatureSupported("serverElements")) {
		return false;
	}

	if (getPlayerData(client) == null) {
		return false;
	}

	for (let i in serverData.jobs) {
		for (let j in serverData.jobs[i].locations) {
			if (getPlayerJob(client) == -1 || getPlayerJob(client) == i) {
				showElementForPlayer(serverData.jobs[i].locations[j].blip, client);
			} else {
				hideElementForPlayer(serverData.jobs[i].locations[j].blip, client);
			}
		}
	}
}

// ===========================================================================

function getJobRouteLocationTypeFromParams(params) {
	if (isNaN(params)) {
		for (let i in jobRouteLocationTypes) {
			if (toLowerCase(jobRouteLocationTypes[i][1]).indexOf(toLowerCase(params)) != -1) {
				return jobRouteLocationTypes[i][0];
			}
		}
	} else {
		if (typeof jobRouteLocationTypes[params] != "undefined") {
			return jobRouteLocationTypes[params][0];
		}
	}

	return -1;
}

// ===========================================================================

function getLowestJobRank(jobIndex) {
	let lowestRank = 0;
	for (let i in serverData.jobs[jobIndex].ranks) {
		if (getJobRankData(jobIndex, i).level < getJobRankData(jobIndex, lowestRank).level) {
			lowestRank = i;
		}
	}
	return lowestRank;
}

// ===========================================================================

function getHighestJobRank(jobIndex) {
	let highestRank = 0;
	for (let i in serverData.jobs[jobIndex].ranks) {
		if (getJobRankData(jobIndex, i).level > getJobRankData(jobIndex, highestRank).level) {
			highestRank = i;
		}
	}
	return highestRank;
}

// ===========================================================================

function createJobRouteLocationMarker(jobIndex, jobRouteIndex, jobRouteLocationIndex) {
	let marker = null;
	if (isGameFeatureSupported("sphere")) {
		marker = createGameSphere(getJobRouteLocationData(jobIndex, jobRouteIndex, jobRouteLocationIndex).position, globalConfig.jobRouteLocationSphereRadius, getJobData(jobIndex).colour);
		setElementOnAllDimensions(marker, false);
		setElementShownByDefault(marker, false);
		setElementDimension(marker, gameData.mainWorldDimension[getGame()]);

		if (isGameFeatureSupported("interiorId")) {
			setElementInterior(marker, gameData.mainWorldDimension[getGame()]);
		}
	} else {
		marker = getJobRouteLocationData(jobIndex, jobRouteIndex, jobRouteLocationIndex).marker = createGamePickup(gameData.pickupModels[getGame()].Misc, getJobRouteLocationData(jobIndex, jobRouteIndex, jobRouteLocationIndex).position, gameData.pickupTypes[getGame()].job);
		setElementOnAllDimensions(marker, false);
		setElementShownByDefault(marker, false);
		setElementDimension(marker, gameData.mainWorldDimension[getGame()]);

		if (isGameFeatureSupported("interiorId")) {
			setElementInterior(marker, gameData.mainWorldDimension[getGame()]);
		}
	}

	if (marker != null) {
		getJobRouteLocationData(jobIndex, jobRouteIndex, jobRouteLocationIndex).marker = marker;
	}
}

// ===========================================================================

function createAllJobRouteLocationMarkers() {
	for (let i in serverData.jobs) {
		for (let j in serverData.jobs[i].routes) {
			for (let k in serverData.jobs[i].routes[j].locations) {
				createJobRouteLocationMarker(i, j, k);
			}
		}
	}
}

// ===========================================================================

function doesJobLocationHaveAnyRoutes(jobLocationData) {
	return (getRandomJobRouteForLocation(jobLocationData) != -1);
}

// ===========================================================================

/**
 * @param {Number} jobIndex - The job index to search ranks for
 * @param {String} params - The params to search for
 * @return {Number} The data index of a matching job
 */
function getJobRankFromParams(jobIndex, params) {
	if (isNaN(params)) {
		for (let i in getJobData(jobIndex).ranks) {
			if ((toLowerCase(getJobData(jobIndex).ranks[i].name).indexOf(toLowerCase(params)) != -1)) {
				return i;
			}
		}
	} else {
		for (let i in getJobData(jobIndex).ranks) {
			if (getJobData(jobIndex).ranks[i].level == toInteger(params)) {
				return i;
			}
		}
	}

	return false;
}

// ===========================================================================

/**
 * @param {Number} jobIndex - The job index to search uniforms for
 * @param {String} params - The params to search for
 * @return {Number} The data index of a matching job
 */
function getJobUniformFromParams(jobIndex, params) {
	if (isNaN(params)) {
		for (let i in getJobData(jobIndex).uniforms) {
			if ((toLowerCase(getJobData(jobIndex).uniforms[i].name).indexOf(toLowerCase(params)) != -1)) {
				return i;
			}
		}
	} else {
		for (let i in getJobData(jobIndex).uniforms) {
			if (getJobData(jobIndex).uniforms[i].level == toInteger(params)) {
				return i;
			}
		}
	}

	return false;
}

// ===========================================================================

function getJobRoutesCommand(command, params, client) {
	let closestJobLocation = getClosestJobLocation(getPlayerPosition(client));

	if (!closestJobLocation) {
		messagePlayerAlert(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	let jobData = getJobData(closestJobLocation.jobIndex);

	let jobRoutesList = jobData.routes.map(function (r) {
		return `{chatBoxListIndex}${r.index}: ${(r.enabled) ? "{softGreen}" : "{softRed}"}${r.name} {ALTCOLOUR}(${r.locations.length} stops, added ${getTimeDifferenceDisplay(getCurrentUnixTimestamp(), r.whenAdded)} ago)`;
	});
	let chunkedList = splitArrayIntoChunks(jobRoutesList, 2);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobRoutesList", `${jobData.name}, Location ${closestJobLocation.index}`)));
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function getJobRouteInfoCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (!areThereEnoughParams(params, 2, " ")) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let jobIndex = getJobFromParams(getParam(params, " ", 1));
	if (jobIndex == -1) {
		messagePlayerSyntax(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	let routeIndex = getJobRouteFromParams(getParam(params, " ", 2), jobIndex);
	if (routeIndex == -1) {
		messagePlayerSyntax(client, getLocaleString(client, "InvalidJobRoute"));
		return false;
	}

	let jobRouteData = getJobRouteData(jobIndex, routeIndex);
	let jobData = getJobData(jobRouteData.jobIndex);

	let tempStats = [
		[`ID`, `${jobRouteData.index}/${jobRouteData.databaseId}`],
		[`Job`, `${jobData.name}`],
		[`Name`, `${jobRouteData.name}`],
		[`Added By`, `${loadAccountFromId(jobRouteData.whoAdded).name}`],
		[`Added On`, `${new Date(jobRouteData.whenAdded * 1000).toLocaleDateString("en-GB")}`],
		[`Enabled`, `${getYesNoFromBool(jobRouteData.enabled)}`],
		[`Stops`, `${jobRouteData.locations.length}`],
		[`Pay`, `${getCurrencyString(jobRouteData.pay)}`],
		//[`Start Message`, `${jobRouteData.startMessage}`],
		//[`Finish Message`, `${jobRouteData.finishMessage}`],
		//[`Location Goto Message`, `${jobRouteData.locationGotoMessage}`],
		//[`Location Arrive Message`, `${jobRouteData.locationArriveMessage}`],
		//[`Location Arrive Message`, `${jobRouteData.locationArriveMessage}`],
		[`Vehicle Colour`, `${getVehicleColourInfoString(jobRouteData.vehicleColour1, false)}, ${getVehicleColourInfoString(jobRouteData.vehicleColour2, false)}`],
	];

	let stats = tempStats.map(stat => `{chatBoxListIndex}${stat[0]}: {ALTCOLOUR}${stat[1]}{MAINCOLOUR}`);

	messagePlayerNormal(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobRouteInfo", `${jobData.name}, Location ${jobRouteData.index}`)));
	let chunkedList = splitArrayIntoChunks(stats, 4);
	for (let i in chunkedList) {
		messagePlayerInfo(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function jobInviteCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (getPlayerJob(client) == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (!doesPlayerHaveJobPermission(client, getJobFlagValue("AddMember"))) {
		messagePlayerError(client, getLocaleString(client, "CantAddJobMembers"));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (getPlayerJob(targetClient) != -1) {
		messagePlayerError(client, getLocaleString(client, "JobInviteAlreadyHasJob"));
		return false;
	}

	messagePlayerSuccess(client, getLocaleString(client, "JobInviteSent", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));
	showPlayerPrompt(targetClient, getLocaleString(targetClient, "JobInviteRequest", `{ALTCOLOUR}${getCharacterFullName(client)}{MAINCOLOUR}`, `{jobYellow}${getJobData(getPlayerJob(client)).name}{MAINCOLOUR}`, getLocaleString(targetClient, "GUIAlertTitle"), getLocaleString(targetClient, "Yes"), getLocaleString(targetClient, "No")));
	getPlayerData(targetClient).promptType = V_PROMPT_JOBINVITE;
	getPlayerData(targetClient).promptValue = client;
}

// ===========================================================================

function jobUninviteCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (getPlayerJob(client) == -1) {
		messagePlayerError(client, getLocaleString(client, "InvalidJob"));
		return false;
	}

	if (!doesPlayerHaveJobPermission(client, getJobFlagValue("RemoveMember"))) {
		messagePlayerError(client, getLocaleString(client, "CantRemoveJobMembers"));
		return false;
	}

	let targetClient = getPlayerFromParams(params);

	if (getPlayerJob(targetClient) != getPlayerJob(client)) {
		messagePlayerError(client, getLocaleString(client, "JobUnInviteNotInJob"));
		return false;
	}

	if (getJobRankData(getPlayerJob(client), getPlayerJobRank(client)).level <= getJobRankData(getPlayerJob(targetClient), getPlayerJobRank(targetClient)).level) {
		messagePlayerError(client, getLocaleString(client, "JobRankTooLow"));
		return false;
	}

	messagePlayerSuccess(client, getLocaleString(client, "PlayerRemovedFromJob", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));
	messagePlayerAlert(targetClient, getLocaleString(client, "RemovedFromJob", `{ALTCOLOUR}${getCharacterFullName(client)}{MAINCOLOUR}`));

	stopWorking(targetClient);

	getPlayerCurrentSubAccount(targetClient).job = 0;
	getPlayerCurrentSubAccount(targetClient).jobIndex = -1;
	getPlayerCurrentSubAccount(targetClient).jobRank = 0;
	getPlayerCurrentSubAccount(targetClient).jobRankIndex = -1;
}

// ===========================================================================

function addPlayerToJobBlackList(client, jobIndex, whoAdded = defaultNoAccountId) {
	let tempJobBlackListData = new JobBlackListData(false);
	tempJobBlackListData.subAccount = getPlayerCurrentSubAccount(client).databaseId;
	tempJobBlackListData.jobIndex = jobIndex;
	tempJobBlackListData.job = getJobData(jobIndex).databaseId;
	tempJobBlackListData.whoAdded = whoAdded;
	tempJobBlackListData.whenAdded = getCurrentUnixTimestamp();
	tempJobBlackListData.needsSaved = true;

	getJobData(jobIndex).blackList.push(tempJobBlackListData);
	setAllJobDataIndexes();
}

// ===========================================================================

function addPlayerToJobWhiteList(client, jobIndex, whoAdded = defaultNoAccountId) {
	let tempJobWhiteListData = new JobWhiteListData(false);
	tempJobWhiteListData.subAccount = getPlayerCurrentSubAccount(client).databaseId;
	tempJobWhiteListData.jobIndex = jobIndex;
	tempJobWhiteListData.job = getJobData(jobIndex).databaseId;
	tempJobWhiteListData.whoAdded = whoAdded;
	tempJobWhiteListData.whenAdded = getCurrentUnixTimestamp();
	tempJobWhiteListData.needsSaved = true;

	getJobData(jobIndex).whiteList.push(tempJobWhiteListData);
	setAllJobDataIndexes();
}

// ===========================================================================

function removePlayerFromJobBlackList(client, jobIndex, whoDeleted = defaultNoAccountId) {
	quickDatabaseQuery(`UPDATE job_bl SET job_bl_deleted = 1, job_bl_who_deleted = ${whoDeleted}, job_bl_when_deleted = UNIX_TIMESTAMP() WHERE job_bl_sacct = ${getPlayerCurrentSubAccount(client).databaseId}`)

	for (let i in serverData.jobs[jobIndex].blackList) {
		if (serverData.jobs[jobIndex].blackList[i].subAccount == getPlayerCurrentSubAccount(client).databaseId) {
			serverData.jobs[jobIndex].splice(i, 1);
		}
	}

	setAllJobDataIndexes();
}

// ===========================================================================

function removePlayerFromJobWhiteList(client, jobIndex, whoDeleted = defaultNoAccountId) {
	quickDatabaseQuery(`UPDATE job_wl SET job_wl_deleted = 1, job_wl_who_deleted = ${whoDeleted}, job_wl_when_deleted = UNIX_TIMESTAMP() WHERE job_wl_sacct = ${getPlayerCurrentSubAccount(client).databaseId}`)

	for (let i in serverData.jobs[jobIndex].whiteList) {
		if (serverData.jobs[jobIndex].whiteList[i].subAccount == getPlayerCurrentSubAccount(client).databaseId) {
			serverData.jobs[jobIndex].splice(i, 1);
		}
	}

	setAllJobDataIndexes();
}

// ===========================================================================

function getJobLocationPickupModelForNetworkEvent(jobIndex) {
	let pickupModelId = -1;
	if (isGameFeatureSupported("pickup")) {
		pickupModelId = gameData.pickupModels[getGame()].Job;

		if (getJobData(jobIndex).pickupModel != 0) {
			pickupModelId = getJobData(jobIndex).pickupModel;
		}
	}

	return pickupModelId;
}

// ===========================================================================

function getJobLocationBlipModelForNetworkEvent(jobIndex) {
	let blipModelId = -1;
	if (isGameFeatureSupported("blip")) {
		blipModelId = gameData.blipSprites[getGame()].Job;

		if (getJobData(jobIndex).blipModel != 0) {
			blipModelId = getJobData(jobIndex).blipModel;
		}
	}

	return blipModelId;
}

// ===========================================================================

function finePlayerCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	if (getPlayerJob(client) == -1) {
		messagePlayerError(client, getLocaleString(client, "CantFinePlayer"));
		return;
	}

	if (getJobData(getPlayerJob(client)).type != V_JOB_POLICE) {
		//if (doesPlayerHaveJobPermission(client, getJobFlagValue("FinePlayer"))) {
		messagePlayerError(client, getLocaleString(client, "CantFinePlayer"));
		return;
		//}
	}

	let targetClient = getPlayerFromParams(getParam(params, " ", 1));
	let amount = toInteger(getParam(params, " ", 2));

	if (!targetClient) {
		messagePlayerError(client, getLocaleString(client, "InvalidPlayer"));
		return false;
	}

	if (isNaN(amount)) {
		messagePlayerError(client, getLocaleString(client, "MustBeNumber"));
		return false;
	}

	if (amount < 0) {
		messagePlayerError(client, getLocaleString(client, "CantUseNegativeNumber"));
		return false;
	}

	if (amount > gameData.maximumFineAmount[getGame()]) {
		messagePlayerInfo(client, getLocaleString(client, "MaximumFine", `{ALTCOLOUR}${getCurrencyString(gameData.maximumFineAmount[getGame()])}{MAINCOLOUR}`));
		return false;
	}

	if (getPlayerCurrentSubAccount(targetClient).fineAmount > gameData.maximumFineAmount[getGame()]) {
		messagePlayerInfo(client, getLocaleString(client, "MaximumFine", `{ALTCOLOUR}${getCurrencyString(gameData.maximumFineAmount[getGame()])}{MAINCOLOUR}`));
		return false;
	}

	if (getDistance(getPlayerPosition(client), getPlayerPosition(targetClient)) > globalConfig.finePlayerDistance) {
		messagePlayerError(client, getLocaleString(client, "PlayerTooFar", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`));
		return false;
	}

	getPlayerCurrentSubAccount(targetClient).fineAmount = getPlayerCurrentSubAccount(targetClient).fineAmount + amount;

	let commission = Math.round(getPlayerCurrentSubAccount(targetClient).fineAmount * globalConfig.fineCommission);
	getPlayerCurrentSubAccount(client).payDayAmount = getPlayerCurrentSubAccount(client).payDayAmount + commission;

	messagePlayerSuccess(client, getLocaleString(client, "FinedPlayer", `{ALTCOLOUR}${getCharacterFullName(targetClient)}{MAINCOLOUR}`, `{ALTCOLOUR}${getCurrencyString(amount)}{MAINCOLOUR}`));
	messagePlayerAlert(targetClient, getLocaleString(targetClient, "FinedByPlayer", `{ALTCOLOUR}${getCharacterFullName(client)}{MAINCOLOUR}`, `{ALTCOLOUR}${getCurrencyString(amount)}{MAINCOLOUR}`));
}

// ===========================================================================

function doesJobHavePublicRank(jobIndex) {
	for (let i in serverData.jobs[jobIndex].ranks) {
		if (serverData.jobs[jobIndex].ranks[i].public) {
			return true;
		}
	}

	return false;
}

// ===========================================================================

function updateJobPickupLabelData(jobId) {
	for (let j in serverData.jobs[jobId].locations) {
		if (serverData.jobs[jobId].locations[j].pickup != null) {
			setEntityData(serverData.jobs[jobId].locations[j].pickup, "v.rp.owner.type", V_PICKUP_JOB, false);
			setEntityData(serverData.jobs[jobId].locations[j].pickup, "v.rp.owner.id", jobId, false);
			setEntityData(serverData.jobs[jobId].locations[j].pickup, "v.rp.label.type", V_LABEL_JOB, true);
			setEntityData(serverData.jobs[jobId].locations[j].pickup, "v.rp.label.name", serverData.jobs[jobId].name, true);
			setEntityData(serverData.jobs[jobId].locations[j].pickup, "v.rp.label.jobType", jobId, true);
			setEntityData(serverData.jobs[jobId].locations[j].pickup, "v.rp.label.publicRank", doesJobHavePublicRank(jobId), true);
			setElementOnAllDimensions(serverData.jobs[jobId].locations[j].pickup, false);
			setElementDimension(serverData.jobs[jobId].locations[j].pickup, serverData.jobs[jobId].locations[j].dimension);
		}
	}
}

// ===========================================================================

function createElementForPlayerJobRouteLocation(client, jobIndex, jobRouteIndex, jobRouteLocationIndex) {
	let tempJobRouteLocationData = getJobRouteLocationData(jobIndex, jobRouteIndex, jobRouteLocationIndex);

	let modelIndex = -1;
	switch (tempJobRouteLocationData.type) {
		case V_JOB_ROUTE_LOC_TYPE_BURNING_VEHICLE:
			modelIndex = getRandomVehicleModel();
			let vehicle = createGameVehicle(modelIndex, tempJobRouteLocationData.position, tempJobRouteLocationData.rotation);
			if (vehicle != null) {
				setElementDimension(vehicle, tempJobRouteLocationData.dimension);
				setElementOnAllDimensions(vehicle, false);

				setVehicleEngineState(vehicle, false);
				setVehicleBurning(vehicle, true);
				getPlayerData(client).jobRouteElement = vehicle;
			}
			break;

		case V_JOB_ROUTE_LOC_TYPE_PASSENGER_PICKUP:
			modelIndex = getRandomSkin();
			let passenger = createGamePed(modelIndex, tempJobRouteLocationData.position, tempJobRouteLocationData.rotation);
			if (passenger != null) {
				setElementDimension(passenger, tempJobRouteLocationData.dimension);
				setElementOnAllDimensions(passenger, false);
				getPlayerData(client).jobRouteElement = passenger;
			}
			break;

		case V_JOB_ROUTE_LOC_TYPE_INJURED_PED:
			modelIndex = getRandomSkin();
			let ped = createGamePed(modelIndex, tempJobRouteLocationData.position, tempJobRouteLocationData.rotation);
			if (ped != null) {
				setElementDimension(ped, tempJobRouteLocationData.dimension);
				setElementOnAllDimensions(ped, false);
				setPedBleeding(ped, true);
				getPlayerData(client).jobRouteElement = ped;
			}
			break;

		case V_JOB_ROUTE_LOC_TYPE_ITEM_PICKUP:
			if (isGameFeatureSupported("object")) {
				let groundItem = createGroundItem(itemType, tempJobRouteLocationData.itemValue, tempJobRouteLocationData.position, tempJobRouteLocationData.dimension);
				getPlayerData(client).jobRouteElement = groundItem;
			}
			break;

		default:
			break;
	}

	return true;
}

// ===========================================================================

function addPlayerToJob(client, jobIndex, jobRankIndex = 0) {
	getPlayerCurrentSubAccount(client).job = getJobData(jobIndex).databaseId;
	getPlayerCurrentSubAccount(client).jobIndex = jobIndex;
	getPlayerCurrentSubAccount(client).jobRank = getJobRankData(jobIndex, jobRankIndex).databaseId;
	getPlayerCurrentSubAccount(client).jobRankIndex = jobRankIndex;
}

// ===========================================================================

function removePlayerFromJob(client) {
	getPlayerCurrentSubAccount(client).job = 0;
	getPlayerCurrentSubAccount(client).jobIndex = -1;
	getPlayerCurrentSubAccount(client).jobRank = 0;
	getPlayerCurrentSubAccount(client).jobRankIndex = -1;
}

// ===========================================================================