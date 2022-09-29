// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: list.js
// DESC: Provides simple list GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let listDialog = {
	window: null,
	messageLabel: null,
	listGrid: null,

	listRows: [],
};

// ===========================================================================

function initListGUI() {
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Creating list dialog GUI ...`);
	listDialog.window = mexui.window(game.width / 2 - 200, game.height / 2 - 70, 400, 500, 'List', {
		main: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
		},
		title: {
			textSize: 11.0,
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
		},
		icon: {
			textSize: 11.0,
			textColour: toColour(255, 255, 255, 255),
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
			hover: {
				backgroundColour: toColour(205, 60, 60, windowTitleAlpha),
			},
		},
	});

	listDialog.messageLabel = infoDialog.window.text(5, 5, 390, 20, 'Select one', {
		main: {
			textSize: 10.0,
			textAlign: 0.5,
			textColour: toColour(255, 255, 255, 220),
			textFont: mainFont,
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	listDialog.listGrid = listDialog.window.grid(5, 25, 390, 450, {
		main: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
		},
		column: {
			lineColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
		},
		header: {
			backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha - 50),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], windowTitleAlpha),
		},
		cell: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
			textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], windowTitleAlpha),
		},
		row: {
			lineColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
			hover: {
				backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], 120),
			}
		}
	});
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Created list dialog GUI`);
}

// ===========================================================================

function showListGUI() {
	closeAllWindows();
	logToConsole(LOG_DEBUG, `[AGRP.GUI] Showing list window`);
	setChatWindowEnabled(false);
	mexui.setInput(true);
	listDialog.window.shown = true;
	guiSubmitKey = checkListDialogSelection;
	guiUpKey = selectPreviousListItem;
	guiDownKey = selectNextListItem;
}

// ===========================================================================

function checkListDialogSelection() {
	if (!listDialog.listGrid.activeRow) {
		return false;
	}

	sendNetworkEventToServer("agrp.list.select", listDialog.listGrid.activeRow.getEntryIndex());
}

// ===========================================================================

function selectPreviousListItem() {
	if (!listDialog.listGrid.activeRow) {
		return false;
	}

	let activeRowId = listDialog.listGrid.activeRow.getEntryIndex();
	if (activeRowId <= 1) {
		listDialog.listGrid.activeRow = 0;
	} else {
		listDialog.listGrid.activeRow = listDialog.listRows[activeRowId - 1];
	}

	//sendNetworkEventToServer("agrp.list.next", listDialog.listGrid.activeRow.getEntryIndex());
}

// ===========================================================================

function selectNextListItem() {
	let activeRowId = listDialog.listGrid.activeRow.getEntryIndex();
	if (activeRowId >= listDialog.listRows.length - 1) {
		listDialog.listGrid.activeRow = 0;
	} else {
		listDialog.listGrid.activeRow = listDialog.listRows[activeRowId + 1];
	}

	//sendNetworkEventToServer("agrp.list.next", listDialog.listGrid.activeRow.getEntryIndex());
}

// ===========================================================================

function clearListGUI() {
	listDialog.listGrid.removeAllEntries();
}

// ===========================================================================

function populateListGUI(listItems) {
	for (let i in listItems) {
		let row = listDialog.listGrid.row(listItems[i]);
		listDialog.listRows.push(row);
	}
}

// ===========================================================================