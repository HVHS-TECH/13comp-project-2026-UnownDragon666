import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for GTI_Lobby.mjs
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
            /* Split page into two sections, Player Sec on left, Tab sec on right */
            #s_lobby {
                display: grid;
                grid-template-columns: 1fr 1fr;
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

            #b_exitButton {
                width: 20%;
                font-size: 1.5rem;
                background-color: ${Colors.Tabs.backgroundColor};
                color: ${Colors.Tabs.textColor};
                border: 2px solid ${Colors.Tabs.borderColor};
            }

            #b_exitButton:hover {
                background-color: ${Colors.Tabs.hoverBackgroundColor} !important;
                color: ${Colors.Tabs.hoverTextColor} !important;
                border-color: ${Colors.Tabs.borderColor} !important;
            }

            /* Tabs */
            #s_tabsSection {
                padding: 1rem;
                border-left: 3px solid ${Colors.Tabs.borderColor};
            }

            .tab {
                overflow: hidden;
                border: 2px solid ${Colors.Tabs.borderColor};
                border-radius: 5px;
                background-color: ${Colors.Tabs.backgroundColor};
                font-size: 1.5rem;
                color: ${Colors.Tabs.textColor};
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
                background-color: ${Colors.Tabs.hoverBackgroundColor} !important;
                color: ${Colors.Tabs.hoverTextColor} !important;
            }

            .tab button.active {
                border-bottom: 3px solid ${Colors.Tabs.borderColor};
            }

            .tabcontent {
            }
        `;
    }
}
