// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
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
	logToConsole(LOG_DEBUG, "[AGRP.Cursor]: Initializing cursor script ...");
	let cursorStream = openFile(cursorImagePath);
	if (cursorStream != null) {
		cursorImage = graphics.loadPNG(cursorStream);
		cursorStream.close();
	}

	logToConsole(LOG_INFO, "[AGRP.Cursor]: Cursor script initialized!");
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