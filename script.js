// defining elements
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const prevButton = document.getElementById('prev-btn')
const finishButton = document.getElementById('finish-btn')
const progressText = document.getElementById('hud-text')
const progressBarElement = document.getElementById('progress-bar')
const progressBarFull = document.getElementById('progress-bar-full')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-btns')
let shuffledQuestions, currentQuestionIndex


// defines behaviour for buttons when clicked
startButton.addEventListener('click', startQuiz)

finishButton.addEventListener('click', () => {
  if (finishButton.classList.contains('unavailable') == false) {
    endQuiz()
  }
})
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
  finishButton.classList.remove('hide')
  progressText.classList.remove('hide')
  questionContainerElement.classList.remove('hide')
  progressBarElement.classList.remove('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  setQuestion()
}


// cleans up quiz and shows result
function endQuiz() {
  console.log('got to finish')
}


//
function setQuestion() {
  resetState()
  updateProgress()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}


// applies questions to buttons
function showQuestion(question) {
  questionElement.innerText = question.question
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.dataset.number = answer.number
    button.dataset.id = question.id
    button.classList.add('answer-btns', 'btn')

    const questionIndex = selectedAnswerList.indexOf('order: ' + (currentQuestionIndex + 1))
    if (questionIndex != -1) {
      if (selectedAnswerList[questionIndex - 1] == button.dataset.number) {
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
  const questionIndex = selectedAnswerList.indexOf('id: ' + (selectedButton.dataset.id))
  if (questionIndex != -1) {
    selectedAnswerList[questionIndex + 1] = (selectedButton.dataset.number)
  } else {
    selectedAnswerList.push('id: ' + (selectedButton.dataset.id), selectedButton.dataset.number, 'order: ' + (currentQuestionIndex + 1))
  }
  updateProgress()
  updateFinish()
  
  // send to database after 'finish' clicked
}


// updates progress bar
function updateProgress() {
  progressText.innerText = `Answered: ${selectedAnswerList.length / 3} / ${shuffledQuestions.length}`
  let progressPercentage = ((selectedAnswerList.length / 3) / shuffledQuestions.length) * 100
  progressBarFull.style.width = `${progressPercentage}%`
}


// updates if the user can finish
function updateFinish() {
  if ((selectedAnswerList.length / 3) == shuffledQuestions.length) {
    finishButton.classList.remove('unavailable')
  }
}


// removes selection from button
function removeSelected(element) {
  element.classList.remove('selected')
}


const questions = [
  {
    question: 'What is 2 + 2?',
    id: 1,
    answers: [
      { number: 1, text: '4', correct: true },
      { number: 2, text: '5', correct: false },
      { number: 3, text: '6', correct: false },
      { number: 4, text: '7', correct: false },
      { number: 5, text: '8', correct: false },
      { number: 6, text: '9', correct: false }
    ]
  },
  {
    question: 'Edit',
    id: 2,
    answers: [
      { number: 1, text: 'Yes', correct: true },
      { number: 2, text: 'Yeah', correct: true, },
      { number: 3, text: 'Yep', correct: true, },
      { number: 4, text: 'Ye', correct: true, },
      { number: 5, text: 'Ye', correct: true, },
      { number: 6, text: 'Ye', correct: true, }
    ]
  },
  {
    question: 'Edit',
    id: 3,
    answers: [
      { number: 1, text: 'A', correct: false, },
      { number: 2, text: 'B', correct: true, },
      { number: 3, text: 'C', correct: false, },
      { number: 4, text: 'D', correct: false, },
      { number: 5, text: 'C', correct: false, },
      { number: 6, text: 'C', correct: false, }
    ]
  },
  {
    question: 'What is 4 * 2?',
    id: 4,
    answers: [
      { number: 1, text: '6', correct: false, },
      { number: 2, text: '6', correct: false, },
      { number: 3, text: '6', correct: false, },
      { number: 4, text: '8', correct: true, },
      { number: 5, text: '6', correct: false, },
      { number: 6, text: '6', correct: false, }
    ]
  }
]

selectedAnswerList = []