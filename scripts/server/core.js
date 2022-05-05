// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: core.js
// DESC: Provides core data structures, function, and operations
// TYPE: Server (JavaScript)
// ===========================================================================

let scriptVersion = "1.1";
let serverStartTime = 0;
let logLevel = LOG_INFO|LOG_ERROR|LOG_WARN|LOG_DEBUG;

// ===========================================================================

/**
 * @typedef {Object} ServerData
 * @property {Array.<VehicleData>} vehicles
 * @property {Array.<ClientData>} clients
 * @property {Array.<BusinessData>} businesses
 * @property {Array.<HouseData>} houses
 * @property {Array.<HouseData>} commands
 * @property {Array} groundItemCache
 * @property {Array} groundPlantCache
 * @property {Array.<ItemData>} items
 * @property {Array.<ItemTypeData>} itemTypes
 * @property {Array.<ClanData>} clans
 * @property {Array} localeStrings
 * @property {Array.<NPCData>} npcs
 * @property {Array.<RaceData>} races
 * @property {Array.<JobData>} jobs
 * @property {Array.<Gates>} gates
 */
let serverData = {
	vehicles: [],
	clients: new Array(128),
	businesses: [],
	houses: [],
	commands: {},
	groundItemCache: [],
	groundPlantCache: [],
	items: [],
	itemTypes: [],
	clans: [],
	localeStrings: {},
	cachedTranslations: [],
	cachedTranslationFrom: [],
	//triggers: [],
	npcs: [],
	races: [],
	jobs: [],
	gates: [],
};

// ===========================================================================

/**
 *
 * @return {ServerData}
 *
 */
function getServerData() {
	return serverData;
}

// ===========================================================================