/**
 * todomvc vanilla js
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @version prototype
 */
(function (global) {
	"use strict";

	var Tasks = function ($, Task) {
		var app         = {},
		    tasks       = {},
		    list        = $("#todo-list"),
		    inputToggle = $("#toggle-all"),

		    init, add, redraw, remove, toggle, toggleAll, update;

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
		 * Add new task to app
		 * 
		 * @param  {Object} record    Record created or updated
		 * @return {undefined}
		 */
		add = function (record) {
			if (app.debug) $.log("Adding a new task based on new data store record");
			tasks[record.key] = new Task(app, list, record);
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
		 * Destroy task element
		 * 
		 * @param  {String} id    ID of record to remove
		 * @return {undefined}
		 */
		remove = function (id) {
			if (app.debug) $.log("Removing existing task based on data store record id");
			tasks[id].destroy();
			redraw();
		};

		/**
		 * Toggle task state
		 * 
		 * @param  {Object} record    Data record to modify
		 * @return {undefined}
		 */
		toggle = function (record) {
			if (app.debug) $.log("Toggling existing task based on data store record");
			tasks[record.key].toggle(record.data.completed);
		}

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

		/**
		 * Determine the action to take on the record
		 * 
		 * @param  {Object} record    Data record to modify
		 * @return {undefined}
		 */
		update = function (record) {
			if (app.debug) $.log("Determining whether a new record was set or if one was updated");
			if (typeof tasks[record.key] === "undefined") add(record);
			else if (tasks[record.key].completed !== record.data.completed) toggle(record);
			redraw();
		};

		return {
			init   : init,
			remove : remove,
			update : update
		};
	};

	define(["abaaso", "task"], function (abaaso, Task) { return new Tasks(global[abaaso.aliased], Task); });
}(this));