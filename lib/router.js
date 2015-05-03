Router.route("/", function() {
	this.render("homepage");
});

Router.route("/home", function() {
	this.render("homepage");
});

Router.route("/pitactoe");

Router.route("/pigeonbingo/:_id", function() {
	var bingo = Bingo.findOne({_id: this.params._id});
	this.render("bingogame", {data: bingo});
});
Router.route("/pigeonbingo");