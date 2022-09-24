// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: discord.js
// DESC: Provides discord bridging and connection functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Discord Webhook Types
const AGRP_DISCORD_WEBHOOK_NONE = 0;
const AGRP_DISCORD_WEBHOOK_LOG = 1;
const AGRP_DISCORD_WEBHOOK_ADMIN = 2;

// ===========================================================================

function initDiscordScript() {
	logToConsole(LOG_INFO, "[AGRP.Discord]: Initializing discord script ...");
	logToConsole(LOG_INFO, "[AGRP.Discord]: Discord script initialized successfully!");
}

// ===========================================================================

/*
addEventHandler("OnDiscordCommand", function(command, params, discordUser) {
	let commandData = getCommand(command);

	if(!commandData) {
		messagePlayerError(discordUser, "That command does not exist!");
		return false;
	}

	if(isCommandAllowedOnDiscord(command)) {
		messagePlayerError(discordUser, "That command can not be used on Discord!");
		return false;
	}

	if(doesClientHavePermission(discordUser, getCommandRequiredPermissions(command))) {
		messagePlayerError(discordUser, "You do not have permission to use that command!");
		return false;
	}

	commandData.handlerFunction(command, params, discordUser);
});
*/

// ===========================================================================

function messageDiscordUser(discordUser, messageText) {
	let socketData = JSON.stringify({
		type: "chat.message.text",
		payload: {
			author: discordUser.name,
			text: messageText,
		}
	});
	sendDiscordSocketData(socketData);
}

// ===========================================================================

function sendDiscordSocketData(socketData) {
	if (!getDiscordSocket()) {
		return false;
	}

	getDiscordSocket().send(module.hash.encodeBase64(socketData) + "\r\n");
}

// ===========================================================================

function isClientFromDiscord(client) {
	if (client == null) {
		return false;
	}

	if (client instanceof Client) {
		return false;
	} else {
		return true;
	}
}

// ===========================================================================

function getDiscordSocket() {
	return false;
}

// ===========================================================================

function getDiscordUserData(discordUserId) {
	return loadAccountFromDiscordUserId(discordUserId);
}

// ===========================================================================

function messageDiscordChatChannel(messageString) {
	if (getServerConfig().devServer == true) {
		return false;
	}

	if (!getGlobalConfig().discord.sendChat) {
		return false;
	}

	if (!getServerConfig().discord.sendChat) {
		return false;
	}

	messageString = removeColoursInMessage(messageString);
	messageString = replaceProfanityInMessage(messageString);
	triggerDiscordWebHook(messageString, getServerId(), AGRP_DISCORD_WEBHOOK_LOG);
}

// ===========================================================================

function messageDiscordEventChannel(messageString) {
	if (getServerConfig().devServer == true) {
		return false;
	}

	if (!getGlobalConfig().discord.sendEvents) {
		return false;
	}

	if (!getServerConfig().discord.sendEvents) {
		return false;
	}

	messageString = removeColoursInMessage(messageString);
	messageString = replaceProfanityInMessage(messageString);
	triggerDiscordWebHook(messageString, getServerId(), AGRP_DISCORD_WEBHOOK_LOG);
}

// ===========================================================================

function messageDiscordAdminChannel(messageString) {
	if (getServerConfig().devServer == true) {
		return false;
	}

	if (!getGlobalConfig().discord.sendAdmin) {
		return false;
	}

	if (!getServerConfig().discord.sendAdmin) {
		return false;
	}

	messageString = removeColoursInMessage(messageString);
	triggerDiscordWebHook(messageString, getServerId(), AGRP_DISCORD_WEBHOOK_ADMIN);
}

// ===========================================================================

function messageDiscordClanWebhook(clanIndex, requiredFlagValue, messageString) {
	if (getServerConfig().devServer == true) {
		return false;
	}

	if (!getGlobalConfig().discord.sendClan) {
		return false;
	}

	if (!getServerConfig().discord.sendClan) {
		return false;
	}

	if (!hasBitFlag(getClanData(clanIndex).discordWebhookFlags, requiredFlagValue)) {
		return false;
	}

	messageString = removeColoursInMessage(messageString);
	triggerClanDiscordWebHook(clanIndex, messageString);
}

// ===========================================================================

function triggerDiscordWebHook(messageString, serverId = getServerId(), type = AGRP_DISCORD_WEBHOOK_LOG) {
	if (!getGlobalConfig().discord.webhook.enabled) {
		return false;
	}

	let tempURL = getGlobalConfig().discord.webhook.webhookBaseURL;
	tempURL = tempURL.replace("{0}", encodeURIComponent(messageString));
	tempURL = tempURL.replace("{1}", serverId);
	tempURL = tempURL.replace("{2}", type);
	tempURL = tempURL.replace("{3}", getGlobalConfig().discord.webhook.pass);

	httpGet(
		tempURL,
		"",
		function (data) {

		},
		function (data) {
		}
	);
}

// ===========================================================================

function triggerClanDiscordWebHook(clanIndex, messageString) {
	if (!getGlobalConfig().discord.webhook.enabled) {
		return false;
	}

	/*
	let webhookURL = getClanData(clanIndex).discordWebhookURL;

	let tempURL = getGlobalConfig().discord.webhook.webhookBaseURL;
	tempURL = tempURL.replace("{0}", encodeURIComponent(messageString));
	tempURL = tempURL.replace("{1}", serverId);
	tempURL = tempURL.replace("{2}", type);
	tempURL = tempURL.replace("{3}", getGlobalConfig().discord.webhook.pass);

	httpGet(
		tempURL,
		"",
		function (data) {

		},
		function (data) {
		}
	);
	*/
}

// ===========================================================================