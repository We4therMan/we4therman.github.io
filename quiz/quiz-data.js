/* 
ALL questions MUST have the following variables:
    question: the prompt given to the player. Does not always have to be aquestion(like a challenge), but it should be labeled as such
    answers: the player's options. TODO try a different kind of input?replies the dialogue that appears after an answer is picked
    anger: the anger value of thequestion
    correctAnswer: which answers add to the final score. MUST be an array. If none are correct the array can be empty, as such: []
    timeLim: the player's time limit to answer thequestion If the timer runs out, it counts as an incorrect answer

Some questions MAY also have
    specAns: answers that trigger routes (e.g. burgerAns)
    nextEvent: defines if next event is not a question (e.g. an interlude)
    callSpec: calls a function for and event that changes the question drastically (i.e. more than a route, some text, or the buttons)
*/

/* IfnextEvent is none, code assumes it is equivalent to it being question */

/* -----------------------------------QUESTIONS----------------------------------------------------------- */
quiz = {
    questions: [
            {   //1
                question: "What is my name?", //TODO add an easter egg that changes every option to "Jonas" and plays the Weezer song. Then restart the quiz with a twist...
                answers: [
                    "We4therMan",
                    "we4therman",
                    "We4therman",
                    "weatherman",
                ],
                replies: [
                    "The one and only.",
                    "Eh, close enough. I'll take it.",
                    "Nope, that's ugly actually. Don't ever do that.",
                    "literally what is wrong with you",
                ],
                anger: [
                    0,
                    0,
                    5,
                    15
                ],
                correctAnswer: [0,1],
                timeLim: 13.0,

                callSpec: "jonas",
            },

            {   //2
                question: "What is the first game I streamed?",
                answers: [
                    "Overwatch ",
                    "Minecraft",
                    "Geometry Dash",
                    "Undertale"
                ],
                replies: [
                    "No, but this answer may be helpful in the future *wink wink*",
                    "yeah pretty cool huh",
                    "I'm INSULTED that you think this is why I started streaming. I curse thee with START QUIZ OVER",
                    "would have if I hadn't already played it lol",
                ],
                anger: [
                    0,
                    0,
                    10e+99,
                    5,
                ],
                correctAnswer: [1],
                timeLim: 10.0,

                gdAns: 2, //also instantly kills you so it probably doesn't matter

                checkReopen: true,
                hasReopened: false
            },

            {   //3
                question: "What is the first level I streamed myself building?",
                answers: [
                    "Clubbin",
                    "Aura",
                    "Apocalypse City",
                    "Misty Mountains"
                ],
                replies: [
                    "no but damn if you actually know this level then you're kinda OG (orinigal gangster)",
                    "nah but it might as well be tbh",
                    "How do you know this????? did you have to look it up? Please tell me... haha, just kidding. I know. Trust me.",
                    "Christ no that was way into it... get it together.",
                ],
                anger: [
                    -10,
                    0,
                    0,
                    40,
                ],
                correctAnswer: [2],
                timeLim: 20.0,

                checkReopen: true,
                hasReopened: false
            },

            {   //4
                question: "What is the secret to getting a GD level rated?",
                answers: [
                    "Lots of love and dedication",
                    "BUrger", //burger
                    "The answer that everyone knows is true but most people refuse to say...",
                    "Follow a style you like"
                ],
                replies: [
                    "LOL you wish...",
                    "Well, because this is practically as valid as the actual answer, I'll give you a bonus.\
                        It's not the correct answer, but you might make use of this.",
                    "Even if you don't actually believe this, I appreciate that you chose it. Otherwise, you know exactly what I'm talking about.",
                    "Pff, no matter what you're not already established in the community so it doesn't matter.",
                ],
                anger: [
                    30,
                    0,
                    10,
                    10,
                ],
                correctAnswer: [1,2],
                timeLim: 20.0,

                burgerAns: 1,
            },

            {   //5
                question: "What was my <em>original</em> name?",
                answers: [
                    "DoctorM",
                    "Yair92002",
                    "DoctorM_gaming",
                    "D0ctorM"
                ],
                replies: [
                    "You got it! Though isn't it great that I came up with a new one? Haha.",
                    "You're thinking a little <em>too</em> outside the box here.",
                    `Nope. The "gaming" part was just there out of necessity. Who the hell would put that in their username? How old are you, 12?`,
                    "Look, I know I have this name where a number replaces a letter, but at least I did it tastefully. That's UGLY."
                ],
                anger: [
                    0,
                    0,
                    10,
                    15
                ],
                correctAnswer: [0],
                timeLim: 15.0,

                yairAns: 1,
            },

            {   //6
                question: "Speaking of, what did the M stand for?",
                answers: [
                    `"Master"`,
                    `"Money"`,
                    `"Madness"`,
                    "My last name",
                    `"Meteorologist"`,
                    `"Mario"`,
                    "My middle name",
                ],
                replies: [
                    "haha that's so gay",
                    "DoctorMoney???? You're fucking me.",
                    "No, but that's kind of a sick name. <em>DoctorMadness</em>",
                    "Yup, it stands for my old last name. Just like my username though, I changed it :)",
                    "No, but solid guess!",
                    "Maybe if I'd made my account when I was FIVE or something",
                    "No. I don't have one."
                ],
                anger: [
                    0,
                    15,
                    0,
                    0,
                    -5,
                    10,
                    5
                ],
                correctAnswer: [3],
                timeLim: 20.0,
            },

            {   //7
                question: "", //("What is the best level?" Set by special event)
                answers: [
                    "Level MAX",
                    "Level 30",
                    "Level 1",
                    "Leve l&nbsp;<br>&nbsp;of&nbsp;&nbsp; game"
                ],
                replies: [
                    "Ok buddy relax.",
                    "No. Were you thinking about Minecraft levels? Actually, you're kind of on the right track...\
                     my old Minecraft streams have the correct answer.",
                    "Nope, it means you're WEAK.",
                    "Uhhhh... no",
                ],
                anger: [
                    5,
                    5,
                    10,
                    5,
                ],
                correctAnswer: [],
                timeLim: 15.0,

                callSpec: "level7", //TODO: special functions for weird events outside the realm of buttons
            },

            {   //8
                question: "What is the date of my very first stream?",
                answers: [
                    "July 7, 2017",
                    "January 6, 2021",
                    "October 20, 2018",
                    "December 7, 2018"
                ],
                replies: [
                    "That's... not <em>exactly</em> the answer. That is the first time I streamed on my <em>old</em> channel. \
                    How in the world did you know that? Hmm.",
                    "Nope, I was busy ;) <br>",
                    "Happy 7 years! (Jesus Christ...)",
                    "A date which will live in infamy (and in your list of wrong answers)."
                ],
                anger: [
                    0,
                    0,
                    0,
                    0
                ],
                correctAnswer: [2],
                timeLim: 15.0,

                yairAns: 0,
                callSpec: "jan6"
            },

            {
                question: "Next up is the last question of the first part of this quiz. It'll be the hardest you've seen thus far. Are you ready?",
                answers: [
                    "why is this a question?",
                    "uhhhhhh",
                    "yeah yeah get on with it BUDDY",
                    "no, I need a second",
                ],
                replies: [
                    "Because...<br>Can you just play along? Do I need this attitude? Jesus...",
                    "you're aptly confused, keep that mentality for the next question",
                    "please don't call me that.",
                    "...alright. I suppose you can just wait here until you're ready. To be honest, I don't know why I asked in the first place, \
                    there's not a lot you can do to prepare for the next question.<br><br>\
                    I'll give you the second you wanted, but I won't tell you when it starts. You better be ready! If you miss, you lose.",
                ],
                anger: [
                    30,
                    0,
                    40,
                    0
                ],
                correctAnswer: [1],
                timeLim: 30.0,

                callSpec: 'q9'
            },

            {   //10
                question: "You're at the mall. You just saw a really hot, but really mean girl\
                    embarrass a guy across from you, in front of everyone, to her sickening enjoyment. She is\
                    now approaching you. What should you do?",
                answers: [
                    "IGNORE IGNORE IGNORE DON'T MAKE EYE CONTACT", //TODO use francis at walmart audio
                    "A girl approaches you?",
                    "cum in her stupid eye",
                    "Be respectful to her and go help the guy"
                ],
                replies: [
                    "exactly!!! like a true gamers,",
                    "yeah right... NEXT QUESTION",
                    "WHAT??????? LMAOOOOO WHY THE FUCK WOULD YOU SAY THAT? HOLY SHIT HAHAHAHAHAAAA WHAT IS WRONG WITH YOU, FREAK",
                    "I mean... yeah, I suppose",
                ],
                anger: [
                    10,
                    10,
                    -100,
                    10,
                ],
                correctAnswer: [0,1,2,3],
                timeLim: 40.0,

                cumAns: 2,

                suspense: true, //variable for louder ticks, drum roll, extra wait for tension
                fixedOrder: true,
                callSpec: 'girl',
                nextEvent: "interlude"
            },
            //Interlude 1

            {   //
                question: "What game is the reason I wanted to start streaming?",
                answers: [
                    "Geometry Dash",
                    "Overwatch",
                    "Minecraft",
                    "Mario Kart 8"
                ],
                replies: [
                    "NO! I'm SO insulted goddamnit",
                    "That's right! Ironically I didn't stream this game much because I would lag a lot.\
                    That's what you get from using the neighbor's WiFi!",
                    "Solid guess but nope.",
                    "As much as I like it, I honestly don't think this game is interesting enough to make an entire streaming channel about.",
                ],
                anger: [
                    100,
                    0,
                    10,
                    0,
                ],
                correctAnswer: [1],
                timeLim: 15.0,

                gdAns: 0,
            },

            
        ],

//route texts appear in **PRIORITY ORDER**
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
/* ----------------------------------------------INTERLUDES----------------------------------------------------------------------------------- */
        interludes: [
            {//1
                restTxts: {
                    reg: ["That was a tough question! You've done well so far... You should take a short rest.",
                        "When you're ready, press the button that says 'ready.'"],
                    fail: ["That was a tough question!<br>You're... not doing so great with even the easy ones, though.",
                        "Take a breather, you want your brain sharp for these next ones!",
                        "When you're ready, press the button that says 'ready.'"],
                },
                
                specialTxts: {
                    burger: "hey, smells pretty nice in here...",
                    cum: "...holy shit I can't believe you actually said that HAHAHAHA",
                    ang: "By the way, you gotta relax with some of your answers... I'll be honest, they're a bit insulting.",
                },
                //TODO: ready txts should appear after player clicks continue. Then automatically takes you to the next question
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
    }

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