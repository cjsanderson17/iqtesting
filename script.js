// defining elements
const hudElements = document.getElementById('hud-elements')
const versionNo = document.getElementById('version')
const continueButton = document.getElementById('continue-btn')
const startButton = document.getElementById('start-btn')
const welcomeText = document.getElementById('welcome-text')
const exampleWindow = document.getElementById('example-window')
const exampleImage = document.getElementById('example-image')
const infoText = document.getElementById('info-text')
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
const questionNumberText = document.getElementById('question-number')
const scoreText = document.getElementById('score-text')
const saveStatusText = document.getElementById('save-status-text')
const endText = document.getElementById('end-text')
let currentQuestionIndex, firstTimeSelect
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
  startButton.classList.add('hide')
  prevButton.classList.add('hide')
  infoText.classList.add('hide')
  exampleWindow.classList.remove('hide')
  welcomeText.classList.remove('hide')
  exampleImage.classList.remove('hide')
  continueButton.classList.remove('hide')

}

// loads the information page
function loadInfoPage() {
  welcomeText.classList.add('hide')
  continueButton.classList.add('hide')
  exampleWindow.classList.add('hide')
  infoText.classList.remove('hide')
  startButton.classList.remove('hide')
  prevButton.classList.remove('hide')
}

// loads the end page
function loadEndPage(scores) {
  questionNumberText.classList.add('hide')
  nextButton.classList.add('hide')
  prevButton.classList.add('hide')
  finishButton.classList.add('hide')
  countdownTimer.classList.add('hide')
  progressText.classList.add('hide')
  progressBarElement.classList.add('hide')
  progressBarFull.classList.add('hide')
  answerButtonsElement.classList.add('hide')
  questionImage.classList.add('hide')

  scoreText.classList.remove('hide')
  saveStatusText.classList.remove('hide')
  endText.classList.remove('hide')
  scoreText.innerText = "Your score was: " + scores[0] + " / " + questions.length + 
  "\n\nYour estimated IQ is: " + scores[1] + 
  "\n\nThis is a rough estimate calculated based on the results from a small sample size. If you want a more accurate estimate, visit a more reputable body"

}

