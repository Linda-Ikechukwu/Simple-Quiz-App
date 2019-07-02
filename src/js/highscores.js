const highScoreList = document.getElementById('high-score-list');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

highScoreList.innerHTML = highScores.map(highscore =>{
    return  `<li class="high-score">${highscore.username} - ${highscore.score}</li>`
}).join('');