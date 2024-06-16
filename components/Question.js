import React from "react"
import {decode} from 'html-entities'

export default function Question(props) {
    let styles = {}
    const inputElements = props.questionData.values.map((value, index) => {
        let isChecked = props.questionData[`${props.questionData.name}`] === value
        let isRight = props.questionData.isRight
        let currentAnswer = props.questionData.allAnswers[index]
        if (isRight === undefined) {
            styles = {
                backgroundColor: isChecked ? "#D6DBF5" : "#F5F7FB",
                borderColor: isChecked ? "#D6DBF5" : "#4D5B9E"
            }
        } else if (isChecked) {
            styles = {
                backgroundColor: isRight ? "#94D7A2" : "#F8BCBC",
                borderColor: isRight ? "#94D7A2" : "#F8BCBC",
                opacity: currentAnswer !== props.questionData.correctAnswer ? 
                    0.5
                    : 
                    1,
                cursor: "default"
            }
        } else {
            styles = {
                backgroundColor: currentAnswer === props.questionData.correctAnswer ? 
                "#94D7A2" : "#F5F7FB",
                borderColor: currentAnswer === props.questionData.correctAnswer ? 
                "#94D7A2" : "#4D5B9E",
                opacity: currentAnswer !== props.questionData.correctAnswer ? 
                    0.5
                    : 
                    1,
                cursor: "default"
            }
        }
        
        return (
            <div className="input-wrapper">
                <input 
                    type="radio"
                    id={value}
                    name={props.questionData.name}
                    value={value}
                    checked={isChecked}
                    onChange ={(e) => props.handleClick(e)}
                />
                <label htmlFor={value} style={styles} className="answer-label">
                    <div className="label-content">{decode(props.questionData.allAnswers[index])}</div>
                </label>
            </div>
        )
    })
    
    return (
        <div>
            <p className="question">{decode(props.questionData.question)}</p>
            <div className="input-container">
                {inputElements}
            </div>
            <hr />
        </div>
    )
}
