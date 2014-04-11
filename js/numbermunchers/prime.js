// the first 200 prime number
var _PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223];

function Prime() {
	this.solutions = 0;		// number of solutions left for the current objective
	this.prime = 2;			// current objective
}

// change the header:
// current level
// and current objective
Prime.prototype.displayHeading = function(level) {
	$('#level').html(level);
	$('#mode').html('Primes');
}

// generate and populate the board with values that correspond with the current level
Prime.prototype.generateBoard = function(board, level) {
	var tempBoard = board;				// game board
	var rows = board.length;			// number of rows
	var columns = board[0].length;		// number of columns
	var number;							// value used in the board

	this.prime = level + 1;				// increase prime (current objective)
	// this.prime++;

	for (var i = 0; i < rows; i++) {
		for(var j = 0; j < columns; j++) {
			// mark outer (empty) tiles with -1 (invalid values)
			if(i == 0 || i == rows - 1 || j == 0 || j == columns - 1)
				tempBoard[i][j] = -1;
			else {
				// value is a random number from 1 to highest prime for the level
				number = Math.ceil(Math.random() * _PRIMES[this.prime]); 
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
		tempBoard = this.addMoreSolutions(tempBoard);

	return tempBoard;
}

// we have less than 12 solutions, therefore we are going to add more
Prime.prototype.addMoreSolutions = function(board) {
	var more = _MIN_SOLUTIONS;		// number of new solutions to add
	var ranX, ranY, ranVal;			// random x, y, and value
	var row = board.length - 2;		// size of the game board
	var col = board[0].length - 2;	// size of the game board

	var tempBoard = board;			// game board
	var oldVal;						// current value on the board

	var index = 0;
	// var max = _PRIMES.indexOf(this.prime);
	// console.log('Max : ' + max);

	while(index < more) {
		ranX = Math.ceil(Math.random() * row);		// select a random row
		ranY = Math.ceil(Math.random() * col);		// select a random column
		ranVal = _PRIMES[ Math.floor(Math.random() * (this.prime + 1)) ];
		oldVal = tempBoard[ranX][ranY];				// get current value from the board at the random x and y location

		// only change the current value of the tile at random x and y if it is not a solution
		if(!this.isSolution(oldVal)) {
			tempBoard[ranX][ranY] = ranVal;
			this.solutions++;
			index++;
		}
	}

	return tempBoard;
}

// a solution has been found, reduce solution count
Prime.prototype.reduceSolutionsLeft = function() {
	this.solutions--;
}

// how many solutions are left to be found
Prime.prototype.solutionsLeft = function() {
	return this.solutions;
}

// is the current value a valid solution for the objective
Prime.prototype.isSolution = function(value) {
	return _PRIMES.indexOf(value) != -1;
}