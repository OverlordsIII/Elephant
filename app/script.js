const cardDiv = document.querySelector("#main-create");

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
    localStorage.setItem(title, JSON.stringify(newObject));
    console.log(termsObj);

    let localObj = window.localStorage.getItem(title)

    console.log(JSON.parse(localObj))

    document.getElementById('create-modal').classList.add('inactive-modal');
    document.getElementById('create-modal').classList.remove('active-modal');
    createModalActive = false;
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