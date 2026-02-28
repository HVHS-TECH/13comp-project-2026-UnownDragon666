import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

/**
 * @family FB: Firebase
 * @description FirebaseIO is a class that handles all Firebase operations.
 * All Firebase read/writes, queries, authentication and initialisation
 * are handled here.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */

export default class FirebaseIO {
    /* **************************************** Private Fields *****************************************/
    #app;
    #database;

    /* **************************************** Public Fields *****************************************/

    /* **************************************** Constructor *****************************************/
    constructor(_fbConfig) {
        try {
            this.#app = initializeApp(_fbConfig);
            this.#database = getDatabase(this.#app);
        } catch (error) {
            throw new Error(`Firebase failed to initialise: ${error}`);
        }
    }

    /* **************************************** Public Methods *****************************************/
}