// shuffles the questions and unhides them
function startQuiz() {
  quizStarted = true
  prevButton.innerText = 'Prev'
  hudElements.style.height = '30%'
  infoText.classList.add('hide')
  versionNo.classList.add('hide')
  startButton.classList.add('hide')
  questionImage.classList.remove('hide')
  questionNumberText.classList.remove('hide')
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

// prepares to display the next question
function setQuestion() {
  resetState()
  updateProgress()
  showQuestion(questions[currentQuestionIndex])
}

// controls hide for next & prev, deletes previous answer buttons
function resetState() {
  if (currentQuestionIndex + 1 == questions.length) {
    nextButton.classList.add('hide')
  } else {
    nextButton.classList.remove('hide')
  }
  if (currentQuestionIndex == 0){
    prevButton.classList.add('hide')
  } else {
    prevButton.classList.remove('hide')
  }

  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
  answerButtonsElement.classList.add('hide')
}

// updates progress bar
function updateProgress() {
  progressText.innerText = `Answered: ${selectedAnswerList.length / 3} / ${questions.length}`
  let progressPercentage = ((selectedAnswerList.length / 3) / questions.length) * 100
  progressBarFull.style.width = `${progressPercentage}%`
}

// applies questions to buttons
function showQuestion(question) {
  questionNumberText.innerHTML = "Question " + (currentQuestionIndex + 1)
  questionImage.src = question.img
  questionImage.style.height = '50%'
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.style.backgroundImage = answer.img
    button.dataset.number = answer.number
    button.dataset.correct = answer.correct
    button.dataset.id = question.id
    button.classList.add('answer-btns', 'btn')

    const questionIndex = selectedAnswerList.indexOf('id: ' + button.dataset.id)
    if (questionIndex != -1) {
      if (selectedAnswerList[questionIndex + 1] == button.dataset.number) {
        button.classList.add('selected')
      }
    } 
    answerButtonsElement.classList.remove('hide')
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
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
    selectedAnswerList[questionIndex + 2] = (selectedButton.dataset.correct)
    firstTimeSelect = false
    console.log('in list already')
  } else {
    selectedAnswerList.push('id: ' + (selectedButton.dataset.id), selectedButton.dataset.number, selectedButton.dataset.correct)
    firstTimeSelect = true
  }
  updateProgress()
  updateFinish()
  if (firstTimeSelect == true && (currentQuestionIndex + 1) != questions.length) {
    firstTimeSelect = false
    currentQuestionIndex++
    setQuestion()
  }
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

// calculates IQ score based on standard deviation of previous samples
function calculateScore(list, noOfQuestions) {
  let score = 0
  // to be updated each version.
  let mean = 16.31578947368421
  let stdev = 3.0423081858589476
  for (let i = 1; i <= noOfQuestions; i++) {
    if (list[3*i - 1] == "true") {
      score++
    }
  }
  const iq = Math.floor(100 + 15*((score - mean) / stdev))
  scores = [score, iq]
  return scores
}

// calls post request to database from php file
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

// question images and answers
const questions = [
  {
    id: 1,
    img: 'images/q2.jpg',
    answers: [
      { number: 1, img: "URL('images/2a.jpg')", correct: false },
      { number: 2, img: "URL('images/2b.jpg')", correct: false },
      { number: 3, img: "URL('images/2c.jpg')", correct: true },
      { number: 4, img: "URL('images/2d.jpg')", correct: false },
    ]
  },
  {
    id: 9,
    img: 'images/q13.jpg',
    answers: [
      { number: 1, img: "URL('images/13a.jpg')", correct: true },
      { number: 2, img: "URL('images/13b.jpg')", correct: false },
      { number: 3, img: "URL('images/13c.jpg')", correct: false },
      { number: 4, img: "URL('images/13d.jpg')", correct: false },
      { number: 5, img: "URL('images/13e.jpg')", correct: false },
      { number: 6, img: "URL('images/13f.jpg')", correct: false },
    ]
  },
  {
    id: 3,
    img: 'images/q16.jpg',
    answers: [
      { number: 1, img: "URL('images/16a.jpg')", correct: false },
      { number: 2, img: "URL('images/16b.jpg')", correct: true },
      { number: 3, img: "URL('images/16c.jpg')", correct: false },
      { number: 4, img: "URL('images/16d.jpg')", correct: false },
      { number: 5, img: "URL('images/16e.jpg')", correct: false },
      { number: 6, img: "URL('images/16f.jpg')", correct: false },
    ]
  },
  {
    id: 5,
    img: 'images/q4.jpg',
    answers: [
      { number: 1, img: "URL('images/4a.jpg')", correct: false },
      { number: 2, img: "URL('images/4b.jpg')", correct: true },
      { number: 3, img: "URL('images/4c.jpg')", correct: false },
      { number: 4, img: "URL('images/4d.jpg')", correct: false },
      { number: 5, img: "URL('images/4e.jpg')", correct: false },
      { number: 6, img: "URL('images/4f.jpg')", correct: false },
    ]
  },
  {
    id: 7,
    img: 'images/q12.jpg',
    answers: [
      { number: 1, img: "URL('images/12a.jpg')", correct: false },
      { number: 2, img: "URL('images/12b.jpg')", correct: false },
      { number: 3, img: "URL('images/12c.jpg')", correct: false },
      { number: 4, img: "URL('images/12d.jpg')", correct: false },
      { number: 5, img: "URL('images/12e.jpg')", correct: false },
      { number: 6, img: "URL('images/12f.jpg')", correct: true },
    ]
  },
  {
    id: 13,
    img: 'images/q20.jpg',
    answers: [
      { number: 1, img: "URL('images/20a.jpg')", correct: false },
      { number: 2, img: "URL('images/20b.jpg')", correct: false },
      { number: 3, img: "URL('images/20c.jpg')", correct: false },
      { number: 4, img: "URL('images/20d.jpg')", correct: true },
      { number: 5, img: "URL('images/20e.jpg')", correct: false },
      { number: 6, img: "URL('images/20f.jpg')", correct: false },
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
  },
  {
    id: 4,
    img: 'images/q1.jpg',
    answers: [
      { number: 1, img: "URL('images/1a.jpg')", correct: false },
      { number: 2, img: "URL('images/1b.jpg')", correct: false },
      { number: 3, img: "URL('images/1c.jpg')", correct: false },
      { number: 4, img: "URL('images/1d.jpg')", correct: true },
      { number: 5, img: "URL('images/1e.jpg')", correct: false },
      { number: 6, img: "URL('images/1f.jpg')", correct: false },
    ]
  },
  {
    id: 2,
    img: 'images/q3.jpg',
    answers: [
      { number: 1, img: "URL('images/3a.jpg')", correct: true },
      { number: 2, img: "URL('images/3b.jpg')", correct: false },
      { number: 3, img: "URL('images/3c.jpg')", correct: false },
      { number: 4, img: "URL('images/3d.jpg')", correct: false },
    ]
  },
  {
    id: 11,
    img: 'images/q5.jpg',
    answers: [
      { number: 1, img: "URL('images/5a.jpg')", correct: false },
      { number: 2, img: "URL('images/5b.jpg')", correct: false },
      { number: 3, img: "URL('images/5c.jpg')", correct: true },
      { number: 4, img: "URL('images/5d.jpg')", correct: false },
      { number: 5, img: "URL('images/5e.jpg')", correct: false },
      { number: 6, img: "URL('images/5f.jpg')", correct: false },
    ]
  },
  {
    id: 10,
    img: 'images/q14.jpg',
    answers: [
      { number: 1, img: "URL('images/14a.jpg')", correct: true },
      { number: 2, img: "URL('images/14b.jpg')", correct: false },
      { number: 3, img: "URL('images/14c.jpg')", correct: false },
      { number: 4, img: "URL('images/14d.jpg')", correct: false },
      { number: 5, img: "URL('images/14e.jpg')", correct: false },
      { number: 6, img: "URL('images/14f.jpg')", correct: false },
    ]
  },
  {
    id: 12,
    img: 'images/q7.jpg',
    answers: [
      { number: 1, img: "URL('images/7a.jpg')", correct: false },
      { number: 2, img: "URL('images/7b.jpg')", correct: false },
      { number: 3, img: "URL('images/7c.jpg')", correct: false },
      { number: 4, img: "URL('images/7d.jpg')", correct: true },
      { number: 5, img: "URL('images/7e.jpg')", correct: false },
      { number: 6, img: "URL('images/7f.jpg')", correct: false },
    ]
  },
  {
    id: 19,
    img: 'images/q10.jpg',
    answers: [
      { number: 1, img: "URL('images/10a.jpg')", correct: false },
      { number: 2, img: "URL('images/10b.jpg')", correct: false },
      { number: 3, img: "URL('images/10c.jpg')", correct: false },
      { number: 4, img: "URL('images/10d.jpg')", correct: false },
      { number: 5, img: "URL('images/10e.jpg')", correct: true },
      { number: 6, img: "URL('images/10f.jpg')", correct: false },
    ]
  },
  {
    id: 8,
    img: 'images/q19.jpg',
    answers: [
      { number: 1, img: "URL('images/19a.jpg')", correct: true },
      { number: 2, img: "URL('images/19b.jpg')", correct: false },
      { number: 3, img: "URL('images/19c.jpg')", correct: false },
      { number: 4, img: "URL('images/19d.jpg')", correct: false },
      { number: 5, img: "URL('images/19e.jpg')", correct: false },
      { number: 6, img: "URL('images/19f.jpg')", correct: false },
    ]
  },
  {
    id: 24,
    img: 'images/q21.jpg',
    answers: [
      { number: 1, img: "URL('images/21a.jpg')", correct: false },
      { number: 2, img: "URL('images/21b.jpg')", correct: false },
      { number: 3, img: "URL('images/21c.jpg')", correct: false },
      { number: 4, img: "URL('images/21d.jpg')", correct: false },
      { number: 5, img: "URL('images/21e.jpg')", correct: false },
      { number: 6, img: "URL('images/21f.jpg')", correct: true },
    ]
  },
  {
    id: 22,
    img: 'images/q22.jpg',
    answers: [
      { number: 1, img: "URL('images/22a.jpg')", correct: false },
      { number: 2, img: "URL('images/22b.jpg')", correct: false },
      { number: 3, img: "URL('images/22c.jpg')", correct: false },
      { number: 4, img: "URL('images/22d.jpg')", correct: true },
      { number: 5, img: "URL('images/22e.jpg')", correct: false },
      { number: 6, img: "URL('images/22f.jpg')", correct: false },
    ]
  },
  {
    id: 17,
    img: 'images/q23.jpg',
    answers: [
      { number: 1, img: "URL('images/23a.jpg')", correct: false },
      { number: 2, img: "URL('images/23b.jpg')", correct: false },
      { number: 3, img: "URL('images/23c.jpg')", correct: false },
      { number: 4, img: "URL('images/23d.jpg')", correct: true },
      { number: 5, img: "URL('images/23e.jpg')", correct: false },
      { number: 6, img: "URL('images/23f.jpg')", correct: false },
    ]
  },
  {
    id: 16,
    img: 'images/q9.jpg',
    answers: [
      { number: 1, img: "URL('images/9a.jpg')", correct: false },
      { number: 2, img: "URL('images/9b.jpg')", correct: false },
      { number: 3, img: "URL('images/9c.jpg')", correct: false },
      { number: 4, img: "URL('images/9d.jpg')", correct: false },
      { number: 5, img: "URL('images/9e.jpg')", correct: true },
      { number: 6, img: "URL('images/9f.jpg')", correct: false },
    ]
  },
  {
    id: 20,
    img: 'images/q11.jpg',
    answers: [
      { number: 1, img: "URL('images/11a.jpg')", correct: false },
      { number: 2, img: "URL('images/11b.jpg')", correct: false },
      { number: 3, img: "URL('images/11c.jpg')", correct: false },
      { number: 4, img: "URL('images/11d.jpg')", correct: true },
      { number: 5, img: "URL('images/11e.jpg')", correct: false },
      { number: 6, img: "URL('images/11f.jpg')", correct: false },
    ]
  },
  {
    id: 23,
    img: 'images/q18.jpg',
    answers: [
      { number: 1, img: "URL('images/18a.jpg')", correct: false },
      { number: 2, img: "URL('images/18b.jpg')", correct: false },
      { number: 3, img: "URL('images/18c.jpg')", correct: false },
      { number: 4, img: "URL('images/18d.jpg')", correct: false },
      { number: 5, img: "URL('images/18e.jpg')", correct: false },
      { number: 6, img: "URL('images/18f.jpg')", correct: true },
    ]
  },
  {
    id: 21,
    img: 'images/q17.jpg',
    answers: [
      { number: 1, img: "URL('images/17a.jpg')", correct: false },
      { number: 2, img: "URL('images/17b.jpg')", correct: true },
      { number: 3, img: "URL('images/17c.jpg')", correct: false },
      { number: 4, img: "URL('images/17d.jpg')", correct: false },
      { number: 5, img: "URL('images/17e.jpg')", correct: false },
      { number: 6, img: "URL('images/17f.jpg')", correct: false },
    ]
  },
  {
    id: 18,
    img: 'images/q24.jpg',
    answers: [
      { number: 1, img: "URL('images/24a.jpg')", correct: false },
      { number: 2, img: "URL('images/24b.jpg')", correct: false },
      { number: 3, img: "URL('images/24c.jpg')", correct: false },
      { number: 4, img: "URL('images/24d.jpg')", correct: false },
      { number: 5, img: "URL('images/24e.jpg')", correct: true },
      { number: 6, img: "URL('images/24f.jpg')", correct: false },
    ]
  }, 
  {
    id: 14,
    img: 'images/q8.jpg',
    answers: [
      { number: 1, img: "URL('images/8a.jpg')", correct: false },
      { number: 2, img: "URL('images/8b.jpg')", correct: false },
      { number: 3, img: "URL('images/8c.jpg')", correct: false },
      { number: 4, img: "URL('images/8d.jpg')", correct: false },
      { number: 5, img: "URL('images/8e.jpg')", correct: true },
      { number: 6, img: "URL('images/8f.jpg')", correct: false },
    ]
  }, 
  {
    id: 15,
    img: 'images/q15.jpg',
    answers: [
      { number: 1, img: "URL('images/15a.jpg')", correct: false },
      { number: 2, img: "URL('images/15b.jpg')", correct: false },
      { number: 3, img: "URL('images/15c.jpg')", correct: false },
      { number: 4, img: "URL('images/15d.jpg')", correct: true },
      { number: 5, img: "URL('images/15e.jpg')", correct: false },
      { number: 6, img: "URL('images/15f.jpg')", correct: false },
    ]
  }, 
  {
    id: 25,
    img: 'images/q25.jpg',
    answers: [
      { number: 1, img: "URL('images/25a.jpg')", correct: false },
      { number: 2, img: "URL('images/25b.jpg')", correct: false },
      { number: 3, img: "URL('images/25c.jpg')", correct: true },
      { number: 4, img: "URL('images/25d.jpg')", correct: false },
      { number: 5, img: "URL('images/25e.jpg')", correct: false },
      { number: 6, img: "URL('images/25f.jpg')", correct: false },
    ]
  }
]

selectedAnswerList = []