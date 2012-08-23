/**
 * todomvc abaaso
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @version prototype
 */
(function (global) {
	"use strict";

	var Router = function ($) {
		var list, prev,
		
		    init, toggle;

		/**
		 * Initialize the routes
		 * 
		 * @return {undefined}
		 */
		init = function () {
			// set list element
			list = $("#todo-list");
			// enable abaaso route module
			$.route.enabled = true;
			$.route.initial = "all";
			// set routes
			$.route.set("all", toggle);
			$.route.set("active", toggle);
			$.route.set("completed", toggle);
			// initialize the routing
			$.route.init();
		};

		/**
		 * Toggle list view based on hash
		 * 
		 * @param  {String} hash    Hash tag of current route
		 * @return {undefined}
		 */
		toggle = function (hash) {
			var elem = $("a[data-hash='" + hash + "']").addClass("selected");
			if (typeof prev !== "undefined") prev.removeClass("selected");
			// set current element to previous to allow 
			// easy removing of selected class
			prev = elem;
			// Toggle status view handled via CSS classes
			list.attr("class", "todo-" + hash);
		};

		return {
			init : init
		};
	};

	define(["abaaso"], function (abaaso) { return new Router(global[abaaso.aliased]); });
}(this));