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
            box-sizing: border-box;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
            padding-top: 3rem;
            padding-inline: 5rem;
            gap: 3rem;
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

        /* Modal styling */
        #d_modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            overflow: auto;
            justify-content: center;
            align-items: center;
            background-color: ${Colors.modalOutsideColor};
        }

        #d_modalContent {
            background-color: ${Colors.modalBackgroundColor};
            padding: 4rem;
            margin-top: 15%;
            margin-bottom: 15%;
            border-radius: 10px;
            max-width: 40%;
            min-width: 33%;
            width: 90%;
            text-align: center;
            position: relative;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            color: ${Colors.modalTextColor};
        }

        #d_modalContent button {
            background-color: ${Colors.modalButtonColor};
            border: none;
            color: ${Colors.textHoverColor};
        }

         #d_modalContent button:hover {
            background-color: ${Colors.modalButtonHoverColor};
            color: ${Colors.modalTextColor};
         }

         #h_modalTitle {
            font-weight: bold;
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
        }

        #p_modalDescription {
            font-size: 1.25rem;
            margin-bottom: 2rem;
        }

        #s_modalClose {
            position: absolute;
            top: 0rem;
            right: 1rem;
            font-size: 4rem;
            cursor: pointer;
            color: ${Colors.modalCloseColor}};
        }
        `;
    }
}
