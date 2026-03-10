import { initializeFirebase } from "../firebase/FB_instance.mjs";

/**
 * @family AM: Account Manager
 * @description User is just an singleton module, where User is a class that stores the user instance.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class User {
    /* **************************************** Private Fields *****************************************/
    /* **************************************** Public Fields *****************************************/
    userRecord;

    /* **************************************** Constructor *****************************************/
    constructor(_userRecord) {
        this.userRecord = _userRecord;
    }
}

let userRecord = null;

export async function initializeUser(_userRecord) {
    if (userRecord == null) {
        userRecord = new User(_userRecord);
    }
}

export async function getRecord() {
    return userRecord;
}
