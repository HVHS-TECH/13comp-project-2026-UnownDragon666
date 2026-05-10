import MinesweeperCell from "./MGE_Cell.mjs";
/**
 * @family MGE: Minesweeper Game Elements
 * @description A component of the minesweeper game that contains the board state
 *
 * Written in Term Two of 2026 for programming/database assessment
 *
 * @author Idrees Munshi
 * @class
 */

export default class MinesweeperBoard {
    /* **************************************** Private Fields *****************************************/
    #cells = []; // 2D Array of cells i.e. #cells[x][y]
    #sizeX;
    #sizeY;
    #mineCount;

    /* **************************************** Constructor *****************************************/
    constructor(_sizeX, _sizeY, _minesCount) {
        this.#sizeX = _sizeX;
        this.#sizeY = _sizeY;
        this.#mineCount = _minesCount;
        this.#buildGrid();
    }

    // Getters
    get sizeX() {
        return this.#sizeX;
    }
    get sizeY() {
        return this.#sizeY;
    }
    get cells() {
        return this.#cells;
    }
    getCell(_x, _y) {
        return this.#cells[_y][_x];
    }

    /* **************************************** Private Methods *****************************************/
    #buildGrid() {
        this.#cells = Array.from({ length: this.#sizeY }, () => []);
        for (let y = 0; y < this.#sizeY; y++) {
            for (let x = 0; x < this.#sizeX; x++) {
                this.#cells[y][x] = new MinesweeperCell(x, y);
            }
        }
    }

    #calculateAdjacency() {}

    #getNeighbours(_x, _y) {}

    /* **************************************** Public Methods *****************************************/
    placeMines(_avoidX, _avoidY) {}

    reveal(_x, _y) {
        // Flood fill logic
    }

    toggleFlag(_x, _y) {}
}
