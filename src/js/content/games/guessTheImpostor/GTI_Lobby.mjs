import { getRecord } from "../../../accountManager/AM_User.mjs";
import { firebaseIO } from "../../../firebase/FB_instance.mjs";
import Content from "../../CNT_Content.mjs";
import { getLobbyRecord } from "./GTI_LobbyReference.mjs";

/**
 * @family GTI: Guess the Impostor, an extension of CNT: Content
 * @description The content for the current lobby that the user is in.
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Lobby extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_lobby";

    // Unsubscribe to listener functions
    #unsubscribePlayers;
    #unsubscribeRules;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (Lobby Page Style Sheet)
    styleID = "LBSS";
    lobbyID;

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Lobby.#secID);
        this.lobbyID = Object.keys(getLobbyRecord)[0];
        // Set up listeners
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        // The left half of the page is a list of the players
        // It will contain the option to invite people, either friends, or by username.
        // and the option to kick a user (for the host)
        const PLAYER_SECTION = document.createElement("section");

        const PLAYER_LIST = document.createElement("ul");
        PLAYER_LIST.id = "u_playerList";

        // Add players to the player list.
        this.#unsubscribePlayers = firebaseIO.subscribeToRecord();

        // The right half of the page is a block containing a few tabs
        // The first tab will be the chat, just a simple chat system for the players in the lobby.
        // The second tab will be the host controls. i.e. controlling the max number of players,
        // the no. of rounds, and round length and stuff. (also the ability to make the lobby public)
    }
}
