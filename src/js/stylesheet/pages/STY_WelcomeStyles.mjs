import BaseStyles from "../STY_BaseStyles.mjs";
/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CNT_Welcome.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class WelcomeStyles {
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
            .s_landing h1 {
                text-align: center;
            }

        `;
    }
}
