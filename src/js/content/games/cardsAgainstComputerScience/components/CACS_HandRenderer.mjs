/**
 * @family CACS: Cards Against Computer Science
 * @description HandRenderer... renders a player's hand.
 * Using an array on the keys in the player's "hand" node,
 * and the "responses" object, which is just the catalogue of all response cards,
 * the HandRenderer creates a bunch of card elements, and an array for how many cards
 * are to be picked that round, and essentially, it... attaches a listener to
 * mutate the array in place, and attaches a "submitCallback" once the player decides
 * what cards to play.
 *
 * @class
 */

export default class HandRenderer {
    /**
     *
     * @param {Object} _hand - A set of numbers corresponding to card keys in _responses
     * @param {Object} _responses - A library of what key corresponds to what response card.
     * @param {Number} _pickCount - The number of cards to be chosen this round
     * @param {Function} _submitCallback - Callback function when cards submitted.
     * @returns {HTMLSectionElement} - Section with cards
     */
    static render(_hand, _responses, _pickCount, _submitCallback) {
        const SECTION = document.createElement("section");
        SECTION.id = "s_handSection";
        let selected = [];

        Object.entries(_hand).forEach(([index, cardId]) => {
            const CARD = document.createElement("div");

            CARD.classList.add("cardsInHand");
            CARD.dataset.index = index;
            CARD.dataset.cardID = cardId;

            CARD.textContent = _responses[cardId].card;

            CARD.addEventListener("click", () => {
                const index = Number(CARD.dataset.index);

                if (selected.includes(index)) {
                    selected.splice(selected.indexOf(index), 1);
                    CARD.classList.remove("selected");
                } else {
                    if (selected.length >= _pickCount) return;

                    selected.push(index);
                    CARD.classList.add("selected");
                }
                SUBMIT.disabled = selected.length !== _pickCount;
            });

            SECTION.append(CARD);
        });

        const SUBMIT = document.createElement("button");
        SUBMIT.type = "button";
        SUBMIT.textContent = "Submit";
        SUBMIT.disabled = true;

        SUBMIT.addEventListener("click", () => {
            _submitCallback(selected);
        });

        SECTION.append(SUBMIT);

        return SECTION;
    }
}
