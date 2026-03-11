import AccountManager from "../accountManager/AM_AccountManager.mjs";
import { firebaseIO } from "../firebase/FB_instance.mjs";
import Content from "./CNT_Content.mjs";
import { initializeUser } from "../accountManager/AM_User.mjs";
/**
 * @family CNT: Content
 * @description Profile is a class for the content of the profile page
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Profile extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_profile";
    #accountManager;
    #currentUser;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (ProFile Style Sheet)
    styleID = "PFSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Profile.#secID);
        // Instantiate account manager instance
        this.#currentUser = firebaseIO.auth;
        this.#accountManager = new AccountManager(this.#currentUser);
    }

    /* **************************************** Public Methods *****************************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        // Create nav var
        const NAV = super.createNavBar();
        this.section.appendChild(NAV);

        // Create main content container
        const MAIN_CONTAINER = document.createElement("container");

        // Inside container, there are 2 sections
        // The "sidebar" (this is the profile bit)
        // And the "content" (this is the user's stats and friends)
        this.#buildProfileSideBar();

        this.#buildProfileContent();

        return document.getElementById(Profile.#secID);
    }

    /* **************************************** Private Methods *****************************************/
    /**
     * There are 3 parts to the side bar:
     * - the PFP (with a settings button in the corner)
     * - the userInfo
     * - the logout button
     */
    #buildProfileSideBar() {}

    /**
     * There are 2 parts to the content:
     * - The user's stats (and leaderboard rankings)
     * - and the user's friends container.
     */
    #buildProfileContent() {}
}
