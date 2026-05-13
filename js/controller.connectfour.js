"use strict";

/*******************************************************
 *     Connect Four - 100p
 *
 *     It's gaming time! The kids from Kindergarten would
 *     love to play some connect four! Unfortunately, kids
 *     nowadays can't use any wood or paper games anymore.
 *     It's digital or they go crazy. And we don't want crazy,
 *     do we?
 *
 *     Your task is to create a nice game of connect four.
 *     Make it an interesting >digital product< (I've heard
 *     you are an expert for that)! Make it visually appealing.
 *     Wrap it into a story. Choose or create two characters
 *     with rivalry to give your game more flesh. Try to
 *     match the appearance and/or the behavior of the game to
 *     the background-story (character arch).
 *
 *     Technical requirements:
 *     The game should be intuitive to play. It's a children's
 *     game after all. Think of a good way to handle your input.
 *
 *     The two players use the same input method and play in turns
 *     (= No need for separate input).
 *
 *     The game should give some hint or warning, when a player
 *     wants to put a stone on a file that is already full.
 *
 *     The game should give a clear visual representation of
 *     the winning stones and announce the winner.
 *
 *     Use MVC and custom Events. The model dispatches events for:
 *      - Player Change (view visually highlights current player)
 *      - Stone was inserted (view visually represents all the stones)
 *      - Game is over (Draw or Winner)
 *
 *     The creation of this game should take you somewhere between
 *     8-10 hours of concentrated work.
 *     IT TOOK MORE THAN 8-10
 *     Laila Tribere - 2026-04-29
 *******************************************************/


//TODO: Create your controller-object. When initiated, it should boot
//      the view (or views, if you decide to make a console-view).
import { MODEL } from "./model.connectfour.js";
import { VIEW } from "./view.polished.js";

export const CONTROLLER = { // object w init method
    init(){
        console.log("Connect Four");
        MODEL.initiateBattlefield(); // prepares 2d array
        VIEW.init(MODEL.cols, MODEL.rows); // draws a grid inside browser
        this.addEventListeners(); // user inp. is activated
    },

//TODO: Add EventListeners, to forward the user inputs to the model.
    addEventListeners() {
        // intro screen to transition from rules to character selection.
        const START_BTN = document.getElementById("start-btn");
        START_BTN.addEventListener("click", () => {
            VIEW.transitionToSelection();
        });

        // char screen, triggering the random char spin.
        const RANDOM_BTN = document.getElementById("random-btn");
        RANDOM_BTN.addEventListener("click", () => {
            this.handleRandomSelection();
        });

        // event delegation - game screen , responsive grid
        const GRID = document.getElementById("grid");
        GRID.addEventListener("click", (e) => {
            const SLOT = e.target.closest(".slot"); // finds the 'hole' that was clicked
            if (SLOT) {
                const COL_INDEX = parseInt(SLOT.dataset.col); // extr. the col nr
                MODEL.insertStone(COL_INDEX); // from model js - has to place a stone
            }
        });

        // game over , restar the game
        const RESTART_BTN = document.getElementById("restart-btn");
        RESTART_BTN.addEventListener("click", () => {
            location.reload(); // Simple browser refresh to reset all states.
        });
    },

    // custom char , spin animation
    handleRandomSelection() {
        const BTN = document.getElementById("random-btn");
        BTN.disabled = true; // lock btn to prevent loop

        let spins = 0;
        const INTERVAL = setInterval(() => {
            const RANDOM_ID = Math.floor(Math.random() * 10) + 1;
            VIEW.updateSelectionPreview(`assets/char${RANDOM_ID}.png`); // updates UI
            spins++;

            if (spins >= 12) { // spins 12 times and stops
                clearInterval(INTERVAL);
                this.finalizePlayerChoice(`assets/char${RANDOM_ID}.png`); // saves the random picked char
            }
        }, 100); // cycles
    },
    // async method - hero choice
    async finalizePlayerChoice(CHOSEN_ASSET) {
        const CURRENT = MODEL.currentPlayer; // access to model js to see which players turn is
        MODEL.players[CURRENT].character = CHOSEN_ASSET; // stores asset to data
        VIEW.updateSelectionPreview(CHOSEN_ASSET, true); // lets player see the char for 1.5 s
        await new Promise(res => setTimeout(res, 1500)); // allow kids to celebrate their pick

        if (CURRENT === "p1") {  // conditional - when player 1 ready move to pleya 2
            MODEL.changePlayer();
            VIEW.prepareForPlayerTwo();
            document.getElementById("random-btn").disabled = false; // Unlock for P2.
        } else {
            // Player 2 chosen -> Start countdown -> show board
            await VIEW.startCountdown();
            VIEW.transitionToBoard(MODEL.players.p1.character, MODEL.players.p2.character);
        }
    }
};
CONTROLLER.init();