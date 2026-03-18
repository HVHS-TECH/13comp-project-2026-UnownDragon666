import { firebaseIO } from "../../../firebase/FB_instance.mjs";
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
    }

    /* **************************************** Public Methods *****************************************/
    /* **************************************** Private Methods *****************************************/
    async #hostLobby(_hostRecord) {
        // go into database and update the server list to include the new server
        firebaseIO.updateRecord(`${this.#rootPath}/${crypto.randomUUID()}`, {
            host: `${_hostRecord.uid}`,
            players: {
                [_hostRecord.uid]: _hostRecord.username,
            },
            lobbyState: "private",
            maxPlayers: 6,
        });
    }
}
