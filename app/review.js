let reviewCards = [];
let correctAnswers = [];
let progress = 0;
let reviewDeck;

function setupReview(index){
    reviewCards = []
    progress = 0;

    const object = JSON.parse(localStorage.getItem(localStorage.key(index)));
    reviewDeck = new Deck();

    reviewDeck.cards = object.cards;

    for(let i = 0; i < object.cards.length; i++){
        reviewCards.push(false);
    }

    setupAnswers();
}

function checkAnswer(index){

    let answerDiv = document.createElement('div');
    const parentElem = document.querySelectorAll('.flashcard-def-btn')[index];

    if(correctAnswers.includes(index)){
        correctAnswers[correctAnswers.indexOf(index)] = true;
        answerDiv.classList.add('right');
    } else {
        answerDiv.classList.add('wrong');
    }

    let complete = true;
    let i = 0;

    while(complete){
        if(correctAnswers[i] != true) {
            complete = false;
            break;
        }
        else if(i + 1 == correctAnswers.length) break;
        i++
    }

    if(complete){
        setupAnswers();
    }

    parentElem.appendChild(answerDiv);
}

function skipQuestion(index){
    progress--;
    setupAnswers();
    reviewCards[index] = false;
}

function setupAnswers(){
    let randomCard = undefined;
    progress++

    let child = document.getElementById('flashcard-answers').lastElementChild;

    while (child) {
        document.getElementById('flashcard-answers').removeChild(child);
        child = document.getElementById('flashcard-answers').lastElementChild;
    }

    let complete = true;

    for(let i = 0; i < reviewCards.length; i++){
        if(reviewCards[i] != true){
            complete = false;
            break;
        }
    }

    if(complete) return;

    const progressBar = document.getElementById('review-progress');
    progressBar.innerHTML = progress + "/" + reviewCards.length + " Flashcards";
    progressBar.style.background = "linear-gradient(135deg, var(--theme-color-1) 0%, var(--theme-color-2) " + 100 * progress / reviewCards.length + "%, var(--bg-color-1) " + 100 * progress / reviewCards.length + "%)";

    while(randomCard == undefined){
        randomCard = Math.floor(Math.random() * reviewCards.length);
        if(reviewCards[randomCard] == true) randomCard = undefined;
    }

    reviewCards[randomCard] = true;

    let questionsRandomized = reviewDeck.multipleChoice(randomCard)
    let definitionsArray = questionsRandomized[0];
    correctAnswers = questionsRandomized[1];

    document.getElementById('flashcard-header-text').innerHTML = reviewDeck.cards[randomCard][0];

    for(let i = 0; i < definitionsArray.length; i++){
        let newDiv = document.createElement('div');
        let newBtn = document.createElement('button');

        newBtn.setAttribute('onclick', "checkAnswer(" + i + ")")
        newBtn.innerHTML = definitionsArray[i];
        newDiv.appendChild(newBtn);
        newDiv.classList.add('flashcard-def-btn')
        document.getElementById('flashcard-answers').appendChild(newDiv);
    }

    let skipBtn = document.createElement('button');
    skipBtn.innerHTML = "Skip Question";
    skipBtn.id = "skip-question-btn";
    skipBtn.setAttribute('onclick', "skipQuestion(" + randomCard + ")");

    document.getElementById('flashcard-answers').appendChild(skipBtn);
}