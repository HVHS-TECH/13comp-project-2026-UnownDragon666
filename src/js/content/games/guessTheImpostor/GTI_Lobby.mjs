import { getRecord } from "../../../accountManager/AM_User.mjs";
import { firebaseIO } from "../../../firebase/FB_instance.mjs";
import Content from "../../CNT_Content.mjs";
import { getLobbyRecord, getServerID } from "./GTI_LobbyReference.mjs";

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
    #lobbyPath;

    // Unsubscribe to listener functions
    #unsubscribePlayers;
    #unsubscribeRules;
    #unsubscribeChat;

    // Rules constraints
    static #MIN_PLAYERS = 3;
    static #MAX_PLAYERS = 12;
    static #MIN_ROUND_LENGTH = 15;
    static #MAX_ROUND_LENGTH = 60;
    static #MIN_VOTING_LENGTH = 30;
    static #MAX_VOTING_LENGTH = 60;
    static #MIN_IMPOSTORS = 1;
    static #MAX_IMPOSTORS = 3;
    static #MIN_ROUNDS = 1;
    static #MAX_ROUNDS = 10;
    static #MIN_NON_IMPOSTOR_PLAYERS = 2;

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (LoBby Style Sheet)
    styleID = "LBSS";
    lobbyID;

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Lobby.#secID);
        this.lobbyID = getServerID();
        this.#lobbyPath = `/games/guessTheImpostor/servers/${this.lobbyID}`;
    }

    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        this.#unsubscribePlayers?.();
        this.#unsubscribeRules?.();

        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        // The left half of the page is a list of the players with an exit button over top.
        // It will contain the option to invite people, either friends, or by username.
        // and the option to kick a user (for the host)
        const PLAYER_SECTION = document.createElement("section");
        PLAYER_SECTION.id = "s_playerSection";
        const EXIT_BUTTON = super.createButton(
            "EXIT",
            "navigate",
            "GuessTheImpostorLobbies",
        );
        EXIT_BUTTON.id = "b_exitButton";

        const PLAYER_LIST = document.createElement("ul");
        PLAYER_LIST.id = "u_playerList";

        PLAYER_SECTION.append(EXIT_BUTTON, PLAYER_LIST);

        // Add players to the player list.
        // This will create an event listener with onValue, which always runs once when instantiated.
        this.#unsubscribePlayers = firebaseIO.subscribeToRecord(
            `${this.#lobbyPath}/players`,
            (data) => {
                this.#updatePlayerList(data, PLAYER_LIST);
            },
        );

        // The right half of the page is a block containing a few tabs
        // The first tab will be the chat, just a simple chat system for the players in the lobby.
        // The second tab will be the host controls. i.e. controlling the max number of players,
        // the no. of rounds, and round length and stuff. (also the ability to make the lobby public)
        const TABS_SECTION = document.createElement("section");
        TABS_SECTION.id = "s_tabsSection";

        const MESSAGE_SECTION = document.createElement("div");
        MESSAGE_SECTION.classList.add("tabContent");

        const TABS_CONTAINER = document.createElement("div");
        TABS_CONTAINER.classList.add("tab");

        const CHAT_TAB_BUTTON = document.createElement("button");
        CHAT_TAB_BUTTON.type = "button";
        CHAT_TAB_BUTTON.textContent = "Chat";
        CHAT_TAB_BUTTON.classList.add("tabLinks");
        CHAT_TAB_BUTTON.addEventListener("click", () => {
            this.#openChatTab();
        });

        const RULES_TAB_BUTTON = document.createElement("button");
        RULES_TAB_BUTTON.type = "button";
        RULES_TAB_BUTTON.textContent = "Rules";
        RULES_TAB_BUTTON.classList.add("tabLinks");
        RULES_TAB_BUTTON.addEventListener("click", () => {
            this.#openRulesTab();
        });

        const INSTRUCTIONS_TAB_BUTTON = document.createElement("button");
        INSTRUCTIONS_TAB_BUTTON.type = "button";
        INSTRUCTIONS_TAB_BUTTON.textContent = "Instructions";
        INSTRUCTIONS_TAB_BUTTON.classList.add("tabLinks");
        INSTRUCTIONS_TAB_BUTTON.addEventListener("click", () => {
            this.#openInstructionsTab();
        });

        TABS_CONTAINER.append(CHAT_TAB_BUTTON, RULES_TAB_BUTTON);
        TABS_SECTION.append(TABS_CONTAINER);

        this.section.append(PLAYER_SECTION, TABS_SECTION);
    }

    /* **************************************** Private Methods *****************************************/
    /**
     * Creates a list of the players in the current lobby on the page.
     *
     * @param {Object} _players - Object containing players in this server.
     * @param {Node<Element>} - The element to append players to.
     */
    #updatePlayerList(_players, _playerList) {
        if (!_players) return;

        _playerList.innerHTML = ``;

        // const NEW_PLAYER_LIST = document.createElement("ul");
        // NEW_PLAYER_LIST.id = "u_playerList";
        for (let [uid, playerData] of Object.entries(_players)) {
            let name = playerData.name;
            let pfpURL = playerData.photoURL;

            // create a list element with pfp, name and kick button (if the current user is the host)
            const LIST = document.createElement("li");
            const PFP = document.createElement("img");
            PFP.src = pfpURL;
            PFP.classList.add("playerListPFPImages");
            const NAME = document.createElement("p");
            NAME.textContent = name;
            NAME.classList.add("playerListNameText");

            LIST.append(PFP, NAME);

            // If user is host
            if (getRecord().uid == getLobbyRecord().host.uid) {
                // If the uid is not the current user's
                if (uid != getRecord().uid) {
                    const KICK_BUTTON = document.createElement("button");
                    KICK_BUTTON.type = "button";
                    KICK_BUTTON.addEventListener("click", () => {
                        const KICK_EVENT = new CustomEvent("kick", {
                            detail: {
                                content: uid,
                            },
                        });
                        document.dispatchEvent(KICK_EVENT);
                    });
                    LIST.appendChild(KICK_BUTTON);
                }
            }
            _playerList.appendChild(LIST);
        }
    }

    /**
     * Creates an event listener on the path that updates the tab whenever
     * a message is uploaded to server.
     *
     * Creates the tab elements as well as messages.
     */
    async #openChatTab() {
        // If rules were opened, unsubscribe to that listener and empty the tab.
        this.#unsubscribeRules?.();

        // Create event listener and assign unsubscribe function to the "this.#unsubscribeChat" private field.
        this.#unsubscribeChat = firebaseIO.subscribeToRecord(
            `/games/guessTheImpostor/servers/${this.lobbyID}/messages`,
            (messages) => {
                // Create a div with the tabContent class
                const TAB = document.createElement("div");
                TAB.classList.add("tabContent");

                for (let message of Object.values(messages)) {
                    let messageDiv = document.createElement("div");
                    if (firebaseIO.auth.currentUser.uid == message.senderName) {
                        messageDiv.classList.add("sentByCurrentUser");
                    } else {
                        messageDiv.classList.add("sentByOtherUser");
                    }

                    const SENDER = document.createElement("p");
                    SENDER.classList.add("senderNames");
                    SENDER.textContent = message.senderName;

                    const MESSAGE = document.createElement("p");
                    MESSAGE.textContent = message.content;

                    messageDiv.append(SENDER, MESSAGE);
                    TAB.append(messageDiv);
                }
                // Create input div
                const MESSAGE_CONTAINER = document.createElement("div");
                MESSAGE_CONTAINER.id = "d_messageInputContainer";

                const INPUT = document.createElement("input");
                INPUT.id = "i_sendMessages";

                const BUTTON = document.createElement("button");
                BUTTON.type = "button";
                BUTTON.textContent = "submit";
                BUTTON.addEventListener("click", () => {
                    const EVENT = new CustomEvent("sendMessage", {
                        detail: {
                            content: this.lobbyID,
                            message:
                                document.getElementById("i_sendMessages").value,
                        },
                    });
                    document.dispatchEvent(EVENT);
                });

                MESSAGE_CONTAINER.append(INPUT, BUTTON);
                TAB.appendChild(MESSAGE_CONTAINER);

                if (document.querySelector(".tabContent")) {
                    document.querySelector(".tabContent").replaceWith(TAB);
                } else {
                    document.getElementById("s_tabsSection").appendChild(TAB);
                }
            },
        );
    }

    /**
     * Opens the game rules tab
     * This allows the host to edit the game's various options before the game starts.
     *
     * Rules:
     *      - maxPlayers: max number of players allowed in lobby
     *          - Greater than or equal to three
     *          - Less than or equal to 12
     *          - Must be greater than the current number of users in the lobby.
     *          i.e. if a lobby has 7 players, you can't reduce maxPlayers to less than 7
     *
     *      - roundLengthSeconds: The max number of time a player has before they must submit an
     *                            answer
     *          - Greater than or equal to 15 seconds
     *          - Less than or equal to 60 seconds
     *
     *      - votingLengthSeconds: How long the players have to vote for the impostor
     *          - Greater than or equal to 30 seconds
     *          - Less than or equal to 60 seconds
     *
     *      - numOfImpostors:
     *          - Greater than or equal to one
     *          - less than or equal to 3 (for a lobby with more than 5 players)
     *
     *      - numberOfRounds: Number of times the game will be played before the game is completed
     *                        and the scores are submitted
     *          - Greater than or equal to 1
     *          - Less than or equal to 10
     *
     */
    #openRulesTab() {
        this.#unsubscribeChat?.();

        this.#unsubscribeRules = firebaseIO.subscribeToRecord(
            `/games/guessTheImpostor/servers/${this.lobbyID}/rules`,
            (rules) => {
                // Create a div with the tabContent class
                const TAB = document.createElement("div");
                TAB.classList.add("tabContent");

                const FORM = document.createElement("form");
                FORM.id = "f_rules";

                // MaxPlayers gamerule
                const MAX_PLAYERS = super.createInput(
                    "Max Players:",
                    rules.maxPlayers,
                    "number",
                    "i_maxPlayers",
                    "i_maxPlayers",
                    "d_maxPlayers",
                    rules.maxPlayers,
                );
                MAX_PLAYERS.querySelector("input").min = Lobby.#MIN_PLAYERS;
                MAX_PLAYERS.querySelector("input").max = Lobby.#MAX_PLAYERS;

                const ROUND_LENGTH = super.createInput(
                    "Round Length:",
                    rules.roundLengthSeconds,
                    "number",
                    "i_roundLength",
                    "i_roundLength",
                    "d_roundLength",
                    rules.roundLengthSeconds,
                );
                ROUND_LENGTH.querySelector("input").min =
                    Lobby.#MIN_ROUND_LENGTH;
                ROUND_LENGTH.querySelector("input").max =
                    Lobby.#MAX_ROUND_LENGTH;

                const VOTING_LENGTH = super.createInput(
                    "Voting Length (seconds):",
                    rules.votingLengthSeconds,
                    "number",
                    "i_votingLength",
                    "i_votingLength",
                    "d_votingLength",
                    rules.votingLengthSeconds,
                );
                VOTING_LENGTH.querySelector("input").min =
                    Lobby.#MIN_VOTING_LENGTH;
                VOTING_LENGTH.querySelector("input").max =
                    Lobby.#MAX_VOTING_LENGTH;

                const NUM_IMPOSTORS = super.createInput(
                    "Number of Impostors:",
                    rules.numOfImpostors,
                    "number",
                    "i_numOfImpostors",
                    "i_numOfImpostors",
                    "d_numOfImpostors",
                    rules.numOfImpostors,
                );
                NUM_IMPOSTORS.querySelector("input").min = Lobby.#MIN_IMPOSTORS;
                NUM_IMPOSTORS.querySelector("input").max = Lobby.#MAX_IMPOSTORS;

                const NUM_ROUNDS = super.createInput(
                    "Number of Rounds:",
                    rules.numberOfRounds,
                    "number",
                    "i_numberOfRounds",
                    "i_numberOfRounds",
                    "d_numberOfRounds",
                    rules.numberOfRounds,
                );
                NUM_ROUNDS.querySelector("input").min = Lobby.#MIN_ROUNDS;
                NUM_ROUNDS.querySelector("input").max = Lobby.#MAX_ROUNDS;

                // Submit new rules button
                const SUBMIT_NEW_RULES = document.createElement("button");
                SUBMIT_NEW_RULES.type = "button";
                SUBMIT_NEW_RULES.id = "b_submitRules";
                SUBMIT_NEW_RULES.textContent = "Submit";
                SUBMIT_NEW_RULES.addEventListener("click", () => {
                    this.#validateNewRules(FORM, getLobbyRecord());
                });

                getRecord().uid == getLobbyRecord().host.uid
                    ? (SUBMIT_NEW_RULES.disabled = false)
                    : (SUBMIT_NEW_RULES.disabled = true);

                FORM.append(
                    MAX_PLAYERS,
                    ROUND_LENGTH,
                    VOTING_LENGTH,
                    NUM_IMPOSTORS,
                    NUM_ROUNDS,
                );

                TAB.append(FORM, SUBMIT_NEW_RULES);

                if (document.querySelector(".tabContent")) {
                    document.querySelector(".tabContent").replaceWith(TAB);
                } else {
                    document.getElementById("s_tabsSection").appendChild(TAB);
                }
            },
        );
    }

    #validateNewRules(_form, _lobbyRec) {
        for (const rule of _form.querySelectorAll("input")) {
            if (isNaN(rule.value) || rule.value === "") {
                alert("All fields must be valid numbers!");
                return;
            }
        }

        // Get new values from
        const NEW_RULES = {
            maxPlayers: parseInt(_form.querySelector("#i_maxPlayers").value),
            roundLengthSeconds: parseInt(
                _form.querySelector("#i_roundLength").value,
            ),
            votingLengthSeconds: parseInt(
                _form.querySelector("#i_votingLength").value,
            ),
            numOfImpostors: parseInt(
                _form.querySelector("#i_numOfImpostors").value,
            ),
            numberOfRounds: parseInt(
                _form.querySelector("#i_numberOfRounds").value,
            ),
        };

        // Validate the inputs
        if (
            NEW_RULES.maxPlayers < Lobby.#MIN_PLAYERS ||
            NEW_RULES.maxPlayers > Lobby.#MAX_PLAYERS
        ) {
            alert(
                `Max Players must be between ${Lobby.#MIN_PLAYERS} and ${Lobby.#MAX_PLAYERS}`,
            );
            return;
        }

        if (NEW_RULES.maxPlayers < Object.keys(_lobbyRec.players).length) {
            alert(
                "Max Players cannot be reduced to below the current number of players!\nPlease try kicking someone before updating rules.",
            );
            return;
        }

        if (
            NEW_RULES.roundLengthSeconds < Lobby.#MIN_ROUND_LENGTH ||
            NEW_RULES.roundLengthSeconds > Lobby.#MAX_ROUND_LENGTH
        ) {
            alert(
                `Round length must be between ${Lobby.#MIN_ROUND_LENGTH} and ${Lobby.#MAX_ROUND_LENGTH} seconds!`,
            );
            return;
        }

        if (
            NEW_RULES.votingLengthSeconds < Lobby.#MIN_VOTING_LENGTH ||
            NEW_RULES.votingLengthSeconds > Lobby.#MAX_VOTING_LENGTH
        ) {
            alert(
                `Voting time must be between ${Lobby.#MIN_VOTING_LENGTH} and ${Lobby.#MAX_VOTING_LENGTH} seconds!`,
            );
            return;
        }

        if (
            NEW_RULES.numOfImpostors < Lobby.#MIN_IMPOSTORS ||
            NEW_RULES.numOfImpostors > Lobby.#MAX_IMPOSTORS
        ) {
            alert(
                `There can only be between ${Lobby.#MIN_IMPOSTORS} and ${Lobby.#MAX_IMPOSTORS} impostors!`,
            );
            return;
        }

        if (
            NEW_RULES.numOfImpostors >
                Object.keys(_lobbyRec.players).length -
                    Lobby.#MIN_NON_IMPOSTOR_PLAYERS &&
            NEW_RULES.numOfImpostors != 1
        ) {
            alert(
                `There must be at least ${Lobby.#MIN_NON_IMPOSTOR_PLAYERS} non impostor players!`,
            );
            return;
        }

        if (
            NEW_RULES.numberOfRounds < Lobby.#MIN_ROUNDS ||
            NEW_RULES.numberOfRounds > Lobby.#MAX_ROUNDS
        ) {
            alert(
                `There can only be ${Lobby.#MIN_ROUNDS} to ${Lobby.#MAX_ROUNDS} rounds!`,
            );
            return;
        }

        this.#submitNewRules(NEW_RULES, _lobbyRec);
    }

    #submitNewRules(_newRules, _lobbyRec) {
        // Only host can edit rules
        if (!(_lobbyRec.host.uid == getRecord().uid)) return;

        // Once the input is validated, write the new rules to the lobby
        firebaseIO.updateRecord(`${this.#lobbyPath}/rules`, _newRules);
    }

    #openInstructionsTab() {}
}
