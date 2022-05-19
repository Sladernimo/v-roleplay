// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: const.js
// DESC: Provides constants
// TYPE: Server (JavaScript)
// ===========================================================================

// Prompts (used for client GUI prompt responses)
const VRR_PROMPT_NONE = 0;
const VRR_PROMPT_CREATEFIRSTCHAR = 1;
const VRR_PROMPT_BIZORDER = 2;
const VRR_PROMPT_VEHGIVETOCLAN = 3;
const VRR_PROMPT_HOUSEGIVETOCLAN = 4;
const VRR_PROMPT_BIZGIVETOCLAN = 5;
const VRR_PROMPT_HOUSEBUY = 6;
const VRR_PROMPT_BIZBUY = 7;

// Job Types
const VRR_JOB_NONE = 0;
const VRR_JOB_POLICE = 1;
const VRR_JOB_MEDICAL = 2;
const VRR_JOB_FIRE = 3;
const VRR_JOB_BUS = 4;
const VRR_JOB_TAXI = 5;
const VRR_JOB_GARBAGE = 6;
const VRR_JOB_WEAPON = 7;
const VRR_JOB_DRUG = 8;
const VRR_JOB_PIZZA = 9;
const VRR_JOB_GENERIC = 10;

// Pickup Types
const VRR_PICKUP_NONE = 0;
const VRR_PICKUP_JOB = 1;
const VRR_PICKUP_BUSINESS_ENTRANCE = 2;
const VRR_PICKUP_BUSINESS_EXIT = 3;
const VRR_PICKUP_HOUSE_ENTRANCE = 4;
const VRR_PICKUP_HOUSE_EXIT = 5;
const VRR_PICKUP_EXIT = 6;

// Vehicle Owner Types
const VRR_VEHOWNER_NONE = 0;                     // Not owned
const VRR_VEHOWNER_PLAYER = 1;                   // Owned by a player (character/subaccount)
const VRR_VEHOWNER_JOB = 2;                      // Owned by a job
const VRR_VEHOWNER_CLAN = 3;                     // Owned by a clan
const VRR_VEHOWNER_FACTION = 4;                  // Owned by a faction (not used at the moment)
const VRR_VEHOWNER_PUBLIC = 5;                   // Public vehicle. Anybody can drive it.
const VRR_VEHOWNER_BIZ = 6;                      // Owned by a business (also includes dealerships since they're businesses)

// Business Owner Types
const VRR_BIZOWNER_NONE = 0;                     // Not owned
const VRR_BIZOWNER_PLAYER = 1;                   // Owned by a player (character/subaccount)
const VRR_BIZOWNER_JOB = 2;                      // Owned by a job
const VRR_BIZOWNER_CLAN = 3;                     // Owned by a clan
const VRR_BIZOWNER_FACTION = 4;                  // Owned by a faction (not used at the moment)
const VRR_BIZOWNER_PUBLIC = 5;                   // Public Business. Used for goverment/official places like police, fire, city hall, DMV, etc

// House Owner Types
const VRR_HOUSEOWNER_NONE = 0;                   // Not owned
const VRR_HOUSEOWNER_PLAYER = 1;                 // Owner is a player (character/subaccount)
const VRR_HOUSEOWNER_JOB = 2;                    // Owned by a job
const VRR_HOUSEOWNER_CLAN = 3;                   // Owned by a clan
const VRR_HOUSEOWNER_FACTION = 4;                // Owned by a faction
const VRR_HOUSEOWNER_PUBLIC = 5;                 // Is a public house. Technically not owned. This probably won't be used.
const VRR_HOUSEOWNER_BIZ = 6;	                 // Owned by a business. Used for apartment buildings where rent goes to business.

