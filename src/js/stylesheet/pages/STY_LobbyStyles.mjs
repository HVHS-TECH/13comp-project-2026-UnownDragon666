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
            body {
                overflow: hidden;
            }

            #s_lobby {
                display: grid;
                grid-template-columns: 280px 1fr;
                height: 100vh;
                gap: 1rem;
                padding: 1rem;
                box-sizing: border-box;
            }

            /* Player List */
            #s_playerSection {
                display: flex;
                flex-direction: column;
                padding: 1rem;
                border-radius: 12px;
                background-color: ${Colors.cardBackgroundColor};
                border: 1px solid ${Colors.cardBorderColor};
                overflow: hidden;
            }

            #u_playerList {
                list-style: none;
                padding: 0;
                margin: 1rem 0 0 0;
                display: flex;
                flex-direction: column;
                gap: 0.4rem;
                overflow-y: auto;
            }

            #u_playerList li {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.6rem 0.75rem;
                border-radius: 8px;
                border: 1px solid transparent;
                transition: background-color 0.2s, border-color 0.2s;
            }

            #u_playerList li:hover {
                border-color: ${Colors.Tabs.borderColor};
                background-color: ${Colors.playerListHoverBackgroundColor};
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
                font-size: 0.95rem;
            }

            /* Exit button */
            #b_exitButton {
                width: 100%;
                font-size: 0.95rem;
                padding: 0.6rem;
                background-color: ${Colors.Tabs.backgroundColor};
                color: ${Colors.Tabs.textColor};
                border: 2px solid ${Colors.Tabs.borderColor};
                cursor: pointer;
                border-radius: 8px;
            }

            #b_exitButton:hover {
                background-color: ${Colors.Tabs.hoverBackgroundColor};
                color: ${Colors.Tabs.hoverTextColor};
            }

            /* Tabs */
            #s_tabsSection {
                display: flex;
                flex-direction: column;
                padding: 0;
                min-height: 0;
            }

            .tab {
                display: flex;
                border-radius: 10px 10px 0 0;
                background-color: ${Colors.Tabs.backgroundColor};
            }

            .tab button {
                flex: 1;
                background-color: transparent;
                border: none;
                border-right: 1px solid ${Colors.Tabs.borderColor};
                outline: none;
                cursor: pointer;
                padding: 0.85rem 1rem;
                font-size: 1rem;
                color: ${Colors.Tabs.textColor};
                transition: background-color 0.2s, color 0.2s;
            }

            .tab button:last-child {
                border-right: none;
            }

            .tab button:hover {
                background-color: ${Colors.Tabs.hoverBackgroundColor};
                color: ${Colors.Tabs.hoverTextColor};
            }

            .tab button.active {
                background-color: ${Colors.Tabs.hoverBackgroundColor};
                color: ${Colors.Tabs.hoverTextColor};
            }

            /* tab content */
            .tabContent {
                flex: 1;
                display: flex;
                flex-direction: column;
                border: 2px solid ${Colors.Tabs.borderColor};
                border-top: none;
                border-radius: 0 0 10px 10px;
                padding: 1rem;
                overflow: hidden;
                min-height: 0;
            }

            /* Chat tab */
            #d_messageInputContainer {
                display: flex;
                gap: 0.5rem;
                margin-top: auto;
                padding-top: 0.75rem;
                border-top: 1px solid ${Colors.Tabs.borderColor};
            }

            #d_messagesContainer {
                flex: 1;
                overflow-y: auto;
                min-height: 0;
            }

            #i_sendMessages {
                flex: 1;
                padding: 0.6rem 0.75rem;
                font-size: 1rem;
                border: 1px solid ${Colors.Tabs.borderColor};
                border-radius: 6px;
                background-color: #ffffff;
                color: ${Colors.textColor};
            }

            #d_messageInputContainer button {
                padding: 0.6rem 1.2rem;
                font-size: 1rem;
                border: 1px solid ${Colors.Tabs.borderColor};
                border-radius: 6px;
                cursor: pointer;
                background-color: ${Colors.buttonColor};
                color: ${Colors.buttonTextColor};
            }

            #d_messageInputContainer button:hover {
                background-color: ${Colors.buttonHoverColor};
                color: ${Colors.buttonTextHoverColor};
            }

            .sentByCurrentUser, .sentByOtherUser {
                max-width: 70%;
                padding: 0.6rem 0.75rem;
                border-radius: 10px;
                margin-bottom: 0.5rem;
            }

            .sentByCurrentUser {
                margin-left: auto;
                background-color: ${Colors.playerListActiveBackgroundColor};
            }

            .sentByOtherUser {
                margin-right: auto;
                background-color: ${Colors.playerListHoverBackgroundColor};
            }

            .senderNames {
                font-size: 0.7rem;
                margin: 0 0 0.2rem 0;
                opacity: 0.6;
            }

            .sentByCurrentUser p:last-child,
            .sentByOtherUser p:last-child {
                margin: 0;
                font-size: 0.95rem;
            }

            /* rules tab */
            #f_rules {
                display: flex;
                flex-direction: column;
                gap: 0.9rem;
                margin-bottom: 1rem;
            }

            #f_rules > div {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }

            #f_rules label {
                font-size: 0.9rem;
            }

            #f_rules input[type="number"] {
                width: 90px;
                padding: 0.45rem;
                font-size: 1rem;
                border: 1px solid ${Colors.Tabs.borderColor};
                border-radius: 6px;
                background-color: #ffffff;
                color: ${Colors.textColor};
                text-align: center;
            }

            #b_submitRules {
                padding: 0.6rem 1.5rem;
                font-size: 1rem;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                background-color: ${Colors.buttonColor};
                color: ${Colors.buttonTextColor};
            }

            #b_submitRules:hover:not(:disabled) {
                background-color: ${Colors.buttonHoverColor};
                color: ${Colors.buttonTextHoverColor};
            }

            #b_submitRules:disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }

            /* Instructions */

            #d_instructionsContainer {
                line-height: 1.6;
            }

            #d_instructions h2 {
                margin-top: 0;
                font-size: 1.5rem;
            }

            #d_instructions h3 {
                font-size: 1.05rem;
                margin: 0 0 0.3rem 0;
            }

            #d_instructions p {
                margin: 0;
                font-size: 0.95rem;
            }

            .instructionPhase {
                padding: 0.75rem 1rem;
                border-left: 4px solid ${Colors.Tabs.borderColor};
                margin-bottom: 0.75rem;
            }

            .tips {
                display: flex;
                flex-direction: row;
                gap: 2rem;
            }

            .instructionTip {
                padding: 0.75rem 1rem;
                border: 1px solid ${Colors.Tabs.borderColor};
                border-radius: 8px;
                margin-bottom: 0.75rem;
                flex: 1;
            }

            #d_goals {
                padding: 0.75rem 1rem;
                border: 1px solid ${Colors.Tabs.borderColor};
                border-radius: 8px;
                margin-top: 0.5rem;
            }

            #d_goals h3 {
                font-size: 1rem;
                margin: 0 0 0.4rem 0;
            }

            #d_goals h4 {
                font-size: 0.9rem;
                font-weight: normal;
                margin: 0 0 0.4rem 0;
            }
        `;
    }
}
