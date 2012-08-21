/**
 * todomvc abaaso
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @version prototype
 */
(function (global) {
	"use strict";

	var App = function ($, Router, Input, Tasks, Footer, tpl) {
		var store   = { id : "todo" },
		    records = {},
		    main    = $("#main"),
		    footer  = $("#footer"),

		    init, redraw;

		/**
		 * Initialize the application
		 * 
		 * @return {undefined}
		 */
		init = function () {
			var app = this,
			    obj = {};
			
			if (app.debug) $.log("Initializing application modules");

			// create data store
			$.store(store);
			app.store             = store;
			app.store.data.key    = "uuid";
			app.store.data.source = "data";

			// create a new datalist which ties to the data store
			// it will be automatically updated to reflect the data store
			app.datalist = new $.datalist(main, app.store.data, tpl, { callback: Tasks.listen, order: "completed asc, title" });
			// update id to match base CSS
			// this is to prevent duplicating all the base CSS that come with the todomvc template
			// abaaso.datalist will create a "ul" tag with an id of todo-datalist
			app.datalist.element.id = "todo-list";

			// after data set
			app.store.on("afterDataSet", function (record) {
				if (app.debug) $.log("Data store record updated successfully");
				// add/update current record from records object
				// add update local storage value
				records[record.key] = record;
				localStorage.setItem("records", $.encode(records));
				// redraw UI
				redraw.call(this);
			}, "appAfterDataSet");

			// after data delete
			app.store.on("afterDataDelete", function (record) {
				if (app.debug) $.log("Data store record successfully deleted");
				// remove current record from records object
				// add/update local storage value
				delete records[record.key];
				localStorage.setItem("records", $.encode(records));
				// redraw UI
				redraw.call(this);
			}, "appAfterDataDelete");

			// initialize modules
			Router.init();
			Input.init.call(app);
			Tasks.init.call(app);
			Footer.init.call(app);

			// load data from local storage
			obj = $.json.decode(localStorage.getItem("records"));
			if (obj) $.iterate(obj, function (v, k) { app.store.data.set(k, v.data); });
		};

		/**
		 * Redraw GUI to match current app state
		 * 
		 * @return {undefined}
		 */
		redraw = function () {
			var empty = (this.data.total === 0);
			// add or remove "is-hidden" class based on number of records
			main[empty ? "addClass" : "removeClass"]("is-hidden");
			footer[empty ? "addClass" : "removeClass"]("is-hidden");
			Footer.update();
			Tasks.redraw();
		};

		return {
			datalist : {},
			debug    : false,
			keys     : { ENTER : 13 },
			init     : init,
			store    : store
		};
	};

	define(["abaaso", "router", "input", "tasks", "footer", "text!views/todoTask.html"], function (abaaso, Router, Input, Tasks, Footer, tpl) { return new App(global[abaaso.aliased], Router, Input, Tasks, Footer, tpl); });
}(this));