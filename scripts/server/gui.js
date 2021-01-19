// ===========================================================================
// Asshat-Gaming Roleplay
// https://github.com/VortrexFTW/gtac_asshat_rp
// Copyright (c) 2021 Asshat-Gaming (https://asshatgaming.com)
// ---------------------------------------------------------------------------
// FILE: gui.js
// DESC: Provides GUI functions and usage
// TYPE: Server (JavaScript)
// ===========================================================================

// ---------------------------------------------------------------------------

function playerPromptAnswerNo(client) {
    if(getPlayerData(client).promptType == AG_PROMPT_NONE) {
        return false;
    }

    logToConsole(LOG_DEBUG, `[Asshat.GUI] ${getPlayerDisplayForConsole(client)} answered NO to their prompt (${getPlayerData(client).promptType})`);

    switch(getPlayerData(client).promptType) {
        case AG_PROMPT_CREATEFIRSTCHAR:
            showPlayerErrorGUI(client, "You don't have a character to play. Goodbye!", "No Characters")
            setTimeout(function() { client.disconnect(); }, 5000);
            break;

            case AG_PROMPT_BIZORDER:
                if(getPlayerData(client).businessOrderAmount > 0) {
                    if(canPlayerUseGUI(client)) {
                        showPlayerErrorGUI(client, "You canceled the order.", "Business Order Canceled");
                    } else {
                        logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} canceled the order of ${getPlayerData(client).businessOrderAmount} ${getPlayerData(client).businessOrderItem} at ${getPlayerData(client).businessOrderCost/getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness)}`);
                        messagePlayerError(client, "You canceled the order!");
                    }
                } else {
                    showPlayerErrorGUI(client, "You aren't ordering anything for a business!", "Business Order Canceled");
                }
                break;

        default:
            break;
    }

    getPlayerData(client).promptType = AG_PROMPT_NONE;
}

// ---------------------------------------------------------------------------

function playerPromptAnswerYes(client) {
    if(getPlayerData(client).promptType == AG_PROMPT_NONE) {
        return false;
    }

    logToConsole(LOG_DEBUG, `[Asshat.GUI] ${getPlayerDisplayForConsole(client)} answered YES to their prompt (${getPlayerData(client).promptType})`);

    switch(getPlayerData(client).promptType) {
        case AG_PROMPT_CREATEFIRSTCHAR:
            showPlayerNewCharacterGUI(client);
            break;

        case AG_PROMPT_BIZORDER:
            if(getPlayerData(client).businessOrderAmount > 0) {
                if(getPlayerData(client).businessOrderCost > getBusinessData(getPlayerData(client).businessOrderBusiness).till) {
                    logToConsole(LOG_DEBUG, `[Asshat.GUI] ${getPlayerDisplayForConsole(client)} failed to order ${getPlayerData(client).businessOrderAmount} ${getPlayerData(client).businessOrderItem} at ${getPlayerData(client).businessOrderCost/getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness)} (Reason: Not enough money in business till)`);
                    showPlayerErrorGUI(client, "This business doesn't have enough money! Deposit some using /bizdeposit", "Business Order Canceled");
                    getPlayerData(client).businessOrderAmount = 0;
                    getPlayerData(client).businessOrderBusiness = false;
                    getPlayerData(client).businessOrderItem = -1;
                } else {
                    logToConsole(LOG_DEBUG, `${getPlayerDisplayForConsole(client)} successfully ordered ${getPlayerData(client).businessOrderAmount} ${getPlayerData(client).businessOrderItem} at ${getPlayerData(client).businessOrderCost/getPlayerData(client).businessOrderAmount} each for business ${getBusinessData(getPlayerData(client).businessOrderBusiness)}`);
                    showPlayerInfoGUI(client, `[Asshat.GUI] You ordered ${getPlayerData(client).businessOrderAmount} ${getPlayerData(client).businessOrderItem} for ${getPlayerData(client).businessOrderCost}!`, "Business Order Successful");
                    getPlayerData(client).businessOrderAmount = 0;
                    getPlayerData(client).businessOrderBusiness = false;
                    getPlayerData(client).businessOrderItem = -1;
                }
            } else {
                showPlayerErrorGUI(client, `You aren't ordering anything for a business!`, `Business Order Canceled`);
            }
            break;

        default:
            break;
    }

    getPlayerData(client).promptType = AG_PROMPT_NONE;
}

// ---------------------------------------------------------------------------

function canPlayerUseGUI(client) {
    return (getServerConfig().useGUI && doesPlayerHaveGUIEnabled(client));
}

// ---------------------------------------------------------------------------