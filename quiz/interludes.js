//route texts appear in **REVERSE PRIORITY ORDER** (first option is checked first, so lowest option that is 'True' remains)
//maybe an option could allow some to appear together? complicated..
/* dicts organized as
{
    restTxts (tell player it's the interlude)
    (for "fail" texts, there is be a "failing" variable that determines if the player is failing the quiz [score < %50])

    varyingTexts (extras depending on things player has done)

    readyTxts (tell player the next question will follow)
}
*/

/*
Labels organized such that the default text shown is always 'reg'.
This means restTxts and readyTxts should have a 'reg' defined. They can be blank strings.
*/
var interludes = [
    {//1
        restTxts: {
            reg: ["That was a tough question! You've done well so far... You should take a short rest.",
                "When you're ready, press the button that says 'ready.'"],
            fail: ["That was a tough question!<br>You're... not doing so great with these, though.",
                "Take a breather, you want your brain sharp for these next ones!",
                "When you're ready, press the button that says 'ready.'"],
        },
        
        specialTxts: {
            burger: "hey, smells pretty nice in here...",
            cum: "...holy shit I can't believe you actually said that HAHAHAHA",
            ang: "Also, I can't lie, some of your answers are making me wonder if you know me TOO well...",
        },

        readyTxts: {
            reg: "OK, let's see how you fare after these ones. They are much tougher.",
            ang: "Well, whatever, here are the next questions.",
        },
    },

    {//2
        restTxts: {
            reg: "",
        },

        specialTxts: {
            special: "",
        },

        readyTxts: {
            reg: "",
        },
    },
]
/* Interlude item basic structure (copy paste for convenience)
{//(interlude number)
        restTxts: {
            reg: "",
        },

        specialTxts: {
            special: "",
        },

        readyTxts: {
            reg: "",
        },
    },
*/