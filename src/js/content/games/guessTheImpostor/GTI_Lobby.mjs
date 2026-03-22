import { getRecord } from "../../../accountManager/AM_User.mjs";
import { firebaseIO } from "../../../firebase/FB_instance.mjs";
import Content from "../../CNT_Content.mjs";
import { getLobbyRecord, getServerID } from "./GTI_LobbyReference.mjs";

/**
 * @family GTI: Guess the Impostor, an extension of CNT: Content
 * @description The content for the current lobby that the user is in.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Lobby extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_lobby";
    #lobbyPath;

    // Unsubscribe to listener functions
    #unsubscribePlayers;
    #unsubscribeRules;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (LoBby Style Sheet)
    styleID = "LBSS";
    lobbyID;

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Lobby.#secID);
        this.lobbyID = getServerID();
        this.#lobbyPath = `/games/guessTheImpostor/servers/${this.lobbyID}`;
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        this.#unsubscribePlayers?.();
        // this.#unsubscribeRules?.();

        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        // The left half of the page is a list of the players with an exit button over top.
        // It will contain the option to invite people, either friends, or by username.
        // and the option to kick a user (for the host)
        const PLAYER_SECTION = document.createElement("section");
        PLAYER_SECTION.id = "s_playerSection";
        const EXIT_BUTTON = super.createButton(
            "EXIT",
            "navigate",
            "GuessTheImpostorLobbies",
        );
        EXIT_BUTTON.id = "b_exitButton";

        const PLAYER_LIST = document.createElement("ul");
        PLAYER_LIST.id = "u_playerList";

        PLAYER_SECTION.append(EXIT_BUTTON, PLAYER_LIST);

        // Add players to the player list.
        // This will create an event listener with onValue, which always runs once when instantiated.
        this.#unsubscribePlayers = firebaseIO.subscribeToRecord(
            `${this.#lobbyPath}/players`,
            (data) => {
                this.#updatePlayerList(data, PLAYER_LIST);
            },
        );

        // The right half of the page is a block containing a few tabs
        // The first tab will be the chat, just a simple chat system for the players in the lobby.
        // The second tab will be the host controls. i.e. controlling the max number of players,
        // the no. of rounds, and round length and stuff. (also the ability to make the lobby public)
        const TABS_SECTION = document.createElement("section");
        TABS_SECTION.id = "s_tabsSection";

        const TABS_CONTAINER = document.createElement("div");
        TABS_CONTAINER.classList.add("tab");

        const CHAT_TAB_BUTTON = document.createElement("button");
        CHAT_TAB_BUTTON.type = "button";
        CHAT_TAB_BUTTON.textContent = "Chat";
        CHAT_TAB_BUTTON.classList.add("tabLinks");
        CHAT_TAB_BUTTON.addEventListener("click", () => {
            this.#openChatTab();
        });

        const RULES_TAB_BUTTON = document.createElement("button");
        RULES_TAB_BUTTON.type = "button";
        RULES_TAB_BUTTON.textContent = "Rules";
        RULES_TAB_BUTTON.classList.add("labLinks");
        RULES_TAB_BUTTON.addEventListener("click", () => {
            this.#openRulesTab();
        });

        TABS_CONTAINER.append(CHAT_TAB_BUTTON, RULES_TAB_BUTTON);
        TABS_SECTION.append(TABS_CONTAINER);

        this.section.append(PLAYER_SECTION, TABS_SECTION);
    }

    /* **************************************** Private Methods *****************************************/
    /**
     * Creates a list of the players in the current lobby on the page.
     *
     * @param {Object} _players - Object containing players in this server.
     * @param {Node<Element>} - The element to append players to.
     */
    #updatePlayerList(_players, _playerList) {
        console.log(_players);

        _playerList.innerHTML = ``;

        // const NEW_PLAYER_LIST = document.createElement("ul");
        // NEW_PLAYER_LIST.id = "u_playerList";
        for (let [uid, playerData] of Object.entries(_players)) {
            let name = playerData.name;
            let pfpURL = playerData.photoURL;

            // create a list element with pfp, name and kick button (if the current user is the host)
            const LIST = document.createElement("li");
            const PFP = document.createElement("img");
            PFP.src = pfpURL;
            PFP.classList.add("playerListPFPImages");
            const NAME = document.createElement("p");
            NAME.textContent = name;
            NAME.classList.add("playerListNameText");

            LIST.append(PFP, NAME);

            // If user is host
            if (getRecord().uid == getLobbyRecord().host.uid) {
                // If the uid is not the current user's
                if (uid != getRecord().uid) {
                    const KICK_BUTTON = document.createElement("button");
                    KICK_BUTTON.type = "button";
                    KICK_BUTTON.addEventListener("click", () => {
                        const KICK_EVENT = new CustomEvent("kick", {
                            detail: {
                                content: uid,
                            },
                        });
                        document.dispatchEvent(KICK_EVENT);
                    });
                    LIST.appendChild(KICK_BUTTON);
                }
            }
            _playerList.appendChild(LIST);
        }
    }

    #openChatTab() {}

    #openRulesTab() {}
}
