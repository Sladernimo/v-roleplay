// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: queue.js
// DESC: Provides simple queue functions
// TYPE: Shared (JavaScript)
// ===========================================================================

class QueueData {
	constructor(func, duration) {
		this.duration = duration;
		this.func = func;
		this.nextUp = null;

		if (this.nextUp != null) {
			if (duration <= 0) {
				this.nextUp.func();
			} else {
				delayedFunction(this.nextUp.func, this.duration);
			}
		}
	}

	next(func, duration) {
		this.nextUp = createQueue(func, duration);
	}
}

// ===========================================================================

function createQueue(func, duration) {
	return new QueueData(func, duration);
}

// ===========================================================================

function delayedFunction(func, duration) {
	setTimeout(function () {
		func();
	}, duration);
}

// ===========================================================================