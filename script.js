// defining elements
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const prevButton = document.getElementById('prev-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-btns')
let shuffledQuestions, currentQuestionIndex


// defines behaviour for buttons when clicked
startButton.addEventListener('click', startQuiz)

nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setQuestion()
})

prevButton.addEventListener('click', () => {
    currentQuestionIndex--
    setQuestion()
})


// shuffles the questions and unhides them
function startQuiz() {
  startButton.classList.add('hide')
  questionContainerElement.classList.remove('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  setQuestion()
}


//
function setQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}


// applies questions to buttons
function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.dataset.number = answer.number
    button.classList.add('answer-btns', 'btn')

    const questionIndex = selectedAnswerList.indexOf('q' + (currentQuestionIndex + 1))
    if (questionIndex != -1) {
      if (selectedAnswerList[questionIndex + 1] == button.dataset.number) {
        button.classList.add('selected')
      }
    } 
    
    // adds correct tag to button iff answer is correct - useful for later
    if (answer.correct) {
        button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}


// controls hide for next & prev, deletes previous answer buttons
function resetState() {
  nextButton.classList.remove('hide')
  prevButton.classList.remove('hide')
  if (currentQuestionIndex + 1 == shuffledQuestions.length) {
    nextButton.classList.add('hide')
  } 
  if (currentQuestionIndex == 0){
    prevButton.classList.add('hide')
  }

  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}


// visual selection: limited to one answer, selection status saved locally
function selectAnswer(e) {
  const selectedButton = e.target
  Array.from(answerButtonsElement.children).forEach(button => {
    removeSelected(button)
  })
  selectedButton.classList.add('selected')
  // gets index of answer if in list already
  const questionIndex = selectedAnswerList.indexOf('q' + (currentQuestionIndex + 1))
  if (questionIndex != -1) {
    selectedAnswerList[questionIndex + 1] = selectedButton.dataset.number
  } else {
    selectedAnswerList.push('q' + (currentQuestionIndex + 1), selectedButton.dataset.number)
  }
  
  // send to database after 'finish' clicked
}


// removes selection from button
function removeSelected(element) {
  element.classList.remove('selected')
}


const questions = [
  {
    question: 'What is 2 + 2?',
    answers: [
      { number: 1, text: '4', correct: true },
      { number: 2, text: '22', correct: false },
      { number: 3, text: '222', correct: false },
      { number: 4, text: '2222', correct: false }
    ]
  },
  {
    question: 'Edit',
    answers: [
      { number: 1, text: 'Yes', correct: true },
      { number: 2, text: 'Yeah', correct: true, },
      { number: 3, text: 'Yep', correct: true, },
      { number: 4, text: 'Ye', correct: true, }
    ]
  },
  {
    question: 'Edit',
    answers: [
      { number: 1, text: 'A', correct: false, },
      { number: 2, text: 'B', correct: true, },
      { number: 3, text: 'C', correct: false, },
      { number: 4, text: 'D', correct: false, }
    ]
  },
  {
    question: 'What is 4 * 2?',
    answers: [
      { number: 1, text: '6', correct: false, },
      { number: 2, text: '6', correct: false, },
      { number: 3, text: '6', correct: false, },
      { number: 4, text: '8', correct: true, }
    ]
  }
]

selectedAnswerList = []