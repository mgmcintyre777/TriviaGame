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
		console.log($(this).attr("correct"));
		// Answer Logic
	});
	
});

var intervalId;
var apiQuestions;

var game = {
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
			changeOfStateHandler(this.state);
		} else {
			console.log("Already in state", s);
		}
	}
}; // End Game Obj

function changeOfStateHandler(s){
	if(s === 0){ changeState_TitleScreen(); }
	else if(s === 1){ changeState_LoadingQuestions(); }
	else if(s === 2){ changeState_QuestionsLoaded(); }
	else if(s === 3){ changeState_AskingQuestion(); }
	else if(s === 4){ changeState_ShowingAnswer(); }
	else if(s === 5){ changeState_ShowingResults(); }
	else { changeState_error(); }
}

function changeState_TitleScreen(){ //State: 0

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
}

function getQuestionsFromAPI(){ // AJAX call to Trivia API	
	$.ajax({
	  url: "https://opentdb.com/api.php?amount=10&type=multiple",
	  method: "GET"
	}).done(function(response) { 
		apiQuestions = response.results;
		console.log(response.results);
		game.setState(2);
	});
}