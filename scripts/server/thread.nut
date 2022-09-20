// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: thread.nut
// DESC: Provides threaded functions (used in Squirrel since JavaScript thread hacks don't work)
// TYPE: Server (Squirrel)
// ===========================================================================

bindEventHandler("OnResourceStart", thisResource, function(event, resource) {
	emailThread <- newthread("sendEmail");

	exportFunction("sendEmailSquirrel", function(smtpHost, smtpPort, useTLS, smtpUser, smtpPassword, toEmail, toName, subject, body, fromEmail, fromName) {
		emailThread.call(smtpHost, smtpPort, useTLS, smtpUser, smtpPassword, toEmail, toName, subject, body, fromEmail, fromName);
	});
});

// ===========================================================================

function sendEmailSquirrel(smtpHost, smtpPort, useTLS, smtpUser, smtpPassword, toEmail, toName, subject, body, fromEmail, fromName) {
	module.smtp.send(smtpHost, smtpPort, useTLS, smtpUser, smtpPassword, toEmail, toName, subject, body, fromEmail, fromName);
}

// ===========================================================================