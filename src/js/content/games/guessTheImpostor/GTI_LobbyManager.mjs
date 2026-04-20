import { firebaseIO } from "../../../firebase/FB_instance.mjs";
import { initializeLobbyReference } from "./GTI_LobbyReference.mjs";
import { getRecord } from "../../../accountManager/AM_User.mjs";

/**
 * @family GTI: Guess the Impostor, an extension of CNT: Content
 * @description A manager class for all game lobby related operations in the project.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class LobbyManager {
    /* **************************************** Private Fields *****************************************/
    #rootPath = `games/guessTheImpostor/servers`;

    /* **************************************** Constructor *****************************************/
    /**
     * LobbyManager constructor that sets initial event listeners for Lobby operations.
     *
     */
    constructor() {
        document.addEventListener("host", (event) => {
            this.#hostLobby(event.detail.content);
        });

        document.addEventListener("kick", (event) => {
            this.kickUser(event.detail.content);
        });

        document.addEventListener("sendMessage", (event) => {
            this.#sendMessage(event.detail.content, event.detail.message);
        });

        document.addEventListener("updateLobbyState", (event) => {
            firebaseIO.updateRecord(`${event.detail.content}`, {
                lobbyState: event.detail.newState,
            });
        });

        document.addEventListener("startGame", (event) => {
            this.#startGame(event);
        });
    }

    /* **************************************** Public Methods *****************************************/

    /* **************************************** Private Methods *****************************************/
    /**
     * Method to make a new lobby and write it to the DB
     *
     * @param {Object} _hostRecord
     */
    async #hostLobby(_hostRecord) {
        const serverUUID = crypto.randomUUID();
        const LOBBYDATA = this.#initialiseLobby(_hostRecord, serverUUID);

        // go into database and update the server list to include the new server
        await firebaseIO.updateRecord(`${this.#rootPath}/`, LOBBYDATA);

        // Initialise lobby reference with serverUUID
        initializeLobbyReference(serverUUID);

        // Join the created lobby
        await this.#joinServer(
            serverUUID,
            _hostRecord.uid,
            {
                name: _hostRecord.public.username,
                photoURL: _hostRecord.public.photoURL,
                isHost: true,
            },
            false,
        );

        // Navigate to lobby
        const NAVIGATE_TO_LOBBY = new CustomEvent("navigate", {
            detail: {
                content: "Lobby",
            },
        });

        document.dispatchEvent(NAVIGATE_TO_LOBBY);
    }

    /**
     * Initialises and returns the lobby data
     *
     * @param {Object} _hostRecord - record of the host
     * @param {String} _serverID - UUID of the server
     *
     * @returns {Object} -
     */
    #initialiseLobby(_hostRecord, _serverID) {
        return {
            [_serverID]: {
                host: {
                    uid: `${_hostRecord.uid}`,
                    name: `${_hostRecord.public.username}`,
                },
                lobbyState: "private",
                rules: {
                    maxPlayers: 6,
                    roundLengthSeconds: 30,
                    votingLengthSeconds: 30,
                    numOfImpostors: 1,
                    numberOfRounds: 5,
                },
                messages: {
                    "!welcome": {
                        content:
                            "Welcome to this game! Introduce yourself to the lobby!",
                        senderName: "Server",
                        uid: null,
                        timestamp: Date.now(),
                    },
                },
            },
        };
    }

    /**
     *
     * @param {String} _serverID - ID of server to connect to
     * @param {String} _playerID - ID of the player that is joining
     * @param {Object} _playerData - Data of the player joining
     */
    async #joinServer(_serverID, _playerID, _playerData, _navigate = true) {
        // Create path to the players node in the server
        const playerRefPath = `/games/guessTheImpostor/servers/${_serverID}/players/${_playerID}`;

        // Inject the player's details into the node
        await firebaseIO.updateRecord(playerRefPath, _playerData);

        // When user leaves lobby: Kill them from the lobby
        firebaseIO.removeDataOnDisconnect(playerRefPath);

        if (_navigate) {
            document.dispatchEvent(
                new CustomEvent("navigate", {
                    detail: { content: "Lobby" },
                }),
            );
        }
    }

    /**
     * Check if message is not empty/is valid and then send it to the database
     *
     * @param {String} _lobbyID
     * @param {String} _message
     *
     * @returns {void}
     */
    #sendMessage(_lobbyID, _message) {
        // Validate message
        if (!_message || _message.trim().length == 0) {
            console.error(`Attempted to write empty string: Rejected`);
            return;
        }

        let messageKey = firebaseIO.generateMessageKey(
            `/games/guessTheImpostor/servers/${_lobbyID}/messages`,
        );

        firebaseIO.updateRecord(
            `/games/guessTheImpostor/servers/${_lobbyID}/messages`,
            {
                [messageKey]: {
                    senderName: getRecord().public.username,
                    timestamp: Date.now(),
                    content: _message,
                },
            },
        );
    }

    /////////////////////////////////////// PLACE HOLDERS

    async kickUser(_user) {
        console.log(`User Kicked: ${_user}`);
    }

    #startGame(_startEvent) {
        console.log(_startEvent);
    }
}
