// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: email.js
// DESC: Provides email handling, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// Email Methods
const AGRP_EMAIL_METHOD_NONE = 0;							// None
const AGRP_EMAIL_METHOD_SMTP_MODULE = "smtp";				// Use SMTP module
const AGRP_EMAIL_METHOD_GET_REQUEST = "http";				// Use HTTP request (httpGet to custom PHP page)

// ===========================================================================

function initEmailScript() {
	logToConsole(LOG_INFO, "[AGRP.Email]: Initializing email script ...");
	logToConsole(LOG_INFO, "[AGRP.Email]: Email script initialized successfully!");
}

// ===========================================================================

async function sendEmail(toEmail, toName, subject, body) {
	switch (getEmailConfig().method) {
		case AGRP_EMAIL_METHOD_SMTP_MODULE:
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
			break;

		case AGRP_EMAIL_METHOD_GET_REQUEST:
			let tempURL = getEmailConfig().http.baseUrl;
			tempURL = tempURL.replace("{0}", encodeURI(password));
			tempURL = tempURL.replace("{1}", encodeURI(toEmail));
			tempURL = tempURL.replace("{2}", encodeURI(toName));
			tempURL = tempURL.replace("{3}", encodeURI(subject));
			tempURL = tempURL.replace("{4}", encodeURI(body));

			httpGet(
				tempURL,
				"",
				function (data) {

				},
				function (data) {
				}
			);
			break;

		default:
			return false;
	}

	return true;
}

// ===========================================================================

function getEmailConfig() {
	return getGlobalConfig().email;
}

// ===========================================================================