import { getRecord } from "../../../../accountManager/AM_User.mjs";
import { firebaseIO } from "../../../../firebase/FB_instance.mjs";
import { generateLobbyCache, getLobbyRecord } from "../CACS_LobbyReference.mjs";

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

            roundEndsAt:
                Date.now() + getLobbyRecord().rules.roundLengthSeconds * 1000,
        });
    }

    async submitCards(_uid, _cards) {
        await firebaseIO.updateRecord(
            `${this.#lobbyPath}/submittedCards/${_uid}/`,
            { ..._cards },
        );

        await generateLobbyCache();
        const lobby = getLobbyRecord();

        const getRandomInt = (max) => Math.floor(Math.random() * max);
        let lostCards = 0;

        _cards.forEach(async (card) => {
            let index = lobby.players[_uid].hand.indexOf(card);
            await firebaseIO.deleteRecord(
                `${this.#lobbyPath}/players/${getRecord().uid}/hand/${index}`,
            );
            lostCards++;
        });

        while (lostCards > 0) {
            let index = getRandomInt(Object.keys(this.#cards.responses).length);
            if (lobby.players[_uid].hand.includes(index)) continue;
            await firebaseIO.updateRecord(
                `${this.#lobbyPath}/players/${_uid}/hand/`,
                index,
            );
            lostCards--;
        }

        const players = Object.keys(lobby.players).filter(
            (uid) => uid !== lobby.czar,
        );

        const submissions = Object.keys(lobby.submittedCards ?? {});

        if (submissions.length === players.length) {
            await firebaseIO.updateRecord(this.#lobbyPath, {
                gameState: "judging",
            });
        }
    }

    async chooseWinner(_uid, _lobbyData) {
        await firebaseIO.updateRecord(this.#lobbyPath, {
            roundWinner: _uid,
            gameState: "roundEnd",
        });

        firebaseIO.updateRecord(`${this.#lobbyPath}/players/${_uid}/`, {
            score: _lobbyData.players[_uid].score + 1,
        });
    }

    async nextRound(_nextCzarUid, _round) {
        const lobby = getLobbyRecord();

        if (_round > lobby.rules.numberOfRounds) {
            await firebaseIO.updateRecord(this.#lobbyPath, {
                gameState: "gameEnd",
            });

            return;
        }

        await firebaseIO.updateRecord(this.#lobbyPath, {
            currentRound: _round,
            czar: _nextCzarUid,
            gameState: "waiting",
            submittedCards: null,
            currentPromptKey: null,
            roundWinner: null,
        });
    }
}
