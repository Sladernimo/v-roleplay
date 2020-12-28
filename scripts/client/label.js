// ===========================================================================
// Asshat-Gaming Roleplay
// https://github.com/VortrexFTW/gtac_asshat_rp
// Copyright (c) 2020 Asshat-Gaming (https://asshatgaming.com)
// ---------------------------------------------------------------------------
// FILE: labels.js
// DESC: Provides functionality for world labels (3D labels)
// TYPE: Client (JavaScript)
// ===========================================================================

"use strict";

let businessLabels = [];
let houseLabels = [];
let jobLabels = [];

let propertyLabelNameFont = null;
let propertyLabelLockedFont = null;

let jobNameLabelFont = null;
let jobHelpLabelFont = null;

let unlockedColour = toColour(50, 205, 50, 255);
let lockedColour = toColour(205, 92, 92, 255);
let jobHelpColour = toColour(234, 198, 126, 255);

// ----------------------------------------------------------------------------

bindEventHandler("onResourceReady", thisResource, function(event, resource) {
    propertyLabelNameFont = lucasFont.createDefaultFont(16.0, "Roboto", "Regular");
    propertyLabelLockedFont = lucasFont.createDefaultFont(12.0, "Roboto", "Light");
});

// ----------------------------------------------------------------------------

class businessLabelData {
    constructor(labelId, position, height, name, locked, hidden) {
        this.labelId = labelId;
        this.position = position;
        this.height = height;
        this.name = name;
        this.locked = locked;
        this.hidden = hidden;
    }
}

// ----------------------------------------------------------------------------

class houseLabelData {
    constructor(labelId, position, height, name, locked, hidden) {
        this.labelId = labelId;
        this.position = position;
        this.height = height;
        this.name = name;
        this.locked = locked;
        this.hidden = hidden;
    }
}

// ----------------------------------------------------------------------------

class jobLabelData {
    constructor(labelId, position, height, name, tempJobType, hidden) {
        this.labelId = labelId;
        this.position = position;
        this.height = height;
        this.name = name;
        this.jobType = tempJobType;
        this.hidden = hidden;
    }
}


// ----------------------------------------------------------------------------

addEventHandler("OnDrawnHUD", function(event) {
	for(let i in businessLabels) {
		renderPropertyLabel(businessLabels[i], true);
    }
    
	for(let i in houseLabels) {
		renderPropertyLabel(houseLabels[i], false);
    }

	for(let i in jobLabels) {
		renderJobLabel(jobLabels[i]);
    }    
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.bizlabel.name", function(labelId, name) {
    getBusinessLabelData(labelId).name = name;
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.bizlabel.del", function(labelId) {
    for(let i in businessLabels) {
        if(businessLabels[i].labelId == labelId) {
            businessLabels.splice(i, 1);
        }
    }
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.bizlabel.locked", function(labelId, state) {
    getBusinessLabelData(labelId).locked = state;
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.bizlabel.add", function(labelId, position, height, name, locked, hidden) {
    businessLabels.push(new businessLabelData(labelId, position, height, name, locked, hidden));
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.bizlabel.all", function(tempBusinessLabels) {
    businessLabels = [];
    for(let i in tempBusinessLabels) {
        businessLabels.push(new businessLabelData(tempBusinessLabels[i][0], tempBusinessLabels[i][1], tempBusinessLabels[i][2], tempBusinessLabels[i][3], tempBusinessLabels[i][4], tempBusinessLabels[i][5]));
    }
    
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.joblabel.all", function(tempJobLabels) {
    jobLabels = [];
    for(let i in tempJobLabels) {
        jobLabels.push(new jobLabelData(tempJobLabels[i][0], tempJobLabels[i][1], tempJobLabels[i][2], tempJobLabels[i][3], tempJobLabels[i][4], tempJobLabels[i][5]));
    }
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.joblabel.add", function(labelId, position, height, name, locked, hidden) {
    jobLabels.push(new jobLabelData(labelId, position, height, name, locked, hidden));
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.joblabel.del", function(labelId) {
    for(let i in jobLabels) {
        if(jobLabels[i].labelId == labelId) {
            jobLabels.splice(i, 1);
        }
    }
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.joblabel.name", function(labelId, name) {
    getJobLabelData(labelId).name = name;
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.houselabel.add", function(labelId, position, height, name, locked, hidden) {
    houseLabels.push(new houseLabelData(labelId, position, height, name, locked, hidden));
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.houselabel.all", function(tempHouseLabels) {
    houseLabels = [];
    for(let i in tempHouseLabels) {
        houseLabels.push(new houseLabelData(tempHouseLabels[i][0], tempHouseLabels[i][1], tempHouseLabels[i][2], tempHouseLabels[i][3], tempHouseLabels[i][4], tempHouseLabels[i][5]));
    }
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.houselabel.name", function(labelId, name) {
    getHouseLabelData(labelId).name = name;
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.houselabel.del", function(labelId) {
    for(let i in houseLabels) {
        if(houseLabels[i].labelId == labelId) {
            houseLabels.splice(i, 1);
        }
    }
    return true;
});

