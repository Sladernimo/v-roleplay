// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: command.js
// DESC: Provides command data, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

/**
 * @class Representing a command's data. Loaded and saved in the database
 */
class CommandData {
	enable() {
		this.enabled = true;
	}

	disable() {
		this.enabled = false;
	}

	toggleEnabled() {
		this.enabled = !this.enabled;
	}

	constructor(command, handlerFunction, syntaxString, requiredStaffFlags, requireLogin, allowOnDiscord, helpDescription) {
		this.command = command;
		this.handlerFunction = handlerFunction;
		this.syntaxString = syntaxString;
		this.requiredStaffFlags = requiredStaffFlags;
		this.enabled = true;
		this.requireLogin = requireLogin;
		this.allowOnDiscord = allowOnDiscord;
		this.helpDescription = helpDescription;
		this.aliases = [];
	}
};

// ===========================================================================

let serverCommands = [];

// ===========================================================================

function initCommandScript() {
	logToConsole(LOG_INFO, "[AGRP.Command]: Initializing commands script ...");
	logToConsole(LOG_INFO, "[AGRP.Command]: Initialized commands script!");
}

// ===========================================================================

function loadCommands() {
	let tempCommands = {
		accent: [
			new CommandData("accent", setAccentCommand, "<accent name/id>", getStaffFlagValue("None"), false, false, "Sets your character's accent"),
			new CommandData("accents", listAccentsCommand, "", getStaffFlagValue("None"), false, false, "Shows a list of all available accents"),
			new CommandData("accentlist", listAccentsCommand, "", getStaffFlagValue("None"), false, false, "Shows a list of all available accents"),
		],
		account: [
			new CommandData("login", loginCommand, "<password>", getStaffFlagValue("None"), false, false, "Login to an account"),
			new CommandData("register", registerCommand, "<password>", getStaffFlagValue("None"), false, false, "Creates an account"),
			new CommandData("changepass", changeAccountPasswordCommand, "<old password> <new password>", getStaffFlagValue("None"), true, false, "Change an account password"),
			new CommandData("iplogin", toggleAutoLoginByIPCommand, "", getStaffFlagValue("None"), true, false, "Toggle whether to automatically login if you join with the same IP as your last join"),
			new CommandData("gui", toggleAccountGUICommand, "", getStaffFlagValue("None"), false, false, "Toggle whether to use GUI. If GUI is disabled on the server, it won't show even if you have GUI enabled."),
			new CommandData("2fa", toggleAccountTwoFactorAuthCommand, "", getStaffFlagValue("None"), true, false, "Set up and use two-factor authentication."),
			new CommandData("setemail", setAccountEmailCommand, "<email address>", getStaffFlagValue("None"), true, false, "Sets your email. To reset your password, you must have a valid email set and verified."),
			new CommandData("verifyemail", verifyAccountEmailCommand, "<verification code>", getStaffFlagValue("None"), true, false, "Confirms/verifies your email."),
			//new CommandData("setdiscord", setAccountDiscordCommand, "<discord id>", getStaffFlagValue("None"), true, false, "Set up the integration for discord. Allows you to see info and use in-game commands on discord."),
			new CommandData("notips", toggleNoRandomTipsCommand, "", getStaffFlagValue("None"), true, false, "Turn on and off random tips"),
			new CommandData("loginalert", toggleAccountLoginAttemptNotificationsCommand, "", getStaffFlagValue("None"), true, false, "Turn on and off email notifications for attempts to login to your account"),
			new CommandData("scrolllines", setAccountChatScrollLinesCommand, "<number of lines>", getStaffFlagValue("None"), true, false, "Sets how many chatbox lines to scroll at a time when using pageup/pagedown"),
			new CommandData("chatscrolllines", setAccountChatScrollLinesCommand, "<number of lines>", getStaffFlagValue("None"), true, false, "Sets how many chatbox lines to scroll at a time when using pageup/pagedown"),
			new CommandData("chatscroll", setAccountChatScrollLinesCommand, "<number of lines>", getStaffFlagValue("None"), true, false, "Sets how many chatbox lines to scroll at a time when using pageup/pagedown"),
			new CommandData("chatautohide", setAccountChatAutoHideDelayCommand, "<time in seconds>", getStaffFlagValue("None"), true, false, "Sets how long to wait to hide the chatbox after last use (in seconds)"),
			new CommandData("chattimestamp", toggleChatBoxTimeStampsCommand, "", getStaffFlagValue("None"), true, false, "Turns on/off timestamps in the chatbox"),
			new CommandData("chattimestamps", toggleChatBoxTimeStampsCommand, "", getStaffFlagValue("None"), true, false, "Turns on/off timestamps in the chatbox"),
			new CommandData("chattime", toggleChatBoxTimeStampsCommand, "", getStaffFlagValue("None"), true, false, "Turns on/off timestamps in the chatbox"),
			new CommandData("chattimes", toggleChatBoxTimeStampsCommand, "", getStaffFlagValue("None"), true, false, "Turns on/off timestamps in the chatbox"),
			new CommandData("chattimestamps", toggleChatBoxTimeStampsCommand, "", getStaffFlagValue("None"), true, false, "Turns on/off timestamps in the chatbox"),
			new CommandData("chatfilter", toggleAccountProfanityFilterCommand, "", getStaffFlagValue("None"), true, false, "Turns on/off profanity filter"),
			new CommandData("chatemoji", toggleAccountReplaceEmojiCommand, "", getStaffFlagValue("None"), true, false, "Turns on/off automatic emoji"),
			new CommandData("emoji", toggleAccountReplaceEmojiCommand, "", getStaffFlagValue("None"), true, false, "Turns on/off automatic emoji"),
			//new CommandData("noblood", toggleAccountHideBloodCommand, "", getStaffFlagValue("None"), true, false, "Turns on/off blood in-game"),
		],
		ammunation: [],
		animation: [
			new CommandData("anim", playPlayerAnimationCommand, "<animation name>", getStaffFlagValue("None"), true, true, "Makes your player ped use an animation"),
			new CommandData("an", playPlayerAnimationCommand, "<animation name>", getStaffFlagValue("None"), true, true, "Makes your player ped use an animation"),
			new CommandData("e", playPlayerAnimationCommand, "<animation name>", getStaffFlagValue("None"), true, true, "Makes your player ped use an animation"),
			new CommandData("anims", showAnimationListCommand, "", getStaffFlagValue("None"), true, true, "Shows a list of animations"),
			new CommandData("animlist", showAnimationListCommand, "", getStaffFlagValue("None"), true, true, "Shows a list of animations"),
			new CommandData("stopanim", stopPlayerAnimationCommand, "", getStaffFlagValue("None"), true, true, "Stops your current animation"),
		],
		antiCheat: [
			//new CommandData("setac", toggleGlobalAntiCheatCommand, "<0/1 state>", getStaffFlagValue("Developer"), true, true),
			//new CommandData("ac", getGlobalAntiCheatStatusCommand, "<0/1 state>", getStaffFlagValue("Developer"), true, true),
		],
		ban: [
			new CommandData("aban", accountBanCommand, "<player name/id> <reason>", getStaffFlagValue("BasicModeration"), true, true, "Bans a player's account."),
			new CommandData("acctban", accountBanCommand, "<player name/id> <reason>", getStaffFlagValue("BasicModeration"), true, true, "Bans a player's account."),
			new CommandData("cban", subAccountBanCommand, "<player name/id> <reason>", getStaffFlagValue("BasicModeration"), true, true, "Bans a player's character."),
			new CommandData("charban", subAccountBanCommand, "<player name/id> <reason>", getStaffFlagValue("BasicModeration"), true, true, "Bans a player's character."),
			new CommandData("saban", subAccountBanCommand, "<player name/id> <reason>", getStaffFlagValue("BasicModeration"), true, true, "Bans a player's character (subaccount)."),
			new CommandData("ipban", ipBanCommand, "<player name/id> <reason>", getStaffFlagValue("BasicModeration"), true, true, "Bans a player's IP."),
			new CommandData("subnetban", subNetBanCommand, "<player name/id> <range> <reason>", getStaffFlagValue("BasicModeration"), true, true, "Bans a player's subnet."),
		],
		bitFlag: [],
		business: [
			new CommandData("addbiz", createBusinessCommand, "<name>", getStaffFlagValue("ManageBusinesses"), true, false, "Creates a business"),
			new CommandData("delbiz", deleteBusinessCommand, "[id]", getStaffFlagValue("ManageBusinesses"), true, true, "Deletes a business"),
			//new CommandData("addbizloc", createBusinessLocationCommand, "<type> <business id> <name>", getStaffFlagValue("ManageBusinesses"), true, false),
			//new CommandData("delbizloc", deleteBusinessLocationCommand, "[id]", getStaffFlagValue("ManageBusinesses"), true, false),
			new CommandData("bizreloadall", reloadAllBusinessesCommand, "", getStaffFlagValue("ManageBusinesses"), true, false, "Reloads all businesses from the database"),

			//new CommandData("bizlock", lockUnlockBusinessCommand, "", getStaffFlagValue("None"), true, true, "Locks a business"),
			//new CommandData("bizlights", toggleBusinessInteriorLightsCommand, "", getStaffFlagValue("None"), true, true, "Turns on/off a business's interior lights"),
			new CommandData("bizbuy", buyBusinessCommand, "", getStaffFlagValue("None"), true, true, "Purchases a business"),
			new CommandData("bizfee", setBusinessEntranceFeeCommand, "<amount>", getStaffFlagValue("None"), true, true, "Sets a fee to charge players when they enter the business."),
			new CommandData("biztill", viewBusinessTillAmountCommand, "", getStaffFlagValue("None"), true, true, "Shows the business's till (cash register) amount"),
			new CommandData("bizbalance", viewBusinessTillAmountCommand, "", getStaffFlagValue("None"), true, true, "Shows the business's till (cash register) amount"),
			new CommandData("bizwithdraw", withdrawFromBusinessCommand, "<amount>", getStaffFlagValue("None"), true, true, "Take money out of the business till (cash register)"),
			new CommandData("bizdeposit", depositIntoBusinessCommand, "<amount>", getStaffFlagValue("None"), true, true, "Put money into the business till (cash register)"),
			new CommandData("buy", buyFromBusinessCommand, "<slot> [amount]", getStaffFlagValue("None"), true, true, "Buy items from a business"),
			new CommandData("bizstock", stockItemOnBusinessFloorCommand, "<item name> <amount> <sell price>", getStaffFlagValue("None"), true, true, "Uses storage items to restock the business with."),
			new CommandData("bizstore", storeItemInBusinessStorageCommand, "<item name> <amount>", getStaffFlagValue("None"), true, true, "Moves items from the business to the business storage"),
			new CommandData("bizorder", orderItemForBusinessCommand, "<item name> <amount> <sell price>", getStaffFlagValue("None"), true, true, "Orders items to sell from a business"),
			new CommandData("bizitemprice", setBusinessItemSellPriceCommand, "<item slot> <sell price>", getStaffFlagValue("None"), true, true, "Sets the purchase price of a business item"),
			new CommandData("bizname", setBusinessNameCommand, "<name>", getStaffFlagValue("None"), true, true, "Changes a business name"),
			new CommandData("bizowner", setBusinessOwnerCommand, "<player name/id>", getStaffFlagValue("None"), true, true, "Changes the owner of a business"),
			new CommandData("bizdelowner", removeBusinessOwnerCommand, "", getStaffFlagValue("ManageBusinesses"), true, true, "Removes the owner of a business"),
			new CommandData("bizpublic", setBusinessPublicCommand, "", getStaffFlagValue("ManageBusinesses"), true, true, "Changes a business to public (city hall, govt buildings, etc)"),
			new CommandData("bizjob", setBusinessJobCommand, "", getStaffFlagValue("ManageBusinesses"), true, true, "Changes the owner of a business to a job"),
			new CommandData("bizrank", setBusinessRankCommand, "", getStaffFlagValue("None"), true, true, "Changes the job/clan rank required to use the business"),
			new CommandData("bizclan", setBusinessClanCommand, "", getStaffFlagValue("None"), true, true, "Changes the owner of a business to a clan"),
			new CommandData("bizbuyprice", setBusinessBuyPriceCommand, "<amount>", getStaffFlagValue("None"), true, true, "Changes the price to buy the business"),
			new CommandData("bizblip", setBusinessBlipCommand, "<type name/model id>", getStaffFlagValue("ManageBusinesses"), true, true, "Sets the business blip display"),
			new CommandData("bizpickup", setBusinessPickupCommand, "<type name/model id>", getStaffFlagValue("ManageBusinesses"), true, true, "Sets the business pickup display"),
			new CommandData("bizinfo", getBusinessInfoCommand, "[business id]", getStaffFlagValue("None"), true, true, "Shows business information"),
			new CommandData("bizflooritems", getBusinessFloorItemsCommand, "[business id]", getStaffFlagValue("None"), true, true, "Shows all business floor items (for sale) to a player"),
			new CommandData("bizstorageitems", getBusinessStorageItemsCommand, "[business id]", getStaffFlagValue("None"), true, true, "Shows all business storage items (i.e. back room) to a player"),
			new CommandData("bizentrance", moveBusinessEntranceCommand, "", getStaffFlagValue("ManageBusinesses"), true, true, "Moves the entrance (exterior point) of the business"),
			new CommandData("bizexit", moveBusinessExitCommand, "", getStaffFlagValue("ManageBusinesses"), true, true, "Moves the exit (interior point) of the business"),
			new CommandData("bizinttype", setBusinessInteriorTypeCommand, "<interior template name/business id>", getStaffFlagValue("ManageBusinesses"), true, true, "Changes the business interior"),
			new CommandData("bizdefaultitems", giveDefaultItemsToBusinessCommand, "<item template>", getStaffFlagValue("ManageItems"), true, true, "Gives the business the default items based on template name"),
			new CommandData("bizdelflooritems", deleteBusinessFloorItemsCommand, "", getStaffFlagValue("ManageItems"), true, true, "Destroys all items on the business floor (for-sale items)"),
			new CommandData("bizdelstorageitems", deleteBusinessStorageItemsCommand, "", getStaffFlagValue("ManageItems"), true, true, "Destroys all items in the business's storage"),
			new CommandData("bizdealership", setBusinessDealershipCommand, "", getStaffFlagValue("None"), true, true, "Sets the business's door label to vehicle dealership"),
			//new CommandData("bizpaintball", setBusinessPaintBallCommand, "", getStaffFlagValue("None"), true, true, "Sets the business to a paintball arena"),
		],
		chat: [
			new CommandData("me", meActionCommand, "<message>", getStaffFlagValue("None"), true, false, "Shows a custom action message in chat"),
			new CommandData("do", doActionCommand, "<message>", getStaffFlagValue("None"), true, false, "Shows a custom action description in chat"),
			new CommandData("s", shoutCommand, "<message>", getStaffFlagValue("None"), true, false, "Shout a message to others in the area"),
			new CommandData("shout", shoutCommand, "<message>", getStaffFlagValue("None"), true, false, "Shout a message to others in the area"),
			new CommandData("talk", talkCommand, "<message>", getStaffFlagValue("None"), true, false, "Say a message to others nearby"),
			new CommandData("local", talkCommand, "<message>", getStaffFlagValue("None"), true, false, "Say a message to others nearby"),
			new CommandData("l", talkCommand, "<message>", getStaffFlagValue("None"), true, false, "Say a message to others nearby"),
			new CommandData("w", whisperCommand, "<message>", getStaffFlagValue("None"), true, false, "Whisper a message to players very close to you"),
			new CommandData("whisper", whisperCommand, "<message>", getStaffFlagValue("None"), true, false, "Whisper a message to players very close to you"),
			new CommandData("clanchat", clanChatCommand, "<message>", getStaffFlagValue("None"), true, false, "Sends an OOC chat message to members in your clan"),
			new CommandData("clan", clanChatCommand, "<message>", getStaffFlagValue("None"), true, false, "Sends an OOC chat message to members in your clan"),
			new CommandData("c", clanChatCommand, "<message>", getStaffFlagValue("None"), true, false, "Sends an OOC chat message to members in your clan"),
			new CommandData("m", megaphoneChatCommand, "<message>", getStaffFlagValue("None"), true, true, "Shouts a message over a megaphone (portable bullhorn/loudspeaker)"),
			new CommandData("pm", privateMessageCommand, "<player name/id> <message>", getStaffFlagValue("None"), true, true, "Sends a private message to a player"),
			new CommandData("dm", privateMessageCommand, "<player name/id> <message>", getStaffFlagValue("None"), true, true, "Sends a private message to a player"),
			new CommandData("msg", privateMessageCommand, "<player name/id> <message>", getStaffFlagValue("None"), true, true, "Sends a private message to a player"),
			new CommandData("reply", replyToLastPrivateMessageCommand, "<message>", getStaffFlagValue("None"), true, true, "Replies to the last private message you received"),
		],
		clan: [
			new CommandData("clans", listClansCommand, "[search text]", getStaffFlagValue("None"), true, true, "List clans (search by partial name, if provided)"),
			new CommandData("clanranks", listClanRanksCommand, "[clan name]", getStaffFlagValue("None"), true, true, "Shows a list of a clan's ranks"),
			new CommandData("clanflags", showClanFlagListCommand, "", getStaffFlagValue("None"), true, true, "Shows a list of clan permission flags"),
			new CommandData("addclan", createClanCommand, "<name>", getStaffFlagValue("ManageClans"), true, true, "Creates an new empty, unowned clan."),
			new CommandData("delclan", deleteClanCommand, "<clan id>", getStaffFlagValue("ManageClans"), true, true, "Deletes a clan by ID or name"),
			new CommandData("clanaddrank", createClanRankCommand, "<rank id> <name>", getStaffFlagValue("None"), true, true, "Adds a clan rank"),
			new CommandData("clandelrank", deleteClanRankCommand, "<rank name>", getStaffFlagValue("None"), true, true, "Removes a clan rank"),
			new CommandData("clansetrank", setClanMemberRankCommand, "<player name/id> <rank name>", getStaffFlagValue("None"), true, true, "Sets the rank of a clan member"),
			new CommandData("clanowner", setClanOwnerCommand, "<player name/id>", getStaffFlagValue("None"), true, true, "Gives ownership of the clan to a player"),
			new CommandData("clantag", setClanTagCommand, "<tag>", getStaffFlagValue("None"), true, true, "Sets a clan's main tag"),
			new CommandData("clanranktag", setClanRankTagCommand, "<rank name/id> <tag>", getStaffFlagValue("None"), true, true, "Sets a clan rank's custom tag"),
			new CommandData("clanmembertag", setClanMemberTagCommand, "<player name/id> <tag>", getStaffFlagValue("None"), true, true, "Sets a clan members's custom tag"),
			new CommandData("clanrankname", setClanRankTitleCommand, "<rank name/id> <new name>", getStaffFlagValue("None"), true, true, "Sets a clan rank's title"),
			new CommandData("clanranklevel", setClanRankLevelCommand, "<rank name/id> <new level>", getStaffFlagValue("None"), true, true, "Sets a clan rank's level"),
			//new CommandData("clanrankenabled", toggleClanRankEnabledCommand, "<rank name/id>", getStaffFlagValue("None"), true, true, "Enables/disables a clan rank"),
			new CommandData("clanmembertitle", setClanMemberTitleCommand, "<player name/id> <title>", getStaffFlagValue("None"), true, true, "Sets a clan members's custom title"),
			new CommandData("clanaddrankflag", addClanRankFlagCommand, "<rank name/id> <flag name>", getStaffFlagValue("None"), true, true, "Gives a clan rank a clan permission."),
			new CommandData("clanrankflags", showClanRankFlagsCommand, "<rank name/id>", getStaffFlagValue("None"), true, true, "Lists a clan rank's permission flags"),
			new CommandData("clandelrankflag", removeClanRankFlagCommand, "<rank name/id> <flag name>", getStaffFlagValue("None"), true, true, "Takes a clan permission from a clan rank"),
			new CommandData("clanaddmemberflag", addClanMemberFlagCommand, "<player name/id> <flag name>", getStaffFlagValue("None"), true, true, "Gives a clan member a clan permission"),
			new CommandData("clandelmemberflag", removeClanMemberFlagCommand, "<player name/id> <flag name>", getStaffFlagValue("None"), true, true, "Takes a clan permission from a clan member"),
		],
		class: [],
		client: [],
		colour: [],
		command: [
			new CommandData("cmdenabletype", enableAllCommandsByType, "<type>", getStaffFlagValue("Developer"), true, true, "Enables all commands by type."),
			new CommandData("cmddisabletype", disableAllCommandsByType, "<type>", getStaffFlagValue("Developer"), true, true, "Disables all commands by type."),
			new CommandData("cmdenable", enableCommand, "<command>", getStaffFlagValue("Developer"), true, true, "Enable a specific command"),
			new CommandData("cmddisable", disableCommand, "<command>", getStaffFlagValue("Developer"), true, true, "Disables a specific command"),
		],
		config: [
			new CommandData("settime", setTimeCommand, "<hour> [minute]", getStaffFlagValue("ManageWorld"), true, true, "Sets the time. Hours are required, minute is optional and will default to 0"),
			new CommandData("setminuteduration", setMinuteDurationCommand, "<time in ms>", getStaffFlagValue("ManageWorld"), true, true, "Sets how long a minute lasts in milliseconds. 60000 is real time."),
			new CommandData("setweather", setWeatherCommand, "<weather id/name>", getStaffFlagValue("ManageWorld"), true, true, "Change the weather to specified type."),
			new CommandData("setsnow", setSnowingCommand, "<falling snow> <ground snow>", getStaffFlagValue("ManageWorld"), true, true, "Toggles winter/snow"),
			new CommandData("setlogo", toggleServerLogoCommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles the corner server logo display on/off"),
			new CommandData("setgui", toggleServerGUICommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles server GUI on/off"),
			new CommandData("setguicolours", setServerGUIColoursCommand, "<red> <green> <blue>", getStaffFlagValue("ManageServer"), true, true),
			new CommandData("newcharspawn", setNewCharacterSpawnPositionCommand, "", getStaffFlagValue("ManageServer"), true, true, "Sets the starting spawn position for new characters"),
			new CommandData("newcharcash", setNewCharacterMoneyCommand, "<amount>", getStaffFlagValue("ManageServer"), true, true, "Sets the starting money for new characters"),
			new CommandData("newcharskin", setNewCharacterSkinCommand, "[skin id]", getStaffFlagValue("ManageServer"), true, true, "Sets the default skin for new characters"),
			new CommandData("reloadcfg", reloadServerConfigurationCommand, "", getStaffFlagValue("ManageServer"), true, true, "Loads and applies the server configuration"),
			new CommandData("reloademailcfg", reloadEmailConfigurationCommand, "", getStaffFlagValue("Developer"), true, true, "Loads and applies the email configuration"),
			new CommandData("reloaddbcfg", reloadDatabaseConfigurationCommand, "", getStaffFlagValue("Developer"), true, true, "Loads and applies the database configuration"),
			new CommandData("reloadlocalecfg", reloadLocaleConfigurationCommand, "", getStaffFlagValue("Developer"), true, true, "Loads and applies the locale configuration and texts"),
			new CommandData("reloadaccentcfg", reloadAccentConfigurationCommand, "", getStaffFlagValue("Developer"), true, true, "Loads and applies the accent configuration and texts"),

			new CommandData("setbizblips", toggleServerBusinessBlipsCommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles all business blips on/off"),
			new CommandData("setbusinessblips", toggleServerBusinessBlipsCommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles all business blips on/off"),
			new CommandData("sethouseblips", toggleServerHouseBlipsCommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles all house blips on/off"),
			new CommandData("setjobblips", toggleServerJobBlipsCommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles all job blips on/off"),
			new CommandData("setbizpickups", toggleServerBusinessPickupsCommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles all business pickups on/off"),
			new CommandData("setbusinesspickups", toggleServerBusinessPickupsCommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles all business pickups on/off"),
			new CommandData("sethousepickups", toggleServerHousePickupsCommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles all house pickups on/off"),
			new CommandData("setjobpickups", toggleServerJobPickupsCommand, "<0/1 state>", getStaffFlagValue("ManageServer"), true, true, "Toggles all job pickups on/off"),
			new CommandData("nametagdistance", setServerNameTagDistanceCommand, "<distance>", getStaffFlagValue("ManageServer"), true, true, "Sets the distance at which name tags are displayed"),
		],
		core: [],
		database: [
			new CommandData("dbquery", executeDatabaseQueryCommand, "<query>", getStaffFlagValue("Developer"), true, true, "Run a query on the database"),
			//new CommandData("dbinfo", getDatabaseInfoCommand, "", getStaffFlagValue("Developer"), true, true),
		],
		developer: [
			new CommandData("scode", executeServerCodeCommand, "<code>", getStaffFlagValue("Developer"), true, true, "Execute serverside code"),
			new CommandData("ccode", executeClientCodeCommand, "<code>", getStaffFlagValue("Developer"), true, true, "Execute clientside code for a player"),
			new CommandData("gmx", restartGameModeCommand, "", getStaffFlagValue("Developer"), true, true, "Restart this gamemode"),
			new CommandData("saveall", saveServerDataCommand, "", getStaffFlagValue("Developer"), true, true, "Immediately save all data to database"),
			new CommandData("docmd", simulateCommandForPlayerCommand, "<player name/id> <command> [params]", getStaffFlagValue("Developer"), true, true, "Force a player to use a command"),
			new CommandData("docmdall", simulateCommandForAllPlayersCommand, "<command> [params]", getStaffFlagValue("Developer"), true, true, "Force all players to use a command"),
			new CommandData("addloglevel", addLogLevelCommand, "<log level name>", getStaffFlagValue("Developer"), true, true, "Adds a log level"),
			new CommandData("delloglevel", removeLogLevelCommand, "<log level name>", getStaffFlagValue("Developer"), true, true, "Removes an active log level"),
			new CommandData("loglevel", getLogLevelCommand, "", getStaffFlagValue("Developer"), true, true, "Gets the current log level"),

			new CommandData("nosave", togglePauseSavingToDatabaseCommand, "", getStaffFlagValue("Developer"), true, true, "Pauses saving to database (used for testing)"),
			new CommandData("streamurlall", streamAudioURLToAllPlayersCommand, "<url> <volume>", getStaffFlagValue("Developer"), true, true, "Plays a URL radio stream for all players"),
			new CommandData("streamnameall", streamAudioNameToAllPlayersCommand, "<name> <volume>", getStaffFlagValue("Developer"), true, true, "Plays an audio file stream for all players"),

			new CommandData("forceresetpass", forceAccountPasswordResetCommand, "<account name>", getStaffFlagValue("Developer"), true, true),
			new CommandData("fixblips", fixAllServerBlipsCommand, "", getStaffFlagValue("Developer"), true, true, "Clears and recreates all map blips"),
			new CommandData("fixpickups", fixAllServerPickupsCommand, "", getStaffFlagValue("Developer"), true, true, "Clears and recreates all pickups"),
			new CommandData("resetambience", resetAllServerAmbienceElementsCommand, "", getStaffFlagValue("ManageWorld"), true, true, "Clears all current server ambience elements (traffic, peds, etc)"),
			new CommandData("testguiprompt", testPromptGUICommand, "<player name/id>", getStaffFlagValue("Developer"), true, true, "Shows a sample prompt GUI (two buttons) to a player for testing"),
			new CommandData("testguiinfo", testInfoGUICommand, "<player name/id>", getStaffFlagValue("Developer"), true, true, "Shows a sample info dialog GUI to a player for testing"),
			new CommandData("testguierror", testErrorGUICommand, "<player name/id>", getStaffFlagValue("Developer"), true, true, "Shows a sample error dialog GUI to a player for testing"),
		],
		discord: [],
		economy: [
			new CommandData("tax", taxInfoCommand, "", getStaffFlagValue("None"), true, true),
			new CommandData("wealth", wealthInfoCommand, "", getStaffFlagValue("None"), true, true),
			new CommandData("forcepayday", forcePlayerPayDayCommand, "<player name/id>", getStaffFlagValue("ManageServer"), true, true, "Gives a player an instant payday."),
		],
		email: [
			new CommandData("testemail", testEmailCommand, "<email address>", getStaffFlagValue("Developer"), true, true),
		],
		fishing: [],
		forensics: [],
		gate: [
			new CommandData("gate", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			new CommandData("opengate", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			new CommandData("closegate", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			new CommandData("housegate", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			new CommandData("bizgate", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			new CommandData("businessgate", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			new CommandData("door", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			//new CommandData("opengate", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			//new CommandData("closegate", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			new CommandData("opendoor", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			new CommandData("closedoor", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
			new CommandData("garagedoor", triggerGateCommand, "", getStaffFlagValue("None"), true, true, "Opens/closes the nearest gate"),
		],
		help: [
			new CommandData("help", helpCommand, "", getStaffFlagValue("None"), false, false, "Shows help messages for information"),
			new CommandData("commands", helpCommand, "", getStaffFlagValue("None"), false, false, "Shows help messages for information"),
			new CommandData("cmds", helpCommand, "", getStaffFlagValue("None"), false, false, "Shows help messages for information"),
			new CommandData("info", helpCommand, "", getStaffFlagValue("None"), false, false, "Shows help messages for information"),
			new CommandData("veh", helpGetCarCommand, "", getStaffFlagValue("None"), false, false, "Explains how to get/buy a vehicle"),
			new CommandData("v", helpGetCarCommand, "", getStaffFlagValue("None"), false, false, "Explains how to get/buy a vehicle"),
			new CommandData("car", helpGetCarCommand, "", getStaffFlagValue("None"), false, false, "Explains how to get/buy a vehicle"),
			new CommandData("cars", helpGetCarCommand, "", getStaffFlagValue("None"), false, false, "Explains how to get/buy a vehicle"),
			new CommandData("spawncar", helpGetCarCommand, "", getStaffFlagValue("None"), false, false, "Explains how to get/buy a vehicle"),
			new CommandData("spawnveh", helpGetCarCommand, "", getStaffFlagValue("None"), false, false, "Explains how to get/buy a vehicle"),
			new CommandData("skin", helpGetSkinCommand, "", getStaffFlagValue("None"), false, false, "Explains how to change your skin"),
			new CommandData("skins", helpGetSkinCommand, "", getStaffFlagValue("None"), false, false, "Explains how to change your skin"),
			new CommandData("clothes", helpGetSkinCommand, "", getStaffFlagValue("None"), false, false, "Explains how to change your skin"),
			//new CommandData("setskin", helpGetSkinCommand, "", getStaffFlagValue("None"), false, false, "Explains how to change your skin"),
			new CommandData("changeskin", helpGetSkinCommand, "", getStaffFlagValue("None"), false, false, "Explains how to change your skin"),
		],
		house: [
			new CommandData("addhouse", createHouseCommand, "<description>", getStaffFlagValue("ManageHouses"), true, false, "Creates a new house"),
			new CommandData("delhouse", deleteHouseCommand, "", getStaffFlagValue("ManageHouses"), true, false, "Deletes a house"),
			new CommandData("housereloadall", reloadAllHousesCommand, "", getStaffFlagValue("ManageHouses"), true, false, "Reloads all houses from the database"),

			new CommandData("houseinfo", getHouseInfoCommand, "", getStaffFlagValue("None"), true, false, "Shows a house's information"),
			new CommandData("housebuy", buyHouseCommand, "", getStaffFlagValue("None"), true, false, "Purchases a house"),
			new CommandData("houseclan", setHouseClanCommand, "", getStaffFlagValue("None"), true, false, "Gives a house to your clan"),
			new CommandData("housedesc", setHouseDescriptionCommand, "", getStaffFlagValue("ManageHouses"), true, false, "Sets a house's description"),
			//new CommandData("houselock", lockUnlockHouseCommand, "", getStaffFlagValue("None"), true, false, "Locks/unlocks a house door"),
			//new CommandData("houselights", toggleHouseInteriorLightsCommand, "", getStaffFlagValue("None"), true, false, "Turns on and off the lights inside a house"),
			new CommandData("housedelowner", removeHouseOwnerCommand, "", getStaffFlagValue("ManageHouse"), true, true, "Removes the owner of a house, making the house unowned"),
			new CommandData("houseowner", setHouseOwnerCommand, "", getStaffFlagValue("None"), true, false, "Gives a house to a player"),
			new CommandData("housebuyprice", setHouseBuyPriceCommand, "", getStaffFlagValue("None"), true, false, "Sets the purchase price of a house so people can buy it"),
			new CommandData("houserentprice", setHouseRentPriceCommand, "", getStaffFlagValue("None"), true, false, "Sets the rent price of a house so people can rent it"),
			new CommandData("houseblip", setHouseBlipCommand, "<type name/model id>", getStaffFlagValue("ManageHouses"), true, true, "Changes or removes a house's map icon"),
			new CommandData("housepickup", setHousePickupCommand, "<type name/model id>", getStaffFlagValue("ManageHouses"), true, true, "Changes or removes a house's pickup"),
			new CommandData("houseentrance", moveHouseEntranceCommand, "", getStaffFlagValue("ManageHouses"), true, true, "Moves a house's entrance (outside/exterior location to enter the house)"),
			new CommandData("houseexit", moveHouseExitCommand, "", getStaffFlagValue("ManageHouses"), true, true, "Moves a house's exit (inside/interior location to exit the house)"),
			new CommandData("houseinttype", setHouseInteriorTypeCommand, "<interior template name/business id>", getStaffFlagValue("ManageHouses"), true, true, "Sets a house's interior to a pre-defined type"),
		],
		insurance: [],
		item: [
			new CommandData("i", playerSwitchHotBarSlotCommand, "<slot id>", getStaffFlagValue("None"), true, false, "Switches to the item in the specified slot of your inventory."),
			new CommandData("item", playerSwitchHotBarSlotCommand, "<slot id>", getStaffFlagValue("None"), true, false, "Switches to the item in the specified slot of your inventory."),
			new CommandData("addgrounditem", createGroundItemCommand, "<item name/id>", getStaffFlagValue("ManageItems"), true, false, "Spawns a new item on the ground at your position."),
			new CommandData("additem", createItemCommand, "<item name/id>", getStaffFlagValue("ManageItems"), true, false, "Spawns a new item in your hotbar inventory."),
			new CommandData("delgrounditem", deleteGroundItemCommand, "", getStaffFlagValue("ManageItems"), true, false, "Destroys the nearest item on the ground."),
			new CommandData("pickup", pickupItemCommand, "", getStaffFlagValue("None"), true, false, "Picks up the nearest item."),
			new CommandData("drop", dropItemCommand, "[slot]", getStaffFlagValue("None"), true, false, "Drops your currently equipped item or the item in the specified slot"),
			new CommandData("put", putItemCommand, "[slot]", getStaffFlagValue("None"), true, false, "Puts an item from your inventory into the nearest item place (vehicle trunk/dash, house, business, etc)"),
			new CommandData("take", takeItemCommand, "[slot]", getStaffFlagValue("None"), true, false, "Takes an item from the nearest item place (vehicle trunk, dash, house, business, etc)"),
			new CommandData("use", useItemCommand, "", getStaffFlagValue("None"), true, false, "Uses the currently equipped item"),
			new CommandData("inv", listPlayerInventoryCommand, "", getStaffFlagValue("None"), true, false, "Shows the items in your inventory"),
			new CommandData("inventory", listPlayerInventoryCommand, "", getStaffFlagValue("None"), true, false, "Shows the items in your inventory"),

			new CommandData("items", listItemInventoryCommand, "", getStaffFlagValue("None"), true, false, "Shows the items in your inventory"),
			new CommandData("houseitems", listHouseInventoryCommand, "", getStaffFlagValue("None"), true, false, "Shows the items in the house's storage"),
			new CommandData("bizstorage", listBusinessStorageInventoryCommand, "", getStaffFlagValue("None"), true, false, "Shows the items in the business's extra storage (not buyable)"),
			new CommandData("bizfloor", listBusinessFloorInventoryCommand, "", getStaffFlagValue("None"), true, false, "Shows the items that can be bought from the business"),
			new CommandData("businessstorage", listBusinessStorageInventoryCommand, "", getStaffFlagValue("None"), true, false, "Shows the items in the business's extra storage (not buyable)"),
			new CommandData("businessfloor", listBusinessFloorInventoryCommand, "", getStaffFlagValue("None"), true, false, "Shows the items that can be bought from the business"),
			new CommandData("buylist", listBusinessFloorInventoryCommand, "", getStaffFlagValue("None"), true, false, "Shows the items that can be bought from the business"),

			new CommandData("power", toggleItemEnabledCommand, "", getStaffFlagValue("None"), true, false, "Turns on or off an item"),
			new CommandData("freq", setWalkieTalkieFrequencyCommand, "[frequncy number]", getStaffFlagValue("None"), true, false, "Sets a radio item's frequency"),
			//new CommandData("call", callWithPhoneCommand, "[number]", getStaffFlagValue("None"), true, false),
			//new CommandData("speakerphone", togglePhoneSpeakerCommand, "", getStaffFlagValue("None"), true, false),
			new CommandData("radio", walkieTalkieChatCommand, "", getStaffFlagValue("None"), true, false, "Chat over a radio item (item must be able to transmit)"),
			new CommandData("r", walkieTalkieChatCommand, "", getStaffFlagValue("None"), true, false, "Chat over a radio item (item must be able to transmit)"),

			new CommandData("additemtype", createItemTypeCommand, "<name>", getStaffFlagValue("ManageItems"), true, false, "Adds a new item type"),
			new CommandData("itemtypeusetype", setItemTypeUseTypeCommand, "<item type> <use type>", getStaffFlagValue("ManageItems"), true, false, "Sets an item type's use-type (what kind of action is performed when using it)"),
			new CommandData("itemtypeuseval", setItemTypeUseValueCommand, "<item type> <use value>", getStaffFlagValue("ManageItems"), true, false, "Sets an item type's use-value (how much gets subtracted when using it)"),
			new CommandData("itemtypeorderprice", setItemTypeOrderPriceCommand, "<item type> <order price>", getStaffFlagValue("ManageItems"), true, false, "Sets an item type's order price (base price when ordering for a business"),
			new CommandData("itemtyperiskmult", setItemTypeRiskMultiplierCommand, "<item type> <risk multiplier>", getStaffFlagValue("ManageItems"), true, false, "Sets an item type's risk multiplayer (higher value for more dangerous or rare illegal items)"),
			new CommandData("itemtypeenabled", toggleItemTypeEnabledCommand, "<item type>", getStaffFlagValue("ManageItems"), true, false, "Toggles an item type on or off (if off, any items with that type can't be interacted with)"),
			new CommandData("itemtypedropmodel", setItemTypeDropModelCommand, "<item type> <object name/id>", getStaffFlagValue("ManageItems"), true, false, "Sets the drop model for the object of an item type when dropped"),
			new CommandData("itemtypedroppos", setItemTypeDropPositionCommand, "<item type> [x] [y] [z]", getStaffFlagValue("ManageItems"), true, false, "Sets the offset position for the object of an item type when dropped"),
			new CommandData("itemtypedroprot", setItemTypeDropRotationCommand, "<item type> [x] [y] [z]", getStaffFlagValue("ManageItems"), true, false, "Sets the rotation for the object of an item type when dropped"),
			new CommandData("itemtypedropscale", setItemTypeDropScaleCommand, "<item type> [x] [y] [z]", getStaffFlagValue("ManageItems"), true, false, "Sets the scale for the object of an item type when dropped"),
			new CommandData("itemtypedropfrontdistance", setItemTypeDropFrontDistanceCommand, "<item type> <distance>", getStaffFlagValue("ManageItems"), true, false, "Sets how far in front of a player an item type will be dropped"),
			new CommandData("itemtypemaxval", setItemTypeMaxValueCommand, "<item type> <max value>", getStaffFlagValue("ManageItems"), true, false, "Sets the maximum value an item type can have"),
			new CommandData("itemtypeorderval", setItemTypeOrderValueCommand, "<item type> <order value>", getStaffFlagValue("ManageItems"), true, false, "Sets the initial value of an item type when ordered by a business"),
			new CommandData("itemtypesize", setItemTypeSizeCommand, "<item type> <order value>", getStaffFlagValue("ManageItems"), true, false, "Sets the item type's size"),
			new CommandData("itemtypecapacity", setItemTypeCapacityCommand, "<item type> <order value>", getStaffFlagValue("ManageItems"), true, false, "Sets an item type's capacity (how much it can hold)"),

			new CommandData("delplritem", deleteItemInPlayerInventoryCommand, "<player name/id> <item slot>", getStaffFlagValue("ManageItems"), true, false, "Removes an item by slot from a player's personal inventory"),
			new CommandData("delplritems", deleteAllItemsInPlayerInventoryCommand, "<player name/id>", getStaffFlagValue("ManageItems"), true, false, "Removes all items from a player's personal inventory"),
		],
		job: [
			new CommandData("takejob", takeJobCommand, "", getStaffFlagValue("None"), true, false, "Gives you the job"),
			new CommandData("startwork", startWorkingCommand, "", getStaffFlagValue("None"), true, false, "Start working at your job (use at a job location or near a job vehicle)"),
			new CommandData("stopwork", stopWorkingCommand, "", getStaffFlagValue("None"), true, false, "Stop working at your job"),
			new CommandData("startjob", startWorkingCommand, "", getStaffFlagValue("None"), true, false, "Start working at your job (use at a job location or near a job vehicle)"),
			new CommandData("stopjob", stopWorkingCommand, "", getStaffFlagValue("None"), true, false, "Stop working at your job"),
			new CommandData("quitjob", quitJobCommand, "", getStaffFlagValue("None"), true, false, "Leave your job and be unemployed"),
			new CommandData("uniform", jobUniformCommand, "[uniform]", getStaffFlagValue("None"), true, false, "Use a job uniform"),
			new CommandData("equip", jobEquipmentCommand, "[equipment]", getStaffFlagValue("None"), true, false, "Get equipment for your job"),

			new CommandData("jobs", jobListCommand, "", getStaffFlagValue("None"), true, false, "Shows a list of all jobs"),
			new CommandData("joblist", jobListCommand, "", getStaffFlagValue("None"), true, false, "Shows a list of all jobs"),
			new CommandData("alljobs", jobListCommand, "", getStaffFlagValue("None"), true, false, "Shows a list of all jobs"),

			// Emergency Services (Police, Fire, EMS, etc)
			new CommandData("department", jobDepartmentRadioCommand, "", getStaffFlagValue("None"), true, false, "Communicate with all emergency services (radio must be on and able to transmit)"),
			new CommandData("d", jobDepartmentRadioCommand, "", getStaffFlagValue("None"), true, false, "Communicate with all emergency services (radio must be on and able to transmit)"),

			// Taxi
			new CommandData("fare", taxiSetFareCommand, "", getStaffFlagValue("None"), true, false, "Sets the fare for passengers in your taxi (amount is charged every 10 seconds)"),

			// Police
			new CommandData("detain", policeDetainCommand, "", getStaffFlagValue("None"), true, false, "Puts a handcuffed person in the back of your police vehicle"),
			new CommandData("drag", policeDragCommand, "", getStaffFlagValue("None"), true, false, "Drags a handcuffed person around"),
			new CommandData("search", policeSearchCommand, "", getStaffFlagValue("None"), true, false, "Searches a person"),

			// Routes
			new CommandData("startroute", jobStartRouteCommand, "", getStaffFlagValue("None"), true, false),
			new CommandData("stoproute", jobStopRouteCommand, "", getStaffFlagValue("None"), true, false),

			// Admin Job Stuff
			new CommandData("addjob", createJobCommand, "<name>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("addjobloc", createJobLocationCommand, "<job name/id>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("addjoblocation", createJobLocationCommand, "<job name/id>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("addjobuniform", createJobUniformCommand, "<job name/id> <skin name/id>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("deljobloc", deleteJobLocationCommand, "", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("deljoblocation", deleteJobLocationCommand, "", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("deljobuniform", deleteJobUniformCommand, "<job name/id> <skin name/id>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("addjobroute", createJobRouteCommand, "<name>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("addjobrouteloc", createJobRouteLocationCommand, "<name>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("addjobroutelocation", createJobRouteLocationCommand, "<name>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("deljobroute", deleteJobRouteCommand, "", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("deljobrouteloc", deleteJobRouteLocationCommand, "", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("deljobroutelocation", deleteJobRouteLocationCommand, "", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutelocpos", setJobRouteLocationPositionCommand, "", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutename", setJobRouteNameCommand, "<name>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutepay", setJobRoutePayCommand, "<amount>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutestartmsg", setJobRouteStartMessageCommand, "<new message>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutefinishmsg", setJobRouteFinishMessageCommand, "<new message>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutearrivemsg", setJobRouteDefaultLocationArriveMessageCommand, "<new message>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutenextmsg", setJobRouteDefaultLocationNextMessageCommand, "<new message>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutelocarrivemsg", setJobRouteNextLocationArriveMessageCommand, "<new message>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutelocnextmsg", setJobRouteNextLocationGotoMessageCommand, "<new message>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobrouteenabled", toggleJobRouteEnabledCommand, "", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutevehcolours", setJobRouteVehicleColoursCommand, "<colour 1> <colour 2>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutedelays", setJobRouteAllLocationDelaysCommand, "<time in milliseconds>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobroutelocdelay", setJobRouteNextLocationDelayCommand, "<time in milliseconds>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobcolour", setJobColourCommand, "<job id/name> <red> <green> <blue>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobblip", setJobBlipCommand, "<job id/name> <blip id/name>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobpickup", setJobPickupCommand, "<job id/name> <pickup id/name>", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobwl", toggleJobWhiteListCommand, "[job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobwhitelist", toggleJobWhiteListCommand, "[job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobblacklist", toggleJobBlackListCommand, "[job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobbl", toggleJobBlackListCommand, "[job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobtoggle", toggleJobEnabledCommand, "[job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobaddplayerwl", addPlayerToJobWhiteListCommand, "<player name/id> [job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobaddplayerbl", addPlayerToJobBlackListCommand, "<player name/id> [job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobdelplayerbl", removePlayerFromJobBlackListCommand, "<player name/id> [job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobdelplayerbl", removePlayerFromJobWhiteListCommand, "<player name/id> [job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobaddplrwl", addPlayerToJobWhiteListCommand, "<player name/id> [job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobaddplayerbl", addPlayerToJobBlackListCommand, "<player name/id> [job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobdelplayerbl", removePlayerFromJobBlackListCommand, "<player name/id> [job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobdelplrbl", removePlayerFromJobWhiteListCommand, "<player name/id> [job id]", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobreloadall", reloadAllJobsCommand, "", getStaffFlagValue("ManageJobs"), true, false),
			new CommandData("jobinfo", getJobInfoCommand, "", getStaffFlagValue("None"), true, true, "Get info for nearest or specified job"),
			new CommandData("joblocinfo", getJobLocationInfoCommand, "", getStaffFlagValue("None"), true, true, "Get info for nearest or specified job location"),
		],
		keybind: [
			new CommandData("bindkey", addKeyBindCommand, "<key id/name> <command> [params]", getStaffFlagValue("None"), true, false, "Binds a key to a command and optional parameters"),
			new CommandData("unbindkey", removeKeyBindCommand, "<key id/name>", getStaffFlagValue("None"), true, false, "Removes an existing keybind from your account"),
			new CommandData("keybinds", showKeyBindListCommand, "", getStaffFlagValue("None"), true, false, "Shows a list of all your current keybinds"),
		],
		locale: [
			new CommandData("lang", setLocaleCommand, "<language name>", getStaffFlagValue("None"), true, false, "Sets your language"),
			new CommandData("language", setLocaleCommand, "<language name>", getStaffFlagValue("None"), true, false, "Sets your language"),
			new CommandData("locale", setLocaleCommand, "<language name>", getStaffFlagValue("None"), true, false, "Sets your language"),
			new CommandData("setlang", setLocaleCommand, "<language name>", getStaffFlagValue("None"), true, false, "Sets your language"),
		],
		messaging: [],
		misc: [
			new CommandData("pos", getPositionCommand, "", getStaffFlagValue("BasicModeration"), true, false, "Shows your current coordinates"),
			new CommandData("idea", submitIdeaCommand, "<message>", getStaffFlagValue("None"), true, true, "Sends an suggestion/idea to the developers"),
			new CommandData("bug", submitBugReportCommand, "<message>", getStaffFlagValue("None"), true, true, "Submits a bug report"),
			new CommandData("enter", enterExitPropertyCommand, "", getStaffFlagValue("None"), true, true, "Enters or exists a house/business"),
			new CommandData("exit", enterExitPropertyCommand, "", getStaffFlagValue("None"), true, true, "Enters or exists a house/business"),
			new CommandData("cursor", toggleMouseCursorCommand, "", getStaffFlagValue("None"), true, false, "Toggles cursor visibility"),
			new CommandData("mousecam", toggleMouseCameraCommand, "", getStaffFlagValue("None"), true, false, "Toggles vehicle mouse camera for games that don't have it"),
			new CommandData("yes", playerPromptAnswerYesCommand, "", getStaffFlagValue("None"), true, false, "Answers a prompt with YES"),
			new CommandData("no", playerPromptAnswerNoCommand, "", getStaffFlagValue("None"), true, false, "Answers a prompt with NO"),
			new CommandData("admins", listOnlineAdminsCommand, "", getStaffFlagValue("None"), true, true, "Shows a list of online admins"),
			new CommandData("stuck", stuckPlayerCommand, "", getStaffFlagValue("None"), true, false, "Fixes your position and virtual world if bugged"),
			new CommandData("gps", gpsCommand, "[item or place name]", getStaffFlagValue("None"), true, false, "Shows you locations for special places or where to buy items"),
			new CommandData("speak", playerPedSpeakCommand, "<speech name>", getStaffFlagValue("None"), true, false, "Makes your ped say something in their game voice (IV only)"),
			new CommandData("lock", lockCommand, "", getStaffFlagValue("None"), true, false, "Locks and unlocks your vehicle, house, or business"),
			new CommandData("locks", lockCommand, "", getStaffFlagValue("None"), true, false, "Locks and unlocks your vehicle, house, or business"),
			new CommandData("doorlock", lockCommand, "", getStaffFlagValue("None"), true, false, "Locks and unlocks your vehicle, house, or business"),
			new CommandData("lockdoor", lockCommand, "", getStaffFlagValue("None"), true, false, "Locks and unlocks your vehicle, house, or business"),
			new CommandData("lights", lightsCommand, "", getStaffFlagValue("None"), true, false, "Turns on and off the lights for your vehicle, house, or business"),
			new CommandData("light", lightsCommand, "", getStaffFlagValue("None"), true, false, "Turns on and off the lights for your vehicle, house, or business"),
			new CommandData("kill", suicideCommand, "", getStaffFlagValue("None"), true, false, "Kills yourself"),
			new CommandData("suicide", suicideCommand, "", getStaffFlagValue("None"), true, false, "Kills yourself"),
		],
		npc: [
			new CommandData("addnpc", createNPCCommand, "<skin id/name>", getStaffFlagValue("ManageNPCs"), true, false, "Creates an NPC with the specified skin"),
			new CommandData("delnpc", deleteNPCCommand, "", getStaffFlagValue("ManageNPCs"), true, false, "Deletes the nearest NPC"),
			new CommandData("npcinfo", getNPCInfoCommand, "", getStaffFlagValue("ManageNPCs"), true, false, "Shows info about the nearest NPC"),
			new CommandData("npcanim", setNPCAnimationCommand, "<animation name>", getStaffFlagValue("ManageNPCs"), true, false, "Plays the specified animation on the nearest NPC"),
			new CommandData("npcname", setNPCNameCommand, "<name>", getStaffFlagValue("ManageNPCs"), true, false, "Sets the name of the nearest NPC"),
			new CommandData("npclookatplr", toggleNPCLookAtClosestPlayerCommand, "<name>", getStaffFlagValue("ManageNPCs"), true, false, "Makes the NPC look at the closest player"),
			//new CommandData("npcrespawnall", respawnAllNPCsCommand, "", getStaffFlagValue("ManageNPCs"), true, false, "Respawns all NPCs"),
			//new CommandData("npcrespawn", respawnNPCCommand, "", getStaffFlagValue("ManageNPCs"), true, false, "Respawns the nearest NPC"),
		],
		paintball: [],
		race: [
			// Unfinished!
			//new CommandData("addrace", createRaceCommand, "<name>", getStaffFlagValue("ManageRaces"), true, false, "Creates a race"),
			//new CommandData("delrace", deleteRaceCommand, "", getStaffFlagValue("ManageRaces"), true, false, "Deletes a race by name"),
			//new CommandData("addracecp", createRaceCheckPointCommand, "<name>", getStaffFlagValue("ManageRaces"), true, false, "Creates a race checkpoint"),
			//new CommandData("addracestart", createRaceStartPositionCommand, "<name>", getStaffFlagValue("ManageRaces"), true, false, "Creates a starting position for a race"),
			//new CommandData("delracestart", deleteRaceStartPositionCommand, "", getStaffFlagValue("ManageRaces"), true, false, "Deletes the closest starting position for a race"),
			//new CommandData("delracecp", deleteRaceCheckPointCommand, "", getStaffFlagValue("ManageRaces"), true, false, "Deletes the closest race checkpoint"),
			//new CommandData("racename", setRaceNameCommand, "<name>", getStaffFlagValue("ManageRaces"), true, false, "Sets a race's name"),
			//new CommandData("racestart", startRaceCommand, "", getStaffFlagValue("None"), true, false, "Starts a race"),
			//new CommandData("startrace", startRaceCommand, "", getStaffFlagValue("None"), true, false, "Starts a race"),
			//new CommandData("racestop", stopRaceCommand, "", getStaffFlagValue("None"), true, false, "Stops racing (forfeits if in an active race)"),
			//new CommandData("stoprace", stopRaceCommand, "", getStaffFlagValue("None"), true, false, "Stops racing (forfeits if in an active race)"),
			//new CommandData("racestopall", stopAllRacesCommand, "", getStaffFlagValue("ManageRaces"), true, false, "Stops all active races"),
			//new CommandData("stopallraces", stopAllRacesCommand, "", getStaffFlagValue("ManageRaces"), true, false, "Stops all active races"),
		],
		radio: [
			new CommandData("radiostation", playStreamingRadioCommand, "<radio station id>", getStaffFlagValue("None"), true, false, "Plays a radio station in your vehicle, house, or business (depending on which one you're in)"),
			new CommandData("radiostations", showRadioStationListCommand, "", getStaffFlagValue("None"), true, false, "Shows a list of all available radio stations"),
			new CommandData("radiovolume", setStreamingRadioVolumeCommand, "<volume level 0-100>", getStaffFlagValue("None"), true, false, "Sets the radio streaming volume (for your game only)."),
			new CommandData("radiovol", setStreamingRadioVolumeCommand, "<volume level 0-100>", getStaffFlagValue("None"), true, false, "Sets the radio streaming volume (for your game only)."),
			new CommandData("radioreloadall", reloadAllRadioStationsCommand, "", getStaffFlagValue("ManageServer"), true, false, "Reloads all radio stations from database (use after making changes)"),
		],
		security: [],
		staff: [
			new CommandData("adminchat", adminChatCommand, "<message>", getStaffFlagValue("BasicModeration"), true, true, "Sends an OOC chat message to other admins"),
			new CommandData("a", adminChatCommand, "<message>", getStaffFlagValue("BasicModeration"), true, true, "Sends an OOC chat message to other admins"),
			new CommandData("achat", adminChatCommand, "<message>", getStaffFlagValue("BasicModeration"), true, true, "Sends an OOC chat message to other admins"),
			new CommandData("kick", kickClientCommand, "<player name/id> [reason]", getStaffFlagValue("BasicModeration"), true, true, "Kicks a player from the server"),
			new CommandData("mute", muteClientCommand, "<player name/id> [reason]", getStaffFlagValue("BasicModeration"), true, true, "Mutes a player, preventing them from using any chat."),
			new CommandData("freeze", freezeClientCommand, "<player name/id> [reason]", getStaffFlagValue("BasicModeration"), true, true, "Freeze a player, preventing them from moving."),
			new CommandData("unmute", unMuteClientCommand, "<player name/id> [reason]", getStaffFlagValue("BasicModeration"), true, true, "Unmutes a player, allowing them to chat again."),
			new CommandData("unfreeze", unFreezeClientCommand, "<player name/id> [reason]", getStaffFlagValue("BasicModeration"), true, true, "Unfreezes a player, allowing them to move again."),
			new CommandData("goto", gotoPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to a player."),
			new CommandData("gethere", getPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Teleports a player to you."),
			new CommandData("getveh", getVehicleCommand, "<vehicle id>", getStaffFlagValue("BasicModeration"), true, true, "Teleports a vehicle to you."),
			new CommandData("warpinveh", warpIntoVehicleCommand, "[vehicle id]", getStaffFlagValue("ManageVehicles"), true, false),
			new CommandData("returnplr", returnPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Returns a player to their previous position."),
			new CommandData("returnplayer", returnPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Returns a player to their previous position."),
			new CommandData("gotopos", gotoPositionCommand, "<x> <y> <z> [int] [vw]", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to specific coordinates with optional interior and dimension."),
			new CommandData("gotoveh", gotoVehicleCommand, "<vehicle id>", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to a vehicle by ID."),
			new CommandData("gotovehicle", gotoVehicleCommand, "<vehicle id>", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to a vehicle by ID."),
			new CommandData("gotobiz", gotoBusinessCommand, "<business id/name>", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to a business by ID or name."),
			new CommandData("gotobusiness", gotoBusinessCommand, "<business id/name>", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to a business by ID or name."),
			new CommandData("gotohouse", gotoHouseCommand, "<house id/name>", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to a house by ID or description."),
			new CommandData("gotojob", gotoJobLocationCommand, "<job id/name> <location id>", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to a job location by name and location ID."),
			new CommandData("gotoloc", gotoGameLocationCommand, "<location name>", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to a game location by name."),
			new CommandData("gotospawn", gotoNewPlayerSpawnCommand, "", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to the new player spawn location"),
			new CommandData("fr", teleportForwardCommand, "[distance in meters]", getStaffFlagValue("BasicModeration"), true, true, "Teleports you forward a certain distance in meters."),
			new CommandData("ba", teleportBackwardCommand, "[distance in meters]", getStaffFlagValue("BasicModeration"), true, true, "Teleports you backward a certain distance in meters."),
			new CommandData("lt", teleportLeftCommand, "[distance in meters]", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to the left a certain distance in meters."),
			new CommandData("rt", teleportRightCommand, "[distance in meters]", getStaffFlagValue("BasicModeration"), true, true, "Teleports you to the right a certain distance in meters."),
			new CommandData("up", teleportUpCommand, "[distance in meters]", getStaffFlagValue("BasicModeration"), true, true, "Teleports you upward a certain distance in meters."),
			new CommandData("dn", teleportDownCommand, "[distance in meters]", getStaffFlagValue("BasicModeration"), true, true, "Teleports you downward a certain distance in meters."),
			new CommandData("int", playerInteriorCommand, "<player name/id> [interior id]", getStaffFlagValue("BasicModeration"), true, true, "Gets or sets a player's game interior."),
			new CommandData("vw", playerVirtualWorldCommand, "<player name/id> [virtual world id]", getStaffFlagValue("BasicModeration"), true, true, "Gets or sets a player's virtual world/dimension."),
			new CommandData("addplrstaffflag", addPlayerStaffFlagCommand, "<player name/id> <flag name>", getStaffFlagValue("ManageAdmins"), true, true, "Gives a player a staff flag by name (this server only)."),
			new CommandData("addplayerstaffflag", addPlayerStaffFlagCommand, "<player name/id> <flag name>", getStaffFlagValue("ManageAdmins"), true, true, "Gives a player a staff flag by name (this server only)."),
			new CommandData("addstaffflag", addPlayerStaffFlagCommand, "<player name/id> <flag name>", getStaffFlagValue("ManageAdmins"), true, true, "Gives a player a staff flag by name (this server only)."),
			new CommandData("delplrstaffflag", removePlayerStaffFlagCommand, "<player name/id> <flag name>", getStaffFlagValue("ManageAdmins"), true, true, "Takes a player's staff flag by name (this server only)."),
			new CommandData("delstaffflag", removePlayerStaffFlagCommand, "<player name/id> <flag name>", getStaffFlagValue("ManageAdmins"), true, true, "Takes a player's staff flag by name (this server only)."),
			new CommandData("getplrstaffflags", getPlayerStaffFlagsCommand, "<player name/id>", getStaffFlagValue("ManageAdmins"), true, true, "Shows a list of all staff flags a player has (this server only)."),
			new CommandData("delplrstaffflags", removePlayerStaffFlagsCommand, "<player name/id>", getStaffFlagValue("ManageAdmins"), true, true, "Removes all staff flags for a player (this server only)."),
			new CommandData("delstaffflags", removePlayerStaffFlagsCommand, "<player name/id>", getStaffFlagValue("ManageAdmins"), true, true, "Removes all staff flags for a player (this server only)."),
			new CommandData("allstaffflags", getStaffFlagsCommand, "", getStaffFlagValue("ManageAdmins"), true, true, "Shows a list of all valid staff flag names."),
			new CommandData("staffflags", getStaffFlagsCommand, "", getStaffFlagValue("ManageAdmins"), true, true, "Shows a list of all valid staff flag names."),
			new CommandData("plrstafftitle", setPlayerStaffTitleCommand, "", getStaffFlagValue("ManageAdmins"), true, true, "Sets a player's staff title."),
			new CommandData("playerstafftitle", setPlayerStaffTitleCommand, "", getStaffFlagValue("ManageAdmins"), true, true, "Sets a player's staff title."),
			new CommandData("stafftitle", setPlayerStaffTitleCommand, "", getStaffFlagValue("ManageAdmins"), true, true, "Sets a player's staff title."),
			new CommandData("givemoney", givePlayerMoneyCommand, "<player name/id> <amount>", getStaffFlagValue("serverManager"), true, true),
			new CommandData("nonrpname", forceCharacterNameChangeCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Forces a player to change their current character's name."),
			new CommandData("setname", forceCharacterNameCommand, "<player name/id> <first name> <last name>", getStaffFlagValue("BasicModeration"), true, true, "Changes a character's name directly."),
			new CommandData("setskin", forcePlayerSkinCommand, "<player name/id> <skin id/name>", getStaffFlagValue("BasicModeration"), true, true, "Changes a character's skin."),
			new CommandData("setaccent", forcePlayerAccentCommand, "<player name/id> <accent name>", getStaffFlagValue("BasicModeration"), true, true, "Changes a character's accent."),
			new CommandData("setfightstyle", forcePlayerFightStyleCommand, "<player name/id> <fight style name>", getStaffFlagValue("BasicModeration"), true, true, "Changes a character's fight style."),
			new CommandData("setstars", forcePlayerWantedLevelCommand, "<player name/id> <wanted level>", getStaffFlagValue("BasicModeration"), true, true, "Forces a player to have a wanted level"),
			new CommandData("plrinfo", getPlayerInfoCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows basic info about the specified player"),
			new CommandData("playerinfo", getPlayerInfoCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows basic info about the specified player"),
			new CommandData("getplrhouses", getHousesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all houses owned by the player"),
			new CommandData("getplrbizs", getBusinessesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all businesses owned by the player"),
			new CommandData("getplrbusinesses", getBusinessesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all businesses owned by the player"),
			new CommandData("getplrvehs", getVehiclesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all vehicles owned by the player"),
			new CommandData("getplrvehicles", getVehiclesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all vehicles owned by the player"),
			new CommandData("getplayerhouses", getHousesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all houses owned by the player"),
			new CommandData("getplayerbizs", getBusinessesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all businesses owned by the player"),
			new CommandData("getplayerbusinesses", getBusinessesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all businesses owned by the player"),
			new CommandData("getplayervehs", getVehiclesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all vehicles owned by the player"),
			new CommandData("getplayervehicles", getVehiclesOwnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Shows a list of all vehicles owned by the player"),
			new CommandData("geoip", getPlayerGeoIPInformationCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Retrieves GeoIP information on a player (country & city)"),
			new CommandData("ip", getPlayerIPInformationCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Retrieves IP information on a player"),
			new CommandData("getgeoip", getPlayerGeoIPInformationCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Retrieves GeoIP information on a player (country & city)"),
			new CommandData("getip", getPlayerIPInformationCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Retrieves IP information on a player"),
			new CommandData("plrsync", toggleSyncForElementsSpawnedByPlayerCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Sets whether elements spawned by a player are synced (traffic, peds, etc)"),
			new CommandData("health", forcePlayerHealthCommand, "<player name/id> <health", getStaffFlagValue("BasicModeration"), true, true, "Sets a player's health"),
			new CommandData("armour", forcePlayerArmourCommand, "<player name/id> <armour>", getStaffFlagValue("BasicModeration"), true, true, "Sets a player's armour"),
			new CommandData("sethealth", forcePlayerHealthCommand, "<player name/id> <health", getStaffFlagValue("BasicModeration"), true, true, "Sets a player's health"),
			new CommandData("setarmour", forcePlayerArmourCommand, "<player name/id> <armour>", getStaffFlagValue("BasicModeration"), true, true, "Sets a player's armour"),
			new CommandData("infiniterun", setPlayerInfiniteRunCommand, "<player name/id> <state>", getStaffFlagValue("BasicModeration"), true, true, "Toggles a player's infinite sprint"),
			new CommandData("atbiz", getPlayerCurrentBusinessCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Gets which business a player is at/in"),
			new CommandData("atbusiness", getPlayerCurrentBusinessCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Gets which business a player is at/in"),
			new CommandData("athouse", getPlayerCurrentHouseCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Gets which house a player is at/in"),
			new CommandData("biz", getPlayerCurrentBusinessCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Gets which business a player is at/in"),
			new CommandData("business", getPlayerCurrentBusinessCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Gets which business a player is at/in"),
			new CommandData("house", getPlayerCurrentHouseCommand, "<player name/id>", getStaffFlagValue("BasicModeration"), true, true, "Gets which house a player is at/in"),
		],
		startup: [],
		subAccount: [
			new CommandData("switchchar", switchCharacterCommand, "", getStaffFlagValue("None"), true, false),
			new CommandData("newchar", newCharacterCommand, "<first name> <last name>", getStaffFlagValue("None"), true, false),
			new CommandData("usechar", useCharacterCommand, "<character id>", getStaffFlagValue("None"), true, false),
			new CommandData("autolastchar", toggleAutoSelectLastCharacterCommand, "", getStaffFlagValue("None"), true, false, "Toggle whether to automatically spawn with the last character you played as"),
		],
		translate: [],
		trigger: [
			new CommandData("addtrig", createTriggerCommand, "<trigger name>", getStaffFlagValue("ManageServer"), true, false),
			new CommandData("deltrig", deleteTriggerCommand, "<trigger id>", getStaffFlagValue("ManageServer"), true, false),
			new CommandData("addtrigcond", addTriggerConditionCommand, "<trigger id> <condition name>", getStaffFlagValue("ManageServer"), true, false),
			new CommandData("deltrigcond", removeTriggerConditionCommand, "<trigger id> <condition id>", getStaffFlagValue("ManageServer"), true, false),
			new CommandData("addtrigresp", addTriggerResponseCommand, "<trigger id> <response name>", getStaffFlagValue("ManageServer"), true, false),
			new CommandData("deltrigresp", removeTriggerResponseCommand, "<trigger id> <response name>", getStaffFlagValue("ManageServer"), true, false),
			new CommandData("triggers", listTriggersCommand, "[search value]", getStaffFlagValue("ManageServer"), true, false),
			new CommandData("trigcond", listTriggerConditionsCommand, "<trigger id>", getStaffFlagValue("ManageServer"), true, false),
			new CommandData("trigresp", listTriggerResponsesCommand, "<trigger id>", getStaffFlagValue("ManageServer"), true, false),
			new CommandData("trigtoggle", toggleTriggerEnabledCommand, "<trigger id> [0/1 state]", getStaffFlagValue("ManageServer"), true, false),
		],
		utilities: [],
		vehicle: [
			new CommandData("addveh", createVehicleCommand, "<model id/name>", getStaffFlagValue("ManageVehicles"), true, false),
			//new CommandData("spawnveh", createVehicleCommand, "<model id/name>", getStaffFlagValue("ManageVehicles"), true, false),
			//new CommandData("createveh", createVehicleCommand, "<model id/name>", getStaffFlagValue("ManageVehicles"), true, false),
			new CommandData("tempveh", createTemporaryVehicleCommand, "<model id/name>", getStaffFlagValue("ManageVehicles"), true, false),
			new CommandData("delveh", deleteVehicleCommand, "", getStaffFlagValue("ManageVehicles"), true, false),
			new CommandData("nearveh", getNearbyVehiclesCommand, "", getStaffFlagValue("None"), true, false),

			new CommandData("oldveh", getLastVehicleInfoCommand, "", getStaffFlagValue("None"), true, false),
			new CommandData("lastveh", getLastVehicleInfoCommand, "", getStaffFlagValue("None"), true, false),
			new CommandData("oldcar", getLastVehicleInfoCommand, "", getStaffFlagValue("None"), true, false),
			new CommandData("lastcar", getLastVehicleInfoCommand, "", getStaffFlagValue("None"), true, false),

			//new CommandData("unlock", vehicleLockCommand, "", getStaffFlagValue("None"), true, false),
			new CommandData("engine", vehicleEngineCommand, "", getStaffFlagValue("None"), true, false),
			new CommandData("siren", vehicleSirenCommand, "", getStaffFlagValue("None"), true, false),

			new CommandData("vehowner", setVehicleOwnerCommand, "<player id/name>", getStaffFlagValue("ManageVehicles"), true, true),
			new CommandData("vehpublic", setVehiclePublicCommand, "", getStaffFlagValue("ManageVehicles"), true, true),
			new CommandData("vehclan", setVehicleClanCommand, "<clan id/name>", getStaffFlagValue(""), true, true),
			new CommandData("vehbiz", setVehicleBusinessCommand, "", getStaffFlagValue(""), true, true),
			new CommandData("vehjob", setVehicleJobCommand, "[job id/name]", getStaffFlagValue("ManageVehicles"), true, true),
			new CommandData("vehdelowner", removeVehicleOwnerCommand, "", getStaffFlagValue("ManageVehicles"), true, true),
			new CommandData("vehrank", setVehicleRankCommand, "<rank id/name>", getStaffFlagValue("None"), true, true),
			new CommandData("vehiclerank", setVehicleRankCommand, "<rank id/name>", getStaffFlagValue("None"), true, true),
			new CommandData("vehinfo", getVehicleInfoCommand, "", getStaffFlagValue("None"), true, true),
			new CommandData("vehicleinfo", getVehicleInfoCommand, "", getStaffFlagValue("None"), true, true),
			new CommandData("vehpark", toggleVehicleSpawnLockCommand, "", getStaffFlagValue("ManageVehicles"), true, true),
			new CommandData("parkveh", toggleVehicleSpawnLockCommand, "", getStaffFlagValue("ManageVehicles"), true, true),
			new CommandData("vehiclepark", toggleVehicleSpawnLockCommand, "", getStaffFlagValue("ManageVehicles"), true, true),
			new CommandData("parkvehicle", toggleVehicleSpawnLockCommand, "", getStaffFlagValue("ManageVehicles"), true, true),
			new CommandData("vehrespawnall", respawnAllVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all vehicles (also respawns all traffic vehicles)"),
			new CommandData("vehrespawnempty", respawnEmptyVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all empty/unoccupied vehicles"),
			new CommandData("vehrespawnjob", respawnJobVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all job vehicles"),
			new CommandData("vehrespawnplr", respawnPlayerVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all player-owned vehicles"),
			new CommandData("vehrespawnclan", respawnClanVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all clan-owned vehicles"),
			new CommandData("vehrespawnpublic", respawnPublicVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all public vehicles"),
			new CommandData("vehrespawnbiz", respawnBusinessVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all business-owned vehicles"),
			new CommandData("vehrespawn", respawnVehicleCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns your current vehicle"),
			new CommandData("vehreloadall", reloadAllVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Deletes and reloads all vehicles from database"),
			new CommandData("carrespawnall", respawnAllVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all vehicles (also respawns all traffic vehicles)"),
			new CommandData("carrespawnempty", respawnEmptyVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all empty/unoccupied vehicles"),
			new CommandData("carrespawnjob", respawnJobVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all job vehicles"),
			new CommandData("carrespawnplr", respawnPlayerVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all player-owned vehicles"),
			new CommandData("carrespawnclan", respawnClanVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all clan-owned vehicles"),
			new CommandData("carrespawnpublic", respawnPublicVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all public vehicles"),
			new CommandData("carrespawnbiz", respawnBusinessVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns all business-owned vehicles"),
			new CommandData("carrespawn", respawnVehicleCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Respawns your current vehicle"),
			new CommandData("carreloadall", reloadAllVehiclesCommand, "", getStaffFlagValue("ManageVehicles"), true, true, "Deletes and reloads all vehicles from database"),
			new CommandData("vehrent", rentVehicleCommand, "", getStaffFlagValue("None"), true, true, "Starts renting your current vehicle (if rentable)"),
			new CommandData("rentveh", rentVehicleCommand, "", getStaffFlagValue("None"), true, true, "Starts renting your current vehicle (if rentable)"),
			new CommandData("vehiclerent", rentVehicleCommand, "", getStaffFlagValue("None"), true, true, "Starts renting your current vehicle (if rentable)"),
			new CommandData("rentvehicle", rentVehicleCommand, "", getStaffFlagValue("None"), true, true, "Starts renting your current vehicle (if rentable)"),
			new CommandData("vehrentprice", setVehicleRentPriceCommand, "", getStaffFlagValue("None"), true, true, "Sets your vehicle's rent price"),
			new CommandData("vehbuyprice", setVehicleBuyPriceCommand, "", getStaffFlagValue("None"), true, true, "Sets your vehicle's rent price"),
			new CommandData("vehiclebuyprice", setVehicleBuyPriceCommand, "", getStaffFlagValue("None"), true, true, "Sets your vehicle's rent price"),
			new CommandData("vehprice", setVehicleBuyPriceCommand, "", getStaffFlagValue("None"), true, true, "Sets your vehicle's rent price"),
			new CommandData("vehicleprice", setVehicleBuyPriceCommand, "", getStaffFlagValue("None"), true, true, "Sets your vehicle's rent price"),
			new CommandData("rentpriceveh", setVehicleRentPriceCommand, "", getStaffFlagValue("None"), true, true, "Sets your vehicle's rent price"),
			new CommandData("buypriceveh", setVehicleBuyPriceCommand, "", getStaffFlagValue("None"), true, true, "Sets your vehicle's rent price"),
			new CommandData("stoprentveh", stopRentingVehicleCommand, "", getStaffFlagValue("None"), true, true, "Stops renting your vehicle"),
			new CommandData("vehstoprent", stopRentingVehicleCommand, "", getStaffFlagValue("None"), true, true, "Stops renting your vehicle"),
			new CommandData("vehiclerentprice", setVehicleRentPriceCommand, "", getStaffFlagValue("None"), true, true, "Sets your vehicle's rent price"),
			new CommandData("vehiclestoprent", stopRentingVehicleCommand, "", getStaffFlagValue("None"), true, true, "Stops renting your vehicle"),
			new CommandData("vehbuy", buyVehicleCommand, "", getStaffFlagValue("None"), true, true, "Purchases your vehicle"),
			new CommandData("vehiclebuy", buyVehicleCommand, "", getStaffFlagValue("None"), true, true, "Purchases your vehicle"),
			new CommandData("buyveh", buyVehicleCommand, "", getStaffFlagValue("None"), true, true, "Purchases your vehicle"),
			new CommandData("buyvehicle", buyVehicleCommand, "", getStaffFlagValue("None"), true, true, "Purchases your vehicle"),
			new CommandData("vehcolour", vehicleAdminColourCommand, "<colour1> <colour2>", getStaffFlagValue("None"), true, true, "Sets a vehicle's colour"),
			new CommandData("vehiclecolour", vehicleAdminColourCommand, "<colour1> <colour2>", getStaffFlagValue("None"), true, true, "Sets a vehicle's colour"),
			new CommandData("vehlivery", vehicleAdminLiveryCommand, "<livery id>", getStaffFlagValue("None"), true, true, "Sets your vehicle's livery/paintjob"),
			new CommandData("vehiclelivery", vehicleAdminLiveryCommand, "<livery id>", getStaffFlagValue("None"), true, true, "Sets your vehicle's livery/paintjob"),
			new CommandData("vehrepair", vehicleAdminRepairCommand, "", getStaffFlagValue("None"), true, true, "Repairs your vehicle"),
			new CommandData("vehiclerepair", vehicleAdminRepairCommand, "", getStaffFlagValue("None"), true, true, "Repairs your vehicle"),
			new CommandData("repairveh", vehicleAdminRepairCommand, "", getStaffFlagValue("None"), true, true, "Repairs your vehicle"),
			new CommandData("repairvehicle", vehicleAdminRepairCommand, "", getStaffFlagValue("None"), true, true, "Repairs your vehicle"),
			new CommandData("passenger", enterVehicleAsPassengerCommand, "", getStaffFlagValue("None"), true, true, "Enters a vehicle as passenger"),
		],
	};

	return tempCommands;
}

// ===========================================================================

function addAllCommandHandlers() {
	let commandCount = 0;
	let commands = getCommands();
	for (let i in commands) {
		for (let j in commands[i]) {
			logToConsole(LOG_VERBOSE, `[AGRP.Command] Adding command handler for ${i} - ${commands[i][j].command}`);
			addCommandHandler(commands[i][j].command, processPlayerCommand);
			commandCount++;
		}
	}

	removeCommandHandler("help");
	addCommandHandler("help", helpCommand);

	logToConsole(LOG_INFO, `[AGRP.Command] ${commandCount} command handlers added!`);
}

// ===========================================================================

function getCommand(command) {
	let commandGroups = getCommands()
	for (let i in commandGroups) {
		let commandGroup = commandGroups[i];
		for (let j in commandGroup) {
			if (toLowerCase(commandGroup[j].command) == toLowerCase(command)) {
				return commandGroup[j];
			}
		}
	}

	return false;
}

// ===========================================================================

function getCommandData(command) {
	return getCommand(command);
}

// ===========================================================================

function getCommands() {
	return getServerData().commands;
}

// ===========================================================================

function commandData(command, handlerFunction, syntaxString = "", requiredStaffFlags = getStaffFlagValue("None"), requireLogin = true, allowOnDiscord = true, usageHelpMessage) {
	return new CommandData(command, handlerFunction, syntaxString, requiredStaffFlags, requireLogin, allowOnDiscord, usageHelpMessage);
}

// ===========================================================================

function doesCommandRequireLogin(command) {
	return getCommand(command).requireLogin;
}

// ===========================================================================

function getCommandRequiredPermissions(command) {
	return getCommand(command).requiredStaffFlags;
}

// ===========================================================================

function getCommandSyntaxText(command) {
	return `/${command} ${getCommand(command).syntaxString}`;
}

// ===========================================================================

function isCommandAllowedOnDiscord(command) {
	return getCommand(command).allowOnDiscord;
}

// ===========================================================================

function disableCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	params = toLowerCase(params);

	if (!getCommand(params)) {
		messagePlayerError(client, `The command {ALTCOLOUR}/${params}{MAINCOLOUR} does not exist!`);
		return false;
	}

	getCommand(params).enabled = false;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} disabled the {ALTCOLOUR}${params}{MAINCOLOUR} command!`, true);
	return true;
}

// ===========================================================================

function enableCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	params = toLowerCase(params);

	if (!getCommand(params)) {
		messagePlayerError(client, `The command {ALTCOLOUR}/${params}{MAINCOLOUR} does not exist!`);
		return false;
	}

	getCommand(params).enabled = true;
	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} enabled the {ALTCOLOUR}${params}{MAINCOLOUR} command!`, true);
	return true;
}

// ===========================================================================

function disableAllCommandsByType(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	params = toLowerCase(params);

	if (isNull(getServerData().commands[params])) {
		messagePlayerError(client, `Command type {ALTCOLOUR}${params}{MAINCOLOUR} does not exist!`);
		return false;
	}

	for (let i in getServerData().commands[params]) {
		getServerData().commands[params][i].enabled = false;
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} disabled all {ALTCOLOUR}${params}{MAINCOLOUR} commands!`, true);
	return true;
}

// ===========================================================================

function enableAllCommandsByType(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	params = toLowerCase(params);

	if (isNull(getServerData().commands[params])) {
		messagePlayerError(client, `Command type {ALTCOLOUR}${params}{MAINCOLOUR} does not exist!`);
		return false;
	}

	for (let i in getServerData().commands[params]) {
		getServerData().commands[params][i].enabled = true;
	}

	messageAdmins(`{adminOrange}${getPlayerName(client)}{MAINCOLOUR} enabled all {ALTCOLOUR}${params}{MAINCOLOUR} commands!`, true);
	return true;
}

// ===========================================================================

//function onPlayerCommand(event, client, command, params) {
//	processPlayerCommand(command, params, client)
//}

// ===========================================================================

function processPlayerCommand(command, params, client) {
	if (builtInCommands.indexOf(toLowerCase(command)) != -1) {
		return true;
	}

	let commandData = getCommand(toLowerCase(command));

	let paramsDisplay = params;
	if (areParamsEmpty(params)) {
		paramsDisplay = "";
	}

	if (!doesCommandExist(toLowerCase(command))) {
		logToConsole(LOG_WARN, `[AGRP.Command] ${getPlayerDisplayForConsole(client)} attempted to use command, but failed (invalid command): /${command} ${paramsDisplay}`);

		let possibleCommand = getCommandFromParams(command);
		if (possibleCommand != false && doesPlayerHaveStaffPermission(client, getCommandRequiredPermissions(toLowerCase(possibleCommand.command)))) {
			messagePlayerError(client, getLocaleString(client, "InvalidCommandPossibleMatchTip", `{ALTCOLOUR}/${command}{MAINCOLOUR}`, `{ALTCOLOUR}${toLowerCase(possibleCommand.command)}{MAINCOLOUR}`));
		} else {
			messagePlayerError(client, getLocaleString(client, "InvalidCommandHelpTip", `{ALTCOLOUR}/${command}{MAINCOLOUR}`, `{ALTCOLOUR}/help{MAINCOLOUR}`));
		}
		return false;
	}

	if (!commandData.enabled) {
		logToConsole(LOG_WARN, `[AGRP.Command] ${getPlayerDisplayForConsole(client)} attempted to use command, but failed (command is disabled): /${command} ${paramsDisplay}`);
		messagePlayerError(client, `The command {ALTCOLOUR}/${command}{MAINCOLOUR} is disabled!`);
		messagePlayerError(client, getLocaleString(client, "CommandDisabled", `{ALTCOLOUR}/${command}{MAINCOLOUR}`));
		return false;
	}

	if (doesCommandRequireLogin(toLowerCase(command))) {
		if (!isPlayerLoggedIn(client)) {
			logToConsole(LOG_WARN, `[AGRP.Command] ${getPlayerDisplayForConsole(client)} attempted to use command, but failed (requires login first): /${command} ${paramsDisplay}`);
			messagePlayerError(client, getLocaleString(client, "CommandRequiresLogin", `{ALTCOLOUR}/${command}{MAINCOLOUR}`));
			return false;
		}
	}

	if (isClientFromDiscord(client)) {
		if (!isCommandAllowedOnDiscord(command)) {
			logToConsole(LOG_WARN, `[AGRP.Command] ${getPlayerDisplayForConsole(client)} attempted to use command from discord, but failed (not available on discord): /${command} ${paramsDisplay}`);
			messagePlayerError(client, `The {ALTCOLOUR}/${command}{MAINCOLOUR} command isn't available on discord!`);
			return false;
		}
	}

	if (!isConsole(client)) {
		if (!doesPlayerHaveStaffPermission(client, getCommandRequiredPermissions(toLowerCase(command)))) {
			logToConsole(LOG_WARN, `[AGRP.Command] ${getPlayerDisplayForConsole(client)} attempted to use command, but failed (no permission): /${command} ${paramsDisplay}`);
			messagePlayerError(client, getLocaleString(client, "CommandNoPermissions", `{ALTCOLOUR}/${toLowerCase(command)}{MAINCOLOUR}`));
			return false;
		}
	}

	logToConsole(LOG_DEBUG, `[AGRP.Command] ${getPlayerDisplayForConsole(client)} used command: /${command} ${paramsDisplay}`);
	commandData.handlerFunction(toLowerCase(command), params, client);
}

// ===========================================================================

addCommandHandler("cmd", function (command, params, client) {
	if (!isConsole(client)) {
		return false;
	}

	let splitParams = params.split(" ");
	let newCommand = getParam(params, " ", 1);
	let newParams = splitParams.slice(1).join(" ");

	getCommand(newCommand).handlerFunction(newCommand, newParams, client);
});

// ===========================================================================

function listAllCommands() {
	let commands = getCommands();
	for (let i in commands) {
		for (let j in commands[i]) {
			logToConsole(LOG_DEBUG, commands[i][j].command);
		}
	}
}

// ===========================================================================

function getAllCommandsInSingleArray() {
	let tempCommands = [];
	let commands = getCommands();
	for (let i in commands) {
		for (let j in commands[i]) {
			tempCommands.push(commands[i][j].command);
		}
	}

	return tempCommands;
}

// ===========================================================================

function getAllCommandsInGroupInSingleArray(groupName, staffFlag = "None") {
	let tempCommands = [];
	let commands = getCommands();
	for (let i in commands[groupName]) {
		if (getCommandRequiredPermissions(commands[groupName][i].command) == 0) {
			tempCommands.push(commands[groupName][i].command);
		}
	}

	return tempCommands;
}

// ===========================================================================

function getAllCommandsForStaffFlagInSingleArray(staffFlagName) {
	let tempCommands = [];
	let commands = getCommands();
	for (let i in commands) {
		for (let j in commands[i]) {
			if (getCommandRequiredPermissions(commands[i][j].command) != 0) {
				if (hasBitFlag(getCommandRequiredPermissions(commands[i][j].command), getStaffFlagValue(staffFlagName))) {
					tempCommands.push(commands[i][j].command);
				}
			}
		}
	}

	return tempCommands;
}

// ===========================================================================

function doesCommandExist(command) {
	if (getCommandData(command)) {
		return true;
	}

	return false;
}

// ===========================================================================

function cacheAllCommandsAliases() {
	let commands = getCommands();
	for (let i in commands) {
		for (let j in commands[i]) {
			for (let k in commands) {
				for (let m in commands[k]) {
					if (commands[i][j].handlerFunction == commands[k][m].handlerFunction) {
						commands[i][j].aliases.push(commands[k][m]);
						commands[k][m].aliases.push(commands[i][j]);
					}
				}
			}
		}
	}
}

// ===========================================================================

function getCommandAliasesNames(command) {
	let commandAliases = [];
	for (let i in command.aliases) {
		commandAliases.push(command.aliases[i].name);
	}

	return commandAliases;
}

// ===========================================================================

function areParamsEmpty(params) {
	if (!params || params == "" || params.length == 0 || typeof params == "undefined") {
		return true;
	}

	return false;
}

// ===========================================================================

function getParamsCount(params, delimiter = " ") {
	return params.split(delimiter).length;
}

// ===========================================================================

function areThereEnoughParams(params, requiredAmount, delimiter = " ") {
	return (params.split(delimiter).length >= requiredAmount);
}

// ===========================================================================

function getParam(params, delimiter, index) {
	return params.split(delimiter)[index - 1];
}

// ===========================================================================

function getCommandFromParams(params) {
	let commands = getCommands();
	for (let i in commands) {
		for (let j in commands[i]) {
			if (toLowerCase(commands[i][j].command).indexOf(toLowerCase(params)) != -1) {
				return commands[i][j];
			}
		}
	}

	return false;
}

// ===========================================================================