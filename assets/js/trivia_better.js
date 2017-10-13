"use strict";

$(function() { 
	
	console.log("page loaded");

	$("#loading-screen").hide();
	$("#question-screen").hide();
	$("#answer-screen").hide();
	$("#results-screen").hide();

	$("#start-button").on("click", function(){
		game.setState(1);
	});
	$(".answer-btn").on("click", function(e){
		timer.clear();
		if($(this).attr("correct") === "true"){
			game.answeredCorrectly = true;
		} else {
			game.answeredCorrectly = false;
		}		
		game.setState(4);
	});	
});

var apiQuestions;

var game = {
	answeredCorrectly: false,
	numCorrect: 0,
	currentQuestion: 0,
	state: 0,
	stateText: [
		"Title Screen", 			 //0
		"Loading Questions",  //1
		"Questions Loaded",  //2
		"Asking Question", 	//3
		"Showing Answer",  //4
		"Showing Results" //5
	],
	getState: function(){
		return this.stateText[this.state];
	},
	setState: function(s){
		if(this.state !== s){
			this.state = s;
			console.log("Entering state:", this.getState());

					 if(s === 0){ changeState_TitleScreen();}
			else if(s === 1){ changeState_LoadingQuestions();}
			else if(s === 2){ changeState_QuestionsLoaded();}
			else if(s === 3){ changeState_AskingQuestion();}
			else if(s === 4){ changeState_ShowingAnswer();}
			else if(s === 5){ changeState_ShowingResults();}

		} else {
			console.log("Already in state", s);
		}
	}
}; // End Game Obj

var timer = {
	initalmiliseconds: 0,
	miliseconds: 0,
	tickLength: 1000,
	intervalId: null,
	callBackFN: null,
	setTimer: function(seconds, callBack){
		console.log("setTimer this:", this);
		timer.initialmiliseconds = seconds * 1000;
		timer.miliseconds = timer.initialmiliseconds;
		timer.callBackFN = callBack;
		timer.intervalId = setInterval(timer.tick, timer.tickLength);
		$("#timer-bar").css("width", "100%");
	},
	tick: function(){
		timer.miliseconds -= timer.tickLength;		
		console.log(timer.miliseconds, pctTimeLeft);
		if(timer.miliseconds > 0) {
			var pctTimeLeft = Math.floor(100*((timer.miliseconds-1000)/(timer.initialmiliseconds-1000)));
			$("#timer-bar").css("width", pctTimeLeft+"%");
		} else {
			clearInterval(timer.intervalId);
			$("#timer-bar").css("width", "0%");			
			timer.callBackFN();
		}		
	},
	clear: function(){
		clearInterval(timer.intervalId);
	}
};

function changeState_ShowingAnswer(){ //State: 4

	var qNum = game.currentQuestion;
	$("#question-screen").hide();

	if (game.answeredCorrectly === true) {
		game.numCorrect++;
		$("#answer-text").html("You are Correct! " + apiQuestions[qNum].correct_answer);
	} else {
		$("#answer-text").html("Nope, it was " + apiQuestions[qNum].correct_answer);
	}

	$("#answer-screen").show();
	
	timer.setTimer(2, function(){
		game.currentQuestion++;
		game.currentQuestion === apiQuestions.length ? game.setState(5) : game.setState(3);
		$("#answer-screen").hide();		
	});
}

function changeState_TitleScreen(){ //State: 0
	game.answeredCorrectly = false;
	game.numCorrect = 0;
	game.currentQuestion = 0;
	$("#results-screen").hide();
	$("#title-screen").show();
}

function changeState_ShowingResults(){ //State: 5
	$("#answer-screen").hide();
	$("#results-text").html("You got " + game.numCorrect + " of " + apiQuestions.length);
	$("#results-screen").show();
	timer.setTimer(3, function(){
		game.setState(0);		
	});
}

function changeState_LoadingQuestions(){ //State: 1
	$("#title-screen").hide();
	$("#loading-screen").show();
	getQuestionsFromAPI();
}

function changeState_QuestionsLoaded(){ //State: 2
	$("#loading-screen").hide();
	game.setState(3);
}

function changeState_AskingQuestion(){ //State: 3
	var qNum = game.currentQuestion;
	var qBtn = 1;
	var correctAnswerPos = Math.floor(4 * Math.random() - 1);

	if(correctAnswerPos === -1) { // if correct answer is first, append it
		$("#answer-" + qBtn).attr("correct", true).html(apiQuestions[qNum].correct_answer);
		qBtn++;
	}

	for(var i=0; i<3; i++){

		$("#answer-" + qBtn).attr("correct", false).html(apiQuestions[qNum].incorrect_answers[i]);
		qBtn++;

		if(correctAnswerPos === i) { // if correct answer comes next, append it
			$("#answer-" + qBtn).attr("correct", true).html(apiQuestions[qNum].correct_answer);
			qBtn++;
		}
	}
	$("#question-number").html("Question " + (qNum + 1) + ":");
	$("#question-text").html(apiQuestions[qNum].question);
	$("#question-screen").show();
	timer.setTimer(7, function(){
		console.log("inline");
		game.answeredCorrectly = false;
		game.setState(4);
	});
}

function getQuestionsFromAPI(){ // AJAX call to Trivia API	
	$.ajax({
	  url: "https://opentdb.com/api.php?amount=3&type=multiple",
	  method: "GET"
	}).done(function(response) { 
		apiQuestions = response.results;
		console.log(response.results);
		game.setState(2);
	});
}

function changeOfStateHandler(s){
	if(s === 0){ changeState_TitleScreen(); }
	else if(s === 1){ changeState_LoadingQuestions(); }
	else if(s === 2){ changeState_QuestionsLoaded(); }
	else if(s === 3){ changeState_AskingQuestion(); }
	else if(s === 4){ changeState_ShowingAnswer(); }
	else if(s === 5){ changeState_ShowingResults(); }
	else { changeState_error(); }
}