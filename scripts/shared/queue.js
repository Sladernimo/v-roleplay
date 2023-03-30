// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/v-roleplay
// ===========================================================================
// FILE: queue.js
// DESC: Provides simple queue functions
// TYPE: Shared (JavaScript)
// ===========================================================================

class Queue {
	constructor(maxSimultaneously = 1) {
		this.maxSimultaneously = maxSimultaneously;
		this.__active = 0;
		this.__queue = [];
	}

	/** @param { () => Promise<T> } func
	 * @template T
	 * @returns {Promise<T>}
	*/
	async enqueue(func) {
		if (++this.__active > this.maxSimultaneously) {
			await new Promise(resolve => this.__queue.push(resolve));
		}

		try {
			return await func();
		} catch (err) {
			throw err;
		} finally {
			this.__active--;
			if (this.__queue.length) {
				this.__queue.shift()();
			}
		}
	}
}

// ===========================================================================

function delayedFunction(func, duration) {
	setTimeout(function () {
		func();
	}, duration);
}

// ===========================================================================