// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
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

let garbageCollectorInterval = null;

//let parkedVehiclePosition = false;
//let parkedVehicleHeading = false;

let renderHUD = true;
let renderLabels = true;
let renderLogo = true;
let renderSmallGameMessage = true;
let renderScoreBoard = true;
let renderHotBar = true;
let renderItemActionDelay = true;
let renderInteriorLights = true;

let logLevel = LOG_INFO | LOG_DEBUG;

let weaponDamageEnabled = {};
let weaponDamageEvent = {};

let forceWeapon = 0;
let forceWeaponAmmo = 0;
let forceWeaponClipAmmo = 0;

let drunkEffectAmount = 0;
let drunkEffectDurationTimer = null;

let controlsEnabled = true;

let streamingRadio = null;
let streamingRadioVolume = 50;
let streamingRadioElement = false;

let enterPropertyKey = null;
let disableGUIKey = getKeyIdFromParams("insert");

let inAnimation = false;
let forcedAnimation = null;

let calledDeathEvent = false;

let interiorLightsEnabled = true;
let interiorLightsColour = toColour(0, 0, 0, 150);

let mouseCameraEnabled = false;
let mouseCursorEnabled = false;

let currentPickup = false;

let vehiclePurchaseState = AGRP_VEHBUYSTATE_NONE;
let vehiclePurchasing = null;
let vehiclePurchasePosition = null;

let forceWantedLevel = 0;

let guiSubmitKey = false;
let guiLeftKey = false;
let guiRightKey = false;
let guiUpKey = false;
let guiDownKey = false;

// Pre-cache all allowed skins
let allowedSkins = getAllowedSkins(getGame());

let profanityFilterEnabled = false;

let localLocaleId = 0;

/**
 * @typedef {Object} ServerData
 * @property {Array.<HouseData>} houses
 * @property {Array.<BusinessData>} businesses
 * @property {Array.<VehicleData>} vehicles
 * @property {Array} localeStrings
 * @property {Array} localeOptions
 * @property {Object} cvars
*/
let serverData = {
	houses: [],
	businesses: [],
	localeStrings: [],
	localeOptions: [],
	vehicles: [],
	jobs: [],
	cvars: {},
};

let localPlayerMoney = 0;
let localPlayerMoneyInterval = null;

let currencyString = "${AMOUNT}";

let mapChangeWarning = false;

let cruiseControlEnabled = false;
let cruiseControlSpeed = 0.0;

// ===========================================================================
