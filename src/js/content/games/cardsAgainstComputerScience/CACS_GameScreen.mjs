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

        this.section.append(TOP_BAR, SIDE_BAR, display);
    }

    /* **************************************** Private Methods *****************************************/
    /**
     * Creates a top bar with a round counter and timer
     *
     * @returns {HTMLDivElement} - Div containing the top bar and its various things.
     */
    #buildTopBar() {
        const BAR = document.createElement("div");

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
        SIDE_BAR.id = "d_sideBar";

        const CHAT_TAB = this.#createChatTab(SIDE_BAR);

        return SIDE_BAR;
    }

    #createChatTab(sideBarElement) {
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

    #buildCardCzarDisplay() {
        console.log("Czar display");

        // Section with prompts to choose from
        const choosePromptSection = document.createElement("section");
        choosePromptSection.id = "s_choosePrompt";

        this.#pickAPrompt(choosePromptSection);

        return choosePromptSection;
    }

    #pickAPrompt(_section) {
        // Choose from 4 prompts
        const PROMPTS_TO_CHOOSE_FROM = 4;
        let promptOptions = [];
        const getRandomIntIncl = (max) => Math.floor(Math.random() * (max + 1));

        while (promptOptions.length < PROMPTS_TO_CHOOSE_FROM) {
            const PROMPT_CARD = document.createElement("div");

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
                this.#promptChosen(PROMPT_CARD.dataset.key),
            );

            _section.append(PROMPT_CARD);
        }
    }

    /**
     * Handles logic for after the prompt is chosen by the Card Czar
     *
     * @param {String} _promptKey - Key of the prompt that the czar chose
     */
    #promptChosen(_promptKey) {}

    #buildStandardDisplay() {
        console.log("Standard");
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