// Gate Owner Types
const VRR_GATEOWNER_NONE = 0;                   // Not owned
const VRR_GATEOWNER_PLAYER = 1;                 // Owner is a player (character/subaccount)
const VRR_GATEOWNER_JOB = 2;                    // Owned by a job
const VRR_GATEOWNER_CLAN = 3;                   // Owned by a clan
const VRR_GATEOWNER_FACTION = 4;                // Owned by a faction
const VRR_GATEOWNER_PUBLIC = 5;                 // Public gate. Technically not owned. This probably won't be used.
const VRR_GATEOWNER_BUSINESS = 6;               // Owned by a business. Back lots, unloading areas, and other stuff like that
const VRR_GATEOWNER_HOUSE = 7;                  // Owned by a house. Like for mansions with closed private areas.

// Business Location Types
const VRR_BIZLOC_NONE = 0;                       // None
const VRR_BIZLOC_GATE = 1;                       // Center of any moveable gate that belongs to the biz
const VRR_BIZLOC_GARAGE = 2;                     // Location for attached garage (pos1 = outside, pos2 = inside). Use pos to teleport or spawn veh/ped
const VRR_BIZLOC_FUEL = 3;                       // Fuel pump
const VRR_BIZLOC_DRIVETHRU = 4;                  // Drivethrough
const VRR_BIZLOC_VENDMACHINE = 5;                // Vending machine

// House Location Types
const VRR_HOUSELOC_NONE = 0;                     // None
const VRR_HOUSELOC_GATE = 1;                     // Center of any moveable gate that belongs to the house
const VRR_HOUSELOC_GARAGE = 2;                   // Location for garage (pos1 = outside, pos2 = inside). Use pos to teleport or spawn veh/ped

// Account Contact Types
const VRR_CONTACT_NONE = 0;
const VRR_CONTACT_NEUTRAL = 1;                   // Contact is neutral. Used for general contacts with no special additional features
const VRR_CONTACT_FRIEND = 2;                    // Contact is a friend. Shows when they're online.
const VRR_CONTACT_BLOCKED = 3;                   // Contact is blocked. Prevents all communication to/from them except for RP

// Job Work Types (Currently Unused)
const VRR_JOBWORKTYPE_NONE = 0;
const VRR_JOBWORKTYPE_ROUTE = 1;                 // Jobs that use routes. Bus, trash collector, mail, etc
const VRR_JOBWORKTYPE_SELL = 2;                  // Jobs that sell items to other players and NPCs. Drugs, guns, etc
const VRR_JOBWORKTYPE_SERVICE = 3;               // Services to other players and NPCs. Taxi ride, mechanic fix, etc

// Vehicle Seats
const VRR_VEHSEAT_DRIVER = 0;
const VRR_VEHSEAT_FRONTPASSENGER = 1;
const VRR_VEHSEAT_REARLEFTPASSENGER = 2;
const VRR_VEHSEAT_REARRIGHTPASSENGER = 3;

// Ban Types
const VRR_BANTYPE_NONE = 0;
const VRR_BANTYPE_ACCOUNT = 1;
const VRR_BANTYPE_SUBACCOUNT = 2;
const VRR_BANTYPE_IPADDRESS = 3;
const VRR_BANTYPE_SUBNET = 4;

// Blip Owner Types
const VRR_BLIP_NONE = 0;
const VRR_BLIP_JOB = 1;
const VRR_BLIP_BUSINESS_ENTRANCE = 2;
const VRR_BLIP_BUSINESS_EXIT = 3;
const VRR_BLIP_HOUSE_ENTRANCE = 4;
const VRR_BLIP_HOUSE_EXIT = 5;
const VRR_BLIP_EXIT = 6;

// Insurance Account Owner Types
const VRR_INS_ACCT_OWNER_NONE = 0;               // None
const VRR_INS_ACCT_OWNER_PLAYER = 1;             // Player owns insurance company
const VRR_INS_ACCT_OWNER_BIZ = 2;                // Business owns insurance company
const VRR_INS_ACCT_OWNER_CLAN = 3;               // Clan owns insurance company

