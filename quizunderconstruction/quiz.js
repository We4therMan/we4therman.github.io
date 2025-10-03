// cookie helper functions
function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

function deleteCookie(name, path = '/', domain = '') {
  let expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  let cookieString = `${name}=; ${expires}; path=${path}`;
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  document.cookie = cookieString;
}

//sound variables
//these const variables are what cause the two 'AudioContext not allowed to start' errors. The errors are benign.
const mus = new Tone.ToneAudioBuffers({
  urls: {
    intro: "aud/mus_intro.ogg",
    tutorial: "aud/mus_tutorial.ogg",
    firstfew: "aud/mus_thefirstfew_0.ogg",
    firstfew_w: "aud/mus_thefirstfew_w.ogg",
    //interlude: "aud/mus_interlude.ogg", //TODO write this song lol
    jonas: "aud/mus_jonas.ogg",
  },
  onload: () => {
    console.log("Music buffers loaded");
  }
});

const sfx = new Tone.ToneAudioBuffers({
  urls: {
    wrong: "aud/snd_wrong.ogg",
    correct: "aud/snd_correct.ogg",
    ambivalent: "aud/snd_ambivalent.ogg",
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
    console.log("sfx buffers loaded");
        //start button appears after audio is loaded (prevents buffer errors)
    $("#startButton").show();
    $("#loading").hide();
  }
});

let musPlayer;
let sfxPlayer;
let distortion;
var musVol = parseFloat(getCookie("musVol")) || -5;
var sfxVol = parseFloat(getCookie("sfxVol")) || -5;

//question variables
var questions = quiz.questions
const interludes = quiz.interludes
const endings = quiz.endings
var currentQInd;
var currentIntInd;

const indOf = {
  questions: () => currentQInd,
  interludes: () => currentIntInd,
  routes: () => [questionPrefix,'questions',currentQInd],
  endings: () => currentEnd,
}

//intro variables
introPlayed = getCookie("introPlayed");
playedBefore = getCookie("playedBefore");

//score variables
var correctScore = 0;
var angScore = 0;
var angStage = 0;
var failing = false;
var playedAnswers = [];
var timeOuts = 0;
var easyMode = false;

//route variables
//old key code to be deleted as I have a better system nowm (need to test first)
var burgerOn = false;
var cumOn = false;
var yairOn = false;
//'-Ans' names of special answers in quiz-data.js
// const specialKeys = ['burgerAns', 'cumAns','yairAns'];
//tracks which route player is on
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
    musPlayer.buffer = mus.get("intro");
    //change this to false for intro, maybe initQuiz should activate looper when looping music actually starts playing
    musPlayer.loop = false;
    musPlayer.volume.value = musVol;
    musPlayer.mute = (musVol <= -30.0) ? true : false;
    musPlayer.start();
    console.log("Music player initialized")

    //initiate sfx player
    sfxPlayer = new Tone.Player().toDestination();
    sfxPlayer.volume.value = sfxVol;
    sfxPlayer.mute = (sfxVol <= -30.0) ? true : false;
    console.log("SFX player initialized")

    //initiate effect plugins
    distortion = new Tone.Distortion(0.5).toDestination();

    $("#startButton").hide();
    $("#settingsButton").show()

    //POWERFUL: the most frequent updater. Most useful for keeping angerstage updated at all times.
    $(document).on('click', function() {
      showAnger(angStage);
    })

    setTimeout(() => {
      playIntro();
      // initQuiz(); //replace with playIntro() once that's done
    }, 10)
  });

  $("#nextButton").on("click", function(){
    clearTimeout(buttonAnsTimer);
    nextEvent();
  });

  $("#musVolume").on("input", function() {
    musVol = parseFloat(this.value);
    setCookie("musVol", musVol);
    musPlayer.volume.value = musVol;
    musPlayer.mute = (musVol <= -30.0) ? true : false;
  }).attr("value",musVol);

  $("#sfxVolume").on("input", function() {
    sfxVol = parseFloat(this.value);
    setCookie("sfxVol", sfxVol);
    sfxPlayer.volume.value = sfxVol;
    sfxPlayer.mute = (sfxVol <= -30.0) ? true : false;
  }).attr("value",sfxVol);

  $("#settingsButton").on("click", function() {
    $(".sliders, #studioTag").toggle(500);
  });
})

