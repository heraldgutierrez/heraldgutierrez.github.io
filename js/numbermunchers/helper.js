var _GRID_ROWS = $('#grid').data('rows');
var _GRID_COLS = $('#grid').data('columns');
var _BASE_SCORE = 5;

var _MAP = {
	38: 0, 	// Up
	39: 1, 	// Right
	40: 2, 	// Down
	37: 3,	// Left
	32: 4, 	// Spacebar
	13: 4 	// Enter
};

var _DIRECTION = {
	UP:    		0,
	RIGHT: 		1,
	DOWN:  		2,
	LEFT:  		3,
	SELECT: 	4
};

var _GAMETYPES = {
	MULTIPLE: 	0,
	FACTOR: 	1,
	PRIME: 		2,
	RANDOM: 	3
};

var _MIN_SOLUTIONS = 12;

var _NAVIGATION = {
	MENU: 		0,
	GAME: 		1,
	HIGHSCORE: 	2
};