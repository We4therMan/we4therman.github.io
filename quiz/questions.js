var questions = [
    {   //1
        "question": "What is my name?", //add an easter egg that changes every option to "Jonas" and plays the Weezer song. Then restart the quiz with a twist...
        "answers": [
            "We4therMan",
            "we4therman",
            "We4therman",
            "weatherman",
        ],
        "replies": [
            "The one and only",
            "eh close enough, I'll take it",
            "nope, that's ugly actually. Don't ever do that",
            "literally what is wrong with you",
        ],
        "anger": [
            0,
            0,
            5,
            10
        ],
        "correctAnswer": [0,1],
        "timeLim": 30.0,
    },

    {   //2
        "question": "What is the first game I streamed?",
        "answers": [
            "Overwatch ",
            "Minecraft",
            "Geometry Dash",
            "Undertale"
        ],
        "replies": [
            "no but this answer may be helpful in the future wink wink",
            "yeah pretty cool huh",
            "I'm INSULTED that you think this is why I started streaming. I curse thee with START QUIZ OVER",
            "would have if I hadn't already played it lol",
        ],
        "anger": [
            0,
            0,
            10e+99,
            5,
        ],
        "correctAnswer": 1,
        "timeLim": 10.0,

        "checkReopen": true,
        "hasReopened": false
    },

    {   //3
        "question": "What is the first level I streamed myself building?",
        "answers": [
            "Clubbin",
            "Aura",
            "Apocalypse City",
            "Misty Mountains"
        ],
        "replies": [
            "no but damn if you actually know this level then you're kinda OG (orinigal gangster)",
            "nah but it might as well be tbh",
            "how do you know this????? did you have to look it up? Please tell me... haha, just kidding. I know. Trust me.",
            "christ no that was way into it fuck off",
        ],
         "anger": [
            -5,
            0,
            0,
            50,
        ],
        "correctAnswer": 2,
        "timeLim": 20.0,

        "checkReopen": true,
        "hasReopened": false
    },

    {   //4
        "question": "What is the secret to getting a GD level rated?",
        "answers": [
            "Lots of love and dedication",
            "BUrger", //burger
            "The answer that everyone knows is true but most people refuse to say...",
            "Follow a style you like"
        ],
        "replies": [
            "LOL you wish...",
            "well, because this is practically as valid as the actual answer, I'll give you a bonus.\
                It's not the correct answer, but you might make use of this",
            "Even if you don't actually believe this, I appreciate that you chose it. Otherwise, you know exactly what I'm talking about",
            "pff, no matter what it's not glow or modern so it doesn't matter",
        ],
        "anger": [
            30,
            0,
            10,
            10,
        ],
        "correctAnswer": [1,2],
        "timeLim": 20.0,
        "burgerAnswer": 1
    },

    {   //5
        "question": "You're at the mall. You just saw a really hot, but really mean girl\
            embarrass a guy across from you, in front of everyone, to her sickening enjoyment. She is\
            now approaching you. What should you do?",
        "answers": [
            "IGNORE IGNORE IGNORE DON'T MAKE EYE CONTACT", //TODO use francis at walmart audio
            "A girl approaches you?",
            "cum in her stupid eye",
            "Be respectful to her and go help the guy"
        ],
        "replies": [
            "exactly!!! like a true gamers,",
            "yeah right... NEXT QUESTION",
            "WHAT??????? LMAOOOOO WHY THE FUCK WOULD YOU SAY THAT? HOLY SHIT HAHAHAHAHAAAA WHAT IS WRONG WITH YOU, FREAK",
            "I mean... yeah, I suppose",
        ],
        "anger": [
            10,
            10,
            -100,
            10,
        ],
        "correctAnswer": [0,1,2,3],
        "timeLim": 40.0,
        "cumAnswer": 2,

        "suspense": true, //variable for louder ticks, drum roll, extra wait for tension
        "fixedOrder": true
    }
    //Interlude 1

]

//route texts appear in **REVERSE PRIORITY ORDER** (first option is checked first, so lowest option that is 'True' remains)
//maybe an option could allow some to appear together? complicated..
/* dicts organized as
{
    restTxts (tell player it's the interlude)

    varyingTexts (extras depending on things player has done)

    readyTxts (tell player the next question will follow)
}
*/

var interludes = [
    {
        "restTxtReg": "that was a tough question! You've done well so far... You should take a short rest.",
        "restTxtFail": "that was a tough question! You're... not doing so great with these, though.\
            Take a breather, you want your brain sharp for these next ones!.",

        "burgerTxt": "hey, smells pretty nice in here..",
        "cumTxt": "...holy shit I can't believe you actually said that HAHAHAHA",
        "angryTxt": "hmm, I can't lie, some of your answers are making me wonder if you know me TOO well...",

        "readyTxtReg": "OK, let's see how you fare after these ones. They are much tougher.",
        "readyTxtAng": "Well, whatever, here are the next questions."
    },

    {
        "mainTxt": "Nice job there bucko"//joke about lacking a save progress function because I am not good at coding
    }
]

console.log(questions[0]["answers"])

//print all questions
// for (let qDict of questions){
//     console.log(qDict["question"])
//     for (let i = 0; i < qDict["answers"].length; i++) {
//         ans = qDict["answers"][i]
//         ang = qDict["anger"][i]
//         console.log(ans, ang)
//     }
// }

//print one question
var questionInd = 3
var answers = questions[questionInd]["answers"]
var anger = questions[questionInd]["anger"]
let correctValues = questions[questionInd]["correctAnswer"]

console.log(answers, anger);
answers.forEach((ans,ind) => {
    let ang = anger[ind];
    console.log(`answer ${ind + 1}: ${ans}, ${ang}`);
    if (correctValues.includes(ind)){
        console.log('(correct)');
    } else {
        console.log("(wrong)") 
    }
});
//TODO: find different method for detecting special answers like 'burger' and 'cum'