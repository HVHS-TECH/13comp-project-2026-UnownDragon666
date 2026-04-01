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
        MAIN_CONTENT.appendChild(PLAYERL_LIST);

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
                console.log("subscribeToRecord callback fired:", data);
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
}
