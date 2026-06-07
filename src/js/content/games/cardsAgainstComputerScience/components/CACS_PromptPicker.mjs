export default class PromptPicker {
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
