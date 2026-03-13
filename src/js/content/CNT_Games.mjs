import Content from "./CNT_Content.mjs";
/**
 * @family CNT: Content
 * @description Games is a class for the content of the page which displays all the games
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Games extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_games";

    #cards;
    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (GaMe Style Sheet)
    styleID = "GMSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Games.#secID);
    }

    /* **************************************** Public Methods *****************************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        // Create nav var
        const NAV = super.createNavBar();
        this.section.appendChild(NAV);
    }
}
