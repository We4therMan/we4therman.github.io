/* --------------------------------SPECIAL EVENTS------------------------------------------------ */
//for safety these should check if their corresponding question is active (using currentQInd)

function jonas() {
    console.log("jonas active")
    if (currentQInd === 0) {
        let typed = "";
        let target = "jonas";

        $(document).on("keydown", function(e) {
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
                    $("#question").text("Wow... you actually stayed long enough to hear the end of that. I don't know if I should congratulate you, pity you, or fear you...");
                }
                $(".multChoice")
                    .text("Jonas")
                    .on("mouseenter", function(){
                        console.log("HOVERED")
                        quickSFX("jonas");
                    })
                    .off("click").on("click", function() {
                        angScore -= 50;
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
                                $("#nextButton").off("click").on("click", function(){
                                    clearTimeout(buttonAnsTimer);
                                    nextEvent();
                                })
                                //finally, proceed
                                nextEvent();
                            })
                    })
                typed = "" //reset type container
            }
        })
    }
}

function level7() {
    console.log("it';s level 7 time biech")
}