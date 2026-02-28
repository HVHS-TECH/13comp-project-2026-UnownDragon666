/*
    CM_ContentManager.mjs
    
    Content Manager is a class made to manage the contents
    of the HTML page in this project.

    Written in Term One 2026 for programming/database project
    By: Idrees Munshi
*/
import Content from "../content/CNT_Content.mjs";
import * as ContentPages from "../content/CNT_Index.mjs";

export default class ContentManager {
    /* Private Fields */
    // The root <div> element's id, to be used for updating the page contents
    #rootDiv;

    /* Public Fields */
    // I need to keep a record of the current content being displayed
    displayedContent = null;

    /* Constructor */
    constructor(_root) {
        this.#rootDiv = _root;
        document.addEventListener("navigate", this.CM_navigate.bind(this));
    }

    /* Methods */

    /* 
        CM_DisplayContent()

        Displays content in the "CNT" class passed to it
        Inputs: 
        _content: CNT Class with instructions on how to display the required content
        Outputs:
        N/A
    */
    async CM_displayContent(_content) {
        // Function replaces the current content of the page with new content

        // First, remove currently displayed page's HTML:
        this.displayedContent !== null
            ? this.displayedContent.removeContent()
            : null;

        // Next, create an instance of the new page content
        let page = new _content();
        page.buildContent();

        // Now: Append this page to the DOM
        this.#rootDiv.appendChild(page.section);

        // Update displayedContent
        this.displayedContent = page;
    }

    /*
        CM_navigate() 

        Called by Event Listener that listens for custom Event "navigate"
        "navigate" contains a "detail" called "content" which tells this method
        which page to navigate to.

        Inputs:
        _event: contains the "navigate" event that fired
        Outputs:
        N/A
    */
    async CM_navigate(_event) {
        // Inside the "navigate" event is the name of the class I need to navigate to
        let navTarget = _event.detail.content;
        this.CM_displayContent(ContentPages[navTarget]);
    }
}
