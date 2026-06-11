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
            `${this.#lobbyPath}/submittedCards/${_uid}`,
            { ..._cards },
        );

        await generateLobbyCache();
        const lobby = getLobbyRecord();

        const getRandomInt = (max) => Math.floor(Math.random() * max);

        // Clone the player's hand so we can modify it locally
        const hand = [...lobby.players[_uid].hand];

        // Remove submitted cards
        for (const card of _cards) {
            const index = hand.indexOf(card);

            if (index === -1) {
                console.warn("Card not found in hand:", card);
                continue;
            }

            // remove card
            hand.splice(index, 1);

            drawCard();

            let drawCard = () => {
                const newCard = getRandomInt(
                    Object.keys(this.#cards.responses).length,
                );
                // Prevent duplicates
                if (hand.includes(newCard)) {
                    drawCard();
                    return;
                }
                hand.push(newCard);
            };
        }

        // Write the entire hand back at once
        await firebaseIO.setRecord(
            `${this.#lobbyPath}/players/${_uid}/hand`,
            hand,
        );

        await generateLobbyCache();
        const updatedLobby = getLobbyRecord();

        const players = Object.keys(updatedLobby.players).filter(
            (uid) => uid !== updatedLobby.czar,
        );

        const submissions = Object.keys(updatedLobby.submittedCards ?? {});
        console.log(submissions);

        if (submissions.length === players.length) {
            await firebaseIO.updateRecord(this.#lobbyPath, {
                gameState: "judging",
            });
        }
    }

    async chooseWinner(_uid, _lobbyData) {
        if (getRecord().uid !== getLobbyRecord().czar) return;
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

    async uploadScore(_score, _uid) {
        const PATH = `games/cardsAgainstComputerScience/scores/${_uid}/`;
        const currentScore = await firebaseIO.readRecord(PATH);
        await firebaseIO.updateRecord(PATH, {
            totalScore: (currentScore ?? 0) + _score,
        });
    }
}
