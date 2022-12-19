// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: const.js
// DESC: Provides shared constants
// TYPE: Shared (JavaScript)
// ===========================================================================

"use strict";

// Label Types
const V_LABEL_JOB = 1;
const V_LABEL_BUSINESS = 2;
const V_LABEL_HOUSE = 3;
const V_LABEL_EXIT = 4;

// Log Levels
const LOG_ALL = -1;
const LOG_NONE = 0;
const LOG_INFO = 1;
const LOG_WARN = 2;
const LOG_ERROR = 4;
const LOG_VERBOSE = 8;
const LOG_DEBUG = 16;

// Weapon Damage Event Types
const V_WEAPON_DAMAGE_EVENT_NONE = 0;
const V_WEAPON_DAMAGE_EVENT_NORMAL = 1;
const V_WEAPON_DAMAGE_EVENT_TAZER = 2;
const V_WEAPON_DAMAGE_EVENT_EXTINGUISH = 3;
const V_WEAPON_DAMAGE_EVENT_MACE = 4;

// Games
const V_GAME_GTA_III = 1;
const V_GAME_GTA_VC = 2;
const V_GAME_GTA_SA = 3;
const V_GAME_GTA_IV = 5;
const V_GAME_GTA_IV_EFLC = 6;
const V_GAME_GTA_V = 50;
const V_GAME_MAFIA_ONE = 10;
const V_GAME_MAFIA_TWO = 11;
const V_GAME_MAFIA_THREE = 12;
const V_GAME_MAFIA_ONE_DE = 13;

// Key States
const V_KEYSTATE_NONE = 0;
const V_KEYSTATE_UP = 1;
const V_KEYSTATE_DOWN = 2;
const V_KEYSTATE_HOLDSHORT = 3;
const V_KEYSTATE_HOLDLONG = 4;
const V_KEYSTATE_COMBO = 4;

// Business Label Info Types
const V_PROPLABEL_INFO_NONE = 0;
const V_PROPLABEL_INFO_BUY = 1;
const V_PROPLABEL_INFO_ENTER = 2;
const V_PROPLABEL_INFO_ENTERVEHICLE = 3;
const V_PROPLABEL_INFO_REFUEL = 4;
const V_PROPLABEL_INFO_REPAIR = 5;
const V_PROPLABEL_INFO_BUYHOUSE = 6;
const V_PROPLABEL_INFO_RENTHOUSE = 7;
const V_PROPLABEL_INFO_BUYBIZ = 8;

// Animation Types
const V_ANIMTYPE_NONE = 0;
const V_ANIMTYPE_NORMAL = 1;
const V_ANIMTYPE_BLEND = 2;
const V_ANIMTYPE_SHARED = 3;                  // Forces this animation to play in sync with another ped's mirrored anim (handshake, kiss, gang signs, etc)
const V_ANIMTYPE_SPECIALACTION = 4;           // This animtype uses a special action (only in SA)
const V_ANIMTYPE_SURRENDER = 5;               // This animtype is used to surrender (like handsup or cower)
const V_ANIMTYPE_FORCED = 6;                  // This animtype is forced (can't use stopanim to get out of it)
const V_ANIMTYPE_FREEZE = 7;                  // This animtype is forced (can't use stopanim to get out of it)

// Animation Move Types
const V_ANIMMOVE_NONE = 0;
const V_ANIMMOVE_FORWARD = 1;
const V_ANIMMOVE_BACK = 2;
const V_ANIMMOVE_LEFT = 3;
const V_ANIMMOVE_RIGHT = 4;

// Multiplayer Modifications
const V_MPMOD_NONE = 0;
const V_MPMOD_GTAC = 1;
const V_MPMOD_MAFIAC = 2;
const V_MPMOD_OAKWOOD = 3;
const V_MPMOD_RAGEMP = 4;

// Business/House Game Script States
//const V_GAMESCRIPT_NONE = 0;
//const V_GAMESCRIPT_DENY = 1;
//const V_GAMESCRIPT_ALLOW = 2;
//const V_GAMESCRIPT_FORCE = 3;

// Vehicle Purchase States
const V_VEHBUYSTATE_NONE = 0;
const V_VEHBUYSTATE_TESTDRIVE = 1;
const V_VEHBUYSTATE_EXITVEH = 2;
const V_VEHBUYSTATE_FARENOUGH = 3;
const V_VEHBUYSTATE_WRONGVEH = 4;

// Islands
const V_ISLAND_NONE = 0;                       // None
const V_ISLAND_PORTLAND = 0;                   // Portland Island
const V_ISLAND_STAUNTON = 1;                   // Staunton Island
const V_ISLAND_SHORESIDEVALE = 2;              // Shoreside Vale
const V_ISLAND_VICEWEST = 0;                   // Western Island of VC
const V_ISLAND_VICEEAST = 1;                   // Eastern Island of VC
const V_ISLAND_LOSSANTOS = 0;                  // Los Santos
const V_ISLAND_LASVENTURAS = 1;                // Las Venturas
const V_ISLAND_SANFIERRO = 2;                  // San Fierro
const V_ISLAND_REDCOUNTYNORTH = 4;             // Red County North (spans all the way from Palamino/shore on the east east to border of Flint County on the west)
const V_ISLAND_BONECOUNTYNORTH = 5;            // Bone County North (usually called Tierra Robada)
const V_ISLAND_BONECOUNTYSOUTH = 6;            // Bone County South

// Body Parts for Skin Select (IV for now, but might do other games when I can add accessory objects)
const V_SKINSELECT_NONE = 0;
const V_SKINSELECT_SKIN = 1;
const V_SKINSELECT_HAT = 2;
const V_SKINSELECT_HAIR = 3;
const V_SKINSELECT_EYES = 5;
const V_SKINSELECT_UPPER = 6;
const V_SKINSELECT_LOWER = 7;
const V_SKINSELECT_SHOES = 8;
const V_SKINSELECT_LEFTWRIST = 9;
const V_SKINSELECT_RIGHTWRIST = 10;
const V_SKINSELECT_LEFTHAND = 11;
const V_SKINSELECT_RIGHTHAND = 12;
const V_SKINSELECT_HEAD = 13;

// Action States for NPCs
const V_NPC_ACTION_NONE = 0;
const V_NPC_ACTION_ANIM = 1;
const V_NPC_ACTION_WALKTO = 2;
const V_NPC_ACTION_RUNTO = 3;
const V_NPC_ACTION_SPRINTTO = 4;
const V_NPC_ACTION_FOLLOW = 5;
const V_NPC_ACTION_DEFEND = 6;
const V_NPC_ACTION_GUARD_AREA = 7;

// Vehicle Seats
const V_VEHSEAT_DRIVER = 0;
const V_VEHSEAT_FRONTPASSENGER = 1;
const V_VEHSEAT_REARLEFTPASSENGER = 2;
const V_VEHSEAT_REARRIGHTPASSENGER = 3;