function playIntro() {
  $(".quizWelcome, #quizContainer").hide();
  $("#nextButton").hide();
  $("#intContainer").show();
  $("#skipButton").show()
  var {
    introTxt,
    tutorialTxt,
    firstTimeTxt,
  } = quiz.intro;

  var fanfareTimeouts = [];
  //play intro fanfare and play intro animation
  introTxt.forEach((text,ind) => {
    const fTimeoutID = setTimeout(() => {
      p = $("<p />")
        .html(text)
        .attr({
          "id": `intro${ind}`,
          "class": "introTxt"
        })
        .css({"opacity": 0, "font-size": "48px"});
      $("#intContainer").append(p)
      $(`#intro${ind}`)
        .animate({fontSize: "64px", opacity: 1.00}, 12000);
      if (ind == 2) $("#skipButton").text("Start")
    }, 13000 * ind);
    fanfareTimeouts.push(fTimeoutID);
  });

  $("#skipButton").on("click", function() {
    fanfareTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    fanfareTimeouts = []; // Optional: clear array
    $("#intContainer").empty();
    switchMusic("tutorial");

    $("#skipButton").off("click").on("click", function() {
      setCookie("playedBefore",true)
      initQuiz()
    }).show();
    //at this point, do not play tutorial if replaying same session, and don't play firsttimetxt if has played before
    if (!playedBefore) {
      tutorialTxt = tutorialTxt.concat(firstTimeTxt);
      $(this).hide();
    }
    let tutInd = 0
    $("#intContainer").html(tutorialTxt[tutInd]);
    $("#nextButton").show().off("click").on("click", function(){
      tutInd++;
      if ($("#intContainer:contains('experience')").length > 0) {
        $("#quizContainer").show();
        questions = quiz.intro.questions;
        loadQuestion(0);
      }
      $("#intContainer").html(tutorialTxt[tutInd]);
      
      if (tutInd == tutorialTxt.length-1) {
        $("#nextButton").off("click").on("click",function(){
          //playedBefore cookie is updated each time tutorial is finished (should also each time tutorial is skipped)
          setCookie("playedBefore",true)
          initQuiz();
        }).html("YES OK START PLEASE.")
      }
    });
  });
}

  

function initQuiz() {
  console.log("Initializing quiz");
  questions = quiz.questions
  switchMusic("firstfew",1);
  //reset variables
  correctAnswers = 0, currentQInd = 0, currentIntInd = 0, angScore = 0, angStage = 0, timeOuts = 0;
  resetScoreboard();
  $(".quizWelcome").hide();
  $("#quizContainer").show();
  //reassign button function
  $("#nextButton").off("click").on("click", function(){
    clearTimeout(buttonAnsTimer);
    nextEvent();
  }).text("Next");
  loadQuestion(currentQInd);
}

function resetScoreboard() {
  questionPrefix = '';
  answersGiven = [];
  correctAnswers = 0;
  currentQInd = 0;
  currentIntInd = 0;
  angScore = 0;
  angStage = 0;
  timeOuts = 0;
  return
} 

//setTimeout(() => {}, 2000);

