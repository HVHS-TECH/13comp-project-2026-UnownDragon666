import { firebaseIO } from "../../../../firebase/FB_instance.mjs";
import { getRecord } from "../../../../accountManager/AM_User.mjs";
import { getLobbyRecord, getServerID } from "../CACS_LobbyReference.mjs";

export default class Sidebar {
    #root;
    #content;
    #lobbyPath;
    #unsubscribe = [];
    #activeTab = "players";

    constructor(_lobbyPath) {
        this.#lobbyPath = _lobbyPath;

        this.#root = document.createElement("div");
        this.#root.id = "d_sidebar";

        this.#build();
    }

    get element() {
        return this.#root;
    }

    destroy() {
        this.#unsubscribe.forEach((u) => u());
    }

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

    refresh(_lobbyData) {
        if (this.#activeTab === "players") {
            this.showPlayers(_lobbyData);
        }
    }

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
