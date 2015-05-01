Router.route("/", function() {
	this.render("homepage");
});

Router.route("/home", function() {
	this.render("homepage");
});

Router.route("/pitactoe");

Router.route("/pigeonbingo/:_id", function() {
	this.render("pigeonbingo");
});
Router.route("/pigeonbingo");