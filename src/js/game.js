const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const choiceContainers = document.getElementsByClassName('choice-container');
const questionCounterText = document.getElementById('counter');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progress-bar-full');
const timer = document.getElementById('timer');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

const timerCountdown = document.querySelector('.timer-countdown');
const nextButton = document.querySelector('.next-button > span');

const chosenCategory = localStorage.getItem('chosenCategory');

let availableQuestions = [];
let currentQuestion = {}; 
let acceptingAnswers = false;
let score = 0;
let timerCounter = 0;
let timerID;

let questions = [];

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    timerID = setInterval(countdownTime,1000);
}



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

//GAME CONSTANTS
const BONUS = 10;
const QUESTION_TIME = 20
const MAX_QUESTIONS = 20;



getNewQuestion = () => {
    //Go to end game page if all questions have been rendered
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore',score);
        localStorage.setItem('maxScore',MAX_QUESTIONS * BONUS);
       return window.location.assign("./end.html");
    }

    //else, first hide the next button
    nextButton.style.display = 'none';

    //then select and render random question from question array
    questionCounter++;
    questionCounterText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`
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
        
        timer.style.width = 0;
        timerCountdown.innerText = 0;

        acceptingAnswers = false;
        clearInterval(timerID);
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["choicenumber"];
        const answer = currentQuestion.answer;
        const correctAnswer = document.querySelector("p[data-choicenumber='"+answer+"']");

        //Check if selected answer is wrong or right and apply corresponding class style
        if(selectedAnswer == currentQuestion.answer){
            selectedChoice.parentElement.classList.add('correct');
            incrementScore(BONUS);
            
        }else{
            selectedChoice.parentElement.classList.add('incorrect');
            setTimeout(() => {
                correctAnswer.parentElement.classList.add('correct');
            },1500);
            
        }
        
        //show next question button
        setTimeout (() => {
            nextButton.style.display = 'inline-block';
        },2000 )
        
        
    })
})

const incrementScore = (num) =>{
    score += num;
    scoreText.innerText = score;
}

//Timer function
const countdownTime = () =>{
  if(acceptingAnswers === true && timerCounter <= QUESTION_TIME) {
      timerCountdown.innerText = timerCounter;
      timer.style.width = `${timerCounter * 5}%`;
      timerCounter++;
      
    }
    else {
    timerCounter = 0;
    timer.style.width = 0;  
    getNewQuestion();
    
  }
}

//Event listner for the next button function
nextButton.addEventListener('click', () => {
    for(let i=0; i < choiceContainers.length; i++){
        choiceContainers[i].classList.remove('correct') 
        choiceContainers[i].classList.remove('incorrect') 
    }
    timerID = setInterval(countdownTime,1000);

})
