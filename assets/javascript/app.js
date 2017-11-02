	var questions = [];
	var gameLevel = 1; 
	var questionCounter = 0;
	var answerSelected = false;
	var displayedRandomQuest;

	function Question(triviaQuest, answer0, answer1, answer2, answer3, answerKey, difficultyLevel){
		this.question = triviaQuest;
		this.answers = [];
		this.answers.push(answer0, answer1, answer2,answer3);
		this.correctIndex = answerKey;
		//dificulty levels 1~5
		this.level = difficultyLevel;
		this.selected = false;
	}

	questions[0] = new Question('Which insect inspired the term computer bug?','Moth','Cockroach','Fly','Beetle',0,1);
	questions[1] = new Question('What does RAM stand for?', 'Remote Answering Machine','Rotary Attribute Machine','Random Access Memory','Resource Access Memory', 2,1);
	questions[2] = new Question('Who is widely considered the father of computing?', 'Albert Einstein','Charles Babbage','John von Neuman','Georg Cantor', 1,2);	
	questions[3] = new Question('What was the first game console?', 'Super Nintendo','Atari 2600','Intellivision','Magnavox Odyssey', 3,4);



	function displayQuestion(){
		

		//Get appropriate level questions for the game level stage.
		var levelArray = [];
		for(let i = 0; i<questions.length; i++){
			if(questions[i].level == gameLevel && questions[i].selected == false){
				levelArray.push(questions[i]);
			}
		}

		//Pick a random question from the array.
		let rand = Math.floor(Math.random()*levelArray.length);
		var randQuestion = levelArray[rand];

		//Make sure that this question cannot be selected again.
		if(questions.indexOf(randQuestion) > -1){
			questions[questions.indexOf(randQuestion)].selected = true;
		}
		
		displayedRandomQuest = questions.indexOf(randQuestion); //Saves the original index of the current showed question.
		
		//Make the right div, display question.
		$('.questionContainer').children('.row').children('.col-12').empty();
		var $questDiv = $('<div>', {'id': 'questionDiv'});
		$questDiv.text(randQuestion.question);
		$('.questionContainer').children('.row').children('.col-12').append($questDiv);

		//Now append the right questions.
		$('.questionContainer').children('.row').children('.answerDiv').each(function(i){
			$(this).empty();
			var choiceLetters = ['A: ','B: ','C: ','D: '];
			var $ansDiv = $('<p>', {'class':'ans', 'value':i});
			$ansDiv.text(choiceLetters[i] + randQuestion.answers[i]);
			$(this).append($ansDiv);

		});
	}

	function run(){
		displayQuestion();
	}

	function submit(){
		if(false){ //If timer runs out this will be come true.
			//displayDefeat();
		}else{
			var userSelected = $('#orangeSelect').children('.ans').attr('value');
			if(userSelected == questions[displayedRandomQuest].correctIndex){ //Its correct! Show correct on the results page.
				$('#orangeSelect').attr('id','#greenSelect');
			}
		}
	}
	
	//Step 1: When we hit start, choose a random question and display it.
	$('#startDiv').click(function(){
		run();
	});



	//Step 2: When a div is clicked, ask for final answer. 
	$('.answerDiv').click(function(){
		if(answerSelected == false){
			$(this).attr('id','orangeSelect');
			answerSelected = true;
		}else{
			$('.answerDiv').each(function(){
				$(this).removeAttr('id');
			});
			$(this).attr('id','orangeSelect');
		}

	
		setTimeout(function(){
			var finAnswer = confirm('Final Answer?');
			if(finAnswer){
				submit();
			}
		}, 100);
		
	});
