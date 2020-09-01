const question = document.getElementById('question');

// make an Array of HTML Collection element
const choices = Array.from(document.getElementsByClassName('choice-text'));

const progressText = document.getElementById('progressText');
const progressBarFull = document.getElementById('progressBarFull');
const scoreText = document.getElementById('score');
const loader = document.getElementById('loader');
const ispit = document.getElementById('ispit');

let currentQuestion = {};
let acceptingAnswer = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const cat_uri = getParameterByName('cat_uri');

let questions = fetch(`https://opentdb.com/api.php?amount=10&category=${cat_uri}&difficulty=medium&type=multiple`).then(
    res => {
        return res.json();
    }
).then(loadedQuestions => {
    questions = loadedQuestions.results.map(loadedQ => {
        const formattedQuestion = {
            question: loadedQ.question
        };
        const answerChoices = [... loadedQ.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random()*3) + 1;
        answerChoices.splice(formattedQuestion.answer -1, 0, loadedQ.correct_answer);
        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index+1)] = choice;
        });
        return formattedQuestion;
    });
    startTest();
}).catch(err => {
    console.error(err);
});

const CORRECT_BONUS = 2;
let MAX_QUESTIONS = 0;

startTest = () => {
    // get test type
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const type = urlParams.get('type');

    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    MAX_QUESTIONS = availableQuestions.length;
    getNewQuestion();
    ispit.classList.remove('hidden');
    loader.classList.add('hidden');
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        // go to finish page
        return window.location.assign('/results.html');
    }

    // update the progress bar
    questionCounter++;
    progressBarFull.style.width = (questionCounter / MAX_QUESTIONS) * 100 + '%';
    console.log(progressBarFull.style.width);

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswer = true;
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswer){
            return;
        }

        acceptingAnswer = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = 
        selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if(classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }
        
        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 500);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