function loadQuestion(currentQInd){
  ansClicks = 0
  allAnswersLoaded = false;
  console.log(`initializing question ${currentQInd+1}`);
  ce = (questionPrefix) ? "routes" : "questions"
  $("#quizContainer, #result").show();
  $("#quizContainer, #result").empty();
  $("#nextButton, #skipButton, #intContainer").hide();
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
  let timeLim = (easyMode) ? (1.5 * timeLimRaw) : timeLimRaw; //time limit longer in easy mode
  let currRouteAns = q.routeAns || []; //if there are no route answers, an empty array will be checked instead
  // console.log(q.routeAns, currRouteAns)
  let currAmbAns = q.ambAnswer || [];
  ticRate = (sus) ? 1000 : 200; //slow tics for high suspense
  sfxPlayer.buffer = sfx.get("tic"); //load tic to player

  runCallSpec(q.callSpec); //call special event function if qData has one

  let answersGenerated = 0;

  currAnsSet.forEach((currAns,ansInd) => { //answer options and indices
    let currAng = currAngSet[ansInd]; //anger values
    let currRep = currRepSet[ansInd]; //replies
    // let isCorrect = currCorrAns.includes(ansInd);
    let correctness = (currCorrAns.includes(ansInd)) ? "correct" : "wrong";
    if (currAmbAns.includes(ansInd)) correctness = "ambivalent";
    let isRoute = currRouteAns.includes(ansInd);
    // console.log("route ans, ind, is route?",currRouteAns,ansInd,isRoute)
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
      generateAns(ansInd, correctness, currAns, currAng, currRep, isRoute);
      if (!ansClicks) sfxPlayer.start(); //play tic
    }, delay); //todo: make timeout 0 if skip option is true
    btnTimeouts.push(buttonAnsTimer);
  });

  musPlayer.playbackRate = (sus) ? 0.90 : 1.0;

  $("#question")
    .html(`${questionPrefix}${(currentQInd + 1).toString()}. ${currQuestion}`)
    .css({"color": "white", "font-size": "48px"});
  genTimer(timeLim);
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
    let currAmbAns = q.ambAnswer || [];
    let correctness = (currCorrAns.includes(ansInd)) ? "correct" : "wrong";
    if (currAmbAns.includes(ansInd)) correctness = "ambivalent";
    let isRoute = currRouteAns.includes(ansInd)
    // let currRep = qData(currentQInd)[2];
    // let currAng = qData(currentQInd)[3];
    // let isCorrect = qData(currentQInd)[4].includes(ansInd);
    // let isSpecil = specilIs.includes(ansInd);
    // let specilK = specilKs.find(k => specil[k] === ansInd);
    generateAns(ansInd, correctness, currAns, currAng, currRep, isRoute);
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

