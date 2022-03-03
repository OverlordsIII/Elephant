const cardDiv = document.querySelector("#main-create");
const colorRange = [["#405DE6", "#833AB4", "#354382"], ["#833AB4", "#E1306C", "#664180"], ["#F56040", "#FCAF45", "#b55641"]];
const bgRange = [["#ffffff", "#f6f7fb"], ["#191919", "#1f1f1f"]];

let inputDistribution = [];
let reviewTerms = [];
let reviewDefinitions = [];
let cardIndex = 0;
let createModalActive = false;
let activeInput = 0;

let currentOpenDeck;
let currentVersion = "v0.1.0-alpha-2";

let controlActive = false;

const Deck = function(){
    this.desc = "A New Elephant Deck";
    this.image = "";
    this.cards = [];
    this.version = currentVersion;
    this.subject = "other"

    this.push = function(term, definitionArray){
        this.cards.push([term, definitionArray]);
    }

    this.pop = function(index){
        delete this.cards[index]
    }

    this.multipleChoice = function(index){
        let randomizedArray = [];
        let correctAnswersIndex = [];

        let indexLength = this.cards[index][1].length;
        
        for(let i = 0; i < indexLength; i++){
            randomizedArray.push(this.cards[index][1][i])
            correctAnswersIndex.push(this.cards[index][1][i])
        }

        for(let i = 0; i < indexLength + Math.floor(Math.random() * (indexLength + 2)); i++){
            let randomInt = Math.floor(Math.random() * this.cards.length)
            if(randomInt == index) i--
            else {
                let item = this.cards[randomInt][1][Math.floor(Math.random() * this.cards[randomInt][1].length)];
                if(!randomizedArray.includes(item)) randomizedArray.push(item);
            }
        }

        for (let i = randomizedArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = randomizedArray[i];
            randomizedArray[i] = randomizedArray[j];
            randomizedArray[j] = temp;
        }

        for(let i = 0; i < randomizedArray.length; i++){
            if(correctAnswersIndex.includes(randomizedArray[i])){
                let tempIndex = correctAnswersIndex.indexOf(randomizedArray[i]);
                correctAnswersIndex[tempIndex] = i;
            }
        }

        return [randomizedArray, correctAnswersIndex];
    }
}

function addDefinition(index, value){
    let newInput = document.createElement('input');

    inputDistribution[index - 1]++;

    newInput.placeholder = "Definition " + inputDistribution[index - 1];
    newInput.id = 'dinput-' + index + "-" + inputDistribution[index - 1];
    newInput.setAttribute("onfocus", "activeInput = " + index);

    if(value != undefined){
        newInput.value = value;
    }

    document.querySelector(".ddiv-" + index).insertBefore(newInput, document.querySelector(".dbtn-" + index));
    document.querySelector("#dinput-" + index + "-" + inputDistribution[index - 1]).focus();
    document.querySelector("#dinput-" + index + "-" + inputDistribution[index - 1]).scrollIntoView();
}

function deleteCard(index){
    const terms = document.querySelectorAll(".term-input");
    const title = document.querySelector("#create-deck-name").value;
    const description = document.querySelector("#create-deck-desc");
    const img = document.querySelector("#create-deck-img");

    let newDeck = new Deck();

    newDeck.changeDesc(description.value);
    newDeck.changeImage(img.value);

    let definitionList = [];

    for(let i = 0; i < terms.length; i++){
        for(let j = 0; j < inputDistribution[i]; j++){
            definitionList.push(document.getElementById("dinput-" + (i + 1) + "-" + (j + 1)).value);
        }
        newDeck.push(terms[i].value, definitionList);
        definitionList = [];
    }

    newDeck.pop(index - 1);

    localStorage.setItem(title, JSON.stringify(newDeck));
    editDeck(currentOpenDeck)
}

