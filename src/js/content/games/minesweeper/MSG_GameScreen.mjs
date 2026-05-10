import Content from "../../CNT_Content.mjs";
import Minesweeper from "./MSG_GameManager.mjs";
/**
 * @family MSG: MineSweeper Game (NOT TO BE CONFUSED WITH MONOSODIUM GLUTAMATE)
 * @description Game screen for minesweeper
 *
 * Written in Term Two of 2026 for programming/database assessment
 *
 * @author Idrees
 * @class
 */

export default class MinesweeperGameScreen extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_minesweeper";
    #manager;
    #params;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (MineSweeper Gamescreen Stylesheet)
    styleID = "MSGS";
    static cellSize = 30;

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(MinesweeperGameScreen.#secID);
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    /**
     *
     * @param {Object} _params - Difficulty parameters
     */
    async buildContent(_params) {
        // UI Bar (Timer, exit, mine count)
        const UI_BAR = document.createElement("div");
        UI_BAR.id = "d_minesweeperUI";

        // Exit button
        const EXIT = super.createButton("Exit", "navigate", "Games");
        UI_BAR.appendChild(EXIT);

        // Make the grid!
        const GRID = document.createElement("div");
        GRID.id = "s_minesweeperGrid";

        GRID.style.display = "grid";
        GRID.style.gridTemplateColumns = `repeat(${_params.sizeX}, ${MinesweeperGameScreen.cellSize}px)`;
        GRID.style.gridTemplateRows = `repeat(${_params.sizeY}, ${MinesweeperGameScreen.cellSize}px)`;

        this.section.append(UI_BAR, GRID);

        // Instantiate the game manager and start the game
        this.#manager = new Minesweeper(GRID);
        this.#manager.startGame(_params);
    }
}
