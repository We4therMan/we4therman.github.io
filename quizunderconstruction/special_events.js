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

//ROUTE EVENTS

//y-route requirements
let yReqs = {
    "name": false,
    "firstStream": false,
    "firstVid": false,
};

const routeMatchers = [
    {
        keyword: "Yair92002",
        handler: () => {
            yReqs.name = true;
            quickSFX("y1");
        },
    },

    {
        keyword: "July",
        handler: () => {
            yReqs.firstStream = true;
            quickSFX("y2");
        },
    },

    {
        keyword: "volcano",
        handler: () => {
            yReqs.firstVid = true;
            quickSFX("y3");
        },
    },

    {
        keyword: "think",
        handler: () => {
            //check if all requirements (keys) are true
            routeAccess = Object.values(yReqs).every(k => k);
            if (routeAccess) {
                sfxPlayer.mute = true;
                musPlayer.volume.rampTo(-Infinity,3)
                sfxPlayer.mute = false;
                quickSFX("y5",0.7);
                $("#questionContainer, #quizContainer").hide()
                $("#result").html("I see. It seems that you do.<br><br>Well then. I want to test how much you TRULY know me...")
                //TODO: initialize yRoute from here
            } else {
                result(false, 10, "Then do better.")
            }
        },
    },
];

function routeAnsHandler(event) {
    const target = $(event.target);
    if (target.hasClass("routeAns")) {
        const answerClicked = target.html().trim().toLowerCase();
        const match = routeMatchers.find(route =>
            answerClicked.includes(route.keyword.toLowerCase())
        );
        console.log("answer matched: ", match);
        match.handler();
        $(document).off("click.routeAnsHandler");
    //deactivate if other answer is given
    } else if (target.is(".multChoice:not(.routeAns)")) {
        $(document).off("click.routeAnsHandler");
        return;
    };
}

//todo: find a way to make this read the text from the right button without needing to add a delay for the button to be generated
function routeCheck() {
    $(document).off("click.routeAnsHandler");
    $(document).on("click.routeAnsHandler", routeAnsHandler);
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
                            weezer.dispose(); //anti-Weezer gun
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
                "title": "hoho what about this level????"
            })
            .on("click", function(){
                if (!ansClicks) {
                    result(true,0,"");
                    $("#result").append(lv7img);
                } else {
                    //disable if question has been answered
                    ansClicks++;
                }
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

    setTimeout(() => {
        console.log("special loaded", ticRate)
        $(".multChoice:contains('second')").on("click", function() {
            clearInterval(timeCounter);
            musPlayer.volume.rampTo(musVol-40,2);
            $("#nextButton").hide()
            setTimeout(() => {
                $("#result").html("GOGOGOOGOGOGOGOGOGO THERE IT IS GOOOOOOOOOOOO")
                genTimer(1.0,1);
                musPlayer.volume.value = musVol;
                musPlayer.connect(distortion);
                //show button, move randomly and assign disconnect function for this click
                $("#nextButton")
                    .show()
                    .animate({ left: "100vh" }, Math.random()*1500)
                    .off("click").on("click", function() {
                        clearInterval(timeCounter);
                        const timerState = $(".timer").html();
                        let timeLeft;
                        if (timerState != 'TIME') {
                            timeLeft = parseFloat(timerState)
                        } else {
                            //player dies if they're too late
                            $("#result").html("Oh, you thought you could continue? Nope! You took the risk and failed the challenge. Sorry!")
                            musPlayer.disconnect(distortion);
                            $("#nextButton").animate({ left: "0" }, 1000)
                            gameOver();
                            return;
                        }
                        musPlayer.disconnect(distortion);
                        $("#result").html(`Wow, you got it in ${1-timeLeft} seconds, not bad! I guess you can proceed...`)
                        //then reset button behavior
                        $(this)
                            .animate({ left: "0" }, 100)
                            .off("click").on("click", function() {
                                clearTimeout(buttonAnsTimer);
                                nextEvent();
                            });
                    });
            }, (Math.random() * 3000) + 5000);
        })
    }, ticRate * 4 + 1);
}

function girl() {
    console.log('GIRL ACTIVATED', ticRate)
    setTimeout(() => {
        console.log("special loaded")
        $(".multChoice:contains('CONTACT')").on("click", function(){
            console.log("playing girl")
            musPlayer.volume.rampTo(musVol-10,0.25)
            quickSFX('girl');
            $(this).off("click");
            setTimeout(() => {
                musPlayer.volume.rampTo(musVol,0.5)
            }, 3500)
        })
    }, ticRate + 1); //delay prevents this function from running before button appears and thus from getting reset without onClick
}