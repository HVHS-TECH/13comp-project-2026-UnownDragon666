import { firebaseIO } from "../../../firebase/FB_instance.mjs";
import {
    initializeLobbyReference,
    updateDatabaseCache,
} from "./GTI_LobbyReference.mjs";
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
    }

    /* **************************************** Public Methods *****************************************/
    /**
     * generate a cache of the current server (lobby) you're connected to.
     *
     * @param {string} _serverID - ID of the server
     */
    async generateCache(_serverID) {
        let snapshot = await firebaseIO.readRecord(
            `${this.#rootPath}/${_serverID}`,
        );

        updateDatabaseCache(snapshot);
    }

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

        // Read database and initialise lobby reference
        const RECORD = await firebaseIO.readRecord(
            `${this.#rootPath}/${serverUUID}`,
        );

        initializeLobbyReference(RECORD, serverUUID);

        // Redirect to the new lobby page
        const EVENT = new CustomEvent("navigate", {
            detail: {
                content: "Lobby",
            },
        });

        document.dispatchEvent(EVENT);
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
                players: {
                    [_hostRecord.uid]: {
                        name: _hostRecord.public.username,
                        photoURL: _hostRecord.public.photoURL,
                        isHost: true,
                    },
                },
                lobbyState: "private",
                rules: {
                    maxPlayers: 6,
                    roundLengthSeconds: 30,
                    numberOfGames: 1,
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

    async #joinServer(_serverID, _playerID, _playerData) {
        // Create path to the players node in the server
        const playerRefPath = `/games/guessTheImpostor/servers/${_serverID}/players/${_playerID}`;

        // Inject the player's details into the node
        await firebaseIO.updateRecord(playerRefPath, _playerData);

        // When user leaves lobby: Kill them from the lobby
        firebaseIO.removeDataOnDisconnect(playerRefPath);

        // Navigate to lobby
        const NAVIGATE_TO_LOBBY = new CustomEvent("navigate", {
            detail: {
                content: "Lobby",
            },
        });
    }
}
