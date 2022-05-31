// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: email.js
// DESC: Provides email handling, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initEmailScript() {
	logToConsole(LOG_INFO, "[VRR.Email]: Initializing email script ...");
	logToConsole(LOG_INFO, "[VRR.Email]: Email script initialized successfully!");
}

// ===========================================================================

function sendEmail(toEmail, toName, subject, body) {
	if(!checkForSMTPModule()) {
		return false;
	}

	module.smtp.send(
		getEmailConfig().smtp.host,
		getEmailConfig().smtp.port,
		intToBool(getEmailConfig().smtp.useTLS),
		getEmailConfig().smtp.username,
		getEmailConfig().smtp.password,
		toEmail,
		toName,
		subject,
		body,
		getEmailConfig().smtp.from,
		getEmailConfig().smtp.fromName);
}

// ===========================================================================

function getEmailConfig() {
	return getGlobalConfig().email;
}

// ===========================================================================