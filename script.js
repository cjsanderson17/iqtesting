// defining elements
const continueButton = document.getElementById('continue-btn')
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const prevButton = document.getElementById('prev-btn')
const finishButton = document.getElementById('finish-btn')
const countdownTimer = document.getElementById('timer')
const progressText = document.getElementById('hud-text')
const progressBarElement = document.getElementById('progress-bar')
const progressBarFull = document.getElementById('progress-bar-full')
const questionContainerElement = document.getElementById('answer-btns')
const questionImage = document.getElementById('main-image')
const answerButtonsElement = document.getElementById('answer-btns')
const scoreText = document.getElementById('score-text')
let shuffledQuestions, currentQuestionIndex
let counter = 1200
let quizStarted = false

// defines behaviour for buttons when clicked
continueButton.addEventListener('click', loadInfoPage)

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
  if (quizStarted == false) {
    loadWelcomePage()
  } else {
    currentQuestionIndex--
    setQuestion()
  }
})

// loads the welcome page
function loadWelcomePage() {
  questionImage.src='images/welcomePageImage.jpg'
  continueButton.classList.remove('hide')
  startButton.classList.add('hide')
  prevButton.classList.add('hide')
}

// loads the information page
function loadInfoPage() {
  questionImage.src='images/infoPageImage.jpg'
  continueButton.classList.add('hide')
  startButton.classList.remove('hide')
  prevButton.classList.remove('hide')
}

// loads the end page
function loadEndPage(scores) {
  nextButton.classList.add('hide')
  prevButton.classList.add('hide')
  finishButton.classList.add('hide')
  countdownTimer.classList.add('hide')
  progressText.classList.add('hide')
  progressBarElement.classList.add('hide')
  progressBarFull.classList.add('hide')
  answerButtonsElement.classList.add('hide')
  scoreText.classList.remove('hide')
  scoreText.innerText = "Your score was: " + scores[0] + " / " + shuffledQuestions.length + "\nEstimated IQ: " + scores[1]
  questionImage.classList.add('hide')
}

// shuffles the questions and unhides them
function startQuiz() {
  quizStarted = true
  startButton.classList.add('hide')
  finishButton.classList.remove('hide')
  countdownTimer.classList.remove('hide')
  progressText.classList.remove('hide')
  questionContainerElement.classList.remove('hide')
  progressBarElement.classList.remove('hide')
  shuffledQuestions = questions.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  startTimer(counter)
  setQuestion()
}

// starts timer
function startTimer(time) {
  counter = setInterval(timer, 1000)
  function timer() {
    time--
    window.value = time
    timeMinutes = (Math.floor(time / 60))
    if (timeMinutes < 10) {
      timeMinutes = "0" + timeMinutes
    }
    timeSeconds = (time % 60)
    if (timeSeconds < 10) {
      timeSeconds = "0" + timeSeconds
    }
    if (time == 10) {
      countdownTimer.style.color = "red"
    }
    countdownTimer.textContent = timeMinutes + ":" + timeSeconds
    if (time == 0) {
      clearInterval(counter)
      endQuiz() 
    }
  }
}

//
function setQuestion() {
  resetState()
  updateProgress()
  showQuestion(shuffledQuestions[currentQuestionIndex])
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

// updates progress bar
function updateProgress() {
  progressText.innerText = `V.5.Answered: ${selectedAnswerList.length / 4} / ${shuffledQuestions.length}`
  let progressPercentage = ((selectedAnswerList.length / 4) / shuffledQuestions.length) * 100
  progressBarFull.style.width = `${progressPercentage}%`
}

// applies questions to buttons
function showQuestion(question) {
  questionImage.src = question.img
  questionImage.style.height = '50%'
  let answerCounter = 0
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.style.backgroundImage = answer.img
    button.dataset.number = answer.number
    button.dataset.correct = answer.correct
    button.dataset.id = question.id
    button.classList.add('answer-btns', 'btn')

    const questionIndex = selectedAnswerList.indexOf('order: ' + (currentQuestionIndex + 1))
    if (questionIndex != -1) {
      if (selectedAnswerList[questionIndex - 2] == button.dataset.number) {
        button.classList.add('selected')
      }
    } 
    
    // adds correct tag to button iff answer is correct - useful for later
    if (answer.correct) {
        button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    /*if (answerCounter == 3) {
      console.log('broke')
      const lineBreak = document.createElement('break')
      answerButtonsElement.appendChild(lineBreak)
    }*/
    answerButtonsElement.appendChild(button)
    answerCounter++
  })
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
    selectedAnswerList.push('id: ' + (selectedButton.dataset.id), selectedButton.dataset.number, selectedButton.dataset.correct, 'order: ' + (currentQuestionIndex + 1))
  }
  updateProgress()
  updateFinish()
  
  // send to database after 'finish' clicked
}

// removes selection from button
function removeSelected(element) {
  element.classList.remove('selected')
}

// updates if the user can finish
function updateFinish() {
  if ((selectedAnswerList.length / 4) == shuffledQuestions.length) {
    finishButton.classList.remove('unavailable')
  }
}

// cleans up quiz and shows result
function endQuiz() {
  console.log(window.value)
  clearInterval(counter)
  selectedAnswerList.push("time remaining: " + window.value)
  score = calculateScore(selectedAnswerList, shuffledQuestions.length)
  loadEndPage(score)
}

//
function calculateScore(list, noOfQuestions) {
  let score = 0
  for (let i = 1; i <= noOfQuestions; i++) {
    if (list[4*i - 2] == "true") {
      score++
    }
  }
  const iq = 140 * score / noOfQuestions
  scores = [score, iq]
  return scores
}

const questions = [
  {
    id: 1,
    img: 'images/q1.jpg',
    answers: [
      { number: 1, img: "URL('images/q1a1.jpg')", correct: true },
      { number: 2, img: "URL('images/q1a2.jpg')", correct: false },
      { number: 3, img: "URL('images/q1a3.jpg')", correct: false },
    ]
  },
  {
    question: 'Edit',
    img: 'images/questionImage.jpg',
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
    img: 'images/questionImage.jpg',
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
    img: 'images/questionImage.jpg',
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