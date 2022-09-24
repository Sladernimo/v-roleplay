// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: bitflags.js
// DESC: Provides bitwise operations, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

let serverBitFlags = {
	staffFlags: {},
	moderationFlags: {},
	factionFlags: {},
	clanFlags: {},
	accountSettingsFlags: {},
	subAccountSettingsFlags: {},
	accountFlags: {},
	seenActionTipsFlags: {},
	npcTriggerTypeFlags: {},
	npcTriggerConditionTypesFlags: {},
	npcTriggerResponseTypeFlags: {},
};

// ===========================================================================

let serverBitFlagKeys = {
	staffFlagKeys: [
		"None",
		"BasicModeration",
		"ManageHouses",
		"ManageVehicles",
		"ManageBusinesses",
		"ManageClans",
		"ManageServer",
		"ManageAdmins",
		"ManageJobs",
		"ManageItems",
		"ManageWorld",
		"ManageAntiCheat",
		"Developer",
		"ManageNPCs",
		"ManageRaces",
	],
	moderationFlagKeys: [
		"None",
		"Muted",
		"Frozen",
		"HackerBox",
		"WeaponBanned",
		"JobBanned",
		"AmmuBanned",
		"NoSkinCustomization",
		"DesyncWeapons",
		"HackerWorld",
		"AdminJailed",
		"ExemptFromAntiCheat",
		"ExemptFromBans",
		"ForceTutorial",
		"CharacterNameNeedsStaffApproval",
		"EmailVerified",
		"TwoFactorAuthVerified",
		"NonRoleplayCharacterName",
		"CanHearEverything",
		"DontSyncClientElements",
		"IsTester"
	],
	/*
	factionFlagKeys: [
		"None",
		"Police",
		"Medical",
		"Fire",
		"Government",
		"Generic",
	],
	*/
	clanTypeFlagKeys: [
		"None",
		"Illegal",
		"Legal",
		"Mafia",
		"StreetGang",
		"Weapons",
		"Drugs",
		"HumanTrafficking",
		"Vigilante",
		"HitContracts"
	],
	clanFlagKeys: [
		"None",
		"StartTurfWar",
		"StartPointWar",
		"InviteMember",
		"SuspendMember",
		"RemoveMember",
		"MemberRank",
		"ClanTag",
		"ClanName",
		"ManageVehicles",
		"ManageHouses",
		"ManageBusinesses",
		"ManageNPCs",
		"ManageRanks",
		"Owner",
	],
	clanDiscordWebhookFlagKeys: [
		"None",
		"ClanName",
		"ClanMOTD",
		"ClanTag",
		"ClanRankEdit",
		"ClanRankSet",
		"ClanVehicleEdit",
		"ClanHouseEdit",
		"ClanBusinessEdit",
		"ClanNPCEdit",
		"ClanMemberInvite",
		"ClanMemberRemove",
		"ClanMemberSuspend",
		"ClanRankFlagSet",
		"ClanTurfWar",
		"ClanPointWar",
	],
	accountSettingsFlagKeys: [
		"None",
		"UseWhiteList",
		"UseBlackList",
		"TwoStepAuth",
		"AuthAttemptAlert",
		"NoGUI",
		"AutoLoginIP",
		"NoServerLogo",
		"AutoSelectLastCharacter",
		"ShowRealTimeClock",
		"UseGUIForItems",
		"UseRadialWheelItems", // If this is disabled, use MMORPG-style hotbar IF UseGUIForItems is enabled
		"NoKeyBinds",
		"NoRandomTips",
		"NoActionTips",
		"ChatBoxTimestamps",
		"ProfanityFilter",
		"ChatAutoHide",
		"NoPlayerContent",
		"ChatEmoji",
		//"NoBlood",
	],

	// Not going to be used. Use trigger, condition, and response stuff in trigger.js
	npcTriggerTypeKeys: [
		"None",
		"FarProximity",               // Comes within a far distance of NPC
		"MediumProximity",            // Comes within a medium distance of NPC
		"NearProximity",              // Comes within a close distance of NPC
		"EnterLineOfSight",           // Enters the NPC's line of sight
		"ExitLineOfSight",            // Leaves the NPC's line of sight
		"PedCollision",               // Bumps into ped on foot
		"VehicleCollision",           // Bumps into ped with a vehicle
		"ShootGun",                   // Shoots a gun (target isn't a factor, it's just about only shooting a gun in general)
		"SwingMelee",                 // Swings a melee weapon (target doesnt matter, it's just about only swinging a melee weapon in general)
		"HotwireVehicleStart",        // Begin attempt to hotwire a vehicle
		"HotwireVehicleFail",         // Failed to hotwire a vehicle
		"HotwireVehicleSucceed",      // Succeeded at hotwiring a vehicle
		"VehicleAlarmStart",          // Vehicle alarm goes off
		"VehicleAlarmStop",           // Vehicle alarm shuts off (disabled, battery dead, damaged, or just turned off legitly)
		"SirenStart",                 // Any vehicle with a siren that gets activated
		"SirenStop",                  // Any vehicle with a siren that gets deactivated
		"VehicleEnter",               // Enters any vehicle
		"VehicleExit",                // Exits any vehicle
		"PropertyEnter",              // Enters any interior
		"PropertyExit",               // Exits any interior
		"AttackedByMelee",            // Any element is attacked by melee weapon
		"AttackedByGun",              // Any element is attacked by gun
		"AttackedByFist",             // Any element is attacked by fist
	],
	npcTriggerConditionTypeKeys: [
		"None",
		"IsInLineOfSight",
		"IsFarProximity",
		"IsMediumProximity",
		"IsNearProximity",
		"IsEnemyClan",
		"IsAllyClan",
		"IsSameClan",
		"IsNotInClan",
		"IsLawEnforcement",
		"IsFirefighter",
		"IsParamedic",
		"IsCriminal",
		"HasWantedLevel",
		"IsSelfVehicle",
		"IsPlayerVehicle",
		"IsOtherVehicle",
		"IsClanVehicle",
		"IsEmergencyVehicle",
		"IsPoliceVehicle",
		"IsDriver",
		"IsInFrontSeat",
		"IsInSeatId",
		"VehicleLocked",
		"VehicleHotwired",
		"IsPistol",
		"IsShotgun",
		"IsAutomatic",
		"IsRifle",
		"IsAssaultRifle",
		"IsSniper",
		"IsRPG",
		"IsFlameThrower",
		"IsTalking",
		"IsShouting",
		"IsWhispering",
	],
	npcTriggerResponseTypeKeys: [
		"None",
		"Shout",
		"Talk",
		"Whisper",
		"SwitchWeapon",
		"ShootWeapon",
		"AimWeapon",
		"FleeSprint",
		"FleeWalk",
		"FleeRun",
		"AttackMelee",
		"AttackFist",
		"WalkToward",
		"RunToward",
		"SprintToward",
		"Crouch",
		"PhoneCall",
		"WalkieTalkieMessage",
		"SwitchRadioStation",
		"ToggleSiren",
		"FleeTo",
		"DriveTo",
		"EnterVehicle",
		"ExitVehicle",
		"PullOutOfVehicle",
		"EnterProperty",
		"SearchArea",
	],
	seenActionTipsKeys: [
		"None",
		"VehicleEngineOffWhenEntering",
		"VehicleLockedAfterEntryAttempt",
		"ShowItemsAfterPurchase",
		"BuyCommandAfterEnterBusiness",
		"UseItemKeyAfterEquipping",
		"UseItemKeyAfterEquippingWalkieTalkie",
		"RadioCommandAfterEnablingWalkieTalkie",
		"ReplyToDirectMessage",
		"UseItemKeyAmmoAfterEquippingWeapon",
		"AnimationStop",
		"JobEquipmentInventory",
		"ViewInventory",
		"VehicleRepairItemUsage",
		"VehicleColourItemUsage",
		"VehiclePartItemUsage",
		"AmmoClipItemUsage",
		"GenericItemUsage",
		"EnterJobVehicleForRoute",
		"JobLocations",
		"JobRouteStart",
	],
	jobRankKeys: [
		"None",
		"PublicAccess",
		"WhiteList",
		"BlackList",
		"SetRank",
		"SetPay",
		"ManageUniforms",
		"ManageEquipment",
		"ManageVehicles",
		"ManageBusinesses",
		"Leader",
	],
};

