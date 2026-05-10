import Content from "../../CNT_Content.mjs";
/**
 * @family MSG: MineSweeper Game (NOT TO BE CONFUSED WITH MONOSODIUM GLUTAMATE)
 * @description The difficulty select page for minesweeper
 *
 * Written in Term Two of 2026 for programming/database assessment
 *
 * @author Idrees
 * @class
 */

export default class ChooseMinesweeperDifficulty extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_diffSelect";

    #selectedDiff = null;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (Minesweeper Difficulty Select Stylesheet)
    styleID = "MDSS";

    static DIFFICULTIES = [
        { id: "beginner", label: "Beginner", sizeX: 9, sizeY: 9, mines: 10 },
        {
            id: "intermediate",
            label: "Intermediate",
            sizeX: 16,
            sizeY: 16,
            mines: 40,
        },
        { id: "expert", label: "Expert", sizeX: 30, sizeY: 16, mines: 99 },
    ];

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(ChooseMinesweeperDifficulty.#secID);
    }

    /* ******************************** Parent Class Method Overrides *********************************/

    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        const NAV = super.createNavBar();
        this.section.appendChild(NAV);

        const MAIN_CONTAINER = document.createElement("section");
        MAIN_CONTAINER.id = "s_minesweeperMenu";

        // Difficulty select buttons
        const DIFF_SELECT_DIV = this.#createDifficultySelect();

        // Section for diff information
        const DIFF_INFO_SECTION = this.#createDiffInfoSection();

        MAIN_CONTAINER.append(DIFF_SELECT_DIV, DIFF_INFO_SECTION);
        this.section.appendChild(MAIN_CONTAINER);
    }

    /* **************************************** Private Methods *****************************************/
    #createDifficultySelect() {
        const DIV = document.createElement("div");
        DIV.id = "d_difficultyButtons";

        ChooseMinesweeperDifficulty.DIFFICULTIES.forEach((diff) => {
            const BUTTON = document.createElement("button");
            BUTTON.type = "button";
            BUTTON.id = `b_select${diff.label}`;
            BUTTON.textContent = diff.label;

            BUTTON.addEventListener("click", () => this.#displayDiffInfo(diff));
            DIV.append(BUTTON);
        });
        return DIV;
    }

    #displayDiffInfo(_diff) {
        this.#selectedDiff = _diff;

        const infoDiv = document.getElementById("d_diffInfo");
        const playButton = document.getElementById("b_playMinesweeper");

        // Clear and update the info text
        infoDiv.innerHTML = `
            <h3>${_diff.label}</h3>
            <p>Grid Size: ${_diff.sizeX} x ${_diff.sizeY}</p>
            <p>Mines: ${_diff.mines}</p>
        `;

        // Show the play button now that a choice is made
        playButton.style.display = "block";
        playButton.textContent = `Start ${_diff.label}`;
    }

    #createDiffInfoSection() {
        const SECTION = document.createElement("div");
        SECTION.id = "d_infoContainer";

        const INFO_DISPLAY = document.createElement("div");
        INFO_DISPLAY.id = "d_diffInfo";
        INFO_DISPLAY.innerHTML = "<p>Select a difficulty to see details</p>";

        const PLAY = document.createElement("button");
        PLAY.type = "button";
        PLAY.id = "b_playMinesweeper";
        PLAY.style.display = "none";

        PLAY.addEventListener("click", () => {
            if (this.#selectedDiff) {
                document.dispatchEvent(
                    new CustomEvent("navigate", {
                        detail: {
                            content: "MinesweeperGameScreen",
                            params: {
                                sizeX: this.#selectedDiff.sizeX,
                                sizeY: this.#selectedDiff.sizeY,
                                minesCount: this.#selectedDiff.mines,
                            },
                        },
                    }),
                );
            }
        });

        SECTION.append(INFO_DISPLAY, PLAY);
        return SECTION;
    }
}
