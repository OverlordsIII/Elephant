let firstQuestion = true;
const randomCongrats = [
    "Nice, Now Get The Next One",
    "I Thought That Would Stump You",
    "You'll never get this next one!",
    "Quite Possible The Greatest Thing I've Ever Seen",
    "You Got Lucky There",
    "That was an Easy Question!"
]

function createRandomProfilePic(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const colorRange = ["#E74C3C", "#3498DB", "#1ABC9C", "#F1C40F"];
    const pictureTypes = ["random", "symmetrical"]
    const quality = 100;
    const size = 5;

    let picType = Math.floor(Math.random() * pictureTypes.length)

    canvas.width = quality * size;
    canvas.height = quality * size;

    ctx.beginPath();
    ctx.fillStyle = "#405DE6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.fillStyle = colorRange[Math.floor(Math.random() * colorRange.length)]

    if(picType == 0){
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                if(Math.floor(Math.random() * 2) == 0){
                    ctx.fillRect(i * quality, j * quality, quality, quality);
                    ctx.fill();
                }
            }
        }
    } else if(picType == 1){
        if(size % 2 == 0){
            for(let i = 0; i < size / 2; i++){
                for(let j = 0; j < size; j++){
                    if(Math.floor(Math.random() * 2) == 0){
                        ctx.fillRect(i * quality, j * quality, quality, quality);
                        ctx.fillRect((size - i - 1) * quality, j * quality, quality, quality);
                        ctx.fill();
                    }
                }
            }
        } else {
            for(let i = 0; i < Math.floor(size / 2); i++){
                for(let j = 0; j < size; j++){
                    if(Math.floor(Math.random() * 2) == 0){
                        ctx.fillRect(i * quality, j * quality, quality, quality);
                        ctx.fillRect((size - i - 1) * quality, j * quality, quality, quality);
                        ctx.fill();
                    }
                }
            }
            for(let i = 0; i < size; i++){
                if(Math.floor(Math.random() * 2) == 0){
                    ctx.fillRect(Math.floor(size / 2) * quality, i * quality, quality, quality);
                    ctx.fill();
                }
            }
        }
    }

    ctx.closePath();

    canvas.toBlob(function(blob) {
        var newImg = document.createElement('img'),
            url = URL.createObjectURL(blob);
      
        newImg.onload = function() {
          // no longer need to read the blob so it's revoked
          URL.revokeObjectURL(url);
        };
      
        newImg.src = url;
        document.getElementById('profile').appendChild(newImg);
      });
}

function initialize(){
    getData();
    createRandomProfilePic();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

async function getData() {
    const parentDiv = document.querySelector('#flashcard-main-answers');

    let child = parentDiv.lastElementChild;

    while (child) {
        parentDiv.removeChild(child);
        child = parentDiv.lastElementChild;
    }

    if(firstQuestion) document.getElementById('flashcard-header').innerHTML = "Loading Sample Question"
    else document.getElementById('flashcard-header').innerHTML = randomCongrats[Math.floor(Math.random() * randomCongrats.length)];

    let response;

    try{ response = await fetch('https://api.trivia.willfry.co.uk/questions?limit=5')}
    catch{
        document.getElementById('flashcard-header').innerHTML = "Check Internet Connection"
        throw new Error("Internet Connectivity Error - Failed to Connect to Trivia API");
        return;
    }

    let data = await response.json();
    let questionAsked;

    if(data["0"].incorrectAnswers.length > 8 || data["0"].question.length > 30) {
        if(data["1"].incorrectAnswers.length > 8 || data["1"].question.length > 30) {
            if(data["2"].incorrectAnswers.length > 8 || data["2"].question.length > 30) {
                if(data["3"].incorrectAnswers.length > 8 || data["3"].question.length > 30) {
                    if(data["4"].incorrectAnswers.length > 8 || data["4"].question.length > 30) {
                        document.getElementById('flashcard-header').innerHTML = "Giving You An Easier Question";
                        getData();
                        return;
                    } else questionAsked = data["4"];
                } else questionAsked = data["3"];
            } else questionAsked = data["2"];
        } else questionAsked = data["1"];
    } else questionAsked = data["0"];

    document.getElementById('flashcard-header').innerHTML = questionAsked.question;

    console.log("%cYou won't find the answer in here", "color:blue;");

    let answersArray = [];

    for(let i = 0; i < questionAsked.incorrectAnswers.length; i++){
        let incorrectAnswer = document.createElement('h6');
        incorrectAnswer.innerHTML = questionAsked.incorrectAnswers[i];
        answersArray.push(incorrectAnswer);
    }

    let correctAnswer = document.createElement('h6');
    correctAnswer.setAttribute('onclick', 'getData()');
    correctAnswer.innerHTML = questionAsked.correctAnswer;
    answersArray.push(correctAnswer);

    answersArray = shuffleArray(answersArray);

    for(let i = 0; i < answersArray.length; i++){
        parentDiv.appendChild(answersArray[i])
    }

    let skipBtn = document.createElement('h6');
    skipBtn.classList.add('skip-btn');
    skipBtn.innerHTML = "Skip Question";

    parentDiv.appendChild(skipBtn)
    firstQuestion = false;
}

initialize();