import Content from "./CNT_Content.mjs";
/**
 * @family CNT: Content
 * @description Games is a class for the content of the page which displays all the games
 *
 * Written in Term One 2026 for programming/database project
 *
 * By: Idrees Munshi
 * @class
 */
export default class Games extends Content {
    /* **************************************** Private Fields *****************************************/
    static #secID = "s_games";

    #cards = [
        { cardID: "d_guessTheImpostor", cardText: "Who's lying?" },
        { cardID: "d_catchTheStars", cardText: "Catch the Stars!" },
    ];

    #games = {
        d_guessTheImpostor: {
            title: "Who's lying?",
            description:
                "Can you find out who the impostor is, based on their answer?",
            target: "GuessTheImpostorLobbies",
            buttonContent: "Play Game",
        },
    };

    /* **************************************** Public Fields *****************************************/
    // The ID used to identify the stylesheet belonging to this page (GaMe Style Sheet)
    styleID = "GMSS";

    /* **************************************** Constructor *****************************************/
    constructor() {
        super(Games.#secID);
    }
    /* ******************************** Parent Class Method Overrides *********************************/
    async removeContent() {
        document.querySelectorAll("section").forEach((section) => {
            section.remove();
        });
    }

    async buildContent() {
        // Create nav var
        const NAV = super.createNavBar();
        this.section.appendChild(NAV);

        // Create section
        const GAMES_SECTION = document.createElement("section");
        GAMES_SECTION.id = "s_gameSubSec";

        let cardElements = {};
        for (const game of this.#cards) {
            cardElements[game.cardID] = this.#createCard(
                game.cardID,
                game.cardText,
                GAMES_SECTION,
            );
        }

        // Create modal blueprint
        const MODAL = this.#createModal();
        GAMES_SECTION.appendChild(MODAL[0]);

        this.section.appendChild(GAMES_SECTION);
        this.#modalListeners(MODAL, cardElements);
    }

    /* **************************************** Public Methods *****************************************/

    /* **************************************** Private Methods *****************************************/
    /**
     *
     * @param {string} _cardID - HTML ID for the card
     * @param {string} _cardText - Text for the inside of the card
     * @param {Node} _section - Section to append card to
     * @returns {HTMLDivElement} - The card element that was created
     */
    #createCard(_cardID, _cardText, _section) {
        const CARD = document.createElement("div");
        CARD.classList.add("gameCard");
        CARD.id = _cardID;
        const CARD_TITLE = document.createElement("h1");
        CARD_TITLE.textContent = _cardText;
        CARD.appendChild(CARD_TITLE);
        _section.appendChild(CARD);
        return CARD;
    }

    /**
     * Builds the HTML for a modal
     * This creates the modal's div, and its content like the play button, title, description, and close span.
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

        const MODAL_PLAY = document.createElement("button");
        MODAL_PLAY.id = "b_playButton";
        MODAL_PLAY.type = "button";
        MODAL_PLAY.textContent = "Play Game";

        MODAL_CONTENT.append(MODAL_CLOSE, MODAL_TITLE, MODAL_DESC, MODAL_PLAY);
        MODAL.appendChild(MODAL_CONTENT);

        return [MODAL, MODAL_CLOSE, MODAL_TITLE, MODAL_DESC, MODAL_PLAY];
    }

    /**
     * Deploy listeners on the cards which display modals when clicked.
     *
     * @param {Array<Node>} _modal - Array returned by modal, containing all the elements in the modal
     * @param {Object} _cards - object containing all the Card elements, div IDs mapped to their card elements
     */
    #modalListeners(_modal, _cards) {
        try {
            // Register listeners to the cards:
            Object.keys(this.#games).forEach((id) => {
                // get the card element
                const card = _cards[id];
                // add event listener on clicking the card
                card.addEventListener("click", () => {
                    // get this card's info from the #games object
                    const game = this.#games[id];
                    const event = new CustomEvent("navigate", {
                        detail: {
                            content: game.target,
                        },
                    });

                    _modal[2].textContent = game.title;
                    _modal[3].textContent = game.description;
                    _modal[4].textContent = game.buttonContent;
                    _modal[4].addEventListener("click", () => {
                        document.dispatchEvent(event);
                    });
                    _modal[0].style.display = "flex";
                });
            });

            // Register listener to close modal
            _modal[1].addEventListener(
                "click",
                () => {
                    _modal[0].style.display = "none";
                },
                { once: true },
            );

            // Close modal when you click outside of it
            const OUTSIDE_CLICK_HANDLER = (event) => {
                if (event.target === _modal[0]) {
                    _modal[0].style.display = "none";
                    window.removeEventListener("click", OUTSIDE_CLICK_HANDLER);
                }
            };
            window.addEventListener("click", OUTSIDE_CLICK_HANDLER);
        } catch (error) {
            console.error(error);
        }
    }
}
