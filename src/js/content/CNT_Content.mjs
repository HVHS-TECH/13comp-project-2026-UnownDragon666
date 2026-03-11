import { firebaseIO } from "../firebase/FB_instance.mjs";
import { getRecord } from "../accountManager/AM_User.mjs";

/**
 * @family CNT: Content
 * @description Content is an "abstract" class designed to be inherited by all CNT Classes
 * as a way to reduce redundancy in the code and make the system more fluid and expandable
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Content {
    /* **************************************** Private Fields *****************************************/

    /* **************************************** Public Fields *****************************************/
    section;

    /* **************************************** Constructor *****************************************/
    /**
     * Constructor inherited as super constructor for all content classes
     *
     * Creates a section element to store the contents of the page, assigns
     * the section an ID based on a parameter passed by the child, used when
     * the content is removed as an easy way to kill the content.
     *
     * @param {string} _secID - ID to assign section element
     */
    constructor(_secID) {
        this.section = document.createElement("section");
        this.section.id = _secID;
    }

    /* **************************************** Abstract Methods *****************************************/

    /**
     * This method takes the #secID of a CNT class that extends Content
     * and removes the section element to make space for a different
     * page to be displayed
     *
     * @abstract
     */
    removeContent() {}

    /**
     * This method is essentially a "blueprint" of the page
     * It will build up the content of the page so that ContentManager
     * can append the content to the DOM. This prevents the pages from directly
     * interacting with the DOM or injecting HTML and should hopefully make it
     * easier in the future to make more complex pages. I hope.
     *
     * @abstract
     */
    buildContent() {}

    // May become public instead
    // insertNav() {}

    /* **************************************** Public Methods *****************************************/

    /**
     * Creates a button element for navigation
     *
     * @param {string} _name - The button's text content
     * @param {string} _event - The name of the custom event to dispatch onclick
     * @param {string} _target - The redirect content to redirect to
     * @param {object} _extra - Any added details for the event
     *
     * @returns {object} Returns the button the the function created
     */
    createButton(_name, _event, _target = null, _extra = null) {
        const button = document.createElement("button");
        button.textContent = _name;
        button.addEventListener("click", () => {
            // Creates a custom event and assigns any relevant
            // custom details that the content manager needs to
            // utilise the custom event.
            const event = new CustomEvent(_event, {
                detail: {
                    content: _target,
                    button: button,
                    _extra,
                },
            });
            document.dispatchEvent(event);
        });
        return button;
    }

    /**
     * Create an HTML h1 element
     *
     * @param {string} _text - Title's text
     * @returns {object} - TITLE element
     */
    createTitle(_text) {
        const TITLE = document.createElement("h1");
        TITLE.textContent = _text;
        return TITLE;
    }

    /**
     * Creates an input element with the given parameters.
     * For the registration form mainly.
     *
     * @param {string} _labelText - Text for the label of the input
     * @param {string} _text - Placeholder text
     * @param {string} _type - Type of input to make
     * @param {string} _name - Name of the input
     * @param {string} _id - HTML id of the input (for collecting the value of the input)
     * @param {string} _divID - ID of the div to put the input into.
     *
     * @returns {Node} - HTML Node Element (div) with the input and label in it
     */
    createInput(_labelText, _text = null, _type, _name, _id, _divID) {
        const LABEL = document.createElement("label");
        LABEL.htmlFor = _name;
        LABEL.textContent = _labelText;

        const INPUT = document.createElement("input");
        INPUT.placeholder = _text;
        INPUT.type = _type;
        INPUT.name = _name;
        INPUT.id = _id;
        INPUT.required = true;

        const CONTAINER = document.createElement("div");
        CONTAINER.id = _divID;
        CONTAINER.append(LABEL, BREAK, INPUT);
        return CONTAINER;
    }

    createNavBar() {
        try {
            // Make nav bar element
            const NAV = document.createElement("nav");
            NAV.id = "n_navBar";

            const LINK_LIST = document.createElement("ul");
            LINK_LIST.id = "ul_nav";

            // Create nav buttons!
            // There's four to be made: Profile (a picture of the user's PFP that links to the current page),
            // Games, Leaderboard, and ADMIN (if the user's adminStatus === true)

            // First, leftmost button, the PFP, which leads to the Profile page when clicked
            const LIST_ELEMENT_ONE = document.createElement("li");
            const PROFILE_NAV = document.createElement("img");
            PROFILE_NAV.id = "i_pfpImage";
            PROFILE_NAV.type = "button";
            PROFILE_NAV.src = `${firebaseIO.auth.currentUser.photoURL}`;
            PROFILE_NAV.addEventListener("click", () => {
                const event = new CustomEvent("navigate", {
                    detail: {
                        content: "Profile",
                    },
                });
                document.dispatchEvent(event);
            });
            LIST_ELEMENT_ONE.appendChild(PROFILE_NAV);
            LINK_LIST.appendChild(LIST_ELEMENT_ONE);

            // Next, the games page:
            const LIST_ELEMENT_TWO = document.createElement("li");
            const GAMES_NAV = this.createButton("Games", "navigate", "Games");
            GAMES_NAV.id = "b_games";
            GAMES_NAV.classList.add("navButtons");
            LIST_ELEMENT_TWO.appendChild(GAMES_NAV);
            LINK_LIST.appendChild(LIST_ELEMENT_TWO);

            // Next, the Leaderboard page
            const LIST_ELEMENT_THREE = document.createElement("li");
            const LEADERBOARD_NAV = this.createButton(
                "Leaderboards",
                "navigate",
                "Leaderboard",
            );
            LEADERBOARD_NAV.id = "b_leaderboard";
            LEADERBOARD_NAV.classList.add("navButtons");
            LIST_ELEMENT_THREE.appendChild(LEADERBOARD_NAV);
            LINK_LIST.appendChild(LIST_ELEMENT_THREE);

            // Finally, this is if the user is an admin:
            const USER = getRecord();
            if (USER.adminStatus === true) {
                const LIST_ELEMENT_FOUR = document.createElement("li");
                const ADMIN_NAV = this.createButton(
                    "ADMIN",
                    "navigate",
                    "Admin",
                );
                ADMIN_NAV.id = "b_admin";
                ADMIN_NAV.classList.add("navButtons");
                LIST_ELEMENT_FOUR.appendChild(ADMIN_NAV);
                LINK_LIST.appendChild(LIST_ELEMENT_FOUR);
            }

            NAV.appendChild(LINK_LIST);

            return NAV;
        } catch (error) {
            console.error(error);
        }
    }
}
