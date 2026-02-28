import Content from "./CNT_Content.mjs";

/**
 * @family CNT: Content
 * @description Register is a class for the content of the registration page
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Register extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_register";

    /* **************************************** Public Fields *****************************************/
    styleID = "RGSS";

    /* **************************************** Constructor *****************************************/
    /**
     * constructor passes the secID (section ID) private field as a parameter
     * to its parent constuctor (using super())
     */
    constructor() {
        super(Register.#secID);
    }

    /* ******************************** Parent Class Method Overrides *********************************/

    removeContent() {
        document.getElementById(Welcome.#secID).remove();
    }

    buildContent() {
        // Page Title
        const TITLE = document.createElement("h1");
        TITLE.textContent = "Registration Form";

        this.section.append(TITLE);
    }
}
