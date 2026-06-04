import { firebaseIO } from "../../../firebase/FB_instance.mjs";
import { getLobbyRecord, getServerID } from "./CACS_LobbyReference.mjs";
import Content from "../../CNT_Content.mjs";
import { getRecord } from "../../../accountManager/AM_User.mjs";
/**
 * @family CACS: Cards Against Computer Science, an extension of CNT: Content
 * @description Cards against Computer Science game's game screen.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */

export default class CardsAgainstComputerScience extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_game";
    #lobbyPath;
    #cards;
    #gameState;

    // Unsubscribe to firebase listener functions
    #unsubscribe = [];

    // Timer
    #timerElement;
    #timerControls;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (Game Screen Style Sheet)
    styleID = "GSSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(CardsAgainstComputerScience.#secID);
        this.#lobbyPath = `/games/cardsAgainstComputerScience/servers/${getServerID()}`;
        let unsubscribeStart = firebaseIO.subscribeToRecord(
            `${this.#lobbyPath}/gameState`,
            (newData) => {
                if (!newData)
                    console.error(
                        "Impending Doomn Approaches (Something is wrong :<)",
                    );
                if (newData == "waiting") this.#gameState = "waiting";
                if (newData == "choosing") this.#gameState = "choosing";

                this.#updateDisplays();
            },
        );
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        this.#unsubscribe.forEach((unsubFunc) => {
            unsubFunc();
        });

        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        this.#cards = await firebaseIO.readRecord(`/cards`);

        // Components: Chat, Players list (to vote), the prompt, top bar
        const TOP_BAR = this.#buildTopBar();
        const SIDE_BAR = this.#buildSideBar();

        // If Card Czar, build Card Czar display, otherwise, build standard display
        let display;
        let record = getLobbyRecord();
        console.log(record, record.czar);
        record.czar == getRecord().uid
            ? (display = this.#buildCardCzarDisplay())
            : (display = this.#buildStandardDisplay());

        this.section.append(TOP_BAR, display, SIDE_BAR);
    }

    /* **************************************** Private Methods *****************************************/
    /**
     * Creates a top bar with a round counter and timer
     *
     * @returns {HTMLDivElement} - Div containing the top bar and its various things.
     */
    #buildTopBar() {
        const BAR = document.createElement("div");
        BAR.id = "d_topbar";

        const ROUND_COUNTER = this.#buildRoundCounter();
        const { timer, timerControls } = this.#buildRoundTimer();
        this.#timerControls = timerControls;

        BAR.append(ROUND_COUNTER, timer);
        return BAR;
    }

    /**
     * Build round counter, attach the listeners and return the element
     *
     * @returns {HTMLDivElement}
     */
    #buildRoundCounter() {
        const DIV = document.createElement("div");

        const LABEL = document.createElement("p");
        LABEL.id = "p_roundCounterLabel";
        LABEL.textContent = "ROUND";

        const COUNTER = document.createElement("p");
        COUNTER.id = "p_roundNumber";
        COUNTER.textContent = `${getLobbyRecord().currentRound} / ${getLobbyRecord().rules.numberOfRounds}`;

        DIV.append(LABEL, COUNTER);

        let unsubscribeRoundNumber = firebaseIO.subscribeToRecord(
            `${this.#lobbyPath}/currentRound`,
            (round) => {
                COUNTER.textContent = `${round} / ${getLobbyRecord().rules.numberOfRounds}`;
            },
        );

        this.#unsubscribe.push(unsubscribeRoundNumber);

        return DIV;
    }

    /**
     *  Creates the HTML for a timer, and creates a new TimerController to... control the timer :/
     *
     * @returns {Object<HTMLDivElement, TimerController>}
     */
    #buildRoundTimer() {
        const DIV = document.createElement("div");
        const TIMER = document.createElement("p");
        TIMER.textContent = "00:00";
        TIMER.id = "p_timer";
        DIV.append(TIMER);

        this.#timerElement = TIMER;

        let timerController = new TimerController();

        return { timer: DIV, timerControls: timerController };
    }

    /**
     * builds the sidebar with the two tabs: player list (with scores) and the chat.
     *
     * @returns {HTMLDivElement}
     */
    #buildSideBar() {
        const SIDE_BAR = document.createElement("div");
        SIDE_BAR.id = "d_sidebar";

        const TAB_ROW = document.createElement("div");
        TAB_ROW.classList.add("tab");

        const PLAYER_LIST_BUTTON = document.createElement("button");
        PLAYER_LIST_BUTTON.type = "button";
        PLAYER_LIST_BUTTON.textContent = "Players";
        PLAYER_LIST_BUTTON.classList.add("tabLinks", "active");

        const CHAT_TAB_BUTTON = document.createElement("button");
        CHAT_TAB_BUTTON.type = "button";
        CHAT_TAB_BUTTON.textContent = "Chat";
        CHAT_TAB_BUTTON.classList.add("tabLinks");

        TAB_ROW.append(PLAYER_LIST_BUTTON, CHAT_TAB_BUTTON);

        const TAB_CONTENT = document.createElement("div");

        const showPlayerList = () => {
            PLAYER_LIST_BUTTON.classList.add("active");
            CHAT_TAB_BUTTON.classList.remove("active");
            TAB_CONTENT.innerHTML = ``;
            TAB_CONTENT.append(this.#buildPlayerList());
        };

        const showChat = () => {
            CHAT_TAB_BUTTON.classList.add("active");
            PLAYER_LIST_BUTTON.classList.remove("active");
            TAB_CONTENT.innerHTML = ``;
            this.#openChatTab(TAB_CONTENT);
        };

        PLAYER_LIST_BUTTON.addEventListener("click", showPlayerList);
        CHAT_TAB_BUTTON.addEventListener("click", showChat);

        showPlayerList();

        SIDE_BAR.append(TAB_ROW, TAB_CONTENT);
        return SIDE_BAR;
    }

    #openChatTab(sideBarElement) {
        // Create event listener and assign unsubscribe function to the "this.#unsubscribeChat" private field.
        let unsubscribeChat = firebaseIO.subscribeToRecord(
            `/${this.#lobbyPath}/messages`,
            (messages) => {
                // Create a div with the tabContent class
                const TAB = document.createElement("div");
                TAB.classList.add("tabContent");

                const MESSAGES_CONTAINER = document.createElement("div");
                MESSAGES_CONTAINER.id = "d_messagesContainer";

                for (let message of Object.values(messages)) {
                    let messageDiv = document.createElement("div");
                    if (firebaseIO.auth.currentUser.uid == message.senderName) {
                        messageDiv.classList.add("sentByCurrentUser");
                    } else {
                        messageDiv.classList.add("sentByOtherUser");
                    }

                    const SENDER = document.createElement("p");
                    SENDER.classList.add("senderNames");
                    message.senderName == getRecord().public.username
                        ? (SENDER.textContent = "ME")
                        : (SENDER.textContent = message.senderName);

                    const MESSAGE = document.createElement("p");
                    MESSAGE.textContent = message.content;

                    messageDiv.append(SENDER, MESSAGE);
                    MESSAGES_CONTAINER.append(messageDiv);
                }

                TAB.append(MESSAGES_CONTAINER);

                // Create input div
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
                            message:
                                document.getElementById("i_sendMessages").value,
                        },
                    });
                    document.dispatchEvent(EVENT);
                });

                INPUT.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        BUTTON.click();
                        INPUT.focus();
                    }
                });

                MESSAGE_CONTAINER.append(INPUT, BUTTON);
                TAB.appendChild(MESSAGE_CONTAINER);

                if (sideBarElement.querySelector(".tabContent")) {
                    sideBarElement
                        .querySelector(".tabContent")
                        .replaceWith(TAB);
                } else {
                    sideBarElement.appendChild(TAB);
                }

                window.requestAnimationFrame(() => {
                    MESSAGES_CONTAINER.scrollTop =
                        MESSAGES_CONTAINER.scrollHeight;
                });
            },
        );
        this.#unsubscribe.push(unsubscribeChat);
    }

    #buildPlayerList() {
        const record = getLobbyRecord();

        const LIST = document.createElement("div");
        LIST.id = "d_playerList";

        for (const [uid, player] of Object.entries(record.players)) {
            const ROW = document.createElement("div");
            ROW.classList.add("playerRow");

            const AVATAR = document.createElement("img");
            AVATAR.classList.add("playerAvatar");
            AVATAR.src = player.photoURL;

            const USERNAME = document.createElement("p");
            USERNAME.classList.add("playerName");
            USERNAME.textContent = player.name;

            const SCORE = document.createElement("p");
            SCORE.classList.add("playerScore");
            console.log(player);
            SCORE.textContent = player.score;

            ROW.append(AVATAR, USERNAME, SCORE);
            LIST.append(ROW);
        }

        return LIST;
    }

    #buildCardCzarDisplay() {
        const MAIN = document.createElement("section");
        MAIN.id = "s_main";

        switch (this.#gameState) {
            case "waiting":
                // Section with prompts to choose from
                const CHOOSE_PROMPT_SECTION = document.createElement("section");
                CHOOSE_PROMPT_SECTION.id = "s_choosePrompt";

                this.#pickAPrompt(CHOOSE_PROMPT_SECTION);

                MAIN.append(CHOOSE_PROMPT_SECTION);
            case "choosing":
        }
        return MAIN;
    }

    /**
     * Chooses prompt card options to present to Card Czar, and creates cards to dislplay on page
     *
     * @param {HTMLSectionElement} _section Section to append the card choices to.
     */
    #pickAPrompt(_section) {
        // Choose from 4 prompts
        const PROMPTS_TO_CHOOSE_FROM = 4;
        let promptOptions = [];
        const getRandomIntIncl = (max) => Math.floor(Math.random() * (max + 1));

        while (promptOptions.length < PROMPTS_TO_CHOOSE_FROM) {
            const PROMPT_CARD = document.createElement("div");
            PROMPT_CARD.classList.add("promptCardChoice");

            // Choose a random prompt
            const entries = Object.entries(this.#cards.prompts);
            let [key, prompt] = entries[getRandomIntIncl(entries.length - 1)];
            if (promptOptions.some((p) => p[0] === key)) continue;
            promptOptions.push([key, prompt]);

            // Make Card
            const PROMPT = document.createElement("p");
            PROMPT.textContent = prompt.card;

            PROMPT_CARD.append(PROMPT);
            PROMPT_CARD.dataset.pick = prompt.pick;
            PROMPT_CARD.dataset.key = key;
            PROMPT_CARD.addEventListener("click", () =>
                this.#promptChosen(PROMPT_CARD.dataset.key, _section),
            );

            _section.append(PROMPT_CARD);
        }
    }

    /**
     * Handles logic for after the prompt is chosen by the Card Czar
     *
     * @param {String} _promptKey - Key of the prompt that the czar chose
     * @param {HTMLSectionElement} - Section element to empty after prompt is chosen
     */
    async #promptChosen(_promptKey, _section) {
        _section.innerHTML = ``;

        await firebaseIO.updateRecord(`${this.#lobbyPath}/`, {
            currentPromptKey: _promptKey,
            cardsToChoose: this.#cards.prompts[_promptKey].pick,
            gameState: "choosing",
        });

        const CHOSEN_PROMPT_CARD = document.createElement("div");
        CHOSEN_PROMPT_CARD.id = "d_chosenPrompt";

        const PROMPT = document.createElement("p");
        PROMPT.textContent = this.#cards.prompts[_promptKey].card;

        const CHOSEN_BY = document.createElement("p");
        CHOSEN_BY.textContent = `Chosen by ${getLobbyRecord().players[getLobbyRecord().czar].name}`;

        const PICK = document.createElement("p");
        PICK.textContent = `Pick: ${this.#cards.prompts[_promptKey].pick}`;

        CHOSEN_PROMPT_CARD.append(PROMPT, CHOSEN_BY, PICK);
        _section.append(CHOSEN_PROMPT_CARD);
    }

    #buildStandardDisplay() {
        console.log("Standard");

        const MAIN = document.createElement("section");
        MAIN.id = "s_main";

        const PROMPT_SECTION = document.createElement("section");
        this.#buildPromptSection(PROMPT_SECTION);

        const HAND_SECTION = document.createElement("section");

        MAIN.append(PROMPT_SECTION, HAND_SECTION);
        return MAIN;
    }

    #buildPromptSection(_section) {
        switch (this.#gameState) {
            case "waiting":
                const MESSAGE = document.createElement("p");
                MESSAGE.textContent =
                    "Please wait for the Czar to choose a prompt!";
                _section.append(MESSAGE);
                break;
            case "choosing":
                const CHOSEN_PROMPT_CARD = document.createElement("div");
                CHOSEN_PROMPT_CARD.id = "d_chosenPrompt";

                let promptKey = getLobbyRecord().currentPromptKey;

                const PROMPT = document.createElement("p");
                PROMPT.textContent = this.#cards.prompts[promptKey].card;

                const CHOSEN_BY = document.createElement("p");
                CHOSEN_BY.textContent = `Chosen by ${getLobbyRecord().players[getLobbyRecord().czar].name}`;

                const PICK = document.createElement("p");
                PICK.textContent = `Pick: ${this.#cards.prompts[promptKey].pick}`;

                CHOSEN_PROMPT_CARD.append(PROMPT, CHOSEN_BY, PICK);
                _section.append(CHOSEN_PROMPT_CARD);
                break;
        }

        return _section;
    }

    #updateDisplays() {
        // Change the displays
        if (getRecord().uid == getLobbyRecord().czar) {
            document.getElementById("");
        }
    }
}

class TimerController {
    #totalSeconds;
    #timer = null;

    constructor(_seconds) {
        this.#totalSeconds = _seconds;
    }

    updateDisplay(_timerElement) {
        const minutes = Math.floor(this.#totalSeconds / 60);
        const seconds = this.#totalSeconds % 60;
        _timerElement.innerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    startTimer(_timerElement, _startTime, _callback) {
        if (this.#timer) return;
        this.#totalSeconds = _startTime;
        this.#timer = setInterval(() => {
            this.#totalSeconds--;
            this.updateDisplay(_timerElement);
            if (this.#totalSeconds <= 0) this.stopTimer(_callback);
        }, 1000);
    }

    stopTimer(_callback) {
        clearInterval(this.#timer);
        this.#timer = null;
        if (typeof _callback == "function") _callback();
    }

    resetTimer(_timerElement, _seconds) {
        this.stopTimer();
        this.#totalSeconds = _seconds;
        this.updateDisplay(_timerElement);
    }
}
