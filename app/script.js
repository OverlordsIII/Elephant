const cardDiv = document.querySelector("#main-create");

let inputDistribution = [];
let cardIndex = 0;

function addDefinition(index){
    let newInput = document.createElement('input');

    inputDistribution[index - 1]++;

    newInput.placeholder = "Definition " + inputDistribution[index - 1];
    newInput.id = 'dinput-' + index + "-" + inputDistribution[index - 1];

    document.querySelector(".ddiv-" + index).insertBefore(newInput, document.querySelector(".dbtn-" + index));
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
}

function saveChanges(){
    const terms = document.querySelectorAll(".term-input");
    const title = document.querySelector("#create-deck-name");
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
    localStorage.setItem(title.value, newObject);

    document.getElementById('create-modal').classList.add('inactive-modal');
    document.getElementById('create-modal').classList.remove('active-modal')
}

createNewCard();