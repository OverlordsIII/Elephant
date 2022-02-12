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

function openDeck(index){
    document.getElementById('review-modal').classList.add('active-modal');
    document.getElementById('review-modal').classList.remove('inactive-modal');
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