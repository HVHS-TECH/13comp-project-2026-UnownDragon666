/* 
    CNT_Content.mjs

    Content is an "abstract" class designed to be inherited by all CNT Classes
    as a way to reduce redundancy in the code and make the system more fluid and expandable

    Written in Term One 2026 for programming/database project
    By: Idrees Munshi
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
     * @param {string} _target - The redirect content to redirect to
     *
     * @returns {object} Returns the button the the function created
     */
    createButton(_name, _target) {
        const button = document.createElement("button");
        button.textContent = _name;
        button.addEventListener("click", () => {
            // Creates a custom event called "navigate" telling the
            // Content Manager which Content to display next.
            const event = new CustomEvent("navigate", {
                detail: {
                    content: _target,
                },
            });
            document.dispatchEvent(event);
        });
        return button;
    }
}
