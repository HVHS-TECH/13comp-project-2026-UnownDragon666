/**
 * @family MSG: MineSweeper Game (NOT TO BE CONFUSED WITH MONOSODIUM GLUTAMATE)
 * @description Renderer for minesweeper game
 *
 * Written in Term Two of 2026 for programming/database assessment
 *
 * @author Idrees
 * @class
 */

export default class MinesweeperRenderer {
    /* **************************************** Private Fields *****************************************/
    #grid;
    #cellElements;

    /* **************************************** Public Fields *****************************************/
    /* **************************************** Constructor *****************************************/
    constructor(_grid) {
        this.#grid = _grid;
    }

    /* **************************************** Public Methods *****************************************/
    generateGrid(_board, _onReveal, _onFlag) {
        const X_LIMIT = _board.sizeX;
        const Y_LIMIT = _board.sizeY;
        this.#cellElements = Array.from({ length: Y_LIMIT }, () => []); // Make array into a 2D array

        for (let y = 0; y < Y_LIMIT; y++) {
            for (let x = 0; x < X_LIMIT; x++) {
                this.#cellElements[y][x] = document.createElement("div");
                this.#grid.addEventListener("contextmenu", (e) =>
                    e.preventDefault(),
                );
                this.#cellElements[y][x].addEventListener(
                    "mouseup",
                    (event) => {
                        event.button === 0 ? _onReveal(x, y) : null;
                        event.button === 2 ? _onFlag(x, y) : null;
                    },
                );
                this.#grid.appendChild(this.#cellElements[y][x]);
            }
        }
    }

    renderCell() {}
}
