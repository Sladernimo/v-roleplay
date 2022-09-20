// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: email.js
// DESC: Provides email handling, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initEmailScript() {
	logToConsole(LOG_INFO, "[AGRP.Email]: Initializing email script ...");
	logToConsole(LOG_INFO, "[AGRP.Email]: Email script initialized successfully!");
}

// ===========================================================================

async function sendEmail(toEmail, toName, subject, body) {
	if (!checkForSMTPModule()) {
		return false;
	}

	Promise.resolve().then(() => {
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
			getEmailConfig().smtp.fromName
		);
	});
}

// ===========================================================================

function getEmailConfig() {
	return getGlobalConfig().email;
}

// ===========================================================================