function GameBoard() {
	this.rows = _GRID_ROWS; 				// number of rows
	this.columns = _GRID_COLS;				// number of columns

	this.level = 0;							// current game level
	this.solutions = 0;						// number of solutions left to clear the objective

	// board which will contain the values for the objective
	this.board = new Array(_GRID_ROWS);		
	for (var i = 0; i < _GRID_ROWS; i++) {
		this.board[i] = new Array(_GRID_COLS);
	}	

	// game mode: Multiplication, Factors, or Prime Numbers
	this.gameMode;
};

// generate the board with values for the objective
// and display the board after
GameBoard.prototype.generateBoard = function() {
	this.level++;
	this.board = this.gameMode.generateBoard(this.board, this.level);
	this.gameMode.displayHeading(this.level);
};

// validate tile if it passes the current objective
GameBoard.prototype.validateTile = function(x, y) {
	var value = this.board[x-1][y-1];					// value to be checked
	var isSolution = this.gameMode.isSolution(value);	// check if value is a solution
	var valid = null;

	if(isSolution) {
		// if a solution, reduce solution count
		this.gameMode.reduceSolutionsLeft();
		valid = true;
	} else if(value != -1 && !isSolution) {
		valid = false;

		this.errorMsg = 'Sorry, ' + value + ' is not a ' + $('#mode').html();
	}

	// mark off tile with -1 so we know its been checked already
	this.board[x-1][y-1] = -1;

	return valid;
};


// if the level has been completed, increase level and generate a new board
GameBoard.prototype.levelComplete = function() {
	return this.gameMode.solutionsLeft() == 0;
};

// which game type are we playing?
GameBoard.prototype.setGameType = function(type) {
	var mode = null;
	var gametype = type;

	if(gametype == _GAMETYPES.RANDOM)
		gametype = Math.floor( Math.random() * 3 );

	switch(gametype) {
		case _GAMETYPES.MULTIPLE:
			mode = new Multiple();
			break;
		case _GAMETYPES.FACTOR:
			mode = new Factor();
			break;
		case _GAMETYPES.PRIME:
			mode = new Prime();
			break;
		default:
			mode = new Multiple();
			break;
	}

	this.level = 0;
	this.gameMode = mode;
};

GameBoard.prototype.addScore = function() {
	return (_BASE_SCORE * this.level);
};

GameBoard.prototype.getErrorMsg = function() {
	return this.errorMsg;
};