/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This is essentially a static class for styling the base layout of the page.
 * Apply the given styles to the "base" layer of the DOM
 * That is to say, this is essentially the "root" of my modCSS w/ JS
 * system.
 * Styles are separated into base, component, and content layers to
 * make the entire thing cleaner than a massive CSS file with
 * all of them in the same thing.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class BaseStyles {
    /* **************************************** Public Fields *****************************************/
    static backgroundColor = "#f5ebec";
    static textColor = "#000000";

    /* **************************************** Public Methods *****************************************/
    /**
     * Initialise the base styles for the pages
     */
    static applyBaseStyles() {
        document.body.style.backgroundColor = BaseStyles.backgroundColor;
        document.body.style.text = BaseStyles.textColor;
    }
}
