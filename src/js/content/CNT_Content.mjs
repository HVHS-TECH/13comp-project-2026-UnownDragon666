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

    /* Constructor 
    - Inherited as constructor for all content classes
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
