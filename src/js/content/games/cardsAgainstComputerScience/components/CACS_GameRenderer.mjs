import PromptPicker from "./CACS_PromptPicker.mjs";
import HandRenderer from "./CACS_HandRenderer.mjs";

export default class GameRenderer {
    #cards;
    #logic;

    constructor(_cards, _gameLogic) {
        this.#cards = _cards;
        this.#logic = _gameLogic;
    }

    renderCzar(_lobbyData) {
        switch (_lobbyData.gameState) {
            case "waiting":
                return this.#renderPromptSelection();

            case "choosing":
                return this.#renderPromptCard(
                    _lobbyData.currentPromptKey,
                    _lobbyData,
                );

            default:
                return document.createElement("div");
        }
    }

    renderPlayer(_lobbyData, _uid) {
        switch (_lobbyData.gameState) {
            case "waiting":
                return this.#waitingMessage();

            case "choosing":
                return this.#renderPlayerChoosing(_lobbyData, _uid);

            default:
                return document.createElement("div");
        }
    }

    #waitingMessage() {
        const P = document.createElement("p");
        P.textContent = "Please wait for the Card Czar to choose a prompt.";
        return P;
    }

    #renderPromptSelection() {
        const SECTION = document.createElement("section");

        const prompts = Object.entries(this.#cards.prompts);

        const selected = [];

        while (selected.length < 4) {
            const random = prompts[Math.floor(Math.random() * prompts.length)];

            if (selected.some((p) => p[0] === random[0])) continue;

            selected.push(random);
        }

        selected.forEach(([key, prompt]) => {
            SECTION.append(
                PromptPicker.create(key, prompt, (promptKey) =>
                    this.#logic.choosePrompt(promptKey),
                ),
            );
        });

        return SECTION;
    }

    #renderPromptCard(_promptKey, _lobbyData) {
        const CARD = document.createElement("div");

        CARD.id = "d_chosenPrompt";

        const PROMPT = document.createElement("p");
        PROMPT.textContent = this.#cards.prompts[_promptKey].card;

        const CZAR = document.createElement("p");
        CZAR.textContent = `Chosen by ${_lobbyData.players[_lobbyData.czar].name}`;

        const PICK = document.createElement("p");
        PICK.textContent = `Pick: ${this.#cards.prompts[_promptKey].pick}`;

        CARD.append(PROMPT, CZAR, PICK);

        return CARD;
    }

    #renderPlayerChoosing(_lobbyData, _uid) {
        const WRAPPER = document.createElement("div");

        WRAPPER.append(
            this.#renderPromptCard(_lobbyData.currentPromptKey, _lobbyData),
        );

        WRAPPER.append(
            HandRenderer.render(
                _lobbyData.players[_uid].hand,
                this.#cards.responses,
            ),
        );

        return WRAPPER;
    }
}
