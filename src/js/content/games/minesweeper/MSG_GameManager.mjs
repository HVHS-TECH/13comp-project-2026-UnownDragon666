import MinesweeperBoard from "./gameElements/MGE_Board.mjs";
import MinesweeperRenderer from "./MSG_GameRenderer.mjs";

/**
 * @family MSG: MineSweeper Game (NOT TO BE CONFUSED WITH MONOSODIUM GLUTAMATE)
 * @description The game manager for mine sweeper, communicates between the renderer and the board.
 *
 * Written in Term Two of 2026 for programming/database assessment
 *
 * @author Idrees Munshi
 * @class
 */

export default class Minesweeper {
    /* **************************************** Private Fields *****************************************/
    #grid;
    #renderer;
    #board;
    #isFirstClick = true;
    #sizeX;
    #sizeY;
    #mineCount;

    /* **************************************** Public Fields *****************************************/

    /* **************************************** Constructor *****************************************/
    /**
     * Constuctor, initialises the board's reference
     *
     * @param {HTMLDivElement} _grid - The game board
     */
    constructor(_grid) {
        this.#grid = _grid;

        // Instantiate the renderer
        this.#renderer = new MinesweeperRenderer(this.#grid);
    }

    /* **************************************** Public Methods *****************************************/
    startGame(_settings) {
        this.#sizeX = _settings.sizeX;
        this.#sizeY = _settings.sizeY;
        this.#mineCount = _settings.minesCount;

        this.#board = new MinesweeperBoard(
            this.#sizeX,
            this.#sizeY,
            this.#mineCount,
        );

        this.#renderer.generateGrid(
            this.#board,
            this.#onReveal.bind(this),
            this.#onFlag.bind(this),
        );
    }

    /* **************************************** Private Methods *****************************************/
    #onReveal(_x, _y) {
        // Get the cell
        if (this.#isFirstClick) {
            this.#board.placeMines(_x, _y);
            // Start timer once I have that logic
            this.#isFirstClick = false;
        }
    }

    #onFlag() {}
}
