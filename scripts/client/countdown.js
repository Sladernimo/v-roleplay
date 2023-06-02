// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: countdown.js
// DESC: Provides countdown functions and usage
// TYPE: Client (JavaScript)
// ===========================================================================

let countDownFont = null;
let countDownFontSize = 100.0;
let countDownInterval = 2000;

let countDownTick = 4;
let countDownTimer = null;
let countDownEnabled = false;

// ===========================================================================

function initCountDownScript() {
	logToConsole(LOG_DEBUG, "[V.RP.CountDown]: Initializing countdown script ...");
	countDownFont = initCountDownFont();
	logToConsole(LOG_INFO, "[V.RP.CountDown]: Countdown script initialized!");
}

// ===========================================================================

function initCountDownFont() {
	let tempFont = null;
	let fontStream = openFile("aurora-bold-condensed.ttf");
	if (fontStream != null) {
		tempFont = lucasFont.createFont(fontStream, 100.0);
		fontStream.close();
	}

	return tempFont;
}

// ===========================================================================

function startCountDown() {
	countDownTick = 4;
	countDownEnabled = true;
	playCustomAudio("airhornCount", 0.5, false);
	countDownTimer = setInterval(function () {
		countDownTick = countDownTick - 1;
		if (countDownTick == 0) {
			countDownEnabled = false;
			clearInterval(countDownTimer);
		} else {
			if (countDownTick == 1) {
				playCustomAudio("airhornGo", 0.75, false);
			} else {
				playCustomAudio("airhornCount", 0.5, false);
			}
		}
	}, countDownInterval);
}

// ===========================================================================

function processCountdownRendering() {
	if (countDownFont == null) {
		return false;
	}

	if (!countDownEnabled) {
		return false;
	}

	let text = "";
	if (countDownTick == 1) {
		text = "GO!";
	} else {
		text = String(countDownTick - 1);
	}

	countDownFont.render(text, [0, (game.height / 2) - (countDownFontSize / 2)], game.width, 0.5, 0.0, countDownFont.size, toColour(237, 67, 55, 255), true, true, false, true);
}

// ===========================================================================