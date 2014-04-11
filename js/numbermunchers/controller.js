function KeyboardInputManager() {
	this.events = {};
	this.inMenu = true;

	this.listen();
};

// add new event handlers
KeyboardInputManager.prototype.on = function (event, callback) {
	if (!this.events[event]) {
		this.events[event] = [];
	}
	
	this.events[event].push(callback);
};

// call even handlers
KeyboardInputManager.prototype.emit = function (event, data) {
	var callbacks = this.events[event];
	if (callbacks) {
		callbacks.forEach(function (callback) {
			callback(data);
		});
	}
};

// listen for keydown inputs, and perform the correct action
KeyboardInputManager.prototype.listen = function() {
	var self = this;

	// on key down event
	document.addEventListener('keydown', function(event) {
		var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
		var direction = _MAP[event.which];

		if(!modifiers) {
			event.preventDefault();
			self.emit('action', { action : direction, key : event.which });
		}
	});
};