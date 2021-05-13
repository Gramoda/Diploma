import { getElementError } from "@testing-library/dom";
import React, { useEffect } from "react";
import candyData from "../data/listOfCandies.json";
import CardComponent from "./card.component";
import "./gameboard.component.css";
import Modal from "./Modal"

const GameboardComponent = () => {
    const initalState = {
        level: 4,
        deck: [],
        selectedCards: [],
        matchedCards:[]
    };

    const [seconds, setSeconds] = React.useState(1);
    const [game, setGame] = React.useState(initalState);
    const [modalActive,setModalActive]=React.useState(false);
    const shuffle = (array) => {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var copied = array[i];
            array[i] = array[j];
            array[j] = copied;
        }
        return array;
    }
    const getRandomColor=()=> {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    const switchColor=()=>
    {
        
    }
    const createDeck = (level) => {
        const deck = shuffle(candyData).slice(0, level);
        const fullDeck = shuffle([...deck, ...deck]);
        return fullDeck;
    };

    const initGame = () => setGame((previousState)=>({...initalState, level: previousState.level, deck: createDeck(previousState.level)}));

    const onClickEventHandler = (card, index) => {
        if(card.selected || card.matched){
            return;
        }
        const copiedDeck = [...game.deck];
        copiedDeck[index] = {...card, selected: true};
        setGame((previousState) => ({...previousState, deck: copiedDeck, selectedCards: [...previousState.selectedCards, copiedDeck[index]]}));
    };
const checkSelectedCardsForAMatch = (selection) => selection.length && selection[0]?.name === selection[1]?.name;

const resetGame = () => {
    setGame((previousState) => ({
        ...previousState,
        deck: previousState.deck.map((card) =>({
            name: card.name,
            selected: false,
            matched: false
        })),
        matchedCards:[]
    }))
    setTimeout(initGame, 300);
    setSeconds(0);
};

const setLevel = (level) => {
    resetGame();
    setGame((previousState) => ({...previousState, level}));
    
}
useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    if (game.matchedCards.length!==game.level*2)
    {          
    return () => clearInterval(timer);
    }
    else clearInterval(timer);
  });

useEffect(initGame,[]);
useEffect(()=>{
    if (game.matchedCards.length!==game.level*2)
    {
    setTimeout(()=>{setSeconds(seconds+1)},1000)
    }
    else
    {
        console.log("net");
    }
    if(game.selectedCards.length === 2){
    if(checkSelectedCardsForAMatch(game.selectedCards)){
       const copiedDeck = [...game.deck].map((card)=>{
           if(game.selectedCards.map(candy => candy.name).includes(card.name)){
               game.matchedCards.push(game.selectedCards);
               return {name: card.name, selected: false, matched: true};
           }
           
           return card;
       })
       setGame((previousState) => ({...previousState, deck: copiedDeck, selectedCards:[] }));
       if (game.matchedCards.length===game.level*2)
       {
           setModalActive(true);
           
       }
    }else{
        setTimeout(()=>{
        setGame((previousState) => ({...previousState, deck: game.deck.map(card => ({...card, selected:false})), selectedCards:[]}))
        }, 750);
    }
    }
},[game]);


    return (
        <React.Fragment>
        <main>
        <div className="gamebar">
        <button onClick={()=> setLevel(4)}>Switch color</button>
        <button className="resetBtn" onClick={()=>{resetGame();}}>Reset Game</button>
        <button onClick={()=> setLevel(4)}>Easy</button>
        <button onClick={()=> setLevel(8)}>Medium</button>
        <button onClick={()=> setLevel(16)}>Hard</button>
        <div className="timer">Your time:{seconds}</div>
        </div>
        <div className="gameboard">
                {game.deck.map((card, index) => (
                    <span key={index} className="card" onClick={() => onClickEventHandler(card, index)} > 
                    <CardComponent card={card} />
                    </span>
                ))}

        </div>
        </main>
        <Modal active={modalActive} setActive={setModalActive}>
          <h2>Congrats! U done that with <strong>{seconds} seconds</strong>, but maybe u can do this better ?</h2>
        </Modal> 
        </React.Fragment>
    )
}

export default GameboardComponent;