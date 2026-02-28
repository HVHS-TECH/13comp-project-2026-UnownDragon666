/*
    CM_ContentManager.mjs
    
    Content Manager is a class made to manage the contents
    of the HTML page in this project.

    Written in Term One 2026 for programming/database project
    By: Idrees Munshi
*/

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
    }

    /* Methods */

    /* 
        CM_DisplayContent()

        Displays content in the "CNT" class passed to it
        Inputs: 
        _content = CNT Class with instructions on how to display the required content
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
}
