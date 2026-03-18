import Content from "../../CNT_Content.mjs";
/**
 * @family GTI: Guess the Impostor, an extension of CNT: Content
 * @description Guess the impostor game's lobby list.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */

export default class GuessTheImpostorLobbies extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_lobbies";

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (Game Lobby Style Sheet)
    styleID = "GLSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(GuessTheImpostorLobbies.#secID);
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        // Exit button
        super.createButton("EXIT", "navigate", "Games");

        // Host Lobby
        super.createButton("Host Lobby", "host", null);

        /* Create server list table and subsection*/
        // Subsection
        const SERVER_LIST_SUBSECTION = document.createElement("section");
        SERVER_LIST_SUBSECTION.id = "s_serverListSubSec";

        // Table
        const SERVER_LIST_TABLE = document.createElement("table");
        SERVER_LIST_TABLE.id = "t_serverList";
        SERVER_LIST_SUBSECTION.appendChild(SERVER_LIST_TABLE);

        // Header row
        const HEADER_ROW = document.createElement("tr");
        HEADER_ROW.id = "tr_headers";

        // Table datas
    }
}
