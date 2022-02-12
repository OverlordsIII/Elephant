const cardDiv = document.querySelector("#main-create");
const colorRange = [["#405DE6", "#833AB4", "#354382"], ["#833AB4", "#E1306C", "#664180"], ["#F56040", "#FCAF45", "#b55641"]];
const bgRange = [["#ffffff", "#f6f7fb"], ["#191919", "#1f1f1f"]];

let inputDistribution = [];
let cardIndex = 0;
let createModalActive = false;
let activeInput = 0;

let controlActive = false;

const Deck = function(){
    this.desc = "A New Elephant Deck";
    this.image = "";
    this.cards = [];

    this.push = function(term, definitionArray){
        this.cards.push([term, definitionArray]);
    }

    this.pop = function(index){
        delete this.cards[index]
    }

    this.changeImage = function(url) {
        this.image = url;
    }

    this.changeDesc = function(desc){
        this.desc = desc;
    }
}

function toggleSettingsModal(){
    if(document.getElementById('settings-modal').classList.contains('active-modal')){
        document.getElementById('settings-modal').classList.remove('active-modal');
        document.getElementById('settings-modal').classList.add('inactive-modal');
    } else {
        document.getElementById('settings-modal').classList.add('active-modal');
        document.getElementById('settings-modal').classList.remove('inactive-modal');
    }
}

function setTheme(themeIndex){
    document.documentElement.style.setProperty('--theme-color-1', colorRange[themeIndex][0]);
    document.documentElement.style.setProperty('--theme-color-2', colorRange[themeIndex][1]);
    document.documentElement.style.setProperty('--theme-color-dark', colorRange[themeIndex][2]);
    localStorage.setItem('theme-index', themeIndex);
}

function setMode(){
    if(document.getElementById("dark-mode-input").checked){
        document.documentElement.style.setProperty('--bg-color-1', bgRange[1][0]);
        document.documentElement.style.setProperty('--bg-color-2', bgRange[1][1]);
        document.documentElement.style.setProperty('--text-color', "white");
        document.documentElement.style.setProperty('--border-color', "#101010");
        document.documentElement.style.setProperty('--image-invert', "1");
    } else {
        document.documentElement.style.setProperty('--bg-color-1', bgRange[0][0]);
        document.documentElement.style.setProperty('--bg-color-2', bgRange[0][1]);
        document.documentElement.style.setProperty('--text-color', "black");
        document.documentElement.style.setProperty('--border-color', "lightgray");
        document.documentElement.style.setProperty('--image-invert', "0");
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
    termInput.placeholder = "Term"
    termInput.setAttribute('onfocus', "activeInput = " + cardIndex);
    definitionBtn.innerHTML = "+ Add Answer"
    definitionBtn.setAttribute('onclick', 'addDefinition(' + cardIndex + ')');
    definitionDiv.classList.add("ddiv-" + cardIndex);
    definitionBtn.classList.add("dbtn-" + cardIndex);
    termInput.classList.add("term-input")

    if(term != undefined){
        termInput.value = term;
    }

    definitionDiv.appendChild(definitionBtn);

    childDiv.appendChild(termInput);
    childDiv.appendChild(definitionDiv);

    newDiv.appendChild(indexPara);
    newDiv.appendChild(childDiv);
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

    let newDeck = new Deck();

    newDeck.changeDesc(description.value);
    newDeck.changeImage(img.value);

    let termsObj = {}
    let definitionList = [];

    for(let i = 0; i < terms.length; i++){
        for(let j = 0; j < inputDistribution[i]; j++){
            definitionList.push(document.getElementById("dinput-" + (i + 1) + "-" + (j + 1)).value);
        }
        newDeck.push(terms[i].value, definitionList);
        definitionList = [];
    }

    localStorage.setItem(title, JSON.stringify(newDeck));
    console.log(newDeck);

    document.getElementById('create-modal').classList.add('inactive-modal');
    document.getElementById('create-modal').classList.remove('active-modal');
    createModalActive = false;
    loadDecks();
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

function editDeck(index){
    let object = JSON.parse(localStorage.getItem(localStorage.key(index)));
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

    console.log(object);

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

function deleteDeck(index){
    localStorage.removeItem(localStorage.key(index))
    loadDecks();
}

function openDeck(index){
    document.getElementById('review-modal').classList.add('active-modal');
    document.getElementById('review-modal').classList.remove('inactive-modal');
}

function closeDeck(){
    document.getElementById('review-modal').classList.remove('active-modal');
    document.getElementById('review-modal').classList.add('inactive-modal');
}

function loadDecks(){
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
        let para = document.createElement('p');
        let button = document.createElement('button');
        let edit = document.createElement('button');
        let deleteItem = document.createElement('img');

        if(localStorage.key(i) != "theme-index"){
            let deck = JSON.parse(localStorage.getItem(localStorage.key(i)));

            header.innerHTML = localStorage.key(i)
            para.innerHTML = deck.desc;

            if(deck.image == ''){
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

            textDiv.appendChild(header);
            textDiv.appendChild(para);
            textDiv.appendChild(button);
            textDiv.appendChild(edit);

            newDiv.appendChild(imageDiv);
            newDiv.appendChild(textDiv);

            newDiv.appendChild(deleteItem);

            document.getElementById('main-container').appendChild(newDiv);
        }
    }
}

function closeCreateModal(){
    document.getElementById('create-modal').classList.add('inactive-modal');
    document.getElementById('create-modal').classList.remove('active-modal');
    createModalActive = false;
}

document.addEventListener('keydown', function(e){
    if(createModalActive){
        if(e.keyCode == 27){
            closeCreateModal();
        } else if(e.keyCode == 13){
            if(controlActive) saveChanges();
            else createNewCard(undefined, undefined);
        } else if(e.keyCode == 68 && controlActive){
            e.preventDefault();
            e.stopPropagation();
            addDefinition(activeInput);
        }
    } else if(e.keyCode == 78 && document.getElementById('review-modal').classList.contains('inactive-modal')){
        createDeck();
    }

    if(e.keyCode == 17){
        controlActive = true;
    }

})

document.addEventListener('keyup', function(e){
    if(e.keyCode == 17){
        controlActive = false;
    }
})

window.onload = function(){
    let theme = localStorage.getItem('theme-index');
    theme = theme ?? 0;

    localStorage.setItem('theme-index', theme);

    setTheme(localStorage.getItem('theme-index'));
}

loadDecks();
