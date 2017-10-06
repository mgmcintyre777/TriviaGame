"use strict";

$(function() { 
	
	console.log("page loaded");

	$("#loading-screen").hide();
	$("#question-screen").hide();

	$("#start-button").on("click", function(){
		game.setState(1);
	});
	 
});

var intervalId;
var apiQuestions;

var game = {
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
			console.log("Enter state:", this.getState())
			changeOfStateHandler(this.state);
			console.log("Completed state Change")
		} else {
			console.log("Already in state", s);
		}
	}
}; // End Game Obj

function changeOfStateHandler(s){
			 if(s === 0){ changeState_TitleScreen(); }
	else if(s === 1){ changeState_LoadingQuestions(); }
	else if(s === 2){ changeState_QuestionsLoaded(); }
	else if(s === 3){ changeState_LoadingQuestions(); }
	else if(s === 4){ changeState_LoadingQuestions(); }
	else if(s === 5){ changeState_LoadingQuestions(); }
	else 						{ changeState_LoadingQuestions(); }
}

function changeState_TitleScreen(){

}

function changeState_LoadingQuestions(){
	$("#title-screen").hide();
	getQuestionsFromAPI();
}

function changeState_QuestionsLoaded(){

}

function displayQuestion(index){

	var timerElement = $("<p id='timer'>").html(triviaGame.timer + " seconds")
	$(".jumbotron").append(timerElement);		

	var questionElement = $("<h4 class='question'>");
	questionElement.html(apiQuestions[index].question);

	$(".jumbotron").append(questionElement);

	var correctAnswerElement = $("<p class='choice'>").attr("isCorrect", true).css('cursor','pointer').html(apiQuestions[index].correct_answer);
	var correctAnswerPos = Math.floor(4 * Math.random() - 1);

	if(correctAnswerPos === -1) { // if correct answer is first, append it
		$(".jumbotron").append(correctAnswerElement);
	}

	for(var i=0; i<3; i++){

		var wrongAnswerElement = $("<p class='choice'>").attr("isCorrect", false).css('cursor','pointer').html(apiQuestions[index].incorrect_answers[i]);
		$(".jumbotron").append(wrongAnswerElement);

		if(correctAnswerPos === i) { // if correct answer comes next, append it
			$(".jumbotron").append(correctAnswerElement);
		}		
	}

	$(".choice").on("click", function(e){
		triviaGame.showAnswerScreen();		
		displayAnswer($(this).attr("isCorrect"));
	});
}



function getQuestionsFromAPI(){ // AJAX call to Trivia API	
	$.ajax({
	  url: "https://opentdb.com/api.php?amount=50&type=multiple",
	  method: "GET"
	}).done(function(response) { 
		apiQuestions = response.results;
		game.setState(2);
	});
}

