/* --------------------------------SPECIAL EVENTS------------------------------------------------ */
//for safety these should check if their corresponding question is active (using currentQInd)

// GENERAL GAME EVENTS (can happen at pretty much any question)

function timesUp() {
    $(".timer").html("TIME");
    timeOuts++;
    let r;
    let ang = 5 * timeOuts;
    switch(timeOuts) {
        case 1:
            r = "Time's up! You're gonna have to pick up the pace there..."
            break;
        case 2:
            r = "Again? Man, did I make these too hard? Are the timers too short?"
            break;
        case 3:
            easyMode = true;
            r = "Alright, maybe the timers are a little fast. I prefer if you take your\
            time with this quiz, so I'll make the timers a little longer. Just 4 U <3"
            break;
        case 4:
            r = "OK, I'm starting to think you're just slow."
            break;
        case 5:
            r = "Seriously??? Even with the long timers? I'm not sure what to do now."
            break;
        case 6:
            ("#result").html("OK, I've had enough. YOU LOSE!")
            gameOver();
            return;
    }
    result(false,ang,r);
    clearInterval(timeCounter);
}

//QUESTION SPECIFIC EVENTS

function jonas() {
    console.log("jonas active")
    let typed = "";
    let target = "jonas";

    $(document).on("keydown", function(e) {
        if (currentQInd != 0) return; //function should not work if we're not on question 1

        console.log(typed)
        typed += e.key.toLowerCase();

        if (typed.includes(target)) {
            console.log("jonas typed!")
            musPlayer.volume.rampTo(-Infinity,5)
            musPlayer.buffer = mus.get("firstfew_w"); //change normal music to new version

            let weezer = new Tone.Player().toDestination(); //load weezer song
            weezer.buffer = mus.get("jonas")
            weezer.volume.value = -Infinity
            weezer.onstop = () => {
                quickSFX("gameover");
                $("#question").html("Wow... you actually stayed long enough to hear the end of that.\
                     I don't know if I should congratulate you, pity you, or fear you...\
                     <br>Regardless, you might seriously benefit from touching grass.");
            }
            $(".multChoice")
                .text("Jonas")
                .on("mouseenter", function(){
                    console.log("HOVERED")
                    quickSFX("jonas");
                })
                .off("click").on("click", function() {
                    angScore -= 50;
                    clearInterval(timeCounter);
                    musPlayer.start(); //start music again in silence so it can fade in later
                    weezer.start(); //play weezer
                    weezer.volume.value = musVol;
                    pulseBG("#189BCC", 9)
                    $("#result").text("WEEZER");
                    $(".multChoice").off("click").on("click", function(){
                        pulseBG("#189BCC", 2)
                    })
                    $("#nextButton")
                        .show()
                        .off("click").on("click", function() {
                            weezer.dispose(); //next button becomes anti-Weezer gun
                            musPlayer.volume.rampTo(musVol,1); //fade in music

                            //reset button behavior
                            $(this).off("click").on("click", function(){
                                clearTimeout(buttonAnsTimer);
                                nextEvent();
                            })

                            //finally, proceed
                            nextEvent();
                            $(document).off("keydown");
                        })
                })
            typed = "" //reset type container
        }
    })
}

function jan6() {
    console.log("   JAN 6 ACTIAVTED")
    let j6 = $('<img />')
        .attr({
            "id": "j6",
            "title": "Good times. Thank you for the image, Simon.",
            "src": "img/jan6.jpg"
        })
    setTimeout(() => {
        $(".multChoice:contains('January')").on("click", function(){
            quickSFX('gameover', 0.6);
            $("#result").append(j6);
        });
    }, delay + 1)
}

function level7() {
    setTimeout(() => {
        console.log("LEVLEL 7 ACITVATED")
        $("#question").empty();
        let lv7img = $('<img />')
            .attr({
                "id": "lv7",
                "title": "LEVEL 7 (click to watch clip)",
                "src": "img/level7.jpg"
            })
            .on("click", function(){
                window.open('https://www.twitch.tv/we4therman/clip/AbrasiveBoringNigiriMrDestructoid');
                $(this).off("click")
            })
        let seven = $('<a />')
            .html("7.")
            .attr({
                "id": "seven",
                "title": "hoho could this be the answer????"
            })
            .on("click", function(){
                result(true,0,"");
                $("#result").append(lv7img);
            })
            .hover(
                () => $("#seven").css("color", "gray"),
                () => $("#seven").css("color", "white")
            );

        $("#question").append(seven)
        $("#question").append("&nbsp;What is the best level?")
    }, 1);
}

function q9 () {
    console.log("QUESTION 9 ACTIVATED") //TODO: make event for player actually choosing to wait
    //give the player an actual second, but don't let them know when it's gonna start (random number)
    //extra reward for actually clicking next during the one second?
}

function girl() {
    console.log('GIRL ACTIVATED')
    setTimeout(() => {
        $(".multChoice:contains('CONTACT')").on("click", function(){
            musPlayer.volume.rampTo(musVol-10,0.25)
            quickSFX('girl');
            $(this).off("click");
            setTimeout(() => {
                musPlayer.volume.rampTo(musVol,0.5)
            }, 3500)
        })
    }, delay + 1); //delay prevents this function from running before button appears and thus from getting reset without onClick
}