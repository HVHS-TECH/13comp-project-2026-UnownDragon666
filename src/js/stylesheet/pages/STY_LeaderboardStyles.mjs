import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CNT_Leaderboard.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class LeaderboardStyles {
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire project cleaner than a massive CSS file with
     * all of them in the same file.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
            body {
                overflow: hidden;
            }

            #s_leaderboard {
                height:100%;
            }
            #leaderboardContainer {
                max-width: 45%;
                margin: 2rem auto;
            }

            #leaderboardTitle {
                font-weight: 500;
                text-align: center;
                margin: 0 0 1.5rem;
                font-size: 4em;
            }

            #chooseLeaderboardContainer {
                margin: 2rem 0rem;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            #tr_lbheader th {
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                padding: 0 12px 10px;
                border-bottom: 0.5px solid darkslateblue;
                text-align: left;
                font-size: 1.5em; 
            }

            #tr_lbheader th:last-child {
                text-align: center;
            }

            tbody tr {
                transition: background 0.1s;
            }

            tbody td:first-child {
                text-align:center
            }

            tbody td:nth-child(2) {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            tbody td {
                padding: 13px 12px;
                font-size: 16px;
            }

            tbody {
                overflow: scroll;
            }

            .img_pfpLb {
                border-radius: 50%;
                height: 3em;
            }

            #leaderboardScroll {
                max-height: 500px;
                overflow-y: auto;
                border-radius: 8px;
            }

            #currentUser {
                background: ${Colors.registrationFormBackgroundColor};
                outline: 2px solid ${Colors.registrationFormBorderColor};
                font-weight: 600;
                outline-offset: -2px;
                border-radius: 15px;
            }

            #currentUser .img_pfpLb {
                border: 3px solid ${Colors.registrationInputFocusBorderColor};
                box-shadow: 0 0 10px ${Colors.registrationInputFocusBoxShadowColor};
            }
        `;
    }
}
