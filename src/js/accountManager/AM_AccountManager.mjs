import { firebaseIO } from "../firebase/FB_instance.mjs";
import { getRecord } from "./AM_User.mjs";

/**
 * @family AM: Account Manager
 * @description Account Manager is a class made to manage
 * account operations. These include such things as updating the
 * user details/logout/deleting account, etc.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class AccountManager {
    /* **************************************** Private Fields *****************************************/
    #auth;
    #unsubscribeToDeletionFlag;

    /* **************************************** Public Fields *****************************************/

    /* **************************************** Constructor *****************************************/
    constructor(_auth) {
        this.#auth = _auth;
        this.#attachDeletionListener(_auth.uid);

        document.addEventListener(
            "updateUserData",
            this.#updateUserData.bind(this),
        );
    }

    /* **************************************** Private Methods *****************************************/
    /**
     * Attach listener to user's account that checks if the "deleted" flag has been set to true
     *
     * @param {String} _uid
     */
    #attachDeletionListener(_uid) {
        this.#unsubscribeToDeletionFlag = firebaseIO.subscribeToRecord(
            `/users/${_uid}/deleted`,
            (data) => {
                if (data == false) return;
                this.#handleAccountDeletion(data);
            },
        );
    }

    /**
     * Once the deleted flag is triggered, it signals FirebaseIO to sign out the user if they are signed in
     *
     */
    #handleAccountDeletion() {
        this.#unsubscribeToDeletionFlag?.();
        // Fire event signalling the signout to the FirebaseIO
        const EVENT = new CustomEvent("signout", {
            detail: {
                reason: "User account has been deleted",
            },
        });
        document.dispatchEvent(EVENT);
    }

    /**
     * Updates user data, called by the event listener in the consructor, which waits for the "updateUserData" CustomEvent.
     *
     * @param {Object} _event The data update event, with details of what to update, and what to update with, as well as a handeUpdate() method to deal with the new update
     */
    #updateUserData(_event) {
        const { dataPath, dataKey, getNewData } = _event.detail;
        const newData = getNewData();
        if (!this.#auth?.uid || !dataPath || !dataKey) {
            console.error("Missing data for update:", {
                uid: this.#auth?.uid,
                dataPath,
                dataKey,
            });
            return;
        }
        const BASE_PATH = `users/${this.#auth.uid}/${dataPath}/`;
        try {
            firebaseIO.updateRecord(BASE_PATH, { [dataKey]: newData });
            _event.detail.handleUpdate?.();
        } catch (error) {
            console.error(error);
        }
    }
}
