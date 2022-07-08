// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: police.js
// DESC: Provides police officer job functions and usage
// TYPE: Job (JavaScript)
// ===========================================================================

function policeTazerCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if (!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if (!doesPlayerHaveJobType(client, AGRP_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeCuffCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if (!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if (!doesPlayerHaveJobType(client, AGRP_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeArrestCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if (!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if (!doesPlayerHaveJobType(client, AGRP_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeSearchCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if (!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if (!doesPlayerHaveJobType(client, AGRP_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeDragCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if (!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if (!doesPlayerHaveJobType(client, AGRP_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeDetainCommand(command, params, client) {
	if (!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if (!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if (!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if (!doesPlayerHaveJobType(client, AGRP_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================