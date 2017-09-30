var intervalId;
var apiQuestions;

var triviaGame = {

	timer: 0,
	currentQuestion: 0,

	newGame: function(){
		clearInterval(intervalId);
		getQuestions();
	},

	nextQuestion: function(){
		clearInterval(intervalId);
		triviaGame.timer = 15;
		intervalId = setInterval(triviaGame.tick, 1000);	
		displayQuestion(triviaGame.currentQuestion);
		triviaGame.currentQuestion++;
	},

	showAnswerScreen: function(){
		clearInterval(intervalId);
		triviaGame.timer = 2;
		intervalId = setInterval(triviaGame.tock, 1000);
	},

	tick: function(){
		triviaGame.timer--;
		if(triviaGame.timer == -1) {
			displayAnswer();
		} else {
			$("#timer").html(triviaGame.timer + " seconds");
		}		
	},

	tock: function(){
		triviaGame.timer--;
		if(triviaGame.timer == -1) {
			triviaGame.nextQuestion();
		} else {
			$("#timer").html(triviaGame.timer + " seconds");
		}	
	}
}

triviaGame.newGame();

function getQuestions(){ // AJAX call to Trivia API 
	
	$(".jumbotron").empty();
	$(".jumbotron").html("Loading Questions ...")

	$.ajax({
	  url: "https://opentdb.com/api.php?amount=50&type=multiple",
	  method: "GET"
	}).done(function(response) { 
		apiQuestions = response.results;
		triviaGame.nextQuestion()
	});
}

function displayQuestion(index){

	$(".jumbotron").empty();
		
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

function displayAnswer(isCorrect){
	if(isCorrect === 'true'){
		$(".jumbotron").empty();
		$(".jumbotron").html("Correct!");			
	} else {
		$(".jumbotron").empty();
		$(".jumbotron").html("Incorrect!");
	}
}