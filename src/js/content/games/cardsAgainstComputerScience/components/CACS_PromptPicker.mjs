/**
 * @family CACS: Cards Against Computer Science
 * @description PromptPicker is a component of the Cards Against Computer Science game,
 * that essentially creates a card for the czar to choose based on the data it's
 * given. Honestly I am far too tired to write more about this. And maybe this is a
 * bit too much encapsulation... seeing as this class has ONE METHOD! But whatever.
 * If it ain't broke, don't fix it.
 *
 * @class
 */

export default class PromptPicker {
    /**
     *
     * @param {Number} _promptKey - The key of the prompt in the array (i.e. the index)
     * @param {Object} _promptData - The data of the prompt
     * @param {Function} _callback - Callback function to append on click
     * @returns
     */
    static create(_promptKey, _promptData, _callback) {
        const CARD = document.createElement("div");

        CARD.classList.add("promptCardChoice");

        const TEXT = document.createElement("p");
        TEXT.textContent = _promptData.card;

        CARD.append(TEXT);

        CARD.addEventListener("click", () => {
            _callback(_promptKey);
        });

        return CARD;
    }
}
