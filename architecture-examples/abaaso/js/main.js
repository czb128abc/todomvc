/**
 * todomvc abaaso
 *
 * @author Fabien Doiron <fabien.doiron@gmail.com>
 * @version prototype
 */

(function (global) {
	"use strict";

	// shortcut alias
	require.config({
		paths : {
			"abaaso" : "lib/abaaso/abaaso",
			"text"   : "lib/require/text"
		}
	});

	// kick start the app
	require(["abaaso", "app"], function (abaaso, App) {
		// create a namespace for the app
		global["todo"] = App;
		// for development - outputs debug logs
			// App.debug = true;
		// initialize the application
		App.init();
	});

}(this));