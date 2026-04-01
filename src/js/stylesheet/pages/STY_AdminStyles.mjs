import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CNT_Admin.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class AdminStyles {
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire project cleaner than a massive CSS file with
     * all of them in the same file.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
            /* Split page into two sections, Player Sec on left, Tab sec on right */
            #m_content {
                display: grid;
                grid-template-columns: 1fr 3fr;
                height: 100vh;
            }

            /* Player List */
            #s_playerSection {
                display: flex;
                flex-direction: column;
                padding: 1rem;
            }

            #u_playerList {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            #u_playerList li {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 2rem;
                padding: 0.75rem;
            }

            #u_playerList li .active {

            }

            .playerListPFPImages {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
            }

            .playerListNameText {
                margin: 0;
                flex: 1;
            }

            /* Tabs */
            #s_tabsSection {
                padding: 1rem;
            }

            .tab {
                overflow: hidden;
                border: none;
                background-color: ${Colors.tabBackgroundColor};
                font-size: 1.5rem;
            }

            .tab button {
                background-color: inherit;
                float: right;
                border: none;
                outline: none;
                cursor: pointer;
                padding: 14px 16px;
                transition: 0.15s;
            }

            .tab button:hover {
                color: ${Colors.tabButtonFontColorHover} !important;
                background-color: ${Colors.tabButtonHover} !important; 
            }

            .tab button.active {
            }

            .tabcontent {
            }
        `;
    }
}
