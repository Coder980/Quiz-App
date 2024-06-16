import React from "react"
import Question from "./components/Question"
import QuizOptions from "./components/QuizOptions"

export default function App() {
    const [quizData, setQuizData] = React.useState({
        questionNumber: 5,
        category: "any",
        difficulty: "any"
    })
    const [isStartClicked, setIsStartClicked] = React.useState(false)
    const [questionsData, setQuestionsData] = React.useState([])
    const [score, setScore] = React.useState(0)
    const questionElements = questionsData.map((questionData, index) => {
        return <Question 
            key={index}
            questionData={questionData}
            handleClick={handleClick}
        />
    })
    
    function startQuiz() {
        setIsStartClicked(true)
        updateQuestionsData()
    }
    
    function handleChange(event) {
        const {name, value} = event.target
        const newValue = !(value > 0) ? 5 : value
        
        setQuizData(prevQuizData => {	
            return {
                ...prevQuizData,
                [name]: name === "questionNumber" ? newValue : value
            }
        })
    }
    
    function handleClick(event) {
        const {name, value} = event.target
        
        questionsData[0].isRight === undefined ?
            setQuestionsData(prevQuestionsData => prevQuestionsData.map(questionData => {
                if (questionData.name === name) {
                    const givenAnswerIndex = questionData.values.indexOf(value)
                    return {
                        ...questionData,
                        [name]: value,
                        givenAnswer: questionData.allAnswers[givenAnswerIndex]
                    }
                } else {
                    return questionData
                }
            }))
            :
            null
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array
    }
    
    function checkAnswers() {
        setQuestionsData(prevQuestionsData => {
            const updatedQuestionsData = prevQuestionsData.map(questionData => {
                return {
                    ...questionData,
                    isRight: questionData.correctAnswer === questionData.givenAnswer ?
                        true 
                        :
                        false
                }
            })
            
            setScore(updatedQuestionsData.reduce((acc, questionData) => {
                return acc + (questionData.isRight ? 1 : 0)
            }, 0))
            
            return updatedQuestionsData
        })
    }
    
    function newGame() {
        updateQuestionsData()
        setScore(0)
    }
    
    async function getQuestionsData() {
        let url = `https://opentdb.com/api.php?amount=${quizData.questionNumber}`
        quizData.category !== "any" ? url += `&category=${quizData.category}` : null
        quizData.difficulty !== "any" ? url += `&difficulty=${quizData.difficulty}` : null
        url += "&type=multiple"
        const res = await fetch(url)
        const data = await res.json()
        return data.results
    }
    
    async function updateQuestionsData() {
        const allQuestionsData = await getQuestionsData()
        setQuestionsData(allQuestionsData.map((questionData, index) => {
            return {
                [`question${index+1}`]: "",
                name: `question${index+1}`,
                values: [
                    `question${index+1}Option1`,
                    `question${index+1}Option2`,
                    `question${index+1}Option3`,
                    `question${index+1}Option4`
                ],
                question: questionData.question,
                allAnswers: shuffleArray([
                    ...questionData.incorrect_answers,
                    questionData.correct_answer
                ]),
                correctAnswer: questionData.correct_answer,
                givenAnswer: ""
            }
        }))
    }
    
    return (
        <main>
        {
            !isStartClicked ?
                <QuizOptions handleChange={handleChange} startQuiz={startQuiz}/>
                :
                <div className="quiz-container">
                    <form className="quiz-form">
                        {questionElements}
                    </form>
                    {questionsData[0] && questionsData[0].isRight === undefined ?
                        <button className="answer-btn" onClick={checkAnswers}>Check answers</button>
                        :
                        <div className="result-container">
                            <p className="score-txt">
                            You scored {score}/{questionsData.length} correct answers
                            </p>
                            <button className="restart-btn" onClick={newGame}>Play again</button>
                        </div>
                    }
                </div>
        }
        </main>
    )
}