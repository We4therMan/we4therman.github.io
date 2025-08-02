//route texts appear in **REVERSE PRIORITY ORDER** (first option is checked first, so lowest option that is 'True' remains)
//maybe an option could allow some to appear together? complicated..
/* dicts organized as
{
    restTxts (tell player it's the interlude)
    [for "fail" texts, there must be a "failReq" that triggers fail texts if not met]
    TODO: maybe make the pass req a certain percentage and score/qindex

    varyingTexts (extras depending on things player has done)

    readyTxts (tell player the next question will follow)
}
*/

var interludes = [
    {   //1
        "restTxtReg": "That was a tough question! You've done well so far... You should take a short rest.",
        "restTxtFail": "That was a tough question!<br>You're... not doing so great with these, though.\
        Take a breather, you want your brain sharp for these next ones!",

        "burgerTxt": "hey, smells pretty nice in here..",
        "cumTxt": "...holy shit I can't believe you actually said that HAHAHAHA",
        "angryTxt": "Also, I can't lie, some of your answers are making me wonder if you know me TOO well...",

        "readyTxtReg": "OK, let's see how you fare after these ones. They are much tougher.",
        "readyTxtAng": "Well, whatever, here are the next questions."
    },

    {   //2
        "mainTxt": "Nice job there bucko"//joke about lacking a save progress function because I am not good at coding
    }
]

//TODO: find different method for detecting special answers like 'burger' and 'cum'
// console.log(interludes[0].angryTxt)