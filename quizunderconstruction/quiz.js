//sound variables
//these const variables are what cause the two 'AudioContext not allowed to start' errors. The errors are benign.
const mus = new Tone.ToneAudioBuffers({
  urls: {
    firstfew: "aud/mus_thefirstfew_0.ogg",
    firstfew_w: "aud/mus_thefirstfew_w.ogg",
    //interlude: "aud/mus_interlude.ogg", //TODO write this song lol
    jonas: "aud/mus_jonas.ogg",
  },
  onload: () => {
    console.log("Music buffers loaded")
    //start button appears after audio is loaded (prevents buffer errors)
    $("#startButton").show()
    $("#loading").hide()
  }
});

const sfx = new Tone.ToneAudioBuffers({
  urls: {
    wrong: "aud/snd_wrong.ogg",
    correct: "aud/snd_correct.ogg",
    tic: "aud/snd_tic.ogg",
    blip: "aud/snd_blip.ogg",
    gameover: "aud/snd_gameover.ogg",
    jonas: "aud/snd_jonas.ogg",
    girl: "aud/snd_girl.ogg",
    y1: "aud/snd_y1.ogg",
    y2: "aud/snd_y2.ogg",
    y3: "aud/snd_y3.ogg",
    y4: "aud/snd_y4.ogg",
    y5: "aud/snd_y5.ogg",
  },
  onload: () => {
    console.log("sfx buffers loaded")
  }
});

let musPlayer;
let sfxPlayer;
let distortion;
var musVol = -5;
var sfxVol = -5;

//question variables
var questions = quiz.questions
const interludes = quiz.interludes
const endings = quiz.endings
var currentQInd;
var currentIntInd;

const indOf = {
  questions: () => currentQInd,
  interludes: () => currentIntInd,
  endings: () => currentEnd,
}

var isCorrect = false;

//score variables
var correctScore = 0;
var angScore = 0;
var angStage = 0;
var failing = false;
var playedAnswers = [];
var timeOuts = 0;
var easyMode = false;

//route variables
var burgerOn = false;
var cumOn = false;
var yairOn = false;
//'-Ans' names of special answers in quiz-data.js
const specialKeys = ['burgerAns', 'cumAns','yairAns'];
let questionPrefix = ""

//UI variables
let ce = "intro"; //defines current event; MUST MATCH quiz-data ARRAY NAMES (i.e. 'questions' with an s)
let ticRate = 200;
let timeCounter;
let buttonAnsTimer;
let btnTimeouts = [];
let shakeIntervals = {};
let ansClicks = 0;
let delay;
let speedUp = false;
let allAnswersLoaded = true;

$(function() {
  $("#startButton").on("click", async function() {
    await Tone.start();
    //initiate music player
    musPlayer = new Tone.Player().toDestination();
    musPlayer.buffer = mus.get("firstfew");
    musPlayer.loop = true;
    musPlayer.volume.value = musVol;
    musPlayer.start();
    console.log("Music started")

    //initiate sfx player
    sfxPlayer = new Tone.Player().toDestination();
    sfxPlayer.volume.value = sfxVol;
    console.log("SFX player initialized")

    //initiate effect plugins
    distortion = new Tone.Distortion(0.5).toDestination();

    $("#startButton").hide();

    //POWERFUL: the most frequent updater. Most useful for keeping angerstage updated at all times.
    $(document).on('click', function() {
      showAnger(angStage);
    })

    setTimeout(() => {
      initQuiz();
    }, 10)
  });

  $("#nextButton").on("click", function(){
    clearTimeout(buttonAnsTimer);
    nextEvent();
  });

  // $("#contButton").on("click", function(){
  //   nextEvent();
  // })
//TODO: make interludes end with ready, continue is for revealing the endInterlude text
  $("#readyButton").on("click", function(){
    console.log("uhh do something?")
  })

  $("#musVolume").on("input", function() {
    musVol = parseFloat(this.value);
    musPlayer.volume.value = parseFloat(this.value);
    musPlayer.mute = (this.value <= -30.0) ? true : false;
  });

  $("#sfxVolume").on("input", function() {
    sfxVol = parseFloat(this.value);
    sfxPlayer.volume.value = sfxVol;
    sfxPlayer.mute = (sfxVol <= -30.0) ? true : false;
  });

  $("#settingsButton").on("click", function() {
    $(".sliders, #studioTag").toggle(500);
  });
})

