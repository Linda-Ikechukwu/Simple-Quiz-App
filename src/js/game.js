const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterText = document.getElementById('counter');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progress-bar-full');
const timer = document.getElementById('timer');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

const timerCountdown = document.querySelector('.timer-countdown');

let availableQuestions = [];
let currentQuestion = {}; 
let acceptingAnswers = false;
let score = 0;
let timerCounter = 0;


let questions = [];

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    startCountdown();
}

const chosenCategory = localStorage.getItem('chosenCategory');

fetch(`./questions/${chosenCategory}.json`)
   .then( response => {
       console.log(response);
       console.log(chosenCategory);
       return response.json();
    })
   .then(loadedQuestions => {
       console.log(loadedQuestions);
       questions = loadedQuestions;
       console.log(questions);
       
       startGame();
   })
   .catch(err => {
       console.error(err);
   });

//GAME CONSTANTS
const BONUS = 10;
const QUESTION_TIME = 10
const MAX_QUESTIONS = 20;



getNewQuestion = () => {
    //Go to end game page if all questions have been rendered
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore',score);
        localStorage.setItem('maxScore',MAX_QUESTIONS * BONUS);
       return window.location.assign("./end.html");
    }
    //else select and render random question from question array
    questionCounter++;
    questionCounterText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['choicenumber'];
        choice.innerText = currentQuestion['choice'+number];
    });

    //update progress bar
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`;

    //Remove just rendered question from the question array
    availableQuestions.splice(questionIndex, 1)

    acceptingAnswers = true;
    
    //timer countdown
    timerCounter = 0;

   
}

//when a question choice is clicked,
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers){
            return;
        }
        
        acceptingAnswers = false;
        let selectedAnswerClass;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["choicenumber"];
        const answer = currentQuestion.answer;
        const correctAnswer = document.querySelector("p[data-choicenumber='"+answer+"']");
        
        //Check if selected answer is wrong or right and apply corresponding class style
        if(selectedAnswer == currentQuestion.answer){
            selectedAnswerClass = 'correct';
            selectedChoice.parentElement.classList.add(selectedAnswerClass);
            incrementScore(BONUS);
            clearInterval(startCountdown);
            
        }else{
            selectedAnswerClass = 'incorrect'
            selectedChoice.parentElement.classList.add(selectedAnswerClass);
            clearInterval(startCountdown);
            setTimeout(() => {
                correctAnswer.classList.add('correct');
            },900);
            
        }
        //Remove applied answer classes after some time and load new question
        setTimeout (() => {
            selectedChoice.parentElement.classList.remove(selectedAnswerClass);
            correctAnswer.classList.remove('correct');
            getNewQuestion();
        
        },2000)

        
    })
})

const incrementScore = (num) =>{
    score += num;
    scoreText.innerText = score;
}

//Timer function
const countdownTime = () =>{
  if(timerCounter <= QUESTION_TIME) {
      timerCountdown.innerText = timerCounter;
      timer.style.width = `${timerCounter * 10}%`;
      timerCounter++;
    }else{
       getNewQuestion();
    } 
}
const startCountdown = () => setInterval(countdownTime,1000);


