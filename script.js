function createRandomProfilePic(){
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const colorRange = ["#E74C3C", "#3498DB", "#1ABC9C", "#F1C40F"];
    const quality = 100;
    const size = 5;

    canvas.width = quality * size;
    canvas.height = quality * size;

    ctx.beginPath();
    ctx.fillStyle = "#004153";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.fillStyle = colorRange[Math.floor(Math.random() * colorRange.length)]

    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            if(Math.floor(Math.random() * 2) == 0){
                ctx.fillRect(i * quality, j * quality, quality, quality);
                ctx.fill();
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
    createRandomProfilePic();
}

initialize();