function initQuiz() {
  console.log("Initializing quiz");
  //reset variables
  correctAnswers = 0, currentQInd = 0, currentIntInd = 0, angScore = 0, angStage = 0, timeOuts = 0;
  resetSpecials(); //don't know why this is a function and the above is not. I guess they're not special.
  $(".quizWelcome").hide();
  $("#quizContainer").show();
  //reassign button function
  $("#nextButton").off("click").on("click", function(){
    clearTimeout(buttonAnsTimer);
    nextEvent();
  }).text("Next");
  loadQuestion(currentQInd);
}

//setTimeout(() => {}, 2000);

function loadQuestion(currentQInd){
  ansClicks = 0
  allAnswersLoaded = false;
  console.log(`initializing question ${currentQInd+1}`);
  ce = "questions"
  $("#quizContainer, #result").show();
  $("#quizContainer, #result").empty();
  $("#nextButton, #contButton, #intContainer").hide();
  //load in question data
  const q = questions[currentQInd];
  let {
    question: currQuestion,
    answers: currAnsSet,
    replies: currRepSet,
    anger: currAngSet,
    correctAnswer: currCorrAns,
    suspense: sus,
    timeLim: timeLimRaw
  } = q;
  console.log(`${currQuestion} HWY IS IT NOT P????`)
  let timeLim = (easyMode) ? (1.5 * timeLimRaw) : timeLimRaw; //time limit longer in easy mode
  let currRouteAns = q.routeAns || []; //if there are no route answers, an empty array will be checked instead
  console.log(q.routeAns, currRouteAns)
  ticRate = (sus) ? 1000 : 200; //slow tics for high suspense
  sfxPlayer.buffer = sfx.get("tic"); //load tic to player

  runCallSpec(q.callSpec); //call special event function if qData has one

  let answersGenerated = 0;

  currAnsSet.forEach((currAns,ansInd) => { //answer options and indices
    let currAng = currAngSet[ansInd] //anger values
    let currRep = currRepSet[ansInd] //replies
    let isCorrect = currCorrAns.includes(ansInd)
    let isRoute = currRouteAns.includes(ansInd)
    console.log("route ans, ind, is route?",currRouteAns,ansInd,isRoute)
    if (ansClicks) {
      delay = 0; //generate the rest of the buttons if one is clicked
    } else if (speedUp) {
      delay = (ansInd + 1) * 50; //fast version if speedup key is pressed down
    } else {
      delay = (ansInd + 1) * ticRate; //normal speed
    }

    let buttonAnsTimer = setTimeout(() => {
      answersGenerated++;
      if (answersGenerated === currAnsSet.length) allAnswersLoaded = true;
      // generateAns(ansInd, isCorrect, currAns, currAng, currRep, specilK, isSpecil);
      generateAns(ansInd, isCorrect, currAns, currAng, currRep, isRoute);
      if (!ansClicks) sfxPlayer.start(); //play tic
    }, delay); //todo: make timeout 0 if skip option is true
    btnTimeouts.push(buttonAnsTimer);
  });

  musPlayer.playbackRate = (sus) ? 0.90 : 1.0;

  $("#question")
    .html(`${questionPrefix}${(currentQInd + 1).toString()}. ${currQuestion}`)
    .css({"color": "white", "font-size": "48px"});
  genTimer(timeLim);
  // $("#timerContainer").fadeIn(3000); //REMOVE THIS LINE WHEN YOU'RE DONE TESTING
};

//t should be in seconds
function genTimer(t,fadeTime = 3000) {
  //clear old timer
  let con = $("#timerContainer")
  con.empty().finish().hide();
  //create timer element
  let timer = $("<span />")
    .addClass("timer")
    .html(`${t.toFixed(2)}`)
  //append to question element
  con.append(timer)
  //update timer every 0.1 s
  timeCounter = setInterval(() => {
    t -= 0.01
    timer.html(`${t.toFixed(2)}`);
    //reveal only at 10 seconds left
    if (t < 10) con.fadeIn(fadeTime);
    if (t < 5) timer.css({"color": "red"});
    if (t <= 0.001) timesUp();
  }, 10)

}

