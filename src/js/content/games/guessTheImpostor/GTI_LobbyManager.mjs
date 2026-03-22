import { firebaseIO } from "../../../firebase/FB_instance.mjs";
import {
    initializeLobbyReference,
    updateDatabaseCache,
} from "./GTI_LobbyReference.mjs";

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
    async #hostLobby(_hostRecord) {
        const serverUUID = crypto.randomUUID();
        console.log(_hostRecord);
        const lobbyData = {
            [serverUUID]: {
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
            },
        };

        // go into database and update the server list to include the new server
        await firebaseIO.updateRecord(`${this.#rootPath}/`, lobbyData);

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

    async kickUser(_user) {
        console.log(`User Kicked: ${_user}`);
    }
}
