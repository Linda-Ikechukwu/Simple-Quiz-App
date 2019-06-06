const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const questionCounterText = document.getElementById('counter');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progress-bar-full');
const timer = document.getElementById('timer');
const timerCountdown = document.querySelector('.timer-countdown')

let availableQuestions = [];
let currentQuestion = {}; 
let acceptingAnswers = false;
let score = 0;
let timerCounter = 0;


let questions = [
    {
        question : 'llll rereree',
        choice1: 'hello',
        choice2: 'what',
        choice3: 'yes',
        choice4: 'for',
        answer: 1
    },
    {
        question : 'llll rereree pppppt',
        choice1: 'hello',
        choice2: 'hi',
        choice3: 'what',
        choice4: 'yes',
        answer: 2
    },
    {
        question : 'llll rereree',
        choice1: 'hello',
        choice2: 'what',
        choice3: 'yes',
        choice4: 'for',
        answer: 3
    },
    {
        question : 'llll rereree',
        choice1: 'hello',
        choice2: 'what',
        choice3: 'yes',
        choice4: 'for',
        answer: 4
    }
]

//GAME CONSTANTS
const BONUS = 10;
const QUESTION_TIME = 10
const MAX_QUESTIONS = questions.length;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    
}

getNewQuestion = () => {
    //Go to end game page if all questions have been rendered
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
       return window.location.assign("./end.html");
    }
    //select random question from question array
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
            },500);
            
        }
        //Remove applied answer classes and load new question
        setTimeout (() => {
            //Remove applied answer classes
            selectedChoice.parentElement.classList.remove(selectedAnswerClass);
            correctAnswer.classList.remove('correct');
            getNewQuestion();
        },1500)

        
    })
})
const incrementScore = (num) =>{
    score += num;
    scoreText.innerText = score;
}

const countdownTime = () =>{
  if(timerCounter <= QUESTION_TIME) {
      timerCountdown.innerText = timerCounter;
      timer.style.width = `${timerCounter * 10}%`
      timerCounter++;
   }else{
       timerCounter = 0;
       getNewQuestion();
   } 
}
const startCountdown = setInterval(countdownTime,1000);

startGame();