// ===========================================================================

function initBitFlagScript() {
	logToConsole(LOG_DEBUG, "[AGRP.BitFlag]: Initializing bit flag script ...");
	serverBitFlags.staffFlags = createBitFlagTable(serverBitFlagKeys.staffFlagKeys);
	serverBitFlags.moderationFlags = createBitFlagTable(serverBitFlagKeys.moderationFlagKeys);
	serverBitFlags.accountSettingsFlags = createBitFlagTable(serverBitFlagKeys.accountSettingsFlagKeys);
	//serverBitFlags.subAccountSettingsFlags = createBitFlagTable(getServerData().subAccountSettingsFlagKeys);
	serverBitFlags.clanFlags = createBitFlagTable(serverBitFlagKeys.clanFlagKeys);
	serverBitFlags.clanTypeFlags = createBitFlagTable(serverBitFlagKeys.clanTypeFlagKeys);
	serverBitFlags.clanDiscordWebhookFlags = createBitFlagTable(serverBitFlagKeys.clanDiscordWebhookFlagKeys);
	//serverBitFlags.factionFlags = createBitFlagTable(serverBitFlagKeys.factionFlagKeys);
	serverBitFlags.npcTriggerTypes = createBitFlagTable(serverBitFlagKeys.npcTriggerTypeKeys);
	serverBitFlags.npcTriggerConditionTypes = createBitFlagTable(serverBitFlagKeys.npcTriggerConditionTypeKeys);
	serverBitFlags.npcTriggerResponseTypes = createBitFlagTable(serverBitFlagKeys.npcTriggerResponseTypeKeys);
	serverBitFlags.seenActionTips = createBitFlagTable(serverBitFlagKeys.seenActionTipsKeys);
	serverBitFlags.jobRankFlags = createBitFlagTable(serverBitFlagKeys.jobRankKeys);
	logToConsole(LOG_INFO, "[AGRP.BitFlag]: Bit flag script initialized successfully!");
	return true;
}

