/* 
    CNT_Welcome.mjs

    Welcome is a class for the content of the landing page

    Written in Term One 2026 for programming/database project
    By: Idrees Munshi
*/
import Content from "./CNT_Content.mjs";

export default class Welcome extends Content {
    /* Private Fields */
    static #secID = "s_landing";

    /* Public Fields */

    /*
        constructor passes the secID (section ID) private field as a parameter 
        to its parent constuctor (using super())
    */
    constructor() {
        super(Welcome.#secID);
    }

    /* Parent Class Method Overrides */
    removeContent() {
        document.getElementById(Welcome.#secID).remove();
    }

    /*
        buildContent()

        This method is essentially a "blueprint" of the page
        It will build up the content of the page so that ContentManager
        can append the content to the DOM. This prevents the pages from directly 
        interacting with the DOM or injecting HTML and should hopefully make it 
        easier in the future to make more complex pages. I hope. 

        Inputs:
        N/A
        Outputs:
        N/A
    */
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
        const REGISTER_NAV = document.createElement("button");
        REGISTER_NAV.textContent = "Register";
        REGISTER_NAV.addEventListener("clcik", () => {
            // Same as above, custom "navigate" event
            // Except, this time, naviagte content is "Register"
            const event = new CustomEvent("navigate", {
                detail: {
                    content: "Register",
                },
            });
            document.dispatchEvent(event);
        });
        // Append to parent div
        BUTTON_CONTAINER.appendChild(REGISTER_NAV);

        this.section.append(TITLE, BUTTON_CONTAINER);
    }
}
