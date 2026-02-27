/* 
    CNT_Welcome.mjs

    Welcome is a class for the content of the landing page
    That is, the login page

    Written in Term One 2026 for programming/database project
    By: Idrees Munshi
*/
export default class Welcome extends Content {
    /* Private Fields */
    static #secID = "s_landing"

    /* Public Fields */
    contentSection;

    constructor() {
        super(Welcome.#secID);
    }

    /* Parent Class Method Overrides */
    removeContent() {
        
    }

    addHTML() {
        this.section.innerHTML = 
        `
        <h1> HELLO WORLD </h1>
        `
    }
}