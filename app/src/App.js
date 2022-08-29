import React from 'react';
import ReactDOM from 'react-dom';

export default function App() {
  const [img1, setImg1] = React.useState("")
  const [img2, setImg2] = React.useState("")
  const [card1, setCard1] = React.useState("")
  const [card2, setCard2] = React.useState("")
  const [deckId, setDeckId] = React.useState("")
  const [remaining, setRemaining] = React.useState("")
  const [computerScore, setComputerScore] = React.useState(0)
  const [playerScore, setPlayerScore] = React.useState(0)

  async function handleNewDeck() {
    const res = await fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    const data = await res.json()
    setDeckId(data.deck_id)
    setRemaining(data.remaining)
    setPlayerScore(0)
    setComputerScore(0)
  }

  async function handleDraw() {
    const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    const data = await res.json()
    console.log(data)
    setImg1(data.cards[0].image)
    setImg2(data.cards[1].image)
    setCard1(data.cards[0].value)
    setCard2(data.cards[1].value)
    setRemaining(data.remaining)
    updateScore(data.cards[0].value, data.cards[1].value)
  }

  function updateScore(card1, card2) {
    const cardsOrder = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    const cardValue1 = cardsOrder.indexOf(card1)
    const cardValue2 = cardsOrder.indexOf(card2)
    if (cardValue1 === cardValue2) {
      setComputerScore(prevScore => prevScore)
    } else if (cardValue1 > cardValue2) {
      setComputerScore(prevScore => prevScore + 1)
    } else {
      setPlayerScore(prevScore => prevScore + 1)
    }
  }

  function determineWinnerCard(card1, card2) {
    const cardsOrder = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]
    const cardValue1 = cardsOrder.indexOf(card1)
    const cardValue2 = cardsOrder.indexOf(card2)
    if (cardValue1 === cardValue2) {
      return ("War!")
    } else if (cardValue1 > cardValue2) {
      return ("Computer wins!")
    } else {
      return ("You win!")
    }
  }

  function headerMessage() {
    if (card1 === "") {
      return "Game of War"
    } else if (remaining === 0) {
      if (computerScore > playerScore) {
        return "The computer won the game. Try again!"
      } else if (computerScore < playerScore) {
        return "Congratulations, You won the game!"
      } else {
        return "The game is a draw. Try again!"
      }
    } else if (remaining === 52) {
      return "Game of War"
    } else {
      return determineWinnerCard(card1, card2)
    }
  }

  const winnerText = headerMessage()

  return (
    <div className="main-container">
      <div className="top-row"><button className="new-deck" onClick={handleNewDeck}>New Deck</button>{remaining ? `Remaining cards: ${remaining}` : null}</div>
      <h2>{winnerText}</h2>
      <h3>Computer score: {computerScore}</h3>
      <div className="cards-container">
        <div className="cards-spot1">{img1 ? <img src={img1} alt="card one"/> : null}</div>
        <div className="cards-spot2">{img2 ? <img src={img2} alt="card two"/> : null}</div>
      </div>
      <h3>My score: {playerScore}</h3>
      {remaining === 0 ? <button className="draw-disabled" onClick={handleDraw} disabled={true}>Draw</button> : <button className="draw" onClick={handleDraw}>Draw</button>}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));