// Insurance Account Entity Types
const VRR_INS_ACCT_ENTITY_NONE = 0;              // None
const VRR_INS_ACCT_ENTITY_PLAYER_HEALTH = 1;     // Health Insurance
const VRR_INS_ACCT_ENTITY_PLAYER_LIFE = 2;       // Life Insurance
const VRR_INS_ACCT_ENTITY_VEH = 3;               // Vehicle Insurance
const VRR_INS_ACCT_ENTITY_BIZ = 4;               // Business Insurance
const VRR_INS_ACCT_ENTITY_HOUSE = 5;             // House Insurance

// Insurance Account History Types
const VRR_INS_ACCT_HISTORY_NONE = 0;             // None
const VRR_INS_ACCT_HISTORY_PLAYER_MEDICAL = 1;   // Medical insurance was used (player disease/injury)
const VRR_INS_ACCT_HISTORY_PLAYER_DEATH = 2;     // Life insurance was used (player death)
const VRR_INS_ACCT_HISTORY_VEH_DAMAGE = 3;       // Vehicle was damaged, but not destroyed
const VRR_INS_ACCT_HISTORY_VEH_WRECKED = 4;      // Vehicle was completely destroyed
const VRR_INS_ACCT_HISTORY_VEH_THEFT = 5;        // Vehicle was stolen
const VRR_INS_ACCT_HISTORY_BIZ_DAMAGE = 6;       // Business was damaged (broken items/window/door)
const VRR_INS_ACCT_HISTORY_BIZ_THEFT = 7;        // Business was stolen from
const VRR_INS_ACCT_HISTORY_HOUSE_DAMAGE = 8;     // House was damaged
const VRR_INS_ACCT_HISTORY_HOUSE_THEFT = 9;      // House was stolen from

// Islands
const VRR_ISLAND_NONE = 0;                       // None
const VRR_ISLAND_PORTLAND = 0;                   // Portland Island
const VRR_ISLAND_STAUNTON = 1;                   // Staunton Island
const VRR_ISLAND_SHORESIDEVALE = 2;              // Shoreside Vale
const VRR_ISLAND_VICEWEST = 0;                   // Western Island of VC
const VRR_ISLAND_VICEEAST = 1;                   // Eastern Island of VC
const VRR_ISLAND_LOSSANTOS = 0;                  // Los Santos
const VRR_ISLAND_LASVENTURAS = 1;                // Las Venturas
const VRR_ISLAND_SANFIERRO = 2;                  // San Fierro
const VRR_ISLAND_REDCOUNTYNORTH = 4;             // Red County North (spans all the way from Palamino/shore on the east east to border of Flint County on the west)
const VRR_ISLAND_BONECOUNTYNORTH = 5;            // Bone County North (usually called Tierra Robada)
const VRR_ISLAND_BONECOUNTYSOUTH = 6;            // Bone County South

// Item Owners
const VRR_ITEM_OWNER_NONE = 0;                   // None
const VRR_ITEM_OWNER_PLAYER = 1;                 // Item is in a player's inventory
const VRR_ITEM_OWNER_VEHTRUNK = 2;               // Item is in a vehicle's trunk
const VRR_ITEM_OWNER_VEHDASH = 3;                // Item is in a vehicle's glove compartment
const VRR_ITEM_OWNER_BIZFLOOR = 4;               // Item is in the public area of a business (on the floor = ready to buy)
const VRR_ITEM_OWNER_BIZSTORAGE = 5;             // Item is in a business's storage area (stock room)
const VRR_ITEM_OWNER_HOUSE = 6;                  // Item is in a house
const VRR_ITEM_OWNER_SAFE = 7;                   // Item is in a safe (safes can be anywhere)
const VRR_ITEM_OWNER_ITEM = 8;                   // Item is in another item (trashbag, briefcase, wallet, suitcase, crate/box, barrel, etc)
const VRR_ITEM_OWNER_GROUND = 9;                 // Item is on the ground
const VRR_ITEM_OWNER_JOBLOCKER = 10;             // Item is in player's job locker
const VRR_ITEM_OWNER_LOCKER = 10;                // Item is in player's locker

