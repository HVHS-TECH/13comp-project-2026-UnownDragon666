import Colors from "../STY_ColorReference.mjs";

/**
 * @family STY: Stylesheet
 *
 * @description Acts as a JS alternative to a .css file by dynamically styling elements
 * created by other classes
 *
 * This STY file is for CACS_GameScreen.mjs
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class CardsStyles {
    /**
     * Apply the given style to the content layer style in index.html
     * Styles are separated into base, component, and content layers to
     * make the entire thing cleaner than a massive CSS file with
     * all of them in the same thing.
     */
    static applyStyle() {
        document.getElementById("contentLayerStyle").innerHTML = `
            #s_game {
                display: grid; 
                grid-template-rows: auto 1fr;  
                grid-template-columns: 1fr 400px;
                 grid-template-areas:
                    "topbar  topbar"
                    "main    sidebar";
                height: 100vh;
                overflow: hidden;  
                row-gap: 1vh;
            }

            /* Topbar styles */
            #d_topbar {
                grid-area: topbar;
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 8px 20px;
                border-bottom: 1px solid #333;
                width: 95%;
            }

            /* Round counter */
            #p_roundCounterLabel {
                font-size: 10px;
                letter-spacing: 0.1em;
                margin: 0;
                line-height: 1;
            }

            #p_roundNumber {
                font-size: 22px;
                font-weight: 700;
                margin: 0;
                line-height: 1;
            }

            /* Timer */
            #p_timer {
                font-size: 22px;
                font-weight: 700;
                margin: 0;
                float: right;
            }

            :has(#p_timer) {
                margin-left: auto;
            }

            /* Sidebar */
            #d_sidebar {
                grid-area: sidebar;
                display: flex;
                flex-direction: column;
                border-left: 1px solid #333;
                overflow: hidden;
                padding: 1vh;
            }

            .tab {
                display: flex;
                gap: 6px;
                padding: 4px;
                background-color: #1a1a1a;
                border-radius: 999px;
            }

            .tab button {
                flex: 1;
                background-color: transparent;
                border: none;
                border-radius: 999px;
                outline: none;
                cursor: pointer;
                padding: 6px 12px;
                font-size: 0.85rem;
                color: #aaa;
                transition: background-color 0.2s, color 0.2s;
            }

            .tab button.active {
                background-color: #2e2e2e;
                color: #fff;
            }

            .tab button:hover:not(.active) {
                color: #ddd;
            }

            /* Player List */
            .playerAvatar {
                border-radius: 50%; 
                height: 3em;
                padding-right: 1vh;
                margin-right: 1vw;
            }

            .playerRow {
                display: flex;
                flex-direction: row;
                padding: 1vh;
                border-bottom: 1px solid #333;
            }

            /* Messages scroll area */
            #d_messagesContainer {
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            /* Individual message bubbles */
            .sentByCurrentUser,
            .sentByOtherUser {
                max-width: 80%;
                padding: 6px 10px;
                border-radius: 8px;
                font-size: 13px;
            }

            .sentByCurrentUser {
                align-self: flex-end;
            }

            .sentByOtherUser {
                align-self: flex-start;
            }

            .senderNames {
                font-size: 10px;
                margin: 0 0 2px;
                opacity: 0.6;
            }

            /* Message input bar */
            #d_messageInputContainer {
                display: flex;
                gap: 6px;
                padding: 10px;
                border-top: 1px solid #333;
            }

            #i_sendMessages {
                flex: 1;
                padding: 6px 10px;
                border-radius: 6px;
                border: 1px solid #555;
                font-size: 13px;
            }

            /* ── Main display area ── */
            #s_main {
                grid-area: main;
                overflow-y: auto;
                padding: 20px;
            }

            .promptCardChoice {
                background-color: ${Colors.Cards.backgroundColor};
            }

            .promptCardChoice > * {
                color: ${Colors.Cards.fontColor};
            }
        `;
    }
}
