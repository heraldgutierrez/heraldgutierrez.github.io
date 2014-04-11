function Factor() {
	this.solutions = 0;		// number of solutions left for the current objective
	this.factor = 2;		// current objective
};

// change the header:
// current level
// and current objective
Factor.prototype.displayHeading = function(level) {
	$('#level').html(level);
	$('#mode').html('Factors of ' + this.factor);
};

// generate and populate the board with values that correspond with the current level
Factor.prototype.generateBoard = function(board, level) {
	var tempBoard = board;				// game board
	var rows = board.length;			// number of rows
	var columns = board[0].length;		// number of columns
	var number;							// value used in the board

	this.factor = level + 2;			// increase factor (current objective)

	for (var i = 0; i < rows; i++) {
		for(var j = 0; j < columns; j++) {
			// mark outer (empty) tiles with -1 (invalid values)
			if(i == 0 || i == rows - 1 || j == 0 || j == columns - 1)
				tempBoard[i][j] = -1;
			else {
				// value is a random number from 1 to factor
				number = Math.ceil(Math.random() * this.factor); 
				tempBoard[i][j] = number;

				// if the number is a solution, increment solution count
				if(this.isSolution(number)) {
					// console.log(this.solutions + ': ' + number);
					this.solutions++;
				}
			}
		}
	}

	// if there are less than 12 solutions,
	// we need to add more solutions to the board
	if(this.solutions < _MIN_SOLUTIONS)
		tempBoard = this.addMoreSolutions(tempBoard, this.factor);

	return tempBoard;
};

// we have less than 12 solutions, therefore we are going to add more
Factor.prototype.addMoreSolutions = function(board, factor) {
	var more = _MIN_SOLUTIONS;		// number of new solutions to add
	var ranX, ranY, ranVal;			// random x, y, and value
	var row = board.length - 2;		// size of the game board
	var col = board[0].length - 2;	// size of the game board

	var tempBoard = board;			// game board
	var oldVal;						// current value on the board

	var index = 0;
	var factorArr = this.getAllFactors(factor);
	var length = factorArr.length;

	while(index < more) {
		ranX = Math.ceil(Math.random() * row);		// select a random row
		ranY = Math.ceil(Math.random() * col);		// select a random column
		ranVal = factorArr[Math.floor(Math.random() * length)];
		oldVal = tempBoard[ranX][ranY];				// get current value from the board at the random x and y location

		// only change the current value of the tile at random x and y if it is not a solution
		if(!this.isSolution(oldVal)) {
			tempBoard[ranX][ranY] = ranVal;
			this.solutions++;
			index++;
		}
	}

	return tempBoard;
};

Factor.prototype.getAllFactors = function(number) {
	var factors = new Array();

	for(var i = 1; i <= number; i++) {
		if(this.isSolution(i))
			factors.push(i);
	}

	return factors;
};

// a solution has been found, reduce solution count
Factor.prototype.reduceSolutionsLeft = function() {
	this.solutions--;
};

// how many solutions are left to be found
Factor.prototype.solutionsLeft = function() {
	return this.solutions;
};

// is the current value a valid solution for the objective
Factor.prototype.isSolution = function(value) {
	return (this.factor % value) == 0;
};