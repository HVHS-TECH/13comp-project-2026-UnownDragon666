import { getRecord } from "../accountManager/AM_User.mjs";
import { firebaseIO } from "../firebase/FB_instance.mjs";
import Content from "./CNT_Content.mjs";

/**
 * @family CNT: Content
 * @description Admin is a class for the content of the Admin page
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Admin extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_admin";
    #unsubscribeToPlayers;
    #unsubscribeToPlayer;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (ADmin Style Sheet)
    styleID = "ADSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Admin.#secID);
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        this.#unsubscribeToPlayers?.();
        this.#unsubscribeToPlayer?.();

        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        // Check if user is not an admin, and warn them.
        if (getRecord().isAdmin === false) {
            firebaseIO.updateRecord(`/users/${getRecord().uid}`, {
                warned: true,
            });
        }

        // Create nav var
        const NAV = super.createNavBar();
        this.section.appendChild(NAV);

        const MAIN_CONTENT = document.createElement("main");
        MAIN_CONTENT.id = "m_content";

        // Create the player list
        const PLAYERL_LIST = await this.#createPlayerList();
        PLAYERL_LIST.id = "s_playerListSection";
        MAIN_CONTENT.appendChild(PLAYERL_LIST);

        const CONTROLS_SECTION = document.createElement("section");
        CONTROLS_SECTION.id = "s_controlsSection";
        MAIN_CONTENT.appendChild(CONTROLS_SECTION);

        this.section.append(MAIN_CONTENT);
    }
    /* **************************************** Public Methods *****************************************/

    /* **************************************** Private Methods *****************************************/

    async #createPlayerList() {
        const LIST_SECTION = document.createElement("div");
        LIST_SECTION.id = "d_playerList";

        const PLAYER_LIST = document.createElement("ul");
        PLAYER_LIST.id = "u_playerList";

        this.#unsubscribeToPlayers = firebaseIO.subscribeToRecord(
            `/users`,
            (data) => {
                this.#updatePlayerList(data, PLAYER_LIST);
            },
        );

        LIST_SECTION.appendChild(PLAYER_LIST);

        return LIST_SECTION;
    }

    /**
     * Creates a list of the players in the current lobby on the page.
     *
     * @param {Object} _players - Object containing players in this server.
     * @param {Node<Element>} - The element to append players to.
     */
    #updatePlayerList(_players, _playerList) {
        _playerList.innerHTML = ``;

        // const NEW_PLAYER_LIST = document.createElement("ul");
        // NEW_PLAYER_LIST.id = "u_playerList";
        for (let [uid, playerData] of Object.entries(_players)) {
            let name = playerData.public.username;
            let pfpURL = playerData.public.photoURL;

            // create a list element with pfp, name and kick button (if the current user is the host)
            const LIST = document.createElement("li");
            LIST.classList.add("l_playerListElements");
            LIST.addEventListener("click", () =>
                this.#displayPlayerAdminControls(uid),
            );
            const PFP = document.createElement("img");
            PFP.src = pfpURL;
            PFP.classList.add("playerListPFPImages");
            const NAME = document.createElement("p");
            NAME.textContent = name;
            NAME.classList.add("playerListNameText");

            LIST.append(PFP, NAME);

            _playerList.appendChild(LIST);
        }
    }

    /**
     * Create the given user's admin controls and appends them to the DOM
     *
     * @param {String} _uid - UID of user whose controls to display
     */
    #displayPlayerAdminControls(_uid) {
        this.#unsubscribeToPlayer?.();
        let controls = null;
        this.#unsubscribeToPlayer = firebaseIO.subscribeToRecord(
            `/users/${_uid}`,
            async () => {
                let player = await firebaseIO.readRecord(`/users/${_uid}`);
                controls = this.#buildAdminControls(
                    player,
                    document.getElementById("s_controlsSection"),
                );

                const EVENT = new CustomEvent("append", {
                    detail: {
                        addendum: controls,
                        host: "m_content",
                    },
                });
                document.dispatchEvent(EVENT);
            },
        );
    }

    #buildAdminControls(_playerRec, _controlsSection) {
        _controlsSection.innerHTML = ``;

        const INFO_DIV = document.createElement("div");
        INFO_DIV.id = "d_infoDiv";

        const NAME_TITLE = super.createTitle(
            _playerRec.public.username,
            "p_playerNameTitle",
        );

        const PFP_IMAGE = document.createElement("img");
        PFP_IMAGE.src = _playerRec.public.photoURL;
        PFP_IMAGE.id = "i_playerPFPImage";

        INFO_DIV.append(NAME_TITLE, PFP_IMAGE);

        const NAME_EDIT_DIV = document.createElement("div");
        NAME_EDIT_DIV.id = "d_nameEditDiv";

        const NAME_EDIT_INPUT = super.createInput(
            "New username:",
            "Enter new username",
            "text",
            "i_newUsername",
            "i_newUsername",
            "d_newUsernameInputDiv",
        );

        const NAME_EDIT_SUBMIT = document.createElement("button");
        NAME_EDIT_SUBMIT.textContent = "Change";
        NAME_EDIT_SUBMIT.type = "button";
        NAME_EDIT_SUBMIT.style = "font-size: large;";
        NAME_EDIT_SUBMIT.addEventListener("click", () => {
            let newName = document.getElementById("i_newUsername").value;
            if (newName) {
                firebaseIO.updateRecord(`users/${_playerRec.uid}/public`, {
                    username: newName,
                });
            }
        });
        NAME_EDIT_DIV.append(NAME_EDIT_INPUT);

        const REMOVE_USER_ACCOUNT_DIV = document.createElement("div");
        REMOVE_USER_ACCOUNT_DIV.id = "d_removeAccountContainer";

        const REMOVE_USER_ACCOUNT_BUTTON = document.createElement("button");
        REMOVE_USER_ACCOUNT_BUTTON.id = "b_deleteAccount";
        REMOVE_USER_ACCOUNT_BUTTON.textContent = "DELETE USER";
        REMOVE_USER_ACCOUNT_BUTTON.addEventListener("click", () =>
            this.#confirmAccountDeletion(),
        );
        getRecord().uid == _playerRec.uid
            ? (REMOVE_USER_ACCOUNT_BUTTON.disabled = true)
            : (REMOVE_USER_ACCOUNT_BUTTON.disabled = false);

        REMOVE_USER_ACCOUNT_DIV.appendChild(REMOVE_USER_ACCOUNT_BUTTON);

        _controlsSection.append(
            INFO_DIV,
            NAME_EDIT_DIV,
            NAME_EDIT_SUBMIT,
            REMOVE_USER_ACCOUNT_DIV,
        );

        return _controlsSection;
    }

    #confirmAccountDeletion() {}
}
