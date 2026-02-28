/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This is essentially a static class for styling the base layout of the page.
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

    static applyBaseStyles() {
        document.body.style.backgroundColor = BaseStyles.backgroundColor;
        document.body.style.text = BaseStyles.textColor;
    }
}
