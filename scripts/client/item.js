// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: item.js
// DESC: Provides item action and hotbar functions
// TYPE: Client (JavaScript)
// ===========================================================================

let itemActionDelayDuration = 0;
let itemActionDelayStart = 0;
let itemActionDelayEnabled = false;
let itemActionDelayPosition = toVector2(game.width/2-100, game.height-10);
let itemActionDelaySize = toVector2(200, 5);

// ===========================================================================

function initItemScript() {
	logToConsole(LOG_DEBUG, "[VRR.Item]: Initializing item script ...");
	logToConsole(LOG_DEBUG, "[VRR.Item]: Item script initialized!");
}

// ===========================================================================

function processItemActionRendering() {
	if(renderItemActionDelay) {
		if(itemActionDelayEnabled) {
			let finishTime = itemActionDelayStart+itemActionDelayDuration;
			if(sdl.ticks >= finishTime) {
				itemActionDelayEnabled = false;
				itemActionDelayDuration = 0;
				itemActionDelayStart = 0;
				tellServerItemActionDelayComplete();
			} else {
				let currentTick = sdl.ticks-itemActionDelayStart;
				let progressPercent = Math.ceil(currentTick*100/itemActionDelayDuration);
				let width = Math.ceil(getPercentage(itemActionDelaySize.x, progressPercent));

				let backgroundColour = toColour(0, 0, 0, 255);
				graphics.drawRectangle(null, [itemActionDelayPosition.x-(itemActionDelaySize.x/2)-1, itemActionDelayPosition.y-(itemActionDelaySize.y/2)-1], [itemActionDelaySize.x+2, itemActionDelaySize.y+2], backgroundColour, backgroundColour, backgroundColour, backgroundColour);
				graphics.drawRectangle(null, [itemActionDelayPosition.x-(itemActionDelaySize.x/2), itemActionDelayPosition.y-(itemActionDelaySize.y/2)-2], [width, itemActionDelaySize.y], COLOUR_LIME, COLOUR_LIME, COLOUR_LIME, COLOUR_LIME);
			}
		}
	}
}

// ===========================================================================

function updatePlayerHotBar(activeSlot, itemsArray) {
	logToConsole(LOG_DEBUG, `[VRR.Main] Updating hotbar`);
}

// ===========================================================================

function showItemActionDelay(duration) {
	itemActionDelayDuration = duration;
	itemActionDelayStart = sdl.ticks;
	itemActionDelayEnabled = true;
	logToConsole(LOG_DEBUG, `Item action delay started. Duration: ${itemActionDelayDuration}, Start: ${itemActionDelayStart}, Rendering Enabled: ${renderItemActionDelay}`);
}

// ===========================================================================