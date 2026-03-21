import { firebaseIO } from "../../../firebase/FB_instance.mjs";
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
    serverID;

    /* **************************************** Constructor *****************************************/
    constructor(_lobbyData, _lobbyID) {
        this.databaseCache = _lobbyData;
        this.serverID = _lobbyID;
    }
}

let currentLobby = null;
/**
 * Function that initialises an instance of the LobbyReference class
 *
 * @param {Object} _lobbyData - An object containing the current lobby's data
 */
export function initializeLobbyReference(_lobbyData, _lobbyID) {
    currentLobby = new LobbyReference(_lobbyData, _lobbyID);
}

/**
 * A getter to return the record of the current lobby instance.
 *
 * @returns {Object} - Current lobby's data.
 */
export function getLobbyRecord() {
    return currentLobby.databaseCache;
}

/**
 * A getter for the Server ID.
 *
 * @returns {String} - Current lobby's server ID
 */
export function getServerID() {
    return currentLobby.serverID;
}

/**
 * update's the database cache with whatever the input is.
 *
 * @param {Object} _data - record of the database to update the cache.
 */
export function updateDatabaseCache(_data) {
    currentLobby.databaseCache = _data;
}