function createNewCard(term, descriptionList){
    let newDiv = document.createElement('div');
    let indexPara = document.createElement('p')
    let childDiv = document.createElement('div');
    let termInput = document.createElement('input');
    let definitionDiv = document.createElement('div');
    let definitionBtn = document.createElement('button');

    inputDistribution.push(0);

    cardIndex++;
    indexPara.innerHTML = cardIndex;
    indexPara.id = "card-index-para-" + cardIndex;

    let deleteImg = document.createElement('img');

    deleteImg.src = "./icons/delete.svg";
    deleteImg.setAttribute('onclick', 'deleteCard(' + cardIndex + ')')
    indexPara.appendChild(deleteImg);

    termInput.placeholder = "Term"
    termInput.setAttribute('onfocus', "activeInput = " + cardIndex);
    definitionBtn.innerHTML = "+ Add Answer"
    definitionBtn.setAttribute('onclick', 'addDefinition(' + cardIndex + ')');
    definitionDiv.classList.add("ddiv-" + cardIndex);
    definitionBtn.classList.add("dbtn-" + cardIndex);
    termInput.classList.add("term-input")

    if(term !== undefined) termInput.value = term;

    definitionDiv.appendChild(definitionBtn);

    childDiv.appendChild(termInput);
    childDiv.appendChild(definitionDiv);

    newDiv.appendChild(indexPara);
    newDiv.appendChild(childDiv);
    newDiv.classList.add('card-div');
    cardDiv.insertBefore(newDiv, document.querySelector("#new-card-btn"));

    if(descriptionList == undefined || descriptionList.length == 0){
        addDefinition(cardIndex, "");
    } else {
        for(let i = 0; i < descriptionList.length; i++){
            addDefinition(cardIndex, descriptionList[i]);
        }
    }

    termInput.focus();
    if(document.querySelectorAll(".term-input")[cardIndex - 1] != undefined) document.querySelectorAll(".term-input")[cardIndex - 1].scrollIntoView();
}

function saveChanges(){
    const terms = document.querySelectorAll(".term-input");
    const title = document.querySelector("#create-deck-name").value;
    const description = document.querySelector("#create-deck-desc");
    const img = document.querySelector("#create-deck-img");
    const subjectElem = document.getElementById('subject-input');

    let newDeck = new Deck();

    newDeck.desc = description.value;
    newDeck.image = img.value;
    newDeck.subject = subjectElem.options[subjectElem.selectedIndex].value;


    let definitionList = [];

    for(let i = 0; i < terms.length; i++){
        for(let j = 0; j < inputDistribution[i]; j++){
            definitionList.push(document.getElementById("dinput-" + (i + 1) + "-" + (j + 1)).value);
        }
        newDeck.push(terms[i].value, definitionList);
        definitionList = [];
    }

    localStorage.setItem(title, JSON.stringify(newDeck));

    document.getElementById('create-modal').classList.add('inactive-modal');
    document.getElementById('create-modal').classList.remove('active-modal');
    createModalActive = false;
    loadDecks(undefined);
}

function createDeck(){
    cardIndex = 0;
    inputDistribution = [];
    let child = document.getElementById('main-create').lastElementChild;

    while (child) {
        document.getElementById('main-create').removeChild(child);
        child = document.getElementById('main-create').lastElementChild;
    }

    document.getElementById('create-deck-name').value = "";
    document.getElementById('create-deck-desc').value = "";
    document.getElementById('create-deck-img').value = "";

    createNewCard(undefined, undefined);

    let newBtn = document.createElement('button');
    newBtn.id = "new-card-btn";
    newBtn.innerHTML = "+ Add New Card"
    newBtn.setAttribute('onclick', "createNewCard(undefined, undefined)");

    document.getElementById('main-create').appendChild(newBtn);

    //System.out.print("Something")

    document.getElementById('create-header').innerHTML = "Create A New Deck";
    document.getElementById('create-description').innerHTML = "You will now create a new Elephant Study Deck that you can access on your computer at any time. Good luck studying!"
    document.getElementById('create-modal').classList.remove('inactive-modal');
    document.getElementById('create-modal').classList.add('active-modal');
    createModalActive = true;
}

function deleteDeck(index){
    localStorage.removeItem(localStorage.key(index))
    loadDecks(undefined);
}

function editDeck(index){
    let object = JSON.parse(localStorage.getItem(localStorage.key(index)));
    currentOpenDeck = index;
    //localStorage.removeItem(localStorage.key(index))
    inputDistribution = [];
    cardIndex = 0;

    let child = document.getElementById('main-create').lastElementChild;

    while (child) {
        document.getElementById('main-create').removeChild(child);
        child = document.getElementById('main-create').lastElementChild;
    }

    document.getElementById('create-deck-name').value = localStorage.key(index);
    document.getElementById('create-deck-desc').value = object.desc;
    document.getElementById('create-deck-img').value = object.image;
    document.getElementById('subject-input').value = object.subject;

    let newBtn = document.createElement('button');
    newBtn.id = "new-card-btn";
    newBtn.innerHTML = "+ Add New Card"
    newBtn.setAttribute('onclick', "createNewCard(undefined, undefined)");

    document.getElementById('main-create').appendChild(newBtn);

    for(let i = 0; i < object.cards.length; i++){
        createNewCard(object.cards[i][0], object.cards[i][1])
    }

    document.getElementById('create-header').innerHTML = "Edit An Existing Deck";
    document.getElementById('create-description').innerHTML = "You will now edit an existing Elephant Study Deck that you can access on your computer at any time. Good luck studying!"
    document.getElementById('create-modal').classList.remove('inactive-modal');
    document.getElementById('create-modal').classList.add('active-modal');
    createModalActive = true;
}

