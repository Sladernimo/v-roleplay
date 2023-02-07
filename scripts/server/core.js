// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: core.js
// DESC: Provides core data structures, function, and operations
// TYPE: Server (JavaScript)
// ===========================================================================

let scriptVersion = "1.3";
let serverStartTime = 0;
let logLevel = LOG_INFO | LOG_DEBUG | LOG_VERBOSE;

let playerResourceReady = new Array(server.maxClients).fill(false);
let playerResourceStarted = new Array(server.maxClients).fill(false);
let playerInitialized = new Array(server.maxClients).fill(false);
let playerGUI = new Array(server.maxClients).fill(false);
let defaultNoAccountId = 1;

// ===========================================================================

/**
 * @typedef {Object} ServerData
 * @property {Array.<VehicleData>} vehicles
 * @property {Array.<ClientData>} clients
 * @property {Array.<BusinessData>} businesses
 * @property {Array.<HouseData>} houses
 * @property {Array.<HouseData>} commands
 * @property {Array.<ItemData>} items
 * @property {Array.<ItemTypeData>} itemTypes
 * @property {Array.<ClanData>} clans
 * @property {Array.<TriggerData>} triggers
 * @property {Array.<NPCData>} npcs
 * @property {Array.<RaceData>} races
 * @property {Array.<JobData>} jobs
 * @property {Array.<GateData>} gates
 * @property {Array.<RadioStationData>} radioStations
 * @property {Array} locales
 * @property {Array} localeStrings
 * @property {Array} groundItemCache
 * @property {Array} groundPlantCache
 * @property {Array} purchasingVehicleCache
 * @property {Array} rentingVehicleCache
 * @property {Array} atmLocationCache
 */
let serverData = {
	vehicles: [],
	clients: new Array(128),
	businesses: [],
	houses: [],
	commands: {},
	items: [],
	itemTypes: [],
	clans: [],
	cachedTranslations: [],
	cachedTranslationFrom: [],
	triggers: [],
	npcs: [],
	races: [],
	jobs: [],
	gates: [],
	radioStations: [],
	localeStrings: {},
	groundItemCache: [],
	groundPlantCache: [],
	purchasingVehicleCache: [],
	rentingVehicleCache: [],
	atmLocationCache: [],
};

// ===========================================================================

/**
 * @return {ServerData} serverData
 */
function getServerData() {
	return serverData;
}

// ===========================================================================