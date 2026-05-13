"use strict";

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

export const VIEW = {
    init(COLS, ROWS) {
        const GRID = document.getElementById("grid");
        GRID.innerHTML = ""; // clears the content before building the grid

        for (let r = ROWS - 1; r >= 0; r--) { // loops for grid holes, from down
            for (let c = 0; c < COLS; c++) {
                const SLOT = document.createElement("div");
                SLOT.classList.add("slot");
                SLOT.dataset.row = r;
                SLOT.dataset.col = c;
                GRID.appendChild(SLOT);
            }
        }

        this.addModelEventListeners();
    },

    addModelEventListeners() {
        document.addEventListener("cf:playerChanged", (e) => this.highlightPlayer(e.detail.currentPlayer));
        document.addEventListener("cf:stoneInserted", (e) => this.drawStone(e.detail.col, e.detail.row, e.detail.coin));
        document.addEventListener("cf:gameOver", (e) => this.handleGameOver(e.detail));
    },

    // screen transitions intro -> char -> game
    transitionToSelection() {
        document.getElementById("introduction").classList.add("hidden");
        document.getElementById("character-selection").classList.remove("hidden");
    },

    updateSelectionPreview(CHAR_ASSET, isFinal = false) {
        const IMG = document.getElementById("select-img");
        IMG.src = CHAR_ASSET;
        if (isFinal) {
            IMG.classList.remove("shadow-mode");
            document.querySelector(".mark").classList.add("hidden");
        }
    },

    prepareForPlayerTwo() { // same for player 2 character selection
        document.getElementById("char-name").textContent = "Player 2: Pick your Hero";
        const IMG = document.getElementById("select-img");
        IMG.classList.add("shadow-mode");
        document.querySelector(".mark").classList.remove("hidden");
    },

    // pretty transition with timer
    async startCountdown() {
        document.getElementById("character-selection").classList.add("hidden");
        const OVERLAY = document.getElementById("countdown-overlay");
        const NUMBER = document.getElementById("countdown-number");
        OVERLAY.classList.remove("hidden");

        for (let i = 3; i > 0; i--) {
            NUMBER.textContent = i;
            await new Promise(res => setTimeout(res, 1000));
        }
        OVERLAY.classList.add("hidden");
    },

    transitionToBoard(P1_CHAR, P2_CHAR) { // highlighted char
        document.getElementById("game-board").classList.remove("hidden");
        document.getElementById("p1-reveald-char").src = P1_CHAR;
        document.getElementById("p2-reveald-char").src = P2_CHAR;
        this.highlightPlayer("p1");
    },

//TODO: Show the current player

    highlightPlayer(KEY) {
        // player 1-blue glow, active, player 2 - red,active
        document.getElementById("player-1-side").classList.toggle("p1-active", KEY === "p1");
        document.getElementById("player-2-side").classList.toggle("p2-active", KEY === "p2");
        document.getElementById("status").textContent = (KEY === "p1" ? "Player 1" : "Player 2") + "'s Turn!";
    },

//TODO: Update the field. Show the whole battlefield with all the stones
//      that are already played.

    // smooth transition of falling coins inside the grid lines
    drawStone(COL, ROW, COIN_ASSET) {
        const SLOT = document.querySelector(`.slot[data-col="${COL}"][data-row="${ROW}"]`);
        if (SLOT) {
            const COIN = document.createElement("img");
            COIN.src = COIN_ASSET;
            COIN.classList.add("coin");
            SLOT.appendChild(COIN);
        }
    },

//TODO: Notify the player when the game is over. Make it clear how the
//      Game ended. If it's a win, show the winning stones.

    handleGameOver(DATA) {
        const STATUS = document.getElementById("status");

        if (DATA.result === "winner") {
            const WINNER_NAME = (DATA.winner === "p1") ? "Player 1" : "Player 2";
            STATUS.textContent = WINNER_NAME + " Wins!";

            // coin swapping
            DATA.winningStones.forEach(coord => {
                const SLOT = document.querySelector(`.slot[data-col="${coord.c}"][data-row="${coord.r}"]`);
                const COIN_IMG = SLOT.querySelector(".coin");
                if (COIN_IMG) {
                    COIN_IMG.src = DATA.winnerCoin; // swaps to assets/winner-coin.png.
                }
            });
        } else {
            STATUS.textContent = "It's a Draw!";
        }

        document.getElementById("restart-btn").classList.remove("hidden"); // when game ends, reset btn reveal
    }
};