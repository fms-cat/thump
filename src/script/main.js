import Vue from "vue";
import App from "./app.vue";

new Vue( {
  el: "#vue",
	render: ( createElement ) => {
		return createElement( App );
	}
} );