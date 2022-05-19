// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: database.js
// DESC: Provides database handling, functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// ===========================================================================

let persistentDatabaseConnection = null;

// ===========================================================================

function initDatabaseScript() {
	logToConsole(LOG_INFO, "[VRR.Database]: Initializing database script ...");
	logToConsole(LOG_INFO, "[VRR.Database]: Database script initialized successfully!");
}

// ===========================================================================

function createDatabaseInsertQuery(tableName, data) {
	let fields = [];
	let values = [];

	for(let i in data) {
		if(data[i][1] != "undefined" && data[i][1] != NaN && data[i][0] != 'NaN') {
			if(data[i][1] != "undefined" && data[i][1] != NaN && data[i][1] != 'NaN') {
				fields.push(data[i][0]);

				if(typeof data[i][1] == "string") {
					if(data[i][1] == "{UNIXTIMESTAMP}") {
						values.push("UNIX_TIMESTAMP()");
					} else {
						values.push(`'${data[i][1]}'`);
					}
				} else {
					values.push(data[i][1]);
				}
			}
		}
	}

	let queryString = `INSERT INTO ${tableName} (${fields.join(", ")}) VALUES (${values.join(", ")})`;
	return queryString;
}

// ===========================================================================

function createDatabaseUpdateQuery(tableName, data, whereClause) {
	let values = [];

	for(let i in data) {
		if(data[i][0] != "undefined" && data[i][0] != NaN && data[i][0] != 'NaN') {
			if(data[i][1] != "undefined" && data[i][1] != NaN && data[i][1] != 'NaN') {
				if(typeof data[i][1] == "string") {
					if(data[i][1] == "{UNIXTIMESTAMP}") {
						values.push(`${data[i][0]}=UNIX_TIMESTAMP()`);
					} else {
						values.push(`${data[i][0]}='${data[i][1]}'`);
					}
				} else {
					values.push(`${data[i][0]}=${data[i][1]}`);
				}
			}
		}
	}

	let queryString = `UPDATE ${tableName} SET ${values.join(", ")} WHERE ${whereClause}`;
	return queryString;
}

// ===========================================================================