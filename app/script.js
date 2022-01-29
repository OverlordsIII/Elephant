const cardDiv = document.querySelector("#main-create");
const colorRange = ["#E74C3C", "#3498DB", "#1ABC9C", "#F1C40F"];

let inputDistribution = [];
let cardIndex = 0;
let createModalActive = false;
let activeInput = 0;

let controlActive = false;

function addDefinition(index){
    let newInput = document.createElement('input');

    inputDistribution[index - 1]++;

    newInput.placeholder = "Definition " + inputDistribution[index - 1];
    newInput.id = 'dinput-' + index + "-" + inputDistribution[index - 1];
    newInput.setAttribute("onfocus", "activeInput = " + index);

    document.querySelector(".ddiv-" + index).insertBefore(newInput, document.querySelector(".dbtn-" + index));
    document.querySelector("#dinput-" + index + "-" + inputDistribution[index - 1]).focus();
    document.querySelector("#dinput-" + index + "-" + inputDistribution[index - 1]).scrollIntoView();
}

function createNewCard(){
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

    definitionDiv.appendChild(definitionBtn);

    childDiv.appendChild(termInput);
    childDiv.appendChild(definitionDiv);

    newDiv.appendChild(indexPara);
    newDiv.appendChild(childDiv);
    cardDiv.insertBefore(newDiv, document.querySelector("#new-card-btn"));

    addDefinition(cardIndex);
    termInput.focus();
    document.querySelectorAll(".term-input")[cardIndex - 1].scrollIntoView();
}

function saveChanges(){
    const terms = document.querySelectorAll(".term-input");
    const title = document.querySelector("#create-deck-name").value;
    const description = document.querySelector("#create-deck-desc");
    const img = document.querySelector("#create-deck-img");

    let newObject = {
        desc: description.value,
        image: img.value,
        cards:0
    }

    let termsObj = {}
    let tempList = [];

    for(let i = 0; i < terms.length; i++){
        for(let j = 0; j < inputDistribution[i]; j++){
            tempList.push(document.getElementById("dinput-" + (i + 1) + "-" + (j+1)).value);
        }
        termsObj[terms[i].value] = tempList;

        tempList = [];
    }

    newObject.cards = termsObj;
    
    let newObj = JSON.stringify(newObject)

    localStorage.setItem(title, newObj);
    console.log(termsObj);

    document.getElementById('create-modal').classList.add('inactive-modal');
    document.getElementById('create-modal').classList.remove('active-modal');
    createModalActive = false;
    let child = document.getElementById('main-container').lastElementChild;

    while (child) {
        document.getElementById('main-container').removeChild(child);
        child = document.getElementById('main-container').lastElementChild;
    }
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

    createNewCard();

    let newBtn = document.createElement('button');
    newBtn.id = "new-card-btn";
    newBtn.innerHTML = "+ Add New Card"
    newBtn.setAttribute('onclick', "createNewCard()");

    document.getElementById('main-create').appendChild(newBtn);

    //System.out.print("Something")

    document.getElementById('create-modal').classList.remove('inactive-modal');
    document.getElementById('create-modal').classList.add('active-modal');
    createModalActive = true;
}

function loadDecks(){
    for(let i = 0; i < localStorage.length; i++){
        let newDiv = document.createElement('div');
        let imageDiv = document.createElement('div');
        let textDiv = document.createElement('div');
        let header = document.createElement('h1');
        let para = document.createElement('p');
        let button = document.createElement('button');
        let edit = document.createElement('button');
        let deleteItem = document.createElement('img');

        let object = JSON.parse(JSON.stringify(localStorage.getItem(localStorage.key(i))))
        object = object.split('"')

        header.innerHTML = localStorage.key(i)
        para.innerHTML = Object.values(object)[3];

        if(Object.values(object)[7] == ''){
            imageDiv.style.background = colorRange[Math.floor(Math.random() * colorRange.length)];
        } else {
            imageDiv.style.backgroundImage = "url('" + Object.values(object)[7] + "')";
        }

        button.innerHTML = "Open Deck"
        edit.innerHTML = "Edit Deck";
        deleteItem.src = "icons/delete.svg"

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
            else createNewCard();
        } else if(e.keyCode == 68 && controlActive){
            e.preventDefault();
            e.stopPropagation();
            addDefinition(activeInput);
        }
    } else if(e.keyCode == 78){
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

loadDecks();