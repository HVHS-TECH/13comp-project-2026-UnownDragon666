import { getRecord } from "../../../../accountManager/AM_User.mjs";
import { firebaseIO } from "../../../../firebase/FB_instance.mjs";
import { getLobbyRecord } from "../CACS_LobbyReference.mjs";

export default class GameLogic {
    #cards;
    #lobbyPath;

    static #HAND_SIZE = 6;

    constructor(_cards, _lobbyPath) {
        this.#cards = _cards;
        this.#lobbyPath = _lobbyPath;

        if (getLobbyRecord().host.uid == getRecord().uid)
            this.#distributeHands();
    }

    async #distributeHands() {
        // Give everyone their hands
        Object.keys(getLobbyRecord().players).forEach(async (uid) => {
            const getRandomIntIncl = (max) =>
                Math.floor(Math.random() * (max + 1));
            let handSize = 0;
            let hand = [];
            while (handSize < GameLogic.#HAND_SIZE) {
                let randomCardIndex = getRandomIntIncl(
                    Object.keys(this.#cards.responses).length - 1,
                );
                hand.push(randomCardIndex);
                handSize++;
            }
            await firebaseIO.updateRecord(
                `${this.#lobbyPath}/players/${uid}/hand`,
                {
                    ...hand,
                },
            );
        });
    }

    async choosePrompt(_promptKey) {
        await firebaseIO.updateRecord(this.#lobbyPath, {
            currentPromptKey: _promptKey,
            cardsToChoose: this.#cards.prompts[_promptKey].pick,
            gameState: "choosing",
        });
    }

    async submitCards(_uid, _cards) {
        await firebaseIO.updateRecord(
            `${this.#lobbyPath}/submittedCards/${_uid}`,
            _cards,
        );
    }

    async chooseWinner(_uid) {
        await firebaseIO.updateRecord(this.#lobbyPath, {
            roundWinner: _uid,
            gameState: "roundEnd",
        });
    }

    async nextRound(_nextCzarUid, _round) {
        await firebaseIO.updateRecord(this.#lobbyPath, {
            currentRound: _round,
            czar: _nextCzarUid,
            gameState: "waiting",
            submittedCards: null,
            currentPromptKey: null,
        });
    }
}
