let isDebugDown = false;
let speedKeyDown = false; //TODO make speed up function work
let digitBuffer = "";

$(document).on("keydown", function(e){
    if (e.code === "KeyQ" || e.code === "KeyI") {
        console.log("debug key down")
        isDebugDown = true;
        digitBuffer = "";
    }

    if (isDebugDown && e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        digitBuffer += e.key;
        console.log(`Digit added: ${e.key}, Buffer: ${digitBuffer}`);
    }
});

$(document).on("keyup", function(e){
    if (e.code === "KeyQ") {
        console.log("Q up")
        console.log(digitBuffer)
        isDebugDown = false;

        if (digitBuffer) {
            let debugQInd = parseInt(digitBuffer) - 1;
            console.log(`DEBUG question ${debugQInd + 1}`);
            currentQInd = debugQInd;
            loadQuestion(debugQInd);
            digitBuffer = "";
        }

    }
    
    if (e.code === "KeyI") {
        console.log("I up")
        console.log(digitBuffer)
        isDebugDown = false;

        if (digitBuffer) {
            let debugIInd = parseInt(digitBuffer) - 1;
            console.log(`DEBUG interlude ${debugIInd + 1}`);
            currentQInd = debugIInd;
            loadInterlude(debugIInd);
            digitBuffer = "";
        }

    }

})