// Item Use Types
const VRR_ITEM_USETYPE_NONE = 0;                 // Has no effect
const VRR_ITEM_USETYPE_WEAPON = 1;               // Equips weapon
const VRR_ITEM_USETYPE_AMMO_CLIP = 2;            // Magazine for weapon. If in inventory, R will load it into gun
const VRR_ITEM_USETYPE_PHONE = 3;                // Pulls out phone
const VRR_ITEM_USETYPE_GPS = 4;                  // Not sure how I want this to work yet
const VRR_ITEM_USETYPE_MAP = 5;                  // Shows minimap on HUD
const VRR_ITEM_USETYPE_SKIN = 6;                 // Changes skin (uses skin changer)
const VRR_ITEM_USETYPE_PEDPART = 7;              // Changes ped part (clothing, skin, hair, etc) (UNUSED)
const VRR_ITEM_USETYPE_PEDPROP = 8;              // Changes ped prop (watches, glasses, hats, etc) (UNUSED)
const VRR_ITEM_USETYPE_STORAGE = 9;              // Shows stored items. Backpack, crate, briefcase, wallet, etc
const VRR_ITEM_USETYPE_VEHKEY = 10;              // Locks/unlocks a vehicle and allows starting engine without hotwire
const VRR_ITEM_USETYPE_BIZKEY = 11;              // Locks/unlocks a business
const VRR_ITEM_USETYPE_HOUSEKEY = 12;            // Locks/unlocks a house
const VRR_ITEM_USETYPE_SEED = 13;                // Plants a seed
const VRR_ITEM_USETYPE_WEED = 14;                // Light drug effect (short term relief of addiction symptoms?)
const VRR_ITEM_USETYPE_COKE = 15;                // Medium drug effect (medium term relief of addiction symptoms?)
const VRR_ITEM_USETYPE_METH = 16;                // Heavy drug effect (extended term relief of addiction symptoms?)
const VRR_ITEM_USETYPE_CIGAR = 17;               // Just for appearance. Makes people look cool I guess
const VRR_ITEM_USETYPE_WATER = 18;               // Replenishes small amount of health
const VRR_ITEM_USETYPE_FOOD = 19;                // Eat food. Replenishes a small amount of health
const VRR_ITEM_USETYPE_BEER = 20;                // Subtle drunk effect. Replenishes small amount of health.
const VRR_ITEM_USETYPE_WINE = 21;                // Moderate drunk effect. Replenishes moderate amount of health.
const VRR_ITEM_USETYPE_LIQUOR = 22;              // Heavy drunk effect. Replenishes large amount of health.
const VRR_ITEM_USETYPE_COFFEE = 23;              // Replenishes moderate amount of health.
const VRR_ITEM_USETYPE_AMMO_ROUND = 23;          // Bullet. Loads into magazine. Not used at the moment
const VRR_ITEM_USETYPE_HANDCUFF = 24;            //
const VRR_ITEM_USETYPE_ROPE = 25;                //
const VRR_ITEM_USETYPE_BLINDFOLD = 26;           //
const VRR_ITEM_USETYPE_TAZER = 27;               //
const VRR_ITEM_USETYPE_ARMOUR = 28;              //
const VRR_ITEM_USETYPE_HEALTH = 29;              //
const VRR_ITEM_USETYPE_AED = 30;                 //
const VRR_ITEM_USETYPE_WALKIETALKIE = 31;        //
const VRR_ITEM_USETYPE_AREARADIO = 32;           //
const VRR_ITEM_USETYPE_PERSONALRADIO = 33;       //
const VRR_ITEM_USETYPE_BADGE = 34;               //
const VRR_ITEM_USETYPE_DRINK = 35;               // Drinkable item. Action output shows "Player_Name drinks some (drink name)"
const VRR_ITEM_USETYPE_EXTINGUISHER = 36;        // Extinguisher item. Allows putting out fires
const VRR_ITEM_USETYPE_SPRAYPAINT = 37;          // Spraypaint item. Allows spraying custom clan tags on walls
const VRR_ITEM_USETYPE_PEPPERSPRAY = 38;         // Pepper spray item. Incapacitates nearby player
const VRR_ITEM_USETYPE_FLASHLIGHT = 39;          // Flashlight item. Unusable for now, but plan to cast a custom light beam
const VRR_ITEM_USETYPE_AIRPLANETICKET = 40;      // Airplane ticket. Allows a character to move to another server
const VRR_ITEM_USETYPE_TRAINTICKET = 41;         // Train ticket. Allows a character to move to another server
const VRR_ITEM_USETYPE_VEHUPGRADE_PART = 42;     // Vehicle update part item. Allows adding custom parts like spoilers, side skirts, roof scoops, etc
const VRR_ITEM_USETYPE_VEHTIRE = 43;             // Vehicle tire item. Allows changing the tire/rim types
const VRR_ITEM_USETYPE_FUELCAN = 44;             // Fuel can item. Allows refueling of a nearby vehicle anywhere
const VRR_ITEM_USETYPE_VEHCOLOUR = 45;           // Vehicle colour item. Changes primary and secondary vehicle colours
const VRR_ITEM_USETYPE_VEHLIVERY = 46;           // Vehicle livery/paintjob item. Applies decals and special paint jobs
const VRR_ITEM_USETYPE_VEHREPAIR = 47;           // Vehicle repair item. Much longer use time
const VRR_ITEM_USETYPE_SMOKEDRUG = 48;           // Smokable drug. Action output shows "Player_Name smokes some (drug)"
const VRR_ITEM_USETYPE_SNORTDRUG = 49;           // Snortable drug. Action output shows "Player_Name snorts some (drug)"
const VRR_ITEM_USETYPE_PLANT = 50;               // Plantable item. Pot plants, coke plants, etc
const VRR_ITEM_USETYPE_MEGAPHONE = 51;           // Megaphone item. Allows shouting over greater distances. Also called a bullhorn
const VRR_ITEM_USETYPE_INJECTDRUG = 52;          // Injectable drug. Action output shows "Player_Name injects some (drug)"
const VRR_ITEM_USETYPE_ALCOHOL = 53;             // Alcohol. Applies an intoxication/drunkness effect
const VRR_ITEM_USETYPE_LOTTOTICKET = 54;         // Lotto ticket. Allows a character to enter the lottery

