// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: help.js
// DESC: Provides update info, help commands, and documentation
// TYPE: Server (JavaScript)
// ===========================================================================

function initHelpScript() {
	logToConsole(LOG_INFO, `[VRR.Help]: Initializing help script ...`);
	logToConsole(LOG_INFO, `[VRR.Help]: Help script initialized successfully!`);
}

// ===========================================================================

let randomTips = [
	`{MAINCOLOUR}Look for yellow dots on your map for job locations.`,
	`{MAINCOLOUR}You can set custom key binds. Use {ALTCOLOUR}/info keys {MAINCOLOUR} for details.`,
	`{MAINCOLOUR}Use /notips if you don't want to see tips and extra information`,
	`{MAINCOLOUR}You can edit your keybinds using {ALTCOLOUR}/bindkey and /unbindkey`,
	`{MAINCOLOUR}Press ℹ️ to see your inventory, and use number keys to select an item`,
	`{MAINCOLOUR}Use /buy at a business to purchase items.`,
	`{MAINCOLOUR}Found a bug? Report it with {ALTCOLOUR}/bug`,
	`{MAINCOLOUR}Have an idea or suggestion for the server? Let the devs know using {ALTCOLOUR}/idea`,
	`{MAINCOLOUR}Want to buy a business? Use /bizbuy at one for sale`,
	`{MAINCOLOUR}Want to buy a house? Use /housebuy at one for sale`,
	`{MAINCOLOUR}Want to buy a vehicle? Visit a dealership and enter one for info on how to buy it!`,
	`{MAINCOLOUR}Switch to any of your characters with {ALTCOLOUR}/switchchar`,
	`{MAINCOLOUR}Use {ALTCOLOUR}/iplogin {MAINCOLOUR}to automatically login when connecting with the same IP`,
	`{MAINCOLOUR}Use {ALTCOLOUR}/houselights or /bizlights {MAINCOLOUR}to turn on/off the lights in your house or business`,
	`{MAINCOLOUR}Use {ALTCOLOUR}/radiostation {MAINCOLOUR}to play an internet radio station in your car, house, or business`,
	//`{MAINCOLOUR}Lower your car windows with /windows {ALTCOLOUR} to play the vehicle's internet radio station {ALTCOLOUR}(/radiostation) {MAINCOLOUR}to nearby players`,
	//`{MAINCOLOUR}Lower your car windows with /windows {ALTCOLOUR} to play the vehicle's internet radio station {ALTCOLOUR}(/radiostation) {MAINCOLOUR}to nearby players`,
	//`{MAINCOLOUR}Tax is based on your total wealth. This includes money, vehicles, businesses and more.`,
	//`{MAINCOLOUR}Don't go broke because of a hospital bill! Get insured today by visiting an insurance agency!`,
	//`{MAINCOLOUR}Don't go broke because your car was destroyed. Visit an insurance agency today!`,
	//`{MAINCOLOUR}You can find most locations by using {ALTCOLOUR}/gps`,
	//`{MAINCOLOUR}Want to advertise your business? Visit the news station and place an /ad today!`,
	//`{MAINCOLOUR}You can change your quick item display. Choices are GTAV-style pie menu or Minecraft-style hotbar`,
	//`{MAINCOLOUR}Hold [#0066FF]E {MAINCOLOUR}to hail a nearby taxi if you need a ride.`,
	//`{MAINCOLOUR}Press [#0066FF]G {MAINCOLOUR}to enter a vehicle as passenger.`,
	//`{MAINCOLOUR}Banks can provide loans. Use {ALTCOLOUR}/info loans {MAINCOLOUR} for more details.`,
	`{MAINCOLOUR}Want to make a clan? Use {ALTCOLOUR}/info clans {MAINCOLOUR} for details.`,
	`{MAINCOLOUR}Legal weapons can be purchased at any ammunation.`,
];

// ===========================================================================

function helpCommand(command, params, client) {
	if(areParamsEmpty(params)) {
		showMainHelpMessage(client);
		return false;
	}

	let splitParams = params.split(" ");

	switch(toLowerCase(getParam(params, " ", 1))) {
		case "account":
			showAccountHelpMessage(client);
			break;

		case "vehicle":
		case "veh":
		case "vehs":
		case "vehicles":
		case "car":
		case "cars":
			showVehicleHelpMessage(client);
			break;

		case "dealership":
			showVehicleDealershipHelpMessage(client);
			break;

		case "business":
			showBusinessHelpMessage(client);
			break;

		case "job":
			showJobHelpMessage(client);
			break;

		case "chat":
			showChatHelpMessage(client);
			break;

		case "rules":
			showRulesHelpMessage(client);
			break;

		case "website":
			showWebsiteHelpMessage(client);
			break;

		case "discord":
			showDiscordHelpMessage(client);
			break;

		case "anim":
		case "anims":
		case "animation":
		case "animations":
			showAnimationHelpMessage(client);
			break;

		case "skin":
		case "skins":
		case "clothes":
			showClothesHelpMessage(client);
			break;

		case "key":
		case "keys":
		case "keybinds":
		case "keybind":
		case "bindkey":
		case "bindkeys":
			showBindKeysHelpMessage(client);
			break;

		case "command":
		case "cmd":
			showCommandHelpMessage(client, getParam(params, " ", 2));
			break;

		case "clan":
		case "clans":
		case "group":
		case "groups":
		case "faction":
		case "factions":
		case "family":
		case "families":
			showClanHelpMessage(client);
			break;

		case "radio":
		case "radiostations":
		case "music":
			showRadioHelpMessage(client);
			break;

		case "economy":
		case "wealth":
		case "tax":
		case "taxes":
		case "payday":
			showWealthAndTaxHelpMessage(client);
			break;

		default:
			showMainHelpMessage(client);
			break;
	}
}

