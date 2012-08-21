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
		    inputToggle = $("#toggle-all"),

		    init, listen, redraw, toggleAll;

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
		 * Set all event listeners to the task element
		 * 
		 * @param  {Object} obj    Datalist element
		 * @return {undefined}
		 */
		listen = function (obj) {
			var key    = obj.data("key"),
			    data   = app.store.data.get(key).data,
			    toggle = obj.find(".toggle").first(),
			    del    = obj.find(".destroy").first(),
			    label  = obj.find("label").first(),
			    input  = obj.find(".edit").first();

			// add or remove class based on completed status
			obj[data.completed ? "addClass" : "removeClass"]("completed");
			// ensure checkbox is in the proper state
			toggle.attr("checked", (data.completed ? "checked" : ""));

			// toggle complete status
			toggle.on("click", function () {
				app.store.data.set(key, { completed: !data.completed });
			}, "taskToggle");

			// delete task
			del.on("click", function () {
				app.store.data.del(key);
			}, "taskDelete");

			// handle double click
			label.on("dblclick", function () {
				var value = "";
				// set editing state
				obj.addClass("editing");
				// set focus to the input element
				input.focus();
				// cue event listener for blur and keyup
				input.on("blur, keyup", function(event) {
					// make sure a "blur" or ENTER key press occurred
					if (event.keyCode === app.keys.ENTER || event.type === "blur") {
						// ensure the edited value is not empty
						value = input.val().trim();
						if (!value.isEmpty()) {
							// update title and label to new value
							app.store.data.set(key, { title: value });
							label.html(value);
							// remove "editing" class
							obj.removeClass("editing");
							// cleanup - unbind blur and keyup events
							input.un("blur, keyup");
						}
					}
				}, "inputEvents");
			}, "labelDblClick");
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
			listen : listen,
			redraw : redraw
		};
	};

	define(["abaaso"], function (abaaso) { return new Tasks(global[abaaso.aliased]); });
}(this));