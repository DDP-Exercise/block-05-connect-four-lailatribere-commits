"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is necessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

export const MODEL = {
    players: { // these are "objects"
        p1: {character: null, coin: "assets/p2-coin.png"},// blue coin
        p2: {character: null, coin: "assets/p1-coin.png"}, // red
    },

    currentPlayer: "p1",
    battlefield: [], // 2d array board
    rows: 6,
    cols: 7,
    gameOver: false,
    winner: null,
    winningStones: [], // to win, this stores the placement of coins (connect 4)

    initiateBattlefield() {
        // Creates a 2D array: 7 columns, each starting as an empty array
        this.battlefield = Array.from({ length: this.cols }, () => []);
        this.gameOver = false;
        this.winner = null;
        this.winningStones = [];
    },

//TODO: Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.

    dispatchStoneInserted(COL, ROW) {
        document.dispatchEvent(new CustomEvent("cf:stoneInserted", {
            detail: {
                col: COL,
                row: ROW,
                coin: this.players[this.currentPlayer].coin
            }
        }));
    },

    dispatchGameOver(TYPE) {
        document.dispatchEvent(new CustomEvent("cf:gameOver", {
            detail: {
                result: TYPE,
                winner: this.winner,
                winningStones: this.winningStones,
                winnerCoin: "assets/winner-coin.png" // golden coin
            }
        }));
    },

//TODO: Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.


//TODO: The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.

    insertStone(COL_INDEX) {
        // check if the column is full to stop
        if (this.gameOver || this.battlefield[COL_INDEX].length >= this.rows) {
            console.warn("Hint: This column is already full!"); // gives a hint for player
            return;
        }

        //determing row based on current column height
        const ROW_INDEX = this.battlefield[COL_INDEX].length;
        this.battlefield[COL_INDEX].push(this.currentPlayer); // updates data, pushing players key
        this.dispatchStoneInserted(COL_INDEX, ROW_INDEX); // goes to view to insert the coin

        // status check
        if (this.checkWin(COL_INDEX, ROW_INDEX)) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            this.dispatchGameOver("winner");
        } else if (this.checkDraw()){
            this.gameOver = true;
            this.dispatchGameOver("draw");
        } else {
            this.changePlayer(); // loop continues if there is no win yet
        }
    },

//TODO: Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happened. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

    checkWin(COL, ROW) {
        const DIRECTIONS = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1]
        ];
        for (const [DX,DY] of DIRECTIONS) { // dx vertical, dy horizontal
            let count = 1;
            let stones = [{ c: COL, r: ROW }]; // stone is in place

            for (let dir of [1, -1]) { // checks forward 1 and backward -1
                let nextCol = COL + (DX * dir);
                let nextRow = ROW + (DY * dir);

                while (
                    nextCol >= 0 && nextCol < this.cols &&
                    nextRow >= 0 && nextRow < this.rows &&
                    this.battlefield[nextCol][nextRow] === this.currentPlayer
                    ){
                    count++;
                    stones.push({ c: nextCol, r: nextRow });

                    // finnaly when 4 are in line, save and return true
                    if (count >=4 ){
                        this.winningStones = stones; // golden coins
                        return true;
                    }

                    nextCol += (DX * dir);
                    nextRow += (DY * dir);
                }
            }
        }
        return false;
    },

    checkDraw() {
        return this.battlefield.every(col  => col.length === this. rows);
    },

//TODO: Method to change the current player (and dispatch the according event).

    changePlayer(){
        this.currentPlayer = (this.currentPlayer === "p1") ? "p2" : "p1";
        document.dispatchEvent(new CustomEvent("cf:playerChanged", {
            detail: { currentPlayer: this.currentPlayer }
        }));
    }
};