import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    update,
    onValue,
    onDisconnect,
    remove,
    push,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { initializeUser } from "../accountManager/AM_User.mjs";
import AccountManager from "../accountManager/AM_AccountManager.mjs";

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
            this.auth = getAuth(this.#app);
        } catch (error) {
            throw new Error(`Firebase failed to initialise: ${error}`);
        } finally {
            // Initialise listeners for FB operations
            document.addEventListener("signout", () => this.#signOut());
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

            let record = await this.readRecord(
                `/users/${this.auth.currentUser.uid}`,
            );
            if (record) {
                await initializeUser(record);
                new AccountManager(this.auth.currentUser);
                let event = new CustomEvent("navigate", {
                    detail: {
                        content: "Profile",
                        eventInfo:
                            "User exists in database, redirect to profile",
                    },
                });
                document.dispatchEvent(event);
            } else {
                const NAVIGATE = new CustomEvent("navigate", {
                    detail: {
                        content: "Register",
                        state: "buildRegistrationForm",
                    },
                });
                document.dispatchEvent(NAVIGATE);
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

    /**
     * Removes a record from the database
     *
     * @param {String} _path - Path to delete information from
     * @param {Function} _callback - Optional callback function that runs after a successful delete
     */
    async deleteRecord(_path, _callback = null) {
        const REF = ref(this.#database, _path);
        try {
            await remove(REF);
            if (typeof _callback == "function") {
                _callback();
            }
        } catch (error) {
            console.error(`Failed to remove @ ${_path}: ${error}`);
        }
    }

    /**
     * Creates a listener that attaches to a record in the database
     *
     * @param {String} _path - Path to attach listener to.
     * @param {Function} _callback - Callback function, upon onValue changing.
     *
     * @returns {Function} - Unsubscribe function to remove the listener.
     */
    subscribeToRecord(_path, _callback) {
        const REF = ref(this.#database, _path);
        const UNSUBSCRIBE = onValue(REF, (snapshot) => {
            _callback(snapshot.val());
        });
        return UNSUBSCRIBE;
    }

    /**
     * Creates a unique message key for the chat system
     * Uses the timestamp to sort the keys.
     *
     * @param {String} _path Path to make a message ID for
     * @returns {String} The generated message key
     */
    generateMessageKey(_path) {
        const REF = ref(this.#database, _path);
        const KEY = push(REF);
        return KEY.key;
    }

    /**
     * Function ot remove data when a user disconnects from a lobby
     *
     * @param {String} _path - Path to attach on disconnect to
     */
    removeDataOnDisconnect(_path) {
        const REF = ref(this.#database, _path);
        onDisconnect(REF).remove();
    }

    /* **************************************** Private Methods *****************************************/
    /**
     * Sign Out the current user
     */
    #signOut() {
        signOut(this.auth);
        console.log("Signed out");
        const EVENT = new CustomEvent("navigate", {
            detail: {
                content: "Welcome",
            },
        });
        document.dispatchEvent(EVENT);
    }
}
