export default class HandRenderer {
    static render(_hand, _responses) {
        const SECTION = document.createElement("section");
        SECTION.id = "s_hand";

        Object.values(_hand).forEach((cardId) => {
            const CARD = document.createElement("div");
            CARD.classList.add("cardsInHand");

            const TEXT = document.createElement("p");
            TEXT.classList.add("cardsinHandText");

            TEXT.textContent = _responses[cardId];

            CARD.append(TEXT);
            SECTION.append(CARD);
        });

        return SECTION;
    }
}