// ===========================================================================

function doesPlayerHaveStaffPermission(client, requiredFlags) {
	if (isConsole(client)) {
		return true;
	}

	if (requiredFlags == getStaffFlagValue("None")) {
		return true;
	}

	let staffFlags = 0;
	if (getPlayerData(client)) {
		staffFlags = getPlayerData(client).accountData.flags.admin;
	}

	// -1 is automatic override (having -1 for staff flags is basically god mode admin level)
	if (staffFlags == getStaffFlagValue("All")) {
		return true;
	}

	if (hasBitFlag(staffFlags, requiredFlags)) {
		return true;
	}

	return false;
}

// ===========================================================================

function doesPlayerHaveClanPermission(client, requiredFlags) {
	if (isConsole(client)) {
		return true;
	}

	if (requiredFlags == getClanFlagValue("None")) {
		return true;
	}

	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageClans"))) {
		return true;
	}

	let clanFlags = 0;
	clanFlags = getPlayerCurrentSubAccount(client).clanFlags | getClanRankData(getPlayerClan(client), getPlayerClanRank(client)).flags;

	// -1 is automatic override (having -1 for staff flags is basically god mode admin level)
	if (clanFlags == getClanFlagValue("All")) {
		return true;
	}

	if (hasBitFlag(clanFlags, requiredFlags)) {
		return true;
	}

	return false;
}

