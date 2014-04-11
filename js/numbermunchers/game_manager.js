function GameManager() {
	this.html = new Html();

	// game board
	this.board = new GameBoard();

	// keyboard input
	this.inputManager = new KeyboardInputManager();
	this.inputManager.on('action', this.keyboardAction.bind(this));

	// game characters
	this.muncher = new Character(true, '#muncher');
	this.troggle1 = new Character(false, '#enemy1');
	// this.troggle2 = new Character(false, '#enemy2');

	// loading screen is not being displayed
	this.isLoading = false;			
	
	// start a new game
	this.restart();
	// this.startGame(0);
	// this.navigation = _NAVIGATION.GAME;


	this.charactersInPlay = new Array();
	this.charactersInPlay.push(this.muncher);
	this.charactersInPlay.push(this.troggle1);
	// this.charactersInPlay.push(this.troggle2);

	// this.troggles = new Array();
	// this.troggles.push(this.troggle1);
	// this.troggles.push(this.troggle2);

	
};

// Start a new game with resetted settings
GameManager.prototype.restart = function() {
	this.html.displayElement('.main-screen', true);			// show menu navigation
	this.navigation = _NAVIGATION.MENU;						// set navigation type to menu
	this.currentMenuSelect = 0;								// current menu selection is 0 (Multiples)
	this.html.changeMenuSelection(this.currentMenuSelect);	// highlight current selection
	this.muncher.resetLives();								// reset munchers lives
};

// reset the game board
GameManager.prototype.startGame = function(gametype) {
	this.score = 0;											// reset score
	this.board.setGameType(gametype);						// set game type
	this.generateBoard();									// generate a new board with the new game type
};

// perform an action based on the input given
GameManager.prototype.keyboardAction = function(input) {
	// if on the menu navigation
	// can only move 'Up', 'Down', or make a selection
	if(this.navigation == _NAVIGATION.MENU) {
		switch(input.action) {
			case _DIRECTION.UP:
				if(this.currentMenuSelect > 0)
					this.currentMenuSelect--;
				break;
			case _DIRECTION.DOWN:
				if(this.currentMenuSelect < 3)
					this.currentMenuSelect++;
				break;
			case _DIRECTION.SELECT:
				this.startGame(this.currentMenuSelect);		// create a new game with the highlighted game mode
				this.navigation = _NAVIGATION.GAME;			// set navigation controls to control the game

				var self = this;
				var timeout = window.setTimeout(function() {
					self.html.displayElement('.main-screen', false); 	// hide menu screen
					window.clearTimeout(timeout);			// clear timeout
				}, 1000);

				break;
		}

		// change highlighted menu navigation selection
		this.html.changeMenuSelection(this.currentMenuSelect);

	} else if(this.navigation == _NAVIGATION.GAME) {
	// input now controls the game/muncher
		this.move(this.muncher, input.action);
	}
};


/*****************************************************
	Character Related Actions
******************************************************/
GameManager.prototype.startAI = function() {
	var self = this;
	var troggle;

	if(this.navigation == _NAVIGATION.GAME) {
		var timeout = window.setTimeout(function() {
			// console.log('Starting AI...');
			self.moveAI(self.troggle1);
			window.clearTimeout(timeout);			// clear timeout
		}, 5000);
	} 
};


// move a troggle/enemy in a random direction
GameManager.prototype.moveAI = function(character) {
	var self = this;

	// console.log('Move AI called...');

	var timeout = window.setTimeout(function() {
		// console.log('Moving AI');
		var randomDirection = character.getDirection();			// if it's the first move, move onto the board from the outside

		// inital movement to go onto the board
		if(randomDirection != -1) {
			character.setDirection(-1);
		} else {
		// generate a random move
			randomDirection = Math.floor( Math.random() * 4 );
		}
		
		self.move(character, randomDirection);					// move character

		window.clearTimeout(timeout);							// clear timeout

		var id = character.getElementID();						// get characters id


		// we only move the ai when were in the game
		if(self.navigation == _NAVIGATION.GAME) {
			// if the character is still on the game area, keep moving
			if(self.characterOnBoard(character))
				self.moveAI(character);							// keep moving
			else {
			// else: character went outside game area, reset character
				var timeout2 = window.setTimeout(function() {
					self.html.displayElement(id, false);		// hide the character element
					self.removeCharacter(character);			// remove the characters position class
					character.randomPosition();					// generate a new position
					self.displayCharacter(character);			// display the character

					self.html.displayElement(id, true);			// show the character element
					window.clearTimeout(timeout2);				// clear timeout

					self.startAI();								// call start AI to move the AI again
				}, 500);
			}
		} else {
		// we're no longer playing, stop moving AI
			self.html.displayElement(id, false);			
			self.removeCharacter(character);
			character.randomPosition();
			self.displayCharacter(character);

			var timeout2 = window.setTimeout(function() {
				self.html.displayElement(id, true);
				window.clearTimeout(timeout2);			// clear timeout
			}, 500);
		}
	}, 2500);
};

// given a character (muncher or troggle), move in a direction
// if direction is a space: clear tile, and validate tile
// else: remove old position css, move character in the direction, and then add new position css
GameManager.prototype.move = function(character, direction) {
	var position = character.getPosition();

	if(!this.isLoading) {
		if(direction == _DIRECTION.SELECT) {
			this.html.clearTile(position);			// clear tile value
			this.validateTile(position);			// validate tile value
		} else {
			this.removeCharacter(character);		// remove old position class
			character.move(direction);				// move character to new position
			this.displayCharacter(character);		// display character at new position
			this.checkCollision(character);
		}
	}
};

