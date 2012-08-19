/**
 * todomvc abaaso
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @version prototype
 */
(function (global) {
	"use strict";

	var Task, create, events,
	    app = {},
	    ENTER = 13,
	    $, template;

	Task = function (a, target, record) {
		app = a;
		// set default value
		this.id        = record.key;
		this.target    = target;
		this.title     = record.data.title || "";
		this.completed = record.data.completed || false;
		// elements to be populated after the template is applied
		this.element    = null;
		this.btnToggle  = null;
		this.label      = null;
		this.input      = null;
		this.btnDestroy = null;
		// create a new task on init
		create.call(this);
	};

	/**
	 * Create a new task
	 * @return {undefined}
	 */
	create = function () {
		// create <li> tag
		this.element = this.target.append("li");
		// append template to element and replace placeholders
		this.element.html(template.replace(/{{title}}/g, this.title));
		// append new elements to variables
		this.btnToggle  = this.element.find(".toggle").first();
		this.label      = this.element.find("label").first();
		this.input      = this.element.find(".edit").first();
		this.btnDestroy = this.element.find(".destroy").first();
		// setup all events
		events.call(this);
		// toggle state on load
		this.toggle(this.completed);
	};

	/**
	 * Event handlers
	 * 
	 * @return {undefined}
	 */
	events = function () {
		// reference back to "this"
		var that = this;

		// handle double click
		this.label.on("dblclick", function () {
			var value = "";
			// set editing state
			that.element.addClass("editing");
			// set focus to the input element
			that.input.focus();
			// cue event listener for blur and keyup
			that.input.on("blur, keyup", function(event) {
				// make sure a "blur" or ENTER key press occurred
				if (event.keyCode === ENTER || event.type === "blur") {
					value = that.input.val();
					// update title and label to new value
					app.store.data.set(that.id, { title: value });
					that.label.html(value);
					// remove "editing" class
					that.element.removeClass("editing");
					// cleanup - unbind blur and keyup events
					that.input.un("blur, keyup");
				}
			}, "inputEvents");
		}, "labelDblClick");

		// handle toggle button
		// and update completed status in data store
		this.btnToggle.on("click", function () {
			app.store.data.set(that.id, { completed: !that.completed });
		}, "taskToggle");
		// handle delete button
		// and delete element in data store
		this.btnDestroy.on("click", function () {
			app.store.data.del(that.id);
		}, "taskDestroy");
	};

	/**
	 * Destroy element
	 * @return {undefined}
	 */
	Task.prototype.destroy = function () {
		this.element.destroy();
	};

	/**
	 * Toggle element state between completed and active
	 * 
	 * @param  {Boolean} completed     Current state of data store task
	 * @return {undefined}
	 */
	Task.prototype.toggle = function (completed) {
		this.completed = completed;
		// add or remove class based on completed status
		this.element[this.completed ? "addClass" : "removeClass"]("completed");
		// ensure checkbox are in the proper state
		// specifically for "toggle all" scenario
		this.btnToggle.attr("checked", (this.completed ? "checked" : ""));
	};

	define(["abaaso", "text!views/todoTask.html"], function (abaaso, tpl) { 
		$        = global[abaaso.aliased]; 
		template = tpl;
		return Task; 
	});
}(this));