// Item Drop Types
const VRR_ITEM_DROPTYPE_NONE = 0;                // Can't be dropped
const VRR_ITEM_DROPTYPE_OBJECT = 1;              // Drops as an object on the ground
const VRR_ITEM_DROPTYPE_PICKUP = 2;              // Drops as a pickup
const VRR_ITEM_DROPTYPE_OBJECTLIGHT = 3;         // Object that produces an area light effect (lamp, flashlight, etc)
const VRR_ITEM_DROPTYPE_DESTROY = 4;             // Will destroy the item on drop (keys mostly but for any tiny object)
const VRR_ITEM_DROPTYPE_OBJECTSTACK = 5;         // Stackable objects (crates and such). Will sit on top of closest other stackable

// Forensic Types
const VRR_FORENSICS_NONE = 0;
const VRR_FORENSICS_BULLET = 1;                  // Bullet. The actual tip that hits a target. Has rifling and ballistics information of the weapon.
const VRR_FORENSICS_BLOOD = 2;                   // Blood. Automatically applied to ground and bullets that hit when somebody is shot
const VRR_FORENSICS_BODY = 3;                    // Body. A dead body lol
const VRR_FORENSICS_HAIR = 4;                    // Hair. Automatically applied to
const VRR_FORENSICS_SWEAT = 5;                   // Sweat. Automatically applied to clothing when worn
const VRR_FORENSICS_SALIVA = 6;                  // Saliva. Automatically applied to drinks when drank
const VRR_FORENSICS_BULLETCASINGS = 7;           // Bullet casings. Automatically dropped when fired from a weapon except when used in a vehicle (driveby)

