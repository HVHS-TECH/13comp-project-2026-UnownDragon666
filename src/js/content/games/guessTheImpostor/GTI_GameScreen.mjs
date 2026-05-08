import Content from "../../CNT_Content.mjs";
/**
 * @family GTI: Guess the Impostor, an extension of CNT: Content
 * @description Guess the impostor game's game screen.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */

export default class GuessTheImpostor extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_game";
    #lobbyPath;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (GSSS)
    styleID = "GSSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(GuessTheImpostor.#secID);
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        // Components: Chat, Players list (to vote), the question, impostor indicator, leave
    }
}
