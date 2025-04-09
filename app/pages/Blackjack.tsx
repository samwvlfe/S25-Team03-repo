import React, { ReactElement , useState } from "react";

// Class for card creation.
class Card {
    type: string;
    value: number;
    suite: string;

    constructor(type: string, value: number, suite: string) {
        this.type = type;
        this.value = value;
        this.suite = suite;
    }

    info():string {
        return `${this.type} (${this.value}) of ${this.suite}`;
    }
}

// Class for creating a multi-deck.
class Multideck {
    cards: Card[] = [];
    values: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    types: string[] = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
    suites: string[] = ["Xonics", "Dlords", "Goobus", "Sprockets"];

    constructor(decks: number) {
        // Repeating this process for number of decks desired.
        for (let i = 0; i < decks; i++) {
            // Creating one card of each suite.
            for (const suite of this.suites) {
                // Assining type and value to card and adding it to the total cards.
                for (let j = 0; j < this.values.length; j++) {
                    this.cards.push(new Card(this.types[j], this.values[j], suite));
                }
            }
        }
    }

    shuffle():void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard():Card | undefined {
        return this.cards.pop();
    }
}

// Creating the class for a hand.
class Hand {
    cards: Card[] = [];

    calcVal():number {
        let handVal = 0;
        let heldAces: Card[] = [];

        // Calculating the value of all cards that are not aces.
        for (const card of this.cards) {
            if (card.type === 'Ace') {
                heldAces.push(card);
            } else {
                handVal += card.value;
            }
        }

        for (const ace of heldAces) {
            ace.value = (handVal + 11 > 21) ? 1 : 11;

            handVal += ace.value;
        }

        return handVal;
    }
}

class Game {
    playerHand: Hand = new Hand();
    dealerHand: Hand = new Hand();

    deck: Multideck;

    constructor(deckNumber: number) {
        this.deck = new Multideck(deckNumber);
    }

    // Deals two cards to the dealer and the player.
    startGame():void {
        // Resetting the hands.
        this.playerHand.cards = [];
        this.dealerHand.cards = [];

        this.deck.shuffle();

        for (let i = 0; i < 4; i++) {
            if (!(i % 2)) {
                this.deal(this.dealerHand);
            } else {
                this.deal(this.playerHand);
            }
        }

        if (this.dealerHand.calcVal() == 21) {
            console.log("Dealer got blackjack!");
        }

        if (this.playerHand.calcVal() == 21) {
            console.log("Player got blackjack!");
        }
    }

    deal(hand: Hand):void {
        let card = this.deck.drawCard();

        if (card) {
            hand.cards.push(card)
        }
    }
}


export default function Blackjack() {
    const [game] = useState(new Game(2));
    const [, setRender] = useState(0);
    const forceRender = () => setRender(prev => prev + 1);

    const handleStart = () => {
        game.startGame();
        forceRender();
    }

    const handleDeal = () => {
        game.deal(game.playerHand);
        forceRender();
    }

    return (
        <main>
            <p>Dealer's Hand</p>
            {game.dealerHand.cards.map(card => (
                <p>{card.info()}</p>
            ))}
            <p>Player's Hand:</p>
            {game.playerHand.cards.map(card => (
                <p>{card.info()}</p>
            ))}
            <button onClick={handleStart}>Start Game</button>
            <button onClick={handleDeal}>Deal</button>
        </main>
    )
}