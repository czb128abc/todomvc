/**
 * todomvc abaaso
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @version prototype
 */
(function (global) {
	"use strict";

	var Footer = function ($, tplRemaining, tplCompleted) {
		var app          = {},
		    btnCompleted = $("#clear-completed"),
		    left         = $("#todo-count"),

		    init, events, update;

		/**
		 * Initialize the footer module
		 * 
		 * @return {undefined}
		 */
		init = function () {
			app = this;
			if (app.debug) $.log("Initializing todo footer module");
			// setup event listeners
			events();
		};

		/**
		 * All custom event listeners
		 * 
		 * @return {undefined}
		 */
		events = function () {
			// listen for "completed" button click event
			btnCompleted.on("click", function () {
				var records = app.store.data.find(true, "completed");
				if (app.debug) $.log("Clear completed button clicked");
				// delete each record marked as "completed"
				records.each(function (record) {
					if (app.debug) $.log("Attempting to delete record: " + record.key);
					app.store.data.del(record.key);
				});
			}, "clearCompleted");
		}

		/**
		 * Update footer items
		 * 
		 * @return {undefined}
		 */
		update = function () {
			var data      = app.store.data,
			    completed = data.find(true, "completed").length,
			    remaining = data.total - completed;

			if (app.debug) $.log("Updating footer stats");
			// update items left count
			left.html(tplRemaining.replace("{{remaining}}", remaining).replace("{{s}}", ((remaining === 1) ? "" : "s")));
			// show/hide clear completed button based on items to clear
			btnCompleted[completed === 0 ? "addClass" : "removeClass"]("is-hidden");
			btnCompleted.html(tplCompleted.replace("{{completed}}", completed));
		};

		return {
			init   : init,
			update : update
		};
	};

	define(["abaaso", "text!views/todoRemaining.html", "text!views/todoCompleted.html"], function (abaaso, tplRemaining, tplCompleted) { return new Footer(global[abaaso.aliased], tplRemaining, tplCompleted); });
}(this));