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

    /* **************************************** Public Fields *****************************************/

    /* **************************************** Constructor *****************************************/
    constructor(_auth) {
        this.#auth = _auth;
    }

    /* **************************************** Public Methods *****************************************/
}
