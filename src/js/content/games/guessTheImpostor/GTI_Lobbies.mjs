import Content from "../../CNT_Content.mjs";
import { getRecord } from "../../../accountManager/AM_User.mjs";
import { firebaseIO } from "../../../firebase/FB_instance.mjs";
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
    // The ID used to identify the stylesheet belonging to this page (Game Lobbies Style Sheet)
    styleID = "GLSS";
    tableBody;

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
        // Button container
        const BUTTON_CONTAINER = document.createElement("div");

        // Exit button
        const EXIT_BUTTON = super.createButton("EXIT", "navigate", "Games");

        // Host Lobby
        const HOST_BUTTON = document.createElement("button");
        HOST_BUTTON.type = "button";
        HOST_BUTTON.textContent = "Host Lobby";
        HOST_BUTTON.addEventListener("click", () => {
            // Create new lobby
            const EVENT = new CustomEvent("host", {
                detail: {
                    content: getRecord(),
                },
            });
            document.dispatchEvent(EVENT);
        });

        // Reload servers
        const RELOAD_BUTTON = document.createElement("button");
        RELOAD_BUTTON.type = "button";
        RELOAD_BUTTON.textContent = "Reload Servers";
        RELOAD_BUTTON.id = "b_reloadServers";
        RELOAD_BUTTON.addEventListener("click", () => {
            RELOAD_BUTTON.disabled = true;
            this.#populateServerList(this.tableBody);
        });

        BUTTON_CONTAINER.append(EXIT_BUTTON, HOST_BUTTON, RELOAD_BUTTON);
        this.section.appendChild(BUTTON_CONTAINER);

        /* Create server list table and subsection*/
        // Subsection
        const SERVER_LIST_SUBSECTION = document.createElement("section");
        SERVER_LIST_SUBSECTION.id = "s_serverListSubSec";

        // Table
        const SERVER_LIST_TABLE = document.createElement("table");
        SERVER_LIST_TABLE.id = "t_serverList";
        SERVER_LIST_SUBSECTION.appendChild(SERVER_LIST_TABLE);

        // Header row
        const HEADER_ROW = document.createElement("thead");
        HEADER_ROW.id = "thead_headers";
        HEADER_ROW.innerHTML = `
                        <tr>
							<th class="tableTitle" id="th_lobbyName">Lobby</th>
							<th class="tableTitle" id="th_host">Host</th>
							<th class="tableTitle" id="th_players">Players</th>
							<th class="tableTitle" id="th_pfpDisplay"></th>
							<th class="tableTitle" id="th_join">Join</th>                            
						</tr>
        `;

        const TABLE_BODY = document.createElement("tbody");
        TABLE_BODY.id = "tb_data";
        this.tableBody = TABLE_BODY;

        SERVER_LIST_TABLE.append(HEADER_ROW, TABLE_BODY);
        SERVER_LIST_SUBSECTION.append(SERVER_LIST_TABLE);
        this.#populateServerList(TABLE_BODY);

        this.section.append(SERVER_LIST_SUBSECTION);
    }

    /* **************************************** Private Methods *****************************************/
    async #populateServerList(_tableBody) {
        // Read server list from the database
        const SERVERS = await firebaseIO.readRecord(
            `games/guessTheImpostor/servers`,
        );

        // Empty the table
        _tableBody.innerHTML = "";

        if (SERVERS == null) {
            _tableBody.innerHTML = `<tr><td colspan="5">No live servers! Please make a new server.</td></tr>`;
            document.getElementById("b_reloadServers").disabled = false;
            return;
        }

        // Repopulate the table
        for (let [UUID, server] of Object.entries(SERVERS)) {
            console.log(UUID, server);

            // Make the table row
            let row = this.#makeTableRow(UUID, server);

            row ? _tableBody.appendChild(row) : null;
        }

        document.getElementById("b_reloadServers").disabled = false;
    }

    /**
     * Makes the row element for a given server
     *
     * @param {String} _serverID - ID of the server
     * @param {*} _serverDetails - Details of the server
     * @returns {HTMLTableRowElement}
     */
    #makeTableRow(_serverID, _serverDetails) {
        const ROW = document.createElement("tr");
        if (!_serverDetails.players) {
            console.log("Well... this server is dead... it should be gone!");
            return;
        }

        let currentPlayers = Object.keys(_serverDetails.players).length;

        ROW.appendChild(
            this.#addTableData(
                `${_serverDetails.host.name}'s Lobby`,
                "lobbyNames",
            ),
        );
        ROW.appendChild(
            this.#addTableData(`${_serverDetails.host.name}`, "hostNames"),
        );
        ROW.appendChild(
            this.#addTableData(
                `${currentPlayers}/${_serverDetails.rules.maxPlayers}`,
                "numberOfPlayers",
            ),
        );

        // PLACEHOLDER FOR PFP DISPLAY
        const PFP_DISPLAY = document.createElement("td");
        ROW.appendChild(PFP_DISPLAY);

        // Join button
        const JOIN_CELL = document.createElement("td");
        const JOIN_BUTTON = document.createElement("button");
        JOIN_BUTTON.type = "button";
        JOIN_BUTTON.textContent = "Join";
        JOIN_BUTTON.classList.add("joinServerButtons");
        JOIN_CELL.appendChild(JOIN_BUTTON);
        ROW.appendChild(JOIN_CELL);

        JOIN_BUTTON.addEventListener("click", async () => {
            // join the selected server (if the currentPlayer count is less than the maxPlayer count)
            const SERVER = await firebaseIO.readRecord(
                `games/guessTheImpostor/servers/${_serverID}`,
            );
            let currentPlayers = Object.keys(SERVER.players).length;

            if (!(currentPlayers < SERVER.rules.maxPlayers)) {
                alert("Sorry! This server is full.");
                console.log("WHY???");
                return;
            }

            const EVENT = new CustomEvent("joinServer", {
                detail: {
                    serverID: _serverID,
                    playerID: getRecord().uid,
                    playerData: {
                        name: getRecord().public.username,
                        photoURL: getRecord().public.photoURL,
                        isHost: false,
                    },
                },
            });
        });

        return ROW;
    }

    /**
     * Makes and returns a table data cell with provided information
     *
     * @param {String} _data - Data to add to cells
     * @param {String} _class - Class to give the td cell
     * @returns {HTMLTableCellElement}
     */
    #addTableData(_data, _class) {
        const DATA = document.createElement("td");
        DATA.textContent = _data;
        DATA.classList.add(_class);
        return DATA;
    }
}