// Account Authentication Methods
const VRR_ACCT_AUTHMETHOD_NONE = 0;              // None
const VRR_ACCT_AUTHMETHOD_EMAIL = 1;             // Email
const VRR_ACCT_AUTHMETHOD_PHONENUM = 2;          // Phone number
const VRR_ACCT_AUTHMETHOD_2FA = 3;               // Two factor authentication app (authy, google authenticator, etc)
const VRR_ACCT_AUTHMETHOD_PEBBLE = 4;            // Pebble watch (this one's for Vortrex but anybody with a Pebble can use)
const VRR_ACCT_AUTHMETHOD_PHONEAPP = 5;          // The Android/iOS companion app (will initially be a web based thing until I can get the apps created)

// Police Patrol Types
const VRR_PATROLTYPE_NONE = 0;                   // None
const VRR_PATROLTYPE_FOOT = 1;                   // Foot patrol. Officer takes a vehicle to get to their designated area and then walks a beat. More common in LC games
const VRR_PATROLTYPE_VEHICLE = 2;                // Vehicle patrol. More common in VC/LS/SF/LV cities.

// Job Route States
const VRR_JOBROUTESTATE_NONE = 0;                // None
const VRR_JOBROUTESTATE_INPROGRESS = 1;          // Route is in progress. Player is in between stops but not at the last one.
const VRR_JOBROUTESTATE_LASTSTOP = 2;            // Player is heading to the last stop on the route
const VRR_JOBROUTESTATE_PAUSED = 3;              // Route is paused for some reason. For police, this could be player accepted callout and once finished, patrol route will resume
const VRR_JOBROUTESTATE_ATSTOP = 4;              // For bus/trash stops that freeze player, this is the state when they're at one

// Item Occupied States
const VRR_ITEM_ACTION_NONE = 0;                  // None
const VRR_ITEM_ACTION_USE = 1;                   // Using item
const VRR_ITEM_ACTION_PICKUP = 2;                // Picking up item
const VRR_ITEM_ACTION_DROP = 3;                  // Dropping item
const VRR_ITEM_ACTION_SWITCH = 4;                // Switching item
const VRR_ITEM_ACTION_PUT = 5;                   // Putting item (into trunk, dash, crate, etc)
const VRR_ITEM_ACTION_TAKE = 6;                  // Taking item (from trunk, dash, crate, etc)

// Ped States
const VRR_PEDSTATE_NONE = 2;                     // None
const VRR_PEDSTATE_READY = 1;                    // Ready
const VRR_PEDSTATE_DRIVER = 2;                   // Driving a vehicle
const VRR_PEDSTATE_PASSENGER = 3;                // In a vehicle as passenger
const VRR_PEDSTATE_DEAD = 4;                     // Dead
const VRR_PEDSTATE_ENTERINGPROPERTY = 5;         // Entering a property
const VRR_PEDSTATE_EXITINGPROPERTY = 6;          // Exiting a property
const VRR_PEDSTATE_ENTERINGVEHICLE = 7;          // Entering a vehicle
const VRR_PEDSTATE_EXITINGVEHICLE = 8;           // Exiting a vehicle
const VRR_PEDSTATE_BINDED = 9;                   // Binded by rope or handcuffs
const VRR_PEDSTATE_TAZED = 10;                   // Under incapacitating effect of tazer
const VRR_PEDSTATE_INTRUNK = 11;                 // In vehicle trunk
const VRR_PEDSTATE_INITEM = 12;                  // In item (crate, box, etc)
const VRR_PEDSTATE_HANDSUP = 13;                 // Has hands up (surrendering)
const VRR_PEDSTATE_SPAWNING = 14;                // Spawning

// Two-Factor Authentication States
const VRR_2FA_STATE_NONE = 0;                    // None
const VRR_2FA_STATE_CODEINPUT = 1;               // Waiting on player to enter code to play
const VRR_2FA_STATE_SETUP_CODETOAPP = 2;         // Providing player with a code to put in their auth app
const VRR_2FA_STATE_SETUP_CODEFROMAPP = 3;       // Waiting on player to enter code from auth app to set up

