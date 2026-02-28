/* 
    CNT_Login.mjs

    Login is a class for the content of the login page

    Written in Term One 2026 for programming/database project
    By: Idrees Munshi
*/
import Content from "./CNT_Content.mjs";

export default class Login extends Content {
    /* Private Fields */
    static #secID;

    constructor() {
        super(Login.#secID);
    }
}