// ===========================================================================

function doesPlayerHaveJobPermission(client, requiredFlags) {
	if (isConsole(client)) {
		return true;
	}

	if (requiredFlags == getClanFlagValue("None")) {
		return true;
	}

	if (doesPlayerHaveStaffPermission(client, getStaffFlagValue("ManageJobs"))) {
		return true;
	}

	let jobFlags = 0;
	jobFlags = getPlayerCurrentSubAccount(client).jobFlags | getJobRankData(getPlayerJob(client), getPlayerJobRank(client)).flags;

	// -1 is automatic override (having -1 for staff flags is basically god mode admin level)
	if (jobFlags == getJobFlagValue("All")) {
		return true;
	}

	if (hasBitFlag(jobFlags, requiredFlags)) {
		return true;
	}

	return false;
}

// ===========================================================================

function getStaffFlagValue(flagName) {
	if (flagName == "All") {
		return -1;
	}

	if (typeof serverBitFlags.staffFlags[flagName] == "undefined") {
		return false;
	}

	return serverBitFlags.staffFlags[flagName];
}

// ===========================================================================

function getClanFlagValue(flagName) {
	if (flagName == "All") {
		return -1;
	}

	if (typeof getServerBitFlags().clanFlags[flagName] == "undefined") {
		return false;
	}

	return getServerBitFlags().clanFlags[flagName];
}

// ===========================================================================

function getAccountSettingsFlagValue(flagName) {
	if (flagName == "All") {
		return -1;
	}

	if (typeof serverBitFlags.accountSettingsFlags[flagName] == "undefined") {
		return false;
	}

	return serverBitFlags.accountSettingsFlags[flagName];
}

// ===========================================================================

function getModerationFlagValue(flagName) {
	if (flagName == "All") {
		return -1;
	}

	if (typeof serverBitFlags.moderationFlags[flagName] == "undefined") {
		return false;
	}

	return serverBitFlags.moderationFlags[flagName];
}

// ===========================================================================

function getClanDiscordWebhookValue(flagName) {
	if (flagName == "All") {
		return -1;
	}

	if (typeof serverBitFlags.clanDiscordWebhookFlags[flagName] == "undefined") {
		return false;
	}

	return serverBitFlags.clanDiscordWebhookFlags[flagName];
}

// ===========================================================================

function getSeenActionTipsValue(flagName) {
	if (flagName == "All") {
		return -1;
	}

	if (typeof serverBitFlags.seenActionTips[flagName] == "undefined") {
		return false;
	}

	return serverBitFlags.seenActionTips[flagName];
}

// ===========================================================================

function givePlayerStaffFlag(client, flagName) {
	if (!getStaffFlagValue(flagName)) {
		return false;
	}

	getPlayerData(client).accountData.flags.admin = getPlayerData(client).accountData.flags.admin | getStaffFlagValue(flagName);
	return true;
}

// ===========================================================================

function takePlayerStaffFlag(client, flagName) {
	let flagValue = getStaffFlagValue(flagName);
	if (!flagValue) {
		return false;
	}

	getPlayerData(client).accountData.flags.admin = removeBitFlag(getPlayerData(client).accountData.flags.admin, flagValue);
	return true;
}

// ===========================================================================

function takePlayerStaffFlag(client, flagName) {
	if (!getStaffFlagValue(flagName)) {
		return false;
	}

	getPlayerData(client).accountData.flags.admin = getPlayerData(client).accountData.flags.admin & ~getStaffFlagValue(flagName);
	return true;
}

// ===========================================================================

function clearPlayerStaffFlags(client) {
	getPlayerData(client).accountData.flags.admin = getStaffFlagValue("None");
	return true;
}

// ===========================================================================

function getServerBitFlags() {
	return serverBitFlags;
}

// ===========================================================================

function getServerBitFlagKeys() {
	return serverBitFlagKeys;
}

// ===========================================================================