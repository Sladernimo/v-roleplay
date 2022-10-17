// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: inventorybulk.js
// DESC: Provides bulk inventory box GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let inventoryBulkGUI = [
	{
		window: null,
	},
	{
		window: null,
	},
];

// ===========================================================================

function initInventoryBulkGUI() {

}

// ===========================================================================

function closeAllInventoryBulkGUI() {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Closing all bulk inventory GUI`);
	for (let i in inventoryBulkGUI) {
		inventoryBulkGUI[i].window.shown = false;
	}
	mexui.setInput(false);
}

// ===========================================================================

function showInventoryBulkGUI(inventoryIndex, items) {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Showing bulk inventory window. Index: ${inventoryIndex}`);
	inventoryBulkGUI[inventoryIndex].window.shown = true;
	mexui.setInput(true);
}

// ===========================================================================