function stopGenAns() {
  console.log("killing generator")
  btnTimeouts.forEach(clearTimeout);
  btnTimeouts = [];
    
  const q = questions[currentQInd];
  let currAnsSet = q["answers"]
  // let specil = checkGetSpecial(currentQInd, specialKeys);
  // let specilKs = Object.keys(specil), specilIs = Object.values(specil);

  currAnsSet.forEach((currAns, ansInd) => {
    //if the button already exists, skip to avoid duplicates
    if ($(`#ans-${ansInd}`).length > 0) return;
    let {
      replies: currRep,
      anger: currAng,
      correctAnswer: currCorrAns,
    } = q
    let currRouteAns = q.routeAns || [];
    let isCorrect = currCorrAns.includes(ansInd)
    let isRoute = currRouteAns.includes(ansInd)
    // let currRep = qData(currentQInd)[2];
    // let currAng = qData(currentQInd)[3];
    // let isCorrect = qData(currentQInd)[4].includes(ansInd);
    // let isSpecil = specilIs.includes(ansInd);
    // let specilK = specilKs.find(k => specil[k] === ansInd);
    generateAns(ansInd, isCorrect, currAns, currAng, currRep, isRoute);
  });
}


function selectTexts(ind) {
  let fail = failing, angry = (angStage > 0), cum = cumOn; //update variables for state
  let states = {fail, angry, cum} //all possible selectors as simple boolean states (update as more are added)
  const intSet = interludes[ind];

  //selects only one matching restTxt
  //it will select the first activated specialKey it finds, so priority order is set in the interlude object
  let restKey = Object.keys(intSet.restTxts).find(key => key !== 'reg' && states[key]) || 'reg'; 
  let restTxt = intSet.restTxts[restKey]
  //ditto for readyTxts
  //TODO: fix cum route text not getting selected
  let readyKey = Object.keys(intSet.readyTxts).find(key => key !== 'reg' && states[key]) || 'reg';
  let readyTxt = intSet.readyTxts[readyKey]
  //select any activated specialTxts (can be multiple)
  let specialTxts = Object.keys(intSet.specialTxts)
    .filter(key => states[key])
    .map(key => intSet.specialTxts[key])

  return [restTxt, specialTxts, readyTxt]
};

function loadInterlude(ind) {
  ce = "interludes"
  $("#quizContainer, #intContainer, #question, #result").empty();
  $("#quizContainer, #nextButton").hide();
  $("#intContainer").show();
  sfxPlayer.buffer = sfx.get("blip");

  failing = (correctScore/currentQInd < 0.5) ? true : false;

  let intTxts = selectTexts(ind).slice(0,2).flat().filter(Boolean); //blank arrays/strings could be included, so filter them out
  let nextTxts = [(selectTexts(ind)[2])].flat().filter(Boolean); //ensure it's an array even if one one array is extracted

  console.log(intTxts);
  console.log(nextTxts);

  //show continue button last
  setTimeout(() => {
    $("#readyButton")
      .show()
      .on("click", function() {
        $("#intContainer").empty();
        //show nextTxts sequentially upon click
        nextTxts.forEach((nextTxt,iNextTxt) => {
          var contTimer = setTimeout(() => {
            generateIntTxt(nextTxt);
            sfxPlayer.start();
          }, iNextTxt * 1000);
        })
        $(this).off("click").hide();
        $("#nextButton").show();
      })
      
    sfxPlayer.start();
  }, (intTxts.length) * 1000);

  //show intTxts sequentially
  intTxts.forEach((intTxt,iIntTxt) => {
    var intTimer = setTimeout(() => {
      generateIntTxt(intTxt);
      sfxPlayer.start();
    }, iIntTxt * 1000);
  })
};

//
function checkGetSpecial(ind,spKeys){
  return spKeys
    .filter(spKey => questions[ind].hasOwnProperty(spKey)) //make a new array of only the present keys
    .reduce((result, spKey) => {
      result[spKey] = questions[ind][spKey];
      return result;
    }, {});
};

function resetSpecials(){
  burgerOn = false, cumOn = false, easyMode = false;
  console.log("special keys reset")
}

