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

        return SIDE_BAR;
    }

    #buildCardCzarDisplay() {
        console.log("Czar display");

        // Section with prompts to choose from
    }

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
