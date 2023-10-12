status = "";
value = "";
objects = [];
date = new Date();
day = date.getDate();
month = date.getMonth()+1;
year = date.getFullYear();
currentDate = `${month}/${day}/${year}`;
console.log(currentDate);
document.getElementById("date").innerHTML = currentDate;
function setup () {
    canvas = createCanvas(480, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.hide();
}
function draw () {
    image(video, 0, 0, 480, 380);
    if (status != "") {
        r = random(255);
        g = random(255);
        b = random(255);
        objectDetected.detect(video, gotResult);
        for (i = 0; i < objects.length; i++) {
            percent = floor(objects[i].confidence * 100);
            fill(r,g,b);
            text(objects[i].label + ", " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke(r,g,b);
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            if (objects[i].label == value) {
                video.stop();
                objectDetected.detect(gotResult);
                document.getElementById("object_found").innerHTML = value + " has been found";
                var synth = window.speechSynthesis;
                speak_data = value + " has been found";
                utterThis = new SpeechSynthesisUtterance(speak_data);
                synth.speak(utterThis);
            }
            else {
                objectDetected.detect(gotResult);
                document.getElementById("object_found").innerHTML = value + " has not been found";
                var synth = window.speechSynthesis;
                speak_data = value + " has not been found";
                utterThis = new SpeechSynthesisUtterance(speak_data);
                synth.speak(utterThis);
            }
        }
    }
}
function start () {
    objectDetected = ml5.objectDetector("cocossd", modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Object";
    value = document.getElementById("object").value;
    console.log("Value of text input - " + value);
}
function modelLoaded () {
    image(video, 0, 0, 480, 380);
    console.log("Model Loaded");

    status = true;
}
function gotResult (error, result) {
    if (error) {
        console.log(error);
    }
    else {
        console.log(result);
        objects = result;
    }
}