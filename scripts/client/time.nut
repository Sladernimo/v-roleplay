function getCurrentUnixTimeStampSquirrel() {
	return time();
}

function getTimeStampOutput(timeStamp) {
	local dateObj = date(timeStamp);
	return dateObj.hour + ":" + dateObj.minute + ":" + dateObj.second;
}