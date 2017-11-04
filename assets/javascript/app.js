	var questions = [];
	var gameLevelCounter = 1; 
	const maxLevel = 7;  
	var questionCounter = 0;
	var answerSelected = false;
	var displayedRandomQuest;
	const timePerQuest = 30;
	var timer = timePerQuest;
	var timerId;


	//soundboard
	var mainTheme = new Audio('assets/audio/theme_main.mp3');
	var background = new Audio('assets/audio/background.mp3');
	var finalAnswer = new Audio('assets/audio/finalAnswer.mp3');
	var loseSound = new Audio('assets/audio/lose.mp3');
	var winSound = new Audio ('assets/audio/win.mp3');
	var grandWinner = new Audio('assets/audio/grandWinner.mp3');

	function Question(triviaQuest, answer0, answer1, answer2, answer3, answerKey, difficultyLevel){
		this.question = triviaQuest;
		this.answers = [];
		this.answers.push(answer0, answer1, answer2,answer3);
		this.correctIndex = answerKey;
		//dificulty levels 1~10
		this.level = difficultyLevel;
		this.selected = false;
	}

// I thought using a class would make making questions a bit easier... In retrospect I don't think its that good as it is hard to read and probably slower.
	questions[0] = new Question('Which insect inspired the term computer bug?','Moth','Cockroach','Fly','Beetle',0,1);
	questions[1] = new Question('What does RAM stand for?', 'Remote Answering Machine',
								'Rotary Attribute Machine','Random Access Memory','Resource Access Memory', 2,1);
	questions[2] = new Question('Who is widely considered the father of computing?', 'Albert Einstein','Charles Babbage',
								'John von Neuman','Georg Cantor', 1,2);	
	questions[3] = new Question('What was the first game console?', 'Super Nintendo','Atari 2600',
								'Intellivision','Magnavox Odyssey', 3,6);
	questions[4] = new Question('One of the first electronic computers, located in Philadelphia, occupied 167 square metres, weighed 27 tons and consumed 150kW of electricity. What was it called?',
								'ENIAC','HAL 9000','XT370','C3PO', 0, 4);
	questions[5] = new Question('Which general term refers to all kinds of harmful software?', 'Virus','Worms','Malware','Spyware', 2, 3);
	questions[6] = new Question('Which is the core component of the computer? It computes every operation you want.',
								'Dynamo','Calculator','RAM','Processor',3,2);
	questions[7] = new Question('Where did the World\'s first Apple retail store open?', 
								'Mall of America, Bloomington, Minnesota', 
								'Sherman Oaks Galleria Mall, Sherman Oaks, California', 
								'King of Prussia Mall, King of Prussia, Pennsylvania',
								'Tyson\'s Corner Mall, McLean, Virginia', 3, 5);
	questions[8] = new Question('At which university was the first computer mouse developed?', 'MIT','Harvard','DeVry Tech','Stanford',3,7);
	questions[9] = new Question('In 1983 Apple introduced an ill-fated and, in some people\'s opinions, ugly computer named LISA. What did the acronym stand for?',
								'Linux is So Awesome','Local Integrated System Architecture','Lithium Interface Synchronous Automation','Living In Sin At Apple',1,5);



/*-------------------------- TIMER FUNCTIONS----------------------*/
	
	function stop(){
		clearInterval(timerId);
	}
	function decrement(){
		timer--;

		$("#timerDiv").text(timer);

		if(timer === 0){
			submit();
			stop();

			$("#timerDiv").text("Times up!");
		}

	}

	function startTimer(){
		timerId = setInterval(decrement, 1000);
	}
	function restartTimer(){
		stop();
		timer = timePerQuest;
		$("#timerDiv").text(timer);
		startTimer();
	}


