import * as ContentPages from "../content/CNT_Index.mjs";
import * as StyleRef from "../stylesheet/STY_StylesheetReference.mjs";

/**
 * @family CM: Content Manager
 * @description Content Manager is a class made to manage the contents
 * of the HTML page in this project.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class ContentManager {
    /* **************************************** Private Fields *****************************************/
    #rootDiv;

    /* **************************************** Public Fields *****************************************/
    displayedContent;

    /* **************************************** Constructor *****************************************/
    /**
     * ContentManager constructor that sets up navigation and assigns the root div.
     *
     * @param {object} _root - Root element that the page contents will be appended to
     */
    constructor(_root) {
        this.#rootDiv = _root;
        document.addEventListener("navigate", this.CM_navigate.bind(this));
    }

    /* **************************************** Public Methods *****************************************/
    /**
     * Displays content in the "CNT" class passed to it
     *
     * @param {class} _content - The CNT Class to display, CNT Class is a class containing content information and
     * instructions on how to make the content to diplay on the page
     */
    async CM_displayContent(_content) {
        // Function replaces the current content of the page with new content

        // First, remove currently displayed page's HTML:
        this.displayedContent != undefined
            ? this.displayedContent.removeContent()
            : null;

        try {
            // Next, create an instance of the new page content
            let page = new _content();
            page.buildContent();

            // Update displayedContent
            this.displayedContent = page;

            // Update Stylesheets before appending to DOM
            this.updateStyles(this.displayedContent.styleID);

            // Now: Append this page to the DOM
            this.#rootDiv.appendChild(page.section);
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * This method updates the stylesheet of the page to match the currently displayed content.
     */
    updateStyles(_styleID) {
        try {
            StyleRef[_styleID].applyStyle();
        } catch (err) {
            console.error(`Stylesheet not found: ${err}`);
        }
    }

    /**
     * Called by Event Listener that listens for custom Event "navigate"
     *
     * "navigate" contains a "detail" called "content" which tells this method
     * which page to navigate to.
     *
     * @param {object} _event - custom event object containing the navigation details for the page
     */
    async CM_navigate(_event) {
        try {
            // Inside the "navigate" event is the name of the class I need to navigate to
            let navTarget = _event.detail.content;
            this.CM_displayContent(ContentPages[navTarget]);
        } catch (err) {
            console.error(err);
        }
    }
}
