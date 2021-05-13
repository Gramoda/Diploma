import React from "react";
import ReactCardFlip from "react-card-flip";
import "./card.component.css";

const CardComponent = (props) => {
    const {card} = props;
    return (
    <React.Fragment>
        <ReactCardFlip isFlipped={card.selected || card.matched} flipDirection={"horizontal"}>
            <div className={card.matched ? "backCard card_matched_backCard":"backCard not_matched" }></div>
            <img src={`candies/${card.name}.jpg`} alt={card.name} className={card.matched ? "frontCard card_matched_frontCard":"frontCard not_matched"}/>
        </ReactCardFlip>
        </React.Fragment> 
    )
}

export default CardComponent;