//on button press, if button is special, activate key
function setSpecials(key){ 
  switch (key) {
        case "burgerAns":
          burgerOn = true;
          console.log("BURGER ACTIVATED");
          break;
        case "cumAns":
          cumOn = true;
          console.log("CUM ACtiVATED");
          break;
        default:
          console.log(`no special key`);
          break;
      }
};

function generateAns(bInd,isCorrect,ans,ang,rep,isRoute) {
  //add both classes if route, otherwise only the regular answer class
  const classes = isRoute ? 'multChoice routeAns' : 'multChoice';
  var button = $('<button />') 
    .addClass(classes)
    .attr("id",`ans-${bInd}`)
    .html(ans)
    .data({ans,isCorrect,ang,rep})
    .on("click", function(){
      let data = $(this).data();
      result(data.isCorrect,data.ang,data.rep);
      playedAnswers.push(ans);
    });

  if (angStage > 0) button.addClass("angPulse");
  if (angStage > 1) startShake(bInd);

  $("#quizContainer").append(button);
};


//create <p> element with a given string. For interlude text
function generateIntTxt(txt) {
  var t = $('<p />')
  .addClass("intTxt")
  .html(txt);

  $("#intContainer").append(t);
  // $("#intContainer").append("<br>")
};

//handle answer choice
function result(isCorrect,ang,rep) {
  ansClicks = 1;
  if (!allAnswersLoaded) stopGenAns();
  clearInterval(timeCounter);
  angScore += ang;
  pulseBG(isCorrect ? "#007d00" : "#7d0400");
  if (isCorrect) correctScore++;
  quickSFX(isCorrect ? "correct" : "wrong")
  // sfxPlayer.buffer = sfx.get(isCorrect ? "correct" : "wrong");
  // sfxPlayer.start();

  $("#result").html(rep)
  //disable buttons upon click
  $(".multChoice").off("click").on("click", function(){
    ansClicks++;
    switch (ansClicks) {
      case 5:
        $("#question").text("Hey, you already picked an answer. Move on to the next question.");
        break;
      case 15:
        $("#question").text("...stop that.");
        angScore += 5;
        break;
      case 30:
        $("#question").text("Now you're really pushing my buttons... haha.");
        angScore += 10;
        break;
      case 45:
        $("#question").text("ok it's actually not funny. please stop, seriously");
        angScore += 50;
        break;
      case 60:
        $("#question").text("you're irritating, you know that?");
        angScore += 70;
        break;
      case 75:
        $("#question").text("JESUS CHRIST STOP").css({"color": "red"});
        angScore += 250;
        break;
      case 100:
        gameOver();
        $("#question").html("OK, I don't know what you're trying to achieve here. I'm making you start over. DON'T DO IT AGAIN.<br><br>GAME OVER");
        break;
    }
  })
  //console.log(angScore, correctScore);
  checkAnger(angScore);
  showAnger(angStage);
  musPlayer.playbackRate = 1.0;
  $("#nextButton").show();

  if (angStage === 3) gameOver();
}

function pulseBG(color,pulseLength = 2) {
  const bg = $(".background")
  bg.css({"transition": "none", "background-color": color})
  setTimeout(() => {
    bg.css({"transition": `background-color ${pulseLength}s ease`, "background-color": "black"})
  }, 5);
}

function checkAnger(ang) {
  switch (true) {
    case ang < -100:
      angStage = -2
      break;
    case ang >= -100 && ang < -50:
      angStage = -1
      break;
    case ang >= -50 && ang <= 50:
      angStage = 0
      break;
    case ang > 50 && ang <= 100:
      angStage = 1
      break;
    case ang > 100 && ang < 150:
      angStage = 2
      break;
    case ang >= 150:
      angStage = 3
      break;
  }
};

function showAnger(stage) {
  if (stage <= 0) {
      $(".multChoice").attr("background-color", "white");
      $(".multChoice").attr("border-color", "gray");
      sfxPlayer.playbackRate = 1;
  }

  if (stage >= 1) {
      sfxPlayer.playbackRate = 0.8;
  }

  if (stage >= 2) {
      // $(".multChoice").addClass("angShake");
      sfxPlayer.playbackRate = 0.6;
      // musPlayer.connect(distortion)
      // TODO: make angry versions of songs and sfx
  }
}


