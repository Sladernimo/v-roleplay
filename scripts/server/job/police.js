// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: police.js
// DESC: Provides police officer job functions and usage
// TYPE: Job (JavaScript)
// ===========================================================================

function policeTazerCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if(!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeCuffCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if(!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeArrestCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if(!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeSearchCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if(!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeDragCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if(!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================

function policeDetainCommand(command, params, client) {
	if(!canPlayerUseJobs(client)) {
		messagePlayerError(client, "You are not allowed to use jobs.");
		return false;
	}

	if(!canPlayerUsePoliceJob(client)) {
		messagePlayerError(client, "You are not allowed to use the police job.");
		return false;
	}

	if(!isPlayerWorking(client)) {
		messagePlayerError(client, "You are not working! Use /startwork first.");
		return false;
	}

	if(!doesPlayerHaveJobType(client, VRR_JOB_POLICE)) {
		messagePlayerError(client, "You don't have a police job.");
		return false;
	}

	return true;
}

// ===========================================================================