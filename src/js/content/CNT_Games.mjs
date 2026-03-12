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
    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (GaMe Style Sheet)
    styleID = "GMSS";
}