// == Account Help =============================
// == Vehicle Help =============================
// == Vehicle Dealerships ======================
// == Job Help =================================
// == Chat Help ================================
// == Server Rules =============================
// == Website ==================================
// == Discord ==================================
// == Animations ===============================
// == Pay And Spray ============================
// == Ammunation ===============================
// == Vehicle Tuneup ===========================
// == Bindable Keys ============================
// == Clothes ==================================
// == Business =================================
// == Clan Help ================================
// == Command Info =============================
// == Player Vehicles ==========================
// == Player Businesses ========================
// == Clans ====================================
// == Admins ===================================
// == Badge ====================================
// == Accents ==================================
// == Player Info ==============================
// == Wealth and Tax ===========================

// ===========================================================================

function showMainHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HelpMainListHeader")));
	messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Use /info <category> for commands and info. Example: {ALTCOLOUR}/info vehicle`);
	messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Help Categories: [#A9A9A9]account, command, vehicle, job, chat, rules, website, animation`);
	messagePlayerNormal(client, `{clanOrange}• [#A9A9A9]skin, mechanic, dealership, discord, colour, keybind`);
}

// ===========================================================================

function showAccountHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderAccountHelp")));

	messagePlayerHelpContent(client, getGroupedLocaleString(client, "AccountHelp", 0));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "AccountHelp", 1, `{ALTCOLOUR}/changepass{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "AccountHelp", 2, `{ALTCOLOUR}/gui, /logo, /iplogin, /autolastchar, /2fa, /loginalert{MAINCOLOUR}`));
}

// ===========================================================================

function showVehicleHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderVehicleHelp")));

	messagePlayerHelpContent(client, getGroupedLocaleString(client, "VehicleHelp", 0, `{ALTCOLOUR}/info dealership{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "VehicleHelp", 1, `{ALTCOLOUR}/lock, /engine, /lights, /trunk, /rentveh, /buyveh, /rentprice, /buyprice{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "VehicleHelp", 2));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "VehicleHelp", 3, `{ALTCOLOUR}/info mechanic{MAINCOLOUR}`));
}

// ===========================================================================

function showVehicleDealershipHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderVehicleDealershipHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "VehicleDealershipHelp", 0, `{ALTCOLOUR}/gps{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "VehicleDealershipHelp", 1));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "VehicleDealershipHelp", 1, `{ALTCOLOUR}/buyveh{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "VehicleDealershipHelp", 2));
}

// ===========================================================================

function showJobHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderJobHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "JobHelp", 0));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "JobHelp", 1, `{ALTCOLOUR}/takejob{MAINCOLOUR}`, `{ALTCOLOUR}/quitjob{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "JobHelp", 2, `{ALTCOLOUR}/lock{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "JobHelp", 3));
}

// ===========================================================================

function showChatHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderChatHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "ChatHelp", 0, `{ALTCOLOUR}/buy {MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "ChatHelp", 1, `{ALTCOLOUR}/rules{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "ChatHelp", 2, `{ALTCOLOUR}/dm /whisper /talk /shout /me{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "ChatHelp", 3, `{ALTCOLOUR}/t{MAINCOLOUR}`, `{ALTCOLOUR}/s{MAINCOLOUR}`));
}

// ===========================================================================

function showRulesHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderServerRulesList")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "RulesHelp", 0));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "RulesHelp", 1));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "RulesHelp", 2));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "RulesHelp", 3));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "RulesHelp", 4), `{ALTCOLOUR}/info language {MAINCOLOUR}`);
}

// ===========================================================================

function showWebsiteHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderWebsiteInfo")));
	messagePlayerHelpContent(client, `{MAINCOLOUR}${server.getRule("Website")}`);
}

// ===========================================================================

function showDiscordHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderDiscordInfo")));
	messagePlayerHelpContent(client, `{MAINCOLOUR}${server.getRule("Discord")}`);
}

// ===========================================================================

function showAnimationHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderAnimationHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "AnimationHelp", 0, `{ALTCOLOUR}/buy {MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "AnimationHelp", 1, `{ALTCOLOUR}/an {MAINCOLOUR}`, `{ALTCOLOUR}/anim {MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "AnimationHelp", 2, `{ALTCOLOUR}/animlist {MAINCOLOUR}`));
}

// ===========================================================================

function showClothesHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderSkinHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "SkinHelp", 0, `{ALTCOLOUR}/buy {MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "SkinHelp", 1, `{ALTCOLOUR}/info items {MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "SkinHelp", 2));
}

