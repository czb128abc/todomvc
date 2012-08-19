/**
 * todomvc abaaso
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @version prototype
 */
(function (global) {
	"use strict";

	var Input = function ($) {
		var app   = {},
		    input = $("#new-todo"),
		    ENTER = 13,

		    create, init;

		/**
		 * Initialize the module
		 * 
		 * @return {undefined}
		 */
		init = function () {
			app = this;
			if (app.debug) $.log("Initializing todo input module");
			// Set keyup listeners
			input.on("keyup", create, "inputKeyup");
		};

		/**
		 * Create a new todo item
		 * 
		 * @param  {KeyboardEvent} event    Keyboard event from the keyup
		 * @return {undefined}
		 */
		create = function (event) {
			var val = this.val().trim();
			if (event.keyCode === ENTER && !val.isEmpty()) {
				if (app.debug) $.log("Enter key pressed");
				// Add to data store
				app.store.data.set($.genId(), { title: val, completed: false });
				// clear input value
				input.val("");
			}
		};

		return {
			init : init
		};
	};

	define(["abaaso"], function (abaaso) { return new Input(global[abaaso.aliased]); });
}(this));