// check if two characters hit each other
// if one of the characters is the muncher, they lose a life
// else if it's another troggle, the one that gets moved is deleted
GameManager.prototype.checkCollision = function(character) {
	var tempChar;							// the other character
	var tempPos;							// the other characters position
	var tempID;								// the other characters element id
	var charPos = character.getPosition();	// characters position
	var charID = character.getElementID();	// characters element id

	// for all the characters in play
	for(var i = 0; i < this.charactersInPlay.length; i++) {
		tempChar = this.charactersInPlay[i];							// get the other characters in play
		tempID = tempChar.getElementID();								// get its id

		// if they arent the same characters
		if(tempID != charID) {
			tempPos = tempChar.getPosition();							// get the other characters position

			// compare both positions to see if theyre on the same tile
			if(charPos.x == tempPos.x && charPos.y == tempPos.y) {		

				// if either characters are the muncher, lose a life
				if(character.isMuncher || tempChar.isMuncher) {			
					this.muncherDied('Oh no, you were eaten by a Troggle.');

					// this.html.displayElement(tempID, false);
					// this.removeCharacter(tempChar);
					// tempChar.randomPosition();
					// this.displayCharacter(tempChar);

					// var self = this;
					// var timeout = window.setTimeout(function() {
					// 	self.html.displayElement(tempID, true);
					// 	window.clearTimeout(timeout);			// clear timeout
					// }, 500);
				} else {
				// else its another troggle/enemy, so this one gets deleted
					this.html.displayElement(charID, false);
					this.removeCharacter(character);
					character.randomPosition();
					this.displayCharacter(character);

					var self = this;
					var timeout = window.setTimeout(function() {
						self.html.displayElement(charID, true);
						window.clearTimeout(timeout);			// clear timeout
					}, 500);
				}
			}// if(x == x && y == y)
		}// if(ID != ID)
	}// for
};

// given a character, remove its position class so it can move when a new position class is added
GameManager.prototype.removeCharacter = function(character) {
	var position = character.getPosition();
	var myClass = getPositionClass(position);
	this.html.removeClass(character.getElementID(), myClass);
};

// given a character, display then on the board using their position
GameManager.prototype.displayCharacter = function(character) {
	var position = character.getPosition();
	var myClass = getPositionClass(position);
	this.html.addClass(character.getElementID(), myClass);
};

// when a user validates an incorrect answer, they lose a life
// if they run out of lives, its game over
GameManager.prototype.muncherDied = function(string) {
	this.muncher.died();						// reduce life by 1
	if(this.muncher.getLivesLeft() < 1)	{		// if no more lives, end game
		alert('Game Over');
		this.displayLoadingScreen(true);

		var self = this;
		// after load screen is done, reset load screen to original position so it can be used again
		var timeout = window.setTimeout(function() {
			self.restart();						// show menu
			window.clearTimeout(timeout);		// clear timeout	
		}, 1000);
	} else {
		var str = '\n' + this.muncher.getLivesLeft() + ' Lives Left!';
		alert(string + str);
	}
};


/*****************************************************
	Gameboard Related Actions
******************************************************/
// generate and display the game board
// also display the muncher
GameManager.prototype.generateBoard = function() {
	// display load screen used in between levels
	this.isLoading = true;
	this.displayLoadingScreen(true);

	var self = this;

	// need a timeout, generate board when load screen is half way done
	var timeout = window.setTimeout(function() {
		self.board.generateBoard();				// generate new board
		self.html.displayBoard(self.board);		// display new board
		self.removeCharacter(self.muncher);		// remove position class
		self.muncher.randomPosition();			// new random position for muncher
		self.displayCharacter(self.muncher);	// display muncher
		self.displayCharacter(self.troggle1);


		self.removeCharacter(self.troggle1);	// remove position class
		self.troggle1.randomPosition();			// new random position for muncher
		self.displayCharacter(self.troggle1);	// display muncher

		self.startAI();							// start moving AI
		window.clearTimeout(timeout);			// clear timeout
	}, 1000);
};

// given a position on the board, check if it is a valid solution
// if(valid): add score, and check if level is complete
// else if(not null): not a solution
// else: checking -1 which is an empty tile
GameManager.prototype.validateTile = function(position) {
	var valid = this.board.validateTile(position.y, position.x);
	if(valid) {
		this.score += this.board.addScore();		// increment score
		this.html.displayScore(this.score);			// display updated score
		this.levelComplete();						// check if level is complete
	} else if(valid != null){
		var str = this.board.getErrorMsg(); 
		this.muncherDied(str);							// muncher lost a life
	}
};

// if the current level is complete, generate a board for the next level
GameManager.prototype.levelComplete = function() {
	if(this.board.levelComplete())
		this.generateBoard();
};

// display load screen in between levels
GameManager.prototype.displayLoadingScreen = function(show) {
	this.html.displayLoading(show);

	if(show) {
		var self = this;

		// after load screen is done, reset load screen to original position so it can be used again
		var timeout = window.setTimeout(function() {
			self.isLoading = false;					// done loading
			self.displayLoadingScreen(false);		// reset loading position
			window.clearTimeout(timeout);			// clear timeout
		}, 3000);
	}
};

// check if a character is on the playing area of the board
GameManager.prototype.characterOnBoard = function(character) {
	var position = character.getPosition();
	var x = position.x;
	var y = position.y;
	var onBoard = true;

	// check if the characters position is on the outer tiles outside the game board
	if(x == 1 || x == _GRID_COLS || y == 1 || y == _GRID_ROWS)
		onBoard = false;

	return onBoard;
};

// get the class used for moving a character
function getPositionClass(position) {
	return 'position-' + position.x + '-' + position.y;
}

