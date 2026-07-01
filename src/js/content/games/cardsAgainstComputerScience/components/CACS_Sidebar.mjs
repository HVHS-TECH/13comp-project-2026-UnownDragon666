import { firebaseIO } from "../../../../firebase/FB_instance.mjs";
import { getRecord } from "../../../../accountManager/AM_User.mjs";
import { getLobbyRecord, getServerID } from "../CACS_LobbyReference.mjs";

/**
 * @family CACS: Cards Against Computer Science
 * @description Class for the sidebar on the game screen.
 *
 * @class
 */

export default class Sidebar {
    /* **************************************** Private Fields *****************************************/
    #root;
    #content;
    #lobbyPath;
    #unsubscribe = [];
    #activeTab = "players";

    /* **************************************** Constructor *****************************************/
    constructor(_lobbyPath) {
        this.#lobbyPath = _lobbyPath;

        this.#root = document.createElement("div");
        this.#root.id = "d_sidebar";

        this.#build();
    }

    /**
     *  Kills all the listeners attached to the sidebar :)
     *
     */
    destroy() {
        this.#unsubscribe.forEach((u) => u());
    }

    /**
     * Build the sidebar
     */
    #build() {
        const TAB_ROW = document.createElement("div");
        TAB_ROW.classList.add("tab");

        const PLAYERS = document.createElement("button");
        PLAYERS.textContent = "Players";

        const CHAT = document.createElement("button");
        CHAT.textContent = "Chat";

        this.#content = document.createElement("div");

        PLAYERS.addEventListener("click", () => this.showPlayers());

        CHAT.addEventListener("click", () => this.showChat());

        TAB_ROW.append(PLAYERS, CHAT);

        PLAYERS.addEventListener("click", () => {
            this.#activeTab = "players";
            this.showPlayers();
        });

        CHAT.addEventListener("click", () => {
            this.#activeTab = "chat";
            this.showChat();
        });

        this.#root.append(TAB_ROW, this.#content);
    }

    /**
     * Change tabs to players list
     */
    showPlayers() {
        this.#content.innerHTML = "";

        const LIST = document.createElement("div");

        Object.values(getLobbyRecord().players).forEach((player) => {
            const ROW = document.createElement("div");

            ROW.classList.add("playerRow");

            ROW.innerHTML = `
            <img class="playerAvatar" src="${player.photoURL}">
            <p class="playerName">${player.name}</p>
            <p class="playerScore">${player.score}</p>
        `;

            LIST.append(ROW);
        });

        this.#content.append(LIST);
    }

    /**
     * If you are viewing the player list, refresh it if something changes on it.
     *
     * @param {Object} _lobbyData - Snapshot of the lobby in the database
     */
    refresh(_lobbyData) {
        if (this.#activeTab === "players") {
            this.showPlayers(_lobbyData);
        }
    }

    /**
     * Changes the sidebar to chow the chat
     */
    showChat() {
        this.#unsubscribe.forEach((u) => u());
        this.#unsubscribe = [];

        const unsub = firebaseIO.subscribeToRecord(
            `${this.#lobbyPath}/messages`,
            (messages) => {
                this.#renderChat(messages);
            },
        );

        this.#unsubscribe.push(unsub);
    }

    /**
     * renders the chat logs and creates the HTML elements.
     *
     * @param {Object} _messages - Messages in the lobby
     */
    #renderChat(_messages) {
        this.#content.innerHTML = "";

        const WRAPPER = document.createElement("div");
        WRAPPER.classList.add("chatWrapper");

        const MESSAGES = document.createElement("div");
        MESSAGES.classList.add("chatMessages");

        Object.values(_messages ?? {}).forEach((message) => {
            const MSG = document.createElement("p");
            MSG.classList.add("chatMessage");
            MSG.textContent = `${message.senderName}: ${message.content}`;
            MESSAGES.append(MSG);
        });

        const INPUT = this.#createInput();

        WRAPPER.append(MESSAGES, INPUT);
        this.#content.append(WRAPPER);

        MESSAGES.scrollTop = MESSAGES.scrollHeight;
    }

    /**
     * Creates the input for sending messages
     *
     * @returns {HTMLDivElement}
     */
    #createInput() {
        const MESSAGE_CONTAINER = document.createElement("div");
        MESSAGE_CONTAINER.id = "d_messageInputContainer";

        const INPUT = document.createElement("input");
        INPUT.id = "i_sendMessages";

        const BUTTON = document.createElement("button");
        BUTTON.type = "button";
        BUTTON.textContent = "submit";

        BUTTON.addEventListener("click", () => {
            const EVENT = new CustomEvent("sendMessage", {
                detail: {
                    content: getServerID(),
                    message: INPUT.value,
                },
            });
            document.dispatchEvent(EVENT);
        });

        INPUT.addEventListener("keydown", (event) => {
            if (event.key === "Enter") BUTTON.click();
        });

        MESSAGE_CONTAINER.append(INPUT, BUTTON);
        return MESSAGE_CONTAINER;
    }
}
