import Content from "./CNT_Content.mjs";
/**
 * @family CNT: Content
 * @description Profile is a class for the content of the profile page
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Profile extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_profile";

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (ProFile Style Sheet)
    styleID = "PFSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Profile.#secID);
    }
}
