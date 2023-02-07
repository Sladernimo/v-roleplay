// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: cursor.js
// DESC: Provides cursor functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let cursorImage = null;
let cursorImagePath = "files/images/cursor.png";
let cursorSize = toVector2(16.0, 24.0);

// ===========================================================================

function initCursorScript() {
	logToConsole(LOG_DEBUG, "[V.RP.Cursor]: Initializing cursor script ...");
	let cursorStream = openFile(cursorImagePath);
	if (cursorStream != null) {
		cursorImage = graphics.loadPNG(cursorStream);
		cursorStream.close();
	}

	logToConsole(LOG_INFO, "[V.RP.Cursor]: Cursor script initialized!");
}

// ===========================================================================

function processMouseCursorRendering() {
	if (isGameFeatureSupported("mouseCursor")) {
		return false;
	}

	if (gui.cursorEnabled) {
		graphics.drawRectangle(cursorImage, gui.cursorPosition, cursorSize);
	}
}

// ===========================================================================