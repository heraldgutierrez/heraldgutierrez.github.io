function Character(isMuncher, id) {
	this.isMuncher = isMuncher;		// is the character a muncher or troggle (enemy)?

	// set movement limits
	// if a muncher, only movable area is the game area
	// if troggle, movable area is game area + 1 tile in each direction (to enter and exit)
	this.x_min = isMuncher ? 2 : 1;	
	this.x_max = isMuncher ? 7 : 8;
	this.y_min = isMuncher ? 2 : 1;
	this.y_max = isMuncher ? 6 : 7;

	// start at a random position
	this.randomPosition();

	this.element = id;		// which html element does this character belong to
	this.resetLives();		// reset number of lives

	this.moving = false;
};

// move the character in the direction given
Character.prototype.move = function(direction) {
	if(!this.moving) {
		// the character can only move within its bound area
		switch(direction) {
			case _DIRECTION.UP:
				if(this.y > this.y_min)
					this.y--;
				break;
			case _DIRECTION.RIGHT:
				if(this.x < this.x_max)	
					this.x++;
				break;
			case _DIRECTION.DOWN:
				if(this.y < this.y_max)
					this.y++;
				break;
			case _DIRECTION.LEFT:
				if(this.x > this.x_min)
					this.x--;
				break;
		}

		this.moveCharacter();
	}
};

// add the class of a tile to the character, this will animate the movement
Character.prototype.moveCharacter = function() {
	this.moving = true;
	var self = this;

	var timeout = window.setTimeout(function() {
		self.moving = false;
		window.clearTimeout(timeout);
	}, 175);
};

// move character to a random position
Character.prototype.randomPosition = function() {
	var row = Math.floor(Math.random() * (this.x_max - this.x_min) + this.x_min);
	var col = Math.floor(Math.random() * (this.y_max - this.y_min) + this.y_min);

	if(this.isMuncher) {
		this.x = row;
		this.y = col;
	} else {
		var which = Math.floor(Math.random() * 2) == 0;

		// starting at a row (top or bottom)
		if(which) {
			this.x = row;
			this.y = (row < 5) ? this.y_min : this.y_max;

			if((this.x == this.x_min && this.y == this.y_min) || (this.x == this.x_max && this.y == this.y_min)) {
				this.x = this.x_min + 1;
			} else if((this.x == this.x_min && this.y == this.y_max) || (this.x == this.x_max && this.y == this.y_max)){
				this.x = this.x_max - 1;
			}

			this.next_direction = (row < 5) ? _DIRECTION.DOWN : _DIRECTION.UP;
		} else {
		// start at a column (left of right)
			this.x = (col < 4) ? this.x_min : this.x_max;
			this.y = col;

			if((this.x == this.x_min && this.y == this.y_min) || (this.x == this.x_max && this.y == this.y_min)) {
				this.y = this.y_min + 1;
			} else if((this.x == this.x_min && this.y == this.y_max) || (this.x == this.x_max && this.y == this.y_max)){
				this.y = this.y_max - 1;
			}

			this.next_direction = (col < 4) ? _DIRECTION.RIGHT : _DIRECTION.LEFT;
		}
	}
};

// return current position of the character
Character.prototype.getPosition = function() {
	return { x: this.x, y: this.y };
};

// return the characters element html id
Character.prototype.getElementID = function() {
	return this.element;
};

Character.prototype.resetLives = function() {
	this.lives = 4;				// number of lives before a game over
};

// character died, lose a life
Character.prototype.died = function() {
	this.lives--;
};

// return how many lives are left
Character.prototype.getLivesLeft = function() {
	return this.lives;
};

Character.prototype.isMuncher = function() {
	return this.isMuncher;
};

Character.prototype.getDirection = function() {
	return this.next_direction;
};

Character.prototype.setDirection = function(direction) {
	this.next_direction = direction;
};