const cardDiv = document.querySelector("#main-create");
const colorRange = [["#405DE6", "#833AB4", "#354382"], ["#833AB4", "#E1306C", "#664180"], ["#F56040", "#FCAF45", "#b55641"]];
const bgRange = [["#ffffff", "#f6f7fb"], ["#191919", "#1f1f1f"]];

let inputDistribution = [];
let reviewTerms = [];
let reviewDefinitions = [];
let cardIndex = 0;
let createModalActive = false;
let activeInput = 0;

let uploadedDeck;

let currentOpenDeck;
let currentVersion = "v0.1.0-beta";

let controlActive = false;

const Notifications = function(){
    this.images = [];
    this.notifs = [];
    this.dates = [];

    this.push = function(images, notifs, dates){
        this.images.push(images);
        this.notifs.push(notifs);
        this.dates.push(dates);
    }

    this.deleteOld = function(){
        let today = new Date();

        for(let i = 0; i < this.dates.length; i++){
            let difference = (today.getTime - this.dates[i]) / 1000;
            difference = difference / 2592000;

            if(Math.abs(Math.round(difference)) > 1){
                delete this.images[i];
                delete this.notifs[i];
                delete this.dates[i];
            }
        }
    }
}

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

function setupNotifications(){
    let child = document.getElementById('notifications-modal').lastElementChild;

    while (child) {
        document.getElementById('notifications-modal').removeChild(child);
        child = document.getElementById('notifications-modal').lastElementChild;
    }

    let notifStorage = localStorage.getItem('notifications-storage');
    notifStorage = JSON.parse(notifStorage);

    let newNotif = new Notifications();
    newNotif.images = notifStorage.images;
    newNotif.notifs = notifStorage.notifs;
    newNotif.dates = notifStorage.dates;

    for(let i = newNotif.notifs.length - 1; i > -1; i--){
        let notifDiv = document.createElement('div');
        let notifImg = document.createElement('img');
        let notifBody = document.createElement('div');
        let para = document.createElement('p');
        let dateH6 = document.createElement('h6');

        notifImg.src = "./icons/" + newNotif.images[i] + ".svg";
        para.innerHTML = newNotif.notifs[i];

        let newDate = new Date(newNotif.dates[i])
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        dateH6.innerHTML = months[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear();

        notifBody.appendChild(para);
        notifBody.appendChild(dateH6);

        notifDiv.appendChild(notifImg);
        notifDiv.appendChild(notifBody);
        document.getElementById('notifications-modal').appendChild(notifDiv)
    }
}

document.getElementById('import-file-trigger').onclick = function(){
    document.getElementById('import-file-upload').click();
}

document.getElementById('import-file-upload').addEventListener('change', function(e){
    const fileList = document.getElementById('import-file-upload').files;
    document.getElementById('import-deck-modal-file').innerHTML = fileList[Object.keys(fileList)[0]].name;
});

function uploadDeck(){
    importDeck()

    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(document.getElementById('import-file-upload').files[0])
}

function addNotification(image, notif){
    let today = new Date();
    let notifStorage = localStorage.getItem('notifications-storage');
    notifStorage = JSON.parse(notifStorage);

    let newNotif = new Notifications();
    newNotif.images = notifStorage.images;
    newNotif.notifs = notifStorage.notifs;
    newNotif.dates = notifStorage.dates;

    newNotif.push(image, notif, today.getTime());

    localStorage.setItem('notifications-storage', JSON.stringify(newNotif));

    setupNotifications()
}

function handleFileLoad(event) {
    uploadedDeck = event.target.result;

    const fileList = document.getElementById('import-file-upload').files;
    let fileName = fileList[Object.keys(fileList)[0]].name;
    fileName = fileName.replaceAll('_', ' ')
    fileName = fileName.substring(0, fileName.length - 6)

    addNotification("add_deck", "Imported New Deck: " + fileName);

    localStorage.setItem(fileName, uploadedDeck)

    loadDecks();
}

function addDefinition(index, value){
    let newInput = document.createElement('input');

    inputDistribution[index - 1]++;

    newInput.placeholder = "Definition " + inputDistribution[index - 1];
    newInput.id = 'dinput-' + index + "-" + inputDistribution[index - 1];
    newInput.setAttribute("onfocus", "activeInput = " + index);

    if(value !== undefined){
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

    addNotification("create", "Deck Created/Edited: " + title);

    document.getElementById('create-modal').classList.add('inactive-modal');
    document.getElementById('create-modal').classList.remove('active-modal');
    createModalActive = false;
    loadDecks(undefined);
}

function exportData() {
    saveChanges()

    let blob = new Blob([localStorage.getItem(document.getElementById('create-deck-name').value)],
        { type: ".edeck;charset=utf-8" });
    saveAs(blob, document.getElementById('create-deck-name').value + ".edeck");
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
    let notifStorage = localStorage.getItem('notifications-storage');

    addNotification("delete", "Deleted Deck: " + localStorage.key(index));

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

        if(localStorage.key(i) !== "theme-index" && localStorage.key(i) !== "notifications-storage" && (deck.subject === sort || sort === undefined)) {

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
    let notifStorage = localStorage.getItem('notifications-storage');

    try{
        mainTheme = JSON.parse(mainTheme)
    } catch {
        mainTheme = [0, true, 4]
    }

    try { notifStorage = JSON.parse(notifStorage)}
    catch {notifStorage = new Notifications()}

    if(notifStorage == null) notifStorage = new Notifications()

    if(mainTheme[1] === true){
        document.getElementById('dark-mode-input').checked = true;
    }

    localStorage.setItem('theme-index', JSON.stringify(mainTheme));
    localStorage.setItem('notifications-storage', JSON.stringify(notifStorage))

    setTheme(mainTheme[0], mainTheme[2]);
    setupNotifications()
}

loadDecks(undefined);
console.log("Thank you for choosing %cElephant%c... also why are you looking in the console??", "color:#405DE6")