$(document).on("keydown", function(e){
    if (e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) {
        e.preventDefault(); 
        let debugInd = e.keyCode - 48;
        console.log("debug activated");
        currentQInd = debugInd;
        loadQuestion(debugInd);
    }

       if (e.code === "KeyS" && !e.repeat) { //s key
        console.log("speeding up");
        speedUp = true;
    }
})

$(document).on("keyup", function(e){
    if (e.code === "KeyS") {
        console.log("no longer speeding up");
        speedUp = false
    }
})

