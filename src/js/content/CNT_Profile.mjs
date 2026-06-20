import AccountManager from "../accountManager/AM_AccountManager.mjs";
import { getRecord, getUsername } from "../accountManager/AM_User.mjs";
import { firebaseIO } from "../firebase/FB_instance.mjs";
import Content from "./CNT_Content.mjs";
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
    #usernameElement;
    #accountManager;
    #currentUser;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (ProFile Style Sheet)
    styleID = "PFSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Profile.#secID);
        // Instantiate account manager instance
        this.#currentUser = firebaseIO.auth.currentUser;
        this.#accountManager = new AccountManager(this.#currentUser);
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
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
    /* **************************************** Public Methods *****************************************/

    /* **************************************** Private Methods *****************************************/
    /**
     * There are 3 parts to the side bar:
     * - the PFP (with a settings button in the corner)
     * - the userInfo
     * - the logout button
     */
    #buildProfileSideBar() {
        const PROFILE_CONTAINER = document.createElement("aside");

        const PFP = this.#buildPFPBox();

        const UPDATE = this.#buildUpdateContainer();

        PROFILE_CONTAINER.append(PFP, UPDATE);
        this.section.append(PROFILE_CONTAINER);
    }

    #buildPFPBox() {
        const WRAPPER = document.createElement("div");
        WRAPPER.id = "d_pfp";

        const PFP = document.createElement("img");
        PFP.src = getRecord().public.photoURL;
        PFP.id = "img_pfp";

        this.#usernameElement = super.createTitle(`${getUsername()}`);
        this.#usernameElement.id = "h_username";

        WRAPPER.append(PFP, this.#usernameElement);
        return WRAPPER;
    }

    /**
     * Builds the HTML for the section where you can update your name
     *
     * @returns {HTMLDivElement}
     */
    #buildUpdateContainer() {
        const WRAPPER = document.createElement("div");
        WRAPPER.id = "d_update";

        const CHANGE_NAME = super.createInput(
            "Change username:",
            "New username",
            "string",
            "i_nameChange",
            "i_nameChange",
            "d_changeName",
        );

        const UPDATE_BUTTON = super.createButton(
            "Update",
            "updateUserData",
            null,
            {
                dataPath: "public",
                dataKey: "username",
                getNewData: () => CHANGE_NAME.querySelector("input").value,
                handleUpdate: (() => {
                    let newName = CHANGE_NAME.querySelector("input").value;
                    if (
                        !newName ||
                        newName == (null || undefined) ||
                        newName.trim() == ""
                    ) {
                        console.error("Cannot write empty name!");
                        return;
                    }

                    if (newName.length > 20) {
                        console.error(`username too long: ${newName}`);
                        return;
                    }

                    this.#usernameElement.textContent = newName;
                }).bind(this),
            },
        );
        UPDATE_BUTTON.type = "button";

        WRAPPER.append(CHANGE_NAME, UPDATE_BUTTON);
        return WRAPPER;
    }

    /**
     * There are 2 parts to the content:
     * - The user's stats (and leaderboard rankings)
     * - and the user's friends container.
     */
    #buildProfileContent() {}
}
