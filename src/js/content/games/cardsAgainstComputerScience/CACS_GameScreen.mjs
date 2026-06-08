import { firebaseIO } from "../../../firebase/FB_instance.mjs";
import { getLobbyRecord, getServerID } from "./CACS_LobbyReference.mjs";
import Content from "../../CNT_Content.mjs";
import { getRecord } from "../../../accountManager/AM_User.mjs";
import Sidebar from "./components/CACS_Sidebar.mjs";
import GameLogic from "./components/CACS_GameLogic.mjs";
import GameRenderer from "./components/CACS_GameRenderer.mjs";

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
    #mainSection;
    #lobbyListener;

    #renderer;
    #gameLogic;
    #sidebar;

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

        document.removeEventListener("lobbyUpdated", this.#lobbyListener);

        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        this.#cards = await firebaseIO.readRecord("/cards");

        this.#mainSection = document.createElement("section");
        this.#mainSection.id = "s_main";

        this.#gameLogic = new GameLogic(this.#cards, this.#lobbyPath);

        this.#renderer = new GameRenderer(this.#cards, this.#gameLogic);

        this.#sidebar = new Sidebar(this.#lobbyPath);

        this.#lobbyListener = (event) => {
            this.#updateDisplays(event.detail);
        };

        document.addEventListener("lobbyUpdated", this.#lobbyListener);

        this.section.append(
            this.#buildTopBar(),
            this.#mainSection,
            this.#sidebar.element,
        );

        this.#updateDisplays(getLobbyRecord());
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
        // const { timer, timerControls } = this.#buildRoundTimer();
        // this.#timerControls = timerControls;

        BAR.append(ROUND_COUNTER);
        // BAR.append(timer);
        return BAR;
    }

    /**
     * Build round counter, attach the listeners and return the element
     *
     * @returns {HTMLDivElement}
     */
    #buildRoundCounter() {
        const DIV = document.createElement("div");
        DIV.id = "d_roundCounter";

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
    // #buildRoundTimer() {
    //     const DIV = document.createElement("div");
    //     const TIMER = document.createElement("p");
    //     TIMER.textContent = "00:00";
    //     TIMER.id = "p_timer";
    //     DIV.append(TIMER);

    //     this.#timerElement = TIMER;

    //     let timerController = new TimerController();

    //     return { timer: DIV, timerControls: timerController };
    // }

    // startTimestampTimer(element, endTime, callback) {
    //     this.stopTimer();

    //     this.#timer = setInterval(() => {
    //         const remaining = Math.max(
    //             0,
    //             Math.floor((endTime - Date.now()) / 1000),
    //         );

    //         this.#totalSeconds = remaining;

    //         this.updateDisplay(element);

    //         if (remaining <= 0) this.stopTimer(callback);
    //     }, 250);
    // }

    // #updateTimer(_lobbyData) {
    //     switch (_lobbyData.gameState) {
    //         case "choosing":

    //         case "judging":
    //             this.#timerControls.startTimestampTimer(
    //                 this.#timerElement,
    //                 _lobbyData.roundEndsAt,
    //             );

    //             break;

    //         default:
    //             this.#timerControls.resetTimer(this.#timerElement, 0);
    //     }
    // }

    #updateDisplays(_lobbyData) {
        this.#mainSection.innerHTML = "";

        const currentUserID = getRecord().uid;

        const content =
            _lobbyData.czar === currentUserID
                ? this.#renderer.renderCzar(_lobbyData)
                : this.#renderer.renderPlayer(_lobbyData, currentUserID);

        this.#mainSection.append(content);

        this.#sidebar.refresh(_lobbyData);

        // this.#updateTimer(_lobbyData);
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
