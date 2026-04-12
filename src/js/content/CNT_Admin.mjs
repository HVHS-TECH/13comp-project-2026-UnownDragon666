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
    #modal;

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
        const PLAYER_LIST = await this.#createPlayerList();
        PLAYER_LIST.id = "s_playerListSection";
        MAIN_CONTENT.appendChild(PLAYER_LIST);

        const CONTROLS_SECTION = document.createElement("section");
        CONTROLS_SECTION.id = "s_controlsSection";
        MAIN_CONTENT.appendChild(CONTROLS_SECTION);

        // Create Modal for extra info
        this.#modal = this.#createModal();
        MAIN_CONTENT.appendChild(this.#modal[0]);

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
     * Create the given user's admin controls and dispatches event to append it to the DOM
     *
     * @param {String} _uid - UID of user whose controls to display
     */
    #displayPlayerAdminControls(_uid) {
        this.#unsubscribeToPlayer?.();
        let controls = null;
        this.#unsubscribeToPlayer = firebaseIO.subscribeToRecord(
            `/users/${_uid}`,
            (player) => {
                if (!player) return;

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

    /**
     * Creates the admin controls section when a player in the player list is clicked.
     * These controls include:
     *  - Changing username
     *  - Checking account info
     *  - Deleting acocunt
     *  - Banning account
     *
     * @param {Object} _playerRec - record of player to open controls for
     * @param {Element} _controlsSection  - Section to append data to
     * @returns
     */
    #buildAdminControls(_playerRec, _controlsSection) {
        _controlsSection.innerHTML = ``;

        const INFO_DIV = this.#createInfoDiv(_playerRec);

        const [NAME_EDIT_DIV, NAME_EDIT_SUBMIT] =
            this.#createNameEditDiv(_playerRec);

        const MORE_DETAILS_DIV = this.#createMoreDetailsDiv(_playerRec);

        const REMOVE_AND_BAN_USER_ACCOUNT_DIV =
            this.#createUserRemovalButtons(_playerRec);

        _controlsSection.append(
            INFO_DIV,
            NAME_EDIT_DIV,
            NAME_EDIT_SUBMIT,
            MORE_DETAILS_DIV,
            REMOVE_AND_BAN_USER_ACCOUNT_DIV,
        );

        return _controlsSection;
    }

    /**
     * Creates the div containing player data
     *
     * @param {Object} _playerRec - Record of player whose information to display
     * @returns {HTMLDivElement}
     */
    #createInfoDiv(_playerRec) {
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

        return INFO_DIV;
    }

    /**
     * Creates a Div with an input and a submit button to update user's username
     *
     * @param {Object} _playerRec - Record of player whose username to update
     * @returns {HTMLDivElement}
     */
    #createNameEditDiv(_playerRec) {
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
        NAME_EDIT_SUBMIT.addEventListener("click", async () => {
            let newName = document.getElementById("i_newUsername").value;
            let record = await firebaseIO.readRecord(`users/${_playerRec.uid}`);
            if (!record) {
                alert("User does not exist.");
                return;
            }
            if (newName) {
                firebaseIO.updateRecord(`users/${_playerRec.uid}/public`, {
                    username: newName,
                });
            }
        });
        NAME_EDIT_DIV.append(NAME_EDIT_INPUT);

        return [NAME_EDIT_DIV, NAME_EDIT_SUBMIT];
    }

    /**
     * Create a div with a button that opens a modal displaying extra user information
     *
     * @param {Object} _playerRec - Record of player data
     * @returns {HTMLDivElement}
     */
    #createMoreDetailsDiv(_playerRec) {
        const CONTAINER = document.createElement("div");
        CONTAINER.id = "d_moreDetailsModalOpen";

        const MORE_DETAILS_BUTTON = document.createElement("button");
        MORE_DETAILS_BUTTON.id = "b_moreDetails";
        MORE_DETAILS_BUTTON.textContent = "User Info";
        MORE_DETAILS_BUTTON.addEventListener("click", () => {
            this.#displayModal(_playerRec);
        });

        CONTAINER.appendChild(MORE_DETAILS_BUTTON);

        return CONTAINER;
    }

    /**
     * Appends data to the modal, changes display style and adds event listeners
     * to close the modal when you click out or X
     *
     * @param {Object} _playerRec - Record of player's data to attach to the modal
     */
    #displayModal(_playerRec) {
        // Add Modal contents
        this.#modal[2].textContent = `${_playerRec.public.username}'s Details:`;
        this.#modal[3].textContent = `
                                UID: ${_playerRec.uid} \n
                                PUBLIC DETAILS: \n
                                Pronouns: ${_playerRec.public.pronouns} \n
                                \n 
                                PRIVATE DETAILS: \n
                                Email: ${_playerRec.private.email} \n
                                Phone Number: ${_playerRec.private.telNum} \n
                                Favourite Color: ${_playerRec.private.favoriteColor}`;
        this.#modal[0].style.display = "flex";

        // Register listener to close modal
        this.#modal[1].addEventListener(
            "click",
            () => {
                this.#modal[0].style.display = "none";
            },
            { once: true },
        );

        // Close modal when you click outside of it
        const OUTSIDE_CLICK_HANDLER = (event) => {
            if (event.target === this.#modal[0]) {
                this.#modal[0].style.display = "none";
                window.removeEventListener("click", OUTSIDE_CLICK_HANDLER);
            }
        };
        window.addEventListener("click", OUTSIDE_CLICK_HANDLER);
    }

    /**
     * Builds the HTML for a modal
     * This creates the modal's div, and its content like the title, description, and close span.
     *
     * @returns {[HTMLDivElement, HTMLSpanElement, HTMLHeadingElement, HTMLParagraphElement, HTMLButtonElement]} - Array of node elements that make up the modal.
     */
    #createModal() {
        const MODAL = document.createElement("div");
        MODAL.id = "d_modal";
        MODAL.classList.add("d_modal");
        MODAL.style.display = "none";

        const MODAL_CONTENT = document.createElement("div");
        MODAL_CONTENT.id = "d_modalContent";

        const MODAL_CLOSE = document.createElement("span");
        MODAL_CLOSE.innerHTML = `×`;
        MODAL_CLOSE.id = "s_modalClose";

        const MODAL_TITLE = document.createElement("h2");
        MODAL_TITLE.id = "h_modalTitle";

        const MODAL_DESC = document.createElement("p");
        MODAL_DESC.id = "p_modalDescription";
        MODAL_DESC.style.whiteSpace = "pre-wrap";

        MODAL_CONTENT.append(MODAL_CLOSE, MODAL_TITLE, MODAL_DESC);
        MODAL.appendChild(MODAL_CONTENT);

        return [MODAL, MODAL_CLOSE, MODAL_TITLE, MODAL_DESC];
    }

    /**
     * Creates buttons to remove or ban users, disables buttons if the user is an Admin
     *
     * @param {Object} _playerRec - Record of player to see if they are an admin
     * @returns {HTMLDivElement}
     */
    #createUserRemovalButtons(_playerRec) {
        const CONTAINER = document.createElement("div");
        CONTAINER.id = "d_removeAccountContainer";

        // Create the delete user button
        const REMOVE_USER_ACCOUNT_BUTTON = document.createElement("button");
        REMOVE_USER_ACCOUNT_BUTTON.id = "b_deleteAccount";
        REMOVE_USER_ACCOUNT_BUTTON.classList.add("accountManagementOptions");
        REMOVE_USER_ACCOUNT_BUTTON.textContent = "DELETE USER";
        REMOVE_USER_ACCOUNT_BUTTON.addEventListener("click", () =>
            this.#confirmAccountDeletion(_playerRec.uid),
        );
        _playerRec.isAdmin == true
            ? (REMOVE_USER_ACCOUNT_BUTTON.disabled = true)
            : (REMOVE_USER_ACCOUNT_BUTTON.disabled = false);

        CONTAINER.appendChild(REMOVE_USER_ACCOUNT_BUTTON);

        // Create ban user button
        const BAN_USER_BUTTON = document.createElement("button");
        BAN_USER_BUTTON.id = "b_banAccount";
        BAN_USER_BUTTON.classList.add("accountManagementOptions");
        BAN_USER_BUTTON.textContent = "BAN USER";
        BAN_USER_BUTTON.addEventListener("click", () =>
            this.#confirmUserBan(_playerRec.uid),
        );
        _playerRec.isAdmin == true
            ? (BAN_USER_BUTTON.disabled = true)
            : (BAN_USER_BUTTON.disabled = false);
        CONTAINER.appendChild(BAN_USER_BUTTON);

        return CONTAINER;
    }

    /**
     * Confirm whether this account should be deleted.
     * If confirmed, begin deletion process.
     *
     * @param {String} _uid - The user to be deleted's UID
     */
    #confirmAccountDeletion(_uid) {
        if (
            !confirm(
                "Are you sure you want to do this?\nTHIS ACTION IS IRREVERSIBLE.",
            )
        )
            return;

        console.warn(`USER ${_uid} WILL BE DELETED`);
        firebaseIO.deleteRecord(`/users/${_uid}`);
    }

    #confirmUserBan() {}
}
