const sadSmiley = '&#128542; ';
const confusedSmiley = '&#128528;';
const HappySmiley = '&#128515;';

const username = document.getElementById('username');
const saveHighScoreBtn = document.getElementById('save-highscore-btn');
const finalScore = document.getElementById('final-score');
const maxScore = document.getElementById('max-score');
const scoreSmiley = document.getElementById('score-smiley');


const mostRecentScore = localStorage.getItem('mostRecentScore');
const maxScoreText = localStorage.getItem('maxScore'); 

if(mostRecentScore <=  0.33*maxScoreText){
    scoreSmiley.innerHTML = sadSmiley;
}else if(mostRecentScore > 0.33*maxScoreText && mostRecentScore <= 0.66*maxScoreText){
    scoreSmiley.innerHTML = confusedSmiley;
}else{
    scoreSmiley.innerHTML = HappySmiley;
}
 
finalScore.innerText = mostRecentScore;
maxScore.innerText = maxScoreText;


const highScores = JSON.parse(localStorage.getItem('highScores')) || [];


username.addEventListener('keyup', () => {
    saveHighScoreBtn.disabled = !username.value;
});
const saveHighScore = e => {
    e.preventDefault();

    const score ={
        username: username.value,
        score: mostRecentScore
    }
    highScores.push(score);
    highScores.sort( (a,b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem('highScores',JSON.stringify(highScores));

    window.location.assign('./index.html');

}