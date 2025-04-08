import React from "react";

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

    printDeck():void {
        for (const card of this.cards) {
            console.log(card.info());
        }
        console.log(`Length: ${this.cards.length}\nTypes: ${this.types.length}\nValues: ${this.types.length}`);
    }
}

// Creating the class for a hand.
class Hand {
    cards: Card[] = [];

    calcVal():number {
        let handVal = 0;
        let heldAces = [];

        // Calculating the value of all cards that are not aces.
        for (const card in this.cards) {
            if (card.type === 'Ace') {
                heldAces.push(card);
            } else {
                handVal += card.value;
            }
        }

        for (const ace in heldAces) {
            
        }
    }
}

// Creating the class for the game.
class BlackjackGame {
    deck: Multideck;
    playerHand: Card[] = [];
    dealerHand: Card[] = [];

    constructor(decks: number) {
        this.deck = new Multideck(decks);
    }
}

export default function Blackjack() {
    const doubleDeck = new Multideck(2);
    doubleDeck.shuffle();
    console.log(doubleDeck.printDeck());

    return (
        <main>
            <p>Check the console!</p>
        </main>
    )
}