function loadDecks(sort){
    let child = document.getElementById('main-container').lastElementChild;

    while (child) {
        document.getElementById('main-container').removeChild(child);
        child = document.getElementById('main-container').lastElementChild;
    }

    for(let i = 0; i < localStorage.length; i++){
        let newDiv = document.createElement('div');
        let imageDiv = document.createElement('div');
        let textDiv = document.createElement('div');
        let header = document.createElement('h1');
        let subjectDiv = document.createElement('div');
        let subject = document.createElement('img')
        let para = document.createElement('p');
        let button = document.createElement('button');
        let edit = document.createElement('button');
        let deleteItem = document.createElement('img');
        let outdated;

        let deck = JSON.parse(localStorage.getItem(localStorage.key(i)));

        if(localStorage.key(i) !== "theme-index" && (deck.subject === sort || sort === undefined)) {

            if (deck.version !== currentVersion) {
                outdated = document.createElement('div');
                outdated.classList.add('outdated-div');
                outdated.innerHTML = "OUTDATED DECK";
            }

            header.innerHTML = localStorage.key(i)
            subject.src = "./icons/subjects/" + deck.subject + ".svg";
            para.innerHTML = deck.desc;

            if (deck.image === '') {
                let randomColor = colorRange[Math.floor(Math.random() * colorRange.length)];
                imageDiv.style.background = "linear-gradient(135deg, " + randomColor[0] + ", " + randomColor[1] + ")";
            } else {
                imageDiv.style.backgroundImage = "url('" + deck.image + "')";
            }

            button.innerHTML = "Open Deck"
            edit.innerHTML = "Edit Deck";
            button.setAttribute('onclick', "openDeck(" + i + ")");
            edit.setAttribute('onclick', "editDeck(" + i + ")");
            deleteItem.src = "icons/delete.svg";
            deleteItem.setAttribute("onclick", "deleteDeck(" + i + ")")

            subjectDiv.appendChild(subject);

            textDiv.appendChild(header);
            textDiv.appendChild(subjectDiv)
            textDiv.appendChild(para);
            textDiv.appendChild(button);
            textDiv.appendChild(edit);

            newDiv.appendChild(imageDiv);
            if (deck.version !== currentVersion) newDiv.appendChild(outdated);
            newDiv.appendChild(textDiv);

            newDiv.appendChild(deleteItem);

            document.getElementById('main-container').appendChild(newDiv);
        }
    }
}

function addReviewBtn(text){
    let newBtn = document.createElement('button');
    newBtn.innerHTML = text;

    document.getElementById('flashcard-answers').appendChild(newBtn);
}

document.addEventListener('keydown', function(e){
    if(createModalActive){
        if(e.keyCode === 27){
            closeCreateModal();
        } else if(e.keyCode === 13){
            if(controlActive) saveChanges();
            else createNewCard(undefined, undefined);
        } else if(e.keyCode === 68 && controlActive){
            e.preventDefault();
            e.stopPropagation();
            addDefinition(activeInput);
        }
    } else if(e.keyCode === 78 && document.getElementById('review-modal').classList.contains('inactive-modal')){
        createDeck();
    } else if(document.getElementById('review-modal').classList.contains('active-modal')){
        if(e.keyCode === 27) closeDeck();
    }

    if(e.keyCode === 17) controlActive = true;

})

document.addEventListener('keyup', function(e){
    if(e.keyCode === 17){
        controlActive = false;
    }
})

window.onload = function(){
    let mainTheme = localStorage.getItem('theme-index');
    console.log(mainTheme);
    try{
        mainTheme = JSON.parse(mainTheme)
    } catch {
        mainTheme = [0, true, 4]
    }

    if(mainTheme[1] === true){
        document.getElementById('dark-mode-input').checked = true;
    }

    localStorage.setItem('theme-index', JSON.stringify(mainTheme));

    setTheme(mainTheme[0], mainTheme[2]);
}

loadDecks(undefined);
console.log("Thank you for choosing %cElephant%c... also why are you looking in the console??", "color:#405DE6")