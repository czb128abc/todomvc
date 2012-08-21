/**
 * todomvc abaaso
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @version prototype
 */
(function (global) {
	"use strict";

	var Tasks = function ($) {
		var app         = {},
		    tasks       = {},
		    list        = $("#todo-list"),
		    inputToggle = $("#toggle-all"),

		    init, redraw, toggleAll;

		/**
		 * Initialize the list module
		 * 
		 * @return {undefined}
		 */
		init = function () {
			app = this;
			if (app.debug) $.log("Initializing todo list module");
			// handle click event for toggle all checkbox
			inputToggle.on("click", toggleAll, "toggleAll");
		};

		/**
		 * Handle changing data - currently only toggleAll button
		 * 
		 * @return {undefined}
		 */
		redraw = function () {
			var remaining = app.store.data.find(false, "completed").length;
			// adjust "toggle all" button based on remaining items
			if (remaining === 0) inputToggle.checked = true;
			else inputToggle.checked = false;
		};

		/**
		 * Toggle all tasks state
		 * @return {undefined}
		 */
		toggleAll = function () {
			var checked = this.checked,
			    records = app.store.data.find(!checked, "completed");

			// loop through each record to switch state
			records.each(function (record) {
				app.store.data.set(record.key, { completed: checked });
			});
		};

		return {
			init   : init,
			redraw : redraw
		};
	};

	define(["abaaso"], function (abaaso) { return new Tasks(global[abaaso.aliased]); });
}(this));