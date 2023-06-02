// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: vehcolour.js
// DESC: Provides vehicle colour picker GUI
// TYPE: Client (JavaScript)
// ===========================================================================

let vehicleColourPicker = {
	window: null,
	grid: null,
	colours: [],
};

let selectedVehicleColourIndex = 0;

// ===========================================================================

function initVehicleColourPickerGUI() {
	// Create MexUI window with rows and 10 columns, each 32px wide and 32px tall, with a 5px gap between each
	vehicleColourPicker.window = mexui.window(getScreenWidth() / 2 - 150, getScreenHeight() / 2 - 135, 300, 275, 'VEHICLE COLOUR PICKER', {
		main: {
			backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
		},
		title: {
			textSize: 0.0,
			textColour: toColour(0, 0, 0, 0),
		},
		icon: {
			textSize: 0.0,
			textColour: toColour(0, 0, 0, 0),
		},
		focused: {
			borderColour: toColour(0, 0, 0, 0),
		},
	});

	for (let i in gameData.vehicleColours[getGame()]) {
		// Create a row for every 10 colours
		if (i % 20 == 0) {
			let backgroundColour = toColour(0, 0, 0, 0);
			if (typeof gameData.vehicleColours[getGame()][i][0] == "string") {
				let rgb = hexToRgb(gameData.vehicleColours[getGame()][i][0]);
				backgroundColour = toColour(rgb[0], rgb[1], rgb[2], 255);
			} else {
				backgroundColour = toColour(gameData.vehicleColours[getGame()][i][0][0], gameData.vehicleColours[getGame()][i][0][1], gameData.vehicleColours[getGame()][i][0][2], 255);
			}

			let textColour = toColour(0, 0, 0, 0);
			if (typeof gameData.vehicleColours[getGame()][i][1] == "string") {
				let rgb = hexToRgb(gameData.vehicleColours[getGame()][i][1]);
				textColour = toColour(rgb[0], rgb[1], rgb[2], 255);
			} else {
				textColour = toColour(gameData.vehicleColours[getGame()][i][1][0], gameData.vehicleColours[getGame()][i][1][1], gameData.vehicleColours[getGame()][i][1][2], 255);
			}

			let tempButton = mexui.button(0, 0, 32, 32, toString(gameData.vehicleColours[getGame()][i][2]), {
				main: {
					backgroundColour: backgroundColour,
					textColour: textColour,
				}
			}, function () {
				selectVehicleColour(i);
			});

			vehicleColourPicker.colours.push(tempButton);
		}
	}
}

// ===========================================================================

function selectVehicleColour(colourIndex) {
	return true;
}

// ===========================================================================

function previousVehicleColour() {
	if (selectedVehicleColourIndex <= 0) {
		selectedVehicleColourIndex = vehicleColourPickers.colours.length - 1;
	} else {
		selectedVehicleColourIndex = selectedVehicleColourIndex - 1;
	}
	return true;
}

// ===========================================================================

function nextVehicleColour() {
	if (selectedVehicleColourIndex >= vehicleColourPickers.colours.length - 1) {
		selectedVehicleColourIndex = vehicleColourPickers.colours.length + 1;
	} else {
		selectedVehicleColourIndex = 0;
	}
	return true;
}

// ===========================================================================

function upVehicleColour() {
	// Needs finished
	return true;
}

// ===========================================================================

function downVehicleColour() {
	// Needs finished
	return true;
}

// ===========================================================================

function showVehicleColourPickerGUI() {
	logToConsole(LOG_DEBUG, `[V.RP.GUI] Showing vehicle colour picker window`);
	closeAllWindows();
	setChatWindowEnabled(false);
	mexui.setInput(true);
	vehicleColourPicker.window.shown = true;
	guiLeftKey = previousVehicleColour;
	guiRightKey = nextVehicleColour;
	guiUpKey = upVehicleColour;
	guiDownKey = downVehicleColour;
	guiSubmitKey = selectVehicleColour;
}

// ===========================================================================