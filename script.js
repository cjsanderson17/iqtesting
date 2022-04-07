// defining elements
const versionNo = document.getElementById('version')
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
const saveStatusText = document.getElementById('save-status-text')
let currentQuestionIndex
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
  saveStatusText.classList.remove('hide')
  scoreText.innerText = "Your score was: " + scores[0] + " / " + questions.length + "\nEstimated IQ: " + scores[1]
  questionImage.classList.add('hide')
}

// shuffles the questions and unhides them
function startQuiz() {
  quizStarted = true
  versionNo.classList.add('hide')
  startButton.classList.add('hide')
  finishButton.classList.remove('hide')
  countdownTimer.classList.remove('hide')
  progressText.classList.remove('hide')
  questionContainerElement.classList.remove('hide')
  progressBarElement.classList.remove('hide')
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
  showQuestion(questions[currentQuestionIndex])
}

// controls hide for next & prev, deletes previous answer buttons
function resetState() {
  nextButton.classList.remove('hide')
  prevButton.classList.remove('hide')
  if (currentQuestionIndex + 1 == questions.length) {
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
  progressText.innerText = `Answered: ${selectedAnswerList.length / 3} / ${questions.length}`
  let progressPercentage = ((selectedAnswerList.length / 3) / questions.length) * 100
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

    const questionIndex = selectedAnswerList.indexOf('id: ' + (currentQuestionIndex + 1))
    if (questionIndex != -1) {
      if (selectedAnswerList[questionIndex + 1] == button.dataset.number) {
        button.classList.add('selected')
      }
    } 
    
    button.addEventListener('click', selectAnswer)
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
    selectedAnswerList.push('id: ' + (selectedButton.dataset.id), selectedButton.dataset.number, selectedButton.dataset.correct)
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
  if ((selectedAnswerList.length / 3) == questions.length) {
    finishButton.classList.remove('unavailable')
  }
}

// cleans up quiz and shows result
function endQuiz() {
  const remainingTime = window.value
  clearInterval(counter)
  score = calculateScore(selectedAnswerList, questions.length)
  saveUserData(remainingTime, selectedAnswerList, score)
  loadEndPage(score)
}

//
function calculateScore(list, noOfQuestions) {
  let score = 0
  for (let i = 1; i <= noOfQuestions; i++) {
    if (list[3*i - 1] == "true") {
      score++
    }
  }
  const iq = 140 * score / noOfQuestions
  scores = [score, iq]
  return scores
}

//
function saveUserData(userTime, answerList, scores) {
  let answersString = answerList.toString()
  $.post('saveuserdata.php',
  {
    score: scores[0],
    iq: scores[1],
    answers: answersString,
    timeremaining: userTime,
  },
  function(data, status) {
    saveStatusText.innerHTML = data;
    $('#saveStatusText').fadeIn(100);
    setTimeout(function() {
      $('saveStatusText').fadeOut(100); }, 3000);
  })
}

const questions = [
  {
    id: 1,
    img: 'images/q1.jpg',
    answers: [
      { number: 1, img: "URL('images/1a.jpg')", correct: false },
      { number: 2, img: "URL('images/1b.jpg')", correct: false },
      { number: 3, img: "URL('images/1c.jpg')", correct: true },
    ]
  },
  {
    id: 2,
    img: 'images/q2.jpg',
    answers: [
      { number: 1, img: "URL('images/2a.jpg')", correct: false },
      { number: 2, img: "URL('images/2b.jpg')", correct: false },
      { number: 3, img: "URL('images/2c.jpg')", correct: true },
      { number: 4, img: "URL('images/2d.jpg')", correct: false },
    ]
  },
  {
    id: 3,
    img: 'images/q3.jpg',
    answers: [
      { number: 1, img: "URL('images/3a.jpg')", correct: true },
      { number: 2, img: "URL('images/3b.jpg')", correct: false },
      { number: 3, img: "URL('images/3c.jpg')", correct: false },
      { number: 4, img: "URL('images/3d.jpg')", correct: false },
    ]
  },
  {
    id: 4,
    img: 'images/q4.jpg',
    answers: [
      { number: 1, img: "URL('images/4a.jpg')", correct: false },
      { number: 2, img: "URL('images/4b.jpg')", correct: true },
      { number: 3, img: "URL('images/4c.jpg')", correct: false },
      { number: 4, img: "URL('images/4c.jpg')", correct: false },
    ]
  },
  {
    id: 5,
    img: 'images/q5.jpg',
    answers: [
      { number: 1, img: "URL('images/5a.jpg')", correct: false },
      { number: 2, img: "URL('images/5b.jpg')", correct: false },
      { number: 3, img: "URL('images/5c.jpg')", correct: true },
      { number: 4, img: "URL('images/5d.jpg')", correct: false },
      { number: 5, img: "URL('images/5e.jpg')", correct: false },
    ]
  },
  {
    id: 6,
    img: 'images/q6.jpg',
    answers: [
      { number: 1, img: "URL('images/6a.jpg')", correct: false },
      { number: 2, img: "URL('images/6b.jpg')", correct: false },
      { number: 3, img: "URL('images/6c.jpg')", correct: false },
      { number: 4, img: "URL('images/6d.jpg')", correct: false },
      { number: 5, img: "URL('images/6e.jpg')", correct: false },
      { number: 6, img: "URL('images/6f.jpg')", correct: true },
    ]
  }
]

selectedAnswerList = []