// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: animation.js
// DESC: Provides animation functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

function makePedPlayAnimation(pedId, animationSlot, positionOffset) {
	let ped = getElementFromId(pedId);

	if(ped == null) {
		return false;
	}

	let animationData = getAnimationData(animationSlot);
	logToConsole(LOG_DEBUG, `[VRR.Animation] Playing animation ${animationData[0]} for ped ${pedId}`);

	let freezePlayer = false;
	switch(animationData.moveType) {
		case VRR_ANIMMOVE_FORWARD: {
			setElementCollisionsEnabled(ped, false);
			if(ped.isSyncer) {
				setElementPosition(ped, getPosInFrontOfPos(getElementPosition(pedId), fixAngle(getElementHeading(pedId)), positionOffset));
			}
			freezePlayer = true;
			break;
		}

		case VRR_ANIMMOVE_BACK: {
			setElementCollisionsEnabled(pedId, false);
			if(ped.isSyncer) {
				setElementPosition(pedId, getPosBehindPos(getElementPosition(pedId), fixAngle(getElementHeading(pedId)), positionOffset));
			}
			freezePlayer = true;
			break;
		}

		case VRR_ANIMMOVE_LEFT: {
			setElementCollisionsEnabled(pedId, false);
			if(ped.isSyncer) {
				setElementPosition(pedId, getPosToLeftOfPos(getElementPosition(pedId), fixAngle(getElementHeading(pedId)), positionOffset));
			}
			freezePlayer = true;
			break;
		}

		case VRR_ANIMMOVE_RIGHT: {
			setElementCollisionsEnabled(pedId, false);
			if(ped.isSyncer) {
				setElementPosition(pedId, getPosToRightOfPos(getElementPosition(pedId), fixAngle(getElementHeading(pedId)), positionOffset));
			}
			freezePlayer = true;
			break;
		}

		default: {
			break;
		}
	}

	if(getGame() < VRR_GAME_GTA_IV) {
		if(animationData.animType == VRR_ANIMTYPE_NORMAL || animationData.animType == VRR_ANIMTYPE_SURRENDER) {
			if(getGame() == VRR_GAME_GTA_VC || getGame() == VRR_GAME_GTA_SA) {
				ped.clearAnimations();
			} else {
				ped.clearObjective();
			}
			ped.addAnimation(animationData.groupId, animationData.animId);

			if(ped == localPlayer && freezePlayer == true) {
				inAnimation = true;
				setLocalPlayerControlState(false, false);
				localPlayer.collisionsEnabled = false;
			}
		} else if(animationData.animType == VRR_ANIMTYPE_BLEND) {
			ped.position = ped.position;
			ped.blendAnimation(animationData.groupId, animationData.animId, animationData.animSpeed);
		}
	} else {
		natives.requestAnims(animationData.groupId);
		natives.taskPlayAnimNonInterruptable(ped, animationData.groupId, animationData.animId, animationData.animSpeed, boolToInt(animationData.infiniteLoop), boolToInt(animationData.infiniteLoopNoMovement), boolToInt(animationData.dontReturnToStartCoords), boolToInt(animationData.freezeLastFrame), -1);
	}
}

// ===========================================================================

function forcePedAnimation(pedId, animSlot) {
	let ped = getElementFromId(pedId);

	if(ped == null) {
		return false;
	}

	let animationData = getAnimationData(animSlot);

	if(getGame() < VRR_GAME_GTA_IV) {
		ped.position = ped.position;
		ped.addAnimation(animationData.groupId, animationData.animId);

		if(ped == localPlayer) {
			inAnimation = true;
			setLocalPlayerControlState(false, false);
			localPlayer.collisionsEnabled = false;
		}
	} else {
		natives.requestAnims(animationData.groupId);
		natives.taskPlayAnimNonInterruptable(ped, animationData.groupId, animationData.animId, animationData.animSpeed, boolToInt(animationData.infiniteLoop), boolToInt(animationData.infiniteLoopNoMovement), boolToInt(animationData.dontReturnToStartCoords), boolToInt(animationData.freezeLastFrame), -1);
	}
}

// ===========================================================================

function makePedStopAnimation(pedId) {
	let ped = getElementFromId(pedId);

	if(ped == null) {
		return false;
	}

	if(getGame() != VRR_GAME_GTA_IV) {
		if(getGame() == VRR_GAME_GTA_VC || getGame() == VRR_GAME_GTA_SA) {
			ped.clearAnimations();
		} else {
			ped.clearObjective();
		}
	}

	if(ped == localPlayer) {
		if(getGame() != VRR_GAME_GTA_IV) {
			localPlayer.collisionsEnabled = true;
		}
		setLocalPlayerControlState(true, false);
	}
}

// ===========================================================================

/**
 * @param {number} animationSlot - The slot index of the animation
 * @return {AnimationData} The animation's data (array)
 */
 function getAnimationData(animationSlot, gameId = getGame()) {
	return getGameConfig().animations[gameId][animationSlot];
}

// ===========================================================================