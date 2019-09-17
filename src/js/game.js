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
let timerCounter;
let questions = [];

//GAME CONSTANTS
const BONUS = 10;
const QUESTION_TIME = 20;
const MAX_QUESTIONS = 20;

const chosenCategory = localStorage.getItem('chosenCategory');

//Function that starts up the game after questions have been fetched..
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');

    
}

//asynchronous function to fetch questions from the json array of the selected category.
fetch(`./questions/${chosenCategory}.json`)
   .then( response => {
        return response.json();
    })
   .then(loadedQuestions => {
      questions = loadedQuestions;
      startGame();
   })
   .catch(err => {
       console.error(err);
});

//Function that fetches a question at a random index from the array of the chosen json file/category
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
    
}

//when a question choice is clicked,
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers){
            return;
        }
        
        //timer.style.width = 0;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["choicenumber"];
        const answer = currentQuestion.answer;
        const correctAnswer = document.querySelector("p[data-choicenumber='"+answer+"']");
        const classToapply = selectedAnswer === answer ? 'correct':'incorrect';
        
        //Check if answer is correct and increment scores, then make the selected choice green.
        if(classToapply === 'incorrect'){
            selectedChoice.classList.add('incorrect');
            setTimeout (() => {
                correctAnswer.classList.add('correct');
            }, 1000);
        }else {
            //Check if selected answer is wrong or right and apply corresponding class style
            correctAnswer.classList.add('correct'); 
            incrementScore(BONUS);
        }

        
        
       //Remove applied answer classes after and load new question after 2 seconds
        setTimeout (() => {
            selectedChoice.classList.remove('incorrect');
            correctAnswer.classList.remove('correct');
            getNewQuestion();
        },3000);

        
    });
});

//Function to increment score by the stated bonus constant once a question is answered correctly.
const incrementScore = (num) =>{
    score += num;
    scoreText.innerText = score;
}

//Timer function
/*const countdownTime = () =>{
      timerCountdown.innerText = timerCounter;
      timer.style.width = `${timerCounter * 5}%`;
      timerCounter++;
  
}

const startCountdown = () => setInterval(countdownTime,1000);

if(timerCounter <= QUESTION_TIME){
    startCountdown();
}else{
    timerCounter = 0;
    getNewQuestion();
}*/


