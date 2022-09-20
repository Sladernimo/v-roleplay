// ===========================================================================
// Asshat Gaming Roleplay
// https://github.com/VortrexFTW/agrp_main
// (c) 2022 Asshat Gaming
// ===========================================================================
// FILE: yesno.js
// DESC: Provides yes/no prompt dialog GUI
// TYPE: Client (JavaScript)
// ===========================================================================


let yesNoDialog = {
    window: null,
    messageLabel: null,
    yesButton: null,
    noButton: null,
};

// ===========================================================================

function initYesNoDialogGUI() {
    logToConsole(LOG_DEBUG, `[AGRP.GUI] Created prompt GUI ...`);
    yesNoDialog.window = mexui.window(game.width / 2 - 200, game.height / 2 - 70, 400, 140, 'Question', {
        main: {
            backgroundColour: toColour(secondaryColour[0], secondaryColour[1], secondaryColour[2], windowAlpha),
            transitionTime: 500,
        },
        title: {
            textSize: 11.0,
            textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
            backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], windowTitleAlpha),
        },
        icon: {
            textSize: 0.0,
            textColour: toColour(0, 0, 0, 0),
            backgroundColour: toColour(0, 0, 0, 0),
        },
    });

    yesNoDialog.messageLabel = yesNoDialog.window.text(15, 50, 370, 20, 'Would you like to answer this question?', {
        main: {
            textSize: 10.0,
            textAlign: 0.5,
            textColour: toColour(255, 255, 255, 255),
            textFont: mainFont,
        },
        focused: {
            borderColour: toColour(0, 0, 0, 0),
        },
    });

    yesNoDialog.yesButton = yesNoDialog.window.button(5, 105, 193, 30, 'YES', {
        main: {
            backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
            textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
            textSize: 10.0,
            textFont: mainFont,
            textAlign: 0.5,
        },
        focused: {
            borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], 255),
        },
    }, yesNoDialogAnswerYes);

    yesNoDialog.noButton = yesNoDialog.window.button(203, 105, 192, 30, 'NO', {
        main: {
            backgroundColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], buttonAlpha),
            textColour: toColour(primaryTextColour[0], primaryTextColour[1], primaryTextColour[2], 255),
            textSize: 10.0,
            textFont: mainFont,
            textAlign: 0.5,
        },
        focused: {
            borderColour: toColour(primaryColour[0], primaryColour[1], primaryColour[2], 255),
        },
    }, yesNoDialogAnswerNo);
    logToConsole(LOG_DEBUG, `[AGRP.GUI] Created prompt GUI`);
}

// ===========================================================================

function showYesNoPromptGUI(promptMessage, promptTitle, yesButtonText, noButtonText) {
    closeAllWindows();
    logToConsole(LOG_DEBUG, `[AGRP.GUI] Showing prompt window. Prompt: ${promptTitle} - ${promptMessage}`);
    mexui.setInput(true);

    yesNoDialog.messageLabel.text = "";
    yesNoDialog.yesButton.text = "";
    yesNoDialog.noButton.text = "";
    yesNoDialog.window.title = "";

    yesNoDialog.messageLabel.text = promptMessage;
    yesNoDialog.yesButton.text = yesButtonText;
    yesNoDialog.noButton.text = noButtonText;
    yesNoDialog.window.title = promptTitle;

    yesNoDialog.window.shown = true;
}

// ===========================================================================

function yesNoDialogAnswerNo() {
    logToConsole(LOG_DEBUG, `[AGRP.GUI] Responding with answer NO to server prompt`);
    sendNetworkEventToServer("agrp.promptAnswerNo");
    closeAllWindows();
}

// ===========================================================================

function yesNoDialogAnswerYes() {
    logToConsole(LOG_DEBUG, `[AGRP.GUI] Responding with answer YES to server prompt`);
    sendNetworkEventToServer("agrp.promptAnswerYes");
    closeAllWindows();
}

// ===========================================================================