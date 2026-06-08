import PromptPicker from "./CACS_PromptPicker.mjs";
import HandRenderer from "./CACS_HandRenderer.mjs";
import { getRecord } from "../../../../accountManager/AM_User.mjs";

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
            case "judging":
                return this.#renderJudging(_lobbyData);
            case "roundEnd":
                return this.#renderRoundEnd(_lobbyData);
            case "gameEnd":
                return this.#renderGameEnd(_lobbyData);
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
            case "judging":
                return this.#renderJudging(_lobbyData);
            case "roundEnd":
                return this.#renderRoundEnd(_lobbyData);
            case "gameEnd":
                return this.#renderGameEnd(_lobbyData);
            default:
                return document.createElement("div");
        }
    }

    #waitingMessage() {
        const P = document.createElement("p");
        P.textContent = "Please wait for the Card Czar to choose a prompt.";
        P.classList.add("statusMessage");
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
        CARD.classList.add("promptCard");
        CARD.id = "d_chosenPrompt";

        const PROMPT = document.createElement("p");
        PROMPT.textContent = this.#cards.prompts[_promptKey].card;
        PROMPT.classList.add("promptText");

        const CZAR = document.createElement("p");
        CZAR.textContent = `Chosen by ${_lobbyData.players[_lobbyData.czar].name}`;
        CZAR.classList.add("promptMeta");

        const PICK = document.createElement("p");
        PICK.textContent = `Pick: ${this.#cards.prompts[_promptKey].pick}`;
        PICK.classList.add("promptPick");

        CARD.append(PROMPT, CZAR, PICK);

        return CARD;
    }

    #renderPlayerChoosing(_lobbyData, _uid) {
        const WRAPPER = document.createElement("div");

        if (_lobbyData.submittedCards?.[_uid]) {
            return this.#submittedMessage();
        }

        WRAPPER.append(
            this.#renderPromptCard(_lobbyData.currentPromptKey, _lobbyData),
        );

        WRAPPER.append(
            HandRenderer.render(
                _lobbyData.players[_uid].hand,
                this.#cards.responses,
                this.#cards.prompts[_lobbyData.currentPromptKey].pick,
                (selectedIndexes) => {
                    const selectedCards = selectedIndexes.map(
                        (i) => _lobbyData.players[_uid].hand[i],
                    );

                    this.#logic.submitCards(_uid, selectedCards);
                },
            ),
        );

        return WRAPPER;
    }

    #submittedMessage() {
        const WRAPPER = document.createElement("div");
        const P = document.createElement("p");
        P.textContent = "You've submitted your cards for this round.";
        P.classList.add("statusMessage");
        WRAPPER.append(P);

        return WRAPPER;
    }

    #renderJudging(_lobbyData) {
        const SECTION = document.createElement("section");
        SECTION.id = "s_judging";
        const entries = Object.entries(_lobbyData.submittedCards);

        entries.sort(() => Math.random() - 0.5);

        SECTION.append(
            this.#renderPromptCard(_lobbyData.currentPromptKey, _lobbyData),
        );

        entries.forEach(([uid, cards]) => {
            const WRAPPER = document.createElement("div");
            WRAPPER.dataset.uid = uid;
            WRAPPER.classList.add("responsesContainer");

            for (let i = 0; i < cards.length; i++) {
                const CARD = document.createElement("div");
                CARD.classList.add("responseCard");

                const P = document.createElement("p");
                P.textContent = this.#cards.responses[cards[i]].card;

                CARD.addEventListener("click", () => {
                    if (!(_lobbyData.czar == getRecord().uid)) return;
                    if (confirm("This is the winner?"))
                        this.#logic.chooseWinner(
                            WRAPPER.dataset.uid,
                            _lobbyData,
                        );
                });
                CARD.append(P);
                WRAPPER.append(CARD);
            }

            SECTION.append(WRAPPER);
        });

        return SECTION;
    }

    #renderRoundEnd(_lobbyData) {
        const SECTION = document.createElement("section");
        SECTION.id = "s_roundEnd";

        SECTION.append(
            this.#renderPromptCard(_lobbyData.currentPromptKey, _lobbyData),
        );

        const winnerId = _lobbyData.roundWinner;

        const TITLE = document.createElement("h2");
        TITLE.textContent = `${_lobbyData.players[winnerId].name} wins this round!`;
        TITLE.classList.add("winnerTitle");
        SECTION.append(TITLE);

        const winningCards = Object.values(_lobbyData.submittedCards[winnerId]);

        winningCards.forEach((cardId) => {
            const CARD = document.createElement("div");
            CARD.classList.add("responseCard");

            const P = document.createElement("p");
            P.textContent = this.#cards.responses[cardId].card;

            CARD.append(P);

            SECTION.append(CARD);
        });

        if (_lobbyData.czar === getRecord().uid) {
            const BUTTON = document.createElement("button");
            BUTTON.textContent = "Next Round";

            BUTTON.addEventListener("click", () => {
                const players = Object.keys(_lobbyData.players);

                const current = players.indexOf(_lobbyData.czar);

                const nextCzar = players[(current + 1) % players.length];

                this.#logic.nextRound(nextCzar, _lobbyData.currentRound + 1);
            });

            SECTION.append(BUTTON);
        }

        return SECTION;
    }

    #renderGameEnd(_lobbyData) {
        const SECTION = document.createElement("section");
        SECTION.id = "s_gameEnd";

        const TITLE = document.createElement("h2");
        TITLE.textContent = "Game Over!";
        TITLE.classList.add("gameEndTitle");

        SECTION.append(TITLE);

        // Sort players by score (descending)
        const sortedPlayers = Object.entries(_lobbyData.players).sort(
            (a, b) => (b[1].score ?? 0) - (a[1].score ?? 0),
        );

        const WINNER = sortedPlayers[0];
        console.log(WINNER);

        const WINNER_TEXT = document.createElement("p");
        WINNER_TEXT.classList.add("gameEndWinner");
        WINNER_TEXT.textContent = `${WINNER[1].name} wins the game!`;

        SECTION.append(WINNER_TEXT);

        const LEADERBOARD = document.createElement("div");
        LEADERBOARD.classList.add("gameEndLeaderboard");

        sortedPlayers.forEach(([uid, player], index) => {
            const ROW = document.createElement("div");
            ROW.classList.add("gameEndRow");

            const NAME = document.createElement("span");
            NAME.textContent = `${index + 1}. ${player.name}`;

            const SCORE = document.createElement("span");
            SCORE.textContent = player.score ?? 0;

            SCORE.classList.add("gameEndScore");

            ROW.append(NAME, SCORE);
            LEADERBOARD.append(ROW);
        });

        SECTION.append(LEADERBOARD);

        return SECTION;
    }
}
