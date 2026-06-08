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
                background:${Colors.GameScreen.sidebarBackground};
            }

            .tab {
                display: flex;
                gap: 6px;
                padding: 4px;
                background-color:${Colors.GameScreen.tabBackground};
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
                color:${Colors.GameScreen.tabText};
                transition: background-color 0.2s, color 0.2s;
            }

            .tab button.active {
                background-color:${Colors.GameScreen.tabActiveBackground};
                color:${Colors.GameScreen.tabActiveText};
            }

            .tab button:hover:not(.active) {
                color:${Colors.GameScreen.tabHoverText};
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
                align-items:center;
                border-radius:12px;
                transition:.2s;
            }

            .playerRow:hover {
                background:${Colors.GameScreen.playerRowHover};
            }

            .playerName {
                flex:1;
                font-weight:600;
            }

            .playerScore {
                background:${Colors.GameScreen.accentBlue};
                color:${Colors.GameScreen.scoreBadgeText};
                border-radius:999px;
                padding:4px 10px;
                font-weight:bold;
                min-width:40px;
                text-align:center;
            }

            /* Chat */
            .chatMessage {
                padding:10px;
                border-radius:10px;
                background:${Colors.GameScreen.chatBubbleBackground};
                margin-bottom:6px;
            }

            .chatMessages {
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .chatWrapper {
                display: flex;
                flex-direction: column;
                height: 100%;
            }


            /* Messages scroll area */
            #d_messageInputContainer {
                display: flex;
                gap: 6px;
                padding: 10px;
                border-top: 1px solid #333;
                margin-top: auto;
                background: ${Colors.GameScreen.sidebarBackground};
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

            /* Main display area */
            #s_main {
                grid-area: main;
                overflow-y: auto;
                display:flex;
                flex-direction:column;
                gap:24px;
                padding:24px;   
            }

            #s_main > section {
                display:grid;
                grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
                gap:20px;
            }

            .promptCardChoice {
                background-color: ${Colors.GameScreen.blackCardBackground};
                border-radius:16px;
                padding:20px;
                cursor:pointer;
                transition:.25s;
                min-height:180px;
                display:flex;
                align-items:center;
                justify-content:center;
                text-align:center;
                box-shadow:${Colors.GameScreen.shadowMedium};
            }

            .promptCardChoice:hover {
                transform:translateY(-4px);
                box-shadow:${Colors.GameScreen.shadowLarge};
            }

            .promptCardChoice > * {
                color: ${Colors.GameScreen.blackCardText};
            }

            /* Status Messages */
            .statusMessage {
                text-align:center;
                font-size:1.25rem;
                font-weight:600;
                opacity:.8;
                margin-top:10vh;
            }

            /* Prompt Card */
            .promptCard {
                background:${Colors.GameScreen.blackCardBackground};
                color:${Colors.GameScreen.blackCardText};
                width:min(700px,100%);
                min-height:220px;
                border-radius:18px;
                padding:28px;
                display:flex;
                flex-direction:column;
                justify-content:space-between;
                box-shadow:${Colors.GameScreen.shadowMedium};
                margin:auto;
            }

            .promptText {
                font-size:1.6rem;
                font-weight:700;
                line-height:1.4;
            }

            .promptMeta {
                opacity:.7;
                font-size:.9rem;
            }

            .promptPick {
                font-weight:bold;
                color:${Colors.GameScreen.promptPickColor};
            }

            /* Hand Section */
            #s_handSection {
                padding-top: 2vh;
                display:grid;
                grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
                gap:18px;
            }

            .cardsInHand {
                background:${Colors.GameScreen.whiteCardBackground};
                border:3px solid transparent;
                border-radius:16px;
                padding:18px;
                min-height:180px;
                cursor:pointer;
                font-weight:600;
                transition:.2s;
                box-shadow:${Colors.GameScreen.shadowSmall};
            }

            .cardsInHand:hover {
                transform:translateY(-4px);
            }

            .cardsInHand.selected {
                border-color:${Colors.GameScreen.accentBlue};
                background:${Colors.GameScreen.selectedBackground};
                transform:translateY(-6px);
                box-shadow:${Colors.GameScreen.shadowSelected};
            }

            /* Judging cards */
            .responsesContainer {
                display:flex;
                flex-wrap:wrap;
                gap:18px;
                justify-content:center;
            }

            .responseCard {
                width:260px;
                min-height:180px;
                background:${Colors.GameScreen.whiteCardBackground};
                border-radius:16px;
                padding:18px;
                cursor:pointer;
                transition:.2s;
                box-shadow:${Colors.GameScreen.shadowSmall};
            }

            .responseCard:hover {
                transform:scale(1.03);
            }

            /* Judging screen */
            #s_judging {
                display:flex;
                flex-direction:column;
                gap:28px;
            }

            /* Round Winner screen */
            #s_roundEnd {
                display:flex !important;
                flex-direction:column;
                align-items:center;
            }

            .winnerTitle {
                font-size:2rem;
                color:${Colors.GameScreen.winnerColor};
                text-shadow:${Colors.GameScreen.winnerGlow};
            }

            /* Game End Screen */
            #s_gameEnd {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 18px;
                padding: 24px;
            }

            .gameEndTitle {
                font-size: 2.5rem;
                color: ${Colors.GameScreen.gameEndTitle};
                margin: 0;
            }

            .gameEndWinner {
                font-size: 1.4rem;
                font-weight: 700;
                color: ${Colors.GameScreen.gameEndWinner};
            }

            .gameEndLeaderboard {
                width: min(500px, 100%);
                background: ${Colors.GameScreen.leaderboardBackground};
                border-radius: 16px;
                border: 2px solid ${Colors.GameScreen.leaderboardBorder};
                overflow: hidden;
                box-shadow: ${Colors.GameScreen.shadowMedium};
            }

            .gameEndRow {
                display: flex;
                justify-content: space-between;
                padding: 12px 16px;
                transition: 0.2s;
                font-weight: 600;
            }

            .gameEndRow:hover {
                background: ${Colors.GameScreen.leaderboardRowHover};
            }

            .gameEndScore {
                font-weight: bold;
                color: ${Colors.GameScreen.gameEndScore};
            }

            .gameEndButton {
                margin-top: 12px;
                padding: 10px 18px;
                border: none;
                border-radius: 999px;
                background: ${Colors.GameScreen.gameEndButtonBackground};
                color: ${Colors.GameScreen.gameEndButtonText};
                font-weight: bold;
                cursor: pointer;
                transition: 0.2s;
            }

            .gameEndButton:hover {
                background: ${Colors.GameScreen.gameEndButtonHover};
                transform: translateY(-2px);
            }
        `;
    }
}
