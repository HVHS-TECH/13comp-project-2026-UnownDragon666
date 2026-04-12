import { firebaseIO } from "../firebase/FB_instance.mjs";

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
    }

    /* **************************************** Private Methods *****************************************/
    /**
     * Attach listener to user's account that checks if the "deleted" flag has been set to true
     *
     */
    #attachDeletionListener(_uid) {
        let initialLoad = true;
        this.#unsubscribeToDeletionFlag = firebaseIO.subscribeToRecord(
            `/users/${_uid}/`,
            (data) => {
                if (initialLoad) {
                    initialLoad = false;
                    return;
                }
                this.#handleAccountDeletion(data);
            },
        );
    }

    /**
     * Once the deleted flag is triggered, it signals FirebaseIO to sign out the user if they are signed in
     *
     * @param {Object} data - The updated data to check if the deletion flag has been trigerred
     */
    #handleAccountDeletion(data) {
        if (data == null) {
            this.#unsubscribeToDeletionFlag?.();
            // Fire event signalling the signout to the FirebaseIO
            const EVENT = new CustomEvent("signout", {
                detail: {
                    reason: "User account has been deleted",
                },
            });
            document.dispatchEvent(EVENT);
        }
    }
}