// Reset Password States
const VRR_RESETPASS_STATE_NONE = 0;             // None
const VRR_RESETPASS_STATE_CODEINPUT = 1;        // Waiting on player to enter code sent via email
const VRR_RESETPASS_STATE_SETPASS = 2;          // Waiting on player to enter new password

// NPC Trigger Condition Match Types
const VRR_NPC_COND_MATCH_NONE = 0;               // None (invalid)
const VRR_NPC_COND_MATCH_EQ = 1;                 // Must be equal to
const VRR_NPC_COND_MATCH_GT = 2;                 // Must be greater than
const VRR_NPC_COND_MATCH_LT = 3;                 // Must be less than
const VRR_NPC_COND_MATCH_GTEQ = 4;               // Must be greater than or equal to
const VRR_NPC_COND_MATCH_LTEQ = 5;               // Must be less than or equal to
const VRR_NPC_COND_MATCH_CONTAINS = 6;           // Must contain string (case insensitive)
const VRR_NPC_COND_MATCH_CONTAINS_CASE = 7;      // Must contain string (case sensitive)
const VRR_NPC_COND_MATCH_EXACT = 8;              // Must match string exactly (case insensitive)
const VRR_NPC_COND_MATCH_EXACT_CASE = 9;         // Must match string exactly (case insensitive)

// Business Types
const VRR_BIZ_TYPE_NONE = 0;                     // None (invalid)
const VRR_BIZ_TYPE_NORMAL = 1;                   // Normal business (sells items)
const VRR_BIZ_TYPE_BANK = 2;                     // Bank
const VRR_BIZ_TYPE_PUBLIC = 3;                   // Public business (Government, public service, etc)

// Return-To types (for when a player is teleported)
const VRR_RETURNTO_TYPE_NONE = 0;                // "Return to" data is invalid
const VRR_RETURNTO_TYPE_ADMINGET = 1;            // "Return to" data is from admin teleporting
const VRR_RETURNTO_TYPE_SKINSELECT = 2;          // "Return to" data is from skin select

// Card Game Types
const VRR_DECKCARD_GAME_NONE = 0;                // None (invalid)
const VRR_DECKCARD_GAME_BLACKJACK = 1;           // Blackjack
const VRR_DECKCARD_GAME_TEXASHOLDEM = 2;         // Texas Hold-em
const VRR_DECKCARD_GAME_FIVECARDDRAW = 3;        // Five Card Draw
const VRR_DECKCARD_GAME_FIVECARDSTUD = 4;        // Five Card Stud
const VRR_DECKCARD_GAME_HIGHLOW = 5;             // High-Low (Also known as War)

// Card Suits
const VRR_DECKCARD_SUIT_NONE = 0;                // None (invalid)
const VRR_DECKCARD_SUIT_SPADE = 1;               // Spades
const VRR_DECKCARD_SUIT_CLUB = 2;                // Clubs
const VRR_DECKCARD_SUIT_HEART = 3;               // Hearts
const VRR_DECKCARD_SUIT_DIAMOND = 4;             // Diamonds

// GPS State Types
const VRR_GPS_TYPE_NONE = 0;                     // None (invalid)
const VRR_GPS_TYPE_BUSINESS = 1;                 // Business
const VRR_GPS_TYPE_POLICE = 2;                   // Police Station
const VRR_GPS_TYPE_HOSPITAL = 3;                 // Hospital
const VRR_GPS_TYPE_JOB = 4;                      // Job
const VRR_GPS_TYPE_GAMELOC = 5;                  // Game Location

// Discord Webhook Types
const VRR_DISCORD_WEBHOOK_NONE = 0;
const VRR_DISCORD_WEBHOOK_LOG = 1;
const VRR_DISCORD_WEBHOOK_ADMIN = 2;