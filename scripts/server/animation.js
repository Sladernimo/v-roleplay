// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: animation.js
// DESC: Provides animation functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

function initAnimationScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Animation]: Initializing animation script ...");
	logToConsole(LOG_DEBUG, "[V.RP.Animation]: Animation script initialized!");
}

// ===========================================================================

function playPlayerAnimationCommand(command, params, client) {
	if (areParamsEmpty(params)) {
		messagePlayerSyntax(client, getCommandSyntaxText(command));
		return false;
	}

	let animationSlot = getAnimationFromParams(getParam(params, " ", 1));
	let animationPositionOffset = 1;

	if (!animationSlot) {
		messagePlayerError(client, getLocaleString(client, "InvalidAnimation"));
		messagePlayerInfo(client, getLocaleString(client, "AnimationCommandTip", `{ALTCOLOUR}/animlist{MAINCOLOUR}`));
		return false;
	}

	if (toInteger(animationPositionOffset) < 0 || toInteger(animationPositionOffset) > 3) {
		messagePlayerError(client, getLocaleString(client, "InvalidAnimationDistance"));
		return false;
	}

	if (getAnimationData(animationSlot)[3] == V_ANIMTYPE_SURRENDER) {
		getPlayerData(client).pedState = V_PEDSTATE_HANDSUP;
	}

	if (isPlayerHandCuffed(client) || isPlayerTazed(client) || isPlayerInForcedAnimation(client)) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	if (getAnimationData(animationSlot).loop == true) {
		if (hasPlayerSeenActionTip(client, "AnimationStop")) {
			messagePlayerTip(client, getGroupedLocaleString(client, "ActionTips", "AnimationStop", "{ALTCOLOUR}/stopanim{MAINCOLOUR}"));
		}
	}
	makePlayerPlayAnimation(client, animationSlot, animationPositionOffset);
}

// ===========================================================================

function stopPlayerAnimationCommand(command, params, client) {
	if (isPlayerHandCuffed(client) || isPlayerTazed(client) || isPlayerInForcedAnimation(client)) {
		messagePlayerError(client, getLocaleString(client, "UnableToDoThat"));
		return false;
	}

	setPlayerPosition(client, getPlayerData(client).currentAnimationPositionReturnTo);
	makePedStopAnimation(getPlayerPed(client));

	getPlayerData(client).currentAnimation = -1;
	getPlayerData(client).currentAnimationPositionOffset = false;
	getPlayerData(client).currentAnimationPositionReturnTo = false;
	getPlayerData(client).animationStart = 0;
	getPlayerData(client).animationForced = false;

	//setPlayerMouseCameraState(client, false);

	markPlayerActionTipSeen(client, "AnimationStop");
}

// ===========================================================================

function showAnimationListCommand(command, params, client) {
	let animList = getGameConfig().animations[getGame()].map(function (x) { return x.name; });

	let chunkedList = splitArrayIntoChunks(animList, 10);

	messagePlayerInfo(client, makeChatBoxSectionHeader(getLocaleString(client, "HeaderAnimationsList")));

	for (let i in chunkedList) {
		messagePlayerNormal(client, chunkedList[i].join(", "));
	}
}

// ===========================================================================

function isPlayerInForcedAnimation(client) {
	return getPlayerData(client).animationForced;
}

// ===========================================================================

function makePlayerPlayAnimation(client, animationSlot, offsetPosition = 1) {
	if (getAnimationData(animationSlot).loop == true) {
		getPlayerData(client).currentAnimation = animationSlot;
		getPlayerData(client).currentAnimationPositionOffset = offsetPosition;
		getPlayerData(client).currentAnimationPositionReturnTo = getPlayerPosition(client);
		getPlayerData(client).animationStart = getCurrentUnixTimestamp();
		getPlayerData(client).animationForced = false;
	}

	makePedPlayAnimation(getPlayerPed(client), animationSlot, offsetPosition);
	//setEntityData(getPlayerPed(client), "v.rp.anim", animationSlot, true);
	//if(getAnimationData(animationSlot)[9] != V_ANIMMOVE_NONE) {
	//	if(getGame() < V_GAME_GTA_SA) {
	//		setPlayerMouseCameraState(client, true);
	//	}
	//}
}

// ===========================================================================

function forcePlayerPlayAnimation(client, animationSlot, offsetPosition = 1) {
	if (getAnimationData(animationSlot).loop == true) {
		getPlayerData(client).currentAnimation = animationSlot;
		getPlayerData(client).currentAnimationPositionOffset = offsetPosition;
		getPlayerData(client).currentAnimationPositionReturnTo = getPlayerPosition(client);
		getPlayerData(client).animationStart = getCurrentUnixTimestamp();
		getPlayerData(client).animationForced = true;
	}

	setPlayerControlState(client, false);
	forcePedAnimation(getPlayerPed(client), animationSlot, offsetPosition);
}

// ===========================================================================

function makePlayerStopAnimation(client) {
	//setPlayerPosition(client, getPlayerData(client).currentAnimationPositionReturnTo);
	makePedStopAnimation(getPlayerPed(client));

	getPlayerData(client).currentAnimation = -1;
	getPlayerData(client).currentAnimationPositionOffset = false;
	getPlayerData(client).currentAnimationPositionReturnTo = false;
	getPlayerData(client).animationStart = 0;
	getPlayerData(client).animationForced = false;
}

// ===========================================================================