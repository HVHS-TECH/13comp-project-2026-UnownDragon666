import { getRecord } from "../accountManager/AM_User.mjs";

/**
 * @family CNT: Content
 * @description Admin is a class for the content of the Admin page
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Admin extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_admin";

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (ADmin Style Sheet)
    styleID = "ADSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Profile.#secID);
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        if (getRecord().isAdmin === false) {
        }

        // Create nav var
        const NAV = super.createNavBar();
        this.section.appendChild(NAV);

        // Create the player list
        this.#createPlayerList();
    }
    /* **************************************** Public Methods *****************************************/

    /* **************************************** Private Methods *****************************************/
    async #createPlayerList() {}
}