// ----------------------------------------------------------------------------

addNetworkHandler("ag.houselabel.locked", function(labelId, state) {
    getHouseLabelData(labelId).locked = state;
    return true;
});

// ----------------------------------------------------------------------------

function getBusinessLabelData(labelId) {
    for(let i in businessLabels) {
        if(businessLabels[i].labelId == labelId) {
            return businessLabels[i];
        }
    }
}

// ----------------------------------------------------------------------------

function getHouseLabelData(labelId) {
    for(let i in houseLabels) {
        if(houseLabels[i].labelId == labelId) {
            return houseLabels[i];
        }
    }
}

// ----------------------------------------------------------------------------

function getJobLabelData(labelId) {
    for(let i in jobLabels) {
        if(jobLabels[i].labelId == labelId) {
            return jobLabels[i];
        }
    }
}

// ----------------------------------------------------------------------------

function renderPropertyLabel(labelData, isBusiness) {
    if(labelData.hidden) {
        return false;
    }

    if(localPlayer == null) {
        return false;
    }

	if(propertyLabelNameFont == null) {
		return false;
    }
    
	if(propertyLabelLockedFont == null) {
		return false;
	}
    
    if(localPlayer.position.distance(labelData.position) > 7.5) {
        return false;
    }

    let tempPosition = labelData.position;
    let screenPosition = getScreenFromWorldPosition(tempPosition);

    screenPosition.y -= labelData.height;

    let text = (labelData.locked) ? "LOCKED" : "UNLOCKED";
    if(isBusiness) {
        text = (labelData.locked) ? "CLOSED" : "OPEN";
    }
    let size = propertyLabelLockedFont.measure(text, game.width, 0.0, 0.0, propertyLabelLockedFont.size, true, true);
    propertyLabelLockedFont.render(text, [screenPosition.x-size[0]/2, screenPosition.y-size[1]/2], game.width, 0.0, 0.0, propertyLabelLockedFont.size, (labelData.locked) ? lockedColour : unlockedColour, false, true, false, true);       

    screenPosition.y -= 18;

    text = labelData.name;
    size = propertyLabelNameFont.measure(text, game.width, 0.0, 0.0, propertyLabelNameFont.size, true, true);
    propertyLabelNameFont.render(text, [screenPosition.x-size[0]/2, screenPosition.y-size[1]/2], game.width, 0.0, 0.0, propertyLabelNameFont.size, COLOUR_WHITE, false, true, false, true);       
}

// ----------------------------------------------------------------------------

function renderJobLabel(labelData) {
    if(labelData.hidden) {
        return false;
    }

    if(localPlayer == null) {
        return false;
    }

	if(jobLabelNameFont == null) {
		return false;
    }
    
	if(jobLabelLockedFont == null) {
		return false;
	}
    
    if(localPlayer.position.distance(labelData.position) > 7.5) {
        return false;
    }

    let tempPosition = labelData.position;
    let screenPosition = getScreenFromWorldPosition(tempPosition);

    screenPosition.y -= labelData.height;

    let text = (labelData.jobType == jobType) ? "Use /startwork to go on duty" : "Use /takejob to work for this job";
    let size = jobHelpLabelFont.measure(text, game.width, 0.0, 0.0, jobHelpLabelFont.size, true, true);
    jobHelpLabelFont.render(text, [screenPosition.x-size[0]/2, screenPosition.y-size[1]/2], game.width, 0.0, 0.0, jobHelpLabelFont.size, COLOUR_YELLOW, false, true, false, true);       

    screenPosition.y -= 18;

    text = labelData.name;
    size = jobNameLabelFont.measure(text, game.width, 0.0, 0.0, jobNameLabelFont.size, true, true);
    jobNameLabelFont.render(text, [screenPosition.x-size[0]/2, screenPosition.y-size[1]/2], game.width, 0.0, 0.0, jobNameLabelFont.size, COLOUR_WHITE, false, true, false, true);       
}

// ----------------------------------------------------------------------------