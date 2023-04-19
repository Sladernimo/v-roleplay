// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: main.js
// DESC: Main client script (will be reorganized into individual files later)
// TYPE: Client (JavaScript)
// ===========================================================================

let resourceReady = false;
let resourceStarted = false;

let inSphere = false;
let inVehicle = false;
let inVehicleSeat = false;
let isWalking = false;
let isSpawned = false;

//let parkedVehiclePosition = false;
//let parkedVehicleHeading = false;

let renderHUD = false;
let renderLabels = false;
let renderLogo = false;
let renderSmallGameMessage = false;
let renderScoreBoard = false;
let renderHotBar = false;
let renderItemActionDelay = false;
let renderInteriorLights = false;

let logLevel = LOG_INFO | LOG_DEBUG;

let weaponDamageEnabled = {};
let weaponDamageEvent = {};
let weaponDamageMultiplier = 1.0;

let forceWeapon = 0;
let forceWeaponAmmo = 0;
let forceWeaponClipAmmo = 0;

let drunkEffectAmount = 0;
let drunkEffectDurationTimer = null;

let controlsEnabled = true;

let interiorLightsEnabled = true;
let interiorLightsColour = toColour(0, 0, 0, 150);

let mouseCameraEnabled = false;
let mouseCursorEnabled = false;

let currentPickup = null;

let forceWantedLevel = 0;

// Pre-cache all allowed skins
let allowedSkins = getAllowedSkins(getGame());

/**
 * @typedef {Object} ServerData
 * @property {Array.<HouseData>} houses
 * @property {Array.<BusinessData>} businesses
 * @property {Array.<VehicleData>} vehicles
 * @property {Array.<JobData>} jobs
 * @property {Array} localeStrings
 * @property {Array} localeOptions
 * @property {Object} cvars
 * @property {Array.<PayPhoneData>} payPhones
*/
let serverData = {
	houses: [],
	businesses: [],
	vehicles: [],
	jobs: [],
	localeStrings: [],
	localeOptions: [],
	cvars: {},
	payPhones: [],
};

let localPlayerMoney = 0;

let currencyString = "${AMOUNT}";

let mapChangeWarning = false;
let mapChangeToNight = false;

let myToken = "";

let godMode = false;

let scriptInitialized = false;

// ===========================================================================
