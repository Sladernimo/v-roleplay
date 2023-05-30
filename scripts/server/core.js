// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: core.js
// DESC: Provides core data structures, function, and operations
// TYPE: Server (JavaScript)
// ===========================================================================

let scriptVersion = "1.6";
let serverStartTime = 0;
let logLevel = LOG_INFO | LOG_DEBUG;

let playerResourceReady = new Array(server.maxClients).fill(false);
let playerResourceStarted = new Array(server.maxClients).fill(false);
let playerInitialized = new Array(server.maxClients).fill(false);
let playerGUI = new Array(server.maxClients).fill(false);
let defaultNoAccountId = 1;
let serverStarting = false;

// ===========================================================================

/**
 * @typedef {Object} ServerData
 * @property {Array.<BanData>} bans
 * @property {Array.<VehicleData>} vehicles
 * @property {Array.<ClientData>} clients
 * @property {Array.<BusinessData>} businesses
 * @property {Array.<HouseData>} houses
 * @property {Array} commands
 * @property {Array.<ItemData>} items
 * @property {Array.<ItemTypeData>} itemTypes
 * @property {Array.<ClanData>} clans
 * @property {Array.<TriggerData>} triggers
 * @property {Array.<NPCData>} npcs
 * @property {Array.<RaceData>} races
 * @property {Array.<JobData>} jobs
 * @property {Array.<GateData>} gates
 * @property {Array.<RadioStationData>} radioStations
 * @property {Array.<PayPhoneData>} payPhones
 * @property {Array.<ScenarioData>} scenarios
 * @property {Array.<CallBoxData>} callBoxes
 * @property {Array} locales
 * @property {Array} localeStrings
 * @property {Array} groundItemCache
 * @property {Array} groundPlantCache
 * @property {Array} purchasingVehicleCache
 * @property {Array} rentingVehicleCache
 * @property {Array} atmLocationCache
 * @property {Array.<ServerVehicle>} burningVehicleCache
 * @property {Array} singleUseVehicle
 */
let serverData = {
	bans: [],
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
	payPhones: [],
	scenarios: [],
	callBoxes: [],
	localeStrings: {},
	groundItemCache: [],
	groundPlantCache: [],
	purchasingVehicleCache: [],
	rentingVehicleCache: [],
	atmLocationCache: [],
	draggingPlayersCache: [],
	burningVehicleCache: [],
	singleUseVehicle: {},
};

// ===========================================================================