import { firebaseIO } from "../firebase/FB_instance.mjs";
import Content from "./CNT_Content.mjs";

export default class Leaderboard extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_leaderboard";
    #mainContentContainer;
    #displayedLeaderboard = "cardsAgainstComputerScience";
    #listeners = [];

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (LeaderBoard Style Sheet)
    styleID = "LBSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Leaderboard.#secID);
        this.#mainContentContainer = document.createElement("section");
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((s) => s.remove());
        this.#listeners.forEach((func) => func());
    }

    async buildContent() {
        const NAV = super.createNavBar();
        this.section.append(NAV);

        const CONTAINER = document.createElement("div");
        CONTAINER.id = "leaderboardContainer";
        this.section.append(this.#mainContentContainer);

        this.#listeners.push(
            firebaseIO.subscribeToRecord(
                `/games/${this.#displayedLeaderboard}/scores`,
                async () => await this.#renderLeaderboard(CONTAINER),
            ),
        );

        this.section.append(CONTAINER);
    }

    /* **************************************** Private Methods *****************************************/
    async #renderLeaderboard(_section) {
        const TITLE = super.createTitle("Leaderboard");

        const CHOOSE_LB_CONTAINER = document.createElement("div");

        const CHOOSE_CACS = document.createElement("button");
        CHOOSE_CACS.type = "button";
        CHOOSE_CACS.textContent = "Cards Against Computer Science";
        CHOOSE_CACS.addEventListener("click", () => {
            this.#displayedLeaderboard = "cardsAgainstComputerScience";
            this.#renderLeaderboard(_section);
        });

        // ADD MINESWEEPER TIMES

        CHOOSE_LB_CONTAINER.append(CHOOSE_CACS);

        // Leaderboard itself
        const LEADERBOARD_TABLE = document.createElement("table");
        const HEADER_ROW = document.createElement("tr");
        HEADER_ROW.innerHTML = `
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
        `;
        HEADER_ROW.id = "tr_lbheader";
        const TABLE_BODY = document.createElement("tbody");

        LEADERBOARD_TABLE.append(HEADER_ROW, TABLE_BODY);

        await this.#populateLeaderboard(TABLE_BODY);

        _section.replaceChildren(TITLE, CHOOSE_LB_CONTAINER, LEADERBOARD_TABLE);
    }

    #createTableRow(_rank, _username, _score) {
        const TR = document.createElement("tr");

        const RANK = document.createElement("td");
        RANK.textContent = _rank;

        const USERNAME = document.createElement("td");
        USERNAME.textContent = _username;

        const SCORE = document.createElement("td");
        SCORE.textContent = _score;

        TR.append(RANK, USERNAME, SCORE);
        return TR;
    }

    async #populateLeaderboard(_tableBody) {
        _tableBody.replaceChildren();

        let scores = await firebaseIO.readRecord(
            `/games/${this.#displayedLeaderboard}/scores`,
        );
        scores = Object.entries(scores);
        scores.sort((a, b) => b[1].totalScore - a[1].totalScore);

        let rank = 1;
        for (const [uid, scoreObj] of scores) {
            const username = (
                await firebaseIO.readRecord(`/users/${uid}/public`)
            ).username;
            const ROW = this.#createTableRow(
                rank,
                username,
                scoreObj.totalScore,
            );
            rank++;
            _tableBody.append(ROW);
        }
    }
}
