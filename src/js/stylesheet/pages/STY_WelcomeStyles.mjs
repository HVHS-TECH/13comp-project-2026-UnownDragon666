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
    /* **************************************** Public Methods *****************************************/
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire thing cleaner than a massive CSS file with
     * all of them in the same thing.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
#s_landing {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto auto;
}

#s_landing h1 {
    padding-top: 10%;
    font-size: 7vh;
    grid-column: 1/4;
    justify-self: center;
    grid-row: 1;
}

#s_landing #d_buttonContainer {
    margin: auto;
    padding-top: 15vh;
    padding-bottom: 15vh;
    grid-column: 2;
    justify-self: center;
    grid-row: 2;
    display: flex;
    gap: 5rem;
}

#s_landing button {
    font-size: 3vh;
}
        `;
    }
}
