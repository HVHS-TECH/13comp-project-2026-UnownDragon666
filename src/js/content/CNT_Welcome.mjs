/* 
    CNT_Welcome.mjs

    Welcome is a class for the content of the landing page

    Written in Term One 2026 for programming/database project
    By: Idrees Munshi
*/
import Content from "./CNT_Content.mjs";

export default class Welcome extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_landing";

    /* **************************************** Public Fields *****************************************/
    static welcomeConfig = null;

    /* **************************************** Constructor *****************************************/
    /**
     * constructor passes the secID (section ID) private field as a parameter
     * to its parent constuctor (using super())
     */
    constructor() {
        super(Welcome.#secID);
    }

    /* ******************************** Parent Class Method Overrides *********************************/

    removeContent() {
        document.getElementById(Welcome.#secID).remove();
    }

    buildContent() {
        // Page Title
        const TITLE = document.createElement("h1");
        TITLE.textContent = "Welcome to my project!";

        // Create container for buttons
        const BUTTON_CONTAINER = document.createElement("div");

        // Button to navigate to login screen
        const LOGIN_NAV = document.createElement("button");
        LOGIN_NAV.textContent = "Login";
        LOGIN_NAV.addEventListener("click", () => {
            // Creates a custom event called "navigate" telling the
            // Content Manager which Content to display next.
            const event = new CustomEvent("navigate", {
                detail: {
                    content: "Login",
                },
            });
            document.dispatchEvent(event);
        });
        // Append to parent div
        BUTTON_CONTAINER.appendChild(LOGIN_NAV);

        // Button to navigate to registration screen
        const REGISTER_NAV = super.createButton("Register", "Register");
        // Append to parent div
        BUTTON_CONTAINER.appendChild(REGISTER_NAV);

        this.section.append(TITLE, BUTTON_CONTAINER);
    }
}
