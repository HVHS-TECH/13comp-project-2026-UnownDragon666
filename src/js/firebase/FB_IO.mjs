import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    update,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

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
    auth;

    /* **************************************** Constructor *****************************************/
    /**
     * Constructor for the FirebaseIO class.
     * Creates an instance of the firebase app, initialises
     * the realtime database, and finally gets Auth once
     * the app is initialised.
     *
     * @param {Object} _fbConfig - Config of the firebase app to initialise
     */
    constructor(_fbConfig) {
        try {
            this.#app = initializeApp(_fbConfig);
            this.#database = getDatabase(this.#app);
        } catch (error) {
            throw new Error(`Firebase failed to initialise: ${error}`);
        } finally {
            this.auth = getAuth(this.#app);
        }
    }

    /* **************************************** Public Methods *****************************************/
    /**
     * Authenticates the user's log in/registration with Google.
     *
     * @returns {Promise<void>}
     */
    async authenticateWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });

            // Store result in variable, may come in handy later.
            let result = await signInWithPopup(this.auth, provider);
            this.auth = getAuth();

            let record = await this.readRecord("/users");
            if (this.auth.currentUser.uid in record) {
                let event = new CustomEvent("navigate", {
                    detail: {
                        content: "Profile",
                        eventInfo:
                            "User exists in database, redirect to profile",
                    },
                });
                document.dispatchEvent(event);
            } else {
                let event = new CustomEvent("updateState", {
                    detail: {
                        content: "buildRegistrationForm",
                        eventInfo:
                            "User does not exist in database, continue registration",
                    },
                });
                document.dispatchEvent(event);
            }
        } catch (error) {
            console.error(`Google Authentication Error: ${error}`);
        }
    }

    /**
     * Reads a record in the database and returns it as an object.
     *
     * @param {string} _path - Path to read from in database
     * @returns {object} snapshot.val() is an array containing the snippet of the DB that was read
     */
    async readRecord(_path) {
        const REF = ref(this.#database, _path);
        try {
            let snapshot = await get(REF);
            return snapshot.val();
        } catch (error) {
            console.error(`Read record failed: ${error}`);
        }
    }

    /**
     * Write/update a record to/in the Firebase realtime database
     *
     * @param {string} _path - Path to update
     * @param {Object} _data - Object containing the data to update
     * @param {Function} _callback - Optional callback after successful write
     *
     * @returns {Promise<void>}
     */
    async updateRecord(_path, _data, _callback = null) {
        const REF = ref(this.#database, _path);
        try {
            await update(REF, _data);
            if (typeof _callback === "function") {
                _callback();
            }
        } catch (error) {
            console.error(
                `Failed to update record @ ${_path}, w/ ${JSON.stringify(_data)}. See error: ${error}`,
            );
            throw error;
        }
    }
}
