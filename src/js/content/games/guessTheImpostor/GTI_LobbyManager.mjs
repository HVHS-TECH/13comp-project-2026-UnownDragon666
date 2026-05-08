import { firebaseIO } from "../../../firebase/FB_instance.mjs";
import {
    getLobbyRecord,
    initializeLobbyReference,
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

        document.addEventListener("updateLobbyState", (event) => {
            firebaseIO.updateRecord(`${event.detail.content}`, {
                lobbyState: event.detail.newState,
            });
        });

        document.addEventListener("startGame", (event) => {
            this.#startGame(event);
        });

        document.addEventListener("leaveGame", (event) => {
            this.#leaveGame(event.detail.content);
        });

        document.addEventListener("joinServer", (event) => {
            // Check if anything is null or undefined
            const { serverID, playerID, playerData } = event.detail ?? {};

            if (!serverID || !playerID || !playerData) {
                console.error(
                    "joinServer event is missing required detail properties",
                    event.detail,
                );
                return;
            }
            this.#joinServer(serverID, playerID, playerData);
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
                players: {
                    [_hostRecord.uid]: {
                        name: _hostRecord.public.username,
                        photoURL: _hostRecord.public.photoURL,
                        isHost: true,
                    },
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
     * @param {Boolean} _navigate - Flag of whether to navigate the user upon joining FOR DEBUG
     * @param {Boolean} _addPlayer - Flag of whether to add player to the lobby FOR DEBUG
     */
    async #joinServer(
        _serverID,
        _playerID,
        _playerData,
        _navigate = true,
        _addPlayer = true,
    ) {
        // Create path to the players node in the server
        const playerRefPath = `/games/guessTheImpostor/servers/${_serverID}/players/${_playerID}`;

        // Inject the player's details into the node
        if (_addPlayer) {
            await firebaseIO.updateRecord(playerRefPath, _playerData);
        }

        // If user disconnects: Kill them from the lobby
        firebaseIO.removeDataOnDisconnect(playerRefPath);

        initializeLobbyReference(_serverID);

        // create a listener to kill the lobby when everyone leaves
        firebaseIO.subscribeToRecord(
            `/games/guessTheImpostor/servers/${_serverID}/players`,
            (players) => {
                if (!players || Object.keys(players).length === 0) {
                    firebaseIO.deleteRecord(
                        `/games/guessTheImpostor/servers/${_serverID}`,
                    );
                }
            },
        );

        if (_navigate) {
            document.dispatchEvent(
                new CustomEvent("navigate", {
                    detail: { content: "Lobby" },
                }),
            );
        }
    }

    /**
     * removes user's record from the lobby's player list and
     *
     * @param {String} _lobbyID - Lobby to leave
     */
    async #leaveGame(_lobbyID) {
        console.log("left lobby");
        try {
            // If user is the last player in the server, kill the server
            let players = await firebaseIO.readRecord(
                `games/guessTheImpostor/servers/${_lobbyID}/players`,
            );
            if (Object.keys(players).length <= 1) {
                firebaseIO.deleteRecord(
                    `games/guessTheImpostor/servers/${_lobbyID}`,
                );
                return;
            }

            // Remove player from the players list of the lobby
            await firebaseIO.deleteRecord(
                `games/guessTheImpostor/servers/${_lobbyID}/players/${getRecord().uid}`,
            );
        } catch (error) {
            console.error(`Error leaving server: `, error);
        } finally {
            // Redirect to the lobbies page
            document.dispatchEvent(
                new CustomEvent("navigate", {
                    detail: {
                        content: "GuessTheImpostorLobbies",
                    },
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

    async #startGame(_startEvent) {
        console.log(_startEvent);
        await setupGame();
    }

    #setupGame() {
        let cache = getLobbyRecord();
        let getRandomIntIncl = (max) => {
            const MIN = 0;
            const MAX = Math.floor(max);
        };
        // Decide the impostor

        // Choose the questions (innocent and impostor)
        // Write those to the database
    }
}