function generateAns(bInd,correctness,ans,ang,rep,isRoute) {
  //add both classes if route, otherwise only the regular answer class
  const classes = isRoute ? 'multChoice routeAns' : 'multChoice';
  var button = $('<button />') 
    .addClass(classes)
    .attr("id",`ans-${bInd}`)
    .html(ans)
    .data({ans,correctness,ang,rep})
    .on("click", function(){
      let data = $(this).data();
      result(correctness,data.ang,data.rep);
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
};

//handle answer choice
function result(correctness,ang,rep) {
  ansClicks = 1;
  if (!allAnswersLoaded) stopGenAns();
  clearInterval(timeCounter);
  angScore += ang;

  quickSFX(correctness);
  if (correctness == "correct") {
    pulseBG("#007d00");
    correctScore++;
  } else if (correctness == "wrong") {
    pulseBG("#7d0400");
  } else if (correctness == "ambivalent") {
    pulseBG("#9e7400ff");
  }

  // pulseBG(isCorrect ? "#007d00" : "#7d0400");
  // if (isCorrect) correctScore++;
  // quickSFX(isCorrect ? "correct" : "wrong")
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
        $("#question").html("OK, I don't know what you're trying to achieve here. \
          I'm making you start over. DON'T DO IT AGAIN.<br><br>GAME OVER");
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
      sfxPlayer.playbackRate = 0.6;
      // musPlayer.connect(distortion)
      // TODO: make angry versions of songs and sfx
  }
}


function nextEvent() {
  let evInd = indOf[ce]?.(); //select index of current event
  //sometsimes it's quiz.questions[1].nextEvent
  //i want quiz.routes.y[1].nextEvent
  // let ne = quiz[ce][evInd].nextEvent //check if ce has nextEvent label and store it
  let ne = Array.isArray(evInd)
    ? quiz[ce][evInd[0]]?.[evInd[1]]?.[evInd[2]]?.nextEvent
    : quiz[ce][evInd]?.nextEvent;
  console.log("NEXT EVENT DATA",ce,evInd,ne);

  //if no label, load next question (updates q index)
  if (!ne) return loadQuestion(++currentQInd); 
  //if interlude, load interlude and update index
  else if (ne === "interlude") return loadInterlude(currentIntInd++); 
  //ending is always main ending unless we are in a route
  else if (ne === "ending") return endQuiz((questionPrefix) ? questionPrefix : "main");
}

function gameOver() {
  $("#question").text("GAME OVER").css({"color": "red", "font-size": "76px"});
  $("result").css({"color": "red"});
  $("#nextButton").off("click").on("click", function(){
    if (playedBefore) initQuiz();
    else playIntro();
  }).text("START OVER");
  musPlayer.playbackRate = 0.25;

  quickSFX("gameover");
};

//use question prefix to choose ending
function endQuiz(ending) {
  ce = "endings"
  $("#quizContainer, #intContainer, #question, #result").empty();
  $("#quizContainer, #nextButton, #readyButton").hide();
  $("#intContainer").show();
  sfxPlayer.buffer = sfx.get("blip");
  const answersGiven = playedAnswers.length
  const scorecent = (100 * (correctScore / answersGiven)).toFixed(1)

  //todo: add route handler (probably needs a new variable up top)

  var introTxt = endings[ending]['intro'];
  var scoreTxt = endings[ending]['score'];
  var feedbackTxt = endings[ending]['feedback'][letterGrade(scorecent)];

  scoreTxt[0] = scoreTxt[0].replace("ANSWERS_GIVEN", answersGiven);
  scoreTxt[1] = scoreTxt[1].replace("SCORE", correctScore);
  scoreTxt[2] = scoreTxt[2].replace("SCORE_PERCENT", scorecent);

  const endingTxt = [introTxt,scoreTxt,letterGrade(scorecent),feedbackTxt].flat().filter(Boolean);
  console.log(endingTxt,feedbackTxt);

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
  if (score == 100.) return "S";
  if (score >= 85)   return "A";
  if (score >= 70)   return "B";
  if (score >= 60)   return "C";
  if (score >= 50)   return "D";
  if (score >= 5)    return "F";
  return "Super F";
}

///music player handler
//I think i fixed it I'm pretty sure........ yay
function switchMusic(toPlay,fadeOut=0,fadeIn=0,loopAud=true,newPlayerCallback = () => {}) {
    /**
   * Switches audio file that 'musPlayer' is playing.
   *
   * @param {String} toPlay - audio filename to play (format 'mus_{title}').
   * @param {Number} fadeOut - fade-out time of current audio in seconds. Defaults to 0 (music cuts out).
   * @param {Number} fadeIn - fade-in time of new audio in seconds. Defaults to 0 (music cuts in).
   * @param {Boolean} loopAud - whether to loop new audio. Defaults to true.
   * @param {Callback} onStop - onstop callback for player if non-looping audio ends (defaults to an empty function).
   */
  //mp shorthand for readability
  const mp = musPlayer;

  mp.volume.rampTo(-Infinity,fadeOut) ;

  mp.onstop = () => {
    mp.buffer = mus.get(toPlay);
    mp.fadeIn = fadeIn;
    mp.loop = loopAud;
    musPlayer.volume.value = musVol
    mp.onstop = newPlayerCallback;
    mp.start();
    console.log("new music started");
  };

  setTimeout(() => {
      mp.stop();
  }, fadeOut * 1000);
}

//for sounds that play in quick succession without using an existing player
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
    //if anger stage drops, stop shaking
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

