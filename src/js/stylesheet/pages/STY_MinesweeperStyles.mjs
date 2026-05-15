import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CNT_Register.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class MinesweeperStyles {
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire thing cleaner than a massive CSS file with
     * all of them in the same thing.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
        #s_minesweeper {
            height: 100vh;
        }
        
        #s_minesweeperGrid {
            gap: 5px;
            margin: auto;
        }

        .inactiveMinesweeperCell {
            background-color: #808080;
        } 

        .activeMineCell {
            background-color: #FF0000;
        }
        `;
    }
}
