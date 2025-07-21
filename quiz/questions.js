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
        "correctAnswer": [1],
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
            "christ no that was way into it.. get it together",
        ],
         "anger": [
            -5,
            0,
            0,
            40,
        ],
        "correctAnswer": [2],
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
        "fixedOrder": true,
        "nextEvent": "interlude"
    },
    //Interlude 1

    {   //6
        "question": "What game is the reason I wanted to start streaming?",
        "answers": [
            "Geometry Dash",
            "Overwatch",
            "Minecraft",
            "Mario Kart 9"
        ],
        "replies": [
            "NO! I'm SO insulted goddamnit",
            "That's right! Ironically I didn't stream this game much because I had a lot of latency spikes",
            "Nope.",
            "I honestly don't think this game is interesting enough to make a streaming personality out of",
        ],
        "anger": [
            100,
            0,
            10,
            0,
        ],
        "correctAnswer": [1],
        "timeLim": 15.0,
        "gdAnswer": [0],
    }

]

/* If nextEvent is none, assume it is equivalent to "question" */

console.log("ARE THESE THE SAME QUESTION MARK")

console.log(questions[0]["question"])
console.log(questions[0].question)