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

    let child = document.getElementById('flashcard-answers').lastElementChild;

    while (child) {
        document.getElementById('flashcard-answers').removeChild(child);
        child = document.getElementById('flashcard-answers').lastElementChild;
    }

    for(let i = 0; i < object.cards.length; i++){
        reviewCards.push(false);
    }

    setupAnswers();
}

function setupAnswers(){
    let randomCard = undefined;
    progress++

    const progressBar = document.getElementById('review-progress');
    progressBar.innerHTML = "1/" + reviewCards.length + " Flashcards";
    progressBar.style.background = "linear-gradient(135deg, var(--theme-color-1) 0%, var(--theme-color-2) " + 100 * progress / reviewCards.length + "%, var(--bg-color-1) " + 100 * progress / reviewCards.length + "%)";

    while(randomCard == undefined){
        randomCard = Math.floor(Math.random() * reviewCards.length);
        if(reviewCards[randomCard] == true) randomCard = undefined;
    }

    let questionsRandomized = reviewDeck.multipleChoice(randomCard)
    let definitionsArray = questionsRandomized[0];
    let correctAnswers = questionsRandomized[1];

    document.getElementById('flashcard-header-text').innerHTML = reviewDeck.cards[randomCard][0];

    for(let i = 0; i < definitionsArray.length; i++){
        let newDiv = document.createElement('div');
        let newBtn = document.createElement('button');

        newBtn.innerHTML = definitionsArray[i];
        if(correctAnswers.includes(i)){
            let correct = document.createElement('div');
            correct.classList.add('right');
            newDiv.appendChild(correct);
        }

        newDiv.appendChild(newBtn);
        document.getElementById('flashcard-answers').appendChild(newDiv);
    }

    let skipBtn = document.createElement('button');
    skipBtn.innerHTML = "Skip Question";
    skipBtn.id = "skip-question-btn";

    document.getElementById('flashcard-answers').appendChild(skipBtn);
}