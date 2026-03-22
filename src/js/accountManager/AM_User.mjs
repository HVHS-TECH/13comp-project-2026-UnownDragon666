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
    currentUserRecord;

    /* **************************************** Constructor *****************************************/
    constructor(_userRecord) {
        this.currentUserRecord = _userRecord;
    }
}

let user = null;

/**
 * Function that initialises an instance of the User class
 *
 * @param {Object} _userRecord - An object containing the current user's database record
 */
export function initializeUser(_userRecord) {
    if (user == null) {
        user = new User(_userRecord);
    }
}

/**
 * A getter to return the database record of the current user instance.
 *
 * @returns {Object} - Current user's database record.
 */
export function getRecord() {
    return user.currentUserRecord;
}