function nextEvent() {
  let evInd = indOf[ce]?.(); //select index of current event
  let ne = quiz[ce][evInd].nextEvent //check if ce has nextEvent label and store it
  console.log("NEXT EVENT DATA",ce,currentQInd,currentIntInd,ne)

  if (!ne) return loadQuestion(++currentQInd); //if no label, update index and load next question
  else if (ne === "interlude") return loadInterlude(currentIntInd++); //if interlude, load interlude and update index
}

function gameOver() {
  $("#question").text("GAME OVER").css({"color": "red", "font-size": "76px"});
  $("result").css({"color": "red"});
  $("#nextButton").off("click").on("click", function(){
    initQuiz()
  }).text("START OVER");
  musPlayer.playbackRate = 0.25;

  quickSFX("gameover");
};

function endQuiz(ending) {
  ce = "endings"
  $("#quizContainer, #intContainer, #question, #result").empty();
  $("#quizContainer, #nextButton, #readyButton").hide();
  $("#intContainer").show();
  sfxPlayer.buffer = sfx.get("blip");
  const answersGiven = playedAnswers.length
  const scorecent = (100 * (correctScore / answersGiven)).toFixed(1)

  //todo: add route handler (probably needs a new variable up top)

  const introTxt = endings[ending]['intro'];
  const scoreTxt = endings[ending]['score'];
  const feedbackTxt = endings[ending]['feedback'][letterGrade(scorecent)];

  scoreTxt[0] = scoreTxt[0].replace("ANSWERS_GIVEN", answersGiven);
  scoreTxt[1] = scoreTxt[1].replace("SCORE", correctScore);
  scoreTxt[2] = scoreTxt[2].replace("SCORE_PERCENT", scorecent);

  const endingTxt = [introTxt,scoreTxt,feedbackTxt].flat().filter(Boolean);

  endingTxt.forEach((txt,i) => {
    setTimeout(() => {
      generateIntTxt(txt);
      sfxPlayer.start();
    }, 2000 * i);
  });

  $("#nextButton").off("click").on("click", function(){
    initQuiz();
  }).text("REPLAY");

  setTimeout(() => {
    $("#nextButton").show();
    sfxPlayer.start();
  }, 2000 * endingTxt.length)

}

function letterGrade(score) {
  if (score < 0 || score > 100) throw new Error("Score percent was not 0-100... somehow.");
  if (score === 100) return "S";
  if (score >= 85)   return "A";
  if (score >= 70)   return "B";
  if (score >= 60)   return "C";
  if (score >= 50)   return "D";
  if (score >= 5)    return "F";
  return "Super F";
}


//for sounds that play in quick succession and can't use an existing player
function quickSFX(buffer,rate=1) {
  if (!sfxPlayer.mute) {
    let sound = new Tone.Player(sfx.get(buffer)).toDestination();
    sound.volume.value = sfxVol;
    sound.playbackRate = rate
    sound.start();
    sound.onstop = () => sound.dispose();
  }
}

function startShake(bInd) {
  let shakeDirAttr = "left";
  const ID = `#ans-${bInd}`;
  const shakeInterval = 1000 * (Math.random() * 6 + 2)
  shakeIntervals[bInd] = setInterval(function() {
    if (!$(ID).length || angStage < 2) {
      clearInterval(shakeIntervals[bInd]);
      delete shakeIntervals[bInd];
      return;
    }
    shakeDirAttr = (shakeDirAttr === "left") ? "top" : "left";
    $(ID).animate({ [shakeDirAttr]: "+=3px" }, 10, function() {
      $(this).animate({ [shakeDirAttr]: "-=3px" }, 10);
    });
  }, shakeInterval);
}

//made for questions with multiple 'callSpec' function names
function runCallSpec(spec) {
  if (!spec) return;

  const functions = Array.isArray(spec) ? spec : [spec];

  for (const fnName of functions) {
    const fn = window[fnName];
    if (typeof fn === 'function') {
      try {
        fn();
      } catch (err) {
        console.error(`Error calling function "${fnName}: `, err);
      }
    } else {
      console.warn(`Function "${fnName}" not found on window.`);
    } 
  }
}

console.log("Do NOT read the answers if you know how to read code. I don't like cheaters...")
//The quiz! Do NOT read the answers if you know how to read code. I don't like cheaters...
