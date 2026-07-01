import { getRecord } from "../accountManager/AM_User.mjs";
import { firebaseIO } from "../firebase/FB_instance.mjs";
import Content from "./CNT_Content.mjs";

export default class Leaderboard extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_leaderboard";
    #mainContentContainer;
    #displayedLeaderboard = "cardsAgainstComputerScience";
    #listeners = [];

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (LeaderBoarD Stylesheet)
    styleID = "LBDS";

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
        const TITLE = super.createTitle("Leaderboard", "leaderboardTitle");

        const CHOOSE_LB_CONTAINER = document.createElement("div");
        CHOOSE_LB_CONTAINER.id = "chooseLeaderboardContainer";

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
        const THEAD = document.createElement("thead");
        const HEADER_ROW = document.createElement("tr");
        HEADER_ROW.innerHTML = `
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
        `;
        HEADER_ROW.id = "tr_lbheader";
        THEAD.append(HEADER_ROW);
        const TABLE_BODY = document.createElement("tbody");

        LEADERBOARD_TABLE.append(THEAD, TABLE_BODY);

        await this.#populateLeaderboard(TABLE_BODY);

        const TABLE_WRAPPER = document.createElement("div");
        TABLE_WRAPPER.id = "leaderboardScroll";

        TABLE_WRAPPER.append(LEADERBOARD_TABLE);

        _section.replaceChildren(TITLE, CHOOSE_LB_CONTAINER, TABLE_WRAPPER);
    }

    #createTableRow(_rank, _username, _score, _url, _uid) {
        const TR = document.createElement("tr");

        const RANK = document.createElement("td");
        RANK.textContent = _rank;

        const USERNAME_DATA = document.createElement("td");
        const IMG = document.createElement("img");
        IMG.classList.add("img_pfpLb");
        IMG.src = _url;
        const USERNAME = document.createElement("p");
        USERNAME.textContent = _username;
        USERNAME_DATA.append(IMG, USERNAME);

        USERNAME.textContent = _username;

        const SCORE = document.createElement("td");
        SCORE.textContent = _score;

        TR.append(RANK, USERNAME_DATA, SCORE);
        _uid == getRecord().uid ? (TR.id = "currentUser") : null;
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
            const record = await firebaseIO.readRecord(`/users/${uid}/public`);
            let name = record.username ?? "deleted user";
            let photo;

            const ROW = this.#createTableRow(
                rank,
                name,
                scoreObj.totalScore,
                record.photoURL,
                uid,
            );
            rank++;
            _tableBody.append(ROW);
        }
    }
}
