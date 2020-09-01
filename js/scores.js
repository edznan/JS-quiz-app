const scoresList = document.getElementById('highScoresList');
const scores = JSON.parse(localStorage.getItem('highScores')) || [];

scoresList.innerHTML = scores.map(score => {
    return `<li class="high-score">${score.name}-${score.score}</li>`;
}).join("");
