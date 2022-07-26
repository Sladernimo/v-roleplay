// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: crime.js
// DESC: Provides crime data structures, functions, and operations
// TYPE: Server (JavaScript)
// ===========================================================================

/**
 * @class Representing a crime's data. Loaded and saved in the database
 */
 class CrimeData {
	constructor(suspectId, crimeType, reporterId = 0) {
		this.crimeType = crimeType;
		this.suspectId = suspectId;
		this.reporterId = reporterId;
		this.whenCommitted = 0;
		this.whenReported = 0;
		this.databaseId = 0;
	}
};