/**
 * @family MGE: Minesweeper Game Elements
 * @description A component of the minesweeper game that contains a cell's state
 *
 * Written in Term Two of 2026 for programming/database assessment
 *
 * @author Idrees Munshi
 * @class
 */

export default class MinesweeperCell {
    /* **************************************** Private Fields *****************************************/
    #x;
    #y;
    #isMine = false;
    #isRevealed = false;
    #isFlagged = false;
    #adjacentMines = 0;

    /* **************************************** Constructor *****************************************/
    constructor(_x, _y) {
        this.#x = _x;
        this.#y = _y;
    }

    // Getters
    get x() {
        return this.#x;
    }
    get y() {
        return this.#y;
    }
    get isMine() {
        return this.#isMine;
    }
    get isRevealed() {
        return this.#isRevealed;
    }
    get isFlagged() {
        return this.#isFlagged;
    }
    get adjacentMines() {
        return this.#adjacentMines;
    }

    // Setters
    set adjacentMines(_n) {
        this.#adjacentMines = _n;
    }

    /* **************************************** Public Methods *****************************************/
    placeMine() {
        this.#isMine = true;
    }

    reveal() {
        this.#isRevealed = true;
    }

    toggleFlag() {
        this.#isFlagged = !this.#isFlagged;
    }
}
