/* 
ALL questions MUST have the following variables (they can be empty strings/arrays):
    question (str): the prompt given to the player. Does not always have to be aquestion(like a challenge), but it should be labeled as such
    answers (arr): the player's options. TODO try a different kind of input?replies the dialogue that appears after an answer is picked
    anger (arr): the anger value of each answer
    correctAnswer (arr): which answers add to the final score. MUST be an array. If none are correct: []
    timeLim (float): the player's time limit to answer thequestion If the timer runs out, it counts as an incorrect answer

Some questions MAY also have
    routeAns (arr): answers that trigger routes (e.g. yRoute)
    nextEvent (str): defines if next event is not a question (e.g. an interlude)
    callSpec (str): name for special event function to call
*/

/* IfnextEvent is none, code assumes it is equivalent to it being question */

/* ------------------------------------------------------QUESTIONS----------------------------------------------------------- */
quiz = {
    questions: [
            {   //1
                question: "What is my name?",
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
                timeLim: 20.0,

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
                timeLim: 20.0,

                gdAns: 2, //also instantly kills you so it probably doesn't matter
            },

            {   //3
                question: "What is the first level I streamed myself building?",
                answers: [
                    "Clubbin",
                    "Aura",
                    "Apocalypse City",
                    "Misty Mountains",
                    "Level? What game?"
                ],
                replies: [
                    "no but damn if you actually know this level then you're kinda OG (orinigal gangster)",
                    "nah but it might as well be tbh",
                    "How do you know this????? did you have to look it up? Please tell me... haha, just kidding. I know. Trust me.",
                    "Christ no that was way into it... get it together.",
                    "Oh, sorry yeah, I forgot not everyone has seen my streams. Don't worry about that one."
                ],
                anger: [
                    -10,
                    0,
                    0,
                    40,
                    0,
                ],
                correctAnswer: [2],
                timeLim: 20.0,
            },

            {   //4
                question: "What is the secret to getting a GD level rated?",
                answers: [
                    "Lots of love and dedication",
                    "ohho oFUck", //burger
                    "The answer that everyone knows is true but most people refuse to say...",
                    "Follow a style you like",
                    "Rated?"
                ],
                replies: [
                    "LOL you wish...",
                    "Uhh, OK? HAHA",
                    "Even if you don't actually believe this, I appreciate that you chose it. Otherwise, you know exactly what I'm talking about.",
                    "Pff, no matter what you're not already established in the community so it doesn't matter.",
                    "Oh, you don't play GD. Ok, forget it, ignore that question."
                ],
                anger: [
                    30,
                    -20,
                    10,
                    10,
                    0,
                ],
                correctAnswer: [1,2],
                timeLim: 20.0,
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

                routeAns: [1],
                callSpec: "routeCheck",
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
                    "Yup, it stands for my old last name. Just like my username, though, I changed it :)",
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

                routeAns: [0],
                callSpec: ["jan6", "routeCheck"]
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
                    "IGNORE IGNORE IGNORE DON'T MAKE EYE CONTACT",
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

            {   //11
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
                    80,
                    0,
                    5,
                    0,
                ],
                correctAnswer: [1],
                timeLim: 15.0,

                gdAns: 0,
            },

            {   //12
                question: "Who was the first mod in my Twitch channel?",
                answers: [
                    "error101_the_gamer",
                    "SoulCantSpeech",
                    "LiterallyLamas",
                    "jjcoolz",
                    "LeslieLDB",
                    "Nightbot"
                ],
                replies: [
                    "No, but that's such a good guess I kinda wish I could just count it as correct. Even I thought it was this!",
                    "Nope, that took a little while!",
                    "Nope, that took a good long while!",
                    "The OG.",
                    "Nah, solid guess.",
                    "That would be sad. Having no one but lil' old Nightbot to keep you company. Man..."
                ],
                anger: [
                    -10,
                    0,
                    0,
                    0,
                    0,
                    5
                ],
                correctAnswer: [3],
                timeLim: 20.0,
            },

            {   //13
                question: "What is the first level I <em>verified</em> on stream?",
                answers: [
                    "Aura",
                    "Misty Mountains",
                    "Apocalypse City",
                    "impossibru LEVEL 1000 XTREME DORAMI CH4LLENGE",
                    "Verified?",
                ],
                replies: [
                    "Yeah. Big moment.",
                    "CHRIST NO NOT EVEN CLOSE",
                    "Nope. I can see why you'd guess that but, tragically, I never finished it.",
                    "PFFHAHA what?? That's too many characters. Also WHO WOULD NAME actually a lot of people would",
                    "Oh, if you're asking that you probably don't play this game. Sorry. 'Verify' means beating\
                     a level before uploading it to ensure that it is possible. It is required for all Geometry Dash levels.\
                     You'll need this knowledge later on."
                ],
                anger: [
                    0,
                    25,
                    0,
                    -5,
                    0
                ],
                correctAnswer: [0],
                timeLim: 15.0,
            },

            {   //14
                question: "Who was my main inspiration to start streaming?",
                answers: [
                    "Dashie",
                    "Ninja",
                    "Etika",
                    "xQc",
                ],
                replies: [
                    "The GOAT? He didn't inspire me to <em>stream</em>, but he is an inspiration to me. Keep that in mind :)",
                    "EW NO LMAO",
                    "I didn't watch him enough. RIP GOAT.",
                    "Boy did that not age well for me."
                ],
                anger: [
                    0,
                    15,
                    -10,
                    0
                ],
                correctAnswer: [3],
                timeLim: 13.0,
            },

            {   //15
                question: "Who was my main inspiration to start building levels in GD?",
                answers: [
                    "DanZmeN",
                    "Serponge",
                    "KrmaL",
                    "JonathanGD",
                    "GD?",
                ],
                replies: [
                    "absolutely NOT. Oh my god",
                    "Amazing creator but nope.",
                    "Could you tell?",
                    "Good guess, but he wasn't the main one.",
                    "Ok, let's be clear because this may come up again and I don't wanna\
                    have to explain it more. GD means 'Geometry Dash'. You got that?",
                ],
                anger: [
                    25,
                    0,
                    0,
                    0,
                    5,
                ],
                correctAnswer: [2],
                timeLim: 15.0,
            },

            { //16
                question: "What happened here?<br>\
                <img src='img/manslaughter.png' title='manslaughter.png' width='800'>",
                answers: [
                    "Enderman dodged the arrow, got angry, and killed you",
                    "jjcooley died an ugly death",
                    "You hit the chorus plant like a boss",
                    "You unloaded your bow and decided to shoot in a safer place"
                ],
                replies: [
                    "No, but this probably did happen in an alternate timeline.",
                    "FUCK I'M SORRY I DIDN;T KNOW THE HITBOXES WERE SO BIG. LIKE AN ARROW IS SO TINY WHY DOES IT HAVE A 100000000\
                    KM HITBOX AROUND IT SORRY JACKSON",
                    "Despite my lifelong title of Da Sharpshoota, I did not.",
                    "Are you calling me a pussy?",
                ],
                anger: [
                    0,
                    0,
                    0,
                    10
                ],
                correctAnswer: [1],
                timeLim: 30.0,
                suspense: true,
            },

            {
                question: "Alright, back to more trivia. How old was I when I created this username?",
                answers: [
                    13,
                    14,
                    15,
                    16,
                    17,
                ],
                replies: [
                    "Would have been cool to lock it in that early, but how many people still use\
                    their username from when they were 13?",
                    "Nope.",
                    "Close.",
                    "Yup, a lot of what's in this part of the quiz happened that year.",
                    "That would be a little sadder.",
                ],
                anger: [
                    0,
                    0,
                    0,
                    0,
                    5,
                ],
                correctAnswer: [3],
                timeLim: 20.0,
            },

            {
                question: "Why did I change my name from the old one to We4therMan?",
                answers: [
                    "You thought it was too generic",
                    "You came to your senses and realized it sucks",
                    "You were trying to set your username in a game and all versions of it were taken",
                    "You thought it wouldn't fit the vibe of your content"
                ],
                replies: [
                    "This is actually kinda true but it wasn't a main reason.",
                    "No... so insulting.",
                    "Yeah, somehow THAT's what did it.",
                    "Haha, flattering. I wish I'd had that sort of foresight and vision for my Twitch channel."
                ],
                anger: [
                    0,
                    15,
                    0,
                    -5,
                ],
                correctAnswer: [2],
                timeLim: 25.0,
            },

            {//todo special event for player choosing more than one gd answer and I snap here
                question: "What game made me change it?",
                answers: [
                    "Clash Royale",
                    "Fortnite",
                    "Geometry Dash",
                    "Apex Legends",
                ],
                replies: [
                    "No. Did you also miss what age I made this username at?",
                    "Good guess, but I actually was one of those idiots that hated on Fortnite because it was\
                     'normie'. Look at me now...",
                    "That would be really sad. It hurts that that's what you actually thought of me.\
                     And it doesn't even matter, my old name was available there anyways.",
                    "Yes. Ironically, I did not play a <em>single</em> match of Apex and instead went to go change my username\
                    everywhere else because I liked it better. I still haven't played it to this day. Maybe I should...",
                ],
                anger: [
                    5,
                    0,
                    15,
                    0,
                ],
                correctAnswer: [3],
                timeLim: 15.0,
            },

            {
                question: "In our first streamed Minecraft world, how many times did I die (in total) before we\
                defeated the Ender Dragon?",
                answers: [
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "Too many to count"
                ],
                replies: [
                    "I appreciate your faith, but I did not have that dog in me (I don't now)",
                    "No one dies only once.",
                    "No one dies only twice",
                    "You'd think third time's the charm...",
                    "Could have been if I hadn't died during the fight too, oops.",
                    "Yeah... not my best look.",
                    "Oh no we counted"
                ],
                anger: [
                    -5,
                    0,
                    0,
                    0,
                    0,
                    0,
                    5,
                ],
                correctAnswer: [5],
                timeLim: 20.0,
            },

            {
                question: "How did I participate in defeating the dragon in that world?",
                answers: [
                    "You did all the work",
                    "You ran around, died to an enderman, and hid in a hole while your friends killed the dragon",
                    "You went Sharpshoota mode and shot down every single beacon, then the rest was a cakewalk",
                    "You were not in the End when the battle happened"
                ],
                replies: [
                    "In a universe where I had that dog in me, yeah",
                    "Yeah that's embarrassing...",
                    `I don't think "We4therMan, the carry" is a phrase that has ever been uttered.`,
                    "Ok I'm not THAT bad. Also the End is a big deal everyone's gotta be there. It's law.",
                ],
                anger: [
                    0,
                    5,
                    0,
                    5,
                ],
                correctAnswer: [1],
                timeLim: 30.0,
            },

            {
                question: "The first few YouTube videos on my channel are of what game?",
                answers: [
                    "Undertale",
                    "Apex Legends",
                    "Minecraft",
                    "Geometry Dash",
                ],
                replies: [
                    "That would have been fun but I had already done just about everything. Just about...",
                    "Are you even playing attention?",
                    "In the beginning, it was all Minecraft.",
                    "NO NO NO NO GODDAMNIT NO",
                ],
                anger: [
                    0,
                    10,
                    0,
                    25,
                ],
                correctAnswer: [2],
                timeLim: 13.0
            },

            {
                question: "What happens my first YouTube video?",
                answers: [
                    "JJCooley falls and dies (in Minecraft)",
                    "You get SHAFTED by an enchantment table and die (inside)",
                    "You fall and die (in Minecraft)",
                    "A volcano erupts",
                    "You get shot and die (in Minecraft)",
                ],
                replies: [
                    "Funny, but that's not the first.",
                    "Absolutely scammazed dude fuck this game",
                    "Funny, but that's not the first.",
                    "You... seem to know my internet footprint more than I thought.",
                    "Funny, but that's not the first."
                ],
                anger: [0,0,0,0],
                correctAnswer: [1],
                timeLim: 13.0,

                routeAns: [3],
                callSpec: "routeCheck",
            },

            {
                question: "What did we do after beating the Ender Dragon and finding End Cities in our first world?",
                answers: [
                    "You ended stream, and you all touched some grass and got some bitches",
                    "You logged off and played skribbl.io",
                    "You deleted the world ceremoniously",
                    "As is law, you blew it up",
                ],
                replies: [
                    "... <br><br><br><br><br><br><br>You're mean. WE WERE 16.",
                    "Very good guess, and under normal circumstances, we probably would have. But it was a special occasion.",
                    "Unfortunately if one of us had that idea I would have probably shut it down because I am too sentimental.",
                    "Yes, as is law."
                ],
                anger: [
                    35,
                    -5,
                    0,
                    0,
                ],
                correctAnswer: [3],
                timeLim: 25.0,
            },

            {
                question: "There's a secret video from this time period that has been in preparation since then. What is it of?",
                answers: [
                    "A Minecraft fail compilation",
                    "You beating Jevil in DELTARUNE",
                    "Your first Ender Dragon battle",
                    "A Geometry Dash fail compilation"
                ],
                replies: [
                    "No but this is actually a really good idea... COMING SOON &trade;( 2035)",
                    "That's right. Coming SOON&trade; .. SIX MORE YEARS, SIX MORE YEARS",
                    "This could be good but my POV was probably the most boring",
                    "hell no. It would be too long"
                ],
                anger: [
                    0,
                    0,
                    0,
                    15
                ],
                correctAnswer: [1],
                timeLim: 25.0,
            },

            {
                question: "Which of the following series on my channel never concluded properly?",
                answers: [
                    "The Lab",
                    "The first Minecraft world",
                    "The Pokémon Black 2 SoulLink Nuzlocke (ft. Simon)",
                    "The Pokémon Sword Nuzlocke",
                ],
                replies: [
                    "Nope, it ended with a whimper but it concluded.",
                    "I mean you did just answer a bunch of questions about this one that should have implied that it did.\
                    I don't think you're making much of an effort here...",
                    "Yeah we gotta get back on that and try again man",
                    "Nope, this one reached an epic conclusion actually."
                ],
                anger: [
                    0,
                    5,
                    0,
                    0,
                ],
                correctAnswer: [2],
                timeLim: 25.0,
            },

            {
                question: "You know SoulCantSpeech, right? We're gonna refer to her as Soul for the remainder of this quiz.\
                <br>What is the first game series we streamed together?",
                answers: [
                    "Portal 2",
                    "Minecraft",
                    "Geometry Dash",
                    "Team Fortress 2",
                    "Who's that?"
                ],
                replies: [
                    "GIVE ME THE CUB E",
                    "OK, this is complicated because we did play Minecraft together on stream first, but it was not a\
                    collab. It was a regular Minecraft stream with a lot of people in the server. By this definition,\
                    this is incorrect. Yeah, I'm that way about rules. Sorry. I'm normally like this.",
                    "pff imagine collaborating with someone in GEOMETR oh wait",
                    "Nah this is one of those games that I promised to play at some point and never did (many such cases)",
                    "OK, how about you leave the questions to me and you just try to answer them."
                ],
                anger: [
                    0,
                    0,
                    25,
                    0,
                    10,
                ],
                correctAnswer: [0],
                timeLim: 25.0,
            },

            {
                question: "What did I <em>usually</em> call my swords in Minecraft?",
                answers: [
                    "Sordie",
                    "Jason Cropper", //add weezer easter egg
                    "tHe jizzer",
                    "Blade of Justice",
                ],
                replies: [
                    "No, that's my Honedge :)",
                    "W",
                    "PFHAHAHAHA YOU'RE FUCKING GROSS WHY WOULD I CALL MY SWORD THAT. FREAK.",
                    "Yeah, this might be the first time a Geometry Dash reference actually helps you out here. Unfortunately."
                ],
                anger: [
                    -5,
                    -5,
                    -50,
                    5,
                ],
                correctAnswer: [3],
                timeLim: 18.0,
            },

            {
                question: "What do I usually call my horses in Minecraft?",
                answers: [
                    "Horsie",
                    "Dear",
                    "Horace",
                    "Your mom",
                ],
                replies: [
                    "Cute... but a little gay",
                    "I said Minecraft, not My Little Pony Tropical Love Island of Magical Friendship Deluxe",
                    "IT'S FUNNY RIGHT????????",
                    "Calling your mom a horse would be a compliment... and she owes me $10",
                ],
                anger: [
                    0,
                    0,
                    0,
                    10,
                ],
                correctAnswer: [2],
                timeLim: 15.0,
            },

            {
                question: "Out of these levels, which I built live, which one was streamed from the very start of the process?",
                answers: [
                    "Misty Mountains", //todo: if player has been punished for GD answers, add "it's gonna be OK"
                    "Incinerate",
                    "Aura",
                    "Cryo",
                ],
                replies: [
                    "Yes, this is actually the only level of mine whose first built block was streamed live. I personally\
                    find that kinda neat.", //add an it's not neat option that insta kills you
                    "Nope, a couple of seconds of gameplay were made off stream.",
                    "Nope, the first section was completed off stream.",
                    "Nope, a bit of gameplay was made off stream, though that part was cut from the final level. Technically,\
                    the first built blocks of the <em>final</em> version of the level were streamed, so you get to walk home\
                    with a wrong answer that is technically correct. Enjoy!",
                ],
                anger: [
                    0,
                    0,
                    0,
                    0
                ],
                correctAnswer: [0],
                timeLim: 25.0,
            },

            {
                question: "I started building a level between completing Aura and starting Misty Mountains. What was it called?",
                answers: [
                    "Cryo",
                    "Clubbin",
                    "Apocalypse City",
                    "Incinerate"
                ],
                replies: [
                    "No, that was way after Misty.",
                    "No, that was WAY before Misty.",
                    "No, that was before Aura.",
                    "Yup. Ideas ran dry for that one and I decided to focus on Misty instead."
                ],
                anger: [0,0,0,0],
                correctAnswer: [3],
                timeLim: 20.0,
            },

            {
                question: "There is a part in Aura that takes heavy inspiration from Falling Up by KrmaL. Is he OK with this?",
                answers: [
                    "Yes",
                    "No",
                    "He will never notice you lil bro",
                ],
                replies: [
                    "He's probably never seen the full level but it was nice of him to respond!<br>\
                    <img src='img/krmal.jpg' title='Leaking DMs is a little trashy but like, whos gonna see this ;)'\
                    width='600px'>",
                    "You'd be surprised!",
                    "What made you feel the need to say that?"
                ],
                anger: [
                    0,
                    0,
                    50,
                ],
                correctAnswer: [0],
                timeLim: 20.0,
            },

            {
                question: "What is the name of the very first level I made?",
                answers: [
                    "Apocalypse City",
                    "2 Eezy",
                    "Test",
                    "Aura",
                    "Jump and Bounce",
                    "Misty Mountains",
                ],
                replies: [
                    "No, I built levels way before streaming.",
                    "What gave it away?",
                    "There's a bunch of those out there.",
                    "Did you click that just to see what this would say?",
                    "One of my first, but this one is a full-length level!",
                    "I think we've established really well by now that this is not the answer. Are you just bored?\
                    I hope not, or else it means this game sucks."
                ],
                anger: [
                    0,
                    0,
                    0,
                    5,
                    0,
                    10,
                ],
                correctAnswer: [1],
                timeLim: 25.0,
            },

            {
                question: "The verification of Misty Mountains marked a somewhat unrelated inflection \
                point in my Twitch channel's history. What was it?",
                answers: [
                    "You started streaming other games more",
                    "Streams became less frequent",
                    "Stream archives became a lot more sporadic",
                    "Viewership increased significantly",
                ],
                replies: [
                    "Nah, it was still mainly Geometry Dash with the occasional Minecraft for a while.",
                    "It may appear so, but they stayed consistently frequent for at least the next few months.",
                    "I don't know why, but after archiving all the Misty streams I didn't feel especially inclined to archive\
                    every stream anymore, mostly out of laziness.",
                    "lol I wish",
                ],
                anger: [
                    0,
                    0,
                    0,
                    1,
                ],
                correctAnswer: [2],
                timeLim: 30.0,
            },

            {
                question: "What's the last game I streamed before moving to college?",
                answers: [
                    "Mario Kart DS",
                    "Minecraft",
                    "Geometry Dash",
                    "Mario Kart 8",
                ],
                replies: [
                    "You either SOMEHOW remember that one stream or you cheated and \
                    looked at the archives and still got it wrong... or you're just clicking shit.",
                    "It could have just as easily been this.",
                    "Sad right?",
                    "I did not have my Elgato set up at that time, it was probably packed somewhere."
                ],
                anger: [
                    5,
                    0,
                    0,
                    0,
                ],
                correctAnswer: [2],
                timeLim: 18.0,
            },

            {
                question: "Who was my first live guest?",
                answers: [
                    "Soul",
                    "Lamas",
                    "Your brother",
                    "Achrotone",
                ],
                replies: [
                    "Coming soon",
                    "Coming soon",
                    "He's appeared in my streams but against my will, so he was not a guest. Maybe one day he could be!",
                    "The first and only one so far!"
                ],
                anger: [0,0,0,0],
                correctAnswer: [3],
                timeLim: 18.0,
            },

            {
                question: "What game was I playing when I 'did a flip'?",
                answers: [
                    "Minecraft",
                    "Fall Guys",
                    "Overwatch",
                    "Chess"
                ],
                replies: [
                    "It's hard to flip when you're made of cubes. There's definitely\
                     no videogame based entirely on this premise.",
                    "<a href='https://www.twitch.tv/we4therman/clip/ExquisiteFuriousOxCharlieBitMe' target='_blank'>Fitting, right?</a>",
                    "If I had while playing this, it would have probably been out of rage.",
                    "It would at least make a chess stream interesting."
                ],
                anger: [0,0,0,0],
                correctAnswer: [1],
                timeLim: 18.0,
            },

            {
                question: "In my first college dorm, my three roommates would sometimes pop into my streams.\
                Which of these is NOT one of their names?",
                answers: [
                    "Jacob",
                    "Abraham",
                    "Joseph",
                    "Henry",

                ],
                replies: [
                    "The flamboyant king was definitely one of them. Though I don't think his name\
                    was ever said in my stream, so don't take this error too hard.",
                    "My fellow Mexican roommate was definitely one of them. Though I don't think his name\
                    was ever said in my stream, so don't take this error too hard.",
                    "I've never had a Joseph roommate. I don't plan to reach that point in life.",
                    "Perhaps the roommate who appeared the most, he was definitely one of them.",
                ],
                anger: [0,0,0,0],
                correctAnswer: [2],
                timeLim: 22.0,
            },

            {
                question: "Of my four years of college, which one did I go live in the \
                least amount of times (not counting summers)?<br>\
                For reference, I started college in 2020.",
                answers: [
                    "Freshman", //many
                    "Sophomore", //11
                    "Junior", //9
                    "Senior", //6
                ],
                replies: [
                    "Nope, I streamed so much that year.",
                    "This is a great guess if you know what happened that year. However, it's still more than the lowest amount.",
                    "There was a bit of a comeback some time here that makes this the wrong year.",
                    "Perhaps an easy answer to guess. I was definitely too busy that year to stream. I counted a total of six times."
                ],
                anger: [0,0,0,0],
                correctAnswer: [3],
                timeLim: 25.0,
            },

            {
                question: "In early 2022, I announced that I would take an indefinite break from streaming.\
                Which of the following was NOT a reason I made that decision.",
                answers: [
                    "You did not like the environment you were streaming in",
                    "You wanted to spend less time online to foster your social life",
                    "You realized you were washed up and no one was watching your streams anyways",
                    "You wanted to focus more free time on music",
                    "You were getting bored of streaming",
                    "You wanted to play more videogames for yourself without the pressure of wanting to stream them"
                ],
                replies: [
                    "I'm very particular about physical privacy and background noise when I stream.\
                    I was always uncomfortble streaming while having people in the same room as me. This was a big reason.",
                    "Should go without saying, especially as covid was winding down during that time. This was probably\
                    the biggest reason.",
                    "Wow, we've got a Debbie Downer here. Do you actually feel that way? This answer fits the bill but...\
                    Jesus you have problems.",
                    "I definitely wanted to clear out alternatie ways to spend my alone time so I would work on music more.",
                    "I never really got bored of streaming. I've always had fun doing it, but I needed a change\
                    of pace for the other reasons.",
                    "It might sound odd, but I had an issue with not playing games because I wanted to 'save them for stream',\
                    but because I didn't like my streaming environments I never would. This is how I ended up buying a bunch\
                    of games I never played, haha."
                ],
                anger: [
                    0,
                    0,
                    25,
                    0,
                    0,
                    0,
                ],
                correctAnswer: [2,4],
                timeLim: 70.0,
            },

            {
                question: "What game did I play in the ONLY stream I did while I worked in Texas?",
                answers: [
                    "Geometry Dash",
                    "Chess",
                    "Deltarune",
                    "Overwatch"
                ],
                replies: [
                    "I don't like that you asssumed that I would make myself suffer MORE like that",
                    "And it went pretty bad!",
                    "It was not the time yet.",
                    "My poor laptop would have probably k1lled itself."
                ],
                anger: [
                    15,
                    0,
                    0,
                    0,
                ],
                correctAnswer: [1],
                timeLim: 25.0,
            },

            {
                question: "How long was my 2022 hiatus?",
                 answers: [
                    "98 days",
                    "157 days",
                    "276 days",
                    "333 days",
                 ],
                 replies: [
                    "That's way too short. I pull those numbers regularly haha.",
                    "Good guess.",
                    "January 11 to October 14. That's as long as I could do.",
                    "This would have been a cool number",
                 ],
                 anger: [0,0,0,0],
                 correctAnswer: [2],
                 timeLim: 18.0,
            },

            {
                question: "What game did I stream when I came back from that hiatus?",
                answers: [
                    "Among Us",
                    "Mario Kart 8",
                    "Geometry Dash",
                    "Pimantle",
                ],
                replies: [
                    "If you guessed this, you probably saw the archives. The correct answer is \
                    actually a in lost stream. Good luck!",
                    "No, but this would have been kinda fun.",
                    "Why the hell would I come back to just play that??",
                    "Crazy idea right?"
                ],
                anger: [
                    0,
                    0,
                    15,
                    0,
                ],
                correctAnswer: [3],
                timeLim: 20.0,
            },

            {
                question: "Which of these Extreme Demons did I make the most progress on?",
                answers: [
                    "Phobos",
                    "Falling Up",
                    "Black Blizzard",
                    "Bloodbath",
                ],
                replies: [
                    "Nah, I barely committed to that bit.",
                    "I always had a tough time with this level.",
                    "Surprisingly, yes. I must have like over 80,000 attempts on this by now.",
                    "Nope, straight fly sux!!"
                ],
                anger: [0,0,0,0],
                correctAnswer: [2],
                timeLim: 20.0,
            },

            {
                question: "What was I doing in the ONLY outdoors stream I've done?",
                answers: [
                    "Hiking",
                    "Jogging",
                    "Biking",
                    "Having a quiet stroll",
                ],
                replies: [
                    "Nope, but it might be fun.",
                    "Nope, that would probably not be fun to watch unless you enjoy watching me sweat and suffer.",
                    "Yup, and most of the stream cut out because cell service is bad in the hills of Berkeley.",
                    "Recipe for disaster, think about it."
                ],
                anger: [0,0,0,0],
                correctAnswer: [2],
                timeLim: 18.0,
            },

            {
                question: "OK, let's try this again: what's my name?",
                answers: [
                    "We4therMan",
                    "We4therMan",
                    "I know you better than you think.",
                ],
                replies: [
                    "Good",
                    "Good",
                    "",
                ],
                anger: [0,0,0],
                correctAnswer: [0,1],
                timeLim: 5.0,
                suspense: true,

                routeAns: [2],
                callSpec: "routeCheck"
            }
        ],

//special texts appear in **PRIORITY ORDER**
/* dicts organized as
{
    restTxts (tell player it's the interlude)
    (for "fail" texts, there is be a "failing" variable that determines if the player is failing the quiz [score < %50])

    varyingTexts (extras depending on things player has done)

    readyTxts (tell player the next question will follow)
}

Each are objects. They may contain arrays of strings, or lone strings.
*/

/*
Labels organized such that the default text shown is always 'reg'.
This means restTxts and readyTxts should have a 'reg' defined. They can be blank strings.
*/
/* -----------------------------------------------------INTERLUDES-------------------------------------------------------------- */
        interludes: [
            {//1
                restTxts: {
                    reg: [
                        "That was a tough question! You've done well so far... You should take a short rest.",
                        "Hopefully that gave you a solid idea for how this quiz works!",
                        "When you're ready, press the button that says 'ready.'"
                    ],
                    fail: [
                        "That was a tough question!", 
                        "You're... not doing so great with even the easy ones, though.",
                        "At least now you should have a sense for how this quiz works.",
                        "Take a breather, you want your brain sharp for these next ones!",
                        "When you're ready, press the button that says 'ready.'"
                    ],
                },
                
                specialTxts: {
                    cum: "...holy shit I can't believe you actually said that HAHAHAHA",
                    ang: "By the way, you gotta relax with some of your answers... I'll be honest, they're a bit insulting.",
                },
                //TODO: ready txts should appear after player clicks continue. Then automatically takes you to the next question
                readyTxts: {
                    reg: "Alright, these next questions are all about my streams. Good luck!",
                    ang: "Well, whatever, here are the next questions. They're about my streams.",
                },
            },

            {//2
                restTxts: {
                    reg: [
                        "Good job! You've made it through the second part of the quiz.",
                        "It's time for a break. Take as long as you want, and proceed when you're ready."
                    ],
                    fail: [
                        "You've made it past the second part of the quiz.",
                        "It seems you got a lot of questions wrong. That's OK, these are really hard if you haven't\
                        watched a lot of my streams.",
                        "You can always try again!",
                        "Meanwhile, relax and prepare for the next part of the quiz."
                    ]
                },

                specialTxts: {
                    cum: "oh my god you freak I can't believe you said that HAHAHA. By sword I really did\
                     mean a sword not a DICK LMAO",
                    ang: [
                        "Not gonna lie, I haven't been liking some of your answers. You don't appear to be very... nice to me.",
                        "Feels like you're making a lot of assumptions about me.",
                        "I hope your attitude improves, it'd be a shame to make you lose your progress over it :)"
                    ],
                },

                readyTxts: {
                    reg: "You just answered questions about my streams. This part will test how much you REALLY know me.\
                    This'll be fun... for me, haha.",
                    ang: "Well, here's the next questions. I'm not particularly excited to see how you answer\
                     these but oh well. Just go."
                },
            },
        ],

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

/* --------------------------------------------------=ENDINGS=---------------------------------------------------------------- */
//In the code, endings are treated as special kinds of interludes (and share some functions)
        endings: 
            {
                main: {
                    intro: [
                        "Congratulations! You've finished the quiz.",
                        "Go ahead and pat yourself on the back, that was a lot of questions!",
                    ],
                    score: [
                        `How many questions exactly? Well, you gave ANSWERS_GIVEN answers`,
                        `and SCORE were correct.`,
                        `That's a score of SCORE_PERCENT%`,
                    ],
                    feedback: {
                        S: [
                            "Perfect score! You get an S. 'S' stands for 'special', because you're a special little cupcake!",
                            "But did you answer ALL the questions...?"
                        ],
                        A: "You get an A! You did great, but will you try to reach the top...?",
                        B: "You get a B. Not bad, but you could get a better score. Will you try again?",
                        C: "That's a C. Not great. Maybe this isn't your day. Do you want to try again?",
                        D: "That's a D. Not good. Maybe some of the questions were a bit unfair. Surely if you tried again it will go better, right?",
                        F: "That's an F. You failed. Are you happy with yourself?",
                        SuperF: "For that you get a Super F. You Super Failed the quiz. How did you even let this happen?\
                        Do you even care about people around you?"
                    }
                },

                y: {
                    intro: [
                        "Congratulations, you've reached a secret ending of the quiz!",
                        "You know, I secretly hoped this would get some more people interested in my black MIDIs,\
                        but I realize making this a <em>secret</em> is kinda... counterintuitive."
                    ],
                    score: [
                        `On this run, you gave ANSWERS_GIVEN answers.`,
                        `and SCORE were correct.`,
                        `That's a score of SCORE_PERCENT%`,
                        //TODO: add route answers given score
                    ],
                    //Feedback for routes should apply to route answers
                    feedback: {
                        S: "A perfect score? You're either me, or you studied for this. Why would you do either of those?",
                        A: "Pretty good! You know my alter ego well.",
                        B: "Not bad.",
                        C: "Can't blame you, some of these are pretty obscure.",
                        D: "Could have been worse, I guess",
                        F: "I mean... it's not like this is going on your job application or something",
                        SuperF: "Really? Nothing?"
                    }
                },
            }
    }

