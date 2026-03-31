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
    unsubscribeToRecord;

    /* **************************************** Constructor *****************************************/
    constructor(_userRecord, _unsubFunc) {
        this.currentUserRecord = _userRecord;
        this.unsubscribeToRecord = _unsubFunc;
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
        user = new User(_userRecord.firebaseIO);
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

/**
 * Generate new user cache
 */
export function generateUserRecordCache() {
    user;
}
