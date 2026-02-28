/* 
    CNT_Content.mjs

    Content is an "abstract" class designed to be inherited by all CNT Classes
    as a way to reduce redundancy in the code and make the system more fluid and expandable

    Written in Term One 2026 for programming/database project
    By: Idrees Munshi
*/

export default class Content {
    /* Private Fields */

    /* Public Fields */
    section;

    /* 
        Constructor 
        - Inherited as constructor for all content classes
    
        Creates a section element to store the contents of the page, assigns
        the section an ID based on a parameter passed by the child, used when 
        the content is removed as an easy way to kill the content.

        Inputs:
        _secID: ID to assign to section element. 
        Outputs:
        N/A
    */
    constructor(_secID) {
        this.section = document.createElement("section");
        this.section.id = _secID;
    }

    /* Abstract Methods */
    removeContent() {}
    buildContent() {}
    insertNav() {}
}
