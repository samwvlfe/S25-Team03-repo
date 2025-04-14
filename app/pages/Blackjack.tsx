import { useBreakpointValue } from "@aws-amplify/ui-react";
import React, { ReactElement , useState } from "react";

// Class for card creation.
class Card {
    type: string;
    value: number;
    suite: string;
    flipped: boolean;

    constructor(type: string, value: number, suite: string, flipped: boolean) {
        this.type = type;
        this.value = value;
        this.suite = suite;
        this.flipped = flipped;
    }

    info():ReactElement {
        let display: number | string = this.value;

        if (this.type[0] == "A" || this.type[0] == "J" || this.type[0] == "Q" || this.type[0] == "K") {
            display = this.type[0];
        }

        const layouts:Record<string, number[][]> = {
            "Ace": [[1]],
            "Jack": [[1]],
            "Queen": [[1]],
            "King": [[1]],
            "Two": [[1], [1]],
            "Three": [[1], [1], [1]],
            "Four": [[2], [2]],
            "Five": [[2], [1], [2]],
            "Six": [[2], [2], [2]],
            "Seven": [[2], [1], [2], [2]],
            "Eight": [[2], [1], [2], [1], [2]],
            "Nine": [[2], [2], [1], [2], [2]],
            "Ten": [[2], [1], [2], [1], [2]]
        }

        return (
            <div className="card">
                <div className="card-info"><p>{display}<br />{this.suite}</p></div>
                {layouts[this.type].map((row, rowIndex) => (
                    <div key={rowIndex} className="card-row">
                        {Array.from({ length: row[0] }).map((_, i) => (
                            <span key={i}>{this.suite}</span>
                        ))}
                    </div>
                ))}
                <div className="card-info-alt"><p>{display}<br />{this.suite}</p></div>
            </div>
        )
    }
}

// Class for creating a multi-deck.
class Multideck {
    cards: Card[] = [];
    values: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    types: string[] = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
    suites: string[] = ["♠", "♣", "♥", "♦"];

    constructor(decks: number) {
        // Repeating this process for number of decks desired.
        for (let i = 0; i < decks; i++) {
            // Creating one card of each suite.
            for (const suite of this.suites) {
                // Assining type and value to card and adding it to the total cards.
                for (let j = 0; j < this.values.length; j++) {
                    this.cards.push(new Card(this.types[j], this.values[j], suite, false));
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
            if (card.type === "Ace") {
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

    playerState: string = "Bust";
    dealerStand: number;

    deck: Multideck;

    constructor(deckNumber: number, dealerStand: number) {
        this.deck = new Multideck(deckNumber);

        // The target number of the dealer.
        this.dealerStand = dealerStand;
    }

    // Deals two cards to the dealer and the player.
    startGame():void {
        // Resetting the hands.
        this.playerHand.cards = [];
        this.dealerHand.cards = [];

        // Resetting player state.
        this.playerState = "Playing";

        this.deck.shuffle();

        for (let i = 0; i < 4; i++) {
            const flipped = !i ? true : false;

            if (!(i % 2)) {
                this.deal(this.dealerHand, flipped);
            } else {
                this.deal(this.playerHand, flipped);
            }
        }

        switch (true) {
            case this.dealerHand.calcVal() == 21:
                console.log("Dealer got blackjack!");
                this.playerState = "Lost";
                break;
            case this.playerHand.calcVal() == 21:
                console.log("Player got blackjack!");
                this.playerState = "Blackjack";
                break;
            case this.dealerHand.calcVal() == 21 && this.playerHand.calcVal() == 21:
                console.log("Push!");
                this.playerState = "Push";
                break;
        }
    }

    checkBust():void {
        switch (true) {
            case this.playerHand.calcVal() > 21:
                console.log("Player has bust!");
                this.playerState = "Lost";
                break;
            case this.dealerHand.calcVal() > 21:
                console.log("Dealer has bust!");
                this.playerState = "Won";
                break;
        }
    }

    checkCondition():void {
        switch (true) {
            case this.playerHand.calcVal() > this.dealerHand.calcVal():
                console.log("Player has won!");
                this.playerState = "Won";
                break;
            case this.playerHand.calcVal() < this.dealerHand.calcVal():
                console.log("Dealer has won!");
                this.playerState = "Lost";
                break;
            default:
                console.log("Push!");
                this.playerState = "Push";
                break;
        }
    }

    deal(hand: Hand, flipped: boolean):void {
        let card = this.deck.drawCard();

        if (card) {
            card.flipped = flipped;
            hand.cards.push(card)
        }

        this.checkBust();
    }

    hold():void {
        this.playerState = "Hold";

        // The dealer will flip their first card over.
        this.dealerHand.cards[0].flipped = false;

        // The dealer will stand on 17 or above.
        while(this.dealerHand.calcVal() < 17) {
            this.deal(this.dealerHand, false);
        }

        // Checking to see if the dealer has gone bust.
        this.checkBust();

        if (this.playerState == "Hold") {
            // Evaluating the final state of the game.
            this.checkCondition();   
        }
    }
}


export default function Blackjack() {
    const [game] = useState(new Game(2, 17));
    const [, setRender] = useState(0);
    const forceRender = () => setRender(prev => prev + 1);

    const handleStart = () => {
        game.startGame();
        forceRender();
    }

    const handleDeal = () => {
        game.deal(game.playerHand, false);
        forceRender();
    }

    const handleHold = () => {
        game.hold();
        forceRender();
    }

    return (
        <main>
            <p>Dealer's Hand</p>
            <div className="hand">
                {game.dealerHand.cards.map(card => (
                    card.info()
                ))}
            </div>
            <p>Player's Hand:</p>
            <div className="hand">
                {game.playerHand.cards.map(card => (
                    card.info()
                ))}
            </div>
            {game.playerState != "Playing" && <button onClick={handleStart}>Start Game</button>}
            {game.playerState == "Playing" && <button onClick={handleDeal}>Deal</button>}
            {game.playerState == "Playing" && <button onClick={handleHold}>Hold</button>}
        </main>
    )
}