/*------------------------------Functions for Starting and Displaying Questions Below (Step 1) ---------------------------*/

	function displayQuestion(){
		//Get appropriate level questions for the game level stage.
		var levelArray = [];
		for(let i = 0; i<questions.length; i++){
			if(questions[i].level == gameLevelCounter && questions[i].selected == false){
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
		
		var $questDiv = $('<div>', {'id': 'questionDiv'});
		$questDiv.text(randQuestion.question);
		$('.col-10').append($questDiv);

		//Now append the right questions.
	
		$('.answerDiv').each(function(i){
		var choiceLetters = ['A: ','B: ','C: ','D: '];
		var $ansDiv = $('<p>', {'class':'ans'});
		
		$ansDiv.text(choiceLetters[i] + randQuestion.answers[i]);

		$(this).append($ansDiv);
		$(this).attr('value',i);

		});


	}

	function emptyBoard(){
		answerSelected = false;		
		$('#greenSelect').removeAttr('id');
		$('#orangeSelect').removeAttr('id');
		$('.questionContainer').children('.row').children('.col-10').empty();
		$('.answerDiv').each(function(i){
			$(this).empty();
		});
	}

	function nextQuestion(){
		emptyBoard();
		displayQuestion();
		restartTimer();

		//audio
		background.play();
	}

	/*---------------------- Step 0 & 1 Called Here ---------------------
	Step 0: Hide the necessary divs at the start.
	Step 1: When we hit start, choose a random question and display it. */

	$('.end-screen').css('display','none');
	$('.game-screen').css('display','none');
	$('.start-screen').css('display','block');
	mainTheme.play();
	
	$('#startDiv').click(function(){
		$('.start-screen').css('display','none');
		$('.game-screen').css('display','block');
		nextQuestion();

		//audio
		mainTheme.load();
	});

	/*------------------------Clicking and Answering Functionality Below (Step 2) ---------------------------*/

	function displayGameOver(){
		stop();
		var hLose = $('<p>').text('Game Over!');
		var pLose = $('<p>').text('You got ' + (gameLevelCounter-1) + ' question(s) right!');
		var playAgain = $('<p>').text('Click to play again!');
		$('#insertEnd').append(hLose, pLose, playAgain);
		$('.end-screen').css('display','block');
		$('.game-screen').css('display','none');
		//audio
		background.load();
	}

	function answerIncorrect(){		
		setTimeout(function(){
			$('.answerDiv').each(function(i){
				if ($(this).attr('value') == questions[displayedRandomQuest].correctIndex){
					$(this).attr('id','greenSelect');
				}
				//audio
				finalAnswer.load();
				
			});
		}, 2000);
		setTimeout(function(){
			displayGameOver();
			loseSound.play();
		}, 4000);
	}

	function displayGameWin(){
		stop();
		var pWin = $('<p>').text('You got all ' + maxLevel + ' questions right!');
		var playAgain = $('<p>').text('Click to play again!');
		$('#insertEnd').append(pWin, playAgain);
		$('.end-screen').css('display','block');
		$('.game-screen').css('display','none');
		//audio
		background.load();
		grandWinner.play();
	}

	function answerCorrect(){
		setTimeout(function(){
			$('#orangeSelect').attr('id','greenSelect');
			//audio
			finalAnswer.load();
			winSound.play();
		}, 2000);
		if(gameLevelCounter > maxLevel){
			setTimeout(function(){
				displayGameWin();
				winSound.load();
			}, 5500);
			
		}else{
			setTimeout(function(){
				nextQuestion();
				winSound.load();
			}, 5500);
		}
	}

	function submit(){
		//TO DO: Stop timer since anwer is submitted
		var userSelected = $('#orangeSelect').attr('value');

		//audio
		finalAnswer.play();

		if(userSelected == questions[displayedRandomQuest].correctIndex){ //Its correct! Show correct on the results page.
			gameLevelCounter++;
			answerCorrect();
			
		}else{
			answerIncorrect();

		}
	}

	
/*------------------------------------Step 2 Called Below --------------------------------*/ 
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
			$('#getAnswer').css('display','block'); //Opens the getAnswer modal. If they click yes, submit answer.
		}, 150);
		
	});
	/*-------------------Step 2A: When an answer is selected, get answer. -------*/
	$('#yes').click(function(){
		stop();
		submit();
		$('#getAnswer').css('display','none');
	});
	$('#close').click(function(){
		$('#getAnswer').css('display','none');
	});
	$(window).click(function(){
		$('#getAnswer').css('display','none');
	});

/*---------------------------------Reset------------------------*/

	function emptyInfo(){
		$('#insertEnd').empty();
	}

	function reset(){
		emptyInfo();
		gameLevelCounter = 1; 
		for (let i = 0;i<questions.length; i++){
			questions[i].selected = false;
		}
		$('.end-screen').css('display','none');
		$('.start-screen').css('display','block');
		mainTheme.play();
	}

	$('.info').click(function(){
		loseSound.load();
		grandWinner.load();
		reset();
	});
