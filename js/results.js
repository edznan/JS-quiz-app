const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const finalScore = document.getElementById('finalScore');
const saveScoreBtn = document.getElementById('saveScoreBtn');

const mostRecentScore = localStorage.getItem('mostRecentScore');

MAX_HIGH_SCORES = 5;

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
finalScore.innerText = mostRecentScore;

firstName.addEventListener('keyup', () => {
    if(firstName.value !== '' && lastName.value !== '') {
        saveScoreBtn.disabled = false;
    } else {
        saveScoreBtn.disabled = true;
    }
});

lastName.addEventListener('keyup', () => {
    if(firstName.value !== '' && lastName.value !== '') {
        saveScoreBtn.disabled = false;
    } else {
        saveScoreBtn.disabled = true;
    }
});

saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: Math.floor(Math.random() * 100),
        name: firstName.value + ' ' + lastName.value,
        category: category
    }

    highScores.push(score);
    highScores.sort((a,b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/');

    console.log(highScores);
}

