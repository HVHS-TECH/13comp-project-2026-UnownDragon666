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

    // Create an "AbortController" to kill all the event listeners after the game ends
    #controller = new AbortController();

    /* **************************************** Public Fields *****************************************/
    /* **************************************** Constructor *****************************************/
    constructor(_grid) {
        this.#grid = _grid;
    }

    /* **************************************** Public Methods *****************************************/
    generateGrid(_board, _onReveal, _onFlag) {
        const X_LIMIT = _board.sizeX;
        const Y_LIMIT = _board.sizeY;
        const { signal } = this.#controller.signal;
        this.#cellElements = Array.from({ length: Y_LIMIT }, () => []); // Make array into a 2D array
        this.#grid.addEventListener("contextmenu", (e) => e.preventDefault());
        for (let y = 0; y < Y_LIMIT; y++) {
            for (let x = 0; x < X_LIMIT; x++) {
                this.#cellElements[y][x] = document.createElement("div");
                this.#cellElements[y][x].classList.add(
                    "inactiveMinesweeperCell",
                );
                this.#cellElements[y][x].id = `${x}_${y}`;

                this.renderCell(x, y, _board.getCell(x, y));

                this.#cellElements[y][x].addEventListener(
                    "mouseup",
                    (event) => {
                        event.button === 0 ? _onReveal(x, y) : null;
                        event.button === 2 ? _onFlag(x, y) : null;
                    },
                    { signal },
                );
                this.#grid.appendChild(this.#cellElements[y][x]);
            }
        }
    }

    renderCell(_x, _y, _cell) {
        // Find the relevant grid element and cell object, and render the cell based on the Cell object's data
        // Get the element from the grid:
        const CELL_ELEMENT = document.getElementById(`${_x}_${_y}`);
        const CELL_OBJ = _cell;

        // Check if the cell has been revealed
        if (CELL_OBJ.isRevealed) return;

        // Check if the cell has been flagged
        if (CELL_OBJ.isFlagged) return;

        // If cell is a mine, make it red.
        if (CELL_OBJ.isMine) {
            CELL_ELEMENT.classList.toggle("inactiveMinesweeperCell");
            CELL_ELEMENT.classList.add("clickedMineCell");
            document.dispatchEvent(new CustomEvent("gameLost", { detail: {} }));
            this.#controller.abort();
        }
    }
}
