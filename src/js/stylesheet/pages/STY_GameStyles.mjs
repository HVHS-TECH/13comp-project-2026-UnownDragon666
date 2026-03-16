import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CNT_Games.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class GamesStyles {
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire project cleaner than a massive CSS file with
     * all of them in the same file.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
        /* Main content styling */
        #s_gameSubSec {
            font-size: 1.8rem;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
            gap: 1rem;
        }

        /* Game card styling */
        .gameCard {
            background-color: ${Colors.cardBackgroundColor};
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
        }

        .gameCard:hover {
            transform: scale(1.05);
            background-color: ${Colors.cardBackgroundColor};
        }
        `;
    }
}
