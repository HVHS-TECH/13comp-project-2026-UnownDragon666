export default class HandRenderer {
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
