// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
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

let parkedVehiclePosition = false;
let parkedVehicleHeading = false;

let renderHUD = true;
let renderLabels = true;
let renderLogo = true;
let renderSmallGameMessage = true;
let renderScoreBoard = true;
let renderHotBar = true;
let renderItemActionDelay = true;
let renderInteriorLights = true;

let logLevel = LOG_INFO|LOG_DEBUG|LOG_VERBOSE;

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

let currentPickup = false;

let vehiclePurchaseState = VRR_VEHBUYSTATE_NONE;
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

let localLocaleId = 0;

let serverData = {
	houses: [],
	businesses: [],
	localeStrings: [],
	localeOptions: [],
	vehicles: [],
	jobs: [],
};

// ===========================================================================
