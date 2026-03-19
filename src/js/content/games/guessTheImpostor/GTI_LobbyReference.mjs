/**
 * @family GTI: Guess the impostor
 * @description Lobby reference is just a singleton module, to store the instance of the lobby and caches of the db rec.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */

export default class LobbyReference {
    /* **************************************** Private Fields *****************************************/
    /* **************************************** Public Fields *****************************************/
    databaseCache;

    /* **************************************** Constructor *****************************************/
    constructor(_lobbyData) {
        this.databaseCache = _lobbyData;
    }
}

let currentLobby = null;
/**
 * Function that initialises an instance of the LobbyReference class
 *
 * @param {Object} _lobbyData - An object containing the current lobby's data
 */
export async function initializeLobbyReference(_lobbyData) {
    if (currentLobby == null) {
        currentLobby = new LobbyReference(_lobbyData);
    }
}

/**
 * A getter to return the record of the current lobby instance.
 *
 * @returns {Object} - Current lobby's data.
 */
export function getRecord() {
    return currentLobby.databaseCache;
}
