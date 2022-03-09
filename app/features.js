const backgroundNumber = 6;
let currentTheme = 0
let currentBackground = 0;

function toggleSettingsModal(){
    if(document.getElementById('settings-modal').classList.contains('active-modal')){
        document.getElementById('settings-modal').classList.remove('active-modal');
        document.getElementById('settings-modal').classList.add('inactive-modal');
    } else {
        document.getElementById('settings-modal').classList.add('active-modal');
        document.getElementById('settings-modal').classList.remove('inactive-modal');
    }
}

function importDeck(){

}

function popupModal(index){
    //Index Legend: 0 = Flashcard Deck Complete

    document.getElementById('popup-modal').classList.remove('inactive-modal');
    document.getElementById('popup-modal').classList.add('active-modal');

    let elem = document.querySelector('.popup-main')
    let child = elem.lastElementChild;

    while (child) {
        elem.removeChild(child);
        child = elem.lastElementChild;
    }

    let newCloseBtn = document.createElement('div');

    newCloseBtn.innerHTML = "X";
    newCloseBtn.setAttribute('onclick', "document.getElementById('popup-modal').classList.add('inactive-modal'); document.getElementById('popup-modal').classList.remove('active-modal')")

    elem.appendChild(newCloseBtn);

    if(index === 0){
        document.documentElement.style.setProperty('--popup-color-1', '#51E640');
        document.documentElement.style.setProperty('--popup-color-2', '#3AB489');

        let newHeader = document.createElement('h1');
        let newPara = document.createElement('p')

        newHeader.innerHTML = "Congratulations";
        newPara.innerHTML = "You successfully completed this deck. Better revise it again, you know, just to be safe ;)";

        elem.appendChild(newHeader);
        elem.appendChild(newPara);
    }
}

function setTheme(themeIndex, background){
    let darkMode = document.getElementById('dark-mode-input').checked;

    if(darkMode){
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

    currentTheme = themeIndex;
    currentBackground = background;

    document.documentElement.style.setProperty('--theme-color-1', colorRange[themeIndex][0]);
    document.documentElement.style.setProperty('--theme-color-2', colorRange[themeIndex][1]);
    document.documentElement.style.setProperty('--theme-color-dark', colorRange[themeIndex][2]);

    document.getElementById('custom-picture').style.backgroundImage = "url('./images/patterns/" + background + ".jpg')";

    localStorage.setItem('theme-index', JSON.stringify([currentTheme, darkMode, currentBackground]));
    console.log(localStorage.getItem('theme-index'))
}

function openDeck(index){
    document.getElementById('review-modal').classList.add('active-modal');
    document.getElementById('review-modal').classList.remove('inactive-modal');
    setupReview(index)
}

function closeDeck(){
    document.getElementById('review-modal').classList.remove('active-modal');
    document.getElementById('review-modal').classList.add('inactive-modal');
}

function closeCreateModal(){
    document.getElementById('create-modal').classList.add('inactive-modal');
    document.getElementById('create-modal').classList.remove('active-modal');
    createModalActive = false;
}