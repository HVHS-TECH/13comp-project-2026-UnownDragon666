import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
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
     */
    async authenticateWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });

            // Store result in variable, may come in handy later.
            let result = await signInWithPopup(this.auth, provider);
            this.auth = getAuth().currentUser;

            let record = await this.readRecord("/users");
            if (this.auth.uid in record) {
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
}