// ===========================================================================

function showBindKeysHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBindableKeysHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "KeyBindHelp", 0, `{ALTCOLOUR}/keybinds {MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "KeyBindHelp", 1, `{ALTCOLOUR}/bindkey {MAINCOLOUR}`, `{ALTCOLOUR}/unbindkey {MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "KeyBindHelp", 2, `{ALTCOLOUR}K{MAINCOLOUR}`, `{ALTCOLOUR}L{MAINCOLOUR}`, `{ALTCOLOUR}J{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "KeyBindHelp", 3, `{ALTCOLOUR}I{MAINCOLOUR}`, `{ALTCOLOUR}1-9{MAINCOLOUR}`, `{ALTCOLOUR}0{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "KeyBindHelp", 4, `{ALTCOLOUR}U{MAINCOLOUR}`, `{ALTCOLOUR}O{MAINCOLOUR}`, `{ALTCOLOUR}P{MAINCOLOUR}`));
}

// ===========================================================================

function showBusinessHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderBusinessHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "BusinessHelp", 0));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "BusinessHelp", 1));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "BusinessHelp", 2, `{ALTCOLOUR}/bizorder, /bizlock, /bizlights, /radiostation, /bizitemprice, /bizbuyprice, /bizfee, /biztill, /bizwithdraw, /bizdeposit`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "BusinessHelp", 3));
}

// ===========================================================================

function showClanHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderClanHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "ClanHelp", 0));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "ClanHelp", 1));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "ClanHelp", 2, `{ALTCOLOUR}/clan, /clanmotd, /clanname, /clanowner, /clanhouse, /clanbiz, /claninvite, /clanuninvite, /clansetrank`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "ClanHelp", 3, `{ALTCOLOUR}/clanranks, /clanflags, /clanaddrank, /clandelrank, /clanaddrankflag, /clandelrankflag, /clanaddmemberflag, /clandelmemberflag`));
}

// ===========================================================================

function showRadioHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderRadioHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "RadioHelp", 0, `{ALTCOLOUR}/radiostation {MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "RadioHelp", 1, `{ALTCOLOUR}/radiostations {MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "RadioHelp", 2, `{ALTCOLOUR}/radiovolume {MAINCOLOUR}`));
}

// ===========================================================================

function showWealthAndTaxHelpMessage(client) {
	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderWealthandTaxHelp")));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "WealthAndTaxHelp", 0, `{ALTCOLOUR}${100*getGlobalConfig().economy.incomeTaxRate}%{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "WealthAndTaxHelp", 1));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "WealthAndTaxHelp", 2, `{ALTCOLOUR}${getGlobalConfig().economy.upKeepCosts.upKeepPerVehicle}{MAINCOLOUR}`, `{ALTCOLOUR}${getGlobalConfig().economy.upKeepCosts.upKeepPerHouse}{MAINCOLOUR}`, `{ALTCOLOUR}${getGlobalConfig().economy.upKeepCosts.upKeepPerBusiness}{MAINCOLOUR}`));
	messagePlayerHelpContent(client, getGroupedLocaleString(client, "WealthAndTaxHelp", 3, `{ALTCOLOUR}/wealth{MAINCOLOUR}`, `{ALTCOLOUR}/tax{MAINCOLOUR}`));
}

// ===========================================================================

function showCommandHelpMessage(client, commandName) {
	if(!commandName) {
		messagePlayerSyntax(client, `${getCommandSyntaxText("help")}command <command name>`);
		return false;
	}

	commandName = toLowerCase(commandName);
	commandName = commandName.trim();

	if(commandName.slice(0, 1) == "/") {
		commandName = commandName.slice(1);
	}

	let command = getCommandData(commandName);
	let aliases = getCommandAliasesNames(command);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderCommandInfo", commandName)));
	messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Description: ${command.helpDescription}`);

	if(aliases.length > 0) {
		messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Aliases: ${aliases.join(", ")}`);
	} else {
		messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Aliases: (None)`);
	}

	//messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Usable on Discord: ${getYesNoFromBool(command.allowOnDiscord)}`);

	//if(doesPlayerHaveStaffPermission(client, getStaffFlagValue("BasicModeration"))) {
	//    messagePlayerNormal(client, `{clanOrange}• {MAINCOLOUR}Usable on Discord: ${getYesNoFromBool(command.allowOnDiscord)}`);
	//}
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
function helpGetCarCommand(command, params, client) {
	messagePlayerAlert(client, getLocaleString(client, "CarCommandHelp", `{ALTCOLOUR}/info vehicle{MAINCOLOUR}`));
}

// ===========================================================================

/**
 * This is a command handler function.
 *
 * @param {string} command - The command name used by the player
 * @param {string} params - The parameters/args string used with the command by the player
 * @param {Client} client - The client/player that used the command
 * @return {bool} Whether or not the command was successful
 *
 */
 function helpGetSkinCommand(command, params, client) {
	messagePlayerAlert(client, getLocaleString(client, "SkinCommandHelp", `{ALTCOLOUR}/info skin{MAINCOLOUR}`));
	messagePlayerAlert(client, ``);
}

// ===========================================================================